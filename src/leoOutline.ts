import * as vscode from 'vscode';
import { LeoOutlineNode } from './leoOutlineNode';
import { ProviderResult } from "vscode";
import { Icon } from './types';
import { LeoUI } from './leoUI';
import { Position } from './core/leoNodes';


export class LeoOutlineProvider implements vscode.TreeDataProvider<Position> {
    private _onDidChangeTreeData: vscode.EventEmitter<Position | undefined> = new vscode.EventEmitter<Position | undefined>();

    readonly onDidChangeTreeData: vscode.Event<Position | undefined> = this._onDidChangeTreeData.event;

    public treeId: number = 0; // Starting salt for tree node murmurhash generated Ids

    constructor(
        private _icons: Icon[],
        private _leoUI: LeoUI
    ) {
    }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * * Builds a unique Id from gnx and stack, plus collapsed state,
     * for vscode to distinguish the collapsed state.
     */
    public buildId(p_position: Position, p_collapsed: number): string {
        // concatenate gnx, stacks gnx's, and collapsible state number.
        // (vscode uses id for collapsible state)
        let w_stringId = this.treeId.toString() +
            p_position.v.gnx + p_position.childIndex().toString() +
            p_position.stack.map(p_stackEntry => p_stackEntry[0].gnx + p_stackEntry[1].toString()).join("");
            // p_collapsed.toString(); // Added Uniqueness:  VSCode's collapsible state linked to id

        return w_stringId;
    }

    public incTreeId(): void {
        this.treeId++;
    }

    public getTreeItem(element: Position): Thenable<LeoOutlineNode> | LeoOutlineNode {
        console.log('called getTreeItem', element.h);

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
            element.isAnyAtFileNode(), // atFile
            element.v.hasBody(),
            Object.keys(element.v.u).length ? element.v.u : false, // 'u' - user defined data
            this._icons,
            this.buildId(element, w_collapse)
        );

        if (element.__eq__(this._leoUI.leo_c.p)) {
            this._leoUI.gotSelectedNode(element);
        }

        // Build a LeoNode (a vscode tree node) from the Position
        return w_leoNode;
    }

    public getChildren(element?: Position): Position[] {
        if(element){
            console.log('called get children on', element.h);
        }else{
            console.log('called get children on root');

        }

        if (element) {
            return [...element.children()];
        } else {
            if (this._leoUI.leo_c) {

                const w_c = this._leoUI.leo_c!; // Currently Selected Document's Commander
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
        console.log('called get parent on', element.h);

        if (element) {
            const p_parent = element.parent();
            if (p_parent.v) {
                console.log('had parent');

                return p_parent;
            } else {
                console.log('was root');

                return undefined;
            }
        }
        return undefined;
    }

}


