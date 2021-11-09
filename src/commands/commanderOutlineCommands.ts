//@+leo-ver=5-thin
//@+node:felix.20211002221425.1: * @file src/commands/commanderOutlineCommands.ts
// * Outline commands that used to be defined in leoCommands.py
// import xml.etree.ElementTree as ElementTree
// from leo.core import leoGlobals as g
import * as g from '../core/leoGlobals';

// import g = require("../core/leoGlobals");
import { commander_command } from "../core/decorators";

// from leo.core import leoNodes
import { NodeIndices, Position, VNode } from "../core/leoNodes";

// from leo.core import leoFileCommands
import { FileCommands } from "../core/leoFileCommands";
import { Commands, HoistStackEntry } from "../core/leoCommands";
import { Bead, Undoer } from '../core/leoUndo';

//@+others
//@+node:felix.20211101020339.1: ** function cantMoveMessage
function cantMoveMessage(c: Commands): void {
    const h: string = c.rootPosition()!.h;
    const kind: string = h.startsWith('@chapter') ? 'chapter' : 'hoist';
    g.warning("can't move node out of", kind);
}
//@+node:felix.20211101230134.1: ** function createMoveMarkedNode
function createMoveMarkedNode(c: Commands): Position {
    const oldRoot = c.rootPosition()!;
    const p = oldRoot.insertAfter();
    p.h = 'Moved marked nodes';
    p.moveToRoot();
    return p;
}
//@+node:felix.20211101020440.1: ** Class CommanderOutlineCommands
export class CommanderOutlineCommands {

    //@+others
    //@+node:felix.20211020000219.1: *3* c_oc.dumpOutline
    @commander_command(
        'dump-outline',
        'Dump all nodes in the outline.'
    )
    public dumpOutline(this: Commands): void {
        const c: Commands = this;
        const seen: { [key: string]: boolean } = {};
        console.log('');
        console.log('='.repeat(40));
        const v = c.hiddenRootNode;
        v.dump();
        seen[v.gnx] = true;
        for (let p of c.all_positions()) {
            if (!seen[p.v.gnx])
                seen[p.v.gnx] = true;
            p.v.dump();
        }
    }
    //@+node:felix.20211020002058.1: *3* c_oc.Expand & contract commands
    //@+node:felix.20211020002058.2: *4* c_oc.contract-all
    @commander_command(
        'contract-all',
        'Contract all nodes in the outline.'
    )
    public contractAllHeadlinesCommand(this: Commands): void {
        // The helper does all the work.
        const c: Commands = this;
        c.contractAllHeadlines();
    }
    //@+node:felix.20211020002058.3: *4* c_oc.contractAllOtherNodes & helper
    @commander_command(
        'contract-all-other-nodes',
        'Contract all nodes except those needed to make the\n' +
        'presently selected node visible.'
    )
    public contractAllOtherNodes(this: Commands): void {
        const c: Commands = this;
        const leaveOpen: Position = c.p;
        for (let p of c.rootPosition()!.self_and_siblings()) {
            this.contractIfNotCurrent(p, leaveOpen);
        }
    }

    private contractIfNotCurrent(this: Commands, p: Position, leaveOpen: Position): void {
        if (p.__eq__(leaveOpen) || !p.isAncestorOf(leaveOpen)) {
            p.contract();
        }
        for (let child of p.children()) {
            if (!child.__eq__(leaveOpen) && child.isAncestorOf(leaveOpen)) {
                this.contractIfNotCurrent(child, leaveOpen);
            } else {
                for (let p2 of child.self_and_subtree()) {
                    p2.contract();
                }
            }
        }
    }

    //@+node:felix.20211020002058.5: *4* c_oc.contractAllSubheads (new)
    @commander_command(
        'contract-all-subheads',
        'Contract all children of the presently selected node.'
    )
    public contractAllSubheads(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        let child = p.firstChild();
        c.contractSubtree(p);
        while (child && child.__bool__()) {
            c.contractSubtree(child)
            child = child.next()
        }
    }
    //@+node:felix.20211020002058.6: *4* c_oc.contractNode
    @commander_command(
        'contract-node',
        'Contract the presently selected node.'
    )
    public contractNode(this: Commands): void {
        const c: Commands = this;
        let p = c.p;
        // c.endEditing() // not in leojs
        p.contract();
        // c.redraw_after_contract(p) // not in leojs
        c.selectPosition(p);
    }
    //@+node:felix.20211020002058.7: *4* c_oc.contractNodeOrGoToParent
    @commander_command(
        'contract-or-go-left',
        'Simulate the left Arrow Key in folder of Windows Explorer.'
    )
    public contractNodeOrGoToParent(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const cc = this.chapterController;

        const parent: Position = p.parent();

        // Bug fix: 2016/04/19: test p.v.isExpanded().
        if (p.hasChildren() && (p.v.isExpanded() || p.isExpanded())) {
            c.contractNode()
        } else if (parent && parent.isVisible(c)) {
            // Contract all children first.
            if (c.collapse_on_lt_arrow) {
                for (let child of parent.children()) {
                    if (child.isExpanded()) {
                        child.contract();
                    }
                }
            }
            if (cc && cc.inChapter && parent.h.startsWith('@chapter ')) {
                // pass
            } else {
                c.goToParent();
            }
        }
    }
    //@+node:felix.20211020002058.8: *4* c_oc.contractParent
    @commander_command(
        'contract-parent',
        'Contract the parent of the presently selected node.'
    )
    public contractParent(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        const parent = p.parent();
        if (!parent || !parent.__bool__()) {
            return;
        }
        parent.contract();
        c.selectPosition(parent)
    }

    //@+node:felix.20211020002058.9: *4* c_oc.expandAllHeadlines
    @commander_command(
        'expand-all',
        'Expand all headlines.\n' +
        'Warning: this can take a long time for large outlines.'
    )
    public expandAllHeadlines(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        while (p && p.__bool__()) {
            c.expandSubtree(p);
            p.moveToNext();
        }
        c.selectPosition(c.rootPosition()!);
        c.expansionLevel = 0;  // Reset expansion level.
    }
    //@+node:felix.20211020002058.10: *4* c_oc.expandAllSubheads
    @commander_command(
        'expand-all-subheads',
        'Expand all children of the presently selected node.'
    )
    public expandAllSubheads(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        let child = p.firstChild();
        c.expandSubtree(p);
        while (child && child.__bool__()) {
            c.expandSubtree(child);
            child = child.next();
        }
        c.selectPosition(p)
    }
    //@+node:felix.20211020002058.11: *4* c_oc.expandLevel1..9
    @commander_command(
        'expand-to-level-1',
        'Expand the outline to level 1'
    )
    public expandLevel1(this: Commands): void {
        this.expandToLevel(1);
    }

