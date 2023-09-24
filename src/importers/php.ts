//@+leo-ver=5-thin
//@+node:felix.20230913235836.1: * @file src/importers/php.ts

/**
 * The @auto importer for the php language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230913235836.2: ** class Php_Importer(Importer)
/**
 * The importer for the php lanuage.
 */
export class Php_Importer extends Importer {

    public language = 'php';

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

}
//@-others

/**
 * The importer callback for php.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Php_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.php'],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
