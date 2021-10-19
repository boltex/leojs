import * as g from './leoGlobals';


/**
 * * Add to the commandsDict
 */
export function commander_command(p_name: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        console.log('ran inside decorator, NAME WAS ----> ' + p_name);
        // console.log('target ', target);
        // console.log('propertyKey ', propertyKey);
        // console.log('descriptor ', descriptor);

        console.log(g.global_commands_dict);
        if (!g.global_commands_dict) {
            //@ts-expect-error
            g.global_commands_dict = {};
        }
        g.global_commands_dict[p_name] = descriptor.value;

    };
}

