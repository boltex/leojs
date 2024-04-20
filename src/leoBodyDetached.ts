import * as vscode from "vscode";
import * as utils from "./utils";
import { Constants } from "./constants";
import * as path from 'path';
import { BodyTimeInfo } from "./types";
import { LeoUI } from "./leoUI";
import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";
import { VNode } from "./core/leoNodes";

/**
 * * Body panes implementation as a file system using "leojs" as a scheme identifier
 */
export class LeoBodyDetachedProvider implements vscode.FileSystemProvider {

    // * Flag normally false
    public preventSaveToLeo: boolean = false;
    private _errorRefreshFlag: boolean = false;

    // * Last file read data with the readFile method
    private _lastGnx: string = ""; // gnx of last file read
    private _lastBodyData: string = ""; // body content of last file read
    private _lastBodyLength: number = 0; // length of last file read

    // * List of gnx that should be available (from more.selectNode and fs.delete)
    private _openedBodiesGnx: string[] = [];
    public openedBodiesVNodes: { [key: string]: VNode } = {};
    private _openedBodiesInfo: { [key: string]: BodyTimeInfo } = {};

    private _lastBodyTimeGnx: string = "";

    // * An event to signal that a resource has been changed
    // * It should fire for resources that are being watched by clients of this provider
    private _onDidChangeFileEmitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._onDidChangeFileEmitter.event;
    private _bufferedEvents: vscode.FileChangeEvent[] = [];
    private _fireSoonHandle?: NodeJS.Timer;

    constructor(private _leoUi: LeoUI) { }

    /**
     * * Sets selected node body's modified time for this gnx virtual file
     * @param p_uri URI of file for which to set made-up modified time
     */
    public setNewBodyUriTime(p_uri: vscode.Uri, v: VNode): void {
        const w_gnx = utils.leoUriToStr(p_uri);
        if (p_uri.path.match(Constants.DETACHED_REGEX)) {
            // pass
        } else {
            this._lastBodyTimeGnx = w_gnx;
        }
        this._setOpenedBodyTime(w_gnx);
        this.openedBodiesVNodes[w_gnx] = v;
    }

    /**
     * * Adds entries in _openedBodiesGnx and _openedBodiesInfo if needed
     * * and sets the modified time of an opened body.
     */
    private _setOpenedBodyTime(p_gnx: string): void {
        const w_now = new Date().getTime();
        let w_created = w_now;
        if (this._openedBodiesGnx.includes(p_gnx)) {
            w_created = this._openedBodiesInfo[p_gnx].ctime; // Already created?
        } else {
            this._openedBodiesGnx.push(p_gnx);
        }
        this._openedBodiesInfo[p_gnx] = {
            ctime: w_created,
            mtime: w_now // new 'modified' time for sure.
        };
    }

    /**
     * * Refresh the body pane for a particular gnx by telling vscode that the file from the Leo file provider has changed
     * @param p_gnx Gnx of body associated with this virtual file, mostly Leo's selected node
     */
    public fireRefreshFile(p_gnx: string): void {
        // console.log("fireRefreshFile called for gnx: ", p_gnx);
        if (!this._openedBodiesGnx.includes(p_gnx)) {
            console.error("DETACHED ASKED TO REFRESH NOT EVEN IN SELECTED BODY: ", p_gnx);
            return; // Exiting because that document's tab was closed
        }

        this._setOpenedBodyTime(p_gnx);

        this._onDidChangeFileEmitter.fire([{
            type: vscode.FileChangeType.Changed,
            uri: utils.strToLeoDetachedUri(p_gnx)
        }]);
    }

    /**
     * ? Maybe deprecated 
     * * Refreshes the '_possibleGnxList' list of all unique gnx from Leo
     * @returns a 'fresh' gnx string array
     */
    public refreshPossibleGnxList(): string[] {
        // * Get updated list of possible gnx

        // all_gnx = [p.v.gnx for p in c.all_unique_positions(copy=False)]
        const c = g.app.windowList[this._leoUi.frameIndex].c;
        return [...c.all_unique_positions(false)].map(p => p.v.gnx);
    }

    public watch(p_resource: vscode.Uri, p_options: { readonly recursive: boolean; readonly excludes: readonly string[] }): vscode.Disposable {
        const w_gnx = utils.leoUriToStr(p_resource);

        // else already in list
        return new vscode.Disposable(() => {

            if (this._openedBodiesGnx.includes(w_gnx)) {
                this._openedBodiesGnx.splice(this._openedBodiesGnx.indexOf(w_gnx), 1);
                delete this._openedBodiesInfo[w_gnx];
                delete this.openedBodiesVNodes[w_gnx];
            } else {
                // console.log("not deleted");
            }

            // const w_position = this._watchedBodiesGnx.indexOf(w_gnx); // find and remove it
            // if (w_position > -1) {
            //     this._watchedBodiesGnx.splice(w_position, 1);
            // }
        });
    }

