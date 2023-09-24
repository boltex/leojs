//@+leo-ver=5-thin
//@+node:felix.20230914004349.1: * @file src/writers/basewriter.ts
import { AtFile } from "../core/leoAtFile";
import { Commands } from "../core/leoCommands";
import { Position } from "../core/leoNodes";

/**
 * A module defining the base class for all writers in leo.plugins.writers.
 */
export class BaseWriter {
    c: Commands;
    at: AtFile;  // Replace 'any' with the actual type when available.


    /**
     * Ctor for leo.plugins.writers.BaseWriter.
     */
    constructor(c: Commands) {
        this.c = c;
        this.at = c.atFileCommands;
        this.at.outputList = [];
    }

    //@+others
    //@+node:felix.20230914004349.2: ** basewriter.put
    /**
     * Write line s using at.os, taking special care of newlines.
     */
    public put(s: string): void {
        const at = this.at;
        at.os(s.endsWith('\n') ? s.slice(0, -1) : s);
        at.onl();
    }
    //@+node:felix.20230914004349.3: ** basewriter.put_node_sentinel
    /**
     * Put an @+node sentinel for node p.
     */
    public put_node_sentinel(p: Position, delim: string, delim2 = ''): void {
        const at = this.at;
        // Like at.nodeSentinelText.
        const gnx = p.v.fileIndex;
        const level = p.level();
        let s = '';
        if (level > 2) {
            s = `${gnx}: *${level}* ${p.h}`;
        } else {
            s = `${gnx}: ${'*'.repeat(level)} ${p.h}`;
        }
        // Like at.putSentinel.
        at.os(`${delim}@+node:${s}${delim2}`);
        at.onl();
    }
    //@+node:felix.20230914004349.4: ** basewriter.write
    public write(root: Position): void {
        throw new Error('must be overridden in subclasses');
    }
    //@-others
}

//@@language typescript
//@@tabwidth -4
//@-leo
