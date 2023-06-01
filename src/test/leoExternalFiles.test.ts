//@+leo-ver=5-thin
//@+node:felix.20220129003154.1: * @file src/test/leoExternalFiles.test.ts
/**
 * Tests of leoExternalFiles.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';
import { IdleTimeManager } from '../core/leoApp';
import { ExternalFilesController } from '../core/leoExternalFiles';

//@+others
//@+node:felix.20230528193548.1: ** suite TestExternalFiles
suite('TestExternalFiles', () => {

    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        const c = self.c;
        g.app.idleTimeManager = new IdleTimeManager();
        g.app.idleTimeManager.start();
        g.app.externalFilesController = new ExternalFilesController();
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230528193548.3: *3* TestExternalFiles.test_on_idle
    /**
     * A minimal test of the on_idle and all its helpers.
     *
     * More detail tests would be difficult.
     */
    test('test_on_idle', async () => {

        const efc = g.app.externalFilesController as ExternalFilesController;

        for (let i = 0; i < 100; i++) {
            await efc.on_idle();
        }
    });
    //@-others

});
//@-others
//@-leo
