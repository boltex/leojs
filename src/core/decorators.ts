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
        // but leojs does NOT need injection of ivars in the func itself
        // like leo does for it's for plugins_menu.py.
        const commander_command_wrapper = Object.assign(
            descriptor.value,
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
        // TODO

    };
}
