import * as vscode from "vscode";
import { ConfigMembers, ConfigSetting } from "./types";
import { Constants } from "./constants";
import { LeoUI } from "./leoUI";
import * as g from './core/leoGlobals';

/**
 * * Configuration Settings Service
 */
export class Config implements ConfigMembers {

    // Config settings used on Leo's side
    public checkForChangeExternalFiles: string = Constants.CONFIG_DEFAULTS.CHECK_FOR_CHANGE_EXTERNAL_FILES;
    public defaultReloadIgnore: string = Constants.CONFIG_DEFAULTS.DEFAULT_RELOAD_IGNORE;

    // Config settings used on vscode's side
    public sessionPerWorkspace: boolean = Constants.CONFIG_DEFAULTS.SESSION_PER_WORKSPACE; // Used as Context Flag
    public leoTreeBrowse: boolean = Constants.CONFIG_DEFAULTS.LEO_TREE_BROWSE; // Used as Context Flag
    public treeKeepFocus: boolean = Constants.CONFIG_DEFAULTS.TREE_KEEP_FOCUS;
    public treeKeepFocusWhenAside: boolean = Constants.CONFIG_DEFAULTS.TREE_KEEP_FOCUS_WHEN_ASIDE;

    public collapseAllShortcut: boolean = Constants.CONFIG_DEFAULTS.COLLAPSE_ALL_SHORTCUT;
    public activityViewShortcut: boolean = Constants.CONFIG_DEFAULTS.ACTIVITY_VIEW_SHORTCUT;
    public goAnywhereShortcut: boolean = Constants.CONFIG_DEFAULTS.GO_ANYWHERE_SHORTCUT;

    public treeInExplorer: boolean = Constants.CONFIG_DEFAULTS.TREE_IN_EXPLORER; // Used as Context Flag
    public showEditOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_EDIT; // Used as Context Flag

    public showUnlOnStatusBar: boolean = Constants.CONFIG_DEFAULTS.SHOW_UNL_ON_STATUSBAR;

    public showFileOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_FILE_ON_OUTLINE;
    public showHoistDehoistOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_HOIST_DEHOIST_ON_OUTLINE;
    public showPrevNextOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_PREV_NEXT_ON_OUTLINE;
    public showPromoteDemoteOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_PROMOTE_DEMOTE_ON_OUTLINE;
    public showRecentFilesOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_RECENT_FILES_ON_OUTLINE;
    public showSettingsOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_SETTINGS_ON_OUTLINE;
    public showShowLogOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_SHOW_LOG_ON_OUTLINE;
    public showUndoRedoOnOutline: boolean = Constants.CONFIG_DEFAULTS.SHOW_UNDO_REDO_ON_OUTLINE;

    public showAddOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_ADD; // Used as Context Flag
    public showMarkOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_MARK; // Used as Context Flag
    public showCloneOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_CLONE; // Used as Context Flag
    public showCopyOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_COPY; // Used as Context Flag

    // public showEditionOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_EDITION_BODY; // Used as Context Flag
    // public showClipboardOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_CLIPBOARD_BODY; // Used as Context Flag
    // public showPromoteOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_PROMOTE_BODY; // Used as Context Flag
    // public showExecuteOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_EXECUTE_BODY; // Used as Context Flag
    // public showExtractOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_EXTRACT_BODY; // Used as Context Flag
    // public showImportOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_IMPORT_BODY; // Used as Context Flag
    // public showRefreshOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_REFRESH_BODY; // Used as Context Flag
    // public showHoistOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_HOIST_BODY; // Used as Context Flag
    // public showMarkOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_MARK_BODY; // Used as Context Flag
    // public showSortOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_SORT_BODY; // Used as Context Flag

    public invertNodeContrast: boolean = Constants.CONFIG_DEFAULTS.INVERT_NODES;
    public leoID: string = Constants.CONFIG_DEFAULTS.LEO_ID;

    public setLeoJsSettingsPromise: Promise<unknown> = Promise.resolve();

    private _isBusySettingConfig: boolean = false;

    private _confirmOffValue: string;

    constructor(
        private _context: vscode.ExtensionContext,
        private _leoUI: LeoUI
    ) {
        if (g.isBrowser) {
            this._confirmOffValue = 'keyboardOnly';
        } else {
            this._confirmOffValue = 'never';
        }
    }

