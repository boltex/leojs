# Change Log

## 1.0.14

- Read only unchanged @clean nodes: a huge performance boost!
- Support @leo <path>; nodes. See https://leo-editor.github.io/leo-editor/directives.html#leo-directives
- Added open-at-leo-file command to open the given outline and the c.makeLinkLeoFiles method that helps scripts create a top-level outline containing links to sub-outlines.
- Added the **export-html-outline-viewer** command which exports the outline as a READ-ONLY self-contained HTML page, complete with outline browsing functionality including searching, hoisting, marking nodes and more.

## 1.0.13

- Fixed availability of "Refresh from Disk" for untitled Leo documents.
- Fixed default base directory for external files of untitled Leo documents.
- Fixed 'import txt file' usage of relative directories.
- Fixed node insertion logic (after node instead of as last child) for the CWEB importer.

## 1.0.12

- Fixed scrolling to reveal cursor on selected line for gotoGlobalLine related commands.

## 1.0.11

- Import commands now create outline nodes using a relative path (when the imported file is located at or below the Leo file’s directory).
- New command (VSCode files editor context menu): **Go to Line In LeoJS Outline**. (will offer to import if not present)
- New command (Editor and Explorer context menu) for files to be imported: **Import into LeoJS Outline**.
- g.es now opens the log pane when user scripts or @button nodes are run.
- Running scripts now ignores the write-script-file setting in LeoJS.

## 1.0.10

