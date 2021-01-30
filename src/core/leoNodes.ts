// Leo's fundamental data classes.

import * as g from './leoGlobals';
import "date-format-lite";
import { Commander } from './leoCommander';


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
    public check_gnx(c: Commander, gnx: string, v: VNode): void {
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
 *
 * The p.moveToX methods may return a null (invalid) position p with p.v = None.
 * 
 * No operator overload in js/ts, so "strict-comparisons" is set in tslint.json
 * to force usage of special methods to compare & evaluate equalities.
 *
 */
export interface StackEntry { v: VNode; childIndex: number; }

export class Position {

    v: VNode;
    _childIndex: number;
    stack: StackEntry[];

    /**
     * Create a new position with the given childIndex and parent stack.
     */
    constructor(v: VNode, childIndex: number = 0, stack?: any[]) {
        this._childIndex = childIndex;
        this.v = v;
        if (stack) {
            this.stack = [...stack]; // Creating a copy here is safest and best.
        } else {
            this.stack = []; 
        }
    }

    /** 
     * Return True if two positions are equivalent.
     */ 
    public __eq__(p2:Position):boolean {
        const p1:Position = this;
        // Don't use g.trace: it might call p.__eq__ or p.__ne__.
        if (!(p2 instanceof Position)){
            return false;
        }
        if (!p2 || !p2.v){
            return !p1.v;
        }
        // Modified by Félix to prevent object direct comparison (p1.v === p2.v)
        return !!(p1.v && p2.v &&
                p1.v.fileIndex === p2.v.fileIndex && 
                p1._childIndex === p2._childIndex &&
                p1.stack.length === p2.stack.length && 
                p1.stack.every(
                    (p_value, p_index) => {
                        return p_value.childIndex === p2.stack[p_index].childIndex &&
                        p_value.v.fileIndex === p2.stack[p_index].v.fileIndex;
                    }
                )
            );
    }

    /** 
     * Return True if two postions are not equivalent.
     */ 
    public __ne__(p2:Position):boolean{
        return !this.__eq__(p2);
    }

    public __ge__( other:Position):boolean {
        return this.__eq__(other) || this.__gt__(other);
    }


    public __le__( other:Position):boolean{
        return this.__eq__(other) || this.__lt__(other);
    }


    public __lt__( other:Position):boolean{
        return !this.__eq__(other) && !this.__gt__(other);
    }

    /**
     * Return True if self appears after other in outline order.
     */
    public __gt__(other:Position):boolean{
        const stack1:StackEntry[] = this.stack;
        const stack2:StackEntry[] = other.stack;
        const n1:number = stack1.length; 
        const n2:number = stack2.length; 
        const n:number = n1<n2?n1:n2;
        // Compare the common part of the stacks.
        for (let nx=0; nx<n; nx++){
            if(stack1[nx].childIndex>stack2[nx].childIndex){
                return true;
            }
            if(stack1[nx].childIndex>stack2[nx].childIndex){
                return false;
            }
        }
        let x1:number;
        let x2:number;
        // Finish the comparison.
        if (n1 === n2){
            x1 = this._childIndex;
            x2 = other._childIndex;
            return x1 > x2;
        }
        if (n1 < n2){
            x1 = this._childIndex; 
            x2 = other.stack[n].childIndex;
            return x1 > x2;
        }
        // n1 > n2
        // 2011/07/28: Bug fix suggested by SegundoBob.
        x1 = other._childIndex; 
        x2 = this.stack[n].childIndex;
        return x2 >= x1;
    }

    /**
     * Return True if a position is valid.
     *  
     * The tests 'if p' or 'if not p' are the _only_ correct ways to test
     * whether a position p is valid.
     *  
     * Tests like 'if p is None' or 'if p is not None' will not work properly.
     */
    public __bool__():boolean {
        return !!this.v;
    }

    public __str__():string{
        const p:Position = this;
        if (p.v){
            return (
                "<pos " +
                `childIndex: ${p._childIndex} ` +
                `lvl: ${p.level()} ` +
                `key: ${p.key()} ` +
                `${p.h}` +
                ">"
            );
        }
        return `<pos [${p.stack.length}] None>`;
    }

    /**
     * Return a representation of a position suitable for use in .leo files.
     */
    public archivedPosition(root_p?:Position):number[]{
        const p:Position = this;
        const aList:number[] = [];
        if (!root_p){
            for (let z of p.self_and_parents()){
               aList.push(z._childIndex); 
            }
        }else{
            for (let z of p.self_and_parents(false)){
               aList.push(z._childIndex); 
              if (z.__eq__(root_p)){
                    aList.push(0); 
                    break;
                }else{
                    aList.push(z._childIndex);
                }
            }
        }
        aList.reverse();
        return aList;
    }

    public dumpLink(link:string):string {
        return link?link:"<none>";
    }

    public dump(label?=""):void {
        const p:Position = this;
        if (p.v){
            p.v.dump();  // Don't print a label
        }
    }

    public key():string {
        const p:Position = this;
        // For unified nodes we must include a complete key,
        // so we can distinguish between clones.
        const result:string[] = [];
        for (let z of p.stack){
            const v:VNode = z.v;
            const childIndex: number = z.childIndex;
            result.push(`${v.fileIndex}:${childIndex}`);
        }
        result.push(`${p.v.fileIndex}:${p._childIndex}`);
        return result.join('.');
    }

    public sort_key(p:Position):number[]{
        const result :number[] = [];
        for(let s of p.key().split('.')) {
          result.push(Number(s.split(':')[1]));
        
        }
        return result;
    }

    /*
     Positions should *not* be hashable.

     From https://docs.python.org/3/reference/datamodel.html#object.__hash__

     If a class defines mutable objects and implements an __eq__() method, it
     should not implement __hash__(), since the implementation of hashable
     collections requires that a key’s hash value is immutable (if the object’s
     hash value changes, it will be in the wrong hash bucket).
    */

    // __hash__ = None

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

    /*
       These methods are only for the use of low-level code
       in leoNodes.py, leoFileCommands.py and leoUndo.py.
    */

    /**
     * Adjust position p before unlinking p2.
     */
    public _adjustPositionBeforeUnlink(p2:Position): void {
        // p will change if p2 is a previous sibling of p or
        // p2 is a previous sibling of any ancestor of p.
        const p:Position = this;
        const sib:Position = p.copy();
        // A special case for previous siblings.
        // Adjust p._childIndex, not the stack's childIndex.
        while(sib.hasBack()){
            sib.moveToBack();
            if (sib.__eq__(p2)){
                p._childIndex -= 1;
                return;
            }
        }

        // Adjust p's stack.
        const stack:StackEntry[] = []; 
        let changed:boolean = false;
        let i:number = 0;
        while (i < p.stack.length){
            const v = p.stack[i].v;
            const childIndex = p.stack[i].childIndex;
            const p3 = new Position(v, childIndex, stack.slice(0,i)); // stack[:i]
            while (p3.__bool__()){
                if (p2.__eq__(p3)){
                    // 2011/02/25: compare full positions, not just vnodes.
                    // A match with the to-be-moved node.
                    stack.push({v:v, childIndex:childIndex - 1});
                    changed = true;
                    break;  // terminate only the inner loop.
                }
                p3.moveToBack();
                if(!p3.__bool__()){
                    stack.push({v:v, childIndex:childIndex});
                }
            }
            i += 1;
        }
        if (changed){
            p.stack = stack;
        }
    }

    /**
     * Link self after p_after.
     */
    public _linkAfter(p_after:Position): void {
        const p:Position = this;
        const parent_v = p_after._parentVnode();
        p.stack = [...p_after.stack];
        p._childIndex = p_after._childIndex + 1;
        const child:VNode = p.v;
        const n:number = p_after._childIndex + 1;
        child._addLink(n, parent_v);
    }

    /**
     * Link self, a newly copied tree, after p_after.
     */
    public _linkCopiedAfter(p_after:Position): void {
        const p:Position = this;
        const parent_v:VNode = p_after._parentVnode();
        p.stack = [...p_after.stack];
        p._childIndex = p_after._childIndex + 1;
        const child:VNode = p.v;
        const n:number = p_after._childIndex + 1;
        child._addCopiedLink(n, parent_v);
    }

    /**
     * Link self as the n'th child of the parent.
     */
    public _linkAsNthChild(parent, n): void {
        const p:Position = this;
        const parent_v:VNode = parent.v;
        p.stack = parent.stack[:];
        p.stack.append((parent_v, parent._childIndex),);
        p._childIndex = n;
        const child:VNode = p.v;
        child._addLink(n, parent_v);
    }

    /**
     * Link a copied self as the n'th child of the parent.
     */
    public _linkCopiedAsNthChild(parent:Position, n:number): void {
        const p:Position = this;
        const parent_v:VNode = parent.v;
        p.stack = [...parent.stack];
        p.stack.push({v:parent_v, childIndex: parent._childIndex});
        p._childIndex = n;
        const child:VNode = p.v;
        child._addCopiedLink(n, parent_v);
    }

    /**
     * Link self as the root node.
     */
    public _linkAsRoot(): Position {
        const p:Position = this; 
        console.assert(p.v);
        const parent_v:VNode = p.v.context.hiddenRootNode;
        console.assert(parent_v, g.callers());
        
        // Make p the root position.
        p.stack = [];
        p._childIndex = 0;
        
        // Make p.v the first child of parent_v.
        p.v._addLink(0, parent_v);
        return p;
    }

    /**
     * Return the parent VNode.
     * Return the hiddenRootNode if there is no other parent.
     */
    public _parentVnode(): VNode | undefined {
        const p:Position = this; 
        if (p.v){
            const data = !!p.stack.length && p.stack[p.stack.length-1];
            if (data){
                const v:VNode = data.v;
                return v;
            }
            return p.v.context.hiddenRootNode;
        }
        return undefined;
    }

    /**
     * A low-level method to replace p.v by a p2.v.
     */
    public _relinkAsCloneOf(p2:Position): void {
        p = self
        v = p.v
        v2 = p2.v
        parent_v = p._parentVnode()
        if not parent_v:
            g.error('no parent_v', p)
            return
        if parent_v.children[p._childIndex] == v:
            parent_v.children[p._childIndex] = v2
            v2.parents.append(parent_v)
            // p.v no longer truly exists.
            // p.v = p2.v
        else:
            g.error(
                'parent_v.children[childIndex] != v',
                p, parent_v.children, p._childIndex, v)
    }

    /**
     * Unlink the receiver p from the tree.
     */
    public _unlink(self): void {
        p = self;
        n = p._childIndex;
        parent_v = p._parentVnode()
            // returns None if p.v is None
        child = p.v
        assert(p.v)
        assert(parent_v)
        // Delete the child.
        if (0 <= n < len(parent_v.children) and
            parent_v.children[n] == child
        ):
            // This is the only call to v._cutlink.
            child._cutLink(n, parent_v)
        else:
            self.badUnlink(parent_v, n, child)
    }

    /**
     * badUnlink error trace output
     */
    public badUnlink(self, parent_v, n, child): void {

        if 0 <= n < len(parent_v.children):
            g.trace(f"**can not happen: children[{n}] != p.v")
            g.trace('parent_v.children...\n',
                g.listToString(parent_v.children))
            g.trace('parent_v', parent_v)
            g.trace('parent_v.children[n]', parent_v.children[n])
            g.trace('child', child)
            g.trace('** callers:', g.callers())
        else:
            g.trace(
                f"**can not happen: bad child index: {n}, "
                f"len(children): {len(parent_v.children)}")
            g.trace('parent_v.children...\n',
                g.listToString(parent_v.children))
            g.trace('parent_v', parent_v, 'child', child)
            g.trace('** callers:', g.callers())
    }

    /* These routines change self to a new position "in place".
    That is, these methods must _never_ call p.copy().

    When moving to a nonexistent position, these routines simply set p.v = None,
    leaving the p.stack unchanged. This allows the caller to "undo" the effect of
    the invalid move by simply restoring the previous value of p.v.

    These routines all return self on exit so the following kind of code will work:
        after = p.copy().moveToNodeAfterTree()
    */

    /**
     * Move self to its previous sibling.
     */
    public moveToBack():Position {
        const p:Position = this;
        const n:number = p._childIndex;
        const parent_v:VNode = p._parentVnode(); // Returns None if p.v is None.
            
        // Do not assume n is in range: this is used by positionExists.
        if (
            parent_v && 
            p.v &&
            0 < n &&
            n <= parent_v.children.length
        ){
            p._childIndex -= 1;
            p.v = parent_v.children[n - 1];
        }else{
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to it's first child's position.
     */
    public moveToFirstChild():Position{
        const p:Position = this;
        if (p.v && p.v.children){
            p.stack.push(
             {v:p.v, childIndex:p._childIndex }
            );
            p.v = p.v.children[0];
            p._childIndex = 0;
        }else{
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to it's last child's position.
     */
    public moveToLastChild():Position{
        const p:Position = this;
        if p.v and p.v.children:
            p.stack.append((p.v, p._childIndex),)
            n = len(p.v.children)
            p.v = p.v.children[n - 1]
            p._childIndex = n - 1
        else:
            p.v = None
        return p;
    }

    /**
     * Move a position to last node of its tree.
     *  N.B. Returns p if p has no children.
     */
    public moveToLastNode():Position{
        const p:Position = this;
        // Huge improvement for 4.2.
        while p.hasChildren():
            p.moveToLastChild()
        return p;
    }

    /**
     * Move a position to its next sibling.
     */
    public moveToNext():Position{
        const p:Position = this;    
        const n:number = p._childIndex;
        const parent_v:VNode = p._parentVnode();
            // Returns None if p.v is None.
        if (!p.v){
            g.trace('no p.v:', p, g.callers());
        }
        if (p.v && parent_v && parent_v.children.length > (n + 1)){
            p._childIndex = n + 1;
            p.v = parent_v.children[n + 1];
        }else{
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to the node after the position's tree.
     */
    public moveToNodeAfterTree():Position {
        const p:Position = this;
        while p:
            if p.hasNext():
                p.moveToNext()
                break
            p.moveToParent()
        return p;
    }

    /**
     * Move to Nth child
     */
    public moveToNthChild(n:number):Position {
        const p:Position = this;
        if p.v and len(p.v.children) > n:
            p.stack.append((p.v, p._childIndex),)
            p.v = p.v.children[n]
            p._childIndex = n
        else:
            p.v = None
        return p;
    }

    /**
     * Move a position to its parent position.
     */
    public moveToParent():Position {
        const p:Position = this;
        if p.v and p.stack:
            p.v, p._childIndex = p.stack.pop()
        else:
            p.v = None
        return p
    }

    /**
     * Move a position to it's threadBack position.
     */
    public moveToThreadBack(): Position {
        const p:Position = this;
        if p.hasBack():
            p.moveToBack()
            p.moveToLastNode()
        else:
            p.moveToParent()
        return p;
    }

    /**
     * Move a position to threadNext position.
     */
    public moveToThreadNext(): Position {
        const p:Position = this;
        if p.v:
            if p.v.children:
                p.moveToFirstChild()
            elif p.hasNext():
                p.moveToNext()
            else:
                p.moveToParent()
                while p:
                    if p.hasNext():
                        p.moveToNext()
                        break  #found
                    p.moveToParent()
                # not found.
        return p
    }

    /**
     * Move a position to the position of the previous visible node.
     */
    public moveToVisBack(c:Commander): Position {
        const p:Position = this;
        limit, limitIsVisible = c.visLimit()
        while p:
            # Short-circuit if possible.
            back = p.back()
            if back and back.hasChildren() and back.isExpanded():
                p.moveToThreadBack()
            elif back:
                p.moveToBack()
            else:
                p.moveToParent()  # Same as p.moveToThreadBack()
            if p:
                if limit:
                    done, val = self.checkVisBackLimit(limit, limitIsVisible, p)
                    if done:
                        return val  # A position or None
                if p.isVisible(c):
                    return p
        return p;
    }

    /**
     * Return done, p or None
     */
    public checkVisBackLimit(limit:Position, limitIsVisible:boolean, p:Position): {done: boolean; p:Position|undefined;} {
        c = p.v.context;
        if (limit === p){
            if (limitIsVisible && p.isVisible(c)){
                return {done:true, p:p};
            }
            return {done:true, p:undefined};
        }
        if (limit.isAncestorOf(p)){
            return  {done:false, p:undefined};
        }
        return  {done:true, p:undefined};
    }

    /**
     * Move a position to the position of the next visible node.
     */
    public moveToVisNext(c:Commander):Position {
        const p:Position = this;
        limit, limitIsVisible = c.visLimit()
        while p:
            if p.hasChildren():
                if p.isExpanded():
                    p.moveToFirstChild()
                else:
                    p.moveToNodeAfterTree()
            elif p.hasNext():
                p.moveToNext()
            else:
                p.moveToThreadNext()
            if p:
                if limit and self.checkVisNextLimit(limit, p):
                    return None
                if p.isVisible(c):
                    return p
        return p;
    }

    /**
     * Return True is p is outside limit of visible nodes.
     */
    public checkVisNextLimit(limit:Position , p:Position):boolean {
        return limit != p and not limit.isAncestorOf(p);
    }

    /**
     * Move a position to threadNext position.
     * Issue an error if any vnode is an ancestor of itself.
     */
    public safeMoveToThreadNext(): Position {
        const p:Position = this;
        if p.v:
            child_v = p.v.children and p.v.children[0]
            if child_v:
                for parent in p.self_and_parents(copy=False):
                    if child_v == parent.v:
                        g.error(f"vnode: {child_v} is its own parent")
                        # Allocating a new vnode would be difficult.
                        # Just remove child_v from parent.v.children.
                        parent.v.children = [
                            v2 for v2 in parent.v.children if not v2 == child_v]
                        if parent.v in child_v.parents:
                            child_v.parents.remove(parent.v)
                        # Try not to hang.
                        p.moveToParent()
                        break
                    elif child_v.fileIndex == parent.v.fileIndex:
                        g.error(
                            f"duplicate gnx: {child_v.fileIndex!r} "
                            f"v: {child_v} parent: {parent.v}")
                        child_v.fileIndex = gNodeIndices.getNewIndex(v=child_v)
                        assert child_v.gnx != parent.v.gnx
                        # Should be ok to continue.
                        p.moveToFirstChild()
                        break
                else:
                    p.moveToFirstChild()
            elif p.hasNext():
                p.moveToNext()
            else:
                p.moveToParent()
                while p:
                    if p.hasNext():
                        p.moveToNext()
                        break  # found
                    p.moveToParent()
                # not found.
        return p;
    }

    /**
     * Create a clone of back.
     * Returns the newly created position.
     */
    public clone(): Position {
        const p:Position = this;
        p2 = p.copy()  # Do *not* copy the VNode!
        p2._linkAfter(p)  # This should "just work"
        return p2
    }

    public copy(): Position {
        return new Position(this.v, this._childIndex, this.stack);
    }

    /**
     * Delete all children of the receiver and set p.dirty().
     */
    public deleteAllChildren(): void {
        const p:Position = this;
        p.setDirty();  // Mark @file nodes dirty!
        while (p.hasChildren()){
            p.firstChild().doDelete();
        }
    }

    /** 
     * Deletes position p from the outline.
     *    
     * This is the main delete routine.
     * It deletes the receiver's entire tree from the screen.
     * Because of the undo command we never actually delete vnodes.
     */
    public doDelete(newNode?:Position): void {
        p = self
        p.setDirty(); // Mark @file nodes dirty!
        sib = p.copy();
        while sib.hasNext():
            sib.moveToNext();
            if sib == newNode:
                // Adjust newNode._childIndex if newNode is a following sibling of p.
                newNode._childIndex -= 1
                break;
        p._unlink();
    }

    /**
     * Inserts a new position after self.
     * Returns the newly created position.
     */
    public insertAfter(): Position {
        p = self;
        context = p.v.context;
        p2 = self.copy();
        p2.v = new VNode(context);
        p2.v.iconVal = 0;
        p2._linkAfter(p);
        return p2;
    }

    /**
     * Inserts a new VNode as the last child of self.
     * Returns the newly created position.
     */
    public insertAsLastChild():Position {
        p = self
        n = p.numberOfChildren()
        return p.insertAsNthChild(n)
    }

    /**
    Inserts a new node as the the nth child of self.
        self must have at least n-1 children.

        Returns the newly created position.
     */
    public  insertAsNthChild(n): Position {
        p = self; context = p.v.context
        p2 = self.copy()
        p2.v = VNode(context=context)
        p2.v.iconVal = 0
        p2._linkAsNthChild(p, n)
        return p2;
    }



    /**
    Inserts a new position before self.

        Returns the newly created position.

     */
    public insertBefore(): Position {
        p = self
        parent = p.parent()
        if p.hasBack():
            back = p.getBack()
            p = back.insertAfter()
        elif parent:
            p = parent.insertAsNthChild(0)
        else:
            p = p.insertAfter()
            p.moveToRoot()
        return p
    }

    public  invalidOutline(message): void {
        p = self
        if p.hasParent():
            node = p.parent()
        else:
            node = p
        p.v.context.alert(f"invalid outline: {message}\n{node}")
    }

    /**
     * Move a position after position a.
     */ 
    public moveAfter( a): Position {
        p = self  # Do NOT copy the position!
        a._adjustPositionBeforeUnlink(p)
        p._unlink()
        p._linkAfter(a)
        return p
    }

    /**
     * Move a position to the first child of parent.
     */
    public  moveToFirstChildOf(parent): Position {
        p = self  # Do NOT copy the position!
        return p.moveToNthChildOf(parent, 0);  // Major bug fix: 2011/12/04
    }

    /**
     * Move a position to the last child of parent.
     */
    public moveToLastChildOf(parent): Position{
        p = self  # Do NOT copy the position!
        n = parent.numberOfChildren()
        if p.parent() == parent:
            n -= 1  # 2011/12/10: Another bug fix.
        return p.moveToNthChildOf(parent, n);  // Major bug fix: 2011/12/04
    }

    /**
     * 
     */
    public  moveToNthChildOf(self, parent, n):
        """Move a position to the nth child of parent."""
        p = self  # Do NOT copy the position!
        parent._adjustPositionBeforeUnlink(p)
        p._unlink()
        p._linkAsNthChild(parent, n)
        return p
    /**
     * 
     */
    public moveToRoot(self):
        """Move self to the root position."""
        p = self  # Do NOT copy the position!
        #
        # #1631. The old root can not possibly be affected by unlinking p.
        p._unlink()
        p._linkAsRoot()
        return p
    /**
     * 
     */
    public promote(self):
        """A low-level promote helper."""
        p = self  # Do NOT copy the position.
        parent_v = p._parentVnode()
        children = p.v.children
        # Add the children to parent_v's children.
        n = p.childIndex() + 1
        z = parent_v.children[:]
        parent_v.children = z[:n]
        parent_v.children.extend(children)
        parent_v.children.extend(z[n:])
        # Remove v's children.
        p.v.children = []
        # Adjust the parent links in the moved children.
        # There is no need to adjust descendant links.
        for child in children:
            child.parents.remove(p.v)
            child.parents.append(parent_v)
    /**
     *  This routine checks the structure of the receiver's tree.
     */
    public validateOutlineWithParent(self, pv):
        p = self
        result = True  # optimists get only unpleasant surprises.
        parent = p.getParent()
        childIndex = p._childIndex
        if parent != pv:
            p.invalidOutline("Invalid parent link: " + repr(parent))
        if pv:
            if childIndex < 0:
                p.invalidOutline("missing childIndex" + childIndex)
            elif childIndex >= pv.numberOfChildren():
                p.invalidOutline("missing children entry for index: " + childIndex)
        elif childIndex < 0:
            p.invalidOutline("negative childIndex" + childIndex)
        if not p.v and pv:
            self.invalidOutline("Empty t")
        # Recursively validate all the children.
        for child in p.children():
            r = child.validateOutlineWithParent(p)
            if not r: result = False
        return result

}

// Aliases for Position members
export interface Position {
    back: () => Position;
    firstChild: () => Position;
    lastChild: () => Position;
    lastNode: () => Position;
    next: () => Position;
    nodeAfterTree: () => Position;
    nthChild: () => Position;
    parent: () => Position;
    threadBack: () => Position;
    threadNext: () => Position;
    visBack: () => Position;
    visNext: () => Position;
    hasVisBack: () => Position;
    hasVisNext: () => Position;
    hasFirstChild: () => boolean;
    atNoSentFileNodeName: () => string;
    atAsisFileNodeName: () => string;
    isAtNoSentFileNode: () => boolean;
    isAtAsisFileNode: () => boolean;
    __repr__: () => string;
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
Position.prototype.__repr__ = Position.prototype.__str__;
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

    private unknownAttributes: undefined | {[key:string]:any};
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
    public setAllAncestorAtFileNodesDirty(): void {
        const v: VNode = this;
        const hiddenRootVnode: VNode = v.context.hiddenRootNode;

        function* v_and_parents(v: VNode): Generator<VNode> {
            if (v !== hiddenRootVnode) {
                yield v;
                for (let parent_v of v.parents) {
                    yield* v_and_parents(parent_v);
                }
            }
        }

        // There is no harm in calling v2.setDirty redundantly.

        for (let v2 of v_and_parents(v)) {
            if (v2.isAnyAtFileNode()) {
                v2.setDirty();
            }
        }
    }

    /**
     * Does not check for illegal clones!
     */
    public cloneAsNthChild(parent_v: VNode, n: number): VNode {
        const v: VNode = this;
        v._linkAsNthChild(parent_v, n);
        return v;
    }

    public insertAsFirstChild(): VNode {
        const v: VNode = this;
        return v.insertAsNthChild(0);
    }

    public insertAsLastChild(): VNode {
        const v: VNode = this;
        return v.insertAsNthChild(v.children.length);
    }

    public insertAsNthChild(n: number): VNode {
        const v: VNode = this;
        console.assert(0 <= n && n <= v.children.length);
        const v2: VNode = new VNode(v.context);
        v2._linkAsNthChild(v, n);
        console.assert(v.children[n] === v2);
        return v2;
    }

    /**
     * Adjust links after adding a link to v.
     */
    public _addCopiedLink(childIndex: number, parent_v: VNode): void {
        const v: VNode = this;
        v.context.frame.tree.generation += 1;
        // Update parent_v.children & v.parents.
        parent_v.children.splice(childIndex, 0, v);
        v.parents.push(parent_v);
    }

    /**
     * Adjust links after adding a link to v.
     */
    public _addLink(childIndex:number, parent_v: VNode):void{
        const v: VNode = this;
        v.context.frame.tree.generation += 1;
        // Update parent_v.children & v.parents.
        parent_v.children.splice(childIndex, 0, v);
        v.parents.push(parent_v);
        if (v.parents.length === 1){
            // Adjust the parents links in the descendant tree.
            // This handles clones properly when undoing a delete.
            for (let child of v.children){
                child._addParentLinks(v);
            }
        }
    }

    /**
     * Used by addLink to adjust parent links in the descendant tree
     */
    public _addParentLinks(parent:VNode):void{
        const v: VNode = this;
        v.parents.push(parent);
        if (v.parents.length  === 1){
            for (let child of v.children){
                child._addParentLinks(v);
            }
        }
    }

    /**
     * Adjust links after cutting a link to v.
     */
    public _cutLink(childIndex:number, parent_v:VNode):void{
        const v: VNode = this;
        v.context.frame.tree.generation += 1;
        console.assert(parent_v.children[childIndex] === v);
        parent_v.children.splice(childIndex, 1);
        if( v.parents.includes(parent_v)){
            try{
                for(let i = 0; i < v.parents.length; i++){ 
                    if (v.parents[i] === parent_v) {
                        v.parents.splice(i, 1);
                        break;
                    }
                }
            }
            catch(ValueError){
                g.error(parent_v + " not in parents of "+v);
                g.trace('v.parents:');
                g.printObj(v.parents);
            }
        }
        
        
        
        if (!v.parents.length){
            // Adjust the parents links in the descendant tree.
            // This handles clones properly when deleting a tree.
            for(let child of v.children){
                child._cutParentLinks(v);
            }
        }
    }

    /**
     * Used by cutLink to adjust parent links in the descendant tree
     */
    public _cutParentLinks(parent: VNode){
        const v: VNode = this;
        
        for(let i = 0; i < v.parents.length; i++){ 
            if (v.parents[i] === parent) {
                v.parents.splice(i, 1);
                break;
            }
        }
            
        if (!v.parents.length){
            // Adjust the parents links in the descendant tree.
            // This handles clones properly when deleting a tree.
            for(let child of v.children){
                child._cutParentLinks(v);
            }
        }            
                
    }

    /**
     * Delete all children of self.
     * This is a low-level method, used by the read code.
     * It is not intended as a general replacement for p.doDelete().
     */
    public _deleteAllChildren():void {
        const v: VNode = this;
        
        for (let v2 of v.children){
            try{
                for(let i = 0; i < v2.parents.length; i++){ 
                    if (v2.parents[i] === v) {
                        v2.parents.splice(i, 1);
                        break;
                    }
                }
            }
            catch(ValueError){
                g.error(v+ " not in parents of "+v2);
                g.trace('v2.parents:');
                g.printObj(v2.parents);
            }
        }

        v.children = [];
    }

    /**
     * Links self as the n'th child of VNode pv
     */
    public _linkAsNthChild(parent_v:VNode, n:number):void {
        const v: VNode = this; // The child node.
        v._addLink(n, parent_v);
    }

    /**
     * VNode body string property
     */
    public get b(){
        const v: VNode = this;
        return v.bodyString();
    }

    public set b(val:string){
        const v: VNode = this;
        v.setBodyString(val);
    }

    /**
     * VNode headline string property
     */
    public get h(){
        const v: VNode = this;
        return v.headString();
    }

    public set h(val:string){
        const v: VNode = this;
        v.setHeadString(val);
    }

    /**
     * VNode u property
     */
    public get u(){
        const v: VNode = this;
        if(!v.unknownAttributes){
            v.unknownAttributes = {};
        }
        return v.unknownAttributes;
    }

    public set u(val:any){
        const v: VNode = this;
        if(val===null){
            v.unknownAttributes = undefined;
        }
        else if((typeof val)=== 'object'){
            v.unknownAttributes = val;
        }else {
            throw new Error("unknownAttributes ValueError");
        }
    }

    /**
     * VNode gnx property
     */
    public get gnx(){
        const v: VNode = this;
        return v.fileIndex;
    }


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


