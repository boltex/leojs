//@+leo-ver=5-thin
//@+node:felix.20230924174338.1: * @file src/core/mod_scripting.ts
//@+<< mod_scripting docstring >>
//@+node:felix.20230924174338.2: ** << mod_scripting docstring >>
/*
This plugin script buttons and eval* commands.

Overview of script buttons
--------------------------

This plugin puts buttons in the icon area. Depending on settings the plugin will
create the 'Run Script', the 'Script Button' and the 'Debug Script' buttons.

The 'Run Script' button is simply another way of doing the Execute Script
command: it executes the selected text of the presently selected node, or the
entire text if no text is selected.

The 'Script Button' button creates *another* button in the icon area every time
you push it. The name of the button is the headline of the presently selected
node. Hitting this *newly created* button executes the button's script.

For example, to run a script on any part of an outline do the following:

1.  Select the node containing the script.
2.  Press the scriptButton button.  This will create a new button.
3.  Select the node on which you want to run the script.
4.  Push the *new* button.

Script buttons create commands
------------------------------

For every @button node, this plugin creates two new minibuffer commands: x and
delete-x-button, where x is the 'cleaned' name of the button. The 'x' command is
equivalent to pushing the script button.


Global buttons and commands
---------------------------

You can specify **global buttons** in leoSettings.leo or myLeoSettings.leo by
putting \@button nodes as children of an @buttons node in an \@settings trees.
Such buttons are included in all open .leo (in a slightly different color).
Actually, you can specify global buttons in any .leo file, but \@buttons nodes
affect all later opened .leo files so usually you would define global buttons in
leoSettings.leo or myLeoSettings.leo.

The cleaned name of an @button node is the headline text of the button with:

- Leading @button or @command removed,
- @key and all following text removed,
- @args and all following text removed,
- @color and all following text removed,
- all non-alphanumeric characters converted to a single '-' characters.

Thus, cleaning headline text converts it to a valid minibuffer command name.

You can delete a script button by right-clicking on it, or by
executing the delete-x-button command.

.. The 'Debug Script' button runs a script using an external debugger.

This plugin optionally scans for @script nodes whenever a .leo file is opened.
Such @script nodes cause a script to be executed when opening a .leo file.
They are security risks, and are never enabled by default.

Settings
--------

You can specify the following options in myLeoSettings.leo.  See the node:
@settings-->Plugins-->scripting plugin.  Recommended defaults are shown::

    @bool scripting-at-button-nodes = True
    True: adds a button for every @button node.

    @bool scripting-at-rclick-nodes = False
    True: define a minibuffer command for every @rclick node.

    @bool scripting-at-commands-nodes = True
    True: define a minibuffer command for every @command node.

    @bool scripting-at-plugin-nodes = False
    True: dynamically loads plugins in @plugin nodes when a window is created.

    @bool scripting-at-script-nodes = False
    True: dynamically executes script in @script nodes when a window is created.
    This is dangerous!

    @bool scripting-create-debug-button = False
    True: create Debug Script button.

    @bool scripting-create-run-script-button = False
    True: create Run Script button.
    Note: The plugin creates the press-run-script-button regardless of this setting.

    @bool scripting-create-script-button-button = True
    True: create Script Button button in icon area.
    Note: The plugin creates the press-script-button-button regardless of this setting.

    @int scripting-max-button-size = 18
    The maximum length of button names: longer names are truncated.

Shortcuts for script buttons
----------------------------

You can bind key shortcuts to @button and @command nodes as follows:

@button name @key=shortcut

    Binds the shortcut to the script in the script button. The button's name is
    'name', but you can see the full headline in the status line when you move the
    mouse over the button.

@command name @key=shortcut

    Creates a new minibuffer command and binds shortcut to it. As with @buffer
    nodes, the name of the command is the cleaned name of the headline.

Binding arguments to script buttons with @args
----------------------------------------------

You can run @button and @command scripts with sys.argv initialized to string values using @args.
For example::

    @button test-args @args = a,b,c

will set sys.argv to ['a', 'b', 'c'].

You can set the background color of buttons created by @button nodes by using @color.
For example::

    @button my button @key=Ctrl+Alt+1 @color=white @args=a,b,c

This creates a button named 'my-button', with a color of white, a keyboard shortcut
of Ctrl+Alt+1, and sets sys.argv to ['a', 'b', 'c'] within the context of the script.

Eval Commands
-------------

The mod_scripting plugin creates the following 5 eval* commands:

eval
----

Evaluates the selected text, if any, and remember the result in c.vs, a global namespace.
For example::

    a = 10

sets:

    c.vs['a'] = 10

This command prints the result of the last expression or assignment in the log pane
and select the next line of the body pane. Handy for executing line by line.

eval-last
---------

Inserts the result of the last eval in the body.
Suppose you have this text::

    The cat is 7 years, or 7*365 days old.

To replace 7*365 with 2555, do the following::

    select 7*367
    eval
    delete 7*365
    do eval-last

eval-replace
------------

Evaluates the expression and replaces it with the computed value.
For example, the example above can be done as follows::


    select 7*367
    eval-replace

eval-last-pretty
----------------

Like eval-last, but format with pprint.pformat.

eval-block
----------

Evaluates a series of blocks of code in the body, separated like this::

    # >>>
    code to run
    # <<<
    output of code
    # >>>
    code to run
    # <<<
    output of code
    ...

For example::

    import datetime
    datetime.datetime.now()
    # >>>
    2018-03-21 21:46:13.582835
    # <<<
    datetime.datetime.now()+datetime.timedelta(days=1000)
    # >>>
    2020-12-15 21:46:34.403814
    # <<<

eval-block inserts the separators, blocks can be re-run by placing the cursor in
them and doing eval-block, and the cursor is placed in the next block, so you
can go back up, change something, then quickly re-execute everything.

Acknowledgements
----------------

This plugin is based on ideas from e's dynabutton plugin, possibly the
most brilliant idea in Leo's history.
*/
//@-<< mod_scripting docstring >>
//@+<< mod_scripting imports & annotations >>
//@+node:felix.20230924174338.3: ** << mod_scripting imports & annotations >>
import * as vscode from 'vscode';

import * as g from '../core/leoGlobals';

import { new_cmd_decorator } from '../core/decorators';

import { Position } from '../core/leoNodes';
import { Commands } from '../core/leoCommands';

import { LoadManager, PreviousSettings } from '../core/leoApp';
import { AtFile } from '../core/leoAtFile';
import { NullGui } from '../core/leoGui';
import { NullIconBarClass, nullButtonWidget } from './leoFrame';

type Widget = any;
type Wrapper = any;

//@-<< mod_scripting imports & annotations >>

//@+others
//@+node:felix.20230924174338.4: ** cmd decorator
/**
 * Command decorator for the EvalController class.
 */
function eval_cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'evalController']);
}
//@+node:felix.20230924174338.6: ** build_rclick_tree
// Define RClick as an interface
export interface RClick {
    // name?: string;
    position: Position;
    children: RClick[];
}

/**
 * Return a list of top level RClicks for the button at command_p, which can be
 * used later to add the rclick menus.
 *
 * After building a list of @rclick children and following siblings of the
 * @button this method applies itself recursively to each member of that list
 * to handle submenus.
 *
 * :Parameters:
 * - `command_p`: node containing @button. May be None
 * - `rclicks`: list of RClicks to add to, created if needed
 * - `top_level`: is this the top level?
 */
