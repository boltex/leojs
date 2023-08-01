//@+leo-ver=5-thin
//@+node:felix.20220105221256.1: * @file src/core/leoImport.ts
//@+<< leoImport imports >>
//@+node:felix.20230510231730.1: ** << leoImport imports >>
import * as vscode from 'vscode';
import { Utils as uriUtils } from 'vscode-uri';
import * as utils from '../utils';

import * as os from 'os';
import * as csv from 'csvtojson';
import * as safeJsonStringify from 'safe-json-stringify';
import * as path from 'path';

const docutils = false;

const lxml = false;

// Leo imports...
import * as g from './leoGlobals';
import { command } from '../core/decorators';
import { Commands } from './leoCommands';
import { Position, VNode } from './leoNodes';
import { Bead } from './leoUndo';
//@-<< leoImport imports >>
//@+others
//@+node:felix.20230519221548.1: ** class FreeMindImporter
/**
 * Importer class for FreeMind (.mmap) files.
 */
export class FreeMindImporter {
    public c: Commands;
    public count: number;

    /**
     * ctor for FreeMind Importer class.
     */
    constructor(c: Commands) {
        this.c = c;
        this.count = 0;
    }

    //@+others
    //@+node:felix.20230519221548.2: *3* freemind.add_children
    /**
     * parent is the parent position, element is the parent element.
     * Recursively add all the child elements as descendants of parent_p.
     */
    public add_children(parent: Position, element: any): void {
        const p = parent.insertAsLastChild();

        // TODO : FIX THIS !
        const attrib_text = element.attrib.get('text', '').trim();

        const tag = typeof element.tag === 'string' ? element.tag : '';
        let text = element.text || '';
        if (!tag) {
            text = text.trim();
        }
        p.h = attrib_text || tag || 'Comment';
        p.b = text.trim() ? text : '';
        for (const child of element) {
            this.add_children(p, child);
        }
    }
    //@+node:felix.20230519221548.3: *3* freemind.create_outline
    /**
     * Create a tree of nodes from a FreeMind file.
     */
    public async create_outline(p_path: string): Promise<Position> {
        const c = this.c;
        let [junk, fileName] = g.os_path_split(p_path);
        const undoData = c.undoer.beforeInsertNode(c.p);
        try {
            await this.import_file(p_path);
            c.undoer.afterInsertNode(c.p, 'Import', undoData);
        } catch (exception) {
            g.es_print(
                'Exception importing FreeMind file',
                g.shortFileName(p_path)
            );
            g.es_exception(exception);
        }
        return c.p;
    }
    //@+node:felix.20230519221548.4: *3* freemind.import_file
    /**
     * The main line of the FreeMindImporter class.
     */
    public async import_file(p_path: string): Promise<void> {
        const c = this.c;
        const sfn = g.shortFileName(p_path);
        const w_exists = await g.os_path_exists(p_path);
        if (w_exists) {
            // TODO : Fix This
            const htmltree = (lxml as any).html.parse(p_path);
            const root = htmltree.getroot();
            const body = root.findall('body')[0];

            if (body == null) {
                g.error(`no body in: ${sfn}`);
            } else {
                const root_p = c.lastTopLevel().insertAfter();
                root_p.h = g.shortFileName(p_path);
                for (const child of body) {
                    if (child !== body) {
                        this.add_children(root_p, child);
                    }
                }
                c.selectPosition(root_p);
                c.redraw();
            }
        } else {
            g.error(`file not found: ${sfn}`);
        }
    }
    //@+node:felix.20230519221548.5: *3* freemind.import_files
    /**
     * Import a list of FreeMind (.mmap) files.
     */
    public async import_files(files: string[]): Promise<void> {
        const c = this.c;

        if (files && files.length) {
            let p;
            for (const fileName of files) {
                g.setGlobalOpenDir(fileName);
                p = await this.create_outline(fileName);
                p.contract();
                p.setDirty();
                c.setChanged();
            }
            c.redraw(p);
        }
    }
    //@+node:felix.20230519221548.6: *3* freemind.prompt_for_files
    /**
     * Prompt for a list of FreeMind (.mm.html) files and import them.
     */
    public async prompt_for_files(): Promise<void> {
        if (!lxml) {
            g.trace('FreeMind importer requires lxml');
            return;
        }
        const c = this.c;
        const types: [string, string][] = [
            ['FreeMind files', '*.mm.html'],
            ['All files', '*'],
        ];
        const names = (await g.app.gui.runOpenFileDialog(
            c,
            'Import FreeMind File',
            types,
            '.html',
            true
        )) as string[];

        // c.bringToFront();

        if (names && names.length) {
            await g.chdir(names[0]);
            await this.import_files(names);
        }
    }
    //@-others
}
//@+node:felix.20230511002352.1: ** class LeoImportCommands
/**
 * A class implementing all of Leo's import/export code. This class
 * uses **importers** in the leo/plugins/importers folder.
 *
 * For more information, see leo/plugins/importers/howto.txt.
 */
export class LeoImportCommands {
    public c: Commands;
    public encoding: BufferEncoding;
    public errors: number;
    public fileName: string | undefined;
    public fileType: string | undefined;
    public methodName: string | undefined;
    public output_newline: string;
    public treeType: string;
    public verbose: boolean;
    public webType: string;
    public web_st: string[];

    //@+others
    //@+node:felix.20230511002352.2: *3* ic.__init__& ic.reload_settings
    /**
     * ctor for LeoImportCommands class.
     */
    constructor(c: Commands) {
        this.c = c;
        this.encoding = 'utf-8';
        this.errors = 0;
        this.fileName = undefined; // The original file name, say x.cpp
        this.fileType = undefined; // ".py", ".c", etc.
        this.methodName = undefined; // x, as in < < x methods > > =
        this.output_newline = g.getOutputNewline(c); // Value of @bool output_newline
        this.treeType = '@file'; // None or "@file"
        this.verbose = true; // Leo 6.6
        this.webType = '@noweb'; // "cweb" or "noweb"
        this.web_st = []; // noweb symbol table.
        this.reload_settings();
    }

