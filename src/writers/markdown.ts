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
        const placeholder_regex = /placeholder level [0-9]+/;
        this.root = root;
        this.write_root(root);
        const total = [...root.subtree()].length;
        let count = 0;
        for (const p of root.subtree()) {
            count += 1;
            let lastFlag = count === total;
            if (g.app.force_at_auto_sentinels) {
                this.put_node_sentinel(p, '<!--', '-->');
            }
            if (placeholder_regex.test(p.h)) {
                // skip this 'placeholder level X' node
            } else {
                this.write_headline(p);
                // Ensure that every section ends with exactly two newlines.
                if (p.b.trim().length > 0) {
                    let s = p.b.trim() + (lastFlag ? '\n' : '\n\n');
                    const lines = s.split(/\r?\n/);
                    if (lines.length && lines[lines.length - 1] === '') {
                        lines.pop();
                    }
                    for (const line of lines) {
                        if (!g.isDirective(line)) {
                            this.put(line);
                        }
                    }
                } else if (!lastFlag) {  // #3719.
                    this.put('\n');
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
