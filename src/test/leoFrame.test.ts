//@+leo-ver=5-thin
//@+node:felix.20230528193401.1: * @file src/test/leoFrame.test.ts
/**
 * Tests of leoFrame.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import { LeoUnitTest } from './leoTest2';
import { LeoFrame } from '../core/leoFrame';

//@+others
//@+node:felix.20230528193503.1: ** suite TestFrame
suite('Test cases for leoFrame.ts', () => {
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
    //@+node:felix.20230528193503.2: *3* TestFrame.test_official_frame_ivars
    test('test_official_frame_ivars', () => {
        const c = self.c;
        const f = c.frame;
        assert.strictEqual(f.c, c);
        assert.strictEqual(c.frame, f);

        const table: (keyof LeoFrame)[] = [
            'body',
            'iconBar',
            // 'log',  // UNUSED IN LEOJS
            // 'statusLine',  // UNUSED IN LEOJS
            'tree'
        ];
        for (const ivar of table) {
            assert.ok(f[ivar], `missing frame ivar: ${ivar}`);
            const val = f[ivar];
            assert.ok(val !== null, ivar);
        }
    });
    //@-others
});
//@-others
//@-leo
