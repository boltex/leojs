//@+leo-ver=5-thin
//@+node:felix.20211212162359.1: * @file src/core/leoShadow.ts
//@+<< leoShadow docstring >>
//@+node:felix.20230410140706.1: ** << leoShadow docstring >>
/**
 * leoShadow.py
 *
 * This code allows users to use Leo with files which contain no sentinels
 * and still have information flow in both directions between outlines and
 * derived files.
 *
 * Private files contain sentinels: they live in the Leo-shadow subdirectory.
 * Public files contain no sentinels: they live in the parent (main) directory.
 *
 * When Leo first reads an @shadow we create a file without sentinels in the regular directory.
 *
 * The slightly hard thing to do is to pick up changes from the file without
 * sentinels, and put them into the file with sentinels.
 *
 * Settings:
 * - @string shadow_subdir (default: .leo_shadow): name of the shadow directory.
 *
 * - @string shadow_prefix (default: x): prefix of shadow files.
 *   This prefix allows the shadow file and the original file to have different names.
 *   This is useful for name-based tools like py.test.
 */
//@-<< leoShadow docstring >>
//@+<< leoShadow imports & annotations >>
//@+node:felix.20230410142048.1: ** << leoShadow imports & annotations >>
import * as vscode from 'vscode';
import * as difflib from 'difflib';
import * as g from './leoGlobals';
import * as path from 'path';

import { Position } from './leoNodes';
import { Commands } from './leoCommands';

type DispatchKeys = 'delete' | 'equal' | 'insert' | 'replace';

//@-<< leoShadow imports & annotations >>
//@+others
//@+node:felix.20230410203541.1: ** class ShadowController
/**
 * A class to manage @shadow files
 */
export class ShadowController {
    public a: string[] = [];
    public b: string[] = [];
    public c: Commands;
    public dispatch_dict: { [key in DispatchKeys]: any };
    public encoding: BufferEncoding;
    public errors: number;
    public results: string[];
    public shadow_subdir: string | undefined;
    public shadow_prefix: string | undefined;
    public shadow_in_home_dir: boolean | undefined;
    public delim1: string = '';
    public delim2: string = '';
    public marker: Marker | undefined;
    public old_sent_lines: string[] = [];
    public verbatim_line: string = '';
    public sentinels: string[][] = [];
    public trailing_sentinels: string[] = [];

    //@+others
    //@+node:felix.20230410203541.2: *3*  x.ctor & x.reloadSettings
    /**
     * Ctor for ShadowController class.
     */
    constructor(c: Commands, trace = false, trace_writers = false) {
        this.c = c;
        // Opcode dispatch dict.
        this.dispatch_dict = {
            delete: this.op_delete,
            equal: this.op_equal,
            insert: this.op_insert,
            replace: this.op_replace,
        };
        this.encoding = c.config.default_derived_file_encoding;
        this.errors = 0;
        this.results = [];
        this.shadow_subdir = undefined;
        this.shadow_prefix = undefined;
        this.shadow_in_home_dir = undefined;
        // Support for goto-line.
        this.reloadSettings();
    }

