import * as vscode from "vscode";

/**
 * Text and numeric constants used throughout leojs
 */
export class Constants {

    /**
     * Identity of account that can publish extensions to the Visual Studio Code Marketplace. 
     */
    public static PUBLISHER: string = "boltex";

    /**
     * The name of the extension - should be all lowercase with no spaces.
     */
    public static NAME: string = "leojs";

    public static TREEVIEW_ID: string = "leojsOutline";
    public static TREEVIEW_EXPLORER_ID: string = "leojsOutlineExplorer";

    public static DOCUMENTS_ID: string = "leojsDocuments";
    public static DOCUMENTS_EXPLORER_ID: string = "leojsDocumentsExplorer";

    public static BUTTONS_ID: string = "leojsButtons";
    public static BUTTONS_EXPLORER_ID: string = "leojsButtonsExplorer";

    public static FIND_ID: string = "leojsFindPanel";
    public static FIND_EXPLORER_ID: string = "leojsFindPanelExplorer";

    public static GOTO_ID: string = "leojsGotoPanel";
    public static GOTO_EXPLORER_ID: string = "leojsGotoPanelExplorer";

    public static UNDOS_ID: string = "leojsUndos";
    public static UNDOS_EXPLORER_ID: string = "leojsUndosExplorer";

    public static VERSION_STATE_KEY: string = "leojsVersion";

    public static FILE_EXTENSION: string = "leo";
    public static DB_FILE_EXTENSION: string = "db";
    public static JS_FILE_EXTENSION: string = "leojs";

    public static LEO_LANGUAGE_PREFIX: string = "leojsbody."; // all lowercase.

    public static URI_LEO_SCHEME: string = "leojs";
    public static URI_FILE_SCHEME: string = "file";
    public static URI_SCHEME_HEADER: string = "leojs:/";
    public static FILE_OPEN_FILTER_MESSAGE: string = "Leo Files"; // Meant for all 3 leo, db and leojs.
    public static UNTITLED_FILE_NAME: string = "untitled";
    public static RECENT_FILES_KEY: string = "leojsRecentFiles";
    public static LAST_FILES_KEY: string = "leojsLastFiles";

    public static REFRESH_DEBOUNCE_DELAY: number = 50;
    public static STATES_DEBOUNCE_DELAY: number = 60;
    public static TITLE_DEBOUNCE_DELAY: number = 20;
    public static BUTTONS_DEBOUNCE_DELAY: number = 160;
    public static DOCUMENTS_DEBOUNCE_DELAY: number = 80;
    public static UNDOS_DEBOUNCE_DELAY: number = 140;
    public static UNDOS_REVEAL_DEBOUNCE_DELAY: number = 50;
    public static GOTO_DEBOUNCE_DELAY: number = 50;
    public static BODY_STATES_DEBOUNCE_DELAY: number = 120;

    public static CONFIG_NAME: string = "leojs";
    public static CONFIG_WORKBENCH_ENABLED_PREVIEW: string = "workbench.editor.enablePreview";
    public static CONFIG_REFRESH_MATCH: string = "OnNodes"; // substring to distinguish 'on-hover' icon commands

