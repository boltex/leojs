//@+leo-ver=5-thin
//@+node:felix.20230914214940.1: * @file src/writers/org.ts
/**
 * The @auto write code for Emacs org-mode (.org) files.
 */

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { BaseWriter } from './basewriter';
import { Commands } from "../core/leoCommands";

//@+others
//@+node:felix.20230914214940.2: ** class OrgModeWriter(BaseWriter)
/**
 * The writer class for .org files.
 */
export class OrgModeWriter extends BaseWriter {

    public tc: any | null = null;

    constructor(c: Commands) {
        super(c);
        this.tc = this.load_nodetags();
    }

    //@+others
    //@+node:felix.20230914214940.3: *3* orgw.load_nodetags
    /**
     * Load the nodetags.py plugin if necessary.
     * Return c.theTagController.
     */
    public load_nodetags(): any | null {
        const c: any = this.c;
        // if (!c.theTagController) {
        //     // Assuming this is how you load plugins in your TypeScript setup.
        //     g.app.pluginsController.loadOnePlugin('nodetags.py', false, false);
        // }
        return c.theTagController || null;
    }
    //@+node:felix.20230914214940.4: *3* orgw.write
    /**
     * Write all the *descendants* of an @auto-org-mode node.
     */
    public write(root: Position): void {
        const root_level = root.level();
        this.write_root(root);
        for (const p of root.subtree()) {
            if (g.app.force_at_auto_sentinels) {
                this.put_node_sentinel(p, '#');
            }
            const indent = p.level() - root_level;
            this.put(`${'*'.repeat(indent)} ${p.h}`);
            for (const s of p.b.split('\n')) {
                this.put(s);
            }
        }
        root.setVisited();
    }
    //@+node:felix.20230914214940.5: *3* orgw.write_root
    /**
     * Write the root @auto-org node.
     */
    public write_root(root: Position): void {
        const lines = g.splitLines(root.b).filter(z => !g.isDirective(z));
        for (const s of lines) {
            this.put(s);
        }
    }
    //@-others

}
//@-others

export const writer_dict = {
    '@auto': ['@auto-org-mode', '@auto-org',],
    'class': OrgModeWriter,
    'extensions': ['.org',],
};

//@@language typescript
//@@tabwidth -4
//@-leo
