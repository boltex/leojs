//@+leo-ver=5-thin
//@+node:felix.20240615151733.1: * @file src/commands/rectangleCommands.ts
/**
 * Leo's rectangle commands.
 */
//@+<< rectangleCommands imports & annotations >>
//@+node:felix.20240615151733.2: ** << rectangleCommands imports & annotations >>
import * as g from '../core/leoGlobals';
import { new_cmd_decorator } from '../core/decorators';
import { Commands } from '../core/leoCommands';
import { StringTextWrapper } from '../core/leoFrame';
//@-<< rectangleCommands imports & annotations >>

/**
 * Command decorator for the RectangleCommandsClass class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'rectangleCommands']);
}

//@+others
//@+node:felix.20240615151733.3: ** class RectangleCommandsClass
export class RectangleCommandsClass {

    public theKillRectangle: string[];  // Do not re-init this!
    public stringRect: [number, number, number, number] | undefined;
    public commandsDict: Record<string, [string, any]>;
    public c: Commands;
    w!: StringTextWrapper;
    //@+others
    //@+node:felix.20240615151733.4: *3* rectangle.ctor
    /**
     * Ctor for RectangleCommandsClass.
     */
    constructor(c: Commands) {
        this.c = c;
        this.theKillRectangle = [];  // Do not re-init this!
        this.stringRect = undefined;
        this.commandsDict = {
            'c': ['clear-rectangle', this.clearRectangle],
            'd': ['delete-rectangle', this.deleteRectangle],
            'k': ['kill-rectangle', this.killRectangle],
            'o': ['open-rectangle', this.openRectangle],
            // 'r': ('copy-rectangle-to-register', this.copyRectangleToRegister),
            't': ['string-rectangle', this.stringRectangle],
            'y': ['yank-rectangle', this.yankRectangle],
        };

    }
    //@+node:felix.20240615151733.5: *3* check
    // /**
    //  * Return True if there is a selection.
    //  * Otherwise, return False and issue a warning.
    //  */
    // public check(warning = 'No rectangle selected'): boolean {
    //     return this._chckSel(warning);
    // }

    // /**
    //  * Return True if there is a selection in the edit widget.
    //  */
    // public _chckSel(warning = 'no selection'): boolean {
    //     const w = this.editWidget();
    //     const val = !!(w && w.hasSelection());
    //     if (warning && !val) {
    //         g.es(warning);
    //     }
    //     return val;
    // }

    //     public editWidget(forceFocus = true): StringTextWrapper {
    //     const c = this.c;

    //     // ? needed ?
    //     // w = event and event.widget
    //     // // wname = c.widget_name(w) if w else '<no widget>'
    //     // if w and g.isTextWrapper(w):
    //     //     pass
    //     // else:
    //     //     w = c.frame.body and c.frame.body.wrapper

    //     const w = c.frame.body && c.frame.body.wrapper;

    //     if (w && forceFocus) {
    //         c.widgetWantsFocusNow(w);
    //     }
    //     this.w = w;
    //     return w;
    // }

    /**
     * Return the rectangle corresponding to the selection range.
     */
    public getRectanglePoints(
        w: StringTextWrapper
    ): [number, number, number, number] {
        const c = this.c;
        c.widgetWantsFocusNow(w);
        const s = w.getAllText();
        let i, j;
        [i, j] = w.getSelectionRange();
        let r1, r2, r3, r4;
        [r1, r2] = g.convertPythonIndexToRowCol(s, i);
        [r3, r4] = g.convertPythonIndexToRowCol(s, j);
        return [r1 + 1, r2, r3 + 1, r4];
    }

    //@+node:felix.20240615151733.6: *3* rectangle.Entries
    //@+node:felix.20240615151733.7: *4* clearRectangle
    @cmd('rectangle-clear', 'Clear the rectangle defined by the start and end of selected text.')
    public clearRectangle(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        if (!w.hasSelection()) {
            return;
        }

        const toInt = (index: string): number => {
            return g.toPythonIndex(w.getAllText(), index);
        };

        const [r1, r2, r3, r4] = this.getRectanglePoints(w);
        {
            using changes = u.change_node(p, 'clear-rectangle');

            const fill = ' '.repeat(r4 - r2);
            for (let r = r1; r <= r3; r++) {
                w.delete(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
                w.insert(toInt(`${r}.${r2}`), fill);
            }
            p.v.b = w.getAllText();
            w.setSelectionRange(toInt(`${r1}.${r2}`), toInt(`${r3}.${r2 + fill.length}`));

        }
    }
    //@+node:felix.20240615151733.8: *4* closeRectangle
    @cmd('rectangle-close', 'Delete the rectangle if it contains nothing but whitespace.')
    public closeRectangle(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        if (!w.hasSelection()) {
            return;
        }

        const toInt = (index: string): number => {
            return g.toPythonIndex(w.getAllText(), index);
        };

        const [r1, r2, r3, r4] = this.getRectanglePoints(w);
        // Return if any part of the selection contains something other than whitespace.
        for (let r = r1; r <= r3; r++) {
            const s = w.get(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
            if (s.trim()) {
                return;
            }
        }
        {
            using changes = u.change_node(p, 'close-rectangle');

            for (let r = r1; r <= r3; r++) {
                w.delete(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
            }
            const i = toInt(`${r1}.${r2}`);
            const j = toInt(`${r3}.${r2}`);
            p.v.b = w.getAllText();
            w.setSelectionRange(i, j, j);
        }
    }
    //@+node:felix.20240615151733.9: *4* deleteRectangle
    @cmd('rectangle-delete', 'Delete the rectangle defined by the start and end of selected text.')
    public deleteRectangle(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        if (!w.hasSelection()) {
            return;
        }

        const toInt = (index: string): number => {
            return g.toPythonIndex(w.getAllText(), index);
        };

        const [r1, r2, r3, r4] = this.getRectanglePoints(w);
        {
            using changes = u.change_node(p, 'delete-rectangle');

            for (let r = r1; r <= r3; r++) {
                w.delete(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
            }
            const i = toInt(`${r1}.${r2}`);
            const j = toInt(`${r3}.${r2}`);
            p.v.b = w.getAllText();
            w.setSelectionRange(i, j, j);
        }
    }
    //@+node:felix.20240615151733.10: *4* killRectangle
    @cmd('rectangle-kill', 'Kill the rectangle defined by the start and end of selected text.')
    public killRectangle(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        if (!w.hasSelection()) {
            return;
        }

        const toInt = (index: string): number => {
            return g.toPythonIndex(w.getAllText(), index);
        };

        const [r1, r2, r3, r4] = this.getRectanglePoints(w);
        this.theKillRectangle = [];
        {
            using changes = u.change_node(p, 'kill-rectangle');

            for (let r = r1; r <= r3; r++) {
                const s = w.get(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
                this.theKillRectangle.push(s);
                w.delete(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
            }
            p.v.b = w.getAllText();
            if (this.theKillRectangle.length > 0) {
                const ins = toInt(`${r3}.${r2}`);
                w.setSelectionRange(ins, ins, ins);
            }
        }
    }
    //@+node:felix.20240615151733.11: *4* openRectangle
    @cmd('rectangle-open', ' Insert blanks in the rectangle defined by the start and end of selected text.')
    public openRectangle(): void {
        /**
         * Insert blanks in the rectangle defined by the start and end of selected
         * text. This pushes the previous contents of the rectangle rightward.
         */
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        if (!w.hasSelection()) {
            return;
        }

        const toInt = (index: string): number => {
            return g.toPythonIndex(w.getAllText(), index);
        };

        const [r1, r2, r3, r4] = this.getRectanglePoints(w);
        const fill = ' '.repeat(r4 - r2);
        {
            using changes = u.change_node(p, 'open-rectangle');
            for (let r = r1; r <= r3; r++) {
                w.insert(toInt(`${r}.${r2}`), fill);
            }
            const i = toInt(`${r1}.${r2}`);
            const j = toInt(`${r3}.${r2 + fill.length}`);
            p.v.b = w.getAllText();
            w.setSelectionRange(i, j, j);
        }
    }
    //@+node:felix.20240615151733.12: *4* stringRectangle
    @cmd('rectangle-string', 'Prompt for a string, then replace the contents of a rectangle with a string on each line.')
    public async stringRectangle(): Promise<void> {
        let arg;
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;

        if (g.unitTesting) {
            arg = 's...s';  // This string is known to the unit test.
            this.stringRect = this.getRectanglePoints(w);
        } else {
            arg = await g.app.gui.get1Arg(
                {
                    title: "Replace rectangle with",
                    prompt: "Type text to replace with and press enter.",
                    placeHolder: "String rectangle",
                }
            );
            if (arg == null || !g.isTextWrapper(w)) {
                return;
            }
            if (!w.hasSelection()) {
                return;
            }
            this.stringRect = this.getRectanglePoints(w);
        }

        c.bodyWantsFocus();
        const [r1, r2, r3, r4] = this.stringRect;
        let s = w.getAllText();
        for (let r = r1; r <= r3; r++) {
            const i = g.convertRowColToPythonIndex(s, r - 1, r2);
            const j = g.convertRowColToPythonIndex(s, r - 1, r4);
            s = s.slice(0, i) + arg + s.slice(j);
        }

        const i = g.convertRowColToPythonIndex(s, r1 - 1, r2);
        const j = g.convertRowColToPythonIndex(s, r3 - 1, r2 + arg.length);
        {
            using changes = u.change_node(p, 'string-rectangle');
            w.setAllText(s);
            p.v.b = s;
            w.setSelectionRange(i, j);
        }
    }
    //@+node:felix.20240615151733.13: *4* yankRectangle
    @cmd('rectangle-yank', 'Yank into the rectangle defined by the start and end of selected text.')
    public yankRectangle(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!w) {
            return;
        }
        let killRect = this.theKillRectangle;

        const toInt = (index: string): number => {
            return g.toPythonIndex(w.getAllText(), index);
        };

        if (g.unitTesting) {
            // This value is used by the unit test.
            killRect = ['Y1Y', 'Y2Y', 'Y3Y', 'Y4Y'];
        } else if (!killRect) {
            g.es('No kill rect');
            return;
        }
        {
            using changes = u.change_node(p, 'yank-rectangle');

            const [r1, r2, r3, r4] = this.getRectanglePoints(w);
            let n = 0;
            for (let r = r1; r <= r3; r++) {
                if (n >= killRect.length) {
                    break;
                }
                w.delete(toInt(`${r}.${r2}`), toInt(`${r}.${r4}`));
                w.insert(toInt(`${r}.${r2}`), killRect[n]);
                n++;
            }
            const i = toInt(`${r1}.${r2}`);
            const j = toInt(`${r3}.${r2 + killRect[n - 1].length}`);
            w.setSelectionRange(i, j, j);
            p.v.b = w.getAllText();
        }
    }
    //@-others

}
//@-others
//@-leo