    /**
     * Strings used in the workbench interface panels (not for messages or dialogs)
     */
    public static GUI = {
        ICON_LIGHT_PARENT: "resources/light/parent.svg",
        ICON_DARK_PARENT: "resources/dark/parent.svg",
        ICON_LIGHT_NODE: "resources/light/node.svg",
        ICON_DARK_NODE: "resources/dark/node.svg",
        ICON_LIGHT_BODY: "resources/light/body.svg",
        ICON_DARK_BODY: "resources/dark/body.svg",
        ICON_LIGHT_TAG: "resources/light/tag.svg",
        ICON_DARK_TAG: "resources/dark/tag.svg",

        ICON_LIGHT_DOCUMENT: "resources/light/document.svg",
        ICON_DARK_DOCUMENT: "resources/dark/document.svg",
        ICON_LIGHT_DOCUMENT_DIRTY: "resources/light/document-dirty.svg",
        ICON_DARK_DOCUMENT_DIRTY: "resources/dark/document-dirty.svg",

        ICON_LIGHT_UNDO_ACTIVE: "resources/light/undo.svg",
        ICON_DARK_UNDO_ACTIVE: "resources/dark/undo.svg",
        ICON_LIGHT_UNDO: "resources/dark/undo.svg",
        ICON_DARK_UNDO: "resources/light/undo.svg",
        ICON_LIGHT_REDO_ACTIVE: "resources/light/redo.svg",
        ICON_DARK_REDO_ACTIVE: "resources/dark/redo.svg",
        ICON_LIGHT_REDO: "resources/dark/redo.svg",
        ICON_DARK_REDO: "resources/light/redo.svg",

        ICON_LIGHT_BUTTON: "resources/light/button.svg",
        ICON_DARK_BUTTON: "resources/dark/button.svg",
        ICON_LIGHT_BUTTON_RCLICK: "resources/light/button-rclick.svg",
        ICON_DARK_BUTTON_RCLICK: "resources/dark/button-rclick.svg",
        ICON_LIGHT_BUTTON_ADD: "resources/light/button-add.svg",
        ICON_DARK_BUTTON_ADD: "resources/dark/button-add.svg",

        ICON_LIGHT_PATH: "resources/light/box",
        ICON_DARK_PATH: "resources/dark/box",
        ICON_FILE_EXT: ".svg",
        SVG_SHEME: "data",
        SVG_OPEN: 'image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">',
        SVG_CLOSE: "</svg>",
        STATUSBAR_INDICATOR: "$(keyboard) ",
        STATUSBAR_COLOR: "fb7c47",
        QUICK_OPEN_LEO_COMMANDS: ">leojs: ",
        EXPLORER_TREEVIEW_PREFIX: "LEOJS ",
        TREEVIEW_TITLE: "OUTLINE",
        BODY_TITLE: "LEOJS BODY",
        LOG_PANE_TITLE: "LeoJS Log Window",
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
        SAVE_DIALOG_LABEL: "Save Leo File",
        BEFORE_CLOSING: "before closing?",
        CANCEL: "Cancel",
        OPEN_WITH_LEOJS: "Open this Leojs file?",
        OPEN_RECENT_FILE: "Open Recent Leojs File",
        RIGHT_CLICK_TO_OPEN: "Right-click to open with leojs",
        FILE_ALREADY_OPENED: "Leojs file already opened",

        CLEARED_RECENT: "Cleared recent files list",
        CHOOSE_OPENED_FILE: "Select an opened Leojs File",
        FILE_NOT_OPENED: "No files opened.",
        STATUSBAR_TOOLTIP_ON: "Leo Key Bindings are in effect", // TODO : Add description of what happens if clicked
        STATUSBAR_TOOLTIP_OFF: "Leo Key Bindings off", // TODO : Add description of what happens if clicked
        PROMPT_EDIT_HEADLINE: "Edit Headline",
        PROMPT_INSERT_NODE: "Insert Node",
        PROMPT_INSERT_CHILD: "Insert Child",
        DEFAULT_HEADLINE: "New Headline",
        TITLE_GOTO_GLOBAL_LINE: "Goto global line",
        PLACEHOLDER_GOTO_GLOBAL_LINE: "#",
        PROMPT_GOTO_GLOBAL_LINE: "Line number",

        REPLACE_TITLE: "Replace with",
        REPLACE_PROMPT: "Type text to replace with and press enter.",
        REPLACE_PLACEHOLDER: "Replace pattern here",

        SEARCH_TITLE: "Search for",
        SEARCH_PROMPT: "Type text to search for and press enter.",
        SEARCH_PLACEHOLDER: "Find pattern here",

        INT_SEARCH_TITLE: "Search",
        INT_SEARCH_PROMPT: "'Enter' to search",
        INT_SEARCH_BACKWARD: " Backward", // Leading space intended
        INT_SEARCH_REGEXP: "Regexp ", // Trailing space intended
        INT_SEARCH_WORD: "Word ", // Trailing space intended

        SEARCH_NOT_FOUND: "Not found",
        FIND_PATTERN_HERE: "<find pattern here>",

        TAGS_CHARACTERS_ERROR: "Cannot add tags containing any of these characters: &|^-",
        NO_TAGS_ON_NODE: "No tags on node: ", // Trailing space intended

        TITLE_TAG_CHILDREN: "Tag Children",
        TITLE_REMOVE_TAG: "Remove Tag",
        TITLE_TAG_NODE: "Tag Node",
        PLACEHOLDER_TAG: "<tag>",
        PROMPT_TAG: "Enter a tag name",
        TITLE_FIND_TAG: "Find Tag",
        PLACEHOLDER_CLONE_FIND_TAG: "<tag>",
        PROMPT_CLONE_FIND_TAG: "Enter a tag name",

        CLOSE_ERROR: "Cannot close: No files opened.",
        YES: "Yes",
        NO: "No",
        YES_ALL: "Yes to all",
        NO_ALL: "No to all",
        CHOOSE_BUTTON: "Choose @button or @rclick",
        SEARCH_POSITION_BY_HEADLINE: "Search positions by headline",
        MINIBUFFER_PROMPT: "Minibuffer Full Command",
        SELECT_CHAPTER_PROMPT: "Select chapter",
        CHANGES_DETECTED: "Changes to external files were detected.",
        REFRESHED: " Nodes refreshed.", // with voluntary leading space
        IGNORED: " They were ignored.", // with voluntary leading space
        TOO_FAST: "Leo is busy! ", // with voluntary trailing space

        UNKNOWN_LANGUAGE_NOT_SUPPORTED: "Language not yet supported.",
        LANGUAGE_NOT_SUPPORTED: " language not yet supported.", // with leading space
        MINIBUFFER_BUTTON_START: "@button-",
        MINIBUFFER_DEL_BUTTON_START: "delete-@button-",
        MINIBUFFER_COMMAND_START: "@command-",
        MINIBUFFER_USER_DEFINED: "$(run) User defined command.",
        MINIBUFFER_HISTORY_LABEL: "Minibuffer History",
        MINIBUFFER_HISTORY_DESC: "$(history) Choose from last run commands...",

        ZOOM_LEVEL_RANGE_LIMIT: "Value for zoom level should be between -12 and 12",
        FONT_SIZE_RANGE_LIMIT: "Value for font size should be between 6 and 30",
        FIX_IT: "Fix it",
        ENABLE_PREVIEW_SET: "'Enable Preview' setting was set",
        ENABLE_PREVIEW_RECOMMEND: "'Enable Preview' setting is recommended (currently disabled)",
        CLOSE_EMPTY_CLEARED: "'Close Empty Groups' setting was cleared",
        CLOSE_EMPTY_RECOMMEND: "'Close Empty Groups' setting is NOT recommended!",
        CLOSE_ON_DELETE_SET: "'Close on File Delete' setting was set",
        CLOSE_ON_DELETE_RECOMMEND: "'Close on File Delete' setting is recommended (currently disabled)",
        SET_LEO_ID_MESSAGE: "Leo ID not found. Please enter an id that identifies you uniquely.",
        GET_LEO_ID_PROMPT: "Please enter an id that identifies you uniquely.\n(Letters and numbers only, and at least 3 characters in length)",
        ENTER_LEO_ID: "Enter Leo id"
    };

