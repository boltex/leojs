//@+leo-ver=5-thin
//@+node:felix.20211211234842.1: * @file src/core/leoAtFile.ts
/**
 * Classes to read and write @file nodes.
 */
//@+<< imports >>
//@+node:felix.20211225220235.1: ** << imports >>
import * as vscode from 'vscode';
import * as utils from '../utils';
import * as g from './leoGlobals';
import { new_cmd_decorator } from './decorators';
import { Position, VNode } from './leoNodes';
import { FileCommands } from './leoFileCommands';
import { Commands } from './leoCommands';
import dayjs = require('dayjs');
import { BaseWriter } from '../writers/basewriter';
//@-<< imports >>
//@+others
//@+node:felix.20211225220217.1: ** atFile.cmd
/**
 * Command decorator for the AtFileCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'atFileCommands']);
}
//@+node:felix.20211225222130.1: ** class AtFile
/**
 * A class implementing the atFile subcommander.
 */
export class AtFile {
    //@+<< define class constants >>
    //@+node:felix.20211225231453.1: *3* << define class constants >>

    // directives...
    static readonly noDirective = 1; // not an at-directive.
    static readonly allDirective = 2; // at-all (4.2)
    static readonly docDirective = 3; // @doc.
    static readonly atDirective = 4; // @<space> or @<newline>
    static readonly codeDirective = 5; // @code
    static readonly cDirective = 6; // @c<space> or @c<newline>
    static readonly othersDirective = 7; // at-others
    static readonly miscDirective = 8; // All other directives
    static readonly startVerbatim = 9; // @verbatim  Not a real directive. Used to issue warnings.
    //@-<< define class constants >>

    // **Warning**: all these ivars must **also** be inited in initCommonIvars.
    public c: Commands;
    public encoding: BufferEncoding | undefined = 'utf-8'; // 2014/08/13
    public fileCommands: FileCommands;
    public errors = 0; // Make sure at.error() works even when not inited.
    // #2276: allow different section delims.
    public section_delim1: string = '<<';
    public section_delim2: string = '>>';
    // **Only** at.writeAll manages these flags.
    public unchangedFiles: number = 0;
    // promptForDangerousWrite sets cancelFlag and yesToAll only if canCancelFlag is True.
    public canCancelFlag: boolean = false;
    public cancelFlag: boolean = false;
    public yesToAll: boolean = false;
    // User options: set in reloadSettings.
    public checkPythonCodeOnWrite: boolean = false;
    public runFlake8OnWrite: boolean = false;
    public runPyFlakesOnWrite: boolean = false;
    //
    public underindentEscapeString: string = '\\-';
    public read_i: number = 0;
    public read_lines: string[] = [];
    public _file_bytes: Uint8Array | undefined;
    public readVersion: string | undefined;
    public readVersion5: boolean | undefined;
    public startSentinelComment: string | undefined;
    public endSentinelComment: string | undefined;
    //
    public at_auto_encoding: BufferEncoding | undefined;
    public inCode: boolean | undefined;
    public indent: number = 0;
    public language: string | undefined;
    public output_newline: string | undefined;
    public page_width: number | undefined;
    public root: Position | undefined;
    public tab_width: number | undefined;
    public writing_to_shadow_directory: boolean | undefined;
    //
    public bom_encoding: BufferEncoding | undefined;
    public cloneSibCount: number | undefined; // n > 1: Make sure n cloned sibs exists at next @+node sentinel
    public correctedLines: number | undefined; // For perfect import.
    public docOut: string[] = []; // The doc part being accumulated.
    public done: boolean | undefined;
    public fromString: string | undefined;
    public importRootSeen: boolean | undefined;
    public lastLines: string[] = []; // The lines after @-leo
    public leadingWs: string | undefined;
    public lineNumber: number | undefined; // New in Leo 4.4.8.
    public rootSeen: boolean | undefined;
    public targetFileName: string | undefined;
    public v: VNode | undefined;
    public updateWarningGiven: boolean | undefined;
    //
    public force_newlines_in_at_nosent_bodies: boolean | undefined;
    public outputList: string[] = [];
    public sentinels: boolean = false;
    public outputFile = ''; // io.StringIO();
    public public_s = '';
    public private_s = '';
    public explicitLineEnding = false;
    public at_shadow_test_hack: boolean | undefined;

    //@+others
    //@+node:felix.20211225231532.1: *3* at.Birth & init
    //@+node:felix.20211225231716.1: *4* at.ctor & helpers
    // Note: g.getScript also call the at.__init__ and at.finishCreate().

