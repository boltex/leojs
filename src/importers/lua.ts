//@+leo-ver=5-thin
//@+node:felix.20230913224120.1: * @file src/importers/lua.ts
/**
 * The @auto importer for the lua language.
 *
 * Created 2017/05/30 by the `importer;;` abbreviation.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230913224120.2: ** class Lua_Importer(Importer)
/**
 * The importer for the lua language.
 */
export class Lua_Importer extends Importer {
    public language = 'lua';
    public end_pat = new RegExp('.*?\\bend\\b');

    public block_patterns: [string, RegExp][] = [
        ['function', /\s*function\s+([\w\.]+)\s*\(/],
        ['function', /.*?([\w\.]+)\s*\(function\b\s*\(/],
    ];

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913224120.3: *3* lua_i.find_end_of_block
    /**
     * Lua_Importer.find_end_of_block.
     *
     * i is the index (within the *guide* lines) of the line *following* the start of the block.
     *
     * Return the index of end of the block.
     */
    public find_end_of_block(i: number, i2: number): number {
        let level = 1;  // The previous line starts the function.
        while (i < i2) {
            const line = this.guide_lines[i];
            i += 1;
            let found = false;
            for (let [kind, pat] of this.block_patterns) {
                const m1 = line.match(pat);
                if (m1) {
                    level += 1;
                    found = true;
                    break;
                }
            }
            if (!found) {
                const m2 = line.match(this.end_pat);
                if (m2) {
                    level -= 1;
                    if (level === 0) {
                        return i;
                    }
                }
            }
        }
        return i2;
    }
    //@-others

}
//@-others

/**
 * The importer callback for lua.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
    new Lua_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
    'extensions': ['.lua',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4


//@-leo
