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

    public valueOf(): string {
        const kind_name_s = `${this.kind} ${this.name}`;
        const lines = this.lines.slice(this.start, this.end);
        const result: string[] = [
            `Block ${this.start}:${this.start_body}:${this.end} ${JSON.stringify(kind_name_s)}\n`
        ];
        for (let i = 0; i < lines.length; i++) {
            const s = lines[i];
            result.push(`  ${i.toString().padStart(3, " ")} ${JSON.stringify(s)}\n`);
        }
        return result.join('');
    }

    public toString(): string {
        return this.valueOf();
    }

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
    public at_others_dict: { [key: string]: boolean } = {}; // key is gnx

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
    //@+node:felix.20250823124337.1: *3* i: Generic methods: may be overridden
    // The pipeline.
    //@+node:felix.20250823124337.2: *4* 1: i.import_from_string (entry) & helpers
    /**
     * Importer.import_from_string: the so-called **Import pipeline**.
     * The top-level code for almost all importers.
     *
     * parent: An @<file> node containing the absolute path to the to-be-imported file.
     * s:      The contents of the file.
     *
     */
    public import_from_string(parent: Position, s: string) : void {
        const c = this.c;
        const root = parent.copy();
        this.root = root;
        this.tab_width = c.getTabWidth(root);

        // Fix #449: Cloned @auto nodes duplicates section references.
        if(parent.isCloned() && parent.hasChildren()){
            return;
        }
        parent.deleteAllChildren();
        let lines: string[] = [];

        try{
            // Check for intermixed blanks and tabs.
            lines = g.splitLinesAtNewline(s);
            const ws_ok = this.check_blanks_and_tabs(lines);  // Issues warnings.
            if (!ws_ok){
                lines = this.regularize_whitespace(lines);
            }
            // A hook for importers: preprocess lines.
            this.lines = lines = this.preprocess_lines(lines);

            // Create the guide lines.
            this.guide_lines = this.make_guide_lines(lines);
            const n1 = this.lines.length;
            const n2 = this.guide_lines.length;
            g.assert( n1 === n2, `should be the same length: ${n1}, ${n2}`);  // A crucial invariant!

            // Generate all blocks.
            this.gen_block(parent);

            // Add trailing lines.
            if (this.root.isAnyAtFileNode()){  // #4385.
                parent.b += `@language ${this.language}\n@tabwidth ${this.tab_width}\n`
            }

            // #1451: Importers should never dirty the outline.
            for (const p of root.self_and_subtree()){
                p.clearDirty();
            }
        }
        catch (e){
            g.trace(`Importer error: ${e}`);
            parent.deleteAllChildren();
            parent.b = lines.join('');
            if (g.unitTesting){
             throw(e);
            }
        }
    }
    //@+node:felix.20250823124337.3: *5* 1A: i.check_blanks_and_tabs
    /**
     * Importer.check_blanks_and_tabs.
     *
     * Check for intermixed blank & tabs.
     *
     * Subclasses may override this method to suppress this check.
     */
    public check_blanks_and_tabs(lines: string[]): boolean {

        // Do a quick check for mixed leading tabs/blanks.
        const fn = g.shortFileName(this.root!.h);
        const w = this.tab_width;
        let blanks = 0;
        let tabs = 0;
        for (const s of lines){
            const lws = this.get_str_lws(s)
            blanks += (lws.match(/ /g) || []).length;
            tabs += (lws.match(/\t/g) || []).length;
        }

        let ok: boolean;
        let message: string;

        // Make sure whitespace matches @tabwidth directive.
        if (w < 0) {
            ok = tabs === 0;
            message = `tabs found with @tabwidth ${w} in ${fn}`;
        } else if (w > 0) {
            ok = blanks === 0;
            message = `blanks found with @tabwidth ${w} in ${fn}`;
        } else {
            ok = true;
            message = '';
        }

        if (ok) {
            ok = (blanks === 0 || tabs === 0);
            message = `intermixed blanks and tabs in: ${fn}`;
        }

        if (!ok) {
            if (g.unitTesting) {
                throw new Error(message);
            } else {
                g.es(message);
            }
        }

        return ok;
    }
    //@+node:felix.20250823124337.4: *5* 1B: i.regularize_whitespace
    /**
     * Importer.regularize_whitespace.
     *
     * Regularize leading whitespace in s:
     * Convert tabs to blanks or vice versa depending on the @tabwidth in effect.
     *
     * Subclasses may override this method to suppress this processing.
     */
    public regularize_whitespace(lines: string[]): string[] {
        
        const kind = this.tab_width > 0 ? "tabs" : "blanks";
        const kind2 = this.tab_width > 0 ? "blanks" : "tabs";
        let count = 0;
        const result: string[] = [];
        const tab_width = this.tab_width;
        
        if (tab_width < 0) {  
            // Convert tabs to blanks.
            for (let n = 0; n < lines.length; n++) {
                const line = lines[n];
                const [i, w] = g.skip_leading_ws_with_indent(line, 0, tab_width);
                // Use negative width.
                const s = g.computeLeadingWhitespace(w, -Math.abs(tab_width)) + line.slice(i);
                if (s !== line) {
                    count += 1;
                }
                result.push(s);
            }
        } else if (tab_width > 0) {  
            // Convert blanks to tabs.
            for (let n = 0; n < lines.length; n++) {
                const line = lines[n];
                // Use positive width.
                const s = g.optimizeLeadingWhitespace(line, Math.abs(tab_width));
                if (s !== line) {
                    count += 1;
                }
                result.push(s);
            }
        }

        if (count && !g.unitTesting) {
            console.log(`${this.root!.h}:\nchanged leading ${kind2} to ${kind} in ${count} line${g.plural(count)}`);
        }
        return result;

    }
    //@+node:felix.20250823124337.5: *5* 1C: i.preprocess_lines
    /**
     * A hook to enable preprocessing lines before calling x.find_blocks.
     *
     * Xml_Importer uses this hook to split lines.
     */
    public preprocess_lines(lines: string[]): string[]{
        return lines;
    }
    //@+node:felix.20250823124337.6: *5* 2D: i.make_guide_lines
    /**
     * Importer.make_guide_lines.
     *
     * Return a list if **guide lines** that simplify the detection of blocks. 
     *
     * This default method removes all comments and strings from the original lines.
     *
     * The perl importer overrides this methods to delete regexes as well
     * as comments and strings.
     */
    public make_guide_lines(lines: string[]):string[] {
        return this.delete_comments_and_strings([...lines])
    }
    //@+node:felix.20250823124337.7: *5* 2E: i.delete_comments_and_strings
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
                        skip_count = Math.max(0, target.length - 1);
                        target = '';
                    }
                } else if (line_comment && line.startsWith(line_comment, i)) {
                    break;
                } else if (string_delims.some(z => g.match(line, i, z))) {
                    result_line.push(' ');
                    for (const z of string_delims) {
                        if (g.match(line, i, z)) {
                            target = z;
                            skip_count = Math.max(0, z.length - 1);
                            break;
                        }
                    }
                } else if (start_comment && g.match(line, i, start_comment)) {
                    result_line.push(' ');
                    target = end_comment;
                    skip_count = Math.max(0, start_comment.length - 1);
                } else {
                    result_line.push(ch);
                }
            }
            const end_s: string = line.endsWith('\n') ? '\n' : '';
            result.push(result_line.join('').trimEnd() + end_s);
        }
        g.assert(result.length === lines.length);  // A crucial invariant.
        return result;
    }
    //@+node:felix.20250823124337.8: *4* 2: i.gen_block & helpers
    /**
     * Importer.gen_block.
     *
     * Create all descendant blocks and their parent nodes.
     *
     * Five importers override this method.
     *
     * Note: i.import_from_string adds the @language and @tabwidth directives.
     */
    public gen_block(parent: Position): void {

        let todo_list: Block[] = [];
        let result_blocks: Block[] = [];

        // Create the outer block.
        const outer_block = new Block(
            'outer',
            'outer-block',
            0,
            0,
            this.lines.length,
            this.lines
        );

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
            const block = todo_list.shift()!;
            const parent_v = block.parent_v!;
            g.assert(parent_v instanceof VNode, parent_v.toString());

            // Allocate and set block.v
            const child_v = parent_v.insertAsLastChild();
            child_v.h = this.compute_headline(block);
            block.v = child_v;
            g.assert(child_v instanceof VNode, child_v.toString());

            // Add the block to the results.
            result_blocks.push(block);

            // Find the inner blocks.
            const inner_blocks = this.find_blocks(block.start_body, block.end);

            // Link inner blocks and add them to the to-do list.
            for (const inner_block of inner_blocks) {
                // We'll set inner_block.v later!
                block.child_blocks.push(inner_block);
                inner_block.parent_v = child_v;
                todo_list.push(inner_block);
            }
        }

        if (outer_block.child_blocks.length > 0) {
            this.generate_all_bodies(parent, outer_block, result_blocks);
            this.postprocess(parent);
        } else {
            // Put everything in parent.b. Do *not* change parent.h!
            parent.b = this.lines.join('');
        }
    }

    //@+node:felix.20250823124337.9: *5* 2A: i.find_blocks
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
                const matchPattern = pattern.source.startsWith('^')
                    ? pattern
                    : new RegExp('^' + pattern.source, pattern.flags);
                const m: RegExpMatchArray | null = s.match(matchPattern);

                if (m) {
                    // cython may include trailing whitespace.
                    const name: string = m[1].trim();
                    const end: number = this.find_end_of_block(i, i2);
                    g.assert(i1 + 1 <= end && end <= i2, `${i1}, ${end}, ${i2}`);

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
            g.assert(i > progress, g.callers());
        }
        return results;
    }
    //@+node:felix.20250823124337.10: *5* 2B: i.find_end_of_block
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

        // Determine the starting block level based on the previous line.
        let level = this.guide_lines[i - 1].includes('{') ? 1 : 0;

        while (i < i2) {
            const line = this.guide_lines[i];
            i++;
            for (const ch of line) {
                if (ch === '{') {
                    level++;
                } else if (ch === '}') {
                    level--;
                    if (level === 0) {
                        return i;
                    }
                }
            }
        }
        return i2;
    }
    //@+node:felix.20250823124337.11: *5* 2C: i.compute_headline
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
    //@+node:felix.20250823124337.12: *5* 2D: i.generate_all_bodies & helpers
    /**
     * Carefully generate bodies from the given blocks.
     */
    public generate_all_bodies(parent: Position, outer_block: Block, result_blocks: Block[]): void {
        const c = this.c;
        const at = c.atFileCommands;

        // Keys: VNodes containing @others directives.
        this.at_others_dict = {}; // Key is gnx
        const seen_blocks: Block[] = []; // Key is block.toString()
        const seen_vnodes: { [key: string]: boolean } = {}; // Key is gnx

        //The main loop.
        outer_block.v = parent.v;
        let todo_list: Block[] = [outer_block];

        while (todo_list.length > 0) {
            const block = todo_list.shift() as Block; // equivalent to pop(0) in Python
            const v = block.v;
            //@+<< check block and v >>
            //@+node:felix.20250823124337.13: *6* << check block and v >>
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
                g.printObj('Assert failed: this.lines', this.lines);
                g.printObj('Assert failed: block.lines', block.lines);
            }
            g.assert(JSON.stringify(this.lines) === JSON.stringify(block.lines));
            //@-<< check block and v >>

            // Remove common_lws from self.lines
            const block_common_lws = this.compute_common_lws(block.child_blocks);
            this.remove_lws_from_blocks(block.child_blocks, block_common_lws);

            // Handle the block and any child blocks.
            if (block !== outer_block) {
                block.v!.h = this.compute_headline(block);
            }

            if (block.child_blocks.length > 0) {
                this.handle_block_with_children(block, block_common_lws);
            } else {
               block.v!.b = this.lines.slice(block.start, block.end).join('');
            }

            // Add all child blocks to the to-do list.
            todo_list.push(...block.child_blocks);

            // Make sure we've seen all blocks and vnodes.
            for (const block of result_blocks) {
                g.assert(seen_blocks.includes(block), block.toString());
                if (block.v) {
                    g.assert(block.v.gnx in seen_vnodes, block.v.toString());
                }
            }

        }

    }
    //@+node:felix.20250823124337.14: *6* i.find_all_child_lines
    /**
     * Find all lines that will be covered by @others
     */
    public find_all_child_lines(block: Block): [number, number] {
        if (!block.child_blocks || block.child_blocks.length === 0) {
            throw new Error(`Block has no child_blocks: ${block}`);
        }

        const block0 = block.child_blocks[0];
        let start = block0.start;
        let end = block0.end;

        for (const child_block of block.child_blocks) {
            start = Math.min(start, child_block.start);
            end = Math.max(end, child_block.end);
        }

        return [start, end];
    }
    //@+node:felix.20250823124337.15: *6* i.handle_block_with_children
    /**
     * A block with children.
     */
    public handle_block_with_children(block: Block, block_common_lws: string): void {
        // A block with children.

        // Find all lines that will be covered by @others.
        const [children_start, children_end] = this.find_all_child_lines(block);

        // Add the head lines to block.v.
        const head_lines = this.lines.slice(block.start, children_start);
        block.v!.b = head_lines.join('');

        // Add an @others directive if necessary.
        if (!this.at_others_dict.hasOwnProperty(block.v!.gnx)) {
            this.at_others_dict[block.v!.gnx] = true;
            block.v!.b = `${block.v!.b}${block_common_lws}@others\n`;
        }

        // Add the tail lines to block.v
        const tail_lines = this.lines.slice(children_end, block.end);
        const tail_s = tail_lines.join('');
        if (tail_s) {
            block.v!.b = block.v!.b + tail_s;
        }

        // Alter block.end.
        block.end = children_start;
    }
    //@+node:felix.20250823124337.16: *6* i.remove_lws_from_blocks
    /**
     * Remove the given lws from all given blocks, replacing this.lines in place.
     */
    remove_lws_from_blocks(blocks: Block[], common_lws: string): void {
        const n = this.lines.length;

        for (const block of blocks) {
            const lines = this.lines.slice(block.start, block.end);
            const lines2 = this.remove_common_lws(common_lws, lines);
            this.lines.splice(block.start, block.end - block.start, ...lines2);
        }

        if (n !== this.lines.length) {
            throw new Error(`Assert failed: line count changed from ${n} to ${this.lines.length}`);
        }
    }
    //@+node:felix.20250823124337.17: *4* 3: i.postprocess & helper
    /**
     * Importer.postprocess.  A hook for language-specific post-processing.
     *
     * The Python_Importer and Rust_Importer classes override this method.
     *
     * **Note**: The RecursiveImportController class contains a postpass that
     *           adjusts headlines of *all* imported nodes.
     */
    public postprocess(parent: Position): void {
        this.move_blank_lines(parent);
    }
    //@+node:felix.20250823124337.18: *5* 3A: i.move_blank_lines
    /**
     * Move blank lines from the start of nodes to the end of previous sibling.
     */
    move_blank_lines(parent: Position): void {
        this.move_blank_lines_helper(parent.children());
    }

    move_blank_lines_helper(children: Iterable<Position>): void {
        for (const child of children) {
            this.move_one_blank_line(child);
            this.move_blank_lines_helper(child.children());
        }
    }

    /**
     * Move one blank line from the start of p.b to the end of p.back().b
     */
    move_one_blank_line(p: Position): void {
        const back = p.back();
        if (!back || !back.v) {
            return;
        }
        while (p.b) {
            const lines = g.splitLines(p.b);
            if (lines[0].trim()) {
                break;
            }
            back.b = back.b + '\n';
            p.b = lines.slice(1).join('');
        }
    }
    //@+node:felix.20250823124504.1: *3* i: Utils
    // Subclasses are unlikely ever to need to override these methods.
    //@+node:felix.20250823124504.2: *4* i.compute_common_lws
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
    //@+node:felix.20250823124504.3: *4* i.create_placeholders
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
    //@+node:felix.20250823124504.4: *4* i.lws_n
    lws_n(s: string): number {
        // Return the length of the leading whitespace for s.
        return s.length - s.trimStart().length;
    }
    //@+node:felix.20250823124504.5: *4* i.get_str_lws
    /**
     * Return the characters of the lws of s.
     */
    public get_str_lws(s: string): string {
        const match: RegExpMatchArray | null = s.match(/^([ \t]*)/);
        return match ? match[0] : '';
    }
    //@+node:felix.20250823124504.6: *4* i.remove_common_lws
    /**
     * Remove the given leading whitespace from all lines of p.b.
     */
    public remove_common_lws(lws: string, lines: string[]): string[] {
        if (lws.length === 0) {
            return lines;
        }

        g.assert(lws.trim() === '', JSON.stringify(lws));

        const n = lws.length;
        const result: string[] = [];

        for (const line of lines) {
            const stripped_line = line.trim();
            if (stripped_line) {
                const prefix = line.slice(0, n);
                g.assert(/^\s*$/.test(prefix), JSON.stringify(line));
                result.push(line.slice(n));
            } else {
                result.push(line);
            }
        }

        return result;
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
