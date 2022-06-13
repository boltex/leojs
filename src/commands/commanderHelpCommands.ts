//@+leo-ver=5-thin
//@+node:felix.20220612234816.1: * @file src/commands/commanderHelpCommands.ts
// Help commands that used to be defined in leoCommands.py
import * as vscode from "vscode";
import { Utils as uriUtils } from "vscode-uri";

import * as g from "../core/leoGlobals";
import { commander_command } from "../core/decorators";
import { Position, VNode } from "../core/leoNodes";
import { FileCommands } from "../core/leoFileCommands";
import { Commands } from "../core/leoCommands";
import { Bead, Undoer } from "../core/leoUndo";
import { LoadManager, PreviousSettings } from "../core/leoApp";
import { AtFile } from "../core/leoAtFile";
import { LeoUI } from "../leoUI";

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

        vscode.window.showInformationMessage('TODO: about-leo');

        /* 
        c = self
        import datetime
        // Don't use triple-quoted strings or continued strings here.
        // Doing so would add unwanted leading tabs.
        version = g.app.signon + '\n\n'
        theCopyright = (
            "Copyright 1999-%s by Edward K. Ream\n" +
            "All Rights Reserved\n" +
            "Leo is distributed under the MIT License") % datetime.date.today().year
        url = "http://leoeditor.com/"
        email = "edreamleo@gmail.com"
        g.app.gui.runAboutLeoDialog(c, version, theCopyright, url, email)
        */
    }
    //@+node:felix.20220612234816.3: *3* c_help.editOneSetting
    @commander_command(
        'edit-setting',
        'Opens correct dialog for selected setting type'
    )
    public editOneSetting(this: Commands): void {

        vscode.window.showInformationMessage('TODO: edit-setting');

        /* 
        c, p = self, self.c.p
        func = None
        if p.h.startswith('@font'):
            func = c.commandsDict.get('show-fonts')
        elif p.h.startswith('@color '):
            func = c.commandsDict.get('show-color-wheel')
        elif p.h.startswith(('@shortcuts', '@button', '@command')):
            c.editShortcut()
            return
        else:
            g.es('not in a setting node')
            return
        if func:
            event = g.app.gui.create_key_event(c)
            func(event)
        */
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

        vscode.window.showInformationMessage('TODO :  open-quickstart-leo');

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

        vscode.window.showInformationMessage('open-cheat-sheet-leo');

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
        'Open leoSettings.leo in a new Leo window.'
    )
    @commander_command(
        'open-leo-settings-leo',
        'Open leoSettings.leo in a new Leo window.'
    )  // #1343.
    @commander_command(
        'leo-settings',
        'Open leoSettings.leo in a new Leo window.'
    )
    public openLeoSettings(this: Commands): void {

        vscode.window.showInformationMessage('TODO : open-leo-settings');

        /* 
        c, lm = self, g.app.loadManager
        path = lm.computeLeoSettingsPath()
        if path:
            return g.openWithFileName(path, old_c=c)
        g.es('not found: leoSettings.leo')
        return None
        */
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
    public openMyLeoSettings(this: Commands): void {

        vscode.window.showInformationMessage('TODO : open-my-leo-settings');

        /* 
        c, lm = self, g.app.loadManager
        path = lm.computeMyLeoSettingsPath()
        if path:
            return g.openWithFileName(path, old_c=c)
        g.es('not found: myLeoSettings.leo')
        return createMyLeoSettings(c)
        */
    }

    //@+node:felix.20220612234816.15: *5* function: c_help.createMyLeoSettings
    /**
     * createMyLeoSettings - Return true if myLeoSettings.leo created ok
     */
    public async createMyLeoSettings(c: Commands): Promise<Commands | undefined> {

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
