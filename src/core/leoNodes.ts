// Leo's fundamental data classes.

import * as g from './leoGlobals';
import "date-format-lite";

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

    private _get_time(): string {
        const now = new Date();
        // GNX example: felix.20210110163753.1
        // using https://www.npmjs.com/package/date-format-lite#syntax
        return now.format("YYYYMMDDhhmmss");
    }

    /**
     * Check that no vnode exists with the given gnx in fc.gnxDict.
     */
    public check_gnx(c: any, gnx: string, v: VNode): void {
        // TODO : Type 'c' as Commands class

        if (gnx === 'hidden-root-vnode-gnx') {
            // No longer an error.
            // fast.readWithElementTree always generates a nominal hidden vnode.
            return;
        }

        // TODO : Check in "gnxDict" from passed commander parameter

        // fc = c.fileCommands
        // v2 = fc.gnxDict.get(gnx)
        // if v2 and v2 != v:
        //     g.error(
        //         f"getNewIndex: gnx clash {gnx}\n"
        //         f"          v: {v}\n"
        //         f"         v2: {v2}")

    }

    /**
     * Set the timestamp string to be used by getNewIndex until further notice
     */
    public setTimeStamp(): void {
        this.timeString = this._get_time();
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

    public anyAtFileNodeName(): any {
        return this.v.anyAtFileNodeName();
    }
    public atAutoNodeName(): any {
        return this.v.atAutoNodeName();
    }
    public atCleanNodeName(): any {
        return this.v.atCleanNodeName();
    }
    public atEditNodeName(): any {
        return this.v.atEditNodeName();
    }
    public atFileNodeName(): any {
        return this.v.atFileNodeName();
    }
    public atNoSentinelsFileNodeName(): any {
        return this.v.atNoSentinelsFileNodeName();
    }
    public atShadowFileNodeName(): any {
        return this.v.atShadowFileNodeName();
    }
    public atSilentFileNodeName(): any {
        return this.v.atSilentFileNodeName();
    }
    public atThinFileNodeName(): any {
        return this.v.atThinFileNodeName();
    }
    public isAnyAtFileNode(): any {
        return this.v.isAnyAtFileNode();
    }
    public isAtAllNode(): any {
        return this.v.isAtAllNode();
    }
    public isAtAutoNode(): any {
        return this.v.isAtAutoNode();
    }
    public isAtAutoRstNode(): any {
        return this.v.isAtAutoRstNode();
    }
    public isAtCleanNode(): any {
        return this.v.isAtCleanNode();
    }
    public isAtEditNode(): any {
        return this.v.isAtEditNode();
    }
    public isAtFileNode(): any {
        return this.v.isAtFileNode();
    }
    public isAtIgnoreNode(): any {
        return this.v.isAtIgnoreNode();
    }
    public isAtNoSentinelsFileNode(): any {
        return this.v.isAtNoSentinelsFileNode();
    }
    public isAtOthersNode(): any {
        return this.v.isAtOthersNode();
    }
    public isAtRstFileNode(): any {
        return this.v.isAtRstFileNode();
    }
    public isAtSilentFileNode(): any {
        return this.v.isAtSilentFileNode();
    }
    public isAtShadowFileNode(): any {
        return this.v.isAtShadowFileNode();
    }
    public isAtThinFileNode(): any {
        return this.v.isAtThinFileNode();
    }
    public matchHeadline(pattern: string): any {
        return this.v.matchHeadline(pattern);
    }

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

    // This used to be time-critical code.
    public childIndex(): number {
        return this._childIndex;
    }

    public directParents(): any {
        return this.v.directParents();
    }

    public hasChildren(): boolean {
        return this.v.children.length > 0;
    }

    public numberOfChildren(): number {
        return this.v.children.length;
    }

    public copy(): Position {
        return new Position(this.v, this._childIndex, this.stack);
    }


}

// Aliases for Position members
export interface Position {
    back: () => any;
    firstChild: () => any;
    lastChild: () => any;
    lastNode: () => any;
    next: () => any;
    nodeAfterTree: () => any;
    nthChild: () => any;
    parent: () => any;
    threadBack: () => any;
    threadNext: () => any;
    visBack: () => any;
    visNext: () => any;
    hasVisBack: () => any;
    hasVisNext: () => any;
    hasFirstChild: () => any;
    atNoSentFileNodeName: () => any;
    atAsisFileNodeName: () => any;
    isAtNoSentFileNode: () => any;
    isAtAsisFileNode: () => any;
}

