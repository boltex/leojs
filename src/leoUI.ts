import * as vscode from "vscode";
import * as showdown from "showdown";
import { DebouncedFunc, debounce } from "lodash";

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
    LeoGuiFindTabManagerSettings,
    ChooseDocumentItem,
    LeoDocument,
    ChooseRClickItem,
    UnlType
} from "./types";

import { Config } from "./config";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode, LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentsProvider } from "./leoDocuments";
import { LeoStates } from "./leoStates";
import { LeoBodyProvider } from "./leoBody";
import { LeoUndoNode, LeoUndosProvider } from "./leoUndos";
import { LeoStatusBar } from "./leoStatusBar";

import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";
import { Position, VNode } from "./core/leoNodes";
import { LeoGotoNode, LeoGotoProvider } from "./leoGoto";
import { LeoFrame, StringTextWrapper } from "./core/leoFrame";
import { LeoFindPanelProvider } from "./leoFindPanelWebview";
import { LeoSettingsProvider } from "./leoSettingsWebview";
import { LeoFind } from "./core/leoFind";
import { NullGui } from "./core/leoGui";
import { StringFindTabManager } from "./core/findTabManager";
import { QuickSearchController } from "./core/quicksearch";
import { IdleTime } from "./core/idle_time";
import { RClick } from "./core/mod_scripting";
import { HelpPanel } from "./helpPanel";
import { UnlProvider } from "./unlProvider";
import { LeoBodyDetachedProvider } from "./leoBodyDetached";
import { Undoer } from "./core/leoUndo";

