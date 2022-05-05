//@+leo-ver=5-thin
//@+node:felix.20220503003653.1: * @file src/commands/editCommands.ts
import * as g from '../core/leoGlobals';
import { new_cmd_decorator, command } from "../core/decorators";
import { Position, VNode } from "../core/leoNodes";
import { Commands } from "../core/leoCommands";
import { Bead } from '../core/leoUndo';

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
export class EditCommandsClass {

    public c: Commands;

    //@+others
    //@+node:felix.20220504204405.1: *3* ec.constructor
    constructor(c: Commands) {
        this.c = c;
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
        console.log('TODO : insert-headline-time');

        /* 

        frame = self
        c, p = frame.c, self.c.p
        if g.app.batchMode:
            c.notValidInBatchMode("Insert Headline Time")
            return
        // #131: Do not get w from self.editWidget()!
        w = c.frame.tree.edit_widget(p)
        if w:
            // Fix bug https://bugs.launchpad.net/leo-editor/+bug/1185933
            // insert-headline-time should insert at cursor.
            // Note: The command must be bound to a key for this to work.
            ins = w.getInsertPoint()
            s = c.getTime(body=False)
            w.insert(ins, s)
        else:
            c.endEditing()
            time = c.getTime(body=False)
            s = p.h.rstrip()
            if s:
                p.h = ' '.join([s, time])
            else:
                p.h = time
            c.redrawAndEdit(p, selectAll=True)

         */
    }
    //@+node:felix.20220503225231.1: *3* ec.capitalizeHeadline
    @cmd(
        'capitalize-headline',
        'Capitalize all words in the headline of the selected node.'
    )
    public capitalizeHeadline(): void {
        console.log('TODO : capitalize-headline');

        /* 

        frame = self
        c, p, u = frame.c, self.c.p, self.c.undoer

        if g.app.batchMode:
            c.notValidInBatchMode("Capitalize Headline")
            return

        h = p.h
        undoType = 'capitalize-headline'
        undoData = u.beforeChangeNodeContents(p)

        words = [w.capitalize() for w in h.split()]
        capitalized = ' '.join(words)
        changed = capitalized != h
        if changed:
            p.h = capitalized
            c.setChanged()
            p.setDirty()
            u.afterChangeNodeContents(p, undoType, undoData)
            c.redraw()

        */

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
    public setUa(): void {
        console.log('TODO : setUa');
        /* 
        const k = this.c.k
        this.w = this.editWidget(event)
        if this.w:
            k.setLabelBlue('Set uA: ')
            k.get1Arg(event, handler=this.setUa1)
         */
    }

    public setUa1(): void {
        console.log('TODO : setUa1');

        /* 
        k = this.c.k
        this.uaName = k.arg
        s = f"Set uA: {this.uaName} To: "
        k.setLabelBlue(s)
        k.getNextArg(this.setUa2)
        */

    }

    public setUa2(): void {
        console.log('TODO : setUa2');

        /* 
        c, k = this.c, this.c.k
        val = k.arg
        d = c.p.v.u
        d[this.uaName] = val
        this.showNodeUas()
        k.clearState()
        k.resetLabel()
        k.showStateAndMode()
        */

    }
    //@-others

}
//@-others


// @cmd
// with top level being @g.command
//@-leo
