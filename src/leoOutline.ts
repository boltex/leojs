import * as vscode from 'vscode';
import { LeoNode } from './leoNode';
import { ProviderResult } from "vscode";
import { Icon, PNode } from './types';
import * as utils from "./utils";

export class JsOutlineProvider implements vscode.TreeDataProvider<LeoNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<LeoNode | undefined> = new vscode.EventEmitter<LeoNode | undefined>();

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

    constructor(private _context: vscode.ExtensionContext) {
        this._icons = this._buildNodeIconPaths(_context);
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

    private _buildNodeIconPaths(p_context: vscode.ExtensionContext): Icon[] {
        return Array(16).fill("").map((p_val, p_index) => {
            return {
                light: p_context.asAbsolutePath("resources/light/box" + utils.padNumber2(p_index) + ".svg"),
                dark: p_context.asAbsolutePath("resources/dark/box" + utils.padNumber2(p_index) + ".svg")
            };
        });
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