/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI extends NullGui {
    // * State flags
    public leoStates: LeoStates;
    public verbose: boolean = true;
    public trace: boolean = false; //true;

    private _currentOutlineTitle: string = Constants.GUI.TREEVIEW_TITLE; // VScode's outline pane title: Might need to be re-set when switching visibility
    private _hasShownContextOpenMessage: boolean = false;

    // * Help Panel
    public helpPanelText = '# LeoJS Help Panel\n\nDocumentation given by \'help\' commands is shown here.\n\nUse Alt+X to open the minibuffer and type \'help\'';
    public helpDocumentPaneProvider!: HelpPanel;

    // * UNL link provider
    public linkProvider!: UnlProvider;

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
    public refreshPreserveRange = false; // this makes the next refresh cycle preserve the "findFocusTree" flag once.

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
    private _pendingReveal: Thenable<void> | undefined;
    private _nextRevealParams: {
        tree: vscode.TreeView<Position>, element: Position, options?: {
            select?: boolean;
            focus?: boolean;
            expand?: boolean | number;
        }
    } | undefined;

    private _revealNodeRetriedRefreshOutline: boolean = false; // USED IN _refreshOutline and _revealNode

    private _lastSelectedNode: Position | undefined;
    public lastSelectedNodeTime: number | undefined = 0; // Falsy means not set
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
    private _findNeedsFocus: number = 0; // 0 none, 1 find, 2 nav
    private _lastSettingsUsed: LeoSearchSettings | undefined; // Last settings loaded / saved for current document
    public findFocusTree = false;
    public findHeadlineRange: [number, number] = [0, 0];
    public findHeadlinePosition: Position | undefined;

    // * Help Panel
    public showdownConverter: showdown.Converter;
    private _helpPanel: vscode.WebviewPanel | undefined;

    // * Interactive Find Input
    private _interactiveSearchInputBox: vscode.InputBox | undefined;
    private _interactiveSearchOptions: {
        search: string,
        replace: string,
        word: boolean,
        regex: boolean,
        backward: boolean
    } = {
            search: "",
            replace: "",
            word: false,
            regex: false,
            backward: false
        };

    // * Reveal Timers
    private _gotSelectedNodeBodyTimer: undefined | NodeJS.Timeout;
    private _gotSelectedNodeRevealTimer: undefined | NodeJS.Timeout;
    private _showBodySwitchBodyTimer: undefined | NodeJS.Timeout;
    private _leoDocumentsRevealTimer: undefined | NodeJS.Timeout;

    // * Reveal Promises
    private _documentPaneReveal: Thenable<void> | undefined;
    private _undoPaneReveal: Thenable<void> | undefined;

    // * Documents Pane
    private _leoDocumentsProvider!: LeoDocumentsProvider;
    private _leoDocuments!: vscode.TreeView<LeoFrame>;
    private _leoDocumentsExplorer!: vscode.TreeView<LeoFrame>;
    private _lastLeoDocuments: vscode.TreeView<LeoFrame> | undefined;

    // * Goto nav panel
    public leoGotoProvider!: LeoGotoProvider;

    // * '@button' pane
    private _leoButtonsProvider!: LeoButtonsProvider;
    private _leoButtons!: vscode.TreeView<LeoButtonNode>;
    private _leoButtonsExplorer!: vscode.TreeView<LeoButtonNode>;
    private _rclickSelected: number[] = [];
    private _lastLeoButtons: vscode.TreeView<LeoButtonNode> | undefined;

    // * Undos pane
    private _leoUndosProvider!: LeoUndosProvider;
    private _leoUndos!: vscode.TreeView<LeoUndoNode>;
    private _leoUndosShown = false;
    private _leoUndosExplorer!: vscode.TreeView<LeoUndoNode>;
    private _leoUndosExplorerShown = false;
    private _lastLeoUndos: vscode.TreeView<LeoUndoNode> | undefined;

    // * Body pane
    private _changedBodyWithMirrorDetached: string | undefined = undefined; // "id/gnx" string as true
    private _changedDetachedWithMirrorBody: string | undefined = undefined; // "id/gnx" string as true
    private _bodyFileSystemStarted: boolean = false;
    private _detachedFileSystemStarted: boolean = false;
    private _bodyEnablePreview: boolean = true;
    private _leoFileSystem!: LeoBodyProvider; // as per https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api
    private _leoDetachedFileSystem!: LeoBodyDetachedProvider; // as per https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api
    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.
    public bodyDetachedTextDocument: vscode.TextDocument | undefined; // Last active detached body.
    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _languageFlagged: string[] = [];

    private _bodyPreviewMode: boolean = true;

    private _editorTouched: boolean = false; // Flag for applying editor changes to body when 'icon' state change and 'undo' back to untouched

    private _bodyStatesTimer: NodeJS.Timeout | undefined;

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
    public leoSettingsWebview: LeoSettingsProvider;

    // * Log Pane
    protected _leoLogPane: vscode.OutputChannel | undefined;

    // * Status Bar
    private _leoStatusBar: LeoStatusBar | undefined;

    // * Edit/Insert Headline Input Box System made with 'createInputBox'.
    private _hib: undefined | vscode.InputBox;
    private _hibResolve: undefined | ((value: string | PromiseLike<string | undefined> | undefined) => void);
    private _onDidHideResolve: undefined | ((value: PromiseLike<void> | undefined) => void);
    private _hibLastValue: undefined | string;
    private _hibInterrupted = false;
    private _hibDisposables: vscode.Disposable[] = [];

    // * Timing
    private _needLastSelectedRefresh = false; // USED IN showBody
    private _bodyLastChangedDocument: vscode.TextDocument | undefined; // Only set in _onDocumentChanged
    private _bodyLastChangedDocumentSaved: boolean = true; // don't use 'isDirty' of the document!

    // * Debounced method used to check for closed detached/body tabs
    public checkClosedTabs: (() => void);

    // * Debounced method used to refresh language of the active commander's detached bodies 
    public refreshCommanderDetachedLanguage: (() => void);

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
    public launchRefresh: DebouncedFunc<() => Promise<unknown>>;

    constructor(guiName = 'vscodeGui', private _context: vscode.ExtensionContext) {
        super(guiName);
        this.isNullGui = false;

        this.idleTimeClass = IdleTime;

        // * Setup States
        this.leoStates = new LeoStates(_context, this);

        // * Get configuration settings
        this.config = new Config(_context, this);

        // * Set required vscode configs if needed
        this.config.checkEnablePreview(true);
        this.config.checkCloseEmptyGroups(true);
        this.config.removeOldBodyWrap();
        this.config.checkBodyWrap(true);

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

        // * Debounced refresh flags and UI parts, along with language & wrap, when operation(s) are done executing
        this.checkClosedTabs = debounce(
            this._checkClosedTabs,
            Constants.CLEANUP_DEBOUNCE_DELAY
        );
        this.refreshCommanderDetachedLanguage = debounce(
            this._refreshCommanderDetachedLanguage,
            Constants.DETACHED_LANGUAGE_DELAY
        );
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

        // * Help panel helper
        this.showdownConverter = new showdown.Converter();

        // * Configuration / Welcome webview
        this.leoSettingsWebview = new LeoSettingsProvider(this._context, this);
    }

    /**
     * * Set all remaining local objects, set ready flag(s) and refresh all panels
     */
    public finishStartup(): void {

        if (g.app.windowList[this.frameIndex]) {
            g.app.windowList[this.frameIndex].startupWindow = true;
        }

        this.linkProvider = new UnlProvider();
        this._context.subscriptions.push(
            vscode.languages.registerDocumentLinkProvider(
                [
                    { scheme: Constants.URI_FILE_SCHEME },
                    { scheme: Constants.URI_UNTITLED_SCHEME },
                    { scheme: Constants.URI_LEOJS_SCHEME },
                    { scheme: Constants.URI_LEOJS_DETACHED_SCHEME },
                    { language: Constants.OUTPUT_CHANNEL_LANGUAGE }
                ],
                this.linkProvider
            )
        );

        // * Register a content provider for the help text panel
        this.helpDocumentPaneProvider = new HelpPanel(this);
        this._context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(Constants.URI_HELP_SCHEME, this.helpDocumentPaneProvider));
        setTimeout(() => {
            this.helpDocumentPaneProvider.update(vscode.Uri.parse(Constants.URI_HELP_SCHEME + ":" + Constants.URI_HELP_FILENAME));
        }, 250);

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
        this.leoGotoProvider = new LeoGotoProvider(this);

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
        this._leoDetachedFileSystem = new LeoBodyDetachedProvider(this);

        this._bodyMainSelectionColumn = 1;

        // * Create Status bar Entry
        this._leoStatusBar = new LeoStatusBar(this._context, this);

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

        // * 'onDid' event detections. All pushed as disposables in context.subscription.
        this._context.subscriptions.push(

            vscode.window.tabGroups.onDidChangeTabGroups((p_tabGroupEvent) =>
                this._onTabGroupsChanged(p_tabGroupEvent)
            ),
            vscode.window.tabGroups.onDidChangeTabs((p_tabEvent) =>
                this._onTabsChanged(p_tabEvent)
            ),

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

            // * React when TYPING and changing body pane
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
        if (g.app.windowList.length) {
            this._setupOpenedLeoDocument();// this sets this.leoStates.fileOpenedReady
        } else {
            this._setupNoOpenedLeoDocument(); // All closed now!
        }

        if (g.app.leoID && g.app.leoID !== 'None') {
            this.createLogPane();
            if (g.isNewLeoJSVersion) {
                this.showLogPane();
            }
            this.leoStates.leoIdUnset = false;
            this.leoStates.leoReady = true;
        } else {
            this.leoStates.leoIdUnset = true; // Block most UI & commands until 'setLeoIDCommand' succeeds.
        }
        this.leoStates.leojsStartupDone = true;

    }

    /**
     * Make all key and commands bindings
     */
    public makeAllBindings(): void {
        commandBindings.makeAllBindings(this, this._context);
    }

    public showSettings(): Promise<unknown> {
        return this.leoSettingsWebview.openWebview();
    }

    public async put_help(c: Commands, s: string, short_title: string): Promise<void> {
        s = g.dedent(s.trimEnd());
        s = this.showdownConverter.makeHtml(s);
        // Get the html file content and replace the three strings :
        // the 'nonce' string, the base url, and 'cspSource', the Content security policy source.
        const fileUri = g.vscode.Uri.joinPath(this._context.extensionUri, 'help-panel', 'index.html');
        const htmlDoc = await g.vscode.workspace.openTextDocument(fileUri);
        const nonce = Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join('');

        if (short_title.trim()) {
            short_title = `<h1>${short_title}</h1>\n`;
        }

        if (this._helpPanel) {
            // Already created
            const baseUri = this._helpPanel.webview.asWebviewUri(this._context.extensionUri);
            const html = htmlDoc.getText().replace(
                /#{nonce}/g,
                nonce
            ).replace(
                /#{root}/g,
                `${baseUri}`
            ).replace(
                /#{cspSource}/g,
                `${this._helpPanel.webview.cspSource}`
            ).replace(
                '#{title}',
                short_title
            ).replace(
                '#{body}',
                s
            );
            this._helpPanel.webview.html = html;
            this._helpPanel.reveal(undefined, true);
        } else {
            // First time showing help panel
            this._helpPanel = g.vscode.window.createWebviewPanel(
                'helpPanelWebview',
                'LeoJS Help',
                { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
                {
                    enableScripts: true,
                }
            );
            this._context.subscriptions.push(this._helpPanel);
            this._helpPanel.onDidDispose(
                () => {

                    this._helpPanel = undefined;
                },
                null,
                this._context.subscriptions
            );
            const baseUri = this._helpPanel.webview.asWebviewUri(this._context.extensionUri);
            const html = htmlDoc.getText().replace(
                /#{nonce}/g,
                nonce
            ).replace(
                /#{root}/g,
                `${baseUri}`
            ).replace(
                /#{cspSource}/g,
                `${this._helpPanel.webview.cspSource}`
            ).replace(
                '#{title}',
                short_title
            ).replace(
                '#{body}',
                s
            );

            this._helpPanel.iconPath = g.vscode.Uri.joinPath(this._context.extensionUri, 'resources', 'leoapp128px.png');
            this._helpPanel.webview.html = html;

        }

        // * Showing with Markdown preview, with the "markdown.showPreviewToSide" command
        // this.helpPanelText = s;

        // // * Close all open help panels 
        // await utils.closeLeoHelpPanels();

        // setTimeout(() => {
        //     const w_uri = vscode.Uri.parse(Constants.URI_HELP_SCHEME + ":" + Constants.URI_HELP_FILENAME);
        //     this.helpDocumentPaneProvider.update(w_uri);
        //     setTimeout(() => {
        //         // * Open the virtual document in the preview pane
        //         void vscode.commands.executeCommand('markdown.showPreviewToSide', w_uri);
        //     }, 60);
        // }, 0);

        // * Showing with standard readonly text document provider
        // const doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        // await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside });
    }

    /**
     * Status bar item click handler
     */
    public statusBar(): Thenable<string | undefined> {
        return this.unlToClipboard();
    }

    /**
     * Handles the calls from the DocumentLinkProvider for clicks on UNLs.
     */
    public async handleUnl(p_arg: { unl: string }): Promise<void> {
        if (!g.app.windowList.length) {
            // No file opened: exit
            g.es('Handle Unl: No Commanders opened');
            return;
        }
        const c = g.app.windowList[this.frameIndex].c;
        await this.triggerBodySave(true);
        try {

            if (p_arg.unl) {
                this.setupRefresh(
                    Focus.Body, // Finish in body pane given explicitly because last focus was in input box.
                    {
                        tree: true,
                        body: true,
                        goto: true,
                        states: true,
                        documents: true,
                        buttons: true
                    }
                );
                await g.openUrlOnClick(c, p_arg.unl);
                void this.launchRefresh();
                this.loadSearchSettings();

            } else {
                console.log('NO ARGUMENT FOR HANDLE URL! ', p_arg);
            }
        }
        catch (e) {
            console.log('FAILED HANDLE URL! ', p_arg);
        }
    }

    /**
     * Creates the 'this._leoLogPane' log pane output panel instance
     */
    public createLogPane(): asserts this is { _leoLogPane: vscode.OutputChannel } {
        if (!this._leoLogPane) {
            // * Log pane instantiation
            this._leoLogPane = vscode.window.createOutputChannel(Constants.GUI.LOG_PANE_TITLE);
            this._context.subscriptions.push(this._leoLogPane);
            if (g.logBuffer.length) {
                const buffer = g.logBuffer;
                while (buffer.length > 0) {
                    // Pop the bottom one and append it
                    g.es_print(buffer.shift()!);
                }
            }
        }
        // should now exists
        if (!this._leoLogPane) {
            throw new Error('_leoLogPane cannot initialize');
        }
    }

    /**
     * * Adds a message string to LeoJS log pane.
     * @param p_message The string to be added in the log
     */
    public addLogPaneEntry(p_message: string): void {
        if (this._leoLogPane) {
            this._leoLogPane.appendLine(p_message);
        } else {
            g.logBuffer.push(p_message);
        }
    }

    /**
     * * Reveals the log pane if not already visible
     */
    public showLogPane(p_focus?: boolean): void {
        this.createLogPane();
        this._leoLogPane.show(!p_focus); // use flag to preserve focus
    }

    /**
     * * Hides the log pane
     */
    public hideLogPane(): void {
        if (this._leoLogPane) {
            this._leoLogPane.hide();
        }
    }

    /**
     * * 'getStates' action for use in debounced method call
     */
    private _triggerGetStates(): void {

        const c = g.app.windowList[this.frameIndex].c;

        if (this._refreshType.states) {
            this._refreshType.states = false;
            const p = c.p;
            if (this._leoStatusBar && p && p.v) {
                const unl = c.frame.computeStatusUnl(p);
                this._leoStatusBar.setString(unl);
                this._leoStatusBar.setTooltip(p.h);
            }
            let w_canHoist = true;
            let w_topIsChapter = false;
            if (c.hoistStack.length) {
                const w_ph = c.hoistStack[c.hoistStack.length - 1].p;
                w_topIsChapter = w_ph.h.startsWith('@chapter ');
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
                canHoist: w_canHoist,
                topIsChapter: w_topIsChapter
                // 
            };
            this.leoStates.setLeoStateFlags(w_states);
            this.refreshUndoPane();
        }
        // Set leoChanged and leoOpenedFilename
        this.leoStates.leoChanged = c.changed;
        this.leoStates.leoOpenedFileName = c.fileName();

        this.refreshBodyStates(); // Set language and wrap states, if different.

        if (this._refreshType.documents) {
            this._refreshType.documents = false;
            this.refreshDocumentsPane();
        }
        if (this._refreshType.goto) {
            this._refreshType.goto = false;
            this.refreshGotoPane();
        }
        if (this._refreshType.buttons) {
            this._refreshType.buttons = false;
            this.refreshButtonsPane();
        }
    }

    /**
     * * Setup UI for having no opened Leo documents
     */
    private _setupNoOpenedLeoDocument(): void {
        // Close ALL detached bodies.
        const w_foundTabs: Set<vscode.Tab> = new Set();
        const w_foundUri: Set<vscode.Uri> = new Set();
        for (const p_tabGroup of vscode.window.tabGroups.all) {
            for (const p_tab of p_tabGroup.tabs) {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME
                ) {
                    w_foundTabs.add(p_tab);
                    w_foundUri.add((p_tab.input as vscode.TabInputText).uri);
                }
            }
        }
        if (w_foundTabs.size) {
            void vscode.window.tabGroups.close([...w_foundTabs], true);
            for (const w_uri of w_foundUri) {
                void vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', w_uri);
            }
        }
        this._nextRevealParams = undefined;
        void this.checkConfirmBeforeClose();
        this._leoStatusBar?.hide();
        this.leoStates.fileOpenedReady = false;
        this._bodyTextDocument = undefined;
        this.bodyDetachedTextDocument = undefined;
        this.lastSelectedNode = undefined;
        this._refreshOutline(false, RevealType.NoReveal);
        this.refreshDocumentsPane();
        this.refreshButtonsPane();
        this.refreshUndoPane();
        void this.closeBody();
    }

    /**
     * * A Leo file was opened: setup UI accordingly.
     * @param p_openFileResult Returned info about currently opened and editing document
     */
    private _setupOpenedLeoDocument(): void {
        this._needLastSelectedRefresh = true;

        const c = g.app.windowList[this.frameIndex].c;
        this.leoStates.leoOpenedFileName = c.fileName();
        this.leoStates.leoChanged = c.changed;

        // * Startup flag
        if (!this.leoStates.leoIdUnset && g.app.leoID !== 'None') {
            this.leoStates.fileOpenedReady = true;
        }

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
                    Constants.URI_LEOJS_SCHEME,
                    this._leoFileSystem,
                    { isCaseSensitive: true }
                )
            );
            this._bodyFileSystemStarted = true;
        }
        if (!this._detachedFileSystemStarted) {
            this._context.subscriptions.push(
                vscode.workspace.registerFileSystemProvider(
                    Constants.URI_LEOJS_DETACHED_SCHEME,
                    this._leoDetachedFileSystem,
                    { isCaseSensitive: true }
                )
            );
            this._detachedFileSystemStarted = true;
        }

        this.loadSearchSettings();
        if (this.config.showUnlOnStatusBar && !this.leoStates.leoIdUnset && g.app.leoID !== 'None') {
            this._leoStatusBar?.show();
        }
    }

    /**
     * * Handles the change of vscode config: a onDidChangeConfiguration event triggered
     * @param p_event The configuration-change event passed by vscode
     */
    private _onChangeConfiguration(p_event: vscode.ConfigurationChangeEvent): void {

        if (
            p_event.affectsConfiguration(Constants.CONFIG_NAME)
            // ||
            // p_event.affectsConfiguration('editor.fontSize') ||
            // p_event.affectsConfiguration('window.zoomLevel')
        ) {
            void this.config.setLeoJsSettingsPromise.then(
                () => {
                    this.config.buildFromSavedSettings();
                    void this.leoSettingsWebview.changedConfiguration();
                    if (
                        p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.INVERT_NODES) ||
                        p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.SHOW_EDIT) ||
                        p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.SHOW_ADD) ||
                        p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.SHOW_MARK) ||
                        p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.SHOW_CLONE) ||
                        p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.SHOW_COPY)
                    ) {
                        this.configTreeRefresh();
                    }
                    if (this.config.showUnlOnStatusBar && this.leoStates.fileOpenedReady && this._leoStatusBar) {
                        this._leoStatusBar.show();
                    }
                    if (!this.config.showUnlOnStatusBar && this._leoStatusBar) {
                        this._leoStatusBar.hide();
                    }
                    if (p_event.affectsConfiguration(Constants.CONFIG_NAME + "." + Constants.CONFIG_NAMES.LEO_ID)) {
                        void this.setIdSetting(this.config.leoID);
                    }
                }
            );
        }

        // also check if workbench.editor.enablePreview
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // Check For specific vscode settings needed for leojs
        // Leave a delay for multiple possible forced changes at startup
        setTimeout(() => {
            this.config.checkEnablePreview();
            this.config.checkCloseEmptyGroups();
            this.config.checkBodyWrap();
        }, 1500);
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
                void vscode.window.showInformationMessage(Constants.USER_MESSAGES.RIGHT_CLICK_TO_OPEN);
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
    private async _onChangeCollapsedState(p_event: vscode.TreeViewExpansionEvent<Position>, p_expand: boolean, p_treeView: vscode.TreeView<Position>): Promise<unknown> {

        // * Expanding or collapsing via the treeview interface selects the node to mimic Leo.
        await this.triggerBodySave(true); // Get any modifications from the editor into the Leo's body model
        if (p_treeView.selection.length && p_treeView.selection[0] && p_treeView.selection[0].__eq__(p_event.element)) {
            // * This happens if the tree selection is the same as the expanded/collapsed node: Just have Leo do the same
            // pass
        } else {
            // * This part only happens if the user clicked on the arrow without trying to select the node
            if (this.config.leoTreeBrowse) {
                // * This part only happens if the user clicked on the arrow without trying to select the node
                void this._revealNode(p_event.element, { select: true, focus: false }); // No force focus : it breaks collapse/expand when direct parent
                void this.selectTreeNode(p_event.element, true); // not waiting for a .then(...) so not to add any lag
            }
        }

        // * vscode will update its tree by itself, but we need to change Leo's model of its outline
        if (p_expand) {
            return p_event.element.expand();
        } else {
            return p_event.element.contract();
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
            this._lastLeoButtons = p_explorerView ? this._leoButtonsExplorer : this._leoButtons;
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onUndosTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_event.visible) {
            const lastLeoUndos = p_explorerView ? this._leoUndosExplorer : this._leoUndos;
            const undosShown = p_explorerView ? this._leoUndosExplorerShown : this._leoUndosShown;

            this._lastLeoUndos = lastLeoUndos;
            if (undosShown) {
                this._leoUndosProvider.refreshTreeRoot(); // Already shown, will redraw but not re-select
            }

            if (p_explorerView) {
                this._leoUndosExplorerShown = true;
            } else {
                this._leoUndosShown = true;
            }
        }
    }

    /**
     * * Handle the change of visibility of either find panel
     * @param p_event The visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onFindViewVisibilityChanged(p_explorerView: boolean): void {
        const currentView = p_explorerView ? this._findPanelWebviewExplorerView : this._findPanelWebviewView;

        if (currentView?.visible) {
            this._lastFindView = currentView;
            this.checkForceFindFocus(false);
            this.setGotoContent();

            if (this.leoGotoProvider.isSelected) {
                this.revealGotoNavEntry(this.leoGotoProvider.selectedNodeIndex, true);
            }
        }
    }

    /**
     * React to the closing of 'tabs' via
     * events from vscode.window.tabGroups
     */
    public _onTabGroupsChanged(p_event: vscode.TabGroupChangeEvent): void {
        this.checkClosedTabs(); // debounced
    }

    /**
     * React to the closing of 'tabgroups' via
     * events from vscode.window.tabGroups
     */
    public _onTabsChanged(p_event: vscode.TabChangeEvent): void {
        this.checkClosedTabs(); // debounced
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
        if (p_editor) {
            this._hideBodiesUnknownToFileSys([p_editor]);
        }
        if (!p_internalCall) {
            void this.triggerBodySave(true, true); // Save in case edits were pending
        }
        // // set _bodyDetachedTextDocument AFTER triggerBodySave, as focus may already have been in a dirty detached body.
        // if (p_editor && p_editor.document.uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME) {
        //     this.bodyDetachedTextDocument = p_editor.document; // Next triggerBodySave will apply to this newly focused one.
        // }

    }

    /**
     * * Moved a document to another column
     * @param p_columnChangeEvent Event describing the change of a text editor's view column
     */
    public _changedTextEditorViewColumn(
        p_columnChangeEvent: vscode.TextEditorViewColumnChangeEvent
    ): void {
        if (p_columnChangeEvent && p_columnChangeEvent.textEditor.document.uri.scheme === Constants.URI_LEOJS_SCHEME) {
            this._checkPreviewMode(p_columnChangeEvent.textEditor);
        }
        void this.triggerBodySave(true, true);
    }

    /**
     * * Tabbed on another editor
     * @param p_editors text editor array (to be checked for changes in this method)
     */
    public _changedVisibleTextEditors(p_editors: readonly vscode.TextEditor[]): void {
        if (p_editors && p_editors.length) {
            // May be no changes - so check length
            this._hideBodiesUnknownToFileSys(p_editors);
        }
        void this.triggerBodySave(true, true);
    }

    /**
     * * Whole window has been minimized/restored
     * @param p_windowState the state of the window that changed
     */
    public _changedWindowState(p_windowState: vscode.WindowState): void {
        // no other action
        void this.triggerBodySave(true, true);
    }

    /**
     * * Handles detection of the active editor's selection change or cursor position
     * @param p_event a change event containing the active editor's selection, if any.
     */
    private _onChangeEditorSelection(p_event: vscode.TextEditorSelectionChangeEvent): void {
        if (
            p_event.textEditor.document.uri.scheme === Constants.URI_LEOJS_SCHEME ||
            p_event.textEditor.document.uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME
        ) {
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
        if (p_event.textEditor.document.uri.scheme === Constants.URI_LEOJS_SCHEME ||
            p_event.textEditor.document.uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME) {
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

        if (
            p_textDocumentChange.contentChanges.length &&
            (p_textDocumentChange.document.uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME)
        ) {

            const [unused, id, gnx] = p_textDocumentChange.document.uri.path.split("/");
            const w_bodyText = p_textDocumentChange.document.getText().replace(/\r\n/g, "\n");
            const w_hasBody = !!w_bodyText.length;

            const w_selectedCId = g.app.windowList[this.frameIndex].c.id.toString();
            const w_sameCommander = w_selectedCId === id;
            let w_needDocRefresh = false;
            let w_alreadySaved = false;
            let w_v: VNode | undefined;

            let c: Commands | undefined; // The modified text document's body's commander.

            for (const w_frame of g.app.windowList) {
                if (w_frame.c.id.toString() === id) {
                    c = w_frame.c;
                    break;
                }
            }
            if (c) {
                w_v = c.fileCommands.gnxDict[gnx];
                if (this._changedBodyWithMirrorDetached || (w_v && (w_bodyText === w_v.b))) {
                    // WAS NOT A USER MODIFICATION?
                    this._changedBodyWithMirrorDetached = undefined;
                    return;
                }
            }

            this.bodyDetachedTextDocument = p_textDocumentChange.document;

            // * If body changed a line with and '@' directive refresh body states
            let w_needsRefresh = false;
            for (const p_change of p_textDocumentChange.contentChanges) {
                if (p_change.rangeLength || p_change.text.includes('@')) {
                    // There may have been an @
                    w_needsRefresh = true;
                    break;
                }
            }

            // * Detect in active editor if current cursor line is language related, set w_needsRefresh if so.
            const w_textEditor = vscode.window.activeTextEditor;
            if (
                w_textEditor && w_textEditor.selections && w_textEditor.selections.length &&
                !w_needsRefresh && p_textDocumentChange.document.uri.fsPath === w_textEditor.document.uri.fsPath
            ) {
                for (const p_selection of w_textEditor.selections) {
                    if (p_selection.active.line < w_textEditor.document.lineCount) {
                        // TRY TO DETECT IF LANGUAGE RESET NEEDED!
                        let w_line = w_textEditor.document.lineAt(p_selection.active.line).text;
                        if (w_line.trim().startsWith('@') || w_line.includes('language') || w_line.includes('wrap') || w_line.includes('killcolor') || w_line.includes('nocolor-node')) {
                            w_needsRefresh = true;
                            break;
                        }
                    }
                }
            }

            const w_uriKey = utils.leoUriToStr(this.bodyDetachedTextDocument.uri);
            const w_node = this._leoDetachedFileSystem.openedBodiesVNodes[w_uriKey];
            const w_detachedIconChanged = !w_node.isDirty() || (!!w_node.bodyString().length === !w_hasBody);

            // If same commander, and node icon changed (or whole document was unchanged)
            if (w_sameCommander) {
                if (!this.leoStates.leoChanged || w_detachedIconChanged) {
                    if (!w_alreadySaved) {
                        void this._bodySaveDocument(this.bodyDetachedTextDocument);
                        w_alreadySaved = true;
                    }
                    if (w_detachedIconChanged) {
                        this.findFocusTree = false;
                        // NOT incrementing this.treeID to keep ids intact
                        // NoReveal since we're keeping the same id.
                        this._refreshOutline(false, RevealType.NoReveal);
                    }
                }
            } else {
                if (c && !c.isChanged()) {
                    w_needDocRefresh = true;
                    if (!w_alreadySaved) {
                        void this._bodySaveDocument(this.bodyDetachedTextDocument);
                        w_alreadySaved = true;
                    }
                }
            }

            if (w_needsRefresh) {
                if (!w_alreadySaved) {
                    void this._bodySaveDocument(this.bodyDetachedTextDocument);
                    w_alreadySaved = true;
                }
                // REFRESH LANGUAGE OF THIS DETACHED BODY
                const w_foundVnode = this._leoDetachedFileSystem.openedBodiesVNodes[utils.leoUriToStr(p_textDocumentChange.document.uri)];
                if (w_foundVnode) {

                    const gnx = w_foundVnode.gnx;

                    for (const p of w_foundVnode.context.all_unique_positions()) {
                        if (p.v.gnx === gnx) {
                            if (!w_alreadySaved) {
                                void this._bodySaveDocument(this.bodyDetachedTextDocument);
                                w_alreadySaved = true;
                            }
                            let w_language = this._getBodyLanguage(p); // !! 
                            // Set document language only if different
                            if (w_language !== this.bodyDetachedTextDocument.languageId) {
                                void this._setBodyLanguage(this.bodyDetachedTextDocument, w_language).then((p_doc) => {
                                    this.bodyDetachedTextDocument = p_doc;
                                });
                            }
                            break;
                        }
                    }


                } else {
                    console.log('DETACHED VNODE not found when resetting language');
                }
                // REFRESH LANGUAGE OF OTHER DETACHED BODIES WITH DELAY
                this.refreshCommanderDetachedLanguage();
            }

            // * CHECK FOR BODY THAT MATCHES! set w_sameBodyTabOpened if so.
            let w_sameBodyTabOpened = false;
            for (const p_tabGroup of vscode.window.tabGroups.all) {
                for (const p_tab of p_tabGroup.tabs) {
                    if (p_tab.input &&
                        (p_tab.input as vscode.TabInputText).uri &&
                        ((p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME)
                    ) {
                        if (gnx === utils.leoUriToStr((p_tab.input as vscode.TabInputText).uri)) {
                            w_sameBodyTabOpened = true;
                            break;
                        }
                    }
                }
                if (w_sameBodyTabOpened) {
                    break;
                }
            }

            // Check if exact same commander AND same gnx: BOTH THE SAME so refresh the body!
            if (w_sameCommander) {
                if (w_sameBodyTabOpened && this.lastSelectedNode && gnx === this.lastSelectedNode.gnx) {
                    // Same commander AND same gnx  !  
                    if (!w_alreadySaved) {
                        // console.log('bodySAVE DETACHED because same tab opened');
                        void this._bodySaveDocument(this.bodyDetachedTextDocument);
                        w_alreadySaved = true;
                    }
                    if (this._leoFileSystem.watchedBodiesGnx.includes(gnx)) {
                        // console.log("setting changedDetachedWithMirrorBody");

                        this._changedDetachedWithMirrorBody = `${id}/${gnx}`; // PREVENT DOUBLE REFRESH
                    }
                    // console.log('fire refresh of body');
                    this._leoFileSystem.fireRefreshFile(this.lastSelectedNode.gnx);
                }
                if (w_needsRefresh) {
                    this.debouncedRefreshBodyStates(50); // And maybe changed in other node of same commander!
                }

            } else if (w_needDocRefresh) {
                this.refreshDocumentsPane();
            }
            if (!this.leoStates.leoChanged && w_sameCommander) {
                // also refresh document panel (icon may be dirty now)
                this.leoStates.leoChanged = true;
                this.refreshDocumentsPane();
            }

        }

        // ".length" check necessary, see https://github.com/microsoft/vscode/issues/50344
        if (
            this.lastSelectedNode &&
            p_textDocumentChange.contentChanges.length &&
            p_textDocumentChange.document.uri.scheme === Constants.URI_LEOJS_SCHEME
        ) {
            // this.bodyDetachedTextDocument = undefined;
            const c = g.app.windowList[this.frameIndex].c;

            // * There was a on a Leo Body by the user OR FROM LEO REFRESH FROM FILE
            this._bodyLastChangedDocument = p_textDocumentChange.document;
            this._bodyLastChangedDocumentSaved = false;
            this._editorTouched = true; // To make sure to transfer content to Leo even if all undone
            this._bodyPreviewMode = false;
            let w_hasSameDetachedTab = false;
            let w_hasOtherDetachedTab = false;
            const c_id = c.id.toString();
            const w_lastSelNodeGnx = this.lastSelectedNode.gnx;

            // CHECK FOR DETACHED THAT MATCHES! 
            for (const p_tabGroup of vscode.window.tabGroups.all) {
                for (const p_tab of p_tabGroup.tabs) {
                    if (p_tab.input &&
                        (p_tab.input as vscode.TabInputText).uri &&
                        (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME
                    ) {
                        const [unused, id, gnx] = (p_tab.input as vscode.TabInputText).uri.path.split("/");
                        if (id === c_id && gnx === w_lastSelNodeGnx) {
                            w_hasSameDetachedTab = true;
                        } else {
                            w_hasOtherDetachedTab = true;
                        }
                    }
                }
            }

            // * If icon should change then do it now (if there's no document edit pending)
            if (
                utils.leoUriToStr(p_textDocumentChange.document.uri) === w_lastSelNodeGnx
            ) {
                const w_bodyText = p_textDocumentChange.document.getText().replace(/\r\n/g, "\n");
                const w_hasBody = !!w_bodyText.length;
                const w_iconChanged = utils.isIconChangedByEdit(this.lastSelectedNode, w_hasBody) || this.findFocusTree;

                if (this._changedDetachedWithMirrorBody || (c.p && c.p.__bool__() && w_bodyText === c.p.b)) {
                    // WAS NOT A USER MODIFICATION? (external file change, replace, replace-then-find)
                    // Set proper cursor insertion point and selection range.
                    this._changedDetachedWithMirrorBody = undefined;
                    void this.showBody(false, true, true);
                    return;
                }

                if (!this.leoStates.leoChanged || w_iconChanged || w_hasSameDetachedTab) {
                    // Document pane icon needs refresh (changed) and/or outline icon changed
                    void this._bodySaveDocument(p_textDocumentChange.document).then(() => {
                        if (w_hasSameDetachedTab && this.lastSelectedNode) {
                            const gnxString = `${c.id}/${w_lastSelNodeGnx}`;
                            if (this._leoDetachedFileSystem.watchedBodiesGnx.includes(gnxString)) {
                                this._changedBodyWithMirrorDetached = gnxString; // PREVENT DOUBLE REFRESH
                            }
                            this._leoDetachedFileSystem.fireRefreshFile(gnxString);
                        }
                        if (w_iconChanged) {
                            this.findFocusTree = false;
                            // NOT incrementing this.treeID to keep ids intact
                            // NoReveal since we're keeping the same id.
                            this._refreshOutline(false, RevealType.NoReveal);
                        }
                    });

                    if (!this.leoStates.leoChanged) {
                        // also refresh document panel (icon may be dirty now)
                        this.leoStates.leoChanged = true;
                        this.refreshDocumentsPane();
                    }
                }
            }

            // * If body changed a line with and '@' directive refresh body states
            let w_needsRefresh = false;
            for (const p_change of p_textDocumentChange.contentChanges) {
                if (p_change.rangeLength || p_change.text.includes('@')) {
                    // There may have been an @
                    w_needsRefresh = true;
                    break;
                }
            }

            const w_textEditor = vscode.window.activeTextEditor;

            if (w_textEditor && p_textDocumentChange.document.uri.fsPath === w_textEditor.document.uri.fsPath) {
                for (const p_selection of w_textEditor.selections) {
                    // TRY TO DETECT IF LANGUAGE RESET NEEDED!
                    if (p_selection.active.line < w_textEditor.document.lineCount) {
                        let w_line = w_textEditor.document.lineAt(p_selection.active.line).text;
                        if (w_line.trim().startsWith('@') || w_line.includes('language') || w_line.includes('wrap') || w_line.includes('killcolor') || w_line.includes('nocolor-node')) {
                            w_needsRefresh = true;
                            break;
                        }
                    }
                }
            }
            if (w_hasOtherDetachedTab) {
                this.refreshDocumentsPane();
            }
            if (w_needsRefresh) {
                this.debouncedRefreshBodyStates(1);
                this.refreshCommanderDetachedLanguage();
            }

        }
    }

    /**
     * * Capture instance for further calls on find panel webview
     * @param p_panel The panel (usually that got the latest onDidReceiveMessage)
     */
    public setFindPanel(p_panel: vscode.WebviewView): void {
        if (p_panel.viewType === Constants.FIND_EXPLORER_ID) {
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
        this.setGotoContent();
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

            // const c = g.app.windowList[this.frameIndex].c;
            // titleDesc = c.frame.title;

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

    public checkConfirmBeforeClose(): void {
        let hasDirty = false;
        for (const frame of g.app.windowList) {
            if (frame.c.changed) {
                hasDirty = true;
            }
        }
        void this.config.setConfirmBeforeClose(hasDirty);
    }

    /**
     * * Validate headline edit input box if active, or, Save body to the Leo app if its dirty.
     *   That is, only if a change has been made to the body 'document' so far
     * @param p_forcedVsCodeSave Flag to also have vscode 'save' the content of this editor through the filesystem
     * @returns a promise that resolves when the possible saving process is finished
     */
    public triggerBodySave(p_forcedVsCodeSave?: boolean, p_fromFocusChange?: boolean): Thenable<unknown> {

        // * Check if headline edit input box is active. Validate it with current value.
        if (!p_fromFocusChange && this._hib && this._hib.enabled) {
            this._hibInterrupted = true;
            this._hib.enabled = false;
            this._hibLastValue = this._hib.value;
            this._hib.hide();
            if (this._onDidHideResolve) {
                console.error('IN triggerBodySave AND _onDidHideResolve PROMISE ALREADY EXISTS!');
            }
            const w_resolveAfterEditHeadline = new Promise<void>((p_resolve, p_reject) => {
                this._onDidHideResolve = p_resolve;
            });
            return w_resolveAfterEditHeadline;
        }

        // * Save any 'detached' dirty panels to leo
        for (const doc of vscode.workspace.textDocuments) {
            if (!doc.isClosed && doc.isDirty && doc.uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME) {
                void this._bodySaveDocument(doc, p_forcedVsCodeSave);
            }
        }

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
     * Saves the cursor position along with the text selection range and scroll position
     * of the last body, or detached body pane, that had its cursor info set in this._selection, etc.
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

        let gnx: string | undefined;
        let c: Commands | undefined;
        let id: string;

        if (!this._selectionGnx.includes('/')) {
            c = g.app.windowList[this.frameIndex].c;
            gnx = this._selectionGnx;
        } else {
            [id, gnx] = this._selectionGnx.split('/');
            for (const w_f of g.app.windowList) {
                if (w_f.c.id.toString() === id) {
                    c = w_f.c;
                    break;
                }
            }
        }

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
        if (!c || !gnx) {
            return;
        }
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
        v.selectionStart = startSel < endSel ? startSel : endSel;
        v.selectionLength = Math.abs(startSel - endSel);

        this._scrollDirty = false;
        this._selectionDirty = false;

    }

    /**
     * * Sets new body (or detached body) text on leo's side, and may optionally save vsCode's body editor (which will trim spaces)
     * @param p_document Vscode's text document which content will be used to be the new node's body text in Leo
     * @param p_forcedVsCodeSave Flag to also have vscode 'save' the content of this editor through the filesystem
     * @returns a promise that resolves when the complete saving process is finished
     */
    private _bodySaveDocument(
        p_document: vscode.TextDocument,
        p_forcedVsCodeSave?: boolean
    ): Thenable<boolean> {
        if (p_document) {

            // const c = g.app.windowList[this.frameIndex].c;
            // const u = c.undoer;
            // const wrapper = c.frame.body.wrapper;
            // const w_gnx = utils.leoUriToStr(p_document.uri);
            const body = p_document.getText().replace(/\r\n/g, "\n"); // new body text

            let id: string = ""; // STARTS FALSY
            let c: Commands | undefined;
            let u: Undoer | undefined;
            let wrapper: StringTextWrapper | undefined;
            let w_gnx: string | undefined;
            let w_v: VNode | undefined;

            if (p_document.uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME) {
                // detached body
                id = p_document.uri.path.split("/")[1];
                // find commander
                for (const w_frame of g.app.windowList) {
                    if (w_frame.c.id.toString() === id) {
                        c = w_frame.c;
                        break;
                    }
                }
                if (c) {
                    u = c.undoer;
                    wrapper = c.frame.body.wrapper;
                    w_gnx = p_document.uri.path.split("/")[2];
                    w_v = c.fileCommands.gnxDict[w_gnx];
                }
            } else {
                // regular body
                c = g.app.windowList[this.frameIndex].c;
                u = c.undoer;
                wrapper = c.frame.body.wrapper;
                w_gnx = utils.leoUriToStr(p_document.uri);
                w_v = c.fileCommands.gnxDict[w_gnx];
            }

            if (c && w_v && w_gnx && wrapper && u) {

                if (body !== w_v.b && !g.doHook("bodykey1", { c: c, v: w_v })) {
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
                        // Set in wrapper too if same gnx
                        if (c.p.__eq__(w_p)) {
                            wrapper.setAllText(body);
                        }
                        if (!c.isChanged()) {
                            c.setChanged();
                        }
                        if (!w_p.v.isDirty()) {
                            w_p.setDirty();
                        }
                        // this.clearHeadlineSelection();
                    }
                    g.doHook("bodykey2", { c: c, v: w_v });
                }

            } else {
                console.error("ERROR SAVING BODY FROM VSCODE TO LEOJS");
                if (p_forcedVsCodeSave) {
                    return p_document.save(); // ! USED INTENTIONALLY: This trims trailing spaces
                }
                return Promise.resolve(false); // EARLY EXIT
            }

            // save the cursor selection, supports both body and detached bodies
            this._bodySaveSelection();

            if (!id) {
                // if NOT detached
                this._refreshType.states = true;
                this.getStates();
            }

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
            w_v.b = p_document.getText().replace(/\r\n/g, "\n");
        }

        return Promise.resolve(true);
    }

    /**
     * Reveal that queues a follow up to prevent revealing before the last one finished.
     */
    public safeReveal(tree: vscode.TreeView<Position>, element: Position, options?: {
        select?: boolean;
        focus?: boolean;
        expand?: boolean | number;
    }): Thenable<void> {
        if (!this._pendingReveal) {
            // No reveal is currently pending, start the reveal
            this._pendingReveal = this._performReveal(tree, element, options);
            return this._pendingReveal;
        } else {
            // A reveal is already pending, store the parameters for the next reveal
            this._nextRevealParams = { tree, element, options };
            return this._pendingReveal;
        }
    }

    private _performReveal(tree: vscode.TreeView<Position>, element: Position, options?: {
        select?: boolean;
        focus?: boolean;
        expand?: boolean | number;
    }): Thenable<void> {
        return tree.reveal(element, options).then(
            () => this._handleRevealCompletion(),
            (error) => this._handleRevealCompletion(error)
        );
    }

    private _handleRevealCompletion(error?: any): Thenable<void> | void {
        if (this._nextRevealParams) {
            // If there are queued reveal parameters, start the next reveal
            const { tree, element, options } = this._nextRevealParams;
            this._nextRevealParams = undefined;
            this._pendingReveal = this._performReveal(tree, element, options);
            return this._pendingReveal;
        } else {
            // No more reveals are queued, clear the pending reveal
            this._pendingReveal = undefined;
            if (error) {
                // Propagate the error if there was one
                throw error;
            }
        }
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
        this.safeReveal(this._lastTreeView, c.p, {
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
    public setupRefresh(p_finalFocus: Focus, p_refreshType?: ReqRefresh, p_preserveRange?: boolean): void {
        if (p_preserveRange) {
            this.refreshPreserveRange = true; // Will be cleared after a refresh cycle.
        }
        // Set final "focus-placement" EITHER true or false
        this.finalFocus = p_finalFocus;

        if (p_refreshType) {
            // Set all properties WITHOUT clearing others.
            Object.assign(this._refreshType, p_refreshType);
        }
    }

    /**
     * * Launches refresh for UI components and context states (Debounced)
     */
    public async _launchRefresh(): Promise<unknown> {

        this._refreshDetachedBodies();

        if (!this.refreshPreserveRange) {
            if (this.findFocusTree) {
                // had a range but now refresh from other than find/replace
                // So make sure tree is also refreshed.
                this._refreshType.tree = true;
            }
            // Clear no matter what.
            this.findFocusTree = false;
        } else {
            this.refreshPreserveRange = false; // preserved once, now cleared.
        }

        // check states for having at least a document opened
        if (this.leoStates.leoReady && this.leoStates.fileOpenedReady) {
            // Had some opened
            if (!g.app.windowList.length) {
                return this._setupNoOpenedLeoDocument(); // All closed now!
            }
        }

        // Maybe first refresh after opening
        if (this.leoStates.leoReady && !this.leoStates.fileOpenedReady) {
            // Was all closed
            if (g.app.windowList.length) {
                this._setupOpenedLeoDocument();
                // Has a commander opened, but wait for UI!
                await this.leoStates.qLastContextChange;
            } else {
                // First time starting: not even an untitled nor workbook.leo
                return;
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
                void this._bodyLastChangedDocument.save(); // Voluntarily save to 'clean' any pending body (no await)
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

        // console.log('showBodyIfClosed', this.showBodyIfClosed);// 
        // console.log('showOutlineIfClosed', this.showOutlineIfClosed);// 
        // console.log('explorer visible', this._leoTreeExView.visible);// 
        // console.log('visible', this._leoTreeView.visible); // 
        // console.log('this._refreshType.tree', this._refreshType.tree);
        // console.log('this._refreshType.body', this._refreshType.body); //

        // * Force refresh tree when body update required for 'navigation/insert node' commands
        if (
            this.showBodyIfClosed &&
            this.showOutlineIfClosed &&
            !this.isOutlineVisible() &&
            this._refreshType.body
        ) {
            // console.log('HAD TO ADJUST!');
            this._refreshType.tree = true;
        }

        // * Either the whole tree refreshes, or a single tree node is revealed when just navigating
        if (this._refreshType.tree) {
            this._refreshType.tree = false;
            this._refreshType.node = false; // Also clears node
            if (!this.isOutlineVisible() && !this.showOutlineIfClosed && this._refreshType.body) {
                // wont get 'gotSelectedNode so show body!
                this._refreshType.body = false;
                void this._tryApplyNodeToBody(this._refreshNode || this.lastSelectedNode!, false, w_showBodyNoFocus);
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
                void vscode.commands.executeCommand(w_treeName + '.focus');

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
            void this._revealNode(
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
                    void this._tryApplyNodeToBody(this._refreshNode, false, w_showBodyNoFocus);
                }
            }
        } else if (this._refreshType.body) {
            this._refreshType.body = false;
            void this._tryApplyNodeToBody(this._refreshNode || this.lastSelectedNode!, false, w_showBodyNoFocus);
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
     * * Refreshes all parts.
     * @returns Promise back from command's execution, if added on stack, undefined otherwise.
     */
    public fullRefresh(p_keepFocus?: boolean): void {
        this.setupRefresh(
            p_keepFocus ? Focus.NoChange : this.finalFocus,
            {
                tree: true,
                body: true,
                states: true,
                buttons: true,
                documents: true,
                goto: true,
            }
        );
        void this.launchRefresh();
    }

    private _refreshDetachedBodies() {
        //  Refresh detached bodies as needed IF SAME COMMANDER, AND CLOSE : 
        if (!g.app.windowList.length) {
            this._refreshType.excludeDetached = false;
            return;
        }

        const w_commands = g.app.windowList.map(p_frame => p_frame.c);
        const c = g.app.windowList[this.frameIndex].c;
        const cId = g.app.windowList[this.frameIndex].c.id.toString();
        const w_unfoundTabs: Set<vscode.Tab> = new Set(); // To be closed
        const w_unfoundUri: Set<vscode.Uri> = new Set(); // To be removed from recently opened
        let w_hasDetached = false;

        for (const p_tabGroup of vscode.window.tabGroups.all) {
            for (const p_tab of p_tabGroup.tabs) {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME
                ) {
                    const w_uri = (p_tab.input as vscode.TabInputText).uri;
                    const [unused, id, gnx] = w_uri.path.split("/");
                    if (id === cId) {
                        w_hasDetached = true;
                    }

                    // Refresh detached bodies if same commander  // ! ALSO FIRE REFRESH !
                    if (!this._refreshType.excludeDetached && this._refreshType.body && id === cId) {
                        // console.log('fire refresh DETACHED in _refreshDetachedBodies');
                        this._leoDetachedFileSystem.fireRefreshFile(`${id}/${gnx}`);
                    }

                    // if refresh tree is true, validate that opened detached of same commander still valid and close as needed.
                    if (this._refreshType.tree && id === cId && !this._refreshType.documents) {
                        let found = false;
                        for (const v of c.all_unique_nodes()) {
                            if (v.gnx === gnx) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            // close !
                            w_unfoundTabs.add(p_tab);
                            w_unfoundUri.add(w_uri);
                        }
                    } else if (this._refreshType.documents) {
                        let found = false;
                        for (const w_c of w_commands) {
                            for (const v of w_c.all_unique_nodes()) {
                                if (v.gnx === gnx) {
                                    found = true;
                                    break;
                                }
                            }
                            if (found) {
                                break;
                            }
                        }
                        if (!found) {
                            // close !
                            w_unfoundTabs.add(p_tab);
                            w_unfoundUri.add(w_uri);
                        }

                    }

                }

            }
        }
        if (w_hasDetached && this._refreshType.tree) {
            this.refreshCommanderDetachedLanguage(); // May have moved outside of language specific outline
        }
        if (w_unfoundTabs.size) {
            void vscode.window.tabGroups.close([...w_unfoundTabs], true);
            for (const w_uri of w_unfoundUri) {
                void vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', w_uri);
            }
        }
        this._refreshType.excludeDetached = false;

    }

    public showNavResults(): Thenable<unknown> {
        this.leoGotoProvider.refreshTreeRoot();
        return this.showGotoPane({ preserveFocus: true }); // show but dont change focus
    }

    /**
     * * Checks timestamp only, if is still the latest lastReceivedNode
      * @param ts timestamp of last time
     */
    public isTsStillValid(ts: number): boolean {

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
    ): void {
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
                this.safeReveal(w_treeview, p_leoNode, p_options).then(
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
            this.safeReveal(this._lastTreeView, p_node, {
                select: true,
                focus: false
            }).then(
                () => {
                    //ok
                },
                () => {
                    // 
                    console.log('gotSelectedNode scroll mode reveal error catched');
                }
            );
            // ! MINIMAL TIMEOUT REQUIRED ! WHY ?? (works so leave)
            if (this._gotSelectedNodeBodyTimer) {
                clearTimeout(this._gotSelectedNodeBodyTimer);
            }
            this._gotSelectedNodeBodyTimer = setTimeout(() => {
                // SAME with scroll information specified
                void this.showBody(false, this.finalFocus.valueOf() !== Focus.Body);
            }, 25);
        } else {

            if (this._revealType) {
                if (this._gotSelectedNodeRevealTimer) {
                    clearTimeout(this._gotSelectedNodeRevealTimer);
                }
                this._gotSelectedNodeRevealTimer = setTimeout(() => {
                    this.safeReveal(this._lastTreeView, p_node, {
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
                void this._tryApplyNodeToBody(p_node, false, w_showBodyNoFocus);
            }

            // Set context flags
            this.leoStates.setSelectedNodeFlags(p_node);
        }

        // Get 'c' before timeout for proper c that was refreshed.
        const c = g.app.windowList[this.frameIndex].c;

        // Do in a timeout to let rest of tree refresh.
        setTimeout(() => {
            g.doHook('after-redraw-outline', { c: c });
        }, 0);
    }

    /**
     * * Public method exposed as 'refreshDocumentsPane' setter/getter to refresh the documents pane
     * Document Panel May be refreshed by other services (states service, ...)
     */
    private _refreshDocumentsPane(): void {
        this._leoDocumentsProvider.refreshTreeRoot();
        this.checkConfirmBeforeClose();
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
        this.leoGotoProvider.refreshTreeRoot();
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
    private _tryApplyNodeToBody(
        p_node: Position,
        p_aside: boolean,
        p_preventTakingFocus: boolean,
    ): Thenable<void | vscode.TextEditor> {

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
                void q_showBody.then(() => {
                    const w_tabsToCloseFound: vscode.Tab[] = [];
                    let q_lastSecondSaveFound: Thenable<boolean> = Promise.resolve(true);
                    vscode.window.tabGroups.all.forEach((p_tabGroup) => {
                        p_tabGroup.tabs.forEach((p_tab) => {
                            if (p_tab.input &&
                                (p_tab.input as vscode.TabInputText).uri &&
                                (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME &&
                                (p_tab.input as vscode.TabInputText).uri.fsPath === w_oldUri.fsPath
                            ) {
                                // Make sure it's saved AGAIN!!
                                if (
                                    p_tab.isDirty &&
                                    this._bodyLastChangedDocument &&
                                    (p_tab.input as vscode.TabInputText).uri.fsPath === this._bodyLastChangedDocument.uri.fsPath
                                ) {
                                    this._leoFileSystem.preventSaveToLeo = true;
                                    this._editorTouched = false;
                                    q_lastSecondSaveFound = this._bodyLastChangedDocument.save();
                                }
                                w_tabsToCloseFound.push(p_tab);
                            }
                        });
                    });
                    if (w_tabsToCloseFound.length) {
                        void q_lastSecondSaveFound.then(() => {
                            void vscode.window.tabGroups.close(w_tabsToCloseFound, true);
                        });
                    }
                    // Remove from potential 'recently opened'
                    void vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', w_oldUri);

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
                        (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME &&
                        w_newUri.fsPath !== (p_tab.input as vscode.TabInputText).uri.fsPath // Maybe useless to check if different!
                    ) {

                        if (
                            p_tab.isDirty &&
                            this._bodyLastChangedDocument &&
                            (p_tab.input as vscode.TabInputText).uri.fsPath === this._bodyLastChangedDocument.uri.fsPath
                        ) {
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
                void vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', w_oldUri);
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
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME &&
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
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME
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
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME
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

    private _checkClosedTabs(): void {
        // check if selected body still has opened textEditors
        let bodyCount = 0;
        for (const p_tabGroup of vscode.window.tabGroups.all) {
            for (const p_tab of p_tabGroup.tabs) {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    ((p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME)
                ) {
                    // a normal body (non detached found)
                    bodyCount++;
                    break;
                }
            }
            if (bodyCount) {
                break;
            }

        }
        if (!bodyCount) {
            // Make sure no more saving over possible detached with same gnx
            this._bodyLastChangedDocument = undefined;
            this._bodyLastChangedDocumentSaved = false;
        }
        this._leoFileSystem.cleanupBodies();
        this._leoDetachedFileSystem.cleanupDetachedBodies();
    }

    /**
     * * Checks if outline is visible
     * @returns true if either outline is visible
     */
    public isOutlineVisible(): boolean {
        return this._leoTreeExView.visible || this._leoTreeView.visible;
    }

    /**
     * Close all tabs that are not part of their filesystems
     * * This matches cleanupDetachedBodies from leoBodyDetached !
     */
    private _hideBodiesUnknownToFileSys(p_editors: readonly vscode.TextEditor[]): void {
        p_editors.forEach((p_editor) => {
            if (p_editor) {
                switch (p_editor.document.uri.scheme) {
                    case Constants.URI_LEOJS_SCHEME:
                        if (this.bodyUri.fsPath !== p_editor.document.uri.fsPath) {
                            void this._hideDeleteBody(p_editor);
                        }
                        this._checkPreviewMode(p_editor);
                        break;

                    case Constants.URI_LEOJS_DETACHED_SCHEME:
                        const w_gnx = utils.leoUriToStr(p_editor.document.uri);
                        //if (!this._leoDetachedFileSystem.watchedBodiesGnx.includes(w_gnx)) {
                        if (!this._leoDetachedFileSystem.openedBodiesVNodes[w_gnx]) {
                            // unknown to the detached filesystem
                            void this._hideDeleteBody(p_editor);
                        }
                        break;

                    default:
                        break;
                }

            }

        });
    }

    /**
     * * Closes non-existing text-editor body if it doesn't match bodyUri
     * @param p_textEditor the editor to close
     * @returns promise that resolves to true if it closed tabs, false if none were found
     */
    private _hideDeleteBody(p_textEditor: vscode.TextEditor): Thenable<unknown> {
        const w_foundTabs: vscode.Tab[] = [];
        const w_editorFsPath = p_textEditor.document.uri.fsPath;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme.startsWith(Constants.URI_LEOJS_SCHEME) &&
                    (p_tab.input as vscode.TabInputText).uri.fsPath === w_editorFsPath
                ) {
                    w_foundTabs.push(p_tab);
                }
            });
        });

        // * Make sure the closed/deleted body is not remembered as vscode's recent files!
        void vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', p_textEditor.document.uri);

        if (w_foundTabs.length) {
            return vscode.window.tabGroups.close(w_foundTabs, true);
        }

        return Promise.resolve();
    }

    /**
     * * Clears the global 'Preview Mode' flag if the given editor is not in the main body column
     * @param p_editor is the editor to check for is in the same column as the main one
     */
    private _checkPreviewMode(p_editor: vscode.TextEditor): void {
        // if selected gnx but in another column
        if (
            p_editor.document.uri.scheme === Constants.URI_LEOJS_SCHEME &&
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
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME
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

                    void vscode.commands.executeCommand(
                        'vscode.removeFromRecentlyOpened',
                        (p_tab.input as vscode.TabInputText).uri
                    );
                    // Delete to close all other body tabs.
                    // (w_oldUri will be deleted last below)
                    const w_edit = new vscode.WorkspaceEdit();
                    w_edit.deleteFile((p_tab.input as vscode.TabInputText).uri, { ignoreIfNotExists: true });
                    void vscode.workspace.applyEdit(w_edit);
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
                return true;
            }, () => {
                return false;
            });
        } else {
            q_edit = Promise.resolve(true);
        }
        Promise.all([q_save, q_edit])
            .then(() => {
                return this.closeBody();
            }, () => {
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
    public async showBody(p_aside: boolean, p_preventTakingFocus?: boolean, p_preventReveal?: boolean): Promise<vscode.TextEditor | void> {
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
        this._bodyLastChangedDocument = undefined;
        this._bodyLastChangedDocumentSaved = false;

        this._bodyTextDocument = w_openedDocument;
        let w_bodySel: BodySelectionInfo | undefined;
        // * Set document language along with the proper cursor position, selection range and scrolling position
        if (!this._needLastSelectedRefresh) {

            // * Get the language.
            const c = g.app.windowList[this.frameIndex].c;
            const p = c.p;
            const w_language = this._getBodyLanguage(p);

            const tempTabWidth = c.getTabWidth(p);
            const w_tabWidth: number | boolean = tempTabWidth || !!tempTabWidth;

            const insert = p.v.insertSpot;
            const start = p.v.selectionStart;
            const end = p.v.selectionStart + p.v.selectionLength;
            const scroll = p.v.scrollBarSpot;

            w_bodySel = {
                "gnx": p.v.gnx,
                "scroll": scroll,
                "insert": this._row_col_pv_dict(insert, p.v.b),
                "start": this._row_col_pv_dict(start, p.v.b),
                "end": this._row_col_pv_dict(end, p.v.b)
            };
            // console.log('From p:', ` insert:${w_bodySel.insert.line}, ${w_bodySel.insert.col} start:${w_bodySel.start.line},${w_bodySel.start.col} end:${w_bodySel.end.line}, ${w_bodySel.end.col}`);

            // ! -------------------------------
            // ! TEST SELECTION GETTER OVERRIDE!
            // ! -------------------------------
            const wrapper = c.frame.body.wrapper;
            const test_insert = wrapper.getInsertPoint();
            let test_start, test_end;
            [test_start, test_end] = wrapper.getSelectionRange(true);
            // ! OVERRIDE !
            //const w_bodySel_w = {
            w_bodySel = {
                "gnx": p.v.gnx,
                "scroll": scroll,
                "insert": this._row_col_wrapper_dict(test_insert, wrapper),
                "start": this._row_col_wrapper_dict(test_start, wrapper),
                "end": this._row_col_wrapper_dict(test_end, wrapper)
            };
            // console.log('From w:', ` insert:${w_bodySel_w.insert.line}, ${w_bodySel_w.insert.col} start:${w_bodySel_w.start.line},${w_bodySel_w.start.col} end:${w_bodySel_w.end.line}, ${w_bodySel_w.end.col}`);
            // console.log('From w:', ` insert:${w_bodySel.insert.line}, ${w_bodySel.insert.col} start:${w_bodySel.start.line},${w_bodySel.start.col} end:${w_bodySel.end.line}, ${w_bodySel.end.col}`);

            let w_debugMessage = "";
            let w_needRefreshFlag = false;

            // Apply language if the selected node is still the same after all those events
            if (!w_openedDocument.isClosed) {
                // w_openedDocument still OPEN
                if (this.isTsStillValid(w_openedDocumentTS)) { // No need to check gnx of command stack){
                    // command stack last node is still valid
                    if (this.lastSelectedNode && w_openedDocumentGnx === this.lastSelectedNode.gnx) {
                        // still same gnx as this.bodyUri
                        if (w_language !== w_openedDocument.languageId) {
                            void this._setBodyLanguage(w_openedDocument, w_language);
                        }

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
                if (this._showBodySwitchBodyTimer) {
                    clearTimeout(this._showBodySwitchBodyTimer);
                }
                // redo apply to body!
                this._showBodySwitchBodyTimer = setTimeout(() => {
                    if (this.lastSelectedNode) {
                        void this._switchBody(false, p_preventTakingFocus);
                    }
                }, 0);
                return;

            }
        }

        // Find body pane's position if already opened with same gnx 
        // Note: language still needs to be set per position
        let w_foundDocOpened = false;
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {

                if (
                    p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME &&
                    (p_tab.input as vscode.TabInputText).uri.fsPath === w_openedDocument.uri.fsPath
                ) {
                    vscode.workspace.textDocuments.forEach((p_textDocument) => {
                        if (
                            p_textDocument.uri.scheme === Constants.URI_LEOJS_SCHEME &&
                            p_textDocument.uri.fsPath === (p_tab.input as vscode.TabInputText).uri.fsPath
                        ) {
                            this._bodyTextDocument = p_textDocument; // vscode.workspace.openTextDocument
                            this._bodyMainSelectionColumn = p_tab.group.viewColumn;
                            if (p_preventReveal) {
                                if (p_tab.isActive) {
                                    w_foundDocOpened = true;
                                }
                            } else {
                                w_foundDocOpened = true;
                            }
                        }
                    });
                }
            });
        });


        if (!w_foundDocOpened && p_preventReveal) {
            return; // ! HAD PREVENT REVEAL !
        }

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
            }
        );

        // else q_bodyStates will exist.
        if (!this._needLastSelectedRefresh) {
            void q_showTextDocument.then(
                (p_textEditor: vscode.TextEditor) => {

                    // * Set text selection range
                    const w_bodyTextEditor = p_textEditor;
                    if (!w_bodySel) {
                        console.log("no selection in returned package from get_body_states");
                    }

                    const w_leoBodySel: BodySelectionInfo = w_bodySel!;

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

                        // console.log(
                        //     'ShowBody is setting selection! anchor: ', w_selection.anchor.line, w_selection.anchor.character,
                        //     ' active: ', w_selection.active.line, w_selection.active.character
                        // );

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
                                // let w_viewName: string;
                                // const gotoView = this.leoGotoProvider.getLastGotoView();
                                // if (gotoView && gotoView.title === "Goto") {
                                //     w_viewName = Constants.GOTO_ID;
                                // } else {
                                //     w_viewName = Constants.GOTO_EXPLORER_ID;
                                // }
                                // void vscode.commands.executeCommand(w_viewName + ".focus");
                                let w_panelID = '';
                                if (this._lastTreeView === this._leoTreeExView) {
                                    w_panelID = Constants.FIND_EXPLORER_ID;
                                } else {
                                    w_panelID = Constants.FIND_ID;
                                }
                                void vscode.commands.executeCommand(w_panelID + '.focus');
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
     * Utility to convert a string index into a line, col dict
     */
    private _row_col_pv_dict(i: number, s: string): { line: number, col: number, index: number } {
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

    /**
     * Converts from wrapper text index to line /col
     */
    private _row_col_wrapper_dict(i: number, wrapper: StringTextWrapper): { "line": number, "col": number, "index": number } {
        if (!i) {
            i = 0; // prevent none type
        }
        let line, col;
        [line, col] = wrapper.toPythonIndexRowCol(i);
        return { "line": line, "col": col, "index": i };
    }

    /**
     * * Looks for given position's coloring language, taking account of '@killcolor', etc.
     */
    private _getBodyLanguage(p: Position): string {
        const c = p.v.context;
        let w_language = "plain";
        const w_wrap = !!c.getWrap(p);
        if (g.useSyntaxColoring(p)) {

            // DEPRECATED leojs old colorizer language detection--------
            // const aList = g.get_directives_dict_list(p);
            // const d = g.scanAtCommentAndAtLanguageDirectives(aList);
            // w_language =
            //     (d && d['language'])
            //     || g.getLanguageFromAncestorAtFileNode(p)
            //     || c.config.getLanguage('target-language')
            //     || 'plain';
            // ---------------------------------------------------------

            // * as per original Leo's leoColorizer.py
            w_language = c.getLanguage(p) || c.config.getLanguage('target-language');
            w_language = w_language.toLowerCase();
        }
        // Replace language string if in 'exceptions' array
        w_language = Constants.LEO_LANGUAGE_PREFIX +
            (Constants.LANGUAGE_CODES[w_language] || w_language) +
            (w_wrap ? Constants.LEO_WRAP_SUFFIX : "");
        return w_language;
    }

    /**
     * * Sets vscode's body-pane editor's language
     */
    private _setBodyLanguage(p_document: vscode.TextDocument, p_language: string): Thenable<vscode.TextDocument> {
        return vscode.languages.setTextDocumentLanguage(p_document, p_language).then(
            (p_newDocument) => { return p_newDocument; }, // ok - language found
            (p_error) => {
                let w_langName: string = p_error.toString().split('\n')[0];
                if (w_langName.length > 38 && w_langName.includes(Constants.LEO_LANGUAGE_PREFIX)) {
                    w_langName = w_langName.substring(38);
                } else {
                    w_langName = "";
                }
                if (w_langName && !this._languageFlagged.includes(w_langName)) {
                    this._languageFlagged.push(w_langName);
                    if (w_langName.endsWith(Constants.LEO_WRAP_SUFFIX)) {
                        w_langName = w_langName.slice(0, -Constants.LEO_WRAP_SUFFIX.length);
                    }
                    if (w_langName.startsWith(Constants.LEO_LANGUAGE_PREFIX)) {
                        w_langName = w_langName.slice(Constants.LEO_LANGUAGE_PREFIX.length);
                    }
                    void vscode.window.showInformationMessage(
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
                        void this.launchRefresh();
                    }, 0);
                }
                return p_document;
            }
        );
    }

    /**
     * * Refreshes body pane's applied language and, word-wrap state.
     */
    public refreshBodyStates(): void {

        if (!this._bodyTextDocument ||
            this._bodyTextDocument.isClosed ||
            !this.lastSelectedNode ||
            utils.leoUriToStr(this._bodyTextDocument.uri) !== this.lastSelectedNode.gnx
        ) {
            return; // Don't waste time finding out the language!
        }

        const c = g.app.windowList[this.frameIndex].c;
        let w_language = this._getBodyLanguage(c.p);

        // Set document language only if different
        if (w_language !== this._bodyTextDocument.languageId) {
            void this._setBodyLanguage(this._bodyTextDocument, w_language);
        }

    }

    /**
     * * Refresh body states after a small debounced delay.
     */
    public debouncedRefreshBodyStates(p_delay?: number) {

        if (!p_delay) {
            p_delay = 0;
        }

        if (this._bodyStatesTimer) {
            clearTimeout(this._bodyStatesTimer);
        }
        if (p_delay === 0) {
            if (this._bodyLastChangedDocument && this.leoStates.fileOpenedReady) {
                void this._bodySaveDocument(this._bodyLastChangedDocument);
            }
            this.refreshBodyStates();
        } else {
            this._bodyStatesTimer = setTimeout(() => {
                if (this._bodyLastChangedDocument && this.leoStates.fileOpenedReady) {
                    void this._bodySaveDocument(this._bodyLastChangedDocument);
                }
                this.refreshBodyStates();
            }, p_delay);
        }
    }

    /**
     * Debounced refresh language for all detached bodies of active commander
     */
    private _refreshCommanderDetachedLanguage(): void {

        const c = g.app.windowList[this.frameIndex].c;
        const c_id = c.id.toString();
        const w_documents: vscode.TextDocument[] = [];
        const w_uris: string[] = [];

        for (const p_tabGroup of vscode.window.tabGroups.all) {
            for (const p_tab of p_tabGroup.tabs) {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    ((p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME)
                ) {
                    const [unused, id, gnx] = (p_tab.input as vscode.TabInputText).uri.path.split("/");
                    if (id === c_id) {
                        // From same commander
                        if (!w_uris.includes((p_tab.input as vscode.TabInputText).uri.toString())) {
                            w_uris.push((p_tab.input as vscode.TabInputText).uri.toString());
                        }

                    }
                }
            }
        }

        for (const w_doc of vscode.workspace.textDocuments) {
            if (!w_doc.isClosed && w_uris.includes(w_doc.uri.toString())) {
                w_documents.push(w_doc);
            }
        }

        for (const w_doc of w_documents) {
            const w_foundVnode = this._leoDetachedFileSystem.openedBodiesVNodes[utils.leoUriToStr(w_doc.uri)];
            if (w_foundVnode) {
                const gnx = w_foundVnode.gnx;

                for (const p of w_foundVnode.context.all_unique_positions()) {
                    if (p.v.gnx === gnx) {
                        let w_language = this._getBodyLanguage(p); // !! 
                        // Set document language only if different
                        if (w_language !== w_doc.languageId) {
                            void this._setBodyLanguage(w_doc, w_language);
                        }
                        break;
                    }
                }

            } else {
                console.log('DETACHED VNODE not found when resetting language');
            }
        }

    }

    /**
     * * Called by UI when the user selects in the tree (click or 'open aside' through context menu)
     * @param p_node is the position node selected in the tree
     * @param p_internalCall Flag used to indicate the selection is forced, and NOT originating from user interaction
     * @returns thenable for reveal to finish or select position to finish
     */
    public async selectTreeNode(
        p_node: Position,
        p_internalCall?: boolean,
    ): Promise<unknown> {

        const c = p_node.v.context;
        let isDoubleClick = false;

        // Check for double-click: if called recently (under 500ms) on exact same node.
        if (!p_internalCall && this.lastSelectedNode && this.lastSelectedNode.__eq__(p_node) && this.lastSelectedNodeTime) {
            if (utils.performanceNow() - this.lastSelectedNodeTime < 500) {
                // Double click on the same node
                this.lastSelectedNodeTime = undefined;
                isDoubleClick = true;
                if (g.doHook("icondclick1", { c: c, p: p_node, v: p_node })) {
                    // returned not falsy, so skip the rest
                    return Promise.resolve();
                }

                // If headline starts with @url call g.openUrl, if @mime call g.open_mimetype
                const w_headline = p_node.h;
                let openPromise;
                if (w_headline.trim().startsWith("@url ")) {
                    openPromise = g.openUrl(p_node);
                } else if (w_headline.trim().startsWith("@mime ")) {
                    openPromise = g.open_mimetype(p_node.v.context, p_node);
                }

                if (openPromise) {
                    await utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, true);
                    setTimeout(() => {
                        void utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, false);
                    }, 60);
                    await openPromise.then(() => {
                        g.doHook("icondclick2", { c: c, p: p_node, v: p_node });
                    });
                    // Slight delay to help vscode finish opening possible new document/file.
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            this.showBodyIfClosed = true;
                            this.showOutlineIfClosed = true;
                            this.setupRefresh(
                                Focus.Outline,
                                {
                                    tree: true,
                                    body: true,
                                    goto: true,
                                    states: true,
                                    documents: true,
                                    buttons: true
                                }
                            );
                            resolve(this.launchRefresh());
                        }, 40);
                    });
                }
                // Double click didn't trigger a special action, so just return.
                g.doHook("icondclick2", { c: c, p: p_node, v: p_node });
                return Promise.resolve();
            }
        }

        // Note: this.lastSelectedNode is set in gotSelectedNode and lastSelectedNode 
        this.lastSelectedNodeTime = utils.performanceNow();

        await this.triggerBodySave(true); // Needed for self-selection to avoid 'cant save file is newer...'

        if (!isDoubleClick) {
            if (!p_internalCall && g.doHook("headclick1", { c: c, p: p_node, v: p_node })) {
                // returned not falsy, so skip the rest
                return Promise.resolve();
            }

        }

        this.showBodyIfClosed = true;

        this.leoStates.setSelectedNodeFlags(p_node);

        // * Check if having already this exact node position selected : Just show the body and exit
        // (other tree nodes with same gnx may have different syntax language coloring because of parents lineage)
        if (p_node.__eq__(this.lastSelectedNode)) {
            this._locateOpenedBody(p_node.gnx); // LOCATE NEW GNX
            if (!isDoubleClick) {
                g.doHook("headclick2", { c: c, p: p_node, v: p_node });
            }
            // MAYBE DETACHED BODY CHANGED THAT CONTENT!
            // only if NOT watched (otherwise would have already been opened and altered by detached modification)
            if (!this._leoFileSystem.watchedBodiesGnx.includes(p_node.gnx)) {
                this._leoFileSystem.setNewBodyUriTime(utils.strToLeoUri(p_node.gnx));
            }

            return this.showBody(false, this.config.treeKeepFocus).catch((p_error) => {
                return Promise.resolve(); // intercept cancellation as success: next one is going to replace anyways.
            });
            // Voluntary exit
        }

        // * Set selected node in Leo
        c.selectPosition(p_node);

        if (!p_internalCall) {
            if (this.findFocusTree) {
                // had a range but now refresh from other than find/replace
                // So make sure tree is also refreshed.
                this.findFocusTree = false;
                this.setupRefresh(
                    Focus.Outline,
                    {
                        tree: true,
                        body: true,
                        // documents: false,
                        // buttons: false,
                        // states: false,
                    }
                );
                g.doHook("headclick2", { c: c, p: p_node, v: p_node });
                return this._launchRefresh();
            }
            this._refreshType.states = true;
            this.getStates();
        }
        g.doHook("headclick2", { c: c, p: p_node, v: p_node });
        // * Apply the node to the body text without waiting for the selection promise to resolve
        return this._tryApplyNodeToBody(p_node, false, this.config.treeKeepFocus);

    }

    /**
     * * Opens a detached body aside, and set focus in a body pane locked to its commander/gnx. 
     * - Does not select the node in the outline.
     * - If already opened aside in the same targeted column, just reveal.
     * @param p is the position node to be opened aside
     */
    public async openAside(p?: Position): Promise<unknown> {
        // Those 'body panes' opened aside, (other than the main body pane), 
        // stay opened until the node's gnx becomes invalid/deleted, or it's commander is closed.
        await this.triggerBodySave(true);

        const c = g.app.windowList[this.frameIndex].c;
        if (!p) {
            p = c.p;
        }

        const detachedGnx = `${c.id}/${p.gnx}`;
        const detachedUri = utils.strToLeoDetachedUri(detachedGnx);

        // * Step 1 : Open the document
        if (!this._leoDetachedFileSystem.watchedBodiesGnx.includes(detachedGnx)) {
            this._leoDetachedFileSystem.setNewBodyUriTime(detachedUri, p.v);
        }
        this.bodyDetachedTextDocument = await vscode.workspace.openTextDocument(detachedUri);
        let w_bodySel: BodySelectionInfo | undefined;
        const w_language = this._getBodyLanguage(p);
        const insert = p.v.insertSpot;
        const start = p.v.selectionStart;
        const end = p.v.selectionStart + p.v.selectionLength;
        const scroll = p.v.scrollBarSpot;

        w_bodySel = {
            "gnx": p.v.gnx,
            "scroll": scroll,
            "insert": this._row_col_pv_dict(insert, p.v.b),
            "start": this._row_col_pv_dict(start, p.v.b),
            "end": this._row_col_pv_dict(end, p.v.b)
        };
        if (w_language !== this.bodyDetachedTextDocument.languageId) {
            void this._setBodyLanguage(this.bodyDetachedTextDocument, w_language);
        }

        const w_showOptions: vscode.TextDocumentShowOptions =
        {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: this.config.treeKeepFocusWhenAside,
            preview: false,
        };
        // * Actually Show the body pane document in a text editor
        const q_showTextDocument = vscode.window.showTextDocument(
            this.bodyDetachedTextDocument,
            w_showOptions
        ).then(
            (p_textEditor: vscode.TextEditor) => {

                // * Set text selection range
                const w_bodyTextEditor = p_textEditor;
                if (!w_bodySel) {
                    console.log("no selection in returned package from get_body_states");
                }

                const w_leoBodySel: BodySelectionInfo = w_bodySel!;

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

                    w_bodyTextEditor.selection = w_selection; // set cursor insertion point & selection range
                    if (!w_scrollRange) {
                        w_scrollRange = w_bodyTextEditor.document.lineAt(0).range;
                    }

                    w_bodyTextEditor.revealRange(w_scrollRange, vscode.TextEditorRevealType.InCenterIfOutsideViewport);

                } else {
                    console.log("no selection in returned package from showTextDocument");
                }

            }
        );

        return q_showTextDocument;
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

        await this.triggerBodySave(true);

        if (p_options.isNavigation) {
            // If any navigation command is used from outline or command palette: show body.
            this.showBodyIfClosed = true;
            // If alt+arrow is used to navigate: SHOW and leave focus on outline.
            this.showOutlineIfClosed = true;

            if (p_options.refreshType.body) {
                // If this is a navigation command, dont refresh DETACHED
                p_options.refreshType.excludeDetached = true;
            }
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
                        void (value as Thenable<unknown>).then((p_result) => {
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
            void vscode.window.showErrorMessage("LeoUI Error: " + e);
        }

        if (this.trace) {
            if (this.lastCommandTimer) {
                console.log('lastCommandTimer', utils.getDurationMs(this.lastCommandTimer));
            }
        }

        this.lastCommandTimer = undefined;

        if (value && value.then) {
            void (value as Thenable<unknown>).then((p_result) => {
                void this.launchRefresh();
            });
            return value;
        } else {
            void this.launchRefresh();
            return Promise.resolve(value); // value may be a promise but it will resolve all at once.
        }

    }

    /**
     * Opens quickPick minibuffer pallette to choose from all commands in this file's Thenable
     * @returns Promise from the command resolving - or resolve with undefined if cancelled
     */
    public async minibuffer(): Promise<unknown> {

        await this.triggerBodySave(true);
        const c = g.app.windowList[this.frameIndex].c;
        const commands: vscode.QuickPickItem[] = [];
        const cDict = c.commandsDict;
        for (let key in cDict) {
            const command = cDict[key];
            // Going to get replaced. Don't take those that begin with 'async-'
            const w_name = (command as any).__name__ || '';
            if (!w_name.startsWith('async-')) {
                commands.push({
                    label: key,
                    detail: (command as any).__doc__
                });
            }
        }

        const w_noDetails: vscode.QuickPickItem[] = [];
        const stash_button: string[] = [];
        const stash_rclick: string[] = [];
        const stash_command: string[] = [];

        for (const w_com of commands) {
            if (
                !w_com.detail && !(
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_BUTTON_START) ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_RCLICK_START) ||
                    w_com.label === Constants.USER_MESSAGES.MINIBUFFER_SCRIPT_BUTTON ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_DEL_SCRIPT_BUTTON) ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_DEL_BUTTON_START) ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_COMMAND_START)
                )
            ) {
                w_noDetails.push(w_com);
            }

            if (w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_BUTTON_START)) {
                stash_button.push(w_com.label);
            }
            if (w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_RCLICK_START)) {
                stash_rclick.push(w_com.label);
            }
            if (w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_COMMAND_START)) {
                stash_command.push(w_com.label);
            }
        }

        for (const p_command of w_noDetails) {
            if (stash_button.includes(Constants.USER_MESSAGES.MINIBUFFER_BUTTON_START + p_command.label)) {
                p_command.description = Constants.USER_MESSAGES.MINIBUFFER_BUTTON;
            }
            if (stash_rclick.includes(Constants.USER_MESSAGES.MINIBUFFER_RCLICK_START + p_command.label)) {
                p_command.description = Constants.USER_MESSAGES.MINIBUFFER_RCLICK;
            }
            if (stash_command.includes(Constants.USER_MESSAGES.MINIBUFFER_COMMAND_START + p_command.label)) {
                p_command.description = Constants.USER_MESSAGES.MINIBUFFER_COMMAND;
            }
            p_command.description = p_command.description ? p_command.description : Constants.USER_MESSAGES.MINIBUFFER_USER_DEFINED;
        }

        const w_withDetails = commands.filter(p_command => !!p_command.detail);

        // Only sort 'regular' Leo commands, leaving custom commands at the top
        w_withDetails.sort((a, b) => {
            return a.label < b.label ? -1 : (a.label === b.label ? 0 : 1);
        });

        const w_choices: vscode.QuickPickItem[] = [];

        if (c.commandHistory.length) {
            w_choices.push(Constants.MINIBUFFER_QUICK_PICK);
        }

        // Finish minibuffer list
        if (w_noDetails.length) {
            w_choices.push(...w_noDetails);
        }

        // Separator above real commands, if needed...
        if (w_noDetails.length || c.commandHistory.length) {
            w_choices.push({
                label: "", kind: vscode.QuickPickItemKind.Separator
            });
        }

        w_choices.push(...w_withDetails);

        const w_disposables: vscode.Disposable[] = [];

        const q_minibufferQuickPick: Promise<vscode.QuickPickItem | undefined> = new Promise((resolve, reject) => {
            const quickPick = vscode.window.createQuickPick();
            quickPick.items = w_choices;
            quickPick.placeholder = Constants.USER_MESSAGES.MINIBUFFER_PROMPT;
            quickPick.matchOnDetail = true;

            w_disposables.push(
                quickPick.onDidChangeSelection(selection => {
                    if (selection[0]) {
                        resolve(selection[0]);
                        quickPick.hide();
                    }
                }),
                quickPick.onDidAccept(accepted => {
                    if (/^\d+$/.test(quickPick.value)) {
                        // * Was an integer EASTER EGG
                        this.setupRefresh(Focus.Body,
                            {
                                tree: true,
                                body: true,
                                documents: false,
                                buttons: false,
                                states: true
                            }
                        );
                        // not awaited
                        c.editCommands.gotoGlobalLine(Number(quickPick.value)).then(() => {
                            void this.launchRefresh();
                        }, () => {
                            // pass
                        });
                        resolve(undefined);
                        quickPick.hide();
                    }
                }),
                quickPick.onDidChangeValue(changed => {
                    if (/^\d+$/.test(changed)) {
                        if (quickPick.items.length) {
                            quickPick.items = [];
                        }
                    } else if (quickPick.items !== w_choices) {
                        quickPick.items = w_choices;
                    }
                }),
                quickPick.onDidHide(() => {
                    resolve(undefined);
                }),
                quickPick
            );
            quickPick.show();

        });

        const w_picked: vscode.QuickPickItem | undefined = await q_minibufferQuickPick;

        w_disposables.forEach(d => d.dispose());

        // First, check for undo-history list being requested
        if (w_picked && w_picked.label === Constants.USER_MESSAGES.MINIBUFFER_HISTORY_LABEL) {
            return this._showMinibufferHistory(w_choices);
        }
        if (w_picked) {
            return this._doMinibufferCommand(w_picked);
        }
    }

    /**
     * * Opens quickPick minibuffer pallette to choose from all commands in this file's commander
     * @returns Promise that resolves when the chosen command is placed on the front-end command stack
     */
    private async _showMinibufferHistory(p_choices: vscode.QuickPickItem[]): Promise<unknown> {

        // Wait for _isBusyTriggerSave resolve because the full body save may change available commands
        await this.triggerBodySave(true);

        const c = g.app.windowList[this.frameIndex].c;

        if (!c.commandHistory.length) {
            return;
        }
        // Build from list of strings (labels).
        let w_commandList: vscode.QuickPickItem[] = [];
        for (const w_command of c.commandHistory) {
            let w_found = false;
            for (const w_pick of p_choices) {
                if (w_pick.label === w_command) {
                    w_commandList.push(w_pick);
                    w_found = true;
                    break;
                }
            }
            if (!w_found) {
                w_commandList.push({
                    label: w_command,
                    description: Constants.USER_MESSAGES.MINIBUFFER_BAD_COMMAND,
                    detail: `No command function for ${w_command}`
                });
            }
        }
        if (!w_commandList.length) {
            return;
        }
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
    private _doMinibufferCommand(p_picked?: vscode.QuickPickItem): Promise<unknown> {
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

            this._addToMinibufferHistory(p_picked);
            const c = g.app.windowList[this.frameIndex].c;

            let w_command = p_picked.label; // May be overriden with async commands

            // OVERRIDE with custom async commands where applicable
            if (Constants.MINIBUFFER_OVERRIDDEN_NAMES[p_picked.label]) {
                w_command = Constants.MINIBUFFER_OVERRIDDEN_NAMES[p_picked.label];
            }

            const w_commandResult = c.executeMinibufferCommand(w_command);

            if (w_commandResult && w_commandResult.then) {
                // IS A PROMISE so tack-on the launchRefresh to its '.then' chain. 
                void (w_commandResult as Thenable<unknown>).then((p_result) => {
                    void this.launchRefresh();
                });
            } else {
                void this.launchRefresh();
            }
            // In both cases, return the result, or if a promise: the promise itself, not the result.
            return Promise.resolve(w_commandResult);

        } else {
            // Canceled
            return Promise.resolve(undefined);
        }
    }

    /**
     * Add to the minibuffer history (without duplicating entries)
     */
    private _addToMinibufferHistory(p_command: vscode.QuickPickItem): void {
        const c = g.app.windowList[this.frameIndex].c;
        const w_found = c.commandHistory.indexOf(p_command.label);
        // If found, will be removed (and placed on top)
        if (w_found >= 0) {
            c.commandHistory.splice(w_found, 1);
        }
        // Add to top of minibuffer history
        c.commandHistory.unshift(p_command.label);
    }

    /**
     * Show a headline input box that resolves to undefined only with escape.
     * Other Leo commands interrupt by accepting the value entered so far.
     */
    private _showHeadlineInputBox(p_options: vscode.InputBoxOptions): Promise<string | undefined> {

        const hib = vscode.window.createInputBox();
        this._hibLastValue = undefined; // Prepare for 'cancel' as default.
        const q_headlineInputBox = new Promise<string | undefined>((p_resolve, p_reject) => {

            hib.ignoreFocusOut = !!p_options.ignoreFocusOut;
            hib.value = p_options.value!;
            hib.valueSelection = p_options.valueSelection;
            hib.prompt = p_options.prompt;
            this._hibDisposables.push(hib.onDidAccept(() => {
                if (this._hib) {
                    this._hib.enabled = false;
                    this._hibLastValue = this._hib.value;
                    this._hib.hide();
                }
            }, this));
            if (this._hibResolve) {
                console.error('IN _showHeadlineInputBox AND THE _hibResolve PROMISE ALREADY EXISTS!');
            }
            this._hibResolve = p_resolve;
            // onDidHide handles CANCEL AND ACCEPT AND INTERCEPT !
            this._hibDisposables.push(hib.onDidHide(() => {
                let changed = false;
                const c = g.app.windowList[this.frameIndex].c;
                if (this._hib) {
                    changed = this._hib.value !== p_options.value;
                    if (g.doHook("headkey1", { c: c, p: c.p, changed: changed })) {
                        // The hook claims to have handled the event, so 'cancel'.
                        this._hibLastValue = undefined;
                    } else {
                        // ok
                        this._hibLastValue = this._hib.value; // * FORCE VALUE EVEN WHEN CANCELLING LIKE IN ORIGINAL LEO !
                    }
                }
                this.leoStates.leoEditHeadline = false;
                if (this._hibResolve) {
                    // RESOLVE whatever value was set otherwise undefined will mean 'canceled'.
                    this._hibResolve(this._hibLastValue);
                    g.doHook("headkey2", { c: c, p: c.p, changed: changed });
                    // Dispose of everything disposable with the edit headline process.
                    for (const disp of this._hibDisposables) {
                        disp.dispose();
                    }
                    // Empty related global variables.
                    this._hibDisposables = [];
                    this._hibResolve = undefined;
                    this._hib = undefined;
                } else {
                    console.log('ERROR ON onDidHide NO _hibResolve !');
                }
            }, this));
            this._hibDisposables.push(hib);
            // setup finished, set command context and show it! 
            this._hib = hib;
            this.leoStates.leoEditHeadline = true;
            this._hib.show();
        });
        return q_headlineInputBox;
    }

    /**
     * * Asks for a new headline label, and replaces the current label with this new one one the specified, or currently selected node
     * @param p_node Specifies which node to rename, or leave undefined to rename the currently selected node
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @param p_prompt Optional prompt, to override the default 'edit headline' prompt. (for insert-* commands usage)
     * @returns Thenable that resolves when done
     */
    public async editHeadline(p_node?: Position, p_fromOutline?: boolean, p_prompt?: string): Promise<Position> {
        const c = g.app.windowList[this.frameIndex].c;
        const u = c.undoer;
        const w_p: Position = p_node || c.p;

        if (this._hib && this._hib.enabled) {
            return Promise.resolve(w_p); // DO NOT REACT IF ALREADY EDITING A HEADLINE! 
        }

        await this.triggerBodySave(true);

        let w_finalFocus: Focus = p_fromOutline ? Focus.Outline : Focus.Body; // Use w_fromOutline for where we intend to leave focus when done with the insert

        this.setupRefresh(
            w_finalFocus,
            { tree: true, states: true }
        );

        const w_headlineInputOptions: vscode.InputBoxOptions = {
            ignoreFocusOut: false,
            value: w_p.h,  // preset input pop up
            valueSelection: undefined,
            prompt: p_prompt || Constants.USER_MESSAGES.PROMPT_EDIT_HEADLINE,
        };
        let p_newHeadline = await this._showHeadlineInputBox(w_headlineInputOptions);

        if ((p_newHeadline || p_newHeadline === "") && p_newHeadline !== "\n") {
            let w_truncated = false;
            if (p_newHeadline.indexOf("\n") >= 0) {
                p_newHeadline = p_newHeadline.split("\n")[0];
                w_truncated = true;
            }
            if (p_newHeadline.length > 1000) {
                p_newHeadline = p_newHeadline.substring(0, 1000);
                w_truncated = true;
            }

            if (p_newHeadline && w_p && w_p.h !== p_newHeadline) {
                if (w_truncated) {
                    void vscode.window.showInformationMessage("Truncating headline");
                }
                if (g.doHook("headkey1", { c: c, p: c.p, ch: '\n', changed: true })) {
                    return w_p;  // The hook claims to have handled the event.
                }
                const undoData = u.beforeChangeHeadline(w_p);
                c.setHeadString(w_p, p_newHeadline); // Set v.h *after* calling the undoer's before method.
                if (!c.changed) {
                    c.setChanged();
                }
                u.afterChangeHeadline(w_p, 'Edit Headline', undoData);
                g.doHook("headkey2", { c: c, p: c.p, ch: '\n', changed: true });
                void this.launchRefresh();
            }

        } else {
            if (p_fromOutline) {
                this.showOutline(true);
            }
        }
        if (this._onDidHideResolve) {
            this._onDidHideResolve(undefined);
            this._onDidHideResolve = undefined;
        }
        return w_p;
    }

    /**
     * * Asks for a headline label to be entered and creates (inserts) a new node under the current, or specified, node
     * @param p_node specified under which node to insert, or leave undefined to use whichever is currently selected
     * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
     * @param p_asChild Insert as child instead of as sibling
     * @returns Thenable that resolves when done
     */
    public async insertNode(p_node: Position | undefined, p_fromOutline: boolean, p_asChild: boolean): Promise<unknown> {

        let w_hadHib = false;
        if (this._hib && this._hib.enabled) {
            w_hadHib = true;
        }

        if (!this.isOutlineVisible()) {
            p_fromOutline = false;
        }

        let w_finalFocus: Focus = p_fromOutline ? Focus.Outline : Focus.Body; // Use w_fromOutline for where we intend to leave focus when done with the insert
        if (w_hadHib) {
            this._focusInterrupt = true; // this will affect next refresh by triggerbodysave, not the refresh of this pass
        }

        await this.triggerBodySave(true);

        // * if node has child and is expanded: turn p_asChild to true!
        const w_headlineInputOptions: vscode.InputBoxOptions = {
            ignoreFocusOut: false,
            value: Constants.USER_MESSAGES.DEFAULT_HEADLINE,
            valueSelection: undefined,
            prompt: p_asChild ? Constants.USER_MESSAGES.PROMPT_INSERT_CHILD : Constants.USER_MESSAGES.PROMPT_INSERT_NODE
        };

        if (w_hadHib && !this.isOutlineVisible()) {
            await new Promise((p_resolve, p_reject) => {
                setTimeout(() => {
                    p_resolve(undefined);
                }, 60);
            });
        }

        const p_newHeadline = await this._showHeadlineInputBox(w_headlineInputOptions);

        if (this._hibInterrupted) {
            w_finalFocus = Focus.NoChange;
            this._hibInterrupted = false;
        }

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

        const w_refreshType: ReqRefresh = { documents: true, buttons: true, states: true };
        if (!this.isOutlineVisible()) {

        }
        if (this.isOutlineVisible()) {
            w_refreshType.tree = true;
        } else {
            w_refreshType.body = true;
        }

        if (p.__eq__(c.p)) {
            w_refreshType.body = true;
            this.setupRefresh(w_finalFocus, w_refreshType);
            this._insertAndSetHeadline(p_newHeadline, p_asChild); // no need for re-selection
        } else {
            const old_p = c.p;  // c.p is old already selected
            c.selectPosition(p); // p is now the new one to be operated on
            this._insertAndSetHeadline(p_newHeadline, p_asChild);
            // Only if 'keep' old position was needed (specified with a p_node parameter), and old_p still exists
            if (!!p_node && c.positionExists(old_p)) {
                // no need to refresh body
                this.setupRefresh(w_finalFocus, w_refreshType);
                c.selectPosition(old_p);
            } else {
                old_p._childIndex = old_p._childIndex + 1;
                if (!!p_node && c.positionExists(old_p)) {
                    // no need to refresh body
                    this.setupRefresh(w_finalFocus, w_refreshType);
                    c.selectPosition(old_p);
                } else {
                    w_refreshType.body = true;
                    this.setupRefresh(w_finalFocus, w_refreshType);
                }
            }
        }
        if (this.trace) {
            if (this.lastCommandTimer) {
                console.log('lastCommandTimer', utils.getDurationMs(this.lastCommandTimer));
            }
        }
        this.lastCommandTimer = undefined;

        if (this._onDidHideResolve) {
            this._onDidHideResolve(undefined);
            this._onDidHideResolve = undefined;
        } else {
            // pass
        }
        void this.launchRefresh();

        return value;

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
        if (g.doHook("headkey1", { c: c, p: c.p, ch: '\n', changed: true })) {
            return;  // The hook claims to have handled the event.
        }
        const undoData = u.beforeChangeHeadline(c.p);
        c.setHeadString(c.p, p_name);  // Set v.h *after* calling the undoer's before method.
        if (!c.changed) {
            c.setChanged();
        }
        u.afterChangeHeadline(c.p, 'Edit Headline', undoData);
        g.doHook("headkey2", { c: c, p: c.p, ch: '\n', changed: true });
        return value;
    }

    /**
     * Replaces the system's clipboard with the given string
     * @param p_string actual string content to go onto the clipboard
     * @returns a promise that resolves when the string is put on the clipboard
     */
    public replaceClipboardWith(s: string): Thenable<string> {
        this.clipboardContents = s; // also set immediate clipboard string
        return vscode.env.clipboard.writeText(s).then(() => { return s; });
    }

    /**
     * Asynchronous clipboards getter
     * Get the system's clipboard contents and returns a promise
     * Also puts it in the global clipboardContents variable
     * @returns a promise of the clipboard string content
     */
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
     * Put UNL of current node on the clipboard. 
     * @para optional unlType to specify type.
     */
    public unlToClipboard(unlType?: UnlType): Thenable<string> {
        let unl = "";
        const c = g.app.windowList[this.frameIndex].c;
        const p = c.p;
        if (!p.v) {
            return Promise.resolve('');
        }
        if (unlType) {
            switch (unlType) {
                case 'shortGnx':
                    unl = p.get_short_gnx_UNL();
                    break;
                case 'fullGnx':
                    unl = p.get_full_gnx_UNL();
                    break;
                case 'shortLegacy':
                    unl = p.get_short_legacy_UNL();
                    break;
                case 'fullLegacy':
                    unl = p.get_full_legacy_UNL();
                    break;
            }
        } else {
            unl = c.frame.computeStatusUnl(p);
        }
        return this.replaceClipboardWith(unl);
    }

    /**
     * Mimic vscode's CTRL+P to find any position by it's headline
     */
    public async goAnywhere(): Promise<unknown> {
        await this.triggerBodySave(true);

        const q_allPositions = new Promise<{ label: string; description?: string; position?: Position; }[]>((resolve, reject) => {
            setTimeout(() => {
                const allPositions: { label: string; description?: string; position?: Position; }[] = [];
                // Options for date to look like : Saturday, September 17, 2016
                const w_dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: 'numeric', month: "long", day: 'numeric' };
                const c = g.app.windowList[this.frameIndex].c;

                // 'true' parameter because each position is kept individually for the time the QuickPick control is opened
                for (const p_position of c.all_unique_positions(true)) {

                    let w_description = p_position.gnx; // Defaults as gnx.
                    const w_gnxParts = w_description.split('.');
                    const dateString = w_gnxParts[1] ? w_gnxParts[1] : "";

                    if (dateString && w_gnxParts.length === 3 && dateString.length === 14 && /^\d+$/.test(dateString)) {
                        // legit 3 part numeric gnx, so build a string date
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
                resolve(allPositions);
            }, 0);
        });

        // Add Nav tab special commands
        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.SEARCH_POSITION_BY_HEADLINE
        };

        const p_picked = await vscode.window.showQuickPick(q_allPositions, w_options);
        const c = g.app.windowList[this.frameIndex].c;

        if (p_picked && p_picked.label && p_picked.position) {
            if (c.positionExists(p_picked.position)) {
                c.selectPosition(p_picked.position);  // set this node as selection
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
            void this.launchRefresh();
        }

        return Promise.resolve(undefined); // Canceled

    }

    /**
     * Opens the Nav tab and focus on nav text input
     */
    public findQuick(p_string?: string, p_forceEnter?: boolean): Thenable<unknown> {
        void this.triggerBodySave(true);
        let w_panelID = '';
        let w_panel: vscode.WebviewView | undefined;
        if (this._lastTreeView === this._leoTreeExView) {
            w_panelID = Constants.FIND_EXPLORER_ID;
            w_panel = this._findPanelWebviewExplorerView;
        } else {
            w_panelID = Constants.FIND_ID;
            w_panel = this._findPanelWebviewView;
        }
        return vscode.commands.executeCommand(w_panelID + '.focus').then((p_result) => {
            if (w_panel && w_panel.show && !w_panel.visible) {
                w_panel.show(false);
            }
            const w_message: { [key: string]: string | boolean } = { type: 'selectNav' };
            if (p_string && p_string.trim()) {
                w_message["text"] = p_string.trim();
            }
            if (p_forceEnter) {
                w_message["forceEnter"] = true;
            }
            if (w_panel) {
                void w_panel.webview.postMessage(w_message);
            } else {
                setTimeout(() => {
                    let w_panel: vscode.WebviewView | undefined;
                    if (this._lastTreeView === this._leoTreeExView) {
                        w_panel = this._findPanelWebviewExplorerView;
                    } else {
                        w_panel = this._findPanelWebviewView;
                    }
                    void w_panel?.webview.postMessage(w_message);
                }, 290);
            }
        });
    }

    /**
     * Opens the Nav tab with the selected text as the search string
     */
    public findQuickSelected(): Thenable<unknown> {
        if (vscode.window.activeTextEditor) {
            const editor = vscode.window.activeTextEditor;
            const selection = editor.selection;
            if (!selection.isEmpty) {
                const text = editor.document.getText(selection).replace(/\r\n/g, "\n");
                return this.findQuick(text, true);
            }
        }
        return this.findQuick("", true);
    }

    /**
     * Lists all nodes in reversed gnx order, newest to oldest
     */
    public findQuickTimeline(): Thenable<unknown> {
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;
        scon.qsc_sort_by_gnx();
        this.leoGotoProvider.refreshTreeRoot();
        return this.showGotoPane(); // Finish by opening and focussing nav pane
    }

    /**
     * Lists all nodes that are changed (aka "dirty") since last save.
     */
    public findQuickChanged(): Thenable<unknown> {
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;
        scon.qsc_find_changed();
        this.leoGotoProvider.refreshTreeRoot();
        return this.showGotoPane(); // Finish by opening and focussing nav pane
    }

    /**
     * Lists nodes from c.nodeHistory.
     */
    public findQuickHistory(): Thenable<unknown> {
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;
        scon.qsc_get_history();
        this.leoGotoProvider.refreshTreeRoot();
        return this.showGotoPane(); // Finish by opening and focussing nav pane
    }

    /**
     * List all marked nodes.
     */
    public findQuickMarked(p_preserveFocus?: boolean): Thenable<unknown> {
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;
        scon.qsc_show_marked();
        this.leoGotoProvider.refreshTreeRoot();
        if (
            p_preserveFocus && (
                (this._findPanelWebviewView && this._findPanelWebviewView.visible) ||
                (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible)
            )
        ) {
            return Promise.resolve();
        }
        return this.showGotoPane(); // Finish by opening and focussing nav pane
    }

    /**
     * Opens goto and focus in depending on passed options
     */
    public showGotoPane(p_options?: { preserveFocus?: boolean }): Thenable<unknown> {
        void this.triggerBodySave(true);

        // if (this._lastTreeView === this._leoTreeExView) {
        //     w_panel = Constants.GOTO_EXPLORER_ID;
        // } else {
        //     w_panel = Constants.GOTO_ID;
        // }

        // void vscode.commands.executeCommand(w_panel + '.focus', p_options);

        let w_panelID = '';
        let w_panel: vscode.WebviewView | undefined;
        if (this._lastTreeView === this._leoTreeExView) {
            w_panelID = Constants.FIND_EXPLORER_ID;
            w_panel = this._findPanelWebviewExplorerView;
        } else {
            w_panelID = Constants.FIND_ID;
            w_panel = this._findPanelWebviewView;
        }
        // this._findNeedsFocus = 2;
        // setTimeout(() => {
        //     this._findNeedsFocus = 0;
        // }, 250);
        return vscode.commands.executeCommand(w_panelID + '.focus', p_options).then((p_result) => {
            if (w_panel && w_panel.show && !w_panel.visible) {
                w_panel.show(false);
            }
            const w_message: { [key: string]: string } = { type: 'showGoto' };
            if (w_panel) {
                void w_panel.webview.postMessage(w_message);
            } else {
                setTimeout(() => {
                    let w_panel: vscode.WebviewView | undefined;
                    if (this._lastTreeView === this._leoTreeExView) {
                        w_panel = this._findPanelWebviewExplorerView;
                    } else {
                        w_panel = this._findPanelWebviewView;
                    }
                    void w_panel?.webview.postMessage(w_message);
                }, 290);
            }
        });

    }

    /**
     * * Handles a click (selection) of a nav panel node: Sends 'goto' command to server.
     */
    public async gotoNavEntry(p_node: LeoGotoNode): Promise<unknown> {
        if (!p_node) {
            console.log('ERROR NO NODE TO SHOW IN GOTO PANE!');
            return;
        }

        await this.triggerBodySave(true);
        this.leoGotoProvider.resetSelectedNode(p_node); // Inform controller of last index chosen
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;

        if (p_node.entryType === 'tag') {
            // * For when the nav input IS CLEARED : GOTO PANE LISTS ALL TAGS!
            // The node clicked was one of the tags, pre-fill the nac search with this tag and open find pane
            let w_string: string = p_node.label as string;

            let w_panelID = '';
            let w_panel: vscode.WebviewView | undefined;
            if (this._lastTreeView === this._leoTreeExView) {
                w_panelID = Constants.FIND_EXPLORER_ID;
                w_panel = this._findPanelWebviewExplorerView;
            } else {
                w_panelID = Constants.FIND_ID;
                w_panel = this._findPanelWebviewView;
            }
            await vscode.commands.executeCommand(w_panelID + '.focus');

            if (this._findPanelWebviewView && this._findPanelWebviewView.visible) {
                w_panel = this._findPanelWebviewView;
            } else if (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible) {
                w_panel = this._findPanelWebviewExplorerView;
            }

            if (w_panel && w_panel.show && !w_panel.visible) {
                w_panel.show(false);
            }
            const w_message: { [key: string]: string; } = { type: 'selectNav' };
            if (w_string && w_string.trim()) {
                w_message["text"] = w_string.trim();
            }
            await w_panel!.webview.postMessage(w_message);
            // Do search

            setTimeout(() => {
                const inp = scon.navText;
                if (scon.isTag) {
                    scon.qsc_find_tags(inp);
                } else {
                    scon.qsc_search(inp);
                }
                this.leoGotoProvider.refreshTreeRoot();
                void this.showGotoPane({ preserveFocus: true }); // show but dont change focus
            }, 10);

        } else if (p_node.entryType !== 'generic' && p_node.entryType !== 'parent') {
            // Other and not a tag so just locate the entry in either body or outline
            // const p_navEntryResult = await this.sendAction(
            //     Constants.LEOBRIDGE.GOTO_NAV_ENTRY,
            //     { key: p_node.key }
            // );

            const it = p_node.key;
            scon.onSelectItem(it);

            let w_focus = this._get_focus();

            if (!w_focus) {
                return vscode.window.showInformationMessage('Not found');
            } else {
                let w_revealTarget = Focus.Body;
                w_focus = w_focus.toLowerCase();

                if (w_focus.includes('tree') || w_focus.includes('head')) {
                    // tree
                    w_revealTarget = Focus.Outline;
                    this.showOutlineIfClosed = true;
                } else {
                    this.showBodyIfClosed = true;
                }

                this.setupRefresh(
                    // ! KEEP FOCUS ON GOTO PANE !
                    Focus.Goto,
                    {
                        tree: true,
                        body: true,
                        scroll: w_revealTarget === Focus.Body,
                        // documents: false,
                        // buttons: false,
                        states: true,
                    }
                );
                return this.launchRefresh();
            }
        }

    }

    /**
     * Reveals and selects the specific nav entry in the results of the nav pane.
     */
    public revealGotoNavEntry(p_index: number, p_preserveFocus?: boolean): void {
        if (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible) {
            void this._findPanelWebviewExplorerView!.webview.postMessage({ type: 'revealNavEntry', value: p_index, preserveFocus: p_preserveFocus });
        } else if (this._findPanelWebviewView && this._findPanelWebviewView.visible) {
            void this._findPanelWebviewView!.webview.postMessage({ type: 'revealNavEntry', value: p_index, preserveFocus: p_preserveFocus });
        }
    }

    /**
     * * Goto the next, previous, first or last nav entry via arrow keys in
     */
    public navigateNavEntry(p_nav: LeoGotoNavKey): void {
        void this.leoGotoProvider.navigateNavEntry(p_nav);
    }

    private _get_focus(): string {
        const c = g.app.windowList[this.frameIndex].c;
        const w = g.app.gui.get_focus(c);
        const focus = g.app.gui.widget_name(w);
        return focus;
    }

    /**
     * * Handles an enter press in the 'nav pattern' input
     */
    public async navEnter(): Promise<unknown> {
        await this.triggerBodySave(true);
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;

        const inp = scon.navText;
        if (scon.isTag) {
            scon.qsc_find_tags(inp);
        } else {
            scon.qsc_search(inp);
        }

        return this.showNavResults();

    }

    /**
     * * Handles a debounced text change in the nav pattern input box
     */
    public async navTextChange(): Promise<unknown> {

        await this.triggerBodySave(true);
        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;

        const inp = scon.navText;
        if (scon.isTag) {
            scon.qsc_find_tags(inp);
        } else {
            const exp = inp.replace(/ /g, '*');
            scon.qsc_background_search(exp);
        }
        return this.showNavResults();
    }

    /**
     * * Clears the nav search results of the goto pane
     */
    public navTextClear(): void {

        const c = g.app.windowList[this.frameIndex].c;
        const scon: QuickSearchController = c.quicksearchController;

        scon.clear();

        this.leoGotoProvider.refreshTreeRoot();
    }

    /**
     * * Opens the find panel and selects all & focuses on the find field.
     */
    public startSearch(): void {

        void this.triggerBodySave(true);

        // already instantiated & shown ?
        let w_panel: vscode.WebviewView | undefined;

        if (this._findPanelWebviewView && this._findPanelWebviewView.visible) {
            w_panel = this._findPanelWebviewView;
        } else if (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible) {
            w_panel = this._findPanelWebviewExplorerView;
        }

        if (w_panel) {
            // ALREADY VISIBLE FIND PANEL
            this._findNeedsFocus = 0;
            void w_panel.webview.postMessage({ type: 'selectFind' });
            return;
        }

        this._findNeedsFocus = 1;
        setTimeout(() => {
            this._findNeedsFocus = 0;
        }, 250);
        let w_panelID = '';
        if (this._lastTreeView === this._leoTreeExView) {
            w_panelID = Constants.FIND_EXPLORER_ID;
        } else {
            w_panelID = Constants.FIND_ID;
        }
        void vscode.commands.executeCommand(w_panelID + '.focus');


    }

    /**
     * Check if search input should be forced-focused again
     */
    public checkForceFindFocus(p_fromInit: boolean): void {
        if (this._findNeedsFocus) {
            let message = 'selectFind';
            if (this._findNeedsFocus === 2) {
                message = 'selectNav';
            }
            this._findNeedsFocus = 0; // Set false before timeout.
            setTimeout(() => {
                let w_panel: vscode.WebviewView | undefined;
                if (this._findPanelWebviewView && this._findPanelWebviewView.visible) {
                    w_panel = this._findPanelWebviewView;
                } else if (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible) {
                    w_panel = this._findPanelWebviewExplorerView;
                }
                if (w_panel) {
                    this._findNeedsFocus = 0; // Set false ALSO AFTER !
                    void w_panel.webview.postMessage({ type: message });
                }
            }, 60);
        }
    }

    /**
     * * Find next / previous commands
     * @param p_fromOutline
     * @param p_reverse
     * @returns Promise that resolves when the "launch refresh" is started
     */
    public async find(p_fromOutline: boolean, p_reverse: boolean): Promise<unknown> {

        await this.triggerBodySave(true);
        let found;
        let focus;

        const c = g.app.windowList[this.frameIndex].c;
        const fc = c.findCommands;
        let p: Position | undefined = c.p;

        const fromOutline = p_fromOutline;
        const fromBody = !fromOutline;

        let w = this.get_focus(c);
        focus = this.widget_name(w);

        const inOutline = (focus.includes("tree")) || (focus.includes("head"));
        const inBody = !inOutline;

        if (fromOutline && inBody) {
            fc.in_headline = true;
        } else if (fromBody && inOutline) {
            fc.in_headline = false;
            c.bodyWantsFocus();
            c.bodyWantsFocusNow();
        }

        let pos, newpos, settings;
        settings = fc.ftm.get_settings();
        if (p_reverse) {
            [p, pos, newpos] = fc.do_find_prev(settings);
        } else {
            [p, pos, newpos] = fc.do_find_next(settings);
        }

        w = this.get_focus(c); // get focus again after the operation
        focus = this.widget_name(w);
        found = p && p.__bool__();

        this.findFocusTree = false; // Reset flag for headline range

        if (!found || !focus) {
            return vscode.window.showInformationMessage('Not found');
        } else {
            let w_finalFocus = Focus.Body;
            const w_focus = focus.toLowerCase();
            if (w_focus.includes('tree') || w_focus.includes('head')) {
                // tree
                w_finalFocus = Focus.Outline;
                this.showOutlineIfClosed = true;
                // * SETUP HEADLINE RANGE
                this.findFocusTree = true;
                this.findHeadlineRange = [w.sel[0], w.sel[1]];
                this.findHeadlinePosition = c.p;
            } else {
                this.showBodyIfClosed = true;
            }
            const w_scroll = (found && w_finalFocus === Focus.Body) || undefined;

            this.setupRefresh(
                w_finalFocus, // ! Unlike gotoNavEntry, this sets focus in outline -or- body.
                {
                    tree: true, // HAVE to refresh tree because find folds/unfolds only result outline paths
                    body: true,
                    scroll: w_scroll,
                    // documents: false,
                    // buttons: false,
                    states: true,
                },
                this.findFocusTree
            );
            return this.launchRefresh();
        }
    }

    /**
     * * Replace / Replace-Then-Find commands
     * @param p_fromOutline
     * @param p_thenFind
     * @returns Promise that resolves when the "launch refresh" is started
     */
    public async replace(p_fromOutline?: boolean, p_thenFind?: boolean): Promise<unknown> {

        await this.triggerBodySave(true);
        let found;
        let focus;

        const c = g.app.windowList[this.frameIndex].c;
        const fc = c.findCommands;

        const fromOutline = p_fromOutline;
        const fromBody = !fromOutline;

        let w = this.get_focus(c);
        focus = this.widget_name(w);

        const inOutline = (focus.includes("tree")) || (focus.includes("head"));
        const inBody = !inOutline;

        if (fromOutline && inBody) {
            fc.in_headline = true;
        } else if (fromBody && inOutline) {
            fc.in_headline = false;
            c.bodyWantsFocus();
            c.bodyWantsFocusNow();
        }

        found = false;

        const settings = fc.ftm.get_settings();
        fc.init_ivars_from_settings(settings); // ? Needed for fc.change_selection

        fc.check_args('replace');
        if (p_thenFind) {
            found = fc.do_change_then_find(settings);
        } else {
            fc.change_selection(c.p);
            found = true;
        }

        w = this.get_focus(c); // get focus again after the operation
        focus = this.widget_name(w);

        this.findFocusTree = false; // Reset flag for headline range

        if (!found || !focus) {
            void vscode.window.showInformationMessage('Not found'); // Flag not found/replaced!
        }
        if (focus) {
            let w_finalFocus = Focus.Body;
            const w_focus = focus.toLowerCase();
            if (w_focus.includes('tree') || w_focus.includes('head')) {
                // tree
                w_finalFocus = Focus.Outline;
                this.showOutlineIfClosed = true;
                // * SETUP HEADLINE RANGE
                this.findFocusTree = true;
                this.findHeadlineRange = [w.sel[0], w.sel[1]];
                this.findHeadlinePosition = c.p;
            } else {
                this.showBodyIfClosed = true;
            }
            const w_scroll = (found && w_finalFocus === Focus.Body) || undefined;

            this.setupRefresh(
                w_finalFocus, // ! Unlike gotoNavEntry, this sets focus in outline -or- body.
                {
                    tree: true, // HAVE to refresh tree because find folds/unfolds only result outline paths
                    body: true,
                    scroll: w_scroll,
                    // documents: false,
                    // buttons: false,
                    states: true,
                },
                this.findFocusTree
            );
            return this.launchRefresh();
        }

    }

    /**
     * Interactive Search to implement search-backward, re-search, word-search. etc.
     */
    public async interactiveSearch(p_backward: boolean, p_regex: boolean, p_word: boolean): Promise<unknown> {

        await this.triggerBodySave(true);

        if (p_regex && p_word) {
            console.error('interactiveSearch called with both "WORD" and "REGEX"');
            return;
        }

        let w_searchTitle = Constants.USER_MESSAGES.INT_SEARCH_TITLE;
        let w_searchPrompt = Constants.USER_MESSAGES.INT_SEARCH_PROMPT;
        let w_searchPlaceholder = Constants.USER_MESSAGES.SEARCH_PLACEHOLDER;

        const c = g.app.windowList[this.frameIndex].c;
        const fc = c.findCommands;
        const ftm = fc.ftm;

        if (p_backward) {
            w_searchTitle += Constants.USER_MESSAGES.INT_SEARCH_BACKWARD;
            // Set flag for show_find_options.
            fc.reverse = true;
            // Set flag for do_find_next().
            fc.request_reverse = true;
        }
        if (p_regex) {
            w_searchTitle = Constants.USER_MESSAGES.INT_SEARCH_REGEXP + w_searchTitle;
            // Set flag for show_find_options.
            fc.pattern_match = true;
            // Set flag for do_find_next().
            fc.request_pattern_match = true;
        }
        if (p_word) {
            w_searchTitle = Constants.USER_MESSAGES.INT_SEARCH_WORD + w_searchTitle;
            // Set flag for show_find_options.
            fc.whole_word = true;
            // Set flag for do_find_next().
            fc.request_whole_word = true;
        }

        fc.show_find_options(); // ! PRINT THEM BUT DONT CHANGE IN FTM/FIND PANEL

        const disposables: vscode.Disposable[] = [];

        // Get value from find panel input
        const w_startValue = this._lastSettingsUsed!.findText === Constants.USER_MESSAGES.FIND_PATTERN_HERE ? '' : this._lastSettingsUsed!.findText;

        try {
            return await new Promise<unknown>((resolve, reject) => {
                const input = vscode.window.createInputBox();
                input.title = w_searchTitle;
                input.value = w_startValue;
                input.prompt = w_searchPrompt;
                input.placeholder = w_searchPlaceholder;

                this._interactiveSearchOptions = {
                    search: "",
                    replace: "",
                    word: p_word,
                    regex: p_regex,
                    backward: p_backward
                };

                disposables.push(
                    input.onDidAccept(() => {
                        // utils.setContext(Constants.CONTEXT_FLAGS.INTERACTIVE_SEARCH, false);
                        if (!input.value) {
                            input.hide();
                            return resolve(true); // Cancelled with escape or empty string.
                        }
                        const value = input.value; // maybe this was replace.
                        this._interactiveSearchOptions.search = value;

                        const find_pattern = this._interactiveSearchOptions.search;
                        const change_pattern = this._interactiveSearchOptions.replace;

                        ftm.set_find_text(find_pattern);
                        fc.update_find_list(find_pattern);

                        this.loadSearchSettings(); // * Set vscode's find panel from the Leo find settings
                        fc.init_vim_search(find_pattern);
                        fc.init_in_headline();  // Required.
                        const settings = fc.ftm.get_settings();

                        let p, pos, newpos;
                        [p, pos, newpos] = fc.do_find_next(settings);
                        let w, focus;
                        let found;
                        w = this.get_focus(c); // get focus again after the operation
                        focus = this.widget_name(w);
                        found = p && p.__bool__();

                        this.findFocusTree = false; // Reset flag for headline range

                        if (!found || !focus) {
                            void vscode.window.showInformationMessage('Not found');
                            return resolve(true);
                        } else {
                            let w_finalFocus = Focus.Body;
                            const w_focus = focus.toLowerCase();
                            if (w_focus.includes('tree') || w_focus.includes('head')) {
                                // tree
                                w_finalFocus = Focus.Outline;
                                this.showOutlineIfClosed = true;
                                // * SETUP HEADLINE RANGE
                                this.findFocusTree = true;
                                this.findHeadlineRange = [w.sel[0], w.sel[1]];
                                this.findHeadlinePosition = c.p;
                            } else {
                                this.showBodyIfClosed = true;
                            }
                            const w_scroll = (found && w_finalFocus === Focus.Body) || undefined;

                            this.setupRefresh(
                                w_finalFocus, // ! Unlike gotoNavEntry, this sets focus in outline -or- body.
                                {
                                    tree: true, // HAVE to refresh tree because find folds/unfolds only result outline paths
                                    body: true,
                                    scroll: w_scroll,
                                    // documents: false,
                                    // buttons: false,
                                    states: true,
                                },
                                this.findFocusTree
                            );
                            void this.launchRefresh();
                            return resolve(true);
                        }

                    }),
                    input.onDidHide(() => {
                        // utils.setContext(Constants.CONTEXT_FLAGS.INTERACTIVE_SEARCH, false);
                        return resolve(true);
                    })
                );
                if (this._interactiveSearchInputBox) {
                    this._interactiveSearchInputBox.dispose(); // just in case.
                }
                this._interactiveSearchInputBox = input;
                this._interactiveSearchInputBox.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
            this._interactiveSearchInputBox?.hide();
        }

    }

    /**
     * * Set search setting in the search webview
     * @param p_id string id of the setting name
     */
    public setSearchSetting(p_id: string): void {
        if (this._findPanelWebviewExplorerView) {
            void this._findPanelWebviewExplorerView!.webview.postMessage({ type: 'setSearchSetting', id: p_id });
        }
        if (this._findPanelWebviewView) {
            void this._findPanelWebviewView!.webview.postMessage({ type: 'setSearchSetting', id: p_id });
        }
    }

    /**
     * Send the new content of the goto pane to the findPanel.
     */
    public setGotoContent(): void {
        const content = this.leoGotoProvider.nodeList.map(
            (gotoNode) => {
                return {
                    "tooltip": gotoNode.tooltip,
                    "key": gotoNode.key,
                    "entryType": gotoNode.entryType,
                    "description": gotoNode.description,
                    "label": gotoNode.leoPaneLabel
                };
            }
        );
        if (this._findPanelWebviewExplorerView && this._findPanelWebviewExplorerView.visible) {
            void this._findPanelWebviewExplorerView!.webview.postMessage({ type: 'refreshGoto', gotoContent: content });
        }
        if (this._findPanelWebviewView && this._findPanelWebviewView.visible) {
            void this._findPanelWebviewView!.webview.postMessage({ type: 'refreshGoto', gotoContent: content });
        }
    }

    /**
     * * Gets the search settings from Leo, and applies them to the find panel webviews
     */
    public loadSearchSettings(): void {

        if (!g.app.windowList.length || !g.app.windowList[this.frameIndex]) {
            return;
        }
        const c = g.app.windowList[this.frameIndex].c;
        const scon = c.quicksearchController;
        const leoISettings = c.findCommands.ftm.get_settings();
        const w_settings: LeoSearchSettings = {
            // Nav options
            navText: scon.navText,
            showParents: scon.showParents,
            isTag: scon.isTag,
            searchOptions: scon.searchOptions,
            //Find/change strings...
            findText: leoISettings.find_text,
            replaceText: leoISettings.change_text,
            // Find options...
            ignoreCase: leoISettings.ignore_case,
            markChanges: leoISettings.mark_changes,
            markFinds: leoISettings.mark_finds,
            wholeWord: leoISettings.whole_word,
            regExp: leoISettings.pattern_match,
            searchHeadline: leoISettings.search_headline,
            searchBody: leoISettings.search_body,
            // 0, 1 or 2 for outline, sub-outline, or node.
            searchScope:
                0 +
                (leoISettings.suboutline_only ? 1 : 0) +
                (leoISettings.node_only ? 2 : 0) +
                (leoISettings.file_only ? 3 : 0),
        };
        if (w_settings.searchScope > 2) {
            console.error('searchScope SHOULD BE 0, 1, 2 only: ', w_settings.searchScope);
        }
        this._lastSettingsUsed = w_settings;
        if (this._findPanelWebviewExplorerView) {
            void this._findPanelWebviewExplorerView.webview.postMessage({
                type: 'setSettings',
                value: w_settings,
            });
        }
        if (this._findPanelWebviewView) {
            void this._findPanelWebviewView.webview.postMessage({
                type: 'setSettings',
                value: w_settings,
            });
        }

    }

    /**
     * * Send the settings to Leo implementation
     * @param p_settings the search settings to be set in Leo implementation to affect next results
     * @returns
     */
    public saveSearchSettings(p_settings: LeoSearchSettings): Thenable<unknown> {

        if (!g.app.windowList.length || !g.app.windowList[this.frameIndex]) {
            return Promise.resolve();
        }

        this._lastSettingsUsed = p_settings;
        // convert to LeoGuiFindTabManagerSettings
        const searchSettings: LeoGuiFindTabManagerSettings = {
            // Nav settings
            is_tag: p_settings.isTag,
            nav_text: p_settings.navText,
            show_parents: p_settings.showParents,
            search_options: p_settings.searchOptions,
            // Find/change strings...
            find_text: p_settings.findText,
            change_text: p_settings.replaceText,
            // Find options...
            ignore_case: p_settings.ignoreCase,
            mark_changes: p_settings.markChanges,
            mark_finds: p_settings.markFinds,
            node_only: !!(p_settings.searchScope === 2),
            file_only: !!(p_settings.searchScope === 3),
            pattern_match: p_settings.regExp,
            search_body: p_settings.searchBody,
            search_headline: p_settings.searchHeadline,
            suboutline_only: !!(p_settings.searchScope === 1),
            whole_word: p_settings.wholeWord,
        };

        // Sets search options. Init widgets and ivars from param.searchSettings
        const c = g.app.windowList[this.frameIndex].c;
        const scon = c.quicksearchController;
        const find = c.findCommands;
        const ftm = c.findCommands.ftm;

        // * Try to set the search settings
        // nav settings
        scon.navText = searchSettings.nav_text;
        scon.showParents = searchSettings.show_parents;
        scon.isTag = searchSettings.is_tag;
        scon.searchOptions = searchSettings.search_options;

        // Find/change text boxes.
        const table: [string, string, string][] = [
            ['find_findbox', 'find_text', ''],
            ['find_replacebox', 'change_text', ''],
        ];
        for (let [widget_ivar, setting_name, w_default] of table) {
            const w = ftm[widget_ivar as keyof StringFindTabManager]; // getattr(ftm, widget_ivar)
            const s = searchSettings[setting_name as keyof LeoGuiFindTabManagerSettings] || w_default;
            w.clear();
            w.insert(s);
        }

        // Check boxes.
        const table2: [string, string][] = [
            ['ignore_case', 'check_box_ignore_case'],
            ['mark_changes', 'check_box_mark_changes'],
            ['mark_finds', 'check_box_mark_finds'],
            ['pattern_match', 'check_box_regexp'],
            ['search_body', 'check_box_search_body'],
            ['search_headline', 'check_box_search_headline'],
            ['whole_word', 'check_box_whole_word'],
        ];
        for (let [setting_name, widget_ivar] of table2) {
            const w = ftm[widget_ivar as keyof StringFindTabManager]; // getattr(ftm, widget_ivar)
            const val = searchSettings[setting_name as keyof LeoGuiFindTabManagerSettings];
            (find as any)[setting_name as keyof LeoFind] = val;
            if (val !== w.isChecked()) {
                w.toggle();
            }
        }

        // Radio buttons
        const table3: [string, string, string][] = [
            ['node_only', 'node_only', 'radio_button_node_only'],
            ['file_only', 'file_only', 'radio_button_file_only'],
            ['entire_outline', "", 'radio_button_entire_outline'],
            ['suboutline_only', 'suboutline_only', 'radio_button_suboutline_only'],
        ];
        for (let [setting_name, ivar, widget_ivar] of table3) {
            const w = ftm[widget_ivar as keyof StringFindTabManager]; // getattr(ftm, widget_ivar)
            const val = searchSettings[setting_name as keyof LeoGuiFindTabManagerSettings] || false;

            if (ivar) {
                // assert hasattr(find, setting_name), setting_name

                // setattr(find, setting_name, val)
                (find as any)[setting_name as keyof LeoFind] = val;

                if (val !== w.isChecked()) {
                    w.toggle();
                }
            }
        }

        // Ensure one radio button is set.
        const w = ftm.radio_button_entire_outline;
        const nodeOnly = searchSettings.node_only || false;
        const fileOnly = searchSettings.file_only || false;
        const suboutlineOnly = searchSettings.suboutline_only || false;

        if (!nodeOnly && !suboutlineOnly && !fileOnly) {
            find.entire_outline = true;
            if (!w.isChecked()) {
                w.toggle();
            }
        } else {
            find.entire_outline = false;
            if (w.isChecked()) {
                w.toggle();
            }
        }

        return Promise.resolve();
    }

    /**
     * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
     * @param p_frame Document node instance in the Leo document view to be the 'selected' one.
     */
    public setDocumentSelection(p_frame: LeoFrame): void {
        if (this._leoDocumentsRevealTimer) {
            clearTimeout(this._leoDocumentsRevealTimer);
        }
        this._leoDocumentsRevealTimer = setTimeout(() => {
            if (!this._leoDocuments.visible && !this._leoDocumentsExplorer.visible) {
                return;
            }
            let w_trigger = false;
            let w_docView: undefined | vscode.TreeView<LeoFrame>;
            if (this._leoDocuments.visible && this._lastLeoDocuments === this._leoDocuments) {
                w_docView = this._leoDocuments;
            } else if (this._leoDocumentsExplorer === this._lastLeoDocuments) {
                w_docView = this._leoDocumentsExplorer;
            }
            if (!w_docView) {
                return;
            }
            if (w_docView.selection.length && w_docView.selection[0] === p_frame) {
                // console.log('already selected!');
            } else {
                w_trigger = true;
            }
            if (w_trigger && !this._documentPaneReveal && w_docView.visible) {
                this._documentPaneReveal = w_docView.reveal(p_frame, { select: true, focus: false })
                    .then(
                        (p_result) => {
                            // Shown document node
                            this._documentPaneReveal = undefined;
                        },
                        (p_reason) => {
                            this._documentPaneReveal = undefined;
                            console.log('shown doc error on reveal: ', p_reason);
                        }
                    );
            }
        }, 0);
    }

    /**
     * * Cycle opened documents
     */
    public async tabCycle(): Promise<unknown> {
        await this.triggerBodySave(true);

        let w_chosenIndex;
        const w_files = g.app.windowList;

        if (w_files && w_files.length && w_files.length > 1) {
            if (this.frameIndex === w_files.length - 1) {
                w_chosenIndex = 0;
            } else {
                w_chosenIndex = this.frameIndex + 1;
            }
        } else {
            // "Only one, or no opened documents"
            return undefined;
        }

        this.finalFocus = Focus.Outline;
        return this.selectOpenedLeoDocument(w_chosenIndex);
    }

    /**
    * * Creates a new Leo file
    * @returns the promise started after it's done creating the frame and commander
    */
    public async newLeoFile(): Promise<unknown> {
        await this.triggerBodySave(true);

        this.showBodyIfClosed = true;
        this.showOutlineIfClosed = true;

        this.setupRefresh(Focus.NoChange, {
            tree: true,
            body: true,
            goto: true,
            documents: true,
            buttons: true,
            states: true
        });

        if (!this.leoStates.fileOpenedReady) {
            if (g.app.loadManager) {
                await g.app.loadManager.openEmptyLeoFile(this);
            }
        } else {
            await utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, true);
            await this.triggerBodySave(true);
            const c = g.app.windowList[this.frameIndex].c;
            await c.new(this);
            setTimeout(() => {
                void utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, false);
            }, 60);
        }
        this.loadSearchSettings();
        return this.launchRefresh();
    }

    /**
    * * Close an opened Leo file
    * @returns the promise started after it's done closing the Leo document
    */
    public async closeLeoFile(): Promise<unknown> {

        await this.triggerBodySave(true);

        this.setupRefresh(Focus.Body, {
            tree: true,
            body: true,
            goto: true,
            documents: true,
            buttons: true,
            states: true
        });

        const c = g.app.windowList[this.frameIndex].c;
        await c.close();
        void this.launchRefresh(); // start to refresh first
        return this.loadSearchSettings();
    }

    /**
     * * Sets up the call to the 'open-outline' command and its possible file url parameter.
     * @param p_leoFileUri optional uri for specifying a file, if missing, a dialog will open
     * @returns A promise that resolves when done trying to open the file
     */
    public async openLeoFile(p_uri?: vscode.Uri): Promise<unknown> {

        if (p_uri) {
            if (!!p_uri.toJSON && !!p_uri.fsPath && p_uri.fsPath.trim()) {
                // valid: pass!
            } else {
                p_uri = undefined; // clear uri
            }
        }

        if (!this.leoStates.fileOpenedReady) {
            // override with given argument
            let fileName: string;

            // make sure it's a real uri because vscode may send selected
            // node from other tree that has this command in title

            if (p_uri && p_uri?.fsPath?.trim() && g.app.loadManager) {
                fileName = p_uri.fsPath;
            } else {
                fileName = await this.runOpenFileDialog(
                    undefined,
                    "Open",
                    [
                        ["Leo files", "*.leojs *.leo *.db"],
                        ["Python files", "*.py"],
                        ["All files", "*"]
                    ],
                    g.defaultLeoFileExtension(),
                );
            }
            if (fileName && g.app.loadManager) {
                await utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, true);
                const commander = await g.app.loadManager.loadLocalFile(fileName, this);
                if (!commander) {
                    void vscode.window.showErrorMessage('can not open:' + '"' + fileName + '"');
                    return Promise.resolve();
                }
                this.showBodyIfClosed = true;
                this.showOutlineIfClosed = true;
                this.setupRefresh(this.finalFocus, {
                    tree: true,
                    body: true,
                    goto: true,
                    states: true,
                    documents: true,
                    buttons: true
                });
                void this.launchRefresh();
                setTimeout(() => {
                    void utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, false);
                }, 60);
            } else {
                return Promise.resolve();
            }
        } else {
            await this.triggerBodySave(true);
            const c = g.app.windowList[this.frameIndex].c;
            await utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, true);
            await c.open_outline(p_uri);
            this.showBodyIfClosed = true;
            this.showOutlineIfClosed = true;
            this.setupRefresh(this.finalFocus, {
                tree: true,
                body: true,
                goto: true,
                states: true,
                documents: true,
                buttons: true
            });
            setTimeout(() => {
                void utils.setContext(Constants.CONTEXT_FLAGS.LEO_OPENING_FILE, false);
            }, 60);
            void this.launchRefresh();
        }
        return this.loadSearchSettings();
    }

    /**
     * * Shows the recent Leo files list, choosing one will open it
     * @returns A promise that resolves when the a file is finally opened, rejected otherwise
     */
    public async showRecentLeoFiles(): Promise<unknown> {

        // if shown, chosen and opened
        let w_recentFiles: string[] = g.app.recentFilesManager.recentFiles;
        w_recentFiles = w_recentFiles.filter(str => str.trim() !== "");

        let q_chooseFile: Thenable<string | undefined>;
        if (w_recentFiles.length) {
            q_chooseFile = vscode.window.showQuickPick(w_recentFiles, {
                placeHolder: Constants.USER_MESSAGES.OPEN_RECENT_FILE,
            });
        } else {
            // No file to list
            return vscode.window.showInformationMessage('Recent files list empty');
        }
        const w_result = await q_chooseFile;
        if (w_result) {

            // Is there a file opened?
            if (g.app.windowList.length && g.app.windowList[this.frameIndex]) {
                const c = g.app.windowList[this.frameIndex].c;
                await this.triggerBodySave(true);
                if (g.doHook("recentfiles1", { c: c, p: c.p, v: c.p.v, fileName: w_result })) {
                    return Promise.resolve(undefined);
                }
            }

            // Either way, try to open the file
            await this.openLeoFile(vscode.Uri.file(w_result));

            // Now, maybe there is a file opened?
            if (g.app.windowList.length && g.app.windowList[this.frameIndex]) {
                // Already opened file
                const c = g.app.windowList[this.frameIndex].c;
                g.doHook("recentfiles2", { c: c, p: c.p, v: c.p.v, fileName: w_result });
            }
        }
        return Promise.resolve(undefined);

    }

    /**
     * * Asks for file name and path, then saves the Leo file
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns a promise from saving the file results.
     */
    public async saveAsLeoFile(p_fromOutline?: boolean): Promise<unknown> {
        await this.triggerBodySave(true);

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
        void this.launchRefresh();
        return;
    }

    /**
     * * Asks for .leojs file name and path, then saves the JSON Leo file
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns a promise from saving the file results.
     */
    public async saveAsLeoJsFile(p_fromOutline?: boolean): Promise<unknown> {
        await this.triggerBodySave(true);

        const c = g.app.windowList[this.frameIndex].c;

        this.setupRefresh(
            p_fromOutline ? Focus.Outline : Focus.Body,
            {
                tree: true,
                states: true,
                documents: true
            }
        );

        // ! THIS WOULD DO A 'SAVE TO' INSTEAD OF 'SAVE AS' !
        // await c.save_as_leojs();

        // * DO THIS INSTEAD !
        let fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Save As JSON (.leojs)',
            [['Leo JSON files', '*.leojs']],
            '.leojs'
        );
        if (!fileName) {
            return;
        }
        if (!fileName.endsWith('.leojs')) {
            fileName = `${fileName}.leojs`;
        }
        await c.save(fileName);

        void this.launchRefresh();
        return;
    }

    /**
     * * Invokes the commander.save() command
     * @param p_fromOutlineSignifies that the focus was, and should be brought back to, the outline
     * @returns Promise that resolves when the save command is done
     */
    public async saveLeoFile(p_fromOutline?: boolean): Promise<unknown> {
        await this.triggerBodySave(true);

        const c = g.app.windowList[this.frameIndex].c;

        await c.save();

        // ON THE WEB THE SAVE DOES NOT FINISH BEFORE INTERUPTING OTHER COMMANDS!
        setTimeout(() => {
            this.setupRefresh(
                p_fromOutline ? Focus.Outline : Focus.Body,
                {
                    tree: true,
                    states: true,
                    documents: true
                }
            );
            void this.launchRefresh();
        });

        return Promise.resolve();
    }

    /**
     * * Show switch document 'QuickPick' dialog and switch file if selection is made, or just return if no files are opened.
     * @returns A promise that resolves with a textEditor of the selected node's body from the newly selected document
     */
    public async switchLeoFile(): Promise<unknown> {

        await this.triggerBodySave(true);

        const w_entries: ChooseDocumentItem[] = []; // Entries to offer as choices.
        let w_index: number = 0;
        const w_files: LeoDocument[] = g.app.windowList.map((p_frame) => {
            const s = p_frame.c.fileName();
            const w_filename = s ? utils.getFileFromPath(s) : Constants.UNTITLED_FILE_NAME;
            return {
                name: w_filename,
                index: w_index++,
                changed: p_frame.c.isChanged(),
                selected: g.app.windowList[this.frameIndex] === p_frame,
            };
        });
        w_index = 0; // reset w_index
        let w_chosenDocument: ChooseDocumentItem | undefined;
        if (w_files && w_files.length) {
            w_files.forEach(function (p_filePath: LeoDocument) {
                w_entries.push({
                    label: w_index.toString(),
                    description: p_filePath.name
                        ? p_filePath.name
                        : Constants.UNTITLED_FILE_NAME,
                    value: w_index,
                    alwaysShow: true,
                });
                w_index++;
            });
            const w_pickOptions: vscode.QuickPickOptions = {
                matchOnDescription: true,
                placeHolder: Constants.USER_MESSAGES.CHOOSE_OPENED_FILE,
            };
            w_chosenDocument = await vscode.window.showQuickPick(w_entries, w_pickOptions);
        } else {
            // "No opened documents"
            return Promise.resolve(undefined);
        }
        if (w_chosenDocument) {
            return Promise.resolve(this.selectOpenedLeoDocument(w_chosenDocument.value));
        } else {
            // Canceled
            return Promise.resolve(undefined);
        }

    }

    /**
     * * Switches Leo document directly by index number. Used by document treeview and switchLeoFile command.
     * @param p_index position of the opened Leo document in the document array
     * @returns A promise that resolves with a textEditor of the selected node's body from the newly opened document
     */
    public async selectOpenedLeoDocument(p_index: number, p_fromOutline?: boolean): Promise<unknown> {

        await this.triggerBodySave(true);
        this.frameIndex = p_index;
        // Like we just opened or made a new file
        if (g.app.windowList.length) {
            this.setupRefresh(
                this.finalFocus,
                {
                    tree: true,
                    body: true,
                    documents: true,
                    buttons: true,
                    states: true,
                    goto: true

                }
            );
            void this.launchRefresh();
            this.loadSearchSettings();
        } else {
            void this.launchRefresh();
            console.log('Select Opened Leo File Error');
            return Promise.reject('Select Opened Leo File Error');
        }

    }

    /**
     * * Invoke an '@button' click directly by index string. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was clicked
     * @returns Promises that resolves when done
     */
    public async clickAtButton(p_node: LeoButtonNode): Promise<unknown> {

        await this.triggerBodySave(true);
        const c = g.app.windowList[g.app.gui.frameIndex].c;
        const d = c.theScriptingController.buttonsArray;
        const button = d[p_node.button.index];
        let result: any;
        if (p_node.rclicks.length) {
            // Has rclicks so show menu to choose
            this._rclickSelected = [];
            let w_rclick: number[] | undefined;
            const p_picked = await this._handleRClicks(p_node.rclicks, p_node.button.name);

            if (
                p_picked
            ) {
                // Check if only one in this._rclickSelected and is zero: normal press
                if (this._rclickSelected.length === 1 && this._rclickSelected[0] === 0) {
                    // Normal 'top' button, not one of it's child rclicks.
                } else {
                    // One of its child 'rclick', so decrement first one, and send this._rclickSelected as array of choices
                    this._rclickSelected[0] = this._rclickSelected[0] - 1;
                    w_rclick = this._rclickSelected;
                }

                try {
                    let w_rclickChosen: RClick | undefined;

                    if (w_rclick && button.rclicks) {
                        // Had w_rclick setup so it's a child rclick, not the recular 'top' button.
                        let toChooseFrom: RClick[] = button.rclicks;
                        for (const i_rc of w_rclick) {
                            w_rclickChosen = toChooseFrom[i_rc];
                            toChooseFrom = w_rclickChosen.children;
                        }
                        if (w_rclickChosen) {
                            result = c.theScriptingController.executeScriptFromButton(button, '', w_rclickChosen.position, '');
                        }
                    } else {
                        // Normal 'top' button.
                        result = await Promise.resolve(button.command());
                    }

                } catch (e: any) {
                    void vscode.window.showErrorMessage("LEOJS: LeoUI clickAtButton Error: " + e.toString());
                }

            } else {
                // Escaped so  just return, no 'setupRefresh' nor 'launchRefresh'!
                return Promise.resolve();
            }

        } else {
            // no rclicks nor menus, so just call the button's command.
            result = await Promise.resolve(button.command());
        }

        this.setupRefresh(Focus.NoChange, {
            tree: true,
            body: true,
            documents: true,
            buttons: true,
            states: true
        });

        void this.launchRefresh();
        return result;

    }

    /**
     * * Show input window to select
     */
    private async _handleRClicks(p_rclicks: RClick[], topLevelName?: string): Promise<ChooseRClickItem | undefined> {
        const w_choices: ChooseRClickItem[] = [];
        let w_index = 0;
        if (topLevelName) {
            w_choices.push(
                { label: topLevelName, picked: true, alwaysShow: true, index: w_index++ }
            );
        }
        w_choices.push(
            ...p_rclicks.map((p_rclick): ChooseRClickItem => { return { label: p_rclick.position.h, index: w_index++, rclick: p_rclick }; })
        );
        const w_options: vscode.QuickPickOptions = {
            placeHolder: Constants.USER_MESSAGES.CHOOSE_BUTTON
        };
        const w_picked = await vscode.window.showQuickPick(w_choices, w_options);
        if (w_picked) {
            this._rclickSelected.push(w_picked.index);
            if (topLevelName && w_picked.index === 0) {
                return Promise.resolve(w_picked);
            }
            if (w_picked.rclick && w_picked.rclick.children && w_picked.rclick.children.length) {
                return this._handleRClicks(w_picked.rclick.children);
            } else {
                return Promise.resolve(w_picked);
            }
        }
        return Promise.resolve(undefined);
    }

    /**
     * * Finds and goes to the script of an at-button. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was right-clicked
     * @returns the launchRefresh promise started after it's done finding the node
     */
    public async gotoScript(p_node: LeoButtonNode): Promise<unknown> {

        await this.triggerBodySave(true);
        const tag = 'goto_script';
        const index = p_node.button.index;
        const old_c = g.app.windowList[g.app.gui.frameIndex].c;
        const d = old_c.theScriptingController.buttonsArray;
        const butWidget = d[index];

        if (butWidget) {

            try {
                const gnx: string = butWidget.command.gnx;
                let new_c = old_c;
                const w_result = await old_c.theScriptingController.open_gnx(old_c, gnx);
                let p: Position | undefined; // Replace YourPType with actual type

                if (w_result[0] && w_result[1]) {
                    p = w_result[1];
                    new_c = w_result[0];
                } else {
                    new_c = old_c;
                }

                g.app.gui.frameIndex = 0;
                for (const w_f of g.app.windowList) {
                    if (w_f.c === new_c) {
                        break;
                    }
                    g.app.gui.frameIndex++;
                }
                // g.app.gui.frameIndex now points to the selected Commander.

                if (p) {
                    new_c.selectPosition(p);
                    this.setupRefresh(
                        Focus.Outline,
                        {
                            tree: true,
                            body: true,
                            documents: true,
                            states: true,
                            buttons: true,
                        }
                    );
                    return this.launchRefresh();
                } else {
                    throw new Error(`${tag}: not found ${gnx}`);
                }

            } catch (e) {
                g.es_exception(e);
            }

        }
        return Promise.resolve(false);

    }

    /**
     * * Removes an '@button' from Leo's button dict, directly by index string. Used by '@buttons' treeview.
     * @param p_node the node of the at-buttons panel that was chosen to remove
     * @returns Thenable that resolves when done
     */
    public async removeAtButton(p_node: LeoButtonNode): Promise<unknown> {

        await this.triggerBodySave(true);
        const tag: string = 'remove_button';
        const index = p_node.button.index;
        const c = g.app.windowList[g.app.gui.frameIndex].c;
        const d = c.theScriptingController.buttonsArray;
        const butWidget = d[index];
        if (butWidget) {
            try {
                d.splice(index, 1);
            } catch (e) {
                g.es_exception(e);
            }
        } else {
            console.log(`LEOJS : ERROR ${tag}: button ${String(index)} does not exist`);
        }
        this.setupRefresh(Focus.NoChange, { buttons: true });
        return this.launchRefresh();

    }

    /**
     * * Reverts to a particular undo bead state
     */
    public revertToUndo(p_undo: LeoUndoNode): Promise<any> {

        if (p_undo.contextValue !== Constants.CONTEXT_FLAGS.UNDO_BEAD) {
            return Promise.resolve();
        }
        let action = "redo"; // Constants.LEOBRIDGE.REDO;
        let repeat = p_undo.beadIndex;
        if (p_undo.beadIndex <= 0) {
            action = "undo"; // Constants.LEOBRIDGE.UNDO;
            repeat = (-p_undo.beadIndex) + 1;
        }
        const c = g.app.windowList[this.frameIndex].c;
        const u = c.undoer;
        for (let x = 0; x < repeat; x++) {
            if (action === "redo") {
                if (u.canRedo()) {
                    u.redo();
                }
            } else if (action === "undo") {
                if (u.canUndo()) {
                    u.undo();
                }
            }
        }
        this.setupRefresh(
            Focus.Outline,
            {
                tree: true,
                body: true,
                documents: true,
                states: true,
                buttons: true,
            }
        );
        return Promise.resolve(this.launchRefresh());
    }

    /**
     * * highlights the current undo state without disturbing focus
     * @param p_undoNode Node instance in the Leo History view to be the 'selected' one.
     */
    private _setUndoSelection(p_undoNode: LeoUndoNode): void {
        if (this._lastLeoUndos && this._lastLeoUndos.visible && !this._undoPaneReveal) {
            this._undoPaneReveal = this._lastLeoUndos.reveal(p_undoNode, { select: true, focus: false }).then(
                () => {
                    this._undoPaneReveal = undefined;
                },
                (p_error) => {
                    this._undoPaneReveal = undefined;
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
        void vscode.window.showInformationMessage(
            Constants.USER_MESSAGES.SET_LEO_ID_MESSAGE,
            { modal: true, detail: Constants.USER_MESSAGES.GET_LEO_ID_PROMPT },
            Constants.USER_MESSAGES.ENTER_LEO_ID
        ).then(p_chosenButton => {
            if (p_chosenButton === Constants.USER_MESSAGES.ENTER_LEO_ID) {
                void vscode.commands.executeCommand(Constants.COMMANDS.SET_LEO_ID);
            }
        });
    }

    /**
     * Handle a successful find match.
     */
    public show_find_success(c: Commands, in_headline: boolean, insert: number, p: Position): void {
        // TODO : see focus_to_body !
        // TODO : USE ONLY 'WRAPPER' OR 'WIDGET' like in show_find_success!
        if (in_headline) {
            // edit_widget(p)
            // c.frame.edit_widget(p);
            // console.log('try to set');
            try {
                g.app.gui.set_focus(c, c.frame.tree.edit_widget(p));
            }
            catch (e) {
                console.log('oops!', e);

            }
            // g.app.gui.set_focus(c, { _name: 'tree' });
        } else {
            try {
                g.app.gui.set_focus(c, c.frame.body.widget);
            }
            catch (e) {
                console.log('oops!', e);
            }
        }

        // edit_widget
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
        this.showBodyIfClosed = true;
        this.showOutlineIfClosed = true;
    }

    /**
     * * Command to get the LeoID from dialog, save it to user settings.
     * Start leojs if the ID is valid, and not already started.
     */
    public setLeoIDCommand(): Thenable<unknown> {
        return g.IDDialog().then((p_id) => {
            p_id = p_id.trim();
            p_id = g.app.cleanLeoID(p_id, '');
            if (p_id && p_id.length >= 3 && utils.isAlphaNumeric(p_id)) {
                // valid id: set in config settings
                return this.setIdSetting(p_id);
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
        if (p_leoID.trim().length >= 3 && utils.isAlphaNumeric(p_leoID)) {
            // OK not empty
            if (g.app.leoID !== p_leoID) {
                g.app.leoID = p_leoID;
                void g.app.setIDFile();
                g.blue('leoID=' + p_leoID);
            }

            if (g.app.nodeIndices) {
                g.app.nodeIndices.userId = p_leoID;
            }
            // If LeoJS had finish its startup without valid LeoID, set ready flags!
            if (!this.leoStates.leoReady && this.leoStates.leojsStartupDone && this.leoStates.leoIdUnset) {
                if (g.app.leoID && g.app.leoID !== 'None') {
                    this.createLogPane();
                    if (g.isNewLeoJSVersion) {
                        this.showLogPane();
                    }
                    this.leoStates.leoIdUnset = false;
                    this.leoStates.leoReady = true;
                    if (g.app.windowList.length) {
                        if (this.config.showUnlOnStatusBar) {
                            this._leoStatusBar?.show();
                        }
                        this.leoStates.fileOpenedReady = true;
                        this.fullRefresh();
                    }
                } else {
                    void vscode.window.showWarningMessage("'None' is a reserved LeoID, please choose another one.");
                }
            }
        } else if (!p_leoID.trim()) {
            // empty, go back to default
            if (g.app.nodeIndices && g.app.nodeIndices.defaultId) {
                g.app.leoID = g.app.nodeIndices.defaultId;
                g.app.nodeIndices.userId = g.app.nodeIndices.defaultId;
            }
        }

        if (this.config.leoID !== p_leoID) {
            return this.config.setLeojsSettings(w_changes);
        }
        return Promise.resolve();
    }

    public widget_name(w: any): string {
        let name: string;
        if (!w) {
            name = '<no widget>';
        } else if (w['getName']) {
            name = w.getName();
        } else if (w['objectName']) {
            name = w.objectName();
        } else if (w['_name']) {
            name = w._name;
        } else if (w['name']) {
            name = w.name;
        } else {
            name = w.toString();
        }
        return name;
    }

    public set_focus(commander: Commands, widget: any): void {
        this.focusWidget = widget;
        const w_widgetName = this.widget_name(widget);
        // * LeoJS custom finalFocus replacement.
        if (widget && this.finalFocus === Focus.NoChange) {
            // * Check which panel to focus
            let w_target = Focus.NoChange;
            if (w_widgetName === 'body') {
                w_target = Focus.Body;
            } else if (w_widgetName === 'tree') {
                w_target = Focus.Outline;
            }
            this.setupRefresh(w_target);
        } else {
            // pass
        }
    }

    public get_focus(c?: Commands): StringTextWrapper {
        return this.focusWidget!;
    }

    /**
     * Checks if Session per workspace is true, if so returns unl list
     * Undefined otherwise.
     * Note: Can be used to check for Session per workspace flag.
     */
    public getWorkspaceSession(): string[] | undefined {
        if (this.config.sessionPerWorkspace) {
            return this._context.workspaceState.get(Constants.LAST_FILES_KEY) || [];
        } else {
            return undefined;
        }
    }

    /**
     * Sets session unl list for this workspace
     */
    public setWorkspaceSession(unls: string[]): Thenable<void> {
        return this._context.workspaceState.update(Constants.LAST_FILES_KEY, unls);
    }

    /**
     * Put focus in body widget.
     */
    public focus_to_body(c: Commands, p: Position): void {
        // TODO : see show_find_success !
        // TODO : USE ONLY 'WRAPPER' OR 'WIDGET' like in show_find_success!
        this.set_focus(c, c.frame.body.wrapper);
    }
    /**
     * Put focus in tree widget.
     */
    public focus_to_head(c: Commands, p: Position): void {
        this.set_focus(c, c.frame.tree.treeWidget);
    }
    /**
     * * VSCode Wrapper for showInputBox, or, for showQuickPick if tabList is given.
     */
    public get1Arg(
        options?: vscode.InputBoxOptions | vscode.QuickPickOptions,
        token?: vscode.CancellationToken,
        tabList?: string[]
    ): Thenable<string | undefined> {
        if (tabList) {
            const itemList: vscode.QuickPickItem[] = tabList.map(
                (entry) => { return { label: entry }; }
            );
            return vscode.window.showQuickPick(itemList, options).then(
                (p_picked) => {
                    if (p_picked && p_picked.label) {
                        return p_picked.label;
                    }
                    return undefined;
                }
            );
        } else {
            return vscode.window.showInputBox(options, token);
        }
    }

    /**
     * * Gets a single character input from the user, automatically accepting as soon as a character is entered
     * @param options Options for the input box
     * @param token Optional cancellation token
     * @returns A promise that resolves to the entered character or undefined if cancelled
     */
    public get1Char(
        options?: vscode.InputBoxOptions,
        token?: vscode.CancellationToken
    ): Thenable<string | undefined> {
        return new Promise<string | undefined>((resolve) => {
            const disposables: vscode.Disposable[] = [];
            const inputBox = vscode.window.createInputBox();

            // Apply options if provided
            if (options) {
                if (options.title) { inputBox.title = options.title; }
                if (options.prompt) { inputBox.prompt = options.prompt; }
                if (options.placeHolder) { inputBox.placeholder = options.placeHolder; }
                if (options.password !== undefined) { inputBox.password = options.password; }
                if (options.ignoreFocusOut !== undefined) { inputBox.ignoreFocusOut = options.ignoreFocusOut; }
            }

            // Auto-accept on first character input
            disposables.push(
                inputBox.onDidChangeValue((value) => {
                    if (value.length > 0) {
                        const char = value[0]; // Get the first character
                        resolve(char);
                        inputBox.hide();
                    }
                })
            );

            // Accept empty input on Enter key
            disposables.push(
                inputBox.onDidAccept(() => {
                    if (inputBox.value.length === 0) {
                        resolve(""); // Return empty string when Enter is pressed with no input
                        inputBox.hide();
                    } else {
                        // If there's a character, use the first one
                        resolve(inputBox.value[0]);
                        inputBox.hide();
                    }
                })
            );

            // Handle cancellation
            disposables.push(
                inputBox.onDidHide(() => {
                    disposables.forEach(d => d.dispose());
                    resolve(undefined);
                })
            );

            // Handle cancellation token
            if (token) {
                disposables.push(
                    token.onCancellationRequested(() => {
                        inputBox.hide();
                    })
                );
            }

            // Show the input box
            inputBox.show();
        });
    }

    public runAboutLeoDialog(
        c: Commands | undefined,
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
        c: Commands | undefined,
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
        c: Commands | undefined,
        title: string,
        message: string,
        yes_all = false,
        no_all = false
    ): Thenable<string> {
        const w_choices = [
            Constants.USER_MESSAGES.YES,
            Constants.USER_MESSAGES.NO
            // Note: Already shows a 'cancel' !
        ];
        if (yes_all) {
            w_choices.push(Constants.USER_MESSAGES.YES_ALL,);
        }
        if (no_all) {
            w_choices.push(Constants.USER_MESSAGES.NO_ALL,);
        }

        return vscode.window
            .showInformationMessage(
                title,
                {
                    modal: true,
                    detail: message
                },
                ...w_choices
            )
            .then((answer) => {
                if (answer === Constants.USER_MESSAGES.YES) {
                    return Constants.USER_MESSAGES.YES.toLowerCase();
                } else if (answer === Constants.USER_MESSAGES.NO) {
                    return Constants.USER_MESSAGES.NO.toLowerCase();
                } else if (answer === Constants.USER_MESSAGES.YES_ALL) {
                    return "yes-all";
                } else { // (answer === Constants.USER_MESSAGES.NO_ALL)
                    return "no-all";
                }
            });
    }

    public runAskYesNoCancelDialog(
        c: Commands | undefined,
        title: string,
        message: string,
        yesMessage = Constants.USER_MESSAGES.YES,
        noMessage = Constants.USER_MESSAGES.NO,
        yesToAllMessage = "",
        defaultButton = Constants.USER_MESSAGES.YES,
        cancelMessage = ""
    ): Thenable<string> {
        const w_choices = [
            yesMessage,
            noMessage,
            // Note: Already shows a 'cancel' !
        ];
        if (yesToAllMessage) {
            w_choices.push(yesToAllMessage);
        }
        if (cancelMessage) {
            w_choices.push(cancelMessage);
        }

        return vscode.window
            .showInformationMessage(
                title,
                {
                    modal: true,
                    detail: message
                },
                ...w_choices
                // Note: Already shows a 'cancel' !
            )
            .then((answer) => {
                if (answer === yesMessage) {
                    return 'yes';
                } else if (answer === noMessage) {
                    return 'no';
                } else if (answer === yesToAllMessage) {
                    return 'yes-to-all';
                } else if (answer === cancelMessage) {
                    return 'cancel';
                } else {
                    return 'cancel'; // undefined will yield this 'cancel'.
                }
            });
    }

    public runOpenFileDialog(
        c: Commands | undefined,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        startpath?: string
    ): Thenable<string> {
        // convert to { [name: string]: string[] } typing
        const types: { [name: string]: string[] } = utils.convertLeoFiletypes(filetypes);
        return vscode.window.showOpenDialog(
            {
                title: title,
                canSelectMany: false,
                filters: types
            }
        ).then((p_uris) => {
            const names: string[] = [];
            if (p_uris && p_uris.length) {
                p_uris.forEach(w_uri => {
                    names.push(w_uri.fsPath);
                });
            }
            let fileName = g.os_path_fix_drive(names.length ? names[0] : "");
            fileName = g.os_path_normslashes(fileName);
            return fileName;
        });
    }

    public runOpenFilesDialog(
        c: Commands | undefined,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        startpath?: string
    ): Thenable<string[]> {
        // convert to { [name: string]: string[] } typing
        const types: { [name: string]: string[] } = utils.convertLeoFiletypes(filetypes);
        return vscode.window.showOpenDialog(
            {
                title: title,
                canSelectMany: true,
                filters: types
            }
        ).then((p_uris) => {
            const names: string[] = [];
            if (p_uris && p_uris.length) {
                p_uris.forEach(w_uri => {
                    names.push(w_uri.fsPath);
                });
            }
            return names.map((p_name) => {
                let fileName = g.os_path_fix_drive(p_name);
                fileName = g.os_path_normslashes(fileName);
                return fileName;
            });
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
                let fileName = g.os_path_fix_drive(p_uri.fsPath);
                fileName = g.os_path_normslashes(fileName);
                return fileName;
            } else {
                return "";
            }
        });
    }

    public destroySelf(): void {
        // pass // Nothing more needs to be done once all windows have been destroyed.
    }

}

