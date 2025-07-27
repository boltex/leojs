//@+leo-ver=5-thin
//@+node:felix.20230913235829.1: * @file src/importers/perl.ts
/**
 * The @auto importer for Perl
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230913235829.2: ** class Perl_Importer(Importer)
/**
 * A scanner for the perl language.
 */
export class Perl_Importer extends Importer {
    public language: string = 'perl';

    public block_patterns: [string, RegExp][] = [
        ['sub', /^\s*sub\s+(\w+)/],
    ];

    public regex_pat: RegExp = /^(.*?=\s*(m|s|tr|)\/)/; // added caret to match only at start

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913235829.3: *3* perl_i.make_guide_lines
    /**
     * Perl_Importer.make_guide_lines.
     *
     * Return a list of **guide lines** that simplify the detection of blocks.
     */
    public make_guide_lines(lines: string[]): string[] {
        const aList: string[] = this.delete_comments_and_strings([...lines]);
        return this.delete_regexes(aList);
    }
    //@+node:felix.20230913235829.4: *3* perl_i.delete_regexes
    /**
     * Remove regexes. 
     */
    public delete_regexes(lines: string[]): string[] {
        const result: string[] = [];
        for (const line of lines) {
            const m = line.match(this.regex_pat);
            if (m) {
                result.push(line.slice(0, m[0].length));
            } else {
                result.push(line);
            }
        }
        return result;
    }
    //@-others

}
//@-others

/**
 * The importer callback for perl.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
    new Perl_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
    'extensions': ['.pl',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
