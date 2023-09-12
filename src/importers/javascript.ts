//@+leo-ver=5-thin
//@+node:felix.20230911233839.1: * @file src/importers/javascript.ts
/**
 * The @auto importer for JavaScript.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230911233839.2: ** class JS_Importer(Importer)
class JS_Importer extends Importer {

  public language: string = 'javascript';

  // These patterns won't find all functions, but they are a reasonable start.

  // Group 1 must be the block name.
  public block_patterns: [string, RegExp][] = [
    // (? function name ( .*? {
    ['function', /\s*?\(?function\b\s*([\w\.]*)\s*\(.*?\{/],

    // name: ( function ( .*? {
    ['function', /\s*([\w.]+)\s*\:\s*\(*\s*function\s*\(.*?{/],

    // var name = ( function ( .*? {
    ['function', /\s*\bvar\s+([\w\.]+)\s*=\s*\(*\s*function\s*\(.*?{/],

    // name = ( function ( .*? {
    ['function', /\s*([\w\.]+)\s*=\s*\(*\s*function\s*\(.*?{/],

    // Add other patterns if necessary
    // ['const', /\s*\bconst\s*(\w+)\s*=.*?=>/],
    // ['let', /\s*\blet\s*(\w+)\s*=.*?=>/],
  ];
}
//@-others

/**
 * The importer callback for javascript.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new JS_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.js',],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
