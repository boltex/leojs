//@+leo-ver=5-thin
//@+node:felix.20230912221938.1: * @file src/importers/dart.ts
/**
 * The @auto importer for the dart language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230912221938.2: ** class Dart_Importer(Importer)
/**
 * The importer for the dart language.
 */
class Dart_Importer extends Importer {


  public language = 'dart';

  public block_patterns: [string, RegExp][] = [
    ['function', /^\s*([\w\s]+)\s*\(.*?\)\s*\{/],
  ];

}
//@-others

/**
 * The importer callback for dart.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new Dart_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.dart'],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
