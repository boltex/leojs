import * as vscode from 'vscode';
import * as utils from "./utils";
import { ReqRefresh } from "./types";
import * as g from './core/leoGlobals';
import { LeoApp } from './core/leoApp';
import { LoadManager } from "./core/leoApp";
import { LeoUI } from './leoUI';
import { Constants } from './constants';
import { LeoButtonNode } from './leoButtons';
import { LeoOutlineNode } from './leoOutline';
import { Position } from './core/leoNodes';
process.hrtime = require('browser-process-hrtime');

export function activate(p_context: vscode.ExtensionContext) {

    const w_start = process.hrtime(); // For calculating total startup time duration

    if (!g.app) {
        (g.app as LeoApp) = new LeoApp();
    } else {
        vscode.window.showWarningMessage("g.app leojs application instance already exists!");
    }

    g.app.loadManager = new LoadManager();


    // * Log time taken for startup
    console.log('leojs startup launched in ', utils.getDurationMs(w_start), 'ms');


}

// this method is called when your extension is deactivated
export function deactivate() { }


