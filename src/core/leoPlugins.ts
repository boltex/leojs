//@+leo-ver=5-thin
//@+node:felix.20240103231120.1: * @file src/core/leoPlugins.ts
/**
 * Classes relating to Leo's plugin architecture.
 */
//@+<< leoPlugins imports & annotations >>
//@+node:felix.20240103232627.1: ** << leoPlugins imports & annotations >>
import * as g from './leoGlobals';
import { Commands } from './leoCommands';
//@-<< leoPlugins imports & annotations >>
//@+others
//@+node:felix.20240103232148.1: ** Top-level functions (leoPlugins.py)
/**
 * Init g.app.pluginsController.
 */
export function init(): void {
    g.app.pluginsController = new LeoPluginsController();
}

/**
 * A wrapper so plugins can still call leoPlugins.registerHandler.
 */
export function registerHandler(tags: string | string[], fn: (tag: string, keywords: Record<string, unknown>) => unknown): void {
    return g.app.pluginsController.registerHandler(tags, fn);
}

//@+node:felix.20240103232527.1: ** class CommandChainDispatcher
/** 
 * Dispatch calls to a chain of commands until some func can handle it
 *
 * Usage: instantiate, execute "add" to add commands (with optional
 * priority), execute normally via f() calling mechanism.
 */
class CommandChainDispatcher {

    private chain: [number, ((...args: any[]) => any)][] = [];

    // TODO : Fix __call__ with generating a proxy!
    constructor(commands?: [number, ((...args: any[]) => any)][]) {
        if (commands) {
            this.chain = commands;
        }
    }

    /**
    * Command chain is called just like normal func.
    *
    * This will call all funcs in chain with the same args as were given to this
    * function, and return the result of first func that didn't raise
    * TryNext
    */
    public __call__(...args: any[]): void {
        // TODO : FIX THIS WITH proxy !!!
        for (const [_prio, cmd] of this.chain) {
            try {
                const ret = cmd(...args);
                return ret;
            } catch (exc: any) {
                if (exc.args) {
                    args = exc.args
                }
            }
        }
        // if no function will accept it, raise TryNext up to the caller
        throw new Error('Try Next');
    }

    public toString(): string {
        return JSON.stringify(this.chain);
    }
    /**
     * Add a func to the cmd chain with given priority
     */
    public add(func: (...args: any[]) => any, priority = 0): void {
        this.chain.push([priority, func]);
        this.chain.sort((a, b) => a[0] - b[0]);
    }
    /**
    * Return all objects in chain.
    *
    * Handy if the objects are not callable.
    */
    public [Symbol.iterator](): Iterator<[number, Function]> {
        return this.chain[Symbol.iterator]();
    }

}
//@+node:felix.20240103232554.1: ** class LeoPluginsController
/**
 * The global plugins controller, g.app.pluginsController
 */
class LeoPluginsController {

    // Keys are tags, values are lists of bunches.
    public handlers: Record<string, any[]> = {};
    // Keys are regularized module names, values are the names of .leo files
    // containing @enabled-plugins nodes that caused the plugin to be loaded
    public loadedModulesFilesDict: Record<string, string> = {};
    // Keys are regularized module names, values are modules.
    public loadedModules: Record<string, any> = {};
    // The stack of module names. The top is the module being loaded.
    public loadingModuleNameStack: string[] = [];
    public signonModule = undefined;  // A hack for plugin_signon.
    // Settings.  Set these here in case finishCreate is never called.
    public warn_on_failure = true;