export function build_rclick_tree(command_p: Position | undefined, rclicks: RClick[] = [], top_level: boolean = false): RClick[] {

    const at_others_pat = new RegExp('^\\s*@others\\b', 'm');

    /**
     * Return True if p.b has a valid @others directive.
     */
    function has_at_others(p: Position): boolean {
        if ('others' in g.globalDirectiveList) {
            return at_others_pat.test(p.b);
        }
        return false;
    }

    if (rclicks == null) {
        rclicks = [];
    }

    if (top_level) {
        // command_p will be None for leoSettings.leo and myLeoSettings.leo.
        if (command_p && command_p.__bool__()) {
            if (!has_at_others(command_p)) {
                rclicks.push(...[...command_p.children()].map(i => ({
                    position: i.copy(),
                    children: [],
                } as RClick)));
            }
            for (const i of command_p.following_siblings()) {
                if (i.h.startsWith('@rclick ')) {
                    rclicks.push({ position: i.copy(), children: [] });
                } else {
                    break;
                }
            }
        }
        for (const rc of rclicks) {
            build_rclick_tree(rc.position, rc.children, false);
        }
    } else {
        if (!command_p || !command_p.__bool__()) {
            return []; // sub menus can't have body text
        }
        if (command_p.b.trim()) {
            return [];
        }
        for (const child of command_p.children()) {
            const rc: RClick = { position: child.copy(), children: [] };
            rclicks.push(rc);
            build_rclick_tree(rc.position, rc.children, false);
        }
    }
    return rclicks;
}
//@+node:felix.20230924174338.9: ** class AtButtonCallback
/**
 * A class whose __call__ method is a callback for @button nodes.
 */
export class AtButtonCallback {

    public b: any;
    public buttonText: string | undefined;
    public c: Commands;
    public controller: ScriptingController;
    public gnx: string;
    public script: string | undefined;
    public source_c: Commands;
    public __doc__: string;

    //@+others
    //@+node:felix.20230924174338.10: *3* __init__ (AtButtonCallback)
    /**
     * AtButtonCallback.__init__.
     */
    constructor(
        controller: ScriptingController,
        b: any,
        c: Commands,
        buttonText: string | undefined,
        docstring: string,
        gnx: string,
        script?: string,
    ) {
        this.b = b;  // A QButton.
        this.buttonText = buttonText;  // The text of the button.
        this.c = c;  // A Commander.
        this.controller = controller;  // A ScriptingController instance.
        this.gnx = gnx;  // Set if the script is defined in the local .leo file.
        this.script = script;  // The script defined in myLeoSettings.leo or leoSettings.leo
        this.source_c = c;  // For GetArgs.command_source.
        this.__doc__ = docstring;  // The docstring for this callback for g.getDocStringForFunction.
        this.__call__ = this.__call__.bind(this);
    }
    //@+node:felix.20230924174338.11: *3* __call__ (AtButtonCallback)
    /**
     * AtButtonCallbgack.__call__. The callback for @button nodes.
     */
    public __call__(): Promise<void> {
        return this.execute_script();
    }
    //@+node:felix.20230924174338.14: *3* AtButtonCallback.execute_script & helper
    /**
     * Execute the script associated with this button.
     */
    public async execute_script(): Promise<void> {

        const script = await this.find_script();
        if (script) {
            await this.controller.executeScriptFromButton(
                this.b,
                this.buttonText,
                undefined,
                this.gnx,
                script,
            );
        }
    }
    //@+node:felix.20230924174338.15: *4* AtButtonCallback.find_script
    public async find_script(): Promise<string> {
        let script: string = "";
        // First, search self.c for the gnx.
        for (const p of this.c.all_positions()) {
            if (p.gnx === this.gnx) {
                script = await this.controller.getScript(p);
                return script;
            }
        }
        let c;
        // See if myLeoSettings.leo is open.
        for (const w_c of g.app.commanders()) {
            if (w_c.shortFileName().endsWith('myLeoSettings.leo')) {
                c = w_c;
                break;
            }
        }
        if (c) {
            // Search myLeoSettings.leo file for the gnx.
            for (const p of c.all_positions()) {
                if (p.gnx === this.gnx) {
                    script = await this.controller.getScript(p);
                    return script;
                }
            }
        }
        return this.script as string;
    }
    //@-others

}
//@+node:felix.20230924174338.16: ** class ScriptingController
/**
 * A class defining scripting commands.
 */
export class ScriptingController {

    public c: Commands;  // Replace with the actual type of Cmdr
    public gui: any; // Replace with the actual type of the GUI
    public scanned: boolean;
    public buttonsArray: nullButtonWidget[]; // ! LEOJS : ARRAY INSTEAD OF DICT ! 
    public debuggerKind: string;
    public atButtonNodes: boolean;
    public atCommandsNodes: boolean;
    public atRclickNodes: boolean;
    public atPluginNodes: boolean;
    public atScriptNodes: boolean;
    public createDebugButton: boolean;
    public createRunScriptButton: boolean;
    public createScriptButtonButton: boolean;
    public maxButtonSize: number;
    public iconBar: NullIconBarClass;  // Replace with the actual type of Widget
    public seen: Set<string>;

