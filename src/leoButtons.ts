import * as vscode from "vscode";
import { LeoButtonNode } from "./leoButtonNode";
import { ProviderResult } from "vscode";
import { Icon, LeoButton } from "./types";
import { LeoStates } from "./leoStates";


/**
 * * '@buttons' shown as a list with this TreeDataProvider implementation
 */
export class LeoButtonsProvider implements vscode.TreeDataProvider<LeoButtonNode> {

    private fakeAtButtons: LeoButton[] = [
        { name: 'script-button', index: 'nullButtonWidget' },
        { name: 'button name 2', index: 'key2' },
        { name: 'button name 3', index: 'key3' },
    ];

    private _onDidChangeTreeData: vscode.EventEmitter<LeoButtonNode | undefined> = new vscode.EventEmitter<LeoButtonNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoButtonNode | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _icons: Icon[],
    ) { }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoButtonNode): Thenable<LeoButtonNode> | LeoButtonNode {
        return element;
    }

    public getChildren(element?: LeoButtonNode): Thenable<LeoButtonNode[]> {
        const w_children: LeoButtonNode[] = [];
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoStates.fileOpenedReady && !element) {
            this.fakeAtButtons.forEach(p_button => {
                w_children.push(new LeoButtonNode(p_button, this._icons));
            });
        }
        return Promise.resolve(w_children); // Defaults to an empty list of children
    }

    public getParent(element: LeoButtonNode): ProviderResult<LeoButtonNode> | null {
        // Buttons are just a list, as such, entries are always child of root so return null
        return null;
    }

}
