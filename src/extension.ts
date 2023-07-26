import * as vscode from 'vscode';
import * as GitAPI from './git';
import * as GitBaseAPI from './git-base';

import { Constants } from './constants';
import * as path from 'path';
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { LeoApp } from './core/leoApp';
import { LoadManager } from "./core/leoApp";
import { RemoteHubApi } from './remote-hub';
process.hrtime = require('browser-process-hrtime'); // Overwrite 'hrtime' of process

/**
 * Entry point for Leo in Javascript.
 */
export async function activate(p_context: vscode.ExtensionContext) {

    if (p_context.extensionUri) {
        console.log('STARTUP: context.extensionUri: ', p_context.extensionUri.fsPath, p_context.extensionUri.scheme, p_context.extensionUri.toJSON(),);
    }

    console.log('STARTUP:          g.osBrowser: ', g.isBrowser);
    console.log('STARTUP:             path.sep: ', path.sep);
    console.log('STARTUP:           env scheme: ', vscode.env.uriScheme);
    console.log('STARTUP:          env appHost: ', vscode.env.appHost);
    console.log('STARTUP:          process.cwd(): ', process.cwd());

    const w_leojsExtension = vscode.extensions.getExtension(Constants.PUBLISHER + '.' + Constants.NAME)!;
    const w_leojsVersion = w_leojsExtension.packageJSON.version;

    const w_previousVersion = p_context.globalState.get<string>(Constants.VERSION_STATE_KEY);

    // * Close remaining Leo Bodies restored by vscode from last session.
    await closeLeoTextEditors();

    // * Show a welcome screen on version updates, then start the actual extension.
    void showWelcomeIfNewer(w_leojsVersion, w_previousVersion)
        .then(() => {
            void p_context.globalState.update(Constants.VERSION_STATE_KEY, w_leojsVersion);
        });

    if (!g.app) {
        (g.app as LeoApp) = new LeoApp();
        (g.app as LeoApp).vscodeExtensionDir = p_context.extensionUri.fsPath;

        const gitExtension = vscode.extensions.getExtension<GitAPI.GitExtension>('vscode.git');
        if (gitExtension) {
            await gitExtension.activate();
            try {
                (g.gitAPI as GitAPI.API) = gitExtension.exports.getAPI(1);
            } catch (e) {
                console.log("LEOJS ERROR : GIT EXTENSION NOT INSTALLED !");
            }
        } else {
            console.log("LEOJS ERROR : GIT EXTENSION NOT AVAILABLE !");
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
            console.log("LEOJS ERROR : GIT_BASE EXTENSION NOT AVAILABLE !");
        }

        const extension = vscode.extensions.getExtension<RemoteHubApi>('ms-vscode.remote-repositories')
            ?? vscode.extensions.getExtension<RemoteHubApi>('GitHub.remoteHub')
            ?? vscode.extensions.getExtension<RemoteHubApi>('GitHub.remoteHub-insiders');

        if (extension == null) {
            console.log("LEOJS ERROR : GIT_BASE EXTENSION NOT AVAILABLE !");
        }
        if (extension) {
            const api = extension.isActive ? extension.exports : await extension.activate();
            (g.remoteHubAPI as RemoteHubApi) = api;
        }

    } else {
        void vscode.window.showWarningMessage("g.app leojs application instance already exists!");
    }

    p_context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((p_event => setScheme(p_event, p_context)))
    );

    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
        g.app.vscodeWorkspaceUri = vscode.workspace.workspaceFolders[0].uri;
        g.app.vscodeUriScheme = vscode.workspace.workspaceFolders[0].uri.scheme;
        g.app.vscodeUriAuthority = vscode.workspace.workspaceFolders[0].uri.authority;
        g.app.vscodeUriPath = vscode.workspace.workspaceFolders[0].uri.path;
    }

    if (!g.isBrowser) {
        // Regular NodeJs Extension: Dont wait for workspace being opened
        if (!g.app.vscodeUriScheme) {
            // Only setting if undefined, because regular vscode can still work on remote github virtual filesystem
            g.app.vscodeUriScheme = 'file';
        }
        await runLeo(p_context);
    } else {
        // Web Browser Extension: CHeck for type of workspace opened first
        if (g.app.vscodeUriScheme) {

            if (!vscode.workspace.fs.isWritableFileSystem(g.app.vscodeUriScheme)) {
                void vscode.window.showInformationMessage("Non-writable filesystem scheme: " + g.app.vscodeUriScheme, "More Info")
                    .then(selection => {
                        if (selection === "More Info") {
                            vscode.env.openExternal(
                                vscode.Uri.parse('https://code.visualstudio.com/docs/editor/vscode-web#_current-limitations')
                            ).then(() => { }, (e) => {
                                console.error('LEOJS: Could not open external vscode help URL in browser.', e);
                            });
                        }
                    });
                console.log('NOT started because not writable workspace');
                void setStartupDoneContext(true);
                return;
            }

            // Check if not file scheme : only virtual workspaces are suported if g.isBrowser is true.
            if (g.app.vscodeUriScheme !== 'file') {

                console.log('STARTUP:           g.app.vscodeWorkspaceUri: ', g.app.vscodeWorkspaceUri);

                await runLeo(p_context);
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
        } else {
            console.log('NOT started because no remote workspace yet');
            void setStartupDoneContext(true);
        }

    }

}

