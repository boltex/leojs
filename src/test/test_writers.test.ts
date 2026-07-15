//@+leo-ver=5-thin
//@+node:felix.20230923150253.1: * @file src/test/test_writers.test.ts

import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { BaseWriter } from '../writers/basewriter';
import { DartWriter } from '../writers/dart';
import { RstWriter } from '../writers/leo_rst';
import { TreePad_Writer } from '../writers/treepad';
import { Position } from '../core/leoNodes';
import { MarkdownWriter } from '../writers/markdown';
import { Markdown_Importer } from '../importers/markdown';

//@+others
//@+node:felix.20230923152630.1: ** base class
/**
 * The base class for all tests of Leo's writer plugins.
 */
export class BaseTestWriter extends LeoUnitTest {

    //@+others
    //@+node:felix.20260713222027.1: *3* TestMDWriter.render_markdown
    public render_markdown(root: Position) {
        const writer = new MarkdownWriter(this.c);
        writer.write(root);
        return this.c.atFileCommands.outputList.join('');
    }

    //@-others

}

//@+node:felix.20230923153010.1: ** suite TestBaseWriter
/**
 * Test cases for the BaseWriter class.
 */
suite('TestBaseWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923153010.2: *3* TestBaseWriter.test_put_node_sentinel
    test('test_put_node_sentinel', () => {

        const c = self.c;
        const root = self.c.p;
        const at = c.atFileCommands;
        const x = new BaseWriter(c);
        const table: [string, string | undefined][] = [
            ['#', undefined],
            ['<--', '-->'],
        ];
        const child = root.insertAsLastChild();
        child.h = 'child';
        const grandchild = child.insertAsLastChild();
        grandchild.h = 'grandchild';
        const greatgrandchild = grandchild.insertAsLastChild();
        greatgrandchild.h = 'greatgrandchild';
        for (const p of [root, child, grandchild, greatgrandchild]) {
            for (let [delim1, delim2] of table) {
                at.outputList = [];
                x.put_node_sentinel(p, delim1, delim2);
            }
        }
    });
    //@-others

});
//@+node:felix.20230923154042.1: ** suite TestDartWriter
/**
 * Test Cases for the dart writer plugin.
 */
suite('TestDartWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923154042.2: *3* TestDartWriter.test_dart_writer
    test('test_dart_writer', () => {
        const c = self.c;
        const root = self.c.p;
        const child = root.insertAsLastChild();
        child.h = 'h';
        child.b = 'dart line 1\ndart_line2\n';
        const x = new DartWriter(c);
        x.write(root);
    });
    //@-others

});
//@+node:felix.20260713221547.1: ** suite TestMDWriter
/**
 *  Test Cases for the markdown writer plugin.
 */


