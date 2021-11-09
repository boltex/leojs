import * as vscode from "vscode";
import { Constants } from "./constants";
import { Icon } from "./types";
import * as utils from "./utils";
import { LeoUI } from "./leoUI";
import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";

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
