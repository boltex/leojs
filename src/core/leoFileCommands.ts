import { VNode } from "./leoNodes";
import { Commands } from "./leoCommands";
import * as fs from 'fs';

export class DummyFileCommands {

    public gnxDict: { [key: string]: VNode; };

    constructor() {
        this.gnxDict = {};
    }


}

export class FileCommands extends DummyFileCommands {

    public c: Commands;
    public gnxDict: { [key: string]: VNode; };

    constructor(c: Commands) {
        super();
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


