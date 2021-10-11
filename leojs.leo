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
<v t="ekr.20201209145358.1"><vh>VSCode extension</vh>
<v t="felix.20211007213344.1"><vh>@clean src/config.ts</vh>
<v t="felix.20211007213344.2"><vh>class Config</vh>
<v t="felix.20211007213344.3"><vh>getConfig</vh></v>
<v t="felix.20211007213344.4"><vh>getFontConfig</vh></v>
<v t="felix.20211007213344.5"><vh>setLeojsSettings</vh></v>
<v t="felix.20211007213344.6"><vh>setFontConfig</vh></v>
<v t="felix.20211007213344.7"><vh>setEnablePreview</vh></v>
<v t="felix.20211007213344.8"><vh>clearCloseEmptyGroups</vh></v>
<v t="felix.20211007213344.9"><vh>setCloseOnFileDelete</vh></v>
<v t="felix.20211007213344.10"><vh>checkEnablePreview</vh></v>
<v t="felix.20211007213344.11"><vh>checkCloseEmptyGroups</vh></v>
<v t="felix.20211007213344.12"><vh>checkCloseOnFileDelete</vh></v>
<v t="felix.20211007213344.13"><vh>buildFromSavedSettings</vh></v>
</v>
</v>
<v t="felix.20201215231023.1"><vh>@clean src/leoFiles.js</vh>
<v t="felix.20210124225736.1"><vh>&lt;&lt; imports &gt;&gt;</vh></v>
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
<v t="felix.20210124222835.1"><vh>tests</vh></v>
</v>
<v t="felix.20201214151326.1"><vh>@clean src/constants.ts</vh>
<v t="felix.20201214151326.2"><vh>class Constants</vh>
<v t="felix.20201214151326.3"><vh>general constants</vh></v>
<v t="felix.20201214151326.4"><vh>workbench interface panels</vh></v>
<v t="felix.20201214151326.5"><vh>user messages</vh></v>
<v t="felix.20211008004139.1"><vh>find panel ids</vh></v>
<v t="felix.20201214151326.6"><vh>at-buttons strings</vh></v>
<v t="felix.20211007214102.1"><vh>configuration keys</vh></v>
<v t="felix.20211007214110.1"><vh>config defaults</vh></v>
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
<v t="felix.20211010192923.1"><vh>@clean src/leoBody.ts</vh>
<v t="felix.20211010192923.2"><vh>class LeoBodyProvider</vh>
<v t="felix.20211010192923.3"><vh>setBodyTime</vh></v>
<v t="felix.20211010192923.4"><vh>fireRefreshFile</vh></v>
<v t="felix.20211010192923.5"><vh>refreshPossibleGnxList</vh></v>
<v t="felix.20211010192923.6"><vh>watch</vh></v>
<v t="felix.20211010192923.7"><vh>stat</vh></v>
<v t="felix.20211010192923.8"><vh>readFile</vh></v>
<v t="felix.20211010192923.9"><vh>readDirectory</vh></v>
<v t="felix.20211010192923.10"><vh>createDirectory</vh></v>
<v t="felix.20211010192923.11"><vh>writeFile</vh></v>
<v t="felix.20211010192923.12"><vh>rename</vh></v>
<v t="felix.20211010192923.13"><vh>delete</vh></v>
<v t="felix.20211010192923.14"><vh>copy</vh></v>
<v t="felix.20211010192923.15"><vh>_fireSoon</vh></v>
</v>
</v>
<v t="felix.20201214194144.1"><vh>@clean src/leoUI.ts</vh></v>
<v t="felix.20201208223553.1"><vh>@clean src/leoOutline.ts</vh>
<v t="felix.20201209011931.1"><vh>class JsOutlineProvider</vh>
<v t="felix.20201209011931.2"><vh>constructor</vh></v>
<v t="felix.20201209011931.3"><vh>refreshTreeRoot</vh></v>
<v t="felix.20211003223641.1"><vh>buildId</vh></v>
<v t="felix.20211003233639.1"><vh>incTreeId</vh></v>
<v t="felix.20201209011931.4"><vh>getTreeItem</vh></v>
<v t="felix.20201209011931.5"><vh>getChildren</vh></v>
<v t="felix.20201209011931.6"><vh>getParent</vh></v>
</v>
</v>
<v t="felix.20201208223554.1"><vh>@clean src/leoOutlineNode.ts</vh>
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
<v t="felix.20211007213900.1"><vh>ConfigMembers</vh></v>
<v t="felix.20211007213909.1"><vh>ConfigSetting</vh></v>
<v t="felix.20211007213915.1"><vh>FontSettings</vh></v>
<v t="felix.20201214154816.3"><vh>RevealType</vh></v>
<v t="felix.20201214154816.4"><vh>RefreshType</vh></v>
<v t="felix.20201214154816.5"><vh>UserCommand</vh></v>
<v t="felix.20211010221959.1"><vh>BodyTimeInfo</vh></v>
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
<v t="felix.20210110210346.1"><vh>@clean src/declarations.d.ts</vh></v>
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
<v t="felix.20211007214455.1"><vh>isHexColor</vh></v>
<v t="felix.20201208224407.14"><vh>strToLeoUri</vh></v>
<v t="felix.20201208224407.15"><vh>leoUriToStr</vh></v>
<v t="felix.20201208224407.16"><vh>setContext</vh></v>
<v t="felix.20210226202618.1"><vh>test</vh></v>
</v>
<v t="felix.20201214205159.1"><vh>@clean package.json</vh>
<v t="felix.20201214205159.2"><vh>&lt;&lt; contributes &gt;&gt;</vh>
<v t="felix.20211006225245.1"><vh>configuration</vh></v>
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
<v t="felix.20210102000055.1"><vh>Leo</vh>
<v t="felix.20210102000100.1"><vh>Core classes</vh>
<v t="felix.20210102012334.1"><vh>@clean src/core/leoApp.ts</vh>
<v t="felix.20210102211149.1"><vh>&lt;&lt; imports &gt;&gt; (leoApp)</vh></v>
<v t="felix.20211002234840.1"><vh>ApplyMixins</vh></v>
<v t="felix.20210102213337.1"><vh>class IdleTimeManager</vh>
<v t="felix.20210102213337.2"><vh>itm.add_callback</vh></v>
<v t="felix.20210102213337.3"><vh>itm.on_idle</vh></v>
<v t="felix.20210102213337.4"><vh>itm.start</vh></v>
</v>
<v t="felix.20210102214000.1"><vh>class LeoApp</vh>
<v t="felix.20210102214029.1"><vh>app.Birth &amp; startup</vh>
<v t="felix.20210103024632.2"><vh>&lt;&lt; LeoApp: command-line arguments &gt;&gt;</vh></v>
<v t="felix.20210103024632.3"><vh>&lt;&lt; LeoApp: Debugging &amp; statistics &gt;&gt;</vh></v>
<v t="felix.20210103024632.4"><vh>&lt;&lt; LeoApp: error messages &gt;&gt;</vh></v>
<v t="felix.20210103024632.5"><vh>&lt;&lt; LeoApp: global directories &gt;&gt;</vh></v>
<v t="felix.20210103024632.6"><vh>&lt;&lt; LeoApp: global data &gt;&gt;</vh></v>
<v t="felix.20210103024632.7"><vh>&lt;&lt; LeoApp: global controller/manager objects &gt;&gt;</vh></v>
<v t="felix.20210103024632.8"><vh>&lt;&lt; LeoApp: global reader/writer data &gt;&gt;</vh></v>
<v t="felix.20210103024632.9"><vh>&lt;&lt; LeoApp: global status vars &gt;&gt;</vh></v>
<v t="felix.20210103024632.10"><vh>&lt;&lt; LeoApp: the global log &gt;&gt;</vh></v>
<v t="felix.20210103024632.11"><vh>&lt;&lt; LeoApp: global theme data &gt;&gt;</vh></v>
<v t="felix.20210103024632.12"><vh>&lt;&lt; LeoApp: global types &gt;&gt;</vh></v>
<v t="felix.20210103024632.13"><vh>&lt;&lt; LeoApp: plugins and event handlers &gt;&gt;</vh></v>
<v t="felix.20210103024632.14"><vh>&lt;&lt; LeoApp: scripting ivars &gt;&gt;</vh></v>
<v t="felix.20210103024632.15"><vh>&lt;&lt; LeoApp: unit testing ivars &gt;&gt;</vh></v>
<v t="felix.20210102214102.1"><vh>constructor</vh></v>
<v t="felix.20210103024632.16"><vh>app.define_delegate_language_dict</vh></v>
<v t="felix.20210103024632.17"><vh>app.define_extension_dict</vh></v>
<v t="felix.20210103024632.18"><vh>app.define_global_constants</vh></v>
<v t="felix.20210103024632.19"><vh>app.define_language_delims_dict</vh></v>
<v t="felix.20210103024632.20"><vh>app.define_language_extension_dict</vh></v>
<v t="felix.20210103024632.21"><vh>app.init_at_auto_names</vh></v>
<v t="felix.20210103024632.22"><vh>app.init_at_file_names</vh></v>
</v>
<v t="felix.20210221010822.1"><vh>app.setLeoID &amp; helpers</vh>
<v t="felix.20210221010822.2"><vh>app.cleanLeoID</vh></v>
</v>
<v t="felix.20210123212411.1"><vh>app.newCommander</vh></v>
</v>
<v t="felix.20210118015431.1"><vh>class LoadManager</vh>
<v t="felix.20210119234943.1"><vh> LM.ctor</vh></v>
<v t="felix.20210120004121.1"><vh>LM.load &amp; helpers</vh>
<v t="felix.20210120004121.3"><vh>LM.doPostPluginsInit &amp; helpers</vh>
<v t="felix.20210120004121.4"><vh>LM.make_screen_shot</vh></v>
<v t="felix.20210120004121.5"><vh>LM.openEmptyWorkBook</vh></v>
</v>
<v t="felix.20210120004121.6"><vh>LM.doPrePluginsInit &amp; helpers</vh>
<v t="felix.20210120004121.16"><vh>LM.initApp</vh></v>
</v>
<v t="felix.20210120004121.31"><vh>LM.loadLocalFile &amp; helper</vh>
<v t="felix.20210120004121.32"><vh>LM.openFileByName &amp; helpers</vh>
<v t="felix.20210222013344.1"><vh>LM.initWrapperLeoFile</vh></v>
<v t="felix.20210222013445.1"><vh>LM.openLeoOrZipFile</vh></v>
</v>
</v>
<v t="felix.20210124192005.1"><vh>LM.findOpenFile</vh></v>
</v>
</v>
</v>
<v t="felix.20210110222544.1"><vh>@clean src/core/leoCommands.ts</vh>
<v t="felix.20210220194059.1"><vh>&lt;&lt; imports &gt;&gt;</vh></v>
<v t="felix.20210224000242.1"><vh>interface hoistStack</vh></v>
<v t="felix.20210110223514.1"><vh>class Commands</vh>
<v t="felix.20210223220756.1"><vh>Commander IVars</vh>
<v t="felix.20210223220814.2"><vh>c.initCommandIvars</vh></v>
<v t="felix.20210223220814.3"><vh>c.initDebugIvars</vh></v>
<v t="felix.20210223220814.4"><vh>c.initDocumentIvars</vh></v>
<v t="felix.20210223220814.5"><vh>c.initEventIvars</vh></v>
<v t="felix.20210223220814.6"><vh>c.initFileIvars</vh></v>
<v t="felix.20210223220814.7"><vh>c.initOptionsIvars</vh></v>
<v t="felix.20210223220814.8"><vh>c.initObjectIvars</vh></v>
<v t="felix.20210223220814.9"><vh>c.initObjects</vh></v>
<v t="felix.20210223220814.10"><vh>c.initSettings</vh></v>
</v>
<v t="felix.20210223002937.1"><vh>constructor &amp; helpers</vh>
<v t="felix.20211003013517.1"><vh>c.initObject</vh></v>
</v>
<v t="felix.20210112001859.1"><vh>c.Drawing &amp; coloring</vh></v>
<v t="felix.20210215185050.1"><vh>c.API</vh>
<v t="felix.20210131011508.1"><vh>c.Generators</vh>
<v t="felix.20210131011508.2"><vh>c.all_nodes &amp; all_unique_nodes</vh></v>
<v t="felix.20210131011508.3"><vh>c.all_positions</vh></v>
<v t="felix.20210131011508.4"><vh>c.all_positions_for_v</vh></v>
<v t="felix.20210131011508.5"><vh>c.all_roots</vh></v>
<v t="felix.20210131011508.6"><vh>c.all_unique_positions</vh></v>
<v t="felix.20210131011508.7"><vh>c.all_unique_roots</vh></v>
<v t="felix.20210131011508.8"><vh>c.safe_all_positions</vh></v>
<v t="felix.20210228004000.1"><vh>c.all_Root_Children</vh></v>
</v>
<v t="felix.20210131011420.1"><vh>c.Getters</vh>
<v t="felix.20210131011420.2"><vh>c.currentPosition</vh></v>
<v t="felix.20210131011420.3"><vh>c.fileName &amp; relativeFileName &amp; shortFileName</vh></v>
<v t="felix.20210131011420.4"><vh>c.firstVisible</vh></v>
<v t="felix.20210131011420.5"><vh>c.getTabWidth</vh></v>
<v t="felix.20210131011420.6"><vh>c.is...Position</vh>
<v t="felix.20210131011420.7"><vh>c.currentPositionIsRootPosition</vh></v>
<v t="felix.20210131011420.8"><vh>c.currentPositionHasNext</vh></v>
<v t="felix.20210131011420.9"><vh>c.isCurrentPosition</vh></v>
<v t="felix.20210131011420.10"><vh>c.isRootPosition</vh></v>
</v>
<v t="felix.20210131011420.11"><vh>c.isChanged</vh></v>
<v t="felix.20210131011420.12"><vh>c.lastTopLevel</vh></v>
<v t="felix.20210215204131.1"><vh>c.lastVisible</vh></v>
<v t="felix.20210131011420.13"><vh>c.nullPosition</vh></v>
<v t="felix.20210131011420.14"><vh>c.positionExists</vh>
<v t="felix.20210131011420.15"><vh>c.dumpPosition</vh></v>
</v>
<v t="felix.20210131011420.16"><vh>c.rootPosition</vh></v>
<v t="felix.20210131011420.17"><vh>c.shouldBeExpanded</vh></v>
<v t="felix.20210131011440.1"><vh>c.visLimit</vh></v>
<v t="felix.20210215204308.1"><vh>c.vnode2allPositions</vh></v>
<v t="felix.20210215204322.1"><vh>c.vnode2position</vh></v>
</v>
<v t="felix.20210131011549.1"><vh>c.Properties</vh></v>
<v t="felix.20210131011607.1"><vh>c.Setters</vh>
<v t="felix.20210131011607.2"><vh>c.appendStringToBody</vh></v>
<v t="felix.20210131011607.3"><vh>c.clearAllMarked</vh></v>
<v t="felix.20210131011607.4"><vh>c.clearAllVisited</vh></v>
<v t="felix.20210131011607.5"><vh>c.clearChanged</vh></v>
<v t="felix.20210131011607.6"><vh>c.clearMarked</vh></v>
<v t="felix.20210131011607.7"><vh>c.setBodyString</vh></v>
<v t="felix.20210131011607.8"><vh>c.setChanged</vh></v>
<v t="felix.20210131011607.9"><vh>c.setCurrentPosition</vh></v>
<v t="felix.20210211234142.1"><vh>c.setHeadString</vh></v>
<v t="felix.20210215204844.1"><vh>c.setMarked (calls hook)</vh></v>
<v t="felix.20210215204937.1"><vh>c.topPosition &amp; c.setTopPosition</vh></v>
</v>
</v>
<v t="felix.20211005023225.1"><vh>c.Gui</vh>
<v t="felix.20211005023800.1"><vh>c.Expand/contract</vh>
<v t="felix.20211005023821.1"><vh>c.contractAllHeadlines</vh></v>
<v t="felix.20211005023931.1"><vh>c.contractSubtree</vh></v>
<v t="felix.20211005024008.1"><vh>c.expandSubtree</vh></v>
<v t="felix.20211005024009.1"><vh>c.expandToLevel</vh></v>
</v>
<v t="felix.20211005023421.1"><vh>c.Selecting</vh>
<v t="felix.20211005023456.1"><vh>c.selectPosition</vh></v>
</v>
</v>
</v>
</v>
<v t="felix.20210220181245.1"><vh>@clean src/core/leoFileCommands.ts</vh>
<v t="felix.20210220195150.1"><vh>&lt;&lt; imports &gt;&gt;</vh></v>
<v t="felix.20210220190156.1"><vh>class FileCommands</vh>
<v t="felix.20210220200109.1"><vh>constructor</vh></v>
<v t="felix.20211003011145.1"><vh>fileCommandsTest</vh></v>
</v>
</v>
<v t="felix.20210102012410.1"><vh>@clean src/core/leoGlobals.ts</vh>
<v t="felix.20210102180352.1"><vh> &lt;&lt; global switches &gt;&gt; (leoGlobals.py)</vh></v>
<v t="felix.20210102181122.1"><vh>&lt;&lt; imports &gt;&gt; (leoGlobals)</vh></v>
<v t="felix.20210102180402.1"><vh>&lt;&lt; define g.globalDirectiveList &gt;&gt;</vh></v>
<v t="felix.20210102180405.1"><vh>&lt;&lt; define global decorator dicts &gt;&gt; (leoGlobals.py)</vh></v>
<v t="felix.20210102180413.1"><vh>&lt;&lt; define regex's &gt;&gt;</vh></v>
<v t="felix.20210103231554.1"><vh>class g.FileLikeObject (coreGlobals.py)</vh>
<v t="felix.20210103231554.2"><vh>FileLikeObject.clear (coreGlobals.py)</vh></v>
<v t="felix.20210103231554.3"><vh>FileLikeObject.close (coreGlobals.py)</vh></v>
<v t="felix.20210103231554.4"><vh>FileLikeObject.flush (coreGlobals.py)</vh></v>
<v t="felix.20210103231554.5"><vh>FileLikeObject.get &amp; getvalue &amp; read (coreGlobals.py)</vh></v>
<v t="felix.20210103231554.6"><vh>FileLikeObject.readline (coreGlobals.py)</vh></v>
<v t="felix.20210103231554.7"><vh>FileLikeObject.write  (coreGlobals.py)</vh></v>
</v>
<v t="felix.20210103234820.1"><vh>g.angleBrackets   (coreGlobals.py)</vh></v>
<v t="felix.20210104000547.1"><vh>g.caller          (coreGlobals.py)</vh></v>
<v t="felix.20210104001301.1"><vh>g.callers         (coreGlobals.py)</vh></v>
<v t="felix.20210104010331.1"><vh>g._callerName     (coreGlobals.py)</vh></v>
<v t="felix.20210104194650.1"><vh>g.doKeywordArgs   (coreGlobals.py)</vh></v>
<v t="felix.20210211222711.1"><vh>g.doHook</vh></v>
<v t="felix.20210104210231.1"><vh>g.error           (coreGlobals.py)</vh></v>
<v t="felix.20210104210234.1"><vh>g.es              (coreGlobals.py)</vh></v>
<v t="felix.20210104210248.1"><vh>g.es_exception    (coreGlobals.py)</vh></v>
<v t="felix.20210104210254.1"><vh>g.es_print        (coreGlobals.py)</vh></v>
<v t="felix.20210211234504.1"><vh>g.getScript</vh></v>
<v t="felix.20210104210259.1"><vh>g.isDirective     (coreGlobals.py)</vh></v>
<v t="felix.20210104210307.1"><vh>g.is_special      (coreGlobals.py)</vh></v>
<v t="felix.20210104210316.1"><vh>g.isWordChar*     (coreGlobals.py)</vh></v>
<v t="felix.20210108005428.1"><vh>g.match           (coreGlobals.py)</vh></v>
<v t="felix.20210108011201.1"><vh>g.match_word      (coreGlobals.py)</vh></v>
<v t="felix.20210109001345.1"><vh>g.listToString     (coreGlobals.py)</vh></v>
<v t="felix.20210130235311.1"><vh>g.objToSTring     (coreGlobals.py)</vh></v>
<v t="felix.20210109002058.1"><vh>g.plural          (coreGlobals.py)</vh></v>
<v t="felix.20210109003521.1"><vh>g.pr              (coreGlobals.py)</vh></v>
<v t="felix.20210109004916.1"><vh>g.printObj        (coreGlobals.py)</vh></v>
<v t="felix.20210109005341.1"><vh>g.shortFileName   (coreGlobals.py)</vh></v>
<v t="felix.20210109180936.1"><vh>g.skip_to_char    (coreGlobals.py)</vh></v>
<v t="felix.20210109190137.1"><vh>g.skip_id         (coreGlobals.py)</vh></v>
<v t="felix.20210109192733.1"><vh>g.skip_ws*        (coreGlobals.py)</vh></v>
<v t="felix.20210104003932.1"><vh>g.splitLines      (coreGlobals.py)</vh></v>
<v t="felix.20210109224332.1"><vh>g.toEncodedString (coreGlobals.py)</vh></v>
<v t="felix.20210110163748.1"><vh>g.toUnicode       (coreGlobals.py)</vh></v>
<v t="felix.20210110163753.1"><vh>g.trace           (coreGlobals.py)</vh></v>
</v>
<v t="felix.20210102012632.1"><vh>@clean src/core/leoNodes.ts</vh>
<v t="felix.20210127001502.1"><vh>&lt;&lt; imports &gt;&gt;</vh></v>
<v t="felix.20210102014453.1"><vh>class NodeIndices</vh>
<v t="felix.20210102014804.1"><vh>ni.constructor</vh></v>
<v t="felix.20210110213751.1"><vh>ni.check_gnx</vh></v>
<v t="felix.20210102024358.1"><vh>ni.setTimeStamp</vh></v>
<v t="felix.20210218214329.6"><vh>ni.get/setDefaultId</vh></v>
<v t="felix.20210218214329.7"><vh>ni.getNewIndex</vh></v>
<v t="felix.20210218214329.8"><vh>ni.new_vnode_helper</vh></v>
<v t="felix.20210218214329.12"><vh>ni.update</vh></v>
</v>
<v t="felix.20210102015005.1"><vh>class Position</vh>
<v t="felix.20210126210412.1"><vh>p.ctor &amp; other special methods...</vh>
<v t="felix.20210126210419.1"><vh>p.constructor</vh></v>
<v t="felix.20210126210412.3"><vh>p.__eq__ &amp; __ne__</vh></v>
<v t="felix.20210126210412.4"><vh>p.__ge__ &amp; __le__&amp; __lt__</vh></v>
<v t="felix.20210126210412.5"><vh>p.__gt__</vh></v>
<v t="felix.20210126210412.6"><vh>p.__nonzero__ &amp; __bool__</vh></v>
<v t="felix.20210126210412.7"><vh>p.__str__ and p.__repr__</vh></v>
<v t="felix.20210126210412.8"><vh>p.archivedPosition</vh></v>
<v t="felix.20210126210412.9"><vh>p.dump</vh></v>
<v t="felix.20210126210412.10"><vh>p.key &amp; p.sort_key &amp; __hash__</vh></v>
</v>
<v t="felix.20210204224730.1"><vh>p.File Conversion</vh>
<v t="felix.20210204224730.2"><vh>p.convertTreeToString</vh></v>
<v t="felix.20210204224730.3"><vh>p.moreHead</vh></v>
<v t="felix.20210204224730.4"><vh>p.moreBody</vh></v>
</v>
<v t="felix.20210204235058.1"><vh>p.generators</vh>
<v t="felix.20210102031240.1"><vh>p.children</vh></v>
<v t="felix.20210204235058.3"><vh>p.following_siblings</vh></v>
<v t="felix.20210204235058.4"><vh>p.nearest_roots</vh></v>
<v t="felix.20210204235058.5"><vh>p.nearest_unique_roots (aka p.nearest)</vh></v>
<v t="felix.20210204235058.6"><vh>p.nodes</vh></v>
<v t="felix.20210204235058.7"><vh>p.parents</vh></v>
<v t="felix.20210204235058.8"><vh>p.self_and_parents</vh></v>
<v t="felix.20210204235058.9"><vh>p.self_and_siblings</vh></v>
<v t="felix.20210204235058.10"><vh>p.self_and_subtree</vh></v>
<v t="felix.20210204235058.11"><vh>p.subtree</vh></v>
<v t="felix.20210204235058.12"><vh>p.unique_nodes</vh></v>
<v t="felix.20210204235058.13"><vh>p.unique_subtree</vh></v>
</v>
<v t="felix.20210202235315.1"><vh>p.Getters</vh>
<v t="felix.20210102233013.1"><vh>p.VNode proxies</vh>
<v t="felix.20210102233013.2"><vh>p.Comparisons</vh></v>
<v t="felix.20210102233013.3"><vh>p.Headline &amp; body strings</vh></v>
<v t="felix.20210102233013.4"><vh>p.Status bits</vh></v>
</v>
<v t="felix.20210112010737.1"><vh>p.children &amp; parents</vh>
<v t="felix.20210112010737.2"><vh>p.childIndex</vh></v>
<v t="felix.20210112010737.3"><vh>p.directParents</vh></v>
<v t="felix.20210112010737.4"><vh>p.hasChildren &amp; p.numberOfChildren</vh></v>
</v>
<v t="felix.20210202235315.10"><vh>p.getX &amp; VNode compatibility traversal routines</vh></v>
<v t="felix.20210202235315.11"><vh>p.get_UNL</vh></v>
<v t="felix.20210202235315.12"><vh>p.hasBack/Next/Parent/ThreadBack</vh>
<v t="felix.20210202235315.13"><vh>hasThreadNext (the only complex hasX method)</vh></v>
</v>
<v t="felix.20210202235315.14"><vh>p.findRootPosition</vh></v>
<v t="felix.20210202235315.15"><vh>p.isAncestorOf</vh></v>
<v t="felix.20210202235315.16"><vh>p.isCloned</vh></v>
<v t="felix.20210202235315.17"><vh>p.isRoot</vh></v>
<v t="felix.20210202235315.18"><vh>p.isVisible (slow)</vh></v>
<v t="felix.20210202235315.19"><vh>p.level &amp; simpleLevel</vh></v>
<v t="felix.20210202235315.20"><vh>p.positionAfterDeletedTree</vh></v>
<v t="felix.20210202235315.21"><vh>p.textOffset</vh></v>
</v>
<v t="felix.20210127234205.1"><vh>p.Low level methods</vh>
<v t="felix.20210127234205.2"><vh>p._adjustPositionBeforeUnlink</vh></v>
<v t="felix.20210127234205.3"><vh>p._linkAfter</vh></v>
<v t="felix.20210127234205.4"><vh>p._linkCopiedAfter</vh></v>
<v t="felix.20210127234205.5"><vh>p._linkAsNthChild</vh></v>
<v t="felix.20210127234205.6"><vh>p._linkCopiedAsNthChild</vh></v>
<v t="felix.20210127234205.7"><vh>p._linkAsRoot (changed)</vh></v>
<v t="felix.20210127234205.8"><vh>p._parentVnode</vh></v>
<v t="felix.20210127234205.9"><vh>p._relinkAsCloneOf</vh></v>
<v t="felix.20210127234205.10"><vh>p._unlink</vh>
<v t="felix.20210127234205.11"><vh>p.badUnlink</vh></v>
</v>
</v>
<v t="felix.20210125233441.1"><vh>p.moveToX</vh>
<v t="felix.20210125233441.2"><vh>p.moveToBack</vh></v>
<v t="felix.20210125233441.3"><vh>p.moveToFirstChild</vh></v>
<v t="felix.20210125233441.4"><vh>p.moveToLastChild</vh></v>
<v t="felix.20210125233441.5"><vh>p.moveToLastNode</vh></v>
<v t="felix.20210125233441.6"><vh>p.moveToNext</vh></v>
<v t="felix.20210125233441.7"><vh>p.moveToNodeAfterTree</vh></v>
<v t="felix.20210125233441.8"><vh>p.moveToNthChild</vh></v>
<v t="felix.20210125233441.9"><vh>p.moveToParent</vh></v>
<v t="felix.20210125233441.10"><vh>p.moveToThreadBack</vh></v>
<v t="felix.20210125233441.11"><vh>p.moveToThreadNext</vh></v>
<v t="felix.20210125233441.12"><vh>p.moveToVisBack &amp; helper</vh>
<v t="felix.20210125233441.13"><vh>checkVisBackLimit</vh></v>
</v>
<v t="felix.20210125233441.14"><vh>p.moveToVisNext &amp; helper</vh>
<v t="felix.20210125233441.15"><vh>checkVisNextLimit</vh></v>
</v>
<v t="felix.20210125233441.16"><vh>p.safeMoveToThreadNext</vh></v>
</v>
<v t="felix.20210126001920.1"><vh>p.Moving, Inserting, Deleting, Cloning, Sorting</vh>
<v t="felix.20210126001920.2"><vh>p.clone</vh></v>
<v t="felix.20210102035859.1"><vh>p.copy</vh></v>
<v t="felix.20210126001920.4"><vh>p.deleteAllChildren</vh></v>
<v t="felix.20210126001920.5"><vh>p.doDelete</vh></v>
<v t="felix.20210126001920.6"><vh>p.insertAfter</vh></v>
<v t="felix.20210126001920.7"><vh>p.insertAsLastChild</vh></v>
<v t="felix.20210126001920.8"><vh>p.insertAsNthChild</vh></v>
<v t="felix.20210126001920.9"><vh>p.insertBefore</vh></v>
<v t="felix.20210126001920.10"><vh>p.invalidOutline</vh></v>
<v t="felix.20210126001920.11"><vh>p.moveAfter</vh></v>
<v t="felix.20210126001920.12"><vh>p.moveToFirst/LastChildOf</vh></v>
<v t="felix.20210126001920.13"><vh>p.moveToNthChildOf</vh></v>
<v t="felix.20210126001920.14"><vh>p.moveToRoot (changed)</vh></v>
<v t="felix.20210126001920.15"><vh>p.promote</vh></v>
<v t="felix.20210126001920.16"><vh>p.validateOutlineWithParent</vh>
<v t="felix.20210126001920.17"><vh>&lt;&lt; validate parent ivar &gt;&gt;</vh></v>
<v t="felix.20210126001920.18"><vh>&lt;&lt; validate childIndex ivar &gt;&gt;</vh></v>
<v t="felix.20210126001920.19"><vh>&lt;&lt; validate x ivar &gt;&gt;</vh></v>
</v>
</v>
<v t="felix.20210206014421.1"><vh>p.Properties</vh>
<v t="felix.20210206014421.2"><vh>p.b property</vh></v>
<v t="felix.20210206014421.3"><vh>p.h property</vh></v>
<v t="felix.20210206014421.4"><vh>p.gnx property</vh></v>
<v t="felix.20210206014421.5"><vh>p.script property</vh></v>
<v t="felix.20210206014421.6"><vh>p.nosentinels property</vh></v>
<v t="felix.20210206014421.7"><vh>p.u Property</vh></v>
</v>
<v t="felix.20210207005040.1"><vh>p.Setters</vh>
<v t="felix.20210207005040.2"><vh>p.VNode proxies</vh>
<v t="felix.20210207005040.3"><vh>p.contract/expand/isExpanded</vh></v>
<v t="felix.20210207005040.4"><vh>p.Status bits</vh></v>
<v t="felix.20210207005040.5"><vh>p.computeIcon &amp; p.setIcon</vh></v>
<v t="felix.20210207005040.6"><vh>p.setSelection</vh></v>
<v t="felix.20210207005040.7"><vh>p.restore/saveCursorAndScroll</vh></v>
</v>
<v t="felix.20210207005040.8"><vh>p.setBodyString &amp; setHeadString</vh></v>
<v t="felix.20210207005040.9"><vh>p.Visited bits</vh>
<v t="felix.20210207005040.10"><vh>p.clearVisitedInTree</vh></v>
<v t="felix.20210207005040.11"><vh>p.clearAllVisitedInTree</vh></v>
</v>
<v t="felix.20210207005040.12"><vh>p.Dirty bits</vh>
<v t="felix.20210207005040.13"><vh>p.clearDirty</vh></v>
<v t="felix.20210207005040.14"><vh>p.inAtIgnoreRange</vh></v>
<v t="felix.20210207005040.15"><vh>p.setAllAncestorAtFileNodesDirty</vh></v>
<v t="felix.20210207005040.16"><vh>p.setDirty</vh></v>
</v>
</v>
<v t="felix.20210208001026.1"><vh>p.Predicates</vh>
<v t="felix.20210208001026.2"><vh>p.is_at_all &amp; is_at_all_tree</vh></v>
<v t="felix.20210208001026.3"><vh>p.is_at_ignore &amp; in_at_ignore_tree</vh></v>
</v>
</v>
<v t="felix.20210102150654.1"><vh>Enum StatusFlags</vh></v>
<v t="felix.20210102015917.1"><vh>class VNode</vh>
<v t="felix.20210130233340.1"><vh>v.Birth &amp; death</vh>
<v t="felix.20210102015917.2"><vh>constructor</vh></v>
<v t="felix.20210130233340.3"><vh>v.__repr__ &amp; v.__str__</vh></v>
<v t="felix.20210130233340.4"><vh>v.dump</vh></v>
</v>
<v t="felix.20210112210731.1"><vh>v.Comparisons</vh>
<v t="felix.20210112210731.2"><vh>v.findAtFileName</vh></v>
<v t="felix.20210112210731.3"><vh>v.anyAtFileNodeName</vh></v>
<v t="felix.20210112210731.4"><vh>v.at...FileNodeName</vh></v>
<v t="felix.20210112210731.5"><vh>v.isAtAllNode</vh></v>
<v t="felix.20210112210731.6"><vh>v.isAnyAtFileNode</vh></v>
<v t="felix.20210112210731.7"><vh>v.isAt...FileNode</vh></v>
<v t="felix.20210112210731.8"><vh>v.isAtIgnoreNode</vh></v>
<v t="felix.20210112210731.9"><vh>v.isAtOthersNode</vh></v>
<v t="felix.20210112210731.10"><vh>v.matchHeadline</vh></v>
</v>
<v t="felix.20210207195152.1"><vh>v.copyTree</vh></v>
<v t="felix.20210102234910.1"><vh>v.Getters</vh>
<v t="felix.20210102234915.1"><vh>v.bodyString</vh></v>
<v t="felix.20210102235015.1"><vh>v.Children</vh>
<v t="felix.20210103000631.1"><vh>v.firstChild</vh></v>
<v t="felix.20210103003546.1"><vh>v.hasChildren</vh></v>
<v t="felix.20210103003705.1"><vh>v.lastChild</vh></v>
<v t="felix.20210103010323.1"><vh>v.nthChild</vh></v>
<v t="felix.20210103010327.1"><vh>v.numberOfChildren</vh></v>
</v>
<v t="felix.20210103011425.1"><vh>v.directParents</vh></v>
<v t="felix.20210103011621.1"><vh>v.hasBody</vh></v>
<v t="felix.20210103013608.1"><vh>v.headString</vh></v>
<v t="felix.20210103023444.1"><vh>v.cleanHeadString</vh></v>
<v t="felix.20210103013802.1"><vh>v.isNthChildOf</vh></v>
<v t="felix.20210103013805.1"><vh>v.Status Bits</vh>
<v t="felix.20210103013805.2"><vh>v.isCloned</vh></v>
<v t="felix.20210103013805.3"><vh>v.isDirty</vh></v>
<v t="felix.20210103013805.4"><vh>v.isMarked</vh></v>
<v t="felix.20210103013805.5"><vh>v.isOrphan</vh></v>
<v t="felix.20210103013805.6"><vh>v.isSelected</vh></v>
<v t="felix.20210103013805.7"><vh>v.isTopBitSet</vh></v>
<v t="felix.20210103013805.8"><vh>v.isVisited</vh></v>
<v t="felix.20210103013805.9"><vh>v.isWriteBit</vh></v>
<v t="felix.20210103013805.10"><vh>v.status</vh></v>
</v>
</v>
<v t="felix.20210115195450.1"><vh>v.Setters</vh>
<v t="felix.20210115195450.2"><vh> v.Dirty bits</vh>
<v t="felix.20210115195450.3"><vh>v.clearDirty</vh></v>
<v t="felix.20210115195450.4"><vh>v.setDirty</vh></v>
</v>
<v t="felix.20210115195450.5"><vh> v.Status bits</vh>
<v t="felix.20210115195450.6"><vh>v.clearClonedBit</vh></v>
<v t="felix.20210115195450.7"><vh>v.clearMarked</vh></v>
<v t="felix.20210115195450.8"><vh>v.clearWriteBit</vh></v>
<v t="felix.20210115195450.9"><vh>v.clearOrphan</vh></v>
<v t="felix.20210115195450.10"><vh>v.clearVisited</vh></v>
<v t="felix.20210115195450.11"><vh>v.contract/expand/initExpandedBit/isExpanded</vh></v>
<v t="felix.20210115195450.12"><vh>v.initStatus</vh></v>
<v t="felix.20210115195450.13"><vh>v.setClonedBit &amp; initClonedBit</vh></v>
<v t="felix.20210115195450.14"><vh>v.setMarked &amp; initMarkedBit</vh></v>
<v t="felix.20210115195450.15"><vh>v.setOrphan</vh></v>
<v t="felix.20210115195450.16"><vh>v.setSelected</vh></v>
<v t="felix.20210115195450.17"><vh>v.setVisited</vh></v>
<v t="felix.20210115195450.18"><vh>v.setWriteBit</vh></v>
</v>
<v t="felix.20210207213301.1"><vh>v.childrenModified</vh></v>
<v t="felix.20210115195450.19"><vh>v.computeIcon &amp; setIcon</vh></v>
<v t="felix.20210207213314.1"><vh>v.contentModified</vh></v>
<v t="felix.20210207213328.1"><vh>v.restoreCursorAndScroll</vh></v>
<v t="felix.20210115195450.20"><vh>v.saveCursorAndScroll</vh></v>
<v t="felix.20210115195450.21"><vh>v.setBodyString &amp; v.setHeadString</vh></v>
<v t="felix.20210115195450.22"><vh>v.setSelection</vh></v>
</v>
<v t="felix.20210116003530.1"><vh>v.setAllAncestorAtFileNodesDirty &amp; helpers</vh></v>
<v t="felix.20210116003538.1"><vh>v.Inserting &amp; cloning</vh></v>
<v t="felix.20210117025748.1"><vh>v.Low level methods</vh>
<v t="felix.20210117025748.2"><vh>v._addCopiedLink</vh></v>
<v t="felix.20210117025748.3"><vh>v._addLink &amp; _addParentLinks</vh>
<v t="felix.20210117025748.4"><vh>v._addParentLinks</vh></v>
</v>
<v t="felix.20210117025748.5"><vh>v._cutLink &amp; _cutParentLinks</vh>
<v t="felix.20210117025748.6"><vh>v._cutParentLinks</vh></v>
</v>
<v t="felix.20210117025748.7"><vh>v._deleteAllChildren</vh></v>
<v t="felix.20210117025748.8"><vh>v._linkAsNthChild</vh></v>
</v>
<v t="felix.20210117160548.1"><vh>v.Properties</vh>
<v t="felix.20210117160548.2"><vh>v.b Property</vh></v>
<v t="felix.20210117160548.3"><vh>v.h property</vh></v>
<v t="felix.20210117160548.4"><vh>v.u Property</vh></v>
<v t="felix.20210117160548.5"><vh>v.gnx Property</vh></v>
</v>
</v>
</v>
</v>
<v t="felix.20211002194716.1"><vh>Command classes</vh>
<v t="felix.20211002221425.1"><vh>@file src/commands/commanderOutlineCommands.ts</vh></v>
</v>
</v>
<v t="felix.20210226224644.1"><vh>TO DO / TO FINISH</vh>
<v t="felix.20210226224637.1"><vh>fc.getLeoFile &amp; helpers (read main line)</vh>
<v t="felix.20210226224637.2"><vh>fc.handleNodeConflicts</vh></v>
<v t="felix.20210226224637.3"><vh>fc.propegateDirtyNodes</vh></v>
<v t="felix.20210226224637.4"><vh>fc.readExternalFiles</vh></v>
<v t="felix.20210226224637.5"><vh>fc.warnOnReadOnlyFiles</vh></v>
</v>
</v>
</vnodes>
<tnodes>
<t tx="ekr.20201209145256.1"></t>
<t tx="ekr.20201209145358.1"></t>
<t tx="felix.20201208214250.2"></t>
<t tx="felix.20201208214319.1"># leojs

## ![LeoEditor](resources/leoapp.png) Literate Editor with Outline _in Typescript_ ![Typescript](resources/typescript.png)

### Literate Programming with _Directed Acyclic Graphs_ ([dag](https://en.wikipedia.org/wiki/Directed_acyclic_graph))

LeoJS is [LeoInteg](https://github.com/boltex/leointeg#-leo-editor-integration-with-visual-studio-code)'s younger sibling project : a vsCode extension, currently in early alpha.

Inspired by &lt;https://github.com/leo-editor/leo-editor/issues/1025&gt;.

See Leo, the Literate Editor with Outline, at [leoeditor.com](https://leoeditor.com/)
or on [github](https://github.com/leo-editor/leo-editor), and vscode at [code.visualstudio.com](https://code.visualstudio.com/).

![Screenshot](resources/animated-screenshot.gif)

## Development Version Installation

Make sure you have Node.js and Git installed, then clone the sources and run `npm install` in a terminal to install the remaining development dependencies.

![run extension](resources/run-extension.png)

You can then run the **Run Extension** target, as shown above, in the **Debug View**.

## Features done so far

The 'demo' built so far creates two test commanders at startup, (in leoUi constructor) with their respective outlines.

No body pane but the tree browsing is working, expanding/collapsing nodes, context menu shows relevant commands.

The document switching works too, but anything else is just showing off that commands are all reliably mapped (to message popups).

Also, you can turn on the 'leo tree browsing mode' (Leo/MORE outliner keybindings) on and off, from the outline title menu. You can then see that command mapped to message popups are behaving.

Feel free to explore and ask about it! 😜

## Keybindings

| Commands Keybinding        |     |                         | Command             |
| :------------------------- | :-- | :---------------------- | :------------------ |
| `Alt + -`                  |     |                         | Contract All        |
| `Ctrl + I`                 |     |                         | Insert Node         |
| `Ctrl + H`                 |     |                         | Edit Headline       |
| `Ctrl + Backquote`         |     |                         | Clone Node          |
| `Ctrl + Shift + C`         |     |                         | Copy Node           |
| `Ctrl + Shift + X`         |     |                         | Cut Node            |
| `Ctrl + Shift + V`         |     |                         | Paste Node          |
| `Ctrl + Shift + Backspace` |     |                         | Delete Node         |
| `Ctrl + B`                 |     |                         | Execute Script      |
| `Ctrl + M`                 |     |                         | Mark / Unmark       |
| `Ctrl + {`                 | and | `Ctrl + }`              | Promote / Demote    |
| `Ctrl + T`                 |     |                         | Toggle Outline/Body |
| `Tab`                      | or  | `Alt + D`               | Focus on Body       |
| `Alt + T`                  |     |                         | Focus on Outline    |
| `Ctrl + Shift + D`         |     |                         | Extract             |
| `Ctrl + Shift + N`         |     |                         | Extract Names       |
| `Alt + A`                  |     |                         | Sort Siblings       |
| `Ctrl + U`                 | or  | `Shift [+ Alt] + Up`    | Move Outline Up     |
| `Ctrl + D`                 | or  | `Shift [+ Alt] + Down`  | Move Outline Down   |
| `Ctrl + L`                 | or  | `Shift [+ Alt] + Left`  | Move Outline Left   |
| `Ctrl + R`                 | or  | `Shift [+ Alt] + Right` | Move Outline Right  |

&gt; Move Outline commands only need the 'Alt' key modifier when focus is on body pane.

### Tree Browsing Keybindings

&gt; _With the **'Leo Tree Browsing'** setting enabled, all arrows and numeric keypad keys change the outline's selection directly_

| Tree Browsing Keybinding |     | With **'Leo Tree Browsing'** enabled | Command                  |
| :----------------------- | :-- | :----------------------------------- | :----------------------- |
| `Alt + Home`             | or  | `Home`                               | Go To First Visible Node |
| `Alt + End`              |     |                                      | Go To Last Sibling       |
|                          |     | `End`                                | Go To Last Visible Node  |
| `Alt + N`                |     |                                      | Go To Next Clone         |
| `Alt + Arrow Keys`       | or  | `Arrow Keys`                         | Browse Tree              |
| `Ctrl + T`               |     |                                      | Switch Tree/Body Focus   |
| `Tab`                    |     |                                      | Focus from Tree to Body  |

**Enjoy!**
</t>
<t tx="felix.20201208214322.1">import * as vscode from 'vscode';
import { ReqRefresh } from "./types";
import { LeoUI } from './leoUI';
import { Constants } from './constants';
import { LeoButtonNode } from './leoButtonNode';
import { LeoOutlineNode } from './leoOutlineNode';

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
import { LeoOutlineNode } from './leoOutlineNode';
import { ProviderResult } from "vscode";
import { Icon } from './types';
import { LeoUI } from './leoUI';
import { Position } from './core/leoNodes';


@language typescript
@tabwidth -4
@others

</t>
<t tx="felix.20201208223554.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import { Position } from "./core/leoNodes";
import { Icon } from "./types"; // ArchivedPosition included to help debug

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
import { LeoOutlineNode } from "./leoOutlineNode";
import * as fs from 'fs';

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
export function isIconChangedByEdit(p_node: LeoOutlineNode, p_newHasBody: boolean): boolean {
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

Thanks for trying out the development version of Leojs! :sunglasses: Contributions and pull requests are more than welcome!

## Introduction

If you're new to vscode and want to try out Leo with this vscode extension, you might want to look at this [Getting Started](https://code.visualstudio.com/docs#vscode-in-action) page to get an overview of vscode.

Furthermore, if you've never ran a vscode extension in an **Extension Development Host**, here is a [short overview about running and modifying a simple extension](https://code.visualstudio.com/api/get-started/your-first-extension).

If you're having problems, try [running this sample extension](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample#running-the-sample) first to catch underlying problems or missing dependencies.

</t>
<t tx="felix.20201209004316.1">export class LeoOutlineNode extends vscode.TreeItem {

    public contextValue: string; // * Context string is checked in package.json with 'when' clauses

    public isRoot: boolean = false; // * for hoist/dehoist context flags purposes

    constructor(
        public label: string, // Node headline
        public collapsibleState: vscode.TreeItemCollapsibleState, // Computed in receiver/creator
        public position: Position, // Pointer/reference for leo's node position
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
<t tx="felix.20201209004316.2">public copyProperties(p_node: LeoOutlineNode): LeoOutlineNode {
    this.label = p_node.label;
    this.collapsibleState = p_node.collapsibleState;
    this.position = p_node.position;
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
<t tx="felix.20201209011931.1">export class LeoOutlineProvider implements vscode.TreeDataProvider&lt;Position&gt; {
    private _onDidChangeTreeData: vscode.EventEmitter&lt;Position | undefined&gt; = new vscode.EventEmitter&lt;Position | undefined&gt;();

    readonly onDidChangeTreeData: vscode.Event&lt;Position | undefined&gt; = this._onDidChangeTreeData.event;

    private _treeId: number = 0; // Starting salt for tree node murmurhash generated Ids

    @others
}

</t>
<t tx="felix.20201209011931.2">constructor(
    private _icons: Icon[],
    private _leoUI: LeoUI
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
<t tx="felix.20201209011931.4">public getTreeItem(element: Position): Thenable&lt;LeoOutlineNode&gt; | LeoOutlineNode {
    console.log('called getTreeItem', element.h, element.v.gnx);

    let w_collapse: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;
    if (element.hasChildren()) {
        w_collapse = element.isExpanded() ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
    }
    const w_leoNode = new LeoOutlineNode(
        element.h,
        w_collapse, // element.hasChildren() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        element, // ap
        element.isCloned(), // cloned
        element.isDirty(), // dirty
        element.isMarked(), // marked
        element.isAnyAtFileNode(), // atFile
        element.v.hasBody(),
        Object.keys(element.v.u).length ? element.v.u : false, // 'u' - user defined data
        this._icons,
        this.buildId(element, w_collapse)
    );

    if (element.__eq__(this._leoUI.leo_c.p)) {
        this._leoUI.gotSelectedNode(element);
    }

    // Build a LeoNode (a vscode tree node) from the Position
    return w_leoNode;
}

</t>
<t tx="felix.20201209011931.5">public getChildren(element?: Position): Position[] {
    console.log('called get children on', element);

    if (element) {
        return [...element.children()];
    } else {
        if (this._leoUI.leo_c) {

            const w_c = this._leoUI.leo_c!; // Currently Selected Document's Commander
            if (w_c.hoistStack.length) {
                // topmost hoisted starts the outline as single root 'child'
                return [w_c.hoistStack[w_c.hoistStack.length - 1].p];
            } else {
                // true list of root nodes
                return [...w_c.all_Root_Children()];
            }
        } else {
            console.error('Commander not found in commanderList');
            return [];
        }
    }
}

</t>
<t tx="felix.20201209011931.6">public getParent(element: Position): ProviderResult&lt;Position&gt; {
    console.log('called get parent on', element);

    if (element) {
        const p_parent = element.parent();
        if (p_parent.v) {
            console.log('had parent');

            return p_parent;
        } else {
            console.log('was root');

            return undefined;
        }
    }
    return undefined;
}

</t>
<t tx="felix.20201214150149.1">export function activate(p_context: vscode.ExtensionContext) {

    const w_leoUI: LeoUI = new LeoUI(p_context);

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
        ["leojs.test", () =&gt; w_leoUI.test()], // Test function useful when debugging

        &lt;&lt; Define entries for all commands &gt;&gt;
    ];

    w_commands.map(function (p_command) {
        p_context.subscriptions.push(vscode.commands.registerCommand(...p_command));
    });

}

</t>
<t tx="felix.20201214150149.10">[CMD.INSERT, (p_node: LeoOutlineNode) =&gt; w_leoUI.insertNode(p_node, true)],
[CMD.INSERT_SELECTION, () =&gt; w_leoUI.insertNode(U, false)],
[CMD.INSERT_SELECTION_FO, () =&gt; w_leoUI.insertNode(U, true)],
// Special command for when inserting rapidly more than one node without
// even specifying a headline label, e.g. spamming CTRL+I rapidly.
[CMD.INSERT_SELECTION_INTERRUPT, () =&gt; w_leoUI.insertNode(U, false, true)],

[CMD.CLONE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.CLONE_PNODE, p_node, REFRESH_TREE_BODY, true)],
[CMD.CLONE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, false)],
[CMD.CLONE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.CLONE_PNODE, U, REFRESH_TREE, true)],

[CMD.PROMOTE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.PROMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.PROMOTE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, false)],
[CMD.PROMOTE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.PROMOTE_PNODE, U, REFRESH_TREE, true)],

[CMD.DEMOTE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.DEMOTE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.DEMOTE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, false)],
[CMD.DEMOTE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.DEMOTE_PNODE, U, REFRESH_TREE, true)],

[CMD.SORT_CHILDREN, () =&gt; w_leoUI.command(LEOCMD.SORT_CHILDREN, U, REFRESH_TREE, false, true)],
[CMD.SORT_SIBLING, () =&gt; w_leoUI.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, false, true)],
[CMD.SORT_SIBLING_FO, () =&gt; w_leoUI.command(LEOCMD.SORT_SIBLINGS, U, REFRESH_TREE, true, true)],

</t>
<t tx="felix.20201214150149.11">[CMD.MARK, (p_node: LeoOutlineNode) =&gt; w_leoUI.changeMark(true, p_node, true)],
[CMD.MARK_SELECTION, () =&gt; w_leoUI.changeMark(true, U, false)],
[CMD.MARK_SELECTION_FO, () =&gt; w_leoUI.changeMark(true, U, true)],

[CMD.UNMARK, (p_node: LeoOutlineNode) =&gt; w_leoUI.changeMark(false, p_node, true)],
[CMD.UNMARK_SELECTION, () =&gt; w_leoUI.changeMark(false, U, false)],
[CMD.UNMARK_SELECTION_FO, () =&gt; w_leoUI.changeMark(false, U, true)],

[CMD.UNMARK_ALL, () =&gt; w_leoUI.command(LEOCMD.UNMARK_ALL, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.12">[CMD.EXTRACT, () =&gt; w_leoUI.command(LEOCMD.EXTRACT, U, REFRESH_TREE_BODY, false)],
[CMD.EXTRACT_NAMES, () =&gt; w_leoUI.command(LEOCMD.EXTRACT_NAMES, U, REFRESH_TREE_BODY, false)],

</t>
<t tx="felix.20201214150149.13">[CMD.MOVE_DOWN, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_DOWN_SELECTION, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, false)],
[CMD.MOVE_DOWN_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_DOWN, U, REFRESH_TREE, true)],

[CMD.MOVE_LEFT, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_LEFT_SELECTION, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, false)],
[CMD.MOVE_LEFT_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_LEFT, U, REFRESH_TREE, true)],

[CMD.MOVE_RIGHT, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_RIGHT_SELECTION, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, false)],
[CMD.MOVE_RIGHT_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_RIGHT, U, REFRESH_TREE, true)],

[CMD.MOVE_UP, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_UP, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.MOVE_UP_SELECTION, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, false)],
[CMD.MOVE_UP_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.MOVE_PNODE_UP, U, REFRESH_TREE, true)],

</t>
<t tx="felix.20201214150149.14">[CMD.REDO, () =&gt; w_leoUI.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, false)],
[CMD.REDO_FO, () =&gt; w_leoUI.command(LEOCMD.REDO, U, REFRESH_TREE_BODY, true)],
[CMD.UNDO, () =&gt; w_leoUI.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, false)],
[CMD.UNDO_FO, () =&gt; w_leoUI.command(LEOCMD.UNDO, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.15">[CMD.SHOW_OUTLINE, () =&gt; w_leoUI.showOutline(true)], // Also focuses on outline
[CMD.SHOW_LOG, () =&gt; w_leoUI.showLogPane()],
[CMD.SHOW_BODY, () =&gt; w_leoUI.showBody(false)], // Also focuses on body
</t>
<t tx="felix.20201214150149.16">[CMD.COPY_MARKED, () =&gt; w_leoUI.command(LEOCMD.COPY_MARKED, U, REFRESH_TREE_BODY, true)],
[CMD.DIFF_MARKED_NODES, () =&gt; w_leoUI.command(LEOCMD.DIFF_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
[CMD.MARK_CHANGED_ITEMS, () =&gt; w_leoUI.command(LEOCMD.MARK_CHANGED_ITEMS, U, REFRESH_TREE_BODY, true)],
[CMD.MARK_SUBHEADS, () =&gt; w_leoUI.command(LEOCMD.MARK_SUBHEADS, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_MARKED_NODES, () =&gt; w_leoUI.command(LEOCMD.CLONE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
[CMD.DELETE_MARKED_NODES, () =&gt; w_leoUI.command(LEOCMD.DELETE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],
[CMD.MOVE_MARKED_NODES, () =&gt; w_leoUI.command(LEOCMD.MOVE_MARKED_NODES, U, REFRESH_TREE_BODY, true)],

</t>
<t tx="felix.20201214150149.17">[CMD.CLONE_FIND_ALL, () =&gt; w_leoUI.command(LEOCMD.CLONE_FIND_ALL, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_FIND_ALL_FLATTENED, () =&gt; w_leoUI.command(LEOCMD.CLONE_FIND_ALL_FLATTENED, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_FIND_MARKED, () =&gt; w_leoUI.command(LEOCMD.CLONE_FIND_MARKED, U, REFRESH_TREE_BODY, true)],
[CMD.CLONE_FIND_FLATTENED_MARKED, () =&gt; w_leoUI.command(LEOCMD.CLONE_FIND_FLATTENED_MARKED, U, REFRESH_TREE_BODY, true)],

// [CMD.SET_FIND_EVERYWHERE_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.ENTIRE_OUTLINE)],
// [CMD.SET_FIND_NODE_ONLY_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.NODE_ONLY)],
// [CMD.SET_FIND_SUBOUTLINE_ONLY_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SUBOUTLINE_ONLY)],
// [CMD.TOGGLE_FIND_IGNORE_CASE_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.IGNORE_CASE)],
// [CMD.TOGGLE_FIND_MARK_CHANGES_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.MARK_CHANGES)],
// [CMD.TOGGLE_FIND_MARK_FINDS_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.MARK_FINDS)],
// [CMD.TOGGLE_FIND_REGEXP_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.REG_EXP)],
// [CMD.TOGGLE_FIND_WORD_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.WHOLE_WORD)],
// [CMD.TOGGLE_FIND_SEARCH_BODY_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SEARCH_BODY)],
// [CMD.TOGGLE_FIND_SEARCH_HEADLINE_OPTION, () =&gt; w_leoUI.setSearchSetting(Constants.FIND_INPUTS_IDS.SEARCH_HEADLINE)],

[CMD.SET_ENABLE_PREVIEW, () =&gt; w_leoUI.config.setEnablePreview()],
[CMD.CLEAR_CLOSE_EMPTY_GROUPS, () =&gt; w_leoUI.config.clearCloseEmptyGroups()],
[CMD.SET_CLOSE_ON_FILE_DELETE, () =&gt; w_leoUI.config.setCloseOnFileDelete()],
</t>
<t tx="felix.20201214150149.2">@others
</t>
<t tx="felix.20201214150149.3">[CMD.EXECUTE, () =&gt; w_leoUI.command(LEOCMD.EXECUTE_SCRIPT, U, REFRESH_TREE_BODY, false)],

[CMD.MINIBUFFER, () =&gt; w_leoUI.minibuffer()], // Is referenced in package.json

[CMD.CLICK_BUTTON, (p_node: LeoButtonNode) =&gt; w_leoUI.clickAtButton(p_node)], // Not referenced in package.json
[CMD.REMOVE_BUTTON, (p_node: LeoButtonNode) =&gt; w_leoUI.removeAtButton(p_node)],
</t>
<t tx="felix.20201214150149.4">[CMD.CLOSE_FILE, () =&gt; w_leoUI.closeLeoFile()],
[CMD.NEW_FILE, () =&gt; w_leoUI.newLeoFile()],

[CMD.OPEN_FILE, (p_uri?: vscode.Uri) =&gt; w_leoUI.openLeoFile(p_uri)],

[CMD.RECENT_FILES, () =&gt; w_leoUI.showRecentLeoFiles()],
[CMD.SAVE_AS_FILE, () =&gt; w_leoUI.saveAsLeoFile()],
[CMD.SAVE_FILE, () =&gt; w_leoUI.saveLeoFile()],
[CMD.SAVE_FILE_FO, () =&gt; w_leoUI.saveLeoFile(true)],
[CMD.SWITCH_FILE, () =&gt; w_leoUI.switchLeoFile()],

[CMD.SET_OPENED_FILE, (p_index: number) =&gt; w_leoUI.selectOpenedLeoDocument(p_index)],

[CMD.REFRESH_FROM_DISK, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.REFRESH_FROM_DISK, p_node, REFRESH_TREE_BODY, false)],

[CMD.REFRESH_FROM_DISK_SELECTION, () =&gt; w_leoUI.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, false)],

[CMD.REFRESH_FROM_DISK_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.REFRESH_FROM_DISK, U, REFRESH_TREE_BODY, true)],

[CMD.GIT_DIFF, () =&gt; w_leoUI.command(LEOCMD.GIT_DIFF, U, REFRESH_TREE_BODY, false)],
</t>
<t tx="felix.20201214150149.5">[CMD.HEADLINE, (p_node: LeoOutlineNode) =&gt; w_leoUI.editHeadline(p_node, true)],
[CMD.HEADLINE_SELECTION, () =&gt; w_leoUI.editHeadline(U, false)],
[CMD.HEADLINE_SELECTION_FO, () =&gt; w_leoUI.editHeadline(U, true)],
</t>
<t tx="felix.20201214150149.6">// cut/copy/paste/delete given node.
[CMD.COPY, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.COPY_PNODE, p_node, NO_REFRESH, true, true)],
[CMD.CUT, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.CUT_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.DELETE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.DELETE_PNODE, p_node, REFRESH_TREE_BODY, true, true)],
[CMD.PASTE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.PASTE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],
[CMD.PASTE_CLONE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, p_node, REFRESH_TREE_BODY, true, false)],

// cut/copy/paste/delete current selection (self.commander.p)
[CMD.COPY_SELECTION, () =&gt; w_leoUI.command(LEOCMD.COPY_PNODE, U, NO_REFRESH, false)],
[CMD.CUT_SELECTION, () =&gt; w_leoUI.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.CUT_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.CUT_PNODE, U, REFRESH_TREE_BODY, true)],
[CMD.DELETE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.DELETE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.DELETE_PNODE, U, REFRESH_TREE_BODY, true)],
[CMD.PASTE_CLONE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.PASTE_CLONE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.PASTE_CLONE_PNODE, U, REFRESH_TREE_BODY, true)],
[CMD.PASTE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, false)],
[CMD.PASTE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.PASTE_PNODE, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.7">// Called by nodes in the tree when selected either by mouse, or with enter
[CMD.SELECT_NODE, (p_node: LeoOutlineNode) =&gt; w_leoUI.selectTreeNode(p_node.position, false, false)],
[CMD.OPEN_ASIDE, (p_node: LeoOutlineNode) =&gt; w_leoUI.selectTreeNode(p_node.position, false, true)],

[CMD.CONTRACT_ALL, () =&gt; w_leoUI.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, false)],
[CMD.CONTRACT_ALL_FO, () =&gt; w_leoUI.command(LEOCMD.CONTRACT_ALL, U, REFRESH_TREE_BODY, true)],

[CMD.CONTRACT_OR_GO_LEFT, () =&gt; w_leoUI.command(LEOCMD.CONTRACT_OR_GO_LEFT, U, REFRESH_TREE_BODY, true)],
[CMD.EXPAND_AND_GO_RIGHT, () =&gt; w_leoUI.command(LEOCMD.EXPAND_AND_GO_RIGHT, U, REFRESH_TREE_BODY, true)],
</t>
<t tx="felix.20201214150149.8">[CMD.GOTO_NEXT_CLONE, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, p_node, REFRESH_NODE_BODY, true)],
[CMD.GOTO_NEXT_CLONE_SELECTION, () =&gt; w_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, false)],
[CMD.GOTO_NEXT_CLONE_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.GOTO_NEXT_CLONE, U, REFRESH_NODE_BODY, true)],

[CMD.GOTO_NEXT_MARKED, () =&gt; w_leoUI.command(LEOCMD.GOTO_NEXT_MARKED, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_FIRST_VISIBLE, () =&gt; w_leoUI.command(LEOCMD.GOTO_FIRST_VISIBLE, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_LAST_SIBLING, () =&gt; w_leoUI.command(LEOCMD.GOTO_LAST_SIBLING, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_LAST_VISIBLE, () =&gt; w_leoUI.command(LEOCMD.GOTO_LAST_VISIBLE, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_NEXT_VISIBLE, () =&gt; w_leoUI.command(LEOCMD.GOTO_NEXT_VISIBLE, U, REFRESH_NODE_BODY, true)],
[CMD.GOTO_PREV_VISIBLE, () =&gt; w_leoUI.command(LEOCMD.GOTO_PREV_VISIBLE, U, REFRESH_NODE_BODY, true)],

[CMD.PAGE_UP, () =&gt; w_leoUI.command(LEOCMD.PAGE_UP, U, REFRESH_NODE_BODY, true)],
[CMD.PAGE_DOWN, () =&gt; w_leoUI.command(LEOCMD.PAGE_DOWN, U, REFRESH_NODE_BODY, true)],
</t>
<t tx="felix.20201214150149.9">[CMD.DEHOIST, () =&gt; w_leoUI.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, false)],
[CMD.DEHOIST_FO, () =&gt; w_leoUI.command(LEOCMD.DEHOIST, U, REFRESH_TREE_BODY, true)],
[CMD.HOIST, (p_node: LeoOutlineNode) =&gt; w_leoUI.command(LEOCMD.HOIST_PNODE, p_node, REFRESH_TREE_BODY, true)],
[CMD.HOIST_SELECTION, () =&gt; w_leoUI.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, false)],
[CMD.HOIST_SELECTION_FO, () =&gt; w_leoUI.command(LEOCMD.HOIST_PNODE, U, REFRESH_TREE, true)],
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
    // TODO
    GOTO_GLOBAL_LINE: Constants.NAME + ".gotoGlobalLine",
    TAG_CHILDREN: Constants.NAME + ".tagChildren",
    SET_FIND_EVERYWHERE_OPTION: Constants.NAME + ".setFindEverywhereOption",
    SET_FIND_NODE_ONLY_OPTION: Constants.NAME + ".setFindNodeOnlyOption",
    SET_FIND_SUBOUTLINE_ONLY_OPTION: Constants.NAME + ".setFindSuboutlineOnlyOption",
    TOGGLE_FIND_IGNORE_CASE_OPTION: Constants.NAME + ".toggleFindIgnoreCaseOption",
    TOGGLE_FIND_MARK_CHANGES_OPTION: Constants.NAME + ".toggleFindMarkChangesOption",
    TOGGLE_FIND_MARK_FINDS_OPTION: Constants.NAME + ".toggleFindMarkFindsOption",
    TOGGLE_FIND_REGEXP_OPTION: Constants.NAME + ".toggleFindRegexpOption",
    TOGGLE_FIND_WORD_OPTION: Constants.NAME + ".toggleFindWordOption",
    TOGGLE_FIND_SEARCH_BODY_OPTION: Constants.NAME + ".toggleFindSearchBodyOption",
    TOGGLE_FIND_SEARCH_HEADLINE_OPTION: Constants.NAME + ".toggleFindSearchHeadlineOption",
    SET_ENABLE_PREVIEW: Constants.NAME + ".setEnablePreview",
    CLEAR_CLOSE_EMPTY_GROUPS: Constants.NAME + ".clearCloseEmptyGroups",
    SET_CLOSE_ON_FILE_DELETE: Constants.NAME + ".setCloseOnFileDelete"
};

</t>
<t tx="felix.20201214151326.11">/**
 * Leo command names that are called from vscode's gui/menu/buttons/keybindings triggers
 * TODO : CALL DIRECT LEO CORE METHODS (DELETE LEO_COMMANDS WHEN DONE)
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

public static TREEVIEW_ID: string = "leojsOutline";
public static TREEVIEW_EXPLORER_ID: string = "leojsOutlineExplorer";

public static DOCUMENTS_ID: string = "leojsDocuments";
public static DOCUMENTS_EXPLORER_ID: string = "leojsDocumentsExplorer";

public static BUTTONS_ID: string = "leojsButtons";
public static BUTTONS_EXPLORER_ID: string = "leojsButtonsExplorer";

public static FILE_EXTENSION: string = "leojs";
public static URI_LEO_SCHEME: string = "leojs";
public static URI_FILE_SCHEME: string = "file";
public static URI_SCHEME_HEADER: string = "leojs:/";
public static FILE_OPEN_FILTER_MESSAGE: string = "Leojs Files";
public static UNTITLED_FILE_NAME: string = "untitled";
public static RECENT_FILES_KEY: string = "leojsRecentFiles";
public static LAST_FILES_KEY: string = "leojsLastFiles";

public static REFRESH_DEBOUNCE_DELAY: number = 50;
public static STATES_DEBOUNCE_DELAY: number = 100;
public static DOCUMENTS_DEBOUNCE_DELAY: number = 100;

public static CONFIG_NAME: string = "leojs";
public static CONFIG_WORKBENCH_ENABLED_PREVIEW: string = "workbench.editor.enablePreview";
public static CONFIG_REFRESH_MATCH: string = "OnNodes"; // substring to distinguish 'on-hover' icon commands
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
    QUICK_OPEN_LEO_COMMANDS: "&gt;leojs: ",
    EXPLORER_TREEVIEW_PREFIX: "LEOJS ",
    TREEVIEW_TITLE: "OUTLINE",
    BODY_TITLE: "LEOJS BODY",
    LOG_PANE_TITLE: "Leojs Log Window",
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
    OPEN_WITH_LEOJS: "Open this Leojs file?",
    OPEN_RECENT_FILE: "Open Recent Leojs File",
    RIGHT_CLICK_TO_OPEN: "Right-click to open with leojs",
    FILE_ALREADY_OPENED: "Leojs file already opened",
    CHOOSE_OPENED_FILE: "Select an opened Leojs File",
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
    STATUSBAR_TOOLTIP_ON: "Leojs Key Bindings are in effect",
    STATUSBAR_TOOLTIP_OFF: "Leojs Key Bindings off",
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
    LEO_READY: "leojsReady", // Extension activated and classes created and ready
    TREE_OPENED: "leojsTreeOpened", // At least one Leo file opened
    TREE_TITLED: "leojsTreeTitled", // Tree is a Leo file and not a new untitled document
    SERVER_STARTED: "leojsServerStarted", // Auto-start or manually started
    // 'states' flags for currently opened tree view
    LEO_CHANGED: "leojsChanged",
    LEO_CAN_UNDO: "leojsCanUndo",
    LEO_CAN_REDO: "leojsCanRedo",
    LEO_CAN_DEMOTE: "leojsCanDemote",
    LEO_CAN_PROMOTE: "leojsCanPromote",
    LEO_CAN_DEHOIST: "leojsCanDehoist",
    // 'states' flags about current selection, for visibility and commands availability
    SELECTED_MARKED: "leojsMarked", // no need for unmarked here, use !leojsMarked
    SELECTED_CLONE: "leojsCloned",
    SELECTED_DIRTY: "leojsDirty",
    SELECTED_EMPTY: "leojsEmpty",
    SELECTED_CHILD: "leojsChild", // Has children
    SELECTED_ATFILE: "LeojsAtFile", // Can be refreshed
    SELECTED_ROOT: "leojsRoot", // ! Computed by hand
    // Statusbar Flag 'keybindings in effect'
    LEO_SELECTED: "leojsObjectSelected", // keybindings "On": Outline or body has focus
    // Context Flags for 'when' clauses, used concatenated, for each outline node
    NODE_MARKED: "leojsNodeMarked",  // Selected node is marked
    NODE_UNMARKED: "leojsNodeUnmarked", // Selected node is unmarked (Needed for regexp)
    NODE_ATFILE: "leojsNodeAtFile", // Selected node is an @file or @clean, etc...
    NODE_CLONED: "leojsNodeCloned",
    NODE_ROOT: "leojsNodeRoot",
    NODE_NOT_ROOT: "leojsNodeNotRoot",
    // Flags for Leo documents tree view icons and hover node command buttons
    DOCUMENT_SELECTED_TITLED: "leojsDocumentSelectedTitled",
    DOCUMENT_TITLED: "leojsDocumentTitled",
    DOCUMENT_SELECTED_UNTITLED: "leojsDocumentSelectedUntitled",
    DOCUMENT_UNTITLED: "leojsDocumentUntitled",
    // UI
    //LEO_TREE_BROWSE: "leojsTreeBrowse", // Override vscode's tree behavior with Leo's own
    //TREE_IN_EXPLORER: Constants.CONFIG_NAMES.TREE_IN_EXPLORER, // Leo outline also in the explorer view

    // SHOW_EDIT: "leojsShowEditOnNodes",
    // SHOW_ARROWS: "leojsShowArrowsOnNodes",
    // SHOW_ADD: "leojsShowAddOnNodes",
    // SHOW_MARK: "leojsShowMarkOnNodes",
    // SHOW_CLONE: "leojsShowCloneOnNodes",
    // SHOW_COPY: "leojsShowCopyOnNodes",

    LEO_TREE_BROWSE: Constants.name + Constants.CONFIG_NAMES.LEO_TREE_BROWSE[0].toUpperCase() + Constants.CONFIG_NAMES.LEO_TREE_BROWSE.slice(1), // Force ar'jan's suggestion of Leo's tree behavior override
    TREE_IN_EXPLORER: Constants.name + Constants.CONFIG_NAMES.TREE_IN_EXPLORER[0].toUpperCase() + Constants.CONFIG_NAMES.TREE_IN_EXPLORER.slice(1), // Leo outline also in the explorer view
    SHOW_OPEN_ASIDE: Constants.name + Constants.CONFIG_NAMES.SHOW_OPEN_ASIDE[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_OPEN_ASIDE.slice(1),   // Show 'open aside' in context menu
    SHOW_EDIT: Constants.name + Constants.CONFIG_NAMES.SHOW_EDIT[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EDIT.slice(1),              // Hover Icons on outline nodes
    SHOW_ARROWS: Constants.name + Constants.CONFIG_NAMES.SHOW_ARROWS[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_ARROWS.slice(1),           // Hover Icons on outline nodes
    SHOW_ADD: Constants.name + Constants.CONFIG_NAMES.SHOW_ADD[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_ADD.slice(1),                 // Hover Icons on outline nodes
    SHOW_MARK: Constants.name + Constants.CONFIG_NAMES.SHOW_MARK[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_MARK.slice(1),               // Hover Icons on outline nodes
    SHOW_CLONE: Constants.name + Constants.CONFIG_NAMES.SHOW_CLONE[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_CLONE.slice(1),             // Hover Icons on outline nodes
    SHOW_COPY: Constants.name + Constants.CONFIG_NAMES.SHOW_COPY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_COPY.slice(1),               // Hover Icons on outline nodes

    SHOW_EDITION_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_EDITION_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EDITION_BODY.slice(1),
    SHOW_CLIPBOARD_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_CLIPBOARD_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_CLIPBOARD_BODY.slice(1),
    SHOW_PROMOTE_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_PROMOTE_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_PROMOTE_BODY.slice(1),
    SHOW_EXECUTE_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_EXECUTE_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EXECUTE_BODY.slice(1),
    SHOW_EXTRACT_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_EXTRACT_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_EXTRACT_BODY.slice(1),
    SHOW_IMPORT_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_IMPORT_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_IMPORT_BODY.slice(1),
    SHOW_REFRESH_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_REFRESH_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_REFRESH_BODY.slice(1),
    SHOW_HOIST_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_HOIST_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_HOIST_BODY.slice(1),
    SHOW_MARK_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_MARK_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_MARK_BODY.slice(1),
    SHOW_SORT_BODY: Constants.name + Constants.CONFIG_NAMES.SHOW_SORT_BODY[0].toUpperCase() + Constants.CONFIG_NAMES.SHOW_SORT_BODY.slice(1)
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
import { Icon, LeoButton } from "./types";
import { LeoStates } from "./leoStates";


@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20201214151419.2">/**
 * * '@buttons' shown as a list with this TreeDataProvider implementation
 */
export class LeoButtonsProvider implements vscode.TreeDataProvider&lt;LeoButtonNode&gt; {

    private fakeAtButtons: LeoButton[] = [
        { name: 'script-button', index: 'nullButtonWidget' },
        { name: 'button name 2', index: 'key2' },
        { name: 'button name 3', index: 'key3' },
    ];

    private _onDidChangeTreeData: vscode.EventEmitter&lt;LeoButtonNode | undefined&gt; = new vscode.EventEmitter&lt;LeoButtonNode | undefined&gt;();

    readonly onDidChangeTreeData: vscode.Event&lt;LeoButtonNode | undefined&gt; = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _icons: Icon[],
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
        this.fakeAtButtons.forEach(p_button =&gt; {
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
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';

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
<t tx="felix.20201214151429.5">public getChildren(element?: LeoDocumentNode): LeoDocumentNode[] {
    const w_children: LeoDocumentNode[] = [];
    // if called with element, or not ready, give back empty array as there won't be any children
    if (this._leoStates.fileOpenedReady &amp;&amp; !element) {
        g.app.commandersList.forEach(p_doc =&gt; {
            w_children.push(new LeoDocumentNode(p_doc, this._leoUI));
        });
    }
    return w_children; // Defaults to an empty list of children
}

</t>
<t tx="felix.20201214151429.6">public getParent(element: LeoDocumentNode): vscode.ProviderResult&lt;LeoDocumentNode&gt; {
    // Leo documents are just a list, as such, entries are always child of root, so return null
    return undefined;
}

</t>
<t tx="felix.20201214151434.1">import * as vscode from "vscode";
import { Constants } from "./constants";
import { Icon } from "./types";
import * as utils from "./utils";
import { LeoUI } from "./leoUI";
import * as g from './core/leoGlobals';
import { Commands } from "./core/leoCommands";

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
        public documentEntry: Commands,
        private _leoJs: LeoUI
    ) {
        super(documentEntry.fileName());
        // Setup this instance
        const w_isNamed: boolean = !!this.documentEntry.fileName();
        this.label = w_isNamed ? utils.getFileFromPath(this.documentEntry.fileName()) : Constants.UNTITLED_FILE_NAME;
        this.tooltip = w_isNamed ? this.documentEntry.fileName() : Constants.UNTITLED_FILE_NAME;
        this.command = {
            command: Constants.COMMANDS.SET_OPENED_FILE,
            title: '',
            arguments: [g.app.commandersList.indexOf(this.documentEntry)]
        };
        // If this was created as a selected node, make sure it's selected as we may have opened/closed document
        // tslint:disable-next-line: strict-comparisons
        if (this.documentEntry === this._leoJs.leo_c) {
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
    return "p" + g.app.commandersList.indexOf(this.documentEntry) + "s" + this.documentEntry.fileName();
}

</t>
<t tx="felix.20201214151447.1">import * as vscode from "vscode";
import * as utils from "./utils";
import { LeoUI } from "./leoUI";
import { Constants } from "./constants";
import { LeoPackageStates } from "./types";
import { Position } from "./core/leoNodes";

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
<t tx="felix.20201214151447.21">public setSelectedNodeFlags(p_node: Position): void {
    this.leoRoot = false; // * RESET the root flag : It is set by vscode instead right after getting list of children for root of outline
    this.leoMarked = p_node.isMarked();
    this.leoCloned = p_node.isCloned();
    this.leoDirty = p_node.isDirty();
    this.leoEmpty = !p_node.v.hasBody();
    this.leoChild = p_node.hasChildren();
    this.leoAtFile = p_node.isAtFileNode();
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
import { LeoOutlineNode } from "./leoOutlineNode";

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
    node?: LeoOutlineNode | undefined; // We can START a stack with a targeted command
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
    node: LeoOutlineNode,
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
} from "./types";

import { Config } from "./config";
import { LeoOutlineNode } from "./leoOutlineNode";
import { LeoOutlineProvider } from './leoOutline';
import { LeoButtonNode } from "./leoButtonNode";
import { LeoButtonsProvider } from "./leoButtons";
import { LeoDocumentNode } from "./leoDocumentNode";
import { LeoDocumentsProvider } from "./leoDocuments";
import { LeoFilesBrowser } from "./leoFileBrowser";
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';
import { LoadManager } from "./core/leoApp";
import { NodeIndices, Position, VNode } from "./core/leoNodes";
import { Commands } from "./core/leoCommands";
import { LeoBodyProvider } from "./leoBody";

/**
 * Creates and manages instances of the UI elements along with their events
 */
export class LeoUI {
    // * State flags
    public leoStates: LeoStates;
    public verbose: boolean = false;
    public trace: boolean = false;

    // * Configuration Settings Service
    public config: Config; // Public configuration service singleton, used in leoSettingsWebview, leoBridge, and leoNode for inverted contrast

    // * Icon Paths (Singleton static arrays)
    public nodeIcons: Icon[] = [];
    public documentIcons: Icon[] = [];
    public buttonIcons: Icon[] = [];

    // * File Browser
    private _leoFilesBrowser: LeoFilesBrowser; // Browsing dialog service singleton used in the openLeoFile and save-as methods

    public leo_c: Commands;

    private _refreshType: ReqRefresh = {}; // Flags for commands to require parts of UI to refresh
    private _revealType: RevealType = RevealType.NoReveal; // Type of reveal for the selected node (when refreshing outline)
    private _preventShowBody = false; // Used when refreshing treeview from config: It requires not to open the body pane when refreshing.
    private _fromOutline: boolean = false; // flag to leave focus on outline instead of body when finished refreshing

    // * Outline Pane
    private _leoTreeProvider: LeoOutlineProvider; // TreeDataProvider single instance
    private _leoTreeView: vscode.TreeView&lt;Position&gt;; // Outline tree view added to the Tree View Container with an Activity Bar icon
    private _leoTreeExView: vscode.TreeView&lt;Position&gt;; // Outline tree view added to the Explorer Sidebar
    private _lastTreeView: vscode.TreeView&lt;Position&gt;; // Last visible treeview

    // * Body pane
    private _bodyFileSystemStarted: boolean = false;
    private _bodyEnablePreview: boolean = true;
    private _leoFileSystem: LeoBodyProvider; // as per https://code.visualstudio.com/api/extension-guides/virtual-documents#file-system-api
    private _bodyTextDocument: vscode.TextDocument | undefined; // Set when selected in tree by user, or opening a Leo file in showBody. and by _locateOpenedBody.
    private _bodyMainSelectionColumn: vscode.ViewColumn | undefined; // Column of last body 'textEditor' found, set to 1

    private _bodyUri: vscode.Uri = utils.strToLeoUri("");
    get bodyUri(): vscode.Uri {
        return this._bodyUri;
    }
    set bodyUri(p_uri: vscode.Uri) {
        this._leoFileSystem.setBodyTime(p_uri);
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

    constructor(private _context: vscode.ExtensionContext) {
        // * Setup States
        this.leoStates = new LeoStates(_context, this);

        // * Get configuration settings
        this.config = new Config(_context, this);
        // * also check workbench.editor.enablePreview
        this.config.buildFromSavedSettings();
        this._bodyEnablePreview = !!vscode.workspace
            .getConfiguration('workbench.editor')
            .get('enablePreview');

        // * Build Icon filename paths
        this.nodeIcons = utils.buildNodeIconPaths(_context);
        this.documentIcons = utils.buildDocumentIconPaths(_context);
        this.buttonIcons = utils.buildButtonsIconPaths(_context);

        g.app.gui = this;
        g.app.loadManager = new LoadManager();
        // g.app.loadManager.computeStandardDirectories()
        if (!g.app.setLeoID(false, true)) {
            throw new Error("unable to set LeoID.");
        }
        g.app.inBridge = true;  // Added 2007/10/21: support for g.getScript.
        g.app.nodeIndices = new NodeIndices(g.app.leoID);

        console.log('Leo started, LeoId:', g.app.leoID);

        // IF RECENT FILES LIST :
        //      TODO: CHECK RECENT LEO FILE LIST AND OPEN THEM
        //      g.app.loadManager.load(fileName, pymacs)
        // ELSE :
        //      TODO: CREATE NEW LEO OUTLINE (demo below)

        // ************************************************************
        // * demo test: CREATE NEW LEO OUTLINE: NEW COMMANDER
        // ************************************************************
        let w_c = g.app.newCommander("", this);

        // Equivalent to leoBridge 'createFrame' method
        let w_v = new VNode(w_c);
        let w_p = new Position(w_v);
        w_v.initHeadString("NewHeadline");

        // #1631: Initialize here, not in p._linkAsRoot.
        w_c.hiddenRootNode.children = [];

        // New in Leo 4.5: p.moveToRoot would be wrong: the node hasn't been linked yet.
        w_p._linkAsRoot();

        g.app.commandersList.push(w_c);

        // select first test commander
        this.leo_c = g.app.commandersList[0];

        // ************************************************************
        // * demo test: BUILD SOME TEST OUTLINE
        // ************************************************************
        let w_node = this.leo_c.p;
        w_node.initHeadString("node1");
        w_node.setBodyString('node1 body');
        w_node.expand();

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("node Inside1");
        w_node.setBodyString('nodeInside1 body');
        w_node.setMarked();

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("node with UserData Inside2");
        w_node.setBodyString('node Inside2 body');
        w_node.u = { a: 'user content string a', b: "user content also" };

        w_node = this.leo_c.p.insertAfter();
        w_node.initHeadString("@file node3");
        w_node.setBodyString('node 3 body');

        w_node = this.leo_c.p.insertAfter();
        w_node.initHeadString("node 2 selected but empty");
        w_c.setCurrentPosition(w_node);

        // ************************************************************
        // * demo test: SOME OTHER COMMANDER
        // ************************************************************
        w_c = g.app.newCommander("", this);
        w_v = new VNode(w_c);
        w_p = new Position(w_v);
        w_v.initHeadString("NewHeadline");
        w_c.hiddenRootNode.children = [];
        w_p._linkAsRoot();
        g.app.commandersList.push(w_c);

        // select second test commander
        this.leo_c = w_c;

        // ************************************************************
        // * demo test: BUILD SOME OTHER TEST OUTLINE
        // ************************************************************
        w_node = this.leo_c.p;
        w_node.initHeadString("some other title");
        w_node.setBodyString('body text');

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("yet another node");
        w_node.setBodyString('more body text\nwith a second line');

        w_node = this.leo_c.p.insertAfter();
        w_node.initHeadString("@clean my-file.txt");
        w_node.setBodyString('again some body text');
        w_c.setCurrentPosition(w_node);

        w_node = this.leo_c.p.insertAsLastChild();
        w_node.initHeadString("sample cloned node");
        w_node.setBodyString('some other body');
        w_node.clone();

        w_node = this.leo_c.p.insertAfter();
        w_node.setMarked();
        w_node.initHeadString("a different headline");

        // back to first test commander after creating this second one
        this.leo_c = g.app.commandersList[0];
        // ************************************************************
        // * demo test end
        // ************************************************************

        // * Create file browser instance
        this._leoFilesBrowser = new LeoFilesBrowser(_context);

        // * Create a single data provider for both outline trees, Leo view and Explorer view
        this._leoTreeProvider = new LeoOutlineProvider(this.nodeIcons, this);
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
        this._leoDocumentsProvider = new LeoDocumentsProvider(this.leoStates, this);
        this._leoDocuments = vscode.window.createTreeView(Constants.DOCUMENTS_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._leoDocuments.onDidChangeVisibility((p_event =&gt; this._onDocTreeViewVisibilityChanged(p_event, false)));
        this._leoDocumentsExplorer = vscode.window.createTreeView(Constants.DOCUMENTS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoDocumentsProvider });
        this._leoDocumentsExplorer.onDidChangeVisibility((p_event =&gt; this._onDocTreeViewVisibilityChanged(p_event, true)));

        // * Create '@buttons' Treeview Providers and tree views
        this._leoButtonsProvider = new LeoButtonsProvider(this.leoStates, this.buttonIcons);
        this._leoButtons = vscode.window.createTreeView(Constants.BUTTONS_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtons.onDidChangeVisibility((p_event =&gt; this._onButtonsTreeViewVisibilityChanged(p_event, false)));
        this._leoButtonsExplorer = vscode.window.createTreeView(Constants.BUTTONS_EXPLORER_ID, { showCollapseAll: false, treeDataProvider: this._leoButtonsProvider });
        this._leoButtonsExplorer.onDidChangeVisibility((p_event =&gt; this._onButtonsTreeViewVisibilityChanged(p_event, true)));

        // * Create Body Pane
        this._leoFileSystem = new LeoBodyProvider(this);
        this._bodyMainSelectionColumn = 1;

        // * Create Status bar Entry
        // this._leoStatusBar = new LeoStatusBar(_context, this);

        // * Leo Find Panel
        // this._leoFindPanelProvider = new LeoFindPanelProvider(
        //     _context.extensionUri,
        //     _context,
        //     this
        // );
        // this._context.subscriptions.push(
        //     vscode.window.registerWebviewViewProvider(
        //         Constants.FIND_ID,
        //         this._leoFindPanelProvider,
        //         { webviewOptions: { retainContextWhenHidden: true } }
        //     )
        // );
        // this._context.subscriptions.push(
        //     vscode.window.registerWebviewViewProvider(
        //         Constants.FIND_EXPLORER_ID,
        //         this._leoFindPanelProvider,
        //         { webviewOptions: { retainContextWhenHidden: true } }
        //     )
        // );

        // * Configuration / Welcome webview
        // this.leoSettingsWebview = new LeoSettingsProvider(_context, this);



        // * React to change in active panel/text editor (window.activeTextEditor) - also fires when the active editor becomes undefined
        // vscode.window.onDidChangeActiveTextEditor((p_editor) =&gt;
        //     this._onActiveEditorChanged(p_editor)
        // );

        // * React to change in selection, cursor position and scroll position
        // vscode.window.onDidChangeTextEditorSelection((p_event) =&gt;
        //     this._onChangeEditorSelection(p_event)
        // );
        // vscode.window.onDidChangeTextEditorVisibleRanges((p_event) =&gt;
        //     this._onChangeEditorScroll(p_event)
        // );

        // * Triggers when a different text editor/vscode window changed focus or visibility, or dragged
        // This is also what triggers after drag and drop, see '_onChangeEditorViewColumn'
        // vscode.window.onDidChangeTextEditorViewColumn((p_columnChangeEvent) =&gt;
        //     this._changedTextEditorViewColumn(p_columnChangeEvent)
        // ); // Also triggers after drag and drop
        // vscode.window.onDidChangeVisibleTextEditors((p_editors) =&gt;
        //     this._changedVisibleTextEditors(p_editors)
        // ); // Window.visibleTextEditors changed
        // vscode.window.onDidChangeWindowState((p_windowState) =&gt;
        //     this._changedWindowState(p_windowState)
        // ); // Focus state of the current window changes

        // * React when typing and changing body pane
        // vscode.workspace.onDidChangeTextDocument((p_textDocumentChange) =&gt;
        //     this._onDocumentChanged(p_textDocumentChange)
        // );

        // * React to configuration settings events
        // vscode.workspace.onDidChangeConfiguration((p_configChange) =&gt;
        //     this._onChangeConfiguration(p_configChange)
        // );

        // * React to opening of any file in vscode
        // vscode.workspace.onDidOpenTextDocument((p_document) =&gt;
        //     this._onDidOpenTextDocument(p_document)
        // );




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

    /**
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

    /**
     * * Setup leoInteg's UI for having no opened Leo documents
     */
    private _setupNoOpenedLeoDocument(): void {
        this.leoStates.fileOpenedReady = false;
        this._bodyTextDocument = undefined;
        this._refreshOutline(false, RevealType.NoReveal);
        this.refreshDocumentsPane();
        this._leoButtonsProvider.refreshTreeRoot();
        this.closeBody();
    }

    /**
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

    /**
     * * Show the outline, with Leo's selected node also selected, and optionally focussed
     * @param p_focusOutline Flag for focus to be placed in outline
     */
    public showOutline(p_focusOutline?: boolean): void {
        this._lastTreeView.reveal(this.leo_c.p, {
            select: true,
            focus: p_focusOutline
        });
    }

    /**
     * * Refresh tree for 'node hover icons' to show up properly after changing their settings
     */
    public configTreeRefresh(): void {
        if (this.leoStates.fileOpenedReady) {
            this._preventShowBody = true;
            this._refreshOutline(true, RevealType.RevealSelect);
        }
    }

    /**
     * * Handle selected node being created for the outline
     * @param p_element Position that was just created and detected as selected node
     */
    public gotSelectedNode(p_element: Position): void {

        console.log('Got selected node:', p_element.h);

        if (this._revealType) {

            setTimeout(() =&gt; {
                this._lastTreeView.reveal(p_element, {
                    select: true,
                    focus: (this._revealType.valueOf() &gt;= RevealType.RevealSelectFocus.valueOf())
                });
                // Done so reset
                this._revealType = RevealType.NoReveal;
            }, 0);
        }

        // set context flags
        this.leoStates.setSelectedNodeFlags(p_element);

    }

    /**
     * * Setup global refresh options
     * @param p_focusOutline Flag for focus to be placed in outline
     * @param p_refreshType Refresh flags for each UI part
     */
    public _setupRefresh(p_focusOutline: boolean, p_refreshType: ReqRefresh): void {
        // Set final "focus-placement" and setup final refresh type, if command requires higher than the one setup so far
        this._fromOutline = p_focusOutline; // set directly
        Object.assign(this._refreshType, p_refreshType); // add all properties without replacing (only 'true' properties)
    }

    /**
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

    /**
     * * Refreshes the outline. A reveal type can be passed along to specify the reveal type for the selected node
     * @param p_revealType Facultative reveal type to specify type of reveal when the 'selected node' is encountered
     */
    private _refreshOutline(p_incrementTreeID: boolean, p_revealType?: RevealType): void {
        if (p_incrementTreeID) {
            this._leoTreeProvider.incTreeId();
        }
        if (p_revealType !== undefined &amp;&amp; p_revealType.valueOf() &gt;= this._revealType.valueOf()) { // To check if selected node should self-select while redrawing whole tree
            this._revealType = p_revealType; // To be read/cleared (in arrayToLeoNodesArray instead of directly by nodes)
        }

        console.log('refreshing');

        this._leoTreeProvider.refreshTreeRoot();

        // this._lastTreeView.reveal(this.leo_c.p).then(() =&gt; {

        // });


        // Force showing last used Leo outline first
        // if (this.lastSelectedNode &amp;&amp; !(this._leoTreeExView.visible || this._leoTreeView.visible)) {
        //     this._lastTreeView.reveal(this.lastSelectedNode.position)
        //         .then(() =&gt; {
        //             this._leoTreeProvider.refreshTreeRoot();
        //         });
        // } else {
        //     this._leoTreeProvider.refreshTreeRoot();
        // }
    }

    /**
     * * Public method exposed as 'refreshDocumentsPane' setter/getter to refresh the documents pane
     * Document Panel May be refreshed by other services (states service, ...)
     */
    private _refreshDocumentsPane(): void {
        this._leoDocumentsProvider.refreshTreeRoot();
    }

    /**
     * * Places selection on the required node with a 'timeout'. Used after refreshing the opened Leo documents view.
     * @param p_documentNode Document node instance in the Leo document view to be the 'selected' one.
     */
    public setDocumentSelection(p_documentNode: LeoDocumentNode): void {
        this._currentDocumentChanged = p_documentNode.documentEntry.changed;
        this.leoStates.leoOpenedFileName = p_documentNode.documentEntry.fileName();
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
            // tslint:disable-next-line: strict-comparisons
            if (w_docView.selection.length &amp;&amp; w_docView.selection[0] === p_documentNode) {
                console.log('setDocumentSelection: already selected!');
            } else {
                console.log('setDocumentSelection: selecting in tree');
                w_docView.reveal(p_documentNode, { select: true, focus: false });
            }

        }, 0);
    }

    /**
     * * Handles the node expanding and collapsing interactions by the user in the treeview
     * @param p_event The event passed by vscode
     * @param p_expand True if it was an expand, false if it was a collapse event
     * @param p_treeView Pointer to the treeview itself, either the standalone treeview or the one under the explorer
     */
    private _onChangeCollapsedState(p_event: vscode.TreeViewExpansionEvent&lt;Position&gt;, p_expand: boolean, p_treeView: vscode.TreeView&lt;Position&gt;): void {

        // * Expanding or collapsing via the treeview interface selects the node to mimic Leo

        // this.triggerBodySave(true);
        if (p_treeView.selection[0] &amp;&amp; p_treeView.selection[0].__eq__(p_event.element)) {
            // * This happens if the tree selection is the same as the expanded/collapsed node: Just have Leo do the same
            console.log('selection is the same as the expanded/collapsed node');
            // Pass
        } else {
            // * This part only happens if the user clicked on the arrow without trying to select the node
            this._lastTreeView.reveal(this.leo_c.p, { select: true, focus: false });
            this.selectTreeNode(p_event.element, true);  // not waiting for a .then(...) so not to add any lag
        }

        console.log('change collapse:  p_event', p_event);


        if (p_expand) {
            p_event.element.expand();
        } else {
            p_event.element.contract();
        }

        if (this.config.leoTreeBrowse) {
            this._refreshOutline(true, RevealType.RevealSelect);
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flag to signify that the treeview who triggered this event is the one in the explorer view
     */
    private _onTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_event.visible) {
            this._lastTreeView = p_explorerView ? this._leoTreeExView : this._leoTreeView;
            // ? needed ?
            // this._refreshOutline(true, RevealType.RevealSelect);
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onDocTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
        if (p_event.visible) {
            // ? needed ?
            // this.refreshDocumentsPane();
        }
    }

    /**
     * * Handle the change of visibility of either outline treeview and refresh it if its visible
     * @param p_event The treeview-visibility-changed event passed by vscode
     * @param p_explorerView Flags that the treeview who triggered this event is the one in the explorer view
     */
    private _onButtonsTreeViewVisibilityChanged(p_event: vscode.TreeViewVisibilityChangeEvent, p_explorerView: boolean): void {
        if (p_explorerView) { } // (Facultative/unused) Do something different if explorer view is used
        if (p_event.visible) {
            // ? needed ?
            // this._leoButtonsProvider.refreshTreeRoot();
        }
    }

    public selectTreeNode(p_node: Position, p_internalCall?: boolean, p_aside?: boolean): Thenable&lt;unknown&gt; {

        // Note: set context flags for current selection when capturing and revealing the selected node
        // when the tree refreshes and the selected node is processed by getTreeItem &amp; gotSelectedNode

        if (this.leo_c.positionExists(p_node)) {
            console.log('select node');

            this.leo_c.selectPosition(p_node);
        } else {
            console.error('Selected a non-existent position', p_node.h);
        }

        // this.lastSelectedNode = p_node;

        return Promise.resolve(true);
    }

    /**
     * Leo Command
     * @param p_cmd Command name string
     * @param p_node facultative, precise node onto which the command is run (also see p_keepSelection)
     * @param p_refreshType Object containing flags for sections needing to refresh after command ran
     * @param p_fromOutline flag to bring back focus on outline afterward
     * @param p_keepSelection flags to bring back selection on the original node before command ran
     */
    public command(
        p_cmd: string,
        p_node: LeoOutlineNode | undefined,
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

    /**
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

    public editHeadline(p_node?: LeoOutlineNode, p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

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

    public insertNode(p_node?: LeoOutlineNode, p_fromOutline?: boolean, p_interrupt?: boolean): Thenable&lt;unknown&gt; {

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

    public changeMark(p_mark: boolean, p_node?: LeoOutlineNode, p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

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

    public clickAtButton(p_node: LeoButtonNode): Thenable&lt;unknown&gt; {

        this._setupRefresh(false, { tree: true, body: true, documents: true, buttons: true, states: true });

        vscode.window.showInformationMessage('TODO: Implement clickAtButton' +
            " button: " + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public removeAtButton(p_node: LeoButtonNode): Thenable&lt;unknown&gt; {

        this._setupRefresh(false, { buttons: true });

        vscode.window.showInformationMessage('TODO: Implement removeAtButton' +
            " button: " + p_node.label);

        this.launchRefresh();

        // if edited and accepted
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public closeLeoFile(): Thenable&lt;unknown&gt; {

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

    public newLeoFile(): Thenable&lt;unknown&gt; {

        vscode.window.showInformationMessage('TODO: Implement newLeoFile');

        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        // if created
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public openLeoFile(p_uri?: vscode.Uri): Thenable&lt;unknown&gt; {

        vscode.window.showInformationMessage('TODO: Implement openLeoFile' +
            (p_uri ? " path: " + p_uri.fsPath : ""));

        // if opened
        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public showRecentLeoFiles(): Thenable&lt;unknown&gt; {
        vscode.window.showInformationMessage('TODO: Implement showRecentLeoFiles');

        // if shown, chosen and opened
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public saveAsLeoFile(p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

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

    public saveLeoFile(p_fromOutline?: boolean): Thenable&lt;unknown&gt; {

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

    public switchLeoFile(): Thenable&lt;unknown&gt; {

        vscode.window.showInformationMessage('TODO: Implement switchLeoFile');

        // vscode.window.showQuickPick(w_entries, w_pickOptions);
        //     then
        // return Promise.resolve(this.selectOpenedLeoDocument(p_chosenDocument.value));

        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    public selectOpenedLeoDocument(p_index: number): Thenable&lt;unknown&gt; {

        // vscode.window.showInformationMessage('TODO: Implement selectOpenedLeoDocument' +
        //     " index: " + p_index);
        console.log('select opened commander!');

        this.leo_c = g.app.commandersList[p_index];
        this._refreshOutline(true, RevealType.RevealSelect);

        const w_fakeOpenedFileInfo: any = undefined;
        this._setupOpenedLeoDocument(w_fakeOpenedFileInfo);

        // if selected and opened
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
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

    /**
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

    public showLogPane(): Thenable&lt;unknown&gt; {
        vscode.window.showInformationMessage('TODO: Implement showLogPane');

        // if shown
        return Promise.resolve(true);

        // return Promise.resolve(undefined); // if cancelled
    }

    /**
     * Test/Dummy command
     * @returns Thenable from the tested functionality
     */
    public test(): Thenable&lt;unknown&gt; {
        vscode.window.showInformationMessage("Test called!");
        console.log("Test called!");
        console.log("this.leo_c.p.isSelected()", this.leo_c.p.isSelected());
        return Promise.resolve(true);
    }



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
  "author": {
    "name": "Félix"
  },
  "license": "SEE LICENSE IN LICENSE",
  "repository": {
    "type": "git",
    "url": "https://github.com/boltex/leointeg"
  },
  "engines": {
    "vscode": "^1.60.0"
  },
  "keywords": [
    "leo",
    "literate",
    "tree",
    "outline",
    "programming"
  ],
  "categories": [
    "Other"
  ],
  "icon": "resources/leoapp128px.png",
  "galleryBanner": {
    "color": "#f1af88",
    "theme": "light"
  },
  "activationEvents": [
    "onStartupFinished"
  ],
  "qna": false,
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
  "category": "Leojs",
  "icon": {
    "light": "resources/light/folder.svg",
    "dark": "resources/dark/folder.svg"
  }
},
{
  "command": "leojs.recentLeoFiles",
  "category": "Leojs",
  "title": "Recent Files"
},
{
  "command": "leojs.switchLeoFile",
  "title": "Switch Leo File",
  "category": "Leojs",
  "icon": {
    "light": "resources/light/switch.svg",
    "dark": "resources/dark/switch.svg"
  }
},
{
  "command": "leojs.newLeoFile",
  "title": "New Leo File",
  "category": "Leojs",
  "icon": {
    "light": "resources/light/new-file.svg",
    "dark": "resources/dark/new-file.svg"
  }
},
{
  "command": "leojs.closeLeoFile",
  "title": "Close Leo File",
  "category": "Leojs",
  "icon": {
    "light": "resources/light/close.svg",
    "dark": "resources/dark/close.svg"
  }
},
{
  "command": "leojs.saveLeoFile",
  "category": "Leojs",
  "title": "Save Leo File",
  "icon": {
    "light": "resources/light/save.svg",
    "dark": "resources/dark/save.svg"
  }
},
{
  "command": "leojs.saveLeoFileFromOutline",
  "category": "Leojs",
  "title": "Save Leo File",
  "icon": {
    "light": "resources/light/save.svg",
    "dark": "resources/dark/save.svg"
  }
},
{
  "command": "leojs.saveAsLeoFile",
  "category": "Leojs",
  "title": "Save Leo File as...",
  "icon": {
    "light": "resources/light/save-as.svg",
    "dark": "resources/dark/save-as.svg"
  }
},
{
  "command": "leojs.refreshFromDisk",
  "category": "Leojs",
  "title": "Refresh from Disk"
},
{
  "command": "leojs.refreshFromDiskSelection",
  "category": "Leojs",
  "title": "Refresh from Disk"
},
{
  "command": "leojs.refreshFromDiskSelectionFromOutline",
  "category": "Leojs",
  "title": "Refresh from Disk"
},
{
  "command": "leojs.gitDiff",
  "category": "Leojs",
  "title": "Git Diff"
},
</t>
<t tx="felix.20201214205159.11">{
  "command": "leojs.openAside",
  "category": "Leojs",
  "title": "Open to the Side"
},
{
  "command": "leojs.contractAll",
  "category": "Leojs",
  "title": "Contract All",
  "icon": {
    "light": "resources/light/collapse.svg",
    "dark": "resources/dark/collapse.svg"
  }
},
{
  "command": "leojs.contractAllFromOutline",
  "category": "Leojs",
  "title": "Contract All",
  "icon": {
    "light": "resources/light/collapse.svg",
    "dark": "resources/dark/collapse.svg"
  }
},
</t>
<t tx="felix.20201214205159.12">{
  "command": "leojs.editHeadline",
  "category": "Leojs",
  "title": "Edit Headline",
  "icon": {
    "light": "resources/light/edit.svg",
    "dark": "resources/dark/edit.svg"
  }
},
{
  "command": "leojs.editSelectedHeadline",
  "category": "Leojs",
  "title": "Edit Headline"
},
{
  "command": "leojs.editSelectedHeadlineFromOutline",
  "category": "Leojs",
  "title": "Edit Headline"
},
</t>
<t tx="felix.20201214205159.13">{
  "command": "leojs.mark",
  "category": "Leojs",
  "title": "Mark",
  "icon": {
    "light": "resources/light/mark.svg",
    "dark": "resources/dark/mark.svg"
  }
},
{
  "command": "leojs.markSelection",
  "category": "Leojs",
  "title": "Mark"
},
{
  "command": "leojs.markSelectionFromOutline",
  "category": "Leojs",
  "title": "Mark"
},
{
  "command": "leojs.unmark",
  "category": "Leojs",
  "title": "Unmark",
  "icon": {
    "light": "resources/light/unmark.svg",
    "dark": "resources/dark/unmark.svg"
  }
},
{
  "command": "leojs.unmarkSelection",
  "category": "Leojs",
  "title": "Unmark"
},
{
  "command": "leojs.unmarkSelectionFromOutline",
  "category": "Leojs",
  "title": "Unmark"
},
{
  "command": "leojs.unmarkAll",
  "category": "Leojs",
  "title": "Unmark All"
},
</t>
<t tx="felix.20201214205159.14">{
  "command": "leojs.copyNode",
  "category": "Leojs",
  "title": "Copy Node",
  "icon": {
    "light": "resources/light/clipboard.svg",
    "dark": "resources/dark/clipboard.svg"
  }
},
{
  "command": "leojs.copyNodeSelection",
  "category": "Leojs",
  "title": "Copy Node"
},
{
  "command": "leojs.cutNode",
  "category": "Leojs",
  "title": "Cut Node"
},
{
  "command": "leojs.cutNodeSelection",
  "category": "Leojs",
  "title": "Cut Node"
},
{
  "command": "leojs.cutNodeSelectionFromOutline",
  "category": "Leojs",
  "title": "Cut Node"
},
{
  "command": "leojs.pasteNode",
  "category": "Leojs",
  "title": "Paste Node"
},
{
  "command": "leojs.pasteNodeAtSelection",
  "category": "Leojs",
  "title": "Paste Node"
},
{
  "command": "leojs.pasteNodeAtSelectionFromOutline",
  "category": "Leojs",
  "title": "Paste Node"
},
{
  "command": "leojs.pasteNodeAsClone",
  "category": "Leojs",
  "title": "Paste Node as Clone"
},
{
  "command": "leojs.pasteNodeAsCloneAtSelection",
  "category": "Leojs",
  "title": "Paste Node as Clone"
},
{
  "command": "leojs.pasteNodeAsCloneAtSelectionFromOutline",
  "category": "Leojs",
  "title": "Paste Node as Clone"
},
{
  "command": "leojs.delete",
  "category": "Leojs",
  "title": "Delete",
  "icon": {
    "light": "resources/light/close.svg",
    "dark": "resources/dark/close.svg"
  }
},
{
  "command": "leojs.deleteSelection",
  "category": "Leojs",
  "title": "Delete Node"
},
{
  "command": "leojs.deleteSelectionFromOutline",
  "category": "Leojs",
  "title": "Delete Node"
},
</t>
<t tx="felix.20201214205159.15">{
  "command": "leojs.extract",
  "category": "Leojs",
  "title": "Extract"
},
{
  "command": "leojs.extractNames",
  "category": "Leojs",
  "title": "Extract Names"
},
</t>
<t tx="felix.20201214205159.16">{
  "command": "leojs.moveOutlineDown",
  "category": "Leojs",
  "title": "Move Outline Down",
  "icon": {
    "light": "resources/light/arrow-down.svg",
    "dark": "resources/dark/arrow-down.svg"
  }
},
{
  "command": "leojs.moveOutlineDownSelection",
  "category": "Leojs",
  "title": "Move Outline Down"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "category": "Leojs",
  "title": "Move Outline Down"
},
{
  "command": "leojs.moveOutlineLeft",
  "category": "Leojs",
  "title": "Move Outline Left",
  "icon": {
    "light": "resources/light/arrow-left.svg",
    "dark": "resources/dark/arrow-left.svg"
  }
},
{
  "command": "leojs.moveOutlineLeftSelection",
  "category": "Leojs",
  "title": "Move Outline Left"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "category": "Leojs",
  "title": "Move Outline Left"
},
{
  "command": "leojs.moveOutlineRight",
  "category": "Leojs",
  "title": "Move Outline Right",
  "icon": {
    "light": "resources/light/arrow-right.svg",
    "dark": "resources/dark/arrow-right.svg"
  }
},
{
  "command": "leojs.moveOutlineRightSelection",
  "category": "Leojs",
  "title": "Move Outline Right"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "category": "Leojs",
  "title": "Move Outline Right"
},
{
  "command": "leojs.moveOutlineUp",
  "category": "Leojs",
  "title": "Move Outline Up",
  "icon": {
    "light": "resources/light/arrow-up.svg",
    "dark": "resources/dark/arrow-up.svg"
  }
},
{
  "command": "leojs.moveOutlineUpSelection",
  "category": "Leojs",
  "title": "Move Outline Up"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "category": "Leojs",
  "title": "Move Outline Up"
},
</t>
<t tx="felix.20201214205159.17">{
  "command": "leojs.insertNode",
  "category": "Leojs",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.insertNodeSelection",
  "category": "Leojs",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.insertNodeSelectionFromOutline",
  "category": "Leojs",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.insertNodeSelectionInterrupt",
  "category": "Leojs",
  "title": "Insert Node",
  "icon": {
    "light": "resources/light/plus.svg",
    "dark": "resources/dark/plus.svg"
  }
},
{
  "command": "leojs.cloneNode",
  "category": "Leojs",
  "title": "Clone Node",
  "icon": {
    "light": "resources/light/link.svg",
    "dark": "resources/dark/link.svg"
  }
},
{
  "command": "leojs.cloneNodeSelection",
  "category": "Leojs",
  "title": "Clone Node"
},
{
  "command": "leojs.cloneNodeSelectionFromOutline",
  "category": "Leojs",
  "title": "Clone Node"
},
{
  "command": "leojs.promote",
  "category": "Leojs",
  "title": "Promote Children"
},
{
  "command": "leojs.promoteSelection",
  "category": "Leojs",
  "title": "Promote Children"
},
{
  "command": "leojs.promoteSelectionFromOutline",
  "category": "Leojs",
  "title": "Promote Children"
},
{
  "command": "leojs.demote",
  "category": "Leojs",
  "title": "Demote Siblings"
},
{
  "command": "leojs.demoteSelection",
  "category": "Leojs",
  "title": "Demote Siblings"
},
{
  "command": "leojs.demoteSelectionFromOutline",
  "category": "Leojs",
  "title": "Demote Siblings"
},
{
  "command": "leojs.sortChildrenSelection",
  "category": "Leojs",
  "title": "Sort Children"
},
{
  "command": "leojs.sortChildrenSelectionFromOutline",
  "category": "Leojs",
  "title": "Sort Children"
},
{
  "command": "leojs.sortSiblingsSelection",
  "category": "Leojs",
  "title": "Sort Siblings"
},
{
  "command": "leojs.sortSiblingsSelectionFromOutline",
  "category": "Leojs",
  "title": "Sort Siblings"
},
</t>
<t tx="felix.20201214205159.18">{
  "command": "leojs.gotoFirstVisible",
  "category": "Leojs",
  "title": "Goto First Visible"
},
{
  "command": "leojs.gotoLastVisible",
  "category": "Leojs",
  "title": "Goto Last Visible"
},
{
  "command": "leojs.pageUp",
  "category": "Leojs",
  "title": "Page Up"
},
{
  "command": "leojs.pageDown",
  "category": "Leojs",
  "title": "Page Down"
},
{
  "command": "leojs.gotoLastSibling",
  "category": "Leojs",
  "title": "Goto Last Sibling"
},
{
  "command": "leojs.gotoNextVisible",
  "category": "Leojs",
  "title": "Goto Next Visible"
},
{
  "command": "leojs.gotoPrevVisible",
  "category": "Leojs",
  "title": "Goto Prev Visible"
},
{
  "command": "leojs.contractOrGoLeft",
  "category": "Leojs",
  "title": "Contract Or Go Left"
},
{
  "command": "leojs.expandAndGoRight",
  "category": "Leojs",
  "title": "Expand And Go Right"
},
{
  "command": "leojs.gotoNextMarked",
  "category": "Leojs",
  "title": "Goto Next Marked"
},
{
  "command": "leojs.gotoNextClone",
  "category": "Leojs",
  "title": "Goto Next Clone"
},
{
  "command": "leojs.gotoNextCloneSelection",
  "category": "Leojs",
  "title": "Goto Next Clone"
},
{
  "command": "leojs.gotoNextCloneSelectionFromOutline",
  "category": "Leojs",
  "title": "Goto Next Clone"
},
</t>
<t tx="felix.20201214205159.19">{
  "command": "leojs.hoistNode",
  "category": "Leojs",
  "title": "Hoist"
},
{
  "command": "leojs.hoistSelection",
  "category": "Leojs",
  "title": "Hoist"
},
{
  "command": "leojs.hoistSelectionFromOutline",
  "category": "Leojs",
  "title": "Hoist"
},
{
  "command": "leojs.deHoist",
  "category": "Leojs",
  "title": "De-Hoist",
  "icon": {
    "light": "resources/light/dehoist.svg",
    "dark": "resources/dark/dehoist.svg"
  }
},
{
  "command": "leojs.deHoistFromOutline",
  "category": "Leojs",
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
  "category": "Leojs",
  "title": "Undo",
  "icon": {
    "light": "resources/light/undo.svg",
    "dark": "resources/dark/undo.svg"
  }
},
{
  "command": "leojs.undoFromOutline",
  "category": "Leojs",
  "title": "Undo",
  "icon": {
    "light": "resources/light/undo.svg",
    "dark": "resources/dark/undo.svg"
  }
},
{
  "command": "leojs.redo",
  "category": "Leojs",
  "title": "Redo",
  "icon": {
    "light": "resources/light/redo.svg",
    "dark": "resources/dark/redo.svg"
  }
},
{
  "command": "leojs.redoFromOutline",
  "category": "Leojs",
  "title": "Redo",
  "icon": {
    "light": "resources/light/redo.svg",
    "dark": "resources/dark/redo.svg"
  }
},
</t>
<t tx="felix.20201214205159.21">{
  "command": "leojs.cloneFindAll",
  "category": "Leojs",
  "title": "Clone Find All"
},
{
  "command": "leojs.cloneFindAllFlattened",
  "category": "Leojs",
  "title": "Clone Find All Flattened"
},
{
  "command": "leojs.cloneFindMarked",
  "category": "Leojs",
  "title": "Clone Find Marked"
},
{
  "command": "leojs.cloneFindFlattenedMarked",
  "category": "Leojs",
  "title": "cffm - Clone Find Flattened Marked"
},
</t>
<t tx="felix.20201214205159.22">{
  "command": "leojs.copyMarked",
  "category": "Leojs",
  "title": "Copy Marked"
},
{
  "command": "leojs.diffMarkedNodes",
  "category": "Leojs",
  "title": "Diff Marked Nodes"
},
{
  "command": "leojs.markChangedItems",
  "category": "Leojs",
  "title": "Mark Changed Items"
},
{
  "command": "leojs.markSubheads",
  "category": "Leojs",
  "title": "Mark Subheads"
},
{
  "command": "leojs.cloneMarkedNodes",
  "category": "Leojs",
  "title": "Clone Marked Nodes"
},
{
  "command": "leojs.deleteMarkedNodes",
  "category": "Leojs",
  "title": "Delete Marked Nodes"
},
{
  "command": "leojs.moveMarkedNodes",
  "category": "Leojs",
  "title": "Move Marked Nodes"
}
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
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.minibuffer",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.26"> {
   "command": "leojs.showLogPane",
   "when": "leojsReady"
 },
</t>
<t tx="felix.20201214205159.27"> {
   "command": "leojs.openLeoFile",
   "when": "leojsReady"
 },
 {
   "command": "leojs.recentLeoFiles",
   "when": "leojsReady"
 },
 {
   "command": "leojs.switchLeoFile",
   "when": "leojsReady &amp;&amp; leojsTreeOpened"
 },
 {
   "command": "leojs.newLeoFile",
   "when": "leojsReady"
 },
 {
   "command": "leojs.closeLeoFile",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.saveLeoFile",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.saveAsLeoFile",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.refreshFromDiskSelection",
   "when": "leojsTreeOpened &amp;&amp; leoAtFile"
 },
 {
   "command": "leojs.gitDiff",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.28"> {
   "command": "leojs.contractAll",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.29"> {
   "command": "leojs.editSelectedHeadline",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.3">"viewsContainers": {
  "activitybar": [
    {
      "id": "leojsView",
      "title": "Leojs",
      "icon": "resources/icon.svg"
    }
  ]
},
</t>
<t tx="felix.20201214205159.30"> {
   "command": "leojs.markSelection",
   "when": "leojsTreeOpened &amp;&amp; !leojsMarked"
 },
 {
   "command": "leojs.unmarkSelection",
   "when": "leojsTreeOpened &amp;&amp; leojsMarked"
 },
 {
   "command": "leojs.unmarkAll",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.31"> {
   "command": "leojs.copyNodeSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.cutNodeSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.pasteNodeAtSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.pasteNodeAsCloneAtSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.deleteSelection",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.32"> {
   "command": "leojs.extract",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.extractNames",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.33"> {
   "command": "leojs.moveOutlineDownSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.moveOutlineLeftSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.moveOutlineRightSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.moveOutlineUpSelection",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.34"> {
   "command": "leojs.insertNodeSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.cloneNodeSelection",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.promoteSelection",
   "when": "leojsTreeOpened &amp;&amp; leojsCanPromote"
 },
 {
   "command": "leojs.demoteSelection",
   "when": "leojsTreeOpened &amp;&amp; leojsCanDemote"
 },
 {
   "command": "leojs.sortChildrenSelection",
   "when": "leojsTreeOpened &amp;&amp; leojsChild"
 },
 {
   "command": "leojs.sortChildrenSelectionFromOutline",
   "when": "leojsTreeOpened &amp;&amp; leojsChild"
 },
 {
   "command": "leojs.sortSiblingsSelection",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.35"> {
   "command": "leojs.gotoNextMarked",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.gotoNextCloneSelection",
   "when": "leojsTreeOpened &amp;&amp; leojsCloned"
 },
</t>
<t tx="felix.20201214205159.36"> {
   "command": "leojs.hoistSelection",
   "when": "leojsTreeOpened &amp;&amp; !leojsRoot"
 },
 {
   "command": "leojs.deHoist",
   "when": "leojsTreeOpened &amp;&amp; leojsCanDehoist"
 },
</t>
<t tx="felix.20201214205159.37"> {
   "command": "leojs.undo",
   "when": "leojsTreeOpened &amp;&amp; leojsCanUndo"
 },
 {
   "command": "leojs.redo",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.38"> {
   "command": "leojs.cloneFindAll",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.cloneFindAllFlattened",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.cloneFindMarked",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.cloneFindFlattenedMarked",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.39"> {
   "command": "leojs.copyMarked",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.diffMarkedNodes",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.markChangedItems",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.markSubheads",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.cloneMarkedNodes",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.deleteMarkedNodes",
   "when": "leojsTreeOpened"
 },
 {
   "command": "leojs.moveMarkedNodes",
   "when": "leojsTreeOpened"
 },
</t>
<t tx="felix.20201214205159.4">"views": {
  "explorer": [
    {
      "id": "leojsOutlineExplorer",
      "name": "Leojs Outline",
      "contextualTitle": "Leojs"
    },
    {
      "id": "leojsDocumentsExplorer",
      "name": "Leojs Documents",
      "contextualTitle": "Leojs"
    },
    {
      "id": "leojsButtonsExplorer",
      "name": "Leojs Buttons",
      "contextualTitle": "Leojs"
    }
  ],
  "leojsView": [
    {
      "id": "leojsOutline",
      "contextualTitle": "Leojs",
      "name": "Outline"
    },
    {
      "id": "leojsDocuments",
      "contextualTitle": "Leojs",
      "name": "Documents"
    },
    {
      "id": "leojsButtons",
      "contextualTitle": "Leojs",
      "name": "Buttons"
    }
  ]
},
</t>
<t tx="felix.20201214205159.40">@others
</t>
<t tx="felix.20201214205159.41"> {
   "command": "leojs.test",
   "when": "true"
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
   "when": "leojsTreeOpened"
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
    "view": "leojsOutline",
    "contents": "[Open Leo File](command:leojs.openLeoFile)\n[Create Leo File](command:leojs.openLeoFile)",
    "when": "leojsReady &amp;&amp; !leojsTreeOpened"
  },
  {
    "view": "leojsOutlineExplorer",
    "contents": "[Open Leo File](command:leojs.openLeoFile)\n[Create Leo File](command:leojs.openLeoFile)",
    "when": "leojsReady &amp;&amp; !leojsTreeOpened"
  },
  {
    "view": "leojsDocuments",
    "contents": "There are no Leo files currently opened",
    "when": "leojsReady &amp;&amp; !leojsTreeOpened"
  },
  {
    "view": "leojsDocumentsExplorer",
    "contents": "There are no Leo files currently opened",
    "when": "leojsReady &amp;&amp; !leojsTreeOpened"
  },
  {
    "view": "leojsButtons",
    "contents": "There are no Leo files currently opened",
    "when": "leojsReady &amp;&amp; !leojsTreeOpened"
  },
  {
    "view": "leojsButtonsExplorer",
    "contents": "There are no Leo files currently opened",
    "when": "leojsReady &amp;&amp; !leojsTreeOpened"
  },
  {
    "view": "leojsButtons",
    "contents": "There are no @buttons in this outline",
    "when": "leojsReady &amp;&amp; leojsTreeOpened"
  },
  {
    "view": "leojsButtonsExplorer",
    "contents": "There are no @buttons in this outline",
    "when": "leojsReady &amp;&amp; leojsTreeOpened"
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
    "when": "view =~ /leojsDocuments/ &amp;&amp; leojsReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.newLeoFile",
    "when": "view =~ /leojsDocuments/ &amp;&amp; leojsReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.openLeoFile",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.newLeoFile",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsReady",
    "group": "navigation@1"
  },
  {
    "command": "leojs.saveLeoFileFromOutline",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsTreeOpened &amp;&amp; leoTreeTitled &amp;&amp; leoChanged",
    "group": "navigation@2"
  },
  {
    "command": "leojs.saveAsLeoFile",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsTreeOpened &amp;&amp; !leoTreeTitled",
    "group": "navigation@2"
  },
  {
    "command": "leojs.undoFromOutline",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsTreeOpened &amp;&amp; leoCanUndo",
    "group": "navigation@3"
  },
  {
    "command": "leojs.redoFromOutline",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsTreeOpened &amp;&amp; leoCanRedo",
    "group": "navigation@4"
  },
  {
    "command": "leojs.deHoistFromOutline",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsTreeOpened &amp;&amp; leoCanDehoist",
    "group": "navigation@5"
  },
  {
    "command": "leojs.contractAllFromOutline",
    "when": "view =~ /leojsOutline/ &amp;&amp; leojsTreeOpened",
    "group": "navigation@6"
  }
],
</t>
<t tx="felix.20201214205159.56">"view/item/context": [
  @others
]
</t>
<t tx="felix.20201214205159.57">{
  "command": "leojs.editHeadline",
  "when": "leojsShowEditOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@1"
},
</t>
<t tx="felix.20201214205159.58">{
  "command": "leojs.insertNode",
  "when": "leojsShowAddOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@2"
},
</t>
<t tx="felix.20201214205159.59">{
  "command": "leojs.moveOutlineDown",
  "when": "leojsShowArrowsOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@3"
},
{
  "command": "leojs.moveOutlineLeft",
  "when": "leojsShowArrowsOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@3"
},
{
  "command": "leojs.moveOutlineRight",
  "when": "leojsShowArrowsOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@3"
},
{
  "command": "leojs.moveOutlineUp",
  "when": "leojsShowArrowsOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@3"
},
</t>
<t tx="felix.20201214205159.6">"commands": [
  @others
],
</t>
<t tx="felix.20201214205159.60">{
  "command": "leojs.copyNode",
  "when": "leojsShowCopyOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@4"
},
{
  "command": "leojs.cloneNode",
  "when": "leojsShowCloneOnNodes &amp;&amp; viewItem =~ /leojsNode/",
  "group": "inline@4"
},
</t>
<t tx="felix.20201214205159.61">{
  "command": "leojs.mark",
  "when": "leojsShowMarkOnNodes &amp;&amp; viewItem =~ /leojsNodeUnmarked/",
  "group": "inline@5"
},
{
  "command": "leojs.unmark",
  "when": "leojsShowMarkOnNodes &amp;&amp; viewItem =~ /leojsNodeMarked/",
  "group": "inline@5"
},
</t>
<t tx="felix.20201214205159.62">{
  "command": "leojs.openAside",
  "when": "leojsShowOpenAside &amp;&amp; viewItem =~ /leojsNode/",
  "group": "leojsNodeContext1@1"
},
</t>
<t tx="felix.20201214205159.63">{
  "command": "leojs.hoistNode",
  "when": "viewItem =~ /leojsNodeNotRoot/",
  "group": "leojsNodeContext1@2"
},
{
  "command": "leojs.deHoist",
  "when": "leoCanDehoist &amp;&amp; viewItem =~ /leojsNodeRoot/",
  "group": "leojsNodeContext1@2"
},
</t>
<t tx="felix.20201214205159.64">{
  "command": "leojs.refreshFromDisk",
  "when": "viewItem =~ /leojsNodeAtFile/",
  "group": "leojsNodeContext1@3"
},
</t>
<t tx="felix.20201214205159.65">{
  "command": "leojs.mark",
  "when": "viewItem =~ /leojsNodeUnmarked/",
  "group": "leojsNodeContext2@1"
},
{
  "command": "leojs.unmark",
  "when": "viewItem =~ /leojsNodeMarked/",
  "group": "leojsNodeContext2@2"
},
</t>
<t tx="felix.20201214205159.66">{
  "command": "leojs.copyNode",
  "when": "viewItem =~ /leojsNode/",
  "group": "leojsNodeContext2@3"
},
{
  "command": "leojs.cutNode",
  "when": "viewItem =~ /leojsNode/",
  "group": "leojsNodeContext2@4"
},
{
  "command": "leojs.pasteNode",
  "when": "viewItem =~ /leojsNode/",
  "group": "leojsNodeContext2@5"
},
{
  "command": "leojs.pasteNodeAsClone",
  "when": "viewItem =~ /leojsNode/",
  "group": "leojsNodeContext2@6"
},
{
  "command": "leojs.delete",
  "when": "viewItem =~ /leojsNode/",
  "group": "leojsNodeContext2@7"
},
{
  "command": "leojs.insertNode",
  "when": "leojsTreeOpened &amp;&amp; viewItem =~ /leojsNode/",
  "group": "leojsNodeContext3@1"
},
{
  "command": "leojs.cloneNode",
  "when": "leojsTreeOpened &amp;&amp; viewItem =~ /leojsNode/",
  "group": "leojsNodeContext3@2"
},
{
  "command": "leojs.gotoNextClone",
  "when": "leojsTreeOpened &amp;&amp; viewItem =~ /leojsNodeCloned/",
  "group": "leojsNodeContext3@3"
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
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.executeScript",
  "key": "ctrl+b",
  "mac": "cmd+b",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.minibuffer",
  "key": "alt+x",
  "when": "leojsTreeOpened"
},
</t>
<t tx="felix.20201214205159.69">{
  "command": "leojs.showOutline",
  "key": "alt+t",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.showOutline",
  "key": "ctrl+t",
  "mac": "cmd+t",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.showBody",
  "key": "ctrl+t",
  "mac": "cmd+t",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.showBody",
  "key": "alt+d",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.showBody",
  "key": "tab",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.showBody",
  "key": "enter",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.7">{
  "command": "leojs.test",
  "category": "Leojs",
  "title": "Test leojs"
},
</t>
<t tx="felix.20201214205159.70">{
  "command": "leojs.saveLeoFileFromOutline",
  "key": "ctrl+s",
  "mac": "cmd+s",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments/"
},
{
  "command": "leojs.saveLeoFile",
  "key": "ctrl+s",
  "mac": "cmd+s",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
</t>
<t tx="felix.20201214205159.71">{
  "command": "leojs.contractAll",
  "key": "alt+-",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.contractAllFromOutline",
  "key": "alt+-",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
</t>
<t tx="felix.20201214205159.72">{
  "command": "leojs.editSelectedHeadline",
  "key": "ctrl+h",
  "mac": "cmd+h",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.editSelectedHeadlineFromOutline",
  "key": "ctrl+h",
  "mac": "cmd+h",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.73">{
  "command": "leojs.markSelection",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leojsTreeOpened &amp;&amp; !leojsMarked &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.markSelectionFromOutline",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leojsTreeOpened &amp;&amp; !leojsMarked &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.unmarkSelection",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leojsTreeOpened &amp;&amp; leojsMarked &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.unmarkSelectionFromOutline",
  "key": "ctrl+m",
  "mac": "cmd+m",
  "when": "leojsTreeOpened &amp;&amp; leojsMarked &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.74">{
  "command": "leojs.extract",
  "key": "ctrl+shift+d",
  "mac": "cmd+shift+d",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; editorHasSelection &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.extract",
  "key": "ctrl+shift+d",
  "mac": "cmd+shift+d",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.extractNames",
  "key": "ctrl+shift+n",
  "mac": "cmd++shift+n",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; editorHasSelection &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.extractNames",
  "key": "ctrl+shift+n",
  "mac": "cmd+shift+n",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.75">{
  "command": "leojs.moveOutlineDownSelection",
  "key": "ctrl+d",
  "mac": "cmd+d",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineDownSelection",
  "key": "shift+alt+down",
  "mac": "shift+alt+down",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "key": "ctrl+d",
  "mac": "cmd+d",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "key": "shift+down",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineDownSelectionFromOutline",
  "key": "shift+alt+down",
  "mac": "shift+alt+down",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineLeftSelection",
  "key": "ctrl+l",
  "mac": "cmd+l",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineLeftSelection",
  "key": "shift+alt+left",
  "mac": "shift+alt+left",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "key": "ctrl+l",
  "mac": "cmd+l",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "key": "shift+left",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineLeftSelectionFromOutline",
  "key": "shift+alt+left",
  "mac": "shift+alt+left",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineRightSelection",
  "key": "ctrl+r",
  "mac": "cmd+r",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineRightSelection",
  "key": "shift+alt+right",
  "mac": "shift+alt+right",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "key": "ctrl+r",
  "mac": "cmd+r",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "key": "shift+right",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineRightSelectionFromOutline",
  "key": "shift+alt+right",
  "mac": "shift+alt+right",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineUpSelection",
  "key": "ctrl+u",
  "mac": "cmd+u",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineUpSelection",
  "key": "shift+alt+up",
  "mac": "shift+alt+up",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "key": "ctrl+u",
  "mac": "cmd+u",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "key": "shift+up",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.moveOutlineUpSelectionFromOutline",
  "key": "shift+alt+up",
  "mac": "shift+alt+up",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.76">{
  "command": "leojs.sortSiblingsSelection",
  "key": "alt+a",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.sortSiblingsSelectionFromOutline",
  "key": "alt+a",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.promoteSelection",
  "key": "ctrl+[BracketLeft]",
  "win": "ctrl+oem_4",
  "linux": "ctrl+[",
  "mac": "cmd+[BracketLeft]",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.promoteSelectionFromOutline",
  "key": "ctrl+[BracketLeft]",
  "win": "ctrl+oem_4",
  "linux": "ctrl+[",
  "mac": "cmd+[BracketLeft]",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.demoteSelection",
  "key": "ctrl+[BracketRight]",
  "win": "ctrl+oem_6",
  "linux": "ctrl+]",
  "mac": "cmd+[BracketRight]",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.demoteSelectionFromOutline",
  "key": "ctrl+[BracketRight]",
  "win": "ctrl+oem_6",
  "linux": "ctrl+]",
  "mac": "cmd+[BracketRight]",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.insertNodeSelection",
  "key": "ctrl+i",
  "mac": "cmd+i",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.insertNodeSelectionFromOutline",
  "key": "ctrl+i",
  "mac": "cmd+i",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.insertNodeSelectionInterrupt",
  "key": "ctrl+i",
  "mac": "cmd+i",
  "when": "leojsTreeOpened &amp;&amp; !sideBarFocus &amp;&amp; !editorTextFocus"
},
{
  "command": "leojs.cloneNodeSelection",
  "key": "ctrl+[Backquote]",
  "win": "ctrl+oem_7",
  "linux": "ctrl+'",
  "mac": "cmd+[Backquote]",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.cloneNodeSelectionFromOutline",
  "key": "ctrl+[Backquote]",
  "win": "ctrl+oem_7",
  "linux": "ctrl+'",
  "mac": "cmd+[Backquote]",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.77">{
  "command": "leojs.cutNodeSelection",
  "key": "ctrl+shift+x",
  "mac": "cmd+shift+x",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.cutNodeSelectionFromOutline",
  "key": "ctrl+shift+x",
  "mac": "cmd+shift+x",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.copyNodeSelection",
  "key": "ctrl+shift+c",
  "mac": "cmd+shift+c",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.copyNodeSelection",
  "key": "ctrl+shift+c",
  "mac": "cmd+shift+c",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.pasteNodeAtSelection",
  "key": "ctrl+shift+v",
  "mac": "cmd+shift+v",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.pasteNodeAtSelectionFromOutline",
  "key": "ctrl+shift+v",
  "mac": "cmd+shift+v",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.deleteSelection",
  "key": "ctrl+shift+backspace",
  "mac": "cmd+shift+backspace",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.deleteSelectionFromOutline",
  "key": "ctrl+shift+backspace",
  "mac": "cmd+shift+backspace",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
</t>
<t tx="felix.20201214205159.78">{
  "command": "leojs.gotoFirstVisible",
  "key": "alt+home",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoLastSibling",
  "key": "alt+end",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoFirstVisible",
  "key": "home",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoLastVisible",
  "key": "end",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.pageUp",
  "key": "pageup",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.pageDown",
  "key": "pagedown",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoNextCloneSelectionFromOutline",
  "key": "alt+n",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoNextCloneSelection",
  "key": "alt+n",
  "when": "leojsTreeOpened &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.gotoNextVisible",
  "key": "down",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoNextVisible",
  "key": "alt+down",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.gotoNextVisible",
  "key": "alt+down",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.gotoPrevVisible",
  "key": "up",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.gotoPrevVisible",
  "key": "alt+up",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.gotoPrevVisible",
  "key": "alt+up",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection  &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.contractOrGoLeft",
  "key": "left",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.contractOrGoLeft",
  "key": "alt+left",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.contractOrGoLeft",
  "key": "alt+left",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
},
{
  "command": "leojs.expandAndGoRight",
  "key": "right",
  "when": "leojsTreeBrowse &amp;&amp; leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline/"
},
{
  "command": "leojs.expandAndGoRight",
  "key": "alt+right",
  "when": "leojsTreeOpened &amp;&amp; sideBarFocus &amp;&amp; focusedView =~ /leojsOutline|leojsDocuments|leojsButtons/"
},
{
  "command": "leojs.expandAndGoRight",
  "key": "alt+right",
  "when": "leojsTreeOpened &amp;&amp; !editorHasSelection &amp;&amp; editorTextFocus &amp;&amp; resourceScheme == leojs"
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
  "category": "Leojs",
  "title": "Execute Script"
},
{
  "command": "leojs.minibuffer",
  "category": "Leojs",
  "title": "Minibuffer"
},
{
  "command": "leojs.removeButton",
  "category": "Leojs",
  "title": "Remove Button"
},
</t>
<t tx="felix.20201214205159.80">"@types/glob": "^7.1.3",
"@types/mocha": "^8.0.0",
"@types/node": "^12.11.7",
"@types/vscode": "^1.60.0",
"@typescript-eslint/eslint-plugin": "^4.1.1",
"@typescript-eslint/parser": "^4.1.1",
"eslint": "^7.9.0",
"glob": "^7.1.6",
"mocha": "^8.1.3",
"ts-loader": "^8.0.3",
"tslint": "^6.1.3",
"typescript": "^4.0.2",
"vscode-test": "^1.4.0",
"webpack": "^4.44.1",
"webpack-cli": "^3.3.12"
</t>
<t tx="felix.20201214205159.81">"@types/debounce": "^1.2.0",
"axios": "^0.22.0",
"date-format-lite": "^17.7.0",
"debounce": "^1.2.0"
</t>
<t tx="felix.20201214205159.9">{
  "command": "leojs.showBody",
  "category": "Leojs",
  "title": "Focus to Body"
},
{
  "command": "leojs.showOutline",
  "category": "Leojs",
  "title": "Focus to Tree"
},
{
  "command": "leojs.showLogPane",
  "category": "Leojs",
  "title": "Show Log Pane"
},
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
<t tx="felix.20201215231023.1">&lt;&lt; imports &gt;&gt;
&lt;&lt; xslTemplate &gt;&gt;
@language javascript
@tabwidth -4
@others

export { getLeoJSON, transformLeoXML, transformLeoXML2XML, transform, test, testVar };

</t>
<t tx="felix.20201215231023.10">/**
 * TODO: move to util, also is in store/index, review logic for relative / subtrees
 * Is url relative
 * @param url {string}
 * @returns {boolean} - if is relative
 */
function isRelative(url) {
    var ok = true;
    if (/^http/.test(url)) {
        ok = false;
    }
    return ok;
}

</t>
<t tx="felix.20201215231023.11">function getLeoJSON(filename, id) {
    if (filename.indexOf('#') &gt; 0) {
        filename = filename.substring(0, filename.indexOf('#'));
    }
    var p = new Promise((resolve, reject) =&gt; {
        if (!filename.match(/static/) &amp;&amp; isRelative(filename)) {
            // filename = 'static/' + filename
        }
        if (!filename.match(/\.leo$/)) {
            filename = filename + '.leo';
        }
        loadDoc(filename, 'Text')
            .then((xmlString) =&gt; {
                return transformLeoXML(xmlString, id);
            })
            .then((data) =&gt; {
                resolve(data);
            });
    });
    return p;
}

</t>
<t tx="felix.20201215231023.12">function transformLeoXML2XML(xmlString, startId, parser) {
    const p = new Promise((resolve, reject) =&gt; {
        let oParser = null;
        if (parser) {
            oParser = new parser();
        } else {
            oParser = new DOMParser();
        }
        const xml = oParser.parseFromString(xmlString, 'text/xml');
        const tnodes = xml.getElementsByTagName('t');
        let textItems = {};
        for (let i = 0; i &lt; tnodes.length; i++) {
            let el = tnodes[i];
            let elText = el.textContent;
            let a = el.getAttribute('tx');
            a = a.replace(/\./g, '_');
            a = a.replace(/^.*?_/, '');
            if (startId) {
                a = startId + '-' + a;
            }
            if (
                /^@language /.test(elText) &amp;&amp;
                !/^@language html/.test(elText) &amp;&amp;
                !/^@language md/.test(elText)
            ) {
                // elText = escape(elText)
            }
            textItems[a] = elText;
        }
        const vnodes = xml.getElementsByTagName('v');
        let pid;
        for (let i = 0; i &lt; vnodes.length; i++) {
            pid = i + 1;
            if (startId) {
                pid = startId + '-' + pid;
            }
            vnodes[i].setAttribute('id', '"' + pid + '"');
        }
        resolve({ xml, textItems });
    });
    return p;
}

</t>
<t tx="felix.20201215231023.13">function transformLeoXML2JSON(data, startId, parser, transformer, serializer) {
    const p = new Promise((resolve, reject) =&gt; {
        const xml = data.xml;
        const textItems = data.textItems;
        transform(xml, xslTemplate, transformer, serializer)
            .then((jsdata) =&gt; {
                jsdata = jsdata.replace(
                    /&lt;\?xml version="1\.0" encoding="UTF-8"\?&gt;/,
                    ''
                );
                jsdata = jsdata.replace(/,\s?$/, ''); // kludge to get rid of trailing comma
                jsdata = '[' + jsdata + ']';
                jsdata = JSON.parse(jsdata);
                jsdata.forEach((d) =&gt; cleanText(d, startId));
                const xdata = {};
                xdata.data = jsdata;
                xdata.textItems = textItems;
                return xdata;
            })
            .then((data) =&gt; resolve(data));
    });
    return p;
}

</t>
<t tx="felix.20201215231023.14">function transformLeoXML(xmlString, startId, parser, transformer, serializer) {
    return transformLeoXML2XML(xmlString, startId, parser).then((data) =&gt;
        transformLeoXML2JSON(data, startId, parser, transformer, serializer)
    );
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
`;

</t>
<t tx="felix.20201215231023.3">function transform(xml, xslString, transformer, serializer) {
    @others
    const p = new Promise((resolve, reject) =&gt; {
        if (transformer) {
            return serverTransform(resolve, reject);
        } else {
            return clientTransform(resolve, reject);
        }
    });
    return p;
}

</t>
<t tx="felix.20201215231023.4">function serverTransform(resolve, reject) {
    const xmlString = new serializer().serializeToString(xml);
    const config = {
        xslt: xslString,
        source: xmlString,
        result: String,
        props: {
            indent: 'yes',
        },
    };
    transformer.transform(config, (err, result) =&gt; {
        if (err) {
            console.log('ERROR:', err);
            return reject();
        }
        resolve(result);
    });
}

</t>
<t tx="felix.20201215231023.5">function clientTransform(resolve, reject) {
    const oParser = new DOMParser();
    const xsl = oParser.parseFromString(xslString, 'text/xml');
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    const resultDocument = xsltProcessor.transformToFragment(xml, document);
    resolve(resultDocument.textContent);
}

</t>
<t tx="felix.20201215231023.6">function loadDoc(filename) {
    console.log('loading file:', filename);
    var p = new Promise((resolve, reject) =&gt; {
        axios
            .get(filename)
            @others
    });
    return p;
}

</t>
<t tx="felix.20201215231023.7">.then(function (response) {
    resolve(response.data);
})
</t>
<t tx="felix.20201215231023.8">.catch(function (error) {
    console.log(error);
    reject();
});
</t>
<t tx="felix.20201215231023.9">function cleanText(data, startId) {
    data.name = data.name.replace(/&lt;&lt;/g, '\u00AB');
    data.name = data.name.replace(/&gt;&gt;/g, '\u00BB');
    data.name = data.name.replace(/'/g, '\x27');
    data.name = data.name.replace(/"/g, '\x22');
    //data.name = escape(data.name)
    data.name = data.name.replace(/&amp;#39;/g, '\x27');
    data.id = data.id + ''; // probably unneeded now
    let children = data.children;
    if (!children) {
        return;
    }
    for (let i = 0; i &lt; children.length; i++) {
        cleanText(children[i], startId);
    }
    data.t = data.t.replace(/^.*?_/, ''); // remove file uid
    if (startId) {
        data.t = startId + '-' + data.t + '';
    }
}

</t>
<t tx="felix.20201221015535.1"></t>
<t tx="felix.20210102000055.1"></t>
<t tx="felix.20210102000100.1"></t>
<t tx="felix.20210102012334.1">&lt;&lt; imports &gt;&gt;
@others
@language typescript
@tabwidth -4

</t>
<t tx="felix.20210102012410.1">@language typescript
@tabwidth -4

/**
 * Global constants, variables and utility functions used throughout Leo.
 * Important: This module imports no other Leo module.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LeoApp } from './leoApp';
import { Commands } from './leoCommands';
import { Position } from './leoNodes';

export const isMac: boolean = process.platform.startsWith('darwin');
export const isWindows: boolean = process.platform.startsWith('win');

&lt;&lt; global switches &gt;&gt;
&lt;&lt; imports &gt;&gt;
&lt;&lt; define g.globalDirectiveList &gt;&gt;
&lt;&lt; define global decorator dicts &gt;&gt;
&lt;&lt; define regex's &gt;&gt;

export const tree_popup_handlers: ((...args: any[]) =&gt; any)[] = [];  // Set later.
export const user_dict: { [key: string]: any } = {}; // Non-persistent dictionary for free use

// Was set when creating leoGlobals instance in leoRun.py and in leoBridge.py
export const app: LeoApp = new LeoApp();

// Global status vars.
export let inScript: boolean = false; // A synonym for app.inScript
export let unitTesting: boolean = false; // A synonym for app.unitTesting.

export let unicode_warnings: { [key: string]: any } = {};  // Keys are callers.

@others

</t>
<t tx="felix.20210102012632.1">@language typescript
@tabwidth -4
// Leo's fundamental data classes.

&lt;&lt; imports &gt;&gt;

@others

</t>
<t tx="felix.20210102014453.1">/**
 * A class managing global node indices (gnx's).
 */
export class NodeIndices {

    defaultId: string;
    lastIndex: number;
    stack: any[]; // A stack of open commanders.
    timeString: string; //  Set by setTimeStamp.
    userId: string;

    @others

}

</t>
<t tx="felix.20210102014804.1">constructor(id_: string) {
    // Ctor for NodeIndices class.
    this.defaultId = id_;
    this.lastIndex = 0;
    this.stack = [];
    this.timeString = '';
    this.userId = id_;
    this.setTimeStamp();
}

</t>
<t tx="felix.20210102015005.1">/**
 * A position marks the spot in a tree traversal. A position p consists of a VNode
 * p.v, a child index p._childIndex, and a stack of tuples (v,childIndex), one for
 * each ancestor **at the spot in tree traversal. Positions p has a unique set of
 * parents.
 *
 * The p.moveToX methods may return a null (invalid) position p with p.v = None.
 * No operator overload in js/ts, so "strict-comparisons" is set in tslint.json
 * to force usage of special methods to compare &amp; evaluate equalities.
 */

export type StackEntry = [VNode, number];

export class Position {

    v: VNode;
    _childIndex: number;
    stack: StackEntry[];

    @others

}

// Aliases for Position members
export interface Position {
    back: () =&gt; Position;
    firstChild: () =&gt; Position;
    lastChild: () =&gt; Position;
    lastNode: () =&gt; Position;
    next: () =&gt; Position;
    nodeAfterTree: () =&gt; Position;
    nthChild: (n: number) =&gt; Position;
    parent: () =&gt; Position;
    threadBack: () =&gt; Position;
    threadNext: () =&gt; Position;
    visBack: (c: Commands) =&gt; Position;
    visNext: (c: Commands) =&gt; Position;
    hasVisBack: (c: Commands) =&gt; Position;
    hasVisNext: (c: Commands) =&gt; Position;
    hasFirstChild: () =&gt; boolean;
    atNoSentFileNodeName: () =&gt; string;
    atAsisFileNodeName: () =&gt; string;
    isAtNoSentFileNode: () =&gt; boolean;
    isAtAsisFileNode: () =&gt; boolean;
    __repr__: () =&gt; string;
    simpleLevel: () =&gt; number;

    initBodyString: (s: string) =&gt; void;
    setTnodeText: (s: string) =&gt; void;
    scriptSetBodyString: (s: string) =&gt; void;
}

Position.prototype.back = Position.prototype.getBack;
Position.prototype.firstChild = Position.prototype.getFirstChild;
Position.prototype.lastChild = Position.prototype.getLastChild;
Position.prototype.lastNode = Position.prototype.getLastNode;
// Position.prototype.lastVisible = Position.prototype.getLastVisible # New in 4.2 (was in tk tree code).;
Position.prototype.next = Position.prototype.getNext;
Position.prototype.nodeAfterTree = Position.prototype.getNodeAfterTree;
Position.prototype.nthChild = Position.prototype.getNthChild;
Position.prototype.parent = Position.prototype.getParent;
Position.prototype.threadBack = Position.prototype.getThreadBack;
Position.prototype.threadNext = Position.prototype.getThreadNext;
Position.prototype.visBack = Position.prototype.getVisBack;
Position.prototype.visNext = Position.prototype.getVisNext;
// New in Leo 4.4.3:
Position.prototype.hasVisBack = Position.prototype.getVisBack;
Position.prototype.hasVisNext = Position.prototype.getVisNext;
// from p.children &amp; parents
Position.prototype.hasFirstChild = Position.prototype.hasChildren;
// New names, less confusing
Position.prototype.atNoSentFileNodeName = Position.prototype.atNoSentinelsFileNodeName;
Position.prototype.atAsisFileNodeName = Position.prototype.atSilentFileNodeName;

Position.prototype.isAtNoSentFileNode = Position.prototype.isAtNoSentinelsFileNode;
Position.prototype.isAtAsisFileNode = Position.prototype.isAtSilentFileNode;
Position.prototype.__repr__ = Position.prototype.__str__;
Position.prototype.simpleLevel = Position.prototype.level;

Position.prototype.initBodyString = Position.prototype.setBodyString;
Position.prototype.setTnodeText = Position.prototype.setBodyString;
Position.prototype.scriptSetBodyString = Position.prototype.setBodyString;

</t>
<t tx="felix.20210102015917.1">/**
 * VNode class.
 */
export class VNode {

    // * The primary data: headline and body text.
    _headString: string;
    _bodyString: string;

    // * Structure data...
    children: VNode[]; // Ordered list of all children of this node.
    parents: VNode[]; // Unordered list of all parents of this node.

    // * Other essential data...
    fileIndex: string; // The immutable fileIndex (gnx) for this node. Set below.wwwwwwwwwwwww
    iconVal: number; // The present value of the node's icon.
    statusBits: number; // status bits

    // * Information that is never written to any file...
    // The context containing context.hiddenRootNode.
    // Required so we can compute top-level siblings.
    // It is named .context rather than .c to emphasize its limited usage.
    context: Commands;
    expandedPositions: Position[]; // Positions that should be expanded.

    // * Cursor location, text selection and scrolling information
    insertSpot: number; // Location of previous insert point.
    scrollBarSpot: number; // Previous value of scrollbar position.
    selectionLength: number; // The length of the selected body text.
    selectionStart: number; // The start of the selected body text.

    private unknownAttributes: undefined | { [key: string]: any };
    unicode_warning_given: boolean = false;

    @others

}

// Aliases for VNode members
export interface VNode {
    atNoSentFileNodeName: () =&gt; string;
    atAsisFileNodeName: () =&gt; string;
    isAtNoSentFileNode: () =&gt; boolean;
    isAtAsisFileNode: () =&gt; boolean;
    initBodyString: (s: string) =&gt; void;
    initHeadString: (s: string) =&gt; void;
    setHeadText: (s: string) =&gt; void;
    setTnodeText: (s: string) =&gt; void;
    __str__: () =&gt; string;
}

// New names, less confusing

VNode.prototype.atNoSentFileNodeName = VNode.prototype.atNoSentinelsFileNodeName;
VNode.prototype.atAsisFileNodeName = VNode.prototype.atSilentFileNodeName;
VNode.prototype.isAtNoSentFileNode = VNode.prototype.isAtNoSentinelsFileNode;
VNode.prototype.isAtAsisFileNode = VNode.prototype.isAtSilentFileNode;
VNode.prototype.initBodyString = VNode.prototype.setBodyString;
VNode.prototype.setHeadText = VNode.prototype.setHeadString;
VNode.prototype.initHeadString = VNode.prototype.setHeadString;
VNode.prototype.setTnodeText = VNode.prototype.setBodyString;
VNode.prototype.__str__ = VNode.prototype.__repr__;

</t>
<t tx="felix.20210102015917.2">constructor(context: any, gnx?: string) {
    this._headString = 'newHeadline';
    this._bodyString = '';
    this.children = [];
    this.parents = [];
    this.fileIndex = '';
    this.iconVal = 0;
    this.statusBits = 0;
    this.context = context;
    this.expandedPositions = [];
    this.insertSpot = 0;
    this.scrollBarSpot = 0;
    this.selectionLength = 0;
    this.selectionStart = 0;
    g.app.nodeIndices!.new_vnode_helper(context, gnx, this);
}

</t>
<t tx="felix.20210102024358.1">/**
 * Set the timestamp string to be used by getNewIndex until further notice
 */
public setTimeStamp(): void {
    // GNX example: felix.20210110163753.1
    // using https://www.npmjs.com/package/date-format-lite#syntax
    this.timeString = new Date().format("YYYYMMDDhhmmss");
}

</t>
<t tx="felix.20210102031240.1">/**
 * Yield all child positions of p.
 */
public *children(copy: boolean = true): Generator&lt;Position&gt; {
    const p = this.firstChild();
    while (p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToNext();
    }
}

// * Compatibility with old code...
// children_iter = children

</t>
<t tx="felix.20210102035859.1">public copy(): Position {
    return new Position(this.v, this._childIndex, this.stack);
}

</t>
<t tx="felix.20210102150654.1">enum StatusFlags {
    // Define the meaning of status bits in new vnodes.
    // Archived...
    clonedBit = 0x01,  // True: VNode has clone mark.
    // unused      0x02,
    expandedBit = 0x04,  // True: VNode is expanded.
    markedBit = 0x08,  // True: VNode is marked
    // unused    = 0x10, // (was orphanBit)
    selectedBit = 0x20,  // True: VNode is current VNode.
    topBit = 0x40,  // True: VNode was top VNode when saved.
    // Not archived...
    richTextBit = 0x080,  // Determines whether we use &lt;bt&gt; or &lt;btr&gt; tags.
    visitedBit = 0x100,
    dirtyBit = 0x200,
    writeBit = 0x400,
    orphanBit = 0x800  // True: error in @&lt;file&gt; tree prevented it from being written.
}

</t>
<t tx="felix.20210102180352.1">export const in_bridge: boolean = false; // May be unused as a vscode extension.
// Set to True in leoBridge.py just before importing leo.core.leoApp.
// This tells leoApp to load a null Gui.

</t>
<t tx="felix.20210102180402.1">// Visible externally so plugins may add to the list of directives.
export const globalDirectiveList: string[] = [
    // Order does not matter.
    'all',
    'beautify',
    'colorcache', 'code', 'color', 'comment', 'c',
    'delims', 'doc',
    'encoding', 'end_raw',
    'first', 'header', 'ignore',
    'killbeautify', 'killcolor',
    'language', 'last', 'lineending',
    'markup',
    'nobeautify',
    'nocolor-node', 'nocolor', 'noheader', 'nowrap',
    'nopyflakes',  // Leo 6.1.
    'nosearch',  // Leo 5.3.
    'others', 'pagewidth', 'path', 'quiet',
    'raw', 'root-code', 'root-doc', 'root', 'silent',
    'tabwidth', 'terse',
    'unit', 'verbose', 'wrap'
];

export const directives_pat: any = null;  // Set below.

</t>
<t tx="felix.20210102180405.1">/*
  The cmd_instance_dict supports per-class @cmd decorators. For example, the
  following appears in leo.commands.

      def cmd(name):
          """Command decorator for the abbrevCommands class."""
          return g.new_cmd_decorator(name, ['c', 'abbrevCommands',])

  For commands based on functions, use the @g.command decorator.
*/

export const global_commands_dict: { [key: string]: (...args: any[]) =&gt; any } = {};

export const cmd_instance_dict: { [key: string]: string[] } = {
    // Keys are class names, values are attribute chains.
    'AbbrevCommandsClass': ['c', 'abbrevCommands'],
    'AtFile': ['c', 'atFileCommands'],
    'AutoCompleterClass': ['c', 'k', 'autoCompleter'],
    'ChapterController': ['c', 'chapterController'],
    'Commands': ['c'],
    'ControlCommandsClass': ['c', 'controlCommands'],
    'DebugCommandsClass': ['c', 'debugCommands'],
    'EditCommandsClass': ['c', 'editCommands'],
    'EditFileCommandsClass': ['c', 'editFileCommands'],
    'FileCommands': ['c', 'fileCommands'],
    'HelpCommandsClass': ['c', 'helpCommands'],
    'KeyHandlerClass': ['c', 'k'],
    'KeyHandlerCommandsClass': ['c', 'keyHandlerCommands'],
    'KillBufferCommandsClass': ['c', 'killBufferCommands'],
    'LeoApp': ['g', 'app'],
    'LeoFind': ['c', 'findCommands'],
    'LeoImportCommands': ['c', 'importCommands'],
    // 'MacroCommandsClass': ['c', 'macroCommands'],
    'PrintingController': ['c', 'printingController'],
    'RectangleCommandsClass': ['c', 'rectangleCommands'],
    'RstCommands': ['c', 'rstCommands'],
    'SpellCommandsClass': ['c', 'spellCommands'],
    'Undoer': ['c', 'undoer'],
    'VimCommands': ['c', 'vimCommands']
};

</t>
<t tx="felix.20210102180413.1">export const g_language_pat = new RegExp(/^@language\s+(\w+)+/, 'm');
// Regex used by this module, and in leoColorizer.py.

// Patterns used only in this module...
export const g_is_directive_pattern = new RegExp(/^\s*@([\w-]+)\s*/);
// This pattern excludes @encoding.whatever and @encoding(whatever)
// It must allow @language python, @nocolor-node, etc.

export const g_noweb_root = new RegExp('&lt;' + '&lt;' + '*' + '&gt;' + '&gt;' + '=', 'm');
export const g_pos_pattern = new RegExp(/:(\d+),?(\d+)?,?([-\d]+)?,?(\d+)?$/);
export const g_tabwidth_pat = new RegExp(/(^@tabwidth)/, 'm');

</t>
<t tx="felix.20210102181122.1">/*
    import binascii
    import codecs
    from functools import reduce
    try:
        import gc
    except ImportError:
        gc = None
    try:
        import gettext
    except ImportError:  # does not exist in jython.
        gettext = None
    import glob
    import io
    StringIO = io.StringIO
    import importlib
    import inspect
    import operator
    import os
    #
    # Do NOT import pdb here!  We shall define pdb as a _function_ below.
    # import pdb
    import re
    import shlex
    import shutil
    import string
    import subprocess
    import tempfile
    import time
    import traceback
    import types
    import unittest
    import urllib
    import urllib.parse as urlparse
*/

</t>
<t tx="felix.20210102211149.1">import * as os from "os";
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';
import { NodeIndices } from './leoNodes';
import { Commands } from './leoCommands';

</t>
<t tx="felix.20210102213337.1">/**
 *  A singleton class to manage idle-time handling. This class handles all
 *  details of running code at idle time, including running 'idle' hooks.
 *
 *  Any code can call g.app.idleTimeManager.add_callback(callback) to cause
 *  the callback to be called at idle time forever.
 */
export class IdleTimeManager {

    callback_list: ((...args: any[]) =&gt; any)[];
    timer: any;

    /**
     * Ctor for IdleTimeManager class.
    */
    constructor() {
        this.callback_list = [];
        this.timer = null;
    }

    @others

}

</t>
<t tx="felix.20210102213337.2">/*
def add_callback(self, callback):
    """Add a callback to be called at every idle time."""
    self.callback_list.append(callback)
*/

</t>
<t tx="felix.20210102213337.3">/*
on_idle_count = 0

def on_idle(self, timer):
    """IdleTimeManager: Run all idle-time callbacks."""
    if not g.app: return
    if g.app.killed: return
    if not g.app.pluginsController:
        g.trace('No g.app.pluginsController', g.callers())
        timer.stop()
        return  # For debugger.
    self.on_idle_count += 1
    # Handle the registered callbacks.
    for callback in self.callback_list:
        try:
            callback()
        except Exception:
            g.es_exception()
            g.es_print(f"removing callback: {callback}")
            self.callback_list.remove(callback)
    # Handle idle-time hooks.
    g.app.pluginsController.on_idle()

*/

</t>
<t tx="felix.20210102213337.4">/*
def start(self):
    """Start the idle-time timer."""
    self.timer = g.IdleTime(
        self.on_idle,
        delay=500,
        tag='IdleTimeManager.on_idle')
    if self.timer:
        self.timer.start()
*/

</t>
<t tx="felix.20210102214000.1">/**
 * A class representing the Leo application itself.
 * instance variables of this class are Leo's global variables.
 */
export class LeoApp {

    @others

}

</t>
<t tx="felix.20210102214029.1">&lt;&lt; LeoApp: command-line arguments &gt;&gt;
&lt;&lt; LeoApp: Debugging &amp; statistics &gt;&gt;
&lt;&lt; LeoApp: error messages &gt;&gt;
&lt;&lt; LeoApp: global directories &gt;&gt;
&lt;&lt; LeoApp: global data &gt;&gt;
&lt;&lt; LeoApp: global controller/manager objects &gt;&gt;
&lt;&lt; LeoApp: global reader/writer data &gt;&gt;
&lt;&lt; LeoApp: global status vars &gt;&gt;
&lt;&lt; LeoApp: the global log &gt;&gt;
&lt;&lt; LeoApp: global theme data &gt;&gt;
&lt;&lt; LeoApp: global types &gt;&gt;
&lt;&lt; LeoApp: plugins and event handlers &gt;&gt;
&lt;&lt; LeoApp: scripting ivars &gt;&gt;
&lt;&lt; LeoApp: unit testing ivars &gt;&gt;

public delegate_language_dict: { [key: string]: string } = {};
public extension_dict: { [key: string]: string } = {};
public extra_extension_dict: { [key: string]: string } = {};
public prolog_prefix_string: string = "";
public prolog_postfix_string: string = "";
public prolog_namespace_string: string = "";
public language_delims_dict: { [key: string]: string } = {};
public language_extension_dict: { [key: string]: string } = {};

@others

</t>
<t tx="felix.20210102214102.1">constructor() {
    // Define all global data.
    this.define_delegate_language_dict();
    this.init_at_auto_names();
    this.init_at_file_names();
    this.define_global_constants();
    this.define_language_delims_dict();
    this.define_language_extension_dict();
    this.define_extension_dict();
    // this.gui = p_gui;
    // this.nodeIndices = new NodeIndices(g.app.leoID);
}

</t>
<t tx="felix.20210102233013.1"></t>
<t tx="felix.20210102233013.2">public anyAtFileNodeName(): string {
    return this.v.anyAtFileNodeName();
}

public atAutoNodeName(): string {
    return this.v.atAutoNodeName();
}

public atCleanNodeName(): string {
    return this.v.atCleanNodeName();
}

public atEditNodeName(): string {
    return this.v.atEditNodeName();
}

public atFileNodeName(): string {
    return this.v.atFileNodeName();
}

public atNoSentinelsFileNodeName(): string {
    return this.v.atNoSentinelsFileNodeName();
}

public atShadowFileNodeName(): string {
    return this.v.atShadowFileNodeName();
}

public atSilentFileNodeName(): string {
    return this.v.atSilentFileNodeName();
}

public atThinFileNodeName(): string {
    return this.v.atThinFileNodeName();
}

public isAnyAtFileNode(): boolean {
    return this.v.isAnyAtFileNode();
}

public isAtAllNode(): boolean {
    return this.v.isAtAllNode();
}

public isAtAutoNode(): boolean {
    return this.v.isAtAutoNode();
}

public isAtAutoRstNode(): boolean {
    return this.v.isAtAutoRstNode();
}

public isAtCleanNode(): boolean {
    return this.v.isAtCleanNode();
}

public isAtEditNode(): boolean {
    return this.v.isAtEditNode();
}

public isAtFileNode(): boolean {
    return this.v.isAtFileNode();
}

public isAtIgnoreNode(): boolean {
    return this.v.isAtIgnoreNode();
}

public isAtNoSentinelsFileNode(): boolean {
    return this.v.isAtNoSentinelsFileNode();
}

public isAtOthersNode(): boolean {
    return this.v.isAtOthersNode();
}

public isAtRstFileNode(): boolean {
    return this.v.isAtRstFileNode();
}

public isAtSilentFileNode(): boolean {
    return this.v.isAtSilentFileNode();
}

public isAtShadowFileNode(): boolean {
    return this.v.isAtShadowFileNode();
}

public isAtThinFileNode(): boolean {
    return this.v.isAtThinFileNode();
}

public matchHeadline(pattern: string): boolean {
    return this.v.matchHeadline(pattern);
}

</t>
<t tx="felix.20210102233013.3">public bodyString(): string { return this.v.bodyString(); }

public headString(): string {
    return this.v.headString();
}

public cleanHeadString(): string {
    return this.v.cleanHeadString();
}

</t>
<t tx="felix.20210102233013.4">public isDirty(): boolean { return this.v.isDirty(); }

public isMarked(): boolean { return this.v.isMarked(); }

public isOrphan(): boolean { return this.v.isOrphan(); }

public isSelected(): boolean { return this.v.isSelected(); }

public isTopBitSet(): boolean { return this.v.isTopBitSet(); }

public isVisited(): boolean { return this.v.isVisited(); }

public status(): number { return this.v.status(); }

</t>
<t tx="felix.20210102234910.1"></t>
<t tx="felix.20210102234915.1">public bodyString() {
    return this._bodyString;
}

</t>
<t tx="felix.20210102235015.1"></t>
<t tx="felix.20210103000631.1">/**
 * Returns the first child or undefined if no children
 */
public firstChild(): VNode | undefined {
    if (this.children.length) {
        return this.children[0];
    }
    return undefined;
}

</t>
<t tx="felix.20210103003546.1">public hasChildren(): boolean {
    return !!this.children.length;
}

</t>
<t tx="felix.20210103003705.1">/**
 * Returns the last child or undefined if no children
 */
public lastChild(): VNode | undefined {
    if (this.children.length) {
        return this.children[this.children.length - 1];
    }
    return undefined;
}

</t>
<t tx="felix.20210103010323.1">/**
 * childIndex and nthChild are zero-based.
 */
public nthChild(n: number): VNode | undefined {
    if (0 &lt;= n &amp;&amp; n &lt; this.children.length) {
        return this.children[n];
    }
    return undefined;
}

</t>
<t tx="felix.20210103010327.1">public numberOfChildren(): number {
    return this.children.length;
}

</t>
<t tx="felix.20210103011425.1">/**
 * (New in 4.2) Return a list of all direct parent vnodes of a VNode.
 * This is NOT the same as the list of ancestors of the VNode.
 */
public directParents(): VNode[] {
    return this.parents;
}

</t>
<t tx="felix.20210103011621.1">/**
 * Return True if this VNode contains body text.
 */
public hasBody(): boolean {
    return !!this._bodyString &amp;&amp; this._bodyString.length &gt; 0;
}

</t>
<t tx="felix.20210103013608.1">/**
 * Return the headline string.
 */
public headString() {
    return this._headString;
}

</t>
<t tx="felix.20210103013802.1">/**
 * Return True if v is the n'th child of parent_v.
 */
public isNthChildOf(n: number, parent_v: VNode): boolean {
    const children: VNode[] | undefined = parent_v ? parent_v.children : undefined;
    return !!children &amp;&amp; 0 &lt;= n &amp;&amp; n &lt; children.length &amp;&amp; children[n].fileIndex === this.fileIndex;
}

</t>
<t tx="felix.20210103013805.1"></t>
<t tx="felix.20210103013805.10">public status(): number {
    return this.statusBits;
}

</t>
<t tx="felix.20210103013805.2">public isCloned(): boolean {
    return this.parents.length &gt; 1;
}

</t>
<t tx="felix.20210103013805.3">public isDirty(): boolean {
    return (this.statusBits &amp; StatusFlags.dirtyBit) !== 0;
}

</t>
<t tx="felix.20210103013805.4">public isMarked(): boolean {
    return (this.statusBits &amp; StatusFlags.markedBit) !== 0;
}

</t>
<t tx="felix.20210103013805.5">public isOrphan(): boolean {
    return (this.statusBits &amp; StatusFlags.orphanBit) !== 0;
}

</t>
<t tx="felix.20210103013805.6">public isSelected(): boolean {
    return (this.statusBits &amp; StatusFlags.selectedBit) !== 0;
}

</t>
<t tx="felix.20210103013805.7">public isTopBitSet(): boolean {
    return (this.statusBits &amp; StatusFlags.topBit) !== 0;
}

</t>
<t tx="felix.20210103013805.8">public isVisited(): boolean {
    return (this.statusBits &amp; StatusFlags.visitedBit) !== 0;
}

</t>
<t tx="felix.20210103013805.9">public isWriteBit(): boolean {
    return (this.statusBits &amp; StatusFlags.writeBit) !== 0;
}

</t>
<t tx="felix.20210103023444.1">/**
 * Return the headline string. Same as headString.
 */
public cleanHeadString() {
    return this._headString;
}

</t>
<t tx="felix.20210103024632.10">// To be moved to the LogManager.
public log = null; // The LeoFrame containing the present log.
public logInited: boolean = false; // False: all log message go to logWaiting list.
public logIsLocked: boolean = false; // True: no changes to log are allowed.
public logWaiting: any[] = []; // List of tuples(s, color, newline) waiting to go to a log.
public printWaiting: any[] = []; // Queue of messages to be sent to the printer.
public signon: string = '';
public signon1: string = '';
public signon2: string = '';

</t>
<t tx="felix.20210103024632.11">public theme_directory = null;
// The directory from which the theme file was loaded, if any.
// Set only by LM.readGlobalSettingsFiles.
// Used by the StyleSheetManager class.

</t>
<t tx="felix.20210103024632.12">/*
from leo.core import leoFrame
from leo.core import leoGui

public nullGui = leoGui.NullGui()
public nullLog = leoFrame.NullLog()
*/

</t>
<t tx="felix.20210103024632.13">public hookError: boolean = false; // True: suppress further calls to hooks.
// g.doHook sets g.app.hookError on all exceptions.
// Scripts may reset g.app.hookError to try again.
public hookFunction = null;
// Application wide hook function.
public idle_time_hooks_enabled: boolean = true;
// True: idle - time hooks are enabled.

</t>
<t tx="felix.20210103024632.14">public searchDict: any = {};
// For communication between find / change scripts.
public scriptDict: any = {};
// For use by scripts.Cleared before running each script.
public scriptResult = null;   // For use by leoPymacs.
public permanentScriptDict = {};   // For use by scrips.Never cleared automatically.

public isExternalUnitTest: boolean = false; // True: we are running a unit test externally.
public runningAllUnitTests: boolean = false; // True: we are running all unit tests(Only for local tests).

</t>
<t tx="felix.20210103024632.15">public suppressImportChecks: boolean = false;
// Used only in basescanner.py ;
// True: suppress importCommands.check
public unitTestDict = {};   // For communication between unit tests and code.
public unitTestGui = null;   // A way to override the gui in external unit tests.
public unitTesting = false;   // True if unit testing.
public unitTestMenusDict = {};   // Created in LeoMenu.createMenuEntries for a unit test. ;   // keys are command names.values are sets of strokes.

</t>
<t tx="felix.20210103024632.16">public define_delegate_language_dict(): void {
    this.delegate_language_dict = {
        // Keys are new language names.
        // Values are existing languages in leo / modes.
        "less": "css",
        "hbs": "html",
        "handlebars": "html",
        //"rust": "c",
        // "vue": "c",
    };
}

</t>
<t tx="felix.20210103024632.17">public define_extension_dict(): void {

    // Keys are extensions, values are languages
    this.extension_dict = {
        // "ada": "ada",
        "ada": "ada95", // modes / ada95.py exists.
        "ahk": "autohotkey",
        "aj": "aspect_j",
        "apdl": "apdl",
        "as": "actionscript", // jason 2003-07 - 03
        "asp": "asp",
        "awk": "awk",
        "b": "b",
        "bas": "rapidq", // fil 2004-march - 11
        "bash": "shellscript",
        "bat": "batch",
        "bbj": "bbj",
        "bcel": "bcel",
        "bib": "bibtex",
        "c": "c",
        "c++": "cplusplus",
        "cbl": "cobol", // Only one extension is valid: .cob
        "cfg": "config",
        "cfm": "coldfusion",
        "clj": "clojure", // 2013 / 09 / 25: Fix bug 879338.
        "cljs": "clojure",
        "cljc": "clojure",
        "ch": "chill", // Other extensions, .c186,.c286
        "coffee": "coffeescript",
        "conf": "apacheconf",
        "cpp": "cplusplus", // 2020 / 08 / 12: was cpp.
        "css": "css",
        "d": "d",
        "dart": "dart",
        "e": "eiffel",
        "el": "elisp",
        "eml": "mail",
        "erl": "erlang",
        "ex": "elixir",
        "f": "fortran",
        "f90": "fortran90",
        "factor": "factor",
        "forth": "forth",
        "g": "antlr",
        "groovy": "groovy",
        "h": "c", // 2012 / 05 / 23.
        "handlebars": "html", // McNab.
        "hbs": "html", // McNab.
        "hs": "haskell",
        "html": "html",
        "hx": "haxe",
        "i": "swig",
        "i4gl": "i4gl",
        "icn": "icon",
        "idl": "idl",
        "inf": "inform",
        "info": "texinfo",
        "ini": "ini",
        "io": "io",
        "ipynb": "jupyter",
        "iss": "inno_setup",
        "java": "java",
        "jhtml": "jhtml",
        "jmk": "jmk",
        "js": "javascript", // For javascript import test.
        "jsp": "javaserverpage",
        "json": "json",
        // "jsp": "jsp",
        "ksh": "kshell",
        "kv": "kivy", // PeckJ 2014/05/05
        "latex": "latex",
        "less": "css", // McNab
        "lua": "lua", // ddm 13/02/06
        "ly": "lilypond",
        "m": "matlab",
        "mak": "makefile",
        "md": "md", // PeckJ 2013/02/07
        "ml": "ml",
        "mm": "objective_c", // Only one extension is valid: .m
        "mod": "modula3",
        "mpl": "maple",
        "mqsc": "mqsc",
        "nqc": "nqc",
        "nsi": "nsi", // EKR: 2010/10/27
        // "nsi": "nsis2",
        "nw": "noweb",
        "occ": "occam",
        "otl": "vimoutline", // TL 8/25/08 Vim's outline plugin
        "p": "pascal",
        // "p": "pop11", // Conflicts with pascal.
        "php": "php",
        "pike": "pike",
        "pl": "perl",
        "pl1": "pl1",
        "po": "gettext",
        "pod": "perlpod",
        "pov": "povray",
        "prg": "foxpro",
        "pro": "prolog",
        "ps": "postscript",
        "psp": "psp",
        "ptl": "ptl",
        "py": "python",
        "pyx": "cython", // Other extensions, .pyd,.pyi
        // "pyx": "pyrex",
        // "r": "r", # modes / r.py does not exist.
        "r": "rebol", // jason 2003-07 - 03
        "rb": "ruby", // thyrsus 2008-11 - 05
        "rest": "rst",
        "rex": "objectrexx",
        "rhtml": "rhtml",
        "rib": "rib",
        "rs": "rust", // EKR: 2019/08/11
        "sas": "sas",
        "scala": "scala",
        "scm": "scheme",
        "scpt": "applescript",
        "sgml": "sgml",
        "sh": "shell", // DS 4/1/04.modes / shell.py exists.
        "shtml": "shtml",
        "sm": "smalltalk",
        "splus": "splus",
        "sql": "plsql", // qt02537 2005-05 - 27
        "sqr": "sqr",
        "ss": "ssharp",
        "ssi": "shtml",
        "sty": "latex",
        "tcl": "tcl", // modes / tcl.py exists.
        // "tcl": "tcltk",
        "tex": "latex",
        // "tex": "tex",
        "tpl": "tpl",
        "ts": "typescript",
        "txt": "plain",
        // "txt": "text",
        // "txt": "unknown", # Set when @comment is seen.
        "uc": "uscript",
        "v": "verilog",
        "vbs": "vbscript",
        "vhd": "vhdl",
        "vhdl": "vhdl",
        "vim": "vim",
        "vtl": "velocity",
        "w": "cweb",
        "wiki": "moin",
        "xml": "xml",
        "xom": "omnimark",
        "xsl": "xsl",
        "yaml": "yaml",
        "vue": "javascript",
        "zpt": "zpt"
    };

    /*
        # These aren't real languages, or have no delims...
            # cvs_commit, dsssl, embperl, freemarker, hex, jcl,
            # patch, phpsection, progress, props, pseudoplain,
            # relax_ng_compact, rtf, svn_commit.

        # These have extensions which conflict with other languages.
            # assembly_macro32: .asm or.a
            # assembly_mcs51:   .asm or.a
            # assembly_parrot:  .asm or.a
            # assembly_r2000:   .asm or.a
            # assembly_x86:     .asm or.a
            # squidconf:        .conf
            # rpmspec:          .rpm

        # Extra language extensions, used to associate extensions with mode files.
        # Used by importCommands.languageForExtension.
        # Keys are extensions, values are corresponding mode file(without.py)
        # A value of 'none' is a signal to unit tests that no extension file exists.

    */

    this.extra_extension_dict = {
        'pod': 'perl',
        'unknown_language': 'none',
        'w': 'none' // cweb
    };
}

</t>
<t tx="felix.20210103024632.18">public define_global_constants(): void {
    // this.prolog_string = "&lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt;";
    this.prolog_prefix_string = "&lt;?xml version=\"1.0\" encoding=";
    this.prolog_postfix_string = "?&gt;";
    this.prolog_namespace_string = 'xmlns:leo="http://edreamleo.org/namespaces/leo-python-editor/1.1"';
}

</t>
<t tx="felix.20210103024632.19">public define_language_delims_dict(): void {

    this.language_delims_dict = {
        // Internally, lower case is used for all language names.
        // Keys are languages, values are 1, 2 or 3-tuples of delims.
        "actionscript": "// /* */", // jason 2003-07 - 03
        "ada": "--",
        "ada95": "--",
        "ahk": ";",
        "antlr": "// /* */",
        "apacheconf": "#",
        "apdl": "!",
        "applescript": "-- (* *)",
        "asp": "&lt;!-- --&gt;",
        "aspect_j": "// /* */",
        "assembly_macro32": ";",
        "assembly_mcs51": ";",
        "assembly_parrot": "#",
        "assembly_r2000": "#",
        "assembly_x86": ";",
        "autohotkey": "; /* */", // TL - AutoHotkey language
        "awk": "#",
        "b": "// /* */",
        "batch": "REM_", // Use the REM hack.
        "bbj": "/* */",
        "bcel": "// /* */",
        "bibtex": "%",
        "c": "// /* */", // C, C++ or objective C.
        "chill": "/* */",
        "clojure": ";", // 2013 / 09 / 25: Fix bug 879338.
        "cobol": "*",
        "coldfusion": "&lt;!-- --&gt;",
        "coffeescript": "#", // 2016 / 02 / 26.
        "config": "#", // Leo 4.5.1
        "cplusplus": "// /* */",
        "cpp": "// /* */",// C++.
        "csharp": "// /* */", // C#
        "css": "/* */", // 4 / 1 / 04
        "cweb": "@q@ @&gt;", // Use the "cweb hack"
        "cython": "#",
        "d": "// /* */",
        "dart": "// /* */", // Leo 5.0.
        "doxygen": "#",
        "eiffel": "--",
        "elisp": ";",
        "erlang": "%",
        "elixir": "#",
        "factor": "!_ ( )", // Use the rem hack.
        "forth": "\\_ _(_ _)", // Use the "REM hack"
        "fortran": "C",
        "fortran90": "!",
        "foxpro": "&amp;&amp;",
        "gettext": "# ",
        "groovy": "// /* */",
        "handlebars": "&lt;!-- --&gt;", // McNab: delegate to html.
        "haskell": "--_ {-_ _-}",
        "haxe": "// /* */",
        "hbs": "&lt;!-- --&gt;", // McNab: delegate to html.
        "html": "&lt;!-- --&gt;",
        "i4gl": "-- { }",
        "icon": "#",
        "idl": "// /* */",
        "inform": "!",
        "ini": ";",
        "inno_setup": ";",
        "interlis": "/* */",
        "io": "// */",
        "java": "// /* */",
        "javascript": "// /* */", // EKR: 2011 / 11 / 12: For javascript import test.
        "javaserverpage": "&lt;%-- --%&gt;", // EKR: 2011 / 11 / 25(See also, jsp)
        "jhtml": "&lt;!-- --&gt;",
        "jmk": "#",
        "json": "#", // EKR: 2020 / 07 / 27: Json has no delims.This is a dummy entry.
        "jsp": "&lt;%-- --%&gt;",
        "jupyter": "&lt;%-- --%&gt;", // Default to markdown ?
        "kivy": "#", // PeckJ 2014 / 05 / 05
        "kshell": "#", // Leo 4.5.1.
        "latex": "%",
        "less": "/* */", // NcNab: delegate to css.
        "lilypond": "% %{ %}",
        "lisp": ";", // EKR: 2010 / 09 / 29
        "lotos": "(* *)",
        "lua": "--", // ddm 13 / 02 / 06
        "mail": "&gt;",
        "makefile": "#",
        "maple": "//",
        "markdown": "&lt;!-- --&gt;", // EKR, 2018 / 03 / 03: html comments.
        "matlab": "%", // EKR: 2011 / 10 / 21
        "md": "&lt;!-- --&gt;", // PeckJ: 2013 / 02 / 08
        "ml": "(* *)",
        "modula3": "(* *)",
        "moin": "##",
        "mqsc": "*",
        "netrexx": "-- /* */",
        "noweb": "%", // EKR: 2009 - 01 - 30. Use Latex for doc chunks.
        "nqc": "// /* */",
        "nsi": ";", // EKR: 2010 / 10 / 27
        "nsis2": ";",
        "objective_c": "// /* */",
        "objectrexx": "-- /* */",
        "occam": "--",
        "omnimark": ";",
        "pandoc": "&lt;!-- --&gt;",
        "pascal": "// { }",
        "perl": "#",
        "perlpod": "# __=pod__ __=cut__", // 9 / 25 / 02: The perlpod hack.
        "php": "// /* */", // 6 / 23 / 07: was "//",
        "pike": "// /* */",
        "pl1": "/* */",
        "plain": "#", // We must pick something.
        "plsql": "-- /* */", // SQL scripts qt02537 2005 - 05 - 27
        "pop11": ";;; /* */",
        "postscript": "%",
        "povray": "// /* */",
        "powerdynamo": "// &lt;!-- --&gt;",
        "prolog": "% /* */",
        "psp": "&lt;!-- --&gt;",
        "ptl": "#",
        "pvwave": ";",
        "pyrex": "#",
        "python": "#",
        "r": "#",
        "rapidq": "'", // fil 2004 - march - 11
        "rebol": ";", // jason 2003 - 07 - 03
        "redcode": ";",
        "rest": ".._",
        "rhtml": "&lt;%# %&gt;",
        "rib": "#",
        "rpmspec": "#",
        "rst": ".._",
        "rust": "// /* */",
        "ruby": "#", // thyrsus 2008 - 11 - 05
        "rview": "// /* */",
        "sas": "* /* */",
        "scala": "// /* */",
        "scheme": "; #| |#",
        "sdl_pr": "/* */",
        "sgml": "&lt;!-- --&gt;",
        "shell": "#",     // shell scripts
        "shellscript": "#",
        "shtml": "&lt;!-- --&gt;",
        "smalltalk": '" "', // Comments are enclosed in double quotes(!!)
        "smi_mib": "--",
        "splus": "#",
        "sqr": "!",
        "squidconf": "#",
        "ssharp": "#",
        "swig": "// /* */",
        "tcl": "#",
        "tcltk": "#",
        "tex": "%", // Bug fix: 2008 - 1 - 30: Fixed Mark Edginton's bug.
        "text": "#", // We must pick something.
        "texinfo": "@c",
        "tpl": "&lt;!-- --&gt;",
        "tsql": "-- /* */",
        "typescript": "// /* */", // For typescript import test.
        "unknown": "#", // Set when @comment is seen.
        "unknown_language": '#--unknown-language--', // For unknown extensions in @shadow files.
        "uscript": "// /* */",
        "vbscript": "'",
        "velocity": "## #* *#",
        "verilog": "// /* */",
        "vhdl": "--",
        "vim": "\"",
        "vimoutline": "#", // TL 8 / 25 / 08 Vim's outline plugin
        "xml": "&lt;!-- --&gt;",
        "xsl": "&lt;!-- --&gt;",
        "xslt": "&lt;!-- --&gt;",
        "yaml": "#",
        "zpt": "&lt;!-- --&gt;"

        // These aren't real languages, or have no delims...
        // "cvs_commit"         : "",
        // "dsssl"              : "; &lt;!-- --&gt;",
        // "embperl"            : "&lt;!-- --&gt;",  // Internal colorizing state.
        // "freemarker"         : "",
        // "hex"                : "",
        // "jcl"                : "",
        // "patch"              : "",
        // "phpsection"         : "&lt;!-- --&gt;",  // Internal colorizing state.
        // "props"              : "#",         // Unknown language.
        // "pseudoplain"        : "",
        // "relax_ng_compact"   : "#",         // An xml schema.
        // "rtf"                : "",
        // "svn_commit"         : "",
    };

}

</t>
<t tx="felix.20210103024632.2">public batchMode: boolean = false; // True: run in batch mode.
public debug = []; // A list of switches to be enabled.
public diff: boolean = false; // True: run Leo in diff mode.
public enablePlugins: boolean = true; // True: run start1 hook to load plugins. --no-plugins
public failFast: boolean = false; // True: Use the failfast option in unit tests.
public gui: LeoUI | undefined; // The gui class.
public guiArgName = null; // The gui name given in --gui option.
public ipython_inited: boolean = false; // True if leoIpython.py imports succeeded.
public isTheme: boolean = false; // True: load files as theme files (ignore myLeoSettings.leo).
public listen_to_log_flag: boolean = false; // True: execute listen-to-log command.
public qt_use_tabs: boolean = false; // True: using qt gui: allow tabbed main window.
public loaded_session: boolean = false; // Set at startup if no files specified on command line.
public silentMode: boolean = false; // True: no sign-on.
public start_fullscreen: boolean = false; // For qt_frame plugin.
public start_maximized: boolean = false; // For qt_frame plugin.
public start_minimized: boolean = false; // For qt_frame plugin.
public trace_binding = null; // The name of a binding to trace, or None.
public trace_setting = null; // The name of a setting to trace, or None.
public translateToUpperCase: boolean = false; // Never set to True.
public useIpython: boolean = false; // True: add support for IPython.
public use_psyco: boolean = false; // True: use psyco optimization.
public use_splash_screen: boolean = true; // True: put up a splash screen.

</t>
<t tx="felix.20210103024632.20">public define_language_extension_dict(): void {

    // Used only by g.app.externalFilesController.get_ext.

    // Keys are languages, values are extensions.
    this.language_extension_dict = {
        "actionscript": "as", // jason 2003-07 - 03
        "ada": "ada",
        "ada95": "ada",
        "ahk": "ahk",
        "antlr": "g",
        "apacheconf": "conf",
        "apdl": "apdl",
        "applescript": "scpt",
        "asp": "asp",
        "aspect_j": "aj",
        "autohotkey": "ahk", // TL - AutoHotkey language
        "awk": "awk",
        "b": "b",
        "batch": "bat", // Leo 4.5.1.
        "bbj": "bbj",
        "bcel": "bcel",
        "bibtex": "bib",
        "c": "c",
        "chill": "ch", // Only one extension is valid: .c186, .c286
        "clojure": "clj", // 2013 / 09 / 25: Fix bug 879338.
        "cobol": "cbl", // Only one extension is valid: .cob
        "coldfusion": "cfm",
        "coffeescript": "coffee",
        "config": "cfg",
        "cplusplus": "c++",
        "cpp": "cpp",
        "css": "css", // 4 / 1 / 04
        "cweb": "w",
        "cython": "pyx", // Only one extension is valid at present: .pyi, .pyd.
        "d": "d",
        "dart": "dart",
        "eiffel": "e",
        "elisp": "el",
        "erlang": "erl",
        "elixir": "ex",
        "factor": "factor",
        "forth": "forth",
        "fortran": "f",
        "fortran90": "f90",
        "foxpro": "prg",
        "gettext": "po",
        "groovy": "groovy",
        "haskell": "hs",
        "haxe": "hx",
        "html": "html",
        "i4gl": "i4gl",
        "icon": "icn",
        "idl": "idl",
        "inform": "inf",
        "ini": "ini",
        "inno_setup": "iss",
        "io": "io",
        "java": "java",
        "javascript": "js", // EKR: 2011/11/12: For javascript import test.
        "javaserverpage": "jsp", // EKR: 2011/11/25
        "jhtml": "jhtml",
        "jmk": "jmk",
        "json": "json",
        "jsp": "jsp",
        "jupyter": "ipynb",
        "kivy": "kv", // PeckJ 2014/05/05
        "kshell": "ksh", // Leo 4.5.1.
        "latex": "tex", // 1 / 8 / 04
        "lilypond": "ly",
        "lua": "lua", // ddm 13/02/06
        "mail": "eml",
        "makefile": "mak",
        "maple": "mpl",
        "matlab": "m",
        "md": "md", // PeckJ: 2013/02/07
        "ml": "ml",
        "modula3": "mod",
        "moin": "wiki",
        "mqsc": "mqsc",
        "noweb": "nw",
        "nqc": "nqc",
        "nsi": "nsi", // EKR: 2010/10/27
        "nsis2": "nsi",
        "objective_c": "mm", // Only one extension is valid: .m
        "objectrexx": "rex",
        "occam": "occ",
        "omnimark": "xom",
        "pascal": "p",
        "perl": "pl",
        "perlpod": "pod",
        "php": "php",
        "pike": "pike",
        "pl1": "pl1",
        "plain": "txt",
        "plsql": "sql", // qt02537 2005-05 - 27
        // "pop11"       : "p", // Conflicts with pascal.
        "postscript": "ps",
        "povray": "pov",
        "prolog": "pro",
        "psp": "psp",
        "ptl": "ptl",
        "pyrex": "pyx",
        "python": "py",
        "r": "r",
        "rapidq": "bas", // fil 2004-march - 11
        "rebol": "r", // jason 2003-07 - 03
        "rhtml": "rhtml",
        "rib": "rib",
        "rst": "rest",
        "ruby": "rb", // thyrsus 2008-11 - 05
        "rust": "rs", // EKR: 2019/08/11
        "sas": "sas",
        "scala": "scala",
        "scheme": "scm",
        "sgml": "sgml",
        "shell": "sh", // DS 4/1/04
        "shellscript": "bash",
        "shtml": "ssi", // Only one extension is valid: .shtml
        "smalltalk": "sm",
        "splus": "splus",
        "sqr": "sqr",
        "ssharp": "ss",
        "swig": "i",
        "tcl": "tcl",
        "tcltk": "tcl",
        "tex": "tex",
        "texinfo": "info",
        "text": "txt",
        "tpl": "tpl",
        "tsql": "sql", // A guess.
        "typescript": "ts",
        "unknown": "txt", // Set when @comment is seen.
        "uscript": "uc",
        "vbscript": "vbs",
        "velocity": "vtl",
        "verilog": "v",
        "vhdl": "vhd", // Only one extension is valid: .vhdl
        "vim": "vim",
        "vimoutline": "otl", // TL 8 / 25 / 08 Vim's outline plugin
        "xml": "xml",
        "xsl": "xsl",
        "xslt": "xsl",
        "yaml": "yaml",
        "zpt": "zpt"
    };

    /*
        # These aren't real languages, or have no delims...
            # cvs_commit, dsssl, embperl, freemarker, hex, jcl,
            # patch, phpsection, progress, props, pseudoplain,
            # relax_ng_compact, rtf, svn_commit.

        # These have extensions which conflict with other languages.
            # assembly_macro32: .asm or.a
            # assembly_mcs51:   .asm or.a
            # assembly_parrot:  .asm or.a
            # assembly_r2000:   .asm or.a
            # assembly_x86:     .asm or.a
            # squidconf:        .conf
            # rpmspec:          .rpm
    */

}

</t>
<t tx="felix.20210103024632.21">/**
 * Init the app.atAutoNames set.
 */
public init_at_auto_names(): void {
    this.atAutoNames = ["@auto-rst", "@auto"];
}

</t>
<t tx="felix.20210103024632.22">/**
 * Init the app.atFileNames set.
 */
public init_at_file_names(): void {
    this.atFileNames = [
        "@asis",
        "@edit",
        "@file-asis", "@file-thin", "@file-nosent", "@file",
        "@clean", "@nosent",
        "@shadow",
        "@thin",
    ];
}

</t>
<t tx="felix.20210103024632.3">public count: number = 0; // General purpose debugging count.
public debug_dict: any = {}; // For general use.
public disable_redraw: boolean = false; // True: disable all redraws.
public disableSave: boolean = false; // May be set by plugins.
public idle_timers: any[] = []; // A list of IdleTime instances, so they persist.
public log_listener: any = null; // The process created by the 'listen-for-log' command.
public positions: number = 0; // The number of positions generated.
public scanErrors: number = 0; // The number of errors seen by g.scanError.
public structure_errors: number = 0; // Set by p.safeMoveToThreadNext.
public statsDict: any = {}; // dict used by g.stat, g.clear_stats, g.print_stats.
public statsLockout: boolean = false; // A lockout to prevent unbound recursion while gathering stats.
public validate_outline: boolean = false; // True: enables c.validate_outline. (slow)

</t>
<t tx="felix.20210103024632.4">public menuWarningsGiven: boolean = false; // True: suppress warnings in menu code.
public unicodeErrorGiven: boolean = true; // True: suppress unicode trace-backs.

</t>
<t tx="felix.20210103024632.5">public extensionsDir = null; // The leo / extensions directory
public globalConfigDir = null; // leo / config directory
public globalOpenDir = null; // The directory last used to open a file.
public homeDir = null; // The user's home directory.
public homeLeoDir = null; // The user's home/.leo directory.
public loadDir = null; // The leo / core directory.
public machineDir = null; // The machine - specific directory.

</t>
<t tx="felix.20210103024632.6">public atAutoNames: string[] = []; // The set of all @auto spellings.
public atFileNames: string[] = []; // The set of all built -in @&lt;file&gt;spellings.

public globalKillBuffer: any[] = []; // The global kill buffer.
public globalRegisters: any = {}; // The global register list.
public leoID: string = 'test'; // The id part of gnx's, using empty for falsy.
public loadedThemes: any[] = []; // List of loaded theme.leo files.
public lossage: any[] = []; // List of last 100 keystrokes.
public paste_c: any = null; // The commander that pasted the last outline.
public spellDict: any = null; // The singleton PyEnchant spell dict.
public numberOfUntitledWindows: number = 0; // Number of opened untitled windows.
public windowList: any[] = []; // * Global list of all frames. USE _commandersList instead
public realMenuNameDict = {}; // Translations of menu names.

// * Opened Leo File Commanders
public commandersList: Commands[] = [];
</t>
<t tx="felix.20210103024632.7">// Most of these are defined in initApp.
public backgroundProcessManager: any = null; // The singleton BackgroundProcessManager instance.
public commander_cacher: any = null; // The singleton leoCacher.CommanderCacher instance.
public commander_db: any = null; // The singleton db, managed by g.app.commander_cacher.
public config: any = null; // The singleton leoConfig instance.
public db: any = null; // The singleton global db, managed by g.app.global_cacher.
public externalFilesController: any = null; // The singleton ExternalFilesController instance.
public global_cacher: any = null; // The singleton leoCacher.GlobalCacher instance.
public idleTimeManager: any = null; // The singleton IdleTimeManager instance.
public ipk: any = null; // python kernel instance
public loadManager: LoadManager | undefined; // The singleton LoadManager instance.
// public logManager: any = null;
// The singleton LogManager instance.
// public openWithManager: any = null;
// The singleton OpenWithManager instance.
public nodeIndices: NodeIndices | undefined; // The singleton nodeIndices instance.
public pluginsController: any = null; // The singleton PluginsManager instance. public sessionManager: any = null; // The singleton SessionManager instance. // The Commands class...
public commandName: any = null; // The name of the command being executed.
public commandInterruptFlag: boolean = false; // True: command within a command.

</t>
<t tx="felix.20210103024632.8">// From leoAtFile.py.
public atAutoWritersDict: any = {};
public writersDispatchDict: any = {};
// From leoImport.py
public atAutoDict: any = {};
// Keys are @auto names, values are scanner classes.
public classDispatchDict: any = {};

</t>
<t tx="felix.20210103024632.9">public already_open_files: any[] = []; // A list of file names that * might * be open in another copy of Leo.
public dragging: boolean = false; // True: dragging.
public inBridge: boolean = false; // True: running from leoBridge module.
public inScript: boolean = false; // True: executing a script.
public initing: boolean = true; // True: we are initializing the app.
public initComplete: boolean = false; // True: late bindings are not allowed.
public killed: boolean = false; // True: we are about to destroy the root window.
public openingSettingsFile: boolean = false; // True, opening a settings file.
public preReadFlag: boolean = false; // True: we are pre - reading a settings file.
public quitting: boolean = false; // True: quitting.Locks out some events.
public restarting: boolean = false; // True: restarting all of Leo.#1240.
public reverting: boolean = false; // True: executing the revert command.
public syntax_error_files: any[] = [];

</t>
<t tx="felix.20210103231554.1">/**
 * Define a file-like object for redirecting writes to a string.
 * The caller is responsible for handling newlines correctly.
 */
export class FileLikeObject {

    public encoding: string;
    public ptr: number;
    private _list: string[];

    constructor(encoding: string = 'utf-8', fromString?: string) {
        this.encoding = encoding || 'utf-8';
        this._list = splitLines(fromString);  // Must preserve newlines!
        this.ptr = 0;
    }

    @others

}

</t>
<t tx="felix.20210103231554.2">public clear(): void {
    this._list = [];
}

</t>
<t tx="felix.20210103231554.3">public close(): void {
    // pass
}

</t>
<t tx="felix.20210103231554.4">public flush(): void {
    // pass
}

</t>
<t tx="felix.20210103231554.5">public get(): string {
    return this._list.join();
}

// Todo : maybe add names to prototype instead
public getvalue(): string {
    return this.get();
}

public read(): string {
    return this.get();
}

</t>
<t tx="felix.20210103231554.6">/**
 * Read the next line using at.list and at.ptr.
 */
public readline(): string {
    if (this.ptr &lt; this._list.length) {
        const line: string = this._list[this.ptr];
        this.ptr++;
        return line;
    }
    return '';
}

</t>
<t tx="felix.20210103231554.7">public write(s: string): void {
    if (s) {
        this._list.push(s);
    }
}

</t>
<t tx="felix.20210103234820.1">/**
 * Return &lt; &lt; s &gt; &gt;
 */
export function angleBrackets(s: string): string {
    const lt = "&lt;&lt;";
    const rt = "&gt;&gt;";
    return lt + s + rt;
}

</t>
<t tx="felix.20210104000547.1">/**
 * Return the caller name i levels up the stack.
 */
export function caller(i: number = 1): string {
    return callers(i + 1).split(',')[0];
}

</t>
<t tx="felix.20210104001301.1">/**
 * Return a string containing a comma-separated list of the callers
 * of the function that called callerList.
 *
 * excludeCaller: True (the default), callers itself is not on the list.
 *
 * If the `verbose` keyword is True, return a list separated by newlines.
 */
export function callers(n: number = 4, count: number = 0, excludeCaller: boolean = true, verbose: boolean = false): string {
    // Be careful to call _callerName with smaller values of i first:
    // sys._getframe throws ValueError if there are less than i entries.
    let result: string[] = [];
    let i: number = excludeCaller ? 3 : 2;
    while (1) {
        let s: string = _callerName(i, verbose);
        if (s) {
            result.push(s);
        }
        if (!s || result.length &gt;= n) {
            break;
        }
        i += 1;
    }

    result.reverse();
    if (count &gt; 0) {
        result = result.slice(0, count);
    }
    // if (verbose) {
    // return ''; //''.join([f"\n  {z}" for z in result]);
    // }
    return result.join(',');
}

</t>
<t tx="felix.20210104003932.1">/**
 * Split s into lines, preserving the number of lines and the endings
 * of all lines, including the last line.
 */
export function splitLines(s?: string): string[] {
    if (s) {
        return s.split(/\r?\n/);
    } else {
        return [];
    }
}

</t>
<t tx="felix.20210104010331.1">export function _callerName(n: number, verbose: boolean = false): string {
    // TODO : see Error().stack to access names from the call stack
    // return Error.stack.split()[n]; // or something close to that
    return "&lt;_callerName&gt;";
}

</t>
<t tx="felix.20210104194650.1">/**
 * Return a result dict that is a copy of the keys dict
 * with missing items replaced by defaults in d dict.
 */
export function doKeywordArgs(keys: { [key: string]: any }, d: { [key: string]: any } = {}): { [key: string]: any } {
    if (d === null) {
        d = {}; // May be unnecessary
    }
    const result: { [key: string]: any } = {};

    for (var key in d) {
        if (d.hasOwnProperty(key)) {
            const default_val = d[key];

            const isBool: boolean = [true, false].includes(default_val);
            const val: any = keys.hasOwnProperty(key) ? keys[key] : null;

            if (isBool &amp;&amp; [true, 'True', 'true'].includes(val)) {
                result[key] = true;
            } else if (isBool &amp;&amp; [false, 'False', 'false'].includes(val)) {
                result[key] = false;
            } else if (val === null) {
                result[key] = default_val;
            } else {
                result[key] = val;
            }
        }
    }

    return result;
}

</t>
<t tx="felix.20210104210231.1">export const error = console.error;

</t>
<t tx="felix.20210104210234.1">// TODO : Replace with output to proper 'Leo log pane'
export const es = console.log;

</t>
<t tx="felix.20210104210248.1">export function es_exception(): string {
    console.log('es_exception called');
    return '&lt;no file&gt;';
}

/*
    ### es_exception Old code
        # typ, val, tb = sys.exc_info()
        # # val is the second argument to the raise statement.
        # if full:
            # lines = traceback.format_exception(typ, val, tb)
        # else:
            # lines = traceback.format_exception_only(typ, val)
        # for line in lines:
            # g.es_print_error(line, color=color)
        # fileName, n = g.getLastTracebackFileAndLineNumber()
        # return fileName, n
*/

</t>
<t tx="felix.20210104210254.1">/**
 * TODO : This is a temporary console output
 * Print all non-keyword args, and put them to the log pane.
 * Python code was:
 *     pr(*args, **keys)
 *     es(*args, **keys)
 */
export const es_print = console.log;

</t>
<t tx="felix.20210104210259.1">/**
 * Return True if s starts with a directive.
 */
export function isDirective(s: string): boolean {

    const m: RegExpExecArray | null = g_is_directive_pattern.exec(s);
    if (m) {
        // This pattern excludes @encoding.whatever and @encoding(whatever)
        // It must allow @language python, @nocolor-node, etc.
        const s2: string = s.substring(m.index + m[0].length); // text from end of match #1 (the word after @)
        if (s2 &amp;&amp; ".(".includes(s2.charAt(0))) {
            return false;
        }
        return globalDirectiveList.includes(m[1]);
    }
    return false;
}

</t>
<t tx="felix.20210104210307.1">/**
 * Return non-negative number if the body text contains the @ directive.
 */
export function is_special(s: string, directive: string): number {
    console.assert(directive &amp;&amp; directive.substring(0, 1) === '@');
    // Most directives must start the line.
    const lws: boolean = ["@others", "@all"].includes(directive);
    const pattern = lws ? new RegExp("^\\s*(" + directive + "\\b)", 'm') : new RegExp("^(" + directive + "\\b)", 'm');

    const m = pattern.exec(s);

    if (m) {
        // javascript returns index including spaces before the match after newline
        return m.index + m[0].length - m[1].length;
    }
    return -1;
}

</t>
<t tx="felix.20210104210316.1">/**
 * Return True if ch should be considered a letter.
 */
export function isWordChar(ch: string): boolean {
    return !!ch &amp;&amp; (/^[0-9a-zA-Z]$/.test(ch) || ch === '_');
}

export function isWordChar1(ch: string): boolean {
    return !!ch &amp;&amp; (/^[a-zA-Z]$/.test(ch) || ch === '_');
}

</t>
<t tx="felix.20210108005428.1">export function match(s: string, i: number, pattern: string): boolean {
    // Warning: this code makes no assumptions about what follows pattern.
    // Equivalent to original in python (only looks in specific substring)
    // return s and pattern and s.find(pattern, i, i + len(pattern)) == i
    return !!s &amp;&amp; !!pattern &amp;&amp; s.substring(i, i + pattern.length + 1).search(pattern) === 0;
}

</t>
<t tx="felix.20210108011201.1">export function match_word(s: string, i: number, pattern: string): boolean {
    // TODO : This is weak lacks performance. Solidify this method!
    const pat = new RegExp(pattern + "\\b");
    return s.substring(i).search(pat) === 0;
}

</t>
<t tx="felix.20210109001345.1">/**
 * Pretty print any array / python list to string
 * TODO : Temporary json stringify
 */
export function listToString(obj: any): string {
    return JSON.stringify(obj, undefined, 4);
}

</t>
<t tx="felix.20210109002058.1">/**
 * Return "s" or "" depending on n.
 */
export function plural(obj: any): string {
    let n: number;
    if (Array.isArray(obj) || ((typeof obj) === "string")) {
        n = obj.length;
    } else if ((typeof obj) === "object") {
        n = Object.keys(obj).length;
    } else {
        n = obj;
    }
    return n === 1 ? '' : "s";
}

</t>
<t tx="felix.20210109003521.1">/**
 * Print all non-keyword args.
 */
export const pr = console.log;
// TODO : Replace with output to proper 'Leo terminal output'
// def pr(*args, **keys):
//     """ Print all non-keyword args."""
//     result = []
//     for arg in args:
//         if isinstance(arg, str):
//             result.append(arg)
//         else:
//             result.append(repr(arg))
//     print(','.join(result))

</t>
<t tx="felix.20210109004916.1">/**
 * Pretty print any Python object using pr.
 */
export function printObj(obj: any, indent = '', printCaller = false, tag = null): void {
    // TODO : Replace with output to proper pr function
    //     pr(objToString(obj, indent=indent, printCaller=printCaller, tag=tag))
    pr(obj);
}

</t>
<t tx="felix.20210109005341.1">/**
 * Return the base name of a path.
 */
export function shortFileName(fileName: string): string {
    //  return os.path.basename(fileName) if fileName else ''
    return fileName ? path.basename(fileName) : '';

}

export const shortFilename = shortFileName;

</t>
<t tx="felix.20210109180936.1">/**
 * Returns object instead of original python tuple
 */
export function skip_to_char(s: string, i: number, ch: string): { position: number; result: string; } {
    const j: number = s.indexOf(ch, i);
    if (j === -1) {
        return {
            position: s.length,
            result: s.substring(i)
        };
    }
    return {
        position: j,
        result: s.substring(i, j)
    };
}

</t>
<t tx="felix.20210109190137.1">export function skip_id(s: string, i: number, chars: string | null = null): number {
    chars = chars ? chars.toString() : '';
    const n = s.length;
    while (i &lt; n &amp;&amp; (isWordChar(s.charAt(i)) || chars.indexOf(s.charAt(i)) &gt;= 0)) {
        i += 1;
    }
    return i;
}

</t>
<t tx="felix.20210109192733.1">export function skip_ws(s: string, i: number): number {
    const n: number = s.length;
    while (i &lt; n &amp;&amp; ('\t '.indexOf(s.charAt(i)))) {
        i += 1;
    }
    return i;
}

export function skip_ws_and_nl(s: string, i: number): number {
    const n: number = s.length;
    while (i &lt; n &amp;&amp; (' \t\n\r'.indexOf(s.charAt(i)))) {
        i += 1;
    }
    return i;
}

</t>
<t tx="felix.20210109224332.1">/**
 * Convert unicode string to an encoded string.
 */
export function toEncodedString(s: any, encoding = 'utf-8', reportErrors = false): string {
    if ((typeof s) !== "string") {
        return s;
    }
    // TODO : TEST AND CHECK IF MORE THAN utf-8 IS NEEDED
    // use atob() for ascii to base 64, or other functionality for more encodings
    // (other examples)
    //     btoa(unescape(encodeURIComponent(str))))
    //     decodeURIComponent(JSON.parse('"' + s.replace('"', '\\"') + '"'));
    // OTHER EXAMPLES
    // str.replace(/[^\0-~]/g, function(ch) {
    //     return "\\u" + ("000" + ch.charCodeAt().toString(16)).slice(-4);
    // });

    // ORIGINAL
    // * These are the only significant calls to s.encode in Leo.
    // try:
    //     s = s.encode(encoding, "strict")
    // except UnicodeError:
    //     s = s.encode(encoding, "replace")
    //     if reportErrors:
    //         error(f"Error converting {s} from unicode to {encoding} encoding")

    return s; // skip for now
}

</t>
<t tx="felix.20210110163748.1">/**
 * Convert bytes to unicode if necessary.
 */
export function toUnicode(s: any, encoding: string | null = null, reportErrors = false): string {
    // TODO : SEE g.toEncodedString.

    // ORIGINAL
    // if isinstance(s, str):
    //     return s
    // tag = 'g.toUnicode'
    // if not isinstance(s, bytes):
    //     if callers() not in unicode_warnings:
    //         unicode_warnings[callers] = True
    //         error(f"{tag}: unexpected argument of type {s.__class__.__name__}")
    //         trace(callers())
    //     return ''
    // if not encoding:
    //     encoding = 'utf-8'
    // try:
    //     s = s.decode(encoding, 'strict')
    // except(UnicodeDecodeError, UnicodeError):
    //     # https://wiki.python.org/moin/UnicodeDecodeError
    //     s = s.decode(encoding, 'replace')
    //     if reportErrors:
    //         error(f"{tag}: unicode error. encoding: {encoding!r}, s:\n{s!r}")
    //         trace(callers())
    // except Exception:
    //     es_exception()
    //     error(f"{tag}: unexpected error! encoding: {encoding!r}, s:\n{s!r}")
    //     trace(callers())
    // return s

    return s; // Skip for now
}

</t>
<t tx="felix.20210110163753.1">/**
 * Print a tracing message
 */
export const trace = console.log;
// TODO : Replace with output to proper 'Leo terminal output'

</t>
<t tx="felix.20210110210346.1">@language typescript
@tabwidth -4

// ambient module declaration for https://www.npmjs.com/package/date-format-lite
declare module "date-format-lite" { }

// date-format-lite augments built-in Date
interface Date {
    format: (format?: string) =&gt; string;
    masks: { default: string };
}

</t>
<t tx="felix.20210110213751.1">/**
 * Check that no vnode exists with the given gnx in fc.gnxDict.
 */
public check_gnx(c: Commands, gnx: string, v: VNode): void {
    // TODO : Type 'c' as Commands class

    if (gnx === 'hidden-root-vnode-gnx') {
        // No longer an error.
        // fast.readWithElementTree always generates a nominal hidden vnode.
        return;
    }

    // TODO : Check in "gnxDict" from passed commander parameter

    // fc = c.fileCommands
    // v2 = fc.gnxDict.get(gnx)
    // if v2 and v2 != v:
    //     g.error(
    //         f"getNewIndex: gnx clash {gnx}\n"
    //         f"          v: {v}\n"
    //         f"         v2: {v2}")

}

</t>
<t tx="felix.20210110222544.1">&lt;&lt; imports &gt;&gt;
@others
@language typescript
@tabwidth -4

</t>
<t tx="felix.20210110223514.1">/**
 * A per-outline class that implements most of Leo's commands. The
 * "c" predefined object is an instance of this class.
 *
 * c.initObjects() creates subcommanders corresponding to files in the
 * leo/core and leo/commands. All of Leo's core code is accessible
 * via this class and its subcommanders.
 */
export class Commands {

    // Official ivars.
    private _currentPosition: Position | undefined;
    private _topPosition: Position | undefined;

    public hiddenRootNode: VNode;
    public fileCommands: FileCommands;

    public gui: LeoUI;

    // TODO : fake frame needed?
    // TODO : maybe MERGE frame.tree.generation WITH _treeId?
    public frame: { tree: { generation: number; } } = {
        tree: {
            generation: 0
        }
    };

    @others

}

</t>
<t tx="felix.20210112001859.1">public recolor(): void {
    console.log("recolor");
}

public redraw(): void {
    console.log("redraw");
}

public redraw_after_icons_changed(): void {
    console.log("redraw_after_icons_changed");
}

public alert(...arg: any[]): void {
    console.log(...arg);
}

</t>
<t tx="felix.20210112010737.1"></t>
<t tx="felix.20210112010737.2">// This used to be time-critical code.
public childIndex(): number {
    return this._childIndex;
}

</t>
<t tx="felix.20210112010737.3">public directParents(): any {
    return this.v.directParents();
}

</t>
<t tx="felix.20210112010737.4">public hasChildren(): boolean {
    return this.v.children.length &gt; 0;
}

public numberOfChildren(): number {
    return this.v.children.length;
}

</t>
<t tx="felix.20210112210731.1"></t>
<t tx="felix.20210112210731.10">/**
 * Returns True if the headline matches the pattern ignoring whitespace and case.
 * The headline may contain characters following the successfully matched pattern.
 */
public matchHeadline(pattern: string): boolean {
    const v: VNode = this;
    let h: string = g.toUnicode(v.headString());
    h = h.toLowerCase().replace(' ', '').replace('\t', '');
    // equivalent to h = h.lstrip('.')
    // 2013/04/05. Allow leading period before section names.
    while (h.charAt(0) === '.') {
        h = h.substring(1);
    }
    pattern = g.toUnicode(pattern);
    pattern = pattern.toLowerCase().replace(' ', '').replace('\t', '');
    return h.startsWith(pattern);
}

</t>
<t tx="felix.20210112210731.2">/**
 * Return the name following one of the names in nameList or "".
 */
public findAtFileName(names: string[], h?: string): string {
    // Allow h argument for unit testing.
    if (!h) {
        h = this.headString();
    }

    if (!g.match(h, 0, '@')) {
        return "";
    }

    const i: number = g.skip_id(h, 1, '-');

    const word: string = h.substring(0, i);

    if (names.includes(word) &amp;&amp; g.match_word(h, 0, word)) {
        const name = h.substring(i).trim();
        return name;
    }

    return "";
}

</t>
<t tx="felix.20210112210731.3">/**
 * Return the file name following an @file node or an empty string.
 */
public anyAtFileNodeName(): string {
    return (
        // was g.app.atAutoNames and g.app.atFileNames.
        // this.findAtFileName(this.atAutoNames) ||
        // this.findAtFileName(this.atFileNames)

        this.findAtFileName(g.app.atAutoNames) ||
        this.findAtFileName(g.app.atFileNames)
    );
}

</t>
<t tx="felix.20210112210731.4">// These return the filename following @xxx, in v.headString.
// Return the the empty string if v is not an @xxx node.

public atAutoNodeName(h?: string) {
    // return this.findAtFileName(this.atAutoNames, h);
    return this.findAtFileName(g.app.atAutoNames, h);
}

// Retain this special case as part of the "escape hatch".
// That is, we fall back on code in leoRst.py if no
// importer or writer for reStructuredText exists.

public atAutoRstNodeName(h?: string) {
    const names: string[] = ["@auto-rst"];
    return this.findAtFileName(names, h);
}

public atCleanNodeName() {
    const names: string[] = ["@clean"];
    return this.findAtFileName(names);
}

public atEditNodeName() {
    const names: string[] = ["@edit"];
    return this.findAtFileName(names);
}

public atFileNodeName() {
    const names: string[] = ["@file", "@thin"];
    // Fix #403.
    return this.findAtFileName(names);
}

public atNoSentinelsFileNodeName() {
    const names: string[] = ["@nosent", "@file-nosent"];
    return this.findAtFileName(names);
}

public atRstFileNodeName() {
    const names: string[] = ["@rst"];
    return this.findAtFileName(names);
}

public atShadowFileNodeName() {
    const names: string[] = ["@shadow"];
    return this.findAtFileName(names);
}

public atSilentFileNodeName() {
    const names: string[] = ["@asis", "@file-asis"];
    return this.findAtFileName(names);
}

public atThinFileNodeName() {
    const names: string[] = ["@thin", "@file-thin"];
    return this.findAtFileName(names);
}

</t>
<t tx="felix.20210112210731.5">/**
 * Returns True if the receiver contains @others in its body at the start of a line.
 */
public isAtAllNode(): boolean {
    const flag: boolean = g.is_special(this._bodyString, "@all") &lt; 0;
    return flag;
}

</t>
<t tx="felix.20210112210731.6">/**
 * Return True if v is any kind of @file or related node.
 */
public isAnyAtFileNode(): boolean {
    // This routine should be as fast as possible.
    // It is called once for every VNode when writing a file.
    const h: string = this.headString();
    return !!h &amp;&amp; h.substring(0, 1) === '@' &amp;&amp; !!this.anyAtFileNodeName();
}

</t>
<t tx="felix.20210112210731.7">public isAtAutoNode(): boolean {
    return !!this.atAutoNodeName();
}

public isAtAutoRstNode(): boolean {
    return !!this.atAutoRstNodeName();
}

public isAtCleanNode(): boolean {
    return !!this.atCleanNodeName();
}

public isAtEditNode(): boolean {
    return !!this.atEditNodeName();
}

public isAtFileNode(): boolean {
    return !!this.atFileNodeName();
}

public isAtRstFileNode(): boolean {
    return !!this.atRstFileNodeName();
}

public isAtNoSentinelsFileNode(): boolean {
    return !!this.atNoSentinelsFileNodeName();
}

public isAtSilentFileNode(): boolean {
    // @file-asis
    return !!this.atSilentFileNodeName();
}

public isAtShadowFileNode(): boolean {
    return !!this.atShadowFileNodeName();
}

public isAtThinFileNode(): boolean {
    return !!this.atThinFileNodeName();
}

</t>
<t tx="felix.20210112210731.8">/**
 * Returns True if:
 * - the vnode' body contains @ignore at the start of a line or
 * - the vnode's headline starts with @ignore.
 */
public isAtIgnoreNode(): boolean {
    if (g.match_word(this._headString, 0, '@ignore')) {
        return true;
    }
    const flag: boolean = g.is_special(this._bodyString, "@ignore") &lt; 0;
    return flag;
}

</t>
<t tx="felix.20210112210731.9">/**
 * Returns True if the receiver contains @others in its body at the start of a line.
 */
public isAtOthersNode(): boolean {
    const flag: boolean = g.is_special(this._bodyString, "@others") &lt; 0;
    return flag;
}

</t>
<t tx="felix.20210115195450.1"></t>
<t tx="felix.20210115195450.10">public clearVisited(): void {
    this.statusBits &amp;= ~StatusFlags.visitedBit;
}

</t>
<t tx="felix.20210115195450.11">/**
 * Contract the node.
 */
public contract(): void {
    this.statusBits &amp;= ~StatusFlags.expandedBit;
}


/**
 * Expand the node.
 */
public expand(): void {
    this.statusBits |= StatusFlags.expandedBit;
}


/**
 * Init self.statusBits.
 */
public initExpandedBit(): void {
    this.statusBits |= StatusFlags.expandedBit;
}


/**
 * Return True if the VNode expansion bit is set.
 */
public isExpanded(): boolean {
    return !!(this.statusBits &amp; StatusFlags.expandedBit);
}

</t>
<t tx="felix.20210115195450.12">public initStatus(status: number): void {
    this.statusBits = status;
}

</t>
<t tx="felix.20210115195450.13">public setClonedBit(): void {
    this.statusBits |= StatusFlags.clonedBit;
}

public initClonedBit(val: boolean): void {
    if (val) {
        this.statusBits |= StatusFlags.clonedBit;
    } else {
        this.statusBits &amp;= ~StatusFlags.clonedBit;
    }
}

</t>
<t tx="felix.20210115195450.14">public setMarked(): void {
    this.statusBits |= StatusFlags.markedBit;
}

public initMarkedBit(): void {
    this.statusBits |= StatusFlags.markedBit;
}

</t>
<t tx="felix.20210115195450.15">/**
 * Set the vnode's orphan bit.
 */
public setOrphan(): void {
    this.statusBits |= StatusFlags.orphanBit;
}

</t>
<t tx="felix.20210115195450.16">/**
 * This only sets the selected bit.
 */
public setSelected(): void {
    this.statusBits |= StatusFlags.selectedBit;
}

</t>
<t tx="felix.20210115195450.17">/**
 * Compatibility routine for scripts
 */
public setVisited(): void {
    this.statusBits |= StatusFlags.visitedBit;
}

</t>
<t tx="felix.20210115195450.18">public setWriteBit(): void {
    this.statusBits |= StatusFlags.writeBit;
}

</t>
<t tx="felix.20210115195450.19">public computeIcon(): number {
    let val: number = 0;
    const v: VNode = this;
    if (v.hasBody()) { val += 1; }
    if (v.isMarked()) { val += 2; }
    if (v.isCloned()) { val += 4; }
    if (v.isDirty()) { val += 8; }
    return val;
}

public setIcon(): void {
    //  pass # Compatibility routine for old scripts
}

</t>
<t tx="felix.20210115195450.2"></t>
<t tx="felix.20210115195450.20">/**
 * Conserve cursor and scroll positions
 * from the UI into this vnode's
 * insertSpot and scrollBarSpot
 */
public saveCursorAndScroll(): void {
    // TODO

    /*
    const v:VNode = this;
    const c:any = v.context;

    w = c.frame.body
    if not w:
        return
    try:
        v.scrollBarSpot = w.getYScrollPosition()
        v.insertSpot = w.getInsertPoint()
    except AttributeError:
        # 2011/03/21: w may not support the high-level interface.
        pass
    */

}

</t>
<t tx="felix.20210115195450.21">public setBodyString(s: string): void {
    const v: VNode = this;
    if ((typeof s) === 'string') {
        v._bodyString = s;
        return;
    }
    // TODO : Check if needed
    try {
        v._bodyString = g.toUnicode(s, null, true);
    }
    catch (exception) {
        if (!this.unicode_warning_given) {
            this.unicode_warning_given = true;
            g.error(s);
            g.es_exception();
        }
    }
    // self.contentModified()  # #1413.
    // signal_manager.emit(self.context, 'body_changed', self)
}

public setHeadString(s: string): void {
    // Fix bug: https://bugs.launchpad.net/leo-editor/+bug/1245535
    // API allows headlines to contain newlines.
    const v: VNode = this;
    s = g.toUnicode(s, null, true);
    v._headString = s.replace('\n', '');
    // self.contentModified()  # #1413.
}

</t>
<t tx="felix.20210115195450.22">public setSelection(start: number, length: number): void {
    const v: VNode = this;
    v.selectionStart = start;
    v.selectionLength = length;
}

</t>
<t tx="felix.20210115195450.3">/**
 * Clear the vnode dirty bit.
 */
public clearDirty(): void {
    this.statusBits &amp;= ~StatusFlags.dirtyBit;
}

</t>
<t tx="felix.20210115195450.4">/**
 * Set the vnode dirty bit.
 * This method is fast, but dangerous. Unlike p.setDirty, this method does
 * not call v.setAllAncestorAtFileNodesDirty.
 */
public setDirty(): void {
    this.statusBits |= StatusFlags.dirtyBit;
}

</t>
<t tx="felix.20210115195450.5"></t>
<t tx="felix.20210115195450.6">public clearClonedBit(): void {
    this.statusBits &amp;= ~StatusFlags.clonedBit;
}

</t>
<t tx="felix.20210115195450.7">public clearMarked(): void {
    this.statusBits &amp;= ~StatusFlags.markedBit;
}

</t>
<t tx="felix.20210115195450.8">public clearWriteBit(): void {
    this.statusBits &amp;= ~StatusFlags.writeBit;
}

</t>
<t tx="felix.20210115195450.9">public clearOrphan(): void {
    this.statusBits &amp;= ~StatusFlags.orphanBit;
}

</t>
<t tx="felix.20210116003530.1">/**
 * Original idea by Виталије Милошевић (Vitalije Milosevic).
 * Modified by EKR.
 * Translated by Félix
 */
public setAllAncestorAtFileNodesDirty(): void {
    const v: VNode = this;
    const hiddenRootVnode: VNode = v.context.hiddenRootNode!;

    function* v_and_parents(v: VNode): Generator&lt;VNode&gt; {
        if (v.fileIndex !== hiddenRootVnode.fileIndex) {
            yield v;
            for (let parent_v of v.parents) {
                yield* v_and_parents(parent_v);
            }
        }
    }

    // There is no harm in calling v2.setDirty redundantly.

    for (let v2 of v_and_parents(v)) {
        if (v2.isAnyAtFileNode()) {
            v2.setDirty();
        }
    }
}

</t>
<t tx="felix.20210116003538.1">/**
 * Does not check for illegal clones!
 */
public cloneAsNthChild(parent_v: VNode, n: number): VNode {
    const v: VNode = this;
    v._linkAsNthChild(parent_v, n);
    return v;
}

public insertAsFirstChild(): VNode {
    const v: VNode = this;
    return v.insertAsNthChild(0);
}

public insertAsLastChild(): VNode {
    const v: VNode = this;
    return v.insertAsNthChild(v.children.length);
}

public insertAsNthChild(n: number): VNode {
    const v: VNode = this;
    console.assert(0 &lt;= n &amp;&amp; n &lt;= v.children.length);
    const v2: VNode = new VNode(v.context);
    v2._linkAsNthChild(v, n);
    console.assert(v.children[n].fileIndex === v2.fileIndex);
    return v2;
}

</t>
<t tx="felix.20210117025748.1"></t>
<t tx="felix.20210117025748.2">/**
 * Adjust links after adding a link to v.
 */
public _addCopiedLink(childIndex: number, parent_v: VNode): void {
    const v: VNode = this;
    v.context.frame.tree.generation += 1;
    // Update parent_v.children &amp; v.parents.
    parent_v.children.splice(childIndex, 0, v);
    v.parents.push(parent_v);
}

</t>
<t tx="felix.20210117025748.3">/**
 * Adjust links after adding a link to v.
 */
public _addLink(childIndex: number, parent_v: VNode): void {
    const v: VNode = this;
    v.context.frame.tree.generation += 1;
    // Update parent_v.children &amp; v.parents.
    parent_v.children.splice(childIndex, 0, v);
    v.parents.push(parent_v);
    if (v.parents.length === 1) {
        // Adjust the parents links in the descendant tree.
        // This handles clones properly when undoing a delete.
        for (let child of v.children) {
            child._addParentLinks(v);
        }
    }
}

</t>
<t tx="felix.20210117025748.4">/**
 * Used by addLink to adjust parent links in the descendant tree
 */
public _addParentLinks(parent: VNode): void {
    const v: VNode = this;
    v.parents.push(parent);
    if (v.parents.length === 1) {
        for (let child of v.children) {
            child._addParentLinks(v);
        }
    }
}

</t>
<t tx="felix.20210117025748.5">/**
 * Adjust links after cutting a link to v.
 */
public _cutLink(childIndex: number, parent_v: VNode): void {
    const v: VNode = this;
    v.context.frame.tree.generation += 1;
    console.assert(parent_v.children[childIndex].fileIndex === v.fileIndex);
    parent_v.children.splice(childIndex, 1);
    if (v.parents.includes(parent_v)) {
        try {
            for (let i = 0; i &lt; v.parents.length; i++) {
                if (v.parents[i].fileIndex === parent_v.fileIndex) {
                    v.parents.splice(i, 1);
                    break;
                }
            }
        }
        catch (ValueError) {
            g.error(parent_v + " not in parents of " + v);
            g.trace('v.parents:');
            g.printObj(v.parents);
        }
    }



    if (!v.parents.length) {
        // Adjust the parents links in the descendant tree.
        // This handles clones properly when deleting a tree.
        for (let child of v.children) {
            child._cutParentLinks(v);
        }
    }
}

</t>
<t tx="felix.20210117025748.6">/**
 * Used by cutLink to adjust parent links in the descendant tree
 */
public _cutParentLinks(parent: VNode) {
    const v: VNode = this;

    for (let i = 0; i &lt; v.parents.length; i++) {
        if (v.parents[i].fileIndex === parent.fileIndex) {
            v.parents.splice(i, 1);
            break;
        }
    }

    if (!v.parents.length) {
        // Adjust the parents links in the descendant tree.
        // This handles clones properly when deleting a tree.
        for (let child of v.children) {
            child._cutParentLinks(v);
        }
    }

}

</t>
<t tx="felix.20210117025748.7">/**
 * Delete all children of self.
 * This is a low-level method, used by the read code.
 * It is not intended as a general replacement for p.doDelete().
 */
public _deleteAllChildren(): void {
    const v: VNode = this;
    for (let v2 of v.children) {
        try {
            for (let i = 0; i &lt; v2.parents.length; i++) {
                if (v2.parents[i].fileIndex === v.fileIndex) {
                    v2.parents.splice(i, 1);
                    break;
                }
            }
        }
        catch (ValueError) {
            g.error(v + " not in parents of " + v2);
            g.trace('v2.parents:');
            g.printObj(v2.parents);
        }
    }
    v.children = [];
}

</t>
<t tx="felix.20210117025748.8">/**
 * Links self as the n'th child of VNode pv
 */
public _linkAsNthChild(parent_v: VNode, n: number): void {
    const v: VNode = this; // The child node.
    v._addLink(n, parent_v);
}

</t>
<t tx="felix.20210117160548.1"></t>
<t tx="felix.20210117160548.2">/**
 * VNode body string property
 */
public get b(): string {
    const v: VNode = this;
    return v.bodyString();
}

public set b(val: string) {
    const v: VNode = this;
    v.setBodyString(val);
}

</t>
<t tx="felix.20210117160548.3">/**
 * VNode headline string property
 */
public get h(): string {
    const v: VNode = this;
    return v.headString();
}

public set h(val: string) {
    const v: VNode = this;
    v.setHeadString(val);
}

</t>
<t tx="felix.20210117160548.4">/**
 * VNode u property
 */
public get u(): any {
    const v: VNode = this;
    if (!v.unknownAttributes) {
        v.unknownAttributes = {};
    }
    return v.unknownAttributes;
}

public set u(val: any) {
    const v: VNode = this;
    if (val === null) {
        v.unknownAttributes = undefined;
    }
    else if ((typeof val) === 'object') {
        v.unknownAttributes = val;
    } else {
        throw new Error("unknownAttributes ValueError");
    }
}

</t>
<t tx="felix.20210117160548.5">/**
 * VNode gnx property
 */
public get gnx() {
    const v: VNode = this;
    return v.fileIndex;
}

</t>
<t tx="felix.20210118015431.1">/**
 * A class to manage loading .leo files, including configuration files.
 */
export class LoadManager {

    // Global settings &amp; shortcuts dicts...
    // The are the defaults for computing settings and shortcuts for all loaded files.

    // A g.TypedDict: the join of settings in leoSettings.leo &amp; myLeoSettings.leo.
    public globalSettingsDict: { [key: string]: any } | undefined;
    // A g.TypedDict: the join of shortcuts in leoSettings.leo &amp; myLeoSettings.leo
    public globalBindingsDict: { [key: string]: any } | undefined;

    public files: string[]; // List of files to be loaded.
    public options: { [key: string]: any }; // Dictionary of user options. Keys are option names.
    public old_argv: string[]; // A copy of sys.argv for debugging.
    public more_cmdline_files: boolean; // True when more files remain on the command line to be loaded.

    @others
}
</t>
<t tx="felix.20210119234943.1">constructor() {
    this.globalSettingsDict = undefined;
    this.globalBindingsDict = undefined;
    this.files = [];
    this.options = {};
    this.old_argv = [];
    this.more_cmdline_files = false;
}

</t>
<t tx="felix.20210120004121.1">/**
 * This is Leo's main startup method.
 */
public load(fileName?: string): void {
    // SIMPLIFIED JS VERSION
    const lm: LoadManager = this;

    const t1 = process.hrtime();

    lm.doPrePluginsInit(fileName); // sets lm.options and lm.files
    const t2 = process.hrtime();

    lm.doPostPluginsInit();
    const t3 = process.hrtime();

    // console.log('Startup PrePluginsInit' );
    // console.log('Startup PostPluginsInit' );

}

</t>
<t tx="felix.20210120004121.16">public initApp(verbose?: boolean): void {


    /*
        self.createAllImporterData()
            # Can be done early. Uses only g.app.loadDir
        assert g.app.loadManager
        from leo.core import leoBackground
        from leo.core import leoConfig
        from leo.core import leoNodes
        from leo.core import leoPlugins
        from leo.core import leoSessions
        # Import leoIPython only if requested.  The import is quite slow.
        self.setStdStreams()
        if g.app.useIpython:
            from leo.core import leoIPython
                # This launches the IPython Qt Console.  It *is* required.
            assert leoIPython  # suppress pyflakes/flake8 warning.
        # Make sure we call the new leoPlugins.init top-level function.
        leoPlugins.init()
        # Force the user to set g.app.leoID.
        g.app.setLeoID(verbose=verbose)
        # Create early classes *after* doing plugins.init()
        g.app.idleTimeManager = IdleTimeManager()
        g.app.backgroundProcessManager = leoBackground.BackgroundProcessManager()
        g.app.externalFilesController = leoExternalFiles.ExternalFilesController()
        g.app.recentFilesManager = RecentFilesManager()
        g.app.config = leoConfig.GlobalConfigManager()
        g.app.nodeIndices = leoNodes.NodeIndices(g.app.leoID)
        g.app.sessionManager = leoSessions.SessionManager()
        # Complete the plugins class last.
        g.app.pluginsController.finishCreate()
    */

}

</t>
<t tx="felix.20210120004121.3">/**
 * Create a Leo window for each file in the lm.files list.
 */
public doPostPluginsInit(): boolean {
    // Clear g.app.initing _before_ creating commanders.
    const lm: LoadManager = this;
    g.app.initing = false;  // "idle" hooks may now call g.app.forceShutdown.
    // Create the main frame.Show it and all queued messages.
    let c: Commands | undefined;
    let c1: Commands | undefined;
    let fn: string = "";
    if (lm.files.length) {
        try {  // #1403.
            for (let n = 0; n &lt; lm.files.length; n++) {
                const fn = lm.files[n];
                lm.more_cmdline_files = n &lt; (lm.files.length - 1);
                c = lm.loadLocalFile(fn, g.app.gui!);
                // Returns None if the file is open in another instance of Leo.
                if (c &amp;&amp; !c1) {  // #1416:
                    c1 = c;
                }
            }
        }
        catch (exception) {
            g.es_print(`Unexpected exception reading ${fn}`);
            g.es_exception();
            c = undefined;
        }
    }

    // Load (and save later) a session *only* if the command line contains no files.
    /*
    g.app.loaded_session = !lm.files.length;
    if (g.app.sessionManager &amp;&amp; g.app.loaded_session){
        try{  // #1403.
            aList = g.app.sessionManager.load_snapshot();
            if aList:
                g.app.sessionManager.load_session(c1, aList);
                // #659.
                if g.app.windowList:
                    c = c1 = g.app.windowList[0].c;
                else:
                    c = c1 = None;
        }

        catch( Exception){
            g.es_print('Can not load session');
            g.es_exception();
        }
    }
    */
    // Enable redraws.
    g.app.disable_redraw = false;

    if (!c1) {
        try { // #1403.
            c1 = lm.openEmptyWorkBook();
            // Calls LM.loadLocalFile.
        }
        catch (exception) {
            g.es_print('Can not create empty workbook');
            g.es_exception();
        }
    }
    c = c1;
    if (!c) {
        // Leo is out of options: Force an immediate exit.
        return false;
    }
    // #199.
    // TODO
    // g.app.runAlreadyOpenDialog(c1);

    // Final inits...
    g.app.logInited = true;
    g.app.initComplete = true;
    // c.setLog();
    // c.redraw();
    // g.doHook("start2", c=c, p=c.p, fileName=c.fileName());
    // c.initialFocusHelper();
    const screenshot_fn: string = lm.options['screenshot_fn'];
    if (screenshot_fn) {
        lm.make_screen_shot(screenshot_fn);
        return false;  // Force an immediate exit.
    }
    return true;
}

</t>
<t tx="felix.20210120004121.31">public loadLocalFile(fn: string, gui: LeoUI, old_c?: Commands): Commands {
    /*Completely read a file, creating the corresonding outline.

    1. If fn is an existing .leo file (possibly zipped), read it twice:
    the first time with a NullGui to discover settings,
    the second time with the requested gui to create the outline.

    2. If fn is an external file:
    get settings from the leoSettings.leo and myLeoSetting.leo, then
    create a "wrapper" outline continain an @file node for the external file.

    3. If fn is empty:
    get settings from the leoSettings.leo and myLeoSetting.leo or default settings,
    or open an empty outline.
    */
    const lm: LoadManager = this;
    let c: Commands | undefined;

    // Step 0: Return if the file is already open.
    // fn = g.os_path_finalize(fn);

    if (fn) {
        c = lm.findOpenFile(fn);
        if (c) {
            return c;
        }
    }
    // Step 1: get the previous settings.
    // For .leo files (and zipped .leo files) this pre-reads the file in a null gui.
    // Otherwise, get settings from leoSettings.leo, myLeoSettings.leo, or default settings.
    const previousSettings: any = undefined; // lm.getPreviousSettings(fn);

    // Step 2: open the outline in the requested gui.
    // For .leo files (and zipped .leo file) this opens the file a second time.
    c = lm.openFileByName(fn, gui, old_c, previousSettings)!;
    return c;
}
</t>
<t tx="felix.20210120004121.32">/**
 * Read the local file whose full path is fn using the given gui.
 * fn may be a Leo file (including .leo or zipped file) or an external file.
 *
 * This is not a pre-read: the previousSettings always exist and
 * the commander created here persists until the user closes the outline.
 *
 * Reads the entire outline if fn exists and is a .leo file or zipped file.
 * Creates an empty outline if fn is a non-existent Leo file.
 * Creates an wrapper outline if fn is an external file, existing or not.
 */
public openFileByName(fn: string, gui: LeoUI, old_c?: Commands, previousSettings?: any): Commands | undefined {
    const lm: LoadManager = this;
    // Disable the log.
    // g.app.setLog(None);
    // g.app.lockLog();

    // Create the a commander for the .leo file.
    // Important.  The settings don't matter for pre-reads!
    // For second read, the settings for the file are *exactly* previousSettings.
    const c: Commands = g.app.newCommander(fn, gui, previousSettings);
    // Open the file, if possible.
    // g.doHook('open0');

    /*
    theFile = lm.openLeoOrZipFile(fn);
    if isinstance(theFile, sqlite3.Connection):
        // this commander is associated with sqlite db
        c.sqlite_connection = theFile
    */

    // Enable the log.
    // g.app.unlockLog();
    // c.frame.log.enable(true);

    // Phase 2: Create the outline.
    // g.doHook("open1", old_c=None, c=c, new_c=c, fileName=fn)
    /*
    if theFile:
        readAtFileNodesFlag = bool(previousSettings)
        // The log is not set properly here.
        ok = lm.readOpenedLeoFile(c, fn, readAtFileNodesFlag, theFile) // c.fileCommands.openLeoFile(theFile)
            // Call c.fileCommands.openLeoFile to read the .leo file.
        if not ok: return None
    else:
        // Create a wrapper .leo file if:
        // a) fn is a .leo file that does not exist or
        // b) fn is an external file, existing or not.
        lm.initWrapperLeoFile(c, fn)

    */
    // g.doHook("open2", old_c=None, c=c, new_c=c, fileName=fn)

    // Phase 3: Complete the initialization.
    // g.app.writeWaitingLog(c)
    // c.setLog()
    // lm.createMenu(c, fn)
    // lm.finishOpen(c); // c.initAfterLoad()

    // TODO : OPEN LEO FILE
    const ok: boolean = true; // c.fileCommands.openLeoFile(fn);
    return c;
}

</t>
<t tx="felix.20210120004121.4">public make_screen_shot(fn: string): void {
    // TODO
    console.log('TODO: make_screen_shot');
    /*
    """Create a screenshot of the present Leo outline and save it to path."""
    if g.app.gui.guiName() == 'qt':
        m = g.loadOnePlugin('screenshots')
        m.make_screen_shot(fn)
    */
}

</t>
<t tx="felix.20210120004121.5">/**
 * Open an empty frame and paste the contents of CheatSheet.leo into it.
 */
public openEmptyWorkBook(): Commands | undefined {
    // TODO
    const lm: LoadManager = this;

    /*
    // Create an empty frame.
    const fn:string = lm.computeWorkbookFileName();
    if not fn:
        return None  # #1415
    c = lm.loadLocalFile(fn, gui=g.app.gui, old_c=None)
    if not c:
        return None  # #1201: AttributeError below.
    # Open the cheatsheet, but not in batch mode.
    if not g.app.batchMode and not g.os_path_exists(fn):
        # #933: Save clipboard.
        old_clipboard = g.app.gui.getTextFromClipboard()
        # Paste the contents of CheetSheet.leo into c.
        c2 = c.openCheatSheet(redraw=False)
        if c2:
            for p2 in c2.rootPosition().self_and_siblings():
                c2.setCurrentPosition(p2)  # 1380
                c2.copyOutline()
                p = c.pasteOutline()
                # #1380 &amp; #1381: Add guard &amp; use vnode methods to prevent redraw.
                if p:
                    c.setCurrentPosition(p)  # 1380
                    p.v.contract()
                    p.v.clearDirty()
            c2.close(new_c=c)
            # Delete the dummy first node.
            root = c.rootPosition()
            root.doDelete(newNode=root.next())
            c.target_language = 'rest'
                # Settings not parsed the first time.
            c.clearChanged()
            c.redraw(c.rootPosition())  # # 1380: Select the root.
        # #933: Restore clipboard
        g.app.gui.replaceClipboardWith(old_clipboard)
    return c
    */
    const fn: string = "";
    const c = lm.loadLocalFile(fn, g.app.gui!);
    if (!c) {
        return undefined;
    }
    return c;
}

</t>
<t tx="felix.20210120004121.6">/**
 * Scan options, set directories and read settings.
 */
public doPrePluginsInit(fileName?: string): void {
    const lm: LoadManager = this;
    // lm.computeStandardDirectories();
    // lm.adjustSysPath();
    // A do-nothing.
    // Scan the options as early as possible.
    const options = {}; // lm.scanOptions(fileName);
    lm.options = options;

    // const script:string = options['script'];
    // const verbose:boolean = !script;
    // Init the app.
    lm.initApp(); // lm.initApp(verbose);
    // g.app.setGlobalDb()
    // lm.reportDirectories(verbose)
    // Read settings *after* setting g.app.config and *before* opening plugins.
    // This means if-gui has effect only in per-file settings.
    // lm.readGlobalSettingsFiles()
    // reads only standard settings files, using a null gui.
    // uses lm.files[0] to compute the local directory
    // that might contain myLeoSettings.leo.
    // Read the recent files file.
    // localConfigFile = lm.files[0] if lm.files else None
    // g.app.recentFilesManager.readRecentFiles(localConfigFile)
    // Create the gui after reading options and settings.
    // lm.createGui(pymacs)
    // We can't print the signon until we know the gui.
    // g.app.computeSignon()  // Set app.signon/signon1 for commanders.
}

</t>
<t tx="felix.20210123212411.1">/**
 * Create a commander and its view frame for the Leo main window.
 */
public newCommander(
    fileName: string,
    gui: LeoUI,
    previousSettings?: any,
    relativeFileName?: any,
): Commands {
    // Create the commander and its subcommanders.
    // This takes about 3/4 sec when called by the leoBridge module.
    // Timeit reports 0.0175 sec when using a nullGui.
    const c = new Commands(
        fileName,
        gui,
        previousSettings,
        relativeFileName
    );
    return c;
}
</t>
<t tx="felix.20210124192005.1">/**
 * Returns the commander of already opened Leo file
 * returns undefined otherwise
 */
public findOpenFile(fn: string): Commands | undefined {
    // TODO: check in opened commanders array (g.app.windowList or other as needed)
    /*
    def munge(name):
        return g.os_path_normpath(name or '').lower()

    for frame in g.app.windowList:
        c = frame.c
        if g.os_path_realpath(munge(fn)) == g.os_path_realpath(munge(c.mFileName)):
            # Don't call frame.bringToFront(), it breaks --minimize
            c.setLog()
            # Selecting the new tab ensures focus is set.
            master = getattr(frame.top, 'leo_master', None)
            if master:  # master is a TabbedTopLevel.
                master.select(frame.c)
            c.outerUpdate()
            return c
    return None
    */
    return undefined;
}

</t>
<t tx="felix.20210124222835.1">function test(p_message) {
    console.log('Output message : ' + p_message);
}

var testVar = "some String";

</t>
<t tx="felix.20210124225736.1">// import escape from 'escape-html'
import axios from 'axios';

</t>
<t tx="felix.20210125233441.1">/* These routines change self to a new position "in place".
That is, these methods must _never_ call p.copy().

When moving to a nonexistent position, these routines simply set p.v = None,
leaving the p.stack unchanged. This allows the caller to "undo" the effect of
the invalid move by simply restoring the previous value of p.v.

These routines all return self on exit so the following kind of code will work:
    after = p.copy().moveToNodeAfterTree()
*/

</t>
<t tx="felix.20210125233441.10">/**
 * Move a position to it's threadBack position.
 */
public moveToThreadBack(): Position {
    const p: Position = this;
    if (p.hasBack()) {
        p.moveToBack();
        p.moveToLastNode();
    } else {
        p.moveToParent();
    }
    return p;
}

</t>
<t tx="felix.20210125233441.11">/**
 * Move a position to threadNext position.
 */
public moveToThreadNext(): Position {
    const p: Position = this;
    if (p.v) {
        if (p.v.children.length) {
            p.moveToFirstChild();
        } else if (p.hasNext()) {
            p.moveToNext();
        } else {
            p.moveToParent();
            while (p.__bool__()) {
                if (p.hasNext()) {
                    p.moveToNext();
                    break;  //found
                }
                p.moveToParent();
                // not found.
            }
        }
    }
    return p;
}

</t>
<t tx="felix.20210125233441.12">/**
 * Move a position to the position of the previous visible node.
 */
public moveToVisBack(c: Commands): Position | undefined {
    const p: Position = this;
    const visLimit: [Position, boolean] | undefined = c.visLimit();
    if (visLimit) {
        const limit: Position = visLimit[0];
        const limitIsVisible: boolean = visLimit[1];
        while (visLimit &amp;&amp; p.__bool__()) {
            // Short-circuit if possible.
            const back: Position = p.back();
            if (back.__bool__() &amp;&amp; back.hasChildren() &amp;&amp; back.isExpanded()) {
                p.moveToThreadBack();
            }
            else if (back.__bool__()) {
                p.moveToBack();
            } else {
                p.moveToParent();  // Same as p.moveToThreadBack()
            }
            if (p.__bool__()) {
                if (limit) {
                    let done: boolean;
                    let val: Position | undefined;
                    [done, val] = this.checkVisBackLimit(limit, limitIsVisible, p);
                    if (done) {
                        return val;  // A position or None
                    }
                }
                if (p.isVisible(c)) {
                    return p;
                }
            }
        }
    }
    return p;
}

</t>
<t tx="felix.20210125233441.13">/**
 * Return done, p or None
 */
public checkVisBackLimit(limit: Position, limitIsVisible: boolean, p: Position): [boolean, Position | undefined] {
    const c: Commands = p.v.context;
    if (limit.__eq__(p)) {
        if (limitIsVisible &amp;&amp; p.isVisible(c)) {
            return [true, p];
        }
        return [true, undefined];
    }
    if (limit.isAncestorOf(p)) {
        return [false, undefined];
    }
    return [true, undefined];
}

</t>
<t tx="felix.20210125233441.14">/**
 * Move a position to the position of the next visible node.
 */
public moveToVisNext(c: Commands): Position | undefined {
    const p: Position = this;
    const visLimit: [Position, boolean] | undefined = c.visLimit();
    if (visLimit) {
        const limit: Position = visLimit[0];
        while (p.__bool__()) {
            if (p.hasChildren()) {
                if (p.isExpanded()) {
                    p.moveToFirstChild();
                } else {
                    p.moveToNodeAfterTree();
                }
            } else if (p.hasNext()) {
                p.moveToNext();
            } else {
                p.moveToThreadNext();
            }
            if (p.__bool__()) {
                if (limit &amp;&amp; this.checkVisNextLimit(limit, p)) {
                    return undefined;
                }
                if (p.isVisible(c)) {
                    return p;
                }
            }
        }
    }
    return p;
}

</t>
<t tx="felix.20210125233441.15">/**
 * Return True is p is outside limit of visible nodes.
 */
public checkVisNextLimit(limit: Position, p: Position): boolean {
    return !limit.__eq__(p) &amp;&amp; !limit.isAncestorOf(p);
}

</t>
<t tx="felix.20210125233441.16">/**
 * Move a position to threadNext position.
 * Issue an error if any vnode is an ancestor of itself.
 */
public safeMoveToThreadNext(): Position {
    const p: Position = this;
    if (p.v) {
        const child_v: VNode | false = !!p.v.children.length &amp;&amp; p.v.children[0];
        if (child_v) {
            let brokeFor: boolean = false;
            for (let parent of p.self_and_parents(false)) {
                if (child_v.fileIndex === parent.v.fileIndex) {
                    g.error(`vnode: ${child_v} is its own parent`);
                    // Allocating a new vnode would be difficult.
                    // Just remove child_v from parent.v.children.
                    parent.v.children = [];
                    for (let v2 of parent.v.children) {
                        if (v2.fileIndex !== child_v.fileIndex) {
                            parent.v.children.push(v2);
                        }
                    }
                    if (child_v.parents.includes(parent.v)) {
                        // child_v.parents.remove(parent.v);
                        const index = child_v.parents.indexOf(parent.v);
                        if (index &gt; -1) {
                            child_v.parents.splice(index, 1);
                        }
                    }
                    // Try not to hang.
                    p.moveToParent();
                    brokeFor = true;
                    break;
                } else if (child_v.fileIndex === parent.v.fileIndex) {
                    g.error(
                        `duplicate gnx: ${child_v.fileIndex} ` +
                        `v: ${child_v} parent: ${parent.v}`);
                    child_v.fileIndex = g.app.nodeIndices!.getNewIndex(child_v);
                    console.assert(child_v.gnx !== parent.v.gnx);
                    // Should be ok to continue.
                    p.moveToFirstChild();
                    brokeFor = true;
                    break;
                }
            }
            if (!brokeFor) {
                //  for else
                p.moveToFirstChild();
            }
        } else if (p.hasNext()) {
            p.moveToNext();
        } else {
            p.moveToParent();
            while (p.__bool__()) {
                if (p.hasNext()) {
                    p.moveToNext();
                    break;  // found
                }
                p.moveToParent();
                // not found.
            }
        }
    }
    return p;
}

</t>
<t tx="felix.20210125233441.2">/**
 * Move self to its previous sibling.
 */
public moveToBack(): Position {
    const p: Position = this;
    const n: number = p._childIndex;
    const parent_v: VNode = p._parentVnode()!; // Returns None if p.v is None.

    // Do not assume n is in range: this is used by positionExists.
    if (
        parent_v &amp;&amp;
        p.v &amp;&amp;
        0 &lt; n &amp;&amp;
        n &lt;= parent_v.children.length
    ) {
        p._childIndex -= 1;
        p.v = parent_v.children[n - 1];
    } else {
        // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
        p.v = undefined;
    }
    return p;
}

</t>
<t tx="felix.20210125233441.3">/**
 * Move a position to it's first child's position.
 */
public moveToFirstChild(): Position {
    const p: Position = this;
    if (p.v &amp;&amp; p.v.children) {
        p.stack.push([p.v, p._childIndex]);
        p.v = p.v.children[0];
        p._childIndex = 0;
    } else {
        // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
        p.v = undefined;
    }
    return p;
}

</t>
<t tx="felix.20210125233441.4">/**
 * Move a position to it's last child's position.
 */
public moveToLastChild(): Position {
    const p: Position = this;
    let n: number;
    if (p.v &amp;&amp; p.v.children.length) {
        p.stack.push([p.v, p._childIndex]);
        n = p.v.children.length;
        p.v = p.v.children[n - 1];
        p._childIndex = n - 1;
    } else {
        // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
        p.v = undefined;
    }
    return p;
}

</t>
<t tx="felix.20210125233441.5">/**
 * Move a position to last node of its tree.
 *  N.B. Returns p if p has no children.
 */
public moveToLastNode(): Position {
    const p: Position = this;
    // Huge improvement for 4.2.
    while (p.hasChildren()) {
        p.moveToLastChild();
    }
    return p;
}

</t>
<t tx="felix.20210125233441.6">/**
 * Move a position to its next sibling.
 */
public moveToNext(): Position {
    const p: Position = this;
    const n: number = p._childIndex;
    const parent_v: VNode = p._parentVnode()!;
    // Returns None if p.v is None.
    if (!p.v) {
        g.trace('no p.v:', p, g.callers());
    }
    if (p.v &amp;&amp; parent_v &amp;&amp; parent_v.children.length &gt; (n + 1)) {
        p._childIndex = n + 1;
        p.v = parent_v.children[n + 1];
    } else {
        // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
        p.v = undefined;
    }
    return p;
}

</t>
<t tx="felix.20210125233441.7">/**
 * Move a position to the node after the position's tree.
 */
public moveToNodeAfterTree(): Position {
    const p: Position = this;
    while (p.__bool__()) {
        if (p.hasNext()) {
            p.moveToNext();
            break;
        }
        p.moveToParent();
    }
    return p;
}

</t>
<t tx="felix.20210125233441.8">/**
 * Move to Nth child
 */
public moveToNthChild(n: number): Position {
    const p: Position = this;
    if (p.v &amp;&amp; p.v.children.length &gt; n) {
        p.stack.push([p.v, p._childIndex]);
        p.v = p.v.children[n];
        p._childIndex = n;
    } else {
        // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
        p.v = undefined;
    }
    return p;
}

</t>
<t tx="felix.20210125233441.9">/**
 * Move a position to its parent position.
 */
public moveToParent(): Position {
    const p: Position = this;
    if (p.v &amp;&amp; p.stack.length) {
        const item: StackEntry = p.stack.pop()!;
        p.v = item[0];
        p._childIndex = item[1];
    } else {
        // * For now, use undefined p.v to signal null/invalid positions
            //@ts-ignore
        p.v = undefined;
    }
    return p;
}

</t>
<t tx="felix.20210126001920.1"></t>
<t tx="felix.20210126001920.10">/**
 * Prints out error message about invalid outline
 */
public invalidOutline(message: string): void {
    const p: Position = this;
    let node: Position;
    if (p.hasParent()) {
        node = p.parent();
    } else {
        node = p;
    }
    p.v.context.alert(`invalid outline: ${message}\n${node}`);
}

</t>
<t tx="felix.20210126001920.11">/**
 * Move a position after position a.
 */
public moveAfter(a: Position): Position {
    const p: Position = this;  // Do NOT copy the position!
    a._adjustPositionBeforeUnlink(p);
    p._unlink();
    p._linkAfter(a);
    return p;
}

</t>
<t tx="felix.20210126001920.12">/**
 * Move a position to the first child of parent.
 */
public moveToFirstChildOf(parent: Position): Position {
    const p: Position = this; // Do NOT copy the position!
    return p.moveToNthChildOf(parent, 0);  // Major bug fix: 2011/12/04
}

/**
 * Move a position to the last child of parent.
 */
public moveToLastChildOf(parent: Position): Position {
    const p: Position = this;  // Do NOT copy the position!
    let n: number = parent.numberOfChildren();
    if (p.parent().__eq__(parent)) {
        n -= 1;  // 2011/12/10: Another bug fix.
    }
    return p.moveToNthChildOf(parent, n);  // Major bug fix: 2011/12/04
}

</t>
<t tx="felix.20210126001920.13">/**
 * Move a position to the nth child of parent.
 */
public moveToNthChildOf(parent: Position, n: number): Position {
    const p: Position = this;  // Do NOT copy the position!
    parent._adjustPositionBeforeUnlink(p);
    p._unlink();
    p._linkAsNthChild(parent, n);
    return p;
}

</t>
<t tx="felix.20210126001920.14">/**
 * Move self to the root position.
 */
public moveToRoot(): Position {
    const p: Position = this;  //  Do NOT copy the position!
    // #1631. The old root can not possibly be affected by unlinking p.
    p._unlink();
    p._linkAsRoot();
    return p;
}

</t>
<t tx="felix.20210126001920.15">/**
 * A low-level promote helper.
 */
public promote(): void {
    const p: Position = this; //  Do NOT copy the position.
    const parent_v: VNode = p._parentVnode()!;
    const children: VNode[] = p.v.children;
    // Add the children to parent_v's children.
    const n: number = p.childIndex() + 1;
    const z: VNode[] = [...parent_v.children];
    parent_v.children = z.slice(0, n);
    parent_v.children.push(...children);
    parent_v.children.push(...z.slice(n));
    // Remove v's children.
    p.v.children = [];
    // Adjust the parent links in the moved children.
    // There is no need to adjust descendant links.
    for (let child of children) {
        // child.parents.remove(p.v);
        const index = child.parents.indexOf(p.v);
        if (index &gt; -1) {
            child.parents.splice(index, 1);
        }
        child.parents.push(parent_v);
    }
}

</t>
<t tx="felix.20210126001920.16">/**
 * This routine checks the structure of the receiver's tree.
 */
public validateOutlineWithParent(pv: Position): boolean {
    const p: Position = this;
    let result: boolean = true;  // optimists get only unpleasant surprises.
    const parent: Position = p.getParent();
    const childIndex: number = p._childIndex;
    &lt;&lt; validate parent ivar &gt;&gt;
    &lt;&lt; validate childIndex ivar &gt;&gt;
    &lt;&lt; validate x ivar &gt;&gt;
    // Recursively validate all the children.
    for (let child of p.children()) {
        const r: boolean = child.validateOutlineWithParent(p);
        if (!r) {
            result = false;
        }
    }
    return result;
}

</t>
<t tx="felix.20210126001920.17">if (!parent.__eq__(pv)) {
    p.invalidOutline("Invalid parent link: " + JSON.stringify(parent));
}
</t>
<t tx="felix.20210126001920.18">if (pv.__bool__()) {
    if (childIndex &lt; 0) {
        p.invalidOutline("missing childIndex" + childIndex);
    } else if (childIndex &gt;= pv.numberOfChildren()) {
        p.invalidOutline("missing children entry for index: " + childIndex);
    }
} else if (childIndex &lt; 0) {
    p.invalidOutline("negative childIndex" + childIndex);
}
</t>
<t tx="felix.20210126001920.19">if (!p.v &amp;&amp; pv.__bool__()) {
    this.invalidOutline("Empty t");
}
</t>
<t tx="felix.20210126001920.2">/**
 * Create a clone of back.
 * Returns the newly created position.
 */
public clone(): Position {
    const p: Position = this;
    const p2: Position = p.copy();  // Do *not* copy the VNode!
    p2._linkAfter(p); // This should "just work"
    return p2;
}

</t>
<t tx="felix.20210126001920.4">/**
 * Delete all children of the receiver and set p.dirty().
 */
public deleteAllChildren(): void {
    const p: Position = this;
    p.setDirty();  // Mark @file nodes dirty!
    while (p.hasChildren()) {
        p.firstChild().doDelete();
    }
}

</t>
<t tx="felix.20210126001920.5">/**
 * Deletes position p from the outline.
 *
 * This is the main delete routine.
 * It deletes the receiver's entire tree from the screen.
 * Because of the undo command we never actually delete vnodes.
 */
public doDelete(newNode?: Position): void {
    const p: Position = this;
    p.setDirty(); // Mark @file nodes dirty!
    const sib = p.copy();
    while (sib.hasNext()) {
        sib.moveToNext();
        if (!!newNode &amp;&amp; sib.__eq__(newNode)) {
            // Adjust newNode._childIndex if newNode is a following sibling of p.
            newNode._childIndex -= 1;
            break;
        }
    }
    p._unlink();
}

</t>
<t tx="felix.20210126001920.6">/**
 * Inserts a new position after self.
 * Returns the newly created position.
 */
public insertAfter(): Position {
    const p: Position = this;
    const context: Commands = p.v.context;
    const p2: Position = this.copy();
    p2.v = new VNode(context);
    p2.v.iconVal = 0;
    p2._linkAfter(p);
    return p2;
}

</t>
<t tx="felix.20210126001920.7">/**
 * Inserts a new VNode as the last child of self.
 * Returns the newly created position.
 */
public insertAsLastChild(): Position {
    const p: Position = this;
    const n: number = p.numberOfChildren();
    return p.insertAsNthChild(n);
}

</t>
<t tx="felix.20210126001920.8">/**
 * Inserts a new node as the the nth child of self.
 * self must have at least n-1 children.
 * Returns the newly created position.
 */
public insertAsNthChild(n: number): Position {
    const p: Position = this;
    const context: Commands = p.v.context;
    const p2: Position = this.copy();
    p2.v = new VNode(context);
    p2.v.iconVal = 0;
    p2._linkAsNthChild(p, n);
    return p2;
}

</t>
<t tx="felix.20210126001920.9">/**
 * Inserts a new position before self.
 * Returns the newly created position.
 */
public insertBefore(): Position {
    let p: Position = this;
    const parent: Position = p.parent();
    let back: Position;
    if (p.hasBack()) {
        back = p.getBack();
        p = back.insertAfter();
    } else if (parent.__bool__()) {
        p = parent.insertAsNthChild(0);
    } else {
        p = p.insertAfter();
        p.moveToRoot();
    }
    return p;
}

</t>
<t tx="felix.20210126210412.1"></t>
<t tx="felix.20210126210412.10">public key(): string {
    const p: Position = this;
    // For unified nodes we must include a complete key,
    // so we can distinguish between clones.
    const result: string[] = [];
    for (let z of p.stack) {
        const v: VNode = z[0];
        const childIndex: number = z[1];
        result.push(`${v.fileIndex}:${childIndex}`);
    }
    result.push(`${p.v.fileIndex}:${p._childIndex}`);
    return result.join('.');
}

public sort_key(p: Position): number[] {
    const result: number[] = [];
    for (let s of p.key().split('.')) {
        result.push(Number(s.split(':')[1]));
    }
    return result;
}

/*
 Positions should *not* be hashable.

 From https://docs.python.org/3/reference/datamodel.html#object.__hash__

 If a class defines mutable objects and implements an __eq__() method, it
 should not implement __hash__(), since the implementation of hashable
 collections requires that a key’s hash value is immutable (if the object’s
 hash value changes, it will be in the wrong hash bucket).
*/

// __hash__ = None

</t>
<t tx="felix.20210126210412.3">/**
 * Return True if two positions are equivalent.
 */
public __eq__(p2: Position): boolean {
    const p1: Position = this;
    // Don't use g.trace: it might call p.__eq__ or p.__ne__.
    if (!(p2 instanceof Position)) {
        return false;
    }
    if (!p2.__bool__() || !p2.v) {
        return !p1.v;
    }
    // Modified by Félix to prevent object direct comparison (p1.v === p2.v)
    return !!(p1.v &amp;&amp; p2.v &amp;&amp;
        p1.v.fileIndex === p2.v.fileIndex &amp;&amp;
        p1._childIndex === p2._childIndex &amp;&amp;
        p1.stack.length === p2.stack.length &amp;&amp;
        p1.stack.every(
            (p_value, p_index) =&gt; {
                return p_value[1] === p2.stack[p_index][1] &amp;&amp;
                    p_value[0].fileIndex === p2.stack[p_index][0].fileIndex;
            }
        )
    );
}

/**
 * Return True if two positions are not equivalent.
 */
public __ne__(p2: Position): boolean {
    return !this.__eq__(p2);
}

</t>
<t tx="felix.20210126210412.4">public __ge__(other: Position): boolean {
    return this.__eq__(other) || this.__gt__(other);
}


public __le__(other: Position): boolean {
    return this.__eq__(other) || this.__lt__(other);
}


public __lt__(other: Position): boolean {
    return !this.__eq__(other) &amp;&amp; !this.__gt__(other);
}

</t>
<t tx="felix.20210126210412.5">/**
 * Return True if self appears after other in outline order.
 */
public __gt__(other: Position): boolean {
    const stack1: StackEntry[] = this.stack;
    const stack2: StackEntry[] = other.stack;
    const n1: number = stack1.length;
    const n2: number = stack2.length;
    const n: number = n1 &lt; n2 ? n1 : n2;
    // Compare the common part of the stacks.
    for (let nx = 0; nx &lt; n; nx++) {
        if (stack1[nx][1] &gt; stack2[nx][1]) {
            return true;
        }
        if (stack1[nx][1] &lt; stack2[nx][1]) {
            return false;
        }
    }
    // Finish the comparison.
    let x1: number;
    let x2: number;
    if (n1 === n2) {
        x1 = this._childIndex;
        x2 = other._childIndex;
        return x1 &gt; x2;
    }
    if (n1 &lt; n2) {
        x1 = this._childIndex;
        x2 = other.stack[n][1];
        return x1 &gt; x2;
    }
    // n1 &gt; n2
    // 2011/07/28: Bug fix suggested by SegundoBob.
    x1 = other._childIndex;
    x2 = this.stack[n][1];
    return x2 &gt;= x1;
}

</t>
<t tx="felix.20210126210412.6">/**
 * Return True if a position is valid.
 *
 * The tests 'if p' or 'if not p' are the _only_ correct ways to test
 * whether a position p is valid.
 *
 * Tests like 'if p is None' or 'if p is not None' will not work properly.
 */
public __bool__(): boolean {
    return !!this.v;
}

</t>
<t tx="felix.20210126210412.7">public __str__(): string {
    const p: Position = this;
    if (p.v) {
        return (
            "&lt;pos " +
            `childIndex: ${p._childIndex} ` +
            `lvl: ${p.level()} ` +
            `key: ${p.key()} ` +
            `${p.h}` +
            "&gt;"
        );
    }
    return `&lt;pos [${p.stack.length}] None&gt;`;
}

</t>
<t tx="felix.20210126210412.8">/**
 * Return a representation of a position suitable for use in .leo files.
 */
public archivedPosition(root_p?: Position): number[] {
    const p: Position = this;
    const aList: number[] = [];
    if (!root_p) {
        for (let z of p.self_and_parents()) {
            aList.push(z._childIndex);
        }
    } else {
        for (let z of p.self_and_parents(false)) {
            aList.push(z._childIndex);
            if (z.__eq__(root_p)) {
                aList.push(0);
                break;
            } else {
                aList.push(z._childIndex);
            }
        }
    }
    aList.reverse();
    return aList;
}

</t>
<t tx="felix.20210126210412.9">public dumpLink(link: string): string {
    return link ? link : "&lt;none&gt;";
}

public dump(label?: string): void {
    const p: Position = this;
    if (p.v) {
        p.v.dump();  // Don't print a label
    }
}

</t>
<t tx="felix.20210126210419.1">/**
 * Create a new position with the given childIndex and parent stack.
 */
constructor(v: VNode, childIndex: number = 0, stack?: StackEntry[]) {
    this._childIndex = childIndex;
    this.v = v;
    if (stack) {
        this.stack = [...stack]; // Creating a copy here is safest and best.
    } else {
        this.stack = [];
    }
}

</t>
<t tx="felix.20210127001502.1">import "date-format-lite";
import * as g from './leoGlobals';
import { Commands } from './leoCommands';

</t>
<t tx="felix.20210127234205.1">/*
   These methods are only for the use of low-level code
   in leoNodes.py, leoFileCommands.py and leoUndo.py.
*/

</t>
<t tx="felix.20210127234205.10">/**
 * Unlink the receiver p from the tree.
 */
public _unlink(): void {
    const p: Position = this;
    const n: number = p._childIndex;
    const parent_v: VNode = p._parentVnode()!;
    // returns None if p.v is None
    const child: VNode = p.v;
    console.assert(p.v);
    console.assert(parent_v);
    // Delete the child.
    if ((0 &lt;= n &amp;&amp;
        n &lt; parent_v.children.length &amp;&amp;
        parent_v.children[n].fileIndex === child.fileIndex
    )) {
        // This is the only call to v._cutlink.
        child._cutLink(n, parent_v);
    } else {
        this.badUnlink(parent_v, n, child);
    }
}

</t>
<t tx="felix.20210127234205.11">/**
 * badUnlink error trace output
 */
public badUnlink(parent_v: VNode, n: number, child: VNode): void {

    if (0 &lt;= n &amp;&amp; n &lt; parent_v.children.length) {
        g.trace(`**can not happen: children[{n}] != p.v`);
        g.trace('parent_v.children...\n',
            g.listToString(parent_v.children));
        g.trace('parent_v', parent_v);
        g.trace('parent_v.children[n]', parent_v.children[n]);
        g.trace('child', child);
        g.trace('** callers:', g.callers());
    } else {
        g.trace(
            `**can not happen: bad child index: ${n}, `,
            `children.length: ${parent_v.children.length}`);
        g.trace('parent_v.children...\n',
            g.listToString(parent_v.children));
        g.trace('parent_v', parent_v, 'child', child);
        g.trace('** callers:', g.callers());
    }
}

</t>
<t tx="felix.20210127234205.2">/**
 * Adjust position p before unlinking p2.
 */
public _adjustPositionBeforeUnlink(p2: Position): void {
    // p will change if p2 is a previous sibling of p or
    // p2 is a previous sibling of any ancestor of p.
    const p: Position = this;
    const sib: Position = p.copy();
    // A special case for previous siblings.
    // Adjust p._childIndex, not the stack's childIndex.
    while (sib.hasBack()) {
        sib.moveToBack();
        if (sib.__eq__(p2)) {
            p._childIndex -= 1;
            return;
        }
    }

    // Adjust p's stack.
    const stack: StackEntry[] = [];
    let changed: boolean = false;
    let i: number = 0;
    while (i &lt; p.stack.length) {
        const v: VNode = p.stack[i][0];
        const childIndex: number = p.stack[i][1];
        const p3 = new Position(v, childIndex, stack.slice(0, i)); // stack[:i]
        while (p3.__bool__()) {
            if (p2.__eq__(p3)) {
                // 2011/02/25: compare full positions, not just vnodes.
                // A match with the to-be-moved node.
                stack.push([v, childIndex - 1]);
                changed = true;
                break;  // terminate only the inner loop.
            }
            p3.moveToBack();
            if (!p3.__bool__()) {
                stack.push([v, childIndex]);
            }
        }
        i += 1;
    }
    if (changed) {
        p.stack = stack;
    }
}

</t>
<t tx="felix.20210127234205.3">/**
 * Link self after p_after.
 */
public _linkAfter(p_after: Position): void {
    const p: Position = this;
    const parent_v = p_after._parentVnode()!;
    p.stack = [...p_after.stack];
    p._childIndex = p_after._childIndex + 1;
    const child: VNode = p.v;
    const n: number = p_after._childIndex + 1;
    child._addLink(n, parent_v);
}

</t>
<t tx="felix.20210127234205.4">/**
 * Link self, a newly copied tree, after p_after.
 */
public _linkCopiedAfter(p_after: Position): void {
    const p: Position = this;
    const parent_v: VNode = p_after._parentVnode()!;
    p.stack = [...p_after.stack];
    p._childIndex = p_after._childIndex + 1;
    const child: VNode = p.v;
    const n: number = p_after._childIndex + 1;
    child._addCopiedLink(n, parent_v);
}

</t>
<t tx="felix.20210127234205.5">/**
 * Link self as the n'th child of the parent.
 */
public _linkAsNthChild(parent: Position, n: number): void {
    const p: Position = this;
    const parent_v: VNode = parent.v;
    p.stack = [...parent.stack];
    p.stack.push([parent_v, parent._childIndex]);
    p._childIndex = n;
    const child: VNode = p.v;
    child._addLink(n, parent_v);
}

</t>
<t tx="felix.20210127234205.6">/**
 * Link a copied self as the n'th child of the parent.
 */
public _linkCopiedAsNthChild(parent: Position, n: number): void {
    const p: Position = this;
    const parent_v: VNode = parent.v;
    p.stack = [...parent.stack];
    p.stack.push([parent_v, parent._childIndex]);
    p._childIndex = n;
    const child: VNode = p.v;
    child._addCopiedLink(n, parent_v);
}

</t>
<t tx="felix.20210127234205.7">/**
 * Link self as the root node.
 */
public _linkAsRoot(): Position {
    const p: Position = this;
    console.assert(p.v);
    const parent_v: VNode = p.v.context.hiddenRootNode!;
    console.assert(parent_v, g.callers());

    // Make p the root position.
    p.stack = [];
    p._childIndex = 0;

    // Make p.v the first child of parent_v.
    p.v._addLink(0, parent_v);
    return p;
}

</t>
<t tx="felix.20210127234205.8">/**
 * Return the parent VNode.
 * Return the hiddenRootNode if there is no other parent.
 */
public _parentVnode(): VNode | undefined {
    const p: Position = this;
    if (p.v) {
        const data = !!p.stack.length &amp;&amp; p.stack[p.stack.length - 1];
        if (data) {
            const v: VNode = data[0];
            return v;
        }
        return p.v.context.hiddenRootNode;
    }
    return undefined;
}

</t>
<t tx="felix.20210127234205.9">/**
 * A low-level method to replace p.v by a p2.v.
 */
public _relinkAsCloneOf(p2: Position): void {
    const p: Position = this;
    const v: VNode = p.v;
    const v2: VNode = p2.v;
    const parent_v: VNode | undefined = p._parentVnode();
    if (!parent_v) {
        g.error('no parent_v', p);
        return;
    }
    // Compare fileIndex instead of v directly
    if (parent_v.children[p._childIndex].fileIndex === v.fileIndex) {
        parent_v.children[p._childIndex] = v2;
        v2.parents.push(parent_v);
        // p.v no longer truly exists.
        // p.v = p2.v
    } else {
        g.error(
            'parent_v.children[childIndex] != v',
            p, parent_v.children, p._childIndex, v);
    }
}

</t>
<t tx="felix.20210130233340.1"></t>
<t tx="felix.20210130233340.3">public __repr__(): string {
    return `&lt;VNode ${this.gnx} ${this.headString()}&gt;`;
}

</t>
<t tx="felix.20210130233340.4">public dumpLink(link: string): string {
    return link ? link : "&lt;none&gt;";
}

public dump(label = ""): void {
    const v: VNode = this;
    const s: string = '-'.repeat(10);
    console.log(`${s} ${label} ${v}`);
    // console.log(`gnx: ${v.gnx}`);
    console.log(`parents.length: ${v.parents.length}`);
    console.log(`children.length: ${v.children.length}`);
    console.log(`parents: ${g.listToString(v.parents)}`);
    console.log(`children: ${g.listToString(v.children)}`);
}

</t>
<t tx="felix.20210130235311.1">/**
 * Pretty print any Python object to a string.
 * TODO : Temporary json stringify
 */
export function objToString(obj: any, indent = '', printCaller = false, tag = null): string {
    return JSON.stringify(obj);

    // # pylint: disable=undefined-loop-variable
    //     # Looks like a a pylint bug.
    // #
    // # Compute s.
    // if isinstance(obj, dict):
    //     s = dictToString(obj, indent=indent)
    // elif isinstance(obj, list):
    //     s = listToString(obj, indent=indent)
    // elif isinstance(obj, tuple):
    //     s = tupleToString(obj, indent=indent)
    // elif isinstance(obj, str):
    //     # Print multi-line strings as lists.
    //     s = obj
    //     lines = splitLines(s)
    //     if len(lines) &gt; 1:
    //         s = listToString(lines, indent=indent)
    //     else:
    //         s = repr(s)
    // else:
    //     s = repr(obj)
    // #
    // # Compute the return value.
    // if printCaller and tag:
    //     prefix = f"{caller()}: {tag}"
    // elif printCaller or tag:
    //     prefix = caller() if printCaller else tag
    // else:
    //     prefix = None
    // if prefix:
    //     sep = '\n' if '\n' in s else ' '
    //     return f"{prefix}:{sep}{s}"
    // return s

}

</t>
<t tx="felix.20210131011420.1"></t>
<t tx="felix.20210131011420.10">public isRootPosition(p: Position): boolean {
    const c: Commands = this;
    const root: Position | undefined = c.rootPosition();
    return !!p &amp;&amp;
        !!root &amp;&amp;
        p.__bool__() &amp;&amp;
        root.__bool__() &amp;&amp; p.__eq__(root);
}

</t>
<t tx="felix.20210131011420.11">public isChanged(): boolean {
    return this.changed;
}

</t>
<t tx="felix.20210131011420.12">/**
 * Return the last top-level position in the outline.
 */
public lastTopLevel(): Position {
    const c: Commands = this;
    const p: Position | undefined = c.rootPosition();
    while (p &amp;&amp; p.hasNext()) {
        p.moveToNext();
    }
    return p!;
}

</t>
<t tx="felix.20210131011420.13">/**
 * New in Leo 5.5: Return None.
 * Using empty positions masks problems in program logic.
 * In fact, there are no longer any calls to this method in Leo's core.
 */
public nullPosition(): void {
    g.trace('This method is deprecated. Instead, just use None.');
    // pylint complains if we return None.
}

</t>
<t tx="felix.20210131011420.14">/**
 * Return True if a position exists in c's tree
 */
public positionExists(p: Position, root?: Position, trace?: boolean): boolean {

    if (!p || !p.__bool__() || !p.v) {
        return false;
    }

    const rstack: StackEntry[] = (root &amp;&amp; root.__bool__()) ? root.stack.concat([[root.v, root._childIndex]]) : [];
    const pstack: StackEntry[] = p.stack.concat([[p.v, p._childIndex]]);

    if (rstack.length &gt; pstack.length) {
        return false;
    }

    let par: VNode = this.hiddenRootNode!;

    let arrayLength: number = pstack.length;

    for (let j = 0; j &lt; arrayLength; j++) {
        const x: StackEntry = pstack[j];

        if (j &lt; rstack.length &amp;&amp; (x[0].gnx !== rstack[j][0].gnx || x[1] !== rstack[j][1])) {
            return false;
        }

        let v: VNode;
        let i: number;
        [v, i] = x;

        if (i &gt;= par.children.length || v.gnx !== par.children[i].gnx) {
            return false;
        }

        par = v;
    }
    return true;
}

</t>
<t tx="felix.20210131011420.15">/**
 * Dump position p and it's ancestors.
 */
public dumpPosition(p: Position): void {
    g.trace('=====', p.h, p._childIndex);

    let arrayLength: number = p.stack.length;
    for (let i = 0; i &lt; arrayLength; i++) {
        const data = p.stack[i];
        let v: VNode;
        let childIndex: number;
        [v, childIndex] = data;
        console.log(`${i} ${childIndex} ${v._headString}`);
    }
}

</t>
<t tx="felix.20210131011420.16">/**
 * Return the root position.
 *
 * Root position is the first position in the document. Other
 * top level positions are siblings of this node.
 */
public rootPosition(): Position | undefined {
    const c: Commands = this;
    // 2011/02/25: Compute the position directly.
    if (!!c.hiddenRootNode &amp;&amp; c.hiddenRootNode.children.length) {
        const v: VNode = c.hiddenRootNode.children[0];
        return new Position(v, 0, undefined);
    }
    return undefined;
}

// * For compatibility with old scripts...
// rootVnode = rootPosition
// findRootPosition = rootPosition

</t>
<t tx="felix.20210131011420.17">/**
 * Return True if the node at position p should be expanded.
 */
public shouldBeExpanded(p: Position): boolean {
    const c: Commands = this;
    const v: VNode = p.v;
    if (!p.hasChildren()) {
        return false;
    }
    // Always clear non-existent positions.
    // v.expandedPositions: Position[] = [z for z in v.expandedPositions if c.positionExists(z)]
    v.expandedPositions = v.expandedPositions.filter(z =&gt; c.positionExists(z));

    if (!p.isCloned()) {
        // Do not call p.isExpanded here! It calls this method.
        return p.v.isExpanded();
    }
    if (p.isAncestorOf(c.p)) {
        return true;
    }
    for (let p2 of v.expandedPositions) {
        if (p.__eq__(p2)) {
            return true;
        }
    }
    return false;
}

</t>
<t tx="felix.20210131011420.2">/**
 * Return a copy of the presently selected position or a new null
 * position. So c.p.copy() is never necessary.
 */
public currentPosition(): Position | undefined {
    const c: Commands = this;
    if (c._currentPosition) {
        // *Always* return a copy.
        return c._currentPosition.copy();
    }
    return c.rootPosition();
}

// For compatibility with old scripts...
// currentVnode = currentPosition

</t>
<t tx="felix.20210131011420.3">// Compatibility with scripts

public fileName(): string {
    let s: string = this.mFileName || "";
    if (g.isWindows) {
        s = s.replace('\\', '/');
    }
    return s;
}

public relativeFileName(): string {
    return this.mRelativeFileName || this.mFileName;
}

public shortFileName(): string {
    return g.shortFileName(this.mFileName);
}

// * Alternative Naming
// shortFilename = shortFileName

</t>
<t tx="felix.20210131011420.4">/**
 * Move to the first visible node of the present chapter or hoist.
 */
public firstVisible(): Position {
    const c: Commands = this;
    let p: Position = c.p;
    while (1) {
        let back: Position = p.visBack(c);
        if (back.__bool__() &amp;&amp; back.isVisible(c)) {
            p = back;
        } else {
            break;
        }
    }
    return p;
}

</t>
<t tx="felix.20210131011420.5">/**
 * Return the tab width in effect at p.
 */
public getTabWidth(p: Position): number {
    const c: Commands = this;
    // const val:number = g.scanAllAtTabWidthDirectives(c, p);
    // TODO: NEEDED?
    const val: number = 10;
    return val;
}

</t>
<t tx="felix.20210131011420.6"></t>
<t tx="felix.20210131011420.7">/**
 * Return True if the current position is the root position.
 *
 * This method is called during idle time, so not generating positions
 * here fixes a major leak.
 */
public currentPositionIsRootPosition(): boolean {
    const c: Commands = this;
    const root: Position | undefined = c.rootPosition();
    return !!c._currentPosition &amp;&amp;
        !!root &amp;&amp;
        c._currentPosition.__bool__() &amp;&amp;
        root.__bool__() &amp;&amp; c._currentPosition.__eq__(root);
}

// return (
// c._currentPosition and c._rootPosition and
// c._currentPosition == c._rootPosition)

</t>
<t tx="felix.20210131011420.8">/**
 * Return True if the current position is the root position.

    This method is called during idle time, so not generating positions
    here fixes a major leak.
 */
public currentPositionHasNext(): boolean {
    const c: Commands = this;
    const current: Position = c._currentPosition!;
    return current &amp;&amp; current.__bool__() &amp;&amp; current.hasNext()!;
    return false;
}

</t>
<t tx="felix.20210131011420.9">public isCurrentPosition(p: Position): boolean {
    const c: Commands = this;
    if (!p || !c._currentPosition ||
        !p.__bool__() || !!c._currentPosition.__bool__()) {
        return false;
    }
    return p.__eq__(c._currentPosition);
}

</t>
<t tx="felix.20210131011440.1">/**
 * Return the topmost visible node.
 * This is affected by chapters and hoists.
 */
public visLimit(): [Position, boolean] | undefined {
    const c: Commands = this;
    const cc: any = false;// c.chapterController
    if (c.hoistStack.length) {
        const bunch: HoistStackEntry = c.hoistStack[c.hoistStack.length - 1];
        const p: Position = bunch.p;
        const limitIsVisible: boolean = !cc || !p.h.startsWith('@chapter');
        return [p, limitIsVisible];
    }
    return undefined;
}

</t>
<t tx="felix.20210131011508.1"></t>
<t tx="felix.20210131011508.2">/**
 * A generator returning all vnodes in the outline, in outline order.
 */
public *all_nodes(): Generator&lt;VNode&gt; {
    const c: Commands = this;
    for (let p of c.all_positions()) {
        yield p.v;
    }
}


/**
 * A generator returning each vnode of the outline.
 */
public *all_unique_nodes(): Generator&lt;VNode&gt; {
    const c: Commands = this;
    for (let p of c.all_unique_positions(false)) {
        yield p.v;
    }
}

</t>
<t tx="felix.20210131011508.3">/**
 * A generator return all positions of the outline, in outline order.
 */
public *all_positions(copy = true): Generator&lt;Position&gt; {
    const c: Commands = this;
    const p: Position | undefined = c.rootPosition();
    while (p &amp;&amp; p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToThreadNext();
    }
}

</t>
<t tx="felix.20210131011508.4">/**
 * Generates all positions p in this outline where p.v is v.
 *
 *  Should be called with stack=None.
 *
 *  The generated positions are not necessarily in outline order.
 *
 *  By Виталије Милошевић (Vitalije Milosevic).
 */
public *all_positions_for_v(v: VNode, stack?: StackEntry[]): Generator&lt;Position&gt; {

    const c: Commands = this;

    if (!stack) {
        stack = [];
    }

    if (!(v instanceof VNode)) {
        g.es_print(`not a VNode: ${JSON.stringify(v)}`);
        return;  // Stop the generator.
    }

    /**
     * Yield all indices i such that v.children[i] == target_v.
     */
    function* allinds(v: VNode, target_v: VNode): Generator&lt;number&gt; {
        const arrayLength = v.children.length;
        for (var i = 0; i &lt; arrayLength; i++) {
            if (v.children[i].gnx === target_v.gnx) {
                yield i;
            }
        }
    }

    /**
     * Convert the stack to a position.
     */
    function stack2pos(stack: StackEntry[]): Position {
        let v: VNode;
        let i: number;
        [v, i] = stack[stack.length - 1];
        return new Position(v, i, stack.slice(0, -1));
    }

    for (let v2 of v.parents) {
        for (let i of allinds(v2, v)) {
            stack.unshift([v, i]);
            if (v2.gnx === c.hiddenRootNode!.gnx) {
                yield stack2pos(stack);
            } else {
                yield* c.all_positions_for_v(v2, stack);
            }
            stack.shift();
        }
    }
}

</t>
<t tx="felix.20210131011508.5">/**
 * A generator yielding *all* the root positions in the outline that
 * satisfy the given predicate. p.isAnyAtFileNode is the default
 * predicate.
 *
 * The generator yields all **root** anywhere in the outline that satisfy
 * the predicate. Once a root is found, the generator skips its subtree.
 */
public *all_roots(copy = true, predicate?: (p: Position) =&gt; boolean): Generator&lt;Position&gt; {
    const c: Commands = this;

    if (!predicate) {
        // pylint: disable=function-redefined
        predicate = function (p: Position): boolean {
            return p.isAnyAtFileNode();
        };
    }

    const p: Position | undefined = c.rootPosition();
    while (p &amp;&amp; p.__bool__()) {
        if (predicate(p)) {
            yield p.copy();  // 2017/02/19
            p.moveToNodeAfterTree();
        } else {
            p.moveToThreadNext();
        }
    }
}

</t>
<t tx="felix.20210131011508.6">/**
 * A generator return all positions of the outline, in outline order.
 * Returns only the first position for each vnode.
 */
public *all_unique_positions(copy = true): Generator&lt;Position&gt; {
    const c: Commands = this;
    const p: Position | undefined = c.rootPosition();
    const seen: VNode[] = [];
    while (p &amp;&amp; p.__bool__()) {
        if (seen.includes(p.v)) {
            p.moveToNodeAfterTree();
        } else {
            seen.push(p.v);
            yield (copy ? p.copy() : p);
            p.moveToThreadNext();
        }
    }
}

</t>
<t tx="felix.20210131011508.7">/**
 * A generator yielding all unique root positions in the outline that
 * satisfy the given predicate. p.isAnyAtFileNode is the default
 * predicate.
 *
 * The generator yields all **root** anywhere in the outline that satisfy
 * the predicate. Once a root is found, the generator skips its subtree.
 */
public *all_unique_roots(copy = true, predicate?: (p: Position) =&gt; boolean): Generator&lt;Position&gt; {
    const c: Commands = this;

    if (!predicate) {
        // pylint: disable=function-redefined
        predicate = function (p: Position): boolean {
            return p.isAnyAtFileNode();
        };
    }

    const seen: VNode[] = [];
    const p: Position | undefined = c.rootPosition();
    while (p &amp;&amp; p.__bool__()) {
        if (!seen.includes(p.v) &amp;&amp; predicate(p)) {
            seen.push(p.v);
            yield (copy ? p.copy() : p);
            p.moveToNodeAfterTree();
        } else {
            p.moveToThreadNext();
        }
    }
}
</t>
<t tx="felix.20210131011508.8">/**
 * A generator returning all positions of the outline. This generator does
 * *not* assume that vnodes are never their own ancestors.
 */
public *safe_all_positions(copy = true): Generator&lt;Position&gt; {
    const c: Commands = this;
    const p: Position | undefined = c.rootPosition(); // Make one copy.
    while (p &amp;&amp; p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.safeMoveToThreadNext();
    }
}

</t>
<t tx="felix.20210131011549.1">/**
 * commander current position property
 */
public get p(): Position {
    const c: Commands = this;
    return c.currentPosition()!;
}

</t>
<t tx="felix.20210131011607.1"></t>
<t tx="felix.20210131011607.2">public appendStringToBody(p: Position, s: string): void {
    if (s) {
        p.b = p.b + g.toUnicode(s);
    }
}

</t>
<t tx="felix.20210131011607.3">public clearAllMarked(): void {
    const c: Commands = this;
    for (let p of c.all_unique_positions(false)) {
        p.v.clearMarked();
    }
}

</t>
<t tx="felix.20210131011607.4">public clearAllVisited(): void {
    const c: Commands = this;
    for (let p of c.all_unique_positions(false)) {
        p.v.clearVisited();
        p.v.clearWriteBit();
    }
}

</t>
<t tx="felix.20210131011607.5">/**
 * clear the marker that indicates that the .leo file has been changed.
 */
public clearChanged(): void {
    const c: Commands = this;
    c.changed = false;
    // Clear all dirty bits _before_ setting the caption.
    for (let v of c.all_unique_nodes()) {
        v.clearDirty();
    }
    c.changed = false;
    // * Old code.
    // master = getattr(c.frame.top, 'leo_master', None)
    // if master:
    // master.setChanged(c, False)
    // // LeoTabbedTopLevel.setChanged.
    // s = c.frame.getTitle()
    // if len(s) &gt; 2 and s[0:2] == "* ":
    // c.frame.setTitle(s[2:])
}

</t>
<t tx="felix.20210131011607.6">public clearMarked(p: Position): void {
    const c: Commands = this;
    p.v.clearMarked();
    g.doHook("clear-mark", c, p);
}

</t>
<t tx="felix.20210131011607.7">/**
 * This is equivalent to p.b = s.
 * Warning: This method may call c.recolor() or c.redraw().
 */
public setBodyString(p: Position, s: string): void {
    const c: Commands = this;
    const v: VNode = p.v;
    if (!c || !v) {
        return;
    }
    s = g.toUnicode(s);
    const current: Position = c.p;
    // 1/22/05: Major change: the previous test was: 'if p == current:'
    // This worked because commands work on the presently selected node.
    // But setRecentFiles may change a _clone_ of the selected node!
    if (current &amp;&amp; current.__bool__() &amp;&amp; p.v.gnx === current.v.gnx) {
        // * Leo used to send it to gui
        // const w:any = c.frame.body.wrapper;
        // w.setAllText(s);
        v.setSelection(0, 0);
        c.recolor();
    }
    // Keep the body text in the VNode up-to-date.
    if (v.b !== s) {
        v.setBodyString(s);
        v.setSelection(0, 0);
        p.setDirty();
        if (!c.isChanged()) {
            c.setChanged();
        }
        c.redraw_after_icons_changed();
    }
}

</t>
<t tx="felix.20210131011607.8">/**
 * Set the marker that indicates that the .leo file has been changed.
 */
public setChanged(redrawFlag: boolean = true): void {
    const c: Commands = this;
    c.changed = true;
    // Do nothing for null frames.
    //if !redrawFlag:  // Prevent flash when fixing #387.
    //    return
    // * Old code.
    // master = getattr(c.frame.top, 'leo_master', None)
    // if master:
    // master.setChanged(c, True)
    // // LeoTabbedTopLevel.setChanged.
    // s = c.frame.getTitle()
    // if len(s) &gt; 2 and s[0] != '*':
    // c.frame.setTitle("* " + s)
}

</t>
<t tx="felix.20210131011607.9">/**
 * Set the presently selected position. For internal use only.
 * Client code should use c.selectPosition instead.
 */
public setCurrentPosition(p: Position): void {
    const c: Commands = this;
    if (!(p &amp;&amp; p.__bool__())) {
        g.trace('===== no p', g.callers());
        return;
    }
    if (c.positionExists(p)) {
        if (c._currentPosition &amp;&amp; p.__eq__(c._currentPosition)) {
            // We have already made a copy.
            // pass;
        } else { // Make a copy _now_
            c._currentPosition = p.copy();
        }
    } else { // 2011/02/25:
        c._currentPosition = c.rootPosition();
        g.trace(`Invalid position: ${p.h}`);
        g.trace(g.callers());
        // Don't kill unit tests for this kind of problem.
    }
}

// * For compatibility with old scripts.
//setCurrentVnode = setCurrentPosition

</t>
<t tx="felix.20210202235315.1"></t>
<t tx="felix.20210202235315.10">// These methods are useful abbreviations.
// Warning: they make copies of positions, so they should be used _sparingly_

public getBack(): Position { return this.copy().moveToBack(); }

public getFirstChild(): Position { return this.copy().moveToFirstChild(); }

public getLastChild(): Position { return this.copy().moveToLastChild(); }

public getLastNode(): Position { return this.copy().moveToLastNode(); }
// def getLastVisible   (): return this.copy().moveToLastVisible();

public getNext(): Position { return this.copy().moveToNext(); }

public getNodeAfterTree(): Position { return this.copy().moveToNodeAfterTree(); }

public getNthChild(n: number): Position { return this.copy().moveToNthChild(n); }

public getParent(): Position { return this.copy().moveToParent(); }

public getThreadBack(): Position { return this.copy().moveToThreadBack(); }

public getThreadNext(): Position { return this.copy().moveToThreadNext(); }
// New in Leo 4.4.3 b2: add c args.

public getVisBack(c: Commands): Position { return this.copy().moveToVisBack(c)!; }

public getVisNext(c: Commands): Position { return this.copy().moveToVisNext(c)!; }

</t>
<t tx="felix.20210202235315.11">/**
 * with_file = True - include path to Leo file
 * with_proto = False - include 'file://'
 * with_index - include ',x' at end where x is child index in parent
 * with_count - include ',x,y' at end where y zero based count of same headlines
 */
public get_UNL(with_file = true, with_proto = false, with_index = true, with_count = false): string {
    const aList: string[] = [];
    for (let i of this.self_and_parents(false)) {
        if (with_index || with_count) {
            let count: number = 0;
            let ind: number = 0;
            const p: Position = i.copy();
            while (p.hasBack()) {
                ind = ind + 1;
                p.moveToBack();
                if (i.h === p.h) {
                    count = count + 1;
                }
            }
            aList.push(i.h.replace('--&gt;', '--%3E') + ":" + ind.toString());
            // g.recursiveUNLFind and sf.copy_to_my_settings undo this replacement.
            if (count || with_count) {
                aList[-1] = aList[-1] + "," + count.toString();
            }
        } else {
            aList.push(i.h.replace('--&gt;', '--%3E'));
            // g.recursiveUNLFind  and sf.copy_to_my_settings undo this replacement.
        }
    }

    const UNL: string = aList.reverse().join('--&gt;');
    if (with_proto) {
        // return ("file://%s#%s" % (self.v.context.fileName(), UNL)).replace(' ', '%20')
        const s: string = "unl:" + `//${this.v.context.fileName()}#${UNL}`;
        return s.replace(' ', '%20');
    }
    if (with_file) {
        return `${this.v.context.fileName()}#${UNL}`;
    }
    return UNL;
}

</t>
<t tx="felix.20210202235315.12">public hasBack(): boolean {
    const p: Position = this;
    return p.v &amp;&amp; p._childIndex &gt; 0;
}

public hasNext(): boolean | undefined {
    const p: Position = this;
    try {
        const parent_v: VNode = p._parentVnode()!;
        // Returns None if p.v is None.
        return p.v &amp;&amp; parent_v &amp;&amp; p._childIndex + 1 &lt; parent_v.children.length;
    }
    catch (Exception) {
        g.trace('*** Unexpected exception');
        g.es_exception();
        return undefined;
    }
}

public hasParent(): boolean {
    const p: Position = this;
    return p.v &amp;&amp; !!p.stack.length;
}

public hasThreadBack(): boolean {
    const p: Position = this;
    return p.hasParent() || p.hasBack();
    // Much cheaper than computing the actual value.
}

</t>
<t tx="felix.20210202235315.13">public hasThreadNext(): boolean {
    const p: Position = this;
    if (!p.v) {
        return false;
    }
    if (p.hasChildren() || p.hasNext()) {
        return true;
    }
    let n: number = p.stack.length - 1;
    while (n &gt;= 0) {
        let v: VNode;
        let childIndex: number;
        let parent_v: VNode;
        [v, childIndex] = p.stack[n];
        // See how many children v's parent has.
        if (n === 0) {
            parent_v = v.context.hiddenRootNode!;
        } else {
            parent_v = p.stack[n - 1][0];
        }
        if (parent_v.children.length &gt; childIndex + 1) {
            // v has a next sibling.
            return true;
        }
        n -= 1;
    }
    return false;
}

</t>
<t tx="felix.20210202235315.14">public findRootPosition(): Position {
    // 2011/02/25: always use c.rootPosition
    const p: Position = this;
    const c: Commands = p.v.context;
    return c.rootPosition()!;
}

</t>
<t tx="felix.20210202235315.15">/**
 * Return True if p is one of the direct ancestors of p2.
 */
public isAncestorOf(p2: Position): boolean {
    const p: Position = this;
    const c: Commands = p.v.context;
    if (!c.positionExists(p2)) {
        return false;
    }
    for (let z of p2.stack) {
        // 2013/12/25: bug fix: test childIndices.
        // This is required for the new per-position expansion scheme.
        let parent_v: VNode;
        let parent_childIndex: number;
        [parent_v, parent_childIndex] = z;
        if (
            parent_v.fileIndex === p.v.fileIndex &amp;&amp;
            parent_childIndex === p._childIndex
        ) {
            return true;
        }
    }
    return false;
}

</t>
<t tx="felix.20210202235315.16">public isCloned(): boolean {
    const p: Position = this;
    return p.v.isCloned();
}

</t>
<t tx="felix.20210202235315.17">public isRoot(): boolean {
    const p: Position = this;
    return !p.hasParent() &amp;&amp; !p.hasBack();
}

</t>
<t tx="felix.20210202235315.18">/**
 * Return True if p is visible in c's outline.
 */
public isVisible(c: Commands): boolean {
    const p: Position = this;

    function visible(p: Position, root?: Position) {
        for (let parent of p.parents(false)) {
            if (parent.__bool__() &amp;&amp; parent.__eq__(root!)) {
                // #12.
                return true;
            }
            if (!c.shouldBeExpanded(parent)) {
                return false;
            }
        }
        return true;
    }

    if (c.hoistStack.length) {
        const root: Position = c.hoistStack[-1].p;
        if (p.__eq__(root)) {
            // #12.
            return true;
        }
        return root.isAncestorOf(p) &amp;&amp; visible(p, root);
    }
    for (let root of c.rootPosition()!.self_and_siblings(false)) {
        if (root.__eq__(p) || root.isAncestorOf(p)) {
            return visible(p);
        }
    }
    return false;
}

</t>
<t tx="felix.20210202235315.19">/**
 * Return the number of p's parents.
 */
public level(): number {
    const p: Position = this;
    return p.v ? p.stack.length : 0;
}

</t>
<t tx="felix.20210202235315.20">/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
    Return the position corresponding to p.nodeAfterTree() after this node is
    deleted. This will be p.nodeAfterTree() unless p.next() exists.

    This method allows scripts to traverse an outline, deleting nodes during the
    traversal. The pattern is::

        p = c.rootPosition()
        while p:
        if &lt;delete p?&gt;:
            next = p.positionAfterDeletedTree()
            p.doDelete()
            p = next
        else:
            p.moveToThreadNext()

    This method also allows scripts to *move* nodes during a traversal, **provided**
    that nodes are moved to a "safe" spot so that moving a node does not change the
    position of any other nodes.

    For example, the move-marked-nodes command first creates a **move node**, called
    'Clones of marked nodes'. All moved nodes become children of this move node.
    **Inserting** these nodes as children of the "move node" does not change the
    positions of other nodes. **Deleting** these nodes *may* change the position of
    nodes, but the pattern above handles this complication cleanly.
 * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
public positionAfterDeletedTree(): Position {
    let p: Position = this;
    const next: Position = p.next();
    if (next.__bool__()) {
        // The new position will be the same as p, except for p.v.
        p = p.copy();
        p.v = next.v;
        return p;
    }
    return p.nodeAfterTree();
}

</t>
<t tx="felix.20210202235315.21">/**
 * """
    Return the fcol offset of self.
    Return None if p is has no ancestor @&lt;file&gt; node.
    http://tinyurl.com/5nescw
    """
 */
public textOffset(): number | undefined {
    const p1: Position = this;
    let found: boolean = false;
    let offset: number = 0;
    for (let p of p1.self_and_parents(false)) {
        if (p.isAnyAtFileNode()) {
            // Ignore parent of @&lt;file&gt; node.
            found = true;
            break;
        }
        const parent: Position = p.parent();
        if (!parent.__bool__()) {
            break;
        }
        // If p is a section definition, search the parent for the reference.
        // Otherwise, search the parent for @others.
        const h: string = p.h.trim();
        const i: number = h.indexOf('&lt;&lt;');
        const j: number = h.indexOf('&gt;&gt;');
        // const target:string = h[i : j + 2] if -1 &lt; i &lt; j else '@others'
        const target: string = (-1 &lt; i &amp;&amp; i &lt; j) ? h.slice(i, j + 2) : '@others';
        for (let s of parent.b.split('\n')) {
            if (s.indexOf(target) &gt; -1) {
                offset += g.skip_ws(s, 0);
                break;
            }
        }
    }
    return found ? offset : undefined;
}

</t>
<t tx="felix.20210204224730.1">/*
    - convertTreeToString and moreHead can't be VNode methods because they use level().
    - moreBody could be anywhere: it may as well be a position method.
*/

</t>
<t tx="felix.20210204224730.2">/**
 * Convert a positions  suboutline to a string in MORE format.
 */
public convertTreeToString(): string {
    const p1: Position = this;
    const level1 = p1.level();
    const array: string[] = [];
    for (let p of p1.self_and_subtree(false)) {
        array.push(p.moreHead(level1) + '\n');
        const body: string = p.moreBody();
        if (body) {
            array.push(body + '\n');
        }
    }
    return array.join('');
}

</t>
<t tx="felix.20210204224730.3">/**
 * Return the headline string in MORE format.
 */
public moreHead(firstLevel: number, useVerticalBar?: boolean): string {
    // useVerticalBar is unused, but it would be useful in over-ridden methods.
    const p: Position = this;
    const level: number = this.level() - firstLevel;
    const plusMinus: string = p.hasChildren() ? "+" : "-";
    const pad: string = '\t'.repeat(level);
    return `${pad}${plusMinus} ${p.h}`;
}

</t>
<t tx="felix.20210204224730.4">/*
    + test line
    - test line
    \ test line
    test line +
    test line -
    test line \
    More lines...
*/

/**
 * Returns the body string in MORE format.
 * Inserts a backslash before any leading plus, minus or backslash.
 */
public moreBody(): string {
    const p: Position = this;
    const array: string[] = [];
    const lines: string[] = p.b.split('\n');
    for (let s of lines) {
        const i: number = g.skip_ws(s, 0);
        if (i &lt; s.length &amp;&amp; ['+', '-', '\\'].includes(s[i])) {
            s = s.slice(0, i) + '\\' + s.slice(i);
        }
        array.push(s);
    }
    return array.join('\n');
}

</t>
<t tx="felix.20210204235058.1"></t>
<t tx="felix.20210204235058.10">/**
 * Yield p and all positions in p's subtree.
 */
public *self_and_subtree(copy: boolean = true): Generator&lt;Position&gt; {
    let p: Position = this;
    p = p.copy();
    const after: Position = p.nodeAfterTree();
    while (p.__bool__() &amp;&amp; !p.__eq__(after)) {
        yield (copy ? p.copy() : p);
        p.moveToThreadNext();
    }
}

// * Compatibility with old code...
// self_and_subtree_iter = self_and_subtree

</t>
<t tx="felix.20210204235058.11">/**
 * Yield all positions in p's subtree, but not p.
 */
public *subtree(copy: boolean = true): Generator&lt;Position&gt; {
    let p: Position = this;
    p = p.copy();
    const after: Position = p.nodeAfterTree();
    p.moveToThreadNext();
    while (p.__bool__() &amp;&amp; !p.__eq__(after)) {
        yield (copy ? p.copy() : p);
        p.moveToThreadNext();
    }
}

//* Compatibility with old code...
// subtree_iter = subtree

</t>
<t tx="felix.20210204235058.12">/**
 * Yield p.v and all unique vnodes in p's subtree.
 */
public *unique_nodes(): Generator&lt;VNode&gt; {
    const p1: Position = this;
    const seen: VNode[] = [];
    for (let p of p1.self_and_subtree(false)) {
        if (!seen.includes(p.v)) {
            seen.push(p.v);
            yield p.v;
        }
    }
}

// * Compatibility with old code.
// unique_tnodes_iter = unique_nodes
// unique_vnodes_iter = unique_nodes

</t>
<t tx="felix.20210204235058.13">/**
 * Yield p and all other unique positions in p's subtree.
 */
public *unique_subtree(copy: boolean = true): Generator&lt;Position&gt; {
    const p1: Position = this;
    const seen: VNode[] = [];
    for (let p of p1.subtree()) {
        if (!seen.includes(p.v)) {
            seen.push(p.v);
            // Fixed bug 1255208: p.unique_subtree returns vnodes, not positions.
            yield (copy ? p.copy() : p);
        }
    }
}

// * Compatibility with old code...
// subtree_with_unique_tnodes_iter = unique_subtree
// subtree_with_unique_vnodes_iter = unique_subtree

</t>
<t tx="felix.20210204235058.3">/**
 * Yield all siblings positions that follow p, not including p.
 */
public *following_siblings(copy: boolean = true): Generator&lt;Position&gt; {
    let p: Position = this;
    p = p.next();
    while (p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToNext();
    }
}

// * Compatibility with old code...
// following_siblings_iter = following_siblings

</t>
<t tx="felix.20210204235058.4">/**
 * A generator yielding all the root positions "near" p1 = self that
    satisfy the given predicate. p.isAnyAtFileNode is the default
    predicate.

    The search first proceeds up the p's tree. If a root is found, this
    generator yields just that root.

    Otherwise, the generator yields all nodes in p.subtree() that satisfy
    the predicate. Once a root is found, the generator skips its subtree.
 */
public *nearest_roots(copy = true, predicate?: (p: Position) =&gt; boolean): Generator&lt;Position&gt; {
    if (!predicate) {
        // pylint: disable=function-redefined
        predicate = function (p: Position): boolean {
            return p.isAnyAtFileNode();
        };
    }

    // First, look up the tree.
    let p1: Position = this;
    for (let p of p1.self_and_parents(false)) {
        if (predicate(p)) {
            yield (copy ? p.copy() : p);
            return;
        }
    }

    // Next, look for all .md files in the tree.
    const after: Position = p1.nodeAfterTree();
    const p: Position = p1;
    while (p.__bool__() &amp;&amp; !p.__eq__(after)) {
        if (predicate(p)) {
            yield (copy ? p.copy() : p);
            p.moveToNodeAfterTree();
        } else {
            p.moveToThreadNext();
        }
    }
}

</t>
<t tx="felix.20210204235058.5">/**
 *  A generator yielding all unique root positions "near" p1 = self that
    satisfy the given predicate. p.isAnyAtFileNode is the default
    predicate.

    The search first proceeds up the p's tree. If a root is found, this
    generator yields just that root.

    Otherwise, the generator yields all unique nodes in p.subtree() that
    satisfy the predicate. Once a root is found, the generator skips its
    subtree.
 */
public *nearest_unique_roots(copy = true, predicate?: (p: Position) =&gt; boolean): Generator&lt;Position&gt; {
    if (!predicate) {
        // pylint: disable=function-redefined
        predicate = function (p: Position): boolean {
            return p.isAnyAtFileNode();
        };
    }

    // First, look up the tree.
    let p1: Position = this;
    for (let p of p1.self_and_parents(false)) {
        if (predicate(p)) {
            yield (copy ? p.copy() : p);
            return;
        }
    }

    // Next, look for all unique .md files in the tree.
    const seen: VNode[] = [];
    const after: Position = p1.nodeAfterTree();
    const p: Position = p1;
    while (p.__bool__() &amp;&amp; !p.__eq__(after)) {
        if (predicate(p)) {
            if (!seen.includes(p.v)) {
                seen.push(p.v);
                yield (copy ? p.copy() : p);
            }
            p.moveToNodeAfterTree();
        } else {
            p.moveToThreadNext();
        }
    }
}

// * Compatibility with old code...
// nearest = nearest_unique_roots

</t>
<t tx="felix.20210204235058.6">/**
 * Yield p.v and all vnodes in p's subtree.
 */
public *nodes(): Generator&lt;VNode&gt; {
    let p: Position = this;
    p = p.copy();
    const after: Position = p.nodeAfterTree();
    while (p.__bool__() &amp;&amp; !p.__eq__(after)) {  // bug fix: 2013/10/12
        yield p.v;
        p.moveToThreadNext();
    }
}

// * Compatibility with old code.
// tnodes_iter = nodes
// vnodes_iter = nodes

</t>
<t tx="felix.20210204235058.7">/**
 * Yield all parent positions of p.
 */
public *parents(copy: boolean = true): Generator&lt;Position&gt; {
    let p: Position = this;
    p = p.parent();
    while (p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToParent();
    }
}

// * Compatibility with old code...
// parents_iter = parents

</t>
<t tx="felix.20210204235058.8">/**
 * Yield p and all parent positions of p.
 */
public *self_and_parents(copy: boolean = true): Generator&lt;Position&gt; {
    let p: Position = this;
    p = p.copy();
    while (p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToParent();
    }
}

// * Compatibility with old code...
// self_and_parents_iter = self_and_parents

</t>
<t tx="felix.20210204235058.9">/**
 * Yield all sibling positions of p including p.
 */
public *self_and_siblings(copy: boolean = true): Generator&lt;Position&gt; {
    let p: Position = this;
    p = p.copy();
    while (p.hasBack()) {
        p.moveToBack();
    }
    while (p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToNext();
    }
}

// * Compatibility with old code...
// self_and_siblings_iter = self_and_siblings

</t>
<t tx="felix.20210206014421.1"></t>
<t tx="felix.20210206014421.2">/**
 * position body string property
 */
public get b(): string {
    const p: Position = this;
    return p.bodyString();
}

/**
 *  Set the body text of a position.
 *
 *  **Warning: the p.b = whatever is *expensive* because it calls
 *  c.setBodyString().
 *
 *  Usually, code *should* use this setter, despite its cost, because it
 *  update's Leo's outline pane properly. Calling c.redraw() is *not*
 *  enough.
 *
 *  This performance gotcha becomes important for repetitive commands, like
 *  cff, replace-all and recursive import. In such situations, code should
 *  use p.v.b instead of p.b.
 */
public set b(val: string) {
    const p: Position = this;
    const c: Commands | false = !!p.v &amp;&amp; p.v.context;
    if (c) {
        c.setBodyString(p, val);
        // Warning: c.setBodyString is *expensive*.
    }
}

</t>
<t tx="felix.20210206014421.3">/**
 * position property returning the headline string
 */
public get h(): string {
    const p: Position = this;
    return p.headString();
}

/**
 *  Set the headline text of a position.
 *
 *  **Warning: the p.h = whatever is *expensive* because it calls
 *  c.setHeadString().
 *
 *  Usually, code *should* use this setter, despite its cost, because it
 *  update's Leo's outline pane properly. Calling c.redraw() is *not*
 *  enough.
 *
 *  This performance gotcha becomes important for repetitive commands, like
 *  cff, replace-all and recursive import. In such situations, code should
 *  use p.v.h instead of p.h.
 */
public set h(val: string) {
    const p: Position = this;
    const c: Commands | false = !!p.v &amp;&amp; p.v.context;
    if (c) {
        c.setHeadString(p, val);
        // Warning: c.setHeadString is *expensive*.
    }
}

</t>
<t tx="felix.20210206014421.4">/**
 * position gnx property
 */
public get gnx(): string {
    const p: Position = this;
    return p.v.fileIndex;
}

</t>
<t tx="felix.20210206014421.5">/**
 * position property returning the script formed by p and its descendants
 */
public get script(): string {
    const p: Position = this;
    return g.getScript(p.v.context, p,
        false,  //  Always return the entire expansion.
        true, // forcePythonSentinels
        false); // useSentinels
}

</t>
<t tx="felix.20210206014421.6">/**
 * position property returning the body text without sentinels
 */
public get nosentinels(): string {
    const p: Position = this;
    return g.splitLines(p.b).filter(z =&gt; !g.isDirective(z)).join('');
}

</t>
<t tx="felix.20210206014421.7">/**
 * p.u property
 */
public get u(): any {
    const p: Position = this;
    return p.v.u;
}

public set u(val: any) {
    const p: Position = this;
    p.v.u = val;
}

</t>
<t tx="felix.20210207005040.1"></t>
<t tx="felix.20210207005040.10">// Compatibility routine for scripts.

public clearVisitedInTree(): void {
    for (let p of this.self_and_subtree(false)) {
        p.clearVisited();
    }
}

</t>
<t tx="felix.20210207005040.11">public clearAllVisitedInTree(): void {
    for (let p of this.self_and_subtree(false)) {
        p.v.clearVisited();
        p.v.clearWriteBit();
    }
}

</t>
<t tx="felix.20210207005040.12"></t>
<t tx="felix.20210207005040.13">/**
 * (p) Set p.v dirty.
 */
public clearDirty(): void {
    const p: Position = this;
    p.v.clearDirty();
}

</t>
<t tx="felix.20210207005040.14">/**
 * Returns True if position p or one of p's parents is an @ignore node.
 */
public inAtIgnoreRange(): boolean {
    const p1: Position = this;
    for (let p of p1.self_and_parents(false)) {
        if (p.isAtIgnoreNode()) {
            return true;
        }
    }
    return false;
}

</t>
<t tx="felix.20210207005040.15">/**
 * Set all ancestor @&lt;file&gt; nodes dirty, including ancestors of all clones of p.
 */
public setAllAncestorAtFileNodesDirty(): void {
    const p: Position = this;
    p.v.setAllAncestorAtFileNodesDirty();
}

</t>
<t tx="felix.20210207005040.16">/**
 * Mark a node and all ancestor @file nodes dirty.
 * p.setDirty() is no longer expensive.
 */
public setDirty(): void {
    const p: Position = this;
    p.v.setAllAncestorAtFileNodesDirty();
    p.v.setDirty();
}

</t>
<t tx="felix.20210207005040.2"></t>
<t tx="felix.20210207005040.3">/**
 * Contract p.v and clear p.v.expandedPositions list.
 */
public contract(): void {
    const p: Position = this;
    const v: VNode = this.v;
    v.expandedPositions = v.expandedPositions.filter(z =&gt; !z.__eq__(p));
    v.contract();
}

public expand(): void {
    const p: Position = this;
    const v: VNode = this.v;
    v.expandedPositions = v.expandedPositions.filter(z =&gt; !z.__eq__(p));
    let isBreak: boolean = false;
    for (let p2 of v.expandedPositions) {
        if (p.__eq__(p2)) {
            isBreak = true;
            break;
        }
    }
    if (!isBreak) {
        v.expandedPositions.push(p.copy());
    }
    v.expand();
}

public isExpanded(): boolean {
    const p: Position = this;
    if (p.isCloned()) {
        const c: Commands = p.v.context;
        return c.shouldBeExpanded(p);
    }
    return p.v.isExpanded();
}

</t>
<t tx="felix.20210207005040.4">// Clone bits are no longer used.
// Dirty bits are handled carefully by the position class.

public clearMarked(): void { return this.v.clearMarked(); }

public clearOrphan(): void { return this.v.clearOrphan(); }

public clearVisited(): void { return this.v.clearVisited(); }

public initExpandedBit(): void { return this.v.initExpandedBit(); }

public initMarkedBit(): void { return this.v.initMarkedBit(); }

public initStatus(status: number): void { return this.v.initStatus(status); }

public setMarked(): void { return this.v.setMarked(); }

public setOrphan(): void { return this.v.setOrphan(); }

public setSelected(): void { return this.v.setSelected(); }

public setVisited(): void { return this.v.setVisited(); }

</t>
<t tx="felix.20210207005040.5">public computeIcon(): number {
    return this.v.computeIcon();
}

public setIcon(): void {
    // Compatibility routine for old scripts
}

</t>
<t tx="felix.20210207005040.6">public setSelection(start: number, length: number): void {
    return this.v.setSelection(start, length);
}

</t>
<t tx="felix.20210207005040.7">public restoreCursorAndScroll(): void {
    this.v.restoreCursorAndScroll();
}

public saveCursorAndScroll(): void {
    this.v.saveCursorAndScroll();
}

</t>
<t tx="felix.20210207005040.8">public setBodyString(s: string): void {
    const p: Position = this;
    return p.v.setBodyString(s);
}

public initHeadString(s: string): void {
    const p: Position = this;
    p.v.initHeadString(s);
}

public setHeadString(s: string): void {
    const p: Position = this;
    p.v.initHeadString(s);
    p.setDirty();
}

</t>
<t tx="felix.20210207005040.9"></t>
<t tx="felix.20210207195152.1">/**
 * Return an all-new tree of vnodes that are copies of self and all its
 * descendants.
 *
 * **Important**: the v.parents ivar must be [] for all nodes.
 * v._addParentLinks will set all parents.
 */
public copyTree(copyMarked?: boolean): VNode {
    const v: VNode = this;
    // Allocate a new vnode and gnx with empty children &amp; parents.
    const v2: VNode = new VNode(v.context);
    console.assert(v2.parents.length === 0, v2.parents.length.toString());
    console.assert(v2.gnx);
    console.assert(v.gnx !== v2.gnx);
    // Copy vnode fields. Do **not** set v2.parents.
    v2._headString = g.toUnicode(v._headString, null, true);
    v2._bodyString = g.toUnicode(v._bodyString, null, true);
    v2.u = JSON.parse(JSON.stringify(v.u)); // Deep Copy
    if (copyMarked &amp;&amp; v.isMarked()) {
        v2.setMarked();
    }
    // Recursively copy all descendant vnodes.
    for (let child of v.children) {
        v2.children.push(child.copyTree(copyMarked));
    }
    return v2;
}

</t>
<t tx="felix.20210207213301.1">public childrenModified(): void {
    // TODO: needed?
    // g.childrenModifiedSet.add(this);
}

</t>
<t tx="felix.20210207213314.1">public contentModified(): void {
    // TODO: needed?
    // g.contentModifiedSet.add(this);
}

</t>
<t tx="felix.20210207213328.1">// Called only by LeoTree.selectHelper.

/**
 * Restore the cursor position and scroll so it is visible.
 */
public restoreCursorAndScroll(): void {
    // TODO
    /*
    const traceTime:boolean = false &amp;&amp; !g.unitTesting;
    const v:VNode = this;
    let ins:number = v.insertSpot;
    // start, n = v.selectionStart, v.selectionLength
    const spot:number = v.scrollBarSpot;
    const body: any = this.context.frame.body;
    const w:any = body.wrapper;
    // Fix bug 981849: incorrect body content shown.
    if(ins===undefined){
       ins = 0;
    }
    // This is very expensive for large text.
    let t1:number;
    if (traceTime){
       t1 = time.time();
    }
    if(body.wrapper.setInsertPoint &amp;&amp; body.wrapper.setInsertPoint!==undefined){
        w.setInsertPoint(ins);
    }
    if (traceTime){
        const delta_t:number = time.time() - t1;
        if( delta_t &gt; 0.1){
            g.trace(`${delta_t} sec`);
        }
    }
    // Override any changes to the scrollbar setting that might
    // have been done above by w.setSelectionRange or w.setInsertPoint.
    if (spot !== undefined){
        w.setYScrollPosition(spot);
        v.scrollBarSpot = spot;
    }
    // Never call w.see here.
    */
}

</t>
<t tx="felix.20210208001026.1"></t>
<t tx="felix.20210208001026.2">/**
 * Return True if p.b contains an @all directive.
 */
public is_at_all(): boolean {
    const p: Position = this;
    return (
        p.isAnyAtFileNode() &amp;&amp;
        !!g.splitLines(p.b).reduce((acc, s): boolean =&gt; {
            if (g.match_word(s, 0, '@all')) {
                return true;
            } else {
                return !!acc;
            }
        }, false)
        // any([g.match_word(s, 0, '@all') for s in g.splitLines(p.b)])
    );
}

/**
 * Return True if p or one of p's ancestors is an @all node.
 */
public in_at_all_tree(): boolean {
    const p1: Position = this;
    for (let p of p1.self_and_parents(false)) {
        if (p.is_at_all()) {
            return true;
        }
    }
    return false;
}

</t>
<t tx="felix.20210208001026.3">/**
 * Return True if p is an @ignore node.
 */
public is_at_ignore(): boolean {
    const p: Position = this;
    return g.match_word(p.h, 0, '@ignore');
}

/**
 * Return True if p or one of p's ancestors is an @ignore node
 */
public in_at_ignore_tree(): boolean {
    const p1: Position = this;
    for (let p of p1.self_and_parents(false)) {
        if (g.match_word(p.h, 0, '@ignore')) {
            return true;
        }
    }
    return false;
}

</t>
<t tx="felix.20210211222711.1">/**
 *
  This global function calls a hook routine. Hooks are identified by the
    tag param.

    Returns the value returned by the hook routine, or None if the there is
    an exception.

    We look for a hook routine in three places:
    1. c.hookFunction
    2. app.hookFunction
    3. leoPlugins.doPlugins()

    Set app.hookError on all exceptions.
    Scripts may reset app.hookError to try again.
 */
export function doHook(tag: string, ...args: any[]): any {
    /*
        if g.app.killed or g.app.hookError:
            return None
        if args:
            # A minor error in Leo's core.
            g.pr(f"***ignoring args param.  tag = {tag}")
        if not g.app.config.use_plugins:
            if tag in ('open0', 'start1'):
                g.warning("Plugins disabled: use_plugins is 0 in a leoSettings.leo file.")
            return None
        # Get the hook handler function.  Usually this is doPlugins.
        c = keywords.get("c")
        # pylint: disable=consider-using-ternary
        f = (c and c.hookFunction) or g.app.hookFunction
        if not f:
            g.app.hookFunction = f = g.app.pluginsController.doPlugins
        try:
            # Pass the hook to the hook handler.
            # g.pr('doHook',f.__name__,keywords.get('c'))
            return f(tag, keywords)
        except Exception:
            g.es_exception()
            g.app.hookError = True  # Supress this function.
            g.app.idle_time_hooks_enabled = False
            return None
    */
}

</t>
<t tx="felix.20210211234142.1">/**
 * Set the p's headline and the corresponding tree widget to s.
 * This is used in by unit tests to restore the outline.
 */
public setHeadString(p: Position, s: string): void {
    const c: Commands = this;
    p.initHeadString(s);
    p.setDirty();
    // Change the actual tree widget so
    // A later call to c.endEditing or c.redraw will use s.

    // TODO: needed?
    // c.frame.tree.setHeadline(p, s);
}

</t>
<t tx="felix.20210211234504.1">/**
 * Return the expansion of the selected text of node p.
 * Return the expansion of all of node p's body text if
 * p is not the current node or if there is no text selection.
 */
export function getScript(c: Commands, p: Position,
    useSelectedText: boolean = true,
    forcePythonSentinels: boolean = true,
    useSentinels: boolean = true
): string {
    console.log("get script called");
    return "";
}

</t>
<t tx="felix.20210215185050.1">// These methods are a fundamental, unchanging, part of Leo's API.

</t>
<t tx="felix.20210215204131.1">/**
  *Move to the last visible node of the present chapter or hoist.
 */
public lastVisible(): Position {
    const c: Commands = this;
    let p: Position = c.p;
    while (1) {
        const next: Position = p.visNext(c);
        if (next &amp;&amp; next.__bool__() &amp;&amp; next.isVisible(c)) {
            p = next;
        } else {
            break;
        }
    }
    return p;
}

</t>
<t tx="felix.20210215204308.1">/**
 * Given a VNode v, find all valid positions p such that p.v = v.
 * Not really all, just all for each of v's distinct immediate parents.
 */
public vnode2allPositions(v: VNode): Position[] {
    const c: Commands = this;
    const context: Commands = v.context;  // v's commander.
    // console.assert(c.fileName === context.fileName);
    const positions: Position[] = [];
    let n: number;
    for (let immediate of v.parents) {
        if (immediate.children.includes(v)) {
            n = immediate.children.indexOf(v);
        } else {
            continue;
        }
        const stack: StackEntry[] = [[v, n]];
        let isBreak: boolean = false;
        while (immediate.parents.length) {
            const parent: VNode = immediate.parents[0];
            if (parent.children.includes(immediate)) {
                n = parent.children.indexOf(immediate);
            } else {
                isBreak = true;
                break;
            }
            stack.unshift([immediate, n]);
            immediate = parent;
        }
        if (!immediate.parents.length &amp;&amp; !isBreak) {
            [v, n] = stack.pop()!;
            const p: Position = new Position(v, n, stack);
            positions.push(p);
        }
    }
    return positions;
}

</t>
<t tx="felix.20210215204322.1">/**
 * Given a VNode v, construct a valid position p such that p.v = v.
 */
public vnode2position(v: VNode): Position | undefined {
    const c: Commands = this;
    const context: Commands = v.context;  // v's commander.
    // console.assert(c.fileName === context.fileName);
    const stack: StackEntry[] = [];
    let n: number;
    while (v.parents.length) {
        const parent: VNode = v.parents[0];

        if (parent.children.includes(v)) {
            n = parent.children.indexOf(v);
        } else {
            return undefined;
        }
        stack.unshift([v, n]);
        v = parent;
    }
    // v.parents includes the hidden root node.
    if (!stack.length) {
        // a VNode not in the tree
        return undefined;
    }
    [v, n] = stack.pop()!;
    const p: Position = new Position(v, n, stack);
    return p;
}

</t>
<t tx="felix.20210215204844.1">public setMarked(p: Position): void {
    const c: Commands = this;
    p.setMarked();
    p.setDirty();  // Defensive programming.
    g.doHook("set-mark", c, p);
}

</t>
<t tx="felix.20210215204937.1">/**
 * Return the root position.
 */
public topPosition(): Position | undefined {
    const c: Commands = this;
    if (c._topPosition &amp;&amp; c._topPosition.__bool__()) {
        return c._topPosition.copy();
    }
    return undefined;
}

/**
 * Set the root position.
 */
public setTopPosition(p: Position): void {
    const c: Commands = this;
    if (p &amp;&amp; p.__bool__()) {
        c._topPosition = p.copy();
    }
    else {
        c._topPosition = undefined;
    }
}

// Define these for compatibility with old scripts...

// topVnode = topPosition
// setTopVnode = setTopPosition

</t>
<t tx="felix.20210218214329.12">/**
 * Update self.timeString and self.lastIndex
 */
public update(): string {
    const t_s: string = new Date().format("YYYYMMDDhhmmss");
    if (this.timeString === t_s) {
        this.lastIndex += 1;
    } else {
        this.lastIndex = 1;
        this.timeString = t_s;
    }
    return t_s;
}

</t>
<t tx="felix.20210218214329.6">// These are used by the FileCommands read/write code.

/**
 * Return the id to be used by default in all gnx's
 */
public getDefaultId(): string {
    return this.defaultId;
}

/**
 * Set the id to be used by default in all gnx's
 */
public setDefaultId(theId: string): void {
    this.defaultId = theId;
}
</t>
<t tx="felix.20210218214329.7">/**
 * Create a new gnx for v or an empty string if the hold flag is set.
 * **Important**: the method must allocate a new gnx even if v.fileIndex exists.
 */
public getNewIndex(v: VNode | undefined, cached: Boolean = false): string {
    if (!v) {
        console.log('getNewIndex: v is None');
        return '';
    }
    const c: Commands = v.context;
    const fc: any = c.fileCommands;
    const t_s: string = this.update();
    // Updates self.lastTime and self.lastIndex.
    const gnx: string = g.toUnicode(`${this.userId}.${t_s}.${this.lastIndex}`);
    v.fileIndex = gnx;
    this.check_gnx(c, gnx, v);
    fc.gnxDict[gnx] = v;
    return gnx;
}

</t>
<t tx="felix.20210218214329.8">/**
 * Handle all gnx-related tasks for VNode.__init__.
 */
public new_vnode_helper(c: Commands, gnx: string | undefined, v: VNode): void {
    const ni: NodeIndices = this;
    if (gnx) {
        v.fileIndex = gnx;
        ni.check_gnx(c, gnx, v);
        c.fileCommands.gnxDict[gnx] = v;
    } else {
        v.fileIndex = ni.getNewIndex(v);
    }
}

</t>
<t tx="felix.20210220181245.1">&lt;&lt; imports &gt;&gt;
@others
@language typescript
@tabwidth -4

</t>
<t tx="felix.20210220190156.1">export class FileCommands {

    public c: Commands;
    public gnxDict: { [key: string]: VNode; };

    @others

}

</t>
<t tx="felix.20210220194059.1">import { FileCommands } from "./leoFileCommands";
import { Position, VNode, StackEntry } from "./leoNodes";
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';

</t>
<t tx="felix.20210220195150.1">import { VNode } from "./leoNodes";
import { Commands } from "./leoCommands";
import * as fs from 'fs';

</t>
<t tx="felix.20210220200109.1">constructor(c: Commands) {
    this.c = c;
    this.gnxDict = {};
}

</t>
<t tx="felix.20210221010822.1">/**
 * Get g.app.leoID from various sources.
 */
public setLeoID(useDialog: boolean = true, verbose: boolean = true): string {
    this.leoID = "";

    // tslint:disable-next-line: strict-comparisons
    console.assert(this === g.app);

    verbose = verbose &amp;&amp; !g.unitTesting &amp;&amp; !this.silentMode;

    this.leoID = this.cleanLeoID(os.userInfo().username, 'os.userInfo().username');

    return this.leoID;
    // table = (self.setIDFromSys, self.setIDFromFile, self.setIDFromEnv,)
    // for func in table:
    // func(verbose)
    // if self.leoID:
    // return self.leoID
    // if useDialog:
    // self.setIdFromDialog()
    // if self.leoID:
    // self.setIDFile()
    // return self.leoID
}

</t>
<t tx="felix.20210221010822.2">/**
 * #1404: Make sure that the given Leo ID will not corrupt a .leo file.
 */
public cleanLeoID(id_: string, tag: string): string {
    const old_id: string = id_.toString();
    try {
        id_ = id_.replace(/\./g, "").replace(/\,/g, "").replace(/\"/g, "").replace(/\'/g, "");
        //  Remove *all* whitespace: https://stackoverflow.com/questions/3739909
        id_ = id_.split(' ').join('');
    }
    catch (exception) {
        g.es_exception();
        id_ = '';
    }
    if (id_.length &lt; 3) {
        throw new Error("unknownAttributes ValueError");
        // TODO: Show Leo Id syntax error message
        // g.EmergencyDialog(
        //   title=f"Invalid Leo ID: {tag}",
        //    message=(
        //        f"Invalid Leo ID: {old_id!r}\n\n"
        //       "Your id should contain only letters and numbers\n"
        //        "and must be at least 3 characters in length."))
    }
    return id_;
}

</t>
<t tx="felix.20210222013344.1">/**
 * Create an empty file if the external fn is empty.
 *
 * Otherwise, create an @edit or @file node for the external file.
 */
public initWrapperLeoFile(c: Commands, fn: string): Commands {
    // lm = self
    // Use the config params to set the size and location of the window.

    // frame = c.frame
    // frame.setInitialWindowGeometry()
    // frame.deiconify()
    // frame.lift()

    // #1570: Resize the _new_ frame.
    // frame.splitVerticalFlag, r1, r2 = frame.initialRatios()
    // frame.resizePanesToRatio(r1, r2)

    /*
    if not g.os_path_exists(fn):
        p = c.rootPosition()
        // Create an empty @edit node unless fn is an .leo file.
        // Fix #1070: Use "newHeadline", not fn.
        p.h = "newHeadline" if fn.endswith('.leo') else f"@edit {fn}"
        c.selectPosition(p)
    elif c.looksLikeDerivedFile(fn):
        // 2011/10/10: Create an @file node.
        p = c.importCommands.importDerivedFiles(parent=c.rootPosition(),
            paths=[fn], command=None)  # Not undoable.
        if p and p.hasBack():
            p.back().doDelete()
            p = c.rootPosition()
        if not p: return None
    else:
        // Create an @&lt;file&gt; node.
        p = c.rootPosition()
        if p:
            load_type = self.options['load_type']
            p.setHeadString(f"{load_type} {fn}")
            c.refreshFromDisk()
            c.selectPosition(p)

    // Fix critical bug 1184855: data loss with command line 'leo somefile.ext'
    // Fix smallish bug 1226816 Command line "leo xxx.leo" creates file xxx.leo.leo.
    c.mFileName = fn if fn.endswith('.leo') else f"{fn}.leo"
    c.wrappedFileName = fn
    c.frame.title = c.computeWindowTitle(c.mFileName)
    c.frame.setTitle(c.frame.title)
    // chapterController.finishCreate must be called after the first real redraw
    // because it requires a valid value for c.rootPosition().
    if c.config.getBool('use-chapters') and c.chapterController:
        c.chapterController.finishCreate()
    frame.c.clearChanged()
        // Mark the outline clean.
        // This makes it easy to open non-Leo files for quick study.
    return c;
    */
    return c;
}

</t>
<t tx="felix.20210222013445.1">public openLeoOrZipFile(fn: string): any {
    const lm: LoadManager = this;
    if (fn.endsWith('.db')) {
        // return sqlite3.connect(fn)
        return undefined;
    }
    let theFile: any;
    // zipped = lm.isZippedFile(fn)

    // TODO
    // if(!!fn &amp;&amp; fn.endsWith('.leo') &amp;&amp; g.os_path_exists(fn)){
    // theFile = lm.openLeoFile(fn);
    // }else{
    // theFile = undefined;
    // }
    return theFile;
}

</t>
<t tx="felix.20210223002937.1">constructor(
    fileName: string,
    gui?: LeoUI,
    previousSettings?: any,
    relativeFileName?: any
) {
    this.mFileName = fileName;
    this.gui = gui || g.app.gui!;
    this.fileCommands = new FileCommands(this); // c.fileCommands = DummyFileCommands()
    this.hiddenRootNode = new VNode(this, 'hidden-root-vnode-gnx');
    this.hiddenRootNode.h = '&lt;hidden root vnode&gt;';
    this.fileCommands.gnxDict = {}; // RESET gnxDict
}

</t>
<t tx="felix.20210223220756.1"></t>
<t tx="felix.20210223220814.10">//Init the settings *before* initing the objects.
// c = self
// from leo.core import leoConfig
public config: any = {}; // TODO
// c.config = leoConfig.LocalConfigManager(c, previousSettings)
// g.app.config.setIvarsFromSettings(c)

</t>
<t tx="felix.20210223220814.2">// Init ivars used while executing a command.
public commandsDict: { [key: string]: (p: any) =&gt; any } = {}; // Keys are command names, values are functions.
public disableCommandsMessage: string = ''; // The presence of this message disables all commands.
public hookFunction: any = undefined; // One of three places that g.doHook looks for hook functions.

public ignoreChangedPaths = false; // True: disable path changed message in at.WriteAllHelper.
public inCommand: boolean = false; // Interlocks to prevent premature closing of a window.
public isZipped: boolean = false; // Set by g.openWithFileName.
public outlineToNowebDefaultFileName: string = "noweb.nw"; // For Outline To Noweb dialog.

// For tangle/untangle
public tangle_errors: number = 0;
// Default Tangle options
public use_header_flag: boolean = false;
public output_doc_flag: boolean = false;
// For hoist/dehoist commands.
public hoistStack: HoistStackEntry[] = []; // Stack of nodes to be root of drawn tree.
// For outline navigation.
public navPrefix: string = ''; // Must always be a string.
public navTime: any = undefined;

public sqlite_connection: any = undefined;

</t>
<t tx="felix.20210223220814.3">// Init Commander debugging ivars.
public command_count: number = 0;
public scanAtPathDirectivesCount: number = 0;
public trace_focus_count: number = 0;

</t>
<t tx="felix.20210223220814.4">// Init per-document ivars.
public expansionLevel: number = 0; // The expansion level of this outline.
public expansionNode: Position | undefined = undefined; // The last node we expanded or contracted.
public nodeConflictList: VNode[] = []; // List of nodes with conflicting read-time data.
public nodeConflictFileName: string | undefined = undefined; // The fileName for c.nodeConflictList.
public user_dict = {}; // Non-persistent dictionary for free use by scripts and plugins.

</t>
<t tx="felix.20210223220814.5">// Init ivars relating to gui events.
public configInited = false;
public doubleClickFlag = false;
public exists = true; // Indicate that this class exists and has not been destroyed.

public in_qt_dialog = false; // True: in a qt dialog.
public loading = false; // True: we are loading a file: disables c.setChanged()
public promptingForClose = false; // True: lock out additional closing dialogs.
public suppressHeadChanged = false; // True: prevent setting c.changed when switching chapters.
// Flags for c.outerUpdate...
public enableRedrawFlag = true;
public requestCloseWindow = false;
public requestedFocusWidget = undefined;
public requestLaterRedraw = false;

</t>
<t tx="felix.20210223220814.6">// Init file-related ivars of the commander.
public changed = false; // True: the ouline has changed since the last save.
public ignored_at_file_nodes: string[] = []; // (headers)
public import_error_nodes: string[] = []; // List of nodes for c.raise_error_dialogs. (headers)
public last_dir: string | undefined = undefined; // The last used directory.
public mFileName: string = ''; // Do _not_ use os_path_norm: it converts an empty path to '.' (!!)
public mRelativeFileName: string = '';
public openDirectory: string | undefined = undefined;
public orphan_at_file_nodes: string[] = []; // List of orphaned nodes for c.raise_error_dialogs. (headers)
public wrappedFileName: string | undefined = undefined; // The name of the wrapped file, for wrapper commanders, set by LM.initWrapperLeoFile

</t>
<t tx="felix.20210223220814.7">// Init Commander ivars corresponding to user options.
public fixed: boolean = false;
public fixedWindowPosition = [];
public forceExecuteEntireBody: boolean = false;
public focus_border_color: string = 'white';
public focus_border_width: number = 1;  // pixels;
public outlineHasInitialFocus: boolean = false;
public page_width: number = 132;
public sparse_find: boolean = true;
public sparse_move: boolean = true;
public sparse_spell: boolean = true;
public stayInTreeAfterSelect: boolean = false;
public tab_width: number = -4;
public tangle_batch_flag: boolean = false;
public target_language: string = "python"; // TODO : switch to js for Leojs?
public untangle_batch_flag: boolean = false;
// # self.use_body_focus_border = True
// # self.use_focus_border = False
// # Replaced by style-sheet entries.
public vim_mode: boolean = false;

</t>
<t tx="felix.20210223220814.8">// These ivars are set later by leoEditCommands.createEditCommanders
public abbrevCommands: any = undefined;
public editCommands: any = undefined;
public db: any = {};  // May be set to a PickleShare instance later.
public bufferCommands: any = undefined;
public chapterCommands: any = undefined;
public controlCommands: any = undefined;
public convertCommands: any = undefined;
public debugCommands: any = undefined;
public editFileCommands: any = undefined;
public evalController: any = undefined;
public gotoCommands: any = undefined;
public helpCommands: any = undefined;
public keyHandler: any = undefined; // TODO same as k
public k: any = undefined; // TODO same as keyHandler
public keyHandlerCommands: any = undefined;
public killBufferCommands: any = undefined;
public leoCommands: any = undefined;
public macroCommands: any = undefined;
public miniBufferWidget: any = undefined;
public printingController: any = undefined;
public queryReplaceCommands: any = undefined;
public rectangleCommands: any = undefined;
public searchCommands: any = undefined;
public spellCommands: any = undefined;
public leoTestManager: any = undefined;
public vimCommands: any = undefined;

</t>
<t tx="felix.20210223220814.9">// * initObjects done in constructor.
// * Kept here as comments for reference

// c = self
// gnx = 'hidden-root-vnode-gnx'
// assert not hasattr(c, 'fileCommands'), c.fileCommands

// class DummyFileCommands:
// def __init__(self):
// self.gnxDict = {}

// c.fileCommands = DummyFileCommands()
// self.hiddenRootNode = leoNodes.VNode(context=c, gnx=gnx)
// self.hiddenRootNode.h = '&lt;hidden root vnode&gt;'
// c.fileCommands = None
// # Create the gui frame.
// title = c.computeWindowTitle(c.mFileName)
// if not g.app.initing:
// g.doHook("before-create-leo-frame", c=c)
// self.frame = gui.createLeoFrame(c, title)
// assert self.frame
// assert self.frame.c == c
// from leo.core import leoHistory
// self.nodeHistory = leoHistory.NodeHistory(c)
// self.initConfigSettings()
// c.setWindowPosition() # Do this after initing settings.
// # Break circular import dependencies by doing imports here.
// # These imports take almost 3/4 sec in the leoBridge.
// from leo.core import leoAtFile
// from leo.core import leoBeautify  # So decorators are executed.
// assert leoBeautify  # for pyflakes.
// from leo.core import leoChapters
// # from leo.core import leoTest2  # So decorators are executed.
// # assert leoTest2  # For pyflakes.
// # User commands...
// from leo.commands import abbrevCommands
// from leo.commands import bufferCommands
// from leo.commands import checkerCommands
// assert checkerCommands
// # To suppress a pyflakes warning.
// # The import *is* required to define commands.
// from leo.commands import controlCommands
// from leo.commands import convertCommands
// from leo.commands import debugCommands
// from leo.commands import editCommands
// from leo.commands import editFileCommands
// from leo.commands import gotoCommands
// from leo.commands import helpCommands
// from leo.commands import keyCommands
// from leo.commands import killBufferCommands
// from leo.commands import rectangleCommands
// from leo.commands import spellCommands
// # Import files to execute @g.commander_command decorators
// from leo.core import leoCompare
// assert leoCompare
// from leo.core import leoDebugger
// assert leoDebugger
// from leo.commands import commanderEditCommands
// assert commanderEditCommands
// from leo.commands import commanderFileCommands
// assert commanderFileCommands
// from leo.commands import commanderFindCommands
// assert commanderFindCommands
// from leo.commands import commanderHelpCommands
// assert commanderHelpCommands
// from leo.commands import commanderOutlineCommands
// assert commanderOutlineCommands
// # Other subcommanders.
// from leo.core import leoFind # Leo 4.11.1
// from leo.core import leoKeys
// from leo.core import leoFileCommands
// from leo.core import leoImport
// from leo.core import leoMarkup
// from leo.core import leoPersistence
// from leo.core import leoPrinting
// from leo.core import leoRst
// from leo.core import leoShadow
// from leo.core import leoTangle
// from leo.core import leoTest
// from leo.core import leoUndo
// from leo.core import leoVim
// # Define the subcommanders.
// self.keyHandler = self.k    = leoKeys.KeyHandlerClass(c)
// self.chapterController      = leoChapters.ChapterController(c)
// self.shadowController       = leoShadow.ShadowController(c)
// self.fileCommands           = leoFileCommands.FileCommands(c)
// self.findCommands           = leoFind.LeoFind(c)
// self.atFileCommands         = leoAtFile.AtFile(c)
// self.importCommands         = leoImport.LeoImportCommands(c)
// self.markupCommands         = leoMarkup.MarkupCommands(c)
// self.persistenceController  = leoPersistence.PersistenceDataController(c)
// self.printingController     = leoPrinting.PrintingController(c)
// self.rstCommands            = leoRst.RstCommands(c)
// self.tangleCommands         = leoTangle.TangleCommands(c)
// self.testManager            = leoTest.TestManager(c)
// self.vimCommands            = leoVim.VimCommands(c)
// # User commands
// self.abbrevCommands     = abbrevCommands.AbbrevCommandsClass(c)
// self.bufferCommands     = bufferCommands.BufferCommandsClass(c)
// self.controlCommands    = controlCommands.ControlCommandsClass(c)
// self.convertCommands    = convertCommands.ConvertCommandsClass(c)
// self.debugCommands      = debugCommands.DebugCommandsClass(c)
// self.editCommands       = editCommands.EditCommandsClass(c)
// self.editFileCommands   = editFileCommands.EditFileCommandsClass(c)
// self.gotoCommands       = gotoCommands.GoToCommands(c)
// self.helpCommands       = helpCommands.HelpCommandsClass(c)
// self.keyHandlerCommands = keyCommands.KeyHandlerCommandsClass(c)
// self.killBufferCommands = killBufferCommands.KillBufferCommandsClass(c)
// self.rectangleCommands  = rectangleCommands.RectangleCommandsClass(c)
// self.spellCommands      = spellCommands.SpellCommandsClass(c)
// self.undoer             = leoUndo.Undoer(c)
// # Create the list of subcommanders.
// self.subCommanders = [
// self.abbrevCommands,
// self.atFileCommands,
// self.bufferCommands,
// self.chapterController,
// self.controlCommands,
// self.convertCommands,
// self.debugCommands,
// self.editCommands,
// self.editFileCommands,
// self.fileCommands,
// self.findCommands,
// self.gotoCommands,
// self.helpCommands,
// self.importCommands,
// self.keyHandler,
// self.keyHandlerCommands,
// self.killBufferCommands,
// self.persistenceController,
// self.printingController,
// self.rectangleCommands,
// self.rstCommands,
// self.shadowController,
// self.spellCommands,
// self.tangleCommands,
// self.testManager,
// self.vimCommands,
// self.undoer,
// ]
// # Other objects
// c.configurables = c.subCommanders[:]
// # A list of other classes that have a reloadSettings method
// c.db = g.app.commander_cacher.get_wrapper(c)
// from leo.plugins import free_layout
// self.free_layout = free_layout.FreeLayoutController(c)
// if hasattr(g.app.gui, 'styleSheetManagerClass'):
// self.styleSheetManager = g.app.gui.styleSheetManagerClass(c)
// self.subCommanders.append(self.styleSheetManager)
// else:
// self.styleSheetManager = None
</t>
<t tx="felix.20210224000242.1">export interface HoistStackEntry {
    p: Position;
    expanded: boolean;
}

</t>
<t tx="felix.20210226202618.1">/**
 * * experiment
 */
export function experiment(): void {
    // fs.readFileSync('foo.txt','utf8');
    console.log("test");
}
</t>
<t tx="felix.20210226224637.1">/**
 * Read a .leo file.
 * The caller should follow this with a call to c.redraw().
 */
public getLeoFile(
    // theFile:FileHandle,
    fileName: string,
    readAtFileNodesFlag=true,
    silent=false,
    checkOpenFiles=true,
):VNode {
    const fc:FileCommands = this;
    const c:Commander = this.c;
    t1 = time.time();
    c.clearChanged();  // May be set when reading @file nodes.
    fc.warnOnReadOnlyFiles(fileName);
    fc.checking = false;
    fc.mFileName = c.mFileName;
    fc.initReadIvars();
    recoveryNode = undefined;
    try:
        c.loading = True  // disable c.changed
        if not silent and checkOpenFiles:
            // Don't check for open file when reverting.
            g.app.checkForOpenFile(c, fileName)
        //
        // Read the .leo file and create the outline.
        if fileName.endswith('.db'):
            v = fc.retrieveVnodesFromDb(theFile) || fc.initNewDb(theFile);
        else:
            v = FastRead(c, self.gnxDict).readFile(theFile, fileName);
            if v:
                c.hiddenRootNode = v;
        if v:
            fc.resolveTnodeLists()
                // Do this before reading external files.
            c.setFileTimeStamp(fileName)
            if readAtFileNodesFlag:
                // c.redraw()
                    // Does not work.
                    // Redraw before reading the @file nodes so the screen isn't blank.
                    // This is important for big files like LeoPy.leo.
                recoveryNode = fc.readExternalFiles(fileName)
    finally:
        p = recoveryNode or c.p or c.lastTopLevel()
            // lastTopLevel is a better fallback, imo.
        c.selectPosition(p)
        c.redraw_later()
            // Delay the second redraw until idle time.
            // This causes a slight flash, but corrects a hangnail.
        c.checkOutline()
            // Must be called *after* ni.end_holding.
        c.loading = False
            // reenable c.changed
        if not isinstance(theFile, sqlite3.Connection):
            theFile.close()
            // Fix bug https://bugs.launchpad.net/leo-editor/+bug/1208942
            // Leo holding directory/file handles after file close?
    if c.changed:
        fc.propegateDirtyNodes();
    fc.initReadIvars();
    t2 = time.time();
    g.es(f"read outline in {t2 - t1:2.2f} seconds");
    return v;
}

</t>
<t tx="felix.20210226224637.2">public handleNodeConflicts():Position {
    """Create a 'Recovered Nodes' node for each entry in c.nodeConflictList."""
    const c:Commander = this.c;
    if not c.nodeConflictList:
        return None
    if not c.make_node_conflicts_node:
        s = f"suppressed {len(c.nodeConflictList)} node conflicts"
        g.es(s, color='red')
        g.pr('\n' + s + '\n')
        return None
    // Create the 'Recovered Nodes' node.
    const last:position = c.lastTopLevel();
    const root:position = last.insertAfter();
    root.setHeadString('Recovered Nodes')
    root.expand();
    // For each conflict, create one child and two grandchildren.
    for bunch in c.nodeConflictList:
        tag = bunch.get('tag') or ''
        gnx = bunch.get('gnx') or ''
        fn = bunch.get('fileName') or ''
        b1, h1 = bunch.get('b_old'), bunch.get('h_old')
        b2, h2 = bunch.get('b_new'), bunch.get('h_new')
        root_v = bunch.get('root_v') or ''
        child = root.insertAsLastChild()
        h = f'Recovered node "{h1}" from {g.shortFileName(fn)}'
        child.setHeadString(h)
        if b1 == b2:
            lines = [
                'Headline changed...',
                f"{tag} gnx: {gnx} root: {(root_v and root.v)!r}",
                f"old headline: {h1}",
                f"new headline: {h2}",
            ]
            child.setBodyString('\n'.join(lines))
        else:
            line1 = f"{tag} gnx: {gnx} root: {root_v and root.v!r}\nDiff...\n"
            d = difflib.Differ().compare(g.splitLines(b1), g.splitLines(b2))
                # 2017/06/19: reverse comparison order.
            diffLines = [z for z in d]
            lines = [line1]
            lines.extend(diffLines)
            # There is less need to show trailing newlines because
            # we don't report changes involving only trailing newlines.
            child.setBodyString(''.join(lines))
            n1 = child.insertAsNthChild(0)
            n2 = child.insertAsNthChild(1)
            n1.setHeadString('old:' + h1)
            n1.setBodyString(b1)
            n2.setHeadString('new:' + h2)
            n2.setBodyString(b2)
    return root;
}

</t>
<t tx="felix.20210226224637.3">public propegateDirtyNodes():{
    const fc:FileCommands = this;
    const c:Commander = this.c;
    const aList:Position[] = c.all_positions().filter(p =&gt; p.isDirty());
    for(let p of aList){
        p.setAllAncestorAtFileNodesDirty();
    }
}

</t>
<t tx="felix.20210226224637.4">/**
 * Read all external files.
 */
public readExternalFiles(fileName):Position {
    const fc:FileCommands = this;
    const c:Commander = this.c;
    c.atFileCommands.readAll(c.rootPosition(), false);
    const recoveryNode:Position = fc.handleNodeConflicts();
    // Do this after reading external files.
    // The descendent nodes won't exist unless we have read
    // the @thin nodes!
    fc.restoreDescendentAttributes();
    fc.setPositionsFromVnodes();
    return recoveryNode;
}

</t>
<t tx="felix.20210226224637.5">public warnOnReadOnlyFiles(fileName:string):void {
    // os.access may not exist on all platforms.
    try{
    // TODO: convert to typescript
        // self.read_only = not os.access(fileName, os.W_OK);
    }
    except(exeption){
        self.read_only = false;
    }
    if( this.read_only &amp;&amp; !g.unitTesting){
        g.error("read only:", fileName);
    }
}

</t>
<t tx="felix.20210226224644.1"></t>
<t tx="felix.20210228004000.1">/**
 * Return all root children P nodes
 */
public *all_Root_Children(copy = true): Generator&lt;Position&gt; {
    const c: Commands = this;
    const p: Position | undefined = c.rootPosition(); // Make one copy.
    while (p &amp;&amp; p.__bool__()) {
        yield (copy ? p.copy() : p);
        p.moveToNext();
    }
}

</t>
<t tx="felix.20211002194716.1"></t>
<t tx="felix.20211002234840.1">/**
 * Global
 * Apply the mixins into the base class via JS at runtime
 */
function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) =&gt; {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) =&gt; {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null)
            );
        });
    });
}

</t>
<t tx="felix.20211003011145.1">/**
 * File Commands Test
 */
public fileCommandsTest(): void {
    // Test command
    console.log('fileCommandsTest');
}

</t>
<t tx="felix.20211003013517.1">private initObject() {

    const c: Commands = this;
    const gnx: string = 'hidden-root-vnode-gnx';

}

</t>
<t tx="felix.20211003223641.1">/**
 * * Builds a unique Id from gnx and stack, plus collapsed state,
 * for vscode to distinguish the collapsed state.
 */
public buildId(p_position: Position, p_collapsed: number): string {
    // concatenate gnx, stacks gnx's, and collapsible state number.
    // (vscode uses id for collapsible state)
    let w_stringId = this._treeId.toString() +
        p_position.v.gnx + p_position.childIndex().toString() +
        p_position.stack.map(p_stackEntry =&gt; p_stackEntry[0].gnx + p_stackEntry[1].toString()).join("") +
        p_collapsed.toString(); // Added Uniqueness:  VSCode's collapsible state linked to id

    return w_stringId;
}

</t>
<t tx="felix.20211003233639.1">public incTreeId(): void {
    this._treeId++;
}

</t>
<t tx="felix.20211005023225.1"></t>
<t tx="felix.20211005023421.1"></t>
<t tx="felix.20211005023456.1">/**
 * Select a new position, redrawing the screen *only* if we must
 * change chapters.
 */
public selectPosition(p: Position): void {

    const trace = true; // For # 2167.
    const c: Commands = this;
    // const cc = c.chapterController;

    if (!p || !p.__bool__()) {
        if (!g.app.batchMode) { // A serious error.
            g.trace('Warning: no p', g.callers());
        }
    }

    // if(cc &amp;&amp; !cc.selectChapterLockout){
    //     cc.selectChapterForPosition(p)
    //     // Calls c.redraw only if the chapter changes.
    // }

    // De-hoist as necessary to make p visible.
    if (c.hoistStack) {
        while (c.hoistStack.length) {
            let bunch = c.hoistStack[c.hoistStack.length - 1];
            if (c.positionExists(p, bunch.p)) {
                break;
            } else {
                if (trace) {
                    console.log('trace in selectPosition');

                    // TODO
                    // command_name = c.command_name if c.inCommand else 'None'
                    // print('')
                    // print('pop hoist stack! callers:', g.callers())
                    // g.printObj(c.hoistStack, tag='c.hoistStack before pop')
                    // print(f"c.command_name: {command_name}")
                    // print('lossage')
                    // for i, data in enumerate(reversed(g.app.lossage)):
                    //     print(f"{i:&gt;2} {data!r}")
                }
                bunch = c.hoistStack.pop()!;
            }
        }
    }

    c.setCurrentPosition(p);

    // Compatibility, but confusing.
    // TODO : Is this needed?
    // selectVnode = selectPosition

}

</t>
<t tx="felix.20211005023800.1"></t>
<t tx="felix.20211005023821.1">/**
 * Contract all nodes in the outline.
 */
public contractAllHeadlines(): void {
    //

    /*
        c = self
    for p in c.all_positions():
        p.contract()
    # Select the topmost ancestor of the presently selected node.
    p = c.p
    while p and p.hasParent():
        p.moveToParent()
    if redrawFlag:
        # Do a *full* redraw.
        # c.redraw_after_contract(p) only contracts a single position.
        c.redraw(p)
    c.expansionLevel = 1  # Reset expansion level.
*/
}

</t>
<t tx="felix.20211005023931.1">/*
def contractSubtree(self, p):
    for p in p.subtree():
        p.contract()
*/

</t>
<t tx="felix.20211005024008.1">/*
def expandSubtree(self, v, redraw=True):
    c = self
    last = v.lastNode()
    while v and v != last:
        v.expand()
        v = v.threadNext()
    if redraw:
        c.redraw()

*/

</t>
<t tx="felix.20211005024009.1">/*
def expandToLevel(self, level):

    c = self
    n = c.p.level()
    old_expansion_level = c.expansionLevel
    max_level = 0
    for p in c.p.self_and_subtree(copy=False):
        if p.level() - n + 1 &lt; level:
            p.expand()
            max_level = max(max_level, p.level() - n + 1)
        else:
            p.contract()
    c.expansionNode = c.p.copy()
    c.expansionLevel = max_level + 1
    if c.expansionLevel != old_expansion_level:
        c.redraw()
    # It's always useful to announce the level.
    # c.k.setLabelBlue('level: %s' % (max_level+1))
    # g.es('level', max_level + 1)
    c.frame.putStatusLine(f"level: {max_level + 1}")
        # bg='red', fg='red')

*/

</t>
<t tx="felix.20211006225245.1">"configuration": {
  "title": "Leojs",
  "properties": {
    "leojs.checkForChangeExternalFiles": {
      "scope": "application",
      "default": "none",
      "type": "string",
      "description": "Set default for checking changes to external files",
      "enum": [
        "none",
        "force-check",
        "force-ignore"
      ],
      "enumDescriptions": [
        "Default from Leo's config",
        "Check for changes",
        "Ignore all changes"
      ]
    },
    "leojs.defaultReloadIgnore": {
      "scope": "application",
      "default": "none",
      "type": "string",
      "description": "Set default for derived files to always reload, or always ignore, when changes are detected",
      "enum": [
        "none",
        "yes-all",
        "no-all"
      ],
      "enumDescriptions": [
        "Choose each time",
        "Reload All",
        "Ignore All"
      ]
    },
    "leojs.leoTreeBrowse": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Specifies whether to use Leo's style of tree browsing with the arrow keys"
    },
    "leojs.treeKeepFocus": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Specifies whether to keep focus in the outline when selecting a node - overridden by \"leoTreeBrowse\""
    },
    "leojs.treeKeepFocusWhenAside": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Specifies whether to keep focus in the outline when opening a body pane on the side"
    },
    "leojs.statusBarString": {
      "scope": "application",
      "default": "",
      "type": "string",
      "description": "Sets the message string of the Status Bar Indicator"
    },
    "leojs.statusBarColor": {
      "scope": "application",
      "default": "fb7c47",
      "type": "string",
      "description": "Specifies the hexadecimal color string for the Status Bar Indicator"
    },
    "leojs.treeInExplorer": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Show the outline tree in the explorer view"
    },
    "leojs.showOpenAside": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Offer 'Open to the Side' in nodes context menu"
    },
    "leojs.showEditOnNodes": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows 'Edit Headline' button on tree nodes"
    },
    "leojs.showArrowsOnNodes": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Shows 'Move Node' arrow buttons on tree nodes"
    },
    "leojs.showAddOnNodes": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Shows 'Insert' button on tree nodes"
    },
    "leojs.showMarkOnNodes": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Shows 'Mark/Unmark' buttons on tree nodes"
    },
    "leojs.showCloneOnNodes": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Shows 'Clone' button on tree nodes"
    },
    "leojs.showCopyOnNodes": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Shows 'Copy' button on tree nodes"
    },
    "leojs.invertNodeContrast": {
      "scope": "application",
      "default": false,
      "type": "boolean",
      "description": "Inverts the contrast of the dirty/clean border aspect of tree nodes"
    },
    "leojs.showEditionOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows clone, delete and insert nodes above the body pane"
    },
    "leojs.showClipboardOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows cut, copy &amp; paste nodes above the body pane"
    },
    "leojs.showPromoteOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows promote and demote above the body pane"
    },
    "leojs.showExecuteOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows 'Execute Script' above the body pane"
    },
    "leojs.showExtractOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows extract commands above the body pane"
    },
    "leojs.showImportOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows 'Import File' above the body pane"
    },
    "leojs.showRefreshOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows 'Refresh from disk' above the body pane"
    },
    "leojs.showHoistOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows Hoist commands above the body pane"
    },
    "leojs.showMarkOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows Mark commands above the body pane"
    },
    "leojs.showSortOnBody": {
      "scope": "application",
      "default": true,
      "type": "boolean",
      "description": "Shows 'Sort Siblings' above the body pane"
    }
  }
},
</t>
<t tx="felix.20211007213344.1">import * as vscode from "vscode";
import * as utils from "./utils";
import { ConfigMembers, ConfigSetting, FontSettings } from "./types";
import { Constants } from "./constants";
import { LeoUI } from "./leoUI";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20211007213344.10">/**
 * * Check if the workbench.editor.enablePreview flag is set
 * @param p_forced Forces the setting instead of just suggesting with a message
 */
public checkEnablePreview(p_forced?: boolean): void {
    let w_result: any = true;
    const w_setting = vscode.workspace.getConfiguration("workbench.editor");
    if (w_setting.inspect("enablePreview")!.globalValue === undefined) {
        w_result = w_setting.inspect("enablePreview")!.defaultValue;
    } else {
        w_result = w_setting.inspect("enablePreview")!.globalValue;
    }
    if (w_result === false) {
        if (p_forced) {
            this.setEnablePreview();
            vscode.window.showInformationMessage("'Enable Preview' setting was set");
        } else {
            // if (!this._leoUI.finishedStartup) {
            //     return;
            // }
            vscode.window.showWarningMessage("'Enable Preview' setting is recommended (currently disabled)", "Fix it")
                .then(p_chosenButton =&gt; {
                    if (p_chosenButton === "Fix it") {
                        vscode.commands.executeCommand(Constants.COMMANDS.SET_ENABLE_PREVIEW);
                    }
                });
        }
    }
}

</t>
<t tx="felix.20211007213344.11">/**
 * * Check if the 'workbench.editor.closeEmptyGroups' setting is false
 * @param p_forced Forces the setting instead of just suggesting with a message
 */
public checkCloseEmptyGroups(p_forced?: boolean): void {
    let w_result: any = false;
    const w_setting = vscode.workspace.getConfiguration("workbench.editor");
    if (w_setting.inspect("closeEmptyGroups")!.globalValue === undefined) {
        w_result = w_setting.inspect("closeEmptyGroups")!.defaultValue;
    } else {
        w_result = w_setting.inspect("closeEmptyGroups")!.globalValue;
    }
    if (w_result === true) {
        if (p_forced) {
            this.clearCloseEmptyGroups();
            vscode.window.showInformationMessage("'Close Empty Groups' setting was cleared");
        } else {
            // if (!this._leoUI.finishedStartup) {
            //     return;
            // }
            vscode.window.showWarningMessage("'Close Empty Groups' setting is NOT recommended!", "Fix it")
                .then(p_chosenButton =&gt; {
                    if (p_chosenButton === "Fix it") {
                        vscode.commands.executeCommand(Constants.COMMANDS.CLEAR_CLOSE_EMPTY_GROUPS);
                    }
                });
        }
    }
}

</t>
<t tx="felix.20211007213344.12">/**
 * * Check if the workbench.editor.closeOnFileDelete flag is set
 * @param p_forced Forces the setting instead of just suggesting with a message
 */
public checkCloseOnFileDelete(p_forced?: boolean): void {
    let w_result: any = true;
    const w_setting = vscode.workspace.getConfiguration("workbench.editor");
    if (w_setting.inspect("closeOnFileDelete")!.globalValue === undefined) {
        w_result = w_setting.inspect("closeOnFileDelete")!.defaultValue;
    } else {
        w_result = w_setting.inspect("closeOnFileDelete")!.globalValue;
    }
    if (w_result === false) {
        if (p_forced) {
            this.setCloseOnFileDelete();
            vscode.window.showInformationMessage("'Close on File Delete' setting was set");

        } else {
            // if (!this._leoUI.finishedStartup) {
            //     return;
            // }
            vscode.window.showWarningMessage("'Close on File Delete' setting is recommended (currently disabled)", "Fix it")
                .then(p_chosenButton =&gt; {
                    if (p_chosenButton === "Fix it") {
                        vscode.commands.executeCommand(Constants.COMMANDS.SET_CLOSE_ON_FILE_DELETE);
                    }
                });
        }
    }
}

</t>
<t tx="felix.20211007213344.13">/**
 * * Build config from settings from vscode's saved config settings
 */
public buildFromSavedSettings(): Promise&lt;unknown&gt; {
    // Shorthand pointers for readability
    const GET = vscode.workspace.getConfiguration;
    const NAME = Constants.CONFIG_NAME;
    const NAMES = Constants.CONFIG_NAMES;
    const DEFAULTS = Constants.CONFIG_DEFAULTS;
    const FLAGS = Constants.CONTEXT_FLAGS;

    if (this._isBusySettingConfig) {
        // * Currently setting config, wait until its done all, and this will be called automatically
        return Promise.resolve();
    } else {
        this.checkForChangeExternalFiles = GET(NAME).get(NAMES.CHECK_FOR_CHANGE_EXTERNAL_FILES, DEFAULTS.CHECK_FOR_CHANGE_EXTERNAL_FILES);
        this.defaultReloadIgnore = GET(NAME).get(NAMES.DEFAULT_RELOAD_IGNORE, DEFAULTS.DEFAULT_RELOAD_IGNORE);
        this.leoTreeBrowse = GET(NAME).get(NAMES.LEO_TREE_BROWSE, DEFAULTS.LEO_TREE_BROWSE);
        this.treeKeepFocus = GET(NAME).get(NAMES.TREE_KEEP_FOCUS, DEFAULTS.TREE_KEEP_FOCUS);
        this.treeKeepFocusWhenAside = GET(NAME).get(NAMES.TREE_KEEP_FOCUS_WHEN_ASIDE, DEFAULTS.TREE_KEEP_FOCUS_WHEN_ASIDE);
        this.statusBarString = GET(NAME).get(NAMES.STATUSBAR_STRING, DEFAULTS.STATUSBAR_STRING);
        if (this.statusBarString.length &gt; 8) {
            this.statusBarString = DEFAULTS.STATUSBAR_STRING;
        }
        this.statusBarColor = GET(NAME).get(NAMES.STATUSBAR_COLOR, DEFAULTS.STATUSBAR_COLOR);
        if (!utils.isHexColor(this.statusBarColor)) {
            this.statusBarColor = DEFAULTS.STATUSBAR_COLOR;
        }
        this.treeInExplorer = GET(NAME).get(NAMES.TREE_IN_EXPLORER, DEFAULTS.TREE_IN_EXPLORER);
        this.showOpenAside = GET(NAME).get(NAMES.SHOW_OPEN_ASIDE, DEFAULTS.SHOW_OPEN_ASIDE);
        this.showEditOnNodes = GET(NAME).get(NAMES.SHOW_EDIT, DEFAULTS.SHOW_EDIT);
        this.showArrowsOnNodes = GET(NAME).get(NAMES.SHOW_ARROWS, DEFAULTS.SHOW_ARROWS);
        this.showAddOnNodes = GET(NAME).get(NAMES.SHOW_ADD, DEFAULTS.SHOW_ADD);
        this.showMarkOnNodes = GET(NAME).get(NAMES.SHOW_MARK, DEFAULTS.SHOW_MARK);
        this.showCloneOnNodes = GET(NAME).get(NAMES.SHOW_CLONE, DEFAULTS.SHOW_CLONE);
        this.showCopyOnNodes = GET(NAME).get(NAMES.SHOW_COPY, DEFAULTS.SHOW_COPY);

        this.showEditionOnBody = GET(NAME).get(NAMES.SHOW_EDITION_BODY, DEFAULTS.SHOW_EDITION_BODY);
        this.showClipboardOnBody = GET(NAME).get(NAMES.SHOW_CLIPBOARD_BODY, DEFAULTS.SHOW_CLIPBOARD_BODY);
        this.showPromoteOnBody = GET(NAME).get(NAMES.SHOW_PROMOTE_BODY, DEFAULTS.SHOW_PROMOTE_BODY);
        this.showExecuteOnBody = GET(NAME).get(NAMES.SHOW_EXECUTE_BODY, DEFAULTS.SHOW_EXECUTE_BODY);
        this.showExtractOnBody = GET(NAME).get(NAMES.SHOW_EXTRACT_BODY, DEFAULTS.SHOW_EXTRACT_BODY);
        this.showImportOnBody = GET(NAME).get(NAMES.SHOW_IMPORT_BODY, DEFAULTS.SHOW_IMPORT_BODY);
        this.showRefreshOnBody = GET(NAME).get(NAMES.SHOW_REFRESH_BODY, DEFAULTS.SHOW_REFRESH_BODY);
        this.showHoistOnBody = GET(NAME).get(NAMES.SHOW_HOIST_BODY, DEFAULTS.SHOW_HOIST_BODY);
        this.showMarkOnBody = GET(NAME).get(NAMES.SHOW_MARK_BODY, DEFAULTS.SHOW_MARK_BODY);
        this.showSortOnBody = GET(NAME).get(NAMES.SHOW_SORT_BODY, DEFAULTS.SHOW_SORT_BODY);
        this.invertNodeContrast = GET(NAME).get(NAMES.INVERT_NODES, DEFAULTS.INVERT_NODES);

        // * Set context for tree items visibility that are based on config options
        return Promise.all([
            utils.setContext(FLAGS.LEO_TREE_BROWSE, this.leoTreeBrowse),
            utils.setContext(FLAGS.TREE_IN_EXPLORER, this.treeInExplorer),
            utils.setContext(FLAGS.SHOW_OPEN_ASIDE, this.showOpenAside),
            utils.setContext(FLAGS.SHOW_EDIT, this.showEditOnNodes),
            utils.setContext(FLAGS.SHOW_ARROWS, this.showArrowsOnNodes),
            utils.setContext(FLAGS.SHOW_ADD, this.showAddOnNodes),
            utils.setContext(FLAGS.SHOW_MARK, this.showMarkOnNodes),
            utils.setContext(FLAGS.SHOW_CLONE, this.showCloneOnNodes),
            utils.setContext(FLAGS.SHOW_COPY, this.showCopyOnNodes),

            utils.setContext(FLAGS.SHOW_EDITION_BODY, this.showEditionOnBody),
            utils.setContext(FLAGS.SHOW_CLIPBOARD_BODY, this.showClipboardOnBody),
            utils.setContext(FLAGS.SHOW_PROMOTE_BODY, this.showPromoteOnBody),
            utils.setContext(FLAGS.SHOW_EXECUTE_BODY, this.showExecuteOnBody),
            utils.setContext(FLAGS.SHOW_EXTRACT_BODY, this.showExtractOnBody),
            utils.setContext(FLAGS.SHOW_IMPORT_BODY, this.showImportOnBody),
            utils.setContext(FLAGS.SHOW_REFRESH_BODY, this.showRefreshOnBody),
            utils.setContext(FLAGS.SHOW_HOIST_BODY, this.showHoistOnBody),
            utils.setContext(FLAGS.SHOW_MARK_BODY, this.showMarkOnBody),
            utils.setContext(FLAGS.SHOW_SORT_BODY, this.showSortOnBody)
        ]);
    }
}

</t>
<t tx="felix.20211007213344.2">/**
 * * Configuration Settings Service
 */
export class Config implements ConfigMembers {

    // Config settings used on Leo's side
    public checkForChangeExternalFiles: string = Constants.CONFIG_DEFAULTS.CHECK_FOR_CHANGE_EXTERNAL_FILES;
    public defaultReloadIgnore: string = Constants.CONFIG_DEFAULTS.DEFAULT_RELOAD_IGNORE;
    // Config settings used on vscode's side
    public leoTreeBrowse: boolean = Constants.CONFIG_DEFAULTS.LEO_TREE_BROWSE; // Used as Context Flag
    public treeKeepFocus: boolean = Constants.CONFIG_DEFAULTS.TREE_KEEP_FOCUS;
    public treeKeepFocusWhenAside: boolean = Constants.CONFIG_DEFAULTS.TREE_KEEP_FOCUS_WHEN_ASIDE;
    public statusBarString: string = Constants.CONFIG_DEFAULTS.STATUSBAR_STRING;
    public statusBarColor: string = Constants.CONFIG_DEFAULTS.STATUSBAR_COLOR;
    public treeInExplorer: boolean = Constants.CONFIG_DEFAULTS.TREE_IN_EXPLORER; // Used as Context Flag
    public showOpenAside: boolean = Constants.CONFIG_DEFAULTS.SHOW_OPEN_ASIDE; // Used as Context Flag
    public showEditOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_EDIT; // Used as Context Flag
    public showArrowsOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_ARROWS; // Used as Context Flag
    public showAddOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_ADD; // Used as Context Flag
    public showMarkOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_MARK; // Used as Context Flag
    public showCloneOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_CLONE; // Used as Context Flag
    public showCopyOnNodes: boolean = Constants.CONFIG_DEFAULTS.SHOW_COPY; // Used as Context Flag

    public showEditionOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_EDITION_BODY; // Used as Context Flag
    public showClipboardOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_CLIPBOARD_BODY; // Used as Context Flag
    public showPromoteOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_PROMOTE_BODY; // Used as Context Flag
    public showExecuteOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_EXECUTE_BODY; // Used as Context Flag
    public showExtractOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_EXTRACT_BODY; // Used as Context Flag
    public showImportOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_IMPORT_BODY; // Used as Context Flag
    public showRefreshOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_REFRESH_BODY; // Used as Context Flag
    public showHoistOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_HOIST_BODY; // Used as Context Flag
    public showMarkOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_MARK_BODY; // Used as Context Flag
    public showSortOnBody: boolean = Constants.CONFIG_DEFAULTS.SHOW_SORT_BODY; // Used as Context Flag

    public invertNodeContrast: boolean = Constants.CONFIG_DEFAULTS.INVERT_NODES;

    private _isBusySettingConfig: boolean = false;
    private _needsTreeRefresh: boolean = false;

    constructor(
        private _context: vscode.ExtensionContext,
        private _leoUI: LeoUI
    ) { }

    @others
}
</t>
<t tx="felix.20211007213344.3">/**
 * * Get actual 'live' Leojs configuration
 * @returns An object with config settings members such as treeKeepFocus, defaultReloadIgnore, etc.
 */
public getConfig(): ConfigMembers {
    return {
        checkForChangeExternalFiles: this.checkForChangeExternalFiles,
        defaultReloadIgnore: this.defaultReloadIgnore,
        leoTreeBrowse: this.leoTreeBrowse, // Used as Context Flag
        treeKeepFocus: this.treeKeepFocus,
        treeKeepFocusWhenAside: this.treeKeepFocusWhenAside,
        statusBarString: this.statusBarString,
        statusBarColor: this.statusBarColor,
        treeInExplorer: this.treeInExplorer, // Used as Context Flag
        showOpenAside: this.showOpenAside,  // Used as Context Flag
        showEditOnNodes: this.showEditOnNodes, // Used as Context Flag
        showArrowsOnNodes: this.showArrowsOnNodes, // Used as Context Flag
        showAddOnNodes: this.showAddOnNodes, // Used as Context Flag
        showMarkOnNodes: this.showMarkOnNodes, // Used as Context Flag
        showCloneOnNodes: this.showCloneOnNodes, // Used as Context Flag
        showCopyOnNodes: this.showCopyOnNodes, // Used as Context Flag

        showEditionOnBody: this.showEditionOnBody, // Used as Context Flag
        showClipboardOnBody: this.showClipboardOnBody, // Used as Context Flag
        showPromoteOnBody: this.showPromoteOnBody, // Used as Context Flag
        showExecuteOnBody: this.showExecuteOnBody, // Used as Context Flag
        showExtractOnBody: this.showExtractOnBody, // Used as Context Flag
        showImportOnBody: this.showImportOnBody, // Used as Context Flag
        showRefreshOnBody: this.showRefreshOnBody, // Used as Context Flag
        showHoistOnBody: this.showHoistOnBody, // Used as Context Flag
        showMarkOnBody: this.showMarkOnBody, // Used as Context Flag
        showSortOnBody: this.showSortOnBody, // Used as Context Flag

        invertNodeContrast: this.invertNodeContrast,
    };
}

</t>
<t tx="felix.20211007213344.4">/**
 * * Get config from vscode for the UI font sizes
 * @returns the font settings object (zoom level and editor font size)
 */
public getFontConfig(): FontSettings {
    let w_zoomLevel = vscode.workspace.getConfiguration(
        "window"
    ).get("zoomLevel");

    let w_fontSize = vscode.workspace.getConfiguration(
        "editor"
    ).get("fontSize");

    const w_config: FontSettings = {
        zoomLevel: Number(w_zoomLevel),
        fontSize: Number(w_fontSize)
    };

    return w_config;
}

</t>
<t tx="felix.20211007213344.5">/**
 * * Apply changes to the expansion config settings and save them in user settings.
 * @param p_changes is an array of codes and values to be changed
 * @returns a promise that resolves upon completion
 */
public setLeojsSettings(p_changes: ConfigSetting[]): Promise&lt;unknown&gt; {
    this._isBusySettingConfig = true;
    const w_promises: Thenable&lt;void&gt;[] = [];
    const w_vscodeConfig = vscode.workspace.getConfiguration(Constants.CONFIG_NAME);
    p_changes.forEach(i_change =&gt; {
        if (i_change &amp;&amp; i_change.code.includes(Constants.CONFIG_REFRESH_MATCH)) {
            // Check if tree refresh is required for hover-icons to be displayed or hidden accordingly
            this._needsTreeRefresh = true;
        }
        // tslint:disable-next-line: strict-comparisons
        if (w_vscodeConfig.inspect(i_change.code)!.defaultValue === i_change.value) {
            // Set as undefined - same as default
            w_promises.push(w_vscodeConfig.update(i_change.code, undefined, true));
        } else {
            // Set as value which is not default
            w_promises.push(w_vscodeConfig.update(i_change.code, i_change.value, true));
        }
    });
    return Promise.all(w_promises).then(() =&gt; {
        if (this._needsTreeRefresh) {
            this._needsTreeRefresh = false;
            setTimeout(() =&gt; {
                this._leoUI.configTreeRefresh();
            }, 200);
        }
        this._isBusySettingConfig = false;
        return this.buildFromSavedSettings(); // Refresh config from settings from vscode's saved config
    });
}

</t>
<t tx="felix.20211007213344.6">/**
 * * Apply changes in font size settings and save them in user settings.
 */
public setFontConfig(p_settings: FontSettings): void {
    if (p_settings.zoomLevel || p_settings.zoomLevel === 0) {
        if (!isNaN(p_settings.zoomLevel) &amp;&amp; p_settings.zoomLevel &lt;= 12 &amp;&amp; p_settings.zoomLevel &gt;= -12) {
            vscode.workspace.getConfiguration("window")
                .update("zoomLevel", p_settings.zoomLevel, true);
        } else {
            vscode.window.showInformationMessage(
                "Value for zoom level should be between -12 and 12"
            );
        }
    }
    if (p_settings.fontSize) {
        if (!isNaN(p_settings.fontSize) &amp;&amp; p_settings.fontSize &lt;= 30 &amp;&amp; p_settings.fontSize &gt;= 6) {
            vscode.workspace.getConfiguration("editor")
                .update("fontSize", p_settings.fontSize, true);
        } else {
            vscode.window.showInformationMessage(
                "Value for font size should be between 6 and 30"
            );
        }
    }
}

</t>
<t tx="felix.20211007213344.7">/**
 * * Set the workbench.editor.enablePreview vscode setting
 */
public setEnablePreview(): Thenable&lt;void&gt; {
    return vscode.workspace.getConfiguration("workbench.editor")
        .update("enablePreview", true, true);
}

</t>
<t tx="felix.20211007213344.8">/**
 * * Clears the workbench.editor.closeEmptyGroups vscode setting
 */
public clearCloseEmptyGroups(): Thenable&lt;void&gt; {
    return vscode.workspace.getConfiguration("workbench.editor")
        .update("closeEmptyGroups", false, true);
}

</t>
<t tx="felix.20211007213344.9">/**
 * * Set the "workbench.editor.closeOnFileDelete" vscode setting
 */
public setCloseOnFileDelete(): Thenable&lt;void&gt; {
    return vscode.workspace.getConfiguration("workbench.editor")
        .update("closeOnFileDelete", true, true);
}

</t>
<t tx="felix.20211007213900.1">/**
 * * Types of the various JSON configuration keys such as treeKeepFocus, defaultReloadIgnore, etc.
 */
export interface ConfigMembers {
    checkForChangeExternalFiles: string;
    defaultReloadIgnore: string;
    leoTreeBrowse: boolean;
    treeKeepFocus: boolean;
    treeKeepFocusWhenAside: boolean;
    statusBarString: string;
    statusBarColor: string;
    treeInExplorer: boolean;
    showOpenAside: boolean;
    showEditOnNodes: boolean;
    showArrowsOnNodes: boolean;
    showAddOnNodes: boolean;
    showMarkOnNodes: boolean;
    showCloneOnNodes: boolean;
    showCopyOnNodes: boolean;

    showEditionOnBody: boolean; // clone delete insert(s)
    showClipboardOnBody: boolean; // cut copy paste(s)
    showPromoteOnBody: boolean; // promote demote
    showExecuteOnBody: boolean; // extract(s)
    showExtractOnBody: boolean;
    showImportOnBody: boolean;
    showRefreshOnBody: boolean;
    showHoistOnBody: boolean;
    showMarkOnBody: boolean;
    showSortOnBody: boolean;

    invertNodeContrast: boolean;
}

</t>
<t tx="felix.20211007213909.1">/**
 * * Structure for configuration settings changes used along with welcome/settings webview.
 */
export interface ConfigSetting {
    code: string;
    value: any;
}

</t>
<t tx="felix.20211007213915.1">/**
 * * Structure for the two vscode font settings
 */
export interface FontSettings {
    zoomLevel: number;
    fontSize: number;
}

</t>
<t tx="felix.20211007214102.1">/**
 * * String for JSON configuration keys such as treeKeepFocus, defaultReloadIgnore, etc.
 */
public static CONFIG_NAMES = {
    CHECK_FOR_CHANGE_EXTERNAL_FILES: "checkForChangeExternalFiles",
    DEFAULT_RELOAD_IGNORE: "defaultReloadIgnore",
    LEO_TREE_BROWSE: "leoTreeBrowse",
    TREE_KEEP_FOCUS: "treeKeepFocus",
    TREE_KEEP_FOCUS_WHEN_ASIDE: "treeKeepFocusWhenAside",
    STATUSBAR_STRING: "statusBarString",
    STATUSBAR_COLOR: "statusBarColor",
    TREE_IN_EXPLORER: "treeInExplorer",
    SHOW_OPEN_ASIDE: "showOpenAside",
    SHOW_EDIT: "showEditOnNodes",
    SHOW_ARROWS: "showArrowsOnNodes",
    SHOW_ADD: "showAddOnNodes",
    SHOW_MARK: "showMarkOnNodes",
    SHOW_CLONE: "showCloneOnNodes",
    SHOW_COPY: "showCopyOnNodes",

    SHOW_EDITION_BODY: "showEditionOnBody",
    SHOW_CLIPBOARD_BODY: "showClipboardOnBody",
    SHOW_PROMOTE_BODY: "showPromoteOnBody",
    SHOW_EXECUTE_BODY: "showExecuteOnBody",
    SHOW_EXTRACT_BODY: "showExtractOnBody",
    SHOW_IMPORT_BODY: "showImportOnBody",
    SHOW_REFRESH_BODY: "showRefreshOnBody",
    SHOW_HOIST_BODY: "showHoistOnBody",
    SHOW_MARK_BODY: "showMarkOnBody",
    SHOW_SORT_BODY: "showSortOnBody",

    INVERT_NODES: "invertNodeContrast",
};

</t>
<t tx="felix.20211007214110.1">/**
 * * Configuration Defaults used in config.ts
 * Used when setting itself and getting parameters from vscode
 */
public static CONFIG_DEFAULTS = {
    CHECK_FOR_CHANGE_EXTERNAL_FILES: "none",  // Used in leoBridge scrip,
    DEFAULT_RELOAD_IGNORE: "none", // Used in leoBridge scrip,
    LEO_TREE_BROWSE: true,
    TREE_KEEP_FOCUS: true,
    TREE_KEEP_FOCUS_WHEN_ASIDE: false,
    STATUSBAR_STRING: "", // Strings like "Literate", "Leo", UTF-8 also supported: \u{1F981}
    STATUSBAR_COLOR: "fb7c47",
    TREE_IN_EXPLORER: true,
    SHOW_OPEN_ASIDE: true,
    SHOW_EDIT: true,
    SHOW_ARROWS: false,
    SHOW_ADD: false,
    SHOW_MARK: false,
    SHOW_CLONE: false,
    SHOW_COPY: false,

    SHOW_EDITION_BODY: true,
    SHOW_CLIPBOARD_BODY: true,
    SHOW_PROMOTE_BODY: true,
    SHOW_EXECUTE_BODY: true,
    SHOW_EXTRACT_BODY: true,
    SHOW_IMPORT_BODY: true,
    SHOW_REFRESH_BODY: true,
    SHOW_HOIST_BODY: true,
    SHOW_MARK_BODY: true,
    SHOW_SORT_BODY: true,

    INVERT_NODES: false
};

</t>
<t tx="felix.20211007214455.1">/**
 * * Checks if a string is formatted as a valid rrggbb color code.
 * @param p_hexString hexadecimal 6 digits string, without leading '0x'
 * @returns True if the string is a valid representation of an hexadecimal 6 digit number
 */
export function isHexColor(p_hexString: string): boolean {
    return typeof p_hexString === 'string'
        &amp;&amp; p_hexString.length === 6
        &amp;&amp; !isNaN(Number('0x' + p_hexString));
}

</t>
<t tx="felix.20211008004139.1">/**
 * * Find panel controls ids
 */
public static FIND_INPUTS_IDS = {
    FIND_TEXT: "findText",
    REPLACE_TEXT: "replaceText",
    ENTIRE_OUTLINE: "entireOutline",
    NODE_ONLY: "nodeOnly",
    SUBOUTLINE_ONLY: "subOutlineOnly",
    IGNORE_CASE: "ignoreCase",
    MARK_CHANGES: "markChanges",
    MARK_FINDS: "markFinds",
    REG_EXP: "regExp",
    WHOLE_WORD: "wholeWord",
    SEARCH_BODY: "searchBody",
    SEARCH_HEADLINE: "searchHeadline"
};

</t>
<t tx="felix.20211010192923.1">import * as vscode from "vscode";
import * as utils from "./utils";
import * as path from 'path';
import { Constants } from "./constants";

import { BodyTimeInfo } from "./types";
import { LeoUI } from "./leoUI";

@language typescript
@tabwidth -4
@others
</t>
<t tx="felix.20211010192923.10">public createDirectory(p_uri: vscode.Uri): void {
    console.warn('Called createDirectory with ', p_uri.fsPath); // should not happen
    throw vscode.FileSystemError.NoPermissions();
}

</t>
<t tx="felix.20211010192923.11">public writeFile(p_uri: vscode.Uri, p_content: Uint8Array, p_options: { create: boolean, overwrite: boolean }): void {
    if (!this.preventSaveToLeo) {
        // TODO :
        // this._leoUi.triggerBodySave(true); // Might have been a vscode 'save' via the menu
    } else {
        this.preventSaveToLeo = false;
    }
    const w_gnx = utils.leoUriToStr(p_uri);
    if (!this._openedBodiesGnx.includes(w_gnx)) {
        console.error("Leointeg: Tried to save body other than selected node's body", w_gnx);
        this._openedBodiesGnx.push(w_gnx);
    }
    const w_now = new Date().getTime();
    this._openedBodiesInfo[w_gnx] = {
        ctime: w_now,
        mtime: w_now
    };
    this._fireSoon({ type: vscode.FileChangeType.Changed, uri: p_uri });
}

</t>
<t tx="felix.20211010192923.12">public rename(p_oldUri: vscode.Uri, p_newUri: vscode.Uri, p_options: { overwrite: boolean }): void {
    console.warn('Called rename on ', p_oldUri.fsPath, p_newUri.fsPath); // should not happen
    this._fireSoon(
        { type: vscode.FileChangeType.Deleted, uri: p_oldUri },
        { type: vscode.FileChangeType.Created, uri: p_newUri }
    );
}

</t>
<t tx="felix.20211010192923.13">public delete(p_uri: vscode.Uri): void {
    // console.log("delete", p_uri.fsPath);
    const w_gnx = utils.leoUriToStr(p_uri);
    if (this._openedBodiesGnx.includes(w_gnx)) {
        this._openedBodiesGnx.splice(this._openedBodiesGnx.indexOf(w_gnx), 1);
        delete this._openedBodiesInfo[w_gnx];
    } else {
        // console.log("not deleted");
    }

    // dirname is just a slash "/"
    let w_dirname = p_uri.with({ path: path.posix.dirname(p_uri.path) });

    this._fireSoon(
        { type: vscode.FileChangeType.Changed, uri: w_dirname },
        { uri: p_uri, type: vscode.FileChangeType.Deleted }
    );
}

</t>
<t tx="felix.20211010192923.14">public copy(p_uri: vscode.Uri): void {
    console.warn('Called copy on ', p_uri.fsPath); // should not happen
    throw vscode.FileSystemError.NoPermissions();
}

</t>
<t tx="felix.20211010192923.15">private _fireSoon(...p_events: vscode.FileChangeEvent[]): void {
    this._bufferedEvents.push(...p_events);
    if (this._fireSoonHandle) {
        clearTimeout(this._fireSoonHandle);
    }
    this._fireSoonHandle = setTimeout(() =&gt; {
        this._onDidChangeFileEmitter.fire(this._bufferedEvents);
        this._bufferedEvents.length = 0; // clearing events array
    }, 5);
}

</t>
<t tx="felix.20211010192923.2">/**
 * * Body panes implementation as a file system using "leo" as a scheme identifier
 * Saving and renaming prevents flickering and prevents undos to 'traverse through' different gnx
 */
export class LeoBodyProvider implements vscode.FileSystemProvider {

    // * Flag normally false
    public preventSaveToLeo: boolean = false;

    // * Last file read data with the readFile method
    private _lastGnx: string = ""; // gnx of last file read
    private _lastBodyData: string = ""; // body content of last file read
    private _lastBodyLength: number = 0; // length of last file read

    // * List of currently opened body panes gnx (from 'watch' &amp; 'dispose' methods)
    private _watchedBodiesGnx: string[] = [];

    // * List of gnx that should be available (from more.selectNode and fs.delete)
    private _openedBodiesGnx: string[] = [];
    private _openedBodiesInfo: { [key: string]: BodyTimeInfo } = {};

    // * List of all possible vNodes gnx in the currently opened leo file (since last refresh/tree operation)
    private _possibleGnxList: string[] = []; // Maybe deprecated

    private _lastBodyTimeGnx: string = "";

    // * An event to signal that a resource has been changed
    // * It should fire for resources that are being [watched](#FileSystemProvider.watch) by clients of this provider
    private _onDidChangeFileEmitter = new vscode.EventEmitter&lt;vscode.FileChangeEvent[]&gt;();
    readonly onDidChangeFile: vscode.Event&lt;vscode.FileChangeEvent[]&gt; = this._onDidChangeFileEmitter.event;
    private _bufferedEvents: vscode.FileChangeEvent[] = [];
    private _fireSoonHandle?: NodeJS.Timer;

    constructor(private _leoUi: LeoUI) { }

    @others
}
</t>
<t tx="felix.20211010192923.3">/**
 * * Sets selected node body's modified time for this gnx virtual file
 * @param p_uri URI of file for which to set made-up modified time
 */
public setBodyTime(p_uri: vscode.Uri): void {
    const w_gnx = utils.leoUriToStr(p_uri);
    this._lastBodyTimeGnx = w_gnx;
    if (!this._openedBodiesGnx.includes(w_gnx)) {
        this._openedBodiesGnx.push(w_gnx);
    }
    const w_now = new Date().getTime();
    this._openedBodiesInfo[w_gnx] = {
        ctime: w_now,
        mtime: w_now
    };
}

</t>
<t tx="felix.20211010192923.4">/**
 * * Refresh the body pane for a particular gnx by telling vscode that the file from the Leo file provider has changed
 * @param p_gnx Gnx of body associated with this virtual file, mostly Leo's selected node
 */
public fireRefreshFile(p_gnx: string): void {
    if (!this._openedBodiesGnx.includes(p_gnx)) {
        console.error("ASKED TO REFRESH NOT EVEN IN SELECTED BODY: ", p_gnx);
        this._openedBodiesGnx.push(p_gnx);
    }
    const w_now = new Date().getTime();
    this._openedBodiesInfo[p_gnx] = {
        ctime: w_now,
        mtime: w_now
    };
    this._onDidChangeFileEmitter.fire([{
        type: vscode.FileChangeType.Changed,
        uri: utils.strToLeoUri(p_gnx)
    } as vscode.FileChangeEvent]);
}

</t>
<t tx="felix.20211010192923.5">/**
 * Maybe deprecated
 * * Refreshes the '_possibleGnxList' list of all unique gnx from Leo
 * @returns a promise that resolves to the fresh gnx string array
 */
public refreshPossibleGnxList(): Thenable&lt;string[]&gt; {
    // * Get updated list of possible gnx
    // return this._leoUi.sendAction(
    //     Constants.LEOBRIDGE.GET_ALL_GNX
    // ).then((p_result) =&gt; {
    //     this._possibleGnxList = p_result.gnx || [];
    //     return Promise.resolve(this._possibleGnxList);
    // });
    return Promise.resolve([]);
}

</t>
<t tx="felix.20211010192923.6">public watch(p_resource: vscode.Uri): vscode.Disposable {
    const w_gnx = utils.leoUriToStr(p_resource);
    if (!this._watchedBodiesGnx.includes(w_gnx)) {
        this._watchedBodiesGnx.push(w_gnx); // add gnx
    } else {
    }
    return new vscode.Disposable(() =&gt; {
        const w_position = this._watchedBodiesGnx.indexOf(w_gnx); // find and remove it
        if (w_position &gt; -1) {
            this._watchedBodiesGnx.splice(w_position, 1);
        }
    });
}

</t>
<t tx="felix.20211010192923.7">public stat(p_uri: vscode.Uri): vscode.FileStat | Thenable&lt;vscode.FileStat&gt; {
    // TODO : Fix/Check extraneous stat(...) call(s)
    if (this._leoUi.leoStates.fileOpenedReady) {
        const w_gnx = utils.leoUriToStr(p_uri);
        if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
            return { type: vscode.FileType.Directory, ctime: 0, mtime: 0, size: 0 };
        } else if (w_gnx === this._lastGnx &amp;&amp; this._openedBodiesGnx.includes(this._lastGnx)) {
            return {
                type: vscode.FileType.File,
                ctime: this._openedBodiesInfo[this._lastGnx].ctime,
                mtime: this._openedBodiesInfo[this._lastGnx].mtime,
                size: this._lastBodyLength
            };
        } else if (this._openedBodiesGnx.includes(w_gnx)) {
            // return this._leoUi.sendAction(
            //     Constants.LEOBRIDGE.GET_BODY_LENGTH,
            //     JSON.stringify({ "gnx": w_gnx })
            // ).then((p_result) =&gt; {
            return Promise.resolve(
                {
                    type: vscode.FileType.File,
                    ctime: this._openedBodiesInfo[w_gnx].ctime,
                    mtime: this._openedBodiesInfo[w_gnx].mtime,
                    size: 0
                    // size: p_result.len ? p_result.len : 0
                }
            );

        }
    }
    // throw vscode.FileSystemError.FileNotFound();
    // (Instead of FileNotFound) should be caught by _onActiveEditorChanged or _changedVisibleTextEditors
    return { type: vscode.FileType.File, ctime: 0, mtime: 0, size: 0 };
}

</t>
<t tx="felix.20211010192923.8">public readFile(p_uri: vscode.Uri): Thenable&lt;Uint8Array&gt; {
    if (this._leoUi.leoStates.fileOpenedReady) {
        if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
            throw vscode.FileSystemError.FileIsADirectory();
        } else {
            const w_gnx = utils.leoUriToStr(p_uri);
            // if (!this._possibleGnxList.includes(w_gnx)) {
            if (!this._openedBodiesGnx.includes(w_gnx)) {
                console.error("readFile: ERROR File not in _openedBodiesGnx! readFile missing refreshes?");
                // throw vscode.FileSystemError.FileNotFound();
                // (Instead of FileNotFound) should be caught by _onActiveEditorChanged or _changedVisibleTextEditors
                return Promise.resolve(Buffer.from(""));
            } else {
                // return this._leoUi.sendAction(
                //     Constants.LEOBRIDGE.GET_BODY,
                //     JSON.stringify({ "gnx": w_gnx })
                // ).then((p_result) =&gt; {
                // if (p_result.body) {
                //     this._lastGnx = w_gnx;
                //     this._lastBodyData = p_result.body;
                //     const w_buffer: Uint8Array = Buffer.from(p_result.body);
                //     this._lastBodyLength = w_buffer.byteLength;
                //     return Promise.resolve(w_buffer);
                // } else if (p_result.body === "") {
                //     this._lastGnx = w_gnx;
                //     this._lastBodyLength = 0;
                //     this._lastBodyData = "";
                //     return Promise.resolve(Buffer.from(""));
                // } else {
                //     if (this._lastGnx === w_gnx) {
                //         // was last gnx of closed file about to be switched to new document selected
                //         console.log('Passed in not found: ' + w_gnx);

                //         return Promise.resolve(Buffer.from(this._lastBodyData));
                //     }
                //     console.error("ERROR =&gt; readFile of unknown GNX"); // is possibleGnxList updated correctly?
                //     //  throw vscode.FileSystemError.FileNotFound();
                //     // (Instead of FileNotFound) should be caught by _onActiveEditorChanged or _changedVisibleTextEditors
                //     return Promise.resolve(Buffer.from(""));
                // }
                // });
                // FAKE
                return Promise.resolve(Buffer.from(""));
            }
        }
    } else {
        throw vscode.FileSystemError.FileNotFound();
    }
}

</t>
<t tx="felix.20211010192923.9">public readDirectory(p_uri: vscode.Uri): Thenable&lt;[string, vscode.FileType][]&gt; {
    if (p_uri.fsPath.length === 1) { // p_uri.fsPath === '/' || p_uri.fsPath === '\\'
        const w_directory: [string, vscode.FileType][] = [];
        w_directory.push([this._lastBodyTimeGnx, vscode.FileType.File]);
        return Promise.resolve(w_directory);
    } else {
        throw vscode.FileSystemError.FileNotFound();
    }
}

</t>
<t tx="felix.20211010221959.1">/**
 * * LeoBody virtual file time information object
 */
export interface BodyTimeInfo {
    ctime: number;
    mtime: number;
}

</t>
</tnodes>
</leo_file>
