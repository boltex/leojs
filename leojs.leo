<?xml version="1.0" encoding="utf-8"?>
<!-- Created by Leo: http://leoeditor.com/leo_toc.html -->
<leo_file xmlns:leo="http://leoeditor.com/namespaces/leo-python-editor/1.1" >
<leo_header file_format="2"/>
<globals/>
<preferences/>
<find_panel_settings/>
<vnodes>
<v t="ekr.20201209145256.1"><vh>Startup</vh>
<v t="ekr.20201214084854.1"><vh>@file scripts.txt</vh></v>
</v>
<v t="felix.20201208214250.2"><vh>Documentation</vh>
<v t="felix.20201208214319.1"><vh>@clean README.md</vh></v>
<v t="felix.20201208214506.1"><vh>@clean CHANGELOG.md</vh></v>
<v t="felix.20201208224703.1"><vh>@clean CONTRIBUTING.md</vh></v>
</v>
<v t="ekr.20201209145358.1"><vh>Code</vh>
<v t="felix.20201215231023.1"><vh>@clean src/leoFiles.js</vh>
<v t="felix.20201215231023.2"><vh>&lt;&lt; xslTemplate &gt;&gt;</vh></v>
<v t="felix.20201215231023.3"><vh>function transform</vh>
<v t="felix.20201215231023.4"><vh>function serverTransform(resolve, reject)</vh></v>
<v t="felix.20201215231023.5"><vh>function clientTransform(resolve, reject)</vh></v>
</v>
<v t="felix.20201215231023.6"><vh>function loadDoc </vh>
<v t="felix.20201215231023.7"><vh>.then(function (response)</vh></v>
<v t="felix.20201215231023.8"><vh>.catch(function (error)</vh></v>
</v>
<v t="felix.20201215231023.9"><vh>function cleanText</vh></v>
<v t="felix.20201215231023.10"><vh>function isRelative</vh></v>
<v t="felix.20201215231023.11"><vh>function getLeoJSON</vh></v>
<v t="felix.20201215231023.12"><vh>function transformLeoXML2XML</vh></v>
<v t="felix.20201215231023.13"><vh>function transformLeoXML2JSON</vh></v>
<v t="felix.20201215231023.14"><vh>function transformLeoXML</vh></v>
</v>
<v t="felix.20201214151326.1"><vh>@clean src/constants.ts</vh>
<v t="felix.20201214151326.2"><vh>class Constants</vh>
<v t="felix.20201214151326.3"><vh>general constants</vh></v>
<v t="felix.20201214151326.4"><vh>workbench interface panels</vh></v>
<v t="felix.20201214151326.5"><vh>user messages</vh></v>
<v t="felix.20201214151326.6"><vh>at-buttons strings</vh></v>
<v t="felix.20201214151326.7"><vh>ask/save buttons</vh></v>
<v t="felix.20201214151326.8"><vh>context flags</vh></v>
<v t="felix.20201214151326.9"><vh>vscode commands</vh></v>
<v t="felix.20201214151326.10"><vh>commands strings</vh></v>
<v t="felix.20201214151326.11"><vh>leo commands</vh></v>
</v>
</v>
<v t="felix.20201208214322.1"><vh>@clean src/extension.ts</vh>
<v t="felix.20201214150149.1"><vh>activate</vh>
<v t="felix.20201214150149.2"><vh>&lt;&lt; Define entries for all commands &gt;&gt;</vh>
<v t="felix.20201221015535.1"><vh>Toggle UI Settings</vh></v>
<v t="felix.20201214150149.3"><vh>Scripting &amp; @buttons</vh></v>
<v t="felix.20201214150149.4"><vh>Leo File Documents</vh></v>
<v t="felix.20201214150149.5"><vh>Headline Editing</vh></v>
<v t="felix.20201214150149.6"><vh>Node Editing</vh></v>
<v t="felix.20201214150149.7"><vh>Tree View Interaction</vh></v>
<v t="felix.20201214150149.8"><vh>Goto Nodes</vh></v>
<v t="felix.20201214150149.9"><vh>Hoisting</vh></v>
<v t="felix.20201214150149.10"><vh>Outline Editing</vh></v>
<v t="felix.20201214150149.11"><vh>Mark/Unmark</vh></v>
<v t="felix.20201214150149.12"><vh>Body Editing</vh></v>
<v t="felix.20201214150149.13"><vh>Move Nodes</vh></v>
<v t="felix.20201214150149.14"><vh>Undo</vh></v>
<v t="felix.20201214150149.15"><vh>Show UI panes</vh></v>
<v t="felix.20201214150149.16"><vh>Marked Nodes Commands</vh></v>
<v t="felix.20201214150149.17"><vh>Clone Find Commands</vh></v>
</v>
</v>
<v t="felix.20201208215619.1"><vh>deactivate</vh></v>
</v>
<v t="felix.20201214194412.1"><vh>@clean src/leojs.ts</vh>
<v t="felix.20201215224237.1"><vh>class leojs</vh></v>
</v>
<v t="felix.20201214194144.1"><vh>@clean src/leoUI.ts</vh>
<v t="felix.20201214195752.1"><vh>class LeoUI</vh>
<v t="felix.20201214194144.2"><vh>Constructor</vh></v>
<v t="felix.20201214194144.3"><vh>Document States</vh>
<v t="felix.20201214202058.1"><vh>_triggerGetStates</vh></v>
<v t="felix.20201227230901.1"><vh>_setupNoOpenedLeoDocument</vh></v>
<v t="felix.20201227230912.1"><vh>_setupOpenedLeoDocument</vh></v>
</v>
<v t="felix.20201214194144.4"><vh>Refresh UI</vh>
<v t="felix.20201214202118.1"><vh>showOutline</vh></v>
<v t="felix.20201229025520.1"><vh>gotSelectedNode</vh></v>
<v t="felix.20201227155008.1"><vh>_setupRefresh</vh></v>
<v t="felix.20201227014627.1"><vh>_launchRefresh</vh></v>
<v t="felix.20201222013904.1"><vh>_refreshOutline</vh></v>
<v t="felix.20201214202123.1"><vh>_refreshDocumentsPane</vh></v>
<v t="felix.20201214202128.1"><vh>setDocumentSelection</vh></v>
</v>
<v t="felix.20201214194144.5"><vh>UI Change Events</vh>
<v t="felix.20201214202625.1"><vh>_onChangeCollapsedState</vh></v>
<v t="felix.20201214202627.1"><vh>_onTreeViewVisibilityChanged</vh></v>
<v t="felix.20201214202631.1"><vh>_onDocTreeViewVisibilityChanged</vh></v>
<v t="felix.20201214202634.1"><vh>_onButtonsTreeViewVisibilityChanged</vh></v>
</v>
<v t="felix.20201214194144.6"><vh>Commands</vh>
<v t="felix.20201214202749.1"><vh>selectTreeNode</vh></v>
<v t="felix.20201214202755.1"><vh>command</vh></v>
<v t="felix.20201214202757.1"><vh>minibuffer</vh></v>
<v t="felix.20201214202759.1"><vh>editHeadline</vh></v>
<v t="felix.20201214202800.1"><vh>insertNode</vh></v>
<v t="felix.20201214202802.1"><vh>changeMark</vh></v>
</v>
<v t="felix.20201214194144.7"><vh>At Buttons</vh>
<v t="felix.20201214211742.1"><vh>clickAtButton</vh></v>
<v t="felix.20201214211744.1"><vh>removeAtButton</vh></v>
</v>
<v t="felix.20201214194144.8"><vh>Leo Documents</vh>
<v t="felix.20201214211830.1"><vh>closeLeoFile</vh></v>
<v t="felix.20201214211831.1"><vh>newLeoFile</vh></v>
<v t="felix.20201214211832.1"><vh>openLeoFile</vh></v>
<v t="felix.20201214211834.1"><vh>showRecentLeoFiles</vh></v>
<v t="felix.20201214211835.1"><vh>saveAsLeoFile</vh></v>
<v t="felix.20201214211836.1"><vh>saveLeoFile</vh></v>
<v t="felix.20201214211837.1"><vh>switchLeoFile</vh></v>
<v t="felix.20201214211839.1"><vh>selectOpenedLeoDocument</vh></v>
</v>
<v t="felix.20201214194144.9"><vh>Body Pane</vh>
<v t="felix.20201214211645.1"><vh>showBody</vh></v>
<v t="felix.20201228164116.1"><vh>closeBody</vh></v>
</v>
<v t="felix.20201214194144.10"><vh>Log &amp; Terminal Panes</vh>
<v t="felix.20201214211655.1"><vh>showLogPane</vh></v>
</v>
<v t="felix.20201214194144.11"><vh>Other</vh>
<v t="felix.20201221234735.1"><vh>toggleSetting</vh></v>
<v t="felix.20201214211706.1"><vh>test</vh></v>
</v>
</v>
</v>
<v t="felix.20201208223553.1"><vh>@clean src/leoOutline.ts</vh>
<v t="felix.20201209011931.1"><vh>class JsOutlineProvider</vh>
<v t="felix.20201209011931.2"><vh>constructor</vh></v>
<v t="felix.20201209011931.3"><vh>refreshTreeRoot</vh></v>
<v t="felix.20201209011931.4"><vh>getTreeItem</vh></v>
<v t="felix.20201209011931.5"><vh>getChildren</vh></v>
<v t="felix.20201209011931.6"><vh>getParent</vh></v>
<v t="felix.20201209011931.8"><vh>_LeoNodeArray</vh></v>
</v>
</v>
<v t="felix.20201208223554.1"><vh>@clean src/leoNode.ts</vh>
<v t="felix.20201209004316.1"><vh>class LeoNode</vh>
<v t="felix.20201209004316.2"><vh>copyProperties</vh></v>
<v t="felix.20201209004316.3"><vh>setRoot</vh></v>
<v t="felix.20201209004316.4"><vh>_getNodeContextValue</vh></v>
<v t="felix.20201214154442.1"><vh>get_iconPath</vh></v>
<v t="felix.20201214154457.1"><vh>get_id</vh></v>
<v t="felix.20201214154511.1"><vh>get_description</vh></v>
<v t="felix.20201214154524.1"><vh>get_tooltip</vh></v>
</v>
</v>
<v t="felix.20201214151419.1"><vh>@clean src/leoButtons.ts</vh>
<v t="felix.20201214151419.2"><vh>class LeoButtonsProvider</vh>
<v t="felix.20201214151419.3"><vh>refreshTreeRoot</vh></v>
<v t="felix.20201214151419.4"><vh>getTreeItem</vh></v>
<v t="felix.20201214151419.5"><vh>getChildren</vh></v>
<v t="felix.20201214151419.6"><vh>getParent</vh></v>
</v>
</v>
<v t="felix.20201214151425.1"><vh>@clean src/leoButtonNode.ts</vh>
<v t="felix.20201214151425.2"><vh>class LeoButtonNode</vh>
<v t="felix.20201214151425.3"><vh>iconPath</vh></v>
<v t="felix.20201214151425.4"><vh>id</vh></v>
<v t="felix.20201214151425.5"><vh>tooltip</vh></v>
<v t="felix.20201214151425.6"><vh>description</vh></v>
</v>
</v>
<v t="felix.20201214151429.1"><vh>@clean src/leoDocuments.ts</vh>
<v t="felix.20201214151429.2"><vh>class LeoDocumentsProvider</vh>
<v t="felix.20201214151429.3"><vh>refreshTreeRoot</vh></v>
<v t="felix.20201214151429.4"><vh>getTreeItem</vh></v>
<v t="felix.20201214151429.5"><vh>getChildren</vh></v>
<v t="felix.20201214151429.6"><vh>getParent</vh></v>
</v>
</v>
<v t="felix.20201214151434.1"><vh>@clean src/leoDocumentNode.ts</vh>
<v t="felix.20201214151434.2"><vh>class LeoDocumentNode</vh>
<v t="felix.20201214151434.3"><vh>iconPath</vh></v>
<v t="felix.20201214151434.4"><vh>id</vh></v>
</v>
</v>
<v t="felix.20201208224441.1"><vh>@clean src/leoFileBrowser.ts</vh>
<v t="felix.20201208224441.2"><vh>class LeoFilesBrowser</vh>
<v t="felix.20201208224441.3"><vh>_getBestOpenFolderUri</vh></v>
<v t="felix.20201208224441.4"><vh>getLeoFileUrl</vh></v>
</v>
</v>
<v t="felix.20201214151447.1"><vh>@clean src/leoStates.ts</vh>
<v t="felix.20201214151447.2"><vh>class LeoStates</vh>
<v t="felix.20201214151447.3"><vh>General State Flags</vh>
<v t="felix.20201214233119.1"><vh>leoReady &amp; helper</vh></v>
<v t="felix.20201214151447.4"><vh>fileOpenedReady &amp; helper</vh></v>
<v t="felix.20201214151447.5"><vh>leoOpenedFileName</vh></v>
<v t="felix.20201214151447.6"><vh>leoChanged &amp; helper</vh></v>
<v t="felix.20201214151447.7"><vh>leoCanUndo &amp; helper</vh></v>
<v t="felix.20201214151447.8"><vh>leoCanRedo &amp; helper</vh></v>
<v t="felix.20201214151447.9"><vh>leoCanDemote &amp; helper</vh></v>
<v t="felix.20201214151447.10"><vh>leoCanPromote &amp; helper</vh></v>
<v t="felix.20201214151447.11"><vh>leoCanDehoist &amp; helper</vh></v>
</v>
<v t="felix.20201214151447.12"><vh>Selected Node Flags</vh>
<v t="felix.20201214151447.13"><vh>leoMarked</vh></v>
<v t="felix.20201214151447.14"><vh>leoCloned</vh></v>
<v t="felix.20201214151447.15"><vh>leoDirty</vh></v>
<v t="felix.20201214151447.16"><vh>leoEmpty</vh></v>
<v t="felix.20201214151447.17"><vh>leoChild</vh></v>
<v t="felix.20201214151447.18"><vh>leoAtFile</vh></v>
<v t="felix.20201214151447.19"><vh>leoRoot</vh></v>
</v>
<v t="felix.20201214151447.20"><vh>constructor</vh></v>
<v t="felix.20201214151447.21"><vh>selectedNodeFlags</vh></v>
<v t="felix.20201214151447.22"><vh>leoStateFlags</vh></v>
</v>
</v>
<v t="felix.20201214151451.1"><vh>@clean src/leoStatusBar.ts</vh>
<v t="felix.20201214151451.2"><vh>class LeoStatusBar</vh>
<v t="felix.20201214151451.3"><vh>show</vh></v>
<v t="felix.20201214151451.4"><vh>hide</vh></v>
<v t="felix.20201214151451.5"><vh>setString</vh></v>
<v t="felix.20201214151451.6"><vh>update</vh></v>
<v t="felix.20201214151451.7"><vh>_updateLeoObjectIndicatorDebounced</vh></v>
<v t="felix.20201214151451.8"><vh>_updateLeoObjectIndicator</vh></v>
</v>
</v>
<v t="felix.20201214154816.1"><vh>@clean src/types.d.ts</vh>
<v t="felix.20201214154816.2"><vh>PNode</vh></v>
<v t="felix.20201214154816.3"><vh>RevealType</vh></v>
<v t="felix.20201214154816.4"><vh>RefreshType</vh></v>
<v t="felix.20201214154816.5"><vh>UserCommand</vh></v>
<v t="felix.20201214154816.6"><vh>ShowBodyParam</vh></v>
<v t="felix.20201214154816.7"><vh>LeoPackageStates</vh></v>
<v t="felix.20201214154816.8"><vh>LeoDocument</vh></v>
<v t="felix.20201214154816.9"><vh>LeoButton</vh></v>
<v t="felix.20201214154816.10"><vh>Icon</vh></v>
<v t="felix.20201214154816.11"><vh>showSaveAsDialogParameters</vh></v>
<v t="felix.20201214154816.12"><vh>runAskYesNoDialogParameters</vh></v>
<v t="felix.20201214154816.13"><vh>runWarnMessageDialogParameters</vh></v>
<v t="felix.20201214154816.14"><vh>runInfoMessageDialogParameters</vh></v>
<v t="felix.20201214154816.15"><vh>AskMessageItem</vh></v>
<v t="felix.20201214154816.16"><vh>ChooseDocumentItem</vh></v>
<v t="felix.20201214154816.17"><vh>MinibufferCommand</vh></v>
</v>
<v t="felix.20201208224407.1"><vh>@clean src/utils.ts</vh>
<v t="felix.20201208224407.2"><vh>padNumber2</vh></v>
<v t="felix.20201208224407.4"><vh>addFileToGlobal</vh></v>
<v t="felix.20201208224407.5"><vh>removeFileFromGlobal</vh></v>
<v t="felix.20201208224407.6"><vh>buildNodeIconPaths</vh></v>
<v t="felix.20201208224407.7"><vh>buildDocumentIconPaths</vh></v>
<v t="felix.20201208224407.8"><vh>buildButtonsIconPaths</vh></v>
<v t="felix.20201208224407.10"><vh>getDurationMilliseconds</vh></v>
<v t="felix.20201208224407.11"><vh>getFileFromPath</vh></v>
<v t="felix.20201208224407.12"><vh>isIconChangedByEdit</vh></v>
<v t="felix.20201208224407.14"><vh>strToLeoUri</vh></v>
<v t="felix.20201208224407.15"><vh>leoUriToStr</vh></v>
<v t="felix.20201208224407.16"><vh>setContext</vh></v>
</v>
<v t="felix.20201214205159.1"><vh>@clean package.json</vh>
<v t="felix.20201214205159.2"><vh>&lt;&lt; contributes &gt;&gt;</vh>
<v t="felix.20201214205159.3"><vh>viewsContainers</vh></v>
<v t="felix.20201214205159.4"><vh>views</vh></v>
<v t="felix.20201214205159.5"><vh>viewsWelcome</vh></v>
<v t="felix.20201214205159.6"><vh>commands</vh>
<v t="felix.20201214205159.7"><vh>Test</vh></v>
<v t="felix.20201214205159.8"><vh>Scripting &amp; @buttons</vh></v>
<v t="felix.20201214205159.9"><vh>Show UI Panes</vh></v>
<v t="felix.20201214205159.10"><vh>Leo File Documents</vh></v>
<v t="felix.20201214205159.11"><vh>Tree View Interaction</vh></v>
<v t="felix.20201214205159.12"><vh>Headline Editing</vh></v>
<v t="felix.20201214205159.13"><vh>Mark/Unmark</vh></v>
<v t="felix.20201214205159.14"><vh>Node Editing</vh></v>
<v t="felix.20201214205159.15"><vh>Body Editing</vh></v>
<v t="felix.20201214205159.16"><vh>Move Nodes</vh></v>
<v t="felix.20201214205159.17"><vh>Outline Editing</vh></v>
<v t="felix.20201214205159.18"><vh>Goto Nodes</vh></v>
<v t="felix.20201214205159.19"><vh>Hoisting</vh></v>
<v t="felix.20201214205159.20"><vh>Undo</vh></v>
<v t="felix.20201214205159.21"><vh>Clone Find Commands</vh></v>
<v t="felix.20201214205159.22"><vh>Marked Nodes Commands</vh></v>
<v t="felix.20201218000931.1"><vh>show/hide UI elements</vh></v>
</v>
<v t="felix.20201214205159.23"><vh>menus</vh>
<v t="felix.20201214205159.24"><vh>commandPalette</vh>
<v t="felix.20201214205159.25"><vh>Scripting &amp; @buttons</vh></v>
<v t="felix.20201214205159.26"><vh>Show UI Panes</vh></v>
<v t="felix.20201214205159.27"><vh>Leo File Documents</vh></v>
<v t="felix.20201214205159.28"><vh>Tree View</vh></v>
<v t="felix.20201214205159.29"><vh>Headline Editing</vh></v>
<v t="felix.20201214205159.30"><vh>Mark/Unmark</vh></v>
<v t="felix.20201214205159.31"><vh>Node Editing</vh></v>
<v t="felix.20201214205159.32"><vh>Body Editing</vh></v>
<v t="felix.20201214205159.33"><vh>Move Nodes</vh></v>
<v t="felix.20201214205159.34"><vh>Outline Editing</vh></v>
<v t="felix.20201214205159.35"><vh>Goto Nodes</vh></v>
<v t="felix.20201214205159.36"><vh>Hoisting</vh></v>
<v t="felix.20201214205159.37"><vh>Undo</vh></v>
<v t="felix.20201214205159.38"><vh>Clone Find Commands</vh></v>
<v t="felix.20201214205159.39"><vh>Marked Nodes Commands</vh></v>
<v t="felix.20201214205159.40"><vh>Hidden from Palette</vh>
<v t="felix.20201214205159.41"><vh>Test</vh></v>
<v t="felix.20201214205159.42"><vh>Scripting &amp; @Buttons</vh></v>
<v t="felix.20201214205159.43"><vh>Show UI Panes</vh></v>
<v t="felix.20201214205159.44"><vh>Leo File Documents</vh></v>
<v t="felix.20201214205159.45"><vh>Tree View Interaction</vh></v>
<v t="felix.20201214205159.46"><vh>Headline Editing</vh></v>
<v t="felix.20201214205159.47"><vh>Mark/Unmark</vh></v>
<v t="felix.20201214205159.48"><vh>Node Editing</vh></v>
<v t="felix.20201214205159.49"><vh>Move Nodes</vh></v>
<v t="felix.20201214205159.50"><vh>Outline Editing</vh></v>
<v t="felix.20201214205159.51"><vh>Goto Nodes</vh></v>
<v t="felix.20201214205159.52"><vh>Hoisting</vh></v>
<v t="felix.20201214205159.53"><vh>Undo</vh></v>
</v>
</v>
<v t="felix.20201214205159.54"><vh>explorer/context</vh></v>
<v t="felix.20201214205159.55"><vh>view/title</vh></v>
<v t="felix.20201214205159.56"><vh>view/item/context</vh>
<v t="felix.20201214205159.57"><vh>Headline Editing Hover Icon</vh></v>
<v t="felix.20201214205159.58"><vh>Insert Node Hover Icon</vh></v>
<v t="felix.20201214205159.59"><vh>Move Nodes Hover Icon</vh></v>
<v t="felix.20201214205159.60"><vh>Outline Editing Hover Icon</vh></v>
<v t="felix.20201214205159.61"><vh>Mark/Unmark Hover Icon</vh></v>
<v t="felix.20201214205159.62"><vh>Tree View Interaction Context Menu</vh></v>
<v t="felix.20201214205159.63"><vh>Hoisting Context Menu</vh></v>
<v t="felix.20201214205159.64"><vh>Leo File Documents Context Menu</vh></v>
<v t="felix.20201214205159.65"><vh>Mark/Unmark Context Menu</vh></v>
<v t="felix.20201214205159.66"><vh>Outline Editing Context Menu</vh></v>
</v>
</v>
<v t="felix.20201214205159.67"><vh>keybindings</vh>
<v t="felix.20201214205159.68"><vh>Scripting &amp; @Buttons</vh></v>
<v t="felix.20201214205159.69"><vh>Show UI Panes</vh></v>
<v t="felix.20201214205159.70"><vh>Leo File Documents</vh></v>
<v t="felix.20201214205159.71"><vh>Tree View Interaction</vh></v>
<v t="felix.20201214205159.72"><vh>Headline Editing</vh></v>
<v t="felix.20201214205159.73"><vh>Mark/Unmark</vh></v>
<v t="felix.20201214205159.74"><vh>Body Editing</vh></v>
<v t="felix.20201214205159.75"><vh>Move Nodes</vh></v>
<v t="felix.20201214205159.76"><vh>Outline Editing</vh></v>
<v t="felix.20201214205159.77"><vh>Node Editing</vh></v>
<v t="felix.20201214205159.78"><vh>Goto Nodes</vh></v>
</v>
</v>
<v t="felix.20201214205159.79"><vh>&lt;&lt; scripts &gt;&gt;</vh></v>
<v t="felix.20201214205159.80"><vh>&lt;&lt; devDependencies &gt;&gt;</vh></v>
<v t="felix.20201214205159.81"><vh>&lt;&lt; dependencies &gt;&gt;</vh></v>
</v>
</v>
</vnodes>
<tnodes>
<t tx="ekr.20201209145256.1"></t>
<t tx="ekr.20201209145358.1"></t>
<t tx="felix.20201208214250.2"></t>
<t tx="felix.20201208214319.1"># leojs

Literate Editor with Outline _in Typescript_ version 0.1.00

**Enjoy!**
</t>
<t tx="felix.20201208214322.1">import * as vscode from 'vscode';
import * as utils from "./utils";
import { ReqRefresh } from "./types";
import { LeoUI } from './leoUI';
import { Constants } from './constants';
import { LeoButtonNode } from './leoButtonNode';
import { LeoNode } from './leoNode';

@language typescript
@tabwidth -4
@others

</t>
<t tx="felix.20201208214506.1"># Change Log

## 0.1.00 12.9.2020.

- Initial state
</t>
<t tx="felix.20201208215619.1">// this method is called when your extension is deactivated
export function deactivate() { }

</t>
<t tx="felix.20201208223553.1">import * as vscode from 'vscode';
import { LeoNode } from './leoNode';
import { ProviderResult } from "vscode";
import { Icon, PNode } from './types';
import { Leojs } from './leojs';
import { LeoUI } from './leoUI';

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201208223554.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import { Icon, PNode } from "./types"; // ArchivedPosition included to help debug

/**
 * * Implementation of tree nodes for usage in a TreeDataProvider
 */

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201208224407.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import { Icon } from "./types";
import { LeoNode } from "./leoNode";

// String and other types/structures helper functions, along with common vscode API calls

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201208224407.10">/**
 * * Returns the milliseconds between a given starting process.hrtime tuple and the current call to process.hrtime
 * @param p_start starting process.hrtime to subtract from current immediate time
 * @returns number of milliseconds passed since the given start hrtime
 */
export function getDurationMs(p_start: [number, number]): number {
    const [w_secs, w_nanosecs] = process.hrtime(p_start);
    return w_secs * 1000 + Math.floor(w_nanosecs / 1000000);
}

</t>
<t tx="felix.20201208224407.11">/**
 * * Extracts the file name from a full path, such as "foo.bar" from "/abc/def/foo.bar"
 * @param p_path Full path such as "/var/drop/foo/boo/moo.js" or "C:\Documents and Settings\img\recycled log.jpg"
 * @returns file name string such as "moo.js" or "recycled log.jpg""
 */
export function getFileFromPath(p_path: string): string {
    return p_path.replace(/^.*[\\\/]/, '');
}

</t>
<t tx="felix.20201208224407.12">/**
 * * Checks if a node would become dirty if it were to now have body content at all
 * @param p_node LeoNode from vscode's outline
 * @param p_newHasBody Flag to signify presence of body content, to be compared with its current state
 * @returns True if it would change the icon with actual body content, false otherwise
 */
export function isIconChangedByEdit(p_node: LeoNode, p_newHasBody: boolean): boolean {
    if (!p_node.dirty || (p_node.hasBody === !p_newHasBody)) {
        return true;
    }
    return false;
}

</t>
<t tx="felix.20201208224407.14">/**
* Builds a 'Leo Scheme' vscode.Uri from a gnx (or strings like 'LEO BODY' or empty strings to decorate breadcrumbs)
* @param p_str leo node gnx strings are used to build Uri
* @returns A vscode 'Uri' object
*/
export function strToLeoUri(p_str: string): vscode.Uri {
    return vscode.Uri.parse(Constants.URI_SCHEME_HEADER + p_str);
}

</t>
<t tx="felix.20201208224407.15">/**
 * * Gets the gnx, (or another string like 'LEO BODY' or other), from a vscode.Uri object
 * @param p_uri Source uri to extract from
 * @returns The string source that was used to build this Uri
 */
export function leoUriToStr(p_uri: vscode.Uri): string {
    // TODO : Use length of a constant or something other than 'fsPath'
    // For now, just remove the '/' (or backslash on Windows) before the path string
    return p_uri.fsPath.substr(1);
}

</t>
<t tx="felix.20201208224407.16">/**
 * * Sets a vscode context variable with 'vscode.commands.executeCommand' &amp; 'setContext'
 * @param p_key Key string name such as constants 'leoReady' or 'treeOpened', etc.
 * @param p_value Value to be assigned to the p_key 'key'
 * @returns A Thenable that is returned by the executeCommand call
 */
export function setContext(p_key: string, p_value: any): Thenable&lt;unknown&gt; {
    return vscode.commands.executeCommand(Constants.VSCODE_COMMANDS.SET_CONTEXT, p_key, p_value);
}

</t>
<t tx="felix.20201208224407.2">/**
 * * Build a string for representing a number that's 2 digits wide, padding with a zero if needed
 * @param p_number Between 0 and 99
 * @returns a 2 digit wide string representation of the number, left padded with zeros as needed.
 */
export function padNumber2(p_number: number): string {
    return ("0" + p_number).slice(-2);
}

</t>
<t tx="felix.20201208224407.4">/**
 * * Performs the actual addition into globalState context
 * @param p_context Needed to get to vscode global storage
 * @param p_file path+file name string
 * @param p_key A constant string such as RECENT_FILES_KEY or LAST_FILES_KEY
 * @returns A promise that resolves when the global storage modification is done
 */
export function addFileToGlobal(p_context: vscode.ExtensionContext, p_file: string, p_key: string): Thenable&lt;void&gt; {
    // Just push that string into the context.globalState.&lt;something&gt; array
    const w_contextEntry: string[] = p_context.globalState.get(p_key) || [];
    if (w_contextEntry) {
        if (!w_contextEntry.includes(p_file)) {
            w_contextEntry.push(p_file);
            if (w_contextEntry.length &gt; 10) {
                w_contextEntry.shift();
            }
        }
        return p_context.globalState.update(p_key, w_contextEntry); // Added file
    } else {
        // First so create key entry with an array of single file
        return p_context.globalState.update(p_key, [p_file]);
    }
}

</t>
<t tx="felix.20201208224407.5">/**
 * * Removes file entry from globalState context
 * @param p_context Needed to get to vscode global storage
 * @param p_file path+file name string
 * @param p_key A constant string such as RECENT_FILES_KEY or LAST_FILES_KEY
 * @returns A promise that resolves when the global storage modification is done
  */
export function removeFileFromGlobal(p_context: vscode.ExtensionContext, p_file: string, p_key: string): Thenable&lt;void&gt; {
    // Check if exist in context.globalState.&lt;something&gt; and remove if found
    const w_files: string[] = p_context.globalState.get(p_key) || [];
    if (w_files &amp;&amp; w_files.includes(p_file)) {
        w_files.splice(w_files.indexOf(p_file), 1); // Splice and update
        return p_context.globalState.update(p_key, w_files);
    }
    return Promise.resolve(); // not even in list so just resolve
}

</t>
<t tx="felix.20201208224407.6">/**
 * * Build all possible strings for node icons graphic file paths
 * @param p_context Needed to get to absolute paths on the system
 * @returns An array of the 16 vscode node icons used in this vscode expansion
 */
export function buildNodeIconPaths(p_context: vscode.ExtensionContext): Icon[] {
    return Array(16).fill("").map((p_val, p_index) =&gt; {
        return {
            light: p_context.asAbsolutePath(
                Constants.GUI.ICON_LIGHT_PATH +
                padNumber2(p_index) +
                Constants.GUI.ICON_FILE_EXT),
            dark: p_context.asAbsolutePath(
                Constants.GUI.ICON_DARK_PATH +
                padNumber2(p_index) +
                Constants.GUI.ICON_FILE_EXT)
        };
    });
}

</t>
<t tx="felix.20201208224407.7">/**
 * * Build all possible strings for documents icons graphic file paths
 * @param p_context Needed to get to absolute paths on the system
 * @returns An array containing icons for the documents tree view
 */
export function buildDocumentIconPaths(p_context: vscode.ExtensionContext): Icon[] {
    return [
        {
            light: p_context.asAbsolutePath(Constants.GUI.ICON_LIGHT_DOCUMENT),
            dark: p_context.asAbsolutePath(Constants.GUI.ICON_DARK_DOCUMENT)
        },
        {
            light: p_context.asAbsolutePath(Constants.GUI.ICON_LIGHT_DOCUMENT_DIRTY),
            dark: p_context.asAbsolutePath(Constants.GUI.ICON_DARK_DOCUMENT_DIRTY)
        }
    ];
}

</t>
<t tx="felix.20201208224407.8">/**
 * * Build all possible strings for buttons icons graphic file paths
 * @param p_context Needed to get to absolute paths on the system
 * @returns An array containing icons for the documents tree view
 */
export function buildButtonsIconPaths(p_context: vscode.ExtensionContext): Icon[] {
    return [
        {
            light: p_context.asAbsolutePath(Constants.GUI.ICON_LIGHT_BUTTON),
            dark: p_context.asAbsolutePath(Constants.GUI.ICON_DARK_BUTTON)
        },
        {
            light: p_context.asAbsolutePath(Constants.GUI.ICON_LIGHT_BUTTON_ADD),
            dark: p_context.asAbsolutePath(Constants.GUI.ICON_DARK_BUTTON_ADD)
        }
    ];
}

</t>
<t tx="felix.20201208224441.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import * as path from "path"; // TODO : Use this to have reliable support for window-vs-linux file-paths

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201208224441.2">/**
 * * Handles opening of file browser when choosing which Leo file to open
 */
export class LeoFilesBrowser {

    private _fileBrowserActive: boolean = false;

    constructor(private _context: vscode.ExtensionContext) { }

    @others
}
</t>
<t tx="felix.20201208224441.3">/**
 * * Finds a folder to propose when opening the browse-for-leo-file chooser
 * @returns An Uri for path to a folder for initial opening
 */
private _getBestOpenFolderUri(): vscode.Uri {
    let w_openedFileEnvUri: vscode.Uri | boolean = false;
    let w_activeUri: vscode.Uri | undefined = undefined;

    if (vscode.workspace.workspaceFolders &amp;&amp; vscode.workspace.workspaceFolders[0]) {
        w_activeUri = vscode.workspace.workspaceFolders[0].uri;
    }

    if (w_activeUri) {
        const w_defaultFolder = vscode.workspace.getWorkspaceFolder(w_activeUri);
        if (w_defaultFolder) {
            w_openedFileEnvUri = w_defaultFolder.uri; // Set as current opened document-path's folder
        }
    }
    if (!w_openedFileEnvUri) {
        w_openedFileEnvUri = vscode.Uri.file("~");
            // TODO : set as home folder properly, this doesn't work
            // ! EXAMPLE WITH os : const homedir = require('os').homedir();
    }
    return w_openedFileEnvUri;
}

</t>
<t tx="felix.20201208224441.4">/**
 * * Open a file browser and let the user choose a Leo file or cancel the operation
 * @param p_saveAsFlag Optional flag that will ask for a 'save' path+filename
 * @returns A promise resolving to a chosen path string, or rejected with an empty string if cancelled
 */
public getLeoFileUrl(p_saveAsFlag?: boolean): Promise&lt;string&gt; {
    if (this._fileBrowserActive) {
        return Promise.resolve("");
    }
    this._fileBrowserActive = true;
    return new Promise((p_resolve, p_reject) =&gt; {
        const w_filters: { [name: string]: string[] } = {};
        w_filters[Constants.FILE_OPEN_FILTER_MESSAGE] = [Constants.FILE_EXTENSION];

        if (p_saveAsFlag) {
            // Choose file
            vscode.window.showSaveDialog({
                saveLabel: "Save Leo File",
                defaultUri: this._getBestOpenFolderUri(),
                filters: { 'Leo File': ['leo'] }
            })
                .then(p_chosenLeoFile =&gt; {
                    this._fileBrowserActive = false;
                    if (p_chosenLeoFile) {
                        // single string
                        // Replace backslashes for windows support
                        p_resolve(p_chosenLeoFile.fsPath.replace(/\\/g, "/")); 
                    } else {
                        p_resolve(""); // not rejection - resolve empty string
                    }
                });
        } else {
            vscode.window
                .showOpenDialog({
                    canSelectMany: false,
                    defaultUri: this._getBestOpenFolderUri(),
                    filters: w_filters
                })
                .then(p_chosenLeoFile =&gt; {
                    this._fileBrowserActive = false;
                    if (p_chosenLeoFile) {
                        // array instead of single string
                         // Replace backslashes for windows support
                        p_resolve(p_chosenLeoFile[0].fsPath.replace(/\\/g, "/"));
                    } else {
                        p_resolve("");
                    }
                });
        }
    });
}

</t>
<t tx="felix.20201208224703.1">@language rest
@wrap

# How to install and run the development version

Thanks for trying out the development version of LeoInteg! :sunglasses: Contributions and pull requests are more than welcome!

## Introduction

If you're new to vscode and want to try out Leo with this vscode extension, you might want to look at this [Getting Started](https://code.visualstudio.com/docs#vscode-in-action) page to get an overview of vscode.

Furthermore, if you've never ran a vscode extension in an **Extension Development Host**, here is a [short overview about running and modifying a simple extension](https://code.visualstudio.com/api/get-started/your-first-extension).

If you're having problems, try [running this sample extension](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample#running-the-sample) first to catch underlying problems or missing dependencies.

</t>
<t tx="felix.20201209004316.1">export class LeoNode extends vscode.TreeItem {

    public contextValue: string; // * Context string is checked in package.json with 'when' clauses

    public isRoot: boolean = false; // * for hoist/dehoist context flags purposes

    constructor(
        public label: string, // Node headline
        public collapsibleState: vscode.TreeItemCollapsibleState, // Computed in receiver/creator
        public ap: PNode, // Pointer/reference for leo's node position
        public cloned: boolean,
        public dirty: boolean,
        public marked: boolean,
        public atFile: boolean,
        public hasBody: boolean,
        public u: any,
        private _icons: Icon[], // pointer to global array of node icons
        private _id: string
    ) {
        super(label, collapsibleState);
        this.contextValue = this._getNodeContextValue();
        this.command = {
            command: Constants.COMMANDS.SELECT_NODE,
            title: '',
            arguments: [this]
        };
    }

    // * TO HELP DEBUG
    // get description(): string {
    //     // * some smaller grayed-out text accompanying the main label
    //     const w_ap: ArchivedPosition = JSON.parse(this.ap);
    //     return "child:" + w_ap.childIndex + " lvl:" + w_ap.level + " gnx:" + w_ap.gnx;
    // }

    // get description(): string {
    //     // * some smaller grayed-out text accompanying the main label
    //     return "id:" + this.id;
    // }

    /**
     * * Sets this node properties (dirty, marked, etc.) by copying from a given node.
     * * This is needed by the outline provider when refreshing a single node.
     * @param p_node Node to copy properties from.
     * @returns Node itself with the new properties applied
     */
    @others
}
</t>
<t tx="felix.20201209004316.2">public copyProperties(p_node: LeoNode): LeoNode {
    this.label = p_node.label;

    this.collapsibleState = p_node.collapsibleState;
    this.ap = p_node.ap;
    this.cloned = p_node.cloned;
    this.dirty = p_node.dirty;
    this.marked = p_node.marked;
    this.atFile = p_node.atFile;
    this.hasBody = p_node.hasBody;
    this.isRoot = p_node.isRoot;
    this.contextValue = this._getNodeContextValue();
    return this;
}

</t>
<t tx="felix.20201209004316.3">/**
 * * Set this node as the root for hoist/dehoist context flags purposes
 */
public setRoot(): void {
    this.isRoot = true;
    this.contextValue = this._getNodeContextValue();
}

</t>
<t tx="felix.20201209004316.4">private _getNodeContextValue(): string {
    // Start it with 'leoNodeMarked' or 'leoNodeUnmarked'
    let w_contextValue = Constants.CONTEXT_FLAGS.NODE_UNMARKED;
    if (this.marked) {
        w_contextValue = Constants.CONTEXT_FLAGS.NODE_MARKED;
    }
    // then append 'leoNodeAtFile' to existing if needed
    if (this.atFile) {
        w_contextValue += Constants.CONTEXT_FLAGS.NODE_ATFILE;
    }
    // then append 'leoNodeCloned' to existing if needed
    if (this.cloned) {
        w_contextValue += Constants.CONTEXT_FLAGS.NODE_CLONED;
    }
    // and finally, check for 'root' too
    if (this.isRoot) {
        w_contextValue += Constants.CONTEXT_FLAGS.NODE_ROOT;
    } else {
        w_contextValue += Constants.CONTEXT_FLAGS.NODE_NOT_ROOT;
    }
    return w_contextValue;
}

</t>
<t tx="felix.20201209011931.1">export class LeoOutlineProvider implements vscode.TreeDataProvider&lt;PNode&gt; {
    private _onDidChangeTreeData: vscode.EventEmitter&lt;PNode | undefined&gt; = new vscode.EventEmitter&lt;PNode | undefined&gt;();

    readonly onDidChangeTreeData: vscode.Event&lt;PNode | undefined&gt; = this._onDidChangeTreeData.event;

    private _uniqueId: number = 0;

    @others
}
</t>
<t tx="felix.20201209011931.2">constructor(
    private _icons: Icon[],
    private _leoUI: LeoUI,
    private _leo: Leojs
) {
}


</t>
<t tx="felix.20201209011931.3">/**
 * * Refresh the whole outline
 */
public refreshTreeRoot(): void {
    this._onDidChangeTreeData.fire(undefined);
}

</t>
<t tx="felix.20201209011931.4">public getTreeItem(element: PNode): Thenable&lt;LeoNode&gt; | LeoNode {
    const w_leoNode = new LeoNode(element.header,
        element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        element, // ap
        !!element.cloned, // cloned
        !!element.dirty, // dirty
        !!element.marked, // marked
        !!element.atFile, // atFile
        !!element.body &amp;&amp; !!element.body.length,
        false, // 'u' - user defined data
        this._icons,
        "id" + this._uniqueId++
    );

    if (element.selected) {
        this._leoUI.gotSelectedNode(element);
    }

    // Build a LeoNode (a vscode tree node) from the PNode
    return w_leoNode;
}

</t>
<t tx="felix.20201209011931.5">public getChildren(element?: PNode): Thenable&lt;PNode[]&gt; {
    if (element) {
        return Promise.resolve(element.children);
    } else {
        return Promise.resolve(this._leo.positions);
    }
}

</t>
<t tx="felix.20201209011931.6">public getParent(element: PNode): ProviderResult&lt;PNode&gt; {
    // Buttons are just a list, as such, entries are always child of root so return null
    if (element) {
        return element.parent;
</t>
<t tx="felix.20201209011931.8">    }
    return undefined;
}

</t>
<t tx="felix.20201214150149.1">export function activate(p_context: vscode.ExtensionContext) {

    const w_leo: LeoUI = new LeoUI(p_context);

    // Shortcut pointers for readability
    const U = undefined;
    const CMD = Constants.COMMANDS;
    const LEOCMD = Constants.LEO_COMMANDS;
    const CTX = Constants.CONTEXT_FLAGS;

    const NO_REFRESH: ReqRefresh = {};
    const REFRESH_NODE_BODY: ReqRefresh = {
        node: true, // Reveal the returned 'selected position' without changes to the tree
        body: true, // Goto/select another node needs the body pane refreshed
        states: true
    };
    const REFRESH_TREE: ReqRefresh = {
        tree: true,
        states: true
    };
    const REFRESH_TREE_BODY: ReqRefresh = {
        tree: true,
        body: true,
        states: true
    };

    const w_commands: [string, (...args: any[]) =&gt; any][] = [

        // ! REMOVE TESTS ENTRIES FROM PACKAGE.JSON FOR MASTER BRANCH RELEASES !
        ["leointeg.test", () =&gt; w_leo.test()], // Test function useful when debugging

        &lt;&lt; Define entries for all commands &gt;&gt;
    ];

    w_commands.map(function (p_command) {
        p_context.subscriptions.push(vscode.commands.registerCommand(...p_command));
    });



}

</t>
<t tx="felix.20201214150149.10">[CMD.INSERT, (p_node: LeoNode) =&gt; w_leo.insertNode(p_node, true)],
[CMD.INSERT_SELECTION, () =&gt; w_leo.insertNode(U, false)],
[CMD.INSERT_SELECTION_FO, () =&gt; w_leo.insertNode(U, true)],
// Special command for when inserting rapidly more than one node without
// even specifying a headline label, e.g. spamming CTRL+I rapidly.
[CMD.INSERT_SELECTION_INTERRUPT, () =&gt; w_leo.insertNode(U, false, true)],

[CMD.CLONE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.CLONE_PNODE, p_node, REFRESH_TREE_BODY, true)],
[CMD.CLONE_SELECTION, () =&gt; w_leo.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, false)],
[CMD.CLONE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, true)],

