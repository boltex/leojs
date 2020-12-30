import * as vscode from 'vscode';
import { LeoNode } from './leoNode';
import { ProviderResult } from "vscode";
import { Icon, PNode } from './types';
import { Leojs } from './leojs';
import { LeoUI } from './leoUI';

export class LeoOutlineProvider implements vscode.TreeDataProvider<PNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<PNode | undefined> = new vscode.EventEmitter<PNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<PNode | undefined> = this._onDidChangeTreeData.event;

    private _uniqueId: number = 0;

    constructor(
        private _icons: Icon[],
        private _leoUI: LeoUI,
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
        const w_leoNode = new LeoNode(element.header,
            element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            element, // ap
            !!element.cloned, // cloned
            !!element.dirty, // dirty
            !!element.marked, // marked
            !!element.atFile, // atFile
            !!element.body && !!element.body.length,
            false, // 'u' - user defined data
            this._icons,
            "id" + this._uniqueId++
        );

        if (element.selected) {
            this._leoUI.gotSelectedNode(element);
        }

        // Build a LeoNode (a vscode tree node) from the PNode
        return w_leoNode;
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
