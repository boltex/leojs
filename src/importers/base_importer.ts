//@+leo-ver=5-thin
//@+node:felix.20230522010520.1: * @file src/importers/base_importer.ts
/**
 * base_importer.ts: The base Importer class used by almost all importers.
 */

import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';

//@+others
//@+node:felix.20231010212501.1: ** class Block
/**
 * A class containing data about imported blocks.
 */
export class Block {

    child_blocks: Block[];
    end: number;
    kind: string;
    lines: string[];
    name: string;
    parent_v: VNode | undefined;
    start: number;
    start_body: number;
    v: VNode | undefined;

    constructor(
        kind: string, name: string, start: number, start_body: number, end: number, lines: string[]
    ) {
        this.child_blocks = [];
        this.end = end;
        this.kind = kind;
        this.lines = lines;
        this.name = name;
        this.parent_v = undefined;
        this.start = start;
        this.start_body = start_body;
        this.v = undefined;
    }

    //@+others
    //@+node:felix.20231010212501.2: *3* Block.__repr__
    public valueOf(): string {
        const kind_name_s = `${this.kind} ${this.name}`;
        const parent_v_s = this.parent_v ? this.parent_v.h : '<no parent_v>';
        const v_s = this.v ? this.v.h : '<no v>';
        return (
            `Block: kind/name: ${kind_name_s} `
            + `${this.start} ${this.start_body} ${this.end} `
            + `parent_v: ${parent_v_s} v: ${v_s}`
        );
    }

