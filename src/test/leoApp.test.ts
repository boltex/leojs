//@+leo-ver=5-thin
//@+node:felix.20220129200448.1: * @file src/test/leoApp.test.ts
/**
 * Tests of leoApp.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

/* eslint-disable require-await */

//@+others
//@+node:felix.20220129221242.1: ** suite TestApp
suite('Test cases for leoApp.ts', () => {

    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20220129221913.2: *3* TestApp.test_official_g_app_directories
    // ! Uncomment if those dir strings are ever needed in leojs !
    /*
    test('test_official_g_app_directories', async () => {

        const ivars = ['extensionsDir', 'globalConfigDir', 'loadDir', 'testDir'];
        ivars.forEach(ivar => {

            assert.ok(g.app.hasOwnProperty(ivar), `missing g.app directory: ${ivar}`);

            let val = (g.app as any)[ivar];
            assert.ok(val !== undefined);
            // assert val is not None, 'null g.app directory: %s' % ivar
            assert.ok(g.os_path_exists(g.os_path_abspath(val)), `non-existent g.app directory: ${ivar}`);
        });
        assert.ok(g.app['homeDir'], 'missing g.app directory: homeDir');  // May well be None.

    });
    */
    //@+node:felix.20220129221913.3: *3* TestApp.test_official_g_app_ivars
    test('test_official_g_app_ivars', async () => {

        const ivars = [
            // Global managers.
            'config',
            // 'externalFilesController',
            'loadManager', 'pluginsController',

            // 'recentFilesManager', // ? UNUSED IN LEOJS ?

            // Official ivars.
            'gui',
            'initing', 'killed', 'quitting',
            'leoID',
            'log', 'logIsLocked', 'logWaiting',
            'nodeIndices',
            'windowList',
            // Less-official and might be removed...
            'batchMode',
            // 'debugSwitch',
            'disableSave',
            'hookError', 'hookFunction',
            'numberOfUntitledWindows',
            'realMenuNameDict',
            // 'searchDict',
            'scriptDict',
        ];

        ivars.forEach(ivar => {
            assert.ok(g.app.hasOwnProperty(ivar), `missing g.app ivar: ${ivar}`);
        });

    });

    //@+node:felix.20220129221913.4: *3* TestApp.test_consistency_of_leoApp_tables
    test('test_consistency_of_leoApp_tables', async () => {
        const delims_d = g.app.language_delims_dict;
        const lang_d = g.app.language_extension_dict;
        const ext_d = g.app.extension_dict;

        for (const lang in lang_d) {
            const ext = lang_d[lang];
            assert.ok(delims_d[lang], lang);
            assert.ok(ext_d[ext]);
        }

        for (const ext in ext_d) {
            const lang = ext_d[ext];
            assert.ok(lang_d[lang], lang);
        }
    });

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