    //@+others
    //@+node:felix.20240103232554.2: *3* plugins.Birth
    //@+node:felix.20240103232554.3: *4* plugins.ctor & reloadSettings
    constructor() {
        (g.act_on_node as CommandChainDispatcher) = new CommandChainDispatcher();
        (g.visit_tree_item as CommandChainDispatcher) = new CommandChainDispatcher();
        (g.tree_popup_handlers as ((...args: any[]) => any)[]) = [];
    }
    //@+node:felix.20240103232554.4: *4* plugins.finishCreate & reloadSettings
    public finishCreate(): void {
        this.reloadSettings();
    }
    public reloadSettings(): void {
        this.warn_on_failure = g.app.config.getBool('warn_when_plugins_fail_to_load', true);
    }
    //@+node:felix.20240103232554.5: *3* plugins.Event handlers
    //@+node:felix.20240103232554.6: *4* plugins.on_idle
    /**
     * Call all idle-time hooks.
     */
    public on_idle(): void {

        if (g.app.idle_time_hooks_enabled) {
            for (const frame of g.app.windowList) {
                const c = frame.c;
                // Do NOT compute c.currentPosition.
                // This would be a MAJOR leak of positions.
                g.doHook("idle", { "c": c });
            }
        }
    }
    //@+node:felix.20240103232554.7: *4* plugins.doHandlersForTag & helper
    /**
     * Execute all handlers for a given tag, in alphabetical order.
     * The caller, doHook, catches all exceptions.
     */
    public doHandlersForTag(tag: string, keywords: Record<string, any>): any {

        if (g.app.killed) {
            return undefined;
        }

        // Execute hooks in some random order.
        // Return if one of them returns a non-None result.
        if (this.handlers[tag]) {

            for (const bunch of this.handlers[tag]) {
                const val = this.callTagHandler(bunch, tag, keywords);
                if (val != null) {
                    return val;
                }
            }
        }

        if (this.handlers['all']) {
            const bunches = this.handlers['all'];
            for (const bunch of bunches) {
                this.callTagHandler(bunch, tag, keywords);
            }
        }
        return undefined;

    }
    //@+node:felix.20240103232554.8: *5* plugins.callTagHandler
    /**
     * Call the event handler.
     */
    public callTagHandler(bunch: any, tag: string, keywords: Record<string, any>): any {

        const handler = bunch.moduleName;
        const moduleName = bunch.fn;
        // Make sure the new commander exists.
        for (const key of ['c', 'new_c']) {
            const c = keywords[key];
            if (c) {
                // Make sure c exists and has a frame.
                if (!c.exists || !c['frame']) {
                    // g.pr('skipping tag %s: c does not exist or does not have a frame.' % tag)
                    return undefined;
                }
            }
        }
        // Calls to registerHandler from inside the handler belong to moduleName.
        this.loadingModuleNameStack.push(moduleName);
        let result;
        try {
            result = handler(tag, keywords);
        } catch (e) {
            g.es(`hook failed: ${tag}, ${handler}, ${moduleName}`);
            g.es_exception(e);
            result = undefined;
        }

        this.loadingModuleNameStack.pop();
        return result;

    }
    //@+node:felix.20240103232554.9: *4* plugins.doPlugins (g.app.hookFunction)
    /**
     * The default g.app.hookFunction.
     */
    public doPlugins(tag: string, keywords: Record<string, any>): any {

        if (g.app.killed) {
            return undefined;
        }
        if (['start1', 'open0'].includes(tag)) {
            // TODO : Needed in LEOJS ?
            // this.loadHandlers(tag, keywords);
        }
        return this.doHandlersForTag(tag, keywords);

    }
    //@+node:felix.20240103232554.28: *3* plugins.Registration
    //@+node:felix.20240103232554.29: *4* plugins.registerExclusiveHandler
    /**
     * Register one or more exclusive handlers
     */
    public registerExclusiveHandler(tags: string | string[], fn: () => any): void {

        if (Array.isArray(tags)) {
            for (const tag of tags) {
                this.registerOneExclusiveHandler(tag, fn);
            }
        } else {
            this.registerOneExclusiveHandler(tags, fn);
        }
    }
    /**
     * Register one exclusive handler
     */
    public registerOneExclusiveHandler(tag: string, fn: () => any): void {
        let moduleName = '';
        try {
            moduleName = this.loadingModuleNameStack[this.loadingModuleNameStack.length - 1];
        } catch (e) {
            moduleName = '<no module>'
        }
        // print(f"{g.unitTesting:6} {moduleName:15} {tag:25} {fn.__name__}")
        if (g.unitTesting) {
            return;
        }
        if (this.handlers[tag]) {
            g.es(`*** Two exclusive handlers for '${tag}'`);
        } else {
            const bunch = { 'fn': fn, 'moduleName': moduleName, 'tag': 'handler' };
            const aList = this.handlers[tag] || [];
            aList.push(bunch);
            this.handlers[tag] = aList;
        }
    }
    //@+node:felix.20240103232554.30: *4* plugins.registerHandler & registerOneHandler
    /**
     * Register one or more handlers
     */
    public registerHandler(tags: string | string[], fn: () => any): void {

        if (Array.isArray(tags)) {
            for (const tag of tags) {
                this.registerOneHandler(tag, fn);
            }
        } else {
            this.registerOneHandler(tags, fn);
        }
    }

    /**
     * Register one handler
     */
    public registerOneHandler(tag: string, fn: () => any): void {
        let moduleName = '';
        try {
            moduleName = this.loadingModuleNameStack[this.loadingModuleNameStack.length - 1];
        } catch (e) {
            moduleName = '<no module>';
        }
        // print(f"{g.unitTesting:6} {moduleName:15} {tag:25} {fn.__name__}")
        const items = this.handlers[tag] || [];
        const functions = items.map(z => z.fn);
        if (!functions.includes(fn)) { // Vitalije
            const bunch = { 'fn': fn, 'moduleName': moduleName, 'tag': 'handler' };
            items.push(bunch);
        }

        this.handlers[tag] = items;
    }
    //@+node:felix.20240103232554.31: *4* plugins.unregisterHandler
    public unregisterHandler(tags: string | string[], fn: () => any): void {
        if (Array.isArray(tags)) {
            for (const tag of tags) {
                this.unregisterOneHandler(tag, fn);
            }
        } else {
            this.unregisterOneHandler(tags, fn);
        }
    }
    public unregisterOneHandler(tag: string, fn: () => any): void {
        let bunches = this.handlers[tag];
        bunches = bunches.filter(bunch => bunch && bunch.fn !== fn);
        this.handlers[tag] = bunches;
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70

//@-leo
