//@+leo-ver=5-thin
//@+node:felix.20230914002711.1: * @file src/importers/tcl.ts
/**
 * The @auto importer for the tcl language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230914002711.2: ** class Tcl_Importer(Importer)
/**
 * The importer for the tcl lanuage.
 */
export class Tcl_Importer extends Importer {
    public language: string = 'tcl';

    public block_patterns: [string, RegExp][] = [
        ['proc', /\s*\bproc\s+(\w+)/],
    ];

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

}
//@-others

/**
 * The importer callback for tcl.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Tcl_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.tcl'],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
