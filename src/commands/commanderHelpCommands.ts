//@+leo-ver=5-thin
//@+node:felix.20220612234816.1: * @file src/commands/commanderHelpCommands.ts
/**
 * Help commands that used to be defined in leoCommands.py
 */
import * as vscode from 'vscode';
import { Utils as uriUtils } from 'vscode-uri';

import * as g from '../core/leoGlobals';
import { commander_command } from '../core/decorators';
import { VNode } from '../core/leoNodes';
import { FastRead } from '../core/leoFileCommands';
import { Commands } from '../core/leoCommands';
import { leojsSettingsXml } from '../leojsSettings';
import { ScriptingController, EvalController } from '../core/mod_scripting';

const dayjs = require('dayjs');

//@+others
//@+node:felix.20220613000058.1: ** Class CommanderHelpCommands
export class CommanderHelpCommands {
    //@+others
    //@+node:felix.20220612234816.2: *3* c_help.about (version number & date)
    @commander_command('about-leo', 'Bring up an About Leo Dialog.')
    public about(this: Commands): Thenable<unknown> {
        const c = this;

        // Don't use triple-quoted strings or continued strings here.
        // Doing so would add unwanted leading tabs.
        const version = g.app.signon + '\n\n';
        const theCopyright =
            `Copyright 1999-${dayjs().year()} by Edward K. Ream and Félix Malboeuf\n` +
            'All Rights Reserved\n' +
            'Leo and LeoJS are distributed under the MIT License';
        const url = 'https://leo-editor.github.io/leo-editor/'; // unused for now
        const email = 'edreamleo@gmail.com'; // unused for now
        return g.app.gui.runAboutLeoDialog(
            c,
            version,
            theCopyright,
            url,
            email
        );
    }

    //@+node:felix.20220612234816.5: *3* c_help.Open Leo files
    //@+node:felix.20220612234816.6: *4* c_help.leoDocumentation
    @commander_command(
        'open-leo-docs-leo',
        'Open LeoDocs.leo in a new Leo window.'
    )
    @commander_command('leo-docs-leo', 'Open LeoDocs.leo in a new Leo window.')
    public leoDocumentation(this: Commands): void {
        void vscode.window.showInformationMessage('TODO : open-leo-docs-leo');

        /*     
        c = self
        name = "LeoDocs.leo"
        fileName = g.finalize_join(g.app.loadDir, "..", "doc", name)
        # Bug fix: 2012/04/09: only call g.openWithFileName if the file exists.
        if g.os_path_exists(fileName):
            c2 = g.openWithFileName(fileName, old_c=c)
            if c2:
                return
        g.es("not found:", name)
        */
    }

    //@+node:felix.20220612234816.7: *4* c_help.leoQuickStart
    @commander_command(
        'open-quickstart-leo',
        'Open quickstart.leo in a new Leo window.'
    )
    @commander_command(
        'leo-quickstart-leo',
        'Open quickstart.leo in a new Leo window.'
    )
    public leoQuickStart(this: Commands): void {
        void vscode.window.showInformationMessage('TODO : open-quickstart-leo');

        /* 
        c = self
        name = "quickstart.leo"
        fileName = g.finalize_join(g.app.loadDir, "..", "doc", name)
        # Bug fix: 2012/04/09: only call g.openWithFileName if the file exists.
        if g.os_path_exists(fileName):
            c2 = g.openWithFileName(fileName, old_c=c)
            if c2:
                return
        g.es("not found:", name)
        */
    }
    //@+node:felix.20220612234816.8: *4* c_help.openCheatSheet
    @commander_command('open-cheat-sheet-leo', 'Open leo/doc/cheatSheet.leo')
    @commander_command('leo-cheat-sheet', 'Open leo/doc/cheatSheet.leo')
    @commander_command('cheat-sheet', 'Open leo/doc/cheatSheet.leo')
    public openCheatSheet(this: Commands): void {
        void vscode.window.showInformationMessage(
            'TODO : open-cheat-sheet-leo'
        );

        /* 
        c = self
        fn = g.finalize_join(g.app.loadDir, '..', 'doc', 'CheatSheet.leo')
        if not g.os_path_exists(fn):
            g.es(f"file not found: {fn}")
            return
        c2 = g.openWithFileName(fn, old_c=c)
        p = g.findNodeAnywhere(c2, "Leo's cheat sheet")
        if p:
            c2.selectPosition(p)
            p.expand()
        c2.redraw()
        */
    }

