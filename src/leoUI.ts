import * as vscode from "vscode";
import { Utils as uriUtils } from "vscode-uri";
import { debounce } from "lodash";
import * as path from 'path';

import * as utils from "./utils";
import * as commandBindings from "./commandBindings";
import { Constants } from "./constants";
import { RevealType, Icon, ReqRefresh, LeoPackageStates, ConfigSetting, LeoSearchSettings } from "./types";

import { Config } from "./config";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode, LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentsProvider } from "./leoDocuments";
import { LeoStates } from "./leoStates";
import { LeoBodyProvider } from "./leoBody";
import { LeoUndoNode, LeoUndosProvider } from "./leoUndos";

import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";
import { Position } from "./core/leoNodes";
import { LeoGotoNode } from "./leoGoto";
import { LeoFrame } from "./core/leoFrame";

/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI {
    // * State flags
    public leoStates: LeoStates;
    public verbose: boolean = true;
    public trace: boolean = true;
    public frameIndex: number = 0;
    public clipboardContents: string = "";
    public isNullGui: boolean = false;

    // * Timers
    public refreshTimer: [number, number] | undefined; // until the selected node is found - even if already started refresh
    public lastRefreshTimer: [number, number] | undefined; // until the selected node is found - refreshed even if not found
    public commandRefreshTimer: [number, number] | undefined; // until the selected node is found -  keep if starting a new command already pending
    public lastCommandRefreshTimer: [number, number] | undefined; // until the selected node is found - refreshed if starting a new command
    public commandTimer: [number, number] | undefined; // until the command done - keep if starting a new one already pending
    public lastCommandTimer: [number, number] | undefined; // until the command done - refreshed if starting a new one
    public preventRefresh: boolean = false;

    // * Configuration Settings Service
    public config: Config; // Public configuration service singleton, used in leoSettingsWebview, leoBridge, and leoNode for inverted contrast

    // * Icon Paths (Singleton static arrays)
    public nodeIcons: Icon[] = [];
    public documentIcons: Icon[] = [];
    public buttonIcons: Icon[] = [];
    public gotoIcons: Icon[] = [];

    // * Refresh Cycle
    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh
    private _revealType: RevealType = RevealType.NoReveal; // Type of reveal for the selected node (when refreshing outline)
    private _preventShowBody = false; // Used when refreshing treeview from config: It requires not to open the body pane when refreshing.
    private _fromOutline: boolean = false; // flag to leave focus on outline instead of body when finished refreshing
    private _focusInterrupt: boolean = false; // Flag for preventing setting focus when interrupting (canceling) an 'insert node' text input dialog with another one

    // * Outline Pane
    private _leoTreeProvider!: LeoOutlineProvider; // TreeDataProvider single instance
    private _leoTreeView!: vscode.TreeView<Position>; // Outline tree view added to the Tree View Container with an Activity Bar icon
    private _leoTreeExView!: vscode.TreeView<Position>; // Outline tree view added to the Explorer Sidebar
    private _lastTreeView!: vscode.TreeView<Position>; // Last visible treeview

    // * Body pane
    private _bodyFileSystemStarted: boolean = false;
    private _bodyEnablePreview: boolean = true;
    private _leoFileSystem!: LeoBodyProvider; // as per https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api
    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.
    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _bodyUri: vscode.Uri = utils.strToLeoUri("");
    get bodyUri(): vscode.Uri {
        return this._bodyUri;
    }
    set bodyUri(p_uri: vscode.Uri) {
        this._leoFileSystem.setBodyTime(p_uri);
        this._bodyUri = p_uri;
    }

    // * Find panel
    private _findPanelWebviewView: vscode.WebviewView | undefined;
    private _findPanelWebviewExplorerView: vscode.WebviewView | undefined;
    private _lastSettingsUsed: LeoSearchSettings | undefined; // Last settings loaded / saved for current document


    // * Documents Pane
    private _leoDocumentsProvider!: LeoDocumentsProvider;
    private _leoDocuments!: vscode.TreeView<LeoFrame>;
    private _leoDocumentsExplorer!: vscode.TreeView<LeoFrame>;
    private _lastLeoDocuments: vscode.TreeView<LeoFrame> | undefined;

    private _currentDocumentChanged: boolean = false; // if clean and an edit is done: refresh opened documents view

    // * '@button' pane
    private _leoButtonsProvider!: LeoButtonsProvider;
    private _leoButtons!: vscode.TreeView<LeoButtonNode>;
    private _leoButtonsExplorer!: vscode.TreeView<LeoButtonNode>;
    private _lastLeoButtons: vscode.TreeView<LeoButtonNode> | undefined;

    // * Undos pane
    private _leoUndosProvider!: LeoUndosProvider;
    private _leoUndos!: vscode.TreeView<LeoUndoNode>;
    private _leoUndosExplorer!: vscode.TreeView<LeoUndoNode>;
    private _lastLeoUndos: vscode.TreeView<LeoUndoNode> | undefined;

    // * Log and terminal Panes
    private _leoLogPane: vscode.OutputChannel = vscode.window.createOutputChannel(Constants.GUI.LOG_PANE_TITLE);
    private _leoTerminalPane: vscode.OutputChannel | undefined;

    // * Edit/Insert Headline Input Box options instance, setup so clicking outside cancels the headline change
    private _headlineInputOptions: vscode.InputBoxOptions = {
        ignoreFocusOut: false,
        value: '',
        valueSelection: undefined,
        prompt: '',
    };

    // * Debounced method
    public launchRefresh!: ((p_node?: Position) => void);

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public getStates!: (() => void);

    // * Debounced method
    public refreshDocumentsPane!: (() => void);

    // * Debounced method
    public refreshUndoPane!: (() => void);

    constructor(private _context: vscode.ExtensionContext) {

        // * Setup States
        this.leoStates = new LeoStates(_context, this);

        // * Get configuration settings
        this.config = new Config(_context, this);

        // * Set required vscode configs if needed
        this.config.checkEnablePreview(true);
        this.config.checkCloseEmptyGroups(true);
        this.config.checkCloseOnFileDelete(true);

        // * also check workbench.editor.enablePreview
        this.config.buildFromSavedSettings();
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // * Build Icon filename paths
        this.nodeIcons = utils.buildNodeIconPaths(_context);
        this.documentIcons = utils.buildDocumentIconPaths(_context);
        this.buttonIcons = utils.buildButtonsIconPaths(_context);
        this.gotoIcons = utils.buildGotoIconPaths(_context);

        this.showLogPane();
    }

    /**
     * * Set all remaining local objects, set ready flag(s) and refresh all panels
     */
    public finishStartup(): void {
        g.app.windowList[this.frameIndex].startupWindow = true;

        // * Create a single data provider for both outline trees, Leo view and Explorer view
        this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons, this);
        this._leoTreeView = vscode.window.createTreeView(Constants.TREEVIEW_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._context.subscriptions.push(this._leoTreeView);
        this._context.subscriptions.push(
            this._leoTreeView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeView)))
        );
        this._context.subscriptions.push(
            this._leoTreeView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeView)))
        );
        this._context.subscriptions.push(
            // * Trigger 'show tree in Leo's view'
            this._leoTreeView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoTreeExView = vscode.window.createTreeView(Constants.TREEVIEW_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._context.subscriptions.push(this._leoTreeExView);

        this._context.subscriptions.push(
            this._leoTreeExView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeExView)))
        );
        this._context.subscriptions.push(
            this._leoTreeExView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeExView)))
        );
        this._context.subscriptions.push(
            // * Trigger 'show tree in explorer view'
            this._leoTreeExView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, true)))
        );
        if (this.config.treeInExplorer) {
            this._lastTreeView = this._leoTreeExView;
        } else {
            this._lastTreeView = this._leoTreeView;
        }

        // * Create Leo Opened Documents Treeview Providers and tree views
        this._leoDocumentsProvider = new LeoDocumentsProvider(this.leoStates, this);
        this._leoDocuments = vscode.window.createTreeView(Constants.DOCUMENTS_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._context.subscriptions.push(this._leoDocuments);
        this._context.subscriptions.push(
            this._leoDocuments.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoDocumentsExplorer = vscode.window.createTreeView(Constants.DOCUMENTS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._context.subscriptions.push(this._leoDocumentsExplorer);
        this._context.subscriptions.push(
            this._leoDocumentsExplorer.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, true)))
        );
        this._lastLeoDocuments = this._leoDocumentsExplorer;

        // * Create '@buttons' Treeview Providers and tree views
        this._leoButtonsProvider = new LeoButtonsProvider(this.leoStates, this.buttonIcons);
        this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._context.subscriptions.push(this._leoButtons);
        this._context.subscriptions.push(
            this._leoButtons.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._context.subscriptions.push(this._leoButtonsExplorer);
        this._context.subscriptions.push(
            this._leoButtonsExplorer.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, true)))
        );
        this._lastLeoButtons = this._leoButtonsExplorer;

        // * Create Undos Treeview Providers and tree views
        this._leoUndosProvider = new LeoUndosProvider(this.leoStates, this);
        this._leoUndos = vscode.window.createTreeView(Constants.UNDOS_ID, { showCollapseAll: false, treeDataProvider: this._leoUndosProvider });
        this._context.subscriptions.push(this._leoUndos);
        this._context.subscriptions.push(
            this._leoUndos.onDidChangeVisibility((p_event => this._onUndosTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoUndosExplorer = vscode.window.createTreeView(Constants.UNDOS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoUndosProvider });
        this._context.subscriptions.push(this._leoUndosExplorer);
        this._context.subscriptions.push(
            this._leoUndosExplorer.onDidChangeVisibility((p_event => this._onUndosTreeViewVisibilityChanged(p_event, true)))
        );
        this._lastLeoUndos = this._leoUndosExplorer;

        // * Create Body Pane
        this._leoFileSystem = new LeoBodyProvider(this);

        this._bodyMainSelectionColumn = 1;

        // * Create Status bar Entry
        // this._leoStatusBar = new LeoStatusBar(_context, this);

        // * Leo Find Panel
        // this._leoFindPanelProvider = new LeoFindPanelProvider(
        //     _context.extensionUri,
        //     _context,
        //     this
        // );
        // this._context.subscriptions.push(
        //     vscode.window.registerWebviewViewProvider(
        //         Constants.FIND_ID,
        //         this._leoFindPanelProvider,
        //         { webviewOptions: { retainContextWhenHidden: true } }
        //     )
        // );
        // this._context.subscriptions.push(
        //     vscode.window.registerWebviewViewProvider(
        //         Constants.FIND_EXPLORER_ID,
        //         this._leoFindPanelProvider,
        //         { webviewOptions: { retainContextWhenHidden: true } }
        //     )
        // );

        // * Configuration / Welcome webview
        // this.leoSettingsWebview = new LeoSettingsProvider(_context, this);

        // * React to change in active panel/text editor (window.activeTextEditor) - also fires when the active editor becomes undefined
        // this._context.subscriptions.push(
        // vscode.window.onDidChangeActiveTextEditor((p_editor) =>
        //     this._onActiveEditorChanged(p_editor)
        // )
        // );

        // * React to change in selection, cursor position and scroll position
        // this._context.subscriptions.push(
        // vscode.window.onDidChangeTextEditorSelection((p_event) =>
        //     this._onChangeEditorSelection(p_event)
        // )
        // );

        // this._context.subscriptions.push(
        // vscode.window.onDidChangeTextEditorVisibleRanges((p_event) =>
        //     this._onChangeEditorScroll(p_event)
        // )
        // );

        // * Triggers when a different text editor/vscode window changed focus or visibility, or dragged
        // This is also what triggers after drag and drop, see '_onChangeEditorViewColumn'
        this._context.subscriptions.push(
            vscode.window.onDidChangeTextEditorViewColumn((p_columnChangeEvent) => {
                // temp
            }
                //this._changedTextEditorViewColumn(p_columnChangeEvent)
            ) // Also triggers after drag and drop
        );

        this._context.subscriptions.push(
            vscode.window.onDidChangeVisibleTextEditors((p_editors) => {
                if (p_editors && p_editors.length) {
                    console.log('editors changed visibility', p_editors[0].document, p_editors[0].document.uri.fsPath, p_editors[0].document.uri.scheme);
                }
            }
                //this._changedVisibleTextEditors(p_editors)
            ) // Window.visibleTextEditors changed
        );

        this._context.subscriptions.push(
            vscode.window.onDidChangeWindowState((p_windowState) => {
                // temp
            }
                //this._changedWindowState(p_windowState)
            ) // Focus state of the current window changes
        );

        // * React when typing and changing body pane
        // this._context.subscriptions.push(
        // vscode.workspace.onDidChangeTextDocument((p_textDocumentChange) =>
        //     this._onDocumentChanged(p_textDocumentChange)
        // )
        // );

        // * React to configuration settings events
        this._context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration((p_configChange) =>
                this._onChangeConfiguration(p_configChange)
            )
        );

        // * React to opening of any file in vscode
        // this._context.subscriptions.push(
        // vscode.workspace.onDidOpenTextDocument((p_document) =>
        //     this._onDidOpenTextDocument(p_document)
        // )
        // );

        // * Debounced refresh flags and UI parts, other than the tree and body, when operation(s) are done executing
        this.getStates = debounce(
            this._triggerGetStates,
            Constants.STATES_DEBOUNCE_DELAY,
            { leading: false, trailing: true }
        );
        this.refreshDocumentsPane = debounce(
            this._refreshDocumentsPane,
            Constants.DOCUMENTS_DEBOUNCE_DELAY,
            { leading: false, trailing: true }
        );
        this.refreshUndoPane = debounce(
            this._refreshUndoPane,
            Constants.UNDOS_DEBOUNCE_DELAY,
            { leading: false, trailing: true }
        );
        // Immediate 'throttled' and debounced
        this.launchRefresh = debounce(
            this._launchRefresh,
            Constants.REFRESH_DEBOUNCE_DELAY,
            { leading: false, trailing: true }
        );

        this.leoStates.leoReady = true;

        if (!this.leoStates.fileOpenedReady && g.app.windowList.length) {
            this._setupOpenedLeoDocument();
            this.leoStates.qLastContextChange.then(() => {
                this.getStates();
            });
        }

        // * Old startup method
        // setTimeout(() => {
        //     this._setupRefresh(true,
        //         { tree: true, body: true, documents: true, buttons: true, states: true }
        //     );
        //     this.launchRefresh();
        // }, 10);
    }

    /** 
     * Make all key and commands bindings
     */
    public makeAllBindings(): void {
        commandBindings.makeAllBindings(this, this._context);
    }

    /** 
     * * Save dirty body pane text to its VNode's 'b' content.
     * @returns Promise that resolves when body is saved in its node's v.b.
     */
    public _triggerSave(): Promise<unknown> {
        // TODO: Save dirty body pane text to its VNode's 'b' content.
        return Promise.resolve();
    }

    /**
     * * 'getStates' action for use in debounced method call
     */
    private _triggerGetStates(): void {
        if (this._refreshType.states) {
            this._refreshType.states = false;
            const c = g.app.windowList[this.frameIndex].c;
            const p = c.p;
            let w_canHoist = true;
            if (c.hoistStack.length) {
                const w_ph = c.hoistStack[c.hoistStack.length - 1].p;
                if (p.__eq__(w_ph)) {
                    // p is already the hoisted node
                    w_canHoist = false;
                }
            } else {
                // not hoisted, was it the single top child of the real root?
                if (c.rootPosition()!.__eq__(p) && c.hiddenRootNode.children.length === 1) {
                    w_canHoist = false;
                }
            }
            const w_states: LeoPackageStates = {
                changed: c.changed, // Document has changed (is dirty)
                canUndo: c.canUndo(), // Document can undo the last operation done
                canRedo: c.canRedo(), // Document can redo the last operation 'undone'
                canGoBack: c.nodeHistory.beadPointer > 0,
                canGoNext: c.nodeHistory.beadPointer + 1 < c.nodeHistory.beadList.length,
                canDemote: c.canDemote(), // Selected node can have its siblings demoted
                canPromote: c.canPromote(), // Selected node can have its children promoted
                canDehoist: c.canDehoist(), // Document is currently hoisted and can be de-hoisted
                canHoist: w_canHoist
            };
            this.leoStates.setLeoStateFlags(w_states);
        }
        if (this._refreshType.documents) {
            this._refreshType.documents = false;
            this.refreshDocumentsPane();
        }
        if (this._refreshType.buttons) {
            this._refreshType.buttons = false;
            this._leoButtonsProvider.refreshTreeRoot();
        }
    }

    /**
     * * Setup UI for having no opened Leo documents
     */
    private _setupNoOpenedLeoDocument(): void {
        this.leoStates.fileOpenedReady = false;
        this._bodyTextDocument = undefined;
        this._refreshOutline(false, RevealType.NoReveal);
        this.refreshDocumentsPane();
        this._leoButtonsProvider.refreshTreeRoot();
        this.closeBody();
    }

    /**
     * * A Leo file was opened: setup UI accordingly.
     * @param p_openFileResult Returned info about currently opened and editing document
     * @return a promise that resolves to an opened body pane text editor
     */
    private _setupOpenedLeoDocument(): Promise<unknown> {

        // const w_selectedLeoNode = this.apToLeoNode(p_openFileResult.node, false); // Just to get gnx for the body's fist appearance
        this.leoStates.leoOpenedFileName = g.app.windowList[this.frameIndex].c.fileName();

        // // * If not unnamed file add to recent list & last opened list
        // this._addRecentAndLastFile(p_openFileResult.filename);

        // // * Could be already opened, so perform 'rename hack' as if another node was selected
        // if (this._bodyTextDocument && this.bodyUri) {
        //     // TODO : BUG WHEN SWITCHING LEO DOCUMENT : NEED CROSSOVER LOGIC!
        //     this._switchBody(w_selectedLeoNode.gnx);
        // } else {
        //     this.bodyUri = utils.strToLeoUri(w_selectedLeoNode.gnx);
        // }

        // // * Start body pane system
        // if (!this._bodyFileSystemStarted) {
        //     this._context.subscriptions.push(
        //         vscode.workspace.registerFileSystemProvider(Constants.URI_LEO_SCHEME, this._leoFileSystem, { isCaseSensitive: true })
        //     );
        //     this._bodyFileSystemStarted = true;
        // }
        // // * Startup flag
        this.leoStates.fileOpenedReady = true;
        // // * Maybe first valid redraw of tree along with the selected node and its body
        // this._refreshOutline(true, RevealType.RevealSelectFocus); // p_revealSelection flag set
        // // * Maybe first StatusBar appearance
        // this._leoStatusBar.update(true, 0, true);
        // this._leoStatusBar.show(); // Just selected a node
        // // * Send config to python's side (for settings such as defaultReloadIgnore and checkForChangeExternalFiles)
        // this.sendConfigToServer(this.config.getConfig());
        // // * Refresh Opened tree views
        // this.refreshDocumentsPane();
        // this._leoButtonsProvider.refreshTreeRoot();
        // // * Maybe first Body appearance
        // return this.showBody(false);
        // Reset Extension context flags (used in 'when' clauses in package.json)

        return Promise.resolve(true);
    }

    /**
     * * Show the outline, with Leo's selected node also selected, and optionally focussed
     * @param p_focusOutline Flag for focus to be placed in outline
     */
    public showOutline(p_focusOutline?: boolean): void {
        const c = g.app.windowList[this.frameIndex].c;
        this._lastTreeView.reveal(c.p, {
            select: true,
            focus: !!p_focusOutline
        }).then(
            () => { }, // Ok
            (p_error) => {
                console.log('showOutline could not reveal');
            }
        );
    }

    /**
     * * Refresh tree for 'node hover icons' to show up properly after changing their settings
     */
    public configTreeRefresh(): void {
        if (this.leoStates.fileOpenedReady) {
            this._preventShowBody = true;
            this._refreshOutline(true, RevealType.RevealSelect);
        }
    }

    /**
     * * Handle selected node being created for the outline
     * @param p_node Position that was just created and detected as selected node
     */
    public gotSelectedNode(p_node: Position): void {

        if (this._revealType) {
            setTimeout(() => {
                this._lastTreeView.reveal(p_node, {
                    select: true,
                    focus: (this._revealType.valueOf() >= RevealType.RevealSelectFocus.valueOf())
                }).then(
                    () => {
                        // Ok - so reset timers
                        if (this.trace) {
                            if (this.refreshTimer) {
                                console.log('refreshTimer', utils.getDurationMs(this.refreshTimer));
                            }
                            if (this.lastRefreshTimer) {
                                console.log('lastRefreshTimer', utils.getDurationMs(this.lastRefreshTimer));
                            }
                            if (this.commandRefreshTimer) {
                                console.log('commandRefreshTimer', utils.getDurationMs(this.commandRefreshTimer));
                            }
                            if (this.lastCommandRefreshTimer) {
                                console.log('lastCommandRefreshTimer', utils.getDurationMs(this.lastCommandRefreshTimer));
                            }
                        }
                        this.refreshTimer = undefined;
                        this.lastRefreshTimer = undefined;
                        this.commandRefreshTimer = undefined;
                        this.lastCommandRefreshTimer = undefined;
                    },
                    (p_error) => {
                        console.log('gotSelectedNode could not reveal');
                    }
                );
                // Done, so reset reveal type 'flag'
                this._revealType = RevealType.NoReveal;
            }, 0);
        }
        // set context flags
        this.leoStates.setSelectedNodeFlags(p_node);
    }

    /**
     * * Setup global refresh options
     * @param p_focusOutline Flag for focus to be placed in outline
     * @param p_refreshType Refresh flags for each UI part
     */
    public _setupRefresh(p_focusOutline: boolean, p_refreshType: ReqRefresh): void {
        // Set final "focus-placement" and setup final refresh type, if command requires higher than the one setup so far
        this._fromOutline = p_focusOutline; // set directly
        Object.assign(this._refreshType, p_refreshType); // add all properties without replacing (only 'true' properties)
    }

    /**
     * * Launches refresh for UI components and states (Debounced)
     */
    public async _launchRefresh(p_node?: Position): Promise<unknown> {
        // check states for having at least a document opened
        if (this.leoStates.leoReady && this.leoStates.fileOpenedReady) {
            // Had some opened
            if (!g.app.windowList.length) {
                return this._setupNoOpenedLeoDocument(); // All closed now!
            }
        }
        if (this.leoStates.leoReady && !this.leoStates.fileOpenedReady) {
            // Was all closed
            if (g.app.windowList.length) {
                this._setupOpenedLeoDocument();
                // Has a commander opened, but wait for UI!
                await this.leoStates.qLastContextChange;
            }
        }

        // Consider command finished
        if (this.trace) {
            if (this.commandTimer !== undefined) {
                console.log('commandTimer', utils.getDurationMs(this.commandTimer));
            }
        }
        this.commandTimer = undefined;

        // Start reset-timer capture, if has been reset.
        this.lastRefreshTimer = process.hrtime();
        if (this.refreshTimer === undefined) {
            this.refreshTimer = this.lastRefreshTimer;
        }

        const c = g.app.windowList[this.frameIndex].c;

        // Set w_revealType, it will ultimately set this._revealType.
        // Used when finding the OUTLINE's selected node and setting or preventing focus into it
        // Set this._fromOutline. Used when finding the selected node and showing the BODY to set or prevent focus in it

        if (Object.keys(this._refreshType).length) {
            // console.log('Has UI to REFRESH!', this._refreshType);
        }

        // this._refreshType = Object.assign({}, p_refreshType); // USE _setupRefresh INSTEAD

        let w_revealType: RevealType;

        if (this._fromOutline) {
            w_revealType = RevealType.RevealSelectFocus;
        } else {
            w_revealType = RevealType.RevealSelect;
        }

        // if (this._refreshType.body &&
        //     this._bodyLastChangedDocument && this._bodyLastChangedDocument.isDirty) {
        //     // When this refresh is launched with 'refresh body' requested, we need to lose any pending edits and save on vscode's side.
        //     this._bodyLastChangedDocument.save(); // Voluntarily save to 'clean' any pending body
        // }

        // * _focusInterrupt insertNode Override
        if (this._focusInterrupt) {
            // this._focusInterrupt = false; // TODO : Test if reverting this in _gotSelection is 'ok'
            w_revealType = RevealType.RevealSelect;
        }
        if (
            this._refreshType.tree ||
            this._refreshType.body ||
            this._refreshType.node ||
            this._refreshType.states
        ) {
            this.refreshUndoPane(); // with largish debounce.
        }

        // * Either the whole tree refreshes, or a single tree node is revealed when just navigating
        if (this._refreshType.tree) {

            this._refreshType.tree = false;
            this._refreshOutline(true, w_revealType);

        } else if (this._refreshType.node && p_node) {

            // * Force single node "refresh" by revealing it, instead of "refreshing" it
            this._refreshType.node = false;

            this.leoStates.setSelectedNodeFlags(p_node);
            this._revealTreeViewNode(p_node, {
                select: true, focus: true // FOCUS FORCED TO TRUE always leave focus on tree when navigating
            });

            if (this._refreshType.body) {
                this._refreshType.body = false;
                this._tryApplyNodeToBody(p_node, false, true); // ! NEEDS STACK AND THROTTLE!
            }

        } else if (this._refreshType.node) {
            this._refreshType.node = false;
            this.leoStates.setSelectedNodeFlags(c.p);
            this._revealTreeViewNode(c.p, {
                select: true, focus: true // FOCUS FORCED TO TRUE always leave focus on tree when navigating
            });

        }


        // * DEBUG INFO
        /* 
        console.log('***********************finished refresh');
        console.log('**** c.config should be lowercase: ', c.config.new_leo_file_encoding);
        // @ts-expect-error
        console.log('**** g.app.config should be uppercase: ', g.app.config.new_leo_file_encoding);
        console.log('**** c.collapse_on_lt_arrow :', c.collapse_on_lt_arrow);
        console.log('**** c.collapse_nodes_after_move :', c.collapse_nodes_after_move);
        console.log('**** c.sparse_move: ', c.sparse_move);
         */


        // getStates will check if documents, buttons and states flags are set and refresh accordingly
        return this.getStates();
    }

    /**
     * * Refreshes the outline. A reveal type can be passed along to specify the reveal type for the selected node
     * @param p_incrementTreeId Make all node id's be 'new' by incrementing the treeId prefix of the id's.
     * @param p_revealType Facultative reveal type to specify type of reveal when the 'selected node' is encountered
     */
    private _refreshOutline(p_incrementTreeId: boolean, p_revealType?: RevealType): void {
        if (p_incrementTreeId) {
            this._leoTreeProvider.incTreeId();
        }
        if (p_revealType !== undefined && p_revealType.valueOf() >= this._revealType.valueOf()) { // To check if selected node should self-select while redrawing whole tree
            this._revealType = p_revealType; // To be read/cleared (in arrayToLeoNodesArray instead of directly by nodes)
        }
        this._leoTreeProvider.refreshTreeRoot();
    }

    /**
     * * 'TreeView.reveal' for any opened leo outline that is currently visible
     * @param p_leoNode The node to be revealed
     * @param p_options Options object for the revealed node to either also select it, focus it, and expand it
     * @returns Thenable from the reveal tree node action, resolves directly if no tree visible
     */
    private _revealTreeViewNode(
        p_leoNode: Position,
        p_options?: { select?: boolean; focus?: boolean; expand?: boolean | number }
    ): Thenable<void> {
        if (this._leoTreeView.visible) {
            return this._leoTreeView.reveal(p_leoNode, p_options);
        }
        if (this._leoTreeExView.visible && this.config.treeInExplorer) {
            return this._leoTreeExView.reveal(p_leoNode, p_options);
        }
        return Promise.resolve(); // Defaults to resolving even if both are hidden
    }

    /**
     * * Public method exposed as 'refreshDocumentsPane' setter/getter to refresh the documents pane
     * Document Panel May be refreshed by other services (states service, ...)
     */
    private _refreshDocumentsPane(): void {
        this._leoDocumentsProvider.refreshTreeRoot();
    }

    /**
     * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
     * @param p_frame Document node instance in the Leo document view to be the 'selected' one.
     */
    public setDocumentSelection(p_frame: LeoFrame): void {
        this._currentDocumentChanged = p_frame.c.changed;
        this.leoStates.leoOpenedFileName = p_frame.c.fileName();
        setTimeout(() => {
            if (this._lastLeoDocuments && this._lastLeoDocuments.selection.length && this._lastLeoDocuments.selection[0] === p_frame) {
                // console.log('setDocumentSelection: already selected!');
            } else if (this._lastLeoDocuments && this._lastLeoDocuments.visible) {
                this._lastLeoDocuments.reveal(p_frame, { select: true, focus: false }).then(
                    () => { }, // Ok
                    (p_error) => {
                        console.log('setDocumentSelection could not reveal');
                    }
                );
            }
        }, 0);
    }

    /**
     * * Refreshes the undo pane
     */
    private _refreshUndoPane(): void {
        this._leoUndosProvider.refreshTreeRoot();
    }

    /**
     * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
     * @param p_undoNode Node instance in the Leo History view to be the 'selected' one.
     */
    public setUndoSelection(p_undoNode: LeoUndoNode): void {
        setTimeout(() => {
            if (this._lastLeoUndos && this._lastLeoUndos.visible) {
                this._lastLeoUndos.reveal(p_undoNode, { select: true, focus: false }).then(
                    () => { }, // Ok - do nothing
                    (p_error) => {
                        console.log('setUndoSelection could not reveal');
                    }
                );
            }
        }, 0);
    }

    /**
     * * Handles the change of vscode config: a onDidChangeConfiguration event triggered
     * @param p_event The configuration-change event passed by vscode
     */
    private _onChangeConfiguration(p_event: vscode.ConfigurationChangeEvent): void {
        if (p_event.affectsConfiguration(Constants.CONFIG_NAME)) {
            this.config.buildFromSavedSettings(); // If the config setting started with 'leojs'
        }
        // also check if workbench.editor.enablePreview
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // Check For specific vscode settings needed for leojs
        // Leave small delay for multiple possible forced changes at startup
        setTimeout(() => {
            this.config.checkEnablePreview();
            this.config.checkCloseEmptyGroups();
            this.config.checkCloseOnFileDelete();
        }, 150);
    }

    /**
     * * Handles the node expanding and collapsing interactions by the user in the treeview
     * @param p_event The event passed by vscode
     * @param p_expand True if it was an expand, false if it was a collapse event
     * @param p_treeView Pointer to the treeview itself, either the standalone treeview or the one under the explorer
     */
    private _onChangeCollapsedState(p_event: vscode.TreeViewExpansionEvent<Position>, p_expand: boolean, p_treeView: vscode.TreeView<Position>): void {

        // * Expanding or collapsing via the treeview interface selects the node to mimic Leo.

        // this.triggerBodySave(true); // Get any modifications from the editor into the Leo's body model

        if (p_treeView.selection.length && p_treeView.selection[0] && p_treeView.selection[0].__eq__(p_event.element)) {
            // * This happens if the tree selection is the same as the expanded/collapsed node: Just have Leo do the same
            // pass
        } else {
            // * This part only happens if the user clicked on the arrow without trying to select the node
            this._lastTreeView.reveal(p_event.element).then(
                () => { }, // Ok
                (p_error) => {
                    console.log('_onChangeCollapsedState could not reveal');
                }
            );
            this.selectTreeNode(p_event.element, true);
        }

        // *  vscode will update its tree by itself, but we need to change Leo's model of its outline
        if (p_expand) {
            p_event.element.expand();
        } else {
            p_event.element.contract();
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flag to signify that the treeview who triggered this event is the one in the explorer view
     */
    private _onTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_event.visible) {
            this._lastTreeView = p_explorerView ? this._leoTreeExView : this._leoTreeView;
            this._refreshOutline(true, RevealType.RevealSelect);

            // * This gies error Data tree node not found
            // const c = g.app.windowList[this.frameIndex].c;
            // let q_reveal: Thenable<void> | undefined;
            // q_reveal = this._lastTreeView.reveal(c.p).then(
            //     () => { }, // Ok
            //     (p_error) => {
            //         console.log('_onTreeViewVisibilityChanged could not reveal');
            //     }
            // );
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onDocTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
        if (p_event.visible) {
            this._lastLeoDocuments = p_explorerView ? this._leoDocumentsExplorer : this._leoDocuments;
            // TODO: Check if needed
            // this.refreshDocumentsPane(); // List may not have changed, but it's selection may have
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onButtonsTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
        if (p_event.visible) {
            this._lastLeoButtons = p_explorerView ? this._leoButtonsExplorer : this._leoButtons;
            // TODO: Check if needed
            // this._leoButtonsProvider.refreshTreeRoot(); // May not need to set selection...?
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onUndosTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
        if (p_event.visible) {
            this._lastLeoUndos = p_explorerView ? this._leoUndosExplorer : this._leoUndos;
            // TODO: Check if needed
            // this._leoUndosProvider.refreshTreeRoot(); // May not need to set selection...?
        }
    }

    /**
     * * Save body to Leo if its dirty. That is, only if a change has been made to the body 'document' so far
     * @param p_forcedVsCodeSave Flag to also have vscode 'save' the content of this editor through the filesystem
     * @returns a promise that resolves when the possible saving process is finished
     */
    public triggerBodySave(p_forcedVsCodeSave?: boolean): Thenable<unknown> {
        // * Save body to Leo if a change has been made to the body 'document' so far
        // let q_savePromise: Promise<boolean>;
        // if (
        //     this._bodyLastChangedDocument &&
        //     (this._bodyLastChangedDocument.isDirty || this._editorTouched) &&
        //     !this._bodyLastChangedDocumentSaved
        // ) {
        //     // * Is dirty and unsaved, so proper save is in order
        //     const w_document = this._bodyLastChangedDocument; // backup for bodySaveDocument before reset
        //     this._bodyLastChangedDocumentSaved = true;
        //     this._editorTouched = false;
        //     q_savePromise = this._bodySaveDocument(w_document, p_forcedVsCodeSave);
        // } else if (
        //     p_forcedVsCodeSave &&
        //     this._bodyLastChangedDocument &&
        //     this._bodyLastChangedDocument.isDirty &&
        //     this._bodyLastChangedDocumentSaved
        // ) {
        //     // * Had 'forcedVsCodeSave' and isDirty only, so just clean up dirty VSCODE document flag.
        //     this._bodyLastChangedDocument.save(); // ! USED INTENTIONALLY: This trims trailing spaces
        //     q_savePromise = this._bodySaveSelection(); // just save selection if it's changed
        // } else {
        //     this._bodyLastChangedDocumentSaved = true;
        //     q_savePromise = this._bodySaveSelection();  // just save selection if it's changed
        // }
        // return q_savePromise.then((p_result) => {
        //     return p_result;
        // }, (p_reason) => {
        //     console.log('BodySave rejected :', p_reason);
        //     return false;
        // });
        return Promise.resolve(true);
    }

    /**
     * * Saves the cursor position along with the text selection range and scroll position
     * @returns Promise that resolves when the "setSelection" action returns from Leo's side
     */
    private _bodySaveSelection(): Thenable<unknown> {
        // if (this._selectionDirty && this._selection) {
        //     // Prepare scroll data separately
        //     // ! TEST NEW SCROLL WITH SINGLE LINE NUMBER
        //     let w_scroll: number;
        //     if (this._selectionGnx === this._scrollGnx && this._scrollDirty) {
        //         w_scroll = this._scroll?.start.line || 0;
        //     } else {
        //         w_scroll = 0;
        //     }
        //     const w_param: BodySelectionInfo = {
        //         gnx: this._selectionGnx,
        //         scroll: w_scroll,
        //         insert: {
        //             line: this._selection.active.line || 0,
        //             col: this._selection.active.character || 0,
        //         },
        //         start: {
        //             line: this._selection.start.line || 0,
        //             col: this._selection.start.character || 0,
        //         },
        //         end: {
        //             line: this._selection.end.line || 0,
        //             col: this._selection.end.character || 0,
        //         },
        //     };
        //     // console.log("set scroll to leo: " + w_scroll + " start:" + this._selection.start.line);

        //     this._scrollDirty = false;
        //     this._selectionDirty = false; // don't wait for return of this call
        //     return this.sendAction(Constants.LEOBRIDGE.SET_SELECTION, JSON.stringify(w_param)).then(
        //         (p_result) => {
        //             return Promise.resolve(true);
        //         }
        //     );
        // } else {
        //     return Promise.resolve(true);
        // }
        return Promise.resolve(true);
    }

    /**
     * * Sets new body text on leo's side, and may optionally save vsCode's body editor (which will trim spaces)
     * @param p_document Vscode's text document which content will be used to be the new node's body text in Leo
     * @param p_forcedVsCodeSave Flag to also have vscode 'save' the content of this editor through the filesystem
     * @returns a promise that resolves when the complete saving process is finished
     */
    private _bodySaveDocument(
        p_document: vscode.TextDocument,
        p_forcedVsCodeSave?: boolean
    ): Thenable<unknown> {
        // if (p_document) {
        //     // * Fetch gnx and document's body text first, to be reused more than once in this method
        //     const w_param = {
        //         gnx: utils.leoUriToStr(p_document.uri),
        //         body: p_document.getText(),
        //     };
        //     this.sendAction(Constants.LEOBRIDGE.SET_BODY, JSON.stringify(w_param)); // Don't wait for promise
        //     // This bodySaveSelection is placed on the stack right after saving body, returns promise either way
        //     return this._bodySaveSelection().then(() => {
        //         this._refreshType.states = true;
        //         this.getStates();
        //         if (p_forcedVsCodeSave) {
        //             return p_document.save(); // ! USED INTENTIONALLY: This trims trailing spaces
        //         }
        //         return Promise.resolve(p_document.isDirty);
        //     });
        // } else {
        //     return Promise.resolve(false);
        // }
        return Promise.resolve(true);
    }

    /**
     * * Sets new body text on leo's side before vscode closes itself if body is dirty
     * @param p_document Vscode's text document which content will be used to be the new node's body text in Leo
     * @returns a promise that resolves when the complete saving process is finished
     */
    private _bodySaveDeactivate(
        p_document: vscode.TextDocument
    ): Thenable<unknown> {
        // const w_param = {
        //     gnx: utils.leoUriToStr(p_document.uri),
        //     body: p_document.getText(),
        // };
        // return this.sendAction(Constants.LEOBRIDGE.SET_BODY, JSON.stringify(w_param));
        return Promise.resolve(true);
    }

    /**
     * * Called by UI when the user selects in the tree (click or 'open aside' through context menu)
     * @param p_node is the position node selected in the tree
     * @param p_aside flag meaning it's body should be shown in a new editor column
     * @returns thenable for reveal to finish or select position to finish
     */
    public selectTreeNode(p_node: Position, p_aside?: boolean): Thenable<unknown> {
        const c = g.app.windowList[this.frameIndex].c;
        // Note: set context flags for current selection when capturing and revealing the selected node
        // when the tree refreshes and the selected node is processed by getTreeItem & gotSelectedNode
        let q_reveal: Thenable<void> | undefined;

        if (c.positionExists(p_node)) {

            if (p_aside) {
                q_reveal = this._lastTreeView.reveal(p_node).then(
                    () => { }, // Ok
                    (p_error) => {
                        console.log('selectTreeNode could not reveal');
                    }
                );
            }
            c.selectPosition(p_node);
            // Set flags here - not only when 'got selection' is reached.
            this.leoStates.setSelectedNodeFlags(p_node);
            this._refreshType.states = true;
            this.getStates(); //  setLeoStateFlags gets called too

        } else {
            console.error('Selected a non-existent position', p_node.h);
        }

        // this.lastSelectedNode = p_node;

        return q_reveal ? q_reveal : Promise.resolve(true);
    }

    /**
     * Leo Command
     * @param p_cmd Command name string
     * @param p_node facultative, precise node onto which the command is run (also see p_keepSelection)
     * @param p_refreshType Object containing flags for sections needing to refresh after command ran
     * @param p_fromOutline flag to bring back focus on outline afterward
     * @param p_keepSelection flags to bring back selection on the original node before command ran
     */
    public async command(
        p_cmd: string,
        p_node: Position | undefined,
        p_refreshType: ReqRefresh,
        p_fromOutline: boolean,
        p_keepSelection?: boolean
    ): Promise<unknown> {
        this.lastCommandTimer = process.hrtime();
        if (this.commandTimer === undefined) {
            this.commandTimer = this.lastCommandTimer;
        }
        this.lastCommandRefreshTimer = this.lastCommandTimer;
        if (this.commandRefreshTimer === undefined) {
            this.commandRefreshTimer = this.lastCommandTimer;
        }

        await this._triggerSave();

        const c = g.app.windowList[this.frameIndex].c;
        this._setupRefresh(p_fromOutline, p_refreshType);

        let value: any = undefined;
        const p = p_node ? p_node : c.p;

        if (p.__eq__(c.p)) {
            value = c.doCommandByName(p_cmd); // no need for re-selection
        } else {
            const old_p = c.p;
            c.selectPosition(p);
            value = c.doCommandByName(p_cmd);
            if (p_keepSelection && c.positionExists(old_p)) {
                // Only if 'keep' old position was set, and old_p still exists
                c.selectPosition(old_p);
            }
        }
        if (this.trace) {
            if (this.lastCommandTimer) {
                console.log('lastCommandTimer', utils.getDurationMs(this.lastCommandTimer));
            }
        }
        this.lastCommandTimer = undefined;

        if (!this.preventRefresh) {

            if (value && value.then) {
                // IS A PROMISE
                (value as Thenable<unknown>).then((p_result) => {
                    this.launchRefresh();
                });
            } else {
                this.launchRefresh();
            }


        } else {
            this.preventRefresh = false;
        }

        return Promise.resolve(value);
    }

    /**
     * Opens quickPick minibuffer pallette to choose from all commands in this file's Thenable
     * @returns Thenable from the command resolving - or resolve with undefined if cancelled
     */
    public minibuffer(): Thenable<unknown> {
        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        return this.triggerBodySave(false)
            .then((p_saveResults) => {
                const c = g.app.windowList[this.frameIndex].c;
                const commands: vscode.QuickPickItem[] = [];
                for (let key in c.commandsDict) {
                    const command = c.commandsDict[key];
                    // Going to get replaced. Don't take those that begin with 'async-'
                    if (!(command as any).__name__.startsWith('async-')) {
                        commands.push({
                            label: key,
                            detail: (command as any).__doc__
                        });
                    }
                }
                commands.sort((a, b) => {
                    return a.label === b.label ? 0 : (a.label > b.label ? 1 : -1);
                });
                const w_options: vscode.QuickPickOptions = {
                    placeHolder: Constants.USER_MESSAGES.MINIBUFFER_PROMPT,
                    matchOnDetail: true,
                };
                return vscode.window.showQuickPick(commands, w_options);
            }).then((p_picked) => {
                if (
                    p_picked &&
                    p_picked.label &&
                    Constants.MINIBUFFER_OVERRIDDEN_COMMANDS[p_picked.label]
                ) {
                    return vscode.commands.executeCommand(
                        Constants.MINIBUFFER_OVERRIDDEN_COMMANDS[p_picked.label]
                    );
                }
                if (p_picked &&
                    p_picked.label &&
                    Constants.MINIBUFFER_OVERRIDDEN_NAMES[p_picked.label]) {
                    p_picked.label = Constants.MINIBUFFER_OVERRIDDEN_NAMES[p_picked.label];
                }
                if (p_picked && p_picked.label) {
                    const c = g.app.windowList[this.frameIndex].c;
                    const w_commandResult = c.doCommandByName(p_picked.label);

                    if (!this.preventRefresh) {
                        if (w_commandResult && w_commandResult.then) {
                            // IS A PROMISE
                            (w_commandResult as Thenable<unknown>).then((p_result) => {
                                this.launchRefresh();
                            });
                        } else {
                            this.launchRefresh();
                        }
                    } else {
                        this.preventRefresh = false;
                    }

                    return Promise.resolve(w_commandResult);
                } else {
                    // Canceled
                    return Promise.resolve(undefined);
                }
            });
    }

    /**
     * * Asks for a new headline label, and replaces the current label with this new one one the specified, or currently selected node
     * @param p_node Specifies which node to rename, or leave undefined to rename the currently selected node
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @returns Thenable that resolves when done
     */
    public editHeadline(p_node?: Position, p_fromOutline?: boolean): Thenable<unknown> {
        this._setupRefresh(!!p_fromOutline, { tree: true, states: true });

        const c = g.app.windowList[this.frameIndex].c;
        const u = c.undoer;
        if (!p_node) {
            p_node = c.p; // Current selection
        }
        this._headlineInputOptions.prompt =
            Constants.USER_MESSAGES.PROMPT_EDIT_HEADLINE;
        this._headlineInputOptions.value = p_node.h; // preset input pop up
        return vscode.window.showInputBox(this._headlineInputOptions).then((p_newHeadline) => {
            if (p_newHeadline && p_newHeadline !== "\n") {
                let w_truncated = false;
                if (p_newHeadline.indexOf("\n") >= 0) {
                    p_newHeadline = p_newHeadline.split("\n")[0];
                    w_truncated = true;
                }
                if (p_newHeadline.length > 1000) {
                    p_newHeadline = p_newHeadline.substring(0, 1000);
                    w_truncated = true;
                }

                if (p_newHeadline && p_node && p_node.h !== p_newHeadline) {
                    if (w_truncated) {
                        vscode.window.showInformationMessage("Truncating headline");
                    }

                    const undoData = u.beforeChangeHeadline(p_node);
                    c.setHeadString(p_node, p_newHeadline);  // Set v.h *after* calling the undoer's before method.
                    if (!c.changed) {
                        c.setChanged();
                    }
                    u.afterChangeHeadline(p_node, 'Edit Headline', undoData);
                    this.launchRefresh();
                    // if edited and accepted
                    return Promise.resolve(true);
                }

            } else {
                if (p_fromOutline) {
                    this.showOutline(true);
                }
                return Promise.resolve(undefined); // if cancelled or unchanged
            }
        });
    }

    /**
     * * Asks for a headline label to be entered and creates (inserts) a new node under the current, or specified, node
     * @param p_node specified under which node to insert, or leave undefined to use whichever is currently selected
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @param p_interrupt Signifies the insert action is actually interrupting itself (e.g. rapid CTRL+I actions by the user)
     * @returns Thenable that resolves when done
     */
    public insertNode(p_node: Position | undefined, p_fromOutline: boolean, p_interrupt: boolean, p_asChild: boolean): Thenable<unknown> {
        let w_fromOutline: boolean = !!p_fromOutline; // Use w_fromOutline for where we intend to leave focus when done with the insert

        if (p_interrupt) {
            this._focusInterrupt = true;
            w_fromOutline = this._fromOutline; // Going to use last state
        }
        this.triggerBodySave(true); // Don't wait for saving to resolve because we're waiting for user input anyways
        this._headlineInputOptions.prompt = Constants.USER_MESSAGES.PROMPT_INSERT_NODE;
        this._headlineInputOptions.value = Constants.USER_MESSAGES.DEFAULT_HEADLINE;


        return vscode.window.showInputBox(this._headlineInputOptions).then((p_newHeadline) => {
            // * if node has child and is expanded: turn p_asChild to true!

            this.lastCommandTimer = process.hrtime();
            if (this.commandTimer === undefined) {
                this.commandTimer = this.lastCommandTimer;
            }
            this.lastCommandRefreshTimer = this.lastCommandTimer;
            if (this.commandRefreshTimer === undefined) {
                this.commandRefreshTimer = this.lastCommandTimer;
            }

            const c = g.app.windowList[this.frameIndex].c;

            let value: any = undefined;
            const p = p_node ? p_node : c.p;

            if (p.__eq__(c.p)) {
                this._setupRefresh(w_fromOutline, { tree: true, body: true, documents: true, buttons: true, states: true });
                this._insertAndSetHeadline(p_newHeadline, p_asChild); // no need for re-selection
            } else {
                const old_p = c.p;  // c.p is old already selected
                c.selectPosition(p); // p is now the new one to be operated on
                this._insertAndSetHeadline(p_newHeadline, p_asChild);
                // Only if 'keep' old position was needed (specified with a p_node parameter), and old_p still exists
                if (!!p_node && c.positionExists(old_p)) {
                    // no need to refresh body
                    this._setupRefresh(w_fromOutline, { tree: true, documents: true, buttons: true, states: true });
                    c.selectPosition(old_p);
                } else {
                    this._setupRefresh(w_fromOutline, { tree: true, body: true, documents: true, buttons: true, states: true });
                }
            }
            if (this.trace) {
                if (this.lastCommandTimer) {
                    console.log('lastCommandTimer', utils.getDurationMs(this.lastCommandTimer));
                }
            }
            this.lastCommandTimer = undefined;
            this.launchRefresh();
            return Promise.resolve(value);
        });
    }

    /**
     * * Perform insert and rename commands
     */
    private _insertAndSetHeadline(p_name?: string, p_asChild?: boolean): any {
        const LEOCMD = Constants.LEO_COMMANDS;
        const w_command = p_asChild ? LEOCMD.INSERT_CHILD_PNODE : LEOCMD.INSERT_PNODE;
        const c = g.app.windowList[this.frameIndex].c;
        const u = c.undoer;
        let value: any = c.doCommandByName(w_command);
        if (!p_name) {
            return value;
        }
        const undoData = u.beforeChangeHeadline(c.p);
        c.setHeadString(c.p, p_name);  // Set v.h *after* calling the undoer's before method.
        if (!c.changed) {
            c.setChanged();
        }
        u.afterChangeHeadline(c.p, 'Edit Headline', undoData);
        return value;
    }

    /**
     * * Invoke an '@button' click directly by index string. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was clicked
     * @returns Promises that resolves when done
     */
    public clickAtButton(p_node: LeoButtonNode): Thenable<unknown> {

        this._setupRefresh(false, {
            tree: true,
            body: true,
            documents: true,
            buttons: true,
            states: true
        });

        vscode.window.showInformationMessage('TODO: Implement clickAtButton ' + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Show input window to select
     */
    private _handleRClicks(p_rclicks: any[], topLevelName?: string): Thenable<any> {
        // private _handleRClicks(p_rclicks: RClick[], topLevelName?: string): Thenable<ChooseRClickItem> {
        /* 
        const w_choices: ChooseRClickItem[] = [];
        let w_index = 0;
        if (topLevelName) {
            w_choices.push(
                { label: topLevelName, picked: true, alwaysShow: true, index: w_index++ }
            );
        }
        w_choices.push(
            ...p_rclicks.map((p_rclick): ChooseRClickItem => { return { label: p_rclick.name, index: w_index++, rclick: p_rclick }; })
        );

        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.CHOOSE_BUTTON
        };
        return vscode.window.showQuickPick(w_choices, w_options).then((p_picked) => {
            if (p_picked) {
                this._rclickSelected.push(p_picked.index);
                if (topLevelName && p_picked.index === 0) {
                    return Promise.resolve(p_picked);
                }
                if (p_picked.rclick && p_picked.rclick.children && p_picked.rclick.children.length) {
                    return this._handleRClicks(p_picked.rclick.children);
                } else {
                    return Promise.resolve(p_picked);
                }
            }
            // Escaped
            return Promise.reject();
        });
        */
        return Promise.resolve();
    }
    /**
     * * Finds and goes to the script of an at-button. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was right-clicked
     * @returns the launchRefresh promise started after it's done finding the node
     */
    public gotoScript(p_node: LeoButtonNode): Promise<boolean> {
        return Promise.resolve(true);
        /* 
        return this._isBusyTriggerSave(false)
            .then((p_saveResult) => {
                return this.sendAction(
                    Constants.LEOBRIDGE.GOTO_SCRIPT,
                    JSON.stringify({ index: p_node.button.index })
                );
            })
            .then((p_gotoScriptResult: LeoBridgePackage) => {
                return this.sendAction(Constants.LEOBRIDGE.DO_NOTHING);
            })
            .then((p_package) => {
                // refresh and reveal selection
                this.launchRefresh({ tree: true, body: true, states: true, buttons: false, documents: false }, false, p_package.node);
                return Promise.resolve(true); // TODO launchRefresh should be a returned promise
            });
        */
    }
    /**
     * * Removes an '@button' from Leo's button dict, directly by index string. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was chosen to remove
     * @returns Thenable that resolves when done
     */
    public removeAtButton(p_node: LeoButtonNode): Thenable<unknown> {

        this._setupRefresh(false, { buttons: true });

        vscode.window.showInformationMessage('TODO: Implement removeAtButton ' + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public replaceClipboardWith(s: string): Thenable<void> {
        this.clipboardContents = s; // also set immediate clipboard string
        return vscode.env.clipboard.writeText(s);
    }

    public asyncGetTextFromClipboard(): Thenable<string> {
        return vscode.env.clipboard.readText().then((s) => {
            // also set immediate clipboard string for possible future read
            this.clipboardContents = s;
            return this.getTextFromClipboard();
        });
    }

    /**
     * Returns clipboard content
    */
    public getTextFromClipboard(): string {
        return this.clipboardContents;
    }

    /**
     * Opens the Nav tab and focus on nav text input
     */
    public findQuick(p_string?: string): Thenable<unknown> {
        let w_panelID = '';
        let w_panel: vscode.WebviewView | undefined;
        if (this._lastTreeView === this._leoTreeExView) {
            w_panelID = Constants.FIND_EXPLORER_ID;
            w_panel = this._findPanelWebviewExplorerView;
        } else {
            w_panelID = Constants.FIND_ID;
            w_panel = this._findPanelWebviewView;
        }
        vscode.commands.executeCommand(w_panelID + '.focus').then((p_result) => {
            if (w_panel && w_panel.show && !w_panel.visible) {
                w_panel.show(false);
            }
            const w_message: { [key: string]: string } = { type: 'selectNav' };
            if (p_string && p_string?.trim()) {
                w_message["text"] = p_string.trim();
            }
            w_panel?.webview.postMessage(w_message);
        });
        return Promise.resolve();
    }

    /**
     * Opens the Nav tab with the selected text as the search string
     */
    public findQuickSelected(): Thenable<unknown> {
        if (vscode.window.activeTextEditor) {
            const editor = vscode.window.activeTextEditor;
            const selection = editor.selection;
            if (!selection.isEmpty) {
                const text = editor.document.getText(selection);
                return this.findQuick(text);
            }
        }
        return this.findQuick();
    }

    /**
     * Lists all nodes in reversed gnx order, newest to oldest
     */
    public findQuickTimeline(): Thenable<unknown> {
        // return this.sendAction(Constants.LEOBRIDGE.FIND_QUICK_TIMELINE)
        //     .then((p_result: LeoBridgePackage) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         return this.findQuickGoAnywhere(); // Finish by opening and focussing nav pane
        //     });
        return vscode.window.showInformationMessage("TODO: findQuickTimeline");
    }

    /**
     * Lists all nodes that are changed (aka "dirty") since last save.
     */
    public findQuickChanged(): Thenable<unknown> {
        // return this.sendAction(Constants.LEOBRIDGE.FIND_QUICK_CHANGED)
        //     .then((p_result: LeoBridgePackage) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         return this.findQuickGoAnywhere(); // Finish by opening and focussing nav pane
        //     });
        return vscode.window.showInformationMessage("TODO: findQuickChanged");

    }

    /**
     * Lists nodes from c.nodeHistory.
     */
    public findQuickHistory(): Thenable<unknown> {
        // return this.sendAction(Constants.LEOBRIDGE.FIND_QUICK_HISTORY)
        //     .then((p_result: LeoBridgePackage) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         return this.findQuickGoAnywhere(); // Finish by opening and focussing nav pane
        //     });
        return vscode.window.showInformationMessage("TODO: findQuickHistory");

    }

    /**
     * List all marked nodes.
     */
    public findQuickMarked(): Thenable<unknown> {
        // return this.sendAction(Constants.LEOBRIDGE.FIND_QUICK_MARKED)
        //     .then((p_result: LeoBridgePackage) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         return this.findQuickGoAnywhere(); // Finish by opening and focussing nav pane
        //     });
        return vscode.window.showInformationMessage("TODO: findQuickMarked");

    }

    /**
     * Opens goto and focus in depending on passed options
     */
    public findQuickGoAnywhere(p_options?: { preserveFocus?: boolean }): Thenable<unknown> {
        let w_panel = "";

        if (this._lastTreeView === this._leoTreeExView) {
            w_panel = Constants.GOTO_EXPLORER_ID;
        } else {
            w_panel = Constants.GOTO_ID;
        }

        vscode.commands.executeCommand(w_panel + '.focus', p_options);

        return Promise.resolve();
    }

    public gotoNavEntry(p_node: LeoGotoNode): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: gotoNavEntry");

        // if (p_node.entryType === 'tag') {

        //     return this._isBusyTriggerSave(false, true)
        //         .then((p_saveResult) => {

        //             let w_string: string = p_node.label as string;

        //             let w_panelID = '';
        //             let w_panel: vscode.WebviewView | undefined;
        //             if (this._lastTreeView === this._leoTreeExView) {
        //                 w_panelID = Constants.FIND_EXPLORER_ID;
        //                 w_panel = this._findPanelWebviewExplorerView;
        //             } else {
        //                 w_panelID = Constants.FIND_ID;
        //                 w_panel = this._findPanelWebviewView;
        //             }
        //             vscode.commands.executeCommand(w_panelID + '.focus').then((p_result) => {
        //                 if (w_panel && w_panel.show && !w_panel.visible) {
        //                     w_panel.show(false);
        //                 }
        //                 const w_message: { [key: string]: string } = { type: 'selectNav' };
        //                 if (w_string && w_string?.trim()) {
        //                     w_message["text"] = w_string.trim();
        //                 }
        //                 return w_panel!.webview.postMessage(w_message);
        //             }).then(() => {
        //                 // Do search
        //                 setTimeout(() => {
        //                     this.sendAction(
        //                         Constants.LEOBRIDGE.NAV_SEARCH
        //                     ).then((p_package) => {
        //                         this._leoGotoProvider.refreshTreeRoot();
        //                         this.findQuickGoAnywhere({ preserveFocus: true }); // show but dont change focus
        //                         return p_package;
        //                     });
        //                 }, 10);

        //             });
        //         });

        // }

        // // Was not a tag
        // if (p_node.entryType !== 'generic' && p_node.entryType !== 'parent') {
        //     return this._isBusyTriggerSave(false, true)
        //         .then((p_saveResult) => {
        //             return this.sendAction(
        //                 Constants.LEOBRIDGE.GOTO_NAV_ENTRY,
        //                 JSON.stringify({ key: p_node.key })
        //             );
        //         })
        //         .then((p_navEntryResult: LeoBridgePackage) => {
        //             if (!p_navEntryResult.focus) {
        //                 vscode.window.showInformationMessage('Not found');
        //             } else {
        //                 let w_focusOnOutline = false;
        //                 const w_focus = p_navEntryResult.focus.toLowerCase();

        //                 if (w_focus.includes('tree') || w_focus.includes('head')) {
        //                     // tree
        //                     w_focusOnOutline = true;
        //                 }
        //                 this.launchRefresh(
        //                     {
        //                         tree: true,
        //                         body: true,
        //                         scroll: !w_focusOnOutline,
        //                         documents: false,
        //                         buttons: false,
        //                         states: true,
        //                     },
        //                     w_focusOnOutline
        //                 );
        //             }
        //         });
        // }
        // return Promise.resolve();
    }
    /**
     * * Capture instance for further calls on find panel webview
     * @param p_panel The panel (usually that got the latest onDidReceiveMessage)
     */
    public setFindPanel(p_panel: vscode.WebviewView): void {
        if (this._lastTreeView === this._leoTreeExView) {
            this._findPanelWebviewExplorerView = p_panel;
        } else {
            this._findPanelWebviewView = p_panel;
        }
    }


    public navEnter(): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: navEnter");

        // return this._isBusyTriggerSave(false, true).then(() => {

        //     return this.sendAction(
        //         Constants.LEOBRIDGE.NAV_SEARCH
        //     ).then((p_package) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         this.findQuickGoAnywhere({ preserveFocus: true }); // show but dont change focus
        //         return p_package;
        //     });

        // });

    }

    public navTextChange(): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: navTextChange");

        // return this._isBusyTriggerSave(false, true).then(() => {

        //     return this.sendAction(
        //         Constants.LEOBRIDGE.NAV_HEADLINE_SEARCH
        //     ).then((p_package) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         this.findQuickGoAnywhere({ preserveFocus: true }); // show but dont change focus
        //         return p_package;
        //     });

        // });

    }

    /**
     * * Opens the find panel and selects all & focuses on the find field.
     */
    public startSearch(): void {
        let w_panelID = '';
        let w_panel: vscode.WebviewView | undefined;
        if (this._lastTreeView === this._leoTreeExView) {
            w_panelID = Constants.FIND_EXPLORER_ID;
            w_panel = this._findPanelWebviewExplorerView;
        } else {
            w_panelID = Constants.FIND_ID;
            w_panel = this._findPanelWebviewView;
        }
        vscode.commands.executeCommand(w_panelID + '.focus').then((p_result) => {
            if (w_panel && w_panel.show && !w_panel.visible) {
                w_panel.show(false);
            }
            w_panel?.webview.postMessage({ type: 'selectFind' });
        });
    }

    /**
     * * Get a find pattern string input from the user
     * @param p_replace flag for doing a 'replace' instead of a 'find'
     * @returns Promise of string or undefined if cancelled
     */
    private _inputFindPattern(p_replace?: boolean): Thenable<string | undefined> {
        return vscode.window.showInputBox({
            title: p_replace ? "Replace with" : "Search for",
            prompt: p_replace ? "Type text to replace with and press enter." : "Type text to search for and press enter.",
            placeHolder: p_replace ? "Replace pattern here" : "Find pattern here",
        });
    }

    /**
     * * Find next / previous commands
     * @param p_fromOutline
     * @param p_reverse
     * @returns Promise that resolves when the "launch refresh" is started
     */
    public find(p_fromOutline: boolean, p_reverse: boolean): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: find");

        // const w_action: string = p_reverse
        //     ? Constants.LEOBRIDGE.FIND_PREVIOUS
        //     : Constants.LEOBRIDGE.FIND_NEXT;
        // return this._isBusyTriggerSave(false, true)
        //     .then((p_saveResult) => {
        //         return this.sendAction(w_action, JSON.stringify({ fromOutline: !!p_fromOutline }));
        //     })
        //     .then((p_findResult: LeoBridgePackage) => {
        //         if (!p_findResult.found || !p_findResult.focus) {
        //             vscode.window.showInformationMessage('Not found');
        //         } else {
        //             let w_focusOnOutline = false;
        //             const w_focus = p_findResult.focus.toLowerCase();
        //             if (w_focus.includes('tree') || w_focus.includes('head')) {
        //                 // tree
        //                 w_focusOnOutline = true;
        //             }
        //             this.launchRefresh(
        //                 {
        //                     tree: true,
        //                     body: true,
        //                     scroll: p_findResult.found && !w_focusOnOutline,
        //                     documents: false,
        //                     buttons: false,
        //                     states: true,
        //                 },
        //                 w_focusOnOutline
        //             );
        //         }
        //     });
    }

    /**
     * * find-var or find-def commands
     * @param p_def find-def instead of find-var
     * @returns Promise that resolves when the "launch refresh" is started
     */
    public findSymbol(p_def: boolean): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: findSymbol");

        // const w_action: string = p_def
        //     ? Constants.LEOBRIDGE.FIND_DEF
        //     : Constants.LEOBRIDGE.FIND_VAR;
        // return this._isBusyTriggerSave(false, true)
        //     .then((p_saveResult) => {
        //         return this.sendAction(w_action, JSON.stringify({ fromOutline: false }));
        //     })
        //     .then((p_findResult: LeoBridgePackage) => {
        //         if (!p_findResult.found || !p_findResult.focus) {
        //             vscode.window.showInformationMessage('Not found');
        //         } else {
        //             let w_focusOnOutline = false;
        //             const w_focus = p_findResult.focus.toLowerCase();
        //             if (w_focus.includes('tree') || w_focus.includes('head')) {
        //                 // tree
        //                 w_focusOnOutline = true;
        //             }
        //             this.loadSearchSettings();
        //             this.launchRefresh(
        //                 {
        //                     tree: true,
        //                     body: true,
        //                     scroll: p_findResult.found && !w_focusOnOutline,
        //                     documents: false,
        //                     buttons: false,
        //                     states: true,
        //                 },
        //                 w_focusOnOutline
        //             );
        //         }
        //     });
    }

    /**
     * * Replace / Replace-Then-Find commands
     * @param p_fromOutline
     * @param p_thenFind
     * @returns Promise that resolves when the "launch refresh" is started
     */
    public replace(p_fromOutline: boolean, p_thenFind: boolean): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: replace");

        // const w_action: string = p_thenFind
        //     ? Constants.LEOBRIDGE.REPLACE_THEN_FIND
        //     : Constants.LEOBRIDGE.REPLACE;
        // return this._isBusyTriggerSave(false, true)
        //     .then((p_saveResult) => {
        //         return this.sendAction(w_action, JSON.stringify({ fromOutline: !!p_fromOutline }));
        //     })
        //     .then((p_replaceResult: LeoBridgePackage) => {
        //         if (!p_replaceResult.found || !p_replaceResult.focus) {
        //             vscode.window.showInformationMessage('Not found');
        //         } else {
        //             let w_focusOnOutline = false;
        //             const w_focus = p_replaceResult.focus.toLowerCase();
        //             if (w_focus.includes('tree') || w_focus.includes('head')) {
        //                 // tree
        //                 w_focusOnOutline = true;
        //             }
        //             this.launchRefresh(
        //                 {
        //                     tree: true,
        //                     body: true,
        //                     scroll: true,
        //                     documents: false,
        //                     buttons: false,
        //                     states: true,
        //                 },
        //                 w_focusOnOutline
        //             );
        //         }
        //     });
    }

    /**
     * * Find / Replace All
     * @returns Promise of LeoBridgePackage from execution or undefined if cancelled
     */
    public findAll(p_replace: boolean): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: findAll");

        // const w_action: string = p_replace
        //     ? Constants.LEOBRIDGE.REPLACE_ALL
        //     : Constants.LEOBRIDGE.FIND_ALL;

        // let w_searchString: string = this._lastSettingsUsed!.findText;
        // let w_replaceString: string = this._lastSettingsUsed!.replaceText;

        // return this._isBusyTriggerSave(false, true)
        //     .then((p_saveResult) => {
        //         return this._inputFindPattern()
        //             .then((p_findString) => {
        //                 if (!p_findString) {
        //                     return true; // Cancelled with escape or empty string.
        //                 }
        //                 w_searchString = p_findString;
        //                 if (p_replace) {
        //                     return this._inputFindPattern(true).then((p_replaceString) => {
        //                         if (p_replaceString === undefined) {
        //                             return true;
        //                         }
        //                         w_replaceString = p_replaceString;
        //                         return false;
        //                     });
        //                 }
        //                 return false;
        //             });
        //     })
        //     .then((p_cancelled: boolean) => {
        //         if (this._lastSettingsUsed && !p_cancelled) {
        //             this._lastSettingsUsed.findText = w_searchString;
        //             this._lastSettingsUsed.replaceText = w_replaceString;
        //             this.saveSearchSettings(this._lastSettingsUsed); // No need to wait, will be stacked.
        //             return this.sendAction(w_action)
        //                 .then((p_findResult: LeoBridgePackage) => {
        //                     let w_focusOnOutline = false;
        //                     const w_focus = p_findResult.focus!.toLowerCase();
        //                     if (w_focus.includes('tree') || w_focus.includes('head')) {
        //                         // tree
        //                         w_focusOnOutline = true;
        //                     }
        //                     this.loadSearchSettings();
        //                     this.launchRefresh(
        //                         { tree: true, body: true, documents: false, buttons: false, states: true },
        //                         w_focusOnOutline
        //                     );
        //                 });
        //         }
        //     });
    }

    /**
     * * Clone Find All / Marked / Flattened
     * @param p_marked flag for finding marked nodes
     * @param p_flat flag to get flattened results
     * @returns Promise of LeoBridgePackage from execution or undefined if cancelled
     */
    public cloneFind(p_marked: boolean, p_flat: boolean): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: cloneFind");

        // let w_searchString: string = this._lastSettingsUsed!.findText;
        // let w_action: string;
        // if (p_marked) {
        //     w_action = p_flat
        //         ? Constants.LEOBRIDGE.CLONE_FIND_FLATTENED_MARKED
        //         : Constants.LEOBRIDGE.CLONE_FIND_MARKED;
        // } else {
        //     w_action = p_flat
        //         ? Constants.LEOBRIDGE.CLONE_FIND_ALL_FLATTENED
        //         : Constants.LEOBRIDGE.CLONE_FIND_ALL;
        // }

        // if (p_marked) {
        //     // don't use find methods.
        //     return this.nodeCommand({
        //         action: w_action,
        //         node: undefined,
        //         refreshType: { tree: true, body: true, states: true },
        //         fromOutline: false,
        //     }) || Promise.resolve();
        // }

        // return this._isBusyTriggerSave(false, true)
        //     .then(() => {
        //         return this._inputFindPattern()
        //             .then((p_findString) => {
        //                 if (!p_findString) {
        //                     return true; // Cancelled with escape or empty string.
        //                 }
        //                 w_searchString = p_findString;
        //                 return false;
        //             });
        //     })
        //     .then((p_cancelled: boolean) => {
        //         if (this._lastSettingsUsed && !p_cancelled) {
        //             this._lastSettingsUsed.findText = w_searchString;
        //             this.saveSearchSettings(this._lastSettingsUsed); // No need to wait, will be stacked.
        //             return this.sendAction(w_action)
        //                 .then((p_cloneFindResult: LeoBridgePackage) => {
        //                     let w_focusOnOutline = false;
        //                     const w_focus = p_cloneFindResult.focus!.toLowerCase();
        //                     if (w_focus.includes('tree') || w_focus.includes('head')) {
        //                         // tree
        //                         w_focusOnOutline = true;
        //                     }
        //                     this.loadSearchSettings();
        //                     this.launchRefresh(
        //                         { tree: true, body: true, documents: false, buttons: false, states: true },
        //                         w_focusOnOutline
        //                     );
        //                 });
        //         }
        //     });
    }

    /**
     * * Set search setting in the search webview
     * @param p_id string id of the setting name
     */
    public setSearchSetting(p_id: string): void {
        this._findPanelWebviewExplorerView!.webview.postMessage({ type: 'setSearchSetting', id: p_id });
        this._findPanelWebviewView!.webview.postMessage({ type: 'setSearchSetting', id: p_id });
    }

    /**
     * * Gets the search settings from Leo, and applies them to the find panel webviews
     */
    public loadSearchSettings(): void {
        vscode.window.showInformationMessage("TODO: loadSearchSettings");

        // this.sendAction(Constants.LEOBRIDGE.GET_SEARCH_SETTINGS).then(
        //     (p_result: LeoBridgePackage) => {
        //         const w_searchSettings: LeoGuiFindTabManagerSettings = p_result.searchSettings!;
        //         const w_settings: LeoSearchSettings = {
        //             isTag: w_searchSettings.is_tag,
        //             navText: w_searchSettings.nav_text,
        //             showParents: w_searchSettings.show_parents,
        //             searchOptions: w_searchSettings.search_options,
        //             //Find/change strings...
        //             findText: w_searchSettings.find_text,
        //             replaceText: w_searchSettings.change_text,
        //             // Find options...
        //             wholeWord: w_searchSettings.whole_word,
        //             ignoreCase: w_searchSettings.ignore_case,
        //             regExp: w_searchSettings.pattern_match,
        //             markFinds: w_searchSettings.mark_finds,
        //             markChanges: w_searchSettings.mark_changes,
        //             searchHeadline: w_searchSettings.search_headline,
        //             searchBody: w_searchSettings.search_body,
        //             // 0, 1 or 2 for outline, sub-outline, or node.
        //             searchScope:
        //                 0 +
        //                 (w_searchSettings.suboutline_only ? 1 : 0) +
        //                 (w_searchSettings.node_only ? 2 : 0),
        //         };
        //         if (w_settings.searchScope > 2) {
        //             console.error('searchScope SHOULD BE 0, 1, 2 only: ', w_settings.searchScope);
        //         }
        //         this._lastSettingsUsed = w_settings;
        //         if (this._findPanelWebviewExplorerView) {
        //             this._findPanelWebviewExplorerView.webview.postMessage({
        //                 type: 'setSettings',
        //                 value: w_settings,
        //             });
        //         }
        //         if (this._findPanelWebviewView) {
        //             this._findPanelWebviewView.webview.postMessage({
        //                 type: 'setSettings',
        //                 value: w_settings,
        //             });
        //         }
        //     }
        // );
    }

    /**
     * * Send the settings to the Leo Bridge Server
     * @param p_settings the search settings to be set server side to affect next results
     * @returns the promise from the server call
     */
    public saveSearchSettings(p_settings: LeoSearchSettings): Thenable<unknown> {

        return vscode.window.showInformationMessage("TODO: saveSearchSettings");

        // this._lastSettingsUsed = p_settings;
        // // convert to LeoGuiFindTabManagerSettings
        // const w_settings: LeoGuiFindTabManagerSettings = {
        //     // Nav settings
        //     is_tag: p_settings.isTag,
        //     nav_text: p_settings.navText,
        //     show_parents: p_settings.showParents,
        //     search_options: p_settings.searchOptions,
        //     // Find/change strings...
        //     find_text: p_settings.findText,
        //     change_text: p_settings.replaceText,
        //     // Find options...
        //     ignore_case: p_settings.ignoreCase,
        //     mark_changes: p_settings.markChanges,
        //     mark_finds: p_settings.markFinds,
        //     node_only: !!(p_settings.searchScope === 2),
        //     pattern_match: p_settings.regExp,
        //     search_body: p_settings.searchBody,
        //     search_headline: p_settings.searchHeadline,
        //     suboutline_only: !!(p_settings.searchScope === 1),
        //     whole_word: p_settings.wholeWord,
        // };
        // return this.sendAction(
        //     Constants.LEOBRIDGE.SET_SEARCH_SETTINGS,
        //     JSON.stringify({ searchSettings: w_settings })
        // );
    }

    /**
     * * Goto Global Line
     */
    public gotoGlobalLine(): void {
        vscode.window.showInformationMessage("TODO: gotoGlobalLine");

        // this.triggerBodySave(false)
        //     .then((p_saveResult: boolean) => {
        //         return vscode.window.showInputBox({
        //             title: Constants.USER_MESSAGES.TITLE_GOTO_GLOBAL_LINE,
        //             placeHolder: Constants.USER_MESSAGES.PLACEHOLDER_GOTO_GLOBAL_LINE,
        //             prompt: Constants.USER_MESSAGES.PROMPT_GOTO_GLOBAL_LINE,
        //         });
        //     })
        //     .then((p_inputResult?: string) => {
        //         if (p_inputResult) {
        //             const w_line = parseInt(p_inputResult);
        //             if (!isNaN(w_line)) {
        //                 this.sendAction(
        //                     Constants.LEOBRIDGE.GOTO_GLOBAL_LINE,
        //                     JSON.stringify({ line: w_line })
        //                 ).then((p_resultGoto: LeoBridgePackage) => {
        //                     if (!p_resultGoto.found) {
        //                         // Not found
        //                     }
        //                     this.launchRefresh(
        //                         {
        //                             tree: true,
        //                             body: true,
        //                             documents: false,
        //                             buttons: false,
        //                             states: true,
        //                         },
        //                         false
        //                     );
        //                 });
        //             }
        //         }
        //     });
    }

    /**
     * * Tag Children
     */
    public tagChildren(): void {
        vscode.window.showInformationMessage("TODO: tagChildren");

        // this.triggerBodySave(false)
        //     .then((p_saveResult: boolean) => {
        //         return vscode.window.showInputBox({
        //             title: Constants.USER_MESSAGES.TITLE_TAG_CHILDREN,
        //             placeHolder: Constants.USER_MESSAGES.PLACEHOLDER_TAG,
        //             prompt: Constants.USER_MESSAGES.PROMPT_TAG,
        //         });
        //     })
        //     .then((p_inputResult?: string) => {
        //         if (p_inputResult && p_inputResult.trim()) {
        //             p_inputResult = p_inputResult.trim();
        //             // check for special chars first
        //             if (p_inputResult.split(/(&|\||-|\^)/).length > 1) {
        //                 vscode.window.showInformationMessage('Cannot add tags containing any of these characters: &|^-');
        //                 return;
        //             }
        //             this.sendAction(
        //                 Constants.LEOBRIDGE.TAG_CHILDREN,
        //                 JSON.stringify({ tag: p_inputResult })
        //             ).then((p_resultTag: LeoBridgePackage) => {
        //                 this.launchRefresh(
        //                     {
        //                         tree: true,
        //                         body: false,
        //                         documents: false,
        //                         buttons: false,
        //                         states: true,
        //                     },
        //                     false
        //                 );
        //             });
        //         }
        //     });
    }

    /**
     * * Tag Node
     */
    public tagNode(): void {
        vscode.window.showInformationMessage("TODO: tagNode");

        // this.triggerBodySave(false)
        //     .then((p_saveResult: boolean) => {
        //         return vscode.window.showInputBox({
        //             title: Constants.USER_MESSAGES.TITLE_TAG_NODE,
        //             placeHolder: Constants.USER_MESSAGES.PLACEHOLDER_TAG,
        //             prompt: Constants.USER_MESSAGES.PROMPT_TAG,
        //         });
        //     })
        //     .then((p_inputResult?: string) => {

        //         if (p_inputResult && p_inputResult.trim()) {
        //             p_inputResult = p_inputResult.trim();
        //             // check for special chars first
        //             if (p_inputResult.split(/(&|\||-|\^)/).length > 1) {
        //                 vscode.window.showInformationMessage('Cannot add tags containing any of these characters: &|^-');
        //                 return;
        //             }
        //             this.sendAction(
        //                 Constants.LEOBRIDGE.TAG_NODE,
        //                 JSON.stringify({ tag: p_inputResult })
        //             ).then((p_resultTag: LeoBridgePackage) => {
        //                 this.launchRefresh(
        //                     {
        //                         tree: true,
        //                         body: false,
        //                         documents: false,
        //                         buttons: false,
        //                         states: true,
        //                     },
        //                     false
        //                 );
        //             });
        //         }
        //     });
    }

    /**
     * * Remove single Tag on selected node
     */
    public removeTag(): void {
        vscode.window.showInformationMessage("TODO: removeTag");

        // if (this.lastSelectedNode && this.lastSelectedNode.u &&
        //     this.lastSelectedNode.u.__node_tags && this.lastSelectedNode.u.__node_tags.length) {
        //     this.triggerBodySave(false)
        //         .then((p_saveResult: boolean) => {
        //             return vscode.window.showQuickPick(this.lastSelectedNode!.u.__node_tags, {
        //                 title: Constants.USER_MESSAGES.TITLE_REMOVE_TAG,
        //                 placeHolder: Constants.USER_MESSAGES.PLACEHOLDER_TAG,
        //                 canPickMany: false
        //                 // prompt: Constants.USER_MESSAGES.PROMPT_TAG,
        //             });
        //         })
        //         .then((p_inputResult?: string) => {
        //             if (p_inputResult && p_inputResult.trim()) {
        //                 this.sendAction(
        //                     Constants.LEOBRIDGE.REMOVE_TAG,
        //                     JSON.stringify({ tag: p_inputResult.trim() })
        //                 ).then((p_resultTag: LeoBridgePackage) => {
        //                     this.launchRefresh(
        //                         {
        //                             tree: true,
        //                             body: false,
        //                             documents: false,
        //                             buttons: false,
        //                             states: true,
        //                         },
        //                         false
        //                     );
        //                 });
        //             }
        //         });
        // } else if (this.lastSelectedNode) {
        //     vscode.window.showInformationMessage("No tags on node: " + this.lastSelectedNode.label);
        // } else {
        //     return;
        // }

    }

    /**
     * * Remove all tags on selected node
     */
    public removeTags(): void {
        vscode.window.showInformationMessage("TODO: removeTags");

        // if (this.lastSelectedNode && this.lastSelectedNode.u &&
        //     this.lastSelectedNode.u.__node_tags && this.lastSelectedNode.u.__node_tags.length) {
        //     this.triggerBodySave(false)
        //         .then((p_saveResult: boolean) => {
        //             this.sendAction(
        //                 Constants.LEOBRIDGE.REMOVE_TAGS
        //             ).then((p_resultTag: LeoBridgePackage) => {
        //                 this.launchRefresh(
        //                     {
        //                         tree: true,
        //                         body: false,
        //                         documents: false,
        //                         buttons: false,
        //                         states: true,
        //                     },
        //                     false
        //                 );
        //             });
        //         });
        // } else if (this.lastSelectedNode) {
        //     vscode.window.showInformationMessage("No tags on node: " + this.lastSelectedNode.label);
        // } else {
        //     return;
        // }
    }

    /**
     * * Clone Find Tag
     */
    public cloneFindTag(): void {
        vscode.window.showInformationMessage("TODO: cloneFindTag");

        // this.triggerBodySave(false)
        //     .then((p_saveResult: boolean) => {
        //         return vscode.window.showInputBox({
        //             title: Constants.USER_MESSAGES.TITLE_FIND_TAG,
        //             placeHolder: Constants.USER_MESSAGES.PLACEHOLDER_CLONE_FIND_TAG,
        //             prompt: Constants.USER_MESSAGES.PROMPT_CLONE_FIND_TAG,
        //         });
        //     })
        //     .then((p_inputResult?: string) => {
        //         if (p_inputResult && p_inputResult.trim()) {
        //             this.sendAction(
        //                 Constants.LEOBRIDGE.CLONE_FIND_TAG,
        //                 JSON.stringify({ tag: p_inputResult.trim() })
        //             ).then((p_resultFind: LeoBridgePackage) => {
        //                 if (!p_resultFind.found) {
        //                     // Not found
        //                 }
        //                 this.launchRefresh(
        //                     {
        //                         tree: true,
        //                         body: true,
        //                         documents: false,
        //                         buttons: false,
        //                         states: true,
        //                     },
        //                     false
        //                 );
        //             });
        //         }
        //     });
    }

    /**
    * * Creates a new Leo file
    * @returns the promise started after it's done creating the frame and commander
    */
    public async newLeoFile(): Promise<unknown> {

        this._setupRefresh(false, {
            tree: true,
            body: true,
            documents: true,
            buttons: true,
            states: true
        });

        if (!this.leoStates.fileOpenedReady) {
            if (g.app.loadManager) {
                await g.app.loadManager.openEmptyLeoFile(this);
            }
        } else {

            await this._triggerSave();


            const c = g.app.windowList[this.frameIndex].c;
            c.new(this);
        }



        this.launchRefresh();
        return Promise.resolve();
    }

    /**
    * * Close an opened Leo file
    * @returns the promise started after it's done closing the Leo document
    */
    public async closeLeoFile(): Promise<unknown> {

        await this._triggerSave();

        this._setupRefresh(false, {
            tree: true,
            body: true,
            documents: true,
            buttons: true,
            states: true
        });

        const c = g.app.windowList[this.frameIndex].c;
        await c.close();

        this.launchRefresh();
        return Promise.resolve();
    }

    /**
     * * Sets up the call to the 'open-outline' command and its possible file url parameter.
     * @param p_leoFileUri optional uri for specifying a file, if missing, a dialog will open
     * @returns A promise that resolves when done trying to open the file
     */
    public async openLeoFile(p_uri?: vscode.Uri): Promise<unknown> {
        if (p_uri) {
            console.log('OPEN p_uri', JSON.stringify(p_uri.toJSON()));
        }

        this._setupRefresh(true, {
            tree: true,
            body: true,
            states: true,
            documents: true,
            buttons: true
        });
        if (!this.leoStates.fileOpenedReady) {
            // override with given argument
            let fileName: string;

            if (p_uri && p_uri.fsPath.trim() && g.app.loadManager) {
                fileName = p_uri.fsPath.replace(/\\/g, '/');
                await g.app.loadManager.loadLocalFile(fileName, this);
            } else {
                const fileNames = await this.runOpenFileDialog(
                    undefined,
                    "Open",
                    [
                        ["Leo files", "*.leo *.db"],
                        ["Python files", "*.py"],
                        ["All files", "*"]
                    ],
                    g.defaultLeoFileExtension(),
                    false
                );
                if (fileNames && fileNames.length && g.app.loadManager) {
                    await g.app.loadManager.loadLocalFile(fileNames[0], this);
                } else {
                    return Promise.resolve();
                }
            }
        } else {
            await this._triggerSave();

            const c = g.app.windowList[this.frameIndex].c;

            await c.open_outline(p_uri);
        }

        this.launchRefresh();
        return Promise.resolve();

    }

    /**
     * * Shows the recent Leo files list, choosing one will open it
     * @returns A promise that resolves when the a file is finally opened, rejected otherwise
     */
    public showRecentLeoFiles(): Thenable<unknown> {
        vscode.window.showInformationMessage('TODO: Implement showRecentLeoFiles');

        // if shown, chosen and opened
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Asks for file name and path, then saves the Leo file
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns a promise from saving the file results.
     */
    public async saveAsLeoFile(p_fromOutline?: boolean): Promise<unknown> {
        await this._triggerSave();

        const c = g.app.windowList[this.frameIndex].c;

        this._setupRefresh(!!p_fromOutline, {
            tree: true,
            states: true,
            documents: true
        });

        await c.saveAs();

        this.launchRefresh();
        return Promise.resolve();
    }

    /**
     * * Asks for .leojs file name and path, then saves the JSON Leo file
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns a promise from saving the file results.
     */
    public async saveAsLeoJsFile(p_fromOutline?: boolean): Promise<unknown> {
        await this._triggerSave();

        const c = g.app.windowList[this.frameIndex].c;

        this._setupRefresh(!!p_fromOutline, {
            tree: true,
            states: true,
            documents: true
        });

        await c.save_as_leojs();

        this.launchRefresh();
        return Promise.resolve();
    }

    /**
     * * Invokes the commander.save() command
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns Promise that resolves when the save command is done
     */
    public async saveLeoFile(p_fromOutline?: boolean): Promise<unknown> {
        await this._triggerSave();

        const c = g.app.windowList[this.frameIndex].c;

        this._setupRefresh(!!p_fromOutline, {
            tree: true,
            states: true,
            documents: true
        });

        await c.save();

        this.launchRefresh();
        return Promise.resolve();
    }

    /**
     * * Show switch document 'QuickPick' dialog and switch file if selection is made, or just return if no files are opened.
     * @returns A promise that resolves with a textEditor of the selected node's body from the newly selected document
     */
    public switchLeoFile(): Thenable<unknown> {

        vscode.window.showInformationMessage('TODO: Implement switchLeoFile');

        // vscode.window.showQuickPick(w_entries, w_pickOptions);
        //     then
        // return Promise.resolve(this.selectOpenedLeoDocument(p_chosenDocument.value));

        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Switches Leo document directly by index number. Used by document treeview and switchLeoFile command.
     * @param p_index position of the opened Leo document in the document array
     * @returns A promise that resolves with a textEditor of the selected node's body from the newly opened document
     */
    public selectOpenedLeoDocument(p_index: number, p_fromOutline?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, {
            tree: true,
            body: true,
            buttons: true,
            states: true,
            documents: true
        });

        this.frameIndex = p_index;

        this.launchRefresh();

        // if selected and opened
        return Promise.resolve(true);
    }

    /**
     * * Makes sure the body now reflects the selected node.
     * This is called after 'selectTreeNode', or after '_gotSelection' when refreshing.
     * @param p_node Node that was just selected
     * @param p_aside Flag to indicate opening 'Aside' was required
     * @param p_showBodyKeepFocus Flag used to keep focus where it was instead of forcing in body
     * @param p_force_open Flag to force opening the body pane editor
     * @returns a text editor of the p_node parameter's gnx (As 'leo' file scheme)
     */
    private _tryApplyNodeToBody(
        p_node: Position,
        p_aside: boolean,
        p_showBodyKeepFocus: boolean,
        p_force_open?: boolean
    ): Thenable<vscode.TextEditor> {
        // console.log('try to apply node -> ', p_node.gnx);

        // this.lastSelectedNode = p_node; // Set the 'lastSelectedNode' this will also set the 'marked' node context
        // this._commandStack.newSelection(); // Signal that a new selected node was reached and to stop using the received selection as target for next command

        // if (this._bodyTextDocument) {
        //     // if not first time and still opened - also not somewhat exactly opened somewhere.
        //     if (
        //         !this._bodyTextDocument.isClosed &&
        //         !this._locateOpenedBody(p_node.gnx) // LOCATE NEW GNX
        //     ) {
        //         // if needs switching by actually having different gnx
        //         if (utils.leoUriToStr(this.bodyUri) !== p_node.gnx) {
        //             this._locateOpenedBody(utils.leoUriToStr(this.bodyUri)); // * LOCATE OLD GNX FOR PROPER COLUMN*
        //             return this._bodyTextDocument.save().then(() => {
        //                 return this._switchBody(p_node.gnx, p_aside, p_showBodyKeepFocus);
        //             });
        //         }
        //     }
        // } else {
        //     // first time?
        //     this.bodyUri = utils.strToLeoUri(p_node.gnx);
        // }
        // return this.showBody(p_aside, p_showBodyKeepFocus);
        return Promise.resolve(vscode.window.activeTextEditor!); // TODO : TEMP
    }

    /**
    * * Opens an an editor for the currently selected node: "this.bodyUri". If already opened, this just 'reveals' it
    * @param p_aside Flag for opening the editor beside any currently opened and focused editor
    * @param p_preserveFocus flag that when true will stop the editor from taking focus once opened
    */
    public showBody(p_aside: boolean, p_preserveFocus?: boolean): Thenable<vscode.TextEditor | undefined> {
        const w_showOptions: vscode.TextDocumentShowOptions = p_aside ?
            {
                viewColumn: vscode.ViewColumn.Beside,
                preserveFocus: p_preserveFocus, // an optional flag that when true will stop the editor from taking focus
                preview: true // should text document be in preview only? set false for fully opened
                // selection is instead set when the GET_BODY_STATES above resolves
            } : {
                viewColumn: this._bodyMainSelectionColumn ? this._bodyMainSelectionColumn : 1, // view column in which the editor should be shown
                preserveFocus: p_preserveFocus, // an optional flag that when true will stop the editor from taking focus
                preview: false // should text document be in preview only? set false for fully opened
                // selection is instead set when the GET_BODY_STATES above resolves
            };

        // TODO : THIS IS PLACEHOLDER CODE
        if (this._bodyTextDocument) {
            return vscode.window.showTextDocument(this._bodyTextDocument, w_showOptions);
        } else {
            console.log('showBody: no _bodyTextDocument set to show');

            return Promise.resolve(undefined);
        }
    }

    /**
     * * Closes any body pane opened in this vscode window instance
     */
    public closeBody(): void {
        // TODO : CLEAR UNDO HISTORY AND FILE HISTORY for this.bodyUri !
        if (this.bodyUri) {
            vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', this.bodyUri.path);
        }
        vscode.window.visibleTextEditors.forEach(p_textEditor => {
            if (p_textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
                vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', p_textEditor.document.uri.path);
                if (p_textEditor.hide) {
                    p_textEditor.hide();
                }
            }
        });
    }

    /**
     * * Adds a message string to leoInteg's log pane. Used when leoBridge receives an async 'log' command.
     * @param p_message The string to be added in the log
     */
    public addLogPaneEntry(p_message: string): void {
        this._leoLogPane.appendLine(p_message);
    }

    /**
     * * Reveals the log pane if not already visible
     */
    public showLogPane(): Thenable<unknown> {
        if (this._leoLogPane) {
            this._leoLogPane.show(true); // Just show, so use flag to preserve focus
            return Promise.resolve(true);
        } else {
            return Promise.resolve(undefined); // if cancelled
        }
    }

    /**
     * Show info window about requiring leoID to start
     * and a button to perform the 'set leoID' command.
     */
    public showLeoIDMessage(): void {
        vscode.window.showInformationMessage(
            Constants.USER_MESSAGES.SET_LEO_ID_MESSAGE,
            Constants.USER_MESSAGES.ENTER_LEO_ID
        ).then(p_chosenButton => {
            if (p_chosenButton === Constants.USER_MESSAGES.ENTER_LEO_ID) {
                vscode.commands.executeCommand(Constants.COMMANDS.SET_LEO_ID);
            }
        });
    }

    public ensure_commander_visible(c: Commands): void {
        // TODO !
        console.log("TODO ensure_commander_visible");
    }

    /**
     * * Command to get the LeoID from dialog, save it to user settings.
     * Start leojs if the ID is valid, and not already started.
     */
    public setLeoIDCommand(): void {
        utils.getIdFromDialog().then((p_id) => {
            p_id = p_id.trim();
            p_id = g.app.cleanLeoID(p_id, '');
            if (p_id && p_id.length >= 3 && utils.isAlphaNumeric(p_id)) {
                // valid id: set in config settings
                this.setIdSetting(p_id);
            } else {
                // Canceled or invalid: (re)warn user.
                this.showLeoIDMessage();
            }
        });
    }

    /**
     * * Returns the leoID from the leojs settings
     */
    public getIdFromSetting(): string {
        return this.config.leoID;
    }

    /**
     * * Sets the leoID setting for immediate use, and in next activation
     */
    public setIdSetting(p_leoID: string): Promise<unknown> {
        const w_changes: ConfigSetting[] = [{
            code: "leoID",
            value: p_leoID
        }];
        g.app.leoID = p_leoID;
        if (g.app.nodeIndices) {
            g.app.nodeIndices.defaultId = p_leoID;
            g.app.nodeIndices.userId = p_leoID;
        }
        return this.config.setLeojsSettings(w_changes);
    }

    public runAboutLeoDialog(
        c: Commands,
        version: string,
        theCopyright: string,
        url: string, // UNUSED FOR NOW
        email: string // UNUSED FOR NOW
    ): Thenable<unknown> {
        return vscode.window.showInformationMessage(
            version,
            {
                modal: true,
                detail: theCopyright
            });
    }

    public runAskOkDialog(
        c: Commands,
        title: string,
        message: string,
        buttonText?: string
    ): Thenable<unknown> {
        return vscode.window.showInformationMessage(
            title,
            {
                modal: true,
                detail: message
            });
    }

    public runAskYesNoDialog(
        c: Commands,
        title: string,
        message: string

    ): Thenable<string> {
        return vscode.window
            .showInformationMessage(
                title,
                {
                    modal: true,
                    detail: message
                },
                Constants.USER_MESSAGES.YES,
                Constants.USER_MESSAGES.NO
            )
            .then((answer) => {
                if (answer === Constants.USER_MESSAGES.YES) {
                    return Constants.USER_MESSAGES.YES.toLowerCase();
                } else {
                    return Constants.USER_MESSAGES.NO.toLowerCase();
                }
            });
    }

    public runAskYesNoCancelDialog(
        c: Commands,
        title: string,
        message: string

    ): Thenable<string> {
        return vscode.window
            .showInformationMessage(
                title,
                {
                    modal: true,
                    detail: message
                },
                Constants.USER_MESSAGES.YES,
                Constants.USER_MESSAGES.NO
                // Already shows a 'cancel' 
            )
            .then((answer) => {
                if (answer === Constants.USER_MESSAGES.YES) {
                    return Constants.USER_MESSAGES.YES.toLowerCase();
                } else if (answer === Constants.USER_MESSAGES.NO) {
                    return Constants.USER_MESSAGES.NO.toLowerCase();
                } else {
                    return Constants.USER_MESSAGES.CANCEL.toLowerCase();
                }
            });
    }

    public runOpenFileDialog(
        c: Commands | undefined,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        multiple?: boolean
    ): Thenable<string[]> {
        // convert to { [name: string]: string[] } typing
        const types: { [name: string]: string[] } = utils.convertLeoFiletypes(filetypes);
        return vscode.window.showOpenDialog(
            {
                title: title,
                canSelectMany: !!multiple,
                filters: types
            }
        ).then((p_uris) => {
            const names: string[] = [];
            if (p_uris && p_uris.length) {
                p_uris.forEach(w_uri => {
                    names.push(w_uri.fsPath);
                });
            }
            //return p_uris || [];
            return names;
        });
    }

    public runSaveFileDialog(
        c: Commands | undefined,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
    ): Thenable<string> {
        // convert to { [name: string]: string[] } typing
        const types: { [name: string]: string[] } = utils.convertLeoFiletypes(filetypes);
        return vscode.window.showSaveDialog(
            {
                title: title,
                filters: types
            }
        ).then((p_uri) => {
            if (p_uri) {
                console.log('CHOSE SAVE URI');
                console.log('SAVE fsPath: ' + JSON.stringify(p_uri.fsPath));
                console.log('SAVE json: ' + JSON.stringify(p_uri.toJSON()));
                console.log('SAVE toString: ' + p_uri.toString());
                console.log('test path: ' + path.normalize(p_uri.path));


                return p_uri.fsPath;
            } else {
                return "";
            }
        });
    }

}

