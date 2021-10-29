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

import * as g from './leoGlobals';
import { new_cmd_decorator } from "../core/decorators";
import { Position, VNode } from './leoNodes';

//@+others
//@+node:felix.20211028004540.1: ** Interfaces
interface Bead {
    [key:string]:any;
}

interface TreeData extends Array<VNode|any| any>{0:VNode;1:any;2:any;};
//@+node:felix.20211026230613.3: ** u.cmd (decorator)
/**
 * Command decorator for the Undoer class.
 */
function cmd(p_name: string, p_doc: string){
    return new_cmd_decorator(p_name, p_doc, ['c', 'undoer']);
}
//@+node:felix.20211026230613.4: ** class Undoer
/**
 * A class that implements unlimited undo and redo.
 */
export class Undoer {

    public c:Commands = c;
    public p:Position|undefined;
    public granularity:string = ""; // Set in reloadSettings.
    public max_undo_stack_size: number;

    // State ivars...
    public beads:Bead = []; // List of undo nodes.
    public bead:number = -1; // Index of the present bead: -1:len(beads)
    public undoType:any = "Can't Undo";
    // These must be set here, _not_ in clearUndoState.
    public redoMenuLabel:any = "Can't Redo";
    public undoMenuLabel:any = "Can't Undo";
    public realRedoMenuLabel:any = "Can't Redo";
    public realUndoMenuLabel:any = "Can't Undo";
    public undoing:boolean = false; // True if executing an Undo command.
    public redoing:boolean = false; // True if executing a Redo command.
    public per_node_undo:boolean = false; // True: v may contain undo_info ivar.
    // New in 4.2...
    public optionalIvars:any[] = [];
    // Set the following ivars to keep pylint happy.
    public afterTree:any;
    public beforeTree:any;
    public children:any;
    public deleteMarkedNodesData:any;
    public followingSibs:any;
    public inHead:any;
    public kind:any;
    public newBack:any;
    public newBody:any;
    public newChildren:any;
    public newHead:any;
    public newIns:any;
    public newMarked:any;
    public newN:any;
    public newP:any;
    public newParent:any;
    public newParent_v:any;
    public newRecentFiles:any;
    public newSel:any;
    public newTree:any;
    public newYScroll:any;
    public oldBack:any;
    public oldBody:any;
    public oldChildren:any;
    public oldHead:any;
    public oldIns:any;
    public oldMarked:any;
    public oldN:any;
    public oldParent:any;
    public oldParent_v:any;
    public oldRecentFiles:any;
    public oldSel:any;
    public oldTree:any;
    public oldYScroll:any;
    public pasteAsClone:any;
    public prevSel:any;
    public sortChildren:any;
    public verboseUndoGroup:any;

    //@+others
    //@+node:felix.20211026230613.5: *3* u.Birth
    //@+node:felix.20211026230613.6: *4* u.__init__
    constructor(c:Commands){
        this.c = c;
        this.granularity = "";  // Set in reloadSettings.
        this.max_undo_stack_size = c.config.getInt('max-undo-stack-size') || 0;

        this.reloadSettings();
    }
    //@+node:felix.20211026230613.7: *4* u.reloadSettings
    /**
     * Undoer.reloadSettings.
     */
    public reloadSettings(){
        c = this.c;
        this.granularity = c.config.getString('undo-granularity');
        if( this.granularity){
            this.granularity = this.granularity.toLowerCase();
        }
        if(!['node', 'line', 'word', 'char'].includes(this.granularity)){
            this.granularity = 'line';
        }
    }
    //@+node:felix.20211026230613.8: *3* u.Internal helpers
    //@+node:felix.20211026230613.9: *4* u.clearOptionalIvars
    public clearOptionalIvars(): void {
        const u:Undoer = this;
        u.p = undefined;  // The position/node being operated upon for undo and redo.
        for(let ivar of u.optionalIvars){
            ivar = undefined;
        }
    }
    //@+node:felix.20211026230613.10: *4* u.cutStack
    public cutStack(): void {
        const u:Undoer = this;
        const n:number = u.max_undo_stack_size;
        if( (u.bead >= n) && (n > 0) && !g.unitTesting){
            // Do nothing if we are in the middle of creating a group.
            let i = u.beads.length - 1;
            while (i >= 0){
                bunch = u.beads[i];
                if( bunch.kind && bunch.kind === 'beforeGroup'){
                    return;
                }    
                i -= 1;
            }
            // This work regardless of how many items appear after bead n.
                // g.trace('Cutting undo stack to %d entries' % (n))
            u.beads = u.beads.slice(-n);
            u.bead = n - 1;
        }

        if (g.app.debug.includes('undo') && g.app.debug.includes('verbose')){
            console.log("u.cutStack: ${u.beads.length}");
        }    
    }
    //@+node:felix.20211026230613.11: *4* u.dumpBead
    public dumpBead(n: number): string {
        const u:Undoer = this;

        if (n < 0 || n >= u.beads.length){
            return 'no bead: n = ' + n;
        }
        // bunch = u.beads[n]
        const result:string [] = [];
        result.push('-'.repeat(10));
        result.push("u.beads.length: ${u.beads.length}, n: ${n}");

        for( let ivar of ['kind', 'newP', 'newN', 'p', 'oldN', 'undoHelper']){
            result.push("${ivar} = ${u[ivar]}");
        }
        return result.join('\n');
    }

    public dumpTopBead(): string {
        const u:Undoer = this;
        const n:number = u.beads.length;

        if(n > 0){
            return self.dumpBead(n - 1);
        }
        return '<no top bead>';
    }
    //@+node:felix.20211026230613.12: *4* u.getBead
    /**
     * Set Undoer ivars from the bunch at the top of the undo stack.
     */
    public getBead(n:number): Bead{
        const u:Undoer = this;
        if( n < 0 || n >= u.beads.length){
            return undefined;
        }
        const bunch = u.beads[n];
        u.setIvarsFromBunch(bunch);
        if( g.app.debug.includes('undo')){
            print(" u.getBead: ${n} of ${u.beads.length}");
        }
        return bunch;
    }
    //@+node:felix.20211026230613.13: *4* u.peekBead
    public peekBead(n: number): Bead|undefined{
        const u:Undoer = this;
        if( n < 0 || n >= u.beads.length){
            return undefined;
        }
        return u.beads[n];
    }
    //@+node:felix.20211026230613.14: *4* u.pushBead
    public pushBead(bunch: Bead){
        const u:Undoer = this;
        // New in 4.4b2:  Add this to the group if it is being accumulated.
        let bunch2:Bead | boolean = u.bead >= 0 && u.bead < u.beads.length;
        if(bunch2){
            bunch2 = u.beads[u.bead];
        } 
        if (bunch2 && bunch2.kind && bunch2.kind === 'beforeGroup'){
            // Just append the new bunch the group's items.
            bunch2.items.push(bunch);
        }else{
            // Push the bunch.
            u.bead += 1;

            // u.beads[u.bead:] = [bunch]
            u.beads.splice(u.bead, u.beads.length-u.bead, bunch);

            // Recalculate the menu labels.
            u.setUndoTypes();
        }    
        if(g.app.debug.includes('undo')){
            print("u.pushBead: ${u.beads.length:3} ${bunch.undoType}");
        }
    }
    //@+node:felix.20211026230613.15: *4* u.redoMenuName, undoMenuName
    public redoMenuName(name:string): string {
        if(name === "Can't Redo"){
            return name;
        }
        return "Redo " + name;
    }