    @commander_command(
        'expand-to-level-2',
        'Expand the outline to level 2'
    )
    public expandLevel2(this: Commands): void {
        this.expandToLevel(2);
    }

    @commander_command(
        'expand-to-level-3',
        'Expand the outline to level 3'
    )
    public expandLevel3(this: Commands): void {
        this.expandToLevel(3);
    }

    @commander_command(
        'expand-to-level-4',
        'Expand the outline to level 4'
    )
    public expandLevel4(this: Commands): void {
        this.expandToLevel(4);
    }

    @commander_command(
        'expand-to-level-5',
        'Expand the outline to level 5'
    )
    public expandLevel5(this: Commands): void {
        this.expandToLevel(5);
    }

    @commander_command(
        'expand-to-level-6',
        'Expand the outline to level 6'
    )
    public expandLevel6(this: Commands): void {
        this.expandToLevel(6);
    }

    @commander_command(
        'expand-to-level-7',
        'Expand the outline to level 7'
    )
    public expandLevel7(this: Commands): void {
        this.expandToLevel(7);
    }

    @commander_command(
        'expand-to-level-8',
        'Expand the outline to level 8'
    )
    public expandLevel8(this: Commands): void {
        this.expandToLevel(8);
    }

    @commander_command(
        'expand-to-level-9',
        'Expand the outline to level 9'
    )
    public expandLevel9(this: Commands): void {
        this.expandToLevel(9);
    }
    //@+node:felix.20211020002058.12: *4* c_oc.expandNextLevel
    @commander_command(
        'expand-next-level',
        'Increase the expansion level of the outline and\n' +
        'Expand all nodes at that level or lower.'
    )
    public expandNextLevel(this: Commands): void {
        const c: Commands = this;
        // Expansion levels are now local to a particular tree.
        if (!c.expansionNode || !c.expansionNode.__eq__(c.p)) {
            c.expansionLevel = 1;
            c.expansionNode = c.p.copy();
        }
        this.expandToLevel(c.expansionLevel + 1);
    }
    //@+node:felix.20211020002058.13: *4* c_oc.expandNode
    @commander_command(
        'expand-node',
        'Expand the presently selected node.'
    )
    public expandNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        // c.endEditing();
        p.expand();
        // c.redraw_after_expand(p);
        c.selectPosition(p);
    }
    //@+node:felix.20211020002058.14: *4* c_oc.expandNodeAndGoToFirstChild
    @commander_command(
        'expand-and-go-right',
        'If a node has children, expand it if needed and go to the first child.'
    )
    public expandNodeAndGoToFirstChild(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        // c.endEditing()
        if (p.hasChildren()) {
            if (!p.isExpanded()) {
                c.expandNode();
            }
            c.selectPosition(p.firstChild());
        }
        // c.treeFocusHelper();
    }
    //@+node:felix.20211020002058.15: *4* c_oc.expandNodeOrGoToFirstChild
    @commander_command(
        'expand-or-go-right',
        'Simulate the Right Arrow Key in folder of Windows Explorer.\n' +
        'if c.p has no children, do nothing.\n' +
        'Otherwise, if c.p is expanded, select the first child.\n' +
        'Otherwise, expand c.p.'
    )
    public expandNodeOrGoToFirstChild(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        // c.endEditing()
        if (p.hasChildren()) {
            if (p.isExpanded()) {
                // c.redraw_after_expand(p.firstChild());
                c.setCurrentPosition(p.firstChild())
            }
            else {
                c.expandNode();
            }
        }
    }
    //@+node:felix.20211020002058.16: *4* c_oc.expandOnlyAncestorsOfNode
    @commander_command(
        'expand-ancestors-only',
        'Contract all nodes in the outline.'
    )
    public expandOnlyAncestorsOfNode(this: Commands, p?: Position): void {
        const c: Commands = this;
        let level = 1;
        if (p?.__bool__()) {
            c.selectPosition(p)  // 2013/12/25
        }
        const root = c.p;
        for (let p of c.all_unique_positions()) {
            p.v.expandedPositions = [];
            p.v.contract();
        }
        for (let p of root.parents()) {
            p.expand();
            level += 1;
        }
        c.expansionLevel = level;  // Reset expansion level.
    }
    //@+node:felix.20211020002058.17: *4* c_oc.expandPrevLevel
    @commander_command(
        'expand-prev-level',
        'Decrease the expansion level of the outline and\n' +
        'Expand all nodes at that level or lower.'
    )
    public expandPrevLevel(this: Commands): void {
        const c: Commands = this;
        // # Expansion levels are now local to a particular tree.
        if (!c.expansionNode || !c.expansionNode.__eq__(c.p)) {
            c.expansionLevel = 1;
            c.expansionNode = c.p.copy();
        }
        this.expandToLevel(Math.max(1, c.expansionLevel - 1));
    }

    //@+node:felix.20211021013709.1: *3* c_oc.Goto commands
    //@+node:felix.20211021013709.2: *4* c_oc.findNextClone
    @commander_command(
        'find-next-clone',
        'Select the next cloned node.'
    )
    public findNextClone(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const cc = c.chapterController;
        if (!p || !p.__bool__()) {
            return;
        }
        if (p.isCloned()) {
            p.moveToThreadNext();
        }
        let flag = false;
        while (p && p.__bool__()) {
            if (p.isCloned()) {
                flag = true;
                break;
            } else {
                p.moveToThreadNext();
            }
        }
        if (flag) {
            if (cc) {
                // name = cc.findChapterNameForPosition(p)
                cc.selectChapterByName('main')
            }
            c.selectPosition(p);
            //c.redraw_after_select(p);
        } else {
            g.blue('no more clones');
        }
    }
    //@+node:felix.20211021013709.3: *4* c_oc.goNextVisitedNode
    @commander_command(
        'go-forward',
        'Select the next visited node.'
    )
    public goNextVisitedNode(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goNext();
        // unused
        /*
        const p: Position = c.nodeHistory.goNext();
        if(p && p.__bool__()) {
            c.nodeHistory.skipBeadUpdate = true;
            try {
                c.selectPosition(p)
            }
            finally {   
                c.nodeHistory.skipBeadUpdate = false;
                // c.redraw_after_select(p)
            }
        }
        */
    }
    //@+node:felix.20211021013709.4: *4* c_oc.goPrevVisitedNode
    @commander_command(
        'go-back',
        'Select the previously visited node.'
    )
    public goPrevVisitedNode(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goPrev();
        // unused
        /*
        p = c.nodeHistory.goPrev()
        if p:
            c.nodeHistory.skipBeadUpdate = true;
            try:
                c.selectPosition(p)
            finally:
                c.nodeHistory.skipBeadUpdate = false
                // c.redraw_after_select(p)
        */
    }
    //@+node:felix.20211021013709.5: *4* c_oc.goToFirstNode
    @commander_command(
        'goto-first-node',
        'Select the first node of the entire outline\n' +
        'But (#2167), go to the first node of a chapter or hoist\n' +
        'if Leo is hoisted or within a chapter.'
    )
    public goToFirstNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        c.expandOnlyAncestorsOfNode(p);
        // c.redraw();
    }
    //@+node:felix.20211021013709.6: *4* c_oc.goToFirstSibling
    @commander_command(
        'goto-first-sibling',
        'Select the first sibling of the selected node.'
    )
    public goToFirstSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (p.hasBack()) {
            while (p.hasBack()) {
                p.moveToBack();
            }
        }
        c.treeSelectHelper(p);
    }
    //@+node:felix.20211021013709.7: *4* c_oc.goToFirstVisibleNode
    @commander_command(
        'goto-first-visible-node',
        'Select the first visible node of the selected chapter or hoist.'
    )
    public goToFirstVisibleNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.firstVisible()
        if (p && p.__bool__()) {
            c.expandOnlyAncestorsOfNode(p);
        }
    }
    //@+node:felix.20211021013709.8: *4* c_oc.goToLastNode
    @commander_command(
        'goto-last-node',
        'Select the last node in the entire tree.'
    )
    public goToLastNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        while (p && p.__bool__() && p.hasThreadNext()) {
            p.moveToThreadNext();
        }
        c.expandOnlyAncestorsOfNode(p)
    }
    //@+node:felix.20211021013709.9: *4* c_oc.goToLastSibling
    @commander_command(
        'goto-last-sibling',
        'Select the last sibling of the selected node.'
    )
    public goToLastSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (p.hasNext()) {
            while (p.hasNext()) {
                p.moveToNext();
            }
        }
        c.treeSelectHelper(p);
    }
    //@+node:felix.20211021013709.10: *4* c_oc.goToLastVisibleNode
    @commander_command(
        'goto-last-visible-node',
        'Select the last visible node of selected chapter or hoist.'
    )
    public goToLastVisibleNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.lastVisible();
        if (p && p.__bool__()) {
            c.expandOnlyAncestorsOfNode(p);
        }
    }
    //@+node:felix.20211021013709.11: *4* c_oc.goToNextClone
    @commander_command(
        'goto-next-clone',
        'Select the next node that is a clone of the selected node.\n' +
        'If the selected node is not a clone, do find-next-clone.'
    )
    public goToNextClone(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        const cc = c.chapterController;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!p.isCloned()) {
            c.findNextClone();
            return;
        }
        const v: VNode = p.v;
        p.moveToThreadNext();
        let wrapped: boolean = false;
        while (1) {
            if (p && p.__bool__() && p.v.gnx === v.gnx) {
                break;
            } else if (p && p.__bool__()) {
                p.moveToThreadNext();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (p && p.__bool__()) {
            c.expandAllAncestors(p);
            if (cc) {
                // #252: goto-next clone activate chapter.
                const chapter = cc.getSelectedChapter();
                const old_name: string | boolean = chapter && chapter.name;
                const new_name: string = cc.findChapterNameForPosition(p);
                if (new_name === old_name) {
                    // Always do a full redraw.
                    //c.redraw(p);
                    c.selectPosition(p)
                } else {
                    c.selectPosition(p)
                    cc.selectChapterByName(new_name);
                }
            } else {
                // Always do a full redraw.
                //c.redraw(p);
                c.selectPosition(p)
            }
        } else {
            g.blue('done');
        }
    }
    //@+node:felix.20211021013709.12: *4* c_oc.goToNextDirtyHeadline
    @commander_command(
        'goto-next-changed',
        'Select the node that is marked as changed.'
    )
    public goToNextDirtyHeadline(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadNext();
        let wrapped = false;
        while (1)
            if (p && p.__bool__() && p.isDirty()) {
                break;
            } else if (p) {
                p.moveToThreadNext();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        if (!p || !p.__bool__())
            g.blue('done')
        c.treeSelectHelper(p)  // Sets focus.
    }
    //@+node:felix.20211021013709.13: *4* c_oc.goToNextMarkedHeadline
    @commander_command(
        'goto-next-marked',
        'Select the next marked node.'
    )
    public goToNextMarkedHeadline(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadNext();
        let wrapped = false;
        while (1) {
            if (p && p.__bool__() && p.isMarked()) {
                break;
            } else if (p) {
                p.moveToThreadNext()
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (!p || !p.__bool__())
            g.blue('done')
        c.treeSelectHelper(p)  // Sets focus.
    }
    //@+node:felix.20211021013709.14: *4* c_oc.goToNextSibling
    @commander_command(
        'goto-next-sibling',
        'Select the next sibling of the selected node.'
    )
    public goToNextSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.next());
    }
    //@+node:felix.20211021013709.15: *4* c_oc.goToParent
    @commander_command(
        'goto-parent',
        'Select the parent of the selected node.'
    )
    public goToParent(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.parent())
    }
    //@+node:felix.20211021013709.16: *4* c_oc.goToPrevMarkedHeadline
    @commander_command(
        'goto-prev-marked',
        'Select the next marked node.'
    )
    public goToPrevMarkedHeadline(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        if (!p || !p.__bool__())
            return;
        p.moveToThreadBack();
        let wrapped = false;
        while (1) {
            if (p && p.__bool__() && p.isMarked()) {
                break;
            } else if (p) {
                p.moveToThreadBack();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (!p || !p.__bool__())
            g.blue('done')
        c.treeSelectHelper(p)  // Sets focus.
    }
    //@+node:felix.20211021013709.17: *4* c_oc.goToPrevSibling
    @commander_command(
        'goto-prev-sibling',
        'Select the previous sibling of the selected node.'
    )
    public goToPrevSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.back());
    }
    //@+node:felix.20211021013709.18: *4* c_oc.selectThreadBack
    @commander_command(
        'goto-prev-node',
        'Select the node preceding the selected node in outline order.'
    )
    public selectThreadBack(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__())
            return;
        p.moveToThreadBack()
        c.treeSelectHelper(p)
    }
    //@+node:felix.20211021013709.19: *4* c_oc.selectThreadNext
    @commander_command(
        'goto-next-node',
        'Select the node following the selected node in outline order.'
    )
    public selectThreadNext(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__())
            return;
        p.moveToThreadNext()
        c.treeSelectHelper(p)
    }
    //@+node:felix.20211021013709.20: *4* c_oc.selectVisBack
    @commander_command(
        'goto-prev-visible',
        'Select the visible node preceding the presently selected node.'
    )
    public selectVisBack(this: Commands): void {
        // This has an up arrow for a control key.
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__())
            return;
        if (c.canSelectVisBack()) {
            p.moveToVisBack(c);
            c.treeSelectHelper(p);
        }
        // else:
        // c.endEditing()  // 2011/05/28: A special case.

    }
    //@+node:felix.20211021013709.21: *4* c_oc.selectVisNext
    @commander_command(
        'goto-next-visible',
        'Select the visible node following the presently selected node.'
    )
    public selectVisNext(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__())
            return;
        if (c.canSelectVisNext()) {
            p.moveToVisNext(c);
            c.treeSelectHelper(p);
        }
        // else:
        // c.endEditing()  // 2011/05/28: A special case.

    }
    //@+node:felix.20211025221132.1: *4* c_oc.treePageUp
    @commander_command(
        'tree-page-up',
        'Outline Page Up.'
    )
    public treePageUp(this: Commands, n = 3): void {
        // This has an up arrow for a control key.
        for (let i = 0; i < n; i++) {
            this.selectVisBack();
        }
    }
    //@+node:felix.20211025221156.1: *4* c_oc.treePageDown
    @commander_command(
        'tree-page-down',
        'Outline Page Down.'
    )
    public treePageDown(this: Commands, n = 3): void {
        // This has an up arrow for a control key.
        for (let i = 0; i < n; i++) {
            this.selectVisNext();
        }
    }
    //@+node:felix.20211031143537.1: *3* c_oc.hoist/dehoist/clearAllHoists
    //@+node:felix.20211031143537.2: *4* c_oc.deHoist
    @commander_command('de-hoist', 'Undo a previous hoist of an outline.')
    @commander_command('dehoist', 'Undo a previous hoist of an outline.')
    public dehoist(this: Commands): void {

        const c: Commands = this;

        if (!c.p || !c.p.__bool__() || !c.hoistStack || !c.hoistStack.length) {
            return;
        }
        // Don't de-hoist an @chapter node.
        if (c.chapterController && c.p.h.startsWith('@chapter ')) {
            if (!g.unitTesting) {
                g.es('can not de-hoist an @chapter node.');
            }
            return;
        }

        const bunch: HoistStackEntry = c.hoistStack.pop()!;
        const p: Position = bunch.p;

        // ! Check if exist BUT FALSE
        if (p && !p.__bool__()) {
            p.expand();
        } else {
            p.contract();
        }
        c.setCurrentPosition(p);

        // TODO : Needed?
        // c.redraw()
        // c.frame.clearStatusLine()
        // c.frame.putStatusLine("De-Hoist: " + p.h)

        c.undoer.afterDehoist(p, 'DeHoist');

        // TODO : Needed?
        // g.doHook('hoist-changed', c=c)
    }
    //@+node:felix.20211031143537.3: *4* c_oc.clearAllHoists
    @commander_command('clear-all-hoists', 'Undo a previous hoist of an outline.')
    public clearAllHoists(this: Commands): void {
        const c: Commands = this;
        c.hoistStack = [];

        // TODO : Needed?
        // c.frame.putStatusLine("Hoists cleared")
        // g.doHook('hoist-changed', c=c)
    }
    //@+node:felix.20211031143537.4: *4* c_oc.hoist
    @commander_command('hoist', 'Make only the selected outline visible.')
    public hoist(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        if (!p || !p.__bool__()) {
            return;
        }
        // Don't hoist an @chapter node.
        if (c.chapterController && p.h.startsWith('@chapter ')) {
            if (!g.unitTesting) {
                g.es('can not hoist an @chapter node.');
            }
            return
        }

        // Remember the expansion state.
        const bunch: HoistStackEntry = {
            p: p.copy(),
            expanded: p.isExpanded()
        };

        c.hoistStack.push(bunch);
        p.expand();

        // TODO : Needed?
        // c.redraw(p);
        // c.frame.clearStatusLine();
        // c.frame.putStatusLine("Hoist: " + p.h);

        c.undoer.afterHoist(p, 'Hoist');

        // TODO : Needed?
        // g.doHook('hoist-changed', c=c);
    }
    //@+node:felix.20211031143555.1: *3* c_oc.Insert, Delete & Clone commands
    //@+node:felix.20211031143555.2: *4* c_oc.clone
    @commander_command('clone-node', 'Create a clone of the selected outline.')
    public clone(this: Commands): Position | undefined {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return undefined;
        }

        const undoData: Bead = c.undoer.beforeCloneNode(p);

        // c.endEditing();  // Capture any changes to the headline.
        const clone: Position = p.clone();
        clone.setDirty();
        c.setChanged();
        if (c.validateOutline()) {
            u.afterCloneNode(clone, 'Clone Node', undoData);

            // TODO : Needed ?
            // c.redraw(clone);
            // c.treeWantsFocus();

            return clone;  // For mod_labels and chapters plugins.
        }
        clone.doDelete();
        c.setCurrentPosition(p);
        return undefined;
    }
    //@+node:felix.20211031143555.3: *4* c_oc.cloneToAtSpot
    @commander_command('clone-to-at-spot',
        'Create a clone of the selected node and move it to the last @spot node\n' +
        'of the outline. Create the @spot node if necessary.'
    )
    public cloneToAtSpot(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return undefined;
        }

        // 2015/12/27: fix bug 220: do not allow clone-to-at-spot on @spot node.
        if (p.h.startsWith('@spot')) {
            g.es("can not clone @spot node");
            return;
        }
        let last_spot: Position | undefined;

        for (let p2 of c.all_positions()) {
            if (g.match_word(p2.h, 0, '@spot')) {
                last_spot = p2.copy();
            }
        }
        if (!last_spot || !last_spot.__bool__()) {
            const last: Position = c.lastTopLevel();
            last_spot = last.insertAfter();
            last_spot.h = '@spot';
        }

        const undoData = c.undoer.beforeCloneNode(p);

        // c.endEditing()  // Capture any changes to the headline.

        const clone: Position = p.copy();
        clone._linkAsNthChild(last_spot, last_spot.numberOfChildren());
        clone.setDirty();
        c.setChanged();

        if (c.validateOutline()) {
            u.afterCloneNode(clone, 'Clone Node', undoData);
            c.contractAllHeadlines();
            // c.redraw();
            c.selectPosition(clone);
        } else {
            clone.doDelete();
            c.setCurrentPosition(p);
        }
    }
    //@+node:felix.20211031143555.4: *4* c_oc.cloneToLastNode
    @commander_command(
        'clone-node-to-last-node',
        'Clone the selected node and move it to the last node.\n' +
        'Do *not* change the selected node.'
    )
    public cloneToLastNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return undefined;
        }

        const prev: Position = p.copy();
        const undoData: Bead = c.undoer.beforeCloneNode(p);

        // c.endEditing()  // Capture any changes to the headline.

        const clone: Position = p.clone();
        const last: Position = c.rootPosition()!;

        while (last && last.__bool__() && last.hasNext()) {
            last.moveToNext();
        }
        clone.moveAfter(last);
        clone.setDirty();
        c.setChanged();
        u.afterCloneNode(clone, 'Clone Node To Last', undoData);

        // c.redraw(prev)
        // return clone // For mod_labels and chapters plugins.
    }
    //@+node:felix.20211031143555.5: *4* c_oc.deleteOutline
    @commander_command('delete-node', 'Deletes the selected outline.')
    public deleteOutline(this: Commands, op_name: string = "Delete Node"): void {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return undefined;
        }
        let newNode: Position;
        // c.endEditing()  // Make sure we capture the headline for Undo.
        if (false) { // c.config.getBool('select-next-after-delete'):
            // #721: Optionally select next node after delete.
            if (p.hasVisNext(c)) {
                newNode = p.visNext(c);
            } else if (p.hasParent()) {
                newNode = p.parent();
            } else {
                newNode = p.back();  // _not_ p.visBack(): we are at the top level.
            }
        } else {
            // Legacy: select previous node if possible.
            if (p.hasVisBack(c)) {
                newNode = p.visBack(c);
            } else {
                newNode = p.next();  // _not_ p.visNext(): we are at the top level.
            }
        }

        if (!newNode || !newNode.__bool__()) {
            return;
        }
        const undoData: Bead = u.beforeDeleteNode(p);
        p.setDirty();
        p.doDelete(newNode);
        c.setChanged();
        u.afterDeleteNode(newNode, op_name, undoData);
        // c.redraw(newNode); 
        c.validateOutline();
    }
    //@+node:felix.20211031143555.6: *4* c_oc.insertChild
    @commander_command(
        'insert-child',
        'Insert a node after the presently selected node.'
    )
    public insertChild(this: Commands): Position | undefined {
        const c: Commands = this;
        return c.insertHeadline('Insert Child', true);
    }
    //@+node:felix.20211031143555.7: *4* c_oc.insertHeadline (insert-*)
    @commander_command('insert-node', 'Insert a node after the presently selected node.')
    public insertHeadline(this: Commands, op_name: string = "Insert Node", as_child: Boolean = false): Position | undefined {
        const c: Commands = this;
        // Fix #600.
        return this.insertHeadlineHelper(c, as_child, false, false);
    }
    @commander_command('insert-as-first-child', 'Insert a node as the last child of the previous node.')
    public insertNodeAsFirstChild(this: Commands): Position | undefined {
        const c: Commands = this;
        return this.insertHeadlineHelper(c, false, true, false);
    }
    @commander_command('insert-as-last-child', 'Insert a node as the last child of the previous node.')
    public insertNodeAsLastChild(this: Commands): Position | undefined {
        const c: Commands = this;
        return this.insertHeadlineHelper(c, false, false, true);
    }
    //@+node:felix.20211031143555.8: *5* private insertHeadlineHelper
    /**
     * Insert a node after the presently selected node.
     */
    private insertHeadlineHelper(
        c: Commands,
        as_child: Boolean = false,
        as_first_child: Boolean = false,
        as_last_child: Boolean = false
    ): Position | undefined {

        const current: Position = c.p;
        const u: Undoer = c.undoer;

        const op_name: string = "Insert Node";
        if (!current || !current.__bool__()) {
            return undefined;
        }
        // c.endEditing()

        const undoData: Bead = c.undoer.beforeInsertNode(current);

        let p: Position;
        if (as_first_child)
            p = current.insertAsNthChild(0);
        else if (as_last_child)
            p = current.insertAsLastChild();
        else if (
            as_child ||
            (current.hasChildren() && current.isExpanded()) ||
            (c.hoistStack && c.hoistStack.length && current.__eq__(c.hoistStack[-1].p))
        ) {
            // Make sure the new node is visible when hoisting.
            if (c.config.getBool('insert-new-nodes-at-end')) {
                p = current.insertAsLastChild();
            } else {
                p = current.insertAsNthChild(0);
            }
        } else {
            p = current.insertAfter();
        }
        // g.doHook('create-node', c=c, p=p);

        p.setDirty();
        c.setChanged();
        u.afterInsertNode(p, op_name, undoData);

        c.redrawAndEdit(p, true);

        return p;
    }
    //@+node:felix.20211031143555.9: *4* c_oc.insertHeadlineBefore
    @commander_command('insert-node-before', 'Insert a node before the presently selected node.')
    public insertHeadlineBefore(this: Commands): Position | undefined {
        const c: Commands = this;
        const current: Position = c.p;
        const u: Undoer = c.undoer;

        const op_name: string = 'Insert Node Before';
        if (!current || !current.__bool__()) {
            return undefined;
        }
        // Can not insert before the base of a hoist.
        if (c.hoistStack && c.hoistStack.length && current.__eq__(c.hoistStack[-1].p)) {
            g.warning('can not insert a node before the base of a hoist');
            return undefined;
        }
        // c.endEditing()

        const undoData: Bead = u.beforeInsertNode(current);
        const p: Position = current.insertBefore();

        // g.doHook('create-node', c, p);

        p.setDirty();
        c.setChanged();
        u.afterInsertNode(p, op_name, undoData);

        // TODO : Implement ? Editing Headline ?
        // c.redrawAndEdit(p, selectAll=True);

        return p
    }
    //@+node:felix.20211025223803.1: *3* c_oc.Mark commands
    //@+node:felix.20211025223803.2: *4* c_oc.cloneMarked
    @commander_command(
        'clone-marked-nodes',
        'Clone all marked nodes as children of a new node.'
    )
    public cloneMarked(this: Commands): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        const p1: Position = c.p.copy();
        // Create a new node to hold clones.
        const parent: Position = p1.insertAfter();
        parent.h = 'Clones of marked nodes';

        const cloned: string[] = []; // GNX instead of direct 'v' to ease comparison
        let n: number = 0;
        let p: Position = c.rootPosition()!;

        while (p && p.__bool__()) {
            // Careful: don't clone already-cloned nodes.
            if (p.__eq__(parent)) {
                p.moveToNodeAfterTree();
                // }else if( p.isMarked() && (p.v.gnx not in cloned) ){
            } else if (p.isMarked() && (!cloned.includes(p.v.gnx))) {
                cloned.push(p.v.gnx);
                const p2 = p.copy();

                // Create the clone directly as a child of parent.
                n = parent.numberOfChildren();
                p2._linkAsNthChild(parent, n);

                p.moveToNodeAfterTree();
                n += 1;
            } else {
                p.moveToThreadNext();
            }
        }

        if (n) {
            c.setChanged();
            parent.expand();
            c.selectPosition(parent);
            u.afterCloneMarkedNodes(p1);
        } else {
            parent.doDelete();
            c.selectPosition(p1);
        }
        if (!g.unitTesting) {
            g.blue(`cloned ${n} nodes`);
        }

    }

    //@+node:felix.20211025223803.3: *4* c_oc.copyMarked
    @commander_command(
        'copy-marked-nodes',
        'Copy all marked nodes as children of a new node.'
    )
    public copyMarked(this: Commands): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        const p1: Position = c.p.copy();
        // Create a new node to hold clones.
        const parent: Position = p1.insertAfter();
        parent.h = 'Copies of marked nodes';

        const copied: string[] = []; // GNX instead of direct 'v' to ease comparison
        let n: number = 0;
        let p: Position = c.rootPosition()!;

        while (p && p.__bool__()) {
            // Careful: don't clone already-cloned nodes.
            if (p.__eq__(parent)) {
                p.moveToNodeAfterTree();
            } else if (p.isMarked() && (!copied.includes(p.v.gnx))) {
                copied.push(p.v.gnx);
                const p2 = p.copyWithNewVnodes(true);
                p2._linkAsNthChild(parent, n);
                p.moveToNodeAfterTree();
                n += 1;
            } else {
                p.moveToThreadNext();
            }
        }

        if (n) {
            c.setChanged();
            parent.expand();
            c.selectPosition(parent);
            u.afterCopyMarkedNodes(p1);
        } else {
            parent.doDelete();
            c.selectPosition(p1);
        }

        if (!g.unitTesting) {
            g.blue(`copied ${n} nodes`);
        }

    }

    //@+node:felix.20211025223803.4: *4* c_oc.deleteMarked
    @commander_command(
        'delete-marked-nodes',
        'Delete all marked nodes.'
    )
    public deleteMarked(this: Commands): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        const p1: Position = c.p.copy();
        const undo_data: Position[] = [];
        let p: Position = c.rootPosition()!;

        while (p && p.__bool__()) {
            if (p.isMarked()) {
                undo_data.push(p.copy());
                const next = p.positionAfterDeletedTree();
                p.doDelete();
                p = next;
            } else {
                p.moveToThreadNext();
            }
        }
        if (undo_data.length) {
            u.afterDeleteMarkedNodes(undo_data, p1);
            if (!g.unitTesting) {
                g.blue(`deleted ${undo_data.length} nodes`);
            }
            c.setChanged();
        }
        // Don't even *think* about restoring the old position.
        c.contractAllHeadlines();
        c.selectPosition(c.rootPosition()!);
    }

    //@+node:felix.20211025223803.5: *4* c_oc.moveMarked
    @commander_command(
        'move-marked-nodes',
        'Move all marked nodes as children of a new node.\n' +
        'This command is not undoable.\n' +
        'Consider using clone-marked-nodes, followed by copy/paste instead.'
    )
    public moveMarked(this: Commands): void {

        const c: Commands = this;
        const p1 = c.p.copy();

        // Check for marks.
        let someMarked: boolean = false;
        for (let v of c.all_unique_nodes()) {
            if (v.isMarked()) {
                someMarked = true;
                break;
            }
        }
        if (!someMarked) {
            g.warning('no marked nodes');
            return;
        }
        // TODO : Replace external check with prior check? or promise+".then" the rest.
        // result = g.app.gui.runAskYesNoDialog(c,
        //     'Move Marked Nodes?',
        //     message = 'move-marked-nodes is not undoable\nProceed?',
        // )

        // if result == 'no':
        //     return


        // Create a new *root* node to hold the moved nodes.
        // This node's position remains stable while other nodes move.

        const parent = createMoveMarkedNode(c);
        // assert not parent.isMarked() // TODO 'assert' 
        const moved: Position[] = [];
        let p = c.rootPosition()!;
        while (p && p.__bool__()) {
            // TODO : assert parent == c.rootPosition()
            // Careful: don't move already-moved nodes.
            if (p.isMarked() && !parent.isAncestorOf(p)) {
                moved.push(p.copy());
                const next = p.positionAfterDeletedTree();
                p.moveToLastChildOf(parent);
                // This does not change parent's position.
                p = next;
            } else {
                p.moveToThreadNext();
            }
        }
        if (moved.length) {
            // Find a position p2 outside of parent's tree with p2.v == p1.v.
            // Such a position may not exist.
            let p2: Position = c.rootPosition()!
            let found: boolean = false;
            while (p2 && p2.__bool__()) {
                if (p2.__eq__(parent)) {
                    p2.moveToNodeAfterTree();
                } else if (p2.v.gnx === p1.v.gnx) {
                    found = true;
                    break;
                } else {
                    p2.moveToThreadNext();
                }
            }
            if (!found) {
                // Not found.  Move to last top-level.
                p2 = c.lastTopLevel()
            }
            parent.moveAfter(p2);
            // u.afterMoveMarkedNodes(moved, p1)
            if (!g.unitTesting) {
                g.blue(`moved ${moved.length} nodes`);
            }
            c.setChanged();
        }
        // c.contractAllHeadlines()
        // Causes problems when in a chapter.
        c.selectPosition(parent);
    }

    //@+node:felix.20211025223803.7: *4* c_oc.markChangedHeadlines
    @commander_command(
        'mark-changed-items',
        'Mark all nodes that have been changed.'
    )
    public markChangedHeadlines(this: Commands): void {
        const c: Commands = this;
        const current: Position = this.p;
        const u: Undoer = c.undoer;
        const undoType: string = 'Mark Changed';
        // c.endEditing()
        u.beforeChangeGroup(current, undoType);

        for (let p of c.all_unique_positions()) {
            if (p.isDirty() && !p.isMarked()) {
                const bunch = u.beforeMark(p, undoType);
                // c.setMarked calls a hook.
                c.setMarked(p);
                p.setDirty();
                c.setChanged();
                u.afterMark(p, undoType, bunch);
            }
        }
        u.afterChangeGroup(current, undoType)
        if (!g.unitTesting) {
            g.blue('done');
        }
    }

    //@+node:felix.20211025223803.9: *4* c_oc.markHeadline
    @commander_command(
        'mark',
        'Toggle the mark of the selected node.'
    )  //  Compatibility
    @commander_command(
        'toggle-mark',
        'Toggle the mark of the selected node.'
    )
    public markHeadline(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return;
        }

        const undoType: string = p.isMarked() ? 'Unmark' : 'Mark';

        const bunch = u.beforeMark(p, undoType);
        // c.set/clearMarked call a hook.

        if (p.isMarked()) {
            c.clearMarked(p);
        } else {
            c.setMarked(p);
        }
        p.setDirty();
        c.setChanged();
        u.afterMark(p, undoType, bunch);
    }
    //@+node:felix.20211025223803.10: *4* c_oc.markSubheads
    @commander_command(
        'mark-subheads',
        'Mark all children of the selected node as changed.'
    )
    public markSubheads(this: Commands): void {
        const c: Commands = this;
        const current: Position = this.p;
        const u: Undoer = c.undoer;
        const undoType: string = 'Mark Subheads'
        if (!current || !current.__bool__()) {
            return;
        }
        u.beforeChangeGroup(current, undoType);
        for (let p of current.children()) {
            if (!p.isMarked()) {
                const bunch = u.beforeMark(p, undoType);
                c.setMarked(p);  // Calls a hook.
                p.setDirty();
                c.setChanged();
                u.afterMark(p, undoType, bunch);
            }
        }
        u.afterChangeGroup(current, undoType);
    }
    //@+node:felix.20211025223803.11: *4* c_oc.unmarkAll
    @commander_command(
        'unmark-all',
        'Unmark all nodes in the entire outline.'
    )
    public unmarkAll(this: Commands): void {
        const c: Commands = this;
        const current: Position = this.p;
        const u: Undoer = c.undoer;
        const undoType: string = 'Unmark All';
        if (!current || !current.__bool__()) {
            return;
        }
        u.beforeChangeGroup(current, undoType);
        let changed = false;
        let w_p: Position | undefined;  //  To keep pylint happy.

        for (let p of c.all_unique_positions()) {
            if (p.isMarked()) {
                const bunch = u.beforeMark(p, undoType);
                // c.clearMarked(p) // Very slow: calls a hook.
                p.v.clearMarked();
                p.setDirty();
                u.afterMark(p, undoType, bunch);
                changed = true;
            }
            w_p = p;
        }
        if (changed) {
            // g.doHook("clear-all-marks", c, w_p);
            c.setChanged();
        }

        u.afterChangeGroup(current, undoType);
    }
    //@+node:felix.20211031235049.1: *3* c_oc.Move commands
    //@+node:felix.20211031235049.2: *4* c_oc.demote
    @commander_command(
        'demote',
        'Make all following siblings children of the selected node.'
    )
    public demote(this: Commands): void {

        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__() || !p.hasNext()) {
            // c.treeFocusHelper();
            return;
        }
        // Make sure all the moves will be valid.
        const next: Position = p.next();

        while (next && next.__bool__()) {
            if (!c.checkMoveWithParentWithWarning(next, p, true)) {
                // c.treeFocusHelper();
                return;
            }
            next.moveToNext();
        }

        // c.endEditing()

        const parent_v: VNode = p._parentVnode()!;
        const n: number = p.childIndex();
        const followingSibs: VNode[] = parent_v.children.slice(n + 1);
        // Remove the moved nodes from the parent's children.
        parent_v.children = parent_v.children.slice(0, n + 1);
        // Add the moved nodes to p's children
        p.v.children.push(...followingSibs);
        // Adjust the parent links in the moved nodes.
        // There is no need to adjust descendant links.
        for (let child of followingSibs) {

            // child.parents.remove(parent_v);
            const index = child.parents.indexOf(parent_v);
            if (index > -1) {
                child.parents.splice(index, 1);
            }

            child.parents.push(p.v);
        }

        p.expand();
        p.setDirty();
        c.setChanged();
        u.afterDemote(p, followingSibs);

        // c.redraw(p)
        c.selectPosition(p);

        // c.updateSyntaxColorer(p); // Moving can change syntax coloring.
    }
    //@+node:felix.20211101012750.1: *5* // Remove the moved nodes from the parent's children.
    //@+node:felix.20211031235049.3: *4* c_oc.moveOutlineDown
    @commander_command(
        'move-outline-down',
        'Move the selected node down.'
    )
    public moveOutlineDown(this: Commands): void {

        // Moving down is more tricky than moving up because we can't
        // move p to be a child of itself.
        //
        // An important optimization:
        // we don't have to call checkMoveWithParentWithWarning() if the parent of
        // the moved node remains the same.

        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return;
        }

        if (!c.canMoveOutlineDown()) {
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            // c.treeFocusHelper()
            return;
        }

        const parent: Position = p.parent();
        let next: Position = p.visNext(c);

        while (next && next.__bool__() && p.isAncestorOf(next)) {
            next = next.visNext(c);
        }

        if (!next || !next.__bool__()) {
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            // c.treeFocusHelper();
            return;

        }

        // c.endEditing();
        const undoData: Bead = u.beforeMoveNode(p);

        let moved: boolean;

        //@+<< Move p down & set moved if successful >>
        //@+node:felix.20211031235049.4: *5* << Move p down & set moved if successful >>
        if (next.hasChildren() && next.isExpanded()) {
            // Attempt to move p to the first child of next.
            moved = c.checkMoveWithParentWithWarning(p, next, true);
            if (moved) {
                p.setDirty();
                p.moveToNthChildOf(next, 0);
            }

        } else {
            // Attempt to move p after next.
            moved = c.checkMoveWithParentWithWarning(p, next.parent(), true);
            if (moved) {
                p.setDirty();
                p.moveAfter(next);
            }
        }
        // Patch by nh2: 0004-Add-bool-collapse_nodes_after_move-option.patch
        if (
            c.collapse_nodes_after_move
            && moved && c.sparse_move
            && parent && !parent.isAncestorOf(p)
        )
            // New in Leo 4.4.2: contract the old parent if it is no longer the parent of p.
            parent.contract();

        //@-<< Move p down & set moved if successful >>

        if (moved) {
            p.setDirty();
            c.setChanged();
            u.afterMoveNode(p, 'Move Down', undoData);
        }

        // c.redraw(p)
        c.selectPosition(p);

        // c.updateSyntaxColorer(p) // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.5: *4* c_oc.moveOutlineLeft
    @commander_command(
        'move-outline-left',
        'Move the selected node left if possible.'
    )
    public moveOutlineLeft(this: Commands): void {

        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return;
        }

        if (!c.canMoveOutlineLeft()) {
            if (c.hoistStack && c.hoistStack.length) {
                cantMoveMessage(c);
            }
            // c.treeFocusHelper();
            return;
        }

        if (!p.hasParent()) {
            // c.treeFocusHelper();
            return;
        }

        const parent: Position = p.parent();

        // c.endEditing()

        const undoData: Bead = u.beforeMoveNode(p);
        p.setDirty();
        p.moveAfter(parent);
        p.setDirty();
        c.setChanged();
        u.afterMoveNode(p, 'Move Left', undoData);
        // Patch by nh2: 0004-Add-bool-collapse_nodes_after_move-option.patch
        if (c.collapse_nodes_after_move && c.sparse_move) { // New in Leo 4.4.2
            parent.contract();
        }
        // c.redraw(p)
        c.selectPosition(p);

        // c.recolor()  // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.6: *4* c_oc.moveOutlineRight
    @commander_command(
        'move-outline-right',
        'Move the selected node right if possible.'
    )
    public moveOutlineRight(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return;
        }

        if (!c.canMoveOutlineRight()) {  // 11/4/03: Support for hoist.
            if (c.hoistStack && c.hoistStack.length)
                cantMoveMessage(c)
            // c.treeFocusHelper();
            return;
        }

        const back: Position = p.back();
        if (!back) {
            // c.treeFocusHelper();
            return;
        }
        if (!c.checkMoveWithParentWithWarning(p, back, true)) {
            // c.treeFocusHelper();
            return;
        }
        // c.endEditing();

        const undoData: Bead = u.beforeMoveNode(p);
        p.setDirty();
        const n: number = back.numberOfChildren();
        p.moveToNthChildOf(back, n);
        p.setDirty();
        c.setChanged();  // #2036.
        u.afterMoveNode(p, 'Move Right', undoData);

        c.selectPosition(p);

        // c.redraw(p)
        // c.recolor()
    }
    //@+node:felix.20211031235049.7: *4* c_oc.moveOutlineUp
    @commander_command(
        'move-outline-up',
        'Move the selected node up if possible.'
    )
    public moveOutlineUp(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!c.canMoveOutlineUp()) {  // Support for hoist.
            if (c.hoistStack && c.hoistStack.length) {
                cantMoveMessage(c);
            }
            // c.treeFocusHelper();
            return;
        }

        const back: Position = p.visBack(c);
        if (!back) {
            // c.treeFocusHelper();
            return;
        }
        const back2: Position = back.visBack(c);

        // c.endEditing();
        const undoData: Bead = u.beforeMoveNode(p);

        let moved: boolean = false;

        //@+<< Move p up >>
        //@+node:felix.20211031235049.8: *5* << Move p up >>
        const parent: Position = p.parent();
        if (!back2 || !back2.__bool__()) {
            if (c.hoistStack) {  // hoist or chapter.
                const w_vislimit: [Position | undefined, boolean | undefined] = c.visLimit();
                const limit: Position | undefined = w_vislimit[0];
                const limitIsVisible: boolean = !!w_vislimit[1];
                // assert limit
                if (limitIsVisible) {
                    // canMoveOutlineUp should have caught this.
                    g.trace('can not happen. In hoist');
                } else {
                    moved = true;
                    p.setDirty();
                    p.moveToFirstChildOf(limit!);
                }
            } else {
                // p will be the new root node;
                p.setDirty();
                p.moveToRoot();
                moved = true;
            }

        } else if (back2.hasChildren() && back2.isExpanded()) {
            if (c.checkMoveWithParentWithWarning(p, back2, true)) {
                moved = true;
                p.setDirty();
                p.moveToNthChildOf(back2, 0);
            }
        } else {
            if (c.checkMoveWithParentWithWarning(p, back2.parent(), true)) {
                moved = true;
                p.setDirty();
                p.moveAfter(back2);
            }
        }
        // Patch by nh2: 0004-Add-bool-collapse_nodes_after_move-option.patch
        if (
            c.collapse_nodes_after_move &&
            moved && c.sparse_move &&
            parent && parent.__bool__() && !parent.isAncestorOf(p)
        ) {
            // New in Leo 4.4.2: contract the old parent if it is no longer the parent of p.
            parent.contract();
        }
        //@-<< Move p up >>

        if (moved) {
            p.setDirty();
            c.setChanged();
            u.afterMoveNode(p, 'Move Right', undoData);
        }
        // c.redraw(p)
        c.selectPosition(p);

        // c.updateSyntaxColorer(p);  // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.9: *4* c_oc.promote
    @commander_command(
        'promote',
        'Make all children of the selected nodes siblings of the selected node.'
    )
    public promote(this: Commands, undoFlag = true, redrawFlag = true): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__() || !p.hasChildren()) {
            // c.treeFocusHelper()
            return;
        }

        // c.endEditing()

        const children: VNode[] = p.v.children;  // First, for undo.
        p.promote();
        c.setChanged();
        if (undoFlag) {
            p.setDirty();
            u.afterPromote(p, children);
        }
        if (redrawFlag) {
            // c.redraw(p)
            c.selectPosition(p);

            // c.updateSyntaxColorer(p); // Moving can change syntax coloring.
        }
    }
    //@+node:felix.20211031235049.10: *4* c_oc.toggleSparseMove
    @commander_command(
        'toggle-sparse-move',
        'Toggle whether moves collapse the outline.'
    )
    public toggleSparseMove(this: Commands): void {
        const c: Commands = this;

        c.sparse_move = !c.sparse_move;

        if (!g.unitTesting) {
            g.blue(`sparse-move: ${c.sparse_move}`);
        }
    }
    //@+node:felix.20211031235022.1: *3* c_oc.Sort commands
    //@+node:felix.20211031235022.2: *4* c_oc.sortChildren
    @commander_command(
        'sort-children',
        'Sort the children of a node.'
    )
    public sortChildren(this: Commands, key = undefined, reverse = false): void {
        // This method no longer supports the 'cmp' keyword arg.
        const c: Commands = this;
        const p: Position = c.p;

        if (p && p.__bool__() && p.hasChildren()) {
            c.sortSiblings(
                p.firstChild(),
                true,
                key,
                reverse
            );
        }
    }
    //@+node:felix.20211031235022.3: *4* c_oc.sortSiblings
    @commander_command(
        'sort-siblings',
        'Sort the siblings of a node.'
    )
    public sortSiblings(
        this: Commands,
        // cmp keyword is no longer supported.
        p: Position | undefined = undefined,
        sortChildren: boolean = false,
        key: undefined | ((a: VNode, b: VNode) => number) = undefined,
        reverse: boolean = false
    ): void {

        const c: Commands = this;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            p = c.p; // in parameter is undefined
        }
        if (!p || !p.__bool__()) {
            return;
        }

        // c.endEditing()

        const undoType: string = sortChildren ? 'Sort Children' : 'Sort Siblings';

        const parent_v: VNode = p._parentVnode()!;

        const oldChildren: VNode[] = [...parent_v.children];
        const newChildren: VNode[] = [...parent_v.children];
        if (key === undefined) {
            key = (a, b) => {
                if (a.h.toLowerCase() < b.h.toLowerCase()) {
                    return -1;
                }
                if (a.h.toLowerCase() > b.h.toLowerCase()) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            };
        }

        newChildren.sort(key);
        if (reverse) {
            newChildren.reverse();
        }

        // Compare those arrays to see if sort was needed
        let same: boolean = true;
        for (var _i = 0; _i < oldChildren.length; _i++) {
            if (oldChildren[_i].gnx !== newChildren[_i].gnx) {
                same = false;
            }
        }
        if (same) {
            return; // Not even needed!
        }

        // 2010/01/20. Fix bug 510148.
        c.setChanged();
        const bunch: Bead = u.beforeSort(p, undoType, oldChildren, newChildren, sortChildren);
        parent_v.children = newChildren;
        u.afterSort(p, bunch);

        // Sorting destroys position p, and possibly the root position.
        p = c.setPositionAfterSort(sortChildren);
        if (p.parent().__bool__()) {
            p.parent().setDirty();
        }
        // c.redraw(p);
        c.selectPosition(p);
    }
    //@-others

}
//@-others
//@-leo