[CMD.PROMOTE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.PROMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.PROMOTE_SELECTION, () =&gt; w_leo.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, false)],
[CMD.PROMOTE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, true)],

[CMD.DEMOTE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.DEMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.DEMOTE_SELECTION, () =&gt; w_leo.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, false)],
[CMD.DEMOTE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, true)],

[CMD.SORT_CHILDREN, () =&gt; w_leo.command(LEOCMD.SORT_CHILDREN, U, REFRESH_TREE, false, true)],
[CMD.SORT_SIBLING, () =&gt; w_leo.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, false, true)],
[CMD.SORT_SIBLING_FO, () =&gt; w_leo.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, true, true)],
</t>
<t tx="felix.20201214150149.11">[CMD.MARK, (p_node: LeoNode) =&gt; w_leo.changeMark(true, p_node, true)],
[CMD.MARK_SELECTION, () =&gt; w_leo.changeMark(true, U, false)],
[CMD.MARK_SELECTION_FO, () =&gt; w_leo.changeMark(true, U, true)],

[CMD.UNMARK, (p_node: LeoNode) =&gt; w_leo.changeMark(false, p_node, true)],
[CMD.UNMARK_SELECTION, () =&gt; w_leo.changeMark(false, U, false)],
[CMD.UNMARK_SELECTION_FO, () =&gt; w_leo.changeMark(false, U, true)],

[CMD.UNMARK_ALL, () =&gt; w_leo.command(LEOCMD.UNMARK_ALL, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.12">[CMD.EXTRACT, () =&gt; w_leo.command(LEOCMD.EXTRACT, U, REFRESH_TREE_BODY, false)],
[CMD.EXTRACT_NAMES, () =&gt; w_leo.command(LEOCMD.EXTRACT_NAMES, U, REFRESH_TREE_BODY, false)],
</t>
<t tx="felix.20201214150149.13">[CMD.MOVE_DOWN, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.MOVE_PNODE_DOWN, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_DOWN_SELECTION, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, false)],
[CMD.MOVE_DOWN_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, true)],

[CMD.MOVE_LEFT, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.MOVE_PNODE_LEFT, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_LEFT_SELECTION, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, false)],
[CMD.MOVE_LEFT_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, true)],

[CMD.MOVE_RIGHT, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.MOVE_PNODE_RIGHT, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_RIGHT_SELECTION, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, false)],
[CMD.MOVE_RIGHT_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, true)],