- Fixed @path to recognize '-' (Leo #4339)
- Deprecated c.scanAllDirectives and related helpers (Leo #4326)
- Fixed bugs involving file delimiters and syntax coloring (Leo #4323)
- Added more unit tests

## 1.0.9

- When using in vscode for the web, absolute paths now point to root of workspace. (for @<file> and @path directives)
- LeoJS now opens older and deprecated Leo file formats with the original Leo's behavior.
- Added support for rust code blocks when using find symbol definition.
- Added new rust importer.
- Improved handling of illegal characters in XML files.
- Fixed zap-to-character command.
- Small bug fixes that mirror the original Leo's development since Leo 6.8.3.
- New Feature: Script execution (@Command, doCommandByName, etc...) now returns actual values if script returned a value.
- Added open-url and open-url-under-cursor related commands. (The 'TopLevelCommands' of leoApp.py)
- Added mime.py plugin implementation.
- Added Double-click support for @url and @mime nodes along with support for the 'mime-open-cmd' setting.

## 1.0.8

- Fixed @rclick generation on @button nodes.

## 1.0.7

- Fixed URL for homepage and issues page.
- Fixed 'RST' export setting of the outline's 'dirty' flag.
- Documentation now has analytics.
- Made LeoJS specific commands (goAnywhere, openAside and showSettings) to the minibuffer by adding them to the base GUI, and to '/core/leoCommands.ts' as @cmd.

## 1.0.6

- Fixed goto-global-line command.
- Implemented c.recursiveImport. 
- implemented g.execute_shell_commands_with_options.
- Fixed IdleTime class handler call arguments.
- Added missing headkey1 and headkey2 plugin hooks.
- Added Leo's documentation updated for LeoJS with Docusaurus.
- Fixed debug and breakpoints by setting sourceMapRenames to false in launch.json.
- Added support for 'FreeMind' file format import.

## 1.0.5

- Fixed @auto files generation for markdown (.md) files.

## 1.0.4
 
- Prevent calling process.chdir when running on the web.

## 1.0.3

- Cleaned up vsix compilation

## 1.0.2

- Added leoMarkup.py to typescript to add its commands to LeoJS
- Added missing 'leoSettings' configurations for leoMarkup commands.
- Fixed g.chdir function.
- Added warning in rst3 command about generating intermediary files only for lack of 3rd party 'docutils' library.

## 1.0.1

- Added SQL, pako, showdown, JSZip, dayjs, md5, csvtojson
difflib, elementtree and ksuid libraries on the global scope when running Leo scripts (along with default nodejs libraries Buffer, crypto, os, path, process, and child_process) to simulate 'import/require' until suported in LeoJS.

# 1.0.0

- LeoJS can now open older formats of .leo files (from version 4.7 and before) which contained 'tnodelist' attributes.
- Fixed disabled/enabled state of 'Refresh from disk' and 'Extract Names' command-icons in menu above body-editor.
- Made command-icons above the outline pane customizable. They can also be set/unset in the LeoJS setting panel.
- The log pane is only forcefully shown at startup on first installation or on version updates.
- Made the .leojs JSON file format the default instead of the .leo XML format when saving new untitled files.
- Fixed elusive bug where sometimes a false leo file change detection was triggered when saving.

# 0.2.15

- Renamed 'save-file-as-zipped' to 'save-file-as-db'.
- Simplified the find panel's input field placeholder.
- Fixed find panel scrollbars as per VSCode issue #213045.
- Deprecated the 'Goto Panel' by adding tabs to the find panel to separate 'find' and 'nav/tag' search inputs.
- Fixed Ctrl+Shift+F to be quick-find with selected text instead of just focusing on the nav text input.
- Reworked the icons for the 'quick find' commands (dirty-nodes, marked-nodes, reverse-gnx-order, visited-nodes-history and quick-find with selected text) to be graphical symbols instead of latin letters.

# 0.2.14

- Fixed import file error when using the 'import any' or other importers.
- Improved 'detached' body panes behavior.
- Fixed the colorization of descendants for nodes with multiple 'language' directives.
- Added context menu to document pane nodes, offering the 'revert' command.
- Fixed the 'refresh-from-disk' command availability.
- Improved some keyboard shortcuts and the related README documentation section.
- Fixed 'reload-setting' command so that it calls the 'reloadSettings' method of subCommanders.
- Implemented the 'write-zip-archive' command.
- Implemented the new find-def command behavior, along with the 'prefer-nav-pane' config setting support.
- Implemented 'execute-general-script' and 'execute-external-file' commands.
- Added language coloring and syntax support for julia, batch and shell languages.
- Implemented most 'edit commands'. (Accessible as 'commands' in the minibuffer or in scripts, etc.)
- Implemented the 'toggle-unl-view' command (Switches the status bar UNL type)

# 0.2.13

- Added new videos to the readme: "Intro to Leo" and "LeoJS Features Demo".
- Fixed icons disabled appearance by changing the graphic format from SVG to a weoff2 font.
- Fixed undo/redo status flags
- Changed behavior of the 'Open Aside' command: it now  opens 'detached' body panes, which allows text editing for a fixed gnx.
- Added common library objects to the scripting global scope:
    - os
    - path
    - Buffer
    - crypto
    - process
    - child_process
- Added 'vscode' API to the scripting global scope. (while  keeping the g.vscode reference for compatibility with old scripts)
- Made more external libraries accessible to scripts via the global 'g' object:
    - dayjs
    - md5
    
# 0.2.12

- Help commands were changed from markdown preview panes to html webviews.
- (Breaking Change) Made vscode accessible via g.vscode instead of g.app.vscode.
- Made more external libraries accessible via the global 'g' object:
    - SQL
    - pako
    - showdown
    - JSZip
- Made more OS path related constants available in the global 'g' object:
    - extensionContext
    - extensionUri
    - workspaceUri
- Added 'show-recent-files' command.
- Fixed Find-Panel's behavior and styling.
- Fixed 'open-aside' command.
- Added hover menu to the UNL status bar item to choose from any UNL formats to be copied to the clipboard.
- Removed 'font-size & zoom' related config settings following VSCode's new ZOOM settings API.
- Added support for XML language colorization.
- Implemented Leo's new UNL relative path support.
- Fixed settings being saved properly in db for newly created files from a 'save-as' command.
- Changed .leojs file format to have no state bits in file anymore, and instead save them in db.
- Fixed at-buttons panel to refresh properly after a 'revert-to-saved' command.
- Fixed startup process to block all commands if no LeoID is found, except for the 'Set Leo ID' command.
- Fixed 'Goto' panel's navigation's stability issues after switching panels.

# 0.2.11

- Added typescript support for running scripts and using @command or @button nodes.
- Changed button pane interaction so that 'play' icons must be clicked. (instead of clicking anywhere on the entry)
- Leo panel now shows a 'Opening...' message when opening a Leo file if no file were already opened.
- Fixed extraneous delay when opening the 'goAnywhere' palette with CTRL+P when focus is on a LeoJS panel.
- Added support for the 'wrap' state of the body pane. (Along with @wrap and @nowrap directives)

# 0.2.10

- Fixed 'Orphan Nodes' when section references were newly created.
- Removed futile write to recent files just after opening last session.
- Allow sessions to be empty in sessions manager's save_snapshot method. (as opposed to the original Leo, which will exit the program when closing the last tab)
- Made the default of using JSON for clipbard be a default in leojsSettings.leojs setting "json-outline-clipboard" instead of being hard-coded.
- Many small fixes and code cleanup.

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

