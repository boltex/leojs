//@+leo-ver=5-thin
//@+node:ekr.20190515070742.1: * @file src/core/leoMarkup.ts
/**
 * Supports @adoc, @pandoc and @sphinx nodes and related commands.
 */
//@+<< leoMarkup imports & annotations >>
//@+node:ekr.20190515070742.3: ** << leoMarkup imports & annotations >>
import * as utils from '../utils';
import * as g from './leoGlobals';
import { command } from './decorators';
import { Commands } from './leoCommands';
import { Position } from './leoNodes';

process.hrtime = require('browser-process-hrtime'); // Overwrite 'hrtime' of process
// Abbreviation.
// StringIO = io.StringIO
type File_List = string[] | undefined;
//@-<< leoMarkup imports & annotations >>

export let asciidoctor_exec = "";
export let asciidoc3_exec = "";
export let pandoc_exec = "";
export let sphinx_build = "";
export let globalMarkupInitPromise: Promise<unknown> | undefined;
//@+others
//@+node:ekr.20191006153522.1: ** class TopLevelMarkupCommands
export class TopLevelMarkupCommands {
    //@+others
    //@+node:ekr.20190515070742.22: *3* @g.command: 'adoc' & 'adoc-with-preview')
    @command(
        'adoc',
        'The adoc command writes all @adoc nodes in the selected tree'
    )
    public adoc_command(this: Commands, verbose: true): Promise<File_List> {
        //@+<< adoc command docstring >>
        //@+node:ekr.20190515115100.1: *4* << adoc command docstring >>
        /*
        The adoc command writes all @adoc nodes in the selected tree to the
        files given in each @doc node. If no @adoc nodes are found, the
        command looks up the tree.

        Each @adoc node should have the form: `@adoc x.adoc`. Relative file names
        are relative to the base directory.  See below.

        By default, the adoc command creates AsciiDoctor headings from Leo
        headlines. However, the following kinds of nodes are treated differently:

        - @ignore-tree: Ignore the node and its descendants.
        - @ignore-node: Ignore the node.
        - @no-head:     Ignore the headline. Do not generate a heading.

        After running the adoc command, use the asciidoctor tool to convert the
        x.adoc files to x.html.

        Settings
        --------

        AciiDoctor markup provides many settings, including::

            = Title
            :stylesdir: mystylesheets/
            :stylesheet: mystyles.css

        These can also be specified on the command line::

            asciidoctor -a stylesdir=mystylesheets/ -a stylesheet=mystyles.css

        @string adoc-base-directory specifies the base for relative file names.
        The default is c.frame.openDirectory

        Scripting interface
        -------------------

        Scripts may invoke the adoc command as follows::

            event = g.Bunch(base_directory=my_directory, p=some_node)
            c.markupCommands.adoc_command(event=event)

        This @button node runs the adoc command and coverts all results to .html::

            import os
            paths = c.markupCommands.adoc_command(event=g.Bunch(p=p))
            paths = [z.replace('/', os.path.sep) for z in paths]
            input_paths = ' '.join(paths)
            g.execute_shell_commands(['asciidoctor %s' % input_paths])

        */
        //@-<< adoc command docstring >>
        const c: Commands = this;
        if (!c) {
            return Promise.resolve(undefined);
        }
        return c.markupCommands.adoc_command(false, verbose);
    }