[CMD.MOVE_UP, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.MOVE_PNODE_UP, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_UP_SELECTION, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, false)],
[CMD.MOVE_UP_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, true)],
</t>
<t tx="felix.20201214150149.14">[CMD.REDO, () =&gt; w_leo.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, false)],
[CMD.REDO_FO, () =&gt; w_leo.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, true)],
[CMD.UNDO, () =&gt; w_leo.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, false)],
[CMD.UNDO_FO, () =&gt; w_leo.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.15">[CMD.SHOW_OUTLINE, () =&gt; w_leo.showOutline(true)], // Also focuses on outline
[CMD.SHOW_LOG, () =&gt; w_leo.showLogPane()],
[CMD.SHOW_BODY, () =&gt; w_leo.showBody(false)], // Also focuses on body
</t>
<t tx="felix.20201214150149.16">[CMD.COPY_MARKED, () =&gt; w_leo.command(LEOCMD.COPY_MARKED, U, REFRESH_TREE_BODY, true)],
[CMD.DIFF_MARKED_NODES, () =&gt; w_leo.command(LEOCMD.DIFF_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
[CMD.MARK_CHANGED_ITEMS, () =&gt; w_leo.command(LEOCMD.MARK_CHANGED_ITEMS, U, REFRESH_TREE_BODY, true)],
[CMD.MARK_SUBHEADS, () =&gt; w_leo.command(LEOCMD.MARK_SUBHEADS, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_MARKED_NODES, () =&gt; w_leo.command(LEOCMD.CLONE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
[CMD.DELETE_MARKED_NODES, () =&gt; w_leo.command(LEOCMD.DELETE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
[CMD.MOVE_MARKED_NODES, () =&gt; w_leo.command(LEOCMD.MOVE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.17">[CMD.CLONE_FIND_ALL, () =&gt; w_leo.command(LEOCMD.CLONE_FIND_ALL, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_FIND_ALL_FLATTENED, () =&gt; w_leo.command(LEOCMD.CLONE_FIND_ALL_FLATTENED, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_FIND_MARKED, () =&gt; w_leo.command(LEOCMD.CLONE_FIND_MARKED, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_FIND_FLATTENED_MARKED, () =&gt; w_leo.command(LEOCMD.CLONE_FIND_FLATTENED_MARKED, U, REFRESH_TREE_BODY, true)]
</t>
<t tx="felix.20201214150149.2">@others
</t>
<t tx="felix.20201214150149.3">[CMD.EXECUTE, () =&gt; w_leo.command(LEOCMD.EXECUTE_SCRIPT, U, REFRESH_TREE_BODY, false)],

[CMD.MINIBUFFER, () =&gt; w_leo.minibuffer()], // Is referenced in package.json

[CMD.CLICK_BUTTON, (p_node: LeoButtonNode) =&gt; w_leo.clickAtButton(p_node)], // Not referenced in package.json
[CMD.REMOVE_BUTTON, (p_node: LeoButtonNode) =&gt; w_leo.removeAtButton(p_node)],
</t>
<t tx="felix.20201214150149.4">[CMD.CLOSE_FILE, () =&gt; w_leo.closeLeoFile()],
[CMD.NEW_FILE, () =&gt; w_leo.newLeoFile()],

[CMD.OPEN_FILE, (p_uri?: vscode.Uri) =&gt; w_leo.openLeoFile(p_uri)],

[CMD.RECENT_FILES, () =&gt; w_leo.showRecentLeoFiles()],
[CMD.SAVE_AS_FILE, () =&gt; w_leo.saveAsLeoFile()],
[CMD.SAVE_FILE, () =&gt; w_leo.saveLeoFile()],
[CMD.SAVE_FILE_FO, () =&gt; w_leo.saveLeoFile(true)],
[CMD.SWITCH_FILE, () =&gt; w_leo.switchLeoFile()],

[CMD.SET_OPENED_FILE, (p_index: number) =&gt; w_leo.selectOpenedLeoDocument(p_index)],

[CMD.REFRESH_FROM_DISK, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.REFRESH_FROM_DISK, p_node, REFRESH_TREE_BODY, false)],

[CMD.REFRESH_FROM_DISK_SELECTION, () =&gt; w_leo.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, false)],

[CMD.REFRESH_FROM_DISK_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, true)],

[CMD.GIT_DIFF, () =&gt; w_leo.command(LEOCMD.GIT_DIFF, U, REFRESH_TREE_BODY, false)],
</t>
<t tx="felix.20201214150149.5">[CMD.HEADLINE, (p_node: LeoNode) =&gt; w_leo.editHeadline(p_node, true)],
[CMD.HEADLINE_SELECTION, () =&gt; w_leo.editHeadline(U, false)],
[CMD.HEADLINE_SELECTION_FO, () =&gt; w_leo.editHeadline(U, true)],
</t>
<t tx="felix.20201214150149.6">// cut/copy/paste/delete given node.
[CMD.COPY, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.COPY_PNODE, p_node, NO_REFRESH, true, true)],
[CMD.CUT, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.CUT_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.DELETE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.DELETE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.PASTE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.PASTE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],
[CMD.PASTE_CLONE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.PASTE_CLONE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],

// cut/copy/paste/delete current selection (self.commander.p)
[CMD.COPY_SELECTION, () =&gt; w_leo.command(LEOCMD.COPY_PNODE, U, NO_REFRESH, false)],
[CMD.CUT_SELECTION, () =&gt; w_leo.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.CUT_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, true)],
[CMD.DELETE_SELECTION, () =&gt; w_leo.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.DELETE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, true)],
[CMD.PASTE_CLONE_SELECTION, () =&gt; w_leo.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.PASTE_CLONE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, true)],
[CMD.PASTE_SELECTION, () =&gt; w_leo.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.PASTE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.7">// Called by nodes in the tree when selected either by mouse, or with enter
[CMD.SELECT_NODE, (p_node: LeoNode) =&gt; w_leo.selectTreeNode(p_node, false, false)],
[CMD.OPEN_ASIDE, (p_node: LeoNode) =&gt; w_leo.selectTreeNode(p_node, false, true)],

[CMD.CONTRACT_ALL, () =&gt; w_leo.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, false)],
[CMD.CONTRACT_ALL_FO, () =&gt; w_leo.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, true)],

[CMD.CONTRACT_OR_GO_LEFT, () =&gt; w_leo.command(LEOCMD.CONTRACT_OR_GO_LEFT, U, REFRESH_TREE_BODY, true)],
[CMD.EXPAND_AND_GO_RIGHT, () =&gt; w_leo.command(LEOCMD.EXPAND_AND_GO_RIGHT, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.8">[CMD.GOTO_NEXT_CLONE, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.GOTO_NEXT_CLONE, p_node, REFRESH_NODE_BODY, true)],
[CMD.GOTO_NEXT_CLONE_SELECTION, () =&gt; w_leo.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, false)],
[CMD.GOTO_NEXT_CLONE_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, true)],

[CMD.GOTO_NEXT_MARKED, () =&gt; w_leo.command(LEOCMD.GOTO_NEXT_MARKED, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_FIRST_VISIBLE, () =&gt; w_leo.command(LEOCMD.GOTO_FIRST_VISIBLE, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_LAST_SIBLING, () =&gt; w_leo.command(LEOCMD.GOTO_LAST_SIBLING, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_LAST_VISIBLE, () =&gt; w_leo.command(LEOCMD.GOTO_LAST_VISIBLE, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_NEXT_VISIBLE, () =&gt; w_leo.command(LEOCMD.GOTO_NEXT_VISIBLE, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_PREV_VISIBLE, () =&gt; w_leo.command(LEOCMD.GOTO_PREV_VISIBLE, U, REFRESH_NODE_BODY, true)],

[CMD.PAGE_UP, () =&gt; w_leo.command(LEOCMD.PAGE_UP, U, REFRESH_NODE_BODY, true)],
[CMD.PAGE_DOWN, () =&gt; w_leo.command(LEOCMD.PAGE_DOWN, U, REFRESH_NODE_BODY, true)],
</t>
<t tx="felix.20201214150149.9">[CMD.DEHOIST, () =&gt; w_leo.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, false)],
[CMD.DEHOIST_FO, () =&gt; w_leo.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, true)],
[CMD.HOIST, (p_node: LeoNode) =&gt; w_leo.command(LEOCMD.HOIST_PNODE, p_node, REFRESH_TREE_BODY, true)],
[CMD.HOIST_SELECTION, () =&gt; w_leo.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, false)],
[CMD.HOIST_SELECTION_FO, () =&gt; w_leo.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, true)],
</t>
<t tx="felix.20201214151326.1">import * as vscode from "vscode";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151326.10">/**
 * All commands this expansion exposes to the user via GUI/keybindings in package.json
 */
public static COMMANDS = {
    // Toggle UI Settings
    ENABLE_LEO_TREE_NAV: Constants.NAME + ".enableLeoTreeNav",
    SHOW_EDIT_ON_NODES: Constants.NAME + ".showEditOnNodes",
    SHOW_ADD_ON_NODES: Constants.NAME + ".showAddOnNodes",
    SHOW_ARROWS_ON_NODES: Constants.NAME + ".showArrowsOnNodes",
    SHOW_COPY_ON_NODES: Constants.NAME + ".showCopyOnNodes",
    SHOW_CLONE_ON_NODES: Constants.NAME + ".showCloneOnNodes",
    SHOW_MARK_ON_NODES: Constants.NAME + ".showMarkOnNodes",
    DISABLE_LEO_TREE_NAV: Constants.NAME + ".disableLeoTreeNav",
    HIDE_EDIT_ON_NODES: Constants.NAME + ".hideEditOnNodes",
    HIDE_ADD_ON_NODES: Constants.NAME + ".hideAddOnNodes",
    HIDE_ARROWS_ON_NODES: Constants.NAME + ".hideArrowsOnNodes",
    HIDE_COPY_ON_NODES: Constants.NAME + ".hideCopyOnNodes",
    HIDE_CLONE_ON_NODES: Constants.NAME + ".hideCloneOnNodes",
    HIDE_MARK_ON_NODES: Constants.NAME + ".hideMarkOnNodes",
    // Leo Documents
    SET_OPENED_FILE: Constants.NAME + ".setOpenedFile",
    OPEN_FILE: Constants.NAME + ".openLeoFile", // sets focus on BODY
    RECENT_FILES: Constants.NAME + ".recentLeoFiles", // shows recent Leo files, opens one on selection
    SWITCH_FILE: Constants.NAME + ".switchLeoFile",
    NEW_FILE: Constants.NAME + ".newLeoFile",
    SAVE_FILE: Constants.NAME + ".saveLeoFile",
    SAVE_FILE_FO: Constants.NAME + ".saveLeoFileFromOutline",
    SAVE_AS_FILE: Constants.NAME + ".saveAsLeoFile",
    CLOSE_FILE: Constants.NAME + ".closeLeoFile",
    MINIBUFFER: Constants.NAME + ".minibuffer",
    GIT_DIFF: Constants.NAME + ".gitDiff",
    // At-buttons
    CLICK_BUTTON: Constants.NAME + ".clickButton",
    REMOVE_BUTTON: Constants.NAME + ".removeButton",
    // Outline Node User Interaction
    SELECT_NODE: Constants.NAME + ".selectTreeNode",
    OPEN_ASIDE: Constants.NAME + ".openAside", // selects and opens body splitting the workspace
    // Goto operations that always finish with focus in outline
    PAGE_UP: Constants.NAME + ".pageUp",
    PAGE_DOWN: Constants.NAME + ".pageDown",
    GOTO_FIRST_VISIBLE: Constants.NAME + ".gotoFirstVisible",
    GOTO_LAST_VISIBLE: Constants.NAME + ".gotoLastVisible",
    GOTO_LAST_SIBLING: Constants.NAME + ".gotoLastSibling",
    GOTO_NEXT_VISIBLE: Constants.NAME + ".gotoNextVisible",
    GOTO_PREV_VISIBLE: Constants.NAME + ".gotoPrevVisible",
    GOTO_NEXT_MARKED: Constants.NAME + ".gotoNextMarked",
    GOTO_NEXT_CLONE: Constants.NAME + ".gotoNextClone",
    GOTO_NEXT_CLONE_SELECTION: Constants.NAME + ".gotoNextCloneSelection",
    GOTO_NEXT_CLONE_SELECTION_FO: Constants.NAME + ".gotoNextCloneSelectionFromOutline",
    CONTRACT_OR_GO_LEFT: Constants.NAME + ".contractOrGoLeft",
    EXPAND_AND_GO_RIGHT: Constants.NAME + ".expandAndGoRight",
    // Leo Operations
    UNDO: Constants.NAME + ".undo", // From command Palette
    UNDO_FO: Constants.NAME + ".undoFromOutline", // from button, return focus on OUTLINE
    REDO: Constants.NAME + ".redo", // From command Palette
    REDO_FO: Constants.NAME + ".redoFromOutline", // from button, return focus on OUTLINE
    EXECUTE: Constants.NAME + ".executeScript",
    SHOW_BODY: Constants.NAME + ".showBody",
    SHOW_OUTLINE: Constants.NAME + ".showOutline",
    SHOW_LOG: Constants.NAME + ".showLogPane",
    SORT_CHILDREN: Constants.NAME + ".sortChildrenSelection",
    SORT_CHILDREN_FO: Constants.NAME + ".sortChildrenSelectionFromOutline",
    SORT_SIBLING: Constants.NAME + ".sortSiblingsSelection",
    SORT_SIBLING_FO: Constants.NAME + ".sortSiblingsSelectionFromOutline",
    CONTRACT_ALL: Constants.NAME + ".contractAll", // From command Palette
    CONTRACT_ALL_FO: Constants.NAME + ".contractAllFromOutline", // from button, return focus on OUTLINE
    // Commands from tree panel buttons or context: focus on OUTLINE
    MARK: Constants.NAME + ".mark",
    UNMARK: Constants.NAME + ".unmark",
    COPY: Constants.NAME + ".copyNode",
    CUT: Constants.NAME + ".cutNode",
    PASTE: Constants.NAME + ".pasteNode",
    PASTE_CLONE: Constants.NAME + ".pasteNodeAsClone",
    DELETE: Constants.NAME + ".delete",
    HEADLINE: Constants.NAME + ".editHeadline",
    MOVE_DOWN: Constants.NAME + ".moveOutlineDown",
    MOVE_LEFT: Constants.NAME + ".moveOutlineLeft",
    MOVE_RIGHT: Constants.NAME + ".moveOutlineRight",
    MOVE_UP: Constants.NAME + ".moveOutlineUp",
    INSERT: Constants.NAME + ".insertNode",
    CLONE: Constants.NAME + ".cloneNode",
    PROMOTE: Constants.NAME + ".promote",
    DEMOTE: Constants.NAME + ".demote",
    REFRESH_FROM_DISK: Constants.NAME + ".refreshFromDisk",
    // Commands from keyboard, while focus on BODY (command-palette returns to BODY for now)
    MARK_SELECTION: Constants.NAME + ".markSelection",
    UNMARK_SELECTION: Constants.NAME + ".unmarkSelection",
    COPY_SELECTION: Constants.NAME + ".copyNodeSelection", // Nothing to refresh/focus so no "FO" version
    CUT_SELECTION: Constants.NAME + ".cutNodeSelection",
    PASTE_SELECTION: Constants.NAME + ".pasteNodeAtSelection",
    PASTE_CLONE_SELECTION: Constants.NAME + ".pasteNodeAsCloneAtSelection",
    DELETE_SELECTION: Constants.NAME + ".deleteSelection",
    HEADLINE_SELECTION: Constants.NAME + ".editSelectedHeadline",
    MOVE_DOWN_SELECTION: Constants.NAME + ".moveOutlineDownSelection",
    MOVE_LEFT_SELECTION: Constants.NAME + ".moveOutlineLeftSelection",
    MOVE_RIGHT_SELECTION: Constants.NAME + ".moveOutlineRightSelection",
    MOVE_UP_SELECTION: Constants.NAME + ".moveOutlineUpSelection",
    INSERT_SELECTION: Constants.NAME + ".insertNodeSelection", // Can be interrupted
    INSERT_SELECTION_INTERRUPT: Constants.NAME + ".insertNodeSelectionInterrupt", // Interrupted version
    CLONE_SELECTION: Constants.NAME + ".cloneNodeSelection",
    PROMOTE_SELECTION: Constants.NAME + ".promoteSelection",
    DEMOTE_SELECTION: Constants.NAME + ".demoteSelection",
    REFRESH_FROM_DISK_SELECTION: Constants.NAME + ".refreshFromDiskSelection",
    // Commands from keyboard, while focus on OUTLINE (no need for COPY_SELECTION)
    MARK_SELECTION_FO: Constants.NAME + ".markSelectionFromOutline",
    UNMARK_SELECTION_FO: Constants.NAME + ".unmarkSelectionFromOutline",
    CUT_SELECTION_FO: Constants.NAME + ".cutNodeSelectionFromOutline",
    PASTE_SELECTION_FO: Constants.NAME + ".pasteNodeAtSelectionFromOutline",
    PASTE_CLONE_SELECTION_FO: Constants.NAME + ".pasteNodeAsCloneAtSelectionFromOutline",
    DELETE_SELECTION_FO: Constants.NAME + ".deleteSelectionFromOutline",
    HEADLINE_SELECTION_FO: Constants.NAME + ".editSelectedHeadlineFromOutline",
    MOVE_DOWN_SELECTION_FO: Constants.NAME + ".moveOutlineDownSelectionFromOutline",
    MOVE_LEFT_SELECTION_FO: Constants.NAME + ".moveOutlineLeftSelectionFromOutline",
    MOVE_RIGHT_SELECTION_FO: Constants.NAME + ".moveOutlineRightSelectionFromOutline",
    MOVE_UP_SELECTION_FO: Constants.NAME + ".moveOutlineUpSelectionFromOutline",
    INSERT_SELECTION_FO: Constants.NAME + ".insertNodeSelectionFromOutline",
    CLONE_SELECTION_FO: Constants.NAME + ".cloneNodeSelectionFromOutline",
    PROMOTE_SELECTION_FO: Constants.NAME + ".promoteSelectionFromOutline",
    DEMOTE_SELECTION_FO: Constants.NAME + ".demoteSelectionFromOutline",
    REFRESH_FROM_DISK_SELECTION_FO: Constants.NAME + ".refreshFromDiskSelectionFromOutline",
    HOIST: Constants.NAME + ".hoistNode",
    HOIST_SELECTION: Constants.NAME + ".hoistSelection",
    HOIST_SELECTION_FO: Constants.NAME + ".hoistSelectionFromOutline",
    DEHOIST: Constants.NAME + ".deHoist",
    DEHOIST_FO: Constants.NAME + ".deHoistFromOutline",
    EXTRACT: Constants.NAME + ".extract",
    EXTRACT_NAMES: Constants.NAME + ".extractNames",
    COPY_MARKED: Constants.NAME + ".copyMarked",
    DIFF_MARKED_NODES: Constants.NAME + ".diffMarkedNodes",
    MARK_CHANGED_ITEMS: Constants.NAME + ".markChangedItems",
    MARK_SUBHEADS: Constants.NAME + ".markSubheads",
    UNMARK_ALL: Constants.NAME + ".unmarkAll",
    CLONE_MARKED_NODES: Constants.NAME + ".cloneMarkedNodes",
    DELETE_MARKED_NODES: Constants.NAME + ".deleteMarkedNodes",
    MOVE_MARKED_NODES: Constants.NAME + ".moveMarkedNodes",
    CLONE_FIND_ALL: Constants.NAME + ".cloneFindAll",
    CLONE_FIND_ALL_FLATTENED: Constants.NAME + ".cloneFindAllFlattened",
    CLONE_FIND_MARKED: Constants.NAME + ".cloneFindMarked",
    CLONE_FIND_FLATTENED_MARKED: Constants.NAME + ".cloneFindFlattenedMarked",
};

</t>
<t tx="felix.20201214151326.11">/**
 * Leo command names that are called from vscode's gui/menu/buttons/keybindings triggers
 */
public static LEO_COMMANDS = {
    EXECUTE_SCRIPT: "executeScript",
    REFRESH_FROM_DISK: "refreshFromDisk",
    GIT_DIFF: "gitDiff",
    // Goto operations
    PAGE_UP: "pageUp",
    PAGE_DOWN: "pageDown",
    GOTO_FIRST_VISIBLE: "goToFirstVisibleNode",
    GOTO_LAST_VISIBLE: "goToLastVisibleNode",
    GOTO_LAST_SIBLING: "goToLastSibling",
    GOTO_NEXT_VISIBLE: "selectVisNext",
    GOTO_PREV_VISIBLE: "selectVisBack",
    GOTO_NEXT_MARKED: "goToNextMarkedHeadline",
    GOTO_NEXT_CLONE: "goToNextClone",
    CONTRACT_OR_GO_LEFT: "contractNodeOrGoToParent",
    EXPAND_AND_GO_RIGHT: "expandNodeAndGoToFirstChild",
    CONTRACT_ALL: "contractAllHeadlines",
    // Leo Operations
    MARK_PNODE: "markPNode",
    UNMARK_PNODE: "unmarkPNode",
    COPY_PNODE: "copyOutline",
    CUT_PNODE: "cutPNode",
    PASTE_PNODE: "pasteOutline",
    PASTE_CLONE_PNODE: "pasteOutlineRetainingClones",
    DELETE_PNODE: "deletePNode",
    MOVE_PNODE_DOWN: "moveOutlineDown",
    MOVE_PNODE_LEFT: "moveOutlineLeft",
    MOVE_PNODE_RIGHT: "moveOutlineRight",
    MOVE_PNODE_UP: "moveOutlineUp",
    INSERT_PNODE: "insertPNode",
    INSERT_NAMED_PNODE: "insertNamedPNode",
    CLONE_PNODE: "clonePNode",
    PROMOTE_PNODE: "promote",
    DEMOTE_PNODE: "demote",
    REFRESH_FROM_DISK_PNODE: "refreshFromDisk",
    SORT_CHILDREN: "sortChildren",
    SORT_SIBLINGS: "sortSiblings",
    UNDO: "undo",
    REDO: "redo",
    GET_STATES: "getStates",
    HOIST_PNODE: "hoist",
    DEHOIST: "dehoist",
    EXTRACT: "extract",
    EXTRACT_NAMES: "extractNames",
    COPY_MARKED: "copyMarked",
    DIFF_MARKED_NODES: "deleteMarked",
    MARK_CHANGED_ITEMS: "markChangedHeadlines",
    MARK_SUBHEADS: "markSubheads",
    UNMARK_ALL: "unmarkAll",
    CLONE_MARKED_NODES: "cloneMarked",
    DELETE_MARKED_NODES: "deleteMarked",
    MOVE_MARKED_NODES: "moveMarked",
    // Clone-find functionality
    CLONE_FIND_ALL: "cloneFindAll",
    CLONE_FIND_ALL_FLATTENED: "cloneFindAllFlattened",
    CLONE_FIND_MARKED: "cloneFindMarked",
    CLONE_FIND_FLATTENED_MARKED: "cloneFindFlattenedMarked",
};

</t>
<t tx="felix.20201214151326.2">/**
 * Text and numeric constants used throughout leojs
 */
export class Constants {

    @others
}
</t>
<t tx="felix.20201214151326.3">public static NAME: string = "leojs";

public static TREEVIEW_ID: string = "leojs";
public static TREEVIEW_EXPLORER_ID: string = "leojsExplorer";

public static DOCUMENTS_ID: string = "leoDocuments";
public static DOCUMENTS_EXPLORER_ID: string = "leoDocumentsExplorer";

public static BUTTONS_ID: string = "leoButtons";
public static BUTTONS_EXPLORER_ID: string = "leoButtonsExplorer";

public static FILE_EXTENSION: string = "leo";
public static URI_LEO_SCHEME: string = "leo";
public static URI_FILE_SCHEME: string = "file";
public static URI_SCHEME_HEADER: string = "leo:/";
public static FILE_OPEN_FILTER_MESSAGE: string = "Leo Files";
public static UNTITLED_FILE_NAME: string = "untitled";
public static RECENT_FILES_KEY: string = "leoRecentFiles";
public static LAST_FILES_KEY: string = "leoLastFiles";

public static REFRESH_DEBOUNCE_DELAY: number = 50;
public static STATES_DEBOUNCE_DELAY: number = 100;
public static DOCUMENTS_DEBOUNCE_DELAY: number = 100;

</t>
<t tx="felix.20201214151326.4">/**
 * Strings used in the workbench interface panels (not for messages or dialogs)
 */
public static GUI = {
    ICON_LIGHT_DOCUMENT: "resources/light/document.svg",
    ICON_DARK_DOCUMENT: "resources/dark/document.svg",
    ICON_LIGHT_DOCUMENT_DIRTY: "resources/light/document-dirty.svg",
    ICON_DARK_DOCUMENT_DIRTY: "resources/dark/document-dirty.svg",
    ICON_LIGHT_BUTTON: "resources/light/button.svg",
    ICON_DARK_BUTTON: "resources/dark/button.svg",
    ICON_LIGHT_BUTTON_ADD: "resources/light/button-add.svg",
    ICON_DARK_BUTTON_ADD: "resources/dark/button-add.svg",
    ICON_LIGHT_PATH: "resources/light/box",
    ICON_DARK_PATH: "resources/dark/box",
    ICON_FILE_EXT: ".svg",
    STATUSBAR_INDICATOR: "$(keyboard) ",
    STATUSBAR_COLOR: "fb7c47",
    QUICK_OPEN_LEO_COMMANDS: "&gt;leo: ",
    EXPLORER_TREEVIEW_PREFIX: "LEO ",
    TREEVIEW_TITLE: "OUTLINE",
    BODY_TITLE: "LEO BODY",
    LOG_PANE_TITLE: "Leo Log Window",
    THEME_STATUSBAR: "statusBar.foreground"
};

</t>
<t tx="felix.20201214151326.5">/**
 * Basic user messages strings for messages and dialogs
 */
public static USER_MESSAGES = {
    SCRIPT_BUTTON: "Creates a button from selected node's script",
    SCRIPT_BUTTON_TOOLTIP:
        "The 'Script Button' button creates a new button.\n" +
        "Its name will be the headline of the presently selected node\n" +
        "Hitting this newly created button executes the button's script.\n" +
        "\n" +
        "For example, to run a script on any part of an outline:\n" +
        "\n" +
        "1.  Select the node containing a script. (Ex.: \"g.es(p.h)\")\n" +
        "2.  Press 'Script Button'. This will create a new button.\n" +
        "3.  Select a node on which you want to run the script.\n" +
        "4.  Press the *new* button.",
    SAVE_CHANGES: "Save changes to",
    BEFORE_CLOSING: "before closing?",
    CANCEL: "Cancel",
    OPEN_WITH_LEOJS: "Open this Leo file with leojs?",
    OPEN_RECENT_FILE: "Open Recent Leo File",
    RIGHT_CLICK_TO_OPEN: "Right-click Leo files to open with leojs",
    FILE_ALREADY_OPENED: "Leo file already opened",
    CHOOSE_OPENED_FILE: "Select an opened Leo File",
    FILE_NOT_OPENED: "No files opened.",
    PROMPT_EDIT_HEADLINE: "Edit Headline",
    PROMPT_INSERT_NODE: "Insert Node",
    DEFAULT_HEADLINE: "New Headline",
    CLOSE_ERROR: "Cannot close: No files opened.",
    YES: "Yes",
    NO: "No",
    YES_ALL: "Yes to all",
    NO_ALL: "No to all",
    MINIBUFFER_PROMPT: "Minibuffer Full Command",
    CHANGES_DETECTED: "Changes to external files were detected.",
    REFRESHED: " Nodes refreshed.", // with voluntary leading space
    IGNORED: " They were ignored.", // with voluntary leading space
    TOO_FAST: "Leo is busy! ", // with voluntary trailing space
    STATUSBAR_TOOLTIP_ON: "Leo Key Bindings are in effect",
    STATUSBAR_TOOLTIP_OFF: "Leo Key Bindings off",
};

</t>
<t tx="felix.20201214151326.6">/**
 * * Strings used in 'at-button' panel display in LeoButtonNode
 */
public static BUTTON_STRINGS = {
    NULL_WIDGET: "nullButtonWidget",
    SCRIPT_BUTTON: "script-button",
    ADD_BUTTON: "leoButtonAdd",
    NORMAL_BUTTON: "leoButtonNode"
};

</t>
<t tx="felix.20201214151326.7">/**
 * Choices offered when about to lose current changes to a Leo Document
 */
public static ASK_SAVE_CHANGES_BUTTONS: vscode.MessageItem[] = [
    {
        title: Constants.USER_MESSAGES.YES,
        isCloseAffordance: false
    },
    {
        title: Constants.USER_MESSAGES.NO,
        isCloseAffordance: false
    },
    {
        title: Constants.USER_MESSAGES.CANCEL,
        isCloseAffordance: true
    }
];

</t>
<t tx="felix.20201214151326.8">/**
 * Used in 'when' clauses, set with vscode.commands.executeCommand("setContext",...)
 */
public static CONTEXT_FLAGS = {
    // Main flags for connection and opened file
    LEO_READY: "leoReady", // Extension activated and classes created and ready
    TREE_OPENED: "leoTreeOpened", // At least one Leo file opened
    TREE_TITLED: "leoTreeTitled", // Tree is a Leo file and not a new untitled document
    SERVER_STARTED: "leoServerStarted", // Auto-start or manually started
    // 'states' flags for currently opened tree view
    LEO_CHANGED: "leoChanged",
    LEO_CAN_UNDO: "leoCanUndo",
    LEO_CAN_REDO: "leoCanRedo",
    LEO_CAN_DEMOTE: "leoCanDemote",
    LEO_CAN_PROMOTE: "leoCanPromote",
    LEO_CAN_DEHOIST: "leoCanDehoist",
    // 'states' flags about current selection, for visibility and commands availability
    SELECTED_MARKED: "leoMarked", // no need for unmarked here, use !leoMarked
    SELECTED_CLONE: "leoCloned",
    SELECTED_DIRTY: "leoDirty",
    SELECTED_EMPTY: "leoEmpty",
    SELECTED_CHILD: "leoChild", // Has children
    SELECTED_ATFILE: "LeoAtFile", // Can be refreshed
    SELECTED_ROOT: "leoRoot", // ! Computed by hand
    // Statusbar Flag 'keybindings in effect'
    LEO_SELECTED: "leoObjectSelected", // keybindings "On": Outline or body has focus
    // Context Flags for 'when' clauses, used concatenated, for each outline node
    NODE_MARKED: "leoNodeMarked",  // Selected node is marked
    NODE_UNMARKED: "leoNodeUnmarked", // Selected node is unmarked (Needed for regexp)
    NODE_ATFILE: "leoNodeAtFile", // Selected node is an @file or @clean, etc...
    NODE_CLONED: "leoNodeCloned",
    NODE_ROOT: "leoNodeRoot",
    NODE_NOT_ROOT: "leoNodeNotRoot",
    // Flags for Leo documents tree view icons and hover node command buttons
    DOCUMENT_SELECTED_TITLED: "leoDocumentSelectedTitled",
    DOCUMENT_TITLED: "leoDocumentTitled",
    DOCUMENT_SELECTED_UNTITLED: "leoDocumentSelectedUntitled",
    DOCUMENT_UNTITLED: "leoDocumentUntitled",
    // UI
    LEO_TREE_BROWSE: "leoTreeBrowse", // Override vscode's tree behavior with Leo's own
    SHOW_EDIT: "showEditOnNodes",
    SHOW_ARROWS: "showArrowsOnNodes",
    SHOW_ADD: "showAddOnNodes",
    SHOW_MARK: "showMarkOnNodes",
    SHOW_CLONE: "showCloneOnNodes",
    SHOW_COPY: "showCopyOnNodes",
};

</t>
<t tx="felix.20201214151326.9">/**
 * Command strings to be used with vscode.commands.executeCommand
 * See https://code.visualstudio.com/api/extension-guides/command#programmatically-executing-a-command
 */
public static VSCODE_COMMANDS = {
    SET_CONTEXT: "setContext",
    CLOSE_ACTIVE_EDITOR: "workbench.action.closeActiveEditor",
    QUICK_OPEN: "workbench.action.quickOpen"
};

</t>
<t tx="felix.20201214151419.1">import * as vscode from "vscode";
import { LeoButtonNode } from "./leoButtonNode";
import { ProviderResult } from "vscode";
import { Icon } from "./types";
import { LeoStates } from "./leoStates";
import { Leojs } from "./leojs";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151419.2">/**
 * * '@buttons' shown as a list with this TreeDataProvider implementation
 */
export class LeoButtonsProvider implements vscode.TreeDataProvider&lt;LeoButtonNode&gt; {

    private _onDidChangeTreeData: vscode.EventEmitter&lt;LeoButtonNode | undefined&gt; = new vscode.EventEmitter&lt;LeoButtonNode | undefined&gt;();

    readonly onDidChangeTreeData: vscode.Event&lt;LeoButtonNode | undefined&gt; = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _icons: Icon[],
        private _leojs: Leojs
    ) { }

    @others
}
</t>
<t tx="felix.20201214151419.3">/**
 * * Refresh the whole outline
 */
public refreshTreeRoot(): void {
    this._onDidChangeTreeData.fire(undefined);
}

</t>
<t tx="felix.20201214151419.4">public getTreeItem(element: LeoButtonNode): Thenable&lt;LeoButtonNode&gt; | LeoButtonNode {
    return element;
}

</t>
<t tx="felix.20201214151419.5">public getChildren(element?: LeoButtonNode): Thenable&lt;LeoButtonNode[]&gt; {
    const w_children: LeoButtonNode[] = [];
    // if called with element, or not ready, give back empty array as there won't be any children
    if (this._leoStates.fileOpenedReady &amp;&amp; !element) {
        this._leojs.atButtons.forEach(p_button =&gt; {
            w_children.push(new LeoButtonNode(p_button, this._icons));
        });
    }
    return Promise.resolve(w_children); // Defaults to an empty list of children
}

</t>
<t tx="felix.20201214151419.6">public getParent(element: LeoButtonNode): ProviderResult&lt;LeoButtonNode&gt; | null {
    // Buttons are just a list, as such, entries are always child of root so return null
    return null;
}

</t>
<t tx="felix.20201214151425.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import { LeoButton, Icon } from "./types";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151425.2">/**
 * * Leo @buttons tree view node item implementation, for usage in a TreeDataProvider.
 */
export class LeoButtonNode extends vscode.TreeItem {

    // Context string that is checked in package.json with 'when' clauses
    public contextValue: string;

    // is the special 'add' button used to create button from a given node's script
    private _isAdd: boolean;

    constructor(
        public button: LeoButton,
        private _buttonIcons: Icon[], // pointer to global array of node icons
    ) {
        super(button.name);
        // Setup this instance (just differentiate 'script-button' for now)
        this.command = {
            command: Constants.COMMANDS.CLICK_BUTTON,
            title: '',
            arguments: [this]
        };
        this._isAdd = (this.button.index.startsWith(Constants.BUTTON_STRINGS.NULL_WIDGET) &amp;&amp;
            this.button.name === Constants.BUTTON_STRINGS.SCRIPT_BUTTON);
        this.contextValue = this._isAdd ? Constants.BUTTON_STRINGS.ADD_BUTTON : Constants.BUTTON_STRINGS.NORMAL_BUTTON;
    }

    @others
}
</t>
<t tx="felix.20201214151425.3">// @ts-ignore
public get iconPath(): Icon {
    return this._buttonIcons[this._isAdd ? 1 : 0];
}

</t>
<t tx="felix.20201214151425.4">// @ts-ignore
public get id(): string {
    // Add prefix and suffix salt to index to prevent accidental duplicates
    return "p" + this.button.index + "s" + this.button.name;
}

</t>
<t tx="felix.20201214151425.5">// @ts-ignore
public get tooltip(): string {
    if (this._isAdd) {
        return Constants.USER_MESSAGES.SCRIPT_BUTTON_TOOLTIP;
    } else {
        return this.button.name;
    }
}

</t>
<t tx="felix.20201214151425.6">// @ts-ignore
public get description(): string | boolean {
    if (this._isAdd) {
        return Constants.USER_MESSAGES.SCRIPT_BUTTON;
    } else {
        return false;
    }
}

</t>
<t tx="felix.20201214151429.1">import * as vscode from "vscode";
import { LeoUI } from './leoUI';

import { LeoDocumentNode } from "./leoDocumentNode";
import { ProviderResult } from "vscode";
import { LeoStates } from "./leoStates";
import { Leojs } from "./leojs";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151429.2">/**
 * * Opened Leo documents shown as a list with this TreeDataProvider implementation
 */
export class LeoDocumentsProvider implements vscode.TreeDataProvider&lt;LeoDocumentNode&gt; {

    private _onDidChangeTreeData: vscode.EventEmitter&lt;LeoDocumentNode | undefined&gt; = new vscode.EventEmitter&lt;LeoDocumentNode | undefined&gt;();

    readonly onDidChangeTreeData: vscode.Event&lt;LeoDocumentNode | undefined&gt; = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _leoUI: LeoUI,
        private _leojs: Leojs
    ) { }

    @others
}
</t>
<t tx="felix.20201214151429.3">/**
 * * Refresh the whole outline
 */
public refreshTreeRoot(): void {
    this._onDidChangeTreeData.fire(undefined);
}

</t>
<t tx="felix.20201214151429.4">public getTreeItem(element: LeoDocumentNode): Thenable&lt;LeoDocumentNode&gt; | LeoDocumentNode {
    return element;
}

</t>
<t tx="felix.20201214151429.5">public getChildren(element?: LeoDocumentNode): Thenable&lt;LeoDocumentNode[]&gt; {
    const w_children: LeoDocumentNode[] = [];
    // if called with element, or not ready, give back empty array as there won't be any children
    if (this._leoStates.fileOpenedReady &amp;&amp; !element) {
        this._leojs.documents.forEach(p_doc =&gt; {
            w_children.push(new LeoDocumentNode(p_doc, this._leoUI));
        });
    }
    return Promise.resolve(w_children); // Defaults to an empty list of children
}

</t>
<t tx="felix.20201214151429.6">public getParent(element: LeoDocumentNode): ProviderResult&lt;LeoDocumentNode&gt; {
    // Leo documents are just a list, as such, entries are always child of root, so return null
    return undefined;
}

</t>
<t tx="felix.20201214151434.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import { LeoDocument, Icon } from "./types";
import * as utils from "./utils";
import { LeoUI } from "./leoUI";


@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151434.2">/**
 * * Opened Leo documents tree view node item implementation for usage in a TreeDataProvider
 */
export class LeoDocumentNode extends vscode.TreeItem {

    // Context string is checked in package.json with 'when' clauses
    public contextValue: string;

    constructor(
        public documentEntry: LeoDocument,
        private _leoJs: LeoUI
    ) {
        super(documentEntry.name);
        // Setup this instance
        const w_isNamed: boolean = !!this.documentEntry.name;
        this.label = w_isNamed ? utils.getFileFromPath(this.documentEntry.name) : Constants.UNTITLED_FILE_NAME;
        this.tooltip = w_isNamed ? this.documentEntry.name : Constants.UNTITLED_FILE_NAME;
        this.command = {
            command: Constants.COMMANDS.SET_OPENED_FILE,
            title: '',
            arguments: [this.documentEntry.index]
        };
        // If this was created as a selected node, make sure it's selected as we may have opened/closed document
        if (this.documentEntry.selected) {
            this._leoJs.setDocumentSelection(this);
            this.contextValue = w_isNamed ? Constants.CONTEXT_FLAGS.DOCUMENT_SELECTED_TITLED : Constants.CONTEXT_FLAGS.DOCUMENT_SELECTED_UNTITLED;
        } else {
            this.contextValue = w_isNamed ? Constants.CONTEXT_FLAGS.DOCUMENT_TITLED : Constants.CONTEXT_FLAGS.DOCUMENT_UNTITLED;
        }
    }

    @others
}
</t>
<t tx="felix.20201214151434.3">// @ts-ignore
public get iconPath(): Icon {
    return this._leoJs.documentIcons[this.documentEntry.changed ? 1 : 0];
}

</t>
<t tx="felix.20201214151434.4">// @ts-ignore
public get id(): string {
    // Add prefix and suffix salt to numeric index to prevent accidental duplicates
    return "p" + this.documentEntry.index + "s" + this.documentEntry.name;
}

</t>
<t tx="felix.20201214151447.1">import * as vscode from "vscode";
import * as utils from "./utils";
import { LeoUI } from "./leoUI";
import { Constants } from "./constants";
import { LeoPackageStates, PNode } from "./types";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151447.10">private _leoCanPromote: boolean = false;
get leoCanPromote(): boolean {
    return this._leoCanPromote;
}
set leoCanPromote(p_value: boolean) {
    this._leoCanPromote = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_PROMOTE, p_value);
}

