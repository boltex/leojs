//@+leo-ver=5-thin
//@+node:felix.20230522010520.1: * @file src/importers/base_importer.ts
/**
 * base_importer.ts: The base Importer class used by almost all importers.
 */

import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';

export type Block = [string, string, number, number, number];

//@+others
//@+node:felix.20230910195228.1: ** class Importer
/**
 * The base class for almost all of Leo's importers.
 *
 * Many importers only define `block_patterns` and `language` class ivars.
 *
 * Analyzing **guide lines** (lines without comments and strings)
 * grealtly simplifies this class and all of Leo's importers.
 *
 * Subclasses may override the following methods to recognize blocks:
 *
 * Override `i.find_blocks` or `i.find_end_of_block1` to tweak `i.gen_block`.
 * Override `i.gen_block` for more control.
 * Override `i.import_from_string` for complete control.
 *
 * Subclasses may override these methods to handle the incoming text:
 *
 * Override `i.check_blanks_and tabs` to suppress warnings.
 * Override `i.preprocess_lines` to adjust incoming lines.
 * Override `i.regularize_whitespace` to allow mixed tabs and spaces.
 */
export class Importer {

    // Don't split classes, functions or methods smaller than this value.
    public minimum_block_size = 0;  // 0: create all blocks.

    // Must be overridden in subclasses.
    public language: string = "";

    // May be overridden in subclasses.
    public allow_preamble = false;
    public block_patterns: any[] = [];
    public level_up_ch = '{';
    public level_down_ch = '}';
    public string_list: string[] = ['"', "'"];

    public c: Commands;
    public root: Position | undefined;
    public single_comment: string;
    public block1: string;
    public block2: string;
    public tab_width: number;
    public lines: string[] = [];
    public guide_lines: string[] = [];