    public reload_settings(): void {
        // pass
    }
    public reloadSettings(): void {
        // pass
    }
    //@+node:felix.20230511002352.3: *3* ic.Export
    //@+node:felix.20230511002352.4: *4* ic.convertCodePartToWeb & helpers
    /**
     * # Headlines not containing a section reference are ignored in noweb
     * and generate index index in cweb.
     */
    public convertCodePartToWeb(
        s: string,
        i: number,
        p: Position,
        result: string
    ): [number, string] {
        const ic = this;
        const nl = ic.output_newline;
        const head_ref = ic.getHeadRef(p);
        const file_name = ic.getFileName(p);
        if (g.match_word(s, i, '@root')) {
            i = g.skip_line(s, i);
            ic.appendRefToFileName(file_name, result);
        } else if (g.match_word(s, i, '@c') || g.match_word(s, i, '@code')) {
            i = g.skip_line(s, i);
            ic.appendHeadRef(p, file_name, head_ref, result);
        } else if (g.match_word(p.h, 0, '@file')) {
            // Only do this if nothing else matches.
            ic.appendRefToFileName(file_name, result);
            i = g.skip_line(s, i); // 4/28/02
        } else {
            ic.appendHeadRef(p, file_name, head_ref, result);
        }
        [i, result] = ic.copyPart(s, i, result);
        return [i, result.trim() + nl];
    }
    //@+node:felix.20230511002352.5: *5* ic.appendHeadRef
    public appendHeadRef(
        p: Position,
        file_name: string,
        head_ref: string,
        result: string
    ): void {
        const ic = this;
        const nl = ic.output_newline;
        if (ic.webType === 'cweb') {
            if (head_ref) {
                const escaped_head_ref = head_ref.replace('@', '@@');
                result += '@<' + escaped_head_ref + '@>=' + nl;
            } else {
                // Convert the headline to an index entry.
                result += '@^' + p.h.trim() + '@>' + nl;
                result += '@c' + nl; // @c denotes a new section.
            }
        } else {
            if (head_ref) {
                // pass
            } else if (p === ic.c.p) {
                head_ref = file_name || '*';
            } else {
                head_ref = '@others';
            }
            // 2019/09/12
            result += g.angleBrackets(head_ref) + '=' + nl;
        }
    }
    //@+node:felix.20230511002352.6: *5* ic.appendRefToFileName
    public appendRefToFileName(file_name: string, result: string): void {
        const ic = this;
        const nl = ic.output_newline;

        if (ic.webType === 'cweb') {
            if (!file_name) {
                result += '@<root@>=' + nl;
            } else {
                result += '@(' + file_name + '@>' + nl; // @(...@> denotes a file.
            }
        } else {
            if (!file_name) {
                file_name = '*';
            }
            // 2019/09/12.
            const lt = '<<';
            const rt = '>>';
            result += lt + file_name + rt + '=' + nl;
        }
    }
    //@+node:felix.20230511002352.7: *5* ic.getHeadRef
    /**
     * Look for either noweb or cweb brackets.
     * Return everything between those brackets.
     */
    public getHeadRef(p: Position): string {
        const h = p.h.trim();
        let i;
        if (g.match(h, 0, '<<')) {
            i = h.indexOf('>>', 2);
        } else if (g.match(h, 0, '<@')) {
            i = h.indexOf('@>', 2);
        } else {
            return h;
        }
        return h.slice(2, i).trim();
    }
    //@+node:felix.20230511002352.8: *5* ic.getFileName
    /**
     * Return the file name from an @file or @root node.
     */
    public getFileName(p: Position): string {
        const h = p.h.trim();
        let file_name;
        if (g.match(h, 0, '@file') || g.match(h, 0, '@root')) {
            const line = h.substring(5).trim();
            // set j & k so line[j:k] is the file name.
            let j, k;
            if (g.match(line, 0, '<')) {
                [j, k] = [1, line.indexOf('>', 1)];
            } else if (g.match(line, 0, '"')) {
                [j, k] = [1, line.indexOf('"', 1)];
            } else {
                [j, k] = [0, line.indexOf(' ', 0)];
            }
            if (k === -1) {
                k = line.length;
            }
            file_name = line.substring(j, k).trim();
        } else {
            file_name = '';
        }
        return file_name;
    }
    //@+node:felix.20230511002352.9: *4* ic.convertDocPartToWeb (handle @ %def)
    public convertDocPartToWeb(
        s: string,
        i: number,
        result: string
    ): [number, string] {
        const nl = this.output_newline;
        if (g.match_word(s, i, '@doc')) {
            i = g.skip_line(s, i);
        } else if (
            g.match(s, i, '@ ') ||
            g.match(s, i, '@\t') ||
            g.match(s, i, '@*')
        ) {
            i += 2;
        } else if (g.match(s, i, '@\n')) {
            i += 1;
        }
        i = g.skip_ws_and_nl(s, i);
        let result2;
        [i, result2] = this.copyPart(s, i, '');
        if (result2) {
            // Break lines after periods.
            result2 = result2.replace(/\.  /g, '.' + nl);
            result2 = result2.replace(/\. /g, '.' + nl);
            result += nl + '@' + nl + result2.trim() + nl + nl;
        } else {
            // All nodes should start with '@', even if the doc part is empty.
            result += this.webType === 'cweb' ? nl + '@ ' : nl + '@' + nl;
        }
        return [i, result];
    }
    //@+node:felix.20230511002352.10: *4* ic.convertVnodeToWeb
    /**
     * This code converts a VNode to noweb text as follows:

        Convert @doc to @
        Convert @root or @code to < < name > >=, assuming the headline contains < < name > >
        Ignore other directives
        Format doc parts so they fit in pagewidth columns.
        Output code parts as is.
     */
    public positionToWeb(p: Position): string {
        const c = this.c;
        if (!p || !p.__bool__() || !c) {
            return '';
        }
        const startInCode = c.config.getBool(
            'at-root-bodies-start-in-doc-mode'
        );
        const nl = this.output_newline;
        const docstart = this.webType === 'cweb' ? nl + '@ ' : nl + '@' + nl;
        const s = p.b;
        const lb = this.webType === 'cweb' ? '@<' : '<<';
        let [i, result, docSeen] = [0, '', false];
        while (i < s.length) {
            const progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isDocStart(s, i) || g.match_word(s, i, '@doc')) {
                [i, result] = this.convertDocPartToWeb(s, i, result);
                docSeen = true;
            } else if (
                g.match_word(s, i, '@code') ||
                g.match_word(s, i, '@root') ||
                g.match_word(s, i, '@c') ||
                g.match(s, i, lb)
            ) {
                if (!docSeen) {
                    docSeen = true;
                    result += docstart;
                }
                [i, result] = this.convertCodePartToWeb(s, i, p, result);
            } else if (this.treeType === '@file' || startInCode) {
                if (!docSeen) {
                    docSeen = true;
                    result += docstart;
                }
                [i, result] = this.convertCodePartToWeb(s, i, p, result);
            } else {
                [i, result] = this.convertDocPartToWeb(s, i, result);
                docSeen = true;
            }

            console.assert(progress < i);
        }
        result = result.trim();
        if (result) {
            result += nl;
        }
        return result;
    }
    //@+node:felix.20230511002352.11: *4* ic.copyPart
    // Copies characters to result until the end of the present section is seen.

    public copyPart(s: string, i: number, result: string): [number, string] {
        const lb = this.webType === 'cweb' ? '@<' : '<<';
        const rb = this.webType === 'cweb' ? '@>' : '>>';
        const theType = this.webType;
        while (i < s.length) {
            const progress = i;
            let j = i; // We should be at the start of a line here.
            i = g.skip_nl(s, i);
            i = g.skip_ws(s, i);
            if (this.isDocStart(s, i)) {
                return [i, result];
            }
            if (
                g.match_word(s, i, '@doc') ||
                g.match_word(s, i, '@c') ||
                g.match_word(s, i, '@root') ||
                g.match_word(s, i, '@code') // 2/25/03
            ) {
                return [i, result];
            }
            // 2019/09/12
            const lt = '<<';
            const rt = '>>=';
            if (g.match(s, i, lt) && g.find_on_line(s, i, rt) > -1) {
                return [i, result];
            }
            // Copy the entire line, escaping '@' and
            // Converting @others to < < @ others > >
            i = g.skip_line(s, j);
            let line = s.substring(j, i);
            if (theType === 'cweb') {
                line = line.replace('@', '@@');
            } else {
                j = g.skip_ws(line, 0);
                if (g.match(line, j, '@others')) {
                    line = line.replace('@others', lb + '@others' + rb);
                } else if (g.match(line, 0, '@')) {
                    // Special case: do not escape @ %defs.
                    const k = g.skip_ws(line, 1);
                    if (!g.match(line, k, '%defs')) {
                        line = '@' + line;
                    }
                }
            }
            result += line;
            console.assert(progress < i);
        }
        return [i, result.trimEnd()];
    }
    //@+node:felix.20230511002352.12: *4* ic.exportHeadlines
    public async exportHeadlines(fileName: string): Promise<void> {
        const p = this.c.p;
        const nl = this.output_newline;
        if (!p || !p.__bool__()) {
            return;
        }
        this.setEncoding();
        const firstLevel = p.level();
        try {
            const w_uri = g.makeVscodeUri(fileName);
            let s = '';
            // with open(fileName, 'w') as theFile:
            for (const w_p of p.self_and_subtree(false)) {
                const head = w_p.moreHead(firstLevel, true);
                // theFile.write(head + nl);
                s += head + nl;
            }
            const writeData = Buffer.from(s, 'utf8');
            await vscode.workspace.fs.writeFile(w_uri, writeData);
        } catch (IOError) {
            g.warning('can not open', fileName);
        }
    }
    //@+node:felix.20230511002352.13: *4* ic.flattenOutline
    /**
     * A helper for the flatten-outline command.
     *
     * Export the selected outline to an external file.
     * The outline is represented in MORE format.
     */
    public async flattenOutline(fileName: string): Promise<void> {
        const c = this.c;
        const nl = this.output_newline;
        const p = c.p;
        if (!p || !p.__bool__()) {
            return;
        }
        this.setEncoding();
        const firstLevel = p.level();

        try {
            const w_uri = g.makeVscodeUri(fileName);
            let theFile: string = '';
            // theFile = open(fileName, 'wb')  // Fix crasher: open in 'wb' mode.
            for (const w_p of p.self_and_subtree(false)) {
                let s = w_p.moreHead(firstLevel) + nl;
                // s = g.toEncodedString(s, this.encoding, true);
                theFile += s;
                s = w_p.moreBody() + nl; // Inserts escapes.
                if (s.trim()) {
                    // s = g.toEncodedString(s, this.encoding, true);
                    theFile += s;
                }
            }

            const writeData = g.toEncodedString(theFile, this.encoding, true);

            await vscode.workspace.fs.writeFile(w_uri, writeData);
        } catch (IOError) {
            g.warning('can not open', fileName);
            return;
        }
    }
    //@+node:felix.20230511002352.14: *4* ic.outlineToWeb
    public async outlineToWeb(
        fileName: string,
        webType: string
    ): Promise<void> {
        const c = this.c;
        const nl = this.output_newline;
        const current = c.p;
        if (!current || !current.__bool__()) {
            return;
        }
        this.setEncoding();
        this.webType = webType;
        try {
            // theFile = open(fileName, 'w')
            const w_uri = g.makeVscodeUri(fileName);
            let theFile: string = '';

            this.treeType = '@file';

            // Set self.treeType to @root if p or an ancestor is an @root node.
            for (const p of current.parents()) {
                let [flag, junk] = g.is_special(p.b, '@root');
                if (flag) {
                    this.treeType = '@root';
                    break;
                }
            }

            for (const p of current.self_and_subtree(false)) {
                const s = this.positionToWeb(p);
                if (s) {
                    theFile += s;
                    if (s.charAt(s.length - 1) !== '\n') {
                        theFile += nl;
                    }
                }
            }

            const writeData = g.toEncodedString(theFile);
            await vscode.workspace.fs.writeFile(w_uri, writeData);
        } catch (IOError) {
            g.warning('can not open', fileName);
            return;
        }
    }
    //@+node:felix.20230511002352.15: *4* ic.removeSentinelsCommand
    public async removeSentinelsCommand(
        paths: string[],
        toString = false
    ): Promise<string | undefined> {
        const c = this.c;
        this.setEncoding();
        for (const fileName of paths) {
            g.setGlobalOpenDir(fileName);
            let w_path;
            [w_path, this.fileName] = g.os_path_split(fileName);
            let s: string | undefined;
            let e;
            [s, e] = await g.readFileIntoString(fileName, this.encoding);
            if (s == null) {
                return undefined;
            }

            if (e) {
                this.encoding = e;
            }

            //@+<< set delims from the header line >>
            //@+node:felix.20230511002352.16: *5* << set delims from the header line >>
            // Skip any non @+leo lines.
            let i = 0;
            while (i < s.length && g.find_on_line(s, i, '@+leo') === -1) {
                i = g.skip_line(s, i);
            }
            // Get the comment delims from the @+leo sentinel line.
            const at = this.c.atFileCommands;
            let j = g.skip_line(s, i);
            let line = s.substring(i, j);
            let start_delim: string | undefined;
            let valid;
            let junk1;
            let end_delim;
            let junk2;
            [valid, junk1, start_delim, end_delim, junk2] =
                at.parseLeoSentinel(line);
            if (!valid) {
                if (!toString) {
                    g.es('invalid @+leo sentinel in', fileName);
                }
                return undefined;
            }
            let line_delim;
            if (end_delim) {
                line_delim = undefined;
            } else {
                [line_delim, start_delim] = [start_delim, undefined];
            }
            //@-<< set delims from the header line >>

            s = this.removeSentinelLines(s, line_delim, start_delim, end_delim);
            let ext = c.config.getString('remove-sentinels-extension');
            if (!ext) {
                ext = '.txt';
            }
            let newFileName;
            if (ext[0] === '.') {
                newFileName = g.finalize_join(w_path, fileName + ext); // 1341
            } else {
                let [head, ext2] = g.os_path_splitext(fileName);
                newFileName = g.finalize_join(w_path, head + ext + ext2); // 1341
            }
            if (toString) {
                return s;
            }

            //@+<< Write s into newFileName >>
            //@+node:felix.20230511002352.17: *5* << Write s into newFileName >> (remove-sentinels)
            // Remove sentinels command.
            try {
                const w_uri = g.makeVscodeUri(newFileName);
                const writeData = Buffer.from(s, 'utf8');
                await vscode.workspace.fs.writeFile(w_uri, writeData);

                if (!g.unitTesting) {
                    g.es('created:', newFileName);
                }
            } catch (exception) {
                g.es('exception creating:', newFileName);
                g.print_exception(exception);
            }
            //@-<< Write s into newFileName >>
        }
        return undefined;
    }
    //@+node:felix.20230511002352.18: *4* ic.removeSentinelLines
    /**
     * Properly remove all sentinel lines in s.
     * Note: This does not handle @nonl properly, but that no longer matters.
     */
    public removeSentinelLines(
        s: string,
        line_delim: string | undefined,
        start_delim: string | undefined,
        unused_end_delim: string
    ): string {
        const delim = (line_delim || start_delim || '') + '@';
        const verbatim = delim + 'verbatim';
        let verbatimFlag = false;
        const result: string[] = [];
        for (const line of g.splitLines(s)) {
            let i = g.skip_ws(line, 0);
            if (!verbatimFlag && g.match(line, i, delim)) {
                if (g.match(line, i, verbatim)) {
                    // Force the next line to be in the result.
                    verbatimFlag = true;
                }
            } else {
                result.push(line);
                verbatimFlag = false;
            }
        }
        return result.join('');
    }
    //@+node:felix.20230511002352.19: *4* ic.weave
    public async weave(filename: string): Promise<void> {
        const p = this.c.p;
        const nl = this.output_newline;
        if (!p || !p.__bool__()) {
            return;
        }
        this.setEncoding();

        try {
            // with open(filename, 'w', this.encoding) as f
            const w_uri = g.makeVscodeUri(filename);

            let f = '';

            for (const w_p of p.self_and_subtree()) {
                const s = p.b;
                const s2 = s.trim();
                if (s2) {
                    f += '-'.repeat(60);
                    f += nl;
                    //@+<< write the context of p to f >>
                    //@+node:felix.20230511002352.20: *5* << write the context of p to f >> (weave)
                    // write the headlines of p, p's parent and p's grandparent.
                    const context = [];
                    const p2 = w_p.copy();
                    let i = 0;

                    while (i < 3) {
                        i += 1;
                        if (!p2 || !p2.__bool__()) {
                            break;
                        }
                        context.push(p2.h);
                        p2.moveToParent();
                    }

                    context.reverse();
                    let indent = '';

                    for (const line of context) {
                        f += indent;
                        indent += '\t';
                        f += line;
                        f += nl;
                    }
                    //@-<< write the context of p to f >>
                    f += '-'.repeat(60);
                    f += nl;
                    f += s.trimEnd() + nl;
                }
            }

            const writeData = g.toEncodedString(f);
            await vscode.workspace.fs.writeFile(w_uri, writeData);
        } catch (exception) {
            g.es('exception opening:', filename);
            g.print_exception(exception);
        }
    }
    //@+node:felix.20230511002352.21: *3* ic.Import
    //@+node:felix.20230511002352.22: *4* ic.createOutline & helpers
    /**
     * Create an outline by importing a file, reading the file with the
     * given encoding if string s is None.
     *
     * ext,        The file extension to be used, or None.
     * fileName:   A string or None. The name of the file to be read.
     * parent:     The parent position of the created outline.
     * s:          A string or None. The file's contents.
     */
    public async createOutline(
        parent: Position,
        ext?: string,
        s?: string
    ): Promise<Position | undefined> {
        const c = this.c;
        const p = parent.copy();
        this.treeType = '@file'; // Fix #352.
        const fileName = c.fullPath(parent);
        const w_isBinary = await g.is_binary_external_file(fileName);
        if (w_isBinary) {
            return this.import_binary_file(fileName, parent);
        }
        // Init ivars.
        this.setEncoding(parent, c.config.default_at_auto_file_encoding);

        [ext, s] = await this.init_import(ext, fileName, s);
        if (s == null || !ext) {
            return undefined;
        }
        // The so-called scanning func is a callback. It must have a c argument.
        const func = this.dispatch(ext, p);
        // Call the scanning function.
        if (g.unitTesting) {
            // console.assert (func or ext in ('.txt', '.w', '.xxx'), (repr(func), ext, p.h));
            console.assert(func || ['.txt', '.w', '.xxx'].includes(ext), p.h);
        }
        if (func && !c.config.getBool('suppress-import-parsing', false)) {
            s = g.toUnicode(s, this.encoding);
            s = s.replace(/\r/g, '');
            // func is a factory that instantiates the importer class.
            func(c, p, s);
        } else {
            // Just copy the file to the parent node.
            s = g.toUnicode(s, this.encoding);
            s = s.replace(/\r/g, '');
            this.scanUnknownFileType(s, p, ext);
        }
        if (g.unitTesting) {
            return p;
        }
        // #488894: unsettling dialog when saving Leo file
        // #889175: Remember the full fileName.
        c.atFileCommands.rememberReadPath(fileName, p);
        p.contract();
        const w = c.frame.body.wrapper;
        w.setInsertPoint(0);
        w.seeInsertPoint();
        return p;
    }
    //@+node:felix.20230511002352.23: *5* ic.dispatch & helpers
    /**
     * Return the correct scanner function for p, an @auto node.
     */
    public dispatch(
        ext: string,
        p: Position
    ): ((...args: any[]) => any) | undefined {
        // Match the @auto type first, then the file extension.
        const c = this.c;
        return g.app.scanner_for_at_auto(c, p) || g.app.scanner_for_ext(c, ext);
    }
    //@+node:felix.20230511002352.24: *5* ic.import_binary_file
    public import_binary_file(fileName: string, parent: Position): Position {
        // Fix bug 1185409 importing binary files puts binary content in body editor.
        // Create an @url node.
        const c = this.c;
        let p;
        if (parent && parent.__bool__()) {
            p = parent.insertAsLastChild();
        } else {
            p = c.lastTopLevel().insertAfter();
        }
        p.h = `@url file://${fileName}`;
        return p;
    }
    //@+node:felix.20230511002352.25: *5* ic.init_import
    /**
     * Init ivars imports and read the file into s.
     * Return ext, s.
     */
    public async init_import(
        ext: string | undefined,
        fileName: string,
        s?: string
    ): Promise<[string | undefined, string | undefined]> {
        let junk;
        [junk, this.fileName] = g.os_path_split(fileName);
        [this.methodName, this.fileType] = g.os_path_splitext(this.fileName);
        if (!ext) {
            ext = this.fileType;
        }
        ext = ext.toLowerCase();
        if (!s) {
            let e;
            // Set the kind for error messages in readFileIntoString.
            [s, e] = await g.readFileIntoString(fileName, this.encoding);
            if (s == null) {
                return [undefined, undefined];
            }
            if (e) {
                this.encoding = e;
            }
        }
        return [ext, s];
    }
    //@+node:felix.20230511002352.26: *5* ic.scanUnknownFileType & helper
    /**
     * Scan the text of an unknown file type.
     */
    public scanUnknownFileType(s: string, p: Position, ext: string): boolean {
        let body = '';
        if (['.html', '.htm'].includes(ext)) {
            body += '@language html\n';
        } else if (['.txt', '.text'].includes(ext)) {
            body += '@nocolor\n';
        } else {
            const language = this.languageForExtension(ext);
            if (language) {
                body += `@language ${language}\n`;
            }
        }
        this.setBodyString(p, body + s);
        for (const w_p of p.self_and_subtree()) {
            w_p.clearDirty();
        }
        return true;
    }
    //@+node:felix.20230511002352.27: *6* ic.languageForExtension
    /**
     * Return the language corresponding to the extension ext.
     */
    public languageForExtension(ext: string): string {
        const unknown = 'unknown_language';
        if (ext.startsWith('.')) {
            ext = ext.substring(1);
        }
        let language;
        if (ext) {
            const z = g.app.extra_extension_dict[ext];
            if (![undefined, 'undefined', 'none', 'None'].includes(z)) {
                language = z;
            } else {
                language = g.app.extension_dict[ext];
            }
            if ([undefined, 'undefined', 'none', 'None'].includes(language)) {
                language = unknown;
            }
        } else {
            language = unknown;
        }

        // Return the language even if there is no colorizer mode for it.
        return language;
    }
    //@+node:felix.20230511002352.28: *4* ic.readAtAutoNodes
    public async readAtAutoNodes(): Promise<void> {
        const c = this.c;
        const p = this.c.p;
        const after = p.nodeAfterTree();
        let found = false;
        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.isAtAutoNode()) {
                if (p.isAtIgnoreNode()) {
                    g.warning('ignoring', p.h);
                    p.moveToThreadNext();
                } else {
                    await c.atFileCommands.readOneAtAutoNode(p);
                    found = true;
                    p.moveToNodeAfterTree();
                }
            } else {
                p.moveToThreadNext();
            }
        }
        if (!g.unitTesting) {
            const message = found
                ? 'finished'
                : 'no @auto nodes in the selected tree';
            g.blue(message);
        }
        c.redraw();
    }
    //@+node:felix.20230511002352.29: *4* ic.importDerivedFiles
    /**
     * Import one or more external files.
     * This is not a command.  It must *not* have an event arg.
     * command is None when importing from the command line.
     */
    public async importDerivedFiles(
        parent: Position,
        paths: string[] | undefined,
        command = 'Import'
    ): Promise<Position | undefined> {
        const at = this.c.atFileCommands;
        const c = this.c;
        const u = this.c.undoer;
        const current = c.p && c.p.__bool__() ? c.p : c.rootPosition()!;

        if (!paths || !paths.length) {
            return undefined;
        }
        // Initial open from command line is not undoable.
        if (command) {
            u.beforeChangeGroup(current, command);
        }
        let p: Position; // p will exist because path is not empty.
        for (let fileName of paths) {
            fileName = fileName.replace('\\', '/'); // 2011/10/09.
            g.setGlobalOpenDir(fileName);
            const isThin = await at.scanHeaderForThin(fileName);
            let undoData: Bead;
            if (command) {
                undoData = u.beforeInsertNode(parent);
            }
            p = parent.insertAfter();
            if (isThin) {
                // Create @file node, not a deprecated @thin node.
                p.initHeadString('@file ' + fileName);
                await at.read(p);
            } else {
                p.initHeadString('Imported @file ' + fileName);
                await at.read(p);
            }
            p.contract();
            p.setDirty(); // 2011/10/09: tell why the file is dirty!
            if (command) {
                u.afterInsertNode(p, command, undoData!); // undodata will exist under same 'if'.
            }
        }
        current.expand();
        c.setChanged();
        if (command) {
            u.afterChangeGroup(p!, command);
        }
        c.redraw(current);
        return p!;
    }
    //@+node:felix.20230511002352.30: *4* ic.importFilesCommand
    public async importFilesCommand(
        files: string[] | undefined,
        parent: Position | undefined,
        shortFn = false,
        treeType: string | undefined,
        verbose = true // Legacy value.
    ): Promise<void> {
        // Not a command.  It must *not* have an event arg.
        const c = this.c;
        const u = this.c.undoer;
        if (!c || !c.p || !c.p.__bool__() || !files || !files.length) {
            return;
        }
        this.treeType = treeType || '@file';
        this.verbose = verbose;
        if (!parent || !parent.__bool__()) {
            g.trace('===== no parent', g.callers());
            return;
        }

        for (const fn of files) {
            // Report exceptions here, not in the caller.
            try {
                g.setGlobalOpenDir(fn);
                // Leo 5.6: Handle undo here, not in createOutline.
                const undoData = u.beforeInsertNode(parent);
                let p: Position | undefined = parent.insertAsLastChild();
                p.h = `${treeType} ${fn}`;
                u.afterInsertNode(p, 'Import', undoData);
                p = await this.createOutline(p);
                if (p && p.__bool__()) {
                    // createOutline may fail.
                    if (this.verbose && !g.unitTesting) {
                        g.blue('imported', shortFn ? g.shortFileName(fn) : fn);
                    }
                    p.contract();
                    p.setDirty();
                    c.setChanged();
                }
            } catch (exception) {
                g.es_print('Exception importing', fn);
                g.es_exception();
            }
        }

        c.checkOutline();
        parent.expand();
    }
    //@+node:felix.20230511002352.31: *4* ic.importFreeMind
    /**
     * Import a list of .mm.html files exported from FreeMind:
     * http://freemind.sourceforge.net/wiki/index.php/Main_Page
     */
    public async importFreeMind(files: string[]): Promise<void> {
        await new FreeMindImporter(this.c).import_files(files);
    }
    //@+node:felix.20230511002352.32: *4* ic.importMindMap
    /**
     * Import a list of .csv files exported from MindJet:
     * https://www.mindjet.com/
     */
    public async importMindMap(files: string[]): Promise<void> {
        await new MindMapImporter(this.c).import_files(files);
    }
    //@+node:felix.20230511002352.33: *4* ic.importWebCommand & helpers
    public async importWebCommand(
        files: string[],
        webType: string
    ): Promise<void> {
        const c = this.c;
        const current = this.c.p;
        if (current == null) {
            return;
        }
        if (!files || !files.length) {
            return;
        }
        this.webType = webType;
        for (const fileName of files) {
            g.setGlobalOpenDir(fileName);
            let p = await this.createOutlineFromWeb(fileName, current);
            p.contract();
            p.setDirty();
            c.setChanged();
        }
        c.redraw(current);
    }
    //@+node:felix.20230511002352.34: *5* createOutlineFromWeb
    public async createOutlineFromWeb(
        p_path: string,
        parent: Position
    ): Promise<Position> {
        const c = this.c;
        const u = c.undoer;
        let [junk, fileName] = g.os_path_split(p_path);
        const undoData = u.beforeInsertNode(parent);
        // Create the top-level headline.
        let p = parent.insertAsLastChild();
        p.initHeadString(fileName);
        if (this.webType === 'cweb') {
            this.setBodyString(p, '@ignore\n@language cweb');
        }
        // Scan the file, creating one section for each function definition.
        await this.scanWebFile(p_path, p);
        u.afterInsertNode(p, 'Import', undoData);
        return p;
    }
    //@+node:felix.20230511002352.35: *5* findFunctionDef
    public findFunctionDef(s: string, i: number): string | undefined {
        // Look at the next non-blank line for a function name.
        i = g.skip_ws_and_nl(s, i);
        let k = g.skip_line(s, i);
        let name: string | undefined = undefined;
        while (i < k) {
            if (g.is_c_id(s[i])) {
                const j = i;
                i = g.skip_c_id(s, i);
                name = s.substring(j, i);
            } else if (s[i] === '(') {
                if (name) {
                    return name;
                }
                break;
            } else {
                i += 1;
            }
        }
        return undefined;
    }
    //@+node:felix.20230511002352.36: *5* scanBodyForHeadline
    //@+at This method returns the proper headline text.
    // 1. If s contains a section def, return the section ref.
    // 2. cweb only: if s contains @c, return the function name following the @c.
    // 3. cweb only: if s contains @d name, returns @d name.
    // 4. Otherwise, returns "@"
    //@@c

    public scanBodyForHeadline(s: string): string {
        let name: string | undefined;
        if (this.webType === 'cweb') {
            //@+<< scan cweb body for headline >>
            //@+node:felix.20230511002352.37: *6* << scan cweb body for headline >>
            let i = 0;
            while (i < s.length) {
                i = g.skip_ws_and_nl(s, i);
                // Allow constructs such as @ @c, or @ @<.
                if (this.isDocStart(s, i)) {
                    i += 2;
                    i = g.skip_ws(s, i);
                }
                let j;
                if (g.match(s, i, '@d') || g.match(s, i, '@f')) {
                    // Look for a macro name.
                    const directive = s.substring(i, i + 2);
                    i = g.skip_ws(s, i + 2); // skip the @d or @f
                    if (i < s.length && g.is_c_id(s[i])) {
                        j = i;
                        i = g.skip_c_id(s, i);
                        return s.substring(j, i);
                    }
                    return directive;
                }
                if (g.match(s, i, '@c') || g.match(s, i, '@p')) {
                    // Look for a function def.
                    name = this.findFunctionDef(s, i + 2);
                    return name || 'outer function';
                }
                if (g.match(s, i, '@<')) {
                    // Look for a section def.
                    // A small bug: the section def must end on this line.
                    j = i;
                    const k = g.find_on_line(s, i, '@>');
                    if (
                        k > -1 &&
                        (g.match(s, k + 2, '+=') || g.match(s, k + 2, '='))
                    ) {
                        return s.substring(j, i);
                        return s.substring(j, k + 2); // return the section ref.
                    }
                }
                i = g.skip_line(s, i);
            }
            //@-<< scan cweb body for headline >>
        } else {
            //@+<< scan noweb body for headline >>
            //@+node:felix.20230511002352.38: *6* << scan noweb body for headline >>
            let i = 0;
            while (i < s.length) {
                i = g.skip_ws_and_nl(s, i);
                if (g.match(s, i, '<<')) {
                    const k = g.find_on_line(s, i, '>>=');
                    if (k > -1) {
                        const ref = s.substring(i, k + 2);
                        name = s.substring(i + 2, k).trim();
                        if (name !== '@others') {
                            return ref;
                        }
                    }
                } else {
                    name = this.findFunctionDef(s, i);
                    if (name) {
                        return name;
                    }
                }
                i = g.skip_line(s, i);
            }
            //@-<< scan noweb body for headline >>
        }

        return '@'; // default.
    }
    //@+node:felix.20230511002352.39: *5* scanWebFile (handles limbo)
    public async scanWebFile(
        fileName: string,
        parent: Position
    ): Promise<void> {
        const theType = this.webType;
        const lb = theType === 'cweb' ? '@<' : '<<';
        const rb = theType === 'cweb' ? '@>' : '>>';
        let [s, e] = await g.readFileIntoString(fileName);
        if (s == null) {
            return;
        }
        //@+<< Create a symbol table of all section names >>
        //@+node:felix.20230511002352.40: *6* << Create a symbol table of all section names >>
        let i = 0;
        this.web_st = [];
        while (i < s.length) {
            let progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isDocStart(s, i)) {
                if (theType === 'cweb') {
                    i += 2;
                } else {
                    i = g.skip_line(s, i);
                }
            } else if (theType === 'cweb' && g.match(s, i, '@@')) {
                i += 2;
            } else if (g.match(s, i, lb)) {
                i += 2;
                let j = i;
                let k = g.find_on_line(s, j, rb);
                if (k > -1) {
                    this.cstEnter(s.substring(j, k));
                }
            } else {
                i += 1;
            }
            console.assert(i > progress);
        }
        //@-<< Create a symbol table of all section names >>
        //@+<< Create nodes for limbo text and the root section >>
        //@+node:felix.20230511002352.41: *6* << Create nodes for limbo text and the root section >>
        i = 0;
        while (i < s.length) {
            let progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isModuleStart(s, i) || g.match(s, i, lb)) {
                break;
            } else {
                i = g.skip_line(s, i);
            }
            console.assert(i > progress);
        }

        let j = g.skip_ws(s, 0);
        if (j < i) {
            this.createHeadline(parent, '@ ' + s.substring(j, i), 'Limbo');
        }
        j = i;
        if (g.match(s, i, lb)) {
            while (i < s.length) {
                let progress = i;
                i = g.skip_ws_and_nl(s, i);
                if (this.isModuleStart(s, i)) {
                    break;
                } else {
                    i = g.skip_line(s, i);
                }
                console.assert(i > progress);
            }
            this.createHeadline(
                parent,
                s.substring(j, i),
                g.angleBrackets(' @ ')
            );
        }
        //@-<< Create nodes for limbo text and the root section >>
        let outer_progress;
        let start;
        while (i < s.length) {
            outer_progress = i;
            //@+<< Create a node for the next module >>
            //@+node:felix.20230511002352.42: *6* << Create a node for the next module >>
            if (theType === 'cweb') {
                console.assert(this.isModuleStart(s, i));
                start = i;
                if (this.isDocStart(s, i)) {
                    i += 2;
                    while (i < s.length) {
                        let progress = i;
                        i = g.skip_ws_and_nl(s, i);
                        if (this.isModuleStart(s, i)) {
                            break;
                        } else {
                            i = g.skip_line(s, i);
                        }
                        console.assert(i > progress);
                    }
                }

                //@+<< Handle cweb @d, @f, @c and @p directives >>
                //@+node:felix.20230511002352.43: *7* << Handle cweb @d, @f, @c and @p directives >>
                if (g.match(s, i, '@d') || g.match(s, i, '@f')) {
                    i += 2;
                    i = g.skip_line(s, i);
                    // Place all @d and @f directives in the same node.
                    while (i < s.length) {
                        let progress = i;
                        i = g.skip_ws_and_nl(s, i);
                        if (g.match(s, i, '@d') || g.match(s, i, '@f')) {
                            i = g.skip_line(s, i);
                        } else {
                            break;
                        }
                        console.assert(i > progress);
                    }
                    i = g.skip_ws_and_nl(s, i);
                }
                while (i < s.length && !this.isModuleStart(s, i)) {
                    let progress = i;
                    i = g.skip_line(s, i);
                    i = g.skip_ws_and_nl(s, i);
                    console.assert(i > progress);
                }

                if (g.match(s, i, '@c') || g.match(s, i, '@p')) {
                    i += 2;
                    while (i < s.length) {
                        let progress = i;
                        i = g.skip_line(s, i);
                        i = g.skip_ws_and_nl(s, i);
                        if (this.isModuleStart(s, i)) {
                            break;
                        }

                        console.assert(i > progress);
                    }
                }
                //@-<< Handle cweb @d, @f, @c and @p directives >>
            } else {
                console.assert(this.isDocStart(s, i));
                start = i;
                i = g.skip_line(s, i);
                while (i < s.length) {
                    let progress = i;
                    i = g.skip_ws_and_nl(s, i);
                    if (this.isDocStart(s, i)) {
                        break;
                    } else {
                        i = g.skip_line(s, i);
                    }
                    console.assert(i > progress);
                }
            }
            let body = s.substring(start, i);
            body = this.massageWebBody(body);
            const headline = this.scanBodyForHeadline(body);
            this.createHeadline(parent, body, headline);
            //@-<< Create a node for the next module >>
            console.assert(i > outer_progress);
        }
    }
    //@+node:felix.20230511002352.44: *5* Symbol table
    //@+node:felix.20230511002352.45: *6* cstCanonicalize
    // We canonicalize strings before looking them up,
    // but strings are entered in the form they are first encountered.

    public cstCanonicalize(s: string, lower = true): string {
        if (lower) {
            s = s.toLowerCase();
        }
        s = s.replace(/\t/g, ' ').replace(/\r/g, '');
        s = s.replace(/\n/g, ' ').replace(/  /g, ' ');
        return s.trim();
    }
    //@+node:felix.20230511002352.46: *6* cstDump
    public cstDump(): string {
        let s = 'Web Symbol Table...\n\n';
        for (const name of [...this.web_st].sort()) {
            s += name + '\n';
        }
        return s;
    }
    //@+node:felix.20230511002352.47: *6* cstEnter
    // We only enter the section name into the symbol table if the ... convention is not used.

    public cstEnter(s: string): void {
        // Don't enter names that end in "..."
        s = s.trimEnd();
        if (s.endsWith('...')) {
            return;
        }
        // Put the section name in the symbol table, retaining capitalization.
        const lower = this.cstCanonicalize(s, true); // do lower
        const upper = this.cstCanonicalize(s, false); // don't lower.
        for (const name of this.web_st) {
            if (name.toLowerCase() === lower) {
                return;
            }
        }
        this.web_st.push(upper);
    }
    //@+node:felix.20230511002352.48: *6* cstLookup
    // This method returns a string if the indicated string is a prefix of an entry in the web_st.

    public cstLookup(target: string): string {
        // Do nothing if the ... convention is not used.
        target = target.trim();
        if (!target.endsWith('...')) {
            return target;
        }
        // Canonicalize the target name, and remove the trailing "..."
        let ctarget = target.slice(0, -3);
        ctarget = this.cstCanonicalize(ctarget).trim();
        let found = false;
        let result = target;
        for (const s of this.web_st) {
            const cs = this.cstCanonicalize(s);
            if (cs.substring(0, ctarget.length) === ctarget) {
                if (found) {
                    g.es('', `****** ${target}`, 'is also a prefix of', s);
                } else {
                    found = true;
                    result = s;
                    // g.es("replacing",target,"with",s)
                }
            }
        }
        return result;
    }
    //@+node:felix.20230511002352.49: *3* ic.parse_body
    /**
     * Parse p.b as source code, creating a tree of descendant nodes.
     * This is essentially an import of p.b.
     */
    public parse_body(p: Position): void {

        const c = this.c;
        const d = g.app.language_extension_dict;
        const [u, undoType] = [c.undoer, 'parse-body'];
        if (!p || !p.__bool__()) {
            return;
        }

        if (p.hasChildren()) {
            g.es_print('can not run parse-body: node has children:', p.h);
            return;
        }
        const language = g.scanForAtLanguage(c, p) || '';
        this.treeType = '@file';
        const ext = '.' + d[language];
        const parser = g.app.classDispatchDict[ext];
        // Fix bug 151: parse-body creates "None declarations"
        if (p.isAnyAtFileNode()) {
            const fn = p.anyAtFileNodeName();
            [this.methodName, this.fileType] = g.os_path_splitext(fn);
        } else {
            const fileType = d[language] || 'py';
            [this.methodName, this.fileType] = [p.h, fileType];
        }
        if (!parser) {
            g.es_print(
                `parse-body: no parser for @language ${language || 'None'}`
            );
            return;
        }
        const s = p.b;
        p.b = '';
        try {
            const bunch = c.undoer.beforeParseBody(p);
            parser(c, p, s);
            u.afterParseBody(p, undoType, bunch);
            p.expand();
            c.selectPosition(p);
            c.redraw();
        } catch (exception) {
            g.es_exception(exception);
            p.b = s;
        }
    }
    //@+node:felix.20230511002352.50: *3* ic.Utilities
    //@+node:felix.20230511002352.51: *4* ic.appendStringToBody & setBodyString (leoImport)
    /**
     * Similar to c.appendStringToBody,
     * but does not recolor the text or redraw the screen.
     */
    public appendStringToBody(p: Position, s: string): void {
        if (s) {
            p.b = p.b + g.toUnicode(s, this.encoding);
        }
    }
    /**
     * Similar to c.setBodyString, but does not recolor the text or
     * redraw the screen.
     */
    public setBodyString(p: Position, s: string): void {
        const c = this.c;
        const v = p.v;
        if (!c || !p || !p.__bool__()) {
            return;
        }
        s = g.toUnicode(s, this.encoding);
        if (c.p && c.p.__bool__() && p.v === c.p.v) {
            const w = c.frame.body.wrapper;
            const i = s.length;
            w.setAllText(s);
            w.setSelectionRange(i, i, i);
        }

        // Keep the body text up-to-date.
        if (v.b !== s) {
            v.setBodyString(s);
            v.setSelection(0, 0);
            p.setDirty();
            if (!c.isChanged()) {
                c.setChanged();
            }
        }
    }
    //@+node:felix.20230511002352.52: *4* ic.createHeadline
    /**
     * Create a new VNode as the last child of parent position.
     */
    public createHeadline(
        parent: Position,
        body: string,
        headline: string
    ): Position {
        const p = parent.insertAsLastChild();
        p.initHeadString(headline);
        if (body) {
            this.setBodyString(p, body);
        }
        return p;
    }
    //@+node:felix.20230511002352.53: *4* ic.error
    public error(s: string): void {
        g.es('', s);
    }
    //@+node:felix.20230511002352.54: *4* ic.isDocStart & isModuleStart
    // The start of a document part or module in a noweb or cweb file.
    // Exporters may have to test for @doc as well.

    public isDocStart(s: string, i: number): boolean {
        if (!g.match(s, i, '@')) {
            return false;
        }
        const j = g.skip_ws(s, i + 1);
        if (g.match(s, j, '%defs')) {
            return false;
        }
        if (this.webType === 'cweb' && g.match(s, i, '@*')) {
            return true;
        }
        return (
            g.match(s, i, '@ ') || g.match(s, i, '@\t') || g.match(s, i, '@\n')
        );
    }

    public isModuleStart(s: string, i: number): boolean {
        if (this.isDocStart(s, i)) {
            return true;
        }
        return (
            this.webType === 'cweb' &&
            (g.match(s, i, '@c') ||
                g.match(s, i, '@p') ||
                g.match(s, i, '@d') ||
                g.match(s, i, '@f'))
        );
    }
    //@+node:felix.20230511002352.55: *4* ic.massageWebBody
    public massageWebBody(s: string): string {
        const theType = this.webType;
        const lb = theType === 'cweb' ? '@<' : '<<';
        const rb = theType === 'cweb' ? '@>' : '>>';
        //@+<< Remove most newlines from @space and @* sections >>
        //@+node:felix.20230511002352.56: *5* << Remove most newlines from @space and @* sections >>
        let i = 0;
        let start;
        let end;

        while (i < s.length) {
            const progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isDocStart(s, i)) {
                // Scan to end of the doc part.
                if (g.match(s, i, '@ %def')) {
                    // Don't remove the newline following %def
                    i = g.skip_line(s, i);
                    start = i;
                    end = i;
                } else {
                    start = i;
                    end = i;
                    i += 2;
                }
                while (i < s.length) {
                    const progress2 = i;
                    i = g.skip_ws_and_nl(s, i);
                    if (this.isModuleStart(s, i) || g.match(s, i, lb)) {
                        end = i;
                        break;
                    } else if (theType === 'cweb') {
                        i += 1;
                    } else {
                        i = g.skip_to_end_of_line(s, i);
                    }
                    console.assert(i > progress2);
                }
                // Remove newlines from start to end.
                let doc = s.substring(start, end);
                doc = doc.replace('\n', ' ');
                doc = doc.replace('\r', '');
                doc = doc.trim();
                if (doc) {
                    if (doc === '@') {
                        doc = this.webType === 'cweb' ? '@ ' : '@\n';
                    } else {
                        doc += '\n\n';
                    }
                    s = s.substring(0, start) + doc + s.substring(end);
                    i = start + doc.length;
                }
            } else {
                i = g.skip_line(s, i);
            }
            console.assert(i > progress);
        }
        //@-<< Remove most newlines from @space and @* sections >>
        //@+<< Replace abbreviated names with full names >>
        //@+node:felix.20230511002352.57: *5* << Replace abbreviated names with full names >>
        i = 0;
        while (i < s.length) {
            const progress = i;
            if (g.match(s, i, lb)) {
                i += 2;
                const j = i;
                const k = g.find_on_line(s, j, rb);
                if (k > -1) {
                    const name = s.substring(j, k);
                    const name2 = this.cstLookup(name);
                    if (name !== name2) {
                        // Replace name by name2 in s.
                        s = s.substring(0, j) + name2 + s.substring(k);
                        i = j + name2.length;
                    }
                }
            }
            i = g.skip_line(s, i);
            console.assert(i > progress);
        }
        //@-<< Replace abbreviated names with full names >>
        s = s.trimEnd();
        return s;
    }
    //@+node:felix.20230511002352.58: *4* ic.setEncoding
    public setEncoding(p?: Position, p_default?: BufferEncoding): void {
        const c = this.c;
        const encoding = g.getEncodingAt(p || c.p) || p_default;
        if (encoding && g.isValidEncoding(encoding)) {
            this.encoding = encoding;
        } else if (p_default) {
            this.encoding = p_default;
        } else {
            this.encoding = 'utf-8';
        }
    }
    //@-others
}
//@+node:felix.20230520010426.1: ** class MindMapImporter
/**
 * Mind Map Importer class.
 */
