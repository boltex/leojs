import * as vscode from "vscode";
import { LeoUI } from './leoUI';
import { LeoStates } from "./leoStates";
import { Constants } from "./constants";
import { Icon } from "./types";
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";

/**
 * * Opened Leo documents shown as a list with this TreeDataProvider implementation
 */
export class LeoDocumentsProvider implements vscode.TreeDataProvider<LeoDocumentNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoDocumentNode | undefined> = new vscode.EventEmitter<LeoDocumentNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoDocumentNode | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _leoUI: LeoUI,
    ) { }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoDocumentNode): Thenable<LeoDocumentNode> | LeoDocumentNode {
        return element;
    }

    public getChildren(element?: LeoDocumentNode): LeoDocumentNode[] {
        const w_children: LeoDocumentNode[] = [];
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoStates.fileOpenedReady && !element) {
            g.app.commandersList.forEach(p_doc => {
                w_children.push(new LeoDocumentNode(p_doc, this._leoUI));
            });
        }
        return w_children; // Defaults to an empty list of children
    }

    public getParent(element: LeoDocumentNode): vscode.ProviderResult<LeoDocumentNode> {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return undefined;
    }

}

/**
 * * Opened Leo documents tree view node item implementation for usage in a TreeDataProvider
 */
export class LeoDocumentNode extends vscode.TreeItem {

    // Context string is checked in package.json with 'when' clauses
    public contextValue: string;

    constructor(
        public documentEntry: Commands,
        private _leoJs: LeoUI
    ) {
        super(documentEntry.fileName());
        // Setup this instance
        const w_isNamed: boolean = !!this.documentEntry.fileName();
        this.label = w_isNamed ? utils.getFileFromPath(this.documentEntry.fileName()) : Constants.UNTITLED_FILE_NAME;
        this.tooltip = w_isNamed ? this.documentEntry.fileName() : Constants.UNTITLED_FILE_NAME;
        this.command = {
            command: Constants.COMMANDS.SET_OPENED_FILE,
            title: '',
            arguments: [g.app.commandersList.indexOf(this.documentEntry)]
        };
        // If this was created as a selected node, make sure it's selected as we may have opened/closed document
        // tslint:disable-next-line: strict-comparisons

        if (this.documentEntry === g.app.commandersList[this._leoJs.commanderIndex]) {
            this._leoJs.setDocumentSelection(this);
            this.contextValue = w_isNamed ? Constants.CONTEXT_FLAGS.DOCUMENT_SELECTED_TITLED : Constants.CONTEXT_FLAGS.DOCUMENT_SELECTED_UNTITLED;
        } else {
            this.contextValue = w_isNamed ? Constants.CONTEXT_FLAGS.DOCUMENT_TITLED : Constants.CONTEXT_FLAGS.DOCUMENT_UNTITLED;
        }
    }

    // @ts-ignore
    public get iconPath(): Icon {
        return this._leoJs.documentIcons[this.documentEntry.changed ? 1 : 0];
    }

    // @ts-ignore
    public get id(): string {
        // Add prefix and suffix salt to numeric index to prevent accidental duplicates
        return "p" + g.app.commandersList.indexOf(this.documentEntry) + "s" + this.documentEntry.fileName();
    }

}


