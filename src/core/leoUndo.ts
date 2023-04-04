//@+leo-ver=5-thin
//@+node:felix.20211026230613.1: * @file src/core/leoUndo.ts
// * Leo's undo/redo manager.
//@+<< How Leo implements unlimited undo >>
//@+node:felix.20211026230613.2: ** << How Leo implements unlimited undo >>
//@+at
// Think of the actions that may be Undone or Redone as a string of beads
// (g.Bunches) containing all information needed to undo _and_ redo an operation.
//
// A bead pointer points to the present bead. Undoing an operation moves the bead
// pointer backwards; redoing an operation moves the bead pointer forwards. The
// bead pointer points in front of the first bead when Undo is disabled. The bead
// pointer points at the last bead when Redo is disabled.
//
// The Undo command uses the present bead to undo the action, then moves the bead
// pointer backwards. The Redo command uses the bead after the present bead to redo
// the action, then moves the bead pointer forwards. The list of beads does not
// branch; all undoable operations (except the Undo and Redo commands themselves)
// delete any beads following the newly created bead.
//
// New in Leo 4.3: User (client) code should call u.beforeX and u.afterX methods to
// create a bead describing the operation that is being performed. (By convention,
// the code sets u = c.undoer for undoable operations.) Most u.beforeX methods
// return 'undoData' that the client code merely passes to the corresponding
// u.afterX method. This data contains the 'before' snapshot. The u.afterX methods
// then create a bead containing both the 'before' and 'after' snapshots.
//
// New in Leo 4.3: u.beforeChangeGroup and u.afterChangeGroup allow multiple calls
// to u.beforeX and u.afterX methods to be treated as a single undoable entry. See
// the code for the Replace All, Sort, Promote and Demote commands for examples.
// u.before/afterChangeGroup substantially reduce the number of u.before/afterX
// methods needed.
//
// New in Leo 4.3: It would be possible for plugins or other code to define their
// own u.before/afterX methods. Indeed, u.afterX merely needs to set the
// bunch.undoHelper and bunch.redoHelper ivars to the methods used to undo and redo
// the operation. See the code for the various u.before/afterX methods for
// guidance.
//
// I first saw this model of unlimited undo in the documentation for Apple's Yellow Box classes.
//
//@-<< How Leo implements unlimited undo >>
//@+<< imports >>
//@+node:felix.20220104010834.1: ** << imports >>
import * as g from './leoGlobals';
import { new_cmd_decorator } from "../core/decorators";
import { Position, VNode } from './leoNodes';
import { Commands } from './leoCommands';
import { ChapterController } from './leoChapters';
import { StringTextWrapper } from './leoFrame';
//@-<< imports >>
//@+others
//@+node:felix.20211028004540.1: ** Interfaces
export interface Bead {
    [key: string]: any;
}

interface TreeData extends Array<VNode | any | any> { 0: VNode; 1: any; }
//@+node:felix.20211026230613.3: ** u.cmd (decorator)
/**
 * Command decorator for the Undoer class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'undoer']);
}
//@+node:felix.20211026230613.4: ** class Undoer
/**
 * A class that implements unlimited undo and redo.
 */
export class Undoer {

    public c: Commands;
    public p: Position | undefined;
    public granularity!: string; // Set in reloadSettings.
    public max_undo_stack_size: number;

    // State ivars...
    public beads: Bead[] = []; // List of undo nodes.
    public bead: number = -1; // Index of the present bead: -1:len(beads)
    public undoType: string = "Can't Undo";
    public groupCount: number = 0;
    // These must be set here, _not_ in clearUndoState.
    public redoMenuLabel: string = "Can't Redo";
    public undoMenuLabel: string = "Can't Undo";
    public realRedoMenuLabel: string = "Can't Redo";
    public realUndoMenuLabel: string = "Can't Undo";
    public undoing: boolean = false; // True if executing an Undo command.
    public redoing: boolean = false; // True if executing a Redo command.
    public per_node_undo: boolean = false; // True: v may contain undo_info ivar.
    // New in 4.2...
    public optionalIvars: string[] = [];
    // Set the following ivars to keep pylint happy.
    public afterTree!: { v: VNode; head: string; body: string; }[];
    public beforeTree!: { v: VNode; head: string; body: string; }[];
    public children!: VNode[];
    public deleteMarkedNodesData!: Position[];
    public followingSibs!: VNode[];
    public headlines!: { [key: string]: [string, string | undefined] };
    public inHead!: boolean;
    public kind!: string;
    public newBack!: Position;
    public newBody!: string;
    public newChildren!: VNode[];
    public newHead!: string;
    public newIns!: number;
    public newMarked!: boolean;
    public newN!: number;
    public newP!: Position;
    public newParent!: Position;
    public newParent_v!: VNode;
    public newSel!: number[];
    public newTree!: TreeData[];
    public newYScroll!: number;
    public oldBack!: Position;
    public oldBody!: string;
    public oldChildren!: VNode[];
    public oldHead!: string;
    public oldIns!: number;
    public oldMarked!: boolean;
    public oldN!: number;
    public oldParent!: Position;
    public oldParent_v!: VNode;
    public oldSel!: number[];
    public oldTree!: TreeData[];
    public oldYScroll!: number;
    public pasteAsClone!: boolean;
    public prevSel!: number[];
    public sortChildren!: boolean;
    public verboseUndoGroup!: boolean;

    //@+others
    //@+node:felix.20211026230613.5: *3* u.Birth
    //@+node:felix.20211026230613.6: *4* u.__init__
    constructor(c: Commands) {
        this.c = c;
        this.granularity = "";  // Set in reloadSettings.
        this.max_undo_stack_size = c.config.getInt('max-undo-stack-size') || 0;

        this.reloadSettings();
    }
    //@+node:felix.20211026230613.7: *4* u.reloadSettings
    /**
     * Undoer.reloadSettings.
     */
    public reloadSettings() {
        const c: Commands = this.c;
        this.granularity = c.config.getString('undo-granularity');
        if (this.granularity) {
            this.granularity = this.granularity.toLowerCase();
        }
        if (!['node', 'line', 'word', 'char'].includes(this.granularity)) {
            this.granularity = 'line';
        }
    }
    //@+node:felix.20211026230613.8: *3* u.Internal helpers
    //@+node:felix.20211026230613.9: *4* u.clearOptionalIvars
    public clearOptionalIvars(): void {
        const u: Undoer = this;
        u.p = undefined;  // The position/node being operated upon for undo and redo.

        // for(let ivar in u.optionalIvars){
        //     delete u.optionalIvars[ivar];
        //     // ivar = undefined;
        // }
        u.optionalIvars.splice(0, u.optionalIvars.length);
    }
    //@+node:felix.20211026230613.10: *4* u.cutStack
    public cutStack(): void {
        const u: Undoer = this;
        const n: number = u.max_undo_stack_size;
        if ((u.bead >= n) && (n > 0) && !g.unitTesting) {
            // Do nothing if we are in the middle of creating a group.
            let i = u.beads.length - 1;
            while (i >= 0) {
                const bunch: Bead = u.beads[i];
                if (bunch.kind && bunch.kind === 'beforeGroup') {
                    return;
                }
                i -= 1;
            }
            // This work regardless of how many items appear after bead n.
            // g.trace('Cutting undo stack to %d entries' % (n))
            u.beads = u.beads.slice(-n);
            u.bead = n - 1;
        }

        if (g.app.debug.includes('undo') && g.app.debug.includes('verbose')) {
            console.log(`u.cutStack: ${u.beads.length}`);
        }
    }
    //@+node:felix.20211026230613.11: *4* u.dumpBead
    public dumpBead(n: number): string {
        const u: Undoer = this;

        if (n < 0 || n >= u.beads.length) {
            return 'no bead: n = ' + n;
        }
        // bunch = u.beads[n]
        const result: string[] = [];
        result.push('-'.repeat(10));
        result.push(`u.beads.length: ${u.beads.length}, n: ${n}`);

        for (let ivar of ['kind', 'newP', 'newN', 'p', 'oldN', 'undoHelper']) {
            // @ts-expect-error
            result.push(`${ivar} = ${u[ivar]}`);
        }
        return result.join('\n');
    }

