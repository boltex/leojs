//@+leo-ver=5-thin
//@+node:felix.20210102012632.1: * @file src/core/leoNodes.ts
/**
 * Leo's fundamental data classes.
 */
//@+<< imports >>
//@+node:felix.20210127001502.1: ** << imports >>
import * as g from './leoGlobals';
import * as utils from "../utils";
import { Commands } from './leoCommands';
import { Bead } from './leoUndo';
import { FileCommands } from './leoFileCommands';
import 'date-format-lite';
import { NullBody } from './leoFrame';
//@-<< imports >>
//@+others
//@+node:felix.20210102014453.1: ** class NodeIndices
/**
 * A class managing global node indices (gnx's).
 */
export class NodeIndices {
    defaultId: string;
    lastIndex: number;
    stack: Commands[]; // A stack of open commanders.
    timeString: string; //  Set by setTimeStamp.
    userId: string;

    //@+others
    //@+node:felix.20210102014804.1: *3* ni.constructor
    constructor(id_: string) {
        // Ctor for NodeIndices class.
        this.defaultId = id_;
        this.lastIndex = 0;
        this.stack = [];
        this.timeString = '';
        this.userId = id_;
        this.setTimeStamp();
    }

    //@+node:felix.20210110213751.1: *3* ni.check_gnx
    /**
     * Check that no vnode exists with the given gnx in fc.gnxDict.
     */
    public check_gnx(c: Commands, gnx: string, v: VNode): void {
        if (gnx === 'hidden-root-vnode-gnx') {
            // No longer an error.
            // fast.readWithElementTree always generates a nominal hidden vnode.
            return;
        }
        const fc: FileCommands = c.fileCommands;
        const v2: VNode = fc.gnxDict[gnx];
        if (v2 && v2 !== v) {
            g.error(
                `getNewIndex: gnx clash ${gnx}\n` +
                `          v: ${v}\n` +
                `         v2: ${v2}`
            );
        }
    }

    //@+node:felix.20230531001257.1: *3* ni.compute_last_index
    /**
     * Scan the entire leo outline to compute ni.last_index.
     */
    public compute_last_index(c: Commands): void {

        const ni = this;
        // Partial, experimental, fix for #658.
        // Do not change self.lastIndex here!
        // self.lastIndex = 0
        for (const v of c.all_unique_nodes()) {
            const gnx = v.fileIndex;
            if (gnx) {
                let [id_, t, n] = this.scanGnx(gnx);
                if (t === ni.timeString && !(n == null)) {
                    try {
                        const w_n = Number(n);
                        this.lastIndex = Math.max(this.lastIndex, w_n);
                    } catch (exception) {
                        g.es_exception(exception);
                        this.lastIndex += 1;
                    }
                }
            }
        }
    }
    //@+node:felix.20220101212728.1: *3* ni.computeNewIndex
    /**
     * Return a new gnx.
     */
    public computeNewIndex(): string {
        const t_s: string = this.update(); // Updates self.lastTime and self.lastIndex.
        const gnx: string = g.toUnicode(
            `${this.userId}.${t_s}.${this.lastIndex}`
        );
        return gnx;
    }
    //@+node:felix.20210102024358.1: *3* ni.setTimeStamp
    /**
     * Set the timestamp string to be used by getNewIndex until further notice
     */
    public setTimeStamp(): void {
        // GNX example: felix.20210110163753.1
        // using https://www.npmjs.com/package/date-format-lite#syntax
        this.timeString = new Date().format('YYYYMMDDhhmmss');
    }

    //@+node:felix.20210218214329.6: *3* ni.get/setDefaultId
    // These are used by the FileCommands read/write code.

    /**
     * Return the id to be used by default in all gnx's
     */
    public getDefaultId(): string {
        return this.defaultId;
    }

    /**
     * Set the id to be used by default in all gnx's
     */
    public setDefaultId(theId: string): void {
        this.defaultId = theId;
    }
    //@+node:felix.20210218214329.7: *3* ni.getNewIndex
    /**
     * Create a new gnx for v or an empty string if the hold flag is set.
     * **Important**: the method must allocate a new gnx even if v.fileIndex exists.
     */
    public getNewIndex(v: VNode | undefined, cached: boolean = false): string {
        if (!v) {
            g.internalError('getNewIndex: v is None');
            return '';
        }
        const c: Commands = v.context;
        const fc: FileCommands = c.fileCommands;
        const t_s: string = this.update();
        // Updates self.lastTime and self.lastIndex.
        const gnx: string = g.toUnicode(
            `${this.userId}.${t_s}.${this.lastIndex}`
        );
        v.fileIndex = gnx;
        this.check_gnx(c, gnx, v);
        fc.gnxDict[gnx] = v;
        return gnx;
    }

    //@+node:felix.20210218214329.8: *3* ni.new_vnode_helper
    /**
     * Handle all gnx-related tasks for VNode.__init__.
     */
    public new_vnode_helper(
        c: Commands,
        gnx: string | undefined,
        v: VNode
    ): void {
        const ni: NodeIndices = this;
        // Special case for the c.hiddenRootNode. This eliminates a hack in c.initObjects.
        if (!c.fileCommands) {
            console.assert(gnx === 'hidden-root-vnode-gnx');
            v.fileIndex = gnx!;
            return;
        }
        if (gnx) {
            v.fileIndex = gnx;
            ni.check_gnx(c, gnx, v);
            c.fileCommands.gnxDict[gnx] = v;
        } else {
            v.fileIndex = ni.getNewIndex(v);
        }
    }

    //@+node:felix.20211223233708.1: *3* ni.scanGnx
    /**
     * Create a gnx from its string representation.
     */
    public scanGnx(
        s: string
    ): [string | undefined, string | undefined, string | undefined] {
        if (!(typeof s === 'string')) {
            g.error('scanGnx: unexpected index type:' + typeof s);
            return [undefined, undefined, undefined];
        }

        s = s.trim();

        let i: number = 0;
        let theId: string | undefined;
        let t: string | undefined;
        let n: string | undefined;
        [theId, t, n] = [undefined, undefined, undefined];

        [i, theId] = g.skip_to_char(s, i, '.');

        if (g.match(s, i, '.')) {
            [i, t] = g.skip_to_char(s, i + 1, '.');
            if (g.match(s, i, '.')) {
                [i, n] = g.skip_to_char(s, i + 1, '.');
            }
        }
        // Use this.defaultId for missing id entries.
        if (!theId) {
            theId = this.defaultId;
        }
        return [theId, t, n];
    }
    //@+node:felix.20230531001333.1: *3* ni.tupleToString
    /**
     * Convert a gnx tuple returned by scanGnx
     * to its string representation.
     */
    public tupleToString(aTuple: [any, any, any]): string {

        let [theId, t, n] = aTuple;
        let s;
        // This logic must match the existing logic so that
        // previously written gnx's can be found.
        if ([undefined, 0, ''].includes(n)) {
            s = `${theId}.${t}`;
        } else {
            s = `${theId}.${t}.${n}`;
        }
        return g.toUnicode(s);

    }
    //@+node:felix.20210218214329.12: *3* ni.update
    /**
     * Update self.timeString and self.lastIndex
     */
    public update(): string {
        const t_s: string = new Date().format('YYYYMMDDhhmmss');
        if (this.timeString === t_s) {
            this.lastIndex += 1;
        } else {
            this.lastIndex = 1;
            this.timeString = t_s;
        }
        return t_s;
    }

    //@+node:felix.20230426235322.1: *3* ni.updateLastIndex
    /**
     * Update ni.lastIndex if the gnx affects it.
     */
    public updateLastIndex(gnx: string): undefined {

        let [id_, t, n] = this.scanGnx(gnx);
        // pylint: disable=literal-comparison
        // Don't you dare touch this code to keep pylint happy.
        if (!id_ || (n as any !== 0 && !n)) {
            return;  // the gnx is not well formed or n in ('',None)
        }
        if (id_ === this.userId && t === this.timeString) {
            try {
                const n2 = parseInt(n!);
                if (n2 > this.lastIndex) {
                    this.lastIndex = n2;
                    if (!g.unitTesting) {
                        g.trace(gnx, '-->', n2);
                    }
                }
            }
            catch (exception) {
                g.trace('can not happen', n);
            }

        }
    }
    //@-others
}