    /**
     * ctor for atFile class.
     */
    constructor(c: Commands) {
        // **Warning**: all these ivars must **also** be inited in initCommonIvars.
        this.c = c;
        this.encoding = 'utf-8'; // 2014/08/13
        this.fileCommands = c.fileCommands;
        this.errors = 0; // Make sure at.error() works even when not inited.
        // #2276: allow different section delims.
        this.section_delim1 = '<<';
        this.section_delim2 = '>>';
        // **Only** at.writeAll manages these flags.
        this.unchangedFiles = 0;
        // promptForDangerousWrite sets cancelFlag and yesToAll only if canCancelFlag is True.
        this.canCancelFlag = false;
        this.cancelFlag = false;
        this.yesToAll = false;
        // User options: set in reloadSettings.
        this.checkPythonCodeOnWrite = false;
        this.runFlake8OnWrite = false;
        this.runPyFlakesOnWrite = false;
        this.reloadSettings();
    }
    //@+node:felix.20230415162429.3: *5* at.reloadSettings
    /**
     * AtFile.reloadSettings
     */
    public reloadSettings(): void {
        const c = this.c;
        this.checkPythonCodeOnWrite = c.config.getBool(
            'check-python-code-on-write',
            true
        );
        this.runFlake8OnWrite = c.config.getBool('run-flake8-on-write', false);
        this.runPyFlakesOnWrite = c.config.getBool(
            'run-pyflakes-on-write',
            false
        );
    }
    //@+node:felix.20230415162429.4: *4* at.initCommonIvars
    /**
     * Init ivars common to both reading and writing.
     *
     * The defaults set here may be changed later.
     */
    public initCommonIvars(): void {
        const c = this.c;
        this.at_auto_encoding = c.config.default_at_auto_file_encoding;
        this.encoding = c.config.default_derived_file_encoding;
        this.endSentinelComment = '';
        this.errors = 0;
        this.inCode = true;
        this.indent = 0; // The unit of indentation is spaces, not tabs.
        this.language = undefined;
        this.output_newline = g.getOutputNewline(c);
        this.page_width = undefined;
        this.root = undefined; // The root (a position) of tree being read or written.
        this.startSentinelComment = '';
        this.endSentinelComment = '';
        this.tab_width = c.tab_width || -4;
        this.writing_to_shadow_directory = false;
    }
    //@+node:felix.20230415162429.5: *4* at.initReadIvars
    public initReadIvars(root: Position, fileName: string): void {
        this.initCommonIvars();
        this.bom_encoding = undefined; // The encoding implied by any BOM (set by g.stripBOM)
        this.cloneSibCount = 0; // n > 1: Make sure n cloned sibs exists at next @+node sentinel
        this.correctedLines = 0; // For perfect import.
        this.docOut = []; // The doc part being accumulated.
        this.done = false; // True when @-leo seen.
        this.fromString = '';
        this.importRootSeen = false;
        this.lastLines = []; // The lines after @-leo
        this.leadingWs = '';
        this.lineNumber = 0; // New in Leo 4.4.8.
        this.read_i = 0;
        this.read_lines = [];
        this.readVersion = ''; // "5" for new-style thin files.
        this.readVersion5 = false; // Synonym for this.readVersion >= '5'
        this.root = root;
        this.rootSeen = false;
        this.targetFileName = fileName; // For this.writeError only.
        this.v = undefined;
        this.updateWarningGiven = false;
    }
    //@+node:felix.20230415162429.6: *4* at.initWriteIvars
    /**
     * Compute default values of all write-related ivars.
     * Return the finalized name of the output file.
     */
    public async initWriteIvars(root: Position): Promise<string | undefined> {
        const at = this;
        const c = this.c;
        if (!c || !c.config) {
            return undefined;
        }
        const make_dirs = c.config.getBool(
            'create-nonexistent-directories',
            false
        );
        g.assert(root && root.__bool__());
        this.initCommonIvars();
        g.assert(at.checkPythonCodeOnWrite !== undefined);
        //
        // Copy args
        at.root = root;
        at.sentinels = true;
        //
        // Override initCommonIvars.
        if (g.unitTesting) {
            at.output_newline = '\n';
        }
        //
        // Set other ivars.
        at.force_newlines_in_at_nosent_bodies = c.config.getBool(
            'force-newlines-in-at-nosent-bodies'
        );
        // For at.putBody only.
        at.outputList = []; // For stream output.
        // Sets the following ivars:
        // at.encoding
        // at.explicitLineEnding
        // at.language
        // at.output_newline
        // at.page_width
        // at.tab_width
        at.scanAllDirectives(root);
        //
        // Overrides of at.scanAllDirectives...
        if (at.language === 'python') {
            // Encoding directive overrides everything else.
            const encoding = g.getPythonEncodingFromString(root.b);
            if (encoding) {
                at.encoding = encoding;
            }
        }
        //
        // Clean root.v.
        if (!at.errors && at.root) {
            at.root.v._p_changed = true;
        }
        //
        // #1907: Compute the file name and create directories as needed.
        let targetFileName: string | undefined = g.os_path_realpath(
            c.fullPath(root)
        );
        at.targetFileName = targetFileName; // For at.writeError only.
        //
        // targetFileName can be empty for unit tests & @command nodes.
        if (!targetFileName) {
            targetFileName = g.unitTesting ? root.h : undefined;
            at.targetFileName = targetFileName; // For at.writeError only.
            return targetFileName;
        }
        //
        // #2276: scan for section delims
        at.scanRootForSectionDelims(root);
        //
        // Do nothing more if the file already exists.
        const w_exists = await g.os_path_exists(targetFileName);
        if (w_exists) {
            return targetFileName;
        }
        //
        // Create directories if enabled.
        const root_dir = g.os_path_dirname(targetFileName);
        if (make_dirs && root_dir) {
            const ok = await g.makeAllNonExistentDirectories(root_dir);
            if (!ok) {
                g.error(`Error creating directories: ${root_dir}`);
                return undefined;
            }
        }
        //
        // Return the target file name, regardless of future problems.
        return targetFileName;
    }
    //@+node:felix.20230415162513.1: *3* at.Reading
    //@+node:felix.20230415162513.2: *4* at.Reading (top level)
    //@+node:felix.20230415162513.3: *5* at.checkExternalFile
    @cmd(
        'check-external-file',
        'Make sure an external file written by Leo may be read properly.'
    )
    public async checkExternalFile(): Promise<void> {
        const c = this.c;
        const p = this.c.p;
        if (!p.isAtFileNode() && !p.isAtThinFileNode()) {
            g.red('Please select an @thin or @file node');
            return;
        }
        const fn = c.fullPath(p); // #1910.
        if (!(await g.os_path_exists(fn))) {
            g.red(`file not found: ${fn}`);
            return;
        }
        let [s, e] = await g.readFileIntoString(fn);
        if (s === undefined) {
            g.red(`empty file: ${fn}`);
            return;
        }
        //
        // Create a dummy, unconnected, VNode as the root.
        const root_v = new VNode(c);
        const root = new Position(root_v);
        new FastAtRead(c, {}).read_into_root(s, fn, root);
    }
    //@+node:felix.20230415162513.4: *5* at.openFileForReading & helper
    /**
     * Open the file given by at.root.
     * This will be the private file for @shadow nodes.
     */
    public async openFileForReading(
        fromString?: string
    ): Promise<[string, string] | [undefined, undefined]> {
        const at = this;
        const c = this.c;

        const is_at_shadow = this.root!.isAtShadowFileNode();
        if (fromString) {
            if (is_at_shadow) {
                at.error('can not call at.read from string for @shadow files');
                return [undefined, undefined];
            }
            at.initReadLine(fromString);
            return [undefined, undefined];
        }
        //
        // Not from a string. Carefully read the file.
        // Returns full path, including file name.
        let fn: string | undefined = g.fullPath(c, at.root!);
        let s: string | undefined;
        // Remember the full path to this node.
        at.setPathUa(at.root!, fn);
        if (is_at_shadow) {
            fn = await at.openAtShadowFileForReading(fn);
            if (!fn) {
                return [undefined, undefined];
            }
        }
        g.assert(fn);
        try {
            // Sets at.encoding, regularizes whitespace and calls at.initReadLines.
            s = await at.readFileToUnicode(fn);
            // #1466.
            if (s === undefined) {
                // The error has been given.
                at._file_bytes = g.toEncodedString('');
                return [undefined, undefined];
            }
            await at.warnOnReadOnlyFile(fn);
        } catch (exception) {
            at.error(`unexpected exception opening: '@file ${fn}'`);
            at._file_bytes = g.toEncodedString('');
            [fn, s] = [undefined, undefined];
        }
        return [fn!, s!];
    }
    //@+node:felix.20230415162513.5: *6* at.openAtShadowFileForReading
    /**
     * Open an @shadow for reading and return shadow_fn.
     */
    public async openAtShadowFileForReading(
        fn: string
    ): Promise<string | undefined> {
        const at = this;
        const x = at.c.shadowController;
        // readOneAtShadowNode should already have checked these.
        const shadow_fn = x.shadowPathName(fn);

        let [w_exists, w_isFile] = await Promise.all([
            g.os_path_exists(shadow_fn),
            g.os_path_isfile(shadow_fn),
        ]);
        const shadow_exists = w_isFile && w_exists;

        if (!shadow_exists) {
            g.trace('can not happen: no private file', shadow_fn, g.callers());
            at.error(
                `can not happen: private file does not exist: ${shadow_fn}`
            );
            return undefined;
        }
        // This method is the gateway to the shadow algorithm.
        await x.updatePublicAndPrivateFiles(at.root!, fn, shadow_fn!);
        return shadow_fn;
    }
    //@+node:felix.20230415162513.6: *5* at.read & helpers
    /**
     * Read an @thin or @file tree.
     */
    public async read(root: Position, fromString?: string): Promise<boolean> {
        const at = this;
        const c = this.c;
        let file_s;
        let fileName: string | undefined = c.fullPath(root); // #1341. #1889.
        if (!fileName) {
            at.error('Missing file name. Restoring @file tree from .leo file.');
            return false;
        }
        // Fix bug 760531: always mark the root as read, even if there was an error.
        // Fix bug 889175: Remember the full fileName.
        at.rememberReadPath(c.fullPath(root), root);
        at.initReadIvars(root, fileName);
        at.fromString = fromString;
        if (at.errors) {
            return false;
        }
        [fileName, file_s] = await at.openFileForReading(fromString);
        // #1798:
        if (file_s === undefined) {
            return false;
        }
        //
        // Set the time stamp.
        if (fileName) {
            await c.setFileTimeStamp(fileName);
        } else if (!fileName && !fromString && !file_s) {
            return false;
        }
        root.clearVisitedInTree();
        // Sets the following ivars:
        // at.encoding: **changed later** by readOpenFile/at.scanHeader.
        // at.explicitLineEnding
        // at.language
        // at.output_newline
        // at.page_width
        // at.tab_width
        at.scanAllDirectives(root);
        const gnx2vnode = c.fileCommands.gnxDict;
        const contents = fromString || file_s;
        new FastAtRead(c, gnx2vnode).read_into_root(contents, fileName!, root);
        root.clearDirty();
        g.doHook('after-reading-external-file', { c: c, p: root });
        return true;
    }
    //@+node:felix.20230415162513.7: *6* at.deleteUnvisitedNodes
    /**
     * Delete unvisited nodes in root's subtree, not including root.
     *
     * Before Leo 5.6: Move unvisited node to be children of the 'Resurrected
     * Nodes'.
     */
    public deleteUnvisitedNodes(root: Position): void {
        const at = this;
        const c = this.c;
        // Find the unvisited nodes.
        // aList = [z for z in root.subtree() if not z.isVisited()];
        const aList = [...root.subtree()].filter((z) => !z.isVisited());
        if (aList.length) {
            at.c.deletePositionsInList(aList);
            c.redraw();
        }
    }
    //@+node:felix.20230415162513.8: *5* at.readAll & helpers
    /**
     * Scan positions, looking for @<file> nodes to read.
     */
    public async readAll(root: Position): Promise<void> {
        const at = this;
        const c = this.c;
        const old_changed = c.changed;
        const t1 = process.hrtime();
        c.init_error_dialogs();
        const files = at.findFilesToRead(root, true);

        for (const p of files) {
            await at.readFileAtPosition(p);
        }
        for (const p of files) {
            p.v.clearDirty();
        }
        if (!g.unitTesting && files.length) {
            const t2 = process.hrtime();
            g.es(
                `read ${files.length} files in ${utils.getDurationSeconds(
                    t1,
                    t2
                )} seconds`
            );
        }
        c.changed = old_changed;
        await c.raise_error_dialogs();
    }
    //@+node:felix.20230415162513.9: *6* at.findFilesToRead
    public findFilesToRead(root: Position, all: boolean): Position[] {
        const c = this.c;
        const p = root.copy();
        const scanned_nodes: [string, string][] = []; // Treat as set
        const files: Position[] = [];
        const after = all ? undefined : p.nodeAfterTree();
        while (p && p.__bool__() && !p.__eq__(after)) {
            const data: [string, string] = [p.gnx, c.fullPath(p)];
            // skip clones referring to exactly the same paths.
            let w_found = false;
            for (const w_node of scanned_nodes) {
                if (w_node[0] === data[0] && w_node[1] === data[1]) {
                    w_found = true;
                    break;
                }
            }
            if (w_found) {
                p.moveToNodeAfterTree();
                continue;
            }
            scanned_nodes.push(data); // Unique in set
            if (!p.h.startsWith('@')) {
                p.moveToThreadNext();
            } else if (p.isAtIgnoreNode()) {
                if (p.isAnyAtFileNode()) {
                    c.ignored_at_file_nodes.push(p.h);
                }
                p.moveToNodeAfterTree();
            } else if (
                p.isAtThinFileNode() ||
                p.isAtAutoNode() ||
                p.isAtEditNode() ||
                p.isAtShadowFileNode() ||
                p.isAtFileNode() ||
                p.isAtCleanNode() // 1134.
            ) {
                files.push(p.copy());
                p.moveToNodeAfterTree();
            } else if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()) {
                // Note (see #1081): @asis and @nosent can *not* be updated automatically.
                // Doing so using refresh-from-disk will delete all child nodes.
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }

        return files;
    }
    //@+node:felix.20230415162513.10: *6* at.readFileAtPosition
    /**
     * Read the @<file> node at p.
     */
    public async readFileAtPosition(p: Position): Promise<void> {
        const at = this;
        const c = this.c;
        const fileName = p.anyAtFileNodeName();

        if (p.isAtThinFileNode() || p.isAtFileNode()) {
            await at.read(p);
        } else if (p.isAtAutoNode()) {
            await at.readOneAtAutoNode(p);
        } else if (p.isAtEditNode()) {
            await at.readOneAtEditNode(p);
        } else if (p.isAtShadowFileNode()) {
            await at.readOneAtShadowNode(fileName, p);
        } else if (p.isAtAsisFileNode() || p.isAtNoSentFileNode()) {
            at.rememberReadPath(c.fullPath(p), p);
        } else if (p.isAtCleanNode()) {
            await at.readOneAtCleanNode(p);
        }
    }
    //@+node:felix.20230415162513.11: *6* at.readAllSelected
    /**
     * Read all @<file> nodes in root's tree.
     */
    public async readAllSelected(root: Position): Promise<void> {
        const at = this;
        const c = this.c;
        const old_changed = c.changed;
        const t1 = process.hrtime();
        c.init_error_dialogs();
        const files = at.findFilesToRead(root, false);
        for (const p of files) {
            await at.readFileAtPosition(p);
        }
        for (const p of files) {
            p.v.clearDirty();
        }
        if (!g.unitTesting) {
            if (files.length) {
                const t2 = process.hrtime();
                g.es(
                    `read ${files.length} files in ${utils.getDurationSeconds(
                        t1,
                        t2
                    )} seconds`
                );
            } else {
                g.es('no @<file> nodes in the selected tree');
            }
        }
        c.changed = old_changed;
        await c.raise_error_dialogs();
    }
    //@+node:felix.20230415162513.12: *5* at.readAtShadowNodes
    /**
     * Read all @shadow nodes in the p's tree.
     */
    public async readAtShadowNodes(p: Position): Promise<void> {
        const at = this;
        const after = p.nodeAfterTree();
        p = p.copy(); // Don't change p in the caller.
        while (p && p.__bool__() && !p.__eq__(after)) {
            // Don't use iterator.
            if (p.isAtShadowFileNode()) {
                const fileName = p.atShadowFileNodeName();
                await at.readOneAtShadowNode(fileName, p);
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }
    //@+node:felix.20230415162513.13: *5* at.readOneAtAutoNode
    /**
     * Read an @auto file into p. Return the *new* position.
     */
    public async readOneAtAutoNode(p: Position): Promise<Position> {
        const at = this;
        const c = this.c;
        const ic = this.c.importCommands;

        const fileName = c.fullPath(p); // #1521, #1341, #1914.
        if (!(await g.os_path_exists(fileName))) {
            g.error(`not found: ${p.h}̀`);
            return p;
        }

        // Remember that we have seen the @auto node.
        // #889175: Remember the full fileName.
        at.rememberReadPath(fileName, p);
        const old_p = p.copy();
        try {
            at.scanAllDirectives(p);
            p.v.b = ''; // Required for @auto API checks.
            p.v._deleteAllChildren();
            p = (await ic.createOutline(p.copy())) as Position;
            // Do *not* call c.selectPosition(p) here.
            // That would improperly expand nodes.
        } catch (exception) {
            p = old_p;
            ic.errors += 1;
            g.es_print('Unexpected exception importing', fileName);
            g.es_exception(exception);
        }
        if (ic.errors) {
            g.error(`errors inhibited read @auto ${fileName}`);
        } else if (c.persistenceController) {
            c.persistenceController.update_after_read_foreign_file(p);
        }
        // Finish.
        const w_exists = await g.os_path_exists(fileName);
        if (ic.errors || !w_exists) {
            p.clearDirty();
        } else {
            g.doHook('after-auto', { c: c, p: p });
            g.doHook('after-reading-external-file', { c: c, p: p });
        }

        return p; // For #451: return p.
    }
    //@+node:felix.20230415162513.14: *5* at.readOneAtEditNode
    public async readOneAtEditNode(p: Position): Promise<void> {
        const at = this;
        const c = this.c;
        const ic = this.c.importCommands;

        const fn = c.fullPath(p);
        let [junk, ext] = g.os_path_splitext(fn);
        // Fix bug 889175: Remember the full fileName.
        at.rememberReadPath(fn, p);
        // if not g.unitTesting: g.es("reading: @edit %s" % (g.shortFileName(fn)))
        let [s, e] = await g.readFileIntoString(fn, undefined, '@edit');
        if (s === undefined) {
            return;
        }
        const encoding: BufferEncoding = e === undefined ? 'utf-8' : e;
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        let head = '';
        ext = ext.toLowerCase();
        if (['.html', '.htm'].includes(ext)) {
            head = '@language html\n';
        } else if (['.txt', '.text'].includes(ext)) {
            head = '@nocolor\n';
        } else {
            const language = ic.languageForExtension(ext);
            if (language && language !== 'unknown_language') {
                head = `@language ${language}\n`;
            } else {
                head = '@nocolor\n';
            }
        }
        p.b = head + g.toUnicode(s, encoding, true);
        g.doHook('after-edit', { p: p });
        g.doHook('after-reading-external-file', { c: c, p: p });

    }
    //@+node:felix.20230415162513.15: *5* at.readOneAtAsisNode
    /**
     * Read one @asis node. Used only by refresh-from-disk
     */
    public async readOneAtAsisNode(p: Position): Promise<void> {
        const at = this;
        const c = this.c;
        const fn = c.fullPath(p);
        let [junk, ext] = g.os_path_splitext(fn);
        // Remember the full fileName.
        at.rememberReadPath(fn, p);
        // if not g.unitTesting: g.es("reading: @asis %s" % (g.shortFileName(fn)))
        let [s, e] = await g.readFileIntoString(fn, undefined, '@edit');
        if (s === undefined) {
            return;
        }
        const encoding = e === undefined ? 'utf-8' : e;
        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        const old_body = p.b;
        p.b = g.toUnicode(s, encoding, true);
        if (!c.isChanged() && p.b !== old_body) {
            c.setChanged();
        }
        g.doHook('after-reading-external-file', { c: c, p: p });
    }
    //@+node:felix.20230415162513.16: *5* at.readOneAtCleanNode & helpers
    /**
     * Update the @clean/@nosent node at root.
     */
    public async readOneAtCleanNode(root: Position): Promise<boolean> {
        const at = this;
        const c = this.c;
        const x = this.c.shadowController;

        const fileName = c.fullPath(root);
        const w_exists = await g.os_path_exists(fileName);
        if (!w_exists) {
            g.es_print(`not found: ${fileName}̀`);
            return false;
        }
        at.rememberReadPath(fileName, root);
        // Must be called before at.scanAllDirectives.
        at.initReadIvars(root, fileName);
        // Sets at.startSentinelComment/endSentinelComment.
        at.scanAllDirectives(root);
        const new_public_lines = await at.read_at_clean_lines(fileName);
        const old_private_lines = await this.write_at_clean_sentinels(root);
        const marker = x.markerFromFileLines(old_private_lines, fileName);
        let [old_public_lines, junk] = x.separate_sentinels(
            old_private_lines,
            marker
        );
        let new_private_lines;
        if (old_public_lines && old_public_lines.length) {
            new_private_lines = x.propagate_changed_lines(
                new_public_lines,
                old_private_lines,
                marker,
                root
            );
        } else {
            new_private_lines = [];
            root.b = new_public_lines.join('');
            return true;
        }
        // if (new_private_lines === old_private_lines) {
        if (
            new_private_lines.length === old_private_lines.length &&
            new_private_lines.every(
                (value, index) => value === old_private_lines[index]
            )
        ) {
            return true;
        }
        if (!g.unitTesting) {
            g.es('updating:', root.h);
        }
        root.clearVisitedInTree();
        const gnx2vnode = at.fileCommands.gnxDict;
        const contents = new_private_lines.join('');
        new FastAtRead(c, gnx2vnode).read_into_root(contents, fileName, root);
        g.doHook('after-reading-external-file', { c: c, p: root });
        return true; // Errors not detected.
    }
    //@+node:felix.20230415162513.17: *6* at.dump_lines
    /**
     * Dump all lines.
     */
    public dump(lines: string[], tag: string): void {
        console.log(`***** ${tag} lines...\n`);
        for (const s of lines) {
            console.log(s.trimEnd());
        }
    }
    //@+node:felix.20230415162513.18: *6* at.read_at_clean_lines
    /**
     * Return all lines of the @clean/@nosent file at fn.
     */
    public async read_at_clean_lines(fn: string): Promise<string[]> {
        const at = this;
        // Use the standard helper. Better error reporting.
        // Important: uses 'rb' to open the file.
        let s: string;
        const s_bytes = await at.openFileHelper(fn);
        // #1798.
        if (!s_bytes) {
            s = '';
        } else {
            s = g.toUnicode(s_bytes, at.encoding);
            s = s.replace(/\r\n/g, '\n'); // Suppress meaningless "node changed" messages.
        }
        return g.splitLines(s);
    }
    //@+node:felix.20230415162513.19: *6* at.write_at_clean_sentinels
    /**
     * Return all lines of the @clean tree as if it were
     * written as an @file node.
     */
    public async write_at_clean_sentinels(root: Position): Promise<string[]> {
        const at = this;
        const result = await at.atFileToString(root, true);
        const s = g.toUnicode(result, at.encoding);
        return g.splitLines(s);
    }
    //@+node:felix.20230415162513.20: *5* at.readOneAtShadowNode & helper
    public async readOneAtShadowNode(fn: string, p: Position): Promise<void> {
        const at = this;
        const c = this.c;
        const x = this.c.shadowController;

        if (fn !== p.atShadowFileNodeName()) {
            at.error(
                `can not happen: fn: ${fn} != atShadowNodeName: ` +
                `${p.atShadowFileNodeName()}`
            );
            return;
        }

        fn = c.fullPath(p); // #1521 & #1341.
        // #889175: Remember the full fileName.
        at.rememberReadPath(fn, p);
        const shadow_fn = x.shadowPathName(fn);

        let [w_exists, w_isFile] = await Promise.all([
            g.os_path_exists(shadow_fn),
            g.os_path_isfile(shadow_fn),
        ]);
        const shadow_exists = w_isFile && w_exists;

        // Delete all children.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        if (shadow_exists) {
            await at.read(p);
        } else {
            const ok = await at.importAtShadowNode(p);
            if (ok) {
                // Create the private file automatically.
                await at.writeOneAtShadowNode(p);
                g.doHook('after-reading-external-file', { c: c, p: p });
            }
        }
    }
    //@+node:felix.20230415162513.21: *6* at.importAtShadowNode
    public async importAtShadowNode(p: Position): Promise<boolean> {
        const c = this.c;
        const ic = this.c.importCommands;
        const fn = c.fullPath(p); // #1521, #1341, #1914.
        const w_exist = await g.os_path_exists(fn);
        if (!w_exist) {
            g.error(`not found: ${p.h}`);
            return false;
        }
        // Delete all the child nodes.
        while (p.hasChildren()) {
            p.firstChild().doDelete();
        }
        // Import the outline, exactly as @auto does.
        await ic.createOutline(p.copy());
        if (ic.errors) {
            g.error('errors inhibited read @shadow', fn);
        }
        const w_exists = await g.os_path_exists(fn);
        if (ic.errors || !w_exists) {
            p.clearDirty();
        }
        return ic.errors === 0;
    }
    //@+node:felix.20230415162513.22: *4* at.fast_read_into_root
    /**
     * A convenience wrapper for FastAtRead.read_into_root()
     */
    public fast_read_into_root(
        c: Commands,
        contents: string,
        gnx2vnode: { [key: string]: VNode },
        path: string,
        root: Position
    ): boolean {
        return new FastAtRead(c, gnx2vnode).read_into_root(
            contents,
            path,
            root
        );
    }
    //@+node:felix.20230415162513.23: *4* at.Reading utils...
    //@+node:felix.20230415162513.24: *5* at.createImportedNode
    public createImportedNode(root: Position, headline: string): Position {
        const at = this;
        let p: Position;
        if (at.importRootSeen) {
            p = root.insertAsLastChild();
            p.initHeadString(headline);
        } else {
            // Put the text into the already-existing root node.
            p = root;
            at.importRootSeen = true;
        }
        p.v.setVisited(); // Suppress warning about unvisited node.
        return p;
    }
    //@+node:felix.20230416214022.1: *5* at.initReadLine
    /**
     * Init the ivars so that at.readLine will read all of s.
     */
    public initReadLine(s: string): void {
        const at = this;
        at.read_i = 0;
        at.read_lines = g.splitLines(s);
        at._file_bytes = g.toEncodedString(s);
    }
    //@+node:felix.20230416214054.1: *5* at.parseLeoSentinel
    /**
     * Parse the sentinel line s.
     * If the sentinel is valid, set at.encoding, at.readVersion, at.readVersion5.
     */
    public parseLeoSentinel(
        s: string
    ): [boolean, boolean, string, string, boolean] {
        const at = this;
        const c = this.c;
        // Set defaults.
        let encoding = c.config.default_derived_file_encoding;
        let readVersion, readVersion5; // None. None
        let new_df = false;
        let start = '';
        let end = '';
        let isThin = false;
        // Example: \*@+leo-ver=5-thin-encoding=utf-8,.*/
        const pattern =
            /(.+)@\+leo(-ver=([0123456789]+))?(-thin)?(-encoding=(.*)(\.))?(.*)/;
        // The old code weirdly allowed '.' in version numbers.
        // group 1: opening delim
        // group 2: -ver=
        // group 3: version number
        // group(4): -thin
        // group(5): -encoding=utf-8,.
        // group(6): utf-8,
        // group(7): .
        // group(8): closing delim.
        const m = pattern.exec(s);
        let valid = !!m;
        if (m && valid) {
            start = m[1]; // start delim
            valid = !!start;
        }
        if (m && valid) {
            new_df = !!m[2]; // -ver=
            if (new_df) {
                // Set the version number.
                if (m[3]) {
                    readVersion = m[3];
                    readVersion5 = readVersion >= '5';
                } else {
                    valid = false;
                }
            }
        }
        if (m && valid) {
            // set isThin
            isThin = !!m[4];
        }
        if (m && valid && m[5]) {
            // set encoding.
            encoding = m[6] as BufferEncoding;
            if (encoding && encoding.endsWith(',')) {
                // Leo 4.2 or after.
                encoding = encoding.substring(
                    0,
                    encoding.length - 1
                ) as BufferEncoding;
            }
            if (!g.isValidEncoding(encoding)) {
                g.es_print('bad encoding in derived file:', encoding);
                valid = false;
            }
        }
        if (m && valid) {
            end = m[8]; // closing delim
        }
        if (valid) {
            at.encoding = encoding;
            at.readVersion = readVersion;
            at.readVersion5 = readVersion5;
        }
        return [valid, new_df, start, end, isThin];
    }
    //@+node:felix.20230416214118.1: *5* at.readFileToUnicode & helpers
    /**
     * Carefully sets at.encoding, then uses at.encoding to convert the file
     * to a unicode string.
     *
     * Sets at.encoding as follows:
     *  1. Use the BOM, if present. This unambiguously determines the encoding.
     *  2. Use the -encoding= field in the @+leo header, if present and valid.
     *  3. Otherwise, uses existing value of at.encoding, which comes from:
     *      A. An @encoding directive, found by at.scanAllDirectives.
     *      B. The value of c.config.default_derived_file_encoding.
     *
     * Returns the string, or None on failure.
     */
    public async readFileToUnicode(
        fileName: string
    ): Promise<string | undefined> {
        const at = this;
        let s: string;
        let s_bytes = await at.openFileHelper(fileName); // Catches all exceptions.
        // #1798.
        if (!s_bytes || !s_bytes.byteLength) {
            return undefined; // Not ''.
        }
        let e: BufferEncoding | undefined;
        [e, s_bytes] = g.stripBOM(s_bytes);
        if (e) {
            // The BOM determines the encoding unambiguously.
            s = g.toUnicode(s_bytes, e);
        } else {
            // Get the encoding from the header, or the default encoding.
            const s_temp = g.toUnicode(s_bytes, 'ascii', false);
            e = at.getEncodingFromHeader(fileName, s_temp);
            s = g.toUnicode(s_bytes, e);
        }
        s = s.replace(/(?:\r\n)/g, '\n');
        at.encoding = e;
        at.initReadLine(s);
        return s;
    }
    //@+node:felix.20230416214118.2: *6* at.openFileHelper
    /**
     * Open a file, reporting all exceptions.
     */
    public async openFileHelper(
        fileName: string
    ): Promise<Uint8Array | undefined> {
        // bytes,  *not* str!
        const at = this;
        // #1798: return None as a flag on any error.
        let s;
        try {
            const w_uri = g.makeVscodeUri(fileName);
            const w_exists = await g.os_path_exists(fileName);
            if (w_exists) {
                s = await vscode.workspace.fs.readFile(w_uri);
            } else {
                at.error(`can not open ${fileName}`);
                return undefined;
            }
        } catch (exception) {
            at.error(`Exception reading ${fileName}`);
            g.es_exception(exception);
        }
        return s;
    }
    //@+node:felix.20230416214118.3: *6* at.getEncodingFromHeader
    /**
     * Return the encoding given in the @+leo sentinel, if the sentinel is
     * present, or the previous value of at.encoding otherwise.
     */
    public getEncodingFromHeader(fileName: string, s: string): BufferEncoding {
        const at = this;
        let e: BufferEncoding;
        if (at.errors) {
            g.trace('can not happen: at.errors > 0', g.callers());
            e = at.encoding!;
            if (g.unitTesting) {
                g.assert(false, g.callers()); // noqa
            }
        } else {
            at.initReadLine(s);
            const old_encoding = at.encoding;
            g.assert(old_encoding);
            at.encoding = undefined;
            // Execute scanHeader merely to set at.encoding.
            at.scanHeader(fileName, false);
            e = at.encoding! || old_encoding;
        }
        g.assert(e);
        return e!;
    }
    //@+node:felix.20230416214135.1: *5* at.readLine
    /**
     * Read one line from file using the present encoding.
     * Returns at.read_lines[at.read_i++]
     */
    public readLine(): string {
        // This is an old interface, now used only by at.scanHeader.
        // For now, it's not worth replacing.
        const at = this;
        if (at.read_i < at.read_lines.length) {
            const s = at.read_lines[at.read_i];
            at.read_i += 1;
            return s;
        }
        // Not an error.
        return '';
    }
    //@+node:felix.20230416214148.1: *5* at.scanHeader
    /**
     * Scan the @+leo sentinel, using the old readLine interface.
     *
     * Sets self.encoding, and self.start/endSentinelComment.
     *
     * Returns (firstLines,new_df,isThinDerivedFile) where:
     * firstLines        contains all @first lines,
     * new_df            is True if we are reading a new-format derived file.
     * isThinDerivedFile is True if the file is an @thin file.
     */
    public scanHeader(
        fileName?: string,
        giveErrors = true
    ): [string[], boolean, boolean] {
        const at = this;
        let new_df = false;
        let isThinDerivedFile = false;
        let start, end;
        const firstLines: string[] = []; // The lines before @+leo.
        const s = at.scanFirstLines(firstLines);
        let valid = s.length > 0;
        if (valid) {
            [valid, new_df, start, end, isThinDerivedFile] =
                at.parseLeoSentinel(s);
        }
        if (valid) {
            at.startSentinelComment = start;
            at.endSentinelComment = end;
        } else if (giveErrors) {
            at.error(`No @+leo sentinel in: ${fileName}`);
            g.trace(g.callers());
        }
        return [firstLines, new_df, isThinDerivedFile];
    }
    //@+node:felix.20230416214148.2: *6* at.scanFirstLines
    /**
     * Append all lines before the @+leo line to firstLines.
     *
     * Empty lines are ignored because empty @first directives are
     * ignored.
     *
     * We can not call sentinelKind here because that depends on the comment
     * delimiters we set here.
     */
    public scanFirstLines(firstLines: string[]): string {
        const at = this;
        let s = at.readLine();
        while (s && s.indexOf('@+leo') === -1) {
            firstLines.push(s);
            s = at.readLine();
        }
        return s;
    }
    //@+node:felix.20230415162513.33: *5* at.scanHeaderForThin (import code)
    /**
     * Return true if the derived file is a thin file.
     *
     * This is a kludgy method used only by the import code.
     */
    public async scanHeaderForThin(fileName: string): Promise<boolean> {
        const at = this;
        // Set at.encoding, regularize whitespace and call at.initReadLines.
        await at.readFileToUnicode(fileName);
        // scanHeader uses at.readline instead of its args.
        // scanHeader also sets at.encoding.;
        let [junk1, junk2, isThin] = at.scanHeader(undefined);
        return isThin;
    }
    //@+node:felix.20230415162517.1: *3* at.Writing
    //@+node:felix.20230415162517.2: *4* Writing (top level)
    //@+node:felix.20230415162517.3: *5* at.commands
    //@+node:felix.20230415162517.4: *6* at.writeAtAutoNodes
    @cmd(
        'write-at-auto-nodes',
        'Write all @auto nodes in the selected outline.'
    )
    public async writeAtAutoNodes(): Promise<void> {
        const at = this;
        const c = this.c;
        const p = this.c.p;
        // ! LEOJS : warn if no openDirectory before write/read external files.
        if (!c.fileName()) {
            void g.warnNoOpenDirectory();
        }
        c.init_error_dialogs();
        const after = p.nodeAfterTree();
        let found = false;
        if (g.app.externalFilesController) {
            await g.app.externalFilesController.onIdlePromise;
            g.app.externalFilesController.files_busy = true;
        }
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.isAtAutoNode() && !p.isAtIgnoreNode()) {
                const ok = await at.writeOneAtAutoNode(p);
                if (ok) {
                    found = true;
                    p.moveToNodeAfterTree();
                } else {
                    p.moveToThreadNext();
                }
            } else {
                p.moveToThreadNext();
            }
        }
        if (g.app.externalFilesController) {
            g.app.externalFilesController.files_busy = false;
        }
        if (g.unitTesting) {
            return;
        }
        if (found) {
            g.es('finished');
        } else {
            g.es('no @auto nodes in the selected tree');
        }
        await c.raise_error_dialogs('write');
    }
    //@+node:felix.20230415162517.5: *6* at.writeDirtyAtAutoNodes
    @cmd(
        'write-dirty-at-auto-nodes',
        'Write all dirty @auto nodes in the selected outline.'
    )
    public async writeDirtyAtAutoNodes(): Promise<void> {
        const at = this;
        const c = this.c;
        const p = this.c.p;

        // ! LEOJS : warn if no openDirectory before write/read external files.
        if (!c.fileName()) {
            void g.warnNoOpenDirectory();
        }
        c.init_error_dialogs();
        const after = p.nodeAfterTree();
        let found = false;
        if (g.app.externalFilesController) {
            await g.app.externalFilesController.onIdlePromise;
            g.app.externalFilesController.files_busy = true;
        }
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.isAtAutoNode() && !p.isAtIgnoreNode() && p.isDirty()) {
                const ok = await at.writeOneAtAutoNode(p);
                if (ok) {
                    found = true;
                    p.moveToNodeAfterTree();
                } else {
                    p.moveToThreadNext();
                }
            } else {
                p.moveToThreadNext();
            }
        }
        if (g.app.externalFilesController) {
            g.app.externalFilesController.files_busy = false;
        }
        if (g.unitTesting) {
            return;
        }
        if (found) {
            g.es('finished');
        } else {
            g.es('no dirty @auto nodes in the selected tree');
        }
        await c.raise_error_dialogs('write');
    }
    //@+node:felix.20230415162517.6: *6* at.writeAtShadowNodes
    @cmd(
        'write-at-shadow-nodes',
        'Write all @shadow nodes in the selected outline.'
    )
    public async writeAtShadowNodes(): Promise<boolean> {
        const at = this;
        const c = this.c;
        const p = this.c.p;

        // ! LEOJS : warn if no openDirectory before write/read external files.
        if (!c.fileName()) {
            void g.warnNoOpenDirectory();
        }
        c.init_error_dialogs();
        const after = p.nodeAfterTree();
        let found = false;
        if (g.app.externalFilesController) {
            await g.app.externalFilesController.onIdlePromise;
            g.app.externalFilesController.files_busy = true;
        }
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.atShadowFileNodeName() && !p.isAtIgnoreNode()) {
                const ok = await at.writeOneAtShadowNode(p);
                if (ok) {
                    found = true;
                    g.blue(`wrote ${p.atShadowFileNodeName()}`);
                    p.moveToNodeAfterTree();
                } else {
                    p.moveToThreadNext();
                }
            } else {
                p.moveToThreadNext();
            }
        }
        if (g.app.externalFilesController) {
            g.app.externalFilesController.files_busy = false;
        }
        if (g.unitTesting) {
            return found;
        }
        if (found) {
            g.es('finished');
        } else {
            g.es('no @shadow nodes in the selected tree');
        }
        await c.raise_error_dialogs('write');
        return found;
    }
    //@+node:felix.20230415162517.7: *6* at.writeDirtyAtShadowNodes
    @cmd(
        'write-dirty-at-shadow-nodes',
        'Write all @shadow nodes in the selected outline.'
    )
    public async writeDirtyAtShadowNodes(): Promise<boolean> {
        const at = this;
        const c = this.c;
        const p = this.c.p;

        // ! LEOJS : warn if no openDirectory before write/read external files.
        if (!c.fileName()) {
            void g.warnNoOpenDirectory();
        }
        c.init_error_dialogs();
        const after = p.nodeAfterTree();
        let found = false;
        if (g.app.externalFilesController) {
            await g.app.externalFilesController.onIdlePromise;
            g.app.externalFilesController.files_busy = true;
        }
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (
                p.atShadowFileNodeName() &&
                !p.isAtIgnoreNode() &&
                p.isDirty()
            ) {
                const ok = await at.writeOneAtShadowNode(p);
                if (ok) {
                    found = true;
                    g.blue(`wrote ${p.atShadowFileNodeName()}`);
                    p.moveToNodeAfterTree();
                } else {
                    p.moveToThreadNext();
                }
            } else {
                p.moveToThreadNext();
            }
        }
        if (g.app.externalFilesController) {
            g.app.externalFilesController.files_busy = false;
        }
        if (g.unitTesting) {
            return found;
        }
        if (found) {
            g.es('finished');
        } else {
            g.es('no dirty @shadow nodes in the selected tree');
        }
        await c.raise_error_dialogs('write');
        return found;
    }
    //@+node:felix.20230415162517.8: *5* at.putFile
    /**
     * Write the contents of the file to the output stream.
     */
    public putFile(root: Position, fromString = '', sentinels = true): void {
        const at = this;
        const s = fromString ? fromString : root.v.b;
        root.clearAllVisitedInTree();
        at.putAtFirstLines(s);
        at.putOpenLeoSentinel('@+leo-ver=5');
        at.putInitialComment();
        at.putOpenNodeSentinel(root);
        at.putBody(root, fromString);
        // The -leo sentinel is required to handle @last.
        at.putSentinel('@-leo');
        root.setVisited();
        at.putAtLastLines(s);
    }
    //@+node:felix.20230415162517.9: *5* at.writeAll & helpers
    /**
     * Write @file nodes in all or part of the outline
     */
    public async writeAll(all = false, dirty = false): Promise<void> {
        const c = this.c;

        // ! LEOJS : warn if no openDirectory before write/read external files.
        if (!c.fileName()) {
            void g.warnNoOpenDirectory();
        }
        const at = this;
        // This is the *only* place where these are set.
        // promptForDangerousWrite sets cancelFlag only if canCancelFlag is True.
        at.unchangedFiles = 0;
        at.canCancelFlag = true;
        at.cancelFlag = false;
        at.yesToAll = false;
        let [files, root] = at.findFilesToWrite(all);
        for (const p of files) {
            try {
                await at.writeAllHelper(p, root);
            } catch (exception) {
                g.es_exception(exception);
                at.internalWriteError(p);
            }
        }
        // Make *sure* these flags are cleared for other commands.
        at.canCancelFlag = false;
        at.cancelFlag = false;
        at.yesToAll = false;
        // Say the command is finished.
        at.reportEndOfWrite(files, all, dirty);
        // #2338: Never call at.saveOutlineIfPossible().
    }
    //@+node:felix.20230415162517.10: *6* at.findFilesToWrite
    /**
     * Return a list of files to write.
     * We must do this in a prepass, so as to avoid errors later.
     */
    public findFilesToWrite(force: boolean): [Position[], Position] {
        const trace = g.app.debug.includes('save') && !g.unitTesting;
        if (trace) {
            g.trace(`writing *${force ? 'selected' : 'all'}* files`);
        }
        const c = this.c;
        let after;
        let root: Position | undefined;
        let p: Position | undefined;
        if (force) {
            // The Write @<file> Nodes command.
            // Write all nodes in the selected tree.
            root = c.p;
            p = c.p;
            after = p.nodeAfterTree();
        } else {
            // Write dirty nodes in the entire outline.
            root = c.rootPosition();
            p = c.rootPosition();
            after = undefined;
        }
        const seen = []; // Used as a set
        let files: Position[] = [];
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.isAtIgnoreNode() && !p.isAtAsisFileNode()) {
                // Honor @ignore in *body* text, but *not* in @asis nodes.
                if (p.isAnyAtFileNode()) {
                    c.ignored_at_file_nodes.push(p.h);
                }
                p.moveToNodeAfterTree();
            } else if (p.isAnyAtFileNode()) {
                const data = [p.v, c.fullPath(p)];
                let w_found = false;
                for (const w_item of seen) {
                    // seen.includes(data)
                    if (w_item[0] === data[0] && w_item[1] === data[1]) {
                        w_found = true;
                        break;
                    }
                }
                if (w_found) {
                    if (trace && force) {
                        g.trace('Already seen', p.h);
                    }
                } else {
                    seen.push(data);
                    files.push(p.copy());
                }
                // Don't scan nested trees???
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
        // When scanning *all* nodes, we only actually write dirty nodes.
        if (!force) {
            files = files.filter((z) => z.isDirty()); // [z for z in files if z.isDirty()]
        }
        if (trace) {
            g.printObj(
                files.map((z) => z.h),
                'Files to be saved'
            );
        }
        return [files, root!];
    }
    //@+node:felix.20230415162517.11: *6* at.internalWriteError
    /**
     * Fix bug 1260415: https://bugs.launchpad.net/leo-editor/+bug/1260415
     * Give a more urgent, more specific, more helpful message.
     */
    public internalWriteError(p: Position): void {
        g.es(`Internal error writing: ${p.h}`);
        g.es('Please report this error to:');
        g.es('https://groups.google.com/forum/#!forum/leo-editor');
        g.es('Warning: changes to this file will be lost');
        g.es('unless you can save the file successfully.');
    }
    //@+node:felix.20230415162517.12: *6* at.reportEndOfWrite
    public reportEndOfWrite(
        files: Position[],
        all: boolean,
        dirty: boolean
    ): void {
        const at = this;
        if (g.unitTesting) {
            return;
        }
        if (files && files.length) {
            const n = at.unchangedFiles;
            g.es(`finished: ${n} unchanged file${g.plural(n)}`);
        } else if (all) {
            g.warning('no @<file> nodes in the selected tree');
        } else if (dirty) {
            g.es('no dirty @<file> nodes in the selected tree');
        }
    }
    //@+node:felix.20230415162517.13: *6* at.writeAllHelper & helper
    /**
     * Write one file for at.writeAll.
     *
     * Do *not* write @auto files unless p == root.
     *
     * This prevents the write-all command from needlessly updating
     * the @persistence data, thereby annoyingly changing the .leo file.
     */
    public async writeAllHelper(p: Position, root: Position): Promise<void> {

        const at = this;
        at.root = root;
        if (p.isAtIgnoreNode()) {
            // Should have been handled in findFilesToWrite.
            g.trace(`Can not happen: ${p.h} is an @ignore node`);
            return;
        }
        try {
            await at.writePathChanged(p);
        } catch (IOError) {
            return;
        }
        const table: [() => boolean, (root: Position) => Promise<void>][] = [
            [p.isAtAsisFileNode, at.asisWrite],
            [p.isAtAutoNode, at.writeOneAtAutoNode],
            [p.isAtCleanNode, at.writeOneAtCleanNode],
            [p.isAtEditNode, at.writeOneAtEditNode],
            [p.isAtFileNode, at.writeOneAtFileNode],
            [p.isAtNoSentFileNode, at.writeOneAtNosentNode],
            [p.isAtShadowFileNode, at.writeOneAtShadowNode as any],
            [p.isAtThinFileNode, at.writeOneAtFileNode],
        ];
        let w_found = false;
        for (let [pred, func] of table) {
            if (pred.bind(p)()) {
                await func.bind(this)(p); // type:ignore
                w_found = true;
                break;
            }
        }
        if (!w_found) {
            g.trace(`Can not happen: ${p.h}`);
            return;
        }
        //
        // Clear the dirty bits in all descendant nodes.
        // The persistence data may still have to be written.
        for (const p2 of p.self_and_subtree(false)) {
            p2.v.clearDirty();
        }
    }
    //@+node:felix.20230415162517.14: *7* at.writePathChanged
    /**
     * raise IOError if p's path has changed *and* user forbids the write.
     */
    public async writePathChanged(p: Position): Promise<void> {
        const at = this;
        const c = this.c;
        //
        // Suppress this message during save-as and save-to commands.
        if (c.ignoreChangedPaths) {
            return; // pragma: no cover
        }
        const oldPath = g.os_path_normcase(at.getPathUa(p));
        const newPath = g.os_path_normcase(c.fullPath(p));
        let changed;
        try {
            // #1367: samefile can throw an exception.
            const w_same = await g.os_path_samefile(oldPath, newPath);
            changed = oldPath && !w_same;
        } catch (exception) {
            changed = true;
        }
        if (!changed) {
            return;
        }
        const ok = await at.promptForDangerousWrite(
            undefined,
            `Path changed for ${p.h}\n` + 'Write this file anyway?'
        );
        if (!ok) {
            // raise IOError
            throw new Error("IOError in atFile 'writePathChanged'.");
        }
        at.setPathUa(p, newPath); // Remember that we have changed paths.
    }
    //@+node:felix.20230415162517.15: *5* at.writeAtAutoContents
    /**
     * Common helper for atAutoToString and writeOneAtAutoNode.
     */
    public async writeAtAutoContents(
        fileName: string,
        root: Position
    ): Promise<string | undefined> {
        const at = this;
        const c = this.c;
        // Dispatch the proper writer.
        let [junk, ext] = g.os_path_splitext(fileName);
        let writer = at.dispatch(ext, root);
        if (writer) {
            at.outputList = [];
            writer(root);
            return at.errors ? '' : at.outputList.join('');
        }
        if (root.isAtAutoRstNode()) {
            // An escape hatch: fall back to the theRst writer
            // if there is no rst writer plugin.

            // TODO : outputFile : STRING or BUFFER or ???
            //
            at.outputFile = ''; // io.StringIO();
            const ok = await c.rstCommands.writeAtAutoFile(
                root,
                fileName,
                at.outputFile
            );
            if (!ok) {
                return '';
            }
            const s = at.outputFile; // .getvalue();
            // at.outputFile.close();
            return s;
        }
        // leo 5.6: allow undefined section references in all @auto files.
        try {
            g.app.allow_undefined_refs = true;
            at.outputList = [];
            at.putFile(root, undefined, false);
            return at.errors ? '' : at.outputList.join('');
        } catch (exception) {
            return undefined;
        } finally {
            g.app.allow_undefined_refs = false;
        }
    }
    //@+node:felix.20230415162517.16: *5* at.writeX...
    //@+node:felix.20230415162517.17: *6* at.asisWrite & helper
    /**
     * Write the p's node to an @asis file.
     */
    public async asisWrite(root: Position): Promise<void> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            c.init_error_dialogs();
            fileName = await at.initWriteIvars(root);
            let w_precheck;
            if (fileName) {
                w_precheck = await at.precheck(fileName, root);
            }
            // #1450.
            if (!fileName || !w_precheck) {
                at.addToOrphanList(root);
                return;
            }
            try {
                g.doHook('before-writing-external-file', { c: c, p: root });
            } catch (e) {
                // The hook must print an error message.
                return;
            }
            at.outputList = [];
            for (const p of root.self_and_subtree(false)) {
                at.writeAsisNode(p);
            }
            if (!at.errors) {
                const contents = at.outputList.join('');
                await at.replaceFile(contents, at.encoding!, fileName, root);
            }
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
        }
    }

    // silentWrite = asisWrite  // Compatibility with old scripts. // TODO ?
    //@+node:felix.20230415162517.18: *7* at.writeAsisNode
    /**
     * Write the p's node to an @asis file.
     */
    public writeAsisNode(p: Position): void {
        const at = this;
        // Write the headline only if it starts with '@@'.

        let s = p.h;
        if (g.match(s, 0, '@@')) {
            s = s.substring(2);
            if (s) {
                at.outputList.push(g.toUnicode('\n', at.encoding, true)); // Experimental.
                at.outputList.push(g.toUnicode(s, at.encoding, true));
                at.outputList.push(g.toUnicode('\n', at.encoding, true));
            }
        }
        // Write the body.
        s = p.b;
        if (s) {
            at.outputList.push(g.toUnicode(s, at.encoding, true));
        }
    }
    //@+node:felix.20230415162517.19: *6* at.writeMissing & helper
    public async writeMissing(p: Position): Promise<void> {
        if (g.app.externalFilesController) {
            await g.app.externalFilesController.onIdlePromise;
            g.app.externalFilesController.files_busy = true;
        }
        const at = this;
        const c = this.c;
        let writtenFiles = false;
        c.init_error_dialogs();
        // #1450.
        await at.initWriteIvars(p.copy());
        p = p.copy();
        let after = p.nodeAfterTree();
        while (p && p.__bool__() && !p.__eq__(after)) {
            // Don't use iterator.
            if (
                p.isAtAsisFileNode() ||
                (p.isAnyAtFileNode() && !p.isAtIgnoreNode())
            ) {
                let fileName = p.anyAtFileNodeName();
                if (fileName) {
                    fileName = c.fullPath(p); // #1914.
                    if (await at.precheck(fileName, p)) {
                        await at.writeMissingNode(p);
                        writtenFiles = true;
                    } else {
                        at.addToOrphanList(p);
                    }
                }
                p.moveToNodeAfterTree();
            } else if (p.isAtIgnoreNode()) {
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
        if (!g.unitTesting) {
            if (writtenFiles) {
                g.es('finished');
            } else {
                g.es('no @file node in the selected tree');
            }
        }
        await c.raise_error_dialogs('write');
        if (g.app.externalFilesController) {
            g.app.externalFilesController.files_busy = false;
        }
    }
    //@+node:felix.20230415162517.20: *7* at.writeMissingNode
    public async writeMissingNode(p: Position): Promise<void> {
        const at = this;
        const table: [
            () => boolean,
            (
                | ((root: Position) => Promise<void>)
                | ((p: Position) => Promise<boolean>)
            )
        ][] = [
                [p.isAtAsisFileNode, at.asisWrite],
                [p.isAtAutoNode, at.writeOneAtAutoNode],
                [p.isAtCleanNode, at.writeOneAtCleanNode],
                [p.isAtEditNode, at.writeOneAtEditNode],
                [p.isAtFileNode, at.writeOneAtFileNode],
                [p.isAtNoSentFileNode, at.writeOneAtNosentNode],
                [p.isAtShadowFileNode, at.writeOneAtShadowNode],
                [p.isAtThinFileNode, at.writeOneAtFileNode],
            ];
        for (let [pred, func] of table) {
            if (pred.bind(p)()) {
                await func.bind(at)(p); // type:ignore
                return;
            }
        }
        g.trace(`Can not happen unknown @<file> kind: ${p.h}`);
    }
    //@+node:felix.20230415162517.21: *6* at.writeOneAtAutoNode & helpers
    /**
     * Write p, an @auto node.
     * File indices *must* have already been assigned.
     * Return True if the node was written successfully.
     */
    public async writeOneAtAutoNode(p: Position): Promise<boolean> {
        const at = this;
        const c = this.c;
        const root = p.copy();
        let fileName;
        try {
            c.endEditing();
            if (!p.atAutoNodeName()) {
                return false;
            }
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;
            // #1450.
            const w_precheck = await at.precheck(fileName!, root);
            if (!fileName || !w_precheck) {
                at.addToOrphanList(root);
                return false;
            }
            try {
                g.doHook('before-writing-external-file', { c: c, p: root });
            } catch (e) {
                // The hook must print an error message.
                return false;
            }
            if (c.persistenceController) {
                c.persistenceController.update_before_write_foreign_file(root);
            }
            const contents = await at.writeAtAutoContents(fileName!, root);
            if (contents === undefined) {
                g.es('not written:', fileName);
                at.addToOrphanList(root);
                return false;
            }
            await at.replaceFile(
                contents,
                at.encoding!,
                fileName!,
                root,
                root.isAtAutoRstNode()
            );
            return true;
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
            return false;
        }
    }
    //@+node:felix.20230415162517.22: *7* at.dispatch & helpers
    /**
     * Return the correct writer function for p, an @auto node.
     */
    public dispatch(
        ext: any,
        p: Position
    ): undefined | ((p: Position) => void) {
        const at = this;
        // Match @auto type before matching extension.
        return at.writer_for_at_auto(p) || at.writer_for_ext(ext);
    }
    //@+node:felix.20230415162517.23: *8* at.writer_for_at_auto
    /**
     * A factory returning a writer function for the given kind of @auto directive.
     */
    public writer_for_at_auto(
        root: Position
    ): undefined | ((p: Position) => void) {
        const at = this;
        const d = g.app.atAutoWritersDict;
        for (const key in d) {
            // ! USING 'IN' for key
            const aClass: typeof BaseWriter = d[key] as any;
            if (aClass && g.match_word(root.h, 0, key)) {
                const writer_for_at_auto_cb = (
                    root: Position
                ): string | void => {
                    try {
                        const writer = new aClass(at.c);
                        const s = writer.write(root) as any;
                        return s ? s : undefined;
                    } catch (exception) {
                        g.es_exception(exception);
                        return undefined;
                    }
                };
                return writer_for_at_auto_cb;
            }
        }
        return undefined;
    }
    //@+node:felix.20230415162517.24: *8* at.writer_for_ext
    /**
     * A factory returning a writer function for the given file extension.
     */
    public writer_for_ext(ext: string): undefined | ((p: Position) => void) {
        const at = this;
        const d = g.app.writersDispatchDict;
        const aClass: typeof BaseWriter = d[ext] as any;
        if (aClass) {
            const writer_for_ext_cb = (root: Position): string | void => {
                try {
                    return new aClass(at.c).write(root);
                } catch (exception) {
                    g.es_exception(exception);
                    return undefined;
                }
            };
            return writer_for_ext_cb;
        }
        return undefined;
    }
    //@+node:felix.20230415162517.25: *6* at.writeOneAtCleanNode
    /**
     * Write one @clean file..
     * root is the position of an @clean node.
     */
    public async writeOneAtCleanNode(root: Position): Promise<void> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;
            let w_precheck;
            if (fileName) {
                w_precheck = await at.precheck(fileName, root);
            }
            if (!fileName || !w_precheck) {
                return;
            }
            try {
                g.doHook('before-writing-external-file', { c: c, p: root });
            } catch (e) {
                // The hook must print an error message.
                return;
            }
            at.outputList = [];
            await at.putFile(root, undefined, false);
            at.warnAboutOrphandAndIgnoredNodes();
            if (at.errors) {
                g.es('not written:', g.shortFileName(fileName));
                at.addToOrphanList(root);
            } else {
                const contents = at.outputList.join('');
                await at.replaceFile(contents, at.encoding!, fileName, root);
            }
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
        }
    }
    //@+node:felix.20230415162517.26: *6* at.writeOneAtEditNode
    /**
     * Write one @edit node.
     */
    public async writeOneAtEditNode(p: Position): Promise<boolean> {
        const at = this;
        const c = this.c;
        const root = p.copy();
        let fileName;
        try {
            c.endEditing();
            c.init_error_dialogs();
            if (!p.atEditNodeName()) {
                return false;
            }
            if (p.hasChildren()) {
                g.error('@edit nodes must not have children');
                g.es(
                    'To save your work, convert @edit to @auto, @file or @clean'
                );
                return false;
            }
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;
            let w_precheck;
            if (fileName) {
                w_precheck = await at.precheck(fileName, root);
            }
            // #1450.
            if (!fileName || !w_precheck) {
                at.addToOrphanList(root);
                return false;
            }
            try {
                g.doHook('before-writing-external-file', { c: c, p: root });
            } catch (e) {
                // The hook must print an error message.
                return false;
            }
            const contents = g
                .splitLines(p.b)
                .filter((s) => at.directiveKind4(s, 0) === AtFile.noDirective)
                .join('');
            await at.replaceFile(contents, at.encoding!, fileName, root);
            await c.raise_error_dialogs('write');
            return true;
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
            return false;
        }
    }
    //@+node:felix.20230415162517.27: *6* at.writeOneAtFileNode
    /**
     * Write @file or @thin file.
     */
    public async writeOneAtFileNode(root: Position): Promise<void> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            fileName = await at.initWriteIvars(root);

            at.sentinels = true;
            let w_precheck;
            if (fileName) {
                w_precheck = await at.precheck(fileName, root);
            }
            if (!fileName || !w_precheck) {
                // Raise dialog warning of data loss.
                at.addToOrphanList(root);
                return;
            }
            try {
                g.doHook('before-writing-external-file', { c: c, p: root });
            } catch (e) {
                // The hook must print an error message.
                return;
            }
            at.outputList = [];
            at.putFile(root, undefined, true);
            at.warnAboutOrphandAndIgnoredNodes();
            if (at.errors) {
                g.es('not written:', g.shortFileName(fileName));
                at.addToOrphanList(root);
            } else {
                const contents = at.outputList.join('');
                await at.replaceFile(contents, at.encoding!, fileName, root);
            }
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
        }
    }
    //@+node:felix.20230415162517.28: *6* at.writeOneAtNosentNode
    /**
     * Write one @nosent node.
     * root is the position of an @<file> node.
     * sentinels will be False for @clean and @nosent nodes.
     */
    public async writeOneAtNosentNode(root: Position): Promise<void> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;
            let w_precheck;
            if (fileName) {
                w_precheck = await at.precheck(fileName, root);
            }
            if (!fileName || !w_precheck) {
                return;
            }
            g.doHook('before-writing-external-file', { c: c, p: root });

            at.outputList = [];
            at.putFile(root, undefined, false);
            at.warnAboutOrphandAndIgnoredNodes();
            if (at.errors) {
                g.es('not written:', g.shortFileName(fileName));
                at.addToOrphanList(root);
            } else {
                const contents = at.outputList.join('');
                await at.replaceFile(contents, at.encoding!, fileName, root);
            }
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
        }
    }
    //@+node:felix.20230415162517.29: *6* at.writeOneAtShadowNode & helper
    /**
     * Write p, an @shadow node.
     * File indices *must* have already been assigned.
     *
     * testing: set by unit tests to suppress the call to at.precheck.
     *          Testing is not the same as g.unitTesting.
     */

    public async writeOneAtShadowNode(
        p: Position,
        testing = false
    ): Promise<boolean> {
        const at = this;
        const c = this.c;
        const root = p.copy();
        const x = c.shadowController;
        let full_path = '';
        let ivars_dict: { [key: string]: any } = {};

        try {
            c.endEditing(); // Capture the current headline.
            const fn = p.atShadowFileNodeName();
            g.assert(fn, p.h);
            // A hack to support unknown extensions. May set c.target_language.
            this.adjustTargetLanguage(fn);
            full_path = c.fullPath(p);
            await at.initWriteIvars(root);
            // Force python sentinels to suppress an error message.
            // The actual sentinels will be set below.
            at.endSentinelComment = undefined;
            at.startSentinelComment = '#';
            // Make sure we can compute the shadow directory.
            const private_fn = x.shadowPathName(full_path);
            if (!private_fn) {
                return false;
            }
            const w_precheck = await at.precheck(full_path, root);
            if (!testing && !w_precheck) {
                return false;
            }
            try {
                g.doHook('before-writing-external-file', { c: c, p: p });
            } catch (e) {
                // The hook must print an error message.
                return false;
            }
            //
            // Bug fix: Leo 4.5.1:
            // use x.markerFromFileName to force the delim to match
            // what is used in x.propagate_changes.
            const marker = x.markerFromFileName(full_path);
            [at.startSentinelComment, at.endSentinelComment] =
                marker!.getDelims();
            if (g.unitTesting) {
                ivars_dict = g.getIvarsDict(at);
            }
            //
            // Write the public and private files to strings.

            const put = (sentinels: boolean): string => {
                at.outputList = [];
                at.sentinels = sentinels;
                at.putFile(root, undefined, sentinels);
                return at.errors ? '' : at.outputList.join('');
            };

            at.public_s = put(false);
            at.private_s = put(true);
            at.warnAboutOrphandAndIgnoredNodes();
            if (g.unitTesting) {
                const exceptions = [
                    'public_s',
                    'private_s',
                    'sentinels',
                    'outputList',
                ];
                g.assert(
                    g.checkUnchangedIvars(at, ivars_dict, exceptions),
                    'writeOneAtShadowNode'
                );
            }

            if (!at.errors) {
                // Write the public and private files.
                // makeShadowDirectory takes a *public* file name.
                await x.makeShadowDirectory(full_path);
                await x.replaceFileWithString(
                    at.encoding!,
                    private_fn,
                    at.private_s
                );
                await x.replaceFileWithString(
                    at.encoding!,
                    full_path,
                    at.public_s
                );
            }
            at.checkPythonCode(at.private_s, full_path, root);
            if (at.errors) {
                g.error('not written:', full_path);
                at.addToOrphanList(root);
            } else {
                root.clearDirty();
            }
            return !at.errors;
        } catch (exception) {
            await at.writeException(exception, full_path, root);
            return false;
        }
    }
    //@+node:felix.20230415162517.30: *7* at.adjustTargetLanguage
    /**
     * Use the language implied by fn's extension if
     * there is a conflict between it and c.target_language.
     */
    public adjustTargetLanguage(fn: string): void {
        const at = this;
        const c = this.c;
        let [junk, ext] = g.os_path_splitext(fn);
        if (ext) {
            if (ext.startsWith('.')) {
                ext = ext.substring(1);
            }
            const language = g.app.extension_dict[ext];
            if (language) {
                c.target_language = language;
            } else {
                // An unknown language.
                // Use the default language, **not** 'unknown_language'
                // pass
            }
        }
    }
    //@+node:felix.20230415162517.31: *5* at.XToString
    //@+node:felix.20230415162517.32: *6* at.atAsisToString
    /**
     * Write the @asis node to a string.
     */
    public async atAsisToString(root: Position): Promise<string> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            fileName = await at.initWriteIvars(root);
            at.outputList = [];
            for (const p of root.self_and_subtree(false)) {
                at.writeAsisNode(p);
            }
            return at.errors ? '' : at.outputList.join('');
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
            return '';
        }
    }
    //@+node:felix.20230415162517.33: *6* at.atAutoToString
    /**
     * Write the root @auto node to a string, and return it.
     */
    public async atAutoToString(root: Position): Promise<string> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;
            // #1450.
            if (!fileName) {
                at.addToOrphanList(root);
                return '';
            }
            return (await at.writeAtAutoContents(fileName, root)) || '';
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
            return '';
        }
    }
    //@+node:felix.20230805150109.1: *6* at.atCleanToString
    /**
     * Write one @clean node to a string.
     */
    public async atCleanToString(root: Position): Promise<string> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;
            at.outputList = [];
            at.putFile(root, undefined, false);
            return at.errors ? '' : at.outputList.join('');
        } catch (e) {
            await at.writeException(e, fileName || '', root);
            return '';
        }
    }
    //@+node:felix.20230415162517.34: *6* at.atEditToString
    /**
     * Write one @edit node.
     */
    public async atEditToString(root: Position): Promise<string> {
        const at = this;
        const c = this.c;
        let fileName;
        try {
            c.endEditing();
            if (root.hasChildren()) {
                g.error('@edit nodes must not have children');
                g.es(
                    'To save your work, convert @edit to @auto, @file or @clean'
                );
                return '';
            }
            fileName = await at.initWriteIvars(root);
            at.sentinels = false;

            // #1450.
            if (!fileName) {
                at.addToOrphanList(root);
                return '';
            }
            const contents = g
                .splitLines(root.b)
                .filter((s) => at.directiveKind4(s, 0) === AtFile.noDirective)
                .join('');
            return contents;
        } catch (exception) {
            await at.writeException(exception, fileName || '', root);
            return '';
        }
    }
    //@+node:felix.20230415162517.35: *6* at.atFileToString
    /**
     * Write an external file to a string, and return its contents.
     */
    public async atFileToString(
        root: Position,
        sentinels = true
    ): Promise<string> {
        const at = this;
        const c = this.c;
        try {
            c.endEditing();
            await at.initWriteIvars(root);
            at.sentinels = sentinels;
            at.outputList = [];
            at.putFile(root, undefined, sentinels);
            g.assert(root.__eq__(at.root), 'write');
            const contents = at.errors ? '' : at.outputList.join('');
            return contents;
        } catch (exception) {
            at.exception(exception, 'exception preprocessing script');
            root.v._p_changed = true;
            return '';
        }
    }
    //@+node:felix.20230415162517.36: *6* at.stringToString
    /**
     * Write an external file from a string.
     *
     * This is at.write specialized for scripting.
     */
    public async stringToString(
        root: Position,
        s: string,
        forceJavascriptSentinels = true, // ! LEOJS HAS JAVASCRIPT AS DEFAULT SCRIPT LANGUAGE
        sentinels = true
    ): Promise<string> {
        const at = this;
        const c = this.c;
        try {
            c.endEditing();
            await at.initWriteIvars(root);
            if (forceJavascriptSentinels) {
                at.endSentinelComment = undefined;
                at.startSentinelComment = '//'; // ! LEOJS HAS JAVASCRIPT AS DEFAULT SCRIPT LANGUAGE
                at.language = 'javascript'; // ! LEOJS HAS JAVASCRIPT AS DEFAULT SCRIPT LANGUAGE
            }
            at.sentinels = sentinels;
            at.outputList = [];
            at.putFile(root, s, sentinels);
            const contents = at.errors ? '' : at.outputList.join('');
            // Major bug: failure to clear this wipes out headlines!
            //            Sometimes this causes slight problems...
            if (root && root.__bool__()) {
                root.v._p_changed = true;
            }
            return contents;
        } catch (exception) {
            at.exception(exception, 'exception preprocessing script');
            return '';
        }
    }
    //@+node:felix.20230415162517.37: *4* Writing helpers
    //@+node:felix.20230415162517.38: *5* at.putBody & helper
    /**
     * Generate the body enclosed in sentinel lines.
     * Return True if the body contains an @others line.
     */
    public putBody(p: Position, fromString = ''): boolean {
        const at = this;
        // New in 4.3 b2: get s from fromString if possible.
        let s = fromString ? fromString : p.b;
        // Make sure v is never expanded again.
        // Suppress orphans check.
        p.v.setVisited();
        //
        // #1048 & #1037: regularize most trailing whitespace.
        if (s && (at.sentinels || at.force_newlines_in_at_nosent_bodies)) {
            if (!s.endsWith('\n')) {
                s = s + '\n';
            }
        }
        const status = {
            at_comment_seen: false,
            at_delims_seen: false,
            at_warning_given: false,
            has_at_others: false,
            in_code: true,
        };
        let i = 0;
        while (i < s.length) {
            const next_i = g.skip_line(s, i);
            g.assert(next_i > i, 'putBody');
            const kind = at.directiveKind4(s, i);
            at.putLine(i, kind, p, s, status);
            i = next_i;
        }
        if (!status.in_code) {
            at.putEndDocLine();
        }
        return status.has_at_others;
    }
    //@+node:felix.20230415162517.39: *6* at.putLine
    /**
     * Put the line at s[i:] of the given kind, updating the status.
     */
    public putLine(
        i: number,
        kind: number,
        p: Position,
        s: string,
        status: {
            at_comment_seen: boolean;
            at_delims_seen: boolean;
            at_warning_given: boolean;
            has_at_others: boolean;
            in_code: boolean;
        }
    ): void {
        const at = this;
        if (kind === AtFile.noDirective) {
            if (status.in_code) {
                // Important: the so-called "name" must include brackets.
                let [name, n1, n2] = at.findSectionName(s, i, p);
                if (name) {
                    at.putRefLine(s, i, n1, n2, name, p);
                } else {
                    at.putCodeLine(s, i);
                }
            } else {
                at.putDocLine(s, i);
            }
        } else if ([AtFile.docDirective, AtFile.atDirective].includes(kind)) {
            if (!status.in_code) {
                // Bug fix 12/31/04: handle adjacent doc parts.
                at.putEndDocLine();
            }
            at.putStartDocLine(s, i, kind);
            status.in_code = false;
        } else if ([AtFile.cDirective, AtFile.codeDirective].includes(kind)) {
            // Only @c and @code end a doc part.
            if (!status.in_code) {
                at.putEndDocLine();
            }
            at.putDirective(s, i, p);
            status.in_code = true;
        } else if (kind === AtFile.allDirective) {
            if (status.in_code) {
                if (p.__eq__(this.root)) {
                    at.putAtAllLine(s, i, p);
                } else {
                    at.error(`@all not valid in: ${p.h}`);
                }
            } else {
                at.putDocLine(s, i);
            }
        } else if (kind === AtFile.othersDirective) {
            if (status.in_code) {
                if (status.has_at_others) {
                    at.error(`multiple @others in: ${p.h}`);
                } else {
                    at.putAtOthersLine(s, i, p);
                    status.has_at_others = true;
                }
            } else {
                at.putDocLine(s, i);
            }
        } else if (kind === AtFile.startVerbatim) {
            // Fix bug 778204: @verbatim not a valid Leo directive.
            if (g.unitTesting) {
                // A hack: unit tests for @shadow use @verbatim as a kind of directive.
                //pass
            } else {
                at.error(`@verbatim is not a Leo directive: ${p.h}`);
            }
        } else if (kind === AtFile.miscDirective) {
            // Fix bug 583878: Leo should warn about @comment/@delims clashes.
            if (g.match_word(s, i, '@comment')) {
                status.at_comment_seen = true;
            } else if (g.match_word(s, i, '@delims')) {
                status.at_delims_seen = true;
            }
            if (
                status.at_comment_seen &&
                status.at_delims_seen &&
                !status.at_warning_given
            ) {
                status.at_warning_given = true;
                at.error(`@comment and @delims in node ${p.h}`);
            }
            at.putDirective(s, i, p);
        } else {
            at.error(
                `putBody: can not happen: unknown directive kind: ${kind}`
            );
        }
    }
    //@+node:felix.20230415162517.40: *5* writing code lines...
    //@+node:felix.20230415162517.41: *6* at: @all
    //@+node:felix.20230415162517.42: *7* at.putAtAllLine
    /**
     * Put the expansion of @all.
     */
    public putAtAllLine(s: string, i: number, p: Position): void {
        const at = this;
        let [j, delta] = g.skip_leading_ws_with_indent(s, i, at.tab_width!);
        const k = g.skip_to_end_of_line(s, i);
        at.putLeadInSentinel(s, i, j);
        at.indent += delta;
        // s[j:k] starts with '@all'
        at.putSentinel('@+' + s.substring(j + 1, k).trimEnd());
        for (const child of p.children()) {
            at.putAtAllChild(child);
        }
        at.putSentinel('@-all');
        at.indent -= delta;
    }
    //@+node:felix.20230415162517.43: *7* at.putAtAllBody
    /**
     * Generate the body enclosed in sentinel lines.
     */
    public putAtAllBody(p: Position): void {
        const at = this;
        let s = p.b;
        // Make sure v is never expanded again.
        // Suppress orphans check.
        p.v.setVisited();
        if (at.sentinels && s && s[s.length - 1] !== '\n') {
            s = s + '\n';
        }
        let i = 0;
        // Leo 6.6. This code never changes at.in_code status!
        while (i < s.length) {
            const next_i = g.skip_line(s, i);
            g.assert(next_i > i);
            at.putCodeLine(s, i);
            i = next_i;
        }
    }
    //@+node:felix.20230415162517.44: *7* at.putAtAllChild
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
        const at = this;
        // Suppress warnings about @file nodes.
        at.putOpenNodeSentinel(p, true);
        at.putAtAllBody(p);
        for (const child of p.children()) {
            at.putAtAllChild(child);
        }
    }
    //@+node:felix.20230415162517.45: *6* at: @others
    //@+node:felix.20230415162517.46: *7* at.putAtOthersLine & helper
    /**
     * Put the expansion of @others.
     */
    public putAtOthersLine(s: string, i: number, p: Position): void {
        const at = this;
        let [j, delta] = g.skip_leading_ws_with_indent(s, i, at.tab_width!);
        const k = g.skip_to_end_of_line(s, i);
        at.putLeadInSentinel(s, i, j);
        at.indent += delta;
        // s[j:k] starts with '@others'
        // Never write lws in new sentinels.
        at.putSentinel('@+' + s.substring(j + 1, k).trim());
        for (const child of p.children()) {
            const w_p = child.copy();
            const after = w_p.nodeAfterTree();
            while (w_p && w_p.__bool__() && !w_p.__eq__(after)) {
                if (at.validInAtOthers(w_p)) {
                    at.putOpenNodeSentinel(w_p);
                    const at_others_flag = at.putBody(w_p);
                    if (at_others_flag) {
                        w_p.moveToNodeAfterTree();
                    } else {
                        w_p.moveToThreadNext();
                    }
                } else {
                    w_p.moveToNodeAfterTree();
                }
            }
        }
        // This is the same in both old and new sentinels.
        at.putSentinel('@-others');
        at.indent -= delta;
    }
    //@+node:felix.20230415162517.47: *8* at.validInAtOthers
    /**
     * Return True if p should be included in the expansion of the @others
     * directive in the body text of p's parent.
     */
    public validInAtOthers(p: Position): boolean {
        const at = this;
        const i = g.skip_ws(p.h, 0);
        let [isSection, junk] = at.isSectionName(p.h, i);
        if (isSection) {
            return false; // A section definition node.
        }
        if (at.sentinels) {
            // @ignore must not stop expansion here!
            return true;
        }
        if (p.isAtIgnoreNode()) {
            g.error('did not write @ignore node', p.v.h);
            return false;
        }
        return true;
    }
    //@+node:felix.20230415162517.48: *6* at.findSectionName
    /**
     * Return n1, n2 representing a section name.
     *
     * Return the reference, *including* brackets.
     */
    public findSectionName(
        s: string,
        i: number,
        p: Position
    ): [string | undefined, number, number] {
        const at = this;
        const end = s.indexOf('\n', i);
        let j = end === -1 ? s.length : end;

        /**
         * A replacement for s[i1 : i2] that doesn't create any substring.
         */
        const is_space = (i1: number, i2: number): boolean => {
            // return i == j or all(s[z] in ' \t\n' for z in range(i1, i2));
            if (i === j) {
                return true;
            }
            for (let z = i1; z < i2; z++) {
                if (![' ', '\t', '\n'].includes(s[z])) {
                    return false;
                }
            }
            return true;
        };

        let n1, n2;
        // Careful: don't look beyond the end of the line!
        if (end === -1) {
            n1 = s.indexOf(at.section_delim1, i);
            n2 = s.indexOf(at.section_delim2, i);
        } else {
            const tempSlice = s.slice(i, end);
            n1 = tempSlice.indexOf(at.section_delim1); // s.indexOf(at.section_delim1, i, end);
            n2 = tempSlice.indexOf(at.section_delim2); // s.indexOf(at.section_delim2, i, end);
        }
        if (end !== -1) {
            if (n1 !== -1) {
                n1 += i;
            };
            if (n2 !== -1) {
                n2 += i;
            };
        }
        let n3 = n2 + at.section_delim2.length;
        if (-1 < n1 && n1 < n2) {
            // A *possible* section reference.
            if (is_space(i, n1) && is_space(n3, j)) {
                // A *real* section reference.
                return [s.substring(n1, n3), n1, n3];
            }
            // An apparent section reference.
            if (g.app.debug.includes('sections') && !g.unitTesting) {
                let [i1, i2] = g.getLine(s, i);
                g.es_print('Ignoring apparent section reference:');
                g.es_print('Node: ', p.h);
                g.es_print('Line: ', s.substring(i1, i2).trimEnd());
            }
        }
        return [undefined, 0, 0];
    }
    //@+node:felix.20230415162517.49: *6* at.putCodeLine
    /**
     * Put a normal code line.
     */
    public putCodeLine(s: string, i: number): void {
        const at = this;
        let j = g.skip_line(s, i);
        let k = g.skip_ws(s, i);
        const line = s.substring(i, j);

        /**
         * Put an @verbatim sentinel. *Always* use black-compatible indentation.
         */
        const put_verbatim_sentinel = () => {
            if (at.root!.isAtCleanNode()) {
                // #2996. Adding an @verbatim sentinel interferes with the @clean algorithm.
                return;
            }
            const ws = s.substring(i, k);
            this.putIndent(ws.length);
            this.putSentinel('@verbatim');
        };

        // Put an @verbatim sentinel if the next line looks like another sentinel.
        if (at.language === 'python') {
            // New in Leo 6.7.2.
            // Python sentinels *only* may contain a space between '#' and '@'
            if (g.match(s, k, '#@') || g.match(s, k, '# @')) {
                put_verbatim_sentinel();
            }
        } else if (g.match(s, k, this.startSentinelComment + '@')) {
            put_verbatim_sentinel();
        }
        // Don't put any whitespace in otherwise blank lines.
        if (line.length > 1) {
            // Preserve *anything* the user puts on the line!!!
            at.putIndent(at.indent, line);
            if (line.endsWith('\n')) {
                at.os(line.slice(0, -1));
                at.onl();
            } else {
                at.os(line);
            }
        } else if (line && line.endsWith('\n')) {
            at.onl();
        } else if (line) {
            at.os(line); // Bug fix: 2013/09/16
        } else {
            g.trace('Can not happen: completely empty line'); // pragma: no cover
        }
    }
    //@+node:felix.20230415162517.50: *6* at.putRefLine
    /**
     * Put a line containing one or more references.
     *
     * Important: the so-called name *must* include brackets.
     */
    public putRefLine(
        s: string,
        i: number,
        n1: number,
        n2: number,
        name: string,
        p: Position
    ): void {
        const at = this;
        const ref = g.findReference(name, p);
        if (ref && ref.__bool__()) {
            let [junk, delta] = g.skip_leading_ws_with_indent(
                s,
                i,
                at.tab_width!
            );
            at.putLeadInSentinel(s, i, n1);
            at.indent += delta;
            at.putSentinel('@+' + name);
            at.putOpenNodeSentinel(ref);
            at.putBody(ref);
            at.putSentinel('@-' + name);
            at.indent -= delta;
            return;
        }
        if (g.app.allow_undefined_refs) {
            p.v.setVisited(); // #2311
            // Allow apparent section reference: just write the line.
            at.putCodeLine(s, i);
        } else {
            // Do give this error even if unit testing.
            at.writeError(
                `undefined section: ${g.truncate(name, 60)}\n` +
                `  referenced from: ${g.truncate(p.h, 60)}`
            );
        }
    }
    //@+node:felix.20230415162517.51: *5* writing doc lines...
    //@+node:felix.20230415162517.52: *6* at.putBlankDocLine
    public putBlankDocLine(): void {
        const at = this;
        if (!at.endSentinelComment) {
            at.putIndent(at.indent);
            at.os(at.startSentinelComment!);
            // #1496: Retire the @doc convention.
            //        Remove the blank.
            // at.oblank()
        }
        at.onl();
    }
    //@+node:felix.20230415162517.53: *6* at.putDocLine
    /**
     * Handle one line of a doc part.
     */
    public putDocLine(s: string, i: number): void {
        const at = this;
        const j = g.skip_line(s, i);
        s = s.substring(i, j);
        //
        // #1496: Retire the @doc convention:
        //        Strip all trailing ws here.
        if (!s.trim()) {
            // A blank line.
            at.putBlankDocLine();
            return;
        }
        // Write the line as it is.
        at.putIndent(at.indent);
        if (!at.endSentinelComment) {
            at.os(at.startSentinelComment!);
            // #1496: Retire the @doc convention.
            //        Leave this blank. The line is not blank.
            at.oblank();
        }
        at.os(s);
        if (!s.endsWith('\n')) {
            at.onl(); // pragma: no cover
        }
    }
    //@+node:felix.20230415162517.54: *6* at.putEndDocLine
    /**
     * Write the conclusion of a doc part.
     */
    public putEndDocLine(): void {
        const at = this;
        // Put the closing delimiter if we are using block comments.
        if (at.endSentinelComment) {
            at.putIndent(at.indent);
            at.os(at.endSentinelComment);
            at.onl(); // Note: no trailing whitespace.
        }
    }
    //@+node:felix.20230415162517.55: *6* at.putStartDocLine
    /**
     * Write the start of a doc part.
     */
    public putStartDocLine(s: string, i: number, kind: number): void {
        const at = this;
        const sentinel = kind === AtFile.docDirective ? '@+doc' : '@+at';
        const directive = kind === AtFile.docDirective ? '@doc' : '@';
        // Put whatever follows the directive in the sentinel.
        // Skip past the directive.
        i += directive.length;
        const j = g.skip_to_end_of_line(s, i);
        const follow = s.substring(i, j);
        // Put the opening @+doc or @-doc sentinel, including whatever follows the directive.
        at.putSentinel(sentinel + follow);
        // Put the opening comment if we are using block comments.
        if (at.endSentinelComment) {
            at.putIndent(at.indent);
            at.os(at.startSentinelComment!);
            at.onl();
        }
    }
    //@+node:felix.20230415162517.56: *4* Writing sentinels...
    //@+node:felix.20230415162517.57: *5* at.nodeSentinelText & helper
    /**
     * Return the text of a @+node or @-node sentinel for p.
     */
    public nodeSentinelText(p: Position): string {
        const at = this;
        const h = at.removeCommentDelims(p);
        const w_attr = (at as any)['at_shadow_test_hack'];
        if (!(w_attr === undefined || w_attr === null)) {
            // A hack for @shadow unit testing.
            // see AtShadowTestCase.makePrivateLines.
            return h;
        }
        const gnx = p.v.fileIndex;
        const level = 1 + p.level() - this.root!.level();
        if (level > 2) {
            return `${gnx}: *${level}* ${h}`;
        }
        return `${gnx}: ${'*'.repeat(level)} ${h}`;
    }
    //@+node:felix.20230415162517.58: *6* at.removeCommentDelims
    /**
     * If the present @language/@comment settings do not specify a single-line comment
     * we remove all block comment delims from h. This prevents headline text from
     * interfering with the parsing of node sentinels.
     */
    public removeCommentDelims(p: Position): string {
        const at = this;
        const start = at.startSentinelComment!;
        const end = at.endSentinelComment;
        let h = p.h;
        if (end) {
            h = h.split(start!).join('');
            h = h.split(end).join('');
        }
        return h;
    }
    //@+node:felix.20230415162517.59: *5* at.putLeadInSentinel
    /**
     * Set at.leadingWs as needed for @+others and @+<< sentinels.
     *
     * i points at the start of a line.
     * j points at @others or a section reference.
     */
    public putLeadInSentinel(s: string, i: number, j: number): void {
        const at = this;
        at.leadingWs = ''; // Set the default.
        if (i === j) {
            return; // The @others or ref starts a line.
        }
        const k = g.skip_ws(s, i);
        if (j === k) {
            // Remember the leading whitespace, including its spelling.
            at.leadingWs = s.substring(i, j);
        } else {
            this.putIndent(at.indent); // 1/29/04: fix bug reported by Dan Winkler.
            at.os(s.substring(i, j));
            at.onl_sent();
        }
    }
    //@+node:felix.20230415162517.60: *5* at.putOpenLeoSentinel 4.x
    /**
     * Write @+leo sentinel.
     */
    public putOpenLeoSentinel(s: string): void {
        const at = this;
        if (at.sentinels || g.app.force_at_auto_sentinels) {
            s = s + '-thin';
            const encoding = at.encoding!.toLowerCase();
            if (encoding !== 'utf-8') {
                // New in 4.2: encoding fields end in ",."
                s = s + `-encoding=${encoding},.`;
            }
            at.putSentinel(s);
        }
    }
    //@+node:felix.20230415162517.61: *5* at.putOpenNodeSentinel
    /**
     * Write @+node sentinel for p.
     */
    public putOpenNodeSentinel(p: Position, inAtAll = false): void {
        // Note: lineNumbers.py overrides this method.
        const at = this;
        if (!inAtAll && p.isAtFileNode() && !p.__eq__(at.root)) {
            at.writeError('@file not valid in: ' + p.h);
            return;
        }
        const s = at.nodeSentinelText(p);
        at.putSentinel('@+node:' + s);
        // Leo 4.7: we never write tnodeLists.
    }
    //@+node:felix.20230415162517.62: *5* at.putSentinel (applies cweb hack) 4.x
    /**
     * Write a sentinel whose text is s, applying the CWEB hack if needed.
     *
     * This method outputs all sentinels.
     */
    public putSentinel(s: string): void {
        const at = this;
        if (at.sentinels || g.app.force_at_auto_sentinels) {
            at.putIndent(at.indent);
            at.os(at.startSentinelComment!);
            // #2194. #2983: Put Black sentinels if --black-sentinels is in effect.
            if (g.app.write_black_sentinels) {
                at.os(' ');
            }
            // Apply the cweb hack to s:
            //   If the opening comment delim ends in '@',
            //   double all '@' signs except the first.
            const start = at.startSentinelComment!;
            if (start && start[start.length - 1] === '@') {
                s = s.split('@').join('@@').substring(1);
            }
            at.os(s);
            if (at.endSentinelComment) {
                at.os(at.endSentinelComment);
            }
            at.onl();
        }
    }
    //@+node:felix.20230415162517.63: *4* Writing utils...
    //@+node:felix.20230415162517.64: *5* at.addToOrphanList
    /**
     * Mark the root as erroneous for c.raise_error_dialogs().
     */
    public addToOrphanList(root: Position): void {
        const c = this.c;
        // Fix #1050:
        root.setOrphan();
        c.orphan_at_file_nodes.push(root.h);
    }
    //@+node:felix.20230415162517.65: *5* at.checkUnchangedFiles
    public checkUnchangedFiles(
        contents: string,
        fileName: string,
        root: Position
    ): void {
        const at = this;
        let ok1 = true;
        let ok2 = true;
        if (g.unitTesting) {
            return;
        }
        const is_python =
            fileName && fileName.endsWith('py') && fileName.endsWith('pyw');
        if (!contents || !is_python) {
            return;
        }
        if (at.runFlake8OnWrite) {
            ok1 = this.runFlake8(root);
        }
        if (at.runPyFlakesOnWrite) {
            ok2 = this.runPyflakes(root);
        }
        if (!ok1 || !ok2) {
            g.app.syntax_error_files.push(g.shortFileName(fileName));
        }
    }
    //@+node:felix.20230415162517.66: *5* at.checkPythonCode & helpers
    /**
     * Perform python-related checks on root.
     */
    public checkPythonCode(
        contents: string,
        fileName: string,
        root: Position
    ): void {
        if (!g.app.log) {
            return; // We are auto-saving.
        }
        const at = this;
        const is_python =
            !!fileName && fileName.endsWith('py') && fileName.endsWith('pyw');

        if (g.unitTesting || !contents || !is_python) {
            return;
        }
        let ok = true;
        if (at.checkPythonCodeOnWrite) {
            ok = at.checkPythonSyntax(root, contents);
        }
        if (ok && at.runPyFlakesOnWrite) { // Creates clickable links.
            ok = this.runPyflakes(root);
        }
        if (ok && at.runFlake8OnWrite) { // Does *not* create clickable links.
            ok = this.runFlake8(root);
        }
        if (!ok) {
            g.app.syntax_error_files.push(g.shortFileName(fileName));
        }
    }
    //@+node:felix.20230415162517.67: *6* at.checkPythonSyntax
    public checkPythonSyntax(p: Position, body: string): boolean {
        const at = this;
        // TODO : MAYBE ALSO FOR JAVASCRIPT !
        console.log('TODO : checkPythonSyntax');
        return true;
        // try{
        //     body = body.replace('\r', '')
        //     fn = f"<node: {p.h}>"
        //     compile(body + '\n', fn, 'exec')
        //     return true;
        // }catch (SyntaxError){
        //     if (!g.unitTesting){
        //         at.syntaxError(p, body)
        //     }
        // }catch (exception){
        //     g.trace("unexpected exception");
        //     g.es_exception(exception);
        // }
        // return false;
    }
    //@+node:felix.20230415162517.68: *7* at.syntaxError (leoAtFile)
    /**
     * Report a syntax error.
     */
    public syntaxError(p: Position, body: any): void {
        g.error(`Syntax error in: ${p.h}`);
        console.log('TODO : syntaxError');
        return;

        // [typ, val, tb] = sys.exc_info();
        // message = hasattr(val, 'message') and val.message
        // if message
        //     g.es_print(message)
        // if val is None
        //     return
        // lines = g.splitLines(body)
        // n = val.lineno
        // offset = val.offset or 0
        // if n is None
        //     return
        // i = val.lineno - 1
        // for j in range(max(0, i - 2), min(i + 2, len(lines) - 1))
        //     line = lines[j].rstrip()
        //     if j == i
        //         unl = p.get_UNL()
        //         g.es_print(f"{j+1:5}:* {line}", nodeLink=f"{unl}::-{j+1}")  // Global line.
        //         g.es_print(' ' * (7 + offset) + '^')
        //     else
        //         g.es_print(f"{j+1:5}: {line}")
    }
    //@+node:felix.20230415162517.69: *6* at.runFlake8
    /**
     * Run flake8 on the selected node.
     */
    public runFlake8(root: Position): boolean {
        console.log('TODO : runFlake8');

        return true;
        // try
        //     from leo.commands import checkerCommands
        //     if checkerCommands.flake8:
        //         x = checkerCommands.Flake8Command(self.c)
        //         x.run(root)
        //         return true;
        //     return true;  // Suppress error if pyflakes can not be imported.
        // catch (exception)
        //     g.es_exception(exception)
        //     return true;  // Pretend all is well
    }
    //@+node:felix.20230415162517.70: *6* at.runPyflakes
    /**
     * Run pyflakes on the selected node.
     */
    public runPyflakes(root: Position): boolean {
        console.log('TODO : runPyflakes');
        return true;

        // try
        //     from leo.commands import checkerCommands
        //     if checkerCommands.pyflakes:
        //         x = checkerCommands.PyflakesCommand(self.c)
        //         ok = x.run(root)
        //         return ok
        //     return True  // Suppress error if pyflakes can not be imported.
        // catch (exception)
        //     g.es_exception(exception)
        //     return true;  // Pretend all is well
    }
    //@+node:felix.20230415162517.71: *5* at.directiveKind4 (write logic)
    /**
     * Return the kind of at-directive or noDirective.
     *
     * Potential simplifications:
     * - Using strings instead of constants.
     * - Using additional regex's to recognize directives.
     */
    public directiveKind4(s: string, i: number): number {
        // These patterns exclude constructs such as @encoding.setter or @encoding(whatever)
        // However, they must allow @language python, @nocolor-node, etc.

        const at_directive_kind_pattern = /\s*@([\w-]+)\s*/;

        const at = this;
        const n = s.length;
        let j;
        if (i >= n || s[i] !== '@') {
            j = g.skip_ws(s, i);
            if (g.match_word(s, j, '@others')) {
                return AtFile.othersDirective;
            }
            if (g.match_word(s, j, '@all')) {
                return AtFile.allDirective;
            }
            return AtFile.noDirective;
        }
        const table: [string, number][] = [
            ['@all', AtFile.allDirective],
            ['@c', AtFile.cDirective],
            ['@code', AtFile.codeDirective],
            ['@doc', AtFile.docDirective],
            ['@others', AtFile.othersDirective],
            ['@verbatim', AtFile.startVerbatim],
        ];

        // ("@end_raw", at.endRawDirective),  // #2276.
        // ("@raw", at.rawDirective),  // #2276
        // Rewritten 6/8/2005.
        if (i + 1 >= n || [' ', '\t', '\n'].includes(s[i + 1])) {
            // Bare '@' not recognized in cweb mode.
            return at.language === 'cweb'
                ? AtFile.noDirective
                : AtFile.atDirective;
        }
        if (!s[i + 1].match(/[a-zA-Z]/)) {
            return AtFile.noDirective; // Bug fix: do NOT return miscDirective here!
        }
        if (at.language === 'cweb' && g.match_word(s, i, '@c')) {
            return AtFile.noDirective;
        }
        // When the language is elixir, @doc followed by a space and string delimiter
        // needs to be treated as plain text; the following does not enforce the
        // 'string delimiter' part of that.  An @doc followed by something other than
        // a space will fall through to usual Leo @doc processing.
        if (at.language === 'elixir' && g.match_word(s, i, '@doc ')) {
            return AtFile.noDirective;
        }
        for (let [name, directive] of table) {
            if (g.match_word(s, i, name)) {
                return directive;
            }
        }
        // Support for add_directives plugin.
        // Use regex to properly distinguish between Leo directives
        // and python decorators.
        const s2 = s.substring(i);
        const m = at_directive_kind_pattern.exec(s2);
        let w_group1EndIndex: number;
        if (m && m.length) {
            const word = m[1];
            w_group1EndIndex = m.index + word.length + 1;
            if (!g.globalDirectiveList.includes(word)) {
                return AtFile.noDirective;
            }
            const s3 = s2.substring(w_group1EndIndex);
            if (s3 && '.('.includes(s3[0])) {
                return AtFile.noDirective;
            }
            return AtFile.miscDirective;
        }
        // An unusual case.
        return AtFile.noDirective; // pragma: no cover
    }
    //@+node:felix.20230415162517.72: *5* at.isSectionName
    /**
     * returns (flag, end). end is the index of the character after the section name.
     */
    public isSectionName(s: string, i: number): [boolean, number] {
        const at = this;
        // Allow leading periods.
        while (i < s.length && s[i] === '.') {
            i += 1;
        }
        if (!g.match(s, i, at.section_delim1)) {
            return [false, -1];
        }
        i = g.find_on_line(s, i, at.section_delim2);
        if (i > -1) {
            return [true, i + at.section_delim2.length];
        }
        return [false, -1];
    }
    //@+node:felix.20230415162517.73: *5* at.isWritable
    /**
     * Return True if the path is writable.
     */
    public isWritable(path: any): boolean {
        return true;

        // TODO : ? NOT USED IN LEO'S CODEBASE
        // try
        //     // os.access() may not exist on all platforms.
        //     ok = os.access(path, os.W_OK)
        // catch AttributeError
        //     return true;
        // if !ok
        //     g.es('read only:', repr(path), color='red')
        // return ok
    }
    //@+node:felix.20230415162517.74: *5* at.os and allies
    //@+node:felix.20230415162517.75: *6* at.oblank, oblanks & otabs
    public oblank(): void {
        this.os(' ');
    }
    public oblanks(n: number): void {
        this.os(' '.repeat(Math.abs(n)));
    }
    public otabs(n: number): void {
        this.os('\t'.repeat(Math.abs(n)));
    }
    //@+node:felix.20230415162517.76: *6* at.onl & onl_sent
    /**
     * Write a newline to the output stream.
     */
    public onl(): void {
        this.os('\n'); // **not** this.output_newline
    }
    /**
     * Write a newline to the output stream, provided we are outputting sentinels.
     */
    public onl_sent(): void {
        if (this.sentinels) {
            this.onl();
        }
    }
    //@+node:felix.20230415162517.77: *6* at.os
    /**
     * Append a string to at.outputList.
     *
     * All output produced by leoAtFile module goes here.
     */
    public os(s: string): void {
        const at = this;
        s = g.toUnicode(s, at.encoding);
        at.outputList.push(s);
    }
    //@+node:felix.20230415162517.78: *5* at.outputStringWithLineEndings
    /**
     * Write the string s as-is except that we replace '\n' with the proper line ending.
     *
     * Calling self.onl() runs afoul of queued newlines.
     */
    public outputStringWithLineEndings(s: string): void {
        const at = this;
        s = g.toUnicode(s, at.encoding);
        s = s.replace('\n', at.output_newline!);
        this.os(s);
    }
    //@+node:felix.20230415162517.79: *5* at.precheck (calls shouldPrompt...)
    /**
     * Check whether a dirty, potentially dangerous, file should be written.
     *
     * Return True if so.  Return False *and* issue a warning otherwise.
     */
    public async precheck(fileName: string, root: Position): Promise<boolean> {
        const at = this;
        //
        // #1450: First, check that the directory exists.
        const theDir = g.os_path_dirname(fileName);
        const w_exists = await g.os_path_exists(theDir);
        if (theDir && !w_exists) {
            at.error(`Directory not found:\n${theDir}`);
            return false;
        }
        //
        // Now check the file.
        const shouldPrompt = await at.shouldPromptForDangerousWrite(
            fileName,
            root
        );
        if (!shouldPrompt) {
            // Fix bug 889175: Remember the full fileName.
            at.rememberReadPath(fileName, root);
            return true;
        }
        //
        // Prompt if the write would overwrite the existing file.
        const ok = await this.promptForDangerousWrite(fileName);
        if (ok) {
            // Fix bug 889175: Remember the full fileName.
            at.rememberReadPath(fileName, root);
            return true;
        }
        //
        // Fix #1031: do not add @ignore here!
        g.es('not written:', fileName);
        return false;
    }
    //@+node:felix.20230415162517.80: *5* at.putAtFirstLines
    /**
     * Write any @firstlines from string s.
     * These lines are converted to @verbatim lines,
     * so the read logic simply ignores lines preceding the @+leo sentinel.
     */
    public putAtFirstLines(s: string): void {
        const at = this;
        const tag = '@first';
        let i = 0;
        while (g.match(s, i, tag)) {
            i += tag.length;
            i = g.skip_ws(s, i);
            const j = i;
            i = g.skip_to_end_of_line(s, i);
            // Write @first line, whether empty or not
            const line = s.substring(j, i);
            at.os(line);
            at.onl();
            i = g.skip_nl(s, i);
        }
    }
    //@+node:felix.20230415162517.81: *5* at.putAtLastLines
    /**
     * Write any @last lines from string s.
     * These lines are converted to @verbatim lines,
     * so the read logic simply ignores lines following the @-leo sentinel.
     */
    public putAtLastLines(s: string): void {
        const at = this;
        const tag = '@last';
        // Use g.splitLines to preserve trailing newlines.
        const lines = g.splitLines(s);
        const n = lines.length;
        let j = n - 1;
        const k = j;
        // Scan backwards for @last directives.
        while (j >= 0) {
            const line = lines[j];
            if (g.match(line, 0, tag)) {
                j -= 1;
            } else if (!line.trim()) {
                j -= 1;
            } else {
                break;
            }
        }
        // Write the @last lines.
        for (const line of lines.slice(j + 1, k + 1)) {
            if (g.match(line, 0, tag)) {
                let i = tag.length;
                i = g.skip_ws(line, i);
                at.os(line.substring(i));
            }
        }
    }
    //@+node:felix.20230415162517.82: *5* at.putDirective & helper
    /**
     * Output a sentinel a directive or reference s.
     *
     * It is important for PHP and other situations that \@first and \@last
     * directives get translated to verbatim lines that do *not* include what
     * follows the @first & @last directives.
     */
    public putDirective(s: string, i: number, p: Position): number {
        const at = this;
        const k = i;
        const j = g.skip_to_end_of_line(s, i);
        const directive = s.substring(i, j);
        if (g.match_word(s, k, '@delims')) {
            at.putDelims(directive, s, k);
        } else if (g.match_word(s, k, '@language')) {
            this.putSentinel('@' + directive);
        } else if (g.match_word(s, k, '@comment')) {
            this.putSentinel('@' + directive);
        } else if (g.match_word(s, k, '@last')) {
            // #1307.
            if (p.isAtCleanNode()) {
                at.error(`ignoring @last directive in ${p.h}`);
                g.es_print('@last is not valid in @clean nodes');
                // #1297.
            } else if (g.app.inScript || g.unitTesting || p.isAnyAtFileNode()) {
                // Convert to an verbatim line _without_ anything else.
                this.putSentinel('@@last');
            } else {
                at.error(`ignoring @last directive in ${p.h}`);
            }
        } else if (g.match_word(s, k, '@first')) {
            // #1307.
            if (p.isAtCleanNode()) {
                at.error(`ignoring @first directive in ${p.h}`);
                g.es_print('@first is not valid in @clean nodes');
                // #1297.
            } else if (g.app.inScript || g.unitTesting || p.isAnyAtFileNode()) {
                // Convert to an verbatim line _without_ anything else.
                this.putSentinel('@@first');
            } else {
                at.error(`ignoring @first directive in ${p.h}`);
            }
        } else {
            this.putSentinel('@' + directive);
        }
        i = g.skip_line(s, k);
        return i;
    }
    //@+node:felix.20230415162517.83: *6* at.putDelims
    /**
     * Put an @delims directive.
     */
    public putDelims(directive: string, s: string, k: number): void {
        const at = this;
        // Put a space to protect the last delim.
        at.putSentinel(directive + ' '); // 10/23/02: put @delims, not @@delims
        // Skip the keyword and whitespace.
        let j = g.skip_ws(s, k + '@delims'.length);
        let i = j;
        // Get the first delim.
        while (i < s.length && !g.is_ws(s[i]) && !g.is_nl(s, i)) {
            i += 1;
        }
        if (j < i) {
            at.startSentinelComment = s.substring(j, i);
            // Get the optional second delim.
            j = g.skip_ws(s, i);
            i = j;
            while (i < s.length && !g.is_ws(s[i]) && !g.is_nl(s, i)) {
                i += 1;
            }
            at.endSentinelComment = j < i ? s.substring(j, i) : '';
        } else {
            at.writeError('Bad @delims directive');
        }
    }
    //@+node:felix.20230415162517.84: *5* at.putIndent
    /**
     * Put tabs and spaces corresponding to n spaces,
     * assuming that we are at the start of a line.
     */
    public putIndent(n: number, s = ''): void {
        if (n > 0) {
            const w = this.tab_width!;
            if (w > 1) {
                let [q, r] = g.divmod(n, w);
                this.otabs(q);
                this.oblanks(r);
            } else {
                this.oblanks(n);
            }
        }
    }
    //@+node:felix.20230415162517.85: *5* at.putInitialComment
    public putInitialComment(): void {
        const c = this.c;
        const s2 = c.config.getString('output-initial-comment') || '';
        if (s2.trim()) {
            const lines = s2.split('\\n');
            for (let line of lines) {
                line = line.replace(
                    '@date',
                    dayjs(new Date()).format('ddd MMM DD HH:mm:ss YYYY')
                );
                if (line) {
                    this.putSentinel('@comment ' + line);
                }
            }
        }
    }
    //@+node:felix.20230415162517.86: *5* at.replaceFile & helpers
    /**
     * Write or create the given file from the contents.
     * Return True if the original file was changed.
     */
    public async replaceFile(
        contents: string,
        encoding: BufferEncoding,
        fileName: string,
        root: Position,
        ignoreBlankLines = false
    ): Promise<boolean> {
        const at = this;
        const c = this.c;
        if (root && root.__bool__()) {
            root.clearDirty();
        }
        //
        // Create the timestamp (only for messages).
        let timestamp;
        if (c.config.getBool('log-show-save-time', false)) {
            const format =
                c.config.getString('log-timestamp-format') || 'HH:mm:ss';
            timestamp = dayjs(new Date()).format(format) + ' ';
        } else {
            timestamp = '';
        }
        //
        // Adjust the contents.
        g.assert(typeof contents === 'string');
        if (at.output_newline !== '\n') {
            contents = contents
                .replace(/\r/g, '')
                .replace(/\n/g, at.output_newline!);
        }
        //
        // If file does not exist, create it from the contents.
        fileName = g.os_path_realpath(fileName);
        let ok;
        const sfn = g.shortFileName(fileName);
        const w_exists = await g.os_path_exists(fileName);
        if (!w_exists) {
            ok = await g.writeFile(contents, encoding, fileName);
            if (ok) {
                await c.setFileTimeStamp(fileName);
                if (!g.unitTesting) {
                    g.es(`${timestamp}created: ${fileName}`);
                }
                if (root && root.__bool__()) {
                    // Fix bug 889175: Remember the full fileName.
                    at.rememberReadPath(fileName, root);
                    at.checkPythonCode(contents, fileName, root);
                }
            } else {
                at.addToOrphanList(root);
            }
            // No original file to change. Return value tested by a unit test.
            return false; // No change to original file.
        }
        //
        // Compare the old and new contents.
        let old_contents = await g.readFileIntoUnicodeString(
            fileName,
            at.encoding,
            true
        );
        if (!old_contents) {
            old_contents = '';
        }
        const unchanged =
            contents === old_contents ||
            (!at.explicitLineEnding &&
                at.compareIgnoringLineEndings(old_contents, contents)) ||
            (ignoreBlankLines &&
                at.compareIgnoringBlankLines(old_contents, contents));

        if (unchanged) {
            at.unchangedFiles += 1;
            if (
                !g.unitTesting &&
                c.config.getBool('report-unchanged-files', true)
            ) {
                g.es(`${timestamp}unchanged: ${sfn}`);
            }
            // Check unchanged files.
            at.checkUnchangedFiles(contents, fileName, root);
            return false; // No change to original file.
        }
        //
        // Warn if we are only adjusting the line endings.
        if (at.explicitLineEnding) {
            ok =
                at.compareIgnoringLineEndings(old_contents, contents) ||
                (ignoreBlankLines &&
                    at.compareIgnoringLineEndings(old_contents, contents));
            if (!ok) {
                g.warning('correcting line endings in:', fileName);
            }
        }
        //
        // Write a changed file.
        ok = await g.writeFile(contents, encoding, fileName);
        if (ok) {
            await c.setFileTimeStamp(fileName);
            if (!g.unitTesting) {
                g.es(`${timestamp}wrote: ${sfn}`);
            }
        } else {
            g.error('error writing', sfn);
            g.es('not written:', sfn);
            at.addToOrphanList(root);
        }
        // Check *after* writing the file.
        at.checkPythonCode(contents, fileName, root);
        return ok;
    }
    //@+node:felix.20230415162517.87: *6* at.compareIgnoringBlankLines
    /**
     * Compare two strings, ignoring blank lines.
     */
    public compareIgnoringBlankLines(s1: any, s2: any): boolean {
        g.assert(typeof s1 === 'string');
        g.assert(typeof s2 === 'string');
        if (s1 === s2) {
            return true;
        }
        s1 = g.removeBlankLines(s1);
        s2 = g.removeBlankLines(s2);
        return s1 === s2;
    }
    //@+node:felix.20230415162517.88: *6* at.compareIgnoringLineEndings
    /**
     * Compare two strings, ignoring line endings.
     */
    public compareIgnoringLineEndings(s1: any, s2: any): boolean {
        g.assert(typeof s1 === 'string');
        g.assert(typeof s2 === 'string');
        if (s1 === s2) {
            return true;
        }
        // Wrong: equivalent to ignoreBlankLines!
        // s1 = s1.replace('\n','').replace('\r','')
        // s2 = s2.replace('\n','').replace('\r','')
        s1 = s1.replace(/\r/g, '');
        s2 = s2.replace(/\r/g, '');
        return s1 === s2;
    }
    //@+node:felix.20230415162517.89: *5* at.scanRootForSectionDelims
    /**
     * Scan root.b for an "@section-delims" directive.
     * Set section_delim1 and section_delim2 ivars.
     */
    public scanRootForSectionDelims(root: Position): void {
        const at = this;
        // Set defaults.
        at.section_delim1 = '<<';
        at.section_delim2 = '>>';
        // Scan root.b.
        const lines = [];
        for (const s of g.splitLines(root.b)) {
            const m = g.g_section_delims_pat.exec(s);
            if (m && m.length) {
                lines.push(s);
                at.section_delim1 = m[1];
                at.section_delim2 = m[2];
            }
        }
        // Disallow multiple directives.
        if (lines.length > 1) {
            at.error(`Multiple @section-delims directives in ${root.h}`);
            g.es_print('using default delims');
            at.section_delim1 = '<<';
            at.section_delim2 = '>>';
        }
    }
    //@+node:felix.20230415162517.90: *5* at.tabNannyNode
    public tabNannyNode(p: Position, body: string): void {
        // TODO
        console.log('TODO : tabNannyNode');

        // try
        //     readline = g.ReadLinesClass(body).next
        //     tabnanny.process_tokens(tokenize.generate_tokens(readline))
        // catch IndentationError
        //     if g.unitTesting
        //         raise
        //     junk2, msg, junk = sys.exc_info()
        //     g.error("IndentationError in", p.h)
        //     g.es('', str(msg))
        // catch tokenize.TokenError
        //     if g.unitTesting:
        //         raise
        //     junk3, msg, junk = sys.exc_info()
        //     g.error("TokenError in", p.h)
        //     g.es('', str(msg))
        // catch tabnanny.NannyNag
        //     if g.unitTesting:
        //         raise
        //     junk4, nag, junk = sys.exc_info()
        //     badline = nag.get_lineno()
        //     line = nag.get_line()
        //     message = nag.get_msg()
        //     g.error("indentation error in", p.h, "line", badline)
        //     g.es(message)
        //     line2 = repr(str(line))[1:-1]
        //     g.es("offending line:\n", line2)
        // catch e
        //     g.trace("unexpected exception")
        //     g.es_exception(e)
        //     raise
    }
    //@+node:felix.20230415162517.91: *5* at.warnAboutOrpanAndIgnoredNodes
    /**
     * Called from putFile.
     * Always warn, even when language=="cweb"
     */
    public warnAboutOrphandAndIgnoredNodes(): void {
        const at = this;
        const root = this.root!;
        if (at.errors) {
            return; // No need to repeat this.
        }
        for (const p of root.self_and_subtree(false)) {
            if (!p.v.isVisited()) {
                at.writeError('Orphan node:  ' + p.h);
                if (p.hasParent()) {
                    g.blue('parent node:', p.parent().h);
                }
            }
        }
        const p = root.copy();
        const after = p.nodeAfterTree();
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.isAtAllNode()) {
                p.moveToNodeAfterTree();
            } else {
                // #1050: test orphan bit.
                if (p.isOrphan()) {
                    at.writeError('Orphan node: ' + p.h);
                    if (p.hasParent()) {
                        g.blue('parent node:', p.parent().h);
                    }
                }
                p.moveToThreadNext();
            }
        }
    }
    //@+node:felix.20230415162517.92: *5* at.writeError
    /**
     * Issue an error while writing an @<file> node.
     */
    public writeError(message: string): void {
        const at = this;
        if (at.errors === 0) {
            const fn = at.targetFileName || 'unnamed file';
            g.es_error(`errors writing: ${fn}`);
        }
        at.error(message);
        at.addToOrphanList(at.root!);
    }
    //@+node:felix.20230415162517.93: *5* at.writeException
    public async writeException(
        e: any,
        fileName: string,
        root: Position
    ): Promise<void> {
        const at = this;
        g.error('exception writing:', fileName);
        g.es_exception(e);
        if (at.outputFile) {
            // at.outputFile.flush();
            // at.outputFile.close();
            at.outputFile = '';
        }
        await at.remove(fileName);
        at.addToOrphanList(root);
    }
    //@+node:felix.20230415162522.1: *3* at.Utilities
    //@+node:felix.20230416214203.1: *4* at.error & printError
    public error(...args: any): void {
        const at = this;
        at.printError(...args);
        at.errors += 1;
    }
    /**
     * Print an error message that may contain non-ascii characters.
     */
    public printError(...args: any): void {
        const at = this;
        if (at.errors) {
            g.error(...args);
        } else {
            g.warning(...args);
        }
    }
    //@+node:felix.20230415162522.3: *4* at.exception
    public exception(e: any, message: string): void {
        this.error(message);
        g.es_exception(e);
    }
    //@+node:felix.20230415162522.4: *4* at.file operations...
    // Error checking versions of corresponding functions in Python's os module.
    //@+node:felix.20230415162522.5: *5* at.chmod
    public chmod(fileName: string, mode: any): void {
        // Do _not_ call self.error here.
        if (mode === undefined || mode === null) {
            return;
        }
        try {
            // TODO !
            // os.chmod(fileName, mode);
            console.log('TODO : leoAtfile.ts -> chmod');
        } catch (exception) {
            g.es('exception in os.chmod', fileName);
            g.es_exception(exception);
        }
    }
    //@+node:felix.20230415162522.6: *5* at.remove
    public async remove(fileName: string): Promise<boolean> {
        if (!fileName) {
            g.trace('No file name', g.callers());
            return false;
        }
        try {
            // os.remove(fileName);
            const w_uri = g.makeVscodeUri(fileName);
            await vscode.workspace.fs.delete(w_uri, { recursive: true });
            return true;
        } catch (exception) {
            if (!g.unitTesting) {
                this.error(`exception removing: ${fileName}`);
                g.es_exception(exception);
            }
            return false;
        }
    }
    //@+node:felix.20230415162522.7: *5* at.stat
    /**
     * Return the access mode of named file, removing any setuid, setgid, and sticky bits.
     */
    public async stat(
        fileName: string
    ): Promise<vscode.FilePermission | undefined> {
        // Do _not_ call self.error here.
        let mode;
        try {
            const w_uri = g.makeVscodeUri(fileName);
            const stat = await vscode.workspace.fs.stat(w_uri);
            mode = stat.permissions; // 0777
        } catch (exception) {
            mode = undefined;
        }
        return mode;
    }
    //@+node:felix.20230415162522.8: *4* at.get/setPathUa
    public getPathUa(p: Position): string {
        if (p.v.tempAttributes) {
            const d = p.v.tempAttributes['read-path'] || {};
            return d['path'];
        }
        return '';
    }

    public setPathUa(p: Position, path: any): void {
        if (!p.v.tempAttributes) {
            p.v.tempAttributes = {};
        }
        const d = p.v.tempAttributes['read-path'] || {};
        d['path'] = path;
        p.v.tempAttributes['read-path'] = d;
    }
    //@+node:felix.20230415162522.9: *4* at.promptForDangerousWrite
    /**
     * Raise a dialog asking the user whether to overwrite an existing file.
     */
    public async promptForDangerousWrite(
        fileName = '',
        message?: string
    ): Promise<boolean> {
        const at = this;
        const c = this.c;
        const root = this.root;
        if (at.cancelFlag) {
            g.assert(at.canCancelFlag);
            return false;
        }
        if (at.yesToAll) {
            g.assert(at.canCancelFlag);
            return true;
        }
        if (root && root.__bool__() && root.h.startsWith('@auto-rst')) {
            // Fix bug 50: body text lost switching @file to @auto-rst
            // Refuse to convert any @<file> node to @auto-rst.
            let d;
            if (root.v.at_read) {
                d = root.v.at_read;
            } else {
                d = {};
            }
            // d = root.v.at_read if hasattr(root.v, 'at_read') else {};
            const w_array = d[fileName] || [];
            const aList = w_array.sort();
            for (const h of aList) {
                if (!h.startsWith('@auto-rst')) {
                    g.es('can not convert @file to @auto-rst!');
                    g.es('reverting to:', h);
                    root.h = h;
                    c.redraw();
                    return false;
                }
            }
        }
        if (message === undefined) {
            message =
                `${g.splitLongFileName(fileName)}\n` +
                `${'already exists.'}\n` +
                `${'Overwrite this file?'}`;
        }
        // ! TODO : look in async of leointeg for multi button modal dialog
        const result = await g.app.gui.runAskYesNoCancelDialog(
            c,
            'Overwrite existing file?',
            message,
            undefined,
            undefined,
            'Yes To All',
            undefined,
            'No To All'
            // order of those params:
            //    c: Commands,
            //    title: string,
            //    message: string,
            //    yesMessage = "Yes",
            //    noMessage = "No",
            //    yesToAllMessage = "",
            //    defaultButton = "Yes",
            //    cancelMessage = ""
        );
        if (at.canCancelFlag) {
            // We are in the writeAll logic so these flags can be set.
            if (result === 'cancel') {
                at.cancelFlag = true;
            } else if (result === 'yes-to-all') {
                at.yesToAll = true;
            }
        }
        return ['yes', 'yes-to-all'].includes(result);
    }
    //@+node:felix.20230415162522.10: *4* at.rememberReadPath
    /**
     * Remember the files that have been read *and*
     * the full headline (@<file> type) that caused the read.
     */
    public rememberReadPath(fn: string, p: Position): void {
        const v = p.v;
        // Fix bug #50: body text lost switching @file to @auto-rst
        if (!v.at_read) {
            v.at_read = {};
        }
        const d = v.at_read;
        const aSet = d[fn] || [];
        if (!aSet.includes(p.h)) {
            aSet.push(p.h);
        }
        d[fn] = aSet;
    }

    //@+node:felix.20230415162522.11: *4* at.scanAllDirectives
    /**
     * Scan p and p's ancestors looking for directives,
     * setting corresponding AtFile ivars.
     */
    public scanAllDirectives(p: Position): { [key: string]: any } {
        const at = this;
        const c = this.c;
        const d = c.scanAllDirectives(p);
        //
        // Language & delims: Tricky.
        const lang_dict = d['lang-dict'] || {};
        let delims;
        let language;
        if (lang_dict) {
            // There was an @delims or @language directive.
            language = lang_dict['language'];
            delims = lang_dict['delims'];
        }
        if (!language) {
            // No language directive.  Look for @<file> nodes.
            // Do *not* use d.get('language')!
            //
            // TODO : DEFAULT TO JS OR TS !
            //
            language = g.getLanguageFromAncestorAtFileNode(p) || 'python';
        }
        at.language = language;
        if (!delims) {
            delims = g.set_delims_from_language(language);
        }
        //
        // Previously, setting delims was sometimes skipped, depending on kwargs.
        //@+<< Set comment strings from delims >>
        //@+node:felix.20230415162522.12: *5* << Set comment strings from delims >> (at.scanAllDirectives)
        let [delim1, delim2, delim3] = delims;
        // Use single-line comments if we have a choice.
        // delim1,delim2,delim3 now correspond to line,start,end
        if (delim1) {
            at.startSentinelComment = delim1;
            at.endSentinelComment = ''; // Must not be None.
        } else if (delim2 && delim3) {
            at.startSentinelComment = delim2;
            at.endSentinelComment = delim3;
        } else {
            //
            // Emergency!
            //
            // Issue an error only if at.language has been set.
            // This suppresses a message from the markdown importer.
            if (!g.unitTesting && at.language) {
                g.trace(at.language, g.callers());
                g.es_print(`unknown language: ${at.language}`);
                g.es_print('using Python comment delimiters');
            }
            at.startSentinelComment = '#'; // This should never happen!
            at.endSentinelComment = '';
        }
        //@-<< Set comment strings from delims >>
        //
        // Easy cases
        at.encoding = d['encoding'] || c.config.default_derived_file_encoding;
        const lineending = d['lineending'];
        at.explicitLineEnding = !!lineending;
        at.output_newline = lineending || g.getOutputNewline(c);
        at.page_width = d['pagewidth'] || c.page_width;
        at.tab_width = d['tabwidth'] || c.tab_width;
        return {
            encoding: at.encoding,
            language: at.language,
            lineending: at.output_newline,
            pagewidth: at.page_width,
            path: d['path'],
            tabwidth: at.tab_width,
        };
    }
    //@+node:felix.20230415162522.13: *4* at.shouldPromptForDangerousWrite
    /**
     * Return True if Leo should warn the user that p is an @<file> node that
     * was not read during startup. Writing that file might cause data loss.
     *
     * See #50: https://github.com/leo-editor/leo-editor/issues/50
     */
    public async shouldPromptForDangerousWrite(
        fn: string,
        p: Position
    ): Promise<boolean> {
        const trace = g.app.debug.includes('save');
        const sfn = g.shortFileName(fn);
        const c = this.c;
        const efc = g.app.externalFilesController;
        if (p.isAtNoSentFileNode()) {
            // No danger of overwriting a file: It was never read.
            return false;
        }

        const w_exists = await g.os_path_exists(fn);
        if (!w_exists) {
            // No danger of overwriting fn.
            return false;
        }


        // Prompt if the external file is newer.
        // if (efc) {
        //     // Like c.checkFileTimeStamp.
        //     if (c.sqlite_connection && c.mFileName === fn) {
        //         // sqlite database file is never actually overwritten by Leo,
        //         // so do *not* check its timestamp.
        //         //pass
        //     } else if (await efc.has_changed(fn)) {
        //         return true;
        //     }
        // }

        // ! TEMP FIX UNTIL https://github.com/leo-editor/leo-editor/pull/3554 IS READY
        if (efc) {

            if (await efc.has_changed(fn)) {
                return true; // has_changed handles all special cases.
            }
        }

        if (p.v.at_read) {
            // Fix bug #50: body text lost switching @file to @auto-rst
            const d = p.v.at_read;
            for (const k in d) {
                // * LOOP 'IN' TO GET THE KEYS
                // Make sure k still exists.
                const w_exists = await g.os_path_exists(k);
                const w_same = await g.os_path_samefile(k, fn);
                const w_k = d[k] || [];
                if (w_exists && w_same && w_k.includes(p.h)) {
                    d[fn] = d[k];
                    return false;
                }
            }
            const aSet = d[fn] || [];
            return !aSet.includes(p.h);
        }
        return true; // The file was never read.
    }
    //@+node:felix.20230415162522.14: *4* at.warnOnReadOnlyFile
    public async warnOnReadOnlyFile(fn: string): Promise<void> {
        // os.access() may not exist on all platforms.
        let read_only;
        try {
            const w_uri = g.makeVscodeUri(fn);
            const w_stats = await vscode.workspace.fs.stat(w_uri);
            read_only = w_stats.permissions === vscode.FilePermission.Readonly;
        } catch (attributeError) {
            read_only = false;
        }
        if (read_only) {
            g.error('read only:', fn);
        }
    }
    //@-others
}
//@+node:felix.20211225222141.1: ** class FastAtRead
/**
 * Read an external file, created from an @file tree.
 * This is Vitalije's code, edited by EKR.
 */
