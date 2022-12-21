//@+leo-ver=5-thin
//@+node:felix.20220503003725.1: * @file src/commands/gotoCommands.ts
import * as g from '../core/leoGlobals';
import { command } from "../core/decorators";
import { Position } from "../core/leoNodes";
import { Commands } from "../core/leoCommands";

//@+others
//@+node:felix.20221218143456.1: ** class GoToCommands
/**
 * A class implementing goto-global-line.
 */
export class GoToCommands {

    public c: Commands;

    /**
     * Ctor for GoToCommands class.
     */
    constructor(c: Commands) {
        this.c = c;
    }

    //@+others
    //@+node:felix.20221218143456.2: *3* goto.find_file_line
    /**
     * Place the cursor on the n'th line (one-based) of an external file.
     * Return (p, offset, found) for unit testing.
     */
    public find_file_line(n: number, p?: Position): [Position | undefined, number, boolean] {
        const c = this.c;
        if (n < 0) {
            return [undefined, -1, false];
        }
        p = p || c.p;
        let root;
        let fileName;
        [root, fileName] = this.find_root(p);
        if (root && root.__bool__()) {
            // Step 1: Get the lines of external files *with* sentinels,
            // even if the actual external file actually contains no sentinels.
            const sentinels = root.isAtFileNode();
            const s = this.get_external_file_with_sentinels(root);
            const lines = g.splitLines(s);

            let gnx;
            let h;
            let offset;

            // Step 2: scan the lines for line n.
            if (sentinels) {
                // All sentinels count as real lines.
                [gnx, h, offset] = this.scan_sentinel_lines(lines, n, root);
            } else {
                // Not all sentinels count as real lines.
                [gnx, h, offset] = this.scan_nonsentinel_lines(lines, n, root);
            }

            let found;
            [p, found] = this.find_gnx(root, gnx, h);
            if (gnx && found) {
                this.success(n, offset, p!)
                return [p, offset, true];
            }

            this.fail(lines, n, root);
            return [undefined, -1, false];

        }

        return this.find_script_line(n, p);

    }

    //@+node:felix.20221218143456.3: *3* goto.find_node_start
    /**
     * Return the global line number of the first line of p.b
     */
    public find_node_start(p: Position, s?: string): number | undefined {
        // See #283.

        let root;
        let fileName;
        [root, fileName] = this.find_root(p);
        if (!root || !root.__bool__()) {
            return undefined;
        }

        console.assert(root.isAnyAtFileNode());

        if (!s) {
            s = this.get_external_file_with_sentinels(root);
        }

        let delim1;
        let delim2;

        [delim1, delim2] = this.get_delims(root);

        // Match only the node with the correct gnx.
        new RegExp('ab+c');

        const node_pat = new RegExp(`\s*${g.reEscape(delim1)}@\+node:${g.reEscape(p.gnx)}:`); // re.compile(r'\s*%s@\+node:%s:' % (

        for (let [i, w_s] of g.splitLines(s).entries()) {

            if (node_pat.test(w_s)) {
                return i + 1;
            }
        }

        return undefined;

    }

    //@+node:felix.20221218143456.4: *3* goto.find_script_line
    /**
     * Go to line n (zero based) of the script with the given root.
     * Return p, offset, found for unit testing.
     */
    public find_script_line(n: number, root: Position): [Position | undefined, number, boolean] {

        const c = this.c;

        if (n < 0) {
            return [undefined, -1, false];
        }
        const script = g.getScript(c, root, false);
        const lines = g.splitLines(script);

        // Script lines now *do* have gnx's.
        let gnx;
        let h;
        let offset;
        [gnx, h, offset] = this.scan_sentinel_lines(lines, n, root);

        let p;
        let found;
        [p, found] = this.find_gnx(root, gnx, h);
        if (gnx && found) {
            this.success(n, offset, p!);
            return [p, offset, true];
        }
        this.fail(lines, n, root);
        return [undefined, -1, false];

    }