</t>
<t tx="felix.20201214151447.11">private _leoCanDehoist: boolean = false;
get leoCanDehoist(): boolean {
    return this._leoCanDehoist;
}
set leoCanDehoist(p_value: boolean) {
    this._leoCanDehoist = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_DEHOIST, p_value);
}

</t>
<t tx="felix.20201214151447.12"></t>
<t tx="felix.20201214151447.13">// * 'states' flags about current selection, for visibility and commands availability
private _leoMarked: boolean = false;
get leoMarked(): boolean {
    return this._leoMarked;
}
set leoMarked(p_value: boolean) {
    this._leoMarked = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_MARKED, p_value);
}

</t>
<t tx="felix.20201214151447.14">private _leoCloned: boolean = false;
get leoCloned(): boolean {
    return this._leoCloned;
}
set leoCloned(p_value: boolean) {
    this._leoCloned = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_CLONE, p_value);
}

</t>
<t tx="felix.20201214151447.15">private _leoDirty: boolean = false;
get leoDirty(): boolean {
    return this._leoDirty;
}
set leoDirty(p_value: boolean) {
    this._leoDirty = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_DIRTY, p_value);
}

</t>
<t tx="felix.20201214151447.16">private _leoEmpty: boolean = false;
get leoEmpty(): boolean {
    return this._leoEmpty;
}
set leoEmpty(p_value: boolean) {
    this._leoEmpty = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_EMPTY, p_value);
}

</t>
<t tx="felix.20201214151447.17">private _leoChild: boolean = false;
get leoChild(): boolean {
    return this._leoChild;
}
set leoChild(p_value: boolean) {
    this._leoChild = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_CHILD, p_value);
}

</t>
<t tx="felix.20201214151447.18">private _leoAtFile: boolean = false;
get leoAtFile(): boolean {
    return this._leoAtFile;
}
set leoAtFile(p_value: boolean) {
    this._leoAtFile = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_ATFILE, p_value);
}

</t>
<t tx="felix.20201214151447.19">// * Special is-root 'state' flag about current selection, for visibility and commands availability
private _leoRoot: boolean = false;
get leoRoot(): boolean {
    return this._leoRoot;
}
set leoRoot(p_value: boolean) {
    this._leoRoot = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_ROOT, p_value);
}

</t>
<t tx="felix.20201214151447.2">/**
 * * Global states service
 * Holds state flags used to restrict command availability and icon visibility
 * Changes UI by changing vscode's context variables
 */
export class LeoStates {

    @others
}
</t>
<t tx="felix.20201214151447.20">constructor(
    private _context: vscode.ExtensionContext,
    private _leoJs: LeoUI
) { }

</t>
<t tx="felix.20201214151447.21">public setSelectedNodeFlags(p_node: PNode): void {
    this.leoRoot = false; // * RESET the root flag : It is set by vscode instead right after getting list of children for root of outline
    this.leoMarked = !!p_node.marked;
    this.leoCloned = !!p_node.cloned;
    this.leoDirty = !!p_node.dirty;
    this.leoEmpty = !p_node.body.length;
    this.leoChild = !!p_node.children.length;
    this.leoAtFile = !!p_node.atFile;
}

</t>
<t tx="felix.20201214151447.22">public setLeoStateFlags(p_states: LeoPackageStates): void {
    this.leoChanged = p_states.changed;
    this.leoCanUndo = p_states.canUndo;
    this.leoCanRedo = p_states.canRedo;
    this.leoCanDemote = p_states.canDemote;
    this.leoCanPromote = p_states.canPromote;
    this.leoCanDehoist = p_states.canDehoist;
}
</t>
<t tx="felix.20201214151447.3"></t>
<t tx="felix.20201214151447.4">// * A Leo file is opened
private _fileOpenedReady: boolean = false; // Sets context flag along with treeview title
get fileOpenedReady(): boolean {
    return this._fileOpenedReady;
}
set fileOpenedReady(p_value: boolean) {
    this._fileOpenedReady = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.TREE_OPENED, p_value);
}

</t>
<t tx="felix.20201214151447.5">// * Currently opened Leo file path and name, empty string if new unsaved file.
private _leoOpenedFileName: string = "";
get leoOpenedFileName(): string {
    return this._leoOpenedFileName;
}
set leoOpenedFileName(p_name: string) {
    if (p_name &amp;&amp; p_name.length) {
        this._leoOpenedFileName = p_name;
        utils.setContext(Constants.CONTEXT_FLAGS.TREE_TITLED, true);
    } else {
        this._leoOpenedFileName = "";
        utils.setContext(Constants.CONTEXT_FLAGS.TREE_TITLED, false);
    }
}

</t>
<t tx="felix.20201214151447.6">// * 'states' flags for currently opened tree view
private _leoChanged: boolean = false;
get leoChanged(): boolean {
    return this._leoChanged;
}
set leoChanged(p_value: boolean) {
    if (this._leoChanged !== p_value) {
        // Refresh Documents Panel
        this._leoJs.refreshDocumentsPane();
    }
    this._leoChanged = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_CHANGED, p_value);
}

</t>
<t tx="felix.20201214151447.7">private _leoCanUndo: boolean = false;
get leoCanUndo(): boolean {
    return this._leoCanUndo;
}
set leoCanUndo(p_value: boolean) {
    this._leoCanUndo = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_UNDO, p_value);
}

</t>
<t tx="felix.20201214151447.8">private _leoCanRedo: boolean = false;
get leoCanRedo(): boolean {
    return this._leoCanRedo;
}
set leoCanRedo(p_value: boolean) {
    this._leoCanRedo = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_REDO, p_value);
}

</t>
<t tx="felix.20201214151447.9">private _leoCanDemote: boolean = false;
get leoCanDemote(): boolean {
    return this._leoCanDemote;
}
set leoCanDemote(p_value: boolean) {
    this._leoCanDemote = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_DEMOTE, p_value);
}

</t>
<t tx="felix.20201214151451.1">import * as vscode from "vscode";
import * as utils from "./utils";
import { Constants } from "./constants";
import { LeoUI } from "./leoUI";


@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151451.2">/**
 * * Statusbar indicator controller service
 */
export class LeoStatusBar {

    private _leoStatusBarItem: vscode.StatusBarItem;
    private _statusbarNormalColor = new vscode.ThemeColor(Constants.GUI.THEME_STATUSBAR);  // "statusBar.foreground"
    private _updateStatusBarTimeout: NodeJS.Timeout | undefined;
    private _string: string = ""; // Use this string with indicator, using this will replace the default from config

    // * Represents having focus on a leo tree, body or document panel to enable leo keybindings
    private _statusBarFlag: boolean = false;
    set statusBarFlag(p_value: boolean) {
        this._statusBarFlag = p_value;
    }
    get statusBarFlag(): boolean {
        return this._statusBarFlag;
    }

    constructor(
        private _context: vscode.ExtensionContext,
        private _leoJs: LeoUI
    ) {
        this._leoStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
        this._leoStatusBarItem.color = Constants.GUI.STATUSBAR_COLOR;

        // this._leoStatusBarItem.command = Constants.COMMANDS.SWITCH_FILE;
        this._leoStatusBarItem.command = "leointeg.test"; // just call test function for now to help debugging
        this._leoStatusBarItem.text = Constants.GUI.STATUSBAR_INDICATOR;
        this._leoStatusBarItem.tooltip = Constants.USER_MESSAGES.STATUSBAR_TOOLTIP_ON;
        _context.subscriptions.push(this._leoStatusBarItem);
        this._leoStatusBarItem.hide();
    }

    @others
}
</t>
<t tx="felix.20201214151451.3">/**
 * * Makes the statusbar indicator visible
 */
public show(): void {
    this._leoStatusBarItem.show();
}

