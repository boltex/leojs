import * as vscode from 'vscode';
import { Constants } from './constants';
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { LeoApp } from './core/leoApp';
import { LoadManager } from "./core/leoApp";
process.hrtime = require('browser-process-hrtime'); // Overwrite 'hrtime' of process

/**
 * Entry point for Leo in Javascript.
 */
export function activate(p_context: vscode.ExtensionContext) {

    if (p_context.extensionUri) {
        console.log('context.extensionUri', p_context.extensionUri, p_context.extensionUri.toJSON(),);
    }
    console.log('g.osBrowser 1', g.isBrowser);
    console.log('workspace folders 1: ', vscode.workspace.workspaceFolders);



    const w_start = process.hrtime(); // For calculating total startup time duration

    // * Close remaining leojs Bodies restored by vscode from last session.
    // TODO : USE TABGROUPS
    // vscode.window.visibleTextEditors.forEach(p_textEditor => {
    //     if (p_textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
    //         if (p_textEditor.hide) {
    //             p_textEditor.hide();
    //         }
    //     }
    // });

    if (!g.app) {
        (g.app as LeoApp) = new LeoApp();
    } else {
        vscode.window.showWarningMessage("g.app leojs application instance already exists!");
    }

    // Initialize and run Leo
    console.assert(g.app);
    g.app.loadManager = new LoadManager(p_context);
    g.app.loadManager.load().then(() => {
        console.log(`leojs startup launched in ${utils.getDurationMs(w_start)} ms`);
        console.log('g.osBrowser 2', g.isBrowser);

        console.log('workspace folders 2: ', vscode.workspace.workspaceFolders);

    });

}

// this method is called when your extension is deactivated
export function deactivate() { }


