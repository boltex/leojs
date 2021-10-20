import * as vscode from "vscode";
import { Position } from "./core/leoNodes";
import { LeoOutlineNode } from "./leoOutlineNode";

/**
 * * Types of the various JSON configuration keys such as treeKeepFocus, defaultReloadIgnore, etc.
 */
export interface ConfigMembers {
    checkForChangeExternalFiles: string;
    defaultReloadIgnore: string;
    leoTreeBrowse: boolean;
    treeKeepFocus: boolean;
    treeKeepFocusWhenAside: boolean;
    statusBarString: string;
    statusBarColor: string;
    treeInExplorer: boolean;
    showOpenAside: boolean;
    showEditOnNodes: boolean;
    showArrowsOnNodes: boolean;
    showAddOnNodes: boolean;
    showMarkOnNodes: boolean;
    showCloneOnNodes: boolean;
    showCopyOnNodes: boolean;

    showEditionOnBody: boolean; // clone delete insert(s)
    showClipboardOnBody: boolean; // cut copy paste(s)
    showPromoteOnBody: boolean; // promote demote
    showExecuteOnBody: boolean; // extract(s)
    showExtractOnBody: boolean;
    showImportOnBody: boolean;
    showRefreshOnBody: boolean;
    showHoistOnBody: boolean;
    showMarkOnBody: boolean;
    showSortOnBody: boolean;

    invertNodeContrast: boolean;
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
 * * When refreshing the outline and getting to Leo's selected node
 */
export const enum RevealType {
    NoReveal = 0,   // In apToLeoNode conversion. True:
    // Re-use the old if the global revealType is "NoReveal" and it's the selected node.
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
    states?: boolean; // States needs refresh:
    // (changed, canUndo, canRedo, canDemote, canPromote, canDehoist)
    buttons?: boolean; // Buttons needs refresh
    documents?: boolean; // Documents needs refresh
}

/**
 * * Stackable front end commands
 */
export interface UserCommand {
    action: string;
    node?: LeoOutlineNode | undefined; // We can START a stack with a targeted command
    text?: string | undefined; // If a string is required, for headline, etc.
    refreshType: ReqRefresh; // Minimal refresh level required by this command
    fromOutline: boolean; // Focus back on outline instead of body
    keepSelection?: boolean; // Should bring back selection on node prior to command
    resolveFn?: (result: any) => void; // call that with an answer from python's (or other) side
    rejectFn?: (reason: any) => void; // call if problem is encountered
}

/**
 * * LeoBody virtual file time information object
 */
export interface BodyTimeInfo {
    ctime: number;
    mtime: number;
}

/**
 * * Object container for parameters of leoJs "apply-selected-node-to-body" method
 */
export interface ShowBodyParam {
    node: LeoOutlineNode,
    aside: boolean,
    showBodyKeepFocus: boolean,
    force_open?: boolean
}

/**
 * * Object sent back from leoInteg's 'getStates' command
 */
export interface LeoPackageStates {
    changed: boolean; // Leo document has changed (is dirty)
    canUndo: boolean; // Leo document can undo the last operation done
    canRedo: boolean; // Leo document can redo the last operation 'undone'
    canDemote: boolean; // Currently selected node can have its siblings demoted
    canPromote: boolean; // Currently selected node can have its children promoted
    canDehoist: boolean; // Leo Document is currently hoisted and can be de-hoisted
}

/**
 * * Leo document structure used in the 'Opened Leo Documents' tree view provider sent back by the server
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
    index: string; // STRING KEY
}

/**
 * * Icon path names used in leoNodes for rendering in treeview
 */
export interface Icon {
    light: string;
    dark: string;
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
 * * Used by the minibuffer command pallette
 * Acquired from the getCommands method in leobridgeserver.py
 */
export interface MinibufferCommand extends vscode.QuickPickItem {
    func: string;
}