    /**
     * * Get actual 'live' Leojs configuration
     * @returns An object with config settings members such as treeKeepFocus, defaultReloadIgnore, etc.
     */
    public getConfig(): ConfigMembers {
        return {
            checkForChangeExternalFiles: this.checkForChangeExternalFiles,
            defaultReloadIgnore: this.defaultReloadIgnore,
            sessionPerWorkspace: this.sessionPerWorkspace, // Used as Context Flag
            leoTreeBrowse: this.leoTreeBrowse, // Used as Context Flag
            treeKeepFocus: this.treeKeepFocus,
            treeKeepFocusWhenAside: this.treeKeepFocusWhenAside,

            collapseAllShortcut: this.collapseAllShortcut,
            activityViewShortcut: this.activityViewShortcut,
            goAnywhereShortcut: this.goAnywhereShortcut,

            showUnlOnStatusBar: this.showUnlOnStatusBar, // Used as Context Flag

            showFileOnOutline: this.showFileOnOutline,
            showHoistDehoistOnOutline: this.showHoistDehoistOnOutline,
            showPrevNextOnOutline: this.showPrevNextOnOutline,
            showPromoteDemoteOnOutline: this.showPromoteDemoteOnOutline,
            showRecentFilesOnOutline: this.showRecentFilesOnOutline,
            showSettingsOnOutline: this.showSettingsOnOutline,
            showShowLogOnOutline: this.showShowLogOnOutline,
            showUndoRedoOnOutline: this.showUndoRedoOnOutline,

            treeInExplorer: this.treeInExplorer, // Used as Context Flag
            showEditOnNodes: this.showEditOnNodes, // Used as Context Flag
            showAddOnNodes: this.showAddOnNodes, // Used as Context Flag
            showMarkOnNodes: this.showMarkOnNodes, // Used as Context Flag
            showCloneOnNodes: this.showCloneOnNodes, // Used as Context Flag
            showCopyOnNodes: this.showCopyOnNodes, // Used as Context Flag

            // showEditionOnBody: this.showEditionOnBody, // Used as Context Flag
            // showClipboardOnBody: this.showClipboardOnBody, // Used as Context Flag
            // showPromoteOnBody: this.showPromoteOnBody, // Used as Context Flag
            // showExecuteOnBody: this.showExecuteOnBody, // Used as Context Flag
            // showExtractOnBody: this.showExtractOnBody, // Used as Context Flag
            // showImportOnBody: this.showImportOnBody, // Used as Context Flag
            // showRefreshOnBody: this.showRefreshOnBody, // Used as Context Flag
            // showHoistOnBody: this.showHoistOnBody, // Used as Context Flag
            // showMarkOnBody: this.showMarkOnBody, // Used as Context Flag
            // showSortOnBody: this.showSortOnBody, // Used as Context Flag

            invertNodeContrast: this.invertNodeContrast,
            leoID: this.leoID
        };
    }

    /**
     * * Apply changes to the expansion config settings and save them in user settings.
     * @param p_changes is an array of codes and values to be changed
     * @returns a promise that resolves upon completion
     */
    public setLeojsSettings(p_changes: ConfigSetting[]): Promise<unknown> {
        this._isBusySettingConfig = true;
        const w_promises: Thenable<void>[] = [];
        const w_vscodeConfig = vscode.workspace.getConfiguration(Constants.CONFIG_NAME);
        p_changes.forEach(i_change => {
            // tslint:disable-next-line: strict-comparisons
            if (w_vscodeConfig.inspect(i_change.code)!.defaultValue === i_change.value) {
                // Set as undefined - same as default
                w_promises.push(w_vscodeConfig.update(i_change.code, undefined, true));
            } else {
                // Set as value which is not default
                w_promises.push(w_vscodeConfig.update(i_change.code, i_change.value, true));
            }
        });

        this.setLeoJsSettingsPromise = Promise.all(w_promises);
        return this.setLeoJsSettingsPromise.then(() => {
            this._isBusySettingConfig = false;
            this.buildFromSavedSettings();
            return Promise.resolve();
        });

    }

    /**
     * * Set the workbench.editor.enablePreview vscode setting
     */
    public setEnablePreview(): Thenable<void> {
        return vscode.workspace.getConfiguration("workbench.editor")
            .update("enablePreview", true, true);
    }