    /**
     * ShadowController.reloadSettings.
     */
    public reloadSettings(): void {
        const c = this.c;
        this.shadow_subdir =
            c.config.getString('shadow-subdir') || '.leo_shadow';
        this.shadow_prefix = c.config.getString('shadow-prefix') || '';
        this.shadow_in_home_dir = c.config.getBool('shadow-in-home-dir', false);
        this.shadow_subdir = g.os_path_normpath(this.shadow_subdir);
    }
    //@+node:felix.20230410203541.3: *3* x.File utils
    //@+node:felix.20230410203541.4: *4* x.baseDirName
    public baseDirName(): string | undefined {
        const c = this.c;
        const filename = c.fileName();
        if (filename) {
            return g.os_path_dirname(g.finalize(filename)); // 1341
        }
        console.log('');
        this.error('Can not compute shadow path: .leo file has not been saved');
        return undefined;
    }
    //@+node:felix.20230410203541.5: *4* x.dirName and pathName
    /**
     * Return the directory for filename.
     */
    public dirName(filename: string): string {
        const x = this;
        return g.os_path_dirname(x.pathName(filename));
    }
    /**
     * Return the full path name of filename.
     */
    public pathName(filename: string): string {
        const x = this;
        const theDir = x.baseDirName();
        return theDir ? g.finalize_join(theDir, filename) : ''; // 1341
    }
    //@+node:felix.20230410203541.6: *4* x.isSignificantPublicFile
    /**
     * This tells the AtFile.read logic whether to import a public file
     * or use an existing public file.
     */
    public async isSignificantPublicFile(fn: string): Promise<boolean> {
        const w_exists = await g.os_path_exists(fn);
        const w_isfile = await g.os_path_isfile(fn);
        const w_getsize = await g.os_path_getsize(fn);
        return !!(w_exists && w_isfile && w_getsize > 10);
    }
    //@+node:felix.20230410203541.7: *4* x.makeShadowDirectory
    /**
     * Make a shadow directory for the **public** fn.
     */
    public async makeShadowDirectory(fn: string): Promise<boolean> {
        const x = this;
        const path = x.shadowDirName(fn);
        let w_exists = await g.os_path_exists(path);
        if (!w_exists) {
            // Force the creation of the directories.
            await g.makeAllNonExistentDirectories(path);
        }
        w_exists = await g.os_path_exists(path);
        const w_isdir = await g.os_path_isdir(path);
        return w_exists && w_isdir;
    }
    //@+node:felix.20230410203541.8: *4* x.replaceFileWithString
    /**
     * Replace the file with s if s is different from theFile's contents.
     * Return True if theFile was changed.
     */
    public async replaceFileWithString(
        encoding: BufferEncoding,
        fileName: string,
        s: string
    ): Promise<boolean> {
        const x = this;
        const c = this.c;
        const exists = await g.os_path_exists(fileName);
        let s2, e;
        if (exists) {
            // Read the file.  Return if it is the same.
            [s2, e] = await g.readFileIntoString(fileName);
            if (s2 === undefined || s2 === null) {
                return false;
            }
            if (s === s2) {
                const report = c.config.getBool('report-unchanged-files', true);
                if (report && !g.unitTesting) {
                    g.es('unchanged:', fileName);
                }
                return false;
            }
        }
        // Issue warning if directory does not exist.
        const theDir = g.os_path_dirname(fileName);
        const w_exists = await g.os_path_exists(theDir);
        if (theDir && !w_exists) {
            if (!g.unitTesting) {
                x.error(`not written: ${fileName} directory not found`);
            }
            return false;
        }
        // Replace the file.
        try {
            //with open(fileName, 'wb') as f
            // Fix bug 1243847: unicode error when saving @shadow nodes.
            // f.write(g.toEncodedString(s, encoding));

            const w_writeUri = g.makeVscodeUri(fileName);
            const writeData = g.toEncodedString(s, encoding);

            await vscode.workspace.fs.writeFile(w_writeUri, writeData);

            await c.setFileTimeStamp(fileName); // Fix #1053.  This is an *ancient* bug.
            if (!g.unitTesting) {
                const kind = exists ? 'wrote' : 'created';
                g.es(`${kind}: ${fileName}`);
            }
            return true;
        } catch (IOError) {
            x.error(`unexpected exception writing file: ${fileName}`);
            g.es_exception(IOError);
            return false;
        }
    }
    //@+node:felix.20230410203541.9: *4* x.shadowDirName and shadowPathName
    /**
     * Return the directory for the shadow file corresponding to filename.
     */
    public shadowDirName(filename: string): string {
        const x = this;
        const sp = x.shadowPathName(filename);
        const dn = g.os_path_dirname(sp);
        return dn;
    }
    /**
     * Return the full path name of filename, resolved using c.fileName()
     */
    public shadowPathName(filename: string): string | undefined {
        const x = this;
        const c = x.c;
        const baseDir = x.baseDirName();
        let fileDir = g.os_path_dirname(filename);
        // 2011/01/26: bogomil: redirect shadow dir
        if (this.shadow_in_home_dir) {
            // Each .leo file has a separate shadow_cache in base dir
            const fname = [
                g.os_path_splitext(path.basename(c.mFileName))[0],
                'shadow_cache',
            ].join('_');
            // On Windows incorporate the drive letter to the private file path
            if (g.isWindows) {
                fileDir = fileDir.replace(':', '%');
            }
            // build the cache path as a subdir of the base dir
            fileDir = [baseDir, fname, fileDir].join('/');
        }

        const result =
            baseDir &&
            g.finalize_join(
                // 1341
                baseDir,
                fileDir, // Bug fix: honor any directories specified in filename.
                x.shadow_subdir!,
                x.shadow_prefix + g.shortFileName(filename)
            );

        return result;
    }
    //@+node:felix.20230410203541.10: *3* x.Propagation
    //@+node:felix.20230410203541.11: *4* x.check_output
    /**
     * Check that we produced a valid output.
     */
    public check_output(): boolean {
        const x = this;
        const lines1 = x.b;
        let junk, sents1, lines2, sents2;
        [junk, sents1] = x.separate_sentinels(x.old_sent_lines, x.marker!);
        [lines2, sents2] = x.separate_sentinels(x.results, x.marker!);
        const ok = lines1 === lines2 && sents1 === sents2;
        if (g.unitTesting) {
            // The unit test will report the error.
            return ok;
        }
        if (lines1 !== lines2) {
            g.trace();
            const d = new difflib.Differ();
            const aList = [...d.compare(lines2, x.b)];
            console.log(aList);
        }
        if (sents1 !== sents2) {
            x.show_error(
                sents1,
                sents2,
                'Sentinels not preserved!',
                'old sentinels',
                'new sentinels'
            );
        }
        return ok;
    }
    //@+node:felix.20230410203541.12: *4* x.propagate_changed_lines (main algorithm) & helpers
    //@+<< docstring >>
    //@+node:felix.20230410203541.13: *5*  << docstring >>
    /**
     * The Mulder update algorithm, revised by EKR.
     *
     * Use the diff between the old and new public lines to intersperse sentinels
     * from old_private_lines into the result.
     *
     * The algorithm never deletes or rearranges sentinels. However, verbatim
     * sentinels may be inserted or deleted as needed.
     */
    //@-<< docstring >>
    public propagate_changed_lines(
        new_public_lines: string[],
        old_private_lines: string[],
        marker: Marker,
        p?: Position
    ): string[] {
        const x = this;
        x.init_ivars(new_public_lines, old_private_lines, marker);
        const sm = new difflib.SequenceMatcher(null, x.a, x.b);
        // Ensure leading sentinels are put first.
        x.put_sentinels(0);
        if (x.sentinels && x.sentinels.length) {  // 2024/10/25.
            x.sentinels[0] = [];
        }
        for (const [tag, ai, aj, bi, bj] of sm.getOpcodes()) {
            const f = x.dispatch_dict[tag] || x.op_bad;
            f.bind(this)(tag, ai, aj, bi, bj);
        }
        // Put the trailing sentinels & check the result.
        x.results.push(...x.trailing_sentinels);
        // check_output is likely to be more buggy than the code under test.
        // x.check_output()
        return x.results;
    }
    //@+node:felix.20230410203541.14: *5* x.dump_args
    /**
     * Dump the argument lines.
     */
    public dump_args(): void {
        const x = this;
        const table: [string[], string][] = [
            [x.old_sent_lines, 'old private lines'],
            [x.a, 'old public lines'],
            [x.b, 'new public lines'],
        ];
        for (const [lines, title] of table) {
            x.dump_lines(lines, title);
        }
        g.pr();
    }
    //@+node:felix.20230410203541.15: *5* x.dump_lines
    /**
     * Dump the given lines.
     */
    public dump_lines(lines: string[], title: string): void {
        console.log(`\n${title}...\n`);
        for (const [i, line] of lines.entries()) {
            g.pr(`${i} ${line}`);
        }
    }
    //@+node:felix.20230410203541.16: *5* x.init_data
    /**
     * Init x.sentinels and x.trailing_sentinels arrays.
     * Return the list of non-sentinel lines in x.old_sent_lines.
     */
    public init_data(): string[] {
        const x = this;
        const lines = x.old_sent_lines;

        // The sentinels preceding each non-sentinel line,
        // not including @verbatim sentinels.
        let sentinels: string[] = [];
        // A list of all non-sentinel lines found.  Should match x.a.
        const new_lines: string[] = [];
        // A list of lists of sentinels preceding each line.
        x.sentinels = [];
        let i = 0;
        let line: string;
        while (i < lines.length) {
            line = lines[i];
            i += 1;
            if (x.marker!.isVerbatimSentinel(line)) {
                // Do *not* include the @verbatim sentinel.
                if (i < lines.length) {
                    line = lines[i];
                    i += 1;
                    x.sentinels.push(sentinels);
                    sentinels = [];
                    new_lines.push(line);
                } else {
                    x.verbatim_error();
                }
            } else if (x.marker!.isSentinel(line)) {
                sentinels.push(line);
            } else {
                x.sentinels.push(sentinels);
                sentinels = [];
                new_lines.push(line);
            }
        }
        x.trailing_sentinels = sentinels;

        return new_lines;
    }
    //@+node:felix.20230410203541.17: *5* x.init_ivars
    /**
     * Init all ivars used by propagate_changed_lines & its helpers.
     */
    public init_ivars(
        new_public_lines: string[],
        old_private_lines: string[],
        marker: Marker
    ): void {
        const x = this;
        [x.delim1, x.delim2] = marker.getDelims();
        x.marker = marker;
        x.old_sent_lines = old_private_lines;
        x.results = [];
        x.verbatim_line = `${x.delim1}@verbatim${x.delim2}\n`;
        const old_public_lines = x.init_data();
        x.b = x.preprocess(new_public_lines);
        x.a = x.preprocess(old_public_lines);
    }
    //@+node:felix.20230410203541.18: *5* x.op_bad
    /**
     * Report an unexpected opcode.
     */
    public op_bad(
        tag: string,
        ai: number,
        aj: number,
        bi: number,
        bj: number
    ): void {
        const x = this;
        x.error(`unknown SequenceMatcher opcode: ${tag}`);
    }
    //@+node:felix.20230410203541.19: *5* x.op_delete
    /**
     * Handle the 'delete' opcode.
     */
    public op_delete(
        tag: string,
        ai: number,
        aj: number,
        bi: number,
        bj: number
    ): void {
        const x = this;
        for (let i = ai; i < aj; i++) {
            x.put_sentinels(i);
        }
    }
    //@+node:felix.20230410203541.20: *5* x.op_equal
    /**
     * Handle the 'equal' opcode.
     */
    public op_equal(
        tag: string,
        ai: number,
        aj: number,
        bi: number,
        bj: number
    ): void {
        const x = this;
        const w_a = x.a.slice(ai, aj);
        const w_b = x.b.slice(bi, bj);
        g.assert(
            aj - ai === bj - bi &&
            w_a.length === w_b.length &&
            w_a.every((value, index) => value === w_b[index])
        );
        for (let i = ai; i < aj; i++) {
            x.put_sentinels(i);
            // works because x.lines[ai:aj] == x.lines[bi:bj]
            x.put_plain_line(x.a[i]);
        }
    }
    //@+node:felix.20230410203541.21: *5* x.op_insert
    /**
     * Handle the 'insert' opcode.
     */
    public op_insert(
        tag: string,
        ai: number,
        aj: number,
        bi: number,
        bj: number
    ): void {
        const x = this;
        for (let i = bi; i < bj; i++) {
            x.put_plain_line(x.b[i]);
        }
        // Prefer to put sentinels after inserted nodes.
        // Requires a call to x.put_sentinels(0) before the main loop.
    }
    //@+node:felix.20230410203541.22: *5* x.op_replace
    /**
     * Handle the 'replace' opcode.
     */
    public op_replace(
        tag: string,
        ai: number,
        aj: number,
        bi: number,
        bj: number
    ): void {
        const x = this;
        if (1) {
            // Intersperse sentinels and lines.
            const b_lines = x.b.slice(bi, bj);
            for (let i = ai; i < aj; i++) {
                x.put_sentinels(i);
                if (b_lines.length) {
                    x.put_plain_line(b_lines.shift()!);
                }
            }
            // Put any trailing lines.
            while (b_lines.length) {
                x.put_plain_line(b_lines.shift()!);
            }
        } else {
            // Feasible. Causes the present unit tests to fail.
            for (let i = ai; i < aj; i++) {
                x.put_sentinels(i);
            }
            for (let i = bi; i < bj; i++) {
                x.put_plain_line(x.b[i]);
            }
        }
    }

