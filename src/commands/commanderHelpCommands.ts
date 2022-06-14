//@+leo-ver=5-thin
//@+node:felix.20220612234816.1: * @file src/commands/commanderHelpCommands.ts
// Help commands that used to be defined in leoCommands.py
import * as vscode from "vscode";
import { Utils as uriUtils } from "vscode-uri";

import * as g from "../core/leoGlobals";
import { commander_command } from "../core/decorators";
import { Position, VNode } from "../core/leoNodes";
import { FastRead, FileCommands } from "../core/leoFileCommands";
import { Commands } from "../core/leoCommands";
import { LoadManager, PreviousSettings } from "../core/leoApp";
import { leojsSettingsXml } from "../leojsSettings";

import dayjs = require('dayjs');

//@+others
//@+node:felix.20220613000058.1: ** Class CommanderHelpCommands
export class CommanderHelpCommands {

    //@+others
    //@+node:felix.20220612234816.2: *3* c_help.about (version number & date)
    @commander_command(
        'about-leo',
        'Bring up an About Leo Dialog.'
    )
    public about(this: Commands): void {
        const c = this;

        // Don't use triple-quoted strings or continued strings here.
        // Doing so would add unwanted leading tabs.
        const version = g.app.signon + '\n\n';
        const theCopyright =
            `Copyright 1999-${dayjs().year()} by Edward K. Ream and Félix Malboeuf\n` +
            "All Rights Reserved\n" +
            "Leo and LeoJS are distributed under the MIT License";
        const url = "http://leoeditor.com/"; // unused for now
        const email = "edreamleo@gmail.com"; // unused for now
        g.app.gui!.runAboutLeoDialog(c, version, theCopyright, url, email);

    }

