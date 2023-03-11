import * as vscode from "vscode";
import { Constants } from "./constants";
import { Position } from "./core/leoNodes";
import { LeoButtonNode } from "./leoButtons";
import { LeoGotoNode } from "./leoGoto";
import { LeoOutlineNode } from "./leoOutline";
import { LeoUI } from "./leoUI";
import { LeoUndoNode } from "./leoUndos";
import { ReqRefresh, Focus, LeoGotoNavKey } from "./types";

/**
 * * Make all command/key bindings 
 */
export function makeAllBindings(p_leoUI: LeoUI, p_context: vscode.ExtensionContext): void {
    // Shortcut pointers for readability
    const U = undefined;
    const CMD = Constants.COMMANDS;
    const LEOCMD = Constants.LEO_COMMANDS;

    const NO_REFRESH: ReqRefresh = {};
    const REFRESH_NODE_BODY: ReqRefresh = {
        node: true, // Reveal the returned 'selected position' without changes to the tree
        body: true, // Goto/select another node needs the body pane refreshed
        states: true
    };
    const REFRESH_TREE: ReqRefresh = {
        tree: true,
        states: true
    };
    const REFRESH_TREE_BODY: ReqRefresh = {
        tree: true,
        body: true,
        states: true
    };
    const REFRESH_ALL: ReqRefresh = {
        tree: true,
        body: true,
        states: true,
        documents: true,
        buttons: true
    };

    const w_commands: [string, (...args: any[]) => any][] = [

        [CMD.SHOW_WELCOME, () => p_leoUI.showSettings()],
        [CMD.SHOW_SETTINGS, () => p_leoUI.showSettings()],
        [CMD.SHOW_OUTLINE, () => p_leoUI.showOutline(true)], // Also focuses on outline
        [CMD.SHOW_LOG, () => p_leoUI.showLogPane()],
        [CMD.SHOW_BODY, () => p_leoUI.showBody(false, undefined)], // Also focuses on body
        [CMD.EXECUTE, () => p_leoUI.command(LEOCMD.EXECUTE_SCRIPT, { refreshType: REFRESH_ALL, finalFocus: Focus.NoChange })],

        [CMD.MINIBUFFER, () => p_leoUI.minibuffer()], // Is referenced in package.json
        [CMD.SET_LEO_ID, () => p_leoUI.setLeoIDCommand()],

        [CMD.CLICK_BUTTON, (p_node: LeoButtonNode) => p_leoUI.clickAtButton(p_node)], // Not referenced in package.json
        [CMD.GOTO_SCRIPT, (p_node: LeoButtonNode) => p_leoUI.gotoScript(p_node)],
        [CMD.REMOVE_BUTTON, (p_node: LeoButtonNode) => p_leoUI.removeAtButton(p_node)],

        [CMD.CLOSE_FILE, () => p_leoUI.closeLeoFile()],
        [CMD.NEW_FILE, () => p_leoUI.newLeoFile()],
        [CMD.OPEN_FILE, (p_uri?: vscode.Uri) => p_leoUI.openLeoFile(p_uri)],
        [CMD.SAVE_AS_FILE, () => p_leoUI.saveAsLeoFile()],
        [CMD.SAVE_AS_LEOJS, () => p_leoUI.saveAsLeoJsFile()],
        [CMD.SAVE_FILE, () => p_leoUI.saveLeoFile()],
        [CMD.SAVE_FILE_FO, () => p_leoUI.saveLeoFile(true)],

        [CMD.SWITCH_FILE, () => p_leoUI.switchLeoFile()],
        [CMD.RECENT_FILES, () => p_leoUI.showRecentLeoFiles()],

        [CMD.WRITE_AT_FILE_NODES, () => p_leoUI.command(LEOCMD.WRITE_AT_FILE_NODES, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.WRITE_AT_FILE_NODES_FO, () => p_leoUI.command(LEOCMD.WRITE_AT_FILE_NODES, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],
        [CMD.WRITE_DIRTY_AT_FILE_NODES, () => p_leoUI.command(LEOCMD.WRITE_DIRTY_AT_FILE_NODES, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.WRITE_DIRTY_AT_FILE_NODES_FO, () => p_leoUI.command(LEOCMD.WRITE_DIRTY_AT_FILE_NODES, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.SET_OPENED_FILE, (p_index: number) => p_leoUI.selectOpenedLeoDocument(p_index, true)],

        [CMD.REFRESH_FROM_DISK, (p_node: Position) => p_leoUI.command(LEOCMD.REFRESH_FROM_DISK, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.REFRESH_FROM_DISK_SELECTION, () => p_leoUI.command(LEOCMD.REFRESH_FROM_DISK, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],

        [CMD.REFRESH_FROM_DISK_SELECTION_FO, () => p_leoUI.command(LEOCMD.REFRESH_FROM_DISK, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.GIT_DIFF, () => p_leoUI.command(LEOCMD.GIT_DIFF, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],

        [CMD.IMPORT_ANY_FILE, () => p_leoUI.importAnyFile()], // No URL passed from the command definition.
        [CMD.READ_FILE_INTO_NODE, () => p_leoUI.readFileIntoNode()],

        [CMD.EXPORT_HEADLINES, () => p_leoUI.exportHeadlines()],
        [CMD.FLATTEN_OUTLINE, () => p_leoUI.flattenOutline()],
        [CMD.OUTLINE_TO_CWEB, () => p_leoUI.outlineToCweb()],
        [CMD.OUTLINE_TO_NOWEB, () => p_leoUI.outlineToNoweb()],
        [CMD.REMOVE_SENTINELS, () => p_leoUI.removeSentinels()],
        [CMD.WEAVE, () => p_leoUI.weave()],
        [CMD.WRITE_FILE_FROM_NODE, () => p_leoUI.writeFileFromNode()],

        [CMD.HEADLINE, (p_node: Position) => p_leoUI.editHeadline(p_node, true)],
        [CMD.HEADLINE_SELECTION, () => p_leoUI.editHeadline(U, false)],
        [CMD.HEADLINE_SELECTION_FO, () => p_leoUI.editHeadline(U, true)],

        // cut/copy/paste/delete given node.
        [CMD.COPY, (p_node: Position) => p_leoUI.command(LEOCMD.COPY_PNODE, { node: p_node, refreshType: NO_REFRESH, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.CUT, (p_node: Position) => p_leoUI.command(LEOCMD.CUT_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.DELETE, (p_node: Position) => p_leoUI.command(LEOCMD.DELETE_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.PASTE, (p_node: Position) => p_leoUI.command(LEOCMD.PASTE_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.PASTE_CLONE, (p_node: Position) => p_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],

        // cut/copy/paste/delete current selection (self.commander.p)
        [CMD.COPY_SELECTION, () => p_leoUI.command(LEOCMD.COPY_PNODE, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.CUT_SELECTION, () => p_leoUI.command(LEOCMD.CUT_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.CUT_SELECTION_FO, () => p_leoUI.command(LEOCMD.CUT_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.DELETE_SELECTION, () => p_leoUI.command(LEOCMD.DELETE_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.DELETE_SELECTION_FO, () => p_leoUI.command(LEOCMD.DELETE_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.PASTE_CLONE_SELECTION, () => p_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.PASTE_CLONE_SELECTION_FO, () => p_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.PASTE_SELECTION, () => p_leoUI.command(LEOCMD.PASTE_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.PASTE_SELECTION_FO, () => p_leoUI.command(LEOCMD.PASTE_PNODE, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.SET_UA, () => p_leoUI.command(LEOCMD.SET_UA, { refreshType: REFRESH_TREE, finalFocus: Focus.NoChange })],

        // Called by nodes in the tree when selected either by mouse, or with enter
        [CMD.SELECT_NODE, (p_outlineNode: LeoOutlineNode) => p_leoUI.selectTreeNode(p_outlineNode.position, false)], // Select is NOT a Position!
        [CMD.OPEN_ASIDE, (p_position: Position) => p_leoUI.selectTreeNode(p_position, true)],

        [CMD.CONTRACT_ALL, () => p_leoUI.command(LEOCMD.CONTRACT_ALL, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.CONTRACT_ALL_FO, () => p_leoUI.command(LEOCMD.CONTRACT_ALL, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.CONTRACT_OR_GO_LEFT, () => p_leoUI.command(LEOCMD.CONTRACT_OR_GO_LEFT, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.EXPAND_AND_GO_RIGHT, () => p_leoUI.command(LEOCMD.EXPAND_AND_GO_RIGHT, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, isNavigation: true })],

        [CMD.GOTO_NEXT_CLONE, (p_node: Position) => p_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, { node: p_node, refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_NEXT_CLONE_SELECTION, () => p_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Body, isNavigation: true })],
        [CMD.GOTO_NEXT_CLONE_SELECTION_FO, () => p_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],

        [CMD.GOTO_NEXT_MARKED, () => p_leoUI.command(LEOCMD.GOTO_NEXT_MARKED, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_FIRST_SIBLING, () => p_leoUI.command(LEOCMD.GOTO_FIRST_SIBLING, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_LAST_SIBLING, () => p_leoUI.command(LEOCMD.GOTO_LAST_SIBLING, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_FIRST_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_FIRST_VISIBLE, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_LAST_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_LAST_VISIBLE, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_NEXT_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_NEXT_VISIBLE, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.GOTO_PREV_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_PREV_VISIBLE, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],

        [CMD.PAGE_UP, () => p_leoUI.command(LEOCMD.PAGE_UP, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],
        [CMD.PAGE_DOWN, () => p_leoUI.command(LEOCMD.PAGE_DOWN, { refreshType: REFRESH_NODE_BODY, finalFocus: Focus.Outline, isNavigation: true })],

        [CMD.DEHOIST, () => p_leoUI.command(LEOCMD.DEHOIST, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.DEHOIST_FO, () => p_leoUI.command(LEOCMD.DEHOIST, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.HOIST, (p_node: Position) => p_leoUI.command(LEOCMD.HOIST_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.HOIST_SELECTION, () => p_leoUI.command(LEOCMD.HOIST_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.HOIST_SELECTION_FO, () => p_leoUI.command(LEOCMD.HOIST_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.CHAPTER_NEXT, () => p_leoUI.command(LEOCMD.CHAPTER_NEXT, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],
        [CMD.CHAPTER_BACK, () => p_leoUI.command(LEOCMD.CHAPTER_BACK, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],
        [CMD.CHAPTER_MAIN, () => p_leoUI.chapterMain()],
        [CMD.CHAPTER_SELECT, () => p_leoUI.chapterSelect()],

        [CMD.INSERT, (p_node: Position) => p_leoUI.insertNode(p_node, true, false, false)],
        [CMD.INSERT_SELECTION, () => p_leoUI.insertNode(U, false, false, false)],
        [CMD.INSERT_SELECTION_FO, () => p_leoUI.insertNode(U, true, false, false)],
        // Special command for when inserting rapidly more than one node without
        // even specifying a headline label, e.g. spamming CTRL+I rapidly.
        [CMD.INSERT_SELECTION_INTERRUPT, () => p_leoUI.insertNode(U, false, true, false)],

        [CMD.INSERT_CHILD, (p_node: Position) => p_leoUI.insertNode(p_node, true, false, true)],
        [CMD.INSERT_CHILD_SELECTION, () => p_leoUI.insertNode(U, false, false, true)],
        [CMD.INSERT_CHILD_SELECTION_FO, () => p_leoUI.insertNode(U, true, false, true)],
        // Special command for when inserting rapidly more than one node without
        // even specifying a headline label, e.g. spamming CTRL+I rapidly.
        [CMD.INSERT_CHILD_SELECTION_INTERRUPT, () => p_leoUI.insertNode(U, false, true, true)],

        [CMD.CLONE, (p_node: Position) => p_leoUI.command(LEOCMD.CLONE_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.CLONE_SELECTION, () => p_leoUI.command(LEOCMD.CLONE_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.CLONE_SELECTION_FO, () => p_leoUI.command(LEOCMD.CLONE_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.PROMOTE, (p_node: Position) => p_leoUI.command(LEOCMD.PROMOTE_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.PROMOTE_SELECTION, () => p_leoUI.command(LEOCMD.PROMOTE_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.PROMOTE_SELECTION_FO, () => p_leoUI.command(LEOCMD.PROMOTE_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.DEMOTE, (p_node: Position) => p_leoUI.command(LEOCMD.DEMOTE_PNODE, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.DEMOTE_SELECTION, () => p_leoUI.command(LEOCMD.DEMOTE_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.DEMOTE_SELECTION_FO, () => p_leoUI.command(LEOCMD.DEMOTE_PNODE, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.SORT_CHILDREN, () => p_leoUI.command(LEOCMD.SORT_CHILDREN, { refreshType: REFRESH_TREE, finalFocus: Focus.Body, keepSelection: true })],
        [CMD.SORT_SIBLING, () => p_leoUI.command(LEOCMD.SORT_SIBLINGS, { refreshType: REFRESH_TREE, finalFocus: Focus.Body, keepSelection: true })],
        [CMD.SORT_SIBLING_FO, () => p_leoUI.command(LEOCMD.SORT_SIBLINGS, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline, keepSelection: true })],

        [CMD.MARK, (p_node: Position) => p_leoUI.command(LEOCMD.TOGGLE_MARK, { node: p_node, refreshType: REFRESH_TREE, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.MARK_SELECTION, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.MARK_SELECTION_FO, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],
        [CMD.UNMARK, (p_node: Position) => p_leoUI.command(LEOCMD.TOGGLE_MARK, { node: p_node, refreshType: REFRESH_TREE, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.UNMARK_SELECTION, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.UNMARK_SELECTION_FO, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],
        [CMD.UNMARK_ALL, () => p_leoUI.command(LEOCMD.UNMARK_ALL, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.EXTRACT, () => p_leoUI.command(LEOCMD.EXTRACT, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.EXTRACT_NAMES, () => p_leoUI.command(LEOCMD.EXTRACT_NAMES, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],

        [CMD.MOVE_DOWN, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.MOVE_DOWN_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.MOVE_DOWN_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.MOVE_LEFT, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.MOVE_LEFT_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.MOVE_LEFT_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.MOVE_RIGHT, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.MOVE_RIGHT_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.MOVE_RIGHT_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.MOVE_UP, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_UP, { node: p_node, refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline, keepSelection: true })],
        [CMD.MOVE_UP_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_UP, { refreshType: REFRESH_TREE, finalFocus: Focus.Body })],
        [CMD.MOVE_UP_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_UP, { refreshType: REFRESH_TREE, finalFocus: Focus.Outline })],

        [CMD.REDO, () => p_leoUI.command(LEOCMD.REDO, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.REDO_FO, () => p_leoUI.command(LEOCMD.REDO, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.UNDO, () => p_leoUI.command(LEOCMD.UNDO, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.UNDO_FO, () => p_leoUI.command(LEOCMD.UNDO, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.REVERT_TO_UNDO, (p_undo: LeoUndoNode) => p_leoUI.revertToUndo(p_undo)],

        [CMD.COPY_MARKED, () => p_leoUI.command(LEOCMD.COPY_MARKED, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.DIFF_MARKED_NODES, () => p_leoUI.command(LEOCMD.DIFF_MARKED_NODES, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.MARK_CHANGED_ITEMS, () => p_leoUI.command(LEOCMD.MARK_CHANGED_ITEMS, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.MARK_SUBHEADS, () => p_leoUI.command(LEOCMD.MARK_SUBHEADS, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.CLONE_MARKED_NODES, () => p_leoUI.command(LEOCMD.CLONE_MARKED_NODES, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.DELETE_MARKED_NODES, () => p_leoUI.command(LEOCMD.DELETE_MARKED_NODES, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.MOVE_MARKED_NODES, () => p_leoUI.command(LEOCMD.MOVE_MARKED_NODES, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.PREV_NODE, () => p_leoUI.command(LEOCMD.GOTO_PREV_HISTORY, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.PREV_NODE_FO, () => p_leoUI.command(LEOCMD.GOTO_PREV_HISTORY, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        [CMD.NEXT_NODE, () => p_leoUI.command(LEOCMD.GOTO_NEXT_HISTORY, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Body })],
        [CMD.NEXT_NODE_FO, () => p_leoUI.command(LEOCMD.GOTO_NEXT_HISTORY, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],
        [CMD.FIND_QUICK, () => p_leoUI.findQuick()],
        [CMD.FIND_QUICK_SELECTED, () => p_leoUI.findQuickSelected()],
        [CMD.FIND_QUICK_TIMELINE, () => p_leoUI.findQuickTimeline()],
        [CMD.FIND_QUICK_CHANGED, () => p_leoUI.findQuickChanged()],
        [CMD.FIND_QUICK_HISTORY, () => p_leoUI.findQuickHistory()],
        [CMD.FIND_QUICK_MARKED, () => p_leoUI.findQuickMarked()],
        [CMD.FIND_QUICK_GO_ANYWHERE, () => p_leoUI.goAnywhere()],

        [CMD.GOTO_NAV_PREV, () => p_leoUI.navigateNavEntry(LeoGotoNavKey.prev)],
        [CMD.GOTO_NAV_NEXT, () => p_leoUI.navigateNavEntry(LeoGotoNavKey.next)],
        [CMD.GOTO_NAV_FIRST, () => p_leoUI.navigateNavEntry(LeoGotoNavKey.first)],
        [CMD.GOTO_NAV_LAST, () => p_leoUI.navigateNavEntry(LeoGotoNavKey.last)],

        [CMD.GOTO_NAV_ENTRY, (p_node: LeoGotoNode) => p_leoUI.gotoNavEntry(p_node)],

        // [CMD.INTERACTIVE_SEARCH_TAB, () => p_leoUI.interactiveSearchTab()], // TODO : UNUSED FOR NOW : NO WAY TO DETECT TAB IN INPUTBOX !

        // [CMD.START_SEARCH, () => p_leoUI.startSearch()],
        // [CMD.SEARCH_BACKWARD, () => p_leoUI.interactiveSearch(true, false, false)],
        // [CMD.RE_SEARCH, () => p_leoUI.interactiveSearch(false, true, false)],
        // [CMD.RE_SEARCH_BACKWARD, () => p_leoUI.interactiveSearch(true, true, false)],
        // [CMD.WORD_SEARCH, () => p_leoUI.interactiveSearch(false, false, true)],
        // [CMD.WORD_SEARCH_BACKWARD, () => p_leoUI.interactiveSearch(true, false, true)],

        [CMD.START_SEARCH, () => p_leoUI.command(LEOCMD.START_SEARCH, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.SEARCH_BACKWARD, () => p_leoUI.command(LEOCMD.SEARCH_BACKWARD, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.RE_SEARCH, () => p_leoUI.command(LEOCMD.RE_SEARCH, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.RE_SEARCH_BACKWARD, () => p_leoUI.command(LEOCMD.RE_SEARCH_BACKWARD, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.WORD_SEARCH, () => p_leoUI.command(LEOCMD.WORD_SEARCH, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.WORD_SEARCH_BACKWARD, () => p_leoUI.command(LEOCMD.WORD_SEARCH_BACKWARD, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.FIND_ALL, () => p_leoUI.command(LEOCMD.FIND_ALL, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.REPLACE_ALL, () => p_leoUI.command(LEOCMD.REPLACE_ALL, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.FIND_NEXT, () => p_leoUI.find(false, false)],
        [CMD.FIND_NEXT_FO, () => p_leoUI.find(true, false)],
        [CMD.FIND_PREVIOUS, () => p_leoUI.find(false, true)],
        [CMD.FIND_PREVIOUS_FO, () => p_leoUI.find(true, true)],

        [CMD.FIND_VAR, () => p_leoUI.command(LEOCMD.FIND_VAR, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.FIND_DEF, () => p_leoUI.command(LEOCMD.FIND_DEF, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.REPLACE, () => p_leoUI.replace(false, false)],
        [CMD.REPLACE_FO, () => p_leoUI.replace(true, false)],
        [CMD.REPLACE_THEN_FIND, () => p_leoUI.replace(false, true)],
        [CMD.REPLACE_THEN_FIND_FO, () => p_leoUI.replace(true, true)],

        [CMD.GOTO_GLOBAL_LINE, () => p_leoUI.gotoGlobalLine()],

        [CMD.TAG_CHILDREN, () => p_leoUI.command(LEOCMD.TAG_CHILDREN, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TAG_NODE, (p_node?: Position) => p_leoUI.tagNode(p_node)], // with para
        [CMD.REMOVE_TAG, (p_node?: Position) => p_leoUI.removeTag(p_node)], // with para
        [CMD.REMOVE_TAGS, (p_node?: Position) => p_leoUI.removeTags(p_node)], // with para

        [CMD.CLONE_FIND_TAG, () => p_leoUI.command(LEOCMD.CLONE_FIND_TAG, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.CLONE_FIND_PARENTS, () => p_leoUI.command(LEOCMD.CLONE_FIND_PARENTS, { refreshType: REFRESH_TREE_BODY, finalFocus: Focus.Outline })],

        // [CMD.CLONE_FIND_ALL, () => p_leoUI.cloneFind(false, false)],
        // [CMD.CLONE_FIND_ALL_FLATTENED, () => p_leoUI.cloneFind(false, true)],
        // [CMD.CLONE_FIND_MARKED, () => p_leoUI.cloneFind(true, false)],
        // [CMD.CLONE_FIND_FLATTENED_MARKED, () => p_leoUI.cloneFind(true, true)],
        [CMD.CLONE_FIND_ALL, () => p_leoUI.command(LEOCMD.CLONE_FIND_ALL, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.CLONE_FIND_ALL_FLATTENED, () => p_leoUI.command(LEOCMD.CLONE_FIND_ALL_FLATTENED, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.CLONE_FIND_MARKED, () => p_leoUI.command(LEOCMD.CLONE_FIND_MARKED, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.CLONE_FIND_FLATTENED_MARKED, () => p_leoUI.command(LEOCMD.CLONE_FIND_FLATTENED_MARKED, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.SET_FIND_EVERYWHERE_OPTION, () => p_leoUI.command(LEOCMD.SET_FIND_EVERYWHERE_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.SET_FIND_NODE_ONLY_OPTION, () => p_leoUI.command(LEOCMD.SET_FIND_NODE_ONLY_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.SET_FIND_FILE_ONLY_OPTION, () => p_leoUI.command(LEOCMD.SET_FIND_FILE_ONLY_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.SET_FIND_SUBOUTLINE_ONLY_OPTION, () => p_leoUI.command(LEOCMD.SET_FIND_SUBOUTLINE_ONLY_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.TOGGLE_FIND_IGNORE_CASE_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_IGNORE_CASE_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TOGGLE_FIND_MARK_CHANGES_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_MARK_CHANGES_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TOGGLE_FIND_MARK_FINDS_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_MARK_FINDS_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TOGGLE_FIND_REGEXP_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_REGEXP_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TOGGLE_FIND_WORD_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_WORD_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TOGGLE_FIND_SEARCH_BODY_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_SEARCH_BODY_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],
        [CMD.TOGGLE_FIND_SEARCH_HEADLINE_OPTION, () => p_leoUI.command(LEOCMD.TOGGLE_FIND_SEARCH_HEADLINE_OPTION, { refreshType: NO_REFRESH, finalFocus: Focus.NoChange })],

        [CMD.SET_ENABLE_PREVIEW, () => p_leoUI.config.setEnablePreview()],
        [CMD.CLEAR_CLOSE_EMPTY_GROUPS, () => p_leoUI.config.clearCloseEmptyGroups()],

    ];

    w_commands.map(function (p_command) {
        p_context.subscriptions.push(vscode.commands.registerCommand(...p_command));
    });
}

