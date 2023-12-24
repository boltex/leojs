//@+leo-ver=5-thin
//@+node:felix.20230912223510.1: * @file src/importers/ini.ts
/**
 * The @auto importer for .ini files.
 */
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

//@+others
//@+node:felix.20230912223510.2: ** class Ini_Importer(Importer)
export class Ini_Importer extends Importer {
    public language = 'ini';

    public section_pat = /^\s*(\[.*\])/;
    public block_patterns: [string, RegExp][] = [['section', this.section_pat]];

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230912223510.3: *3* ini_i.find_end_of_block
    /**
     * Ini_Importer.find_end_of_block.
     *  
     * i is the index of the line *following* the start of the block.
     * 
     * Return the index of the start of the next section.
     */
    find_end_of_block(i: number, i2: number): number {

        while (i < i2) {
            const line = this.guide_lines[i];
            if (this.section_pat.test(line)) {
                return i;
            }
            i += 1;
        }
        return i2;
    }
    //@-others

}
//@-others

/**
 * The importer callback for .ini files.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Ini_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.ini',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
