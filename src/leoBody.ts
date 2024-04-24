import * as vscode from "vscode";
import * as utils from "./utils";
import * as path from 'path';
import { BodyTimeInfo } from "./types";
import { LeoUI } from "./leoUI";
import * as g from './core/leoGlobals';
import { Constants } from "./constants";

/**
 * * Body panes implementation as a file system using "leojs" as a scheme identifier
 */
export class LeoBodyProvider implements vscode.FileSystemProvider {

    // * Flag normally false
    public preventSaveToLeo: boolean = false;
    private _errorRefreshFlag: boolean = false;

    // * Last file read data with the readFile method
    private _lastGnx: string = ""; // gnx of last file read
    private _lastBodyData: string = ""; // body content of last file read
    private _lastBodyLength: number = 0; // length of last file read

    // * List of currently opened body panes gnx (from 'watch' & 'dispose' methods)
    public watchedBodiesGnx: string[] = [];

    // * List of gnx open in tab(s) (from tryApplyNodeToBody / switchBody and fs.delete)
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
    public setNewBodyUriTime(p_uri: vscode.Uri): void {
        const w_gnx = utils.leoUriToStr(p_uri);
        this._lastBodyTimeGnx = w_gnx;
        this._setOpenedBodyTime(w_gnx);
    }

    /**
     * * Adds entries in _openedBodiesGnx and _openedBodiesInfo if needed
     * * and sets the modified time of an opened body.
     */
    private _setOpenedBodyTime(p_gnx: string): void {
        const w_now = new Date().getTime();
        let w_created = w_now;
        if (this._openedBodiesInfo[p_gnx]) {
            w_created = this._openedBodiesInfo[p_gnx].ctime; // Already created?
        }

        const w_stack = new Error().stack!;
        const stackArray = w_stack.split("at ").slice(1, 4).map(s => {
            let index = s.indexOf('(');  // Find the index of the opening parenthesis
            if (index !== -1) {
                return s.substring(0, index);  // Cut the string up to the parenthesis
            }
            return s;  // Return the original string if no parenthesis is found
        });
        console.log("-------- SET BODY TIME ", p_gnx, ' AT ', w_now, stackArray.join(" "));

        this._openedBodiesInfo[p_gnx] = {
            ctime: w_created,
            mtime: w_now // new 'modified' time.
        };
    }

    public cleanupBodies(): void {
        const w_foundGnx: string[] = [];
        vscode.window.tabGroups.all.forEach((p_tabGroup) => {
            p_tabGroup.tabs.forEach((p_tab) => {
                if (p_tab.input &&
                    (p_tab.input as vscode.TabInputText).uri &&
                    (p_tab.input as vscode.TabInputText).uri.scheme === Constants.URI_LEOJS_SCHEME
                ) {
                    w_foundGnx.push(utils.leoUriToStr((p_tab.input as vscode.TabInputText).uri));
                }
            });
        });
        if (!w_foundGnx.length) {
            return;
        }
        for (const openBody of Object.keys(this._openedBodiesInfo)) {
            if (!w_foundGnx.includes(openBody)) {
                // Not an opened tab! remove it!
                console.log("cleanup Bodies removing ", openBody.length);

                delete this._openedBodiesInfo[openBody];
            }
        }
    }

    /**
     * * Refresh the body pane for a particular gnx by telling vscode that the file from the Leo file provider has changed
     * @param p_gnx Gnx of body associated with this virtual file, mostly Leo's selected node
     */
    public fireRefreshFile(p_gnx: string): void {

        this._setOpenedBodyTime(p_gnx);

        if (!this.watchedBodiesGnx.includes(p_gnx)) {
            console.warn("------- ASKED TO REFRESH NOT EVEN IN WATCHED BODIES: ", p_gnx);
            return; // Document is not being watched (closed tab or non-visible non-dirty tab)
        }
        console.log('--------- fire ------------------------');

        this._onDidChangeFileEmitter.fire([{
            type: vscode.FileChangeType.Changed,
            uri: utils.strToLeoUri(p_gnx)
        }]);
    }

    public watch(p_resource: vscode.Uri, p_options: { readonly recursive: boolean; readonly excludes: readonly string[] }): vscode.Disposable {
        const w_gnx = utils.leoUriToStr(p_resource);
        if (!this.watchedBodiesGnx.includes(w_gnx)) {
            this.watchedBodiesGnx.push(w_gnx); // add gnx
        }
        // else already in list
        return new vscode.Disposable(() => {
            console.log('--------- ### removed watched: ', w_gnx);
            const w_position = this.watchedBodiesGnx.indexOf(w_gnx); // find and remove it
            if (w_position > -1) {
                this.watchedBodiesGnx.splice(w_position, 1);
            }
        });
    }

