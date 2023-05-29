//@+leo-ver=5-thin
//@+node:felix.20230528193401.1: * @file src/test/leoFrame.test.ts
/**
 * Tests of leoFrame.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230528193503.1: ** class TestFrame(LeoUnitTest)
class TestFrame(LeoUnitTest):
    """Test cases for leoKeys.py"""
    //@+others
    //@+node:felix.20230528193503.2: *3* TestFrame.test_official_frame_ivars
    def test_official_frame_ivars(self):
        c = self.c
        f = c.frame
        self.assertEqual(f.c, c)
        self.assertEqual(c.frame, f)
        for ivar in ('body', 'iconBar', 'log', 'statusLine', 'tree',):
            assert hasattr(f, ivar), 'missing frame ivar: %s' % ivar
            val = getattr(f, ivar)
            self.assertTrue(val is not None, msg=ivar)
    //@-others
//@-others
//@-leo
