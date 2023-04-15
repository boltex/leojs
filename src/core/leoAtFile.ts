//@+leo-ver=5-thin
//@+node:felix.20211211234842.1: * @file src/core/leoAtFile.ts
// * Classes to read and write @file nodes.
//@+<< imports >>
//@+node:felix.20211225220235.1: ** << imports >>
/*
import io
import os
import re
import sys
import tabnanny
import time
import tokenize
from typing import List
from leo.core import leoGlobals as g
from leo.core import leoNodes
*/

import * as vscode from 'vscode';
import * as g from './leoGlobals';
import { new_cmd_decorator } from "../core/decorators";
import { Position, VNode } from './leoNodes';
import { FileCommands } from "./leoFileCommands";
import { Commands } from './leoCommands';

//@-<< imports >>
//@+others
//@+node:felix.20211225220217.1: ** atFile.cmd
/**
 * Command decorator for the AtFileCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'atFileCommands']);
}
//@+node:felix.20211225222130.1: ** class AtFile (DUMMY)
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
    public encoding: BufferEncoding | undefined = 'utf-8';  // 2014/08/13
    public fileCommands: FileCommands;
    public errors = 0;  // Make sure at.error() works even when not inited.
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
    public runPyFlakesOnWrite: boolean = false;
    public underindentEscapeString: string = '\\-';
    public read_i: number = 0;
    public read_lines: string[] = [];
    public _file_bytes: string | undefined;
    public readVersion: string | undefined;
    public readVersion5: boolean | undefined;
    public startSentinelComment: string | undefined;
    public endSentinelComment: string | undefined;

    //@+others
    //@+node:felix.20211225231532.1: *3* at.Birth & init
    //@+node:felix.20211225231716.1: *4* constructor
    constructor(c: Commands) {
        this.c = c;
        this.fileCommands = c.fileCommands;
    }

    //@+node:felix.20211225233823.1: *3* readAll
    public async readAll(root: Position, force: boolean = false): Promise<unknown> {
        return;
    }
    //@+node:felix.20211225233821.1: *3* writeAll
    public async writeAll(all: boolean = false, dirty: boolean = false): Promise<unknown> {
        return;
    }
    //@+node:felix.20211225233822.1: *3* writeMissing
    public async writeMissing(p: Position): Promise<unknown> {
        return;
    }
    //@+node:felix.20220108204309.1: *3* writeOneAtEditNode
    public async writeOneAtEditNode(p: Position): Promise<unknown> {
        return;
    }
    //@+node:felix.20221220001232.1: *3* at.atAutoToString
    /**
     * Write the root @auto node to a string, and return it.
     */
    public atAutoToString(root: Position): string {

        return "";

        // TODO ! 

        // at, c = self, self.c
        // try:
        //     c.endEditing()
        //     fileName = at.initWriteIvars(root)
        //     at.sentinels = False
        //     # #1450.
        //     if not fileName:
        //         at.addToOrphanList(root)
        //         return ''
        //     return at.writeAtAutoContents(fileName, root) or ''
        // except Exception:
        //     at.writeException(fileName, root)
        //     return ''
    }
    //@+node:felix.20221219223300.1: *3* at.stringToString
    /**
     * Write an external file from a string.
     *
     * This is at.write specialized for scripting.
     */
    public stringToString(
        root: Position,
        s: string,
        forcePythonSentinels = true,
        sentinels = true,
    ): string {

        return ""; // TODO     
        // const at = this;
        // const c = this.c;
        // try
        //     c.endEditing()
        //     at.initWriteIvars(root)
        //     if forcePythonSentinels:
        //         at.endSentinelComment = None
        //         at.startSentinelComment = "#"
        //         at.language = "python"
        //     at.sentinels = sentinels
        //     at.outputList = []
        //     at.putFile(root, fromString=s, sentinels=sentinels)
        //     contents = '' if at.errors else ''.join(at.outputList)
        //     // Major bug: failure to clear this wipes out headlines!
        //     //            Sometimes this causes slight problems...
        //     if root
        //         root.v._p_changed = True
        //     return contents
        // except exception
        //     at.exception("exception preprocessing script");
        //     return ''


    }

    //@+node:felix.20220108170000.1: *3* read
    public async read(p: Position): Promise<unknown> {
        return;
    }
    //@+node:felix.20220122224516.1: *3* at.readAllSelected
    /**
     * Read all @<file> nodes in root's tree.
     */
    public async readAllSelected(root: Position): Promise<unknown> {

        const at = this;
        const c = this.c;
        return;
        // TODO !

        // const old_changed = c.changed;

        // t1 = time.time()
        // c.init_error_dialogs()
        // files = at.findFilesToRead(root, all=False)
        // for p in files:
        //     at.readFileAtPosition(p)
        // for p in files:
        //     p.v.clearDirty()
        // if not g.unitTesting:  # pragma: no cover
        //     if files:
        //         t2 = time.time()
        //         g.es(f"read {len(files)} files in {t2 - t1:2.2f} seconds")
        //     else:
        //         g.es("no @<file> nodes in the selected tree")
        // c.changed = old_changed
        // c.raise_error_dialogs()
    }
    //@+node:felix.20220108165923.1: *3* readOneAtAutoNode
    public async readOneAtAutoNode(p: Position): Promise<Position> {
        return p;
    }
    //@+node:felix.20220108170029.1: *3* readOneAtCleanNode
    public async readOneAtCleanNode(p: Position): Promise<unknown> {
        return;
    }
    //@+node:felix.20220108170054.1: *3* readOneAtEditNode
    public async readOneAtEditNode(fn: string, p: Position): Promise<unknown> {
        return;
    }
    //@+node:felix.20220108170138.1: *3* readOneAtAsisNode
    public async readOneAtAsisNode(fn: string, p: Position): Promise<unknown> {
        return;
    }
    //@+node:felix.20220111224436.1: *3* readAtShadowNodes
    public async readAtShadowNodes(p: Position): Promise<Position> {
        return p;
    }
    //@+node:felix.20230412000326.1: *3* at.initReadLine
    /**
     * Init the ivars so that at.readLine will read all of s.
     */
    public initReadLine(s: string): void {
        const at = this;
        at.read_i = 0;
        at.read_lines = g.splitLines(s);
        at._file_bytes = g.toEncodedString(s);
    }
    //@+node:felix.20230412000331.1: *3* at.parseLeoSentinel
    /**
      * Parse the sentinel line s.
      * If the sentinel is valid, set at.encoding, at.readVersion, at.readVersion5.
      */
    public parseLeoSentinel(s: string): [boolean, boolean, string, string, boolean] {
        const at = this;
        const c = this.c;
        // Set defaults.
        let encoding = c.config.default_derived_file_encoding;
        let readVersion, readVersion5; // None. None  
        let new_df = false;
        let start = "";
        let end = "";
        let isThin = false;
        // Example: \*@+leo-ver=5-thin-encoding=utf-8,.*/
        const pattern = /(.+)@\+leo(-ver=([0123456789]+))?(-thin)?(-encoding=(.*)(\.))?(.*)'/;
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
        let valid = !!(m);
        if (m && valid) {
            start = m[1];  // start delim
            valid = !!(start);
        }
        if (m && valid) {
            new_df = !!(m[2]);  // -ver=
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
            isThin = !!(m[4]);
        }
        if (m && valid && m[5]) {
            // set encoding.
            encoding = m[6] as BufferEncoding;
            if (encoding && encoding.endsWith(',')) {
                // Leo 4.2 or after.
                encoding = encoding.substring(0, encoding.length - 1) as BufferEncoding;
            }
            if (!g.isValidEncoding(encoding)) {
                g.es_print("bad encoding in derived file:", encoding);
                valid = false;
            }
        }
        if (m && valid) {
            end = m[8];  // closing delim
        }
        if (valid) {
            at.encoding = encoding;
            at.readVersion = readVersion;
            at.readVersion5 = readVersion5;
        }
        return [valid, new_df, start, end, isThin];
    }
    //@+node:felix.20230412000231.1: *3* at.readFileToUnicode & helpers
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
    public async readFileToUnicode(fileName: string): Promise<string | undefined> {
        const at = this;
        let s: string;
        let s_bytes = await at.openFileHelper(fileName);  // Catches all exceptions.
        // #1798.
        if (!s_bytes || !s_bytes.byteLength) {
            return undefined;  // Not ''.
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
    //@+node:felix.20230412000231.2: *4* at.openFileHelper
    /**
     * Open a file, reporting all exceptions.
     */
    public async openFileHelper(fileName: string): Promise<Uint8Array | undefined> { // bytes,  *not* str!
        const at = this;
        // #1798: return None as a flag on any error.
        let s;
        try {
            const w_uri = g.makeVscodeUri(fileName);
            s = await vscode.workspace.fs.readFile(w_uri);
        }
        // catch IOError:  // pragma: no cover
        //     at.error(f"can not open {fileName}")
        catch (exception) {  // pragma: no cover
            at.error(`Exception reading ${fileName}`);
            g.es_exception();
        }
        return s;
    }
    //@+node:felix.20230412000231.3: *4* at.getEncodingFromHeader
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
                console.assert(false, g.callers()); // noqa
            }
        } else {
            at.initReadLine(s);
            const old_encoding = at.encoding;
            console.assert(old_encoding);
            at.encoding = undefined;
            // Execute scanHeader merely to set at.encoding.
            at.scanHeader(fileName, false);
            e = at.encoding! || old_encoding;
        }
        console.assert(e);
        return e!;
    }
    //@+node:felix.20230412233539.1: *3* at.readLine
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
    //@+node:felix.20230412233546.1: *3* at.scanHeader
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
    public scanHeader(fileName: string, giveErrors = true): [string[], boolean, boolean] {
        const at = this;
        let new_df = false;
        let isThinDerivedFile = false;
        let start, end;
        const firstLines: string[] = [];  // The lines before @+leo.
        const s = at.scanFirstLines(firstLines);
        let valid = s.length > 0;
        if (valid) {
            [valid, new_df, start, end, isThinDerivedFile] = at.parseLeoSentinel(s);
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
    //@+node:felix.20230412233546.2: *4* at.scanFirstLines
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
        while (s && s.indexOf("@+leo") === -1) {
            firstLines.push(s);
            s = at.readLine();
        }
        return s;
    }
    //@+node:felix.20230412005719.1: *3* at.error & printError
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
    //@-others

}

