# Change Log

## 0.1.0 Dec 9, 2020

- Initial state

## 0.1.1 Dec 31, 2021

- Outline, undos and commands

## 0.1.2 Jan 01 2022

- Support web extension compilation for vscode.dev

## 0.1.3 Mar 11 2023

- Implemented Find and Goto panels and commands

## 0.1.4 Apr 04 2023

- Implemented extract & extract-names commands
- Fixed clipboard handling of JSON clipbard content
- Added new headline numbering commands
- Fixed undo behavior and added multiple-headline-change helpers
- Fixed @chapter/hoisting related issues
- implemented c.registerCommand (instead of c.k.registerCommand)
- Fixed reading/writing JSON leojs file format
- Removed status bar indicator (until vscode API can provide focus status)

# 0.1.5 June 24 2023

- Implemented Leo's atFile, atShadow and external files features
- Implemented javascript scripting, along with c, g and p references.

# 0.1.6 December 5 2023

- Added new option setting "showBranchInOutlineTitle" to show the branch with the filename in the outline's title bar
- Implemented importers
- Instead of Leo's original SaveAsLeojs command, (accessible via alt+x) Using SaveAsLeojs from vscode's menu interaction resolves to 'Save as .leojs' instead of 'Save To .leojs'
- Editing a headline, when inserting or renaming a node, can now be interrupted by most other keyboard shortcuts and commands
- Implemented Global Settings, Sessions and recent files. (saved to db and other files in the .leo folder.)
- Fixed log pane

# 0.1.7

- First feature complete version
- Fixed external file generation bugs
- Fixed conflict with leointeg when both expansions showed the same gnx body
- Fixed creation of local .leo folder when running as web extension
- Fixed md5 checksum and external file change detection bugs
- Various small bug fixes and corrections

# 0.2.0 

- First alpha release

# 0.2.1

- Fixed importer and @auto related bugs.
