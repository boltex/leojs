import * as vscode from "vscode";

/**
 * Text and numeric constants used throughout leojs
 */
export class Constants {

    public static NAME: string = "leojs";

    public static TREEVIEW_ID: string = "leojs";
    public static TREEVIEW_EXPLORER_ID: string = "leojsExplorer";

    public static DOCUMENTS_ID: string = "leojsDocuments";
    public static DOCUMENTS_EXPLORER_ID: string = "leojsDocumentsExplorer";

    public static BUTTONS_ID: string = "leojsButtons";
    public static BUTTONS_EXPLORER_ID: string = "leojsButtonsExplorer";

    public static FILE_EXTENSION: string = "leo";
    public static URI_LEO_SCHEME: string = "leo";
    public static URI_FILE_SCHEME: string = "file";
    public static URI_SCHEME_HEADER: string = "leo:/";
    public static FILE_OPEN_FILTER_MESSAGE: string = "Leo Files";
    public static UNTITLED_FILE_NAME: string = "untitled";
    public static RECENT_FILES_KEY: string = "leoRecentFiles";
    public static LAST_FILES_KEY: string = "leoLastFiles";

    public static REFRESH_DEBOUNCE_DELAY: number = 50;
    public static STATES_DEBOUNCE_DELAY: number = 100;
    public static DOCUMENTS_DEBOUNCE_DELAY: number = 100;

    /**
     * Strings used in the workbench interface panels (not for messages or dialogs)
     */
    public static GUI = {
        ICON_LIGHT_DOCUMENT: "resources/light/document.svg",
        ICON_DARK_DOCUMENT: "resources/dark/document.svg",
        ICON_LIGHT_DOCUMENT_DIRTY: "resources/light/document-dirty.svg",
        ICON_DARK_DOCUMENT_DIRTY: "resources/dark/document-dirty.svg",
        ICON_LIGHT_BUTTON: "resources/light/button.svg",
        ICON_DARK_BUTTON: "resources/dark/button.svg",
        ICON_LIGHT_BUTTON_ADD: "resources/light/button-add.svg",
        ICON_DARK_BUTTON_ADD: "resources/dark/button-add.svg",
        ICON_LIGHT_PATH: "resources/light/box",
        ICON_DARK_PATH: "resources/dark/box",
        ICON_FILE_EXT: ".svg",
        STATUSBAR_INDICATOR: "$(keyboard) ",
        STATUSBAR_COLOR: "fb7c47",
        QUICK_OPEN_LEO_COMMANDS: ">leo: ",
        EXPLORER_TREEVIEW_PREFIX: "LEO ",
        TREEVIEW_TITLE: "OUTLINE",
        BODY_TITLE: "LEO BODY",
        LOG_PANE_TITLE: "Leo Log Window",
        THEME_STATUSBAR: "statusBar.foreground"
    };

    /**
     * Basic user messages strings for messages and dialogs
     */
    public static USER_MESSAGES = {
        SCRIPT_BUTTON: "Creates a button from selected node's script",
        SCRIPT_BUTTON_TOOLTIP:
            "The 'Script Button' button creates a new button.\n" +
            "Its name will be the headline of the presently selected node\n" +
            "Hitting this newly created button executes the button's script.\n" +
            "\n" +
            "For example, to run a script on any part of an outline:\n" +
            "\n" +
            "1.  Select the node containing a script. (Ex.: \"g.es(p.h)\")\n" +
            "2.  Press 'Script Button'. This will create a new button.\n" +
            "3.  Select a node on which you want to run the script.\n" +
            "4.  Press the *new* button.",
        SAVE_CHANGES: "Save changes to",
        BEFORE_CLOSING: "before closing?",
        CANCEL: "Cancel",
        OPEN_WITH_LEOJS: "Open this Leo file with leojs?",
        OPEN_RECENT_FILE: "Open Recent Leo File",
        RIGHT_CLICK_TO_OPEN: "Right-click Leo files to open with leojs",
        FILE_ALREADY_OPENED: "Leo file already opened",
        CHOOSE_OPENED_FILE: "Select an opened Leo File",
        FILE_NOT_OPENED: "No files opened.",
        PROMPT_EDIT_HEADLINE: "Edit Headline",
        PROMPT_INSERT_NODE: "Insert Node",
        DEFAULT_HEADLINE: "New Headline",
        CLOSE_ERROR: "Cannot close: No files opened.",
        YES: "Yes",
        NO: "No",
        YES_ALL: "Yes to all",
        NO_ALL: "No to all",
        MINIBUFFER_PROMPT: "Minibuffer Full Command",
        CHANGES_DETECTED: "Changes to external files were detected.",
        REFRESHED: " Nodes refreshed.", // with voluntary leading space
        IGNORED: " They were ignored.", // with voluntary leading space
        TOO_FAST: "Leo is busy! ", // with voluntary trailing space
        STATUSBAR_TOOLTIP_ON: "Leo Key Bindings are in effect",
        STATUSBAR_TOOLTIP_OFF: "Leo Key Bindings off",
    };

