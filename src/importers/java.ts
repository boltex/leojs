//@+leo-ver=5-thin
//@+node:felix.20230913212159.1: * @file src/importers/java.ts
/**
 * The @auto importer for the java language.
 */
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

//@+others
//@+node:felix.20230913212159.2: ** class Java_Importer(Importer)
/**
 * The importer for the java language.
 */
export class Java_Importer extends Importer {

  public language = 'java';

  public block_patterns: [string, RegExp][] = [
    ['class', /.*?\bclass\s+(\w+)/],
    ['func', /.*?\b(\w+)\s*\(.*?\)\s*{/],
    ['interface', /^.*?\binterface\s+(\w*)\s*{/], // Added caret to be used as in python to match at start of string
  ];

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }
}
//@-others

/**
 * The importer callback for java.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new Java_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.java'],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
