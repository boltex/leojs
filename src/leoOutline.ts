import * as vscode from 'vscode';
import { LeoOutlineNode } from './leoOutlineNode';
import { ProviderResult } from "vscode";
import { Icon } from './types';
import { LeoUI } from './leoUI';
import * as g from './core/leoGlobals';
import { Position } from './core/leoNodes';


export class LeoOutlineProvider implements vscode.TreeDataProvider<Position> {
    private _onDidChangeTreeData: vscode.EventEmitter<Position | undefined> = new vscode.EventEmitter<Position | undefined>();

    readonly onDidChangeTreeData: vscode.Event<Position | undefined> = this._onDidChangeTreeData.event;

    private _uniqueId: number = 0;

    constructor(
        private _icons: Icon[],
        private _leoUI: LeoUI
        // private _leo: Leojs
    ) {
    }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: Position): Thenable<LeoOutlineNode> | LeoOutlineNode {
        let w_collapse: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;
        if (element.hasChildren()) {
            w_collapse = element.isExpanded() ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
        }
        const w_leoNode = new LeoOutlineNode(
            element.h,
            w_collapse, // element.hasChildren() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            element, // ap
            element.isCloned(), // cloned
            element.isDirty(), // dirty
            element.isMarked(), // marked
            element.isAtFileNode(), // atFile
            element.v.hasBody(),
            Object.keys(element.v.u).length ? element.v.u : false, // 'u' - user defined data
            this._icons,
            "id" + this._uniqueId++
        );

        if (element.isSelected()) {
            this._leoUI.gotSelectedNode(element);
        }

        if (element.isAtFileNode()) {
            console.log('IS AT FILE', element.h);

        }
        // Build a LeoNode (a vscode tree node) from the Position
        return w_leoNode;
    }

    public getChildren(element?: Position): Position[] {
        if (element) {
            return [...element.children()];
        } else {
            if (g.app.leo_c) {

                const w_c = g.app.leo_c!; // Currently Selected Document's Commander
                if (w_c.hoistStack.length) {
                    // topmost hoisted starts the outline as single root 'child'
                    return [w_c.hoistStack[w_c.hoistStack.length - 1].p];
                } else {
                    // true list of root nodes
                    return [...w_c.all_Root_Children()];
                }
            } else {
                console.error('Commander not found in commanderList');
                return [];
            }
        }
    }

    public getParent(element: Position): ProviderResult<Position> {
        if (element) {
            return element.parent();
        }
        return undefined;
    }

}


