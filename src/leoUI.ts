import * as vscode from "vscode";
import { Utils as uriUtils } from "vscode-uri";
import { debounce } from "lodash";
import * as path from 'path';

import * as utils from "./utils";
import * as commandBindings from "./commandBindings";
import { Constants } from "./constants";
import {
    RevealType,
    Icon,
    ReqRefresh,
    LeoPackageStates,
    ConfigSetting,
    LeoSearchSettings,
    Focus,
    BodySelectionInfo,
    CommandOptions,
    LeoGotoNavKey,
    LeoGuiFindTabManagerSettings
} from "./types";

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
import { LeoGotoNode, LeoGotoProvider } from "./leoGoto";
import { LeoFrame } from "./core/leoFrame";
import { LeoFindPanelProvider } from "./leoFindPanelWebview";
import { ISettings } from "./core/leoFind";
import { NullGui } from "./core/leoGui";

/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI extends NullGui {
    // * State flags
    public leoStates: LeoStates;
    public verbose: boolean = true;
    public trace: boolean = false; //true;

    private _minibufferHistory: string[] = [];
    private _currentOutlineTitle: string = Constants.GUI.TREEVIEW_TITLE; // VScode's outline pane title: Might need to be re-set when switching visibility
    private _hasShownContextOpenMessage: boolean = false;

    // * Timers
    public refreshTimer: [number, number] | undefined; // until the selected node is found - even if already started refresh
    public lastRefreshTimer: [number, number] | undefined; // until the selected node is found - refreshed even if not found
    public commandRefreshTimer: [number, number] | undefined; // until the selected node is found -  keep if starting a new command already pending
    public lastCommandRefreshTimer: [number, number] | undefined; // until the selected node is found - refreshed if starting a new command
    public commandTimer: [number, number] | undefined; // until the command done - keep if starting a new one already pending
    public lastCommandTimer: [number, number] | undefined; // until the command done - refreshed if starting a new one

    // * Configuration Settings Service
    public config: Config; // Public configuration service singleton, used in leoSettingsWebview, leoBridge, and leoNode for inverted contrast

    // * Icon Paths (Singleton static arrays)
    public nodeIcons: Icon[] = [];
    public undoIcons: Icon[] = [];
    public documentIcons: Icon[] = [];
    public buttonIcons: Icon[] = [];
    public gotoIcons: Icon[] = [];

    // * Refresh Cycle
    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh
    private _revealType: RevealType = RevealType.NoReveal; // Type of reveal for the selected node (when refreshing outline)
    private _preventShowBody = false; // Used when refreshing treeview from config: It requires not to open the body pane when refreshing.
    private _focusInterrupt: boolean = false; // Flag for preventing setting focus when interrupting (canceling) an 'insert node' text input dialog with another one

    // * Commands stack finishing resolving "refresh flags", for type of refresh after finishing stack
    public finalFocus: Focus = Focus.NoChange; // Set in _setupRefresh : Last command issued had focus on outline, as opposed to the body
    public showBodyIfClosed: boolean = false;
    public showOutlineIfClosed: boolean = false;

    private __refreshNode: Position | undefined; // Set in _setupRefresh : Last command issued a specific node to reveal
    private _lastRefreshNodeTS: number = 0;
    get _refreshNode(): Position | undefined {
        return this.__refreshNode;
    }
    set _refreshNode(p_ap: Position | undefined) {
        // Needs undefined type because it cannot be set in the constructor
        this.__refreshNode = p_ap;
        this._lastRefreshNodeTS = utils.performanceNow();
    }

    // * Outline Pane
    private _leoTreeProvider!: LeoOutlineProvider; // TreeDataProvider single instance
    private _leoTreeView!: vscode.TreeView<Position>; // Outline tree view added to the Tree View Container with an Activity Bar icon
    private _leoTreeExView!: vscode.TreeView<Position>; // Outline tree view added to the Explorer Sidebar
    private _lastTreeView!: vscode.TreeView<Position>; // Last visible treeview

    private _revealNodeRetriedRefreshOutline: boolean = false; // USED IN _refreshOutline and _revealNode

    private _lastSelectedNode: Position | undefined;
    private _lastSelectedNodeTS: number = 0;
    get lastSelectedNode(): Position | undefined {
        return this._lastSelectedNode;
    }
    set lastSelectedNode(p_ap: Position | undefined) {
        // Needs undefined type because it cannot be set in the constructor
        this._lastSelectedNode = p_ap;
        this._lastSelectedNodeTS = utils.performanceNow();
    }

    // * Find panel
    private _leoFindPanelProvider!: vscode.WebviewViewProvider;
    private _findPanelWebviewView: vscode.WebviewView | undefined;
    private _findPanelWebviewExplorerView: vscode.WebviewView | undefined;
    private _lastFindView: vscode.WebviewView | undefined;  // ? Maybe unused ?
    private _findNeedsFocus: boolean = false;
    private _lastSettingsUsed: LeoSearchSettings | undefined; // Last settings loaded / saved for current document

    // * Documents Pane
    private _leoDocumentsProvider!: LeoDocumentsProvider;
    private _leoDocuments!: vscode.TreeView<LeoFrame>;
    private _leoDocumentsExplorer!: vscode.TreeView<LeoFrame>;
    private _lastLeoDocuments: vscode.TreeView<LeoFrame> | undefined;

    // * Goto nav panel
    private _leoGotoProvider!: LeoGotoProvider;
    private _leoGoto!: vscode.TreeView<LeoGotoNode>;
    private _leoGotoExplorer!: vscode.TreeView<LeoGotoNode>;

    // * '@button' pane
    private _leoButtonsProvider!: LeoButtonsProvider;
    private _leoButtons!: vscode.TreeView<LeoButtonNode>;
    private _leoButtonsExplorer!: vscode.TreeView<LeoButtonNode>;
    private _lastLeoButtons: vscode.TreeView<LeoButtonNode> | undefined;

    // * Undos pane
    private _leoUndosProvider!: LeoUndosProvider;
    private _leoUndos!: vscode.TreeView<LeoUndoNode>;
    private _leoUndosShown = false;
    private _leoUndosExplorer!: vscode.TreeView<LeoUndoNode>;
    private _leoUndosExplorerShown = false;
    private _lastLeoUndos: vscode.TreeView<LeoUndoNode> | undefined;

    // * Body pane
    private _bodyFileSystemStarted: boolean = false;
    private _bodyEnablePreview: boolean = true;
    private _leoFileSystem!: LeoBodyProvider; // as per https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api
    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.
    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _languageFlagged: string[] = [];

    private _bodyPreviewMode: boolean = true;

    private _editorTouched: boolean = false; // Flag for applying editor changes to body when 'icon' state change and 'undo' back to untouched

    private _bodyStatesTimer: NodeJS.Timeout | undefined;

    public preventIconChange: boolean = false; // Prevent refresh outline to keep selected node icon

    private _bodyUri: vscode.Uri = utils.strToLeoUri("");
    get bodyUri(): vscode.Uri {
        return this._bodyUri;
    }
    set bodyUri(p_uri: vscode.Uri) {
        this._leoFileSystem.setNewBodyUriTime(p_uri);
        this._bodyUri = p_uri;
    }

    // * Selection & scroll
    private _selectionDirty: boolean = false; // Flag set when cursor selection is changed
    private _selectionGnx: string = ''; // Packaged into 'BodySelectionInfo' structures, sent to Leo
    private _selection: vscode.Selection | undefined; // also packaged into 'BodySelectionInfo'
    private _scrollDirty: boolean = false; // Flag set when cursor selection is changed
    private _scrollGnx: string = '';
    private _scroll: vscode.Range | undefined;

    // * Settings / Welcome webview
    // public leoSettingsWebview: LeoSettingsProvider; // TODO !

    // * Log Pane
    private _leoLogPane: vscode.OutputChannel;

    // * Status Bar
    // private _leoStatusBar: LeoStatusBar; // TODO !

    // * Edit/Insert Headline Input Box options instance, setup so clicking outside cancels the headline change
    private _headlineInputOptions: vscode.InputBoxOptions = {
        ignoreFocusOut: false,
        value: '',
        valueSelection: undefined,
        prompt: '',
    };

    // * Timing
    private _needLastSelectedRefresh = false; // USED IN showBody
    private _bodyLastChangedDocument: vscode.TextDocument | undefined; // Only set in _onDocumentChanged
    private _bodyLastChangedDocumentSaved: boolean = true; // don't use 'isDirty' of the document!

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public getStates: (() => void);

    // * Debounced method used to set the outline tree title
    public setTreeViewTitle: (() => void);

    // * Debounced method used to get opened Leo Files for the documents pane
    public refreshDocumentsPane: (() => void);

    // * Debounced method used to get content of the at-buttons pane
    public refreshButtonsPane: (() => void);

    // * Debounced method used to get content of the goto pane
    public refreshGotoPane: (() => void);

    // * Debounced method used to get content of the undos pane
    public refreshUndoPane: (() => void);

    // * Debounced method used to set focused element of the undos pane
    public setUndoSelection: ((p_node: LeoUndoNode) => void);

    // * Debounced method for refreshing the UI
    public launchRefresh: (() => void);

    constructor(guiName = 'vscodeGui', private _context: vscode.ExtensionContext) {
        super(guiName);
        this.isNullGui = false;

        // * Log pane instanciation
        this._leoLogPane = vscode.window.createOutputChannel(Constants.GUI.LOG_PANE_TITLE);
        this._context.subscriptions.push(this._leoLogPane);

        // * Setup States
        this.leoStates = new LeoStates(_context, this);

        // * Get configuration settings
        this.config = new Config(_context, this);

        // * Set required vscode configs if needed
        this.config.checkEnablePreview(true);
        this.config.checkCloseEmptyGroups(true);

        // * also check workbench.editor.enablePreview
        this.config.buildFromSavedSettings();
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // * Build Icon filename paths
        this.nodeIcons = utils.buildNodeIconPaths(_context);
        this.undoIcons = utils.buildUndoIconPaths(_context);
        this.documentIcons = utils.buildDocumentIconPaths(_context);
        this.buttonIcons = utils.buildButtonsIconPaths(_context);
        this.gotoIcons = utils.buildGotoIconPaths(_context);

        // * Debounced refresh flags and UI parts, other than the tree and body, when operation(s) are done executing
        this.getStates = debounce(
            this._triggerGetStates,
            Constants.STATES_DEBOUNCE_DELAY
        );
        this.setTreeViewTitle = debounce(
            this._setTreeViewTitle,
            Constants.TITLE_DEBOUNCE_DELAY
        );
        this.refreshDocumentsPane = debounce(
            this._refreshDocumentsPane,
            Constants.DOCUMENTS_DEBOUNCE_DELAY
        );
        this.refreshButtonsPane = debounce(
            this._refreshButtonsPane,
            Constants.BUTTONS_DEBOUNCE_DELAY
        );
        this.refreshGotoPane = debounce(
            this._refreshGotoPane,
            Constants.GOTO_DEBOUNCE_DELAY
        );
        this.refreshUndoPane = debounce(
            this._refreshUndoPane,
            Constants.UNDOS_DEBOUNCE_DELAY
        );
        this.setUndoSelection = debounce(
            this._setUndoSelection,
            Constants.UNDOS_REVEAL_DEBOUNCE_DELAY
        );
        this.launchRefresh = debounce(
            this._launchRefresh,
            Constants.REFRESH_DEBOUNCE_DELAY
        );

        // * Create a single data provider for both outline trees, Leo view and Explorer view
        this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons, this);

        this._leoTreeView = vscode.window.createTreeView(Constants.TREEVIEW_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._context.subscriptions.push(
            this._leoTreeView,
            this._leoTreeView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeView))),
            this._leoTreeView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeView))),
            this._leoTreeView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, false)))
        );

        this._leoTreeExView = vscode.window.createTreeView(Constants.TREEVIEW_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._context.subscriptions.push(
            this._leoTreeExView,
            this._leoTreeExView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeExView))),
            this._leoTreeExView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeExView))),
            this._leoTreeExView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, true)))
        );

        if (this.config.treeInExplorer) {
            this._lastTreeView = this._leoTreeExView;
        } else {
            this._lastTreeView = this._leoTreeView;
        }

        this.showLogPane();
    }

    /**
     * * Set all remaining local objects, set ready flag(s) and refresh all panels
     */
    public finishStartup(): void {
        g.app.windowList[this.frameIndex].startupWindow = true;

        // // * Create a single data provider for both outline trees, Leo view and Explorer view
        // this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons, this);

        // this._leoTreeView = vscode.window.createTreeView(Constants.TREEVIEW_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        // this._context.subscriptions.push(
        //     this._leoTreeView,
        //     this._leoTreeView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeView))),
        //     this._leoTreeView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeView))),
        //     this._leoTreeView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, false)))
        // );

        // this._leoTreeExView = vscode.window.createTreeView(Constants.TREEVIEW_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        // this._context.subscriptions.push(
        //     this._leoTreeExView,
        //     this._leoTreeExView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeExView))),
        //     this._leoTreeExView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeExView))),
        //     this._leoTreeExView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, true)))
        // );

        // if (this.config.treeInExplorer) {
        //     this._lastTreeView = this._leoTreeExView;
        // } else {
        //     this._lastTreeView = this._leoTreeView;
        // }

        // * Create Leo Opened Documents Treeview Providers and tree views
        this._leoDocumentsProvider = new LeoDocumentsProvider(this.leoStates, this);
        this._leoDocuments = vscode.window.createTreeView(Constants.DOCUMENTS_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._context.subscriptions.push(
            this._leoDocuments,
            this._leoDocuments.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoDocumentsExplorer = vscode.window.createTreeView(Constants.DOCUMENTS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._context.subscriptions.push(
            this._leoDocumentsExplorer,
            this._leoDocumentsExplorer.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, true)))
        );
        this._lastLeoDocuments = this._leoDocumentsExplorer;

        // * Create '@buttons' Treeview Providers and tree views
        this._leoButtonsProvider = new LeoButtonsProvider(this.leoStates, this.buttonIcons);
        this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._context.subscriptions.push(
            this._leoButtons,
            this._leoButtons.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._context.subscriptions.push(
            this._leoButtonsExplorer,
            this._leoButtonsExplorer.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, true)))
        );
        this._lastLeoButtons = this._leoButtonsExplorer;

        // * Create goto Treeview Providers and tree views
        this._leoGotoProvider = new LeoGotoProvider(this);
        this._leoGoto = vscode.window.createTreeView(Constants.GOTO_ID, { showCollapseAll: false, treeDataProvider: this._leoGotoProvider });
        this._context.subscriptions.push(
            this._leoGoto,
            this._leoGoto.onDidChangeVisibility((p_event) =>
                this._onGotoTreeViewVisibilityChanged(p_event, false)
            )
        );
        this._leoGotoExplorer = vscode.window.createTreeView(Constants.GOTO_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoGotoProvider });
        this._context.subscriptions.push(
            this._leoGotoExplorer,
            this._leoGotoExplorer.onDidChangeVisibility((p_event) =>
                this._onGotoTreeViewVisibilityChanged(p_event, true)
            )
        );

        // * Create Undos Treeview Providers and tree views
        this._leoUndosProvider = new LeoUndosProvider(this.leoStates, this, this.undoIcons);
        this._leoUndos = vscode.window.createTreeView(Constants.UNDOS_ID, { showCollapseAll: false, treeDataProvider: this._leoUndosProvider });
        this._context.subscriptions.push(
            this._leoUndos,
            this._leoUndos.onDidChangeVisibility((p_event => this._onUndosTreeViewVisibilityChanged(p_event, false)))
        );
        this._leoUndosExplorer = vscode.window.createTreeView(Constants.UNDOS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoUndosProvider });
        this._context.subscriptions.push(
            this._leoUndosExplorer,
            this._leoUndosExplorer.onDidChangeVisibility((p_event => this._onUndosTreeViewVisibilityChanged(p_event, true)))
        );
        this._lastLeoUndos = this._leoUndosExplorer;

        // * Create Body Pane
        this._leoFileSystem = new LeoBodyProvider(this);

        this._bodyMainSelectionColumn = 1;

        // * Create Status bar Entry
        // this._leoStatusBar = new LeoStatusBar(_context, this);

        // * Leo Find Panel
        this._leoFindPanelProvider = new LeoFindPanelProvider(
            this._context.extensionUri,
            this._context,
            this
        );
        this._context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                Constants.FIND_ID,
                this._leoFindPanelProvider,
                { webviewOptions: { retainContextWhenHidden: true } }
            ),
            vscode.window.registerWebviewViewProvider(
                Constants.FIND_EXPLORER_ID,
                this._leoFindPanelProvider,
                { webviewOptions: { retainContextWhenHidden: true } }
            )
        );

        // * Configuration / Welcome webview
        // this.leoSettingsWebview = new LeoSettingsProvider(_context, this);

        // * 'onDid' event detections all pushed as disposables in context.subscription
        this._context.subscriptions.push(
            // * React to change in active panel/text editor (window.activeTextEditor) - also fires when the active editor becomes undefined
            vscode.window.onDidChangeActiveTextEditor((p_editor) =>
                this._onActiveEditorChanged(p_editor)
            ),

            // * React to change in selection, cursor position and scroll position
            vscode.window.onDidChangeTextEditorSelection((p_event) =>
                this._onChangeEditorSelection(p_event)
            ),
            vscode.window.onDidChangeTextEditorVisibleRanges((p_event) =>
                this._onChangeEditorScroll(p_event)
            ),

            // * Triggers when a different text editor/vscode window changed focus or visibility, or dragged
            // This is also what triggers after drag and drop, see '_onChangeEditorViewColumn'
            vscode.window.onDidChangeTextEditorViewColumn((p_columnChangeEvent) =>
                this._changedTextEditorViewColumn(p_columnChangeEvent)
            ), // Also triggers after drag and drop
            vscode.window.onDidChangeVisibleTextEditors((p_editors) =>
                this._changedVisibleTextEditors(p_editors)
            ), // Window.visibleTextEditors changed
            vscode.window.onDidChangeWindowState((p_windowState) =>
                this._changedWindowState(p_windowState)
            ), // Focus state of the current window changes

            // * React when typing and changing body pane
            vscode.workspace.onDidChangeTextDocument((p_textDocumentChange) =>
                this._onDocumentChanged(p_textDocumentChange)
            ),

            // * React to configuration settings events
            vscode.workspace.onDidChangeConfiguration((p_configChange) =>
                this._onChangeConfiguration(p_configChange)
            ),

            // * React to opening of any file in vscode
            vscode.workspace.onDidOpenTextDocument((p_document) =>
                this._onDidOpenTextDocument(p_document)
            )
        );

        this._setupOpenedLeoDocument(); // this sets this.leoStates.fileOpenedReady 

        // * _setupOpenedLeoDocument above already does the setupRefresh below
        // this.setupRefresh(
        //     this.finalFocus,
        //     {
        //         tree: true,
        //         body: true,
        //         documents: true,
        //         buttons: true,
        //         states: true,
        //         goto: true,
        //     }
        // );

        this.leoStates.leoReady = true;
        this.leoStates.leojsStartupDone = true;

        // this.leoStates.qLastContextChange.then(() => {
        //     if (!this._lastTreeView.visible && g.app.windowList.length) {
        //         console.log('Had to reveal!');
        //         // const c = g.app.windowList[this.frameIndex].c;
        //         // this._lastTreeView.reveal(c.p, { select: true });
        //         this._setupOpenedLeoDocument(); // this sets this.leoStates.fileOpenedReady 
        //         this.launchRefresh();

        //     }
        //     // this._launchRefresh();
        //     // this.getStates();
        // });

    }

    /** 
     * Make all key and commands bindings
     */
    public makeAllBindings(): void {
        commandBindings.makeAllBindings(this, this._context);
    }

    public showSettings(): void {
        // TODO 
        vscode.window.showInformationMessage('TODO: SHOW WELCOME/SETTINGS !');
    }
    /**
     * * Adds a message string to LeoJS log pane. Used when leoBridge receives an async 'log' command.
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
     * * Hides the log pane
     */
    public hideLogPane(): void {
        this._leoLogPane.hide();
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
            this.refreshUndoPane();
        }
        // Set leoChanged and leoOpenedFilename
        const c = g.app.windowList[this.frameIndex].c;
        this.leoStates.leoChanged = c.changed;
        this.leoStates.leoOpenedFileName = c.fileName();

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
        this.lastSelectedNode = undefined;
        this._refreshOutline(false, RevealType.NoReveal);
        this.refreshDocumentsPane();
        this.refreshButtonsPane();
        this.refreshUndoPane();
        this.closeBody();
    }

    /**
     * * A Leo file was opened: setup UI accordingly.
     * @param p_openFileResult Returned info about currently opened and editing document
     * @return a promise that resolves to an opened body pane text editor
     */
    private _setupOpenedLeoDocument(): Promise<unknown> {
        this._needLastSelectedRefresh = true;

        const c = g.app.windowList[this.frameIndex].c;
        this.leoStates.leoOpenedFileName = c.fileName();
        this.leoStates.leoChanged = c.changed;

        // * Startup flag
        this.leoStates.fileOpenedReady = true;

        this._revealType = RevealType.RevealSelect; // For initial outline 'visible' event

        this.showBodyIfClosed = true;
        this.showOutlineIfClosed = true;
        this.setupRefresh(
            Focus.Body, // Original Leo seems to open itself with focus in body.
            {
                tree: true,
                body: true,
                states: true,
                buttons: true,
                documents: true,
                goto: true
            },
        );

        // * Start body pane system
        if (!this._bodyFileSystemStarted) {
            this._context.subscriptions.push(
                vscode.workspace.registerFileSystemProvider(
                    Constants.URI_LEO_SCHEME,
                    this._leoFileSystem,
                    { isCaseSensitive: true }
                )
            );
            this._bodyFileSystemStarted = true;
        }

        // this._leoStatusBar.update(true, 0, true); // todo 
        // this._leoStatusBar.show(); // Just selected a node // todo
        this.loadSearchSettings();

        return Promise.resolve(true);
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
        }, 150);
    }

    /**
     * * Handles the opening of a file in vscode, and check if it's a Leo file to suggest opening options
     * @param p_event The opened document event passed by vscode
     */
    private _onDidOpenTextDocument(p_document: vscode.TextDocument): void {
        if (
            this.leoStates.leoReady &&
            (
                p_document.uri.fsPath.toLowerCase().endsWith('.leo') ||
                p_document.uri.fsPath.toLowerCase().endsWith('.leojs')
            )
        ) {
            if (!this._hasShownContextOpenMessage) {
                vscode.window.showInformationMessage(Constants.USER_MESSAGES.RIGHT_CLICK_TO_OPEN);
                this._hasShownContextOpenMessage = true;
            }
        }
    }

    /**
     * * Handles the node expanding and collapsing interactions by the user in the treeview
     * @param p_event The event passed by vscode
     * @param p_expand True if it was an expand, false if it was a collapse event
     * @param p_treeView Pointer to the treeview itself, either the standalone treeview or the one under the explorer
     */
    private _onChangeCollapsedState(p_event: vscode.TreeViewExpansionEvent<Position>, p_expand: boolean, p_treeView: vscode.TreeView<Position>): void {

        // * Expanding or collapsing via the treeview interface selects the node to mimic Leo.
        this.triggerBodySave(true); // Get any modifications from the editor into the Leo's body model
        if (p_treeView.selection.length && p_treeView.selection[0] && p_treeView.selection[0].__eq__(p_event.element)) {
            // * This happens if the tree selection is the same as the expanded/collapsed node: Just have Leo do the same
            // pass
        } else {
            // * This part only happens if the user clicked on the arrow without trying to select the node
            if (this.config.leoTreeBrowse) {
                // * This part only happens if the user clicked on the arrow without trying to select the node
                this._revealNode(p_event.element, { select: true, focus: false }); // No force focus : it breaks collapse/expand when direct parent
                this.selectTreeNode(p_event.element, true); // not waiting for a .then(...) so not to add any lag
            }
        }

        // * vscode will update its tree by itself, but we need to change Leo's model of its outline
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
        if (!this.leoStates.leoReady || !this.leoStates.leojsStartupDone || !this.leoStates.fileOpenedReady) {
            return;
        }
        if (p_event.visible) {
            this._lastTreeView = p_explorerView ? this._leoTreeExView : this._leoTreeView;
            this.setTreeViewTitle();
            this._needLastSelectedRefresh = true; // Its a new node in a new tree so refresh lastSelectedNode too
            if (this.leoStates.fileOpenedReady) {
                this.loadSearchSettings();
            }
            this._refreshOutline(true, RevealType.RevealSelect);
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
     * * Handle the change of visibility of either goto treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onGotoTreeViewVisibilityChanged(
        p_event: vscode.TreeViewVisibilityChangeEvent,
        p_explorerView: boolean
    ): void {

        // if (p_explorerView) {
        // } // (Facultative/unused) Do something different if explorer view is used
        // if (p_event.visible) {
        //     this._leoGotoProvider.setLastGotoView(p_explorerView ? this._leoGotoExplorer : this._leoGoto);
        //     // this.refreshGotoPane();  // No need to refresh because no selection needs to be set
        // }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onUndosTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
        if (p_event.visible) {
            if (p_explorerView) {
                this._lastLeoUndos = this._leoUndosExplorer;
                if (this._leoUndosExplorerShown) {
                    this._leoUndosProvider.refreshTreeRoot(); // Already shown, will redraw but not re-select
                }
                this._leoUndosExplorerShown = true; // either way set it
            } else {
                this._lastLeoUndos = this._leoUndos;
                if (this._leoUndosShown) {
                    this._leoUndosProvider.refreshTreeRoot(); // Already shown, will redraw but not re-select
                }
                this._leoUndosShown = true; // either way set it
            }
        }
    }

    /**
     * * Handle the change of visibility of either find panel
     * @param p_event The visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onFindViewVisibilityChanged(p_explorerView: boolean): void {
        // * todo
        // if (p_explorerView) {
        //     if (this._findPanelWebviewExplorerView?.visible) {
        //         this._lastFindView = this._findPanelWebviewExplorerView;
        //         this.checkForceFindFocus(false);
        //     }

        // } else {
        //     if (this._findPanelWebviewView?.visible) {
        //         this._lastFindView = this._findPanelWebviewView;
        //         this.checkForceFindFocus(false);

        //     }
        // }
    }

    /**
     * * Handles detection of the active editor having changed from one to another, or closed
     * @param p_editor The editor itself that is now active
     * @param p_internalCall Flag used to signify the it was called voluntarily by LeoJS itself
     */
    private _onActiveEditorChanged(
        p_editor: vscode.TextEditor | undefined,
        p_internalCall?: boolean
    ): void {
        if (p_editor && p_editor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
            if (this.bodyUri.fsPath !== p_editor.document.uri.fsPath) {
                this._hideDeleteBody(p_editor);
            }
            this._checkPreviewMode(p_editor);
        }
        if (!p_internalCall) {
            this.triggerBodySave(true); // Save in case edits were pending
        }
        // todo : Bring back status bar item?
        // // * Status flag check
        // if (!p_editor && this._leoStatusBar.statusBarFlag) {
        //     return;
        //     // this._leoStatusBar.update(false);
        // }
        // // * Status flag check
        // setTimeout(() => {
        //     if (vscode.window.activeTextEditor) {
        //         this._leoStatusBar.update(
        //             vscode.window.activeTextEditor.document.uri.scheme === Constants.URI_LEO_SCHEME
        //         );
        //     }
        // }, 0);
    }

    /**
     * * Moved a document to another column
     * @param p_columnChangeEvent  event describing the change of a text editor's view column
     */
    public _changedTextEditorViewColumn(
        p_columnChangeEvent: vscode.TextEditorViewColumnChangeEvent
    ): void {
        if (p_columnChangeEvent && p_columnChangeEvent.textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
            this._checkPreviewMode(p_columnChangeEvent.textEditor);
        }
        this.triggerBodySave(true);
    }

    /**
     * * Tabbed on another editor
     * @param p_editors text editor array (to be checked for changes in this method)
     */
    public _changedVisibleTextEditors(p_editors: readonly vscode.TextEditor[]): void {
        // todo cleanup test log
        if (p_editors && p_editors.length) {
            // console.log('editors changed visibility', p_editors[0].document, p_editors[0].document.uri.fsPath, p_editors[0].document.uri.scheme);
        }

        if (p_editors && p_editors.length) {
            // May be no changes - so check length
            p_editors.forEach((p_textEditor) => {
                if (p_textEditor && p_textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
                    if (this.bodyUri.fsPath !== p_textEditor.document.uri.fsPath) {
                        this._hideDeleteBody(p_textEditor);
                    }
                    this._checkPreviewMode(p_textEditor);
                }
            });
        }
        this.triggerBodySave(true);
    }

    /**
     * * Whole window has been minimized/restored
     * @param p_windowState the state of the window that changed
     */
    public _changedWindowState(p_windowState: vscode.WindowState): void {
        // no other action
        this.triggerBodySave(true);
    }

    /**
     * * Handles detection of the active editor's selection change or cursor position
     * @param p_event a change event containing the active editor's selection, if any.
     */
    private _onChangeEditorSelection(p_event: vscode.TextEditorSelectionChangeEvent): void {
        if (p_event.textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
            if (p_event.selections.length) {
                this._selectionDirty = true;
                this._selection = p_event.selections[0];
                this._selectionGnx = utils.leoUriToStr(p_event.textEditor.document.uri);
            }
        }
    }

    /**
     * * Handles detection of the active editor's scroll position changes
     * @param p_event a change event containing the active editor's visible range, if any.
     */
    private _onChangeEditorScroll(p_event: vscode.TextEditorVisibleRangesChangeEvent): void {
        if (p_event.textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
            if (p_event.visibleRanges.length) {
                this._scrollDirty = true;
                this._scroll = p_event.visibleRanges[0];
                this._scrollGnx = utils.leoUriToStr(p_event.textEditor.document.uri);
            }
        }
    }

    /**
     * * Handle typing, undos and read-from-file refreshes that was detected as a document change
     * @param p_textDocumentChange Text changed event passed by vscode
     */
    private _onDocumentChanged(p_textDocumentChange: vscode.TextDocumentChangeEvent): void {

        // ".length" check necessary, see https://github.com/microsoft/vscode/issues/50344
        if (
            this.lastSelectedNode &&
            p_textDocumentChange.contentChanges.length &&
            p_textDocumentChange.document.uri.scheme === Constants.URI_LEO_SCHEME
        ) {

            // * There was a on a Leo Body by the user OR FROM LEO REFRESH FROM FILE
            this._bodyLastChangedDocument = p_textDocumentChange.document;
            this._bodyLastChangedDocumentSaved = false;
            this._editorTouched = true; // To make sure to transfer content to Leo even if all undone
            this._bodyPreviewMode = false;

            // * If icon should change then do it now (if there's no document edit pending)
            if (
                utils.leoUriToStr(p_textDocumentChange.document.uri) === this.lastSelectedNode.gnx
            ) {
                const w_hasBody = !!p_textDocumentChange.document.getText().length;
                const w_iconChanged = utils.isIconChangedByEdit(this.lastSelectedNode, w_hasBody);

                if (!this.leoStates.leoChanged || w_iconChanged) {
                    if (this.preventIconChange) {
                        this.preventIconChange = false;
                    } else {
                        // Document pane icon needs refresh (changed) and/or outline icon changed
                        this._bodySaveDocument(p_textDocumentChange.document).then(() => {
                            // todo : Really saved to node, no need to set dirty or hasbody -> Check & test to see if icon changes!
                            // if (this.lastSelectedNode) {
                            //     this.lastSelectedNode.dirty = true;
                            //     this.lastSelectedNode.hasBody = w_hasBody;
                            // }
                            if (w_iconChanged) {
                                // NOT incrementing this.treeID to keep ids intact
                                // NoReveal since we're keeping the same id.
                                this._refreshOutline(false, RevealType.NoReveal);
                            }
                        });
                    }

                    if (!this.leoStates.leoChanged) {
                        // also refresh document panel (icon may be dirty now)
                        this.refreshDocumentsPane();
                    }
                }
            }

            // * If body changed a line with and '@' directive refresh body states
            let w_needsRefresh = false;
            p_textDocumentChange.contentChanges.forEach(p_contentChange => {
                if (p_contentChange.text.includes('@')) {
                    // There may have been an @
                    w_needsRefresh = true;
                }
            });

            const w_textEditor = vscode.window.activeTextEditor;

            if (w_textEditor && p_textDocumentChange.document.uri.fsPath === w_textEditor.document.uri.fsPath) {
                w_textEditor.selections.forEach(p_selection => {
                    // if line starts with @
                    let w_line = w_textEditor.document.lineAt(p_selection.active.line).text;
                    if (w_line.trim().startsWith('@')) {
                        w_needsRefresh = true;
                    }
                });
            }
            if (w_needsRefresh) {
                this.debouncedRefreshBodyStates();
            }

        }
    }

    /**
     * * Capture instance for further calls on find panel webview
     * @param p_panel The panel (usually that got the latest onDidReceiveMessage)
     */
    public setFindPanel(p_panel: vscode.WebviewView): void {
        if (p_panel.viewType === "leoFindPanelExplorer") {
            // Explorer find panel
            this._lastFindView = this._findPanelWebviewExplorerView;
            this._findPanelWebviewExplorerView = p_panel;
            this._context.subscriptions.push(
                p_panel.onDidChangeVisibility(() =>
                    this._onFindViewVisibilityChanged(true)
                ));
        } else {
            // Leo Pane find panel
            this._findPanelWebviewView = p_panel;
            this._lastFindView = this._findPanelWebviewView;
            this._context.subscriptions.push(
                p_panel.onDidChangeVisibility(() =>
                    this._onFindViewVisibilityChanged(false)
                ));
        }
        this.checkForceFindFocus(true);
    }

    /**
     * Set filename as description
     */
    public refreshDesc(): void {
        let titleDesc = "";

        if (this.leoStates.fileOpenedReady) {

            const s = this.leoStates.leoOpenedFileName;
            const w_filename = s ? utils.getFileFromPath(s) : Constants.UNTITLED_FILE_NAME;
            let w_path = "";
            const n = s ? s.lastIndexOf(w_filename) : -1;
            if (n >= 0 && n + w_filename.length >= s.length) {
                w_path = s.substring(0, n);
            }
            titleDesc = w_filename + (w_path ? " in " + w_path : '');

            if (this._leoTreeView) {
                this._leoTreeView.description = titleDesc;
            }
            if (this._leoTreeExView) {
                this._leoTreeExView.description = titleDesc;
            }
        }
        if (this._leoTreeView.description === titleDesc) {
            return;
        }
        if (this._leoTreeView) {
            this._leoTreeView.description = titleDesc;
        }
        if (this._leoTreeExView) {
            this._leoTreeExView.description = titleDesc;
        }
    }

    /**
     * * Save body to Leo if its dirty. That is, only if a change has been made to the body 'document' so far
     * @param p_forcedVsCodeSave Flag to also have vscode 'save' the content of this editor through the filesystem
     * @returns a promise that resolves when the possible saving process is finished
     */
    public triggerBodySave(p_forcedVsCodeSave?: boolean): Thenable<unknown> {
        // * Save body to Leo if a change has been made to the body 'document' so far
        let q_savePromise: Thenable<boolean>;
        if (
            this._bodyLastChangedDocument &&
            (this._bodyLastChangedDocument.isDirty || this._editorTouched) &&
            !this._bodyLastChangedDocumentSaved
        ) {
            // * Is dirty and unsaved, so proper save is in order
            const w_document = this._bodyLastChangedDocument; // backup for bodySaveDocument before reset
            this._bodyLastChangedDocumentSaved = true;
            this._editorTouched = false;
            q_savePromise = this._bodySaveDocument(w_document, p_forcedVsCodeSave);
        } else if (
            p_forcedVsCodeSave &&
            this._bodyLastChangedDocument &&
            this._bodyLastChangedDocument.isDirty &&
            this._bodyLastChangedDocumentSaved
        ) {
            // * Had 'forcedVsCodeSave' and isDirty only, so just clean up dirty VSCODE document flag.
            this._bodySaveSelection(); // just save selection if it's changed
            q_savePromise = this._bodyLastChangedDocument.save(); // ! USED INTENTIONALLY: This trims trailing spaces
        } else {
            this._bodyLastChangedDocumentSaved = true;
            this._bodySaveSelection();  // just save selection if it's changed
            q_savePromise = Promise.resolve(true);
        }
        return q_savePromise.then((p_result) => {
            return p_result;
        }, (p_reason) => {
            console.log('BodySave rejected :', p_reason);
            return false;
        });
    }

    /**
     * * Saves the cursor position along with the text selection range and scroll position
     */
    private _bodySaveSelection(): void {

        if (!this._selectionDirty || !this._selection) {
            return;
        }
        // Prepare scroll data separately

        let scroll: number;
        if (this._selectionGnx === this._scrollGnx && this._scrollDirty) {
            scroll = this._scroll?.start.line || 0;
        } else {
            scroll = 0;
        }
        const gnx = this._selectionGnx;

        const start = {
            line: this._selection.start.line || 0,
            col: this._selection.start.character || 0,
        };
        const end = {
            line: this._selection.end.line || 0,
            col: this._selection.end.character || 0,
        };
        const active = {
            line: this._selection.active.line || 0,
            col: this._selection.active.character || 0,
        };

        const c = g.app.windowList[this.frameIndex].c;
        let p: Position | undefined;
        if (c.p.gnx === gnx) {
            p = c.p;
        } else {
            // find p.
            for (let p_p of c.all_positions()) {
                if (p_p.v.gnx === gnx) {
                    p = p_p;
                    break;
                }
            }
        }
        if (!p) {
            return;
        }

        // - "ap":     An archived position for position p.
        // - "start":  The start of the selection.
        // - "end":    The end of the selection.
        // - "active": The insert point. Must be either start or end.
        // - "scroll": An optional scroll position.

        const v = p.v;
        const wrapper = c.frame.body.wrapper;
        const insert = g.convertRowColToPythonIndex(v.b, active['line'], active['col']);
        const startSel = g.convertRowColToPythonIndex(v.b, start['line'], start['col']);
        const endSel = g.convertRowColToPythonIndex(v.b, end['line'], end['col']);

        // If it's the currently selected node set the wrapper's states too
        if (p.__eq__(c.p)) {
            wrapper.setSelectionRange(startSel, endSel, insert);
            wrapper.setYScrollPosition(scroll);
        }
        // Always set vnode attrs.
        v.scrollBarSpot = scroll;
        v.insertSpot = insert;
        v.selectionStart = startSel;
        v.selectionLength = Math.abs(startSel - endSel);

        this._scrollDirty = false;
        this._selectionDirty = false;

    }

    /**
     * * Sets new body text on leo's side, and may optionally save vsCode's body editor (which will trim spaces)
     * @param p_document Vscode's text document which content will be used to be the new node's body text in Leo
     * @param p_forcedVsCodeSave Flag to also have vscode 'save' the content of this editor through the filesystem
     * @returns a promise that resolves when the complete saving process is finished
     */
    private async _bodySaveDocument(
        p_document: vscode.TextDocument,
        p_forcedVsCodeSave?: boolean
    ): Promise<boolean> {
        if (p_document) {

            const c = g.app.windowList[this.frameIndex].c;
            const u = c.undoer;
            const w_gnx = utils.leoUriToStr(p_document.uri);
            const body = p_document.getText(); // new body text

            const w_v = c.fileCommands.gnxDict[w_gnx]; // target to change
            if (w_v) {

                if (body !== w_v.b) {
                    // if different, replace body and set dirty
                    let w_p: Position | undefined;
                    if (c.p.gnx === w_v.gnx) {
                        // same gnx so it's the same position for saving the new body pane text.
                        w_p = c.p;
                    } else {
                        // find p.
                        for (let p of c.all_positions()) {
                            if (p.v.gnx === w_gnx) {
                                w_p = p;
                                break;
                            }
                        }
                    }
                    if (w_p) {
                        // ok we got a valid p.
                        const bunch = u.beforeChangeNodeContents(w_p);
                        w_p.v.setBodyString(body);
                        u.afterChangeNodeContents(w_p, "Body Text", bunch);

                        if (!c.isChanged()) {
                            c.setChanged();
                        }
                        if (!w_p.v.isDirty()) {
                            w_p.setDirty();
                        }
                    }

                }

            } else {
                console.error("ERROR SAVING BODY FROM VSCODE TO LEOJS");
            }

            // await for bodySaveSelection that is placed on the stack right after saving body
            await this._bodySaveSelection();

            this._refreshType.states = true;
            this.getStates();
            if (p_forcedVsCodeSave) {
                return p_document.save(); // ! USED INTENTIONALLY: This trims trailing spaces
            }

            return Promise.resolve(p_document.isDirty);
        } else {
            return Promise.resolve(false);
        }
    }

    /**
     * * Sets new body text on leo's side before vscode closes itself if body is dirty
     * @param p_document Vscode's text document which content will be used to be the new node's body text in Leo
     * @returns a promise that resolves when the complete saving process is finished
     */
    private _bodySaveDeactivate(
        p_document: vscode.TextDocument
    ): Thenable<unknown> {
        const w_gnx = utils.leoUriToStr(p_document.uri);
        const c = g.app.windowList[this.frameIndex].c;
        const w_v = c.fileCommands.gnxDict[w_gnx];
        if (w_v) {
            w_v.b = p_document.getText();
        }

        return Promise.resolve(true);
    }

    /**
     * * Sets the outline pane top bar string message or refreshes with existing title if no title passed
     * @param p_title new string to replace the current title
     */
    private _setTreeViewTitle(p_title?: string): void {
        const w_changed = this.leoStates.fileOpenedReady && this.leoStates.leoOpenedFileName && this.leoStates.leoChanged ? "*" : "";
        if (p_title) {
            this._currentOutlineTitle = p_title;
        }
        let w_title = this._currentOutlineTitle + w_changed;
        // * Set/Change outline pane title e.g. "INTEGRATION", "OUTLINE"
        if (this._leoTreeView && w_title !== this._leoTreeView.title) {
            this._leoTreeView.title = w_title;
        }
        w_title = Constants.GUI.EXPLORER_TREEVIEW_PREFIX + w_title;
        if (this._leoTreeExView && w_title !== this._leoTreeExView.title) {
            this._leoTreeExView.title = w_title;
        }
        this.refreshDesc();
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
     * * Setup global refresh options
     * @param p_finalFocus Flag for focus to be placed in outline
     * @param p_refreshType Refresh flags for each UI part
    */
    public setupRefresh(p_finalFocus: Focus, p_refreshType: ReqRefresh): void {
        // Set final "focus-placement" EITHER true or false
        this.finalFocus = p_finalFocus;
        // Set all properties WITHOUT clearing others.
        Object.assign(this._refreshType, p_refreshType);
    }

    /**
     * * Launches refresh for UI components and context states (Debounced)
     */
    public async _launchRefresh(): Promise<unknown> {

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

        // Consider last command finished since the refresh cycle is starting
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

        let w_revealType: RevealType;
        if (this.finalFocus.valueOf() === Focus.Outline) {
            w_revealType = RevealType.RevealSelectFocus;
        } else {
            w_revealType = RevealType.RevealSelect;
        }

        const c = g.app.windowList[this.frameIndex].c;
        this._refreshNode = c.p;

        if (
            this._refreshNode &&
            this._refreshType.body &&
            this._bodyLastChangedDocument &&
            this._bodyLastChangedDocument.isDirty
        ) {
            // When this refresh is launched with 'refresh body' requested, we need to lose any pending edits and save on vscode's side.
            // Do this only if gnx is different from what is coming from Leo in this refresh cycle.
            const w_lastChangedDocGnx = utils.leoUriToStr(this._bodyLastChangedDocument.uri);
            if (
                this._refreshNode.gnx !== w_lastChangedDocGnx && !this._bodyLastChangedDocumentSaved
            ) {
                this._bodyLastChangedDocument.save(); // Voluntarily save to 'clean' any pending body (no await)
                this._bodyLastChangedDocumentSaved = true;
            }
            if (this._refreshNode.gnx === w_lastChangedDocGnx) {
                this._leoFileSystem.preventSaveToLeo = true;
                await this._bodyLastChangedDocument.save(); // SAME GNX : so wait for it! (await)
            }
        }

        // * _focusInterrupt insertNode Override
        if (this._focusInterrupt) {
            // this._focusInterrupt = false; // TODO : Test if reverting this in _gotSelection is 'ok'
            w_revealType = RevealType.RevealSelect;
        }

        const w_showBodyNoFocus: boolean = this.finalFocus.valueOf() !== Focus.Body;

        // * Either the whole tree refreshes, or a single tree node is revealed when just navigating
        if (this._refreshType.tree) {
            this._refreshType.tree = false;
            this._refreshType.node = false; // Also clears node
            if (!this.isOutlineVisible() && !this.showOutlineIfClosed && this._refreshType.body) {
                // wont get 'gotSelectedNode so show body!
                this._refreshType.body = false;
                this._tryApplyNodeToBody(this._refreshNode || this.lastSelectedNode!, false, w_showBodyNoFocus);
            } else if (!this.isOutlineVisible() && this.showOutlineIfClosed) {
                let w_treeName;
                if (this._lastTreeView === this._leoTreeExView) {
                    w_treeName = Constants.TREEVIEW_EXPLORER_ID;
                } else {
                    w_treeName = Constants.TREEVIEW_ID;
                }
                // Reveal will trigger a native outline refresh
                this._leoTreeProvider.incTreeId();
                this._revealType = w_revealType;
                vscode.commands.executeCommand(w_treeName + '.focus');
                // } else if (!this.isOutlineVisible() && this.showOutlineIfClosed) {
                //     const c = g.app.windowList[this.frameIndex].c;
                //     this._lastTreeView.reveal(c.p, { select: true });
                // } else {
                //     this._refreshOutline(true, w_revealType);
                // }
            } else {
                this._refreshOutline(true, w_revealType);
            }
        } else if (this._refreshType.node && this._refreshNode) {
            // * Force single node "refresh" by revealing it, instead of "refreshing" it
            this._refreshType.node = false;
            this.leoStates.setSelectedNodeFlags(this._refreshNode);
            let w_showOutline = this.isOutlineVisible();
            if (!this.isOutlineVisible() && this.showOutlineIfClosed) {
                this.showOutlineIfClosed = false;
                w_showOutline = true;
            }
            this._revealNode(
                this._refreshNode,
                {
                    select: true,
                    focus: w_showOutline
                }
            );
            if (this._refreshType.body) {
                // * if no outline visible, just update body pane as needed
                if (!this.isOutlineVisible()) {
                    this._refreshType.body = false;
                    this._tryApplyNodeToBody(this._refreshNode, false, w_showBodyNoFocus);
                }
            }
        } else if (this._refreshType.body) {
            this._refreshType.body = false;
            this._tryApplyNodeToBody(this._refreshNode || this.lastSelectedNode!, false, w_showBodyNoFocus);
        }

        // * DEBUG INFO

        // console.log('***********************finished refresh');
        // console.log('**** c.config should be lowercase: ', c.config.new_leo_file_encoding);
        // // @ts-expect-error
        // console.log('**** g.app.config should be uppercase: ', g.app.config.new_leo_file_encoding);
        // console.log('**** c.collapse_on_lt_arrow :', c.collapse_on_lt_arrow);
        // console.log('**** c.collapse_nodes_after_move :', c.collapse_nodes_after_move);
        // console.log('**** c.sparse_move: ', c.sparse_move);

        // getStates will check if documents, buttons and states flags are set and refresh accordingly
        return this.getStates();
    }

    /**
     * * Adds 'do nothing' to the frontend stack and refreshes all parts.
     * @returns Promise back from command's execution, if added on stack, undefined otherwise.
     */
    public fullRefresh(): void {
        // Todo : Check if timeout necessary
        setTimeout(() => {
            this.setupRefresh(
                this.finalFocus,
                {
                    tree: true,
                    body: true,
                    documents: true,
                    buttons: true,
                    states: true,
                }
            );
            this.launchRefresh();
        }, 0);
    }

    /**
     * * Checks timestamp only, if is still the latest lastReceivedNode
      * @param ts timestamp of last time
     */
    public isTsStillValid(ts: number): boolean {

        // TODO !
        // if (
        //     this._commandStack.lastReceivedNode &&
        //     this._commandStack.lastReceivedNodeTS > ts &&
        //     (this._commandStack._finalRefreshType.tree || this._commandStack._finalRefreshType.node)
        // ) {
        //     // new commandStack lastReceivedNode, is different and newer and tree/node has to refresh
        //     return false;
        // }

        // also test other sources, and check if command also not started to go back to original gnx
        // by checking if the test above only failed for gnx being the same
        if (
            this._refreshNode &&
            this._lastRefreshNodeTS > ts &&
            this._lastRefreshNodeTS < this._lastSelectedNodeTS
        ) {
            // new _refreshNode is different and newer
            return false;
        }
        if (
            this.lastSelectedNode &&
            this._lastSelectedNodeTS > ts &&
            this._lastRefreshNodeTS < this._lastSelectedNodeTS
            // this._commandStack.lastReceivedNodeTS < this._lastSelectedNodeTS // TODO !
        ) {
            // new lastSelectedNode is different and newer
            return false;
        }
        return true;
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
        try {
            if (!this.isOutlineVisible() && this.showOutlineIfClosed) {
                this.showOutlineIfClosed = false;
                // Force showing last used Leo outline first
                let w_viewName: string;
                if (this._lastTreeView === this._leoTreeExView) {
                    w_viewName = Constants.TREEVIEW_EXPLORER_ID;
                } else {
                    w_viewName = Constants.TREEVIEW_ID;
                }
                vscode.commands.executeCommand(w_viewName + ".focus").then(
                    () => {
                        this._revealNodeRetriedRefreshOutline = false;
                        this._leoTreeProvider.refreshTreeRoot();
                    },
                    (p_reason) => {
                        // Reveal failed: retry once.
                        console.log('_refreshOutline could not reveal. Rejected reason: ', p_reason);
                        this._leoTreeProvider.refreshTreeRoot();
                    }
                );

            } else {
                this.showOutlineIfClosed = false;
                // was visible, just refresh
                this._leoTreeProvider.refreshTreeRoot();
            }
        } catch (error) {
            // Also retry once on error
            console.log('_refreshOutline could not reveal. Catch Error: ', error);
            this._leoTreeProvider.refreshTreeRoot();
        }

    }

    /**
     * * 'TreeView.reveal' for any opened leo outline that is currently visible
     * @param p_leoNode The node to be revealed
     * @param p_options Options object for the revealed node to either also select it, focus it, and expand it
     * @returns Thenable from the reveal tree node action, resolves directly if no tree visible
     */
    private _revealNode(
        p_leoNode: Position,
        p_options?: { select?: boolean; focus?: boolean; expand?: boolean | number }
    ): Thenable<void> {
        let w_treeview: vscode.TreeView<Position> | undefined;
        if (this._leoTreeView.visible) {
            w_treeview = this._leoTreeView;
        }
        if (this._leoTreeExView.visible && this.config.treeInExplorer) {
            w_treeview = this._leoTreeExView;
        }
        if (!w_treeview && (this.showOutlineIfClosed || (p_options && p_options.focus))) {
            this.showOutlineIfClosed = false;
            w_treeview = this._lastTreeView;
            if (p_options) {
                p_options.focus = true;
            } else {
                p_options = {
                    focus: true,
                    select: true
                };
            }
        }
        try {
            if (w_treeview) {
                return w_treeview.reveal(p_leoNode, p_options).then(
                    () => {
                        // ok
                        this._revealNodeRetriedRefreshOutline = false;
                    },
                    (p_reason) => {
                        console.log('_revealNode could not reveal. Reason: ', p_reason);

                        if (!this._revealNodeRetriedRefreshOutline) {
                            this._revealNodeRetriedRefreshOutline = true;
                            // Reveal failed. Retry refreshOutline once
                            this._refreshOutline(true, RevealType.RevealSelect);
                        }
                    }
                );
            }

        } catch (p_error) {
            console.error("_revealNode error: ", p_error);
            // Retry refreshOutline once
            if (!this._revealNodeRetriedRefreshOutline) {
                this._revealNodeRetriedRefreshOutline = true;
                // Reveal failed. Retry refreshOutline once
                this._refreshOutline(true, RevealType.RevealSelect);
            }
        }
        return Promise.resolve(); // Defaults to resolving even if both are hidden
    }

    /**
     * * Handle selected node being created for the outline
     * @param p_node Position that was just created and detected as selected node
     */
    public gotSelectedNode(p_node: Position): void {

        const w_focusTree = (this._revealType.valueOf() >= RevealType.RevealSelectFocus.valueOf());
        const w_last = this.lastSelectedNode;

        if (
            !w_focusTree &&
            this._refreshType.scroll &&
            w_last &&
            w_last.__eq__(p_node) && // utils.isApEqual(w_last, p_node) &&
            this._lastTreeView &&
            this._lastTreeView.visible

        ) {
            // ! MINIMAL TIMEOUT REQUIRED ! WHY ?? (works so leave)
            setTimeout(() => {
                // SAME with scroll information specified
                this.showBody(false, this.finalFocus.valueOf() !== Focus.Body);
            }, 25);
        } else {

            if (this._revealType) {
                setTimeout(() => {
                    this._lastTreeView.reveal(p_node, {
                        select: true,
                        focus: w_focusTree
                    }).then(() => {
                        // ok
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
                    }, (p_reason) => {
                        // Reveal failed. Retry refreshOutline once
                        this._refreshOutline(true, RevealType.RevealSelect);
                    });
                    // Done, so reset reveal type 'flag'
                    this._revealType = RevealType.NoReveal;
                }, 0);
            }

            // Apply node to body pane
            let w_showBodyNoFocus: boolean = this.finalFocus.valueOf() !== Focus.Body; // Will preserve focus where it is without forcing into the body pane if true
            if (this._focusInterrupt) {
                this._focusInterrupt = false;
                w_showBodyNoFocus = true;
            }
            if (!w_last || this._needLastSelectedRefresh) {
                // lastSelectedNode will be set in _tryApplyNodeToBody !
                this._needLastSelectedRefresh = false;
            }

            if (this._bodyTextDocument &&
                !this._bodyTextDocument.isClosed && // IS OPENED
                !this._refreshType.body && // NO NEED TO REFRESH BODY !
                this._locateOpenedBody(p_node.gnx) // DID LOCATE NEW GNX => ALREADY SHOWN!
            ) {
                // * Just make sure body selection is considered done.
                this.lastSelectedNode = p_node; // Set the 'lastSelectedNode' this will also set the 'marked' node context
                this._preventShowBody = false; // in case it was a config-changed-refresh
            } else {
                // * Actually run the normal 'APPLY NODE TO BODY' to show or switch
                this._tryApplyNodeToBody(p_node, false, w_showBodyNoFocus);
            }

            // Set context flags
            this.leoStates.setSelectedNodeFlags(p_node);
        }

    }

    /**
     * * Public method exposed as 'refreshDocumentsPane' setter/getter to refresh the documents pane
     * Document Panel May be refreshed by other services (states service, ...)
     */
    private _refreshDocumentsPane(): void {
        this._leoDocumentsProvider.refreshTreeRoot();
    }

    /**
     * * Public method exposed as 'refreshButtonsPane' setter/getter to refresh the buttons pane
     * Buttons Panel May be refreshed by other services (states service, ...)
     */
    private _refreshButtonsPane(): void {
        this._leoButtonsProvider.refreshTreeRoot();
    }

    /**
     * * Public method exposed as 'refreshGotoPane' setter/getter to refresh the Goto pane
     * Goto Panel May be refreshed by other services (states service, ...)
     */
    private _refreshGotoPane(): void {
        this._leoGotoProvider.refreshTreeRoot();
    }

    /**
     * * Refreshes the undo pane
     */
    private _refreshUndoPane(): void {
        this._leoUndosProvider.refreshTreeRoot();
    }

    /**
     * * Makes sure the body now reflects the selected node.
     * This is called after 'selectTreeNode', or after '_gotSelection' when refreshing.
     * @param p_node Node that was just selected
     * @param p_aside Flag to indicate opening 'Aside' was required
     * @param p_preventTakingFocus Flag used to keep focus where it was instead of forcing in body
     * @returns a text editor of the p_node parameter's gnx (As 'leo' file scheme). Or rejects if interrupted.
     */
    private async _tryApplyNodeToBody(
        p_node: Position,
        p_aside: boolean,
        p_preventTakingFocus: boolean,
    ): Promise<void | vscode.TextEditor> {

        this.lastSelectedNode = p_node; // Set the 'lastSelectedNode' this will also set the 'marked' node context

        // if not first time and still opened - also not somewhat exactly opened somewhere.
        if (this._bodyTextDocument &&
            !this._bodyTextDocument.isClosed &&
            !this._locateOpenedBody(p_node.gnx) // COULD NOT LOCATE NEW GNX
        ) {
            // if needs switching by actually having different gnx
            if (utils.leoUriToStr(this.bodyUri) !== p_node.gnx) {
                // * LOCATE OLD GNX FOR PROPER COLUMN
                this._locateOpenedBody(utils.leoUriToStr(this.bodyUri));
                // Make sure any pending changes in old body are applied before switching
                return this._bodyTextDocument.save().then(() => {
                    return this._switchBody(p_aside, p_preventTakingFocus);
                });
            }
        }

        // first time or no body opened
        this.bodyUri = utils.strToLeoUri(p_node.gnx);
        if (this._isBodyVisible() === 0 && !this.showBodyIfClosed) {
            return Promise.resolve();
        }
        return this.showBody(p_aside, p_preventTakingFocus);
    }

    /**
     * * Close body pane document and change the bodyUri to this.lastSelectedNode's gnx
     * This blocks 'undos' from crossing over
     * @param p_aside From 'Open Aside'.
     * @param p_preventTakingFocus prevents forcing focus on text body.
     */
    private _switchBody(
        p_aside: boolean,
        p_preventTakingFocus?: boolean
    ): Thenable<void | vscode.TextEditor> {
        const w_oldUri: vscode.Uri = this.bodyUri;
        const w_newUri: vscode.Uri = utils.strToLeoUri(this.lastSelectedNode!.gnx);
        const w_newTS = utils.performanceNow();
        const w_visibleCount = this._isBodyVisible();

        this.bodyUri = w_newUri; // New GLOBAL BODY URI

        if (w_visibleCount === 0 && !this.showBodyIfClosed) {
            return Promise.resolve();
        }

        if (w_visibleCount === 1) {
            this._bodyPreviewMode = this._isBodyPreview(); // recheck in case user double clicked on title
        }

        if (this.lastSelectedNode && this._bodyPreviewMode && this._bodyEnablePreview && w_visibleCount < 2) {

            // just show in same column and delete after
            const q_showBody = this.showBody(p_aside, p_preventTakingFocus);

            if (w_oldUri.fsPath !== this.bodyUri.fsPath) {
                q_showBody.then(() => {
                    const w_tabsToCloseFound: vscode.Tab[] = [];
                    let q_lastSecondSaveFound: Thenable<boolean> = Promise.resolve(true);
                    vscode.window.tabGroups.all.forEach((p_tabGroup) => {
                        p_tabGroup.tabs.forEach((p_tab) => {
                            if (p_tab.input &&
                                (p_tab.input as vscode.TabInputText).uri &&
                                (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME &&
                                (p_tab.input as vscode.TabInputText).uri.fsPath === w_oldUri.fsPath
                            ) {
                                // Make sure it's saved AGAIN!!
                                if (
                                    p_tab.isDirty &&
                                    this._bodyLastChangedDocument &&
                                    (p_tab.input as vscode.TabInputText).uri.fsPath === this._bodyLastChangedDocument.uri.fsPath
                                ) {
                                    console.log('LAST SECOND SAVE1!'); // TODO : CLEANUP !
                                    this._leoFileSystem.preventSaveToLeo = true;
                                    this._editorTouched = false;
                                    q_lastSecondSaveFound = this._bodyLastChangedDocument.save();
                                }
                                w_tabsToCloseFound.push(p_tab);
                            }
                        });
                    });
                    if (w_tabsToCloseFound.length) {
                        q_lastSecondSaveFound.then(() => {
                            vscode.window.tabGroups.close(w_tabsToCloseFound, true);
                        });
                    }
                    // Remove from potential 'recently opened'
                    vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', w_oldUri);

                });
            }
            return q_showBody;
        } else {
            // Close ALL LEO EDITORS first !
            const w_tabsToCloseAll: vscode.Tab[] = [];
            let q_lastSecondSaveAll: Thenable<boolean> = Promise.resolve(true);

            vscode.window.tabGroups.all.forEach((p_tabGroup) => {
                p_tabGroup.tabs.forEach((p_tab) => {
                    if (p_tab.input &&
                        (p_tab.input as vscode.TabInputText).uri &&
                        (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME &&
                        w_newUri.fsPath !== (p_tab.input as vscode.TabInputText).uri.fsPath // Maybe useless to check if different!
                    ) {

                        if (
                            p_tab.isDirty &&
                            this._bodyLastChangedDocument &&
                            (p_tab.input as vscode.TabInputText).uri.fsPath === this._bodyLastChangedDocument.uri.fsPath
                        ) {
                            console.log('LAST SECOND SAVE2!'); // TODO : CLEANUP !
                            this._leoFileSystem.preventSaveToLeo = true;
                            this._editorTouched = false;
                            q_lastSecondSaveAll = this._bodyLastChangedDocument.save();
                        }

                        w_tabsToCloseAll.push(p_tab);
                    }
                });
            });

            let q_closeAll: Thenable<unknown>;
            if (w_tabsToCloseAll.length) {
                q_closeAll = q_lastSecondSaveAll.then(() => {
                    return vscode.window.tabGroups.close(w_tabsToCloseAll, true);
                });

            } else {
                q_closeAll = Promise.resolve();
            }

            // async, so don't wait for this to finish
            if (w_oldUri.fsPath !== w_newUri.fsPath) {
                vscode.commands.executeCommand(
                    'vscode.removeFromRecentlyOpened',
                    w_oldUri
                );
            }

            return q_closeAll.then(() => {
                this._bodyPreviewMode = true;
                // * CHECK ALL 3 POSSIBLE NEW PLACES FOR BODY SWITCH AFTER q_bodyStates & q_showTextDocument
                if (
                    // Should the gnx be relevant?  !this.isGnxStillValid(w_newGnx, w_newTS)
                    !this.isTsStillValid(w_newTS)
                ) {
                    return;
                }
                return this.showBody(p_aside, p_preventTakingFocus);
            });
        }
    }

    /**
     * * Sets globals if the current body is found opened in an editor panel for a particular gnx
     * @param p_gnx gnx to match
     * @returns true if located and found, false otherwise
     */
    private _locateOpenedBody(p_gnx: string): boolean {
        let w_found = false;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    utils.leoUriToStr((p_tab.input as vscode.TabInputText).uri) === p_gnx
                ) {
                    vscode.workspace.textDocuments.forEach((p_textDocument) => {
                        if (
                            utils.leoUriToStr(p_textDocument.uri) === p_gnx
                        ) {
                            w_found = true;
                            this._bodyTextDocument = p_textDocument; // vscode.workspace.openTextDocument
                            this._bodyMainSelectionColumn = p_tab.group.viewColumn;
                        }
                    });
                }
            });
        });
        return w_found;
    }

    /**
     * * Checks for all tabs if any are 'leoBody' scheme
     * @returns total found
     */
    private _isBodyVisible(): number {
        let w_total = 0;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME
                ) {
                    w_total++;
                }
            });
        });
        return w_total;
    }

    /**
     * * Checks for all tabs if any are 'leoBody' scheme
     * @returns total found
     */
    private _isBodyPreview(): boolean {
        let w_isPreview: boolean = true;
        let w_found: boolean = false;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME
                ) {
                    w_found = true;
                    if (!p_tab.isPreview) {
                        w_isPreview = false;
                    }
                }
            });
        });
        if (w_found) {
            return w_isPreview;
        } else {
            return false;
        }
    }

    /**
     * * Checks if outline is visible
     * @returns true if either outline is visible
     */
    public isOutlineVisible(): boolean {
        return this._leoTreeExView.visible || this._leoTreeView.visible;
    }

    /**
     * * Closes non-existing text-editor body if it doesn't match bodyUri
     * @param p_textEditor the editor to close
     * @returns promise that resolves to true if it closed tabs, false if none were found
     */
    private _hideDeleteBody(p_textEditor: vscode.TextEditor): void {
        const w_foundTabs: vscode.Tab[] = [];
        const w_editorFsPath = p_textEditor.document.uri.fsPath;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME &&
                    (p_tab.input as vscode.TabInputText).uri.fsPath === w_editorFsPath &&
                    this.bodyUri.fsPath !== w_editorFsPath // if BODY is now the same, dont hide!
                ) {
                    w_foundTabs.push(p_tab);
                }
            });
        });

        // * Make sure the closed/deleted body is not remembered as vscode's recent files!
        vscode.commands.executeCommand(
            'vscode.removeFromRecentlyOpened',
            p_textEditor.document.uri
        );

        if (w_foundTabs.length) {
            vscode.window.tabGroups.close(w_foundTabs, true);
            return;
        }

        return;
    }

    /**
     * * Clears the global 'Preview Mode' flag if the given editor is not in the main body column
     * @param p_editor is the editor to check for is in the same column as the main one
     */
    private _checkPreviewMode(p_editor: vscode.TextEditor): void {
        // if selected gnx but in another column
        if (
            p_editor.document.uri.fsPath === this.bodyUri.fsPath &&
            p_editor.viewColumn !== this._bodyMainSelectionColumn
        ) {
            this._bodyPreviewMode = false;
            this._bodyMainSelectionColumn = p_editor.viewColumn;
        }
    }


    /**
     * * Closes any body pane opened in this vscode window instance
     * @returns a promise that resolves when the file is closed and removed from recently opened list
     */
    public closeBody(): Thenable<any> {

        const w_foundTabs: vscode.Tab[] = [];
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME
                ) {
                    w_foundTabs.push(p_tab);
                }
            });
        });

        let q_closedTabs;
        if (w_foundTabs.length) {
            q_closedTabs = vscode.window.tabGroups.close(w_foundTabs, true);
            w_foundTabs.forEach((p_tab) => {
                if (p_tab.input) {

                    vscode.commands.executeCommand(
                        'vscode.removeFromRecentlyOpened',
                        (p_tab.input as vscode.TabInputText).uri
                    );
                    // Delete to close all other body tabs.
                    // (w_oldUri will be deleted last below)
                    const w_edit = new vscode.WorkspaceEdit();
                    w_edit.deleteFile((p_tab.input as vscode.TabInputText).uri, { ignoreIfNotExists: true });
                    vscode.workspace.applyEdit(w_edit);
                }
            });
        } else {
            q_closedTabs = Promise.resolve(true);

        }

        let q_closedBody;
        if (this.bodyUri) {
            q_closedBody = vscode.commands.executeCommand(
                'vscode.removeFromRecentlyOpened',
                this.bodyUri
            );
        } else {
            q_closedBody = Promise.resolve(true);
        }

        return Promise.all([q_closedTabs, q_closedBody]);
    }

    /**
     * * cleanupBody closes all remaining body pane to shut down this vscode window
     * @returns a promise that resolves when done saving and closing
     */
    public cleanupBody(): Thenable<any> {
        let q_save: Thenable<any>;
        //
        if (this._bodyLastChangedDocument &&
            this._bodyLastChangedDocument.isDirty &&
            utils.leoUriToStr(this.bodyUri) === utils.leoUriToStr(this._bodyLastChangedDocument.uri)
        ) {
            q_save = this._bodySaveDeactivate(this._bodyLastChangedDocument);
        } else {
            q_save = Promise.resolve(true);
        }

        // Adding log in the chain of events
        let q_edit: Thenable<boolean>;
        if (this.bodyUri) {
            const w_edit = new vscode.WorkspaceEdit();
            w_edit.deleteFile(this.bodyUri, { ignoreIfNotExists: true });
            q_edit = vscode.workspace.applyEdit(w_edit).then(() => {
                // console.log('applyEdit done');
                return true;
            }, () => {
                // console.log('applyEdit failed');
                return false;
            });
        } else {
            q_edit = Promise.resolve(true);
        }
        Promise.all([q_save, q_edit])
            .then(() => {
                // console.log('cleaned both');
                return this.closeBody();
            }, () => {
                // console.log('cleaned both failed');
                return true;
            });

        return q_save;
    }

    /**
     * * Opens an an editor for the currently selected node: "this.bodyUri". If already opened, this just 'reveals' it
     * @param p_aside Flag for opening the editor beside any currently opened and focused editor
     * @param p_preventTakingFocus flag that when true will stop the editor from taking focus once opened
     * @returns a promise of an editor, or void if body had been changed again in the meantime.
     */
    public async showBody(p_aside: boolean, p_preventTakingFocus?: boolean): Promise<vscode.TextEditor | void> {
        const w_openedDocumentTS = utils.performanceNow();
        const w_openedDocumentGnx = utils.leoUriToStr(this.bodyUri);
        let q_saved: Thenable<unknown> | undefined;

        // First setup timeout asking for gnx file refresh in case we were resolving a refresh of type 'RefreshTreeAndBody'
        if (this._refreshType.body) {
            this._refreshType.body = false;

            if (this._bodyLastChangedDocument &&
                !this._bodyLastChangedDocument.isClosed &&
                (this._bodyLastChangedDocument.isDirty || this._editorTouched) &&
                w_openedDocumentGnx === utils.leoUriToStr(this._bodyLastChangedDocument.uri)
            ) {
                console.log('had to save so ------ fireRefreshFile !!'); // TODO : CLEANUP !

                // ! FAKE SAVE to make sure body is not dirty !
                this._leoFileSystem.preventSaveToLeo = true;
                this._editorTouched = false;
                q_saved = this._bodyLastChangedDocument.save();
            }

            if (q_saved) {
                await q_saved;
                this._leoFileSystem.fireRefreshFile(w_openedDocumentGnx);
            }

        }

        // Handle 'Config was changed -> refresh without showing body' and return
        // (because _tryApplyNodeToBody will always call showBody if outline refreshes with )
        if (this._preventShowBody) {
            this._preventShowBody = false;
            return Promise.resolve(vscode.window.activeTextEditor!);
        }

        // let w_preFoundDocOpened = false;
        // let w_preFoundTabOpened = false;
        // vscode.window.tabGroups.all.forEach((p_tabGroup) => {
        //     p_tabGroup.tabs.forEach((p_tab) => {

        //         if (p_tab.input &&
        //             (p_tab.input as vscode.TabInputText).uri &&
        //             (p_tab.input as vscode.TabInputText).uri.fsPath === this.bodyUri.fsPath) {
        //             w_preFoundTabOpened = true;
        //             vscode.workspace.textDocuments.forEach((p_textDocument) => {
        //                 if (p_textDocument.uri.fsPath === (p_tab.input as vscode.TabInputText).uri.fsPath) {
        //                     w_preFoundDocOpened = true;
        //                 }
        //             });
        //         }
        //     });
        // });


        // * Step 1 : Open the document
        const w_openedDocument = await vscode.workspace.openTextDocument(this.bodyUri);

        this._bodyTextDocument = w_openedDocument;
        let w_bodySelection: BodySelectionInfo | undefined;
        // * Set document language along with the proper cursor position, selection range and scrolling position
        if (!this._needLastSelectedRefresh) {

            // * Get the language.
            const c = g.app.windowList[this.frameIndex].c;
            const p = c.p;
            const w_gnx = c.p.gnx;

            const aList = g.get_directives_dict_list(p);
            const d = g.scanAtCommentAndAtLanguageDirectives(aList);
            let w_language =
                (d && d['language'])
                || g.getLanguageFromAncestorAtFileNode(p)
                || c.config.getLanguage('target-language')
                || 'plain';
            w_language = w_language.toLowerCase();

            // # Get the body wrap state
            const w_wrap = !!g.scanAllAtWrapDirectives(c, p);
            const tempTabWidth = g.scanAllAtTabWidthDirectives(c, p);
            const w_tabWidth: number | boolean = tempTabWidth || !!tempTabWidth;

            const insert = p.v.insertSpot;
            const start = p.v.selectionStart;
            const end = p.v.selectionStart + p.v.selectionLength;
            const scroll = p.v.scrollBarSpot;

            const row_col_pv_dict = (i: number, s: string) => {
                if (!i) {
                    i = 0; // prevent none type
                }
                // BUG: this uses current selection wrapper only, use
                // g.convertPythonIndexToRowCol instead !
                let line: number;
                let col: number;
                [line, col] = g.convertPythonIndexToRowCol(s, i);
                return { "line": line, "col": col, "index": i };
            };

            w_bodySelection = {
                "gnx": p.v.gnx,
                "scroll": scroll,
                "insert": row_col_pv_dict(insert, p.v.b),
                "start": row_col_pv_dict(start, p.v.b),
                "end": row_col_pv_dict(end, p.v.b)
            };

            // TODO : Apply tabwidth
            // console.log('TABWIDTH: ', w_tabWidth);
            // TODO : Apply Wrap. see https://github.com/microsoft/vscode/issues/136927
            // console.log('WRAP: ', w_wrap);

            // Replace language string if in 'exceptions' array
            w_language = Constants.LEO_LANGUAGE_PREFIX + (Constants.LANGUAGE_CODES[w_language] || w_language);

            let w_debugMessage = "";
            let w_needRefreshFlag = false;

            // Apply language if the selected node is still the same after all those events
            if (!w_openedDocument.isClosed) {
                // w_openedDocument still OPEN
                if (this.isTsStillValid(w_openedDocumentTS)) { // No need to check gnx of command stack){
                    // command stack last node is still valid
                    if (this.lastSelectedNode && w_openedDocumentGnx === this.lastSelectedNode.gnx) {
                        // still same gnx as this.bodyUri
                        this._setBodyLanguage(w_openedDocument, w_language);
                    } else {
                        // NOT SAME GNX!
                        w_debugMessage = "all good but not same GNX!?!";
                        w_needRefreshFlag = true;
                    }

                } else {
                    // NOT VALID : NEW NODE SELECTED SINCE THIS STARTED!
                    w_debugMessage = "New node selected since this started!";
                    w_needRefreshFlag = false;
                }

            } else {
                w_debugMessage = "w_openedDocument is CLOSED " + w_openedDocument.uri.fsPath;
                w_needRefreshFlag = false;
            }

            // * Debug Info
            // if (w_debugMessage) {
            //     console.log(w_debugMessage);
            //     console.log("w_openedDocumentGnx", w_openedDocumentGnx);
            //     console.log("this.lastSelectedNode.gnx", this.lastSelectedNode!.gnx);
            //     console.log("w_gnx", w_gnx);
            // }

            if (w_needRefreshFlag) {

                // redo apply to body!
                setTimeout(() => {
                    if (this.lastSelectedNode) {
                        this._switchBody(false, p_preventTakingFocus);
                    }
                }, 0);
                return;

            }
        }

        // Find body pane's position if already opened with same gnx (language still needs to be set per position)
        let w_foundDocOpened = false;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {

                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.fsPath === w_openedDocument.uri.fsPath) {
                    vscode.workspace.textDocuments.forEach((p_textDocument) => {
                        if (p_textDocument.uri.fsPath === (p_tab.input as vscode.TabInputText).uri.fsPath) {
                            this._bodyTextDocument = p_textDocument; // vscode.workspace.openTextDocument
                            this._bodyMainSelectionColumn = p_tab.group.viewColumn;
                            w_foundDocOpened = true;
                        }
                    });
                }
            });
        });

        // console.log('pre found TAB: ', w_preFoundTabOpened);
        // console.log('pre found DOC: ', w_preFoundDocOpened);

        // console.log('POST found TAB: ', w_foundTabOpened);
        // console.log('POST found DOC: ', w_foundDocOpened);


        if (w_foundDocOpened && !q_saved) {
            // Was the same and was asked to show body (and did not already had to fake-save and refresh)
            this._leoFileSystem.fireRefreshFile(w_openedDocumentGnx);
        }

        // Setup options for the preview state of the opened editor, and to choose which column it should appear
        const w_showOptions: vscode.TextDocumentShowOptions = p_aside
            ? {
                viewColumn: vscode.ViewColumn.Beside,
                preserveFocus: p_preventTakingFocus,
                preview: true, // should text document be in preview only? set false for fully opened
            }
            : {
                viewColumn: this._bodyMainSelectionColumn
                    ? this._bodyMainSelectionColumn
                    : 1,
                preserveFocus: p_preventTakingFocus,
                preview: true, // should text document be in preview only? set false for fully opened
            };

        // * CHECK ALL 3 POSSIBLE NEW PLACES FOR BODY SWITCH AFTER "await vscode.workspace.openTextDocument"
        if (
            w_openedDocument.isClosed ||
            !this.isTsStillValid(w_openedDocumentTS) // No need to check gnx

            // Should the gnx be relevant? -> !this.isGnxStillValid(w_openedDocumentGnx, w_openedDocumentTS)

        ) {
            return;
        }

        // * Actually Show the body pane document in a text editor
        const q_showTextDocument = vscode.window.showTextDocument(
            this._bodyTextDocument,
            w_showOptions
        ).then(
            (p_result) => {
                this.showBodyIfClosed = false; // * BODY IS ACTUALLY SHOWN!
                return p_result;
            },
            (p_reason) => {
                console.log('showTextDocument rejected: ', p_reason);
            }
        );

        // else q_bodyStates will exist.
        if (!this._needLastSelectedRefresh) {
            q_showTextDocument.then(
                (p_textEditor: vscode.TextEditor) => {

                    // * Set text selection range
                    const w_bodyTextEditor = p_textEditor;
                    if (!w_bodySelection) {
                        console.log("no selection in returned package from get_body_states");
                    }

                    const w_leoBodySel: BodySelectionInfo = w_bodySelection!;

                    // * CHECK ALL 3 POSSIBLE NEW PLACES FOR BODY SWITCH AFTER q_bodyStates & q_showTextDocument
                    if (
                        w_openedDocument.isClosed ||
                        !this.isTsStillValid(w_openedDocumentTS) ||
                        (this.lastSelectedNode && w_leoBodySel.gnx !== this.lastSelectedNode.gnx)
                        // Should the gnx be relevant? -> !this.isGnxStillValid(w_openedDocumentGnx, w_openedDocumentTS)
                    ) {
                        return;
                    }

                    // Cursor position and selection range
                    const w_activeRow: number = w_leoBodySel.insert.line;
                    const w_activeCol: number = w_leoBodySel.insert.col;
                    let w_anchorLine: number = w_leoBodySel.start.line;
                    let w_anchorCharacter: number = w_leoBodySel.start.col;

                    if (w_activeRow === w_anchorLine && w_activeCol === w_anchorCharacter) {
                        // Active insertion same as start selection, so use the other ones
                        w_anchorLine = w_leoBodySel.end.line;
                        w_anchorCharacter = w_leoBodySel.end.col;
                    }

                    const w_selection = new vscode.Selection(
                        w_anchorLine,
                        w_anchorCharacter,
                        w_activeRow,
                        w_activeCol
                    );

                    let w_scrollRange: vscode.Range | undefined;

                    // Build scroll position from selection range.
                    w_scrollRange = new vscode.Range(
                        w_activeRow,
                        w_activeCol,
                        w_activeRow,
                        w_activeCol
                    );

                    if (w_bodyTextEditor) {
                        // this._revealType = RevealType.NoReveal; // ! IN CASE THIS WAS STILL UP FROM SHOW_OUTLINE

                        w_bodyTextEditor.selection = w_selection; // set cursor insertion point & selection range
                        if (!w_scrollRange) {
                            w_scrollRange = w_bodyTextEditor.document.lineAt(0).range;
                        }

                        if (this._refreshType.scroll) {
                            this._refreshType.scroll = false;
                            // Set scroll approximation
                            w_bodyTextEditor.revealRange(w_scrollRange, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
                            // ! Compensate for reveal that steals the focus.
                            if (this._refreshType.goto) {
                                this._refreshType.goto = false;
                                let w_viewName: string;
                                if (this._lastTreeView === this._leoTreeExView) {
                                    w_viewName = Constants.GOTO_EXPLORER_ID;
                                } else {
                                    w_viewName = Constants.GOTO_ID;
                                }
                                vscode.commands.executeCommand(w_viewName + ".focus");
                            }
                        }

                    } else {
                        console.log("no selection in returned package from showTextDocument");
                    }

                }
            );
        }

        return q_showTextDocument;
    }

    /**
     * * Sets vscode's body-pane editor's language
     */
    private _setBodyLanguage(p_document: vscode.TextDocument, p_language: string): Thenable<vscode.TextDocument> {
        return vscode.languages.setTextDocumentLanguage(p_document, p_language).then(
            (p_mewDocument) => { return p_mewDocument; }, // ok - language found
            (p_error) => {
                let w_langName: string = p_error.toString().split('\n')[0];
                if (w_langName.length > 36 && w_langName.includes(Constants.LEO_LANGUAGE_PREFIX)) {
                    w_langName = w_langName.substring(36);
                } else {
                    w_langName = "";
                }
                if (w_langName && !this._languageFlagged.includes(w_langName)) {
                    this._languageFlagged.push(w_langName);
                    vscode.window.showInformationMessage(
                        w_langName + Constants.USER_MESSAGES.LANGUAGE_NOT_SUPPORTED
                    );
                } else if (!w_langName) {
                    // Document was closed: refresh after a timeout cycle (should not happen!)
                    setTimeout(() => {
                        this.setupRefresh(
                            this.finalFocus,
                            {
                                // tree: true,
                                body: true,
                                // documents: true,
                                // buttons: false,
                                states: true,
                            }
                        );
                        this.launchRefresh();
                    }, 0);
                }
                return p_document;
            }
        );
    }

    /**
     * * Refreshes body pane's statuses such as applied language file type, word-wrap state, etc.
     */
    public refreshBodyStates(): void {
        if (!this._bodyTextDocument || !this.lastSelectedNode) {
            return;
        }

        // * Set document language along with the proper cursor position, selection range and scrolling position
        const c = g.app.windowList[this.frameIndex].c;
        const p = c.p;
        const aList = g.get_directives_dict_list(p);
        const d = g.scanAtCommentAndAtLanguageDirectives(aList);
        let w_language =
            (d && d['language'])
            || g.getLanguageFromAncestorAtFileNode(p)
            || c.config.getLanguage('target-language')
            || 'plain';
        w_language = w_language.toLowerCase();

        // # Get the body wrap state
        let w_wrap = !!g.scanAllAtWrapDirectives(c, p);

        // TODO : Apply Wrap. see https://github.com/microsoft/vscode/issues/136927
        // console.log('WRAP: ', w_wrap);

        // Replace language string if in 'exceptions' array
        w_language = Constants.LEO_LANGUAGE_PREFIX + (Constants.LANGUAGE_CODES[w_language] || w_language);
        // Apply language if the selected node is still the same after all those events
        if (this._bodyTextDocument &&
            !this._bodyTextDocument.isClosed &&
            this.lastSelectedNode &&
            w_language !== this._bodyTextDocument.languageId &&
            utils.leoUriToStr(this._bodyTextDocument.uri) === this.lastSelectedNode.gnx
        ) {
            this._setBodyLanguage(this._bodyTextDocument, w_language);
        }

    }

    /**
     * * Refresh body states after a small debounced delay.
     */
    public debouncedRefreshBodyStates() {
        if (this._bodyStatesTimer) {
            clearTimeout(this._bodyStatesTimer);
        }
        this._bodyStatesTimer = setTimeout(() => {
            // this.triggerBodySave(true);
            this._bodySaveDocument(this._bodyLastChangedDocument!);
            this.refreshBodyStates();
        }, Constants.BODY_STATES_DEBOUNCE_DELAY);
    }

    /**
     * * Called by UI when the user selects in the tree (click or 'open aside' through context menu)
     * @param p_node is the position node selected in the tree
     * @param p_reveal 
     * @returns thenable for reveal to finish or select position to finish
     */
    public selectTreeNode(
        p_node: Position,
        p_internalCall?: boolean,
        p_aside?: boolean
        // p_reveal?: boolean, p_aside?: boolean
    ): Thenable<unknown> {

        this.triggerBodySave(true);

        const c = g.app.windowList[this.frameIndex].c;

        // * check if used via context menu's "open-aside" on an unselected node: check if p_node is currently selected, if not select it
        if (
            p_aside &&
            c.positionExists(p_node) &&
            !p_node.__eq__(this.lastSelectedNode)
        ) {
            this._revealNode(p_node, { select: true, focus: false }); // no need to set focus: tree selection is set to right-click position
        }

        this.showBodyIfClosed = true;

        this.leoStates.setSelectedNodeFlags(p_node);
        // this._leoStatusBar.update(true); // Just selected a node directly, or via expand/collapse
        const w_showBodyKeepFocus = p_aside
            ? this.config.treeKeepFocusWhenAside
            : this.config.treeKeepFocus;

        // * Check if having already this exact node position selected : Just show the body and exit
        // (other tree nodes with same gnx may have different syntax language coloring because of parents lineage)
        if (p_node.__eq__(this.lastSelectedNode)) {
            this._locateOpenedBody(p_node.gnx); // LOCATE NEW GNX
            return this.showBody(!!p_aside, w_showBodyKeepFocus).catch((p_error) => {
                return Promise.resolve(); // intercept cancellation as success: next one is going to replace anyways.
            });
            // Voluntary exit
        }

        // * Set selected node in Leo 
        c.selectPosition(p_node);

        if (!p_internalCall) {
            this._refreshType.states = true;
            this.getStates();
        }

        // * Apply the node to the body text without waiting for the selection promise to resolve
        return this._tryApplyNodeToBody(p_node, !!p_aside, w_showBodyKeepFocus);

    }

    /**
     * Leo Command
     * @param p_cmd Command name string
     * @param p_options: CommandOptions for the command
     */
    public async command(
        p_cmd: string,
        p_options: CommandOptions
    ): Promise<unknown> {
        this.lastCommandTimer = process.hrtime();
        if (this.commandTimer === undefined) {
            this.commandTimer = this.lastCommandTimer;
        }
        this.lastCommandRefreshTimer = this.lastCommandTimer;
        if (this.commandRefreshTimer === undefined) {
            this.commandRefreshTimer = this.lastCommandTimer;
        }

        await this.triggerBodySave();

        if (p_options.isNavigation) {
            // If any navigation command is used from outline or command palette: show body.
            this.showBodyIfClosed = true;
            // If alt+arrow is used to navigate: SHOW and leave focus on outline.
            this.showOutlineIfClosed = true;
        }

        const c = g.app.windowList[this.frameIndex].c;
        this.setupRefresh(p_options.finalFocus, p_options.refreshType);

        let value: any = undefined;
        const p = p_options.node ? p_options.node : c.p;

        let w_offset = 0;
        if (p_options.keepSelection) {
            if (Constants.OLD_POS_OFFSETS.DELETE.includes(p_cmd)) {
                w_offset = -1;
            } else if (Constants.OLD_POS_OFFSETS.ADD.includes(p_cmd)) {
                w_offset = 1;
            }
        }


        try {
            if (p.__eq__(c.p)) {
                value = c.doCommandByName(p_cmd); // no need for re-selection
            } else {
                const old_p = c.p;
                c.selectPosition(p);
                value = c.doCommandByName(p_cmd);
                if (p_options.keepSelection) {
                    if (value && value.then) {
                        (value as Thenable<unknown>).then((p_result) => {
                            if (c.positionExists(old_p)) {
                                c.selectPosition(old_p);
                            } else {
                                old_p._childIndex = old_p._childIndex + w_offset;
                                if (c.positionExists(old_p)) {
                                    c.selectPosition(old_p);
                                }
                            }
                        });
                    } else {
                        if (c.positionExists(old_p)) {
                            c.selectPosition(old_p);
                        } else {
                            old_p._childIndex = old_p._childIndex + w_offset;
                            if (c.positionExists(old_p)) {
                                c.selectPosition(old_p);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            vscode.window.showErrorMessage(
                "LeoUI Error: " + e
            );
        }


        if (this.trace) {
            if (this.lastCommandTimer) {
                console.log('lastCommandTimer', utils.getDurationMs(this.lastCommandTimer));
            }
        }
        this.lastCommandTimer = undefined;

        if (value && value.then) {
            (value as Thenable<unknown>).then((p_result) => {
                this.launchRefresh();
            });
        } else {
            this.launchRefresh();
        }


        if (value && value.then) {
            return value;
        } else {
            return Promise.resolve(value); // value may be a promise but it will resolve all at once.

        }
    }

    /**
     * Opens quickPick minibuffer pallette to choose from all commands in this file's Thenable
     * @returns Promise from the command resolving - or resolve with undefined if cancelled
     */
    public async minibuffer(): Promise<unknown> {

        await this.triggerBodySave(false);
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

        const w_noDetails = commands
            .filter(
                p_command => !p_command.detail && !(
                    p_command.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_BUTTON_START) ||
                    p_command.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_DEL_BUTTON_START) ||
                    p_command.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_COMMAND_START)
                )
            );
        for (const p_command of w_noDetails) {
            p_command.description = Constants.USER_MESSAGES.MINIBUFFER_USER_DEFINED;
        }

        const w_withDetails = commands.filter(p_command => !!p_command.detail);

        // Only sort 'regular' Leo commands, leaving custom commands at the top
        w_withDetails.sort((a, b) => {
            return a.label < b.label ? -1 : (a.label === b.label ? 0 : 1);
        });

        const w_result: vscode.QuickPickItem[] = [];

        if (this._minibufferHistory.length) {
            w_result.push({
                label: Constants.USER_MESSAGES.MINIBUFFER_HISTORY_LABEL,
                description: Constants.USER_MESSAGES.MINIBUFFER_HISTORY_DESC
            });
        }

        // Finish minibuffer list
        if (w_noDetails.length) {
            w_result.push(...w_noDetails);
        }

        // Separator above real commands, if needed...
        if (w_noDetails.length || this._minibufferHistory.length) {
            w_result.push({
                label: "", kind: vscode.QuickPickItemKind.Separator
            });
        }

        w_result.push(...w_withDetails);

        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.MINIBUFFER_PROMPT,
            matchOnDetail: true,
        };
        const w_picked = await vscode.window.showQuickPick(w_result, w_options);
        // First, check for undo-history list being requested
        if (w_picked && w_picked.label === Constants.USER_MESSAGES.MINIBUFFER_HISTORY_LABEL) {
            return this.minibufferHistory();
        }
        return this._doMinibufferCommand(w_picked);

    }

    /**
     * * Opens quickPick minibuffer pallette to choose from all commands in this file's commander
     * @returns Promise that resolves when the chosen command is placed on the front-end command stack
     */
    public async minibufferHistory(): Promise<unknown> {

        // Wait for _isBusyTriggerSave resolve because the full body save may change available commands
        await this.triggerBodySave(false);
        if (!this._minibufferHistory.length) {
            return Promise.resolve(undefined);
        }
        const w_commandList: vscode.QuickPickItem[] = this._minibufferHistory.map(
            p_command => { return { label: p_command }; }
        );
        // Add Nav tab special commands
        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.MINIBUFFER_PROMPT,
            matchOnDetail: true,
        };
        const w_picked = await vscode.window.showQuickPick(w_commandList, w_options);
        return this._doMinibufferCommand(w_picked);
    }

    /**
     * * Perform chosen minibuffer command
     */
    private async _doMinibufferCommand(p_picked: vscode.QuickPickItem | undefined): Promise<unknown> {
        // * First check for overridden command: Exit by doing the overridden command
        if (p_picked &&
            p_picked.label &&
            Constants.MINIBUFFER_OVERRIDDEN_COMMANDS[p_picked.label]) {
            this._minibufferHistory.push(p_picked.label); // Add to minibuffer history
            return vscode.commands.executeCommand(
                Constants.MINIBUFFER_OVERRIDDEN_COMMANDS[p_picked.label]
            );
        }
        // * Ok, it was really a minibuffer command
        if (p_picked && p_picked.label) {
            // Setup refresh
            this.setupRefresh(Focus.NoChange,
                {
                    tree: true,
                    body: true,
                    documents: true,
                    buttons: true,
                    states: true
                }
            );

            this._minibufferHistory.unshift(p_picked.label); // Add to minibuffer history
            const c = g.app.windowList[this.frameIndex].c;
            const w_commandResult = c.executeMinibufferCommand(p_picked.label);

            if (w_commandResult && w_commandResult.then) {
                // IS A PROMISE
                (w_commandResult as Thenable<unknown>).then((p_result) => {
                    this.launchRefresh();
                });
            } else {
                this.launchRefresh();
            }
            return Promise.resolve(w_commandResult);
        } else {
            // Canceled
            return Promise.resolve(undefined);
        }
    }

    /**
     * * Asks for a new headline label, and replaces the current label with this new one one the specified, or currently selected node
     * @param p_node Specifies which node to rename, or leave undefined to rename the currently selected node
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @returns Thenable that resolves when done
     */
    public editHeadline(p_node?: Position, p_fromOutline?: boolean): Thenable<unknown> {
        this.setupRefresh(
            p_fromOutline ? Focus.Outline : Focus.Body,
            { tree: true, states: true }
        );

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
        let w_finalFocus: Focus = p_fromOutline ? Focus.Outline : Focus.Body; // Use w_fromOutline for where we intend to leave focus when done with the insert
        if (p_interrupt) {
            this._focusInterrupt = true;
            w_finalFocus = Focus.NoChange; // Going to use last state
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
                this.setupRefresh(w_finalFocus, { tree: true, body: true, documents: true, buttons: true, states: true });
                this._insertAndSetHeadline(p_newHeadline, p_asChild); // no need for re-selection
            } else {
                const old_p = c.p;  // c.p is old already selected
                c.selectPosition(p); // p is now the new one to be operated on
                this._insertAndSetHeadline(p_newHeadline, p_asChild);
                // Only if 'keep' old position was needed (specified with a p_node parameter), and old_p still exists
                if (!!p_node && c.positionExists(old_p)) {
                    // no need to refresh body
                    this.setupRefresh(w_finalFocus, { tree: true, documents: true, buttons: true, states: true });
                    c.selectPosition(old_p);
                } else {
                    old_p._childIndex = old_p._childIndex + 1;
                    if (!!p_node && c.positionExists(old_p)) {
                        // no need to refresh body
                        this.setupRefresh(w_finalFocus, { tree: true, documents: true, buttons: true, states: true });
                        c.selectPosition(old_p);
                    } else {
                        this.setupRefresh(w_finalFocus, { tree: true, body: true, documents: true, buttons: true, states: true });
                    }
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
     * * Selects chapter 'main'
     */
    public async chapterMain(): Promise<unknown> {

        this.triggerBodySave(true); // Don't wait for saving to resolve because we're waiting for user input anyways

        this.setupRefresh(Focus.NoChange, { tree: true, body: true, states: true });
        const c = g.app.windowList[this.frameIndex].c;
        const cc = c.chapterController;
        cc.selectChapterByName('main');

        this.launchRefresh();

        return Promise.resolve();
    }

    /**
     * * Opens chapter list for the user to choose a new chapter, or cancel.
     */
    public async chapterSelect(): Promise<unknown> {

        this.triggerBodySave(true); // Don't wait for saving to resolve because we're waiting for user input anyways

        const c = g.app.windowList[this.frameIndex].c;
        const cc = c.chapterController;


        const w_chaptersList: vscode.QuickPickItem[] = cc.setAllChapterNames().map(
            (p_chapter) => { return { label: p_chapter }; }
        );
        // {
        //     label: p_chapter
        // }

        // Add Nav tab special commands
        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.SELECT_CHAPTER_PROMPT
        };

        const p_picked = await vscode.window.showQuickPick(w_chaptersList, w_options);

        if (p_picked && p_picked.label) {
            this.setupRefresh(Focus.NoChange, { tree: true, body: true, states: true });

            cc.selectChapterByName(p_picked.label);
            this.launchRefresh();
        }

        return Promise.resolve(); // Canceled
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
     * * Mimic vscode's CTRL+P to find any position by it's headline
     */
    public async gotoAnywhere(): Promise<unknown> {
        await this.triggerBodySave(false);

        const allPositions: { label: string; description?: string; position?: Position; }[] = [];
        // Options for date to look like : Saturday, September 17, 2016
        const w_dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: 'numeric', month: "long", day: 'numeric' };
        const c = g.app.windowList[this.frameIndex].c;

        // 'true' parameter because each position is kept individually for the time the QuickPick control is opened
        for (const p_position of c.all_unique_positions(true)) {

            let w_description = p_position.gnx; // Defaults as gnx.
            const w_gnxParts = w_description.split('.');
            if (w_gnxParts.length === 3 && w_gnxParts[1].length === 14) {
                // legit 3 part gnx
                const dateString = w_gnxParts[1];
                const w_year = +dateString.substring(0, 4); // unary + operator to convert the strings to numbers.
                const w_month = +dateString.substring(4, 6);
                const w_day = +dateString.substring(6, 8);
                const w_date = new Date(w_year, w_month - 1, w_day);
                w_description = `by ${w_gnxParts[0]} on ${w_date.toLocaleDateString("en-US", w_dateOptions)}`;
            }
            allPositions.push({
                label: p_position.h,
                position: p_position,
                description: w_description
            });

        }
        // Add Nav tab special commands
        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.SEARCH_POSITION_BY_HEADLINE
        };

        const p_picked = await vscode.window.showQuickPick(allPositions, w_options);

        if (p_picked && p_picked.label && p_picked.position) {
            if (c.positionExists(p_picked.position)) {
                console.log('position exists!');

                c.selectPosition(p_picked.position);  // set this node as selection

            } else {
                console.log('POSITION DOES NOT EXIST!');

            }
            this.setupRefresh(
                Focus.Body, // Finish in body pane given explicitly because last focus was in input box.
                {
                    tree: true,
                    body: true,
                    // documents: false,
                    // buttons: false,
                    states: true,
                }
            );
            this.launchRefresh();
        }

        return Promise.resolve(undefined); // Canceled

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
        //         return this.showGotoPane(); // Finish by opening and focussing nav pane
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
        //         return this.showGotoPane(); // Finish by opening and focussing nav pane
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
        //         return this.showGotoPane(); // Finish by opening and focussing nav pane
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
        //         return this.showGotoPane(); // Finish by opening and focussing nav pane
        //     });
        return vscode.window.showInformationMessage("TODO: findQuickMarked");

    }

    /**
     * Opens goto and focus in depending on passed options
     */
    public showGotoPane(p_options?: { preserveFocus?: boolean }): Thenable<unknown> {
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
        //                         this.showGotoPane({ preserveFocus: true }); // show but dont change focus
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
     * * Goto the next, previous, first or last nav entry via arrow keys in
     */
    public navigateNavEntry(p_nav: LeoGotoNavKey): void {
        console.log('TODO : navigateNavEntry');

        // this._leoGotoProvider.navigateNavEntry(p_nav);
    }


    public navEnter(): Thenable<unknown> {
        return vscode.window.showInformationMessage("TODO: navEnter");

        // return this._isBusyTriggerSave(false, true).then(() => {

        //     return this.sendAction(
        //         Constants.LEOBRIDGE.NAV_SEARCH
        //     ).then((p_package) => {
        //         this._leoGotoProvider.refreshTreeRoot();
        //         this.showGotoPane({ preserveFocus: true }); // show but dont change focus
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
        //         this.showGotoPane({ preserveFocus: true }); // show but dont change focus
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
     * Check if search input should be forced-focused again
     */
    public checkForceFindFocus(p_fromInit: boolean): void {
        if (this._findNeedsFocus) {
            setTimeout(() => {
                let w_panel: vscode.WebviewView | undefined;
                if (this._findPanelWebviewView && this._findPanelWebviewView.visible) {
                    w_panel = this._findPanelWebviewView;
                } else if (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible) {
                    w_panel = this._findPanelWebviewExplorerView;
                }
                if (w_panel) {
                    this._findNeedsFocus = false;
                    w_panel.webview.postMessage({ type: 'selectFind' });
                    return;
                }
            }, 60);

        }
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
        // return vscode.window.showInformationMessage("TODO: findAll");

        // const w_action: string = p_replace
        //     ? Constants.LEOBRIDGE.REPLACE_ALL
        //     : Constants.LEOBRIDGE.FIND_ALL;

        let w_searchString: string = this._lastSettingsUsed!.findText;
        let w_replaceString: string = this._lastSettingsUsed!.replaceText;

        return this.triggerBodySave(false)
            .then((p_saveResult) => {
                return this._inputFindPattern()
                    .then((p_findString) => {
                        if (!p_findString) {
                            return true; // Cancelled with escape or empty string.
                        }
                        w_searchString = p_findString;
                        if (p_replace) {
                            return this._inputFindPattern(true).then((p_replaceString) => {
                                if (p_replaceString === undefined) {
                                    return true;
                                }
                                w_replaceString = p_replaceString;
                                return false;
                            });
                        }
                        return false;
                    });
            })
            .then((p_cancelled: boolean) => {
                if (this._lastSettingsUsed && !p_cancelled) {
                    this._lastSettingsUsed.findText = w_searchString;
                    this._lastSettingsUsed.replaceText = w_replaceString;

                    // this.saveSearchSettings(this._lastSettingsUsed); // No need to wait, will be stacked.

                    const c = g.app.windowList[this.frameIndex].c;
                    const fc = c.findCommands;

                    fc.ftm.get_settings();
                    const w_changeSettings: ISettings = {
                        // this._lastSettingsUsed
                        // State...
                        in_headline: false, // ! TODO ! 
                        // p: Position,
                        // Find/change strings...
                        find_text: this._lastSettingsUsed.findText,
                        change_text: this._lastSettingsUsed.replaceText,
                        // Find options...
                        file_only: this._lastSettingsUsed.searchOptions === 3,
                        ignore_case: this._lastSettingsUsed.ignoreCase,
                        mark_changes: this._lastSettingsUsed.markChanges,
                        mark_finds: this._lastSettingsUsed.markFinds,
                        node_only: this._lastSettingsUsed.searchOptions === 2,
                        pattern_match: this._lastSettingsUsed.regExp,
                        reverse: false,
                        search_body: this._lastSettingsUsed.searchBody,
                        search_headline: this._lastSettingsUsed.searchHeadline,
                        suboutline_only: this._lastSettingsUsed.searchOptions === 1,
                        whole_word: this._lastSettingsUsed.wholeWord,
                        wrapping: false, // unused
                    };
                    const w_result = fc.do_change_all(w_changeSettings);

                    // TODO : GET FOCUS!
                    const w_focus = ""; // = g.app.gui.get_focus();
                    //                     focus = g.app.gui.widget_name(w)

                    let w_finalFocus = Focus.Body;

                    if (w_focus.includes('tree') || w_focus.includes('head')) {
                        // tree
                        w_finalFocus = Focus.Outline;
                    }
                    this.loadSearchSettings();
                    this.setupRefresh(
                        w_finalFocus,
                        {
                            tree: true,
                            body: true,
                            // documents: false,
                            // buttons: false,
                            states: true
                        }
                    );
                    this.launchRefresh();

                    return;

                }
            });
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
        // vscode.window.showInformationMessage("TODO: loadSearchSettings");

        const c = g.app.windowList[this.frameIndex].c;
        const scon = c.quicksearchController;
        const leoISettings = c.findCommands.ftm.get_settings();

        const w_searchSettings: LeoGuiFindTabManagerSettings = {
            // Nav options
            nav_text: scon.navText,
            show_parents: scon.showParents,
            is_tag: scon.isTag,
            search_options: scon.searchOptions,
            //Find/change strings...
            find_text: leoISettings.find_text,
            change_text: leoISettings.change_text,
            // Find options...
            ignore_case: leoISettings.ignore_case,
            mark_changes: leoISettings.mark_changes,
            mark_finds: leoISettings.mark_finds,
            node_only: leoISettings.node_only,
            file_only: leoISettings.file_only,
            pattern_match: leoISettings.pattern_match,
            search_body: leoISettings.search_body,
            search_headline: leoISettings.search_headline,
            suboutline_only: leoISettings.suboutline_only,
            whole_word: leoISettings.whole_word
        };


        const w_settings: LeoSearchSettings = {
            isTag: w_searchSettings.is_tag,
            navText: w_searchSettings.nav_text,
            showParents: w_searchSettings.show_parents,
            searchOptions: w_searchSettings.search_options,
            //Find/change strings...
            findText: w_searchSettings.find_text,
            replaceText: w_searchSettings.change_text,
            // Find options...
            wholeWord: w_searchSettings.whole_word,
            ignoreCase: w_searchSettings.ignore_case,
            regExp: w_searchSettings.pattern_match,
            markFinds: w_searchSettings.mark_finds,
            markChanges: w_searchSettings.mark_changes,
            searchHeadline: w_searchSettings.search_headline,
            searchBody: w_searchSettings.search_body,
            // 0, 1 or 2 for outline, sub-outline, or node.
            searchScope:
                0 +
                (w_searchSettings.suboutline_only ? 1 : 0) +
                (w_searchSettings.node_only ? 2 : 0) +
                (w_searchSettings.file_only ? 3 : 0),
        };
        if (w_settings.searchScope > 2) {
            console.error('searchScope SHOULD BE 0, 1, 2 only: ', w_settings.searchScope);
        }
        this._lastSettingsUsed = w_settings;
        if (this._findPanelWebviewExplorerView) {
            this._findPanelWebviewExplorerView.webview.postMessage({
                type: 'setSettings',
                value: w_settings,
            });
        }
        if (this._findPanelWebviewView) {
            this._findPanelWebviewView.webview.postMessage({
                type: 'setSettings',
                value: w_settings,
            });
        }

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
        //                 (w_searchSettings.node_only ? 2 : 0) +
        //                 (w_searchSettings.file_only ? 3 : 0),
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
     * * Send the settings to Leo implementation
     * @param p_settings the search settings to be set in Leo implementation to affect next results
     * @returns 
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
        //     file_only: !!(p_settings.searchScope === 3),
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
     * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
     * @param p_frame Document node instance in the Leo document view to be the 'selected' one.
     */
    public setDocumentSelection(p_frame: LeoFrame): void {
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
    * * Creates a new Leo file
    * @returns the promise started after it's done creating the frame and commander
    */
    public async newLeoFile(): Promise<unknown> {

        this.setupRefresh(Focus.NoChange, {
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
            await this.triggerBodySave();
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

        await this.triggerBodySave();

        this.setupRefresh(Focus.Body, {
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

        // make sure it's a real uri because vscode may send selected
        // node from other tree that has this command in title
        if (p_uri && !!p_uri.toJSON) {
            console.log('p_uri', p_uri);
            console.log('OPEN p_uri', JSON.stringify(p_uri.toJSON()));
        }

        this.setupRefresh(this.finalFocus, {
            tree: true,
            body: true,
            states: true,
            documents: true,
            buttons: true
        });
        if (!this.leoStates.fileOpenedReady) {
            // override with given argument
            let fileName: string;

            // make sure it's a real uri because vscode may send selected
            // node from other tree that has this command in title
            if (p_uri && !!p_uri.fsPath && p_uri.fsPath.trim && p_uri.fsPath.trim() && g.app.loadManager) {
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
            await this.triggerBodySave();
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
        await this.triggerBodySave();

        const c = g.app.windowList[this.frameIndex].c;

        this.setupRefresh(
            p_fromOutline ? Focus.Outline : Focus.Body,
            {
                tree: true,
                states: true,
                documents: true
            }
        );

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
        await this.triggerBodySave();

        const c = g.app.windowList[this.frameIndex].c;

        this.setupRefresh(
            p_fromOutline ? Focus.Outline : Focus.Body,
            {
                tree: true,
                states: true,
                documents: true
            }
        );

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
        await this.triggerBodySave();

        const c = g.app.windowList[this.frameIndex].c;

        this.setupRefresh(
            p_fromOutline ? Focus.Outline : Focus.Body,
            {
                tree: true,
                states: true,
                documents: true
            }
        );

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

        this.setupRefresh(
            p_fromOutline ? Focus.Outline : Focus.Body,
            {
                tree: true,
                body: true,
                buttons: true,
                states: true,
                documents: true
            }
        );

        this.frameIndex = p_index;

        this.launchRefresh();

        // if selected and opened
        return Promise.resolve(true);
    }

    /**
     * * Import any File(s)
     * No URL passed from the command definition.
     * @param p_leoFileUri is offered for internal use only
     */
    public importAnyFile(p_leoFileUri?: vscode.Uri): Thenable<unknown> {
        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         let q_importFile: Promise<LeoBridgePackage | undefined>; // Promise for opening a file
        //         if (p_leoFileUri && p_leoFileUri.fsPath.trim()) {
        //             const w_fixedFilePath: string = p_leoFileUri.fsPath.replace(/\\/g, '/');
        //             // Array of a single filename
        //             q_importFile = this.sendAction(
        //                 Constants.LEOBRIDGE.IMPORT_ANY_FILE,
        //                 { filenames: [w_fixedFilePath] }
        //             );
        //         } else {
        //             q_importFile = this._leoFilesBrowser.getImportFileUrls().then(
        //                 (p_chosenLeoFiles) => {
        //                     if (p_chosenLeoFiles.length) {
        //                         // Can be multiple files, so array of string is sent
        //                         return this.sendAction(
        //                             Constants.LEOBRIDGE.IMPORT_ANY_FILE,
        //                             { filenames: p_chosenLeoFiles }
        //                         );
        //                     } else {
        //                         return Promise.resolve(undefined);
        //                     }
        //                 },
        //                 (p_errorGetFile) => {
        //                     return Promise.reject(p_errorGetFile);
        //                 }
        //             );
        //         }
        //         return q_importFile;
        //     })
        //     .then(
        //         (p_importFileResult: LeoBridgePackage | undefined) => {
        //             if (p_importFileResult) {
        //                 this.setupRefresh(
        //                     Focus.NoChange,
        //                     {
        //                         tree: true,
        //                         body: true,
        //                         documents: true,
        //                         // buttons: false,
        //                         states: true,
        //                     }
        //                 );
        //                 return this.launchRefresh();
        //             } else {
        //                 return Promise.resolve(undefined);
        //             }
        //         },
        //         (p_errorImport) => {
        //             console.log('Rejection for import file');
        //             return Promise.reject(p_errorImport);
        //         }
        //     );
        return Promise.resolve();
    }

    /**
     * * Export Outline
     * Export all headlines to an external file.
     */
    public exportHeadlines(p_exportFileUri?: vscode.Uri): Thenable<unknown> {
        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         if (this.leoStates.fileOpenedReady && this.lastSelectedNode) {
        //             return this._leoFilesBrowser.getExportFileUrl(
        //                 "Export Headlines",
        //                 {
        //                     'Text files': ['txt'],
        //                     'All files': ['*'],
        //                 },
        //             );
        //         } else {
        //             vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //             return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //         }
        //     })
        //     .then((p_chosenLeoFile) => {
        //         if (p_chosenLeoFile.trim()) {

        //             const q_commandResult = this.nodeCommand({
        //                 action: Constants.LEOBRIDGE.EXPORT_HEADLINES,
        //                 node: undefined,
        //                 refreshType: { tree: true, states: true, documents: true },
        //                 finalFocus: Focus.NoChange, // use last
        //                 name: p_chosenLeoFile,
        //             });
        //             if (q_commandResult) {
        //                 return q_commandResult;
        //             } else {
        //                 return Promise.reject('Export Headlines not added on command stack');
        //             }
        //         } else {
        //             // Canceled
        //             return Promise.resolve(undefined);
        //         }
        //     });
        return Promise.resolve();
    }


    /**
     * * Flatten Selected Outline
     * Export the selected outline to an external file.
     * The outline is represented in MORE format.
     */
    public flattenOutline(): Thenable<unknown> {

        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         if (this.leoStates.fileOpenedReady && this.lastSelectedNode) {
        //             return this._leoFilesBrowser.getExportFileUrl(
        //                 "Flatten Selected Outline",
        //                 {
        //                     'Text files': ['txt'],
        //                     'All files': ['*'],
        //                 },
        //             );
        //         } else {
        //             vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //             return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //         }
        //     })
        //     .then((p_chosenLeoFile) => {
        //         if (p_chosenLeoFile.trim()) {

        //             const q_commandResult = this.nodeCommand({
        //                 action: Constants.LEOBRIDGE.FLATTEN_OUTLINE,
        //                 node: undefined,
        //                 refreshType: { tree: true, states: true, documents: true },
        //                 finalFocus: Focus.NoChange, // use last
        //                 name: p_chosenLeoFile,
        //             });
        //             if (q_commandResult) {
        //                 return q_commandResult;
        //             } else {
        //                 return Promise.reject('Flatten Selected Outline not added on command stack');
        //             }
        //         } else {
        //             // Canceled
        //             return Promise.resolve(undefined);
        //         }
        //     });
        return Promise.resolve();
    }

    /**
     * * Outline To CWEB
     */
    public outlineToCweb(): Thenable<unknown> {

        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         if (this.leoStates.fileOpenedReady && this.lastSelectedNode) {
        //             return this._leoFilesBrowser.getExportFileUrl(
        //                 "Outline To CWEB",
        //                 {
        //                     'CWEB files': ['w'],
        //                     'Text files': ['txt'],
        //                     'All files': ['*'],
        //                 },
        //             );
        //         } else {
        //             vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //             return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //         }
        //     })
        //     .then((p_chosenLeoFile) => {
        //         if (p_chosenLeoFile.trim()) {

        //             const q_commandResult = this.nodeCommand({
        //                 action: Constants.LEOBRIDGE.OUTLINE_TO_CWEB,
        //                 node: undefined,
        //                 refreshType: { tree: true, states: true, documents: true },
        //                 finalFocus: Focus.NoChange, // use last
        //                 name: p_chosenLeoFile,
        //             });
        //             if (q_commandResult) {
        //                 return q_commandResult;
        //             } else {
        //                 return Promise.reject('Outline To CWEB not added on command stack');
        //             }
        //         } else {
        //             // Canceled
        //             return Promise.resolve(undefined);
        //         }
        //     });
        return Promise.resolve();
    }

    /**
     * * Outline To Noweb
     */
    public outlineToNoweb(): Thenable<unknown> {

        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         if (this.leoStates.fileOpenedReady && this.lastSelectedNode) {
        //             return this._leoFilesBrowser.getExportFileUrl(
        //                 "Outline To Noweb",
        //                 {
        //                     'Noweb files': ['nw'],
        //                     'Text files': ['txt'],
        //                     'All files': ['*'],
        //                 },
        //             );
        //         } else {
        //             vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //             return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //         }
        //     })
        //     .then((p_chosenLeoFile) => {
        //         if (p_chosenLeoFile.trim()) {

        //             const q_commandResult = this.nodeCommand({
        //                 action: Constants.LEOBRIDGE.OUTLINE_TO_NOWEB,
        //                 node: undefined,
        //                 refreshType: { tree: true, states: true, documents: true },
        //                 finalFocus: Focus.NoChange, // use last
        //                 name: p_chosenLeoFile,
        //             });
        //             if (q_commandResult) {
        //                 return q_commandResult;
        //             } else {
        //                 return Promise.reject('Outline To Noweb not added on command stack');
        //             }
        //         } else {
        //             // Canceled
        //             return Promise.resolve(undefined);
        //         }
        //     });
        return Promise.resolve();
    }

    /**
     * * Remove Sentinels
     */
    public removeSentinels(p_leoFileUri?: vscode.Uri): Thenable<unknown> {
        // Convert one or more files, replacing the original files while removing any sentinels they contain.

        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         let q_importFiles: Promise<LeoBridgePackage | undefined>; // Promise for opening a file
        //         if (p_leoFileUri && p_leoFileUri.fsPath.trim()) {
        //             const w_fixedFilePath: string = p_leoFileUri.fsPath.replace(/\\/g, '/');
        //             q_importFiles = this.sendAction(
        //                 Constants.LEOBRIDGE.REMOVE_SENTINELS,
        //                 { names: [w_fixedFilePath] }
        //             );
        //         } else {
        //             q_importFiles = this._leoFilesBrowser.getImportFileUrls(
        //                 {
        //                     'Python files': ['py'],
        //                     'All files': ['*'],
        //                     'C/C++ files': ['c', 'cpp', 'h', 'hpp'],
        //                     'Java files': ['java'],
        //                     'Lua files': ['lua'],
        //                     'Pascal files': ['pas'],
        //                 },
        //                 false,
        //                 "Remove Sentinels"
        //             ).then(
        //                 (p_chosenLeoFiles) => {
        //                     if (p_chosenLeoFiles.length) {
        //                         return this.sendAction(
        //                             Constants.LEOBRIDGE.REMOVE_SENTINELS,
        //                             { names: p_chosenLeoFiles }
        //                         );
        //                     } else {
        //                         return Promise.resolve(undefined);
        //                     }
        //                 },
        //                 (p_errorGetFile) => {
        //                     return Promise.reject(p_errorGetFile);
        //                 }
        //             );
        //         }
        //         return q_importFiles;
        //     })
        //     .then(
        //         (p_importFileResult: LeoBridgePackage | undefined) => {
        //             if (p_importFileResult) {
        //                 this.setupRefresh(
        //                     Focus.NoChange,
        //                     {
        //                         tree: true,
        //                         body: true,
        //                         documents: true,
        //                         // buttons: false,
        //                         states: true,
        //                     }
        //                 );
        //                 return this.launchRefresh();
        //             } else {
        //                 return Promise.resolve(undefined);
        //             }
        //         },
        //         (p_errorImport) => {
        //             console.log('Rejection for Read a file into a single node file');
        //             return Promise.reject(p_errorImport);
        //         }
        //     );
        return Promise.resolve();
    }

    /**
     * * Weave
     * Simulate a literate-programming weave operation by writing the outline to a text file.
     */
    public weave(): Thenable<unknown> {

        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         if (this.leoStates.fileOpenedReady && this.lastSelectedNode) {
        //             return this._leoFilesBrowser.getExportFileUrl(
        //                 "Weave",
        //                 {
        //                     'Text files': ['txt'],
        //                     'All files': ['*'],
        //                 },
        //             );
        //         } else {
        //             vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //             return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //         }
        //     })
        //     .then((p_chosenLeoFile) => {
        //         if (p_chosenLeoFile.trim()) {

        //             const q_commandResult = this.nodeCommand({
        //                 action: Constants.LEOBRIDGE.WEAVE,
        //                 node: undefined,
        //                 refreshType: { tree: true, states: true, documents: true },
        //                 finalFocus: Focus.NoChange, // use last
        //                 name: p_chosenLeoFile,
        //             });
        //             if (q_commandResult) {
        //                 return q_commandResult;
        //             } else {
        //                 return Promise.reject('Weave not added on command stack');
        //             }
        //         } else {
        //             // Canceled
        //             return Promise.resolve(undefined);
        //         }
        //     });
        return Promise.resolve();
    }

    /**
     * * Write file from node
     */
    public writeFileFromNode(): Thenable<unknown> {

        // * If node starts with @read-file-into-node, use the full path name in the headline.
        // * Otherwise, prompt for a file name.

        // if (!this.leoStates.fileOpenedReady || !this.lastSelectedNode) {
        //     vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //     return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        // }

        // const h = this.lastSelectedNode.headline.trimEnd();
        // const tag = '@read-file-into-node';

        // let fileName = '';
        // if (h.startsWith(tag)) {
        //     fileName = h.substring(tag.length).trim();
        // }

        // let q_fileName: Thenable<string>;
        // if (fileName) {
        //     q_fileName = Promise.resolve(fileName);
        // } else {
        //     q_fileName = this._isBusyTriggerSave(true, true)
        //         .then((p_saveResult) => {
        //             if (this.leoStates.fileOpenedReady && this.lastSelectedNode) {
        //                 return this._leoFilesBrowser.getExportFileUrl(
        //                     "Write file from node",
        //                     {
        //                         'All files': ['*'],
        //                         'Python files': ['py'],
        //                         'Leo files': ['leo'],
        //                     },
        //                 );
        //             } else {
        //                 vscode.window.showInformationMessage(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //                 return Promise.reject(Constants.USER_MESSAGES.FILE_NOT_OPENED);
        //             }
        //         });
        // }

        // return q_fileName.then((p_chosenLeoFile) => {
        //     if (p_chosenLeoFile.trim()) {

        //         const q_commandResult = this.nodeCommand({
        //             action: Constants.LEOBRIDGE.WRITE_FILE_FROM_NODE,
        //             node: undefined,
        //             refreshType: { tree: true, states: true, documents: true },
        //             finalFocus: Focus.NoChange, // use last
        //             name: p_chosenLeoFile,
        //         });
        //         this.leoStates.leoOpenedFileName = p_chosenLeoFile.trim();
        //         this._leoStatusBar.update(true, 0, true);
        //         this._addRecentAndLastFile(p_chosenLeoFile.trim());
        //         if (q_commandResult) {
        //             return q_commandResult;
        //         } else {
        //             return Promise.reject('Write File From Node not added on command stack');
        //         }
        //     } else {
        //         // Canceled
        //         return Promise.resolve(undefined);
        //     }
        // });
        return Promise.resolve();
    }

    /**
     * * Read file from node
     */
    public readFileIntoNode(p_leoFileUri?: vscode.Uri): Thenable<unknown> {

        // return this._isBusyTriggerSave(true, true)
        //     .then((p_saveResult) => {
        //         let q_importFile: Promise<LeoBridgePackage | undefined>; // Promise for opening a file
        //         if (p_leoFileUri && p_leoFileUri.fsPath.trim()) {
        //             const w_fixedFilePath: string = p_leoFileUri.fsPath.replace(/\\/g, '/');
        //             q_importFile = this.sendAction(
        //                 Constants.LEOBRIDGE.READ_FILE_INTO_NODE,
        //                 { name: w_fixedFilePath }
        //             );
        //         } else {
        //             q_importFile = this._leoFilesBrowser.getImportFileUrls(
        //                 {
        //                     'All files': ['*'],
        //                     'Python files': ['py'],
        //                     'Leo files': ['leo'],
        //                 },
        //                 true,
        //                 "Read File Into Node"
        //             ).then(
        //                 (p_chosenLeoFiles) => {
        //                     if (p_chosenLeoFiles.length) {
        //                         return this.sendAction(
        //                             Constants.LEOBRIDGE.READ_FILE_INTO_NODE,
        //                             { name: p_chosenLeoFiles[0] }
        //                         );
        //                     } else {
        //                         return Promise.resolve(undefined);
        //                     }
        //                 },
        //                 (p_errorGetFile) => {
        //                     return Promise.reject(p_errorGetFile);
        //                 }
        //             );
        //         }
        //         return q_importFile;
        //     })
        //     .then(
        //         (p_importFileResult: LeoBridgePackage | undefined) => {
        //             if (p_importFileResult) {
        //                 this.setupRefresh(
        //                     Focus.NoChange,
        //                     {
        //                         tree: true,
        //                         body: true,
        //                         documents: true,
        //                         // buttons: false,
        //                         states: true,
        //                     }
        //                 );
        //                 return this.launchRefresh();
        //             } else {
        //                 return Promise.resolve(undefined);
        //             }
        //         },
        //         (p_errorImport) => {
        //             console.log('Rejection for Read a file into a single node file');
        //             return Promise.reject(p_errorImport);
        //         }
        //     );
        return Promise.resolve();
    }

    /**
     * * Invoke an '@button' click directly by index string. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was clicked
     * @returns Promises that resolves when done
     */
    public clickAtButton(p_node: LeoButtonNode): Thenable<unknown> {

        this.setupRefresh(Focus.NoChange, {
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

        this.setupRefresh(Focus.NoChange, { buttons: true });

        vscode.window.showInformationMessage('TODO: Implement removeAtButton ' + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Reverts to a particular undo bead state
     */
    public async revertToUndo(p_undo: LeoUndoNode): Promise<any> {
        // TODO 
        // if (p_undo.label === 'Unchanged') {
        //     return Promise.resolve();
        // }
        // let action = Constants.LEOBRIDGE.REDO;
        // let repeat = p_undo.beadIndex;
        // if (p_undo.beadIndex <= 0) {
        //     action = Constants.LEOBRIDGE.UNDO;
        //     repeat = (-p_undo.beadIndex) + 1;
        // }
        // const w_package = await this.sendAction(
        //     action,
        //     { repeat: repeat }
        // );
        // this.setupRefresh(
        //     Focus.Outline,
        //     {
        //         tree: true,
        //         body: true,
        //         documents: true,
        //         states: true,
        //         buttons: true,
        //     }
        // );
        // this.launchRefresh();
        // return w_package;

    }

    /**
     * * highlights the current undo state without disturbing focus
     * @param p_undoNode Node instance in the Leo History view to be the 'selected' one.
     */
    private _setUndoSelection(p_undoNode: LeoUndoNode): void {
        if (this._lastLeoUndos && this._lastLeoUndos.visible) {
            this._lastLeoUndos.reveal(p_undoNode, { select: true, focus: false }).then(
                () => { }, // Ok - do nothing
                (p_error) => {
                    console.log('setUndoSelection could not reveal');
                }
            );
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

    /**
     * Handle a successful find match.
     */
    public show_find_success(c: Commands, in_headline: boolean, insert: number, p: Position): void {

        // ? needed ?

        // trace = False and not g.unitTesting
        // if in_headline:
        //     if trace:
        //         g.trace('HEADLINE', p.h)
        //     c.frame.tree.widget.select_leo_node(p)
        //     self.focus_to_head(c, p)  # Does not return.
        // else:
        //     w = c.frame.body.widget
        //     row, col = g.convertPythonIndexToRowCol(p.b, insert)
        //     if trace:
        //         g.trace('BODY ROW', row, p.h)
        //     w.cursor_line = row
        //     self.focus_to_body(c)  # Does not return.
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

    public widget_name(widget: any): string {
        console.log('UI ASKED FOR WIDGET NAME');
        return "test";

    }
    public set_focus(commander: Commands, widget: any): void {
        this.focusWidget = widget;
    }
    public get_focus(c: Commands): any {
        return this.focusWidget;
    }

    /**
     * * Wrapper of vscode.window.showInputBox to get a user input with simple prompt
     */
    public get1Arg(p_options?: vscode.InputBoxOptions | undefined, p_token?: vscode.CancellationToken | undefined): Thenable<string | undefined> {
        return vscode.window.showInputBox(p_options, p_token);
    }

    public runAboutLeoDialog(
        c: Commands,
        version: string,
        theCopyright: string,
        url: string,
        email: string
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
        text = "Ok"
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
        message: string,
        yes_all = false,
        no_all = false,

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
        message: string,
        yesMessage = "Yes",
        noMessage = "No",
        yesToAllMessage = "",
        defaultButton = "Yes",
        cancelMessage = ""
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
        multiple?: boolean,
        startpath?: string // TODO 
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

