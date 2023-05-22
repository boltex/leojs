//@+leo-ver=5-thin
//@+node:felix.20230427003032.1: * @file src/core/leoRst.ts
//@+<< leoRst docstring >>
//@+node:felix.20230427003032.2: ** << leoRst docstring >>
/**
 * Support for restructured text (rST), adapted from rst3 plugin.
 *
 * For full documentation, see: https://leo-editor.github.io/leo-editor/tutorial-rst3.html
 *
 * To generate documents from rST files, Python's docutils_ module must be
 * installed. The code will use the SilverCity_ syntax coloring package if is is
 * available.
 */
//@-<< leoRst docstring >>
//@+<< leoRst imports >>
//@+node:felix.20230427003032.3: ** << leoRst imports >>

import { new_cmd_decorator } from "./decorators";
import * as utils from "../utils";

// from __future__ import annotations
// import io
// import os
// import re
// import time
// from typing import Any, Callable, Dict, Generator, List, Optional, Set, TYPE_CHECKING

// Third-part imports...
// try:
//     import docutils
//     import docutils.core
//     from docutils import parsers
//     from docutils.parsers import rst
// except Exception:
//     docutils = None  // type:ignore

// Leo imports.
// TODO : DOCUTILS
//import * as docutils from "xxx"
const docutils = false;
import * as g from './leoGlobals';

// Aliases & traces.
// StringIO = io.StringIO
// if 'plugins' in getattr(g.app, 'debug', []):
//     print('leoRst.py: docutils:', bool(docutils))
//     print('leoRst.py:  parsers:', bool(parsers))
//     print('leoRst.py:      rst:', bool(rst))
//@-<< leoRst imports >>
//@+<< leoRst annotations >>
//@+node:felix.20230427003032.4: ** << leoRst annotations >>
// if TYPE_CHECKING:  // pragma: no cover
//     from leo.core.leoCommands import Commands as Cmdr
//     from leo.core.leoGui import LeoKeyEvent as Event
//     from leo.core.leoNodes import Position, VNode

import { Position, VNode } from './leoNodes';
import { Commands } from './leoCommands';
//@-<< leoRst annotations >>

//@+others
//@+node:felix.20230427003416.1: ** u.cmd (decorator)
/**
 * Command decorator for the RstCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'rstCommands']);
}
//@+node:felix.20230427003032.5: ** class RstCommands
/**
 * A class to convert @rst nodes to rST markup.
 */
export class RstCommands {

    public c: Commands;

    // Statistics.
    public n_intermediate: number; // Number of intermediate files written.
    public n_docutils: number; // Number of docutils files written.

    // Http support for HtmlParserClass.  See http_addNodeMarker.
    public anchor_map: { [key: string]: Position };  // Keys are anchors. Values are positions
    public http_map: { [key: string]: Position };  // Keys are named hyperlink targets.  Value are positions.
    public nodeNumber: number; // Unique node number.

    // For writing.
    public at_auto_underlines: string;  // Full set of underlining characters.
    public at_auto_write: boolean;  // True: in @auto-rst importer.
    public changed_positions: Position[];
    public changed_vnodes: VNode[];  // As a set
    public encoding: BufferEncoding;  // From any @encoding directive.
    public path: string;  // The path from any @path directive.
    public result_list: string[];  // The intermediate results.
    public root: Position | undefined;  // The @rst node being processed.

    // Default settings.
    public default_underline_characters: string;
    public remove_leo_directives: boolean;  // For compatibility with legacy operation.
    public user_filter_b: undefined | ((c: Commands, p: Position) => string);
    public user_filter_h: undefined | ((c: Commands, p: Position) => string);

    public rst3_action: string | undefined;

    public options_pat = /^@ @rst-options/m;
    public default_pat = /^default_path\s*=(.*)$/m;

    // Reporting options.
    public silent!: boolean;

    // Http options.
    public http_server_support!: boolean;
    public node_begin_marker!: string;

    // Output options.
    public default_path!: string;
    public generate_rst_header_comment!: boolean;

    public underline_characters!: string;
    public write_intermediate_file!: boolean;
    public write_intermediate_extension!: string;

    // Docutils options.
    public call_docutils!: boolean;
    public publish_argv_for_missing_stylesheets!: string;
    public stylesheet_embed!: boolean;
    public stylesheet_name!: string;
    public stylesheet_path!: string;
    public underlines1: string | undefined;
    public underlines2: string | undefined;


