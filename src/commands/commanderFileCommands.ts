//@+leo-ver=5-thin
//@+node:felix.20211017230407.1: * @file src/commands/commanderFileCommands.ts
/**
 * File commands that used to be defined in leoCommands.py
 */
import * as vscode from 'vscode';
import * as utils from '../utils';
import * as g from '../core/leoGlobals';
import { commander_command } from '../core/decorators';
import { Position } from '../core/leoNodes';
import { Commands } from '../core/leoCommands';
import { Bead, Undoer } from '../core/leoUndo';
import { PreviousSettings } from '../core/leoApp';
import { NullGui } from '../core/leoGui';
import { LeoImportCommands, MORE_Importer } from '../core/leoImport';
import { ScriptingController } from '../core/mod_scripting';

//@+others
//@+node:felix.20220105223215.1: ** function: import_txt_file
/**
 * Import the .txt file into a new node.
 */
async function import_txt_file(c: Commands, fn: string): Promise<void> {
    const u = c.undoer;
    g.setGlobalOpenDir(fn);
    const undoData = u.beforeInsertNode(c.p);
    const p = c.p.insertAfter();
    p.h = `@edit ${fn}`;
    let s: string | undefined;
    let e: any;
    [s, e] = await g.readFileIntoString(fn, undefined, '@edit');
    p.b = s!;
    u.afterInsertNode(p, 'Import', undoData);
    c.setChanged();
    c.redraw(p);
}
//@+node:felix.20220105212849.1: ** Class CommanderFileCommands
export class CommanderFileCommands {
    //@+others
    //@+node:felix.20231019230149.1: *3*  top-level helper functions
    //@+node:felix.20231019230149.2: *4* function: do_error_dialogs

