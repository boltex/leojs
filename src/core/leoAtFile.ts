//@+leo-ver=5-thin
//@+node:felix.20211211234842.1: * @file src/core/leoAtFile.ts
// * Classes to read and write @file nodes.
//@+<< imports >>
//@+node:felix.20211225220235.1: ** << imports >>
/*
import io
import os
import re
import sys
import tabnanny
import time
import tokenize
from typing import List
from leo.core import leoGlobals as g
from leo.core import leoNodes
*/

import * as g from './leoGlobals';
import { new_cmd_decorator } from "../core/decorators";
import { Position, VNode } from './leoNodes';
import { FileCommands } from "./leoFileCommands";
import { Commands } from './leoCommands';

//@-<< imports >>
//@+others
//@+node:felix.20211225220217.1: ** atFile.cmd
/**
 * Command decorator for the AtFileCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'atFileCommands']);
}
//@+node:felix.20211225222130.1: ** class AtFile
/**
 * A class implementing the atFile subcommander.
 */
export class AtFile {

    //@+<< define class constants >>
    //@+node:felix.20211225231453.1: *3* << define class constants >>

    // directives...
    static readonly noDirective = 1; // not an at-directive.
    static readonly allDirective = 2; // at-all (4.2)
    static readonly docDirective = 3; // @doc.
    static readonly atDirective = 4; // @<space> or @<newline>
    static readonly codeDirective = 5; // @code
    static readonly cDirective = 6; // @c<space> or @c<newline>
    static readonly othersDirective = 7; // at-others
    static readonly miscDirective = 8; // All other directives
    static readonly startVerbatim = 9; // @verbatim  Not a real directive. Used to issue warnings.
    //@-<< define class constants >>

    // **Warning**: all these ivars must **also** be inited in initCommonIvars.
    public c: Commands;
    public encoding: string = 'utf-8';  // 2014/08/13
    public fileCommands: FileCommands;
    public errors = 0;  // Make sure at.error() works even when not inited.
    // #2276: allow different section delims.
    public section_delim1: string = '<<';
    public section_delim2: string = '>>';
    // **Only** at.writeAll manages these flags.
    public unchangedFiles: number = 0;
    // promptForDangerousWrite sets cancelFlag and yesToAll only if canCancelFlag is True.
    public canCancelFlag: boolean = false;
    public cancelFlag: boolean = false;
    public yesToAll: boolean = false;
    // User options: set in reloadSettings.
    public checkPythonCodeOnWrite: boolean = false;
    public runPyFlakesOnWrite: boolean = false;
    public underindentEscapeString: string = '\\-';

    //@+others
    //@+node:felix.20211225231532.1: *3* at.Birth & init
    //@+node:felix.20211225231716.1: *4* constructor
    constructor(c: Commands) {
        this.c = c;
        this.fileCommands = c.fileCommands as FileCommands;
    }

    //@+node:felix.20211225233823.1: *3* readAll
    public readAll(root: Position, force: boolean = false): void {

    }
    //@+node:felix.20211225233821.1: *3* writeAll
    public writeAll(all: boolean = false, dirty: boolean = false): void {

    }
    //@+node:felix.20211225233822.1: *3* writeMissing
    public writeMissing(p: Position): void {

    }
    //@+node:felix.20220108204309.1: *3* writeOneAtEditNode
    public writeOneAtEditNode(p: Position): void {
        //
    }
    //@+node:felix.20220108170000.1: *3* read
    public read(p: Position): void {

    }
    //@+node:felix.20220122224516.1: *3* at.readAllSelected
    /**
     * Read all @<file> nodes in root's tree.
     */
    public readAllSelected(root: Position): void {

        const at = this;
        const c = this.c;

        // TODO !

        // const old_changed = c.changed;

        // t1 = time.time()
        // c.init_error_dialogs()
        // files = at.findFilesToRead(root, all=False)
        // for p in files:
        //     at.readFileAtPosition(p)
        // for p in files:
        //     p.v.clearDirty()
        // if not g.unitTesting:  # pragma: no cover
        //     if files:
        //         t2 = time.time()
        //         g.es(f"read {len(files)} files in {t2 - t1:2.2f} seconds")
        //     else:
        //         g.es("no @<file> nodes in the selected tree")
        // c.changed = old_changed
        // c.raise_error_dialogs()
    }
    //@+node:felix.20220108165923.1: *3* readOneAtAutoNode
    public readOneAtAutoNode(p: Position): Position {
        return p;
    }
    //@+node:felix.20220108170029.1: *3* readOneAtCleanNode
    public readOneAtCleanNode(p: Position): void {

    }
    //@+node:felix.20220108170054.1: *3* readOneAtEditNode
    public readOneAtEditNode(fn: string, p: Position): void {

    }
    //@+node:felix.20220108170138.1: *3* readOneAtAsisNode
    public readOneAtAsisNode(fn: string, p: Position): void {

    }
    //@+node:felix.20220111224436.1: *3* readAtShadowNodes
    public readAtShadowNodes(p: Position): Position {
        return p;
    }
    //@-others

}

// TODO

// atFile = AtFile  // compatibility
//@+node:felix.20211225222141.1: ** class FastAtRead
/**
 * Read an external file, created from an @file tree.
 * This is Vitalije's code, edited by EKR.
 */
export class FastAtRead {

    //@+others
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 60
//@-leo