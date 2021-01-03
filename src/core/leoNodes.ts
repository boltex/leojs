// Leo's fundamental data classes.

/**
 * A class managing global node indices (gnx's).
 */
export class NodeIndices {

    defaultId: string;
    lastIndex: number;
    stack: any[]; // A stack of open commanders.
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

    /**
     * Yield all child positions of p.
     */
    public *children(copy: boolean = true): Generator<Position> {
        const p = this.firstChild();
        while (p) {
            yield (copy ? p.copy() : p);
            p.moveToNext();
        }
    }

    /*
    def anyAtFileNodeName(self): return self.v.anyAtFileNodeName()

    def atAutoNodeName(self): return self.v.atAutoNodeName()

    def atCleanNodeName(self): return self.v.atCleanNodeName()

    def atEditNodeName(self): return self.v.atEditNodeName()

    def atFileNodeName(self): return self.v.atFileNodeName()

    def atNoSentinelsFileNodeName(self): return self.v.atNoSentinelsFileNodeName()
    # def atRawFileNodeName         (self): return self.v.atRawFileNodeName()

    def atShadowFileNodeName(self): return self.v.atShadowFileNodeName()

    def atSilentFileNodeName(self): return self.v.atSilentFileNodeName()

    def atThinFileNodeName(self): return self.v.atThinFileNodeName()
    # New names, less confusing
    atNoSentFileNodeName = atNoSentinelsFileNodeName
    atAsisFileNodeName = atSilentFileNodeName

    def isAnyAtFileNode(self): return self.v.isAnyAtFileNode()

    def isAtAllNode(self): return self.v.isAtAllNode()

    def isAtAutoNode(self): return self.v.isAtAutoNode()

    def isAtAutoRstNode(self): return self.v.isAtAutoRstNode()

    def isAtCleanNode(self): return self.v.isAtCleanNode()

    def isAtEditNode(self): return self.v.isAtEditNode()

    def isAtFileNode(self): return self.v.isAtFileNode()

    def isAtIgnoreNode(self): return self.v.isAtIgnoreNode()

    def isAtNoSentinelsFileNode(self): return self.v.isAtNoSentinelsFileNode()

    def isAtOthersNode(self): return self.v.isAtOthersNode()

    def isAtRstFileNode(self): return self.v.isAtRstFileNode()

    def isAtSilentFileNode(self): return self.v.isAtSilentFileNode()

    def isAtShadowFileNode(self): return self.v.isAtShadowFileNode()

    def isAtThinFileNode(self): return self.v.isAtThinFileNode()
    # New names, less confusing:
    isAtNoSentFileNode = isAtNoSentinelsFileNode
    isAtAsisFileNode = isAtSilentFileNode
    # Utilities.

    def matchHeadline(self, pattern): return self.v.matchHeadline(pattern)
    */
    public bodyString(): string { return this.v.bodyString(); }

    public headString(): string {
        return this.v.headString();
    }

    public cleanHeadString(): string {
        return this.v.cleanHeadString();
    }

    public isDirty(): boolean { return this.v.isDirty(); }

    public isMarked(): boolean { return this.v.isMarked(); }

    public isOrphan(): boolean { return this.v.isOrphan(); }

    public isSelected(): boolean { return this.v.isSelected(); }

    public isTopBitSet(): boolean { return this.v.isTopBitSet(); }

    public isVisited(): boolean { return this.v.isVisited(); }

    public status(): number { return this.v.status(); }

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
        g.app.nodeIndices.new_vnode_helper(context, gnx, this);
    }

    public bodyString() {
        return this._bodyString;
    }

    /**
     * Returns the first child or undefined if no children
     */
    public firstChild(): VNode | undefined {
        if (this.children.length) {
            return this.children[0];
        }
        return undefined;
    }

    public hasChildren(): boolean {
        return !!this.children.length;
    }

    /**
     * Returns the last child or undefined if no children
     */
    public lastChild(): VNode | undefined {
        if (this.children.length) {
            return this.children[this.children.length - 1];
        }
        return undefined;
    }

    /**
     * childIndex and nthChild are zero-based.
     */
    public nthChild(n: number): VNode | undefined {
        if (0 <= n && n < this.children.length) {
            return this.children[n];
        }
        return undefined;
    }

    public numberOfChildren(): number {
        return this.children.length;
    }

    /**
     * (New in 4.2) Return a list of all direct parent vnodes of a VNode.
     * This is NOT the same as the list of ancestors of the VNode.
     */
    public directParents(): VNode[] {
        return this.parents;
    }

    /**
     * Return True if this VNode contains body text.
     */
    public hasBody(): boolean {
        return !!this._bodyString && this._bodyString.length > 0;
    }

    /**
     * Return the headline string.
     */
    public headString() {
        return this._headString;
    }

    /**
     * Return the headline string. Same as headString.
     */
    public cleanHeadString() {
        return this._headString;
    }

    /**
     * Return True if v is the n'th child of parent_v.
     */
    public isNthChildOf(n: number, parent_v: VNode): boolean {
        const children: VNode[] | undefined = parent_v ? parent_v.children : undefined;
        return !!children && 0 <= n && n < children.length && children[n] === this;
    }

    public isCloned(): boolean {
        return this.parents.length > 1;
    }

    public isDirty(): boolean {
        return (this.statusBits & StatusFlags.dirtyBit) !== 0;
    }

    public isMarked(): boolean {
        return (this.statusBits & StatusFlags.markedBit) !== 0;
    }

    public isOrphan(): boolean {
        return (this.statusBits & StatusFlags.orphanBit) !== 0;
    }

    public isSelected(): boolean {
        return (this.statusBits & StatusFlags.selectedBit) !== 0;
    }

    public isTopBitSet(): boolean {
        return (this.statusBits & StatusFlags.topBit) !== 0;
    }

    public isVisited(): boolean {
        return (this.statusBits & StatusFlags.visitedBit) !== 0;
    }

    public isWriteBit(): boolean {
        return (this.statusBits & StatusFlags.writeBit) !== 0;
    }

    public status(): number {
        return this.statusBits;
    }



}


