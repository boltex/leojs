import * as vscode from 'vscode';
import { LeoNode } from './leoNode';
import { ProviderResult } from "vscode";
import { Icon, PNode } from './types';
import { Leojs } from './leojs';

export class LeoOutlineProvider implements vscode.TreeDataProvider<PNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<PNode | undefined> = new vscode.EventEmitter<PNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<PNode | undefined> = this._onDidChangeTreeData.event;

    private _uniqueId: number = 0;

    constructor(
        private _icons: Icon[],
        private _leo: Leojs
    ) {
    }


    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: PNode): Thenable<LeoNode> | LeoNode {
        // Build a LeoNode (a vscode tree node) from the PNode
        return new LeoNode(element.header,
            element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            element, // ap
            false, // cloned
            false, // dirty
            false, // marked
            false, // atFile
            !!element.body && !!element.body.length,
            false, // u
            this._icons,
            "id" + this._uniqueId++
        );
    }

    public getChildren(element?: PNode): Thenable<PNode[]> {
        if (element) {
            return Promise.resolve(element.children);
        } else {
            return Promise.resolve(this._leo.positions);
        }
    }

    public getParent(element: PNode): ProviderResult<PNode> {
        // Buttons are just a list, as such, entries are always child of root so return null
        if (element) {
            return element.parent;
        }
        return undefined;
    }

}