    //@+node:felix.20221218143456.5: *3* goto.node_offset_to_file_line
    /**
     * Given a zero-based target_offset within target_p.b, return the line
     * number of the corresponding line within root's file.
     */
    public node_offset_to_file_line(target_offset: number, target_p: Position, root: Position): number | undefined {

        let delim1;
        let delim2;
        [delim1, delim2] = this.get_delims(root);

        const file_s = this.get_external_file_with_sentinels(root);

        let gnx;
        let h;
        let n = -1;
        let node_offset;
        let target_gnx = target_p.gnx;

        const stack: [string, string, number][] = [];

        for (const s of g.splitLines(file_s)) {
            n += 1;  // All lines contribute to the file's line count.
            if (this.is_sentinel(delim1, delim2, s)) {
                const s2 = s.trim().substring(delim1.length);  // Works for blackened sentinels.
                // Common code for the visible sentinels.
                if (s2.startsWith('@+others') || s2.startsWith('@+<<') || s2.startsWith('@@')) {
                    if (target_offset === node_offset && gnx === target_gnx) {
                        return n;
                    }
                    if (typeof node_offset !== 'undefined') {
                        node_offset += 1;
                    }
                }
                // These sentinels change nodes...
                if (s2.startsWith('@+node')) {
                    [gnx, h] = this.get_script_node_info(s, delim2);
                    node_offset = 0;
                } else if (s2.startsWith('@-node')) {
                    gnx = undefined;
                    node_offset = undefined;;
                } else if (s2.startsWith('@+others') || s2.startsWith('@+<<')) {
                    stack.push([gnx, h, node_offset]);
                    [gnx, node_offset] = [undefined, undefined];
                } else if (s2.startsWith('@-others') || s2.startsWith('@-<<')) {
                    [gnx, h, node_offset] = stack.pop();
                }
            } else {
                // All non-sentinel lines are visible.
                if (target_offset === node_offset && gnx === target_gnx) {
                    return n;
                }
                if (typeof node_offset !== 'undefined') {
                    node_offset += 1;
                }
            }
        }
        g.trace('\nNot found', target_offset, target_gnx);
        return undefined;

    }
    //@+node:felix.20221218143456.6: *3* goto.scan_nonsentinel_lines
    /**
     * Scan a list of lines containing sentinels, looking for the node and
     * offset within the node of the n'th (one-based) line.
     *
     * Only non-sentinel lines increment the global line count, but
     * @+node sentinels reset the offset within the node.
     *
     * Return gnx, h, offset:
     * gnx:    the gnx of the #@+node
     * h:      the headline of the #@+node
     * offset: the offset of line n within the node.
     */
    public scan_nonsentinel_lines(lines: string[], n: number, root: Position): [string | undefined, string | undefined, number] {
        let delim1;
        let delim2;

        [delim1, delim2] = this.get_delims(root);

        let count = 0;
        let gnx: string | undefined = root.gnx;
        let h: string | undefined = root.h;
        let offset = 0; //  = 0, root.gnx, root.h, 0

        const stack: [string | undefined, string | undefined, number][] = [[gnx, h, offset]];

        let broke = false;
        for (let s of lines) {
            const is_sentinel = this.is_sentinel(delim1, delim2, s);
            if (is_sentinel) {
                const s2 = s.trim().substring(delim1.length);  // Works for blackened sentinels.
                if (s2.startsWith('@+node')) {
                    // Invisible, but resets the offset.
                    offset = 0;
                    [gnx, h] = this.get_script_node_info(s, delim2);
                } else if (s2.startsWith('@+others') || s2.startsWith('@+<<')) {
                    stack.push([gnx, h, offset]);
                    // @others is visible in the outline, but *not* in the file.
                    offset += 1;
                } else if (s2.startsWith('@-others') || s2.startsWith('@-<<')) {
                    [gnx, h, offset] = stack.pop()!;
                    // @-others is invisible.
                    offset += 1;
                } else if (s2.startsWith('@@')) {
                    // Directives are visible in the outline, but *not* in the file.
                    offset += 1;
                } else {
                    // All other sentinels are invisible to the user.
                    offset += 1;
                }
            } else {
                // Non-sentinel lines are visible both in the outline and the file.
                count += 1;
                offset += 1;
            }
            if (count === n) {
                // Count is the real, one-based count.
                broke = true;
                break;
            }
        }
        if (!broke) {
            [gnx, h, offset] = [undefined, undefined, -1];
        }

        return [gnx, h, offset]

    }
    //@+node:felix.20221218143456.7: *3* goto.scan_sentinel_lines
    /**
     * Scan a list of lines containing sentinels, looking for the node and
     * offset within the node of the n'th (one-based) line.
     *
     * Return gnx, h, offset:
     * gnx:    the gnx of the #@+node
     * h:      the headline of the #@+node
     * offset: the offset of line n within the node.
     */
    public scan_sentinel_lines(lines: string[], n: number, root: Position): [string | undefined, string | undefined, number] {

        let delim1;
        let delim2;

        [delim1, delim2] = this.get_delims(root);

        let gnx: string | undefined = root.gnx;
        let h: string | undefined = root.h;
        let offset = 0;

        const stack: [string | undefined, string | undefined, number][] = [[gnx, h, offset]];

        let broke = false;

        for (let [i, s] of lines.entries()) {

            if (this.is_sentinel(delim1, delim2, s)) {
                const s2 = s.trim().substring(delim1.length); // Works for blackened sentinels.
                if (s2.startsWith('@+node')) {
                    offset = 0;
                    [gnx, h] = this.get_script_node_info(s, delim2);
                } else if (s2.startsWith('@+others') || s2.startsWith('@+<<')) {
                    stack.push([gnx, h, offset]);
                    offset += 1
                } else if (s2.startsWith('@-others') || s2.startsWith('@-<<')) {
                    [gnx, h, offset] = stack.pop()!;
                    offset += 1;
                } else {
                    offset += 1;
                }
            } else {
                offset += 1;
            }
            if (i + 1 === n) { // Bug fix 2017/04/01: n is one based.
                broke = true;
                break;
            }
        }
        if (!broke) {
            [gnx, h, offset] = [undefined, undefined, -1];
        }

        return [gnx, h, offset];

    }

