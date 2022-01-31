//@+leo-ver=5-thin
//@+node:felix.20220129200448.1: * @file src/test/leoApp.test.ts
/**
 * Tests of leoApp.ts
 */
import * as assert from 'assert';
import { after, before } from 'mocha';
import * as vscode from 'vscode';

import * as g from '../core/leoGlobals';
import { LeoApp } from '../core/leoApp';
import { Commands } from "../core/leoCommands";
import { NodeIndices, VNode, Position } from '../core/leoNodes';


//@+others
//@+node:felix.20220129221242.1: ** Suite TestApp(LeoUnitTest)


suite('Test cases for leoApp.py', () => {


    before(() => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });
    });


    after(async () => {
        console.log('after leoApp test');

        // vscode.window.showInformationMessage('after leoApp.test!');
    });

    test('actual leoApp test', () => {
        console.log('starting actual leoApp test');

        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));

        assert.strictEqual(!!g, true, "g exists");

        (g.app as LeoApp) = new LeoApp();

        assert.strictEqual(!!g.app, true, "g.app exists");

        console.log('in leoApp test g.app.leoID is ', g.app.leoID);


    });

    //@+others
    //@+node:felix.20220129221913.2: *3* TestApp.test_official_g_app_directories


    /*
    def test_official_g_app_directories(self):
        ivars = ('extensionsDir', 'globalConfigDir', 'loadDir', 'testDir')
        for ivar in ivars:
            assert hasattr(g.app, ivar), 'missing g.app directory: %s' % ivar
            val = getattr(g.app, ivar)
            assert val is not None, 'null g.app directory: %s' % ivar
            assert g.os_path_exists(g.os_path_abspath(val)), 'non-existent g.app directory: %s' % ivar
        assert hasattr(g.app, 'homeDir')  # May well be None.
    */
    //@+node:felix.20220129221913.3: *3* TestApp.test_official_g_app_ivars

    /*
    def test_official_g_app_ivars(self):
        ivars = (
            # Global managers.
            'config',
            # 'externalFilesController',
            'loadManager', 'pluginsController', 'recentFilesManager',
            # Official ivars.
            'gui',
            'initing', 'killed', 'quitting',
            'leoID',
            'log', 'logIsLocked', 'logWaiting',
            'nodeIndices',
            'windowList',
            # Less-official and might be removed...
            'batchMode',
            # 'debugSwitch',
            'disableSave',
            'hookError', 'hookFunction',
            'numberOfUntitledWindows',
            'realMenuNameDict',
            # 'searchDict',
            'scriptDict',
        )
        for ivar in ivars:
            self.assertTrue(hasattr(g.app, ivar))

    */
    //@+node:felix.20220129221913.4: *3* TestApp.test_consistency_of_leoApp_tables



    /*
    def test_consistency_of_leoApp_tables(self):
        delims_d = g.app.language_delims_dict
        lang_d = g.app.language_extension_dict
        ext_d = g.app.extension_dict
        for lang in lang_d:
            ext = lang_d.get(lang)
            assert lang in delims_d, lang
            assert ext in ext_d, ext
        for ext in ext_d:
            lang = ext_d.get(ext)
            assert lang in lang_d, lang
    */
    //@+node:felix.20220129221913.5: *3* TestApp.test_lm_openAnyLeoFile


    /*
    def test_lm_openAnyLeoFile(self):
        lm = g.app.loadManager
        # Create a zip file for testing.
        s = 'this is a test file'
        testDir = g.os_path_join(g.app.loadDir, '..', 'test')
        assert g.os_path_exists(testDir), testDir
        path = g.os_path_finalize_join(testDir, 'testzip.zip')
        if os.path.exists(path):
            os.remove(path)
        f = zipfile.ZipFile(path, 'x')
        assert f, path
        try:
            f.writestr('leo-zip-file', s)
            f.close()
            # Open the file, and get the contents.
            f = lm.openAnyLeoFile(path)
            s2 = f.read()
            f.close()
        finally:
            os.remove(path)
        self.assertEqual(s, s2)
    */
    //@+node:felix.20220129221913.6: *3* TestApp.test_rfm_writeRecentFilesFileHelper


    /*
    def test_rfm_writeRecentFilesFileHelper(self):
        fn = 'ффф.leo'
        g.app.recentFilesManager.writeRecentFilesFileHelper(fn)
        assert g.os_path_exists(fn), fn
        os.remove(fn)
        assert not g.os_path_exists(fn), fn
    */
    //@-others

});
//@-others
//@-leo