    public stat(p_uri: vscode.Uri): vscode.FileStat {
        console.log("DETACHED stat called on uri path: ", p_uri.path);
        if (this._leoUi.leoStates.fileOpenedReady) {
            const w_gnx = utils.leoUriToStr(p_uri);

            const w_commanders: Set<string> = new Set();
            const w_detached: Set<string> = new Set(); // same whole gnx string as with setNewBodyUriTime

            for (const p_tabGroup of vscode.window.tabGroups.all) {
                for (const p_tab of p_tabGroup.tabs) {
                    if (p_tab.input &&
                        (p_tab.input as vscode.TabInputText).uri &&
                        (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME
                    ) {
                        // Found detached. 
                        const [unused, id, gnx] = (p_tab.input as vscode.TabInputText).uri.path.split("/");
                        w_commanders.add(id);
                        w_detached.add(utils.leoUriToStr((p_tab.input as vscode.TabInputText).uri));
                    }
                }
            }

            // w_commanders and w_detached are filled up!
            if (p_uri.fsPath.length === 1) {
                return { type: vscode.FileType.Directory, ctime: 0, mtime: 0, size: 0 };
            }

            const [unused, id, gnx] = p_uri.path.split("/");
            console.log(`DETACHED stat:  id ${id}, gnx ${gnx} `);

            if (id && !gnx) {
                console.log('DETACHED  was a commander dir');
                return { type: vscode.FileType.Directory, ctime: 0, mtime: 0, size: 0 };
            } else if (w_gnx === this._lastGnx && this._openedBodiesGnx.includes(this._lastGnx)) {
                console.log("DETACHED was last gnx 1", this._lastGnx, {
                    type: vscode.FileType.File,
                    ctime: this._openedBodiesInfo[this._lastGnx].ctime,
                    mtime: this._openedBodiesInfo[this._lastGnx].mtime,
                    size: this._lastBodyLength
                });
                return {
                    type: vscode.FileType.File,
                    ctime: this._openedBodiesInfo[this._lastGnx].ctime,
                    mtime: this._openedBodiesInfo[this._lastGnx].mtime,
                    size: this._lastBodyLength
                };
            } else if (this._openedBodiesGnx.includes(w_gnx)) {
                let c: Commands;
                let w_v: VNode | undefined;
                const id = p_uri.path.split("/")[1];
                for (const w_frame of g.app.windowList) {
                    if (w_frame.c.id.toString() === id) {
                        c = w_frame.c;
                        w_v = c.fileCommands.gnxDict[p_uri.path.split("/")[2]];
                        break;
                    }
                }
                if (w_v) {
                    console.log("DETACHED was new gnx 2", this._lastGnx, {
                        type: vscode.FileType.File,
                        ctime: this._openedBodiesInfo[w_gnx].ctime,
                        mtime: this._openedBodiesInfo[w_gnx].mtime,
                        size: Buffer.byteLength(w_v.b, 'utf8') // w_v.b.length
                    });
                    return {
                        type: vscode.FileType.File,
                        ctime: this._openedBodiesInfo[w_gnx].ctime,
                        mtime: this._openedBodiesInfo[w_gnx].mtime,
                        size: Buffer.byteLength(w_v.b, 'utf8') // w_v.b.length
                    };
                } else {
                    console.log('DETACHED BODY stat: not found!');
                }
            } else {
                console.error('DETACHED asked for STAT about file NOT IN _openedBodiesGnx ');
            }
        }
        // throw vscode.FileSystemError.FileNotFound();
        // (Instead of FileNotFound) should be caught by _onActiveEditorChanged or _changedVisibleTextEditors
        return { type: vscode.FileType.File, ctime: 0, mtime: 0, size: 0 };
    }

    public readFile(p_uri: vscode.Uri): Uint8Array {
        if (this._leoUi.leoStates.fileOpenedReady) {
            if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
                throw vscode.FileSystemError.FileIsADirectory();
            } else {
                const w_gnx = utils.leoUriToStr(p_uri);

                if (!this._openedBodiesGnx.includes(w_gnx)) {
                    console.log(
                        " _openedBodiesGnx length: ", this._openedBodiesGnx.length,
                        '\n *** readFile: ERROR DETACHED File not in _openedBodiesGnx! readFile missing refreshes? gnx: ', w_gnx
                    );
                }
                let c: Commands;
                let w_v: VNode | undefined;

                const id = p_uri.path.split("/")[1];
                for (const w_frame of g.app.windowList) {
                    if (w_frame.c.id.toString() === id) {
                        c = w_frame.c;
                        w_v = c.fileCommands.gnxDict[p_uri.path.split("/")[2]];
                        break;
                    }
                }

                if (w_v) {
                    this._errorRefreshFlag = false; // got body so reset possible flag!
                    this._lastGnx = w_gnx;
                    this._lastBodyData = w_v.b;
                    const w_buffer: Uint8Array = Buffer.from(this._lastBodyData);
                    this._lastBodyLength = w_buffer.byteLength;
                    return w_buffer;
                } else {
                    if (!this._errorRefreshFlag) {
                        this._leoUi.fullRefresh();
                    }
                    if (this._lastGnx === w_gnx) {
                        // was last gnx of closed file about to be switched to new document selected
                        console.log('DETACHED Passed in not found: ' + w_gnx);
                        return Buffer.from(this._lastBodyData);
                    }
                    console.error("ERROR => readFile DETACHED  of unknown GNX"); // is possibleGnxList updated correctly?
                    return Buffer.from("");
                }
            }
        } else {
            throw vscode.FileSystemError.FileNotFound();
        }
    }

