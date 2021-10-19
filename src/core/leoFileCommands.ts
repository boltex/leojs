import { VNode } from "./leoNodes";
import { Commands } from "./leoCommands";
import * as fs from 'fs';

export class FileCommands {

    public c: Commands;
    public gnxDict: { [key: string]: VNode; };

    constructor(c: Commands) {
        this.c = c;
        this.gnxDict = {};
    }

    /**
     * File Commands Test
     */
    public fileCommandsTest(): void {
        // Test command
        console.log('fileCommandsTest Called !!');
    }


}