//@+node:felix.20210102015005.1: ** class Position
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
    _isRoot: boolean = false;

    //@+others
    //@+node:felix.20210126210412.1: *3* p.ctor & other special methods...
    //@+node:felix.20210126210419.1: *4* p.constructor
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

    //@+node:felix.20210126210412.3: *4* p.__eq__ & __ne__
    /**
     * Return True if two positions are equivalent.
     */
    public __eq__(p2?: Position): boolean {
        const p1: Position = this;
        // Don't use g.trace: it might call p.__eq__ or p.__ne__.
        if (!p2 || !(p2 instanceof Position)) {
            return false;
        }
        if (!p2.__bool__() || !p2.v) {
            return !p1.v;
        }

        return !!(
            p1.v === p2.v &&
            p1._childIndex === p2._childIndex &&
            p1.stack.length === p2.stack.length &&
            p1.stack.every((p_value, p_index) => {
                return (
                    p_value[1] === p2.stack[p_index][1] &&
                    p_value[0].fileIndex === p2.stack[p_index][0].fileIndex
                );
            })
        );
    }

    /**
     * Return True if two positions are not equivalent.
     */
    public __ne__(p2?: Position): boolean {
        return !this.__eq__(p2);
    }

    //@+node:felix.20210126210412.4: *4* p.__ge__ & __le__& __lt__
    public __ge__(other: Position): boolean {
        return this.__eq__(other) || this.__gt__(other);
    }

    public __le__(other: Position): boolean {
        return this.__eq__(other) || this.__lt__(other);
    }

    public __lt__(other: Position): boolean {
        return !this.__eq__(other) && !this.__gt__(other);
    }

    //@+node:felix.20210126210412.5: *4* p.__gt__
    /**
     * Return True if self appears after other in outline order.
     */
    public __gt__(other: Position): boolean {
        const stack1: StackEntry[] = this.stack;
        const stack2: StackEntry[] = other.stack;
        const n1: number = stack1.length;
        const n2: number = stack2.length;
        const n: number = n1 < n2 ? n1 : n2;
        // Compare the common part of the stacks.
        for (let nx = 0; nx < n; nx++) {
            if (stack1[nx][1] > stack2[nx][1]) {
                return true;
            }
            if (stack1[nx][1] < stack2[nx][1]) {
                return false;
            }
        }
        // Finish the comparison.
        let x1: number;
        let x2: number;
        if (n1 === n2) {
            x1 = this._childIndex;
            x2 = other._childIndex;
            return x1 > x2;
        }
        if (n1 < n2) {
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

    //@+node:felix.20210126210412.6: *4* p.__nonzero__ & __bool__
    /**
     * Return True if a position is valid.
     *
     * The tests 'if p' or 'if not p' are the _only_ correct ways to test
     * whether a position p is valid.
     *
     * Tests like 'if p is None' or 'if p is not None' will not work properly.
     */
    public __bool__(): boolean {
        return typeof this.v !== 'undefined';
    }

    //@+node:felix.20210126210412.7: *4* p.__str__ and p.__repr__
    /** 
     * For Position string output printout
     */
    public __str__(): string {
        const p: Position = this;
        if (p.v) {
            return (
                '<pos ' +
                `childIndex: ${p._childIndex} ` +
                `lvl: ${p.level()} ` +
                `key: ${p.key()} ` +
                `${p.h}` +
                '>'
            );
        }
        return `<pos [${p.stack.length}] None>`;
    }

    /** 
     * * For Position string output printout
     */
    public toString(): string {
        return this.__str__();
    }


    //@+node:felix.20230601210333.1: *4* p.valueOf
    /**
     * For > >= < <= greater/lesser comparisons in javascript. 
     * Note: Boolean evaluation still has to call valueOf, or __bool__.
     */
    public valueOf(): number {
        if (this.__bool__()) {
            let order = 1;
            const c: Commands = this.v.context;
            const p1: Position | undefined = c.rootPosition();
            while (p1 && p1.v) {
                if (this.__eq__(p1)) {
                    break;
                }
                order += 1;
                p1.moveToThreadNext();
            }
            return order; // 1 for rootPosition, the first child of the hiddenRootNode.
        }
        return 0; // falsy.
    }
    //@+node:felix.20210126210412.8: *4* p.archivedPosition
    /**
     * Return a representation of a position suitable for use in .leo files.
     */
    public archivedPosition(root_p?: Position): number[] {
        const p: Position = this;
        const aList: number[] = [];
        if (!root_p) {
            for (let z of p.self_and_parents()) {
                aList.push(z._childIndex);
            }
        } else {
            for (let z of p.self_and_parents(false)) {
                if (z.__eq__(root_p)) {
                    aList.push(0);
                    break;
                } else {
                    aList.push(z._childIndex);
                }
            }
        }
        aList.reverse();
        return aList;
    }

    //@+node:felix.20210126210412.9: *4* p.dump
    public dumpLink(link: string): string {
        return link ? link : '<none>';
    }

    public dump(label?: string): void {
        const p: Position = this;
        if (p.v) {
            p.v.dump(); // Don't print a label
        }
    }

    //@+node:felix.20210126210412.10: *4* p.key & p.sort_key & __hash__
    public key(): string {
        const p: Position = this;
        // For unified nodes we must include a complete key,
        // so we can distinguish between clones.
        const result: string[] = [];
        for (let z of p.stack) {
            const v: VNode = z[0];
            const childIndex: number = z[1];
            result.push(`${v.fileIndex}:${childIndex}`);
        }
        result.push(`${p.v.fileIndex}:${p._childIndex}`);
        return result.join('.');
    }

    public sort_key(p: Position): number[] {
        const result: number[] = [];
        for (let s of p.key().split('.')) {
            result.push(Number(s.split(':')[1]));
        }
        return result;
    }

    /*
     Positions should *not* be hashable.

     From https://docs.python.org/3/reference/datamodel.html#object.__hash__

     If a class defines mutable objects and implements an __eq__() method, it
     should not implement __hash__(), since the implementation of hashable
     collections requires that a key's hash value is immutable (if the object's
     hash value changes, it will be in the wrong hash bucket).
    */

    // __hash__ = None

    //@+node:felix.20210204224730.1: *3* p.File Conversion
    /*
        - convertTreeToString and moreHead can't be VNode methods because they use level().
        - moreBody could be anywhere: it may as well be a position method.
    */

    //@+node:felix.20210204224730.2: *4* p.convertTreeToString
    /**
     * Convert a positions suboutline to a string in MORE format.
     */
    public convertTreeToString(): string {
        const p1: Position = this;
        const level1 = p1.level();
        const array: string[] = [];
        for (let p of p1.self_and_subtree(false)) {
            array.push(p.moreHead(level1) + '\n');
            const body: string = p.moreBody();
            if (body) {
                array.push(body + '\n');
            }
        }
        return array.join('');
    }

    //@+node:felix.20210204224730.3: *4* p.moreHead
    /**
     * Return the headline string in MORE format.
     */
    public moreHead(firstLevel: number, useVerticalBar?: boolean): string {
        // useVerticalBar is unused, but it would be useful in over-ridden methods.
        const p: Position = this;
        const level: number = this.level() - firstLevel;
        const plusMinus: string = p.hasChildren() ? '+' : '-';
        const pad: string = '\t'.repeat(level);
        return `${pad}${plusMinus} ${p.h}`;
    }

    //@+node:felix.20210204224730.4: *4* p.moreBody
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
    public moreBody(): string {
        const p: Position = this;
        const array: string[] = [];
        const lines: string[] = p.b.split('\n');
        for (let s of lines) {
            const i: number = g.skip_ws(s, 0);
            if (i < s.length && ['+', '-', '\\'].includes(s[i])) {
                s = s.slice(0, i) + '\\' + s.slice(i);
            }
            array.push(s);
        }
        return array.join('\n');
    }

    //@+node:felix.20210204235058.1: *3* p.generators
    //@+node:felix.20210102031240.1: *4* p.children
    /**
     * Yield all child positions of p.
     */
    public *children(copy: boolean = true): Generator<Position> {
        //
        const p = this.firstChild();
        while (p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToNext();
        }
    }

    // * Compatibility with old code...
    // children_iter = children

    //@+node:felix.20210204235058.3: *4* p.following_siblings
    /**
     * Yield all siblings positions that follow p, not including p.
     */
    public *following_siblings(copy: boolean = true): Generator<Position> {
        let p: Position = this;
        p = p.next();
        while (p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToNext();
        }
    }

    // * Compatibility with old code...
    // following_siblings_iter = following_siblings

    //@+node:felix.20210204235058.4: *4* p.nearest_roots
    /**
     * A generator yielding all the root positions "near" p1 = self that
        satisfy the given predicate. p.isAnyAtFileNode is the default
        predicate.

        The search first proceeds up the p's tree. If a root is found, this
        generator yields just that root.

        Otherwise, the generator yields all nodes in p.subtree() that satisfy
        the predicate. Once a root is found, the generator skips its subtree.
     */
    public *nearest_roots(
        copy = true,
        predicate?: (p: Position) => boolean
    ): Generator<Position> {
        if (!predicate) {
            // pylint: disable=function-redefined
            predicate = function (p: Position): boolean {
                return p.isAnyAtFileNode();
            };
        }

        // First, look up the tree.
        let p1: Position = this;
        for (let p of p1.self_and_parents(false)) {
            if (predicate(p)) {
                yield copy ? p.copy() : p;
                return;
            }
        }

        // Next, look for all .md files in the tree.
        const after: Position = p1.nodeAfterTree();
        const p: Position = p1;
        while (p.__bool__() && !p.__eq__(after)) {
            if (predicate(p)) {
                yield copy ? p.copy() : p;
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }

    //@+node:felix.20210204235058.5: *4* p.nearest_unique_roots (aka p.nearest)
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
    public *nearest_unique_roots(
        copy = true,
        predicate?: (p: Position) => boolean
    ): Generator<Position> {
        if (!predicate) {
            // pylint: disable=function-redefined
            predicate = function (p: Position): boolean {
                return p.isAnyAtFileNode();
            };
        }

        // First, look up the tree.
        let p1: Position = this;
        for (let p of p1.self_and_parents(false)) {
            if (predicate(p)) {
                yield copy ? p.copy() : p;
                return;
            }
        }

        // Next, look for all unique .md files in the tree.
        const seen: VNode[] = [];
        const after: Position = p1.nodeAfterTree();
        const p: Position = p1;
        while (p.__bool__() && !p.__eq__(after)) {
            if (predicate(p)) {
                if (!seen.includes(p.v)) {
                    seen.push(p.v);
                    yield copy ? p.copy() : p;
                }
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }

    // * Compatibility with old code...
    // nearest = nearest_unique_roots

    //@+node:felix.20210204235058.6: *4* p.nodes
    /**
     * Yield p.v and all vnodes in p's subtree.
     */
    public *nodes(): Generator<VNode> {
        let p: Position = this;
        p = p.copy();
        const after: Position = p.nodeAfterTree();
        while (p.__bool__() && !p.__eq__(after)) {
            // bug fix: 2013/10/12
            yield p.v;
            p.moveToThreadNext();
        }
    }

    // * Compatibility with old code.
    // vnodes_iter = nodes

    //@+node:felix.20210204235058.7: *4* p.parents
    /**
     * Yield all parent positions of p.
     */
    public *parents(copy: boolean = true): Generator<Position> {
        let p: Position = this;
        p = p.parent();
        while (p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToParent();
        }
    }

    // * Compatibility with old code...
    // parents_iter = parents

    //@+node:felix.20210204235058.8: *4* p.self_and_parents
    /**
     * Yield p and all parent positions of p.
     */
    public *self_and_parents(copy: boolean = true): Generator<Position> {
        let p: Position = this;
        p = p.copy();
        while (p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToParent();
        }
    }

    // * Compatibility with old code...
    // self_and_parents_iter = self_and_parents

    //@+node:felix.20210204235058.9: *4* p.self_and_siblings
    /**
     * Yield all sibling positions of p including p.
     */
    public *self_and_siblings(copy: boolean = true): Generator<Position> {
        let p: Position = this;
        p = p.copy();
        while (p.hasBack()) {
            p.moveToBack();
        }
        while (p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToNext();
        }
    }

    // * Compatibility with old code...
    // self_and_siblings_iter = self_and_siblings

    //@+node:felix.20210204235058.10: *4* p.self_and_subtree
    /**
     * Yield p and all positions in p's subtree.
     */
    public *self_and_subtree(copy: boolean = true): Generator<Position> {
        let p: Position = this;
        p = p.copy();
        const after: Position = p.nodeAfterTree();
        while (p.__bool__() && !p.__eq__(after)) {
            yield copy ? p.copy() : p;
            p.moveToThreadNext();
        }
    }

    // * Compatibility with old code...
    // self_and_subtree_iter = self_and_subtree

    //@+node:felix.20210204235058.11: *4* p.subtree
    /**
     * Yield all positions in p's subtree, but not p.
     */
    public *subtree(copy: boolean = true): Generator<Position> {
        let p: Position = this;
        p = p.copy();
        const after: Position = p.nodeAfterTree();
        p.moveToThreadNext();
        while (p.__bool__() && !p.__eq__(after)) {
            yield copy ? p.copy() : p;
            p.moveToThreadNext();
        }
    }

    //* Compatibility with old code...
    // subtree_iter = subtree

    //@+node:felix.20210204235058.12: *4* p.unique_nodes
    /**
     * Yield p.v and all unique vnodes in p's subtree.
     */
    public *unique_nodes(): Generator<VNode> {
        const p1: Position = this;
        const seen: VNode[] = [];
        for (let p of p1.self_and_subtree(false)) {
            if (!seen.includes(p.v)) {
                seen.push(p.v);
                yield p.v;
            }
        }
    }

    // * Compatibility with old code.
    // unique_vnodes_iter = unique_nodes

    //@+node:felix.20210204235058.13: *4* p.unique_subtree
    /**
     * Yield p and all other unique positions in p's subtree.
     */
    public *unique_subtree(copy: boolean = true): Generator<Position> {
        const p1: Position = this;
        const seen: VNode[] = [];
        for (let p of p1.subtree()) {
            if (!seen.includes(p.v)) {
                seen.push(p.v);
                // Fixed bug 1255208: p.unique_subtree returns vnodes, not positions.
                yield copy ? p.copy() : p;
            }
        }
    }

    // * Compatibility with old code...
    // subtree_with_unique_vnodes_iter = unique_subtree

    //@+node:felix.20210202235315.1: *3* p.Getters
    //@+node:felix.20210102233013.1: *4* p.VNode proxies
    //@+node:felix.20210102233013.2: *5* p.Comparisons
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

    //@+node:felix.20210102233013.3: *5* p.Headline & body strings
    public bodyString(): string {
        return this.v.bodyString();
    }

    public headString(): string {
        return this.v.headString();
    }
    //@+node:felix.20210102233013.4: *5* p.Status bits
    public isDirty(): boolean {
        return this.v.isDirty();
    }

    public isMarked(): boolean {
        return this.v.isMarked();
    }

    public isOrphan(): boolean {
        return this.v.isOrphan();
    }

    public isSelected(): boolean {
        return this.v.isSelected();
    }

    public isTopBitSet(): boolean {
        return this.v.isTopBitSet();
    }

    public isVisited(): boolean {
        return this.v.isVisited();
    }

    public status(): number {
        return this.v.status();
    }

    //@+node:felix.20210112010737.1: *4* p.children & parents
    //@+node:felix.20210112010737.2: *5* p.childIndex
    // This used to be time-critical code.
    public childIndex(): number {
        return this._childIndex;
    }

    //@+node:felix.20210112010737.3: *5* p.directParents
    public directParents(): VNode[] {
        return this.v.directParents();
    }

    //@+node:felix.20210112010737.4: *5* p.hasChildren & p.numberOfChildren
    public hasChildren(): boolean {
        return this.v.children.length > 0;
    }

    public numberOfChildren(): number {
        return this.v.children.length;
    }

    //@+node:felix.20210202235315.10: *4* p.getX & VNode compatibility traversal routines
    // These methods are useful abbreviations.
    // Warning: they make copies of positions, so they should be used _sparingly_

    public getBack(): Position {
        return this.copy().moveToBack();
    }

    public getFirstChild(): Position {
        return this.copy().moveToFirstChild();
    }

    public getLastChild(): Position {
        return this.copy().moveToLastChild();
    }

    public getLastNode(): Position {
        return this.copy().moveToLastNode();
    }
    // def getLastVisible   (): return this.copy().moveToLastVisible();

    public getNext(): Position {
        return this.copy().moveToNext();
    }

    public getNodeAfterTree(): Position {
        return this.copy().moveToNodeAfterTree();
    }

    public getNthChild(n: number): Position {
        return this.copy().moveToNthChild(n);
    }

    public getParent(): Position {
        return this.copy().moveToParent();
    }

    public getThreadBack(): Position {
        return this.copy().moveToThreadBack();
    }

    public getThreadNext(): Position {
        return this.copy().moveToThreadNext();
    }
    // New in Leo 4.4.3 b2: add c args.

    public getVisBack(c: Commands): Position {
        return this.copy().moveToVisBack(c)!;
    }

    public getVisNext(c: Commands): Position {
        return this.copy().moveToVisNext(c)!;
    }

    //@+node:felix.20210202235315.11: *4* p.get_UNL
    /**
     *  Return a UNL representing a clickable link.
     *  See the section < define global error regexs > for the regexes.
     *
     *  New in Leo 6.6: Use a single, simplified format for UNL's:
     *
     *  - unl: //
     *  - self.v.context.fileName() #
     *  - a list of headlines separated by '-->'
     *
     *  New in Leo 6.6:
     *  - Always add unl: // and file name.
     *  - Never translate '-->' to '--%3E'.
     *  - Never generate child indices.
     */
    public get_UNL(): string {

        const parents = [...this.self_and_parents(false)].reverse().map(p => (p.v ? p.h : 'no v node'));

        const base_unl = this.v.context.fileName() + '#' + parents.join('-->');

        const encoded = base_unl.replace(/'/g, "%27");
        return 'unl://' + encoded;

    }

    //@+node:felix.20210202235315.12: *4* p.hasBack/Next/Parent/ThreadBack
    public hasBack(): boolean {
        const p: Position = this;
        return p.v && p._childIndex > 0;
    }

    public hasNext(): boolean | undefined {
        const p: Position = this;
        try {
            const parent_v: VNode = p._parentVnode()!;
            // Returns None if p.v is None.
            return (
                p.v && parent_v && p._childIndex + 1 < parent_v.children.length
            );
        } catch (exception) {
            g.trace('*** Unexpected exception');
            g.es_exception(exception);
            return undefined;
        }
    }

    public hasParent(): boolean {
        const p: Position = this;
        return p.v && !!p.stack.length;
    }

    public hasThreadBack(): boolean {
        const p: Position = this;
        return p.hasParent() || p.hasBack();
        // Much cheaper than computing the actual value.
    }

    //@+node:felix.20210202235315.13: *5* hasThreadNext (the only complex hasX method)
    public hasThreadNext(): boolean {
        const p: Position = this;
        if (!p.v) {
            return false;
        }
        if (p.hasChildren() || p.hasNext()) {
            return true;
        }
        let n: number = p.stack.length - 1;
        while (n >= 0) {
            let v: VNode;
            let childIndex: number;
            let parent_v: VNode;
            [v, childIndex] = p.stack[n];
            // See how many children v's parent has.
            if (n === 0) {
                parent_v = v.context.hiddenRootNode!;
            } else {
                parent_v = p.stack[n - 1][0];
            }
            if (parent_v.children.length > childIndex + 1) {
                // v has a next sibling.
                return true;
            }
            n -= 1;
        }
        return false;
    }

    //@+node:felix.20210202235315.14: *4* p.findRootPosition
    public findRootPosition(): Position {
        // 2011/02/25: always use c.rootPosition
        const p: Position = this;
        const c: Commands = p.v.context;
        return c.rootPosition()!;
    }

    //@+node:felix.20210202235315.15: *4* p.isAncestorOf
    /**
     * Return True if p is one of the direct ancestors of p2.
     */
    public isAncestorOf(p2: Position): boolean {
        const p: Position = this;
        const c: Commands = p.v.context;
        if (!c.positionExists(p2)) {
            return false;
        }
        for (let z of p2.stack) {
            // 2013/12/25: bug fix: test childIndices.
            // This is required for the new per-position expansion scheme.
            let parent_v: VNode;
            let parent_childIndex: number;
            [parent_v, parent_childIndex] = z;
            if (
                parent_v.fileIndex === p.v.fileIndex &&
                parent_childIndex === p._childIndex
            ) {
                return true;
            }
        }
        return false;
    }

    //@+node:felix.20210202235315.16: *4* p.isCloned
    public isCloned(): boolean {
        const p: Position = this;
        return p.v.isCloned();
    }

    //@+node:felix.20210202235315.17: *4* p.isRoot
    public isRoot(): boolean {
        const p: Position = this;
        return !p.hasParent() && !p.hasBack();
    }

    //@+node:felix.20210202235315.18: *4* p.isVisible (slow)
    /**
     * Return True if p is visible in c's outline.
     */
    public isVisible(c: Commands): boolean {
        const p: Position = this;

        function visible(p: Position, root?: Position) {
            for (let parent of p.parents(false)) {
                if (parent.__bool__() && parent.__eq__(root!)) {
                    // #12.
                    return true;
                }
                if (!c.shouldBeExpanded(parent)) {
                    return false;
                }
            }
            return true;
        }

        if (c.hoistStack.length) {
            const root: Position = c.hoistStack[c.hoistStack.length - 1].p;
            if (p.__eq__(root)) {
                // #12.
                return true;
            }
            return root.isAncestorOf(p) && visible(p, root);
        }
        for (let root of c.rootPosition()!.self_and_siblings(false)) {
            if (root.__eq__(p) || root.isAncestorOf(p)) {
                return visible(p);
            }
        }
        return false;
    }

    //@+node:felix.20210202235315.19: *4* p.level & simpleLevel
    /**
     * Return the number of p's parents.
     */
    public level(): number {
        const p: Position = this;
        return p.v ? p.stack.length : 0;
    }

    //@+node:felix.20210202235315.20: *4* p.positionAfterDeletedTree
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
    public positionAfterDeletedTree(): Position {
        let p: Position = this;
        const next: Position = p.next();
        if (next.__bool__()) {
            // The new position will be the same as p, except for p.v.
            p = p.copy();
            p.v = next.v;
            return p;
        }
        return p.nodeAfterTree();
    }

    //@+node:felix.20210202235315.21: *4* p.textOffset
    /**
     *  Return the fcol offset of self.
     *   Return None if p is has no ancestor @<file> node.
     *   http://tinyurl.com/5nescw
     */
    public textOffset(): number | undefined {
        const p1: Position = this;
        let found: boolean = false;
        let offset: number = 0;
        for (let p of p1.self_and_parents(false)) {
            if (p.isAnyAtFileNode()) {
                // Ignore parent of @<file> node.
                found = true;
                break;
            }
            const parent: Position = p.parent();
            if (!parent.__bool__()) {
                break;
            }
            // If p is a section definition, search the parent for the reference.
            // Otherwise, search the parent for @others.
            const h: string = p.h.trim();
            const i: number = h.indexOf('<<');
            const j: number = h.indexOf('>>');
            // const target:string = h[i : j + 2] if -1 < i < j else '@others'
            const target: string =
                -1 < i && i < j ? h.slice(i, j + 2) : '@others';
            for (let s of parent.b.split('\n')) {
                if (s.indexOf(target) > -1) {
                    offset += g.skip_ws(s, 0);
                    break;
                }
            }
        }
        return found ? offset : undefined;
    }

    //@+node:felix.20210127234205.1: *3* p.Low level methods
    /*
     * These methods are only for the use of low-level code
     * in leoNodes.py, leoFileCommands.py and leoUndo.py.
     */

    //@+node:felix.20210127234205.2: *4* p._adjustPositionBeforeUnlink
    /**
     * Adjust position p before unlinking p2.
     */
    public _adjustPositionBeforeUnlink(p2: Position): void {
        // p will change if p2 is a previous sibling of p or
        // p2 is a previous sibling of any ancestor of p.
        const p: Position = this;
        const sib: Position = p.copy();
        // A special case for previous siblings.
        // Adjust p._childIndex, not the stack's childIndex.
        while (sib.hasBack()) {
            sib.moveToBack();
            if (sib.__eq__(p2)) {
                p._childIndex -= 1;
                return;
            }
        }

        // Adjust p's stack.
        const stack: StackEntry[] = [];
        let changed: boolean = false;
        let i: number = 0;
        while (i < p.stack.length) {
            const v: VNode = p.stack[i][0];
            const childIndex: number = p.stack[i][1];
            const p3 = new Position(v, childIndex, stack.slice(0, i)); // stack[:i]
            while (p3.__bool__()) {
                if (p2.__eq__(p3)) {
                    // 2011/02/25: compare full positions, not just vnodes.
                    // A match with the to-be-moved node.
                    stack.push([v, childIndex - 1]);
                    changed = true;
                    break; // terminate only the inner loop.
                }
                p3.moveToBack();
                if (!p3.__bool__()) {
                    stack.push([v, childIndex]);
                }
            }
            i += 1;
        }
        if (changed) {
            p.stack = stack;
        }
    }

    //@+node:felix.20210127234205.3: *4* p._linkAfter
    /**
     * Link self after p_after.
     */
    public _linkAfter(p_after: Position): void {
        const p: Position = this;
        const parent_v = p_after._parentVnode()!;
        p.stack = [...p_after.stack];
        p._childIndex = p_after._childIndex + 1;
        const child: VNode = p.v;
        const n: number = p_after._childIndex + 1;
        child._addLink(n, parent_v);
    }

    //@+node:felix.20210127234205.4: *4* p._linkCopiedAfter
    /**
     * Link self, a newly copied tree, after p_after.
     */
    public _linkCopiedAfter(p_after: Position): void {
        const p: Position = this;
        const parent_v: VNode = p_after._parentVnode()!;
        p.stack = [...p_after.stack];
        p._childIndex = p_after._childIndex + 1;
        const child: VNode = p.v;
        const n: number = p_after._childIndex + 1;
        child._addCopiedLink(n, parent_v);
    }

    //@+node:felix.20210127234205.5: *4* p._linkAsNthChild
    /**
     * Link self as the n'th child of the parent.
     */
    public _linkAsNthChild(parent: Position, n: number): void {
        const p: Position = this;
        const parent_v: VNode = parent.v;
        p.stack = [...parent.stack];
        p.stack.push([parent_v, parent._childIndex]);
        p._childIndex = n;
        const child: VNode = p.v;
        child._addLink(n, parent_v);
    }

    //@+node:felix.20210127234205.6: *4* p._linkCopiedAsNthChild
    /**
     * Link a copied self as the n'th child of the parent.
     */
    public _linkCopiedAsNthChild(parent: Position, n: number): void {
        const p: Position = this;
        const parent_v: VNode = parent.v;
        p.stack = [...parent.stack];
        p.stack.push([parent_v, parent._childIndex]);
        p._childIndex = n;
        const child: VNode = p.v;
        child._addCopiedLink(n, parent_v);
    }

    //@+node:felix.20210127234205.7: *4* p._linkAsRoot (changed)
    /**
     * Link self as the root node.
     */
    public _linkAsRoot(): Position {
        const p: Position = this;
        console.assert(p.v);
        const parent_v: VNode = p.v.context.hiddenRootNode;
        console.assert(parent_v, g.callers());

        // Make p the root position.
        p.stack = [];
        p._childIndex = 0;

        // Make p.v the first child of parent_v.
        p.v._addLink(0, parent_v);
        return p;
    }

    //@+node:felix.20210127234205.8: *4* p._parentVnode
    /**
     * Return the parent VNode.
     * Return the hiddenRootNode if there is no other parent.
     */
    public _parentVnode(): VNode | undefined {
        const p: Position = this;
        if (p.v) {
            const data: false | StackEntry =
                !!p.stack.length && p.stack[p.stack.length - 1];
            if (data) {
                const v: VNode = data[0];
                return v;
            }
            return p.v.context.hiddenRootNode;
        }
        return undefined;
    }

    //@+node:felix.20210127234205.9: *4* p._relinkAsCloneOf
    /**
     * A low-level method to replace p.v by a p2.v.
     */
    public _relinkAsCloneOf(p2: Position): void {
        const p: Position = this;
        const v: VNode = p.v;
        const v2: VNode = p2.v;
        const parent_v: VNode | undefined = p._parentVnode();
        if (!parent_v) {
            g.error('no parent_v', p);
            return;
        }
        // Compare fileIndex instead of v directly
        if (parent_v.children[p._childIndex].fileIndex === v.fileIndex) {
            parent_v.children[p._childIndex] = v2;
            v2.parents.push(parent_v);
            // p.v no longer truly exists.
            // p.v = p2.v
        } else {
            g.error(
                'parent_v.children[childIndex] != v',
                p,
                parent_v.children,
                p._childIndex,
                v
            );
        }
    }

    //@+node:felix.20210127234205.10: *4* p._unlink
    /**
     * Unlink the receiver p from the tree.
     */
    public _unlink(): void {
        const p: Position = this;
        const n: number = p._childIndex;
        const parent_v: VNode = p._parentVnode()!;
        // returns None if p.v is None
        const child: VNode = p.v;
        console.assert(p.v);
        console.assert(parent_v);
        // Delete the child.
        if (
            0 <= n &&
            n < parent_v.children.length &&
            parent_v.children[n] === child // Can compare objects if same instance
        ) {
            // This is the only call to v._cutlink.
            child._cutLink(n, parent_v);
        } else {
            // console.log('n', n);
            // console.log('parent_v.children.length', parent_v.children.length);
            // console.log('parent_v.children[n]', parent_v.children[n].fileIndex);
            // console.log('child', child.fileIndex);
            this.badUnlink(parent_v, n, child);
        }
    }

    //@+node:felix.20210127234205.11: *5* p.badUnlink
    /**
     * badUnlink error trace output
     */
    public badUnlink(parent_v: VNode, n: number, child: VNode): void {
        if (0 <= n && n < parent_v.children.length) {
            g.trace(`**can not happen: children[{n}] != p.v`);
            g.trace(
                'parent_v.children...\n',
                g.listToString(parent_v.children)
            );
            g.trace('parent_v', parent_v);
            g.trace('parent_v.children[n]', parent_v.children[n]);
            g.trace('child', child);
            g.trace('** callers:', g.callers());
        } else {
            g.trace(
                `**can not happen: bad child index: ${n}, `,
                `children.length: ${parent_v.children.length}`
            );
            g.trace(
                'parent_v.children...\n',
                g.listToString(parent_v.children)
            );
            g.trace('parent_v', parent_v, 'child', child);
            g.trace('** callers:', g.callers());
        }
    }

    //@+node:felix.20210125233441.1: *3* p.moveToX
    /**
     * These routines change self to a new position "in place".
     * That is, these methods must _never_ call p.copy().
     *
     * When moving to a nonexistent position, these routines simply set p.v = None,
     * leaving the p.stack unchanged. This allows the caller to "undo" the effect of
     * the invalid move by simply restoring the previous value of p.v.
     *
     * These routines all return self on exit so the following kind of code will work:
     * after = p.copy().moveToNodeAfterTree()
     */

    //@+node:felix.20210125233441.2: *4* p.moveToBack
    /**
     * Move self to its previous sibling.
     */
    public moveToBack(): Position {
        const p: Position = this;
        const n: number = p._childIndex;
        const parent_v: VNode | undefined = p._parentVnode(); // Returns None if p.v is None.

        // Do not assume n is in range: this is used by positionExists.
        if (parent_v && p.v && 0 < n && n <= parent_v.children.length) {
            p._childIndex -= 1;
            p.v = parent_v.children[n - 1];
        } else {
            // console.log('Deleting a node??', p.h);
            // console.log('parent_v', parent_v?.h);
            // console.log('n', n);
            // console.log('parent_v.children.length', parent_v?.children.length);
            // * For now, use undefined p.v to signal null/invalid positions
            // @ts-ignore
            p.v = undefined;
        }
        return p;
    }

    //@+node:felix.20210125233441.3: *4* p.moveToFirstChild
    /**
     * Move a position to it's first child's position.
     */
    public moveToFirstChild(): Position {
        const p: Position = this;
        if (p.v && p.v.children.length) {
            p.stack.push([p.v, p._childIndex]);
            p.v = p.v.children[0];
            p._childIndex = 0;
        } else {
            // * For now, use undefined p.v to signal null/invalid positions
            // @ts-ignore
            p.v = undefined;
        }
        return p;
    }

    //@+node:felix.20210125233441.4: *4* p.moveToLastChild
    /**
     * Move a position to it's last child's position.
     */
    public moveToLastChild(): Position {
        const p: Position = this;
        let n: number;
        if (p.v && p.v.children.length) {
            p.stack.push([p.v, p._childIndex]);
            n = p.v.children.length;
            p.v = p.v.children[n - 1];
            p._childIndex = n - 1;
        } else {
            // * For now, use undefined p.v to signal null/invalid positions
            // @ts-ignore
            p.v = undefined;
        }
        return p;
    }

    //@+node:felix.20210125233441.5: *4* p.moveToLastNode
    /**
     * Move a position to last node of its tree.
     *  N.B. Returns p if p has no children.
     */
    public moveToLastNode(): Position {
        const p: Position = this;
        // Huge improvement for 4.2.
        while (p.hasChildren()) {
            p.moveToLastChild();
        }
        return p;
    }

    //@+node:felix.20210125233441.6: *4* p.moveToNext
    /**
     * Move a position to its next sibling.
     */
    public moveToNext(): Position {
        const p: Position = this;
        const n: number = p._childIndex;
        const parent_v: VNode = p._parentVnode()!;
        // Returns None if p.v is None.
        if (!p.v) {
            g.trace('no p.v:', p, g.callers());
        }
        if (p.v && parent_v && parent_v.children.length > n + 1) {
            p._childIndex = n + 1;
            p.v = parent_v.children[n + 1];
        } else {
            // * For now, use undefined p.v to signal null/invalid positions
            // @ts-ignore
            p.v = undefined;
        }
        return p;
    }

    //@+node:felix.20210125233441.7: *4* p.moveToNodeAfterTree
    /**
     * Move a position to the node after the position's tree.
     */
    public moveToNodeAfterTree(): Position {
        const p: Position = this;
        while (p.__bool__()) {
            if (p.hasNext()) {
                p.moveToNext();
                break;
            }
            p.moveToParent();
        }
        return p;
    }

    //@+node:felix.20210125233441.8: *4* p.moveToNthChild
    /**
     * Move to Nth child
     */
    public moveToNthChild(n: number): Position {
        const p: Position = this;
        if (p.v && p.v.children.length > n) {
            p.stack.push([p.v, p._childIndex]);
            p.v = p.v.children[n];
            p._childIndex = n;
        } else {
            // * For now, use undefined p.v to signal null/invalid positions
            // @ts-ignore
            p.v = undefined;
        }
        return p;
    }

    //@+node:felix.20210125233441.9: *4* p.moveToParent
    /**
     * Move a position to its parent position.
     */
    public moveToParent(): Position {
        const p: Position = this;
        if (p.v && p.stack.length) {
            const item: StackEntry = p.stack.pop()!;
            p.v = item[0];
            p._childIndex = item[1];
        } else {
            // * For now, use undefined p.v to signal null/invalid positions
            // @ts-ignore
            p.v = undefined;
        }
        return p;
    }

    //@+node:felix.20210125233441.10: *4* p.moveToThreadBack
    /**
     * Move a position to it's threadBack position.
     */
    public moveToThreadBack(): Position {
        const p: Position = this;
        if (p.hasBack()) {
            p.moveToBack();
            p.moveToLastNode();
        } else {
            p.moveToParent();
        }
        return p;
    }

    //@+node:felix.20210125233441.11: *4* p.moveToThreadNext
    /**
     * Move a position to threadNext position.
     */
    public moveToThreadNext(): Position {
        const p: Position = this;
        if (p.v) {
            if (p.v.children.length) {
                p.moveToFirstChild();
            } else if (p.hasNext()) {
                p.moveToNext();
            } else {
                p.moveToParent();
                while (p.__bool__()) {
                    if (p.hasNext()) {
                        p.moveToNext();
                        break; //found
                    }
                    p.moveToParent();
                    // not found.
                }
            }
        }
        return p;
    }

    //@+node:felix.20210125233441.12: *4* p.moveToVisBack & helper
    /**
     * Move a position to the position of the previous visible node.
     */
    public moveToVisBack(c: Commands): Position | undefined {
        const p: Position = this;
        const visLimit: [Position | undefined, boolean | undefined] =
            c.visLimit();
        const limit: Position | undefined = visLimit[0];
        const limitIsVisible: boolean = !!visLimit[1];

        while (p.__bool__()) {
            // Short-circuit if possible.
            const back: Position = p.back();
            if (back.__bool__() && back.hasChildren() && back.isExpanded()) {
                p.moveToThreadBack();
            } else if (back.__bool__()) {
                p.moveToBack();
            } else {
                p.moveToParent(); // Same as p.moveToThreadBack()
            }
            if (p.__bool__()) {
                if (limit && limit.__bool__()) {
                    let done: boolean;
                    let val: Position | undefined;
                    [done, val] = this.checkVisBackLimit(
                        limit,
                        limitIsVisible,
                        p
                    );
                    if (done) {
                        return val; // A position or None
                    }
                }
                if (p.isVisible(c)) {
                    return p;
                }
            }
        }
        return p;
    }

    //@+node:felix.20210125233441.13: *5* checkVisBackLimit
    /**
     * Return done, p or None
     */
    public checkVisBackLimit(
        limit: Position,
        limitIsVisible: boolean,
        p: Position
    ): [boolean, Position | undefined] {
        const c: Commands = p.v.context;
        if (limit.__eq__(p)) {
            if (limitIsVisible && p.isVisible(c)) {
                return [true, p];
            }
            return [true, undefined];
        }
        if (limit.isAncestorOf(p)) {
            return [false, undefined];
        }
        return [true, undefined];
    }

    //@+node:felix.20210125233441.14: *4* p.moveToVisNext & helper
    /**
     * Move a position to the position of the next visible node.
     */
    public moveToVisNext(c: Commands): Position | undefined {
        const p: Position = this;
        const visLimit: [Position | undefined, boolean | undefined] =
            c.visLimit();
        const limit: Position | undefined = visLimit[0];

        while (p.__bool__()) {
            if (p.hasChildren()) {
                if (p.isExpanded()) {
                    p.moveToFirstChild();
                } else {
                    p.moveToNodeAfterTree();
                }
            } else if (p.hasNext()) {
                p.moveToNext();
            } else {
                p.moveToThreadNext();
            }
            if (p.__bool__()) {
                if (
                    limit &&
                    limit.__bool__() &&
                    this.checkVisNextLimit(limit, p)
                ) {
                    return undefined;
                }
                if (p.isVisible(c)) {
                    return p;
                }
            }
        }
        return p;
    }

    //@+node:felix.20210125233441.15: *5* checkVisNextLimit
    /**
     * Return True is p is outside limit of visible nodes.
     */
    public checkVisNextLimit(limit: Position, p: Position): boolean {
        return !limit.__eq__(p) && !limit.isAncestorOf(p);
    }

    //@+node:felix.20210125233441.16: *4* p.safeMoveToThreadNext
    /**
     * Move a position to threadNext position.
     * Issue an error if any vnode is an ancestor of itself.
     */
    public safeMoveToThreadNext(): Position {
        const p: Position = this;
        if (p.v) {
            const child_v: VNode | false =
                !!p.v.children.length && p.v.children[0];
            if (child_v) {
                let brokeFor: boolean = false;
                for (let parent of p.self_and_parents(false)) {
                    if (child_v.fileIndex === parent.v.fileIndex) {
                        g.error(`vnode: ${child_v} is its own parent`);
                        // Allocating a new vnode would be difficult.
                        // Just remove child_v from parent.v.children.
                        parent.v.children = [];
                        for (let v2 of parent.v.children) {
                            if (v2.fileIndex !== child_v.fileIndex) {
                                parent.v.children.push(v2);
                            }
                        }
                        if (child_v.parents.includes(parent.v)) {
                            // child_v.parents.remove(parent.v);
                            const index = child_v.parents.indexOf(parent.v);
                            if (index > -1) {
                                child_v.parents.splice(index, 1);
                            }
                        }
                        // Try not to hang.
                        p.moveToParent();
                        brokeFor = true;
                        break;
                    } else if (child_v.fileIndex === parent.v.fileIndex) {
                        g.error(
                            `duplicate gnx: ${child_v.fileIndex} ` +
                            `v: ${child_v} parent: ${parent.v}`
                        );
                        child_v.fileIndex =
                            g.app.nodeIndices!.getNewIndex(child_v);
                        console.assert(child_v.gnx !== parent.v.gnx);
                        // Should be ok to continue.
                        p.moveToFirstChild();
                        brokeFor = true;
                        break;
                    }
                }
                if (!brokeFor) {
                    //  for else
                    p.moveToFirstChild();
                }
            } else if (p.hasNext()) {
                p.moveToNext();
            } else {
                p.moveToParent();
                while (p.__bool__()) {
                    if (p.hasNext()) {
                        p.moveToNext();
                        break; // found
                    }
                    p.moveToParent();
                    // not found.
                }
            }
        }
        return p;
    }

    //@+node:felix.20210126001920.1: *3* p.Moving, Inserting, Deleting, Cloning, Sorting
    //@+node:felix.20210126001920.2: *4* p.clone
    /**
     * Create a clone of back.
     * Returns the newly created position.
     */
    public clone(): Position {
        const p: Position = this;
        const p2: Position = p.copy(); // Do *not* copy the VNode!
        p2._linkAfter(p); // This should "just work"
        return p2;
    }

    //@+node:felix.20210102035859.1: *4* p.copy
    /**
     * Return an independent copy of a position.
     */
    public copy(): Position {
        return new Position(this.v, this._childIndex, this.stack);
    }

    //@+node:felix.20230521190938.1: *4* p.copyTreeAfter, copyTreeTo
    // These used by unit tests, by the group_operations plugin,
    // and by the files-compare-leo-files command.

    // To do: use v.copyTree instead.

    /**
     * Copy p and insert it after itself.
     */
    public copyTreeAfter(copyGnxs = false): Position {
        const p: Position = this;
        const p2 = p.insertAfter();
        p.copyTreeFromSelfTo(p2, copyGnxs = copyGnxs);
        return p2;
    }

    public copyTreeFromSelfTo(p2: Position, copyGnxs = false): void {
        const p: Position = this;
        p2.v._headString = g.toUnicode(p.h, undefined, true);  // 2017/01/24
        p2.v._bodyString = g.toUnicode(p.b, undefined, true);  // 2017/01/24
        //
        // #1019794: p.copyTreeFromSelfTo, should deepcopy p.v.u.
        try {
            p2.v.u = JSON.parse(JSON.stringify(p.v.u));
        } catch (e) {
            p2.v.u = {};
        }
        // p2.v.u = copy.deepcopy(p.v.u);
        if (copyGnxs) {
            p2.v.fileIndex = p.v.fileIndex;
        }
        // 2009/10/02: no need to copy arg to iter

        for (const child of p.children()) {
            const child2 = p2.insertAsLastChild();
            child.copyTreeFromSelfTo(child2, copyGnxs);
        }
    }
    //@+node:felix.20211026001924.1: *4* p.copyWithNewVnodes
    /**
     * Return an **unlinked** copy of p with a new vnode v.
     * The new vnode is complete copy of v and all its descendants.
     */
    public copyWithNewVnodes(copyMarked?: boolean): Position {
        const p: Position = this;
        return new Position(p.v.copyTree(!!copyMarked));
    }

    //@+node:felix.20210126001920.4: *4* p.deleteAllChildren
    /**
     * Delete all children of the receiver and set p.dirty().
     */
    public deleteAllChildren(): void {
        const p: Position = this;
        p.setDirty(); // Mark @file nodes dirty!
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
    }

    //@+node:felix.20210126001920.5: *4* p.doDelete
    /**
     * Deletes position p from the outline.
     *
     * This is the main delete routine.
     * It deletes the receiver's entire tree from the screen.
     * Because of the undo command we never actually delete vnodes.
     */
    public doDelete(newNode?: Position): void {
        const p: Position = this;
        p.setDirty(); // Mark @file nodes dirty!
        const sib = p.copy();
        while (sib.hasNext()) {
            sib.moveToNext();
            if (!!newNode && sib.__eq__(newNode)) {
                // Adjust newNode._childIndex if newNode is a following sibling of p.
                newNode._childIndex -= 1;
                break;
            }
        }
        p._unlink();
    }

    //@+node:felix.20210126001920.6: *4* p.insertAfter
    /**
     * Inserts a new position after self.
     * Returns the newly created position.
     */
    public insertAfter(): Position {
        const p: Position = this;
        const context: Commands = p.v.context;
        const p2: Position = this.copy();
        p2.v = new VNode(context);
        p2.v.iconVal = 0;
        p2._linkAfter(p);
        return p2;
    }

    //@+node:felix.20210126001920.7: *4* p.insertAsLastChild
    /**
     * Inserts a new VNode as the last child of self.
     * Returns the newly created position.
     */
    public insertAsLastChild(): Position {
        const p: Position = this;
        const n: number = p.numberOfChildren();
        return p.insertAsNthChild(n);
    }

    //@+node:felix.20210126001920.8: *4* p.insertAsNthChild
    /**
     * Inserts a new node as the the nth child of self.
     * self must have at least n-1 children.
     * Returns the newly created position.
     */
    public insertAsNthChild(n: number): Position {
        const p: Position = this;
        const context: Commands = p.v.context;
        const p2: Position = this.copy();
        p2.v = new VNode(context);
        p2.v.iconVal = 0;
        p2._linkAsNthChild(p, n);
        return p2;
    }

    //@+node:felix.20210126001920.9: *4* p.insertBefore
    /**
     * Inserts a new position before self.
     * Returns the newly created position.
     */
    public insertBefore(): Position {
        let p: Position = this;
        const parent: Position = p.parent();
        let back: Position;
        if (p.hasBack()) {
            back = p.getBack();
            p = back.insertAfter();
        } else if (parent.__bool__()) {
            p = parent.insertAsNthChild(0);
        } else {
            p = p.insertAfter();
            p.moveToRoot();
        }
        return p;
    }

    //@+node:felix.20210126001920.10: *4* p.invalidOutline
    /**
     * Prints out error message about invalid outline
     */
    public invalidOutline(message: string): void {
        const p: Position = this;
        let node: Position;
        if (p.hasParent()) {
            node = p.parent();
        } else {
            node = p;
        }
        p.v.context.alert(`invalid outline: ${message}\n${node}`);
    }

    //@+node:felix.20210126001920.11: *4* p.moveAfter
    /**
     * Move a position after position a.
     */
    public moveAfter(a: Position): Position {
        const p: Position = this; // Do NOT copy the position!
        a._adjustPositionBeforeUnlink(p);
        p._unlink();
        p._linkAfter(a);
        return p;
    }

    //@+node:felix.20210126001920.12: *4* p.moveToFirst/LastChildOf
    /**
     * Move a position to the first child of parent.
     */
    public moveToFirstChildOf(parent: Position): Position {
        const p: Position = this; // Do NOT copy the position!
        return p.moveToNthChildOf(parent, 0); // Major bug fix: 2011/12/04
    }

    /**
     * Move a position to the last child of parent.
     */
    public moveToLastChildOf(parent: Position): Position {
        const p: Position = this; // Do NOT copy the position!
        let n: number = parent.numberOfChildren();
        if (p.parent().__eq__(parent)) {
            n -= 1; // 2011/12/10: Another bug fix.
        }
        return p.moveToNthChildOf(parent, n); // Major bug fix: 2011/12/04
    }

    //@+node:felix.20210126001920.13: *4* p.moveToNthChildOf
    /**
     * Move a position to the nth child of parent.
     */
    public moveToNthChildOf(parent: Position, n: number): Position {
        const p: Position = this; // Do NOT copy the position!
        parent._adjustPositionBeforeUnlink(p);
        p._unlink();
        p._linkAsNthChild(parent, n);
        return p;
    }

    //@+node:felix.20210126001920.14: *4* p.moveToRoot (changed)
    /**
     * Move self to the root position.
     */
    public moveToRoot(): Position {
        const p: Position = this; //  Do NOT copy the position!
        // #1631. The old root can not possibly be affected by unlinking p.
        p._unlink();
        p._linkAsRoot();
        return p;
    }

    //@+node:felix.20210126001920.15: *4* p.promote
    /**
     * A low-level promote helper.
     */
    public promote(): void {
        const p: Position = this; //  Do NOT copy the position.
        const parent_v: VNode = p._parentVnode()!;
        const children: VNode[] = p.v.children;
        // Add the children to parent_v's children.
        const n: number = p.childIndex() + 1;
        const z: VNode[] = [...parent_v.children];
        parent_v.children = z.slice(0, n);
        parent_v.children.push(...children);
        parent_v.children.push(...z.slice(n));
        // Remove v's children.
        p.v.children = [];
        // Adjust the parent links in the moved children.
        // There is no need to adjust descendant links.
        for (let child of children) {
            // child.parents.remove(p.v);
            const index = child.parents.indexOf(p.v);
            if (index > -1) {
                child.parents.splice(index, 1);
            }
            child.parents.push(parent_v);
        }
    }

    //@+node:felix.20210126001920.16: *4* p.validateOutlineWithParent
    /**
     * This routine checks the structure of the receiver's tree.
     */
    public validateOutlineWithParent(pv: Position | undefined): boolean {
        const p: Position = this;
        let result: boolean = true; // optimists get only unpleasant surprises.
        const parent: Position = p.getParent();
        const childIndex: number = p._childIndex;
        //@+<< validate parent ivar >>
        //@+node:felix.20210126001920.17: *5* << validate parent ivar >>
        if (pv && !parent.__eq__(pv)) {
            p.invalidOutline('Invalid parent link: ' + JSON.stringify(parent));
        }
        //@-<< validate parent ivar >>
        //@+<< validate childIndex ivar >>
        //@+node:felix.20210126001920.18: *5* << validate childIndex ivar >>
        if (pv && pv.__bool__()) {
            if (childIndex < 0) {
                p.invalidOutline('missing childIndex' + childIndex);
            } else if (childIndex >= pv.numberOfChildren()) {
                p.invalidOutline(
                    'missing children entry for index: ' + childIndex
                );
            }
        } else if (childIndex < 0) {
            p.invalidOutline('negative childIndex' + childIndex);
        }
        //@-<< validate childIndex ivar >>
        //@+<< validate x ivar >>
        //@+node:felix.20210126001920.19: *5* << validate x ivar >>
        if (!p.v && pv && pv.__bool__()) {
            this.invalidOutline('Empty t');
        }
        //@-<< validate x ivar >>
        // Recursively validate all the children.
        for (let child of p.children()) {
            const r: boolean = child.validateOutlineWithParent(p);
            if (!r) {
                result = false;
            }
        }
        return result;
    }

    //@+node:felix.20210206014421.1: *3* p.Properties
    //@+node:felix.20210206014421.2: *4* p.b property
    /**
     * position body string property
     */
    public get b(): string {
        const p: Position = this;
        return p.bodyString();
    }

    /**
     * Set the body text of a position.
     *
     * **Warning: the p.b = whatever is *expensive* because it calls
     * c.setBodyString().
     *
     * Usually, code *should* use this setter, despite its cost, because it
     * update's Leo's outline pane properly. Calling c.redraw() is *not*
     * enough.
     *
     * This performance gotcha becomes important for repetitive commands, like
     * cff, replace-all and recursive import. In such situations, code should
     * use p.v.b instead of p.b.
     */
    public set b(val: string) {
        const p: Position = this;
        const c: Commands | false = !!p.v && p.v.context;
        if (c) {
            c.setBodyString(p, val);
            // Warning: c.setBodyString is *expensive*.
        }
    }

    //@+node:felix.20210206014421.3: *4* p.h property
    /**
     * position property returning the headline string
     */
    public get h(): string {
        const p: Position = this;
        return p.headString();
    }

    /**
     * Set the headline text of a position.
     *
     * **Warning: the p.h = whatever is *expensive* because it calls
     * c.setHeadString().
     *
     * Usually, code *should* use this setter, despite its cost, because it
     * update's Leo's outline pane properly. Calling c.redraw() is *not*
     * enough.
     *
     * This performance gotcha becomes important for repetitive commands, like
     * cff, replace-all and recursive import. In such situations, code should
     * use p.v.h instead of p.h.
     */
    public set h(val: string) {
        const p: Position = this;
        const c: Commands | false = !!p.v && p.v.context;
        if (c) {
            c.setHeadString(p, val);
            // Warning: c.setHeadString is *expensive*.
        }
    }

    //@+node:felix.20210206014421.4: *4* p.gnx property
    /**
     * position gnx property
     */
    public get gnx(): string {
        const p: Position = this;
        return p.v.fileIndex;
    }

    //@+node:felix.20210206014421.5: *4* p.script property
    /**
     * position property returning the script formed by p and its descendants
     */
    public get script(): Promise<string> {
        const p: Position = this;
        return g.getScript(
            p.v.context,
            p,
            false, //  Always return the entire expansion.
            true, // forcePythonSentinels
            false
        ); // useSentinels
    }

    //@+node:felix.20210206014421.6: *4* p.nosentinels property
    /**
     * position property returning the body text without sentinels
     */
    public get nosentinels(): string {
        const p: Position = this;
        return g
            .splitLines(p.b)
            .filter((z) => !g.isDirective(z))
            .join('');
    }

    //@+node:felix.20210206014421.7: *4* p.u Property
    /**
     * p.u property
     */
    public get u(): any {
        const p: Position = this;
        return p.v.u;
    }

    public set u(val: any) {
        const p: Position = this;
        p.v.u = val;
    }

    //@+node:felix.20210207005040.1: *3* p.Setters
    //@+node:felix.20210207005040.2: *4* p.VNode proxies
    //@+node:felix.20210207005040.3: *5* p.contract/expand/isExpanded
    /**
     * Contract p.v and clear p.v.expandedPositions list.
     */
    public contract(): void {
        const p: Position = this;
        const v: VNode = this.v;
        v.expandedPositions = v.expandedPositions.filter((z) => !z.__eq__(p));
        v.contract();
    }

    public expand(): void {
        const p: Position = this;
        const v: VNode = this.v;
        v.expandedPositions = v.expandedPositions.filter((z) => !z.__eq__(p));
        let isBreak: boolean = false;
        for (let p2 of v.expandedPositions) {
            if (p.__eq__(p2)) {
                isBreak = true;
                break;
            }
        }
        if (!isBreak) {
            v.expandedPositions.push(p.copy());
        }
        v.expand();
    }

    public isExpanded(): boolean {
        const p: Position = this;
        if (p.isCloned()) {
            const c: Commands = p.v.context;
            return c.shouldBeExpanded(p);
        }
        return p.v.isExpanded();
    }

    //@+node:felix.20210207005040.4: *5* p.Status bits
    // Clone bits are no longer used.
    // Dirty bits are handled carefully by the position class.

    public clearMarked(): void {
        return this.v.clearMarked();
    }

    public clearOrphan(): void {
        return this.v.clearOrphan();
    }

    public clearVisited(): void {
        return this.v.clearVisited();
    }

    public initExpandedBit(): void {
        return this.v.initExpandedBit();
    }

    public initMarkedBit(): void {
        return this.v.initMarkedBit();
    }

    public initStatus(status: number): void {
        return this.v.initStatus(status);
    }

    public setMarked(): void {
        return this.v.setMarked();
    }

    public setOrphan(): void {
        return this.v.setOrphan();
    }

    public setSelected(): void {
        return this.v.setSelected();
    }

    public setVisited(): void {
        return this.v.setVisited();
    }

    //@+node:felix.20210207005040.5: *5* p.computeIcon & p.setIcon
    public computeIcon(): number {
        return this.v.computeIcon();
    }

    public setIcon(): void {
        // Compatibility routine for old scripts
    }

    //@+node:felix.20210207005040.6: *5* p.setSelection
    public setSelection(start: number, length: number): void {
        return this.v.setSelection(start, length);
    }

    //@+node:felix.20210207005040.7: *5* p.restore/saveCursorAndScroll
    public restoreCursorAndScroll(): void {
        this.v.restoreCursorAndScroll();
    }

    public saveCursorAndScroll(): void {
        this.v.saveCursorAndScroll();
    }

    //@+node:felix.20210207005040.8: *4* p.setBodyString & setHeadString
    public setBodyString(s: string): void {
        const p: Position = this;
        return p.v.setBodyString(s);
    }

    public initHeadString(s: string): void {
        const p: Position = this;
        p.v.initHeadString(s);
    }

    public setHeadString(s: string): void {
        const p: Position = this;
        p.v.initHeadString(s);
        p.setDirty();
    }

    //@+node:felix.20210207005040.9: *4* p.Visited bits
    //@+node:felix.20210207005040.10: *5* p.clearVisitedInTree
    // Compatibility routine for scripts.

    public clearVisitedInTree(): void {
        for (let p of this.self_and_subtree(false)) {
            p.clearVisited();
        }
    }

    //@+node:felix.20210207005040.11: *5* p.clearAllVisitedInTree
    public clearAllVisitedInTree(): void {
        for (let p of this.self_and_subtree(false)) {
            p.v.clearVisited();
            p.v.clearWriteBit();
        }
    }

    //@+node:felix.20210207005040.12: *4* p.Dirty bits
    //@+node:felix.20210207005040.13: *5* p.clearDirty
    /**
     * (p) Set p.v dirty.
     */
    public clearDirty(): void {
        const p: Position = this;
        p.v.clearDirty();
    }

    //@+node:felix.20210207005040.14: *5* p.inAtIgnoreRange
    /**
     * Returns True if position p or one of p's parents is an @ignore node.
     */
    public inAtIgnoreRange(): boolean {
        const p1: Position = this;
        for (let p of p1.self_and_parents(false)) {
            if (p.isAtIgnoreNode()) {
                return true;
            }
        }
        return false;
    }

    //@+node:felix.20210207005040.15: *5* p.setAllAncestorAtFileNodesDirty
    /**
     * Set all ancestor @<file> nodes dirty, including ancestors of all clones of p.
     */
    public setAllAncestorAtFileNodesDirty(): void {
        const p: Position = this;
        p.v.setAllAncestorAtFileNodesDirty();
    }

    //@+node:felix.20210207005040.16: *5* p.setDirty
    /**
     * Mark a node and all ancestor @file nodes dirty.
     * p.setDirty() is no longer expensive.
     */
    public setDirty(): void {
        const p: Position = this;
        p.v.setAllAncestorAtFileNodesDirty();
        p.v.setDirty();
    }

    //@+node:felix.20210208001026.1: *3* p.Predicates
    //@+node:felix.20210208001026.2: *4* p.is_at_all & is_at_all_tree
    /**
     * Return True if p.b contains an @all directive.
     */
    public is_at_all(): boolean {
        const p: Position = this;
        return (
            p.isAnyAtFileNode() &&
            !!g.splitLines(p.b).reduce((acc, s): boolean => {
                if (g.match_word(s, 0, '@all')) {
                    return true;
                } else {
                    return !!acc;
                }
            }, false)
            // any([g.match_word(s, 0, '@all') for s in g.splitLines(p.b)])
        );
    }

    /**
     * Return True if p or one of p's ancestors is an @all node.
     */
    public in_at_all_tree(): boolean {
        const p1: Position = this;
        for (let p of p1.self_and_parents(false)) {
            if (p.is_at_all()) {
                return true;
            }
        }
        return false;
    }

    //@+node:felix.20210208001026.3: *4* p.is_at_ignore & in_at_ignore_tree
    /**
     * Return True if p is an @ignore node.
     */
    public is_at_ignore(): boolean {
        const p: Position = this;
        return g.match_word(p.h, 0, '@ignore');
    }

    /**
     * Return True if p or one of p's ancestors is an @ignore node
     */
    public in_at_ignore_tree(): boolean {
        const p1: Position = this;
        for (let p of p1.self_and_parents(false)) {
            if (g.match_word(p.h, 0, '@ignore')) {
                return true;
            }
        }
        return false;
    }

    //@-others
}

// Aliases for Position members
export interface Position {
    back: () => Position;
    firstChild: () => Position;
    lastChild: () => Position;
    lastNode: () => Position;
    next: () => Position;
    nodeAfterTree: () => Position;
    nthChild: (n: number) => Position;
    children_iter: () => Generator<Position>;
    following_siblings_iter: () => Generator<Position>;
    vnodes_iter: () => Generator<VNode>;
    parent: () => Position;
    parents_iter: () => Generator<Position>;
    self_and_parents_iter: () => Generator<Position>;
    self_and_siblings_iter: () => Generator<Position>;
    self_and_subtree_iter: () => Generator<Position>;
    subtree_iter: () => Generator<Position>;
    unique_vnodes_iter: () => Generator<VNode>;
    subtree_with_unique_vnodes_iter: () => Generator<Position>;
    threadBack: () => Position;
    threadNext: () => Position;
    visBack: (c: Commands) => Position | undefined;
    visNext: (c: Commands) => Position | undefined;
    hasVisBack: (c: Commands) => Position | undefined;
    hasVisNext: (c: Commands) => Position | undefined;
    hasFirstChild: () => boolean;
    atNoSentFileNodeName: () => string;
    atAsisFileNodeName: () => string;
    isAtNoSentFileNode: () => boolean;
    isAtAsisFileNode: () => boolean;
    __repr__: () => number;
    simpleLevel: () => number;

    initBodyString: (s: string) => void;
    setTnodeText: (s: string) => void;
    scriptSetBodyString: (s: string) => void;
}

Position.prototype.back = Position.prototype.getBack;
Position.prototype.firstChild = Position.prototype.getFirstChild;
Position.prototype.lastChild = Position.prototype.getLastChild;
Position.prototype.lastNode = Position.prototype.getLastNode;
// Position.prototype.lastVisible = Position.prototype.getLastVisible # New in 4.2 (was in tk tree code).;
Position.prototype.next = Position.prototype.getNext;
Position.prototype.nodeAfterTree = Position.prototype.getNodeAfterTree;
Position.prototype.nthChild = Position.prototype.getNthChild;
Position.prototype.children_iter = Position.prototype.children;
Position.prototype.following_siblings_iter =
    Position.prototype.following_siblings;
Position.prototype.vnodes_iter = Position.prototype.nodes;
Position.prototype.parent = Position.prototype.getParent;
Position.prototype.parents_iter = Position.prototype.parents;
Position.prototype.self_and_parents_iter = Position.prototype.self_and_parents;
Position.prototype.self_and_siblings_iter =
    Position.prototype.self_and_siblings;
Position.prototype.self_and_subtree_iter = Position.prototype.self_and_subtree;
Position.prototype.subtree_iter = Position.prototype.subtree;
Position.prototype.unique_vnodes_iter = Position.prototype.unique_nodes;
Position.prototype.subtree_with_unique_vnodes_iter =
    Position.prototype.unique_subtree;
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
Position.prototype.atNoSentFileNodeName =
    Position.prototype.atNoSentinelsFileNodeName;
Position.prototype.atAsisFileNodeName = Position.prototype.atSilentFileNodeName;

Position.prototype.isAtNoSentFileNode =
    Position.prototype.isAtNoSentinelsFileNode;
Position.prototype.isAtAsisFileNode = Position.prototype.isAtSilentFileNode;
Position.prototype.__repr__ = Position.prototype.valueOf;
Position.prototype.simpleLevel = Position.prototype.level;

Position.prototype.initBodyString = Position.prototype.setBodyString;
Position.prototype.setTnodeText = Position.prototype.setBodyString;
Position.prototype.scriptSetBodyString = Position.prototype.setBodyString;

//@+node:felix.20210102150654.1: ** Enum StatusFlags
export enum StatusFlags {
    // Define the meaning of status bits in new vnodes.
    // Archived...
    clonedBit = 0x01, // True: VNode has clone mark.
    // unused      0x02,
    expandedBit = 0x04, // True: VNode is expanded.
    markedBit = 0x08, // True: VNode is marked
    // unused    = 0x10, // (was orphanBit)
    selectedBit = 0x20, // True: VNode is current VNode.
    topBit = 0x40, // True: VNode was top VNode when saved.
    // Not archived...
    richTextBit = 0x080, // Determines whether we use <bt> or <btr> tags.
    visitedBit = 0x100,
    dirtyBit = 0x200,
    writeBit = 0x400,
    orphanBit = 0x800, // True: error in @<file> tree prevented it from being written.
}

//@+node:felix.20210102015917.1: ** class VNode
/**
 * VNode class.
 */
export class VNode {
    // ? OVERLAP WITH <v> ELEMENTS
    // The native attributes of <v> elements are a, t, vtag, tnodeList,
    // marks, expanded, and descendentTnode/VnodeUnknownAttributes.
    tnodeList?: any[];

    // * The primary data: headline and body text.
    _headString: string;
    _bodyString: string;

    // * used by undoer
    _p_changed: boolean;
    undo_info: Bead | undefined;

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
    context: Commands;
    expandedPositions: Position[]; // Positions that should be expanded.

    // * Cursor location, text selection and scrolling information
    insertSpot: number; // Location of previous insert point.
    scrollBarSpot: number; // Previous value of scrollbar position.
    selectionLength: number; // The length of the selected body text.
    selectionStart: number; // The start of the selected body text.

    public unknownAttributes: undefined | { [key: string]: any };
    public tempAttributes: undefined | { [key: string]: any };
    public at_read: undefined | { [key: string]: any };
    unicode_warning_given: boolean = false;

    //@+others
    //@+node:felix.20210130233340.1: *3* v.Birth & death
    //@+node:felix.20210102015917.2: *4* constructor
    constructor(context: Commands, gnx?: string) {
        this._headString = 'newHeadline';
        this._bodyString = '';
        this._p_changed = false;
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

    //@+node:felix.20210130233340.3: *4* v.__repr__ & v.__str__
    public __repr__(): string {
        return `<VNode ${this.gnx} ${this.headString()}>`;
    }
    public valueOf(): string {
        return this.__repr__();
    }

    //@+node:felix.20210130233340.4: *4* v.dump
    public dumpLink(link: string): string {
        return link ? link : '<none>';
    }

    public dump(label: string = ''): void {
        const v: VNode = this;
        const s: string = '-'.repeat(10);
        console.log(`${s} ${label} ${v}`);
        // console.log(`gnx: ${v.gnx}`);
        console.log(`parents.length: ${v.parents.length}`);
        console.log(`children.length: ${v.children.length}`);
        console.log(`parents: ${g.listToString(v.parents)}`);
        console.log(`children: ${g.listToString(v.children)}`);
    }

    //@+node:felix.20211209010457.1: *3* v.toString
    public toString(): string {
        return `VNode (gnx: ${this.gnx})`;
    };
    //@+node:felix.20210112210731.1: *3* v.Comparisons
    //@+node:felix.20210112210731.2: *4* v.findAtFileName
    /**
     * Return the name following one of the names in nameList or "".
     */
    public findAtFileName(names: string[], h?: string): string {
        // Allow h argument for unit testing.
        if (!h) {
            h = this.headString();
        }
        if (!g.match(h, 0, '@')) {
            return '';
        }
        const i: number = g.skip_id(h, 1, '-');
        const word: string = h.substring(0, i);
        if (names.includes(word) && g.match_word(h, 0, word)) {
            const name = h.substring(i).trim();
            return name;
        }
        return '';
    }

    //@+node:felix.20210112210731.3: *4* v.anyAtFileNodeName
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

    //@+node:felix.20210112210731.4: *4* v.at...FileNodeName
    // These return the filename following @xxx, in v.headString.
    // Return the the empty string if v is not an @xxx node.

    public atAutoNodeName(h?: string): string {
        // return this.findAtFileName(this.atAutoNames, h);
        return this.findAtFileName(g.app.atAutoNames, h);
    }

    // Retain this special case as part of the "escape hatch".
    // That is, we fall back on code in leoRst.py if no
    // importer or writer for reStructuredText exists.

    public atAutoRstNodeName(h?: string): string {
        const names: string[] = ['@auto-rst'];
        return this.findAtFileName(names, h);
    }

    public atCleanNodeName(): string {
        const names: string[] = ['@clean'];
        return this.findAtFileName(names);
    }

    public atEditNodeName(): string {
        const names: string[] = ['@edit'];
        return this.findAtFileName(names);
    }

    public atFileNodeName(): string {
        const names: string[] = ['@file', '@thin'];
        // Fix #403.
        return this.findAtFileName(names);
    }

    public atNoSentinelsFileNodeName(): string {
        const names: string[] = ['@nosent', '@file-nosent'];
        return this.findAtFileName(names);
    }

    public atRstFileNodeName(): string {
        const names: string[] = ['@rst'];
        return this.findAtFileName(names);
    }

    public atShadowFileNodeName(): string {
        const names: string[] = ['@shadow'];
        return this.findAtFileName(names);
    }

    public atSilentFileNodeName(): string {
        const names: string[] = ['@asis', '@file-asis'];
        return this.findAtFileName(names);
    }

    public atThinFileNodeName(): string {
        const names: string[] = ['@thin', '@file-thin'];
        return this.findAtFileName(names);
    }

    //@+node:felix.20210112210731.5: *4* v.isAtAllNode
    /**
     * Returns True if the receiver contains @others in its body at the start of a line.
     */
    public isAtAllNode(): boolean {
        let [flag, i] = g.is_special(this._bodyString, '@all');
        return flag;
    }

    //@+node:felix.20210112210731.6: *4* v.isAnyAtFileNode
    /**
     * Return True if v is any kind of @file or related node.
     */
    public isAnyAtFileNode(): boolean {
        // This routine should be as fast as possible.
        // It is called once for every VNode when writing a file.
        const h: string = this.headString();
        return !!h && h.substring(0, 1) === '@' && !!this.anyAtFileNodeName();
    }

    //@+node:felix.20210112210731.7: *4* v.isAt...FileNode
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

    //@+node:felix.20210112210731.8: *4* v.isAtIgnoreNode
    /**
     * Returns True if:
     * - the vnode' body contains @ignore at the start of a line or
     * - the vnode's headline starts with @ignore.
     */
    public isAtIgnoreNode(): boolean {
        if (g.match_word(this._headString, 0, '@ignore')) {
            return true;
        }
        let [flag, i] = g.is_special(this._bodyString, '@ignore');
        return flag;
    }

    //@+node:felix.20210112210731.9: *4* v.isAtOthersNode
    /**
     * Returns True if the receiver contains @others in its body at the start of a line.
     */
    public isAtOthersNode(): boolean {
        let [flag, i] = g.is_special(this._bodyString, '@others');
        return flag;
    }

    //@+node:felix.20210112210731.10: *4* v.matchHeadline
    /**
     * Returns True if the headline matches the pattern ignoring whitespace and case.
     * The headline may contain characters following the successfully matched pattern.
     */
    public matchHeadline(pattern: string): boolean {
        const v: VNode = this;
        let h: string = g.toUnicode(v.headString());
        h = h.toLowerCase().split(' ').join('').split('\t').join('');
        // equivalent to h = h.lstrip('.')
        // 2013/04/05. Allow leading period before section names.
        while (h.charAt(0) === '.') {
            h = h.substring(1);
        }
        pattern = g.toUnicode(pattern);
        pattern = pattern
            .toLowerCase()
            .split(' ')
            .join('')
            .split('\t')
            .join('');
        return h.startsWith(pattern);
    }

    //@+node:felix.20210207195152.1: *3* v.copyTree
    /**
     * Return an all-new tree of vnodes that are copies of self and all its
     * descendants.
     *
     * **Important**: the v.parents ivar must be [] for all nodes.
     * v._addParentLinks will set all parents.
     */
    public copyTree(copyMarked?: boolean): VNode {
        const v: VNode = this;
        // Allocate a new vnode and gnx with empty children & parents.
        const v2: VNode = new VNode(v.context);
        console.assert(v2.parents.length === 0, v2.parents.length.toString());
        console.assert(v2.gnx);
        console.assert(v.gnx !== v2.gnx);
        // Copy vnode fields. Do **not** set v2.parents.
        v2._headString = g.toUnicode(v._headString, null, true);
        v2._bodyString = g.toUnicode(v._bodyString, null, true);
        v2.u = JSON.parse(JSON.stringify(v.u)); // Deep Copy
        if (copyMarked && v.isMarked()) {
            v2.setMarked();
        }
        // Recursively copy all descendant vnodes.
        for (let child of v.children) {
            v2.children.push(child.copyTree(copyMarked));
        }
        return v2;
    }

    //@+node:felix.20210102234910.1: *3* v.Getters
    //@+node:felix.20210102234915.1: *4* v.bodyString
    public bodyString(): string {
        return this._bodyString;
    }

    //@+node:felix.20210102235015.1: *4* v.Children
    //@+node:felix.20210103000631.1: *5* v.firstChild
    /**
     * Returns the first child or undefined if no children
     */
    public firstChild(): VNode | undefined {
        if (this.children.length) {
            return this.children[0];
        }
        return undefined;
    }

    //@+node:felix.20210103003546.1: *5* v.hasChildren
    public hasChildren(): boolean {
        return !!this.children.length;
    }

    //@+node:felix.20210103003705.1: *5* v.lastChild
    /**
     * Returns the last child or undefined if no children
     */
    public lastChild(): VNode | undefined {
        if (this.children.length) {
            return this.children[this.children.length - 1];
        }
        return undefined;
    }

    //@+node:felix.20210103010323.1: *5* v.nthChild
    /**
     * childIndex and nthChild are zero-based.
     */
    public nthChild(n: number): VNode | undefined {
        if (0 <= n && n < this.children.length) {
            return this.children[n];
        }
        return undefined;
    }

    //@+node:felix.20210103010327.1: *5* v.numberOfChildren
    public numberOfChildren(): number {
        return this.children.length;
    }

    //@+node:felix.20210103011425.1: *4* v.directParents
    /**
     * (New in 4.2) Return a list of all direct parent vnodes of a VNode.
     * This is NOT the same as the list of ancestors of the VNode.
     */
    public directParents(): VNode[] {
        return this.parents;
    }

    //@+node:felix.20210103011621.1: *4* v.hasBody
    /**
     * Return True if this VNode contains body text.
     */
    public hasBody(): boolean {
        return !!this._bodyString && this._bodyString.length > 0;
    }

    //@+node:felix.20210103013608.1: *4* v.headString
    /**
     * Return the headline string.
     */
    public headString(): string {
        return this._headString;
    }

    //@+node:felix.20210103023444.1: *4* v.cleanHeadString
    /**
     * Return the headline string. Same as headString.
     */
    public cleanHeadString(): string {
        return this._headString;
    }

    //@+node:felix.20210103013802.1: *4* v.isNthChildOf
    /**
     * Return True if v is the n'th child of parent_v.
     */
    public isNthChildOf(n: number, parent_v: VNode): boolean {
        const children: VNode[] | undefined = parent_v
            ? parent_v.children
            : undefined;
        return (
            !!children &&
            0 <= n &&
            n < children.length &&
            children[n].fileIndex === this.fileIndex
        );
    }

    //@+node:felix.20210103013805.1: *4* v.Status Bits
    //@+node:felix.20210103013805.2: *5* v.isCloned
    public isCloned(): boolean {
        return this.parents.length > 1;
    }

    //@+node:felix.20210103013805.3: *5* v.isDirty
    public isDirty(): boolean {
        return (this.statusBits & StatusFlags.dirtyBit) !== 0;
    }

    //@+node:felix.20210103013805.4: *5* v.isMarked
    public isMarked(): boolean {
        return (this.statusBits & StatusFlags.markedBit) !== 0;
    }

    //@+node:felix.20210103013805.5: *5* v.isOrphan
    public isOrphan(): boolean {
        return (this.statusBits & StatusFlags.orphanBit) !== 0;
    }

    //@+node:felix.20210103013805.6: *5* v.isSelected
    public isSelected(): boolean {
        return (this.statusBits & StatusFlags.selectedBit) !== 0;
    }

    //@+node:felix.20210103013805.7: *5* v.isTopBitSet
    public isTopBitSet(): boolean {
        return (this.statusBits & StatusFlags.topBit) !== 0;
    }

    //@+node:felix.20210103013805.8: *5* v.isVisited
    public isVisited(): boolean {
        return (this.statusBits & StatusFlags.visitedBit) !== 0;
    }

    //@+node:felix.20210103013805.9: *5* v.isWriteBit
    public isWriteBit(): boolean {
        return (this.statusBits & StatusFlags.writeBit) !== 0;
    }

    //@+node:felix.20210103013805.10: *5* v.status
    public status(): number {
        return this.statusBits;
    }

    //@+node:felix.20210115195450.1: *3* v.Setters
    //@+node:felix.20210115195450.2: *4*  v.Dirty bits
    //@+node:felix.20210115195450.3: *5* v.clearDirty
    /**
     * Clear the vnode dirty bit.
     */
    public clearDirty(): void {
        this.statusBits &= ~StatusFlags.dirtyBit;
    }

    //@+node:felix.20210115195450.4: *5* v.setDirty
    /**
     * Set the vnode dirty bit.
     * This method is fast, but dangerous. Unlike p.setDirty, this method does
     * not call v.setAllAncestorAtFileNodesDirty.
     */
    public setDirty(): void {
        this.statusBits |= StatusFlags.dirtyBit;
    }

    //@+node:felix.20210115195450.5: *4*  v.Status bits
    //@+node:felix.20210115195450.6: *5* v.clearClonedBit
    public clearClonedBit(): void {
        this.statusBits &= ~StatusFlags.clonedBit;
    }

    //@+node:felix.20210115195450.7: *5* v.clearMarked
    public clearMarked(): void {
        this.statusBits &= ~StatusFlags.markedBit;
    }

    //@+node:felix.20210115195450.8: *5* v.clearWriteBit
    public clearWriteBit(): void {
        this.statusBits &= ~StatusFlags.writeBit;
    }

    //@+node:felix.20210115195450.9: *5* v.clearOrphan
    public clearOrphan(): void {
        this.statusBits &= ~StatusFlags.orphanBit;
    }

    //@+node:felix.20210115195450.10: *5* v.clearVisited
    public clearVisited(): void {
        this.statusBits &= ~StatusFlags.visitedBit;
    }

    //@+node:felix.20210115195450.11: *5* v.contract/expand/initExpandedBit/isExpanded
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

    //@+node:felix.20210115195450.12: *5* v.initStatus
    public initStatus(status: number): void {
        this.statusBits = status;
    }

    //@+node:felix.20210115195450.13: *5* v.setClonedBit & initClonedBit
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

    //@+node:felix.20210115195450.14: *5* v.setMarked & initMarkedBit
    public setMarked(): void {
        this.statusBits |= StatusFlags.markedBit;
    }

    public initMarkedBit(): void {
        this.statusBits |= StatusFlags.markedBit;
    }

    //@+node:felix.20210115195450.15: *5* v.setOrphan
    /**
     * Set the vnode's orphan bit.
     */
    public setOrphan(): void {
        this.statusBits |= StatusFlags.orphanBit;
    }

    //@+node:felix.20210115195450.16: *5* v.setSelected
    /**
     * This only sets the selected bit.
     */
    public setSelected(): void {
        this.statusBits |= StatusFlags.selectedBit;
    }

    //@+node:felix.20210115195450.17: *5* v.setVisited
    /**
     * Compatibility routine for scripts
     */
    public setVisited(): void {
        this.statusBits |= StatusFlags.visitedBit;
    }

    //@+node:felix.20210115195450.18: *5* v.setWriteBit
    public setWriteBit(): void {
        this.statusBits |= StatusFlags.writeBit;
    }

    //@+node:felix.20210207213301.1: *4* v.childrenModified
    public childrenModified(): void {
        g.childrenModifiedSet.push(this);
    }

    //@+node:felix.20210115195450.19: *4* v.computeIcon & setIcon
    public computeIcon(): number {
        let val: number = 0;
        const v: VNode = this;
        if (v.hasBody()) {
            val += 1;
        }
        if (v.isMarked()) {
            val += 2;
        }
        if (v.isCloned()) {
            val += 4;
        }
        if (v.isDirty()) {
            val += 8;
        }
        return val;
    }

    public setIcon(): void {
        //  pass # Compatibility routine for old scripts
    }

    //@+node:felix.20210207213314.1: *4* v.contentModified
    public contentModified(): void {
        g.contentModifiedSet.push(this);
    }

    //@+node:felix.20210207213328.1: *4* v.restoreCursorAndScroll
    // Called only by LeoTree.selectHelper.

    /**
     * Restore the cursor position and scroll so it is visible.
     */
    public restoreCursorAndScroll(): void {

        const traceTime: boolean = false && !g.unitTesting;
        const v: VNode = this;
        let ins: number = v.insertSpot;
        // start, n = v.selectionStart, v.selectionLength
        const spot: number = v.scrollBarSpot;
        const body: NullBody = this.context.frame.body;
        const w: any = body.wrapper;
        // Fix bug 981849: incorrect body content shown.
        if (ins === undefined) {
            ins = 0;
        }
        // This is very expensive for large text.
        let t1: [number, number];
        if (traceTime) {
            t1 = process.hrtime();
        }
        if (body.wrapper.setInsertPoint && body.wrapper.setInsertPoint !== undefined) {
            w.setInsertPoint(ins);
        }
        if (traceTime) {
            const delta_t: number = utils.getDurationSeconds(t1!); //  time.time() - t1;
            if (delta_t > 0.1) {
                g.trace(`${delta_t} sec`);
            }
        }
        // Override any changes to the scrollbar setting that might
        // have been done above by w.setSelectionRange or w.setInsertPoint.
        if (spot !== undefined) {
            w.setYScrollPosition(spot);
            v.scrollBarSpot = spot;
        }
        // Never call w.see here.

    }

    //@+node:felix.20210115195450.20: *4* v.saveCursorAndScroll
    /**
     * Conserve cursor and scroll positions
     * from the UI into this vnode's
     * insertSpot and scrollBarSpot
     */
    public saveCursorAndScroll(): void {

        const v: VNode = this;
        const c: any = v.context;

        const w = c.frame.body;
        if (!w) {
            return;
        }
        try {
            v.scrollBarSpot = w.getYScrollPosition();
            v.insertSpot = w.getInsertPoint();
        }
        catch (attributeError) {
            // 2011/03/21: w may not support the high-level interface.
            // pass
        }
    }

    //@+node:felix.20210115195450.21: *4* v.setBodyString & v.setHeadString
    public setBodyString(s: string): void {
        const v: VNode = this;
        if (typeof s === 'string') {
            v._bodyString = s;
            return;
        }

        try {
            v._bodyString = g.toUnicode(s, null, true);
        } catch (exception) {
            if (!this.unicode_warning_given) {
                this.unicode_warning_given = true;
                g.error(s);
                g.es_exception(exception);
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
        v._headString = s.split('\n').join('');
        // self.contentModified()  # #1413.
    }

    //@+node:felix.20210115195450.22: *4* v.setSelection
    public setSelection(start: number, length: number): void {
        const v: VNode = this;
        v.selectionStart = start;
        v.selectionLength = length;
    }

    //@+node:felix.20210116003530.1: *3* v.setAllAncestorAtFileNodesDirty & helpers
    /**
     * Original idea by Bитaлиje Mилoшeвић (Vitalije Milosevic).
     * Modified by EKR.
     * Translated by Félix Malboeuf
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

    //@+node:felix.20210116003538.1: *3* v.Inserting & cloning
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

    //@+node:felix.20210117025748.1: *3* v.Low level methods
    //@+node:felix.20210117025748.2: *4* v._addCopiedLink
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

    //@+node:felix.20210117025748.3: *4* v._addLink & _addParentLinks
    /**
     * Adjust links after adding a link to v.
     */
    public _addLink(childIndex: number, parent_v: VNode): void {
        const v: VNode = this;
        v.context.frame.tree.generation += 1;
        // Update parent_v.children & v.parents.
        parent_v.children.splice(childIndex, 0, v);
        v.parents.push(parent_v);

        // Set zodb changed flags.
        v._p_changed = true;
        parent_v._p_changed = true;

        if (v.parents.length === 1) {
            // Adjust the parents links in the descendant tree.
            // This handles clones properly when undoing a delete.
            for (let child of v.children) {
                child._addParentLinks(v);
            }
        }
    }

    //@+node:felix.20210117025748.4: *5* v._addParentLinks
    /**
     * Used by addLink to adjust parent links in the descendant tree
     */
    public _addParentLinks(parent: VNode): void {
        const v: VNode = this;
        v.parents.push(parent);
        if (v.parents.length === 1) {
            for (let child of v.children) {
                child._addParentLinks(v);
            }
        }
    }

    //@+node:felix.20210117025748.5: *4* v._cutLink & _cutParentLinks
    /**
     * Adjust links after cutting a link to v.
     */
    public _cutLink(childIndex: number, parent_v: VNode): void {
        const v: VNode = this;
        v.context.frame.tree.generation += 1;
        parent_v.childrenModified();
        console.assert(parent_v.children[childIndex].fileIndex === v.fileIndex);

        parent_v.children.splice(childIndex, 1);
        if (v.parents.includes(parent_v)) {
            try {
                for (let i = 0; i < v.parents.length; i++) {
                    if (v.parents[i].fileIndex === parent_v.fileIndex) {
                        v.parents.splice(i, 1);
                        break;
                    }
                }
            } catch (ValueError) {
                g.error(parent_v + ' not in parents of ' + v);
                g.trace('v.parents:');
                g.printObj(v.parents);
            }
        }

        v._p_changed = true;
        parent_v._p_changed = true;

        if (!v.parents.length) {
            // Adjust the parents links in the descendant tree.
            // This handles clones properly when deleting a tree.
            for (let child of v.children) {
                child._cutParentLinks(v);
            }
        }
    }

    //@+node:felix.20210117025748.6: *5* v._cutParentLinks
    /**
     * Used by cutLink to adjust parent links in the descendant tree
     */
    public _cutParentLinks(parent: VNode): void {
        const v: VNode = this;

        for (let i = 0; i < v.parents.length; i++) {
            if (v.parents[i].fileIndex === parent.fileIndex) {
                v.parents.splice(i, 1);
                break;
            }
        }

        if (!v.parents.length) {
            // Adjust the parents links in the descendant tree.
            // This handles clones properly when deleting a tree.
            for (let child of v.children) {
                child._cutParentLinks(v);
            }
        }
    }

    //@+node:felix.20210117025748.7: *4* v._deleteAllChildren
    /**
     * Delete all children of self.
     * This is a low-level method, used by the read code.
     * It is not intended as a general replacement for p.doDelete().
     */
    public _deleteAllChildren(): void {
        const v: VNode = this;
        for (let v2 of v.children) {
            try {
                for (let i = 0; i < v2.parents.length; i++) {
                    if (v2.parents[i].fileIndex === v.fileIndex) {
                        v2.parents.splice(i, 1);
                        break;
                    }
                }
            } catch (ValueError) {
                g.error(v + ' not in parents of ' + v2);
                g.trace('v2.parents:');
                g.printObj(v2.parents);
            }
        }
        v.children = [];
    }

    //@+node:felix.20210117025748.8: *4* v._linkAsNthChild
    /**
     * Links self as the n'th child of VNode pv
     */
    public _linkAsNthChild(parent_v: VNode, n: number): void {
        const v: VNode = this; // The child node.
        v._addLink(n, parent_v);
    }

    //@+node:felix.20210117160548.1: *3* v.Properties
    //@+node:felix.20210117160548.2: *4* v.b Property
    /**
     * VNode body string property
     */
    public get b(): string {
        const v: VNode = this;
        return v.bodyString();
    }

    public set b(val: string) {
        const v: VNode = this;
        v.setBodyString(val);
    }

    //@+node:felix.20210117160548.3: *4* v.h property
    /**
     * VNode headline string property
     */
    public get h(): string {
        const v: VNode = this;
        return v.headString();
    }

    public set h(val: string) {
        const v: VNode = this;
        v.setHeadString(val);
    }

    //@+node:felix.20210117160548.4: *4* v.u Property
    /**
     * VNode u property
     */
    public get u(): { [key: string]: any } {
        const v: VNode = this;
        if (!v.unknownAttributes) {
            v.unknownAttributes = {};
        }
        return v.unknownAttributes;
    }

    public set u(val: { [key: string]: any }) {
        const v: VNode = this;
        if (val === undefined || val === null) {
            v.unknownAttributes = undefined;
        } else if (typeof val === 'object') {
            v.unknownAttributes = val;
        } else {
            throw new Error('unknownAttributes ValueError');
        }
    }

    //@+node:felix.20210117160548.5: *4* v.gnx Property
    /**
     * VNode gnx property
     */
    public get gnx() {
        const v: VNode = this;
        return v.fileIndex;
    }

    //@-others
}

// Aliases for VNode members
export interface VNode {
    atNoSentFileNodeName: () => string;
    atAsisFileNodeName: () => string;
    isAtNoSentFileNode: () => boolean;
    isAtAsisFileNode: () => boolean;
    initBodyString: (s: string) => void;
    initHeadString: (s: string) => void;
    setHeadText: (s: string) => void;
    setTnodeText: (s: string) => void;
    __str__: () => string;
}

// New names, less confusing

VNode.prototype.atNoSentFileNodeName =
    VNode.prototype.atNoSentinelsFileNodeName;
VNode.prototype.atAsisFileNodeName = VNode.prototype.atSilentFileNodeName;
VNode.prototype.isAtNoSentFileNode = VNode.prototype.isAtNoSentinelsFileNode;
VNode.prototype.isAtAsisFileNode = VNode.prototype.isAtSilentFileNode;
VNode.prototype.initBodyString = VNode.prototype.setBodyString;
VNode.prototype.setHeadText = VNode.prototype.setHeadString;
VNode.prototype.initHeadString = VNode.prototype.setHeadString;
VNode.prototype.setTnodeText = VNode.prototype.setBodyString;
VNode.prototype.__str__ = VNode.prototype.toString;

//@-others
//@@language typescript
//@@tabwidth -4

//@-leo