    /**
     * Raise error dialogs.
     * 
     * A helper function for c.save, c.saveAs, and c.saveTo.
     */
    public async do_error_dialogs(c: Commands): Promise<void> {
        await c.syntaxErrorDialog();
        await c.raise_error_dialogs('write');
    }
    //@+node:felix.20231019230149.3: *4* function: set_name_and_title
    /**
     * Compute the finalized name for c.mFileName. Set related ivars.
     * 
     * A helper function for c.save, c.saveAs, and c.saveTo.
     * 
     * Return the finalized name.
     */
    public set_name_and_title(c: Commands, fileName: string): string {
        // Finalize fileName.
        if (fileName.endsWith('.leo') || fileName.endsWith('.db') || fileName.endsWith('.leojs')) {
            c.mFileName = fileName;
        } else {
            c.mFileName = g.ensure_extension(fileName, g.defaultLeoFileExtension(c));
        }

        // Set various ivars.
        const title = c.computeWindowTitle();
        c.frame.title = title;
        c.frame.setTitle(title);

        try {
            // Does not exist during unit testing. May not exist in all guis.
            // c.frame.top?.leo_master?.setTabName(c, c.mFileName);
        } catch (error) {
            // Do nothing.
        }
        return c.mFileName;
    }
    //@+node:felix.20220105210716.2: *3* c_file.reloadSettings
    @commander_command(
        'reload-settings',
        'Reload settings for the selected outline, saving it if necessary.'
    )
    public async reloadSettings(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const lm = g.app.loadManager!;
        // Save any changes so they can be seen.
        for (let c2 of g.app.commanders()) {
            if (c2.isChanged()) {
                await c2.save();
            }
        }
        // Read leoSettings.leo and myLeoSettings.leo, using a null gui.
        await lm.readGlobalSettingsFiles();
        for (let c of g.app.commanders()) {
            // Read the local file, using a null gui.
            const previousSettings = await lm.getPreviousSettings(c.mFileName);
            // Init the config classes.
            c.initSettings(previousSettings);
            // Init the commander config ivars.
            c.initConfigSettings();
            // Reload settings in all configurable classes
            c.reloadConfigurableSettings();
        }
        return Promise.resolve();
    }
    //@+node:felix.20220105210716.5: *3* c_file.top level
    //@+node:felix.20220105210716.6: *4* c_file.close
    @commander_command(
        'close-window',
        'Close the Leo window, prompting to save it if it has been changed.'
    )
    public close(this: Commands, new_c?: Commands): Promise<unknown> {
        return g.app.closeLeoWindow(this.frame, new_c);
    }
    //@+node:felix.20220105210716.7: *4* c_file.importAnyFile & helper
    @commander_command('import-file', 'Import one or more files.')
    public async importAnyFile(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const ic: LeoImportCommands = c.importCommands;
        const types: [string, string][] = [
            ['All files', '*'],
            ['C/C++ files', '*.c'],
            ['C/C++ files', '*.cpp'],
            ['C/C++ files', '*.h'],
            ['C/C++ files', '*.hpp'],
            ['FreeMind files', '*.mm.html *.mm *.html'],
            ['Java files', '*.java'],
            ['JavaScript files', '*.js'],
            // ["JSON files", "*.json"],
            ['Mindjet files', '*.csv'],
            ['MORE files', '*.MORE'],
            ['Lua files', '*.lua'],
            ['Pascal files', '*.pas'],
            ['Python files', '*.py'],
            ['Text files', '*.txt'],
        ];
        let names: string[] = await g.app.gui.runOpenFilesDialog(
            c,
            'Import File',
            types,
            '.py',
        );
        c.bringToFront();
        if (names && names.length) {
            await g.chdir(names[0]);
        } else {
            names = [];
        }
        if (!names.length) {
            if (g.unitTesting) {
                // a kludge for unit testing.
                c.init_error_dialogs();
                await c.raise_error_dialogs('read');
            }
            return;
        }
        // New in Leo 4.9: choose the type of import based on the extension.
        c.init_error_dialogs();
        const derived: string[] = [];
        for (const z of names) {
            if (await c.looksLikeDerivedFile(z)) {
                derived.push(z);
            }
        }
        const others: string[] = names.filter((z) => !derived.includes(z));
        if (derived && derived.length) {
            await ic.importDerivedFiles(c.p, derived);
        }
        let junk: string;
        let ext: string;
        for (let fn of others) {
            [junk, ext] = g.os_path_splitext(fn);
            ext = ext.toLowerCase(); // #1522
            if (ext.startsWith('.')) {
                ext = ext.slice(1);
            }
            if (ext === 'csv') {
                await ic.importMindMap([fn]);
            } else if (['cw', 'cweb'].includes(ext)) {
                await ic.importWebCommand([fn], 'cweb');
            }
            // Not useful. Use @auto x.json instead.
            // else if ext == 'json':
            // ic.importJSON([fn])
            else if (fn.endsWith('mm.html')) {
                await ic.importFreeMind([fn]);
            } else if (['nw', 'noweb'].includes(ext)) {
                await ic.importWebCommand([fn], 'noweb');
            } else if (ext === 'more') {
                await new MORE_Importer(c).import_file(fn); // #1522.
            } else if (ext === 'txt') {
                // #1522: Create an @edit node.
                await import_txt_file(c, fn);
            } else {
                // Make *sure* that parent.b is empty.
                const last = c.lastTopLevel();
                const parent = last.insertAfter();
                parent.v.h = 'Imported Files';
                await ic.importFilesCommand(
                    [fn],
                    parent,
                    undefined,
                    '@auto' // was '@clean'
                    // Experimental: attempt to use permissive section ref logic.
                );
            }
            c.redraw();
        }
        await c.raise_error_dialogs('read');
    }
    // * LEOJS NOT USED : Not referenced in Leo's codebase either
    /*
    g.command_alias('importAtFile', importAnyFile)
    g.command_alias('importAtRoot', importAnyFile)
    g.command_alias('importCWEBFiles', importAnyFile)
    g.command_alias('importDerivedFile', importAnyFile)
    g.command_alias('importFlattenedOutline', importAnyFile)
    g.command_alias('importMOREFiles', importAnyFile)
    g.command_alias('importNowebFiles', importAnyFile)
    g.command_alias('importTabFiles', importAnyFile)
    */
    //@+node:felix.20220105210716.9: *4* c_file.new
    @commander_command('file-new', 'Create a new Leo window.')
    @commander_command('new', 'Create a new Leo window.')
    public async new(this: Commands, gui: NullGui): Promise<Commands> {
        const t1 = process.hrtime();
        // from leo.core import leoApp
        const lm = g.app.loadManager!;
        const old_c = this;
        // Clean out the update queue so it won't interfere with the new window.
        this.outerUpdate();
        // Suppress redraws until later.
        g.app.disable_redraw = true;
        // Send all log messages to the new frame.
        // g.app.setLog(None)
        // g.app.lockLog()

        // Retain all previous settings. Very important for theme code.
        const t2 = process.hrtime();
        g.app.numberOfUntitledWindows += 1;
        const c = g.app.newCommander(
            '',
            gui,
            new PreviousSettings(lm.globalSettingsDict, lm.globalBindingsDict)
        );

        // ! LEOJS : SET c.openDirectory to the g.app.vscodeWorkspaceUri !
        // c.openDirectory = g.app.vscodeWorkspaceUri?.fsPath;
        // if (c.openDirectory) {
        //     c.frame.openDirectory = c.openDirectory;
        // }

        const t3 = process.hrtime();
        // frame = c.frame
        // g.app.unlockLog()
        // if not old_c:
        //   frame.setInitialWindowGeometry()
        // #1643: This doesn't work.
        // g.app.restoreWindowState(c)
        // frame.deiconify()
        // frame.lift()
        // frame.resizePanesToRatio(frame.ratio, frame.secondary_ratio)
        // Resize the _new_ frame.
        // c.frame.createFirstTreeNode()
        lm.createMenu(c);
        lm.finishOpen(c);
        //g.app.writeWaitingLog(c);
        g.doHook('new', { old_c: old_c, c: c, new_c: c });

        // ! mod_scripting ORIGINALLY INIT ON open2 or new HOOK IN LEO !
        c.theScriptingController = new ScriptingController(c);
        await c.theScriptingController.createAllButtons();

        // c.setLog();
        c.clearChanged(); // Fix #387: Clear all dirty bits.
        g.app.disable_redraw = false;

        c.redraw();

        const t4 = process.hrtime();

        if (g.app.debug.includes('speed')) {
            g.trace();
            g.es(
                `    1: ${utils.getDurationSeconds(t1, t2)}\n` + // 0.00 sec.
                `    2: ${utils.getDurationSeconds(t2, t3)}\n` + // 0.36 sec: c.__init__
                `    3: ${utils.getDurationSeconds(t3, t4)}\n` + // 0.17 sec: Everything else.
                `total: ${utils.getDurationSeconds(t1, t4)}`
            );
        }
        return c; // For unit tests and scripts.
    }
    //@+node:felix.20220105210716.10: *4* c_file.open_outline
    @commander_command(
        'open-outline',
        'Open a Leo window containing the contents of a .leo file.'
    )
    public async open_outline(
        this: Commands,
        p_uri?: vscode.Uri
    ): Promise<unknown> {
        const c: Commands = this;

        //@+others // Defines open_completer function.
        //@+node:felix.20220105210716.11: *5* function: open_completer
        async function open_completer(
            p_c: Commands,
            closeFlag: boolean,
            fileName?: string
        ): Promise<unknown> {

            // FIX SLASHES AND CAPITALIZE DRIVE LETTERS TO EMULATE PYTHON OPEN FILE DIALOG RESULT
            if (fileName) {
                fileName = g.os_path_fix_drive(fileName);
                fileName = g.os_path_normslashes(fileName);
            }

            p_c.bringToFront();
            p_c.init_error_dialogs();

            let ok: any = false;

            // ! THIS METHOD VOLUNTARILY DIFFERENT THAN LEO'S PYTHON CODE

            let q_result = Promise.resolve();
            if (fileName) {
                if (g.app.loadManager!.isLeoFile(fileName)) {
                    const c2 = await g.openWithFileName(fileName, p_c, c.gui);
                    if (c2) {
                        // c2.k.makeAllBindings(); // ? needed ?

                        // Fix #579: Key bindings don't take for commands defined in plugins.
                        await g.chdir(fileName);
                        g.setGlobalOpenDir(fileName);
                    }
                    if (c2 && closeFlag) {
                        await g.app.destroyWindow(p_c.frame);
                        // ! Need to remove here in leojs !
                        let index = g.app.windowList.indexOf(p_c.frame, 0);
                        if (index > -1) {
                            g.app.windowList.splice(index, 1);
                        }

                        // Set UI document's pane and outline proper refresh selected index!

                        index = g.app.windowList.indexOf(c2.frame);
                        if (index >= 0) {
                            g.app.gui.frameIndex = index;
                        }
                    }
                } else {
                    // Create an @file node for files containing Leo sentinels.
                    const w_looksDerived = await p_c.looksLikeDerivedFile(
                        fileName
                    );
                    if (w_looksDerived) {
                        ok = await p_c.importCommands.importDerivedFiles(
                            p_c.p,
                            [fileName],
                            'Open'
                        );
                    } else {
                        // otherwise, create an @edit node.
                        ok = p_c.createNodeFromExternalFile(fileName);
                    }
                }
            }
            await p_c.raise_error_dialogs('write');
            await g.app.runAlreadyOpenDialog(p_c);

            return q_result;
        }
        //@-others

        // ! THIS METHOD VOLUNTARILY DIFFERENT THAN LEO'S PYTHON CODE
        // Close the window if this command completes successfully?
        let closeFlag: boolean =
            c.frame.startupWindow &&
            // The window was open on startup
            !c.changed &&
            !c.fileName() &&
            !c.frame.saved &&
            // The window has never been changed
            g.app.numberOfUntitledWindows === 1;
        // Only one untitled window has ever been opened

        let table: [string, string][] = [
            ['Leo files', '*.leojs *.leo *.db'],
            ['Python files', '*.py'],
            ['All files', '*'],
        ];
        // maybe from c.k.
        let fileName: string = c.k?.givenArgs?.join('');

        // override with given argument

        if (p_uri && p_uri.fsPath && p_uri.fsPath.trim()) {
            fileName = p_uri.fsPath;
        }

        if (fileName) {
            return open_completer(c, closeFlag, fileName);
        }
        // Equivalent to legacy code.
        fileName = await g.app.gui.runOpenFileDialog(
            c,
            'Open',
            table,
            g.defaultLeoFileExtension(c),
        );

        return open_completer(c, closeFlag, fileName);
    }
    //@+node:felix.20220105210716.12: *4* c_file.refreshFromDisk
    // refresh_pattern = re.compile(r'^(@[\w-]+)')