suite('TestMDWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20260713221547.3: *3* TestMDWriter.test_markdown_sections
    test('test_markdown_sections', () => {

        const c = self.c;
        const root = self.c.p;

        //@+<< define contents: test_markdown_sections >>
        //@+node:felix.20260713221547.4: *4* << define contents: test_markdown_sections >>
        const contents =
            `
            # 1st level title X

            some text in body X

            ## 2nd level title Z

            some text in body Z

            # 1st level title A

            ## 2nd level title B

            some body content of the 2nd node
        `.trim() + '\n';  // End the last node with '\n'.
        //@-<< define contents: test_markdown_sections >>

        // Import contents into root's tree.
        const importer = new Markdown_Importer(c);
        importer.import_from_string(root, contents);

        if (0) {
            for (const z of root.self_and_subtree()) {
                g.printObj(g.splitLines(z.b), z.h);
            }
            g.pr('\n=== End dump ===\n');
        }

        // Write the tree.
        const writer = new MarkdownWriter(c);
        writer.write(root);
        const results_list = c.atFileCommands.outputList;
        const results_s = results_list.join('');

        if (contents !== results_s) {
            g.printObj(contents, 'contents');
            g.printObj(results_s, 'results_s');
        }
        assert.strictEqual(results_s, contents);

    });
    //@+node:felix.20260713221547.5: *3* TestMDWriter.test_markdown_image
    test('test_markdown_image', () => {

        const c = self.c;
        const root = self.c.p;

        //@+<< define contents: test_markdown_image >>
        //@+node:felix.20260713221547.6: *4* << define contents: test_markdown_image >>
        const contents = `
            declaration text

            # ![label](https://raw.githubusercontent.com/boltext/leojs/master/resources/leoapp.png)

            Body text
        `.trim() + '\n'; // End the last node with '\n'.
        //@-<< define contents: test_markdown_image >>

        // Import contents into root's tree.
        const importer = new Markdown_Importer(c);
        importer.import_from_string(root, contents);

        if (0) {
            for (const z of root.self_and_subtree()) {
                g.printObj(g.splitLines(z.b), z.h);
            }
            g.pr('\n=== End dump ===\n');
        }

        // Write the tree.
        const writer = new MarkdownWriter(c);
        writer.write(root);
        const results_list = c.atFileCommands.outputList;
        const results_s = results_list.join('');

        if (contents !== results_s) {
            g.printObj(contents, 'contents');
            g.printObj(results_s, 'results_s');
        }
        assert.strictEqual(results_s, contents);

    });
    //@+node:felix.20260713221547.7: *3* TestMDWriter.test_markdown_noheader_leaf
    test('test_markdown_noheader_leaf', () => {

        const root = self.c.p;

        const hidden = root.insertAsLastChild();
        hidden.h = 'Hidden leaf';
        hidden.b = '@noheader\nLeaf body\n';

        const visible = root.insertAsLastChild();
        visible.h = 'Visible sibling';
        visible.b = 'Visible body\n';

        const results_s = self.render_markdown(root);

        assert.strictEqual(
            results_s,
            '<!-- leo-noheader level=1 headline=Hidden%20leaf -->\n' +
            'Leaf body\n' +
            '# Visible sibling\n' +
            'Visible body\n'
        );

        assert.ok(
            !results_s.includes('@noheader'),
            'results_s should not contain "@noheader"',
        );


    });

    //@+node:felix.20260713221547.8: *3* TestMDWriter.test_markdown_noheader_intermediate
    test('test_markdown_noheader_intermediate', () => {

        const root = self.c.p;

        const hidden = root.insertAsLastChild();
        hidden.h = 'Hidden parent';
        hidden.b = '@noheader\nParent body\n';

        const child = hidden.insertAsLastChild();
        child.h = 'Visible child';
        child.b = 'Child body\n';

        const sibling = root.insertAsLastChild();
        sibling.h = 'Visible sibling';
        sibling.b = 'Sibling body\n';

        const results_s = self.render_markdown(root);

        assert.strictEqual(
            results_s,
            '<!-- leo-noheader level=1 headline=Hidden%20parent -->\n' +
            'Parent body\n' +
            '## Visible child\n' +
            'Child body\n' +
            '# Visible sibling\n' +
            'Sibling body\n'
        );

        assert.ok(
            !results_s.includes('@noheader'),
            'results_s should not contain "@noheader"',
        );
        assert.ok(
            !results_s.includes('# Hidden parent\n'),
            'results_s should not contain "# Hidden parent\\n"',
        );

    });
    //@+node:felix.20260713221547.9: *3* TestMDWriter.test_placeholders
    test('test_markdown_placeholders', () => {

        const c = self.c;
        const root = self.c.p;

        //@+<< define contents: test_markdown_placeholders >>
        //@+node:felix.20260713221547.10: *4* << define contents: test_markdown_placeholders >>
        // There must be two newlines after each node.
        const contents = ` 
            # Level 1

            Level 1 text.

            ### Level 3

            Level 3 text.
        `.trim() + '\n';  // End the last node with '\n'.
        //@-<< define contents: test_markdown_placeholders >>

        // Import contents into root's tree.
        const importer = new Markdown_Importer(c);
        importer.import_from_string(root, contents);

        if (0) {
            for (const z of root.self_and_subtree()) {
                g.printObj(g.splitLines(z.b), z.h);
            }
            g.pr('\n=== End dump ===\n');
        }

        // Write the tree.
        const writer = new MarkdownWriter(c);
        writer.write(root);
        const results_list = c.atFileCommands.outputList;
        const results_s = results_list.join('');

        if (contents !== results_s) {
            g.printObj(contents, 'contents');
            g.printObj(results_s, 'results_s');
        }
        assert.strictEqual(results_s, contents);

    });
    //@-others

});


//@+node:felix.20230923154219.1: ** suite TestRstWriter
/**
 * Test Cases for the leo_rst writer plugin.
 */
suite('TestRstWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923154219.2: *3* TestRstWriter.test_rst_writer
    test('test_rst_writer', () => {
        const c = self.c;
        const root = self.c.p;
        const child = root.insertAsLastChild();
        child.h = 'h';
        // For full coverage, we don't want a leading newline.
        child.b = g.dedent(`\
            .. toc

            ====
            top
            ====

            The top section

            section 1
            ---------

            section 1, line 1
            --
            section 1, line 2

            section 2
            ---------

            section 2, line 1

            section 2.1
            ~~~~~~~~~~~

            section 2.1, line 1

            section 2.1.1
            .............

            section 2.2.1 line 1

            section 3
            ---------

            section 3, line 1

            section 3.1.1
            .............

            section 3.1.1, line 1
        `);  // No newline, on purpose.
        const x = new RstWriter(c);
        x.write(root);

    });
    //@-others

});
//@+node:felix.20230923154224.1: ** suite TestTreepadWriter
/**
 * Test Cases for the treepad writer plugin.
 */
suite('TestTreepadWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923154224.2: *3* TestTreepadWriter.test_treepad_writer
    test('test_treepad_writer', () => {
        const c = self.c;
        const root = self.c.p;
        const child = root.insertAsLastChild();
        child.h = 'h';
        child.b = 'line 1\nline2\n';
        const x = new TreePad_Writer(c);
        x.write(root);
    });
    //@-others

});
//@-others
//@-leo
