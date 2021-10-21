var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
function cmd(name) {
    return g.new_cmd_decorator(name, ['c', 'atFileCommands',]);
}
/**
 * A class implementing the atFile subcommander.
 */
var AtFile = /** @class */ (function () {
    // Note: g.getScript also call the this.__init__ and this.finishCreate().
    /**
     * ctor for atFile class.
     */
    function AtFile(c) {
        // directives...
        this.noDirective = 1; // not an at-directive.
        this.allDirective = 2; // at-all (4.2)
        this.docDirective = 3; // @doc.
        this.atDirective = 4; // @<space> or @<newline>
        this.codeDirective = 5; // @code
        this.cDirective = 6; // @c<space> or @c<newline>
        this.othersDirective = 7; // at-others
        this.miscDirective = 8; // All other directives
        this.rawDirective = 9; // @raw
        this.endRawDirective = 10; // @end_raw
        this.startVerbatim = 11; // @verbatim  Not a real directive. Used to issue warnings.
        // **Warning**: all these ivars must **also** be inited in initCommonIvars.
        var ;
        this.c = c;
        var ;
        this.encoding = 'utf-8'; // 2014/08/13
        var ;
        this.fileCommands = c.fileCommands;
        var ;
        this.errors = 0; // Make sure this.error() works even when not inited.
        // **Only** this.writeAll manages these flags.
        var ;
        this.unchangedFiles = 0;
        // promptForDangerousWrite sets cancelFlag and yesToAll only if canCancelFlag is True.
        var ;
        this.canCancelFlag = false;
        var ;
        this.cancelFlag = false;
        var ;
        this.yesToAll = false;
        // User options: set in reloadSettings.
        var ;
        this.checkPythonCodeOnWrite = false;
        var ;
        this.runPyFlakesOnWrite = false;
        var ;
        this.underindentEscapeString = '\\-';
        this.reloadSettings();
    }
    /**
     * AtFile.reloadSettings
     */
    AtFile.prototype.reloadSettings = function () {
        var c = this.c;
        var ;
        this.checkPythonCodeOnWrite = c.config.getBool('check-python-code-on-write', default_val = true);
        var ;
        this.runPyFlakesOnWrite = c.config.getBool('run-pyflakes-on-write', default_val = false);
        var ;
        this.underindentEscapeString = c.config.getString('underindent-escape-string') || '\\-';
    };
    /**
     * Init ivars common to both reading and writing.
     *
     * The defaults set here may be changed later.
     */
    AtFile.prototype.initCommonIvars = function () {
        var c = this.c;
        var ;
        this.at_auto_encoding = c.config.default_at_auto_file_encoding;
        var ;
        this.encoding = c.config.default_derived_file_encoding;
        var ;
        this.endSentinelComment = "";
        var ;
        this.errors = 0;
        var ;
        this.inCode = true;
        var ;
        this.indent = 0; // The unit of indentation is spaces, not tabs.
        var ;
        this.language = null;
        var ;
        this.output_newline = g.getOutputNewline(c = c);
        var ;
        this.page_width = null;
        var ;
        this.raw = False; // True: in @raw mode
        var ;
        this.root = null; // The root (a position) of tree being read or written.
        var ;
        this.startSentinelComment = "";
        var ;
        this.startSentinelComment = "";
        var ;
        this.tab_width = c.tab_width || -4;
        var ;
        this.writing_to_shadow_directory = false;
    };
    AtFile.prototype.initReadIvars = function (root, fileName) {
        this.initCommonIvars();
        var ;
        this.bom_encoding = null; // The encoding implied by any BOM (set by g.stripBOM)
        var ;
        this.cloneSibCount = 0; // n > 1: Make sure n cloned sibs exists at next @+node sentinel
        var ;
        this.correctedLines = 0; // For perfect import.
        var ;
        this.docOut = []; // The doc part being accumulated.
        var ;
        this.done = False; // True when @-leo seen.
        var ;
        this.fromString = false;
        var ;
        this.importRootSeen = false;
        var ;
        this.indentStack = [];
        var ;
        this.lastLines = []; // The lines after @-leo
        var ;
        this.leadingWs = "";
        var ;
        this.lineNumber = 0; // New in Leo 4.4.8.
        var ;
        this.out = null;
        var ;
        this.outStack = [];
        var ;
        this.read_i = 0;
        var ;
        this.read_lines = [];
        var ;
        this.readVersion = ''; // "5" for new-style thin files.
        var ;
        this.readVersion5 = False; // Synonym for this.readVersion >= '5'
        var ;
        this.root = root;
        var ;
        this.rootSeen = false;
        var ;
        this.targetFileName = fileName; // For this.writeError only.
        var ;
        this.tnodeList = []; // Needed until old-style @file nodes are no longer supported.
        var ;
        this.tnodeListIndex = 0;
        var ;
        this.v = null;
        var ;
        this.vStack = []; // Stack of this.v values.
        var ;
        this.thinChildIndexStack = []; // number of siblings at this level.
        var ;
        this.thinNodeStack = []; // Entries are vnodes.
        var ;
        this.updateWarningGiven = false;
    };
    /**
     * Compute default values of all write-related ivars.
     * Return the finalized name of the output file.
     */
    AtFile.prototype.initWriteIvars = function (root) {
        var c = this.c;
        if (!c && c.config) {
            return null;
        }
        var make_dirs = c.config.create_nonexistent_directories;
        // assert root;
        this.initCommonIvars();
        // assert this.checkPythonCodeOnWrite != null;
        // assert this.underindentEscapeString != null;
        // Copy args
        var ;
        this.root = root;
        var ;
        this.sentinels = true;
        // Override initCommonIvars.
        if (g.unitTesting) {
            var ;
            this.output_newline = '\n';
        }
        // Set other ivars.
        this.force_newlines_in_at_nosent_bodies = c.config.getBool('force-newlines-in-at-nosent-bodies');
        // For this.putBody only.
        var ;
        this.outputList = [];
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
            var encoding = g.getPythonEncodingFromString(root.b);
            if (encoding) {
                var ;
                this.encoding = encoding;
            }
        }
        // Clean root.v.
        if (!this.errors && this.root) {
            if (hasattr(this.root.v, 'tnodeList')) {
                delattr(this.root.v, 'tnodeList');
            }
            var ;
            this.root.v._p_changed = true;
        }
        // #1907: Compute the file name and create directories as needed.
        var targetFileName = g.os_path_realpath(g.fullPath(c, root));
        var ;
        this.targetFileName = targetFileName; // For this.writeError only.
        // targetFileName can be empty for unit tests & @command nodes.
        if (!targetFileName) {
            // targetFileName = root.h if g.unitTesting else null;
            var targetFileName_1 = g.unitTesting ? root.h : null;
            var ;
            this.targetFileName = targetFileName_1; // For this.writeError only.
            return targetFileName_1;
        }
        // Do nothing more if the file already exists.
        if (os.path.exists(targetFileName)) {
            return targetFileName;
        }
        // Create directories if enabled.
        var root_dir = g.os_path_dirname(targetFileName);
        if (make_dirs && root_dir) {
            var ok = g.makeAllNonExistentDirectories(root_dir);
            if (!ok) {
                // g.error(f"Error creating directories: {root_dir}");
                g.error("Error creating directories: " + root_dir);
                return null;
            }
        }
        // Return the target file name, regardless of future problems.
        return targetFileName;
    };
    // @cmd('check-external-file');
    /**
     * Make sure an external file written by Leo may be read properly.
     */
    AtFile.prototype.checkExternalFile = function (event) {
        if (event === void 0) { event = null; }
        c, p = this.c, this.c.p;
        if (!p.isAtFileNode() && !p.isAtThinFileNode()) {
            g.red('Please select an @thin || @file node');
            return;
        }
        var fn = g.fullPath(c, p); // #1910.
        if (!g.os_path_exists(fn)) {
            // g.red(f"file ! found: {fn}");
            g.red("file not found: " + fn);
            return;
        }
        s, e = g.readFileIntoString(fn);
        if (s == null) {
            // g.red(f"empty file: {fn}");
            g.red("empty file: " + fn);
            return;
        }
        // Create a dummy, unconnected, VNode as the root.
        var root_v = leoNodes.VNode(context = c);
        var root = leoNodes.Position(root_v);
        FastAtRead(c, gnx2vnode = {}).read_into_root(s, fn, root);
    };
    /**
     * Open the file given by this.root.
     * This will be the private file for @shadow nodes.
     */
    AtFile.prototype.openFileForReading = function (fromString) {
        if (fromString === void 0) { fromString = False; }
        var c = this.c;
        var is_at_shadow = this.root.isAtShadowFileNode();
        if (fromString) {
            if (is_at_shadow) {
                return this.error('can ! call this.read from string for @shadow files');
            }
            this.initReadLine(fromString);
            return null, null;
        }
        // Not from a string. Carefully read the file.
        var fn = g.fullPath(c, this.root);
        // Returns full path, including file name.
        this.setPathUa(this.root, fn);
        // Remember the full path to this node.
        if (is_at_shadow) {
            var fn_1 = this.openAtShadowFileForReading(fn_1);
            if (!fn_1) {
                return null, null;
            }
        }
        // assert fn;
        try {
            var s = this.readFileToUnicode(fn);
            // Sets this.encoding, regularizes whitespace and calls this.initReadLines.
            // #1466.
            if (s == null) {
                // The error has been given.
                var ;
                this._file_bytes = g.toEncodedString('');
                return null, null;
            }
            this.warnOnReadOnlyFile(fn);
        }
        catch (Exception) {
            // this.error(f"unexpected exception opening: '@file {fn}'");
            this.error("unexpected exception opening: '@file " + fn + "'");
            var ;
            this._file_bytes = g.toEncodedString('');
            fn, s = null, null;
        }
        return fn, s;
    };
    /**
     * Open an @shadow for reading and return shadow_fn.
     */
    AtFile.prototype.openAtShadowFileForReading = function (fn) {
        var x = this.c.shadowController;
        // readOneAtShadowNode should already have checked these.
        var shadow_fn = x.shadowPathName(fn);
        var shadow_exists = (g.os_path_exists(shadow_fn) && g.os_path_isfile(shadow_fn));
        if (!shadow_exists) {
            g.trace('can ! happen: no private file', shadow_fn, g.callers());
            // this.error(f"can ! happen: private file does ! exist: {shadow_fn}");
            this.error("can not happen: private file does not exist: " + shadow_fn);
            return null;
        }
        // This method is the gateway to the shadow algorithm.
        x.updatePublicAndPrivateFiles(this.root, fn, shadow_fn);
        return shadow_fn;
    };
    /**
     * Read an @thin or @file tree.
     */
    AtFile.prototype.read = function (root, fromString) {
        if (fromString === void 0) { fromString = null; }
        var c = this.c;
        var fileName = g.fullPath(c, root); // #1341. #1889.
        if (!fileName) {
            this.error("Missing file name. Restoring @file tree from .leo file.");
            return false;
        }
        this.rememberReadPath(g.fullPath(c, root), root);
        // Fix bug 760531: always mark the root as read, even if there was an error.
        // Fix bug 889175: Remember the full fileName.
        this.initReadIvars(root, fileName);
        var ;
        this.fromString = fromString;
        if (this.errors) {
            return false;
        }
        fileName, file_s = this.openFileForReading(fromString = fromString);
        // #1798:
        if (file_s == null) {
            return false;
        }
        // Set the time stamp.
        if (fileName) {
            c.setFileTimeStamp(fileName);
        }
        else if (!fileName && !fromString && !file_s) {
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
        var gnx2vnode = c.fileCommands.gnxDict;
        var contents = fromString || file_s;
        FastAtRead(c, gnx2vnode).read_into_root(contents, fileName, root);
        root.clearDirty();
        return true;
    };
    /**
     * Remove p's tnodeList.
     */
    AtFile.prototype.deleteTnodeList = function (p) {
        var v = p.v;
        if (hasattr(v, "tnodeList")) {
            // Not an error, but a useful trace.
            // g.blue("deleting tnodeList for " + repr(v))
            delattr(v_1, "tnodeList");
            var v_1, _p_changed = true;
        }
    };
    /**
     * Delete unvisited nodes in root's subtree, not including root.
     *
     * Before Leo 5.6: Move unvisited node to be children of the 'Resurrected
     * Nodes'.
     */
    AtFile.prototype.deleteUnvisitedNodes = function (root, redraw) {
        if (redraw === void 0) { redraw = True; }
        // Find the unvisited nodes.
        var aList = [z];
        for (z in root.subtree())
            if (!z.isVisited())
                ;
        ;
        if (aList) {
            // new-read: Never create resurrected nodes.
            // r = this.createResurrectedNodesNode()
            // callback = this.defineResurrectedNodeCallback(r, root)
            // # Move the nodes using the callback.
            // this.c.deletePositionsInList(aList, callback)
            this.c.deletePositionsInList(aList, redraw = redraw);
        }
    };
    /**
     * Create a 'Resurrected Nodes' node as the last top-level node.
     */
    AtFile.prototype.createResurrectedNodesNode = function () {
        var c = this.c;
        var tag = 'Resurrected Nodes';
        // Find the last top-level node.
        var last = c.rootPosition();
        while (last.hasNext()) {
            last.moveToNext();
        }
        // Create the node after last if it doesn't exist.
        if (last.h == tag) {
            var p = last;
        }
        else {
            var p = last.insertAfter();
            p.setHeadString(tag);
        }
        p.expand();
        return p;
    };
    /**
     * Define a callback that moves node p as r's last child.
     */
    AtFile.prototype.defineResurrectedNodeCallback = function (r, root) {
        /**
         * The resurrected nodes callback.
         */
        function callback(p, r, root) {
            if (r === void 0) { r = r.copy(); }
            if (root === void 0) { root = root; }
            var child = r.insertAsLastChild();
            // child.h = f"From {root.h}";
            var child, h = "From " + root.h;
            var v = p.v;
            // new code: based on vnodes.
            for (parent_v in v.parents) {
                // assert isinstance(parent_v, leoNodes.VNode), parent_v;
                if (v in parent_v.children) {
                    var childIndex = parent_v.children.index(v);
                    v._cutLink(childIndex, parent_v);
                    v._addLink(len(child.v.children), child.v);
                }
                else {
                    // This would be surprising.
                    g.trace('**already deleted**', parent_v, v);
                }
            }
            if (!g.unitTesting) {
                g.error('resurrected node:', v.h);
                g.blue('in file:', root.h);
            }
        }
        return callback;
    };
    /**
     * Return True if s has file-like sentinels.
     */
    AtFile.prototype.isFileLike = function (s) {
        var tag = "@+leo";
        var s = g.checkUnicode(s);
        var i = s.find(tag);
        if (i == -1) {
            return True; // Don't use the cache.
        }
        j, k = g.getLine(s, i);
        var line = s[j], k;
        valid, new_df, start, end, isThin = this.parseLeoSentinel(line);
        return !isThin;
    };
    /**
     * Scan positions, looking for @<file> nodes to read.
     */
    AtFile.prototype.readAll = function (root, force) {
        if (force === void 0) { force = False; }
        var c = this.c;
        var old_changed = c.changed;
        if (force) {
            // Capture the current headline only if
            // we aren't doing the initial read.
            c.endEditing();
        }
        var t1 = time.time();
        c.init_error_dialogs();
        var files = this.findFilesToRead(force, root);
        for (p in files) {
            this.readFileAtPosition(force, p);
        }
        for (p in files) {
            p.v.clearDirty();
        }
        if (!g.unitTesting) {
            if (files) {
                var t2 = time.time();
                // g.es(f"read {len(files)} files in {t2 - t1:2.2f} seconds");
                t3 = t2 - t1;
                g.es("read " + len(files) + " files in " + t3 + " seconds");
            }
            else if (force) {
                g.es("no @<file> nodes in the selected tree");
            }
        }
        var c, changed = old_changed;
        c.raise_error_dialogs();
    };
    AtFile.prototype.findFilesToRead = function (force, root) {
        var c = this.c;
        var p = root.copy();
        var scanned_tnodes = set();
        var files = [];
        // after = p.nodeAfterTree() if force else null;
        var after = force ? p.nodeAfterTree() : null;
        while (p && p != after) {
            var data = (p.gnx, g.fullPath(c, p));
            // skip clones referring to exactly the same paths.
            if (data in scanned_tnodes) {
                p.moveToNodeAfterTree();
                continue;
            }
            scanned_tnodes.add(data);
            if (!p.h.startswith('@')) {
                p.moveToThreadNext();
            }
            else if (p.isAtIgnoreNode()) {
                if (p.isAnyAtFileNode()) {
                    c.ignored_at_file_nodes.append(p.h);
                }
                p.moveToNodeAfterTree();
            }
            else if (p.isAtThinFileNode() ||
                p.isAtAutoNode() ||
                p.isAtEditNode() ||
                p.isAtShadowFileNode() ||
                p.isAtFileNode() ||
                p.isAtCleanNode())
                ; // 1134.
            {
                files.append(p.copy());
                p.moveToNodeAfterTree();
            }
            if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()) {
                // Note (see #1081): @asis and @nosent can *not* be updated automatically.
                // Doing so using refresh-from-disk will delete all child nodes.
                p.moveToNodeAfterTree();
            }
            else {
                p.moveToThreadNext();
            }
        }
        return files;
    };
    /**
     * Read the @<file> node at p.
     */
    AtFile.prototype.readFileAtPosition = function (force, p) {
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
    };
    /**
     * Read all @shadow nodes in the p's tree.
     */
    AtFile.prototype.readAtShadowNodes = function (p) {
        var after = p.nodeAfterTree();
        var p = p.copy(); // Don't change p in the caller.
        while (p && p != after) { // # Don't use iterator.
            if (p.isAtShadowFileNode()) {
                var fileName = p.atShadowFileNodeName();
                this.readOneAtShadowNode(fileName, p);
                p.moveToNodeAfterTree();
            }
            else {
                p.moveToThreadNext();
            }
        }
    };
    /**
     * Read an @auto file into p. Return the *new* position.
     */
    AtFile.prototype.readOneAtAutoNode = function (p) {
        this, c, ic = this, this.c, this.c.importCommands;
        var fileName = g.fullPath(c, p); // #1521, #1341, #1914.
        if (!g.os_path_exists(fileName)) {
            // g.error(f"! found: {p.h!r}", nodeLink=p.get_UNL(with_proto=true));
            g.error("not found: " + p.h, nodeLink = p.get_UNL(with_proto = true));
            return p;
        }
        // Remember that we have seen the @auto node.
        // Fix bug 889175: Remember the full fileName.
        this.rememberReadPath(fileName, p);
        // if not g.unitTesting: g.es("reading:", p.h)
        try {
            // For #451: return p.
            var old_p = p_1.copy();
            this.scanAllDirectives(p_1);
            var p_1, v, b = ''; // Required for @auto API checks.
            p_1.v._deleteAllChildren();
            var p_2 = ic.createOutline(parent = p_1.copy());
            // Do *not* select a position here.
            // That would improperly expand nodes.
            // c.selectPosition(p)
        }
        catch (Exception) {
            var p_3 = old_p;
            ic.errors += 1;
            g.es_print('Unexpected exception importing', fileName);
            g.es_exception();
        }
        if (ic.errors) {
            // g.error(f"errors inhibited read @auto {fileName}");
            g.error("errors inhibited read @auto " + fileName);
        }
        else if (c.persistenceController) {
            c.persistenceController.update_after_read_foreign_file(p);
        }
        // Finish.
        if (ic.errors || !g.os_path_exists(fileName)) {
            p.clearDirty();
        }
        else {
            g.doHook('after-auto', c = c, p = p);
        }
        return p;
    };
    AtFile.prototype.readOneAtEditNode = function (fn, p) {
        var c = this.c;
        var ic = c.importCommands;
        // #1521
        var fn = g.fullPath(c, p);
        junk, ext = g.os_path_splitext(fn);
        // Fix bug 889175: Remember the full fileName.
        this.rememberReadPath(fn, p);
        // if not g.unitTesting: g.es("reading: @edit %s" % (g.shortFileName(fn)))
        s, e = g.readFileIntoString(fn, kind = '@edit');
        if (s == null) {
            return;
        }
        // encoding = 'utf-8' if e == null else e;
        var encoding = e == null ? 'utf-8' : e;
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        var head = '';
        var ext = ext.lower();
        if (ext in ('.html', '.htm')) {
            var head_1 = '@language html\n';
        }
        else if (ext in ('.txt', '.text')) {
            var head_2 = '@nocolor\n';
        }
        else {
            var language = ic.languageForExtension(ext);
            if (language && language != 'unknown_language') {
                // head = f"@language {language}\n";
                var head_3 = "@language " + language + "\n";
            }
            else {
                var head_4 = '@nocolor\n';
            }
        }
        var p, b = head + g.toUnicode(s, encoding = encoding, reportErrors = true);
        g.doHook('after-edit', p = p);
    };
    /**
     * Read one @asis node. Used only by refresh-from-disk
     */
    AtFile.prototype.readOneAtAsisNode = function (fn, p) {
        var c = this.c;
        // #1521 & #1341.
        var fn = g.fullPath(c, p);
        junk, ext = g.os_path_splitext(fn);
        // Remember the full fileName.
        this.rememberReadPath(fn, p);
        // if not g.unitTesting: g.es("reading: @asis %s" % (g.shortFileName(fn)))
        s, e = g.readFileIntoString(fn, kind = '@edit');
        if (s == null) {
            return;
        }
        // encoding = 'utf-8' if e == null else e;
        var encoding = e == null ? 'utf-8' : e;
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        var old_body = p.b;
        var p, b = g.toUnicode(s, encoding = encoding, reportErrors = true);
        if (!c.isChanged() && p.b != old_body) {
            c.setChanged();
        }
    };
    /**
     * Update the @clean/@nosent node at root.
     */
    AtFile.prototype.readOneAtCleanNode = function (root) {
        this, c, x = this, this.c, this.c.shadowController;
        var fileName = g.fullPath(c, root);
        if (!g.os_path_exists(fileName)) {
            g.es_print(
            // f"! found: {fileName}",
            "not found: " + fileName, color = 'red', nodeLink = root.get_UNL(with_proto = true));
            return false;
        }
        this.rememberReadPath(fileName, root);
        this.initReadIvars(root, fileName);
        // Must be called before this.scanAllDirectives.
        this.scanAllDirectives(root);
        // Sets this.startSentinelComment/endSentinelComment.
        new_public_lines = this.read_at_clean_lines(fileName);
        var old_private_lines = this.write_at_clean_sentinels(root);
        var marker = x.markerFromFileLines(old_private_lines, fileName);
        old_public_lines, junk = x.separate_sentinels(old_private_lines, marker);
        if (old_public_lines) {
            var new_private_lines = x.propagate_changed_lines(new_public_lines, old_private_lines, marker, p = root);
        }
        else {
            var new_private_lines = [];
            var root_1, b = ''.join(new_public_lines);
            return true;
        }
        if (new_private_lines == old_private_lines) {
            return true;
        }
        if (!g.unitTesting) {
            g.es("updating:", root.h);
        }
        root.clearVisitedInTree();
        var gnx2vnode = this.fileCommands.gnxDict;
        var contents = ''.join(new_private_lines);
        FastAtRead(c, gnx2vnode).read_into_root(contents, fileName, root);
        return True; // Errors not detected.
    };
    /**
     * Dump all lines.
     */
    AtFile.prototype.dump = function (lines, tag) {
        // print(f"***** {tag} lines...\n");
        print("***** " + tag + " lines...\n");
        for (s in lines) {
            print(s.rstrip());
        }
    };
    /**
     * Return all lines of the @clean/@nosent file at fn.
     */
    AtFile.prototype.read_at_clean_lines = function (fn) {
        var s = this.openFileHelper(fn);
        // Use the standard helper. Better error reporting.
        // Important: uses 'rb' to open the file.
        // #1798.
        if (s == null) {
            var s_1 = '';
        }
        else {
            var s_2 = g.toUnicode(s_2, encoding = this.encoding);
            var s_3 = s_2.replace('\r\n', '\n');
            // Suppress meaningless "node changed" messages.
        }
        return g.splitLines(s);
    };
    /**
     * Return all lines of the @clean tree as if it were
     * written as an @file node.
     */
    AtFile.prototype.write_at_clean_sentinels = function (root) {
        var result = this.atFileToString(root, sentinels = true);
        var s = g.toUnicode(result, encoding = this.encoding);
        return g.splitLines(s);
    };
    AtFile.prototype.readOneAtShadowNode = function (fn, p) {
        var c = this.c;
        var x = c.shadowController;
        if (!fn == p.atShadowFileNodeName()) {
            this.error(
            // f"can ! happen: fn: {fn} != atShadowNodeName: ";
            "can not happen: fn: " + fn + " != atShadowNodeName: ");
            // f"{p.atShadowFileNodeName()}");
            "" + p.atShadowFileNodeName();
            ;
            return;
        }
        var fn = g.fullPath(c, p); // #1521 & #1341.
        // #889175: Remember the full fileName.
        this.rememberReadPath(fn, p);
        var shadow_fn = x.shadowPathName(fn);
        var shadow_exists = g.os_path_exists(shadow_fn) && g.os_path_isfile(shadow_fn);
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        if (shadow_exists) {
            this.read(p);
        }
        else {
            var ok = this.importAtShadowNode(p);
            if (ok) {
                // Create the private file automatically.
                this.writeOneAtShadowNode(p);
            }
        }
    };
    AtFile.prototype.importAtShadowNode = function (p) {
        c, ic = this.c, this.c.importCommands;
        var fn = g.fullPath(c, p); // #1521, #1341, #1914.
        if (!g.os_path_exists(fn)) {
            // g.error(f"! found: {p.h!r}", nodeLink=p.get_UNL(with_proto=true));
            g.error("not found: " + p.h, nodeLink = p.get_UNL(with_proto = true));
            return p;
        }
        // Delete all the child nodes.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        // Import the outline, exactly as @auto does.
        ic.createOutline(parent = p.copy());
        if (ic.errors) {
            g.error('errors inhibited read @shadow', fn);
        }
        if (ic.errors || !g.os_path_exists(fn)) {
            p.clearDirty();
        }
        return ic.errors == 0;
    };
    /**
     * A convenience wrapper for FastAtRead.read_into_root()
     */
    AtFile.prototype.fast_read_into_root = function (c, contents, gnx2vnode, path, root) {
        return FastAtRead(c, gnx2vnode).read_into_root(contents, path, root);
    };
    AtFile.prototype.createImportedNode = function (root, headline) {
        if (this.importRootSeen) {
            var p = root.insertAsLastChild();
            p.initHeadString(headline);
        }
        else {
            // Put the text into the already-existing root node.
            var p = root;
            var ;
            this.importRootSeen = true;
        }
        p.v.setVisited(); // Suppress warning about unvisited node.
        return p;
    };
    /**
     * Init the ivars so that this.readLine will read all of s.
     */
    AtFile.prototype.initReadLine = function (s) {
        var ;
        this.read_i = 0;
        var ;
        this.read_lines = g.splitLines(s);
        var ;
        this._file_bytes = g.toEncodedString(s);
    };
    /**
     * Parse the sentinel line s.
     * If the sentinel is valid, set this.encoding, this.readVersion, this.readVersion5.
     */
    AtFile.prototype.parseLeoSentinel = function (s) {
        var c = this.c;
        // Set defaults.
        var encoding = c.config.default_derived_file_encoding;
        readVersion, readVersion5 = null, null;
        new_df, start, end, isThin = false, '', '', false;
        // Example: \*@+leo-ver=5-thin-encoding=utf-8,.*/
        var pattern = re.compile(r, '(.+)@\+leo(-ver=([0123456789]+))?(-thin)?(-encoding=(.*)(\.))?(.*)');
        // The old code weirdly allowed '.' in version numbers.
        // group 1: opening delim
        // group 2: -ver=
        // group 3: version number
        // group(4): -thin
        // group(5): -encoding=utf-8,.
        // group(6): utf-8,
        // group(7): .
        // group(8): closing delim.
        var m = pattern.match(s);
        var valid = bool(m);
        if (valid) {
            var start = m.group(1); // start delim
            var valid_1 = bool(start);
        }
        if (valid) {
            var new_df = bool(m.group(2)); // -ver=
            if (new_df) {
                // Set the version number.
                if (m.group(3)) {
                    var readVersion = m.group(3);
                    var readVersion5 = readVersion >= '5';
                }
                else {
                    var valid_2 = false;
                }
            }
        }
        if (valid) {
            // set isThin
            var isThin = bool(m.group(4));
        }
        if (valid && m.group(5)) {
            // set encoding.
            var encoding_1 = m.group(6);
            if (encoding_1 && encoding_1.endswith(',')) {
                // Leo 4.2 or after.
                var encoding_2 = encoding_2[];
                -1;
                ;
            }
            if (!g.isValidEncoding(encoding_1)) {
                g.es_print("bad encoding in derived file:", encoding_1);
                var valid_3 = false;
            }
        }
        if (valid) {
            var end = m.group(8); // closing delim
        }
        if (valid) {
            var ;
            this.encoding = encoding;
            var ;
            this.readVersion = readVersion;
            var ;
            this.readVersion5 = readVersion5;
        }
        return valid, new_df, start, end, isThin;
    };
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
    AtFile.prototype.readFileToUnicode = function (fileName) {
        var s = this.openFileHelper(fileName);
        // Catches all exceptions.
        // #1798.
        if (s == null) {
            return null;
        }
        e, s = g.stripBOM(s);
        if (e) {
            // The BOM determines the encoding unambiguously.
            var s_4 = g.toUnicode(s_4, encoding = e);
        }
        else {
            // Get the encoding from the header, or the default encoding.
            var s_temp = g.toUnicode(s_5, 'ascii', reportErrors = false);
            var e = this.getEncodingFromHeader(fileName, s_temp);
            var s_5 = g.toUnicode(s_5, encoding = e);
        }
        var s = s.replace('\r\n', '\n');
        var ;
        this.encoding = e;
        this.initReadLine(s);
        return s;
    };
    /**
     * Open a file, reporting all exceptions.
     */
    AtFile.prototype.openFileHelper = function (fileName) {
        // #1798: return null as a flag on any error.
        var s = null;
        try {
            with (open(fileName, 'rb')) {
                var s_6 = f.read();
            }
        }
        catch (IOError) {
            // this.error(f"can ! open {fileName}");
            this.error("can not open " + fileName);
        }
        try {
        }
        catch (Exception) {
            // this.error(f"Exception reading {fileName}");
            this.error("Exception reading " + fileName);
            g.es_exception();
        }
        return s;
    };
    /**
     * Return the encoding given in the @+leo sentinel, if the sentinel is
     * present, or the previous value of this.encoding otherwise.
     */
    AtFile.prototype.getEncodingFromHeader = function (fileName, s) {
        if (this.errors) {
            g.trace('can ! happen: this.errors > 0', g.callers());
            var e = this.encoding;
            if (g.unitTesting) {
                // assert false, g.callers();
            }
        }
        else {
            this.initReadLine(s);
            var old_encoding = this.encoding;
            // assert old_encoding;
            var ;
            this.encoding = null;
            // Execute scanHeader merely to set this.encoding.
            this.scanHeader(fileName, giveErrors = false);
            var e = this.encoding || old_encoding;
        }
        // assert e;
        return e;
    };
    /**
     * Read one line from file using the present encoding.
     * Returns this.read_lines[this.read_i++]
     */
    AtFile.prototype.readLine = function () {
        // This is an old interface, now used only by this.scanHeader.
        // For now, it's not worth replacing.
        if (this.read_i < len(this.read_lines)) {
            var s = this.read_lines[this.read_i];
            this.read_i += 1;
            return s;
        }
        return ''; // Not an error.
    };
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
    AtFile.prototype.scanHeader = function (fileName, giveErrors) {
        if (giveErrors === void 0) { giveErrors = True; }
        new_df, isThinDerivedFile = false, false;
        var firstLines = []; // The lines before @+leo.
        var s = this.scanFirstLines(firstLines);
        var valid = len(s) > 0;
        if (valid) {
            valid, new_df, start, end, isThinDerivedFile = this.parseLeoSentinel(s);
        }
        if (valid) {
            var ;
            this.startSentinelComment = start;
            var ;
            this.endSentinelComment = end;
        }
        else if (giveErrors) {
            // this.error(f"No @+leo sentinel in: {fileName}");
            this.error("No @+leo sentinel in: " + fileName);
            g.trace(g.callers());
        }
        return firstLines, new_df, isThinDerivedFile;
    };
    /**
     * Append all lines before the @+leo line to firstLines.
     *
     * Empty lines are ignored because empty @first directives are
     * ignored.
     *
     * We can not call sentinelKind here because that depends on the comment
     * delimiters we set here.
     */
    AtFile.prototype.scanFirstLines = function (firstLines) {
        var s = this.readLine();
        while (s && s.find("@+leo") == -1) {
            firstLines.append(s_7);
            var s_7 = this.readLine();
        }
        return s;
    };
    /**
     * Return true if the derived file is a thin file.
     *
     * This is a kludgy method used only by the import code.
     */
    AtFile.prototype.scanHeaderForThin = function (fileName) {
        this.readFileToUnicode(fileName);
        // Sets this.encoding, regularizes whitespace and calls this.initReadLines.
        junk, junk, isThin = this.scanHeader(null);
        // scanHeader uses this.readline instead of its args.
        // scanHeader also sets this.encoding.
        return isThin;
    };
    // @cmd('write-at-auto-nodes');
    /**
     * Write all @auto nodes in the selected outline.
     */
    AtFile.prototype.writeAtAutoNodes = function (event) {
        if (event === void 0) { event = null; }
        var c = this.c;
        c.init_error_dialogs();
        this.writeAtAutoNodesHelper(writeDirtyOnly = false);
        c.raise_error_dialogs(kind = 'write');
    };
    // @cmd('write-dirty-at-auto-nodes');
    /**
     * Write all dirty @auto nodes in the selected outline.
     */
    AtFile.prototype.writeDirtyAtAutoNodes = function (event) {
        if (event === void 0) { event = null; }
        var c = this.c;
        c.init_error_dialogs();
        this.writeAtAutoNodesHelper(writeDirtyOnly = true);
        c.raise_error_dialogs(kind = 'write');
    };
    /**
     * Write @auto nodes in the selected outline
     */
    AtFile.prototype.writeAtAutoNodesHelper = function (writeDirtyOnly) {
        if (writeDirtyOnly === void 0) { writeDirtyOnly = True; }
        var c = this.c;
        var p = c.p;
        var after = p.nodeAfterTree();
        var found = false;
        while (p && p != after) {
            if (p.isAtAutoNode() && !p.isAtIgnoreNode() &&
                (p.isDirty() || !writeDirtyOnly)) {
                var ok = this.writeOneAtAutoNode(p);
                if (ok) {
                    var found_1 = true;
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
        if (!g.unitTesting) {
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
    };
    // @cmd('write-at-shadow-nodes');
    /**
     * Write all @shadow nodes in the selected outline.
     */
    AtFile.prototype.writeAtShadowNodes = function (event) {
        if (event === void 0) { event = null; }
        var c = this.c;
        c.init_error_dialogs();
        var val = this.writeAtShadowNodesHelper(writeDirtyOnly = false);
        c.raise_error_dialogs(kind = 'write');
        return val;
    };
    // @cmd('write-dirty-at-shadow-nodes');
    /**
     * Write all dirty @shadow nodes in the selected outline.
     */
    AtFile.prototype.writeDirtyAtShadowNodes = function (event) {
        if (event === void 0) { event = null; }
        var c = this.c;
        c.init_error_dialogs();
        var val = this.writeAtShadowNodesHelper(writeDirtyOnly = true);
        c.raise_error_dialogs(kind = 'write');
        return val;
    };
    /**
     * Write @shadow nodes in the selected outline
     */
    AtFile.prototype.writeAtShadowNodesHelper = function (writeDirtyOnly) {
        if (writeDirtyOnly === void 0) { writeDirtyOnly = True; }
        var c = this.c;
        var p = c.p;
        var after = p.nodeAfterTree();
        var found = false;
        while (p && p != after) {
            if (p.atShadowFileNodeName() && !p.isAtIgnoreNode()
                && (p.isDirty() || !writeDirtyOnly)) {
                var ok = this.writeOneAtShadowNode(p);
                if (ok) {
                    var found_2 = true;
                    // g.blue(f"wrote {p.atShadowFileNodeName()}");
                    g.blue("wrote " + p.atShadowFileNodeName());
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
        if (!g.unitTesting) {
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
    };
    /**
     * Write the contents of the file to the output stream.
     */
    AtFile.prototype.putFile = function (root, fromString, sentinels) {
        if (fromString === void 0) { fromString = ''; }
        if (sentinels === void 0) { sentinels = True; }
        // s = fromString if fromString else root.v.b;
        var s = fromString ? fromString : root.v.b;
        root.clearAllVisitedInTree();
        this.putAtFirstLines(s);
        this.putOpenLeoSentinel("@+leo-ver=5");
        this.putInitialComment();
        this.putOpenNodeSentinel(root);
        this.putBody(root, fromString = fromString);
        this.putCloseNodeSentinel(root);
        // The -leo sentinel is required to handle @last.
        this.putSentinel("@-leo");
        root.setVisited();
        this.putAtLastLines(s);
    };
    /**
     * Write @file nodes in all or part of the outline
     */
    AtFile.prototype.writeAll = function (all, dirty) {
        if (all === void 0) { all = False; }
        if (dirty === void 0) { dirty = False; }
        var c = this.c;
        // This is the *only* place where these are set.
        // promptForDangerousWrite sets cancelFlag only if canCancelFlag is True.
        var ;
        this.unchangedFiles = 0;
        var ;
        this.canCancelFlag = true;
        var ;
        this.cancelFlag = false;
        var ;
        this.yesToAll = false;
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
        var ;
        this.canCancelFlag = false;
        var ;
        this.cancelFlag = false;
        var ;
        this.yesToAll = false;
        // Say the command is finished.
        this.reportEndOfWrite(files, all, dirty);
        if (c.isChanged()) {
            // Save the outline if only persistence data nodes are dirty.
            this.saveOutlineIfPossible();
        }
    };
    /**
     * Return a list of files to write.
     * We must do this in a prepass, so as to avoid errors later.
     */
    AtFile.prototype.findFilesToWrite = function (force) {
        var trace = 'save' in g.app.debug && !g.unitTesting;
        if (trace) {
            // g.trace(f"writing *{'selected' if force else 'all'}* files");
            g.trace("writing *" + 'selected');
            if (force)
                ;
            else
                'all';
        }
         * files(__makeTemplateObject([");\n        }\n        const c = this.c;\n        if (force) {\n            // The Write @<file> Nodes command.\n            // Write all nodes in the selected tree.\n            const root = c.p;\n            const p = c.p;\n            const after = p.nodeAfterTree();\n        }\n        else {\n            // Write dirty nodes in the entire outline.\n            const root = c.rootPosition();\n            const p = c.rootPosition();\n            const after = null;\n        }\n        const seen = set();\n        const files = [];\n        while (p && p != after) {\n            if (p.isAtIgnoreNode() && ! p.isAtAsisFileNode()) {\n                // Honor @ignore in *body* text, but *not* in @asis nodes.\n                if (p.isAnyAtFileNode()) {\n                    c.ignored_at_file_nodes.append(p.h);\n                }\n                p.moveToNodeAfterTree();\n            }\n            else if (p.isAnyAtFileNode()) {\n                const data = p.v, g.fullPath(c, p);\n                if (data in seen) {\n                    if (trace && force) {\n                        g.trace('Already seen', p.h);\n                    }\n                }\n                else {\n                    seen.add(data);\n                    files.append(p.copy());\n                }\n                // Don't scan nested trees???\n                p.moveToNodeAfterTree();\n            }\n            else {\n                p.moveToThreadNext();\n            }\n        }\n        // When scanning *all* nodes, we only actually write dirty nodes.\n        if (! force) {\n            const files = [z for z in files if z.isDirty()];\n        }\n        if (trace) {\n            g.printObj([z.h for z in files], tag='Files to be saved');\n        }\n        return files, root;\n    }\n    /**\n     * Fix bug 1260415: https://bugs.launchpad.net/leo-editor/+bug/1260415\n     * Give a more urgent, more specific, more helpful message.\n     */\n    public internalWriteError(p: Position): void {\n        g.es_exception();\n        // g.es(f\"Internal error writing: {p.h}\", color='red');\n        g.es("], [");\n        }\n        const c = this.c;\n        if (force) {\n            // The Write @<file> Nodes command.\n            // Write all nodes in the selected tree.\n            const root = c.p;\n            const p = c.p;\n            const after = p.nodeAfterTree();\n        }\n        else {\n            // Write dirty nodes in the entire outline.\n            const root = c.rootPosition();\n            const p = c.rootPosition();\n            const after = null;\n        }\n        const seen = set();\n        const files = [];\n        while (p && p != after) {\n            if (p.isAtIgnoreNode() && ! p.isAtAsisFileNode()) {\n                // Honor @ignore in *body* text, but *not* in @asis nodes.\n                if (p.isAnyAtFileNode()) {\n                    c.ignored_at_file_nodes.append(p.h);\n                }\n                p.moveToNodeAfterTree();\n            }\n            else if (p.isAnyAtFileNode()) {\n                const data = p.v, g.fullPath(c, p);\n                if (data in seen) {\n                    if (trace && force) {\n                        g.trace('Already seen', p.h);\n                    }\n                }\n                else {\n                    seen.add(data);\n                    files.append(p.copy());\n                }\n                // Don't scan nested trees???\n                p.moveToNodeAfterTree();\n            }\n            else {\n                p.moveToThreadNext();\n            }\n        }\n        // When scanning *all* nodes, we only actually write dirty nodes.\n        if (! force) {\n            const files = [z for z in files if z.isDirty()];\n        }\n        if (trace) {\n            g.printObj([z.h for z in files], tag='Files to be saved');\n        }\n        return files, root;\n    }\n    /**\n     * Fix bug 1260415: https://bugs.launchpad.net/leo-editor/+bug/1260415\n     * Give a more urgent, more specific, more helpful message.\n     */\n    public internalWriteError(p: Position): void {\n        g.es_exception();\n        // g.es(f\"Internal error writing: {p.h}\", color='red');\n        g.es("]));
        Internal;
        error;
        writing: $;
        {
            p.h;
        }
        ", color='red');\n        g.es('Please report this error to:', color='blue');\n        g.es('https://groups.google.com/forum/;  // !forum/leo-editor', color='blue')\n        g.es('Warning: changes to this file will be lost', color='red');\n        g.es('unless you can save the file successfully.', color='red');\n    }\n    public reportEndOfWrite(files, all, dirty): void {\n        if (g.unitTesting) {\n            return;\n        }\n        if (files) {\n            const n = this.unchangedFiles;\n            // g.es(f\"finished: {n} unchanged file{g.plural(n)}\");\n            g.es(";
        finished: $;
        {
            n;
        }
        unchanged;
        file$;
        {
            g.plural(n);
        }
        ");\n        }\n        else if (all) {\n            g.warning(\"no @<file> nodes in the selected tree\");\n        }\n        else if (dirty) {\n            g.es(\"no dirty @<file> nodes in the selected tree\");\n        }\n    }\n    /**\n     * Save the outline if only persistence data nodes are dirty.\n     */\n    public saveOutlineIfPossible(): void {\n        const c = this.c;\n        const changed_positions = [p for p in c.all_unique_positions() if p.v.isDirty()];\n        const at_persistence = (\n            c.persistenceController &&\n            c.persistenceController.has_at_persistence_node();\n        );\n        if (at_persistence) {\n            const changed_positions = [p for p in changed_positions;\n                if ! at_persistence.isAncestorOf(p)];\n        }\n        if (! changed_positions) {\n            // g.warning('auto-saving @persistence tree.')\n            c.clearChanged();  // Clears all dirty bits.\n            c.redraw();\n        }\n    }\n    /**\n     * Write one file for this.writeAll.\n     *\n     * Do *not* write @auto files unless p == root.\n     *\n     * This prevents the write-all command from needlessly updating\n     * the @persistence data, thereby annoyingly changing the .leo file.\n     */\n    public writeAllHelper(p: Position, root): void {\n        const this.root = root;\n        if (p.isAtIgnoreNode()) {\n            // Should have been handled in findFilesToWrite.\n            // g.trace(f\"Can ! happen: {p.h} == an @ignore node\");\n            g.trace(";
        Can;
        not;
        happen: $;
        {
            p.h;
        }
         == an;
        node(__makeTemplateObject([");\n            return;\n        }\n        try {\n            this.writePathChanged(p);\n        }\n        catch (IOError) {\n            return;\n        }\n        const table = (\n            (p.isAtAsisFileNode, this.asisWrite),\n            (p.isAtAutoNode, this.writeOneAtAutoNode),\n            (p.isAtCleanNode, this.writeOneAtCleanNode),\n            (p.isAtEditNode, this.writeOneAtEditNode),\n            (p.isAtFileNode, this.writeOneAtFileNode),\n            (p.isAtNoSentFileNode, this.writeOneAtNosentNode),\n            (p.isAtShadowFileNode, this.writeOneAtShadowNode),\n            (p.isAtThinFileNode, this.writeOneAtFileNode),\n        );\n        for (pred, func in table) {\n            if (pred()) {\n                func(p);  // type:ignore\n                break;\n            }\n        }\n        else {\n            // g.trace(f\"Can ! happen: {p.h}\");\n            g.trace("], [");\n            return;\n        }\n        try {\n            this.writePathChanged(p);\n        }\n        catch (IOError) {\n            return;\n        }\n        const table = (\n            (p.isAtAsisFileNode, this.asisWrite),\n            (p.isAtAutoNode, this.writeOneAtAutoNode),\n            (p.isAtCleanNode, this.writeOneAtCleanNode),\n            (p.isAtEditNode, this.writeOneAtEditNode),\n            (p.isAtFileNode, this.writeOneAtFileNode),\n            (p.isAtNoSentFileNode, this.writeOneAtNosentNode),\n            (p.isAtShadowFileNode, this.writeOneAtShadowNode),\n            (p.isAtThinFileNode, this.writeOneAtFileNode),\n        );\n        for (pred, func in table) {\n            if (pred()) {\n                func(p);  // type:ignore\n                break;\n            }\n        }\n        else {\n            // g.trace(f\"Can ! happen: {p.h}\");\n            g.trace("]));
        Can;
        not;
        happen: $;
        {
            p.h;
        }
        ");\n            return;\n        }\n\n        // Clear the dirty bits in all descendant nodes.\n        // The persistence data may still have to be written.\n        for (p2 in p.self_and_subtree(copy=false)) {\n            p2.v.clearDirty();\n        }\n    }\n    /**\n     * raise IOError if p's path has changed *and* user forbids the write.\n     */\n    public writePathChanged(p: Position): void {\n        const c = this.c;\n\n        // Suppress this message during save-as and save-to commands.\n        if (c.ignoreChangedPaths) {\n            return;\n        }\n        const oldPath = g.os_path_normcase(this.getPathUa(p));\n        const newPath = g.os_path_normcase(g.fullPath(c, p));\n        try { // # #1367: samefile can throw an exception.\n            const changed = oldPath && ! os.path.samefile(oldPath, newPath);\n        }\n        catch (Exception) {\n            const changed = true;\n        }\n        if (! changed) {\n            return;\n        }\n        const ok = this.promptForDangerousWrite(\n            fileName=null,\n            message=(\n                // f\"{g.tr('path changed for %s' % (p.h))}\n\";\n                ";
        $;
        {
            g.tr('path changed for %s' % (p.h));
        }
        n(__makeTemplateObject([";\n                // f\"{g.tr('write this file anyway?')}\";\n                "], [";\n                // f\"{g.tr('write this file anyway?')}\";\n                "]));
        $;
        {
            g.tr('write this file anyway?');
        }
        ";\n            ),\n        );\n        if (! ok) {\n            raise IOError;\n        }\n        this.setPathUa(p, newPath);  // Remember that we have changed paths.\n    }\n    /**\n     * Common helper for atAutoToString and writeOneAtAutoNode.\n     */\n    public writeAtAutoContents(fileName, root): void {\n        const c = this.c;\n        // Dispatch the proper writer.\n        junk, ext = g.os_path_splitext(fileName);\n        const writer = this.dispatch(ext, root);\n        if (writer) {\n            const this.outputList = [];\n            writer(root);\n            // return '' if this.errors else ''.join(this.outputList);\n            return this.errors ? '' : ''.join(this.outputList);\n        }\n        if (root.isAtAutoRstNode()) {\n            // An escape hatch: fall back to the theRst writer\n            // if there is no rst writer plugin.\n            const this.outputFile = outputFile = io.StringIO();\n            const ok = c.rstCommands.writeAtAutoFile(root, fileName, outputFile);\n            // return outputFile.close() if ok else null;\n            return ok ? outputFile.close() : null;\n        }\n        // leo 5.6: allow undefined section references in all @auto files.\n        const ivar = 'allow_undefined_refs';\n        try {\n            setattr(this, ivar, true);\n            const this.outputList = [];\n            this.putFile(root, sentinels=false);\n            // return '' if this.errors else ''.join(this.outputList);\n            return this.errors ? '' : ''.join(this.outputList);\n        }\n        catch (Exception) {\n            return null;\n        }\n        finally {\n            if (hasattr(this, ivar)) {\n                delattr(this, ivar);\n            }\n        }\n    }\n    public asisWrite(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            c.init_error_dialogs();\n            const fileName = this.initWriteIvars(root);\n            // #1450.\n            if (! fileName || ! this.precheck(fileName, root)) {\n                this.addToOrphanList(root);\n                return;\n            }\n            const this.outputList = [];\n            for (p in root.self_and_subtree(copy=false)) {\n                this.writeAsisNode(p);\n            }\n            if (! this.errors) {\n                const contents = ''.join(this.outputList);\n                this.replaceFile(contents, this.encoding, fileName, root);\n            }\n        }\n        catch (Exception) {\n            this.writeException(fileName, root);\n        }\n    }\n\n    const silentWrite = asisWrite;  // Compatibility with old scripts.\n    /**\n     * Write the p's node to an @asis file.\n     */\n    public writeAsisNode(p: Position): void {\n        /**\n         * Append s to this.output_list.\n         */\n        public function put(s: string): void {\n            // #1480: Avoid calling this.os().\n            const s = g.toUnicode(s, this.encoding, reportErrors=true);\n            this.outputList.append(s);\n        }\n\n        // Write the headline only if it starts with '@@'.\n\n        const s = p.h;\n        if (g.match(s, 0, \"@@\")) {\n            const s = s[2:];\n            if (s) {\n                put('\n');  // Experimental.\n                put(s);\n                put('\n');\n            }\n        }\n        // Write the body.\n        const s = p.b;\n        if (s) {\n            put(s);\n        }\n    }\n    public writeMissing(p: Position): void {\n        const c = this.c;\n        const writtenFiles = false;\n        c.init_error_dialogs();\n        // #1450.\n        this.initWriteIvars(root=p.copy());\n        const p = p.copy();\n        const after = p.nodeAfterTree();\n        while (p && p != after) { // # Don't use iterator.\n            if (\n                p.isAtAsisFileNode() || (p.isAnyAtFileNode() && ! p.isAtIgnoreNode())\n            ) {\n                const fileName = p.anyAtFileNodeName();\n                if (fileName) {\n                    const fileName = g.fullPath(c, p);  // #1914.\n                    if (this.precheck(fileName, p)) {\n                        this.writeMissingNode(p);\n                        const writtenFiles = true;\n                    }\n                    else {\n                        this.addToOrphanList(p);\n                    }\n                }\n                p.moveToNodeAfterTree();\n            }\n            else if (p.isAtIgnoreNode()) {\n                p.moveToNodeAfterTree();\n            }\n            else {\n                p.moveToThreadNext();\n            }\n        }\n        if (! g.unitTesting) {\n            if (writtenFiles > 0) {\n                g.es(\"finished\");\n            }\n            else {\n                g.es(\"no @file node in the selected tree\");\n            }\n        }\n        c.raise_error_dialogs(kind='write');\n    }\n    public writeMissingNode(p: Position): void {\n        const table = (\n            (p.isAtAsisFileNode, this.asisWrite),\n            (p.isAtAutoNode, this.writeOneAtAutoNode),\n            (p.isAtCleanNode, this.writeOneAtCleanNode),\n            (p.isAtEditNode, this.writeOneAtEditNode),\n            (p.isAtFileNode, this.writeOneAtFileNode),\n            (p.isAtNoSentFileNode, this.writeOneAtNosentNode),\n            (p.isAtShadowFileNode, this.writeOneAtShadowNode),\n            (p.isAtThinFileNode, this.writeOneAtFileNode),\n        );\n        for (pred, func in table) {\n            if (pred()) {\n                func(p);  // type:ignore\n                return;\n            }\n        }\n        // g.trace(f\"Can ! happen unknown @<file> kind: {p.h}\");\n        g.trace(";
        Can;
        not;
        happen;
        unknown;
        kind;
        $;
        {
            p.h;
        }
        ");\n    }\n    /**\n     * Write p, an @auto node.\n     * File indices *must* have already been assigned.\n     * Return True if the node was written successfully.\n     */\n    public writeOneAtAutoNode(p: Position): void {\n        const c = this.c;\n        const root = p.copy();\n        try {\n            c.endEditing();\n            if (! p.atAutoNodeName()) {\n                return false;\n            }\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = false;\n            // #1450.\n            if (! fileName || ! this.precheck(fileName, root)) {\n                this.addToOrphanList(root);\n                return false;\n            }\n            if (c.persistenceController) {\n                c.persistenceController.update_before_write_foreign_file(root);\n            }\n            const contents = this.writeAtAutoContents(fileName, root);\n            if (contents == null) {\n                g.es(\"! written:\", fileName);\n                this.addToOrphanList(root);\n                return false;\n            }\n            this.replaceFile(contents, this.encoding, fileName, root,\n                ignoreBlankLines=root.isAtAutoRstNode());\n            return true;\n        }\n        catch (Exception) {\n            this.writeException(fileName, root);\n            return false;\n        }\n    }\n    /**\n     * Return the correct writer function for p, an @auto node.\n     */\n    public dispatch(ext, p: Position): void {\n        // Match @auto type before matching extension.\n        return this.writer_for_at_auto(p) || this.writer_for_ext(ext);\n    }\n    /**\n     * A factory returning a writer function for the given kind of @auto directive.\n     */\n    public writer_for_at_auto(root): void {\n        const d = g.app.atAutoWritersDict;\n        for (key in d) {\n            const aClass = d.get(key);\n            if (aClass && g.match_word(root.h, 0, key)) {\n\n                public function writer_for_at_auto_cb(root): void {\n                    // pylint: disable=cell-var-from-loop\n                    try {\n                        const writer = aClass(this.c);\n                        const s = writer.write(root);\n                        return s;\n                    }\n                    catch (Exception) {\n                        g.es_exception();\n                        return null;\n                    }\n                }\n\n                return writer_for_at_auto_cb;\n            }\n        }\n        return null;\n    }\n    /**\n     * A factory returning a writer function for the given file extension.\n     */\n    public writer_for_ext(ext): void {\n        const d = g.app.writersDispatchDict;\n        const aClass = d.get(ext);\n        if (aClass) {\n\n            public function writer_for_ext_cb(root): void {\n                try {\n                    return aClass(this.c).write(root);\n                }\n                catch (Exception) {\n                    g.es_exception();\n                    return null;\n                }\n            }\n\n            return writer_for_ext_cb;\n        }\n\n        return null;\n    }\n    /**\n     * Write one @clean file..\n     * root is the position of an @clean node.\n     */\n    public writeOneAtCleanNode(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = false;\n            if (! fileName || ! this.precheck(fileName, root)) {\n                return;\n            }\n            const this.outputList = [];\n            this.putFile(root, sentinels=false);\n            this.warnAboutOrphandAndIgnoredNodes();\n            if (this.errors) {\n                g.es(\"! written:\", g.shortFileName(fileName));\n                this.addToOrphanList(root);\n            }\n            else {\n                const contents = ''.join(this.outputList);\n                this.replaceFile(contents, this.encoding, fileName, root);\n            }\n        }\n        catch (Exception) {\n            if (hasattr(this.root.v, 'tnodeList')) {\n                delattr(this.root.v, 'tnodeList');\n            }\n            this.writeException(fileName, root);\n        }\n    }\n    /**\n     * Write one @edit node.\n     */\n    public writeOneAtEditNode(p: Position): void {\n        const c = this.c;\n        const root = p.copy();\n        try {\n            c.endEditing();\n            c.init_error_dialogs();\n            if (! p.atEditNodeName()) {\n                return false;\n            }\n            if (p.hasChildren()) {\n                g.error('@edit nodes must ! have children');\n                g.es('To save your work, convert @edit to @auto, @file || @clean');\n                return false;\n            }\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = false;\n            // #1450.\n            if (! fileName || ! this.precheck(fileName, root)) {\n                this.addToOrphanList(root);\n                return false;\n            }\n            const contents = ''.join([s for s in g.splitLines(p.b);\n                if this.directiveKind4(s, 0) == this.noDirective]);\n            this.replaceFile(contents, this.encoding, fileName, root);\n            c.raise_error_dialogs(kind='write');\n            return true;\n        }\n        catch (Exception) {\n            this.writeException(fileName, root);\n            return false;\n        }\n    }\n    /**\n     * Write @file or @thin file.\n     */\n    public writeOneAtFileNode(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = true;\n            if (! fileName || ! this.precheck(fileName, root)) {\n                // Raise dialog warning of data loss.\n                this.addToOrphanList(root);\n                return;\n            }\n            const this.outputList = [];\n            this.putFile(root, sentinels=true);\n            this.warnAboutOrphandAndIgnoredNodes();\n            if (this.errors) {\n                g.es(\"! written:\", g.shortFileName(fileName));\n                this.addToOrphanList(root);\n            }\n            else {\n                const contents = ''.join(this.outputList);\n                this.replaceFile(contents, this.encoding, fileName, root);\n            }\n        }\n        catch (Exception) {\n            if (hasattr(this.root.v, 'tnodeList')) {\n                delattr(this.root.v, 'tnodeList');\n            }\n            this.writeException(fileName, root);\n        }\n    }\n    /**\n     * Write one @nosent node.\n     * root is the position of an @<file> node.\n     * sentinels will be False for @clean and @nosent nodes.\n     */\n    public writeOneAtNosentNode(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = false;\n            if (! fileName || ! this.precheck(fileName, root)) {\n                return;\n            }\n            const this.outputList = [];\n            this.putFile(root, sentinels=false);\n            this.warnAboutOrphandAndIgnoredNodes();\n            if (this.errors) {\n                g.es(\"! written:\", g.shortFileName(fileName));\n                this.addToOrphanList(root);\n            }\n            else {\n                const contents = ''.join(this.outputList);\n                this.replaceFile(contents, this.encoding, fileName, root);\n            }\n        }\n        catch (Exception) {\n            if (hasattr(this.root.v, 'tnodeList')) {\n                delattr(this.root.v, 'tnodeList');\n            }\n            this.writeException(fileName, root);\n        }\n    }\n    /**\n     * Write p, an @shadow node.\n     * File indices *must* have already been assigned.\n     *\n     * testing: set by unit tests to suppress the call to this.precheck.\n     * Testing is not the same as g.unitTesting.\n     */\n    public writeOneAtShadowNode(p: Position, testing=False): void {\n        const c = this.c;\n        const root = p.copy();\n        const x = c.shadowController;\n        try {\n            c.endEditing();  // Capture the current headline.\n            const fn = p.atShadowFileNodeName();\n            // assert fn, p.h;\n            this.adjustTargetLanguage(fn);\n                // A hack to support unknown extensions. May set c.target_language.\n            const full_path = g.fullPath(c, p);\n            this.initWriteIvars(root);\n            // Force python sentinels to suppress an error message.\n            // The actual sentinels will be set below.\n            const this.endSentinelComment = null;\n            const this.startSentinelComment = \";  // \"\n            // Make sure we can compute the shadow directory.\n            const private_fn = x.shadowPathName(full_path);\n            if (! private_fn) {\n                return false;\n            }\n            if (! testing && ! this.precheck(full_path, root)) {\n                return false;\n            }\n\n            // Bug fix: Leo 4.5.1:\n            // use x.markerFromFileName to force the delim to match\n            // what is used in x.propegate changes.\n            const marker = x.markerFromFileName(full_path);\n            this.startSentinelComment, this.endSentinelComment = marker.getDelims();\n            if (g.unitTesting) {\n                const ivars_dict = g.getIvarsDict(at);\n            }\n\n            // Write the public and private files to strings.\n\n            public function put(sentinels): void {\n                const this.outputList = [];\n                const this.sentinels = sentinels;\n                this.putFile(root, sentinels=sentinels);\n                // return '' if this.errors else ''.join(this.outputList);\n                return this.errors ? '' : ''.join(this.outputList);\n            }\n\n            this.public_s = put(false);\n            const this.private_s = put(true);\n            this.warnAboutOrphandAndIgnoredNodes();\n            if (g.unitTesting) {\n                const exceptions = ('public_s', 'private_s', 'sentinels', 'outputList');\n                // assert g.checkUnchangedIvars(\n                    this, ivars_dict, exceptions), 'writeOneAtShadowNode';\n            }\n            if (! this.errors) {\n                // Write the public and private files.\n                x.makeShadowDirectory(full_path);\n                    // makeShadowDirectory takes a *public* file name.\n                x.replaceFileWithString(this.encoding, private_fn, this.private_s);\n                x.replaceFileWithString(this.encoding, full_path, this.public_s);\n            }\n            this.checkPythonCode(contents=this.private_s, fileName=full_path, root=root);\n            if (this.errors) {\n                g.error(\"! written:\", full_path);\n                this.addToOrphanList(root);\n            }\n            else {\n                root.clearDirty();\n            }\n            return ! this.errors;\n        }\n        catch (Exception) {\n            this.writeException(full_path, root);\n            return false;\n        }\n    }\n    /**\n     * Use the language implied by fn's extension if\n     * there is a conflict between it and c.target_language.\n     */\n    public adjustTargetLanguage(fn): void {\n        const c = this.c;\n        junk, ext = g.os_path_splitext(fn);\n        if (ext) {\n            if (ext.startswith('.')) {\n                const ext = ext[1:];\n            }\n            const language = g.app.extension_dict.get(ext);\n            if (language) {\n                const c.target_language = language;\n            }\n            else {\n                // An unknown language.\n                // Use the default language, **not** 'unknown_language'\n                pass;\n            }\n        }\n    }\n    /**\n     * Write the @asis node to a string.\n     */\n    public atAsisToString(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            const fileName = this.initWriteIvars(root);\n            const this.outputList = [];\n            for (p in root.self_and_subtree(copy=false)) {\n                this.writeAsisNode(p);\n            }\n            // return '' if this.errors else ''.join(this.outputList);\n            return this.errors ? '' : ''.join(this.outputList);\n        }\n        catch (Exception) {\n            this.writeException(fileName, root);\n            return '';\n        }\n    }\n    /**\n     * Write the root @auto node to a string, and return it.\n     */\n    public atAutoToString(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = false;\n            // #1450.\n            if (! fileName) {\n                this.addToOrphanList(root);\n                return '';\n            }\n            return this.writeAtAutoContents(fileName, root) || '';\n        }\n        catch (Exception) {\n            this.writeException(fileName, root);\n            return '';\n        }\n    }\n    /**\n     * Write one @edit node.\n     */\n    public atEditToString(root): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            if (root.hasChildren()) {\n                g.error('@edit nodes must ! have children');\n                g.es('To save your work, convert @edit to @auto, @file || @clean');\n                return false;\n            }\n            const fileName = this.initWriteIvars(root);\n            const this.sentinels = false;\n            // #1450.\n            if (! fileName) {\n                this.addToOrphanList(root);\n                return '';\n            }\n            const contents = ''.join([\n                s for s in g.splitLines(root.b);\n                    if this.directiveKind4(s, 0) == this.noDirective]);\n            return contents;\n        }\n        catch (Exception) {\n            this.writeException(fileName, root);\n            return '';\n        }\n    }\n    /**\n     * Write an external file to a string, and return its contents.\n     */\n    public atFileToString(root, sentinels=True): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            this.initWriteIvars(root);\n            const this.sentinels = sentinels;\n            const this.outputList = [];\n            this.putFile(root, sentinels=sentinels);\n            // assert root == this.root, 'write';\n            // contents = '' if this.errors else ''.join(this.outputList);\n            const contents = this.errors ? '' : ''.join(this.outputList);\n            // Major bug: failure to clear this wipes out headlines!\n            // Sometimes this causes slight problems...\n            if (hasattr(this.root.v, 'tnodeList')) {\n                delattr(this.root.v, 'tnodeList');\n                const root.v._p_changed = true;\n            }\n            return contents;\n        }\n        catch (Exception) {\n            if (hasattr(this.root.v, 'tnodeList')) {\n                delattr(this.root.v, 'tnodeList');\n            }\n            this.exception(\"exception preprocessing script\");\n            const root.v._p_changed = true;\n            return '';\n        }\n    }\n    /**\n     * Write an external file from a string.\n     *\n     * This is this.write specialized for scripting.\n     */\n    public stringToString(root, s: string, forcePythonSentinels=True, sentinels=True): void {\n        const c = this.c;\n        try {\n            c.endEditing();\n            this.initWriteIvars(root);\n            if (forcePythonSentinels) {\n                const this.endSentinelComment = null;\n                const this.startSentinelComment = \";  // \"\n                const this.language = \"python\";\n            }\n            const this.sentinels = sentinels;\n            const this.outputList = [];\n            this.putFile(root, fromString=s, sentinels=sentinels);\n            // contents = '' if this.errors else ''.join(this.outputList);\n            const contents = this.errors ? '' : ''.join(this.outputList);\n            // Major bug: failure to clear this wipes out headlines!\n            // Sometimes this causes slight problems...\n            if (root) {\n                if (hasattr(this.root.v, 'tnodeList')) {\n                    delattr(this.root.v, 'tnodeList');\n                }\n                const root.v._p_changed = true;\n            }\n            return contents;\n        }\n        catch (Exception) {\n            this.exception(\"exception preprocessing script\");\n            return '';\n        }\n    }\n    /**\n     * Generate the body enclosed in sentinel lines.\n     * Return True if the body contains an @others line.\n     */\n    public putBody(p: Position, fromString=''): void {\n\n        // New in 4.3 b2: get s from fromString if possible.\n        // s = fromString if fromString else p.b;\n        const s = fromString ? fromString : p.b;\n        p.v.setVisited();\n            // Make sure v is never expanded again.\n            // Suppress orphans check.\n\n        // Fix #1048 & #1037: regularize most trailing whitespace.\n        if (s && (this.sentinels || this.force_newlines_in_at_nosent_bodies)) {\n            if (! s.endswith('\n')) {\n                const s = s + '\n';\n            }\n        }\n        const this.raw = False;  // Bug fix.\n        const i = 0;\n        const status = g.Bunch(\n            at_comment_seen=false,\n            at_delims_seen=false,\n            at_warning_given=false,\n            has_at_others=false,\n            in_code=true,\n        );\n        while (i < len(s)) {\n            const next_i = g.skip_line(s, i);\n            // assert next_i > i, 'putBody';\n            const kind = this.directiveKind4(s, i);\n            this.putLine(i, kind, p, s, status);\n            const i = next_i;\n        }\n        // pylint: disable=no-member\n            // g.bunch *does* have .in_code and has_at_others members.\n        if (! status.in_code) {\n            this.putEndDocLine();\n        }\n        return status.has_at_others;\n    }\n    /**\n     * Put the line at s[i:] of the given kind, updating the status.\n     */\n    public putLine(i: number, kind, p: Position, s: string, status): void {\n        if (kind == this.noDirective) {\n            if (status.in_code) {\n                if (this.raw) {\n                    this.putCodeLine(s, i);\n                }\n                else {\n                    name, n1, n2 = this.findSectionName(s, i);\n                    if (name) {\n                        this.putRefLine(s, i, n1, n2, name, p);\n                    }\n                    else {\n                        this.putCodeLine(s, i);\n                    }\n                }\n            }\n            else {\n                this.putDocLine(s, i);\n            }\n        }\n        else if (this.raw) {\n            if (kind == this.endRawDirective) {\n                const this.raw = false;\n                this.putSentinel(\"@@end_raw\");\n            }\n            else {\n                // Fix bug 784920: @raw mode does not ignore directives\n                this.putCodeLine(s, i);\n            }\n        }\n        else if (kind in (this.docDirective, this.atDirective)) {\n            if (! status.in_code) {\n                // Bug fix 12/31/04: handle adjacent doc parts.\n                this.putEndDocLine();\n            }\n            this.putStartDocLine(s, i, kind);\n            const status.in_code = false;\n        }\n        else if (kind in (this.cDirective, this.codeDirective)) {\n            // Only @c and @code end a doc part.\n            if (! status.in_code) {\n                this.putEndDocLine();\n            }\n            this.putDirective(s, i, p);\n            const status.in_code = true;\n        }\n        else if (kind == this.allDirective) {\n            if (status.in_code) {\n                if (p == this.root) {\n                    this.putAtAllLine(s, i, p);\n                }\n                else {\n                    // this.error(f\"@all ! valid in: {p.h}\");\n                    this.error(";
        not;
        valid in ;
        $;
        {
            p.h;
        }
        ");\n                }\n            }\n            else { // this.putDocLine(s, i)\n            }\n        }\n        else if (kind == this.othersDirective) {\n            if (status.in_code) {\n                if (status.has_at_others) {\n                    // this.error(f\"multiple @others in: {p.h}\");\n                    this.error(";
        multiple;
         in ;
        $;
        {
            p.h;
        }
        ");\n                }\n                else {\n                    this.putAtOthersLine(s, i, p);\n                    const status.has_at_others = true;\n                }\n            }\n            else {\n                this.putDocLine(s, i);\n            }\n        }\n        else if (kind == this.rawDirective) {\n            const this.raw = true;\n            this.putSentinel(\"@@raw\");\n        }\n        else if (kind == this.endRawDirective) {\n            // Fix bug 784920: @raw mode does not ignore directives\n            // this.error(f\"unmatched @end_raw directive: {p.h}\");\n            this.error(";
        unmatched;
        directive: $;
        {
            p.h;
        }
        ");\n        }\n        else if (kind == this.startVerbatim) {\n            // Fix bug 778204: @verbatim not a valid Leo directive.\n            if (g.unitTesting) {\n                // A hack: unit tests for @shadow use @verbatim as a kind of directive.\n                pass;\n            }\n            else {\n                // this.error(f\"@verbatim != a Leo directive: {p.h}\");\n                this.error(";
         != a;
        Leo;
        directive: $;
        {
            p.h;
        }
        ");\n            }\n        }\n        else if (kind == this.miscDirective) {\n            // Fix bug 583878: Leo should warn about @comment/@delims clashes.\n            if (g.match_word(s, i, '@comment')) {\n                const status.at_comment_seen = true;\n            }\n            else if (g.match_word(s, i, '@delims')) {\n                const status.at_delims_seen = true;\n            }\n            if (\n                status.at_comment_seen &&\n                status.at_delims_seen && !\n                status.at_warning_given\n            ) {\n                const status.at_warning_given = true;\n                // this.error(f\"@comment && @delims in node {p.h}\");\n                this.error(";
         && ;
         in node;
        $;
        {
            p.h;
        }
        ");\n            }\n            this.putDirective(s, i, p);\n        }\n        else {\n            // this.error(f\"putBody: can ! happen: unknown directive kind: {kind}\");\n            this.error(";
        putBody: can;
        not;
        happen: unknown;
        directive;
        kind: $;
        {
            kind;
        }
        ");\n        }\n    }\n    /**\n     * Put the expansion of @all.\n     */\n    public putAtAllLine(s: string, i: number, p: Position): void {\n        j, delta = g.skip_leading_ws_with_indent(s, i, this.tab_width);\n        const k = g.skip_to_end_of_line(s, i);\n        this.putLeadInSentinel(s, i, j, delta);\n        this.indent += delta;\n        this.putSentinel(\"@+\" + s[j + 1 : k].strip());\n            // s[j:k] starts with '@all'\n        for (child in p.children()) {\n            this.putAtAllChild(child);\n        }\n        this.putSentinel(\"@-all\");\n        this.indent -= delta;\n    }\n    /**\n     * Generate the body enclosed in sentinel lines.\n     */\n    public putAtAllBody(p: Position): void {\n        const s = p.b;\n        p.v.setVisited();\n            // Make sure v is never expanded again.\n            // Suppress orphans check.\n        if (this.sentinels && s && s[-1] != '\n') {\n            const s = s + '\n';\n        }\n        i, inCode = 0, true;\n        while (i < len(s)) {\n            const next_i = g.skip_line(s, i);\n            // assert next_i > i;\n            if (inCode) {\n                // Use verbatim sentinels to write all directives.\n                this.putCodeLine(s, i);\n            }\n            else {\n                this.putDocLine(s, i);\n            }\n            const i = next_i;\n        }\n        if (! inCode) {\n            this.putEndDocLine();\n        }\n    }\n    /**\n     * This code puts only the first of two or more cloned siblings, preceding\n     * the clone with an @clone n sentinel.\n     *\n     * This is a debatable choice: the cloned tree appears only once in the\n     * external file. This should be benign; the text created by @all is\n     * likely to be used only for recreating the outline in Leo. The\n     * representation in the derived file doesn't matter much.\n     */\n    public putAtAllChild(p: Position): void {\n        this.putOpenNodeSentinel(p, inAtAll=true);\n            // Suppress warnings about @file nodes.\n        this.putAtAllBody(p);\n        for (child in p.children()) {\n            this.putAtAllChild(child);\n        }\n        this.putCloseNodeSentinel(p);\n    }\n    /**\n     * Put the expansion of @others.\n     */\n    public putAtOthersLine(s: string, i: number, p: Position): void {\n        j, delta = g.skip_leading_ws_with_indent(s, i, this.tab_width);\n        const k = g.skip_to_end_of_line(s, i);\n        this.putLeadInSentinel(s, i, j, delta);\n        this.indent += delta;\n        this.putSentinel(\"@+\" + s[j + 1 : k].strip());\n            // s[j:k] starts with '@others'\n            // Never write lws in new sentinels.\n        for (child in p.children()) {\n            const p = child.copy();\n            const after = p.nodeAfterTree();\n            while (p && p != after) {\n                if (this.validInAtOthers(p)) {\n                    this.putOpenNodeSentinel(p);\n                    const at_others_flag = this.putBody(p);\n                    this.putCloseNodeSentinel(p);\n                    if (at_others_flag) {\n                        p.moveToNodeAfterTree();\n                    }\n                    else {\n                        p.moveToThreadNext();\n                    }\n                }\n                else {\n                    p.moveToNodeAfterTree();\n                }\n            }\n        }\n        // This is the same in both old and new sentinels.\n        this.putSentinel(\"@-others\");\n        this.indent -= delta;\n    }\n    public putAtOthersChild(p: Position): void {\n        this.putOpenNodeSentinel(p);\n        this.putBody(p);\n        this.putCloseNodeSentinel(p);\n    }\n    /**\n     * Return True if p should be included in the expansion of the @others\n     * directive in the body text of p's parent.\n     */\n    public validInAtOthers(p: Position): void {\n        const i = g.skip_ws(p.h, 0);\n        isSection, junk = this.isSectionName(p.h, i);\n        if (isSection) {\n            return False;  // A section definition node.\n        }\n        if (this.sentinels) {\n            // @ignore must not stop expansion here!\n            return true;\n        }\n        if (p.isAtIgnoreNode()) {\n            g.error('did ! write @ignore node', p.v.h);\n            return false;\n        }\n        return true;\n    }\n    /**\n     * Put a normal code line.\n     */\n    public putCodeLine(s: string, i: number): void {\n        // Put @verbatim sentinel if required.\n        const k = g.skip_ws(s, i);\n        if (g.match(s, k, this.startSentinelComment + '@')) {\n            this.putSentinel('@verbatim');\n        }\n        const j = g.skip_line(s, i);\n        const line = s[i:j];\n        // Don't put any whitespace in otherwise blank lines.\n        if (len(line) > 1) { // # Preserve *anything* the user puts on the line!!!\n            if (! this.raw) {\n                this.putIndent(this.indent, line);\n            }\n            if (line[-1) { // ] == '\n':\n                this.os(line[:-1]);\n                this.onl();\n            }\n            else {\n                this.os(line);\n            }\n        }\n        else if (line && line[-1] == '\n') {\n            this.onl();\n        }\n        else if (line) {\n            this.os(line);  // Bug fix: 2013/09/16\n        }\n        else {\n            g.trace('Can ! happen: completely empty line');\n        }\n    }\n    /**\n     * Put a line containing one or more references.\n     */\n    public putRefLine(s: string, i: number, n1, n2, name, p: Position): void {\n        const ref = this.findReference(name, p);\n        const is_clean = this.root.h.startswith('@clean');\n        if (! ref) {\n            if (hasattr(this, 'allow_undefined_refs')) {\n                // Allow apparent section reference: just write the line.\n                this.putCodeLine(s, i);\n            }\n            return;\n        }\n        // Compute delta only once.\n        junk, delta = g.skip_leading_ws_with_indent(s, i, this.tab_width);\n        // Write the lead-in sentinel only once.\n        this.putLeadInSentinel(s, i, n1, delta);\n        this.putRefAt(name, ref, delta);\n        const n_refs = 0;\n        while (1) {\n            const progress = i;\n            const i = n2;\n            n_refs += 1;\n            name, n1, n2 = this.findSectionName(s, i);\n            if (is_clean && n_refs > 1) {\n                // #1232: allow only one section reference per line in @clean.\n                i1, i2 = g.getLine(s, i);\n                const line = s[i1:i2].rstrip();\n                // this.writeError(f\"Too many section references:\n{line!s}\");\n                this.writeError(";
        Too;
        many;
        section;
        references: ;
        n$;
        {
            line;
        }
        ");\n                break;\n            }\n            if (name) {\n                const ref = this.findReference(name, p);\n                    // Issues error if not found.\n                if (ref) {\n                    const middle_s = s[i:n1];\n                    this.putAfterMiddleRef(middle_s, delta);\n                    this.putRefAt(name, ref, delta);\n                }\n            }\n            else {\n                break;\n            }\n            // assert progress < i;\n        }\n        this.putAfterLastRef(s, i, delta);\n    }\n    /**\n     * Find a reference to name.  Raise an error if not found.\n     */\n    public findReference(name, p: Position): void {\n        const ref = g.findReference(name, p);\n        if (! ref && ! hasattr(this, 'allow_undefined_refs')) {\n            // Do give this error even if unit testing.\n            this.writeError(\n                // f\"undefined section: {g.truncate(name, 60)}\n\";\n                ";
        undefined;
        section: $;
        {
            g.truncate(name, 60);
        }
        n(__makeTemplateObject([";\n                // f\"  referenced from: {g.truncate(p.h, 60)}\");\n                "], [";\n                // f\"  referenced from: {g.truncate(p.h, 60)}\");\n                "]));
        referenced;
        from: $;
        {
            g.truncate(p.h, 60);
        }
        ");\n        }\n        return ref;\n    }\n    /**\n     * Return n1, n2 representing a section name.\n     * The section name, *including* brackes is s[n1:n2]\n     */\n    public findSectionName(s: string, i: number): void {\n        const end = s.find('\n', i);\n        if (end == -1) {\n            const n1 = s.find(\"<<\", i);\n            const n2 = s.find(\">>\", i);\n        }\n        else {\n            const n1 = s.find(\"<<\", i, end);\n            const n2 = s.find(\">>\", i, end);\n        }\n        const ok = -1 < n1 < n2;\n        if (ok) {\n            // Warn on extra brackets.\n            for (ch, j in (('<', n1 + 2), ('>', n2 + 2))) {\n                if (g.match(s, j, ch)) {\n                    const line = g.get_line(s, i);\n                    g.es('dubious brackets in', line);\n                    break;\n                }\n            }\n            const name = s[n1 : n2 + 2];\n            return name, n1, n2 + 2;\n        }\n        return null, n1, len(s);\n    }\n    /**\n     * Handle whatever follows the last ref of a line.\n     */\n    public putAfterLastRef(s: string, start, delta): void {\n        const j = g.skip_ws(s, start);\n        if (j < len(s) && s[j] != '\n') {\n            // Temporarily readjust delta to make @afterref look better.\n            this.indent += delta;\n            this.putSentinel(\"@afterref\");\n            const end = g.skip_line(s, start);\n            const after = s[start:end];\n            this.os(after);\n            if (this.sentinels && after && after[-1] != '\n') {\n                this.onl();  // Add a newline if the line didn't end with one.\n            }\n            this.indent -= delta;\n        }\n    }\n    /**\n     * Handle whatever follows a ref that is not the last ref of a line.\n     */\n    public putAfterMiddleRef(s: string, delta): void {\n        if (s) {\n            this.indent += delta;\n            this.putSentinel(\"@afterref\");\n            this.os(s);\n            this.onl_sent();  // Not a real newline.\n            this.indent -= delta;\n        }\n    }\n    public putRefAt(name, ref, delta): void {\n        // #132: Section Reference causes clone...\n\n        // Never put any @+middle or @-middle sentinels.\n        this.indent += delta;\n        this.putSentinel(\"@+\" + name);\n        this.putOpenNodeSentinel(ref);\n        this.putBody(ref);\n        this.putCloseNodeSentinel(ref);\n        this.putSentinel(\"@-\" + name);\n        this.indent -= delta;\n    }\n    public putBlankDocLine(): void {\n        if (! this.endSentinelComment) {\n            this.putIndent(this.indent);\n            this.os(this.startSentinelComment);\n            // #1496: Retire the @doc convention.\n            // Remove the blank.\n            // this.oblank()\n        }\n        this.onl();\n    }\n    /**\n     * Handle one line of a doc part.\n     */\n    public putDocLine(s: string, i: number): void {\n        const j = g.skip_line(s, i);\n        const s = s[i:j];\n\n        // #1496: Retire the @doc convention:\n        // Strip all trailing ws here.\n        if (! s.strip()) {\n            // A blank line.\n            this.putBlankDocLine();\n            return;\n        }\n        // Write the line as it is.\n        this.putIndent(this.indent);\n        if (! this.endSentinelComment) {\n            this.os(this.startSentinelComment);\n            // #1496: Retire the @doc convention.\n            // Leave this blank. The line is not blank.\n            this.oblank();\n        }\n        this.os(s);\n        if (! s.endswith('\n')) {\n            this.onl();\n        }\n    }\n    /**\n     * Write the conclusion of a doc part.\n     */\n    public putEndDocLine(): void {\n        // Put the closing delimiter if we are using block comments.\n        if (this.endSentinelComment) {\n            this.putIndent(this.indent);\n            this.os(this.endSentinelComment);\n            this.onl();  // Note: no trailing whitespace.\n        }\n    }\n    /**\n     * Write the start of a doc part.\n     */\n    public putStartDocLine(s: string, i: number, kind): void {\n        // sentinel = \"@+doc\" if kind == this.docDirective else \"@+at\";\n        const sentinel = kind == this.docDirective ? \"@+doc\" : \"@+at\";\n        // directive = \"@doc\" if kind == this.docDirective else \"@\";\n        const directive = kind == this.docDirective ? \"@doc\" : \"@\";\n        // Put whatever follows the directive in the sentinel.\n        // Skip past the directive.\n        i += len(directive);\n        const j = g.skip_to_end_of_line(s, i);\n        const follow = s[i:j];\n        // Put the opening @+doc or @-doc sentinel, including whatever follows the directive.\n        this.putSentinel(sentinel + follow);\n        // Put the opening comment if we are using block comments.\n        if (this.endSentinelComment) {\n            this.putIndent(this.indent);\n            this.os(this.startSentinelComment);\n            this.onl();\n        }\n    }\n    /**\n     * Return the text of a @+node or @-node sentinel for p.\n     */\n    public nodeSentinelText(p: Position): void {\n        const h = this.removeCommentDelims(p);\n        if (getattr(this, 'at_shadow_test_hack', false)) {\n            // A hack for @shadow unit testing.\n            // see AtShadowTestCase.makePrivateLines.\n            return h;\n        }\n        const gnx = p.v.fileIndex;\n        const level = 1 + p.level() - this.root.level();\n        if (level > 2) {\n            // return f\"{gnx}: *{level}* {h}\";\n            return ";
        $;
        {
            gnx;
        }
         * $;
        {
            level;
        }
         * $;
        {
            h;
        }
        ";\n        }\n        // return f\"{gnx}: {'*' * level} {h}\";\n        return ";
        $;
        {
            gnx;
        }
        $;
        {
            '*' * level;
        }
        $;
        {
            h;
        }
        ";\n    }\n    /**\n     * If the present @language/@comment settings do not specify a single-line comment\n     * we remove all block comment delims from h. This prevents headline text from\n     * interfering with the parsing of node sentinels.\n     */\n    public removeCommentDelims(p: Position): void {\n        const start = this.startSentinelComment;\n        const end = this.endSentinelComment;\n        const h = p.h;\n        if (end) {\n            const h = h.replace(start, \"\");\n            const h = h.replace(end, \"\");\n        }\n        return h;\n    }\n    /**\n     * Set this.leadingWs as needed for @+others and @+<< sentinels.\n     *\n     * i points at the start of a line.\n     * j points at @others or a section reference.\n     * delta is the change in this.indent that is about to happen and hasn't happened yet.\n     */\n    public putLeadInSentinel(s: string, i: number, j: number, delta): void {\n        const this.leadingWs = \"\";  // Set the default.\n        if (i == j) {\n            return;  // The @others or ref starts a line.\n        }\n        const k = g.skip_ws(s, i);\n        if (j == k) {\n            // Only whitespace before the @others or ref.\n            const this.leadingWs = s[\n                i:j];  // Remember the leading whitespace, including its spelling.\n        }\n        else {\n            this.putIndent(this.indent);  // 1/29/04: fix bug reported by Dan Winkler.\n            this.os(s[i:j]);\n            this.onl_sent();\n        }\n    }\n    /**\n     * End a node.\n     */\n    public putCloseNodeSentinel(p: Position): void {\n        const this.raw = False;  // Bug fix: 2010/07/04\n    }\n    /**\n     * Write @+leo sentinel.\n     */\n    public putOpenLeoSentinel(s: string): void {\n        if (this.sentinels || hasattr(this, 'force_sentinels')) {\n            const s = s + \"-thin\";\n            const encoding = this.encoding.lower();\n            if (encoding != \"utf-8\") {\n                // New in 4.2: encoding fields end in \",.\"\n                // s = s + f\"-encoding={encoding},.\";\n                const s = s + " - encoding;
        $;
        {
            encoding;
        }
        ";\n            }\n            this.putSentinel(s);\n        }\n    }\n    /**\n     * Write @+node sentinel for p.\n     */\n    public putOpenNodeSentinel(p: Position, inAtAll=False): void {\n        // Note: lineNumbers.py overrides this method.\n        if (! inAtAll && p.isAtFileNode() && p != this.root) {\n            this.writeError(\"@file ! valid in: \" + p.h);\n            return;\n        }\n        const s = this.nodeSentinelText(p);\n        this.putSentinel(\"@+node:\" + s);\n        // Leo 4.7 b2: we never write tnodeLists.\n    }\n    /**\n     * Write a sentinel whose text is s, applying the CWEB hack if needed.\n     *\n     * This method outputs all sentinels.\n     */\n    public putSentinel(s: string): void {\n        if (this.sentinels || hasattr(this, 'force_sentinels')) {\n            this.putIndent(this.indent);\n            this.os(this.startSentinelComment);\n            // #2194. The following would follow the black convention,\n            // but doing so is a dubious idea.\n                // this.os('  ')\n            // Apply the cweb hack to s:\n            // If the opening comment delim ends in '@',\n            // double all '@' signs except the first.\n            const start = this.startSentinelComment;\n            if (start && start[-1] == '@') {\n                const s = s.replace('@', '@@')[1:];\n            }\n            this.os(s);\n            if (this.endSentinelComment) {\n                this.os(this.endSentinelComment);\n            }\n            this.onl();\n        }\n    }\n    /**\n     * Mark the root as erroneous for c.raise_error_dialogs().\n     */\n    public addToOrphanList(root): void {\n        const c = this.c;\n        // Fix #1050:\n        root.setOrphan();\n        c.orphan_at_file_nodes.append(root.h);\n    }\n    /**\n     * Return True if the path is writable.\n     */\n    public isWritable(path): void {\n        try {\n            // os.access() may not exist on all platforms.\n            const ok = os.access(path, os.W_OK);\n        }\n        catch (AttributeError) {\n            return true;\n        }\n        if (! ok) {\n            g.es('read only:', repr(path), color='red');\n        }\n        return ok;\n    }\n    /**\n     * Perform python-related checks on root.\n     */\n    public checkPythonCode(contents, fileName, root, pyflakes_errors_only=False): void {\n        if (\n            contents && fileName && fileName.endswith('.py')\n            && this.checkPythonCodeOnWrite\n        ) {\n            // It's too slow to check each node separately.\n            if (pyflakes_errors_only) {\n                const ok = true;\n            }\n            else {\n                const ok = this.checkPythonSyntax(root, contents);\n            }\n            // Syntax checking catches most indentation problems.\n                // if ok: this.tabNannyNode(root,s)\n            if (ok && this.runPyFlakesOnWrite && ! g.unitTesting) {\n                const ok2 = this.runPyflakes(root, pyflakes_errors_only=pyflakes_errors_only);\n            }\n            else {\n                const ok2 = true;\n            }\n            if (! ok || ! ok2) {\n                g.app.syntax_error_files.append(g.shortFileName(fileName));\n            }\n        }\n    }\n    public checkPythonSyntax(p: Position, body, supress=False): void {\n        try {\n            const body = body.replace('\r', '');\n            // fn = f\"<node: {p.h}>\";\n            const fn = " < node;
        $;
        {
            p.h;
        }
         > ";\n            compile(body + '\n', fn, 'exec');\n            return true;\n        }\n        catch (SyntaxError) {\n            if (! supress) {\n                this.syntaxError(p, body);\n            }\n        }\n        catch (Exception) {\n            g.trace(\"unexpected exception\");\n            g.es_exception();\n        }\n        return false;\n    }\n    /**\n     * Report a syntax error.\n     */\n    public syntaxError(p: Position, body): void {\n        // g.error(f\"Syntax error in: {p.h}\");\n        g.error(";
        Syntax;
        error in ;
        $;
        {
            p.h;
        }
        ");\n        typ, val, tb = sys.exc_info();\n        const message = hasattr(val, 'message') && val.message;\n        if (message) {\n            g.es_print(message);\n        }\n        if (val == null) {\n            return;\n        }\n        const lines = g.splitLines(body);\n        const n = val.lineno;\n        const offset = val.offset || 0;\n        if (n == null) {\n            return;\n        }\n        const i = val.lineno - 1;\n        for (j in range(max(0, i - 2), min(i + 2, len(lines) - 1))) {\n            const line = lines[j].rstrip();\n            if (j == i) {\n                const unl = p.get_UNL(with_proto=true, with_count=true);\n                // g.es_print(f\"{j+1:5}:* {line}\", nodeLink=f\"{unl},-{j+1:d}\");  // Global line.\n                g.es_print(";
        $;
        {
            j + 1;
            5;
        }
         * $;
        {
            line;
        }
        ", nodeLink=f\"{unl},-{j+1:d}\");  // Global line.\n                g.es_print(' ' * (7 + offset) + '^');\n            }\n            else {\n                // g.es_print(f\"{j+1:5}: {line}\");\n                g.es_print(";
        $;
        {
            j + 1;
            5;
        }
        $;
        {
            line;
        }
        ");\n            }\n        }\n    }\n    /**\n     * Run pyflakes on the selected node.\n     */\n    public runPyflakes(root, pyflakes_errors_only): void {\n        try {\n            // from \"leo.commands\" import checkerCommands\n            if (checkerCommands.pyflakes) {\n                const x = checkerCommands.PyflakesCommand(this.c);\n                const ok = x.run(p=root, pyflakes_errors_only=pyflakes_errors_only);\n                return ok;\n            }\n            return True;  // Suppress error if pyflakes can not be imported.\n        }\n        catch (Exception) {\n            g.es_exception();\n            return false;\n        }\n    }\n    public tabNannyNode(p: Position, body): void {\n        try {\n            const readline = g.ReadLinesClass(body).next;\n            tabnanny.process_tokens(tokenize.generate_tokens(readline));\n        }\n        catch (IndentationError) {\n            if (g.unitTesting) {\n                raise;\n            }\n            junk2, msg, junk = sys.exc_info();\n            g.error(\"IndentationError in\", p.h);\n            g.es('', str(msg));\n        }\n        catch (tokenize.TokenError) {\n            if (g.unitTesting) {\n                raise;\n            }\n            junk3, msg, junk = sys.exc_info();\n            g.error(\"TokenError in\", p.h);\n            g.es('', str(msg));\n        }\n        catch (tabnanny.NannyNag) {\n            if (g.unitTesting) {\n                raise;\n            }\n            junk4, nag, junk = sys.exc_info();\n            const badline = nag.get_lineno();\n            const line = nag.get_line();\n            const message = nag.get_msg();\n            g.error(\"indentation error in\", p.h, \"line\", badline);\n            g.es(message);\n            const line2 = repr(str(line))[1:-1];\n            g.es(\"offending line:\n\", line2);\n        }\n        catch (Exception) {\n            g.trace(\"unexpected exception\");\n            g.es_exception();\n            raise;\n        }\n    }\n    // These patterns exclude constructs such as @encoding.setter or @encoding(whatever)\n    // However, they must allow @language typescript, @nocolor-node, etc.\n\n    const at_directive_kind_pattern = re.compile(r's*@([w-]+)s*');\n\n    /**\n     * Return the kind of at-directive or noDirective.\n     *\n     * Potential simplifications:\n     * - Using strings instead of constants.\n     * - Using additional regex's to recognize directives.\n     */\n    public directiveKind4(s: string, i: number): void {\n        const n = len(s);\n        if (i >= n || s[i] != '@') {\n            const j = g.skip_ws(s, i);\n            if (g.match_word(s, j, \"@others\")) {\n                return this.othersDirective;\n            }\n            if (g.match_word(s, j, \"@all\")) {\n                return this.allDirective;\n            }\n            return this.noDirective;\n        }\n        const table = (\n            (\"@all\", this.allDirective),\n            (\"@c\", this.cDirective),\n            (\"@code\", this.codeDirective),\n            (\"@doc\", this.docDirective),\n            (\"@end_raw\", this.endRawDirective),\n            (\"@others\", this.othersDirective),\n            (\"@raw\", this.rawDirective),\n            (\"@verbatim\", this.startVerbatim));\n        // Rewritten 6/8/2005.\n        if (i + 1 >= n || s[i + 1] in (' ', '\t', '\n')) {\n            // Bare '@' not recognized in cweb mode.\n            // return this.noDirective if this.language == \"cweb\" else this.atDirective;\n            return this.language == \"cweb\" ? this.noDirective : this.atDirective;\n        }\n        if (! s[i + 1].isalpha()) {\n            return this.noDirective  // Bug fix: do NOT return miscDirective here!\n        }\n        if (this.language == \"cweb\" && g.match_word(s, i, '@c')) {\n            return this.noDirective;\n        }\n        for (name, directive in table) {\n            if (g.match_word(s, i, name)) {\n                return directive;\n            }\n        }\n        // Support for add_directives plugin.\n        // Use regex to properly distinguish between Leo directives\n        // and python decorators.\n        const s2 = s[i:];\n        const m = this.at_directive_kind_pattern.match(s2);\n        if (m) {\n            const word = m.group(1);\n            if (word ! in g.globalDirectiveList) {\n                return this.noDirective;\n            }\n            const s3 = s2[m.end(1) :];\n            if (s3 && s3[0] in \".(\") {\n                return this.noDirective;\n            }\n            return this.miscDirective;\n        }\n        return this.noDirective;\n    }\n    // returns (flag, end). end is the index of the character after the section name.\n\n    public isSectionName(s: string, i: number): void {\n        // 2013/08/01: bug fix: allow leading periods.\n        while (i < len(s) && s[i] == '.') {\n            i += 1;\n        }\n        if (! g.match(s, i, \"<<\")) {\n            return false, -1;\n        }\n        const i = g.find_on_line(s, i, \">>\");\n        if (i > -1) {\n            return true, i + 2;\n        }\n        return false, -1;\n    }\n    public oblank(): void {\n        this.os(' ');\n    }\n\n    public oblanks(n: number): void {\n        this.os(' ' * abs(n));\n    }\n\n    public otabs(n: number): void {\n        this.os('\t' * abs(n));\n    }\n    /**\n     * Write a newline to the output stream.\n     */\n    public onl(): void {\n        this.os('\n');  // **not** this.output_newline\n    }\n\n    /**\n     * Write a newline to the output stream, provided we are outputting sentinels.\n     */\n    public onl_sent(): void {\n        if (this.sentinels) {\n            this.onl();\n        }\n    }\n    /**\n     * Append a string to this.outputList.\n     *\n     * All output produced by leoAtFile module goes here.\n     */\n    public os(s: string): void {\n        if (s.startswith(this.underindentEscapeString)) {\n            try {\n                junk, s = this.parseUnderindentTag(s);\n            }\n            catch (Exception) {\n                this.exception(\"exception writing:\" + s);\n                return;\n            }\n        }\n        const s = g.toUnicode(s, this.encoding);\n        this.outputList.append(s);\n    }\n    /**\n     * Write the string s as-is except that we replace '\n' with the proper line ending.\n     *\n     * Calling this.onl() runs afoul of queued newlines.\n     */\n    public outputStringWithLineEndings(s: string): void {\n        const s = g.toUnicode(s, this.encoding);\n        const s = s.replace('\n', this.output_newline);\n        this.os(s);\n    }\n    /**\n     * Check whether a dirty, potentially dangerous, file should be written.\n     *\n     * Return True if so.  Return False *and* issue a warning otherwise.\n     */\n    public precheck(fileName, root): void {\n\n        // #1450: First, check that the directory exists.\n        const theDir = g.os_path_dirname(fileName);\n        if (theDir && ! g.os_path_exists(theDir)) {\n            // this.error(f\"Directory ! found:\n{theDir}\");\n            this.error(";
        Directory;
        not;
        found: ;
        n$;
        {
            theDir;
        }
        ");\n            return false;\n        }\n\n        // Now check the file.\n        if (! this.shouldPromptForDangerousWrite(fileName, root)) {\n            // Fix bug 889175: Remember the full fileName.\n            this.rememberReadPath(fileName, root);\n            return true;\n        }\n\n        // Prompt if the write would overwrite the existing file.\n        const ok = this.promptForDangerousWrite(fileName);\n        if (ok) {\n            // Fix bug 889175: Remember the full fileName.\n            this.rememberReadPath(fileName, root);\n            return true;\n        }\n\n        // Fix #1031: do not add @ignore here!\n        g.es(\"! written:\", fileName);\n        return false;\n    }\n    /**\n     * Write any @firstlines from string s.\n     * These lines are converted to @verbatim lines,\n     * so the read logic simply ignores lines preceding the @+leo sentinel.\n     */\n    public putAtFirstLines(s: string): void {\n        const tag = \"@first\";\n        const i = 0;\n        while (g.match(s, i, tag)) {\n            i += len(tag);\n            const i = g.skip_ws(s, i);\n            const j = i;\n            const i = g.skip_to_end_of_line(s, i);\n            // Write @first line, whether empty or not\n            const line = s[j:i];\n            this.os(line);\n            this.onl();\n            const i = g.skip_nl(s, i);\n        }\n    }\n    /**\n     * Write any @last lines from string s.\n     * These lines are converted to @verbatim lines,\n     * so the read logic simply ignores lines following the @-leo sentinel.\n     */\n    public putAtLastLines(s: string): void {\n        const tag = \"@last\";\n        // Use g.splitLines to preserve trailing newlines.\n        const lines = g.splitLines(s);\n        const n = len(lines);\n        const j = k = n - 1;\n        // Scan backwards for @last directives.\n        while (j >= 0) {\n            const line = lines[j];\n            if (g.match(line, 0, tag)) {\n                j -= 1;\n            }\n            else if (! line.strip()) {\n                j -= 1;\n            }\n            else { // break\n            }\n        }\n        // Write the @last lines.\n        for (line in lines[j + 1) { // k + 1]:\n            if (g.match(line, 0, tag)) {\n                const i = len(tag);\n                const i = g.skip_ws(line, i);\n                this.os(line[i:]);\n            }\n        }\n    }\n    /**\n     * Output a sentinel a directive or reference s.\n     *\n     * It is important for PHP and other situations that @first and @last\n     * directives get translated to verbatim lines that do *not* include what\n     * follows the @first & @last directives.\n     */\n    public putDirective(s: string, i: number, p: Position): void {\n        const k = i;\n        const j = g.skip_to_end_of_line(s, i);\n        const directive = s[i:j];\n        if (g.match_word(s, k, \"@delims\")) {\n            this.putDelims(directive, s, k);\n        }\n        else if (g.match_word(s, k, \"@language\")) {\n            this.putSentinel(\"@\" + directive);\n        }\n        else if (g.match_word(s, k, \"@comment\")) {\n            this.putSentinel(\"@\" + directive);\n        }\n        else if (g.match_word(s, k, \"@last\")) {\n            // #1307.\n            if (p.isAtCleanNode()) {\n                // this.error(f\"ignoring @last directive in {p.h!r}\");\n                this.error(";
        ignoring;
        directive in $;
        {
            p.h;
        }
        ");\n                g.es_print('@last != valid in @clean nodes');\n            }\n            // #1297.\n            else if (g.app.inScript || g.unitTesting || p.isAnyAtFileNode()) {\n                this.putSentinel(\"@@last\");\n                    // Convert to an verbatim line _without_ anything else.\n            }\n            else {\n                // this.error(f\"ignoring @last directive in {p.h!r}\");\n                this.error(";
        ignoring;
        directive in $;
        {
            p.h;
        }
        ");\n            }\n        }\n        else if (g.match_word(s, k, \"@first\")) {\n            // #1307.\n            if (p.isAtCleanNode()) {\n                // this.error(f\"ignoring @first directive in {p.h!r}\");\n                this.error(";
        ignoring;
        directive in $;
        {
            p.h;
        }
        ");\n                g.es_print('@first != valid in @clean nodes');\n            }\n            // #1297.\n            else if (g.app.inScript || g.unitTesting || p.isAnyAtFileNode()) {\n                this.putSentinel(\"@@first\");\n                    // Convert to an verbatim line _without_ anything else.\n            }\n            else {\n                // this.error(f\"ignoring @first directive in {p.h!r}\");\n                this.error(";
        ignoring;
        directive in $;
        {
            p.h;
        }
        ");\n            }\n        }\n        else {\n            this.putSentinel(\"@\" + directive);\n        }\n        const i = g.skip_line(s, k);\n        return i;\n    }\n    /**\n     * Put an @delims directive.\n     */\n    public putDelims(directive, s: string, k: number): void {\n        // Put a space to protect the last delim.\n        this.putSentinel(directive + \" \");  // 10/23/02: put @delims, not @@delims\n        // Skip the keyword and whitespace.\n        const j = i = g.skip_ws(s, k + len(\"@delims\"));\n        // Get the first delim.\n        while (i < len(s) && ! g.is_ws(s[i]) && ! g.is_nl(s, i)) {\n            i += 1;\n        }\n        if (j < i) {\n            const this.startSentinelComment = s[j:i];\n            // Get the optional second delim.\n            const j = i = g.skip_ws(s, i);\n            while (i < len(s) && ! g.is_ws(s[i]) && ! g.is_nl(s, i)) {\n                i += 1;\n            }\n            // this.endSentinelComment = s[j:i] if j < i else \"\";\n            const this.endSentinelComment = j < i ? s[j:i] : \"\";\n        }\n        else {\n            this.writeError(\"Bad @delims directive\");\n        }\n    }\n    /**\n     * Put tabs and spaces corresponding to n spaces,\n     * assuming that we are at the start of a line.\n     *\n     * Remove extra blanks if the line starts with the underindentEscapeString\n     */\n    public putIndent(n: number, s=''): void {\n        const tag = this.underindentEscapeString;\n        if (s.startswith(tag)) {\n            n2, s2 = this.parseUnderindentTag(s);\n            if (n2 >= n) {\n                return;\n            }\n            if (n > 0) {\n                n -= n2;\n            }\n            else {\n                n += n2;\n            }\n        }\n        if (n > 0) {\n            const w = this.tab_width;\n            if (w > 1) {\n                q, r = divmod(n, w);\n                this.otabs(q);\n                this.oblanks(r);\n            }\n            else {\n                this.oblanks(n);\n            }\n        }\n    }\n    public putInitialComment(): void {\n        const c = this.c;\n        const s2 = c.config.output_initial_comment;\n        if (s2) {\n            const lines = s2.split(\"\\n\");\n            for (line in lines) {\n                const line = line.replace(\"@date\", time.asctime());\n                if (line) {\n                    this.putSentinel(\"@comment \" + line);\n                }\n            }\n        }\n    }\n    /**\n     * Write or create the given file from the contents.\n     * Return True if the original file was changed.\n     */\n    public replaceFile(contents, encoding, fileName, root, ignoreBlankLines=False): void {\n        const c = this.c;\n        if (root) {\n            root.clearDirty();\n        }\n\n        // Create the timestamp (only for messages).\n        if (c.config.getBool('log-show-save-time', default_val=false)) {\n            format = c.config.getString('log-timestamp-format') || \"%H:%M:%S\";\n            const timestamp = time.strftime(format) + ' ';\n        }\n        else {\n            const timestamp = '';\n        }\n\n        // Adjust the contents.\n        // assert isinstance(contents, str), g.callers();\n        if (this.output_newline != '\n') {\n            const contents = contents.replace('\r', '').replace('\n', this.output_newline);\n        }\n\n        // If file does not exist, create it from the contents.\n        const fileName = g.os_path_realpath(fileName);\n        const sfn = g.shortFileName(fileName);\n        if (! g.os_path_exists(fileName)) {\n            const ok = g.writeFile(contents, encoding, fileName);\n            if (ok) {\n                c.setFileTimeStamp(fileName);\n                if (! g.unitTesting) {\n                    // g.es(f\"{timestamp}created: {fileName}\");\n                    g.es(";
        $;
        {
            timestamp;
        }
        created: $;
        {
            fileName;
        }
        ");\n                }\n                if (root) {\n                    // Fix bug 889175: Remember the full fileName.\n                    this.rememberReadPath(fileName, root);\n                    this.checkPythonCode(contents, fileName, root);\n                }\n            }\n            else {\n                this.addToOrphanList(root);\n            }\n            // No original file to change. Return value tested by a unit test.\n            return False;  // No change to original file.\n        }\n\n        // Compare the old and new contents.\n        const old_contents = g.readFileIntoUnicodeString(fileName,\n            encoding=this.encoding, silent=true);\n        if (! old_contents) {\n            const old_contents = '';\n        }\n        const unchanged = (\n            contents == old_contents;\n            || (! this.explicitLineEnding && this.compareIgnoringLineEndings(old_contents, contents));\n            || ignoreBlankLines && this.compareIgnoringBlankLines(old_contents, contents));\n        if (unchanged) {\n            this.unchangedFiles += 1;\n            if ! g.unitTesting && c.config.getBool(\n                'report-unchanged-files', default_val=true):\n                // g.es(f\"{timestamp}unchanged: {sfn}\");\n                g.es(";
        $;
        {
            timestamp;
        }
        unchanged: $;
        {
            sfn;
        }
        ");\n            // Leo 5.6: Check unchanged files.\n            this.checkPythonCode(contents, fileName, root, pyflakes_errors_only=true);\n            return False;  // No change to original file.\n        }\n\n        // Warn if we are only adjusting the line endings.\n        if (this.explicitLineEnding) {\n            const ok = (\n                this.compareIgnoringLineEndings(old_contents, contents) ||\n                ignoreBlankLines && this.compareIgnoringLineEndings(\n                old_contents, contents));\n            if (! ok) {\n                g.warning(\"correcting line endings in:\", fileName);\n            }\n        }\n\n        // Write a changed file.\n        const ok = g.writeFile(contents, encoding, fileName);\n        if (ok) {\n            c.setFileTimeStamp(fileName);\n            if (! g.unitTesting) {\n                // g.es(f\"{timestamp}wrote: {sfn}\");\n                g.es(";
        $;
        {
            timestamp;
        }
        wrote: $;
        {
            sfn;
        }
        ");\n            }\n        }\n        else {\n            g.error('error writing', sfn);\n            g.es('! written:', sfn);\n            this.addToOrphanList(root);\n        }\n        this.checkPythonCode(contents, fileName, root);\n            // Check *after* writing the file.\n        return ok;\n    }\n    /**\n     * Compare two strings, ignoring blank lines.\n     */\n    public compareIgnoringBlankLines(s1, s2): void {\n        // assert isinstance(s1, str), g.callers();\n        // assert isinstance(s2, str), g.callers();\n        if (s1 == s2) {\n            return true;\n        }\n        const s1 = g.removeBlankLines(s1);\n        const s2 = g.removeBlankLines(s2);\n        return s1 == s2;\n    }\n    /**\n     * Compare two strings, ignoring line endings.\n     */\n    public compareIgnoringLineEndings(s1, s2): void {\n        // assert isinstance(s1, str), (repr(s1), g.callers());\n        // assert isinstance(s2, str), (repr(s2), g.callers());\n        if (s1 == s2) {\n            return true;\n        }\n        // Wrong: equivalent to ignoreBlankLines!\n            // s1 = s1.replace('\n','').replace('\r','')\n            // s2 = s2.replace('\n','').replace('\r','')\n        const s1 = s1.replace('\r', '');\n        const s2 = s2.replace('\r', '');\n        return s1 == s2;\n    }\n    // Called from putFile.\n\n    public warnAboutOrphandAndIgnoredNodes(): void {\n        // Always warn, even when language==\"cweb\"\n        this, root = this, this.root;\n        if (this.errors) {\n            return;  // No need to repeat this.\n        }\n        for (p in root.self_and_subtree(copy=false)) {\n            if (! p.v.isVisited()) {\n                this.writeError(\"Orphan node:  \" + p.h);\n                if (p.hasParent()) {\n                    g.blue(\"parent node:\", p.parent().h);\n                }\n            }\n        }\n        const p = root.copy();\n        const after = p.nodeAfterTree();\n        while (p && p != after) {\n            if (p.isAtAllNode()) {\n                p.moveToNodeAfterTree();\n            }\n            else {\n                // #1050: test orphan bit.\n                if (p.isOrphan()) {\n                    this.writeError(\"Orphan node: \" + p.h);\n                    if (p.hasParent()) {\n                        g.blue(\"parent node:\", p.parent().h);\n                    }\n                }\n                p.moveToThreadNext();\n            }\n        }\n    }\n    /**\n     * Issue an error while writing an @<file> node.\n     */\n    public writeError(message): void {\n        if (this.errors == 0) {\n            const fn = this.targetFileName || 'unnamed file';\n            // g.es_error(f\"errors writing: {fn}\");\n            g.es_error(";
        errors;
        writing: $;
        {
            fn;
        }
        ");\n        }\n        this.error(message);\n        this.addToOrphanList(this.root);\n    }\n    public writeException(fileName, root): void {\n        g.error(\"exception writing:\", fileName);\n        g.es_exception();\n        if (getattr(this, 'outputFile', null)) {\n            this.outputFile.flush();\n            this.outputFile.close();\n            const this.outputFile = null;\n        }\n        this.remove(fileName);\n        this.addToOrphanList(root);\n    }\n    public error(*args): void {\n        this.printError(*args);\n        this.errors += 1;\n    }\n\n    /**\n     * Print an error message that may contain non-ascii characters.\n     */\n    public printError(*args): void {\n        if (this.errors) {\n            g.error(*args);\n        }\n        else {\n            g.warning(*args);\n        }\n    }\n    public exception(message): void {\n        this.error(message);\n        g.es_exception();\n    }\n    // Error checking versions of corresponding functions in Python's os module.\n    public chmod(fileName, mode): void {\n        // Do _not_ call this.error here.\n        if (mode == null) {\n            return;\n        }\n        try {\n            os.chmod(fileName, mode);\n        }\n        catch (Exception) {\n            g.es(\"exception in os.chmod\", fileName);\n            g.es_exception();\n        }\n\n    }\n    public remove(fileName): void {\n        if (! fileName) {\n            g.trace('No file name', g.callers());\n            return false;\n        }\n        try {\n            os.remove(fileName);\n            return true;\n        }\n        catch (Exception) {\n            if (! g.unitTesting) {\n                // this.error(f\"exception removing: {fileName}\");\n                this.error(";
        exception;
        removing: $;
        {
            fileName;
        }
        ");\n                g.es_exception();\n            }\n            return false;\n        }\n    }\n    /**\n     * Return the access mode of named file, removing any setuid, setgid, and sticky bits.\n     */\n    public stat(fileName): void {\n        // Do _not_ call this.error here.\n        try {\n            const mode = (os.stat(fileName))[0] & (7 * 8 * 8 + 7 * 8 + 7);  // 0777\n        }\n        catch (Exception) {\n            const mode = null;\n        }\n        return mode;\n\n    }\n    public getPathUa(p: Position): void {\n        if (hasattr(p.v, 'tempAttributes')) {\n            const d = p.v.tempAttributes.get('read-path', {});\n            return d.get('path');\n        }\n        return '';\n    }\n\n    public setPathUa(p: Position, path): void {\n        if (! hasattr(p.v, 'tempAttributes')) {\n            const p.v.tempAttributes = {};\n        }\n        const d = p.v.tempAttributes.get('read-path', {});\n        const d['path'] = path;\n        const p.v.tempAttributes['read-path'] = d;\n    }\n    // Important: this is part of the *write* logic.\n    // It is called from this.os and this.putIndent.\n\n    public parseUnderindentTag(s: string): void {\n        const tag = this.underindentEscapeString;\n        const s2 = s[len(tag) :];\n        // To be valid, the escape must be followed by at least one digit.\n        const i = 0;\n        while (i < len(s2) && s2[i].isdigit()) {\n            i += 1;\n        }\n        if (i > 0) {\n            const n = int(s2[:i]);\n            // Bug fix: 2012/06/05: remove any period following the count.\n            // This is a new convention.\n            if (i < len(s2) && s2[i] == '.') {\n                i += 1;\n            }\n            return n, s2[i:];\n        }\n        return 0, s;\n    }\n    /**\n     * Raise a dialog asking the user whether to overwrite an existing file.\n     */\n    public promptForDangerousWrite(fileName, message=null): void {\n        this, c, root = this, this.c, this.root;\n        if (this.cancelFlag) {\n            // assert this.canCancelFlag;\n            return false;\n        }\n        if (this.yesToAll) {\n            // assert this.canCancelFlag;\n            return true;\n        }\n        if (root && root.h.startswith('@auto-rst')) {\n            // Fix bug 50: body text lost switching @file to @auto-rst\n            // Refuse to convert any @<file> node to @auto-rst.\n            // d = root.v.at_read if hasattr(root.v, 'at_read') else {};\n            const d = hasattr(root.v, 'at_read') ? root.v.at_read : {};\n            const aList = sorted(d.get(fileName, []));\n            for (h in aList) {\n                if (! h.startswith('@auto-rst')) {\n                    g.es('can ! convert @file to @auto-rst!', color='red');\n                    g.es('reverting to:', h);\n                    const root.h = h;\n                    c.redraw();\n                    return false;\n                }\n            }\n        }\n        if (message == null) {\n            const message = (\n                // f\"{g.splitLongFileName(fileName)}\n\";\n                ";
        $;
        {
            g.splitLongFileName(fileName);
        }
        n(__makeTemplateObject([";\n                // f\"{g.tr('already exists.')}\n\";\n                "], [";\n                // f\"{g.tr('already exists.')}\\n\";\n                "]));
        $;
        {
            g.tr('already exists.');
        }
        n(__makeTemplateObject([";\n                // f\"{g.tr('Overwrite this file?')}\");\n                "], [";\n                // f\"{g.tr('Overwrite this file?')}\");\n                "]));
        $;
        {
            g.tr('Overwrite this file?');
        }
        ");\n        }\n        const result = g.app.gui.runAskYesNoCancelDialog(c,\n            title='Overwrite existing file?',\n            yesToAllMessage=\"Yes To &All\",\n            message=message,\n            cancelMessage=\"&Cancel (No To All)\",\n        );\n        if (this.canCancelFlag) {\n            // We are in the writeAll logic so these flags can be set.\n            if (result == 'cancel') {\n                const this.cancelFlag = true;\n            }\n            else if (result == 'yes-to-all') {\n                const this.yesToAll = true;\n            }\n        }\n        return result in ('yes', 'yes-to-all');\n    }\n    /**\n     * Remember the files that have been read *and*\n     * the full headline (@<file> type) that caused the read.\n     */\n    public rememberReadPath(fn, p: Position): void {\n        const v = p.v;\n        // Fix bug #50: body text lost switching @file to @auto-rst\n        if (! hasattr(v, 'at_read')) {\n            const v.at_read = {};\n        }\n        const d = v.at_read;\n        const aSet = d.get(fn, set());\n        aSet.add(p.h);\n        const d[fn] = aSet;\n    }\n    /**\n     * Scan p and p's ancestors looking for directives,\n     * setting corresponding AtFile ivars.\n     */\n    public scanAllDirectives(p: Position): void {\n        const c = this.c;\n        const d = c.scanAllDirectives(p);\n\n        // Language & delims: Tricky.\n        const lang_dict = d.get('lang-dict') || {};\n        delims, language = null, null;\n        if (lang_dict) {\n            // There was an @delims or @language directive.\n            const language = lang_dict.get('language');\n            const delims = lang_dict.get('delims');\n        }\n        if (! language) {\n            // No language directive.  Look for @<file> nodes.\n            // Do *not* used.get('language')!\n            const language = g.getLanguageFromAncestorAtFileNode(p) || 'python';\n        }\n        const this.language = language;\n        if (! delims) {\n            const delims = g.set_delims_from_language(language);\n        }\n\n        // Previously, setting delims was sometimes skipped, depending on kwargs.\n        delim1, delim2, delim3 = delims;\n        // Use single-line comments if we have a choice.\n        // delim1,delim2,delim3 now correspond to line,start,end\n        if (delim1) {\n            const this.startSentinelComment = delim1;\n            const this.endSentinelComment = \"\";  // Must not be null.\n        }\n        else if (delim2 && delim3) {\n            const this.startSentinelComment = delim2;\n            const this.endSentinelComment = delim3;\n        }\n        else { // # Emergency!\n\n            // Issue an error only if this.language has been set.\n            // This suppresses a message from the markdown importer.\n            if (! g.unitTesting && this.language) {\n                g.trace(repr(this.language), g.callers());\n                g.es_print(\"unknown language: using Python comment delimiters\");\n                g.es_print(\"c.target_language:\", c.target_language);\n            }\n            const this.startSentinelComment = \"  // \"  # This should never happen!\n            const this.endSentinelComment = \"\";\n        }\n\n        // Easy cases\n        const this.encoding = d.get('encoding') || c.config.default_derived_file_encoding;\n        const lineending = d.get('lineending');\n        const this.explicitLineEnding = bool(lineending);\n        const this.output_newline = lineending || g.getOutputNewline(c=c);\n        const this.page_width = d.get('pagewidth') || c.page_width;\n        const this.tab_width = d.get('tabwidth') || c.tab_width;\n        return {\n            \"encoding\": this.encoding,\n            \"language\": this.language,\n            \"lineending\": this.output_newline,\n            \"pagewidth\": this.page_width,\n            \"path\": d.get('path'),\n            \"tabwidth\": this.tab_width,\n        }\n    }\n    /**\n     * Return True if Leo should warn the user that p is an @<file> node that\n     * was not read during startup. Writing that file might cause data loss.\n     *\n     * See #50: https://github.com/leo-editor/leo-editor/issues/50\n     */\n    public shouldPromptForDangerousWrite(fn, p: Position): void {\n        const trace = 'save' in g.app.debug;\n        const sfn = g.shortFileName(fn);\n        const c = this.c;\n        const efc = g.app.externalFilesController;\n        if (p.isAtNoSentFileNode()) {\n            // #1450.\n            // No danger of overwriting a file.\n            // It was never read.\n            return false;\n        }\n        if (! g.os_path_exists(fn)) {\n            // No danger of overwriting fn.\n            if (trace) {\n                g.trace('Return false: does ! exist:', sfn);\n            }\n            return false;\n        }\n        // #1347: Prompt if the external file is newer.\n        if (efc) {\n            // Like c.checkFileTimeStamp.\n            if (c.sqlite_connection && c.mFileName == fn) {\n                // sqlite database file is never actually overwriten by Leo,\n                // so do *not* check its timestamp.\n                pass;\n            }\n            else if (efc.has_changed(fn)) {\n                if (trace) {\n                    g.trace('Return true: changed:', sfn);\n                }\n                return true;\n            }\n        }\n        if (hasattr(p.v, 'at_read')) {\n            // Fix bug #50: body text lost switching @file to @auto-rst\n            const d = p.v.at_read;\n            for (k in d) {\n                // Fix bug # #1469: make sure k still exists.\n                if (\n                    os.path.exists(k) && os.path.samefile(k, fn)\n                    && p.h in d.get(k, set())\n                ) {\n                    const d[fn] = d[k];\n                    if (trace) {\n                        g.trace('Return false: in p.v.at_read:', sfn);\n                    }\n                    return false;\n                }\n            }\n            const aSet = d.get(fn, set());\n            if (trace) {\n                // g.trace(f\"Return {p.h ! in aSet()}: p.h ! in aSet(): {sfn}\");\n                g.trace(";
        Return;
        $;
        {
            p.h;
            not in aSet();
        }
        p.h;
        not in aSet();
        $;
        {
            sfn;
        }
        ");\n            }\n            return p.h ! in aSet;\n        }\n        if (trace) {\n            g.trace('Return true: never read:', sfn);\n        }\n        return True;  // The file was never read.\n    }\n    public warnOnReadOnlyFile(fn): void {\n        // os.access() may not exist on all platforms.\n        try {\n            const read_only = ! os.access(fn, os.W_OK);\n        }\n        catch (AttributeError) {\n            const read_only = false;\n        }\n        if (read_only) {\n            g.error(\"read only:\", fn);\n        }\n    }\n}\nconst atFile = AtFile;  // compatibility\n/**\n * Read an exteral file, created from an @file tree.\n * This is Vitalije's code, edited by EKR.\n */\nclass FastAtRead {\n\n    public constructor(c: Commands, gnx2vnode, test=False, TestVNode=null) {\n        const this.c = c;\n        // assert gnx2vnode != null;\n        const this.gnx2vnode = gnx2vnode;\n            // The global fc.gnxDict. Keys are gnx's, values are vnodes.\n        const this.path = null;\n        const this.root = null;\n        // this.VNode = TestVNode if test else leoNodes.VNode;\n        const this.VNode = test ? TestVNode : leoNodes.VNode;\n        const this.test = test;\n    }\n\n    /**\n     * Create regex patterns for the given comment delims.\n     */\n    public get_patterns(delims): void {\n        // This must be a function, because of @comments & @delims.\n        delim_start, delim_end = delims;\n        const delims = re.escape(delim_start), re.escape(delim_end || '');\n        delim1, delim2 = delims;\n        const ref = g.angleBrackets(r'(.*)');\n        const patterns = (\n            // The list of patterns, in alphabetical order.\n            // These patterns must be mutually exclusive.\n            fr'^s*{delim1}@afterref{delim2}$',;  // @afterref\n            fr'^(s*){delim1}@(+|-)all\b(.*){delim2}$',;  // @all\n            fr'^s*{delim1}@@c(ode)?{delim2}$',;  // @c and @code\n            fr'^s*{delim1}@comment(.*){delim2}',;  // @comment\n            fr'^s*{delim1}@delims(.*){delim2}',;  // @delims\n            fr'^s*{delim1}@+(at|doc)?(s.*?)?{delim2}\n',;  // @doc or @\n            fr'^s*{delim1}@end_raws*{delim2}',;  // @end_raw\n            fr'^s*{delim1}@@first{delim2}$',;  // @first\n            fr'^s*{delim1}@@last{delim2}$',;  // @last\n            fr'^(s*){delim1}@+node:([^:]+): *(d+)?(*?) (.*){delim2}$',;  // @node\n            fr'^(s*){delim1}@(+|-)others\b(.*){delim2}$',;  // @others\n            fr'^s*{delim1}@raw(.*){delim2}',;  // @raw\n            fr'^(s*){delim1}@(+|-){ref}s*{delim2}$';  // section ref\n        );\n        // Return the compiled patterns, in alphabetical order.\n        return (re.compile(pattern) for pattern in patterns);\n    }\n    /**\n     * Set all body text.\n     */\n    public post_pass(gnx2body, gnx2vnode, root_v): void {\n        // Set the body text.\n        if (this.test) {\n            // Check the keys.\n            const bkeys = sorted(gnx2body.keys());\n            const vkeys = sorted(gnx2vnode.keys());\n            if (bkeys != vkeys) {\n                g.trace('KEYS MISMATCH');\n                g.printObj(bkeys);\n                g.printObj(vkeys);\n                if (this.test) {\n                    sys.exit(1);\n                }\n            }\n            // Set the body text.\n            for (key in vkeys) {\n                const v = gnx2vnode.get(key);\n                const body = gnx2body.get(key);\n                const v._bodyString = ''.join(body);\n            }\n        }\n        else {\n            // assert root_v.gnx in gnx2vnode, root_v;\n            // assert root_v.gnx in gnx2body, root_v;\n            for (key in gnx2body) {\n                const body = gnx2body.get(key);\n                const v = gnx2vnode.get(key);\n                // assert v, (key, v);\n                const v._bodyString = g.toUnicode(''.join(body));\n            }\n        }\n    }\n    const header_pattern = re.compile(\n        /**\n         * ^(.+)@+leo\n         * (-ver=(d+))?\n         * (-thin)?\n         * (-encoding=(.*)(.))?\n         * (.*)$,\n         */\n        re.VERBOSE,\n    );\n\n    /**\n     * Scan for the header line, which follows any @first lines.\n     * Return (delims, first_lines, i+1) or null\n     */\n    public scan_header(lines): void {\n        const first_lines: List[str] = [];\n        const i = 0;  // To keep some versions of pylint happy.\n        for (i, line in enumerate(lines)) {\n            const m = this.header_pattern.match(line);\n            if (m) {\n                const delims = m.group(1), m.group(8) || '';\n                return delims, first_lines, i + 1;\n            }\n            first_lines.append(line);\n        }\n        return null;\n    }\n    /**\n     * Scan all lines of the file, creating vnodes.\n     */\n    public scan_lines(delims, first_lines, lines, path, start): void {\n\n        // Simple vars...\n        const afterref = False;  // A special verbatim line follows @afterref.\n        const clone_v = null;  // The root of the clone tree.\n        delim_start, delim_end = delims;  // The start/end delims.\n        const doc_skip = (delim_start + '\n', delim_end + '\n');  // To handle doc parts.\n        const first_i = 0;  // Index into first array.\n        const in_doc = False;  // True: in @doc parts.\n        const in_raw = False;  // True: @raw seen.\n        const is_cweb = delim_start == '@q@' and delim_end == '@>';  // True: cweb hack in effect.\n        const indent = 0;  // The current indentation.\n        const level_stack = [];  // Entries are (vnode, in_clone_tree)\n        const n_last_lines = 0;  // The number of @@last directives seen.\n        // #1065 so reads will not create spurious child nodes.\n        const root_seen = False;  // False: The next +@node sentinel denotes the root, regardless of gnx.\n        const sentinel = delim_start + '@'  // Faster than a regex!\n        // The stack is updated when at+others, at+<section>, or at+all is seen.\n        const stack = [];  // Entries are (gnx, indent, body)\n        const verbline = delim_start + '@verbatim' + delim_end + '\n';  // The spelling of at-verbatim sentinel\n        const verbatim = False;  // True: the next line must be added without change.\n\n        // Init the data for the root node.\n\n\n\n        // Init the parent vnode for testing.\n\n        if (this.test) {\n            // Start with the gnx for the @file node.\n            const root_gnx = gnx = 'root-gnx';  // The node that we are reading.\n            const gnx_head = '<hidden top vnode>';  // The headline of the root node.\n            const context = null;\n            const parent_v = this.VNode(context=context, gnx=gnx);\n            const parent_v._headString = gnx_head;  // Corresponds to the @files node itself.\n        }\n        else {\n            // Production.\n            const root_gnx = gnx = this.root.gnx;\n            const context = this.c;\n            const parent_v = this.root.v;\n        }\n        const root_v = parent_v;  // Does not change.\n        level_stack.append((root_v, false),);\n\n        // Init the gnx dict last.\n\n        const gnx2vnode = this.gnx2vnode;  // Keys are gnx's, values are vnodes.\n        const gnx2body = {};  // Keys are gnxs, values are list of body lines.\n        const gnx2vnode[gnx] = parent_v;  // Add gnx to the keys\n        // Add gnx to the keys.\n        // Body is the list of lines presently being accumulated.\n        const gnx2body[gnx] = body = first_lines;\n\n        // get the patterns.\n        const data = this.get_patterns(delims);\n        // pylint: disable=line-too-long\n        after_pat, all_pat, code_pat, comment_pat, delims_pat, doc_pat, end_raw_pat, first_pat, last_pat, node_start_pat, others_pat, raw_pat, ref_pat = data;\n        /**\n         * Dump the level stack and v.\n         */\n        public function dump_v(): void {\n            print('----- LEVEL', level, v.h);\n            print('       PARENT', parent_v.h);\n            print('[');\n            for (i, data in enumerate(level_stack)) {\n                v2, in_tree = data;\n                // print(f\"{i+1:2} {in_tree:5} {v2.h}\");\n                print(";
        $;
        {
            i + 1;
            2;
        }
        $;
        {
            in_tree: 5;
        }
        $;
        {
            v2.h;
        }
        ");\n            }\n            print(']');\n            print('PARENT.CHILDREN...');\n            g.printObj([v3.h for v3 in parent_v.children]);\n            print('PARENTS...');\n            g.printObj([v4.h for v4 in v.parents]);\n\n        }\n\n        const i = 0;  // To keep pylint happy.\n        for (i, line in enumerate(lines[start) { // ]):\n            // Order matters.\n            if (verbatim) {\n                // We are in raw mode, or other special situation.\n                // Previous line was verbatim sentinel. Append this line as it is.\n                if (afterref) {\n                    const afterref = false;\n                    if (body) { // # a List of lines.\n                        const body[-1] = body[-1].rstrip() + line;\n                    }\n                    else {\n                        const body = [line];\n                    }\n                    const verbatim = false;\n                }\n                else if (in_raw) {\n                    const m = end_raw_pat.match(line);\n                    if (m) {\n                        const in_raw = false;\n                        const verbatim = false;\n                    }\n                    else {\n                        // Continue verbatim/raw mode.\n                        body.append(line);\n                    }\n                }\n                else {\n                    body.append(line);\n                    const verbatim = false;\n                }\n                continue;\n            }\n            if (line == verbline) { // # <delim>@verbatim.\n                const verbatim = true;\n                continue;\n            }\n\n            // Strip the line only once.\n            const strip_line = line.strip();\n\n            // Undo the cweb hack.\n            if (is_cweb && line.startswith(sentinel)) {\n                const line = line[: len(sentinel)] + line[len(sentinel) :].replace('@@', '@');\n            }\n            // Adjust indentation.\n            if (indent && line[) { // indent].isspace() && len(line) > indent:\n                const line = line[indent:];\n            }\n            // This is valid because all following sections are either:\n            // 1. guarded by 'if in_doc' or\n            // 2. guarded by a pattern that matches the start of the sentinel.\n\n            if (! in_doc && ! strip_line.startswith(sentinel)) {\n                // lstrip() is faster than using a regex!\n                body.append(line);\n                continue;\n            }\n            const m = others_pat.match(line);\n            if (m) {\n                const in_doc = false;\n                if (m.group(2) == '+') { // # opening sentinel\n                    // body.append(f\"{m.group(1)}@others{m.group(3) || ''}\n\");\n                    body.append(";
        $;
        {
            m.group(1);
        }
        {
            m.group(3) || '';
        }
        n(__makeTemplateObject([");\n                    stack.append((gnx, indent, body));\n                    indent += m.end(1);  // adjust current identation\n                }\n                else { // # closing sentinel.\n                    // m.group(2) is '-' because the pattern matched.\n                    gnx, indent, body = stack.pop();\n                }\n                continue;\n            }\n # clears in_doc\n            const m = ref_pat.match(line);\n            if (m) {\n                const in_doc = false;\n                if (m.group(2) == '+') {\n                    // open sentinel.\n                    body.append(m.group(1) + g.angleBrackets(m.group(3)) + '\n');\n                    stack.append((gnx, indent, body));\n                    indent += m.end(1);\n                    continue;\n                }\n                if (stack) {\n                    // #1232: Only if the stack exists.\n                    // close sentinel.\n                    // m.group(2) is '-' because the pattern matched.\n                    gnx, indent, body = stack.pop();\n                    continue;\n                }\n            }\n # clears in_doc.\n            // Order doesn't matter, but match more common sentinels first.\n            const m = node_start_pat.match(line);\n            if (m) {\n                in_doc, in_raw = false, false;\n                gnx, head = m.group(2), m.group(5);\n                // level = int(m.group(3)) if m.group(3) else 1 + len(m.group(4));\n                const level = m.group(3) ? int(m.group(3)) : 1 + len(m.group(4));\n                    // m.group(3) is the level number, m.group(4) is the number of stars.\n                const v = gnx2vnode.get(gnx);\n\n                // Case 1: The root @file node. Don't change the headline.\n                if (! root_seen) {\n                    // Fix #1064: The node represents the root, regardless of the gnx!\n                    const root_seen = true;\n                    const clone_v = null;\n                    const gnx2body[gnx] = body = [];\n                    if (! v) {\n                        // Fix #1064.\n                        const v = root_v;\n                        // This message is annoying when using git-diff.\n                            // if gnx != root_gnx:\n                                // g.es_print(\"using gnx from external file: %s\" % (v.h), color='blue')\n                        const gnx2vnode[gnx] = v;\n                        const v.fileIndex = gnx;\n                    }\n                    const v.children = [];\n                    continue;\n                }\n\n                // Case 2: We are scanning the descendants of a clone.\n                parent_v, clone_v = level_stack[level - 2];\n                if (v && clone_v) {\n                    // The last version of the body and headline wins..\n                    const gnx2body[gnx] = body = [];\n                    const v._headString = head;\n                    // Update the level_stack.\n                    const level_stack = level_stack[: level - 1];\n                    level_stack.append((v, clone_v),);\n                    // Always clear the children!\n                    const v.children = [];\n                    parent_v.children.append(v);\n                    continue;\n                }\n\n                // Case 3: we are not already scanning the descendants of a clone.\n                if (v) {\n                    // The *start* of a clone tree. Reset the children.\n                    const clone_v = v;\n                    const v.children = [];\n                }\n                else {\n                    // Make a new vnode.\n                    const v = this.VNode(context=context, gnx=gnx);\n                }\n\n                // The last version of the body and headline wins.\n                const gnx2vnode[gnx] = v;\n                const gnx2body[gnx] = body = [];\n                const v._headString = head;\n\n                // Update the stack.\n                const level_stack = level_stack[: level - 1];\n                level_stack.append((v, clone_v),);\n\n                // Update the links.\n                // assert v != root_v;\n                parent_v.children.append(v);\n                v.parents.append(parent_v);\n                // dump_v()\n                continue;\n            }\n            if (in_doc) {\n                // When delim_end exists the doc block:\n                // - begins with the opening delim, alone on its own line\n                // - ends with the closing delim, alone on its own line.\n                // Both of these lines should be skipped.\n\n                // #1496: Retire the @doc convention.\n                // An empty line is no longer a sentinel.\n                if (delim_end && line in doc_skip) {\n                    // doc_skip is (delim_start + '\n', delim_end + '\n')\n                    continue;\n                }\n\n                // Check for @c or @code.\n                const m = code_pat.match(line);\n                if (m) {\n                    const in_doc = false;\n                    body.append('@code\n' if m.group(1) else '@c\n');\n                    continue;\n                }\n            }\n            else {\n                const m = doc_pat.match(line);\n                if (m) {\n                    // @+at or @+doc?\n                    // doc = '@doc' if m.group(1) == 'doc' else '@';\n                    const doc = m.group(1) == 'doc' ? '@doc' : '@';\n                    const doc2 = m.group(2) or '';  // Trailing text.\n                    if (doc2) {\n                        // body.append(f\"{doc}{doc2}\n\");\n                        body.append("], [");\n                    stack.append((gnx, indent, body));\n                    indent += m.end(1);  // adjust current identation\n                }\n                else { // # closing sentinel.\n                    // m.group(2) is '-' because the pattern matched.\n                    gnx, indent, body = stack.pop();\n                }\n                continue;\n            }\n # clears in_doc\n            const m = ref_pat.match(line);\n            if (m) {\n                const in_doc = false;\n                if (m.group(2) == '+') {\n                    // open sentinel.\n                    body.append(m.group(1) + g.angleBrackets(m.group(3)) + '\\n');\n                    stack.append((gnx, indent, body));\n                    indent += m.end(1);\n                    continue;\n                }\n                if (stack) {\n                    // #1232: Only if the stack exists.\n                    // close sentinel.\n                    // m.group(2) is '-' because the pattern matched.\n                    gnx, indent, body = stack.pop();\n                    continue;\n                }\n            }\n # clears in_doc.\n            // Order doesn't matter, but match more common sentinels first.\n            const m = node_start_pat.match(line);\n            if (m) {\n                in_doc, in_raw = false, false;\n                gnx, head = m.group(2), m.group(5);\n                // level = int(m.group(3)) if m.group(3) else 1 + len(m.group(4));\n                const level = m.group(3) ? int(m.group(3)) : 1 + len(m.group(4));\n                    // m.group(3) is the level number, m.group(4) is the number of stars.\n                const v = gnx2vnode.get(gnx);\n\n                // Case 1: The root @file node. Don't change the headline.\n                if (! root_seen) {\n                    // Fix #1064: The node represents the root, regardless of the gnx!\n                    const root_seen = true;\n                    const clone_v = null;\n                    const gnx2body[gnx] = body = [];\n                    if (! v) {\n                        // Fix #1064.\n                        const v = root_v;\n                        // This message is annoying when using git-diff.\n                            // if gnx != root_gnx:\n                                // g.es_print(\"using gnx from external file: %s\" % (v.h), color='blue')\n                        const gnx2vnode[gnx] = v;\n                        const v.fileIndex = gnx;\n                    }\n                    const v.children = [];\n                    continue;\n                }\n\n                // Case 2: We are scanning the descendants of a clone.\n                parent_v, clone_v = level_stack[level - 2];\n                if (v && clone_v) {\n                    // The last version of the body and headline wins..\n                    const gnx2body[gnx] = body = [];\n                    const v._headString = head;\n                    // Update the level_stack.\n                    const level_stack = level_stack[: level - 1];\n                    level_stack.append((v, clone_v),);\n                    // Always clear the children!\n                    const v.children = [];\n                    parent_v.children.append(v);\n                    continue;\n                }\n\n                // Case 3: we are not already scanning the descendants of a clone.\n                if (v) {\n                    // The *start* of a clone tree. Reset the children.\n                    const clone_v = v;\n                    const v.children = [];\n                }\n                else {\n                    // Make a new vnode.\n                    const v = this.VNode(context=context, gnx=gnx);\n                }\n\n                // The last version of the body and headline wins.\n                const gnx2vnode[gnx] = v;\n                const gnx2body[gnx] = body = [];\n                const v._headString = head;\n\n                // Update the stack.\n                const level_stack = level_stack[: level - 1];\n                level_stack.append((v, clone_v),);\n\n                // Update the links.\n                // assert v != root_v;\n                parent_v.children.append(v);\n                v.parents.append(parent_v);\n                // dump_v()\n                continue;\n            }\n            if (in_doc) {\n                // When delim_end exists the doc block:\n                // - begins with the opening delim, alone on its own line\n                // - ends with the closing delim, alone on its own line.\n                // Both of these lines should be skipped.\n\n                // #1496: Retire the @doc convention.\n                // An empty line is no longer a sentinel.\n                if (delim_end && line in doc_skip) {\n                    // doc_skip is (delim_start + '\\n', delim_end + '\\n')\n                    continue;\n                }\n\n                // Check for @c or @code.\n                const m = code_pat.match(line);\n                if (m) {\n                    const in_doc = false;\n                    body.append('@code\\n' if m.group(1) else '@c\\n');\n                    continue;\n                }\n            }\n            else {\n                const m = doc_pat.match(line);\n                if (m) {\n                    // @+at or @+doc?\n                    // doc = '@doc' if m.group(1) == 'doc' else '@';\n                    const doc = m.group(1) == 'doc' ? '@doc' : '@';\n                    const doc2 = m.group(2) or '';  // Trailing text.\n                    if (doc2) {\n                        // body.append(f\"{doc}{doc2}\\n\");\n                        body.append("]));
        $;
        {
            doc;
        }
        $;
        {
            doc2;
        }
        n(__makeTemplateObject([");\n                    }\n                    else {\n                        body.append(doc + '\n');\n                    }\n                    // Enter @doc mode.\n                    const in_doc = true;\n                    continue;\n                }\n            }\n            const m = all_pat.match(line);\n            if (m) {\n                // @all tells Leo's *write* code not to check for undefined sections.\n                // Here, in the read code, we merely need to add it to the body.\n                // Pushing and popping the stack may not be necessary, but it can't hurt.\n                if (m.group(2) == '+') { // # opening sentinel\n                    // body.append(f\"{m.group(1)}@all{m.group(3) || ''}\n\");\n                    body.append("], [");\n                    }\n                    else {\n                        body.append(doc + '\\n');\n                    }\n                    // Enter @doc mode.\n                    const in_doc = true;\n                    continue;\n                }\n            }\n            const m = all_pat.match(line);\n            if (m) {\n                // @all tells Leo's *write* code not to check for undefined sections.\n                // Here, in the read code, we merely need to add it to the body.\n                // Pushing and popping the stack may not be necessary, but it can't hurt.\n                if (m.group(2) == '+') { // # opening sentinel\n                    // body.append(f\"{m.group(1)}@all{m.group(3) || ''}\\n\");\n                    body.append("]));
        $;
        {
            m.group(1);
        }
        {
            m.group(3) || '';
        }
        n(__makeTemplateObject([");\n                    stack.append((gnx, indent, body));\n                }\n                else { // # closing sentinel.\n                    // m.group(2) is '-' because the pattern matched.\n                    gnx, indent, body = stack.pop();\n                    const gnx2body[gnx] = body;\n                }\n                continue;\n            }\n            const m = after_pat.match(line);\n            if (m) {\n                const afterref = true;\n                const verbatim = true;\n                    // Avoid an extra test in the main loop.\n                continue;\n            }\n            const m = first_pat.match(line);\n            if (m) {\n                if (0 <= first_i < len(first_lines)) {\n                    body.append('@first ' + first_lines[first_i]);\n                    first_i += 1;\n                }\n                else {\n                    // g.trace(f\"\ntoo many @first lines: {path}\");\n                    g.trace("], [");\n                    stack.append((gnx, indent, body));\n                }\n                else { // # closing sentinel.\n                    // m.group(2) is '-' because the pattern matched.\n                    gnx, indent, body = stack.pop();\n                    const gnx2body[gnx] = body;\n                }\n                continue;\n            }\n            const m = after_pat.match(line);\n            if (m) {\n                const afterref = true;\n                const verbatim = true;\n                    // Avoid an extra test in the main loop.\n                continue;\n            }\n            const m = first_pat.match(line);\n            if (m) {\n                if (0 <= first_i < len(first_lines)) {\n                    body.append('@first ' + first_lines[first_i]);\n                    first_i += 1;\n                }\n                else {\n                    // g.trace(f\"\\ntoo many @first lines: {path}\");\n                    g.trace("]));
        ntoo;
        many;
        lines: $;
        {
            path;
        }
        ");\n                    print('@first == valid only at the start of @<file> nodes\n');\n                    g.printObj(first_lines, tag='first_lines');\n                    g.printObj(lines[start : i + 2], tag='lines[start:i+2]');\n                }\n                continue;\n            }\n            const m = last_pat.match(line);\n            if (m) {\n                n_last_lines += 1;\n                continue;\n            }\n            // http://leoeditor.com/directives.html#part-4-dangerous-directives\n            const m = comment_pat.match(line);\n            if (m) {\n                // <1, 2 or 3 comment delims>\n                const delims = m.group(1).strip();\n                // Whatever happens, retain the @delims line.\n                // body.append(f\"@comment {delims}\n\");\n                body.append(";
        $;
        {
            delims;
        }
        n(__makeTemplateObject([");\n                delim1, delim2, delim3 = g.set_delims_from_string(delims);\n                    // delim1 is always the single-line delimiter.\n                if (delim1) {\n                    delim_start, delim_end = delim1, '';\n                }\n                else {\n                    delim_start, delim_end = delim2, delim3;\n                }\n\n                // Within these delimiters:\n                // - double underscores represent a newline.\n                // - underscores represent a significant space,\n                const delim_start = delim_start.replace('__', '\n').replace('_', ' ');\n                const delim_end = delim_end.replace('__', '\n').replace('_', ' ');\n                // Recalculate all delim-related values\n                const doc_skip = (delim_start + '\n', delim_end + '\n');\n                const is_cweb = delim_start == '@q@' && delim_end == '@>';\n                const sentinel = delim_start + '@';\n\n                // Recalculate the patterns.\n                const delims = delim_start, delim_end\n                (\n                    after_pat, all_pat, code_pat, comment_pat, delims_pat,\n                    doc_pat, end_raw_pat, first_pat, last_pat,\n                    node_start_pat, others_pat, raw_pat, ref_pat;\n                const ) = this.get_patterns(delims);\n                continue;\n            }\n            const m = delims_pat.match(line);\n            if (m) {\n                // Get 1 or 2 comment delims\n                // Whatever happens, retain the original @delims line.\n                const delims = m.group(1).strip();\n                // body.append(f\"@delims {delims}\n\");\n                body.append("], [");\n                delim1, delim2, delim3 = g.set_delims_from_string(delims);\n                    // delim1 is always the single-line delimiter.\n                if (delim1) {\n                    delim_start, delim_end = delim1, '';\n                }\n                else {\n                    delim_start, delim_end = delim2, delim3;\n                }\n\n                // Within these delimiters:\n                // - double underscores represent a newline.\n                // - underscores represent a significant space,\n                const delim_start = delim_start.replace('__', '\\n').replace('_', ' ');\n                const delim_end = delim_end.replace('__', '\\n').replace('_', ' ');\n                // Recalculate all delim-related values\n                const doc_skip = (delim_start + '\\n', delim_end + '\\n');\n                const is_cweb = delim_start == '@q@' && delim_end == '@>';\n                const sentinel = delim_start + '@';\n\n                // Recalculate the patterns.\n                const delims = delim_start, delim_end\n                (\n                    after_pat, all_pat, code_pat, comment_pat, delims_pat,\n                    doc_pat, end_raw_pat, first_pat, last_pat,\n                    node_start_pat, others_pat, raw_pat, ref_pat;\n                const ) = this.get_patterns(delims);\n                continue;\n            }\n            const m = delims_pat.match(line);\n            if (m) {\n                // Get 1 or 2 comment delims\n                // Whatever happens, retain the original @delims line.\n                const delims = m.group(1).strip();\n                // body.append(f\"@delims {delims}\\n\");\n                body.append("]));
        $;
        {
            delims;
        }
        n(__makeTemplateObject([");\n\n                // Parse the delims.\n                const delims_pat = re.compile(r'^([^ ]+)s*([^ ]+)?');\n                const m2 = delims_pat.match(delims);\n                if (! m2) {\n                    // g.trace(f\"Ignoring invalid @comment: {line!r}\");\n                    g.trace("], [");\n\n                // Parse the delims.\n                const delims_pat = re.compile(r'^([^ ]+)\\s*([^ ]+)?');\n                const m2 = delims_pat.match(delims);\n                if (! m2) {\n                    // g.trace(f\"Ignoring invalid @comment: {line!r}\");\n                    g.trace("]));
        Ignoring;
        invalid;
        $;
        {
            line;
        }
        ");\n                    continue;\n                }\n                const delim_start = m2.group(1);\n                const delim_end = m2.group(2) || '';\n\n                // Within these delimiters:\n                // - double underscores represent a newline.\n                // - underscores represent a significant space,\n                const delim_start = delim_start.replace('__', '\n').replace('_', ' ');\n                const delim_end = delim_end.replace('__', '\n').replace('_', ' ');\n                // Recalculate all delim-related values\n                const doc_skip = (delim_start + '\n', delim_end + '\n');\n                const is_cweb = delim_start == '@q@' && delim_end == '@>';\n                const sentinel = delim_start + '@';\n\n                // Recalculate the patterns\n                const delims = delim_start, delim_end\n                (\n                    after_pat, all_pat, code_pat, comment_pat, delims_pat,\n                    doc_pat, end_raw_pat, first_pat, last_pat,\n                    node_start_pat, others_pat, raw_pat, ref_pat;\n                const ) = this.get_patterns(delims);\n                continue;\n            }\n            // http://leoeditor.com/directives.html#part-4-dangerous-directives\n            const m = raw_pat.match(line);\n            if (m) {\n                const in_raw = true;\n                const verbatim = true;\n                    // Avoid an extra test in the main loop.\n                continue;\n            }\n            if (line.startswith(delim_start + '@-leo')) {\n                i += 1;\n                break;\n            }\n            // These must be last, in this order.\n            // @first, @last, @delims and @comment generate @@ sentinels,\n            // So this must follow all of those.\n            if (line.startswith(delim_start + '@@')) {\n                const ii = len(delim_start) + 1;  // on second '@'\n                // jj = line.rfind(delim_end) if delim_end else -1;\n                const jj = delim_end ? line.rfind(delim_end) : -1;\n                body.append(line[ii:jj] + '\n');\n                continue;\n            }\n            if (in_doc) {\n                if (delim_end) {\n                    // doc lines are unchanged.\n                    body.append(line);\n                    continue;\n                }\n                // Doc lines start with start_delim + one blank.\n                // #1496: Retire the @doc convention.\n                // #2194: Strip lws.\n                const tail = line.lstrip()[len(delim_start) + 1 :];\n                if (tail.strip()) {\n                    body.append(tail);\n                }\n                else {\n                    body.append('\n');\n                }\n                continue;\n            }\n            // Handle an apparent sentinel line.\n            // This *can* happen after the git-diff or refresh-from-disk commands.\n\n            // This assert verifies the short-circuit test.\n            // assert strip_line.startswith(sentinel), (repr(sentinel), repr(line));\n\n            // #2213: *Do* insert the line, with a warning.\n            g.trace(\n                // f\"{g.shortFileName(this.path)}: \";\n                ";
        $;
        {
            g.shortFileName(this.path);
        }
        ";\n                // f\"warning: inserting unexpected line: {line.rstrip()!r}\";\n                ";
        warning: inserting;
        unexpected;
        line: $;
        {
            line.rstrip();
        }
        ";\n            );\n            body.append(line);\n        }\n        else {\n            // No @-leo sentinel\n            return null, [];\n        }\n        // Handle @last lines.\n        const last_lines = lines[start + i :];\n        if (last_lines) {\n            const last_lines = ['@last ' + z for z in last_lines];\n            const gnx2body[root_gnx] = gnx2body[root_gnx] + last_lines;\n        }\n        this.post_pass(gnx2body, gnx2vnode, root_v);\n        return root_v, last_lines;\n    }\n    /**\n     * Parse the file's contents, creating a tree of vnodes\n     * anchored in root.v.\n     */\n    public read_into_root(contents, path, root): void {\n        const trace = false;\n        const t1 = time.process_time();\n        const this.path = path;\n        const this.root = root;\n        const sfn = g.shortFileName(path);\n        const contents = contents.replace('\r', '');\n        const lines = g.splitLines(contents);\n        const data = this.scan_header(lines);\n        if (! data) {\n            // g.trace(f\"Invalid external file: {sfn}\");\n            g.trace(";
        Invalid;
        external;
        file: $;
        {
            sfn;
        }
        ");\n            return false;\n        }\n        // Clear all children.\n        // Previously, this had been done in readOpenFile.\n        root.v._deleteAllChildren();\n        delims, first_lines, start_i = data;\n        this.scan_lines(delims, first_lines, lines, path, start_i);\n        if (trace) {\n            const t2 = time.process_time();\n            // g.trace(f\"{t2 - t1:5.2f} sec. {path}\");\n            g.trace(";
        $;
        {
            t2 - t1;
        }
        sec.$;
        {
            path;
        }
        ");\n        }\n        return true;\n    }\n}\n\n";
    };
    return AtFile;
}());
