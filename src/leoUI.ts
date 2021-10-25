import * as vscode from "vscode";
import { debounce } from "debounce";
import * as utils from "./utils";
import { Constants } from "./constants";
import { RevealType, Icon, ReqRefresh } from "./types";

import { Config } from "./config";
import { LeoOutlineNode } from "./leoOutlineNode";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode } from "./leoButtonNode";
import { LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentNode } from "./leoDocumentNode";
import { LeoDocumentsProvider } from "./leoDocuments";
import { LeoFilesBrowser } from "./leoFileBrowser";
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';
import { LoadManager } from "./core/leoApp";
import { NodeIndices, Position, VNode } from "./core/leoNodes";
import { Commands } from "./core/leoCommands";
import { LeoBodyProvider } from "./leoBody";

/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI {
    // * State flags
    public leoStates: LeoStates;
    public verbose: boolean = false;
    public trace: boolean = false;

    // * Clipboard
    public clipboardContent: string = "";

    // * Configuration Settings Service
    public config: Config; // Public configuration service singleton, used in leoSettingsWebview, leoBridge, and leoNode for inverted contrast

    // * Icon Paths (Singleton static arrays)
    public nodeIcons: Icon[] = [];
    public documentIcons: Icon[] = [];
    public buttonIcons: Icon[] = [];

    // * File Browser
    private _leoFilesBrowser: LeoFilesBrowser; // Browsing dialog service singleton used in the openLeoFile and save-as methods

    public leo_c: Commands;

    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh
    private _revealType: RevealType = RevealType.NoReveal; // Type of reveal for the selected node (when refreshing outline)
    private _preventShowBody = false; // Used when refreshing treeview from config: It requires not to open the body pane when refreshing.
    private _fromOutline: boolean = false; // flag to leave focus on outline instead of body when finished refreshing

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
    private _currentDocumentChanged: boolean = false; // if clean and an edit is done: refresh opened documents view

    // * '@button' pane
    private _leoButtonsProvider: LeoButtonsProvider;
    private _leoButtons: vscode.TreeView<LeoButtonNode>;
    private _leoButtonsExplorer: vscode.TreeView<LeoButtonNode>;

    // * Log and terminal Panes
    private _leoLogPane: vscode.OutputChannel = vscode.window.createOutputChannel(Constants.GUI.LOG_PANE_TITLE);
    private _leoTerminalPane: vscode.OutputChannel | undefined;

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public launchRefresh: ((p_node?: Position) => void) & {
        clear(): void;
    } & {
        flush(): void;
    };

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public getStates: (() => void) & {
        clear(): void;
    } & {
        flush(): void;
    };

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public refreshDocumentsPane: (() => void) & {
        clear(): void;
    } & {
        flush(): void;
    };

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
        this.leo_c = g.app.commandersList[0];

        // ************************************************************
        // * demo test: BUILD SOME TEST OUTLINE
        // ************************************************************
        let w_node = this.leo_c.p;
        w_node.initHeadString("node1");
        w_node.setBodyString('node1 body');
        w_node.expand();

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("node Inside1");
        w_node.setBodyString('nodeInside1 body');
        w_node.setMarked();

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("node with UserData Inside2");
        w_node.setBodyString('node Inside2 body');
        w_node.u = { a: 'user content string a', b: "user content also" };

        w_node = this.leo_c.p.insertAfter();
        w_node.initHeadString("@file node3");
        w_node.setBodyString('node 3 body');

        w_node = this.leo_c.p.insertAfter();
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
        this.leo_c = w_c;

        // ************************************************************
        // * demo test: BUILD SOME OTHER TEST OUTLINE
        // ************************************************************
        w_node = this.leo_c.p;
        w_node.initHeadString("some other title");
        w_node.setBodyString('body text');

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("yet another node");
        w_node.setBodyString('more body text\nwith a second line');

        w_node = this.leo_c.p.insertAfter();
        w_node.initHeadString("@clean my-file.txt");
        w_node.setBodyString('again some body text');
        w_c.setCurrentPosition(w_node);

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("sample cloned node");
        w_node.setBodyString('some other body');
        w_node.clone();

        w_node = this.leo_c.p.insertAfter();
        w_node.setMarked();
        w_node.initHeadString("a different headline");

        // back to first test commander after creating this second one
        this.leo_c = g.app.commandersList[0];
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

        // * Create '@buttons' Treeview Providers and tree views
        this._leoButtonsProvider = new LeoButtonsProvider(this.leoStates, this.buttonIcons);
        this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtons.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, false)));
        this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtonsExplorer.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, true)));

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
        this.getStates = debounce(this._triggerGetStates, Constants.STATES_DEBOUNCE_DELAY);
        this.refreshDocumentsPane = debounce(this._refreshDocumentsPane, Constants.DOCUMENTS_DEBOUNCE_DELAY);
        this.launchRefresh = debounce(this._launchRefresh, Constants.REFRESH_DEBOUNCE_DELAY);

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
            // this.leoStates.setLeoStateFlags(this._leo.getLeoStates);
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
        this._lastTreeView.reveal(this.leo_c.p, {
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
            this._preventShowBody = true;
            this._refreshOutline(true, RevealType.RevealSelect);
        }
    }

    /**
     * * Handle selected node being created for the outline
     * @param p_node Position that was just created and detected as selected node
     */
    public gotSelectedNode(p_node: Position): void {

        console.log('Got selected node:', p_node.h);

        if (this._revealType) {
            setTimeout(() => {
                this._lastTreeView.reveal(p_node, {
                    select: true,
                    focus: (this._revealType.valueOf() >= RevealType.RevealSelectFocus.valueOf())
                }).then(
                    () => { }, // Ok 
                    (p_error) => {
                        console.error('ERROR gotSelectedNode could not reveal: tree was refreshed!');
                    }
                );
                // Done so reset
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
        // Set w_revealType, it will ultimately set this._revealType.
        // Used when finding the OUTLINE's selected node and setting or preventing focus into it
        // Set this._fromOutline. Used when finding the selected node and showing the BODY to set or prevent focus in it

        if (Object.keys(this._refreshType).length) {
            console.log('Has UI to REFRESH!', this._refreshType);
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

        // // * _focusInterrupt insertNode Override
        // if (this._focusInterrupt) {
        //     // this._focusInterrupt = false; // TODO : Test if reverting this in _gotSelection is 'ok'
        //     w_revealType = RevealType.RevealSelect;
        // }

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
            if (!this._leoDocuments.visible && !this._leoDocumentsExplorer.visible) {
                return;
            }
            let w_docView: vscode.TreeView<LeoDocumentNode>;
            if (this._leoDocuments.visible) {
                w_docView = this._leoDocuments;
            } else {
                w_docView = this._leoDocumentsExplorer;
            }
            // tslint:disable-next-line: strict-comparisons
            if (w_docView.selection.length && w_docView.selection[0] === p_documentNode) {
                console.log('setDocumentSelection: already selected!');
            } else {
                console.log('setDocumentSelection: selecting in tree');
                w_docView.reveal(p_documentNode, { select: true, focus: false }).then(
                    () => { }, // Ok 
                    (p_error) => {
                        console.error('ERROR setDocumentSelection could not reveal: tree was refreshed!');
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

        if (p_treeView.selection[0] && p_treeView.selection[0].__eq__(p_event.element)) {
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
            this.refreshDocumentsPane(); // List may not have changed, but it's selection may have
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
            // TODO: Check if needed
            // this._leoButtonsProvider.refreshTreeRoot(); // May not need to set selection...?
        }
    }

    /**
     * * Called by UI when the user selects in the tree (click or 'open aside' through context menu)
     * @param p_node is the position node selected in the tree
     * @param p_aside flag meaning it's body should be shown in a new editor column
     * @returns thenable for reveal to finish or select position to finish
     */
    public selectTreeNode(p_node: Position, p_aside?: boolean): Thenable<unknown> {

        // Note: set context flags for current selection when capturing and revealing the selected node
        // when the tree refreshes and the selected node is processed by getTreeItem & gotSelectedNode
        let q_reveal: Thenable<void> | undefined;

        if (this.leo_c.positionExists(p_node)) {

            if (p_aside) {
                q_reveal = this._lastTreeView.reveal(p_node).then(
                    () => { }, // Ok 
                    (p_error) => {
                        console.error('ERROR selectTreeNode could not reveal: tree was refreshed!');
                    }
                );
            }
            this.leo_c.selectPosition(p_node);
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
        p_node: LeoOutlineNode | undefined,
        p_refreshType: ReqRefresh,
        p_fromOutline: boolean,
        p_keepSelection?: boolean
    ): Thenable<unknown> {

        this._setupRefresh(p_fromOutline, p_refreshType);

        const c: Commands = this.leo_c;
        let value: any = undefined;

        // Getting from kebab-cased 'Command Name'
        const func = this.leo_c.commandsDict[p_cmd];
        if (!func) {
            vscode.window.showInformationMessage(
                'TODO: Implement ' +
                p_cmd +
                " called from " +
                (p_fromOutline ? "outline" : "body") +
                " operate on " +
                (p_node ? p_node!.label : "the selected node") +
                (p_keepSelection ? " and bring selection back on currently selected node" : "")
            );
        } else {
            const p = p_node ? p_node.position : c.p;
            if (p.__eq__(c.p)) {
                value = func.bind(c)(); // no need for re-selection
            } else {
                const old_p = c.p;
                c.selectPosition(p)
                value = func.bind(c)();
                if (p_keepSelection && c.positionExists(old_p)) {
                    // Only if 'keep' old position was set, and old_p still exists
                    c.selectPosition(old_p)
                }
            }
        }

        /* EXAMPLE CALL BY METHOD
                //@ts-expect-error
        if ((typeof this.leo_c[p_cmd]) === 'function') {
            console.log('HAS PROPERTY' + p_cmd + " so were doing it!");
                    //@ts-expect-error
            this.leo_c[p_cmd]();
        } else {
            console.log('NO PROPERTY' + p_cmd);
            console.log(this.leo_c);
        }
        */

        this.launchRefresh();

        return Promise.resolve(true);
    }

    /**
     * Opens quickPick minibuffer pallette to choose from all commands in this file's Thenable
     * @returns Thenable from the command resolving - or resolve with undefined if cancelled
     */
    public minibuffer(): Thenable<unknown> {

        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement minibuffer');

        this.launchRefresh();

        // if choice made and command executes, replace 'true' with command output if any
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Asks for a new headline label, and replaces the current label with this new one one the specified, or currently selected node
     * @param p_node Specifies which node to rename, or leave undefined to rename the currently selected node
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @returns Thenable that resolves when done
     */
    public editHeadline(p_node?: LeoOutlineNode, p_fromOutline?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, { tree: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement editHeadline' +
            " called from " +
            (p_fromOutline ? "outline" : "body") +
            " operate on " +
            (p_node ? p_node!.label : "the selected node")
        );

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Asks for a headline label to be entered and creates (inserts) a new node under the current, or specified, node
     * @param p_node specified under which node to insert, or leave undefined to use whichever is currently selected
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @param p_interrupt Signifies the insert action is actually interrupting itself (e.g. rapid CTRL+I actions by the user)
     * @returns Thenable that resolves when done
     */
    public insertNode(p_node?: LeoOutlineNode, p_fromOutline?: boolean, p_interrupt?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, { tree: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement insertNode' +
            " called from " +
            (p_fromOutline ? "outline" : "body") +
            (p_interrupt ? " as interrupt " : "") +
            " operate on " +
            (p_node ? p_node!.label : "the selected node")
        );

        this.launchRefresh();

        // if typed, accepted and inserted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * * Changes the marked state of a specified, or currently selected node
     * @param p_isMark Set 'True' to mark, otherwise unmarks the node
     * @param p_node Specifies which node use, or leave undefined to mark or unmark the currently selected node
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @returns Thenable that resolves when done
     */
    public changeMark(p_mark: boolean, p_node?: LeoOutlineNode, p_fromOutline?: boolean): Thenable<unknown> {

        this._setupRefresh(!!p_fromOutline, { tree: true });

        vscode.window.showInformationMessage('TODO: Implement changeMark' +
            " called from " +
            (p_fromOutline ? "outline" : "body") +
            (p_mark ? " as mark " : "as unmark") +
            " operate on " +
            (p_node ? p_node!.label : "the selected node")
        );

        this.launchRefresh();

        return Promise.resolve(true);

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

    /**
     * Returns clipboard content
    */
    public getTextFromClipboard(): string {
        return this.clipboardContent; //vscode.env.clipboard.readText(); // TODO
    }

    /**
     * * Close an opened Leo file
     * @returns the launchRefresh promise started after it's done closing the Leo document
     */
    public closeLeoFile(): Thenable<unknown> {

        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement closeLeoFile');

        const w_fakeTotalOpened = 1;

        if (w_fakeTotalOpened) {
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

        vscode.window.showInformationMessage('TODO: Implement newLeoFile');

        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

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
    public selectOpenedLeoDocument(p_index: number): Thenable<unknown> {

        // vscode.window.showInformationMessage('TODO: Implement selectOpenedLeoDocument' +
        //     " index: " + p_index);
        console.log('select opened commander index: ' + p_index);

        this.leo_c = g.app.commandersList[p_index];
        this._refreshOutline(true, RevealType.RevealSelect);

        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        // if selected and opened
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
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

    /**
     * * Test/Dummy command
     * @returns Thenable from the tested functionality
     */
    public test(): Thenable<unknown> {
        vscode.window.showInformationMessage("Test called!");
        console.log("Test called!");
        // console.log("this.leo_c.p.isSelected()", this.leo_c);

        // * DO LEO COMMAND BY NAME
        // keepSelection = False  # Set default, optional component of param
        // if "keep" in param:
        //     keepSelection = param["keep"]

        const func = this.leo_c.commandsDict['goto-next-visible'];
        if (!func) {
            console.error('Leo command not found');
        } else {
            console.log('HAS FUNC!');
            func.bind(this.leo_c)();
        }

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
