import * as vscode from "vscode";
import { LeoUI } from './leoUI';
import { LeoButtonNode } from "./leoButtonNode";
import { ProviderResult } from "vscode";
import { Constants } from "./constants";
import { LeoButton } from "./types";

/**
 * * '@buttons' shown as a list with this TreeDataProvider implementation
 */
export class LeoButtonsProvider implements vscode.TreeDataProvider<LeoButtonNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoButtonNode | undefined> = new vscode.EventEmitter<LeoButtonNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoButtonNode | undefined> = this._onDidChangeTreeData.event;

    constructor(private _leoJs: LeoUI) { }

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

        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoJs.leoStates.fileOpenedReady && !element) {
            // TODO get list from leoJs
            return Promise.resolve([
                new LeoButtonNode({ name: 'script-button', index: 'nullButtonWidget' }, this._leoJs.buttonIcons),
                new LeoButtonNode({ name: 'button name 2', index: 'key2' }, this._leoJs.buttonIcons),
                new LeoButtonNode({ name: 'button name 3', index: 'key3' }, this._leoJs.buttonIcons)

            ]);
        } else {
            return Promise.resolve([]); // Defaults to an empty list of children
        }
    }

    public getParent(element: LeoButtonNode): ProviderResult<LeoButtonNode> | null {
        // Buttons are just a list, as such, entries are always child of root so return null
        return null;
    }

}
