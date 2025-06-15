//@+leo-ver=5-thin
//@+node:felix.20211212162008.1: * @file src/core/leoExternalFiles.ts
//@+<< imports >>
//@+node:felix.20220102165214.1: ** << imports >>
import * as vscode from 'vscode';
import * as path from 'path';
import * as md5 from 'md5';
import * as os from 'os';
import * as g from './leoGlobals';
import { LeoFrame } from './leoFrame';
import { Position } from './leoNodes';
import { Commands } from './leoCommands';
//@-<< imports >>
//@+others
//@+node:felix.20211226234245.1: ** class ExternalFile
/**
 * A class holding all data about an external file.
 */
export class ExternalFile {
    public c: Commands;
    public ext: string;
    public p: Position | false;
    public path: string;
    public time: number;

    /**
     * Ctor for ExternalFile class.
     */
    constructor(
        c: Commands,
        ext: string,
        p: Position,
        p_path: string,
        time: number
    ) {
        this.c = c;
        this.ext = ext;
        this.p = p && p.__bool__() && p.copy();
        // The nearest @<file> node.
        this.path = p_path;
        this.time = time; // Used to inhibit endless dialog loop.
        // See efc.idle_check_open_with_file.
    }

    // = () : trick for toString as per https://stackoverflow.com/a/35361695/920301
    public toString = (): string => {
        return `<ExternalFile: ${this.time} ${g.shortFilename(this.path)}>`;
    };

    //@+others
    //@+node:felix.20211226234245.2: *3* ef.shortFileName
    public shortFileName(): string {
        return g.shortFilename(this.path);
    }
    //@+node:felix.20211226234245.3: *3* ef.exists
    /**
     * Return True if the external file still exists.
     */
    public exists(): Promise<boolean | vscode.FileStat> {
        return g.os_path_exists(this.path);
    }
    //@-others
}
//@+node:felix.20211226234316.1: ** class ExternalFilesController
/**
 *
 * A class tracking changes to external files:
 *
 *  - temp files created by open-with commands.
 *  - external files corresponding to @file nodes.
 *
 * This class raises a dialog when a file changes outside of Leo.
 *
 *  **Naming conventions**:
 *
 *  - d is always a dict created by the @open-with logic.
 *    This dict describes *only* how to open the file.
 *
 *  - ef is always an ExternalFiles instance.
 */
export class ExternalFilesController {
    public checksum_d: { [key: string]: string }; // Keys are full paths, values are file checksums.
    public enabled_d: Map<Commands, boolean>;
    public files: ExternalFile[];
    public has_changed_d: Map<Commands, boolean>;
    public unchecked_commanders: Commands[];
    public unchecked_files: ExternalFile[];
    public _time_d: { [key: string]: number }; // Keys are full paths, values are modification times.
    public yesno_all_answer: string | undefined; // answer, 'yes-all', or 'no-all'
    public on_idle_count = 0;
    public files_busy = false; // If this flag is set, on_idle will be skiped.
    public onIdlePromise: Promise<void>;
    private resolveOnIdle!: () => void;