/**
 * Null gui class.
 */
export class NullGui {

    private clipboardContents: string = "";
    public preventRefresh: boolean = false;
    public isNullGui: boolean = true;

    public launchRefresh(): void { }

    public replaceClipboardWith(s: string): Thenable<void> {
        this.clipboardContents = s; // also set immediate clipboard string
        return Promise.resolve();
    }

    public asyncGetTextFromClipboard(): Thenable<string> {
        return Promise.resolve(this.clipboardContents);
    }

    public getTextFromClipboard(): string {
        return this.clipboardContents;
    }

    public getFullVersion(): string {
        return "LeoJS NullGui";
    }

    public addLogPaneEntry(...args: any[]): void {
        console.log('NullGui:', ...args);
    }

    public runAboutLeoDialog(
        c: Commands,
        version: string,
        theCopyright: string,
        url: string,
        email: string
    ): Thenable<unknown> {
        return Promise.resolve("");
    }

    public runOpenFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        multiple?: boolean
    ): Thenable<string[]> {
        return Promise.resolve([]);
    }

    public runSaveFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
    ): Thenable<string> {
        return Promise.resolve("");
    }

    public runAskOkDialog(
        c: Commands,
        title: string,
        message: string,
        buttonText?: string
    ): Thenable<unknown> {
        return Promise.resolve("");
    }

    public runAskYesNoDialog(
        c: Commands,
        title: string,
        message: string
    ): Thenable<string> {
        return Promise.resolve("");
    }

    public runAskYesNoCancelDialog(
        c: Commands,
        title: string,
        message: string
    ): Thenable<string> {
        return Promise.resolve("");
    }

    public showLeoIDMessage(): void {
        vscode.window.showInformationMessage(
            "Leo ID not found. Please enter an id that identifies you uniquely.",
            "Set Leo ID"
        ).then(p_chosenButton => {
            if (p_chosenButton === "Set Leo ID") {
                vscode.commands.executeCommand(Constants.COMMANDS.SET_LEO_ID);
            }
        });
    }

    public setIdSetting(p_id: string): void { };

    public getIdFromSetting(): string {
        return "";
    }

    public getIdFromDialog(): Thenable<string> {
        return Promise.resolve("");
    }

    public ensure_commander_visible(c: Commands): void {
    }

    public isTextWidget(w: any): boolean {
        return false;
    }

    public isTextWrapper(w: any): boolean {
        return false;
    }
}

