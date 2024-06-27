import * as vscode from 'vscode';
import initSqlJs from '../sqlite/sql-wasm-debug';

import * as GitAPI from './git';
import * as GitBaseAPI from './git-base';

import { Constants } from './constants';
import * as path from 'path';
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { LeoApp, LoadManager } from './core/leoApp';
import { RemoteHubApi } from './remote-hub';
import { SqlJsStatic } from 'sql.js';
process.hrtime = require('browser-process-hrtime'); // Overwrite 'hrtime' of process

/**
 * Entry point for Leo in Javascript. 
 * @returns Leo’s leo.core.leoGlobals containing many useful functions, including g.es.
 */
export async function activate(p_context: vscode.ExtensionContext): Promise<typeof g> {

    /*
        * Original Leo startup *

        g.app = leoApp.LeoApp()
        g.app.loadManager = leoApp.LoadManager()
        g.app.loadManager.load(fileName, pymacs)
    */

    (g.extensionContext as vscode.ExtensionContext) = p_context; // Useful for accessing workspace storage or other utilities.
    (g.extensionUri as vscode.Uri) = p_context.extensionUri; // Useful for accessing files in extension package itself.

    const w_leojsExtension = vscode.extensions.getExtension(Constants.PUBLISHER + '.' + Constants.NAME)!;
    const w_leojsVersion = w_leojsExtension.packageJSON.version;
    const w_previousVersion = p_context.globalState.get<string>(Constants.VERSION_STATE_KEY);

    // * Close remaining Leo Bodies and help panels restored by vscode from last session.
    await utils.closeLeoTextEditors();
    await utils.closeLeoHelpPanels();

    // * Show a welcome screen on version updates, then start the actual extension.
    void showWelcomeIfNewer(w_leojsVersion, w_previousVersion)
        .then(() => {
            void p_context.globalState.update(Constants.VERSION_STATE_KEY, w_leojsVersion);
        });

    if (!g.app) {
        (g.app as LeoApp) = new LeoApp();

        const gitExtension = vscode.extensions.getExtension<GitAPI.GitExtension>('vscode.git');
        if (gitExtension) {
            await gitExtension.activate();
            try {
                (g.gitAPI as GitAPI.API) = gitExtension.exports.getAPI(1);
            } catch (e) {
                console.log("LEOJS ERROR : GIT EXTENSION NOT INSTALLED !");
            }
        } else {
            // console.log("LEOJS ERROR : GIT EXTENSION NOT AVAILABLE !");
        }

        const gitBaseExtension = vscode.extensions.getExtension<GitBaseAPI.GitBaseExtension>('vscode.git-base');
        if (gitBaseExtension) {
            await gitBaseExtension.activate();
            try {
                (g.gitBaseAPI as GitBaseAPI.API) = gitBaseExtension.exports.getAPI(1);
              } catch (e) {
                console.log("LEOJS ERROR : GIT_BASE EXTENSION NOT INSTALLED !");
            }
        } else {
            // console.log("LEOJS ERROR : GIT_BASE EXTENSION NOT AVAILABLE !");
        }

        const extension = vscode.extensions.getExtension<RemoteHubApi>('ms-vscode.remote-repositories')
            ?? vscode.extensions.getExtension<RemoteHubApi>('GitHub.remoteHub')
            ?? vscode.extensions.getExtension<RemoteHubApi>('GitHub.remoteHub-insiders');

        if (extension == null) {
            // console.log("LEOJS ERROR : GIT_REMOTE EXTENSION NOT AVAILABLE !");
        }
        if (extension) {
            const api = extension.isActive ? extension.exports : await extension.activate();
            (g.remoteHubAPI as RemoteHubApi) = api;
        }

        // console.log('SQL start');
        const sqliteBits = await vscode.workspace.fs.readFile(
            vscode.Uri.joinPath(p_context.extensionUri, 'sqlite', 'sql-wasm-debug.wasm')
        );

        (g.SQL as SqlJsStatic) = await initSqlJs(undefined, sqliteBits);;

    } else {
        void vscode.window.showWarningMessage("g.app leojs application instance already exists!");
    }

    p_context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((p_event => setScheme(p_event, p_context)))
    );

    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
        (g.workspaceUri as vscode.Uri) = vscode.workspace.workspaceFolders[0].uri;
    }

    if (!g.isBrowser) {
        await runLeo(p_context);
    } else {
        // Web Browser Extension: Check for type of workspace opened first
        if (g.workspaceUri) {

            if (!vscode.workspace.fs.isWritableFileSystem(g.workspaceUri.scheme)) {
                // NOTE : ! THIS RETURNS FALSE POSITIVES ! 
                console.log('NOT WRITABLE WORKSPACE: FALSE POSITIVE?');
            }

            // Check if not file scheme : only virtual workspaces are suported if g.isBrowser is true.
            if (g.workspaceUri.scheme !== 'file') {
                await runLeo(p_context);
            } else {
                // Is local filesystem
                void vscode.window.showInformationMessage(
                    "LeoJS in browser supports remote virtual filesystems: Local Filesystem requires desktop VSCode application: ", 
                    "More Info"
                ).then(selection => {
                    if (selection === "More Info") {
                        vscode.env.openExternal(
                            vscode.Uri.parse('https://code.visualstudio.com/docs/editor/vscode-web#_opening-a-project')
                        ).then(() => { }, (e) => {
                            console.error('LEOJS: Could not open external vscode help URL in browser.', e);
                        });
                    }
                });
                console.log('NOT started because no remote workspace yet');
                void setStartupDoneContext(true);
                return g;
            }
        } else {
            console.log('NOT started because no remote workspace yet');
            void setStartupDoneContext(true);
        }

    }
    return g;
}