    /**
     * * Clears the workbench.editor.closeEmptyGroups vscode setting
     */
    public clearCloseEmptyGroups(): Thenable<void> {
        return vscode.workspace.getConfiguration("workbench.editor")
            .update("closeEmptyGroups", false, true);
    }

    /**
     * * Sets all 'bodywrap' vscode settings
     */
    public setBodyWrap(): Thenable<void> {
        let w_totalConfigName = "";
        for (const w_lang of Constants.LANGUAGES) {
            let langWrap = '[' + Constants.LEO_LANGUAGE_PREFIX + w_lang + Constants.LEO_WRAP_SUFFIX + ']';
            w_totalConfigName += langWrap;
        }
        return vscode.workspace.getConfiguration().update(w_totalConfigName, { 'editor.wordWrap': 'on' }, vscode.ConfigurationTarget.Global);
    }

    /**
     * Remove body wrap setting from older LeoJS versions
     * that suported less languages
     */
    public removeOldBodyWrap(): void {
        // Last version did not have XML
        let w_totalOldVersionConfigName = "";

        // Looping from the first element up to the second-to-last element
        for (let i = 0; i < Constants.LANGUAGES.length - 1; i++) {
            const w_lang = Constants.LANGUAGES[i];
            const langWrap = '[' + Constants.LEO_LANGUAGE_PREFIX + w_lang + Constants.LEO_WRAP_SUFFIX + ']';
            w_totalOldVersionConfigName += langWrap;
        }

        if (vscode.workspace.getConfiguration().has(w_totalOldVersionConfigName)) {
            void vscode.workspace.getConfiguration().update(w_totalOldVersionConfigName, undefined, vscode.ConfigurationTarget.Global);
        }

    }

    /**
     * * Check if the workbench.editor.enablePreview flag is set
     * @param p_forced Forces the setting instead of just suggesting with a message
     */
    public checkEnablePreview(p_forced?: boolean): void {
        let w_result: any = true;
        const w_setting = vscode.workspace.getConfiguration("workbench.editor");
        if (w_setting.inspect("enablePreview")!.globalValue === undefined) {
            w_result = w_setting.inspect("enablePreview")!.defaultValue;
        } else {
            w_result = w_setting.inspect("enablePreview")!.globalValue;
        }
        if (w_result === false) {
            if (p_forced) {
                void this.setEnablePreview();
                void vscode.window.showInformationMessage(Constants.USER_MESSAGES.ENABLE_PREVIEW_SET);
            } else {
                void vscode.window.showWarningMessage(
                    Constants.USER_MESSAGES.ENABLE_PREVIEW_RECOMMEND,
                    Constants.USER_MESSAGES.FIX_IT
                ).then(p_chosenButton => {
                    if (p_chosenButton === Constants.USER_MESSAGES.FIX_IT) {
                        void vscode.commands.executeCommand(Constants.COMMANDS.SET_ENABLE_PREVIEW);
                        void vscode.window.showInformationMessage(Constants.USER_MESSAGES.ENABLE_PREVIEW_SET);
                    }
                });
            }
        }
    }

    /**
     * * Check if the 'workbench.editor.closeEmptyGroups' setting is false
     * @param p_forced Forces the setting instead of just suggesting with a message
     */
    public checkCloseEmptyGroups(p_forced?: boolean): void {
        let w_result: any = false;
        const w_setting = vscode.workspace.getConfiguration("workbench.editor");
        if (w_setting.inspect("closeEmptyGroups")!.globalValue === undefined) {
            w_result = w_setting.inspect("closeEmptyGroups")!.defaultValue;
        } else {
            w_result = w_setting.inspect("closeEmptyGroups")!.globalValue;
        }
        if (w_result === true) {
            if (p_forced) {
                void this.clearCloseEmptyGroups();
                void vscode.window.showInformationMessage(Constants.USER_MESSAGES.CLOSE_EMPTY_CLEARED);
            } else {
                void vscode.window.showWarningMessage(
                    Constants.USER_MESSAGES.CLOSE_EMPTY_RECOMMEND,
                    Constants.USER_MESSAGES.FIX_IT
                ).then(p_chosenButton => {
                    if (p_chosenButton === Constants.USER_MESSAGES.FIX_IT) {
                        void vscode.commands.executeCommand(Constants.COMMANDS.CLEAR_CLOSE_EMPTY_GROUPS);
                        void vscode.window.showInformationMessage(Constants.USER_MESSAGES.CLOSE_EMPTY_CLEARED);
                    }
                });
            }
        }
    }