    @command(
        'adoc-with-preview',
        'Run the adoc command, then show the result in the browser.'
    )
    public adoc_with_preview_command(this: Commands, verbose: true): Promise<File_List> {
        const c: Commands = this;
        if (!c) {
            return Promise.resolve(undefined);
        }
        return c.markupCommands.adoc_command(true, verbose);
    }
    //@+node:ekr.20191006153411.1: *3* @g.command: 'pandoc' & 'pandoc-with-preview'
    @command(
        'pandoc',
        'The pandoc command writes all @pandoc nodes in the selected tree'
    )
    public pandoc_command(this: Commands, verbose = true): Promise<File_List> {
        //@+<< pandoc command docstring >>
        //@+node:ekr.20191006153547.1: *4* << pandoc command docstring >>
        /*
        The pandoc command writes all @pandoc nodes in the selected tree to the
        files given in each @pandoc node. If no @pandoc nodes are found, the
        command looks up the tree.

        Each @pandoc node should have the form: `@pandoc x.adoc`. Relative file names
        are relative to the base directory.  See below.

        By default, the pandoc command creates AsciiDoctor headings from Leo
        headlines. However, the following kinds of nodes are treated differently:

        - @ignore-tree: Ignore the node and its descendants.
        - @ignore-node: Ignore the node.
        - @no-head:     Ignore the headline. Do not generate a heading.

        After running the pandoc command, use the pandoc tool to convert the x.adoc
        files to x.html.

        Settings
        --------

        @string pandoc-base-directory specifies the base for relative file names.
        The default is c.frame.openDirectory

        Scripting interface
        -------------------

        Scripts may invoke the adoc command as follows::

            event = g.Bunch(base_directory=my_directory, p=some_node)
            c.markupCommands.pandoc_command(event=event)

        This @button node runs the adoc command and coverts all results to .html::

            import os
            paths = c.markupCommands.pandoc_command(event=g.Bunch(p=p))
            paths = [z.replace('/', os.path.sep) for z in paths]
            input_paths = ' '.join(paths)
            g.execute_shell_commands(['asciidoctor %s' % input_paths])

        */
        //@-<< pandoc command docstring >>
        const c: Commands = this;
        if (!c) {
            return Promise.resolve(undefined);
        }
        return c.markupCommands.pandoc_command(undefined, verbose);
    }

    @command(
        'pandoc-with-preview',
        'Run the pandoc command, then show the result in the browser.'
    )
    public pandoc_with_preview_command(
        this: Commands, verbose = true,
    ): Promise<File_List> {
        const c: Commands = this;
        if (!c) {
            return Promise.resolve(undefined);
        }
        return c.markupCommands.pandoc_command(true, verbose);

    }
    //@+node:ekr.20191017163422.1: *3* @g.command: 'sphinx' & 'sphinx-with-preview'
    @command(
        'sphinx',
        'The sphinx command writes all @sphinx nodes in the selected tree'
    )
    public sphinx_command(this: Commands, verbose = true): Promise<File_List> {
        //@+<< sphinx command docstring >>
        //@+node:ekr.20191017163422.2: *4* << sphinx command docstring >>
        /*
        The sphinx command writes all @sphinx nodes in the selected tree to the
        files given in each @sphinx node. If no @sphinx nodes are found, the
        command looks up the tree.

        Each @sphinx node should have the form: `@sphinx x`. Relative file names
        are relative to the base directory.  See below.

        By default, the sphinx command creates Sphinx headings from Leo headlines.
        However, the following kinds of nodes are treated differently:

        - @ignore-tree: Ignore the node and its descendants.
        - @ignore-node: Ignore the node.
        - @no-head:     Ignore the headline. Do not generate a heading.

        After running the sphinx command, use the sphinx tool to convert the
        output files to x.html.

        Settings
        --------

        @string sphinx-base-directory specifies the base for relative file names.
        The default is c.frame.openDirectory

        Scripting interface
        -------------------

        Scripts may invoke the sphinx command as follows::

            event = g.Bunch(base_directory=my_directory, p=some_node)
            c.markupCommands.sphinx_command(event=event)

        This @button node runs the sphinx command and coverts all results to .html::

            import os
            paths = c.markupCommands.sphinx_command(event=g.Bunch(p=p))
            paths = [z.replace('/', os.path.sep) for z in paths]
            input_paths = ' '.join(paths)
            g.execute_shell_commands(['asciidoctor %s' % input_paths])

        */
        //@-<< sphinx command docstring >>
        const c: Commands = this;
        if (!c) {
            return Promise.resolve(undefined);
        }
        return c.markupCommands.sphinx_command(undefined, verbose);
    }

    @command(
        'sphinx-with-preview',
        'Run the sphinx command, then show the result in the browser.'
    )
    public sphinx_with_preview_command(
        this: Commands, verbose = true,
    ): Promise<File_List> {
        const c: Commands = this;
        if (!c) {
            return Promise.resolve(undefined);
        }
        return c.markupCommands.sphinx_command(true, verbose);
    }
    //@-others
}
//@+node:ekr.20191006154236.1: ** class MarkupCommands
/**
 * A class to write AsiiDoctor or docutils markup in Leo outlines.
 */
export class MarkupCommands {

    public c: Commands;
    public kind: string | undefined;
    public level_offset: number;
    public root_level: number;
    public sphinx_command_dir: string | undefined;
    public sphinx_default_command: string | undefined;
    public sphinx_input_dir: string | undefined;
    public sphinx_output_dir: string | undefined;
    public adoc_pattern = /^@(adoc|asciidoctor)/;
    public adoc_title_pat = /^= /;
    public pandoc_title_pat = /^= /;
    public output_file: string = "";
    public markupInitPromise: Promise<unknown>;

