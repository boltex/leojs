//@+leo-ver=5-thin
//@+node:felix.20220414231314.1: * @file src/commands/commanderEditCommands.ts
/**
 * Outline commands that used to be defined in leoCommands.py
 */
import * as g from '../core/leoGlobals';
import { commander_command } from '../core/decorators';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';

//@+others
//@+node:felix.20220414231634.1: ** Class CommanderEditCommands
export class CommanderEditCommands {
    //@+others
    //@+node:felix.20220414235045.1: *3* c_ec.convertAllBlanks
    @commander_command(
        'convert-all-blanks',
        'Convert all blanks to tabs in the selected outline.'
    )
    public convertAllBlanks(this: Commands): void {
        const c: Commands = this;
        const u = this.undoer;

        const undoType = 'Convert All Blanks';
        const current = c.p;
        if (g.app.batchMode) {
            c.notValidInBatchMode(undoType);
            return;
        }
        const d = c.scanAllDirectives(c.p);
        const tabWidth = d['tabwidth'];
        let count = 0;
        u.beforeChangeGroup(current, undoType);

        for (let p of current.self_and_subtree()) {
            let changed = false;
            const innerUndoData = u.beforeChangeNodeContents(p);
            if (p === current) {
                changed = c.convertBlanks();
                if (changed) {
                    count += 1;
                }
            } else {
                changed = false;
                const result: string[] = [];
                const text = p.v.b;
                const lines = text.split('\n');
                for (let line of lines) {
                    let i;
                    let w;
                    [i, w] = g.skip_leading_ws_with_indent(line, 0, tabWidth);
                    let s =
                        g.computeLeadingWhitespace(w, Math.abs(tabWidth)) +
                        line.slice(i); // use positive width.
                    if (s !== line) {
                        changed = true;
                    }
                    result.push(s);
                }
                if (changed) {
                    count += 1;
                    p.setDirty();
                    p.setBodyString(result.join('\n'));
                    u.afterChangeNodeContents(p, undoType, innerUndoData);
                }
            }
        }
        u.afterChangeGroup(current, undoType);
        if (!g.unitTesting) {
            g.es('blanks converted to tabs in', count, 'nodes');
            // Must come before c.redraw().
        }
    }

