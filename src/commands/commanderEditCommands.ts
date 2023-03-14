//@+leo-ver=5-thin
//@+node:felix.20220414231314.1: * @file src/commands/commanderEditCommands.ts
// * Outline commands that used to be defined in leoCommands.py
import * as g from "../core/leoGlobals";
import { commander_command } from "../core/decorators";
import { Commands } from "../core/leoCommands";
import { Position } from "../core/leoNodes";

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
        const tabWidth = d["tabwidth"];
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
                    let s;

                    s = g.computeLeadingWhitespace(w, Math.abs(tabWidth)) + line.slice(i);  // use positive width.
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
            g.es("blanks converted to tabs in", count, "nodes");
            // Must come before c.redraw().
        }
        if (count > 0) {
            c.redraw_after_icons_changed();
        }


    }

    //@+node:felix.20230312214917.1: *3* c_ec.convertBlanks
    @commander_command(
        'convert-blanks',
        'Convert *all* blanks to tabs in the selected node.' +
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
        w.selectAllText()
        let head, lines, tail, oldSel;
        [head, lines, tail, oldSel, oldYview] = c.getBodyLines();
        //
        // Use the relative @tabwidth, not the global one.
        const d = c.scanAllDirectives(p);
        const tabWidth = d["tabwidth"];
        if (!tabWidth) {
            return false;
        }
        //
        // Calculate the result.
        let changed = false;
        const result: string[] = [];

        for (let line of lines) {
            const s = g.optimizeLeadingWhitespace(line, Math.abs(tabWidth));  // Use positive width.
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
        p.b = head + middle + tail;  // Sets dirty and changed bits.
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
    //@+node:felix.20230221160425.3: *3* def createLastChildNode
    /**
     * A helper function for the three extract commands.
     */
    private createLastChildNode(c: Commands, parent: Position, headline: string, body?: string): Position {

        // #1955: don't strip trailing lines.
        if (!body) {
            body = "";
        }
        const p = parent.insertAsLastChild();
        p.initHeadString(headline);
        p.setBodyString(body);
        p.setDirty();
        c.validateOutline();
        return p;
    };
    //@+node:felix.20230221160425.1: *3* c_ec.extract & helpers
    @commander_command('extract', 'Create child node from the selected body text.')
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
        //@+node:felix.20230221160425.4: *4* def extractDef
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
        }
        //@+node:felix.20230221160425.5: *4* def extractDef_find
        const extractDef_find = (c: Commands, lines: string[]): string | undefined => {
            for (const line of lines) {
                const def_h = extractDef(c, line.trim());
                if (def_h) {
                    return def_h;
                }
            }
            return undefined;
        }
        //@+node:felix.20230221160425.6: *4* def extractRef
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
        }
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
            return;  // Nothing selected.
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
            [h, b, middle] = [ref_h, lines.slice(1), ' '.repeat(ws) + lines[0]];  // By vitalije.
        } else if (def_h) {
            [h, b, middle] = [def_h, lines, ''];
        } else {
            [h, b, middle] = [lines[0].trim(), lines.slice(1), ''];
        }
        //
        // Start the outer undo group.
        u.beforeChangeGroup(c.p, undoType);
        const undoData = u.beforeInsertNode(c.p);
        const p = this.createLastChildNode(c, c.p, h, b.join(""));
        u.afterInsertNode(p, undoType, undoData);
        //
        // Start inner undo.
        let i, j;
        if (oldSel) {
            [i, j] = oldSel;
            w.setSelectionRange(i, j, j);
        }
        const bunch = u.beforeChangeBody(c.p);  // Not p.
        //
        // Update the text and selection
        c.p.v.b = head + middle + tail;  // Don't redraw.
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
        c.redraw(p.parent());  // A bit more convenient than p.
        c.bodyWantsFocus();
    }

    // Compatibility
    // ? Needed ?
    // g.command_alias('extractSection', extract)
    // g.command_alias('extractPythonMethod', extract)
    //@+node:felix.20230221160431.1: *3* c_ec.extractSectionNames & helper
    @commander_command(
        'extract-names',
        'Create child nodes for every section reference in the selected text.'
    )
    public extractSectionNames(this: Commands): void {
        // - The headline of each new child node is the section reference.
        // - The body of each child node is empty.

        //@+others
        //@+node:felix.20230221160431.2: *4* def findSectionName
        const findSectionName = (s: string): string | undefined => {

            let head1 = s.indexOf("<<");
            let head2 = -1;
            if (head1 > -1) {
                head2 = s.indexOf(">>", head1);
            } else {
                head1 = s.indexOf("@<");
                if (head1 > -1) {
                    head2 = s.indexOf("@>", head1);
                }
            }

            let name: string | undefined;

            if (head1 === -1 || head2 === -1 || head1 > head2) {
                name = undefined;
            } else {
                name = s.substring(head1, head2 + 2);
            }
            return name;
        }

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
                    u.beforeChangeGroup(current, undoType);  // first one!
                }
                const undoData = u.beforeInsertNode(current);
                p = this.createLastChildNode(c, current, name, undefined);
                u.afterInsertNode(p, undoType, undoData);
                found = true;
            }
        }
        c.validateOutline();
        if (found) {
            u.afterChangeGroup(current, undoType);
            c.redraw(p);
        } else {
            g.warning("selected text should contain section names");
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
    //@-others

}
//@-others
//@-leo
