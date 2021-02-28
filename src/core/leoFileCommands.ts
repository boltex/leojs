import { VNode } from "./leoNodes";
import { Commander } from "./leoCommander";
import * as fs from 'fs';

export class FileCommands {
    
    public c: Commander;
    public gnxDict: { [key: string]: VNode; };

    constructor(c:Commander) {
        this.c = c;
        this.gnxDict = {};
    }


}


