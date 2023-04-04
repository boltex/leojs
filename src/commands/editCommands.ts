//@+leo-ver=5-thin
//@+node:felix.20220503003653.1: * @file src/commands/editCommands.ts
import * as g from '../core/leoGlobals';
import { new_cmd_decorator, command } from "../core/decorators";
import { Position, VNode } from "../core/leoNodes";
import { Commands } from "../core/leoCommands";
import { Bead } from '../core/leoUndo';
import { StringTextWrapper } from '../core/leoFrame';
import { BaseEditCommandsClass } from './baseCommands';

//@+others
//@+node:felix.20220503223721.1: ** editCommands.cmd (decorator)
/**
 * Command decorator for the editCommandsClass class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'editCommands']);
}
//@+node:felix.20220504203112.1: ** class TopLevelEditCommands
export class TopLevelEditCommands {

    //@+others
    //@+node:felix.20220504203200.1: *3*  Top-level commands
    //@+node:felix.20220504203200.2: *4* @g.command('mark-first-parents')
    @command(
        'mark-first-parents',
        'Mark the node and all its parents.'
    )
    public mark_first_parents(this: Commands): Position[] {

        const c: Commands = this;
        const changed: Position[] = [];

        if (!c) {
            return changed;
        }
        for (let parent of c.p.self_and_parents()) {
            if (!parent.isMarked()) {
                parent.setMarked();
                parent.setDirty();
                changed.push(parent.copy());
            }
        }
        if (changed.length) {
            // g.es("marked: " + ', '.join([z.h for z in changed]))
            c.setChanged();
            c.redraw();
        }
        return changed;
    }
    //@+node:felix.20220504203200.3: *4* @g.command('promote-bodies')
    @command(
        'promote-bodies',
        'Copy the body text of all descendants to the parent\'s body text.'
    )
    public promoteBodies(this: Commands): void {

        const c: Commands = this;
        if (!c) {
            return;
        }
        const p: Position = c.p;
        const result: string[] = p.b.trim() ? [p.b.trimEnd() + '\n'] : [];

        const b: Bead = c.undoer.beforeChangeNodeContents(p);

        let s: string;

        for (let child of p.subtree()) {
            const h = child.h.trim();
            if (child.b) {

                // body = '\n'.join([f"  {z}" for z in g.splitLines(child.b)])
                const body = [...g.splitLines(child.b)].map(z => `  ${z}`).join('\n');

                s = `- ${h}\n${body}`;
            } else {
                s = `- ${h}`;
            }
            if (s.trim()) {
                result.push(s.trim());
            }
        }
        if (result.length) {
            result.push('');
        }
        p.b = result.join('\n');

        c.undoer.afterChangeNodeContents(p, 'promote-bodies', b);

    }
    //@+node:felix.20220504203200.4: *4* @g.command('promote-headlines')
    @command(
        'promote-headlines',
        'Copy the headlines of all descendants to the parent\'s body text.'
    )
    public promoteHeadlines(this: Commands): void {

        const c: Commands = this;
        if (!c) {
            return;
        }
        const p: Position = c.p;

        const b: Bead = c.undoer.beforeChangeNodeContents(p);

        const result: string = [...p.subtree()].map(p_p => p_p.h.trimEnd()).join('\n');
        // '\n'.join([p.h.trimEnd() for p in p.subtree()])

        if (result) {
            p.b = p.b.trimStart() + '\n' + result;
            c.undoer.afterChangeNodeContents(p, 'promote-headlines', b);
        }
    }

    //@+node:felix.20220504203200.5: *4* @g.command('unmark-first-parents')
    @command(
        'unmark-first-parents',
        'Unmark the node and all its parents.'
    )
    public unmark_first_parents(this: Commands): Position[] {

        const c: Commands = this;
        const changed: Position[] = [];

        if (!c) {
            return changed;
        }

        for (let parent of c.p.self_and_parents()) {
            if (parent.isMarked()) {
                parent.clearMarked();
                parent.setDirty();
                changed.push(parent.copy());
            }
        }

        if (changed.length) {
            // g.es("unmarked: " + ', '.join([z.h for z in changed]))
            c.setChanged();
            c.redraw();
        }
        return changed;
    }
    //@-others

}
//@+node:felix.20220503222535.1: ** class EditCommandsClass
export class EditCommandsClass extends BaseEditCommandsClass {

    // Match exactly one trailing blank.
    private hn_pattern = new RegExp(/^[0-9]+(\.[0-9]+)* /);

    //@+others
    //@+node:felix.20220504204405.1: *3* ec.constructor
    constructor(c: Commands) {
        super(c);
    }
    //@+node:felix.20220503223023.1: *3* ec.doNothing
    @cmd(
        'do-nothing',
        'A placeholder command, useful for testing bindings.'
    )
    public doNothing(this: Commands): void {
        // pass
    }
    //@+node:felix.20220503225225.1: *3* ec.insertHeadlineTime
    @cmd(
        'insert-headline-time',
        'Insert a date/time stamp in the headline of the selected node.'
    )
    public insertHeadlineTime(): void {

        const c = this.c;
        const p = c.p;
        const u = this.c.undoer;

        if (g.app.batchMode) {
            c.notValidInBatchMode("Insert Headline Time");
            return;
        }

        c.endEditing();
        const time = c.getTime(false);
        const s = p.h.trimEnd();

        const h = p.h;
        const undoType = 'insert-headline-time';
        const undoData = u.beforeChangeNodeContents(p);
        if (s) {
            p.h = [s, time].join(' ');
        } else {
            p.h = time;
        }
        const changed = p.h !== h;
        if (changed) {
            c.setChanged();
            p.setDirty();
            u.afterChangeNodeContents(p, undoType, undoData);
        }

        c.redrawAndEdit(p, true);

    }
    //@+node:felix.20220503225231.1: *3* ec.capitalizeHeadline
    @cmd(
        'capitalize-headline',
        'Capitalize all words in the headline of the selected node.'
    )
    public capitalizeHeadline(): void {

        const c = this.c;
        const p = this.c.p;
        const u = this.c.undoer;

        if (g.app.batchMode) {
            c.notValidInBatchMode("Capitalize Headline");
            return;
        }
        const h = p.h;
        const undoType = 'capitalize-headline';
        const undoData = u.beforeChangeNodeContents(p);

        // const words = [w.capitalize() for w in h.split(" ")];
        const words = h.split(" ").map(w => w[0].toUpperCase() + w.substring(1));

        const capitalized = words.join(' ');
        const changed = capitalized !== h;
        if (changed) {
            p.h = capitalized;
            c.setChanged();
            p.setDirty();
            u.afterChangeNodeContents(p, undoType, undoData);
            c.redraw();
        }


    }
    //@+node:felix.20220503225323.1: *3* ec: goto node
    //@+node:felix.20220503225323.2: *4* ec.gotoAnyClone
    @cmd(
        'goto-any-clone',
        'Select then next cloned node, regardless of whether c.p is a clone.'
    )
    public gotoAnyClone(): void {

        const c: Commands = this.c;

        const p: Position = c.p.threadNext();
        while (p && p.__bool__()) {
            if (p.isCloned()) {
                c.selectPosition(p);
                return;
            }
            p.moveToThreadNext();
        }
        g.es('no clones found after', c.p.h);
    }
    //@+node:felix.20220503225323.3: *4* ec.gotoCharacter
    @cmd(
        'goto-char',
        'Put the cursor at the n\'th character of the buffer.'
    )
    public gotoCharacter(): void {
        console.log('TODO : goto-char');
        /*     
        k = this.c.k
        this.w = this.editWidget(event)
        if this.w:
            k.setLabelBlue("Goto n'th character: ")
            k.get1Arg(event, handler=this.gotoCharacter1)

        */

    }


    public gotoCharacter1(): void {
        console.log('TODO : gotoCharacter1');

        /* 
        const c =  this.c;
        const k = this.c.k;
        const n = k.arg;
        const w = this.w;
        let ok = false;
        if n.isdigit():
            n = int(n)
            if n >= 0:
                w.setInsertPoint(n)
                w.seeInsertPoint()
                ok = True


        if not ok:
            g.warning('goto-char takes non-negative integer argument')

        k.resetLabel();
        k.clearState();
        c.widgetWantsFocus(w);
         */
    }
    //@+node:felix.20220503225323.4: *4* ec.gotoGlobalLine
    @cmd(
        'goto-global-line',
        'Put the cursor at the line in the *outline* corresponding to the line\n' +
        'with the given line number *in the external file*.\n' +
        'For external files containing sentinels, there may be *several* lines\n' +
        'in the file that correspond to the same line in the outline.\n' +
        'An Easter Egg: <Alt-x>number invokes this code.'
    )
    public gotoGlobalLine(): void {

        console.log('TODO : goto-global-line');

        /* 

        // Improved docstring for #253: Goto Global line (Alt-G) is inconsistent.
        // https://github.com/leo-editor/leo-editor/issues/253
        k = this.c.k
        this.w = this.editWidget(event)
        if this.w:
            k.setLabelBlue('Goto global line: ')
            k.get1Arg(event, handler=this.gotoGlobalLine1)

        */
    }

    public gotoGlobalLine1(): void {
        console.log('TODO : gotoGlobalLine1');

        /* 

        c, k = this.c, this.c.k
        n = k.arg
        k.resetLabel()
        k.clearState()
        if n.isdigit():
            // Very important: n is one-based.
            c.gotoCommands.find_file_line(n=int(n))

        */

    }
    //@+node:felix.20220503225323.5: *4* ec.gotoLine
    @cmd(
        'goto-line',
        'Put the cursor at the n\'th line of the buffer.'
    )
    public gotoLine(): void {
        console.log('TODO : goto-line');

        /* 

        k = self.c.k
        self.w = self.editWidget(event)
        if self.w:
            k.setLabelBlue('Goto line: ')
            k.get1Arg(event, handler=self.gotoLine1)

        */

    }

    public gotoLine1(): void {
        console.log('TODO : gotoLine1');

        /* 

        c, k = self.c, self.c.k
        n, w = k.arg, self.w
        if n.isdigit():
            n = int(n)
            s = w.getAllText()
            i = g.convertRowColToPythonIndex(s, n - 1, 0)
            w.setInsertPoint(i)
            w.seeInsertPoint()
        k.resetLabel()
        k.clearState()
        c.widgetWantsFocus(w)

        */

    }
    //@+node:felix.20230402171528.1: *3* ec: headline numbers
    //@+node:felix.20230402171528.2: *4* hn-add-all & helper
    @cmd(
        'hn-add-all',
        'Add headline numbers to all nodes of the outline *except*\n' +
        '-  @<file> nodes and their descendants.\n' +
        '- Any node whose headline starts with "@".\n' +
        'Use the *first* clone\'s position for all clones.'
    )
    @cmd(
        'headline-number-add-all',
        'Add headline numbers to all nodes of the outline *except*\n' +
        '-  @<file> nodes and their descendants.\n' +
        '- Any node whose headline starts with "@".\n' +
        'Use the *first* clone\'s position for all clones.'
    )
    @cmd(
        'add-all-headline-numbers',
        'Add headline numbers to all nodes of the outline *except*\n' +
        '-  @<file> nodes and their descendants.\n' +
        '- Any node whose headline starts with "@".\n' +
        'Use the *first* clone\'s position for all clones.'
    )
    public hn_add_all(): void {
        const c: Commands = this.c;
        const command = 'add-all-headline-numbers';
        const u = c.undoer;

        const data = u.beforeChangeMultiHeadline(c.p);
        for (const p of c.all_unique_positions()) {
            this.hn_delete(p);
            this.hn_add(p);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        c.redraw();
    }
    //@+node:felix.20230402171528.3: *5* hn_add
    /**
     * Add a 1-based outline number to p.h.
     *
     * Do *not* add a headline number for:
     * -  @<file> nodes and their descendants.
     * - Any node whose headline starts with "@".
     */
    public hn_add(p: Position): void {
        const skip = (p: Position): boolean => {
            //True if we should skip p.
            for (const z of p.self_and_parents()) {
                if (z.isAnyAtFileNode()) {
                    return true; // In an @<file> tree.
                }
            }
            return p.h.trim().startsWith('@');
        }

        // Don't add numbers to special nodes.
        if (skip(p)) {
            return;
        }

        const a_s: string[] = [];
        for (const z of p.self_and_parents()) {
            a_s.push((1 + z.childIndex()).toString());
        }
        a_s.reverse();
        const s = a_s.join('.');
        // s = '.'.join(reversed(  list(str(1 + z.childIndex()) for z in p.self_and_parents())  ))

        // Do not strip the original headline!
        p.v.h = `${s} ${p.v.h}`;
        p.v.setDirty();

    }
    //@+node:felix.20230402171528.4: *4* hn-add-subtree & helper
    @cmd(
        'hn-add-subtree',
        'Add headline numbers to *all* children of c.p.' +
        'Use the *last* clone\'s position for all clones.'
    )
    @cmd(
        'headline-number-add-subtree',
        'Add headline numbers to *all* children of c.p.' +
        'Use the *last* clone\'s position for all clones.'
    )
    @cmd(
        'add-subtree-headline-numbers',
        'Add headline numbers to *all* children of c.p.' +
        'Use the *last* clone\'s position for all clones.'
    )
    public hn_add_children(): void {
        const c: Commands = this.c;
        const command = 'add-subtree-headline-numbers';
        const u = c.undoer;
        const root = c.p;
        const data = u.beforeChangeMultiHeadline(root);
        for (const p of c.p.subtree()) {
            this.hn_delete(p);
            this.hn_add_relative(p, root);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        root.expand();
        c.redraw();
    }
    //@+node:felix.20230402171528.5: *5* hn_add_relative
    /**
     * Add a 1-based outline number (relative to the root) to p.h.
     */
    public hn_add_relative(p: Position, root: Position): void {

        const c: Commands = this.c;
        const indices: number[] = [];
        for (const p2 of p.self_and_parents()) {
            if (p2.__eq__(root)) {
                break;
            }
            indices.unshift(p2.childIndex());
        }

        const s = [...indices.map(z => (1 + z).toString())].join(',');
        // s = '.'.join([str(1 + z) for z in indices]);

        // Do not strip the original headline!
        c.setHeadString(p, `${s} ${p.v.h}`);
        p.v.setDirty();

    }
    //@+node:felix.20230402171528.6: *4* hn-delete-all
    @cmd('hn-delete-all', 'Delete all headline numbers in the entire outline.')
    @cmd('headline-number-delete-all', 'Delete all headline numbers in the entire outline.')
    @cmd('delete-all-headline-numbers', 'Delete all headline numbers in the entire outline.')
    public hn_delete_all(): void {
        const c: Commands = this.c;
        const command = 'delete-all-headline-numbers';
        const u = c.undoer;

        const data = u.beforeChangeMultiHeadline(c.p);
        for (const p of c.all_unique_positions()) {
            this.hn_delete(p);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        c.redraw();

    }
    //@+node:felix.20230402171528.7: *4* hn-delete-subtree
    @cmd('hn-delete-subtree', 'Delete all headline numbers in c.p\'s subtree.')
    @cmd('headline-number-delete-subtree', 'Delete all headline numbers in c.p\'s subtree.')
    @cmd('delete-subtree-headline-numbers', 'Delete all headline numbers in c.p\'s subtree.')
    public hn_delete_tree(): void {
        const c: Commands = this.c;
        const command = 'delete-subtree-headline-numbers';
        const u = c.undoer;

        const data = u.beforeChangeMultiHeadline(c.p);
        for (const p of c.p.subtree()) {
            this.hn_delete(p);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        c.redraw();

    }
    //@+node:felix.20230402171528.8: *4* hn_delete


    /**
     * Helper: delete the headline number in p.h.
     */
    public hn_delete(p: Position): void {

        const c: Commands = this.c;
        // const m = re.match(this.hn_pattern, p.h);
        const m: RegExpExecArray | null = this.hn_pattern.exec(p.h);
        if (m) {
            // Do not strip the headline!
            const n = m[0].length;
            c.setHeadString(p, p.v.h.substring(n));
            p.v.setDirty();
        }
    }
    //@+node:felix.20221220002620.1: *3* ec: move cursor
    //@+node:felix.20221220002639.1: *4* ec.extend-to-word
    @cmd(
        'extend-to-word',
        'Compute the word at the cursor. Select it if select arg is True.'
    )
    public extendToWord(select = true, w?: StringTextWrapper): [number, number] {

        if (!w) {
            (w = this.editWidget());
        }
        if (!w) {
            return [0, 0];
        }
        const s = w.getAllText();
        const n = s.length;
        let i = w.getInsertPoint();
        let i1 = i;
        // Find a word char on the present line if one isn't at the cursor.
        if (!(0 <= i && i < n && g.isWordChar(s[i]))) {
            // First, look forward
            while (i < n && !g.isWordChar(s[i]) && s[i] !== '\n') {
                i += 1;
            }
            // Next, look backward.
            if (!(0 <= i && i < n && g.isWordChar(s[i]))) {
                if (i >= n || s[i] === '\n') {
                    i = i1 - 1;
                } else {
                    i = i1;
                }
                while (i >= 0 && !g.isWordChar(s[i]) && s[i] !== '\n') {
                    i -= 1;
                }
            }
        }
        // Make sure s[i] is a word char.
        if (0 <= i && i < n && g.isWordChar(s[i])) {
            // Find the start of the word.
            while (0 <= i && i < n && g.isWordChar(s[i])) {
                i -= 1;
            }
            i += 1;
            i1 = i;

            // Find the end of the word.
            while (0 <= i && i < n && g.isWordChar(s[i])) {
                i += 1;
            }
            if (select) {
                w.setSelectionRange(i1, i);
            }
            return [i1, i];
        }

        return [0, 0];


    }
    //@+node:felix.20220503225545.1: *3* ec: uA's
    //@+node:felix.20220503225545.2: *4* ec.clearNodeUas & clearAllUas
    @cmd(
        'clear-node-uas',
        'Clear the uA\'s in the selected VNode.'
    )
    public clearNodeUas(): void {
        const c = this.c;
        const p = c && c.p;
        if (p && p.__bool__() && p.v.u && Object.keys(p.v.u).length) {
            p.v.u = {};
            // #1276.
            p.setDirty();
            c.setChanged();
            c.redraw();
        }
    }

    @cmd(
        'clear-all-uas',
        'Clear all uAs in the entire outline.'
    )
    public clearAllUas(): void {
        const c = this.c;
        // #1276.
        let changed = false;
        for (let p of this.c.all_unique_positions()) {
            if (p.v.u && Object.keys(p.v.u).length) {
                p.v.u = {};
                p.setDirty();
                changed = true;
            }
        }

        if (changed) {
            c.setChanged();
            c.redraw();
        }

    }
    //@+node:felix.20220503225545.3: *4* ec.showUas & showAllUas
    @cmd(
        'show-all-uas',
        'Print all uA\'s in the outline.'
    )
    public showAllUas(): void {

        g.es_print('Dump of uAs...');
        for (let v of this.c.all_unique_nodes()) {
            if (v.u && Object.keys(v.u).length) {
                this.showNodeUas(v);
            }
        }

    }

    @cmd(
        'show-node-uas',
        'Print the uA\'s in the selected node.'
    )
    public showNodeUas(v?: VNode): void {

        const c = this.c;
        let d: { [key: string]: any };
        let h: string;

        if (v) {
            d = v.u;
            h = v.h;
        } else {
            d = c.p.v.u;
            h = c.p.h;
        }
        g.es_print(h);
        g.es_print(g.objToString(d));
    }
    //@+node:felix.20220503225545.4: *4* ec.setUa
    @cmd(
        'set-ua',
        'Prompt for the name and value of a uA, then set the uA in the present node.'
    )
    public async setUa(): Promise<boolean> {

        let w_name = "";

        let w_uaName = await g.app.gui.get1Arg({
            title: "Set ua",
            prompt: "Set unknown attribute name",
            placeHolder: "Attribute Name",
        });
        // Trim string and re-check if valid string
        if (w_uaName && w_uaName.trim()) {
            w_uaName = w_uaName.trim();
            w_name = w_uaName;

            const w_uaVal = await g.app.gui.get1Arg({
                title: "Set ua to",
                prompt: "Set unknown attribute value",
                placeHolder: "Attribute Value",
            });

            if (w_name && !(typeof w_uaVal === 'undefined' || w_uaVal === null)) {
                // ok got both name and val
                const c = this.c;
                const p = c.p;
                if (!p.v.u) {
                    p.v.u = {}; // assert at least an empty dict if null or non existent
                }
                p.v.u[w_name] = w_uaVal;
                this.showNodeUas();
                return Promise.resolve(true);
            }

        }
        return Promise.resolve(false);
    }

    //@-others

}
//@-others


// @cmd
// with top level being @g.command
//@-leo