    //@+node:felix.20230312214917.1: *3* c_ec.convertBlanks
    @commander_command(
        'convert-blanks',
        'Convert *all* blanks to tabs in the selected node. ' +
        'Return True if the the p.b was changed.'
    )
    public convertBlanks(this: Commands): boolean {
        const c: Commands = this;
        const p = this.p;
        const u = this.undoer;
        const w = this.frame.body.wrapper;

        //
        // "Before" snapshot.
        const bunch = u.beforeChangeBody(p);
        let oldYview = w.getYScrollPosition();
        w.selectAllText();
        let head, lines, tail, oldSel;
        [head, lines, tail, oldSel, oldYview] = c.getBodyLines();
        //
        // Use the relative @tabwidth, not the global one.
        const d = c.scanAllDirectives(p);
        const tabWidth = d['tabwidth'];
        if (!tabWidth) {
            return false;
        }
        //
        // Calculate the result.
        let changed = false;
        const result: string[] = [];

        for (let line of lines) {
            // Use positive width.
            const s = g.optimizeLeadingWhitespace(line, Math.abs(tabWidth));
            if (s !== line) {
                changed = true;
            }
            result.push(s);
        }
        if (!changed) {
            return false;
        }
        //
        // Set p.b and w's text first.
        const middle = result.join('');
        p.b = head + middle + tail; // Sets dirty and changed bits.
        w.setAllText(head + middle + tail);
        //
        // Select all text and set scroll position.
        w.selectAllText();
        w.setYScrollPosition(oldYview);
        //
        // "after" snapshot.
        u.afterChangeBody(p, 'Indent Region', bunch);
        return true;
    }
    //@+node:felix.20230702194637.1: *3* c_ec.editHeadline (edit-headline)
    @commander_command(
        'edit-headline',
        'Begin editing the headline of the selected node.'
    )
    public editHeadline(): Thenable<unknown> {
        return g.app.gui.editHeadline();

        // c = self
        // k, tree = c.k, c.frame.tree
        // if g.app.batchMode:
        //     c.notValidInBatchMode("Edit Headline")
        //     return None, None
        // e, wrapper = tree.editLabel(c.p)
        // if k:
        //     # k.setDefaultInputState()
        //     k.setEditingState()
        //     k.showStateAndMode(w=wrapper)
        // return e, wrapper  # Neither of these is used by any caller.
    }
    //@+node:felix.20230221160425.3: *3* createFirstChildNode extract helper
    /**
     * A helper function for the three extract commands.
     */
    private createFirstChildNode(
        c: Commands,
        parent: Position,
        headline: string,
        body?: string
    ): Position {
        // #1955: don't strip trailing lines.
        if (!body) {
            body = '';
        }
        const p = parent.insertAsNthChild(0);
        p.initHeadString(headline);
        p.setBodyString(body);
        p.setDirty();
        c.checkOutline();
        return p;
    }
    //@+node:felix.20230221160425.1: *3* c_ec.extract
    @commander_command(
        'extract',
        'Create child node from the selected body text.'
    )
    public extract(this: Commands): void {
        //@+<< docstring for extract command >>
        //@+node:felix.20230221160425.2: *4* << docstring for extract command >>
        /**
         * Create child node from the selected body text.
         *
         * 1. If the selection starts with a section reference, the section
         *    name becomes the child's headline. All following lines become
         *    the child's body text. The section reference line remains in
         *    the original body text.
         *
         * 2. If the selection looks like a definition line (for the Python,
         *    JavaScript, CoffeeScript or Clojure languages) the
         *    class/function/method name becomes the child's headline and all
         *    selected lines become the child's body text.
         *
         *    You may add additional regex patterns for definition lines using
         *    @data extract-patterns nodes. Each line of the body text should a
         *    valid regex pattern. Lines starting with # are comment lines. Use \#
         *    for patterns starting with #.
         *
         * 3. Otherwise, the first line becomes the child's headline, and all
         *    selected lines become the child's body text.
         */
        //@-<< docstring for extract command >>

        //@+others
        //@+node:felix.20230221160425.4: *4* function extractDef
        const extractDef_patterns = [
            /\((?:def|defn|defui|deftype|defrecord|defonce)\s+(\S+)/, // clojure definition
            /^\s*(?:def|class)\s+(\w+)/, // python definitions
            /^\bvar\s+(\w+)\s*=\s*function\b/, // js function
            /^(?:export\s)?\s*function\s+(\w+)\s*\(/, // js function
            /\b(\w+)\s*:\s*function\s/, // js function
            /\.(\w+)\s*=\s*function\b/, // js function
            /(?:export\s)?\b(\w+)\s*=\s(?:=>|->)/, // coffeescript function
            /(?:export\s)?\b(\w+)\s*=\s(?:\([^)]*\))\s*(?:=>|->)/, // coffeescript function
            /\b(\w+)\s*:\s(?:=>|->)/, // coffeescript function
            /\b(\w+)\s*:\s(?:\([^)]*\))\s*(?:=>|->)/, // coffeescript function
        ];

        /**
         * Return the defined function/method/class name if s
         * looks like definition. Tries several different languages.
         */
        const extractDef = (c: Commands, s: string): string => {
            const patterns = c.config.getData('extract-patterns') || [];
            for (const p_pat of patterns) {
                try {
                    const pat = new RegExp(p_pat);
                    const m = pat.exec(s);
                    if (m && m.length) {
                        return m[1];
                    }
                } catch (e) {
                    g.es_print('bad regex in @data extract-patterns');
                    g.es_print(p_pat);
                }
            }
            for (const p_pat of extractDef_patterns) {
                const m = p_pat.exec(s);
                if (m && m.length) {
                    return m[1];
                }
            }
            return '';
        };
        //@+node:felix.20230221160425.5: *4* function extractDef_find
        const extractDef_find = (
            c: Commands,
            lines: string[]
        ): string | undefined => {
            for (const line of lines) {
                const def_h = extractDef(c, line.trim());
                if (def_h) {
                    return def_h;
                }
            }
            return undefined;
        };
        //@+node:felix.20230221160425.6: *4* function extractRef
        /**
         * Return s if it starts with a section name.
         */
        const extractRef = (c: Commands, s: string): string => {
            let i = s.indexOf('<<');
            let j = s.indexOf('>>');
            if (-1 < i && i < j) {
                return s;
            }
            i = s.indexOf('@<');
            j = s.indexOf('@>');
            if (-1 < i && i < j) {
                return s;
            }
            return '';
        };
        //@-others

        const c: Commands = this;
        const u = this.undoer;
        const w = this.frame.body.wrapper;

        const undoType = 'Extract';
        // Set data.
        let lines: string[];
        let head, tail, oldSel, oldYview;
        [head, lines, tail, oldSel, oldYview] = c.getBodyLines();
        if (!lines || !lines.length) {
            return; // Nothing selected.
        }
        //
        // Remove leading whitespace.
        let junk: number;
        let ws: number;
        [junk, ws] = g.skip_leading_ws_with_indent(lines[0], 0, c.tab_width);

        // lines = [g.removeLeadingWhitespace(s, ws, c.tab_width) for s in lines];
        const lines2 = [];
        for (const s of lines) {
            lines2.push(g.removeLeadingWhitespace(s, ws, c.tab_width));
        }
        lines = lines2;

        let h = lines[0].trim();
        let b: string[];
        let middle: string;
        const ref_h = extractRef(c, h).trim();
        const def_h = extractDef_find(c, lines);
        if (ref_h) {
            [h, b, middle] = [ref_h, lines.slice(1), ' '.repeat(ws) + lines[0]]; // By vitalije.
        } else if (def_h) {
            [h, b, middle] = [def_h, lines, ''];
        } else {
            [h, b, middle] = [lines[0].trim(), lines.slice(1), ''];
        }
        //
        // Start the outer undo group.
        u.beforeChangeGroup(c.p, undoType);
        const undoData = u.beforeInsertNode(c.p);
        const p = this.createFirstChildNode(c, c.p, h, b.join(''));
        u.afterInsertNode(p, undoType, undoData);
        //
        // Start inner undo.
        let i, j;
        if (oldSel) {
            [i, j] = oldSel;
            w.setSelectionRange(i, j, j);
        }
        const bunch = u.beforeChangeBody(c.p); // Not p.
        //
        // Update the text and selection
        c.p.v.b = head + middle + tail; // Don't redraw.
        w.setAllText(head + middle + tail);
        i = head.length;
        j = Math.max(i, head.length + middle.length - 1);
        w.setSelectionRange(i, j, j);
        //
        // End the inner undo.
        u.afterChangeBody(c.p, undoType, bunch);
        //
        // Scroll as necessary.
        if (oldYview) {
            w.setYScrollPosition(oldYview);
        } else {
            w.seeInsertPoint();
        }
        //
        // Add the changes to the outer undo group.
        u.afterChangeGroup(c.p, undoType);
        p.parent().expand();
        c.redraw(p.parent()); // A bit more convenient than p.
        c.bodyWantsFocus();
    }

