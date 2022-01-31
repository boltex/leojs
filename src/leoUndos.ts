import * as vscode from "vscode";
import { LeoUI } from './leoUI';
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';
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
            const c = g.app.commanders()[this._leoUI.commanderIndex];
            const undoer = c.undoer;

            let i: number = 0;
            undoer.beads.forEach(p_bead => {
                let w_description: string = "";
                let w_undoFlag: boolean = false;
                if (i === undoer.bead) {
                    w_description = "Undo";
                    w_undoFlag = true;
                }
                if (i === undoer.bead + 1) {
                    w_description = "Redo";
                }
                const w_node = new LeoUndoNode(p_bead, w_description, this._beadId++);
                w_children.push(w_node);
                if (w_undoFlag) {
                    this._leoUI.setUndoSelection(w_node);
                }
                i++;
            });
            if (!undoer.beads.length) {
                const w_node = new LeoUndoNode({ undoType: "Unchanged" }, "", this._beadId++);
                w_children.push(w_node);
            }

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
        public description: string,
        private _beadId: number,

    ) {
        super(bead.undoType || "unknown");
        // Setup this instance (just differentiate 'script-button' for now)
        // this.command = {
        //     command: Constants.COMMANDS.CLICK_BUTTON,
        //     title: '',
        //     arguments: [this]
        // };
        this.contextValue = "leojsUndoNode";
    }

    // @ts-ignore
    public get id(): string {
        // Add prefix and suffix salt to numeric index to prevent accidental duplicates
        return "b" + this._beadId;
    }

    // @ts-ignore
    public get tooltip(): string {
        return "TODO leojs Undo Tooltip";
    }

}


