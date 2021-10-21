/**
 * Classes to read and write @file nodes.
 */
// import "io"
// import "os"
// import "re"
// import "sys"
// import "tabnanny"
// import "time"
// import "tokenize"
// from "typing" import List
// from "leo.core" import leoGlobals as g
// from "leo.core" import leoNodes
/**
 * Command decorator for the AtFileCommands class.
 */
public function cmd(name): void {
    return g.new_cmd_decorator(name, ['c', 'atFileCommands',]);
}
/**
 * A class implementing the atFile subcommander.
 */
class AtFile {

    // directives...
    const noDirective = 1;  // not an at-directive.
    const allDirective = 2;  // at-all (4.2)
    const docDirective = 3;  // @doc.
    const atDirective = 4;  // @<space> or @<newline>
    const codeDirective = 5;  // @code
    const cDirective = 6;  // @c<space> or @c<newline>
    const othersDirective = 7;  // at-others
    const miscDirective = 8;  // All other directives
    const rawDirective = 9;  // @raw
    const endRawDirective = 10;  // @end_raw
    const startVerbatim = 11;  // @verbatim  Not a real directive. Used to issue warnings.
    // Note: g.getScript also call the this.__init__ and this.finishCreate().

    /**
     * ctor for atFile class.
     */
    public constructor(c: Commands) {
        // **Warning**: all these ivars must **also** be inited in initCommonIvars.
        const this.c = c;
        const this.encoding = 'utf-8';  // 2014/08/13
        const this.fileCommands = c.fileCommands;
        const this.errors = 0;  // Make sure this.error() works even when not inited.
        // **Only** this.writeAll manages these flags.
        const this.unchangedFiles = 0;
        // promptForDangerousWrite sets cancelFlag and yesToAll only if canCancelFlag is True.
        const this.canCancelFlag = false;
        const this.cancelFlag = false;
        const this.yesToAll = false;
        // User options: set in reloadSettings.
        const this.checkPythonCodeOnWrite = false;
        const this.runPyFlakesOnWrite = false;
        const this.underindentEscapeString = '\\-';
        this.reloadSettings();
    }
    /**
     * AtFile.reloadSettings
     */
    public reloadSettings(): void {
        const c = this.c;
        const this.checkPythonCodeOnWrite = c.config.getBool(
            'check-python-code-on-write', default_val=true);
        const this.runPyFlakesOnWrite = c.config.getBool(
            'run-pyflakes-on-write', default_val=false);
        const this.underindentEscapeString = c.config.getString(
            'underindent-escape-string') || '\\-';
    }
    /**
     * Init ivars common to both reading and writing.
     *
     * The defaults set here may be changed later.
     */
    public initCommonIvars(): void {
        const c = this.c;
        const this.at_auto_encoding = c.config.default_at_auto_file_encoding;
        const this.encoding = c.config.default_derived_file_encoding;
        const this.endSentinelComment = "";
        const this.errors = 0;
        const this.inCode = true;
        const this.indent = 0;  // The unit of indentation is spaces, not tabs.
        const this.language = null;
        const this.output_newline = g.getOutputNewline(c=c);
        const this.page_width = null;
        const this.raw = False;  // True: in @raw mode
        const this.root = null;  // The root (a position) of tree being read or written.
        const this.startSentinelComment = "";
        const this.startSentinelComment = "";
        const this.tab_width = c.tab_width || -4;
        const this.writing_to_shadow_directory = false;
    }
    public initReadIvars(root, fileName): void {
        this.initCommonIvars();
        const this.bom_encoding = null;  // The encoding implied by any BOM (set by g.stripBOM)
        const this.cloneSibCount = 0;  // n > 1: Make sure n cloned sibs exists at next @+node sentinel
        const this.correctedLines = 0;  // For perfect import.
        const this.docOut = [];  // The doc part being accumulated.
        const this.done = False;  // True when @-leo seen.
        const this.fromString = false;
        const this.importRootSeen = false;
        const this.indentStack = [];
        const this.lastLines = [];  // The lines after @-leo
        const this.leadingWs = "";
        const this.lineNumber = 0;  // New in Leo 4.4.8.
        const this.out = null;
        const this.outStack = [];
        const this.read_i = 0;
        const this.read_lines = [];
        const this.readVersion = '';  // "5" for new-style thin files.
        const this.readVersion5 = False;  // Synonym for this.readVersion >= '5'
        const this.root = root;
        const this.rootSeen = false;
        const this.targetFileName = fileName;  // For this.writeError only.
        const this.tnodeList = [];  // Needed until old-style @file nodes are no longer supported.
        const this.tnodeListIndex = 0;
        const this.v = null;
        const this.vStack = [];  // Stack of this.v values.
        const this.thinChildIndexStack = [];  // number of siblings at this level.
        const this.thinNodeStack = [];  // Entries are vnodes.
        const this.updateWarningGiven = false;
    }
    /**
     * Compute default values of all write-related ivars.
     * Return the finalized name of the output file.
     */
    public initWriteIvars(root): void {
        const c = this.c;
        if (! c && c.config) {
            return null;
        }
        const make_dirs = c.config.create_nonexistent_directories;
        // assert root;
        this.initCommonIvars();
        // assert this.checkPythonCodeOnWrite != null;
        // assert this.underindentEscapeString != null;

        // Copy args
        const this.root = root;
        const this.sentinels = true;

        // Override initCommonIvars.
        if (g.unitTesting) {
            const this.output_newline = '\n';
        }

        // Set other ivars.
        this.force_newlines_in_at_nosent_bodies = c.config.getBool(
            'force-newlines-in-at-nosent-bodies');
            // For this.putBody only.
        const this.outputList = [];
            // For stream output.
        this.scanAllDirectives(root);
            // Sets the following ivars:
                // this.encoding
                // this.explicitLineEnding
                // this.language
                // this.output_newline
                // this.page_width
                // this.tab_width

        // Overrides of this.scanAllDirectives...
        if (this.language == 'python') {
            // Encoding directive overrides everything else.
            const encoding = g.getPythonEncodingFromString(root.b);
            if (encoding) {
                const this.encoding = encoding;
            }
        }

        // Clean root.v.
        if (! this.errors && this.root) {
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
            }
            const this.root.v._p_changed = true;
        }

        // #1907: Compute the file name and create directories as needed.
        const targetFileName = g.os_path_realpath(g.fullPath(c, root));
        const this.targetFileName = targetFileName;  // For this.writeError only.

        // targetFileName can be empty for unit tests & @command nodes.
        if (! targetFileName) {
            // targetFileName = root.h if g.unitTesting else null;
            const targetFileName = g.unitTesting ? root.h : null;
            const this.targetFileName = targetFileName;  // For this.writeError only.
            return targetFileName;
        }

        // Do nothing more if the file already exists.
        if (os.path.exists(targetFileName)) {
            return targetFileName;
        }

        // Create directories if enabled.
        const root_dir = g.os_path_dirname(targetFileName);
        if (make_dirs && root_dir) {
            const ok = g.makeAllNonExistentDirectories(root_dir);
            if (! ok) {
                // g.error(f"Error creating directories: {root_dir}");
                g.error(`Error creating directories: ${root_dir}`);
                return null;
            }
        }