    public stat(p_uri: vscode.Uri): vscode.FileStat {
        if (this._leoUi.leoStates.fileOpenedReady) {
            const w_gnx = utils.leoUriToStr(p_uri);
            if (p_uri.fsPath.length === 1) {
                console.log("------ stat, path: ", p_uri.path, ' was a commander dir');

                return { type: vscode.FileType.Directory, ctime: 0, mtime: 0, size: 0 };
            } else if (w_gnx === this._lastGnx && this._openedBodiesInfo[this._lastGnx]) {

                console.log("------ stat, path: ", p_uri.path, "was last gnx", this._lastGnx, {
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
            } else if (this._openedBodiesInfo[w_gnx]) {
                const c = g.app.windowList[this._leoUi.frameIndex].c;
                const w_v = c.fileCommands.gnxDict[w_gnx];

                console.log("------ stat", w_gnx, {
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
            }
        }
        // throw vscode.FileSystemError.FileNotFound();
        // (Instead of FileNotFound) should be caught by _onActiveEditorChanged or _changedVisibleTextEditors
        console.log('----- stat not found ');
        return { type: vscode.FileType.File, ctime: 0, mtime: 0, size: 0 };
    }

    public readFile(p_uri: vscode.Uri): Uint8Array {
        if (this._leoUi.leoStates.fileOpenedReady) {
            if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
                throw vscode.FileSystemError.FileIsADirectory();
            } else {
                const w_gnx = utils.leoUriToStr(p_uri);

                if (!this._openedBodiesInfo[w_gnx]) {
                    console.log(
                        '*** readFile: ERROR File not in _openedBodiesInfo! readFile missing refreshes? gnx: ', w_gnx
                    );
                }
                const c = g.app.windowList[this._leoUi.frameIndex].c;
                const w_v = c.fileCommands.gnxDict[w_gnx];

                if (w_v) {
                    this._errorRefreshFlag = false; // got body so reset possible flag!
                    this._lastGnx = w_gnx;
                    this._lastBodyData = w_v.b;
                    const w_buffer: Uint8Array = Buffer.from(this._lastBodyData);
                    this._lastBodyLength = w_buffer.byteLength;

                    console.log('------ READ FILE: ', w_gnx, 'size: ', w_buffer.byteLength);

                    return w_buffer;
                } else {
                    if (!this._errorRefreshFlag) {
                        this._leoUi.fullRefresh();
                    }
                    if (this._lastGnx === w_gnx) {
                        // was last gnx of closed file about to be switched to new document selected
                        console.log('----- Passed in not found: ' + w_gnx);
                        return Buffer.from(this._lastBodyData);
                    }
                    console.error("ERROR => readFile of unknown GNX"); // is possibleGnxList updated correctly?
                    return Buffer.from("");
                }
            }
        } else {
            throw vscode.FileSystemError.FileNotFound();
        }
    }

    public readDirectory(p_uri: vscode.Uri): [string, vscode.FileType][] {

        console.log("------ readDirectory called on uri path: ", p_uri.path);

        if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
            const w_directory: [string, vscode.FileType][] = [];
            w_directory.push([this._lastBodyTimeGnx, vscode.FileType.File]);
            return w_directory;
        } else {
            throw vscode.FileSystemError.FileNotFound(p_uri);
        }
    }

    public createDirectory(p_uri: vscode.Uri): void {
        console.warn('------ Called createDirectory with ', p_uri.fsPath); // should not happen
        throw vscode.FileSystemError.NoPermissions();
    }

    public writeFile(p_uri: vscode.Uri, p_content: Uint8Array, p_options: { create: boolean, overwrite: boolean }): void {
        if (this.preventSaveToLeo) {
            this.preventSaveToLeo = false;
        } else {
            void this._leoUi.triggerBodySave(true); // Might have been a vscode 'save' via the menu
        }

        const w_gnx = utils.leoUriToStr(p_uri);
        console.log('------ writeFile ', w_gnx, 'size: ', p_content.byteLength);

        if (!this._openedBodiesInfo[w_gnx]) {
            console.error("LeoJS: Tried to save body other than selected node's body", w_gnx);
        }
        this._setOpenedBodyTime(w_gnx);
        if (w_gnx === this._lastGnx) {
            this._lastBodyLength = p_content.byteLength;
        }
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: p_uri });
    }

    public rename(p_oldUri: vscode.Uri, p_newUri: vscode.Uri, p_options: { overwrite: boolean }): void {
        console.warn('Called rename on ', p_oldUri.fsPath, p_newUri.fsPath); // should not happen
        this._fireSoon(
            { type: vscode.FileChangeType.Deleted, uri: p_oldUri },
            { type: vscode.FileChangeType.Created, uri: p_newUri }
        );
    }

    public delete(p_uri: vscode.Uri): void {
        const w_gnx = utils.leoUriToStr(p_uri);
        console.log("delete body file " + w_gnx);

        if (this._openedBodiesInfo[w_gnx]) {
            delete this._openedBodiesInfo[w_gnx];
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
        console.warn('Called copy on ', p_uri.fsPath); // should not happen
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
