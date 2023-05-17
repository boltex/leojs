//@+leo-ver=5-thin
//@+node:felix.20220105221256.1: * @file src/core/leoImport.ts
//@+<< leoImport imports >>
//@+node:felix.20230510231730.1: ** << leoImport imports >>
import * as vscode from "vscode";
import { Utils as uriUtils } from "vscode-uri";
import * as utils from "../utils";

import * as os from 'os';
import * as safeJsonStringify from 'safe-json-stringify';
import * as path from 'path';

const docutils = false;

const lxml = false;

// Leo imports...
import * as g from './leoGlobals';
import { Commands } from "./leoCommands";
import { Position, VNode } from './leoNodes';
//@-<< leoImport imports >>
//@+others
//@+node:felix.20230510230016.1: ** leoImport Dummy
// export class LeoImportCommands {

//     // TODO

//     public c: Commands;

//     constructor(c: Commands) {
//         this.c = c;
//     }

//     public async exportHeadlines(fileName: string): Promise<unknown> {
//         // TODO !
//         console.log('TODO: exportHeadlines');
//         return;
//     }

//     public async flattenOutline(fileName: string): Promise<unknown> {
//         // TODO !
//         console.log('TODO: flattenOutline');
//         return;
//     }

//     public async outlineToWeb(fileName: string, webType: string): Promise<unknown> {
//         // TODO !
//         console.log('TODO: outlineToWeb');
//         return;
//     }

//     public async removeSentinelsCommand(names: string[]): Promise<unknown> {
//         // TODO !
//         console.log('TODO: removeSentinelsCommand');
//         return;
//     }

//     public async weave(fileName: string): Promise<unknown> {
//         // TODO !
//         console.log('TODO: weave');
//         return;
//     }

//     public async readAtAutoNodes(): Promise<unknown> {
//         // TODO !
//         console.log('TODO: readAtAutoNodes');
//         return;
//     }

// }

//@+node:felix.20230511002352.1: ** class LeoImportCommands
/**
 * A class implementing all of Leo's import/export code. This class
 * uses **importers** in the leo/plugins/importers folder.
 *
 * For more information, see leo/plugins/importers/howto.txt.
 */
export class LeoImportCommands {
   
    public c: Commands ;
    public encoding: BufferEncoding;
    public errors: number;
    public fileName: string | undefined;
    public fileType: string | undefined;
    public methodName: string | undefined;
    public output_newline: string;
    public tab_width: number|undefined;
    public treeType: string;
    public verbose: boolean;
    public webType: string;
    public web_st: string[];

