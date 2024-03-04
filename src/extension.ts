import * as vscode from 'vscode';
import initSqlJs from '../sqlite/sql-wasm-debug';
import * as JSZip from 'jszip';
import * as pako from 'pako';

import * as GitAPI from './git';
import * as GitBaseAPI from './git-base';

import { Constants } from './constants';
import * as path from 'path';
import * as utils from "./utils";
import * as g from './core/leoGlobals';
import { LeoApp, LoadManager } from './core/leoApp';
import { RemoteHubApi } from './remote-hub';
import { Database, SqlJsStatic } from 'sql.js';
process.hrtime = require('browser-process-hrtime'); // Overwrite 'hrtime' of process

const activateDebug = false;

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
    void vscode.commands.executeCommand(Constants.VSCODE_COMMANDS.SET_CONTEXT, Constants.CONTEXT_FLAGS.LEO_ID_READY, true);

    (g.extensionContext as vscode.ExtensionContext) = p_context; // Useful for accessing workspace storage or other utilities.
    (g.extensionUri as vscode.Uri) = p_context.extensionUri; // Useful for accessing files in extension package itself.

    if (p_context.extensionUri && activateDebug) {
        console.log('STARTUP: context.extensionUri.fsPath: ', p_context.extensionUri.fsPath);
        console.log('STARTUP: context.extensionUri.scheme: ', p_context.extensionUri.scheme,);
    }

    if (activateDebug) {
        console.log('STARTUP:                 g.osBrowser: ', g.isBrowser);
        console.log('STARTUP:                    path.sep: ', path.sep);
        console.log('STARTUP:                  env scheme: ', vscode.env.uriScheme);
        console.log('STARTUP:                 env appHost: ', vscode.env.appHost);
        console.log('STARTUP:               process.cwd(): ', process.cwd());
    }

    const w_leojsExtension = vscode.extensions.getExtension(Constants.PUBLISHER + '.' + Constants.NAME)!;
    const w_leojsVersion = w_leojsExtension.packageJSON.version;

    const w_previousVersion = p_context.globalState.get<string>(Constants.VERSION_STATE_KEY);
    let SQL: SqlJsStatic;

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
                if (activateDebug) {
                    console.log("STARTUP:          GIT extension installed as g.gitAPI");
                }
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

                if (activateDebug) {
                    console.log("STARTUP:          GIT_BASE extension installed as g.gitBaseAPI");
                }

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

            if (activateDebug) {
                console.log("STARTUP:          GIT_REMOTE_HUB extension installed as g.remoteHubAPI");
            }
        }

        // Test paco
        // console.log('paco start test:  ');
        // const test = { my: 'super', puper: [456, 567], awesome: 'pako' };
        // const compressed = pako.deflate(JSON.stringify(test));
        // const restored = JSON.parse(pako.inflate(compressed, { to: 'string' }));
        // console.log('paco restored test:  ', restored);


        // console.log('SQL start');
        const sqliteBits = await vscode.workspace.fs.readFile(
            vscode.Uri.joinPath(p_context.extensionUri, 'sqlite', 'sql-wasm-debug.wasm')
        );
        // console.log('got sql-wasm-debug.wasm', sqliteBits.length);

        SQL = await initSqlJs(undefined, sqliteBits);

        if (activateDebug) {
            console.log("STARTUP:          SQLITE has started");
        }

        (g.SQL as SqlJsStatic) = SQL;


    } else {
        void vscode.window.showWarningMessage("g.app leojs application instance already exists!");
    }

    p_context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((p_event => setScheme(p_event, p_context)))
    );

    async function dbTests() {

        // Start SQLITE engine
        // const filebuffer = await vscode.workspace.fs.readFile(
        //     vscode.Uri.joinPath(p_context.extensionUri, 'test1.db')
        // );

        const filebuffer = await vscode.workspace.fs.readFile(
            g.makeVscodeUri(path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, "test2.db"))
            // vscode.Uri.joinPath(p_context.extensionUri, 'test1.db')
        );
        console.log('got db file!!  Length in bytes: ', filebuffer.length);

        // Load the db.
        const db: Database = new SQL.Database(filebuffer);
        console.log('db', db);

        // Test executing query on db.
        const q_result1 = db.exec("SELECT `name`, `sql`  FROM `sqlite_master`  WHERE type='table';");
        // exec returns an  QueryExecResult {
        //					columns: string[];
        //					values: SqlValue[][];
        // 				}
        console.log('result', q_result1);

        const w_date = new Date();
        const w_dateStringKey = "d_" + w_date.getTime().toString();
        const w_dateStringVal = w_date.toLocaleDateString() + " " + w_date.toLocaleTimeString();

        const w_insertQuery = `INSERT OR IGNORE INTO extra_infos (name, value) VALUES ('${w_dateStringKey}', '${w_dateStringVal}');`;
        console.log("w_insertQuery", w_insertQuery);

        const q_result2 = db.exec(w_insertQuery);
        console.log('result2', q_result2);

        const db_data = db.export();
        const db_buffer = Buffer.from(db_data);

        const db_fileName = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, "my_db_save.db");
        const db_uri = g.makeVscodeUri(db_fileName);
        await vscode.workspace.fs.writeFile(db_uri, db_buffer);

        console.log("buffer db to be written byte length :", db_buffer.length);
        const w_stats = await vscode.workspace.fs.stat(db_uri);
        console.log('DB written file size check : ', w_stats.size);
        console.log('Done with DB tests');

    }

    async function readZipTest() {
        console.log('Starting readZipTest');

        let fileName;

        fileName = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, "myziptest.zip");
        const w_uri = g.makeVscodeUri(fileName);
        let w_stats: vscode.FileStat;
        // const zip = new JSZip();
        try {
            w_stats = await vscode.workspace.fs.stat(w_uri);
        } catch {
            return false;
        }
        console.log('w_stats.size', w_stats.size);

        await vscode.workspace.fs.readFile(w_uri)
            .then(JSZip.loadAsync)                            // 3) chain with the zip promise
            .then(function (zip) {
                return zip.file("hello.txt")?.async("string"); // 4) chain with the text content promise
            })
            .then((read_str) => {
                console.log('read from zip hello.txt: ', read_str);
            });
        console.log('Done with readZipTest');

    }

    async function makeZipTest() {
        console.log('Starting makeZipTest');

        // Test JSZip
        const zip = new JSZip();

        // create a file
        zip.file("hello.txt", "Hello new world");

        // create a file and a folder
        zip.file("nested/hello.txt", "Hello World\ninside on other line!\n");
        // // same as
        // zip.folder("nested")!.file("hello.txt", "Hello World\n");

        let fileName;
        // if (g.isBrowser) {
        //     fileName = "/myziptest.zip";
        // } else {
        // }
        fileName = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, "myziptest2.zip");
        const w_ZIP_uri = g.makeVscodeUri(fileName);


        const zip_data = await zip.generateAsync({ type: "uint8array" });
        console.log('zip_data byte length: ', zip_data.byteLength);

        const zip_buffer = Buffer.from(zip_data);
        console.log('zip_buffer length: ', zip_buffer.length);

        await vscode.workspace.fs.writeFile(w_ZIP_uri, zip_buffer);
        // console.log('done with zip file test!');
        console.log("zip buffer length", zip_buffer.length);
        const w_stats = await vscode.workspace.fs.stat(w_ZIP_uri);
        console.log('ZIP w_stats.size', w_stats.size);
        console.log('Done with makeZipTest');

    }

    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
        (g.workspaceUri as vscode.Uri) = vscode.workspace.workspaceFolders[0].uri;

        // console.log('GOT WORKSPACE: starting file-system ZIP & DB tests');
        if (0) {
            await dbTests();
        }
        if (0) {
            await readZipTest();
        } else if (0) {
            await makeZipTest();
        }

    }

    if (!g.isBrowser) {
        await runLeo(p_context);
    } else {
        // Web Browser Extension: Check for type of workspace opened first
        if (g.workspaceUri) {

            if (!vscode.workspace.fs.isWritableFileSystem(g.workspaceUri.scheme)) {

                // NOTE : ! THIS RETURNS FALSE POSITIVES ! 
                console.log('NOT WRITABLE WORKSPACE: FALSE POSITIVE?');

                // void vscode.window.showInformationMessage("Non-writable filesystem scheme: " + g.app.vscodeUriScheme, "More Info")
                //     .then(selection => {
                //         if (selection === "More Info") {
                //             vscode.env.openExternal(
                //                 vscode.Uri.parse('https://code.visualstudio.com/docs/editor/vscode-web#_current-limitations')
                //             ).then(() => { }, (e) => {
                //                 console.error('LEOJS: Could not open external vscode help URL in browser.', e);
                //             });
                //         }
                //     });
                // console.log('NOT started because not writable workspace');
                // void setStartupDoneContext(true);
                // return;
            }

            // Check if not file scheme : only virtual workspaces are suported if g.isBrowser is true.
            if (g.workspaceUri.scheme !== 'file') {
                if (activateDebug) {
                    console.log('STARTUP:           g.app.vscodeWorkspaceUri: ', g.workspaceUri);
                }

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
        console.log('WORKSPACE CHANGE DETECTED! length ' + vscode.workspace.workspaceFolders.length);

        (g.workspaceUri as vscode.Uri) = vscode.workspace.workspaceFolders[0].uri;
        console.log('is Writable Filesystem: ', vscode.workspace.fs.isWritableFileSystem(g.workspaceUri.scheme));

        console.log('WORKSPACE CHANGE DETECTED! workspace JSON: ' + JSON.stringify(g.workspaceUri.toJSON()));
        console.log('WORKSPACE CHANGE DETECTED! workspace toString: ' + g.workspaceUri.toString());

        // * Set new and unsaved document's c.openDirectory.
        //  g.app.windowList[this.frameIndex].c;
        // for (const w_frame of g.app.windowList) {
        //     if (!w_frame.c.openDirectory) {
        //         // ! LEOJS : SET c.openDirectory to the g.app.vscodeWorkspaceUri !
        //         w_frame.c.openDirectory = g.app.vscodeWorkspaceUri?.fsPath;
        //         if (w_frame.c.openDirectory) {
        //             w_frame.c.frame.openDirectory = w_frame.c.openDirectory;
        //         }
        //     }
        // }

        // not started yet? 
        if (!g.app.loadManager && g.isBrowser) {
            // Check if not file scheme : only virtual workspaces are suported if g.isBrowser is true.
            if (g.workspaceUri.scheme !== 'file') {
                if (activateDebug) {
                    console.log('STARTUP:           g.app.vscodeWorkspaceUri: ', g.workspaceUri);
                }

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

