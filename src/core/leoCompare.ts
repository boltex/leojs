//@+leo-ver=5-thin
//@+node:felix.20230430023337.1: * @file src/core/leoCompare.ts
/**
 * Leo's base compare class.
 */
//@+<< leoCompare imports & annotations >>
//@+node:felix.20230430023337.2: ** << leoCompare imports & annotations >>

import * as vscode from 'vscode';
import * as difflib from 'difflib';
import * as g from './leoGlobals';
import { command } from '../core/decorators';
import { Commands } from './leoCommands';
import { VNode, Position } from './leoNodes';

//@-<< leoCompare imports & annotations >>
//@+others
//@+node:felix.20230430023337.3: ** class LeoCompare
/**
 * The base class for Leo's compare code.
 */
export class BaseLeoCompare {
    public c: Commands;
    public appendOutput: boolean;
    public ignoreBlankLines: boolean;
    public ignoreFirstLine1: boolean;
    public ignoreFirstLine2: boolean;
    public ignoreInteriorWhitespace: boolean;
    public ignoreLeadingWhitespace: boolean;
    public ignoreSentinelLines: boolean;
    public limitCount: number;
    public limitToExtension: string;
    public makeWhitespaceVisible: boolean;
    public printBothMatches: boolean;
    public printMatches: boolean;
    public printMismatches: boolean;
    public printTrailingMismatches: boolean;
    // For communication between methods...
    public outputFileName: string;
    //
    public fileName1: string;
    public fileName2: string;
    // Open files...
    public outputFile: string | undefined; // originally BinaryIO, the starting string in leojs

