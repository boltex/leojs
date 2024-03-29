//@+leo-ver=5-thin
//@+node:felix.20230914002433.1: * @file src/importers/rust.ts
/**
 * The @auto importer for rust.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230914002433.2: ** class Rust_Importer(Importer)
export class Rust_Importer extends Importer {
    public language: string = 'rust';

    // Single quotes do *not* start strings.
    public string_list: string[] = ['"'];

    public block_patterns: [string, RegExp][] = [
        ['impl', /^\bimpl\b(.*?)\s*{/],  // Use most of the line. ALSO ADDED CARET TO MATCH AT START OF STRING
        ['fn', /\s*fn\s+(\w+)\s*\(/],
        ['fn', /\s*pub\s+fn\s+(\w+)\s*\(/],
    ];

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

}
//@-others

/**
 * The importer callback for rust.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Rust_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.rs',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
