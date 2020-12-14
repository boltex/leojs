import * as vscode from "vscode";
import { debounce } from "debounce";
import * as utils from "./utils";
import { Constants } from "./constants";
import {
    RevealType,
    Icon,
    ReqRefresh,
    ChooseDocumentItem,
    MinibufferCommand,
    UserCommand,
    ShowBodyParam,
} from "./types";

import { LeoNode } from "./leoNode";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode } from "./leoButtonNode";
import { LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentNode } from "./leoDocumentNode";
import { LeoDocumentsProvider } from "./leoDocuments";
import { LeoStates } from "./leoStates";

/**
 * Implements https://github.com/leo-editor/leo-editor/issues/1025
 */
export class LeoJs {
    // * State flags
    public leoStates: LeoStates;

    // * Icon Paths (Singleton static arrays)
    public nodeIcons: Icon[] = [];
    public documentIcons: Icon[] = [];
    public buttonIcons: Icon[] = [];

    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh

    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.

    // * Outline Pane
    private _leoTreeProvider: LeoOutlineProvider; // TreeDataProvider single instance
    private _leoTreeView: vscode.TreeView<LeoNode>; // Outline tree view added to the Tree View Container with an Activity Bar icon
    private _leoTreeExView: vscode.TreeView<LeoNode>; // Outline tree view added to the Explorer Sidebar
    private _lastTreeView: vscode.TreeView<LeoNode>; // Last visible treeview

    private _lastSelectedNode: LeoNode | undefined; // Last selected node we got a hold of; leoTreeView.selection maybe newer and unprocessed
    get lastSelectedNode(): LeoNode | undefined {
        return this._lastSelectedNode;
    }
    set lastSelectedNode(p_leoNode: LeoNode | undefined) { // Needs undefined type because it cannot be set in the constructor
        this._lastSelectedNode = p_leoNode;
        if (p_leoNode) {
            utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_MARKED, p_leoNode.marked); // Global context to 'flag' the selected node's marked state
        }
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

        // * Build Icon filename paths
        this.nodeIcons = utils.buildNodeIconPaths(_context);
        this.documentIcons = utils.buildDocumentIconPaths(_context);
        this.buttonIcons = utils.buildButtonsIconPaths(_context);

        // * Create file browser instance
        // this._leoFilesBrowser = new LeoFilesBrowser(_context);