    public toString(): string {
        return this.valueOf();
    }
    //@+node:felix.20231010212501.3: *3* Block.dump_lines
    public dump_lines(): void {
        g.printObj(this.lines.slice(this.start, this.end), this.valueOf());
    }
    //@+node:felix.20231010212501.4: *3* Block.long_repr
    /**
     * A longer form of Block.__repr__
     */
    public long_repr(): string {
        let child_blocks: string[] = [];
        for (const child_block of this.child_blocks) {
            child_blocks.push(`${child_block.kind}:${child_block.name}`);
        }
        const child_blocks_s = child_blocks.length > 0 ? child_blocks.join('\n') : '<no children>';
        // const lines_list = g.objToString(this.lines.slice(this.start, this.end), 'lines');
        const lines_s = this.lines.slice(this.start, this.end).join('');
        return `\n${this.valueOf()} child_blocks: ${child_blocks_s}\n${lines_s}`;
    }
    //@-others

}
//@+node:felix.20230910195228.1: ** class Importer
/**
 * The base class for almost all of Leo's importers.
 *
 * Many importers only define `block_patterns` and `language` class ivars.
 *
 * Analyzing **guide lines** (lines without comments and strings)
 * greatly simplifies this class and all of Leo's importers.
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
    public block_patterns: [string, RegExp][] = [];
    public string_list: string[] = ['"', "'"];

    public c: Commands;
    public root: Position | undefined;
    public single_comment!: string;
    public block1!: string;
    public block2!: string;
    public tab_width: number = 0;
    public lines: string[] = [];
    public guide_lines: string[] = [];

    //@+others
    //@+node:felix.20230910195228.2: *3* i.__init__
    /**
     * Importer.__init__
     */
    constructor(c: Commands) {

        this.c = c;  // May be None.
        this.root = undefined;

    }
    public __init__(): void {
        g.assert(this.language, new Error().stack || '');  // Do not remove.
        const delims = g.set_delims_from_language(this.language);
        [this.single_comment, this.block1, this.block2] = delims;
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
                g.assert(false, message);
            } else {
                g.es(message);
            }
        }
        return ok;

    }
    //@+node:felix.20231010220955.1: *4* i.compute_body
    /**
     * Return the regularized body text from the given list of lines.
     * 
     * In most contexts removing leading blank lines is appropriate.
     * If not, the caller can insert the desired blank lines.
     */
    public compute_body(lines: string[]): string {
        const s: string = lines.join('');
        return s.trim() ? s.replace(/^\n+/, '').trimEnd() + '\n' : '';
    }
    //@+node:felix.20230910195228.5: *4* i.compute_headline
    /**
     * Importer.compute_headline.
     *
     * Return the headline for the given block.
     * Subclasses may override this method as necessary.
     */
    public compute_headline(block: Block): string {
        const name_s: string = block.name || `unnamed ${block.kind}`;
        return `${block.kind} ${name_s}`;
    }
    //@+node:felix.20230910195228.7: *4* i.find_blocks
    /**
     * Importer.find_blocks: Subclasses may override this method.
     * 
     * Using self.block_patterns and self.guide_lines, return a list of all
     * blocks in the given range of *guide* lines.
     * 
     * **Important**: An @others directive will refer to the returned blocks,
     *                so there must be *no gaps* between blocks!
     */
    public find_blocks(i1: number, i2: number): Block[] {
        const min_size: number = this.minimum_block_size;
        let i: number = i1, prev_i: number = i1, results: Block[] = [];

        while (i < i2) {
            let progress: number = i;
            const s: string = this.guide_lines[i];
            i++;

            // Assume that no pattern matches a compound statement.
            for (const [kind, pattern] of this.block_patterns) {

                // * In python, 'match' only matches from start of string so add '^' if not at start of regex.
                const matchPattern = pattern.source.startsWith('^') ? pattern : new RegExp('^' + pattern.source);
                const m: RegExpMatchArray | null = s.match(matchPattern);

                if (m) {
                    // cython may include trailing whitespace.
                    const name: string = m[1].trim();
                    const end: number = this.find_end_of_block(i, i2);
                    g.assert(i1 + 1 <= end && end <= i2, `Assertion failed: ${i1} <= ${end} <= ${i2}`);

                    // Don't generate small blocks.
                    if (min_size === 0 || end - prev_i > min_size) {
                        const block: Block = new Block(kind, name, prev_i, i, end, this.lines);
                        results.push(block);
                        prev_i = end;
                        i = prev_i;
                    } else {
                        i = end;
                    }
                    break;
                }
            }
            g.assert(i > progress, "Progress not made in find_blocks");
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
        g.assert(this.guide_lines[i - 1].includes('{'));
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
     * Five importers override this method.
     *
     * Note:  i.gen_lines adds the @language and @tabwidth directives.
     */
    public gen_block(parent: Position): void {
        let todo_list: Block[] = [];
        let result_blocks: Block[] = [];

        // Add an outer block to the results list.
        const outer_block = new Block('outer', 'outer-block', 0, 0, this.lines.length, this.lines);
        result_blocks.push(outer_block);

        // Add all outer blocks to the to-do list.
        todo_list = this.find_blocks(0, this.lines.length);

        // Link the blocks to the outer block.
        for (const block of todo_list) {
            block.parent_v = parent.v;
            outer_block.child_blocks.push(block);
        }

        // Handle blocks until the to-do list is empty.
        while (todo_list.length > 0) {
            // Get the next block. This will be the parent block of inner blocks.
            const block = todo_list.shift() as Block;
            const parent_v = block.parent_v!;
            g.assert(parent_v instanceof VNode);

            // Allocate and set block.v
            const child_v = parent_v.insertAsLastChild();
            child_v.h = this.compute_headline(block);
            block.v = child_v;
            g.assert(child_v instanceof VNode);

            // Add the block to the results.
            result_blocks.push(block);

            // Find the inner blocks.
            const inner_blocks = this.find_blocks(block.start_body, block.end);

            // Link inner blocks and add them to the to-do list.
            for (const inner_block of inner_blocks) {
                block.child_blocks.push(inner_block);
                inner_block.parent_v = child_v;
                todo_list.push(inner_block);
            }
        }

        // Post pass: generate all bodies
        this.generate_all_bodies(parent, outer_block, result_blocks);
    }
    //@+node:felix.20231010223113.1: *4* i.generate_all_bodies
    /**
     * Carefully generate bodies from the given blocks.
     * 
     * @param {Position} parent - The parent Position object.
     * @param {Block} outer_block - The outermost block.
     * @param {Block[]} result_blocks - The list of resulting blocks.
     */
    public generate_all_bodies(parent: Position, outer_block: Block, result_blocks: Block[]): void {
        // Keys: VNodes containing @others directives.
        const at_others_dict: { [key: string]: boolean } = {}; // Key is gnx
        const seen_blocks: Block[] = []; // Key is block.toString()
        const seen_vnodes: { [key: string]: boolean } = {}; // Key is gnx

        //@+<< i.generate_all_bodies: initial checks >>
        //@+node:felix.20231010223113.2: *5* << i.generate_all_bodies: initial checks >>
        // An initial sanity check.
        if (result_blocks.length > 0) {
            const block0 = result_blocks[0];
            g.assert(outer_block === block0);
        }
        //@-<< i.generate_all_bodies: initial checks >>

        //@+others  // Define helper functions.
        //@+node:felix.20231010223113.4: *5* function: find_all_child_lines
        /**
         * Find all lines that will be covered by @others
         */
        const find_all_child_lines = (block: Block): [number, number] => {
            g.assert(block.child_blocks.length > 0, "Assertion failed: block has no child blocks.");
            const block0 = block.child_blocks[0];
            let start = block0.start;
            let end = block0.end;
            for (const child_block of block.child_blocks) {
                start = Math.min(start, child_block.start);
                end = Math.max(end, child_block.end);
            }
            return [start, end];
        };
        //@+node:felix.20231010223113.5: *5* function: handle_block_with_children
        /**
         * A block with children.
         */
        const handle_block_with_children = (block: Block, block_common_lws: string): void => {
            // Find all lines that will be covered by @others.
            const [children_start, children_end] = find_all_child_lines(block);

            // Add the head lines to block.v.
            const head_lines = this.lines.slice(block.start, children_start);
            block.v!.b = this.compute_body(head_lines);

            // Add an @others directive if necessary.
            if (!at_others_dict.hasOwnProperty(block.v!.gnx)) {
                at_others_dict[block.v!.gnx] = true;
                block.v!.b = `${block.v!.b}${block_common_lws}@others\n`;
            }

            // Add the tail lines to block.v
            const tail_lines = this.lines.slice(children_end, block.end);
            const tail_s = this.compute_body(tail_lines);
            if (tail_s.trim()) {
                block.v!.b = block.v!.b.trimEnd() + '\n' + tail_s;
            }

            // Alter block.end.
            block.end = children_start;
        };
        //@+node:felix.20231010223113.6: *5* function: remove_lws_from_blocks
        /**
         * Remove the given lws from all given blocks, replacing self.lines in place.
         */
        const remove_lws_from_blocks = (blocks: Block[], common_lws: string): void => {
            const n = this.lines.length;
            for (const block of blocks) {
                const lines = this.lines.slice(block.start, block.end);
                const lines2 = this.remove_common_lws(common_lws, lines);
                this.lines.splice(block.start, block.end - block.start, ...lines2);
            }
            g.assert(n === this.lines.length);
        };
        //@-others

        // Note: i.gen_lines adds the @language and @tabwidth directives.
        if (!outer_block.child_blocks || !outer_block.child_blocks.length) {
            // Put everything in parent.b.
            // Do *not* change parent.h!
            parent.b = this.compute_body(outer_block.lines);
            return;
        }
        outer_block.v = parent.v;

        // The main loop
        let todo_list: Block[] = [outer_block];

        while (todo_list.length > 0) {
            const block = todo_list.shift() as Block; // equivalent to pop(0) in Python
            const v = block.v;

            //@+<< check block and v >>
            //@+node:felix.20231010223113.7: *5* << check block and v >>
            g.assert(block instanceof Block, `Assertion failed: ${block}`);
            g.assert(v, `Assertion failed: ${block}`);
            g.assert(v!.constructor.name === 'VNode', `Assertion failed: ${v}`);

            // Make sure we handle each block and VNode once.
            // g.assert(!(block.toString() in seen_blocks), `Assertion failed: ${block}`);
            g.assert(!seen_blocks.includes(block));
            g.assert(!(v!.gnx in seen_vnodes), `Assertion failed: ${v}`);
            seen_blocks.push(block);
            seen_vnodes[v!.gnx] = true;

            // This method must alter neither self.lines nor block lines.
            if (JSON.stringify(this.lines) !== JSON.stringify(block.lines)) {
                console.log('Assert failed: this.lines', this.lines);
                console.log('Assert failed: block.lines', block.lines);
            }
            g.assert(JSON.stringify(this.lines) === JSON.stringify(block.lines));
            //@-<< check block and v >>

            // Remove common_lws from self.lines
            const block_common_lws = this.compute_common_lws(block.child_blocks);
            remove_lws_from_blocks(block.child_blocks, block_common_lws);

            // Handle the block and any child blocks.
            if (block !== outer_block) {
                block.v!.h = this.compute_headline(block);
            }
            if (block.child_blocks.length > 0) {
                handle_block_with_children(block, block_common_lws);
            } else {
                block.v!.b = this.compute_body(this.lines.slice(block.start, block.end));
            }

            // Add all child blocks to the to-do list.
            todo_list.push(...block.child_blocks);
        }
        //@+<< i.generate_all_bodies: final checks >>
        //@+node:felix.20231010223113.8: *5* << i.generate_all_bodies: final checks >>
        g.assert(result_blocks[0].kind === 'outer', result_blocks[0].toString());

        // Make sure we've seen all blocks and vnodes.
        for (const block of result_blocks) {
            g.assert(seen_blocks.includes(block), block.toString());
            if (!(seen_blocks.includes(block))) {
                console.log('seen_blocks', seen_blocks);
                console.log('block', block);
            }
            if (block.v) {
                g.assert(block.v.gnx in seen_vnodes, block.v.toString());
            }
        }
        //@-<< i.generate_all_bodies: final checks >>

        // A hook for Python_Importer.
        this.postprocess(parent, result_blocks);

        // Note: i.gen_lines appends @language and @tabwidth directives to parent.b.

    }
    //@+node:felix.20230910195228.10: *4* i.gen_lines (top level)
    /**
     * Importer.gen_lines: Allocate lines to the parent and descendant nodes.
     *
     * Subclasses may override this method, but none do.
     */
    public gen_lines(lines: string[], parent: Position): void {
        try {
            g.assert(this.root && this.root.__eq__(parent));
            this.lines = lines;
            // Delete all children.
            parent.deleteAllChildren();
            // Create the guide lines.
            this.guide_lines = this.make_guide_lines(lines);
            const n1: number = this.lines.length;
            const n2: number = this.guide_lines.length;
            g.assert(n1 === n2);
            // Start the recursion.
            // Generate all blocks.
            this.gen_block(parent);
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
    public postprocess(parent: Position, result_blocks: Block[]): void {
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

            g.assert(g.compareArrays(this.lines, block.lines));
            const lines = this.lines.slice(block.start, block.end);

            for (const line of lines) {
                const stripped_line: string = line.trimStart();

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
        g.assert(n > 0);
        g.assert(level >= 0);

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
     * Return **guide-lines** from the lines, replacing strings and multi-line
     * comments with spaces, thereby preserving (within the guide-lines) the
     * position of all significant characters.
     * Analyzing the guide lines instead of the input lines is the simplifying
     * trick behind the new importers.
     * The input and guide lines are "parallel": they have the same number of
     * lines.
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
            for (let i = 0; i < line.length; i++) {
                const ch: string = line[i];
                if (ch === '\n') {
                    break; // Terminate. No double newlines allowed.
                } else if (skip_count > 0) {
                    result_line.push(' ');
                    skip_count -= 1;
                } else if (ch === escape) {
                    g.assert(skip_count === 0);
                    result_line.push(' ');
                    skip_count = 1;
                } else if (target) {
                    result_line.push(' ');
                    if (g.match(line, i, target)) {
                        skip_count = Math.max(0, (target.length - 1));
                        target = '';
                    }
                } else if (line_comment && line.startsWith(line_comment, i)) {
                    break;
                } else if (string_delims.some(z => g.match(line, i, z))) {
                    result_line.push(' ');
                    for (const z of string_delims) {
                        if (g.match(line, i, z)) {
                            target = z;
                            skip_count = Math.max(0, (z.length - 1));
                            break;
                        }
                    }
                } else if (start_comment && g.match(line, i, start_comment)) {
                    result_line.push(' ');
                    target = end_comment;
                    skip_count = Math.max(0, (start_comment.length - 1));
                } else {
                    result_line.push(ch);
                }
            }
            const end_s: string = line.endsWith('\n') ? '\n' : '';
            result.push(result_line.join('').trimEnd() + end_s);
        }
        g.assert(result.length === lines.length);  // A crucial invariant.
        return result;


        // const string_delims: string[] = this.string_list;
        // let [line_comment, start_comment, end_comment] = g.set_delims_from_language(this.language);
        // let target: string = '';  // The string ending a multi-line comment or string.
        // const escape: string = '\\';
        // const result: string[] = [];

        // for (const line of lines) {
        //     const result_line: string[] = [];
        //     let skip_count: number = 0;

        //     for (let i: number = 0; i < line.length; i++) {
        //         const ch: string = line[i];

        //         if (ch === '\n') {
        //             break;  // Avoid appending the newline twice.
        //         }

        //         if (skip_count > 0) {
        //             skip_count--;  // Skip the character.
        //             continue;
        //         }

        //         if (target) {
        //             if (line.startsWith(target, i)) {
        //                 if (target.length > 1) {
        //                     // Skip the remaining characters of the target.
        //                     skip_count = target.length - 1;
        //                 }
        //                 target = '';  // Begin accumulating characters.
        //             }
        //         } else if (ch === escape) {
        //             skip_count = 1;
        //             continue;
        //         } else if (line_comment && line.startsWith(line_comment, i)) {
        //             break;  // Skip the rest of the line.
        //         } else if (string_delims.some(z => line.startsWith(z, i))) {
        //             // Allow multi-character string delimiters.
        //             for (const z of string_delims) {
        //                 if (line.startsWith(z, i)) {
        //                     target = z;
        //                     if (z.length > 1) {
        //                         skip_count = z.length - 1;
        //                     }
        //                     break;
        //                 }
        //             }
        //         } else if (start_comment && line.startsWith(start_comment, i)) {
        //             target = end_comment;
        //             if (start_comment.length > 1) {
        //                 // Skip the remaining characters of the starting comment delim.
        //                 skip_count = start_comment.length - 1;
        //             }
        //         } else {
        //             result_line.push(ch);
        //         }
        //     }

        //     // End the line and append it to the result.
        //     if (line.endsWith('\n')) {
        //         result_line.push('\n');
        //     }

        //     result.push(result_line.join(''));
        // }

        // g.assert(result.length === lines.length);  // A crucial invariant.
        // return result;
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
    public remove_common_lws(lws: string, lines: string[]): string[] {

        if (lws.length === 0) {
            return lines;
        }

        g.assert(lws.trim() === '', JSON.stringify(lws));

        const n: number = lws.length;
        const result: string[] = [];

        for (const line of lines) {
            const stripped_line: string = line.trim();
            g.assert(!stripped_line || line.startsWith(lws), JSON.stringify(line));
            result.push(stripped_line ? line.slice(n) : line);
        }

        return result;
    }
    //@+node:felix.20230910195228.22: *4* i.trace_blocks
    /**
     * For debugging: trace the list of blocks.
     */
    public trace_blocks(blocks: Block[]): void {

        if (!blocks || blocks.length === 0) {
            g.trace('No blocks');
            return;
        }

        console.log('');
        console.log('Blocks...');

        const lines: string[] = this.lines;

        for (const block of blocks) {
            this.trace_block(block);
        }

        console.log('End of Blocks');
        console.log('');
    }

    public trace_block(block: Block): void {
        const tag = `  ${block.kind.padEnd(10)} ${block.name.padStart(20)} ${block.start} ${block.start_body} ${block.end}`;
        g.printObj(block.lines.slice(block.start, block.end), undefined, undefined, tag);
    }


    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
