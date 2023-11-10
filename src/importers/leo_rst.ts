//@+leo-ver=5-thin
//@+node:felix.20230913212609.1: * @file src/importers/leo_rst.ts
/**
 * The @auto importer for restructured text.
 *
 * This module must **not** be named rst, so as not to conflict with docutils.
 */
import * as g from '../core/leoGlobals';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

// Used by writers.leo_rst as well as in this file.
//# All valid rst underlines, with '#' *last*, so it is effectively reserved.
export const underlines = '*=-^~"\'+!$%&(),./:;<>?@[\\]_`{|}#';

//@+others
//@+node:felix.20230913212609.2: ** class Rst_Importer(Importer)
/**
 * The importer for the rst language.
 */
export class Rst_Importer extends Importer {

    public language = 'rest';

    public lines_dict: Record<string, string[]> = {};
    public stack: Position[] = [];
    // # 430, per RagBlufThim. Was {'#': 1,}
    public rst_seen: Record<string, number> = {};
    public rst_level = 0;  // A trick.

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913212609.3: *3* rst_i.gen_block & helpers
    /**
     * Rst_Importer: gen_block.
     *
     * Node generator for reStructuredText.
     *
     * Create all descendant blocks and their nodes from self.lines.
     * 
     * The rst writer adds section lines, so *remove* those lines here.
     *
     * i.gen_lines adds the @language and @tabwidth directives.
     */
    public gen_block(parent: Position): void {
        const lines: string[] = this.lines;
        g.assert(parent.__eq__(this.root));
        this.lines_dict = {};
        this.lines_dict[parent.v.gnx] = [];
        this.lines = lines;
        this.stack = [parent];
        let skip: number = 0;

        for (let i: number = 0; i < lines.length; i++) {
            if (skip > 0) {
                skip -= 1;
            } else if (this.is_lookahead_overline(i)) {
                const level: number = this.ch_level(lines[i][0]);
                this.make_rst_node(level, lines[i + 1]);
                skip = 2;
            } else if (this.is_lookahead_underline(i)) {
                const level: number = this.ch_level(lines[i + 1][0]);
                this.make_rst_node(level, lines[i]);
                skip = 1;
            } else if (i === 0) {
                const top: Position = this.make_dummy_node('!Dummy chapter');
                this.lines_dict[top.v.gnx].push(lines[i]);
            } else {
                const top: Position = this.stack[this.stack.length - 1];
                this.lines_dict[top.v.gnx].push(lines[i]);
            }
        }

        // Set p.b from the lines_dict.
        g.assert(parent.__eq__(this.root));
        for (const p of this.root!.self_and_subtree()) {
            p.b = this.lines_dict[p.v.gnx].join('');
        }
    }
    //@+node:felix.20230913212609.4: *4* rst_i.ch_level
    /**
     * Return the underlining level associated with ch.
     */
    public ch_level(ch: string): number {
        g.assert(underlines.includes(ch), `Invalid character: ${ch}`);

        const d = this.rst_seen;
        if (ch in d) {
            return d[ch];
        }
        this.rst_level += 1;
        d[ch] = this.rst_level;
        return this.rst_level;
    }
    //@+node:felix.20230913212609.5: *4* rst_i.is_lookahead_overline
    /**
     * True if lines[i:i+2] form an overlined/underlined line.
     */
    is_lookahead_overline(i: number): boolean {
        const lines = this.lines;

        if (i + 2 >= lines.length) {
            return false;
        }

        const line0 = lines[i];
        const line1 = lines[i + 1];
        const line2 = lines[i + 2];
        const ch0 = this.is_underline(line0, '#');
        const ch1 = this.is_underline(line1);
        const ch2 = this.is_underline(line2, '#');

        return (
            ch0 && ch2 && ch0 === ch2 && !ch1 &&
            line1.length >= 4 &&
            line0.length >= line1.length &&
            line2.length >= line1.length
        );
    }
    //@+node:felix.20230913212609.6: *4* rst_i.is_lookahead_underline
    public is_lookahead_underline(i: number): boolean {
        const lines = this.lines;
        if (i + 1 >= lines.length) {
            return false;
        }
        const line0 = lines[i];
        const line1 = lines[i + 1];
        return (
            !line0.trimStart().length &&
            line1.length >= 4 &&
            this.is_underline(line1) &&
            !this.is_underline(line0)
        );
    }
    //@+node:felix.20230913212609.7: *4* rst_i.is_underline
    /**
     * True if the line consists of nothing but the same underlining characters.
     */
    public is_underline(line: string, extra: string | null = null): boolean {
        if (line.trim() === '') {
            return false;
        }
        let chars = underlines;
        if (extra) {
            chars += extra;
        }
        const ch1 = line[0];
        if (chars.indexOf(ch1) === -1) {
            return false;
        }
        for (const ch of line.trimRight()) {
            if (ch !== ch1) {
                return false;
            }
        }
        return true;
    }
    //@+node:felix.20230913212609.8: *4* rst_i.make_dummy_node
    /**
     * Make a decls node.
     */
    public make_dummy_node(headline: string): Position {
        const parent: Position = this.stack[this.stack.length - 1];
        g.assert(parent.__eq__(this.root));
        const child: Position = parent.insertAsLastChild();
        child.h = headline;
        this.lines_dict[child.v.gnx] = [];
        this.stack.push(child);
        return child;
    }
    //@+node:felix.20230913212609.9: *4* rst_i.make_rst_node
    /**
     * Create a new node, with the given headline.
     */
    public make_rst_node(level: number, headline: string): Position {
        g.assert(level > 0, `Level should be greater than 0, but got: ${level}`);

        this.stack = this.stack.slice(0, level);

        // Insert placeholders as necessary.
        // This could happen in imported files not created by us.
        this.create_placeholders(level, this.lines_dict, this.stack);

        // Create the node.
        const top: Position = this.stack[this.stack.length - 1];
        const child: Position = top.insertAsLastChild();
        child.h = headline;
        this.lines_dict[child.v.gnx] = [];
        this.stack.push(child);
        return this.stack[level];
    }
    //@-others

}
//@-others

/**
 * The importer callback for reStructureText.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Rst_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    '@auto': ['@auto-rst',],  // Fix #392: @auto-rst file.txt: -rst ignored on read
    'extensions': ['.rst', '.rest'],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