    /**
     * * Strings used in 'at-button' panel display in LeoButtonNode
     */
    public static BUTTON_STRINGS = {
        NULL_WIDGET: "nullButtonWidget",
        SCRIPT_BUTTON: "script-button",
        ADD_BUTTON: "leoButtonAdd",
        NORMAL_BUTTON: "leoButtonNode"
    };

    /**
     * Choices offered when about to lose current changes to a Leo Document
     */
    public static ASK_SAVE_CHANGES_BUTTONS: vscode.MessageItem[] = [
        {
            title: Constants.USER_MESSAGES.YES,
            isCloseAffordance: false
        },
        {
            title: Constants.USER_MESSAGES.NO,
            isCloseAffordance: false
        },
        {
            title: Constants.USER_MESSAGES.CANCEL,
            isCloseAffordance: true
        }
    ];

    /**
     * Used in 'when' clauses, set with vscode.commands.executeCommand("setContext",...)
     */
    public static CONTEXT_FLAGS = {
        // Main flags for connection and opened file
        LEO_READY: "leoReady", // Extension activated and classes created and ready
        TREE_OPENED: "leoTreeOpened", // At least one Leo file opened
        TREE_TITLED: "leoTreeTitled", // Tree is a Leo file and not a new untitled document
        SERVER_STARTED: "leoServerStarted", // Auto-start or manually started
        // 'states' flags for currently opened tree view
        LEO_CHANGED: "leoChanged",
        LEO_CAN_UNDO: "leoCanUndo",
        LEO_CAN_REDO: "leoCanRedo",
        LEO_CAN_DEMOTE: "leoCanDemote",
        LEO_CAN_PROMOTE: "leoCanPromote",
        LEO_CAN_DEHOIST: "leoCanDehoist",
        // 'states' flags about current selection, for visibility and commands availability
        SELECTED_MARKED: "leoMarked", // no need for unmarked here, use !leoMarked
        SELECTED_CLONE: "leoCloned",
        SELECTED_DIRTY: "leoDirty",
        SELECTED_EMPTY: "leoEmpty",
        SELECTED_CHILD: "leoChild", // Has children
        SELECTED_ATFILE: "LeoAtFile", // Can be refreshed
        SELECTED_ROOT: "leoRoot", // ! Computed by hand
        // Statusbar Flag 'keybindings in effect'
        LEO_SELECTED: "leoObjectSelected", // keybindings "On": Outline or body has focus
        // Context Flags for 'when' clauses, used concatenated, for each outline node
        NODE_MARKED: "leoNodeMarked",  // Selected node is marked
        NODE_UNMARKED: "leoNodeUnmarked", // Selected node is unmarked (Needed for regexp)
        NODE_ATFILE: "leoNodeAtFile", // Selected node is an @file or @clean, etc...
        NODE_CLONED: "leoNodeCloned",
        NODE_ROOT: "leoNodeRoot",
        NODE_NOT_ROOT: "leoNodeNotRoot",
        // Flags for Leo documents tree view icons and hover node command buttons
        DOCUMENT_SELECTED_TITLED: "leoDocumentSelectedTitled",
        DOCUMENT_TITLED: "leoDocumentTitled",
        DOCUMENT_SELECTED_UNTITLED: "leoDocumentSelectedUntitled",
        DOCUMENT_UNTITLED: "leoDocumentUntitled",
        // UI
        LEO_TREE_BROWSE: "leoTreeBrowse", // Override vscode's tree behavior with Leo's own
        SHOW_EDIT: "showEditOnNodes",
        SHOW_ARROWS: "showArrowsOnNodes",
        SHOW_ADD: "showAddOnNodes",
        SHOW_MARK: "showMarkOnNodes",
        SHOW_CLONE: "showCloneOnNodes",
        SHOW_COPY: "showCopyOnNodes",
    };

