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
        console.log('context.extensionUri', p_context.extensionUri.fsPath, p_context.extensionUri.scheme, p_context.extensionUri.toJSON(),);
    }
    console.log('g.osBrowser', g.isBrowser);


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

    p_context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((p_event => setScheme(p_event, p_context)))
    );

    if (!g.isBrowser) {
        // Running as NodeJs Extension: Dont wait for workspace being opened
        console.log('VSCODE regular nodejs startup');
        g.app.vscodeUriScheme = 'file';
        runLeo(p_context);
    } else {
        // IS WEB EXTENSION IN BROWSER! 
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
            g.app.vscodeUriScheme = vscode.workspace.workspaceFolders[0].uri.scheme;
            console.log('Web browser already had workspace Scheme: ' + g.app.vscodeUriScheme);
            runLeo(p_context);
        } else {
            console.log('NOT started because no workspace yet');

            // should detect workspace opening below with onDidChangeWorkspaceFolders + setScheme
        }

    }

}

function setScheme(p_event: vscode.WorkspaceFoldersChangeEvent, p_context: vscode.ExtensionContext) {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
        console.log('WORKSPACE CHANGE DETECTED! length ' + vscode.workspace.workspaceFolders.length);
        g.app.vscodeUriScheme = vscode.workspace.workspaceFolders[0].uri.scheme;

        // not started yet? 
        if (!g.app.loadManager && g.isBrowser) {
            // START UP!
            console.log('Web browser leojs first startup! Scheme: ' + g.app.vscodeUriScheme);
            runLeo(p_context);
        }
    } else {
        console.log('WORKSPACE CHANGE DETECTED! but no workspace');

    }

}

function runLeo(p_context: vscode.ExtensionContext) {
    const w_start = process.hrtime(); // For calculating total startup time duration

    // Initialize and run Leo
    console.assert(g.app);

    g.app.loadManager = new LoadManager(p_context);
    g.app.loadManager.load().then(() => {
        console.log(`leojs startup launched in ${utils.getDurationMs(w_start)} ms`);
        console.log('Workspace folders: ', vscode.workspace.workspaceFolders);

    });
}

// this method is called when your extension is deactivated
export function deactivate() { }


