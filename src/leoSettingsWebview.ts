import * as vscode from "vscode";
import * as path from 'path';
import { LeoUI } from "./leoUI";
import * as utils from "./utils";

export class LeoSettingsProvider {

    private _panel: vscode.WebviewPanel | undefined;
    private _html: string | undefined;
    private _extensionUri: vscode.Uri;
    private _waitingForUpdate: boolean = false;

    constructor(
        private _context: vscode.ExtensionContext,
        private _leoUI: LeoUI
    ) {
        this._extensionUri = _context.extensionUri;
    }

    public changedConfiguration(p_event?: vscode.ConfigurationChangeEvent): void {
        if (this._panel && !this._waitingForUpdate) {
            this._panel.webview.postMessage({ command: 'newConfig', config: this._leoUI.config.getConfig() });
            this._panel.webview.postMessage({ command: 'newFontConfig', config: this._leoUI.config.getFontConfig() });
        }
    }

    public openWebview(): void {
        if (this._panel) {
            this._panel.reveal();
        } else {
            this._panel = vscode.window.createWebviewPanel(
                'leojsSettings', // Identifies the type of the webview. Used internally
                'LeoJS Settings', // Title of the panel displayed to the user
                { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false }, // Editor column to show the new webview panel in.
                {
                    retainContextWhenHidden: false,
                    enableFindWidget: true,
                    enableCommandUris: true,
                    enableScripts: true
                }
            );

            this._getBaseHtml(this._panel.webview).then(p_baseHtml => {
                if (this._panel) {

                    this._context.subscriptions.push(this._panel);

                    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
                    const scriptUri = this._panel.webview.asWebviewUri(
                        vscode.Uri.joinPath(this._extensionUri, 'settings-panel', 'main.js')
                    );
                    // Do the same for the stylesheet.
                    const style = this._panel.webview.asWebviewUri(
                        vscode.Uri.joinPath(this._extensionUri, 'settings-panel', 'style.css')
                    );

                    const w_baseUri = this._panel.webview.asWebviewUri(this._extensionUri);

                    this._panel.iconPath = vscode.Uri.joinPath(this._extensionUri, 'resources', 'leoapp128px.png')

                    // this._panel.iconPath = vscode.Uri.file(this._context.asAbsolutePath('resources/leoapp128px.png'));

                    // light: vscode.Uri.joinPath(p_context.extensionUri, Constants.GUI.ICON_LIGHT_DOCUMENT),

                    // this._panel.iconPath = this._panel.webview.asWebviewUri(
                    //     vscode.Uri.joinPath(this._extensionUri, 'resources', 'leoapp128px.png')
                    // );

                    const w_nonce = utils.getNonce();

                    this._panel.webview.html = p_baseHtml
                        .replace(
                            /#{nonce}/g,
                            w_nonce
                        )
                        .replace(
                            /#{style}/g,
                            `${style}`
                        )
                        .replace(
                            /#{webview.cspSource}/g,
                            this._panel.webview.cspSource
                        )
                        .replace(
                            /#{root}/g,
                            `${w_baseUri}`
                        ).replace(
                            /#{endOfBody}/g,
                            `<script type="text/javascript" nonce="${w_nonce}">window.leoConfig = ${JSON.stringify(
                                this._leoUI.config.getConfig()
                            )};window.fontConfig = ${JSON.stringify(
                                this._leoUI.config.getFontConfig()
                            )};</script>
                            <script nonce="${w_nonce}" src="${scriptUri}"></script>
                            `
                        );


                    this._panel.webview.onDidReceiveMessage(
                        message => {
                            switch (message.command) {
                                case 'alert':
                                    vscode.window.showErrorMessage(message.text);
                                    break;
                                case 'getNewConfig':
                                    if (this._panel && !this._waitingForUpdate) {
                                        this._panel.webview.postMessage(
                                            {
                                                command: 'newConfig',
                                                config: this._leoUI.config.getConfig()
                                            }
                                        );
                                    }
                                    break;
                                case 'config':
                                    this._waitingForUpdate = true;
                                    this._leoUI.config.setLeojsSettings(message.changes).then(() => {
                                        this._panel!.webview.postMessage(
                                            {
                                                command: 'vscodeConfig',
                                                config: this._leoUI.config.getConfig()
                                            }
                                        );
                                        this._waitingForUpdate = false;
                                    });
                                    break;
                                case 'getNewFontConfig':
                                    if (this._panel && !this._waitingForUpdate) {
                                        this._panel.webview.postMessage(
                                            {
                                                command: 'newFontConfig',
                                                config: this._leoUI.config.getFontConfig()
                                            }
                                        );
                                    }
                                    break;
                                case 'fontConfig':
                                    this._leoUI.config.setFontConfig(message.changes);
                                    break;
                            }
                        },
                        null,
                        this._context.subscriptions
                    );
                    this._panel.onDidDispose(
                        () => { this._panel = undefined; },
                        null,
                        this._context.subscriptions
                    );
                }
            });
        }
    }

    private async _getBaseHtml(webview: vscode.Webview): Promise<string> {
        if (this._html !== undefined) {
            return this._html;
        } else {

            // 'Normal' uri, not a 'webview.asWebviewUri(...)' !
            const w_fileUri = vscode.Uri.joinPath(this._extensionUri, 'settings-panel', 'index.html');

            const w_doc = await vscode.workspace.openTextDocument(w_fileUri);

            this._html = w_doc.getText();

            return this._html;
        }
    }
}