    //@+others
    //@+node:felix.20230924174338.17: *3*  sc.ctor
    constructor(c: Commands, iconBar?: Widget) {
        this.c = c;
        this.gui = c.frame.gui;
        const getBool = c.config.getBool.bind(c.config);
        this.scanned = false;
        const kind = c.config.getString('debugger-kind') || 'idle';
        this.buttonsArray = [];
        this.debuggerKind = kind.toLowerCase();

        // True: adds a button for every @button node.
        this.atButtonNodes = getBool('scripting-at-button-nodes');
        // True: define a minibuffer command for every @command node.
        this.atCommandsNodes = getBool('scripting-at-commands-nodes');
        // True: define a minibuffer command for every @rclick node.
        this.atRclickNodes = getBool('scripting-at-rclick-nodes');
        // True: dynamically loads plugins in @plugin nodes when a window is created.
        this.atPluginNodes = getBool('scripting-at-plugin-nodes');
        // # DANGEROUS! True: dynamically executes script in @script nodes when a window is created.
        this.atScriptNodes = getBool('scripting-at-script-nodes');

        // Do not allow this setting to be changed in local (non-settings) .leo files.
        if (this.atScriptNodes && c.config.isLocalSetting('scripting-at-script-nodes', 'bool')) {
            g.issueSecurityWarning('@bool scripting-at-script-nodes');
            // Restore the value in myLeoSettings.leo
            let val = g.app.config.valueInMyLeoSettings('scripting-at-script-nodes');
            if (val == null) {
                val = false;
            }
            g.es('Restoring value to', val);
            this.atScriptNodes = val;
        }

        // True: create Debug Script button.
        this.createDebugButton = getBool('scripting-create-debug-button');
        // True: create Run Script button.
        this.createRunScriptButton = getBool('scripting-create-run-script-button');
        // True: create Script Button button.
        this.createScriptButtonButton = getBool('scripting-create-script-button-button');
        // Maximum length of button names.
        this.maxButtonSize = c.config.getInt('scripting-max-button-size') || 18;

        if (!iconBar) {
            this.iconBar = c.frame.iconBar; // c.frame.getIconBar();
        } else {
            this.iconBar = iconBar;
        }

        this.seen = new Set();
    }
    //@+node:felix.20230924174338.18: *3* sc.Callbacks
    //@+node:felix.20230924174338.19: *4* sc.addScriptButtonCommand
    /**
     * Called when the user presses the 'script-button' button or executes the script-button command.
     */
    public addScriptButtonCommand(): void {
        const c = this.c;
        const p = c.p;
        const h = p.h;
        const buttonText = this.getButtonText(h);
        let shortcut = this.getShortcut(h);
        let statusLine = `Run Script: ${buttonText}`;
        if (shortcut) {
            statusLine += ` @key=${shortcut}`;
        }
        this.createLocalAtButtonHelper(p, h, statusLine, 'script-button', true);
        c.bodyWantsFocus();
    }
    //@+node:felix.20230924174338.23: *4* sc.runScriptCommand
    /**
     * Called when user presses the 'run-script' button or executes the run-script command.
     */
    public async runScriptCommand(): Promise<void> {
        const c = this.c;
        const p = c.p;
        const args = this.getArgs(p);
        g.app.scriptDict = { 'script_gnx': p.gnx };
        await c.executeScript(
            args,
            p,
            '',
            true,
        );
        if (0) {
            // Do not assume the script will want to remain in this commander.
            c.bodyWantsFocus();
        }
    }
    //@+node:felix.20230924174338.24: *3* sc.createAllButtons
    /**
     * Scan for @button, @rclick, @command, @plugin and @script nodes.
     */
    public async createAllButtons(): Promise<void> {
        const c = this.c;
        if (this.scanned) {
            return; // Defensive.
        }
        this.scanned = true;

        // First, create standard buttons.
        if (this.createRunScriptButton) {
            this.createRunScriptIconButton();
        }
        if (this.createScriptButtonButton) {
            this.createScriptButtonIconButton();
        }
        if (this.createDebugButton) {
            this.createDebugIconButton();
        }

        // Next, create common buttons and commands.
        await this.createCommonButtons();
        await this.createCommonCommands();

        // Handle all other nodes.
        const d: Record<string, (p: Position) => any> = {
            'button': this.handleAtButtonNode,
            'command': this.handleAtCommandNode,
            'plugin': this.handleAtPluginNode,
            'rclick': this.handleAtRclickNode,
            'script': this.handleAtScriptNode,
        };
        const pattern = new RegExp('^@(button|command|plugin|rclick|script)\\b');
        let p = c.rootPosition();
        while (p && p.__bool__()) {
            const gnx = p.v.gnx;
            if (p.isAtIgnoreNode()) {
                p.moveToNodeAfterTree();
            } else if (this.seen.has(gnx)) {
                if (p.h.startsWith('@rlick')) {
                    this.handleAtRclickNode(p);
                }
                p.moveToThreadNext();
            } else {
                this.seen.add(gnx);
                const m = pattern.exec(p.h);
                if (m) {
                    const w_key: string = m[1];
                    const func = d[w_key];
                    func(p); // no need to bind to something before calling. Already classing from 'this'.
                }
                p.moveToThreadNext();
            }
        }
    }
    //@+node:felix.20230924174338.25: *3* sc.createLocalAtButtonHelper
    /**
     * Create a button for a local @button node.
     */
    createLocalAtButtonHelper(
        p: Position,
        h: string,
        statusLine: string,
        kind: string = 'at-button',
        verbose: boolean = true
    ): Wrapper | undefined {
        const c = this.c;
        const buttonText = this.cleanButtonText(h, true);
        const args = this.getArgs(p);

        // We must define the callback *after* defining b,
        // so set both command and shortcut to null here.
        const bg = this.getColor(h);
        const b = this.createIconButton(
            args,
            h,
            undefined,
            statusLine,
            kind,
            bg,
        );

        if (!b) {
            return undefined;
        }

        // Now that b is defined we can define the callback.
        // Yes, executeScriptFromButton *does* use b (to delete b if requested by the script).
        const docstring = g.getDocString(p.b).trim();
        const cb = new AtButtonCallback(
            this,
            b,
            c,
            buttonText,
            docstring,
            p.v.gnx,
            undefined
        ).__call__; // reference to __call__, not called.

        this.iconBar.setCommandForButton(
            b,
            cb,
            p && p.copy(),
            this,
            p && p.gnx,
            undefined,
        );

        // At last we can define the command and use the shortcut.
        // registerAllCommands recomputes the shortcut.
        this.registerAllCommands(
            this.getArgs(p),
            cb,
            h,
            'button',
            p.v.context,
            'local @button'
        );

        return b;
    }
    //@+node:felix.20230924174338.26: *3* sc.createIconButton (creates all buttons)
    /**
     * Create one icon button.
     * This method creates all scripting icon buttons.
     * 
     * - Creates the actual button and its balloon.
     * - Adds the button to buttonsDict.
     * - Registers command with the shortcut.
     * - Creates x and delete-x-button commands, where x is the cleaned button name.
     * - Binds a right-click in the button to a callback that deletes the button.
     */
    public createIconButton(
        args: any,
        text: string,
        command: ((...args: any[]) => any) | undefined,
        statusLine: string,
        bg?: string,
        kind?: string,
    ): Wrapper | undefined {
        const c = this.c;

        // Create the button and add it to the buttons dict.
        const commandName = this.cleanButtonText(text);

        // Truncate only the text of the button, not the command name.
        const truncatedText = this.truncateButtonText(commandName);

        if (!truncatedText.trim()) {
            g.error(`${text.trim() || ''} ignored: no cleaned text`);
            return null;
        }

        // Command may be null.
        const b = this.iconBar.add(
            truncatedText,
            command,
            kind,
        );

        if (!b) {
            return null;
        }

        this.setButtonColor(b, bg);
        // this.buttonsArray[b] = truncatedText;
        this.buttonsArray.push(b);

        if (statusLine) {
            this.createBalloon(b, statusLine);
        }

        if (command) {
            this.registerAllCommands(
                args,
                command,
                text,
                'button',
                c,
                'icon button'
            );
        }

        const deleteButtonCallback = (p_b: Widget = b) => {
            this.deleteButton(p_b);
        };

        // Register the delete-x-button command.
        const deleteCommandName = `delete-${commandName}-button`;
        c.k.registerCommand(
            deleteCommandName,
            deleteButtonCallback,
            'button',
            null,
        );
        // Reporting this command is way too annoying.
        return b;
    }
    //@+node:felix.20230924174338.27: *3* sc.executeScriptFromButton
    /**
     * Execute an @button script in p.b or script.
     */
    public async executeScriptFromButton(
        b: Wrapper,
        buttonText?: string,
        p?: Position,
        script?: string,
        script_gnx?: string,
    ): Promise<void> {
        const c = this.c;
        if (c.disableCommandsMessage) {
            g.blue(c.disableCommandsMessage);
            return;
        }
        if (!p || !p.__bool__() && !script) {
            g.trace("can not happen: no p and no script");
            return;
        }
        g.app.scriptDict = { "script_gnx": script_gnx };
        const args = this.getArgs(p);
        if (!script) {
            script = await this.getScript(p);
        }
        await c.executeScript(
            args,
            p,
            script,
        );
        // Remove the button if the script asks to be removed.
        if (g.app.scriptDict["removeMe"]) {
            g.es(`Removing '${buttonText}' button at its request`);
            this.deleteButton(b);
        }
        // Do *not* set focus here: the script may have changed the focus.
    }
    //@+node:felix.20230924174338.28: *3* sc.open_gnx
    /**
     * Find the node with the given gnx in c, myLeoSettings.leo and leoSettings.leo.
     * If found, open the tab/outline and select the specified node.
     * Return c,p of the found node.
     *
     * Called only from a callback in QtIconBarClass.setCommandForButton.
     */
    public async open_gnx(c: Commands, gnx: string): Promise<[Commands | undefined, Position | undefined]> {
        if (!gnx) {
            g.trace("can not happen: no gnx");
            return [undefined, undefined];
        }
        // First, look in commander c.
        for (const p2 of c.all_positions()) {
            if (p2.gnx === gnx) {
                return [c, p2];
            }
        }
        // Fix bug 74: problems with @button if defined in myLeoSettings.leo.
        for (const f of [c.openMyLeoSettings, c.openLeoSettings]) {
            const c2 = await f.bind(c)();  // Open the settings file.
            if (c2) {
                for (const p2 of c2.all_positions()) {
                    if (p2.gnx === gnx) {
                        return [c2, p2];
                    }
                }
                await c2.close();
            }
        }
        // Fix bug 92: restore the previously selected tab.
        if (c.frame && (c.frame as any)['top']) {
            (c.frame as any).leo_master.select(c);
        }
        return [undefined, undefined];  // 2017/02/02.
    }
    //@+node:felix.20230924174338.29: *3* sc.Scripts, common
    // Important: common @button and @command nodes do **not** update dynamically!
    //@+node:felix.20230924174338.30: *4* sc.createCommonButtons
    /**
     * Handle all global @button nodes.
     */
    public async createCommonButtons(): Promise<void> {
        const c = this.c;
        const buttons = c.config.getButtons() || [];
        for (const z of buttons) {
            // #2011
            let [p, script, rclicks] = z;
            const gnx = p.v.gnx;
            if (!this.seen.has(gnx)) {
                this.seen.add(gnx);
                const newScript = await this.getScript(p);
                this.createCommonButton(p, newScript, rclicks);
            }
        }
    }
    //@+node:felix.20230924174338.31: *4* sc.createCommonButton (common @button)
    /**
     * Create a button in the icon area for a common @button node in an @setting
     * tree. Binds button presses to a callback that executes the script.
     * 
     * Important: Common @button and @command scripts now *do* update
     * dynamically provided that myLeoSettings.leo is open. Otherwise the
     * callback executes the static script.
     * 
     * See https://github.com/leo-editor/leo-editor/issues/171
     */
    public createCommonButton(p: Position, script: string, rclicks: any[] = []): void {
        const c = this.c;
        const gnx = p.gnx;
        const args = this.getArgs(p);
        // Fix bug #74: problems with @button if defined in myLeoSettings.leo
        const docstring = g.getDocString(p.b).trim();
        let statusLine = docstring || 'Global script button';
        const shortcut = this.getShortcut(p.h);  // Get the shortcut from the @key field in the headline.
        if (shortcut) {
            statusLine = `${statusLine.trim()} = ${shortcut}`;
        }
        // We must define the callback *after* defining b,
        // so set both command and shortcut to None here.
        const bg = this.getColor(p.h);  // #2024
        const b = this.createIconButton(
            args,
            p.h,
            undefined,
            statusLine,
            bg,  // #2024
            'at-button',
        );
        if (!b) {
            return;
        }
        // Now that b is defined we can define the callback.
        // Yes, the callback *does* use b (to delete b if requested by the script).
        const buttonText = this.cleanButtonText(p.h);
        const cb = new AtButtonCallback(
            this,
            b,
            c,
            buttonText,
            docstring,
            // #367: the gnx is needed for the Goto Script command.
            //       Use gnx to search myLeoSettings.leo if it is open.
            gnx,
            script,
        ).__call__;
        // Now patch the button.
        this.iconBar.setCommandForButton(
            b,
            cb,  // This encapsulates the script.
            p && p.copy(),  // #567
            this,
            gnx,  // For the find-button function.
            script,
        );
        this.handleRclicks(rclicks);
        // At last we can define the command.
        this.registerAllCommands(
            args,
            cb,
            p.h,
            'button',
            p.v.context,
            '@button',
        );
    }
    //@+node:felix.20230924174338.32: *4* sc.createCommonCommands
    /**
     * Handle all global @command nodes.
     */
    public async createCommonCommands(): Promise<void> {
        const c = this.c;
        const aList = c.config.getCommands() || [];
        for (const z of aList) {
            let [p, script] = z;
            const gnx = p.v.gnx;
            if (!this.seen.has(gnx)) {
                this.seen.add(gnx);
                const updatedScript = await this.getScript(p);
                this.createCommonCommand(p, updatedScript);
            }
        }
    }
    //@+node:felix.20230924174338.33: *4* sc.createCommonCommand (common @command)
    /**
     * Handle a single @command node.
     * 
     * Important: Common @button and @command scripts now *do* update
     * dynamically provided that myLeoSettings.leo is open. Otherwise the
     * callback executes the static script.
     *
     * See https://github.com/leo-editor/leo-editor/issues/171
     */
    createCommonCommand(p: Position, script: string): void {
        const c = this.c;
        const args = this.getArgs(p);
        const commonCommandCallback = new AtButtonCallback(
            this,
            undefined,
            c,
            undefined,
            g.getDocString(p.b).trim(),
            p.v.gnx,
            script,
        ).__call__;
        this.registerAllCommands(
            args,
            commonCommandCallback,
            p.h,
            'button',
            p.v.context,
            'global @command'
        );
    }
    //@+node:felix.20230924174338.34: *3* sc.Scripts, individual
    //@+node:felix.20230924174338.35: *4* sc.handleAtButtonNode @button
    /**
     * Create a button in the icon area for an @button node.
     *
     * An optional @key=shortcut defines a shortcut that is bound to the button's script.
     * The @key=shortcut does not appear in the button's name, but
     * it *does* appear in the statutus line shown when the mouse moves over the button.
     *
     * An optional @color=colorname defines a color for the button's background.  It does
     * not appear in the status line nor the button name.
     */
    handleAtButtonNode(p: Position): void {
        let h = p.h;
        let shortcut = this.getShortcut(h);
        let docstring = g.getDocString(p.b).trim();
        let statusLine = docstring ? docstring : "Local script button";
        if (shortcut) {
            statusLine = `${statusLine} = ${shortcut}`;
        }
        g.app.config.atLocalButtonsList.push(p.copy());
        // This helper is also called by the script-button callback.
        this.createLocalAtButtonHelper(p, h, statusLine, undefined, false);
    }
    //@+node:felix.20230924174338.36: *4* sc.handleAtCommandNode @command
    /**
     * Handle @command name [@key[=]shortcut].
     */
    public handleAtCommandNode(p: Position): void {
        let c = this.c;
        if (!p.h.trim()) {
            return;
        }
        let args = this.getArgs(p);

        let atCommandCallback = async (p_args: any = args, p_c: Commands = c, p_p: Position = p.copy()) => {
            // Execute the script silently
            await p_c.executeScript(p_args, p_p);
        };

        // Fix bug 1251252
        // Minibuffer commands created by mod_scripting.py have no docstrings

        (atCommandCallback as any).__doc__ = g.getDocString(p.b).trim();
        this.registerAllCommands(
            args,
            atCommandCallback,
            p.h,
            'button',  // Fix bug 416.
            p.v.context,
            'local @command'
        );
        g.app.config.atLocalCommandsList.push(p.copy());
    }
    //@+node:felix.20230924174338.37: *4* sc.handleAtPluginNode @plugin
    /**
     * Handle @plugin nodes.
     */
    public handleAtPluginNode(p: Position): void {
        const tag = "@plugin";
        const h = p.h;
        if (!g.match(h, 0, tag)) {
            console.error("Invalid tag: Expected '@plugin' but found something else.");
            return;
        }

        // Get the name of the module.
        const moduleOrFileName = h.slice(tag.length).trim();
        console.log('TODO : atPluginNodes');

        //   if (!this.atPluginNodes) {
        //     g.warning(`disabled @plugin: ${moduleOrFileName}`);
        //   } else if (g.pluginIsLoaded(moduleOrFileName)) {
        //     g.warning(`plugin already loaded: ${moduleOrFileName}`);
        //   } else {
        //     g.loadOnewPlugin(moduleOrFileName); // * TODO : LEOJS PLUGIN SYSTEM
        //   }
    }
    //@+node:felix.20230924174338.38: *4* sc.handleAtRclickNode @rclick
    /**
     * Handle @rclick name [@key[=]shortcut].
     */
    public handleAtRclickNode(p: Position): void {
        const c = this.c;
        if (!p.h.trim()) {
            return;
        }
        const args = this.getArgs(p);

        const atCommandCallback = async (p_args: any = args, p_c: Commands = c, p_p: Position = p.copy()): Promise<void> => {
            await p_c.executeScript(p_args, p_p,);
        };

        if (p.b.trim()) {
            this.registerAllCommands(
                args,
                atCommandCallback,
                p.h,
                'all',
                p.v.context,
                'local @rclick'
            );
        }
        g.app.config.atLocalCommandsList.push(p.copy());
    }
    //@+node:felix.20230924174338.39: *4* sc.handleRclicks
    /**
     * Handle rclicks.
     */
    public handleRclicks(rclicks: any[]): void {
        const handlerc = (rc: any): void => {
            if (rc.children) {
                for (const i of rc.children) {
                    handlerc(i);
                }
            } else {
                this.handleAtRclickNode(rc.position);
            }
        };
        for (const rc of rclicks) {
            handlerc(rc);
        }
    }
    //@+node:felix.20230924174338.40: *4* sc.handleAtScriptNode @script
    /**
     * Handle @script nodes.
     */
    public async handleAtScriptNode(p: Position): Promise<void> {
        const tag = "@script";
        if (!p.h.startsWith(tag)) {
            throw new Error("Assertion failed: p.h does not start with '@script'");
        }
        const name = p.h.slice(tag.length).trim();
        const args = this.getArgs(p);
        if (this.atScriptNodes) {
            console.log(`executing script ${name}`);
            await this.c.executeScript(args, p, undefined, false);
        } else {
            console.warn(`disabled @script: ${name}`);
        }
        if (false) {
            // Do not assume the script will want to remain in this commander.
            // this.c.bodyWantsFocus(); // Uncomment if needed
        }
    }
    //@+node:felix.20230924174338.41: *3* sc.Standard buttons
    //@+node:felix.20230924174338.42: *4* sc.createDebugIconButton 'debug-script'
    /**
     * Create the 'debug-script' button and the debug-script command.
     */
    public createDebugIconButton(): void {
        console.log('TODO : runDebugScriptCommand');

        //   this.createIconButton(
        //     undefined,
        //     'debug-script',
        //     this.runDebugScriptCommand,
        //     'Debug script in selected node',
        //     'debug-script'
        //   );
    }
    //@+node:felix.20230924174338.43: *4* sc.createRunScriptIconButton 'run-script'
    /**
     * Create the 'run-script' button and the run-script command.
     */
    public createRunScriptIconButton(): void {
        this.createIconButton(
            undefined,
            'run-script',
            this.runScriptCommand,
            'Run script in selected node',
            'run-script'
        );
    }
    //@+node:felix.20230924174338.44: *4* sc.createScriptButtonIconButton 'script-button'
    /**
     * Create the 'script-button' button and the script-button command.
     */
    public createScriptButtonIconButton(): void {
        this.createIconButton(
            undefined,
            'script-button',
            this.addScriptButtonCommand,
            'Make script button from selected node',
            'script-button-button'
        );
    }
    //@+node:felix.20230924174338.45: *3* sc.Utils
    //@+node:felix.20230924174338.46: *4* sc.cleanButtonText
    /**
     * Clean the text following @button or @command so
     * that it is a valid name of a minibuffer command.
     */
    public cleanButtonText(s: string, minimal: boolean = false): string {
        // #1121: Don't lowercase anything.
        if (minimal) {
            return s.replace(/ /g, '-').replace(/^-+|-+$/g, '');
        }
        for (const tag of ['@key', '@args', '@color']) {
            let i = s.indexOf(tag);
            if (i > -1) {
                let j = s.indexOf('@', i + 1);
                if (i < j) {
                    s = s.substring(0, i) + s.substring(j);
                } else {
                    s = s.substring(0, i);
                }
                s = s.trim();
            }
        }
        return s.replace(/ /g, '-').replace(/^-+|-+$/g, '');
    }
    //@+node:felix.20230924174338.47: *4* sc.createBalloon (gui-dependent)
    /**
     * Create a balloon for a widget.
     * @param w Wrapper instance
     * @param label Balloon label
     */
    createBalloon(w: Wrapper, label: any): void {
        if (g.app.gui.guiName().startsWith('qt')) {
            // w is a leoIconBarButton.
            if ('button' in w) {
                w.button.setToolTip(label);
            }
        }
    }
    //@+node:felix.20230924174338.48: *4* sc.deleteButton
    /**
     * Delete the given button.
     * This is called from callbacks, it is not a callback.
     * @param button The button to delete
     * @param kw Optional keyword arguments
     */
    deleteButton(button: any, ...kw: any[]): void {
        let w = button;

        const index = this.buttonsArray.indexOf(button);
        if (index > -1) {
            this.buttonsArray.splice(index, 1);
            // this.iconBar.deleteButton(w); // * UNUSED IN LEOJS 
            this.c.bodyWantsFocus();
        }

    }
    //@+node:felix.20230924174338.49: *4* sc.getArgs
    /**
     * Return the list of @args field of p.h.
     */
    public getArgs(p: Position): string[] {
        let args: string[] = [];
        if (!p) {
            return args;
        }
        let h = p.h;
        let tag = '@args';
        let i = h.indexOf(tag);
        if (i > -1) {
            let j = g.skip_ws(h, i + tag.length);
            // Make '=' sign optional.
            if (g.match(h, j, '=')) {
                j += 1;
            }
            let k = h.indexOf('@', j + 1);
            if (k === -1) {
                k = h.length;
            }
            let s = h.slice(j, k).trim();
            args = s.split(',').map(z => z.trim());
        }
        return args;
    }
    //@+node:felix.20230924174338.50: *4* sc.getButtonText
    /**
     * Returns the button text found in the given headline string
     */
    public getButtonText(h: string): string {
        let tag = '@button';
        if (g.match_word(h, 0, tag)) {
            h = h.slice(tag.length).trim();
        }
        const tags = ['@key', '@args', '@color'];
        for (let tag of tags) {
            let i = h.indexOf(tag);
            if (i > -1) {
                let j = h.indexOf('@', i + 1);
                if (i < j) {
                    h = h.slice(0, i) + h.slice(j + 1);
                } else {
                    h = h.slice(0, i);
                }
                h = h.trim();
            }
        }
        let buttonText = h;
        return buttonText;
    }
    //@+node:felix.20230924174338.51: *4* sc.getColor
    /**
     * Returns the background color from the given headline string
     */
    public getColor(h: string): string | undefined {
        let color: string | undefined;
        let tag = '@color';
        let i = h.indexOf(tag);
        if (i > -1) {
            let j = g.skip_ws(h, i + tag.length);
            if (g.match(h, j, '=')) {
                j += 1;
            }
            let k = h.indexOf('@', j + 1);
            if (k === -1) {
                k = h.length;
            }
            color = h.slice(j, k).trim();
        }
        return color;
    }
    //@+node:felix.20230924174338.52: *4* sc.getShortcut
    /**
     * Return the keyboard shortcut from the given headline string
     */
    public getShortcut(h: string): string | null {
        let shortcut: string | null = null;
        let i = h.indexOf('@key');
        if (i > -1) {
            let j = g.skip_ws(h, i + '@key'.length);
            if (g.match(h, j, '=')) {
                j += 1;
            }
            let k = h.indexOf('@', j + 1);
            if (k === -1) {
                k = h.length;
            }
            shortcut = h.slice(j, k).trim();
        }
        return shortcut;
    }
    //@+node:felix.20230924174338.53: *4* sc.getScript
    /**
     * Return the script composed from p and its descendants.
     */
    public getScript(p: Position): Promise<string> {
        return g.getScript(
            this.c,
            p,
            false,
            true,
            true
        );
    }
    //@+node:felix.20230924174338.54: *4* sc.registerAllCommands
    /**
     * Register @button <name> and @rclick <name> and <name>
     */
    registerAllCommands(
        args: any,
        func: (...args: any[]) => any,
        h: string,
        pane: string,
        source_c?: Commands,
        tag?: string
    ): void {
        const c = this.c;
        const k = this.c.k;
        const trace = false;  // Activate this for debugging purposes.
        let shortcut = this.getShortcut(h) || '';
        let commandName = this.cleanButtonText(h);

        // Register the original function.
        k.registerCommand(
            true,
            commandName,
            func,
            pane,
            shortcut
        );

        // 2013/11/13 Jake Peck:
        // include '@rclick-' in list of tags
        // Loop through each prefix to create the new command
        for (const prefix of ['@button-', '@command-', '@rclick-']) {
            if (commandName.startsWith(prefix)) {
                const commandName2 = commandName.slice(prefix.length).trim();

                // Create a *second* function, to avoid collision in c.commandsDict.
                const registerAllCommandsCallback = (p_func: (...args: any[]) => void = func) => {
                    p_func();
                };

                // Assign documentation
                registerAllCommandsCallback.__doc__ = (func as any)['__doc__'] || '';

                // Make sure we never redefine an existing commandName.
                if (commandName2 in c.commandsDict) {
                    // A warning here would be annoying.
                    if (trace) {
                        g.trace(`Already in commandsDict: ${commandName2}`);
                    }
                } else {
                    k.registerCommand(
                        commandName2,
                        registerAllCommandsCallback,
                        pane,
                        null
                    );
                }
            }
        }
    }
    //@+node:felix.20230924174338.55: *4* sc.setButtonColor
    /**
     * Set the background color of Qt button b to bg
     */
    setButtonColor(b: Wrapper, bg?: string): void {
        // * IGNORED IN LEOJS
        //   if (!bg) {
        //     return;
        //   }
        //   if (!bg.startsWith('#')) {
        //     const bg0 = bg;
        //     const d = leoColor.leo_color_database;
        //     bg = d.get(bg.toLowerCase());
        //     if (!bg) {
        //       g.trace(`bad color? ${bg0}`);
        //       return;
        //     }
        //   }
        //   try {
        //     b.button.setStyleSheet(`QPushButton{background-color: ${bg}}`);
        //   } catch (e) {
        //     // Handle exception here if necessary
        //   }
    }
    //@+node:felix.20230924174338.56: *4* sc.truncateButtonText
    /**
     * Truncate the button text
     */
    truncateButtonText(s: string): string {
        // 2011/10/16: Remove @button here only.
        let i = 0;
        while (g.match(s, i, '@')) {
            i += 1;
        }
        if (g.match_word(s, i, 'button')) {
            i += 6;
        }
        s = s.slice(i);
        if (this.maxButtonSize > 10) {
            s = s.slice(0, this.maxButtonSize);
            if (s.endsWith('-')) {
                s = s.slice(0, -1);
            }
        }
        s = s.replace(/^\-+|\-+$/g, '');
        return s.trim();
    }
    //@-others

}
//@+node:felix.20230924174338.57: ** class EvalController
/**
 * A class defining all eval-* commands.
 */
