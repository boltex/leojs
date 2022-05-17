import * as vscode from "vscode";
import { LeoUI } from './leoUI';
import { LeoStates } from "./leoStates";
import { Constants } from "./constants";
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";
import { LeoFrame } from "./core/leoFrame";

/**
 * Opened Leo documents shown as a list with this TreeDataProvider implementation
 */
export class LeoDocumentsProvider implements vscode.TreeDataProvider<LeoFrame> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoFrame | undefined> = new vscode.EventEmitter<LeoFrame | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoFrame | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _leoUI: LeoUI,
    ) { }

    /**
     * Refresh the whole Leo Document panel
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoFrame): Thenable<LeoDocumentNode> | LeoDocumentNode {
        return new LeoDocumentNode(element, this._leoUI,);
    }

    public getChildren(element?: LeoFrame): LeoFrame[] {
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoStates.fileOpenedReady && !element) {
            return g.app.windowList;
        } else {
            return []; // Should not happen!
        }
    }

    public getParent(element: LeoFrame): vscode.ProviderResult<LeoFrame> {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return undefined;
    }

}

/**
 * * Opened Leo documents tree view node item implementation for usage in a TreeDataProvider
 */
export class LeoDocumentNode extends vscode.TreeItem {

    constructor(
        public frame: LeoFrame,
        private _leoUI: LeoUI,
    ) {
        super(frame.c.fileName() ? utils.getFileFromPath(frame.c.fileName()) : frame.title);

        const c: Commands = frame.c;
        const isNamed: boolean = !!c.fileName();
        this.label = isNamed ? utils.getFileFromPath(c.fileName()) : frame.title;
        this.tooltip = isNamed ? c.fileName() : frame.title;
        this.command = {
            command: Constants.COMMANDS.SET_OPENED_FILE,
            title: '',
            arguments: [g.app.windowList.indexOf(frame)]
        };

        if (frame === g.app.windowList[this._leoUI.frameIndex]) {
            // If this was created as a selected node, make sure it's selected
            this._leoUI.setDocumentSelection(frame);
            this.contextValue = isNamed ? Constants.CONTEXT_FLAGS.DOCUMENT_SELECTED_TITLED : Constants.CONTEXT_FLAGS.DOCUMENT_SELECTED_UNTITLED;
        } else {
            this.contextValue = isNamed ? Constants.CONTEXT_FLAGS.DOCUMENT_TITLED : Constants.CONTEXT_FLAGS.DOCUMENT_UNTITLED;
        }

        this.id = `d${g.app.windowList.indexOf(frame)}f${c.fileName()}c${c.changed.toString()}`;
        this.iconPath = this._leoUI.documentIcons[c.changed ? 1 : 0];
    }

}