    //@+others
    //@+node:felix.20230427003032.6: *3* rst: Birth
    //@+node:felix.20230427003032.7: *4* rst.__init__
    /** 
     * Ctor for the RstCommand class.
     */
    constructor(c: Commands) {

        this.c = c;

        // Statistics.
        this.n_intermediate = 0;  // Number of intermediate files written.
        this.n_docutils = 0;  // Number of docutils files written.

        // Http support for HtmlParserClass.  See http_addNodeMarker.
        this.anchor_map = {};  // Keys are anchors. Values are positions
        this.http_map = {};  // Keys are named hyperlink targets.  Value are positions.
        this.nodeNumber = 0;  // Unique node number.

        // For writing.
        this.at_auto_underlines = '';  // Full set of underlining characters.
        this.at_auto_write = false;  // True: in @auto-rst importer.
        this.changed_positions = [];
        this.changed_vnodes = [];
        this.encoding = 'utf-8';  // From any @encoding directive.
        this.path = '';  // The path from any @path directive.
        this.result_list = [];  // The intermediate results.
        this.root = undefined;  // The @rst node being processed.

        // Default settings.
        this.default_underline_characters = '#=+*^~-:><';
        this.remove_leo_directives = false;  // For compatibility with legacy operation.
        this.user_filter_b = undefined;
        this.user_filter_h = undefined;

        // Complete the init.
        this.reloadSettings();

    }
    //@+node:felix.20230427003032.8: *4* rst.reloadSettings
    /**
     * RstCommand.reloadSettings
     */
    public reloadSettings(): void {

        const c = this.c;
        const getBool = c.config.getBool;
        const getString = c.config.getString;

        // Action option for rst3 command.
        this.rst3_action = getString('rst3-action') || 'none';
        if (!['none', 'clone', 'mark'].includes(this.rst3_action.toLowerCase())) {
            this.rst3_action = 'none';
        }
        // Reporting options.
        this.silent = !getBool('rst3-verbose', true);

        // Http options.
        this.http_server_support = getBool('rst3-http-server-support', false);
        this.node_begin_marker = getString('rst3-node-begin-marker') || 'http-node-marker-';

        // Output options.
        this.default_path = getString('rst3-default-path') || '';
        this.generate_rst_header_comment = getBool('rst3-generate-rst-header-comment', true);
        this.remove_leo_directives = getBool('rst3-remove-leo-directives', false);
        this.underline_characters = (
            getString('rst3-underline-characters')
            || this.default_underline_characters);
        this.write_intermediate_file = getBool('rst3-write-intermediate-file', true);
        this.write_intermediate_extension = getString('rst3-write-intermediate-extension') || '.txt';

        // Docutils options.
        this.call_docutils = getBool('rst3-call-docutils', true);
        this.publish_argv_for_missing_stylesheets = getString('rst3-publish-argv-for-missing-stylesheets') || '';
        this.stylesheet_embed = getBool('rst3-stylesheet-embed', false);
        this.stylesheet_name = getString('rst3-stylesheet-name') || 'default.css';
        this.stylesheet_path = getString('rst3-stylesheet-path') || '';

    }
    //@+node:felix.20230427003032.9: *3* rst: Entry points
    //@+node:felix.20230427003032.10: *4* rst.rst-convert-legacy-outline
    @cmd(
        'rst-convert-legacy-outline',
        'Convert @rst-preformat nodes and `@ @rst-options` doc parts.'
    )
    @cmd(
        'convert-legacy-rst-outline',
        'Convert @rst-preformat nodes and `@ @rst-options` doc parts.'
    )
    public convert_legacy_outline(): void {
        const c = this.c;

        for (const p of c.all_unique_positions()) {
            if (g.match_word(p.h, 0, '@rst-preformat')) {
                this.preformat(p);
            }
            this.convert_rst_options(p);
        }
    }
    //@+node:felix.20230427003032.11: *5* rst.convert_rst_options
    /**
     * Convert options @doc parts. Change headline to @path <fn>.
     */
    public convert_rst_options(p: Position): void {
        const m1 = p.b.match(this.options_pat);
        const m2 = p.b.match(this.default_pat);
        if (m1 && m2 && m1.length && m2.length && m1.index && m2.index && m2.index > m1.index) {
            const fn = m2[1].trim();
            if (fn) {
                const old_h = p.h;
                p.h = `@path ${fn}`;
                console.log(`${old_h} => ${p.h}`);
            }
        }
    }
    //@+node:felix.20230427003032.12: *5* rst.preformat
    /**
     * Convert p.b as if preformatted. Change headline to @rst-no-head
     */
    public preformat(p: Position): void {
        if (!p.b.trim()) {
            return;
        }

        const lines = g.splitLines(p.b).map((s) => s.trim() ? `    ${s}` : '\n');
        p.b = '::\n\n' + lines.join('');

        const old_h = p.h;
        p.h = '@rst-no-head';
        console.log(`${old_h} => ${p.h}`);
    }
    //@+node:felix.20230427003032.13: *4* rst.rst3 command & helpers
    @cmd('rst3', 'Write all @rst nodes.')
    public async rst3(): Promise<number> {

        const t1 = process.hrtime();
        this.n_intermediate = 0;
        this.n_docutils = 0;
        await this.processTopTree(this.c.p);
        const t2 = process.hrtime();
        g.es_print(
            `rst3: wrote...\n` +
            `${this.n_intermediate.toString().padStart(4)} intermediate file${g.plural(this.n_intermediate)}\n` +
            `${this.n_docutils.toString().padStart(4)} docutils file${g.plural(this.n_docutils)}\n` +
            `in ${utils.getDurationSeconds(t1, t2)} sec.`);
        return this.n_intermediate;

    }
    //@+node:felix.20230427003032.14: *5* rst.do_actions & helper
    /**
     * Handle actions specified by @string rst3-action.
     */
    public do_actions(): void {

        const c = this.c;
        const action = this.rst3_action;
        const positions = this.changed_positions;
        const n = positions.length;
        if (action === 'none' || !positions || !positions.length) {
            return;
        }
        if (action === 'mark') {
            g.es_print(`action: marked ${n} node${g.plural(n)}`);
            for (const p of positions) {
                p.setMarked();
            }
            c.redraw();
        } else if (action === 'clone') {
            g.es_print(`action: cloned ${n} node${g.plural(n)}`);
            const organizer = this.clone_action_nodes();
            c.redraw(organizer);
        } else {
            g.es_print(`Can not happen: bad action: ${action}`);
        }

    }
    //@+node:felix.20230427003032.15: *6* rst.clone_action_nodes
    /**
     * Create an organizer node as the last node of the outline.
     * Clone all positions in self.positions as children of the organizer node.
     */
    public clone_action_nodes(): Position {

        const c = this.c;
        const positions = this.changed_positions;
        let n = positions.length;
        // Create the organizer node.
        const organizer = c.lastTopLevel().insertAfter();
        organizer.h = `Cloned ${n} changed @rst node${g.plural(n)}`;
        organizer.b = '';
        // Clone nodes as children of the organizer node.
        for (const p of positions) {
            const p2 = p.copy();
            n = organizer.numberOfChildren();
            p2._linkCopiedAsNthChild(organizer, n);
        }

        return organizer;

    }
    //@+node:felix.20230427003032.16: *5* rst.processTopTree
    /**
     * Call processTree for @rst and @slides node p's subtree or p's ancestors.
     */
    public async processTopTree(p: Position): Promise<void> {
        const predicate = (p: Position): boolean => {
            return this.is_rst_node(p) || g.match_word(p.h, 0, '@slides');
        };

        this.changed_positions = [];
        this.changed_vnodes = [];  // as a set
        const roots = g.findRootsWithPredicate(this.c, p, predicate);
        if (roots && roots.length) {
            for (const p of roots) {
                await this.processTree(p);
            }
            this.do_actions();
        } else {
            g.warning('No @rst or @slides nodes in', p.h);
        }
    }
    //@+node:felix.20230427003032.17: *5* rst.processTree
    /**
     * Process all @rst nodes in a tree.
     */
    public async processTree(root: Position): Promise<void> {
        for (const p of root.self_and_subtree()) {
            if (this.is_rst_node(p)) {
                if (this.in_rst_tree(p)) {
                    g.trace(`ignoring nested @rst node: ${p.h}`);
                } else {
                    p.h = p.h.trim();
                    const fn = p.h.substring(4).trim();
                    if (fn) {
                        const source = this.write_rst_tree(p, fn);
                        await this.write_docutils_files(fn, p, source);
                    }
                }
            } else if (g.match_word(p.h, 0, "@slides")) {
                if (this.in_slides_tree(p)) {
                    g.trace(`ignoring nested @slides node: ${p.h}`);
                } else {
                    await this.write_slides(p);
                }
            }
        }
    }
    //@+node:felix.20230427003032.18: *5* rst.write_rst_tree (sets self.root)
    /**
     * Convert p's tree to rst sources.
     */
    public write_rst_tree(p: Position, fn: string): string {

        const c = this.c;
        this.root = p.copy();
        //
        // Init encoding and path.
        const d = c.scanAllDirectives(p);
        this.encoding = d['encoding'] || 'utf-8';
        this.path = d['path'] || '';
        // Write the output to this.result_list.
        this.result_list = [];  // All output goes here.
        if (this.generate_rst_header_comment) {
            this.result_list.push(`.. rst3: filename: ${fn}`);
        }
        for (const p of this.root.self_and_subtree()) {
            this.writeNode(p);
        }
        const source = this.compute_result();
        return source;

    }
    //@+node:felix.20230427003032.19: *5* rst.write_slides & helper
    /**
     * Convert p's children to slides.
     */
    public async write_slides(p: Position): Promise<void> {

        const c = this.c;
        p = p.copy();
        const h = p.h;
        const i = g.skip_id(h, 1);  // Skip the '@'
        const kind = h.substring(0, i).trim();
        const fn = h.substring(i).trim();
        if (!fn) {
            g.error(`${kind} requires file name`);
            return;
        }
        let title = p && p.__bool__() && p.firstChild() ? p.firstChild().h : '<no slide>';
        title = title.trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);