export class MindMapImporter {
    public c: Commands;

    /**
     * ctor for MindMapImporter class.
     */
    constructor(c: Commands) {
        this.c = c;
    }

    //@+others
    //@+node:felix.20230520010426.2: *3* mindmap.create_outline
    public async create_outline(p_path: string): Promise<Position> {
        const c = this.c;
        let [junk, fileName] = g.os_path_split(p_path);
        const undoData = c.undoer.beforeInsertNode(c.p);
        // Create the top-level headline.
        const p = c.lastTopLevel().insertAfter();
        let fn = g.shortFileName(p_path).trim();
        if (fn.endsWith('.csv')) {
            fn = fn.slice(0, -4);
        }

        p.h = fn;
        try {
            //f = open(p_path)
            const w_uri = g.makeVscodeUri(p_path);
            const readData = await vscode.workspace.fs.readFile(w_uri);
            const s = Buffer.from(readData).toString('utf8');

            await this.scan(s, p); // ! leojs: Use string from file content instead
            // f.close()
            c.redraw();
        } catch (exception) {
            g.es_print('Invalid MindJet file:', fn);
        }
        c.undoer.afterInsertNode(p, 'Import', undoData);
        return p;
    }
    //@+node:felix.20230520010426.3: *3* mindmap.import_files
    /**
     * Import a list of MindMap (.csv) files.
     */
    public async import_files(files: string[]): Promise<void> {
        const c: Commands = this.c;
        if (files && files.length) {
            let p: Position;
            for (const fileName of files) {
                g.setGlobalOpenDir(fileName);
                p = await this.create_outline(fileName);
                p.contract();
                p.setDirty();
                c.setChanged();
            }
            c.redraw(p!); // at least one p because of files.length.
        }
    }
    //@+node:felix.20230520010426.4: *3* mindmap.prompt_for_files
    /**
     * Prompt for a list of MindJet (.csv) files and import them.
     */
    public async prompt_for_files(): Promise<void> {
        const c = this.c;
        const types: [string, string][] = [
            ['MindJet files', '*.csv'],
            ['All files', '*'],
        ];
        const names = (await g.app.gui.runOpenFileDialog(
            c,
            'Import MindJet File',
            types,
            '.csv',
            true
        )) as string[];
        // c.bringToFront();
        if (names && names.length) {
            await g.chdir(names[0]);
            await this.import_files(names);
        }
    }
    //@+node:felix.20230520010426.5: *3* mindmap.scan & helpers
    /**
     * Create an outline from a MindMap (.csv) file.
     */
    public async scan(f: string, target: Position): Promise<void> {
        const reader = await csv({
            output: 'csv',
        }).fromString(f);

        const max_chars_in_header = 80;
        const n1 = target.level();
        let n = n1;
        let p = target.copy();
        // reader = reader.slice(1); // ! NO NEED TO REMOVE TOP ROW IN LEOJS !
        for (const row of reader) {
            // Row is a List of fields.
            const new_level = this.csv_level(row) + n1;
            this.csv_string(row);
            if (new_level > n) {
                p = p.insertAsLastChild().copy();
                p.b = this.csv_string(row) || '';
                n = n + 1;
            } else if (new_level === n) {
                p = p.insertAfter().copy();
                p.b = this.csv_string(row) || '';
            } else if (new_level < n) {
                for (const item of p.parents()) {
                    if (item.level() === new_level - 1) {
                        p = item.copy();
                        break;
                    }
                }
                p = p.insertAsLastChild().copy();
                p.b = this.csv_string(row) || '';
                n = p.level();
            }
        }
        for (const p of target.unique_subtree()) {
            if (p.b.split(/\r?\n/).length === 1) {
                if (p.b.split(/\r?\n/)[0].length < max_chars_in_header) {
                    p.h = p.b.split(/\r?\n/)[0];
                    p.b = '';
                } else {
                    p.h = '@node_with_long_text';
                }
            } else {
                p.h = '@node_with_long_text';
            }
        }
    }
    //@+node:felix.20230520010426.6: *4* mindmap.csv_level
    /**
     * Return the level of the given row, a list of fields.
     */
    public csv_level(row: any[]): number {
        let count = 0;
        while (count <= row.length) {
            if (row[count]) {
                return count + 1;
            }
            count = count + 1;
        }
        return -1;
    }
    //@+node:felix.20230520010426.7: *4* mindmap.csv_string
    /**
     * Return the string for the given csv row.
     */
    public csv_string(row: string[]): string | undefined {
        let count = 0;
        while (count <= row.length) {
            if (row[count]) {
                return row[count];
            }
            count = count + 1;
        }

        return undefined;
    }
    //@-others
}
//@+node:felix.20230520220221.1: ** class MORE_Importer
/**
 * Class to import MORE files.
 */