// TODO

// atFile = AtFile  // compatibility
//@+node:felix.20211225222141.1: ** class FastAtRead
/**
 * Read an external file, created from an @file tree.
 * This is Vitalije's code, edited by EKR.
 */
export class FastAtRead {

    public c: Commands;
    public gnx2vnode: { [key: string]: VNode };  // The global fc.gnxDict. Keys are gnx's, values are vnodes.
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
        String.raw`^(.+)@\+leo(-ver=(\d+))?(-thin)?(-encoding=(.*)(\.))?(.*)$`, 'm'
    );

    //@+others
    //@+node:felix.20230413222859.2: *3* fast_at.__init__
    constructor(c: Commands, gnx2vnode: { [key: string]: VNode }) {

        this.c = c;
        console.assert(gnx2vnode);
        this.gnx2vnode = gnx2vnode;  // The global fc.gnxDict. Keys are gnx's, values are vnodes.
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
        comment_delim_start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const delim1 = comment_delim_start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const delim2 = comment_delim_end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const ref = g.angleBrackets('(.*)');

        // Equivalent of table loop assignments of original Leo.
        this.after_pat = new RegExp(String.raw`^\s*${delim1}@afterref${delim2}$`); // @afterref
        this.all_pat = new RegExp(String.raw`^(\s*)${delim1}@(\+|-)all\b(.*)${delim2}$`); // @all
        this.code_pat = new RegExp(String.raw`^\s*${delim1}@@c(ode)?${delim2}$`); // @c and @code
        this.comment_pat = new RegExp(String.raw`^\s*${delim1}@@comment(.*)${delim2}`); // @comment
        this.delims_pat = new RegExp(String.raw`^\s*${delim1}@delims(.*)${delim2}`); // @delims
        this.doc_pat = new RegExp(String.raw`^\s*${delim1}@\+(at|doc)?(\s.*?)?${delim2}\n`); // @doc or @
        this.first_pat = new RegExp(String.raw`^\s*${delim1}@@first${delim2}$`); // @first
        this.last_pat = new RegExp(String.raw`^\s*${delim1}@@last${delim2}$`); // @last
        this.node_start_pat = new RegExp(String.raw`^(\s*)${delim1}@\+node:([^:]+): \*(\d+)?(\*?) (.*)${delim2}$`); // @node
        this.others_pat = new RegExp(String.raw`^(\s*)${delim1}@(\+|-)others\b(.*)${delim2}$`, 'd'); // @others
        this.ref_pat = new RegExp(String.raw`^(\s*)${delim1}@(\+|-)${ref}\s*${delim2}$`, 'd'); // section ref
        this.section_delims_pat = new RegExp(String.raw`^\s*${delim1}@@section-delims[ \t]+([^ \w\n\t]+)[ \t]+([^ \w\n\t]+)[ \t]*${delim2}$`); // @section-delims

    }
    //@+node:felix.20230413222859.4: *3* fast_at.scan_header

    /**
     * Scan for the header line, which follows any @first lines.
     * Return (delims, first_lines, i+1) or None
     *
     * Important: delims[0] will end with a blank when reading a file with blackened sentinels!
     * This fact eliminates all special cases in scan_lines!
     */
    public scan_header(lines: string[]): [[string, string | undefined], string[], number] | undefined {

        const first_lines: string[] = [];
        let i = 0;  // To keep some versions of pylint happy.
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
    public scan_lines(comment_delims: [string, string | undefined], first_lines: string[], lines: string[], path: string, start: number): void {

        //@+<< init scan_lines >>
        //@+node:felix.20230413222859.6: *4* << init scan_lines >>
        //
        // Simple vars...
        let afterref = false;  // True: the next line follows @afterref.
        let clone_v: VNode | undefined = undefined;  // The root of the clone tree.
        // The start/end *comment* delims.
        // Important: scan_header ends comment_delim1 with a blank when using black sentinels.
        let comment_delim1, comment_delim2;
        [comment_delim1, comment_delim2] = comment_delims;
        let doc_skip = [comment_delim1 + '\n', comment_delim2 + '\n'];  // To handle doc parts.
        let first_i = 0;  // Index into first array.
        let in_doc = false;  // True: in @doc parts.
        let is_cweb = comment_delim1 === '@q@' && comment_delim2 === '@>';  // True: cweb hack in effect.
        let indent = 0;  // The current indentation.
        let level_stack: [VNode, VNode | undefined][] = [];
        let n_last_lines = 0;  // The number of @@last directives seen.
        let root_gnx_adjusted = false;  // True: suppress final checks.
        // #1065 so reads will not create spurious child nodes.
        let root_seen = false;  // false: The next +@node sentinel denotes the root, regardless of gnx.
        let section_delim1 = '<<';
        let section_delim2 = '>>';
        let section_reference_seen = false;
        let sentinel = comment_delim1 + '@';
        // The stack is updated when at+others, at+<section>, or at+all is seen.
        const stack: [string, number, string[]][] = [];  // Entries are (gnx, indent, body)
        const verbatim_line = comment_delim1 + '@verbatim' + comment_delim2;
        let verbatim = false;  // True: the next line must be added without change.
        //
        // Init the parent vnode.
        //
        const root_gnx = this.root!.gnx;
        let gnx = this.root!.gnx;
        const context = this.c;
        let parent_v = this.root!.v;
        const root_v = parent_v;  // Does not change.
        level_stack.push([root_v, undefined]);
        //
        // Init the gnx dict last.
        //
        let gnx2vnode = this.gnx2vnode;  // Keys are gnx's, values are vnodes.
        const gnx2body: { [key: string]: string[] } = {};  // Keys are gnxs, values are list of body lines.
        gnx2vnode[gnx] = parent_v;  // Add gnx to the keys
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
        let i: number = 0; // To keep pylint happy.
        for (let [w_i, line] of lines.slice(start).entries()) {
            i = w_i;
            // Strip the line only once.
            let strip_line = line.trim();
            if (afterref) {
                //@+<< handle afterref line>>
                //@+node:felix.20230413222859.7: *4* << handle afterref line >>
                if (body && body.length) {  // a List of lines.
                    body[body.length - 1] = body[body.length - 1].replace(/\s+$/, '') + line;
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
                if (indent && /^\s*$/.test(line.substring(indent)) && line.length > indent) {
                    line = line.substring(indent);
                }
                body.push(line);
                verbatim = false;
                //@-<< handle verbatim line >>
                continue;
            }

            if (strip_line === verbatim_line) {  // <delim>@verbatim
                verbatim = true;
                continue;
            }

            //@+<< finalize line >>
            //@+node:felix.20230413222859.9: *4* << finalize line >>
            // Undo the cweb hack.
            if (is_cweb && line.startsWith(sentinel)) {
                const w_ls = sentinel.length;
                line = line.substring(0, w_ls) + line.substring(w_ls).replace(/@@+/g, '@');
            }
            // Adjust indentation.
            if (indent && /^\s*$/.test(line.substring(0, indent)) && line.length > indent) {
                line = line.substring(indent);
            }
            //@-<< finalize line >>
            if (!in_doc && !strip_line.startsWith(sentinel)) { // Faster than a regex!
                body.push(line);
                continue;
            }
            // These three sections might clear in_doc.
            //@+<< handle @others >>
            //@+node:felix.20230413222859.10: *4* << handle @others >>
            m = this.others_pat!.exec(line);
            if (m && m.length) {
                in_doc = false;
                if (m[2] === '+') {  // opening sentinel
                    body.push(`${m[1]}@others${m[3] || ''}\n`);
                    stack.push([gnx, indent, body]);
                    indent += (m as any).indices[1][1];  // adjust current indentation
                } else { // closing sentinel.
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
                    body.push(m[1] + section_delim1 + m[3] + section_delim2 + '\n');
                    stack.push([gnx, indent, body]);
                    indent += (m as any).indices[1][1];
                } else if (stack && stack.length) {
                    // m[2] is '-' because the pattern matched.
                    [gnx, indent, body] = stack.pop()!;  // #1232: Only if the stack exists.
                }
                continue;  // 2021/10/29: *always* continue.
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
                //
                // Case 1: The root @file node. Don't change the headline.
                if (!root_seen && !v && !g.unitTesting) {
                    // Don't warn about a gnx mismatch in the root.
                    root_gnx_adjusted = true;
                }
                if (!root_seen) {
                    // Fix //1064: The node represents the root, regardless of the gnx!
                    root_seen = true;
                    clone_v = undefined;
                    body = [];
                    gnx2body[gnx] = body;
                    // This case can happen, but not in unit tests.
                    if (!v) {
                        // Fix //1064.
                        v = root_v;
                        // This message is annoying when using git-diff.
                        // if gnx != root_gnx:
                        // g.es_print("using gnx from external file: %s" % (v.h), color='blue')
                        gnx2vnode[gnx] = v;
                        v.fileIndex = gnx;
                    }
                    v.children = [];
                    continue;
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
                    continue;
                }
                //
                // Case 3: we are not already scanning the descendants of a clone.
                if (v) {
                    // The *start* of a clone tree. Reset the children.
                    clone_v = v;
                    v.children = [];
                } else {
                    // Make a new vnode.
                    v = new VNode(context, gnx);
                }
                //
                // The last version of the body and headline wins.
                gnx2vnode[gnx] = v;
                body = [];
                gnx2body[gnx] = body; // TODO : Check if this is ok - or should be new array instance too?
                v._headString = head;
                //
                // Update the stack.
                level_stack = level_stack.slice(0, level - 1);
                level_stack.push([v, clone_v]);
                //
                // Update the links.
                console.assert(v !== root_v);
                parent_v.children.push(v)
                v.parents.push(parent_v)
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
                    const doc2 = m[2] || '';  //  Trailing text.
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
            if (line.startsWith(comment_delim1 + '@-leo')) { // Faster than a regex!
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
                if (m[2] === '+') { // opening sentinel
                    body.push(`${m[1]}@all${m[3] || ''}\n`);
                    stack.push([gnx, indent, body]);
                } else {  // closing sentinel.
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
                // pylint: disable=no-else-continue
                if (0 <= first_i && first_i < first_lines.length) {
                    body.push('@first ' + first_lines[first_i]);
                    first_i += 1;
                    continue;
                } else {
                    g.trace(`\ntoo many @first lines: ${path}`);
                    console.log('@first is valid only at the start of @<file> nodes\n');
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
                comment_delim1 = comment_delim1!.replace(/__/g, "\n").replace(/_/g, " ");
                comment_delim2 = comment_delim2!.replace(/__/g, "\n").replace(/_/g, " ");
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
                this.delims_pat = new RegExp(String.raw`^([^ ]+)\s*([^ ]+)?`);
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
                comment_delim1 = comment_delim1.replace(/__/g, "\n").replace(/_/g, " ");
                comment_delim2 = comment_delim2.replace(/__/g, "\n").replace(/_/g, " ");
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
                    const d2 = m[2] ? m[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
                    section_delim2 = d2;
                    this.ref_pat = new RegExp(String.raw`^(\s*)${comment_delim1}@(\+|-)${d1}(.*)${d2}\s*${comment_delim2}$`);
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
                const ii = comment_delim1.length + 1;  // on second '@'

                // CONVERTED FROM : j = s.rfind('\n', 0, i);
                // let j = s.substring(0, i).lastIndexOf('\n');

                const jj = comment_delim2 ? line.lastIndexOf(comment_delim2) : line.length;
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

                const tail = line.trimStart().substring(comment_delim1.trimEnd().length + 1);

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
                console.assert(strip_line.startsWith(sentinel), line.toString());

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
            // Unit tests must use the proper value for root.gnx.
            console.assert(!root_gnx_adjusted);
            console.assert(!stack.length, stack.toString());
            console.assert(root_gnx === gnx, [root_gnx, gnx].toString());
        } else if (root_gnx_adjusted) {
            // pass  // Don't check!
        } else if (stack) {
            g.error('scan_lines: Stack should be empty');
            g.printObj(stack, 'stack');
        } else if (root_gnx !== gnx) {
            g.error('scan_lines: gnx error');
            g.es_print(`root_gnx: ${root_gnx} != gnx: ${gnx}`);
        }
        //@-<< final checks >>
        //@+<< insert @last lines >>
        //@+node:felix.20230413222859.25: *4* << insert @last lines >>
        let tail_lines = lines.slice(start + i);
        if (tail_lines && tail_lines.length) {
            // Convert the trailing lines to @last directives.
            let last_lines = tail_lines.map(z => `@last ${z.trimEnd()}\n`);
            // Add the lines to the dictionary of lines.
            gnx2body[gnx] = [...gnx2body[gnx]]; // break reference like in original Leo 
            gnx2body[gnx].push(...last_lines);
            // Warn if there is an unexpected number of last lines.
            if (n_last_lines !== last_lines.length) {
                const n1 = n_last_lines;
                const n2 = last_lines.length;
                g.trace(`Expected ${n1} trailing line${g.plural(n1)}, got ${n2}`);
            }
        }
        //@-<< insert @last lines >>
        //@+<< post pass: set all body text>>
        //@+node:felix.20230413222859.26: *4* << post pass: set all body text>>
        // Set the body text.
        console.assert(gnx2vnode[root_v.gnx], root_v.gnx);
        console.assert(gnx2body[root_v.gnx], root_v.gnx);
        for (const key in gnx2body) {
            body = gnx2body[key];
            const v = gnx2vnode[key];
            console.assert(v, key);
            v._bodyString = g.toUnicode(body.join(''));
        }
        //@-<< post pass: set all body text>>

    }

    //@+node:felix.20230413222859.27: *3* fast_at.read_into_root
    /**
     * Parse the file's contents, creating a tree of vnodes
     * anchored in root.v.
     */
    public read_into_root(contents: string, path: string, root: Position): boolean {

        this.path = path;
        this.root = root;
        const sfn = g.shortFileName(path);
        contents = contents.replace(/\r/g, '');
        const lines = g.splitLines(contents);
        const data = this.scan_header(lines);
        if (!data) {
            g.trace(`Invalid external file: ${sfn}`);
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