    //@+others
    //@+node:felix.20230430023337.4: *3* compare.__init__
    // All these ivars are known to the LeoComparePanel class.
    constructor(
        commands: Commands,
        options?: {
            appendOutput?: boolean;
            ignoreBlankLines?: boolean;
            ignoreFirstLine1?: boolean;
            ignoreFirstLine2?: boolean;
            ignoreInteriorWhitespace?: boolean;
            ignoreLeadingWhitespace?: boolean;
            ignoreSentinelLines?: boolean;
            limitCount?: number;
            limitToExtension?: string;
            makeWhitespaceVisible?: boolean;
            printBothMatches?: boolean;
            printMatches?: boolean;
            printMismatches?: boolean;
            printTrailingMismatches?: boolean;
            outputFileName?: string;
        }
    ) {
        // It is more convenient for the LeoComparePanel to set these directly.
        this.c = commands;
        this.appendOutput = false;
        this.ignoreBlankLines = true;
        this.ignoreFirstLine1 = false;
        this.ignoreFirstLine2 = false;
        this.ignoreInteriorWhitespace = false;
        this.ignoreLeadingWhitespace = true;
        this.ignoreSentinelLines = false;
        this.limitCount = 0;
        this.limitToExtension = '.py';
        this.makeWhitespaceVisible = true;
        this.printBothMatches = false;
        this.printMatches = false;
        this.printMismatches = true;
        this.printTrailingMismatches = false;
        // For communication between methods...
        this.outputFileName = '';
        if (options) {
            this.appendOutput = !!options.appendOutput;
            this.ignoreFirstLine1 = !!options.ignoreFirstLine1;
            this.ignoreFirstLine2 = !!options.ignoreFirstLine2;
            this.ignoreInteriorWhitespace = !!options.ignoreInteriorWhitespace;
            this.ignoreSentinelLines = !!options.ignoreSentinelLines;
            this.printBothMatches = !!options.printBothMatches;
            this.printMatches = !!options.printMatches;
            this.printTrailingMismatches = !!options.printTrailingMismatches;
            if (options.ignoreBlankLines === false) {
                this.ignoreBlankLines = false;
            }
            if (options.ignoreLeadingWhitespace === false) {
                this.ignoreLeadingWhitespace = false;
            }
            if (options.makeWhitespaceVisible === false) {
                this.makeWhitespaceVisible = false;
            }
            if (options.printMismatches === false) {
                this.printMismatches = false;
            }
            if (options.limitToExtension) {
                this.limitToExtension = options.limitToExtension;
            }
            if (options.outputFileName) {
                this.outputFileName = options.outputFileName;
            }
            if (options.limitCount) {
                this.limitCount = options.limitCount;
            }
        }
        //
        this.fileName1 = '';
        this.fileName2 = '';
        // Open files...
        this.outputFile = undefined; // BinaryIO in leo but intitial string in leojs
    }
    //@+node:felix.20230430023337.5: *3* compare_directories (entry)
    // We ignore the filename portion of path1 and path2 if it exists.
    public async compare_directories(
        path1: string,
        path2: string
    ): Promise<void> {
        // Ignore everything except the directory name.
        let dir1 = g.os_path_dirname(path1);
        let dir2 = g.os_path_dirname(path2);
        dir1 = g.os_path_normpath(dir1);
        dir2 = g.os_path_normpath(dir2);
        let list1: string[];
        let list2: string[];

        if (dir1 === dir2) {
            this.show('Please pick distinct directories.');
            return;
        }
        try {
            const w_uri = g.makeVscodeUri(dir1);
            const w_dirInfo = await vscode.workspace.fs.readDirectory(w_uri);
            list1 = w_dirInfo.map((p_dirInfo) => p_dirInfo[0]);
        } catch (exception) {
            this.show('invalid directory:' + dir1);
            return;
        }
        try {
            const w_uri = g.makeVscodeUri(dir2);
            const w_dirInfo = await vscode.workspace.fs.readDirectory(w_uri);
            list2 = w_dirInfo.map((p_dirInfo) => p_dirInfo[0]);
        } catch (exception) {
            this.show('invalid directory:' + dir2);
            return;
        }
        if (this.outputFileName) {
            await this.openOutputFile();
        }
        const ok = !this.outputFileName || this.outputFile;
        if (!ok) {
            return;
        }
        // Create files and files2, the lists of files to be compared.
        const files1 = [];
        const files2 = [];
        let junk, ext;
        for (const f of list1) {
            [junk, ext] = g.os_path_splitext(f);
            if (this.limitToExtension) {
                if (ext === this.limitToExtension) {
                    files1.push(f);
                }
            } else {
                files1.push(f);
            }
        }
        for (const f of list2) {
            [junk, ext] = g.os_path_splitext(f);
            if (this.limitToExtension) {
                if (ext === this.limitToExtension) {
                    files2.push(f);
                }
            } else {
                files2.push(f);
            }
        }
        // Compare the files and set the yes, no and missing lists.
        const missing1: string[] = [];
        const missing2: string[] = [];
        const no: string[] = [];
        const yes: string[] = [];
        let head, f2, name1, name2;
        for (const f1 of files1) {
            [head, f2] = g.os_path_split(f1);
            if (files2.includes(f2)) {
                try {
                    name1 = g.os_path_join(dir1, f1);
                    name2 = g.os_path_join(dir2, f2);
                    const val = await g.filecmp_cmp(name1, name2, false);
                    if (val) {
                        yes.push(f1);
                    } else {
                        no.push(f1);
                    }
                } catch (exception) {
                    this.show('exception in filecmp.cmp');
                    g.es_exception();
                    missing1.push(f1);
                }
            } else {
                missing1.push(f1);
            }
        }
        for (const f2 of files2) {
            let f1;
            [head, f1] = g.os_path_split(f2);
            if (!files1.includes(f1)) {
                missing2.push(f1);
            }
        }
        // Print the results.
        const table: [string, string[]][] = [
            ['----- matches --------', yes],
            ['----- mismatches -----', no],
            ['----- not found 1 ------', missing1],
            ['----- not found 2 ------', missing2],
        ];
        for (let [kind, files] of table) {
            this.show(kind);
            for (const f of files) {
                this.show(f);
            }
        }

        if (this.outputFile) {
            // WRITE WHAT ACCUMULATED IN this.outputFile !
            const w_uri = g.makeVscodeUri(this.outputFileName);
            const writeData = Buffer.from(this.outputFile, 'utf8');
            await vscode.workspace.fs.writeFile(w_uri, writeData);

            // this.outputFile.close()
            this.outputFile = undefined;
        }
    }
    //@+node:felix.20230430023337.6: *3* compare_files (entry)
    public compare_files(name1: string, name2: string): Promise<void> {
        if (name1 === name2) {
            this.show('File names are identical.\nPlease pick distinct files.');
            return Promise.resolve();
        }
        return this.compare_two_files(name1, name2);
    }
    //@+node:felix.20230430023337.7: *3* compare_list_of_files (entry for scripts)
    public async compare_list_of_files(aList1: string[]): Promise<void> {
        const aList = [...new Set(aList1)];
        while (aList.length > 1) {
            const path1 = aList[0];
            for (const path2 of aList.slice(1)) {
                g.trace('COMPARE', path1, path2);
                await this.compare_two_files(path1, path2);
            }
        }
    }
    //@+node:felix.20230430023337.8: *3* compare_two_files
    /**
     * A helper function.
     */
    public async compare_two_files(
        name1: string,
        name2: string
    ): Promise<void> {
        let f1;
        let f2;

        try {
            f1 = await this.doOpen(name1);
            f2 = await this.doOpen(name2);
            if (this.outputFileName) {
                await this.openOutputFile();
            }

            const ok = !this.outputFileName || this.outputFile;
            const ok1 = ok && (ok as any) !== 0 ? 1 : 0;

            if (f1 && f1.length && f2 && f2.length && ok1) {
                // Don't compare if there is an error opening the output file.
                await this.compare_open_files(f1, f2, name1, name2);
            }
        } catch (exception) {
            this.show('exception comparing files');
            g.es_exception();
        }

        try {
            if (f1) {
                // f1.close();
            }
            if (f2) {
                // f2.close();
            }
            if (this.outputFile) {
                // this.outputFile.close();
                this.outputFile = undefined;
            }
        } catch (exception) {
            this.show('exception closing files');
            g.es_exception(exception);
        }
    }
    //@+node:felix.20230430023337.9: *3* compare_lines
    public compare_lines(s1: string, s2: string): boolean {
        if (this.ignoreLeadingWhitespace) {
            s1 = s1.trimStart();
            s2 = s2.trimStart();
        }
        if (this.ignoreInteriorWhitespace) {
            const k1 = g.skip_ws(s1, 0);
            const k2 = g.skip_ws(s2, 0);
            const ws1 = s1.substring(0, k1);
            const ws2 = s2.substring(0, k2);
            let tail1 = s1.substring(k1);
            let tail2 = s2.substring(k2);
            tail1 = tail1.replace(/ /g, '').replace(/\t/g, '');
            tail2 = tail2.replace(/ /g, '').replace(/\t/g, '');
            s1 = ws1 + tail1;
            s2 = ws2 + tail2;
        }
        return s1 === s2;
    }
    //@+node:felix.20230430023337.10: *3* compare_open_files
    public async compare_open_files(
        f1: string[],
        f2: string[],
        name1: string,
        name2: string
    ): Promise<void> {
        // this.show("compare_open_files")
        let lines1 = 0;
        let lines2 = 0;
        let mismatches = 0;
        let printTrailing = true;
        let sentinelComment1: string | undefined;
        let sentinelComment2: string | undefined;
        if (await this.openOutputFile()) {
            this.show('1: ' + name1);
            this.show('2: ' + name2);
            this.show('');
        }
        let s1: string | undefined;
        let s2: string | undefined;
        let n1 = 0;
        let n2 = 0;
        let z1;
        let z2;

        //@+<< handle opening lines >>
        //@+node:felix.20230430023337.11: *4* << handle opening lines >>
        if (this.ignoreSentinelLines) {
            s1 = g.readlineForceUnixNewline(f1);
            lines1 += 1;
            s2 = g.readlineForceUnixNewline(f2);
            lines2 += 1;
            // Note: isLeoHeader may return None.
            sentinelComment1 = this.isLeoHeader(s1);
            sentinelComment2 = this.isLeoHeader(s2);
            if (!sentinelComment1) {
                this.show('no @+leo line for ' + name1);
            }
            if (!sentinelComment2) {
                this.show('no @+leo line for ' + name2);
            }
        }
        if (this.ignoreFirstLine1) {
            if (s1 == null) {
                g.readlineForceUnixNewline(f1);
                lines1 += 1;
            }
            s1 = undefined;
        }
        if (this.ignoreFirstLine2) {
            if (s2 == null) {
                g.readlineForceUnixNewline(f2);
                lines2 += 1;
            }
            s2 = undefined;
        }
        //@-<< handle opening lines >>

        while (1) {
            if (s1 == null) {
                s1 = g.readlineForceUnixNewline(f1);
                lines1 += 1;
            }
            if (s2 == null) {
                s2 = g.readlineForceUnixNewline(f2);
                lines2 += 1;
            }

            //@+<< ignore blank lines and/or sentinels >>
            //@+node:felix.20230430023337.12: *4* << ignore blank lines and/or sentinels >>
            // Completely empty strings denotes end-of-file.
            if (s1) {
                if (this.ignoreBlankLines && s1.trim() === '') {
                    s1 = undefined;
                    continue;
                }
                if (
                    this.ignoreSentinelLines &&
                    sentinelComment1 &&
                    this.isSentinel(s1, sentinelComment1)
                ) {
                    s1 = undefined;
                    continue;
                }
            }
            if (s2) {
                if (this.ignoreBlankLines && s2.trim() === '') {
                    s2 = undefined;
                    continue;
                }
                if (
                    this.ignoreSentinelLines &&
                    sentinelComment2 &&
                    this.isSentinel(s2, sentinelComment2)
                ) {
                    s2 = undefined;
                    continue;
                }
            }
            //@-<< ignore blank lines and/or sentinels >>

            n1 = s1.length;
            n2 = s2.length;
            if (n1 === 0 && n2 !== 0) {
                this.show('1.eof***:');
            }
            if (n2 === 0 && n1 !== 0) {
                this.show('2.eof***:');
            }
            if (n1 === 0 || n2 === 0) {
                break;
            }
            const match = this.compare_lines(s1, s2);
            if (!match) {
                mismatches += 1;
            }

            //@+<< print matches and/or mismatches >>
            //@+node:felix.20230430023337.13: *4* << print matches and/or mismatches >>
            if (this.limitCount === 0 || mismatches <= this.limitCount) {
                if (match && this.printMatches) {
                    if (this.printBothMatches) {
                        z1 = '1.' + lines1.toString();
                        z2 = '2.' + lines2.toString();
                        this.dump(g.rjust(z1, 6) + ' :', s1);
                        this.dump(g.rjust(z2, 6) + ' :', s2);
                    } else {
                        this.dump(g.rjust(lines1.toString(), 6) + ' :', s1);
                    }
                }

                if (!match && this.printMismatches) {
                    z1 = '1.' + lines1.toString();
                    z2 = '2.' + lines2.toString();
                    this.dump(g.rjust(z1, 6) + '*:', s1);
                    this.dump(g.rjust(z2, 6) + '*:', s2);
                }
            }
            //@-<< print matches and/or mismatches >>
            //@+<< warn if mismatch limit reached >>
            //@+node:felix.20230430023337.14: *4* << warn if mismatch limit reached >>
            if (this.limitCount > 0 && mismatches >= this.limitCount) {
                if (printTrailing) {
                    this.show('');
                    this.show('limit count reached');
                    this.show('');
                    printTrailing = false;
                }
            }
            //@-<< warn if mismatch limit reached >>

            s1 = undefined;
            s2 = undefined; // force a read of both lines.
        }

        //@+<< handle reporting after at least one eof is seen >>
        //@+node:felix.20230430023337.15: *4* << handle reporting after at least one eof is seen >>
        if (n1 > 0) {
            lines1 += this.dumpToEndOfFile('1.', f1, s1, lines1, printTrailing);
        }
        if (n2 > 0) {
            lines2 += this.dumpToEndOfFile('2.', f2, s2, lines2, printTrailing);
        }
        this.show('');
        this.show('lines1:' + lines1.toString());
        this.show('lines2:' + lines2.toString());
        this.show('mismatches:' + mismatches.toString());
        //@-<< handle reporting after at least one eof is seen >>
    }
    //@+node:felix.20230430023337.16: *3* compare.filecmp
    public async filecmp(f1: string, f2: string): Promise<boolean> {
        const val = await g.filecmp_cmp(f1, f2);
        if (val) {
            this.show('equal');
        } else {
            this.show('*** not equal');
        }
        return val;
    }
    //@+node:felix.20230430023337.17: *3* compare.utils...
    //@+node:felix.20230430023337.18: *4* compare.doOpen
    public async doOpen(name: string): Promise<string[] | undefined> {
        try {
            const w_uri = g.makeVscodeUri(name);
            const content = await vscode.workspace.fs.readFile(w_uri);
            const s = g.toUnicode(content);

            // .split(/\r?\n/);
            const arrWithDelimiters = s.split(/(\r?\n)/g);

            // Concatenate pairs of adjacent entries and add the delimiter at the end
            const concatenatedArr = [];
            for (let i = 0; i < arrWithDelimiters.length; i += 2) {
                if (i + 1 < arrWithDelimiters.length) {
                    concatenatedArr.push(
                        arrWithDelimiters[i] + arrWithDelimiters[i + 1]
                    );
                } else {
                    // Add the last entry if it doesn't have a pair
                    concatenatedArr.push(arrWithDelimiters[i]);
                }
            }
            return concatenatedArr;
        } catch (exception) {
            this.show('can not open:' + '"' + name + '"');
            return undefined;
        }
    }
    //@+node:felix.20230430023337.19: *4* compare.dump
    public dump(tag: string, s: string): void {
        const compare = this;
        let out = tag;
        for (let i = 0; i < s.length - 1; i++) {
            let ch = s.slice(i, i + 1);
            if (compare.makeWhitespaceVisible) {
                if (ch === '\t') {
                    out += '[';
                    out += 't';
                    out += ']';
                } else if (ch === ' ') {
                    out += '[';
                    out += ' ';
                    out += ']';
                } else {
                    out += ch;
                }
            } else {
                out += ch;
            }
        }
        this.show(out);
    }
    //@+node:felix.20230430023337.20: *4* compare.dumpToEndOfFile
    public dumpToEndOfFile(
        tag: string,
        f: string[],
        s: string | undefined,
        line: number,
        printTrailing: boolean
    ): number {
        let trailingLines = 0;
        while (1) {
            if (!s) {
                s = g.readlineForceUnixNewline(f);
            }
            if (!s) {
                break;
            }
            trailingLines += 1;
            if (this.printTrailingMismatches && printTrailing) {
                const z = tag + line.toString();
                const tag2 = g.rjust(z, 6) + '+:';
                this.dump(tag2, s);
            }
            s = undefined;
        }
        this.show(tag + trailingLines.toString() + ' trailing lines');
        return trailingLines;
    }
    //@+node:felix.20230430023337.21: *4* compare.isLeoHeader & isSentinel
    //@+at These methods are based on AtFile.scanHeader(). They are simpler
    // because we only care about the starting sentinel comment: any line
    // starting with the starting sentinel comment is presumed to be a
    // sentinel line.
    //@@c

