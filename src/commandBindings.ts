import * as vscode from "vscode";
import { Constants } from "./constants";
import { Position } from "./core/leoNodes";
import { LeoButtonNode } from "./leoButtons";
import { LeoOutlineNode } from "./leoOutline";
import { LeoUI } from "./leoUI";
import { ReqRefresh } from "./types";

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

        [CMD.EXECUTE, () => p_leoUI.command(LEOCMD.EXECUTE_SCRIPT, U, REFRESH_ALL, false)],

        [CMD.MINIBUFFER, () => p_leoUI.minibuffer()], // Is referenced in package.json
        [CMD.SET_LEO_ID, () => p_leoUI.setLeoIDCommand()],

        [CMD.CLICK_BUTTON, (p_node: LeoButtonNode) => p_leoUI.clickAtButton(p_node)], // Not referenced in package.json
        [CMD.GOTO_SCRIPT, (p_node: LeoButtonNode) => p_leoUI.gotoScript(p_node)],
        [CMD.REMOVE_BUTTON, (p_node: LeoButtonNode) => p_leoUI.removeAtButton(p_node)],

        [CMD.CLOSE_FILE, () => p_leoUI.closeLeoFile()],
        // [CMD.NEW_FILE, () => p_leoUI.command(LEOCMD.NEW, U, REFRESH_ALL, false)],
        [CMD.NEW_FILE, () => p_leoUI.newLeoFile()],
        [CMD.OPEN_FILE, (p_uri?: vscode.Uri) => p_leoUI.openLeoFile(p_uri)],
        [CMD.SAVE_AS_FILE, () => p_leoUI.saveAsLeoFile()],
        [CMD.SAVE_AS_LEOJS, () => p_leoUI.saveAsLeoJsFile()],
        [CMD.SAVE_FILE, () => p_leoUI.saveLeoFile()],
        [CMD.SAVE_FILE_FO, () => p_leoUI.saveLeoFile(true)],

        [CMD.SWITCH_FILE, () => p_leoUI.switchLeoFile()],
        [CMD.RECENT_FILES, () => p_leoUI.showRecentLeoFiles()],

        [CMD.WRITE_AT_FILE_NODES, () => p_leoUI.command(LEOCMD.WRITE_AT_FILE_NODES, U, REFRESH_TREE, false, false)],
        [CMD.WRITE_AT_FILE_NODES_FO, () => p_leoUI.command(LEOCMD.WRITE_AT_FILE_NODES, U, REFRESH_TREE, true, false)],
        [CMD.WRITE_DIRTY_AT_FILE_NODES, () => p_leoUI.command(LEOCMD.WRITE_DIRTY_AT_FILE_NODES, U, REFRESH_TREE, false, false)],
        [CMD.WRITE_DIRTY_AT_FILE_NODES_FO, () => p_leoUI.command(LEOCMD.WRITE_DIRTY_AT_FILE_NODES, U, REFRESH_TREE, true, false)],

        [CMD.SET_OPENED_FILE, (p_index: number) => p_leoUI.selectOpenedLeoDocument(p_index, true)],

        [CMD.REFRESH_FROM_DISK, (p_node: Position) => p_leoUI.command(LEOCMD.REFRESH_FROM_DISK, p_node, REFRESH_TREE_BODY, false)],

        [CMD.REFRESH_FROM_DISK_SELECTION, () => p_leoUI.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, false)],

        [CMD.REFRESH_FROM_DISK_SELECTION_FO, () => p_leoUI.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, true)],

        [CMD.GIT_DIFF, () => p_leoUI.command(LEOCMD.GIT_DIFF, U, REFRESH_TREE_BODY, false)],

        [CMD.HEADLINE, (p_node: Position) => p_leoUI.editHeadline(p_node, true)],
        [CMD.HEADLINE_SELECTION, () => p_leoUI.editHeadline(U, false)],
        [CMD.HEADLINE_SELECTION_FO, () => p_leoUI.editHeadline(U, true)],

        // cut/copy/paste/delete given node.
        [CMD.COPY, (p_node: Position) => p_leoUI.command(LEOCMD.COPY_PNODE, p_node, NO_REFRESH, true, true)],
        [CMD.CUT, (p_node: Position) => p_leoUI.command(LEOCMD.CUT_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.DELETE, (p_node: Position) => p_leoUI.command(LEOCMD.DELETE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.PASTE, (p_node: Position) => p_leoUI.command(LEOCMD.PASTE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],
        [CMD.PASTE_CLONE, (p_node: Position) => p_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],

        // cut/copy/paste/delete current selection (self.commander.p)
        [CMD.COPY_SELECTION, () => p_leoUI.command(LEOCMD.COPY_PNODE, U, NO_REFRESH, false)],
        [CMD.CUT_SELECTION, () => p_leoUI.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.CUT_SELECTION_FO, () => p_leoUI.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.DELETE_SELECTION, () => p_leoUI.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.DELETE_SELECTION_FO, () => p_leoUI.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.PASTE_CLONE_SELECTION, () => p_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.PASTE_CLONE_SELECTION_FO, () => p_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, true)],
        [CMD.PASTE_SELECTION, () => p_leoUI.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, false)],
        [CMD.PASTE_SELECTION_FO, () => p_leoUI.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, true)],

        // Called by nodes in the tree when selected either by mouse, or with enter
        //[CMD.SELECT_NODE, (p_node: Position) => w_leoUI.selectTreeNode(p_node.position, false)],
        [CMD.SELECT_NODE, (p_outlineNode: LeoOutlineNode) => p_leoUI.selectTreeNode(p_outlineNode.position, false)], // Select is NOT a Position!
        //[CMD.OPEN_ASIDE, (p_node: Position) => w_leoUI.selectTreeNode(p_node.position, true)],
        [CMD.OPEN_ASIDE, (p_position: Position) => p_leoUI.selectTreeNode(p_position, true)],

        [CMD.CONTRACT_ALL, () => p_leoUI.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, false)],
        [CMD.CONTRACT_ALL_FO, () => p_leoUI.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, true)],

        [CMD.CONTRACT_OR_GO_LEFT, () => p_leoUI.command(LEOCMD.CONTRACT_OR_GO_LEFT, U, REFRESH_TREE_BODY, true)],
        [CMD.EXPAND_AND_GO_RIGHT, () => p_leoUI.command(LEOCMD.EXPAND_AND_GO_RIGHT, U, REFRESH_TREE_BODY, true)],

        [CMD.GOTO_NEXT_CLONE, (p_node: Position) => p_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, p_node, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_NEXT_CLONE_SELECTION, () => p_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, false)],
        [CMD.GOTO_NEXT_CLONE_SELECTION_FO, () => p_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, true)],

        [CMD.GOTO_NEXT_MARKED, () => p_leoUI.command(LEOCMD.GOTO_NEXT_MARKED, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_FIRST_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_FIRST_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_LAST_SIBLING, () => p_leoUI.command(LEOCMD.GOTO_LAST_SIBLING, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_LAST_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_LAST_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_NEXT_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_NEXT_VISIBLE, U, REFRESH_NODE_BODY, true)],
        [CMD.GOTO_PREV_VISIBLE, () => p_leoUI.command(LEOCMD.GOTO_PREV_VISIBLE, U, REFRESH_NODE_BODY, true)],

        [CMD.PAGE_UP, () => p_leoUI.command(LEOCMD.PAGE_UP, U, REFRESH_NODE_BODY, true)],
        [CMD.PAGE_DOWN, () => p_leoUI.command(LEOCMD.PAGE_DOWN, U, REFRESH_NODE_BODY, true)],

        [CMD.DEHOIST, () => p_leoUI.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, false)],
        [CMD.DEHOIST_FO, () => p_leoUI.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, true)],
        [CMD.HOIST, (p_node: Position) => p_leoUI.command(LEOCMD.HOIST_PNODE, p_node, REFRESH_TREE_BODY, true)],
        [CMD.HOIST_SELECTION, () => p_leoUI.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, false)],
        [CMD.HOIST_SELECTION_FO, () => p_leoUI.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, true)],

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

        [CMD.CLONE, (p_node: Position) => p_leoUI.command(LEOCMD.CLONE_PNODE, p_node, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_SELECTION, () => p_leoUI.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, false)],
        [CMD.CLONE_SELECTION_FO, () => p_leoUI.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, true)],

        [CMD.PROMOTE, (p_node: Position) => p_leoUI.command(LEOCMD.PROMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.PROMOTE_SELECTION, () => p_leoUI.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, false)],
        [CMD.PROMOTE_SELECTION_FO, () => p_leoUI.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, true)],

        [CMD.DEMOTE, (p_node: Position) => p_leoUI.command(LEOCMD.DEMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.DEMOTE_SELECTION, () => p_leoUI.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, false)],
        [CMD.DEMOTE_SELECTION_FO, () => p_leoUI.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, true)],

        [CMD.SORT_CHILDREN, () => p_leoUI.command(LEOCMD.SORT_CHILDREN, U, REFRESH_TREE, false, true)],
        [CMD.SORT_SIBLING, () => p_leoUI.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, false, true)],
        [CMD.SORT_SIBLING_FO, () => p_leoUI.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, true, true)],

        [CMD.MARK, (p_node: Position) => p_leoUI.command(LEOCMD.TOGGLE_MARK, p_node, REFRESH_TREE, true, true)],
        [CMD.MARK_SELECTION, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, false)],
        [CMD.MARK_SELECTION_FO, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, true)],
        [CMD.UNMARK, (p_node: Position) => p_leoUI.command(LEOCMD.TOGGLE_MARK, p_node, REFRESH_TREE, true, true)],
        [CMD.UNMARK_SELECTION, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, false)],
        [CMD.UNMARK_SELECTION_FO, () => p_leoUI.command(LEOCMD.TOGGLE_MARK, U, REFRESH_TREE, true)],
        [CMD.UNMARK_ALL, () => p_leoUI.command(LEOCMD.UNMARK_ALL, U, REFRESH_TREE_BODY, true)],

        [CMD.EXTRACT, () => p_leoUI.command(LEOCMD.EXTRACT, U, REFRESH_TREE_BODY, false)],
        [CMD.EXTRACT_NAMES, () => p_leoUI.command(LEOCMD.EXTRACT_NAMES, U, REFRESH_TREE_BODY, false)],

        [CMD.MOVE_DOWN, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_DOWN_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, false)],
        [CMD.MOVE_DOWN_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, true)],

        [CMD.MOVE_LEFT, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_LEFT_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, false)],
        [CMD.MOVE_LEFT_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, true)],

        [CMD.MOVE_RIGHT, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_RIGHT_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, false)],
        [CMD.MOVE_RIGHT_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, true)],

        [CMD.MOVE_UP, (p_node: Position) => p_leoUI.command(LEOCMD.MOVE_PNODE_UP, p_node, REFRESH_TREE_BODY, true, true)],
        [CMD.MOVE_UP_SELECTION, () => p_leoUI.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, false)],
        [CMD.MOVE_UP_SELECTION_FO, () => p_leoUI.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, true)],

        [CMD.REDO, () => p_leoUI.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, false)],
        [CMD.REDO_FO, () => p_leoUI.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, true)],
        [CMD.UNDO, () => p_leoUI.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, false)],
        [CMD.UNDO_FO, () => p_leoUI.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, true)],

        [CMD.SHOW_OUTLINE, () => p_leoUI.showOutline(true)], // Also focuses on outline
        [CMD.SHOW_LOG, () => p_leoUI.showLogPane()],
        [CMD.SHOW_BODY, () => p_leoUI.showBody(false)], // Also focuses on body

        [CMD.COPY_MARKED, () => p_leoUI.command(LEOCMD.COPY_MARKED, U, REFRESH_TREE_BODY, true)],
        [CMD.DIFF_MARKED_NODES, () => p_leoUI.command(LEOCMD.DIFF_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.MARK_CHANGED_ITEMS, () => p_leoUI.command(LEOCMD.MARK_CHANGED_ITEMS, U, REFRESH_TREE_BODY, true)],
        [CMD.MARK_SUBHEADS, () => p_leoUI.command(LEOCMD.MARK_SUBHEADS, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_MARKED_NODES, () => p_leoUI.command(LEOCMD.CLONE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.DELETE_MARKED_NODES, () => p_leoUI.command(LEOCMD.DELETE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
        [CMD.MOVE_MARKED_NODES, () => p_leoUI.command(LEOCMD.MOVE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],

        [CMD.PREV_NODE, () => p_leoUI.command(LEOCMD.GOTO_PREV_HISTORY, U, REFRESH_TREE_BODY, false)],
        [CMD.PREV_NODE_FO, () => p_leoUI.command(LEOCMD.GOTO_PREV_HISTORY, U, REFRESH_TREE_BODY, true)],

        [CMD.NEXT_NODE, () => p_leoUI.command(LEOCMD.GOTO_NEXT_HISTORY, U, REFRESH_TREE_BODY, false)],
        [CMD.NEXT_NODE_FO, () => p_leoUI.command(LEOCMD.GOTO_NEXT_HISTORY, U, REFRESH_TREE_BODY, true)],

        [CMD.CLONE_FIND_ALL, () => p_leoUI.command(LEOCMD.CLONE_FIND_ALL, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_ALL_FLATTENED, () => p_leoUI.command(LEOCMD.CLONE_FIND_ALL_FLATTENED, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_MARKED, () => p_leoUI.command(LEOCMD.CLONE_FIND_MARKED, U, REFRESH_TREE_BODY, true)],
        [CMD.CLONE_FIND_FLATTENED_MARKED, () => p_leoUI.command(LEOCMD.CLONE_FIND_FLATTENED_MARKED, U, REFRESH_TREE_BODY, true)],

        // [CMD.SET_FIND_EVERYWHERE_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.ENTIRE_OUTLINE)],
        // [CMD.SET_FIND_NODE_ONLY_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.NODE_ONLY)],
        // [CMD.SET_FIND_FILE_ONLY_OPTION, () => w_leo.setSearchSetting(Constants.FIND_INPUTS_IDS.FILE_ONLY)],
        // [CMD.SET_FIND_SUBOUTLINE_ONLY_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SUBOUTLINE_ONLY)],
        // [CMD.TOGGLE_FIND_IGNORE_CASE_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.IGNORE_CASE)],
        // [CMD.TOGGLE_FIND_MARK_CHANGES_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.MARK_CHANGES)],
        // [CMD.TOGGLE_FIND_MARK_FINDS_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.MARK_FINDS)],
        // [CMD.TOGGLE_FIND_REGEXP_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.REG_EXP)],
        // [CMD.TOGGLE_FIND_WORD_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.WHOLE_WORD)],
        // [CMD.TOGGLE_FIND_SEARCH_BODY_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SEARCH_BODY)],
        // [CMD.TOGGLE_FIND_SEARCH_HEADLINE_OPTION, () => w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SEARCH_HEADLINE)],

        [CMD.SET_ENABLE_PREVIEW, () => p_leoUI.config.setEnablePreview()],
        [CMD.CLEAR_CLOSE_EMPTY_GROUPS, () => p_leoUI.config.clearCloseEmptyGroups()],
        [CMD.SET_CLOSE_ON_FILE_DELETE, () => p_leoUI.config.setCloseOnFileDelete()],

    ];

    w_commands.map(function (p_command) {
        p_context.subscriptions.push(vscode.commands.registerCommand(...p_command));
    });
}

