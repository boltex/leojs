import * as vscode from "vscode";
import { LeoUI } from './leoUI';
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';
import { Icon } from "./types";

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
        private _icons: Icon[],
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
        if (this._leoStates.fileOpenedReady && !element && g.app.windowList.length) {
            const c = g.app.windowList[this._leoUI.frameIndex].c;
            const undoer = c.undoer;

            if (undoer.beads.length) {

                let i: number = 0;
                let w_defaultIcon = 1;

                undoer.beads.forEach(p_bead => {
                    let w_description: string = "";
                    let w_undoFlag: boolean = false;
                    let w_icon = w_defaultIcon;
                    if (i === undoer.bead) {
                        w_description = "Undo";
                        w_undoFlag = true;
                        w_icon = 0;
                        w_defaultIcon = 2;
                    }
                    if (i === undoer.bead + 1) {
                        w_description = "Redo";
                        w_icon = 2;
                        w_defaultIcon = 3;
                    }
                    const w_node = new LeoUndoNode(
                        p_bead.undoType || "unknown",
                        w_description,
                        (this._beadId++).toString(),
                        this._icons[w_icon]
                    );
                    w_children.push(w_node);
                    if (w_undoFlag) {
                        this._leoUI.setUndoSelection(w_node);
                    }
                    i++;
                });
            } else {
                const w_node = new LeoUndoNode(
                    "Unchanged",
                    "",
                    (this._beadId++).toString(),
                    undefined
                );
                w_children.push(w_node);
            }

        }
        return w_children; // Defaults to an empty list of children
    }

    public getParent(element: LeoUndoNode): vscode.ProviderResult<LeoUndoNode> {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return undefined;
    }

    public resolveTreeItem(item: LeoUndoNode, element: LeoUndoNode, token: vscode.CancellationToken): vscode.ProviderResult<LeoUndoNode> {
        item.tooltip = "TODO leojs Undo Tooltip";
        return item;
    }
}

/**
 * * Opened Leo documents tree view node item implementation for usage in a TreeDataProvider
 */
export class LeoUndoNode extends vscode.TreeItem {

    // Context string is checked in package.json with 'when' clauses
    public contextValue: string = "leojsUndoNode";

    constructor(
        public label: string,
        public description: string,
        public id: string,
        public iconPath?: Icon
    ) {
        super(label);
    }

}