export class MORE_Importer {
    public c: Commands;

    /**
     * ctor for MORE_Importer class.
     */
    constructor(c: Commands) {
        this.c = c;
    }

    //@+others
    //@+node:felix.20230520220221.2: *3* MORE.prompt_for_files
    /**
     * Prompt for a list of MORE files and import them.
     */
    public async prompt_for_files(): Promise<void> {
        const c = this.c;
        const types: [string, string][] = [['All files', '*']];

        const names = (await g.app.gui.runOpenFileDialog(
            c,
            'Import MORE Files',
            types,
            '', //  ".txt",
            true
        )) as string[];
        // c.bringToFront()
        if (names && names.length) {
            await g.chdir(names[0]);
            await this.import_files(names);
        }
    }
    //@+node:felix.20230520220221.3: *3* MORE.import_files
    /**
     * Import a list of MORE (.csv) files.
     */
    public async import_files(files: string[]): Promise<void> {
        const c: Commands = this.c;
        if (files && files.length) {
            let changed = false;
            let p: Position | undefined;

            for (const fileName of files) {
                g.setGlobalOpenDir(fileName);
                p = await this.import_file(fileName);
                if (p && p.__bool__()) {
                    p.contract();
                    p.setDirty();
                    c.setChanged();
                    changed = true;
                }
            }
            if (changed) {
                c.redraw(p!);
            }
        }
    }
    //@+node:felix.20230520220221.4: *3* MORE.import_file
    public async import_file(fileName: string): Promise<Position | undefined> {
        // Not a command, so no event arg.
        const c = this.c;
        const u = c.undoer;
        const ic = c.importCommands;
        if (!c.p || !c.p.__bool__()) {
            return undefined;
        }
        ic.setEncoding();
        g.setGlobalOpenDir(fileName);
        let [s, e] = await g.readFileIntoString(fileName);
        if (s == null) {
            return undefined;
        }
        s = s.replace(/\r/g, ''); // Fixes bug 626101.
        const lines = g.splitLines(s);
        // Convert the string to an outline and insert it after the current node.
        if (this.check_lines(lines)) {
            const last = c.lastTopLevel();
            const undoData = u.beforeInsertNode(c.p);
            const root = last.insertAfter();
            root.h = fileName;
            const p = this.import_lines(lines, root);
            if (p && p.__bool__()) {
                c.endEditing();
                c.checkOutline();
                p.setDirty();
                c.setChanged();
                u.afterInsertNode(root, 'Import MORE File', undoData);
                c.selectPosition(root);
                c.redraw();
                return root;
            }
        }
        if (!g.unitTesting) {
            g.es('not a valid MORE file', fileName);
        }
        return undefined;
    }
    //@+node:felix.20230520220221.5: *3* MORE.import_lines
    public import_lines(
        strings: string[],
        first_p: Position
    ): Position | undefined {
        const c = this.c;

        if (!strings) {
            return undefined;
        }
        if (!this.check_lines(strings)) {
            return undefined;
        }
        let [firstLevel, junk] = this.headlineLevel(strings[0]);
        let lastLevel = -1;
        let theRoot: Position | undefined = undefined;
        let last_p: Position | undefined = undefined;
        let index = 0;
        while (index < strings.length) {
            const progress = index;
            const s = strings[index];
            let [level, junk2] = this.headlineLevel(s);
            level -= firstLevel;
            if (level >= 0) {
                //@+<< Link a new position p into the outline >>
                //@+node:felix.20230520220221.6: *4* << Link a new position p into the outline >>
                console.assert(level >= 0);
                let p: Position;
                if (!last_p || !last_p.__bool__()) {
                    theRoot = p = first_p.insertAsLastChild(); // 2016/10/06.
                } else if (level === lastLevel) {
                    p = last_p.insertAfter();
                } else if (level === lastLevel + 1) {
                    p = last_p.insertAsNthChild(0);
                } else {
                    console.assert(level < lastLevel);
                    while (level < lastLevel) {
                        lastLevel -= 1;
                        last_p = last_p.parent();
                        console.assert(last_p && last_p.__bool__());
                        console.assert(lastLevel >= 0);
                    }
                    p = last_p.insertAfter();
                }
                last_p = p;
                lastLevel = level;
                //@-<< Link a new position p into the outline >>
                //@+<< Set the headline string, skipping over the leader >>
                //@+node:felix.20230520220221.7: *4* << Set the headline string, skipping over the leader >>
                let j = 0;
                while (g.match(s, j, '\t') || g.match(s, j, ' ')) {
                    j += 1;
                }
                if (g.match(s, j, '+ ') || g.match(s, j, '- ')) {
                    j += 2;
                }
                p.initHeadString(s.substring(j));
                //@-<< Set the headline string, skipping over the leader >>
                //@+<< Count the number of following body lines >>
                //@+node:felix.20230520220221.8: *4* << Count the number of following body lines >>
                let bodyLines = 0;
                index += 1; // Skip the headline.
                while (index < strings.length) {
                    const s = strings[index];
                    let [level, junk] = this.headlineLevel(s);
                    level -= firstLevel;
                    if (level >= 0) {
                        break;
                    }
                    // Remove first backslash of the body line.
                    if (g.match(s, 0, '\\')) {
                        strings[index] = s.substring(1);
                    }
                    bodyLines += 1;
                    index += 1;
                }
                //@-<< Count the number of following body lines >>
                //@+<< Add the lines to the body text of p >>
                //@+node:felix.20230520220221.9: *4* << Add the lines to the body text of p >>
                if (bodyLines > 0) {
                    let body = '';
                    let n = index - bodyLines;
                    while (n < index) {
                        body += strings[n].trimEnd();
                        if (n !== index - 1) {
                            body += '\n';
                        }
                        n += 1;
                    }
                    p.setBodyString(body);
                }
                //@-<< Add the lines to the body text of p >>
                p.setDirty();
            } else {
                index += 1;
            }
            console.assert(progress < index);
        }
        if (theRoot && theRoot.__bool__()) {
            theRoot.setDirty();
            c.setChanged();
        }
        c.redraw();
        return theRoot;
    }
    //@+node:felix.20230520220221.10: *3* MORE.headlineLevel
    /**
     * return the headline level of s,or -1 if the string is not a MORE headline.
     */
    public headlineLevel(s: string): [number, boolean] {
        let level = 0;
        let i = 0;
        while (i < s.length && ' \t'.includes(s[i])) {
            // 2016/10/06: allow blanks or tabs.
            level += 1;
            i += 1;
        }
        const plusFlag = g.match(s, i, '+');

        if (g.match(s, i, '+ ') || g.match(s, i, '- ')) {
            return [level, plusFlag];
        }
        return [-1, plusFlag];
    }
    //@+node:felix.20230520220221.11: *3* MORE.check & check_lines
    public check(s: string): boolean {
        s = s.replace(/\r/g, '');
        const strings = g.splitLines(s);
        return this.check_lines(strings);
    }

