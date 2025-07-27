//@+leo-ver=5-thin
//@+node:felix.20230914002938.1: * @file src/importers/treepad.ts
/**
 * The @auto importer for the TreePad file format.
 */
import * as g from '../core/leoGlobals';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

//@+others
//@+node:felix.20230914002938.2: ** class Treepad_Importer(Importer)
/**
 * The importer for the TreePad file format.
 *
 * See: http://download.nust.na/pub2/FreeStuff/Software/Home%20office%20helpers/TreePad%20Lite/fileformat.txt
 */
export class Treepad_Importer extends Importer {

    public language: string = 'plain'; // A reasonable default.

    constructor(c: Commands) {
        super(c);
        this.__init__();
    }

    //@+others
    //@+node:felix.20230914002938.3: *3* treepad_i.gen_block
    /**
     * Treepad_Importer: gen_block.
     *
     * Create all descendant blocks and their nodes from self.lines.
     *
     * The Treepad writer adds all structure-related lines,
     * so *remove* those lines here.
     *
     * i.gen_lines adds the @language and @tabwidth directives.
     */
    public gen_block(parent: Position): void {
        const header_pat = /^<Treepad version.*?>\s*$/m; // Added caret to match at start of string
        const start1_pat = /^\s*dt\=\w+\s*$/m;  // type line.
        const start2_pat = /^\s*<node>(\s*5P9i0s8y19Z)?$/m;
        const end_pat = /^\s*<end node>\s*5P9i0s8y19Z$/m;
        const lines = this.lines;
        g.assert(parent.__eq__(this.root));

        const parents: Position[] = [parent];
        const lines_dict: { [key: string]: string[] } = {};  // Lines for each vnode.
        let i = 0;

        if (lines[0].match(header_pat)) {
            i += 1;
            lines_dict[parent.v.gnx] = [lines[0], '@others\n'];
        } else {
            // pragma: no cover (user error)
            console.error('No header line');
            lines_dict[parent.v.gnx] = ['@others\n'];
        }

        while (i < lines.length) {
            const line = lines[i];
            i += 1;

            if (line.match(end_pat)) {
                continue;  // No need to change the stack.
            }

            if (i + 3 >= lines.length) {
                // Assume the line is a body line.
                const p = parents[parents.length - 1];
                lines_dict[p.v.gnx].push(line);
                continue;
            }

            const start1_m = lines[i - 1].match(start1_pat);  // dt line.
            const start2_m = lines[i].match(start2_pat);  // type line.

            if (start1_m && start2_m) {
                const headline = lines[i + 1].trim();
                const level_s = lines[i + 2].trim();
                i += 3;  // Skip 3 more lines.

                let level = 1;

                try {
                    level = 1 + parseInt(level_s, 10);
                } catch (e) {
                    level = 1;
                }

                // Cut back the stack.
                parents.splice(level);

                // Create any needed placeholders.
                this.create_placeholders(level, lines_dict, parents);

                // Create the child.
                const top = parents[parents.length - 1];
                const child = top.insertAsLastChild();
                parents.push(child);
                child.h = headline;
                lines_dict[child.v.gnx] = [];
            } else {
                // Append the body line.
                const top = parents[parents.length - 1];
                lines_dict[top.v.gnx].push(line);
            }
        }

        // Set p.b from the lines_dict.
        g.assert(parent.__eq__(this.root));
        for (const p of parent.self_and_subtree()) {
            p.b = lines_dict[p.v.gnx].join('');
        }
    }
    //@-others

}
//@-others

/**
 * The importer callback for treepad.
 */
export const do_import = (c: Commands, parent: Position, s: string, treeType = '@file') => {
    new Treepad_Importer(c).import_from_string(parent, s, treeType);
};

export const importer_dict = {
    'extensions': ['.hjt',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4


//@-leo
