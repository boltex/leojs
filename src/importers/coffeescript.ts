//@+leo-ver=5-thin
//@+node:felix.20230912201234.1: * @file src/importers/coffeescript.ts
/**
 * The @auto importer for coffeescript.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';
import { Python_Importer } from './python';

//@+others
//@+node:felix.20230912201234.2: ** class Coffeescript_Importer(Python_Importer)
export class Coffeescript_Importer extends Python_Importer {

  public language = 'coffeescript';

  public block_patterns: [string, RegExp][] = [
    ['class', /^\s*class\s+([\w]+)/],
    ['def', /^\s*(.+?):.*?->/],
    ['def', /^\s*(.+?)=.*?->/],
  ];

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

}
//@-others

/**
 * The importer callback for coffeescript.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new Coffeescript_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.coffee',],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
