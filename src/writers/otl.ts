//@+leo-ver=5-thin
//@+node:felix.20230914214945.1: * @file src/writers/otl.ts
/**
 * The @auto write code for vimoutline (.otl) files.
 */

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { BaseWriter } from './basewriter';

//@+others
//@+node:felix.20230914214945.2: ** class OtlWriter(BaseWriter)
/**
 * The writer class for .otl files.
 */
class OtlWriter extends BaseWriter {

    //@+others
    //@+node:felix.20230914214945.3: *3* otlw.write
    /**
     * Write all the *descendants* of an @auto-otl node.
     */
    public write(root: Position): void {
        this.write_root(root);
        for (const child of root.children()) {
            const n = child.level();
            for (const p of child.self_and_subtree()) {
                if (g.app.force_at_auto_sentinels) {
                    this.put_node_sentinel(p, '#');
                }
                const indent = '\t'.repeat(p.level() - n);
                this.put(`${indent}${p.h}`);
                for (const s of p.b.split('\n')) {
                    this.put(`${indent}: ${s}`);
                }
            }
        }
        root.setVisited();
    }
    //@+node:felix.20230914214945.4: *3* otlw.write_root
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
    '@auto': ['@auto-otl', '@auto-vim-outline',],
    'class': OtlWriter,
    'extensions': ['.otl',],
};

//@@language typescript
//@@tabwidth -4
//@-leo