    //@+others
    //@+node:felix.20230910195228.2: *3* i.__init__
    /**
     * Importer.__init__
     */
    constructor(c: Commands) {
        // console.assert(this.language, g.callers());  // Do not remove.
        console.assert(this.language, new Error().stack || '');  // Do not remove.
        this.c = c;  // May be None.
        this.root = undefined;
        const delims = g.set_delims_from_language(this.language);
        [this.single_comment, this.block1, this.block2] = delims;
        this.tab_width = 0;  // Must be set later.
    }
    //@+node:felix.20230910195228.3: *3* i: Generic methods: may be overridden
    //@+node:felix.20230910195228.4: *4* i.check_blanks_and_tabs
    /**
     * Importer.check_blanks_and_tabs.
     *
     * Check for intermixed blank & tabs.
     *
     * Subclasses may override this method to suppress this check.
     */
    public check_blanks_and_tabs(lines: string[]): boolean { // (missing test)

        // Do a quick check for mixed leading tabs/blanks.
        const fn = g.shortFileName(this.root?.h);
        const w = this.tab_width;
        let blanks = 0;
        let tabs = 0;
        for (const s of lines) {
            const lws = this.get_str_lws(s);
            // blanks += lws.count(' ');
            blanks += lws.split(' ').length - 1;

            // tabs += lws.count('\t');
            tabs += lws.split('\t').length - 1;

        }
        let ok: boolean = false;
        let message: string = "";
        // Make sure whitespace matches @tabwidth directive.
        if (w < 0) {
            ok = tabs === 0;
            message = `tabs found with @tabwidth ${w} in ${fn}`;

        } else if (w > 0) {
            ok = blanks === 0;
            message = `blanks found with @tabwidth ${w} in ${fn}`;
        }

        if (ok) {
            ok = (blanks === 0 || tabs === 0);
            message = `intermixed blanks and tabs in: ${fn}`;
        }

        if (!ok) {
            if (g.unitTesting) {
                console.assert(false, message);
            } else {
                g.es(message);
            }
        }
        return ok;

    }
    //@+node:felix.20230910195228.5: *4* i.compute_headline
    /**
     * Importer.compute_headline.
     *
     * Return the headline for the given block.
     *
     * Subclasses may override this method as necessary.
     */
    public compute_headline(block: Block): string {

        let [child_kind, child_name, child_start, child_start_body, child_end] = block;
        return child_name ? `${child_kind} ${child_name}` : `unnamed ${child_kind}`;

    }
    //@+node:felix.20230910195228.6: *4* i.create_preamble
    /**
     * Importer.create_preamble: Create one preamble node.
     *
     * Subclasses may override this method to create multiple preamble nodes.
     */
    public create_preamble(blocks: Block[], parent: Position, result_list: string[]): void {

        console.assert(this.allow_preamble);
        console.assert(parent.__eq__(this.root));

        const lines = this.lines;
        const common_lws = this.compute_common_lws(blocks);

        let [child_kind, child_name, child_start, child_start_body, child_end] = blocks[0];
        const new_start = Math.max(0, child_start_body - 1);

        const preamble = lines.slice(0, new_start);

        if (preamble.length > 0 && preamble.some(z => z)) {
            const child = parent.insertAsLastChild();
            const section_name = '<< preamble >>';
            child.h = section_name;
            child.b = preamble.join('');
            result_list.unshift(`${common_lws}${section_name}\n`);
            // Adjust this block.
            blocks[0] = [child_kind, child_name, new_start, child_start_body, child_end];
        }

    }
    //@+node:felix.20230910195228.7: *4* i.find_blocks
    /**
     * Importer.findBlocks.
     * 
     * Find all blocks in the given range of *guide* lines.
     * 
     * Use the patterns in this.blockPatterns to find the start of a block.
     * 
     * Subclasses may override this method for more control.
     * 
     * Return a list of Blocks, that is, tuples (kind, name, start, startBody, end).
     */
    public find_blocks(i1: number, i2: number): Block[] {

        const min_size: number = this.minimum_block_size;
        let i: number = i1;
        let prev_i: number = i1;
        const results: Block[] = [];

        while (i < i2) {
            const s: string = this.guide_lines[i];
            i++;

            // Assume that no pattern matches a compound statement.
            for (const [kind, pattern] of this.block_patterns) {
                const m: RegExpMatchArray | null = s.match(pattern);

                if (m) {
                    // Cython may include trailing whitespace.
                    const name: string = m[1].trim();
                    const end: number = this.find_end_of_block(i, i2);
                    console.assert(i1 + 1 <= end && end <= i2, `Assertion failed: ${i1} <= ${end} <= ${i2}`);
                    // Don't generate small blocks.
                    if (min_size === 0 || end - prev_i > min_size) {
                        results.push([kind, name, prev_i, i, end]);
                        prev_i = end;
                        i = prev_i;
                    } else {
                        i = end;
                    }

                    break;
                }
            }
        }

        return results;
    }
    //@+node:felix.20230910195228.8: *4* i.find_end_of_block
    /**
     * Importer.find_end_of_block.
     * 
     * Return the index of the end of the block.
     * i: The index of the (guide) line *following* the start of the block.
     * i2: The index of the last (guide) line to be scanned.
     * 
     * This method assumes that '{' and '}' delimit blocks.
     * Subclasses may override this method as necessary.
     */
    public find_end_of_block(i: number, i2: number): number {

        let level: number = 1;  // All blocks start with '{'

        while (i < i2) {
            const line: string = this.guide_lines[i];
            i++;

            for (const ch of line) {
                if (ch === '{') {
                    level++;
                }
                if (ch === '}') {
                    level--;

                    if (level === 0) {
                        return i;
                    }
                }
            }
        }

        return i2;
    }
    //@+node:felix.20230910195228.9: *4* i.gen_block
    /**
     * Importer.gen_block.
     * 
     * Create all descendant blocks and their parent nodes.
     * 
     * Five importers override this method to take full control over finding blocks.
     */
    public gen_block(block: Block, parent: Position): void {
        const lines: string[] = this.lines;
        let [kind, name, start, start_body, end]: Block = block;

        console.assert(start <= start_body && start_body <= end, [start, start_body, end]);

        // Find all blocks in the body of this block.
        const blocks: Block[] = this.find_blocks(start_body, end);
        let result_list: string[];
        if (blocks.length > 0) {
            const common_lws: string = this.compute_common_lws(blocks);
            // Start with the head: lines[start : start_body].
            result_list = lines.slice(start, start_body);
            // Special case: create a preamble node as the first child of the parent.
            if (this.allow_preamble && parent === this.root && start === 0) {
                this.create_preamble(blocks, parent, result_list);
            }
            // Add indented @others.
            result_list.push(`${common_lws}@others\n`);
            // Recursively generate the inner nodes/blocks.
            let last_end: number = end;

            for (const innerBlock of blocks) {
                let [child_kind, child_name, child_start, child_start_body, child_end]: Block = innerBlock;
                last_end = child_end;

                // Generate the child containing the new block.
                const child: Position = parent.insertAsLastChild();
                child.h = this.compute_headline(innerBlock);
                this.gen_block(innerBlock, child);
                // Remove common_lws.
                this.remove_common_lws(common_lws, child);
            }
            // Add any tail lines.
            result_list.push(...lines.slice(last_end, end));
        } else {
            result_list = lines.slice(start, end);
        }

        // Delete extra leading newline, and trailing whitespace.
        parent.b = result_list.join('').replace(/^\n+/, '').trimEnd() + '\n';


    }
    //@+node:felix.20230910195228.10: *4* i.gen_lines (top level)
    /**
     * Importer.gen_lines: Allocate lines to the parent and descendant nodes.
     *
     * Subclasses may override this method, but none do.
     */
    public gen_lines(lines: string[], parent: Position): void {
        try {
            console.assert(this.root && this.root.__eq__(parent));
            this.lines = lines;
            // Delete all children.
            parent.deleteAllChildren();
            // Create the guide lines.
            this.guide_lines = this.make_guide_lines(lines);
            const n1: number = this.lines.length;
            const n2: number = this.guide_lines.length;
            console.assert(n1 === n2);
            // Start the recursion.
            const block: Block = ['outer', 'parent', 0, 0, lines.length];
            this.gen_block(block, parent);
        }
        catch (e) {
            g.trace('Unexpected exception!');
            g.es_exception(e);
            parent.deleteAllChildren();
            parent.b = lines.join('');
        }
        // Add trailing lines.
        parent.b += `@language ${this.language}\n@tabwidth ${this.tab_width}\n`;
    }
    //@+node:felix.20230910195228.11: *4* i.import_from_string (driver)
    /**
     * Importer.import_from_string.
     * 
     * parent: An @<file> node containing the absolute path to the to-be-imported file.
     * s: The contents of the file.
     * 
     * The top-level code for almost all importers.
     * Overriding this method gives the subclass complete control.
     */
    public import_from_string(parent: Position, s: string): void {

        const c = this.c;

        // Fix #449: Cloned @auto nodes duplicates section references.
        if (parent.isCloned() && parent.hasChildren()) {
            return;
        }
        const root = parent.copy();
        this.root = root;

        // Check for intermixed blanks and tabs.
        this.tab_width = c.getTabWidth(root)!;
        let lines: string[] = g.splitLines(s);
        const ws_ok: boolean = this.check_blanks_and_tabs(lines);  // Issues warnings.

        // Regularize leading whitespace
        if (!ws_ok) {
            lines = this.regularize_whitespace(lines);
        }

        // A hook for xml importer: preprocess lines.
        lines = this.preprocess_lines(lines);

        // Generate all nodes.
        this.gen_lines(lines, parent);

        // A hook for python importer.
        this.postprocess(parent);

        // Importers should never dirty the outline.
        // #1451: Do not change the outline's change status.
        for (const p of root.self_and_subtree()) {
            p.clearDirty();
        }
    }
    //@+node:felix.20230910195228.12: *4* i.make_guide_lines
    public make_guide_lines(lines: string[]): string[] {
        /**
         * Importer.make_guide_lines.
         * 
         * Return a list of **guide lines** that simplify the detection of blocks.
         * This default method removes all comments and strings from the original lines.
         * The perl importer overrides this method to delete regexes as well as comments and strings.
         */
        return this.delete_comments_and_strings([...lines]);
    }
    //@+node:felix.20230910195228.13: *4* i.preprocess_lines
    /**
     * A hook to enable preprocessing lines before calling x.find_blocks.
     *
     * Xml_Importer uses this hook to split lines.
     */
    public preprocess_lines(lines: string[]): string[] {

        return lines;

    }
    //@+node:felix.20230910195228.14: *4* i.postprocess
    /**
     * Importer.postprocess.  A hook for language-specific post-processing.
     *
     * Python_Importer overrides this method.
     *
     * * Important : The RecursiveImportController (RIC) class contains a
     * * language-independent postpass that adjusts headlines of all imported nodes.
     */
    public postprocess(parent: Position): void {
        // pass
    }
    //@+node:felix.20230910195228.15: *4* i.regularize_whitespace
    /**
     * Importer.regularize_whitespace.
     * 
     * Regularize leading whitespace in s:
     * Convert tabs to blanks or vice versa depending on the @tab_width in effect.
     * 
     * Subclasses may override this method to suppress this processing.
     */
    public regularize_whitespace(lines: string[]): string[] {

        const kind: string = this.tab_width > 0 ? 'tabs' : 'blanks';
        const kind2: string = this.tab_width > 0 ? 'blanks' : 'tabs';
        const fn: string = g.shortFileName(this.root?.h);
        let count: number = 0;
        const result: string[] = [];
        const tab_width: number = this.tab_width;

        if (tab_width < 0) {  // Convert tabs to blanks.
            for (let n: number = 0; n < lines.length; n++) {
                const line: string = lines[n];
                let [i, w] = g.skip_leading_ws_with_indent(line, 0, tab_width);
                // Use negative width.
                const s: string = g.computeLeadingWhitespace(w, -Math.abs(tab_width)) + line.slice(i);
                if (s !== line) {
                    count++;
                }
                result.push(s);
            }
        } else if (tab_width > 0) {  // Convert blanks to tabs.
            for (let n: number = 0; n < lines.length; n++) {
                const line: string = lines[n];
                // Use positive width.
                const s: string = g.optimizeLeadingWhitespace(line, Math.abs(tab_width));
                if (s !== line) {
                    count++;
                }
                result.push(s);
            }
        }

        if (count > 0 && !g.unitTesting) {
            g.es(`changed leading ${kind2} to ${kind} in ${count} line${count !== 1 ? 's' : ''} in ${fn}`);
        }

        return result;
    }
    //@+node:felix.20230910195228.16: *3* i: Utils
    // Subclasses are unlikely ever to need to override these methods.
    //@+node:felix.20230910195228.17: *4* i.compute_common_lws
    /**
     * Return the length of the common leading indentation of all non-blank
     * lines in all blocks.
     * 
     * This method assumes that no leading whitespace contains intermixed tabs and spaces.
     * 
     * The returned string should consist of all blanks or all tabs.
     */
    public compute_common_lws(blocks: Block[]): string {

        if (!blocks || blocks.length === 0) {
            return '';
        }

        const lws_list: number[] = [];

        for (const block of blocks) {
            const [, , start, end] = block;
            const lines: string[] = this.lines.slice(start, end);

            for (const line of lines) {
                const stripped_line: string = line.trimLeft();

                if (stripped_line) {  // Skip empty lines
                    lws_list.push(line.length - stripped_line.length);
                }
            }
        }

        const n: number = lws_list.length > 0 ? Math.min(...lws_list) : 0;
        const ws_char: string = this.tab_width < 1 ? ' ' : '\t';

        return ws_char.repeat(n);
    }
    //@+node:felix.20230910195228.18: *4* i.create_placeholders
    /**
     * Create placeholder nodes between the current level (parents.length) and the desired level.
     * The org and otl importers use this method.
     */
    public create_placeholders(level: number, lines_dict: Record<string, string[]>, parents: Position[]): void {

        if (level <= parents.length) {
            return;
        }

        let n: number = level - parents.length;
        console.assert(n > 0);
        console.assert(level >= 0);

        while (n > 0) {
            n--;

            const parent: Position = parents[parents.length - 1];
            const child: Position = parent.insertAsLastChild();
            child.h = `placeholder level ${parents.length}`;
            parents.push(child);
            lines_dict[child.v.gnx] = [];
        }
    }
    //@+node:felix.20230910195228.19: *4* i.delete_comments_and_strings
    /**
     * Delete all comments and strings from the given lines.
     * 
     * The resulting lines form **guide lines**. The input and guide
     * lines are "parallel": they have the same number of lines.
     * 
     * Analyzing the guide lines instead of the input lines is the
     * simplifying trick behind the new importers.
     */
    public delete_comments_and_strings(lines: string[]): string[] {

        const string_delims: string[] = this.string_list;
        let [line_comment, start_comment, end_comment] = g.set_delims_from_language(this.language);
        let target: string = '';  // The string ending a multi-line comment or string.
        const escape: string = '\\';
        const result: string[] = [];

        for (const line of lines) {
            const result_line: string[] = [];
            let skip_count: number = 0;

            for (let i: number = 0; i < line.length; i++) {
                const ch: string = line[i];

                if (ch === '\n') {
                    break;  // Avoid appending the newline twice.
                }

                if (skip_count > 0) {
                    skip_count--;  // Skip the character.
                    continue;
                }

                if (target) {
                    if (line.startsWith(target, i)) {
                        if (target.length > 1) {
                            // Skip the remaining characters of the target.
                            skip_count = target.length - 1;
                        }
                        target = '';  // Begin accumulating characters.
                    }
                } else if (ch === escape) {
                    skip_count = 1;
                    continue;
                } else if (line_comment && line.startsWith(line_comment, i)) {
                    break;  // Skip the rest of the line.
                } else if (string_delims.some(z => line.startsWith(z, i))) {
                    // Allow multi-character string delimiters.
                    for (const z of string_delims) {
                        if (line.startsWith(z, i)) {
                            target = z;
                            if (z.length > 1) {
                                skip_count = z.length - 1;
                            }
                            break;
                        }
                    }
                } else if (start_comment && line.startsWith(start_comment, i)) {
                    target = end_comment;
                    if (start_comment.length > 1) {
                        // Skip the remaining characters of the starting comment delim.
                        skip_count = start_comment.length - 1;
                    }
                } else {
                    result_line.push(ch);
                }
            }

            // End the line and append it to the result.
            if (line.endsWith('\n')) {
                result_line.push('\n');
            }

            result.push(result_line.join(''));
        }

        console.assert(result.length === lines.length);  // A crucial invariant.
        return result;
    }
    //@+node:felix.20230910195228.20: *4* i.get_str_lws
    /**
     * Return the characters of the lws of s.
     */
    public get_str_lws(s: string): string {
        const match: RegExpMatchArray | null = s.match(/^([ \t]*)/);
        return match ? match[0] : '';
    }
    //@+node:felix.20230910195228.21: *4* i.remove_common_lws
    /**
     * Remove the given leading whitespace from all lines of p.b.
     */
    remove_common_lws(lws: string, p: Position): void {

        if (lws.length === 0) {
            return;
        }

        console.assert(lws.trim() === lws, JSON.stringify(lws));

        const n: number = lws.length;
        const lines: string[] = g.splitLines(p.b);
        const result: string[] = [];

        for (const line of lines) {
            const stripped_line: string = line.trim();
            console.assert(!stripped_line || line.startsWith(lws), JSON.stringify(line));
            result.push(stripped_line ? line.slice(n) : line);
        }

        p.b = result.join('');
    }
    //@+node:felix.20230910195228.22: *4* i.trace_blocks
    /**
     * For debugging: trace the list of blocks.
     */
    trace_blocks(blocks: Block[]): void {

        if (!blocks || blocks.length === 0) {
            g.trace('No blocks');
            return;
        }

        console.log('');
        console.log('Blocks...');

        const lines: string[] = this.lines;

        for (const z of blocks) {
            let [kind2, name2, start2, startBody2, end2] = z;
            const tag: string = `  ${kind2.padEnd(10)} ${name2.padEnd(20)} ${start2.toString().padStart(4)} ${startBody2.toString().padStart(4)} ${end2.toString().padStart(4)}`;
            g.printObj(lines.slice(start2, end2), tag);
        }

        console.log('End of Blocks');
        console.log('');
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
