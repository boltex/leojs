// Leo's fundamental data classes.

import "date-format-lite";
import * as g from './leoGlobals';
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
        // GNX example: felix.20210110163753.1
        // using https://www.npmjs.com/package/date-format-lite#syntax
        this.timeString = new Date().format("YYYYMMDDhhmmss");
    }

    // These are used by the FileCommands read/write code.

    /**
     * Return the id to be used by default in all gnx's
     */
    public getDefaultId():string {
        return this.defaultId;
    }

    /**
     * Set the id to be used by default in all gnx's
     */
    public setDefaultId(theId: string): void {
        this.defaultId = theId;
    }
    /**
     * Create a new gnx for v or an empty string if the hold flag is set.
     * **Important**: the method must allocate a new gnx even if v.fileIndex exists.
     */
    public getNewIndex(v:VNode|undefined, cached:Boolean=false):string {
        if(!v){
            console.log('getNewIndex: v is None');
            return '';
        }
        const c:Commander = v.context;
        const fc:any = c.fileCommands;
        const t_s:string = this.update();
            // Updates self.lastTime and self.lastIndex.
        const gnx:string = g.toUnicode(`${this.userId}.${t_s}.${this.lastIndex}`);
        v.fileIndex = gnx;
        this.check_gnx(c, gnx, v);
        fc.gnxDict[gnx] = v;
        return gnx;
    }

    /**
     * Handle all gnx-related tasks for VNode.__init__.
     */
    public new_vnode_helper(c:Commander, gnx:string|undefined, v:VNode):void {
        const ni:NodeIndices = this;
        if(gnx){
            v.fileIndex = gnx;
            ni.check_gnx(c, gnx, v);
            c.fileCommands.gnxDict[gnx] = v;
        } else {
            v.fileIndex = ni.getNewIndex(v);
        }
    }

    /**
     * Update self.timeString and self.lastIndex
     */
    public update():string {
        const t_s:string = new Date().format("YYYYMMDDhhmmss");
        if(this.timeString === t_s){
            this.lastIndex += 1;
        }else{
            this.lastIndex = 1;
            this.timeString = t_s;
        }
        return t_s;
    }


}

/**
 * A position marks the spot in a tree traversal. A position p consists of a VNode
 * p.v, a child index p._childIndex, and a stack of tuples (v,childIndex), one for
 * each ancestor **at the spot in tree traversal. Positions p has a unique set of
 * parents.
 *
 * The p.moveToX methods may return a null (invalid) position p with p.v = None.
 * No operator overload in js/ts, so "strict-comparisons" is set in tslint.json
 * to force usage of special methods to compare & evaluate equalities.
 */

export type StackEntry = [VNode, number];

export class Position {

    v: VNode;
    _childIndex: number;
    stack: StackEntry[];

