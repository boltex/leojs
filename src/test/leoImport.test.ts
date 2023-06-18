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
import { MindMapImporter } from '../core/leoImport';

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
            ],
            true
        );
    });
    //@+node:felix.20230528193654.3: *3* TestLeoImport.test_parse_body
    test('test_parse_body', () => {
        const c = self.c;
        const x = c.importCommands;
        const target = c.p.insertAfter();
        target.h = 'target';
        target.b = g.dedent(
            `
            import os

            def macro(func):
                def new_func(*args, **kwds):
                    raise RuntimeError('blah blah blah')
            return new_func
        `).trim() + '\n';
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

    });
    //@-others
});
//@-others
//@-leo