</t>
<t tx="felix.20201214151451.4">/**
 * * Hides the statusbar indicator
 */
public hide(): void {
    this._leoStatusBarItem.hide();
}

</t>
<t tx="felix.20201214151451.5">/**
 * * Sets string to replace default from config &amp; refresh it
 */
public setString(p_string: string): void {
    this._string = p_string;
    this._updateLeoObjectIndicator();
}

</t>
<t tx="felix.20201214151451.6">/**
 * * Updates the status bar visual indicator visual indicator with optional debouncing delay
 * @param p_state True/False flag for On or Off status
 * @param p_debounceDelay Optional, in milliseconds
 */
public update(p_state: boolean, p_debounceDelay?: number, p_forced?: boolean): void {
    if (p_forced || (p_state !== this.statusBarFlag)) {
        this.statusBarFlag = p_state;
        if (p_debounceDelay) {
            this._updateLeoObjectIndicatorDebounced(p_debounceDelay);
        } else {
            this._updateLeoObjectIndicator();
        }
    }
}

</t>
<t tx="felix.20201214151451.7">/**
 * * Updates the status bar visual indicator flag in a debounced manner
 * @param p_delay number of milliseconds
 */
private _updateLeoObjectIndicatorDebounced(p_delay: number): void {
    if (this._updateStatusBarTimeout) {
        clearTimeout(this._updateStatusBarTimeout);
    }
    this._updateStatusBarTimeout = setTimeout(() =&gt; {
        this._updateLeoObjectIndicator();
    }, p_delay);
}

</t>
<t tx="felix.20201214151451.8">/**
 * * Updates the status bar visual indicator flag directly
 */
private _updateLeoObjectIndicator(): void {
    // Can be called directly, so clear timer if any
    if (this._updateStatusBarTimeout) {
        clearTimeout(this._updateStatusBarTimeout);
    }

    utils.setContext(Constants.CONTEXT_FLAGS.LEO_SELECTED, !!this.statusBarFlag);

    this._leoStatusBarItem.text = Constants.GUI.STATUSBAR_INDICATOR +
        (this._string ? this._string : '') + " " +
        (this._leoJs.leoStates.leoOpenedFileName ? utils.getFileFromPath(this._leoJs.leoStates.leoOpenedFileName) : Constants.UNTITLED_FILE_NAME);

    // Also check in constructor for statusBar properties (the createStatusBarItem call itself)
    if (this.statusBarFlag &amp;&amp; this._leoJs.leoStates.fileOpenedReady) {
        this._leoStatusBarItem.color = "#" + Constants.GUI.STATUSBAR_COLOR;
        this._leoStatusBarItem.tooltip = Constants.USER_MESSAGES.STATUSBAR_TOOLTIP_ON;
    } else {
        this._leoStatusBarItem.color = this._statusbarNormalColor;
        this._leoStatusBarItem.tooltip = Constants.USER_MESSAGES.STATUSBAR_TOOLTIP_OFF;
    }
}

</t>
<t tx="felix.20201214154442.1">// @ts-ignore
public get iconPath(): Icon {
    // From Leo's leoNodes.py computeIcon function
    // 1=has Body, 2=marked, 4=cloned, 8=dirty
    let w_icon: number =
        (+this.dirty &lt;&lt; 3) |
        (+this.cloned &lt;&lt; 2) |
        (+this.marked &lt;&lt; 1) |
        +this.hasBody;
    return this._icons[w_icon];
}

</t>
<t tx="felix.20201214154457.1">// Optional id for the tree item that has to be unique across tree.
// The id is used to preserve the selection and expansion state of the tree item.
// If not provided, an id is generated using the tree item's label.
// Note that when labels change, ids will change and that selection and expansion state cannot be kept stable anymore.
// @ts-ignore
public get id(): string { return this._id; }

</t>
<t tx="felix.20201214154511.1">// @ts-ignore
public get description(): string {
    // * some smaller grayed-out text accompanying the main label
    if (this.u) {
        return "\u{1F4CE} (" + Object.keys(this.u).length + ")";
    } else {
        return "id:" + this.id; // ! debug test
        // return "gnx:" + this.gnx; // ! debug test
        return ""; // Falsy will not be shown
    }
}

</t>
<t tx="felix.20201214154524.1">// @ts-ignore
public get tooltip(): string {
    if (this.u) {
        //  "\ntotal keys is :" + Object.keys(this.u).length
        return this.label + "\n" +
            JSON.stringify(this.u, undefined, 2);
    } else {
        return this.label; // * Whole headline as tooltip
    }
}

</t>
<t tx="felix.20201214154816.1">import * as vscode from "vscode";
import { LeoNode } from "./leoNode";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214154816.10">/**
 * * Icon path names used in leoNodes for rendering in treeview
 */
export interface Icon {
    light: string;
    dark: string;
}

</t>
<t tx="felix.20201214154816.11">/**
 * * Parameter structure used in the 'runSaveFileDialog' equivalent when asking user input
 */
export interface showSaveAsDialogParameters {
    "initialFile": string;
    "title": string;
    "message": string;
    "filetypes": string[];
    "defaultExtension": string;
}

</t>
<t tx="felix.20201214154816.12">/**
 * * Parameter structure used in the 'runAskYesNoDialog' equivalent when asking user input
 */
export interface runAskYesNoDialogParameters {
    "ask": string;
    "message": string;
    "yes_all": boolean;
    "no_all": boolean;
}

</t>
<t tx="felix.20201214154816.13">/**
 * * Parameter structure used in the 'runAskOkDialog' equivalent when showing a warning
 */
export interface runWarnMessageDialogParameters {
    "warn": string;
    "message": string;
}

</t>
<t tx="felix.20201214154816.14">/**
 * * Parameter structure for non-blocking info message about detected file changes
 */
export interface runInfoMessageDialogParameters {
    "message": string;
}

</t>
<t tx="felix.20201214154816.15">/**
 * * Used in showAskModalDialog to get answer from user interaction
 */
export interface AskMessageItem extends vscode.MessageItem {
    value: string;
}

</t>
<t tx="felix.20201214154816.16">/**
 * * Used in switch Leo document to get answer from user interaction
 */
export interface ChooseDocumentItem extends vscode.QuickPickItem {
    value: number;
}

</t>
<t tx="felix.20201214154816.17">/**
 * * Used by the minibuffer command pallette
 * Acquired from the getCommands method in leobridgeserver.py
 */
export interface MinibufferCommand extends vscode.QuickPickItem {
    func: string;
}
</t>
<t tx="felix.20201214154816.2">export interface PNode {
    // Fake structure. Use Position.v.isCloned(), etc. instead
    header: string;
    children: PNode[];
    parent?: PNode;
    body: string;
    selected?: boolean;
    marked?: boolean;
    cloned?: boolean;
    dirty?: boolean;
    atFile?: boolean;
}

</t>
<t tx="felix.20201214154816.3">/**
 * * When refreshing the outline and getting to Leo's selected node
 */
export const enum RevealType {
    NoReveal = 0,   // In apToLeoNode conversion. True:
    // Re-use the old if the global revealType is "NoReveal" and it's the selected node.
    Reveal,
    RevealSelect,
    RevealSelectFocus
}

</t>
<t tx="felix.20201214154816.4">/**
 * * Required Refresh Dictionary of "elements to refresh" flags
 */
export interface ReqRefresh {
    node?: boolean; // Reveal received selected node (Navigation only, no tree change)
    tree?: boolean; // Tree needs refresh
    body?: boolean; // Body needs refresh
    states?: boolean; // States needs refresh:
    // (changed, canUndo, canRedo, canDemote, canPromote, canDehoist)
    buttons?: boolean; // Buttons needs refresh
    documents?: boolean; // Documents needs refresh
}

</t>
<t tx="felix.20201214154816.5">/**
 * * Stackable front end commands
 */
export interface UserCommand {
    action: string;
    node?: LeoNode | undefined;  // We can START a stack with a targeted command
    text?: string | undefined; // If a string is required, for headline, etc.
    refreshType: ReqRefresh; // Minimal refresh level required by this command
    fromOutline: boolean; // Focus back on outline instead of body
    keepSelection?: boolean; // Should bring back selection on node prior to command
    resolveFn?: (result: any) =&gt; void; // call that with an answer from python's (or other) side
    rejectFn?: (reason: any) =&gt; void; // call if problem is encountered
}

</t>
<t tx="felix.20201214154816.6">/**
 * * Object container for parameters of leoJs "apply-selected-node-to-body" method
 */
export interface ShowBodyParam {
    node: LeoNode,
    aside: boolean,
    showBodyKeepFocus: boolean,
    force_open?: boolean
}
</t>
<t tx="felix.20201214154816.7">/**
 * * Object sent back from leoInteg's 'getStates' command
 */
export interface LeoPackageStates {
    changed: boolean; // Leo document has changed (is dirty)
    canUndo: boolean; // Leo document can undo the last operation done
    canRedo: boolean; // Leo document can redo the last operation 'undone'
    canDemote: boolean; // Currently selected node can have its siblings demoted
    canPromote: boolean; // Currently selected node can have its children promoted
    canDehoist: boolean; // Leo Document is currently hoisted and can be de-hoisted
}

</t>
<t tx="felix.20201214154816.8">/**
 * * Leo document structure used in the 'Opened Leo Documents' tree view provider sent back by the server
 */
export interface LeoDocument {
    name: string;
    index: number;
    changed: boolean;
    selected: boolean;
}

</t>
<t tx="felix.20201214154816.9">/**
 * * Leo '@button' structure used in the '@buttons' tree view provider
 */
export interface LeoButton {
    name: string;
    index: string; // STRING KEY
}

</t>
<t tx="felix.20201214194144.1">import * as vscode from "vscode";
import { debounce } from "debounce";
import * as utils from "./utils";
import { Constants } from "./constants";
import {
    RevealType,
    Icon,
    ReqRefresh,
    ChooseDocumentItem,
    MinibufferCommand,
    UserCommand,
    ShowBodyParam,
    PNode
} from "./types";
import { Leojs } from "./leojs";

import { LeoNode } from "./leoNode";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode } from "./leoButtonNode";
import { LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentNode } from "./leoDocumentNode";
import { LeoDocumentsProvider } from "./leoDocuments";
import { LeoStates } from "./leoStates";
@language typescript

@tabwidth -4
@others
</t>
<t tx="felix.20201214194144.10"></t>
<t tx="felix.20201214194144.11"></t>
<t tx="felix.20201214194144.2">constructor(private _context: vscode.ExtensionContext) {
    // * Setup States
    this.leoStates = new LeoStates(_context, this);

    // * Build Icon filename paths
    this.nodeIcons = utils.buildNodeIconPaths(_context);
    this.documentIcons = utils.buildDocumentIconPaths(_context);
    this.buttonIcons = utils.buildButtonsIconPaths(_context);

    // * Create leo core class
    this._leo = new Leojs();

    // * Create file browser instance
    // this._leoFilesBrowser = new LeoFilesBrowser(_context);

    // * Create a single data provider for both outline trees, Leo view and Explorer view
    this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons, this, this._leo);
    this._leoTreeView = vscode.window.createTreeView(Constants.TREEVIEW_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
    this._leoTreeView.onDidExpandElement((p_event =&gt; this._onChangeCollapsedState(p_event, true, this._leoTreeView)));
    this._leoTreeView.onDidCollapseElement((p_event =&gt; this._onChangeCollapsedState(p_event, false, this._leoTreeView)));
    this._leoTreeView.onDidChangeVisibility((p_event =&gt; this._onTreeViewVisibilityChanged(p_event, false))); // * Trigger 'show tree in Leo's view'
    this._leoTreeExView = vscode.window.createTreeView(Constants.TREEVIEW_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoTreeProvider });
    this._leoTreeExView.onDidExpandElement((p_event =&gt; this._onChangeCollapsedState(p_event, true, this._leoTreeExView)));
    this._leoTreeExView.onDidCollapseElement((p_event =&gt; this._onChangeCollapsedState(p_event, false, this._leoTreeExView)));
    this._leoTreeExView.onDidChangeVisibility((p_event =&gt; this._onTreeViewVisibilityChanged(p_event, true))); // * Trigger 'show tree in explorer view'
    this._lastTreeView = this._leoTreeExView;

    // * Create Leo Opened Documents Treeview Providers and tree views
    this._leoDocumentsProvider = new LeoDocumentsProvider(this.leoStates, this, this._leo);
    this._leoDocuments = vscode.window.createTreeView(Constants.DOCUMENTS_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
    this._leoDocuments.onDidChangeVisibility((p_event =&gt; this._onDocTreeViewVisibilityChanged(p_event, false)));
    this._leoDocumentsExplorer = vscode.window.createTreeView(Constants.DOCUMENTS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
    this._leoDocumentsExplorer.onDidChangeVisibility((p_event =&gt; this._onDocTreeViewVisibilityChanged(p_event, true)));

    // * Create '@buttons' Treeview Providers and tree views
    this._leoButtonsProvider = new LeoButtonsProvider(this.leoStates, this.buttonIcons, this._leo);
    this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
    this._leoButtons.onDidChangeVisibility((p_event =&gt; this._onButtonsTreeViewVisibilityChanged(p_event, false)));
    this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
    this._leoButtonsExplorer.onDidChangeVisibility((p_event =&gt; this._onButtonsTreeViewVisibilityChanged(p_event, true)));

    // * Debounced refresh flags and UI parts, other than the tree and body, when operation(s) are done executing
    this.getStates = debounce(this._triggerGetStates, Constants.STATES_DEBOUNCE_DELAY);
    this.refreshDocumentsPane = debounce(this._refreshDocumentsPane, Constants.DOCUMENTS_DEBOUNCE_DELAY);
    this.launchRefresh = debounce(this._launchRefresh, Constants.REFRESH_DEBOUNCE_DELAY);

    // Reset Extension context flags (used in 'when' clauses in package.json)
    this.leoStates.leoReady = true;
    this.leoStates.fileOpenedReady = true;  // TODO : IMPLEMENT


    // Set some context flags already 'true' at startup - NO CONFIG SETTINGS FOR NOW IN LEOJS
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_TREE_BROWSE, true); // force 'Leo's editing tree behavior

}

</t>
<t tx="felix.20201214194144.3"></t>
<t tx="felix.20201214194144.4"></t>
<t tx="felix.20201214194144.5"></t>
<t tx="felix.20201214194144.6"></t>
<t tx="felix.20201214194144.7"></t>
<t tx="felix.20201214194144.8"></t>
<t tx="felix.20201214194144.9"></t>
<t tx="felix.20201214194412.1">import * as leoFiles from "./leoFiles";
import { LeoButton, LeoDocument, PNode } from "./types";
@language typescript
@tabwidth -4

// https://github.com/leo-editor/leo-editor/issues/1025

// For now give results to tree view panels (outline, documents and at-buttons)

@others
</t>
<t tx="felix.20201214195752.1">/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI {
    // * State flags
    public leoStates: LeoStates;

    // * temporary / fake config
    public config: { [key: string]: boolean } = {
        leoTreeBrowse: true,
        showEditOnNodes: false,
        showArrowsOnNodes: false,
        showAddOnNodes: false,
        showMarkOnNodes: false,
        showCloneOnNodes: false,
        showCopyOnNodes: false,
    };

    // * Icon Paths (Singleton static arrays)
    public nodeIcons: Icon[] = [];
    public documentIcons: Icon[] = [];
    public buttonIcons: Icon[] = [];

    private _leo: Leojs;

    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh
    private _revealType: RevealType = RevealType.NoReveal; // Type of reveal for the selected node (when refreshing outline)
    private _fromOutline: boolean = false; // flag to leave focus on outline instead of body when finished refreshing

    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.

    // * Outline Pane
    private _leoTreeProvider: LeoOutlineProvider; // TreeDataProvider single instance
    private _leoTreeView: vscode.TreeView&lt;PNode&gt;; // Outline tree view added to the Tree View Container with an Activity Bar icon
    private _leoTreeExView: vscode.TreeView&lt;PNode&gt;; // Outline tree view added to the Explorer Sidebar
    private _lastTreeView: vscode.TreeView&lt;PNode&gt;; // Last visible treeview
    private _treeId: number = 0; // Starting salt for tree node murmurhash generated Ids // unused so far in leojs

    private _lastSelectedNode: LeoNode | undefined; // Last selected node we got a hold of; leoTreeView.selection maybe newer and unprocessed
    get lastSelectedNode(): LeoNode | undefined {
        return this._lastSelectedNode;
    }
    set lastSelectedNode(p_leoNode: LeoNode | undefined) { // Needs undefined: cannot be set in the constructor
        this._lastSelectedNode = p_leoNode;
        if (p_leoNode) {
            utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_MARKED, p_leoNode.marked); // Global context to 'flag' the selected node's marked state
        }
    }

    // * Body pane
    private _bodyUri: vscode.Uri = utils.strToLeoUri("");
    get bodyUri(): vscode.Uri {
        return this._bodyUri;
    }
    set bodyUri(p_uri: vscode.Uri) {
        // this._leoFileSystem.setBodyTime(p_uri);
        this._bodyUri = p_uri;
    }

    // * Documents Pane
    private _leoDocumentsProvider: LeoDocumentsProvider;
    private _leoDocuments: vscode.TreeView&lt;LeoDocumentNode&gt;;
    private _leoDocumentsExplorer: vscode.TreeView&lt;LeoDocumentNode&gt;;
    private _currentDocumentChanged: boolean = false; // if clean and an edit is done: refresh opened documents view

    // * '@button' pane
    private _leoButtonsProvider: LeoButtonsProvider;
    private _leoButtons: vscode.TreeView&lt;LeoButtonNode&gt;;
    private _leoButtonsExplorer: vscode.TreeView&lt;LeoButtonNode&gt;;

    // * Log and terminal Panes
    private _leoLogPane: vscode.OutputChannel = vscode.window.createOutputChannel(Constants.GUI.LOG_PANE_TITLE);
    private _leoTerminalPane: vscode.OutputChannel | undefined;

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public launchRefresh: (() =&gt; void) &amp; {
        clear(): void;
    } &amp; {
        flush(): void;
    };

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public getStates: (() =&gt; void) &amp; {
        clear(): void;
    } &amp; {
        flush(): void;
    };

    // * Debounced method used to get states for UI display flags (commands such as undo, redo, save, ...)
    public refreshDocumentsPane: (() =&gt; void) &amp; {
        clear(): void;
    } &amp; {
        flush(): void;
    };

    @others


}
</t>
<t tx="felix.20201214202058.1">/**
 * * 'getStates' action for use in debounced method call
 */
private _triggerGetStates(): void {
    if (this._refreshType.documents) {
        this._refreshType.documents = false;
        this.refreshDocumentsPane();
    }
    if (this._refreshType.buttons) {
        this._refreshType.buttons = false;
        this._leoButtonsProvider.refreshTreeRoot();
    }
    if (this._refreshType.states) {
        this._refreshType.states = false;
        // this.leoStates.setLeoStateFlags(this._leo.getLeoStates);
    }
}

</t>
<t tx="felix.20201214202118.1">/**
 * * Show the outline, with Leo's selected node also selected, and optionally focussed
 * @param p_focusOutline Flag for focus to be placed in outline
 */
public showOutline(p_focusOutline?: boolean): void {
    if (this.lastSelectedNode) {
        this._lastTreeView.reveal(this.lastSelectedNode.ap, {
            select: true,
            focus: p_focusOutline
        });
    }
}

</t>
<t tx="felix.20201214202123.1">/**
 * * Public method exposed as 'refreshDocumentsPane' setter/getter to refresh the documents pane
 * Document Panel May be refreshed by other services (states service, ...)
 */
private _refreshDocumentsPane(): void {
    this._leoDocumentsProvider.refreshTreeRoot();
}

</t>
<t tx="felix.20201214202128.1">/**
 * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
 * @param p_documentNode Document node instance in the Leo document view to be the 'selected' one.
 */
public setDocumentSelection(p_documentNode: LeoDocumentNode): void {
    this._currentDocumentChanged = p_documentNode.documentEntry.changed;
    this.leoStates.leoOpenedFileName = p_documentNode.documentEntry.name;
    setTimeout(() =&gt; {
        if (!this._leoDocuments.visible &amp;&amp; !this._leoDocumentsExplorer.visible) {
            return;
        }
        let w_docView: vscode.TreeView&lt;LeoDocumentNode&gt;;
        if (this._leoDocuments.visible) {
            w_docView = this._leoDocuments;
        } else {
            w_docView = this._leoDocumentsExplorer;
        }
        if (w_docView.selection.length &amp;&amp; w_docView.selection[0] === p_documentNode) {
            console.log('setDocumentSelection: already selected!');

        } else {
            console.log('setDocumentSelection: selecting in tree');

            w_docView.reveal(p_documentNode, { select: true, focus: false });
        }

    }, 0);
}

</t>
<t tx="felix.20201214202625.1">/**
 * * Handles the node expanding and collapsing interactions by the user in the treeview
 * @param p_event The event passed by vscode
 * @param p_expand True if it was an expand, false if it was a collapse event
 * @param p_treeView Pointer to the treeview itself, either the standalone treeview or the one under the explorer
 */
private _onChangeCollapsedState(p_event: vscode.TreeViewExpansionEvent&lt;PNode&gt;, p_expand: boolean, p_treeView: vscode.TreeView&lt;PNode&gt;): void {
    // * Expanding or collapsing via the treeview interface selects the node to mimic Leo
    // this.triggerBodySave(true);
    // if (p_treeView.selection[0] &amp;&amp; p_treeView.selection[0] === p_event.element) {
    //     // * This happens if the tree selection is the same as the expanded/collapsed node: Just have Leo do the same
    //     // Pass
    // } else {
    //     // * This part only happens if the user clicked on the arrow without trying to select the node
    //     this._revealTreeViewNode(p_event.element, { select: true, focus: false }); // No force focus : it breaks collapse/expand when direct parent
    //     this.selectTreeNode(p_event.element, true);  // not waiting for a .then(...) so not to add any lag
    // }
    // this.sendAction(p_expand ? Constants.LEOBRIDGE.EXPAND_NODE : Constants.LEOBRIDGE.COLLAPSE_NODE, p_event.element.apJson)
    //     .then(() =&gt; {
    //         if (this.config.leoTreeBrowse) {
    //             this._refreshOutline(true, RevealType.RevealSelect);
    //         }
    //     });

    console.log("Set Expand/Collapse in leojs");
    if (this.config.leoTreeBrowse) {
        this._refreshOutline(true, RevealType.RevealSelect);
    }


}

</t>
<t tx="felix.20201214202627.1">/**
 * * Handle the change of visibility of either outline treeview and refresh it if its visible
 * @param p_event The treeview-visibility-changed event passed by vscode
 * @param p_explorerView Flag to signify that the treeview who triggered this event is the one in the explorer view
 */
private _onTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
    if (p_event.visible) {
        this._lastTreeView = p_explorerView ? this._leoTreeExView : this._leoTreeView;
        this._refreshOutline(true, RevealType.RevealSelect);
    }
}

</t>
<t tx="felix.20201214202631.1">/**
 * * Handle the change of visibility of either outline treeview and refresh it if its visible
 * @param p_event The treeview-visibility-changed event passed by vscode
 * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
 */
private _onDocTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
    if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
    if (p_event.visible) {
        this.refreshDocumentsPane();
    }
}

</t>
<t tx="felix.20201214202634.1">/**
 * * Handle the change of visibility of either outline treeview and refresh it if its visible
 * @param p_event The treeview-visibility-changed event passed by vscode
 * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
 */
private _onButtonsTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
    if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
    if (p_event.visible) {
        this._leoButtonsProvider.refreshTreeRoot();
    }
}

</t>
<t tx="felix.20201214202749.1">public selectTreeNode(p_node: LeoNode, p_internalCall?: boolean, p_aside?: boolean): Thenable&lt;unknown&gt; {
    vscode.window.showInformationMessage('TODO: Implement selectTreeNode');
    console.log('set flags for ', p_node);

    console.log('selectTreeNode called so Refresh Body' + (p_aside ? ' but opened aside' : ''));

    this.lastSelectedNode = p_node;

    return Promise.resolve(true);
}

