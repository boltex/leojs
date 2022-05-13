//@+leo-ver=5-thin
//@+node:felix.20220512205042.1: * @file src/core/leoFrame.ts
/**
 * Frame for typescript client support
 */
//@+<< imports >>
//@+node:felix.20220512211158.1: ** << imports >>
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';
import { Commands } from "./leoCommands";
import { Position } from './leoNodes';

//@-<< imports >>

//@+others
//@+node:felix.20220512211744.1: ** class LeoFrame
export class LeoFrame {

    public c: Commands;
    public title: string;
    public gui: LeoUI;
    public openDirectory: string;
    public iconBar: any;
    public saved: boolean;
    public tree: {
        generation: number;
        editLabel: (
            p: Position,
            selectAll: boolean,
            selection: any
        ) => void;
    };
    public body: any;

    //@+others
    //@+node:felix.20220512211350.1: *3* frame.ctor
    constructor(c: Commands, title: string, gui: LeoUI) {
        this.c = c;
        this.title = title;
        this.gui = gui;
        this.saved = false;
        this.openDirectory = '';
        this.iconBar = {};

        this.tree = {
            generation: 0,
            editLabel: (p: Position, selectAll: boolean, selection: any) => {
                console.log(
                    'TODO: editLabel not used in leojs. From c.frame.tree.editLabel'
                );
            }
        };

        this.body = {
            wrapper: {
                setAllText: (s: string) => {
                    console.log('TODO: setAllText of c.frame.body.wrapper');
                }
            }
        };
    }
    //@+node:felix.20220512220820.1: *3* destroySelf
    public destroySelf(): void {
        console.log('TODO: DestroySelf');

    }
    //@+node:felix.20220512222542.1: *3* finishCreate
    public finishCreate() {
        g.app.windowList.push(this);
    }
    //@-others

}
//@-others

//@@language typescript
//@@tabwidth -4
//@-leo
