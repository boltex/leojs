import * as vscode from 'vscode';
import { Constants } from "./constants";
import { Icon } from './types';
import { LeoUI } from './leoUI';
import * as g from './core/leoGlobals';
import { Position } from './core/leoNodes';

export class LeoOutlineProvider implements vscode.TreeDataProvider<Position> {
    private _onDidChangeTreeData: vscode.EventEmitter<Position | undefined> = new vscode.EventEmitter<Position | undefined>();

    readonly onDidChangeTreeData: vscode.Event<Position | undefined> = this._onDidChangeTreeData.event;

    public treeId: number = 0; // Starting salt for generated tree node Ids

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
        // NOT NEEDED -> p_collapsed.toString(); // Added Uniqueness: VSCode's collapsible state in id
        return w_stringId;
    }

    /**
     * * Force uniqueness of ids generated for nodes in the  next tree refresh
     */
    public incTreeId(): void {
        this.treeId++;
    }

    public getTreeItem(element: Position): Thenable<LeoOutlineNode> | LeoOutlineNode {

        let w_collapse: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;
        if (element.hasChildren()) {
            w_collapse = element.isExpanded() ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
        }
        let w_contextValue = Constants.CONTEXT_FLAGS.NODE_UNMARKED;
        if (element.isMarked()) {
            w_contextValue = Constants.CONTEXT_FLAGS.NODE_MARKED;
        }
        // then append 'leoNodeAtFile' to existing if needed
        if (element.isAnyAtFileNode()) {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_ATFILE;
        }
        // then append 'leoNodeCloned' to existing if needed
        if (element.isCloned()) {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_CLONED;
        }
        // and finally, check for 'root' too
        if (element._isRoot) {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_ROOT;
        } else {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_NOT_ROOT;
        }
        const w_icon: number =
            (+element.isDirty() << 3) |
            (+element.isCloned() << 2) |
            (+element.isMarked() << 1) |
            +element.v.hasBody();
        const w_u = Object.keys(element.v.u).length ? element.v.u : false;

        const w_leoNode = new LeoOutlineNode(
            element.h,
            w_collapse,
            element, // Position
            w_u ? "\u{1F4CE} (" + Object.keys(w_u).length + ")" : "",
            this._icons[w_icon],
            this.buildId(element, w_collapse),
            w_contextValue
        );
        // Check if its the selected node and call signal it to the UI
        if (element.__eq__(g.app.windowList[this._leoUI.frameIndex].c.p)) {
            this._leoUI.gotSelectedNode(element);
        }
        // Build a LeoNode (a vscode tree node) from the Position
        return w_leoNode;
    }

    public getChildren(element?: Position): Position[] {
        if (element) {
            return [...element.children()];
        } else {
            if (g.app.windowList[this._leoUI.frameIndex]) {
                // Currently Selected Document's Commander
                const w_c = g.app.windowList[this._leoUI.frameIndex].c;
                if (w_c.hoistStack.length) {
                    // HOISTED: Topmost hoisted node starts the outline as single root 'child'
                    const w_rootPosition = w_c.hoistStack[w_c.hoistStack.length - 1].p;
                    w_rootPosition._isRoot = true;
                    return [w_rootPosition];
                } else {
                    // NOT HOISTED: Normal list of root nodes
                    const w_rootNodes = [...w_c.all_Root_Children()];
                    if (w_rootNodes.length === 1) {
                        // Exactly one: prevent hoisting on SINGLE top node
                        w_rootNodes[0]._isRoot = true;
                    }
                    return w_rootNodes;
                }
            } else {
                return []; // Attempted to access unexistant frame
            }
        }
    }

    public getParent(element: Position): vscode.ProviderResult<Position> {
        if (element) {
            const p_parent = element.parent();
            if (p_parent.v) {
                return p_parent;
            } else {
                return undefined;
            }
        }
        return undefined;
    }

    public resolveTreeItem(item: LeoOutlineNode, element: Position, token: vscode.CancellationToken): vscode.ProviderResult<LeoOutlineNode> {
        if (Object.keys(element.v.u).length) {
            item.tooltip = item.label + "\n" +
                JSON.stringify(element.v.u, undefined, 2); // user attributes as JSON text tooltip
        } else {
            item.tooltip = item.label; // * Whole headline as tooltip
        }
        return item;
    }

}

export class LeoOutlineNode extends vscode.TreeItem {

    constructor(
        public label: string, // Node headline
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public position: Position, // Pointer/reference for leo's node position
        public description: string,
        public iconPath: Icon,
        public id: string,
        public contextValue: string // For contextual menu on each node (not the global 'selected node' flag!)
    ) {
        super(label, collapsibleState);
        this.command = {
            command: Constants.COMMANDS.SELECT_NODE,
            title: '',
            // using 'this' as LeoOutlineNode instead of position, to match 'openToTheSide' paramter
            arguments: [this]
        };
    }

}