export class FastAtRead {
    public c: Commands;
    public gnx2vnode: { [key: string]: VNode }; // The global fc.gnxDict. Keys are gnx's, values are vnodes.
    public path: string | undefined;
    public root: Position | undefined;
    // compiled patterns...
    public after_pat: RegExp | undefined;
    public all_pat: RegExp | undefined;
    public code_pat: RegExp | undefined;
    public comment_pat: RegExp | undefined;
    public delims_pat: RegExp | undefined;
    public doc_pat: RegExp | undefined;
    public first_pat: RegExp | undefined;
    public last_pat: RegExp | undefined;
    public node_start_pat: RegExp | undefined;
    public others_pat: RegExp | undefined;
    public ref_pat: RegExp | undefined;
    public section_delims_pat: RegExp | undefined;

    public header_pattern = new RegExp(
        String.raw`^(.+)@\+leo(-ver=(\d+))?(-thin)?(-encoding=(.*)(\.))?(.*)$`,
        'm'
    );

    //@+others
    //@+node:felix.20230413222859.2: *3* fast_at.__init__
    constructor(c: Commands, gnx2vnode: { [key: string]: VNode }) {
        this.c = c;
        g.assert(gnx2vnode);
        this.gnx2vnode = gnx2vnode; // The global fc.gnxDict. Keys are gnx's, values are vnodes.
        this.path = undefined;
        this.root = undefined;
        // compiled patterns...
        this.after_pat = undefined;
        this.all_pat = undefined;
        this.code_pat = undefined;
        this.comment_pat = undefined;
        this.delims_pat = undefined;
        this.doc_pat = undefined;
        this.first_pat = undefined;
        this.last_pat = undefined;
        this.node_start_pat = undefined;
        this.others_pat = undefined;
        this.ref_pat = undefined;
        this.section_delims_pat = undefined;
    }
    //@+node:felix.20230413222859.3: *3* fast_at.get_patterns
    /**
     * Create regex patterns for the given comment delims.
     */
    public get_patterns(comment_delims: [string, string | undefined]): void {
        // This must be a function, because of @comments & @delims.
        let [comment_delim_start, comment_delim_end] = comment_delims;
        comment_delim_end = comment_delim_end || '';

        // escapes any characters that have special meaning in regular expressions.
        const delim1 = comment_delim_start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');;
        const delim2 = comment_delim_end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');;

        const ref = g.angleBrackets('(.*)');

        // Equivalent of table loop assignments of original Leo. (Added 'm' flag for newlines at end of those lines)
        this.after_pat = new RegExp(
            String.raw`^\s*${delim1}@afterref${delim2}$`,
            'm'
        ); // @afterref
        this.all_pat = new RegExp(
            String.raw`^(\s*)${delim1}@(\+|-)all\b(.*)${delim2}$`,
            'm'
        ); // @all
        this.code_pat = new RegExp(
            String.raw`^\s*${delim1}@@c(ode)?${delim2}$`,
            'm'
        ); // @c and @code
        this.comment_pat = new RegExp(
            String.raw`^\s*${delim1}@@comment(.*)${delim2}`,
            'm'
        ); // @comment
        this.delims_pat = new RegExp(
            String.raw`^\s*${delim1}@delims(.*)${delim2}`,
            'm'
        ); // @delims
        this.doc_pat = new RegExp(
            String.raw`^\s*${delim1}@\+(at|doc)?(\s.*?)?${delim2}\n`,
            'm'
        ); // @doc or @
        this.first_pat = new RegExp(
            String.raw`^\s*${delim1}@@first${delim2}$`,
            'm'
        ); // @first
        this.last_pat = new RegExp(
            String.raw`^\s*${delim1}@@last${delim2}$`,
            'm'
        ); // @last
        this.node_start_pat = new RegExp(
            String.raw`^(\s*)${delim1}@\+node:([^:]+): \*(\d+)?(\*?) (.*)${delim2}$`,
            'm'
        ); // @node
        this.others_pat = new RegExp(
            String.raw`^(\s*)${delim1}@(\+|-)others\b(.*)${delim2}$`,
            'md'
        ); // @others
        this.ref_pat = new RegExp(
            String.raw`^(\s*)${delim1}@(\+|-)${ref}\s*${delim2}$`,
            'md'
        ); // section ref
        this.section_delims_pat = new RegExp(
            String.raw`^\s*${delim1}@@section-delims[ \t]+([^ \w\n\t]+)[ \t]+([^ \w\n\t]+)[ \t]*${delim2}$`,
            'm'
        ); // @section-delims
    }
    //@+node:felix.20230413222859.4: *3* fast_at.scan_header

