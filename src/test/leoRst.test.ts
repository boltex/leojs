//@+leo-ver=5-thin
//@+node:felix.20230528205401.2: * @file src/test/leoRst.test.ts
/**
 * Tests of leoRst.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';

// TODO : DOCUTILS
//import * as docutils from "xxx"

const docutils = false;
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230530003957.1: ** suite TestRst (LeoUnitTest)
suite('A class to run rst-related unit tests.', () => {
    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();

        // TODO : DOCUTILS
        // if not docutils:
        //     self.skipTest('no docutils')

        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230530003957.2: *3* TestRst.test_at_no_head
    test('test_at_no_head', async () => {
        const c = self.c;
        const rc = c.rstCommands;
        // Create the *input* tree.
        const root = c.rootPosition()!.insertAfter();
        const fn = '@rst test.html';
        root.h = fn;
        const child = root.insertAsLastChild();
        child.h = '@rst-no-head section';
        // Insert the body texts.  Overindent to eliminate @verbatim sentinels.
        root.b = g.dedent(`\
            #####
            Title
            #####

            This is test.html

            `);
        child.b = g.dedent(`\
            This is the body of the section.
            `);
        // Define the expected output.
        const expected = g.dedent(`\
            .. rst3: filename: ${fn}

            .. _http-node-marker-1:

            #####
            Title
            #####

            This is test.html

            This is the body of the section.

        `);
        // Get and check the rst result.
        rc.nodeNumber = 0;
        rc.http_server_support = true;  // Override setting for testing.
        const source = rc.write_rst_tree(root, fn);
        assert.strictEqual(source, expected);
        // Get the html from docutils.
        const html = await rc.writeToDocutils(source, '.html');
        // Don't bother testing the html. It will depend on docutils.
        assert(html && html.startsWith('<?xml') && html.trim().endsWith('</html>'));

    });
    //@+node:felix.20230530003957.3: *3* TestRst.test_handleMissingStyleSheetArgs
    test('test_handleMissingStyleSheetArgs', () => {

        const c = self.c;
        const x = c.rstCommands;
        let result = x.handleMissingStyleSheetArgs(undefined);
        assert.ok(Object.keys(result).length === 0);
        const expected: { [key: string]: string; } = {
            'documentoptions': '[english,12pt,lettersize]',
            'language': 'ca',
            'use-latex-toc': '1',
        };
        for (let s of [
            '--language=ca, --use-latex-toc,--documentoptions=[english,12pt,lettersize]',
            '--documentoptions=[english,12pt,lettersize],--language=ca, --use-latex-toc',
            '--use-latex-toc,--documentoptions=[english,12pt,lettersize],--language=ca, ',
        ]) {
            result = x.handleMissingStyleSheetArgs(s);
            assert.ok(
                Object.keys(result).length === Object.keys(expected).length &&
                Object.keys(result).sort().every((value: string, index: number) => {
                    return value === expected[Object.keys(result).sort()[index]];
                })
                // result, expected
            );
        }
    });
    //@+node:felix.20230530003957.4: *3* TestRst.test_unicode_characters
    test('test_unicode_characters', async () => {

        const c = self.c;
        const rc = c.rstCommands;
        // Create the *input* tree.
        const root = c.rootPosition()!.insertAfter();
        const fn = '@rst unicode_test.html';
        root.h = fn;
        // Insert the body text.  Overindent to eliminate @verbatim sentinels.
        root.b = g.dedent(`\
            Test of unicode characters: ÀǋϢﻙ

            End of test.
        `);
        // Define the expected output.
        const expected = g.dedent(`\
            .. rst3: filename: {fn}

            .. _http-node-marker-1:

            Test of unicode characters: ÀǋϢﻙ

            End of test.

    `);
        // Get and check the rst result.
        rc.nodeNumber = 0;
        rc.http_server_support = true;  // Override setting for testing.
        const source = rc.write_rst_tree(root, fn);
        assert.strictEqual(source, expected);
        // Get the html from docutils.
        const html = await rc.writeToDocutils(source, '.html');
        // Don't bother testing the html. It will depend on docutils.
        assert(html && html.startsWith('<?xml') && html.trim().endsWith('</html>'));

    });
    //@+node:felix.20230530003957.5: *3* TestRst.write_logic
    test('test_write_to_docutils', async () => {

        const c = self.c;
        const rc = c.rstCommands;
        // Create the *input* tree.
        const root = c.rootPosition()!.insertAfter();
        const fn = '@rst test.html';
        root.h = fn;
        const child = root.insertAsLastChild();
        child.h = 'section';
        // Insert the body texts.  Overindent to eliminate @verbatim sentinels.
        root.b = g.dedent(`\
            @language rest

            #####
            Title
            #####

            This is test.html
        `);
        child.b = g.dedent(`\
            @ This is a doc part
            it has two lines.
            @c
            This is the body of the section.
        `);
        // Define the expected output.
        const expected = g.dedent(`\
            .. rst3: filename: {fn}

            .. _http-node-marker-1:

            @language rest

            #####
            Title
            #####

            This is test.html

            .. _http-node-marker-2:

            section
            +++++++

            @ This is a doc part
            it has two lines.
            @c
            This is the body of the section.

    `);
        // Get and check the rst result.
        rc.nodeNumber = 0;
        rc.http_server_support = true;  // Override setting for testing.
        const source = rc.write_rst_tree(root, fn);
        assert.strictEqual(source, expected);
        // Get the html from docutils.
        const html = await rc.writeToDocutils(source, '.html');
        // Don't bother testing the html. It will depend on docutils.
        assert.ok(html && html.startsWith('<?xml') && html.trim().endsWith('</html>'));

    });
    //@-others
});
//@-others
//@-leo
