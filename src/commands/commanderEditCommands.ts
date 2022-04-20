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
    //@+node:felix.20220414235045.1: *3* c_ec.convertAllBlanks
    @commander_command(
        'convert-all-blanks',
        'Convert all blanks to tabs in the selected outline.'
    )
    public convertAllBlanks(this: Commands): void {
        const c: Commands = this;
        const u = this.undoer;

        console.log('TODO: finish unto unit tests & uncomment!');

        // TODO: finish unto unit tests & uncomment !
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