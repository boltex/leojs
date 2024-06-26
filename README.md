# ![LeoEditor](https://raw.githubusercontent.com/boltex/leojs/master/resources/leoapp.png) Literate Editor with Outline

LeoJS is a javascript implementation of the Leo Editor.

_If you find LeoJS useful, please consider [**sponsoring**](https://boltex.github.io/) it. Also please [write a review](https://marketplace.visualstudio.com/items?itemName=boltex.leojs#review-details 'Write a review') or [star it on GitHub](https://github.com/boltex/leojs 'Star it on GitHub')_

## Literate Programming with _Directed Acyclic Graphs_ ([dag](https://en.wikipedia.org/wiki/Directed_acyclic_graph))

### Break down your code into a structured outline that generates or parses back your source files

> Leo is a fundamentally different way of using and organizing data, programs and scripts.  
> [📺 Introduction Video](https://www.youtube.com/watch?v=j0eo7SlnnSY)

See Leo, the Literate Editor with Outline, at [leo-editor.github.io/leo-editor](https://leo-editor.github.io/leo-editor/)
or on [github](https://github.com/leo-editor/leo-editor).

![Screenshot](https://raw.githubusercontent.com/boltex/leojs/master/resources/animated-screenshot.gif)

# Web-Based Development

LeoJS can be run as a web extension on [VSCode for the web](https://code.visualstudio.com/docs/remote/codespaces#_browserbased-editor). It can edit Leo documents directly inside online repositories such as on GitHub and Azure Repos.

To access this browser-based editor, you can go to your repo on github.com and press . (period key)

This **[📺 Demonstration Video](https://www.youtube.com/watch?v=M_mKXSbVGdE)** shows many use-cases about working in an online repository with LeoJS and VSCode for the web.

> The web extension version of LeoJS cannot open local files: Use the regular desktop LeoJS version to edit local Leo files and projects.

# Features

-   UI controls such as a **Leo Outline** in the explorer view, and as a standalone sidebar, **body pane**, **opened documents selector** along with a **Log Window** [output channel](https://code.visualstudio.com/api/extension-capabilities/common-capabilities#output-channel).
-   **Detached Body Panes**, independent of the selected node can be opened with the 'Open Aside' command.
-   Keybindings that match those of the Leo editor, including arrow keys behavior for outline keyboard navigation. (Can be turned off with the **'Leo Tree Browsing'** option setting)
-   **Derived files change detection**. See [External Files](#derive-external-files-) below for more details
-   **Scriptable in Javascript and Typescript**. All commands and scripts have easy access to outline structure via a simple Javascript API
-   **'@button' panel** for [creating your own commands with @buttons](https://leo-editor.github.io/leo-editor/tutorial-tips.html#use-button-nodes)
-   **Find panel** that reacts to Leo's typical keybindings, Ctrl+F, F2, F3... when focus is in the outline or body pane
-   **Nav and Tag panel** controls are integrated in the Find panel
-   **Goto Anywhere panel** to navigate directly from list of nodes, such as the results of Nav or Tag searches
-   **Undo History panel**, showing all actions and allowing going back, or forward, to any undo states.

# Demo videos

-   [📺 Introduction](https://www.youtube.com/watch?v=j0eo7SlnnSY)
-   [📺 Features](https://www.youtube.com/watch?v=M_mKXSbVGdE)

## Leo Commands

![Menus](https://raw.githubusercontent.com/boltex/leojs/master/resources/context-hover-menus.png)

LeoJS offers an extensive set of integrated commands, accessible through a variety of interfaces — toolbar buttons, dedicated menus, and intuitive keybindings. Those commands are also discoverable via the Visual Studio Code Command Palette. (accessible through F1 or Ctrl+Shift+P)

### Context-Aware Keybindings

The keybinding architecture is designed to be context-aware. When your focus is within the LeoJS Body or Outline pane, LeoJS-specific keybindings take precedence. Shift your focus outside these panes, and Visual Studio Code's native keybindings resume control.

### The Minibuffer

For those familiar with Leo, the 'minibuffer' serves as the nerve center for command execution. Access it through Alt+X and use the complete set of Leo's commands!

## Keybindings

Listed here are the most useful commands and their keyboard shortcuts.

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

_Move-Outline commands need the `Alt` key modifier only when focus is on body pane._

| Changing Focus                  |                                                   |
| :------------------------------ | :------------------------------------------------ |
| Toggle Outline/Body             | `Ctrl + T`                                        |
| Focus on Outline                | `Alt + T`                                         |
| Focus on Body (in any pane)     | `Alt + D` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Ctrl + G` |
| Focus on Body (in Outline pane) | `Tab` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Enter`        |

| Common Operations  |                    |
| :----------------- | :----------------- |
| Contract All       | `Alt + -`          |
| Sort Siblings      | `Alt + A`          |
| Start Search       | `Ctrl + F`         |
| Find Next          | `F3`               |
| Find Previous      | `F2`               |
| Replace            | `Ctrl + =`         |
| Replace then Find  | `Ctrl + -`         |
| Extract            | `Ctrl + Shift + D` |
| Extract Names      | `Ctrl + Shift + N` |
| Execute Script     | `Ctrl + B`         |
| Minibuffer Palette | `Alt + X`          |

| Tree Navigation          |                                                              |
| :----------------------- | :----------------------------------------------------------- |
| Show the LeoJS View      | `Ctrl+Shift+L`                                               |
| Go Anywhere              | `Ctrl+P`                                                     |
| Go To First Visible Node | `Home` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Alt + Home`             |
| Go To Last Visible Node  | `End` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Alt + End`               |
| Tree page up/down        | `PgUp / pgDn`                                                |
| Go To Next Clone         | `Alt + N`                                                    |
| Browse Tree              | `Arrow Keys` &nbsp;&nbsp;_or_&nbsp;&nbsp; `Alt + Arrow Keys` |
| Go To Global Line        | `Alt + G`                                                    |

_With the **'Leo Tree Browsing'** setting enabled by default, the arrows, home, end, pageUp/Down keys will change the outline's selection directly. Using tree navigation shortcuts from the body pane (with the `Alt` key modifier) will place focus in the outline._

| File Commands       |                    |
| :------------------ | :----------------- |
| Save Leo Document   | `Ctrl + S`         |
| New Leo Document    | `Ctrl + N`         |
| Open Leo Document   | `Ctrl + O`         |
| Cycle Next Document | `Ctrl + Tab`       |
| Write File Nodes    | `Ctrl + Shift + W` |
| Write Dirty Files   | `Ctrl + Shift + Q` |

---

## External Files

Use either of the **Save Leo Document**, **Write File Nodes** or **Write Dirty Files** commands to derive external files for any type of **@file** nodes.

| @\<file\> Kind | Sentinels | @others | .leo Data | Write Only |
| :------------- | :-------: | :-----: | :-------: | :--------: |
| @asis          |    ❌     |   ❌    |    ✔️     |     ✔️     |
| @auto          |    ❌     |   ✔️    |    ❌     |     ❌     |
| @clean         |    ❌     |   ✔️    |    ✔️     |     ❌     |
| @edit          |    ❌     |   ❌    |    ❌     |     ❌     |
| @file          |    ✔️     |   ✔️    |    ❌     |     ❌     |
| @nosent        |    ❌     |   ✔️    |    ✔️     |     ✔️     |

Leo will detect external file changes, and will ask to either **refresh from disk** or **ignore the changes**.

![Derive files](https://raw.githubusercontent.com/boltex/leojs/master/resources/derived-file.gif)

## Extension Settings

### Open the command palette `Ctrl+Shift+P` and start typing `LeoJS settings` to access LeoJS's welcome/settings screen

> _(Changes are auto-saved to the user's profile after 0.5 seconds)_

-   Control the visibility of the outline pane in the explorer view.
-   Decide how and when to refresh and synchronize content when derived (external) file are modified.
-   Show additional icons on outline nodes (Move, delete, mark, copy, paste...)
-   Choose to either focus on the body pane, or keep focus in the outline when a node is selected.
-   Hide or show the "Open on the side" command in the context menu to open a node beside the active editor

![Settings](https://raw.githubusercontent.com/boltex/leojs/master/resources/welcome-settings.png)

## Navigating a Leo Document

Arrow keys, home/end, page up/down are used for basic navigation. But in order to **find and goto specific nodes directly**, use the methods described below.

### Goto Anywhere Command

Normally in vscode, the the **`Ctrl+P`** shortcut allows you to switch to any project file, but when the focus is in one of Leo's panels, the **`Ctrl+P`** keybinding allows you to switch to a node directly by typing (part of) it's headline.

![Goto Anywhere](https://raw.githubusercontent.com/boltex/leojs/master/resources/goto-anywhere.gif)

### Find Commands

With focus in Leo's outline or body pane, Hit **`Ctrl+F`** to open the _find panel_.

Enter your search pattern directly in the **\<find pattern here\>** field. Press **`Enter`** to find the first match starting from your current position.

Hitting **`F3`** repeatedly will find the subsequent matches. (**`F2`** for previous matches)

![Find results](https://raw.githubusercontent.com/boltex/leojs/master/resources/find-in-headlines.gif)

### Nav and the Goto Panel

Type your search pattern in the **Nav** field instead to see all results show up below in leo's **Goto Pane**. This will show the headlines as you type.

Press **`Enter`** to freeze the results and show results also found in **body text of any node**. This will add a snowflake icon ❄️ to the **Nav** field.

From the **Goto Pane**, you can use the arrow keys, home/end, page up/down to cycle directly to any of those matches.

![Goto pane](https://raw.githubusercontent.com/boltex/leojs/master/resources/nav-goto-pane.gif)

### Using Tags

If you check the **Tag** option, the **Nav** field and **Goto Pane** are then used to find nodes by their tag 🏷 _ua_ (user attribute).

![Node tags](https://raw.githubusercontent.com/boltex/leojs/master/resources/nav-tags.gif)

## Undo Panel

> In LeoJS, the undo functionality is a multi-tiered system that segregates structural outline changes from text changes within the body pane. The Undo Panel captures outline alterations as individual 'Undo Beads', independent from VS Code's native text undo states. When focus resides in the body pane, the Undo keybinding triggers VS Code's text-specific undo action. However, once the focus shifts or a new node is selected, all concurrent text changes coalesce into a single 'Undo Bead' within the Undo Panel. These 'Undo Beads' can then be manipulated either through the Undo Panel or by keybindings, provided the focus is explicitly set on the outline pane. This dual-layer undo architecture enables precise control over both code and structural modifications.

Use the undo / redo icons above the outline or above the undo pane itself. You can also right-click on an undo step to directly switch to that specific state!

![Undo pane](https://raw.githubusercontent.com/boltex/leojs/master/resources/undo-pane.gif)

# Issues

Common issues are listed below. See the repository's [Issues Page](https://github.com/boltex/leojs/issues) to submit issues.

### Linux Keybindings

If you're experiencing trouble with the keyboard shortcuts for
the 'Clone Node' or the 'Promote' and 'Demote' commands,
set **"keyboard.dispatch": "keyCode"** in your vscode settings and restart vscode.
See [Troubleshoot Linux Keybindings](https://github.com/microsoft/vscode/wiki/Keybinding-Issues#troubleshoot-linux-keybindings)
for more information.

### Keybindings Conflicts Resolution

If you have a keybinding conflict for a command that you would like **not** to be resolved by Leo when the focus is on the body pane,
add **`&& resourceScheme != 'leojs'`** to the keybinding's "_when_" condition. (Use **`Ctrl+K Ctrl+S`** in vscode to open the Keyboards Shortcuts panel)

### Move Outline Keyboard Commands

For some users, the **`Alt+[Arrow Keys]`**, **`Ctrl+D`** and **`Ctrl+T`** keybinding are already assigned.

To help with this conflict, tree-browsing, outline-move keyboard commands, and switch focus command will only trigger
with the additional condition of having no text selection in the editor.

So select at least one character to use the previously assigned original keyboard commands, while focus is in the body pane.

> Refer to the [issue tracker](https://github.com/boltex/leojs/issues) page to learn more about the known issues, or to contribute with additional information if you encounter some yourself.

If you would like to modify and build this project yourself, see [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get started.

# Acknowledgments

### _Thanks to_

-   [Edward K. Ream](https://github.com/edreamleo) creator of the [Leo Editor](https://leo-editor.github.io/leo-editor/)
-   [Eric Amodio](https://github.com/eamodio) for the [welcome screen templates](https://github.com/eamodio/vscode-gitlens/tree/master/src/webviews)
-   [Vitalije Milošević](https://github.com/vitalije) for his contributions and support
-   [Arjan Mossel](https://github.com/ar-jan) for his suggestions and ideas
-   [Thomas Passin](https://github.com/tbpassin) for his contributions and support
-   [Viktor](https://github.com/ranvik14) for his contributions and support
-   [Gaurami](https://github.com/ATikhonov2) for his suggestions, bug reports and support
-   [Kevin Henderson](https://github.com/kghenderson) for his suggestions and support
-   [Ville M. Vainio](https://github.com/vivainio) for his Nav tab original concept
-   [Jacob M. Peck](https://github.com/gatesphere) for his Tags tab original concept
-   [Matt Wilkie](https://github.com/maphew) for his contributions and support

## 🤍 To sponsor, donate or contribute see my [user page 🦁](https://boltex.github.io/)
