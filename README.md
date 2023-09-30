# leojs

## ![LeoEditor](https://raw.githubusercontent.com/boltex/leojs/master/resources/leoapp.png) Literate Editor with Outline _in Typescript_ ![Typescript](https://raw.githubusercontent.com/boltex/leojs/master/resources/typescript.png)

### Literate Programming with _Directed Acyclic Graphs_ ([dag](https://en.wikipedia.org/wiki/Directed_acyclic_graph))

> LeoJS is a typescript VSCode extension implementation of the Leo Editor: A line-by-line translation of the original python source.

-   See Leo, the Literate Editor with Outline, at [leo-editor.github.io/leo-editor](https://leo-editor.github.io/leo-editor/)
    or on [github](https://github.com/leo-editor/leo-editor).
-   See VSCode at [code.visualstudio.com](https://code.visualstudio.com/).

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

| Outline Commands |                                                                  |
| :--------------- | :--------------------------------------------------------------- |
| Undo / Redo      | `Ctrl + Z` &nbsp;&nbsp;/&nbsp;&nbsp; `Ctrl + Shift + Z`          |
| Insert Node      | `Ctrl + I` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Shift + Insert`         |
| Insert Child     | `Ctrl + Insert`                                                  |
| Edit Headline    | `Ctrl + H`                                                       |
| Mark / Unmark    | `Ctrl + M`                                                       |
| Copy Node        | `Ctrl + Shift + C`                                               |
| Cut Node         | `Ctrl + Shift + X`                                               |
| Paste Node       | `Ctrl + Shift + V`                                               |
| Delete Node      | `Ctrl + Shift + Backspace` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Delete` |
| Clone Node       | `Ctrl + Backquote`                                               |
| Promote / Demote | `Ctrl + {` &nbsp;&nbsp;_and_&nbsp;&nbsp; `Ctrl + }`              |

| Moving Nodes       |                                                                 |
| :----------------- | :-------------------------------------------------------------- |
| Move Outline Up    | `Ctrl + U` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Shift [+ Alt] + Up`    |
| Move Outline Down  | `Ctrl + D` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Shift [+ Alt] + Down`  |
| Move Outline Left  | `Ctrl + L` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Shift [+ Alt] + Left`  |
| Move Outline Right | `Ctrl + R` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Shift [+ Alt] + Right` |

_Move-Outline commands need the 'Alt' key modifier only when focus is on body pane._

| Common Operations   |                                                                                                                           |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------ |
| Toggle Outline/Body | `Ctrl + T`                                                                                                                |
| Focus on Body       | `Tab` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Enter` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Alt + D` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Ctrl + G` |
| Focus on Outline    | `Alt + T`                                                                                                                 |
| Contract All        | `Alt + -`                                                                                                                 |
| Sort Siblings       | `Alt + A`                                                                                                                 |
| Start Search        | `Ctrl + F`                                                                                                                |
| Find Next           | `F3`                                                                                                                      |
| Find Previous       | `F2`                                                                                                                      |
| Replace             | `Ctrl + =`                                                                                                                |
| Replace then Find   | `Ctrl + -`                                                                                                                |
| Minibuffer Palette  | `Alt + X`                                                                                                                 |
| Extract             | `Ctrl + Shift + D`                                                                                                        |
| Extract Names       | `Ctrl + Shift + N`                                                                                                        |
| Execute Script      | `Ctrl + B`                                                                                                                |

| Tree Navigation          |                                                                 |
| :----------------------- | :-------------------------------------------------------------- |
| Show the LeoJS View      | `Ctrl+Shift+L`                                                  |
| Go Anywhere              | `Ctrl+P`                                                        |
| Go To First Visible Node | `Alt + Home` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Home` \*             |
| Go To Last Visible Node  | `Alt + End` `End` \*                                            |
| Tree page up/down        | `PgUp / pgDn`                                                   |
| Go To Next Clone         | `Alt + N`                                                       |
| Browse Tree              | `Alt + Arrow Keys` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Arrow Keys` \* |
| Go To Global Line        | `Alt + G`                                                       |

**\*** _With the **'Leo Tree Browsing'** setting enabled by default, all arrows and numeric keypad keys change the outline's selection directly_

| File Commands       |                    |
| :------------------ | :----------------- |
| Save Leo Document   | `Ctrl + S`         |
| New Leo Document    | `Ctrl + N`         |
| Open Leo Document   | `Ctrl + O`         |
| Cycle Next Document | `Ctrl + Tab`       |
| Write File Nodes    | `Ctrl + Shift + W` |
| Write Dirty Files   | `Ctrl + Shift + Q` |

**Enjoy!**