    public undoMenuName(name:string): string {
        if(name === "Can't Undo"){
            return name;
        }
        return "Undo " + name;
    }
    //@+node:felix.20211026230613.16: *4* u.setIvarsFromBunch
    public setIvarsFromBunch( bunch){
        const u:Undoer = this;
        u.clearOptionalIvars();

        // TODO : for debugging/testing
        /*
        if false && !g.unitTesting:  // Debugging.
            print('-' * 40)
            for (let key in list(bunch.keys()))
                g.trace(f"{key:20} {bunch.get(key)!r}")
            print('-' * 20)
        if g.unitTesting:  // #1694: An ever-present unit test.
            val = bunch.get('oldMarked')
            assert val in (True, False), f"{val!r} {g.callers()!s}"
        */

        // bunch is not a dict, so bunch.keys() is required.
        for (let key of Object.keys(bunch)){
            val:any = bunch.key;
            u[key] = val;
            if (!u.optionalIvars.includes(key)){
                u.optionalIvars.push(key);
            }
        }
    }
    //@+node:felix.20211026230613.17: *4* u.setRedoType
    // These routines update both the ivar and the menu label.

    public setRedoType(theType:string): void{
        const u:Undoer = this;
        // frame = u.c.frame;
        if( !(typeof theType === 'string' || theType instanceof String) ){
            g.trace("oops: expected string for command, got ${theType}");
            g.trace(g.callers());
            theType = '<unknown>';
        }
        // menu = frame.menu.getMenu("Edit")
        const name:string = u.redoMenuName(theType);
        if (name !== u.redoMenuLabel){
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
    public setUndoType(theType: string){
        const u:Undoer = this;
        // frame = u.c.frame

        if( !(typeof theType === 'string' || theType instanceof String) ){
            g.trace("oops: expected string for command, got ${theType}");
            g.trace(g.callers());
            theType = '<unknown>';
        }

        //menu = frame.menu.getMenu("Edit")
        const name:string = u.undoMenuName(theType);
        if (name !== u.undoMenuLabel){
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
            u.realUndoMenuLabel = realLabel;
        }
    }
    //@+node:felix.20211026230613.19: *4* u.setUndoTypes
    public setUndoTypes(): void {
        const u:Undoer = this;
        // Set the undo type and undo menu label.
        bunch = u.peekBead(u.bead);
        if (bunch){
            u.setUndoType(bunch.undoType);
        }else{
            u.setUndoType("Can't Undo");
        }
        // Set only the redo menu label.
        bunch = u.peekBead(u.bead + 1)
        if (bunch){
            u.setRedoType(bunch.undoType);
        }else{
            u.setRedoType("Can't Redo");
        }
        u.cutStack();
    }
    //@+node:felix.20211026230613.20: *4* u.restoreTree & helpers
    /**
     * Use the tree info to restore all VNode data, including all links.
     */
    public restoreTree( treeInfo: any[]): void {
        const u:Undoer = this;
        // This effectively relinks all vnodes.
        for (let p_tree of treeInfo){
            u.restoreVnodeUndoInfo(p_tree[1]);
            u.restoreTnodeUndoInfo(p_tree[2]);
        }
    }
    //@+node:felix.20211026230613.21: *5* u.restoreVnodeUndoInfo
    /**
     * Restore all ivars saved in the bunch.
     */
    public restoreVnodeUndoInfo(bunch: any): void {
        v = bunch.v;
        v.statusBits = bunch.statusBits;
        v.children = bunch.children;
        v.parents = bunch.parents;
        uA = bunch.unknownAttributes;
        if (uA){
            v.unknownAttributes = uA;
            v._p_changed = true;
        }
    }
    //@+node:felix.20211026230613.22: *5* u.restoreTnodeUndoInfo
    public restoreTnodeUndoInfo(bunch:any){
        v = bunch.v;
        v.h = bunch.headString;
        v.b = bunch.bodyString;
        v.statusBits = bunch.statusBits;
        uA = bunch.unknownAttributes;
        if (uA){
            v.unknownAttributes = uA;
            v._p_changed = true;
        }
    }
    //@+node:felix.20211026230613.23: *4* u.saveTree & helpers
    /**
     * Return a list of tuples with all info needed to handle a general undo operation.
     */
    public saveTree(p:Position, treeInfo?:TreeData[]): TreeData[]{

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

        const u:Undoer = this;
        const topLevel:boolean =!treeInfo;
        if(topLevel){
            treeInfo = [];
        }
        // Add info for p.v.  Duplicate tnode info is harmless.
        data: TreeData = [p.v, u.createVnodeUndoInfo(p.v), u.createTnodeUndoInfo(p.v)];
        treeInfo.push(data)
        // Recursively add info for the subtree.
        const child:Position = p.firstChild();
        while (child && child.__bool__()){
            u.saveTree(child, treeInfo);
            child = child.next();
        }
        return treeInfo;
    }
    //@+node:felix.20211026230613.25: *5* u.createVnodeUndoInfo
    /**
     * Create a bunch containing all info needed to recreate a VNode for undo.
     */
    public createVnodeUndoInfo(v:VNode): any{
        const bunch:any = {
            v:v,
            statusBits:v.statusBits,
            parents:[...v.parents],
            children:[...v.children],
        };

        if (v.unknownAttributes){
            bunch.unknownAttributes = v.unknownAttributes;
        }
        return bunch;
    }
    //@+node:felix.20211026230613.26: *5* u.createTnodeUndoInfo
    /**
     * Create a bunch containing all info needed to recreate a VNode.
     */
    public createTnodeUndoInfo(v:VNode): any{
        const bunch:any = {
            v:v,
            headString:v.h,
            bodyString:v.b,
            statusBits:v.statusBits,
        };
        if (v.unknownAttributes){
            bunch.unknownAttributes = v.unknownAttributes;
        }
        return bunch;
    }
    //@+node:felix.20211026230613.27: *4* u.trace
    public trace(): void {
        const ivars:string[] = ['kind', 'undoType'];
        for( let ivar of ivars){
            g.pr(ivar, this[ivar]);
        }
    }
    //@+node:felix.20211026230613.28: *4* u.updateMarks
    /**
     * Update dirty and marked bits.
     */
    public updateMarks(oldOrNew:string): void {
        const u:Undoer = this;
        const c:Commands = u.c;
        if (!['new', 'old'].includes(oldOrNew)){
            g.trace("can't happen")
            return;
        }
        const isOld:boolean = oldOrNew === 'old';
        const marked: boolean = isOld?u.oldMarked:u.newMarked;
        // Note: c.set/clearMarked call a hook.
        if (marked){
            c.setMarked(u.p);
        }else{
            c.clearMarked(u.p);
        }
        // Undo/redo always set changed/dirty bits because the file may have been saved.
        u.p.setDirty();
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
    public afterChangeBody(p:Position, command:string, bunch:any): void {
        const c:Commands = this.c;
        const u:Undoer = this;
        const w = c.frame.body.wrapper;

        if(u.redoing || u.undoing){
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
        if (w){
            bunch.newSel = w.getSelectionRange();
        }else{
            bunch.newSel = [0, 0];
        }

        // bunch.newYScroll = w.getYScrollPosition() if w else 0
        u.pushBead(bunch);
        //
        if( g.unitTesting){
            // assert command.lower() !== 'typing', g.callers()
        }else if(command.lower() === 'typing'){
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
    public afterChangeGroup(p:Position, undoType:string, reportFlag?:boolean): void {
        const u:Undoer = this;
        const c:Commands = this.c;
        const w:any = c.frame.body.wrapper;
        if(u.redoing || u.undoing){
            return;
        }

        const bunch = u.beads[u.bead];
        if (!u.beads.length){
            g.trace('oops: empty undo stack.');
            return;
        }

        if( bunch.kind === 'beforeGroup'){
            bunch.kind = 'afterGroup';
        }else{
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
        // Tells whether to report the number of separate changes undone/redone.
        bunch.reportFlag = reportFlag;
        
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
    public afterChangeNodeContents(p:Position, command:string, bunch:any): void {
        const u:Undoer = this;
        const c:Commands = this.c;
        const w:any = c.frame.body.wrapper;
        if(u.redoing || u.undoing){
            return;
        }        // Set the type & helpers.
        bunch.kind = 'node';
        bunch.undoType = command;
        bunch.undoHelper = u.undoNodeContents;
        bunch.redoHelper = u.redoNodeContents;
        bunch.inHead = false;  // 2013/08/26
        bunch.newBody = p.b;
        bunch.newHead = p.h;
        bunch.newMarked = p.isMarked();
        // Bug fix 2017/11/12: don't use ternary operator.
        if (w){
            bunch.newSel = w.getSelectionRange();
        }else{
            bunch.newSel = [0, 0];
        }
        //bunch.newYScroll = w.getYScrollPosition() if w else 0
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.34: *5* u.afterChangeHeadline
    /**
     * Create an undo node using d created by beforeChangeHeadline.
     */
    public afterChangeHeadline(p:Position, command:string, bunch:any): void {
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        // Set the type & helpers.
        bunch.kind = 'headline';
        bunch.undoType = command;
        bunch.undoHelper = u.undoChangeHeadline;
        bunch.redoHelper = u.redoChangeHeadline;
        bunch.newHead = p.h;
        u.pushBead(bunch);
    }

    // afterChangeHead = afterChangeHeadline // TODO (not used) ! 

    //@+node:felix.20211026230613.35: *5* u.afterChangeTree
    /**
     * Create an undo node for general tree operations using d created by beforeChangeTree
     */
    public afterChangeTree(p:Position, command:string, bunch:any): void {
        const u:Undoer = this;
        const c:Commands = this.c;
        const w:any = c.frame.body.wrapper;
        if(u.redoing || u.undoing){
            return;
        }        // Set the types & helpers.
        bunch.kind = 'tree';
        bunch.undoType = command;
        bunch.undoHelper = u.undoTree;
        bunch.redoHelper = u.redoTree;
        // Set by beforeChangeTree: changed, oldSel, oldText, oldTree, p
        bunch.newSel = w.getSelectionRange();
        bunch.newText = w.getAllText();
        bunch.newTree = u.saveTree(p);
        u.pushBead(bunch);
    }
    //@+node:felix.20211026230613.36: *5* u.afterClearRecentFiles
    public afterClearRecentFiles(self, bunch):
        const u:Undoer = this;
        bunch.newRecentFiles = g.app.config.recentFiles[:]
        bunch.undoType = 'Clear Recent Files'
        bunch.undoHelper = u.undoClearRecentFiles
        bunch.redoHelper = u.redoClearRecentFiles
        u.pushBead(bunch)
        return bunch
    //@+node:felix.20211026230613.37: *5* u.afterCloneMarkedNodes
    public afterCloneMarkedNodes(self, p):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        bunch = u.createCommonBunch(p)
            // Sets
            // oldDirty = p.isDirty(),
            // oldMarked = p.isMarked(),
            // oldSel = w and w.getSelectionRange() or None,
            // p = p.copy(),
        // Set types & helpers
        bunch.kind = 'clone-marked-nodes'
        bunch.undoType = 'clone-marked-nodes'
        // Set helpers
        bunch.undoHelper = u.undoCloneMarkedNodes
        bunch.redoHelper = u.redoCloneMarkedNodes
        bunch.newP = p.next()
        bunch.newMarked = p.isMarked()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.38: *5* u.afterCopyMarkedNodes
    public afterCopyMarkedNodes(self, p):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        bunch = u.createCommonBunch(p)
            // Sets
            // oldDirty = p.isDirty(),
            // oldMarked = p.isMarked(),
            // oldSel = w and w.getSelectionRange() or None,
            // p = p.copy(),
        // Set types & helpers
        bunch.kind = 'copy-marked-nodes'
        bunch.undoType = 'copy-marked-nodes'
        // Set helpers
        bunch.undoHelper = u.undoCopyMarkedNodes
        bunch.redoHelper = u.redoCopyMarkedNodes
        bunch.newP = p.next()
        bunch.newMarked = p.isMarked()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.39: *5* u.afterCloneNode
    public afterCloneNode(self, p, command, bunch):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        // Set types & helpers
        bunch.kind = 'clone'
        bunch.undoType = command
        // Set helpers
        bunch.undoHelper = u.undoCloneNode
        bunch.redoHelper = u.redoCloneNode
        bunch.newBack = p.back()  # 6/15/05
        bunch.newParent = p.parent()  # 6/15/05
        bunch.newP = p.copy()
        bunch.newMarked = p.isMarked()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.40: *5* u.afterDehoist
    public afterDehoist(self, p, command):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        bunch = u.createCommonBunch(p)
        // Set types & helpers
        bunch.kind = 'dehoist'
        bunch.undoType = command
        // Set helpers
        bunch.undoHelper = u.undoDehoistNode
        bunch.redoHelper = u.redoDehoistNode
        u.pushBead(bunch)
    //@+node:felix.20211026230613.41: *5* u.afterDeleteNode
    public afterDeleteNode(self, p, command, bunch):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        // Set types & helpers
        bunch.kind = 'delete'
        bunch.undoType = command
        // Set helpers
        bunch.undoHelper = u.undoDeleteNode
        bunch.redoHelper = u.redoDeleteNode
        bunch.newP = p.copy()
        bunch.newMarked = p.isMarked()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.42: *5* u.afterDeleteMarkedNodes
    public afterDeleteMarkedNodes(self, data, p):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        bunch = u.createCommonBunch(p)
        // Set types & helpers
        bunch.kind = 'delete-marked-nodes'
        bunch.undoType = 'delete-marked-nodes'
        // Set helpers
        bunch.undoHelper = u.undoDeleteMarkedNodes
        bunch.redoHelper = u.redoDeleteMarkedNodes
        bunch.newP = p.copy()
        bunch.deleteMarkedNodesData = data
        bunch.newMarked = p.isMarked()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.43: *5* u.afterDemote
    /**
     * Create an undo node for demote operations.
     */
    public afterDemote(self, p, followingSibs):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        // Set types.
        bunch.kind = 'demote'
        bunch.undoType = 'Demote'
        bunch.undoHelper = u.undoDemote
        bunch.redoHelper = u.redoDemote
        bunch.followingSibs = followingSibs
        // Push the bunch.
        u.bead += 1
        u.beads[u.bead:] = [bunch]
        // Recalculate the menu labels.
        u.setUndoTypes()
    //@+node:felix.20211026230613.44: *5* u.afterHoist
    public afterHoist(self, p, command):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        bunch = u.createCommonBunch(p)
        // Set types & helpers
        bunch.kind = 'hoist'
        bunch.undoType = command
        // Set helpers
        bunch.undoHelper = u.undoHoistNode
        bunch.redoHelper = u.redoHoistNode
        u.pushBead(bunch)
    //@+node:felix.20211026230613.45: *5* u.afterInsertNode
    public afterInsertNode(self, p, command, bunch):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        // Set types & helpers
        bunch.kind = 'insert'
        bunch.undoType = command
        // Set helpers
        bunch.undoHelper = u.undoInsertNode
        bunch.redoHelper = u.redoInsertNode
        bunch.newP = p.copy()
        bunch.newBack = p.back()
        bunch.newParent = p.parent()
        bunch.newMarked = p.isMarked()
        if bunch.pasteAsClone:
            beforeTree = bunch.beforeTree
            afterTree = []
            for bunch2 in beforeTree:
                v = bunch2.v
                afterTree.append(g.Bunch(v=v, head=v.h[:], body=v.b[:]))
            bunch.afterTree = afterTree
        u.pushBead(bunch)
    //@+node:felix.20211026230613.46: *5* u.afterMark
    /**
     * Create an undo node for mark and unmark commands.
     */
    public afterMark(self, p, command, bunch):
        // 'command' unused, but present for compatibility with similar methods.
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        // Set the type & helpers.
        bunch.undoHelper = u.undoMark
        bunch.redoHelper = u.redoMark
        bunch.newMarked = p.isMarked()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.47: *5* u.afterMoveNode
    public afterMoveNode(self, p, command, bunch):
        const u:Undoer = this;
        if(u.redoing || u.undoing){
            return;
        }        // Set the types & helpers.
        bunch.kind = 'move'
        bunch.undoType = command
        // Set helper only for undo:
        // The bead pointer will point to an 'beforeGroup' bead for redo.
        bunch.undoHelper = u.undoMove
        bunch.redoHelper = u.redoMove
        bunch.newMarked = p.isMarked()
        bunch.newN = p.childIndex()
        bunch.newParent_v = p._parentVnode()
        bunch.newP = p.copy()
        u.pushBead(bunch)
    //@+node:felix.20211026230613.48: *5* u.afterPromote
    /**
     * Create an undo node for demote operations.
     */
    public afterPromote(self, p, children):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        // Set types.
        bunch.kind = 'promote'
        bunch.undoType = 'Promote'
        bunch.undoHelper = u.undoPromote
        bunch.redoHelper = u.redoPromote
        bunch.children = children
        // Push the bunch.
        u.bead += 1
        u.beads[u.bead:] = [bunch]
        // Recalculate the menu labels.
        u.setUndoTypes()
    //@+node:felix.20211026230613.49: *5* u.afterSort
    /**
     * Create an undo node for sort operations
     */
    public afterSort(self, p, bunch):
        const u:Undoer = this;
        // c = self.c
        if(u.redoing || u.undoing){
            return;
        }        // Recalculate the menu labels.
        u.setUndoTypes()
    //@+node:felix.20211026230613.50: *4* u.beforeX...
    //@+node:felix.20211026230613.51: *5* u.beforeChangeBody
    /**
     * Return data that gets passed to afterChangeBody.
     */
    public beforeChangeBody(self, p):
        w = self.c.frame.body.wrapper
        bunch = self.createCommonBunch(p)
            // Sets u.oldMarked, u.oldSel, u.p
        bunch.oldBody = p.b
        bunch.oldHead = p.h
        bunch.oldIns = w.getInsertPoint()
        bunch.oldYScroll = w.getYScrollPosition()
        return bunch
    //@+node:felix.20211026230613.52: *5* u.beforeChangeGroup
    /**
     * Prepare to undo a group of undoable operations.
     */
    public beforeChangeGroup(self, p, command, verboseUndoGroup=True):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        // Set types.
        bunch.kind = 'beforeGroup'
        bunch.undoType = command
        bunch.verboseUndoGroup = verboseUndoGroup
        // Set helper only for redo:
        // The bead pointer will point to an 'afterGroup' bead for undo.
        bunch.undoHelper = u.undoGroup
        bunch.redoHelper = u.redoGroup
        bunch.items = []
        // Push the bunch.
        u.bead += 1
        u.beads[u.bead:] = [bunch]
    //@+node:felix.20211026230613.53: *5* u.beforeChangeHeadline
    /**
     * Return data that gets passed to afterChangeNode.
     * The oldHead kwarg works around a Qt difficulty when changing headlines.
     */
    public beforeChangeHeadline(self, p):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        bunch.oldHead = p.h
        return bunch

    beforeChangeHead = beforeChangeHeadline
    //@+node:felix.20211026230613.54: *5* u.beforeChangeNodeContents
    /**
     * Return data that gets passed to afterChangeNode.
     */
    public beforeChangeNodeContents(self, p):
        c, u = self.c, self
        const w:any = c.frame.body.wrapper;
        bunch = u.createCommonBunch(p)
        bunch.oldBody = p.b
        bunch.oldHead = p.h
        // #1413: Always restore yScroll if possible.
        bunch.oldYScroll = w.getYScrollPosition() if w else 0
        return bunch
    //@+node:felix.20211026230613.55: *5* u.beforeChangeTree
    public beforeChangeTree(self, p):
        const u:Undoer = this;
        const c:Commands = u.c;
        const w:any = c.frame.body.wrapper;
        bunch = u.createCommonBunch(p)
        bunch.oldSel = w.getSelectionRange()
        bunch.oldText = w.getAllText()
        bunch.oldTree = u.saveTree(p)
        return bunch
    //@+node:felix.20211026230613.56: *5* u.beforeClearRecentFiles
    public beforeClearRecentFiles()
        const u:Undoer = this;
        p = u.c.p
        bunch = u.createCommonBunch(p)
        bunch.oldRecentFiles = g.app.config.recentFiles[:]
        return bunch
    //@+node:felix.20211026230613.57: *5* u.beforeCloneNode
    public beforeCloneNode(self, p):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        return bunch
    //@+node:felix.20211026230613.58: *5* u.beforeDeleteNode
    public beforeDeleteNode(self, p):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        bunch.oldBack = p.back()
        bunch.oldParent = p.parent()
        return bunch
    //@+node:felix.20211026230613.59: *5* u.beforeInsertNode
    public beforeInsertNode(self, p, pasteAsClone=False, copiedBunchList=None):
        const u:Undoer = this;
        if copiedBunchList is None:
            copiedBunchList = []
        bunch = u.createCommonBunch(p)
        bunch.pasteAsClone = pasteAsClone
        if pasteAsClone:
            // Save the list of bunched.
            bunch.beforeTree = copiedBunchList
        return bunch
    //@+node:felix.20211026230613.60: *5* u.beforeMark
    public beforeMark(self, p, command):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        bunch.kind = 'mark'
        bunch.undoType = command
        return bunch
    //@+node:felix.20211026230613.61: *5* u.beforeMoveNode
    public beforeMoveNode(self, p):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        bunch.oldN = p.childIndex()
        bunch.oldParent_v = p._parentVnode()
        return bunch
    //@+node:felix.20211026230613.62: *5* u.beforeSort
    /**
     * Create an undo node for sort operations.
     */
    public beforeSort(self, p, undoType, oldChildren, newChildren, sortChildren):
        const u:Undoer = this;
        bunch = u.createCommonBunch(p)
        // Set types.
        bunch.kind = 'sort'
        bunch.undoType = undoType
        bunch.undoHelper = u.undoSort
        bunch.redoHelper = u.redoSort
        bunch.oldChildren = oldChildren
        bunch.newChildren = newChildren
        bunch.sortChildren = sortChildren  # A bool
        // Push the bunch.
        u.bead += 1
        u.beads[u.bead:] = [bunch]
        return bunch
    //@+node:felix.20211026230613.63: *5* u.createCommonBunch
    /**
     * Return a bunch containing all common undo info.
     * This is mostly the info for recreating an empty node at position p.
     */
    public createCommonBunch(self, p):
        const u:Undoer = this;
        const c:Commands = u.c;
        const w:any = c.frame.body.wrapper;
        return g.Bunch(
            oldMarked=p and p.isMarked(),
            oldSel=w and w.getSelectionRange() or None,
            p=p and p.copy(),
        )
    //@+node:felix.20211026230613.64: *4* u.canRedo & canUndo
    // Translation does not affect these routines.

    public canRedo()
        const u:Undoer = this;
        return u.redoMenuLabel != "Can't Redo"

    public canUndo()
        const u:Undoer = this;
        return u.undoMenuLabel != "Can't Undo"
    //@+node:felix.20211026230613.65: *4* u.clearUndoState
    /**
     * Clears then entire Undo state.
     * All non-undoable commands should call this method.
     */
    public clearUndoState()
        const u:Undoer = this;
        u.clearOptionalIvars()  # Do this first.
        u.setRedoType("Can't Redo")
        u.setUndoType("Can't Undo")
        u.beads = []  // List of undo nodes.
        u.bead = -1  // Index of the present bead: -1:len(beads)
    //@+node:felix.20211026230613.76: *4* u.enableMenuItems
    public enableMenuItems()
        const u:Undoer = this;
        frame = u.c.frame
        menu = frame.menu.getMenu("Edit")
        if menu:
            frame.menu.enableMenu(menu, u.redoMenuLabel, u.canRedo())
            frame.menu.enableMenu(menu, u.undoMenuLabel, u.canUndo())
    //@+node:felix.20211026230613.77: *4* u.onSelect & helpers
    public onSelect(self, old_p, p):
        const u:Undoer = this;
        if u.per_node_undo:
            if old_p and u.beads:
                u.putIvarsToVnode(old_p)
            u.setIvarsFromVnode(p)
            u.setUndoTypes()
    //@+node:felix.20211026230613.78: *5* u.putIvarsToVnode
    public putIvarsToVnode(self, p):

        u, v = self, p.v
        assert self.per_node_undo
        bunch = g.bunch()
        for (let key in self.optionalIvars)
            bunch[key] = getattr(u, key)
        // Put these ivars by hand.
        for (let key in ('bead', 'beads', 'undoType',))
            bunch[key] = getattr(u, key)
        v.undo_info = bunch
    //@+node:felix.20211026230613.79: *5* u.setIvarsFromVnode
    public setIvarsFromVnode(self, p):
        const u:Undoer = this;
        v = p.v
        assert self.per_node_undo
        u.clearUndoState()
        if hasattr(v, 'undo_info'):
            u.setIvarsFromBunch(v.undo_info)
    //@+node:felix.20211026230613.80: *4* u.updateAfterTyping
    public updateAfterTyping(self, p, w):
        """
        Perform all update tasks after changing body text.

        This is ugly, ad-hoc code, but should be done uniformly.
        """
        const c:Commands = this.c;
        if g.isTextWrapper(w):
            // An important, ever-present unit test.
            all = w.getAllText()
            if g.unitTesting:
                assert p.b == all, (w, g.callers())
            elif p.b != all:
                g.trace(
                    f"\np.b != w.getAllText() p: {p.h} \n"
                    f"w: {w!r} \n{g.callers()}\n")
                # g.printObj(g.splitLines(p.b), tag='p.b')
                # g.printObj(g.splitLines(all), tag='getAllText')
            p.v.insertSpot = ins = w.getInsertPoint()
            // From u.doTyping.
            newSel = w.getSelectionRange()
            if newSel is None:
                p.v.selectionStart, p.v.selectionLength = (ins, 0)
            else:
                i, j = newSel
                p.v.selectionStart, p.v.selectionLength = (i, j - i)
        else:
            if g.unitTesting:
                assert False, f"Not a text wrapper: {g.callers()}"
            g.trace('Not a text wrapper')
            p.v.insertSpot = 0
            p.v.selectionStart, p.v.selectionLength = (0, 0)
        //
        // #1749.
        if p.isDirty():
            redraw_flag = False
        else:
            p.setDirty()  # Do not call p.v.setDirty!
            redraw_flag = True
        if not c.isChanged():
            c.setChanged()
        // Update editors.
        c.frame.body.updateEditors()
        // Update icons.
        val = p.computeIcon()
        if not hasattr(p.v, "iconVal") or val != p.v.iconVal:
            p.v.iconVal = val
            redraw_flag = True
        //
        // Recolor the body.
        c.frame.scanForTabWidth(p)  # Calls frame.setTabWidth()
        c.recolor()
        if redraw_flag:
            c.redraw_after_icons_changed()
        w.setFocus()
    //@+node:felix.20211026230613.81: *3* u.redo
    @cmd('redo')
    public redo(self, event=None):
        """Redo the operation undone by the last undo."""
        c, u = self.c, self
        if not c.p:
            return
        // End editing *before* getting state.
        c.endEditing()
        if not u.canRedo():
            return
        if not u.getBead(u.bead + 1):
            return
        //
        // Init status.
        u.redoing = True
        u.groupCount = 0
        if u.redoHelper:
            u.redoHelper()
        else:
            g.trace(f"no redo helper for {u.kind} {u.undoType}")
        //
        // Finish.
        c.checkOutline()
        u.update_status()
        u.redoing = False
        u.bead += 1
        u.setUndoTypes()
    //@+node:felix.20211026230613.82: *3* u.redo helpers
    //@+node:felix.20211026230613.83: *4*  u.reloadHelper (do nothing)
    /**
     * The default do-nothing redo helper.
     */
    public redoHelper()
        pass
    //@+node:felix.20211026230613.84: *4* u.redoChangeBody
    public redoChangeBody()
        c, u, w = self.c, self, self.c.frame.body.wrapper
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:  # #1333.
            c.selectPosition(u.p)
        u.p.setDirty()
        u.p.b = u.newBody
        u.p.h = u.newHead
        // This is required so. Otherwise redraw will revert the change!
        c.frame.tree.setHeadline(u.p, u.newHead)
        if u.newMarked:
            u.p.setMarked()
        else:
            u.p.clearMarked()
        if u.groupCount == 0:
            w.setAllText(u.newBody)
            i, j = u.newSel
            w.setSelectionRange(i, j, insert=u.newIns)
            w.setYScrollPosition(u.newYScroll)
            c.frame.body.recolor(u.p)
        u.updateMarks('new')
        u.p.setDirty()
    //@+node:felix.20211026230613.85: *4* u.redoChangeHeadline
    public redoChangeHeadline()
        c, u = self.c, self
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:  # #1333.
            c.selectPosition(u.p)
        u.p.setDirty()
        c.frame.body.recolor(u.p)
        // Restore the headline.
        u.p.initHeadString(u.newHead)
        // This is required so.  Otherwise redraw will revert the change!
        c.frame.tree.setHeadline(u.p, u.newHead)
    //@+node:felix.20211026230613.86: *4* u.redoClearRecentFiles
    public redoClearRecentFiles()
        const u:Undoer = this;
        const c:Commands = u.c;
        rf = g.app.recentFilesManager
        rf.setRecentFiles(u.newRecentFiles[:])
        rf.createRecentFilesMenuItems(c)
    //@+node:felix.20211026230613.87: *4* u.redoCloneMarkedNodes
    public redoCloneMarkedNodes()
        const u:Undoer = this;
        const c:Commands = u.c;
        c.selectPosition(u.p)
        c.cloneMarked()
        u.newP = c.p
    //@+node:felix.20211026230613.88: *4* u.redoCopyMarkedNodes
    public redoCopyMarkedNodes()
        const u:Undoer = this;
        const c:Commands = u.c;
        c.selectPosition(u.p)
        c.copyMarked()
        u.newP = c.p
    //@+node:felix.20211026230613.89: *4* u.redoCloneNode
    public redoCloneNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        cc = c.chapterController
        if cc:
            cc.selectChapterByName('main')
        if u.newBack:
            u.newP._linkAfter(u.newBack)
        elif u.newParent:
            u.newP._linkAsNthChild(u.newParent, 0)
        else:
            u.newP._linkAsRoot()
        c.selectPosition(u.newP)
        u.newP.setDirty()
    //@+node:felix.20211026230613.90: *4* u.redoDeleteMarkedNodes
    public redoDeleteMarkedNodes()
        const u:Undoer = this;
        const c:Commands = u.c;
        c.selectPosition(u.p)
        c.deleteMarked()
        c.selectPosition(u.newP)
    //@+node:felix.20211026230613.91: *4* u.redoDeleteNode
    public redoDeleteNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        c.selectPosition(u.p)
        c.deleteOutline()
        c.selectPosition(u.newP)
    //@+node:felix.20211026230613.92: *4* u.redoDemote
    public redoDemote()
        const u:Undoer = this;
        const c:Commands = u.c;
        parent_v = u.p._parentVnode()
        n = u.p.childIndex()
        // Move the demoted nodes from the old parent to the new parent.
        parent_v.children = parent_v.children[: n + 1]
        u.p.v.children.extend(u.followingSibs)
        // Adjust the parent links of the moved nodes.
        // There is no need to adjust descendant links.
        for v in u.followingSibs:
            v.parents.remove(parent_v)
            v.parents.append(u.p.v)
        u.p.setDirty()
        c.setCurrentPosition(u.p)
    //@+node:felix.20211026230613.93: *4* u.redoGroup
    /**
     * Process beads until the matching 'afterGroup' bead is seen.
     */
    public redoGroup()
        const u:Undoer = this;
        // Remember these values.
        const c:Commands = u.c;
        newSel = u.newSel
        p = u.p.copy()
        u.groupCount += 1;
        bunch = u.beads[u.bead + 1]
        count = 0
        if not hasattr(bunch, 'items'):
            g.trace(f"oops: expecting bunch.items. got bunch.kind = {bunch.kind}")
            g.trace(bunch)
        else:
            for z in bunch.items:
                u.setIvarsFromBunch(z)
                if z.redoHelper:
                    z.redoHelper()
                    count += 1;
                else:
                    g.trace(f"oops: no redo helper for {u.undoType} {p.h}")
        u.groupCount -= 1
        u.updateMarks('new')  # Bug fix: Leo 4.4.6.
        if not g.unitTesting and u.verboseUndoGroup:
            g.es("redo", count, "instances")
        p.setDirty()
        c.selectPosition(p)
        if newSel:
            i, j = newSel
            c.frame.body.wrapper.setSelectionRange(i, j)
    //@+node:felix.20211026230613.94: *4* u.redoHoistNode & redoDehoistNode
    public redoHoistNode()
        c, u = self.c, self
        u.p.setDirty()
        c.selectPosition(u.p)
        c.hoist()

    public redoDehoistNode()
        c, u = self.c, self
        u.p.setDirty()
        c.selectPosition(u.p)
        c.dehoist()
    //@+node:felix.20211026230613.95: *4* u.redoInsertNode
    public redoInsertNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        cc = c.chapterController
        if cc:
            cc.selectChapterByName('main')
        if u.newBack:
            u.newP._linkAfter(u.newBack)
        elif u.newParent:
            u.newP._linkAsNthChild(u.newParent, 0)
        else:
            u.newP._linkAsRoot()
        if u.pasteAsClone:
            for bunch in u.afterTree:
                v = bunch.v
                if u.newP.v == v:
                    u.newP.b = bunch.body
                    u.newP.h = bunch.head
                else:
                    v.setBodyString(bunch.body)
                    v.setHeadString(bunch.head)
        u.newP.setDirty()
        c.selectPosition(u.newP)
    //@+node:felix.20211026230613.96: *4* u.redoMark
    public redoMark()
        const u:Undoer = this;
        const c:Commands = u.c;
        u.updateMarks('new')
        if u.groupCount == 0:
            u.p.setDirty()
            c.selectPosition(u.p)
    //@+node:felix.20211026230613.97: *4* u.redoMove
    public redoMove()
        const u:Undoer = this;
        const c:Commands = u.c;
        cc = c.chapterController
        v = u.p.v
        assert u.oldParent_v
        assert u.newParent_v
        assert v
        if cc:
            cc.selectChapterByName('main')
        // Adjust the children arrays of the old parent.
        assert u.oldParent_v.children[u.oldN] == v
        del u.oldParent_v.children[u.oldN]
        u.oldParent_v.setDirty()
        // Adjust the children array of the new parent.
        parent_v = u.newParent_v
        parent_v.children.insert(u.newN, v)
        v.parents.append(u.newParent_v)
        v.parents.remove(u.oldParent_v)
        u.newParent_v.setDirty()
        //
        u.updateMarks('new')
        u.newP.setDirty()
        c.selectPosition(u.newP)
    //@+node:felix.20211026230613.98: *4* u.redoNodeContents
    public redoNodeContents()
        c, u = self.c, self
        const w:any = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:  # #1333.
            c.selectPosition(u.p)
        u.p.setDirty()
        // Restore the body.
        u.p.setBodyString(u.newBody)
        w.setAllText(u.newBody)
        c.frame.body.recolor(u.p)
        // Restore the headline.
        u.p.initHeadString(u.newHead)
        // This is required so.  Otherwise redraw will revert the change!
        c.frame.tree.setHeadline(u.p, u.newHead)  # New in 4.4b2.
        if u.groupCount == 0 and u.newSel:
            i, j = u.newSel
            w.setSelectionRange(i, j)
        if u.groupCount == 0 and u.newYScroll is not None:
            w.setYScrollPosition(u.newYScroll)
        u.updateMarks('new')
        u.p.setDirty()
    //@+node:felix.20211026230613.99: *4* u.redoPromote
    public redoPromote()
        const u:Undoer = this;
        const c:Commands = u.c;
        parent_v = u.p._parentVnode()
        // Add the children to parent_v's children.
        n = u.p.childIndex() + 1
        old_children = parent_v.children[:]
        parent_v.children = old_children[:n]
            // Add children up to the promoted nodes.
        parent_v.children.extend(u.children)
            // Add the promoted nodes.
        parent_v.children.extend(old_children[n:])
            // Add the children up to the promoted nodes.
        // Remove the old children.
        u.p.v.children = []
        // Adjust the parent links in the moved children.
        // There is no need to adjust descendant links.
        for child in u.children:
            child.parents.remove(u.p.v)
            child.parents.append(parent_v)
        u.p.setDirty()
        c.setCurrentPosition(u.p)
    //@+node:felix.20211026230613.100: *4* u.redoSort
    public redoSort()
        const u:Undoer = this;
        const c:Commands = u.c;
        parent_v = u.p._parentVnode()
        parent_v.children = u.newChildren
        p = c.setPositionAfterSort(u.sortChildren)
        p.setAllAncestorAtFileNodesDirty()
        c.setCurrentPosition(p)
    //@+node:felix.20211026230613.101: *4* u.redoTree
    /**
     * Redo replacement of an entire tree.
     */
    public redoTree()
        const u:Undoer = this;
        const c:Commands = u.c;
        u.p = self.undoRedoTree(u.p, u.oldTree, u.newTree)
        u.p.setDirty()
        c.selectPosition(u.p)  # Does full recolor.
        if u.newSel:
            i, j = u.newSel
            c.frame.body.wrapper.setSelectionRange(i, j)
    //@+node:felix.20211026230613.102: *4* u.redoTyping
    public redoTyping()
        const u:Undoer = this;
        const c:Commands = u.c;
        current = c.p
        const w:any = c.frame.body.wrapper;
        // selectPosition causes recoloring, so avoid if possible.
        if current != u.p:
            c.selectPosition(u.p)
        u.p.setDirty()
        u.undoRedoText(
            u.p, u.leading, u.trailing,
            u.newMiddleLines, u.oldMiddleLines,
            u.newNewlines, u.oldNewlines,
            tag="redo", undoType=u.undoType)
        u.updateMarks('new')
        if u.newSel:
            c.bodyWantsFocus()
            i, j = u.newSel
            w.setSelectionRange(i, j, insert=j)
        if u.yview:
            c.bodyWantsFocus()
            w.setYScrollPosition(u.yview)
    //@+node:felix.20211026230613.103: *3* u.undo
    @cmd('undo')
    public undo(self, event=None):
        """Undo the operation described by the undo parameters."""
        const u:Undoer = this;
        const c:Commands = u.c;
        if not c.p:
            g.trace('no current position')
            return
        // End editing *before* getting state.
        c.endEditing()
        if u.per_node_undo:  # 2011/05/19
            u.setIvarsFromVnode(c.p)
        if not u.canUndo():
            return
        if not u.getBead(u.bead):
            return
        //
        // Init status.
        u.undoing = True
        u.groupCount = 0
        //
        // Dispatch.
        if u.undoHelper:
            u.undoHelper()
        else:
            g.trace(f"no undo helper for {u.kind} {u.undoType}")
        //
        // Finish.
        c.checkOutline()
        u.update_status()
        u.undoing = False
        u.bead -= 1
        u.setUndoTypes()
    //@+node:felix.20211026230613.104: *3* u.undo helpers
    //@+node:felix.20211026230613.105: *4*  u.undoHeoper
    /**
     * The default do-nothing undo helper.
     */
    public undoHelper()
        pass
    //@+node:felix.20211026230613.106: *4* u.undoChangeBody
    public undoChangeBody()
        """
        Undo all changes to the contents of a node,
        including headline and body text, and marked bits.
        """
        c, u, w = self.c, self, self.c.frame.body.wrapper
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:
            c.selectPosition(u.p)
        u.p.setDirty()
        u.p.b = u.oldBody
        u.p.h = u.oldHead
        // This is required.  Otherwise c.redraw will revert the change!
        c.frame.tree.setHeadline(u.p, u.oldHead)
        if u.oldMarked:
            u.p.setMarked()
        else:
            u.p.clearMarked()
        if u.groupCount == 0:
            w.setAllText(u.oldBody)
            i, j = u.oldSel
            w.setSelectionRange(i, j, insert=u.oldIns)
            w.setYScrollPosition(u.oldYScroll)
            c.frame.body.recolor(u.p)
        u.updateMarks('old')
    //@+node:felix.20211026230613.107: *4* u.undoChangeHeadline
    /**
     * Undo a change to a node's headline.
     */
    public undoChangeHeadline()
        c, u = self.c, self
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:  # #1333.
            c.selectPosition(u.p)
        u.p.setDirty()
        c.frame.body.recolor(u.p)
        u.p.initHeadString(u.oldHead)
        // This is required.  Otherwise c.redraw will revert the change!
        c.frame.tree.setHeadline(u.p, u.oldHead)
    //@+node:felix.20211026230613.108: *4* u.undoClearRecentFiles
    public undoClearRecentFiles()
        const u:Undoer = this;
        const c:Commands = u.c;
        rf = g.app.recentFilesManager
        rf.setRecentFiles(u.oldRecentFiles[:])
        rf.createRecentFilesMenuItems(c)
    //@+node:felix.20211026230613.109: *4* u.undoCloneMarkedNodes
    public undoCloneMarkedNodes()
        const u:Undoer = this;
        next = u.p.next()
        assert next.h == 'Clones of marked nodes', (u.p, next.h)
        next.doDelete()
        u.p.setAllAncestorAtFileNodesDirty()
        u.c.selectPosition(u.p)
    //@+node:felix.20211026230613.110: *4* u.undoCloneNode
    public undoCloneNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        cc = c.chapterController
        if cc:
            cc.selectChapterByName('main')
        c.selectPosition(u.newP)
        c.deleteOutline()
        u.p.setDirty()
        c.selectPosition(u.p)
    //@+node:felix.20211026230613.111: *4* u.undoCopyMarkedNodes
    public undoCopyMarkedNodes()
        const u:Undoer = this;
        next = u.p.next()
        assert next.h == 'Copies of marked nodes', (u.p.h, next.h)
        next.doDelete()
        u.p.setAllAncestorAtFileNodesDirty()
        u.c.selectPosition(u.p)
    //@+node:felix.20211026230613.112: *4* u.undoDeleteMarkedNodes
    public undoDeleteMarkedNodes()
        const u:Undoer = this;
        const c:Commands = u.c;
        // Undo the deletes in reverse order
        aList = u.deleteMarkedNodesData[:]
        aList.reverse()
        for p in aList:
            if p.stack:
                parent_v, junk = p.stack[-1]
            else:
                parent_v = c.hiddenRootNode
            p.v._addLink(p._childIndex, parent_v)
            p.v.setDirty()
        u.p.setAllAncestorAtFileNodesDirty()
        c.selectPosition(u.p)
    //@+node:felix.20211026230613.113: *4* u.undoDeleteNode
    public undoDeleteNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        if u.oldBack:
            u.p._linkAfter(u.oldBack)
        elif u.oldParent:
            u.p._linkAsNthChild(u.oldParent, 0)
        else:
            u.p._linkAsRoot()
        u.p.setDirty()
        c.selectPosition(u.p)
    //@+node:felix.20211026230613.114: *4* u.undoDemote
    public undoDemote()
        const u:Undoer = this;
        const c:Commands = u.c;
        parent_v = u.p._parentVnode()
        n = len(u.followingSibs)
        // Remove the demoted nodes from p's children.
        u.p.v.children = u.p.v.children[: -n]
        // Add the demoted nodes to the parent's children.
        parent_v.children.extend(u.followingSibs)
        // Adjust the parent links.
        // There is no need to adjust descendant links.
        parent_v.setDirty()
        for sib in u.followingSibs:
            sib.parents.remove(u.p.v)
            sib.parents.append(parent_v)
        u.p.setAllAncestorAtFileNodesDirty()
        c.setCurrentPosition(u.p)
    //@+node:felix.20211026230613.115: *4* u.undoGroup
    /**
     * Process beads until the matching 'beforeGroup' bead is seen.
     */
    public undoGroup()
        const u:Undoer = this;
        // Remember these values.
        const c:Commands = u.c;
        oldSel = u.oldSel;
        p = u.p.copy();
        u.groupCount += 1;
        bunch = u.beads[u.bead];
        count = 0;
        if not hasattr(bunch, 'items'):
            g.trace(f"oops: expecting bunch.items. got bunch.kind = {bunch.kind}")
            g.trace(bunch)
        else:
            // Important bug fix: 9/8/06: reverse the items first.
            reversedItems = bunch.items[:]
            reversedItems.reverse()
            for z in reversedItems:
                u.setIvarsFromBunch(z)
                if z.undoHelper:
                    z.undoHelper()
                    count += 1;
                else:
                    g.trace(f"oops: no undo helper for {u.undoType} {p.v}")
        u.groupCount -= 1
        u.updateMarks('old')  # Bug fix: Leo 4.4.6.
        if not g.unitTesting and u.verboseUndoGroup:
            g.es("undo", count, "instances")
        p.setDirty()
        c.selectPosition(p)
        if oldSel:
            i, j = oldSel
            c.frame.body.wrapper.setSelectionRange(i, j)
    //@+node:felix.20211026230613.116: *4* u.undoHoistNode & undoDehoistNode
    public undoHoistNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        u.p.setDirty()
        c.selectPosition(u.p)
        c.dehoist()

    public undoDehoistNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        u.p.setDirty();
        c.selectPosition(u.p);
        c.hoist();
    //@+node:felix.20211026230613.117: *4* u.undoInsertNode
    public undoInsertNode()
        const u:Undoer = this;
        const c:Commands = u.c;
        cc = c.chapterController
        if cc:
            cc.selectChapterByName('main')
        u.newP.setAllAncestorAtFileNodesDirty()
        c.selectPosition(u.newP)
        c.deleteOutline()
            // Bug fix: 2016/03/30.
            // This always selects the proper new position.
            // c.selectPosition(u.p)
        if u.pasteAsClone:
            for bunch in u.beforeTree:
                v = bunch.v
                if u.p.v == v:
                    u.p.b = bunch.body
                    u.p.h = bunch.head
                else:
                    v.setBodyString(bunch.body)
                    v.setHeadString(bunch.head)
    //@+node:felix.20211026230613.118: *4* u.undoMark
    public undoMark()
        const u:Undoer = this;
        const c:Commands = u.c;
        u.updateMarks('old');
        if u.groupCount == 0:
            u.p.setDirty();
            c.selectPosition(u.p);
    //@+node:felix.20211026230613.119: *4* u.undoMove
    public undoMove()
        const u:Undoer = this;
        const c:Commands = u.c;
        cc = c.chapterController
        if cc:
            cc.selectChapterByName('main')
        v = u.p.v
        assert u.oldParent_v
        assert u.newParent_v
        assert v
        // Adjust the children arrays.
        assert u.newParent_v.children[u.newN] == v
        del u.newParent_v.children[u.newN]
        u.oldParent_v.children.insert(u.oldN, v)
        // Recompute the parent links.
        v.parents.append(u.oldParent_v)
        v.parents.remove(u.newParent_v)
        u.updateMarks('old')
        u.p.setDirty()
        c.selectPosition(u.p)
    //@+node:felix.20211026230613.120: *4* u.undoNodeContents
    public undoNodeContents()
        """
        Undo all changes to the contents of a node,
        including headline and body text, and marked bits.
        """
        c, u = self.c, self
        const w:any = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:  # #1333.
            c.selectPosition(u.p)
        u.p.setDirty()
        u.p.b = u.oldBody
        w.setAllText(u.oldBody)
        c.frame.body.recolor(u.p)
        u.p.h = u.oldHead
        // This is required.  Otherwise c.redraw will revert the change!
        c.frame.tree.setHeadline(u.p, u.oldHead)
        if u.groupCount == 0 and u.oldSel:
            i, j = u.oldSel
            w.setSelectionRange(i, j)
        if u.groupCount == 0 and u.oldYScroll is not None:
            w.setYScrollPosition(u.oldYScroll)
        u.updateMarks('old')
    //@+node:felix.20211026230613.121: *4* u.undoPromote
    public undoPromote()
        const u:Undoer = this;
        const c:Commands = u.c;
        parent_v = u.p._parentVnode()  # The parent of the all the *promoted* nodes.
        // Remove the promoted nodes from parent_v's children.
        n = u.p.childIndex() + 1
        // Adjust the old parents children
        old_children = parent_v.children
        parent_v.children = old_children[:n]
            // Add the nodes before the promoted nodes.
        parent_v.children.extend(old_children[n + len(u.children) :])
            // Add the nodes after the promoted nodes.
        // Add the demoted nodes to v's children.
        u.p.v.children = u.children[:]
        // Adjust the parent links.
        // There is no need to adjust descendant links.
        parent_v.setDirty()
        for child in u.children:
            child.parents.remove(parent_v)
            child.parents.append(u.p.v)
        u.p.setAllAncestorAtFileNodesDirty()
        c.setCurrentPosition(u.p)
    //@+node:felix.20211026230613.122: *4* u.undoRedoText
    public undoRedoText(self, p,
        leading, trailing,  # Number of matching leading & trailing lines.
        oldMidLines, newMidLines,  # Lists of unmatched lines.
        oldNewlines, newNewlines,  # Number of trailing newlines.
        tag="undo",  # "undo" or "redo"
        undoType=None
    ):
        """Handle text undo and redo: converts _new_ text into _old_ text."""
        // newNewlines is unused, but it has symmetry.
        const u:Undoer = this;
        const c:Commands = u.c;
        const w:any = c.frame.body.wrapper;
        //@+<< Compute the result using p's body text >>
        //@+node:felix.20211026230613.123: *5* << Compute the result using p's body text >>
        // Recreate the text using the present body text.
        body = p.b
        body = g.checkUnicode(body)
        body_lines = body.split('\n')
        s = []
        if leading > 0:
            s.extend(body_lines[:leading])
        if oldMidLines:
            s.extend(oldMidLines)
        if trailing > 0:
            s.extend(body_lines[-trailing :])
        s = '\n'.join(s)
        // Remove trailing newlines in s.
        while s and s[-1] == '\n':
            s = s[:-1]
        // Add oldNewlines newlines.
        if oldNewlines > 0:
            s = s + '\n' * oldNewlines
        result = s
        //@-<< Compute the result using p's body text >>
        p.setBodyString(result)
        p.setDirty()
        w.setAllText(result)
        sel = u.oldSel if tag == 'undo' else u.newSel
        if sel:
            i, j = sel
            w.setSelectionRange(i, j, insert=j)
        c.frame.body.recolor(p)
        w.seeInsertPoint()  # 2009/12/21
    //@+node:felix.20211026230613.124: *4* u.undoRedoTree
    /**
     * Replace p and its subtree using old_data during undo.
     */
    public undoRedoTree(self, p, new_data, old_data):
        // Same as undoReplace except uses g.Bunch.
        const u:Undoer = this;
        const c:Commands = u.c;
        if new_data is None:
            // This is the first time we have undone the operation.
            // Put the new data in the bead.
            bunch = u.beads[u.bead]
            bunch.newTree = u.saveTree(p.copy())
            u.beads[u.bead] = bunch
        // Replace data in tree with old data.
        u.restoreTree(old_data)
        c.setBodyString(p, p.b)  # This is not a do-nothing.
        return p  # Nothing really changes.
    //@+node:felix.20211026230613.125: *4* u.undoSort
    public undoSort()
        const u:Undoer = this;
        const c:Commands = u.c;
        parent_v = u.p._parentVnode()
        parent_v.children = u.oldChildren
        p = c.setPositionAfterSort(u.sortChildren)
        p.setAllAncestorAtFileNodesDirty()
        c.setCurrentPosition(p)
    //@+node:felix.20211026230613.126: *4* u.undoTree
    /**
     * Redo replacement of an entire tree.
     */
    public undoTree()
        const u:Undoer = this;
        const c:Commands = u.c;
        u.p = self.undoRedoTree(u.p, u.newTree, u.oldTree)
        u.p.setAllAncestorAtFileNodesDirty()
        c.selectPosition(u.p)  # Does full recolor.
        if u.oldSel:
            i, j = u.oldSel
            c.frame.body.wrapper.setSelectionRange(i, j)
    //@+node:felix.20211026230613.127: *4* u.undoTyping
    public undoTyping()
        c, u = self.c, self
        const w:any = c.frame.body.wrapper;
        // selectPosition causes recoloring, so don't do this unless needed.
        if c.p != u.p:
            c.selectPosition(u.p)
        u.p.setDirty()
        u.undoRedoText(
            u.p, u.leading, u.trailing,
            u.oldMiddleLines, u.newMiddleLines,
            u.oldNewlines, u.newNewlines,
            tag="undo", undoType=u.undoType)
        u.updateMarks('old')
        if u.oldSel:
            c.bodyWantsFocus()
            i, j = u.oldSel
            w.setSelectionRange(i, j, insert=j)
        if u.yview:
            c.bodyWantsFocus()
            w.setYScrollPosition(u.yview)
    //@+node:felix.20211026230613.128: *3* u.update_status
    public update_status()
        """
        Update status after either an undo or redo:
        """
        c, u = self.c, self
        const w:any = c.frame.body.wrapper;
        // Redraw and recolor.
        c.frame.body.updateEditors()  # New in Leo 4.4.8.
        //
        // Set the new position.
        if 0:  # Don't do this: it interferes with selection ranges.
            // This strange code forces a recomputation of the root position.
            c.selectPosition(c.p)
        else:
            c.setCurrentPosition(c.p)
        //
        // # 1451. *Always* set the changed bit.
        // Redrawing *must* be done here before setting u.undoing to False.
        i, j = w.getSelectionRange()
        ins = w.getInsertPoint()
        c.redraw()
        c.recolor()
        if u.inHead:
            c.editHeadline()
            u.inHead = False
        else:
            c.bodyWantsFocus()
            w.setSelectionRange(i, j, insert=ins)
            w.seeInsertPoint()
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
