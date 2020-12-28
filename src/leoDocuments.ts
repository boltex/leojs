import * as vscode from "vscode";
import { LeoUI } from './leoUI';

import { LeoDocumentNode } from "./leoDocumentNode";
import { ProviderResult } from "vscode";
import { LeoStates } from "./leoStates";
import { Leojs } from "./leojs";

/**
 * * Opened Leo documents shown as a list with this TreeDataProvider implementation
 */
export class LeoDocumentsProvider implements vscode.TreeDataProvider<LeoDocumentNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoDocumentNode | undefined> = new vscode.EventEmitter<LeoDocumentNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoDocumentNode | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _leoUI: LeoUI,
        private _leojs: Leojs
    ) { }

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
        const w_children: LeoDocumentNode[] = [];
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoStates.fileOpenedReady && !element) {
            this._leojs.documents.forEach(p_doc => {
                w_children.push(new LeoDocumentNode(p_doc, this._leoUI));
            });
        }
        return Promise.resolve(w_children); // Defaults to an empty list of children
    }

    public getParent(element: LeoDocumentNode): ProviderResult<LeoDocumentNode> {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return undefined;
    }

}
