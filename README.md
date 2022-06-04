# leojs

## ![LeoEditor](https://raw.githubusercontent.com/boltex/leojs/master/resources/leoapp.png) Literate Editor with Outline _in Typescript_ ![Typescript](https://raw.githubusercontent.com/boltex/leojs/master/resources/typescript.png)

### Literate Programming with _Directed Acyclic Graphs_ ([dag](https://en.wikipedia.org/wiki/Directed_acyclic_graph))

LeoJS is [LeoInteg](https://github.com/boltex/leointeg#-leo-editor-integration-with-visual-studio-code)'s younger sibling project : a vsCode extension, currently in early alpha.

Inspired by <https://github.com/leo-editor/leo-editor/issues/1025>.

See Leo, the Literate Editor with Outline, at [leoeditor.com](https://leoeditor.com/)
or on [github](https://github.com/leo-editor/leo-editor), and vscode at [code.visualstudio.com](https://code.visualstudio.com/).

![Screenshot](https://raw.githubusercontent.com/boltex/leojs/master/resources/animated-screenshot.gif)

## Development Version Installation

Make sure you have Node.js and Git installed, then clone the sources and run `npm install` in a terminal to install the remaining development dependencies.

![run extension](https://raw.githubusercontent.com/boltex/leojs/master/resources/run-extension.png)

You can then run the **Run Extension** target, as shown above, in the **Debug View**.

## Running Development version as a web extension

To try out running as a web extension on vscode.dev, use the following commands:

1. From your extension's path, start an HTTP server by running `npx serve --cors -l 5000`

2. Open another terminal and run `npx localtunnel -p 5000`

3. Click on the generated URL and select the _Click-to-Continue_ button

4. Finally, open vscode.dev pointing to a github repo, similar to: `https://vscode.dev/github/boltex/practice-leo-phys` and run **Developer: Install Web Extension...** from the Command Palette and paste the generated URL.

## Features done so far

- The commands and menus icons for outline editing 
- Undo and navigation history commands
- The minibuffer Command-Palette
- Panels for Outline, Undo history, Leo documents (no find, goto or @buttons panes yet)
- Basic 'New', 'Open' and 'Save' operations (no external @files/@clean... support yet)

## Keybindings

| Outline Commands           |     |                    |                  |
| :------------------------- | :-- | :----------------- | :--------------- |
| `Ctrl + Z`                 |     | `Ctrl + Shift + Z` | Undo / Redo      |
| `Ctrl + I`                 | or  | `Shift + Insert`   | Insert Node      |
| `Ctrl + Insert`            |     |                    | Insert Child     |
| `Ctrl + H`                 |     |                    | Edit Headline    |
| `Ctrl + M`                 |     |                    | Mark / Unmark    |
| `Ctrl + Shift + C`         |     |                    | Copy Node        |
| `Ctrl + Shift + X`         |     |                    | Cut Node         |
| `Ctrl + Shift + V`         |     |                    | Paste Node       | 
| `Ctrl + Shift + Backspace` | or  | `Delete`           | Delete Node      |
| `Ctrl + Backquote`         |     |                    | Clone Node       |
| `Ctrl + {`                 | and | `Ctrl + }`         | Promote / Demote |

| Moving Outline Nodes |     |                         |                    |
| :------------------- | :-- | :---------------------- | :----------------- |
| `Ctrl + U`           | or  | `Shift [+ Alt] + Up`    | Move Outline Up    |
| `Ctrl + D`           | or  | `Shift [+ Alt] + Down`  | Move Outline Down  |
| `Ctrl + L`           | or  | `Shift [+ Alt] + Left`  | Move Outline Left  |
| `Ctrl + R`           | or  | `Shift [+ Alt] + Right` | Move Outline Right |

_Move Outline commands need the 'Alt' key modifier only when focus is on body pane._

| Common Operations  |     |           |     |            |                     |
| :----------------- | :-- | :-------- | :-- | :--------- | :------------------ |
| `Ctrl + T`         |     |           |     |            | Toggle Outline/Body |
| `Tab` or `Enter`   | or  | `Alt + D` | or  | `Ctrl + G` | Focus on Body       |
| `Alt + T`          |     |           |     |            | Focus on Outline    |
| `Alt + -`          |     |           |     |            | Contract All        |
| `Ctrl + Shift + D` |     |           |     |            | Extract             |
| `Ctrl + Shift + N` |     |           |     |            | Extract Names       |
| `Alt + A`          |     |           |     |            | Sort Siblings       |
| `Alt + X`          |     |           |     |            | Minibuffer Palette  |
<!-- | `Ctrl + B`         |     |           |     |            | Execute Script      | -->
<!-- | `Ctrl + F`         |     |           |     |            | Start Search        | -->
<!-- | `F3`               |     |           |     |            | Find Next           | -->
<!-- | `F2`               |     |           |     |            | Find Previous       | -->

| Tree Navigation    |     |                 |                          |
| :----------------- | :-- | :-------------- | :----------------------- |
| `Alt + Home`       | or  | `Home` \*       | Go To First Visible Node |
| `Alt + End`        |     |                 | Go To Last Sibling       |
|                    |     | `End` \*        | Go To Last Visible Node  |
| `Alt + N`          |     |                 | Go To Next Clone         |
| `Alt + Arrow Keys` | or  | `Arrow Keys` \* | Browse Tree              |
<!-- | `Alt + G`          |     |                 | Go To Global Line        | -->

\* _With the **'Leo Tree Browsing'** setting enabled by default, all arrows and numeric keypad keys change the outline's selection directly_

| File Commands        |     |                         |                    |
| :------------------- | :-- | :---------------------- | :----------------- |
| `Ctrl + S`           |     |                         | Save Leo Document  |
| `Ctrl + N`           |     |                         | New Leo Document   |
| `Ctrl + O`           |     |                         | Open Leo Document  |
| `Ctrl + Shift + W`   |     |                         | Write File Nodes   |
| `Ctrl + Shift + Q`   |     |                         | Write Dirty Files  |

**Enjoy!**