function setStartupDoneContext(p_value: boolean): Thenable<unknown> {
    return vscode.commands.executeCommand(Constants.VSCODE_COMMANDS.SET_CONTEXT, Constants.CONTEXT_FLAGS.LEO_STARTUP_DONE, p_value);
}

function setScheme(p_event: vscode.WorkspaceFoldersChangeEvent, p_context: vscode.ExtensionContext) {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
        console.log('WORKSPACE CHANGE DETECTED! length ' + vscode.workspace.workspaceFolders.length);

        g.app.vscodeWorkspaceUri = vscode.workspace.workspaceFolders[0].uri;
        g.app.vscodeUriScheme = vscode.workspace.workspaceFolders[0].uri.scheme;
        g.app.vscodeUriAuthority = vscode.workspace.workspaceFolders[0].uri.authority;
        g.app.vscodeUriPath = vscode.workspace.workspaceFolders[0].uri.path;
        console.log('is Writable Filesystem: ', vscode.workspace.fs.isWritableFileSystem(g.app.vscodeUriScheme));

        console.log('WORKSPACE CHANGE DETECTED! workspace JSON: ' + JSON.stringify(g.app.vscodeWorkspaceUri.toJSON()));
        console.log('WORKSPACE CHANGE DETECTED! workspace toString: ' + g.app.vscodeWorkspaceUri.toString());

        // * Set new and unsaved document's c.openDirectory.
        //  g.app.windowList[this.frameIndex].c;
        for (const w_frame of g.app.windowList) {
            if (!w_frame.c.openDirectory) {
                // ! LEOJS : SET c.openDirectory to the g.app.vscodeWorkspaceUri !
                w_frame.c.openDirectory = g.app.vscodeWorkspaceUri?.fsPath;
                if (w_frame.c.openDirectory) {
                    w_frame.c.frame.openDirectory = w_frame.c.openDirectory;
                }
            }
        }

        // not started yet? 
        if (!g.app.loadManager && g.isBrowser) {
            // Check if not file scheme : only virtual workspaces are suported if g.isBrowser is true.
            if (g.app.vscodeUriScheme !== 'file') {

                console.log('STARTUP:           g.app.vscodeWorkspaceUri: ', g.app.vscodeWorkspaceUri);

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

    // Initialize and run Leo
    console.assert(g.app);

    g.app.loadManager = new LoadManager(p_context);
    await g.app.loadManager.load();
    console.log(`leojs startup launched in ${utils.getDurationMs(w_start)} ms`);

}

// this method is called when your extension is deactivated
export function deactivate() { }

/**
 * * Closes all visible text editors that have Leo filesystem scheme (that are not dirty)
 */
async function closeLeoTextEditors(): Promise<unknown> {
    const w_foundTabs: vscode.Tab[] = [];

    vscode.window.tabGroups.all.forEach((p_tabGroup) => {
        p_tabGroup.tabs.forEach((p_tab) => {
            if (p_tab.input &&
                (p_tab.input as vscode.TabInputText).uri &&
                (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEO_SCHEME &&
                !p_tab.isDirty
            ) {
                w_foundTabs.push(p_tab);
            }
        });
    });

    let q_closedTabs;
    if (w_foundTabs.length) {
        q_closedTabs = vscode.window.tabGroups.close(w_foundTabs, true);
        for (const p_tab of w_foundTabs) {
            if (p_tab.input) {
                await vscode.commands.executeCommand(
                    'vscode.removeFromRecentlyOpened',
                    (p_tab.input as vscode.TabInputText).uri
                );
                // Delete to close all other body tabs.
                // (w_oldUri will be deleted last below)
                const w_edit = new vscode.WorkspaceEdit();
                w_edit.deleteFile((p_tab.input as vscode.TabInputText).uri, { ignoreIfNotExists: true });
                await vscode.workspace.applyEdit(w_edit);
            }
        }
    } else {
        q_closedTabs = Promise.resolve(true);
    }
    return q_closedTabs;
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

