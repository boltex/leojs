import * as vscode from 'vscode';
import { Constants } from './constants';
import { LeoUI } from './leoUI';
import * as utils from './utils';

/**
 * Leo Find Panel provider
 */
export class LeoFindPanelProvider implements vscode.WebviewViewProvider {

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private _context: vscode.ExtensionContext,
        private _leoUI: LeoUI
    ) { }

    public async resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): Promise<void> {

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        this._context.subscriptions.push(
            webviewView.webview.onDidReceiveMessage((data) => {
                switch (data.type) {
                    case 'leoNavEnter': {
                        void this._leoUI.navEnter();
                        break;
                    }
                    case 'leoNavTextChange': {
                        void this._leoUI.navTextChange();
                        break;
                    }
                    case 'leoNavClear': {
                        void this._leoUI.navTextClear();
                        break;
                    }
                    case 'leoNavMarkedList': {
                        void this._leoUI.findQuickMarked(true);
                        break;
                    }
                    case 'gotFocus': {
                        void this._leoUI.triggerBodySave(true);
                        void utils.setContext(Constants.CONTEXT_FLAGS.FOCUS_FIND, true);
                        break;
                    }
                    case 'lostFocus': {
                        void utils.setContext(Constants.CONTEXT_FLAGS.FOCUS_FIND, false);
                        break;
                    }
                    case 'leoFindNext': {
                        void vscode.commands.executeCommand(Constants.COMMANDS.FIND_NEXT_FO);
                        break;
                    }
                    case 'leoFindPrevious': {
                        void vscode.commands.executeCommand(Constants.COMMANDS.FIND_PREVIOUS_FO);
                        break;
                    }
                    case 'searchConfig': {
                        void this._leoUI.saveSearchSettings(data.value);
                        break;
                    }
                    case 'replace': {
                        void this._leoUI.replace(true, false);
                        break;
                    }
                    case 'replaceThenFind': {
                        void this._leoUI.replace(true, true);
                        break;
                    }
                    case 'navigateNavEntry': {
                        void this._leoUI.navigateNavEntry(data.value);
                    }
                    case 'refreshSearchConfig': {
                        void this._leoUI.triggerBodySave(true);
                        // Leave a cycle before getting settings
                        setTimeout(() => {
                            this._leoUI.loadSearchSettings();
                        }, 0);
                        break;
                    }
                    case 'gotoCommand': {
                        try {
                            const w_index = Number(data.value);
                            if (!isNaN(w_index) && this._leoUI.leoGotoProvider.nodeList[w_index]) {
                            }
                            void this._leoUI.gotoNavEntry(this._leoUI.leoGotoProvider.nodeList[w_index]);
                        } catch (e) {
                            console.log('goto nav entry failed for index: ', data.value);
                        }
                        break;
                    }
                }
            })
        );
        webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);
        this._leoUI.setFindPanel(webviewView);
    }

    private async _getHtmlForWebview(webview: vscode.Webview): Promise<string> {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'find-panel', 'main.js')
        );
        // Do the same for the stylesheet.
        const style = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'find-panel', 'style.css')
        );
        // Use a nonce to only allow a specific script to be run.
        const nonce = utils.getNonce();

        const baseHtml = await this._getBaseHtml();

        return baseHtml.replace(
            /#{nonce}/g,
            nonce
        )
            .replace(
                /#{style}/g,
                `${style}`
            )
            .replace(
                /#{webview.cspSource}/g,
                webview.cspSource
            )
            .replace(
                /#{scriptUri}/g,
                `${scriptUri}`
            );
    }

    private async _getBaseHtml(): Promise<string> {
        // 'Normal' uri, not a 'webview.asWebviewUri(...)' !
        const w_fileUri = vscode.Uri.joinPath(this._extensionUri, 'find-panel', 'index.html');
        const w_doc = await vscode.workspace.openTextDocument(w_fileUri);
        return w_doc.getText();
    }

}
