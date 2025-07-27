//@+leo-ver=5-thin
//@+node:felix.20230912201336.1: * @file src/importers/cython.ts
/**
 * @auto importer for cython.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';
import { Python_Importer } from './python';

//@+others
//@+node:felix.20230912201336.2: ** class Cython_Importer(Python_Importer)
/**
 * A class to store and update scanning state.
 */
export class Cython_Importer extends Python_Importer {

  public language: string = 'cython';

  // Override the Python patterns.
  // Group 1 matches the name of the class/cdef/cpdef/def.
  public async_class_pat = /\s*async\s+class\s+([\w_]+)\s*(\(.*?\))?(.*?):/;
  public class_pat = /\s*class\s+([\w_]+)\s*(\(.*?\))?(.*?):/;
  public cdef_pat = /\s*cdef\s+([\w_ ]+)/;
  public cpdef_pat = /\s*cpdef\s+([\w_ ]+)/;
  public def_pat = /\s*def\s+([\w_ ]+)/;

  public block_patterns: [string, RegExp][] = [
    ['async class', this.async_class_pat],
    ['class', this.class_pat],
    ['cdef', this.cdef_pat],
    ['cpdef', this.cpdef_pat],
    ['def', this.def_pat],
  ];

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

}
//@-others

/**
 * The importer callback for cython.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
  new Cython_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
  'extensions': ['.pyx',],
  'func': do_import,
};
//@@language typescript
//@@tabwidth -4
//@-leo