</t>
<t tx="felix.20201214202755.1">/**
 * Leo Command
 * @param p_cmd Command name string
 * @param p_node facultative, precise node onto which the command is run (also see p_keepSelection)
 * @param p_refreshType Object containing flags for sections needing to refresh after command ran
 * @param p_fromOutline flag to bring back focus on outline afterward
 * @param p_keepSelection flags to bring back selection on the original node before command ran
 */
public command(
    p_cmd: string,
    p_node: LeoNode | undefined,
    p_refreshType: ReqRefresh,
    p_fromOutline: boolean,
    p_keepSelection?: boolean
): Thenable&lt;unknown&gt; {

    this._setupRefresh(p_fromOutline, p_refreshType);

    vscode.window.showInformationMessage(
        'TODO: Implement ' +
        p_cmd +
        " called from " +
        (p_fromOutline ? "outline" : "body") +
        " operate on " +
        (p_node ? p_node!.label : "the selected node") +
        (p_keepSelection ? " and bring selection back on currently selected node" : "")
    );

    this.launchRefresh();

    return Promise.resolve(true);
}

</t>
<t tx="felix.20201214202757.1">/**
 * Opens quickPick minibuffer pallette to choose from all commands in this file's Thenable
 * @returns Thenable from the command resolving - or resolve with undefined if cancelled
 */
public minibuffer(): Thenable&lt;unknown&gt; {

    this._setupRefresh(false, { tree: true, body: true, states: true });

    vscode.window.showInformationMessage('TODO: Implement minibuffer');

    this.launchRefresh();

    // if choice made and command executes, replace 'true' with command output if any
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214202759.1">public editHeadline(p_node?: LeoNode, p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

    this._setupRefresh(!!p_fromOutline, { tree: true, states: true });

    vscode.window.showInformationMessage('TODO: Implement editHeadline' +
        " called from " +
        (p_fromOutline ? "outline" : "body") +
        " operate on " +
        (p_node ? p_node!.label : "the selected node")
    );

    this.launchRefresh();

    // if edited and accepted
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214202800.1">public insertNode(p_node?: LeoNode, p_fromOutline?: boolean, p_interrupt?: boolean): Thenable&lt;unknown&gt; {

    this._setupRefresh(!!p_fromOutline, { tree: true, states: true });

    vscode.window.showInformationMessage('TODO: Implement insertNode' +
        " called from " +
        (p_fromOutline ? "outline" : "body") +
        (p_interrupt ? " as interrupt " : "") +
        " operate on " +
        (p_node ? p_node!.label : "the selected node")
    );

    this.launchRefresh();

    // if typed, accepted and inserted
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214202802.1">public changeMark(p_mark: boolean, p_node?: LeoNode, p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

    this._setupRefresh(!!p_fromOutline, { tree: true });

    vscode.window.showInformationMessage('TODO: Implement changeMark' +
        " called from " +
        (p_fromOutline ? "outline" : "body") +
        (p_mark ? " as mark " : "as unmark") +
        " operate on " +
        (p_node ? p_node!.label : "the selected node")
    );

    this.launchRefresh();

    return Promise.resolve(true);

}