    public check_lines(strings: string[]): boolean {
        if (!strings || !strings.length) {
            return false;
        }
        let [level1, plusFlag] = this.headlineLevel(strings[0]);
        if (level1 === -1) {
            return false;
        }
        // Check the level of all headlines.
        let lastLevel = level1;
        for (const s of strings) {
            let [level, newFlag] = this.headlineLevel(s);
            if (level === -1) {
                return true; // A body line.
            }
            if (level < level1 || level > lastLevel + 1) {
                return false; // improper level.
            }
            if (level > lastLevel && !plusFlag) {
                return false; // parent of this node has no children.
            }
            if (level === lastLevel && plusFlag) {
                return false; // last node has missing child.
            }
            lastLevel = level;
            plusFlag = newFlag;
        }
        return true;
    }
    //@-others
}
//@+node:felix.20230511002459.1: ** class RecursiveImportController
/**
 * Recursively import all python files in a directory and clean the result.
 */
export class RecursiveImportController {
    public c: Commands;
    public file_pattern: RegExp;
    public ignore_pattern: RegExp;
    public kind: string;
    public root_directory: string = "";
    public recursive: boolean;
    public root: Position | undefined;
    public safe_at_file: boolean = false;
    public theTypes: string[] | undefined;
    public verbose: boolean = false;
    public n_files: number = 0;
    public isReady: Thenable<boolean>;