    //@+others
    //@+node:felix.20230511002352.2: *3* ic.__init__& ic.reload_settings
    /**
     * ctor for LeoImportCommands class.
     */
    constructor (c: Commands){
        
        this.c = c
        this.encoding = 'utf-8'
        this.errors = 0
        this.fileName = undefined;  // The original file name, say x.cpp
        this.fileType = undefined;  // ".py", ".c", etc.
        this.methodName = undefined;  // x, as in < < x methods > > =
        this.output_newline = g.getOutputNewline(c);  // Value of @bool output_newline
        this.tab_width = c.tab_width;
        this.treeType = "@file";  // None or "@file"
        this.verbose = true;  // Leo 6.6
        this.webType = "@noweb";  // "cweb" or "noweb"
        this.web_st = [];  // noweb symbol table.
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
    public convertCodePartToWeb(s: string, i: number, p: Position, result: string): [number, string] {
       
        const ic = this;
        const nl = ic.output_newline;
        const head_ref = ic.getHeadRef(p);
        const file_name = ic.getFileName(p);
        if (g.match_word(s, i, "@root")){
            i = g.skip_line(s, i);
            ic.appendRefToFileName(file_name, result);
        }else if (g.match_word(s, i, "@c") || g.match_word(s, i, "@code")){
            i = g.skip_line(s, i);
            ic.appendHeadRef(p, file_name, head_ref, result);
        }else if (g.match_word(p.h, 0, "@file")){
            // Only do this if nothing else matches.
            ic.appendRefToFileName(file_name, result);
            i = g.skip_line(s, i);  // 4/28/02
        }else{
            ic.appendHeadRef(p, file_name, head_ref, result);
        }
        [i, result] = ic.copyPart(s, i, result);
        return [i, result.trim() + nl];

    }
    //@+node:felix.20230511002352.5: *5* ic.appendHeadRef
    public appendHeadRef(p: Position, file_name: string, head_ref: string, result: string): void {
        const ic = this;
        const nl = ic.output_newline;
        if (ic.webType === "cweb"){
            if (head_ref){
                const escaped_head_ref = head_ref.replace("@", "@@");
                result += "@<" + escaped_head_ref + "@>=" + nl;
            }else{
                // Convert the headline to an index entry.
                result += "@^" + p.h.trim() + "@>" + nl;
                result += "@c" + nl;  // @c denotes a new section.
            }
        }else{
            if (head_ref){
                // pass
            }else if( p === ic.c.p){
                head_ref = file_name || "*";
            }else{
                head_ref = "@others";
            }
            // 2019/09/12
            result += (g.angleBrackets(head_ref) + "=" + nl);
        }
    }
    //@+node:felix.20230511002352.6: *5* ic.appendRefToFileName
    public appendRefToFileName(file_name: string, result: string): void {
        const ic = this;
        const nl = ic.output_newline;

        if (ic.webType === "cweb"){
            if (!file_name){
                result += "@<root@>=" + nl;
            }else{
                result += "@(" + file_name + "@>" + nl;  // @(...@> denotes a file.
            }
        }else{
            if (!file_name){
                file_name = "*";
            }
            // 2019/09/12.
            const lt = "<<";
            const rt = ">>";
            result += (lt + file_name + rt + "=" + nl);
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
        if (g.match(h, 0, "<<")){
            i = h.indexOf(">>", 2);
        }else if (g.match(h, 0, "<@")){
            i = h.indexOf("@>", 2);
        }else{
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
        if( g.match(h, 0, "@file") || g.match(h, 0, "@root")){
            const line = h.substring(5).trim();
            // set j & k so line[j:k] is the file name.
            let j, k;
            if (g.match(line, 0, "<")){
                [j, k] = [1, line.indexOf(">", 1)];
            }else if( g.match(line, 0, '"')){
                [j, k] = [1, line.indexOf('"', 1)];
            }else{
                [j, k] = [0, line.indexOf(" ", 0)];
            }
            if( k === -1){
                k = line.length;
            }
            file_name = line.substring(j, k).trim();
        }else{
            file_name = '';
        }
        return file_name;

    }
    //@+node:felix.20230511002352.9: *4* ic.convertDocPartToWeb (handle @ %def)
    public convertDocPartToWeb(s: string, i: number, result: string): [number, string]{
        const nl = this.output_newline;
        if (g.match_word(s, i, "@doc")){
            i = g.skip_line(s, i);
        }else if (g.match(s, i, "@ ") || g.match(s, i, "@\t") || g.match(s, i, "@*")){
            i += 2;
        }else if (g.match(s, i, "@\n")){
            i += 1;
        }
        i = g.skip_ws_and_nl(s, i);
        let result2;
        [i, result2] = this.copyPart(s, i, "");
        if (result2){
            // Break lines after periods.
            result2 = result2.replace(/\.  /g, "." + nl);
            result2 = result2.replace(/\. /g, "." + nl);
            result += nl + "@" + nl + result2.trim() + nl + nl;
        }else{
            // All nodes should start with '@', even if the doc part is empty.
            result += this.webType === "cweb" ? nl + "@ " : nl + "@" + nl;
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
        if ((!p || !p.__bool__()) || !c){
            return "";
        }
        const startInCode = c.config.getBool('at-root-bodies-start-in-doc-mode');
        const nl = this.output_newline;
        const docstart = this.webType === "cweb" ? nl + "@ " : nl + "@" + nl;
        const s = p.b;
        const lb = this.webType === "cweb" ? "@<" : "<<";
        let [i, result, docSeen] = [0, "", false];
        while (i < s.length){
            const progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isDocStart(s, i) || g.match_word(s, i, "@doc")){
                [i, result] = this.convertDocPartToWeb(s, i, result);
                docSeen = true;
            }else if (
                g.match_word(s, i, "@code") ||
                g.match_word(s, i, "@root") ||
                g.match_word(s, i, "@c") ||
                g.match(s, i, lb)
            ){
                if (!docSeen){
                    docSeen = true;
                    result += docstart;
                }
                [i, result] = this.convertCodePartToWeb(s, i, p, result);
            }else if (this.treeType == "@file" || startInCode){
                if (!docSeen){
                    docSeen = true;
                    result += docstart;
                }
                [i, result] = this.convertCodePartToWeb(s, i, p, result);
            }else{
                [i, result] = this.convertDocPartToWeb(s, i, result);
                docSeen = true;
            }

            console.assert(progress < i);
        }
        result = result.trim();
        if (result){
            result += nl;
        }
        return result;

    }
    //@+node:felix.20230511002352.11: *4* ic.copyPart
    // Copies characters to result until the end of the present section is seen.

    public copyPart(s: string, i: number, result: string): [number, string]{

        const lb = this.webType === "cweb" ? "@<" : "<<";
        const rb = this.webType === "cweb" ? "@>" : ">>";
        const theType = this.webType;
        while (i < s.length){
            const progress = i;
            let j = i;  // We should be at the start of a line here.
            i = g.skip_nl(s, i);
            i = g.skip_ws(s, i);
            if (this.isDocStart(s, i)){
                return [i, result];
            }
            if (g.match_word(s, i, "@doc") ||
                g.match_word(s, i, "@c") ||
                g.match_word(s, i, "@root") ||
                g.match_word(s, i, "@code")  // 2/25/03
            ){
                return [i, result];
            }
            // 2019/09/12
            const lt = "<<";
            const rt = ">>=";
            if( g.match(s, i, lt) && g.find_on_line(s, i, rt) > -1){
                return [i, result];
            }
            // Copy the entire line, escaping '@' and
            // Converting @others to < < @ others > >
            i = g.skip_line(s, j);
            let line = s.substring(j, i);
            if (theType === "cweb"){
                line = line.replace("@", "@@")
            }else{
                j = g.skip_ws(line, 0);
                if( g.match(line, j, "@others")){
                    line = line.replace("@others", lb + "@others" + rb);
                }else if (g.match(line, 0, "@")){
                    // Special case: do not escape @ %defs.
                    const k = g.skip_ws(line, 1);
                    if (!g.match(line, k, "%defs")){
                        line = "@" + line;
                    }
                }
            }
            result += line;
            console.assert( progress < i);
        }
        return [i, result.trimEnd()];

    }
    //@+node:felix.20230511002352.12: *4* ic.exportHeadlines
    public exportHeadlines(fileName: string): void {
        const p = this.c.p;
        const nl = this.output_newline;
        if (!p || !p.__bool__()){
            return;
        }
        this.setEncoding();
        const firstLevel = p.level();
        try{
            const w_uri = g.makeVscodeUri(fileName);
            let s = "";
            // with open(fileName, 'w') as theFile:
            for (const w_p of p.self_and_subtree(false)){
                const head = w_p.moreHead(firstLevel, true);
                // theFile.write(head + nl);
                s += head + nl;
            }
            const writeData = Buffer.from(s, 'utf8');
            await vscode.workspace.fs.writeFile(w_uri, writeData);

        }catch (IOError){
            g.warning("can not open", fileName);
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
        if (!p || !p.__bool__()){
            return; 
        }
        this.setEncoding();
        const firstLevel = p.level();

        try{
            const w_uri = g.makeVscodeUri(fileName);
            let theFile: string = "";
            // theFile = open(fileName, 'wb')  // Fix crasher: open in 'wb' mode.
            for (const w_p of p.self_and_subtree(false)){
                let s = w_p.moreHead(firstLevel) + nl;
                // s = g.toEncodedString(s, this.encoding, true);
                theFile += s;
                s = w_p.moreBody() + nl;  // Inserts escapes.
                if (s.trim()){
                    // s = g.toEncodedString(s, this.encoding, true);
                    theFile += s;
                }
            }

            const writeData = g.toEncodedString(theFile, this.encoding, true);
            
            await vscode.workspace.fs.writeFile(w_uri, writeData);

        }catch (IOError){
            g.warning("can not open", fileName);
            return;
        }
    }
    //@+node:felix.20230511002352.14: *4* ic.outlineToWeb
    public outlineToWeb(fileName: string, webType: string): void{
        const c = this.c;
        const nl = this.output_newline;
        const current = c.p;
        if (!current || !current.__bool__()){
            return;
        }
        this.setEncoding();
        this.webType = webType;
        try{
            // theFile = open(fileName, 'w')
            const w_uri = g.makeVscodeUri(fileName);
            let theFile: string = "";

            this.treeType = "@file"

            // Set self.treeType to @root if p or an ancestor is an @root node.
            for (const p of current.parents()){
                let [flag, junk] = g.is_special(p.b, "@root");
                if (flag){
                    this.treeType = "@root";
                    break;
                }
            }

            for (const p of current.self_and_subtree(false)){
                const s = this.positionToWeb(p)
                if (s){
                    theFile += s;
                    if (s.charAt(s.length - 1) !== '\n'){
                       theFile += nl;   
                    }
                }
            }

            const writeData = g.toEncodedString(theFile);
            await vscode.workspace.fs.writeFile(w_uri, writeData);

        }catch (IOError){
            g.warning("can not open", fileName);
            return;
        }

    }
    //@+node:felix.20230511002352.15: *4* ic.removeSentinelsCommand
    public async removeSentinelsCommand(paths: string[], toString = false): Promise<string|undefined> {
        const c = this.c;
        this.setEncoding();
        for (const fileName of paths){
            g.setGlobalOpenDir(fileName);
            let path;
            [path, this.fileName] = g.os_path_split(fileName);
            let s: string|undefined;
            let e;
            [s, e] = await g.readFileIntoString(fileName, this.encoding);
            if (s == null){
                return undefined;
            }

            if (e){
                this.encoding = e;
            }

            //@+<< set delims from the header line >>
            //@+node:felix.20230511002352.16: *5* << set delims from the header line >>
            // Skip any non @+leo lines.
            let i = 0;
            while (i < s.length && g.find_on_line(s, i, "@+leo") === -1){
                i = g.skip_line(s, i);
            }
            // Get the comment delims from the @+leo sentinel line.
            const at = this.c.atFileCommands;
            let j = g.skip_line(s, i);
            let line = s.substring(i, j);
            let start_delim: string|undefined;
            let valid;
            let junk1;
            let end_delim;
            let junk2;
            [valid, junk1, start_delim, end_delim, junk2] = at.parseLeoSentinel(line);
            if (!valid){
                if (!toString){
                    g.es("invalid @+leo sentinel in", fileName);
                }
                return undefined;
            }
            let line_delim;
            if (end_delim){
                line_delim = undefined;
            }else{
                [line_delim, start_delim] = [start_delim, undefined];
            }
            //@-<< set delims from the header line >>

            s = this.removeSentinelLines(s, line_delim, start_delim, end_delim);
            let ext = c.config.getString('remove-sentinels-extension');
            if (!ext){
                ext = ".txt";
            }
            let newFileName;
            if (ext[0] === '.'){
                newFileName = g.finalize_join(path, fileName + ext);  // 1341
            }else{
                let [head, ext2] = g.os_path_splitext(fileName);
                newFileName = g.finalize_join(path, head + ext + ext2);  // 1341
            }
            if (toString){
                return s;
            }

            //@+<< Write s into newFileName >>
            //@+node:felix.20230511002352.17: *5* << Write s into newFileName >> (remove-sentinels)
            // Remove sentinels command.
            try {
                const w_uri = g.makeVscodeUri(newFileName);
                const writeData = Buffer.from(s, 'utf8');
                await vscode.workspace.fs.writeFile(w_uri, writeData);

                if( !g.unitTesting){
                    g.es("created:", newFileName);
                }

            }catch (exception){
                g.es("exception creating:", newFileName);
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
    public removeSentinelLines( s: string, line_delim: string|undefined, start_delim: string|undefined, unused_end_delim: string): string {

        const delim = (line_delim || start_delim || '') + '@';
        const verbatim = delim + 'verbatim';
        let verbatimFlag = false;
        const result: string[] = [];
        for (const line of g.splitLines(s)){
            let i = g.skip_ws(line, 0)
            if (!verbatimFlag && g.match(line, i, delim)){
                if( g.match(line, i, verbatim)){
                    // Force the next line to be in the result.
                    verbatimFlag = true;
                }
            }else{
                result.push(line);
                verbatimFlag = false;
            }
        }
        return result.join('');

    }
    //@+node:felix.20230511002352.19: *4* ic.weave
    public weave(filename: string): void {
        const p = this.c.p;
        const nl = this.output_newline;
        if (!p || !p.__bool__()){
            return;
        }
        this.setEncoding();

        try{

            // with open(filename, 'w', this.encoding) as f
            const w_uri = g.makeVscodeUri(filename);

            let f = "";

            for(const w_p of p.self_and_subtree()){
                const s = p.b;
                const s2 = s.trim();
                if (s2){
                    f += "-".repeat(60);
                    f += nl;
                    //@+<< write the context of p to f >>
                    //@+node:felix.20230511002352.20: *5* << write the context of p to f >> (weave)
                    // write the headlines of p, p's parent and p's grandparent.
                    const context = [];
                    const p2 = w_p.copy();
                    let i = 0;

                    while (i < 3){
                        i += 1;
                        if (!p2 || !p2.__bool__()){
                            break;
                        }
                        context.push(p2.h);
                        p2.moveToParent();
                    }

                    context.reverse();
                    let indent = "";

                    for (const line of context){
                        f += indent;
                        indent += '\t';
                        f += line;
                        f += nl;
                    }
                    //@-<< write the context of p to f >>
                    f += "-".repeat(60);
                    f += nl;
                    f += s.trimEnd() + nl;
                }
            }

            const writeData = g.toEncodedString(f);
            await vscode.workspace.fs.writeFile(w_uri, writeData);

        }catch (exception){
            g.es("exception opening:", filename);
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
    public async createOutline(parent: Position, ext?:string , s?:string): Promise<Position|undefined> {
      
        const c = this.c;
        const p = parent.copy();
        this.treeType = '@file';  // Fix #352.
        const fileName = c.fullPath(parent);
        if(await g.is_binary_external_file(fileName)){
            return this.import_binary_file(fileName, parent);
        }
        // Init ivars.
        this.setEncoding(
            parent,
            c.config.default_at_auto_file_encoding
        );

        [ext, s] = await this.init_import(ext, fileName, s);
        if (s == null || !ext){
            return undefined;
        }
        // The so-called scanning func is a callback. It must have a c argument.
        const func = this.dispatch(ext, p);
        // Call the scanning function.
        if( g.unitTesting){
            // console.assert (func or ext in ('.txt', '.w', '.xxx'), (repr(func), ext, p.h));
            console.assert (func || ['.txt', '.w', '.xxx'].includes(ext), p.h);
        }
        if (func && !c.config.getBool('suppress-import-parsing', false)){
            s = g.toUnicode(s, this.encoding);
            s = s.replace('\r', '');
            // func is a factory that instantiates the importer class.
            func(c, p, s);
        }else{
            // Just copy the file to the parent node.
            s = g.toUnicode(s, this.encoding)
            s = s.replace('\r', '')
            this.scanUnknownFileType(s, p, ext)
        }
        if (g.unitTesting){
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
    public dispatch(ext:string, p: Position): ((...args: any[])=>any)|undefined {
        
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
        if (parent && parent.__bool__()){
            p = parent.insertAsLastChild();
        }else{
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
    public async init_import(ext:string|undefined, fileName:string, s?:string): Promise<[string|undefined, string|undefined]> {
        let junk;
        [junk, this.fileName] = g.os_path_split(fileName);
        [this.methodName, this.fileType] = g.os_path_splitext(this.fileName);
        if (!ext){
            ext = this.fileType;
        }
        ext = ext.toLowerCase();
        if (!s){
            let e;
            // Set the kind for error messages in readFileIntoString.
            [s, e] =await g.readFileIntoString(fileName, this.encoding);
            if( s == null){
                return [undefined, undefined];
            }
            if (e){
                this.encoding = e;
            }
        }
        return [ext, s];

    }
    //@+node:felix.20230511002352.26: *5* ic.scanUnknownFileType & helper
    /**
     * Scan the text of an unknown file type.
     */
    public scanUnknownFileType(s:string, p: Position, ext:string): boolean {
        
        let body = '';
        if (['.html', '.htm'].includes(ext)){
            body += '@language html\n';
        }else if (['.txt', '.text'].includes(ext)){
            body += '@nocolor\n';
        }else{
            const language = this.languageForExtension(ext);
            if (language){
                body += `@language ${language}\n`;
            }
        }
        this.setBodyString(p, body + s);
        for (const w_p of p.self_and_subtree()){
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
        if (ext.startsWith('.')){
            ext = ext.substring(1);
        }
        let language;
        if (ext){
            const z = g.app.extra_extension_dict[ext];
            if (![undefined, 'undefined', 'none', 'None'].includes(z)){
                language = z;
            }else{
                language = g.app.extension_dict[ext];
            }
            if ([undefined, 'undefined', 'none', 'None'].includes(language)){
                language = unknown;
            }

        }else{
            language = unknown;
        }

        // Return the language even if there is no colorizer mode for it.
        return language;
    }
    //@+node:felix.20230511002352.28: *4* ic.readAtAutoNodes
    public readAtAutoNodes(): void {
        const c =  this.c;
        const p =  this.c.p;
        const after = p.nodeAfterTree();
        let found = false;
        while (p && !p.__eq__(after)){
            if(p.isAtAutoNode()){
                if (p.isAtIgnoreNode()){
                    g.warning('ignoring', p.h);
                    p.moveToThreadNext();
                }else{
                    c.atFileCommands.readOneAtAutoNode(p);
                    found = true;
                    p.moveToNodeAfterTree();
                }
            }else{
                p.moveToThreadNext();
            }
        }
        if (!g.unitTesting){
            const message = found ? 'finished' : 'no @auto nodes in the selected tree';
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
        paths: string[]| undefined,
        command = 'Import',
    ) : Promise<Position | undefined> {
       
        const at = this.c.atFileCommands;
        const c = this.c;
        const u = this.c.undoer;
        const current = c.p && c.p.__bool__()?c.p : c.rootPosition()!;
        this.tab_width = c.getTabWidth(current);

        if (!paths || !paths.length){
            return undefined;
        }
        // Initial open from command line is not undoable.
        if (command){
            u.beforeChangeGroup(current, command);
        }
        let p: Position; // p will exist because path is not empty.
        for (let fileName of paths){
            fileName = fileName.replace('\\', '/');  // 2011/10/09.
            g.setGlobalOpenDir(fileName);
            const isThin = await at.scanHeaderForThin(fileName);
            let undoData;
            if (command){
                undoData = u.beforeInsertNode(parent);
            }
            p = parent.insertAfter();
            if (isThin){
                // Create @file node, not a deprecated @thin node.
                p.initHeadString("@file " + fileName);
                await at.read(p);
            }else{
                p.initHeadString("Imported @file " + fileName);
                await at.read(p);
            }
            p.contract();
            p.setDirty();  // 2011/10/09: tell why the file is dirty!
            if (command){
                u.afterInsertNode(p, command, undoData!); // undodata will exist under same 'if'.
            }
        }
        current.expand();
        c.setChanged();
        if (command){
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
        verbose = true,  // Legacy value.
    ): Promise<void> {
        // Not a command.  It must *not* have an event arg.
        const c = this.c;
        const u = this.c.undoer;
        if (!c || !c.p || !c.p.__bool__() || !files || !files.length){
            return;
        }
        this.tab_width = c.getTabWidth(c.p);
        this.treeType = treeType || '@file';
        this.verbose = verbose;
        if (!parent || !parent.__bool__()){
            g.trace('===== no parent', g.callers());
            return;
        }
        
        for (const fn of files) {
            // Report exceptions here, not in the caller.
            try{
                g.setGlobalOpenDir(fn);
                // Leo 5.6: Handle undo here, not in createOutline.
                const undoData = u.beforeInsertNode(parent);
                let p: Position | undefined = parent.insertAsLastChild();
                p.h = `${treeType} ${fn}`;
                u.afterInsertNode(p, 'Import', undoData);
                p = await this.createOutline(p);
                if (p && p.__bool__()){  // createOutline may fail.
                    if (this.verbose && !g.unitTesting){
                        g.blue("imported", shortFn? g.shortFileName(fn) : fn);
                    }
                    p.contract();
                    p.setDirty();
                    c.setChanged();
                }
           } catch (exception){
                g.es_print('Exception importing', fn);
                g.es_exception();
            }
        }

        c.validateOutline();
        parent.expand();
    }
    //@+node:felix.20230511002352.31: *4* ic.importFreeMind
    /**
     * Import a list of .mm.html files exported from FreeMind:
     * http://freemind.sourceforge.net/wiki/index.php/Main_Page
     */
    public importFreeMind(files: string[]): void {
        new FreeMindImporter(this.c).import_files(files);
    }
    //@+node:felix.20230511002352.32: *4* ic.importMindMap
    /**
     * Import a list of .csv files exported from MindJet:
     * https://www.mindjet.com/
     */
    public importMindMap(files: string[]): void {
        new MindMapImporter(this.c).import_files(files);
    }
    //@+node:felix.20230511002352.33: *4* ic.importWebCommand & helpers
    public importWebCommand(files: string[], webType: string): void {
        const c = this.c;
        const current = this.c.p;
        if (current == null){
            return;
        }
        if (!files || !files.length){
            return;
        }
        this.tab_width = c.getTabWidth(current);  // New in 4.3.
        this.webType = webType;
        for (const fileName of files){
            g.setGlobalOpenDir(fileName);
            let p = this.createOutlineFromWeb(fileName, current);
            p.contract();
            p.setDirty();
            c.setChanged();
        }
        c.redraw(current);
    }
    //@+node:felix.20230511002352.34: *5* createOutlineFromWeb
    public createOutlineFromWeb(path: string, parent: Position): Position {
        const c = this.c;
        const u = c.undoer;
        let [junk, fileName] = g.os_path_split(path);
        const undoData = u.beforeInsertNode(parent);
        // Create the top-level headline.
        let p = parent.insertAsLastChild();
        p.initHeadString(fileName);
        if (this.webType === "cweb"){
            this.setBodyString(p, "@ignore\n@language cweb");
        }
        // Scan the file, creating one section for each function definition.
        this.scanWebFile(path, p);
        u.afterInsertNode(p, 'Import', undoData);
        return p;

    }
    //@+node:felix.20230511002352.35: *5* findFunctionDef
    public findFunctionDef(s: string, i: number): string | undefined {
        // Look at the next non-blank line for a function name.
        i = g.skip_ws_and_nl(s, i);
        let k = g.skip_line(s, i);
        let name: string | undefined = undefined;
        while (i < k){
            if (g.is_c_id(s[i])){
                const j = i;
                i = g.skip_c_id(s, i);
                name = s.substring(j, i);
            }else if( s[i] === '('){
                if (name){
                    return name;
                }
                break;
            }else{
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
        let name;
        if (this.webType === "cweb"){
            //@+<< scan cweb body for headline >>
            //@+node:felix.20230511002352.37: *6* << scan cweb body for headline >>
            let i = 0;
            while (i < s.length){
                i = g.skip_ws_and_nl(s, i);
                // Allow constructs such as @ @c, or @ @<.
                if (this.isDocStart(s, i)){
                    i += 2;
                    i = g.skip_ws(s, i);
                }
                let j;
                if (g.match(s, i, "@d") || g.match(s, i, "@f")){
                    // Look for a macro name.
                    const directive = s.substring(i, i + 2);
                    i = g.skip_ws(s, i + 2)  // skip the @d or @f
                    if (i < s.length && g.is_c_id(s[i])){
                        j = i;
                        g.skip_c_id(s, i); // TODO : MAYBE FIX THIS LINE!
                        return s.substring(j, i);
                    }
                    return directive;
                }
                if (g.match(s, i, "@c") || g.match(s, i, "@p")){
                    // Look for a function def.
                    name = this.findFunctionDef(s, i + 2);
                    return name?name: "outer function";
                }
                if (g.match(s, i, "@<")){
                    // Look for a section def.
                    // A small bug: the section def must end on this line.
                    j = i;
                    const k = g.find_on_line(s, i, "@>");
                    if (k > -1 && (g.match(s, k + 2, "+=") || g.match(s, k + 2, "="))){
                        return s.substring(j, i);
                        return s.substring(j, k + 2);  // return the section ref.
                    }

                }
                i = g.skip_line(s, i);

            }
            //@-<< scan cweb body for headline >>
        }else{
            //@+<< scan noweb body for headline >>
            //@+node:felix.20230511002352.38: *6* << scan noweb body for headline >>
            let i = 0;
            while (i < s.length){
                i = g.skip_ws_and_nl(s, i);
                if( g.match(s, i, "<<")){
                    const k = g.find_on_line(s, i, ">>=");
                    if (k > -1){
                        const ref = s.substring(i, k + 2);
                        name = s.substring(i + 2, k).trim();
                        if (name !== "@others"){
                            return ref;
                        }
                    }
                }else{
                    name = this.findFunctionDef(s, i);
                    if (name){
                        return name;
                    }
                }
                i = g.skip_line(s, i);

            }
            //@-<< scan noweb body for headline >>
        }

        return "@";  // default.
    }
    //@+node:felix.20230511002352.39: *5* scanWebFile (handles limbo)
    public async scanWebFile(fileName: string, parent: Position): Promise<void> {
        const theType = this.webType;
        const lb =theType == "cweb" ? "@<" : "<<";
        const rb =theType == "cweb" ? "@>" : ">>";
        let [s, e] = await g.readFileIntoString(fileName);
        if (s == null){
            return;
        }
        //@+<< Create a symbol table of all section names >>
        //@+node:felix.20230511002352.40: *6* << Create a symbol table of all section names >>
        let i = 0;
        this.web_st = [];
        while( i < s.length){
            let progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isDocStart(s, i)){
                if (theType === "cweb"){
                    i += 2;
                }else{
                    i = g.skip_line(s, i);
                }
            }else if(theType === "cweb" && g.match(s, i, "@@")){
                i += 2;
            }else if(g.match(s, i, lb)){
                i += 2;
                let j = i;
                let k = g.find_on_line(s, j, rb);
                if (k > -1){
                    this.cstEnter(s.substring(j, k));
                }
            }else{
                i += 1;
            }
            console.assert( i > progress);
        }
        //@-<< Create a symbol table of all section names >>
        //@+<< Create nodes for limbo text and the root section >>
        //@+node:felix.20230511002352.41: *6* << Create nodes for limbo text and the root section >>
        i = 0;
        while (i < s.length){
            let progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isModuleStart(s, i) || g.match(s, i, lb)){
                break
            }else{
                i = g.skip_line(s, i)
            }
            console.assert( i > progress);
        }

        let j = g.skip_ws(s, 0);
        if (j < i){
            this.createHeadline(parent, "@ " + s.substring(j, i), "Limbo");
        }
        j = i;
        if (g.match(s, i, lb)){
            while (i < s.length){
                let progress = i;
                i = g.skip_ws_and_nl(s, i);
                if (this.isModuleStart(s, i)){
                    break;
                }else{
                    i = g.skip_line(s, i);
                }
                console.assert(i > progress);
            }
            this.createHeadline(parent, s.substring(j, i), g.angleBrackets(" @ "));
        }
        //@-<< Create nodes for limbo text and the root section >>
        let outer_progress;
        let start;
        while (i < s.length){
            outer_progress = i;
            //@+<< Create a node for the next module >>
            //@+node:felix.20230511002352.42: *6* << Create a node for the next module >>
            if( theType === "cweb"){
                console.assert( this.isModuleStart(s, i));
                start = i;
                if (this.isDocStart(s, i)){
                    i += 2;
                    while (i < s.length){
                        let progress = i;
                        i = g.skip_ws_and_nl(s, i);
                        if (this.isModuleStart(s, i)){
                            break;
                        }else{
                            i = g.skip_line(s, i);
                        }
                        console.assert(i > progress);
                    }
                }

                //@+<< Handle cweb @d, @f, @c and @p directives >>
                //@+node:felix.20230511002352.43: *7* << Handle cweb @d, @f, @c and @p directives >>
                if (g.match(s, i, "@d") || g.match(s, i, "@f")){
                    i += 2;
                    i = g.skip_line(s, i);
                    // Place all @d and @f directives in the same node.
                    while (i < s.length){
                        let progress = i;
                        i = g.skip_ws_and_nl(s, i);
                        if ((g.match(s, i, "@d") || g.match(s, i, "@f"))){
                            i = g.skip_line(s, i);
                        }else{
                            break;
                        }
                        console.assert( i > progress);
                    }
                    i = g.skip_ws_and_nl(s, i);

                }
                while (i < s.length && !this.isModuleStart(s, i)){
                    let progress = i;
                    i = g.skip_line(s, i);
                    i = g.skip_ws_and_nl(s, i);
                    console.assert( i > progress);
                }

                if (g.match(s, i, "@c") || g.match(s, i, "@p")){
                    i += 2;
                    while (i < s.length){
                        let progress = i;
                        i = g.skip_line(s, i);
                        i = g.skip_ws_and_nl(s, i);
                        if (this.isModuleStart(s, i)){
                            break;
                        }

                        console.assert( i > progress);
                    }
                }
                //@-<< Handle cweb @d, @f, @c and @p directives >>
            }else{
                console.assert (this.isDocStart(s, i));
                start = i;
                i = g.skip_line(s, i);
                while( i < s.length){
                    let progress = i;
                    i = g.skip_ws_and_nl(s, i);
                    if( this.isDocStart(s, i)){
                        break;
                    }else{
                        i = g.skip_line(s, i);
                    }
                    console.assert( i > progress);
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
        if (lower){
            s = s.toLowerCase();
        }
        s = s.replace(/\t/g, ' ').replace(/\r/g, '');
        s = s.replace(/\n/g, ' ').replace(/  /g, ' ');
        return s.trim();

    }
    //@+node:felix.20230511002352.46: *6* cstDump
    public cstDump(): string {
        let s = "Web Symbol Table...\n\n";
        for (const name of [...this.web_st].sort()){
            s += name + "\n";
        }
        return s;
    }
    //@+node:felix.20230511002352.47: *6* cstEnter
    // We only enter the section name into the symbol table if the ... convention is not used.

    public cstEnter(s: string): void {
        // Don't enter names that end in "..."
        s = s.trimEnd();
        if(s.endsWith("...")){
            return;
        }
        // Put the section name in the symbol table, retaining capitalization.
        const lower = this.cstCanonicalize(s, true);  // do lower
        const upper = this.cstCanonicalize(s, false);  // don't lower.
        for (const name of this.web_st){
            if (name.toLowerCase() === lower){
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
        if (!target.endsWith("...")){
            return target;
        }
        // Canonicalize the target name, and remove the trailing "..."
        let ctarget = target.slice(0,-3);
        ctarget = this.cstCanonicalize(ctarget).trim();
        let found = false;
        let result = target;
        for (const s of this.web_st){
            const cs = this.cstCanonicalize(s);
            if (cs.substring(0, ctarget.length) === ctarget){
                if (found){
                    g.es('', `****** ${target}`, 'is also a prefix of', s);
                }else{
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
    public parse_body(p: Position): void{
       
        if (!p || !p.__bool__()){
            return;
        }
        const c = this.c;
        const d= g.app.language_extension_dict;
        const ic = this;
        if (p.hasChildren()){
            g.es_print('can not run parse-body: node has children:', p.h);
            return;
        }
        const language = g.scanForAtLanguage(c, p) || "";
        this.treeType = '@file';
        const ext = '.' + d[language];
        const parser = g.app.classDispatchDict[ext];
        // Fix bug 151: parse-body creates "None declarations"
        if (p.isAnyAtFileNode()){
            const fn = p.anyAtFileNodeName();
            [ic.methodName, ic.fileType] = g.os_path_splitext(fn);
        }else{
            const fileType = d[language] || 'py';
            [ic.methodName, ic.fileType] = [p.h, fileType];
        }
        if (!parser){
            g.es_print(`parse-body: no parser for @language ${language || 'None'}`);
            return;
        }
        const bunch = c.undoer.beforeChangeTree(p);
        const s = p.b;
        p.b = '';
        try{
            parser(c, p, s);
            c.undoer.afterChangeTree(p, 'parse-body', bunch);
            p.expand();
            c.selectPosition(p);
            c.redraw();
        }catch (exception){
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
        if (s){
            p.b = p.b + g.toUnicode(s, this.encoding);
        }
    }
    /**
     * Similar to c.setBodyString, but does not recolor the text or
     * redraw the screen.
     */
    public setBodyString(p: Position, s: string): void {
       
        const c = this.c;
        const v =  p.v;
        if (!c || !p || !p.__bool__()){
            return;
        }
        s = g.toUnicode(s, this.encoding);
        if (c.p && c.p.__bool__() && p.v === c.p.v){
            const w = c.frame.body.wrapper;
            const i = s.length;
            w.setAllText(s);
            w.setSelectionRange(i, i, i);
        }

        // Keep the body text up-to-date.
        if( v.b !== s){
            v.setBodyString(s);
            v.setSelection(0, 0);
            p.setDirty();
            if (!c.isChanged()){
                c.setChanged();
            }
        }
    }
    //@+node:felix.20230511002352.52: *4* ic.createHeadline
    /**
     * Create a new VNode as the last child of parent position.
     */
    public createHeadline(parent: Position, body: string, headline: string): Position {
        
        const p = parent.insertAsLastChild();
        p.initHeadString(headline);
        if (body){
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
        if( !g.match(s, i, "@")){
            return false;
        }
        const j = g.skip_ws(s, i + 1);
        if (g.match(s, j, "%defs")){
            return false;
        }
        if (this.webType === "cweb" && g.match(s, i, "@*")){
            return true;
        }
        return g.match(s, i, "@ ") || g.match(s, i, "@\t") || g.match(s, i, "@\n");
    }


    public isModuleStart(s: string, i: number): boolean {
        if (this.isDocStart(s, i)){
            return true;
        }
        return this.webType == "cweb" && (
            g.match(s, i, "@c") || g.match(s, i, "@p") ||
            g.match(s, i, "@d") || g.match(s, i, "@f"));
    }
    //@+node:felix.20230511002352.55: *4* ic.massageWebBody
    public massageWebBody(s: string): string {
        const theType = this.webType;
        const lb = theType == "cweb" ? "@<" : "<<";
        const rb = theType == "cweb" ? "@>" : ">>";
        //@+<< Remove most newlines from @space and @* sections >>
        //@+node:felix.20230511002352.56: *5* << Remove most newlines from @space and @* sections >>
        let i = 0;
        let start;
        let end;

        while (i < s.length){
            const progress = i;
            i = g.skip_ws_and_nl(s, i);
            if (this.isDocStart(s, i)){
                // Scan to end of the doc part.
                if (g.match(s, i, "@ %def")){
                    // Don't remove the newline following %def
                    i = g.skip_line(s, i);
                    start = i;
                    end = i;
                }else{
                    start = i;
                    end = i;
                    i += 2;
                }
                while (i < s.length){
                    const progress2 = i;
                    i = g.skip_ws_and_nl(s, i);
                    if (this.isModuleStart(s, i) || g.match(s, i, lb)){
                        end = i;
                        break;
                    }else if (theType === "cweb"){
                        i += 1
                    }else{
                        i = g.skip_to_end_of_line(s, i);
                    }
                    console.assert (i > progress2);
                }
                // Remove newlines from start to end.
                let doc = s.substring(start, end);
                doc = doc.replace("\n", " ");
                doc = doc.replace("\r", "");
                doc = doc.trim();
                if (doc){
                    if (doc === "@"){
                        doc = this.webType === "cweb"?"@ ": "@\n";
                    }else{
                        doc += "\n\n";
                    }
                    s = s.substring(0, start) + doc + s.substring(end);
                    i = start + doc.length;
                }

            }else{
                i = g.skip_line(s, i);
            }
            console.assert (i > progress);


        }
        //@-<< Remove most newlines from @space and @* sections >>
        //@+<< Replace abbreviated names with full names >>
        //@+node:felix.20230511002352.57: *5* << Replace abbreviated names with full names >>
        i = 0;
        while (i < s.length){
            const progress = i;
            if (g.match(s, i, lb)){
                i += 2;
                const j = i;
                const k = g.find_on_line(s, j, rb);
                if (k > -1){
                    const name = s.substring(j, k);
                    const name2 = this.cstLookup(name);
                    if (name !== name2){
                        // Replace name by name2 in s.
                        s = s.substring(0, j) + name2 + s.substring(k);
                        i = j + name2.length;
                    }
                }
            }
            i = g.skip_line(s, i);
            console.assert( i > progress);
        }
        //@-<< Replace abbreviated names with full names >>
        s = s.trimEnd();
        return s;
    }
    //@+node:felix.20230511002352.58: *4* ic.setEncoding
    public setEncoding(p?: Position, p_default?: BufferEncoding): void {
        const c = this.c;
        const encoding = g.getEncodingAt(p || c.p) || p_default;
        if (encoding && g.isValidEncoding(encoding)){
            this.encoding = encoding;
        }else if (p_default){
            this.encoding = p_default;
        }else{
            this.encoding = 'utf-8';
        }
    }
    //@-others

}
//@+node:felix.20230511002459.1: ** class RecursiveImportController
/**
 * Recursively import all python files in a directory and clean the result.
 */
export class RecursiveImportController {
    
    public c: Commands;
    public add_path: boolean;
    public file_pattern: RegExp;
    public ignore_pattern: RegExp;
    public kind: string;
    public recursive: boolean;
    public root: Position | undefined;
    public safe_at_file: boolean;
    public theTypes:string[] | undefined;
    public verbose:boolean;
    public n_files: number =0 ;

    //@+others
    //@+node:felix.20230511002459.2: *3* ric.ctor
    /**
     * Ctor for RecursiveImportController class.
     */
    constructor (
        c: Commands,
        kind: string,
        add_context: boolean | undefined= undefined,  // Override setting only if True/False
        add_file_context: boolean | undefined= undefined,  // Override setting only if True/False
        add_path: boolean = true,
        recursive: boolean = true,
        safe_at_file: boolean = true,
        theTypes: string[] | undefined= undefined,
        ignore_pattern: RegExp | undefined = undefined,
        verbose: boolean = true,  // legacy value.
    ) {
        
        this.c = c;
        this.add_path = add_path;
        this.file_pattern = /^(@@|@)(auto|clean|edit|file|nosent)/;
        this.ignore_pattern = ignore_pattern || /\.git|node_modules/;
        this.kind = kind;  // in ('@auto', '@clean', '@edit', '@file', '@nosent')
        this.recursive = recursive;
        this.root = undefined;
        this.safe_at_file = safe_at_file;
        this.theTypes = theTypes;
        this.verbose = verbose;
        // #1605:

        const set_bool = (setting: string, val: any) : void => {
            if (![true, false].includes(val)){
                return;
            }
            c.config.set(undefined, 'bool', setting, val, true);
        };

        set_bool('add-context-to-headlines', add_context);
        set_bool('add-file-context-to-headlines', add_file_context);
    }
    //@+node:felix.20230511002459.3: *3* ric.run & helpers
    /**
     * Import all files whose extension matches this.theTypes in dir_.
     * In fact, dir_ can be a path to a single file.
     */
    public async run(dir_: string): Promise<void> {
        
        if ( !['@auto', '@clean', '@edit', '@file', '@nosent'].includes(this.kind)){
            g.es('bad kind param', this.kind);
        }
        const c = this.c;
        const p1 = c.p; 
        this.root = c.p;
        const t1 = process.hrtime();
        g.app.disable_redraw = true;
        const bunch = c.undoer.beforeChangeTree(p1);
        // Leo 5.6: Always create a new last top-level node.
        const last = c.lastTopLevel();
        const parent = last.insertAfter();
        try{
            parent.v.h = 'imported files';
            // Leo 5.6: Special case for a single file.
            this.n_files = 0;
            const w_isFile = await g.os_path_isfile(dir_);
            if(w_isFile){
                if (this.verbose){
                    g.es_print('\nimporting file:', dir_);
                }
                await this.import_one_file(dir_, parent);
            }else{
                await this.import_dir(dir_, parent);
            }
            this.post_process(parent, dir_);  // Fix # 1033.
            c.undoer.afterChangeTree(p1, 'recursive-import', bunch);
        }catch (exception){
            g.es_print('Exception in recursive import');
            g.es_exception(exception);
        }finally{
            g.app.disable_redraw = false;
            for (const p2 of parent.self_and_subtree(false)){
                p2.contract();
            }
            c.redraw(parent);
        }

        const t2 = process.hrtime();
        const n = [...parent.self_and_subtree()].length;
        g.es_print(
            `imported ${n} node${g.plural(n)} ` +
            `in ${this.n_files} file${g.plural(this.n_files)} ` +
            `in ${utils.getDurationSeconds(t1, t2)} seconds`
        );

    }
    //@+node:felix.20230511002459.4: *4* ric.import_dir
    /**
     * Import selected files from dir_, a directory.
     */
    public async import_dir(dir_: string, parent: Position): Promise<void> {

        let files;

        if (await g.os_path_isfile(dir_)){
            files = [dir_];
        }else{
            if (this.verbose){
                g.es_print('importing directory:', dir_);
            }
            files = await g.os_listdir(dir_);
        }

        const dirs= [];
        const files2 = [];

        for (let w_path of files){
            try{
                // Fix #408. Catch path exceptions.
                // The idea here is to keep going on small errors.
                w_path = g.os_path_join(dir_, w_path);
                if (await g.os_path_isfile(w_path)){
                    let [name, ext] = g.os_path_splitext(w_path);
                    if (this.theTypes && this.theTypes.includes(ext)){
                        files2.push(w_path);
                    }
                }else if (this.recursive){
                    // if (this.ignore_pattern.search(w_path) === -1){
                    if (w_path.search(this.ignore_pattern) === -1){
                        dirs.push(w_path);
                    }
                }
            }catch (OSError){
                g.es_print('Exception computing', w_path);
                g.es_exception(OSError);
            }
        }

        if (files.length || dirs.length){
            console.assert(this.root && parent && parent.v !== this.root.v, "import_dir failed!" );
            parent = parent.insertAsLastChild();
            parent.v.h = dir_;
            if (files2.length){
                for (const f of files2){
                    // if (this.ignore_pattern.search(f)===-1){
                    if (f.search(this.ignore_pattern)===-1){
                        await this.import_one_file(f, parent=parent);
                    }
                }
            }
            if (dirs.length){
                console.assert( this.recursive);
                for(const dir_ of dirs.sort()){
                    await this.import_dir(dir_, parent);
                }
            }
        }
    }
    //@+node:felix.20230511002459.5: *4* ric.import_one_file
    /**
     * Import one file to the last top-level node.
     */
    public async import_one_file(p_path: string, parent: Position): Promise<void> {
        
        const c = this.c;
        this.n_files += 1;
        console.assert( this.root && parent && parent.v !== this.root.v, "Error in import_one_file");
        let p: Position;
        if (this.kind === '@edit'){
            p = parent.insertAsLastChild();
            p.v.h = '@edit ' + p_path.replace(/\\/g, '/');  // 2021/02/19: bug fix: add @edit.
            let [s, e] = await g.readFileIntoString(p_path, undefined, this.kind);
            p.v.b = s || "";
            return;
        }
        // #1484: Use this for @auto as well.
        c.importCommands.importFilesCommand(
            [p_path],
            parent,
            true,
            '@file',  // '@auto','@clean','@nosent' cause problems.
            this.verbose,  // Leo 6.6.
        );
        p = parent.lastChild();
        p.h = this.kind + p.h.substring(5);  // Honor the requested kind.
        if (this.safe_at_file){
            p.v.h = '@' + p.v.h;
        }

    }
    //@+node:felix.20230511002459.6: *4* ric.post_process & helpers
    /**
     * Traverse p's tree, replacing all nodes that start with prefix
     * by the smallest equivalent @path or @file node.
     */
    public post_process(p: Position, prefix: string): void {
        
        this.fix_back_slashes(p)
        prefix = prefix.replace('\\', '/')
        if this.kind not in ('@auto', '@edit')
            this.remove_empty_nodes(p)
        if p.firstChild()
            this.minimize_headlines(p.firstChild(), prefix)
        this.clear_dirty_bits(p)
        this.add_class_names(p)
    }
    //@+node:felix.20230511002459.7: *5* ric.add_class_names
    /**
     * Add class names to headlines for all descendant nodes.
     */
    public add_class_names(p: Position): void {

        // pylint: disable=no-else-continue
        const after = undefined;
        const class_name = undefined;
        const class_paren_pattern = re.compile(r'(.*)\(.*\)\.(.*)')
        const paren_pattern = re.compile(r'(.*)\(.*\.py\)')
        for (const p of p.self_and_subtree(false))
            // Part 1: update the status.
            m = this.file_pattern.match(p.h)
            if m
                // prefix = m.group(1)
                // fn = g.shortFileName(p.h[len(prefix):].trim())
                after, class_name = None, None
                continue

            else if p.h.startsWith('@path '):
                after, class_name = None, None
            else if p.h.startsWith('class '):
                class_name = p.h[5:].trim()
                if class_name
                    after = p.nodeAfterTree()
                    continue


            else if p == after:
                after, class_name = None, None

            // Part 2: update the headline.
            if class_name
                if p.h.startsWith(class_name)
                    m = class_paren_pattern.match(p.h)
                    if m
                        p.h = f"{m.group(1)}.{m.group(2)}".trimEnd()

                else
                    p.h = f"{class_name}.{p.h}"


            else
                m = paren_pattern.match(p.h)
                if m
                    p.h = m.group(1).trimEnd()



            // elif fn:
                // tag = ' (%s)' % fn
                // if not p.h.endsWith(tag):
                    // p.h += tag

    }
    //@+node:felix.20230511002459.8: *5* ric.clear_dirty_bits
    public clear_dirty_bits(p: Position): void {
        const c = this.c;
        c.clearChanged();  // Clears *all* dirty bits.
        for (const p of p.self_and_subtree(false)){
            p.clearDirty();
        }

    }
    //@+node:felix.20230511002459.9: *5* ric.dump_headlines
    public dump_headlines(p: Position): void {
        // show all headlines.
        for (const p of p.self_and_subtree(false)){
            print(p.h);
        }
    }
    //@+node:felix.20230511002459.10: *5* ric.fix_back_slashes
    /**
     * Convert backslash to slash in all headlines.
     */
    public fix_back_slashes(p: Position): void {
        
        for( const p of p.self_and_subtree(false)){
            s = p.h.replace(/\\/g, '/');
            if( s !== p.h){
                p.v.h = s;
            }

        }
    }
    //@+node:felix.20230511002459.11: *5* ric.minimize_headlines & helper
    /**
     * Create @path nodes to minimize the paths required in descendant nodes.
     */
    public minimize_headlines(p: Position, prefix: string): void {
        
        if (prefix && !prefix.endsWith('/')){
            prefix = prefix + '/';
        }
        const m = p.h.match(this.file_pattern);
        if (m && m.length){
            // It's an @file node of some kind. Strip off the prefix.
            kind = m[0];
            path = p.h.substring(kind.length).trim();
            stripped = this.strip_prefix(path, prefix);
            p.h = `${kind} ${stripped || path}`;
            // Put the *full* @path directive in the body.
            if (this.add_path && prefix){
                tail = g.os_path_dirname(stripped).trimEnd('/');
                p.b = `@path ${prefix}${tail}\n${p.b}`;
            }
        }else{
            // p.h is a path.
            path = p.h;
            stripped = this.strip_prefix(path, prefix);
            p.h = `@path ${stripped || path}`;
            for (const p of p.children()){
                this.minimize_headlines(p, prefix + stripped);
            }
        }
    }
    //@+node:felix.20230511002459.12: *6* ric.strip_prefix
    /**
     * Strip the prefix from the path and return the result.
     */
    public strip_prefix(p_path: string, prefix: string): string {
        
        if (p_path.startsWith(prefix)){
            return p_path.substring(prefix.length);
        }
        return '';  // A signal.

    }
    //@+node:felix.20230511002459.13: *5* ric.remove_empty_nodes
    /**
     * Remove empty nodes. Not called for @auto or @edit trees.
     */
    public remove_empty_nodes(p: Position): void {
        const c = this.c;
        aList = [
            p2 for p2 in p.self_and_subtree()
                if not p2.b and not p2.hasChildren()
        ];
        if (aList && aList.length){
            c.deletePositionsInList(aList);  // Don't redraw
        }
    }
    //@-others

}
//@+node:felix.20230511002653.1: ** class TabImporter
class TabImporter:
    """
    A class to import a file whose outline levels are indicated by
    leading tabs or blanks (but not both).
    """

    public __init__(c: Cmdr, separate: bool = True): void
        """Ctor for the TabImporter class."""
        this.c = c
        this.root: Position = None
        this.separate = separate
        this.stack: List[Tuple[int, Position]] = []

    //@+others
    //@+node:felix.20230511002653.2: *3* tabbed.check
    /**
     * Return False and warn if lines contains mixed leading tabs/blanks.
     */
    public check(lines: List[str], warn: bool = True): boolean {
        
        blanks, tabs = 0, 0
        for s in lines:
            lws = this.lws(s)
            if '\t' in lws:
                tabs += 1
            if ' ' in lws:
                blanks += 1
        if tabs and blanks
            if warn
                g.es_print('intermixed leading blanks and tabs.')

            return false;

        return true;
    }
    //@+node:felix.20230511002653.3: *3* tabbed.dump_stack
    /**
     * Dump the stack, containing (level, p) tuples.
     */
    public dump_stack(self): void {
        
        g.trace('==========')
        for i, data in enumerate(this.stack):
            level, p = data
            print(f"{i:2} {level} {p.h!r}")
    }
    //@+node:felix.20230511002653.4: *3* tabbed.import_files
    /**
     * Import a list of tab-delimited files.
     */
    public import_files(files: List[str]): void {
        
        c = this.c;
        u = this.c.undoer;
        if files
            p = None
            for fn in files
                try
                    g.setGlobalOpenDir(fn)
                    s = open(fn).read()
                    s = s.replace('\r', '')
                catch Exception
                    continue

                if s.trim() and this.check(g.splitLines(s))
                    undoData = u.beforeInsertNode(c.p)
                    last = c.lastTopLevel()
                    this.root = p = last.insertAfter()
                    this.scan(s)
                    p.h = g.shortFileName(fn)
                    p.contract()
                    p.setDirty()
                    u.afterInsertNode(p, 'Import Tabbed File', undoData)

                if p
                    c.setChanged();
                    c.redraw(p);

    }
    //@+node:felix.20230511002653.5: *3* tabbed.lws
    /**
     * Return the length of the leading whitespace of s.
     */
    public lws(s: string): string {
        
        for i, ch in enumerate(s)
            if ch not in ' \t'
                return s[:i]


        return s;
    }
    //@+node:felix.20230511002653.6: *3* tabbed.prompt_for_files
    /**
     * Prompt for a list of FreeMind (.mm.html) files and import them.
     */
    public prompt_for_files(): void 
        
        const c = this.c;
        types = [
            ("All files", "*"),
        ]
        names = g.app.gui.runOpenFileDialog(c,
            title="Import Tabbed File",
            filetypes=types,
            defaultextension=".html",
            multiple=True)
        c.bringToFront()
        if names
            g.chdir(names[0]);
            this.import_files(names);


    //@+node:felix.20230511002653.7: *3* tabbed.scan
    /**
     * Create the outline corresponding to s1.
     */
    public scan(s1: string, fn?: string, root?: Position): Position {
        
        const c = this.c;
        // Self.root can be None if we are called from a script or unit test.
        if not this.root
            last = root if root else c.lastTopLevel()  // For unit testing.
            this.root = last.insertAfter()
            if fn
                this.root.h = fn
        lines = g.splitLines(s1)
        this.stack = []
        // Redo the checks in case we are called from a script.
        if s1.trim() and this.check(lines)
            for const s of lines
                if s.trim() || !this.separate
                    this.scan_helper(s)
        return this.root

    }
    //@+node:felix.20230511002653.8: *3* tabbed.scan_helper
    /**
     * Update the stack as necessary and return level.
     */
    public scan_helper(s: string): number {
        
        root, separate, stack = this.root, this.separate, this.stack
        if stack
            level, parent = stack[-1]
        else
            level, parent = 0, None

        lws = len(this.lws(s))
        h = s.trim()
        if lws == level:
            if separate or not parent:
                // Replace the top of the stack with a new entry.
                if stack:
                    stack.pop()


                grand_parent = stack[-1][1] if stack else root
                parent = grand_parent.insertAsLastChild()  // lws == level
                parent.h = h
                stack.append((level, parent),)
            else if not parent.h:
                parent.h = h


        else if lws > level
            // Create a new parent.
            level = lws
            parent = parent.insertAsLastChild()
            parent.h = h
            stack.append((level, parent),)
        else
            // Find the previous parent.
            while stack
                level2, parent2 = stack.pop()
                if level2 === lws
                    grand_parent = stack[-1][1] if stack else root
                    parent = grand_parent.insertAsLastChild()  // lws < level
                    parent.h = h
                    level = lws
                    stack.append((level, parent),)
                    break
            else
                level = 0
                parent = root.insertAsLastChild()
                parent.h = h
                stack = [[0, parent]]


        console.assert parent && parent.__eq__(stack[-1][1]);  // An important invariant.
        console.assert level === stack[-1][0], JSON.stringify([level, stack[-1][0]])
        if !separate
            parent.b = parent.b + this.undent(level, s);


        return level

    }
    //@+node:felix.20230511002653.9: *3* tabbed.undent
    /**
     * Unindent all lines of p.b by level.
     */
    public undent(level: number, s: string): string {
        
        if level <= 0
            return s

        if s.trim()
            lines = g.splitLines(s)
            ch = lines[0][0]
            console.assert ch in ' \t', repr(ch)
            // Check that all lines start with the proper lws.
            lws = ch.repeat(level)
            for const s of lines
                if !s.startsWith(lws)
                    g.trace(`bad indentation: ${s!r}`);
                    return s;



            return ''.join([z[len(lws) :] for z in lines]);


        return '';

    }
    //@-others
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
