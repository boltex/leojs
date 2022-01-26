//@+leo-ver=5-thin
//@+node:felix.20211212162008.1: * @file src/core/leoExternalFiles.ts
//@+<< imports >>
//@+node:felix.20220102165214.1: ** << imports >>
import * as g from './leoGlobals';
import { Position } from './leoNodes';
import { Commands } from './leoCommands';
//@-<< imports >>
//@+others
//@+node:felix.20211226234245.1: ** class ExternalFile
/**
 * A class holding all data about an external file.
 */
export class ExternalFile {

    public c: Commands;
    public ext: string;
    public p: Position | false;
    public path: string;
    public time: number;

    /**
     * Ctor for ExternalFile class.
     */
    constructor(c: Commands, ext: string, p: Position, path: string, time: number) {
        this.c = c;
        this.ext = ext;
        this.p = p && p.__bool__() && p.copy();
        // The nearest @<file> node.
        this.path = path;
        this.time = time;  // Used to inhibit endless dialog loop.
        // See efc.idle_check_open_with_file.
    }

    public toString() {
        return `<ExternalFile: ${this.time} ${g.shortFilename(this.path)}>`;
    }

    //@+others
    //@+node:felix.20211226234245.2: *3* ef.shortFileName
    public shortFileName(): string {
        return g.shortFilename(this.path);
    }
    //@+node:felix.20211226234245.3: *3* ef.exists
    /**
     * Return True if the external file still exists.
     */
    public async exists(): Promise<boolean> {
        return g.os_path_exists(this.path);
    }
    //@-others

}
//@+node:felix.20211226234316.1: ** class ExternalFilesController
/**
 *
 * A class tracking changes to external files:
 *
 *  - temp files created by open-with commands.
 *  - external files corresponding to @file nodes.
 *
 * This class raises a dialog when a file changes outside of Leo.
 *
 *  **Naming conventions**:
 *
 *  - d is always a dict created by the @open-with logic.
 *    This dict describes *only* how to open the file.
 *
 *  - ef is always an ExternalFiles instance.
 */
export class ExternalFilesController {

    // TODO !

    //@+others
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