    //@+node:felix.20220612234816.5: *3* c_help.Open Leo files
    //@+node:felix.20220612234816.6: *4* c_help.leoDocumentation
    @commander_command(
        'open-leo-docs-leo',
        'Open LeoDocs.leo in a new Leo window.'
    )
    @commander_command(
        'leo-docs-leo',
        'Open LeoDocs.leo in a new Leo window.'
    )
    public leoDocumentation(this: Commands): void {

        vscode.window.showInformationMessage('TODO : open-leo-docs-leo');

        /*     
        c = self
        name = "LeoDocs.leo"
        fileName = g.os_path_finalize_join(g.app.loadDir, "..", "doc", name)
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

        vscode.window.showInformationMessage('TODO : open-quickstart-leo');

        /* 
        c = self
        name = "quickstart.leo"
        fileName = g.os_path_finalize_join(g.app.loadDir, "..", "doc", name)
        # Bug fix: 2012/04/09: only call g.openWithFileName if the file exists.
        if g.os_path_exists(fileName):
            c2 = g.openWithFileName(fileName, old_c=c)
            if c2:
                return
        g.es("not found:", name)
        */
    }
    //@+node:felix.20220612234816.8: *4* c_help.openCheatSheet
    @commander_command(
        'open-cheat-sheet-leo',
        'Open leo/doc/cheatSheet.leo'
    )
    @commander_command(
        'leo-cheat-sheet',
        'Open leo/doc/cheatSheet.leo'
    )
    @commander_command(
        'cheat-sheet',
        'Open leo/doc/cheatSheet.leo'
    )
    public openCheatSheet(this: Commands): void {

        vscode.window.showInformationMessage('TODO : open-cheat-sheet-leo');

        /* 
        c = self
        fn = g.os_path_finalize_join(g.app.loadDir, '..', 'doc', 'CheatSheet.leo')
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
    )  // #1343.
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

            const c: Commands = g.app.newCommander(
                "",
                g.app.gui,
            );
            const w_fastRead: FastRead = new FastRead(c, c.fileCommands.gnxDict);

            let ok: VNode | undefined;
            let g_element;

            [ok, g_element] = w_fastRead.readWithElementTree("", leojsSettingsXml);
            if (ok) {
                c.hiddenRootNode = ok;
            }

            c.setChanged();
            lm.finishOpen(c);
            g.doHook("new", { old_c: old_c, c: c, new_c: c });
            g.app.disable_redraw = false;
            c.redraw();
            return c;
        }
        catch (exception) {
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
    )  // #1343.
    @commander_command(
        'my-leo-settings',
        'Open myLeoSettings.leo in a new Leo window.'
    )
    public async openMyLeoSettings(this: Commands): Promise<Commands | undefined> {

        //@+others
        //@+node:felix.20220612234816.15: *5* function: c_help.createMyLeoSettings
        /**
         * createMyLeoSettings - Return true if myLeoSettings.leo created ok
         */
        async function createMyLeoSettings(c: Commands): Promise<Commands | undefined> {

            /* 
            name = "myLeoSettings.leo"
            homeLeoDir = g.app.homeLeoDir
            loadDir = g.app.loadDir
            configDir = g.app.globalConfigDir
            # check it doesn't already exist
            for path in homeLeoDir, loadDir, configDir:
                fileName = g.os_path_join(path, name)
                if g.os_path_exists(fileName):
                    return None
            ok = g.app.gui.runAskYesNoDialog(c,
                title='Create myLeoSettings.leo?',
                message=f"Create myLeoSettings.leo in {homeLeoDir}?",
            )
            if ok == 'no':
                return None
            # get '@enabled-plugins' from g.app.globalConfigDir
            fileName = g.os_path_join(configDir, "leoSettings.leo")
            leosettings = g.openWithFileName(fileName, old_c=c)
            enabledplugins = g.findNodeAnywhere(leosettings, '@enabled-plugins')
            if not enabledplugins:
                return None
            enabledplugins = enabledplugins.b
            leosettings.close()
            # now create "~/.leo/myLeoSettings.leo"
            fileName = g.os_path_join(homeLeoDir, name)
            c2 = g.openWithFileName(fileName, old_c=c)
            # add content to outline
            nd = c2.rootPosition()
            nd.h = "Settings README"
            nd.b = (
                "myLeoSettings.leo personal settings file created {time}\n\n"
                "Only nodes that are descendants of the @settings node are read.\n\n"
                "Only settings you need to modify should be in this file, do\n"
                "not copy large parts of leoSettings.py here.\n\n"
                "For more information see http://leoeditor.com/customizing.html"
                "".format(time=time.asctime())
            )
            nd = nd.insertAfter()
            nd.h = '@settings'
            nd = nd.insertAsNthChild(0)
            nd.h = '@enabled-plugins'
            nd.b = enabledplugins
            nd = nd.insertAfter()
            nd.h = '@keys'
            nd = nd.insertAsNthChild(0)
            nd.h = '@shortcuts'
            nd.b = (
                "# You can define keyboard shortcuts here of the form:\n"
                "#\n"
                "#    some-command Shift-F5\n"
            )
            c2.redraw()
            return c2
            */

            return;

        }

        //@-others

        const c = this;
        const lm = g.app.loadManager!;

        try {
            const path = await lm.computeMyLeoSettingsPath();
            if (path) {
                return g.openWithFileName(path, c, g.app.gui!);
            }
            g.es('not found: myLeoSettings.leo');
            return createMyLeoSettings(c);
        }
        catch (exception) {
            return undefined;
        }
    }

    //@+node:felix.20220612234816.16: *3* c_help.Open Leo web pages
    //@+node:felix.20220612234816.17: *4* c_help.leoHome
    @commander_command(
        'open-online-home',
        'Open Leo\'s Home page in a web browser.'
    )
    public leoHome(this: Commands): void {

        vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leoeditor.com/'
            )
        );

    }

    //@+node:felix.20220612234816.18: *4* c_help.openLeoTOC
    @commander_command(
        'open-online-toc',
        'Open Leo\'s tutorials page in a web browser.'
    )
    public openLeoTOC(this: Commands): void {

        vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leoeditor.com/leo_toc.html'
            )
        );

    }

    //@+node:felix.20220612234816.19: *4* c_help.openLeoTutorials
    @commander_command(
        'open-online-tutorials',
        'Open Leo\'s tutorials page in a web browser.'
    )
    public openLeoTutorials(this: Commands): void {

        vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leoeditor.com/tutorial.html'
            )
        );

    }

    //@+node:felix.20220612234816.20: *4* c_help.openLeoUsersGuide
    @commander_command(
        'open-users-guide',
        'Open Leo\'s users guide in a web browser.'
    )
    public openLeoUsersGuide(this: Commands): void {

        vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leoeditor.com/usersguide.html"'
            )
        );

    }

    //@+node:felix.20220612234816.21: *4* c_help.openLeoVideos
    @commander_command(
        'open-online-videos',
        'Open Leo\'s videos page in a web browser.'
    )
    public openLeoVideos(this: Commands): void {

        vscode.env.openExternal(
            vscode.Uri.parse(
                'https://leoeditor.com/screencasts.html'
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