    //@+node:felix.20230410203541.23: *5* x.preprocess
    /**
     * Preprocess public lines, adding newlines as needed. This happens before the diff.
     */
    public preprocess(lines: string[]): string[] {
        const result: string[] = [];
        for (let line of lines) {
            if (!line.endsWith('\n')) {
                line = line + '\n';
            }
            result.push(line);
        }
        return result;
    }
    //@+node:felix.20230410203541.24: *5* x.put_plain_line
    /**
     * Put a plain line to x.results, inserting verbatim lines if necessary.
     */
    public put_plain_line(line: string): void {
        const x = this;
        if (x.marker!.isSentinel(line)) {
            x.results.push(x.verbatim_line);
        }
        x.results.push(line);
    }
    //@+node:felix.20230410203541.25: *5* x.put_sentinels
    /**
     * Put all the sentinels to the results
     */
    public put_sentinels(i: number): void {
        const x = this;
        if (0 <= i && i < x.sentinels.length) {
            const sentinels = x.sentinels[i];
            x.results.push(...sentinels);
        }
    }
    //@+node:felix.20230410203541.26: *4* x.propagate_changes
    /**
     * Propagate the changes from the public file (without_sentinels) to the private file (with_sentinels)
     */
    public async propagate_changes(
        old_public_file: string,
        old_private_file: string
    ): Promise<boolean> {
        const x = this;
        const at = this.c.atFileCommands;
        at.errors = 0;
        this.encoding = at.encoding!;
        let s = await at.readFileToUnicode(old_private_file); // Sets at.encoding and inits at.readLines.
        const old_private_lines = g.splitLines(s || ''); // #1466.
        s = await at.readFileToUnicode(old_public_file);
        if (at.encoding !== this.encoding) {
            g.trace(
                `can not happen: encoding mismatch: ${at.encoding} ${this.encoding}`
            );
            at.encoding = this.encoding;
        }
        const old_public_lines = g.splitLines(s);
        // if 0
        //     g.trace(f"\nprivate lines...{old_private_file}")
        //     for s in old_private_lines
        //         g.trace(type(s), isinstance(s, str), repr(s))
        //     g.trace(f"\npublic lines...{old_public_file}")
        //     for s in old_public_lines
        //         g.trace(type(s), isinstance(s, str), repr(s))
        const marker = x.markerFromFileLines(
            old_private_lines,
            old_private_file
        );
        const new_private_lines = x.propagate_changed_lines(
            old_public_lines,
            old_private_lines,
            marker
        );
        // Never create the private file here!
        const fn = old_private_file;
        const exists = await g.os_path_exists(fn);
        const different = new_private_lines !== old_private_lines;
        const copy = exists && different;
        // 2010/01/07: check at.errors also.
        if (copy && x.errors === 0 && at.errors === 0) {
            s = new_private_lines.join('');
            await x.replaceFileWithString(at.encoding, fn, s);
        }
        return copy;
    }
    //@+node:felix.20230410203541.27: *4* x.updatePublicAndPrivateFiles
    /**
     * handle crucial @shadow read logic.
     * This will be called only if the public and private files both exist.
     */
    public async updatePublicAndPrivateFiles(
        root: Position,
        fn: string,
        shadow_fn: string
    ): Promise<void> {
        const x = this;
        const w_isSig = await x.isSignificantPublicFile(fn);
        if (w_isSig) {
            // Update the private shadow file from the public file.
            const written = await x.propagate_changes(fn, shadow_fn);
            if (written) {
                x.message(`updated private ${shadow_fn} from public ${fn}`);
            }
        } else {
            // pass
        }
        // Don't write *anything*.
        // if 0: # This causes considerable problems.
        // # Create the public file from the private shadow file.
        // x.copy_file_removing_sentinels(shadow_fn,fn)
        // x.message("created public %s from private %s " % (fn, shadow_fn))
    }
    //@+node:felix.20230410203541.28: *3* x.Utils...
    //@+node:felix.20230410203541.29: *4* x.error & message & verbatim_error
    public error(s: string, silent = false): void {
        const x = this;
        if (!silent) {
            g.error(s);
        }
        // For unit testing.
        x.errors += 1;
    }
    public message(s: string): void {
        g.es_print(s);
    }
    public verbatim_error(): void {
        const x = this;
        x.error('file syntax error: nothing follows verbatim sentinel');
        g.trace(g.callers());
    }
    //@+node:felix.20230410203541.30: *4* x.markerFromFileLines & helper
    /**
     * Return the sentinel delimiter comment to be used for filename.
     */
    public markerFromFileLines(lines: string[], fn: string): Marker {
        const x = this;
        const at = this.c.atFileCommands;
        const s = x.findLeoLine(lines);
        let ok, junk1, junk2, start, end;
        [ok, junk1, start, end, junk2] = at.parseLeoSentinel(s);
        let delims: [string, string, string];
        if (end) {
            delims = ['', start, end];
        } else {
            delims = [start, '', ''];
        }
        return new Marker(delims);
    }
    //@+node:felix.20230410203541.31: *5* x.findLeoLine
    /**
     * Return the @+leo line, or ''.
     */
    public findLeoLine(lines: string[]): string {
        for (const line of lines) {
            const i = line.indexOf('@+leo');
            if (i !== -1) {
                return line;
            }
        }
        return '';
    }
    //@+node:felix.20230410203541.32: *4* x.markerFromFileName
    /**
     * Return the sentinel delimiter comment to be used for filename.
     */
    public markerFromFileName(filename: string): Marker | undefined {
        const x = this;
        if (!filename) {
            return undefined;
        }
        let root, ext;
        [root, ext] = g.os_path_splitext(filename);
        if (ext === '.tmp') {
            [root, ext] = g.os_path_splitext(root);
        }
        const delims = g.comment_delims_from_extension(filename);
        const marker = new Marker(delims);
        return marker;
    }
    //@+node:felix.20230410203541.33: *4* x.separate_sentinels
    /**
     * Separates regular lines from sentinel lines.
     * Do not return @verbatim sentinels.
     * Returns (regular_lines, sentinel_lines)
     */
    public separate_sentinels(
        lines: string[],
        marker: Marker
    ): [string[], string[]] {
        const x = this;
        const regular_lines: string[] = [];
        const sentinel_lines: string[] = [];
        let i = 0;
        while (i < lines.length) {
            let line = lines[i];
            if (marker.isVerbatimSentinel(line)) {
                // Add the plain line that *looks* like a sentinel,
                // but *not* the preceding @verbatim sentinel itself.
                // Adding the actual sentinel would spoil the sentinel test when
                // the user adds or deletes a line requiring an @verbatim line.
                i += 1;
                if (i < lines.length) {
                    line = lines[i];
                    regular_lines.push(line);
                } else {
                    x.verbatim_error();
                }
            } else if (marker.isSentinel(line)) {
                sentinel_lines.push(line);
            } else {
                regular_lines.push(line);
            }
            i += 1;
        }
        return [regular_lines, sentinel_lines];
    }
    //@+node:felix.20230410203541.34: *4* x.show_error & helper
    public show_error(
        lines1: string[],
        lines2: string[],
        message: string,
        lines1_message: string,
        lines2_message: string
    ): void {
        const x = this;
        const banner1 = '='.repeat(30);
        const banner2 = '-'.repeat(30);
        g.es_print(
            `${banner1}\n${message}\n${banner1}\n${lines1_message}\n${banner2}`
        );
        x.show_error_lines(lines1, 'shadow_errors.tmp1');
        g.es_print(`\n${banner1}\n${lines2_message}\n${banner1}`);
        x.show_error_lines(lines2, 'shadow_errors.tmp2');
        g.es_print('\n@shadow did not pick up the external changes correctly');
    }
    //@+node:felix.20230410203541.35: *5* x.show_error_lines
    public show_error_lines(lines: string[], fileName: string): void {
        for (const [i, line] of lines.entries()) {
            g.es_print(`${i} ${line}`);
        }
    }
    //@-others
}
//@+node:felix.20230410203541.36: ** class x.Marker
/**
 * A class representing comment delims in @shadow files.
 */
