---
sidebar_position: 5
---

# Useful Tips

## The most important tips

### You don't have to remember command names

To execute a command, type `Alt-X`, followed by the first few characters of the command name.

For more details, see the [commands tutorial](leo-in-10-minutes.md#commands).

### Learn to use clones

Clones are "live" copies of the node itself and all its descendants.
See the [clones tutorial](using-as-pim.md#clones) for more details.

## Learning to use Leo

### Move clones to the last top-level node

Focus your attention on the task at hand by [cloning nodes](using-as-pim.md#clones), including
\@file nodes, then moving those clones so they are the last top-level nodes
in the outline. This organization allows you to work on nodes scattered
throughout an outline without altering the structure of @file nodes.

### Put personal settings myLeoSettings.leo

Put your [personal settings](../users-guide/customizing-leo.md#specifying-settings) in myLeoSettings.leo, not leoSettings.leo.

- The leo-settings command opens leoSettings.leo.
- The my-leo-settings command opens myLeoSettings.leo.
- Copy the desired settings nodes from leoSettings.leo to myLeoSettings.leo.

### Search for settings in leoSettings.leo
leojsSettings.leojs contains the defaults for all of LeoJS settings, with
documentation for each.

## Useful commands and actions

### The find-quick-selected command
The find-quick-selected (Ctrl-Shift-F) command finds all nodes containing the selected text.

### The parse-body command
The parse-body command parses p.b (the body text of the selected node) into separate nodes.

### The sort-siblings command
The sort-siblings (Alt-A) command sorts all the child nodes of their parent, or all top-level nodes.

### Use Alt-N (goto-next-clone) to find "primary" clones
Use Alt-N to cycle through the clones of the present cloned node.
This command is a fast way of finding the clone whose ancestor is an @\<file\> node.

### Use cffm to gather outline nodes
The cff command (aka clone-find-flattened-marked) clones all marked nodes
as children of a new node, created as the last top-level node. Use this
to gather nodes throughout an outline.

### Use Ctrl-P (Goto-Node) to navigate to any node
Unlike the original Leo, in LeoJS, `Ctrl-P` opens an input box with a list of all nodes where you can start to type the headline of the node you want to select, it will restrict the choices as you type.

## Scripting tips
.. _`launch Leo from a console window`: running.html#running-leo-from-a-console-window

### g.callers() returns a list of callers

g.callers() returns the last n callers (default 4) callers of a function or
method. The verbose option shows each caller on a separate line. For
example:

```js
    g.trace(g.callers());
```

### Use @button nodes

[@button nodes](leo-in-10-minutes.md#button-and-command-nodes) create commands. For example, `@button my-command` creates
the _my-command_ button and the _my-command_ command. Within `@button`
scripts, c.p is the presently selected outline node.
**@button nodes bring scripts to data**.

### Use cff to gather nodes matching a pattern
The **cff command** (aka clone-find-flattened) prompts for a search pattern,
then clones all matching nodes so they are the children of a new last
top-level node. This command is a great way to study code.

### Use g.trace to debug scripts
The g.trace function prints all its arguments to the console. g.trace shows
patterns in running code.

### Use section references sparingly
Use section references only when the exact position of a section within a file matters. 

Here is a common pattern for @file nodes for python files:

```js
    <<imports>>
```

### Use g.handleUnl to select nodes
Leo's status area shows the path from the root node to the selected node. We call such paths **UNLs** (Uniform Node Locators).  Given a UNL, g.handleUnl(unl, c) will select the referenced node.  For example:

```js
    g.handleUnl('unl:gnx://leojsDocs.leojs#felix.20240825232344.32', c);
```

will select this node in LeojsDocs.leojs.
