/**
 * A class holding all data about an external file.
 */
export class ExternalFile {
/*
    def __init__(self, c, ext, p, path, time):
        '''Ctor for ExternalFile class.'''
        self.c = c
        self.ext = ext
        self.p = p and p.copy()
            # The nearest @<file> node.
        self.path = path
        self.time = time  # Used to inhibit endless dialog loop.
                          # See efc.idle_check_open_with_file.

    def __repr__(self):
        return f"<ExternalFile: {self.time:20} {g.shortFilename(self.path)}>"

    __str__ = __repr__
*/

    /*
    def shortFileName(self):
        return g.shortFilename(self.path)
    */

    /*
    def exists(self):
        '''Return True if the external file still exists.'''
        return g.os_path_exists(self.path)
    */


}

/**
 *  A class tracking changes to external files:
 *
 *  - temp files created by open-with commands.
 *  - external files corresponding to @file nodes.
 *
 *  This class raises a dialog when a file changes outside of Leo.
 *
 *  **Naming conventions**:
 *
 *  - d is always a dict created by the @open-with logic.
 *    This dict describes *only* how to open the file.
 *
 *  - ef is always an ExternalFiles instance.
*/
export class ExternalFilesController {


}

