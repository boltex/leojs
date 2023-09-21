//@+leo-ver=5-thin
//@+node:felix.20230913235814.1: * @file src/importers/pascal.ts
/**
 * The @auto importer for the pascal language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230913235814.2: ** class Pascal_Importer(Importer)
export class Pascal_Importer extends Importer {
    public language: string = 'pascal';

    public block_patterns: [string, RegExp][] = [
        ['constructor', /^\s*\bconstructor\s+([\w_\.]+)/],
        ['destructor', /^\s*\bdestructor\s+([\w_\.]+)/],
        ['function', /^\s*\bfunction\s+([\w_\.]+)/],
        ['procedure', /^\s*\bprocedure\s+([\w_\.]+)/],
        ['unit', /^\s*\bunit\s+([\w_\.]+)/],
    ];

    public patterns: RegExp[] = this.block_patterns.map(([, pattern]) => pattern);

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913235814.3: *3* pascal_i.find_end_of_block
    /**
     * i is the index of the line *following* the start of the block.
     *
     * Return the index of the start of the next block.
     */
    public find_end_of_block(i1: number, i2: number): number {
        let i: number = i1;
        while (i < i2) {
            const line: string = this.guide_lines[i];
            if (this.patterns.some((pattern) => pattern.test(line))) {
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
 * The importer callback for pascal.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Pascal_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.pas'],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4


//@-leo
