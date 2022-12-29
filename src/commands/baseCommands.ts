//@+leo-ver=5-thin
//@+node:felix.20221220233857.1: * @file src/commands/baseCommands.ts
/**
 * The base class for all of Leo's user commands.
 */

//@+<< baseCommands imports & abbreviations >>
//@+node:felix.20221220234555.1: ** << baseCommands imports & abbreviations >>
import * as g from '../core/leoGlobals';
import { Commands } from "../core/leoCommands";
import { StringTextWrapper } from '../core/leoFrame';
//@-<< baseCommands imports & abbreviations >>

//@+others
//@+node:felix.20221220234605.1: ** class BaseEditCommandsClass
/**
 * The base class for all edit command classes
 */
export class BaseEditCommandsClass {

    public c: Commands;
    public w!: StringTextWrapper;

    //@+others
    //@+node:felix.20221220234605.2: *3* BaseEdit.ctor
    /**
     * Ctor for the BaseEditCommandsClass class.
     *
     * Subclasses with ctors set self.c instead of calling this ctor.
     * Subclasses without ctors call this ctor implicitly.
     */
    constructor(c: Commands) {
        this.c = c;
    }
    //@+node:felix.20221220234605.3: *3* BaseEdit.begin/endCommand (handles undo)
    //@+node:felix.20221220234605.4: *4* BaseEdit.beginCommand
    // def beginCommand(self, w: Wrapper, undoType: str='Typing') -> Wrapper:
    //     """Do the common processing at the start of each command."""
    //     c, p, u = self.c, self.c.p, self.c.undoer
    //     name = c.widget_name(w)
    //     if name.startswith('body'):
    //         self.undoData = b = g.Bunch()
    //         # To keep pylint happy.
    //         b.ch = ''
    //         b.name = name
    //         b.oldSel = w.getSelectionRange()
    //         b.oldText = p.b
    //         b.w = w
    //         b.undoType = undoType
    //         b.undoer_bunch = u.beforeChangeBody(p)  # #1733.
    //     else:
    //         self.undoData = None  # pragma: no cover
    //     return w
    //@+node:felix.20221220234605.5: *4* BaseEdit.endCommand
    // def endCommand(self, label: str=None, changed: bool=True, setLabel: bool=True) -> None:
    //     """
    //     Do the common processing at the end of each command.
    //     Handles undo only if we are in the body pane.
    //     """
    //     k, p, u = self.c.k, self.c.p, self.c.undoer
    //     w = self.editWidget(event=None)
    //     bunch = self.undoData
    //     if bunch and bunch.name.startswith('body') and changed:
    //         newText = w.getAllText()
    //         if bunch.undoType.capitalize() == 'Typing':
    //             u.doTyping(p, 'Typing',
    //                 oldText=bunch.oldText,
    //                 newText=newText,
    //                 oldSel=bunch.oldSel)
    //         else:
    //             p.v.b = newText  # p.b would cause a redraw.
    //             u.afterChangeBody(p, bunch.undoType, bunch.undoer_bunch)
    //     self.undoData = None
    //     k.clearState()
    //     # Warning: basic editing commands **must not** set the label.
    //     if setLabel:
    //         if label:
    //             k.setLabelGrey(label)  # pragma: no cover
    //         else:
    //             k.resetLabel()
    //@+node:felix.20221220234605.6: *3* BaseEdit.editWidget
    /**
     * Return the edit widget for the event. Also sets self.w
     */
    public editWidget(forceFocus = true): StringTextWrapper {

        const c = this.c;

        // ? needed ?
        // w = event and event.widget
        // // wname = c.widget_name(w) if w else '<no widget>'
        // if w and g.isTextWrapper(w):
        //     pass
        // else:
        //     w = c.frame.body and c.frame.body.wrapper

        const w = c.frame.body && c.frame.body.wrapper;

        if (w && forceFocus) {
            c.widgetWantsFocusNow(w);
        }
        this.w = w;
        return w;

    }
    //@+node:felix.20221220234605.7: *3* BaseEdit.getWSString
    /**
     * Return s with all characters replaced by tab or space.
     */
    public getWSString(s: string): string {

        // return ([ch if ch == '\t' else ' ' for ch in s]).join('');

        return [...s].map((ch) => { return ch === '\t' ? ch : ' '; }).join('');

    }
    //@+node:felix.20221220234605.8: *3* BaseEdit.oops
    /**
     * Return a "must be overridden" message
     */
    public oops(): void {

        g.pr("BaseEditCommandsClass oops:",
            g.callers(),
            "must be overridden in subclass");

    }
    //@+node:felix.20221220234605.9: *3* BaseEdit.Helpers
    //@+node:felix.20221220234605.10: *4* BaseEdit._chckSel
    /**
     * Return True if there is a selection in the edit widget.
     */
    public _chckSel(warning = 'no selection'): boolean {

        const w = this.editWidget();
        const val = !!(w && w.hasSelection());
        if (warning && !val) {
            g.es(warning);
        }
        return val;

    }
    //@+node:felix.20221220234605.11: *4* BaseEdit.getRectanglePoints
    /**
     * Return the rectangle corresponding to the selection range.
     */
    public getRectanglePoints(w: StringTextWrapper): [number, number, number, number] {

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
    //@+node:felix.20221220234605.12: *4* BaseEdit.keyboardQuit
    /**
     * Clear the state and the minibuffer label.
     */
    public keyboardQuit(): void {

        this.c.k.keyboardQuit();

    }
    //@-others

}
//@-others
//@-leo