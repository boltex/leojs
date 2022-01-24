import * as vscode from "vscode";
import { debounce } from "lodash";
import * as utils from "./utils";
import { Constants } from "./constants";
import { RevealType, Icon, ReqRefresh, LeoPackageStates } from "./types";

import { Config } from "./config";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode, LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentNode, LeoDocumentsProvider } from "./leoDocuments";
import { LeoFilesBrowser } from "./leoFileBrowser";
import { LeoStates } from "./leoStates";
import { LeoBodyProvider } from "./leoBody";
import { LeoUndoNode, LeoUndosProvider } from "./leoUndos";
import * as g from './core/leoGlobals';
import { LoadManager } from "./core/leoApp";
import { Commands } from "./core/leoCommands";
import { NodeIndices, Position, VNode } from "./core/leoNodes";
// import 'browser-hrtime';
// require('browser-hrtime');

/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI {
    // * State flags
    public leoStates: LeoStates;
    public verbose: boolean = true;
    public trace: boolean = true;
    public commanderIndex: number = 0;
    public clipboardContent: string = "";

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

    // * File Browser
    private _leoFilesBrowser: LeoFilesBrowser; // Browsing dialog service singleton used in the openLeoFile and save-as methods

    // * Refresh Cycle
    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh
    private _revealType: RevealType = RevealType.NoReveal; // Type of reveal for the selected node (when refreshing outline)
    private _preventShowBody = false; // Used when refreshing treeview from config: It requires not to open the body pane when refreshing.
    private _fromOutline: boolean = false; // flag to leave focus on outline instead of body when finished refreshing
    private _focusInterrupt: boolean = false; // Flag for preventing setting focus when interrupting (canceling) an 'insert node' text input dialog with another one

    // * Outline Pane
    private _leoTreeProvider: LeoOutlineProvider; // TreeDataProvider single instance
    private _leoTreeView: vscode.TreeView<Position>; // Outline tree view added to the Tree View Container with an Activity Bar icon
    private _leoTreeExView: vscode.TreeView<Position>; // Outline tree view added to the Explorer Sidebar
    private _lastTreeView: vscode.TreeView<Position>; // Last visible treeview

    // * Body pane
    private _bodyFileSystemStarted: boolean = false;
    private _bodyEnablePreview: boolean = true;
    private _leoFileSystem: LeoBodyProvider; // as per https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api
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

    // * Documents Pane
    private _leoDocumentsProvider: LeoDocumentsProvider;
    private _leoDocuments: vscode.TreeView<LeoDocumentNode>;
    private _leoDocumentsExplorer: vscode.TreeView<LeoDocumentNode>;
    private _lastLeoDocuments: vscode.TreeView<LeoDocumentNode> | undefined;

    private _currentDocumentChanged: boolean = false; // if clean and an edit is done: refresh opened documents view

    // * '@button' pane
    private _leoButtonsProvider: LeoButtonsProvider;
    private _leoButtons: vscode.TreeView<LeoButtonNode>;
    private _leoButtonsExplorer: vscode.TreeView<LeoButtonNode>;
    private _lastLeoButtons: vscode.TreeView<LeoButtonNode> | undefined;

    // * Undos pane
    private _leoUndosProvider: LeoUndosProvider;
    private _leoUndos: vscode.TreeView<LeoUndoNode>;
    private _leoUndosExplorer: vscode.TreeView<LeoUndoNode>;
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
    public launchRefresh: ((p_node?: Position) => void);

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public getStates: (() => void);

    // * Debounced method
    public refreshDocumentsPane: (() => void);

    // * Debounced method
    public refreshUndoPane: (() => void);

    constructor(private _context: vscode.ExtensionContext) {
        // * Setup States
        this.leoStates = new LeoStates(_context, this);

        // * Get configuration settings
        this.config = new Config(_context, this);
        // * also check workbench.editor.enablePreview
        this.config.buildFromSavedSettings();
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // * Build Icon filename paths
        this.nodeIcons = utils.buildNodeIconPaths(_context);
        this.documentIcons = utils.buildDocumentIconPaths(_context);
        this.buttonIcons = utils.buildButtonsIconPaths(_context);

        g.app.gui = this;
        g.app.loadManager = new LoadManager();
        // g.app.loadManager.computeStandardDirectories()
        if (!g.app.setLeoID(false, true)) {
            throw new Error("unable to set LeoID.");
        }
        g.app.inBridge = true;  // (From Leo) Added 2007/10/21: support for g.getScript.
        g.app.nodeIndices = new NodeIndices(g.app.leoID);


        // IF RECENT FILES LIST :
        //      TODO: CHECK RECENT LEO FILE LIST AND OPEN THEM
        //      g.app.loadManager.load(fileName, pymacs)
        // ELSE :
        //      TODO: CREATE NEW LEO OUTLINE (demo below)

        // ************************************************************
        // * demo test: CREATE NEW LEO OUTLINE: NEW COMMANDER
        // ************************************************************
        let w_c = g.app.newCommander("", this);

        // Equivalent to leoBridge 'createFrame' method
        let w_v = new VNode(w_c);
        let w_p = new Position(w_v);
        w_v.initHeadString("NewHeadline");

        // #1631: Initialize here, not in p._linkAsRoot.
        w_c.hiddenRootNode.children = [];

        // New in Leo 4.5: p.moveToRoot would be wrong: the node hasn't been linked yet.
        w_p._linkAsRoot();

        g.app.commandersList.push(w_c);

        // select first test commander
        let c = g.app.commandersList[this.commanderIndex];

        // ************************************************************
        // * demo test: BUILD SOME TEST OUTLINE
        // ************************************************************
        let w_node = c.p;
        w_node.initHeadString("@file node1");
        w_node.setBodyString('@tabwidth 8\nnode1 body\n@others');
        w_node.expand();

        w_node = c.p.insertAsLastChild();
        w_node.initHeadString("node Inside1");
        w_node.setBodyString('  @others \nnodeInside1 body\n@language c\nprint()');
        w_node.setMarked();

        w_node = c.p.insertAsLastChild();
        w_node.initHeadString("node with UserData Inside2");
        w_node.setBodyString('node Inside2 body');
        w_node.u = { a: 'user content string a', b: "user content also" };

        w_node = c.p.insertAfter();
        w_node.initHeadString("@file node3");
        w_node.setBodyString('node 3 body');

        w_node = c.p.insertAfter();
        w_node.initHeadString("node 2 selected but empty");
        w_c.setCurrentPosition(w_node);

        // ************************************************************
        // * demo test: SOME OTHER COMMANDER
        // ************************************************************
        w_c = g.app.newCommander("", this);
        w_v = new VNode(w_c);
        w_p = new Position(w_v);
        w_v.initHeadString("NewHeadline");
        w_c.hiddenRootNode.children = [];
        w_p._linkAsRoot();
        g.app.commandersList.push(w_c);

        // select second test commander
        c = w_c;

        // ************************************************************
        // * demo test: BUILD SOME OTHER TEST OUTLINE
        // ************************************************************
        w_node = c.p;
        w_node.initHeadString("some other title");
        w_node.setBodyString('body text');

        let nodeCounter = 0;
        while (nodeCounter < 30) {
            nodeCounter++;
            w_node = c.p.insertAsLastChild();
            w_node.initHeadString("top node numbered headline " + nodeCounter);
        }

        w_node = c.p.insertAsLastChild();
        w_node.initHeadString("yet another node");
        w_node.setBodyString('more body text\nwith a second line');

        w_node = c.p.insertAfter();
        w_node.initHeadString("@clean my-file.txt");
        w_node.setBodyString('again some body text');
        w_c.setCurrentPosition(w_node);

        nodeCounter = 0;
        while (nodeCounter < 30) {
            nodeCounter++;
            w_node = c.p.insertAsLastChild();
            w_node.initHeadString("middle node numbered headline " + nodeCounter);
        }

        w_node = c.p.insertAsLastChild();
        w_node.initHeadString("sample cloned node");
        w_node.setBodyString('some other body');
        w_node.clone();

        w_node = c.p.insertAfter();
        w_node.setMarked();
        w_node.initHeadString("a different headline");

        w_c.setCurrentPosition(w_node);

        nodeCounter = 0;
        while (nodeCounter < 30) {
            nodeCounter++;
            w_node = c.p.insertAsLastChild();
            w_node.initHeadString("a numbered headline " + nodeCounter);
        }

        w_node = c.p.insertAfter();
        w_node.initHeadString("another different headline");

        nodeCounter = 0;
        while (nodeCounter < 30) {
            nodeCounter++;
            w_node = c.p.insertAsLastChild();
            w_node.initHeadString("more numbered headlines " + nodeCounter);
        }
        w_c.setCurrentPosition(w_node);
        nodeCounter = 0;
        while (nodeCounter < 30) {
            nodeCounter++;
            w_node = c.p.insertAsLastChild();
            w_node.initHeadString("inside numbered headlines " + nodeCounter);
        }

        // back to first test commander after creating this second one
        c = g.app.commandersList[this.commanderIndex];
        // ************************************************************
        // * demo test end
        // ************************************************************

        // * Create file browser instance
        this._leoFilesBrowser = new LeoFilesBrowser(_context);

        // * Create a single data provider for both outline trees, Leo view and Explorer view
        this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons, this);
        this._leoTreeView = vscode.window.createTreeView(Constants.TREEVIEW_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._leoTreeView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeView)));
        this._leoTreeView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeView)));
        this._leoTreeView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, false))); // * Trigger 'show tree in Leo's view'
        this._leoTreeExView = vscode.window.createTreeView(Constants.TREEVIEW_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._leoTreeExView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeExView)));
        this._leoTreeExView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeExView)));
        this._leoTreeExView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, true))); // * Trigger 'show tree in explorer view'
        this._lastTreeView = this._leoTreeExView;

        // * Create Leo Opened Documents Treeview Providers and tree views
        this._leoDocumentsProvider = new LeoDocumentsProvider(this.leoStates, this);
        this._leoDocuments = vscode.window.createTreeView(Constants.DOCUMENTS_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._leoDocuments.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, false)));
        this._leoDocumentsExplorer = vscode.window.createTreeView(Constants.DOCUMENTS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._leoDocumentsExplorer.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, true)));
        this._lastLeoDocuments = this._leoDocumentsExplorer;

        // * Create '@buttons' Treeview Providers and tree views
        this._leoButtonsProvider = new LeoButtonsProvider(this.leoStates, this.buttonIcons);
        this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtons.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, false)));
        this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtonsExplorer.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, true)));
        this._lastLeoButtons = this._leoButtonsExplorer;

        // * Create Undos Treeview Providers and tree views
        this._leoUndosProvider = new LeoUndosProvider(this.leoStates, this);
        this._leoUndos = vscode.window.createTreeView(Constants.UNDOS_ID, { showCollapseAll: false, treeDataProvider: this._leoUndosProvider });
        this._leoUndos.onDidChangeVisibility((p_event => this._onUndosTreeViewVisibilityChanged(p_event, false)));
        this._leoUndosExplorer = vscode.window.createTreeView(Constants.UNDOS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoUndosProvider });
        this._leoUndosExplorer.onDidChangeVisibility((p_event => this._onUndosTreeViewVisibilityChanged(p_event, true)));
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
        // vscode.window.onDidChangeActiveTextEditor((p_editor) =>
        //     this._onActiveEditorChanged(p_editor)
        // );

        // * React to change in selection, cursor position and scroll position
        // vscode.window.onDidChangeTextEditorSelection((p_event) =>
        //     this._onChangeEditorSelection(p_event)
        // );
        // vscode.window.onDidChangeTextEditorVisibleRanges((p_event) =>
        //     this._onChangeEditorScroll(p_event)
        // );

        // * Triggers when a different text editor/vscode window changed focus or visibility, or dragged
        // This is also what triggers after drag and drop, see '_onChangeEditorViewColumn'
        // vscode.window.onDidChangeTextEditorViewColumn((p_columnChangeEvent) =>
        //     this._changedTextEditorViewColumn(p_columnChangeEvent)
        // ); // Also triggers after drag and drop
        // vscode.window.onDidChangeVisibleTextEditors((p_editors) =>
        //     this._changedVisibleTextEditors(p_editors)
        // ); // Window.visibleTextEditors changed
        // vscode.window.onDidChangeWindowState((p_windowState) =>
        //     this._changedWindowState(p_windowState)
        // ); // Focus state of the current window changes

        // * React when typing and changing body pane
        // vscode.workspace.onDidChangeTextDocument((p_textDocumentChange) =>
        //     this._onDocumentChanged(p_textDocumentChange)
        // );

        // * React to configuration settings events
        vscode.workspace.onDidChangeConfiguration((p_configChange) =>
            this._onChangeConfiguration(p_configChange)
        );

        // * React to opening of any file in vscode
        // vscode.workspace.onDidOpenTextDocument((p_document) =>
        //     this._onDidOpenTextDocument(p_document)
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
            { leading: true, trailing: true }
        );

        // ! FAKE DEVELOPMENT STARTUP END ( TODO: finish _setupOpenedLeoDocument )
        // Reset Extension context flags (used in 'when' clauses in package.json)
        this.leoStates.leoReady = true;
        this.leoStates.fileOpenedReady = true;  // TODO : IMPLEMENT

        this.refreshDocumentsPane();
        // ! VSCODE BUG : natural refresh from visibility change do not support 'getParent'!
        setTimeout(() => {
            this._refreshOutline(true, RevealType.RevealSelectFocus);
        }, 0);

    }

    /**
     * * 'getStates' action for use in debounced method call
     */
    private _triggerGetStates(): void {
        if (this._refreshType.documents) {
            this._refreshType.documents = false;
            this.refreshDocumentsPane();
        }
        if (this._refreshType.buttons) {
            this._refreshType.buttons = false;
            this._leoButtonsProvider.refreshTreeRoot();
        }
        if (this._refreshType.states) {
            this._refreshType.states = false;
            const c = g.app.commandersList[this.commanderIndex];
            const w_states: LeoPackageStates = {
                changed: c.changed, // Document has changed (is dirty)
                canUndo: c.canUndo(), // Document can undo the last operation done
                canRedo: c.canRedo(), // Document can redo the last operation 'undone'
                canDemote: c.canDemote(), // Selected node can have its siblings demoted
                canPromote: c.canPromote(), // Selected node can have its children promoted
                canDehoist: c.canDehoist() // Document is currently hoisted and can be de-hoisted
            };
            this.leoStates.setLeoStateFlags(w_states);
        }
    }

    /**
     * * Setup leoInteg's UI for having no opened Leo documents
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
     * * A Leo file was opened: setup leoInteg's UI accordingly.
     * @param p_openFileResult Returned info about currently opened and editing document
     * @return a promise that resolves to an opened body pane text editor
     */
    private _setupOpenedLeoDocument(p_openFileResult: any): Promise<unknown> {
        // const w_selectedLeoNode = this.apToLeoNode(p_openFileResult.node, false); // Just to get gnx for the body's fist appearance
        // this.leoStates.leoOpenedFileName = p_openFileResult.filename;

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
        // this.leoStates.fileOpenedReady = true;
        // // * Maybe first valid redraw of tree along with the selected node and its body
        // this._refreshOutline(true, RevealType.RevealSelectFocus); // p_revealSelection flag set
        // // * Maybe first StatusBar appearance
        // this._leoStatusBar.update(true, 0, true);
        // this._leoStatusBar.show(); // Just selected a node
        // // * Show leo log pane
        // this.showLogPane();
        // // * Send config to python's side (for settings such as defaultReloadIgnore and checkForChangeExternalFiles)
        // this.sendConfigToServer(this.config.getConfig());
        // // * Refresh Opened tree views
        // this.refreshDocumentsPane();
        // this._leoButtonsProvider.refreshTreeRoot();
        // // * Maybe first Body appearance
        // return this.showBody(false);
        return Promise.resolve(true);
    }

    /**
     * * Show the outline, with Leo's selected node also selected, and optionally focussed
     * @param p_focusOutline Flag for focus to be placed in outline
     */
    public showOutline(p_focusOutline?: boolean): void {
        const c = g.app.commandersList[this.commanderIndex];
        this._lastTreeView.reveal(c.p, {
            select: true,
            focus: !!p_focusOutline
        }).then(
            () => { }, // Ok
            (p_error) => {
                console.error('ERROR showOutline could not reveal: tree was refreshed!');
            }
        );
    }

    /**
     * * Refresh tree for 'node hover icons' to show up properly after changing their settings
     */
    public configTreeRefresh(): void {
        if (this.leoStates.fileOpenedReady) {
            console.log('config tree Refresh');

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
                        console.error('ERROR gotSelectedNode could not reveal: tree was refreshed!');
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
    public _launchRefresh(p_node?: Position): void {
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

        const c = g.app.commandersList[this.commanderIndex];

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
            console.log('node only no parameter');

            this._refreshType.node = false;

            this.leoStates.setSelectedNodeFlags(c.p);
            this._revealTreeViewNode(c.p, {
                select: true, focus: true // FOCUS FORCED TO TRUE always leave focus on tree when navigating
            });

        }

        // getStates will check if documents, buttons and states flags are set and refresh accordingly
        this.getStates();
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

        console.log('refreshing');

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
     * @param p_documentNode Document node instance in the Leo document view to be the 'selected' one.
     */
    public setDocumentSelection(p_documentNode: LeoDocumentNode): void {
        this._currentDocumentChanged = p_documentNode.documentEntry.changed;
        this.leoStates.leoOpenedFileName = p_documentNode.documentEntry.fileName();
        setTimeout(() => {
            if (this._lastLeoDocuments && this._lastLeoDocuments.selection.length && this._lastLeoDocuments.selection[0] === p_documentNode) {
                // console.log('setDocumentSelection: already selected!');
            } else if (this._lastLeoDocuments && this._lastLeoDocuments.visible) {
                this._lastLeoDocuments.reveal(p_documentNode, { select: true, focus: false }).then(
                    () => { }, // Ok
                    (p_error) => {
                        console.error('ERROR setDocumentSelection could not reveal: tree was refreshed!');
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
                        console.error('ERROR setUndoSelection could not reveal: tree was refreshed!');
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
        console.log('changed config !!');

        if (p_event.affectsConfiguration(Constants.CONFIG_NAME)) {
            this.config.buildFromSavedSettings(); // If the config setting started with 'leojs'
        }

        // also check if workbench.editor.enablePreview
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // Check For "workbench.editor.enablePreview" to be true.
        this.config.checkEnablePreview();
        this.config.checkCloseEmptyGroups();
        this.config.checkCloseOnFileDelete();
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
                    console.error('ERROR _onChangeCollapsedState could not reveal: tree was refreshed!');
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
            console.log('_onTreeViewVisibilityChanged so refresh outline');

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

    public ensure_commander_visible(c: Commands): void {
        // TODO !
        console.log("TODO ensure_commander_visible");
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
        const c = g.app.commandersList[this.commanderIndex];
        // Note: set context flags for current selection when capturing and revealing the selected node
        // when the tree refreshes and the selected node is processed by getTreeItem & gotSelectedNode
        let q_reveal: Thenable<void> | undefined;

        if (c.positionExists(p_node)) {

            if (p_aside) {
                q_reveal = this._lastTreeView.reveal(p_node).then(
                    () => { }, // Ok
                    (p_error) => {
                        console.error('ERROR selectTreeNode could not reveal: tree was refreshed!');
                    }
                );
            }
            c.selectPosition(p_node);
            // Set flags here - not only when 'got selection' is reached.
            this.leoStates.setSelectedNodeFlags(p_node);

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
    public command(
        p_cmd: string,
        p_node: Position | undefined,
        p_refreshType: ReqRefresh,
        p_fromOutline: boolean,
        p_keepSelection?: boolean
    ): Thenable<unknown> {
        this.lastCommandTimer = process.hrtime();
        if (this.commandTimer === undefined) {
            this.commandTimer = this.lastCommandTimer;
        }
        this.lastCommandRefreshTimer = this.lastCommandTimer;
        if (this.commandRefreshTimer === undefined) {
            this.commandRefreshTimer = this.lastCommandTimer;
        }

        const c = g.app.commandersList[this.commanderIndex];
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
            this.launchRefresh();
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
                const c = g.app.commandersList[this.commanderIndex];
                const commands: vscode.QuickPickItem[] = [];
                for (let key in c.commandsDict) {
                    const command = c.commandsDict[key];
                    // Going to get replaced
                    if (!(command as any).__name__.startsWith('async-')) {
                        commands.push({
                            label: (command as any).__name__,
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
                    console.log('REPLACED WITH ', p_picked.label);
                } else {
                    console.log('ALL GOOD');

                }
                if (p_picked && p_picked.label) {
                    const c = g.app.commandersList[this.commanderIndex];
                    const w_commandResult = c.doCommandByName(p_picked.label);

                    if (!this.preventRefresh) {
                        this.launchRefresh();
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

        const c = g.app.commandersList[this.commanderIndex];
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
        // Ignore p_fromOutline so as to not focus on tree to keep edit headline input open
        // this.command('insert-node', p_node, { tree: true, states: true }, false);
        // Call 'Edit Headline' on this newly made and selected node PASSING ORIGINAL p_fromOutline
        // return this.editHeadline(g.app.commandersList[this.commanderIndex].p, p_fromOutline);

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

            const c = g.app.commandersList[this.commanderIndex];

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
        const c = g.app.commandersList[this.commanderIndex];
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

        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement clickAtButton' +
            " button: " + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Removes an '@button' from Leo's button dict, directly by index string. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was chosen to remove
     * @returns Thenable that resolves when done
     */
    public removeAtButton(p_node: LeoButtonNode): Thenable<unknown> {

        this._setupRefresh(false, { buttons: true });

        vscode.window.showInformationMessage('TODO: Implement removeAtButton' +
            " button: " + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public replaceClipboardWith(s: string): Thenable<void> {
        this.clipboardContent = s; // also set immediate clipboard string
        return vscode.env.clipboard.writeText(s);
    }

    public asyncGetTextFromClipboard(): Thenable<string> {
        return vscode.env.clipboard.readText().then((s) => {
            // also set immediate clipboard string for possible future read
            this.clipboardContent = s;
            return this.getTextFromClipboard();
        });
    }

    /**
     * Returns clipboard content
    */
    public getTextFromClipboard(): string {
        return this.clipboardContent;
    }

    /**
     * * Close an opened Leo file
     * @returns the launchRefresh promise started after it's done closing the Leo document
     */
    public closeLeoFile(): Thenable<unknown> {

        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement closeLeoFile');

        const w_fakeTotalOpened = 1; // TODO

        if (w_fakeTotalOpened > 0) {
            this.launchRefresh();
        } else {
            this._setupNoOpenedLeoDocument();
        }

        // if closed
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if problem
    }

    /**
     * * Creates a new untitled Leo document
     * * If not shown already, it also shows the outline, body and log panes along with leaving focus in the outline
     * @returns A promise that resolves with a textEditor of the new file
     */
    public newLeoFile(): Thenable<unknown> {

        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        let w_c = g.app.newCommander("", this);

        // Equivalent to leoBridge 'createFrame' method
        let w_v = new VNode(w_c);
        let w_p = new Position(w_v);
        w_v.initHeadString("NewHeadline");

        // #1631: Initialize here, not in p._linkAsRoot.
        w_c.hiddenRootNode.children = [];

        // New in Leo 4.5: p.moveToRoot would be wrong: the node hasn't been linked yet.
        w_p._linkAsRoot();

        g.app.commandersList.push(w_c);

        // select last, that was just created
        this.commanderIndex = g.app.commandersList.length - 1;

        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        this.launchRefresh();
        // if created
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Shows an 'Open Leo File' dialog window and opens the chosen file
     * * If not shown already, it also shows the outline, body and log panes along with leaving focus in the outline
     * @param p_leoFileUri optional uri for specifying a file, if missing, a dialog will open
     * @returns A promise that resolves with a textEditor of the chosen file
     */
    public openLeoFile(p_uri?: vscode.Uri): Thenable<unknown> {

        vscode.window.showInformationMessage('TODO: Implement openLeoFile' +
            (p_uri ? " path: " + p_uri.fsPath : ""));

        // if opened
        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
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
     * @returns a promise from saving the file results, or that will resolve to undefined if cancelled
     */
    public saveAsLeoFile(p_fromOutline?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, { tree: true, states: true, documents: true });

        vscode.window.showInformationMessage('TODO: Implement saveAsLeoFile' +
            " called from " +
            (p_fromOutline ? "outline" : "body")
        );

        this.launchRefresh();

        // if saved
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Asks for .leojs file name and path, then saves the JSON Leo file
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns a promise from saving the file results, or that will resolve to undefined if cancelled
     */
    public saveAsLeojsFile(p_fromOutline?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, { tree: true, states: true, documents: true });

        vscode.window.showInformationMessage('TODO: Implement saveAsLeojsFile' +
            " called from " +
            (p_fromOutline ? "outline" : "body")
        );

        this.launchRefresh();

        // if saved
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Invokes the self.commander.save() Leo command
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns Promise that resolves when the save command is placed on the front-end command stack
     */
    public saveLeoFile(p_fromOutline?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, { tree: true, states: true, documents: true });

        vscode.window.showInformationMessage('TODO: Implement saveLeoFile' +
            " called from " +
            (p_fromOutline ? "outline" : "body")
        );

        this.launchRefresh();

        // if saved
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
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

        this._setupRefresh(!!p_fromOutline, { tree: true, body: true, buttons: true, states: true, documents: true });

        this.commanderIndex = p_index;
        this._refreshOutline(true, RevealType.RevealSelect);

        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        this.refreshUndoPane(); // with largish debounce.

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
     * * Reveals the log pane if not already visible
     */
    public showLogPane(): Thenable<unknown> {
        vscode.window.showInformationMessage('TODO: Implement showLogPane');

        // if shown
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public isTextWidget(w: any): boolean {
        return false;
    }

    public isTextWrapper(w: any): boolean {
        return false;
    }

    public runAskOkDialog(
        c: Commands,
        title: string,
        message: string,
        buttonText?: string
    ): Thenable<unknown> {
        return vscode.window.showInformationMessage(title, {
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
                ...["Yes", "No"]
            )
            .then((answer) => {
                if (answer === "Yes") {
                    return 'yes';
                } else {
                    return 'no';
                }
            });
    }

    public runOpenFileDialog(
        c: Commands,
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
        ).then((p_names) => {
            const names: string[] = [];
            if (p_names && p_names.length) {
                p_names.forEach(name => {
                    names.push(name.fsPath);
                });
            }
            return names;
        });
    }

    public runSaveFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        // c,
        // c.mFileName,
        // "Save",
        // [["Leo files", "*.leo *.db"]], // Array of arrays (one in this case)
        // g.defaultLeoFileExtension(c)
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
                return p_uri.fsPath;
            } else {
                return "";
            }

        });

    }

    /**
     * * Test/Dummy command
     * @returns Thenable from the tested functionality
     */
    public test(): Thenable<unknown> {
        const c = g.app.commandersList[this.commanderIndex];

        vscode.window.showInformationMessage("Test called!");
        console.log("Test called!");
        // console.log("c.p.isSelected()", c);

        // * DO LEO COMMAND BY NAME
        // keepSelection = False  # Set default, optional component of param
        // if "keep" in param:
        //     keepSelection = param["keep"]

        // * Test directives_dict & directives_pat
        // console.log('test get_directives_dict_list ');
        // console.log(g.get_directives_dict_list(c.p));

        // * Test getTabWidth
        console.log(c.getTabWidth(c.p));

        console.log(c.doCommandByName('check-outline'));

        // * Test undo/redo
        console.log('can undo', c.undoer.canUndo());
        console.log('can redo', c.undoer.canRedo());

        // * Test hasParent
        console.log('p has parent: ', c.p.hasParent());


        // * test @cmd decorator and undoer
        // console.log('test @cmd decorator and undoer');
        // this.command("undo", undefined, {
        //     node: true, // Reveal the returned 'selected position' without changes to the tree
        //     body: true, // Goto/select another node needs the body pane refreshed
        //     states: true
        // }, false);

        // * test @commander_command decorator and general commands
        /*
        const func = c.commandsDict['goto-next-visible'];
        if (!func) {
            console.error('Leo command not found');
        } else {
            console.log('HAS FUNC!');
            func.bind(c)();
        }
        */

        // * Example from leoserver "LEO COMMAND BY NAME" method
        // func = c.commandsDict.get(command_name) # Getting from kebab-cased 'Command Name'
        // if not func:  # pragma: no cover
        //     raise ServerError(f"{tag}: Leo command not found: {command_name!r}")

        // p = self._get_p(param)
        // try:
        //     if p == c.p:
        //         value = func(event={"c":c})  # no need for re-selection
        //     else:
        //         old_p = c.p  # preserve old position
        //         c.selectPosition(p)  # set position upon which to perform the command
        //         value = func(event={"c":c})
        //         if keepSelection and c.positionExists(old_p):
        //             # Only if 'keep' old position was set, and old_p still exists
        //             c.selectPosition(old_p)

        return Promise.resolve(true);
    }

}