        const n_tot = p.numberOfChildren();
        let n = 1;
        const d = c.scanAllDirectives(p);
        this.encoding = d['encoding'] || 'utf-8';
        this.path = d['path'] || '';
        for (const child of p.children()) {
            // Compute the slide's file name.
            let [fn2, ext] = g.os_path_splitext(fn);
            // Use leading zeros for :glob:.
            fn2 = `${fn2}-${n.toString().padStart(3, '0')}${ext}`;

            n += 1;
            // Write the rst sources.
            this.result_list = [];
            this.writeSlideTitle(title, n - 1, n_tot);
            this.result_list.push(child.b);
            const source = this.compute_result();
            await this.write_docutils_files(fn2, p, source);
        }
    }
    //@+node:felix.20230427003032.20: *6* rst.writeSlideTitle
    /**
     * Write the title, underlined with the '#' character.
     */
    public writeSlideTitle(title: string, n: number, n_tot: number): void {

        if (n !== 1) {
            title = `${title} (${n} of ${n_tot})`;
        }
        const width = Math.max(
            4, g.toEncodedString(title, this.encoding, false).length
        );

        this.result_list.push(`${title}\n${'#'.repeat(width)}`);

    }
    //@+node:felix.20230427003032.21: *5* rst.writeNode & helper
    /**
     * Append the rst sources to self.result_list.
     */
    public writeNode(p: Position): void {

        const c = this.c;
        if (this.is_ignore_node(p) || this.in_ignore_tree(p)) {
            return;
        }
        if (g.match_word(p.h, 0, '@rst-no-head')) {
            this.result_list.push(this.filter_b(c, p));
        } else {
            this.http_addNodeMarker(p);
            if (!p.__eq__(this.root)) {
                this.result_list.push(this.underline(p, this.filter_h(c, p)));
            }
            this.result_list.push(this.filter_b(c, p));
        }
    }
    //@+node:felix.20230427003032.22: *6* rst.http_addNodeMarker
    /**
     * Add a node marker for the mod_http plugin (HtmlParserClass class).
     *
     * The first three elements are a stack of tags, the rest is html code::
     *
     *    [
     *        <tag n start>, <tag n end>, <other stack elements>,
     *        <html line 1>, <html line 2>, ...
     *    ]
     *
     * <other stack elements> has the same structure::
     *
     *    [<tag n-1 start>, <tag n-1 end>, <other stack elements>]
     */
    public http_addNodeMarker(p: Position): void {

        if (this.http_server_support) {
            this.nodeNumber += 1;
            const anchorname = `${this.node_begin_marker}${this.nodeNumber}`;
            this.result_list.push(`.. _${anchorname}:`);
            this.http_map[anchorname] = p.copy();
        }
    }
    //@+node:felix.20230427003032.23: *4* rst.write_docutils_files & helpers
    /** 
     * Write source to the intermediate file and write the output from docutils..
     */
    public async write_docutils_files(fn: string, p: Position, source: string): Promise<void> {

        console.assert(this.root && p.__eq__(this.root));
        let [junk, ext] = g.os_path_splitext(fn);
        ext = ext.toLowerCase();
        fn = this.computeOutputFileName(fn);
        const ok = this.createDirectoryForFile(fn);
        if (!ok) {
            return;
        }

        // Write the intermediate file.
        if (this.write_intermediate_file) {
            await this.writeIntermediateFile(fn, source);
        }

        // Should we call docutils?
        if (!this.call_docutils) {
            return;
        }

        if (!['.htm', '.html', '.tex', '.pdf', '.s5', '.odt'].includes(ext)) {  // #1884: test now.
            return;
        }

        // Write the result from docutils.
        let s = await this.writeToDocutils(source, ext);
        if (s && ['.html', '.htm'].includes(ext)) {
            s = this.addTitleToHtml(s);
        }

        if (!s) {
            return;
        }

        const changed = await g.write_file_if_changed(fn, s, 'utf-8');
        if (changed) {
            this.n_docutils += 1;
            this.report(fn);
            if (!this.changed_vnodes.includes(this.root!.v)) {
                this.changed_positions.push(this.root!.copy());
                this.changed_vnodes.push(this.root!.v);
            }

        }
    }
    //@+node:felix.20230427003032.24: *5* rst.addTitleToHtml
    /**
     * Replace an empty <title> element by the contents of the first <h1> element.
     */
    public addTitleToHtml(s: string): string {

        const i = s.indexOf('<title></title>');
        if (i === -1) {
            return s;
        }
        let m = s.match(/<h1>([^<]*)<\/h1>/);
        if (!m) {
            m = s.match(/<h1><[^>]+>([^<]*)<\/a><\/h1>/);
        }
        if (m) {
            s = s.replace('<title></title>', `<title>${m[1]}</title>`);
        }
        return s;

    }
    //@+node:felix.20230427003032.25: *5* rst.computeOutputFileName
    /**
     * Return the full path to the output file.
     */
    public computeOutputFileName(fn: string): string {

        const c = this.c;
        const openDirectory = c.frame.openDirectory;
        let path;
        if (this.default_path) {
            path = g.finalize_join(this.path, this.default_path, fn);
        } else if (this.path) {
            path = g.finalize_join(this.path, fn);
        } else if (openDirectory) {
            path = g.finalize_join(this.path, openDirectory, fn);
        } else {
            path = g.finalize_join(fn);
        }
        return path;
    }
    //@+node:felix.20230427003032.26: *5* rst.createDirectoryForFile
    /**
     * Create the directory for fn if
     * a) it doesn't exist and
     * b) the user options allow it.
     *
     * Return True if the directory existed or was made.
     */
    public async createDirectoryForFile(fn: string): Promise<boolean> {

        const c = this.c;
        let [theDir, junk] = g.os_path_split(fn);
        theDir = g.finalize(theDir);
        const w_exist = await g.os_path_exists(theDir);
        if (w_exist) {
            return true;
        }
        if (c && c.config && c.config.getBool('create-nonexistent-directories', false)) {
            theDir = c.expand_path_expression(theDir);
            const ok = await g.makeAllNonExistentDirectories(theDir);
            if (!ok) {
                g.error('did not create:', theDir);
            }
            return !!ok;

        }
        return false;  // Does not exist and wasn't made.
    }
    //@+node:felix.20230427003032.27: *5* rst.writeIntermediateFile
    /**
     * Write s to to the file whose name is fn.
     *
     * New in Leo 6.7.2: write the file only if:
     * a: it does not exist or
     * b: the write would actually change the file.
     */
    public async writeIntermediateFile(fn: string, s: string): Promise<boolean> {

        let ext = this.write_intermediate_extension;
        if (!ext.startsWith('.')) {
            ext = '.' + ext;
        }
        fn = fn + ext;
        const changed = await g.write_file_if_changed(fn, s, this.encoding);
        if (changed) {
            this.n_intermediate += 1;
            this.report(fn);
            if (!this.changed_vnodes.includes(this.root!.v)) {
                this.changed_positions.push(this.root!.copy());
                this.changed_vnodes.push(this.root!.v);
            }
        }
        return changed;

    }
    //@+node:felix.20230427003032.28: *5* rst.writeToDocutils & helper
    /**
     * Send s to docutils using the writer implied by ext and return the result.
     */
    public async writeToDocutils(s: string, ext: string): Promise<string | undefined> {

        if (!docutils) {
            g.error('writeToDocutils: docutils not present');
            return undefined;
        }

        const join = g.finalize_join;
        const openDirectory = this.c.frame.openDirectory;
        const overrides: { [key: string]: any } = { 'output_encoding': this.encoding };
        let ext2: string;
        let writer;
        let writer_name: string;
        let result;
        //
        // Compute the args list if the stylesheet path does not exist.
        const styleSheetArgsDict = this.handleMissingStyleSheetArgs();
        if (ext === '.pdf') {
            // TODO !    
            console.log('TODO : IMPLEMENT PDF SUPPORT FOR leoRst.ts');
            const module: any = undefined;
            // module = g.import_module('leo.plugins.leo_pdf')
            if (!module) {
                return undefined;
            }

            writer = module.Writer();  // Get an instance.

        } else {
            writer = undefined;
            let w_found = false;
            for ([ext2, writer_name] of [  // noqa: writer_name used below.
                ['.html', 'html'],
                ['.htm', 'html'],
                ['.tex', 'latex'],
                ['.pdf', 'leo.plugins.leo_pdf'],
                ['.s5', 's5'],
                ['.odt', 'odt'],
            ]) {
                if (ext2 === ext) {
                    w_found = true;
                    break;
                }
            }
            if (!w_found) {
                g.error(`unknown docutils extension: ${ext}`);
                return undefined;
            }
        }
        //
        // Make the stylesheet path relative to open directory.
        const rel_stylesheet_path = this.stylesheet_path || '';
        const stylesheet_path = [openDirectory, rel_stylesheet_path].join();
        console.assert(this.stylesheet_name);
        const w_path = [this.stylesheet_path, this.stylesheet_name].join();
        if (!this.stylesheet_embed) {

            let rel_path = [rel_stylesheet_path, this.stylesheet_name].join();
            rel_path = rel_path.replace(/\\/g, '/');
            overrides['stylesheet'] = rel_path;
            overrides['stylesheet_path'] = undefined;
            overrides['embed_stylesheet'] = undefined;
        } else if (await g.os_path_exists(w_path)) {
            if (ext !== '.pdf') {
                overrides['stylesheet'] = w_path;
                overrides['stylesheet_path'] = undefined;
            }
        } else if (styleSheetArgsDict && Object.keys(styleSheetArgsDict).length > 0) {
            g.es_print('using publish_argv_for_missing_stylesheets', styleSheetArgsDict);
            overrides.update(styleSheetArgsDict);  // MWC add args to settings
        } else if (rel_stylesheet_path === stylesheet_path) {
            g.error(`stylesheet not found: ${w_path}`);
        } else {
            g.error('stylesheet not found\n', w_path);
            if (this.path) {
                g.es_print('@path:', this.path);
            }

            g.es_print('open path:', openDirectory);
            if (rel_stylesheet_path) {
                g.es_print('relative path:', rel_stylesheet_path);
            }
        }
        try {
            result = "";
            // TODO !
            console.log('TODO : SUPPORT DOCUTILS IN leoRst.ts');
            // result = docutils.core.publish_string(source=s,
            //         reader_name='standalone',
            //         parser_name='restructuredtext',
            //         writer=writer,
            //         writer_name=writer_name,
            //         settings_overrides=overrides)
            // if isinstance(result, bytes) // ! not needed for g.toUnicode
            result = g.toUnicode(result);

        }
        // catch docutils.ApplicationError as error
        //     g.error('Docutils error:')
        //     g.blue(error)
        catch (exception) {
            g.es_print('Unexpected docutils exception');
            g.es_exception();
        }

        return result;

    }
    //@+node:felix.20230427003032.29: *6* rst.handleMissingStyleSheetArgs
    /**
     * Parse the publish_argv_for_missing_stylesheets option,
     * returning a dict containing the parsed args.
     */
    public handleMissingStyleSheetArgs(s?: string): { [key: string]: string } {

        if (0) {
            // See http://docutils.sourceforge.net/docs/user/config.html#documentclass
            return {
                'documentclass': 'report',
                'documentoptions': 'english,12pt,lettersize',
            };
        }
        if (!s) {
            s = this.publish_argv_for_missing_stylesheets;
        }
        if (!s) {
            return {};
        }

        // Handle argument lists such as this:
        // --language=en,--documentclass=report,--documentoptions=[english,12pt,lettersize]
        const d: { [key: string]: string } = {};
        while (s) {
            s = s.trim();
            if (!s.startsWith('--')) {
                break;
            }
            s = s.slice(2).trim();
            const eq = s.indexOf('=');
            let cm = s.indexOf(',');
            let key, val;
            if (eq === -1 || (-1 < cm && cm < eq)) {  // key[nl] or key,
                val = '';
                cm = s.indexOf(',');
                if (cm === -1) {
                    key = s.trim();
                    s = '';
                } else {
                    key = s.slice(0, cm).trim();
                    s = s.slice(cm + 1).trim();
                }
            } else {  // key = val
                key = s.slice(0, eq).trim();
                s = s.slice(eq + 1).trim();
                if (s.startsWith('[')) {  // [...]
                    const rb = s.indexOf(']');
                    if (rb === -1) {
                        break;  // Bad argument.
                    }
                    val = s.slice(0, rb + 1);
                    s = s.slice(rb + 1).trim();
                    if (s.startsWith(',')) {
                        s = s.slice(1).trim();
                    }
                } else {  // val[nl] or val,
                    cm = s.indexOf(',');
                    if (cm === -1) {
                        val = s.trim();
                        s = '';
                    } else {
                        val = s.slice(0, cm).trim();
                        s = s.slice(cm + 1).trim();
                    }
                }
            }
            if (!key) {
                break;
            }
            if (!val.trim()) {
                val = '1';
            }
            d[key] = val;
        }
        return d;
    }
    //@+node:felix.20230427003032.30: *4* rst.writeAtAutoFile & helpers
    /**
     * at.writeAtAutoContents calls this method to write an @auto tree
     * containing imported rST code.
     *
     * at.writeAtAutoContents will close the output file.
     */
    public writeAtAutoFile(p: Position, fileName: string, outputFile: string): boolean {

        this.result_list = [];
        this.initAtAutoWrite(p);
        this.root = p.copy();
        const after = p.nodeAfterTree();
        let ok: boolean;
        if (!this.isSafeWrite(p)) {
            return false;
        }
        try {
            this.at_auto_write = true;  // Set the flag for underline.
            p = p.firstChild();  // A hack: ignore the root node.
            while (p && p.__bool__() && !p.__eq__(after)) {
                this.writeNode(p);  // side effect: advances p
            }
            const s = this.compute_result();

            // outputFile.write(s)
            outputFile = outputFile + s;

            ok = true;
        } catch (exception) {
            ok = false;
        } finally {
            this.at_auto_write = false;
        }
        return ok;

    }
    //@+node:felix.20230427003032.31: *5* rst.initAtAutoWrite
    /**
     * Init underlining for for an @auto write.
     */
    public initAtAutoWrite(p: Position): void {

        // User-defined underlining characters make no sense in @auto-rst.
        const d: { [key: string]: any } = p.v.u['rst-import'] || {};
        let underlines2 = d['underlines2'] || '';

        //
        // Do *not* set a default for overlining characters.
        if (underlines2.length > 1) {
            underlines2 = underlines2[0];
            g.warning(`too many top-level underlines, using ${underlines2}`);
        }
        let underlines1 = d['underlines1'] || '';

        //
        // Pad underlines with default characters.
        const default_underlines = '=+*^~"\'`-:><_';
        if (underlines1) {
            const w_str = default_underlines.substring(1);
            for (let i = 0; i < w_str.length; i++) {
                if (!underlines1.includes(w_str[i])) {
                    underlines1 = underlines1 + w_str[i];
                }
            }
        } else {
            underlines1 = default_underlines;
        }
        this.at_auto_underlines = underlines2 + underlines1;
        this.underlines1 = underlines1;
        this.underlines2 = underlines2;
    }
    //@+node:felix.20230427003032.32: *5* rst.isSafeWrite
    /**
     * Return True if node p contributes nothing but
     * rst-options to the write.
     */
    public isSafeWrite(p: Position): boolean {

        const lines = g.splitLines(p.b);
        for (const z of lines) {
            if (z.trim() && !z.startsWith('@') && !z.startsWith('.. ')) {
                // A real line that will not be written.
                g.error('unsafe @auto-rst');
                g.es('body text will be ignored in\n', p.h);
                return false;
            }
        }
        return true;

    }
    //@+node:felix.20230427003032.33: *4* rst.writeNodeToString
    /**
     * rst.writeNodeToString: A utility for scripts. Not used in Leo.
     *
     * Write p's tree to a string as if it were an @rst node.
     * Return the string.
     */
    public writeNodeToString(p: Position): string {
        return this.write_rst_tree(p, p.h);
    }
    //@+node:felix.20230427003032.34: *3* rst: Filters
    //@+node:felix.20230427003032.35: *4* rst.filter_b
    /**
     * Filter p.b with user_filter_b function.
     * Don't allow filtering when in the @auto-rst logic.
     */
    public filter_b(c: Commands, p: Position): string {

        if (this.user_filter_b && !this.at_auto_write) {
            try {
                return this.user_filter_b(c, p);
            } catch (exception) {
                g.es_exception();
                this.user_filter_b = undefined;
                return p.b;
            }

        }
        if (this.remove_leo_directives) {

            return g.splitLines(p.b).filter(
                z => !(z.startsWith('@language ') || z.startsWith('@others') || z.startsWith('@wrap'))
            ).join('');

        }

        return p.b;

    }
    //@+node:felix.20230427003032.36: *4* rst.filter_h
    /**
     * Filter p.h with user_filter_h function.
     * Don't allow filtering when in the @auto-rst logic.
     */
    public filter_h(c: Commands, p: Position): string {

        if (this.user_filter_h && !this.at_auto_write) {
            try {
                return this.user_filter_h(c, p);
            } catch (exception) {
                g.es_exception(exception);
                this.user_filter_h = undefined;
            }
        }
        return p.h;
    }
    //@+node:felix.20230427003032.37: *4* rst.register_*_filter
    /**
     * Register the user body filter.
     */
    public register_body_filter(f: (c: Commands, p: Position) => string): void {
        this.user_filter_b = f;
    }

    /**
     * Register the user headline filter.
     */
    public register_headline_filter(f: (c: Commands, p: Position) => string): void {
        this.user_filter_h = f;
    }
    //@+node:felix.20230427003032.38: *3* rst: Predicates
    public in_ignore_tree(p: Position): boolean {
        return [...this.rst_parents(p)].some(p2 => g.match_word(p2.h, 0, '@rst-ignore-tree'));
    }
    public in_rst_tree(p: Position): boolean {
        return [...this.rst_parents(p)].some(p2 => this.is_rst_node(p2));
    }
    public in_slides_tree(p: Position): boolean {
        return [...this.rst_parents(p)].some(p2 => g.match_word(p.h, 0, "@slides"));
    }
    public is_ignore_node(p: Position): boolean {
        return g.match_words(p.h, 0, ['@rst-ignore', '@rst-ignore-node']);
    }
    public is_rst_node(p: Position): boolean {
        return g.match_word(p.h, 0, "@rst") && !g.match(p.h, 0, "@rst-");
    }
    public *rst_parents(p: Position): Generator<Position> {
        for (const p2 of p.parents()) {
            if (p2.__eq__(this.root)) {
                return;
            }
            yield p2;
        }
    }
    //@+node:felix.20230427003032.39: *3* rst: Utils
    //@+node:felix.20230427003032.40: *4* rst.compute_result
    /** 
     * Concatenate all strings in self.result, ensuring exactly one blank line between strings.
     */
    public compute_result(): string {
        return this.result_list.filter((s) => s.trim())
            .map((s) => `${s.trim()}\n\n`)
            .join('');
    }
    //@+node:felix.20230427003032.41: *4* rst.dumpDict
    public dumpDict(d: { [key: string]: string }, tag: string): void {
        g.pr(tag + '...');
        Object.keys(d).sort().forEach((key) => {
            g.pr(`  ${key.padEnd(20)} ${d[key]}`);
        });
    }
    //@+node:felix.20230427003032.42: *4* rst.encode
    // def encode(s: string) -> bytes:
    // """return s converted to an encoded string."""
    // return g.toEncodedString(s, encoding=self.encoding, reportErrors=True)
    //@+node:felix.20230427003032.43: *4* rst.report
    /**
     * Issue a report to the log pane.
     */
    public report(name: string): void {
        if (this.silent) {
            return;
        }
        g.pr(`wrote: ${g.finalize(name)}`);
    }
    //@+node:felix.20230427003032.44: *4* rst.rstComment
    public rstComment(s: string): string {
        return `.. ${s}`;
    }
    //@+node:felix.20230427003032.45: *4* rst.underline
    /**
     * Return the underlining string to be used at the given level for string s.
     * This includes the headline, and possibly a leading overlining line.
     */
    public underline(p: Position, s: string): string {

        // Never add the root's headline.
        if (!s) {
            return '';
        }
        let u: string;
        let level: number;
        let ch: string;
        let n: number;
        const encoded_s = g.toEncodedString(s, this.encoding, false);
        if (this.at_auto_write) {
            // We *might* generate overlines for top-level sections.
            u = this.at_auto_underlines;
            level = p.level() - this.root!.level();
            // This is tricky. The index n depends on several factors.
            if (this.underlines2) {
                level -= 1;  // There *is* a double-underlined section.
                n = level;
            } else {
                n = level - 1;
            }
            if (0 <= n && n < u.length) {
                ch = u[n];
            } else if (u) {
                ch = u[-1];
            } else {
                g.trace('can not happen: no u');
                ch = '#';
            }
            // Write longer underlines for non-ascii characters.
            n = Math.max(4, encoded_s.length);
            if (level === 0 && this.underlines2) {
                // Generate an overline and an underline.
                return `${ch.repeat(n)}\n${p.h}\n${ch.repeat(n)}`;
            }
            // Generate only an underline.
            return `${p.h}\n${ch.repeat(n)}`;
        }
        //
        // The user is responsible for top-level overlining.
        u = this.underline_characters;  //  '''#=+*^~"'`-:><_'''
        level = Math.max(0, p.level() - this.root!.level());
        level = Math.min(level + 1, u.length - 1);  // Reserve the first character for explicit titles.
        ch = u[level];
        n = Math.max(4, encoded_s.length);
        return `${s.trim()}\n${ch.repeat(n)}`;
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
