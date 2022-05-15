//@+leo-ver=5-thin
//@+node:felix.20220105221256.1: * @file src/core/leoImport.ts

import { Commands } from "./leoCommands";

export class LeoImportCommands {

    // TODO

    public c: Commands;

    constructor(c: Commands) {
        this.c = c;
    }

    public async exportHeadlines(fileName: string): Promise<unknown> {
        // TODO !
        console.log('TODO: exportHeadlines');
        return;
    }

    public async flattenOutline(fileName: string): Promise<unknown> {
        // TODO !
        console.log('TODO: flattenOutline');
        return;
    }

    public async outlineToWeb(fileName: string, webType: string): Promise<unknown> {
        // TODO !
        console.log('TODO: outlineToWeb');
        return;
    }

    public async removeSentinelsCommand(names: string[]): Promise<unknown> {
        // TODO !
        console.log('TODO: removeSentinelsCommand');
        return;
    }

    public async weave(fileName: string): Promise<unknown> {
        // TODO !
        console.log('TODO: weave');
        return;
    }

    public async readAtAutoNodes(): Promise<unknown> {
        // TODO !
        console.log('TODO: readAtAutoNodes');
        return;
    }

}

//@-leo
