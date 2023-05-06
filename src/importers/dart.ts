#@+leo-ver=5-thin
#@+node:felix.20230505220205.24: * @file src/importers/dart.ts
"""The @auto importer for the dart language."""
import re
from leo.core.leoCommands import Commands as Cmdr
from leo.core.leoNodes import Position
from leo.plugins.importers.linescanner import Importer
#@+others
#@+node:felix.20230505220205.25: ** class Dart_Importer
class Dart_Importer(Importer):
    """The importer for the dart lanuage."""

    def __init__(self, c: Cmdr) -> None:
        """Dart_Importer.__init__"""
        super().__init__(c, language='dart')

    #@+others
    #@+node:felix.20230505220205.26: *3* dart_i.compute_headline
    dart_pattern = re.compile(r'^\s*([\w_][\w_\s]*)\(')

    def compute_headline(self, s: str) -> str:

        m = self.dart_pattern.match(s)
        return m.group(0).strip('(').strip() if m else s.strip()
    #@-others
#@-others

def do_import(c: Cmdr, parent: Position, s: str) -> None:
    """The importer callback for dart."""
    Dart_Importer(c).import_from_string(parent, s)

importer_dict = {
    'extensions': ['.dart'],
    'func': do_import,
}
#@@language python
#@@tabwidth -4
#@-leo
