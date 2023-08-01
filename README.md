# leojs

## ![LeoEditor](https://raw.githubusercontent.com/boltex/leojs/master/resources/leoapp.png) Literate Editor with Outline _in Typescript_ ![Typescript](https://raw.githubusercontent.com/boltex/leojs/master/resources/typescript.png)

### Literate Programming with _Directed Acyclic Graphs_ ([dag](https://en.wikipedia.org/wiki/Directed_acyclic_graph))

>LeoJS is a typescript implementation of the Leo Editor, as a VSCode extension. A line-by-line translation of the original python source code.

- See Leo, the Literate Editor with Outline, at [leo-editor.github.io/leo-editor](https://leo-editor.github.io/leo-editor/)
or on [github](https://github.com/leo-editor/leo-editor).
- See VSCode at [code.visualstudio.com](https://code.visualstudio.com/).

![Screenshot](https://raw.githubusercontent.com/boltex/leojs/master/resources/animated-screenshot.gif)

# 🚧 This Extension is a WIP 🏗️

## Development Version Installation

Make sure you have Node.js and Git installed, then clone the sources and run `npm install` in a terminal to install the remaining development dependencies.

![run extension](https://raw.githubusercontent.com/boltex/leojs/master/resources/run-extension.png)

You can then run the **Run Extension** target, as shown above, in the **Debug View**.

## Web extension version
Will be available _'soon'_ when a first beta version is submitted to the Extension Market. (See [VSCode for the web](https://code.visualstudio.com/docs/editor/vscode-web#_opening-a-project) for usage example)

**In the meantime**, see 'Running Development version as a web extension' below to try out leojs in a browser.

## Running Development version as a web extension

> For exact information on this procedure, see [Test your web extension](https://code.visualstudio.com/api/extension-guides/web-extensions#test-your-web-extension-in-vscode.dev).

To try out running as a web extension on vscode.dev, use the following commands:

First, you'll need to [install mkcert](https://github.com/FiloSottile/mkcert#installation).

Then, generate the localhost.pem and localhost-key.pem files into a location you won't lose them (for example $HOME/certs):

```
$ mkdir -p $HOME/certs
$ cd $HOME/certs
$ mkcert -install
$ mkcert localhost
```

Then, from your extension's path, start an HTTP server by running 

```
$ npx serve --cors -l 5000 --ssl-cert $HOME/certs/localhost.pem --ssl-key $HOME/certs/localhost-key.pem
```

Finally, open vscode.dev pointing to a github repo, similar to: `https://vscode.dev/github/boltex/practice-leo-phys` and run **Developer: Install Web Extension...** from the Command Palette and paste `https://localhost:5000` 

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

| Common Operations  |     |          |     |           |    |            |                     |
| :----------------- | :-- | :------- | :-- | :-------- |:-- | :--------- | :------------------ |
| `Ctrl + T`         |     |          |     |           |    |            | Toggle Outline/Body |
| `Tab`              | or  | `Enter`  | or  | `Alt + D` |or  | `Ctrl + G` | Focus on Body       |
| `Alt + T`          |     |          |     |           |    |            | Focus on Outline    |
| `Alt + -`          |     |          |     |           |    |            | Contract All        |
| `Alt + A`          |     |          |     |           |    |            | Sort Siblings       |
| `Ctrl + F`         |     |          |     |           |    |            | Start Search        |
| `F3`               |     |          |     |           |    |            | Find Next           |
| `F2`               |     |          |     |           |    |            | Find Previous       |
| `Ctrl + =`         |     |          |     |           |    |            | Replace             |
| `Ctrl + -`         |     |          |     |           |    |            | Replace then Find   |
| `Alt + X`          |     |          |     |           |    |            | Minibuffer Palette  |
| `Ctrl + Shift + D` |     |          |     |           |    |            | Extract             |
| `Ctrl + Shift + N` |     |          |     |           |    |            | Extract Names       |
| `Ctrl + B`         |     |          |     |           |    |            | Execute Script      | 

| Tree Navigation    |           |                 |                          |
| :----------------- | :-------- | :-------------- | :----------------------- |
| `Ctrl+Shift+L`     |           |                 | Show the LeoJS View   |
| `Ctrl+P`           |           |                 | Go Anywhere              |
| `Alt + Home`       | or        | `Home` \*       | Go To First Visible Node |
|                    |           | `End` \*        | Go To Last Visible Node  |
| `PgUp / pgDn`      |           |                 | Tree page up/down        |
| `Alt + End`        |           |                 | Go To Last Sibling       |
| `Alt + N`          |           |                 | Go To Next Clone         |
| `Alt + Arrow Keys` | or        | `Arrow Keys` \* | Browse Tree              |

<!-- | `Alt + G`    |           |                   | Go To Global Line      | --> 

\* _With the **'Leo Tree Browsing'** setting enabled by default, all arrows and numeric keypad keys change the outline's selection directly_

| File Commands      |     |     |                   |
| :----------------- | :-- | :-- | :---------------- |
| `Ctrl + S`         |     |     | Save Leo Document |
| `Ctrl + N`         |     |     | New Leo Document  |
| `Ctrl + O`         |     |     | Open Leo Document |
| `Ctrl + Shift + W` |     |     | Write File Nodes  |
| `Ctrl + Shift + Q` |     |     | Write Dirty Files |

**Enjoy!**