export class EvalController {

    public answers: [string, string][];
    public c: Commands;
    public d: { [key: string]: any };
    public globals_d: { [key: string]: any };
    public locals_d: { [key: string]: any };
    public legacy: boolean;
    public last_result: any;
    public old_stderr: boolean | null;
    public old_stdout: boolean | null;

    //@+others
    //@+node:felix.20230924174338.58: *3* eval.Birth
    constructor(c: Commands) {
        this.answers = [];
        this.c = c;
        this.d = {};
        this.globals_d = { c: c, g: g, p: c.p };
        this.locals_d = {};
        this.legacy = c.config.getBool('legacy-eval', true);

        // * NO VALUESPACE PLUGIN FOR NOW IN LEOJS
        /*

        if (g.app.ipk) {
          // Use the IPython namespace.
          this.c.vs = g.app.ipk.namespace;
        } else if (this.legacy) {
          this.c.vs = this.d;
        } else {
          this.c.vs = this.globals_d;
        }

        // allow the auto-completer to complete in this namespace
        // Updated by do_exec.
        this.c.keyHandler.autoCompleter.namespaces.push(this.c.vs);

        */

        this.last_result = null;
        this.old_stderr = null;
        this.old_stdout = null;
    }
    //@+node:felix.20230924174338.59: *3* eval.Commands
    //@+node:felix.20230924174338.60: *4* eval
    @eval_cmd(
        "eval",
        "Execute the selected text, if any, or the line containing the cursor."
    )
    public eval_command(): void {
        //@+<< eval docstring >>
        //@+node:felix.20230924174338.61: *5* << eval docstring >>
        /*
            Execute the selected text, if any, or the line containing the cursor.

            Select next line of text.

            Tries hard to capture the result of from the last expression in the
            selected text::

                import datetime
                today = datetime.date.today()

            will capture the value of ``today`` even though the last line is a
            statement, not an expression.

            Stores results in ``c.vs['_last']`` for insertion
            into body by ``eval-last`` or ``eval-last-pretty``.

            Removes common indentation (``textwrap.dedent()``) before executing,
            allowing execution of indented code.

            ``g``, ``c``, and ``p`` are available to executing code, assignments
            are made in the ``c.vs`` namespace and persist for the life of ``c``.
        */
        //@-<< eval docstring >>
        const c = this.c;
        //   if (c === event.get('c')) {
        const s = this.get_selected_lines();
        if (this.legacy && s === null) {
            return;
        }
        // Updates self.last_answer if there is exactly one answer.
        this.eval_text(s || '');
        //   }
    }
    //@+node:felix.20230924174338.62: *4* eval-block
    @eval_cmd(
        "eval-block",
        "evaluates the current code block, either the code block the cursor's in, or the code block preceding the output block the cursor's in.")
    eval_block(): void {
        //@+<< eval-block docstring >>
        //@+node:felix.20230924174338.63: *5* << eval-block docstring >>
        /*
            In the body, "# >>>" marks the end of a code block, and "# <<<" marks
            the end of an output block.  E.g.::

            a = 2
            # >>>
            4
            # <<<
            b = 2.0*a
            # >>>
            4.0
            # <<<

            ``eval-block`` evaluates the current code block, either the code block
            the cursor's in, or the code block preceding the output block the cursor's
            in.  Subsequent output blocks are marked "# >>> *" to show they may need
            re-evaluation.

            Note: you don't really need to type the "# >>>" and "# <<<" markers
            because ``eval-block`` will add them as needed.  So just type the
            first code block and run ``eval-block``.
        */
        //@-<< eval-block docstring >>
        const c = this.c;
        // if (c !== event.get('c')) {
        //   return;
        // }
        let pos = 0;
        const lines: string[] = [];
        let current_seen = false;
        let current: boolean;
        let source: string;
        let output: string;

        for ([current, source, output] of this.get_blocks()) {
            lines.push(source);
            lines.push("# >>>" + (current_seen ? " *" : ""));
            if (current) {
                const old_log = ''; // NOT USED IN LEOJS // c.frame.log.logCtrl.getAllText();
                this.eval_text(source);
                const new_log = ''; // NOT USED IN LEOJS // c.frame.log.logCtrl.getAllText().slice(old_log.length);
                lines.push(new_log.trim());
                if (!this.legacy) {
                    if (this.last_result) {
                        lines.push(this.last_result);
                    }
                }
                pos = lines.join('\n').length + 7;
                current_seen = true;
            } else {
                lines.push(output);
            }
            lines.push("# <<<");
        }
        c.p.b = lines.join('\n') + '\n';
        c.frame.body.wrapper.setInsertPoint(pos);
        c.redraw();
        c.bodyWantsFocusNow();
    }
    //@+node:felix.20230924174338.64: *4* eval-last
    /**
     * Insert the last result from ``eval``.
     *
     * Inserted as a string, so ``"1\n2\n3\n4"`` will cover four lines and
     * insert no quotes, for ``repr()`` style insertion use ``last-pretty``.
     */
    @eval_cmd("eval-last", "Insert the last result from 'eval' as string.")
    public eval_last(text: string | null = null): void {
        const c = this.c;
        // if (c !== event.get('c')) {
        //   return;
        // }
        if (this.legacy && c.vs) {
            text = String(c.vs['_last']);
        } else {
            if (!text && !this.last_result) {
                return;
            }
            if (!text) {
                text = String(this.last_result);
            }
        }
        const w = c.frame.body.wrapper;
        const i = w.getInsertPoint();
        w.insert(i, text + '\n');
        w.setInsertPoint(i + text.length + 1);
        c.setChanged();
    }
    //@+node:felix.20230924174338.65: *4* eval-last-pretty
    /**
     * Insert the last result from ``eval``.
     *
     * Formatted by ``pprint.pformat()``, so ``"1\n2\n3\n4"`` will appear as
     * '``"1\n2\n3\n4"``', see all ``last``.
     */
    @eval_cmd("eval-last-pretty", "Insert the last result from 'eval' as JSON.stringify.")
    public vs_last_pretty(): void {
        const c = this.c;
        // if (c !== event.get('c')) {
        //   return;
        // }
        let text: any;
        if (this.legacy && c.vs) {
            text = c.vs['_last'].toString();
        } else {
            text = this.last_result;
        }
        if (text) {
            text = JSON.stringify(text, null, 2); // pprint.pformat(text);
            this.eval_last(text);
        }
    }
    //@+node:felix.20230924174338.66: *4* eval-replace
    /**
     * Execute the selected text, if any.
     * Undoably replace it with the result.
     */
    @eval_cmd("eval-replace", "Execute the selected text, if any. Undoably replace it with the result.")
    public eval_replace(): void {
        const c = this.c;
        // if (c !== event.get('c')) {
        //   return;
        // }
        const w = c.frame.body.wrapper;
        const s = w.getSelectedText();
        if (!s.trim()) {
            g.es_print('no selected text');
            return;
        }
        this.eval_text(s);
        let last: any;
        if (this.legacy && c.vs) {
            last = c.vs['_last'];
        } else {
            last = this.last_result;
        }
        if (!last) {
            return;
        }
        const formattedLast = JSON.stringify(last, null, 2); // pprint.pformat(last);
        const [i, j] = w.getSelectionRange();
        const new_text = c.p.b.substring(0, i) + formattedLast + c.p.b.substring(j);
        const bunch = c.undoer.beforeChangeNodeContents(c.p);
        w.setAllText(new_text);
        c.p.b = new_text;
        w.setInsertPoint(i + formattedLast.length);
        c.undoer.afterChangeNodeContents(c.p, 'Insert result', bunch);
        c.setChanged();
    }
    //@+node:felix.20230924174338.67: *3* eval.Helpers
    //@+node:felix.20230924174338.68: *4* eval.eval_text & helpers
    /**
     * Evaluate string s.
     */
    public eval_text(s: string): string | null {
        s = g.dedent(s);
        if (!s.trim()) {
            return null;
        }
        this.redirect();
        if (this.legacy) {
            const blocks = s.split(/\n(?=[^\s])/);  // TODO : MAKE SURE THIS IS GOOD IN ORIGINAL LEO ALSO
            const ans = this.old_exec(blocks, s);
            this.show_legacy_answer(ans, blocks);
            return ans;  // needed by mod_http
        }
        this.new_exec(s);
        this.show_answers();
        this.unredirect();
        return null;
    }
    //@+node:felix.20230924174338.69: *5* eval.new_exec
    /**
     * Evaluate string s.
     */
    public new_exec(s: string): void {
        try {
            this.answers = [];
            this.locals_d = {};
            // * Use eval or other JS evaluation methods here.
            //   exec(s, self.globals_d, self.locals_d)

            this.last_result = new Function(
                // 'c',
                // 'g',
                // 'input',
                // 'p',
                // '__name__',
                // 'script_args',
                // 'script_gnx',
                ...Object.keys(this.globals_d),
                s
            )(
                ...Object.keys(this.globals_d).map(k => this.globals_d[k])
                // d['c'],
                // d['g'],
                // d['input'],
                // d['p'],
                // d['__name__'],
                // d['script_args'],
                // d['script_gnx']
            );


            // * NOT USED IN LEOJS SO FAR
            // for (let key in this.locals_d) {
            //   let val = this.locals_d[key];
            //   this.globals_d[key] = val;
            //   this.answers.push([key, val]);
            // }
            // if (this.answers.length === 1) {
            //   const [key, val] = this.answers[0];
            //   this.last_result = val;
            // } else {
            //   this.last_result = undefined;
            // }

        } catch (e) {
            g.es_exception(e);
        }
    }
    //@+node:felix.20230924174338.70: *5* eval.old_exec
    public old_exec(blocks: string[], txt: string): string {

        const c = this.c;
        const leo_globals: Record<string, any> = { 'c': c, 'g': g, 'p': c.p };
        let all_done = false;
        let ans: any = undefined;

        console.log('TODO : MAKE A BETTER old_exec');
        try {
            ans = new Function(
                // 'c',
                // 'g',
                // 'input',
                // 'p',
                // '__name__',
                // 'script_args',
                // 'script_gnx',
                ...Object.keys(leo_globals),
                txt
            )(
                ...Object.keys(leo_globals).map(k => leo_globals[k])
                // d['c'],
                // d['g'],
                // d['input'],
                // d['p'],
                // d['__name__'],
                // d['script_args'],
                // d['script_gnx']
            );
        } catch (e) {
            g.es_exception(e);
        }


        // try
        //     // Execute all but the last 'block'
        //     exec('\n'.join(blocks[:-1]), leo_globals, c.vs)  // Compatible with Python 3.x.
        //     all_done = false;
        // catch (e))
        //     // Splitting the last block caused syntax error
        //     try:
        //         // Is the whole thing a single expression?
        //         ans = eval(txt, leo_globals, c.vs)
        //     catch (e))
        //         try:
        //             exec(txt, leo_globals, c.vs)
        //         catch (e))
        //             g.es_exception()
        //     all_done = true;  // Either way, the last block will be used.
        // if !all_done  // last block still needs using
        //     try
        //         ans = eval(blocks[-1], leo_globals, c.vs)
        //     catch (e))
        //         try:
        //             exec(txt, leo_globals, c.vs)
        //         catch (e))
        //             g.es_exception()
        return ans;

    }
    //@+node:felix.20230924174338.71: *5* eval.redirect & unredirect
    /**
     * Redirect standard output and standard error streams.
     */
    public redirect(): void {
        const c = this.c;

        if (c.config.getBool('eval-redirect')) {
            console.log('TODO : mod_scripting redirect method');
            // this.old_stderr = g.stdErrIsRedirected();
            // this.old_stdout = g.stdOutIsRedirected();
            // if (!this.old_stderr) {
            //   g.redirectStderr();
            // }
            // if (!this.old_stdout) {
            //   g.redirectStdout();
            // }
        }
    }

