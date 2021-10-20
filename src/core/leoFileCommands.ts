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
    public leoFileCommandsTest(): void {
        // Test command
        console.log('CORE leo fileCommandsTest Called !!');
    }


}