    /**
     * * Find panel controls ids
     */
    public static FIND_INPUTS_IDS = {
        FIND_TEXT: "findText",
        REPLACE_TEXT: "replaceText",
        ENTIRE_OUTLINE: "entireOutline",
        FILE_ONLY: "fileOnly",
        NODE_ONLY: "nodeOnly",
        SUBOUTLINE_ONLY: "subOutlineOnly",
        IGNORE_CASE: "ignoreCase",
        MARK_CHANGES: "markChanges",
        MARK_FINDS: "markFinds",
        REG_EXP: "regExp",
        WHOLE_WORD: "wholeWord",
        SEARCH_BODY: "searchBody",
        SEARCH_HEADLINE: "searchHeadline"
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
     * * String for JSON configuration keys such as treeKeepFocus, defaultReloadIgnore, etc.
     */
    public static CONFIG_NAMES = {
        CHECK_FOR_CHANGE_EXTERNAL_FILES: "checkForChangeExternalFiles",
        DEFAULT_RELOAD_IGNORE: "defaultReloadIgnore",
        LEO_TREE_BROWSE: "leoTreeBrowse",
        TREE_KEEP_FOCUS: "treeKeepFocus",
        TREE_KEEP_FOCUS_WHEN_ASIDE: "treeKeepFocusWhenAside",
        // STATUSBAR_STRING: "statusBarString",
        // STATUSBAR_COLOR: "statusBarColor",
        TREE_IN_EXPLORER: "treeInExplorer",
        SHOW_OPEN_ASIDE: "showOpenAside",
        SHOW_EDIT: "showEditOnNodes",
        // SHOW_ARROWS: "showArrowsOnNodes",
        SHOW_ADD: "showAddOnNodes",
        SHOW_MARK: "showMarkOnNodes",
        SHOW_CLONE: "showCloneOnNodes",
        SHOW_COPY: "showCopyOnNodes",

        COLLAPSE_ALL_SHORTCUT: "collapseAllShortcut",
        ACTIVITY_VIEW_SHORTCUT: "ActivityViewShortcut",
        GO_ANYWHERE_SHORTCUT: "goAnywhereShortcut",

        // SHOW_EDITION_BODY: "showEditionOnBody",
        // SHOW_CLIPBOARD_BODY: "showClipboardOnBody",
        // SHOW_PROMOTE_BODY: "showPromoteOnBody",
        // SHOW_EXECUTE_BODY: "showExecuteOnBody",
        // SHOW_EXTRACT_BODY: "showExtractOnBody",
        // SHOW_IMPORT_BODY: "showImportOnBody",
        // SHOW_REFRESH_BODY: "showRefreshOnBody",
        // SHOW_HOIST_BODY: "showHoistOnBody",
        // SHOW_MARK_BODY: "showMarkOnBody",
        // SHOW_SORT_BODY: "showSortOnBody",

        INVERT_NODES: "invertNodeContrast",
        LEO_ID: "leoID"
    };

    /**
     * * Configuration Defaults used in config.ts
     * Used when setting itself and getting parameters from vscode
     */
    public static CONFIG_DEFAULTS = {
        CHECK_FOR_CHANGE_EXTERNAL_FILES: "none",  // Used in leoBridge scrip,
        DEFAULT_RELOAD_IGNORE: "none", // Used in leoBridge scrip,
        LEO_TREE_BROWSE: true,
        TREE_KEEP_FOCUS: true,
        TREE_KEEP_FOCUS_WHEN_ASIDE: false,

        COLLAPSE_ALL_SHORTCUT: true,
        ACTIVITY_VIEW_SHORTCUT: true,
        GO_ANYWHERE_SHORTCUT: true,

        // STATUSBAR_STRING: "", // Strings like "Literate", "Leo", UTF-8 also supported: \u{1F981}
        // STATUSBAR_COLOR: "fb7c47",

        TREE_IN_EXPLORER: true,
        SHOW_OPEN_ASIDE: true,
        SHOW_EDIT: true,
        // SHOW_ARROWS: false,
        SHOW_ADD: false,
        SHOW_MARK: false,
        SHOW_CLONE: false,
        SHOW_COPY: false,

        // SHOW_EDITION_BODY: true,
        // SHOW_CLIPBOARD_BODY: true,
        // SHOW_PROMOTE_BODY: true,
        // SHOW_EXECUTE_BODY: true,
        // SHOW_EXTRACT_BODY: true,
        // SHOW_IMPORT_BODY: true,
        // SHOW_REFRESH_BODY: true,
        // SHOW_HOIST_BODY: true,
        // SHOW_MARK_BODY: true,
        // SHOW_SORT_BODY: true,

        INVERT_NODES: false,
        LEO_ID: ""
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
        LEO_STARTUP_DONE: "leojsStartupDone",
        LEO_READY: "leojsReady", // Extension activated and classes created and ready
        TREE_OPENED: "leojsTreeOpened", // At least one Leo file opened
        TREE_TITLED: "leojsTreeTitled", // Tree is a Leo file and not a new untitled document

        // 'states' flags for currently opened tree view
        LEO_CHANGED: "leojsChanged",
        LEO_CAN_UNDO: "leojsCanUndo",
        LEO_CAN_REDO: "leojsCanRedo",
        LEO_CAN_BACK: "leojsCanGoBack",
        LEO_CAN_NEXT: "leojsCanGoNext",
        LEO_CAN_DEMOTE: "leojsCanDemote",
        LEO_CAN_PROMOTE: "leojsCanPromote",
        LEO_CAN_DEHOIST: "leojsCanDehoist",
        LEO_CAN_HOIST: "leojsCanHoist", // isNotRoot equivalent, Computed by hand
        LEO_TOP_HOIST_CHAPTER: "leojsTopHoistChapter",

        // 'states' flags about current selection, for visibility and commands availability
        SELECTED_MARKED: "leojsMarked", // no need for unmarked here, use !leojsMarked
        SELECTED_CLONE: "leojsCloned",
        SELECTED_DIRTY: "leojsDirty",
        SELECTED_EMPTY: "leojsEmpty",
        SELECTED_CHILD: "leojsChild", // Has children
        SELECTED_ATFILE: "LeojsAtFile", // Can be refreshed

        // Statusbar Flag 'keybindings in effect'
        LEO_SELECTED: "leojsObjectSelected", // keybindings "On": Outline or body has focus

        // Context Flags for 'when' clauses, used concatenated, for each outline node
        NODE_MARKED: "leojsNodeMarked",  // Selected node is marked
        NODE_UNMARKED: "leojsNodeUnmarked", // Selected node is unmarked (Needed for regexp)
        NODE_ATFILE: "leojsNodeAtFile", // Selected node is an @file or @clean, etc...
        NODE_CLONED: "leojsNodeCloned",
        NODE_ROOT: "leojsNodeRoot",
        NODE_NOT_ROOT: "leojsNodeNotRoot",
        NODE_TAGS: "leojsNodeTags",

        // Flags for undo nodes 
        UNDO_BEAD: "leojsUndoNode",
        NOT_UNDO_BEAD: "leojsNoUndoNode",

        // Flags for Leo documents tree view icons and hover node command buttons
        DOCUMENT_SELECTED_TITLED: "leojsDocumentSelectedTitled",
        DOCUMENT_TITLED: "leojsDocumentTitled",
        DOCUMENT_SELECTED_UNTITLED: "leojsDocumentSelectedUntitled",
        DOCUMENT_UNTITLED: "leojsDocumentUntitled",

        // Flags for focus context
        FOCUS_FIND: "leojsFindFocus",

        // Flag for interactive Search
        // INTERACTIVE_SEARCH: "leojsInteractiveSearch", // TODO : UNUSED FOR NOW : NO WAY TO DETECT TAB IN INPUTBOX !

        // Context flags that are mapped 'directly' onto leojs config settings
        // * PREFIXED WITH 'leojs' *
        LEO_TREE_BROWSE: Constants.NAME + Constants.CONFIG_NAMES.LEO_TREE_BROWSE[0].toUpperCase() + Constants.CONFIG_NAMES.LEO_TREE_BROWSE.slice(1), // Force ar'jan's suggestion of Leo's tree behavior override
        TREE_IN_EXPLORER: Constants.NAME + Constants.CONFIG_NAMES.TREE_IN_EXPLORER[0].toUpperCase() + Constants.CONFIG_NAMES.TREE_IN_EXPLORER.slice(1), // Leo outline also in the explorer view
        SHOW_OPEN_ASIDE: Constants.NAME + Constants.CONFIG_NAMES.SHOW_OPEN_ASIDE[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_OPEN_ASIDE.slice(1),   // Show 'open aside' in context menu
        SHOW_EDIT: Constants.NAME + Constants.CONFIG_NAMES.SHOW_EDIT[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EDIT.slice(1),              // Hover Icons on outline nodes
        // SHOW_ARROWS: Constants.NAME + Constants.CONFIG_NAMES.SHOW_ARROWS[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_ARROWS.slice(1),           // Hover Icons on outline nodes
        SHOW_ADD: Constants.NAME + Constants.CONFIG_NAMES.SHOW_ADD[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_ADD.slice(1),                 // Hover Icons on outline nodes
        SHOW_MARK: Constants.NAME + Constants.CONFIG_NAMES.SHOW_MARK[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_MARK.slice(1),               // Hover Icons on outline nodes
        SHOW_CLONE: Constants.NAME + Constants.CONFIG_NAMES.SHOW_CLONE[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_CLONE.slice(1),             // Hover Icons on outline nodes
        SHOW_COPY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_COPY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_COPY.slice(1),               // Hover Icons on outline nodes

        // SHOW_EDITION_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_EDITION_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EDITION_BODY.slice(1),
        // SHOW_CLIPBOARD_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_CLIPBOARD_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_CLIPBOARD_BODY.slice(1),
        // SHOW_PROMOTE_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_PROMOTE_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_PROMOTE_BODY.slice(1),
        // SHOW_EXECUTE_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_EXECUTE_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EXECUTE_BODY.slice(1),
        // SHOW_EXTRACT_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_EXTRACT_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EXTRACT_BODY.slice(1),
        // SHOW_IMPORT_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_IMPORT_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_IMPORT_BODY.slice(1),
        // SHOW_REFRESH_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_REFRESH_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_REFRESH_BODY.slice(1),
        // SHOW_HOIST_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_HOIST_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_HOIST_BODY.slice(1),
        // SHOW_MARK_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_MARK_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_MARK_BODY.slice(1),
        // SHOW_SORT_BODY: Constants.NAME + Constants.CONFIG_NAMES.SHOW_SORT_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_SORT_BODY.slice(1)
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
     * * Table for converting Leo languages names for the currently opened body pane
     * Used in showBody method of leoUI.ts
     */
    public static LANGUAGE_CODES: { [key: string]: string | undefined } = {
        cplusplus: 'cpp',
        md: 'markdown',
        rest: 'restructuredtext',
        rst: 'restructuredtext'
    };

    /**
     * All commands this expansion exposes to the user via GUI/keybindings in package.json
     */
    public static COMMANDS = {
        // Access to the Settings/Welcome Webview
        SHOW_WELCOME: Constants.NAME + ".showWelcomePage", // Always available: not in the commandPalette section of package.json
        SHOW_SETTINGS: Constants.NAME + ".showSettingsPage", // Always available: not in the commandPalette section of package.json
        // STATUS_BAR: Constants.NAME + ".statusBar", // Status Bar Click Command
        // Leo Documents
        SET_OPENED_FILE: Constants.NAME + ".setOpenedFile",
        OPEN_FILE: Constants.NAME + ".openLeoFile", // sets focus on BODY
        REVERT: Constants.NAME + ".revert",
        CLEAR_RECENT_FILES: Constants.NAME + ".clearRecentFiles",
        // Import Export Commands
        IMPORT_ANY_FILE: Constants.NAME + ".importAnyFile",
        READ_FILE_INTO_NODE: Constants.NAME + ".readFileIntoNode",
        EXPORT_HEADLINES: Constants.NAME + ".exportHeadlines",
        FLATTEN_OUTLINE: Constants.NAME + ".flattenOutline",
        OUTLINE_TO_CWEB: Constants.NAME + ".outlineToCweb",
        OUTLINE_TO_NOWEB: Constants.NAME + ".outlineToNoweb",
        REMOVE_SENTINELS: Constants.NAME + ".removeSentinels",
        WEAVE: Constants.NAME + ".weave",
        WRITE_FILE_FROM_NODE: Constants.NAME + ".writeFileFromNode",
        // Leo Document Files
        RECENT_FILES: Constants.NAME + ".recentLeoFiles", // shows recent Leo files, opens one on selection
        SWITCH_FILE: Constants.NAME + ".switchLeoFile",
        NEW_FILE: Constants.NAME + ".newLeoFile",
        SAVE_FILE: Constants.NAME + ".saveLeoFile",
        SAVE_FILE_FO: Constants.NAME + ".saveLeoFileFromOutline",
        SAVE_AS_FILE: Constants.NAME + ".saveAsLeoFile",
        SAVE_AS_LEOJS: Constants.NAME + ".saveAsLeoJsFile",
        CLOSE_FILE: Constants.NAME + ".closeLeoFile",
        MINIBUFFER: Constants.NAME + ".minibuffer",
        SET_LEO_ID: Constants.NAME + ".setLeoID",
        GIT_DIFF: Constants.NAME + ".gitDiff",
        WRITE_AT_FILE_NODES: Constants.NAME + ".writeAtFileNodes",
        WRITE_AT_FILE_NODES_FO: Constants.NAME + ".writeAtFileNodesFromOutline",
        WRITE_DIRTY_AT_FILE_NODES: Constants.NAME + ".writeDirtyAtFileNodes",
        WRITE_DIRTY_AT_FILE_NODES_FO: Constants.NAME + ".writeDirtyAtFileNodesFromOutline",
        // At-buttons
        CLICK_BUTTON: Constants.NAME + ".clickButton",
        REMOVE_BUTTON: Constants.NAME + ".removeButton",
        GOTO_SCRIPT: Constants.NAME + ".gotoScript",
        // Outline Node User Interaction
        SELECT_NODE: Constants.NAME + ".selectTreeNode",
        OPEN_ASIDE: Constants.NAME + ".openAside", // selects and opens body splitting the workspace
        // Goto operations that always finish with focus in outline
        PAGE_UP: Constants.NAME + ".pageUp",
        PAGE_DOWN: Constants.NAME + ".pageDown",
        GOTO_FIRST_VISIBLE: Constants.NAME + ".gotoFirstVisible",
        GOTO_LAST_VISIBLE: Constants.NAME + ".gotoLastVisible",
        GOTO_FIRST_SIBLING: Constants.NAME + ".gotoFirstSibling",
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
        REVERT_TO_UNDO: Constants.NAME + ".revertToUndo",
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
        PREV_NODE: Constants.NAME + ".prev",
        PREV_NODE_FO: Constants.NAME + ".prevFromOutline",
        NEXT_NODE: Constants.NAME + ".next",
        NEXT_NODE_FO: Constants.NAME + ".nextFromOutline",
        // Commands from tree panel buttons or context: focus on OUTLINE
        SET_UA: Constants.NAME + ".setUa",
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
        INSERT_CHILD: Constants.NAME + ".insertChildNode",
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
        INSERT_CHILD_SELECTION: Constants.NAME + ".insertChildNodeSelection", // Can be interrupted
        INSERT_CHILD_SELECTION_INTERRUPT: Constants.NAME + ".insertChildNodeSelectionInterrupt", // Can be interrupted
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
        INSERT_CHILD_SELECTION_FO: Constants.NAME + ".insertChildNodeSelectionFromOutline",
        CLONE_SELECTION_FO: Constants.NAME + ".cloneNodeSelectionFromOutline",
        PROMOTE_SELECTION_FO: Constants.NAME + ".promoteSelectionFromOutline",
        DEMOTE_SELECTION_FO: Constants.NAME + ".demoteSelectionFromOutline",
        REFRESH_FROM_DISK_SELECTION_FO: Constants.NAME + ".refreshFromDiskSelectionFromOutline",
        HOIST: Constants.NAME + ".hoistNode",
        HOIST_SELECTION: Constants.NAME + ".hoistSelection",
        HOIST_SELECTION_FO: Constants.NAME + ".hoistSelectionFromOutline",
        DEHOIST: Constants.NAME + ".deHoist",
        DEHOIST_FO: Constants.NAME + ".deHoistFromOutline",
        CHAPTER_NEXT: Constants.NAME + ".chapterNext",
        CHAPTER_BACK: Constants.NAME + ".chapterBack",
        CHAPTER_MAIN: Constants.NAME + ".chapterMain",
        CHAPTER_SELECT: Constants.NAME + ".chapterSelect",
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

        FIND_QUICK: Constants.NAME + ".findQuick",
        FIND_QUICK_SELECTED: Constants.NAME + ".findQuickSelected",
        FIND_QUICK_TIMELINE: Constants.NAME + ".findQuickTimeline",
        FIND_QUICK_CHANGED: Constants.NAME + ".findQuickChanged",
        FIND_QUICK_HISTORY: Constants.NAME + ".history",
        FIND_QUICK_MARKED: Constants.NAME + ".markedList",
        FIND_QUICK_GO_ANYWHERE: Constants.NAME + ".goAnywhere",
        GOTO_NAV_ENTRY: Constants.NAME + ".gotoNav",

        GOTO_NAV_PREV: Constants.NAME + ".gotoNavPrev",
        GOTO_NAV_NEXT: Constants.NAME + ".gotoNavNext",
        GOTO_NAV_FIRST: Constants.NAME + ".gotoNavFirst",
        GOTO_NAV_LAST: Constants.NAME + ".gotoNavLast",

        // INTERACTIVE_SEARCH_TAB: Constants.NAME + ".interactiveSearchTab", // TODO : UNUSED FOR NOW : NO WAY TO DETECT TAB IN INPUTBOX !

        START_SEARCH: Constants.NAME + ".startSearch",
        SEARCH_BACKWARD: Constants.NAME + ".searchBackward",
        RE_SEARCH: Constants.NAME + ".reSearch",
        RE_SEARCH_BACKWARD: Constants.NAME + ".reSearchBackward",
        WORD_SEARCH: Constants.NAME + ".wordSearch",
        WORD_SEARCH_BACKWARD: Constants.NAME + ".wordSearchBackward",
        FIND_ALL: Constants.NAME + ".findAll",
        FIND_NEXT: Constants.NAME + ".findNext",
        FIND_NEXT_FO: Constants.NAME + ".findNextFromOutline",
        FIND_PREVIOUS: Constants.NAME + ".findPrevious",
        FIND_PREVIOUS_FO: Constants.NAME + ".findPreviousFromOutline",
        FIND_VAR: Constants.NAME + ".findVar",
        FIND_DEF: Constants.NAME + ".findDef",
        REPLACE: Constants.NAME + ".replace",
        REPLACE_FO: Constants.NAME + ".replaceFromOutline",
        REPLACE_THEN_FIND: Constants.NAME + ".replaceThenFind",
        REPLACE_THEN_FIND_FO: Constants.NAME + ".replaceThenFindFromOutline",
        REPLACE_ALL: Constants.NAME + ".replaceAll",

        CLONE_FIND_ALL: Constants.NAME + ".cloneFindAll",
        CLONE_FIND_ALL_FLATTENED: Constants.NAME + ".cloneFindAllFlattened",
        CLONE_FIND_TAG: Constants.NAME + ".cloneFindTag",
        CLONE_FIND_MARKED: Constants.NAME + ".cloneFindMarked",
        CLONE_FIND_FLATTENED_MARKED: Constants.NAME + ".cloneFindFlattenedMarked",

        CLONE_FIND_PARENTS: Constants.NAME + ".cloneFindParents",
        GOTO_GLOBAL_LINE: Constants.NAME + ".gotoGlobalLine",
        TAG_CHILDREN: Constants.NAME + ".tagChildren",
        TAG_NODE: Constants.NAME + ".tagNode",
        REMOVE_TAG: Constants.NAME + ".removeTag",
        REMOVE_TAGS: Constants.NAME + ".removeTags",
        SET_FIND_EVERYWHERE_OPTION: Constants.NAME + ".setFindEverywhereOption",
        SET_FIND_NODE_ONLY_OPTION: Constants.NAME + ".setFindNodeOnlyOption",
        SET_FIND_FILE_ONLY_OPTION: Constants.NAME + ".setFindFileOnlyOption",
        SET_FIND_SUBOUTLINE_ONLY_OPTION: Constants.NAME + ".setFindSuboutlineOnlyOption",
        TOGGLE_FIND_IGNORE_CASE_OPTION: Constants.NAME + ".toggleFindIgnoreCaseOption",
        TOGGLE_FIND_MARK_CHANGES_OPTION: Constants.NAME + ".toggleFindMarkChangesOption",
        TOGGLE_FIND_MARK_FINDS_OPTION: Constants.NAME + ".toggleFindMarkFindsOption",
        TOGGLE_FIND_REGEXP_OPTION: Constants.NAME + ".toggleFindRegexpOption",
        TOGGLE_FIND_WORD_OPTION: Constants.NAME + ".toggleFindWordOption",
        TOGGLE_FIND_SEARCH_BODY_OPTION: Constants.NAME + ".toggleFindSearchBodyOption",
        TOGGLE_FIND_SEARCH_HEADLINE_OPTION: Constants.NAME + ".toggleFindSearchHeadlineOption",
        SET_ENABLE_PREVIEW: Constants.NAME + ".setEnablePreview",
        CLEAR_CLOSE_EMPTY_GROUPS: Constants.NAME + ".clearCloseEmptyGroups",
    };

    /**
     * Leo command names that are called from vscode's gui/menu/buttons/keybindings triggers
     */
    public static LEO_COMMANDS = {

        // * File Commands
        // NEW: 'new', // newLeoFile used instead
        // OPEN_OUTLINE: 'open_outline', // openLeoFile used instead
        WRITE_AT_FILE_NODES: 'write-at-file-nodes',
        WRITE_DIRTY_AT_FILE_NODES: 'write-dirty-at-file-nodes',
        REVERT: 'revert',
        // * More Commands
        // GOTO_GLOBAL_LINE: "!goto_global_line",
        SET_UA: 'set-ua',

        // * Search operations
        START_SEARCH: "start-search",
        FIND_ALL: "find-all",
        // FIND_NEXT: "!find_next",
        // FIND_PREVIOUS: "!find_previous",
        FIND_VAR: "find-var",
        FIND_DEF: "find-def",
        // REPLACE: "!replace",
        // REPLACE_THEN_FIND: "!replace_then_find",
        REPLACE_ALL: "change-all",

        SET_FIND_EVERYWHERE_OPTION: "set-find-everywhere",
        SET_FIND_NODE_ONLY_OPTION: "set-find-node-only",
        SET_FIND_FILE_ONLY_OPTION: "set-find-file-only",
        SET_FIND_SUBOUTLINE_ONLY_OPTION: "set-find-suboutline-only",
        TOGGLE_FIND_IGNORE_CASE_OPTION: "toggle-find-ignore-case-option",
        TOGGLE_FIND_MARK_CHANGES_OPTION: "toggle-find-mark-changes-option",
        TOGGLE_FIND_MARK_FINDS_OPTION: "toggle-find-mark-finds-option",
        TOGGLE_FIND_REGEXP_OPTION: "toggle-find-regex-option",
        TOGGLE_FIND_WORD_OPTION: "toggle-find-word-option",
        TOGGLE_FIND_SEARCH_BODY_OPTION: "toggle-find-in-body-option",
        TOGGLE_FIND_SEARCH_HEADLINE_OPTION: "toggle-find-in-headline-option",

        SEARCH_BACKWARD: "search-backward",
        RE_SEARCH: "re-search",
        RE_SEARCH_BACKWARD: "re-search-backward",
        WORD_SEARCH: "word-search",
        WORD_SEARCH_BACKWARD: "word-search-backward",

        TAG_NODE: "tag-node",
        TAG_CHILDREN: "tag-children",
        REMOVE_TAG: "remove-tag",
        REMOVE_ALL_TAGS: "remove-all-tags",

        // * Undo Operations
        UNDO: "undo",
        REDO: "redo",
        // * Tree Building
        EXECUTE_SCRIPT: "execute-script",
        REFRESH_FROM_DISK: "refresh-from-disk",
        GIT_DIFF: "TODO_GIT_DIFF", // TODO in editFileCommands.ts !
        // * Outline from body text
        EXTRACT: "extract",
        EXTRACT_NAMES: "extract-names",
        // * Hoist Operations
        HOIST_PNODE: "hoist",
        DEHOIST: "de-hoist",
        CHAPTER_NEXT: "chapter-next",
        CHAPTER_BACK: "chapter-back",
        CHAPTER_SELECT: "chapter-select",
        CHAPTER_MAIN: "chapter-select-main",
        // * History Navigation
        GOTO_PREV_HISTORY: "goto-prev-history-node",
        GOTO_NEXT_HISTORY: "goto-next-history-node",
        // * Goto & Folding
        PAGE_UP: "tree-page-up",
        PAGE_DOWN: "tree-page-down",
        GOTO_FIRST_VISIBLE: "goto-first-visible-node",
        GOTO_LAST_VISIBLE: "goto-last-visible-node",
        GOTO_FIRST_SIBLING: "goto-first-sibling",
        GOTO_LAST_SIBLING: "goto-last-sibling",
        GOTO_NEXT_VISIBLE: "goto-next-visible",
        GOTO_PREV_VISIBLE: "goto-prev-visible",
        GOTO_NEXT_MARKED: "goto-next-marked",
        GOTO_NEXT_CLONE: "goto-next-clone",
        CONTRACT_OR_GO_LEFT: "contract-or-go-left",
        EXPAND_AND_GO_RIGHT: "expand-and-go-right",
        CONTRACT_ALL: "contract-all",
        // * Mark Operations
        TOGGLE_MARK: "toggle-mark",
        COPY_MARKED: "copy-marked-nodes",
        DIFF_MARKED_NODES: "diff-marked-nodes", // TODO from leoCompare.py
        MARK_CHANGED_ITEMS: "mark-changed-items",
        MARK_SUBHEADS: "mark-subheads",
        UNMARK_ALL: "unmark-all",
        CLONE_MARKED_NODES: "clone-marked-nodes",
        DELETE_MARKED_NODES: "delete-marked-nodes",
        MOVE_MARKED_NODES: "move-marked-nodes",
        // * Clipboard Operations
        COPY_PNODE: "copy-node",
        CUT_PNODE: "cut-node",
        PASTE_PNODE: "async-paste-node",
        PASTE_CLONE_PNODE: "async-paste-retaining-clones",
        // * Outline Editing
        DELETE_PNODE: "delete-node",
        MOVE_PNODE_DOWN: "move-outline-down",
        MOVE_PNODE_LEFT: "move-outline-left",
        MOVE_PNODE_RIGHT: "move-outline-right",
        MOVE_PNODE_UP: "move-outline-up",
        INSERT_PNODE: "insert-node",
        INSERT_CHILD_PNODE: "insert-child",
        CLONE_PNODE: "clone-node",
        // * Marshalling Operations
        PROMOTE_PNODE: "promote",
        DEMOTE_PNODE: "demote",
        SORT_CHILDREN: "sort-children",
        SORT_SIBLINGS: "sort-siblings",
        // * Clone-find functionality

        CLONE_FIND_ALL_FLATTENED: "cff",

        CLONE_FIND_FLATTENED_MARKED: "cffm",
        CLONE_FIND_TAG: "cft",
        CLONE_FIND_ALL: "cfa", // cloneFind used instead
        CLONE_FIND_MARKED: "cfam",
        CLONE_FIND_PARENTS: "clone-find-parents",
    };

    /**
     * List of command names for both categories of possible offsets when keeping selection.
     */
    public static OLD_POS_OFFSETS = {
        DELETE: ["cut-node", "delete-node"],
        ADD: ["clone-node", "async-paste-node", "async-paste-retaining-clones"]
    };

    /**
     * * Overridden 'good' minibuffer command name strings
     */
    public static MINIBUFFER_OVERRIDDEN_NAMES: { [key: string]: string } = {
        'paste-node': 'async-paste-node',
        'paste-retaining-clones': 'async-paste-retaining-clones',
        'paste-as-template': 'async-paste-as-template',
        // TODO : insertNode, insertChild, ...
        // TODO : select chapter

    };

}
