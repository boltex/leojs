import { Position } from "./leoNodes";

/**
 * A per-outline class.
 * The "c" predefined object is an instance of this class.
 */
export class Commander {

    // Official ivars.
    private _currentPosition: Position | null = null;
    public hiddenRootNode = null;
    public mFileName: string;
    public mRelativeFileName = null;

    constructor(fileName: string) {
        this.mFileName = fileName;
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