    //@+others
    //@+node:felix.20230511002459.2: *3* ric.ctor
    /**
     * Ctor for RecursiveImportController class.
     */
    constructor(
        c: Commands,
        dir_: string,
        ignore_pattern: RegExp | undefined = undefined,
        kind: string,
        // add_context: boolean | undefined = undefined, // Override setting only if True/False
        // add_file_context: boolean | undefined = undefined, // Override setting only if True/False
        // add_path: boolean = true,
        recursive: boolean = true,
        safe_at_file: boolean = true,
        theTypes: string[] | undefined = undefined,
        verbose: boolean = true // legacy value.
    ) {
        this.c = c;
        // this.add_path = add_path;
        this.file_pattern = /^(@@|@)(auto|clean|edit|file|nosent)/;
        this.ignore_pattern = ignore_pattern || /\.git|node_modules/;
        this.kind = kind; // in ('@auto', '@clean', '@edit', '@file', '@nosent')
        this.recursive = recursive;
        this.root = undefined;
        this.isReady = g.os_path_isdir(dir_).then((w_isDir) => {
            this.root_directory = w_isDir ? dir_ : g.os_path_dirname(dir_);
            // Adjust the root directory.
            console.assert(dir_ && this.root_directory, dir_);
            this.root_directory = this.root_directory.replace(/\\/g, '/');
            if (this.root_directory.endsWith('/')) {
                this.root_directory = this.root_directory.slice(0, -1);
            }
            this.safe_at_file = safe_at_file;
            this.theTypes = theTypes;
            this.verbose = verbose;
            return true;
        });

        // #1605:

        // const set_bool = (setting: string, val: any): void => {
        //     if (![true, false].includes(val)) {
        //         return;
        //     }
        //     c.config.set(undefined, 'bool', setting, val, true);
        // };

        // set_bool('add-context-to-headlines', add_context);
        // set_bool('add-file-context-to-headlines', add_file_context);
    }
    //@+node:felix.20230511002459.3: *3* ric.run & helpers
    /**
     * Import all files whose extension matches this.theTypes in dir_.
     * In fact, dir_ can be a path to a single file.
     */
    public async run(dir_: string): Promise<void> {
        await this.isReady;
        if (
            !['@auto', '@clean', '@edit', '@file', '@nosent'].includes(
                this.kind
            )
        ) {
            g.es('bad kind param', this.kind);
            return;
        }
        const [c, u] = [this.c, this.c.undoer];
        const t1 = process.hrtime();
        g.app.disable_redraw = true;

        const last = c.lastTopLevel();
        // Always create a new last top-level node.
        this.root = last.insertAfter();
        const parent = this.root;
        try {
            c.selectPosition(last);
            const undoData = u.beforeInsertNode(last);

            parent.v.h = 'imported files';
            // Leo 5.6: Special case for a single file.
            this.n_files = 0;
            const w_isFile = await g.os_path_isfile(dir_);
            if (w_isFile) {
                if (this.verbose) {
                    g.es_print('\nimporting file:', dir_);
                }
                await this.import_one_file(dir_, parent);
            } else {
                await this.import_dir(dir_, parent);
            }
            await this.post_process(parent);
            u.afterInsertNode(parent, 'recursive-import', undoData);
        } catch (exception) {
            g.es_print('Exception in recursive import');
            g.es_exception(exception);
        } finally {
            g.app.disable_redraw = false;
            for (const p2 of parent.self_and_subtree(false)) {
                p2.contract();
            }
            c.redraw(parent);
        }
        if (!g.unitTesting) {
            const t2 = process.hrtime();
            const n = [...parent.self_and_subtree()].length;
            g.es_print(
                `imported ${n} node${g.plural(n)} ` +
                `in ${this.n_files} file${g.plural(this.n_files)} ` +
                `in ${utils.getDurationSeconds(t1, t2)} seconds`
            );
        }
    }
    //@+node:felix.20230511002459.4: *4* ric.import_dir
    /**
     * Import selected files from dir_, a directory.
     */
    public async import_dir(dir_: string, parent: Position): Promise<void> {
        await this.isReady;

        let files;

        if (await g.os_path_isfile(dir_)) {
            files = [dir_];
        } else {
            if (this.verbose) {
                g.es_print('importing directory:', dir_);
            }
            files = await g.os_listdir(dir_);
            files = files.sort();
        }

        const dirs = [];
        const files2 = [];

        for (let w_path of files) {
            try {
                // Catch path exceptions: keep going on small errors.
                w_path = g.os_path_join(dir_, w_path);
                if (await g.os_path_isfile(w_path)) {
                    let [name, ext] = g.os_path_splitext(w_path);
                    if (this.theTypes && this.theTypes.includes(ext)) {
                        files2.push(w_path);
                    }
                } else if (this.recursive) {
                    // if (this.ignore_pattern.search(w_path) === -1){
                    if (w_path.search(this.ignore_pattern) === -1) {
                        dirs.push(w_path);
                    }
                }
            } catch (OSError) {
                g.es_print('Exception computing', w_path);
                g.es_exception(OSError);
            }
        }

        if (files.length || dirs.length) {
            parent = parent.insertAsLastChild();
            parent.v.h = dir_;
            if (files2.length) {
                for (const f of files2) {
                    // if (this.ignore_pattern.search(f)===-1){
                    if (f.search(this.ignore_pattern) === -1) {
                        await this.import_one_file(f, (parent = parent));
                    }
                }
            }
            if (dirs.length) {
                console.assert(this.recursive);
                for (const dir_ of dirs.sort()) {
                    await this.import_dir(dir_, parent);
                }
            }
        }
    }
    //@+node:felix.20230511002459.5: *4* ric.import_one_file
    /**
     * Import one file to the last top-level node.
     */
    public async import_one_file(
        p_path: string,
        parent: Position
    ): Promise<void> {
        await this.isReady;

        const c = this.c;
        this.n_files += 1;
        console.assert(
            this.root && parent && parent.v !== this.root.v,
            'Error in import_one_file'
        );
        let p: Position;
        if (this.kind === '@edit') {
            p = parent.insertAsLastChild();
            p.v.h = '@edit ' + p_path.replace(/\\/g, '/'); // 2021/02/19: bug fix: add @edit.
            let [s, e] = await g.readFileIntoString(
                p_path,
                undefined,
                this.kind
            );
            p.v.b = s || '';
            return;
        }
        // #1484: Use this for @auto as well.
        await c.importCommands.importFilesCommand(
            [p_path],
            parent,
            true,
            '@file', // '@auto','@clean','@nosent' cause problems.
            this.verbose // Leo 6.6.
        );
        p = parent.lastChild();
        p.h = this.kind + p.h.substring(5); // Honor the requested kind.
        if (this.safe_at_file) {
            p.v.h = '@' + p.v.h;
        }
    }
    //@+node:felix.20230511002459.6: *4* ric.post_process & helpers
    /**
     * Traverse p's tree, replacing all nodes that start with prefix
     * by the smallest equivalent @path or @file node.
     */
    public async post_process(p: Position): Promise<void> {
        await this.isReady;

        this.fix_back_slashes(p);
        for (const p2 of p.subtree()) {
            await this.minimize_headline(p2);
        }
        if (!['@auto', '@edit'].includes(this.kind)) {
            this.remove_empty_nodes(p);
        }

        this.clear_dirty_bits(p);
        this.add_class_names(p);
    }
    //@+node:felix.20230511002459.7: *5* ric.add_class_names
    /**
     * Add class names to headlines for all descendant nodes.
     */
    public add_class_names(p_p: Position): void {
        let after: Position | undefined;
        let class_name: string | undefined;
        const class_paren_pattern = /(.*)\(.*\)\.(.*)/;
        const paren_pattern = /(.*)\(.*\.py\)/;
        for (const p of p_p.self_and_subtree(false)) {
            // Part 1: update the status.
            let m = p.h.match(this.file_pattern);
            if (m) {
                // prefix = m.group(1)
                // fn = g.shortFileName(p.h[len(prefix):].trim())
                [after, class_name] = [undefined, undefined];
                continue;
            } else if (p.h.startsWith('@path ')) {
                [after, class_name] = [undefined, undefined];
            } else if (p.h.startsWith('class ')) {
                class_name = p.h.substring(5).trim();
                if (class_name) {
                    after = p.nodeAfterTree();
                    continue;
                }
            } else if (p === after) {
                [after, class_name] = [undefined, undefined];
            }
            // Part 2: update the headline.
            if (class_name) {
                if (p.h.startsWith(class_name)) {
                    m = p.h.match(class_paren_pattern);
                    if (m) {
                        p.h = `${m[1]}.${m[2]}`.trimEnd();
                    }
                } else {
                    p.h = `${class_name}.${p.h}`;
                }
            } else {
                m = p.h.match(paren_pattern);
                if (m) {
                    p.h = m[1].trimEnd();
                }
            }

            // elif fn:
            // tag = ' (%s)' % fn
            // if not p.h.endsWith(tag):
            // p.h += tag
        }
    }
    //@+node:felix.20230511002459.8: *5* ric.clear_dirty_bits
    public clear_dirty_bits(p_p: Position): void {
        const c = this.c;
        c.clearChanged(); // Clears *all* dirty bits.
        for (const p of p_p.self_and_subtree(false)) {
            p.clearDirty();
        }
    }
    //@+node:felix.20230511002459.9: *5* ric.dump_headlines
    public dump_headlines(p_p: Position): void {
        // show all headlines.
        for (const p of p_p.self_and_subtree(false)) {
            console.log(p.h);
        }
    }
    //@+node:felix.20230511002459.10: *5* ric.fix_back_slashes
    /**
     * Convert backslash to slash in all headlines.
     */
    public fix_back_slashes(p_p: Position): void {
        for (const p of p_p.self_and_subtree(false)) {
            const s = p.h.replace(/\\/g, '/');
            if (s !== p.h) {
                p.v.h = s;
            }
        }
    }
    //@+node:felix.20230511002459.11: *5* ric.minimize_headline
    /**
     * Adjust headlines and add @path directives to headlines or body text.
     * Create an @path directive in @<file> nodes.
     */
    public async minimize_headline(p: Position): Promise<void> {
        await this.isReady;

        console.assert(g.os_path_isabs(this.root_directory), "Starting minimize_headline, os_path_isabs failed with " + this.root_directory);

        /**
         * Return path relative to the root directory.
         */
        const relative_path = (p_path: string): string => {
            console.assert(p_path.startsWith(this.root_directory),
                "in relative_path, " + p_path.toString() + " does not starts with " + this.root_directory
            );
            console.assert(g.os_path_isabs(p_path),
                "in relative_path, not os_path_isabs: " + p_path.toString()
            );
            p_path = p_path.includes('/') ? p_path.split('/').slice(-1)[0] : p_path;
            return p_path;
        };
        /**
         * Compute the relative path to be used in an @path directive.
         */
        const compute_at_path_path = (p_path: string): string => {

            console.assert(p_path.startsWith(this.root_directory),
                "in  compute_at_path_path, " + p_path.toString() + " does not starts with " + this.root_directory

            );
            console.assert(g.os_path_isabs(p_path),
                "in compute_at_path_path, not os_path_isabs: " + p_path.toString()
            );
            p_path = p_path.slice(this.root_directory.length);
            if (p_path.startsWith('/')) {
                p_path = p_path.slice(1);
            }
            return p_path;
        };

        const m = p.h.match(this.file_pattern);
        if (m && m.length) {
            // p is an @file node of some kind.
            const kind = m[0];
            let w_path = p.h.slice(kind.length).trim().replace(/\\/g, '/');
            // Shorten p.h.
            p.h = `${kind} ${relative_path(w_path)}`;
            // Prepend an @path directive to p.b if it has a directory component.
            w_path = compute_at_path_path(w_path);
            if (w_path && w_path.includes('/')) {
                const directory = w_path.split('/').slice(0, -1).join('/');
                p.b = `@path ${directory}\n${p.b}`;
            }

        } else if (p.h.includes('/') && p.h === this.root_directory) {
            // Show the last component.
            const directory = p.h.split('/').slice(-1);
            p.h = `path: ${directory}`;
        } else if (p.h.startsWith(this.root_directory)) {
            // The importer has created the start of an @path node.
            const h = compute_at_path_path(p.h);
            if (h) {
                p.h = `path: ${h}`;
            }
        }

    }
    //@+node:felix.20230511002459.12: *6* ric.strip_prefix
    /**
     * Strip the prefix from the path and return the result.
     */
    public strip_prefix(p_path: string, prefix: string): string {
        if (p_path.startsWith(prefix)) {
            return p_path.substring(prefix.length);
        }
        return ''; // A signal.
    }
    //@+node:felix.20230511002459.13: *5* ric.remove_empty_nodes
    /**
     * Remove empty nodes. Not called for @auto or @edit trees.
     */
    public remove_empty_nodes(p: Position): void {
        const c = this.c;

        /**
         * Return True if p has any descendant that is not an @path node.
         */
        const has_significant_children = (p: Position) => {
            if (!p.hasChildren()) {
                return false;
            }
            if (!p.h.startsWith('path: ')) {
                return true;
            }
            for (const p2 of p.subtree()) {
                if (has_significant_children(p2)) {
                    return true;
                }
            }
            return false;
        };

        const aList = [...p.self_and_subtree()].filter(
            (p2) => !p2.b.trim() && !has_significant_children(p2)
        );

        if (aList && aList.length) {
            c.deletePositionsInList(aList); // Don't redraw
        }
    }
    //@-others
}
//@+node:felix.20230511002653.1: ** class TabImporter
/**
 * A class to import a file whose outline levels are indicated by
 * leading tabs or blanks (but not both).
 */
export class TabImporter {
    public c: Commands;
    public root: Position | undefined;
    public separate: boolean;
    public stack: [number, Position][];

    /**
     * Ctor for the TabImporter class.
     */
    public constructor(c: Commands, separate = true) {
        this.c = c;
        this.root = undefined;
        this.separate = separate;
        this.stack = [];
    }