    /**
     * Create a new position with the given childIndex and parent stack.
     */
    constructor(v: VNode, childIndex: number = 0, stack?: StackEntry[]) {
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
        if (!p2.__bool__() || !p2.v){
            return !p1.v;
        }
        // Modified by Félix to prevent object direct comparison (p1.v === p2.v)
        return !!(p1.v && p2.v &&
                p1.v.fileIndex === p2.v.fileIndex && 
                p1._childIndex === p2._childIndex &&
                p1.stack.length === p2.stack.length && 
                p1.stack.every(
                    (p_value, p_index) => {
                        return p_value[1] === p2.stack[p_index][1] &&
                        p_value[0].fileIndex === p2.stack[p_index][0].fileIndex;
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
            if(stack1[nx][1]>stack2[nx][1]){
                return true;
            }
            if(stack1[nx][1]<stack2[nx][1]){
                return false;
            }
        }
        // Finish the comparison.
        let x1:number;
        let x2:number;
        if (n1 === n2){
            x1 = this._childIndex;
            x2 = other._childIndex;
            return x1 > x2;
        }
        if (n1 < n2){
            x1 = this._childIndex; 
            x2 = other.stack[n][1];
            return x1 > x2;
        }
        // n1 > n2
        // 2011/07/28: Bug fix suggested by SegundoBob.
        x1 = other._childIndex; 
        x2 = this.stack[n][1];
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

    public dump(label?:string):void {
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
            const v:VNode = z[0];
            const childIndex: number = z[1];
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

    /*
        - convertTreeToString and moreHead can't be VNode methods because they use level().
        - moreBody could be anywhere: it may as well be a postion method.
    */

    /**
     * Convert a positions  suboutline to a string in MORE format.
     */
    public convertTreeToString():string {
        const p1:Position = this;
        const level1 = p1.level();
        const array:string[] = [];
        for(let p of p1.self_and_subtree(false)){
            array.push(p.moreHead(level1) + '\n');
            const body:string = p.moreBody();
            if(body){
                array.push(body + '\n');
            }
        }
        return array.join('');
    }

    /**
     * Return the headline string in MORE format.
     */
    public moreHead(firstLevel:number, useVerticalBar?:boolean):string {
        // useVerticalBar is unused, but it would be useful in over-ridden methods.
        const p:Position = this;
        const level:number = this.level() - firstLevel;
        const plusMinus:string = p.hasChildren()?"+":"-";
        const pad: string = '\t'.repeat(level);
        return `${pad}${plusMinus} ${p.h}`;
    }

    /*
        + test line
        - test line
        \ test line
        test line +
        test line -
        test line \
        More lines...
    */

    /**
     * Returns the body string in MORE format.
     * Inserts a backslash before any leading plus, minus or backslash.
     */
    public moreBody():string {
        const p:Position = this;
        const array:string[] = [];
        const lines:string[] = p.b.split('\n');
        for(let s of lines){
            const i:number = g.skip_ws(s, 0);
            if(i < s.length && ['+', '-', '\\'].includes(s[i])){
                s = s.slice(0,i) + '\\' + s.slice(i);
            }
            array.push(s);
        }
        return array.join('\n');
    }

    /**
     * Yield all child positions of p.
     */
    public *children(copy: boolean = true): Generator<Position> {
        const p = this.firstChild();
        while (p.__bool__()) {
            yield (copy ? p.copy() : p);
            p.moveToNext();
        }
    }

    // * Compatibility with old code...
    // children_iter = children

    /**
     * Yield all siblings positions that follow p, not including p.
     */
    public *following_siblings(copy: boolean = true): Generator<Position> {
        let p:Position = this;
        p = p.next();
        while(p.__bool__()){
            yield (copy ? p.copy() : p);
            p.moveToNext();
        }
    }

    // * Compatibility with old code...
    // following_siblings_iter = following_siblings

    /**
     * A generator yielding all the root positions "near" p1 = self that
        satisfy the given predicate. p.isAnyAtFileNode is the default
        predicate.

        The search first proceeds up the p's tree. If a root is found, this
        generator yields just that root.

        Otherwise, the generator yields all nodes in p.subtree() that satisfy
        the predicate. Once a root is found, the generator skips its subtree.
     */
    public *nearest_roots(copy=true, predicate?: (p:Position) => boolean ): Generator<Position> {
        if(!predicate){
            // pylint: disable=function-redefined
            predicate = function(p:Position):boolean {
                return p.isAnyAtFileNode();
            };
        }

        // First, look up the tree.
        let p1:Position =  this;
        for(let p of p1.self_and_parents(false)){
            if(predicate(p)){
                yield (copy ? p.copy() : p);
                return;
            }
        }
        
        // Next, look for all .md files in the tree.
        const after:Position = p1.nodeAfterTree();
        const p:Position = p1;
        while(p.__bool__() && !p.__eq__(after)){
            if (predicate(p)){
                yield (copy ? p.copy() : p);
                p.moveToNodeAfterTree();
            }else{
                p.moveToThreadNext();
            }
        }
    }

    /**
     *  A generator yielding all unique root positions "near" p1 = self that
        satisfy the given predicate. p.isAnyAtFileNode is the default
        predicate.

        The search first proceeds up the p's tree. If a root is found, this
        generator yields just that root.

        Otherwise, the generator yields all unique nodes in p.subtree() that
        satisfy the predicate. Once a root is found, the generator skips its
        subtree.
     */
    public *nearest_unique_roots(copy=true, predicate?: (p:Position) => boolean): Generator<Position> {
        if(!predicate){
            // pylint: disable=function-redefined
            predicate = function(p:Position):boolean {
                return p.isAnyAtFileNode();
            };
        }
        
        // First, look up the tree.
        let p1:Position =  this;
        for(let p of p1.self_and_parents(false)){
            if(predicate(p)){
                yield (copy ? p.copy() : p);
                return;
            }
        }
        
        // Next, look for all unique .md files in the tree.
        const seen: VNode[] = [];
        const after:Position = p1.nodeAfterTree();
        const p:Position = p1;
        while(p.__bool__() && !p.__eq__(after)){
            if (predicate(p)){
                if (!seen.includes(p.v)){
                    seen.push(p.v);
                    yield (copy ? p.copy() : p);
                }
                p.moveToNodeAfterTree();
            }else{
                p.moveToThreadNext();
            }
        }
    }

    // * Compatibility with old code...
    // nearest = nearest_unique_roots

    /**
     * Yield p.v and all vnodes in p's subtree.
     */
    public *nodes(): Generator<VNode> {
        let p:Position =  this;
        p = p.copy();
        const after:Position = p.nodeAfterTree();
        while(p.__bool__() && !p.__eq__(after)){  // bug fix: 2013/10/12
            yield p.v;
            p.moveToThreadNext();
        }
    }

    // * Compatibility with old code.
    // tnodes_iter = nodes
    // vnodes_iter = nodes

    /**
     * Yield all parent positions of p.
     */
    public *parents(copy:boolean=true): Generator<Position> {
        let p:Position =  this;
        p = p.parent();
        while(p.__bool__()){
            yield (copy ? p.copy() : p);
            p.moveToParent();
        }
    }

    // * Compatibility with old code...
    // parents_iter = parents

    /**
     * Yield p and all parent positions of p.
     */
    public *self_and_parents(copy:boolean=true): Generator<Position> {
        let p:Position =  this;
        p = p.copy();
        while(p.__bool__()){
            yield (copy ? p.copy() : p);
            p.moveToParent();
        }
    }

    // * Compatibility with old code...
    // self_and_parents_iter = self_and_parents

    /**
     * Yield all sibling positions of p including p.
     */
    public *self_and_siblings(copy:boolean=true): Generator<Position> {
        let p:Position =  this;
        p = p.copy();
        while (p.hasBack()){
            p.moveToBack();
        }
        while(p.__bool__()){
            yield (copy ? p.copy() : p);
            p.moveToNext();
        }
    }

    // * Compatibility with old code...
    // self_and_siblings_iter = self_and_siblings

    /**
     * Yield p and all positions in p's subtree.
     */
    public *self_and_subtree(copy:boolean=true): Generator<Position> {
        let p:Position =  this;
        p = p.copy();
        const after:Position  = p.nodeAfterTree();
        while(p.__bool__() && !p.__eq__(after)){
            yield (copy ? p.copy() : p);
            p.moveToThreadNext();
        }
    }

    // * Compatibility with old code...
    // self_and_subtree_iter = self_and_subtree

    /**
     * Yield all positions in p's subtree, but not p.
     */
    public *subtree(copy:boolean=true): Generator<Position> {
        let p:Position =  this;
        p = p.copy();
        const after:Position  = p.nodeAfterTree();
        p.moveToThreadNext();
        while(p.__bool__() && !p.__eq__(after)){
            yield (copy ? p.copy() : p);
            p.moveToThreadNext();
        }
    }

    //* Compatibility with old code...
    // subtree_iter = subtree

    /**
     * Yield p.v and all unique vnodes in p's subtree.
     */
    public *unique_nodes(): Generator<VNode> {
        const p1:Position =  this;
        const seen: VNode[] = [];
        for(let p of p1.self_and_subtree(false)){
            if (!seen.includes(p.v)){
                seen.push(p.v);
                yield p.v;
            }
        }
    }

    // * Compatibility with old code.
    // unique_tnodes_iter = unique_nodes
    // unique_vnodes_iter = unique_nodes

    /**
     * Yield p and all other unique positions in p's subtree.
     */
    public *unique_subtree(copy:boolean=true): Generator<Position> {
        const p1:Position =  this;
        const seen: VNode[] = [];
        for(let p of p1.subtree()){
            if (!seen.includes(p.v)){
                seen.push(p.v);
                // Fixed bug 1255208: p.unique_subtree returns vnodes, not positions.
                yield (copy ? p.copy() : p);
            }
        }
    }

    // * Compatibility with old code...
    // subtree_with_unique_tnodes_iter = unique_subtree
    // subtree_with_unique_vnodes_iter = unique_subtree

    public anyAtFileNodeName(): string {
        return this.v.anyAtFileNodeName();
    }

    public atAutoNodeName(): string {
        return this.v.atAutoNodeName();
    }

    public atCleanNodeName(): string {
        return this.v.atCleanNodeName();
    }

    public atEditNodeName(): string {
        return this.v.atEditNodeName();
    }

    public atFileNodeName(): string {
        return this.v.atFileNodeName();
    }

    public atNoSentinelsFileNodeName(): string {
        return this.v.atNoSentinelsFileNodeName();
    }

    public atShadowFileNodeName(): string {
        return this.v.atShadowFileNodeName();
    }

    public atSilentFileNodeName(): string {
        return this.v.atSilentFileNodeName();
    }

    public atThinFileNodeName(): string {
        return this.v.atThinFileNodeName();
    }

    public isAnyAtFileNode(): boolean {
        return this.v.isAnyAtFileNode();
    }

    public isAtAllNode(): boolean {
        return this.v.isAtAllNode();
    }

    public isAtAutoNode(): boolean {
        return this.v.isAtAutoNode();
    }

    public isAtAutoRstNode(): boolean {
        return this.v.isAtAutoRstNode();
    }

    public isAtCleanNode(): boolean {
        return this.v.isAtCleanNode();
    }

    public isAtEditNode(): boolean {
        return this.v.isAtEditNode();
    }

    public isAtFileNode(): boolean {
        return this.v.isAtFileNode();
    }

    public isAtIgnoreNode(): boolean {
        return this.v.isAtIgnoreNode();
    }

    public isAtNoSentinelsFileNode(): boolean {
        return this.v.isAtNoSentinelsFileNode();
    }

    public isAtOthersNode(): boolean {
        return this.v.isAtOthersNode();
    }

    public isAtRstFileNode(): boolean {
        return this.v.isAtRstFileNode();
    }

    public isAtSilentFileNode(): boolean {
        return this.v.isAtSilentFileNode();
    }

    public isAtShadowFileNode(): boolean {
        return this.v.isAtShadowFileNode();
    }

    public isAtThinFileNode(): boolean {
        return this.v.isAtThinFileNode();
    }

    public matchHeadline(pattern: string): boolean {
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

    // These methods are useful abbreviations.
    // Warning: they make copies of positions, so they should be used _sparingly_

    public getBack():Position {return this.copy().moveToBack();}

    public getFirstChild():Position {return this.copy().moveToFirstChild();}

    public getLastChild():Position {return this.copy().moveToLastChild();}

    public getLastNode():Position {return this.copy().moveToLastNode();}
    // def getLastVisible   (): return this.copy().moveToLastVisible();

    public getNext():Position {return this.copy().moveToNext();}

    public getNodeAfterTree():Position {return this.copy().moveToNodeAfterTree();}

    public getNthChild(n:number):Position {return this.copy().moveToNthChild(n);}

    public getParent():Position {return this.copy().moveToParent();}

    public getThreadBack():Position {return this.copy().moveToThreadBack();}

    public getThreadNext():Position {return this.copy().moveToThreadNext();}
    // New in Leo 4.4.3 b2: add c args.

    public getVisBack(c:Commander):Position {return this.copy().moveToVisBack(c)!;}

    public getVisNext(c:Commander):Position {return this.copy().moveToVisNext(c)!;}

    /**
     * with_file = True - include path to Leo file
     * with_proto = False - include 'file://'
     * with_index - include ',x' at end where x is child index in parent
     * with_count - include ',x,y' at end where y zero based count of same headlines
     */
    public get_UNL(with_file=true, with_proto=false, with_index=true, with_count=false):string {
        const aList:string[] = [];
        for(let i of this.self_and_parents(false)){
            if( with_index || with_count){
                let count:number = 0;
                let ind:number = 0;
                const p:Position = i.copy();
                while( p.hasBack()){
                    ind = ind + 1;
                    p.moveToBack();
                    if(i.h === p.h){
                        count = count + 1;
                    }
                }
                aList.push(i.h.replace('-->', '--%3E') + ":" + ind.toString());
                    // g.recursiveUNLFind and sf.copy_to_my_settings undo this replacement.
                if( count || with_count){
                    aList[-1] = aList[-1] + "," + count.toString();
                }
            }else{
                aList.push(i.h.replace('-->', '--%3E'));
                    // g.recursiveUNLFind  and sf.copy_to_my_settings undo this replacement.
            }
        }

        const UNL:string = aList.reverse().join('-->');
        if (with_proto){
            // return ("file://%s#%s" % (self.v.context.fileName(), UNL)).replace(' ', '%20')
            const s:string = "unl:" + `//${this.v.context.fileName()}#${UNL}`;
            return s.replace(' ', '%20');
        }
        if(with_file){
            return `${this.v.context.fileName()}#${UNL}`;
        }
        return UNL;
    }

    public hasBack():boolean{
        const p:Position = this;
        return p.v && p._childIndex > 0;
    }

    public hasNext():boolean|undefined{
        const p:Position = this;
        try{
            const parent_v:VNode = p._parentVnode()!;
                // Returns None if p.v is None.
            return p.v && parent_v && p._childIndex + 1 < parent_v.children.length;
        }
        catch(Exception){
            g.trace('*** Unexpected exception');
            g.es_exception();
            return undefined;
        }
    }

    public hasParent():boolean{
        const p:Position = this;
        return p.v && !!p.stack.length;
    }

    public hasThreadBack():boolean{
        const p:Position = this;
        return p.hasParent() || p.hasBack();
            // Much cheaper than computing the actual value.
    }

    public hasThreadNext():boolean{
        const p:Position = this;
        if(!p.v){
            return false;
        }
        if( p.hasChildren() || p.hasNext()){
            return true;
        }
        let n:number = p.stack.length - 1;
        while( n >= 0){
            let v:VNode;
            let childIndex:number;
            let parent_v:VNode;
            [v, childIndex] = p.stack[n];
            // See how many children v's parent has.
            if (n === 0){
                parent_v = v.context.hiddenRootNode!;
            }else{
                parent_v= p.stack[n - 1][0];
            }
            if (parent_v.children.length > childIndex + 1){
                // v has a next sibling.
                return true;
            }
            n -= 1;
        }
        return false;
    }

    public findRootPosition():Position{
        // 2011/02/25: always use c.rootPosition
        const p:Position = this;
        const c:Commander = p.v.context;
        return c.rootPosition()!;
    }

    /**
     * Return True if p is one of the direct ancestors of p2.
     */
    public isAncestorOf(p2:Position):boolean{
        const p:Position = this;
        const c:Commander = p.v.context;
        if(!c.positionExists(p2)){
            return false;
        }
        for(let z of p2.stack){
            // 2013/12/25: bug fix: test childIndices.
            // This is required for the new per-position expansion scheme.
            let parent_v:VNode;
            let parent_childIndex:number;
            [parent_v, parent_childIndex] = z;
            if(
                parent_v.fileIndex === p.v.fileIndex &&
                parent_childIndex === p._childIndex
            ){
                return true;
            }
        }
        return false;
    }

    public isCloned():boolean{
        const p:Position = this;
        return p.v.isCloned();
    }

    public isRoot():boolean {
        const p:Position = this;
        return !p.hasParent() && !p.hasBack();
    }

    /**
     * Return True if p is visible in c's outline.
     */
    public isVisible(c:Commander):boolean {
        const p:Position = this;

        function visible(p:Position, root?:Position){
            for (let parent of p.parents(false)){
                if (parent.__bool__() && parent.__eq__(root!)){
                    // #12.
                    return true;
                }
                if(!c.shouldBeExpanded(parent)){
                    return false;
                }
            }
            return true;
        }

        if(c.hoistStack.length){
            const root:Position = c.hoistStack[-1].p;
            if(p.__eq__(root)){
                // #12.
                return true;
            }
            return root.isAncestorOf(p) && visible(p, root);
        }
        for(let root of c.rootPosition()!.self_and_siblings(false)){
            if( root.__eq__(p) || root.isAncestorOf(p)){
                return visible(p);
            }
        }
        return false;
    }

    /**
     * Return the number of p's parents.
     */
    public level():number {
        const p:Position = this;
        return p.v?p.stack.length:0;
    }

    /**
     * * * * * * * * * * * * * * * * * * * * * * * * * * *
        Return the position corresponding to p.nodeAfterTree() after this node is
        deleted. This will be p.nodeAfterTree() unless p.next() exists.

        This method allows scripts to traverse an outline, deleting nodes during the
        traversal. The pattern is::

            p = c.rootPosition()
            while p:
            if <delete p?>:
                next = p.positionAfterDeletedTree()
                p.doDelete()
                p = next
            else:
                p.moveToThreadNext()

        This method also allows scripts to *move* nodes during a traversal, **provided**
        that nodes are moved to a "safe" spot so that moving a node does not change the
        position of any other nodes.

        For example, the move-marked-nodes command first creates a **move node**, called
        'Clones of marked nodes'. All moved nodes become children of this move node.
        **Inserting** these nodes as children of the "move node" does not change the
        positions of other nodes. **Deleting** these nodes *may* change the position of
        nodes, but the pattern above handles this complication cleanly.
     * * * * * * * * * * * * * * * * * * * * * * * * * * *
     */
    public positionAfterDeletedTree():Position {
        let p:Position = this;
        const next:Position = p.next();
        if(next.__bool__()){
            // The new position will be the same as p, except for p.v.
            p = p.copy();
            p.v = next.v;
            return p;
        }
        return p.nodeAfterTree();
    }

    /**
     * """
        Return the fcol offset of self.
        Return None if p is has no ancestor @<file> node.
        http://tinyurl.com/5nescw
        """
     */
    public textOffset():number|undefined {
        const p1:Position = this;
        let found:boolean =false;
        let offset:number= 0;
        for(let p of p1.self_and_parents(false)){
            if (p.isAnyAtFileNode()){
                // Ignore parent of @<file> node.
                found = true;
                break;
            }
            const parent:Position = p.parent();
            if (!parent.__bool__()){
                break;
            }
            // If p is a section definition, search the parent for the reference.
            // Otherwise, search the parent for @others.
            const h:string = p.h.trim();
            const i:number = h.indexOf('<<');
            const j:number = h.indexOf('>>');
            // const target:string = h[i : j + 2] if -1 < i < j else '@others'
            const target:string = (-1 < i && i < j)?h.slice(i, j+2):'@others';
            for (let s of parent.b.split('\n')){
                if (s.indexOf(target) > -1){
                    offset += g.skip_ws(s, 0);
                    break;
                }
            }
        }
        return found?offset:undefined;
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
            const v:VNode = p.stack[i][0];
            const childIndex:number = p.stack[i][1];
            const p3 = new Position(v, childIndex, stack.slice(0,i)); // stack[:i]
            while (p3.__bool__()){
                if (p2.__eq__(p3)){
                    // 2011/02/25: compare full positions, not just vnodes.
                    // A match with the to-be-moved node.
                    stack.push([v, childIndex - 1]);
                    changed = true;
                    break;  // terminate only the inner loop.
                }
                p3.moveToBack();
                if(!p3.__bool__()){
                    stack.push([v, childIndex]);
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
        const parent_v = p_after._parentVnode()!;
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
        const parent_v:VNode = p_after._parentVnode()!;
        p.stack = [...p_after.stack];
        p._childIndex = p_after._childIndex + 1;
        const child:VNode = p.v;
        const n:number = p_after._childIndex + 1;
        child._addCopiedLink(n, parent_v);
    }

    /**
     * Link self as the n'th child of the parent.
     */
    public _linkAsNthChild(parent:Position, n:number): void {
        const p:Position = this;
        const parent_v:VNode = parent.v;
        p.stack = [...parent.stack];
        p.stack.push([parent_v, parent._childIndex]);
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
        p.stack.push([parent_v, parent._childIndex]);
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
        const parent_v:VNode = p.v.context.hiddenRootNode!;
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
                const v:VNode = data[0];
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
        const p:Position = this;
        const v:VNode = p.v;
        const v2:VNode = p2.v;
        const parent_v:VNode|undefined = p._parentVnode();
        if(!parent_v){
            g.error('no parent_v', p);
            return;
        }
        // Compare fileIndex instead of v directly
        if( parent_v.children[p._childIndex].fileIndex === v.fileIndex){
            parent_v.children[p._childIndex] = v2;
            v2.parents.push(parent_v);
            // p.v no longer truly exists.
            // p.v = p2.v
        }else{
            g.error(
                'parent_v.children[childIndex] != v',
                p, parent_v.children, p._childIndex, v);
        }
    }

    /**
     * Unlink the receiver p from the tree.
     */
    public _unlink(): void {
        const p:Position = this;
        const n:number = p._childIndex;
        const parent_v:VNode = p._parentVnode()!;
            // returns None if p.v is None
        const child:VNode = p.v;
        console.assert(p.v);
        console.assert(parent_v);
        // Delete the child.
        if( (0 <= n && 
            n < parent_v.children.length &&
            parent_v.children[n].fileIndex === child.fileIndex
        )){
            // This is the only call to v._cutlink.
            child._cutLink(n, parent_v);
        }else{
            this.badUnlink(parent_v, n, child);
        }
    }

    /**
     * badUnlink error trace output
     */
    public badUnlink(parent_v:VNode, n:number, child:VNode): void {

        if( 0 <= n && n< parent_v.children.length){
            g.trace(`**can not happen: children[{n}] != p.v`);
            g.trace('parent_v.children...\n',
                g.listToString(parent_v.children));
            g.trace('parent_v', parent_v);
            g.trace('parent_v.children[n]', parent_v.children[n]);
            g.trace('child', child);
            g.trace('** callers:', g.callers());
        }else{
            g.trace(
                `**can not happen: bad child index: ${n}, `,
                `children.length: ${parent_v.children.length}`);
            g.trace('parent_v.children...\n',
                g.listToString(parent_v.children));
            g.trace('parent_v', parent_v, 'child', child);
            g.trace('** callers:', g.callers());
        }
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
        const parent_v:VNode = p._parentVnode()!; // Returns None if p.v is None.
            
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
            // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
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
            p.stack.push([p.v, p._childIndex]);
            p.v = p.v.children[0];
            p._childIndex = 0;
        }else{
            // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to it's last child's position.
     */
    public moveToLastChild():Position{
        const p:Position = this;
        let n:number;
        if (p.v && p.v.children.length){
            p.stack.push([p.v, p._childIndex]);
            n = p.v.children.length;
            p.v = p.v.children[n - 1];
            p._childIndex = n - 1;
        }else{
            // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to last node of its tree.
     *  N.B. Returns p if p has no children.
     */
    public moveToLastNode():Position{
        const p:Position = this;
        // Huge improvement for 4.2.
        while (p.hasChildren()){
            p.moveToLastChild();
        }
        return p;
    }

    /**
     * Move a position to its next sibling.
     */
    public moveToNext():Position{
        const p:Position = this;    
        const n:number = p._childIndex;
        const parent_v:VNode = p._parentVnode()!;
            // Returns None if p.v is None.
        if (!p.v){
            g.trace('no p.v:', p, g.callers());
        }
        if (p.v && parent_v && parent_v.children.length > (n + 1)){
            p._childIndex = n + 1;
            p.v = parent_v.children[n + 1];
        }else{
            // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to the node after the position's tree.
     */
    public moveToNodeAfterTree():Position {
        const p:Position = this;
        while( p.__bool__()){
            if( p.hasNext()){
                p.moveToNext();
                break;
            }
            p.moveToParent();
        }
        return p;
    }

    /**
     * Move to Nth child
     */
    public moveToNthChild(n:number):Position {
        const p:Position = this;
        if (p.v && p.v.children.length > n){
            p.stack.push([p.v, p._childIndex]);
            p.v = p.v.children[n];
            p._childIndex = n;
        }else{
            // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to its parent position.
     */
    public moveToParent():Position {
        const p:Position = this;
        if (p.v && p.stack.length){
            const item:StackEntry = p.stack.pop()!;
            p.v = item[0];
            p._childIndex = item[1];
        }else{
            // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
            p.v = undefined;
        }
        return p;
    }

    /**
     * Move a position to it's threadBack position.
     */
    public moveToThreadBack(): Position {
        const p:Position = this;
        if (p.hasBack()){
            p.moveToBack();
            p.moveToLastNode();
        }else{
            p.moveToParent();
        }
        return p;
    }

    /**
     * Move a position to threadNext position.
     */
    public moveToThreadNext(): Position {
        const p:Position = this;
        if(p.v){
            if(p.v.children.length){
                p.moveToFirstChild();
            }else if(p.hasNext()){
                p.moveToNext();
            }else{
                p.moveToParent();
                while(p.__bool__()){
                    if(p.hasNext()){
                        p.moveToNext();
                        break;  //found
                    }
                    p.moveToParent();
                // not found.
                }
            }
        }
        return p;
    }

    /**
     * Move a position to the position of the previous visible node.
     */
    public moveToVisBack(c:Commander): Position|undefined {
        const p:Position = this;
        const visLimit: [Position, boolean] | undefined = c.visLimit();
        if(visLimit){
            const limit:Position = visLimit[0];
            const limitIsVisible:boolean = visLimit[1];
            while  (visLimit && p.__bool__()){
                // Short-circuit if possible.
                const back:Position = p.back();
                if( back.__bool__() && back.hasChildren() && back.isExpanded()){
                    p.moveToThreadBack();
                }
                else if(back.__bool__()){
                    p.moveToBack();
                } else{
                    p.moveToParent();  // Same as p.moveToThreadBack()
                }
                if (p.__bool__()){
                    if(limit){
                        let done:boolean;
                        let val:Position|undefined;
                        [done, val] = this.checkVisBackLimit(limit, limitIsVisible, p);
                        if (done){
                            return val;  // A position or None
                        }
                    }
                    if( p.isVisible(c)){
                        return p;
                    }
                }
            }
        }
        return p;
    }

    /**
     * Return done, p or None
     */
    public checkVisBackLimit(limit:Position, limitIsVisible:boolean, p:Position): [ boolean, Position|undefined] {
        const c:Commander = p.v.context;
        if (limit.__eq__(p)){
            if (limitIsVisible && p.isVisible(c)){
                return [true, p];
            }
            return [true, undefined];
        }
        if (limit.isAncestorOf(p)){
            return  [false, undefined];
        }
        return  [true, undefined];
    }

    /**
     * Move a position to the position of the next visible node.
     */
    public moveToVisNext(c:Commander):Position|undefined {
        const p:Position = this;
        const visLimit:[Position, boolean]|undefined = c.visLimit();
        if(visLimit){
            const limit:Position = visLimit[0];
            while (p.__bool__()){
                if(p.hasChildren()){
                    if(p.isExpanded()){
                        p.moveToFirstChild();
                    }else{
                        p.moveToNodeAfterTree();
                    }
                }else if(p.hasNext()){
                    p.moveToNext();
                }else{
                    p.moveToThreadNext();
                }
                if(p.__bool__()){
                    if (limit && this.checkVisNextLimit(limit, p)){
                        return undefined;
                    }
                    if( p.isVisible(c)){
                        return p;
                    }
                }
            }
        }
        return p;
    }

    /**
     * Return True is p is outside limit of visible nodes.
     */
    public checkVisNextLimit(limit:Position , p:Position):boolean {
        return !limit.__eq__(p) && !limit.isAncestorOf(p);
    }

    /**
     * Move a position to threadNext position.
     * Issue an error if any vnode is an ancestor of itself.
     */
    public safeMoveToThreadNext(): Position {
        const p:Position = this;
        if(p.v){
            const child_v:VNode| false = !!p.v.children.length && p.v.children[0];
            if(child_v){
                let brokeFor:boolean= false;
                for(let parent of p.self_and_parents(false)){
                    if(child_v.fileIndex === parent.v.fileIndex){
                        g.error(`vnode: ${child_v} is its own parent`);
                        // Allocating a new vnode would be difficult.
                        // Just remove child_v from parent.v.children.
                        parent.v.children = [];
                        for(let v2 of parent.v.children){
                            if(v2.fileIndex !== child_v.fileIndex){
                                parent.v.children .push(v2);
                            }
                        }
                        if(child_v.parents.includes(parent.v)){
                            // child_v.parents.remove(parent.v);
                            const index = child_v.parents.indexOf(parent.v);
                            if (index > -1) {
                                child_v.parents.splice(index, 1);
                            }
                        }
                        // Try not to hang.
                        p.moveToParent();
                        brokeFor= true;
                        break;
                    }else if( child_v.fileIndex === parent.v.fileIndex){
                        g.error(
                            `duplicate gnx: ${child_v.fileIndex} ` +
                            `v: ${child_v} parent: ${parent.v}`);
                        child_v.fileIndex = g.app.nodeIndices!.getNewIndex(child_v);
                        console.assert(child_v.gnx !== parent.v.gnx);
                        // Should be ok to continue.
                        p.moveToFirstChild();
                        brokeFor= true;
                        break;
                    }
                }
                if(!brokeFor){
                    //  for else
                    p.moveToFirstChild();
                }
            }else if(p.hasNext()){
                p.moveToNext();
            }else{
                p.moveToParent();
                while (p.__bool__()){
                    if(p.hasNext()){
                        p.moveToNext();
                        break;  // found
                    }
                    p.moveToParent();
                // not found.
                }
            }
        }
        return p;
    }

    /**
     * Create a clone of back.
     * Returns the newly created position.
     */
    public clone(): Position {
        const p:Position = this;
        const p2:Position  = p.copy();  // Do *not* copy the VNode!
        p2._linkAfter(p); // This should "just work"
        return p2;
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
        const p:Position = this;
        p.setDirty(); // Mark @file nodes dirty!
        const sib = p.copy();
        while (sib.hasNext()){
            sib.moveToNext();
            if (!!newNode && sib.__eq__(newNode)){
                // Adjust newNode._childIndex if newNode is a following sibling of p.
                newNode._childIndex -= 1;
                break;
            }
        }
        p._unlink();
    }

    /**
     * Inserts a new position after self.
     * Returns the newly created position.
     */
    public insertAfter(): Position {
        const p:Position = this;
        const context:Commander = p.v.context;
        const p2:Position  = this.copy();
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
        const p:Position = this;
        const n:number = p.numberOfChildren();
        return p.insertAsNthChild(n);
    }

    /**
     * Inserts a new node as the the nth child of self.
     * self must have at least n-1 children.
     * Returns the newly created position.
     */
    public  insertAsNthChild(n:number): Position {
        const p:Position = this;
        const context:Commander = p.v.context;
        const p2:Position = this.copy();
        p2.v = new VNode(context);
        p2.v.iconVal = 0;
        p2._linkAsNthChild(p, n);
        return p2;
    }

    /**
     * Inserts a new position before self.
     * Returns the newly created position.
     */
    public insertBefore(): Position {
        let p:Position = this;
        const parent:Position = p.parent();
        let back:Position;
        if (p.hasBack()){
            back = p.getBack();
            p = back.insertAfter();
        }else if( parent.__bool__()){
            p = parent.insertAsNthChild(0);
        }else{
            p = p.insertAfter();
            p.moveToRoot();
        }
        return p;
    }

    /**
     * Prints out error message about invalid outline
     */
    public invalidOutline(message:string): void {
        const p:Position = this;
        let node:Position;
        if (p.hasParent()){
            node = p.parent();
        }   else{
            node = p;
        }
        p.v.context.alert(`invalid outline: ${message}\n${node}`);
    }

    /**
     * Move a position after position a.
     */
    public moveAfter(a:Position): Position {
        const p:Position = this;  // Do NOT copy the position!
        a._adjustPositionBeforeUnlink(p);
        p._unlink();
        p._linkAfter(a);
        return p;
    }

    /**
     * Move a position to the first child of parent.
     */
    public  moveToFirstChildOf(parent:Position): Position {
        const p:Position = this; // Do NOT copy the position!
        return p.moveToNthChildOf(parent, 0);  // Major bug fix: 2011/12/04
    }

    /**
     * Move a position to the last child of parent.
     */
    public moveToLastChildOf(parent:Position): Position{
        const p:Position = this;  // Do NOT copy the position!
        let n:number = parent.numberOfChildren();
        if( p.parent().__eq__(parent)){
            n -= 1;  // 2011/12/10: Another bug fix.
        }
        return p.moveToNthChildOf(parent, n);  // Major bug fix: 2011/12/04
    }

    /**
     * Move a position to the nth child of parent.
     */
    public moveToNthChildOf(parent:Position, n:number):Position {
        const p:Position = this;  // Do NOT copy the position!
        parent._adjustPositionBeforeUnlink(p);
        p._unlink();
        p._linkAsNthChild(parent, n);
        return p;
    }

    /**
     * Move self to the root position.
     */
    public moveToRoot():Position{
        const p:Position = this;  //  Do NOT copy the position!
        // #1631. The old root can not possibly be affected by unlinking p.
        p._unlink();
        p._linkAsRoot();
        return p;
    }

    /**
     * A low-level promote helper.
     */
    public promote():void {
        const p:Position = this; //  Do NOT copy the position.
        const parent_v:VNode = p._parentVnode()!;
        const children: VNode[] = p.v.children;
        // Add the children to parent_v's children.
        const n:number = p.childIndex() + 1;
        const z:VNode[] = [... parent_v.children];
        parent_v.children = z.slice(0,n);
        parent_v.children.push(...children);
        parent_v.children.push(...z.slice(n));
        // Remove v's children.
        p.v.children = [];
        // Adjust the parent links in the moved children.
        // There is no need to adjust descendant links.
        for (let child of children){
            // child.parents.remove(p.v);
            const index = child.parents.indexOf(p.v);
            if (index > -1) {
                child.parents.splice(index, 1);
            }
            child.parents.push(parent_v);
        }
    }

    /**
     * This routine checks the structure of the receiver's tree.
     */
    public validateOutlineWithParent(pv:Position):boolean{
        const p:Position = this;
        let result:boolean = true;  // optimists get only unpleasant surprises.
        const parent:Position = p.getParent();
        const childIndex:number = p._childIndex;
        if (!parent.__eq__(pv)){
            p.invalidOutline("Invalid parent link: " + JSON. stringify(parent));
        }
        if( pv.__bool__()){
            if(childIndex < 0){
                p.invalidOutline("missing childIndex" + childIndex);
            }else if(childIndex >= pv.numberOfChildren()){
                p.invalidOutline("missing children entry for index: " + childIndex);
            }
        }else if(childIndex < 0){
            p.invalidOutline("negative childIndex" + childIndex);
        }
        if( !p.v && pv.__bool__()){
            this.invalidOutline("Empty t");
        }
        // Recursively validate all the children.
        for(let child of p.children()){
            const r:boolean = child.validateOutlineWithParent(p);
            if(!r){
                result = false;
            }
        }
        return result;
    }

    /**
     * position body string property
     */
    public get b():string{
        const p:Position =  this;
        return p.bodyString();
    }

    /**
     *  Set the body text of a position.
     *
     *  **Warning: the p.b = whatever is *expensive* because it calls
     *  c.setBodyString().
     *
     *  Usually, code *should* use this setter, despite its cost, because it
     *  update's Leo's outline pane properly. Calling c.redraw() is *not*
     *  enough.
     *
     *  This performance gotcha becomes important for repetitive commands, like
     *  cff, replace-all and recursive import. In such situations, code should
     *  use p.v.b instead of p.b.
     */
    public set b(val:string) {
        const p:Position =  this;
        const c:Commander|false = !!p.v && p.v.context;
        if (c){
            c.setBodyString(p, val);
            // Warning: c.setBodyString is *expensive*.
        }
    }

    /**
     * position property returning the headline string
     */
    public get h():string {
        const p:Position =  this;
        return p.headString();
    }

    /**
     *  Set the headline text of a position.
     *
     *  **Warning: the p.h = whatever is *expensive* because it calls
     *  c.setHeadString().
     *
     *  Usually, code *should* use this setter, despite its cost, because it
     *  update's Leo's outline pane properly. Calling c.redraw() is *not*
     *  enough.
     *
     *  This performance gotcha becomes important for repetitive commands, like
     *  cff, replace-all and recursive import. In such situations, code should
     *  use p.v.h instead of p.h.
     */
    public set h(val:string) {
        const p:Position =  this;
        const c:Commander|false = !!p.v && p.v.context;
        if (c){
            c.setHeadString(p, val);
            // Warning: c.setHeadString is *expensive*.
        }
    }

    /**
     * position gnx property
     */
    public get gnx():string{
        const p:Position =  this;
        return p.v.fileIndex;
    }

    /**
     * position property returning the script formed by p and its descendants
     */
    public get script():string {
        const p:Position =  this;
        return g.getScript(p.v.context, p,
            false,  //  Always return the entire expansion.
            true, // forcePythonSentinels
            false); // useSentinels
    }

    /** 
     * position property returning the body text without sentinels
     */
    public get nosentinels():string {
        const p:Position =  this;
        return g.splitLines(p.b).filter(z=>!g.isDirective(z)).join('');
    }

    /**
     * p.u property
     */
    public get u():any {
        const p:Position =  this;
        return p.v.u;
    }

    public set u(val:any) {
        const p:Position =  this;
        p.v.u = val;
    }

    /**
     * Contract p.v and clear p.v.expandedPositions list.
     */
    public contract():void {
        const p:Position =  this;
        const v:VNode = this.v;
        v.expandedPositions = v.expandedPositions.filter(z=>!z.__eq__(p));
        v.contract();
    }

    public expand():void {
        const p:Position =  this;
        const v:VNode = this.v;
        v.expandedPositions = v.expandedPositions.filter(z=>!z.__eq__(p));
        let isBreak:boolean=false;
        for(let p2 of v.expandedPositions){
            if(p.__eq__(p2)){
                isBreak = true;
                break;
            }
        }
        if(!isBreak){
            v.expandedPositions.push(p.copy());
        }
        v.expand();
    }

    public isExpanded():boolean {
        const p:Position =  this;
        if(p.isCloned()){
            const c:Commander = p.v.context;
            return c.shouldBeExpanded(p);
        }
        return p.v.isExpanded();
    }

    // Clone bits are no longer used.
    // Dirty bits are handled carefully by the position class.

    public clearMarked():void { return this.v.clearMarked(); }

    public clearOrphan():void { return this.v.clearOrphan(); }

    public clearVisited():void { return this.v.clearVisited(); }

    public initExpandedBit():void { return this.v.initExpandedBit(); }

    public initMarkedBit():void { return this.v.initMarkedBit(); }

    public initStatus(status:number):void { return this.v.initStatus(status); }

    public setMarked():void { return this.v.setMarked(); }

    public setOrphan():void { return this.v.setOrphan(); }

    public setSelected():void { return this.v.setSelected(); }

    public setVisited():void { return this.v.setVisited(); }

    public computeIcon():number {
        return this.v.computeIcon();
    }

    public setIcon():void {
        // Compatibility routine for old scripts
    }

    public setSelection(start:number, length:number):void {
        return this.v.setSelection(start, length);
    }

    public restoreCursorAndScroll(): void {
        this.v.restoreCursorAndScroll();
    }

    public saveCursorAndScroll():void {
        this.v.saveCursorAndScroll();
    }

    public setBodyString(s:string):void{
        const p:Position =  this;
        return p.v.setBodyString(s);
    }

    public initHeadString(s:string):void{
        const p:Position =  this;
        p.v.initHeadString(s);
    }

    public setHeadString(s:string):void{
        const p:Position =  this;
        p.v.initHeadString(s);
        p.setDirty();
    }

    // Compatibility routine for scripts.

    public clearVisitedInTree():void {
        for(let p of this.self_and_subtree(false)){
            p.clearVisited();
        }
    }

    public clearAllVisitedInTree():void {
        for(let p of this.self_and_subtree(false)){
            p.v.clearVisited();
            p.v.clearWriteBit();
        }
    }

    /**
     * (p) Set p.v dirty.
     */
    public clearDirty():void {
        const p:Position =  this;
        p.v.clearDirty();
    }

    /**
     * Returns True if position p or one of p's parents is an @ignore node.
     */
    public inAtIgnoreRange():boolean {
        const p1:Position =  this;
        for(let p of p1.self_and_parents(false)){
            if(p.isAtIgnoreNode()){
                return true;
            }
        }
        return false;
    }

    /**
     * Set all ancestor @<file> nodes dirty, including ancestors of all clones of p.
     */
    public setAllAncestorAtFileNodesDirty():void {
        const p:Position =  this;
        p.v.setAllAncestorAtFileNodesDirty();
    }

    /** 
     * Mark a node and all ancestor @file nodes dirty.
     * p.setDirty() is no longer expensive.
     */
    public setDirty(): void {
        const p:Position =  this;
        p.v.setAllAncestorAtFileNodesDirty();
        p.v.setDirty();
    }

    /**
     * Return True if p.b contains an @all directive.
     */
    public is_at_all(): boolean {
        const p:Position =  this;
        return (
            p.isAnyAtFileNode() &&
            !!g.splitLines(p.b).reduce((acc, s):boolean=>{
                if(g.match_word(s, 0, '@all')){
                    return true;
                }else {
                    return !!acc;
                }
            }, false)
            // any([g.match_word(s, 0, '@all') for s in g.splitLines(p.b)])
        );
    }

    /**
     * Return True if p or one of p's ancestors is an @all node.
     */
    public in_at_all_tree():boolean {
        const p1:Position =  this;
        for(let p of p1.self_and_parents(false)){
            if(p.is_at_all()){
                return true;
            }
        }
        return false;
    }

    /**
     * Return True if p is an @ignore node.
     */
    public is_at_ignore():boolean {
        const p:Position =  this;
        return g.match_word(p.h, 0, '@ignore');
    }

    /**
     * Return True if p or one of p's ancestors is an @ignore node
     */ 
    public in_at_ignore_tree():boolean {
        const p1:Position =  this;
        for(let p of p1.self_and_parents(false)){
            if(g.match_word(p.h, 0, '@ignore')){
                return true;
            }
        }
        return false;
    }


}

// Aliases for Position members
export interface Position {
    back: () => Position;
    firstChild: () => Position;
    lastChild: () => Position;
    lastNode: () => Position;
    next: () => Position;
    nodeAfterTree: () => Position;
    nthChild: (n:number) => Position;
    parent: () => Position;
    threadBack: () => Position;
    threadNext: () => Position;
    visBack: (c:Commander) => Position;
    visNext: (c:Commander) => Position;
    hasVisBack: (c:Commander) => Position;
    hasVisNext: (c:Commander) => Position;
    hasFirstChild: () => boolean;
    atNoSentFileNodeName: () => string;
    atAsisFileNodeName: () => string;
    isAtNoSentFileNode: () => boolean;
    isAtAsisFileNode: () => boolean;
    __repr__: () => string;
    simpleLevel: ()=>number;

    initBodyString : (s:string)=>void;
    setTnodeText: (s:string)=>void;
    scriptSetBodyString : (s:string)=>void;
}

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
Position.prototype.hasVisBack = Position.prototype.getVisBack;
Position.prototype.hasVisNext = Position.prototype.getVisNext;
// from p.children & parents
Position.prototype.hasFirstChild = Position.prototype.hasChildren;
// New names, less confusing
Position.prototype.atNoSentFileNodeName = Position.prototype.atNoSentinelsFileNodeName;
Position.prototype.atAsisFileNodeName = Position.prototype.atSilentFileNodeName;

Position.prototype.isAtNoSentFileNode = Position.prototype.isAtNoSentinelsFileNode;
Position.prototype.isAtAsisFileNode = Position.prototype.isAtSilentFileNode;
Position.prototype.__repr__ = Position.prototype.__str__;
Position.prototype.simpleLevel = Position.prototype.level;

Position.prototype.initBodyString = Position.prototype.setBodyString;
Position.prototype.setTnodeText = Position.prototype.setBodyString;
Position.prototype.scriptSetBodyString = Position.prototype.setBodyString;

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
 * VNode class.
 */
export class VNode {

    // * The primary data: headline and body text.
    _headString: string;
    _bodyString: string;

    // * Structure data...
    children: VNode[]; // Ordered list of all children of this node.
    parents: VNode[]; // Unordered list of all parents of this node.

    // * Other essential data...
    fileIndex: string; // The immutable fileIndex (gnx) for this node. Set below.wwwwwwwwwwwww
    iconVal: number; // The present value of the node's icon.
    statusBits: number; // status bits

    // * Information that is never written to any file...
    // The context containing context.hiddenRootNode.
    // Required so we can compute top-level siblings.
    // It is named .context rather than .c to emphasize its limited usage.
    context: Commander;
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
        g.app.nodeIndices!.new_vnode_helper(context, gnx, this);
    }

    public __repr__():string{
        return `<VNode ${this.gnx} ${this.headString()}>`;
    }

    public dumpLink(link:string):string{
        return link?link:"<none>";
    }

    public dump(label=""):void {
        const v: VNode = this;
        const s:string = '-'.repeat(10);
        console.log(`${s} ${label} ${v}`);
        // console.log(`gnx: ${v.gnx}`);
        console.log(`parents.length: ${v.parents.length}`);
        console.log(`children.length: ${v.children.length}`);
        console.log(`parents: ${g.listToString(v.parents)}`);
        console.log(`children: ${g.listToString(v.children)}`);
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

    /**
     * Return an all-new tree of vnodes that are copies of self and all its
     * descendants.
     *
     * **Important**: the v.parents ivar must be [] for all nodes.
     * v._addParentLinks will set all parents.
     */
    public copyTree(copyMarked?:boolean):VNode {
        const v:VNode = this;
        // Allocate a new vnode and gnx with empty children & parents.
        const v2:VNode = new VNode(v.context);
        console.assert(v2.parents.length===0, v2.parents.length.toString());
        console.assert(v2.gnx);
        console.assert(v.gnx !== v2.gnx);
        // Copy vnode fields. Do **not** set v2.parents.
        v2._headString = g.toUnicode(v._headString, null, true);
        v2._bodyString = g.toUnicode(v._bodyString, null, true);
        v2.u = JSON.parse(JSON.stringify(v.u)); // Deep Copy 
        if(copyMarked && v.isMarked()){
            v2.setMarked();
        }
        // Recursively copy all descendant vnodes.
        for(let child of v.children){
            v2.children.push(child.copyTree(copyMarked));
        }
        return v2;
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
        return !!children && 0 <= n && n < children.length && children[n].fileIndex === this.fileIndex;
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

    public childrenModified():void {
        // TODO: needed?
        // g.childrenModifiedSet.add(this);
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

    public contentModified():void {
        // TODO: needed?
        // g.contentModifiedSet.add(this);
    }

    // Called only by LeoTree.selectHelper.

    /**
     * Restore the cursor position and scroll so it is visible.
     */
    public restoreCursorAndScroll(): void {
        // TODO
        /*
        const traceTime:boolean = false && !g.unitTesting;
        const v:VNode = this;
        let ins:number = v.insertSpot;
        // start, n = v.selectionStart, v.selectionLength
        const spot:number = v.scrollBarSpot;
        const body: any = this.context.frame.body;
        const w:any = body.wrapper;
        // Fix bug 981849: incorrect body content shown.
        if(ins===undefined){
           ins = 0;
        }
        // This is very expensive for large text.
        let t1:number;
        if (traceTime){
           t1 = time.time();
        }
        if(body.wrapper.setInsertPoint && body.wrapper.setInsertPoint!==undefined){
            w.setInsertPoint(ins);
        }
        if (traceTime){
            const delta_t:number = time.time() - t1;
            if( delta_t > 0.1){
                g.trace(`${delta_t} sec`);
            }
        }
        // Override any changes to the scrollbar setting that might
        // have been done above by w.setSelectionRange or w.setInsertPoint.
        if (spot !== undefined){
            w.setYScrollPosition(spot);
            v.scrollBarSpot = spot;
        }
        // Never call w.see here.
        */
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
        catch(exception) {
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
        const hiddenRootVnode: VNode = v.context.hiddenRootNode!;

        function* v_and_parents(v: VNode): Generator<VNode> {
            if (v.fileIndex !== hiddenRootVnode.fileIndex) {
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
        console.assert(v.children[n].fileIndex === v2.fileIndex);
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
        console.assert(parent_v.children[childIndex].fileIndex === v.fileIndex);
        parent_v.children.splice(childIndex, 1);
        if( v.parents.includes(parent_v)){
            try{
                for(let i = 0; i < v.parents.length; i++){
                    if (v.parents[i].fileIndex === parent_v.fileIndex) {
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
            if (v.parents[i].fileIndex === parent.fileIndex) {
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
                    if (v2.parents[i].fileIndex === v.fileIndex) {
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
    public get b():string{
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
    public get h():string{
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
    public get u():any{
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
    atNoSentFileNodeName: () => string;
    atAsisFileNodeName: () => string;
    isAtNoSentFileNode: () => boolean;
    isAtAsisFileNode: () => boolean;
    initBodyString: (s:string) => void;
    initHeadString: (s:string) => void;
    setHeadText: (s:string) => void;
    setTnodeText: (s:string) => void;
    __str__:() => string;
}

// New names, less confusing

VNode.prototype.atNoSentFileNodeName = VNode.prototype.atNoSentinelsFileNodeName;
VNode.prototype.atAsisFileNodeName = VNode.prototype.atSilentFileNodeName;
VNode.prototype.isAtNoSentFileNode = VNode.prototype.isAtNoSentinelsFileNode;
VNode.prototype.isAtAsisFileNode = VNode.prototype.isAtSilentFileNode;
VNode.prototype.initBodyString = VNode.prototype.setBodyString;
VNode.prototype.setHeadText = VNode.prototype.setHeadString;
VNode.prototype.initHeadString = VNode.prototype.setHeadString;
VNode.prototype.setTnodeText = VNode.prototype.setBodyString;
VNode.prototype.__str__ = VNode.prototype.__repr__;