    public isLeoHeader(s: string): string | undefined {
        const tag = '@+leo';
        const j = s.indexOf(tag);
        if (j > 0) {
            const i = g.skip_ws(s, 0);
            if (i < j) {
                return s.slice(i, j);
            }
        }
        return undefined;
    }
    public isSentinel(s: string, sentinelComment: string): boolean {
        const i = g.skip_ws(s, 0);
        return g.match(s, i, sentinelComment);
    }
    //@+node:felix.20230430023337.22: *4* compare.openOutputFile
    public async openOutputFile(): Promise<boolean> {
        // Bug fix: return a bool.
        if (this.outputFileName == null) {
            return false;
        }
        let [theDir, name] = g.os_path_split(this.outputFileName);

        if (!theDir) {
            this.show('empty output directory');
            return false;
        }
        if (!name) {
            this.show('empty output file name');
            return false;
        }
        const w_exists = await g.os_path_exists(theDir);
        if (!w_exists) {
            this.show('output directory not found: ' + theDir);
            return false;
        }
        try {
            if (this.appendOutput) {
                this.show('appending to ' + this.outputFileName);
                // this.outputFile = open(this.outputFileName, "ab");
                const w_uri = g.makeVscodeUri(this.outputFileName);
                const content = await vscode.workspace.fs.readFile(w_uri);
                this.outputFile = g.toUnicode(content);
            } else {
                this.show('writing to ' + this.outputFileName);

                // this.outputFile = open(this.outputFileName, "wb");

                // replace
                this.outputFile = ''; // START EMPTY
            }
            return true;
        } catch (exception) {
            this.outputFile = undefined;
            this.show('exception opening output file');
            g.es_exception();
            return false;
        }
    }
    //@+node:felix.20230430023337.23: *4* compare.show
    public show(s: string): void {
        // g.pr(s)
        if (this.outputFile) {
            // this.outputFile is opened in 'wb' mode.
            // this.outputFile.write(g.toEncodedString(s + '\n'))
            this.outputFile = this.outputFile + s;
        } else if (this.c) {
            g.es(s);
        } else {
            g.pr(s);
            g.pr('');
        }
    }
    //@+node:felix.20230430023337.24: *4* compare.showIvars
    public showIvars(): void {
        this.show('fileName1:' + this.fileName1.toString());
        this.show('fileName2:' + this.fileName2.toString());
        this.show('outputFileName:' + this.outputFileName.toString());
        this.show('limitToExtension:' + this.limitToExtension.toString());
        this.show('');
        this.show('ignoreBlankLines:' + this.ignoreBlankLines.toString());
        this.show('ignoreFirstLine1:' + this.ignoreFirstLine1.toString());
        this.show('ignoreFirstLine2:' + this.ignoreFirstLine2.toString());
        this.show(
            'ignoreInteriorWhitespace:' +
            this.ignoreInteriorWhitespace.toString()
        );
        this.show(
            'ignoreLeadingWhitespace:' + this.ignoreLeadingWhitespace.toString()
        );
        this.show('ignoreSentinelLines:' + this.ignoreSentinelLines.toString());
        this.show('');
        this.show('limitCount:' + this.limitCount.toString());
        this.show('printMatches:' + this.printMatches.toString());
        this.show('printMismatches:' + this.printMismatches.toString());
        this.show(
            'printTrailingMismatches:' + this.printTrailingMismatches.toString()
        );
    }
    //@-others
}

