//@+leo-ver=5-thin
//@+node:felix.20211212162008.1: * @file src/core/leoExternalFiles.ts
//@+<< imports >>
//@+node:felix.20220102165214.1: ** << imports >>
import * as vscode from "vscode";
import * as g from './leoGlobals';
import { LeoFrame } from "./leoFrame";
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
    constructor(c: Commands, ext: string, p: Position, path: string, time: number) {
        this.c = c;
        this.ext = ext;
        this.p = p && p.__bool__() && p.copy();
        // The nearest @<file> node.
        this.path = path;
        this.time = time;  // Used to inhibit endless dialog loop.
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
    public async exists(): Promise<boolean | vscode.FileStat> {
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

    public checksum_d:  {[key: string]: string}; // Keys are full paths, values are file checksums.
    public enabled_d: Map<Commands, boolean>;
    public files: any[];
    public has_changed_d: Map<Commands, boolean>;
    public unchecked_commanders: Commands[];
    public unchecked_files: any[];
    public _time_d: {[key: string]: number};
    public yesno_all_answer: string | undefined;  // answer, 'yes-all', or 'no-all'
    public on_idle_count = 0;

    //@+others
    //@+node:felix.20230503004807.2: *3* efc.ctor
    /**
     * Ctor for ExternalFiles class.
     */
    constructor(c: Commands){
        this.checksum_d = {};  // Keys are full paths, values are file checksums.
        // For efc.on_idle.
        // Keys are commanders.
        // Values are cached @bool check-for-changed-external-file settings.
        this.enabled_d = new Map();
        // List of ExternalFile instances created by this.open_with.
        this.files = [];
        // Keys are commanders. Values are bools.
        // Used only to limit traces.
        this.has_changed_d=new Map();
        // Copy of g.app.commanders()
        this.unchecked_commanders = [];
        // Copy of self file. Only one files is checked at idle time.
        this.unchecked_files = [];
        // Keys are full paths, values are modification times.
        // DO NOT alter directly, use set_time(path) and
        // get_time(path), see set_time() for notes.
        this._time_d = {};
        this.yesno_all_answer = undefined; // answer, 'yes-all', or 'no-all'
        g.app.idleTimeManager.add_callback(this.on_idle);
    }
    //@+node:felix.20230503004807.3: *3* efc.entries
    //@+node:felix.20230503004807.4: *4* efc.check_overwrite (called from c.checkTimeStamp)
    /**
     * Implements c.checkTimeStamp.
     *
     * Return True if the file given by fn has not been changed
     * since Leo read it or if the user agrees to overwrite it.
     */
    public async check_overwrite(c: Commands, path: string): Promise<boolean> {
        
        if (c.sqlite_connection && c.mFileName === path){
            // sqlite database file is never actually overwritten by Leo
            // so no need to check its timestamp. It is modified through
            // sqlite methods.
            return true;
        }

        if (this.has_changed(path)){
            const val = this.ask(c, path);
            return ['yes', 'yes-all'].includes(val);  // #1888
        }

        return true;

    }
    //@+node:felix.20230503004807.5: *4* efc.destroy_frame
    /**
     * Close all "Open With" files associated with frame.
     * Called by g.app.destroyWindow.
     */
    public destroy_frame(frame: LeoFrame): void {
        let files = this.files.filter(ef => ef.c.frame === frame);
        let paths = files.map(ef => ef.path);
        for (const ef of files) {
            this.destroy_temp_file(ef);
        }
        this.files = this.files.filter(z => !paths.includes(z.path));
    }
    //@+node:felix.20230503004807.6: *4* efc.find_path_for_node (called from vim.py)
    /**
     * Find the path corresponding to node p.
     * called from vim.py.
     */
    public find_path_for_node(p: Position): string | undefined {
        let w_path: string | undefined;
        for (const ef of this.files){
            if (ef.p && ef.p.__bool__() && ef.p.v === p.v){
                w_path = ef.path
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
    public on_idle(): void {

        //
        // #1240: Note: The "asking" dialog prevents idle time.
        //
        if (!g.app || g.app.killed || g.app.restarting){  // #1240.
            return;
        }
        this.on_idle_count += 1;
        let c: Commands| undefined;
        // New in Leo 5.7: always handle delayed requests.
        if (g.app.windowList && g.app.windowList.length){
            // c = g.app.log && g.app.log?.c; // ? Needed ?
            if (c){
                c.outerUpdate();
            }
        }
        // Fix #262: Improve performance when @bool check-for-changed-external-files is True.
        if( this.unchecked_files){
            // Check all external files.
            while (this.unchecked_files){
                const ef = this.unchecked_files.pop();  // #1959: ensure progress.
                this.idle_check_open_with_file(c, ef);
            }
        }else if( this.unchecked_commanders.length){
            // Check the next commander for which
            // @bool check_for_changed_external_file is True.
            c = this.unchecked_commanders.pop();
            this.idle_check_commander(c!);
        }else{
            // Add all commanders for which
            // @bool check_for_changed_external_file is True.
            this.unchecked_commanders =  g.app.commanders().filter(z=> this.is_enabled(z));
            this.unchecked_files = this.files.filter(z=>z.exists());
        }
    }
    //@+node:felix.20230503004807.8: *5* efc.idle_check_commander
    /**
     * Check all external files corresponding to @<file> nodes in c for
     * changes.
     */
    public idle_check_commander(c: Commands): void {
        // #1240: Check the .leo file itself.
        this.idle_check_leo_file(c);
        //
        // #1100: always scan the entire file for @<file> nodes.
        // #1134: Nested @<file> nodes are no longer valid, but this will do no harm.
        let state = 'no';
        for (const p of c.all_unique_positions()){
            if (!p.isAnyAtFileNode()){
                continue;
            }
            const w_path = c.fullPath(p);
            if (!this.has_changed(w_path)){
                continue;
            }
            // Prevent further checks for path.
            this.set_time(w_path);
            this.checksum_d[w_path] = this.checksum(w_path);
            // Check file.
            if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()){
                // #1081: issue a warning.
                this.warn(c, w_path, p);
                continue;
            }
            if (['yes', 'no'].includes(state)){
                state = this.ask(c, w_path, p);
            }
            if (['yes', 'yes-all'].includes(state)){
                c.redraw(p);
                c.refreshFromDisk();
                c.redraw();
            }
        }
    }
    //@+node:felix.20230503004807.9: *5* efc.idle_check_leo_file
    /**
     * Check c's .leo file for external changes.
     */
    public idle_check_leo_file(c: Commands): void {
        
        const w_path = c.fileName();
        if( !this.has_changed(w_path)){
            return;
        }
        // Always update the path & time to prevent future warnings.
        this.set_time(w_path);
        this.checksum_d[w_path] = this.checksum(w_path);
        // #1888:
        const val = this.ask(c, w_path)
        if( ['yes', 'yes-all'].includes(val)){
            // Do a complete restart of Leo.
            g.es_print('restarting Leo...');
            c.restartLeo();
        }
    }
    //@+node:felix.20230503004807.10: *5* efc.idle_check_open_with_file & helper
    /**
     * Update the open-with node given by ef.
     */
    public async idle_check_open_with_file(c?: Commands, ef: ExternalFile): Promise<void> {

        console.assert(ef instanceof ExternalFile, ef.toString());
        if (!ef.path){
            return;
        }
        const w_exists = await g.os_path_exists(ef.path);
        if (!w_exists){
            return;
        }
        const time = this.get_mtime(ef.path);
        if (!time || time === ef.time){
            return;
        }
        // Inhibit endless dialog loop.
        ef.time = time;
        // #1888: Handle all possible user responses to this.ask.
        const val = await this.ask(c, ef.path, (ef.p as Position).copy());
        if (val === 'yes-all'){
            for (const ef of this.unchecked_files){
                this.update_open_with_node(ef);
            }
            this.unchecked_files = [];
        }else if( val === 'no-all'){
            this.unchecked_files = [];
        }else if (val === 'yes'){
            this.update_open_with_node(ef);
        }else if (val === 'no'){
            // pass
        }
    }
    //@+node:felix.20230503004807.11: *6* efc.update_open_with_node
    /**
     * Update the body text of ef.p to the contents of ef.path.
     */
    public async update_open_with_node(ef: ExternalFile): Promise<void> {
        console.assert(ef instanceof ExternalFile, ef.toString());
        
        const c =    ef.c;
        const p = (ef.p as Position).copy();
         
        g.blue(`updated ${p.h}`);
        let [s, e] = await g.readFileIntoString(ef.path);
        p.b = s!;
        if (c.config.getBool('open-with-goto-node-on-update')){
            c.selectPosition(p);
        }
        if( c.config.getBool('open-with-save-on-update')){
            c.save();
        }else{
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
    public open_with(c: Commands, d: {[key: string]: any}) : void {
        
        try{
            let ext = d['ext'];
            if (!g.doHook('openwith1', {'c':c, 'p':c.p, 'v':c.p.v, 'd':d})){
                const root: Position = d['p'];
                let w_path;
                let p;
                if (root && root.__bool__()){
                    // Open the external file itself.
                    w_path = c.fullPath(root);  // #1914.
                    this.open_file_in_external_editor(c, d, w_path);
                }else{
                    // Open a temp file containing just the node.
                    p = c.p;
                    ext = this.compute_ext(c, p, ext);
                    w_path = this.compute_temp_file_path(c, p, ext);
                    if (w_path){
                        this.remove_temp_file(p, w_path);
                        this.create_temp_file(c, ext, p);
                        this.open_file_in_external_editor(c, d, w_path);
                    }
                }
            }
            g.doHook('openwith2', {'c':c, 'p':c.p, 'v':c.p.v, 'd':d});
        } catch (exception){
            g.es('unexpected exception in c.openWith');
            g.es_exception(exception);
        }
    }
    //@+node:felix.20230503004807.13: *5* efc.compute_ext
    /**
     * Return the file extension to be used in the temp file.
     */
    public compute_ext(c: Commands, p: Position, ext: string): string {
        
        if (ext){
                if (ext.startsWith("'")){
                    ext = ext.replace(/^'+/, '');
                    ext = ext.replace(/'+$/, '');
                }
                if (ext.startsWith('"')){
                    ext = ext.replace(/^"+/, '');
                    ext = ext.replace(/"+$/, '');
                }
        }
        if (!ext){
            // if node is part of @<file> tree, get ext from file name
            for (const p2 of p.self_and_parents(false)){
                if (p2.isAnyAtFileNode()){
                    const fn = p2.h.split(" ", 1)[1];
                    ext = g.os_path_splitext(fn)[1];
                    break;
                }

            }
        }
        if (!ext){
            const theDict = c.scanAllDirectives(c.p);
            const language = theDict['language'];
            ext = g.app.language_extension_dict[language];
        }
        if( !ext){
            ext = '.txt';
        }
        if (ext[0] !== '.'){
            ext = '.' + ext;
        }

        return ext;

    }
    //@+node:felix.20230503004807.14: *5* efc.compute_temp_file_path & helpers
    /**
     * Return the path to the temp file for p and ext.
     */
    public compute_temp_file_path(c: Commands, p: Position, ext: string): string 
        
        if c.config.getBool('open-with-clean-filenames')
            path = self.clean_file_name(c, ext, p)
        else
            path = self.legacy_file_name(c, ext, p)

        if not path
            g.error('c.temp_file_path failed')

        return path

    //@+node:felix.20230503004807.15: *6* efc.clean_file_name
    /**
     * Compute the file name when subdirectories mirror the node's hierarchy in Leo.
     */
    public clean_file_name(self, c: Commands, ext: str, p: Position): string 
        
        use_extensions = c.config.getBool('open-with-uses-derived-file-extensions')
        ancestors, found = [], false
        for p2 in p.self_and_parents(false)
            h = p2.anyAtFileNodeName()
            if not h
                h = p2.h  // Not an @file node: use the entire header
            else if use_extensions and not found
                // Found the nearest ancestor @<file> node.
                found = True
                base, ext2 = g.os_path_splitext(h)
                if p2 == p
                    h = base

                if ext2
                    ext = ext2



            ancestors.push(g.sanitize_filename(h))



        // The base directory is <tempdir>/Leo<id(v)>.
        ancestors.push("Leo" + str(id(p.v)))
        // Build temporary directories.
        td = os.path.abspath(tempfile.gettempdir())
        while ancestors.length > 1
            td = os.path.join(td, ancestors.pop())
            if not os.path.exists(td)
                os.mkdir(td)


        // Compute the full path.
        name = ancestors.pop() + ext
        path = os.path.join(td, name)
        return path

    //@+node:felix.20230503004807.16: *6* efc.legacy_file_name
    /**
     * Compute a legacy file name for unsupported operating systems.
     */
    public legacy_file_name(self, c: Commands, ext: str, p: Position): string 
        
        try
            leoTempDir = getpass.getuser() + "_" + "Leo"
        catch exception
            leoTempDir = "LeoTemp"
            g.es("Could not retrieve your user name.")
            g.es(f"Temporary files will be stored in: {leoTempDir}")


        td = os.path.join(os.path.abspath(tempfile.gettempdir()), leoTempDir)
        if not os.path.exists(td)
            os.mkdir(td)

        name = g.sanitize_filename(p.h) + '_' + str(id(p.v)) + ext
        path = os.path.join(td, name)
        return path

    //@+node:felix.20230503004807.17: *5* efc.create_temp_file
    public create_temp_file(self, c: Commands, ext: str, p: Position): string 
        """
        Create the file used by open-with if necessary.
        Add the corresponding ExternalFile instance to self.files
        """
        w_path = self.compute_temp_file_path(c, p, ext)
        exists = g.os_path_exists(w_path);
        // Compute encoding and s.
        d2 = c.scanAllDirectives(p)
        encoding = d2.get('encoding', None)
        if encoding is None
            encoding = c.config.default_derived_file_encoding

        s = g.toEncodedString(p.b, encoding, reportErrors=True)
        // Write the file *only* if it doesn't exist.
        // No need to read the file: recomputing s above suffices.
        if not exists
            try

                with open(w_path, 'wb') as f
                    f.write(s)
                    f.flush()


            catch IOError
                g.error(`exception creating temp file: ${w_path}`)
                g.es_exception()
                return None



        // Add or update the external file entry.
        time = self.get_mtime(w_path)
        self.files = [z for z in self.files if z.path !== w_path]
        self.files.append(ExternalFile(c, ext, p, w_path, time))
        return w_path

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
    //                     g.es_exception()
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
    //                     g.es_exception()
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
    //         g.es_exception()
    //         return f"oops: {command}"
    //@+node:felix.20230503004807.19: *5* efc.remove_temp_file
    public remove_temp_file(p: Position, p_path: string): void 
        """
        Remove any existing *temp* file for p and path, updating self.files.
        """
        for ef in self.files:
            if p_path && p_path == ef.path && p.v == ef.p.v:
                self.destroy_temp_file(ef)
                self.files = [z for z in self.files if z != ef]
                return



    //@+node:felix.20230503004807.20: *4* efc.shut_down
    public shut_down(): void 
        """
        Destroy all temporary open-with files.
        This may fail if the files are still open.

        Called by g.app.finishQuit.
        """
        // Dont call g.es or g.trace! The log stream no longer exists.
        for ef in self.files[:]
            self.destroy_temp_file(ef)


        self.files = []

    //@+node:felix.20230503004807.21: *3* efc.utilities
    // pylint: disable=no-value-for-parameter
    //@+node:felix.20230503004807.22: *4* efc.ask
    public ask(self, c: Commands, path: str, p: Position = None): string 
        """
        Ask user whether to overwrite an @<file> tree.

        Return one of ('yes', 'no', 'yes-all', 'no-all')
        """
        if g.unitTesting
            return ''

        if c not in g.app.commanders()
            return ''

        is_leo = path.endswith(('.leo', '.db'))
        is_external_file = not is_leo
        //
        // Create the message.
        message1 = f"{g.splitLongFileName(path)} has changed outside Leo.\n"
        if is_leo
            message2 = 'Restart Leo?'
        else if p
            message2 = f"Reload {p.h}?"
        else
            for ef in self.files:
                if ef.path == path:
                    message2 = f"Reload {ef.p.h}?"
                    break



            else
                message2 = f"Reload {path}?"


        //
        // #1240: Note: This dialog prevents idle time.
        result = g.app.gui.runAskYesNoDialog(c,
            'Overwrite the version in Leo?',
            message1 + message2,
            yes_all=is_external_file,
            no_all=is_external_file,
        )
        //
        // #1961. Re-init the checksum to suppress concurrent dialogs.
        self.checksum_d[path] = self.checksum(path)
        //
        // #1888: return one of ('yes', 'no', 'yes-all', 'no-all')
        return result.lower() if result else 'no'
    //@+node:felix.20230503004807.23: *4* efc.checksum
    /**
     * Return the checksum of the file at the given path.
     */
    public checksum(self, path: string): string 

        import hashlib
        // #1454: Explicitly close the file.
        with open(path, 'rb') as f
            s = f.read()


        return hashlib.md5(s).hexdigest()

    //@+node:felix.20230503004807.24: *4* efc.destroy_temp_file
    /**
     * Destroy the *temp* file corresponding to ef, an ExternalFile instance.
     */
    public destroy_temp_file(self, ef: Any): void 

        // Do not use g.trace here.
        if ef.path and g.os_path_exists(ef.path)
            try
                os.remove(ef.path)
            catch exception
                pass


    //@+node:felix.20230503004807.25: *4* efc.get_mtime
    /**
     * Return the modification time for the path.
     */
    public get_mtime(self, path: string): number 

        return g.os_path_getmtime(g.os_path_realpath(path))
    //@+node:felix.20230503004807.26: *4* efc.get_time
    public get_time(self, path: string): number 
        """
        return timestamp for path

        see set_time() for notes
        """
        return self._time_d.get(g.os_path_realpath(path))
    //@+node:felix.20230503004807.27: *4* efc.has_changed
    /**
     * Return True if the file at path has changed outside of Leo.
     */
    public has_changed(path: string): boolean 
    
        if not path
            return False

        if not g.os_path_exists(path)
            return False

        if g.os_path_isdir(path)
            return False

        //
        // First, check the modification times.
        old_time = self.get_time(path)
        new_time = self.get_mtime(path)
        if not old_time
            // Initialize.
            self.set_time(path, new_time)
            self.checksum_d[path] = self.checksum(path)
            return False

        if old_time == new_time
            return False

        //
        // Check the checksums *only* if the mod times don't match.
        old_sum = self.checksum_d.get(path)
        new_sum = self.checksum(path)
        if new_sum == old_sum
            // The modtime changed, but it's contents didn't.
            // Update the time, so we don't keep checking the checksums.
            // Return False so we don't prompt the user for an update.
            self.set_time(path, new_time)
            return False

        // The file has really changed.
        assert old_time, path
        return True

    //@+node:felix.20230503004807.28: *4* efc.is_enabled
    /**
     * Return the cached @bool check_for_changed_external_file setting.
     */
    public is_enabled(c: Commands): boolean 
    
        d = self.enabled_d
        val = d.get(c)
        if val is None
            val = c.config.getBool('check-for-changed-external-files', false)
            d[c] = val


        return val

    //@+node:felix.20230503004807.29: *4* efc.join
    /**
     * Return s1 + ' ' + s2
     */
    public join(s1: str, s2: string): string 
    
        return `${s1} ${s2}`;
    //@+node:felix.20230503004807.30: *4* efc.set_time
    public set_time(self, path: str, new_time: float = None): void 
        """
        Implements c.setTimeStamp.

        Update the timestamp for path.

        NOTE: file paths with symbolic links occur with and without those links
        resolved depending on the code call path.  This inconsistency is
        probably not Leo's fault but an underlying Python issue.
        Hence the need to call realpath() here.
        """
        t = new_time or self.get_mtime(path)
        self._time_d[g.os_path_realpath(path)] = t
    //@+node:felix.20230503004807.31: *4* efc.warn
    public warn(self, c: Commands, path: str, p: Position): void 
        """
        Warn that an @asis or @nosent node has been changed externally.

        There is *no way* to update the tree automatically.
        """
        if g.unitTesting or c not in g.app.commanders()
            return

        if not p
            g.trace('NO P')
            return

        g.app.gui.runAskOkDialog(
            c=c,
            message='\n'.join([
                f"{g.splitLongFileName(path)} has changed outside Leo.\n",
                'Leo can not update this file automatically.\n',
                f"This file was created from {p.h}.\n",
                'Warning: refresh-from-disk will destroy all children.'
            ]),
            title='External file changed',
        );

        
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
