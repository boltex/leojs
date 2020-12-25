import * as vscode from 'vscode';
import { LeoNode } from './leoNode';
import { ProviderResult } from "vscode";
import { Icon, PNode } from './types';
import { Leojs } from './leojs';

export class LeoOutlineProvider implements vscode.TreeDataProvider<LeoNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<LeoNode | undefined> = new vscode.EventEmitter<LeoNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoNode | undefined> = this._onDidChangeTreeData.event;

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

    public getTreeItem(element: LeoNode): Thenable<LeoNode> | LeoNode {
        return element;
    }

    public getChildren(element?: LeoNode): Thenable<LeoNode[]> {
        if (element) {
            return Promise.resolve(this._LeoNodeArray(element.ap.children));
        } else {
            return Promise.resolve(this._LeoNodeArray(this._leo.positions));
        }
    }

    public getParent(element: LeoNode): ProviderResult<LeoNode> | null {
        // Buttons are just a list, as such, entries are always child of root so return null
        return null;
    }

    private _LeoNodeArray(p_children: PNode[]): LeoNode[] {
        const w_children: LeoNode[] = [];
        if (p_children && p_children.length) {
            p_children.forEach((p_node, p_index) => {
                w_children.push(new LeoNode(p_node.header,
                    p_node.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                    p_node, // ap
                    p_index, // childIndex
                    false, // cloned
                    false, // dirty
                    false, // marked
                    false, // atFile
                    !!p_node.body && !!p_node.body.length,
                    false, // u
                    this._icons,
                    "id" + this._uniqueId++
                ));
            });
        }
        return w_children;
    }

}
