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
// if TYPE_CHECKING:  # pragma: no cover
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
    public anchor_map: {[key: string]: Position};  // Keys are anchors. Values are positions
    public http_map: {[key: string]: Position};  // Keys are named hyperlink targets.  Value are positions.
    public nodeNumber: number; // Unique node number.

    // For writing.
    public at_auto_underlines: string;  // Full set of underlining characters.
    public at_auto_write: boolean;  // True: in @auto-rst importer.
    public changed_positions: Position[];
    public changed_vnodes: VNode[];  // As a set
    public encoding: string;  // From any @encoding directive.
    public path: string;  // The path from any @path directive.
    public result_list: string[];  // The intermediate results.
    public root: Position| undefined;  // The @rst node being processed.

    // Default settings.
    public default_underline_characters: string;
    public remove_leo_directives: boolean;  // For compatibility with legacy operation.
    public user_filter_b: any;
    public user_filter_h: any;

    public rst3_action: string| undefined;

    public options_pat = /^@ @rst-options/m;
    public default_pat = /^default_path\s*=(.*)$/m;

    // Reporting options.
    public silent: boolean;

    // Http options.
    public http_server_support: boolean;
    public node_begin_marker: string;

    // Output options.
    public default_path: string;
    public generate_rst_header_comment: boolean;
    public remove_leo_directives: boolean;
    public underline_characters: string;
    public write_intermediate_file: boolean;
    public write_intermediate_extension: string;

    // Docutils options.
    public call_docutils: boolean;
    public publish_argv_for_missing_stylesheets: string;
    public stylesheet_embed: boolean;
    public stylesheet_name: string;
    public stylesheet_path: string;


    //@+others
    //@+node:felix.20230427003032.6: *3* rst: Birth
    //@+node:felix.20230427003032.7: *4* rst.__init__
    /** 
     * Ctor for the RstCommand class.
     */
    constructor(c: Commands){
        
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
        this.rst3_action = getString('rst3-action') || 'none'
        if (!['none', 'clone', 'mark'].includes( this.rst3_action.toLowerCase())){
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

        for (const p of c.all_unique_positions()){
            if( g.match_word(p.h, 0, '@rst-preformat')){
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
        if (m1 && m2 && m2.index > m1.index) {
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
    public rst3(): number{
        
        const t1 = process.hrtime();
        this.n_intermediate = 0;
        this.n_docutils = 0;
        this.processTopTree(this.c.p);
        const t2 = process.hrtime();
        g.es_print(
            `rst3: wrote...\n` +
            `${this.n_intermediate.toString().padStart(4)} intermediate file${g.plural(this.n_intermediate)}\n` +
            `${this.n_docutils.toString().padStart(4)} docutils file${g.plural(this.n_docutils)}\n` +
            `in ${utils.getDurationSeconds(t1, t2)} sec.`)
        return this.n_intermediate

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
        if (action === 'none' || !positions || !positions.length){
            return;
        }
        if (action === 'mark'){
            g.es_print(`action: marked ${n} node${g.plural(n)}`);
            for (const p of positions){
                p.setMarked();
            }
            c.redraw();
        }else if( action === 'clone'){
            g.es_print(`action: cloned ${n} node${g.plural(n)}`);
            const organizer = this.clone_action_nodes();
            c.redraw(organizer);
        }else{
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
        organizer = c.lastTopLevel().insertAfter();
        organizer.h = `Cloned ${n} changed @rst node${g.plural(n)}`;
        organizer.b = '';
        // Clone nodes as children of the organizer node.
        for (const p of positions){
            const p2 = p.copy();
            n = organizer.numberOfChildren();
            p2._linkCopiedAsNthChild(organizer, n);
        }

        return organizer;

    }
    //@+node:felix.20230427003032.16: *5* rst.processTopTree
    def processTopTree(self, p: Position) -> None:
        """Call processTree for @rst and @slides node p's subtree or p's ancestors."""

        def predicate(p: Position) -> bool:
            return self.is_rst_node(p) or g.match_word(p.h, 0, '@slides')

        self.changed_positions = []
        self.changed_vnodes = set()
        roots = g.findRootsWithPredicate(self.c, p, predicate=predicate)
        if roots:
            for p in roots:
                self.processTree(p)
            self.do_actions()
        else:
            g.warning('No @rst or @slides nodes in', p.h)
    //@+node:felix.20230427003032.17: *5* rst.processTree
    def processTree(self, root: Position) -> None:
        """Process all @rst nodes in a tree."""
        for p in root.self_and_subtree():
            if self.is_rst_node(p):
                if self.in_rst_tree(p):
                    g.trace(f"ignoring nested @rst node: {p.h}")
                else:
                    p.h = p.h.strip()
                    fn = p.h[4:].strip()
                    if fn:
                        source = self.write_rst_tree(p, fn)
                        self.write_docutils_files(fn, p, source)
            elif g.match_word(p.h, 0, "@slides"):
                if self.in_slides_tree(p):
                    g.trace(f"ignoring nested @slides node: {p.h}")
                else:
                    self.write_slides(p)

    //@+node:felix.20230427003032.18: *5* rst.write_rst_tree (sets self.root)
    def write_rst_tree(self, p: Position, fn: str) -> str:
        """Convert p's tree to rst sources."""
        c = self.c
        self.root = p.copy()
        #
        # Init encoding and path.
        d = c.scanAllDirectives(p)
        self.encoding = d.get('encoding') or 'utf-8'
        self.path = d.get('path') or ''
        # Write the output to self.result_list.
        self.result_list = []  # All output goes here.
        if self.generate_rst_header_comment:
            self.result_list.append(f".. rst3: filename: {fn}")
        for p in self.root.self_and_subtree():
            self.writeNode(p)
        source = self.compute_result()
        return source

    //@+node:felix.20230427003032.19: *5* rst.write_slides & helper
    def write_slides(self, p: Position) -> None:
        """Convert p's children to slides."""
        c = self.c
        p = p.copy()
        h = p.h
        i = g.skip_id(h, 1)  # Skip the '@'
        kind, fn = h[:i].strip(), h[i:].strip()
        if not fn:
            g.error(f"{kind} requires file name")
            return
        title = p.firstChild().h if p and p.firstChild() else '<no slide>'
        title = title.strip().capitalize()
        n_tot = p.numberOfChildren()
        n = 1
        d = c.scanAllDirectives(p)
        self.encoding = d.get('encoding') or 'utf-8'
        self.path = d.get('path') or ''
        for child in p.children():
            # Compute the slide's file name.
            fn2, ext = g.os_path_splitext(fn)
            fn2 = f"{fn2}-{n:03d}{ext}"  # Use leading zeros for :glob:.
            n += 1
            # Write the rst sources.
            self.result_list = []
            self.writeSlideTitle(title, n - 1, n_tot)
            self.result_list.append(child.b)
            source = self.compute_result()
            self.write_docutils_files(fn2, p, source)
    //@+node:felix.20230427003032.20: *6* rst.writeSlideTitle
    def writeSlideTitle(self, title: str, n: int, n_tot: int) -> None:
        """Write the title, underlined with the '#' character."""
        if n != 1:
            title = f"{title} ({n} of {n_tot})"
        width = max(4, len(g.toEncodedString(title,
            encoding=self.encoding, reportErrors=False)))
        self.result_list.append(f"{title}\n{'#' * width}")
    //@+node:felix.20230427003032.21: *5* rst.writeNode & helper
    def writeNode(self, p: Position) -> None:
        """Append the rst sources to self.result_list."""
        c = self.c
        if self.is_ignore_node(p) or self.in_ignore_tree(p):
            return
        if g.match_word(p.h, 0, '@rst-no-head'):
            self.result_list.append(self.filter_b(c, p))
        else:
            self.http_addNodeMarker(p)
            if p != self.root:
                self.result_list.append(self.underline(p, self.filter_h(c, p)))
            self.result_list.append(self.filter_b(c, p))
    //@+node:felix.20230427003032.22: *6* rst.http_addNodeMarker
    def http_addNodeMarker(self, p: Position) -> None:
        """
        Add a node marker for the mod_http plugin (HtmlParserClass class).

        The first three elements are a stack of tags, the rest is html code::

            [
                <tag n start>, <tag n end>, <other stack elements>,
                <html line 1>, <html line 2>, ...
            ]

        <other stack elements> has the same structure::

            [<tag n-1 start>, <tag n-1 end>, <other stack elements>]
        """
        if self.http_server_support:
            self.nodeNumber += 1
            anchorname = f"{self.node_begin_marker}{self.nodeNumber}"
            self.result_list.append(f".. _{anchorname}:")
            self.http_map[anchorname] = p.copy()
    //@+node:felix.20230427003032.23: *4* rst.write_docutils_files & helpers
    def write_docutils_files(self, fn: str, p: Position, source: str) -> None:
        """Write source to the intermediate file and write the output from docutils.."""
        assert p == self.root, (repr(p), repr(self.root))
        junk, ext = g.os_path_splitext(fn)
        ext = ext.lower()
        fn = self.computeOutputFileName(fn)
        ok = self.createDirectoryForFile(fn)
        if not ok:
            return
        # Write the intermediate file.
        if self.write_intermediate_file:
            self.writeIntermediateFile(fn, source)
        # Should we call docutils?
        if not self.call_docutils:
            return
        if ext not in ('.htm', '.html', '.tex', '.pdf', '.s5', '.odt'):  # #1884: test now.
            return
        # Write the result from docutils.
        s = self.writeToDocutils(source, ext)
        if s and ext in ('.html', '.htm'):
            s = self.addTitleToHtml(s)
        if not s:
            return
        changed = g.write_file_if_changed(fn, s, encoding='utf-8')
        if changed:
            self.n_docutils += 1
            self.report(fn)
            if self.root.v not in self.changed_vnodes:
                self.changed_positions.append(self.root.copy())
                self.changed_vnodes.add(self.root.v)
    //@+node:felix.20230427003032.24: *5* rst.addTitleToHtml
    def addTitleToHtml(self, s: str) -> str:
        """
        Replace an empty <title> element by the contents of the first <h1>
        element.
        """
        i = s.find('<title></title>')
        if i == -1:
            return s
        m = re.search(r'<h1>([^<]*)</h1>', s)
        if not m:
            m = re.search(r'<h1><[^>]+>([^<]*)</a></h1>', s)
        if m:
            s = s.replace('<title></title>',
                f"<title>{m.group(1)}</title>")
        return s
    //@+node:felix.20230427003032.25: *5* rst.computeOutputFileName
    def computeOutputFileName(self, fn: str) -> str:
        """Return the full path to the output file."""
        c = self.c
        openDirectory = c.frame.openDirectory
        if self.default_path:
            path = g.finalize_join(self.path, self.default_path, fn)
        elif self.path:
            path = g.finalize_join(self.path, fn)
        elif openDirectory:
            path = g.finalize_join(self.path, openDirectory, fn)
        else:
            path = g.finalize_join(fn)
        return path
    //@+node:felix.20230427003032.26: *5* rst.createDirectoryForFile
    def createDirectoryForFile(self, fn: str) -> bool:
        """
        Create the directory for fn if
        a) it doesn't exist and
        b) the user options allow it.

        Return True if the directory existed or was made.
        """
        c = self.c
        theDir, junk = g.os_path_split(fn)
        theDir = g.finalize(theDir)
        if g.os_path_exists(theDir):
            return True
        if c and c.config and c.config.getBool('create-nonexistent-directories', default=False):
            theDir = c.expand_path_expression(theDir)
            ok: str = g.makeAllNonExistentDirectories(theDir)
            if not ok:
                g.error('did not create:', theDir)
            return bool(ok)
        return False  # Does not exist and wasn't made.
    //@+node:felix.20230427003032.27: *5* rst.writeIntermediateFile
    def writeIntermediateFile(self, fn: str, s: str) -> bool:
        """
        Write s to to the file whose name is fn.

        New in Leo 6.7.2: write the file only if:
        a: it does not exist or
        b: the write would actually change the file.
        """
        ext = self.write_intermediate_extension
        if not ext.startswith('.'):
            ext = '.' + ext
        fn = fn + ext
        changed = g.write_file_if_changed(fn, s, encoding=self.encoding)
        if changed:
            self.n_intermediate += 1
            self.report(fn)
            if self.root.v not in self.changed_vnodes:
                self.changed_positions.append(self.root.copy())
                self.changed_vnodes.add(self.root.v)
        return changed
    //@+node:felix.20230427003032.28: *5* rst.writeToDocutils & helper
    def writeToDocutils(self, s: str, ext: str) -> Optional[str]:
        """Send s to docutils using the writer implied by ext and return the result."""
        if not docutils:
            g.error('writeToDocutils: docutils not present')
            return None
        join = g.finalize_join
        openDirectory = self.c.frame.openDirectory
        overrides = {'output_encoding': self.encoding}
        #
        # Compute the args list if the stylesheet path does not exist.
        styleSheetArgsDict = self.handleMissingStyleSheetArgs()
        if ext == '.pdf':
            module = g.import_module('leo.plugins.leo_pdf')
            if not module:
                return None
            writer = module.Writer()  # Get an instance.
            writer_name = None
        else:
            writer = None
            for ext2, writer_name in (  # noqa: writer_name used below.
                ('.html', 'html'),
                ('.htm', 'html'),
                ('.tex', 'latex'),
                ('.pdf', 'leo.plugins.leo_pdf'),
                ('.s5', 's5'),
                ('.odt', 'odt'),
            ):
                if ext2 == ext:
                    break
            else:
                g.error(f"unknown docutils extension: {ext}")
                return None
        #
        # Make the stylesheet path relative to open directory.
        rel_stylesheet_path = self.stylesheet_path or ''
        stylesheet_path = join(openDirectory, rel_stylesheet_path)
        assert self.stylesheet_name
        path = join(self.stylesheet_path, self.stylesheet_name)
        if not self.stylesheet_embed:
            rel_path = join(rel_stylesheet_path, self.stylesheet_name)
            rel_path = rel_path.replace('\\', '/')
            overrides['stylesheet'] = rel_path
            overrides['stylesheet_path'] = None
            overrides['embed_stylesheet'] = None
        elif os.path.exists(path):
            if ext != '.pdf':
                overrides['stylesheet'] = path
                overrides['stylesheet_path'] = None
        elif styleSheetArgsDict:
            g.es_print('using publish_argv_for_missing_stylesheets', styleSheetArgsDict)
            overrides.update(styleSheetArgsDict)  # MWC add args to settings
        elif rel_stylesheet_path == stylesheet_path:
            g.error(f"stylesheet not found: {path}")
        else:
            g.error('stylesheet not found\n', path)
            if self.path:
                g.es_print('@path:', self.path)
            g.es_print('open path:', openDirectory)
            if rel_stylesheet_path:
                g.es_print('relative path:', rel_stylesheet_path)
        try:
            result = None
            result = docutils.core.publish_string(source=s,
                    reader_name='standalone',
                    parser_name='restructuredtext',
                    writer=writer,
                    writer_name=writer_name,
                    settings_overrides=overrides)
            if isinstance(result, bytes):
                result = g.toUnicode(result)
        except docutils.ApplicationError as error:
            g.error('Docutils error:')
            g.blue(error)
        except Exception:
            g.es_print('Unexpected docutils exception')
            g.es_exception()
        return result
    //@+node:felix.20230427003032.29: *6* rst.handleMissingStyleSheetArgs
    def handleMissingStyleSheetArgs(self, s: str = None) -> Dict[str, str]:
        """
        Parse the publish_argv_for_missing_stylesheets option,
        returning a dict containing the parsed args.
        """
        if 0:
            # See http://docutils.sourceforge.net/docs/user/config.html#documentclass
            return {
                'documentclass': 'report',
                'documentoptions': 'english,12pt,lettersize',
            }
        if not s:
            s = self.publish_argv_for_missing_stylesheets
        if not s:
            return {}
        #
        # Handle argument lists such as this:
        # --language=en,--documentclass=report,--documentoptions=[english,12pt,lettersize]
        d = {}
        while s:
            s = s.strip()
            if not s.startswith('--'):
                break
            s = s[2:].strip()
            eq = s.find('=')
            cm = s.find(',')
            if eq == -1 or (-1 < cm < eq):  # key[nl] or key,
                val = ''
                cm = s.find(',')
                if cm == -1:
                    key = s.strip()
                    s = ''
                else:
                    key = s[:cm].strip()
                    s = s[cm + 1 :].strip()
            else:  # key = val
                key = s[:eq].strip()
                s = s[eq + 1 :].strip()
                if s.startswith('['):  # [...]
                    rb = s.find(']')
                    if rb == -1:
                        break  # Bad argument.
                    val = s[: rb + 1]
                    s = s[rb + 1 :].strip()
                    if s.startswith(','):
                        s = s[1:].strip()
                else:  # val[nl] or val,
                    cm = s.find(',')
                    if cm == -1:
                        val = s
                        s = ''
                    else:
                        val = s[:cm].strip()
                        s = s[cm + 1 :].strip()
            if not key:
                break
            if not val.strip():
                val = '1'
            d[str(key)] = str(val)
        return d
    //@+node:felix.20230427003032.30: *4* rst.writeAtAutoFile & helpers
    def writeAtAutoFile(self, p: Position, fileName: str, outputFile: Any) -> bool:
        """
        at.writeAtAutoContents calls this method to write an @auto tree
        containing imported rST code.

        at.writeAtAutoContents will close the output file.
        """
        self.result_list = []
        self.initAtAutoWrite(p)
        self.root = p.copy()
        after = p.nodeAfterTree()
        if not self.isSafeWrite(p):
            return False
        try:
            self.at_auto_write = True  # Set the flag for underline.
            p = p.firstChild()  # A hack: ignore the root node.
            while p and p != after:
                self.writeNode(p)  # side effect: advances p
            s = self.compute_result()
            outputFile.write(s)
            ok = True
        except Exception:
            ok = False
        finally:
            self.at_auto_write = False
        return ok
    //@+node:felix.20230427003032.31: *5* rst.initAtAutoWrite
    def initAtAutoWrite(self, p: Position) -> None:
        """Init underlining for for an @auto write."""
        # User-defined underlining characters make no sense in @auto-rst.
        d = p.v.u.get('rst-import', {})
        underlines2 = d.get('underlines2', '')
        #
        # Do *not* set a default for overlining characters.
        if len(underlines2) > 1:
            underlines2 = underlines2[0]
            g.warning(f"too many top-level underlines, using {underlines2}")
        underlines1 = d.get('underlines1', '')
        #
        # Pad underlines with default characters.
        default_underlines = '=+*^~"\'`-:><_'
        if underlines1:
            for ch in default_underlines[1:]:
                if ch not in underlines1:
                    underlines1 = underlines1 + ch
        else:
            underlines1 = default_underlines
        self.at_auto_underlines = underlines2 + underlines1
        self.underlines1 = underlines1
        self.underlines2 = underlines2
    //@+node:felix.20230427003032.32: *5* rst.isSafeWrite
    def isSafeWrite(self, p: Position) -> bool:
        """
        Return True if node p contributes nothing but
        rst-options to the write.
        """
        lines = g.splitLines(p.b)
        for z in lines:
            if z.strip() and not z.startswith('@') and not z.startswith('.. '):
                # A real line that will not be written.
                g.error('unsafe @auto-rst')
                g.es('body text will be ignored in\n', p.h)
                return False
        return True
    //@+node:felix.20230427003032.33: *4* rst.writeNodeToString
    def writeNodeToString(self, p: Position) -> str:
        """
        rst.writeNodeToString: A utility for scripts. Not used in Leo.

        Write p's tree to a string as if it were an @rst node.
        Return the string.
        """
        return self.write_rst_tree(p, fn=p.h)
    //@+node:felix.20230427003032.34: *3* rst: Filters
    //@+node:felix.20230427003032.35: *4* rst.filter_b
    def filter_b(self, c: Cmdr, p: Position) -> str:
        """
        Filter p.b with user_filter_b function.
        Don't allow filtering when in the @auto-rst logic.
        """
        if self.user_filter_b and not self.at_auto_write:
            try:
                return self.user_filter_b(c, p)
            except Exception:
                g.es_exception()
                self.user_filter_b = None
                return p.b
        if self.remove_leo_directives:
            # Only remove a few directives, and only if they start the line.
            return ''.join([
                z for z in g.splitLines(p.b)
                    if not z.startswith(('@language ', '@others', '@wrap'))
            ])
        return p.b

    //@+node:felix.20230427003032.36: *4* rst.filter_h
    def filter_h(self, c: Cmdr, p: Position) -> str:
        """
        Filter p.h with user_filter_h function.
        Don't allow filtering when in the @auto-rst logic.
        """
        if self.user_filter_h and not self.at_auto_write:
            try:
                # pylint: disable=not-callable
                return self.user_filter_h(c, p)
            except Exception:
                g.es_exception()
                self.user_filter_h = None
        return p.h
    //@+node:felix.20230427003032.37: *4* rst.register_*_filter
    def register_body_filter(self, f: Callable) -> None:
        """Register the user body filter."""
        self.user_filter_b = f

    def register_headline_filter(self, f: Callable) -> None:
        """Register the user headline filter."""
        self.user_filter_h = f
    //@+node:felix.20230427003032.38: *3* rst: Predicates
    def in_ignore_tree(self, p: Position) -> bool:
        return any(g.match_word(p2.h, 0, '@rst-ignore-tree')
            for p2 in self.rst_parents(p))

    def in_rst_tree(self, p: Position) -> bool:
        return any(self.is_rst_node(p2) for p2 in self.rst_parents(p))

    def in_slides_tree(self, p: Position) -> bool:
        return any(g.match_word(p.h, 0, "@slides") for p2 in self.rst_parents(p))

    def is_ignore_node(self, p: Position) -> bool:
        return g.match_words(p.h, 0, ('@rst-ignore', '@rst-ignore-node'))

    def is_rst_node(self, p: Position) -> bool:
        return g.match_word(p.h, 0, "@rst") and not g.match(p.h, 0, "@rst-")

    def rst_parents(self, p: Position) -> Generator:
        for p2 in p.parents():
            if p2 == self.root:
                return
            yield p2
    //@+node:felix.20230427003032.39: *3* rst: Utils
    //@+node:felix.20230427003032.40: *4* rst.compute_result
    def compute_result(self) -> str:
        """Concatenate all strings in self.result, ensuring exactly one blank line between strings."""
        return ''.join(f"{s.rstrip()}\n\n" for s in self.result_list if s.strip())
    //@+node:felix.20230427003032.41: *4* rst.dumpDict
    def dumpDict(self, d: Dict[str, str], tag: str) -> None:
        """Dump the given settings dict."""
        g.pr(tag + '...')
        for key in sorted(d):
            g.pr(f"  {key:20} {d.get(key)}")
    //@+node:felix.20230427003032.42: *4* rst.encode
    # def encode(self, s: str) -> bytes:
        # """return s converted to an encoded string."""
        # return g.toEncodedString(s, encoding=self.encoding, reportErrors=True)
    //@+node:felix.20230427003032.43: *4* rst.report
    def report(self, name: str) -> None:
        """Issue a report to the log pane."""
        if self.silent:
            return
        g.pr(f"wrote: {g.finalize(name)}")
    //@+node:felix.20230427003032.44: *4* rst.rstComment
    def rstComment(self, s: str) -> str:
        return f".. {s}"
    //@+node:felix.20230427003032.45: *4* rst.underline
    def underline(self, p: Position, s: str) -> str:
        """
        Return the underlining string to be used at the given level for string s.
        This includes the headline, and possibly a leading overlining line.
        """
        # Never add the root's headline.
        if not s:
            return ''
        encoded_s = g.toEncodedString(s, encoding=self.encoding, reportErrors=False)
        if self.at_auto_write:
            # We *might* generate overlines for top-level sections.
            u = self.at_auto_underlines
            level = p.level() - self.root.level()
            # This is tricky. The index n depends on several factors.
            if self.underlines2:
                level -= 1  # There *is* a double-underlined section.
                n = level
            else:
                n = level - 1
            if 0 <= n < len(u):
                ch = u[n]
            elif u:
                ch = u[-1]
            else:
                g.trace('can not happen: no u')
                ch = '#'
            # Write longer underlines for non-ascii characters.
            n = max(4, len(encoded_s))
            if level == 0 and self.underlines2:
                # Generate an overline and an underline.
                return f"{ch * n}\n{p.h}\n{ch * n}"
            # Generate only an underline.
            return f"{p.h}\n{ch * n}"
        #
        # The user is responsible for top-level overlining.
        u = self.underline_characters  #  '''#=+*^~"'`-:><_'''
        level = max(0, p.level() - self.root.level())
        level = min(level + 1, len(u) - 1)  # Reserve the first character for explicit titles.
        ch = u[level]
        n = max(4, len(encoded_s))
        return f"{s.strip()}\n{ch * n}"
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
