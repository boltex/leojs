import * as vscode from 'vscode';
import { Constants } from "./constants";
import { Icon } from './types';
import { LeoUI } from './leoUI';
import * as g from './core/leoGlobals';
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
            this.buildId(element, w_collapse),
            element._isRoot
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

}

export class LeoOutlineNode extends vscode.TreeItem {

    public contextValue: string; // * Context string is checked in package.json with 'when' clauses

    constructor(
        public label: string, // Node headline
        public collapsibleState: vscode.TreeItemCollapsibleState, // Computed in receiver/creator
        public position: Position, // Pointer/reference for leo's node position
        public cloned: boolean,
        public dirty: boolean,
        public marked: boolean,
        public atFile: boolean,
        public hasBody: boolean,
        public u: any,
        private _icons: Icon[], // pointer to global array of node icons
        private _id: string,
        public isRoot: boolean // For contextual menu on each node (not the global selected node flag!)
    ) {
        super(label, collapsibleState);
        this.contextValue = this._getNodeContextValue();
        this.command = {
            command: Constants.COMMANDS.SELECT_NODE,
            title: '',
            arguments: [this]
        };
    }

    // * TO HELP DEBUG
    // get description(): string {
    //     // * some smaller grayed-out text accompanying the main label
    //     const w_ap: ArchivedPosition = JSON.parse(this.ap);
    //     return "child:" + w_ap.childIndex + " lvl:" + w_ap.level + " gnx:" + w_ap.gnx;
    // }

    // get description(): string {
    //     // * some smaller grayed-out text accompanying the main label
    //     return "id:" + this.id;
    // }

    /**
     * * Sets this node properties (dirty, marked, etc.) by copying from a given node.
     * * This is needed by the outline provider when refreshing a single node.
     * @param p_node Node to copy properties from.
     * @returns Node itself with the new properties applied
     */
    public copyProperties(p_node: LeoOutlineNode): LeoOutlineNode {
        this.label = p_node.label;
        this.collapsibleState = p_node.collapsibleState;
        this.position = p_node.position;
        this.cloned = p_node.cloned;
        this.dirty = p_node.dirty;
        this.marked = p_node.marked;
        this.atFile = p_node.atFile;
        this.hasBody = p_node.hasBody;
        this.isRoot = p_node.isRoot;
        this.contextValue = this._getNodeContextValue();
        return this;
    }

    private _getNodeContextValue(): string {
        // Start it with 'leoNodeMarked' or 'leoNodeUnmarked'
        let w_contextValue = Constants.CONTEXT_FLAGS.NODE_UNMARKED;
        if (this.marked) {
            w_contextValue = Constants.CONTEXT_FLAGS.NODE_MARKED;
        }
        // then append 'leoNodeAtFile' to existing if needed
        if (this.atFile) {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_ATFILE;
        }
        // then append 'leoNodeCloned' to existing if needed
        if (this.cloned) {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_CLONED;
        }
        // and finally, check for 'root' too
        if (this.isRoot) {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_ROOT;
        } else {
            w_contextValue += Constants.CONTEXT_FLAGS.NODE_NOT_ROOT;
        }
        return w_contextValue;
    }

    // @ts-ignore
    public get iconPath(): Icon {
        // From Leo's leoNodes.py computeIcon function
        // 1=has Body, 2=marked, 4=cloned, 8=dirty
        let w_icon: number =
            (+this.dirty << 3) |
            (+this.cloned << 2) |
            (+this.marked << 1) |
            +this.hasBody;
        return this._icons[w_icon];
    }

    // Optional id for the tree item that has to be unique across tree.
    // The id is used to preserve the selection and expansion state of the tree item.
    // If not provided, an id is generated using the tree item's label.
    // Note that when labels change, ids will change and that selection and expansion state cannot be kept stable anymore.
    // @ts-ignore
    public get id(): string { return this._id; }

    // @ts-ignore
    public get description(): string {
        // * some smaller grayed-out text accompanying the main label
        if (this.u) {
            return "\u{1F4CE} (" + Object.keys(this.u).length + ")";
        } else {
            // return "id:" + this.id; // ! debug test
            // return "gnx:" + this.gnx; // ! debug test
            return ""; // Falsy will not be shown
        }
    }

    // @ts-ignore
    public get tooltip(): string {
        if (this.u) {
            //  "\ntotal keys is :" + Object.keys(this.u).length
            return this.label + "\n" +
                JSON.stringify(this.u, undefined, 2);
        } else {
            return this.label; // * Whole headline as tooltip
        }
    }

}

