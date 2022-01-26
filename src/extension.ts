import * as vscode from 'vscode';
import * as utils from "./utils";
import { ReqRefresh } from "./types";
import { LeoUI } from './leoUI';
import { Constants } from './constants';
import { LeoButtonNode } from './leoButtons';
import { LeoOutlineNode } from './leoOutline';
import { Position } from './core/leoNodes';
// import 'browser-hrtime';
// require('browser-hrtime');
process.hrtime = require('browser-process-hrtime')

export function activate(p_context: vscode.ExtensionContext) {

    const w_start = process.hrtime(); // For calculating total startup time duration

    const w_leoUI: LeoUI = new LeoUI(p_context);

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
        ["leojs.test", () => w_leoUI.test()], // Test function useful when debugging

        [CMD.EXECUTE, () => w_leoUI.command(LEOCMD.EXECUTE_SCRIPT, U, REFRESH_TREE_BODY, false)],

        [CMD.MINIBUFFER, () => w_leoUI.minibuffer()], // Is referenced in package.json

        [CMD.CLICK_BUTTON, (p_node: LeoButtonNode) => w_leoUI.clickAtButton(p_node)], // Not referenced in package.json
        [CMD.REMOVE_BUTTON, (p_node: LeoButtonNode) => w_leoUI.removeAtButton(p_node)],
        [CMD.CLOSE_FILE, () => w_leoUI.closeLeoFile()],
        [CMD.NEW_FILE, () => w_leoUI.newLeoFile()],

        [CMD.OPEN_FILE, (p_uri?: vscode.Uri) => w_leoUI.openLeoFile(p_uri)],

        [CMD.RECENT_FILES, () => w_leoUI.showRecentLeoFiles()],
        [CMD.SAVE_AS_FILE, () => w_leoUI.saveAsLeoFile()],
        [CMD.SAVE_FILE, () => w_leoUI.saveLeoFile()],
        [CMD.SAVE_FILE_FO, () => w_leoUI.saveLeoFile(true)],
        [CMD.SWITCH_FILE, () => w_leoUI.switchLeoFile()],

        [CMD.WRITE_AT_FILE_NODES, () => w_leoUI.command(LEOCMD.WRITE_AT_FILE_NODES, U, REFRESH_TREE, false, false)],
        [CMD.WRITE_AT_FILE_NODES_FO, () => w_leoUI.command(LEOCMD.WRITE_AT_FILE_NODES, U, REFRESH_TREE, true, false)],
        [CMD.WRITE_DIRTY_AT_FILE_NODES, () => w_leoUI.command(LEOCMD.WRITE_DIRTY_AT_FILE_NODES, U, REFRESH_TREE, false, false)],
        [CMD.WRITE_DIRTY_AT_FILE_NODES_FO, () => w_leoUI.command(LEOCMD.WRITE_DIRTY_AT_FILE_NODES, U, REFRESH_TREE, true, false)],

        [CMD.SET_OPENED_FILE, (p_index: number) => w_leoUI.selectOpenedLeoDocument(p_index, true)],

        [CMD.REFRESH_FROM_DISK, (p_node: Position) => w_leoUI.command(LEOCMD.REFRESH_FROM_DISK, p_node, REFRESH_TREE_BODY, false)],

        [CMD.REFRESH_FROM_DISK_SELECTION, () => w_leoUI.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, false)],

        [CMD.REFRESH_FROM_DISK_SELECTION_FO, () => w_leoUI.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, true)],

        [CMD.GIT_DIFF, () => w_leoUI.command(LEOCMD.GIT_DIFF, U, REFRESH_TREE_BODY, false)],
        [CMD.HEADLINE, (p_node: Position) => w_leoUI.editHeadline(p_node, true)],
        [CMD.HEADLINE_SELECTION, () => w_leoUI.editHeadline(U, false)],
        [CMD.HEADLINE_SELECTION_FO, () => w_leoUI.editHeadline(U, true)],
        // cut/copy/paste/delete given node.
        [CMD.COPY, (p_node: Position) => w_leoUI.command(LEOCMD.COPY_PNODE, p_node, NO_REFRESH, true, true)],
        [CMD.CUT, (p_node: Position) => w_leoUI.command(LEOCMD.CUT_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.DELETE, (p_node: Position) => w_leoUI.command(LEOCMD.DELETE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.PASTE, (p_node: Position) => w_leoUI.command(LEOCMD.PASTE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],
        [CMD.PASTE_CLONE, (p_node: Position) => w_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],

        // cut/copy/paste/delete current selection (self.commander.p)
        [CMD.COPY_SELECTION, () => w_leoUI.command(LEOCMD.COPY_PNODE, U, NO_REFRESH, false)],
        [CMD.CUT_SELECTION, () => w_leoUI.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.CUT_SELECTION_FO, () => w_leoUI.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.DELETE_SELECTION, () => w_leoUI.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.DELETE_SELECTION_FO, () => w_leoUI.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.PASTE_CLONE_SELECTION, () => w_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.PASTE_CLONE_SELECTION_FO, () => w_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.PASTE_SELECTION, () => w_leoUI.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.PASTE_SELECTION_FO, () => w_leoUI.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, true)],
        // Called by nodes in the tree when selected either by mouse, or with enter
        //[CMD.SELECT_NODE, (p_node: Position) => w_leoUI.selectTreeNode(p_node.position, false)],
        [CMD.SELECT_NODE, (p_outlineNode: LeoOutlineNode) => w_leoUI.selectTreeNode(p_outlineNode.position, false)], // Select is NOT a Position!
        //[CMD.OPEN_ASIDE, (p_node: Position) => w_leoUI.selectTreeNode(p_node.position, true)],
        [CMD.OPEN_ASIDE, (p_position: Position) => w_leoUI.selectTreeNode(p_position, true)],

        [CMD.CONTRACT_ALL, () => w_leoUI.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, false)],
        [CMD.CONTRACT_ALL_FO, () => w_leoUI.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, true)],

        [CMD.CONTRACT_OR_GO_LEFT, () => w_leoUI.command(LEOCMD.CONTRACT_OR_GO_LEFT, U, REFRESH_TREE_BODY, true)],
        [CMD.EXPAND_AND_GO_RIGHT, () => w_leoUI.command(LEOCMD.EXPAND_AND_GO_RIGHT, U, REFRESH_TREE_BODY, true)],
        [CMD.GOTO_NEXT_CLONE, (p_node: Position) => w_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, p_node, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_NEXT_CLONE_SELECTION, () => w_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, false)],
        [CMD.GOTO_NEXT_CLONE_SELECTION_FO, () => w_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, true)],

        [CMD.GOTO_NEXT_MARKED, () => w_leoUI.command(LEOCMD.GOTO_NEXT_MARKED, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_FIRST_VISIBLE, () => w_leoUI.command(LEOCMD.GOTO_FIRST_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_LAST_SIBLING, () => w_leoUI.command(LEOCMD.GOTO_LAST_SIBLING, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_LAST_VISIBLE, () => w_leoUI.command(LEOCMD.GOTO_LAST_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_NEXT_VISIBLE, () => w_leoUI.command(LEOCMD.GOTO_NEXT_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_PREV_VISIBLE, () => w_leoUI.command(LEOCMD.GOTO_PREV_VISIBLE, U, REFRESH_NODE_BODY, true)],

        [CMD.PAGE_UP, () => w_leoUI.command(LEOCMD.PAGE_UP, U, REFRESH_NODE_BODY, true)],
        [CMD.PAGE_DOWN, () => w_leoUI.command(LEOCMD.PAGE_DOWN, U, REFRESH_NODE_BODY, true)],
        [CMD.DEHOIST, () => w_leoUI.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, false)],
        [CMD.DEHOIST_FO, () => w_leoUI.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, true)],
        [CMD.HOIST, (p_node: Position) => w_leoUI.command(LEOCMD.HOIST_PNODE, p_node, REFRESH_TREE_BODY, true)],
        [CMD.HOIST_SELECTION, () => w_leoUI.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, false)],
        [CMD.HOIST_SELECTION_FO, () => w_leoUI.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, true)],
        [CMD.INSERT, (p_node: Position) => w_leoUI.insertNode(p_node, true, false, false)],
        [CMD.INSERT_SELECTION, () => w_leoUI.insertNode(U, false, false, false)],
        [CMD.INSERT_SELECTION_FO, () => w_leoUI.insertNode(U, true, false, false)],
        // Special command for when inserting rapidly more than one node without
        // even specifying a headline label, e.g. spamming CTRL+I rapidly.
        [CMD.INSERT_SELECTION_INTERRUPT, () => w_leoUI.insertNode(U, false, true, false)],

        [CMD.INSERT_CHILD, (p_node: Position) => w_leoUI.insertNode(p_node, true, false, true)],
        [CMD.INSERT_CHILD_SELECTION, () => w_leoUI.insertNode(U, false, false, true)],
        [CMD.INSERT_CHILD_SELECTION_FO, () => w_leoUI.insertNode(U, true, false, true)],
        // Special command for when inserting rapidly more than one node without
        // even specifying a headline label, e.g. spamming CTRL+I rapidly.
        [CMD.INSERT_CHILD_SELECTION_INTERRUPT, () => w_leoUI.insertNode(U, false, true, true)],

        [CMD.CLONE, (p_node: Position) => w_leoUI.command(LEOCMD.CLONE_PNODE, p_node, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_SELECTION, () => w_leoUI.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, false)],
        [CMD.CLONE_SELECTION_FO, () => w_leoUI.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, true)],

        [CMD.PROMOTE, (p_node: Position) => w_leoUI.command(LEOCMD.PROMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.PROMOTE_SELECTION, () => w_leoUI.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, false)],
        [CMD.PROMOTE_SELECTION_FO, () => w_leoUI.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, true)],

        [CMD.DEMOTE, (p_node: Position) => w_leoUI.command(LEOCMD.DEMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.DEMOTE_SELECTION, () => w_leoUI.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, false)],
        [CMD.DEMOTE_SELECTION_FO, () => w_leoUI.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, true)],

        [CMD.SORT_CHILDREN, () => w_leoUI.command(LEOCMD.SORT_CHILDREN, U, REFRESH_TREE, false, true)],
        [CMD.SORT_SIBLING, () => w_leoUI.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, false, true)],
        [CMD.SORT_SIBLING_FO, () => w_leoUI.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, true, true)],

        [CMD.MARK, (p_node: Position) => w_leoUI.command(LEOCMD.TOGGLE_MARK, p_node, REFRESH_TREE, true, true)],
        [CMD.MARK_SELECTION, () => w_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, false)],
        [CMD.MARK_SELECTION_FO, () => w_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, true)],

        [CMD.UNMARK, (p_node: Position) => w_leoUI.command(LEOCMD.TOGGLE_MARK, p_node, REFRESH_TREE, true, true)],
        [CMD.UNMARK_SELECTION, () => w_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, false)],
        [CMD.UNMARK_SELECTION_FO, () => w_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, true)],

        [CMD.UNMARK_ALL, () => w_leoUI.command(LEOCMD.UNMARK_ALL, U, REFRESH_TREE_BODY, true)],
        [CMD.EXTRACT, () => w_leoUI.command(LEOCMD.EXTRACT, U, REFRESH_TREE_BODY, false)],
        [CMD.EXTRACT_NAMES, () => w_leoUI.command(LEOCMD.EXTRACT_NAMES, U, REFRESH_TREE_BODY, false)],

        [CMD.MOVE_DOWN, (p_node: Position) => w_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_DOWN_SELECTION, () => w_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, false)],
        [CMD.MOVE_DOWN_SELECTION_FO, () => w_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, true)],

        [CMD.MOVE_LEFT, (p_node: Position) => w_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_LEFT_SELECTION, () => w_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, false)],
        [CMD.MOVE_LEFT_SELECTION_FO, () => w_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, true)],

        [CMD.MOVE_RIGHT, (p_node: Position) => w_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_RIGHT_SELECTION, () => w_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, false)],
        [CMD.MOVE_RIGHT_SELECTION_FO, () => w_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, true)],

        [CMD.MOVE_UP, (p_node: Position) => w_leoUI.command(LEOCMD.MOVE_PNODE_UP, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_UP_SELECTION, () => w_leoUI.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, false)],
        [CMD.MOVE_UP_SELECTION_FO, () => w_leoUI.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, true)],

        [CMD.REDO, () => w_leoUI.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, false)],
        [CMD.REDO_FO, () => w_leoUI.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, true)],
        [CMD.UNDO, () => w_leoUI.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, false)],
        [CMD.UNDO_FO, () => w_leoUI.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, true)],
        [CMD.SHOW_OUTLINE, () => w_leoUI.showOutline(true)], // Also focuses on outline
        [CMD.SHOW_LOG, () => w_leoUI.showLogPane()],
        [CMD.SHOW_BODY, () => w_leoUI.showBody(false)], // Also focuses on body
        [CMD.COPY_MARKED, () => w_leoUI.command(LEOCMD.COPY_MARKED, U, REFRESH_TREE_BODY, true)],
        [CMD.DIFF_MARKED_NODES, () => w_leoUI.command(LEOCMD.DIFF_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.MARK_CHANGED_ITEMS, () => w_leoUI.command(LEOCMD.MARK_CHANGED_ITEMS, U, REFRESH_TREE_BODY, true)],
        [CMD.MARK_SUBHEADS, () => w_leoUI.command(LEOCMD.MARK_SUBHEADS, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_MARKED_NODES, () => w_leoUI.command(LEOCMD.CLONE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.DELETE_MARKED_NODES, () => w_leoUI.command(LEOCMD.DELETE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.MOVE_MARKED_NODES, () => w_leoUI.command(LEOCMD.MOVE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],

        [CMD.CLONE_FIND_ALL, () => w_leoUI.command(LEOCMD.CLONE_FIND_ALL, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_ALL_FLATTENED, () => w_leoUI.command(LEOCMD.CLONE_FIND_ALL_FLATTENED, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_MARKED, () => w_leoUI.command(LEOCMD.CLONE_FIND_MARKED, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_FLATTENED_MARKED, () => w_leoUI.command(LEOCMD.CLONE_FIND_FLATTENED_MARKED, U, REFRESH_TREE_BODY, true)],

        // [CMD.SET_FIND_EVERYWHERE_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.ENTIRE_OUTLINE)],
        // [CMD.SET_FIND_NODE_ONLY_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.NODE_ONLY)],
        // [CMD.SET_FIND_SUBOUTLINE_ONLY_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SUBOUTLINE_ONLY)],
        // [CMD.TOGGLE_FIND_IGNORE_CASE_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.IGNORE_CASE)],
        // [CMD.TOGGLE_FIND_MARK_CHANGES_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.MARK_CHANGES)],
        // [CMD.TOGGLE_FIND_MARK_FINDS_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.MARK_FINDS)],
        // [CMD.TOGGLE_FIND_REGEXP_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.REG_EXP)],
        // [CMD.TOGGLE_FIND_WORD_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.WHOLE_WORD)],
        // [CMD.TOGGLE_FIND_SEARCH_BODY_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SEARCH_BODY)],
        // [CMD.TOGGLE_FIND_SEARCH_HEADLINE_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SEARCH_HEADLINE)],

        [CMD.SET_ENABLE_PREVIEW, () => w_leoUI.config.setEnablePreview()],
        [CMD.CLEAR_CLOSE_EMPTY_GROUPS, () => w_leoUI.config.clearCloseEmptyGroups()],
        [CMD.SET_CLOSE_ON_FILE_DELETE, () => w_leoUI.config.setCloseOnFileDelete()],
    ];

    w_commands.map(function (p_command) {
        p_context.subscriptions.push(vscode.commands.registerCommand(...p_command));
    });

    // * Log time taken for startup
    console.log('leojs startup launched in ', utils.getDurationMs(w_start), 'ms');


}

// this method is called when your extension is deactivated
export function deactivate() { }