/*
Position.prototype.back = Position.prototype.getBack;
Position.prototype.firstChild = Position.prototype.getFirstChild;
Position.prototype.lastChild = Position.prototype.getLastChild;
Position.prototype.lastNode = Position.prototype.getLastNode;
// Position.prototype.lastVisible = Position.prototype.getLastVisible # New in 4.2 (was in tk tree code).;
Position.prototype.next = Position.prototype.getNext;
Position.prototype.nodeAfterTree = Position.prototype.getNodeAfterTree;
Position.prototype.nthChild = Position.prototype.getNthChild;
Position.prototype.parent = Position.prototype.getParent;
Position.prototype.threadBack = Position.prototype.getThreadBack;
Position.prototype.threadNext = Position.prototype.getThreadNext;
Position.prototype.visBack = Position.prototype.getVisBack;
Position.prototype.visNext = Position.prototype.getVisNext;
// New in Leo 4.4.3:
Position.prototype.hasVisBack = Position.prototype.visBack;
Position.prototype.hasVisNext = Position.prototype.visNext;
// from p.children & parents
Position.prototype.hasFirstChild = Position.prototype.hasChildren;
// New names, less confusing
Position.prototype.atNoSentFileNodeName = Position.prototype.atNoSentinelsFileNodeName;
Position.prototype.atAsisFileNodeName = Position.prototype.atSilentFileNodeName;

Position.prototype.isAtNoSentFileNode = Position.prototype.isAtNoSentinelsFileNode;
Position.prototype.isAtAsisFileNode = Position.prototype.isAtSilentFileNode;
*/

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

    unicode_warning_given: boolean = false;

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

    /**
     * Return the name following one of the names in nameList or "".
     */
    public findAtFileName(names: string[], h?: string): string {
        // Allow h argument for unit testing.
        if (!h) {
            h = this.headString();
        }

        if (!g.match(h, 0, '@')) {
            return "";
        }

        const i: number = g.skip_id(h, 1, '-');

        const word: string = h.substring(0, i);

        if (names.includes(word) && g.match_word(h, 0, word)) {
            const name = h.substring(i).trim();
            return name;
        }

        return "";
    }

    /**
     * Return the file name following an @file node or an empty string.
     */
    public anyAtFileNodeName(): string {
        return (
            // was g.app.atAutoNames and g.app.atFileNames.
            // this.findAtFileName(this.atAutoNames) ||
            // this.findAtFileName(this.atFileNames)

            this.findAtFileName(g.app.atAutoNames) ||
            this.findAtFileName(g.app.atFileNames)
        );
    }

    // These return the filename following @xxx, in v.headString.
    // Return the the empty string if v is not an @xxx node.

    public atAutoNodeName(h?: string) {
        // return this.findAtFileName(this.atAutoNames, h);
        return this.findAtFileName(g.app.atAutoNames, h);
    }

    // Retain this special case as part of the "escape hatch".
    // That is, we fall back on code in leoRst.py if no
    // importer or writer for reStructuredText exists.

    public atAutoRstNodeName(h?: string) {
        const names: string[] = ["@auto-rst"];
        return this.findAtFileName(names, h);
    }

    public atCleanNodeName() {
        const names: string[] = ["@clean"];
        return this.findAtFileName(names);
    }

    public atEditNodeName() {
        const names: string[] = ["@edit"];
        return this.findAtFileName(names);
    }

    public atFileNodeName() {
        const names: string[] = ["@file", "@thin"];
        // Fix #403.
        return this.findAtFileName(names);
    }

    public atNoSentinelsFileNodeName() {
        const names: string[] = ["@nosent", "@file-nosent"];
        return this.findAtFileName(names);
    }

    public atRstFileNodeName() {
        const names: string[] = ["@rst"];
        return this.findAtFileName(names);
    }

    public atShadowFileNodeName() {
        const names: string[] = ["@shadow"];
        return this.findAtFileName(names);
    }

    public atSilentFileNodeName() {
        const names: string[] = ["@asis", "@file-asis"];
        return this.findAtFileName(names);
    }

    public atThinFileNodeName() {
        const names: string[] = ["@thin", "@file-thin"];
        return this.findAtFileName(names);
    }

    /**
     * Returns True if the receiver contains @others in its body at the start of a line.
     */
    public isAtAllNode(): boolean {
        const flag: boolean = g.is_special(this._bodyString, "@all") < 0;
        return flag;
    }

    /**
     * Return True if v is any kind of @file or related node.
     */
    public isAnyAtFileNode(): boolean {
        // This routine should be as fast as possible.
        // It is called once for every VNode when writing a file.
        const h: string = this.headString();
        return !!h && h.substring(0, 1) === '@' && !!this.anyAtFileNodeName();
    }

    public isAtAutoNode(): boolean {
        return !!this.atAutoNodeName();
    }

    public isAtAutoRstNode(): boolean {
        return !!this.atAutoRstNodeName();
    }

    public isAtCleanNode(): boolean {
        return !!this.atCleanNodeName();
    }

    public isAtEditNode(): boolean {
        return !!this.atEditNodeName();
    }

    public isAtFileNode(): boolean {
        return !!this.atFileNodeName();
    }

    public isAtRstFileNode(): boolean {
        return !!this.atRstFileNodeName();
    }

    public isAtNoSentinelsFileNode(): boolean {
        return !!this.atNoSentinelsFileNodeName();
    }

    public isAtSilentFileNode(): boolean {
        // @file-asis
        return !!this.atSilentFileNodeName();
    }

    public isAtShadowFileNode(): boolean {
        return !!this.atShadowFileNodeName();
    }

    public isAtThinFileNode(): boolean {
        return !!this.atThinFileNodeName();
    }

    /**
     * Returns True if:
     * - the vnode' body contains @ignore at the start of a line or
     * - the vnode's headline starts with @ignore.
     */
    public isAtIgnoreNode(): boolean {
        if (g.match_word(this._headString, 0, '@ignore')) {
            return true;
        }
        const flag: boolean = g.is_special(this._bodyString, "@ignore") < 0;
        return flag;
    }

    /**
     * Returns True if the receiver contains @others in its body at the start of a line.
     */
    public isAtOthersNode(): boolean {
        const flag: boolean = g.is_special(this._bodyString, "@others") < 0;
        return flag;
    }

    /**
     * Returns True if the headline matches the pattern ignoring whitespace and case.
     * The headline may contain characters following the successfully matched pattern.
     */
    public matchHeadline(pattern: string): boolean {
        const v: VNode = this;
        let h: string = g.toUnicode(v.headString());
        h = h.toLowerCase().replace(' ', '').replace('\t', '');
        // equivalent to h = h.lstrip('.')
        // 2013/04/05. Allow leading period before section names.
        while (h.charAt(0) === '.') {
            h = h.substring(1);
        }
        pattern = g.toUnicode(pattern);
        pattern = pattern.toLowerCase().replace(' ', '').replace('\t', '');
        return h.startsWith(pattern);
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

    /**
     * Clear the vnode dirty bit.
     */
    public clearDirty(): void {
        this.statusBits &= ~StatusFlags.dirtyBit;
    }

    /**
     * Set the vnode dirty bit.
     * This method is fast, but dangerous. Unlike p.setDirty, this method does
     * not call v.setAllAncestorAtFileNodesDirty.
     */
    public setDirty(): void {
        this.statusBits |= StatusFlags.dirtyBit;
    }

    public clearClonedBit(): void {
        this.statusBits &= ~StatusFlags.clonedBit;
    }

    public clearMarked(): void {
        this.statusBits &= ~StatusFlags.markedBit;
    }

    public clearWriteBit(): void {
        this.statusBits &= ~StatusFlags.writeBit;
    }

    public clearOrphan(): void {
        this.statusBits &= ~StatusFlags.orphanBit;
    }

    public clearVisited(): void {
        this.statusBits &= ~StatusFlags.visitedBit;
    }

    /**
     * Contract the node.
     */
    public contract(): void {
        this.statusBits &= ~StatusFlags.expandedBit;
    }


    /**
     * Expand the node.
     */
    public expand(): void {
        this.statusBits |= StatusFlags.expandedBit;
    }


    /**
     * Init self.statusBits.
     */
    public initExpandedBit(): void {
        this.statusBits |= StatusFlags.expandedBit;
    }


    /**
     * Return True if the VNode expansion bit is set.
     */
    public isExpanded(): boolean {
        return !!(this.statusBits & StatusFlags.expandedBit);
    }

    public initStatus(status: number): void {
        this.statusBits = status;
    }

    public setClonedBit(): void {
        this.statusBits |= StatusFlags.clonedBit;
    }

    public initClonedBit(val: boolean): void {
        if (val) {
            this.statusBits |= StatusFlags.clonedBit;
        } else {
            this.statusBits &= ~StatusFlags.clonedBit;
        }
    }

    public setMarked(): void {
        this.statusBits |= StatusFlags.markedBit;
    }

    public initMarkedBit(): void {
        this.statusBits |= StatusFlags.markedBit;
    }

    /**
     * Set the vnode's orphan bit.
     */
    public setOrphan(): void {
        this.statusBits |= StatusFlags.orphanBit;
    }

    /**
     * This only sets the selected bit.
     */
    public setSelected(): void {
        this.statusBits |= StatusFlags.selectedBit;
    }

    /**
     * Compatibility routine for scripts
     */
    public setVisited(): void {
        this.statusBits |= StatusFlags.visitedBit;
    }

    public setWriteBit(): void {
        this.statusBits |= StatusFlags.writeBit;
    }

    public computeIcon(): number {
        let val: number = 0;
        const v: VNode = this;
        if (v.hasBody()) { val += 1; }
        if (v.isMarked()) { val += 2; }
        if (v.isCloned()) { val += 4; }
        if (v.isDirty()) { val += 8; }
        return val;
    }

    public setIcon(): void {
        //  pass # Compatibility routine for old scripts
    }

    /**
     * Conserve cursor and scroll positions
     * from the UI into this vnode's
     * insertSpot and scrollBarSpot
     */
    public saveCursorAndScroll(): void {
        // TODO

        /*
        const v:VNode = this;
        const c:any = v.context;

        w = c.frame.body
        if not w:
            return
        try:
            v.scrollBarSpot = w.getYScrollPosition()
            v.insertSpot = w.getInsertPoint()
        except AttributeError:
            # 2011/03/21: w may not support the high-level interface.
            pass
        */

    }

    public setBodyString(s: string): void {
        const v: VNode = this;
        if ((typeof s) === 'string') {
            v._bodyString = s;
            return;
        }
        // TODO : Check if needed
        try {
            v._bodyString = g.toUnicode(s, null, true);
        }
        catch (Exception) {
            if (!this.unicode_warning_given) {
                this.unicode_warning_given = true;
                g.error(s);
                g.es_exception();
            }
        }
        // self.contentModified()  # #1413.
        // signal_manager.emit(self.context, 'body_changed', self)
    }

    public setHeadString(s: string): void {
        // Fix bug: https://bugs.launchpad.net/leo-editor/+bug/1245535
        // API allows headlines to contain newlines.
        const v: VNode = this;
        s = g.toUnicode(s, null, true);
        v._headString = s.replace('\n', '');
        // self.contentModified()  # #1413.
    }

    public setSelection(start: number, length: number): void {
        const v: VNode = this;
        v.selectionStart = start;
        v.selectionLength = length;
    }

    /**
     * Original idea by Виталије Милошевић (Vitalije Milosevic).
     * Modified by EKR.
     * Translated by Félix
     */
    public setAllAncestorAtFileNodesDirty():void {
        const v: VNode = this;
        const hiddenRootVnode:VNode = v.context.hiddenRootNode;

        function *v_and_parents(v:VNode): Generator<VNode> {
            if (v !== hiddenRootVnode){
                yield v;
                for (let parent_v of v.parents){
                    yield* v_and_parents(parent_v);
                }
            }
        }
        
        // There is no harm in calling v2.setDirty redundantly.
        
        for (let v2 of v_and_parents(v)){
            if(v2.isAnyAtFileNode()){
                v2.setDirty();
            }
        }
    }

    def cloneAsNthChild(self, parent_v, n):
        # Does not check for illegal clones!
        v = self
        v._linkAsNthChild(parent_v, n)
        return v

    def insertAsFirstChild(self):
        v = self
        return v.insertAsNthChild(0)

    def insertAsLastChild(self):
        v = self
        return v.insertAsNthChild(len(v.children))

    def insertAsNthChild(self, n):
        v = self
        assert 0 <= n <= len(v.children)
        v2 = VNode(v.context)
        v2._linkAsNthChild(v, n)
        assert v.children[n] == v2
        return v2


}


// Aliases for VNode members
export interface VNode {
    atNoSentFileNodeName: () => any;
    atAsisFileNodeName: () => any;
    isAtNoSentFileNode: () => any;
    isAtAsisFileNode: () => any;
    initBodyString: () => any;
    initHeadString: () => any;
    setHeadText: () => any;
    setTnodeText: () => any;
}

// New names, less confusing
/*
VNode.prototype.atNoSentFileNodeName = VNode.prototype.atNoSentinelsFileNodeName;
VNode.prototype.atAsisFileNodeName = VNode.prototype.atSilentFileNodeName;
VNode.prototype.isAtNoSentFileNode = VNode.prototype.isAtNoSentinelsFileNode;
VNode.prototype.isAtAsisFileNode = VNode.prototype.isAtSilentFileNode;
VNode.prototype.initBodyString = VNode.prototype.setBodyString;
VNode.prototype.setHeadText = VNode.prototype.setHeadString;
VNode.prototype.initHeadString = VNode.prototype.setHeadString;
VNode.prototype.setTnodeText = VNode.prototype.setBodyString;
*/


