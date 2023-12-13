//@+leo-ver=5-thin
//@+node:felix.20230914214929.1: * @file src/writers/leo_rst.ts
/**
 * The write code for @auto-rst and other reStructuredText nodes.
 * This is very different from rst3's write code.
 *
 * This module must **not** be named rst, so as not to conflict with docutils.
 */

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { BaseWriter } from './basewriter';
import { underlines } from '../importers/leo_rst';

// Make *sure* that reader's underlines match the writer's.

//@+others
//@+node:felix.20230914214929.2: ** class RstWriter(BaseWriter)
/**
 *     The writer class for @auto-rst and other reStructuredText nodes.
 * This is *very* different from rst3 command's write code.
 */
export class RstWriter extends BaseWriter {

    //@+others
    //@+node:felix.20230914214929.3: *3* rstw.underline_char
    /**
     * Return the underlining character for position p.
     */
    public underline_char(p: Position, root_level: number): string {
        //  OLD underlines = '=+*^~"\'`-:><_'
        //  OLD underlines = "!\"$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
        //  '#' is reserved.

        const i = p.level() - root_level;
        return underlines[Math.min(i, underlines.length - 1)];
    }

    //@+node:felix.20230914214929.4: *3* rstw.write
    /**
     * Write an @auto tree containing imported rST code.
     */
    public write(root: Position): void {
        const root_level = root.level();
        this.write_root(root);
        for (const p of root.subtree()) {
            if (g.app.force_at_auto_sentinels) {
                this.put_node_sentinel(p, '.. ');
            }
            const ch = this.underline_char(p, root_level);
            this.put(p.h);
            const n = Math.max(4, g.toEncodedString(p.h).length);
            this.put(ch.repeat(n));
            let s = p.b.trimEnd() + '\n\n';
            const lines = s.split('\n');
            // In JavaScript, when you split a string like '\n\n' with split(/\n/),
            // it treats each newline character as a separator and includes an 
            // empty string for the segment following the last newline, even if 
            // there's no text there. This results in an extra empty string in the array.
            if (lines.length && lines[lines.length - 1] === '') {
                lines.pop();
            }
            if (lines.length > 0 && lines[0].trim() !== '') {
                this.put('');
            }
            for (const line of lines) {
                this.put(line);
            }
        }
        root.setVisited();
    }
    //@+node:felix.20230914214929.5: *3* rstw.write_root
    /**
     * Write the root @auto-org node.
     */
    public write_root(root: Position): void {
        const lines = g.splitLines(root.b).filter((z: string) => !g.isDirective(z));
        for (const s of lines) {
            this.put(s);
        }
    }
    //@-others

}
//@-others

export const writer_dict = {
    '@auto': ['@auto-rst'],
    'class': RstWriter,
    'extensions': ['.rst', '.rest'],
};

//@@language typescript
//@@tabwidth -4
//@-leo
