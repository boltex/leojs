#@+leo-ver=5-thin
#@+node:felix.20230505220205.14: * @file src/importers/csharp.ts
"""The @auto importer for the csharp language."""
from leo.core.leoCommands import Commands as Cmdr
from leo.core.leoNodes import Position
from leo.plugins.importers.linescanner import Importer
#@+others
#@+node:felix.20230505220205.15: ** class Csharp_Importer
class Csharp_Importer(Importer):
    """The importer for the csharp lanuage."""

    def __init__(self, c: Cmdr) -> None:
        """Csharp_Importer.__init__"""
        super().__init__(c, language='csharp')

    #@+others
    #@+node:felix.20230505220205.16: *3* csharp.compute_headline
    def compute_headline(self, s: str) -> str:
        """Return a cleaned up headline s."""
        s = s.strip()
        if s.endswith('{'):
            s = s[:-1].strip()
        return s
    #@-others
#@-others

def do_import(c: Cmdr, parent: Position, s: str) -> None:
    """The importer callback for csharp."""
    Csharp_Importer(c).import_from_string(parent, s)

importer_dict = {
    'extensions': ['.cs', '.c#'],
    'func': do_import,
}
#@@language python
#@@tabwidth -4
#@-leo
