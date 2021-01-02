// * Leo's fundamental data classes.
/**
 * A class managing global node indices (gnx's).
 */
export class NodeIndices {

    defaultId: string;
    lastIndex: number;
    stack: any[]; // # A stack of open commanders.
    timeString: string; //  Set by setTimeStamp.
    userId: string;

    constructor(id_: string) {
        // Ctor for NodeIndices class.
        this.defaultId = id_;
        this.lastIndex = 0;
        this.stack = [];
        this.timeString = '';
        this.userId = id_;
        this.setTimeStamp();
    }

    public setTimeStamp(): void {
        //

    }


}

/**
 * A position marks the spot in a tree traversal. A position p consists of a VNode
 * p.v, a child index p._childIndex, and a stack of tuples (v,childIndex), one for
 * each ancestor **at the spot in tree traversal. Positions p has a unique set of
 * parents.

 * The p.moveToX methods may return a null (invalid) position p with p.v = None.
 */
export class Position {

    v: VNode;
    _childIndex: number;
    stack: { v: VNode, childIndex: number }[];

    constructor(v: VNode, childIndex: number = 0, stack?: any[]) {
        this.v = v;
        this._childIndex = childIndex;
        if (stack) {
            this.stack = stack;
        } else {
            this.stack = [];
        }
    }

    public children(copy: boolean = true): Iterator<Position> {
        return []; // TODO : return a real iterator see https://basarat.gitbook.io/typescript/future-javascript/iterators
    }

    public copy(): Position {
        return new Position(this.v, this._childIndex, this.stack);
    }


}

/**
 * PosList extends a regular array by adding helper methods
 */
export class PosList extends Array {

    /**
     * Return a PosList instance containing pointers to
     * all the immediate children of nodes in PosList self.
     */
    public children(): Position[] {
        const res: PosList = new PosList;
        this.forEach((p: Position) => {
            p.children().forEach(child_p => {
                res.push(child_p.copy());
            });
        });
        return res;
    }

    /**
     * Find all the nodes in PosList self where zero or more characters at
     * the beginning of the headline match regex
     */
    public filter_h() {
        //
    }

    /**
     * Find all the nodes in PosList self where body matches regex
     * one or more times.
     */
    public filter_b() {
        //
    }


}

enum StatusFlags {
    // Define the meaning of status bits in new vnodes.
    // Archived...
    clonedBit = 0x01,  // True: VNode has clone mark.
    // unused      0x02,
    expandedBit = 0x04,  // True: VNode is expanded.
    markedBit = 0x08,  // True: VNode is marked
    // unused    = 0x10, // (was orphanBit)
    selectedBit = 0x20,  // True: VNode is current VNode.
    topBit = 0x40,  // True: VNode was top VNode when saved.
    // Not archived...
    richTextBit = 0x080,  // Determines whether we use <bt> or <btr> tags.
    visitedBit = 0x100,
    dirtyBit = 0x200,
    writeBit = 0x400,
    orphanBit = 0x800  // True: error in @<file> tree prevented it from being written.
}

/**
 * * Closes any body pane opened in this vscode window instance
 */
export class VNode {

    // * The primary data: headline and body text.
    _headString: string;
    _bodyString: string;

    // * Structure data...
    children: VNode[]; // Ordered list of all children of this node.
    parents: VNode[]; // Unordered list of all parents of this node.

    // * Other essential data...
    fileIndex: string; // The immutable fileIndex (gnx) for this node. Set below.
    iconVal: number; // The present value of the node's icon.
    statusBits: number; // status bits

    // * Information that is never written to any file...
    // The context containing context.hiddenRootNode.
    // Required so we can compute top-level siblings.
    // It is named .context rather than .c to emphasize its limited usage.
    context: any;
    expandedPositions: Position[]; // Positions that should be expanded.

    // * Cursor location, text selection and scrolling information
    insertSpot: number; // Location of previous insert point.
    scrollBarSpot: number; // Previous value of scrollbar position.
    selectionLength: number; // The length of the selected body text.
    selectionStart: number; // The start of the selected body text.

    constructor(context: any, gnx?: string) {
        this._headString = 'newHeadline';
        this._bodyString = '';
        this.children = [];
        this.parents = [];
        this.fileIndex = '';
        this.iconVal = 0;
        this.statusBits = 0;
        this.context = context;
        this.expandedPositions = [];
        this.insertSpot = 0;
        this.scrollBarSpot = 0;
        this.selectionLength = 0;
        this.selectionStart = 0;
    }


}