    /**
     * Scan for the header line, which follows any @first lines.
     * Return (delims, first_lines, i+1) or None
     *
     * Important: delims[0] will end with a blank when reading a file with blackened sentinels!
     * This fact eliminates all special cases in scan_lines!
     */
    public scan_header(
        lines: string[]
    ): [[string, string | undefined], string[], number] | undefined {
        const first_lines: string[] = [];
        let i = 0;
        let delims: [string, string | undefined];
        for (const [i, line] of lines.entries()) {
            const m = this.header_pattern.exec(line);
            if (m && m.length) {
                delims = [m[1], m[8] || ''];
                return [delims, first_lines, i + 1];
            }
            first_lines.push(line);
        }
        return undefined;
    }
    //@+node:felix.20230413222859.5: *3* fast_at.scan_lines
    /**
     * Scan all lines of the file, creating vnodes.
     */
    public scan_lines(
        comment_delims: [string, string | undefined],
        first_lines: string[],
        lines: string[],
        path: string,
        start: number
    ): void {
        //@+<< init scan_lines >>
        //@+node:felix.20230413222859.6: *4* << init scan_lines >>
        //
        // Simple vars...
        let afterref = false; // True: the next line follows @afterref.
        let clone_v: VNode | undefined = undefined; // The root of the clone tree.
        // The start/end *comment* delims.
        // Important: scan_header ends comment_delim1 with a blank when using black sentinels.
        let comment_delim1, comment_delim2;
        [comment_delim1, comment_delim2] = comment_delims;
        let doc_skip = [comment_delim1 + '\n', comment_delim2 + '\n']; // To handle doc parts.
        let first_i = 0; // Index into first array.
        let in_doc = false; // True: in @doc parts.
        let is_cweb = comment_delim1 === '@q@' && comment_delim2 === '@>'; // True: cweb hack in effect.
        let indent = 0; // The current indentation.
        let level_stack: [VNode, VNode | undefined][] = [];
        let n_last_lines = 0; // The number of @@last directives seen.
        // #1065 so reads will not create spurious child nodes.
        let root_seen = false; // false: The next +@node sentinel denotes the root, regardless of gnx.
        let section_delim1 = '<<';
        let section_delim2 = '>>';
        let section_reference_seen = false;
        let sentinel = comment_delim1 + '@';
        // The stack is updated when at+others, at+<section>, or at+all is seen.
        const stack: [string, number, string[]][] = []; // Entries are (gnx, indent, body)
        const verbatim_line = comment_delim1 + '@verbatim' + comment_delim2;
        let verbatim = false; // True: the next line must be added without change.
        //
        // Init the parent vnode.
        //
        let gnx = this.root!.gnx;
        const context = this.c;
        let parent_v = this.root!.v;
        const root_v = parent_v; // Does not change.
        level_stack.push([root_v, undefined]);
        //
        // Init the gnx dict last.
        //
        let gnx2vnode = this.gnx2vnode; // Keys are gnx's, values are vnodes.
        const gnx2body: Record<string, string[]> = {}; // Keys are gnxs, values are list of body lines.
        gnx2vnode[gnx] = parent_v; // Add gnx to the keys
        // Add gnx to the keys.
        // Body is the list of lines presently being accumulated.
        gnx2body[gnx] = first_lines;
        let body = first_lines;
        let head: string = '';
        let level: number = 0;
        //
        // Set the patterns
        this.get_patterns(comment_delims);
        let m: RegExpExecArray | null;
        //@-<< init scan_lines >>
        let w_break = false;
        let i: number = 0;
        for (let [w_i, line] of lines.slice(start).entries()) {
            i = w_i;
            // Strip the line only once.
            let strip_line = line.trim();
            if (afterref) {
                //@+<< handle afterref line>>
                //@+node:felix.20230413222859.7: *4* << handle afterref line >>
                if (body && body.length) {
                    // a list of lines.
                    body[body.length - 1] =
                        body[body.length - 1].replace(/\s+$/, '') + line;
                } else {
                    body = [line];
                }
                afterref = false;
                //@-<< handle afterref line>>
                continue;
            }

            if (verbatim) {
                //@+<< handle verbatim line >>
                //@+node:felix.20230413222859.8: *4* << handle verbatim line >>
                // Previous line was verbatim *sentinel*. Append this line as it is.

                // 2022/12/02: Bug fix: adjust indentation.
                if (
                    indent &&
                    /^\s*$/.test(line.substring(0, indent)) &&
                    line.length > indent
                ) {
                    line = line.substring(indent);
                }
                body.push(line);
                verbatim = false;
                //@-<< handle verbatim line >>
                continue;
            }

            if (strip_line === verbatim_line) {
                // <delim>@verbatim
                verbatim = true;
                continue;
            }

            //@+<< finalize line >>
            //@+node:felix.20230413222859.9: *4* << finalize line >>
            // Undo the cweb hack.
            if (is_cweb && line.startsWith(sentinel)) {
                const w_ls = sentinel.length;
                line =
                    line.substring(0, w_ls) +
                    line.substring(w_ls).replace(/@@+/g, '@');
            }
            // Adjust indentation.
            if (
                indent &&
                /^\s*$/.test(line.substring(0, indent)) &&
                line.length > indent
            ) {
                line = line.substring(indent);
            }
            //@-<< finalize line >>
            if (!in_doc && !strip_line.startsWith(sentinel)) {
                // Faster than a regex!
                body.push(line);
                continue;
            }
            // These three sections might clear in_doc.
            //@+<< handle @others >>
            //@+node:felix.20230413222859.10: *4* << handle @others >>
            m = this.others_pat!.exec(line);
            if (m && m.length) {
                in_doc = false;
                if (m[2] === '+') {
                    // opening sentinel
                    body.push(`${m[1]}@others${m[3] || ''}\n`);
                    stack.push([gnx, indent, body]);
                    indent += (m as any).indices[1][1]; // adjust current indentation
                } else {
                    // closing sentinel.
                    // m[2] is '-' because the pattern matched.
                    try {
                        [gnx, indent, body] = stack.pop()!;
                    } catch (indexError) {
                        // #2624: This can happen during git-diff.
                        // pass
                    }
                }
                continue;
            }
            //@-<< handle @others >>
            //@+<< handle section refs >>
            //@+node:felix.20230413222859.11: *4* << handle section refs >>
            // Note: scan_header sets *comment* delims, not *section* delims.
            // This section coordinates with the section that handles @section-delims.
            m = this.ref_pat!.exec(line);
            if (m && m.length) {
                in_doc = false;
                if (m[2] === '+') {
                    // Any later @section-delims directive is a serious error.
                    // This kind of error should have been caught by Leo's atFile write logic.
                    section_reference_seen = true;
                    // open sentinel.
                    body.push(
                        m[1] + section_delim1 + m[3] + section_delim2 + '\n'
                    );
                    stack.push([gnx, indent, body]);
                    indent += (m as any).indices[1][1];
                } else if (stack && stack.length) {
                    // m[2] is '-' because the pattern matched.
                    [gnx, indent, body] = stack.pop()!; // #1232: Only if the stack exists.
                }
                continue; // 2021/10/29: *always* continue.
            }
            //@-<< handle section refs >>
            //@+<< handle node_start >>
            //@+node:felix.20230413222859.12: *4* << handle node_start >>
            m = this.node_start_pat!.exec(line);
            if (m && m.length) {
                in_doc = false;
                [gnx, head] = [m[2], m[5]];
                // m[3] is the level number, m[4] is the number of stars.
                level = m[3] ? Number(m[3]) : 1 + m[4].length;
                let v = gnx2vnode[gnx];
                // Case 1: The root @file node. Don't change the headline.
                //         #3931: Always use root_v, but use the gnx from external file!
                if (!root_seen) {
                    root_seen = true;
                    clone_v = undefined;
                    v = root_v;
                    if (root_v.gnx !== gnx) {
                        // Delete all traces of root_v.gnx.
                        if (gnx2body[root_v.gnx]) {
                            delete gnx2body[root_v.gnx];
                        }
                        if (gnx2vnode[root_v.gnx]) {
                            delete gnx2vnode[root_v.gnx];
                        }
                        // `refresh-from-disk` issues this messages, but 'git-diff' should not.
                        // g.trace(f"Changing gnx! old: {root_v.gnx} new: {gnx} in {head}")
                        root_v.fileIndex = gnx;
                    }
                    gnx2vnode[gnx] = root_v;
                    gnx2body[gnx] = body = [];
                    v.children = [];
                    continue;  // End of case 1.
                }
                //
                // Case 2: We are scanning the descendants of a clone.
                [parent_v, clone_v] = level_stack[level - 2];
                if (v && clone_v) {
                    // The last version of the body and headline wins..
                    body = [];
                    gnx2body[gnx] = body;
                    v._headString = head;
                    // Update the level_stack.
                    level_stack = level_stack.slice(0, level - 1);
                    level_stack.push([v, clone_v]);
                    // Always clear the children!
                    v.children = [];
                    parent_v.children.push(v);
                    continue;  // End of case 2.
                }

                // Case 3: we are not already scanning the descendants of a clone.
                if (v) {
                    // The *start* of a clone tree. Reset the children.
                    clone_v = v;
                    v.children = [];
                } else {
                    // Make a new vnode.
                    v = new VNode(context, gnx);
                }
                // The last version of the body and headline wins.
                gnx2vnode[gnx] = v;
                body = [];
                gnx2body[gnx] = body; // TODO : Check if this is ok - or should be new array instance too?
                v._headString = head;
                // Update the stack.
                level_stack = level_stack.slice(0, level - 1);
                level_stack.push([v, clone_v]);
                // Update the links.
                g.assert(v !== root_v);
                parent_v.children.push(v);
                v.parents.push(parent_v);
                continue;
            }
            //@-<< handle node_start >>
            if (in_doc) {
                //@+<< handle @c or @code >>
                //@+node:felix.20230413222859.13: *4* << handle @c or @code >>
                // When delim_end exists the doc block:
                // - begins with the opening delim, alone on its own line
                // - ends with the closing delim, alone on its own line.
                // Both of these lines should be skipped.
                //
                // #1496: Retire the @doc convention.
                //        An empty line is no longer a sentinel.
                if (comment_delim2 && doc_skip.includes(line)) {
                    // doc_skip is (comment_delim1 + '\n', delim_end + '\n')
                    continue;
                }
                //
                // Check for @c or @code.
                m = this.code_pat!.exec(line);
                if (m && m.length) {
                    in_doc = false;
                    body.push(m[1] ? '@code\n' : '@c\n');
                    continue;
                }
                //@-<< handle @c or @code >>
            } else {
                //@+<< handle @ or @doc >>
                //@+node:felix.20230413222859.14: *4* << handle @ or @doc >>
                m = this.doc_pat!.exec(line);
                if (m && m.length) {
                    //  @+at or @+doc?
                    const doc = m[1] === 'doc' ? '@doc' : '@';
                    const doc2 = m[2] || ''; //  Trailing text.
                    if (doc2) {
                        body.push(`${doc}${doc2}\n`);
                    } else {
                        body.push(doc + '\n');
                    }
                    //  Enter @doc mode.
                    in_doc = true;
                    continue;
                }
                //@-<< handle @ or @doc >>
            }
            if (line.startsWith(comment_delim1 + '@-leo')) {
                // Faster than a regex!
                // The @-leo sentinel adds *nothing* to the text.
                i += 1;
                w_break = true;
                break;
            }
            // Order doesn't matter.
            //@+<< handle @all >>
            //@+node:felix.20230413222859.15: *4* << handle @all >>
            m = this.all_pat!.exec(line);
            if (m && m.length) {
                // @all tells Leo's *write* code not to check for undefined sections.
                // Here, in the read code, we merely need to add it to the body.
                // Pushing and popping the stack may not be necessary, but it can't hurt.
                if (m[2] === '+') {
                    // opening sentinel
                    body.push(`${m[1]}@all${m[3] || ''}\n`);
                    stack.push([gnx, indent, body]);
                } else {
                    // closing sentinel.
                    // m[2] is '-' because the pattern matched.
                    [gnx, indent, body] = stack.pop()!;
                    gnx2body[gnx] = body;
                }
                continue;
            }
            //@-<< handle @all >>
            //@+<< handle afterref >>
            //@+node:felix.20230413222859.16: *4* << handle afterref >>
            m = this.after_pat!.exec(line);
            if (m && m.length) {
                afterref = true;
                continue;
            }
            //@-<< handle afterref >>
            //@+<< handle @first and @last >>
            //@+node:felix.20230413222859.17: *4* << handle @first and @last >>
            m = this.first_pat!.exec(line);
            if (m && m.length) {
                if (0 <= first_i && first_i < first_lines.length) {
                    body.push('@first ' + first_lines[first_i]);
                    first_i += 1;
                    continue;
                } else {
                    g.trace(`\ntoo many @first lines: ${path}`);
                    console.log(
                        '@first is valid only at the start of @<file> nodes\n'
                    );
                    g.printObj(first_lines, 'first_lines');
                    g.printObj(lines.slice(start, i + 2), 'lines[start:i+2]');
                    continue;
                }
            }
            m = this.last_pat!.exec(line);
            if (m && m.length) {
                // Just increment the count of the expected last lines.
                // We'll fill in the @last line directives after we see the @-leo directive.
                n_last_lines += 1;
                continue;
            }
            //@-<< handle @first and @last >>
            //@+<< handle @comment >>
            //@+node:felix.20230413222859.18: *4* << handle @comment >>
            //  https://leo-editor.github.io/leo-editor/directives.html#part-4-dangerous-directives
            m = this.comment_pat!.exec(line);
            if (m && m.length) {
                // <1, 2 or 3 comment delims>
                const delims = m[1].trim();
                // Whatever happens, retain the @delims line.
                body.push(`@comment ${delims}\n`);
                let [delim1, delim2, delim3] = g.set_delims_from_string(delims);
                // delim1 is always the single-line delimiter.
                if (delim1) {
                    [comment_delim1, comment_delim2] = [delim1, ''];
                } else {
                    [comment_delim1, comment_delim2] = [delim2, delim3];
                }
                //
                // Within these delimiters:
                // - double underscores represent a newline.
                // - underscores represent a significant space,
                comment_delim1 = comment_delim1!
                    .replace(/__/g, '\n')
                    .replace(/_/g, ' ');
                comment_delim2 = comment_delim2!
                    .replace(/__/g, '\n')
                    .replace(/_/g, ' ');
                // Recalculate all delim-related values
                doc_skip = [comment_delim1 + '\n', comment_delim2 + '\n'];
                is_cweb = comment_delim1 === '@q@' && comment_delim2 === '@>';
                sentinel = comment_delim1 + '@';
                //
                // Recalculate the patterns.
                comment_delims = [comment_delim1, comment_delim2];
                this.get_patterns(comment_delims);
                continue;
            }
            //@-<< handle @comment >>
            //@+<< handle @delims >>
            //@+node:felix.20230413222859.19: *4* << handle @delims >>
            m = this.delims_pat!.exec(line);
            if (m && m.length) {
                // Get 1 or 2 comment delims
                // Whatever happens, retain the original @delims line.
                const delims = m[1].trim();
                body.push(`@delims ${delims}\n`);
                //
                // Parse the delims.
                this.delims_pat = new RegExp(
                    String.raw`^([^ ]+)\s*([^ ]+)?`,
                    'm'
                ); // @delims
                const m2 = this.delims_pat.exec(delims);
                if (!m2) {
                    g.trace(`Ignoring invalid @delims: ${line} `);
                    continue;
                }
                comment_delim1 = m2[1];
                comment_delim2 = m2[2] || '';
                //
                // Within these delimiters:
                // - double underscores represent a newline.
                // - underscores represent a significant space,
                comment_delim1 = comment_delim1
                    .replace(/__/g, '\n')
                    .replace(/_/g, ' ');
                comment_delim2 = comment_delim2
                    .replace(/__/g, '\n')
                    .replace(/_/g, ' ');
                // Recalculate all delim-related values
                doc_skip = [comment_delim1 + '\n', comment_delim2 + '\n'];
                is_cweb = comment_delim1 === '@q@' && comment_delim2 === '@>';
                sentinel = comment_delim1 + '@';
                //
                // Recalculate the patterns
                comment_delims = [comment_delim1, comment_delim2];
                this.get_patterns(comment_delims);
                continue;
            }
            //@-<< handle @delims >>
            //@+<< handle @section-delims >>
            //@+node:felix.20230413222859.20: *4* << handle @section-delims >>
            m = this.section_delims_pat!.exec(line);
            if (m && m.length) {
                if (section_reference_seen) {
                    // This is a serious error.
                    // This kind of error should have been caught by Leo's atFile write logic.
                    g.es_print('section-delims seen after a section reference');
                } else {
                    // Carefully update the section reference pattern!
                    const d1 = m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    section_delim1 = d1;
                    const d2 = m[2]
                        ? m[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                        : '';
                    section_delim2 = d2;
                    this.ref_pat = new RegExp(
                        String.raw`^(\s*)${comment_delim1}@(\+|-)${d1}(.*)${d2}\s*${comment_delim2}$`,
                        'md'
                    ); // section ref
                }
                body.push(`@section-delims ${m[1]} ${m[2]}\n`);
                continue;
            }
            //@-<< handle @section-delims >>
            // These sections must be last, in this order.
            //@+<< handle remaining @@ lines >>
            //@+node:felix.20230413222859.21: *4* << handle remaining @@ lines >>
            // @first, @last, @delims and @comment generate @@ sentinels,
            // So this must follow all of those.
            if (line.startsWith(comment_delim1 + '@@')) {
                const ii = comment_delim1.length + 1; // on second '@'

                // CONVERTED FROM : j = s.rfind('\n', 0, i);
                // let j = s.substring(0, i).lastIndexOf('\n');

                const jj = comment_delim2
                    ? line.lastIndexOf(comment_delim2)
                    : line.length - 1;
                body.push(line.substring(ii, jj) + '\n');
                continue;
            }
            //@-<< handle remaining @@ lines >>
            if (in_doc) {
                //@+<< handle remaining @doc lines >>
                //@+node:felix.20230413222859.22: *4* << handle remaining @doc lines >>
                if (comment_delim2) {
                    // doc lines are unchanged.
                    body.push(line);
                    continue;
                }
                //    with --black-sentinels: comment_delim1 ends with a blank.
                // without --black-sentinels: comment_delim1 does *not* end with a blank.

                const tail = line
                    .trimStart()
                    .substring(comment_delim1.trimEnd().length + 1);

                if (tail.trim()) {
                    body.push(tail);
                } else {
                    body.push('\n');
                }
                continue;
                //@-<< handle remaining @doc lines >>
            }
            //@+<< handle remaining @ lines >>
            //@+node:felix.20230413222859.23: *4* << handle remaining @ lines >>
            // Handle an apparent sentinel line.
            // This *can* happen after the git-diff or refresh-from-disk commands.
            //
            if (1) {
                // This assert verifies the short-circuit test.
                g.assert(
                    strip_line.startsWith(sentinel),
                    line.toString()
                );

                // Defensive: make *sure* we ignore verbatim lines.
                if (strip_line === verbatim_line) {
                    g.trace('Ignore bad @verbatim sentinel', line.toString());
                } else {
                    // A useful trace.
                    g.trace(
                        `${g.shortFileName(this.path)}: ` +
                        `warning: inserting unexpected line: ${line.trimEnd()}`
                    );
                    // #2213: *Do* insert the line, with a warning.
                    body.push(line);
                }
            }
            //@-<< handle remaining @ lines >>
        }
        if (!w_break) {
            // No @-leo sentinel!
            return;
        }

        //@+<< final checks >>
        //@+node:felix.20230413222859.24: *4* << final checks >>
        if (g.unitTesting) {
            g.assert(!stack.length, stack.toString());
        } else if (stack && stack.length) {
            g.error('scan_lines: Stack should be empty');
            g.printObj(stack, 'stack');
        }
        //@-<< final checks >>
        //@+<< insert @last lines >>
        //@+node:felix.20230413222859.25: *4* << insert @last lines >>
        let tail_lines = lines.slice(start + i);
        if (tail_lines && tail_lines.length) {
            // Convert the trailing lines to @last directives.
            let last_lines = tail_lines.map((z) => `@last ${z.trimEnd()}\n`);
            // Add the lines to the dictionary of lines.
            gnx2body[gnx] = [...gnx2body[gnx]]; // break reference like in original Leo
            gnx2body[gnx].push(...last_lines);
            // Warn if there is an unexpected number of last lines.
            if (n_last_lines !== last_lines.length) {
                const n1 = n_last_lines;
                const n2 = last_lines.length;
                g.trace(
                    `Expected ${n1} trailing line${g.plural(n1)}, got ${n2}`
                );
            }
        }
        //@-<< insert @last lines >>
        //@+<< post pass: set all body text>>
        //@+node:felix.20230413222859.26: *4* << post pass: set all body text>>
        // Set the body text.
        g.assert(gnx2vnode[root_v.gnx], root_v.gnx);
        g.assert(gnx2body[root_v.gnx], root_v.gnx);
        for (const key in gnx2body) {
            body = gnx2body[key];
            const v = gnx2vnode[key];
            g.assert(v, key);
            v._bodyString = g.toUnicode(body.join(''));
        }
        //@-<< post pass: set all body text>>
    }

    //@+node:felix.20230413222859.27: *3* fast_at.read_into_root
    /**
     * Parse the file's contents, creating a tree of vnodes
     * anchored in root.v.
     */
    public read_into_root(
        contents: string,
        path: string,
        root: Position
    ): boolean {
        this.path = path;
        this.root = root;
        contents = contents.replace(/\r/g, '');
        const lines = g.splitLines(contents);
        const data = this.scan_header(lines);
        if (!data) {
            g.trace(`Invalid external file: ${path}`);
            return false;
        }
        // Clear all children.
        // Previously, this had been done in readOpenFile.
        root.v._deleteAllChildren();
        let [comment_delims, first_lines, start_i] = data;
        this.scan_lines(comment_delims, first_lines, lines, path, start_i);
        return true;
    }
    //@-others
}

//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 60
//@-leo
