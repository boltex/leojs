//@+leo-ver=5-thin
//@+node:felix.20211031230132.1: * @file src/core/leoConfig.ts
//@+<< imports >>
//@+node:felix.20211031230614.1: ** << imports >>
import { Commands } from './leoCommands';
import * as g from './leoGlobals';
// import { LeoUI } from '../leoUI';
// import { FileCommands } from "./leoFileCommands";
// import { CommanderOutlineCommands } from "../commands/commanderOutlineCommands";
// import { CommanderFileCommands } from "../commands/commanderFileCommands";

// import { Position, VNode, StackEntry } from "./leoNodes";
// import { NodeHistory } from './leoHistory';
// import { Undoer } from './leoUndo';

//@-<< imports >>
//@+others
//@+node:felix.20211031230501.1: ** class LocalConfigManager
/**
 * A class to hold config settings for commanders.
 */
export class LocalConfigManager {

    public c: Commands;
    public settingsDict: { [key: string]: any };

    // TODO : REPLACE WITH REAL TRANSLATION FROM LEO
    public default_derived_file_encoding: string = "utf-8";
    public default_at_auto_file_encoding: string = "utf-8";
    public new_leo_file_encoding: string = "UTF-8";
    public save_clears_undo_buffer: boolean = false;

    //@+others
    //@+node:felix.20211031231935.1: *3* constructor

    constructor(c: Commands) {
        this.c = c;
        this.settingsDict = {};

        // TODO : TEMP stub settings

        this.settingsDict['insert-new-nodes-at-end'] = false;
        this.settingsDict['max-undo-stack-size'] = 0;
        this.settingsDict['undo-granularity'] = 'line';

    }

    //@+node:felix.20211031234043.1: *3* get
    /**
     * Get the setting and make sure its type matches the expected type.
     */
    public get(setting: string): any {
        return this.settingsDict[setting];
    }
    //@+node:felix.20211031234046.1: *3* getInt
    public getInt(setting: string): any {
        return this.get(setting);
    }
    //@+node:felix.20211031234049.1: *3* getBool
    public getBool(setting: string): any {
        return this.get(setting);
    }
    //@+node:felix.20211031234059.1: *3* getString
    public getString(setting: string): any {
        return this.get(setting);
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
