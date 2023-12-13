//@+leo-ver=5-thin
//@+node:felix.20230914214935.1: * @file src/writers/markdown.ts
/**
 * The @auto write code for markdown.
 */

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { BaseWriter } from './basewriter';

//@+others
//@+node:felix.20230914214935.2: ** class MarkdownWriter(BaseWriter)
/**
 * The writer class for markdown files.
 */
export class MarkdownWriter extends BaseWriter {
    public root: Position | null = null;


    //@+others
    //@+node:felix.20230914214935.3: *3* mdw.write
    /**
     * Write all the *descendants* of an @auto-markdown node.
     */
    public write(root: Position): void {
        this.root = root;
        this.write_root(root);
        for (const p of root.subtree()) {
            if (g.app.force_at_auto_sentinels) {
                this.put_node_sentinel(p, '<!--', '-->');
            }
            this.write_headline(p);
            const s = p.b.trimEnd() + '\n\n';
            const lines = s.split('\n');
            // In JavaScript, when you split a string like '\n\n' with split(/\n/),
            // it treats each newline character as a separator and includes an 
            // empty string for the segment following the last newline, even if 
            // there's no text there. This results in an extra empty string in the array.
            if (lines.length && lines[lines.length - 1] === '') {
                lines.pop();
            }
            for (const line of lines) {
                if (!g.isDirective(line)) {
                    this.put(line);
                }
            }
        }
        root.setVisited();
    }
    //@+node:felix.20230914214935.4: *3* mdw.write_headline
    /**
     * Write or skip the headline.
     *
     * New in Leo 5.5: Always write '#' sections.
     * This will cause perfect import to fail.
     * The alternatives are much worse.
     */
    public write_headline(p: Position): void {
        const level = p.level() - (this.root?.level() || 0);
        const kind = p.h && p.h[0];
        if (kind === '!') {
            // The signal for a declaration node.
        } else {
            this.put(`${'#'.repeat(level)} ${p.h.trimStart()}`); // Leo 6.6.4: preserve spacing.
        }
    }
    //@+node:felix.20230914214935.5: *3* mdw.write_root
    /**
     * Write the root @auto-org node.
     */
    public write_root(root: Position): void {
        const lines = g.splitLines(root.b).filter((z: string) => !g.isDirective(z));
        for (const line of lines) {
            this.put(line);
        }
    }
    //@-others

}
//@-others

export const writer_dict = {
    '@auto': ['@auto-md', '@auto-markdown',],
    'class': MarkdownWriter,
    'extensions': ['.md',],
};

//@@language typescript
//@@tabwidth -4
//@-leo
