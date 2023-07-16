//@+leo-ver=5-thin
//@+node:felix.20230715191137.1: * @file src/test/leoEditFileCommands.test.ts
/**
 * Unit tests for Leo's edit file commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715215852.1: ** suite TestEditFileCommands
suite('Test cases for editFileCommands.ts', () => {

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
    //@+node:felix.20230715215852.2: *3* TestEditFileCommands.slow_test_gdc_node_history
    test('slow_test_gdc_node_history', () => {
        console.log('TODO : slow_test_gdc_node_history');

    });


    // def slow_test_gdc_node_history(self):

    //     # These links are valid within leoPy.leo on EKR's machine.
    //     # g.findUnl:        unl:gnx://leoPy.leo#ekr.20230626064652.1
    //     # g.parsePathData:  unl:gnx://leoPy.leo#ekr.20230630132341.1

    //     path = g.os_path_finalize_join(g.app.loadDir, 'leoGlobals.py')
    //     msg = repr(path)
    //     self.assertTrue(os.path.exists(path), msg=msg)
    //     self.assertTrue(os.path.isabs(path), msg=msg)
    //     self.assertTrue(os.path.isfile(path), msg=msg)
    //     findUnl_gnx = 'ekr.20230626064652.1'
    //     x = GitDiffController(c=self.c)
    //     x.node_history(path, gnx=findUnl_gnx)
    //@+node:felix.20230715215852.3: *3* TestEditFileCommands.test_diff_two_branches
    test('test_diff_two_branches', () => {
        console.log('TODO : test_diff_two_branches');

    });

    // def test_diff_two_branches(self):
    //     c = self.c
    //     u = c.undoer
    //     x = GitDiffController(c=c)

    //     # Setup the outline.
    //     root = c.rootPosition()
    //     root.h = '@file leoGlobals.py'
    //     root.deleteAllChildren()
    //     while root.hasNext():
    //         root.next().doDelete()
    //     c.selectPosition(root)

    //     # Run the test in the leo-editor directory (the parent of the .git directory).
    //     try:
    //         # Change directory.
    //         new_dir = g.finalize_join(g.app.loadDir, '..', '..')
    //         old_dir = os.getcwd()
    //         os.chdir(new_dir)

    //         # Run the command, suppressing output from git.
    //         expected_last_headline = 'git-diff-branches master devel'
    //         try:
    //             sys.stdout = open(os.devnull, 'w')
    //             x.diff_two_branches(
    //                 branch1='master',
    //                 branch2='devel',
    //                 fn='leo/core/leoGlobals.py'  # Don't use backslashes.
    //             )
    //         finally:
    //             sys.stdout = sys.__stdout__
    //         self.assertEqual(c.lastTopLevel().h, expected_last_headline)
    //         u.undo()
    //         self.assertEqual(c.lastTopLevel(), root)
    //         u.redo()
    //         self.assertEqual(c.lastTopLevel().h, expected_last_headline)
    //     finally:
    //         os.chdir(old_dir)
    //@+node:felix.20230715215852.4: *3* TestEditFileCommands.verbose_test_git_diff
    test('verbose_test_git_diff', () => {
        console.log('TODO : verbose_test_git_diff');

    });

    // def verbose_test_git_diff(self):
    //     # Don't run this test by default.
    //     # It can spew random git messages depending on the state of the repo.
    //     c = self.c
    //     u = c.undoer
    //     x = GitDiffController(c=c)

    //     # Setup the outline.
    //     root = c.rootPosition()
    //     while root.hasNext():
    //         root.next().doDelete()
    //     c.selectPosition(root)

    //     expected_last_headline = 'git diff HEAD'
    //     # Run the command, suppressing git messages.
    //     # Alas, this suppression does not work.
    //     try:
    //         sys.stdout = open(os.devnull, 'w')
    //         x.git_diff()
    //     finally:
    //         sys.stdout = sys.__stdout__
    //     self.assertTrue(c.lastTopLevel().h.startswith(expected_last_headline))
    //     # Test undo/redo.
    //     u.undo()
    //     self.assertEqual(c.lastTopLevel(), root)
    //     u.redo()
    //     self.assertTrue(c.lastTopLevel().h.startswith(expected_last_headline))
    //@+node:felix.20230715215852.5: *3* TestEditFileCommands.test_diff_two_revs
    test('test_diff_two_revs', () => {
        console.log('TODO : test_diff_two_revs');

    });


    // def test_diff_two_revs(self):
    //     c = self.c
    //     u = c.undoer
    //     x = GitDiffController(c=c)

    //     # Setup the outline.
    //     root = c.rootPosition()
    //     while root.hasNext():
    //         root.next().doDelete()
    //     c.selectPosition(root)

    //     # Run the command.
    //     expected_last_headline = 'git diff revs: HEAD'
    //     try:
    //         sys.stdout = open(os.devnull, 'w')
    //         x.diff_two_revs()
    //     finally:
    //         sys.stdout = sys.__stdout__
    //     self.assertEqual(c.lastTopLevel().h.strip(), expected_last_headline)
    //     # Test undo/redo.
    //     u.undo()
    //     self.assertEqual(c.lastTopLevel(), root)
    //     u.redo()
    //     self.assertEqual(c.lastTopLevel().h.strip(), expected_last_headline)
    //@-others

});
//@-others
//@-leo