    // Compatibility
    // ? Needed ?
    // g.command_alias('extractSection', extract)
    // g.command_alias('extractPythonMethod', extract)
    //@+node:felix.20230221160431.1: *3* c_ec.extractSectionNames
    @commander_command(
        'extract-names',
        'Create child nodes for every section reference in the selected text.'
    )
    public extractSectionNames(this: Commands): void {
        // - The headline of each new child node is the section reference.
        // - The body of each child node is empty.

        //@+others
        //@+node:felix.20230221160431.2: *4* function findSectionName
        const findSectionName = (s: string): string | undefined => {
            let head1 = s.indexOf('<<');
            let head2 = -1;
            if (head1 > -1) {
                head2 = s.indexOf('>>', head1);
            } else {
                head1 = s.indexOf('@<');
                if (head1 > -1) {
                    head2 = s.indexOf('@>', head1);
                }
            }

            let name: string | undefined;

            if (head1 === -1 || head2 === -1 || head1 > head2) {
                name = undefined;
            } else {
                name = s.substring(head1, head2 + 2);
            }
            return name;
        };

        //@-others

        const c: Commands = this;
        const current = c.p;
        const u = c.undoer;

        const undoType = 'Extract Section Names';
        const body = c.frame.body;
        let head, lines, tail, oldSel, oldYview;
        [head, lines, tail, oldSel, oldYview] = c.getBodyLines();
        if (!lines || !lines.length) {
            g.warning('No lines selected');
            return;
        }
        let found = false;
        let p;
        for (const s of lines) {
            const name = findSectionName(s);
            if (name) {
                if (!found) {
                    u.beforeChangeGroup(current, undoType); // first one!
                }
                const undoData = u.beforeInsertNode(current);
                p = this.createFirstChildNode(c, current, name, undefined);
                u.afterInsertNode(p, undoType, undoData);
                found = true;
            }
        }
        c.checkOutline();
        if (found) {
            u.afterChangeGroup(current, undoType);
            c.redraw(p);
        } else {
            g.warning('selected text should contain section names');
        }
        // Restore the selection.
        let i, j;
        [i, j] = oldSel;
        const w = body.wrapper;
        if (w) {
            w.setSelectionRange(i, j);
            w.setFocus();
        }
    }
    //@+node:felix.20220503232001.1: *3* c_ec.goToNext/PrevHistory
    @commander_command(
        'goto-next-history-node',
        'Go to the next node in the history list.'
    )
    public goToNextHistory(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goNext();
    }

