//@+leo-ver=5-thin
//@+node:felix.20211002221425.1: * @file src/commands/commanderOutlineCommands.ts
// * Outline commands that used to be defined in leoCommands.py
// import xml.etree.ElementTree as ElementTree
// from leo.core import leoGlobals as g
import * as g from '../core/leoGlobals';

// import g = require("../core/leoGlobals");
import { commander_command } from "../core/decorators";

// from leo.core import leoNodes
import { NodeIndices, Position, VNode } from "../core/leoNodes";

// from leo.core import leoFileCommands
import { FileCommands } from "../core/leoFileCommands";
import { Commands } from "../core/leoCommands";

// function commander_command(name: string) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         const original = descriptor.value;
//         console.log('name:' + name);
//         console.log('running decorator commander_command, propertyKey:' + propertyKey);
//     };
// }

// console.log("hi", g.globalDirectiveList)

export class CommanderOutlineCommands {

    //@+others
    //@+node:felix.20211017224825.1: ** outlineCommandsTest : selectVisNext
    // @g.commander_command('goto-next-visible')
    @commander_command('goto-next-visible')
    public selectVisNext(this: Commands): void {

        console.log(this.gui.leo_c.p.h);

        console.log('selectVisNext Called!!');

        console.log(g.global_commands_dict);


    }

    //@-others

}
//@-leo
