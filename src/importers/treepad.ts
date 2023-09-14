//@+leo-ver=5-thin
//@+node:felix.20230914002938.1: * @file src/importers/treepad.ts
/**
 * The @auto importer for the TreePad file format.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230914002938.2: ** class Treepad_Importer(Importer)
/**
 * The importer for the TreePad file format.
 *
 * See: http://download.nust.na/pub2/FreeStuff/Software/Home%20office%20helpers/TreePad%20Lite/fileformat.txt
 */
class Treepad_Importer extends Importer {

    public language: string = 'plain'; // A reasonable default.

    //@+others
    //@+node:felix.20230914002938.3: *3* treepad_i.gen_block
    /**
     * Treepad_Importer: gen_block. The `block` arg is unused.
     *
     * Create all descendant blocks and their nodes from self.lines.
     *
     * The Treepad writer adds all structure-related lines,
     * so *remove* those lines here.
     *
     * i.gen_lines adds the @language and @tabwidth directives.
     */
    public gen_block(block: Block, parent: Position): void {
        const header_pat = /<Treepad version.*?>\s*$/;
        const start1_pat = /^\s*dt\=\w+\s*$/;  // type line.
        const start2_pat = /\s*<node>(\s*5P9i0s8y19Z)?$/;
        const end_pat = /\s*<end node>\s*5P9i0s8y19Z$/;
        const lines = this.lines;
        console.assert(parent.__eq__(this.root));

        const parents: Position[] = [parent];
        const lines_dict: { [key: string]: string[] } = {};  // Lines for each vnode.
        let i = 0;

        if (header_pat.test(lines[0])) {
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

            if (end_pat.test(line)) {
                continue;  // No need to change the stack.
            }

            if (i + 3 >= lines.length) {
                // Assume the line is a body line.
                const p = parents[parents.length - 1];
                lines_dict[p.v.gnx].push(line);
                continue;
            }

            const start1_m = start1_pat.test(lines[i - 1]);  // dt line.
            const start2_m = start2_pat.test(lines[i]);  // type line.

            if (start1_m && start2_m) {
                const headline = lines[i + 1].trim();
                const level_s = lines[i + 2].trim();
                i += 3;  // Skip 3 more lines.

                let level = 1;

                try {
                    level = 1 + parseInt(level_s, 10);
                } catch (e) {
                    // pragma: no cover (user error)
                    console.error('Invalid level:', level_s);
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
        console.assert(parent.__eq__(this.root));
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
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Treepad_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.hjt',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4


//@-leo