    @commander_command(
        'goto-prev-history-node',
        'Go to the previous node in the history list.'
    )
    public goToPrevHistory(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goPrev();
    }
    //@+node:felix.20240611204157.1: *3* c_ec.alwaysIndentBody (always-indent-region)
    @commander_command(
        'always-indent-region',
        'The always-indent-region command indents each line of the selected body text. The @tabwidth directive in effect determines amount of indentation.'
    )
    public alwaysIndentBody(this: Commands): void {

        const c = this;
        const p = this.p;
        const u = this.undoer;
        const w = this.frame.body.wrapper;

        // #1801: Don't rely on bindings to ensure that we are editing the body.
        // const event_w = event ? event.w : null;
        // if (event_w !== w) {
        //     c.insertCharFromEvent(event);
        //     return;
        // }

        // "Before" snapshot.
        const bunch = u.beforeChangeBody(p);

        // Initial data.
        const [sel_1, sel_2] = w.getSelectionRange();
        const tab_width = c.getTabWidth(p) || 0;
        const [head, lines, tail, oldSel, oldYview] = this.getBodyLines();

        // Calculate the result.
        let changed = false;
        const result = lines.map(line => {
            if (line.trim()) {
                const [i, width] = g.skip_leading_ws_with_indent(line, 0, tab_width);
                const s = g.computeLeadingWhitespace(width + Math.abs(tab_width), tab_width) + line.slice(i);
                if (s !== line) {
                    changed = true;
                }
                return s;
            } else {
                return '\n';  // #2418
            }
        });

        if (!changed) {
            return;
        }

        // Set p.b and w's text first.
        const middle = result.join('');
        const all = head + middle + tail;
        p.b = all;  // Sets dirty and changed bits.
        w.setAllText(all);

        // Calculate the proper selection range (i, j, ins).
        let i, j;
        if (sel_1 === sel_2) {
            const line = result[0];
            const [iStart, width] = g.skip_leading_ws_with_indent(line, 0, tab_width);
            i = j = head.length + iStart;
        } else {
            i = head.length;
            j = head.length + middle.length;
            if (middle.endsWith('\n')) {  // #1742.
                j -= 1;
            }
        }

        // Set the selection range and scroll position.
        w.setSelectionRange(i, j, j);
        w.setYScrollPosition(oldYview);

        // "After" snapshot.
        u.afterChangeBody(p, 'Indent Region', bunch);
    }
    //@+node:felix.20240611203816.1: *3* c_ec.indentBody (indent-region)
    @commander_command('indent-region', 'Indents each line of the selected body text.')
    public indentBody(this: Commands): void {
        /**
         * The indent-region command indents each line of the selected body text.
         * Unlike the always-indent-region command, this command inserts a tab
         * (soft or hard) when there is no selected text.
         *
         * The @tabwidth directive in effect determines amount of indentation.
         */
        const c = this;
        const w = this.frame.body.wrapper;

        // #1739. Special case for a *plain* tab bound to indent-region.
        // const [sel_1, sel_2] = w.getSelectionRange();
        // if (sel_1 === sel_2) {
        //     const char = event ? event.char : null;
        //     const stroke = event ? event.stroke : null;
        //     if (char === '\t' && stroke && stroke.isPlainKey()) {
        //         c.editCommands.selfInsertCommand(event);  // Handles undo.
        //         return;
        //     }
        // }
        c.alwaysIndentBody();
    }
    //@+node:felix.20230221160446.1: *3* c_ec.insertBodyTime
    @commander_command(
        'insert-body-time',
        'Insert a time/date stamp at the cursor.'
    )
    public insertBodyTime(this: Commands): void {
        const c: Commands = this;
        const p = this.p;
        const u = this.undoer;
        const w = this.frame.body.wrapper;

        const undoType = 'Insert Body Time';
        if (g.app.batchMode) {
            c.notValidInBatchMode(undoType);
            return;
        }
        const bunch = u.beforeChangeBody(p);
        w.deleteTextSelection();
        const s = this.getTime(true);
        const i = w.getInsertPoint();
        w.insert(i, s);
        p.v.b = w.getAllText();
        u.afterChangeBody(p, undoType, bunch);
    }
    //@+node:felix.20230221160455.1: *3* c_ec.line_to_headline
    @commander_command(
        'line-to-headline',
        'Create child node from the selected line.'
    )
    public line_to_headline(this: Commands): void {
        // Cut the selected line and make it the new node's headline

        const c: Commands = this;
        const p = this.p;
        const u = this.undoer;
        const w = this.frame.body.wrapper;

        const undoType = 'line-to-headline';
        const ins = w.getInsertPoint();
        const s = p.b;
        const i = g.find_line_start(s, ins);
        const j = g.skip_line(s, i);
        const line = s.substring(i, j).trim();
        if (!line) {
            return;
        }
        u.beforeChangeGroup(p, undoType);
        //
        // Start outer undo.
        const undoData = u.beforeInsertNode(p);
        const p2 = p.insertAsLastChild();
        p2.h = line;
        u.afterInsertNode(p2, undoType, undoData);
        //
        // "before" snapshot.
        const bunch = u.beforeChangeBody(p);
        p.b = s.substring(0, i) + s.substring(j);
        w.setInsertPoint(i);
        p2.setDirty();
        c.setChanged();
        //
        // "after" snapshot.
        u.afterChangeBody(p, undoType, bunch);
        //
        // Finish outer undo.
        u.afterChangeGroup(p, undoType);
        p.expand();
        c.redraw(p);
        c.bodyWantsFocus();
    }
    //@+node:felix.20240616233556.1: *3* c_ec.reformatBody
    @commander_command('reformat-body', 'Reformat all paragraphs in the body.')
    public reformatBody(this: Commands): void {
        /** Reformat all paragraphs in the body. **/
        const c = this;
        const p = this.p;
        const undoType = 'reformat-body';
        const w = c.frame.body.wrapper;

        c.undoer.beforeChangeGroup(p, undoType);
        w.setInsertPoint(0);

        while (true) {
            const progress = w.getInsertPoint();
            c.reformatParagraph(undoType);
            const ins = w.getInsertPoint();
            const s = w.getAllText();
            w.setInsertPoint(ins);

            if (ins <= progress || ins >= s.length) {
                break;
            }
        }

        c.undoer.afterChangeGroup(p, undoType);
    }
    //@+node:felix.20240612234518.1: *3* c_ec.reformatParagraph & helpers
    @commander_command('reformat-paragraph', 'Reformat a text paragraph')
    public reformatParagraph(this: Commands, undoType: string = 'Reformat Paragraph'): void {
        /**
         * Reformat a text paragraph
         *
         * Wraps the concatenated text to present page width setting. Leading tabs are
         * sized to present tab width setting. First and second line of original text is
         * used to determine leading whitespace in reformatted text. Hanging indentation
         * is honored.
         *
         * Paragraph is bound by start of body, end of body and blank lines. Paragraph is
         * selected by position of current insertion cursor.
         */
        const c = this;
        const w = this.frame.body.wrapper;
        if (g.app.batchMode) {
            c.notValidInBatchMode("reformat-paragraph");
            return;
        }
        // Set the insertion point for find_bound_paragraph.
        if (w.hasSelection()) {
            const [i, j] = w.getSelectionRange();
            w.setInsertPoint(i);
        }
        const [head, lines, tail] = this.find_bound_paragraph(c);
        if (!lines) {
            return;
        }
        const [oldSel, oldYview, original, pageWidth, tabWidth] = this.rp_get_args(c);
        const [indents, leading_ws] = this.rp_get_leading_ws(c, lines, tabWidth);
        const result = this.rp_wrap_all_lines(c, indents, leading_ws, lines, pageWidth);
        this.rp_reformat(c, head, oldSel, oldYview, original, result, tail, undoType);
    }
    //@+node:felix.20240612234518.2: *4* function: ends_paragraph & single_line_paragraph
    /**
     * Return True if s is a blank line. 
     */
    private ends_paragraph(s: string): boolean {
        return !s.trim();
    }

