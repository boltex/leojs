//@+leo-ver=5-thin
//@+node:felix.20230914011239.1: * @file src/writers/dart.ts
/**
 * The @auto write code for Emacs org-mode (.org) files.
 */

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { BaseWriter } from './basewriter';

//@+others
//@+node:felix.20230914011239.2: ** class DartWriter(BaseWriter)
/**
 * The writer class for .dart files.
 */
class DartWriter extends BaseWriter {

    //@+others
    //@+node:felix.20230914011239.3: *3* dart.write
    /**
     * Write all the *descendants* of an .dart node.
     */
    public write(root: Position): void {
        const root_level = root.level();
        for (const p of root.subtree()) {
            const indent = p.level() - root_level;
            this.put('*'.repeat(indent) + ' ' + p.h);
            for (const s of p.b.split('\n')) {
                if (!g.isDirective(s)) {
                    this.put(s);
                }
            }
        }
        root.setVisited();
    }
    //@-others

}
//@-others

export const writer_dict = {
    '@auto': [],
    'class': DartWriter,
    'extensions': ['.dart',],
};

//@@language typescript
//@@tabwidth -4
//@-leo
