import { VNode } from "./leoNodes";
import { Commands } from "./leoCommander";
import * as fs from 'fs';

export class FileCommands {

    public c: Commands;
    public gnxDict: { [key: string]: VNode; };

    constructor(c: Commands) {
        this.c = c;
        this.gnxDict = {};
    }


}