    //@+node:felix.20221218143456.8: *3* goto.Utils
    //@+node:felix.20221218143456.9: *4* goto.fail
    /**
     * Select the last line of the last node of root's tree.
     */
    public fail(lines: string[], n: number, root: Position): void {

        const c = this.c;
        const w = c.frame.body.wrapper;
        c.selectPosition(root);
        c.redraw();
        if (!g.unitTesting) {
            if (lines.length < n) {
                g.warning('only', lines.length, 'lines');
            } else {
                g.warning('line', n, 'not found');
            }
        }
        // c.frame.clearStatusLine(); // TODO : Needed ?
        c.frame.putStatusLine(`goto-global-line not found: ${n}`);
        // Put the cursor on the last line of body text.
        w.setInsertPoint(root.b.length);
        c.bodyWantsFocus();
        w.seeInsertPoint();

    }
    //@+node:felix.20221218143456.10: *4* goto.find_gnx
    /**
     * Scan root's tree for a node with the given gnx and vnodeName.
     * return (p,found)
     */
    public find_gnx(root: Position, gnx?: string, vnodeName?: string): [Position | undefined, boolean] {

        if (gnx) {
            gnx = g.toUnicode(gnx);
            for (let p of root.self_and_subtree(false)) {
                if (p.matchHeadline(vnodeName!)) {
                    if (p.v.fileIndex === gnx) {
                        return [p.copy(), true];
                    }
                }
            }
            return [undefined, false];
        }
        return [root, false];
    }
    //@+node:felix.20221218143456.11: *4* goto.find_root
    /**
     * Find the closest ancestor @<file> node, except @all nodes and @edit nodes.
     * return root, fileName.
     */
    public find_root(p: Position): [Position | undefined, string | undefined] {

        const c = this.c;
        const p1 = p.copy()
        let fileName;
        // First look for ancestor @file node.
        for (let w_p of p.self_and_parents(false)) {
            // fileName = not p2.isAtAllNode() and p2.anyAtFileNodeName()
            // if fileName:
            // return p2.copy(), fileName
            if (!w_p.isAtAllNode()) {
                fileName = w_p.anyAtFileNodeName();
                if (fileName) {
                    return [w_p.copy(), fileName];
                }
            }
        }
        // Search the entire tree for joined nodes.
        // Bug fix: Leo 4.5.1: *must* search *all* positions.
        for (let w_p of c.all_positions()) {
            if (w_p.v === p1.v && !w_p.__eq__(p1)) {
                // Found a joined position.
                for (let p2 of w_p.self_and_parents()) {
                    if (!p2.isAtAllNode()) {
                        fileName = p2.anyAtFileNodeName();
                        if (fileName) {
                            return [p2.copy(), fileName];
                        }
                    }

                }
            }
        }
        return [undefined, undefined];

    }
    //@+node:felix.20221218143456.12: *4* goto.get_delims
    /**
     * Return the delimiters in effect at root.
     */
    public get_delims(root: Position): [string, string | undefined] {

        const c = this.c;
        const old_target_language = c.target_language;
        let d;
        try {
            c.target_language = g.getLanguageAtPosition(c, root);
            d = c.scanAllDirectives(root);
        }
        finally {
            c.target_language = old_target_language;
        }

        let delims1;
        let delims2;
        let delims3;
        [delims1, delims2, delims3] = d['delims'];

        if (delims1) {
            return [delims1, undefined];
        }

        return [delims2, delims3];

    }
    //@+node:felix.20221218143456.13: *4* goto.get_external_file_with_sentinels
    /**
     * root is an @<file> node. If root is an @auto node, return the result of
     * writing the file *with* sentinels, even if the external file normally
     * would *not* have sentinels.
     */
    public get_external_file_with_sentinels(root: Position): string {

        const c = this.c;
        let s: string;
        if (root.isAtAutoNode()) {
            // Special case @auto nodes:
            // Leo does not write sentinels in the root @auto node.
            try {
                g.app.force_at_auto_sentinels = true;
                s = c.atFileCommands.atAutoToString(root);
            }
            finally {
                g.app.force_at_auto_sentinels = true;
            }
            return s;
        }

        return g.composeScript(  // Fix #429.
            c,
            root,
            root.b,
            false,  // See #247.
            true);

    }
    //@+node:felix.20221218143456.14: *4* goto.get_script_node_info
    /**
     * Return the gnx and headline of a #@+node.
     */
    public get_script_node_info(s: string, delim2?: string): [string | undefined, string | undefined] {

        const i = s.indexOf(':', 0);
        const j = s.indexOf(':', i + 1);
        if (i === -1 || j === -1) {
            g.error("bad @+node sentinel", s);
            return [undefined, undefined];
        }
        const gnx = s.substring(i + 1, j);
        let h = s.substring(j + 1);
        h = this.remove_level_stars(h).trim();
        if (delim2) {
            h = g.rtrim(h, delim2);
        }
        return [gnx, h];

    }
    //@+node:felix.20221218143456.15: *4* goto.is_sentinel
    /** 
     * Return True if s is a sentinel line with the given delims.
     */
    public is_sentinel(delim1: string, delim2: string | undefined, s: string): boolean {

        // Leo 6.7.2: Use g.is_sentinel, which handles blackened sentinels properly.
        let delims: [string | undefined, string | undefined, string | undefined];
        if (delim1 && delim2) {
            delims = [undefined, delim1, delim2];
        } else {
            delims = [delim1, undefined, undefined];
        }

        return g.is_sentinel(s, delims)

    }
    //@+node:felix.20221218143456.16: *4* goto.remove_level_stars
    public remove_level_stars(s: string): string {
        let i = g.skip_ws(s, 0);
        // Remove leading stars.
        while (i < s.length && s[i] === '*') {
            i += 1;
        }
        // Remove optional level number.
        while (i < s.length && s[i] >= '0' && s[i] <= '9') {
            i += 1;
        }
        // Remove trailing stars.
        while (i < s.length && s[i] === '*') {
            i += 1;
        }
        // Remove one blank.
        if (i < s.length && s[i] === ' ') {
            i += 1;
        }
        return s.substring(i);

    }
    //@+node:felix.20221218143456.17: *4* goto.success
    /**
     * Place the cursor on line n2 of p.b.
     */
    public success(n: number, n2: number, p: Position): void {

        const c = this.c;
        const w = c.frame.body.wrapper;
        // Select p and make it visible.
        c.selectPosition(p);
        c.redraw(p);
        // Put the cursor on line n2 of the body text.
        const s = w.getAllText();
        const ins = g.convertRowColToPythonIndex(s, n2 - 1, 0);
        // c.frame.clearStatusLine(); // TODO : UNUSED ?
        c.frame.putStatusLine(`goto-global-line found: ${n2}`);
        w.setInsertPoint(ins);
        c.bodyWantsFocus();
        w.seeInsertPoint();
    }
    //@+node:felix.20221218143503.1: *3* show-file-line
    @command(
        'show-file-line',
        'Show the line number of the current body cursor position in an external file'
    )
    public show_file_line(this: Commands): void {
        const c: Commands = this;

        if (!c) {
            return;
        }
        const w = c.frame.body.wrapper;
        if (!w) {
            return;
        }
        const n0 = this.gotoCommands.find_node_start(c.p);
        if (!n0){
            return;
        }
        const i = w.getInsertPoint();
        const s = w.getAllText();
        let row;
        let col;
        [row, col] = g.convertPythonIndexToRowCol(s, i);
        g.es_print(1 + n0 + row);
    }

    //@-others

}
//@-others

// only @g.command('show-file-line') 
// rest is the helper class without commands
//@-leo