    //@+others
    //@+node:felix.20230503004807.2: *3* efc.ctor
    /**
     * Ctor for ExternalFiles class.
     */
    constructor() {
        this.checksum_d = {}; // Keys are full paths, values are file checksums.
        // For efc.on_idle.
        // Keys are commanders.
        // Values are cached @bool check-for-changed-external-file settings.
        this.enabled_d = new Map();
        // List of ExternalFile instances created by this.open_with.
        this.files = [];
        // Keys are commanders. Values are bools.
        // Used only to limit traces.
        this.has_changed_d = new Map();
        // Copy of g.app.commanders()
        this.unchecked_commanders = [];
        // Copy of self file. Only one files is checked at idle time.
        this.unchecked_files = [];
        // Keys are full paths, values are modification times.
        // DO NOT alter directly, use set_time(path) and
        // get_time(path), see set_time() for notes.
        this._time_d = {};
        this.yesno_all_answer = undefined; // answer, 'yes-all', or 'no-all'
        // Initialize the promise and its resolve function
        this.onIdlePromise = new Promise((resolve) => {
            this.resolveOnIdle = resolve;
            this.resolveOnIdle(); // Starts Resolved!
        });

        g.app.idleTimeManager.add_callback(this.on_idle.bind(this));
    }
    //@+node:felix.20230503004807.3: *3* efc.entries
    //@+node:felix.20230503004807.4: *4* efc.check_overwrite (called from c.checkTimeStamp)
    /**
     * Implements c.checkTimeStamp.
     *
     * Return True if the file given by fn has not been changed
     * since Leo read it or if the user agrees to overwrite it.
     */
    public async check_overwrite(
        c: Commands,
        p_path: string
    ): Promise<boolean> {

        // if (c.sqlite_connection && c.mFileName === p_path) {
        //     console.log('TODO : VERIFY THAT check_overwrite IS VALID FOR .db FILES');


        //     // sqlite database file is never actually overwritten by Leo
        //     // so no need to check its timestamp. It is modified through
        //     // sqlite methods.
        //     return true;
        // }

        // has_changed handles all special cases.
        if (await this.has_changed(p_path)) {
            const val = await this.ask(c, p_path);
            return ['yes', 'yes-all'].includes(val);
        }
        return true;
    }
    //@+node:felix.20230503004807.5: *4* efc.destroy_frame
    /**
     * Close all "Open With" files associated with frame.
     * Called by g.app.destroyWindow.
     */
    public async destroy_frame(frame: LeoFrame): Promise<void> {
        let files = this.files.filter((ef) => ef.c.frame === frame);
        let paths = files.map((ef) => ef.path);
        for (const ef of files) {
            await this.destroy_temp_file(ef);
        }
        this.files = this.files.filter((z) => !paths.includes(z.path));
    }
    //@+node:felix.20230503004807.6: *4* efc.find_path_for_node (called from vim.py)
    /**
     * Find the path corresponding to node p.
     * called from vim.py.
     */
    public find_path_for_node(p: Position): string | undefined {
        let w_path: string | undefined;
        for (const ef of this.files) {
            if (ef.p && ef.p.__bool__() && ef.p.v === p.v) {
                w_path = ef.path;
                break;
            }
        }
        return w_path;
    }
    //@+node:felix.20230503004807.7: *4* efc.on_idle & helpers

