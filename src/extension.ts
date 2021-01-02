import * as vscode from 'vscode';
import * as utils from "./utils";
import { ReqRefresh } from "./types";
import { LeoUI } from './leoUI';
import { Constants } from './constants';
import { LeoButtonNode } from './leoButtonNode';
import { LeoOutlineNode } from './leoOutlineNode';

export function activate(p_context: vscode.ExtensionContext) {

    const w_leo: LeoUI = new LeoUI(p_context);

    // Shortcut pointers for readability
    const U = undefined;
    const CMD = Constants.COMMANDS;
    const LEOCMD = Constants.LEO_COMMANDS;
    const CTX = Constants.CONTEXT_FLAGS;

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

    const w_commands: [string, (...args: any[]) => any][] = [

        // ! REMOVE TESTS ENTRIES FROM PACKAGE.JSON FOR MASTER BRANCH RELEASES !
        ["leointeg.test", () => w_leo.test()], // Test function useful when debugging

        [CMD.ENABLE_LEO_TREE_NAV, () => w_leo.toggleSetting(CTX.LEO_TREE_BROWSE, true)],
        [CMD.SHOW_EDIT_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_EDIT, true)],
        [CMD.SHOW_ADD_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_ADD, true)],
        [CMD.SHOW_ARROWS_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_ARROWS, true)],
        [CMD.SHOW_COPY_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_COPY, true)],
        [CMD.SHOW_CLONE_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_CLONE, true)],
        [CMD.SHOW_MARK_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_MARK, true)],

        [CMD.DISABLE_LEO_TREE_NAV, () => w_leo.toggleSetting(CTX.LEO_TREE_BROWSE, false)],
        [CMD.HIDE_EDIT_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_EDIT, false)],
        [CMD.HIDE_ADD_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_ADD, false)],
        [CMD.HIDE_ARROWS_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_ARROWS, false)],
        [CMD.HIDE_COPY_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_COPY, false)],
        [CMD.HIDE_CLONE_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_CLONE, false)],
        [CMD.HIDE_MARK_ON_NODES, () => w_leo.toggleSetting(CTX.SHOW_MARK, false)],

        [CMD.EXECUTE, () => w_leo.command(LEOCMD.EXECUTE_SCRIPT, U, REFRESH_TREE_BODY, false)],

        [CMD.MINIBUFFER, () => w_leo.minibuffer()], // Is referenced in package.json

        [CMD.CLICK_BUTTON, (p_node: LeoButtonNode) => w_leo.clickAtButton(p_node)], // Not referenced in package.json
        [CMD.REMOVE_BUTTON, (p_node: LeoButtonNode) => w_leo.removeAtButton(p_node)],
        [CMD.CLOSE_FILE, () => w_leo.closeLeoFile()],
        [CMD.NEW_FILE, () => w_leo.newLeoFile()],

        [CMD.OPEN_FILE, (p_uri?: vscode.Uri) => w_leo.openLeoFile(p_uri)],

        [CMD.RECENT_FILES, () => w_leo.showRecentLeoFiles()],
        [CMD.SAVE_AS_FILE, () => w_leo.saveAsLeoFile()],
        [CMD.SAVE_FILE, () => w_leo.saveLeoFile()],
        [CMD.SAVE_FILE_FO, () => w_leo.saveLeoFile(true)],
        [CMD.SWITCH_FILE, () => w_leo.switchLeoFile()],

        [CMD.SET_OPENED_FILE, (p_index: number) => w_leo.selectOpenedLeoDocument(p_index)],

        [CMD.REFRESH_FROM_DISK, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.REFRESH_FROM_DISK, p_node, REFRESH_TREE_BODY, false)],

        [CMD.REFRESH_FROM_DISK_SELECTION, () => w_leo.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, false)],

        [CMD.REFRESH_FROM_DISK_SELECTION_FO, () => w_leo.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, true)],

        [CMD.GIT_DIFF, () => w_leo.command(LEOCMD.GIT_DIFF, U, REFRESH_TREE_BODY, false)],
        [CMD.HEADLINE, (p_node: LeoOutlineNode) => w_leo.editHeadline(p_node, true)],
        [CMD.HEADLINE_SELECTION, () => w_leo.editHeadline(U, false)],
        [CMD.HEADLINE_SELECTION_FO, () => w_leo.editHeadline(U, true)],
        // cut/copy/paste/delete given node.
        [CMD.COPY, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.COPY_PNODE, p_node, NO_REFRESH, true, true)],
        [CMD.CUT, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.CUT_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.DELETE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.DELETE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.PASTE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.PASTE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],
        [CMD.PASTE_CLONE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.PASTE_CLONE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],

        // cut/copy/paste/delete current selection (self.commander.p)
        [CMD.COPY_SELECTION, () => w_leo.command(LEOCMD.COPY_PNODE, U, NO_REFRESH, false)],
        [CMD.CUT_SELECTION, () => w_leo.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.CUT_SELECTION_FO, () => w_leo.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.DELETE_SELECTION, () => w_leo.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.DELETE_SELECTION_FO, () => w_leo.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.PASTE_CLONE_SELECTION, () => w_leo.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.PASTE_CLONE_SELECTION_FO, () => w_leo.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.PASTE_SELECTION, () => w_leo.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.PASTE_SELECTION_FO, () => w_leo.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, true)],
        // Called by nodes in the tree when selected either by mouse, or with enter
        [CMD.SELECT_NODE, (p_node: LeoOutlineNode) => w_leo.selectTreeNode(p_node, false, false)],
        [CMD.OPEN_ASIDE, (p_node: LeoOutlineNode) => w_leo.selectTreeNode(p_node, false, true)],

        [CMD.CONTRACT_ALL, () => w_leo.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, false)],
        [CMD.CONTRACT_ALL_FO, () => w_leo.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, true)],

        [CMD.CONTRACT_OR_GO_LEFT, () => w_leo.command(LEOCMD.CONTRACT_OR_GO_LEFT, U, REFRESH_TREE_BODY, true)],
        [CMD.EXPAND_AND_GO_RIGHT, () => w_leo.command(LEOCMD.EXPAND_AND_GO_RIGHT, U, REFRESH_TREE_BODY, true)],
        [CMD.GOTO_NEXT_CLONE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.GOTO_NEXT_CLONE, p_node, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_NEXT_CLONE_SELECTION, () => w_leo.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, false)],
        [CMD.GOTO_NEXT_CLONE_SELECTION_FO, () => w_leo.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, true)],

        [CMD.GOTO_NEXT_MARKED, () => w_leo.command(LEOCMD.GOTO_NEXT_MARKED, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_FIRST_VISIBLE, () => w_leo.command(LEOCMD.GOTO_FIRST_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_LAST_SIBLING, () => w_leo.command(LEOCMD.GOTO_LAST_SIBLING, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_LAST_VISIBLE, () => w_leo.command(LEOCMD.GOTO_LAST_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_NEXT_VISIBLE, () => w_leo.command(LEOCMD.GOTO_NEXT_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_PREV_VISIBLE, () => w_leo.command(LEOCMD.GOTO_PREV_VISIBLE, U, REFRESH_NODE_BODY, true)],

        [CMD.PAGE_UP, () => w_leo.command(LEOCMD.PAGE_UP, U, REFRESH_NODE_BODY, true)],
        [CMD.PAGE_DOWN, () => w_leo.command(LEOCMD.PAGE_DOWN, U, REFRESH_NODE_BODY, true)],
        [CMD.DEHOIST, () => w_leo.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, false)],
        [CMD.DEHOIST_FO, () => w_leo.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, true)],
        [CMD.HOIST, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.HOIST_PNODE, p_node, REFRESH_TREE_BODY, true)],
        [CMD.HOIST_SELECTION, () => w_leo.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, false)],
        [CMD.HOIST_SELECTION_FO, () => w_leo.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, true)],
        [CMD.INSERT, (p_node: LeoOutlineNode) => w_leo.insertNode(p_node, true)],
        [CMD.INSERT_SELECTION, () => w_leo.insertNode(U, false)],
        [CMD.INSERT_SELECTION_FO, () => w_leo.insertNode(U, true)],
        // Special command for when inserting rapidly more than one node without
        // even specifying a headline label, e.g. spamming CTRL+I rapidly.
        [CMD.INSERT_SELECTION_INTERRUPT, () => w_leo.insertNode(U, false, true)],

        [CMD.CLONE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.CLONE_PNODE, p_node, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_SELECTION, () => w_leo.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, false)],
        [CMD.CLONE_SELECTION_FO, () => w_leo.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, true)],

        [CMD.PROMOTE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.PROMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.PROMOTE_SELECTION, () => w_leo.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, false)],
        [CMD.PROMOTE_SELECTION_FO, () => w_leo.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, true)],

        [CMD.DEMOTE, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.DEMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.DEMOTE_SELECTION, () => w_leo.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, false)],
        [CMD.DEMOTE_SELECTION_FO, () => w_leo.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, true)],

        [CMD.SORT_CHILDREN, () => w_leo.command(LEOCMD.SORT_CHILDREN, U, REFRESH_TREE, false, true)],
        [CMD.SORT_SIBLING, () => w_leo.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, false, true)],
        [CMD.SORT_SIBLING_FO, () => w_leo.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, true, true)],
        [CMD.MARK, (p_node: LeoOutlineNode) => w_leo.changeMark(true, p_node, true)],
        [CMD.MARK_SELECTION, () => w_leo.changeMark(true, U, false)],
        [CMD.MARK_SELECTION_FO, () => w_leo.changeMark(true, U, true)],

        [CMD.UNMARK, (p_node: LeoOutlineNode) => w_leo.changeMark(false, p_node, true)],
        [CMD.UNMARK_SELECTION, () => w_leo.changeMark(false, U, false)],
        [CMD.UNMARK_SELECTION_FO, () => w_leo.changeMark(false, U, true)],

        [CMD.UNMARK_ALL, () => w_leo.command(LEOCMD.UNMARK_ALL, U, REFRESH_TREE_BODY, true)],
        [CMD.EXTRACT, () => w_leo.command(LEOCMD.EXTRACT, U, REFRESH_TREE_BODY, false)],
        [CMD.EXTRACT_NAMES, () => w_leo.command(LEOCMD.EXTRACT_NAMES, U, REFRESH_TREE_BODY, false)],
        [CMD.MOVE_DOWN, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.MOVE_PNODE_DOWN, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_DOWN_SELECTION, () => w_leo.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, false)],
        [CMD.MOVE_DOWN_SELECTION_FO, () => w_leo.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, true)],

        [CMD.MOVE_LEFT, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.MOVE_PNODE_LEFT, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_LEFT_SELECTION, () => w_leo.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, false)],
        [CMD.MOVE_LEFT_SELECTION_FO, () => w_leo.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, true)],

        [CMD.MOVE_RIGHT, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.MOVE_PNODE_RIGHT, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_RIGHT_SELECTION, () => w_leo.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, false)],
        [CMD.MOVE_RIGHT_SELECTION_FO, () => w_leo.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, true)],

        [CMD.MOVE_UP, (p_node: LeoOutlineNode) => w_leo.command(LEOCMD.MOVE_PNODE_UP, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_UP_SELECTION, () => w_leo.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, false)],
        [CMD.MOVE_UP_SELECTION_FO, () => w_leo.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, true)],
        [CMD.REDO, () => w_leo.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, false)],
        [CMD.REDO_FO, () => w_leo.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, true)],
        [CMD.UNDO, () => w_leo.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, false)],
        [CMD.UNDO_FO, () => w_leo.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, true)],
        [CMD.SHOW_OUTLINE, () => w_leo.showOutline(true)], // Also focuses on outline
        [CMD.SHOW_LOG, () => w_leo.showLogPane()],
        [CMD.SHOW_BODY, () => w_leo.showBody(false)], // Also focuses on body
        [CMD.COPY_MARKED, () => w_leo.command(LEOCMD.COPY_MARKED, U, REFRESH_TREE_BODY, true)],
        [CMD.DIFF_MARKED_NODES, () => w_leo.command(LEOCMD.DIFF_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.MARK_CHANGED_ITEMS, () => w_leo.command(LEOCMD.MARK_CHANGED_ITEMS, U, REFRESH_TREE_BODY, true)],
        [CMD.MARK_SUBHEADS, () => w_leo.command(LEOCMD.MARK_SUBHEADS, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_MARKED_NODES, () => w_leo.command(LEOCMD.CLONE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.DELETE_MARKED_NODES, () => w_leo.command(LEOCMD.DELETE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.MOVE_MARKED_NODES, () => w_leo.command(LEOCMD.MOVE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_ALL, () => w_leo.command(LEOCMD.CLONE_FIND_ALL, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_ALL_FLATTENED, () => w_leo.command(LEOCMD.CLONE_FIND_ALL_FLATTENED, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_MARKED, () => w_leo.command(LEOCMD.CLONE_FIND_MARKED, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_FLATTENED_MARKED, () => w_leo.command(LEOCMD.CLONE_FIND_FLATTENED_MARKED, U, REFRESH_TREE_BODY, true)]
    ];

    w_commands.map(function (p_command) {
        p_context.subscriptions.push(vscode.commands.registerCommand(...p_command));
    });



}

// this method is called when your extension is deactivated
export function deactivate() { }