    @commander_command(
        'refresh-from-disk',
        'Refresh an @<file> node from disk.'
    )
    public async refreshFromDisk(this: Commands): Promise<void> {
        const c: Commands = this;
        let p: Position = this.p;
        // const u: Undoer = this.undoer;

        if (!p.isAnyAtFileNode()) {
            g.warning(`not an @<file> node: ${p.h}`);
            return;
        }
        const full_path = c.fullPath(p);
        const w_isDir = await g.os_path_isdir(full_path);
        if (w_isDir) {
            g.warning(`not a file: ${full_path}`);
            return;
        }
        const at = c.atFileCommands;
        c.nodeConflictList = [];
        c.recreateGnxDict();
        const old_gnx = p.v.gnx;
        if (p.isAtAutoNode() || p.isAtAutoRstNode()) {
            p.v._deleteAllChildren();
            p = await at.readOneAtAutoNode(p);  // Changes p!
        } else if (p.isAtFileNode()) {
            p.v._deleteAllChildren();
            await at.read(p);
        } else if (p.isAtCleanNode()) {
            // Don't delete children!
            await at.readOneAtCleanNode(p);
        } else if (p.isAtShadowFileNode()) {
            p.v._deleteAllChildren();
            await at.read(p);
        } else if (p.isAtEditNode()) {
            await at.readOneAtEditNode(p);  // Always deletes children.
        } else if (p.isAtAsisFileNode()) {
            await at.readOneAtAsisNode(p);  // Always deletes children.
        } else {
            g.es_print(`Unknown @<file> node: ${p.h}`);
            return;
        }
        if (p.v.gnx !== old_gnx && !g.unitTesting) {
            g.es_print(`refresh-from-disk changed the gnx for '${p.h}'`);
            g.es_print(`from '${old_gnx}' to: '${p.v.gnx}'`);
        }
        c.selectPosition(p);
        // Create the 'Recovered Nodes' tree.
        c.fileCommands.handleNodeConflicts();
        c.redraw();
        c.undoer.clearAndWarn('refresh-from-disk');
    }
    //@+node:felix.20220105210716.13: *4* c_file.pwd
    @commander_command('pwd', 'Prints the current working directory')
    public pwd_command(this: Commands): void {
        g.es_print('pwd:', process.cwd());
    }
    //@+node:felix.20220105210716.14: *4* c_file.save
    @commander_command(
        'save',
        'Save a Leo outline to a file, using the existing file name unless fileName is given'
    )
    @commander_command(
        'file-save',
        'Save a Leo outline to a file, using the existing file name unless fileName is given'
    )
    @commander_command(
        'save-file',
        'Save a Leo outline to a file, using the existing file name unless fileName is given'
    )
    public async save(this: Commands, fileName?: string): Promise<unknown> {
        const c: Commands = this;

        if (g.app.disableSave) {
            g.es('save commands disabled', 'purple');
            return;
        }

        /**
         * Common save code.
         */
        const do_save = async (c: Commands, fileName: string): Promise<void> => {

            // updateRecentFiles should be before the save.
            g.app.recentFilesManager.updateRecentFiles(fileName);

            await c.fileCommands.save(fileName);

            await g.chdir(fileName);
        };

        c.init_error_dialogs();

        try {

            // Don't prompt if the file name is known.
            let given_file_name = fileName || c.mFileName;
            if (given_file_name) {
                let final_file_name = this.set_name_and_title(c, given_file_name);
                await do_save(c, final_file_name);
                return;
            }

            // The file still has no name.
            let root = c.rootPosition()!;
            if (!root.next() && root.isAtEditNode()) {
                // Write the @edit node if needed.
                if (root.isDirty()) {
                    await c.atFileCommands.writeOneAtEditNode(root);
                }
                c.clearChanged();  // Clears all dirty bits.
                await this.do_error_dialogs(c);
                return;
            }

            // Prompt for fileName.
            let new_file_name = await g.app.gui.runSaveFileDialog(
                c,
                'Save',
                [['Leo files', '*.leojs *.leo *.db']], // Array of arrays (one in this case)
                g.defaultLeoFileExtension(c)
            );

            if (new_file_name) {
                let final_file_name = this.set_name_and_title(c, new_file_name);
                await do_save(c, final_file_name);

                await g.app.saveSession(); // IN LEOJS: To skip saving session on program exit.
            }

        } finally {
            await this.do_error_dialogs(c);
        }

    }
    //@+node:felix.20220105210716.15: *4* c_file.saveAll
    @commander_command('save-all', 'Save all open tabs windows/tabs.')
    public async saveAll(this: Commands): Promise<unknown> {
        const c: Commands = this;
        await c.save(); // Force a write of the present window.
        for (let c2 of g.app.commanders()) {
            if (c2 !== c && c2.isChanged()) {
                await c2.save();
            }
        }
        return Promise.resolve();
    }
    //@+node:felix.20220105210716.16: *4* c_file.saveAs
    @commander_command(
        'save-as',
        'Save a Leo outline to a file, prompting for a new filename unless fileName is given'
    )
    @commander_command(
        'file-save-as',
        'Save a Leo outline to a file, prompting for a new filename unless fileName is given'
    )
    @commander_command(
        'save-file-as',
        'Save a Leo outline to a file, prompting for a new filename unless fileName is given'
    )
    public async saveAs(this: Commands, fileName?: string): Promise<unknown> {
        const c: Commands = this;
        if (g.app.disableSave) {
            g.es('save commands disabled', 'purple');
            return;
        }

        const do_save_as = async (c: Commands, fileName: string): Promise<string> => {
            /** Common save-as code. */
            // 1. Forget the previous file.
            if (c.mFileName) {
                g.app.forgetOpenFile(c.mFileName);
            }
            // 2. Finalize fileName and set related ivars.
            let new_file_name = this.set_name_and_title(c, fileName);

            // 3. Do the save and related tasks.

            // updateRecentFiles should be before the save.
            g.app.recentFilesManager.updateRecentFiles(new_file_name);

            await c.fileCommands.saveAs(new_file_name);

            await g.chdir(new_file_name);

            await g.app.saveSession(); // IN LEOJS: To skip saving session on program exit.

            return new_file_name;
        };

        c.init_error_dialogs();


        try {
            c.init_error_dialogs();

            // Handle the kwarg first.
            if (fileName) {
                await do_save_as(c, fileName);
                return;
            }

            // Prompt for fileName.
            let new_file_name = await g.app.gui.runSaveFileDialog(
                c,
                'Save As',
                [['Leo files', '*.leojs *.leo *.db']], // Array of arrays (one in this case)
                g.defaultLeoFileExtension(c)
            );

            if (new_file_name) {
                await do_save_as(c, new_file_name);
            }

        } finally {
            await this.do_error_dialogs(c);
        }

    }
    //@+node:felix.20220105210716.17: *4* c_file.saveTo
    @commander_command(
        'save-to',
        'Save a copy of the Leo outline to a file, prompting for a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    @commander_command(
        'file-save-to',
        'Save a copy of the Leo outline to a file, prompting for a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    @commander_command(
        'save-file-to',
        'Save a copy of the Leo outline to a file, prompting for a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    public async saveTo(
        this: Commands,
        fileName?: string,
        silent?: boolean
    ): Promise<unknown> {
        const c: Commands = this;
        if (g.app.disableSave) {
            g.es('save commands disabled');
            return;
        }

        const do_save_to = async (c: Commands, fileName: string): Promise<void> => {
            /** Common save-to code. */

            g.app.recentFilesManager.updateRecentFiles(fileName);

            // *Never* change c.mFileName or c.frame.title.
            await c.fileCommands.saveTo(fileName, silent);

            // *Never* call g.chdir!
        };

        c.init_error_dialogs();



        try {

            // Handle the kwarg first.
            if (fileName) {
                await do_save_to(c, fileName);
                return;
            }

            // Prompt for fileName.
            let new_file_name = await g.app.gui.runSaveFileDialog(
                c,
                'Save To',
                [['Leo files', '*.leojs *.leo *.db']], // Array of arrays (one in this case)
                g.defaultLeoFileExtension(c)
            );

            if (new_file_name) {
                await do_save_to(c, new_file_name);
            }

        } finally {
            await this.do_error_dialogs(c);
        }

    }
    //@+node:felix.20220105210716.18: *4* c_file.revert
    @commander_command(
        'revert',
        'Revert the contents of a Leo outline to last saved contents.'
    )
    public async revert(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const u = c.undoer;
        // Make sure the user wants to Revert.
        const fn: string = c.mFileName;
        if (!fn) {
            g.es('can not revert unnamed file.');
        }
        const w_exists = await g.os_path_exists(fn);
        if (!w_exists) {
            g.es(`Can not revert unsaved file: ${fn}`);
            return;
        }
        const w_reply = await g.app.gui.runAskYesNoDialog(
            c,
            'Revert',
            `Revert to previous version of ${fn}?`
        );
        if (w_reply === 'yes') {
            u.clearUndoState();
            return g.app.loadManager!.revertCommander(c);
        }
    }
    //@+node:felix.20220105210716.19: *4* c_file.save-as-leojs
    @commander_command(
        'file-save-as-leojs',
        'Save a copy of the Leo outline as a JSON (.leojs) file with a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    @commander_command(
        'save-file-as-leojs',
        'Save a copy of the Leo outline as a JSON (.leojs) file with a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    public async save_as_leojs(this: Commands): Promise<unknown> {
        const c: Commands = this;
        let fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Save As JSON (.leojs)',
            [['Leo JSON files', '*.leojs']],
            '.leojs'
        );
        if (!fileName) {
            return;
        }
        if (!fileName.endsWith('.leojs')) {
            fileName = `${fileName}.leojs`;
        }
        // Leo 6.4: Using save-to instead of save-as allows two versions of the file.
        await c.saveTo(fileName);
        return c.fileCommands.putSavedMessage(fileName);
    }
    //@+node:felix.20220105210716.20: *4* c_file.save-as-zipped
    @commander_command(
        'file-save-as-db',
        'Save a copy of the Leo outline as a SQLite (.db) file with a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    @commander_command(
        'save-file-as-db',
        'Save a copy of the Leo outline as a SQLite (.db) file with a new file name. ' +
        'Leave the file name of the Leo outline unchanged.'
    )
    public async save_as_db(this: Commands): Promise<unknown> {
        const c: Commands = this;
        let fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Save As SQLite',
            [['Leo files', '*.db']],
            '.db'
        );
        if (!fileName) {
            return;
        }
        if (!fileName.endsWith('.db')) {
            fileName = `${fileName}.db`;
        }
        // Leo 6.4: Using save-to instead of save-as allows two versions of the file.
        await c.saveTo(fileName);
        return c.fileCommands.putSavedMessage(fileName);
    }
    //@+node:felix.20220105210716.21: *4* c_file.save-as-xml
    @commander_command(
        'file-save-as-xml',
        'Save a copy of the Leo outline as an XML .leo file with a new file name. ' +
        'Leave the file name of the Leo outline unchanged. ' +
        'Useful for converting a .leo.db file to a .leo file.'
    )
    @commander_command(
        'save-file-as-xml',
        'Save a copy of the Leo outline as an XML .leo file with a new file name. ' +
        'Leave the file name of the Leo outline unchanged. ' +
        'Useful for converting a .leo.db file to a .leo file.'
    )
    public async save_as_xml(this: Commands): Promise<unknown> {
        const c: Commands = this;
        let fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Save As XML',
            [['Leo files', '*.leo']],
            '.leo'
        );
        if (!fileName) {
            return;
        }
        if (!fileName.endsWith('.leo')) {
            fileName = `${fileName}.leo`;
        }
        // Leo 6.4: Using save-to instead of save-as allows two versions of the file.
        await c.saveTo(fileName);
        return c.fileCommands.putSavedMessage(fileName);
    }
    //@+node:felix.20220105210716.22: *3* Export
    //@+node:felix.20220105210716.23: *4* c_file.exportHeadlines
    @commander_command(
        'export-headlines',
        'Export headlines for c.p and its subtree to an external file.'
    )
    public async exportHeadlines(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const filetypes: [string, string][] = [
            ['Text files', '*.txt'],
            ['All files', '*'],
        ];
        const fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Export Headlines',
            filetypes,
            '.txt'
        );
        c.bringToFront();
        if (fileName) {
            g.setGlobalOpenDir(fileName);
            await g.chdir(fileName);
            return c.importCommands.exportHeadlines(fileName);
        }
    }
    //@+node:felix.20220105210716.24: *4* c_file.flattenOutline
    @commander_command(
        'flatten-outline',
        'Export the selected outline to an external file. The outline is represented in MORE format.'
    )
    public async flattenOutline(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const filetypes: [string, string][] = [
            ['Text files', '*.txt'],
            ['All files', '*'],
        ];
        const fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Flatten Selected Outline',
            filetypes,
            '.txt'
        );
        c.bringToFront();
        if (fileName) {
            g.setGlobalOpenDir(fileName);
            await g.chdir(fileName);
            return c.importCommands.flattenOutline(fileName);
        }
    }
    //@+node:felix.20220105210716.25: *4* c_file.flattenOutlineToNode
    @commander_command(
        'flatten-outline-to-node',
        'Append the body text of all descendants of the selected node to the body text of the selected node.'
    )
    public flattenOutlineToNode(this: Commands): void {
        const c: Commands = this;
        const root: Position = this.p;
        const u: Undoer = this.undoer;

        if (!root.hasChildren()) {
            return;
        }

        const language: string = g.getLanguageAtPosition(c, root);

        let single: string;
        let start: string;
        let end: string;

        if (language) {
            [single, start, end] = g.set_delims_from_language(language);
        } else {
            [single, start, end] = ['#', '', ''];
        }
        const bunch: Bead = u.beforeChangeNodeContents(root);
        const aList: string[] = [];

        for (let p of root.subtree()) {
            if (single) {
                aList.push(`\n\n===== ${single} ${p.h}\n\n`);
            } else {
                aList.push(`\n\n===== ${start} ${p.h} ${end}\n\n`);
            }
            if (p.b.trim()) {
                const lines: string[] = g.splitLines(p.b);
                aList.push(...lines);
            }
        }

        root.b = root.b.trimEnd() + '\n' + aList.join('').trimEnd() + '\n';
        u.afterChangeNodeContents(root, 'flatten-outline-to-node', bunch);
    }
    //@+node:felix.20220105210716.26: *4* c_file.outlineToCWEB
    @commander_command(
        'outline-to-cweb',
        'Export the selected outline to an external file. The outline is represented in CWEB format.'
    )
    public async outlineToCWEB(this: Commands): Promise<unknown> {
        const c: Commands = this;

        const filetypes: [string, string][] = [
            ['CWEB files', '*.w'],
            ['Text files', '*.txt'],
            ['All files', '*'],
        ];

        const fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Outline To CWEB',
            filetypes,
            '.w'
        );
        c.bringToFront();
        if (fileName) {
            g.setGlobalOpenDir(fileName);
            await g.chdir(fileName);
            return c.importCommands.outlineToWeb(fileName, 'cweb');
        }
    }
    //@+node:felix.20220105210716.27: *4* c_file.outlineToNoweb
    @commander_command(
        'outline-to-noweb',
        'Export the selected outline to an external file. The outline is represented in noweb format.'
    )
    public async outlineToNoweb(this: Commands): Promise<unknown> {
        const c: Commands = this;

        const filetypes: [string, string][] = [
            ['Noweb files', '*.nw'],
            ['Text files', '*.txt'],
            ['All files', '*'],
        ];

        const fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Outline To Noweb',
            filetypes,
            '.nw'
        );
        c.bringToFront();
        if (fileName) {
            g.setGlobalOpenDir(fileName);
            await g.chdir(fileName);
            await c.importCommands.outlineToWeb(fileName, 'noweb');
            c.outlineToNowebDefaultFileName = fileName;
        }
        return;
    }
    //@+node:felix.20220105210716.28: *4* c_file.removeSentinels
    @commander_command(
        'remove-sentinels',
        'Convert one or more files, replacing the original files ' +
        'while removing any sentinels they contain.'
    )
    public async removeSentinels(this: Commands): Promise<unknown> {
        const c: Commands = this;

        const types: [string, string][] = [
            ['All files', '*'],
            ['C/C++ files', '*.c'],
            ['C/C++ files', '*.cpp'],
            ['C/C++ files', '*.h'],
            ['C/C++ files', '*.hpp'],
            ['Java files', '*.java'],
            ['Lua files', '*.lua'],
            ['Pascal files', '*.pas'],
            ['Python files', '*.py'],
        ];

        const names = await g.app.gui.runOpenFilesDialog(
            c,
            'Remove Sentinels',
            types,
            '.py',
        );
        c.bringToFront();
        if (names && names.length) {
            await g.chdir(names[0]);
            return c.importCommands.removeSentinelsCommand(names);
        }
    }
    //@+node:felix.20220105210716.29: *4* c_file.weave
    @commander_command(
        'weave',
        'Simulate a literate-programming weave operation by writing the outline to a text file.'
    )
    public async weave(this: Commands): Promise<unknown> {
        const c: Commands = this;

        const fileName = await g.app.gui.runSaveFileDialog(
            c,
            'Weave',
            [
                ['Text files', '*.txt'],
                ['All files', '*'],
            ],
            '.txt'
        );
        c.bringToFront();
        if (fileName) {
            g.setGlobalOpenDir(fileName);
            await g.chdir(fileName);
            return c.importCommands.weave(fileName);
        }
    }
    //@+node:felix.20220105210716.30: *3* Read/Write
    //@+node:felix.20220105210716.31: *4* c_file.readAtAutoNodes
    @commander_command(
        'read-at-auto-nodes',
        'Read all @auto nodes in the presently selected outline.' +
        'This command is not undoable.'
    )
    public async readAtAutoNodes(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = this.undoer;

        c.endEditing();
        c.init_error_dialogs();
        // const undoData: Bead = u.beforeChangeTree(p);
        await c.importCommands.readAtAutoNodes();
        // u.afterChangeTree(p, 'Read @auto Nodes', undoData);
        c.redraw();
        await c.raise_error_dialogs('read');
        return c.undoer.clearAndWarn('read-at-auto-nodes');
    }
    //@+node:felix.20220105210716.32: *4* c_file.readAtFileNodes
    @commander_command(
        'read-at-file-nodes',
        'Read all @file nodes in the presently selected outline.' +
        'This command is not undoable.'
    )
    public async readAtFileNodes(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = this.undoer;

        c.endEditing();
        // const undoData: Bead = u.beforeChangeTree(p);

        await c.atFileCommands.readAllSelected(p);
        // Force an update of the body pane.
        c.setBodyString(p, p.b); // Not a do-nothing!
        // u.afterChangeTree(p, 'Read @file Nodes', undoData);
        c.redraw();
        return c.undoer.clearAndWarn('read-at-file-nodes');
    }

    //@+node:felix.20220105210716.33: *4* c_file.readAtShadowNodes
    @commander_command(
        'read-at-shadow-nodes',
        'Read all @shadow nodes in the presently selected outline.' +
        'This command is not undoable.'
    )
    public async readAtShadowNodes(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = this.undoer;

        c.endEditing();
        c.init_error_dialogs();
        // const undoData: Bead = u.beforeChangeTree(p);
        await c.atFileCommands.readAtShadowNodes(p);
        // u.afterChangeTree(p, 'Read @shadow Nodes', undoData);
        c.redraw();
        await c.raise_error_dialogs('read');
        return c.undoer.clearAndWarn('read-at-shadow-nodes');
    }
    //@+node:felix.20220105210716.34: *4* c_file.readFileIntoNode
    @commander_command(
        'read-file-into-node',
        'Read a file into a single node.'
    )
    public async readFileIntoNode(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const u = c.undoer;
        const undoType: string = 'Read File Into Node';
        c.endEditing();
        const filetypes: [string, string][] = [
            ['All files', '*'],
            ['Python files', '*.py'],
            ['Leo files', '*.leojs *.leo'],
        ];
        let fileName = await g.app.gui.runOpenFileDialog(
            c,
            'Read File Into Node',
            filetypes,
            ''
        );
        if (!fileName) {
            return;
        }
        if (Array.isArray(fileName)) {
            fileName = fileName[0];
        }
        let s: string | undefined;
        let e: string | undefined;
        [s, e] = await g.readFileIntoString(fileName);
        if (s === undefined) {
            return;
        }
        await g.chdir(fileName);
        s = '@nocolor\n' + s;
        const w = c.frame.body.wrapper;
        const undoData = u.beforeInsertNode(c.p);
        const p = c.p.insertAfter();
        p.setHeadString('@read-file-into-node ' + fileName);
        p.setBodyString(s);
        u.afterInsertNode(p, undoType, undoData);
        w.setAllText(s);
        return c.redraw(p);
    }
    //@+node:felix.20220105210716.36: *4* c_file.writeFileFromNode
    @commander_command(
        'write-file-from-node',
        'If node starts with @read-file-into-node, use the full path name ' +
        'in the headline. Otherwise, prompt for a file name.'
    )
    public async writeFileFromNode(this: Commands): Promise<unknown> {
        const c: Commands = this;
        let p: Position = this.p;
        c.endEditing();
        let h: string = p.h.trimEnd();
        let s: string = p.b;
        const tag: string = '@read-file-into-node';
        let fileName: string | undefined;
        if (h.startsWith(tag)) {
            fileName = h.slice(tag.length).trim();
        } else {
            fileName = undefined;
        }
        if (!fileName) {
            fileName = await g.app.gui.runSaveFileDialog(
                c,
                'Write File From Node',
                [
                    ['All files', '*'],
                    ['Python files', '*.py'],
                    ['Leo files', '*.leojs *.leo'],
                ],
                ''
            );
        }
        if (fileName) {
            try {
                await g.chdir(fileName);
                if (s.startsWith('@nocolor\n')) {
                    s = s.slice('@nocolor\n'.length);
                }
                const w_uri = g.makeVscodeUri(fileName);
                const writeData = Buffer.from(s, 'utf8');
                await vscode.workspace.fs.writeFile(w_uri, writeData);
                return g.blue('wrote:', fileName);
            } catch (iOError) {
                g.error('can not write %s', fileName);
            }
        }
    }
    //@+node:felix.20230407210935.1: *4* c_file.writeFileFromSubtree
    @commander_command(
        'write-file-from-subtree',
        'Write the entire tree from the selected node as text to a file. ' +
        'If node starts with @read-file-into-node, use the full path name in the headline. ' +
        'Otherwise, prompt for a file name.'
    )
    public async writeFileFromSubtree(this: Commands): Promise<void> {
        const c: Commands = this;
        const p: Position = this.p;
        c.endEditing();
        const h = p.h.trimStart();
        let s = '';
        for (const p1 of p.self_and_subtree()) {
            s += p1.b + '\n';
        }
        let fileName = '';
        const tag = '@read-file-into-node';
        if (h.startsWith(tag)) {
            fileName = h.substring(tag.length).trim();
        } else {
            fileName = '';
        }
        if (!fileName) {
            fileName = await g.app.gui.runSaveFileDialog(
                c,
                'Write File From Node',
                [
                    ['All files', '*'],
                    ['Python files', '*.py'],
                    ['Leo files', '*.leojs *.leo'],
                ],
                ''
            );
        }
        if (fileName) {
            try {
                // with open(fileName, 'w') as f:
                await g.chdir(fileName);
                if (s.startsWith('@nocolor\n')) {
                    s = s.substring('@nocolor\n'.length);
                }
                // f.write(s)
                // f.flush()
                const w_uri = g.makeVscodeUri(fileName);
                const writeData = Buffer.from(s, 'utf8');
                await vscode.workspace.fs.writeFile(w_uri, writeData);
                g.blue('wrote:', fileName);
            } catch (IOError) {
                g.error('can not write %s', fileName);
            }
        }
    }
    //@+node:felix.20220105210716.37: *3* Recent Files
    //@+node:felix.20220105210716.38: *4* c_file.cleanRecentFiles
    @commander_command(
        'clean-recent-files',
        "Remove items from the recent files list that no longer exist. " +
        "This almost never does anything because Leo's startup logic removes " +
        "nonexistent files from the recent files list."
    )
    public async cleanRecentFiles(this: Commands): Promise<void> {
        const c: Commands = this;
        await g.app.recentFilesManager.cleanRecentFiles(c);
    }
    //@+node:felix.20220105210716.39: *4* c_file.clearRecentFiles

    @commander_command('clear-recent-files', 'Clear the recent files list, then add the present file.')
    public async clearRecentFiles(this: Commands): Promise<void> {
        const c: Commands = this;
        await g.app.recentFilesManager.clearRecentFiles(c);
    }
    //@+node:felix.20220105210716.40: *4* c_file.editRecentFiles

    @commander_command('edit-recent-files', 'Opens recent files list in a new node for editing.')
    public editRecentFiles(this: Commands): void {

        const c: Commands = this;

        g.app.recentFilesManager.editRecentFiles(c);
    }
    //@+node:felix.20240209220106.1: *4* c._file.showRecentFiles
    @commander_command('show-recent-files', 'Open a file from the recent files list .')
    public async showRecentFiles(): Promise<void> {
        await g.app.gui.showRecentLeoFiles();
    }
    //@+node:felix.20220105210716.42: *4* c_file.sortRecentFiles

    @commander_command('sort-recent-files', 'Sort the recent files list.')
    public async sortRecentFiles(this: Commands): Promise<void> {
        const c: Commands = this;

        await g.app.recentFilesManager.sortRecentFiles(c);
    }
    //@+node:felix.20220105210716.43: *4* c_file.writeEditedRecentFiles

    @commander_command('write-edited-recent-files', 'Write content of "edit_headline" node as recentFiles and recreates menus.')
    public async writeEditedRecentFiles(this: Commands): Promise<void> {
        const c: Commands = this;
        await g.app.recentFilesManager.writeEditedRecentFiles(c);
    }
    //     g.app.recentFilesManager.writeEditedRecentFiles(c)
    //@-others
}
//@-others
//@-leo
