import * as vscode from 'vscode';
import { LeoUI } from './leoUI';

export class HelpPanel implements vscode.TextDocumentContentProvider {

    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    constructor(private _ui: LeoUI) { }

    provideTextDocumentContent(p_uri: vscode.Uri): string {
        return this._ui.helpPanelText;
    }

    // Call this method to signal that the content has changed
    public update(uri: vscode.Uri) {
        this.onDidChangeEmitter.fire(uri);
    }

}

