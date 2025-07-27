//@+leo-ver=5-thin
//@+node:felix.20230912201323.1: * @file src/importers/csharp.ts
/**
 * The @auto importer for the csharp language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';
import { C_Importer } from './c';

//@+others
//@+node:felix.20230912201323.2: ** class Csharp_Importer(Importer)
/**
 * The importer for the csharp language.
 */
export class Csharp_Importer extends C_Importer {

    public language = 'csharp';

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

}
//@-others

/**
 * The importer callback for csharp.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
    new Csharp_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
    'extensions': ['.cs', '.c#'],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