    public checkBodyWrap(p_forced?: boolean): void {
        let w_missing = false;

        let w_languageSettings: Record<string, string> | undefined;
        let w_totalConfigName = "";

        for (const w_lang of Constants.LANGUAGES) {
            let langWrap = '[' + Constants.LEO_LANGUAGE_PREFIX + w_lang + Constants.LEO_WRAP_SUFFIX + ']';
            w_totalConfigName += langWrap;
        }

        w_languageSettings = vscode.workspace.getConfiguration(w_totalConfigName, null);

        if (!w_languageSettings || !w_languageSettings['editor.wordWrap'] || w_languageSettings['editor.wordWrap'] !== 'on') {
            w_missing = true;
        }

        if (w_missing && p_forced) {
            void this.setBodyWrap();
            // ! NOT warning the user for this forced setting at startup because its internal to LeoJS only !
        } else if (w_missing && !p_forced) {
            void vscode.window.showWarningMessage(
                Constants.USER_MESSAGES.BODY_WRAP_RECOMMEND,
                Constants.USER_MESSAGES.FIX_IT
            ).then(p_chosenButton => {
                if (p_chosenButton === Constants.USER_MESSAGES.FIX_IT) {
                    void vscode.commands.executeCommand(Constants.COMMANDS.SET_BODY_WRAP_SETTINGS);
                    void vscode.window.showInformationMessage(Constants.USER_MESSAGES.BODY_WRAP_SET);
                }
            });
        }
    }

    public setConfirmBeforeClose(p_state: boolean): Thenable<void> {
        return vscode.workspace.getConfiguration("window")
            .update("confirmBeforeClose", p_state ? "always" : this._confirmOffValue, true);
    }

