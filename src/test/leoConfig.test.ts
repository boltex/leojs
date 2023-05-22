//@+leo-ver=5-thin
//@+node:felix.20220129003431.1: * @file src/test/leoConfig.test.ts
/**
 * Tests of leoApp.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20221226215842.1: ** suite TestConfig(LeoUnitTest)
suite('Test cases for leoConfig.ts', () => {

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
    //@+node:felix.20221226215842.2: *3* TestConfig.test_g_app_config_and_c_config
    test('test_g_app_config_and_c_config', () => {
        const c = self.c;

        assert.ok(g.app.config);
        assert.ok(c.config);

    });
    //@+node:felix.20221226215842.3: *3* TestConfig.test_c_config_printSettings
    test('test_c_config_printSettings', () => {
        const c = self.c;

        c.config.printSettings();

    });
    //@-others

});
//@-others
//@-leo
