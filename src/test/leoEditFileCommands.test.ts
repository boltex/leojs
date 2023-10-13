//@+leo-ver=5-thin
//@+node:felix.20230715191137.1: * @file src/test/leoEditFileCommands.test.ts
/**
 * Unit tests for Leo's edit file commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { GitDiffController } from '../commands/editFileCommands';

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
    test('slow_test_gdc_node_history', async () => {
        // These links are valid within leoPy.leo on EKR's machine.
        // g.findUnl:        unl:gnx://leoPy.leo#ekr.20230626064652.1
        // g.parsePathData:  unl:gnx://leoPy.leo#ekr.20230630132341.1

        // SKIPPED : DOES NOT START WITH 'test'
        return;

        console.log('g.app.loadDir', g.app.loadDir);

        const w_path = g.os_path_finalize_join(g.app.loadDir || '', 'src', 'core', 'leoGlobals.ts');

        console.log('so w_path is ', w_path);

        const msg = w_path.toString();
        let w_exists = await g.os_path_exists(w_path);
        assert.ok(w_exists, msg);

        assert.ok(g.os_path_isabs(w_path), msg);

        const w_isFile = g.os_path_isfile(w_path);

        assert.ok(w_isFile, msg);

        const x = new GitDiffController(self.c);
        const gnxs = [
            // 'ekr.20230626064652.1',  // EKR's replacement gnx
            // 'tbrown.20140311095634.15188',  // Terry's original node.
            'felix.20211104212426.1',
            'felix.20211104212328.1',  // TODO : MAKE BETTER TEST WITH A NODE THAT HAS CHANGED GNX!
        ];
        await x.node_history(w_path, gnxs, 30);
        // self.dump_tree(tag='slow_test_gdc_node_history')

    });
    //@+node:felix.20230715215852.3: *3* TestEditFileCommands.test_diff_two_branches
    test('test_diff_two_branches', async () => {

        const c = self.c;
        const u = c.undoer;
        const x = new GitDiffController(c);

        // Setup the outline.
        const root = c.rootPosition()!;
        // root.h = '@file leoGlobals.py';
        root.h = '@file src/core/leoGlobals.ts';
        root.deleteAllChildren();
        while (root.hasNext()) {
            root.next().doDelete();
        }

        c.selectPosition(root);

        // Run the test in the leo-editor directory (the parent of the .git directory).
        try {
            // Change directory.
            // const new_dir = g.finalize_join(g.app.loadDir!, '..', '..');
            // const old_dir = os.getcwd();
            // os.chdir(new_dir);

            console.log(' TRYING TO GIT DIFF TWO BRANCHES FOR FILENAME: ', c.fileName());

            // Run the command, suppressing output from git.
            const expected_last_headline = 'git-diff-branches master devel';

            try {
                // LEOJS : NOT NEEDED
                // sys.stdout = open(os.devnull, 'w')
                await x.diff_two_branches(
                    // 'master',
                    // 'devel',
                    // 'leo/core/leoGlobals.py'  // Don't use backslashes.
                    'master',
                    'devel',
                    'leo/core/leoGlobals.ts'  // Don't use backslashes.
                );
            }
            catch (e) {
                //
            }
            finally {
                // LEOJS : NOT NEEDED
                // sys.stdout = sys.__stdout__
            }
            // #3497: Silently skip the test if nothing has changed.
            if (c.lastTopLevel().__eq__(root)) {
                return;
            }
            assert.strictEqual(c.lastTopLevel().h, expected_last_headline);
            u.undo();
            assert.ok(c.lastTopLevel().__eq__(root));
            u.redo();
            assert.strictEqual(c.lastTopLevel().h, expected_last_headline);

        }
        catch (e) {
            //
        }
        finally {
            // os.chdir(old_dir);
        }

    });
    //@+node:felix.20230715215852.4: *3* TestEditFileCommands.verbose_test_git_diff
    test('verbose_test_git_diff', async () => {

        // SKIPPED : DOES NOT START WITH 'test'
        return;

        // Don't run this test by default.
        // It can spew random git messages depending on the state of the repo.
        const c = self.c;
        const u = c.undoer;
        const x = new GitDiffController(c);

        // Setup the outline.
        const root = c.rootPosition()!;
        while (root.hasNext()) {
            root.next().doDelete();
        }
        c.selectPosition(root);

        const expected_last_headline = 'git diff HEAD';
        // Run the command, suppressing git messages.
        // Alas, this suppression does not work.
        try {
            // sys.stdout = open(os.devnull, 'w')
            await x.git_diff();
        }
        catch (e) {
            //
        } finally {
            // sys.stdout = sys.__stdout__
        }
        assert.ok(c.lastTopLevel().h.startsWith(expected_last_headline));
        // Test undo/redo.
        u.undo();
        assert.ok(c.lastTopLevel().__eq__(root));
        u.redo();
        assert.ok(c.lastTopLevel().h.startsWith(expected_last_headline));

    });
    //@+node:felix.20230715215852.5: *3* TestEditFileCommands.test_diff_two_revs
    test('test_diff_two_revs', async () => {
        const c = self.c;
        const u = c.undoer;
        const x = new GitDiffController(c);

        // Setup the outline.
        const root = c.rootPosition()!;
        while (root.hasNext()) {
            root.next().doDelete();
        }
        c.selectPosition(root);

        // Run the command.
        const expected_last_headline = 'git diff revs: HEAD';

        try {
            // sys.stdout = open(os.devnull, 'w')
            await x.diff_two_revs();
        }
        catch (e) {
            //
        } finally {
            // sys.stdout = sys.__stdout__
        }
        // #3497: Silently skip the test if nothing has changed.
        if (c.lastTopLevel().__eq__(root)) {
            return;
        }
        assert.strictEqual(c.lastTopLevel().h.trim(), expected_last_headline);
        // Test undo/redo.
        u.undo();
        assert.ok(c.lastTopLevel().__eq__(root));
        u.redo();
        assert.strictEqual(c.lastTopLevel().h.trim(), expected_last_headline);
    });

    //@-others

});
//@-others
//@-leo
