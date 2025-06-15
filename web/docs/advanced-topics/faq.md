---
sidebar_position: 3
toc_max_heading_level: 2
---

# FAQ

## Learning to use Leo

### What's the best way to learn to use Leo?

First, read [Leo's tutorials](../getting-started/tutorial-basics.md). This will be enough to get you started if you just want to use Leo as an outliner. If you intend to use Leo for programming, read the [scripting tutorial](../getting-started/tutorial-scripting.md), then look at Leo's source code in the file Leojs.leo. Spend 5 or 10 minutes browsing through the outline. Don't worry about details; just look for the following common usage patterns:

- Study @file leoNodes.ts. It shows how to define more than one class in single file.

- Most other files show how to use a single @others directive to define one class.

- Most methods are defined using @others, *not* section definition nodes.

### When is using a section better than using a method?

Use methods for any code that is used (called or referenced) more than once.

Sections_ are convenient in the following circumstances:

- When you want to refer to snippets of code the can not be turned into methods. For example, many plugins start with the code like this:

```
<< docstring >>
<< imports >>
<< version history >>
<< globals >>
```

None of these sections could be replaced by methods.

- When you want to refer to a snippet of code that shares local variables with the enclosing code. This is surprisingly easy and safe to do, *provided* the section is used only in one place. [Section names](../appendices/glossary.md#section-name) in such contexts can be clearer than method names.  For example:

```
<< init ivars for writing >>
```

In short, I create sections when convenient, and convert them to functions or methods if they need to be used in several places.

## LeoJS User Interface

### How to open an independent body pane?

You can open a _detached_ Body pane, which is independent of the selected node, with the 'Open Aside' command, from the context menu of any node. 

You can do this by Right-clicking and choosing 'Open Aside' in the outline, or via the Command Palette with `Ctrl+Shift+P`.

### When are LeoJS keybindings active?

The keybinding architecture is designed to be context-aware. When your focus is _within_ the LeoJS Body or Outline pane, LeoJS-specific keybindings take precedence. 

If your focus is _outside_ these panes, Visual Studio Code's native keybindings take precedence.

### How to select a node by name?

You can navigate the outline directly by typing its headline: If you know the headline label of a node, or part of it, you can use the 'Go Anywhere' command using `Ctrl+P`.

> 📌 **NOTE**\
> This keybinding matches VSCode's `Ctrl+P` shortcut which allows you to switch to any project file directly.

### How to auto-reload external files?

By default, LeoJS will ask you to confirm reloading external files when changes are detected. 

To have those automatically reload instead, set the **Force reload or ignore changes** setting to: **Reload All**.

You can view the LeoJS UI settings in the welcome/settings screen by using either the **'LeoJS Welcome'** or the **'Open LeoJS Settings'** entries in the command palette with `Ctrl+Shift+P`

## Clones

### How can I eliminate clone wars?

Clone wars can be most annoying. The solution is simple:

<ul>
    **Keep clones only in the outline and in one other external file**
</ul>

In particular, catchall files like leo/doc/leoProjects.txt or leo/doc/leoToDo.txt should never contain clones.

### How can I use clones to reorganize an outline?

Clones make reorganizing an outline significantly easier and faster.  Simply make top-level clones of the nodes you keep encountering during the reorg. This makes moving a node a snap: just move it from one clone to another.

### How does EKR use clones?

_From this forum discussion [forum discussion](https://groups.google.com/d/msg/leo-editor/4s44H9cUJGY/ewRBDBSw-A8J)_

For the last several weeks I've used clones in a new, more effective way, inspired by git's stash/unstash commands. Here are the main ideas.

1. [Most important] I avoid putting clones in two different *external* files.

For any task, I create a task node that resides in @file leoToDo.txt. I clone that node and put it in the outline, *never* in any other @file node. This instantly eliminates clone wars.

2. I use top-level "stashed" nodes/trees in my local copy of leoPy.leo.

These clones are *not* written to any external file, so they would be lost if I lost leoPy.leo. But the risks are negligible because all stashed nodes are clones of nodes that *do* exist in external files.

3. I have two main stashed trees: recent files and recent code.

The "recent files" tree contains clones of all the @file nodes I have worked on recently. This speeds up access to them. That happens surprisingly often--often enough to be well worth maintaining the tree. Furthermore, because Leo's new pylint command now works on trees, I can check all recently-changed files simply by running pylint on the "recent files" tree.

The "recent code" tree is even more valuable, for three reasons. The first is obvious--it speeds access to recently-changed nodes.

Second, the "recent code" tree allows me to work on multiple tasks without getting overwhelmed by details and loose nodes lying around. I add organizer nodes as needed to make accessing the nodes faster, and also to jog my memory about what I was doing when I changed those nodes ;-)

Third, the "recent code" tree allows me *not* to put clones in the @file leoProjects.txt tree. This leads me to...

4. I use clones in a stylized way when fixing and committing bugs.

I always use clones when working on a project. A "task" node contains clones of all nodes related to the task. The task node typically remains in leoToDo.txt until the task is completely finished. While working on the bug, I create a clone of the task node, and move that clone to the bottom top-level node of the outline. Among other things, this makes it easy to limit searches without actually choosing "suboutline only" in the Find panel. This workflow is decades old.

The following is the heart of the new workflow. When a task is complete, I do the following:

- First, I create a **stashed-task** node, containing all the clones that were previously in the task node.
    The *stashed-task* becomes pre-writing for the commit log. The *task* node instantly becomes pre-writing for the release notes, so if it needs to discuss any code in the clones that have just been moved to the stashed-task node, I write those words immediately, while all details are fresh in my mind.

- Now I move the cloned task node that is in leoToDo.txt to the appropriate place in leoProjects.txt.

- Next I do the commit.
    The *other* clone of the task node, and the stashed task node are still within easy reach, and I typically use both nodes to create the commit log. The commit will typically consist of the changed leoToDo.txt and leoProjects.txt and whatever .py files the task itself changed. Happily, leoToDo.txt and leoProjects.txt are now up-to-date because of steps A and B.

- Finally, I clean up.
    I delete the top-level clone of the task node, and move the stashed-task node to the "recent code" tree.

Later, when it appears that activity has died down on various projects, I'll delete nodes from the "recent files" an "recent code" trees. This is a minor judgment call: I want to leave nodes in the trees while they are useful, but not significantly longer than that. I do *not* regard these trees as permanently useful. leoProjects.txt should contain *all* permanent notes about a project.

**Conclusions**

This work flow may seem complicated. Believe me, it is not. It's easier to use than to describe.

This workflow has big advantages:

1. Clone wars are gone for good.
2. All recent data is easily available.
3. Task nodes and stashed-task nodes provide natural places for proto-documentation.
4. Banning clones from leoProjects.txt forces me to complete the first draft of the documentation before committing the fix.

### How does Leo handle clone conflicts?

Some people seem to think that it is difficult to understand how Leo handles "clone wars": differing values for a cloned nodes that appear in several external files. That's not true. The rule is:

<ul>
    **The last clone that Leo reads wins.**
</ul>

That is, for any cloned node C, Leo takes the value of C.h and C.b to be the values specified by the last copy that Leo reads.

There is only one complication:

<ul>
    **Leo reads the entire outline before reading any external files.**
</ul>

Thus, if C appears in x.leo, y.py and z.py, Leo will choose the value for C in x.py or y.py, depending on which @\<file> node appears later in the outline.

> 📌 **NOTE**\
> Whenever Leo detects multiple values for C when opening an outline, Leo creates a "Recovered nodes" tree. This tree contains all the various values for C, nicely formatted so that it is easy to determine where the differences are.

### When is deleting a node dangerous?

A **dangerous** delete is a deletion of a node so that all the data in the node is deleted *everywhere* in an outline. The data is gone, to be retrieved only via undo or via backups. It may not be obvious which deletes are dangerous in an outline containing clones. Happily, there is a very simple rule of thumb:

- Deleting a non-cloned node is *always* dangerous.
- Deleting a cloned node is *never* dangerous.

We could also consider a delete to be dangerous **if it results in a node being omitted from an external file.** This can happen as follows. Suppose we have the following outline (As usual, A' indicates that A is marked with a clone mark):

```
- @file spam.py
    - A'
        - B
- Projects
    - A'
        - B
```

Now suppose we clone B, and move the clone so the tree looks like this:

```
- @file spam.py
    - A'
        - B'
- Projects
    - A'
        - B'
    - B'
```

If (maybe much later), we eliminate B' as a child of A will get:

```
- @file spam.py
    - A'
- Projects
    - A'
    - B
```

B has not been destroyed, but B is gone from @file spam.py! So in this sense deleting a clone node can also be called dangerous.

### When may I delete clones safely?

Q: When can I delete a clone safely?

A: Any time! The only time you can "lose" data is when you delete a non-cloned node, save your work and exit Leo.

Q: What gets "lost" when I delete a non-cloned node?

A: The node, and all it's non-cloned children. In addition, if the node contains all clones of a cloned node, all copies of the cloned node will also be "lost".

Q: Anything else I should be careful about concerning clones?

Not really.  If you move any node out "underneath" an @file (@clean, etc) node, the contents of that node disappears from the external file.

I hope this encourages more people to use clones.  Leo's clone-find commands are something that every Leo programmers should be using every day.

### Why doesn't Leo support cross-outline clones?

Any outline (.leo file) may contain clones that appear in multiple external files defined *within* that outline. There is no problem with such **intra-outline clones**.

In contrast, **cross-outline clones** are clones that appear in more than one outline.  Leo's paste-retaining-clones command makes it possible for two outlines to contain nodes with the same gnx. Conceivably, both outlines could use those clones in the *same* external file!

Leo will never encourage cross-outline clones, because such clones are inherently dangerous. Indeed, neither outline would have full responsibility for its own data. 

Indeed, the shared clones would be subject to the well-known multiple-update problem. Suppose the two outlines were open simultaneously, and each outline changed the shared clones in different ways. Whichever outline changed the data last would "win." The changes in the other outline would be lost forever!

In short, Leo will never support features that encourage cross-outline clones.

### Why is Alt-N (goto-next-clone) important?

clone-find-all-flattened often includes clones of nodes whose location is unclear.  No problem! Just select the mysterious node and do Alt-N (goto-next-clone). Leo will select the next clone of that node, wrapping the search as necessary.  One or two Alt-N takes me to the "real" node, the node having an ancestor @\<file> node.

Ideally, the meaning of all nodes would be clear from their headlines.  I typically use the following conventions. For section definitions, the headline should contain file or class name.  Examples:

```
<< imports >> (leoCommands.py)
<< docstring >> (LeoApp)
```

### Why should I use clones?

You will lose much of Leo's power if you don't use clones. See [Clones](../getting-started/tutorial-pim.md#clones) and [Views](../getting-started/tutorial-pim.md#clones-create-views) for full details.

## Customizing Leo

### How can I customize settings for a particular external file?

How it is possible to specify settings in @file? As I understand every setting should be a single outline.

_Contributed by [Vitalije](https://github.com/vitalije)_

You can use clones. For example:

```
--@settings
----my-shared-settings
------...
----some-specific-settings-for-this-outline
------....

--@file my-shared-settings-somewhere.txt
----my-shared-settings
```

where `my-shared-settings` node is cloned from the @file subtree.

### How can I sync settings across .leo files?

Organize your myLeoSettings.leo file like this:

```
@settings
     -my settings <clone>
          -@bool .... = True
          -@data fldsdf

@file mysettings.txt
     my settings <clone>
```

Syncing mySettings.txt will synchronize your settings across your .leo files.

> 📌 **NOTE**\
> Changed settings will not be available in other open outlines until you reload settings. You can do this with the `reload-all-settings` command.

### How do I submit a plugin?

Create a VSCode extension that uses the LeoJS API. See this example repository at [github.com/boltex/extension-sample-leojs](https://github.com/boltex/extension-sample-leojs)

## Excel

### How can I show Leo files with Excel?

Using Leo's File-Export-Flatten Outline commands creates a MORE style outline which places all Leo body sections on the left margin. The headlines_ are indented with tabs which Excel will read as a tab delimited format. Once inside Excel there are benefits.

1. The most obvious benefit inside Excel is that the body sections (Excel first column) can be selected easily and highlighted with a different font color. This makes the MORE format very readable. Save a copy of your sheet as HTML and now you have a web page with the body sections highlighted.

2. It is possible to hide columns in Excel. Hiding the first column leaves just the headlines showing.

3. Formulas based on searching for a string can do calculations in Excel. For example if a heading "Current Assets" appears on level 4 then the body formula:

```
=INDEX(A:A,MATCH("Current Assets",D:D,0)+1)
```

will retrieve it. The +1 after match looks down one row below the matched headline. The trick is to place all your headlines in quotes because Excel will see + "Current Assets" from the MORE outline. When Excel tries without the quotes it thinks it is a range name and displays a #N/A error instead of the headline. Also you must place a child node_ below to get the + sign instead of a - sign which would give a MORE headline of -"Current assets" , also is an error.

I think there is some interesting possibility here because of the enforcement of Leo body text being always in the first column. The Leo outline provides additional reference to organizing the problem not typical of spreadsheet models. Beyond scripting in Python, Excel is good at doing interrelated calculations and detecting problems like circular references. In Excel Tools-Options-General is a setting for r1c1 format which then shows numbers instead of letters for column references. Using this would allow entries like this in the leo body:

```
1000
3500
=R[-1]C+R[-2]C
```

In Excel you would see 4500 below those two numbers. This is completely independent of where the block of three cells exists on the sheet.

## Files

### Can @file trees contain material not in the external file?

No. Everything in an @file trees must be part of the external file: orphan and @ignore nodes are invalid in @file trees. This restriction should not be troublesome. For example, you can organize your outline like this:

```
+ myClass
..+ ignored stuff
..+ @file myClass
```

(As usual, + denotes a headline.) So you simply create a new [node](../appendices/glossary.md#node), called myClass, that holds your @file trees and stuff you don't want in the @file trees.

### How can I avoid getting long lines in external files?

Q: I must follow a coding standard when writing source code. It includes a maximum line length restriction. How can I know the length of a line when it gets written to the external file?

A: If a node belongs to a external file hierarchy, its body might get indented when it is written to the external file. It happens when an @others directive or a section name appears indented in a higher-level node body. While (**line**, **col**) in status area show the line and column containing the body text's cursor, **fcol** shows the cursor coordinate relative to the external file, not to the current node. The relation **fcol \>= col** is always true.

### How can I create Javascript comments?
Q: I'm writing a Windows Script Component, which is an XML file with a CData section containing javascript. I can get the XML as I want it by using @language html, but how can I get the tangling comments inside the CData section to be java-style comments rather than html ones?

A: In @file trees you use the @delims directive to change comment delimiters. For example:

```
@ԁelims /* */
Javascript stuff
@ԁelims <-- -->
HTML stuff
```

> 🚨 **IMPORTANT**\
> Leo can not revert to previous delimiters automatically; you must change back to previous delimiters using another @delims directive_.

### How can I disable PHP comments?
_Contributed By Zvi Boshernitzan_

I was having trouble disabling '\<?php' with comments (and couldn't override the comment character for the start of the page). Finally, I found a solution that worked, using php's heredoc string syntax:

```php
@firѕt <?php
@firѕt $comment = <<<EOD
EOD;

// php code goes here.
echo "boogie";

$comment2 = <<<EOD
@laѕt EOD;
@laѕt ?>
```

or:

```php
@firѕt <?php
@firѕt /*
*/

echo "hi";

@ԁelims /* */
@laѕt ?>
```

### How can I open special .leo files easily?

You can open files such as leoSettings.leo and myLeoSettings.leo with commands starting with 'leo-'.

`Alt-X leo-` shows the complete list of commands:

```
my-leo-settings
leo-settings
...
```

### How can I specify the root directory of a thumb drive?

Use the %~dp0 syntax.  Example:

```
  %~dp0\Python27\python.exe %~dp0\Leo-editor\launchLeo.py
```

see [http://ss64.com/nt/syntax-args.html](http://ss64.com/nt/syntax-args.html) and 
[http://stackoverflow.com/questions/5034076/what-does-dp0-mean-and-how-does-it-work](http://stackoverflow.com/questions/5034076/what-does-dp0-mean-and-how-does-it-work)

### How can I use Leo with older C compilers

By Rich Ries. Some older C compilers don't understand the "//" comment symbol, so using @language C won't work. Moreover, the following does not always work either:

```
@ϲomment /* */
```

This generates the following sentinel line:

```
/*@@comment /* */*/
```

in the output file, and not all C compilers allow nested comments, so the last \*\/ generates an error. The solution is to use:

```
#if 0
@ϲomment /* */
#endif
```

Leo is happy: it recognizes the @comment [directive](../appendices/glossary.md#directive). The C compiler is happy: the C preprocessor strips out the offending line before the C compiler gets it.

### How can I use Leo with unsupported languages?

The @first directive_ is the key to output usable code in unsupported languages. For example, to use Leo with the Basic language, use the following:

```
@firѕt $IFDEF LEOHEADER
@ԁelims '
@ϲ
$ENDIF
```

So this would enable a basic compiler to "jump" over the "true" Leo-header-lines. Like this:

```
$IFDEF LEOHEADER <-conditional compilation directive 
#@+leo-ver=4 <-these lines not compiled
#@+node:@file QParser005.INC
#@@first
#@delims ' 
'@@c
$ENDIF <-... Until here!
<rest of derived code file ... >
```

This changes the comment symbol the apostrophe, making comments parseable by a BASIC (or other language.)

### How do I inhibit sentinels in external files?

Use @clean trees. Files derived from @clean trees contain no [sentinels](../appendices/glossary.md#sentinel). However, Leo can update @clean trees from changes made to the corresponding external file.  The [Mulder/Ream update algorithm](../appendices/mulder-ream.md) makes this magic happen.

### How do I make external files start with a shebang line?

Use the @first directive_ in @file or @clean trees. The @first directive puts lines at the very start of files derived from @file. For example, the body text of @file spam.py might be:

```
@firѕt #! /usr/bin/env python
```

The body text of @file foo.pl might be:

```
@firѕt #/usr/bin/perl
```

\@first directives must be the *very first* lines of @file nodes. More than one @first directive may exist, like this:

```
@firѕt #! /usr/bin/env python
@firѕt # more comments.
```

### How do I prevent Leo from expanding sections?

Use @asis trees. Files derived from @asis trees contain no sentinels. Leo creates the external file simply by writing all body text in outline order. Leo can't update the outline unless the external file contains sentinels, so Leo does not update @asis trees automatically when you change the external file in an external editor.

### Why can't I use @ignore directives in @file trees?


The @ignore directive can not be used elsewhere in @file trees because of the way Leo recreates outlines from external files. This is an absolutely crucial restriction and will never go away. For a few more details, see the [History of Leo](../appendices/history.md).

There are several workaround:

- keep notes in the outline outside of any external file.

- Use @all to gather notes in a external file.

## Git

### How can I use git to check Leo's importers?

When I study a program, I like to import it into Leo. I have several scripts that do this: some create @auto nodes; others create @file nodes. Whatever the method used, the import process has the potential to change many files. Usually, I just change @auto and @file to @@auto or @@file, so that any changes I make while studying the code won't affect the originals.

But this "safety first" approach means that I can't actually use Leo to insert tracing statements (or for any other changes.) Happily, there is a way to import "live" code into Leo safely:

<ul>
   Create a git repository for the code before importing it
</ul>

The Aha is to create the repository *wherever the code is*, including,
say, python/Lib/site-packages.

- git diff ensures that import hasn't significantly altered the code,

This is exactly what I need:  I can make changes to important tools *safely* within Leo.

### How should I use Leo with git, etc.?

Use @clean or @auto unless everyone in your work group uses Leo.  In that case, using @file is best.

## Importing files

### How can I import many files at once?

The Import Files dialog allows you to select multiple files.

There is also a method on the Commander class: `recursiveImport` 

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

## Running scripts and commands

### How can I make commonly-used scripts widely accessible?

Put @command nodes as children of an @commands node in myLeoSettings.leo. This makes the @command nodes available to all opened .leo files.

Using @command rather than @button means that there is never any need to disable scripts. There is no need for @button. To see the list of your @command nodes, type:

    `<alt-x>@c`

Similarly to see the list of your @button nodes, type:

    `<alt-x>@b`

### How can I organize large docstrings?

Start your file with:

```
'''
<< docstring >>
'''
```

The \<\< docstring >> section can just contain:

```
@lаnguage rest # or md
@wгap
@οthers
```

This allows the "interior" of the docstring to be colored using rST (or markdown).
The children of the \<\< docstring >> node form the actual docstring. No section names are required!

This pattern organizes large docstrings in a Leonine way. The only drawback is that the actual external file contains sentinel lines separating the parts of the docstring. In practice, it's no big deal, especially if each child starts with a blank line.

### How can I run code in an external process?

g.execute_shell_commands executes one or more commands in a separate process using child_process. Commands *not* preceded by '&' run to completion before the next command is run.

See the [Leo Scripting Guide](scripting-guide.md#running-code-in-separate-processes) for more details.

### How can I run scripts other languages?

The execute-general-script command invokes an external language processor on an **script file** as follows:

- If c.p is any kind of @\<file> node, the script file is the corresponding external file.
  Otherwise, the script file is a temp file.

- The `@data exec-script-commands` setting tells how to invoke the appropriate language processor.
  See the setting for more details.

- The `@data exec-script-patterns` settings describes error messages so that Leo can create
  clickable links to errors.  See the setting for more details.

- This command is a thin wrapper around the c.general_script_helper method.
  Scripts can call this method directly if desired.

### How can scripts call functions from Leo's core?

Leo executes scripts with c and g predefined.

g is the leo.core.leoGlobal. Use g to access any function or class in leo/core/leoGlobals.py:

<ul>
    **g.app**                   A LeoApp instance.\
    **g.app.gui**               A LeoGui instance.\
    **g.app.pluginsController** A LeoPluginsController instance.\
    **g.app.\***                 Leo's global variables.
</ul>

c is the Commander object for the present outline. Commander objects define **subcommanders** corresponding to files in leo/core and leo/commands:

<ul>
    In leo/core...\
    **c.atFileCommands**\
    **c.chapterController**\
    **c.fileCommands**\
    **c.findCommands**\
    **c.importCommands**\
    **c.keyHandler = c.k**\
    **c.persistenceController**\
    **c.printingController**\
    **c.rstCommands**\
    **c.shadowController**\
    **c.tangleCommands**

    In leo/commands...\
    **c.abbrevCommands**\
    **c.controlCommands**\
    **c.convertCommands**\
    **c.debugCommands**\
    **c.editCommands**\
    **c.editFileCommands**\
    **c.gotoCommands**\
    **c.helpCommands**\
    **c.keyHandlerCommands**\
    **c.killBufferCommands**\
    **c.rectangleCommands**\
    **c.spellCommands**
</ul>

Scripts can gain access to all of the code in these files via these subcommanders.

### How do I choose between @others and section references?

Use @others unless the contents of a node must appear in a certain spot, or in a certain order. For examples, most of Leo's source files start like this:

```
@firѕt # -*- coding: utf-8 -*-
<< imports >>
```

The \<\< imports >> section reference ensures that imports appear first. Another example:

```
@firѕt # -*- coding: utf-8 -*-
<< imports >>
<< base classes >>
@οthers
```

This ensures that base classes are defined before their subclasses.

## Unicode

### Some characters in external files look funny. What can I do?

Internally, Leo represents all strings as unicode. Leo translates from a particular encoding to Unicode_ when reading .leo files or external files. Leo translates from Unicode_ to a particular encoding when writing external files. You may see strange looking characters if your text editor is expecting a different encoding. The encoding used in any external file is shown in the #@+leo sentinel line like this:

```
 #@+leo-encoding=iso-8859-1.
```

**Exception**: the encoding is UTF-8 if no -encoding= field exists. You can also use the @encoding directive_ to set the encoding for individual external files. If no @encoding directive_ is in effect, Leo uses the following settings_ to translate to and from unicode:

- default_derived_file_encoding

The encoding used for external files if no @encoding directive_ is in effect.
This setting also controls the encoding of files that Leo writes.
The default is UTF-8 (case not important).

- new_leo_file_encoding

The encoding specified in the following line of new .leo files:

```
 <?xml version="1.0" encoding="UTF-8">
```

The default is UTF-8 (upper case for compatibility for old versions of Leo).

### I get weird results when defining unicode strings in scripts.  What is going on?

Add the following as the *very first line* of your scripts:

```
@firѕt # -*- coding: utf-8 -*-
```

Without this line, constructs such as:

```
u = u'a-(2 unicode characters here)-z'
u = 'a-(2 unicode characters here)-z'
```

will not work when executed with Leo's execute script command. Indeed, the Execute Script command creates the script by writing the tree containing the script to a string. This is done using Leo's write logic, and this logic converts the unicode input to a utf-8 encoded string. So *all non-ascii characters* get converted to their equivalent in the utf-8 encoding. Call these encoding \<e1> and \<e2>. In effect the script becomes:

```
u = u'a-<e1>-<e2>-z'
u = 'a-<e2>-<e>-z'
```

which is certainly *not* what the script writer intended! Rather than defining strings using actual characters, Instead, one should use the equivalent escape sequences. For example:

```
u = u'a-\\u0233-\\u8ce2-z'
u = 'a-\\u0233-\\u8ce2-z'
```

### Some characters are garbled when importing files. What can I do?

The encoding used in the file being imported doesn't match the encoding in effect for Leo. Use the @encoding [directive](../appendices/glossary.md#directive) in an ancestor of the [node](../appendices/glossary.md#node) selected when doing the [Import command](../users-guide/commands.md#importing--exporting-files) to specify the encoding of file to be imported.

## Work flow

### How can I organize data so I can find stuff later?

When organizing data into nodes, **every item should clearly belong to exactly one top-level category**. In other words, avoid top-level *aggregate* categories.

For example, the following are poor top-level categories. They are poor because any item in them could be placed in a more explicit category:

- Contrib
- Developing Leo
- Important
- Maybe
- Others
- Prototype
- Recent
- Won't do/Can't do

We all have had bad experiences with the dreaded "Others" category. The Aha! is that all aggregate categories are just as bad as "Others".

> 📌 **NOTE**\
> I have been talking only about top-level categories.  Within a single category aggregate categories may be useful.  However, when possible I prefer to mark items rather than create subcategories.

### How can I see two nodes at once?

In LeoJS, use **Detached Body Panes** to have other body panes than the selected node opened.

Detached Body Panes are independent of the selected node. They can be opened with the `Open Aside` command. This can also be done with the outline's context menu, opened by right-clicking on a node.

### How can I use Leo cooperatively without sentinels?

Most people will find using @clean trees to be most useful. 

Use @auto-rst, @auto-vimoutline or @auto-org for rST, vimoutline or Emacs org mode files respectively.

### How can I use the GTD workflow in Leo?

GTD [Getting Things Done](https://www.amazon.com/Getting-Things-Done-Stress-Free-Productivity/dp/0142000280) is, by far, the best productivity book I have ever read. Many aspects of Leo are idea for putting GTD into practice.

Here is a surprisingly useful workflow tip related to GTD.

Ideas often "intrude" when I am busy with something else. When that happens, I create a top-level node of the form:

```
** description of idea
```

Now I can continue what I was doing! This is such a simple idea, but it's really really important: it means I never have to put off getting my ideas into Leo. The "\*\*" draws my attention to the new to-do item. Later, when I am not fully immersed in the previous task, I can put the "\*\*" node somewhere else.

It's super important to deal with new ideas *instantly* but *without* greatly interrupting the task at hand. Creating "**" nodes does that. This new workflow has been a big improvement to my GTD practice.