function setStartupDoneContext(p_value: boolean): Thenable<unknown> {
    return vscode.commands.executeCommand(Constants.VSCODE_COMMANDS.SET_CONTEXT, Constants.CONTEXT_FLAGS.LEO_STARTUP_DONE, p_value);
}

function setScheme(p_event: vscode.WorkspaceFoldersChangeEvent, p_context: vscode.ExtensionContext) {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {

        (g.workspaceUri as vscode.Uri) = vscode.workspace.workspaceFolders[0].uri;

        console.log('WORKSPACE CHANGE DETECTED! length ' + vscode.workspace.workspaceFolders.length);
        console.log('is Writable Filesystem: ', vscode.workspace.fs.isWritableFileSystem(g.workspaceUri.scheme));

        // not started yet? 
        if (!g.app.loadManager && g.isBrowser) {
            // Check if not file scheme : only virtual workspaces are suported if g.isBrowser is true.
            if (g.workspaceUri.scheme !== 'file') {
                void runLeo(p_context);
            } else {
                // Is local filesystem
                void vscode.window.showInformationMessage("LeoJS in browser supports remote virtual filesystems: Local Filesystem requires desktop VSCode application: ", "More Info").then(selection => {
                    if (selection === "More Info") {
                        vscode.env.openExternal(
                            vscode.Uri.parse('https://code.visualstudio.com/docs/editor/vscode-web#_opening-a-project')
                        ).then(() => { }, (e) => {
                            console.error('LEOJS: Could not open external vscode help URL in browser.', e);
                        });
                    }
                });
                console.log('NOT started because no remote workspace yet');
                void setStartupDoneContext(true);
                return;
            }
        }
    } else {
        console.log('TODO : HANDLE WORKSPACE CHANGE DETECTED! but no workspace');
        void setStartupDoneContext(true);
    }
}

async function runLeo(p_context: vscode.ExtensionContext) {
    const w_start = process.hrtime(); // For calculating total startup time duration
    g.app.loadManager = new LoadManager(p_context);
    await g.app.loadManager.load();
    console.log(`leojs startup launched in ${utils.getDurationMs(w_start)} ms`);
}

// this method is called when your extension is deactivated
export async function deactivate(): Promise<unknown> {
    if (g.app) {
        for (const c of g.app.commanders()) {
            if (c.exists) {
                await g.app.closeLeoWindow(c.frame, undefined, true);
            }
        }
        // sys.exit(0)
        console.log('leojs extension has been deactivated.');
        return undefined;
    } else {
        console.log('no g.app');
    }
}

/**
 * * Show welcome screen if needed, based on last version executed
 * @param p_version Current version, as a string, from packageJSON.version
 * @param p_previousVersion Previous version, as a string, from context.globalState.get service
 * @returns A promise that triggers when command to show the welcome screen is finished, or immediately if not needed
 */
function showWelcomeIfNewer(p_version: string, p_previousVersion: string | undefined): Thenable<unknown> {
    let w_showWelcomeScreen: boolean = false;
    if (p_previousVersion === undefined) {
        console.log('leojs first-time install');
        w_showWelcomeScreen = true;
    } else {
        if (p_previousVersion !== p_version) {
            void vscode.window.showInformationMessage(`leojs upgraded from v${p_previousVersion} to v${p_version}`);
        }
        const [w_major, w_minor] = p_version.split('.').map(p_stringVal => parseInt(p_stringVal, 10));
        const [w_prevMajor, w_prevMinor] = p_previousVersion.split('.').map(p_stringVal => parseInt(p_stringVal, 10));
        if (
            (w_major === w_prevMajor && w_minor === w_prevMinor) ||
            // Don't notify on downgrades
            (w_major < w_prevMajor || (w_major === w_prevMajor && w_minor < w_prevMinor))
        ) {
            w_showWelcomeScreen = false;
        } else if (w_major !== w_prevMajor || (w_major === w_prevMajor && w_minor > w_prevMinor)) {
            // Will show on major or minor upgrade (Formatted as 'Major.Minor.Revision' eg. 1.2.3)
            w_showWelcomeScreen = true;
        }
    }
    if (w_showWelcomeScreen) {
        return vscode.commands.executeCommand(Constants.COMMANDS.SHOW_WELCOME);
    } else {
        return Promise.resolve();
    }
}