        // Return the target file name, regardless of future problems.
        return targetFileName;
    }
    // @cmd('check-external-file');

    /**
     * Make sure an external file written by Leo may be read properly.
     */
    public checkExternalFile(event=null): void {
        c, p = this.c, this.c.p;
        if (! p.isAtFileNode() && ! p.isAtThinFileNode()) {
            g.red('Please select an @thin || @file node');
            return;
        }
        const fn = g.fullPath(c, p);  // #1910.
        if (! g.os_path_exists(fn)) {
            // g.red(f"file ! found: {fn}");
            g.red(`file not found: ${fn}`);
            return;
        }
        s, e = g.readFileIntoString(fn);
        if (s == null) {
            // g.red(f"empty file: {fn}");
            g.red(`empty file: ${fn}`);
            return;
        }

        // Create a dummy, unconnected, VNode as the root.
        const root_v = leoNodes.VNode(context=c);
        const root = leoNodes.Position(root_v);
        FastAtRead(c, gnx2vnode={}).read_into_root(s, fn, root);
    }
    /**
     * Open the file given by this.root.
     * This will be the private file for @shadow nodes.
     */
    public openFileForReading(fromString=False): void {
        const c = this.c;
        const is_at_shadow = this.root.isAtShadowFileNode();
        if (fromString) {
            if (is_at_shadow) {
                return this.error(
                    'can ! call this.read from string for @shadow files');
            }
            this.initReadLine(fromString);
            return null, null;
        }

        // Not from a string. Carefully read the file.
        const fn = g.fullPath(c, this.root);
            // Returns full path, including file name.
        this.setPathUa(this.root, fn);
            // Remember the full path to this node.
        if (is_at_shadow) {
            const fn = this.openAtShadowFileForReading(fn);
            if (! fn) {
                return null, null;
            }
        }
        // assert fn;
        try {
            const s = this.readFileToUnicode(fn);
                // Sets this.encoding, regularizes whitespace and calls this.initReadLines.
            // #1466.
            if (s == null) {
                // The error has been given.
                const this._file_bytes = g.toEncodedString('');
                return null, null;
            }
            this.warnOnReadOnlyFile(fn);
        }
        catch (Exception) {
            // this.error(f"unexpected exception opening: '@file {fn}'");
            this.error(`unexpected exception opening: '@file ${fn}'`);
            const this._file_bytes = g.toEncodedString('');
            fn, s = null, null;
        }
        return fn, s;
    }
    /**
     * Open an @shadow for reading and return shadow_fn.
     */
    public openAtShadowFileForReading(fn): void {
        const x = this.c.shadowController;
        // readOneAtShadowNode should already have checked these.
        const shadow_fn = x.shadowPathName(fn);
        const shadow_exists = (g.os_path_exists(shadow_fn) && g.os_path_isfile(shadow_fn));
        if (! shadow_exists) {
            g.trace('can ! happen: no private file',
                shadow_fn, g.callers());
            // this.error(f"can ! happen: private file does ! exist: {shadow_fn}");
            this.error(`can not happen: private file does not exist: ${shadow_fn}`);
            return null;
        }
        // This method is the gateway to the shadow algorithm.
        x.updatePublicAndPrivateFiles(this.root, fn, shadow_fn);
        return shadow_fn;
    }
    /**
     * Read an @thin or @file tree.
     */
    public read(root, fromString=null): void {
        const c = this.c;
        const fileName = g.fullPath(c, root);  // #1341. #1889.
        if (! fileName) {
            this.error("Missing file name. Restoring @file tree from .leo file.");
            return false;
        }
        this.rememberReadPath(g.fullPath(c, root), root);
            // Fix bug 760531: always mark the root as read, even if there was an error.
            // Fix bug 889175: Remember the full fileName.
        this.initReadIvars(root, fileName);
        const this.fromString = fromString;
        if (this.errors) {
            return false;
        }
        fileName, file_s = this.openFileForReading(fromString=fromString);
        // #1798:
        if (file_s == null) {
            return false;
        }

        // Set the time stamp.
        if (fileName) {
            c.setFileTimeStamp(fileName);
        }
        else if (! fileName && ! fromString && ! file_s) {
            return false;
        }
        root.clearVisitedInTree();
        this.scanAllDirectives(root);
            // Sets the following ivars:
                // this.encoding: **changed later** by readOpenFile/this.scanHeader.
                // this.explicitLineEnding
                // this.language
                // this.output_newline
                // this.page_width
                // this.tab_width
        const gnx2vnode = c.fileCommands.gnxDict;
        const contents = fromString || file_s;
        FastAtRead(c, gnx2vnode).read_into_root(contents, fileName, root);
        root.clearDirty();
        return true;
    }
    /**
     * Remove p's tnodeList.
     */
    public deleteTnodeList(p: Position): void { // # AtFile method.
        const v = p.v;
        if (hasattr(v, "tnodeList")) {
            // Not an error, but a useful trace.
                // g.blue("deleting tnodeList for " + repr(v))
            delattr(v, "tnodeList");
            const v._p_changed = true;
        }
    }
    /**
     * Delete unvisited nodes in root's subtree, not including root.
     *
     * Before Leo 5.6: Move unvisited node to be children of the 'Resurrected
     * Nodes'.
     */
    public deleteUnvisitedNodes(root, redraw=True): void {
        // Find the unvisited nodes.
        const aList = [z for z in root.subtree() if ! z.isVisited()];
        if (aList) {
            // new-read: Never create resurrected nodes.
                // r = this.createResurrectedNodesNode()
                // callback = this.defineResurrectedNodeCallback(r, root)
                // # Move the nodes using the callback.
                // this.c.deletePositionsInList(aList, callback)
            this.c.deletePositionsInList(aList, redraw=redraw);
        }
    }
    /**
     * Create a 'Resurrected Nodes' node as the last top-level node.
     */
    public createResurrectedNodesNode(): void {
        const c = this.c;
        const tag = 'Resurrected Nodes';
        // Find the last top-level node.
        const last = c.rootPosition();
        while (last.hasNext()) {
            last.moveToNext();
        }
        // Create the node after last if it doesn't exist.
        if (last.h == tag) {
            const p = last;
        }
        else {
            const p = last.insertAfter();
            p.setHeadString(tag);
        }
        p.expand();
        return p;
    }
    /**
     * Define a callback that moves node p as r's last child.
     */
    public defineResurrectedNodeCallback(r, root): void {

        /**
         * The resurrected nodes callback.
         */
        public function callback(p: Position, r=r.copy(), root=root): void {
            const child = r.insertAsLastChild();
            // child.h = f"From {root.h}";
            const child.h = `From ${root.h}`;
            const v = p.v;
            // new code: based on vnodes.
            for (parent_v in v.parents) {
                // assert isinstance(parent_v, leoNodes.VNode), parent_v;
                if (v in parent_v.children) {
                    const childIndex = parent_v.children.index(v);
                    v._cutLink(childIndex, parent_v);
                    v._addLink(len(child.v.children), child.v);
                }
                else {
                    // This would be surprising.
                    g.trace('**already deleted**', parent_v, v);
                }
            }
            if (! g.unitTesting) {
                g.error('resurrected node:', v.h);
                g.blue('in file:', root.h);
            }
        }

        return callback;
    }
    /**
     * Return True if s has file-like sentinels.
     */
    public isFileLike(s: string): void {
        const tag = "@+leo";
        const s = g.checkUnicode(s);
        const i = s.find(tag);
        if (i == -1) {
            return True;  // Don't use the cache.
        }
        j, k = g.getLine(s, i);
        const line = s[j:k];
        valid, new_df, start, end, isThin = this.parseLeoSentinel(line);
        return ! isThin;
    }
    /**
     * Scan positions, looking for @<file> nodes to read.
     */
    public readAll(root, force=False): void {
        const c = this.c;
        const old_changed = c.changed;
        if (force) {
            // Capture the current headline only if
            // we aren't doing the initial read.
            c.endEditing();
        }
        const t1 = time.time();
        c.init_error_dialogs();
        const files = this.findFilesToRead(force, root);
        for (p in files) {
            this.readFileAtPosition(force, p);
        }
        for (p in files) {
            p.v.clearDirty();
        }
        if (! g.unitTesting) {
            if (files) {
                const t2 = time.time();
                // g.es(f"read {len(files)} files in {t2 - t1:2.2f} seconds");
                t3 = t2 - t1
                g.es(`read ${len(files)} files in ${t3} seconds`);
            }
            else if (force) {
                g.es("no @<file> nodes in the selected tree");
            }
        }
        const c.changed = old_changed;
        c.raise_error_dialogs();
    }
    public findFilesToRead(force, root): void {

        const c = this.c;
        const p = root.copy();
        const scanned_tnodes = set();
        const files = [];
        // after = p.nodeAfterTree() if force else null;
        const after = force ? p.nodeAfterTree() : null;
        while (p && p != after) {
            const data = (p.gnx, g.fullPath(c, p));
            // skip clones referring to exactly the same paths.
            if (data in scanned_tnodes) {
                p.moveToNodeAfterTree();
                continue;
            }
            scanned_tnodes.add(data);
            if (! p.h.startswith('@')) {
                p.moveToThreadNext();
            }
            else if (p.isAtIgnoreNode()) {
                if (p.isAnyAtFileNode()) {
                    c.ignored_at_file_nodes.append(p.h);
                }
                p.moveToNodeAfterTree();
            }
            else if (
                p.isAtThinFileNode() ||
                p.isAtAutoNode() ||
                p.isAtEditNode() ||
                p.isAtShadowFileNode() ||
                p.isAtFileNode() ||
                p.isAtCleanNode();  // 1134.
            ) {
                files.append(p.copy());
                p.moveToNodeAfterTree();
            }
            else if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()) {
                // Note (see #1081): @asis and @nosent can *not* be updated automatically.
                // Doing so using refresh-from-disk will delete all child nodes.
                p.moveToNodeAfterTree();
            }
            else {
                p.moveToThreadNext();
            }
        }
        return files;
    }
    /**
     * Read the @<file> node at p.
     */
    public readFileAtPosition(force, p: Position): void {
        this, c, fileName = this, this.c, p.anyAtFileNodeName();
        if (p.isAtThinFileNode() || p.isAtFileNode()) {
            this.read(p);
        }
        else if (p.isAtAutoNode()) {
            this.readOneAtAutoNode(p);
        }
        else if (p.isAtEditNode()) {
            this.readOneAtEditNode(fileName, p);
        }
        else if (p.isAtShadowFileNode()) {
            this.readOneAtShadowNode(fileName, p);
        }
        else if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()) {
            this.rememberReadPath(g.fullPath(c, p), p);
        }
        else if (p.isAtCleanNode()) {
            this.readOneAtCleanNode(p);
        }
    }
    /**
     * Read all @shadow nodes in the p's tree.
     */
    public readAtShadowNodes(p: Position): void {
        const after = p.nodeAfterTree();
        const p = p.copy();  // Don't change p in the caller.
        while (p && p != after) { // # Don't use iterator.
            if (p.isAtShadowFileNode()) {
                const fileName = p.atShadowFileNodeName();
                this.readOneAtShadowNode(fileName, p);
                p.moveToNodeAfterTree();
            }
            else {
                p.moveToThreadNext();
            }
        }
    }
    /**
     * Read an @auto file into p. Return the *new* position.
     */
    public readOneAtAutoNode(p: Position): void {
        this, c, ic = this, this.c, this.c.importCommands;
        const fileName = g.fullPath(c, p);  // #1521, #1341, #1914.
        if (! g.os_path_exists(fileName)) {
            // g.error(f"! found: {p.h!r}", nodeLink=p.get_UNL(with_proto=true));
            g.error(`not found: ${p.h}`, nodeLink=p.get_UNL(with_proto=true));
            return p;
        }
        // Remember that we have seen the @auto node.
        // Fix bug 889175: Remember the full fileName.
        this.rememberReadPath(fileName, p);
        // if not g.unitTesting: g.es("reading:", p.h)
        try {
            // For #451: return p.
            const old_p = p.copy();
            this.scanAllDirectives(p);
            const p.v.b = '';  // Required for @auto API checks.
            p.v._deleteAllChildren();
            const p = ic.createOutline(parent=p.copy());
            // Do *not* select a position here.
            // That would improperly expand nodes.
                // c.selectPosition(p)
        }
        catch (Exception) {
            const p = old_p;
            ic.errors += 1;
            g.es_print('Unexpected exception importing', fileName);
            g.es_exception();
        }
        if (ic.errors) {
            // g.error(f"errors inhibited read @auto {fileName}");
            g.error(`errors inhibited read @auto ${fileName}`);
        }
        else if (c.persistenceController) {
            c.persistenceController.update_after_read_foreign_file(p);
        }
        // Finish.
        if (ic.errors || ! g.os_path_exists(fileName)) {
            p.clearDirty();
        }
        else {
            g.doHook('after-auto', c=c, p=p);
        }
        return p;
    }
    public readOneAtEditNode(fn, p: Position): void {
        const c = this.c;
        const ic = c.importCommands;
        // #1521
        const fn = g.fullPath(c, p);
        junk, ext = g.os_path_splitext(fn);
        // Fix bug 889175: Remember the full fileName.
        this.rememberReadPath(fn, p);
        // if not g.unitTesting: g.es("reading: @edit %s" % (g.shortFileName(fn)))
        s, e = g.readFileIntoString(fn, kind='@edit');
        if (s == null) {
            return;
        }
        // encoding = 'utf-8' if e == null else e;
        const encoding = e == null ? 'utf-8' : e;
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        const head = '';
        const ext = ext.lower();
        if (ext in ('.html', '.htm')) {
            const head = '@language html\n';
        }
        else if (ext in ('.txt', '.text')) {
            const head = '@nocolor\n';
        }
        else {
            const language = ic.languageForExtension(ext);
            if (language && language != 'unknown_language') {
                // head = f"@language {language}\n";
                const head = `@language ${language}\n`;
            }
            else {
                const head = '@nocolor\n';
            }
        }
        const p.b = head + g.toUnicode(s, encoding=encoding, reportErrors=true);
        g.doHook('after-edit', p=p);
    }
    /**
     * Read one @asis node. Used only by refresh-from-disk
     */
    public readOneAtAsisNode(fn, p: Position): void {
        const c = this.c;
        // #1521 & #1341.
        const fn = g.fullPath(c, p);
        junk, ext = g.os_path_splitext(fn);
        // Remember the full fileName.
        this.rememberReadPath(fn, p);
        // if not g.unitTesting: g.es("reading: @asis %s" % (g.shortFileName(fn)))
        s, e = g.readFileIntoString(fn, kind='@edit');
        if (s == null) {
            return;
        }
        // encoding = 'utf-8' if e == null else e;
        const encoding = e == null ? 'utf-8' : e;
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        const old_body = p.b;
        const p.b = g.toUnicode(s, encoding=encoding, reportErrors=true);
        if (! c.isChanged() && p.b != old_body) {
            c.setChanged();
        }
    }
    /**
     * Update the @clean/@nosent node at root.
     */
    public readOneAtCleanNode(root): void {
        this, c, x = this, this.c, this.c.shadowController;
        const fileName = g.fullPath(c, root);
        if (! g.os_path_exists(fileName)) {
            g.es_print(
                // f"! found: {fileName}",
                `not found: ${fileName}`,
                color='red',
                nodeLink=root.get_UNL(with_proto=true));
            return false;
        }
        this.rememberReadPath(fileName, root);
        this.initReadIvars(root, fileName);
            // Must be called before this.scanAllDirectives.
        this.scanAllDirectives(root);
            // Sets this.startSentinelComment/endSentinelComment.
        new_public_lines = this.read_at_clean_lines(fileName);
        const old_private_lines = this.write_at_clean_sentinels(root);
        const marker = x.markerFromFileLines(old_private_lines, fileName);
        old_public_lines, junk = x.separate_sentinels(old_private_lines, marker);
        if (old_public_lines) {
            const new_private_lines = x.propagate_changed_lines(
                new_public_lines, old_private_lines, marker, p=root);
        }
        else {
            const new_private_lines = [];
            const root.b = ''.join(new_public_lines);
            return true;
        }
        if (new_private_lines == old_private_lines) {
            return true;
        }
        if (! g.unitTesting) {
            g.es("updating:", root.h);
        }
        root.clearVisitedInTree();
        const gnx2vnode = this.fileCommands.gnxDict;
        const contents = ''.join(new_private_lines);
        FastAtRead(c, gnx2vnode).read_into_root(contents, fileName, root);
        return True;  // Errors not detected.
    }
    /**
     * Dump all lines.
     */
    public dump(lines, tag): void {
        // print(f"***** {tag} lines...\n");
        print(`***** ${tag} lines...\n`);
        for (s in lines) {
            print(s.rstrip());
        }
    }
    /**
     * Return all lines of the @clean/@nosent file at fn.
     */
    public read_at_clean_lines(fn): void {
        const s = this.openFileHelper(fn);
            // Use the standard helper. Better error reporting.
            // Important: uses 'rb' to open the file.
        // #1798.
        if (s == null) {
            const s = '';
        }
        else {
            const s = g.toUnicode(s, encoding=this.encoding);
            const s = s.replace('\r\n', '\n');
                // Suppress meaningless "node changed" messages.
        }
        return g.splitLines(s);
    }
    /**
     * Return all lines of the @clean tree as if it were
     * written as an @file node.
     */
    public write_at_clean_sentinels(root): void {
        const result = this.atFileToString(root, sentinels=true);
        const s = g.toUnicode(result, encoding=this.encoding);
        return g.splitLines(s);
    }
    public readOneAtShadowNode(fn, p: Position): void {

        const c = this.c;
        const x = c.shadowController;
        if (! fn == p.atShadowFileNodeName()) {
            this.error(
                // f"can ! happen: fn: {fn} != atShadowNodeName: ";
                `can not happen: fn: ${fn} != atShadowNodeName: `;
                // f"{p.atShadowFileNodeName()}");
                `${p.atShadowFileNodeName()}`);
            return;
        }
        const fn = g.fullPath(c, p);  // #1521 & #1341.
        // #889175: Remember the full fileName.
        this.rememberReadPath(fn, p);
        const shadow_fn = x.shadowPathName(fn);
        const shadow_exists = g.os_path_exists(shadow_fn) && g.os_path_isfile(shadow_fn);
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        if (shadow_exists) {
            this.read(p);
        }
        else {
            const ok = this.importAtShadowNode(p);
            if (ok) {
                // Create the private file automatically.
                this.writeOneAtShadowNode(p);
            }
        }
    }
    public importAtShadowNode(p: Position): void {
        c, ic = this.c, this.c.importCommands;
        const fn = g.fullPath(c, p);  // #1521, #1341, #1914.
        if (! g.os_path_exists(fn)) {
            // g.error(f"! found: {p.h!r}", nodeLink=p.get_UNL(with_proto=true));
            g.error(`not found: ${p.h}`, nodeLink=p.get_UNL(with_proto=true));
            return p;
        }
        // Delete all the child nodes.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        // Import the outline, exactly as @auto does.
        ic.createOutline(parent=p.copy());
        if (ic.errors) {
            g.error('errors inhibited read @shadow', fn);
        }
        if (ic.errors || ! g.os_path_exists(fn)) {
            p.clearDirty();
        }
        return ic.errors == 0;
    }
    /**
     * A convenience wrapper for FastAtRead.read_into_root()
     */
    public fast_read_into_root(c: Commands, contents, gnx2vnode, path, root): void {
        return FastAtRead(c, gnx2vnode).read_into_root(contents, path, root);
    }
    public createImportedNode(root, headline): void {
        if (this.importRootSeen) {
            const p = root.insertAsLastChild();
            p.initHeadString(headline);
        }
        else {
            // Put the text into the already-existing root node.
            const p = root;
            const this.importRootSeen = true;
        }
        p.v.setVisited();  // Suppress warning about unvisited node.
        return p;
    }
    /**
     * Init the ivars so that this.readLine will read all of s.
     */
    public initReadLine(s: string): void {
        const this.read_i = 0;
        const this.read_lines = g.splitLines(s);
        const this._file_bytes = g.toEncodedString(s);
    }
    /**
     * Parse the sentinel line s.
     * If the sentinel is valid, set this.encoding, this.readVersion, this.readVersion5.
     */
    public parseLeoSentinel(s: string): void {
        const c = this.c;
        // Set defaults.
        const encoding = c.config.default_derived_file_encoding;
        readVersion, readVersion5 = null, null;
        new_df, start, end, isThin = false, '', '', false;
        // Example: \*@+leo-ver=5-thin-encoding=utf-8,.*/
        const pattern = re.compile(
            r'(.+)@\+leo(-ver=([0123456789]+))?(-thin)?(-encoding=(.*)(\.))?(.*)');
            // The old code weirdly allowed '.' in version numbers.
            // group 1: opening delim
            // group 2: -ver=
            // group 3: version number
            // group(4): -thin
            // group(5): -encoding=utf-8,.
            // group(6): utf-8,
            // group(7): .
            // group(8): closing delim.
        const m = pattern.match(s);
        const valid = bool(m);
        if (valid) {
            const start = m.group(1);  // start delim
            const valid = bool(start);
        }
        if (valid) {
            const new_df = bool(m.group(2));  // -ver=
            if (new_df) {
                // Set the version number.
                if (m.group(3)) {
                    const readVersion = m.group(3);
                    const readVersion5 = readVersion >= '5';
                }
                else {
                    const valid = false;
                }
            }
        }
        if (valid) {
            // set isThin
            const isThin = bool(m.group(4));
        }
        if (valid && m.group(5)) {
            // set encoding.
            const encoding = m.group(6);
            if (encoding && encoding.endswith(',')) {
                // Leo 4.2 or after.
                const encoding = encoding[:-1];
            }
            if (! g.isValidEncoding(encoding)) {
                g.es_print("bad encoding in derived file:", encoding);
                const valid = false;
            }
        }
        if (valid) {
            const end = m.group(8);  // closing delim
        }
        if (valid) {
            const this.encoding = encoding;
            const this.readVersion = readVersion;
            const this.readVersion5 = readVersion5;
        }
        return valid, new_df, start, end, isThin;
    }
    /**
     * Carefully sets this.encoding, then uses this.encoding to convert the file
     * to a unicode string.
     *
     * Sets this.encoding as follows:
     * 1. Use the BOM, if present. This unambiguously determines the encoding.
     * 2. Use the -encoding= field in the @+leo header, if present and valid.
     * 3. Otherwise, uses existing value of this.encoding, which comes from:
     * A. An @encoding directive, found by this.scanAllDirectives.
     * B. The value of c.config.default_derived_file_encoding.
     *
     * Returns the string, or null on failure.
     */
    public readFileToUnicode(fileName): void {
        const s = this.openFileHelper(fileName);
            // Catches all exceptions.
        // #1798.
        if (s == null) {
            return null;
        }
        e, s = g.stripBOM(s);
        if (e) {
            // The BOM determines the encoding unambiguously.
            const s = g.toUnicode(s, encoding=e);
        }
        else {
            // Get the encoding from the header, or the default encoding.
            const s_temp = g.toUnicode(s, 'ascii', reportErrors=false);
            const e = this.getEncodingFromHeader(fileName, s_temp);
            const s = g.toUnicode(s, encoding=e);
        }
        const s = s.replace('\r\n', '\n');
        const this.encoding = e;
        this.initReadLine(s);
        return s;
    }
    /**
     * Open a file, reporting all exceptions.
     */
    public openFileHelper(fileName): void {
        // #1798: return null as a flag on any error.
        const s = null;
        try {
            with (open(fileName, 'rb') as f) {
                const s = f.read();
            }
        }
        catch (IOError) {
            // this.error(f"can ! open {fileName}");
            this.error(`can not open ${fileName}`);
        }
        catch (Exception) {
            // this.error(f"Exception reading {fileName}");
            this.error(`Exception reading ${fileName}`);
            g.es_exception();
        }
        return s;
    }
    /**
     * Return the encoding given in the @+leo sentinel, if the sentinel is
     * present, or the previous value of this.encoding otherwise.
     */
    public getEncodingFromHeader(fileName, s: string): void {
        if (this.errors) {
            g.trace('can ! happen: this.errors > 0', g.callers());
            const e = this.encoding;
            if (g.unitTesting) {
                // assert false, g.callers();
            }
        }
        else {
            this.initReadLine(s);
            const old_encoding = this.encoding;
            // assert old_encoding;
            const this.encoding = null;
            // Execute scanHeader merely to set this.encoding.
            this.scanHeader(fileName, giveErrors=false);
            const e = this.encoding || old_encoding;
        }
        // assert e;
        return e;
    }
    /**
     * Read one line from file using the present encoding.
     * Returns this.read_lines[this.read_i++]
     */
    public readLine(): void {
        // This is an old interface, now used only by this.scanHeader.
        // For now, it's not worth replacing.
        if (this.read_i < len(this.read_lines)) {
            const s = this.read_lines[this.read_i];
            this.read_i += 1;
            return s;
        }
        return '';  // Not an error.
    }
    /**
     * Scan the @+leo sentinel, using the old readLine interface.
     *
     * Sets this.encoding, and this.start/endSentinelComment.
     *
     * Returns (firstLines,new_df,isThinDerivedFile) where:
     * firstLines        contains all @first lines,
     * new_df            is True if we are reading a new-format derived file.
     * isThinDerivedFile is True if the file is an @thin file.
     */
    public scanHeader(fileName, giveErrors=True): void {
        new_df, isThinDerivedFile = false, false;
        const firstLines: List[str] = [];  // The lines before @+leo.
        const s = this.scanFirstLines(firstLines);
        const valid = len(s) > 0;
        if (valid) {
            valid, new_df, start, end, isThinDerivedFile = this.parseLeoSentinel(s);
        }
        if (valid) {
            const this.startSentinelComment = start;
            const this.endSentinelComment = end;
        }
        else if (giveErrors) {
            // this.error(f"No @+leo sentinel in: {fileName}");
            this.error(`No @+leo sentinel in: ${fileName}`);
            g.trace(g.callers());
        }
        return firstLines, new_df, isThinDerivedFile;
    }
    /**
     * Append all lines before the @+leo line to firstLines.
     *
     * Empty lines are ignored because empty @first directives are
     * ignored.
     *
     * We can not call sentinelKind here because that depends on the comment
     * delimiters we set here.
     */
    public scanFirstLines(firstLines): void {
        const s = this.readLine();
        while (s && s.find("@+leo") == -1) {
            firstLines.append(s);
            const s = this.readLine();
        }
        return s;
    }
    /**
     * Return true if the derived file is a thin file.
     *
     * This is a kludgy method used only by the import code.
     */
    public scanHeaderForThin(fileName): void {
        this.readFileToUnicode(fileName);
            // Sets this.encoding, regularizes whitespace and calls this.initReadLines.
        junk, junk, isThin = this.scanHeader(null);
            // scanHeader uses this.readline instead of its args.
            // scanHeader also sets this.encoding.
        return isThin;
    }
    // @cmd('write-at-auto-nodes');

    /**
     * Write all @auto nodes in the selected outline.
     */
    public writeAtAutoNodes(event=null): void {
        const c = this.c;
        c.init_error_dialogs();
        this.writeAtAutoNodesHelper(writeDirtyOnly=false);
        c.raise_error_dialogs(kind='write');
    }

    // @cmd('write-dirty-at-auto-nodes');

    /**
     * Write all dirty @auto nodes in the selected outline.
     */
    public writeDirtyAtAutoNodes(event=null): void {
        const c = this.c;
        c.init_error_dialogs();
        this.writeAtAutoNodesHelper(writeDirtyOnly=true);
        c.raise_error_dialogs(kind='write');
    }
    /**
     * Write @auto nodes in the selected outline
     */
    public writeAtAutoNodesHelper(writeDirtyOnly=True): void {
        const c = this.c;
        const p = c.p;
        const after = p.nodeAfterTree();
        const found = false;
        while (p && p != after) {
            if (
                p.isAtAutoNode() && ! p.isAtIgnoreNode() &&
                (p.isDirty() || ! writeDirtyOnly)
            ) {
                const ok = this.writeOneAtAutoNode(p);
                if (ok) {
                    const found = true;
                    p.moveToNodeAfterTree();
                }
                else {
                    p.moveToThreadNext();
                }
            }
            else {
                p.moveToThreadNext();
            }
        }
        if (! g.unitTesting) {
            if (found) {
                g.es("finished");
            }
            else if (writeDirtyOnly) {
                g.es("no dirty @auto nodes in the selected tree");
            }
            else {
                g.es("no @auto nodes in the selected tree");
            }
        }
    }
    // @cmd('write-at-shadow-nodes');

    /**
     * Write all @shadow nodes in the selected outline.
     */
    public writeAtShadowNodes(event=null): void {
        const c = this.c;
        c.init_error_dialogs();
        const val = this.writeAtShadowNodesHelper(writeDirtyOnly=false);
        c.raise_error_dialogs(kind='write');
        return val;
    }

    // @cmd('write-dirty-at-shadow-nodes');

    /**
     * Write all dirty @shadow nodes in the selected outline.
     */
    public writeDirtyAtShadowNodes(event=null): void {
        const c = this.c;
        c.init_error_dialogs();
        const val = this.writeAtShadowNodesHelper(writeDirtyOnly=true);
        c.raise_error_dialogs(kind='write');
        return val;
    }
    /**
     * Write @shadow nodes in the selected outline
     */
    public writeAtShadowNodesHelper(writeDirtyOnly=True): void {
        const c = this.c;
        const p = c.p;
        const after = p.nodeAfterTree();
        const found = false;
        while (p && p != after) {
            if (
                p.atShadowFileNodeName() && ! p.isAtIgnoreNode()
                && (p.isDirty() || ! writeDirtyOnly)
            ) {
                const ok = this.writeOneAtShadowNode(p);
                if (ok) {
                    const found = true;
                    // g.blue(f"wrote {p.atShadowFileNodeName()}");
                    g.blue(`wrote ${p.atShadowFileNodeName()}`);
                    p.moveToNodeAfterTree();
                }
                else {
                    p.moveToThreadNext();
                }
            }
            else {
                p.moveToThreadNext();
            }
        }
        if (! g.unitTesting) {
            if (found) {
                g.es("finished");
            }
            else if (writeDirtyOnly) {
                g.es("no dirty @shadow nodes in the selected tree");
            }
            else {
                g.es("no @shadow nodes in the selected tree");
            }
        }
        return found;
    }
    /**
     * Write the contents of the file to the output stream.
     */
    public putFile(root, fromString='', sentinels=True): void {
        // s = fromString if fromString else root.v.b;
        const s = fromString ? fromString : root.v.b;
        root.clearAllVisitedInTree();
        this.putAtFirstLines(s);
        this.putOpenLeoSentinel("@+leo-ver=5");
        this.putInitialComment();
        this.putOpenNodeSentinel(root);
        this.putBody(root, fromString=fromString);
        this.putCloseNodeSentinel(root);
        // The -leo sentinel is required to handle @last.
        this.putSentinel("@-leo");
        root.setVisited();
        this.putAtLastLines(s);
    }
    /**
     * Write @file nodes in all or part of the outline
     */
    public writeAll(all=False, dirty=False): void {
        const c = this.c;
        // This is the *only* place where these are set.
        // promptForDangerousWrite sets cancelFlag only if canCancelFlag is True.
        const this.unchangedFiles = 0;
        const this.canCancelFlag = true;
        const this.cancelFlag = false;
        const this.yesToAll = false;
        files, root = this.findFilesToWrite(all);
        for (p in files) {
            try {
                this.writeAllHelper(p, root);
            }
            catch (Exception) {
                this.internalWriteError(p);
            }
        }
        // Make *sure* these flags are cleared for other commands.
        const this.canCancelFlag = false;
        const this.cancelFlag = false;
        const this.yesToAll = false;
        // Say the command is finished.
        this.reportEndOfWrite(files, all, dirty);
        if (c.isChanged()) {
            // Save the outline if only persistence data nodes are dirty.
            this.saveOutlineIfPossible();
        }
    }
    /**
     * Return a list of files to write.
     * We must do this in a prepass, so as to avoid errors later.
     */
    public findFilesToWrite(force): void {
        const trace = 'save' in g.app.debug && ! g.unitTesting;
        if (trace) {
            // g.trace(f"writing *{'selected' if force else 'all'}* files");
            g.trace(`writing *${'selected' if force else 'all'}* files`);
        }
        const c = this.c;
        if (force) {
            // The Write @<file> Nodes command.
            // Write all nodes in the selected tree.
            const root = c.p;
            const p = c.p;
            const after = p.nodeAfterTree();
        }
        else {
            // Write dirty nodes in the entire outline.
            const root = c.rootPosition();
            const p = c.rootPosition();
            const after = null;
        }
        const seen = set();
        const files = [];
        while (p && p != after) {
            if (p.isAtIgnoreNode() && ! p.isAtAsisFileNode()) {
                // Honor @ignore in *body* text, but *not* in @asis nodes.
                if (p.isAnyAtFileNode()) {
                    c.ignored_at_file_nodes.append(p.h);
                }
                p.moveToNodeAfterTree();
            }
            else if (p.isAnyAtFileNode()) {
                const data = p.v, g.fullPath(c, p);
                if (data in seen) {
                    if (trace && force) {
                        g.trace('Already seen', p.h);
                    }
                }
                else {
                    seen.add(data);
                    files.append(p.copy());
                }
                // Don't scan nested trees???
                p.moveToNodeAfterTree();
            }
            else {
                p.moveToThreadNext();
            }
        }
        // When scanning *all* nodes, we only actually write dirty nodes.
        if (! force) {
            const files = [z for z in files if z.isDirty()];
        }
        if (trace) {
            g.printObj([z.h for z in files], tag='Files to be saved');
        }
        return files, root;
    }
    /**
     * Fix bug 1260415: https://bugs.launchpad.net/leo-editor/+bug/1260415
     * Give a more urgent, more specific, more helpful message.
     */
    public internalWriteError(p: Position): void {
        g.es_exception();
        // g.es(f"Internal error writing: {p.h}", color='red');
        g.es(`Internal error writing: ${p.h}`, color='red');
        g.es('Please report this error to:', color='blue');
        g.es('https://groups.google.com/forum/;  // !forum/leo-editor', color='blue')
        g.es('Warning: changes to this file will be lost', color='red');
        g.es('unless you can save the file successfully.', color='red');
    }
    public reportEndOfWrite(files, all, dirty): void {
        if (g.unitTesting) {
            return;
        }
        if (files) {
            const n = this.unchangedFiles;
            // g.es(f"finished: {n} unchanged file{g.plural(n)}");
            g.es(`finished: ${n} unchanged file${g.plural(n)}`);
        }
        else if (all) {
            g.warning("no @<file> nodes in the selected tree");
        }
        else if (dirty) {
            g.es("no dirty @<file> nodes in the selected tree");
        }
    }
    /**
     * Save the outline if only persistence data nodes are dirty.
     */
    public saveOutlineIfPossible(): void {
        const c = this.c;
        const changed_positions = [p for p in c.all_unique_positions() if p.v.isDirty()];
        const at_persistence = (
            c.persistenceController &&
            c.persistenceController.has_at_persistence_node();
        );
        if (at_persistence) {
            const changed_positions = [p for p in changed_positions;
                if ! at_persistence.isAncestorOf(p)];
        }
        if (! changed_positions) {
            // g.warning('auto-saving @persistence tree.')
            c.clearChanged();  // Clears all dirty bits.
            c.redraw();
        }
    }
    /**
     * Write one file for this.writeAll.
     *
     * Do *not* write @auto files unless p == root.
     *
     * This prevents the write-all command from needlessly updating
     * the @persistence data, thereby annoyingly changing the .leo file.
     */
    public writeAllHelper(p: Position, root): void {
        const this.root = root;
        if (p.isAtIgnoreNode()) {
            // Should have been handled in findFilesToWrite.
            // g.trace(f"Can ! happen: {p.h} == an @ignore node");
            g.trace(`Can not happen: ${p.h} == an @ignore node`);
            return;
        }
        try {
            this.writePathChanged(p);
        }
        catch (IOError) {
            return;
        }
        const table = (
            (p.isAtAsisFileNode, this.asisWrite),
            (p.isAtAutoNode, this.writeOneAtAutoNode),
            (p.isAtCleanNode, this.writeOneAtCleanNode),
            (p.isAtEditNode, this.writeOneAtEditNode),
            (p.isAtFileNode, this.writeOneAtFileNode),
            (p.isAtNoSentFileNode, this.writeOneAtNosentNode),
            (p.isAtShadowFileNode, this.writeOneAtShadowNode),
            (p.isAtThinFileNode, this.writeOneAtFileNode),
        );
        for (pred, func in table) {
            if (pred()) {
                func(p);  // type:ignore
                break;
            }
        }
        else {
            // g.trace(f"Can ! happen: {p.h}");
            g.trace(`Can not happen: ${p.h}`);
            return;
        }

        // Clear the dirty bits in all descendant nodes.
        // The persistence data may still have to be written.
        for (p2 in p.self_and_subtree(copy=false)) {
            p2.v.clearDirty();
        }
    }
    /**
     * raise IOError if p's path has changed *and* user forbids the write.
     */
    public writePathChanged(p: Position): void {
        const c = this.c;

        // Suppress this message during save-as and save-to commands.
        if (c.ignoreChangedPaths) {
            return;
        }
        const oldPath = g.os_path_normcase(this.getPathUa(p));
        const newPath = g.os_path_normcase(g.fullPath(c, p));
        try { // # #1367: samefile can throw an exception.
            const changed = oldPath && ! os.path.samefile(oldPath, newPath);
        }
        catch (Exception) {
            const changed = true;
        }
        if (! changed) {
            return;
        }
        const ok = this.promptForDangerousWrite(
            fileName=null,
            message=(
                // f"{g.tr('path changed for %s' % (p.h))}\n";
                `${g.tr('path changed for %s' % (p.h))}\n`;
                // f"{g.tr('write this file anyway?')}";
                `${g.tr('write this file anyway?')}`;
            ),
        );
        if (! ok) {
            raise IOError;
        }
        this.setPathUa(p, newPath);  // Remember that we have changed paths.
    }
    /**
     * Common helper for atAutoToString and writeOneAtAutoNode.
     */
    public writeAtAutoContents(fileName, root): void {
        const c = this.c;
        // Dispatch the proper writer.
        junk, ext = g.os_path_splitext(fileName);
        const writer = this.dispatch(ext, root);
        if (writer) {
            const this.outputList = [];
            writer(root);
            // return '' if this.errors else ''.join(this.outputList);
            return this.errors ? '' : ''.join(this.outputList);
        }
        if (root.isAtAutoRstNode()) {
            // An escape hatch: fall back to the theRst writer
            // if there is no rst writer plugin.
            const this.outputFile = outputFile = io.StringIO();
            const ok = c.rstCommands.writeAtAutoFile(root, fileName, outputFile);
            // return outputFile.close() if ok else null;
            return ok ? outputFile.close() : null;
        }
        // leo 5.6: allow undefined section references in all @auto files.
        const ivar = 'allow_undefined_refs';
        try {
            setattr(this, ivar, true);
            const this.outputList = [];
            this.putFile(root, sentinels=false);
            // return '' if this.errors else ''.join(this.outputList);
            return this.errors ? '' : ''.join(this.outputList);
        }
        catch (Exception) {
            return null;
        }
        finally {
            if (hasattr(this, ivar)) {
                delattr(this, ivar);
            }
        }
    }
    public asisWrite(root): void {
        const c = this.c;
        try {
            c.endEditing();
            c.init_error_dialogs();
            const fileName = this.initWriteIvars(root);
            // #1450.
            if (! fileName || ! this.precheck(fileName, root)) {
                this.addToOrphanList(root);
                return;
            }
            const this.outputList = [];
            for (p in root.self_and_subtree(copy=false)) {
                this.writeAsisNode(p);
            }
            if (! this.errors) {
                const contents = ''.join(this.outputList);
                this.replaceFile(contents, this.encoding, fileName, root);
            }
        }
        catch (Exception) {
            this.writeException(fileName, root);
        }
    }

    const silentWrite = asisWrite;  // Compatibility with old scripts.
    /**
     * Write the p's node to an @asis file.
     */
    public writeAsisNode(p: Position): void {
        /**
         * Append s to this.output_list.
         */
        public function put(s: string): void {
            // #1480: Avoid calling this.os().
            const s = g.toUnicode(s, this.encoding, reportErrors=true);
            this.outputList.append(s);
        }

        // Write the headline only if it starts with '@@'.

        const s = p.h;
        if (g.match(s, 0, "@@")) {
            const s = s[2:];
            if (s) {
                put('\n');  // Experimental.
                put(s);
                put('\n');
            }
        }
        // Write the body.
        const s = p.b;
        if (s) {
            put(s);
        }
    }
    public writeMissing(p: Position): void {
        const c = this.c;
        const writtenFiles = false;
        c.init_error_dialogs();
        // #1450.
        this.initWriteIvars(root=p.copy());
        const p = p.copy();
        const after = p.nodeAfterTree();
        while (p && p != after) { // # Don't use iterator.
            if (
                p.isAtAsisFileNode() || (p.isAnyAtFileNode() && ! p.isAtIgnoreNode())
            ) {
                const fileName = p.anyAtFileNodeName();
                if (fileName) {
                    const fileName = g.fullPath(c, p);  // #1914.
                    if (this.precheck(fileName, p)) {
                        this.writeMissingNode(p);
                        const writtenFiles = true;
                    }
                    else {
                        this.addToOrphanList(p);
                    }
                }
                p.moveToNodeAfterTree();
            }
            else if (p.isAtIgnoreNode()) {
                p.moveToNodeAfterTree();
            }
            else {
                p.moveToThreadNext();
            }
        }
        if (! g.unitTesting) {
            if (writtenFiles > 0) {
                g.es("finished");
            }
            else {
                g.es("no @file node in the selected tree");
            }
        }
        c.raise_error_dialogs(kind='write');
    }
    public writeMissingNode(p: Position): void {
        const table = (
            (p.isAtAsisFileNode, this.asisWrite),
            (p.isAtAutoNode, this.writeOneAtAutoNode),
            (p.isAtCleanNode, this.writeOneAtCleanNode),
            (p.isAtEditNode, this.writeOneAtEditNode),
            (p.isAtFileNode, this.writeOneAtFileNode),
            (p.isAtNoSentFileNode, this.writeOneAtNosentNode),
            (p.isAtShadowFileNode, this.writeOneAtShadowNode),
            (p.isAtThinFileNode, this.writeOneAtFileNode),
        );
        for (pred, func in table) {
            if (pred()) {
                func(p);  // type:ignore
                return;
            }
        }
        // g.trace(f"Can ! happen unknown @<file> kind: {p.h}");
        g.trace(`Can not happen unknown @<file> kind: ${p.h}`);
    }
    /**
     * Write p, an @auto node.
     * File indices *must* have already been assigned.
     * Return True if the node was written successfully.
     */
    public writeOneAtAutoNode(p: Position): void {
        const c = this.c;
        const root = p.copy();
        try {
            c.endEditing();
            if (! p.atAutoNodeName()) {
                return false;
            }
            const fileName = this.initWriteIvars(root);
            const this.sentinels = false;
            // #1450.
            if (! fileName || ! this.precheck(fileName, root)) {
                this.addToOrphanList(root);
                return false;
            }
            if (c.persistenceController) {
                c.persistenceController.update_before_write_foreign_file(root);
            }
            const contents = this.writeAtAutoContents(fileName, root);
            if (contents == null) {
                g.es("! written:", fileName);
                this.addToOrphanList(root);
                return false;
            }
            this.replaceFile(contents, this.encoding, fileName, root,
                ignoreBlankLines=root.isAtAutoRstNode());
            return true;
        }
        catch (Exception) {
            this.writeException(fileName, root);
            return false;
        }
    }
    /**
     * Return the correct writer function for p, an @auto node.
     */
    public dispatch(ext, p: Position): void {
        // Match @auto type before matching extension.
        return this.writer_for_at_auto(p) || this.writer_for_ext(ext);
    }
    /**
     * A factory returning a writer function for the given kind of @auto directive.
     */
    public writer_for_at_auto(root): void {
        const d = g.app.atAutoWritersDict;
        for (key in d) {
            const aClass = d.get(key);
            if (aClass && g.match_word(root.h, 0, key)) {

                public function writer_for_at_auto_cb(root): void {
                    // pylint: disable=cell-var-from-loop
                    try {
                        const writer = aClass(this.c);
                        const s = writer.write(root);
                        return s;
                    }
                    catch (Exception) {
                        g.es_exception();
                        return null;
                    }
                }

                return writer_for_at_auto_cb;
            }
        }
        return null;
    }
    /**
     * A factory returning a writer function for the given file extension.
     */
    public writer_for_ext(ext): void {
        const d = g.app.writersDispatchDict;
        const aClass = d.get(ext);
        if (aClass) {

            public function writer_for_ext_cb(root): void {
                try {
                    return aClass(this.c).write(root);
                }
                catch (Exception) {
                    g.es_exception();
                    return null;
                }
            }

            return writer_for_ext_cb;
        }

        return null;
    }
    /**
     * Write one @clean file..
     * root is the position of an @clean node.
     */
    public writeOneAtCleanNode(root): void {
        const c = this.c;
        try {
            c.endEditing();
            const fileName = this.initWriteIvars(root);
            const this.sentinels = false;
            if (! fileName || ! this.precheck(fileName, root)) {
                return;
            }
            const this.outputList = [];
            this.putFile(root, sentinels=false);
            this.warnAboutOrphandAndIgnoredNodes();
            if (this.errors) {
                g.es("! written:", g.shortFileName(fileName));
                this.addToOrphanList(root);
            }
            else {
                const contents = ''.join(this.outputList);
                this.replaceFile(contents, this.encoding, fileName, root);
            }
        }
        catch (Exception) {
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
            }
            this.writeException(fileName, root);
        }
    }
    /**
     * Write one @edit node.
     */
    public writeOneAtEditNode(p: Position): void {
        const c = this.c;
        const root = p.copy();
        try {
            c.endEditing();
            c.init_error_dialogs();
            if (! p.atEditNodeName()) {
                return false;
            }
            if (p.hasChildren()) {
                g.error('@edit nodes must ! have children');
                g.es('To save your work, convert @edit to @auto, @file || @clean');
                return false;
            }
            const fileName = this.initWriteIvars(root);
            const this.sentinels = false;
            // #1450.
            if (! fileName || ! this.precheck(fileName, root)) {
                this.addToOrphanList(root);
                return false;
            }
            const contents = ''.join([s for s in g.splitLines(p.b);
                if this.directiveKind4(s, 0) == this.noDirective]);
            this.replaceFile(contents, this.encoding, fileName, root);
            c.raise_error_dialogs(kind='write');
            return true;
        }
        catch (Exception) {
            this.writeException(fileName, root);
            return false;
        }
    }
    /**
     * Write @file or @thin file.
     */
    public writeOneAtFileNode(root): void {
        const c = this.c;
        try {
            c.endEditing();
            const fileName = this.initWriteIvars(root);
            const this.sentinels = true;
            if (! fileName || ! this.precheck(fileName, root)) {
                // Raise dialog warning of data loss.
                this.addToOrphanList(root);
                return;
            }
            const this.outputList = [];
            this.putFile(root, sentinels=true);
            this.warnAboutOrphandAndIgnoredNodes();
            if (this.errors) {
                g.es("! written:", g.shortFileName(fileName));
                this.addToOrphanList(root);
            }
            else {
                const contents = ''.join(this.outputList);
                this.replaceFile(contents, this.encoding, fileName, root);
            }
        }
        catch (Exception) {
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
            }
            this.writeException(fileName, root);
        }
    }
    /**
     * Write one @nosent node.
     * root is the position of an @<file> node.
     * sentinels will be False for @clean and @nosent nodes.
     */
    public writeOneAtNosentNode(root): void {
        const c = this.c;
        try {
            c.endEditing();
            const fileName = this.initWriteIvars(root);
            const this.sentinels = false;
            if (! fileName || ! this.precheck(fileName, root)) {
                return;
            }
            const this.outputList = [];
            this.putFile(root, sentinels=false);
            this.warnAboutOrphandAndIgnoredNodes();
            if (this.errors) {
                g.es("! written:", g.shortFileName(fileName));
                this.addToOrphanList(root);
            }
            else {
                const contents = ''.join(this.outputList);
                this.replaceFile(contents, this.encoding, fileName, root);
            }
        }
        catch (Exception) {
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
            }
            this.writeException(fileName, root);
        }
    }
    /**
     * Write p, an @shadow node.
     * File indices *must* have already been assigned.
     *
     * testing: set by unit tests to suppress the call to this.precheck.
     * Testing is not the same as g.unitTesting.
     */
    public writeOneAtShadowNode(p: Position, testing=False): void {
        const c = this.c;
        const root = p.copy();
        const x = c.shadowController;
        try {
            c.endEditing();  // Capture the current headline.
            const fn = p.atShadowFileNodeName();
            // assert fn, p.h;
            this.adjustTargetLanguage(fn);
                // A hack to support unknown extensions. May set c.target_language.
            const full_path = g.fullPath(c, p);
            this.initWriteIvars(root);
            // Force python sentinels to suppress an error message.
            // The actual sentinels will be set below.
            const this.endSentinelComment = null;
            const this.startSentinelComment = ";  // "
            // Make sure we can compute the shadow directory.
            const private_fn = x.shadowPathName(full_path);
            if (! private_fn) {
                return false;
            }
            if (! testing && ! this.precheck(full_path, root)) {
                return false;
            }

            // Bug fix: Leo 4.5.1:
            // use x.markerFromFileName to force the delim to match
            // what is used in x.propegate changes.
            const marker = x.markerFromFileName(full_path);
            this.startSentinelComment, this.endSentinelComment = marker.getDelims();
            if (g.unitTesting) {
                const ivars_dict = g.getIvarsDict(at);
            }

            // Write the public and private files to strings.

            public function put(sentinels): void {
                const this.outputList = [];
                const this.sentinels = sentinels;
                this.putFile(root, sentinels=sentinels);
                // return '' if this.errors else ''.join(this.outputList);
                return this.errors ? '' : ''.join(this.outputList);
            }

            this.public_s = put(false);
            const this.private_s = put(true);
            this.warnAboutOrphandAndIgnoredNodes();
            if (g.unitTesting) {
                const exceptions = ('public_s', 'private_s', 'sentinels', 'outputList');
                // assert g.checkUnchangedIvars(
                    this, ivars_dict, exceptions), 'writeOneAtShadowNode';
            }
            if (! this.errors) {
                // Write the public and private files.
                x.makeShadowDirectory(full_path);
                    // makeShadowDirectory takes a *public* file name.
                x.replaceFileWithString(this.encoding, private_fn, this.private_s);
                x.replaceFileWithString(this.encoding, full_path, this.public_s);
            }
            this.checkPythonCode(contents=this.private_s, fileName=full_path, root=root);
            if (this.errors) {
                g.error("! written:", full_path);
                this.addToOrphanList(root);
            }
            else {
                root.clearDirty();
            }
            return ! this.errors;
        }
        catch (Exception) {
            this.writeException(full_path, root);
            return false;
        }
    }
    /**
     * Use the language implied by fn's extension if
     * there is a conflict between it and c.target_language.
     */
    public adjustTargetLanguage(fn): void {
        const c = this.c;
        junk, ext = g.os_path_splitext(fn);
        if (ext) {
            if (ext.startswith('.')) {
                const ext = ext[1:];
            }
            const language = g.app.extension_dict.get(ext);
            if (language) {
                const c.target_language = language;
            }
            else {
                // An unknown language.
                // Use the default language, **not** 'unknown_language'
                pass;
            }
        }
    }
    /**
     * Write the @asis node to a string.
     */
    public atAsisToString(root): void {
        const c = this.c;
        try {
            c.endEditing();
            const fileName = this.initWriteIvars(root);
            const this.outputList = [];
            for (p in root.self_and_subtree(copy=false)) {
                this.writeAsisNode(p);
            }
            // return '' if this.errors else ''.join(this.outputList);
            return this.errors ? '' : ''.join(this.outputList);
        }
        catch (Exception) {
            this.writeException(fileName, root);
            return '';
        }
    }
    /**
     * Write the root @auto node to a string, and return it.
     */
    public atAutoToString(root): void {
        const c = this.c;
        try {
            c.endEditing();
            const fileName = this.initWriteIvars(root);
            const this.sentinels = false;
            // #1450.
            if (! fileName) {
                this.addToOrphanList(root);
                return '';
            }
            return this.writeAtAutoContents(fileName, root) || '';
        }
        catch (Exception) {
            this.writeException(fileName, root);
            return '';
        }
    }
    /**
     * Write one @edit node.
     */
    public atEditToString(root): void {
        const c = this.c;
        try {
            c.endEditing();
            if (root.hasChildren()) {
                g.error('@edit nodes must ! have children');
                g.es('To save your work, convert @edit to @auto, @file || @clean');
                return false;
            }
            const fileName = this.initWriteIvars(root);
            const this.sentinels = false;
            // #1450.
            if (! fileName) {
                this.addToOrphanList(root);
                return '';
            }
            const contents = ''.join([
                s for s in g.splitLines(root.b);
                    if this.directiveKind4(s, 0) == this.noDirective]);
            return contents;
        }
        catch (Exception) {
            this.writeException(fileName, root);
            return '';
        }
    }
    /**
     * Write an external file to a string, and return its contents.
     */
    public atFileToString(root, sentinels=True): void {
        const c = this.c;
        try {
            c.endEditing();
            this.initWriteIvars(root);
            const this.sentinels = sentinels;
            const this.outputList = [];
            this.putFile(root, sentinels=sentinels);
            // assert root == this.root, 'write';
            // contents = '' if this.errors else ''.join(this.outputList);
            const contents = this.errors ? '' : ''.join(this.outputList);
            // Major bug: failure to clear this wipes out headlines!
            // Sometimes this causes slight problems...
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
                const root.v._p_changed = true;
            }
            return contents;
        }
        catch (Exception) {
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
            }
            this.exception("exception preprocessing script");
            const root.v._p_changed = true;
            return '';
        }
    }
    /**
     * Write an external file from a string.
     *
     * This is this.write specialized for scripting.
     */
    public stringToString(root, s: string, forcePythonSentinels=True, sentinels=True): void {
        const c = this.c;
        try {
            c.endEditing();
            this.initWriteIvars(root);
            if (forcePythonSentinels) {
                const this.endSentinelComment = null;
                const this.startSentinelComment = ";  // "
                const this.language = "python";
            }
            const this.sentinels = sentinels;
            const this.outputList = [];
            this.putFile(root, fromString=s, sentinels=sentinels);
            // contents = '' if this.errors else ''.join(this.outputList);
            const contents = this.errors ? '' : ''.join(this.outputList);
            // Major bug: failure to clear this wipes out headlines!
            // Sometimes this causes slight problems...
            if (root) {
                if (hasattr(this.root.v, 'tnodeList')) {
                    delattr(this.root.v, 'tnodeList');
                }
                const root.v._p_changed = true;
            }
            return contents;
        }
        catch (Exception) {
            this.exception("exception preprocessing script");
            return '';
        }
    }
    /**
     * Generate the body enclosed in sentinel lines.
     * Return True if the body contains an @others line.
     */
    public putBody(p: Position, fromString=''): void {

        // New in 4.3 b2: get s from fromString if possible.
        // s = fromString if fromString else p.b;
        const s = fromString ? fromString : p.b;
        p.v.setVisited();
            // Make sure v is never expanded again.
            // Suppress orphans check.

        // Fix #1048 & #1037: regularize most trailing whitespace.
        if (s && (this.sentinels || this.force_newlines_in_at_nosent_bodies)) {
            if (! s.endswith('\n')) {
                const s = s + '\n';
            }
        }
        const this.raw = False;  // Bug fix.
        const i = 0;
        const status = g.Bunch(
            at_comment_seen=false,
            at_delims_seen=false,
            at_warning_given=false,
            has_at_others=false,
            in_code=true,
        );
        while (i < len(s)) {
            const next_i = g.skip_line(s, i);
            // assert next_i > i, 'putBody';
            const kind = this.directiveKind4(s, i);
            this.putLine(i, kind, p, s, status);
            const i = next_i;
        }
        // pylint: disable=no-member
            // g.bunch *does* have .in_code and has_at_others members.
        if (! status.in_code) {
            this.putEndDocLine();
        }
        return status.has_at_others;
    }
    /**
     * Put the line at s[i:] of the given kind, updating the status.
     */
    public putLine(i: number, kind, p: Position, s: string, status): void {
        if (kind == this.noDirective) {
            if (status.in_code) {
                if (this.raw) {
                    this.putCodeLine(s, i);
                }
                else {
                    name, n1, n2 = this.findSectionName(s, i);
                    if (name) {
                        this.putRefLine(s, i, n1, n2, name, p);
                    }
                    else {
                        this.putCodeLine(s, i);
                    }
                }
            }
            else {
                this.putDocLine(s, i);
            }
        }
        else if (this.raw) {
            if (kind == this.endRawDirective) {
                const this.raw = false;
                this.putSentinel("@@end_raw");
            }
            else {
                // Fix bug 784920: @raw mode does not ignore directives
                this.putCodeLine(s, i);
            }
        }
        else if (kind in (this.docDirective, this.atDirective)) {
            if (! status.in_code) {
                // Bug fix 12/31/04: handle adjacent doc parts.
                this.putEndDocLine();
            }
            this.putStartDocLine(s, i, kind);
            const status.in_code = false;
        }
        else if (kind in (this.cDirective, this.codeDirective)) {
            // Only @c and @code end a doc part.
            if (! status.in_code) {
                this.putEndDocLine();
            }
            this.putDirective(s, i, p);
            const status.in_code = true;
        }
        else if (kind == this.allDirective) {
            if (status.in_code) {
                if (p == this.root) {
                    this.putAtAllLine(s, i, p);
                }
                else {
                    // this.error(f"@all ! valid in: {p.h}");
                    this.error(`@all not valid in: ${p.h}`);
                }
            }
            else { // this.putDocLine(s, i)
            }
        }
        else if (kind == this.othersDirective) {
            if (status.in_code) {
                if (status.has_at_others) {
                    // this.error(f"multiple @others in: {p.h}");
                    this.error(`multiple @others in: ${p.h}`);
                }
                else {
                    this.putAtOthersLine(s, i, p);
                    const status.has_at_others = true;
                }
            }
            else {
                this.putDocLine(s, i);
            }
        }
        else if (kind == this.rawDirective) {
            const this.raw = true;
            this.putSentinel("@@raw");
        }
        else if (kind == this.endRawDirective) {
            // Fix bug 784920: @raw mode does not ignore directives
            // this.error(f"unmatched @end_raw directive: {p.h}");
            this.error(`unmatched @end_raw directive: ${p.h}`);
        }
        else if (kind == this.startVerbatim) {
            // Fix bug 778204: @verbatim not a valid Leo directive.
            if (g.unitTesting) {
                // A hack: unit tests for @shadow use @verbatim as a kind of directive.
                pass;
            }
            else {
                // this.error(f"@verbatim != a Leo directive: {p.h}");
                this.error(`@verbatim != a Leo directive: ${p.h}`);
            }
        }
        else if (kind == this.miscDirective) {
            // Fix bug 583878: Leo should warn about @comment/@delims clashes.
            if (g.match_word(s, i, '@comment')) {
                const status.at_comment_seen = true;
            }
            else if (g.match_word(s, i, '@delims')) {
                const status.at_delims_seen = true;
            }
            if (
                status.at_comment_seen &&
                status.at_delims_seen && !
                status.at_warning_given
            ) {
                const status.at_warning_given = true;
                // this.error(f"@comment && @delims in node {p.h}");
                this.error(`@comment && @delims in node ${p.h}`);
            }
            this.putDirective(s, i, p);
        }
        else {
            // this.error(f"putBody: can ! happen: unknown directive kind: {kind}");
            this.error(`putBody: can not happen: unknown directive kind: ${kind}`);
        }
    }
    /**
     * Put the expansion of @all.
     */
    public putAtAllLine(s: string, i: number, p: Position): void {
        j, delta = g.skip_leading_ws_with_indent(s, i, this.tab_width);
        const k = g.skip_to_end_of_line(s, i);
        this.putLeadInSentinel(s, i, j, delta);
        this.indent += delta;
        this.putSentinel("@+" + s[j + 1 : k].strip());
            // s[j:k] starts with '@all'
        for (child in p.children()) {
            this.putAtAllChild(child);
        }
        this.putSentinel("@-all");
        this.indent -= delta;
    }
    /**
     * Generate the body enclosed in sentinel lines.
     */
    public putAtAllBody(p: Position): void {
        const s = p.b;
        p.v.setVisited();
            // Make sure v is never expanded again.
            // Suppress orphans check.
        if (this.sentinels && s && s[-1] != '\n') {
            const s = s + '\n';
        }
        i, inCode = 0, true;
        while (i < len(s)) {
            const next_i = g.skip_line(s, i);
            // assert next_i > i;
            if (inCode) {
                // Use verbatim sentinels to write all directives.
                this.putCodeLine(s, i);
            }
            else {
                this.putDocLine(s, i);
            }
            const i = next_i;
        }
        if (! inCode) {
            this.putEndDocLine();
        }
    }
    /**
     * This code puts only the first of two or more cloned siblings, preceding
     * the clone with an @clone n sentinel.
     *
     * This is a debatable choice: the cloned tree appears only once in the
     * external file. This should be benign; the text created by @all is
     * likely to be used only for recreating the outline in Leo. The
     * representation in the derived file doesn't matter much.
     */
    public putAtAllChild(p: Position): void {
        this.putOpenNodeSentinel(p, inAtAll=true);
            // Suppress warnings about @file nodes.
        this.putAtAllBody(p);
        for (child in p.children()) {
            this.putAtAllChild(child);
        }
        this.putCloseNodeSentinel(p);
    }
    /**
     * Put the expansion of @others.
     */
    public putAtOthersLine(s: string, i: number, p: Position): void {
        j, delta = g.skip_leading_ws_with_indent(s, i, this.tab_width);
        const k = g.skip_to_end_of_line(s, i);
        this.putLeadInSentinel(s, i, j, delta);
        this.indent += delta;
        this.putSentinel("@+" + s[j + 1 : k].strip());
            // s[j:k] starts with '@others'
            // Never write lws in new sentinels.
        for (child in p.children()) {
            const p = child.copy();
            const after = p.nodeAfterTree();
            while (p && p != after) {
                if (this.validInAtOthers(p)) {
                    this.putOpenNodeSentinel(p);
                    const at_others_flag = this.putBody(p);
                    this.putCloseNodeSentinel(p);
                    if (at_others_flag) {
                        p.moveToNodeAfterTree();
                    }
                    else {
                        p.moveToThreadNext();
                    }
                }
                else {
                    p.moveToNodeAfterTree();
                }
            }
        }
        // This is the same in both old and new sentinels.
        this.putSentinel("@-others");
        this.indent -= delta;
    }
    public putAtOthersChild(p: Position): void {
        this.putOpenNodeSentinel(p);
        this.putBody(p);
        this.putCloseNodeSentinel(p);
    }
    /**
     * Return True if p should be included in the expansion of the @others
     * directive in the body text of p's parent.
     */
    public validInAtOthers(p: Position): void {
        const i = g.skip_ws(p.h, 0);
        isSection, junk = this.isSectionName(p.h, i);
        if (isSection) {
            return False;  // A section definition node.
        }
        if (this.sentinels) {
            // @ignore must not stop expansion here!
            return true;
        }
        if (p.isAtIgnoreNode()) {
            g.error('did ! write @ignore node', p.v.h);
            return false;
        }
        return true;
    }
    /**
     * Put a normal code line.
     */
    public putCodeLine(s: string, i: number): void {
        // Put @verbatim sentinel if required.
        const k = g.skip_ws(s, i);
        if (g.match(s, k, this.startSentinelComment + '@')) {
            this.putSentinel('@verbatim');
        }
        const j = g.skip_line(s, i);
        const line = s[i:j];
        // Don't put any whitespace in otherwise blank lines.
        if (len(line) > 1) { // # Preserve *anything* the user puts on the line!!!
            if (! this.raw) {
                this.putIndent(this.indent, line);
            }
            if (line[-1) { // ] == '\n':
                this.os(line[:-1]);
                this.onl();
            }
            else {
                this.os(line);
            }
        }
        else if (line && line[-1] == '\n') {
            this.onl();
        }
        else if (line) {
            this.os(line);  // Bug fix: 2013/09/16
        }
        else {
            g.trace('Can ! happen: completely empty line');
        }
    }
    /**
     * Put a line containing one or more references.
     */
    public putRefLine(s: string, i: number, n1, n2, name, p: Position): void {
        const ref = this.findReference(name, p);
        const is_clean = this.root.h.startswith('@clean');
        if (! ref) {
            if (hasattr(this, 'allow_undefined_refs')) {
                // Allow apparent section reference: just write the line.
                this.putCodeLine(s, i);
            }
            return;
        }
        // Compute delta only once.
        junk, delta = g.skip_leading_ws_with_indent(s, i, this.tab_width);
        // Write the lead-in sentinel only once.
        this.putLeadInSentinel(s, i, n1, delta);
        this.putRefAt(name, ref, delta);
        const n_refs = 0;
        while (1) {
            const progress = i;
            const i = n2;
            n_refs += 1;
            name, n1, n2 = this.findSectionName(s, i);
            if (is_clean && n_refs > 1) {
                // #1232: allow only one section reference per line in @clean.
                i1, i2 = g.getLine(s, i);
                const line = s[i1:i2].rstrip();
                // this.writeError(f"Too many section references:\n{line!s}");
                this.writeError(`Too many section references:\n${line}`);
                break;
            }
            if (name) {
                const ref = this.findReference(name, p);
                    // Issues error if not found.
                if (ref) {
                    const middle_s = s[i:n1];
                    this.putAfterMiddleRef(middle_s, delta);
                    this.putRefAt(name, ref, delta);
                }
            }
            else {
                break;
            }
            // assert progress < i;
        }
        this.putAfterLastRef(s, i, delta);
    }
    /**
     * Find a reference to name.  Raise an error if not found.
     */
    public findReference(name, p: Position): void {
        const ref = g.findReference(name, p);
        if (! ref && ! hasattr(this, 'allow_undefined_refs')) {
            // Do give this error even if unit testing.
            this.writeError(
                // f"undefined section: {g.truncate(name, 60)}\n";
                `undefined section: ${g.truncate(name, 60)}\n`;
                // f"  referenced from: {g.truncate(p.h, 60)}");
                `  referenced from: ${g.truncate(p.h, 60)}`);
        }
        return ref;
    }
    /**
     * Return n1, n2 representing a section name.
     * The section name, *including* brackes is s[n1:n2]
     */
    public findSectionName(s: string, i: number): void {
        const end = s.find('\n', i);
        if (end == -1) {
            const n1 = s.find("<<", i);
            const n2 = s.find(">>", i);
        }
        else {
            const n1 = s.find("<<", i, end);
            const n2 = s.find(">>", i, end);
        }
        const ok = -1 < n1 < n2;
        if (ok) {
            // Warn on extra brackets.
            for (ch, j in (('<', n1 + 2), ('>', n2 + 2))) {
                if (g.match(s, j, ch)) {
                    const line = g.get_line(s, i);
                    g.es('dubious brackets in', line);
                    break;
                }
            }
            const name = s[n1 : n2 + 2];
            return name, n1, n2 + 2;
        }
        return null, n1, len(s);
    }
    /**
     * Handle whatever follows the last ref of a line.
     */
    public putAfterLastRef(s: string, start, delta): void {
        const j = g.skip_ws(s, start);
        if (j < len(s) && s[j] != '\n') {
            // Temporarily readjust delta to make @afterref look better.
            this.indent += delta;
            this.putSentinel("@afterref");
            const end = g.skip_line(s, start);
            const after = s[start:end];
            this.os(after);
            if (this.sentinels && after && after[-1] != '\n') {
                this.onl();  // Add a newline if the line didn't end with one.
            }
            this.indent -= delta;
        }
    }
    /**
     * Handle whatever follows a ref that is not the last ref of a line.
     */
    public putAfterMiddleRef(s: string, delta): void {
        if (s) {
            this.indent += delta;
            this.putSentinel("@afterref");
            this.os(s);
            this.onl_sent();  // Not a real newline.
            this.indent -= delta;
        }
    }
    public putRefAt(name, ref, delta): void {
        // #132: Section Reference causes clone...

        // Never put any @+middle or @-middle sentinels.
        this.indent += delta;
        this.putSentinel("@+" + name);
        this.putOpenNodeSentinel(ref);
        this.putBody(ref);
        this.putCloseNodeSentinel(ref);
        this.putSentinel("@-" + name);
        this.indent -= delta;
    }
    public putBlankDocLine(): void {
        if (! this.endSentinelComment) {
            this.putIndent(this.indent);
            this.os(this.startSentinelComment);
            // #1496: Retire the @doc convention.
            // Remove the blank.
            // this.oblank()
        }
        this.onl();
    }
    /**
     * Handle one line of a doc part.
     */
    public putDocLine(s: string, i: number): void {
        const j = g.skip_line(s, i);
        const s = s[i:j];

        // #1496: Retire the @doc convention:
        // Strip all trailing ws here.
        if (! s.strip()) {
            // A blank line.
            this.putBlankDocLine();
            return;
        }
        // Write the line as it is.
        this.putIndent(this.indent);
        if (! this.endSentinelComment) {
            this.os(this.startSentinelComment);
            // #1496: Retire the @doc convention.
            // Leave this blank. The line is not blank.
            this.oblank();
        }
        this.os(s);
        if (! s.endswith('\n')) {
            this.onl();
        }
    }
    /**
     * Write the conclusion of a doc part.
     */
    public putEndDocLine(): void {
        // Put the closing delimiter if we are using block comments.
        if (this.endSentinelComment) {
            this.putIndent(this.indent);
            this.os(this.endSentinelComment);
            this.onl();  // Note: no trailing whitespace.
        }
    }
    /**
     * Write the start of a doc part.
     */
    public putStartDocLine(s: string, i: number, kind): void {
        // sentinel = "@+doc" if kind == this.docDirective else "@+at";
        const sentinel = kind == this.docDirective ? "@+doc" : "@+at";
        // directive = "@doc" if kind == this.docDirective else "@";
        const directive = kind == this.docDirective ? "@doc" : "@";
        // Put whatever follows the directive in the sentinel.
        // Skip past the directive.
        i += len(directive);
        const j = g.skip_to_end_of_line(s, i);
        const follow = s[i:j];
        // Put the opening @+doc or @-doc sentinel, including whatever follows the directive.
        this.putSentinel(sentinel + follow);
        // Put the opening comment if we are using block comments.
        if (this.endSentinelComment) {
            this.putIndent(this.indent);
            this.os(this.startSentinelComment);
            this.onl();
        }
    }
    /**
     * Return the text of a @+node or @-node sentinel for p.
     */
    public nodeSentinelText(p: Position): void {
        const h = this.removeCommentDelims(p);
        if (getattr(this, 'at_shadow_test_hack', false)) {
            // A hack for @shadow unit testing.
            // see AtShadowTestCase.makePrivateLines.
            return h;
        }
        const gnx = p.v.fileIndex;
        const level = 1 + p.level() - this.root.level();
        if (level > 2) {
            // return f"{gnx}: *{level}* {h}";
            return `${gnx}: *${level}* ${h}`;
        }
        // return f"{gnx}: {'*' * level} {h}";
        return `${gnx}: ${'*' * level} ${h}`;
    }
    /**
     * If the present @language/@comment settings do not specify a single-line comment
     * we remove all block comment delims from h. This prevents headline text from
     * interfering with the parsing of node sentinels.
     */
    public removeCommentDelims(p: Position): void {
        const start = this.startSentinelComment;
        const end = this.endSentinelComment;
        const h = p.h;
        if (end) {
            const h = h.replace(start, "");
            const h = h.replace(end, "");
        }
        return h;
    }
    /**
     * Set this.leadingWs as needed for @+others and @+<< sentinels.
     *
     * i points at the start of a line.
     * j points at @others or a section reference.
     * delta is the change in this.indent that is about to happen and hasn't happened yet.
     */
    public putLeadInSentinel(s: string, i: number, j: number, delta): void {
        const this.leadingWs = "";  // Set the default.
        if (i == j) {
            return;  // The @others or ref starts a line.
        }
        const k = g.skip_ws(s, i);
        if (j == k) {
            // Only whitespace before the @others or ref.
            const this.leadingWs = s[
                i:j];  // Remember the leading whitespace, including its spelling.
        }
        else {
            this.putIndent(this.indent);  // 1/29/04: fix bug reported by Dan Winkler.
            this.os(s[i:j]);
            this.onl_sent();
        }
    }
    /**
     * End a node.
     */
    public putCloseNodeSentinel(p: Position): void {
        const this.raw = False;  // Bug fix: 2010/07/04
    }
    /**
     * Write @+leo sentinel.
     */
    public putOpenLeoSentinel(s: string): void {
        if (this.sentinels || hasattr(this, 'force_sentinels')) {
            const s = s + "-thin";
            const encoding = this.encoding.lower();
            if (encoding != "utf-8") {
                // New in 4.2: encoding fields end in ",."
                // s = s + f"-encoding={encoding},.";
                const s = s + `-encoding=${encoding},.`;
            }
            this.putSentinel(s);
        }
    }
    /**
     * Write @+node sentinel for p.
     */
    public putOpenNodeSentinel(p: Position, inAtAll=False): void {
        // Note: lineNumbers.py overrides this method.
        if (! inAtAll && p.isAtFileNode() && p != this.root) {
            this.writeError("@file ! valid in: " + p.h);
            return;
        }
        const s = this.nodeSentinelText(p);
        this.putSentinel("@+node:" + s);
        // Leo 4.7 b2: we never write tnodeLists.
    }
    /**
     * Write a sentinel whose text is s, applying the CWEB hack if needed.
     *
     * This method outputs all sentinels.
     */
    public putSentinel(s: string): void {
        if (this.sentinels || hasattr(this, 'force_sentinels')) {
            this.putIndent(this.indent);
            this.os(this.startSentinelComment);
            // #2194. The following would follow the black convention,
            // but doing so is a dubious idea.
                // this.os('  ')
            // Apply the cweb hack to s:
            // If the opening comment delim ends in '@',
            // double all '@' signs except the first.
            const start = this.startSentinelComment;
            if (start && start[-1] == '@') {
                const s = s.replace('@', '@@')[1:];
            }
            this.os(s);
            if (this.endSentinelComment) {
                this.os(this.endSentinelComment);
            }
            this.onl();
        }
    }
    /**
     * Mark the root as erroneous for c.raise_error_dialogs().
     */
    public addToOrphanList(root): void {
        const c = this.c;
        // Fix #1050:
        root.setOrphan();
        c.orphan_at_file_nodes.append(root.h);
    }
    /**
     * Return True if the path is writable.
     */
    public isWritable(path): void {
        try {
            // os.access() may not exist on all platforms.
            const ok = os.access(path, os.W_OK);
        }
        catch (AttributeError) {
            return true;
        }
        if (! ok) {
            g.es('read only:', repr(path), color='red');
        }
        return ok;
    }
    /**
     * Perform python-related checks on root.
     */
    public checkPythonCode(contents, fileName, root, pyflakes_errors_only=False): void {
        if (
            contents && fileName && fileName.endswith('.py')
            && this.checkPythonCodeOnWrite
        ) {
            // It's too slow to check each node separately.
            if (pyflakes_errors_only) {
                const ok = true;
            }
            else {
                const ok = this.checkPythonSyntax(root, contents);
            }
            // Syntax checking catches most indentation problems.
                // if ok: this.tabNannyNode(root,s)
            if (ok && this.runPyFlakesOnWrite && ! g.unitTesting) {
                const ok2 = this.runPyflakes(root, pyflakes_errors_only=pyflakes_errors_only);
            }
            else {
                const ok2 = true;
            }
            if (! ok || ! ok2) {
                g.app.syntax_error_files.append(g.shortFileName(fileName));
            }
        }
    }
    public checkPythonSyntax(p: Position, body, suppress=False): void {
        try {
            const body = body.replace('\r', '');
            // fn = f"<node: {p.h}>";
            const fn = `<node: ${p.h}>`;
            compile(body + '\n', fn, 'exec');
            return true;
        }
        catch (SyntaxError) {
            if (! suppress) {
                this.syntaxError(p, body);
            }
        }
        catch (Exception) {
            g.trace("unexpected exception");
            g.es_exception();
        }
        return false;
    }
    /**
     * Report a syntax error.
     */
    public syntaxError(p: Position, body): void {
        // g.error(f"Syntax error in: {p.h}");
        g.error(`Syntax error in: ${p.h}`);
        typ, val, tb = sys.exc_info();
        const message = hasattr(val, 'message') && val.message;
        if (message) {
            g.es_print(message);
        }
        if (val == null) {
            return;
        }
        const lines = g.splitLines(body);
        const n = val.lineno;
        const offset = val.offset || 0;
        if (n == null) {
            return;
        }
        const i = val.lineno - 1;
        for (j in range(max(0, i - 2), min(i + 2, len(lines) - 1))) {
            const line = lines[j].rstrip();
            if (j == i) {
                const unl = p.get_UNL(with_proto=true, with_count=true);
                // g.es_print(f"{j+1:5}:* {line}", nodeLink=f"{unl},-{j+1:d}");  // Global line.
                g.es_print(`${j+1:5}:* ${line}`, nodeLink=f"{unl},-{j+1:d}");  // Global line.
                g.es_print(' ' * (7 + offset) + '^');
            }
            else {
                // g.es_print(f"{j+1:5}: {line}");
                g.es_print(`${j+1:5}: ${line}`);
            }
        }
    }
    /**
     * Run pyflakes on the selected node.
     */
    public runPyflakes(root, pyflakes_errors_only): void {
        try {
            // from "leo.commands" import checkerCommands
            if (checkerCommands.pyflakes) {
                const x = checkerCommands.PyflakesCommand(this.c);
                const ok = x.run(p=root, pyflakes_errors_only=pyflakes_errors_only);
                return ok;
            }
            return True;  // Suppress error if pyflakes can not be imported.
        }
        catch (Exception) {
            g.es_exception();
            return false;
        }
    }
    public tabNannyNode(p: Position, body): void {
        try {
            const readline = g.ReadLinesClass(body).next;
            tabnanny.process_tokens(tokenize.generate_tokens(readline));
        }
        catch (IndentationError) {
            if (g.unitTesting) {
                raise;
            }
            junk2, msg, junk = sys.exc_info();
            g.error("IndentationError in", p.h);
            g.es('', str(msg));
        }
        catch (tokenize.TokenError) {
            if (g.unitTesting) {
                raise;
            }
            junk3, msg, junk = sys.exc_info();
            g.error("TokenError in", p.h);
            g.es('', str(msg));
        }
        catch (tabnanny.NannyNag) {
            if (g.unitTesting) {
                raise;
            }
            junk4, nag, junk = sys.exc_info();
            const badline = nag.get_lineno();
            const line = nag.get_line();
            const message = nag.get_msg();
            g.error("indentation error in", p.h, "line", badline);
            g.es(message);
            const line2 = repr(str(line))[1:-1];
            g.es("offending line:\n", line2);
        }
        catch (Exception) {
            g.trace("unexpected exception");
            g.es_exception();
            raise;
        }
    }
    // These patterns exclude constructs such as @encoding.setter or @encoding(whatever)
    // However, they must allow @language typescript, @nocolor-node, etc.

    const at_directive_kind_pattern = re.compile(r'\s*@([\w-]+)\s*');

    /**
     * Return the kind of at-directive or noDirective.
     *
     * Potential simplifications:
     * - Using strings instead of constants.
     * - Using additional regex's to recognize directives.
     */
    public directiveKind4(s: string, i: number): void {
        const n = len(s);
        if (i >= n || s[i] != '@') {
            const j = g.skip_ws(s, i);
            if (g.match_word(s, j, "@others")) {
                return this.othersDirective;
            }
            if (g.match_word(s, j, "@all")) {
                return this.allDirective;
            }
            return this.noDirective;
        }
        const table = (
            ("@all", this.allDirective),
            ("@c", this.cDirective),
            ("@code", this.codeDirective),
            ("@doc", this.docDirective),
            ("@end_raw", this.endRawDirective),
            ("@others", this.othersDirective),
            ("@raw", this.rawDirective),
            ("@verbatim", this.startVerbatim));
        // Rewritten 6/8/2005.
        if (i + 1 >= n || s[i + 1] in (' ', '\t', '\n')) {
            // Bare '@' not recognized in cweb mode.
            // return this.noDirective if this.language == "cweb" else this.atDirective;
            return this.language == "cweb" ? this.noDirective : this.atDirective;
        }
        if (! s[i + 1].isalpha()) {
            return this.noDirective  // Bug fix: do NOT return miscDirective here!
        }
        if (this.language == "cweb" && g.match_word(s, i, '@c')) {
            return this.noDirective;
        }
        for (name, directive in table) {
            if (g.match_word(s, i, name)) {
                return directive;
            }
        }
        // Support for add_directives plugin.
        // Use regex to properly distinguish between Leo directives
        // and python decorators.
        const s2 = s[i:];
        const m = this.at_directive_kind_pattern.match(s2);
        if (m) {
            const word = m.group(1);
            if (word ! in g.globalDirectiveList) {
                return this.noDirective;
            }
            const s3 = s2[m.end(1) :];
            if (s3 && s3[0] in ".(") {
                return this.noDirective;
            }
            return this.miscDirective;
        }
        return this.noDirective;
    }
    // returns (flag, end). end is the index of the character after the section name.

    public isSectionName(s: string, i: number): void {
        // 2013/08/01: bug fix: allow leading periods.
        while (i < len(s) && s[i] == '.') {
            i += 1;
        }
        if (! g.match(s, i, "<<")) {
            return false, -1;
        }
        const i = g.find_on_line(s, i, ">>");
        if (i > -1) {
            return true, i + 2;
        }
        return false, -1;
    }
    public oblank(): void {
        this.os(' ');
    }

    public oblanks(n: number): void {
        this.os(' ' * abs(n));
    }

    public otabs(n: number): void {
        this.os('\t' * abs(n));
    }
    /**
     * Write a newline to the output stream.
     */
    public onl(): void {
        this.os('\n');  // **not** this.output_newline
    }

    /**
     * Write a newline to the output stream, provided we are outputting sentinels.
     */
    public onl_sent(): void {
        if (this.sentinels) {
            this.onl();
        }
    }
    /**
     * Append a string to this.outputList.
     *
     * All output produced by leoAtFile module goes here.
     */
    public os(s: string): void {
        if (s.startswith(this.underindentEscapeString)) {
            try {
                junk, s = this.parseUnderindentTag(s);
            }
            catch (Exception) {
                this.exception("exception writing:" + s);
                return;
            }
        }
        const s = g.toUnicode(s, this.encoding);
        this.outputList.append(s);
    }
    /**
     * Write the string s as-is except that we replace '\n' with the proper line ending.
     *
     * Calling this.onl() runs afoul of queued newlines.
     */
    public outputStringWithLineEndings(s: string): void {
        const s = g.toUnicode(s, this.encoding);
        const s = s.replace('\n', this.output_newline);
        this.os(s);
    }
    /**
     * Check whether a dirty, potentially dangerous, file should be written.
     *
     * Return True if so.  Return False *and* issue a warning otherwise.
     */
    public precheck(fileName, root): void {

        // #1450: First, check that the directory exists.
        const theDir = g.os_path_dirname(fileName);
        if (theDir && ! g.os_path_exists(theDir)) {
            // this.error(f"Directory ! found:\n{theDir}");
            this.error(`Directory not found:\n${theDir}`);
            return false;
        }

        // Now check the file.
        if (! this.shouldPromptForDangerousWrite(fileName, root)) {
            // Fix bug 889175: Remember the full fileName.
            this.rememberReadPath(fileName, root);
            return true;
        }

        // Prompt if the write would overwrite the existing file.
        const ok = this.promptForDangerousWrite(fileName);
        if (ok) {
            // Fix bug 889175: Remember the full fileName.
            this.rememberReadPath(fileName, root);
            return true;
        }

        // Fix #1031: do not add @ignore here!
        g.es("! written:", fileName);
        return false;
    }
    /**
     * Write any @firstlines from string s.
     * These lines are converted to @verbatim lines,
     * so the read logic simply ignores lines preceding the @+leo sentinel.
     */
    public putAtFirstLines(s: string): void {
        const tag = "@first";
        const i = 0;
        while (g.match(s, i, tag)) {
            i += len(tag);
            const i = g.skip_ws(s, i);
            const j = i;
            const i = g.skip_to_end_of_line(s, i);
            // Write @first line, whether empty or not
            const line = s[j:i];
            this.os(line);
            this.onl();
            const i = g.skip_nl(s, i);
        }
    }
    /**
     * Write any @last lines from string s.
     * These lines are converted to @verbatim lines,
     * so the read logic simply ignores lines following the @-leo sentinel.
     */
    public putAtLastLines(s: string): void {
        const tag = "@last";
        // Use g.splitLines to preserve trailing newlines.
        const lines = g.splitLines(s);
        const n = len(lines);
        const j = k = n - 1;
        // Scan backwards for @last directives.
        while (j >= 0) {
            const line = lines[j];
            if (g.match(line, 0, tag)) {
                j -= 1;
            }
            else if (! line.strip()) {
                j -= 1;
            }
            else { // break
            }
        }
        // Write the @last lines.
        for (line in lines[j + 1) { // k + 1]:
            if (g.match(line, 0, tag)) {
                const i = len(tag);
                const i = g.skip_ws(line, i);
                this.os(line[i:]);
            }
        }
    }
    /**
     * Output a sentinel a directive or reference s.
     *
     * It is important for PHP and other situations that \@first and \@last
     * directives get translated to verbatim lines that do *not* include what
     * follows the @first & @last directives.
     */
    public putDirective(s: string, i: number, p: Position): void {
        const k = i;
        const j = g.skip_to_end_of_line(s, i);
        const directive = s[i:j];
        if (g.match_word(s, k, "@delims")) {
            this.putDelims(directive, s, k);
        }
        else if (g.match_word(s, k, "@language")) {
            this.putSentinel("@" + directive);
        }
        else if (g.match_word(s, k, "@comment")) {
            this.putSentinel("@" + directive);
        }
        else if (g.match_word(s, k, "@last")) {
            // #1307.
            if (p.isAtCleanNode()) {
                // this.error(f"ignoring @last directive in {p.h!r}");
                this.error(`ignoring @last directive in ${p.h}`);
                g.es_print('@last != valid in @clean nodes');
            }
            // #1297.
            else if (g.app.inScript || g.unitTesting || p.isAnyAtFileNode()) {
                this.putSentinel("@@last");
                    // Convert to an verbatim line _without_ anything else.
            }
            else {
                // this.error(f"ignoring @last directive in {p.h!r}");
                this.error(`ignoring @last directive in ${p.h}`);
            }
        }
        else if (g.match_word(s, k, "@first")) {
            // #1307.
            if (p.isAtCleanNode()) {
                // this.error(f"ignoring @first directive in {p.h!r}");
                this.error(`ignoring @first directive in ${p.h}`);
                g.es_print('@first != valid in @clean nodes');
            }
            // #1297.
            else if (g.app.inScript || g.unitTesting || p.isAnyAtFileNode()) {
                this.putSentinel("@@first");
                    // Convert to an verbatim line _without_ anything else.
            }
            else {
                // this.error(f"ignoring @first directive in {p.h!r}");
                this.error(`ignoring @first directive in ${p.h}`);
            }
        }
        else {
            this.putSentinel("@" + directive);
        }
        const i = g.skip_line(s, k);
        return i;
    }
    /**
     * Put an @delims directive.
     */
    public putDelims(directive, s: string, k: number): void {
        // Put a space to protect the last delim.
        this.putSentinel(directive + " ");  // 10/23/02: put @delims, not @@delims
        // Skip the keyword and whitespace.
        const j = i = g.skip_ws(s, k + len("@delims"));
        // Get the first delim.
        while (i < len(s) && ! g.is_ws(s[i]) && ! g.is_nl(s, i)) {
            i += 1;
        }
        if (j < i) {
            const this.startSentinelComment = s[j:i];
            // Get the optional second delim.
            const j = i = g.skip_ws(s, i);
            while (i < len(s) && ! g.is_ws(s[i]) && ! g.is_nl(s, i)) {
                i += 1;
            }
            // this.endSentinelComment = s[j:i] if j < i else "";
            const this.endSentinelComment = j < i ? s[j:i] : "";
        }
        else {
            this.writeError("Bad @delims directive");
        }
    }
    /**
     * Put tabs and spaces corresponding to n spaces,
     * assuming that we are at the start of a line.
     *
     * Remove extra blanks if the line starts with the underindentEscapeString
     */
    public putIndent(n: number, s=''): void {
        const tag = this.underindentEscapeString;
        if (s.startswith(tag)) {
            n2, s2 = this.parseUnderindentTag(s);
            if (n2 >= n) {
                return;
            }
            if (n > 0) {
                n -= n2;
            }
            else {
                n += n2;
            }
        }
        if (n > 0) {
            const w = this.tab_width;
            if (w > 1) {
                q, r = divmod(n, w);
                this.otabs(q);
                this.oblanks(r);
            }
            else {
                this.oblanks(n);
            }
        }
    }
    public putInitialComment(): void {
        const c = this.c;
        const s2 = c.config.output_initial_comment;
        if (s2) {
            const lines = s2.split("\\n");
            for (line in lines) {
                const line = line.replace("@date", time.asctime());
                if (line) {
                    this.putSentinel("@comment " + line);
                }
            }
        }
    }
    /**
     * Write or create the given file from the contents.
     * Return True if the original file was changed.
     */
    public replaceFile(contents, encoding, fileName, root, ignoreBlankLines=False): void {
        const c = this.c;
        if (root) {
            root.clearDirty();
        }

        // Create the timestamp (only for messages).
        if (c.config.getBool('log-show-save-time', default_val=false)) {
            format = c.config.getString('log-timestamp-format') || "%H:%M:%S";
            const timestamp = time.strftime(format) + ' ';
        }
        else {
            const timestamp = '';
        }

        // Adjust the contents.
        // assert isinstance(contents, str), g.callers();
        if (this.output_newline != '\n') {
            const contents = contents.replace('\r', '').replace('\n', this.output_newline);
        }

        // If file does not exist, create it from the contents.
        const fileName = g.os_path_realpath(fileName);
        const sfn = g.shortFileName(fileName);
        if (! g.os_path_exists(fileName)) {
            const ok = g.writeFile(contents, encoding, fileName);
            if (ok) {
                c.setFileTimeStamp(fileName);
                if (! g.unitTesting) {
                    // g.es(f"{timestamp}created: {fileName}");
                    g.es(`${timestamp}created: ${fileName}`);
                }
                if (root) {
                    // Fix bug 889175: Remember the full fileName.
                    this.rememberReadPath(fileName, root);
                    this.checkPythonCode(contents, fileName, root);
                }
            }
            else {
                this.addToOrphanList(root);
            }
            // No original file to change. Return value tested by a unit test.
            return False;  // No change to original file.
        }

        // Compare the old and new contents.
        const old_contents = g.readFileIntoUnicodeString(fileName,
            encoding=this.encoding, silent=true);
        if (! old_contents) {
            const old_contents = '';
        }
        const unchanged = (
            contents == old_contents;
            || (! this.explicitLineEnding && this.compareIgnoringLineEndings(old_contents, contents));
            || ignoreBlankLines && this.compareIgnoringBlankLines(old_contents, contents));
        if (unchanged) {
            this.unchangedFiles += 1;
            if ! g.unitTesting && c.config.getBool(
                'report-unchanged-files', default_val=true):
                // g.es(f"{timestamp}unchanged: {sfn}");
                g.es(`${timestamp}unchanged: ${sfn}`);
            // Leo 5.6: Check unchanged files.
            this.checkPythonCode(contents, fileName, root, pyflakes_errors_only=true);
            return False;  // No change to original file.
        }

        // Warn if we are only adjusting the line endings.
        if (this.explicitLineEnding) {
            const ok = (
                this.compareIgnoringLineEndings(old_contents, contents) ||
                ignoreBlankLines && this.compareIgnoringLineEndings(
                old_contents, contents));
            if (! ok) {
                g.warning("correcting line endings in:", fileName);
            }
        }

        // Write a changed file.
        const ok = g.writeFile(contents, encoding, fileName);
        if (ok) {
            c.setFileTimeStamp(fileName);
            if (! g.unitTesting) {
                // g.es(f"{timestamp}wrote: {sfn}");
                g.es(`${timestamp}wrote: ${sfn}`);
            }
        }
        else {
            g.error('error writing', sfn);
            g.es('! written:', sfn);
            this.addToOrphanList(root);
        }
        this.checkPythonCode(contents, fileName, root);
            // Check *after* writing the file.
        return ok;
    }
    /**
     * Compare two strings, ignoring blank lines.
     */
    public compareIgnoringBlankLines(s1, s2): void {
        // assert isinstance(s1, str), g.callers();
        // assert isinstance(s2, str), g.callers();
        if (s1 == s2) {
            return true;
        }
        const s1 = g.removeBlankLines(s1);
        const s2 = g.removeBlankLines(s2);
        return s1 == s2;
    }
    /**
     * Compare two strings, ignoring line endings.
     */
    public compareIgnoringLineEndings(s1, s2): void {
        // assert isinstance(s1, str), (repr(s1), g.callers());
        // assert isinstance(s2, str), (repr(s2), g.callers());
        if (s1 == s2) {
            return true;
        }
        // Wrong: equivalent to ignoreBlankLines!
            // s1 = s1.replace('\n','').replace('\r','')
            // s2 = s2.replace('\n','').replace('\r','')
        const s1 = s1.replace('\r', '');
        const s2 = s2.replace('\r', '');
        return s1 == s2;
    }
    // Called from putFile.

    public warnAboutOrphandAndIgnoredNodes(): void {
        // Always warn, even when language=="cweb"
        this, root = this, this.root;
        if (this.errors) {
            return;  // No need to repeat this.
        }
        for (p in root.self_and_subtree(copy=false)) {
            if (! p.v.isVisited()) {
                this.writeError("Orphan node:  " + p.h);
                if (p.hasParent()) {
                    g.blue("parent node:", p.parent().h);
                }
            }
        }
        const p = root.copy();
        const after = p.nodeAfterTree();
        while (p && p != after) {
            if (p.isAtAllNode()) {
                p.moveToNodeAfterTree();
            }
            else {
                // #1050: test orphan bit.
                if (p.isOrphan()) {
                    this.writeError("Orphan node: " + p.h);
                    if (p.hasParent()) {
                        g.blue("parent node:", p.parent().h);
                    }
                }
                p.moveToThreadNext();
            }
        }
    }
    /**
     * Issue an error while writing an @<file> node.
     */
    public writeError(message): void {
        if (this.errors == 0) {
            const fn = this.targetFileName || 'unnamed file';
            // g.es_error(f"errors writing: {fn}");
            g.es_error(`errors writing: ${fn}`);
        }
        this.error(message);
        this.addToOrphanList(this.root);
    }
    public writeException(fileName, root): void {
        g.error("exception writing:", fileName);
        g.es_exception();
        if (getattr(this, 'outputFile', null)) {
            this.outputFile.flush();
            this.outputFile.close();
            const this.outputFile = null;
        }
        this.remove(fileName);
        this.addToOrphanList(root);
    }
    public error(*args): void {
        this.printError(*args);
        this.errors += 1;
    }

    /**
     * Print an error message that may contain non-ascii characters.
     */
    public printError(*args): void {
        if (this.errors) {
            g.error(*args);
        }
        else {
            g.warning(*args);
        }
    }
    public exception(message): void {
        this.error(message);
        g.es_exception();
    }
    // Error checking versions of corresponding functions in Python's os module.
    public chmod(fileName, mode): void {
        // Do _not_ call this.error here.
        if (mode == null) {
            return;
        }
        try {
            os.chmod(fileName, mode);
        }
        catch (Exception) {
            g.es("exception in os.chmod", fileName);
            g.es_exception();
        }

    }
    public remove(fileName): void {
        if (! fileName) {
            g.trace('No file name', g.callers());
            return false;
        }
        try {
            os.remove(fileName);
            return true;
        }
        catch (Exception) {
            if (! g.unitTesting) {
                // this.error(f"exception removing: {fileName}");
                this.error(`exception removing: ${fileName}`);
                g.es_exception();
            }
            return false;
        }
    }
    /**
     * Return the access mode of named file, removing any setuid, setgid, and sticky bits.
     */
    public stat(fileName): void {
        // Do _not_ call this.error here.
        try {
            const mode = (os.stat(fileName))[0] & (7 * 8 * 8 + 7 * 8 + 7);  // 0777
        }
        catch (Exception) {
            const mode = null;
        }
        return mode;

    }
    public getPathUa(p: Position): void {
        if (hasattr(p.v, 'tempAttributes')) {
            const d = p.v.tempAttributes.get('read-path', {});
            return d.get('path');
        }
        return '';
    }

    public setPathUa(p: Position, path): void {
        if (! hasattr(p.v, 'tempAttributes')) {
            const p.v.tempAttributes = {};
        }
        const d = p.v.tempAttributes.get('read-path', {});
        const d['path'] = path;
        const p.v.tempAttributes['read-path'] = d;
    }
    // Important: this is part of the *write* logic.
    // It is called from this.os and this.putIndent.

    public parseUnderindentTag(s: string): void {
        const tag = this.underindentEscapeString;
        const s2 = s[len(tag) :];
        // To be valid, the escape must be followed by at least one digit.
        const i = 0;
        while (i < len(s2) && s2[i].isdigit()) {
            i += 1;
        }
        if (i > 0) {
            const n = int(s2[:i]);
            // Bug fix: 2012/06/05: remove any period following the count.
            // This is a new convention.
            if (i < len(s2) && s2[i] == '.') {
                i += 1;
            }
            return n, s2[i:];
        }
        return 0, s;
    }
    /**
     * Raise a dialog asking the user whether to overwrite an existing file.
     */
    public promptForDangerousWrite(fileName, message=null): void {
        this, c, root = this, this.c, this.root;
        if (this.cancelFlag) {
            // assert this.canCancelFlag;
            return false;
        }
        if (this.yesToAll) {
            // assert this.canCancelFlag;
            return true;
        }
        if (root && root.h.startswith('@auto-rst')) {
            // Fix bug 50: body text lost switching @file to @auto-rst
            // Refuse to convert any @<file> node to @auto-rst.
            // d = root.v.at_read if hasattr(root.v, 'at_read') else {};
            const d = hasattr(root.v, 'at_read') ? root.v.at_read : {};
            const aList = sorted(d.get(fileName, []));
            for (h in aList) {
                if (! h.startswith('@auto-rst')) {
                    g.es('can ! convert @file to @auto-rst!', color='red');
                    g.es('reverting to:', h);
                    const root.h = h;
                    c.redraw();
                    return false;
                }
            }
        }
        if (message == null) {
            const message = (
                // f"{g.splitLongFileName(fileName)}\n";
                `${g.splitLongFileName(fileName)}\n`;
                // f"{g.tr('already exists.')}\n";
                `${g.tr('already exists.')}\n`;
                // f"{g.tr('Overwrite this file?')}");
                `${g.tr('Overwrite this file?')}`);
        }
        const result = g.app.gui.runAskYesNoCancelDialog(c,
            title='Overwrite existing file?',
            yesToAllMessage="Yes To &All",
            message=message,
            cancelMessage="&Cancel (No To All)",
        );
        if (this.canCancelFlag) {
            // We are in the writeAll logic so these flags can be set.
            if (result == 'cancel') {
                const this.cancelFlag = true;
            }
            else if (result == 'yes-to-all') {
                const this.yesToAll = true;
            }
        }
        return result in ('yes', 'yes-to-all');
    }
    /**
     * Remember the files that have been read *and*
     * the full headline (@<file> type) that caused the read.
     */
    public rememberReadPath(fn, p: Position): void {
        const v = p.v;
        // Fix bug #50: body text lost switching @file to @auto-rst
        if (! hasattr(v, 'at_read')) {
            const v.at_read = {};
        }
        const d = v.at_read;
        const aSet = d.get(fn, set());
        aSet.add(p.h);
        const d[fn] = aSet;
    }
    /**
     * Scan p and p's ancestors looking for directives,
     * setting corresponding AtFile ivars.
     */
    public scanAllDirectives(p: Position): void {
        const c = this.c;
        const d = c.scanAllDirectives(p);

        // Language & delims: Tricky.
        const lang_dict = d.get('lang-dict') || {};
        delims, language = null, null;
        if (lang_dict) {
            // There was an @delims or @language directive.
            const language = lang_dict.get('language');
            const delims = lang_dict.get('delims');
        }
        if (! language) {
            // No language directive.  Look for @<file> nodes.
            // Do *not* used.get('language')!
            const language = g.getLanguageFromAncestorAtFileNode(p) || 'python';
        }
        const this.language = language;
        if (! delims) {
            const delims = g.set_delims_from_language(language);
        }

        // Previously, setting delims was sometimes skipped, depending on kwargs.
        delim1, delim2, delim3 = delims;
        // Use single-line comments if we have a choice.
        // delim1,delim2,delim3 now correspond to line,start,end
        if (delim1) {
            const this.startSentinelComment = delim1;
            const this.endSentinelComment = "";  // Must not be null.
        }
        else if (delim2 && delim3) {
            const this.startSentinelComment = delim2;
            const this.endSentinelComment = delim3;
        }
        else { // # Emergency!

            // Issue an error only if this.language has been set.
            // This suppresses a message from the markdown importer.
            if (! g.unitTesting && this.language) {
                g.trace(repr(this.language), g.callers());
                g.es_print("unknown language: using Python comment delimiters");
                g.es_print("c.target_language:", c.target_language);
            }
            const this.startSentinelComment = "  // "  # This should never happen!
            const this.endSentinelComment = "";
        }

        // Easy cases
        const this.encoding = d.get('encoding') || c.config.default_derived_file_encoding;
        const lineending = d.get('lineending');
        const this.explicitLineEnding = bool(lineending);
        const this.output_newline = lineending || g.getOutputNewline(c=c);
        const this.page_width = d.get('pagewidth') || c.page_width;
        const this.tab_width = d.get('tabwidth') || c.tab_width;
        return {
            "encoding": this.encoding,
            "language": this.language,
            "lineending": this.output_newline,
            "pagewidth": this.page_width,
            "path": d.get('path'),
            "tabwidth": this.tab_width,
        }
    }
    /**
     * Return True if Leo should warn the user that p is an @<file> node that
     * was not read during startup. Writing that file might cause data loss.
     *
     * See #50: https://github.com/leo-editor/leo-editor/issues/50
     */
    public shouldPromptForDangerousWrite(fn, p: Position): void {
        const trace = 'save' in g.app.debug;
        const sfn = g.shortFileName(fn);
        const c = this.c;
        const efc = g.app.externalFilesController;
        if (p.isAtNoSentFileNode()) {
            // #1450.
            // No danger of overwriting a file.
            // It was never read.
            return false;
        }
        if (! g.os_path_exists(fn)) {
            // No danger of overwriting fn.
            if (trace) {
                g.trace('Return false: does ! exist:', sfn);
            }
            return false;
        }
        // #1347: Prompt if the external file is newer.
        if (efc) {
            // Like c.checkFileTimeStamp.
            if (c.sqlite_connection && c.mFileName == fn) {
                // sqlite database file is never actually overwriten by Leo,
                // so do *not* check its timestamp.
                pass;
            }
            else if (efc.has_changed(fn)) {
                if (trace) {
                    g.trace('Return true: changed:', sfn);
                }
                return true;
            }
        }
        if (hasattr(p.v, 'at_read')) {
            // Fix bug #50: body text lost switching @file to @auto-rst
            const d = p.v.at_read;
            for (k in d) {
                // Fix bug # #1469: make sure k still exists.
                if (
                    os.path.exists(k) && os.path.samefile(k, fn)
                    && p.h in d.get(k, set())
                ) {
                    const d[fn] = d[k];
                    if (trace) {
                        g.trace('Return false: in p.v.at_read:', sfn);
                    }
                    return false;
                }
            }
            const aSet = d.get(fn, set());
            if (trace) {
                // g.trace(f"Return {p.h ! in aSet()}: p.h ! in aSet(): {sfn}");
                g.trace(`Return ${p.h not in aSet()}: p.h not in aSet(): ${sfn}`);
            }
            return p.h ! in aSet;
        }
        if (trace) {
            g.trace('Return true: never read:', sfn);
        }
        return True;  // The file was never read.
    }
    public warnOnReadOnlyFile(fn): void {
        // os.access() may not exist on all platforms.
        try {
            const read_only = ! os.access(fn, os.W_OK);
        }
        catch (AttributeError) {
            const read_only = false;
        }
        if (read_only) {
            g.error("read only:", fn);
        }
    }
}
const atFile = AtFile;  // compatibility
/**
 * Read an exteral file, created from an @file tree.
 * This is Vitalije's code, edited by EKR.
 */
class FastAtRead {

    public constructor(c: Commands, gnx2vnode, test=False, TestVNode=null) {
        const this.c = c;
        // assert gnx2vnode != null;
        const this.gnx2vnode = gnx2vnode;
            // The global fc.gnxDict. Keys are gnx's, values are vnodes.
        const this.path = null;
        const this.root = null;
        // this.VNode = TestVNode if test else leoNodes.VNode;
        const this.VNode = test ? TestVNode : leoNodes.VNode;
        const this.test = test;
    }

    /**
     * Create regex patterns for the given comment delims.
     */
    public get_patterns(delims): void {
        // This must be a function, because of @comments & @delims.
        delim_start, delim_end = delims;
        const delims = re.escape(delim_start), re.escape(delim_end || '');
        delim1, delim2 = delims;
        const ref = g.angleBrackets(r'(.*)');
        const patterns = (
            // The list of patterns, in alphabetical order.
            // These patterns must be mutually exclusive.
            fr'^\s*{delim1}@afterref{delim2}$',;  // @afterref
            fr'^(\s*){delim1}@(\+|-)all\b(.*){delim2}$',;  // @all
            fr'^\s*{delim1}@@c(ode)?{delim2}$',;  // @c and @code
            fr'^\s*{delim1}@comment(.*){delim2}',;  // @comment
            fr'^\s*{delim1}@delims(.*){delim2}',;  // @delims
            fr'^\s*{delim1}@\+(at|doc)?(\s.*?)?{delim2}\n',;  // @doc or @
            fr'^\s*{delim1}@end_raw\s*{delim2}',;  // @end_raw
            fr'^\s*{delim1}@@first{delim2}$',;  // @first
            fr'^\s*{delim1}@@last{delim2}$',;  // @last
            fr'^(\s*){delim1}@\+node:([^:]+): \*(\d+)?(\*?) (.*){delim2}$',;  // @node
            fr'^(\s*){delim1}@(\+|-)others\b(.*){delim2}$',;  // @others
            fr'^\s*{delim1}@raw(.*){delim2}',;  // @raw
            fr'^(\s*){delim1}@(\+|-){ref}\s*{delim2}$';  // section ref
        );
        // Return the compiled patterns, in alphabetical order.
        return (re.compile(pattern) for pattern in patterns);
    }
    /**
     * Set all body text.
     */
    public post_pass(gnx2body, gnx2vnode, root_v): void {
        // Set the body text.
        if (this.test) {
            // Check the keys.
            const bkeys = sorted(gnx2body.keys());
            const vkeys = sorted(gnx2vnode.keys());
            if (bkeys != vkeys) {
                g.trace('KEYS MISMATCH');
                g.printObj(bkeys);
                g.printObj(vkeys);
                if (this.test) {
                    sys.exit(1);
                }
            }
            // Set the body text.
            for (key in vkeys) {
                const v = gnx2vnode.get(key);
                const body = gnx2body.get(key);
                const v._bodyString = ''.join(body);
            }
        }
        else {
            // assert root_v.gnx in gnx2vnode, root_v;
            // assert root_v.gnx in gnx2body, root_v;
            for (key in gnx2body) {
                const body = gnx2body.get(key);
                const v = gnx2vnode.get(key);
                // assert v, (key, v);
                const v._bodyString = g.toUnicode(''.join(body));
            }
        }
    }
    const header_pattern = re.compile(
        /**
         * ^(.+)@\+leo
         * (-ver=(\d+))?
         * (-thin)?
         * (-encoding=(.*)(\.))?
         * (.*)$,
         */
        re.VERBOSE,
    );

    /**
     * Scan for the header line, which follows any @first lines.
     * Return (delims, first_lines, i+1) or null
     */
    public scan_header(lines): void {
        const first_lines: List[str] = [];
        const i = 0;  // To keep some versions of pylint happy.
        for (i, line in enumerate(lines)) {
            const m = this.header_pattern.match(line);
            if (m) {
                const delims = m.group(1), m.group(8) || '';
                return delims, first_lines, i + 1;
            }
            first_lines.append(line);
        }
        return null;
    }
    /**
     * Scan all lines of the file, creating vnodes.
     */
    public scan_lines(delims, first_lines, lines, path, start): void {

        // Simple vars...
        const afterref = False;  // A special verbatim line follows @afterref.
        const clone_v = null;  // The root of the clone tree.
        delim_start, delim_end = delims;  // The start/end delims.
        const doc_skip = (delim_start + '\n', delim_end + '\n');  // To handle doc parts.
        const first_i = 0;  // Index into first array.
        const in_doc = False;  // True: in @doc parts.
        const in_raw = False;  // True: @raw seen.
        const is_cweb = delim_start == '@q@' and delim_end == '@>';  // True: cweb hack in effect.
        const indent = 0;  // The current indentation.
        const level_stack = [];  // Entries are (vnode, in_clone_tree)
        const n_last_lines = 0;  // The number of @@last directives seen.
        // #1065 so reads will not create spurious child nodes.
        const root_seen = False;  // False: The next +@node sentinel denotes the root, regardless of gnx.
        const sentinel = delim_start + '@'  // Faster than a regex!
        // The stack is updated when at+others, at+<section>, or at+all is seen.
        const stack = [];  // Entries are (gnx, indent, body)
        const verbline = delim_start + '@verbatim' + delim_end + '\n';  // The spelling of at-verbatim sentinel
        const verbatim = False;  // True: the next line must be added without change.

        // Init the data for the root node.



        // Init the parent vnode for testing.

        if (this.test) {
            // Start with the gnx for the @file node.
            const root_gnx = gnx = 'root-gnx';  // The node that we are reading.
            const gnx_head = '<hidden top vnode>';  // The headline of the root node.
            const context = null;
            const parent_v = this.VNode(context=context, gnx=gnx);
            const parent_v._headString = gnx_head;  // Corresponds to the @files node itself.
        }
        else {
            // Production.
            const root_gnx = gnx = this.root.gnx;
            const context = this.c;
            const parent_v = this.root.v;
        }
        const root_v = parent_v;  // Does not change.
        level_stack.append((root_v, false),);

        // Init the gnx dict last.

        const gnx2vnode = this.gnx2vnode;  // Keys are gnx's, values are vnodes.
        const gnx2body = {};  // Keys are gnxs, values are list of body lines.
        const gnx2vnode[gnx] = parent_v;  // Add gnx to the keys
        // Add gnx to the keys.
        // Body is the list of lines presently being accumulated.
        const gnx2body[gnx] = body = first_lines;

        // get the patterns.
        const data = this.get_patterns(delims);
        // pylint: disable=line-too-long
        after_pat, all_pat, code_pat, comment_pat, delims_pat, doc_pat, end_raw_pat, first_pat, last_pat, node_start_pat, others_pat, raw_pat, ref_pat = data;
        /**
         * Dump the level stack and v.
         */
        public function dump_v(): void {
            print('----- LEVEL', level, v.h);
            print('       PARENT', parent_v.h);
            print('[');
            for (i, data in enumerate(level_stack)) {
                v2, in_tree = data;
                // print(f"{i+1:2} {in_tree:5} {v2.h}");
                print(`${i+1:2} ${in_tree:5} ${v2.h}`);
            }
            print(']');
            print('PARENT.CHILDREN...');
            g.printObj([v3.h for v3 in parent_v.children]);
            print('PARENTS...');
            g.printObj([v4.h for v4 in v.parents]);

        }

        const i = 0;  // To keep pylint happy.
        for (i, line in enumerate(lines[start) { // ]):
            // Order matters.
            if (verbatim) {
                // We are in raw mode, or other special situation.
                // Previous line was verbatim sentinel. Append this line as it is.
                if (afterref) {
                    const afterref = false;
                    if (body) { // # a List of lines.
                        const body[-1] = body[-1].rstrip() + line;
                    }
                    else {
                        const body = [line];
                    }
                    const verbatim = false;
                }
                else if (in_raw) {
                    const m = end_raw_pat.match(line);
                    if (m) {
                        const in_raw = false;
                        const verbatim = false;
                    }
                    else {
                        // Continue verbatim/raw mode.
                        body.append(line);
                    }
                }
                else {
                    body.append(line);
                    const verbatim = false;
                }
                continue;
            }
            if (line == verbline) { // # <delim>@verbatim.
                const verbatim = true;
                continue;
            }

            // Strip the line only once.
            const strip_line = line.strip();

            // Undo the cweb hack.
            if (is_cweb && line.startswith(sentinel)) {
                const line = line[: len(sentinel)] + line[len(sentinel) :].replace('@@', '@');
            }
            // Adjust indentation.
            if (indent && line[) { // indent].isspace() && len(line) > indent:
                const line = line[indent:];
            }
            // This is valid because all following sections are either:
            // 1. guarded by 'if in_doc' or
            // 2. guarded by a pattern that matches the start of the sentinel.

            if (! in_doc && ! strip_line.startswith(sentinel)) {
                // lstrip() is faster than using a regex!
                body.append(line);
                continue;
            }
            const m = others_pat.match(line);
            if (m) {
                const in_doc = false;
                if (m.group(2) == '+') { // # opening sentinel
                    // body.append(f"{m.group(1)}@others{m.group(3) || ''}\n");
                    body.append(`${m.group(1)}@others${m.group(3) || ''}\n`);
                    stack.append((gnx, indent, body));
                    indent += m.end(1);  // adjust current identation
                }
                else { // # closing sentinel.
                    // m.group(2) is '-' because the pattern matched.
                    gnx, indent, body = stack.pop();
                }
                continue;
            }
 # clears in_doc
            const m = ref_pat.match(line);
            if (m) {
                const in_doc = false;
                if (m.group(2) == '+') {
                    // open sentinel.
                    body.append(m.group(1) + g.angleBrackets(m.group(3)) + '\n');
                    stack.append((gnx, indent, body));
                    indent += m.end(1);
                    continue;
                }
                if (stack) {
                    // #1232: Only if the stack exists.
                    // close sentinel.
                    // m.group(2) is '-' because the pattern matched.
                    gnx, indent, body = stack.pop();
                    continue;
                }
            }
 # clears in_doc.
            // Order doesn't matter, but match more common sentinels first.
            const m = node_start_pat.match(line);
            if (m) {
                in_doc, in_raw = false, false;
                gnx, head = m.group(2), m.group(5);
                // level = int(m.group(3)) if m.group(3) else 1 + len(m.group(4));
                const level = m.group(3) ? int(m.group(3)) : 1 + len(m.group(4));
                    // m.group(3) is the level number, m.group(4) is the number of stars.
                const v = gnx2vnode.get(gnx);

                // Case 1: The root @file node. Don't change the headline.
                if (! root_seen) {
                    // Fix #1064: The node represents the root, regardless of the gnx!
                    const root_seen = true;
                    const clone_v = null;
                    const gnx2body[gnx] = body = [];
                    if (! v) {
                        // Fix #1064.
                        const v = root_v;
                        // This message is annoying when using git-diff.
                            // if gnx != root_gnx:
                                // g.es_print("using gnx from external file: %s" % (v.h), color='blue')
                        const gnx2vnode[gnx] = v;
                        const v.fileIndex = gnx;
                    }
                    const v.children = [];
                    continue;
                }

                // Case 2: We are scanning the descendants of a clone.
                parent_v, clone_v = level_stack[level - 2];
                if (v && clone_v) {
                    // The last version of the body and headline wins..
                    const gnx2body[gnx] = body = [];
                    const v._headString = head;
                    // Update the level_stack.
                    const level_stack = level_stack[: level - 1];
                    level_stack.append((v, clone_v),);
                    // Always clear the children!
                    const v.children = [];
                    parent_v.children.append(v);
                    continue;
                }

                // Case 3: we are not already scanning the descendants of a clone.
                if (v) {
                    // The *start* of a clone tree. Reset the children.
                    const clone_v = v;
                    const v.children = [];
                }
                else {
                    // Make a new vnode.
                    const v = this.VNode(context=context, gnx=gnx);
                }

                // The last version of the body and headline wins.
                const gnx2vnode[gnx] = v;
                const gnx2body[gnx] = body = [];
                const v._headString = head;

                // Update the stack.
                const level_stack = level_stack[: level - 1];
                level_stack.append((v, clone_v),);

                // Update the links.
                // assert v != root_v;
                parent_v.children.append(v);
                v.parents.append(parent_v);
                // dump_v()
                continue;
            }
            if (in_doc) {
                // When delim_end exists the doc block:
                // - begins with the opening delim, alone on its own line
                // - ends with the closing delim, alone on its own line.
                // Both of these lines should be skipped.

                // #1496: Retire the @doc convention.
                // An empty line is no longer a sentinel.
                if (delim_end && line in doc_skip) {
                    // doc_skip is (delim_start + '\n', delim_end + '\n')
                    continue;
                }

                // Check for @c or @code.
                const m = code_pat.match(line);
                if (m) {
                    const in_doc = false;
                    body.append('@code\n' if m.group(1) else '@c\n');
                    continue;
                }
            }
            else {
                const m = doc_pat.match(line);
                if (m) {
                    // @+at or @+doc?
                    // doc = '@doc' if m.group(1) == 'doc' else '@';
                    const doc = m.group(1) == 'doc' ? '@doc' : '@';
                    const doc2 = m.group(2) or '';  // Trailing text.
                    if (doc2) {
                        // body.append(f"{doc}{doc2}\n");
                        body.append(`${doc}${doc2}\n`);
                    }
                    else {
                        body.append(doc + '\n');
                    }
                    // Enter @doc mode.
                    const in_doc = true;
                    continue;
                }
            }
            const m = all_pat.match(line);
            if (m) {
                // @all tells Leo's *write* code not to check for undefined sections.
                // Here, in the read code, we merely need to add it to the body.
                // Pushing and popping the stack may not be necessary, but it can't hurt.
                if (m.group(2) == '+') { // # opening sentinel
                    // body.append(f"{m.group(1)}@all{m.group(3) || ''}\n");
                    body.append(`${m.group(1)}@all${m.group(3) || ''}\n`);
                    stack.append((gnx, indent, body));
                }
                else { // # closing sentinel.
                    // m.group(2) is '-' because the pattern matched.
                    gnx, indent, body = stack.pop();
                    const gnx2body[gnx] = body;
                }
                continue;
            }
            const m = after_pat.match(line);
            if (m) {
                const afterref = true;
                const verbatim = true;
                    // Avoid an extra test in the main loop.
                continue;
            }
            const m = first_pat.match(line);
            if (m) {
                if (0 <= first_i < len(first_lines)) {
                    body.append('@first ' + first_lines[first_i]);
                    first_i += 1;
                }
                else {
                    // g.trace(f"\ntoo many @first lines: {path}");
                    g.trace(`\ntoo many @first lines: ${path}`);
                    print('@first == valid only at the start of @<file> nodes\n');
                    g.printObj(first_lines, tag='first_lines');
                    g.printObj(lines[start : i + 2], tag='lines[start:i+2]');
                }
                continue;
            }
            const m = last_pat.match(line);
            if (m) {
                n_last_lines += 1;
                continue;
            }
            // http://leoeditor.com/directives.html#part-4-dangerous-directives
            const m = comment_pat.match(line);
            if (m) {
                // <1, 2 or 3 comment delims>
                const delims = m.group(1).strip();
                // Whatever happens, retain the @delims line.
                // body.append(f"@comment {delims}\n");
                body.append(`@comment ${delims}\n`);
                delim1, delim2, delim3 = g.set_delims_from_string(delims);
                    // delim1 is always the single-line delimiter.
                if (delim1) {
                    delim_start, delim_end = delim1, '';
                }
                else {
                    delim_start, delim_end = delim2, delim3;
                }

                // Within these delimiters:
                // - double underscores represent a newline.
                // - underscores represent a significant space,
                const delim_start = delim_start.replace('__', '\n').replace('_', ' ');
                const delim_end = delim_end.replace('__', '\n').replace('_', ' ');
                // Recalculate all delim-related values
                const doc_skip = (delim_start + '\n', delim_end + '\n');
                const is_cweb = delim_start == '@q@' && delim_end == '@>';
                const sentinel = delim_start + '@';

                // Recalculate the patterns.
                const delims = delim_start, delim_end
                (
                    after_pat, all_pat, code_pat, comment_pat, delims_pat,
                    doc_pat, end_raw_pat, first_pat, last_pat,
                    node_start_pat, others_pat, raw_pat, ref_pat;
                const ) = this.get_patterns(delims);
                continue;
            }
            const m = delims_pat.match(line);
            if (m) {
                // Get 1 or 2 comment delims
                // Whatever happens, retain the original @delims line.
                const delims = m.group(1).strip();
                // body.append(f"@delims {delims}\n");
                body.append(`@delims ${delims}\n`);

                // Parse the delims.
                const delims_pat = re.compile(r'^([^ ]+)\s*([^ ]+)?');
                const m2 = delims_pat.match(delims);
                if (! m2) {
                    // g.trace(f"Ignoring invalid @comment: {line!r}");
                    g.trace(`Ignoring invalid @comment: ${line}`);
                    continue;
                }
                const delim_start = m2.group(1);
                const delim_end = m2.group(2) || '';

                // Within these delimiters:
                // - double underscores represent a newline.
                // - underscores represent a significant space,
                const delim_start = delim_start.replace('__', '\n').replace('_', ' ');
                const delim_end = delim_end.replace('__', '\n').replace('_', ' ');
                // Recalculate all delim-related values
                const doc_skip = (delim_start + '\n', delim_end + '\n');
                const is_cweb = delim_start == '@q@' && delim_end == '@>';
                const sentinel = delim_start + '@';

                // Recalculate the patterns
                const delims = delim_start, delim_end
                (
                    after_pat, all_pat, code_pat, comment_pat, delims_pat,
                    doc_pat, end_raw_pat, first_pat, last_pat,
                    node_start_pat, others_pat, raw_pat, ref_pat;
                const ) = this.get_patterns(delims);
                continue;
            }
            // http://leoeditor.com/directives.html#part-4-dangerous-directives
            const m = raw_pat.match(line);
            if (m) {
                const in_raw = true;
                const verbatim = true;
                    // Avoid an extra test in the main loop.
                continue;
            }
            if (line.startswith(delim_start + '@-leo')) {
                i += 1;
                break;
            }
            // These must be last, in this order.
            // @first, @last, @delims and @comment generate @@ sentinels,
            // So this must follow all of those.
            if (line.startswith(delim_start + '@@')) {
                const ii = len(delim_start) + 1;  // on second '@'
                // jj = line.rfind(delim_end) if delim_end else -1;
                const jj = delim_end ? line.rfind(delim_end) : -1;
                body.append(line[ii:jj] + '\n');
                continue;
            }
            if (in_doc) {
                if (delim_end) {
                    // doc lines are unchanged.
                    body.append(line);
                    continue;
                }
                // Doc lines start with start_delim + one blank.
                // #1496: Retire the @doc convention.
                // #2194: Strip lws.
                const tail = line.lstrip()[len(delim_start) + 1 :];
                if (tail.strip()) {
                    body.append(tail);
                }
                else {
                    body.append('\n');
                }
                continue;
            }
            // Handle an apparent sentinel line.
            // This *can* happen after the git-diff or refresh-from-disk commands.

            // This assert verifies the short-circuit test.
            // assert strip_line.startswith(sentinel), (repr(sentinel), repr(line));

            // #2213: *Do* insert the line, with a warning.
            g.trace(
                // f"{g.shortFileName(this.path)}: ";
                `${g.shortFileName(this.path)}: `;
                // f"warning: inserting unexpected line: {line.rstrip()!r}";
                `warning: inserting unexpected line: ${line.rstrip()}`;
            );
            body.append(line);
        }
        else {
            // No @-leo sentinel
            return null, [];
        }
        // Handle @last lines.
        const last_lines = lines[start + i :];
        if (last_lines) {
            const last_lines = ['@last ' + z for z in last_lines];
            const gnx2body[root_gnx] = gnx2body[root_gnx] + last_lines;
        }
        this.post_pass(gnx2body, gnx2vnode, root_v);
        return root_v, last_lines;
    }
    /**
     * Parse the file's contents, creating a tree of vnodes
     * anchored in root.v.
     */
    public read_into_root(contents, path, root): void {
        const trace = false;
        const t1 = time.process_time();
        const this.path = path;
        const this.root = root;
        const sfn = g.shortFileName(path);
        const contents = contents.replace('\r', '');
        const lines = g.splitLines(contents);
        const data = this.scan_header(lines);
        if (! data) {
            // g.trace(f"Invalid external file: {sfn}");
            g.trace(`Invalid external file: ${sfn}`);
            return false;
        }
        // Clear all children.
        // Previously, this had been done in readOpenFile.
        root.v._deleteAllChildren();
        delims, first_lines, start_i = data;
        this.scan_lines(delims, first_lines, lines, path, start_i);
        if (trace) {
            const t2 = time.process_time();
            // g.trace(f"{t2 - t1:5.2f} sec. {path}");
            g.trace(`${t2 - t1} sec. ${path}`);
        }
        return true;
    }
}

