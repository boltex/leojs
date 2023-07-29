//@+leo-ver=5-thin
//@+node:felix.20220129003526.1: * @file src/test/leoImport.test.ts
/**
 * Tests of leoImport.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { BaseTestImporter } from './test_importers';
import { MindMapImporter, RecursiveImportController } from '../core/leoImport';

//@+others
//@+node:felix.20230528193654.1: ** suite TestLeoImport
suite('Test cases for leoImport.ts', () => {
    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
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
    //@+node:felix.20230528193654.2: *3* TestLeoImport.test_mind_map_importer
    test('test_mind_map_importer', async () => {
        const c = self.c;
        const target = c.p.insertAfter();
        target.h = 'target';

        const x = new MindMapImporter(c);
        const s = g.dedent(`\
            header1, header2, header3
            a1, b1, c1
            a2, b2, c2
        `);
        // const f = StringIO(s)
        // x.scan(f, target)
        await x.scan(s, target);
        // self.dump_tree(target, tag='Actual results...')

        // #2760: These results ignore way too much.

        self.check_outline(
            target,
            [
                [0, '',  // check_outline ignores the top-level headline.
                    ''
                ],
                [1, 'a1', ''],
                [1, 'a2', ''],
            ]
        );
    });
    //@+node:felix.20230528193654.3: *3* TestLeoImport.test_parse_body
    test('test_parse_body', () => {
        const c = self.c;
        const u = c.undoer;
        const x = c.importCommands;
        const target = c.p.insertAfter();
        target.h = 'target';

        const body_1 = g.dedent(
            `
            import os

            def macro(func):
                def new_func(*args, **kwds):
                    raise RuntimeError('blah blah blah')
            return new_func
        `).trim() + '\n';
        target.b = body_1;

        if (!Object.keys(g.app.classDispatchDict).length) {
            console.log("TODO FOR UNIT TEST: test_parse_body --> parse_importer_dict !");
            return;
        }

        x.parse_body(target);

        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the top-level headline.
                '<< target: preamble >>\n' +
                '@others\n' +
                'return new_func\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< target: preamble >>',
                'import os\n' +
                '\n'
            ],
            [1, 'def macro',
                'def macro(func):\n' +
                '    @others\n'
            ],
            [2, 'def new_func',
                'def new_func(*args, **kwds):\n' +
                "    raise RuntimeError('blah blah blah')\n"
            ],
        ];
        // Don't call run_test.
        self.check_outline(target, expected_results, true);

        // Test undo
        u.undo();
        assert.strictEqual(target.b, body_1, 'undo test');
        assert.ok(!target.hasChildren(), 'undo test');
        // Test redo
        u.redo();
        self.check_outline(target, expected_results, true);

    });

    //@+node:felix.20230728212935.1: *3* TestLeoImport.test_ric_minimize_headlines
    test('test_ric_minimize_headlines', () => {

        const c = self.c;
        const root = self.c.rootPosition()!;

        let dir_;
        if (g.isWindows) {
            dir_ = 'C:/Repos/non-existent-directory/mypy';
        } else {
            dir_ = '/Repos/non-existent-directory/mypy';
        }

        // minimize_headlines changes only headlines that start with dir_ or @<file> dir_.
        const table = [
            ['root', 'root'],
            [dir_, 'path: mypy'],
            [`${dir_}/test`, 'path: mypy/test'],
            [`${dir_}/xyzzy/test2`, 'path: mypy/xyzzy/test2'],
            [`@clean ${dir_}/x.py`, '@clean x.py'],
        ];

        if (!Object.keys(g.app.atAutoDict).length) {
            console.log("TODO FOR UNIT TEST: test_ric_minimize_headlines --> parse_importer_dict !");
            // return;
            console.log("WOULD HAVE RETURNED!");

        }

        const x = new RecursiveImportController(
            c,
            dir_,
            undefined,
            '@clean',
            true,
            false,
            ['.py'],
            false,
        );

        for (const [h, expected] of table) {
            root.h = h;
            x.minimize_headline(root);
            console.log('----------------------------- 1111111 ');
            assert.strictEqual(root.h, expected, h);
        }
        // Test that the recursive import only generates @<file> nodes containing absolute paths.
        for (const h of ['@file bad1.py', '@edit bad2.py']) {

            // with self.assertRaises(AssertionError, msg=h):
            try {
                root.h = h;
                console.log('----------------------------- 222222222 ');

                x.minimize_headline(root);

                assert.ok(false, h); // FAILS if this passes.
            } catch (e) {
                assert.ok(true, h); // Yay, we expected a throw.
            }

        }

    });
    //@+node:felix.20230728212943.1: *3* TestLeoImport.slow_test_ric_run
    test('slow_test_ric_run', async () => {

        const c = self.c;
        const u = c.undoer;

        // Setup.
        const root = c.rootPosition()!;
        root.deleteAllChildren();

        while (root.hasNext()) {
            root.next().doDelete();
        }
        c.selectPosition(root);
        assert.ok(c.lastTopLevel().__eq__(root));
        let dir_;
        if (1) {
            // 0.9 sec to import only leoGlobals.py
            dir_ = g.os_path_finalize_join(g.app.loadDir || '', 'leoGlobals.py');
        } else {
            // 4.1 sec. to import leo/core/*.py.
            dir_ = g.os_path_normpath(g.app.loadDir || '');
        }
        const w_exists = g.os_path_exists(dir_);
        assert.ok(w_exists, dir_);

        // Run the tests.
        const expected_headline = 'imported files';

        if (!Object.keys(g.app.atAutoDict).length) {
            console.log("TODO FOR UNIT TEST: slow_test_ric_run --> parse_importer_dict !");
            return;
        }

        for (const kind of ['@clean', '@file']) {
            const x = new RecursiveImportController(
                c,
                dir_,
                undefined,
                '@clean',
                true,
                true,
                ['.py'],
                false,
            );
            await x.run(dir_);
            assert.strictEqual(c.lastTopLevel().h, expected_headline);
            u.undo();
            assert.ok(c.lastTopLevel().__eq__(root));
            u.redo();
            assert.strictEqual(c.lastTopLevel().h, expected_headline);
            u.undo();
            assert.ok(c.lastTopLevel().__eq__(root));
        }
    });
    //@-others
});
//@-others
//@-leo
