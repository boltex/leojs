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
    private placeholder_regex = /^placeholder level [0-9]+/;

    //@+others
    //@+node:felix.20230914214935.3: *3* mdw.write
    /**
     * Write all the *descendants* of an @auto-markdown node.
     */

    /* Original Python Code to use as LOOSE reference:

    def write(self, root: Position) -> None:
        """Write all the *descendants* of an @auto-markdown node."""
        self.root = root
        self.write_root(root)
        for p in root.subtree():
            if g.app.force_at_auto_sentinels:  # pragma: no cover
                self.put_node_sentinel(p, '<!--', delim2='-->')
            if self.placeholder_regex.match(p.h):
                # skip this 'placeholder level X' node
                pass
            else:
                self.write_headline(p)
                lines = p.b.splitlines(False)
                for s in lines:
                    if not g.isDirective(s):
                        self.put(s)
        root.setVisited()

    */


    public write(root: Position): void {
        this.root = root;
        this.write_root(root);

        for (const p of root.subtree()) {
            if (g.app.force_at_auto_sentinels) {
                this.put_node_sentinel(p, '<!--', '-->');
            }
            if (this.placeholder_regex.test(p.h)) {
                // skip this 'placeholder level X' node
                // pass
            } else {
                this.write_headline(p);
                const normalized = p.b.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                const lines = normalized.endsWith('\n')
                    ? normalized.split('\n').slice(0, -1)
                    : normalized.split('\n');
                for (const s of lines) {
                    if (!g.isDirective(s)) {
                        this.put(s);
                    }
                }
            }
        }
        root.setVisited();
    }
    //@+node:felix.20230914214935.4: *3* mdw.write_headline
    /**
     * Write or skip the headline.
     *
     *  New in Leo 5.5:
     *  - Always write '#' sections.
     *    This will cause perfect import to fail. The alternatives are worse.
     *  - Skip !Declarations.
     *
     *  New in Leo 6.7.7:
     *  - Don't write headlines of placeholder nodes.
     */
    public write_headline(p: Position): void {
        const level = p.level() - (this.root?.level() || 0);
        if (p.h === '!Declarations' || this.placeholder_regex.test(p.h)) {
            // pass
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
