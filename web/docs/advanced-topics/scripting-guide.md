---
sidebar_position: 1
---

# Leo Scripting Guide

This chapter covers miscellaneous topics related to Leo scripts.

You might call this a FAQ for scripts...

> 💡 **UI INTERACTIONS**\
> For LeoJS UI interaction examples, see the **[scripting samples repository](https://github.com/boltex/scripting-samples-leojs)**, along with the [LeoJS features video](https://www.youtube.com/watch?v=M_mKXSbVGdE) to see how to try them directly in your browser. (Press the `.` _period key_ when browsing the github repo)

## \@button example

Here is an example, @button promote-child-bodies:

```ts
/**
 * Copy the body text of all children to the parent's body text.
 */

// Great for creating what's new nodes.
const result: string[] = [p.b];
const b = c.undoer.beforeChangeNodeContents(p);

for (const child of p.children()) {
    if (child.b) {
        result.push(`\n- ${child.h}\n\n${child.b}\n`);
    } else {
        result.push(`\n- ${child.h}\n\n`);
    }
}

p.b = result.join('');
c.undoer.afterChangeNodeContents(p, 'promote-child-bodies', b);
```

This creates a fully undoable promote-child-bodies command.

## Submenus with \@rclick

You can make `@button` offer sub-menus with `@rclick` nodes.

See [@button and @rclick](../users-guide/customizing.md#rclick) for more
details, and the [LeoJS scripting samples](https://github.com/boltex/scripting-samples-leojs) 
for examples of using  **@button** nodes.

## Comparing two similar outlines

efc.compareTrees does most of the work of comparing two similar outlines.
For example, here is "@button compare vr-controller" in leoPyRef.leo:

```ts
const p1 = g.findNodeAnywhere(c, 'class ViewRenderedController (QWidget) (vr)');
const p2 = g.findNodeAnywhere(c, 'class ViewRenderedController (QWidget) (vr2)');
g.assert(p1.v && p2.v);
const tag = 'compare vr1 & vr2';
c.editFileCommands.compareTrees(p1, p2, tag);
```

This script will compare the trees whose roots are p1 and p2 and show the results like "Recovered nodes".  That is, the script creates a node called "compare vr1 & vr2".  This top-level node contains one child node for every node that is different.  Each child node contains a diff of the node.  The grand children are one or two clones of the changed or inserted node.

## Converting Body Text To Title Case

Title case means that all words start with capital letters.  The
following script converts the selected body text to title case.  If
nothing has been selected, the entire current node is converted. The
conversion is undoable:

```ts
const w = c.frame.body.wrapper;
const p = c.p;
let s = p.b;
const u = c.undoer;

const [start, end] = w.getSelectionRange();
const use_entire = start === end; // no selection, convert entire body

const undoType = 'title-case-body-selection';
const undoData = u.beforeChangeNodeContents(p);

function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

if (use_entire) {
    p.b = toTitleCase(s);
} else {
    const sel = s.slice(start, end);
    const head = s.slice(0, start);
    const tail = s.slice(end);
    p.b = head + toTitleCase(sel) + tail;
}

c.setChanged();
p.setDirty();
u.afterChangeNodeContents(p, undoType, undoData);
c.redraw();
```

<ul>
    _Contributed by [T. B. Passin](https://github.com/tbpassin)_
</ul>

## Creating minimal outlines
The following script will create a minimal Leo outline:

```ts
let c2: Commands;

if (true) {
    // Create a visible frame.
    c2 = g.app.newCommander('');
} else {
    // Create an invisible frame.
    c2 = g.app.newCommander('', g.app.nullGui);
}

c2.frame.createFirstTreeNode();
c2.redraw();

// Test that the script works.
for (const p of c2.all_positions()) {
    g.es(p.h);
}
```

## Cutting and pasting text

The following shows how to cut and paste text to the clipboard:

```ts
await g.app.gui.replaceClipboardWith('hi');
g.es(g.app.gui.getTextFromClipboard());
```

## g.app.gui.run* methods run dialogs

Scripts can invoke various dialogs using the following methods of the g.app.gui object.

```ts
//  VSCode Wrapper for showInputBox, or, for showQuickPick if tabList is given:
g.app.get1Arg(
    options?: vscode.InputBoxOptions | vscode.QuickPickOptions,
    token?: vscode.CancellationToken,
    tabList?: string[]
)

// Utility dialogs:
g.app.gui.runAskOkDialog(
    c: Commands,
    title: string,
    message: string,
    text = "Ok"
)
g.app.gui.runAskYesNoCancelDialog(
    c: Commands,
    title: string,
    message: string,
    yesMessage = 'Yes',
    noMessage = 'No',
    yesToAllMessage = "",
    defaultButton = 'Yes',
    cancelMessage = ""
)
g.app.gui.runAskYesNoDialog(        
    c: Commands,
    title: string,
    message: string,
    yes_all = false,
    no_all = false
)
```

The values returned are in ('ok','yes','no','cancel'), as indicated by the method names. Some dialogs also return strings or numbers, again as indicated by their names.

Scripts can run File Open and Save dialogs with these methods:

```ts
// Single select dialog
g.app.gui.runOpenFileDialog(
    c: Commands,
    title: string,
    filetypes: [string, string][],
)
// Multiple select dialog
g.app.gui.runOpenFilesDialog(
    c: Commands,
    title: string,
    filetypes: [string, string][],
)

// Save as... dialog
g.app.gui.runSaveFileDialog(
    c: Commands,
    title: string,
    filetypes: [string, string][],   
)
```

For details about how to use these file dialogs, look for examples in Leo's own source code.

## Getting commander preferences

Each commander sets ivars corresponding to settings.

Scripts can get the following ivars of the Commands class:

```ts
const ivars = [
    'output_doc_flag',
    'page_width',
    'tab_width',
    'target_language',
    'use_header_flag',
];

g.es("Prefs ivars...\n");

for (const ivar of ivars) {
    g.es((c as any)[ivar]);
}
```

## Getting configuration settings

Settings may be different for each commander.

The c.config class has the following getters:

- c.config.getBool(settingName,default=None)
- c.config.getColor(settingName)
- c.config.getDirectory(settingName)
- c.config.getFloat(settingName)
- c.config.getInt(settingName)
- c.config.getLanguage(settingName)
- c.config.getRatio(settingName)
- c.config.getString(settingName)

These methods return undefined if no setting exists.

The getBool 'default' argument to getBool specifies the value to be returned if the setting does not exist.

## Getting interactive input

The **g.app.gui.get1Arg** method is a Wrapper for VSCode's showInputBox, or, for showQuickPick if tabList is given.

Example 1: get one argument from the user:

```ts
@cmd('my-command', 'My Command Description')
public async myCommand(): Promise<unknown> {

    const arg = await g.app.gui.get1Arg({
        title: 'User Name',
        prompt: 'Please enter your name',
        placeHolder: 'John Doe',
    });

    // Finish the command.
    // ...

}
```

Example 2: get two arguments from the user:

```ts
@cmd('my-command', 'My Command Description')
public async myCommand(): Promise<unknown> {
    
    const arg1 = await g.app.gui.get1Arg({
        title: 'User Name',
        prompt: 'Please enter your name',
        placeHolder: 'John Doe',
    });

    const arg2 = await g.app.gui.get1Arg({
        title: 'User Age',
        prompt: 'Please enter your age',
        placeHolder: '21',
    });

    // Finish the command.
    // ...

}
```

## Invoking commands from scripts

You can invoke minibuffer commands by name.  For example:

```js
result = c.doCommandByName('open-outline');

// or

result = c.executeMinibufferCommand('open-outline');
```

This will return the value returned from the command.

Commands created with @command and @button nodes can return values as well.

## Making operations undoable

Plugins and scripts should call u.beforeX and u.afterX methods to describe the operation that is being performed. 

Look at the user's guide [undoing commands](../users-guide/cheatsheet.md#undoing-commands) section for examples, along with the [LeoJS Scripting Samples Repository](https://github.com/boltex/scripting-samples-leojs), which has examples of making your script operations undoable.

> 📌 **NOTE**\
> u is shorthand for c.undoer. Most u.beforeX methods return undoData that the client code merely passes to the corresponding u.afterX method. This data contains the 'before' snapshot. The u.afterX methods then create a bead containing both the 'before' and 'after' snapshots.

u.beforeChangeGroup and u.afterChangeGroup allow multiple calls to u.beforeX and u.afterX methods to be treated as a single undoable entry. See the code for the Replace All, Sort, Promote and Demote commands for examples. The u.beforeChangeGroup and u.afterChangeGroup methods substantially reduce the number of u.beforeX and afterX methods needed.

Plugins and scripts may define their own u.beforeX and afterX methods. Indeed, u.afterX merely needs to set the bunch.undoHelper and bunch.redoHelper ivars to the methods used to undo and redo the operation. See the code for the various u.beforeX and afterX methods for guidance.

In general, the best way to see how to implement undo is to see how Leo's core calls the u.beforeX and afterX methods.

## Modifying the body pane directly

These are only the most commonly-used methods. For more information, consult Leo's source code.

```js
const w = c.frame.body.wrapper; // Leo's body pane.

// Scripts can get or change the context of the body as follows:

w.appendText(s)                     // Append s to end of body text.
w.delete(i,j=None)                  // Delete characters from i to j.
w.deleteTextSelection()             // Delete the selected text, if any.
s = w.get(i,j=None)                 // Return the text from i to j.
s = w.getAllText                    // Return the entire body text.
i = w.getInsertPoint()              // Return the location of the cursor.
s = w.getSelectedText()             // Return the selected text, if any.
[i,j] = w.getSelectionRange(sort=True)// Return the range of selected text.
w.setAllText(s)                     // Set the entire body text to s.
w.setSelectionRange(i,j,insert=None) // Select the text.
```

> 📌 **NOTE**\
> i and j are zero-based indices into the the text. When j is not specified, it defaults to i. When the sort parameter is in effect, getSelectionRange ensures i \<= j.

## Recovering vnodes

Positions become invalid whenever the outline changes. 

This script finds a position p2 having the same vnode as an invalid position p:

```ts
if (!c.positionExists(p)) {
    let positionFound = false;
    for (const p2 of c.all_positions()) {
        if (p2.v === p.v) { // found
            c.selectPosition(p2);
            positionFound = true;
            break;
        }
    }
    if (!positionFound) {
        g.es('position no longer exists');
    }
}
```

## Recursive import script

The following script imports files from a given directory and all subdirectories:

```ts
c.recursiveImport(
    'path to file or directory', // dir
    '@clean',        // kind like '@file' or '@auto'
    false,       // True: import only one file.
    false,   // True: generate @@clean nodes.
    undefined        // theTypes: Same as ['.py']
);
```

## Running code at idle time

Scripts and plugins can call g.app.idleTimeManager.add_callback(callback) to cause
the callback to be called at idle time forever. This should suffice for most purposes:

```ts
function print_hi() {
    g.es('hi');
}

g.app.idleTimeManager.add_callback(print_hi);
```

For greater control, g.IdleTime is a thin wrapper for the Leo's IdleTime class. The IdleTime class executes a handler with a given delay at idle time. The handler takes a single argument, the IdleTime instance:

```ts
function handler(it: IdleTime): void {
    const delta_t = it.time - it.starting_time;
    g.es_print(it.count, delta_t);
     
    if (it.count >= 5) {
        g.es_print('done');
        it.stop();
    }
}

// Execute handler every 500 msec. at idle time.
const it = new g.IdleTime(handler, 500);
if (it) {
    it.start();
}
```

The code creates an instance of the IdleTime class that calls the given handler at idle time, and no more than once every 500 msec.  Here is the output:

<ul>
1 0.5100\
2 1.0300\
3 1.5400\
4 2.0500\
5 2.5610\
done
</ul>

Timer instances are completely independent:

```ts
function handler1(it: IdleTime): void {
    const delta_t = it.time - it.starting_time;
    g.es_print(it.count, delta_t);
    
    if (it.count >= 5) {
        g.es_print('done');
        it.stop();
    }
}

function handler2(it: IdleTime): void {
    const delta_t = it.time - it.starting_time;
    g.es_print(it.count, delta_t);
    
    if (it.count >= 10) {
        g.es_print('done');
        it.stop();
    }
}

const it1 = new g.IdleTime(handler1, 500);
const it2 = new g.IdleTime(handler2, 1000);

if (it1 && it2) {
    it1.start();
    it2.start();
}          
```

Here is the output:

<ul>
1 0.5200\
1 1.0100\
2 1.0300\
3 1.5400\
2 2.0300\
4 2.0600\
5 2.5600\
done\
3 3.0400\
4 4.0600\
5 5.0700\
6 6.0800\
7 7.1000\
8 8.1100\
9 9.1300\
10 10.1400\
done
</ul>

**Recycling timers**

The g.app.idle_timers list retrains references to all timers so they *won't* be recycled after being stopped.  This allows timers to be restarted safely.

There is seldom a need to recycle a timer, but if you must, you can call its destroySelf method. This removes the reference to the timer in g.app.idle_timers. 

> ⚠️ **WARNING**\
>  Accessing a timer after calling its destroySelf method can lead to a hard crash.

## Running code in separate processes

It is easy for scripts, including @button scripts, plugins, etc., to drive any external processes, including compilers and interpreters, from within Leo.

- The first section discusses using child_process directly or via Leo helper functions.

- The other discusses using g.execute_shell_commands and g.execute_shell_commands_with_options.

### Using child_process.exec

This first section discusses three *easy* ways to run code in a separate process by calling child_process.exec either directly or via Leo helper functions.

#### Call child_process.exec directly

Calling child_process.exec is often simple and good. For example, the following executes the 'npm run dev' command in a given directory.  Leo continues, without waiting for the command to return:

```ts
g.chdir(base_dir)

child_process.exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
        g.es(`Execution error: ${error}`);
        return;
    }
    g.es(`Output of child_process.exec: ${stdout}`);
    if (stderr) {
        g.es(`Command Error output: ${stderr}`);
    }
});
```

The following waits until the command completes:

```ts
g.chdir(base_dir)

const child = child_process.exec('python celulas.py');

await new Promise( (resolve) => {
    child.on('close', resolve)
})
```

#### Call g.execute_shell_commands

Use g.execute_shell_commands is a thin wrapper around child_process spawn and exex.  It calls child_process methods once for every command in a list.  It waits for each command to complete, except those starting with '&' Here it is:

```ts
async function execute_shell_commands(commands: string | string[], p_trace?: boolean): Promise<void> {
    if (typeof commands === 'string') {
        commands = [commands];
    }
    for (const command of commands) {
        let wait = !command.startsWith('&');
        if (p_trace) {
            trace(`Trace: ${command}`);
        }
        let cmd = command;
        if (command.startsWith('&')) {
            cmd = command.substring(1).trim();
        }
        if (wait) {
            try {
                await new Promise((resolve, reject) => {
                    const proc = child.exec(cmd, {}, (error, stdout, stderr) => {
                        if (error) {
                            reject(`Command failed: ${stderr}`);
                        } else {
                            resolve(undefined);
                        }
                    });
                });
            } catch (error) {
                console.error(`Command failed with error: ${error}`);
            }
        } else {
            const proc = child.spawn(cmd, { shell: true, stdio: 'inherit' });
            proc.on('error', (error) => {
                console.error(`Command failed with error: ${error}`);
            });
        }
    }
}
```

For example:

```ts
g.chdir(base_dir);
g.execute_shell_commands(['&npm run dev']);
```

#### Call g.execute_shell_commands_with_options

g.execute_shell_commands_with_options is more flexible.  It allows scripts to get both the starting directory and the commands themselves from Leo's settings. Its signature is:

```ts
/**
 * A helper for prototype commands or any other code that
 * runs programs in a separate process.
 *
 * base_dir:           Base directory to use if no config path given.
 * commands:           A list of commands, for g.execute_shell_commands.
 * commands_setting:   Name of @data setting for commands.
 * path_setting:       Name of @string setting for the base directory.
 * warning:            A warning to be printed before executing the commands.
 */
async function execute_shell_commands_with_options(
    base_dir: string,
    c: Commands,
    command_setting: string,
    commands: string[],
    path_setting: string,
    trace?: boolean,
    warning?: string,
): Promise<void>
```

For example, put this in myLeoSettings.leo:

- **@data** my-npm-commands\
&nbsp;&nbsp;&nbsp;&nbsp;yarn dev
- **@string** my-npm-base = /npmtest

And then run:

```ts
g.execute_shell_commands_with_options(
    c = c,
    command_setting = 'my-npm-commands',
    path_setting= 'my-npm-base',
)
```

### Using g.execute_shell_commands

g.execute_shell_command takes a single argument, which may be either a string or a list of strings. Each string represents one command. g.execute_shell_command executes each command in order.  Commands starting with '&' are executed without waiting. Commands that do not start with '&' finish before running later commands. Examples:

```ts
// Run the qml app in a separate process:
g.execute_shell_commands('qmlscene /test/qml_test.qml');

// List the contents of a directory:
g.execute_shell_commands([
    'cd ~/test',
    'ls -a',
]);

// Execute commands that creates files with some content
g.execute_shell_commands([
    'echo blabla > testfile1.txt',
    'echo another text file > testfile2.txt']
);

// Run a python test in a separate process.
g.execute_shell_commands('python /test/qt_test.py');
```

g.execute_shell_commands_with_options inits an environment and then calls g.execute_shell_commands.  See Leo's source code for details.

## Working and paths

d.get('path') returns the full, absolute path created by all @path directives that are in ancestors of node p. If p is any kind of @file node (including @file, @auto, @clean, etc.), the following script will print the full path to the created file:

```ts
const myPath = d['path'];
let name = p.anyAtFileNodeName();
if (name){
    name = g.os_path_finalize_join(myPath, name);
    g.es(name);
}
```
