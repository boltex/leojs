import * as g from './leoGlobals';

/**
 * * Add to the commandsDict
 */
export function commander_command(p_name: string, p_doc: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Just injecting doc, func_name and name in the dict object to build menus, 
        // like leo does for it's for plugins_menu.py.
        const commander_command_wrapper = Object.assign(
            descriptor.value, // the "func itself"
            { __doc__: p_doc },
            { __func_name__: propertyKey },
            { __name__: p_name },
        );

        if (!g.global_commands_dict) {
            //@ts-expect-error
            g.global_commands_dict = {};
        }
        g.global_commands_dict[p_name] = commander_command_wrapper;

    };
}

export function new_cmd_decorator(p_name: string, p_doc: string, ivars: string[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Like commander_command but the ivars array (base object and sub object/subcommander)
        // are also added to the func itself. So this original 'new_cmd_decorator' is implemented 
        // at run time with c.commandsDict. 
        // (For an example, see leojs source code in the 'command' method of leoUI.ts )
        const commander_command_wrapper = Object.assign(
            descriptor.value, // the "func itself"
            { __doc__: p_doc },
            { __func_name__: propertyKey },
            { __name__: p_name },
            {__ivars__: ivars}
        );

        if (!g.global_commands_dict) {
            //@ts-expect-error
            g.global_commands_dict = {};
        }
        g.global_commands_dict[p_name] = commander_command_wrapper;

    };
}
