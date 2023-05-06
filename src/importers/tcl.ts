#@+leo-ver=5-thin
#@+node:felix.20230505220205.144: * @file src/importers/tcl.ts
"""
The @auto importer for the tcl language.

Created 2017/06/15 by the `importer;;` abbreviation.
"""
import re
from typing import Optional
from leo.core.leoCommands import Commands as Cmdr
from leo.core.leoNodes import Position
from leo.plugins.importers.linescanner import Importer
#@+others
#@+node:felix.20230505220205.145: ** class Tcl_Importer
class Tcl_Importer(Importer):
    """The importer for the tcl lanuage."""

    def __init__(self, c: Cmdr) -> None:
        """Tcl_Importer.__init__"""
        super().__init__(c, language='tcl')

    #@+others
    #@+node:felix.20230505220205.146: *3* tcl.new_starts_block
    tcl_start_pattern = re.compile(r'\s*(proc)\s+')

    def new_starts_block(self, i: int) -> Optional[int]:
        """
        Return None if lines[i] does not start a class, function or method.

        Otherwise, return the index of the first line of the body.
        """
        lines, line_states = self.lines, self.line_states
        line = lines[i]
        if line.isspace() or line_states[i].context:
            return None  # pragma: no cover (mysterious)
        prev_state = line_states[i - 1] if i > 0 else self.state_class()
        if prev_state.context:
            return None  # pragma: no cover (mysterious)
        m = re.match(self.tcl_start_pattern, line)
        return i + 1 if m and 'proc ' + m.group(1) else None
    #@+node:felix.20230505220205.147: *3* tcl.compute_headline
    proc_pattern = re.compile(r'\s*proc\s+([\w$]+)')

    def compute_headline(self, s: str) -> str:
        """Return a cleaned up headline s."""
        m = re.match(self.proc_pattern, s)
        return 'proc ' + m.group(1) if m else s
    #@-others
#@-others

def do_import(c: Cmdr, parent: Position, s: str) -> None:
    """The importer callback for tcl."""
    Tcl_Importer(c).import_from_string(parent, s)

importer_dict = {
    'extensions': ['.tcl'],
    'func': do_import,
}
#@@language python
#@@tabwidth -4


#@-leo
