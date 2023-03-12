//@+leo-ver=5-thin
//@+node:felix.20211018202009.1: * @file src/core/decorators.ts
//@+<< imports >>
//@+node:felix.20220103234644.1: ** << imports >>
import * as g from './leoGlobals';
//@-<< imports >>
//@+others
//@+node:felix.20220103234521.1: ** commander_command
/**
 * * Adds to the commandsDict
 */
export function commander_command(p_name: string, p_doc: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Injecting doc, func_name & name in the dict to build menus,
        // like leo does for it's for plugins_menu.py.
        const commander_command_wrapper = Object.assign(
            descriptor.value, // the "func itself"
            { __doc__: p_doc },
            { __func_name__: propertyKey },
            { __name__: p_name },
            { is_command: true },
            { command_name: p_name }
        );

        if (!g.global_commands_dict) {
            // @ts-expect-error
            g.global_commands_dict = {};
        }
        g.global_commands_dict[p_name] = commander_command_wrapper;

    };
}
//@+node:felix.20220103234541.1: ** command
/**
 * * Adds to the commandsDict, COPY OF commander_command FOR NOW
 */
export function command(p_name: string, p_doc: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Injecting doc, func_name & name in the dict to build menus,
        // like leo does for it's for plugins_menu.py.
        const commander_command_wrapper = Object.assign(
            descriptor.value, // the "func itself"
            { __doc__: p_doc },
            { __func_name__: propertyKey },
            { __name__: p_name },
            { is_command: true },
            { command_name: p_name }
        );

        if (!g.global_commands_dict) {
            // @ts-expect-error
            g.global_commands_dict = {};
        }
        g.global_commands_dict[p_name] = commander_command_wrapper;

    };
}
//@+node:felix.20220103234556.1: ** new_cmd_decorator
/**
 * Return a new decorator for a command with the given name.
 * Compute the class *instance* using the ivar string or list.
 *
 * Don't even think about removing the @cmd decorators!
 * See https://github.com/leo-editor/leo-editor/issues/325
 */
export function new_cmd_decorator(p_name: string, p_doc: string, ivars: string[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Like commander_command but the ivars array (base object and sub object/subcommander)
        // are also added to the func itself.
        // So this original 'new_cmd_decorator' is implemented at run time with c.commandsDict.
        // (For an example, see leojs source code in the 'command' method of leoUI.ts )
        const commander_command_wrapper = Object.assign(
            descriptor.value, // the "func itself"
            { __doc__: p_doc },
            { __func_name__: propertyKey },
            { __name__: p_name },
            { __ivars__: ivars }
        );

        if (!g.global_commands_dict) {
            // @ts-expect-error
            g.global_commands_dict = {};
        }
        g.global_commands_dict[p_name] = commander_command_wrapper;

    };
}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