    public readDirectory(p_uri: vscode.Uri): [string, vscode.FileType][] {

        console.log("DETACHED  readDirectory called on uri path: ", p_uri.path);

        const w_commanders: Set<string> = new Set();
        const w_detached: Set<string> = new Set();
        if (this._leoUi.leoStates.fileOpenedReady) {

            for (const p_tabGroup of vscode.window.tabGroups.all) {
                for (const p_tab of p_tabGroup.tabs) {
                    if (p_tab.input &&
                        (p_tab.input as vscode.TabInputText).uri &&
                        (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_DETACHED_SCHEME
                    ) {
                        // Found detached. 
                        const [unused, id, gnx] = (p_tab.input as vscode.TabInputText).uri.path.split("/");
                        w_commanders.add(id);
                        w_detached.add((p_tab.input as vscode.TabInputText).uri.path);
                    }
                }
            }
        }

        if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
            const w_directory: [string, vscode.FileType][] = [];
            // w_directory.push([this._lastBodyTimeGnx, vscode.FileType.File]);
            for (const w_commander of [...w_commanders]) {
                w_directory.push([w_commander, vscode.FileType.Directory]);
            }
            console.log("DETACHED  returned all visible c ids:", w_directory);
            return w_directory;
        } else if (
            p_uri.path.split('/').length
        ) {
            const w_directory: [string, vscode.FileType][] = [];
            for (const w_file of [...w_detached]) {
                if (w_file.split('/')[1] === p_uri.path.split('/')[1]) {
                    w_directory.push([w_file.split('/')[2], vscode.FileType.File]);
                }
            }
            console.log(`DETACHED  returned all visible detached in ${p_uri.path} :`, w_directory);

            return w_directory;

        } else {
            console.log('Error: DETACHED  Asked to read Directory! uri path: ' + p_uri.path);
            throw vscode.FileSystemError.FileNotFound(p_uri);
        }
    }

    public createDirectory(p_uri: vscode.Uri): void {
        console.warn('Called DETACHED  createDirectory with ', p_uri.path); // should not happen
        throw vscode.FileSystemError.NoPermissions();
    }

    public writeFile(p_uri: vscode.Uri, p_content: Uint8Array, p_options: { create: boolean, overwrite: boolean }): void {
        console.log('DETACHED writeFile lenght: ', p_content.byteLength);

        if (this.preventSaveToLeo) {
            this.preventSaveToLeo = false;
        } else {
            void this._leoUi.triggerBodySave(true); // Might have been a vscode 'save' via the menu
        }
        const w_gnx = utils.leoUriToStr(p_uri);
        if (!this._openedBodiesGnx.includes(w_gnx)) {
            console.error("LeoJS: Tried to save DETACHED but not in _openedBodiesGnx. gnx :", w_gnx);
        }
        this._setOpenedBodyTime(w_gnx);
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: p_uri });
    }

    public rename(p_oldUri: vscode.Uri, p_newUri: vscode.Uri, p_options: { overwrite: boolean }): void {
        console.warn('Called DETACHED  rename on ', p_oldUri.path, p_newUri.path); // should not happen
        this._fireSoon(
            { type: vscode.FileChangeType.Deleted, uri: p_oldUri },
            { type: vscode.FileChangeType.Created, uri: p_newUri }
        );
    }

    public delete(p_uri: vscode.Uri): void {
        const w_gnx = utils.leoUriToStr(p_uri);
        console.log("delete body DETACHED file " + w_gnx);

        if (this._openedBodiesGnx.includes(w_gnx)) {
            this._openedBodiesGnx.splice(this._openedBodiesGnx.indexOf(w_gnx), 1);
            delete this._openedBodiesInfo[w_gnx];
            delete this.openedBodiesVNodes[w_gnx];
        } else {
            // console.log("not deleted");
        }

        // dirname is just a slash "/"
        let w_dirname = p_uri.with({ path: path.posix.dirname(p_uri.path) });

        this._fireSoon(
            { type: vscode.FileChangeType.Changed, uri: w_dirname },
            { uri: p_uri, type: vscode.FileChangeType.Deleted }
        );
    }

    public copy(p_uri: vscode.Uri): void {
        console.warn('Called DETACHED  copy on ', p_uri.path); // should not happen
        throw vscode.FileSystemError.NoPermissions();
    }

    private _fireSoon(...p_events: vscode.FileChangeEvent[]): void {
        this._bufferedEvents.push(...p_events);
        if (this._fireSoonHandle) {
            clearTimeout(this._fireSoonHandle);
        }
        this._fireSoonHandle = setTimeout(() => {
            this._onDidChangeFileEmitter.fire(this._bufferedEvents);
            this._bufferedEvents.length = 0; // clearing events array
        }, 5);
    }

}