/**
 * A class containing Leo's compare code.
 *
 * These are not very useful comparisons.
 */
export class LeoCompare extends BaseLeoCompare {
    // pass
}
//@+node:felix.20230430023337.25: ** class CompareLeoOutlines
/**
 * A class to do outline-oriented diffs of two or more .leo files.
 * Similar to GitDiffController, adapted for use by scripts.
 */
export class CompareLeoOutlines {
    public c: Commands;
    public file_node: Position | undefined;
    public root: Position | undefined;
    public path1: string | undefined;
    public path2: string | undefined;
    public visible: boolean = false;

    /**
     * Ctor for the LeoOutlineCompare class.
     */
    constructor(c: Commands) {
        this.c = c;
        this.file_node = undefined;
        this.root = undefined;
        this.path1 = undefined;
        this.path2 = undefined;
    }

    //@+others
    //@+node:felix.20230430023337.26: *3* loc.diff_list_of_files (entry)
    /**
     * The main entry point for scripts.
     */
    public async diff_list_of_files(
        aList: string[],
        visible = true
    ): Promise<void> {
        if (aList.length < 2) {
            g.trace('Not enough files in', aList.toString());
            return;
        }
        const c = this.c;
        const u = this.c.undoer;

        const undoType = 'diff-files';
        c.selectPosition(c.lastTopLevel());
        const undoData = u.beforeInsertNode(c.p);
        this.root = this.create_root(aList);
        this.visible = visible;
        while (aList.length > 1) {
            const path1 = aList[0];
            aList = aList.slice(1);
            for (const path2 of aList) {
                await this.diff_two_files(path1, path2); // adds to this.root
            }
        }
        u.afterInsertNode(this.root, undoType, undoData);
        this.finish();
    }
    //@+node:felix.20230430023337.27: *3* loc.diff_two_files
    /**
     * Create an outline describing the git diffs for fn.
     */
    public async diff_two_files(fn1: string, fn2: string): Promise<void> {
        this.path1 = fn1;
        this.path2 = fn2;
        const s1 = await this.get_file(fn1);
        const s2 = await this.get_file(fn2);
        const lines1 = g.splitLines(s1);
        const lines2 = g.splitLines(s2);
        const diff_list = difflib.unifiedDiff(lines1, lines2, {
            fromfile: fn1,
            tofile: fn2,
        });
        diff_list.splice(0, 0, '@language patch\n');
        this.file_node = this.create_file_node(diff_list, fn1, fn2);
        // These will be left open
        const c1 = await this.open_outline(fn1);
        const c2 = await this.open_outline(fn2);
        if (c1 && c2) {
            this.make_diff_outlines(c1, c2);
            this.file_node.b =
                `${this.file_node.b.trimEnd()}\n` +
                `@language ${c2.target_language}\n`;
        }
    }
    //@+node:felix.20230430023337.28: *3* loc.Utils
    //@+node:felix.20230430023337.29: *4* loc.compute_dicts
    /**
     * Compute inserted, deleted, changed dictionaries.
     */
    public compute_dicts(
        c1: Commands,
        c2: Commands
    ): [
            { [key: string]: VNode },
            { [key: string]: VNode },
            { [key: string]: [VNode, VNode] }
        ] {
        const d1: { [key: string]: VNode } = [...c1.all_unique_nodes()].reduce(
            (acc: { [key: string]: VNode }, v: VNode) => {
                acc[v.fileIndex] = v;
                return acc;
            },
            {}
        );
        const d2: { [key: string]: VNode } = [...c2.all_unique_nodes()].reduce(
            (acc: { [key: string]: VNode }, v: VNode) => {
                acc[v.fileIndex] = v;
                return acc;
            },
            {}
        );
        const added: { [key: string]: VNode } = Object.keys(d2).reduce(
            (acc: { [key: string]: VNode }, key) => {
                if (!d1[key]) {
                    acc[key] = d2[key];
                }
                return acc;
            },
            {}
        );
        const deleted: { [key: string]: VNode } = Object.keys(d1).reduce(
            (acc: { [key: string]: VNode }, key) => {
                if (!d2[key]) {
                    acc[key] = d1[key];
                }
                return acc;
            },
            {}
        );
        const changed: { [key: string]: [VNode, VNode] } = {};
        for (const key in d1) {
            if (key in d2) {
                const v1 = d1[key];
                const v2 = d2[key];
                if (v1.context !== v2.context) {
                    if (v1.h !== v2.h || v1.b !== v2.b) {
                        changed[key] = [v1, v2];
                    }
                }
            }
        }
        return [added, deleted, changed];
    }
    //@+node:felix.20230430023337.30: *4* loc.create_compare_node
    /**
     * Create nodes describing the changes.
     */
    public create_compare_node(
        c1: Commands,
        c2: Commands,
        d: { [key: string]: [VNode, VNode] | VNode },
        kind: string
    ): void {
        if (!d || !Object.keys(d).length) {
            return;
        }
        const parent = this.file_node!.insertAsLastChild();
        parent.setHeadString(kind);
        for (const key in d) {
            // USE 'in' FOR KEYS !
            if (kind.toLowerCase() === 'changed') {
                let [v1, v2] = d[key] as [VNode, VNode];
                // Organizer node: contains diff
                const organizer = parent.insertAsLastChild();
                organizer.h = v2.h;

                let body = difflib.unifiedDiff(
                    g.splitLines(v1.b),
                    g.splitLines(v2.b),
                    {
                        fromfile: this.path1,
                        tofile: this.path2,
                    }
                );
                // body = list(difflib.unified_diff(
                //     g.splitLines(v1.b),
                //     g.splitLines(v2.b),
                //     this.path1,
                //     this.path2,
                // ));

                if (body.join('').trim()) {
                    body.unshift('@language patch\n');
                    body.push(`@language ${c2.target_language}\n`);
                } else {
                    body = ['Only headline has changed'];
                }
                organizer.b = body.join('');
                // Node 1:
                const p1 = organizer.insertAsLastChild();
                p1.h = '1:' + v1.h;
                p1.b = v1.b;
                // Node 2:
                g.assert(v1.fileIndex === v2.fileIndex);
                const p2 = organizer.insertAsLastChild();
                p2.h = '2:' + v2.h;
                p2.b = v2.b;
            } else {
                const v = d[key] as VNode;
                const p = parent.insertAsLastChild();
                p.h = v.h;
                p.b = v.b;
            }
        }
    }
    //@+node:felix.20230430023337.31: *4* loc.create_file_node
    /**
     * Create an organizer node for the file.
     */
    public create_file_node(
        diff_list: string[],
        fn1: string,
        fn2: string
    ): Position {
        const p = this.root!.insertAsLastChild();
        p.h = `${g.shortFileName(fn1).trim()}, ${g.shortFileName(fn2).trim()}`;
        p.b = diff_list.join('');
        return p;
    }
    //@+node:felix.20230430023337.32: *4* loc.create_root
    /**
     * Create the top-level organizer node describing all the diffs.
     */
    public create_root(aList: string[]): Position {
        const c = this.c;

        // const u = this.c.undoer;
        // const undoType = 'Create diff root node'; // Same undoType is reused for all inner undos
        // c.selectPosition(c.lastTopLevel()); // pre-select to help undo-insert
        // const undoData = u.beforeInsertNode(c.p); // c.p is subject of 'insertAfter'

        const p = c.lastTopLevel().insertAfter();
        p.h = 'diff-leo-files';
        p.b = aList.join('\n') + '\n';

        // u.afterInsertNode(p, undoType, undoData);
        return p;
    }
    //@+node:felix.20230430023337.33: *4* loc.finish
    /**
     * Finish execution of this command.
     */
    public finish(): void {
        const c = this.c;
        if ((g.app.gui as any)['frameFactory']) {
            const tff = (g.app.gui as any)['frameFactory'];
            tff.setTabForCommander(c);
        }
        c.selectPosition(this.root!);
        this.root!.expand();
        c.bodyWantsFocus();
        c.redraw();
    }
    //@+node:felix.20230430023337.34: *4* loc.get_file
    /**
     * Return the contents of the file whose path is given.
     */
    public async get_file(p_path: string): Promise<string> {
        // with open(p_path, 'rb') as f
        //     s = f.read()
        const w_uri = g.makeVscodeUri(p_path);
        const s = await vscode.workspace.fs.readFile(w_uri);

        return g.toUnicode(s).replace(/\r/g, '');
    }
    //@+node:felix.20230430023337.35: *4* loc.make_diff_outlines
    /**
     * Create an outline-oriented diff from the outlines c1 and c2.
     */
    public make_diff_outlines(c1: Commands, c2: Commands): void {
        let [added, deleted, changed] = this.compute_dicts(c1, c2);
        const table: [{ [key: string]: VNode | [VNode, VNode] }, string][] = [
            [added, 'Added'],
            [deleted, 'Deleted'],
            [changed, 'Changed'],
        ];

        for (let [d, kind] of table) {
            this.create_compare_node(c1, c2, d, kind);
        }
    }
    //@+node:felix.20230430023337.36: *4* loc.open_outline
    /**
     *  Find the commander for fn, creating a new outline tab if necessary.
     *
     * Using open commanders works because we always read entire .leo files.
     */
    public open_outline(fn: string): Promise<Commands | undefined> {
        for (const frame of g.app.windowList) {
            if (frame.c.fileName() === fn) {
                return Promise.resolve(frame.c);
            }
        }
        const gui = this.visible ? undefined : g.app.nullGui;
        return g.openWithFileName(fn, undefined, gui);
    }
    //@-others
}
//@+node:felix.20230430023337.37: ** class TopLevelCompareCommands
export class TopLevelCompareCommands {
    //@+others
    //@+node:felix.20230430023337.38: *3* @g.command(diff-and-open-leo-files)
    @command(
        'diff-and-open-leo-files',
        'Open a dialog prompting for two or more .leo files.' +
        "Opens all the files and creates a top-level node in c's outline showing" +
        'the diffs of those files, two at a time.'
    )
    public diff_and_open_leo_files(this: Commands): Promise<void> {
        return diff_leo_files_helper(this, 'Diff And Open Leo Files', true);
    }
    //@+node:felix.20230430023337.39: *3* @g.command(diff-leo-files)
    @command(
        'diff-leo-files',
        'Open a dialog prompting for two or more .leo files.' +
        'Creates a top-level node showing the diffs of those files, two at a time.'
    )
    public diff_leo_files(this: Commands): Promise<void> {
        return diff_leo_files_helper(this, 'Diff Leo Files', false);
    }
    //@+node:felix.20230430023337.40: *3* @g.command(diff-marked-nodes)
    @command(
        'diff-marked-nodes',
        'When two or more nodes are marked, this command creates a' +
        '"diff marked node" as the last top-level node. The body of' +
        'this node contains "diff n" nodes, one for each pair of compared' +
        'nodes.' +
        'Each diff n contains the diffs between the two diffed nodes, that is,' +
        'difflib.Differ().compare(p1.b, p2.b).' +
        'The children of the diff n are clones of the two compared nodes.'
    )
    public diffMarkedNodes(this: Commands): void {
        const c = this; // event and event.get('c')
        if (!c) {
            return;
        }
        const u = c.undoer;
        const undoType = 'diff-marked-nodes'; // Same undoType is reused for all inner undos

        let aList = [...c.all_unique_positions()].filter((z) => z.isMarked());

        if (aList.length < 2) {
            g.es_print('Please mark at least 2 nodes');
            return;
        }
        c.selectPosition(c.lastTopLevel());
        const undoData = u.beforeInsertNode(c.p);
        const root = c.lastTopLevel().insertAfter();
        root.h = 'diff marked nodes';
        root.b = aList.map((z) => z.h).join('\n') + '\n';
        let n = 0;

        while (aList.length > 1) {
            n += 1;
            let [p1, p2] = [aList[0], aList[1]];
            aList = aList.slice(1);
            const lines = new difflib.Differ().compare(
                g.splitLines(p1.b.trimEnd() + '\n'),
                g.splitLines(p2.b.trimEnd() + '\n')
            );
            const p = root.insertAsLastChild();
            p.h = `diff ${n}`;
            p.b = `1: ${p1.h}\n2: ${p2.h}\n${lines.join('')}`;
            for (const p3 of [p1, p2]) {
                const clone = p3.clone();
                clone.moveToLastChildOf(p);
            }
        }
        u.afterInsertNode(root, undoType, undoData);
        root.expand();
        c.selectPosition(root);
        c.redraw();

        /*
        let n = 0;
        if (aList.length >= 2) {
            u.beforeChangeGroup(c.p, undoType); // going to perform many operations

            c.selectPosition(c.lastTopLevel()); // pre-select to help undo-insert
            let undoData = u.beforeInsertNode(c.p); // c.p is subject of 'insertAfter'
            const root = c.lastTopLevel().insertAfter();
            root.h = 'diff marked nodes';
            root.b = aList.map((z) => z.h).join('\n') + '\n';
            u.afterInsertNode(root, 'Create diff root node', undoData);

            while (aList.length > 1) {
                n += 1;
                let [p1, p2] = [aList[0], aList[1]];
                aList = aList.slice(1);

                const lines = new difflib.Differ().compare(
                    g.splitLines(p1.b.trimEnd() + '\n'),
                    g.splitLines(p2.b.trimEnd() + '\n')
                );

                undoData = u.beforeInsertNode(c.p); // c.p is subject of 'insertAfter'
                const p = root.insertAsLastChild();
                // p.h = 'Compare: %s, %s' % (g.truncate(p1.h, 22), g.truncate(p2.h, 22))
                p.h = `diff ${n}`;
                p.b = `1: ${p1.h}\n2: ${p2.h}\n${lines.join('')}`;
                u.afterInsertNode(p, undoType, undoData);

                undoData = u.beforeChangeTree(p);
                for (const p3 of [p1, p2]) {
                    const clone = p3.clone();
                    clone.moveToLastChildOf(p);
                }
                u.afterChangeTree(p, undoType, undoData);
            }
            root.expand();
            // c.unmarkAll()
            c.selectPosition(root);
            // Add the changes to the outer undo group.
            u.afterChangeGroup(c.p, undoType);
            c.redraw();
        } else {
            g.es_print('Please mark at least 2 nodes');
        }
        */

    }
    //@-others
}
//@+node:felix.20230430023337.41: ** diff_leo_files_helper
/**
 * Prompt for a list of Leo files to open.
 */
