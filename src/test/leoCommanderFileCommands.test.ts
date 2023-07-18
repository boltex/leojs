//@+leo-ver=5-thin
//@+node:felix.20230715191150.1: * @file src/test/leoCommanderFileCommands.test.ts
/**
 * Unit tests for Leo's commander file commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715214226.1: ** suite TestRefreshFromDisk
suite('Test cases for commanderFileCommands.ts', () => {

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
    //@+node:felix.20230715220159.1: *3* TestRefreshFromDisk.test_refresh_from_disk
    test('test_refresh_from_disk', () => {
        console.log('TODO : test_refresh_from_disk');

    });

    // def test_refresh_from_disk(self):
    //     c = self.c
    //     at = c.atFileCommands
    //     p = c.p

    //     def dummy_precheck(fileName: str, root: Any) -> bool:
    //         """A version of at.precheck that always returns True."""
    //         return True

    //     at.precheck = dummy_precheck  # Force all writes.

    //     # Define data.
    //     raw_contents = '"""Test File"""\n'
    //     altered_raw_contents = '"""Test File (changed)"""\n'

    //     # Create a writable directory.
    //     directory = tempfile.gettempdir()

    //     # Run the tests.
    //     for kind in ('clean', 'file'):
    //         file_name = f"{directory}{os.sep}test_at_{kind}.py"
    //         p.h = f"@{kind} {file_name}"
    //         for pass_number, contents in (
    //             (0, raw_contents),
    //             (1, altered_raw_contents),
    //         ):
    //             p.b = contents
    //             msg = f"{pass_number}, {kind}"
    //             # Create the file (with sentinels for @file).
    //             if kind  == 'file':
    //                 at.writeOneAtFileNode(p)
    //                 file_contents = ''.join(at.outputList)
    //             else:
    //                 file_contents = contents
    //             with open(file_name, 'w') as f:
    //                 f.write(file_contents)
    //             with open(file_name, 'r') as f:
    //                 contents2 = f.read()
    //             self.assertEqual(contents2, file_contents, msg=msg)
    //             c.refreshFromDisk(event=None)
    //             self.assertEqual(p.b, contents, msg=msg)
    //         # Remove the file.
    //         self.assertTrue(os.path.exists(file_name), msg=file_name)
    //         os.remove(file_name)
    //         self.assertFalse(os.path.exists(file_name), msg=file_name)
    //@-others

});
//@-others
//@-leo
