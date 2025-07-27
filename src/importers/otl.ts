//@+leo-ver=5-thin
//@+node:felix.20230913231807.1: * @file src/importers/otl.ts
/**
 * The @auto importer for vim-outline files.
 */
import * as g from '../core/leoGlobals';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

//@+others
//@+node:felix.20230913231807.2: ** class Otl_Importer(Importer)
/**
 * The importer for the otl language.
 */
export class Otl_Importer extends Importer {

    public language = 'otl';

    // Must match body pattern first.
    public otl_body_pattern: RegExp = /^: (.*)$/;
    public otl_node_pattern: RegExp = /^[ ]*(\t*)(.*)$/;

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913231807.3: *3* otl_i.check_blanks_and_tabs
    /**
     * Otl_Importer.check_blanks_and_tabs.
     *
     * Check for intermixed blank & tabs. 
     *
     * Tabs are part of the otl format. Never complain.
     */
    check_blanks_and_tabs(lines: string[]): boolean {
        return true;
    }
    //@+node:felix.20230913231807.4: *3* otl_i.gen_block
    /**
     * Otl_Importer: gen_block.
     *
     * Node generator for otl (vim-outline) mode.
     *
     * Create all descendant blocks and their nodes from self.lines.
     *
     * The otl writer adds section lines, so *remove* those lines here.
     *
     * i.gen_lines adds the @language and @tabwidth directives.
    */
    public gen_block(parent: Position): void {
        const lines: string[] = this.lines;
        g.assert(parent.__eq__(this.root));

        // Use a Map instead of creating a new VNode slot.
        const lines_dict: Record<string, string[]> = {};  // Lines for each vnode.
        lines_dict[parent.v.gnx] = [];
        const parents: Position[] = [this.root!];
        for (const line of lines) {
            if (!line.trim()) {
                continue;  // New.
            }
            const bodyMatch: RegExpMatchArray | null = line.match(this.otl_body_pattern);
            if (bodyMatch) {
                const top: Position = parents[parents.length - 1];
                lines_dict[top.v.gnx].push(bodyMatch[1] + '\n');
                continue;
            }
            const nodeMatch: RegExpMatchArray | null = line.match(this.otl_node_pattern);
            if (nodeMatch) {
                // Cut back the stack, then allocate a new node.
                const level: number = 1 + nodeMatch[1].length;
                parents.length = level;
                this.create_placeholders(level, lines_dict, parents);
                const top: Position = parents[parents.length - 1] || this.root;
                const child: Position = top.insertAsLastChild();
                child.h = nodeMatch[2];
                parents.push(child);
                lines_dict[child.v.gnx] = [];
            } else {  // pragma: no cover
                console.error(`Bad otl line: ${line}`);
            }
        }

        // Set p.b from the lines_dict.
        g.assert(parent.__eq__(this.root));

        for (const p of this.root!.self_and_subtree()) {
            p.b = lines_dict[p.v.gnx].join('');
        }
    }
    //@+node:felix.20230913231807.5: *3* otl_i.regularize_whitespace
    /** 
     * Otl_Importer.regularizeWhitespace.
     *
     * Tabs are part of the otl format. Leave them alone.
     * Convert tabs to blanks or vice versa depending on the @tabwidth in effect.
     */
    public regularize_whitespace(lines: string[]): string[] {
        // Should never be called: otl.checkBlanksAndTabs always returns true
        return lines;  // pragma: no cover
    }
    //@-others

}
//@-others

/**
 * The importer callback for .otl files.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
    new Otl_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
    '@auto': ['@auto-otl', '@auto-vim-outline',],
    'extensions': ['.otl',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