export async function diff_leo_files_helper(
    c: Commands,
    title: string,
    visible: boolean
): Promise<void> {
    if (!c) {
        return;
    }
    const types: [string, string][] = [
        ['Leo files', '*.leo *.leojs *.db'],
        ['All files', '*'],
    ];
    const w_paths = await g.app.gui.runOpenFileDialog(
        c,
        title,
        types,
        '.leo',
        true
    ) as string[];

    if (!w_paths || !w_paths.length) {
        return;
    }

    if (w_paths.length === 1) {
        // Prompt for another file.
        const paths2 = await g.app.gui.runOpenFileDialog(
            c,
            title,
            types,
            ".leo",
            true,
        ) as string[];

        if (!paths2 || !paths2.length) {
            return;
        }
        w_paths.push(...paths2);
    }


    c.bringToFront();

    // w_paths = [z for z in w_paths if g.os_path_exists(z)]
    // if (w_paths.length > 1) {
    //     await new CompareLeoOutlines(c).diff_list_of_files(
    //         w_paths as string[],
    //         visible
    //     );
    // } else if (w_paths.length === 1) {
    //     g.es_print('Please pick two or more .leo files');
    // }

    // g.assert( w_paths.length > 1);

    if (!w_paths || w_paths.length < 2) {
        g.es_print('Please pick two or more .leo files');
        return;
    }

    await new CompareLeoOutlines(c).diff_list_of_files(w_paths as string[], visible);


}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
