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
//@+node:felix.20250221202233.1: ** class Rust_Importer(Importer)
export class Rust_Importer extends Importer {
    public language: string = 'rust';
    public string_list: string[] = []; //  Not used.
    public minimum_block_size = 0;
    //@+<< define rust block patterns >>
    //@+node:felix.20250221202233.2: *3* << define rust block patterns >>

    public block_patterns: [string, RegExp][] = [

        // Patterns that *do* require '{' on the same line...

        ['enum', /\s*enum\s+(\w+)\s*\{/],
        ['enum', /\s*pub\s+enum\s+(\w+)\s*\{/],
        ['macro', /\s*(\w+)\!\s*\{/],
        ['use', /\s*use.*?\{/],  // No m.group(1).

        // https://doc.rust-lang.org/stable/reference/visibility-and-privacy.html
        // 2018 edition+, paths for pub(in path) must start with crate, self, or super.

        // Function patterns require *neither* '(' nor '{' on the same line...

        // Ruff starts some lines with  fn name< (!)
        ['fn', /\s*fn\s+(\w+)/],
        ['fn', /\s*pub\s+fn\s+(\w+)/],

        ['fn', /\s*pub\s*\(\s*crate\s*\)\s*fn\s+(\w+)/],
        ['fn', /\s*pub\s*\(\s*self\s*\)\s*fn\s+(\w+)/],
        ['fn', /\s*pub\s*\(\s*super\s*\)\s*fn\s+(\w+)/],

        ['fn', /\s*pub\s*\(\s*in\s*crate::.*?\)\s*fn\s+(\w+)/],
        ['fn', /\s*pub\s*\(\s*in\s*self::.*?\)\s*fn\s+(\w+)/],
        ['fn', /\s*pub\s*\(\s*in\s*super::.*?\)\s*fn\s+(\w+)/],

        ['impl', /\s*impl\b(.*?)$/m],  // Use the rest of the line.

        ['mod', /\s*mod\s+(\w+)/],

        ['struct', /\s*struct\b(.*?)$/m],
        ['struct', /\s*pub\s+struct\b(.*?)$/m],
        ['trait', /\s*trait\b(.*?)$/m],
        ['trait', /\s*pub\s+trait\b(.*?)$/m],
    ];

    //@-<< define rust block patterns >>

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20250221202233.3: *3* rust_i.check_blanks_and_tabs
    /**
     * Rust_Importer.check_blanks_and_tabs.
     *
     * Check for intermixed blank & tabs.
     *
     * Ruff uses intermixed blanks and tabs.
     */
    public check_blanks_and_tabs(lines: string[]): boolean {
        return true;
    }

    //@+node:felix.20250221202233.4: *3* rust_i.compute_headline
    /**
     * Rust_Importer.compute_headline: Return the headline for the given block.
     */
    public compute_headline(block: Block): string {
        let name_s;
        if (block.name) {
            let s = block.name.replace(/{/g, '');
            // Remove possibly nested <...>.
            let level = 0;
            let result: string[] = [];
            for (const ch of s) {
                if (ch === '<') {
                    level += 1;
                } else if (ch === '>') {
                    level -= 1;
                } else if (level === 0) {
                    result.push(ch);
                }
            }
            name_s = result.join('').replace(/ {2}/g, ' ').trim();
        } else {
            name_s = '';
        }
        return name_s ? `${block.kind} ${name_s}` : `unnamed ${block.kind}`;

    }

    //@+node:felix.20250221202233.5: *3* rust_i.delete_comments_and_strings
    /**
     **  Rust_Importer.delete_comments_and_strings:
     *
     * Return **guide-lines** from the lines, replacing strings and multi-line
     * comments with spaces, thereby preserving (within the guide-lines) the
     * position of all significant characters.
     *
     * Changes from Importer.delete_comments_and_strings:
     *
     * - Block comments may be nested.
     * - Raw string literals, lifetimes and characters.
     */
    public delete_comments_and_strings(lines: string[]): string[] {

        let i = 0;
        const s = lines.join('');
        let result_lines: string[] = [];
        let result: string[] = [];
        let line_number = 1;

        //@+others  // Define helper functions.
        //@+node:felix.20250221202233.6: *4* rust_i function: oops
        const oops = (message: string): void => {
            const full_message = `${this.root?.h} line: ${line_number}:\n${message}`;
            if (g.unitTesting) {
                throw new Error(full_message);
            } else {
                console.log(full_message);
            }
        };

        //@+node:felix.20250221202233.7: *4* rust_i function: skip_r
        /**
         * Skip over a raw string literal or add a single 'r' character.
         */
        const skip_r = (): void => {
            g.assert(s[i] === 'r', s[i].toString());
            const i0 = i;
            let j = 0;

            while (i + 1 + j < s.length && s[i + 1 + j] === '#') {
                j += 1;
            }

            if (j > 256 || s[i + 1 + j] !== '"') {
                // Not a raw string. Just add the 'r'.
                add();
                return;
            }

            skip_n(j + 2);  // Skip opening chars.

            const target = '"' + '#'.repeat(j);
            while (i < s.length) {
                if (g.match(s, i, target)) {
                    skip_n(target.length);
                    return;
                }
                skip();
            }

            g.printObj(g.splitLines(s.slice(i0)), 'run-on raw string literal');
            oops(`Unterminated raw string literal: ${s.slice(i0)}`);
        };

        //@+node:felix.20250221202233.8: *4* rust_i function: skip_single_quote
        const quote_patterns = [
            // '\u{7FFF}'
            /^'\\u\{[0-7][0-7a-fA-F]{3}\}'/,
            // '\x7F'
            /^'\\x[0-7][0-7a-fA-F]'/,
            // '\n', '\r', '\t', '\\', '\0', '\'', '\"'
            /^'\\[\\\"'nrt0]'/,
            // 'x' where x is any unicode character.
            /^'.'/u
            // Lifetime.
        ];

        const lifetime_pat = /^('static|'[a-zA-Z_])[^']/;

        /**
         * Rust uses ' in several ways.
         * Valid character constants:
         * https://doc.rust-lang.org/reference/tokens.html#literals
         */
        const skip_single_quote = (): void => {
            g.assert(s[i] === "'");
            for (const pattern of quote_patterns) {
                const match = pattern.exec(s.slice(i));
                if (match) {
                    skip_n(match[0].length);
                    return;
                }
            }
            const lifetime_match = lifetime_pat.exec(s.slice(i));
            if (lifetime_match) {
                skip_n(lifetime_match[1].length);
                return;
            }
            add();
        };

        //@+node:felix.20250221202233.9: *4* rust_i function: skip_slash
        const skip_slash = (): void => {
            g.assert(s[i] === '/');
            let j = i;
            const next_ch = i + 1 < s.length ? s[i + 1] : '';
            if (next_ch === '/') {
                skip2();
                while (i < s.length) {
                    const ch = s[i];
                    skip();
                    if (ch === '\n') {
                        return;
                    }
                }
            } else if (next_ch === '*') {
                let level = 1;
                j = i;
                skip2();
                let whileBreak = false;
                while (i + 2 < s.length) {
                    const progress = i;
                    if (s[i] === '/' && s[i + 1] === '*') {
                        level += 1;
                        skip2();
                    } else if (s[i] === '*' && s[i + 1] === '/') {
                        level -= 1;
                        skip2();
                        if (level === 0) {
                            whileBreak = true;
                            break;
                        }
                    } else {
                        skip();
                    }

                    g.assert(i > progress, s.slice(j));
                }
                if (!whileBreak) {
                    oops(`Bad block comment: ${s.slice(j)}`);
                }
            } else {
                g.assert(s[i] === '/', s[i]);
                add();
            }
        };

        //@+node:felix.20250221202233.10: *4* rust_i function: skip_string_constant
        const skip_string_constant = (): void => {
            g.assert(s[i] === '"', s[i].toString());
            const j = i;
            skip();
            let whileBreak = false;
            // Note: skip *adds* newlines.
            while (i < s.length) {
                const ch = s[i];
                if (ch === '"') {
                    skip();
                    whileBreak = true;
                    break;
                } else if (ch === '\\') {
                    skip2();
                } else {
                    skip();
                }
            }
            if (!whileBreak) {
                g.printObj(g.splitLines(s.slice(j)), `${g.my_name()}: run-on string at`);
                oops(`Run-on string! offset: ${j} line number: ${line_number}`);
            }

        };
        //@+node:felix.20250221202233.11: *4* rust_i functions: scanning
        const add = (): void => {
            if (i < s.length) {
                result.push(s[i]);
                i += 1;
            }
        };

        const add2 = (): void => {
            add();
            add();
        };

        const next = (): string => {
            return i < s.length ? s[i] : '';
        };

        const skip = (): void => {
            if (i < s.length) {
                const ch = s[i];
                result.push(ch === '\n' ? '\n' : ' ');
                if (ch === '\n') {
                    result_lines.push(result.join(''));
                    result = [];
                }
                i += 1;
            }
        };

        const skip2 = (): void => {
            skip_n(2);
        };

        const skip_n = (n: number): void => {
            while (n > 0) {
                n -= 1;
                skip();
            }
        };

        //@-others

        while (i < s.length) {
            const ch = s[i];
            if (ch === '\n') {
                line_number += 1;
                add();
                // Only newline adds to the result_list.
                result_lines.push(result.join(''));
                result = [];
            } else if (ch === '\\') {
                add2();
            } else if (ch === "'") {
                skip_single_quote();
            } else if (ch === '"') {
                skip_string_constant();
            } else if (ch === '/') {
                skip_slash();
            } else if (ch === 'r') {
                skip_r();
            } else {
                add();
            }
        }

        if (result.length > 0) {
            result_lines.push(result.join(''));
        }

        // A crucial invariant.
        if (result_lines.length !== lines.length) {
            g.trace(`Mismatch in line counts for ${this.root?.h}`);
            console.log(`Original lines: ${lines.length}, Result lines: ${result_lines.length}`);
            for (let i = 0; i < lines.length; i++) {
                const original = lines[i] || '<missing>';
                const processed = result_lines[i] || '<missing>';
                if (original.length !== processed.length) {
                    console.log(`Line ${i}: Mismatch!`);
                    console.log(`Original: ${original}`);
                    console.log(`Processed: ${processed}`);
                    break;
                }
            }
        }

        return result_lines;
    }
    //@+node:felix.20250221202233.12: *3* rust_i.find_blocks
    /**
     * Rust_Importer.find_blocks: Override Importer.find_blocks to allow
     * multi-line function/method definitions.
     *
     * Using self.block_patterns and self.guide_lines, return a list of all
     * blocks in the given range of *guide* lines.
     *
     * **Important**: An @others directive will refer to the returned blocks,
     *                so there must be *no gaps* between blocks!
     */
    find_blocks(i1: number, i2: number): Block[] {

        /**
         * Scan guide_lines from line i, hunting for a line ending with '{'.
         */
        const find_curly_bracket_line = (i: number): number | null => {
            while (i < i2) {
                const line = this.guide_lines[i].trim();
                if (line.endsWith(';') || line.endsWith('}')) {
                    return null; // One-line definition.
                }
                if (line.endsWith('{')) {
                    return i;
                }
                i++;
            }
            return null; // No match
        };

        const min_size = this.minimum_block_size;
        let i: number = i1;
        let prev_i = i1;
        const results: Block[] = [];

        while (i < i2) {
            const progress = i;
            const line = this.guide_lines[i];
            i++;

            // Assume that no pattern matches a compound statement.
            for (const [kind, pattern] of this.block_patterns) {
                g.assert(i === progress + 1, `Expected i to be ${progress + 1}, but found ${i}`);

                // * In python, 'match' only matches from start of string so add '^' if not at start of regex.
                const matchPattern = pattern.source.startsWith('^')
                    ? pattern
                    : new RegExp('^' + pattern.source, pattern.flags);
                const m = line.match(matchPattern);
                if (m) {
                    const curlyIndex = find_curly_bracket_line(i - 1);
                    if (curlyIndex === null) {
                        i = progress + 1;
                        continue;
                    }
                    i = curlyIndex + 1;

                    // Cython may include trailing whitespace.
                    const name = m[1] ? m[1].trim() : '';
                    const end = this.find_end_of_block(i, i2);
                    g.assert(i1 + 1 <= end && end <= i2, `Invalid block range (${i1}, ${end}, ${i2})`);

                    // Don't generate small blocks
                    if (min_size === 0 || end - prev_i > min_size) {
                        const block = new Block(kind, name, prev_i, i, end, this.lines);
                        results.push(block);
                        prev_i = end;
                        i = prev_i;
                    } else {
                        i = end;
                    }
                    break; // The pattern fully matched.
                }
            }
            g.assert(i > progress, g.callers());
        }
        return results;
    }

    //@+node:felix.20250221202233.13: *3* rust_i.postprocess
    /**
     * Rust_Importer.postprocess: Post-process the result.blocks.
     *
     * **Note**: The RecursiveImportController class contains a postpass that
     *            adjusts headlines of *all* imported nodes.
     */
    postprocess(parent: Position): void {

        //@+others  // Define helper functions.
        //@+node:felix.20250221202233.14: *4* function: convert_docstring
        /**
         * Convert the leading comments of p.b to a docstring. 
         */
        const convert_docstring = (p: Position): void => {
            if (!p.b.trim()) {
                return;
            }
            const lines = g.splitLines(p.b);

            // Find all leading comment lines.
            let i = 0;
            for (; i < lines.length; i++) {
                if (lines[i].trim() && !lines[i].startsWith('///')) {
                    break;
                }
            }

            // Don't convert a single comment line.
            if (i < 2) {
                return;
            }

            const tail = lines.slice(i);
            const leading_lines = lines.slice(0, i);
            if (!leading_lines.join('').trim()) {
                return;  // Defensive.
            }

            const results = ['@\n'];
            for (const line of leading_lines) {
                if (line.trim()) {
                    if (line.startsWith('/// ')) {
                        results.push(line.slice(4).trimEnd() + '\n');
                    } else {
                        results.push(line.slice(3).trimEnd() + '\n');
                    }
                } else {
                    results.push('\n');
                }
            }
            results.push('@c\n');
            p.b = results.join('') + tail.join('');
        };

        //@+node:felix.20250221202233.15: *4* function: move_module_preamble
        /**
         * Move the preamble lines from the parent's first child to the start of parent.b.
         *
         * For Rust, this consists of leading 'use' statements and any comments that precede them.
        */
        const move_module_preamble = (lines: string[], parent: Position): void => {
            const child1 = parent.firstChild();
            if (!child1 || !child1.__bool__()) {
                return;
            }

            // Compute the potential preamble: all the leading lines.
            const preamble_start = Math.max(0, g.splitLines(child1.b).length - 1);
            const preamble_lines = lines.slice(0, preamble_start);

            // Include only comment, blank, and 'use' lines.
            let found_use = false;
            let i = 0;
            for (; i < preamble_lines.length; i++) {
                const stripped_line = preamble_lines[i].trim();
                if (stripped_line.startsWith('use')) {
                    found_use = true;
                } else if (stripped_line.startsWith('///')) {
                    if (found_use) {
                        break;
                    }
                } else if (stripped_line) {
                    break;
                }
            }

            if (!found_use) {
                // Assume all the comments belong to the first node.
                return;
            }

            const real_preamble_lines = lines.slice(0, i);
            const preamble_s = real_preamble_lines.join('');
            if (!preamble_s.trim()) {
                return;
            }

            // Adjust the bodies.
            parent.b = preamble_s + parent.b;
            child1.b = child1.b.replace(preamble_s, '');

            // Next, move leading lines to the parent, before the @others line.
            while (child1.b.startsWith('\n')) {
                if (parent.b.includes('@others')) {
                    // Assume the importer created the @others.
                    parent.b = parent.b.replace('@others', '\n@others');
                } else {
                    parent.b += '\n';
                }
                child1.b = child1.b.slice(1);
            }
        };
        //@-others


        this.move_blank_lines(parent);  // Base-class method.

        move_module_preamble(this.lines, parent);
        if (0) {
            for (const p of parent.self_and_subtree()) {
                convert_docstring(p);
            }
        }

    }
    //@-others

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