    /**
     * Command strings to be used with vscode.commands.executeCommand
     * See https://code.visualstudio.com/api/extension-guides/command#programmatically-executing-a-command
     */
    public static VSCODE_COMMANDS = {
        SET_CONTEXT: "setContext",
        CLOSE_ACTIVE_EDITOR: "workbench.action.closeActiveEditor",
        QUICK_OPEN: "workbench.action.quickOpen"
    };

    /**
     * All commands this expansion exposes to the user via GUI/keybindings in package.json
     */
    public static COMMANDS = {
        // Toggle UI Settings
        ENABLE_LEO_TREE_NAV: Constants.NAME + ".enableLeoTreeNav",
        SHOW_EDIT_ON_NODES: Constants.NAME + ".showEditOnNodes",
        SHOW_ADD_ON_NODES: Constants.NAME + ".showAddOnNodes",
        SHOW_ARROWS_ON_NODES: Constants.NAME + ".showArrowsOnNodes",
        SHOW_COPY_ON_NODES: Constants.NAME + ".showCopyOnNodes",
        SHOW_CLONE_ON_NODES: Constants.NAME + ".showCloneOnNodes",
        SHOW_MARK_ON_NODES: Constants.NAME + ".showMarkOnNodes",
        DISABLE_LEO_TREE_NAV: Constants.NAME + ".disableLeoTreeNav",
        HIDE_EDIT_ON_NODES: Constants.NAME + ".hideEditOnNodes",
        HIDE_ADD_ON_NODES: Constants.NAME + ".hideAddOnNodes",
        HIDE_ARROWS_ON_NODES: Constants.NAME + ".hideArrowsOnNodes",
        HIDE_COPY_ON_NODES: Constants.NAME + ".hideCopyOnNodes",
        HIDE_CLONE_ON_NODES: Constants.NAME + ".hideCloneOnNodes",
        HIDE_MARK_ON_NODES: Constants.NAME + ".hideMarkOnNodes",
        // Leo Documents
        SET_OPENED_FILE: Constants.NAME + ".setOpenedFile",
        OPEN_FILE: Constants.NAME + ".openLeoFile", // sets focus on BODY
        RECENT_FILES: Constants.NAME + ".recentLeoFiles", // shows recent Leo files, opens one on selection
        SWITCH_FILE: Constants.NAME + ".switchLeoFile",
        NEW_FILE: Constants.NAME + ".newLeoFile",
        SAVE_FILE: Constants.NAME + ".saveLeoFile",
        SAVE_FILE_FO: Constants.NAME + ".saveLeoFileFromOutline",
        SAVE_AS_FILE: Constants.NAME + ".saveAsLeoFile",
        CLOSE_FILE: Constants.NAME + ".closeLeoFile",
        MINIBUFFER: Constants.NAME + ".minibuffer",
        GIT_DIFF: Constants.NAME + ".gitDiff",
        // At-buttons
        CLICK_BUTTON: Constants.NAME + ".clickButton",
        REMOVE_BUTTON: Constants.NAME + ".removeButton",
        // Outline Node User Interaction
        SELECT_NODE: Constants.NAME + ".selectTreeNode",
        OPEN_ASIDE: Constants.NAME + ".openAside", // selects and opens body splitting the workspace
        // Goto operations that always finish with focus in outline
        PAGE_UP: Constants.NAME + ".pageUp",
        PAGE_DOWN: Constants.NAME + ".pageDown",
        GOTO_FIRST_VISIBLE: Constants.NAME + ".gotoFirstVisible",
        GOTO_LAST_VISIBLE: Constants.NAME + ".gotoLastVisible",
        GOTO_LAST_SIBLING: Constants.NAME + ".gotoLastSibling",
        GOTO_NEXT_VISIBLE: Constants.NAME + ".gotoNextVisible",
        GOTO_PREV_VISIBLE: Constants.NAME + ".gotoPrevVisible",
        GOTO_NEXT_MARKED: Constants.NAME + ".gotoNextMarked",
        GOTO_NEXT_CLONE: Constants.NAME + ".gotoNextClone",
        GOTO_NEXT_CLONE_SELECTION: Constants.NAME + ".gotoNextCloneSelection",
        GOTO_NEXT_CLONE_SELECTION_FO: Constants.NAME + ".gotoNextCloneSelectionFromOutline",
        CONTRACT_OR_GO_LEFT: Constants.NAME + ".contractOrGoLeft",
        EXPAND_AND_GO_RIGHT: Constants.NAME + ".expandAndGoRight",
        // Leo Operations
        UNDO: Constants.NAME + ".undo", // From command Palette
        UNDO_FO: Constants.NAME + ".undoFromOutline", // from button, return focus on OUTLINE
        REDO: Constants.NAME + ".redo", // From command Palette
        REDO_FO: Constants.NAME + ".redoFromOutline", // from button, return focus on OUTLINE
        EXECUTE: Constants.NAME + ".executeScript",
        SHOW_BODY: Constants.NAME + ".showBody",
        SHOW_OUTLINE: Constants.NAME + ".showOutline",
        SHOW_LOG: Constants.NAME + ".showLogPane",
        SORT_CHILDREN: Constants.NAME + ".sortChildrenSelection",
        SORT_CHILDREN_FO: Constants.NAME + ".sortChildrenSelectionFromOutline",
        SORT_SIBLING: Constants.NAME + ".sortSiblingsSelection",
        SORT_SIBLING_FO: Constants.NAME + ".sortSiblingsSelectionFromOutline",
        CONTRACT_ALL: Constants.NAME + ".contractAll", // From command Palette
        CONTRACT_ALL_FO: Constants.NAME + ".contractAllFromOutline", // from button, return focus on OUTLINE
        // Commands from tree panel buttons or context: focus on OUTLINE
        MARK: Constants.NAME + ".mark",
        UNMARK: Constants.NAME + ".unmark",
        COPY: Constants.NAME + ".copyNode",
        CUT: Constants.NAME + ".cutNode",
        PASTE: Constants.NAME + ".pasteNode",
        PASTE_CLONE: Constants.NAME + ".pasteNodeAsClone",
        DELETE: Constants.NAME + ".delete",
        HEADLINE: Constants.NAME + ".editHeadline",
        MOVE_DOWN: Constants.NAME + ".moveOutlineDown",
        MOVE_LEFT: Constants.NAME + ".moveOutlineLeft",
        MOVE_RIGHT: Constants.NAME + ".moveOutlineRight",
        MOVE_UP: Constants.NAME + ".moveOutlineUp",
        INSERT: Constants.NAME + ".insertNode",
        CLONE: Constants.NAME + ".cloneNode",
        PROMOTE: Constants.NAME + ".promote",
        DEMOTE: Constants.NAME + ".demote",
        REFRESH_FROM_DISK: Constants.NAME + ".refreshFromDisk",
        // Commands from keyboard, while focus on BODY (command-palette returns to BODY for now)
        MARK_SELECTION: Constants.NAME + ".markSelection",
        UNMARK_SELECTION: Constants.NAME + ".unmarkSelection",
        COPY_SELECTION: Constants.NAME + ".copyNodeSelection", // Nothing to refresh/focus so no "FO" version
        CUT_SELECTION: Constants.NAME + ".cutNodeSelection",
        PASTE_SELECTION: Constants.NAME + ".pasteNodeAtSelection",
        PASTE_CLONE_SELECTION: Constants.NAME + ".pasteNodeAsCloneAtSelection",
        DELETE_SELECTION: Constants.NAME + ".deleteSelection",
        HEADLINE_SELECTION: Constants.NAME + ".editSelectedHeadline",
        MOVE_DOWN_SELECTION: Constants.NAME + ".moveOutlineDownSelection",
        MOVE_LEFT_SELECTION: Constants.NAME + ".moveOutlineLeftSelection",
        MOVE_RIGHT_SELECTION: Constants.NAME + ".moveOutlineRightSelection",
        MOVE_UP_SELECTION: Constants.NAME + ".moveOutlineUpSelection",
        INSERT_SELECTION: Constants.NAME + ".insertNodeSelection", // Can be interrupted
        INSERT_SELECTION_INTERRUPT: Constants.NAME + ".insertNodeSelectionInterrupt", // Interrupted version
        CLONE_SELECTION: Constants.NAME + ".cloneNodeSelection",
        PROMOTE_SELECTION: Constants.NAME + ".promoteSelection",
        DEMOTE_SELECTION: Constants.NAME + ".demoteSelection",
        REFRESH_FROM_DISK_SELECTION: Constants.NAME + ".refreshFromDiskSelection",
        // Commands from keyboard, while focus on OUTLINE (no need for COPY_SELECTION)
        MARK_SELECTION_FO: Constants.NAME + ".markSelectionFromOutline",
        UNMARK_SELECTION_FO: Constants.NAME + ".unmarkSelectionFromOutline",
        CUT_SELECTION_FO: Constants.NAME + ".cutNodeSelectionFromOutline",
        PASTE_SELECTION_FO: Constants.NAME + ".pasteNodeAtSelectionFromOutline",
        PASTE_CLONE_SELECTION_FO: Constants.NAME + ".pasteNodeAsCloneAtSelectionFromOutline",
        DELETE_SELECTION_FO: Constants.NAME + ".deleteSelectionFromOutline",
        HEADLINE_SELECTION_FO: Constants.NAME + ".editSelectedHeadlineFromOutline",
        MOVE_DOWN_SELECTION_FO: Constants.NAME + ".moveOutlineDownSelectionFromOutline",
        MOVE_LEFT_SELECTION_FO: Constants.NAME + ".moveOutlineLeftSelectionFromOutline",
        MOVE_RIGHT_SELECTION_FO: Constants.NAME + ".moveOutlineRightSelectionFromOutline",
        MOVE_UP_SELECTION_FO: Constants.NAME + ".moveOutlineUpSelectionFromOutline",
        INSERT_SELECTION_FO: Constants.NAME + ".insertNodeSelectionFromOutline",
        CLONE_SELECTION_FO: Constants.NAME + ".cloneNodeSelectionFromOutline",
        PROMOTE_SELECTION_FO: Constants.NAME + ".promoteSelectionFromOutline",
        DEMOTE_SELECTION_FO: Constants.NAME + ".demoteSelectionFromOutline",
        REFRESH_FROM_DISK_SELECTION_FO: Constants.NAME + ".refreshFromDiskSelectionFromOutline",
        HOIST: Constants.NAME + ".hoistNode",
        HOIST_SELECTION: Constants.NAME + ".hoistSelection",
        HOIST_SELECTION_FO: Constants.NAME + ".hoistSelectionFromOutline",
        DEHOIST: Constants.NAME + ".deHoist",
        DEHOIST_FO: Constants.NAME + ".deHoistFromOutline",
        EXTRACT: Constants.NAME + ".extract",
        EXTRACT_NAMES: Constants.NAME + ".extractNames",
        COPY_MARKED: Constants.NAME + ".copyMarked",
        DIFF_MARKED_NODES: Constants.NAME + ".diffMarkedNodes",
        MARK_CHANGED_ITEMS: Constants.NAME + ".markChangedItems",
        MARK_SUBHEADS: Constants.NAME + ".markSubheads",
        UNMARK_ALL: Constants.NAME + ".unmarkAll",
        CLONE_MARKED_NODES: Constants.NAME + ".cloneMarkedNodes",
        DELETE_MARKED_NODES: Constants.NAME + ".deleteMarkedNodes",
        MOVE_MARKED_NODES: Constants.NAME + ".moveMarkedNodes",
        CLONE_FIND_ALL: Constants.NAME + ".cloneFindAll",
        CLONE_FIND_ALL_FLATTENED: Constants.NAME + ".cloneFindAllFlattened",
        CLONE_FIND_MARKED: Constants.NAME + ".cloneFindMarked",
        CLONE_FIND_FLATTENED_MARKED: Constants.NAME + ".cloneFindFlattenedMarked",
    };

