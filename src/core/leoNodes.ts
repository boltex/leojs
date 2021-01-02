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

/**
 * * Closes any body pane opened in this vscode window instance
 */
export class VNode {

    constructor() {
        //
    }


}