    public dumpTopBead(): string {
        const u: Undoer = this;
        const n: number = u.beads.length;

        if (n > 0) {
            return this.dumpBead(n - 1);
        }
        return '<no top bead>';
    }
    //@+node:felix.20211026230613.12: *4* u.getBead
    /**
     * Set Undoer ivars from the bunch at the top of the undo stack.
     */
    public getBead(n: number): Bead | undefined {
        const u: Undoer = this;
        if (n < 0 || n >= u.beads.length) {
            return undefined;
        }
        const bunch = u.beads[n];
        u.setIvarsFromBunch(bunch);
        if (g.app.debug.includes('undo')) {
            console.log(` u.getBead: ${n} of ${u.beads.length}`);
        }
        return bunch;
    }
    //@+node:felix.20211026230613.13: *4* u.peekBead
    public peekBead(n: number): Bead | undefined {
        const u: Undoer = this;
        if (n < 0 || n >= u.beads.length) {
            return undefined;
        }
        return u.beads[n];
    }
    //@+node:felix.20211026230613.14: *4* u.pushBead
    public pushBead(bunch: Bead): void {
        const u: Undoer = this;
        // New in 4.4b2:  Add this to the group if it is being accumulated.
        let bunch2: Bead | boolean = u.bead >= 0 && u.bead < u.beads.length;
        if (bunch2) {
            bunch2 = u.beads[u.bead];
        }
        if (bunch2 && (bunch2 as Bead).kind && (bunch2 as Bead).kind === 'beforeGroup') {
            // Just append the new bunch the group's items.
            (bunch2 as Bead).items.push(bunch);
        } else {
            // Push the bunch.
            u.bead += 1;

            // u.beads[u.bead:] = [bunch]
            u.beads.splice(u.bead, u.beads.length - u.bead, bunch);

            // Recalculate the menu labels.
            u.setUndoTypes();
        }
        if (g.app.debug.includes('undo')) {
            console.log(`u.pushBead: ${u.beads.length} ${bunch.undoType}`);
        }
    }
    //@+node:felix.20211026230613.15: *4* u.redoMenuName, undoMenuName
    public redoMenuName(name: string): string {
        if (name === "Can't Redo") {
            return name;
        }
        return "Redo " + name;
    }

    public undoMenuName(name: string): string {
        if (name === "Can't Undo") {
            return name;
        }
        return "Undo " + name;
    }
    //@+node:felix.20211026230613.16: *4* u.setIvarsFromBunch
    public setIvarsFromBunch(bunch: Bead): void {
        const u: Undoer = this;
        u.clearOptionalIvars();

        // TODO : for debugging/testing
        /*
        if false && !g.unitTesting:  // Debugging.
        console.log('-' * 40)
            for (let key in list(bunch.keys()))
                g.trace(f"{key:20} {bunch.get(key)!r}")
        console.log('-' * 20)
        if g.unitTesting:  // #1694: An ever-present unit test.
            val = bunch.get('oldMarked')
            assert val in (True, False), f"{val!r} {g.callers()!s}"
        */

        // bunch is not a dict, so bunch.keys() is required.
        for (let key of Object.keys(bunch)) {
            const val: any = bunch[key];
            (u as any)[key] = val;
            if (!u.optionalIvars.includes(key)) {
                u.optionalIvars.push(key);
            }
        }
    }
    //@+node:felix.20211026230613.17: *4* u.setRedoType
    // These routines update both the ivar and the menu label.