</t>
<t tx="felix.20201214205159.1">@language json
@tabwidth -2
{
  "name": "leojs",
  "displayName": "Leo Editor for Visual Studio Code",
  "description": "Leo, the literate editor with outline extension for Visual Studio Code.",
  "version": "0.1.0",
  "publisher": "boltex",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/boltex/leointeg"
  },
  "engines": {
    "vscode": "^1.52.0"
  },
  "keywords": [
    "leo",
    "literate",
    "editor",
    "outline",
    "programming"
  ],
  "categories": [
    "Other"
  ],
  "icon": "resources/leoapp128px.png",
  "galleryBanner": {
    "color": "#fffbdc",
    "theme": "light"
  },
  "activationEvents": [
    "*"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    &lt;&lt; contributes &gt;&gt;
  },
  "scripts": {
    &lt;&lt; scripts &gt;&gt;
  },
  "devDependencies": {
    &lt;&lt; devDependencies &gt;&gt;
  },
  "dependencies": {
    &lt;&lt; dependencies &gt;&gt;
  }
}
</t>
<t tx="felix.20201214205159.10">{
  "command": "leojs.openLeoFile",
  "title": "Open Leo File",
  "category": "Leo",
  "icon": {
    "light": "resources/light/folder.svg",
    "dark": "resources/dark/folder.svg"
  }
},
{
  "command": "leojs.recentLeoFiles",
  "category": "Leo",
  "title": "Recent Files"
},
{
  "command": "leojs.switchLeoFile",
  "title": "Switch Leo File",
  "category": "Leo",
  "icon": {
    "light": "resources/light/switch.svg",
    "dark": "resources/dark/switch.svg"
  }
},
{
  "command": "leojs.newLeoFile",
  "title": "New Leo File",
  "category": "Leo",
  "icon": {
    "light": "resources/light/new-file.svg",
    "dark": "resources/dark/new-file.svg"
  }
},
{
  "command": "leojs.closeLeoFile",
  "title": "Close Leo File",
  "category": "Leo",
  "icon": {
    "light": "resources/light/close.svg",
    "dark": "resources/dark/close.svg"
  }
},
{
  "command": "leojs.saveLeoFile",
  "category": "Leo",
  "title": "Save Leo File",
  "icon": {
    "light": "resources/light/save.svg",
    "dark": "resources/dark/save.svg"
  }
},
{
  "command": "leojs.saveLeoFileFromOutline",
  "category": "Leo",
  "title": "Save Leo File",
  "icon": {
    "light": "resources/light/save.svg",
    "dark": "resources/dark/save.svg"
  }
},
{
  "command": "leojs.saveAsLeoFile",
  "category": "Leo",
  "title": "Save Leo File as...",
  "icon": {
    "light": "resources/light/save-as.svg",
    "dark": "resources/dark/save-as.svg"
  }
},
{
  "command": "leojs.refreshFromDisk",
  "category": "Leo",
  "title": "Refresh from Disk"
},
{
  "command": "leojs.refreshFromDiskSelection",
  "category": "Leo",
  "title": "Refresh from Disk"
},
{
  "command": "leojs.refreshFromDiskSelectionFromOutline",
  "category": "Leo",
  "title": "Refresh from Disk"
},
{
  "command": "leojs.gitDiff",
  "category": "Leo",
  "title": "Git Diff"
},
</t>
<t tx="felix.20201214205159.11">{
  "command": "leojs.openAside",
  "category": "Leo",
  "title": "Open to the Side"
},
{
  "command": "leojs.contractAll",
  "category": "Leo",
  "title": "Contract All",
  "icon": {
    "light": "resources/light/collapse.svg",
    "dark": "resources/dark/collapse.svg"
  }
},
{
  "command": "leojs.contractAllFromOutline",
  "category": "Leo",
  "title": "Contract All",
  "icon": {
    "light": "resources/light/collapse.svg",
    "dark": "resources/dark/collapse.svg"
  }
},
</t>
<t tx="felix.20201214205159.12">{
  "command": "leojs.editHeadline",
  "category": "Leo",
  "title": "Edit Headline",
  "icon": {
    "light": "resources/light/edit.svg",
    "dark": "resources/dark/edit.svg"
  }
},
{
  "command": "leojs.editSelectedHeadline",
  "category": "Leo",
  "title": "Edit Headline"
},
{
  "command": "leojs.editSelectedHeadlineFromOutline",
  "category": "Leo",
  "title": "Edit Headline"
},
</t>
<t tx="felix.20201214205159.13">{
  "command": "leojs.mark",
  "category": "Leo",
  "title": "Mark",
  "icon": {
    "light": "resources/light/mark.svg",
    "dark": "resources/dark/mark.svg"
  }
},
{
  "command": "leojs.markSelection",
  "category": "Leo",
  "title": "Mark"
},
{
  "command": "leojs.markSelectionFromOutline",
  "category": "Leo",
  "title": "Mark"
},
{
  "command": "leojs.unmark",
  "category": "Leo",
  "title": "Unmark",
  "icon": {
    "light": "resources/light/unmark.svg",
    "dark": "resources/dark/unmark.svg"
  }
},
{
  "command": "leojs.unmarkSelection",
  "category": "Leo",
  "title": "Unmark"
},
{
  "command": "leojs.unmarkSelectionFromOutline",
  "category": "Leo",
  "title": "Unmark"
},
{
  "command": "leojs.unmarkAll",
  "category": "Leo",
  "title": "Unmark All"
},
</t>
<t tx="felix.20201214205159.14">{
  "command": "leojs.copyNode",
  "category": "Leo",
  "title": "Copy Node",
  "icon": {
    "light": "resources/light/clipboard.svg",
    "dark": "resources/dark/clipboard.svg"
  }
},
{
  "command": "leojs.copyNodeSelection",
  "category": "Leo",
  "title": "Copy Node"
},
{
  "command": "leojs.cutNode",
  "category": "Leo",
  "title": "Cut Node"
},
{
  "command": "leojs.cutNodeSelection",
  "category": "Leo",
  "title": "Cut Node"
},
{
  "command": "leojs.cutNodeSelectionFromOutline",
  "category": "Leo",
  "title": "Cut Node"
},
{
  "command": "leojs.pasteNode",
  "category": "Leo",
  "title": "Paste Node"
},
{
  "command": "leojs.pasteNodeAtSelection",
  "category": "Leo",
  "title": "Paste Node"
},
{
  "command": "leojs.pasteNodeAtSelectionFromOutline",
  "category": "Leo",
  "title": "Paste Node"
},
{
  "command": "leojs.pasteNodeAsClone",
  "category": "Leo",
  "title": "Paste Node as Clone"
},
{
  "command": "leojs.pasteNodeAsCloneAtSelection",
  "category": "Leo",
  "title": "Paste Node as Clone"
},
{
  "command": "leojs.pasteNodeAsCloneAtSelectionFromOutline",
  "category": "Leo",
  "title": "Paste Node as Clone"
},
{
  "command": "leojs.delete",
  "category": "Leo",
  "title": "Delete",
  "icon": {
    "light": "resources/light/close.svg",
    "dark": "resources/dark/close.svg"
  }
},
{
  "command": "leojs.deleteSelection",
  "category": "Leo",
  "title": "Delete Node"
},
{
  "command": "leojs.deleteSelectionFromOutline",
  "category": "Leo",
  "title": "Delete Node"
},
</t>
<t tx="felix.20201214205159.15">{
  "command": "leojs.extract",
  "category": "Leo",
  "title": "Extract"
},
{
  "command": "leojs.extractNames",
  "category": "Leo",
  "title": "Extract Names"
},
</t>
<t tx="felix.20201214205159.16">{
  "command": "leojs.moveOutlineDown",
  "category": "Leo",
  "title": "Move Outline Down",
  "icon": {
    "light": "resources/light/arrow-down.svg",
    "dark": "resources/dark/arrow-down.svg"
  }
},
{
  "command": "leojs.moveOutlineDownSelection",
  "category": "Leo",
  "title": "Move Outline Down"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "category": "Leo",
  "title": "Move Outline Down"
},
{
  "command": "leojs.moveOutlineLeft",
  "category": "Leo",
  "title": "Move Outline Left",
  "icon": {
    "light": "resources/light/arrow-left.svg",
    "dark": "resources/dark/arrow-left.svg"
  }
},
{
  "command": "leojs.moveOutlineLeftSelection",
  "category": "Leo",
  "title": "Move Outline Left"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "category": "Leo",
  "title": "Move Outline Left"
},
{
  "command": "leojs.moveOutlineRight",
  "category": "Leo",
  "title": "Move Outline Right",
  "icon": {
    "light": "resources/light/arrow-right.svg",
    "dark": "resources/dark/arrow-right.svg"
  }
},
{
  "command": "leojs.moveOutlineRightSelection",
  "category": "Leo",
  "title": "Move Outline Right"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "category": "Leo",
  "title": "Move Outline Right"
},
{
  "command": "leojs.moveOutlineUp",
  "category": "Leo",
  "title": "Move Outline Up",
  "icon": {
    "light": "resources/light/arrow-up.svg",
    "dark": "resources/dark/arrow-up.svg"
  }
},
{
  "command": "leojs.moveOutlineUpSelection",
  "category": "Leo",
  "title": "Move Outline Up"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "category": "Leo",
  "title": "Move Outline Up"
},
</t>
<t tx="felix.20201214205159.17">{
  "command": "leojs.insertNode",
  "category": "Leo",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.insertNodeSelection",
  "category": "Leo",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.insertNodeSelectionFromOutline",
  "category": "Leo",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.insertNodeSelectionInterrupt",
  "category": "Leo",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.cloneNode",
  "category": "Leo",
  "title": "Clone Node",
  "icon": {
    "light": "resources/light/link.svg",
    "dark": "resources/dark/link.svg"
  }
},
{
  "command": "leojs.cloneNodeSelection",
  "category": "Leo",
  "title": "Clone Node"
},
{
  "command": "leojs.cloneNodeSelectionFromOutline",
  "category": "Leo",
  "title": "Clone Node"
},
{
  "command": "leojs.promote",
  "category": "Leo",
  "title": "Promote Children"
},
{
  "command": "leojs.promoteSelection",
  "category": "Leo",
  "title": "Promote Children"
},
{
  "command": "leojs.promoteSelectionFromOutline",
  "category": "Leo",
  "title": "Promote Children"
},
{
  "command": "leojs.demote",
  "category": "Leo",
  "title": "Demote Siblings"
},
{
  "command": "leojs.demoteSelection",
  "category": "Leo",
  "title": "Demote Siblings"
},
{
  "command": "leojs.demoteSelectionFromOutline",
  "category": "Leo",
  "title": "Demote Siblings"
},
{
  "command": "leojs.sortChildrenSelection",
  "category": "Leo",
  "title": "Sort Children"
},
{
  "command": "leojs.sortChildrenSelectionFromOutline",
  "category": "Leo",
  "title": "Sort Children"
},
{
  "command": "leojs.sortSiblingsSelection",
  "category": "Leo",
  "title": "Sort Siblings"
},
{
  "command": "leojs.sortSiblingsSelectionFromOutline",
  "category": "Leo",
  "title": "Sort Siblings"
},
</t>
<t tx="felix.20201214205159.18">{
  "command": "leojs.gotoFirstVisible",
  "category": "Leo",
  "title": "Goto First Visible"
},
{
  "command": "leojs.gotoLastVisible",
  "category": "Leo",
  "title": "Goto Last Visible"
},
{
  "command": "leojs.pageUp",
  "category": "Leo",
  "title": "Page Up"
},
{
  "command": "leojs.pageDown",
  "category": "Leo",
  "title": "Page Down"
},
{
  "command": "leojs.gotoLastSibling",
  "category": "Leo",
  "title": "Goto Last Sibling"
},
{
  "command": "leojs.gotoNextVisible",
  "category": "Leo",
  "title": "Goto Next Visible"
},
{
  "command": "leojs.gotoPrevVisible",
  "category": "Leo",
  "title": "Goto Prev Visible"
},
{
  "command": "leojs.contractOrGoLeft",
  "category": "Leo",
  "title": "Contract Or Go Left"
},
{
  "command": "leojs.expandAndGoRight",
  "category": "Leo",
  "title": "Expand And Go Right"
},
{
  "command": "leojs.gotoNextMarked",
  "category": "Leo",
  "title": "Goto Next Marked"
},
{
  "command": "leojs.gotoNextClone",
  "category": "Leo",
  "title": "Goto Next Clone"
},
{
  "command": "leojs.gotoNextCloneSelection",
  "category": "Leo",
  "title": "Goto Next Clone"
},
{
  "command": "leojs.gotoNextCloneSelectionFromOutline",
  "category": "Leo",
  "title": "Goto Next Clone"
},
</t>
<t tx="felix.20201214205159.19">{
  "command": "leojs.hoistNode",
  "category": "Leo",
  "title": "Hoist"
},
{
  "command": "leojs.hoistSelection",
  "category": "Leo",
  "title": "Hoist"
},
{
  "command": "leojs.hoistSelectionFromOutline",
  "category": "Leo",
  "title": "Hoist"
},
{
  "command": "leojs.deHoist",
  "category": "Leo",
  "title": "De-Hoist",
  "icon": {
    "light": "resources/light/dehoist.svg",
    "dark": "resources/dark/dehoist.svg"
  }
},
{
  "command": "leojs.deHoistFromOutline",
  "category": "Leo",
  "title": "De-Hoist",
  "icon": {
    "light": "resources/light/dehoist.svg",
    "dark": "resources/dark/dehoist.svg"
  }
},
</t>
<t tx="felix.20201214205159.2">@others
</t>
<t tx="felix.20201214205159.20">{
  "command": "leojs.undo",
  "category": "Leo",
  "title": "Undo",
  "icon": {
    "light": "resources/light/undo.svg",
    "dark": "resources/dark/undo.svg"
  }
},
{
  "command": "leojs.undoFromOutline",
  "category": "Leo",
  "title": "Undo",
  "icon": {
    "light": "resources/light/undo.svg",
    "dark": "resources/dark/undo.svg"
  }
},
{
  "command": "leojs.redo",
  "category": "Leo",
  "title": "Redo",
  "icon": {
    "light": "resources/light/redo.svg",
    "dark": "resources/dark/redo.svg"
  }
},
{
  "command": "leojs.redoFromOutline",
  "category": "Leo",
  "title": "Redo",
  "icon": {
    "light": "resources/light/redo.svg",
    "dark": "resources/dark/redo.svg"
  }
},
</t>
<t tx="felix.20201214205159.21">{
  "command": "leojs.cloneFindAll",
  "category": "Leo",
  "title": "Clone Find All"
},
{
  "command": "leojs.cloneFindAllFlattened",
  "category": "Leo",
  "title": "Clone Find All Flattened"
},
{
  "command": "leojs.cloneFindMarked",
  "category": "Leo",
  "title": "Clone Find Marked"
},
{
  "command": "leojs.cloneFindFlattenedMarked",
  "category": "Leo",
  "title": "cffm - Clone Find Flattened Marked"
},
</t>
<t tx="felix.20201214205159.22">{
  "command": "leojs.copyMarked",
  "category": "Leo",
  "title": "Copy Marked"
},
{
  "command": "leojs.diffMarkedNodes",
  "category": "Leo",
  "title": "Diff Marked Nodes"
},
{
  "command": "leojs.markChangedItems",
  "category": "Leo",
  "title": "Mark Changed Items"
},
{
  "command": "leojs.markSubheads",
  "category": "Leo",
  "title": "Mark Subheads"
},
{
  "command": "leojs.cloneMarkedNodes",
  "category": "Leo",
  "title": "Clone Marked Nodes"
},
{
  "command": "leojs.deleteMarkedNodes",
  "category": "Leo",
  "title": "Delete Marked Nodes"
},
{
  "command": "leojs.moveMarkedNodes",
  "category": "Leo",
  "title": "Move Marked Nodes"
},
</t>
<t tx="felix.20201214205159.23">"menus": {
  @others
},
</t>
<t tx="felix.20201214205159.24">"commandPalette": [
 @others
],
</t>
<t tx="felix.20201214205159.25"> {
   "command": "leojs.executeScript",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.minibuffer",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.26"> {
   "command": "leojs.showLogPane",
   "when": "leoReady"
 },
</t>
<t tx="felix.20201214205159.27"> {
   "command": "leojs.openLeoFile",
   "when": "leoReady"
 },
 {
   "command": "leojs.recentLeoFiles",
   "when": "leoReady"
 },
 {
   "command": "leojs.switchLeoFile",
   "when": "leoReady &amp;&amp; leoTreeOpened"
 },
 {
   "command": "leojs.newLeoFile",
   "when": "leoReady"
 },
 {
   "command": "leojs.closeLeoFile",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.saveLeoFile",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.saveAsLeoFile",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.refreshFromDiskSelection",
   "when": "leoTreeOpened &amp;&amp; leoAtFile"
 },
 {
   "command": "leojs.gitDiff",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.28"> {
   "command": "leojs.contractAll",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.29"> {
   "command": "leojs.editSelectedHeadline",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.3">"viewsContainers": {
  "activitybar": [
    {
      "id": "leojsView",
      "title": "Leo",
      "icon": "resources/icon.svg"
    }
  ]
},
</t>
<t tx="felix.20201214205159.30"> {
   "command": "leojs.markSelection",
   "when": "leoTreeOpened &amp;&amp; !leoMarked"
 },
 {
   "command": "leojs.unmarkSelection",
   "when": "leoTreeOpened &amp;&amp; leoMarked"
 },
 {
   "command": "leojs.unmarkAll",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.31"> {
   "command": "leojs.copyNodeSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.cutNodeSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.pasteNodeAtSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.pasteNodeAsCloneAtSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.deleteSelection",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.32"> {
   "command": "leojs.extract",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.extractNames",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.33"> {
   "command": "leojs.moveOutlineDownSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.moveOutlineLeftSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.moveOutlineRightSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.moveOutlineUpSelection",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.34"> {
   "command": "leojs.insertNodeSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.cloneNodeSelection",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.promoteSelection",
   "when": "leoTreeOpened &amp;&amp; leoCanPromote"
 },
 {
   "command": "leojs.demoteSelection",
   "when": "leoTreeOpened &amp;&amp; leoCanDemote"
 },
 {
   "command": "leojs.sortChildrenSelection",
   "when": "leoTreeOpened &amp;&amp; leoChild"
 },
 {
   "command": "leojs.sortChildrenSelectionFromOutline",
   "when": "leoTreeOpened &amp;&amp; leoChild"
 },
 {
   "command": "leojs.sortSiblingsSelection",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.35"> {
   "command": "leojs.gotoNextMarked",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.gotoNextCloneSelection",
   "when": "leoTreeOpened &amp;&amp; leoCloned"
 },
</t>
<t tx="felix.20201214205159.36"> {
   "command": "leojs.hoistSelection",
   "when": "leoTreeOpened &amp;&amp; !leoRoot"
 },
 {
   "command": "leojs.deHoist",
   "when": "leoTreeOpened &amp;&amp; leoCanDehoist"
 },
</t>
<t tx="felix.20201214205159.37"> {
   "command": "leojs.undo",
   "when": "leoTreeOpened &amp;&amp; leoCanUndo"
 },
 {
   "command": "leojs.redo",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.38"> {
   "command": "leojs.cloneFindAll",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.cloneFindAllFlattened",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.cloneFindMarked",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.cloneFindFlattenedMarked",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.39"> {
   "command": "leojs.copyMarked",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.diffMarkedNodes",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.markChangedItems",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.markSubheads",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.cloneMarkedNodes",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.deleteMarkedNodes",
   "when": "leoTreeOpened"
 },
 {
   "command": "leojs.moveMarkedNodes",
   "when": "leoTreeOpened"
 },
</t>
<t tx="felix.20201214205159.4">"views": {
  "explorer": [
    {
      "id": "leojsExplorer",
      "name": "Leo Outline",
      "contextualTitle": "Leo"
    },
    {
      "id": "leoDocumentsExplorer",
      "name": "Leo Documents",
      "contextualTitle": "Leo"
    },
    {
      "id": "leoButtonsExplorer",
      "name": "Leo Buttons",
      "contextualTitle": "Leo"
    }
  ],
  "leojsView": [
    {
      "id": "leojs",
      "contextualTitle": "Leo",
      "name": "Outline"
    },
    {
      "id": "leoDocuments",
      "contextualTitle": "Leo",
      "name": "Documents"
    },
    {
      "id": "leoButtons",
      "contextualTitle": "Leo",
      "name": "Buttons"
    }
  ]
},
</t>
<t tx="felix.20201214205159.40">@others
</t>
<t tx="felix.20201214205159.41"> {
   "command": "leojs.test",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.42"> {
   "command": "leojs.removeButton",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.43"> {
   "command": "leojs.showBody",
   "when": "false"
 },
 {
   "command": "leojs.showOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.44"> {
   "command": "leojs.saveLeoFileFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.refreshFromDisk",
   "when": "false"
 },
 {
   "command": "leojs.refreshFromDiskSelectionFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.45"> {
   "command": "leojs.openAside",
   "when": "false"
 },
 {
   "command": "leojs.contractAllFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.46"> {
   "command": "leojs.editHeadline",
   "when": "false"
 },
 {
   "command": "leojs.editSelectedHeadlineFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.47"> {
   "command": "leojs.mark",
   "when": "false"
 },
 {
   "command": "leojs.markSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.unmark",
   "when": "false"
 },
 {
   "command": "leojs.unmarkSelectionFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.48"> {
   "command": "leojs.copyNode",
   "when": "false"
 },
 {
   "command": "leojs.cutNode",
   "when": "false"
 },
 {
   "command": "leojs.cutNodeSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.pasteNode",
   "when": "false"
 },
 {
   "command": "leojs.pasteNodeAtSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.pasteNodeAsClone",
   "when": "false"
 },
 {
   "command": "leojs.pasteNodeAsCloneAtSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.delete",
   "when": "false"
 },
 {
   "command": "leojs.deleteSelectionFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.49"> {
   "command": "leojs.moveOutlineDown",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineDownSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineLeft",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineLeftSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineRight",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineRightSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineUp",
   "when": "false"
 },
 {
   "command": "leojs.moveOutlineUpSelectionFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.5">"viewsWelcome": [
  {
    "view": "leojs",
    "contents": "[Open Leo File](command:leojs.openLeoFile)\n[Create Leo File](command:leojs.openLeoFile)",
    "when": "leoReady &amp;&amp; !leoTreeOpened"
  },
  {
    "view": "leojsExplorer",
    "contents": "[Open Leo File](command:leojs.openLeoFile)\n[Create Leo File](command:leojs.openLeoFile)",
    "when": "leoReady &amp;&amp; !leoTreeOpened"
  },
  {
    "view": "leoDocuments",
    "contents": "There are no Leo files currently opened",
    "when": "leoReady &amp;&amp; !leoTreeOpened"
  },
  {
    "view": "leoDocumentsExplorer",
    "contents": "There are no Leo files currently opened",
    "when": "leoReady &amp;&amp; !leoTreeOpened"
  },
  {
    "view": "leoButtons",
    "contents": "There are no Leo files currently opened",
    "when": "leoReady &amp;&amp; !leoTreeOpened"
  },
  {
    "view": "leoButtonsExplorer",
    "contents": "There are no Leo files currently opened",
    "when": "leoReady &amp;&amp; !leoTreeOpened"
  },
  {
    "view": "leoButtons",
    "contents": "There are no @buttons in this outline",
    "when": "leoReady &amp;&amp; leoTreeOpened"
  },
  {
    "view": "leoButtonsExplorer",
    "contents": "There are no @buttons in this outline",
    "when": "leoReady &amp;&amp; leoTreeOpened"
  }
],
</t>
<t tx="felix.20201214205159.50"> {
   "command": "leojs.insertNode",
   "when": "false"
 },
 {
   "command": "leojs.insertNodeSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.insertNodeSelectionInterrupt",
   "when": "false"
 },
 {
   "command": "leojs.cloneNode",
   "when": "false"
 },
 {
   "command": "leojs.cloneNodeSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.promote",
   "when": "false"
 },
 {
   "command": "leojs.promoteSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.demote",
   "when": "false"
 },
 {
   "command": "leojs.demoteSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.sortSiblingsSelectionFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.51"> {
   "command": "leojs.gotoNextClone",
   "when": "false"
 },
 {
   "command": "leojs.gotoNextCloneSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.gotoFirstVisible",
   "when": "false"
 },
 {
   "command": "leojs.gotoLastVisible",
   "when": "false"
 },
 {
   "command": "leojs.gotoLastSibling",
   "when": "false"
 },
 {
   "command": "leojs.gotoNextVisible",
   "when": "false"
 },
 {
   "command": "leojs.gotoPrevVisible",
   "when": "false"
 },
 {
   "command": "leojs.contractOrGoLeft",
   "when": "false"
 },
 {
   "command": "leojs.expandAndGoRight",
   "when": "false"
 },
 {
   "command": "leojs.pageUp",
   "when": "false"
 },
 {
   "command": "leojs.pageDown",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.52"> {
   "command": "leojs.hoistNode",
   "when": "false"
 },
 {
   "command": "leojs.hoistSelectionFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.deHoistFromOutline",
   "when": "false"
 },
</t>
<t tx="felix.20201214205159.53"> {
   "command": "leojs.undoFromOutline",
   "when": "false"
 },
 {
   "command": "leojs.redoFromOutline",
   "when": "false"
 }
</t>
<t tx="felix.20201214205159.54">"explorer/context": [
  {
    "command": "leojs.openLeoFile",
    "when": "resourceScheme == file &amp;&amp; resourceExtname == .leo",
    "group": "navigation@1"
  }
],
</t>
<t tx="felix.20201214205159.55">"view/title": [
  {
    "command": "leojs.openLeoFile",
    "when": "view =~ /leoDocuments/ &amp;&amp; leoReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.newLeoFile",
    "when": "view =~ /leoDocuments/ &amp;&amp; leoReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.openLeoFile",
    "when": "view =~ /leojs/ &amp;&amp; leoReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.newLeoFile",
    "when": "view =~ /leojs/ &amp;&amp; leoReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.saveLeoFileFromOutline",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeOpened &amp;&amp; leoTreeTitled &amp;&amp; leoChanged",
    "group": "navigation@2"
  },
  {
    "command": "leojs.saveAsLeoFile",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeOpened &amp;&amp; !leoTreeTitled",
    "group": "navigation@2"
  },
  {
    "command": "leojs.undoFromOutline",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeOpened &amp;&amp; leoCanUndo",
    "group": "navigation@3"
  },
  {
    "command": "leojs.redoFromOutline",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeOpened &amp;&amp; leoCanRedo",
    "group": "navigation@4"
  },
  {
    "command": "leojs.deHoistFromOutline",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeOpened &amp;&amp; leoCanDehoist",
    "group": "navigation@5"
  },
  {
    "command": "leojs.contractAllFromOutline",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeOpened",
    "group": "navigation@6"
  },
  {
    "command": "leojs.disableLeoTreeNav",
    "when": "view =~ /leojs/ &amp;&amp; leoTreeBrowse"
  },
  {
    "command": "leojs.hideEditOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; showEditOnNodes"
  },
  {
    "command": "leojs.hideAddOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; showAddOnNodes"
  },
  {
    "command": "leojs.hideArrowsOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; showArrowsOnNodes"
  },
  {
    "command": "leojs.hideCopyOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; showCopyOnNodes"
  },
  {
    "command": "leojs.hideCloneOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; showCloneOnNodes"
  },
  {
    "command": "leojs.hideMarkOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; showMarkOnNodes"
  },
  {
    "command": "leojs.enableLeoTreeNav",
    "when": "view =~ /leojs/ &amp;&amp; !leoTreeBrowse"
  },
  {
    "command": "leojs.showEditOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; !showEditOnNodes"
  },
  {
    "command": "leojs.showAddOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; !showAddOnNodes"
  },
  {
    "command": "leojs.showArrowsOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; !showArrowsOnNodes"
  },
  {
    "command": "leojs.showCopyOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; !showCopyOnNodes"
  },
  {
    "command": "leojs.showCloneOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; !showCloneOnNodes"
  },
  {
    "command": "leojs.showMarkOnNodes",
    "when": "view =~ /leojs/ &amp;&amp; !showMarkOnNodes"
  }
],
</t>
<t tx="felix.20201214205159.56">"view/item/context": [
  @others
]
</t>
<t tx="felix.20201214205159.57">{
  "command": "leojs.editHeadline",
  "when": "showEditOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@1"
},
</t>
<t tx="felix.20201214205159.58">{
  "command": "leojs.insertNode",
  "when": "showAddOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@2"
},
</t>
<t tx="felix.20201214205159.59">{
  "command": "leojs.moveOutlineDown",
  "when": "showArrowsOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@3"
},
{
  "command": "leojs.moveOutlineLeft",
  "when": "showArrowsOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@3"
},
{
  "command": "leojs.moveOutlineRight",
  "when": "showArrowsOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@3"
},
{
  "command": "leojs.moveOutlineUp",
  "when": "showArrowsOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@3"
},
</t>
<t tx="felix.20201214205159.6">"commands": [
  @others
],
</t>
<t tx="felix.20201214205159.60">{
  "command": "leojs.copyNode",
  "when": "showCopyOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@4"
},
{
  "command": "leojs.cloneNode",
  "when": "showCloneOnNodes &amp;&amp; viewItem =~ /leoNode/",
  "group": "inline@4"
},
</t>
<t tx="felix.20201214205159.61">{
  "command": "leojs.mark",
  "when": "showMarkOnNodes &amp;&amp; viewItem =~ /leoNodeUnmarked/",
  "group": "inline@5"
},
{
  "command": "leojs.unmark",
  "when": "showMarkOnNodes &amp;&amp; viewItem =~ /leoNodeMarked/",
  "group": "inline@5"
},
</t>
<t tx="felix.20201214205159.62">{
  "command": "leojs.openAside",
  "when": "showOpenAside &amp;&amp; viewItem =~ /leoNode/",
  "group": "leoNodeContext1@1"
},
</t>
<t tx="felix.20201214205159.63">{
  "command": "leojs.hoistNode",
  "when": "viewItem =~ /leoNodeNotRoot/",
  "group": "leoNodeContext1@2"
},
{
  "command": "leojs.deHoist",
  "when": "leoCanDehoist &amp;&amp; viewItem =~ /leoNodeRoot/",
  "group": "leoNodeContext1@2"
},
</t>
<t tx="felix.20201214205159.64">{
  "command": "leojs.refreshFromDisk",
  "when": "viewItem =~ /leoNodeAtFile/",
  "group": "leoNodeContext1@3"
},
</t>
<t tx="felix.20201214205159.65">{
  "command": "leojs.mark",
  "when": "viewItem =~ /leoNodeUnmarked/",
  "group": "leoNodeContext2@1"
},
{
  "command": "leojs.unmark",
  "when": "viewItem =~ /leoNodeMarked/",
  "group": "leoNodeContext2@2"
},
</t>
<t tx="felix.20201214205159.66">{
  "command": "leojs.copyNode",
  "when": "viewItem =~ /leoNode/",
  "group": "leoNodeContext2@3"
},
{
  "command": "leojs.cutNode",
  "when": "viewItem =~ /leoNode/",
  "group": "leoNodeContext2@4"
},
{
  "command": "leojs.pasteNode",
  "when": "viewItem =~ /leoNode/",
  "group": "leoNodeContext2@5"
},
{
  "command": "leojs.pasteNodeAsClone",
  "when": "viewItem =~ /leoNode/",
  "group": "leoNodeContext2@6"
},
{
  "command": "leojs.delete",
  "when": "viewItem =~ /leoNode/",
  "group": "leoNodeContext2@7"
},
{
  "command": "leojs.insertNode",
  "when": "leoTreeOpened &amp;&amp; viewItem =~ /leoNode/",
  "group": "leoNodeContext3@1"
},
{
  "command": "leojs.cloneNode",
  "when": "leoTreeOpened &amp;&amp; viewItem =~ /leoNode/",
  "group": "leoNodeContext3@2"
},
{
  "command": "leojs.gotoNextClone",
  "when": "leoTreeOpened &amp;&amp; viewItem =~ /leoNodeCloned/",
  "group": "leoNodeContext3@3"
}
</t>
<t tx="felix.20201214205159.67">"keybindings": [
  @others
]
</t>
<t tx="felix.20201214205159.68">{
  "command": "leojs.executeScript",
  "key": "ctrl+b",
  "mac": "cmd+b",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.executeScript",
  "key": "ctrl+b",
  "mac": "cmd+b",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.minibuffer",
  "key": "alt+x",
  "when": "leoTreeOpened"
},
</t>
<t tx="felix.20201214205159.69">{
  "command": "leojs.showOutline",
  "key": "alt+t",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.showOutline",
  "key": "ctrl+t",
  "mac": "cmd+t",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.showBody",
  "key": "ctrl+t",
  "mac": "cmd+t",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.showBody",
  "key": "alt+d",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.showBody",
  "key": "tab",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.showBody",
  "key": "enter",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.7">{
  "command": "leojs.test",
  "category": "Leo",
  "title": "Test leojs"
},
</t>
<t tx="felix.20201214205159.70">{
  "command": "leojs.saveLeoFileFromOutline",
  "key": "ctrl+s",
  "mac": "cmd+s",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments/"
},
{
  "command": "leojs.saveLeoFile",
  "key": "ctrl+s",
  "mac": "cmd+s",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
</t>
<t tx="felix.20201214205159.71">{
  "command": "leojs.contractAll",
  "key": "alt+-",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.contractAllFromOutline",
  "key": "alt+-",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
</t>
<t tx="felix.20201214205159.72">{
  "command": "leojs.editSelectedHeadline",
  "key": "ctrl+h",
  "mac": "cmd+h",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.editSelectedHeadlineFromOutline",
  "key": "ctrl+h",
  "mac": "cmd+h",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.73">{
  "command": "leojs.markSelection",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leoTreeOpened &amp;&amp; !leoMarked &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.markSelectionFromOutline",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leoTreeOpened &amp;&amp; !leoMarked &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.unmarkSelection",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leoTreeOpened &amp;&amp; leoMarked &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.unmarkSelectionFromOutline",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leoTreeOpened &amp;&amp; leoMarked &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.74">{
  "command": "leojs.extract",
  "key": "ctrl+shift+d",
  "mac": "cmd+shift+d",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; editorHasSelection &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.extract",
  "key": "ctrl+shift+d",
  "mac": "cmd+shift+d",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.extractNames",
  "key": "ctrl+shift+n",
  "mac": "cmd++shift+n",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; editorHasSelection &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.extractNames",
  "key": "ctrl+shift+n",
  "mac": "cmd+shift+n",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.75">{
  "command": "leojs.moveOutlineDownSelection",
  "key": "ctrl+d",
  "mac": "cmd+d",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineDownSelection",
  "key": "shift+alt+down",
  "mac": "shift+alt+down",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "key": "ctrl+d",
  "mac": "cmd+d",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "key": "shift+down",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "key": "shift+alt+down",
  "mac": "shift+alt+down",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineLeftSelection",
  "key": "ctrl+l",
  "mac": "cmd+l",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineLeftSelection",
  "key": "shift+alt+left",
  "mac": "shift+alt+left",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "key": "ctrl+l",
  "mac": "cmd+l",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "key": "shift+left",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "key": "shift+alt+left",
  "mac": "shift+alt+left",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineRightSelection",
  "key": "ctrl+r",
  "mac": "cmd+r",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineRightSelection",
  "key": "shift+alt+right",
  "mac": "shift+alt+right",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "key": "ctrl+r",
  "mac": "cmd+r",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "key": "shift+right",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "key": "shift+alt+right",
  "mac": "shift+alt+right",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineUpSelection",
  "key": "ctrl+u",
  "mac": "cmd+u",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineUpSelection",
  "key": "shift+alt+up",
  "mac": "shift+alt+up",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "key": "ctrl+u",
  "mac": "cmd+u",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "key": "shift+up",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "key": "shift+alt+up",
  "mac": "shift+alt+up",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.76">{
  "command": "leojs.sortSiblingsSelection",
  "key": "alt+a",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.sortSiblingsSelectionFromOutline",
  "key": "alt+a",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.promoteSelection",
  "key": "ctrl+[BracketLeft]",
  "win": "ctrl+oem_4",
  "linux": "ctrl+[",
  "mac": "cmd+[BracketLeft]",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.promoteSelectionFromOutline",
  "key": "ctrl+[BracketLeft]",
  "win": "ctrl+oem_4",
  "linux": "ctrl+[",
  "mac": "cmd+[BracketLeft]",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.demoteSelection",
  "key": "ctrl+[BracketRight]",
  "win": "ctrl+oem_6",
  "linux": "ctrl+]",
  "mac": "cmd+[BracketRight]",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.demoteSelectionFromOutline",
  "key": "ctrl+[BracketRight]",
  "win": "ctrl+oem_6",
  "linux": "ctrl+]",
  "mac": "cmd+[BracketRight]",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.insertNodeSelection",
  "key": "ctrl+i",
  "mac": "cmd+i",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.insertNodeSelectionFromOutline",
  "key": "ctrl+i",
  "mac": "cmd+i",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.insertNodeSelectionInterrupt",
  "key": "ctrl+i",
  "mac": "cmd+i",
  "when": "leoTreeOpened &amp;&amp; !sideBarFocus &amp;&amp; !editorTextFocus"
},
{
  "command": "leojs.cloneNodeSelection",
  "key": "ctrl+[Backquote]",
  "win": "ctrl+oem_7",
  "linux": "ctrl+'",
  "mac": "cmd+[Backquote]",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.cloneNodeSelectionFromOutline",
  "key": "ctrl+[Backquote]",
  "win": "ctrl+oem_7",
  "linux": "ctrl+'",
  "mac": "cmd+[Backquote]",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.77">{
  "command": "leojs.cutNodeSelection",
  "key": "ctrl+shift+x",
  "mac": "cmd+shift+x",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.cutNodeSelectionFromOutline",
  "key": "ctrl+shift+x",
  "mac": "cmd+shift+x",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.copyNodeSelection",
  "key": "ctrl+shift+c",
  "mac": "cmd+shift+c",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.copyNodeSelection",
  "key": "ctrl+shift+c",
  "mac": "cmd+shift+c",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.pasteNodeAtSelection",
  "key": "ctrl+shift+v",
  "mac": "cmd+shift+v",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.pasteNodeAtSelectionFromOutline",
  "key": "ctrl+shift+v",
  "mac": "cmd+shift+v",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.deleteSelection",
  "key": "ctrl+shift+backspace",
  "mac": "cmd+shift+backspace",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.deleteSelectionFromOutline",
  "key": "ctrl+shift+backspace",
  "mac": "cmd+shift+backspace",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
</t>
<t tx="felix.20201214205159.78">{
  "command": "leojs.gotoFirstVisible",
  "key": "alt+home",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoLastSibling",
  "key": "alt+end",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoFirstVisible",
  "key": "home",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoLastVisible",
  "key": "end",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.pageUp",
  "key": "pageup",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.pageDown",
  "key": "pagedown",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoNextCloneSelectionFromOutline",
  "key": "alt+n",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoNextCloneSelection",
  "key": "alt+n",
  "when": "leoTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.gotoNextVisible",
  "key": "down",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoNextVisible",
  "key": "alt+down",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.gotoNextVisible",
  "key": "alt+down",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.gotoPrevVisible",
  "key": "up",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.gotoPrevVisible",
  "key": "alt+up",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.gotoPrevVisible",
  "key": "alt+up",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection  &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.contractOrGoLeft",
  "key": "left",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.contractOrGoLeft",
  "key": "alt+left",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.contractOrGoLeft",
  "key": "alt+left",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
},
{
  "command": "leojs.expandAndGoRight",
  "key": "right",
  "when": "leoTreeBrowse &amp;&amp; leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs/"
},
{
  "command": "leojs.expandAndGoRight",
  "key": "alt+right",
  "when": "leoTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojs|leoDocuments|leoButtons/"
},
{
  "command": "leojs.expandAndGoRight",
  "key": "alt+right",
  "when": "leoTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leo"
}
</t>
<t tx="felix.20201214205159.79">"vscode:prepublish": "npm run package",
"compile": "webpack --devtool nosources-source-map --config ./build/node-extension.webpack.config.js",
"watch": "webpack --watch --devtool nosources-source-map --info-verbosity verbose --config ./build/node-extension.webpack.config.js",
"package": "webpack --mode production --config ./build/node-extension.webpack.config.js",
"test-compile": "tsc -p ./",
"test-watch": "tsc -watch -p ./",
"pretest": "npm run test-compile &amp;&amp; npm run lint",
"lint": "tslint -p ./",
"OldLint": "eslint src --ext ts",
"test": "node ./out/test/runTest.js"
</t>
<t tx="felix.20201214205159.8">{
  "command": "leojs.executeScript",
  "category": "Leo",
  "title": "Execute Script"
},
{
  "command": "leojs.minibuffer",
  "category": "Leo",
  "title": "Minibuffer"
},
{
  "command": "leojs.removeButton",
  "category": "Leo",
  "title": "Remove Button"
},
</t>
<t tx="felix.20201214205159.80">"@types/vscode": "^1.52.0",
"@types/glob": "^7.1.3",
"@types/mocha": "^8.0.0",
"@types/node": "^12.11.7",
"eslint": "^7.9.0",
"@typescript-eslint/eslint-plugin": "^4.1.1",
"@typescript-eslint/parser": "^4.1.1",
"glob": "^7.1.6",
"mocha": "^8.1.3",
"typescript": "^4.0.2",
"vscode-test": "^1.4.0",
"ts-loader": "^8.0.3",
"tslint": "^6.1.3",
"webpack": "^4.44.1",
"webpack-cli": "^3.3.12"
</t>
<t tx="felix.20201214205159.81">"@types/debounce": "^1.2.0",
"debounce": "^1.2.0",
"axios": "^0.19.0"
</t>
<t tx="felix.20201214205159.9">{
  "command": "leojs.showBody",
  "category": "Leo",
  "title": "Focus to Body"
},
{
  "command": "leojs.showOutline",
  "category": "Leo",
  "title": "Focus to Tree"
},
{
  "command": "leojs.showLogPane",
  "category": "Leo",
  "title": "Show Log Pane"
},
</t>
<t tx="felix.20201214211645.1">/**
* * Opens an an editor for the currently selected node: "this.bodyUri". If already opened, this just 'reveals' it
* @param p_aside Flag for opening the editor beside any currently opened and focused editor
* @param p_preserveFocus flag that when true will stop the editor from taking focus once opened
*/
public showBody(p_aside: boolean, p_preserveFocus?: boolean): Thenable&lt;vscode.TextEditor | undefined&gt; {
    const w_showOptions: vscode.TextDocumentShowOptions = p_aside ?
        {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: p_preserveFocus, // an optional flag that when true will stop the editor from taking focus
            preview: true // should text document be in preview only? set false for fully opened
            // selection is instead set when the GET_BODY_STATES above resolves
        } : {
            viewColumn: this._bodyMainSelectionColumn ? this._bodyMainSelectionColumn : 1, // view column in which the editor should be shown
            preserveFocus: p_preserveFocus, // an optional flag that when true will stop the editor from taking focus
            preview: false // should text document be in preview only? set false for fully opened
            // selection is instead set when the GET_BODY_STATES above resolves
        };

    // TODO : THIS IS PLACEHOLDER CODE
    if (this._bodyTextDocument) {
        return vscode.window.showTextDocument(this._bodyTextDocument, w_showOptions);
    } else {
        console.log('showBody: no _bodyTextDocument set to show');

        return Promise.resolve(undefined);
    }
}

</t>
<t tx="felix.20201214211655.1">public showLogPane(): Thenable&lt;unknown&gt; {
    vscode.window.showInformationMessage('TODO: Implement showLogPane');

    // if shown
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211706.1">/**
 * Test/Dummy command
 * @returns Thenable from the tested functionality
 */
public test(): Thenable&lt;unknown&gt; {
    vscode.window.showInformationMessage("Test called!");
    console.log("Test called!");
    return Promise.resolve(true);
}

</t>
<t tx="felix.20201214211742.1">public clickAtButton(p_node: LeoButtonNode): Thenable&lt;unknown&gt; {

    this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

    vscode.window.showInformationMessage('TODO: Implement clickAtButton' +
        " button: " + p_node.label);

    this.launchRefresh();

    // if edited and accepted
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211744.1">public removeAtButton(p_node: LeoButtonNode): Thenable&lt;unknown&gt; {

    this._setupRefresh(false, { buttons: true });

    vscode.window.showInformationMessage('TODO: Implement removeAtButton' +
        " button: " + p_node.label);

    this.launchRefresh();

    // if edited and accepted
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211830.1">public closeLeoFile(): Thenable&lt;unknown&gt; {

    this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

    vscode.window.showInformationMessage('TODO: Implement closeLeoFile');

    const w_fakeTotalOpened = 1;

    if (w_fakeTotalOpened) {
        this.launchRefresh();
    } else {
        this._setupNoOpenedLeoDocument();
    }

    // if closed
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if problem
}

</t>
<t tx="felix.20201214211831.1">public newLeoFile(): Thenable&lt;unknown&gt; {

    vscode.window.showInformationMessage('TODO: Implement newLeoFile');

    const w_fakeOpenedFileInfo: any = undefined;
    this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

    // if created
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211832.1">public openLeoFile(p_uri?: vscode.Uri): Thenable&lt;unknown&gt; {

    vscode.window.showInformationMessage('TODO: Implement openLeoFile' +
        (p_uri ? " path: " + p_uri.fsPath : ""));

    // if opened
    const w_fakeOpenedFileInfo: any = undefined;
    this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211834.1">public showRecentLeoFiles(): Thenable&lt;unknown&gt; {
    vscode.window.showInformationMessage('TODO: Implement showRecentLeoFiles');

    // if shown, chosen and opened
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211835.1">public saveAsLeoFile(p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

    this._setupRefresh(!!p_fromOutline, { tree: true, states: true, documents: true });

    vscode.window.showInformationMessage('TODO: Implement saveAsLeoFile' +
        " called from " +
        (p_fromOutline ? "outline" : "body")
    );

    this.launchRefresh();

    // if saved
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211836.1">public saveLeoFile(p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

    this._setupRefresh(!!p_fromOutline, { tree: true, states: true, documents: true });

    vscode.window.showInformationMessage('TODO: Implement saveLeoFile' +
        " called from " +
        (p_fromOutline ? "outline" : "body")
    );

    this.launchRefresh();

    // if saved
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211837.1">public switchLeoFile(): Thenable&lt;unknown&gt; {

    vscode.window.showInformationMessage('TODO: Implement switchLeoFile');

    // vscode.window.showQuickPick(w_entries, w_pickOptions);
    //     then
    // return Promise.resolve(this.selectOpenedLeoDocument(p_chosenDocument.value));

    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214211839.1">public selectOpenedLeoDocument(p_index: number): Thenable&lt;unknown&gt; {

    vscode.window.showInformationMessage('TODO: Implement selectOpenedLeoDocument' +
        " index: " + p_index);

    const w_fakeOpenedFileInfo: any = undefined;
    this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

    // if selected and opened
    return Promise.resolve(true);

    // return Promise.resolve(undefined); // if cancelled
}

</t>
<t tx="felix.20201214233119.1">// * General 'Leo is ready' state
private _leoReady: boolean = false;
get leoReady(): boolean {
    return this._leoReady;
}
set leoReady(p_value: boolean) {
    this._leoReady = p_value;
    utils.setContext(Constants.CONTEXT_FLAGS.LEO_READY, p_value);
}

</t>
<t tx="felix.20201215224237.1">export class Leojs {

    // FAKE model of the outline (PNodes are temporary replacement of positions + vnodes)
    // simulates _yieldAllRootChildren from leoInteg's leobridgeserver.py
    public positions: PNode[] = [
        {
            header: "node1",
            body: "node1 body",
            children: [
                {
                    header: "nodeInside1",
                    body: "nodeInside1 body",
                    marked: true,
                    children: []
                }, {
                    header: "nodeInside2",
                    body: "nodeInside2 body",
                    children: []
                },
            ]
        },
        {
            header: "node2selected",
            selected: true,
            body: "", // Empty body should display icon without blue square
            children: []
        },

        {
            header: "@file node3",
            atFile: true,
            body: "node3 body",
            children: []
        },
    ];

    // Fake documents array (rendered in tree view but is just a list - no node relationships)
    public documents: LeoDocument[] = [
        { name: "fakeSelectedDoc1.leo", index: 0, changed: false, selected: true },
        { name: "fakeChangedDoc2.leo", index: 1, changed: true, selected: false },
        { name: "fakeDoc3.leo", index: 2, changed: false, selected: false }
    ];

    // Fake @ buttons array (rendered in tree view but is just a list - no node relationships)
    public atButtons: LeoButton[] = [
        { name: 'script-button', index: 'nullButtonWidget' },
        { name: 'button name 2', index: 'key2' },
        { name: 'button name 3', index: 'key3' }
    ];

    constructor() {
        // insert parent properties in fake positions
        this.positions.forEach(p_position =&gt; {
            // set to undefined at first for root nodes
            this._setPNodeParents(p_position, undefined);
        });
    }

    /**
     * Recursive method to fill the parent properties of fake position-structure
     * @param p_position
     * @param p_parent
     */
    private _setPNodeParents(p_position: PNode, p_parent?: PNode): void {
        p_position.parent = p_parent; // set its parent
        p_position.children.forEach(p_child =&gt; {
            this._setPNodeParents(p_child, p_position);
        });
    }


}
</t>
<t tx="felix.20201215231023.1">// import escape from 'escape-html'
import axios from 'axios'

&lt;&lt; xslTemplate &gt;&gt;

@language javascript
@tabwidth -2
@others

export {getLeoJSON, transformLeoXML, transformLeoXML2XML, transform}

</t>
<t tx="felix.20201215231023.10">function isRelative (url) {
  var ok = true
  if (/^http/.test(url)) {
    ok = false
  }
  return ok
}

</t>
<t tx="felix.20201215231023.11">function getLeoJSON (filename, id) {
  if (filename.indexOf('#') &gt; 0) {
    filename = filename.substring(0, filename.indexOf('#'))
  }
  var p = new Promise((resolve, reject) =&gt; {
    if (!filename.match(/static/) &amp;&amp; isRelative(filename)) {
      // filename = 'static/' + filename
    }
    if (!filename.match(/\.leo$/)) {
      filename = filename + '.leo'
    }
    loadDoc(filename, 'Text')
      .then(xmlString =&gt; {
        return transformLeoXML(xmlString, id)
      })
      .then(data =&gt; {resolve(data)})
  })
  return p
}

</t>
<t tx="felix.20201215231023.12">function transformLeoXML2XML(xmlString, startId, parser) {
  const p = new Promise((resolve, reject) =&gt; {

    let oParser = null
    if (parser) {
      oParser = new parser()
    } else {
      oParser = new DOMParser()
    }
    const xml = oParser.parseFromString(xmlString, 'text/xml')
    const tnodes = xml.getElementsByTagName('t')
    let textItems = {}
    for (let i = 0; i &lt; tnodes.length; i++) {
      let el = tnodes[i]
      let elText = el.textContent
      let a = el.getAttribute('tx')
      a = a.replace(/\./g, '_')
      a = a.replace(/^.*?_/, '')
      if (startId) {
        a = startId + '-' + a
      }
      if (
        (/^@language /.test(elText)) &amp;&amp;
        (!/^@language html/.test(elText)) &amp;&amp;
        (!/^@language md/.test(elText))
      ) {
        // elText = escape(elText)
      }
      textItems[a] = elText
    }
    const vnodes = xml.getElementsByTagName('v')
    let pid
    for (let i = 0; i &lt; vnodes.length; i++) {
      pid = i + 1
      if (startId) {
        pid = startId + '-' + pid
      }
      vnodes[i].setAttribute('id', '"' + pid + '"')
    }
    resolve({xml, textItems})

  })
  return p
}

</t>
<t tx="felix.20201215231023.13">function transformLeoXML2JSON (data, startId, parser, transformer, serializer) {
    const p = new Promise((resolve, reject) =&gt; {
      const xml = data.xml
      const textItems = data.textItems
      transform(xml, xslTemplate, transformer, serializer).then(jsdata =&gt; {
        jsdata = jsdata.replace(/&lt;\?xml version="1\.0" encoding="UTF-8"\?&gt;/,'')
        jsdata = jsdata.replace(/,\s?$/, '') // kludge to get rid of trailing comma
        jsdata = '[' + jsdata + ']'
        jsdata = JSON.parse(jsdata)
        jsdata.forEach(d =&gt; cleanText(d, startId))
        const xdata = {}
        xdata.data = jsdata
        xdata.textItems = textItems
        return (xdata)
      }).then(data =&gt; resolve(data))
    })
    return p
}

</t>
<t tx="felix.20201215231023.14">function transformLeoXML(xmlString, startId, parser, transformer, serializer){
  return transformLeoXML2XML(xmlString, startId, parser)
    .then(data =&gt; transformLeoXML2JSON(data, startId, parser, transformer, serializer))
}

</t>
<t tx="felix.20201215231023.2">@language html
const xslTemplate = `
&lt;xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"&gt;

  &lt;xsl:template match="/"&gt;
    &lt;xsl:apply-templates/&gt;
  &lt;/xsl:template&gt;

  &lt;xsl:template match="v"&gt;
    &lt;xsl:variable name="t" select="@t"/&gt;
    &lt;xsl:variable name="nodeSet" select="//v[@t=$t]"/&gt;
    &lt;xsl:variable name="double_quote"&gt;"&lt;/xsl:variable&gt;
    &lt;xsl:variable name="apos"&gt;'&lt;/xsl:variable&gt;
    {
    "id":  &lt;xsl:value-of select="@id"/&gt;,
    "t":   "&lt;xsl:value-of select="translate(@t,'.','_')"/&gt;",
    "name":"&lt;xsl:value-of select="translate($nodeSet[1]/vh,concat('\',$double_quote),concat('|',$apos))"/&gt;",
    "children":[&lt;xsl:apply-templates select="$nodeSet[1]/v"/&gt;]
    }
    &lt;xsl:if test="position()!=last()"&gt;,&lt;/xsl:if&gt;
  &lt;/xsl:template&gt;

  &lt;xsl:template match="text()"/&gt;

&lt;/xsl:stylesheet&gt;
`

</t>
<t tx="felix.20201215231023.3">function transform (xml, xslString, transformer, serializer) {
  @others
}

</t>
<t tx="felix.20201215231023.4">function serverTransform(resolve, reject) {
  const xmlString = new serializer().serializeToString(xml)
  const config = {
    xslt: xslString,
    source: xmlString,
    result: String,
    props: {
      indent: 'yes'
    }
  }
  transformer.transform(config, (err, result) =&gt; {
    if (err) {
      console.log('ERROR:', err)
      return reject()
    }
    resolve(result)
  })
}

</t>
<t tx="felix.20201215231023.5">function clientTransform(resolve, reject) {
  const oParser = new DOMParser()
  const xsl = oParser.parseFromString(xslString, 'text/xml')
  const xsltProcessor = new XSLTProcessor()
  xsltProcessor.importStylesheet(xsl)
  const resultDocument = xsltProcessor.transformToFragment(xml, document)
  resolve(resultDocument.textContent)
}

const p = new Promise((resolve, reject) =&gt; {
  if (transformer) {
    return serverTransform(resolve, reject)
  } else {
    return clientTransform(resolve, reject)
  }
})
return p

</t>
<t tx="felix.20201215231023.6">function loadDoc (filename) {
  console.log('loading file:', filename)
  var p = new Promise((resolve, reject) =&gt; {
    axios.get(filename)
    @others
  })
  return p
}

</t>
<t tx="felix.20201215231023.7">.then(function (response) {
  resolve(response.data)
})
</t>
<t tx="felix.20201215231023.8">.catch(function (error) {
  console.log(error)
  reject()
})
</t>
<t tx="felix.20201215231023.9">function cleanText(data, startId){
  data.name = data.name.replace(/&lt;&lt;/g, '\u00AB')
  data.name = data.name.replace(/&gt;&gt;/g, '\u00BB')
  data.name = data.name.replace(/'/g, '\x27')
  data.name = data.name.replace(/"/g, '\x22')
  //data.name = escape(data.name)
  data.name = data.name.replace(/&amp;#39;/g,'\x27')
  data.id = data.id + ''; // probably unneeded now
  let children = data.children;
  if (!children) { return }
  for (let i = 0; i &lt; children.length; i++){
    cleanText(children[i], startId)
  }
  data.t = data.t.replace(/^.*?_/,'') // remove file uid
  if (startId) {
    data.t = startId + '-' + data.t + ''
  }
}
/**
 * TODO: move to util, also is in store/index, review logic for relative / subtrees
 * Is url relative
 * @param url {string}
 * @returns {boolean} - if is relative
 */

</t>
<t tx="felix.20201218000931.1">{
  "command": "leojs.enableLeoTreeNav",
  "category": "Leo",
  "title": "Enable Leo Tree Navigation",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.showEditOnNodes",
  "category": "Leo",
  "title": "Show edit-headline",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.showAddOnNodes",
  "category": "Leo",
  "title": "Show Add Node",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.showArrowsOnNodes",
  "category": "Leo",
  "title": "Show move-commands",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.showCopyOnNodes",
  "category": "Leo",
  "title": "Show Copy Node",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.showCloneOnNodes",
  "category": "Leo",
  "title": "Show Clone Node",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.showMarkOnNodes",
  "category": "Leo",
  "title": "Show Mark/Unmark Node",
  "icon": {
    "light": "resources/light/no-check.svg",
    "dark": "resources/dark/no-check.svg"
  }
},
{
  "command": "leojs.disableLeoTreeNav",
  "category": "Leo",
  "title": "Disable Leo Tree Navigation",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
},
{
  "command": "leojs.hideEditOnNodes",
  "category": "Leo",
  "title": "Hide edit-headline",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
},
{
  "command": "leojs.hideAddOnNodes",
  "category": "Leo",
  "title": "Hide Add Node",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
},
{
  "command": "leojs.hideArrowsOnNodes",
  "category": "Leo",
  "title": "Hide move-commands",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
},
{
  "command": "leojs.hideCopyOnNodes",
  "category": "Leo",
  "title": "Hide Copy Node",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
},
{
  "command": "leojs.hideCloneOnNodes",
  "category": "Leo",
  "title": "Hide Clone Node",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
},
{
  "command": "leojs.hideMarkOnNodes",
  "category": "Leo",
  "title": "Hide Mark/Unmark Node",
  "icon": {
    "light": "resources/light/check.svg",
    "dark": "resources/dark/check.svg"
  }
}
</t>
<t tx="felix.20201221015535.1">[CMD.ENABLE_LEO_TREE_NAV, () =&gt; w_leo.toggleSetting(CTX.LEO_TREE_BROWSE, true)],
[CMD.SHOW_EDIT_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_EDIT, true)],
[CMD.SHOW_ADD_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_ADD, true)],
[CMD.SHOW_ARROWS_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_ARROWS, true)],
[CMD.SHOW_COPY_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_COPY, true)],
[CMD.SHOW_CLONE_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_CLONE, true)],
[CMD.SHOW_MARK_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_MARK, true)],

[CMD.DISABLE_LEO_TREE_NAV, () =&gt; w_leo.toggleSetting(CTX.LEO_TREE_BROWSE, false)],
[CMD.HIDE_EDIT_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_EDIT, false)],
[CMD.HIDE_ADD_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_ADD, false)],
[CMD.HIDE_ARROWS_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_ARROWS, false)],
[CMD.HIDE_COPY_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_COPY, false)],
[CMD.HIDE_CLONE_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_CLONE, false)],
[CMD.HIDE_MARK_ON_NODES, () =&gt; w_leo.toggleSetting(CTX.SHOW_MARK, false)],

</t>
<t tx="felix.20201221234735.1">/**
 * Toggles a context value for the 'when' clauses of the available commands in package.json
 * @param p_param String name of the context variable
 * @param p_value Its value to be set
 */
public toggleSetting(p_param: string, p_value: boolean): void {
    utils.setContext(p_param, p_value);
    if (
        (p_param.startsWith("show") || p_param.startsWith("hide")) &amp;&amp;
        this.leoStates.fileOpenedReady
    ) {
        this._refreshOutline(true, RevealType.RevealSelect);
    }
    // keep a copy in fake config until a real config setting class is implemented
    this.config[p_param] = p_value;

}

</t>
<t tx="felix.20201222013904.1">/**
 * * Refreshes the outline. A reveal type can be passed along to specify the reveal type for the selected node
 * @param p_revealType Facultative reveal type to specify type of reveal when the 'selected node' is encountered
 */
private _refreshOutline(p_incrementTreeID: boolean, p_revealType?: RevealType): void {
    if (p_incrementTreeID) {
        this._treeId++; // unused so far in leojs
    }
    if (p_revealType !== undefined) { // To check if selected node should self-select while redrawing whole tree
        this._revealType = p_revealType; // To be read/cleared (in arrayToLeoNodesArray instead of directly by nodes)
    }
    // Force showing last used Leo outline first
    if (this.lastSelectedNode &amp;&amp; !(this._leoTreeExView.visible || this._leoTreeView.visible)) {
        this._lastTreeView.reveal(this.lastSelectedNode.ap)
            .then(() =&gt; {
                this._leoTreeProvider.refreshTreeRoot();
            });
    } else {
        this._leoTreeProvider.refreshTreeRoot();
    }
}

</t>
<t tx="felix.20201227014627.1">/**
 * * Launches refresh for UI components and states (Debounced)
 * @param p_refreshType choose to refresh the outline, or the outline and body pane along with it
 * @param p_fromOutline Signifies that the focus was, and should be brought back to, the outline
 */
public _launchRefresh(): void {
    // Set w_revealType, it will ultimately set this._revealType.
    // Used when finding the OUTLINE's selected node and setting or preventing focus into it
    // Set this._fromOutline. Used when finding the selected node and showing the BODY to set or prevent focus in it

    if (Object.keys(this._refreshType).length) {
        //
        console.log('Has UI to REFRESH!', this._refreshType);

    }


    // this._refreshType = Object.assign({}, p_refreshType);
    // let w_revealType: RevealType;
    // if (p_fromOutline) {
    //     this._fromOutline = true;
    //     w_revealType = RevealType.RevealSelectFocus;
    // } else {
    //     this._fromOutline = false;
    //     w_revealType = RevealType.RevealSelect;
    // }
    // if (this._refreshType.body &amp;&amp;
    //     this._bodyLastChangedDocument &amp;&amp; this._bodyLastChangedDocument.isDirty) {
    //     // When this refresh is launched with 'refresh body' requested, we need to lose any pending edits and save on vscode's side.
    //     this._bodyLastChangedDocument.save(); // Voluntarily save to 'clean' any pending body
    // }
    // // * _focusInterrupt insertNode Override
    // if (this._focusInterrupt) {
    //     // this._focusInterrupt = false; // TODO : Test if reverting this in _gotSelection is 'ok'
    //     w_revealType = RevealType.RevealSelect;
    // }
    // // * Either the whole tree refreshes, or a single tree node is revealed when just navigating
    // if (this._refreshType.tree) {
    //     this._refreshType.tree = false;
    //     this._refreshOutline(true, w_revealType);
    // } else if (this._refreshType.node &amp;&amp; p_ap) {
    //     // * Force single node "refresh" by revealing it, instead of "refreshing" it
    //     this._refreshType.node = false;
    //     const w_node = this.apToLeoNode(p_ap);
    //     this.leoStates.setSelectedNodeFlags(w_node);
    //     this._revealTreeViewNode(w_node, {
    //         select: true, focus: true // FOCUS FORCED TO TRUE always leave focus on tree when navigating
    //     });
    //     if (this._refreshType.body) {
    //         this._refreshType.body = false;
    //         this._tryApplyNodeToBody(w_node, false, true); // ! NEEDS STACK AND THROTTLE!
    //     }
    // }
    this.getStates();
}

</t>
<t tx="felix.20201227155008.1">/**
 * * Setup global refresh options
 * @param p_focusOutline Flag for focus to be placed in outline
 * @param p_refreshType Refresh flags for each UI part
 */
public _setupRefresh(p_focusOutline: boolean, p_refreshType: ReqRefresh): void {
    // Set final "focus-placement" and setup final refresh type, if command requires higher than the one setup so far
    this._fromOutline = p_focusOutline; // set directly
    Object.assign(this._refreshType, p_refreshType); // add all properties without replacing (only 'true' properties)
}

</t>
<t tx="felix.20201227230901.1">/**
 * * Setup leoInteg's UI for having no opened Leo documents
 */
private _setupNoOpenedLeoDocument(): void {
    this.leoStates.fileOpenedReady = false;
    this._bodyTextDocument = undefined;
    this.lastSelectedNode = undefined;
    this._refreshOutline(false, RevealType.NoReveal);
    this.refreshDocumentsPane();
    this._leoButtonsProvider.refreshTreeRoot();
    this.closeBody();
}

</t>
<t tx="felix.20201227230912.1">/**
 * * A Leo file was opened: setup leoInteg's UI accordingly.
 * @param p_openFileResult Returned info about currently opened and editing document
 * @return a promise that resolves to an opened body pane text editor
 */
private _setupOpenedLeoDocument(p_openFileResult: any): Promise&lt;unknown&gt; {
    // const w_selectedLeoNode = this.apToLeoNode(p_openFileResult.node, false); // Just to get gnx for the body's fist appearance
    // this.leoStates.leoOpenedFileName = p_openFileResult.filename;

    // // * If not unnamed file add to recent list &amp; last opened list
    // this._addRecentAndLastFile(p_openFileResult.filename);

    // // * Could be already opened, so perform 'rename hack' as if another node was selected
    // if (this._bodyTextDocument &amp;&amp; this.bodyUri) {
    //     // TODO : BUG WHEN SWITCHING LEO DOCUMENT : NEED CROSSOVER LOGIC!
    //     this._switchBody(w_selectedLeoNode.gnx);
    // } else {
    //     this.bodyUri = utils.strToLeoUri(w_selectedLeoNode.gnx);
    // }

    // // * Start body pane system
    // if (!this._bodyFileSystemStarted) {
    //     this._context.subscriptions.push(
    //         vscode.workspace.registerFileSystemProvider(Constants.URI_LEO_SCHEME, this._leoFileSystem, { isCaseSensitive: true })
    //     );
    //     this._bodyFileSystemStarted = true;
    // }
    // // * Startup flag
    // this.leoStates.fileOpenedReady = true;
    // // * Maybe first valid redraw of tree along with the selected node and its body
    // this._refreshOutline(true, RevealType.RevealSelectFocus); // p_revealSelection flag set
    // // * Maybe first StatusBar appearance
    // this._leoStatusBar.update(true, 0, true);
    // this._leoStatusBar.show(); // Just selected a node
    // // * Show leo log pane
    // this.showLogPane();
    // // * Send config to python's side (for settings such as defaultReloadIgnore and checkForChangeExternalFiles)
    // this.sendConfigToServer(this.config.getConfig());
    // // * Refresh Opened tree views
    // this.refreshDocumentsPane();
    // this._leoButtonsProvider.refreshTreeRoot();
    // // * Maybe first Body appearance
    // return this.showBody(false);
    return Promise.resolve(true);
}

</t>
<t tx="felix.20201228164116.1">/**
 * * Closes any body pane opened in this vscode window instance
 */
public closeBody(): void {
    // TODO : CLEAR UNDO HISTORY AND FILE HISTORY for this.bodyUri !
    if (this.bodyUri) {
        vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', this.bodyUri.path);
    }
    vscode.window.visibleTextEditors.forEach(p_textEditor =&gt; {
        if (p_textEditor.document.uri.scheme === Constants.URI_LEO_SCHEME) {
            vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', p_textEditor.document.uri.path);
            if (p_textEditor.hide) {
                p_textEditor.hide();
            }
        }
    });
}

</t>
<t tx="felix.20201229025520.1">/**
 * * Handle selected node being created for the outline
 * @param p_element PNode that was just created and detected as selected node
 */
public gotSelectedNode(p_element: PNode): void {

    console.log('Got selected node:', p_element.header);

    // set context flags
    this.leoStates.setSelectedNodeFlags(p_element);

}

</t>
</tnodes>
</leo_file>
