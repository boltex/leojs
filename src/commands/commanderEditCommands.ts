//@+leo-ver=5-thin
//@+node:felix.20220414231314.1: * @file src/commands/commanderEditCommands.ts
// * Outline commands that used to be defined in leoCommands.py
import * as et from 'elementtree';
import * as g from '../core/leoGlobals';
import { commander_command } from "../core/decorators";
import { StackEntry, Position, VNode } from "../core/leoNodes";
import { Commands, HoistStackEntry } from "../core/leoCommands";
import { Bead, Undoer } from '../core/leoUndo';

//@+others
//@+node:felix.20220414231634.1: ** Class CommanderEditCommands
export class CommanderEditCommands {

    //@+others
    //@+node:felix.20220429212903.1: *3*  Top-level commands
    //@+node:felix.20220429212903.3: *4* @g.command('mark-first-parents')
    @commander_command(
        'mark-first-parents',
        'Mark the node and all its parents.'
    )
    public mark_first_parents(this: Commands):  Position[] {

        const c: Commands = this;
        const changed: Position[] = [];

        if (!c){
            return changed;
        }
        for(let parent of c.p.self_and_parents()){
            if (!parent.isMarked()){
                parent.setMarked();
                parent.setDirty();
                changed.push(parent.copy());
            }
        }
        if (changed.length){
            // g.es("marked: " + ', '.join([z.h for z in changed]))
            c.setChanged();
            c.redraw();
        }
        return changed;
    }
    //@+node:felix.20220429212903.8: *4* @g.command('promote-bodies')
    @commander_command(
        'promote-bodies',
        'Copy the body text of all descendants to the parent\'s body text.'
    )
    public promoteBodies(this: Commands): void {

        const c: Commands = this;
        if (!c){
            return;
        }
        const p: Position = c.p;
        const result: string[] = p.b.trim() ? [p.b.trimEnd() + '\n'] : [];

        const b: Bead = c.undoer.beforeChangeNodeContents(p);

        let s: string;

        for (let child of p.subtree()){
            const h = child.h.trim();
            if (child.b){

                // body = '\n'.join([f"  {z}" for z in g.splitLines(child.b)])
                const body = [...g.splitLines(child.b)].map(z => `  ${z}`).join('\n');

                s = `- ${h}\n${body}`;
            }else{
                s = `- ${h}`;
            }
            if (s.trim()){
                result.push(s.trim());
            }
        }
        if (result.length){
            result.push('');
        }
        p.b = result.join('\n');

        c.undoer.afterChangeNodeContents(p, 'promote-bodies', b);

    }
    //@+node:felix.20220429212903.9: *4* @g.command('promote-headlines')
    @commander_command(
        'promote-headlines',
        'Copy the headlines of all descendants to the parent\'s body text.'
    )
    public promoteHeadlines(this: Commands): void {

        const c: Commands = this;
        if (!c){
            return;
        }
        const p: Position = c.p;

        const b: Bead = c.undoer.beforeChangeNodeContents(p);

        const result: string = [...p.subtree()].map(p_p=>p_p.h.trimEnd()).join('\n');
         // '\n'.join([p.h.trimEnd() for p in p.subtree()])

        if (result){
            p.b = p.b.trimStart() + '\n' + result;
            c.undoer.afterChangeNodeContents(p, 'promote-headlines', b);
        }
    }

    //@+node:felix.20220429212903.13: *4* @g.command('unmark-first-parents')
    @commander_command(
        'unmark-first-parents',
        'Unmark the node and all its parents.'
    )
    public unmark_first_parents(this: Commands): Position[] {

        const c: Commands = this;
        const changed: Position[] = [];

        if (!c){
            return changed;
        }

        for (let parent of c.p.self_and_parents()){
            if (parent.isMarked()){
                parent.clearMarked();
                parent.setDirty();
                changed.push(parent.copy());
            }
        }

        if (changed.length){
            // g.es("unmarked: " + ', '.join([z.h for z in changed]))
            c.setChanged();
            c.redraw();
        }
        return changed;
    }
    //@+node:felix.20220429212918.1: *3* ec.doNothing
    @commander_command(
        'do-nothing',
        'A placeholder command, useful for testing bindings.'
    )
    public doNothing(this: Commands): void {
        // pass
    }
    //@+node:felix.20220414235045.1: *3* c_ec.convertAllBlanks
    @commander_command(
        'convert-all-blanks',
        'Convert all blanks to tabs in the selected outline.'
    )
    public convertAllBlanks(this: Commands): void {
        const c: Commands = this;
        const u = this.undoer;

        console.log('TODO: finish undo unit tests & uncomment!');

        // TODO: finish undo unit tests & uncomment !
        /*
        const undoType = 'Convert All Blanks';
        const current = c.p;
        if (g.app.batchMode) {
            c.notValidInBatchMode(undoType);
            return;
        }
        const d = c.scanAllDirectives(c.p);
        const tabWidth = d.get("tabwidth");
        let count = 0;
        u.beforeChangeGroup(current, undoType);

        for (let p of current.self_and_subtree()) {
            let changed = false;
            const innerUndoData = u.beforeChangeNodeContents(p)
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
        */

    }

    //@-others

}
//@-others
//@-leo