export class Marker {
    public delim1: string;
    public delim2: string;
    public delim3: string;

    //@+others
    //@+node:felix.20230410203541.37: *3* ctor & repr
    /**
     * Ctor for Marker class.
     */
    constructor(delims: [string, string, string]) {
        let delim1, delim2, delim3;
        [delim1, delim2, delim3] = delims;
        this.delim1 = delim1; // Single-line comment delim.
        this.delim2 = delim2; // Block comment starting delim.
        this.delim3 = delim3; // Block comment ending delim.
        if (!delim1 && !delim2) {
            this.delim1 = g.app.language_delims_dict['unknown_language'];
        }
    }
    public toString(): string {
        let delims;
        if (this.delim1) {
            delims = this.delim1;
        } else {
            delims = `${this.delim2} ${this.delim3}`;
        }
        return `<Marker: delims: ${delims}>`;
    }
    //@+node:felix.20230410203541.38: *3* getDelims
    /**
     * Return the pair of delims to be used in sentinel lines.
     */
    public getDelims(): [string, string] {
        if (this.delim1) {
            return [this.delim1, ''];
        }
        return [this.delim2, this.delim3];
    }
    //@+node:felix.20230410203541.39: *3* isSentinel
    /**
     * Return True is line s contains a valid sentinel comment.
     */
    public isSentinel(s: string, suffix = ''): boolean {
        s = s.trim();
        if (this.delim1 && s.startsWith(this.delim1)) {
            return s.startsWith(this.delim1 + '@' + suffix);
        }
        if (this.delim2) {
            return (
                s.startsWith(this.delim2 + '@' + suffix) &&
                s.endsWith(this.delim3)
            );
        }
        return false;
    }
    //@+node:felix.20230410203541.40: *3* isVerbatimSentinel
    /**
     * Return True if s is an @verbatim sentinel.
     */
    public isVerbatimSentinel(s: string): boolean {
        return this.isSentinel(s, 'verbatim');
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
