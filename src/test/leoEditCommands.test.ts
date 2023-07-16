//@+leo-ver=5-thin
//@+node:felix.20230715191134.1: * @file src/test/leoEditCommands.test.ts
/**
 * Unit tests for Leo's edit commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715214158.1: ** suite
suite('Test cases for editCommands.ts', () => {

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
    //@-others

});
//@-others
//@-leo
