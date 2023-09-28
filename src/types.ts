import * as vscode from "vscode";
import { Position } from "./core/leoNodes";
import { LeoOutlineNode } from "./leoOutline";
import { RClick } from "./core/mod_scripting";
import { nullButtonWidget } from "./core/leoFrame";

/**
 * * Types of the various JSON configuration keys such as treeKeepFocus, defaultReloadIgnore, etc.
 */
export interface ConfigMembers {
    checkForChangeExternalFiles: string;
    defaultReloadIgnore: string;
    leoTreeBrowse: boolean;
    treeKeepFocus: boolean;
    treeKeepFocusWhenAside: boolean;

    collapseAllShortcut: boolean;
    activityViewShortcut: boolean;
    goAnywhereShortcut: boolean;

    // statusBarString: string;
    // statusBarColor: string;

    treeInExplorer: boolean;
    showOpenAside: boolean;
    showEditOnNodes: boolean;
    // showArrowsOnNodes: boolean;
    showAddOnNodes: boolean;
    showMarkOnNodes: boolean;
    showCloneOnNodes: boolean;
    showCopyOnNodes: boolean;

    // showEditionOnBody: boolean; // clone delete insert(s)
    // showClipboardOnBody: boolean; // cut copy paste(s)
    // showPromoteOnBody: boolean; // promote demote
    // showExecuteOnBody: boolean; // extract(s)
    // showExtractOnBody: boolean;
    // showImportOnBody: boolean;
    // showRefreshOnBody: boolean;
    // showHoistOnBody: boolean;
    // showMarkOnBody: boolean;
    // showSortOnBody: boolean;

    invertNodeContrast: boolean;
    leoID: string;
}

/**
 * * Structure for configuration settings changes used along with welcome/settings webview.
 */
export interface ConfigSetting {
    code: string;
    value: any;
}

/**
 * * Structure for the two vscode font settings
 */
export interface FontSettings {
    zoomLevel: number;
    fontSize: number;
}

/**
 * * Location of focus to be set when current/last command is resolved
 */
export const enum Focus {
    NoChange = 0, // Stays on goto pane, or other current panel.
    Body, // Forces body to appear, refresh leaves focus on body.
    Outline, // Forces outline to appear, refresh leaves focus on Outline.
    Goto
}

/**
 * * When refreshing the outline and getting to Leo's selected node
 */
export const enum RevealType {
    NoReveal = 0, // Re-use the old treeId with "NoReveal" for the selected node.
    Reveal,
    RevealSelect,
    RevealSelectFocus
}

/**
 * * Required Refresh Dictionary of "elements to refresh" flags
 */
export interface ReqRefresh {
    node?: boolean; // Reveal received selected node (Navigation only, no tree change)
    tree?: boolean; // Tree needs refresh
    body?: boolean; // Body needs refresh
    scroll?: boolean; // Body needs to set and reveal text selection

    states?: boolean; // Currently opened tree view states needs refresh:
    // changed, canUndo, canRedo, canGoBack, canGoNext, canDemote, canPromote, 
    // canHoist, canDehoist, inChapter, topHoistChapter

    buttons?: boolean; // Buttons needs refresh
    documents?: boolean; // Documents needs refresh
    goto?: boolean; // Goto pane needs refresh
}

export interface CommandOptions {
    node?: Position, // facultative, precise node onto which the command is run (also see p_keepSelection)
    refreshType: ReqRefresh, // Object containing flags for sections needing to refresh after command ran
    finalFocus: Focus, // final focus placement
    keepSelection?: boolean, // flag to bring back selection on the original node
    isNavigation?: boolean // Navigation commands force-show the body and outline
}

/**
 * * LeoBody virtual file time information object
 */
export interface BodyTimeInfo {
    ctime: number;
    mtime: number;
}

/**
 * * General state flags for UI representation and controls visibility.
 */
export interface LeoPackageStates {
    changed: boolean; // Leo document has changed (is dirty)
    canUndo: boolean; // Leo document can undo the last operation done
    canRedo: boolean; // Leo document can redo the last operation 'undone'
    canGoBack: boolean; // Has history
    canGoNext: boolean; // Has used goBack at least once
    canDemote: boolean; // Currently selected node can have its siblings demoted
    canPromote: boolean; // Currently selected node can have its children promoted
    canDehoist: boolean; // Leo Document is currently hoisted and can be de-hoisted
    canHoist: boolean; // Selected node is not the first top node already root
    topIsChapter: boolean; // Top of the hoisted outline is an @chapter node
}

