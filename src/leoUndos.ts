import * as vscode from "vscode";
import { LeoUI } from './leoUI';
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";
import { Bead } from "./core/leoUndo";

/**
 * * Undo beads shown as a list with this TreeDataProvider implementation
 */
export class LeoUndosProvider implements vscode.TreeDataProvider<LeoUndoNode> {

    private _beadId = 0;

    private _onDidChangeTreeData: vscode.EventEmitter<LeoUndoNode | undefined> = new vscode.EventEmitter<LeoUndoNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoUndoNode | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _leoUI: LeoUI,
    ) { }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoUndoNode): Thenable<LeoUndoNode> | LeoUndoNode {
        return element;
    }

    public getChildren(element?: LeoUndoNode): LeoUndoNode[] {
        const w_children: LeoUndoNode[] = [];
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoStates.fileOpenedReady && !element) {
            const c = g.app.commandersList[this._leoUI.commanderIndex];
            const undoer = c.undoer;
            let i: number = 0;
            undoer.beads.forEach(p_bead => {
                w_children.push(new LeoUndoNode(p_bead, this._beadId++, this._leoUI));
                if (i === undoer.bead) {
                    console.log('Select Current Undo # : ' + undoer.bead);
                }
                i++;
            });

        }
        return w_children; // Defaults to an empty list of children
    }

    public getParent(element: LeoUndoNode): vscode.ProviderResult<LeoUndoNode> {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return undefined;
    }

}

/**
 * * Opened Leo documents tree view node item implementation for usage in a TreeDataProvider
 */
export class LeoUndoNode extends vscode.TreeItem {

    // Context string is checked in package.json with 'when' clauses
    public contextValue: string;

    constructor(
        bead: Bead,
        private _beadId: number,
        private _leoUI: LeoUI
    ) {
        super(bead.undoType || "unkown undo");
        // Setup this instance (just differentiate 'script-button' for now)
        // this.command = {
        //     command: Constants.COMMANDS.CLICK_BUTTON,
        //     title: '',
        //     arguments: [this]
        // };
        this.contextValue = "leojsUndoNode";
    }

    // @ts-ignore
    public get iconPath(): Icon {
        return this._leoUI.documentIcons[0];
    }

    // @ts-ignore
    public get id(): string {
        // Add prefix and suffix salt to numeric index to prevent accidental duplicates
        return "b" + this._beadId;
    }

    // @ts-ignore
    public get tooltip(): string {
        return "TODO leojsUndo Tooltip";
    }

}