    /**
     * Check for changed open-with files and all external files in commanders
     * for which @bool check_for_changed_external_file is True.
     */
    public async on_idle(): Promise<void> {
        //
        // #1240: Note: The "asking" dialog prevents idle time.
        //
        if (this.files_busy || !g.app || g.app.killed || g.app.restarting || g.app.reverting) {
            // #1240.
            return;
        }

        // Start by replacing the onIdle Promise
        this.onIdlePromise = new Promise((resolve) => {
            this.resolveOnIdle = resolve;
        });

        this.on_idle_count += 1;
        let c: Commands | undefined;
        // New in Leo 5.7: always handle delayed requests.
        if (g.app.windowList && g.app.windowList.length) {
            // c = g.app.log && g.app.log?.c; // ? Needed ?
            if (c) {
                c.outerUpdate();
            }
        }
        // Fix #262: Improve performance when @bool check-for-changed-external-files is True.
        if (this.unchecked_files && this.unchecked_files.length) {
            // Check all external files.
            while (this.unchecked_files.length) {
                const ef = this.unchecked_files.pop()!; // #1959: ensure progress.
                await this.idle_check_open_with_file(c, ef);
            }
        } else if (this.unchecked_commanders.length) {
            // Check the next commander for which
            // @bool check_for_changed_external_file is True.
            c = this.unchecked_commanders.pop();
            await this.idle_check_commander(c!);
        } else {
            // Add all commanders for which
            // @bool check_for_changed_external_file is True.
            this.unchecked_commanders = g.app
                .commanders()
                .filter((z) => this.is_enabled(z));

            // this.unchecked_files = this.files.filter(z=>z.exists());
            this.unchecked_files = [];
            for (const file of this.files) {
                if (await file.exists()) {
                    this.unchecked_files.push(file);
                }
            }
        }
        this.resolveOnIdle(); // Done!
    }
    //@+node:felix.20230503004807.8: *5* efc.idle_check_commander
    /**
     * Check all external files corresponding to @<file> nodes in c for
     * changes.
     */
    public async idle_check_commander(c: Commands): Promise<void> {
        // #1240: Check the .leo file itself.
        await this.idle_check_leo_file(c);
        //
        // #1100: always scan the entire file for @<file> nodes.
        // #1134: Nested @<file> nodes are no longer valid, but this will do no harm.
        let state = 'no';
        for (const p of c.all_unique_positions()) {
            if (!p.isAnyAtFileNode()) {
                continue;
            }
            const w_path = c.fullPath(p);
            const w_hasChanged = await this.has_changed(w_path);
            if (!w_hasChanged) {
                continue;
            }
            // Prevent further checks for path.
            await this.set_time(w_path);
            // Check file.
            if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()) {
                // #1081: issue a warning.
                this.warn(c, w_path, p);
                continue;
            }
            if (['yes', 'no'].includes(state)) {
                state = await this.ask(c, w_path, p);
            }
            if (['yes', 'yes-all'].includes(state)) {
                const old_p = c.p;  // To restore selection if refresh option set to yes-all & is descendant of at-file
                c.redraw(p); // this selects p.
                await c.refreshFromDisk();

                // ! LEOJS : KEEP SELECTION ON CURRENT NODE IF CHILD OF AT-ANY-FILE REFRESHED !
                // TODO : Add config option in Leo for this!
                if (true) {
                    if (c.positionExists(old_p) && c.p.isAncestorOf(old_p)) {
                        c.selectPosition(old_p);
                    }
                }

                c.redraw();
                // ! LEOJS : FORCE GUI REFRESH AFTER A refreshFromDisk COMMAND !
                g.app.gui.fullRefresh(true);
            }
        }
    }
    //@+node:felix.20230503004807.9: *5* efc.idle_check_leo_file
    /**
     * Check c's .leo file for external changes.
     */
    public async idle_check_leo_file(c: Commands): Promise<void> {
        const w_path = c.fileName();
        const w_hasChanged = await this.has_changed(w_path);
        if (!w_hasChanged) {
            return;
        }
        // Always update the path & time to prevent future warnings.
        await this.set_time(w_path);
        // #1888:
        const val = await this.ask(c, w_path);
        if (['yes', 'yes-all'].includes(val)) {
            // Do a complete restart of Leo.
            await g.app.loadManager!.revertCommander(c);
            // ! LEOJS : FORCE GUI REFRESH AFTER A Change of opened document!
            g.app.gui.fullRefresh(true);
            g.es_print(`reloaded ${w_path}`);
        }
    }
    //@+node:felix.20230503004807.10: *5* efc.idle_check_open_with_file & helper
    /**
     * Update the open-with node given by ef.
     */
    public async idle_check_open_with_file(
        c: Commands | undefined,
        ef: ExternalFile
    ): Promise<void> {
        g.assert(ef instanceof ExternalFile, ef.toString());
        if (!ef.path) {
            return;
        }
        const w_exists = await g.os_path_exists(ef.path);
        if (!w_exists) {
            return;
        }
        const time = await this.get_mtime(ef.path);
        if (!time || time === ef.time) {
            return;
        }
        // Inhibit endless dialog loop.
        ef.time = time;
        // #1888: Handle all possible user responses to this.ask.
        const val = await this.ask(c!, ef.path, (ef.p as Position).copy());
        if (val === 'yes-all') {
            for (const ef of this.unchecked_files) {
                await this.update_open_with_node(ef);
            }
            this.unchecked_files = [];
        } else if (val === 'no-all') {
            this.unchecked_files = [];
        } else if (val === 'yes') {
            await this.update_open_with_node(ef);
        } else if (val === 'no') {
            // pass
        }
    }
    //@+node:felix.20230503004807.11: *6* efc.update_open_with_node
    /**
     * Update the body text of ef.p to the contents of ef.path.
     */
    public async update_open_with_node(ef: ExternalFile): Promise<void> {
        g.assert(ef instanceof ExternalFile, ef.toString());
        const c = ef.c;
        const p = (ef.p as Position).copy();
        g.blue(`updated ${p.h}`);
        let [s, e] = await g.readFileIntoString(ef.path);
        p.b = s!;
        if (c.config.getBool('open-with-goto-node-on-update')) {
            c.selectPosition(p);
        }
        if (c.config.getBool('open-with-save-on-update')) {
            await c.save();
        } else {
            p.setDirty();
            c.setChanged();
        }
    }
    //@+node:felix.20230503004807.12: *4* efc.open_with & helpers
    /**
     * Called by c.openWith to handle items in the Open With... menu.
     *
     * 'd' a dict created from an @openwith settings node with these keys:
     *
     *  'args':     the command-line arguments to be used to open the file.
     *  'ext':      the file extension.
     *  'kind':     the method used to open the file, such as subprocess.Popen.
     *  'name':     menu label (used only by the menu code).
     *  'p':        the nearest @<file> node, or None.
     *  'shortcut': menu shortcut (used only by the menu code).
     */
    // public open_with(c: Commands, d: {[key: string]: any}) : void {

    //     try{
    //         let ext = d['ext'];
    //         if (!g.doHook('openwith1', {'c':c, 'p':c.p, 'v':c.p.v, 'd':d})){
    //             const root: Position = d['p'];
    //             let w_path;
    //             let p;
    //             if (root && root.__bool__()){
    //                 // Open the external file itself.
    //                 w_path = c.fullPath(root);  // #1914.
    //                 this.open_file_in_external_editor(c, d, w_path);
    //             }else{
    //                 // Open a temp file containing just the node.
    //                 p = c.p;
    //                 ext = this.compute_ext(c, p, ext);
    //                 w_path = this.compute_temp_file_path(c, p, ext);
    //                 if (w_path){
    //                     this.remove_temp_file(p, w_path);
    //                     this.create_temp_file(c, ext, p);
    //                     this.open_file_in_external_editor(c, d, w_path);
    //                 }
    //             }
    //         }
    //         g.doHook('openwith2', {'c':c, 'p':c.p, 'v':c.p.v, 'd':d});
    //     } catch (exception){
    //         g.es('unexpected exception in c.openWith');
    //         g.es_exception(exception);
    //     }
    // }
    //@+node:felix.20230503004807.13: *5* efc.compute_ext
    /**
     * Return the file extension to be used in the temp file.
     */
    public compute_ext(c: Commands, p: Position, ext: string): string {
        if (ext) {
            if (ext.startsWith("'")) {
                ext = ext.replace(/^'+/, '');
                ext = ext.replace(/'+$/, '');
            }
            if (ext.startsWith('"')) {
                ext = ext.replace(/^"+/, '');
                ext = ext.replace(/"+$/, '');
            }
        }
        if (!ext) {
            // if node is part of @<file> tree, get ext from file name
            for (const p2 of p.self_and_parents(false)) {
                if (p2.isAnyAtFileNode()) {
                    const fn = p2.h.split(' ', 1)[1];
                    ext = g.os_path_splitext(fn)[1];
                    break;
                }
            }
        }
        if (!ext) {
            const language = c.getLanguage(p);
            ext = g.app.language_extension_dict[language];
        }
        if (!ext) {
            ext = '.txt';
        }
        if (ext[0] !== '.') {
            ext = '.' + ext;
        }

        return ext;
    }
    //@+node:felix.20230503004807.14: *5* efc.compute_temp_file_path & helpers
    /**
     * Return the path to the temp file for p and ext.
     */
    public async compute_temp_file_path(
        c: Commands,
        p: Position,
        ext: string
    ): Promise<string> {
        let w_path;
        if (c.config.getBool('open-with-clean-filenames')) {
            w_path = await this.clean_file_name(c, ext, p);
        } else {
            w_path = await this.legacy_file_name(c, ext, p);
        }
        if (!w_path) {
            g.error('c.temp_file_path failed');
        }
        return w_path;
    }
    //@+node:felix.20230503004807.15: *6* efc.clean_file_name
    /**
     * Compute the file name when subdirectories mirror the node's hierarchy in Leo.
     */
    public async clean_file_name(
        c: Commands,
        ext: string,
        p: Position
    ): Promise<string> {
        const use_extensions = c.config.getBool(
            'open-with-uses-derived-file-extensions'
        );
        const ancestors = [];
        let found = false;
        for (const p2 of p.self_and_parents(false)) {
            let h = p2.anyAtFileNodeName();
            if (!h) {
                h = p2.h; // Not an @file node: use the entire header
            } else if (use_extensions && !found) {
                // Found the nearest ancestor @<file> node.
                found = true;
                let [base, ext2] = g.os_path_splitext(h);
                if (p2.__eq__(p)) {
                    h = base;
                }
                if (ext2) {
                    ext = ext2;
                }
            }
            ancestors.push(g.sanitize_filename(h));
        }

        // ! NO 'id' in javascript!
        // The base directory is <tempdir>/Leo<id(v)>.
        // ancestors.push("Leo" + str(id(p.v)));
        ancestors.push('Leo' + p.v.gnx);

        // Build temporary directories.
        // let td = os.path.abspath(tempfile.gettempdir());
        let td = path.resolve(os.tmpdir());

        while (ancestors.length > 1) {
            td = g.PYTHON_os_path_join(td, ancestors.pop()!);
            const w_exists = await g.os_path_exists(td);
            if (!w_exists) {
                const w_uri = g.makeVscodeUri(td);
                await vscode.workspace.fs.createDirectory(w_uri);
                // os.mkdir(td);
            }
        }
        // Compute the full path.
        const w_name = ancestors.pop() + ext;
        const w_path = g.PYTHON_os_path_join(td, w_name);
        return w_path;
    }
    //@+node:felix.20230503004807.16: *6* efc.legacy_file_name
    /**
     * Compute a legacy file name for unsupported operating systems.
     */
    public async legacy_file_name(
        c: Commands,
        ext: string,
        p: Position
    ): Promise<string> {
        let leoTempDir;
        try {
            // leoTempDir = getpass.getuser() + "_" + "Leo";
            // ! LEOJS -> use g.app.leoID instead
            leoTempDir = g.app.leoID + '_' + 'Leo';
        } catch (exception) {
            leoTempDir = 'LeoTemp';
            g.es('Could not retrieve your user name.');
            g.es(`Temporary files will be stored in: ${leoTempDir}`);
        }

        const td = g.PYTHON_os_path_join(path.resolve(os.tmpdir()), leoTempDir);
        const w_exists = await g.os_path_exists(td);
        if (!w_exists) {
            const w_uri = g.makeVscodeUri(td);
            await vscode.workspace.fs.createDirectory(w_uri);
            //os.mkdir(td);
        }

        // ! NO 'id' in javascript!
        // TODO : TEST IF OTHER STRING IS OK!
        const name = g.sanitize_filename(p.h) + '_' + p.v.gnx + ext;
        const w_path = g.PYTHON_os_path_join(td, name);
        return w_path;
    }
    //@+node:felix.20230503004807.17: *5* efc.create_temp_file
    /**
     * Create the file used by open-with if necessary.
     * Add the corresponding ExternalFile instance to self.files
     */
    public async create_temp_file(
        c: Commands,
        ext: string,
        p: Position
    ): Promise<string | undefined> {
        const w_path = await this.compute_temp_file_path(c, p, ext);
        const exists = await g.os_path_exists(w_path);
        // Compute encoding and s.
        let encoding = c.getEncoding(p);
        const s = g.toEncodedString(p.b, encoding, true);
        // Write the file *only* if it doesn't exist.
        // No need to read the file: recomputing s above suffices.
        if (!exists) {
            try {
                // with open(w_path, 'wb') as f
                //     f.write(s)
                //     f.flush()

                const w_uri = g.makeVscodeUri(w_path);
                // s is already Uint8Array buffer
                await vscode.workspace.fs.writeFile(w_uri, s);
            } catch (IOError) {
                g.error(`exception creating temp file: ${w_path}`);
                g.es_exception(IOError);
                return undefined;
            }
        }
        // Add or update the external file entry.
        const time = await this.get_mtime(w_path);
        // this.files = [z for z in this.files if z.path !== w_path];
        this.files = this.files.filter((z) => z.path !== w_path);
        this.files.push(new ExternalFile(c, ext, p, w_path, time));
        return w_path;
    }
    //@+node:felix.20230503004807.18: *5* efc.open_file_in_external_editor
    // public open_file_in_external_editor(self, c: Commands, d: Dict[str, Any], fn: str, testing: bool = False): string
    //     """
    //     Open a file fn in an external editor.

    //     This will be an entire external file, or a temp file for a single node.

    //     d is a dictionary created from an @openwith settings node.

    //         'args':     the command-line arguments to be used to open the file.
    //         'ext':      the file extension.
    //         'kind':     the method used to open the file, such as subprocess.Popen.
    //         'name':     menu label (used only by the menu code).
    //         'p':        the nearest @<file> node, or None.
    //         'shortcut': menu shortcut (used only by the menu code).
    //     """
    //     testing = testing or g.unitTesting
    //     arg_tuple: List[str] = d.get('args', [])
    //     arg = ' '.join(arg_tuple)
    //     kind: Callable = d.get('kind')
    //     try
    //         // All of these must be supported because they
    //         // could exist in @open-with nodes.
    //         command = '<no command>'
    //         if kind in ('os.system', 'os.startfile')
    //             // New in Leo 5.7:
    //             // Use subProcess.Popen(..., shell=True)
    //             c_arg = self.join(arg, fn)
    //             if not testing
    //                 try
    //                     subprocess.Popen(c_arg, shell=True)
    //                 catch OSError
    //                     g.es_print('c_arg', repr(c_arg))
    //                     g.es_exception(OSError)
    //         else if kind == 'exec'
    //             g.es_print('open-with exec no longer valid.')
    //         else if kind == 'os.spawnl'
    //             filename = g.os_path_basename(arg)
    //             command = f"os.spawnl({arg},{filename},{fn})"
    //             if not testing:
    //                 os.spawnl(os.P_NOWAIT, arg, filename, fn)
    //         else if kind == 'os.spawnv'
    //             filename = os.path.basename(arg_tuple[0])
    //             vtuple = arg_tuple[1:]
    //             // add the name of the program as the first argument.
    //             // Change suggested by Jim Sizelove.
    //             vtuple.insert(0, filename)
    //             vtuple.append(fn)
    //             command = f"os.spawnv({vtuple})"
    //             if not testing:
    //                 os.spawnv(os.P_NOWAIT, arg[0], vtuple)  // ???
    //         else if kind == 'subprocess.Popen':
    //             c_arg = self.join(arg, fn)
    //             command = f"subprocess.Popen({c_arg})"
    //             if not testing:
    //                 try:
    //                     subprocess.Popen(c_arg, shell=True)
    //                 catch OSError
    //                     g.es_print('c_arg', repr(c_arg))
    //                     g.es_exception(OSError)
    //         else if callable(kind)
    //             // Invoke openWith like this:
    //             // c.openWith(data=[func,None,None])
    //             // func will be called with one arg, the filename
    //             command = f"{kind}({fn})"
    //             if not testing:
    //                 kind(fn)
    //         else:
    //             command = 'bad command:' + str(kind)
    //             if not testing:
    //                 g.trace(command)
    //         return command  // for unit testing.
    //     catch exception:
    //         g.es('exception executing open-with command:', command)
    //         g.es_exception(exception)
    //         return f"oops: {command}"
    //@+node:felix.20230503004807.19: *5* efc.remove_temp_file
    /**
     * Remove any existing *temp* file for p and path, updating this.files.
     */
    public async remove_temp_file(p: Position, p_path: string): Promise<void> {
        for (const ef of this.files) {
            if (p_path && p_path === ef.path && ef.p && p.v === ef.p.v) {
                await this.destroy_temp_file(ef);
                this.files = this.files.filter((z) => z !== ef);
                return;
            }
        }
    }

    //@+node:felix.20230503004807.20: *4* efc.shut_down
    /**
     * Destroy all temporary open-with files.
     * This may fail if the files are still open.
     *
     * Called by g.app.finishQuit.
     */
    public async shut_down(): Promise<void> {
        // Dont call g.es or g.trace! The log stream no longer exists.
        for (const ef of [...this.files]) {
            await this.destroy_temp_file(ef);
        }

        this.files = [];
    }
    //@+node:felix.20230503004807.21: *3* efc.utilities
    // pylint: disable=no-value-for-parameter
    //@+node:felix.20230503004807.22: *4* efc.ask
    /**
     * Ask user whether to overwrite an @<file> tree.
     *
     * Return one of ('yes', 'no', 'yes-all', 'no-all')
     */
    public async ask(
        c: Commands,
        p_path: string,
        p?: Position
    ): Promise<string> {
        if (g.unitTesting) {
            return '';
        }
        if (!g.app.commanders().includes(c)) {
            return '';
        }
        const is_leo = p_path.endsWith('.db') || p_path.endsWith('.leo') || p_path.endsWith('.leojs');
        const is_external_file = !is_leo;

        // check with leoServer's config first.
        if (is_external_file) {
            // * g.app.gui.config.defaultReloadIgnore DEFINED IN PACKAGE.JSON AS:
            // "enum": [
            //     "none",
            //     "yes-all",
            //     "no-all"
            //   ],
            //   "enumDescriptions": [
            //     "Choose each time",
            //     "Reload All",
            //     "Ignore All"
            //   ]

            if (g.app.gui.config && g.app.gui.config.defaultReloadIgnore) {
                const checkConfig =
                    g.app.gui.config.defaultReloadIgnore.toLowerCase();
                if (!checkConfig.includes('none')) {
                    let w_message = 'Changes to external files were detected.';
                    if (checkConfig.includes('yes')) {
                        void vscode.window.showInformationMessage(
                            w_message + ' Nodes refreshed.'
                        );
                        return 'yes-all';
                    } else {
                        void vscode.window.showInformationMessage(
                            w_message + ' They were ignored.'
                        );
                        return 'no-all';
                    }
                }
            }
        }

        //
        // Create the message.
        let message1 = `${p_path}\nhas changed outside Leo.\n\n`;
        let message2 = "";
        if (is_leo) {
            message2 = 'Reload this outline?';
        } else if (p && p.__bool__()) {
            message2 = `Reload ${p.h}?`;
        } else {
            let w_found = false;
            for (const ef of this.files) {
                if (ef.path === p_path) {
                    message2 = `Reload ${ef.p ? ef.p.h : 'no p'}?`;
                    w_found = true;
                    break;
                }
            }

            if (!w_found) {
                message2 = `Reload ${p_path}?`;
            }
        }
        //
        // #1240: Note: This dialog prevents idle time.
        const result = await g.app.gui.runAskYesNoDialog(
            c,
            message2!,
            message1 + message2,
            is_external_file,
            is_external_file
        );
        //
        // #1961. Re-init the checksum to suppress concurrent dialogs.
        this.checksum_d[p_path] = await this.checksum(p_path);
        //
        // #1888: return one of ('yes', 'no', 'yes-all', 'no-all')
        return result ? result.toLowerCase() : 'no';
    }
    //@+node:felix.20230503004807.23: *4* efc.checksum
    /**
     * Return the checksum of the file at the given path.
     */
    public async checksum(p_path: string): Promise<string> {
        // import hashlib
        // #1454: Explicitly close the file.
        // with open(path, 'rb') as f
        //     s = f.read()

        const w_uri = g.makeVscodeUri(p_path);
        const s = await vscode.workspace.fs.readFile(w_uri);

        // return hashlib.md5(s).hexdigest()
        return md5(s);
    }
    //@+node:felix.20230503004807.24: *4* efc.destroy_temp_file
    /**
     * Destroy the *temp* file corresponding to ef, an ExternalFile instance.
     */
    public async destroy_temp_file(ef: ExternalFile): Promise<void> {
        // Do not use g.trace here.
        const w_exists = await g.os_path_exists(ef.path);
        if (ef.path && w_exists) {
            try {
                const w_uri = g.makeVscodeUri(ef.path);
                await vscode.workspace.fs.delete(w_uri, { recursive: true });
                // os.remove(ef.path)
            } catch (exception) {
                // pass
            }
        }
    }
    //@+node:felix.20230503004807.25: *4* efc.get_mtime
    /**
     * Return the modification time for the path.
     */
    public get_mtime(p_path: string): Promise<number> {
        return g.os_path_getmtime(g.os_path_realpath(p_path));
    }

    //@+node:felix.20230503004807.26: *4* efc.get_time
    /**
     * return timestamp for path
     *
     * see set_time() for notes
     */
    public get_time(p_path: string): number {
        return this._time_d[g.os_path_realpath(p_path)];
    }
    //@+node:felix.20230503004807.27: *4* efc.has_changed
    /**
     * Return True if the file at path has changed outside of Leo.
     */
    public async has_changed(p_path: string): Promise<boolean> {
        if (!p_path) {
            return false;
        }
        const w_exists = await g.os_path_exists(p_path);
        if (!w_exists) {
            return false;
        }
        const w_isDir = await g.os_path_isdir(p_path);
        if (w_isDir) {
            return false;
        }

        // ! TEMP FIX UNTIL https://github.com/leo-editor/leo-editor/pull/3554 IS READY
        if (p_path.endsWith('.db')) {
            return false;
        }

        //
        // First, check the modification times.
        const old_time = this.get_time(p_path);
        const new_time = await this.get_mtime(p_path);
        if (!old_time) {
            // Initialize.
            await this.set_time(p_path, new_time);
            return false;
        }
        if (old_time === new_time) {
            return false;
        }
        //
        // Check the checksums *only* if the mod times don't match.
        const old_sum = this.checksum_d[p_path];
        const new_sum = await this.checksum(p_path);
        if (new_sum === old_sum) {
            // The modtime changed, but it's contents didn't.
            // Update the time, so we don't keep checking the checksums.
            // Return false so we don't prompt the user for an update.
            await this.set_time(p_path, new_time, true);
            return false;
        }
        // The file has really changed.
        g.assert(old_time, p_path);
        return true;
    }
    //@+node:felix.20230503004807.28: *4* efc.is_enabled
    /**
     * Return the cached @bool check_for_changed_external_file setting.
     */
    public is_enabled(c: Commands): boolean {
        const d = this.enabled_d;
        let val = d.get(c);
        if (val == null) {
            val = c.config.getBool('check-for-changed-external-files', false);
            d.set(c, val);
        }
        return val;
    }
    //@+node:felix.20230503004807.29: *4* efc.join
    /**
     * Return s1 + ' ' + s2
     */
    public join(s1: string, s2: string): string {
        return `${s1} ${s2}`;
    }

    //@+node:felix.20230503004807.30: *4* efc.set_time
    /**
     * Implements c.setTimeStamp.
     *
     * Update the timestamp for path.
     *
     * NOTE: file paths with symbolic links occur with and without those links
     * resolved depending on the code call path.  This inconsistency is
     * probably not Leo's fault but an underlying Python issue.
     * Hence the need to call realpath() here.
     */
    public async set_time(p_path: string, new_time?: number, skip_checksum?: boolean): Promise<void> {
        let t = new_time;
        if (!t) {
            t = await this.get_mtime(p_path);
        }
        this._time_d[g.os_path_realpath(p_path)] = t;
        if (!skip_checksum) {
            // To prevent false positives when timestamp (not content) is modified by external program
            this.checksum_d[p_path] = await this.checksum(p_path);
        }
    }
    //@+node:felix.20230503004807.31: *4* efc.warn
    /**
     * Warn that an @asis or @nosent node has been changed externally.
     *
     * There is *no way* to update the tree automatically.
     */
    public warn(c: Commands, p_path: string, p: Position): void {
        if (g.unitTesting || !g.app.commanders().includes(c)) {
            return;
        }
        if (!p || !p.__bool__()) {
            g.trace('NO P');
            return;
        }

        const pathName = g.shortFileName(p_path);
        const kind = p.h.startsWith('@asis') ? '@asis' : '@nosent';

        let message = `${pathName} has changed outside Leo.\n\n`;
        message += `An ${kind} node created this file.\n\n`;

        if (kind === '@nosent') {
            message += '@nosent nodes cannot be updated from disk.\n';
        } else if (kind === '@asis') {
            message +=
                'Updating from disk would remove its outline structure.\n' +
                'Proceed with refresh-from-disk only if this is intended.\n';
        }

        void vscode.window.showInformationMessage(message);
    }

    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
