#@+leo-ver=5-thin
#@+node:felix.20230505220205.157: * @file src/importers/xml.ts
"""The @auto importer for the xml language."""
import re
from typing import List, Optional, Tuple
from leo.core import leoGlobals as g
from leo.core.leoCommands import Commands as Cmdr
from leo.core.leoNodes import Position
from leo.plugins.importers.linescanner import Importer
#@+others
#@+node:felix.20230505220205.158: ** class Xml_Importer(Importer)
class Xml_Importer(Importer):
    """The importer for the xml lanuage."""

    def __init__(self, c: Cmdr, tags_setting: str = 'import_xml_tags') -> None:
        """Xml_Importer.__init__"""
        # Init the base class.
        super().__init__(c, language='xml')
        self.tags_setting = tags_setting
        self.start_tags = self.add_tags()
        # A closing tag decrements state.tag_level only if the top is an opening tag.
        # self.stack: List[str] = []  # Stack of tags.
        # self.void_tags = ['<?xml', '!doctype']
        # self.tag_warning_given = False  # True: a structure error has been detected.

    #@+others
    #@+node:felix.20230505220205.159: *3* xml_i.add_tags
    def add_tags(self) -> List[str]:
        """Add items to self.class/functionTags and from settings."""
        c, setting = self.c, self.tags_setting
        aList = c.config.getData(setting) or []
        aList = [z.lower() for z in aList]
        return aList
    #@+node:felix.20230505220205.160: *3* xml_i.compute_headline
    def compute_headline(self, s: str) -> str:
        """xml and html: Return a cleaned up headline s."""
        m = re.match(r'\s*(<[^>]+>)', s)
        return m.group(1) if m else s.strip()
    #@+node:felix.20230505220205.161: *3* xml_i.get_intro
    def get_intro(self, row: int, col: int) -> int:
        """
        Return the number of preceeding lines that should be added to this class or def.
        """
        return 0
    #@+node:felix.20230505220205.162: *3* xml_i.new_starts_block
    def new_starts_block(self, i: int) -> Optional[int]:
        """
        Return None if lines[i] does not start a tag.

        Otherwise, return the index of the first line tag.
        """
        lines, states = self.lines, self.line_states
        prev_state = states[i - 1] if i > 0 else self.state_class()
        this_state = states[i]
        if lines[i].isspace() or this_state.context:
            return None
        if this_state.level > prev_state.level:
            return i + 1
        return None
    #@+node:felix.20230505220205.163: *3* xml.preprocess_lines
    # Match two adjacent elements. Don't match comments.
    adjacent_tags_pat = re.compile(r'(.*?)(<[^!].*?>)\s*(<[^!].*?>)')

    # Match the tag name of the element.
    tag_name_pat = re.compile(r'</?([a-zA-Z]+)')

    def preprocess_lines(self, lines: List[str]) -> List[str]:
        """
        Xml_Importer.preprocess_lines.

        Ensure that closing tags are followed by a newline.
        """

        def repl(m: re.Match) -> str:
            """
                Split lines, adding leading whitespace to the second line.
                *Don't* separate tags if the tags open and close the same element.
            """
            m2 = self.tag_name_pat.match(m.group(2))
            m3 = self.tag_name_pat.match(m.group(3))
            tag_name2 = m2 and m2.group(1) or ''
            tag_name3 = m3 and m3.group(1) or ''
            same_element = (
                tag_name2 == tag_name3
                and not m.group(2).startswith('</')
                and m.group(3).startswith('</')
            )
            lws = g.get_leading_ws(m.group(1))
            sep = '' if same_element else '\n' + lws
            return m.group(1) + m.group(2).rstrip() + sep + m.group(3)

        result_lines = []
        for i, line in enumerate(lines):
            s = re.sub(self.adjacent_tags_pat, repl, line)
            result_lines.extend(g.splitLines(s))
        return result_lines
    #@+node:felix.20230505220205.164: *3* xml_i.update_level
    ch_pattern = re.compile(r'([\!\?]?[\w\_\.\:\-]+)', re.UNICODE)

    def update_level(self, i: int, level: int, line: str) -> Tuple[int, int]:
        """
        XML_Importer.update_level.  Overrides Importer.update_level.

        Update level at line[i] and return (i, level).
        """
        if line[i] != '<':
            return i + 1, level  # Make progress.
        # Scan the tag.
        end_tag = line.find('</', i) == i
        i += (2 if end_tag else 1)  # Ensure progress, whatever happens.
        m = self.ch_pattern.match(line, i)
        if not m:  # pragma: no cover (missing test)
            # All other '<' characters should have had xml/html escapes applied to them.
            self.error(f"missing tag in position {i} of {line!r}")
            return i, level
        tag = m.group(0).lower()
        i += len(tag)
        if tag in self.start_tags:
            level = level - 1 if end_tag else level + 1
        return i, level
    #@-others
#@-others

def do_import(c: Cmdr, parent: Position, s: str) -> None:
    """The importer callback for xml."""
    Xml_Importer(c).import_from_string(parent, s)

importer_dict = {
    'extensions': ['.xml',],
    'func': do_import,
}
#@@language python
#@@tabwidth -4

#@-leo