    public setRedoType(theType: any): void {
        const u: Undoer = this;
        // frame = u.c.frame;
        if (!(typeof theType === 'string' || theType instanceof String)) {
            g.trace(`oops: expected string for command, got ${theType}`);
            g.trace(g.callers());
            theType = '<unknown>';
        }
        // menu = frame.menu.getMenu("Edit")
        const name: string = u.redoMenuName(theType);
        if (name !== u.redoMenuLabel) {
            // Update menu using old name.
            // realLabel = frame.menu.getRealMenuName(name)
            // if realLabel == name:
            //     underline = -1 if g.match(name, 0, "Can't") else 0
            // else:
            //     underline = realLabel.find("&")
            // realLabel = realLabel.replace("&", "")
            // frame.menu.setMenuLabel(
            //     menu, u.realRedoMenuLabel, realLabel, underline=underline)
            u.redoMenuLabel = name;
            u.realRedoMenuLabel = name;
        }
    }
    //@+node:felix.20211026230613.18: *4* u.setUndoType
    public setUndoType(theType: any): void {
        const u: Undoer = this;
        // frame = u.c.frame

        if (!(typeof theType === 'string' || theType instanceof String)) {
            g.trace(`oops: expected string for command, got ${theType}`);
            g.trace(g.callers());
            theType = '<unknown>';
        }

        //menu = frame.menu.getMenu("Edit")
        const name: string = u.undoMenuName(theType);
        if (name !== u.undoMenuLabel) {
            // Update menu using old name.
            // realLabel = frame.menu.getRealMenuName(name)
            // if realLabel == name:
            //     underline = -1 if g.match(name, 0, "Can't") else 0
            // else:
            //     underline = realLabel.find("&")
            // realLabel = realLabel.replace("&", "")
            // frame.menu.setMenuLabel(
            //     menu, u.realUndoMenuLabel, realLabel, underline=underline)
            u.undoType = theType;
            u.undoMenuLabel = name;
            u.realUndoMenuLabel = name;
        }
    }
    //@+node:felix.20211026230613.19: *4* u.setUndoTypes
    public setUndoTypes(): void {
        const u: Undoer = this;
        // Set the undo type and undo menu label.
        let bunch: Bead | undefined = u.peekBead(u.bead);
        if (bunch) {
            u.setUndoType(bunch.undoType);
        } else {
            u.setUndoType("Can't Undo");
        }
        // Set only the redo menu label.
        bunch = u.peekBead(u.bead + 1);
        if (bunch) {
            u.setRedoType(bunch.undoType);
        } else {
            u.setRedoType("Can't Redo");
        }
        u.cutStack();
    }
    //@+node:felix.20211026230613.20: *4* u.restoreTree & helpers
    /**
     * Use the tree info to restore all VNode data, including all links.
     */
    public restoreTree(treeInfo: any[]): void {
        const u: Undoer = this;
        // This effectively relinks all vnodes.
        for (let p_tree of treeInfo) {
            u.restoreVnodeUndoInfo(p_tree[1]);
        }
    }
    //@+node:felix.20211026230613.21: *5* u.restoreVnodeUndoInfo
    /**
     * Restore all ivars saved in the bunch.
     */
    public restoreVnodeUndoInfo(bunch: Bead): void {
        const v: VNode = bunch.v;
        v.statusBits = bunch.statusBits;
        v.children = bunch.children;
        v.parents = bunch.parents;
        const uA: any = bunch.unknownAttributes;
        if (uA) {
            v.unknownAttributes = uA;
            v._p_changed = true;
        }
    }
    //@+node:felix.20211026230613.22: *5* u.restoreTnodeUndoInfo
    public restoreTnodeUndoInfo(bunch: Bead): void {
        const v: VNode = bunch.v;
        v.h = bunch.headString;
        v.b = bunch.bodyString;
        v.statusBits = bunch.statusBits;
        const uA: any = bunch.unknownAttributes;
        if (uA) {
            v.unknownAttributes = uA;
            v._p_changed = true;
        }
    }
    //@+node:felix.20211026230613.23: *4* u.saveTree & helpers
    /**
     * Return a list of tuples with all info needed to handle a general undo operation.
     */
    public saveTree(p: Position, treeInfo?: TreeData[]): TreeData[] {

        // WARNING: read this before doing anything "clever"
        //@+<< about u.saveTree >>
        //@+node:felix.20211026230613.24: *5* << about u.saveTree >>
        //@@language rest
        //@+at
        // The old code made a free-standing copy of the tree using v.copy and
        // t.copy. This looks "elegant" and is WRONG. The problem is that it can
        // not handle clones properly, especially when some clones were in the
        // "undo" tree and some were not. Moreover, it required complex
        // adjustments to t.vnodeLists.
        //
        // Instead of creating new nodes, the new code creates all information
        // needed to properly restore the vnodes and tnodes. It creates a list of
        // tuples, on tuple for each VNode in the tree. Each tuple has the form,
        //
        // (vnodeInfo, tnodeInfo)
        //
        // where vnodeInfo and tnodeInfo are dicts contain all info needed to
        // recreate the nodes. The v.createUndoInfoDict and t.createUndoInfoDict
        // methods correspond to the old v.copy and t.copy methods.
        //
        // Aside: Prior to 4.2 Leo used a scheme that was equivalent to the
        // createUndoInfoDict info, but quite a bit uglier.
        //@-<< about u.saveTree >>

        const u: Undoer = this;
        const topLevel: boolean = !treeInfo; // don't check length intended
        if (topLevel) {
            treeInfo = [];
        }
        // Add info for p.v.  Duplicate info is harmless.
        const data: TreeData = [p.v, u.createVnodeUndoInfo(p.v)];
        treeInfo!.push(data);
        // Recursively add info for the subtree.
        let child: Position = p.firstChild();
        while (child && child.__bool__()) {
            u.saveTree(child, treeInfo);
            child = child.next();
        }
        return treeInfo!;
    }
    //@+node:felix.20211026230613.25: *5* u.createVnodeUndoInfo
    /**
     * Create a bunch containing all info needed to recreate a VNode for undo.
     */
    public createVnodeUndoInfo(v: VNode): Bead {
        const bunch: Bead = {
            v: v,
            statusBits: v.statusBits,
            parents: [...v.parents],
            children: [...v.children],
        };

        if (v.unknownAttributes) {
            bunch.unknownAttributes = v.unknownAttributes;
        }
        return bunch;
    }
    //@+node:felix.20211026230613.27: *4* u.trace
    public trace(): void {
        const ivars: string[] = ['kind', 'undoType'];
        for (let ivar of ivars) {
            // TODO : test
            g.pr(ivar, (this as any)[ivar]);
        }
    }
    //@+node:felix.20211026230613.28: *4* u.updateMarks
    /**
     * Update dirty and marked bits.
     */
    public updateMarks(oldOrNew: string): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        if (!['new', 'old'].includes(oldOrNew)) {
            g.trace("can't happen");
            return;
        }
        const isOld: boolean = oldOrNew === 'old';
        const marked: boolean = isOld ? u.oldMarked : u.newMarked;
        // Note: c.set/clearMarked call a hook.
        if (marked) {
            c.setMarked(u.p!);
        } else {
            c.clearMarked(u.p!);
        }
        // Undo/redo always set changed/dirty bits because the file may have been saved.
        u.p!.setDirty();
        u.c.setChanged();
    }
    //@+node:felix.20211026230613.29: *3* u.Externally visible entries
    //@+node:felix.20211026230613.30: *4* u.afterX...
    //@+node:felix.20211026230613.31: *5* u.afterChangeBody
    /**
     * Create an undo node using d created by beforeChangeNode.
     * *Important*: Before calling this method, caller must:
     * - Set p.v.b. (Setting p.b would cause a redraw).
     * - Set the desired selection range and insert point.
     * - Set the y-scroll position, if desired.
     */
    public afterChangeBody(p: Position, command: string, bunch: Bead): void {
        const c: Commands = this.c;
        const u: Undoer = this;
        const w: StringTextWrapper = c.frame.body.wrapper;

        if (u.redoing || u.undoing) {
            return;
        }

        // Set the type & helpers.
        bunch.kind = 'body';
        bunch.undoType = command;
        bunch.undoHelper = u.undoChangeBody;
        bunch.redoHelper = u.redoChangeBody;
        bunch.newBody = p.b;
        bunch.newHead = p.h;
        bunch.newIns = w.getInsertPoint();
        bunch.newMarked = p.isMarked();

        // Careful: don't use ternary operator.
        if (w && w.getSelectionRange) {
            bunch.newSel = w.getSelectionRange();
        } else {
            bunch.newSel = [0, 0];
        }

        // bunch.newYScroll = w.getYScrollPosition() if w else 0
        u.pushBead(bunch);
        //
        if (g.unitTesting) {
            // assert command.lower() !== 'typing', g.callers()
        } else if (command.toLowerCase() === 'typing') {
            g.trace(
                'Error: undoType should not be "Typing"\n' +
                'Call u.doTyping instead');
        }
        u.updateAfterTyping(p, w);
    }
    //@+node:felix.20211026230613.32: *5* u.afterChangeGroup
    /**
     * Create an undo node for general tree operations using d created by
     * beforeChangeGroup
     */
    public afterChangeGroup(
        p: Position,
        undoType: string
    ): void {
        const u: Undoer = this;
        const c: Commands = this.c;

        const w: StringTextWrapper = c.frame.body.wrapper;

        if (u.redoing || u.undoing) {
            return;
        }

        const bunch = u.beads[u.bead];
        if (!u.beads.length) {
            g.trace('oops: empty undo stack.');
            return;
        }

        if (bunch.kind === 'beforeGroup') {
            bunch.kind = 'afterGroup';
        } else {
            g.trace("oops: expecting beforeGroup, got ${bunch.kind}");
        }
        // Set the types & helpers.
        bunch.kind = 'afterGroup';
        bunch.undoType = undoType;
        // Set helper only for undo:
        // The bead pointer will point to an 'beforeGroup' bead for redo.
        bunch.undoHelper = u.undoGroup;
        bunch.redoHelper = u.redoGroup;
        bunch.newP = p.copy();

        bunch.newSel = w.getSelectionRange();

        // if 0:
        //     // Push the bunch.
        //     u.bead += 1
        //     u.beads[u.bead:] = [bunch]

        // Recalculate the menu labels.
        u.setUndoTypes();
    }
    //@+node:felix.20211026230613.33: *5* u.afterChangeNodeContents
    /**
     * Create an undo node using d created by beforeChangeNode.
     */
    public afterChangeNodeContents(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        const c: Commands = this.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set the type & helpers.
        bunch.kind = 'node';
        bunch.undoType = command;
        bunch.undoHelper = u.undoNodeContents;
        bunch.redoHelper = u.redoNodeContents;
        bunch.inHead = false;  // 2013/08/26
        bunch.newBody = p.b;
        bunch.newHead = p.h;
        bunch.newMarked = p.isMarked();
        // Bug fix 2017/11/12: don't use ternary operator.
        if (w && w.getSelectionRange) {
            bunch.newSel = w.getSelectionRange();
        } else {
            bunch.newSel = [0, 0];
        }
        //bunch.newYScroll = w.getYScrollPosition() if w else 0
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.34: *5* u.afterChangeHeadline
    /**
     * Create an undo node using d created by beforeChangeHeadline.
     */
    public afterChangeHeadline(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set the type & helpers.
        bunch.kind = 'headline';
        bunch.undoType = command;
        bunch.undoHelper = u.undoChangeHeadline;
        bunch.redoHelper = u.redoChangeHeadline;
        bunch.newHead = p.h;
        u.pushBead(bunch);
    }

    // afterChangeHead = afterChangeHeadline // TODO (not used) !

    //@+node:felix.20230331230459.1: *5* u.afterChangeMultiHeadline
    /**
     * Create an undo node using d created by beforeChangeMultiHeadline.
     */
    public afterChangeMultiHeadline(command: string, bunch: Bead): void {
        const u: Undoer = this;
        const c: Commands = this.c;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set the type & helpers.
        bunch.kind = 'multipleHeadline';
        bunch.undoType = command;
        bunch.undoHelper = u.undoChangeMultiHeadline;
        bunch.redoHelper = u.redoChangeMultiHeadline;
        const oldHeadlines = bunch.headlines;
        const newHeadlines: { [key: string]: [string, string | undefined] } = {};
        for (const p of c.all_unique_positions()) {
            if (p.h !== oldHeadlines[p.gnx][0]) {
                newHeadlines[p.gnx] = [oldHeadlines[p.gnx][0], p.h];
            }
        }
        // Filtered down dict containing only the changed ones.
        bunch.headlines = newHeadlines;
        u.pushBead(bunch);
    }
    // afterChangeMultiHead = afterChangeMultiHeadline // TODO (not used) !
    //@+node:felix.20211026230613.35: *5* u.afterChangeTree
    /**
     * Create an undo node for general tree operations using d created by beforeChangeTree
     */
    public afterChangeTree(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        const c: Commands = this.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set the types & helpers.
        bunch.kind = 'tree';
        bunch.undoType = command;
        bunch.undoHelper = u.undoTree;
        bunch.redoHelper = u.redoTree;
        // Set by beforeChangeTree: changed, oldSel, oldText, oldTree, p
        bunch.newSel = w.getSelectionRange(); // [0, 0]; //
        bunch.newText = w.getAllText(); // p.b; //
        bunch.newTree = u.saveTree(p);
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.37: *5* u.afterCloneMarkedNodes
    public afterCloneMarkedNodes(p: Position): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        const bunch: Bead = u.createCommonBunch(p);
        // Sets
        // oldDirty = p.isDirty(),
        // oldMarked = p.isMarked(),
        // oldSel = w and w.getSelectionRange() or None,
        // p = p.copy(),
        // Set types & helpers
        bunch.kind = 'clone-marked-nodes';
        bunch.undoType = 'clone-marked-nodes';
        // Set helpers
        bunch.undoHelper = u.undoCloneMarkedNodes;
        bunch.redoHelper = u.redoCloneMarkedNodes;
        bunch.newP = p.next();
        bunch.newMarked = p.isMarked();
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.38: *5* u.afterCopyMarkedNodes
    public afterCopyMarkedNodes(p: Position): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        const bunch: Bead = u.createCommonBunch(p);
        // Sets
        // oldDirty = p.isDirty(),
        // oldMarked = p.isMarked(),
        // oldSel = w and w.getSelectionRange() or None,
        // p = p.copy(),
        // Set types & helpers
        bunch.kind = 'copy-marked-nodes';
        bunch.undoType = 'copy-marked-nodes';
        // Set helpers
        bunch.undoHelper = u.undoCopyMarkedNodes;
        bunch.redoHelper = u.redoCopyMarkedNodes;
        bunch.newP = p.next();
        bunch.newMarked = p.isMarked();
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.39: *5* u.afterCloneNode
    public afterCloneNode(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set types & helpers
        bunch.kind = 'clone';
        bunch.undoType = command;
        // Set helpers
        bunch.undoHelper = u.undoCloneNode;
        bunch.redoHelper = u.redoCloneNode;
        bunch.newBack = p.back();  // 6/15/05;
        bunch.newParent = p.parent();  // 6/15/05;
        bunch.newP = p.copy();
        bunch.newMarked = p.isMarked();
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.41: *5* u.afterDeleteNode
    public afterDeleteNode(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set types & helpers
        bunch.kind = 'delete';
        bunch.undoType = command;
        // Set helpers
        bunch.undoHelper = u.undoDeleteNode;
        bunch.redoHelper = u.redoDeleteNode;
        bunch.newP = p.copy();
        bunch.newMarked = p.isMarked();
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.42: *5* u.afterDeleteMarkedNodes
    public afterDeleteMarkedNodes(data: any, p: Position): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        const bunch: Bead = u.createCommonBunch(p);
        // Set types & helpers
        bunch.kind = 'delete-marked-nodes';
        bunch.undoType = 'delete-marked-nodes';
        // Set helpers
        bunch.undoHelper = u.undoDeleteMarkedNodes;
        bunch.redoHelper = u.redoDeleteMarkedNodes;
        bunch.newP = p.copy();
        bunch.deleteMarkedNodesData = data;
        bunch.newMarked = p.isMarked();
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.43: *5* u.afterDemote
    /**
     * Create an undo node for demote operations.
     */
    public afterDemote(p: Position, followingSibs: any): void {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        // Set types.
        bunch.kind = 'demote';
        bunch.undoType = 'Demote';
        bunch.undoHelper = u.undoDemote;
        bunch.redoHelper = u.redoDemote;
        bunch.followingSibs = followingSibs;
        // Push the bunch.
        u.bead += 1;

        // u.beads[u.bead:] = [bunch]
        u.beads.splice(u.bead, u.beads.length - u.bead, bunch);

        // Recalculate the menu labels.
        u.setUndoTypes();
    }
    //@+node:felix.20211026230613.45: *5* u.afterInsertNode
    public afterInsertNode(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set types & helpers
        bunch.kind = 'insert';
        bunch.undoType = command;
        // Set helpers
        bunch.undoHelper = u.undoInsertNode;
        bunch.redoHelper = u.redoInsertNode;
        bunch.newP = p.copy();
        bunch.newBack = p.back();
        bunch.newParent = p.parent();
        bunch.newMarked = p.isMarked();
        let beforeTree: Bead[];
        if (bunch.pasteAsClone) {
            beforeTree = bunch.beforeTree;
            const afterTree: { v: VNode; head: string; body: string; }[] = [];
            for (let bunch2 of beforeTree) {
                const v: VNode = bunch2.v;
                afterTree.push(
                    { v: v, head: v.h.slice(0), body: v.b.slice(0) }
                );
            }
            bunch.afterTree = afterTree;
        }
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.46: *5* u.afterMark
    /**
     * Create an undo node for mark and unmark commands.
     */
    public afterMark(p: Position, command: string, bunch: Bead): void {
        // 'command' unused, but present for compatibility with similar methods.
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set the type & helpers.
        bunch.undoHelper = u.undoMark;
        bunch.redoHelper = u.redoMark;
        bunch.newMarked = p.isMarked();
        u.pushBead(bunch);

    }
    //@+node:felix.20211026230613.47: *5* u.afterMoveNode
    public afterMoveNode(p: Position, command: string, bunch: Bead): void {
        const u: Undoer = this;
        if (u.redoing || u.undoing) {
            return;
        }
        // Set the types & helpers.
        bunch.kind = 'move';
        bunch.undoType = command;
        // Set helper only for undo:
        // The bead pointer will point to an 'beforeGroup' bead for redo.
        bunch.undoHelper = u.undoMove;
        bunch.redoHelper = u.redoMove;
        bunch.newMarked = p.isMarked();
        bunch.newN = p.childIndex();
        bunch.newParent_v = p._parentVnode();
        bunch.newP = p.copy();
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.48: *5* u.afterPromote
    /**
     * Create an undo node for demote operations.
     */
    public afterPromote(p: Position, children: any): void {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        // Set types.
        bunch.kind = 'promote';
        bunch.undoType = 'Promote';
        bunch.undoHelper = u.undoPromote;
        bunch.redoHelper = u.redoPromote;
        bunch.children = children;
        // Push the bunch.
        u.bead += 1;

        // u.beads[u.bead:] = [bunch]
        u.beads.splice(u.bead, u.beads.length - u.bead, bunch);

        // Recalculate the menu labels.
        u.setUndoTypes();
    }
    //@+node:felix.20211026230613.49: *5* u.afterSort
    /**
     * Create an undo node for sort operations
     */
    public afterSort(p: Position, bunch: Bead): void {
        const u: Undoer = this;
        // c = this.c
        if (u.redoing || u.undoing) {
            return;
        }
        // Recalculate the menu labels.
        u.setUndoTypes();
    }
    //@+node:felix.20211026230613.50: *4* u.beforeX...
    //@+node:felix.20211026230613.51: *5* u.beforeChangeBody
    /**
     * Return data that gets passed to afterChangeBody.
     */
    public beforeChangeBody(p: Position): Bead {
        const w: any = this.c.frame.body.wrapper;
        const bunch: Bead = this.createCommonBunch(p);
        // Sets u.oldMarked, u.oldSel, u.p
        bunch.oldBody = p.b;
        bunch.oldHead = p.h;
        bunch.oldIns = (w && w.getInsertPoint) ? w.getInsertPoint() : 0;
        bunch.oldYScroll = (w && w.getYScrollPosition) ? w.getYScrollPosition() : 0;
        return bunch;
    }
    //@+node:felix.20211026230613.52: *5* u.beforeChangeGroup
    /**
     * Prepare to undo a group of undoable operations.
     */
    public beforeChangeGroup(p: Position, command: string, verboseUndoGroup = true): void {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        // Set types.
        bunch.kind = 'beforeGroup';
        bunch.undoType = command;
        bunch.verboseUndoGroup = verboseUndoGroup;
        // Set helper only for redo:
        // The bead pointer will point to an 'afterGroup' bead for undo.
        bunch.undoHelper = u.undoGroup;
        bunch.redoHelper = u.redoGroup;
        bunch.items = [];
        // Push the bunch.
        u.bead += 1;

        // u.beads[u.bead:] = [bunch]
        u.beads.splice(u.bead, u.beads.length - u.bead, bunch);
    }
    //@+node:felix.20211026230613.53: *5* u.beforeChangeHeadline
    /**
     * Return data that gets passed to afterChangeNode.
     * The oldHead kwarg works around a Qt difficulty when changing headlines.
     */
    public beforeChangeHeadline(p: Position): Bead {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        bunch.oldHead = p.h;
        return bunch;
    }

    // beforeChangeHead = beforeChangeHeadline // TODO (not used) !

    //@+node:felix.20230331230548.1: *5* u.beforeChangeMultiHeadline
    /**
     * Return data that gets passed to afterChangeMultiHeadline.
     * p is used to select position after undo/redo multiple headline changes is done
     */
    public beforeChangeMultiHeadline(p: Position): Bead {
        const u: Undoer = this;
        const c: Commands = u.c;
        const bunch: Bead = u.createCommonBunch(p);
        const headlines: { [key: string]: [string, string | undefined] } = {};
        for (const p of c.all_unique_positions()) {
            headlines[p.gnx] = [p.h, undefined];
        }
        // contains all, but will get reduced by afterChangeMultiHeadline
        bunch.headlines = headlines;
        return bunch;
    }
    // beforeChangeMultiHead = beforeChangeMultiHeadline // TODO (not used) ! 
    //@+node:felix.20211026230613.54: *5* u.beforeChangeNodeContents
    /**
     * Return data that gets passed to afterChangeNode.
     */
    public beforeChangeNodeContents(p: Position): Bead {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        const bunch: Bead = u.createCommonBunch(p);
        bunch.oldBody = p.b;
        bunch.oldHead = p.h;
        // #1413: Always restore yScroll if possible.
        bunch.oldYScroll = (w && w.getYScrollPosition) ? w.getYScrollPosition() : 0;
        return bunch;
    }
    //@+node:felix.20211026230613.55: *5* u.beforeChangeTree
    public beforeChangeTree(p: Position): Bead {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        const bunch: Bead = u.createCommonBunch(p);
        bunch.oldSel = [0, 0]; // w.getSelectionRange(); // TODO !
        bunch.oldText = p.b; //w.getAllText(); // TODO !
        bunch.oldTree = u.saveTree(p);
        return bunch;
    }
    //@+node:felix.20211026230613.57: *5* u.beforeCloneNode
    public beforeCloneNode(p: Position): Bead {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        return bunch;
    }
    //@+node:felix.20211026230613.58: *5* u.beforeDeleteNode
    public beforeDeleteNode(p: Position): Bead {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        bunch.oldBack = p.back();
        bunch.oldParent = p.parent();
        return bunch;
    }
    //@+node:felix.20211026230613.59: *5* u.beforeInsertNode
    public beforeInsertNode(p: Position, pasteAsClone: boolean = false, copiedBunchList?: Bead[]): Bead {
        const u: Undoer = this;
        if (!copiedBunchList) {
            copiedBunchList = [];
        }
        const bunch: Bead = u.createCommonBunch(p);
        bunch.pasteAsClone = pasteAsClone;
        if (pasteAsClone) {
            // Save the list of bunched.
            bunch.beforeTree = copiedBunchList;
        }
        return bunch;
    }
    //@+node:felix.20211026230613.60: *5* u.beforeMark
    public beforeMark(p: Position, command: string): Bead {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        bunch.kind = 'mark';
        bunch.undoType = command;
        return bunch;
    }
    //@+node:felix.20211026230613.61: *5* u.beforeMoveNode
    public beforeMoveNode(p: Position): Bead {
        const u: Undoer = this;
        const bunch: Bead = u.createCommonBunch(p);
        bunch.oldN = p.childIndex();
        bunch.oldParent_v = p._parentVnode();
        return bunch;
    }
    //@+node:felix.20211026230613.62: *5* u.beforeSort
    /**
     * Create an undo node for sort operations.
     */
    public beforeSort(
        p: Position,
        undoType: string,
        oldChildren: VNode[],
        newChildren: VNode[],
        sortChildren: boolean
    ): Bead {
        const u: Undoer = this;
        let bunch: Bead;
        if (sortChildren) {
            bunch = u.createCommonBunch(p.parent());
        } else {
            bunch = u.createCommonBunch(p);
        }
        // Set types.
        bunch.kind = 'sort';
        bunch.undoType = undoType;
        bunch.undoHelper = u.undoSort;
        bunch.redoHelper = u.redoSort;
        bunch.oldChildren = oldChildren;
        bunch.newChildren = newChildren;
        bunch.sortChildren = sortChildren;  // A bool
        // Push the bunch.
        u.bead += 1;
        // u.beads[u.bead:] = [bunch]
        u.beads.splice(u.bead, u.beads.length - u.bead, bunch);
        return bunch;
    }
    //@+node:felix.20211026230613.63: *5* u.createCommonBunch
    /**
     * Return a bunch containing all common undo info.
     * This is mostly the info for recreating an empty node at position p.
     */
    public createCommonBunch(p: Position): Bead {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        return {
            oldMarked: p && p.__bool__() && p.isMarked(),
            oldSel: w && w.getSelectionRange && w.getSelectionRange() || undefined,
            p: p && p.__bool__() && p.copy() // && makes sure the copy ends up in p.
        };
    }
    //@+node:felix.20211026230613.64: *4* u.canRedo & canUndo
    // Translation does not affect these routines.

    public canRedo(): boolean {
        const u: Undoer = this;
        return u.redoMenuLabel !== "Can't Redo";
    }

    public canUndo(): boolean {
        const u: Undoer = this;
        return u.undoMenuLabel !== "Can't Undo";
    }
    //@+node:felix.20211026230613.65: *4* u.clearUndoState
    /**
     * Clears then entire Undo state.
     * All non-undoable commands should call this method.
     */
    public clearUndoState(): void {
        const u: Undoer = this;
        u.clearOptionalIvars();  // Do this first.
        u.setRedoType("Can't Redo");
        u.setUndoType("Can't Undo");
        u.beads = [];  // List of undo nodes.
        u.bead = -1;  // Index of the present bead: -1:len(beads)
    }
    //@+node:felix.20211026230613.76: *4* u.enableMenuItems
    public enableMenuItems(): void {
        // ! UNUSED
        // const u:Undoer = this;
        // frame = u.c.frame
        // menu = frame.menu.getMenu("Edit")
        // if menu:
        //     frame.menu.enableMenu(menu, u.redoMenuLabel, u.canRedo())
        //     frame.menu.enableMenu(menu, u.undoMenuLabel, u.canUndo())
    }
    //@+node:felix.20211026230613.77: *4* u.onSelect & helpers
    public onSelect(old_p: Position, p: Position): void {
        const u: Undoer = this;
        if (u.per_node_undo) {
            if (old_p && old_p.__bool__() && u.beads.length) {
                u.putIvarsToVnode(old_p);
            }
            u.setIvarsFromVnode(p);
            u.setUndoTypes();
        }
    }
    //@+node:felix.20211026230613.78: *5* u.putIvarsToVnode
    public putIvarsToVnode(p: Position): void {
        const u: Undoer = this;
        const v: VNode = p.v;
        console.assert(this.per_node_undo);

        const bunch: Bead = {};
        for (let key of this.optionalIvars) {
            bunch[key] = (u as any)[key];
        }
        // Put these ivars by hand.
        for (let key of ['bead', 'beads', 'undoType']) {
            bunch[key] = (u as any)[key];
        }
        v.undo_info = bunch;
    }
    //@+node:felix.20211026230613.79: *5* u.setIvarsFromVnode
    public setIvarsFromVnode(p: Position): void {
        const u: Undoer = this;
        const v: VNode = p.v;

        console.assert(this.per_node_undo);
        u.clearUndoState();
        if (v['undo_info'] || v['undo_info'] === 0) {
            u.setIvarsFromBunch(v.undo_info);
        }
    }
    //@+node:felix.20211026230613.80: *4* u.updateAfterTyping
    /**
     * Perform all update tasks after changing body text.
     * This is ugly, ad-hoc code, but should be done uniformly.
     */
    public updateAfterTyping(p: Position, w: any): void {
        const c: Commands = this.c;

        if (g.isTextWrapper(w)) {
            // An important, ever-present unit test.
            const all: string = w.getAllText();
            if (g.unitTesting) {
                // assert p.b == all, (w, g.callers())
            } else if (p.b !== all) {
                g.trace(
                    `\np.b != w.getAllText() p: ${p.h} \n` +
                    `w: ${w} \n${g.callers()}\n`);
                // g.printObj(g.splitLines(p.b), tag='p.b')
                // g.printObj(g.splitLines(all), tag='getAllText')
            }

            p.v.insertSpot = w.getInsertPoint();
            const ins: number = p.v.insertSpot;
            // From u.doTyping.
            const newSel: number[] = w.getSelectionRange();
            if (newSel === undefined) {
                p.v.selectionStart = ins;
                p.v.selectionLength = 0;
            } else {
                let i, j;
                [i, j] = newSel;
                p.v.selectionStart = i;
                p.v.selectionLength = j - i;
            }
        } else {
            // if g.unitTesting:
            //     assert False, f"Not a text wrapper: {g.callers()}"
            g.trace('Not a text wrapper');
            p.v.insertSpot = 0;
            p.v.selectionStart = 0;
            p.v.selectionLength = 0;
        }
        //
        // #1749.
        let redraw_flag: boolean;
        if (p.isDirty()) {
            redraw_flag = false;
        } else {
            p.setDirty(); // Do not call p.v.setDirty!
            redraw_flag = true;
        }
        if (!c.isChanged()) {
            c.setChanged();
        }

        // Update editors.
        // c.frame.body.updateEditors(); // TODO : test if needed

        // Update icons.
        const val: number = p.computeIcon();
        if (p.v["iconVal"] === 0 || !p.v["iconVal"] || val !== p.v.iconVal) {
            p.v.iconVal = val;
            redraw_flag = true;
        }
        //
        // Recolor the body. // TODO : test if needed
        c.frame.scanForTabWidth(p);  // Calls frame.setTabWidth()

        c.recolor();
        if (redraw_flag) {
            c.redraw_after_icons_changed();
        }
        w.setFocus();
    }
    //@+node:felix.20211026230613.81: *3* u.redo
    @cmd(
        "redo",
        "Redo the operation undone by the last undo."
    )
    public redo(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        if (!c.p || !c.p.__bool__()) {
            return;
        }
        // End editing *before* getting state.
        c.endEditing();
        if (!u.canRedo()) {
            return;
        }
        if (!u.getBead(u.bead + 1)) {
            return;
        }
        //

        // Init status.
        u.redoing = true;
        u.groupCount = 0;
        if (u.redoHelper) {
            u.redoHelper();
        } else {
            g.trace(`no redo helper for ${u.kind} ${u.undoType}`);
        }
        //
        // Finish.
        c.checkOutline();
        u.update_status();
        u.redoing = false;
        u.bead += 1;
        u.setUndoTypes();
    }
    //@+node:felix.20211026230613.82: *3* u.redo helpers
    //@+node:felix.20211026230613.83: *4*  u.reloadHelper (do nothing)
    /**
     * The default do-nothing redo helper.
     */
    public redoHelper(): void {
        // pass
    }
    //@+node:felix.20211026230613.84: *4* u.redoChangeBody
    public redoChangeBody(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p!)) { // #1333.
            c.selectPosition(u.p!);
        }
        u.p!.setDirty();
        u.p!.b = u.newBody;
        u.p!.h = u.newHead;

        // This is required so. Otherwise redraw will revert the change!
        c.frame.tree.setHeadline(u.p!, u.newHead);

        if (u.newMarked) {
            u.p!.setMarked();
        } else {
            u.p!.clearMarked();
        }
        if (w && u.groupCount === 0) {
            if (w.setAllText) {
                w.setAllText(u.newBody);
            }
            if (w.setSelectionRange) {
                w.setSelectionRange(u.newSel[0], u.newSel[1], u.newIns);

            }
            if (w.setYScrollPosition) {
                w.setYScrollPosition(u.newYScroll);
            }
            let i, j;
            [i, j] = u.newSel;
            w.setSelectionRange(i, j, u.newIns);
            w.setYScrollPosition(u.newYScroll);
            // c.frame.body.recolor(u.p);
        }
        u.updateMarks('new');
        u.p!.setDirty();
    }
    //@+node:felix.20211026230613.85: *4* u.redoChangeHeadline
    public redoChangeHeadline(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p!)) {  // #1333.
            c.selectPosition(u.p!);
        }
        u.p!.setDirty();
        // c.frame.body.recolor(u.p!);
        // Restore the headline.
        u.p!.initHeadString(u.newHead);

        // This is required so.  Otherwise redraw will revert the change!
        c.frame.tree.setHeadline(u.p!, u.newHead);

    }
    //@+node:felix.20230331230645.1: *4* u.redoChangeMultiHeadline
    public redoChangeMultiHeadline(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        // c.frame.body.recolor(u.p);
        // Swap the ones from the 'bunch.headline' dict
        for (const [gnx, oldNewTuple] of Object.entries(u.headlines)) {
            const v = c.fileCommands.gnxDict[gnx];
            v.initHeadString(oldNewTuple[1]!);
            if (u.p && v.gnx === u.p.gnx) {
                u.p.setDirty();
                // This is required.  Otherwise redraw will revert the change!
                c.frame.tree.setHeadline(u.p, oldNewTuple[1]!);
            }
        }

        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p) && u.p) {  // #1333.
            c.selectPosition(u.p);
        }
    }
    //@+node:felix.20211026230613.87: *4* u.redoCloneMarkedNodes
    public redoCloneMarkedNodes(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        c.selectPosition(u.p!);
        c.cloneMarked();
        u.newP = c.p;
    }
    //@+node:felix.20211026230613.88: *4* u.redoCopyMarkedNodes
    public redoCopyMarkedNodes(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        c.selectPosition(u.p!);
        c.copyMarked();
        u.newP = c.p;
    }
    //@+node:felix.20211026230613.89: *4* u.redoCloneNode
    public redoCloneNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const cc: ChapterController = c.chapterController;
        if (cc) {
            cc.selectChapterByName('main');
        }
        if (u.newBack.__bool__()) {
            u.newP._linkAfter(u.newBack);
        } else if (u.newParent.__bool__()) {
            u.newP._linkAsNthChild(u.newParent, 0);
        } else {
            u.newP._linkAsRoot();
        }
        c.selectPosition(u.newP);
        u.newP.setDirty();
    }
    //@+node:felix.20211026230613.90: *4* u.redoDeleteMarkedNodes
    public redoDeleteMarkedNodes(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        c.selectPosition(u.p!);
        c.deleteMarked();
        c.selectPosition(u.newP);
    }
    //@+node:felix.20211026230613.91: *4* u.redoDeleteNode
    public redoDeleteNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        c.selectPosition(u.p!);
        c.deleteOutline();
        c.selectPosition(u.newP);
    }
    //@+node:felix.20211026230613.92: *4* u.redoDemote
    public redoDemote(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const parent_v: VNode = u.p!._parentVnode()!;
        const n: number = u.p!.childIndex();

        // Move the demoted nodes from the old parent to the new parent.
        parent_v.children = parent_v.children.slice(0, n + 1);

        u.p!.v.children.push(...u.followingSibs);
        // Adjust the parent links of the moved nodes.
        // There is no need to adjust descendant links.
        for (let v of u.followingSibs) {
            // v.parents.remove(parent_v);
            const i_parent_v: number = v.parents.indexOf(parent_v);
            if (i_parent_v > -1) {
                v.parents.splice(i_parent_v, 1);
            }
            v.parents.push(u.p!.v);
        }
        u.p!.setDirty();
        c.setCurrentPosition(u.p!);
    }
    //@+node:felix.20211026230613.93: *4* u.redoGroup
    /**
     * Process beads until the matching 'afterGroup' bead is seen.
     */
    public redoGroup(): void {
        const u: Undoer = this;
        // Remember these values.
        const c: Commands = u.c;
        const newSel: number[] = u.newSel;
        const p: Position = u.p!.copy();
        u.groupCount += 1;
        const bunch: Bead = u.beads[u.bead + 1];
        let count: number = 0;
        if (!bunch['items']) {
            g.trace(`oops: expecting bunch.items. got bunch.kind = ${bunch.kind}`);
            g.trace(bunch);
        } else {
            for (let z of bunch.items) {
                u.setIvarsFromBunch(z);
                if (z.redoHelper) {
                    z.redoHelper.bind(u)(); // Properly bound to undoer instead of bunch
                    count += 1;
                } else {
                    g.trace(`oops: no redo helper for ${u.undoType} ${p.h}`);
                }
            }
        }
        u.groupCount -= 1;
        u.updateMarks('new');  // Bug fix: Leo 4.4.6.
        if (!g.unitTesting && u.verboseUndoGroup) {
            g.es("redo", count, "instances");
        }
        p.setDirty();
        c.selectPosition(p);
        if (newSel && newSel.length) {
            let i, j;
            [i, j] = newSel;
            c.frame.body.wrapper.setSelectionRange(i, j);
        }
    }
    //@+node:felix.20211026230613.94: *4* u.redoHoistNode & redoDehoistNode
    public redoHoistNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.p!.setDirty();
        c.selectPosition(u.p!);
        c.hoist();
    }
    public redoDehoistNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.p!.setDirty();
        c.selectPosition(u.p!);
        c.dehoist();
    }
    //@+node:felix.20211026230613.95: *4* u.redoInsertNode
    public redoInsertNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const cc: ChapterController = c.chapterController;
        if (cc) {
            cc.selectChapterByName('main');
        }
        if (u.newBack.__bool__()) {
            u.newP._linkAfter(u.newBack);
        } else if (u.newParent.__bool__()) {
            u.newP._linkAsNthChild(u.newParent, 0);
        } else {
            u.newP._linkAsRoot();
        }
        if (u.pasteAsClone) {
            for (let bunch of u.afterTree) {
                const v: VNode = bunch.v;
                if (u.newP.v.gnx === v.gnx) {
                    u.newP.b = bunch.body;
                    u.newP.h = bunch.head;
                } else {
                    v.setBodyString(bunch.body);
                    v.setHeadString(bunch.head);
                }
            }
        }
        u.newP.setDirty();
        c.selectPosition(u.newP);
    }
    //@+node:felix.20211026230613.96: *4* u.redoMark
    public redoMark(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.updateMarks('new');
        if (u.groupCount === 0) {
            u.p!.setDirty();
            c.selectPosition(u.p!);
        }
    }
    //@+node:felix.20211026230613.97: *4* u.redoMove
    public redoMove(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const cc: ChapterController = c.chapterController;
        const v: VNode = u.p!.v;
        console.assert(u.oldParent_v);
        console.assert(u.newParent_v);
        console.assert(v);
        if (cc) {
            cc.selectChapterByName('main');
        }
        // Adjust the children arrays of the old parent.
        console.assert(u.oldParent_v.children[u.oldN] === v);

        // del u.oldParent_v.children[u.oldN]
        u.oldParent_v.children.splice(u.oldN, 1);
        u.oldParent_v.setDirty();
        // Adjust the children array of the new parent.
        const parent_v: VNode = u.newParent_v;

        // parent_v.children.insert(u.newN, v)
        parent_v.children.splice(u.newN, 0, v);

        v.parents.push(u.newParent_v);

        // v.parents.remove(u.oldParent_v)
        const index = v.parents.indexOf(u.oldParent_v);
        if (index > -1) {
            v.parents.splice(index, 1);
        }

        u.newParent_v.setDirty();
        //
        u.updateMarks('new');
        u.newP.setDirty();
        c.selectPosition(u.newP);
    }
    //@+node:felix.20211026230613.98: *4* u.redoNodeContents
    public redoNodeContents(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p!)) { // #1333.
            c.selectPosition(u.p!);
        }
        u.p!.setDirty();
        // Restore the body.
        u.p!.setBodyString(u.newBody);
        w.setAllText(u.newBody);

        // c.frame.body.recolor(u.p!);

        // Restore the headline.
        u.p!.initHeadString(u.newHead);

        // This is required so.  Otherwise redraw will revert the change!
        c.frame.tree.setHeadline(u.p!, u.newHead);  // New in 4.4b2.

        if (u.groupCount === 0 && u.newSel && u.newSel.length) {
            let i, j;
            [i, j] = u.newSel;
            w.setSelectionRange && w.setSelectionRange(i, j);
        }
        if (u.groupCount === 0 && (u.newYScroll || u.newYScroll === 0)) {
            w.setYScrollPosition && w.setYScrollPosition(u.newYScroll);
        }
        u.updateMarks('new');
        u.p!.setDirty();
    }
    //@+node:felix.20211026230613.99: *4* u.redoPromote
    public redoPromote(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const parent_v: VNode = u.p!._parentVnode()!;
        // Add the children to parent_v's children.
        let n: number = u.p!.childIndex() + 1;
        const old_children: VNode[] = [...parent_v.children];
        parent_v.children = old_children.slice(0, n);
        // Add children up to the promoted nodes.
        parent_v.children.push(...u.children);
        // Add the promoted nodes.
        parent_v.children.push(...old_children.slice(n));
        // Add the children up to the promoted nodes.
        // Remove the old children.
        u.p!.v.children = [];
        // Adjust the parent links in the moved children.
        // There is no need to adjust descendant links.
        for (let child of u.children) {
            // child.parents.remove(u.p.v);
            const index = child.parents.indexOf(u.p!.v);
            if (index > -1) {
                child.parents.splice(index, 1);
            }
            child.parents.push(parent_v);
        }
        u.p!.setDirty();
        c.setCurrentPosition(u.p!);
    }
    //@+node:felix.20211026230613.100: *4* u.redoSort
    public redoSort(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const p = u.p!;
        if (u.sortChildren) {
            p.v.children = [...u.newChildren];
        } else {
            const parent_v = p._parentVnode()!;
            parent_v.children = [...u.newChildren];
            // Only the child index of new position changes!
            for (var _i = 0; _i < parent_v.children.length; _i++) {
                const v = parent_v.children[_i];
                if (v.gnx === p.v.gnx) {
                    p._childIndex = _i;
                    break;
                }
            }
        }
        p.setAllAncestorAtFileNodesDirty();
        c.setCurrentPosition(p);
    }
    //@+node:felix.20211026230613.101: *4* u.redoTree
    /**
     * Redo replacement of an entire tree.
     */
    public redoTree(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.p = this.undoRedoTree(u.p!, u.oldTree, u.newTree);
        u.p!.setDirty();
        c.selectPosition(u.p!);  // Does full recolor.
        if (u.newSel && u.newSel.length) {
            let i, j;
            [i, j] = u.newSel;
            c.frame.body.wrapper.setSelectionRange(i, j);
        }
    }
    //@+node:felix.20211026230613.103: *3* u.undo
    @cmd(
        "undo",
        "Undo the operation described by the undo parameters."
    )
    public undo(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        if (!c.p || !c.p.__bool__()) {
            g.trace('no current position');
            return;
        }
        // End editing *before* getting state.
        c.endEditing();

        if (u.per_node_undo) {  // 2011/05/19
            u.setIvarsFromVnode(c.p);
        }
        if (!u.canUndo()) {
            return;
        }
        if (!u.getBead(u.bead)) {
            return;
        }

        // Init status.
        u.undoing = true;
        u.groupCount = 0;
        //
        // Dispatch.
        if (u.undoHelper) {
            u.undoHelper();
        } else {
            g.trace(`no undo helper for ${u.kind} ${u.undoType}`);
        }
        //
        // Finish.
        c.checkOutline();
        u.update_status();
        u.undoing = false;
        u.bead -= 1;
        u.setUndoTypes();
    }
    //@+node:felix.20211026230613.104: *3* u.undo helpers
    //@+node:felix.20211026230613.105: *4*  u.undoHelper
    /**
     * The default do-nothing undo helper.
     */
    public undoHelper(): void {
        // pass
    }
    //@+node:felix.20211026230613.106: *4* u.undoChangeBody
    /**
     * Undo all changes to the contents of a node,
     * including headline and body text, and marked bits.
     */
    public undoChangeBody(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p!)) {
            c.selectPosition(u.p!);
        }
        u.p!.setDirty();
        u.p!.b = u.oldBody;
        u.p!.h = u.oldHead;
        // This is required.  Otherwise c.redraw will revert the change!
        c.frame.tree.setHeadline(u.p!, u.oldHead);

        if (u.oldMarked) {
            u.p!.setMarked();
        } else {
            u.p!.clearMarked();
        }
        if (w && u.groupCount === 0) {
            w.setAllText && w.setAllText(u.oldBody);
            let i, j;
            [i, j] = u.oldSel;
            w.setSelectionRange && w.setSelectionRange(i, j, u.oldIns);
            w.setYScrollPosition && w.setYScrollPosition(u.oldYScroll);
            //c.frame.body.recolor(u.p);
        }
        u.updateMarks('old');
    }
    //@+node:felix.20211026230613.107: *4* u.undoChangeHeadline
    /**
     * Undo a change to a node's headline.
     */
    public undoChangeHeadline(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p!)) {
            c.selectPosition(u.p!);
        }
        u.p!.setDirty();
        // c.frame.body.recolor(u.p);
        u.p!.initHeadString(u.oldHead);

        // This is required.  Otherwise c.redraw will revert the change!
        c.frame.tree.setHeadline(u.p!, u.oldHead);
    }
    //@+node:felix.20230331230746.1: *4* u.undoChangeMultiHeadline
    /**
     * Undo a change to a node's headline.
     */
    public undoChangeMultiHeadline(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        // selectPosition causes recoloring, so don't do this unless needed.
        // c.frame.body.recolor(u.p)
        // Swap the ones from the 'bunch.headline' dict
        for (const [gnx, oldNewTuple] of Object.entries(u.headlines)) {
            const v = c.fileCommands.gnxDict[gnx];
            v.initHeadString(oldNewTuple[0]);
            if (u.p && v.gnx === u.p.gnx) {
                u.p.setDirty();
                // This is required.  Otherwise redraw will revert the change!
                c.frame.tree.setHeadline(u.p, oldNewTuple[0]);
            }
        }
        //
        if (!c.p.__eq__(u.p) && u.p) {  // #1333.
            c.selectPosition(u.p);
        }
    }
    //@+node:felix.20211026230613.109: *4* u.undoCloneMarkedNodes
    public undoCloneMarkedNodes(): void {
        const u: Undoer = this;
        const next: Position = u.p!.next();
        console.assert(next.h === 'Clones of marked nodes', next.h);
        next.doDelete();
        u.p!.setAllAncestorAtFileNodesDirty();
        u.c.selectPosition(u.p!);
    }
    //@+node:felix.20211026230613.110: *4* u.undoCloneNode
    public undoCloneNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const cc: ChapterController = c.chapterController;
        if (cc) {
            cc.selectChapterByName('main');
        }
        c.selectPosition(u.newP);
        c.deleteOutline();
        u.p!.setDirty();
        c.selectPosition(u.p!);
    }
    //@+node:felix.20211026230613.111: *4* u.undoCopyMarkedNodes
    public undoCopyMarkedNodes(): void {
        const u: Undoer = this;
        const next: Position = u.p!.next();
        console.assert(next.h === 'Copies of marked nodes', next.h);
        next.doDelete();
        u.p!.setAllAncestorAtFileNodesDirty();
        u.c.selectPosition(u.p!);
    }
    //@+node:felix.20211026230613.112: *4* u.undoDeleteMarkedNodes
    public undoDeleteMarkedNodes(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        // Undo the deletes in reverse order
        const aList: Position[] = [...u.deleteMarkedNodesData];
        aList.reverse();
        let parent_v: VNode;
        for (let p of aList) {
            if (p.stack.length) {
                parent_v = p.stack[p.stack.length - 1][0];
            } else {
                parent_v = c.hiddenRootNode;
            }
            p.v._addLink(p._childIndex, parent_v);
            p.v.setDirty();
        }
        u.p!.setAllAncestorAtFileNodesDirty();
        c.selectPosition(u.p!);
    }
    //@+node:felix.20211026230613.113: *4* u.undoDeleteNode
    public undoDeleteNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;

        if (u.oldBack.__bool__()) {
            u.p!._linkAfter(u.oldBack);
        } else if (u.oldParent.__bool__()) {
            u.p!._linkAsNthChild(u.oldParent, 0);
        } else {
            u.p!._linkAsRoot();
        }
        u.p!.setDirty();
        c.selectPosition(u.p!);
    }
    //@+node:felix.20211026230613.114: *4* u.undoDemote
    public undoDemote(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const parent_v: VNode = u.p!._parentVnode()!;
        let n: number = u.followingSibs.length;
        // Remove the demoted nodes from p's children.
        u.p!.v.children = u.p!.v.children.slice(0, -n);
        // Add the demoted nodes to the parent's children.
        parent_v.children.push(...u.followingSibs);
        // Adjust the parent links.
        // There is no need to adjust descendant links.
        parent_v.setDirty();
        for (let sib of u.followingSibs) {

            //sib.parents.remove(u.p!.v);
            const i_upv: number = sib.parents.indexOf(u.p!.v);
            if (i_upv > -1) {
                sib.parents.splice(i_upv, 1);
            }
            sib.parents.push(parent_v);
        }
        u.p!.setAllAncestorAtFileNodesDirty();
        c.setCurrentPosition(u.p!);
    }
    //@+node:felix.20211026230613.115: *4* u.undoGroup
    /**
     * Process beads until the matching 'beforeGroup' bead is seen.
     */
    public undoGroup(): void {
        const u: Undoer = this;
        // Remember these values.
        const c: Commands = u.c;
        const oldSel: any = u.oldSel;
        const p: Position = u.p!.copy();
        u.groupCount += 1;
        const bunch: Bead = u.beads[u.bead];
        let count: number = 0;
        if (!bunch['items']) {
            g.trace(`oops: expecting bunch.items. got bunch.kind = ${bunch.kind}`);
            g.trace(bunch);
        } else {
            // Important bug fix: 9/8/06: reverse the items first.
            const reversedItems: any[] = [...bunch.items];
            reversedItems.reverse();
            for (let z of reversedItems) {
                u.setIvarsFromBunch(z);
                if (z.undoHelper) {
                    z.undoHelper.bind(u)(); // Properly bound to undoer instead of bunch
                    count += 1;
                } else {
                    g.trace(`oops: no undo helper for ${u.undoType} ${p.v}`);
                }
            }
        }
        u.groupCount -= 1;
        u.updateMarks('old');  // Bug fix: Leo 4.4.6.
        if (!g.unitTesting && u.verboseUndoGroup) {
            g.es("undo", count, "instances");
        }
        p.setDirty();
        c.selectPosition(p);
        if (oldSel && oldSel.length) {
            let i, j;
            [i, j] = oldSel;
            c.frame.body.wrapper.setSelectionRange(i, j);
        }
    }
    //@+node:felix.20211026230613.116: *4* u.undoHoistNode & undoDehoistNode
    public undoHoistNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.p!.setDirty();
        c.selectPosition(u.p!);
        c.dehoist();
    }
    public undoDehoistNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.p!.setDirty();
        c.selectPosition(u.p!);
        c.hoist();
    }
    //@+node:felix.20211026230613.117: *4* u.undoInsertNode
    public undoInsertNode(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const cc: ChapterController = c.chapterController;
        if (cc) {
            cc.selectChapterByName('main');
        }
        u.newP.setAllAncestorAtFileNodesDirty();
        c.selectPosition(u.newP);
        c.deleteOutline();
        // Bug fix: 2016/03/30.
        // This always selects the proper new position.
        // c.selectPosition(u.p)
        if (u.pasteAsClone) {
            for (let bunch of u.beforeTree) {
                const v: VNode = bunch.v;
                if (u.p!.v === v) {
                    u.p!.b = bunch.body;
                    u.p!.h = bunch.head;
                } else {
                    v.setBodyString(bunch.body);
                    v.setHeadString(bunch.head);
                }
            }
        }
    }
    //@+node:felix.20211026230613.118: *4* u.undoMark
    public undoMark(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.updateMarks('old');
        if (u.groupCount === 0) {
            u.p!.setDirty();
            c.selectPosition(u.p!);
        }
    }
    //@+node:felix.20211026230613.119: *4* u.undoMove
    public undoMove(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const cc: ChapterController = c.chapterController;
        if (cc) {
            cc.selectChapterByName('main');
        }
        const v: VNode = u.p!.v;
        console.assert(u.oldParent_v);
        console.assert(u.newParent_v);
        console.assert(v);
        // Adjust the children arrays.
        console.assert(u.newParent_v.children[u.newN] === v);

        // del u.newParent_v.children[u.newN]
        u.newParent_v.children.splice(u.newN, 1);

        u.oldParent_v.children.splice(u.oldN, 0, v);

        // Recompute the parent links.
        v.parents.push(u.oldParent_v);

        // v.parents.remove(u.newParent_v)
        const index = v.parents.indexOf(u.newParent_v);
        if (index > -1) {
            v.parents.splice(index, 1);
        }

        u.updateMarks('old');
        u.p!.setDirty();
        c.selectPosition(u.p!);
    }
    //@+node:felix.20211026230613.120: *4* u.undoNodeContents
    /**
     * Undo all changes to the contents of a node,
     * including headline and body text, and marked bits.
     */
    public undoNodeContents(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if (!c.p.__eq__(u.p!)) {
            c.selectPosition(u.p!);
        }
        u.p!.setDirty();
        u.p!.b = u.oldBody;
        w.setAllText(u.oldBody);
        // c.frame.body.recolor(u.p)
        u.p!.h = u.oldHead;

        // This is required.  Otherwise c.redraw will revert the change!
        c.frame.tree.setHeadline(u.p!, u.oldHead);

        if (u.groupCount === 0 && u.oldSel && u.oldSel.length) {
            let i, j;
            [i, j] = u.oldSel;
            w.setSelectionRange && w.setSelectionRange(i, j);
        }
        if (u.groupCount === 0 && (u.oldYScroll || u.oldYScroll === 0)) {
            w.setYScrollPosition && w.setYScrollPosition(u.oldYScroll);
        }
        u.updateMarks('old');
    }
    //@+node:felix.20211026230613.121: *4* u.undoPromote
    public undoPromote(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const parent_v: VNode = u.p!._parentVnode()!;  // The parent of the all the *promoted* nodes.
        // Remove the promoted nodes from parent_v's children.
        let n: number = u.p!.childIndex() + 1;
        // Adjust the old parents children
        const old_children: VNode[] = parent_v.children;

        parent_v.children = old_children.slice(0, n);
        // Add the nodes before the promoted nodes.

        parent_v.children.push(...old_children.slice(n + u.children.length));
        // Add the nodes after the promoted nodes.

        // Add the demoted nodes to v's children.
        u.p!.v.children = [...u.children];

        // Adjust the parent links.
        // There is no need to adjust descendant links.
        parent_v.setDirty();
        for (let child of u.children) {
            let i_parent_v = child.parents.indexOf(parent_v);
            if (i_parent_v > -1) {
                child.parents.splice(i_parent_v, 1);
            }
            //child.parents.remove(parent_v);
            child.parents.push(u.p!.v);
        }
        u.p!.setAllAncestorAtFileNodesDirty();
        c.setCurrentPosition(u.p!);
    }
    //@+node:felix.20211026230613.122: *4* u.undoRedoText
    /**
     * Handle text undo and redo: converts _new_ text into _old_ text.
     */
    public undoRedoText(p: Position,
        leading: number, trailing: number,  // Number of matching leading & trailing lines.
        oldMidLines: string[], newMidLines: string[],  // Lists of unmatched lines.
        oldNewlines: number, newNewlines: number,  // Number of trailing newlines.
        tag: string = "undo",  // "undo" or "redo"
        undoType?: string
    ): void {
        // newNewlines is unused, but it has symmetry.
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;
        //@+<< Compute the result using p's body text >>
        //@+node:felix.20211026230613.123: *5* << Compute the result using p's body text >>
        // Recreate the text using the present body text.
        let body: string = p.b;
        body = g.checkUnicode(body);

        const body_lines: string[] = body.split('\n');
        let s: string[] | string = [];

        if (leading > 0) {
            s.push(...body_lines.slice(0, leading));
        }
        if (oldMidLines.length) {
            s.push(...oldMidLines);
        }
        if (trailing > 0) {
            s.push(...body_lines.slice(-trailing));
        }
        // s = '\n'.join(s);
        s = s.join('\n');

        // Remove trailing newlines in s.
        while (s && s[s.length - 1] === '\n') {
            s = s.slice(0, -1);
        }
        // Add oldNewlines newlines.
        if (oldNewlines > 0) {
            s = s + '\n'.repeat(oldNewlines);
        }
        const result: string = s;
        //@-<< Compute the result using p's body text >>
        p.setBodyString(result);
        p.setDirty();
        w.setAllText(result);
        const sel: number[] = tag === 'undo' ? u.oldSel : u.newSel;
        if (sel && sel.length) {
            let i, j;
            [i, j] = sel;
            w.setSelectionRange(i, j, j);
        }

        // c.frame.body.recolor(p);
        w.seeInsertPoint(); // 2009/12/21
    }
    //@+node:felix.20211026230613.124: *4* u.undoRedoTree
    /**
     * Replace p and its subtree using old_data during undo.
     */
    public undoRedoTree(p: Position, new_data: any, old_data: any): Position {
        // Same as undoReplace except uses g.Bunch.
        const u: Undoer = this;
        const c: Commands = u.c;
        if (!new_data) {
            // This is the first time we have undone the operation.
            // Put the new data in the bead.
            const bunch: Bead = u.beads[u.bead];
            bunch.newTree = u.saveTree(p.copy());
            u.beads[u.bead] = bunch;
        }
        // Replace data in tree with old data.
        u.restoreTree(old_data);
        c.setBodyString(p, p.b);  // This is not a do-nothing.
        return p;  // Nothing really changes.
    }
    //@+node:felix.20211026230613.125: *4* u.undoSort
    public undoSort(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const p = u.p!;
        if (u.sortChildren) {
            p.v.children = [...u.oldChildren];
        } else {
            const parent_v = p._parentVnode()!;
            parent_v.children = [...u.oldChildren];
            // Only the child index of new position changes!
            for (var _i = 0; _i < parent_v.children.length; _i++) {
                const v = parent_v.children[_i];
                if (v.gnx === p.v.gnx) {
                    p._childIndex = _i;
                    break;
                }
            }
        }
        p.setAllAncestorAtFileNodesDirty();
        c.setCurrentPosition(p);
    }
    //@+node:felix.20211026230613.126: *4* u.undoTree
    /**
     * Redo replacement of an entire tree.
     */
    public undoTree(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        u.p = u.undoRedoTree(u.p!, u.newTree, u.oldTree);
        u.p.setAllAncestorAtFileNodesDirty();
        c.selectPosition(u.p);  // Does full recolor.
        if (u.oldSel && u.oldSel.length) {
            let i, j;
            [i, j] = u.oldSel;
            c.frame.body.wrapper.setSelectionRange(i, j);
        }
    }
    //@+node:felix.20211026230613.128: *3* u.update_status
    /**
     * Update status after either an undo or redo
     */
    public update_status(): void {
        const u: Undoer = this;
        const c: Commands = u.c;
        const w: StringTextWrapper = c.frame.body.wrapper;

        // Redraw and recolor.
        // c.frame.body.updateEditors();  // New in Leo 4.4.8.

        //
        // Set the new position.
        if (0) {  // Don't do this: it interferes with selection ranges.
            // This strange code forces a recomputation of the root position.
            c.selectPosition(c.p);
        } else {
            c.setCurrentPosition(c.p);
        }
        //
        // # 1451. *Always* set the changed bit.
        // Redrawing *must* be done here before setting u.undoing to false.
        let i, j;
        [i, j] = w.getSelectionRange();
        const ins: number = w.getInsertPoint();

        c.redraw();
        // c.recolor();

        if (u.inHead) {
            // c.editHeadline(); // TODO : NEEDED ???
            u.inHead = false;
        } else {
            c.bodyWantsFocus();
            w.setSelectionRange(i, j, ins);
            w.seeInsertPoint();
        }
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
