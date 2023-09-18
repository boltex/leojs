//@+leo-ver=5-thin
//@+node:felix.20230913225656.1: * @file src/importers/markdown.ts
/**
 * The @auto importer for the markdown language.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230913225656.2: ** class Markdown_Importer(Importer)
/**
 * The importer for the markdown lanuage.
 */
class Markdown_Importer extends Importer {

    public language = 'md';

    public lines_dict: Record<string, string[]> = {};  // Lines for each vnode.
    public stack: Position[] = [];

    // Regular expression patterns.
    public md_hash_pattern: RegExp = /^(#+)\s*(.+)\s*\n/;
    public md_pattern_table: RegExp[] = [/^(=+)\n/, /^(-+)\n/];

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913225656.3: *3* md_i.gen_block
    /**
     * Markdown_Importer: gen_block. The `block` arg is unused.
     *
     * Create all descendant blocks and their nodes from self.lines.
     *
     * i.gen_lines adds the @language and @tabwidth directives.
     */
    public gen_block(block: Block, parent: Position): void {
        console.assert(parent.__eq__(this.root));

        const lines: string[] = this.lines;
        this.lines_dict[parent.v.gnx] = [];  // Initialize lines_dict for the parent vnode.
        this.stack = [parent];
        let in_code: boolean = false;
        let skip: number = 0;

        for (let i: number = 0; i < lines.length; i++) {
            const line: string = lines[i];
            const top: Position = this.stack[this.stack.length - 1];

            if (skip > 0) {
                skip -= 1;
            } else if (!in_code && this.lookahead_underline(i)) {
                const level: number = lines[i + 1].startsWith('=') ? 1 : 2;
                this.make_markdown_node(level, line);
                skip = 1;
            } else if (!in_code) {
                const [level, name]: [number | null, string | null] = this.is_hash(line);
                if (level !== null && name !== null) {
                    this.make_markdown_node(level, name);
                }
            } else if (i === 0) {
                this.make_decls_node(line);
            } else if (in_code) {
                if (line.startsWith('```')) {
                    in_code = false;
                }
                this.lines_dict[top.v.gnx].push(line);
            } else if (line.startsWith('```')) {
                in_code = true;
                this.lines_dict[top.v.gnx].push(line);
            } else {
                this.lines_dict[top.v.gnx].push(line);
            }
        }

        // Set p.b from the lines_dict.
        console.assert(parent.__eq__(this.root));
        for (const p of parent.self_and_subtree()) {
            p.b = this.lines_dict[p.v.gnx].join('');
        }
    }
    //@+node:felix.20230913225656.4: *4* md_i.is_hash
    /**
     * Return level, name if line is a hash section line.
     * else return None, None.
     */
    public is_hash(line: string): [number | null, string | null] {
        const m: RegExpMatchArray | null = line.match(this.md_hash_pattern);
        if (m !== null) {
            const level: number = m[1].length;
            const name: string = m[2].trim();
            if (name !== '') {
                return [level, name];
            }
        }
        return [null, null];
    }
    //@+node:felix.20230913225656.5: *4* md_i.is_underline
    /**
     * True if line is all '-' or '=' characters.
     */
    public is_underline(line: string): boolean {
        for (const pattern of this.md_pattern_table) {
            const m: RegExpMatchArray | null = line.match(pattern);
            if (m !== null && m[1].length >= 4) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20230913225656.6: *4* md_i.lookahead_underline
    /**
     * True if lines[i:i+1] form an underlined line.
     */
    public lookahead_underline(i: number): boolean {
        const lines: string[] = this.lines;
        if (i + 1 < lines.length) {
            const line0: string = lines[i];
            const line1: string = lines[i + 1];
            const ch0: boolean = this.is_underline(line0);
            const ch1: boolean = this.is_underline(line1);
            return !ch0 && !line0.trim().length && ch1 && line1.length >= 4;
        }
        return false;
    }
    //@+node:felix.20230913225656.7: *4* md_i.make_decls_node
    /**
     * Make a decls node.
     */
    public make_decls_node(line: string): void {
        const lines_dict: Record<string, string[]> = this.lines_dict;
        const parent: Position = this.stack[this.stack.length - 1];
        const child: Position = parent.insertAsLastChild();
        child.h = '!Declarations';
        lines_dict[child.v.gnx] = [line];
        this.stack.push(child);
    }
    //@+node:felix.20230913225656.8: *4* md_i.make_markdown_node
    /**
     * Create a new node. 
     */
    public make_markdown_node(level: number, name: string): Position {
        const lines_dict: Record<string, string[]> = this.lines_dict;
        // Cut back the stack.
        this.stack = this.stack.slice(0, level);
        // Insert placeholders as necessary.
        // #877: This could happen in imported files not created by us.
        this.create_placeholders(level, lines_dict, this.stack);
        console.assert(level === this.stack.length);

        const parent: Position = this.stack[this.stack.length - 1];
        const child: Position = parent.insertAsLastChild();
        child.h = name;
        lines_dict[child.v.gnx] = [];
        this.stack.push(child);
        console.assert(this.stack.length);
        console.assert(0 <= level && level < this.stack.length);

        return this.stack[level];
    }
    //@-others

}
//@-others

/**
 * The importer callback for markdown.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Markdown_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    '@auto': ['@auto-md', '@auto-markdown',],
    'extensions': ['.md', '.rmd', '.Rmd',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
