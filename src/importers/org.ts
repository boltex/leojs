//@+leo-ver=5-thin
//@+node:felix.20230913231752.1: * @file src/importers/org.ts
/**
 * The @auto importer for the org language.
 */
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

//@+others
//@+node:felix.20230913231752.2: ** class Org_Importer(Importer)
/**
 * The importer for the org language.
 */
export class Org_Importer extends Importer {
    public language: string = 'org';
    public section_pat: RegExp = /^(\*+)\s(.*)/; // Added caret for start of line

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230913231752.3: *3* org_i.gen_block
    /**
     * Org_Importer: gen_block.
     *
     * Create all descendant blocks and their nodes from self.lines.
     *
     * The org writer adds section lines, so *remove* those lines here.
     *
     * i.gen_lines adds the @language and @tabwidth directives.
     */
    public gen_block(parent: Position): void {
        const lines: string[] = this.lines;
        console.assert(parent.__eq__(this.root));
        const parents: Position[] = [parent];
        const lines_dict: Record<string, string[]> = {};
        lines_dict[parent.v.gnx] = [];
        let i: number = 0;
        let top: Position;
        while (i < lines.length) {
            const line: string = lines[i];
            i += 1;
            const match: RegExpMatchArray | null = line.match(this.section_pat);

            if (match) {
                const level: number = match[1].length;
                const headline: string = match[2];
                // Cut back the stack.
                parents.splice(level);
                // Create any needed placeholders.
                this.create_placeholders(level, lines_dict, parents);
                // Create the child.
                top = parents[parents.length - 1];
                const child: Position = top.insertAsLastChild();
                parents.push(child);
                child.h = headline;
                lines_dict[child.v.gnx] = [];
            } else {
                top = parents[parents.length - 1];
                lines_dict[top.v.gnx].push(line);
            }
        }

        // Set p.b from the lines_dict.
        console.assert(parent.__eq__(this.root));
        for (const p of parent.self_and_subtree()) {
            p.b = lines_dict[p.v.gnx].join('');
        }
    }
    //@-others

}
//@-others

/**
 * The importer callback for .org files.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Org_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    '@auto': ['@auto-org', '@auto-org-mode',],
    'extensions': ['.org'],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