    //@+node:felix.20220612234816.14: *4* c_help.openLeoSettings & openMyLeoSettings & helper
    @commander_command(
        'open-leo-settings',
        'Open default Leo settings as a new Leo Document.'
    )
    @commander_command(
        'open-leo-settings-leo',
        'Open default Leo settings as a new Leo Document.'
    ) // #1343.
    @commander_command(
        'leo-settings',
        'Open default Leo settings as a new Leo Document.'
    )
    public async openLeoSettings(this: Commands): Promise<Commands | undefined> {
        /* 
        c, lm = self, g.app.loadManager
        path = lm.computeLeoSettingsPath()
        if path:
            return g.openWithFileName(path, old_c=c)
        g.es('not found: leoSettings.leo')
        return undefined;
        */

        // * Equivalent with HARD-CODED leoSettings.leo xml string.

        const old_c = this;
        const lm = g.app.loadManager!;

        try {
            g.app.disable_redraw = true;

            const c: Commands = g.app.newCommander('', g.app.gui);

            // ! LEOJS : SET c.openDirectory to the g.app.vscodeWorkspaceUri !
            c.openDirectory = g.app.vscodeWorkspaceUri?.fsPath;
            if (c.openDirectory) {
                c.frame.openDirectory = c.openDirectory;
            }

            const w_fastRead: FastRead = new FastRead(
                c,
                c.fileCommands.gnxDict
            );

            let ok: VNode | undefined;
            let g_element;

            [ok, g_element] = w_fastRead.readWithElementTree(
                '',
                leojsSettingsXml // TODO : REPLACE WITH LOCAL .leojs settings!
            );
            if (ok) {
                c.hiddenRootNode = ok;
            }

            c.setChanged();
            lm.finishOpen(c);
            g.doHook('new', { old_c: old_c, c: c, new_c: c });

            // ! mod_scripting ORIGINALLY INIT ON open2 or new HOOK IN LEO !
            c.theScriptingController = new ScriptingController(c);
            await c.theScriptingController.createAllButtons();
            c.evalController = new EvalController(c);

            g.app.disable_redraw = false;
            c.redraw();
            return c;
        } catch (exception) {
            return undefined;
        }
    }

