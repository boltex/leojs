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
import { LeoButtonNode } from "./leoButtonNode";
/**
 * Implements https://github.com/leo-editor/leo-editor/issues/1025
 */
export class LeoJs {

    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.

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

    constructor(private _context: vscode.ExtensionContext) {
        // * Create Leo stand-alone view and Explorer view outline panes
        // Uses 'select node' command, so 'onDidChangeSelection' is not used
        this._leoTreeView = vscode.window.createTreeView(Constants.TREEVIEW_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._leoTreeView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeView)));
        this._leoTreeView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeView)));
        this._leoTreeView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, false))); // * Trigger 'show tree in Leo's view'
        this._leoTreeExView = vscode.window.createTreeView(Constants.TREEVIEW_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
        this._leoTreeExView.onDidExpandElement((p_event => this._onChangeCollapsedState(p_event, true, this._leoTreeExView)));
        this._leoTreeExView.onDidCollapseElement((p_event => this._onChangeCollapsedState(p_event, false, this._leoTreeExView)));
        this._leoTreeExView.onDidChangeVisibility((p_event => this._onTreeViewVisibilityChanged(p_event, true))); // * Trigger 'show tree in explorer view'
        this._lastTreeView = this.config.treeInExplorer ? this._leoTreeExView : this._leoTreeView;
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
