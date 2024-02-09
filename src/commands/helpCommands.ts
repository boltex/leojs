//@+leo-ver=5-thin
//@+node:felix.20231224164322.1: * @file src/commands/helpCommands.ts
/**
 * Leo's help commands.
 */

//@+<< helpCommands imports & annotations >>
//@+node:felix.20231224164512.1: ** << helpCommands imports & annotations >>
import * as vscode from 'vscode';
import * as g from '../core/leoGlobals';
import { new_cmd_decorator } from '../core/decorators';
import { BaseEditCommandsClass } from './baseCommands';
import { Constants } from '../constants';
import { Position } from '../core/leoNodes';
//@-<< helpCommands imports & annotations >>

//@+others
//@+node:felix.20231224174554.1: ** helpCommands.cmd (decorator)
/**
 * Command decorator for the helpCommandsClass class. 
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'helpCommands']);
}
//@+node:felix.20231224164520.1: ** class HelpCommandsClass
/**
 * A class to display documentation and tips.
 */
export class HelpCommandsClass extends BaseEditCommandsClass {

    //@+others
    //@+node:felix.20231224164520.2: *3* help
    @cmd('help', 'Prints an introduction to Leo\'s help system.')
    public help_command(): void {
        //@+<< define md_s >>
        //@+node:felix.20231224164520.3: *4* << define md_s >> (F1)
        //@@language md

        const md_s = `\
        **Welcome to Leo\'s help system.**

        To learn about \"\<Alt-X\>\" commands, type:

            <Alt-X>help-for-minibuffer<Enter>

        To get a list of help topics, type:

            <Alt-X>help-

        For Leo commands, type:

            <Alt-X>help-for-command<Enter>
            <a Leo command name><Enter>

        For the command bound to a key, type:

            <Alt-X>help-for-keystroke<Enter>
        `;
        //@-<< define md_s >>
        this.c.putHelpFor(md_s);
    }
    //@+node:felix.20231224164520.10: *3* helpForCommand & helpers
    @cmd('help-for-command', 'Prompts for a command name and prints the help message for that command.')
    public async helpForCommand(): Promise<void> {

        // c= this.c;
        // k  this.c.k;
        // const s = `\
        // Alt-0 (vr-toggle) hides this help message.

        // Type the name of the command, followed by Return.
        // `;
        const c = this.c;
        const commands: vscode.QuickPickItem[] = [];
        const cDict = c.commandsDict;
        for (let key in cDict) {
            const command = cDict[key];
            // Going to get replaced. Don't take those that begin with 'async-'
            const w_name = (command as any).__name__ || '';
            if (!w_name.startsWith('async-')) {
                commands.push({
                    label: key,
                    detail: (command as any).__doc__
                });
            }
        }
        const w_noDetails: vscode.QuickPickItem[] = [];
        const stash_button: string[] = [];
        const stash_rclick: string[] = [];
        const stash_command: string[] = [];

        for (const w_com of commands) {
            if (
                !w_com.detail && !(
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_BUTTON_START) ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_RCLICK_START) ||
                    w_com.label === Constants.USER_MESSAGES.MINIBUFFER_SCRIPT_BUTTON ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_DEL_SCRIPT_BUTTON) ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_DEL_BUTTON_START) ||
                    w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_COMMAND_START)
                )
            ) {
                w_noDetails.push(w_com);
            }

            if (w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_BUTTON_START)) {
                stash_button.push(w_com.label);
            }
            if (w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_RCLICK_START)) {
                stash_rclick.push(w_com.label);
            }
            if (w_com.label.startsWith(Constants.USER_MESSAGES.MINIBUFFER_COMMAND_START)) {
                stash_command.push(w_com.label);
            }
        }

        const w_withDetails = commands.filter(p_command => !!p_command.detail);

        // Only sort 'regular' Leo commands, leaving custom commands at the top
        w_withDetails.sort((a, b) => {
            return a.label < b.label ? -1 : (a.label === b.label ? 0 : 1);
        });

        const w_choices: vscode.QuickPickItem[] = [];

        w_choices.push(...w_withDetails);
        const w_disposables: vscode.Disposable[] = [];
        const q_minibufferQuickPick: Promise<vscode.QuickPickItem | undefined> = new Promise((resolve, reject) => {
            const quickPick = vscode.window.createQuickPick();
            quickPick.items = w_choices;
            quickPick.placeholder = Constants.USER_MESSAGES.MINIBUFFER_PROMPT;
            quickPick.matchOnDetail = true;

            w_disposables.push(
                quickPick.onDidChangeSelection(selection => {
                    if (selection[0]) {
                        resolve(selection[0]);
                        quickPick.hide();
                    }
                }),
                quickPick.onDidChangeValue(changed => {
                    if (/^\d+$/.test(changed)) {
                        if (quickPick.items.length) {
                            quickPick.items = [];
                        }
                    } else if (quickPick.items !== w_choices) {
                        quickPick.items = w_choices;
                    }
                }),
                quickPick.onDidHide(() => {
                    resolve(undefined);
                }),
                quickPick
            );
            quickPick.show();

        });

        const w_picked: vscode.QuickPickItem | undefined = await q_minibufferQuickPick;

        w_disposables.forEach(d => d.dispose());

        if (w_picked) {
            this.helpForCommandFinisher(w_picked.label);
        }

        // -------------------------------------------

        // const command = await g.app.gui.get1Arg(
        //     {
        //         title: 'Help for Command',
        //         prompt: 'Type the name of the command',
        //         placeHolder: '<command>',
        //     }
        // );
        // if (command) {
        //     this.helpForCommandFinisher(command);
        // }

        // -------------------------------------------

        // c.putHelpFor(s);
        // c.minibufferWantsFocusNow();
        // k.fullCommand(event, help=True, helpHandler=this.helpForCommandFinisher)
    }
    //@+node:felix.20231224164520.11: *4* getBindingsForCommand
    public getBindingsForCommand(commandName: string): string {
        return '';

        // TODO !

        // k = self.c.k
        // data = []
        // n1, n2 = 4, 20
        // d = k.bindingsDict
        // for stroke in sorted(d):
        //     assert g.isStroke(stroke), repr(stroke)
        //     aList = d.get(stroke, [])
        //     for bi in aList:
        //         if bi.commandName == commandName:
        //             pane = '' if bi.pane == 'all' else f" {bi.pane}:"
        //             s1 = pane
        //             s2 = k.prettyPrintKey(stroke)
        //             s3 = bi.commandName
        //             n1 = max(n1, len(s1))
        //             n2 = max(n2, len(s2))
        //             data.append((s1, s2, s3),)
        // data.sort(key=lambda x: x[1])
        // return ','.join([f"{z1} {z2}" for z1, z2, z3 in data]).strip()
    }
    //@+node:felix.20231224164520.12: *4* helpForCommandFinisher
    public helpForCommandFinisher(commandName: string): void {
        const c = this.c;
        let s;
        if (commandName && commandName.startsWith('help-for-')) {
            // Execute the command itself
            c.doCommandByName(commandName);
        } else {
            if (commandName) {
                const bindings = this.getBindingsForCommand(commandName);
                const func = c.commandsDict[commandName];
                s = g.getDocStringForFunction(func);
                if (s) {
                    s = this.replaceBindingPatterns(s);
                } else {
                    s = 'no docstring available';
                }
                // Create the title.
                const s2 = bindings ? `${commandName} (${bindings})` : commandName;
                // const underline = '+'.repeat(s2.length);
                const title = `# ${s2}\n\n`; // `${s2}\n${underline}\n\n`;
                s = title + g.dedent(s);

            } else {
                //@+<< set s to about help-for-command >>
                //@+node:felix.20231224164520.13: *5* << set s to about help-for-command >>
                s = `\
                # About Leo\'s help command

                Invoke Leo\'s help-for-command as follows:

                    <Alt-X>help-for-command<return>

                Next, type the name of one of Leo\'s commands.

                Here are the help-for commands:

                    help-for-command
                    help-for-creating-external-files
                    help-for-find-commands
                    help-for-minibuffer
                    help-for-scripting
                    help-for-settings
                `;
                //@-<< set s to about help-for-command >>
            }
            c.putHelpFor(s);
        }
    }
    //@+node:felix.20231224164520.14: *4* replaceBindingPatterns
    replaceBindingPatterns(s: string): string {
        /**
         * For each instance of the pattern !<command-name>! in s,
         * replace the pattern by the key binding for command-name.
         */
        let c = this.c;
        let pattern = new RegExp('!<(.*)>!', 'g');
        let m: RegExpExecArray | null;

        // void vscode.window.showInformationMessage("TODO : replaceBindingPatterns");

        // while ((m = pattern.exec(s)) !== null) {
        //     let name = m[1];
        //     let [junk, aList] = c.config.getShortcut(name);
        //     let key: string;

        //     for (let bi of aList) {
        //         if (bi.pane === 'all') {
        //             key = c.k.prettyPrintKey(bi.stroke.s);
        //             break;
        //         }
        //     }

        //     if (!key) {
        //         key = `<Alt-X>${name}<Return>`;
        //     }

        //     s = s.substring(0, m.index) + key + s.substring(m.index + m[0].length);
        // }
        return s;
    }
    //@+node:felix.20231224164520.15: *3* helpForCreatingExternalFiles
    @cmd('help-for-creating-external-files', 'Prints a discussion of creating external files.')
    public helpForCreatingExternalFiles(): void {
        //@+<< define s >>
        //@+node:felix.20231224164520.16: *4* << define s >> (helpForCreatingExternalFiles)
        //@@language md

        let s = `\
        # Creating External Files

        This help discusses only \@file nodes. For other ways of creating
        external files, see:

            https://leo-editor.github.io/leo-editor/tutorial-scripting.html or
            https://leo-editor.github.io/leo-editor/directives.html

        Leo creates external files in an unusual way. Please fee free to ask for
        help:

            https://groups.google.com/forum/#!forum/leo-editor or
            http://webchat.freenode.net/?channels=%23leo&uio=d4

        ## Overview

        Leo creates **external files** (files on your file system) from **\@file
        nodes** and *all the descendants* of the \@file node. Examples:

            @file spam.py
            @file ../foo.c
            @file ~/bar.py

        A single Leo outline may contain many \@file nodes. As a result, Leo
        outlines function much like project files in other IDE\'s (Integrated
        development environments).

        Within an \@file tree, simple text markup (discussed next) tells Leo how
        to create the external file from the \@file node and its descendants.

        ## Markup

        Section references and the \\@all and \\@others directives tell Leo how
        to create external files.

        -   A **section name** is any text of the form:

                <\\< any text >\\> (>> must not appear in "any text".)

        -   A **section definition node** is any node whose headline starts with
            a section name.

        -   A **section reference** is a section name that appears in body text.

        Leo creates external files containing \\@others directives by writing
        the *expansion* of the \@file node. The **expansion** of *any* node is
        the node\'s body text after making these text **substitutions**:

        -   Leo replaces \\@all by the *unexpanded* body text of *all* nodes.
        -   Leo replaces \\@others with the *expansion* of all descendant nodes
            **except** section definition nodes. That\'s how \\@others got its
            name.
        -   Leo replaces section references by the *expansion* of the body text
            of the corresponding section definition node.

        Whitespace is significant before \\@others and section references. Leo
        adds the leading whitespace appearing before each \\@others directive or
        section reference to every line of their expansion. As a result, Leo can
        generate external files even for Python. The following cute trick works:

            if 1:
                <\\< a section >\\>
            if 0:
                \\@others

        **Notes**:

        -   Any node may contain a single \\@others directive. No node may
            contain more than one \@others directive.
        -   Nodes that *aren\'t* section definition nodes are included in the
            expansion of the *nearest* ancestor node containing an \@others
            directive.

        **Example 1**: The body of the \@file node for a typical Python module
        will look something like:

            '\\''A docstring.'\\''
            <\\< imports >\\>
            \@others
            if __name__ == '__main__':
                main()

        **Example 2**: Here is a typical Python class definition in Leo:

            class MyClass:
                '\\''A docstring.'\\''
                \@others

        ## \@first and \@last

        The \@first directive forces lines to appear before the first sentinel
        of a external file. For example:

            @first #! /usr/bin/env python

        Similarly, \@last forces lines to appear after the last sentinel.

        ## \\@path

        Rather than specifying long paths in \@file nodes, you can specify a
        path in an ancestor \@path node.

        For example, suppose three nodes have the following headlines:

            @path a
                @path b
                    @file c/d.py

        The \@file node creates the file a/b/c/d.py

        Within \@path and @\<file\> paths, {{exp}} gets evaluated with the
        following predefined symbols: c, g, p, os and sys. For example:

            @file {{os.path.abspath(os.curdir)}}/abc.py
        `;
        //@-<< define s >>
        s = s.replace(/\\/g, '');
        this.c.putHelpFor(s);
    }
    //@+node:felix.20231224164520.23: *3* helpForFindCommands
    @cmd('help-for-find-commands', 'Prints a discussion of Leo\'s find commands.')
    public helpForFindCommands(): void {
        //@+<< define s >>
        //@+node:felix.20231224164520.24: *4* << define s >> (help-for-find-commands)
        //@@language md

        const s = `\
        # Finding & replacing text

        **Ctrl-F** (start-search) shows the Find pane and puts focus in the find
        box.

        Enter the find text and the replacement text if desired:

            Tab switches focus from widget to widget.
            Return executes the find-next command.

        When Leo selects the found text you can do:

            Ctrl-equal (replace)
            Ctrl-minus (replace-then-find)
            F3 (find-next)
            F2 (find-previous)
            Ctrl-G (keyboard-quit)
            anything else :-)

        You can Leo\'s commands toggle check boxes and radio buttons. These
        commands are listed in the Search menu.

        You can execute these commands (and see their key bindings) using the
        minibuffer:

            <Alt-X>tog<tab>f<tab>   or
            <Alt-X>set<tab>f<tab>

        # Incremental searching

        Incremental search is done only from the minibuffer:

            Alt-I (isearch forward)
            Alt-R (isearch backward)
            BackSpace retracts the search
            All other characters extend the search

        During an incremental search:

            Enter or Ctrl-G stops the search.
            Alt-S finds the search string again.
            Alt-R ditto for reverse searches.
        `;

        //@-<< define s >>
        this.c.putHelpFor(s);
    }
    //@+node:felix.20231224164520.25: *3* helpForKeystroke
    @cmd('help-for-keystroke', 'Prompts for any key and prints the bindings for that key.')
    public helpForKeystroke(): void {
        setTimeout(() => {
            void vscode.commands.executeCommand('workbench.action.openGlobalKeybindings');
        }, 150);

        // workbench.action.openGlobalKeybindings


        // c, k = self.c, self.c.k
        // state_name = 'help-for-keystroke'
        // state = k.getState(state_name)
        // if state == 0:
        //     k.setLabelBlue('Enter any key: ')
        //     k.setState(state_name, 1, self.helpForKeystroke)
        //     c.minibufferWantsFocus()
        // else:
        //     d = k.bindingsDict
        //     k.clearState()
        //     result = []
        //     for bi in d.get(event.stroke, []):  # a list of BindingInfo objects.
        //         pane, cmd = bi.pane, bi.commandName
        //         result.append(cmd if pane == 'all' else f"{pane}: {cmd}")
        //     s = f"{event.stroke.s}: {','.join(result)}"
        //     k.showStateAndMode()
        //     c.frame.putStatusLine(s, bg='blue', fg='white')
        //     c.bodyWantsFocus()

    }
    //@+node:felix.20231224164520.26: *3* helpForMinibuffer
    @cmd('help-for-minibuffer', 'Print a messages telling you how to get started with Leo.')
    public helpForMinibuffer(): void {
        const c = this.c;
        //@+<< define s >>
        //@+node:felix.20231224164520.27: *4* << define s >> (helpForMinibuffer)
        //@@language md

        const s = `\
        # About the Minibuffer

        The mini-buffer is intended to be like the Emacs buffer:

        (default shortcut: Alt-x) Puts the focus in the minibuffer. Type a
        full command name, then hit <Return> to execute the command. 

        Use the help-for-command command to see documentation for a particular command.
        `;
        //@-<< define s >>
        c.putHelpFor(s);
    }
    //@+node:felix.20231224164520.30: *3* helpForScripting
    @cmd('help-for-scripting', 'Prints a discussion of Leo scripting.')
    public helpForScripting(): void {
        //@+<< define s >>
        //@+node:felix.20231224164520.31: *4* << define s >> (helpForScripting)
        //@@language md

        const s = `\
        # Summary of Leo Scripting

        ## Overview

        Any Leo node may contain a JavaScript or Typescript script.

        Ctrl-B (execute-script) executes the body text of the presently selected
        node.

        execute-script creates the script using \@others and section references:
        **you can create complex scripts from a node and its descendants.**

        As discussed below, execute-script predefines three variables: c, g and
        p. Using these variables, scripts may easily do any of the following:

        -   Gain access to all data contained in any Leo outline.
        -   Traverse the data in any outline.
        -   Use utility classes and function in the leo.core.leoGlobals module.
        -   Execute any code in Leo\'s own code base.

        *Tip*: use Alt-1 (toggle-autocompleter) and Alt-2 (toggle-calltips) as
        aids to memory and to speed typing.

        ## Predefined symbols

        The execute-script command predefines three variables:

            c: The commander of the present outline.
            g: The leo.core.leoGlobals module.
            p: The presently selected position, c.p.

        ## Commands class

        A commander is an instance of the Commands class in
        leo.core.leoCommands. A commander represents all outline data and most
        of Leo\'s source code. Here are the most important ivars of the Commands
        class:

            c.frame         c's outer frame, a LeoFrame instance.
            c.user_dict     a temporary dict for use of scripts and plugins.
            c.redraw()
            c.positionExists(p)

        Here is a partial list of the **official ivars** of any commander c:

        -   c.frame The frame containing the log,body,tree, etc. c.frame.body The
        -   body pane. c.frame.body.widget The gui widget for the body pane.
        -   c.frame.body.wrapper The high level interface for the body widget.
        -   c.frame.iconBar The icon bar. c.frame.log The log pane.
        -   c.frame.log.widget The gui widget for the log pane.
        -   c.frame.log.wrapper The high-level interface for the log pane.
        -   c.frame.tree The tree pane.

        ## VNode class

        All data in Leo outlines resides in vnodes. All clones of the same node
        share the same VNode. Here are the most important ivars and properties
        of the VNode class:

            v.b: v's body text.
            v.h: v's headline text.
            v.u: v.unknownAttributes, a persistent Python dictionary.

        v.u (uA\'s or unknownAttributes or userAttributes) allow plugins or
        scripts to associate persistent data with vnodes. For details see the
        section about userAttributes in the Customizing Leo chapter.

        ## Position class

        A position represents the state of a traversal of an outline. Because of
        clones, the same VNode may appear multiple times during a traversal.

        > Note: Use **p.v** for it's boolean/validity value.

        Properties of the position class:

            p.b: same as p.v.b.
            p.h: same as p.v.h.
            p.u: same as p.v.u.

        Getter methods of the position class:

            p.back()
            p.children()
            p.firstChild()
            p.hasBack()
            p.hasChildren()
            p.hasNext()
            p.hasParent()
            p.hasThreadBack()
            p.hasThreadNext()
            p.isAncestorOf(p2)
            p.isAnyAtFileNode()
            p.isAt...Node()
            p.isCloned()
            p.isDirty()
            p.isExpanded()
            p.isMarked()
            p.isRoot()
            p.isVisible()
            p.lastChild()
            p.level()
            p.next()
            p.nodeAfterTree()
            p.nthChild()
            p.numberOfChildren()
            p.parent()
            p.parents()
            p.threadBack()
            p.threadNext()
            p.visBack()
            p.visNext()

        Setter methods of the position class:

            p.setDirty()
            p.setMarked()

        Methods that operate on nodes:

            p.clone()
            p.contract()
            p.doDelete(new_position)
            p.expand()
            p.insertAfter()
            p.insertAsNthChild(n)
            p.insertBefore()
            p.moveAfter(p2)
            p.moveToFirstChildOf(parent,n)
            p.moveToLastChildOf(parent,n)
            p.moveToNthChildOf(parent,n)
            p.moveToRoot()

        The following position methods move positions *themselves*: they change
        the node to which a position refers. They do *not* change outline
        structure in any way! Use these when generators are not flexible enough:

            p.moveToBack()
            p.moveToFirstChild()
            p.moveToLastChild()
            p.moveToLastNode()
            p.moveToNext()
            p.moveToNodeAfterTree(p2)
            p.moveToNthChild(n))
            p.moveToParent()
            p.moveToThreadBack()
            p.moveToThreadNext()
            p.moveToVisBack(c)
            p.moveToVisNext(c)

        ## Generators

        The following Python generators return positions:

            c.all_positions()
            c.all_unique_positions()
            p.children()
            p.parents()
            p.self_and_parents()
            p.self_and_siblings()
            p.following_siblings()
            p.subtree()
            p.self_and_subtree()

        ## The leo.core.leoGlobals module

        **g vars**:

            g.app
            g.app.gui
            g.app.windowlist
            g.unitTesting
            g.user_dict  # a temporary dict for use of scripts and plugins.

        **g decorator**:

            @g.command(command-name)

        **g functions** (the most interesting: there are many more in
        leoGlobals.py):

            g.angleBrackets()
            g.app.commanders()
            g.app.gui.guiName()
            g.es(*args,**keys)
            g.es_print(*args,**keys)
            g.es_exception(error)
            g.getScript(c,p,
                useSelectedText=True,
                forcePythonSentinels=True,
                useSentinels=True)
            g.openWithFileName(fileName, old_c=None, gui=None)
            g.os_path_... # Wrappers for os.path methods.
            g.pdb(message='')
            g.toEncodedString(s,encoding='utf-8',reportErrors=False)
            g.toUnicode(s, encoding='utf-8',reportErrors=False)
            g.trace(*args,**keys)
            g.warning(*args,**keys)
        `;
        //@-<< define s >>
        this.c.putHelpFor(s);
    }
    //@+node:felix.20231224164520.32: *3* helpForSettings
    @cmd('help-for-settings', 'Prints a discussion about Leo\'s settings.')
    public helpForSettings(): void {
        //@+<< define s >>
        //@+node:felix.20231224164520.33: *4* << define s >> (helpForSettings)
        //@@language md

        // Using raw string is essential.

        const s = `\
        # About settings

        **\@settings trees** specify settings. 
        
        The headline of each node indicates its type. The body text of most nodes contain comments.

        However, the body text of \@data, \@font, \@item and \@shortcuts nodes
        may contain data. For more information about the format of \@settings
        trees, see leoSettings.leo.

        An internal leojsSettings.leojs is LeoJS\'s main settings file. myLeoSettings.leo contains
        your personal settings. 
        
        Settings in myLeoSettings.leo override the settings in leojsSettings.leojs.
        
        Put myLeoSettings.leo in your home \'\~\' directory or in the \'\~/.leo\' directory. 
        
        Any other .leo file may contain an \@settings tree. Such settings apply only to that file.

        `;
        //@-<< define s >>
        this.c.putHelpFor(s);
    }
    //@+node:felix.20231224164520.36: *3* help.showSettings
    @cmd(
        'show-settings',
        'Print the value of every setting, except key bindings, commands, and open-with tables.'
    )
    public showSettings(): void {

        // Print the value of every setting, except key bindings, commands, and
        // open-with tables.

        // The following shows where the each setting comes from:

        // -     leoSettings.leo,
        // -  @  @button, @command, @mode.
        // - [D] default settings.
        // - [F] indicates the file being loaded,
        // - [M] myLeoSettings.leo,
        // - [T] theme .leo file.

        this.c.config.printSettings();
    }
    //@+node:felix.20231224164520.37: *3* help.showSettingsOutline
    @cmd(
        'show-settings-outline',
        'Create and open an outline, summarizing all presently active settings. ' +
        'The outline retains the organization of all active settings files.'
    )
    public showSettingsOutline(): void {

        // See #852: https://github.com/leo-editor/leo-editor/issues/852

        this.c.config.createActivesSettingsOutline();

    }
    //@+node:felix.20240206234225.1: *3* printButtons
    // Originally from leoKeys.py
    @cmd(
        'show-buttons',
        'Print all @button and @command commands.'
    )
    public printButtons(): void {

        const c = this.c;
        const tabName = '@buttons \& @commands';

        let data: [string, string][] = [];
        const configs = [c.config.getButtons(), c.config.getCommands()];
        configs.forEach(aList => {
            aList.forEach((z: [Position, string, unknown]) => {
                const [p, script, rclicks] = z;
                const cContext = p.v.context;
                const tag = (
                    cContext.shortFileName().endsWith('myLeoSettings.leo') ||
                    cContext.shortFileName().endsWith('myLeoSettings.leojs')
                ) ? 'M' : 'G';
                data.push([p.h, tag]);
            });
        });
        const lists = [g.app.config.atLocalButtonsList, g.app.config.atLocalCommandsList];
        lists.forEach(aList => {
            aList.forEach(p => {
                data.push([p.h, 'L']);
            });
        });
        const result = data.sort((a, b) => a[0].localeCompare(b[0])).map(z => `**${z[1]}** ${z[0]}\n`);

        result.unshift('# ' + tabName, '');
        result.push(
            '',
            'legend:\n',
            ' - **G** leojsSettings.leojs',
            ' - **L** local .leo File',
            ' - **M** myLeoSettings.leo',
        );

        const s = result.join('\n');
        this.c.putHelpFor(s);

    }
    //@+node:felix.20240206234256.1: *3* printCommands
    // Originally from leoKeys.py
    @cmd('show-commands', 'Print all the known commands.')
    public printCommands(): void {

        const c = this.c;
        const tabName = 'Commands';

        let data: string[] = [];
        for (let commandName of Object.keys(c.commandsDict).sort()) {
            data.push(commandName.trim() + '\n');
        }

        const s = '# ' + tabName + '\n\n' + data.join('\n');
        this.c.putHelpFor(s);

    }

    //@+node:felix.20240206235351.1: *3* printCommandsWithDocs
    // Originally from leoKeys.py
    @cmd('show-commands-with-docs', 'Show all the known commands and their docstring.')
    public printCommandsWithDocs(): void {

        const c = this.c;
        const tabName = 'List';

        let data: string[] = [];
        for (let commandName of Object.keys(c.commandsDict).sort()) {
            const doc: string = (c.commandsDict[commandName] as any)['__doc__'];
            data.push("## " + commandName.trim() + "\n\n");
            if (doc) {
                data.push(doc.trim() + "\n\n");
            }
        }

        const s = '# ' + tabName + '\n\n' + data.join('\n');
        this.c.putHelpFor(s);

    }

    /*
    c, k = self.c, self
    tabName = 'List'
    c.frame.log.clearTab(tabName)
    inverseBindingDict = k.computeInverseBindingDict()
    data = []
    key: str
    dataList: list[tuple[str, str]]
    for commandName in sorted(c.commandsDict):
        dataList = inverseBindingDict.get(commandName, [('', ''),])
        for pane, key in dataList:
            key = k.prettyPrintKey(key)
            binding = pane + key
            cmd = commandName.strip()
            doc = f'{c.commandsDict.get(commandName).__doc__}' or ''
            if doc == 'None':
                doc = ''
            # Formatting for multi-line docstring
            if doc.count('\n') > 0:
                doc = f'\n{doc}\n'
            else:
                doc = f'   {doc}'
            if doc.startswith('\n'):
                doc.replace('\n', '', 1)
            toolong = doc.count('\n') > 5
            manylines = False
            if toolong:
                lines = doc.split('\n')[:4]
                lines[-1] += ' ...\n'
                doc = '\n'.join(lines)
                manylines = True
            n = min(2, len(binding))
            if manylines:
                doc = textwrap.fill(doc, width=50, initial_indent=' ' * 4,
                        subsequent_indent=' ' * 4)
            data.append((binding, cmd, doc))
    lines = ['[%*s] %s%s\n' % (-n, binding, cmd, doc) for binding, cmd, doc in data]
    g.es(''.join(lines), tabName=tabName)
    */
    //@-others

}
//@-others

//@-leo