    //@+others
    //@+node:felix.20230511002653.2: *3* tabbed.check
    /**
     * Return False and warn if lines contains mixed leading tabs/blanks.
     */
    public check(lines: string[], warn = true): boolean {
        let blanks = 0;
        let tabs = 0;
        for (const s of lines) {
            const lws = this.lws(s);
            if (lws.includes('\t')) {
                tabs += 1;
            }
            if (lws.includes(' ')) {
                blanks += 1;
            }
        }
        if (tabs && blanks) {
            if (warn) {
                g.es_print('intermixed leading blanks and tabs.');
            }
            return false;
        }
        return true;
    }
    //@+node:felix.20230511002653.3: *3* tabbed.dump_stack
    /**
     * Dump the stack, containing (level, p) tuples.
     */
    public dump_stack(): void {
        g.trace('==========');
        for (let [i, data] of Object.entries(this.stack)) {
            let [level, p] = data;
            console.log(`${i} ${level} ${p.h}`);
        }
    }
    //@+node:felix.20230511002653.4: *3* tabbed.import_files
    /**
     * Import a list of tab-delimited files.
     */
    public async import_files(files: string[]): Promise<void> {
        const c = this.c;
        const u = this.c.undoer;
        let s: string;
        if (files && files.length) {
            let p: Position | undefined;
            for (const fn of files) {
                try {
                    g.setGlobalOpenDir(fn);
                    // s = open(fn).read();
                    const w_uri = g.makeVscodeUri(fn);
                    const readData = await vscode.workspace.fs.readFile(w_uri);
                    s = Buffer.from(readData).toString('utf8');
                    s = s.replace(/\r/g, '');
                } catch (exception) {
                    continue;
                }
                if (s.trim() && this.check(g.splitLines(s))) {
                    const undoData = u.beforeInsertNode(c.p);
                    const last = c.lastTopLevel();
                    this.root = last.insertAfter();
                    p = this.root;
                    this.scan(s);
                    p.h = g.shortFileName(fn);
                    p.contract();
                    p.setDirty();
                    u.afterInsertNode(p, 'Import Tabbed File', undoData);
                }
                if (p && p.__bool__()) {
                    c.setChanged();
                    c.redraw(p);
                }
            }
        }
    }
    //@+node:felix.20230511002653.5: *3* tabbed.lws
    /**
     * Return the length of the leading whitespace of s.
     */
    public lws(s: string): string {
        for (let i = 0; i < s.length; i++) {
            let ch = s[i];
            if (ch !== ' ' && ch !== '\t') {
                return s.substring(0, i);
            }
        }

        return s;
    }
    //@+node:felix.20230511002653.6: *3* tabbed.prompt_for_files
    /**
     * Prompt for a list of FreeMind (.mm.html) files and import them.
     */
    public async prompt_for_files(): Promise<void> {
        const c = this.c;
        const types: [string, string][] = [['All files', '*']];

        const names = (await g.app.gui.runOpenFileDialog(
            c,
            'Import Tabbed File',
            types,
            '.html',
            true
        )) as string[];

        // c.bringToFront();
        if (names && names.length) {
            await g.chdir(names[0]);
            await this.import_files(names);
        }
    }
    //@+node:felix.20230511002653.7: *3* tabbed.scan
    /**
     * Create the outline corresponding to s1.
     */
    public scan(s1: string, fn?: string, root?: Position): Position {
        const c = this.c;
        // Self.root can be None if we are called from a script or unit test.
        if (!this.root || !this.root.__bool__()) {
            const last = root ? root : c.lastTopLevel(); // For unit testing.
            this.root = last.insertAfter();
            if (fn) {
                this.root.h = fn;
            }
        }

        const lines = g.splitLines(s1);
        this.stack = [];
        // Redo the checks in case we are called from a script.
        if (s1.trim() && this.check(lines)) {
            for (const s of lines) {
                if (s.trim() || !this.separate) {
                    this.scan_helper(s);
                }
            }
        }
        return this.root;
    }
    //@+node:felix.20230511002653.8: *3* tabbed.scan_helper
    /**
     * Update the stack as necessary and return level.
     */
    public scan_helper(s: string): number {
        const root = this.root!;
        const separate = this.separate;
        let stack = this.stack;

        let level: number;
        let parent: Position | undefined;
        let grand_parent: Position | undefined;
        if (stack && stack.length) {
            [level, parent] = stack[stack.length - 1];
        } else {
            [level, parent] = [0, undefined];
        }

        const lws = this.lws(s).length;
        const h = s.trim();
        if (lws === level) {
            if (separate || !parent || !parent.__bool__()) {
                // Replace the top of the stack with a new entry.
                if (stack && stack.length) {
                    stack.pop();
                }
                grand_parent =
                    stack && stack.length ? stack[stack.length - 1][1] : root;
                parent = grand_parent.insertAsLastChild(); // lws == level
                parent.h = h;
                stack.push([level, parent]);
            } else if (!parent.h) {
                parent.h = h;
            } else if (lws > level) {
                // Create a new parent.
                level = lws;
                parent = parent.insertAsLastChild();
                parent.h = h;
                stack.push([level, parent]);
            } else {
                // Find the previous parent.
                let w_found = false;
                while (stack && stack.length) {
                    let [level2, parent2] = stack.pop()!;
                    if (level2 === lws) {
                        grand_parent =
                            stack && stack.length
                                ? stack[stack.length - 1][1]
                                : root;
                        parent = grand_parent.insertAsLastChild(); // lws < level
                        parent.h = h;
                        level = lws;
                        stack.push([level, parent]);
                        w_found = true;
                        break;
                    }
                }
                if (!w_found) {
                    level = 0;
                    parent = root.insertAsLastChild();
                    parent.h = h;
                    stack = [[0, parent]];
                }
            }
        }
        console.assert(parent && parent.__eq__(stack[stack.length - 1][1])); // An important invariant.
        console.assert(
            level === stack[stack.length - 1][0],
            JSON.stringify([level, stack[stack.length - 1][0]])
        );
        if (!separate && parent) {
            parent.b = parent.b + this.undent(level, s);
        }

        return level;
    }
    //@+node:felix.20230511002653.9: *3* tabbed.undent
    /**
     * Unindent all lines of p.b by level.
     */
    public undent(level: number, s: string): string {
        if (level <= 0) {
            return s;
        }
        if (s.trim()) {
            const lines = g.splitLines(s);
            const ch = lines[0][0];
            console.assert(' \t'.includes(ch), ch.toString());
            // Check that all lines start with the proper lws.
            const lws = ch.repeat(level);
            for (const s of lines) {
                if (!s.startsWith(lws)) {
                    g.trace(`bad indentation: ${s.toString()}`);
                    return s;
                }
            }
            // return ''.join([z[len(lws) :] for z in lines])
            return lines.map((z) => z.substring(lws.length)).join('');
        }
        return '';
    }
    //@-others
}
//@+node:felix.20230521004305.1: ** class ToDoImporter
export class ToDoImporter {
    public c: Commands;
    // Patterns...
    // mark_s = r'([x]\ )'
    // priority_s = r'(\([A-Z]\)\ )'
    // date_s = r'([0-9]{4}-[0-9]{2}-[0-9]{2}\ )'
    // task_s = r'\s*(.+)'
    // line_s = fr"^{mark_s}?{priority_s}?{date_s}?{date_s}?{task_s}$"
    line_pat =
        /^([x]\ )?(\([A-Z]\)\ )?([0-9]{4}-[0-9]{2}-[0-9]{2}\ )?([0-9]{4}-[0-9]{2}-[0-9]{2}\ )?\s*(.+)$/;

    constructor(c: Commands) {
        this.c = c;
    }

    //@+others
    //@+node:felix.20230521004305.2: *3* todo_i.get_tasks_from_file
    /**
     * Return the tasks from the given path.
     */
    public async get_tasks_from_file(p_path: string): Promise<any[]> {
        const tag = 'import-todo-text-files';
        const w_exists = await g.os_path_exists(p_path);
        if (!w_exists) {
            console.log(`${tag}: file not found: ${p_path}`);
            return [];
        }
        try {
            const w_uri = g.makeVscodeUri(p_path);
            const readData = await vscode.workspace.fs.readFile(w_uri);
            const contents = Buffer.from(readData).toString('utf8');

            // with open(p_path, 'r') as f:
            //     contents = f.read()

            const tasks = this.parse_file_contents(contents);

            return tasks;
        } catch (exception) {
            console.log(`unexpected exception in ${tag}`);
            g.es_exception(exception);
            return [];
        }
    }
    //@+node:felix.20230521004305.3: *3* todo_i.import_files
    /**
     * Import all todo.txt files in the given list of file names.
     *
     * Return a dict: keys are full paths, values are lists of ToDoTasks"
     */
    public async import_files(
        files: string[]
    ): Promise<{ [key: string]: any[] }> {
        const d: { [key: string]: any[] } = {};
        const tag = 'import-todo-text-files';
        for (const w_path of files) {
            try {
                // with open(w_path, 'r') as f:
                //     contents = f.read()

                const w_uri = g.makeVscodeUri(w_path);
                const readData = await vscode.workspace.fs.readFile(w_uri);
                const contents = Buffer.from(readData).toString('utf8');
                const tasks = this.parse_file_contents(contents);
                d[w_path] = tasks;
            } catch (exception) {
                console.log(`unexpected exception in ${tag}`);
                g.es_exception(exception);
            }
        }

        return d;
    }
    //@+node:felix.20230521004305.4: *3* todo_i.parse_file_contents
    /**
     * Parse the contents of a file.
     * Return a list of ToDoTask objects.
     */
    public parse_file_contents(s: string): any[] {
        let trace = false;
        const tasks: ToDoTask[] = [];
        for (const line of g.splitLines(s)) {
            if (!line.trim()) {
                continue;
            }
            if (trace) {
                console.log(`task: ${line.toString().trimEnd()}`);
            }
            const m = line.match(this.line_pat);
            if (!m) {
                console.log(`invalid task: ${line.toString().trimEnd()}`);
                continue;
            }
            // Groups 1, 2 and 5 are context independent.
            const completed = m[1];
            const priority = m[2];
            const task_s = m[5];
            if (!task_s) {
                console.log(`invalid task: ${line.toString().trimEnd()}`);
                continue;
            }
            // Groups 3 and 4 are context dependent.
            let complete_date, start_date;
            if (m[3] && m[4]) {
                complete_date = m[3];
                start_date = m[4];
            } else if (completed) {
                complete_date = m[3];
                start_date = '';
            } else {
                start_date = m[3] || '';
                complete_date = '';
            }
            if (completed && !complete_date) {
                console.log(`no completion date: ${line.toString().trimEnd()}`);
            }
            tasks.push(
                new ToDoTask(
                    !!completed,
                    priority,
                    start_date,
                    complete_date,
                    task_s
                )
            );
        }
        return tasks;
    }
    //@+node:felix.20230521004305.5: *3* todo_i.prompt_for_files
    /**
     * Prompt for a list of todo.text files and import them.

        Return a python dict. Keys are full paths; values are lists of ToDoTask objects.
     */
    public async prompt_for_files(): Promise<{ [key: string]: any }> {
        const c = this.c;
        const types: [string, string][] = [
            ['Text files', '*.txt'],
            ['All files', '*'],
        ];
        const names = (await g.app.gui.runOpenFileDialog(
            c,
            'Import todo.txt File',
            types,
            '.txt',
            true
        )) as string[];

        // c.bringToFront() ;

        if (!names || !names.length) {
            return {};
        }
        await g.chdir(names[0]);
        const d = await this.import_files(names);
        for (const key of Object.keys(d).sort()) {
            const tasks = d[key];
            console.log(`tasks in ${g.shortFileName(key)}...\n`);
            for (const task of tasks) {
                console.log(`    ${task}`);
            }
        }
        return d;
    }
    //@-others
}
//@+node:felix.20230521004313.1: ** class ToDoTask
/**
 * A class representing the components of a task line.
 */
export class ToDoTask {
    public completed: boolean;
    public priority: string;
    public start_date: string;
    public complete_date: string;
    public task_s: string;
    // Parse tags into separate dictionaries.
    public projects: string[];
    public contexts: string[];
    public key_vals: string[];
    // Patterns...
    public project_pat = /(\+\S+)/;
    public context_pat = /(@\S+)/;
    public key_val_pat = /((\S+):(\S+))/; // Might be a false match.

    constructor(
        completed: boolean,
        priority: string,
        start_date: string,
        complete_date: string,
        task_s: string
    ) {
        this.completed = completed;
        this.priority = (priority && priority[1]) || '';
        this.start_date = (start_date && start_date.trimEnd()) || '';
        this.complete_date = (complete_date && complete_date.trimEnd()) || '';
        this.task_s = task_s.trim();
        // Parse tags into separate dictionaries.
        this.projects = [];
        this.contexts = [];
        this.key_vals = [];
        this.parse_task();
    }

    //@+others
    //@+node:felix.20230521004313.2: *3* task.__repr__ & __str__
    public __repr__(): string {
        const start_s = this.start_date ? this.start_date : '';
        const end_s = this.complete_date ? this.complete_date : '';
        const mark_s = this.completed ? '[X]' : '[ ]';
        const result = [
            `Task: `,
            `${mark_s} `,
            `${this.priority} `,
            `start: ${start_s} `,
            `end: ${end_s} `,
            `${this.task_s}`,
        ];
        // for (const ivar of ['contexts', 'projects', 'key_vals'])
        //     aList = getattr(self, ivar, None)
        //     if aList
        //         result.append(f"{' '*13}{ivar}: {aList}")
        if (this.contexts) {
            result.push(
                `${' '.repeat(13)}contexts: ${this.contexts.toString()}`
            );
        }
        if (this.projects) {
            result.push(
                `${' '.repeat(13)}projects: ${this.projects.toString()}`
            );
        }
        if (this.key_vals) {
            result.push(
                `${' '.repeat(13)}key_vals: ${this.key_vals.toString()}`
            );
        }

        return result.join('\n');
    }

    public __str__(): string {
        return this.__repr__();
    }
    public toString(): string {
        return this.__repr__();
    }
    //@+node:felix.20230521004313.3: *3* task.parse_task
    public parse_task(): void {
        let trace = false && !g.unitTesting;
        let s = this.task_s;
        const table: [string, RegExp, string[]][] = [
            ['context', this.context_pat, this.contexts],
            ['project', this.project_pat, this.projects],
            ['key:val', this.key_val_pat, this.key_vals],
        ];
        for (let [kind, pat, aList] of table) {
            let m: RegExpExecArray | null;
            const pat_global = new RegExp(pat, 'g');
            while ((m = pat_global.exec(s)) !== null) {
                // Check for false key:val match:
                if (kind === 'key:val') {
                    let [key, value] = [m[2], m[3]];
                    if (key.includes(':') || value.includes(':')) {
                        break;
                    }
                }
                const tag = m[1];

                // Add the tag.
                if (aList.includes(tag)) {
                    if (trace) {
                        g.trace('Duplicate tag:', tag);
                    }
                } else {
                    if (trace) {
                        g.trace(`Add ${kind} tag: ${tag.toString()}`);
                    }
                    aList.push(tag);
                }
                // Remove the tag from the task.
                // s = re.sub(pat, "", s);
                s = s.replace(pat, ''); // No 'g' flag, so one at a time from  while loop
            }
        }

        if (s !== this.task_s) {
            this.task_s = s.trim();
        }
    }
    //@-others
}
//@+node:felix.20230521004344.1: ** class ZimImportController
/**
 * A class to import Zim folders and files: http://zim-wiki.org/
 * First use Zim to export your project to rst files.
 *
 * Original script by Davy Cottet.
 *
 * User options:
 *    @int rst_level = 0
 *    @string rst_type
 *    @string zim_node_name
 *    @string path_to_zim
 */
export class ZimImportController {
    public c: Commands;
    public pathToZim: string;
    public rstLevel: number;
    public rstType: string;
    public zimNodeName: string;

