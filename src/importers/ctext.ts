//@+leo-ver=5-thin
//@+node:felix.20230912201329.1: * @file src/importers/ctext.ts
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230912201329.2: ** class CText_Importer(Importer)
class CText_Importer extends Importer {
  //@+<< ctext docstring >>
  //@+node:felix.20230912201329.3: *3* << ctext docstring >>
  /*
  Read/Write simple text files with hierarchy embedded in headlines::

      Leading text in root node of subtree

      Etc. etc.

      ### A level one node #####################################

      This would be the text in this level one node.

      And this.

      ### Another level one node ###############################

      Another one

      #### A level 2 node ######################################

      See what we did there - one more '#' - this is a subnode.

  Leading / trailing whitespace may not be preserved.  '-' and '/'
  are used in place of '#' for SQL and JavaScript.
  */
  //@-<< ctext docstring >>

  public language = 'plain';  // A reasonable default.

  //@+others
  //@+node:felix.20230912201329.4: *3* ctext_i.import_from_string
  /**
   * CText_Importer.import_from_string.
   */
  public import_from_string(parent: Position, s: string): void {
    const c = this.c;
    const root = parent.copy();
    const ft = c.importCommands.fileType?.toLowerCase() || '';
    const cchar =
      '#' ||
      (g.unitTesting ? '#' : ft === '.sql' ? '%' : ft === '.sql' ? '-' : ft === '.js' ? '/' : '#');
    const header_pattern = new RegExp(`^\\s*(${cchar}{3,})(.*?)${cchar}*\\s*$`);
    const lines_dict: Record<string, string[]> = {};
    lines_dict[root.v.gnx] = [];
    const parents: Position[] = [root];

    for (const line of g.splitLines(s)) {
      const match = line.match(header_pattern);
      if (match) {
        const level = match[1].length - 2;
        if (level >= 1) {
          parents.splice(level);
          this.create_placeholders(level, lines_dict, parents);
          const parent = parents[parents.length - 1];
          const child = parent.insertAsLastChild();
          child.h = match[2].trim();
          lines_dict[child.v.gnx] = [];
          parents.push(child);
        }
      } else {
        const parent = parents[parents.length - 1];
        lines_dict[parent.v.gnx].push(line);
      }
    }

    for (const p of root.self_and_subtree()) {
      p.b = lines_dict[p.v.gnx].join('\n');
    }

    // Importers should not mark nodes or the outline as dirty.
    for (const p of root.self_and_subtree()) {
      p.clearDirty();
    }
  }

  //@-others

}
//@-others

/**
 * The importer callback for ctext.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new CText_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  '@auto': ['@auto-ctext'],
  'extensions': ['.ctext'],  // A made-up extension for unit tests.
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