    constructor(c: Commands) {
        this.c = c;
        this.kind = undefined;  // 'adoc' or 'pandoc'
        this.level_offset = 0;
        this.root_level = 0;
        this.reload_settings();
        if (globalMarkupInitPromise == null) {
            globalMarkupInitPromise = Promise.all([
                g.isExecutableInPath('asciidoctor').then((p_path) => { asciidoctor_exec = p_path; }),
                g.isExecutableInPath('asciidoc3').then((p_path) => { asciidoc3_exec = p_path; }),
                g.isExecutableInPath('pandoc').then((p_path) => { pandoc_exec = p_path; }),
                g.isExecutableInPath('sphinx-build').then((p_path) => { sphinx_build = p_path; })
            ]);
            this.markupInitPromise = globalMarkupInitPromise;
        } else {
            this.markupInitPromise = globalMarkupInitPromise;
        }
    }

    public reload_settings(): void {
        const c = this.c;
        const getString = c.config.getString.bind(c.config);
        this.sphinx_command_dir = getString('sphinx-command-directory');
        this.sphinx_default_command = getString('sphinx-default-command');
        this.sphinx_input_dir = getString('sphinx-input-directory');
        this.sphinx_output_dir = getString('sphinx-output-directory');
    }

    //@+others
    //@+node:ekr.20191006153233.1: *3* markup.command_helper & helpers
    public async command_helper(
        kind: string, preview: boolean, verbose: boolean,
    ): Promise<string[] | undefined> {

        const predicate = (p: Position): boolean => {
            return !!this.filename(p);
        };

        // Find all roots.
        const t1 = process.hrtime();
        const c = this.c;
        this.kind = kind;
        // p = event.p if event and hasattr(event, 'p') else c.p
        const p = c.p;
        const roots = g.findRootsWithPredicate(c, p, predicate);
        if (!roots) {
            g.warning('No @adoc nodes in', p.h);
            return [];
        }
        // Write each root to a file.
        const i_paths: string[] = [];
        for (const p of roots) {
            let i_path;
            try {
                i_path = this.filename(p);
                // #1398.
                i_path = c.expand_path_expression(i_path);
                const n_path = c.getPath(c.p);  // node path
                i_path = g.finalize_join(n_path, i_path);

                this.output_file = ""; // RESET output_file.
                // with open(i_path, 'w', encoding = 'utf-8', errors = 'replace') as this.output_file:
                this.write_root(p);
                await g.writeFile(this.output_file, 'utf-8', i_path);
                i_paths.push(i_path);

            } catch (e) {
                g.es_print(`Unexpected exception opening ${i_path}`);
                g.es_exception(e);
            }
        }
        // Convert each file to html.
        const o_paths = [];
        for (const i_path of i_paths) {
            const o_path = this.compute_opath(i_path);
            o_paths.push(o_path);
            if (kind === 'adoc') {
                await this.run_asciidoctor(i_path, o_path);
            } else if (kind === 'pandoc') {
                await this.run_pandoc(i_path, o_path);
            } else if (kind === 'sphinx') {
                await this.run_sphinx(i_path, o_path);
            } else {
                g.trace('BAD KIND');
                return undefined;
            }
            if (kind !== 'sphinx') {
                console.log(`${kind}: wrote ${o_path}`);
            }
        }

        if (preview) {
            if (kind === 'sphinx') {
                g.es_print('preview not available for sphinx');
            } else {
                // open .html files in the default browser.
                await g.execute_shell_commands(o_paths);
            }
        }

        const t2 = process.hrtime();

        if (verbose) {
            const n = i_paths.length;
            g.es_print(
                `${kind}: wrote ${n} file${g.plural(n)} ` +
                `in ${utils.getDurationSeconds(t1, t2)} sec.`);
        }
        return i_paths;
    }
    //@+node:ekr.20190515084219.1: *4* markup.filename
    /**
     * Return the filename of the @adoc, @pandoc or @sphinx node, or None.
     */
    public filename(p: Position): string | undefined {

        const kind = this.kind;
        const h = p.h.trimEnd();
        if (kind === 'adoc') {
            const m = h.match(this.adoc_pattern);
            if (m && m.length) {
                const prefix = m[1];
                return h.substring(1 + prefix.length).trim();
            }
            return undefined;
        }

        if (kind && ['pandoc', 'sphinx'].includes(kind)) {
            const prefix = `@${kind}`;
            if (g.match_word(h, 0, prefix)) {
                return h.substring(prefix.length).trim();
            }
            return undefined;
        }
        g.trace('BAD KIND', kind);
        return undefined;
    }
    //@+node:ekr.20191007053522.1: *4* markup.compute_opath
    /**
     * Neither asciidoctor nor pandoc handles extra extensions well.
     */
    public compute_opath(i_path: string): string {

        const c = this.c;
        let ext;
        for (let _i = 0; _i < 3; _i++) {
            [i_path, ext] = g.os_path_splitext(i_path);
            if (!ext) {
                break;
            }
        }
        // #1373.
        const base_dir = g.os_path_dirname(c.fileName());
        return g.finalize_join(base_dir, i_path + '.html');

    }
    //@+node:ekr.20191007043110.1: *4* markup.run_asciidoctor
    /**
     * Process the input file given by i_path with asciidoctor or asciidoc3.
     */
    public async run_asciidoctor(i_path: string, o_path: string): Promise<void> {

        // global asciidoctor_exec, asciidoc3_exec
        // assert asciidoctor_exec or asciidoc3_exec, g.callers()
        // Call the external program to write the output file.
        // The -e option deletes css.
        await this.markupInitPromise;
        if (asciidoctor_exec || asciidoc3_exec) {
            const prog = asciidoctor_exec ? 'asciidoctor' : 'asciidoc3';
            const command = `${prog} ${i_path} -o ${o_path} -b html5`;
            await g.execute_shell_commands(command);
        } else {
            g.es('Error: No Executable for asciidoctor_exec');
        }
    }
    //@+node:ekr.20191007043043.1: *4* markup.run_pandoc
    /**
     * Process the input file given by i_path with pandoc.
     */
    public async run_pandoc(i_path: string, o_path: string): Promise<void> {

        // global pandoc_exec
        // assert pandoc_exec, g.callers()
        // Call pandoc to write the output file.
        // --quiet does no harm.
        await this.markupInitPromise;
        if (pandoc_exec) {
            const command = `pandoc ${i_path} -t html5 -o ${o_path}`;
            await g.execute_shell_commands(command);
        } else {
            g.es('Error: No Executable for run_pandoc');
        }
    }
    //@+node:ekr.20191017165427.1: *4* markup.run_sphinx
    /**
     * Process i_path and o_path with sphinx.
     */
    public async run_sphinx(i_path: string, o_path: string): Promise<void> {

        const trace = true;
        // cd to the command directory, or i_path's directory.
        const command_dir = g.finalize(this.sphinx_command_dir || g.os_path_dirname(i_path));
        let exist = await g.os_path_exists(command_dir);
        if (exist) {
            if (trace) {
                g.trace(`\nos.chdir: ${command_dir}`);
            }
            await g.chdir(command_dir);
        } else {
            g.error(`command directory not found: ${command_dir}`);
            return;
        }
        //
        // If a default command exists, just call it.
        // The user is responsible for making everything work.
        if (this.sphinx_default_command) {
            if (trace) {
                g.trace(`\ncommand: ${this.sphinx_default_command}\n`);
            }
            await g.execute_shell_commands(this.sphinx_default_command);
            return;
        }

        // Compute the input directory.
        const input_dir = g.finalize(
            this.sphinx_input_dir || g.os_path_dirname(i_path));

        exist = await g.os_path_exists(input_dir);
        if (!exist) {
            g.error(`input directory not found: ${input_dir}`);
            return;
        }
        // Compute the output directory.
        const output_dir = g.finalize(this.sphinx_output_dir || g.os_path_dirname(o_path));
        exist = await g.os_path_exists(output_dir);
        if (!exist) {
            g.error(`output directory not found: ${output_dir}`);
            return;
        }
        //
        // Call sphinx-build to write the output file.
        // sphinx-build [OPTIONS] SOURCEDIR OUTPUTDIR [FILENAMES...]
        const command = `sphinx-build ${input_dir} ${output_dir} ${i_path}`;
        if (trace) {
            g.trace(`\ncommand: ${command}\n`);
        }
        await g.execute_shell_commands(command);

    }
    //@+node:ekr.20190515070742.24: *3* markup.write_root & helpers
    /**
     * Process all nodes in an @adoc tree to self.output_file
     */
    public write_root(root: Position): void {

        // Write only the body of the root.
        this.write_body(root);
        // Write all nodes of the tree, except ignored nodes.
        this.level_offset = this.compute_level_offset(root);
        this.root_level = root.level();
        const p = root.threadNext();  // Returns a copy.
        const after = root.nodeAfterTree();
        while (p && p.__bool__() && !p.__eq__(after)) {
            const h = p.h.trimEnd();
            if (g.match_word(h, 0, '@ignore-tree')) {
                p.moveToNodeAfterTree();
                continue;
            }

            if (g.match_word(h, 0, '@ignore-node')) {
                p.moveToThreadNext();
                continue;
            }

            if (!g.match_word(h, 0, '@no-head')) {
                this.write_headline(p);
            }
            this.write_body(p);
            p.moveToThreadNext();
        }
    }
    //@+node:ekr.20190515114836.1: *4* markup.compute_level_offset
    /**
     * Return 1 if the root.b contains a title.  Otherwise 0.
     */
    public compute_level_offset(root: Position): number {

        const pattern = this.kind === 'adoc' ? this.adoc_title_pat : this.pandoc_title_pat;

        for (const line of g.splitLines(root.b)) {
            if (line.match(pattern)) {
                return 1;
            }
        }
        return 0;

    }
    //@+node:ekr.20190515070742.38: *4* markup.write_body
    /**
     * Write p.b
     */
    public write_body(p: Position): void {

        // We no longer add newlines to the start of nodes because
        // we write a blank line after all sections.
        const s = this.remove_directives(p.b);
        this.output_file += g.ensureTrailingNewlines(s, 2);
    }
    //@+node:ekr.20190515070742.47: *4* markup.write_headline
    /**
     * Generate an AsciiDoctor section
     */
    public write_headline(p: Position): void {

        if (!p.h.trim()) {
            return;
        }
        let section;
        const level = Math.max(0, this.level_offset + p.level() - this.root_level);
        if (this.kind === 'sphinx') {
            // For now, assume rST markup!
            // Hard coded characters. Never use '#' underlining.
            const chars = `=+*^~"'` + "`" + `-:><_`;
            if (chars.length > level) {
                const ch = chars[level];
                const line = ch.repeat(p.h.length);
                this.output_file += `${p.h}\n${line}\n\n`;
            }
            return;
        }
        if (this.kind === 'pandoc') {
            section = '#'.repeat(Math.min(level, 6));
        } else if (this.kind === 'adoc') {
            // level 0 (a single #) should be done by hand.
            section = '='.repeat(level);
        } else {
            g.es_print(`bad kind: ${this.kind}`);
            return;
        }
        this.output_file += `${section} ${p.h}\n`;

    }
    //@+node:ekr.20191007054942.1: *4* markup.remove_directives
    public remove_directives(s: string): string {
        const lines = g.splitLines(s);
        const result = [];
        for (const s of lines) {
            if (s.startsWith('@')) {
                const i = g.skip_id(s, 1);
                const word = s.substring(1, i);
                if (g.globalDirectiveList.includes(word)) {
                    continue;
                }
            }
            result.push(s);
        }
        return result.join('');
    }
    //@+node:ekr.20191006155051.1: *3* markup.commands
    public async adoc_command(preview = false, verbose = true,): Promise<File_List> {
        await this.markupInitPromise;
        if (asciidoctor_exec || asciidoc3_exec) {
            return this.command_helper('adoc', preview, verbose);
        }
        const name = preview ? 'adoc-with-preview' : 'adoc';
        g.es_print(`${name} requires either asciidoctor or asciidoc3`);
        return Promise.resolve([]);
    }

    public async pandoc_command(preview = false, verbose = true,): Promise<File_List> {
        await this.markupInitPromise;
        if (pandoc_exec) {
            return this.command_helper('pandoc', preview, verbose);
        }
        const name = preview ? 'pandoc-with-preview' : 'pandoc';
        g.es_print(`${name} requires pandoc`);
        return Promise.resolve([]);
    }

    public async sphinx_command(preview = false, verbose = true,): Promise<File_List> {
        await this.markupInitPromise;
        if (sphinx_build) {
            return this.command_helper('sphinx', preview, verbose);
        }
        const name = preview ? 'sphinx-with-preview' : 'sphinx';
        g.es_print(`${name} requires sphinx`);
        return Promise.resolve([]);
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