        // * Create a single data provider for both outline trees, Leo view and Explorer view
        this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons);
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
        this._leoDocumentsProvider = new LeoDocumentsProvider(this);
        this._leoDocuments = vscode.window.createTreeView(Constants.DOCUMENTS_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._leoDocuments.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, false)));
        this._leoDocumentsExplorer = vscode.window.createTreeView(Constants.DOCUMENTS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._leoDocumentsExplorer.onDidChangeVisibility((p_event => this._onDocTreeViewVisibilityChanged(p_event, true)));

        // * Create '@buttons' Treeview Providers and tree views
        this._leoButtonsProvider = new LeoButtonsProvider(this);
        this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtons.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, false)));
        this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtonsExplorer.onDidChangeVisibility((p_event => this._onButtonsTreeViewVisibilityChanged(p_event, true)));

        // * Debounced refresh flags and UI parts, other than the tree and body, when operation(s) are done executing
        this.getStates = debounce(this._triggerGetStates, Constants.STATES_DEBOUNCE_DELAY);
        this.refreshDocumentsPane = debounce(this._refreshDocumentsPane, Constants.DOCUMENTS_DEBOUNCE_DELAY);
    }

    /**
     * 'getStates' action for use in debounced method call
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
            // this.leoStates.setLeoStateFlags(this._leoStates); //
        }
    }

    /**
     * Public method to refresh the documents pane
     * Document Panel May be refreshed by other services (states service, ...)
     */
    private _refreshDocumentsPane(): void {
        this._leoDocumentsProvider.refreshTreeRoot();
    }


    /**
     * * Handles the node expanding and collapsing interactions by the user in the treeview
     * @param p_event The event passed by vscode
     * @param p_expand True if it was an expand, false if it was a collapse event
     * @param p_treeView Pointer to the treeview itself, either the standalone treeview or the one under the explorer
     */
    private _onChangeCollapsedState(p_event: vscode.TreeViewExpansionEvent<LeoNode>, p_expand: boolean, p_treeView: vscode.TreeView<LeoNode>): void {
        // * Expanding or collapsing via the treeview interface selects the node to mimic Leo
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flag to signify that the treeview who triggered this event is the one in the explorer view
     */
    private _onTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_event.visible) {
            this._lastTreeView = p_explorerView ? this._leoTreeExView : this._leoTreeView;
            //  this._refreshOutline(true, RevealType.RevealSelect);
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
            this.refreshDocumentsPane();
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
            this._leoButtonsProvider.refreshTreeRoot();
        }
    }

    /**
     * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
     * @param p_documentNode Document node instance in the Leo document view to be the 'selected' one.
     */
    public setDocumentSelection(p_documentNode: LeoDocumentNode): void {
        this._currentDocumentChanged = p_documentNode.documentEntry.changed;
        this.leoStates.leoOpenedFileName = p_documentNode.documentEntry.name;
        setTimeout(() => {
            if (!this._leoDocuments.visible && !this._leoDocumentsExplorer.visible) {
                return;
            }
            let w_trigger = false;
            let w_docView: vscode.TreeView<LeoDocumentNode>;
            if (this._leoDocuments.visible) {
                w_docView = this._leoDocuments;
            } else {
                w_docView = this._leoDocumentsExplorer;
            }
            if (w_docView.selection.length && w_docView.selection[0] === p_documentNode) {
                // console.log('already selected!');
            } else {
                w_trigger = true;
            }
            if (w_trigger) {
                w_docView.reveal(p_documentNode, { select: true, focus: false });
            }
        }, 0);
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
        p_node: LeoNode | undefined,
        p_refreshType: ReqRefresh,
        p_fromOutline: boolean,
        p_keepSelection?: boolean
    ): Thenable<unknown> {
        vscode.window.showInformationMessage(
            'TODO: Implement ' +
            p_cmd +
            " called from " +
            (p_fromOutline ? "outline" : "body") +
            " operate on " +
            (p_node ? p_node!.label : "the selected node") +
            (p_keepSelection ? " and bring selection back on currently selected node" : "")
        );
        console.log('Refresh those UI elements:', p_refreshType);

        return Promise.resolve(true);
    }

    /**
     * Opens quickPick minibuffer pallette to choose from all commands in this file's Thenable
     * @returns Thenable from the command resolving - or resolve with undefined if cancelled
     */
    public minibuffer(): Thenable<unknown> {
        // if choice made and command executes, replace 'true' with command output if any
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public clickAtButton(p_node: LeoButtonNode): void { }
    public removeAtButton(p_node: LeoButtonNode): void { }

    public closeLeoFile(): void { }
    public newLeoFile(): void { }
    public openLeoFile(p_uri?: vscode.Uri): void { }
    public showRecentLeoFiles(): void { }
    public saveAsLeoFile(p_fromOutline?: boolean): void { }
    public saveLeoFile(p_fromOutline?: boolean): void { }
    public switchLeoFile(): void { }
    public selectOpenedLeoDocument(p_index: number): void { }

    public editHeadline(p_node?: LeoNode, p_fromOutline?: boolean): void { }
    public insertNode(p_node?: LeoNode, p_fromOutline?: boolean, p_interrupt?: boolean): void { }
    public changeMark(p_mark: boolean, p_node?: LeoNode, p_fromOutline?: boolean): void { }


    public selectTreeNode(p_node: LeoNode, p_internalCall?: boolean, p_aside?: boolean): void { }
    public showLogPane(): void { }

    /**
     * * Show the outline, with Leo's selected node also selected, and optionally focussed
     * @param p_focusOutline Flag for focus to be placed in outline
     */
    public showOutline(p_focusOutline?: boolean): void {
        if (this.lastSelectedNode) {
            this._lastTreeView.reveal(this.lastSelectedNode, {
                select: true,
                focus: p_focusOutline
            });
        }
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
            return Promise.resolve(undefined);
        }
    }

    /**
     * Test/Dummy command
     * @returns Thenable from the tested functionality
     */
    public test(): Thenable<unknown> {
        console.log("Test called!");
        return Promise.resolve(true);
    }
}
