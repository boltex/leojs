import { Position } from "./leoNodes";
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';

/**
 * A per-outline class. Called 'class Commands' in Leo's python source
 * The "c" predefined object is an instance of this class.
 */
export class Commander {

    // Official ivars.
    private _currentPosition: Position | null = null;
    public hiddenRootNode = null;
    public mFileName: string;
    public mRelativeFileName = null;
    public gui:LeoUI;

    constructor(
        fileName: string,
        gui?:LeoUI,
        previousSettings?:any,
        relativeFileName?:any

    ) {
        this.mFileName = fileName;
        this.gui = gui || g.app.gui;
    }

    public recolor():void {
        console.log("recolor");
    }

    public redraw():void {
        console.log("redraw");
    }

    public redraw_after_icons_changed():void {
        console.log("redraw_after_icons_changed");
    }


}


