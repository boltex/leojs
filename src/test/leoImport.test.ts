//@+leo-ver=5-thin
//@+node:felix.20220129003526.1: * @file src/test/leoImport.test.ts
/**
 * Tests of leoImport.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { BaseTestImporter } from './test_importers.test';
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

        // Don't call run_test.
        self.check_outline(
            target,
            [
                [0, '',  // Ignore the top-level headline.
                    ''
                ],
                [1, 'a1', ''],
                [1, 'a2', ''],
            ]
        );
    });
    //@+node:felix.20230528193654.3: *3* TestLeoImport.test_python_importer_parse_body
    test('test_python_importer_parse_body', () => {
        const c = self.c;
        const u = c.undoer;
        const x = c.importCommands;
        const target = c.p.insertAfter();
        c.selectPosition(target);
        target.h = 'target';

        const body_1 = g.dedent(
            `
            import os

            def spam():
                """A docstring"""
                print('a string')

            def eggs():
                pass

            class NewClass:
                def f1(self):
                    pass
        `).trim() + '\n';
        target.b = body_1;

        x.parse_body(target);

        const expected_results: [number, string, string][] = [
            [0, 'def spam',
                'import os\n' +
                '\n' +
                'def spam():\n' +
                '    """A docstring"""\n' +
                "    print('a string')\n" +
                '\n'
            ],
            [0, 'def eggs',
                'def eggs():\n' +
                '    pass\n' +
                '\n'
            ],
            [0, 'class NewClass',
                'class NewClass\n' +
                '    def f1(self):\n' +
                '        pass\n'
            ],
        ];
        // Don't call run_test.
        self.check_outline(target, expected_results);

        // Test undo
        u.undo();
        assert.strictEqual(target.b, body_1, 'undo test');
        assert.ok(!target.hasChildren(), 'undo test');
        // Test redo
        u.redo();
        self.check_outline(target, expected_results,);

    });

    //@+node:felix.20250814005317.1: *3* TestLeoImport.test_rust_importer_parse_body
    test('test_rust_importer_parse_body', () => {

        const c = self.c;
        const u = c.undoer;
        const x = c.importCommands;
        const target = c.p.insertAfter();
        c.selectPosition(target);
        target.h = 'target';

        const body_1 = g.dedent(
            `
            @language rust

            fn spam() {
                println!("spam");
            }

            fn eggs() {
                println!("eggs");
            }
        `).trim() + '\n';
        target.b = body_1;

        x.parse_body(target);

        const expected_results: [number, string, string][] = [
            [0, 'fn spam',
                '@language rust\n' +
                '\n' +
                'fn spam() {\n' +
                '    println!("spam");\n' +
                '}\n' +
                '\n'
            ],
            [0, 'fn eggs',
                'fn eggs() {\n' +
                '    println!("eggs");\n' +
                '}\n' +
                '\n'
            ],
        ];
        // Don't call run_test.
        self.check_outline(target, expected_results);

        // Test undo
        u.undo();
        assert.strictEqual(target.b, body_1, 'undo test');
        assert.ok(!target.hasChildren(), 'undo test');
        // Test redo
        u.redo();
        self.check_outline(target, expected_results,);
    });
    //@+node:felix.20230728212943.1: *3* TestLeoImport.slow_test_ric_run
    test('slow_test_ric_run', async () => {

        // ! SKIPPED IN LEO BECAUSE NAME DOES NOT START WITH 'test' !
        return;

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

        for (const kind of ['@clean', '@file']) {
            const x = new RecursiveImportController(
                c,
                dir_,
                undefined,
                kind,
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
