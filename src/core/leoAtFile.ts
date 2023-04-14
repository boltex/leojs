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

    //@+others
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 60
//@-leo
