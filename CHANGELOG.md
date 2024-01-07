# Change Log

# 0.2.10

- Fixed ...

## 0.2.9

- Fixed es_exception and scripting error reporting.
- Added support of the plugin system's 'g.registerHandler' for most of the original Leo event names.
- Fixed line ending of body text when transfered from vscode's text editor to make sure it's lf and not crlf. (Fixed 'Orphan Nodes' when section references are newly created)
- Fixed bug that sometimes asked to 'save' and overwrite/confirm when new node was created with body text containing an ampersand or when using vscode's quick-suggestion autocomplete.

## 0.2.8

- Translated most of helpCommands.py to typescript, enabling 'help' commands.
- Added UNL support for both output pane, body panes and all other editor windows.
- Fixed 'goto-script' for @button items context menu to also work on child of @buttons (plural) nodes in myLeoSettings.leo.
- Fixed @auto markdown .md importer and writer to now preserve full integrity in read-write round-trip cycle.
- Added support of undo/redo actions for UA related commands (Clear UAs and Set UA).
- Fixed 'show clone ancestors' and 'show clone parents' commands.
- The session (last opened files to reopen at startup) is saved per workspace by default. An options setting can be changed to use the original Leo global session.
- LeoJS now stays on the currently selected node when refreshing an external file. (if it is a descendent of the external file node itself)
- Added 'gnx-kind' setting support for generating uuid or ksuid strings instead of regular GNX strings.

## 0.2.7

- Fixed tooltips of the 'nav' input box in the find panel.
- Fixed 'Language coloring not supported yet for this language' message.
- Fixed 'object member adressing' d.get() bugs.
- Fixed 'ini' and 'java' importers.

## 0.2.6

- Fixed keyboard navigation of the outline while being hoisted.

## 0.2.5

- Fixed regex patterns in 'get_patterns' to support web browser's more unstable support.

## 0.2.4

- Fixed 'ConfirmBeforeClose' for mobile to prevent closing on keyboard commands.
- Fixed goto-next-clone and goto-next-marked refresh cycles.

## 0.2.3

- Reset Confirm-Before-Close setting upon starting up.
- Fixed section-reference read-write operation.
- Fixed output messages strings.
- Closing the last Leo document before closing vscode will remove it from the session.
- Fixed labeling of body pane tab.

## 0.2.2

- Fixed more importer and @auto related bugs.
- Added 'Recent Files' icons and buttons.

## 0.2.1

- Fixed importer and @auto related bugs.

## 0.2.0 

- First alpha release