/**
 * * Leo document structure used in the 'Opened Leo Documents' tree view provider
 */
export interface LeoDocument {
    name: string;
    index: number;
    changed: boolean;
    selected: boolean;
}

/**
 * * Leo '@button' structure used in the '@buttons' tree view provider
 */
export interface LeoButton {
    name: string;
    index: number;
    rclicks?: RClick[];
}

export type TGotoTypes = "tag" | "headline" | "body" | "parent" | "generic";

export interface LeoGoto {
    key: number; // id from python
    h: string;
    t: TGotoTypes;
}

export const enum LeoGotoNavKey {
    prev = 0,
    next,
    first,
    last
}

/**
 * * Enum type for the search scope radio buttons of the find panel.
 */
export const enum LeoSearchScope {
    entireOutline = 0,
    subOutlineOnly,
    nodeOnly,
    fileOnly
}

/**
 * * Search settings structure for use with the 'find' webview
 */
export interface LeoSearchSettings {
    // Nav options
    navText: string;
    isTag: boolean;
    showParents: boolean;
    searchOptions: number;
    // Find/change strings...
    findText: string;  // find_text
    replaceText: string; // change_text
    // Find options...
    wholeWord: boolean;
    ignoreCase: boolean;
    regExp: boolean;
    markFinds: boolean;
    markChanges: boolean;
    searchHeadline: boolean;
    searchBody: boolean;
    searchScope: LeoSearchScope; // 0, 1 or 2 for outline, sub-outline, or node.
}

/**
 * * Leo's GUI search settings internal structure
 */
export interface LeoGuiFindTabManagerSettings {
    // Nav options
    nav_text: string;
    is_tag: boolean;
    show_parents: boolean;
    search_options: number;
    //Find/change strings...
    find_text: string,
    change_text: string,
    // Find options...
    ignore_case: boolean,
    mark_changes: boolean,
    mark_finds: boolean,
    node_only: boolean,
    file_only: boolean,
    pattern_match: boolean,
    search_body: boolean,
    search_headline: boolean,
    suboutline_only: boolean,
    whole_word: boolean
}

/**
 * * Icon path names used in leoNodes for rendering in treeview
 */
export interface Icon {
    light: string | vscode.Uri;
    dark: string | vscode.Uri;
}

/**
 * * LeoBody virtual file time information object
 */
export interface BodyTimeInfo {
    ctime: number;
    mtime: number;
}

/**
 * * Body position
 * Used in BodySelectionInfo interface
 */
export interface BodyPosition {
    line: number;
    col: number;
}

/**
 * * LeoBody cursor active position and text selection state, along with gnx
 */
export interface BodySelectionInfo {
    gnx: string;
    // scroll is stored as-is as the 'scrollBarSpot' in Leo
    // ! TEST scroll as single number only (for Leo vertical scroll value)
    scroll: number;
    // scroll: {
    //     start: BodyPosition;
    //     end: BodyPosition;
    // }
    insert: BodyPosition;
    start: BodyPosition;
    end: BodyPosition;
}

/**
 * * Parameter structure used in the 'runSaveFileDialog' equivalent when asking user input
 */
export interface showSaveAsDialogParameters {
    "initialFile": string;
    "title": string;
    "message": string;
    "filetypes": string[];
    "defaultExtension": string;
}

/**
 * * Parameter structure used in the 'runAskYesNoDialog' equivalent when asking user input
 */
export interface runAskYesNoDialogParameters {
    "ask": string;
    "message": string;
    "yes_all": boolean;
    "no_all": boolean;
}

/**
 * * Parameter structure used in the 'runAskOkDialog' equivalent when showing a warning
 */
export interface runWarnMessageDialogParameters {
    "warn": string;
    "message": string;
}

/**
 * * Parameter structure for non-blocking info message about detected file changes
 */
export interface runInfoMessageDialogParameters {
    "message": string;
}

/**
 * * Used in showAskModalDialog to get answer from user interaction
 */
export interface AskMessageItem extends vscode.MessageItem {
    value: string;
}

/**
 * * Used in switch Leo document to get answer from user interaction
 */
export interface ChooseDocumentItem extends vscode.QuickPickItem {
    value: number;
}

/**
 * * Used to select a button's rclick by index
 */
export interface ChooseRClickItem extends vscode.QuickPickItem {
    index: number;
    rclick?: RClick;
}

/**
 * * Used by the minibuffer command pallette
 */
export interface MinibufferCommand extends vscode.QuickPickItem {
    func: string;
}
