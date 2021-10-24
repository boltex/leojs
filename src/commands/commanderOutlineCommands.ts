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
import { Commands } from "../core/leoCommands";

//@+<< def contractIfNotCurrent >>
//@+node:felix.20211020004249.1: ** << def contractIfNotCurrent >>
function contractIfNotCurrent(c: Commands, p: Position, leaveOpen: Position): void {
    if (p.__eq__(leaveOpen) || !p.isAncestorOf(leaveOpen)) {
        p.contract();
    }
    for (let child of p.children()) {
        if (!child.__eq__(leaveOpen) && child.isAncestorOf(leaveOpen)) {
            contractIfNotCurrent(c, child, leaveOpen);
        } else {
            for (let p2 of child.self_and_subtree()) {
                p2.contract();
            }
        }
    }
}

//@-<< def contractIfNotCurrent >>

export class CommanderOutlineCommands {

    //@+others
    //@+node:felix.20211020000219.1: ** c_oc.dumpOutline
    @commander_command(
        'dump-outline',
        'Dump all nodes in the outline.'
    )
    public dumpOutline(this: Commands): void {
        const c: Commands = this;
        const seen: { [key: string]: boolean } = {};
        console.log('')
        console.log('='.repeat(40))
        const v = c.hiddenRootNode;
        v.dump()
        seen[v.gnx] = true;
        for (let p of c.all_positions()) {
            if (!seen[p.v.gnx])
                seen[p.v.gnx] = true;
            p.v.dump();
        }
    }
    //@+node:felix.20211020002058.1: ** c_oc.Expand & contract commands
    //@+node:felix.20211020002058.2: *3* c_oc.contract-all
    @commander_command(
        'contract-all',
        'Contract all nodes in the outline.'
    )
    public contractAllHeadlinesCommand(this: Commands): void {
        // The helper does all the work.
        const c: Commands = this;
        c.contractAllHeadlines();
    }
    //@+node:felix.20211020002058.3: *3* c_oc.contractAllOtherNodes
    @commander_command(
        'contract-all-other-nodes',
        'Contract all nodes except those needed to make the\n' +
        'presently selected node visible.'
    )
    public contractAllOtherNodes(this: Commands): void {
        const c: Commands = this;
        const leaveOpen: Position = c.p;
        for (let p of c.rootPosition()!.self_and_siblings()) {
            contractIfNotCurrent(c, p, leaveOpen);
        }
    }
    //@+node:felix.20211020002058.5: *3* c_oc.contractAllSubheads (new)
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
    //@+node:felix.20211020002058.6: *3* c_oc.contractNode
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
    //@+node:felix.20211020002058.7: *3* c_oc.contractNodeOrGoToParent
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
    //@+node:felix.20211020002058.8: *3* c_oc.contractParent
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
    }

    //@+node:felix.20211020002058.9: *3* c_oc.expandAllHeadlines
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
        c.expansionLevel = 0;  // Reset expansion level.
    }
    //@+node:felix.20211020002058.10: *3* c_oc.expandAllSubheads
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
    }
    //@+node:felix.20211020002058.11: *3* c_oc.expandLevel1..9
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
    //@+node:felix.20211020002058.12: *3* c_oc.expandNextLevel
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
    //@+node:felix.20211020002058.13: *3* c_oc.expandNode
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
    //@+node:felix.20211020002058.14: *3* c_oc.expandNodeAndGoToFirstChild
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
    //@+node:felix.20211020002058.15: *3* c_oc.expandNodeOrGoToFirstChild
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
    //@+node:felix.20211020002058.16: *3* c_oc.expandOnlyAncestorsOfNode
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
    //@+node:felix.20211020002058.17: *3* c_oc.expandPrevLevel
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

    //@+node:felix.20211021013709.1: ** c_oc.Goto commands
    //@+node:felix.20211021013709.2: *3* c_oc.findNextClone
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
    //@+node:felix.20211021013709.3: *3* c_oc.goNextVisitedNode
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
    //@+node:felix.20211021013709.4: *3* c_oc.goPrevVisitedNode
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
    //@+node:felix.20211021013709.5: *3* c_oc.goToFirstNode
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
    //@+node:felix.20211021013709.6: *3* c_oc.goToFirstSibling
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
    //@+node:felix.20211021013709.7: *3* c_oc.goToFirstVisibleNode
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
    //@+node:felix.20211021013709.8: *3* c_oc.goToLastNode
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
    //@+node:felix.20211021013709.9: *3* c_oc.goToLastSibling
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
    //@+node:felix.20211021013709.10: *3* c_oc.goToLastVisibleNode
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
    //@+node:felix.20211021013709.11: *3* c_oc.goToNextClone
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
                } else {
                    cc.selectChapterByName(new_name);
                }
            } else {
                // Always do a full redraw.
                //c.redraw(p);
            }
        } else {
            g.blue('done');
        }
    }
    //@+node:felix.20211021013709.12: *3* c_oc.goToNextDirtyHeadline
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
    //@+node:felix.20211021013709.13: *3* c_oc.goToNextMarkedHeadline
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
    //@+node:felix.20211021013709.14: *3* c_oc.goToNextSibling
    @commander_command(
        'goto-next-sibling',
        'Select the next sibling of the selected node.'
    )
    public goToNextSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.next());
    }
    //@+node:felix.20211021013709.15: *3* c_oc.goToParent
    @commander_command(
        'goto-parent',
        'Select the parent of the selected node.'
    )
    public goToParent(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.parent())
    }
    //@+node:felix.20211021013709.16: *3* c_oc.goToPrevMarkedHeadline
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
    //@+node:felix.20211021013709.17: *3* c_oc.goToPrevSibling
    @commander_command(
        'goto-prev-sibling',
        'Select the previous sibling of the selected node.'
    )
    public goToPrevSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.back());
    }
    //@+node:felix.20211021013709.18: *3* c_oc.selectThreadBack
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
    //@+node:felix.20211021013709.19: *3* c_oc.selectThreadNext
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
    //@+node:felix.20211021013709.20: *3* c_oc.selectVisBack
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
    //@+node:felix.20211021013709.21: *3* c_oc.selectVisNext
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
    //@-others

}
//@-leo
