# Leo in 10 Minutes

An introduction to the interface and its most important features and terminology.

## User Interface

Leo stores all data in nodes. Nodes have headlines (shown in the outline pane) and body text. The body pane shows the body text of the presently selected node, the node whose headline is selected in the outline pane. Headlines have an icon box indicating a node’s status. For example, the icon box has a red border when the node has been changed.

A **Leo Outline** tree view is placed in the explorer view, and in a standalone sidebar.

The **body pane** is a text editor which changes to match the selected node of the Leo outline.

The **opened documents selector** ...

The **Log Window** [output channel](https://code.visualstudio.com/api/extension-capabilities/common-capabilities#output-channel) ...

## Detached body panes

**Detached Body Panes**, independent of the selected node, can be opened with the 'Open Aside' command.

## Find Panel

The Find tab shows the status of Leo’s Find/Replace commands. It can be shown and expanded with the **`Ctrl+F`** shortcut while the focus is in the Leo outline or body pane.

Enter your search pattern directly in the **\<find pattern here\>** field. Press **`Enter`** to find the first match starting from your current position.

Hitting **`F3`** repeatedly will find the subsequent matches. (**`F2`** for previous matches)

Using the Nav tab of the _find panel_, (**`Ctrl+Shift+F`** to accesss directly) you can type your search pattern in the **Nav** field instead to see all results appear below. This will show the headlines as you type.

Press **`Enter`** to freeze the results and show results also found in **body text of any node**. This will add a snowflake icon ❄️ to the **Nav** field.

If you check the **Tag** option, the **Nav** field is then used to find nodes by their tag 🏷 _ua_ (user attribute).

## Undo Panel

There are undo and redo icons above the Leo outline and above the undo pane itself. You can also right-click on an undo step to directly switch to that specific state.

> The undo functionality is a multi-tiered system that segregates structural outline changes from text changes within the body pane. 

The Undo Panel captures outline alterations as individual 'Undo Beads', independent from VS Code's native text undo states. When focus resides in the body pane, the Undo keybinding triggers VS Code's text-specific undo action. However, once the focus shifts, or a new node is selected, all concurrent text changes coalesce into a single 'Undo Bead' within the Undo Panel. 

These 'Undo Beads' can then be manipulated either through the Undo Panel or with the undo/redo commands. 

## Commands

The commands are accessible through a variety of interfaces — toolbar buttons, dedicated menus, and keybindings. Those commands are also discoverable via the VSCode Command Palette. (accessible through F1 or Ctrl+Shift+P)

...