import * as vscode from "vscode";
import { LeoUI } from './leoUI';

import { LeoDocumentNode } from "./leoDocumentNode";
import { ProviderResult } from "vscode";
import { Constants } from "./constants";
import { LeoDocument } from "./types";

/**
 * * Opened Leo documents shown as a list with this TreeDataProvider implementation
 */
export class LeoDocumentsProvider implements vscode.TreeDataProvider<LeoDocumentNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoDocumentNode | undefined> = new vscode.EventEmitter<LeoDocumentNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoDocumentNode | undefined> = this._onDidChangeTreeData.event;

    constructor(private _leoJs: LeoUI) { }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoDocumentNode): Thenable<LeoDocumentNode> | LeoDocumentNode {
        return element;
    }

    public getChildren(element?: LeoDocumentNode): Thenable<LeoDocumentNode[]> {
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoJs.leoStates.fileOpenedReady && !element) {
            // TODO : get real list!
            return Promise.resolve([

                new LeoDocumentNode({ name: "fakeSelectedDoc1.leo", index: 0, changed: false, selected: true }, this._leoJs),
                new LeoDocumentNode({ name: "fakeChangedDoc2.leo", index: 1, changed: true, selected: false }, this._leoJs),
                new LeoDocumentNode({ name: "fakeDoc3.leo", index: 2, changed: false, selected: false }, this._leoJs)

            ]);
        } else {
            return Promise.resolve([]); // Defaults to an empty list of children
        }
    }

    public getParent(element: LeoDocumentNode): ProviderResult<LeoDocumentNode> | null {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return null;
    }

}
