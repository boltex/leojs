//@+leo-ver=5-thin
//@+node:felix.20230912223458.1: * @file src/importers/elisp.ts
/**
 * The @auto importer for the elisp language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230912223458.2: ** class Elisp_Importer(Importer)
export class Elisp_Importer extends Importer {
  public language = 'lisp';

  public block_patterns: [string, RegExp][] = [
    // ( defun name
    ['defun', /\s*\(\s*\bdefun\s+([\w_-]+)/],
  ];

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

  //@+others
  //@+node:felix.20230912223458.3: *3* elisp_i.find_end_of_block
  /** 
   * Elisp_Importer.find_end_of_block.
   *    
   * i is the index (within the *guide* lines) of the line *following* the start of the block.
   *
   * Return the index of the last line of the block.
   */
  public find_end_of_block(i: number, i2: number): number {
    // Rescan the previous line to get an accurate count of parents.

    g.assert(i > 0, new Error().stack || '');
    i -= 1;
    let level = 0;
    while (i < i2) {
      const line = this.guide_lines[i];
      i += 1;
      for (const ch of line) {
        if (ch === '(') {
          level += 1;
        }
        if (ch === ')') {
          level -= 1;
          if (level === 0) {
            return i;
          }
        }
      }
    }
    return i2;
  }
  //@-others

}
//@-others

/**
 * The importer callback for elisp.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
  new Elisp_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
  'extensions': ['.el', '.clj', '.cljs', '.cljc',],
  'func': do_import,  // Also clojure, clojurescript
};

//@@language typescript
//@@tabwidth -4
//@-leo
