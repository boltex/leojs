---
sidebar_position: 4
---

# Writing Leo scripts

This chapter tells how to write **Leo scripts**, JavaScript (or TypeScript) code that can run from any Leo node.

Predefined symbols, **c**, **g**, and **p** give Leo scripts easy access to all the data in the outline. These symbols also allow Leo scripts to execute any code in Leo's own codebase.

In LeoJS, the _VSCode API_ is also available as **vscode**. Other common modules such as _crypto, os, path, process and child\_process_ are also available, along with the following libraries: _SQL, JSZip, pako, showdown, dayjs, md5, csvtojson, difflib, elementtree and ksuid_.

**Positions** and **vnodes** are the foundation of Leo scripting. leo/core/leoNodes.ts defines the corresponding Position and VNode classes. These classes provide access to all outline data and allow Leo scripts to create and change outlines.

> 🔍 **Further study**\
> The [scripting portion](../users-guide/cheatsheet.md#scripting) of [Leo's cheat sheet](../users-guide/cheatsheet.md) contains more information about scripting.\
> For UI interaction in LeoJS examples, see the [scripting samples repository](https://github.com/boltex/scripting-samples-leojs), along with the [LeoJS features video](https://www.youtube.com/watch?v=M_mKXSbVGdE) to see how to try them directly in your browser.

## Hello World

Here is the obligatory "Hello World!" script:

```javascript
g.es('Hello World!'); // g.es prints all its arguments to the log pane.
```

In more detail:

1. Create a node anywhere in the outline.
2. Put `g.es('hello, world!');` in the node's body text.
3. Select the node and type **Ctrl-B**.

**Important** If text is selected, execute-script executes only the selected text.

## Create outline nodes

**p.b** is the body text associated with position p. Similarly, **p.h** is p's headline.
p.b and p.h are python properties, so you can assign to p.b and p.h.

This script creates an outline node as the last top-level node:

```javascript
const p = c.lastTopLevel().insertAfter();
p.h = 'my new node';
c.redraw(p); // Selects the new node.
```

This script creates multiple nodes, with different headlines:

```javascript
const parent = c.lastTopLevel().insertAfter();
parent.h = 'New nodes';
const table = [
    ['First node', 'Body text for first node'],
    ['Node 2', 'Body text for node 2'],
    ['Last Node', 'Body text for last node\nLine 2'],
];
for (const [headline, body] of table) {
    let child = parent.insertAsLastChild();
    child.b = body.trimEnd() + '\n'; // Ensure exactly one trailing newline.
    child.h = headline;
}

c.selectPosition(parent); // Another way to select nodes.
c.redraw();
```

This script creates a node containing today's date in the body text:

```javascript
const p = c.lastTopLevel().insertAfter();
p.h = "Today's date";
p.b = new Date().toDateString();
c.redraw(p);
```

## Generate an output file from nodes

The script writes the body text of the presently selected node to ~/leo_output_file.txt and then reads and prints it to the log pane:

```javascript
const fn = g.os_path_finalize_join(g.app.homeDir, 'leo_output_file.txt');
const fileUri = g.makeVscodeUri(fn);
const fileContent = Buffer.from(c.p.b, 'utf-8');

await vscode.workspace.fs.writeFile(fileUri, fileContent);

const data = await vscode.workspace.fs.readFile(fileUri);

g.es(Buffer.from(data).toString('utf-8'))
```

## Predefined symbols: c, g, and p

The execute-script command predefines the symbols c, g, and p.

c is the **commander** of the outline containing the script. Commanders are instances of the Commands class, defined in leoCommands.py. Commanders provide access to all outline data *and* all of Leo's source code.

g is Leo's **leo.core.leoGlobals** containing many useful functions, including g.es.

p is the **position** of the presently selected node. Positions represent nodes at a particular location of an outline. Because of clones, the *same* node may appear at multiple positions in an outline. **c.p** is the outline's presently selected position.

## Positions and vnodes

A **position** represents an outline node at a *specific position* in the outline. Positions provide methods to insert, delete and move outline nodes. The [scripting portion](../users-guide/cheatsheet.md#scripting) of [Leo's cheat sheet](../users-guide/cheatsheet.md) lists the most important methods of the position class.

Because of clones, the *same* node may appear at *multiple positions* in the outline. A **vnode** represents the node's data, which is shared by all positions referring to that node.

For any position p, **p.b** is the node's body text, **p.h** is the node's headline and **p.u** is the node's [user attributes](../users-guide/customizing.md#adding-extensible-attributes-to-nodes-and-leo-files), and **p.v** is the position's vnode. Similarly, for any vnode v, **v.b** is the node's body text, **v.h** is the node's headline and **v.u** is the node's user attributes.

## Generators

Commanders and positions define several [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators#generator_functions) to traverse (step through) an outline. The [scripting portion](../users-guide/cheatsheet.md#scripting) of [Leo's cheat sheet](../users-guide/cheatsheet.md) lists all of Leo's generators. For example, c.all_positions() traverses the outline in outline order.  The following prints a properly-indented list of all headlines:

```javascript
for (const p of c.all_positions()){
    g.es(' '.repeat(p.level()) + p.h);
}
```

Scripts may capture positions like this:

```javascript
const aList = [...c.all_positions()];
```
**Warning**: stored positions become invalid when outline changes. **c.positionExists(p)** is True if p is valid in c's outline.

All generators now yield *copies* of positions.

## Summary

- execute-script predefines c, g, and p.
- c is a commander, g is the leoGlobals module, and p is the current position.
- Vnodes contain all outline data.
- Positions provide easy access to vnodes.
- Positions become invalid when outline nodes are inserted, deleted, or moved.
- Generators visit all or parts of the outline, in a specified order.

> 🔍 **Further study**\
> Consult [Leo's cheat sheet](../users-guide/cheatsheet.md) and [Leo's scripting guide](../advanced-topics/leo-scripting-guide.md).