    /**
     * Restore standard output and standard error streams to their original states.
     */
    public unredirect(): void {
        const c = this.c;
        if (c.config.getBool('eval-redirect')) {
            console.log('TODO : mod_scripting unredirect method');

            // if (!this.old_stderr) {
            //   g.restoreStderr();
            // }
            // if (!this.old_stdout) {
            //   g.restoreStdout();
            // }
        }
    }
    //@+node:felix.20230924174338.72: *5* eval.show_answers
    /**
     * Show all new values computed by do_exec.
     */
    public show_answers(): void {
        if (this.answers.length > 1) {
            g.es('');
        }
        for (const answer of this.answers) {
            const [key, val] = answer;
            g.es(`${key} = ${val}`);
        }
    }
    //@+node:felix.20230924174338.73: *5* eval.show_legacy_answer
    /**
     * show_legacy_answer - Shows the legacy answer.
     */
    public show_legacy_answer(ans: string | null, blocks: string[]): string | null {
        const cvs = this.c.vs;
        if (ans === null) {  // See if last block was a simple "var =" assignment.
            const key = blocks[blocks.length - 1].split('=', 1)[0].trim();
            if (key in cvs) {
                ans = cvs[key];
            }
        }
        if (ans === null) {  // See if whole text was a simple /multi-line/ "var =" assignment.
            const key = blocks[0].split('=', 1)[0].trim();
            if (key in cvs) {
                ans = cvs[key];
            }
        }
        cvs['_last'] = ans;
        if (ans !== null) {
            // Annoying to echo 'None' to the log during line by line execution.
            let txt = String(ans);
            const lines = txt.split('\n');
            if (lines.length > 10) {
                txt = lines.slice(0, 5).concat('<snip>').concat(lines.slice(-5)).join('\n');
            }
            if (txt.length > 500) {
                txt = txt.substring(0, 500) + ' <truncated>';
            }
            g.es(txt);
        }
        return ans;
    }
    //@+node:felix.20230924174338.74: *4* eval.exec_then_eval (not used yet)
    /**
     * exec_then_eval - Executes code and then evaluates the last expression, if any.
     * From Milan Melena.
     */
    public exec_then_eval(code: string, ns: Record<string, any>): string {

        // * TODO  exec_then_eval
        /*
        console.log(" TODO  exec_then_eval");
        import ast
        block = ast.parse(code, mode='exec')
        if block.body and isinstance(block.body[-1], ast.Expr):
            last = ast.Expression(block.body.pop().value)
            exec(compile(block, '<string>', mode='exec'), ns)
            # pylint: disable=eval-used
            return eval(compile(last, '<string>', mode='eval'), ns)
        exec(compile(block, '<string>', mode='exec'), ns)
        return ""
        */

        return "";
    }
    //@+node:felix.20230924174338.75: *4* eval.get_blocks
    /**
     * get_blocks - iterate code blocks
     * 
     * @return A generator yielding tuples of the form (current: boolean, source: string, output: string)
     */
    public *get_blocks(): Generator<[boolean, string, string]> {
        const c = this.c;
        let pos = c.frame.body.wrapper.getInsertPoint();
        let chrs = 0;
        let lines = c.p.b.split('\n');
        let block: Record<string, string[]> = { 'source': [], 'output': [] };
        let reading: 'source' | 'output' = 'source';
        let seeking_current = true;

        // If the last non-blank line isn't the end of a possibly empty output block, make it one
        if (lines.filter(i => i.trim()).pop() !== "# <<<") {
            lines.push("# <<<");
        }

        while (lines.length > 0) {
            let line = lines.shift()!;
            chrs += line.length + 1;

            if (line.startsWith("# >>>")) {
                reading = 'output';
                continue;
            }

            if (line.startsWith("# <<<")) {
                const current = seeking_current && (chrs >= pos + 1);
                if (current) {
                    seeking_current = false;
                }
                yield [current, block['source'].join('\n'), block['output'].join('\n')];
                block = { 'source': [], 'output': [] };
                reading = 'source';
                continue;
            }

            block[reading].push(line);
        }
    }
    //@+node:felix.20230924174338.76: *4* eval.get_selected_lines
    /**
     * Get selected lines from the text.
     */
    public get_selected_lines(): string | null {
        const c = this.c;
        const p = c.p;
        const w = c.frame.body.wrapper;
        const body = w.getAllText();
        let i = w.getInsertPoint();
        let s: string;

        let i1: number, i2: number;
        if (w.hasSelection()) {
            if (this.legacy) {
                [i1, i2] = w.getSelectionRange();
            } else {
                let j: number, k: number;
                [j, k] = w.getSelectionRange();
                [i1] = g.getLine(body, j);
                [, i2] = g.getLine(body, k);
            }
            s = body.slice(i1, i2);
        } else {
            if (this.legacy) {
                let k = w.getInsertPoint();
                [, i2] = g.getLine(body, k);
                w.setSelectionRange(k, i2);
                return null;
            } else {
                [i1, i2] = g.getLine(body, i);
                s = body.slice(i1, i2).trim();
            }
        }

        // Select next line for next eval.
        if (this.legacy) {
            let j = i2;
            while (j < body.length && body[j] !== '\n') {
                j += 1;
            }
            w.setSelectionRange(i2, j);
        } else {
            if (!body.endsWith('\n')) {
                if (i >= p.b.length) {
                    i2 += 1;
                }
                p.b = p.b + '\n';
            }
            const ins = Math.min(p.b.length, i2);
            // w.setSelectionRange(i, ins, ins, p.b); // no last string parameter in leojs
            w.setSelectionRange(i, ins, ins);
        }

        return s;
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
