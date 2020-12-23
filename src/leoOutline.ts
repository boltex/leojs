import * as vscode from 'vscode';
import { LeoNode } from './leoNode';
import { ProviderResult } from "vscode";
import { Icon, PNode } from './types';

export class LeoOutlineProvider implements vscode.TreeDataProvider<LeoNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<LeoNode | undefined> = new vscode.EventEmitter<LeoNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoNode | undefined> = this._onDidChangeTreeData.event;

    private _icons: Icon[];

    private _model: PNode[] = [
        {
            header: "node1",
            body: "node1 body",
            children: [
                {
                    header: "nodeInside1",
                    body: "nodeInside1 body",
                    children: []
                }, {
                    header: "nodeInside2",
                    body: "nodeInside2 body",
                    children: []
                },
            ]
        },
        {
            header: "node2",
            body: "", // Empty body should display icon without blue square
            children: []
        },

        {
            header: "node3",
            body: "node3 body",
            children: []
        },
    ];

    private _uniqueId: number = 0;

    constructor(p_icons: Icon[]) {
        this._icons = p_icons;
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
            return Promise.resolve(this._LeoNodeArray(this._model));
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