    /**
     * Return True if s is a single-line paragraph. 
     */
    private single_line_paragraph(s: string): boolean {
        return s.startsWith('@') || ['"""', "'''"].includes(s.trim());
    }
    //@+node:felix.20240612234518.3: *4* function: find_bound_paragraph
    /**
     * Return the lines of a paragraph to be reformatted.
     * This is a convenience method for the reformat-paragraph command.
     */
    private find_bound_paragraph(c: Commands): [string, string[], string] | [undefined, undefined, undefined] {
        let [head, ins, tail] = c.frame.body.getInsertLines();
        let head_lines = g.splitLines(head);
        let tail_lines = g.splitLines(tail);
        let result: string[] = [];
        const insert_lines = g.splitLines(ins);
        let para_lines = insert_lines.concat(tail_lines);

        // If the present line doesn't start a paragraph,
        // scan backward, adding trailing lines of head to ins.
        if (insert_lines.length && !this.startsParagraph(insert_lines[0])) {
            let n = 0;  // number of moved lines.
            // Create a reversed copy of the array for iteration, preserving the original array.
            const reversedHeadLines = [...head_lines].reverse();
            for (let s of reversedHeadLines) {
                if (this.ends_paragraph(s) || this.single_line_paragraph(s)) {
                    break;
                } else if (this.startsParagraph(s)) {
                    n += 1;
                    break;
                } else {
                    n += 1;
                }
            }
            if (n > 0) {
                para_lines = head_lines.slice(-n).concat(para_lines);
                head_lines = head_lines.slice(0, -n);
            }
        }

        let ended = false, started = false;
        for (let i = 0; i < para_lines.length; i++) {
            let s = para_lines[i];
            if (started) {
                if (this.ends_paragraph(s) || this.startsParagraph(s)) {
                    ended = true;
                    break;
                } else {
                    result.push(s);
                }
            } else if (s.trim()) {
                result.push(s);
                started = true;
                if (this.ends_paragraph(s) || this.single_line_paragraph(s)) {
                    i += 1;
                    ended = true;
                    break;
                }
            } else {
                head_lines.push(s);
            }
        }

        if (started) {
            head = head_lines.join('');
            tail_lines = ended ? para_lines.slice(result.length) : [];
            tail = tail_lines.join('');
            return [head, result, tail];
        }

        return [undefined, undefined, undefined];
    }
    //@+node:felix.20240612234518.4: *4* function: rp_get_args
    /**
     * Compute and return oldSel, oldYview, original, pageWidth, tabWidth. 
     */
    private rp_get_args(c: Commands): [number[], number, string, number, number] {
        const body = c.frame.body;
        const w = body.wrapper;
        const d = c.scanAllDirectives(c.p);
        let pageWidth: number;
        if (c.editCommands.fillColumn > 0) {
            pageWidth = c.editCommands.fillColumn;
        } else {
            pageWidth = d["pagewidth"];
        }
        const tabWidth = d["tabwidth"];
        const original = w.getAllText();
        const oldSel = w.getSelectionRange();
        const oldYview = w.getYScrollPosition();
        return [oldSel, oldYview, original, pageWidth, tabWidth];
    }
    //@+node:felix.20240612234518.5: *4* function: rp_get_leading_ws
    /**
     * Compute and return indents and leading_ws. 
     */
    private rp_get_leading_ws(c: Commands, lines: string[], tabWidth: number): [number[], string[]] {
        let indents = [0, 0];
        let leading_ws = ["", ""];
        for (let i = 0; i < 2; i++) {
            if (i < lines.length) {
                // Use the original, non-optimized leading whitespace.
                leading_ws[i] = g.get_leading_ws(lines[i]);
                indents[i] = g.computeWidth(leading_ws[i], tabWidth);
            }
        }
        indents[1] = Math.max(...indents);
        if (lines.length === 1) {
            leading_ws[1] = leading_ws[0];
        }
        return [indents, leading_ws];
    }
    //@+node:felix.20240612234518.6: *4* function: rp_reformat
    private rp_reformat(
        c: Commands,
        head: string,
        oldSel: any,
        oldYview: any,
        original: any,
        result: string,
        tail: string,
        undoType: string
    ): void {
        /** Reformat the body and update the selection. */
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        const s = head + result + tail;
        const changed = original !== s;
        const bunch = u.beforeChangeBody(p);
        if (changed) {
            w.setAllText(s);  // Destroys coloring.
        }
        // #1748: Always advance to the next paragraph.
        let i = head.length;
        let j = Math.max(i, head.length + result.length - 1);
        let ins = j + 1;
        while (ins < s.length) {
            [i, j] = g.getLine(s, ins);
            const line = s.slice(i, j);
            // It's annoying, imo, to treat @ lines differently.
            if (line.trim() === "") {
                ins = j + 1;
            } else {
                ins = i;
                break;
            }
        }
        ins = Math.min(ins, s.length);
        w.setSelectionRange(ins, ins, ins);
        // Show more lines, if they exist.
        const k = g.see_more_lines(s, ins, 4);
        p.v.insertSpot = ins;
        w.see(k);  // New in 6.4. w.see works!
        if (!changed) {
            return;
        }
        // Finish.
        p.v.b = s;  // p.b would cause a redraw.
        u.afterChangeBody(p, undoType, bunch);
        w.setXScrollPosition(0);  // Never scroll horizontally.
    }
    //@+node:felix.20240612234518.7: *4* function: rp_wrap_all_lines
    private rp_wrap_all_lines(
        c: Commands,
        indents: number[],
        leading_ws: string[],
        lines: string[],
        pageWidth: number
    ): string {
        /** Compute the result of wrapping all lines. */
        const trailingNL = lines.length && lines[lines.length - 1].endsWith('\n');
        lines = lines.map(z => z.endsWith('\n') ? z.slice(0, -1) : z);

        if (lines.length) {  // Bug fix: 2013/12/22.
            let s = lines[0];
            if (this.startsParagraph(s)) {
                // Adjust indents[1]
                // Similar to code in startsParagraph(s)
                let i = 0;
                if (s[0].match(/\d/)) {
                    while (i < s.length && s[i].match(/\d/)) {
                        i += 1;
                    }
                    if (g.match(s, i, ')') || g.match(s, i, '.')) {
                        i += 1;
                    }
                } else if (s[0].match(/[a-zA-Z]/)) {
                    if (g.match(s, 1, ')') || g.match(s, 1, '.')) {
                        i = 2;
                    }
                } else if (s[0] === '-') {
                    i = 1;
                }
                // Never decrease indentation.
                i = g.skip_ws(s, i + 1);
                if (i > indents[1]) {
                    indents[1] = i;
                    leading_ws[1] = ' '.repeat(i);
                }
            }
        }

        // Wrap the lines, decreasing the page width by indent.
        const result_list = g.wrap_lines(lines,
            pageWidth - indents[1],
            pageWidth - indents[0]);

        // Prefix with the leading whitespace, if any
        const paddedResult = [];
        paddedResult.push(leading_ws[0] + result_list[0]);
        for (let line of result_list.slice(1)) {
            paddedResult.push(leading_ws[1] + line);
        }

        // Convert the result to a string.
        let result = paddedResult.join('\n');
        if (trailingNL) {
            result += '\n';
        }
        return result;
    }
    //@+node:felix.20240612234518.8: *4* function: startsParagraph
    /**
     * Return True if line s starts a paragraph. 
     */
    private startsParagraph(s: string): boolean {
        if (!s.trim()) {
            return false;
        } else if (s.trim() === '"""' || s.trim() === "'''") {
            return true;
        } else if (s[0].match(/\d/)) {
            let i = 0;
            while (i < s.length && s[i].match(/\d/)) {
                i += 1;
            }
            return g.match(s, i, ')') || g.match(s, i, '.');
        } else if (s[0].match(/[a-zA-Z]/)) {
            // Careful: single characters only.
            // This could cause problems in some situations.
            return (
                (g.match(s, 1, ')') || g.match(s, 1, '.')) &&
                (s.length < 2 || ' \t\n'.includes(s[2]))
            );
        } else {
            return s.startsWith('@') || s.startsWith('-');
        }
    }
    //@+node:felix.20240616233603.1: *3* c_ec.reformatSelection
    @commander_command(
        'reformat-selection',
        'Reformat the selected text, as in reformat-paragraph, but without expanding the selection past the selected lines.'
    )
    public reformatSelection(this: Commands, undoType: string = 'Reformat Selection'): void {
        const c = this;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;

        if (g.app.batchMode) {
            c.notValidInBatchMode(undoType);
            return;
        }

        const bunch = u.beforeChangeBody(p);
        const [oldSel, oldYview, original, pageWidth, tabWidth] = this.rp_get_args(c);
        const [head, middle, tail] = c.frame.body.getSelectionLines();
        const lines = g.splitLines(middle);

        if (!lines.length) {
            return;
        }

        const [indents, leading_ws] = this.rp_get_leading_ws(c, lines, tabWidth);
        const result = this.rp_wrap_all_lines(c, indents, leading_ws, lines, pageWidth);
        const s = head + result + tail;

        if (s === original) {
            return;
        }

        // Update the text and the selection.
        w.setAllText(s);  // Destroys coloring.
        const i = head.length;
        let j = Math.max(i, head.length + result.length - 1);
        j = Math.min(j, s.length);
        w.setSelectionRange(i, j, j);

        // Finish.
        p.v.b = s;  // p.b would cause a redraw.
        u.afterChangeBody(p, undoType, bunch);
        w.setXScrollPosition(0);  // Never scroll horizontally.
    }
    //@+node:felix.20240616233633.1: *3* c_ec.toggleAngleBrackets
    @commander_command(
        'toggle-angle-brackets',
        '"Add or remove double angle brackets from the headline of the selected node.'
    )
    public toggleAngleBrackets(this: Commands): void {
        /** Add or remove double angle brackets from the headline of the selected node. **/
        const c = this;
        const p = this.p;
        const command = 'toggle-angle-brackets';

        if (g.app.batchMode) {
            c.notValidInBatchMode("Toggle Angle Brackets");
            return;
        }

        c.endEditing();
        let s = p.h.trim();
        const oldHead = s;
        const lt = "<<";
        const rt = ">>";

        if (s.startsWith(lt) || s.endsWith(rt)) {
            if (s.startsWith(lt)) {
                s = s.slice(2);
            }
            if (s.endsWith(rt)) {
                s = s.slice(0, -2);
            }
            s = s.trim();
        } else {
            s = g.angleBrackets(` ${s} `);
        }
        if (s !== oldHead) {
            const u = c.undoer;
            const data = u.beforeChangeHeadline(p);

            p.setHeadString(s);
            p.setDirty();  // #1449.
            c.setChanged();  // #1449.
            u.afterChangeHeadline(p, command, data);
            // c.redrawAndEdit(p, true);

        }
    }
    //@+node:felix.20240616233651.1: *3* c_ec.unformatParagraph & helper
    @commander_command('unformat-paragraph', 'Unformat a text paragraph. Removes all extra whitespace in a paragraph.')
    public unformatParagraph(this: Commands, undoType: string = 'Unformat Paragraph'): void {
        /**
         * Unformat a text paragraph. Removes all extra whitespace in a paragraph.
         *
         * Paragraph is bound by start of body, end of body and blank lines. Paragraph is
         * selected by position of current insertion cursor.
         **/

        const c = this;
        const body = c.frame.body;
        const w = body.wrapper;

        if (g.app.batchMode) {
            c.notValidInBatchMode("unformat-paragraph");
            return;
        }

        if (w.hasSelection()) {
            const [i, j] = w.getSelectionRange();
            w.setInsertPoint(i);
        }

        const [oldSel, oldYview, original, pageWidth, tabWidth] = this.rp_get_args(c);
        const [head, lines, tail] = this.find_bound_paragraph(c);

        if (lines && lines.length) {
            const result = lines.map(line => line.trim()).join(' ') + '\n';
            this.unreformat(c, head, oldSel, oldYview, original, result, tail, undoType);
        }
    }
    //@+node:felix.20240616233651.2: *4* function: unreformat
    /** 
     * Unformat the body and update the selection.
     */
    private unreformat(
        c: Commands,
        head: string,
        oldSel: any,
        oldYview: any,
        original: string,
        result: string,
        tail: string,
        undoType: string
    ): void {

        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        const s = head + result + tail;
        let ins = Math.max(head.length, head.length + result.length - 1);
        const bunch = u.beforeChangeBody(p);
        w.setAllText(s);  // Destroys coloring.
        const changed = original !== s;

        if (changed) {
            p.v.b = w.getAllText();
            u.afterChangeBody(p, undoType, bunch);
        }

        // Advance to the next paragraph.
        ins += 1;  // Move past the selection.
        while (ins < s.length) {
            const [i, j] = g.getLine(s, ins);
            const line = s.substring(i, j);
            if (line.trim() === "") {
                ins = j + 1;
            } else {
                ins = i;
                break;
            }
        }

        c.recolor();  // Required.
        w.setSelectionRange(ins, ins, ins);
        w.see(ins);
        // Make sure we never scroll horizontally.
        w.setXScrollPosition(0);
    }
    //@+node:felix.20240617000519.1: *3* c_ec: insert-jupyter-toc & insert-markdown-toc
    @commander_command('insert-jupyter-toc', 'Insert a Jupyter table of contents at the cursor, replacing any selected text.')
    public insertJupyterTOC(this: Commands): void {
        this.insert_toc(this, 'jupyter');
    }