    /**
     * Leo command names that are called from vscode's gui/menu/buttons/keybindings triggers
     */
    public static LEO_COMMANDS = {
        EXECUTE_SCRIPT: "executeScript",
        REFRESH_FROM_DISK: "refreshFromDisk",
        GIT_DIFF: "gitDiff",
        // Goto operations
        PAGE_UP: "pageUp",
        PAGE_DOWN: "pageDown",
        GOTO_FIRST_VISIBLE: "goToFirstVisibleNode",
        GOTO_LAST_VISIBLE: "goToLastVisibleNode",
        GOTO_LAST_SIBLING: "goToLastSibling",
        GOTO_NEXT_VISIBLE: "selectVisNext",
        GOTO_PREV_VISIBLE: "selectVisBack",
        GOTO_NEXT_MARKED: "goToNextMarkedHeadline",
        GOTO_NEXT_CLONE: "goToNextClone",
        CONTRACT_OR_GO_LEFT: "contractNodeOrGoToParent",
        EXPAND_AND_GO_RIGHT: "expandNodeAndGoToFirstChild",
        CONTRACT_ALL: "contractAllHeadlines",
        // Leo Operations
        MARK_PNODE: "markPNode",
        UNMARK_PNODE: "unmarkPNode",
        COPY_PNODE: "copyOutline",
        CUT_PNODE: "cutPNode",
        PASTE_PNODE: "pasteOutline",
        PASTE_CLONE_PNODE: "pasteOutlineRetainingClones",
        DELETE_PNODE: "deletePNode",
        MOVE_PNODE_DOWN: "moveOutlineDown",
        MOVE_PNODE_LEFT: "moveOutlineLeft",
        MOVE_PNODE_RIGHT: "moveOutlineRight",
        MOVE_PNODE_UP: "moveOutlineUp",
        INSERT_PNODE: "insertPNode",
        INSERT_NAMED_PNODE: "insertNamedPNode",
        CLONE_PNODE: "clonePNode",
        PROMOTE_PNODE: "promote",
        DEMOTE_PNODE: "demote",
        REFRESH_FROM_DISK_PNODE: "refreshFromDisk",
        SORT_CHILDREN: "sortChildren",
        SORT_SIBLINGS: "sortSiblings",
        UNDO: "undo",
        REDO: "redo",
        GET_STATES: "getStates",
        HOIST_PNODE: "hoist",
        DEHOIST: "dehoist",
        EXTRACT: "extract",
        EXTRACT_NAMES: "extractNames",
        COPY_MARKED: "copyMarked",
        DIFF_MARKED_NODES: "deleteMarked",
        MARK_CHANGED_ITEMS: "markChangedHeadlines",
        MARK_SUBHEADS: "markSubheads",
        UNMARK_ALL: "unmarkAll",
        CLONE_MARKED_NODES: "cloneMarked",
        DELETE_MARKED_NODES: "deleteMarked",
        MOVE_MARKED_NODES: "moveMarked",
        // Clone-find functionality
        CLONE_FIND_ALL: "cloneFindAll",
        CLONE_FIND_ALL_FLATTENED: "cloneFindAllFlattened",
        CLONE_FIND_MARKED: "cloneFindMarked",
        CLONE_FIND_FLATTENED_MARKED: "cloneFindFlattenedMarked",
    };

}
