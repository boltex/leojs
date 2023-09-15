//@+leo-ver=5-thin
//@+node:felix.20230914214949.1: * @file src/writers/treepad.ts
/**
 * The @auto write code for TreePad (.hjt) files.
 */
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { BaseWriter } from './basewriter';

//@+others
//@+node:felix.20230914214949.2: ** class TreePad_Writer(BaseWriter)
/**
 * The writer class for TreePad (.hjt) files.
 */
class TreePad_Writer extends BaseWriter {

    //@+others
    //@+node:felix.20230914214949.3: *3* treepad_w.write
    /**
     * Write the entire @auto tree.
     */
    public write(root: Position): void {
        this.put("<Treepad version 3.0>");
        const root_level = root.level();
        for (const p of root.self_and_subtree()) {
            const h = p.v === root.v ? 'Root' : p.h;
            const indent = p.level() - root_level;
            this.put('dt=Text');
            this.put('<node>');
            this.put(h);
            this.put(String(indent));
            for (const s of g.splitLines(p.b)) {
                if (!g.isDirective(s)) {
                    this.put(s);
                }
            }
            this.put('<end node> 5P9i0s8y19Z');
        }
        root.setVisited();
    }
    //@-others

}
//@-others

export const writer_dict = {
    '@auto': [],
    'class': TreePad_Writer,
    'extensions': ['.hjt',],
};

//@@language typescript
//@@tabwidth -4
//@-leo