    @commander_command('insert-markdown-toc', 'Insert a Markdown table of contents at the cursor, replacing any selected text.')
    public insertMarkdownTOC(this: Commands): void {
        this.insert_toc(this, 'markdown');
    }
    //@+node:felix.20240617000519.2: *4* insert_toc
    /**
     * Insert a table of contents at the cursor.
     */
    private insert_toc(c: Commands, kind: string): void {

        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        const undoType = `Insert ${kind.charAt(0).toUpperCase() + kind.slice(1)} TOC`;

        if (g.app.batchMode) {
            c.notValidInBatchMode(undoType);
            return;
        }

        const bunch = u.beforeChangeBody(p);
        w.deleteTextSelection();
        const s = this.make_toc(c, kind, c.p);
        const i = w.getInsertPoint();
        w.insert(i, s);
        p.v.b = w.getAllText();
        u.afterChangeBody(p, undoType, bunch);
    }
    //@+node:felix.20240617000519.3: *4* make_toc
    /**
     * Return the toc for root.b as a list of lines.
     */
    private make_toc(c: Commands, kind: string, root: Position): string {

        function cell_type(p: Position): string {
            const language = g.getLanguageAtPosition(c, p);
            return language === 'jupyter' || language === 'markdown' ? 'markdown' : 'python';
        }

        function clean_headline(s: string): string {
            // Surprisingly tricky. This could remove too much, but better to be safe.
            const aList = Array.from(s).filter(ch => ch === '-' || ch === ':' || ch === ' ' || ch.match(/^[a-z0-9]+$/i));
            return aList.join('').replace(/-+$/, '').trim();
        }

        const result: string[] = [];
        let stack: number[] = [];

        for (let p of root.subtree()) {
            if (cell_type(p) === 'markdown') {
                const level = p.level() - root.level();
                if (stack.length < level) {
                    stack.push(1);
                } else {
                    stack = stack.slice(0, level);
                }
                const n = stack[stack.length - 1];
                stack[stack.length - 1] = n + 1;

                const title = clean_headline(p.h);
                let url = clean_headline(p.h.replace(/ /g, '-'));
                if (kind === 'markdown') {
                    url = url.toLowerCase();
                }
                const line = `${' '.repeat(4 * (level - 1))}- [${title}](#${url})\n`;
                result.push(line);
            }
        }

        if (result.length) {
            result.push('\n');
        }

        return result.join('');
    }
    //@-others
}
//@-others
//@-leo
