#@+leo-ver=5-thin
#@+node:felix.20230505220205.151: * @file src/importers/typescript.ts
"""The @auto importer for TypeScript."""
import re
from leo.core import leoGlobals as g  # Required.
from leo.core.leoCommands import Commands as Cmdr
from leo.core.leoNodes import Position
from leo.plugins.importers.linescanner import Importer
#@+others
#@+node:felix.20230505220205.152: ** class TS_Importer(Importer)
class TS_Importer(Importer):

    #@+<< define non-function patterns >>
    #@+node:felix.20230505220205.153: *3* << define non-function patterns >>
    non_function_patterns = (

        re.compile(r'catch\s*\(.*\)'),
    )
    #@-<< define non-function patterns >>
    #@+<< define function patterns >>
    #@+node:felix.20230505220205.154: *3* << define function patterns >>
    kinds = r'(async|public|private|static)'
    #
    # The pattern table. Order matters!
    function_patterns = (
        (1, re.compile(r'(interface\s+\w+)')),  # interface name
        (1, re.compile(r'(class\s+\w+)')),  # class name
        (1, re.compile(r'export\s+(class\s+\w+)')),  # export class name
        (1, re.compile(r'export\s+enum\s+(\w+)')),  # function name
        (1, re.compile(r'export\s+const\s+enum\s+(\w+)')),  # function name
        (1, re.compile(r'export\s+function\s+(\w+)')),  # function name
        (1, re.compile(r'export\s+interface\s+(\w+)')),  # interface name
        (1, re.compile(r'function\s+(\w+)')),  # function name
        (1, re.compile(r'(constructor).*{')),  # constructor ... {
        # kind function name
        (2, re.compile(r'%s\s*function\s+(\w+)' % kinds)),
        # kind kind function name
        (3, re.compile(r'%s\s+%s\s+function\s+(\w+)' % (kinds, kinds))),
        # Bare functions last...
        # kind kind name (...) {
        (3, re.compile(r'%s\s+%s\s+(\w+)\s*\(.*\).*{' % (kinds, kinds))),
        # name (...) {
        (2, re.compile(r'%s\s+(\w+)\s*\(.*\).*{' % kinds)),
        # #1619: Don't allow completely bare functions.
        # (1,  re.compile(r'(\w+)\s*\(.*\).*{')),
            # name (...) {
    )
    #@-<< define function patterns >>

    def __init__(self, c: Cmdr) -> None:
        """The ctor for the TS_ImportController class."""
        # Init the base class.
        super().__init__(c, language='typescript')

    #@+others
    #@+node:felix.20230505220205.155: *3* ts_i.add_class_names
    def add_class_names(self, p: Position) -> None:
        """Add class names to headlines for all descendant nodes."""

    #@+node:felix.20230505220205.156: *3* ts_i.compute_headline
    def compute_headline(self, s: str) -> str:
        """Return a cleaned up headline s."""
        s = s.strip()
        # Don't clean a headline twice.
        if s.endswith('>>') and s.startswith('<<'):  # pragma: no cover (missing test)
            return s
        # Try to match patterns.
        for group_n, pattern in self.function_patterns:
            m = pattern.match(s)
            if m:
                return m.group(group_n)
        # Final cleanups, if nothing matches.
        for ch in '{(=':
            if s.endswith(ch):
                s = s[:-1].strip()
        s = s.replace('  ', ' ')
        s = s.replace(' (', '(')
        return g.truncate(s, 100)
    #@-others
#@-others

def do_import(c: Cmdr, parent: Position, s: str) -> None:
    """The importer callback for typescript."""
    TS_Importer(c).import_from_string(parent, s)

importer_dict = {
    'extensions': ['.ts',],
    'func': do_import,
}
#@@language python
#@@tabwidth -4
#@-leo