    //@+others
    //@+node:felix.20230521004344.2: *3* zic.__init__ & zic.reloadSettings
    /**
     * Ctor for ZimImportController class.
     */
    constructor(c: Commands) {
        this.c = c;
        this.pathToZim = c.config.getString('path-to-zim');
        this.rstLevel = c.config.getInt('zim-rst-level') || 0;
        this.rstType = c.config.getString('zim-rst-type') || 'rst';
        this.zimNodeName =
            c.config.getString('zim-node-name') || 'Imported Zim Tree';
    }
    //@+node:felix.20230521004344.3: *3* zic.parseZimIndex
    /**
     * Parse Zim wiki index.rst and return a list of tuples (level, name, path) or None.
     */
    public async parseZimIndex(): Promise<
        [number, string, string[]][] | undefined
    > {
        // c = self.c
        const pathToZim = g.os_path_abspath(this.pathToZim);
        const pathToIndex = g.os_path_join(pathToZim, 'index.rst');
        const w_exists = await g.os_path_exists(pathToIndex);
        if (!w_exists) {
            g.es(`not found: ${pathToIndex}`);
            return undefined;
        }

        //index = open(pathToIndex).read()
        const w_uri = g.makeVscodeUri(pathToIndex);
        const readData = await vscode.workspace.fs.readFile(w_uri);
        const index = Buffer.from(readData).toString('utf8');

        // parse = re.findall(r'(\t*)-\s`(.+)\s<(.+)>`_', index)
        const regex = /(\t*)-\s`(.+)\s<(.+)>`_/g;
        const parse = [];
        let match;

        while ((match = regex.exec(index)) !== null) {
            const [, m1, m2, m3] = match; // skip match[0]
            parse.push([m1, m2, m3]);
        }

        if (!parse.length) {
            g.es(`invalid index: ${pathToIndex}`);
            return undefined;
        }
        const results: [number, string, string[]][] = [];
        for (const result of parse) {
            const level = result[0].length;
            const name = result[1]; // .decode('utf-8') // already decoded from buffer above in leojs.
            const unquote = decodeURIComponent; // urllib.parse.unquote;
            // mypy: error: "str" has no attribute "decode"; maybe "encode"?  [attr-defined]
            const w_path = [
                g.os_path_abspath(
                    g.os_path_join(pathToZim, unquote(result[2]))
                ), // already decoded from buffer above in leojs.
            ];
            results.push([level, name, w_path]);
        }

        return results;
    }
    //@+node:felix.20230521004344.4: *3* zic.rstToLastChild
    /**
     * Import an rst file as a last child of pos node with the specified name
     */
    public async rstToLastChild(
        p: Position,
        p_name: string,
        rst: string[]
    ): Promise<Position> {
        const c = this.c;
        await c.importCommands.importFilesCommand(rst, p, undefined, '@rst');
        const rstNode = p.getLastChild();
        rstNode.h = p_name;
        return rstNode;
    }
    //@+node:felix.20230521004344.5: *3* zic.clean
    /**
     * Clean useless nodes
     */
    public clean(zimNode: Position, rstType: string): void {
        const warning = 'Warning: this node is ignored when writing this file';
        for (const p of zimNode.subtree_iter()) {
            // looking for useless bodies
            if (p.hasFirstChild() && p.b.includes(warning)) {
                const child = p.getFirstChild();
                // fmt = "@rst-no-head %s declarations"
                const table = [
                    // fmt % p.h.replace(/ /g, "_"),
                    `@rst-no-head ${p.h.replace(/ /g, '_')} declarations`,
                    `@rst-no-head ${p.h
                        .split(rstType)
                        .join('')
                        .trim()
                        .replace(/ /g, '_')} declarations`,
                    // fmt % p.h.split(rstType).join('').trim().replace(/ /g, "_"),
                ];
                // Replace content with @rest-no-head first child (without title head) and delete it
                if (table.includes(child.h)) {
                    p.b = child.b.split('\n').slice(3).join('\n');
                    child.doDelete();
                    // Replace content of empty body parent node with first child with same name
                } else if (p.h === child.h || `${rstType} ${child.h}` === p.h) {
                    if (!child.hasFirstChild()) {
                        p.b = child.b;
                        child.doDelete();
                    } else if (!child.hasNext()) {
                        p.b = child.b;
                        child.copyTreeFromSelfTo(p);
                        child.doDelete();
                    } else {
                        child.h = 'Introduction';
                    }
                }
            } else if (
                p.hasFirstChild() &&
                p.h.startsWith('@rst-no-head') &&
                !p.b.trim()
            ) {
                const child = p.getFirstChild();
                const p_no_head = p.h.replace('@rst-no-head', '').trim();
                // Replace empty @rst-no-head by its same named children
                if (child.h.trim() === p_no_head && !child.hasFirstChild()) {
                    p.h = p_no_head;
                    p.b = child.b;
                    child.doDelete();
                }
            } else if (p.h.startsWith('@rst-no-head')) {
                const lines = p.b.split('\n');
                p.h = lines[1];
                p.b = lines.slice(3).join('\n');
            }
        }
    }
    //@+node:felix.20230521004344.6: *3* zic.run
    /**
     * Create the zim node as the last top-level node.
     */
    public async run(): Promise<void> {
        const c = this.c;
        // Make sure a path is given.
        if (!this.pathToZim) {
            g.es('Missing setting: @string path_to_zim');
            return;
        }
        const root = c.rootPosition()!;
        while (root.hasNext()) {
            root.moveToNext();
        }
        const zimNode = root.insertAfter();
        zimNode.h = this.zimNodeName;
        // Parse the index file
        const files = await this.parseZimIndex();
        if (files && files.length) {
            // Do the import
            const rstNodes: { [key: string]: Position } = { '0': zimNode };
            for (let [level, name, rst] of files) {
                if (level === this.rstLevel) {
                    name = `${this.rstType} ${name}`;
                }
                rstNodes[(level + 1).toString()] = await this.rstToLastChild(
                    rstNodes[level.toString()],
                    name,
                    rst
                );
            }
            // Clean nodes
            g.es('Start cleaning process. Please wait...');
            this.clean(zimNode, this.rstType);
            g.es('Done');
            // Select zimNode
            c.selectPosition(zimNode);
            c.redraw();
        }
    }
    //@-others
}
//@+node:felix.20230521004413.2: ** class Node
/**
 * Hold node data.
 */
class Node {
    public h: string;
    public level: number;
    public lines: string[];

    constructor(h: string, level: number) {
        this.h = h.trim();
        this.level = level;
        this.lines = [];
    }
}
//@+node:felix.20230521004413.1: ** class LegacyExternalFileImporter
/**
 * A class to import external files written by versions of Leo earlier
 * than 5.0.
 */
export class LegacyExternalFileImporter {
    public c: Commands;
    // Sentinels to ignore, without the leading comment delim.
    public ignore = [
        '@+at',
        '@-at',
        '@+leo',
        '@-leo',
        '@nonl',
        '@nl',
        '@-others',
    ];

    constructor(c: Commands) {
        this.c = c;
    }

    //@+others
    //@+node:felix.20230521004413.3: *3* legacy.add
    /**
     * Add a line to the present node.
     */
    public add(line: string, stack: Node[]): void {
        if (stack && stack.length) {
            const node = stack[stack.length - 1];
            node.lines.push(line);
        } else {
            console.log('orphan line: ', line.toString());
        }
    }
    //@+node:felix.20230521004413.4: *3* legacy.compute_delim1
    /**
     * Return the opening comment delim for the given file.
     */
    public compute_delim1(p_path: string): string | undefined {
        let [junk, ext] = g.os_path_splitext(p_path);
        if (!ext) {
            return undefined;
        }
        const language = g.app.extension_dict[ext.substring(1)];
        if (!language) {
            return undefined;
        }
        let [delim1, delim2, delim3] = g.set_delims_from_language(language);
        g.trace(language, delim1 || delim2);
        return delim1 || delim2;
    }
    //@+node:felix.20230521004413.5: *3* legacy.import_file
    /**
     * Import one legacy external file.
     */
    public async import_file(p_path: string): Promise<void> {
        const c = this.c;
        const root_h = g.shortFileName(p_path);
        const delim1 = this.compute_delim1(p_path);
        if (!delim1) {
            g.es_print('unknown file extension:');
            g.es_print(p_path);
            return;
        }

        // Read the file into s.
        // with open(p_path, 'r') as f
        //     s = f.read()

        const w_uri = g.makeVscodeUri(p_path);
        const readData = await vscode.workspace.fs.readFile(w_uri);
        let s = Buffer.from(readData).toString('utf8');

        // Do nothing if the file is a newer external file.
        if (!s.includes(delim1 + '@+leo-ver=4')) {
            g.es_print('not a legacy external file:');
            g.es_print(p_path);
            return;
        }
        // Compute the local ignore list for this file.
        const ignore = this.ignore.map((z) => delim1 + z); // tuple(delim1 + z for z in this.ignore);

        // Handle each line of the file.
        const nodes: Node[] = []; // An list of Nodes, in file order.
        let stack: Node[] = []; // A stack of Nodes.
        for (const line of g.splitLines(s)) {
            s = line.trimStart();
            const lws = line.substring(
                0,
                line.length - line.trimStart().length
            );
            if (s.startsWith(delim1 + '@@')) {
                this.add(lws + s.substring(2), stack);
            } else if (ignore.some((prefix) => s.startsWith(prefix))) {
                // Ignore these. Use comments instead of @doc bodies.
                // pass
            } else if (
                s.startsWith(delim1 + '@+others') ||
                s.startsWith(delim1 + '@' + lws + '@+others')
            ) {
                this.add(lws + '@others\n', stack);
            } else if (s.startsWith(delim1 + '@<<')) {
                const n = (delim1 + '@<<').length;
                this.add(lws + '<<' + s.substring(n).trimEnd() + '\n', stack);
            } else if (s.startsWith(delim1 + '@+node:')) {
                // Compute the headline.
                let h;
                if (stack && stack.length) {
                    h = s.substring(8);
                    let i = h.indexOf(':');
                    h = h.includes(':') ? h.substring(i + 1) : h;
                } else {
                    h = root_h;
                }
                // Create a node and push it.
                const node = new Node(h, stack.length);
                nodes.push(node);
                stack.push(node);
            } else if (s.startsWith(delim1 + '@-node')) {
                // End the node.
                stack.pop();
            } else if (s.startsWith(delim1 + '@')) {
                console.log('oops:', s.toString());
            } else {
                this.add(line, stack);
            }
        }
        if (stack && stack.length) {
            console.log('Unbalanced node sentinels');
        }
        // Generate nodes.
        const last = c.lastTopLevel();
        const root = last.insertAfter();
        root.h = `imported file: ${root_h}`;
        let stack2 = [root];
        for (const node of nodes) {
            const b = g.dedent(node.lines.join(''));
            const level = node.level;
            if (level === 0) {
                root.h = root_h;
                root.b = b;
            } else {
                const parent = stack2[level - 1];
                const p = parent.insertAsLastChild();
                p.b = b;
                p.h = node.h;
                // Good for debugging.
                // p.h = f"{level} {node.h}"
                stack2 = stack2.slice(0, level);
                stack2.push(p);
            }
        }
        c.selectPosition(root);
        root.expand(); // c.expandAllSubheads()
        c.redraw();
    }
    //@+node:felix.20230521004413.6: *3* legacy.import_files
    /**
     * Import zero or more files.
     */
    public async import_files(paths: string[]): Promise<void> {
        for (const w_path of paths) {
            const w_exists = await g.os_path_exists(w_path);
            if (w_exists) {
                await this.import_file(w_path);
            } else {
                g.es_print(`not found: ${w_path.toString()}`);
            }
        }
    }
    //@+node:felix.20230521004413.7: *3* legacy.prompt_for_files
    /**
     * Prompt for a list of legacy external .py files and import them.
     */
    public async prompt_for_files(): Promise<void> {
        const c = this.c;
        const types: [string, string][] = [
            ['Legacy external files', '*.py'],
            ['All files', '*'],
        ];

        const paths = (await g.app.gui.runOpenFileDialog(
            c,
            'Import Legacy External Files',
            types,
            '.py',
            true
        )) as string[];

        // c.bringToFront()

        if (paths && paths.length) {
            await g.chdir(paths[0]);
            await this.import_files(paths);
        }
    }
    //@-others
}
//@+node:felix.20230521235405.1: ** class TopLevelImportCommands
export class TopLevelImportCommands {
    //@+others
    //@+node:felix.20230521235405.2: *3* @g.command(import-free-mind-files)
    @command(
        'import-free-mind-files',
        'Prompt for free-mind files and import them.'
    )
    public async import_free_mind_files(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new FreeMindImporter(c).prompt_for_files();
        }
    }
    //@+node:felix.20230521235405.3: *3* @g.command(import-legacy-external-file)
    @command(
        'import-legacy-external-files',
        'Prompt for legacy external files and import them.'
    )
    public async import_legacy_external_files(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new LegacyExternalFileImporter(c).prompt_for_files();
        }
    }
    //@+node:felix.20230521235405.4: *3* @g.command(import-mind-map-files
    @command(
        'import-mind-jet-files',
        'Prompt for mind-jet files and import them.'
    )
    public async import_mind_jet_files(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new MindMapImporter(c).prompt_for_files();
        }
    }
    //@+node:felix.20230521235405.5: *3* @g.command(import-MORE-files)
    @command('import-MORE-files', 'Prompt for MORE files and import them.')
    public async import_MORE_files_command(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new MORE_Importer(c).prompt_for_files();
        }
    }
    //@+node:felix.20230521235405.6: *3* @g.command(import-tabbed-files)
    @command('import-tabbed-files', 'Prompt for tabbed files and import them.')
    public async import_tabbed_files_command(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new TabImporter(c).prompt_for_files();
        }
    }
    //@+node:felix.20230521235405.7: *3* @g.command(import-todo-text-files)
    @command(
        'import-todo-text-files',
        'Prompt for free-mind files and import them.'
    )
    public async import_todo_text_files(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new ToDoImporter(c).prompt_for_files();
        }
    }
    //@+node:felix.20230521235405.8: *3* @g.command(import-zim-folder)
    @command(
        'import-zim-folder',
        `
        Import a zim folder, http://zim-wiki.org/, as the last top-level node of the outline.

        First use Zim to export your project to rst files.

        This command requires the following Leo settings::

            @int rst_level = 0
            @string rst_type
            @string zim_node_name
            @string path_to_zim
        `
    )
    public async import_zim_command(this: Commands): Promise<void> {
        const c: Commands = this;
        if (c) {
            await new ZimImportController(c).run();
        }
    }
    //@+node:felix.20230521235405.9: *3* @g.command(parse-body)
    @command(
        'parse-body',
        'Parse p.b as source code, creating a tree of descendant nodes.'
    )
    public parse_body_command(this: Commands): void {
        const c: Commands = this;
        if (c && c.p && c.p.__bool__()) {
            c.importCommands.parse_body(c.p);
        }
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
