import * as vscode from 'vscode';
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { LeoApp } from './core/leoApp';
import { LoadManager } from "./core/leoApp";
process.hrtime = require('browser-process-hrtime'); // Overwrite 'hrtime' of process

/**
 * Entry point for Leo in Javascript.
 */
export function activate(p_context: vscode.ExtensionContext) {

    const w_start = process.hrtime(); // For calculating total startup time duration

    if (!g.app) {
        (g.app as LeoApp) = new LeoApp();
    } else {
        vscode.window.showWarningMessage("g.app leojs application instance already exists!");
    }

    // Initialize and run Leo
    console.assert(g.app);
    g.app.loadManager = new LoadManager(p_context);
    g.app.loadManager.load();

    console.log(`leojs startup launched in ${utils.getDurationMs(w_start)} ms`);

}

// this method is called when your extension is deactivated
export function deactivate() { }