    @commander_command(
        'open-my-leo-settings',
        'Open myLeoSettings.leo in a new Leo window.'
    )
    @commander_command(
        'open-my-leo-settings-leo',
        'Open myLeoSettings.leo in a new Leo window.'
    ) // #1343.
    @commander_command(
        'my-leo-settings',
        'Open myLeoSettings.leo in a new Leo window.'
    )
    public async openMyLeoSettings(
        this: Commands
    ): Promise<Commands | undefined> {
        //@+others
        //@+node:felix.20220612234816.15: *5* function: c_help.createMyLeoSettings
        /**
         * createMyLeoSettings - Return true if myLeoSettings.leo created ok
         */
        async function createMyLeoSettings(
            c: Commands
        ): Promise<Commands | undefined> {
            const name = 'myLeoSettings.leo';
            let homeLeoDir = g.app.homeLeoDir;
            // const loadDir = g.app.loadDir;
            let fileName;
            // check it doesn't already exist
            for (let w_path of [homeLeoDir]) {
                fileName = g.os_path_join(w_path || '/', name);
                const exists = await g.os_path_exists(fileName);
                if (exists) {
                    return undefined;
                }
            }

            let ok;

            ok = await g.app.gui.runAskYesNoDialog(
                c,
                'Create myLeoSettings.leo?',
                `Create myLeoSettings.leo in ${homeLeoDir}?`
            );

            if (ok === 'no') {
                return undefined;
            }

            // get '@enabled-plugins' from g.app.globalConfigDir ! SKIPPED IN LEOJS !
            // fileName = g.os_path_join(configDir, "leoSettings.leo");
            // const leosettings = await g.openWithFileName(fileName, c, g.app.gui);
            // const enabledplugins = g.findNodeAnywhere(leosettings!, '@enabled-plugins');
            // if (!enabledplugins || !enabledplugins.__bool__()) {
            //     return undefined;
            // }

            // const enabledpluginsBody = enabledplugins.b;
            // if (leosettings) {
            //     leosettings.close();
            // }

            // now create "~/.leo/myLeoSettings.leo" OR /myLeoSettings if leojs runs in browser!
            if (homeLeoDir) {
                fileName = g.os_path_join(homeLeoDir, name);
            } else {
                let localDir = g.os_path_dirname(
                    lm.files.length ? lm.files[0] : ''
                );
                // IF NO FILES IN lm.files THEN USE WORKSPACE ROOT !
                if (!localDir) {
                    localDir = vscode.workspace.workspaceFolders
                        ? vscode.workspace.workspaceFolders[0].uri.path
                        : '';
                }
                fileName = g.os_path_join(localDir, name);
            }

            const c2 = await g.openWithFileName(fileName, c, g.app.gui);
            // add content to outline
            let nd = c2!.rootPosition()!;
            nd.h = 'Settings README';
            nd.b =
                `myLeoSettings.leo personal settings file created ${dayjs().format(
                    'llll'
                )}\n\n` +
                'Only nodes that are descendants of the @settings node are read.\n\n' +
                'Only settings you need to modify should be in this file, do\n' +
                'not copy large parts of leoSettings.py here.\n\n' +
                'For more information see https://leo-editor.github.io/leo-editor/customizing.html';

            nd = nd.insertAfter();
            nd.h = '@settings';
            // nd = nd.insertAsNthChild(0);
            // nd.h = '@enabled-plugins';
            // nd.b = enabledpluginsBody;
            // nd = nd.insertAfter();
            // nd.h = '@keys';
            // nd = nd.insertAsNthChild(0);
            // nd.h = '@shortcuts';
            // nd.b =
            //     "# You can define keyboard shortcuts here of the form:\n" +
            //     "#\n" +
            //     "#    some-command Shift-F5\n";

            c2!.redraw();

            return c2;
        }

        //@-others

        const c = this;
        const lm = g.app.loadManager!;

        try {
            const w_path = await lm.computeMyLeoSettingsPath();
            if (w_path) {
                return g.openWithFileName(w_path, c, g.app.gui);
            }
            g.es('not found: myLeoSettings.leo');
            return createMyLeoSettings(c);
        } catch (exception) {
            return undefined;
        }
    }

    //@+node:felix.20220612234816.16: *3* c_help.Open Leo web pages
    //@+node:felix.20220612234816.17: *4* c_help.leoHome
    @commander_command(
        'open-online-home',
        "Open Leo's Home page in a web browser."
    )
    public leoHome(this: Commands): void {
        void vscode.env.openExternal(
            vscode.Uri.parse('https://leo-editor.github.io/leo-editor/')
        );
    }

    //@+node:felix.20220612234816.18: *4* c_help.openLeoTOC
    @commander_command(
        'open-online-toc',
        "Open Leo's tutorials page in a web browser."
    )
    public openLeoTOC(this: Commands): void {
        void vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leo-editor.github.io/leo-editor/leo_toc.html'
            )
        );
    }

    //@+node:felix.20220612234816.19: *4* c_help.openLeoTutorials
    @commander_command(
        'open-online-tutorials',
        "Open Leo's tutorials page in a web browser."
    )
    public openLeoTutorials(this: Commands): void {
        void vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leo-editor.github.io/leo-editor/tutorial.html'
            )
        );
    }

    //@+node:felix.20220612234816.20: *4* c_help.openLeoUsersGuide
    @commander_command(
        'open-users-guide',
        "Open Leo's users guide in a web browser."
    )
    public openLeoUsersGuide(this: Commands): void {
        void vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leo-editor.github.io/leo-editor/usersguide.html"'
            )
        );
    }

    //@+node:felix.20220612234816.21: *4* c_help.openLeoVideos
    @commander_command(
        'open-online-videos',
        "Open Leo's videos page in a web browser."
    )
    public openLeoVideos(this: Commands): void {
        void vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leo-editor.github.io/leo-editor/screencasts.html'
            )
        );
    }

    //@+node:felix.20220612234816.23: *3* c_help.selectAtSettingsNode
    @commander_command(
        'open-local-settings',
        'Select the @settings node, if there is one.'
    )
    public selectAtSettingsNode(this: Commands): void {
        const c = this;
        const p = c.config.settingsRoot();
        if (p && p.__bool__()) {
            c.selectPosition(p);
            c.redraw();
        } else {
            g.es('no local @settings tree.');
        }
    }

    //@-others
}
//@-others
//@-leo
