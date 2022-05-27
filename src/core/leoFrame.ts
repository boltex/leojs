//@+leo-ver=5-thin
//@+node:felix.20220512205042.1: * @file src/core/leoFrame.ts
/**
 * Frame for typescript client support
 */
//@+<< imports >>
//@+node:felix.20220512211158.1: ** << imports >>
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';
import { Commands } from "./leoCommands";
import { Position } from './leoNodes';
import { FileCommands } from './leoFileCommands';

//@-<< imports >>

//@+others
//@+node:felix.20220512211744.1: ** class LeoFrame
export class LeoFrame {

    public c: Commands;
    public title: string;
    public gui: LeoUI;
    public openDirectory: string;
    public iconBar: any;
    public saved: boolean;
    public startupWindow: boolean;
    public tree: {
        generation: number;
        editLabel: (
            p: Position,
            selectAll: boolean,
            selection: any
        ) => void;
    };
    public body: any;

    //@+others
    //@+node:felix.20220512211350.1: *3* frame.ctor
    constructor(c: Commands, title: string, gui: LeoUI) {
        this.c = c;
        this.title = title;
        this.gui = gui;
        this.saved = false;
        this.startupWindow = false;
        this.openDirectory = '';
        this.iconBar = {};

        this.tree = {
            generation: 0,
            editLabel: (p: Position, selectAll: boolean, selection: any) => {
                console.log(
                    'TODO: editLabel not used in leojs. From c.frame.tree.editLabel'
                );
            }
        };

        this.body = {
            wrapper: {
                setAllText: (s: string) => {
                    console.log('TODO: setAllText of c.frame.body.wrapper');
                }
            }
        };
    }
    //@+node:felix.20220512220820.1: *3* destroySelf
    public destroySelf(): void {
        console.log('TODO: DestroySelf');

    }
    //@+node:felix.20220512222542.1: *3* finishCreate
    public finishCreate() {
        g.app.windowList.push(this);
    }
    //@+node:felix.20220516001519.1: *3* LeoFrame.promptForSave
    /**
     * Prompt the user to save changes.
     * Return True if the user vetos the quit or save operation.
     */
    public async promptForSave(): Promise<boolean> {

        const c = this.c;
        const theType = g.app.quitting ? "quitting?" : "closing?";
        // See if we are in quick edit/save mode.
        let root = c.rootPosition()!;
        const quick_save = !c.mFileName && !root.next().__bool__() && root.isAtEditNode();

        let name: string;
        if (quick_save) {
            name = g.shortFileName(root.atEditNodeName());
        } else {
            name = c.mFileName ? c.mFileName : this.title;
        }
        const answer = await g.app.gui!.runAskYesNoCancelDialog(
            c,
            'Confirm',
            `Save changes to ${g.splitLongFileName(name)} before ${theType}`
        );

        if (answer === "cancel") {
            return true;  // Veto.
        }
        if (answer === "no") {
            return false;  // Don't save and don't veto.
        }
        if (!c.mFileName) {
            const root = c.rootPosition()!;
            if (!root.next() && root.isAtEditNode()) {
                // There is only a single @edit node in the outline.
                // A hack to allow "quick edit" of non-Leo files.
                // See https://bugs.launchpad.net/leo-editor/+bug/381527
                // Write the @edit node if needed.
                if (root.isDirty()) {
                    c.atFileCommands.writeOneAtEditNode(root);
                }
                return false;  // Don't save and don't veto.
            }
            c.mFileName = await g.app.gui!.runSaveFileDialog(
                c,
                "Save",
                [["Leo files", "*.leo"]],
                ".leo"
            );

            c.bringToFront();
        }
        if (c.mFileName) {
            const ok = await (c.fileCommands as FileCommands).save(c.mFileName);
            return !ok;  // Veto if the save did not succeed.
        }
        return true;  // Veto.

    }
    //@-others

}
//@-others

//@@language typescript
//@@tabwidth -4
//@-leo