    /**
     * * Build config from settings from vscode's saved config settings
     */
    public buildFromSavedSettings(): void {
        // Shorthand pointers for readability
        const GET = vscode.workspace.getConfiguration;
        const NAME = Constants.CONFIG_NAME;
        const NAMES = Constants.CONFIG_NAMES;
        const DEFAULTS = Constants.CONFIG_DEFAULTS;

        if (this._isBusySettingConfig) {
            // * Currently setting config, wait until its done all, and this will be called automatically
            return;
        } else {
            this.checkForChangeExternalFiles = GET(NAME).get(NAMES.CHECK_FOR_CHANGE_EXTERNAL_FILES, DEFAULTS.CHECK_FOR_CHANGE_EXTERNAL_FILES);
            this.defaultReloadIgnore = GET(NAME).get(NAMES.DEFAULT_RELOAD_IGNORE, DEFAULTS.DEFAULT_RELOAD_IGNORE);
            this.sessionPerWorkspace = GET(NAME).get(NAMES.SESSION_PER_WORKSPACE, DEFAULTS.SESSION_PER_WORKSPACE);
            this.leoTreeBrowse = GET(NAME).get(NAMES.LEO_TREE_BROWSE, DEFAULTS.LEO_TREE_BROWSE);
            this.treeKeepFocus = GET(NAME).get(NAMES.TREE_KEEP_FOCUS, DEFAULTS.TREE_KEEP_FOCUS);
            this.treeKeepFocusWhenAside = GET(NAME).get(NAMES.TREE_KEEP_FOCUS_WHEN_ASIDE, DEFAULTS.TREE_KEEP_FOCUS_WHEN_ASIDE);

            this.collapseAllShortcut = GET(NAME).get(NAMES.COLLAPSE_ALL_SHORTCUT, DEFAULTS.COLLAPSE_ALL_SHORTCUT);
            this.activityViewShortcut = GET(NAME).get(NAMES.ACTIVITY_VIEW_SHORTCUT, DEFAULTS.ACTIVITY_VIEW_SHORTCUT);
            this.goAnywhereShortcut = GET(NAME).get(NAMES.GO_ANYWHERE_SHORTCUT, DEFAULTS.GO_ANYWHERE_SHORTCUT);

            this.treeInExplorer = GET(NAME).get(NAMES.TREE_IN_EXPLORER, DEFAULTS.TREE_IN_EXPLORER);

            this.showUnlOnStatusBar = GET(NAME).get(NAMES.SHOW_UNL_ON_STATUSBAR, DEFAULTS.SHOW_UNL_ON_STATUSBAR);

            this.showFileOnOutline = GET(NAME).get(NAMES.SHOW_FILE_ON_OUTLINE, DEFAULTS.SHOW_FILE_ON_OUTLINE);
            this.showHoistDehoistOnOutline = GET(NAME).get(NAMES.SHOW_HOIST_DEHOIST_ON_OUTLINE, DEFAULTS.SHOW_HOIST_DEHOIST_ON_OUTLINE);
            this.showPrevNextOnOutline = GET(NAME).get(NAMES.SHOW_PREV_NEXT_ON_OUTLINE, DEFAULTS.SHOW_PREV_NEXT_ON_OUTLINE);
            this.showPromoteDemoteOnOutline = GET(NAME).get(NAMES.SHOW_PROMOTE_DEMOTE_ON_OUTLINE, DEFAULTS.SHOW_PROMOTE_DEMOTE_ON_OUTLINE);
            this.showRecentFilesOnOutline = GET(NAME).get(NAMES.SHOW_RECENT_FILES_ON_OUTLINE, DEFAULTS.SHOW_RECENT_FILES_ON_OUTLINE);
            this.showSettingsOnOutline = GET(NAME).get(NAMES.SHOW_SETTINGS_ON_OUTLINE, DEFAULTS.SHOW_SETTINGS_ON_OUTLINE);
            this.showShowLogOnOutline = GET(NAME).get(NAMES.SHOW_SHOW_LOG_ON_OUTLINE, DEFAULTS.SHOW_SHOW_LOG_ON_OUTLINE);
            this.showUndoRedoOnOutline = GET(NAME).get(NAMES.SHOW_UNDO_REDO_ON_OUTLINE, DEFAULTS.SHOW_UNDO_REDO_ON_OUTLINE);

            this.showEditOnNodes = GET(NAME).get(NAMES.SHOW_EDIT, DEFAULTS.SHOW_EDIT);
            this.showAddOnNodes = GET(NAME).get(NAMES.SHOW_ADD, DEFAULTS.SHOW_ADD);
            this.showMarkOnNodes = GET(NAME).get(NAMES.SHOW_MARK, DEFAULTS.SHOW_MARK);
            this.showCloneOnNodes = GET(NAME).get(NAMES.SHOW_CLONE, DEFAULTS.SHOW_CLONE);
            this.showCopyOnNodes = GET(NAME).get(NAMES.SHOW_COPY, DEFAULTS.SHOW_COPY);

            // this.showEditionOnBody = GET(NAME).get(NAMES.SHOW_EDITION_BODY, DEFAULTS.SHOW_EDITION_BODY);
            // this.showClipboardOnBody = GET(NAME).get(NAMES.SHOW_CLIPBOARD_BODY, DEFAULTS.SHOW_CLIPBOARD_BODY);
            // this.showPromoteOnBody = GET(NAME).get(NAMES.SHOW_PROMOTE_BODY, DEFAULTS.SHOW_PROMOTE_BODY);
            // this.showExecuteOnBody = GET(NAME).get(NAMES.SHOW_EXECUTE_BODY, DEFAULTS.SHOW_EXECUTE_BODY);
            // this.showExtractOnBody = GET(NAME).get(NAMES.SHOW_EXTRACT_BODY, DEFAULTS.SHOW_EXTRACT_BODY);
            // this.showImportOnBody = GET(NAME).get(NAMES.SHOW_IMPORT_BODY, DEFAULTS.SHOW_IMPORT_BODY);
            // this.showRefreshOnBody = GET(NAME).get(NAMES.SHOW_REFRESH_BODY, DEFAULTS.SHOW_REFRESH_BODY);
            // this.showHoistOnBody = GET(NAME).get(NAMES.SHOW_HOIST_BODY, DEFAULTS.SHOW_HOIST_BODY);
            // this.showMarkOnBody = GET(NAME).get(NAMES.SHOW_MARK_BODY, DEFAULTS.SHOW_MARK_BODY);
            // this.showSortOnBody = GET(NAME).get(NAMES.SHOW_SORT_BODY, DEFAULTS.SHOW_SORT_BODY);

            this.invertNodeContrast = GET(NAME).get(NAMES.INVERT_NODES, DEFAULTS.INVERT_NODES);
            this.leoID = GET(NAME).get(NAMES.LEO_ID, DEFAULTS.LEO_ID);

        }
    }

}
