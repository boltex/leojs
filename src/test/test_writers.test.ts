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
/*
class TestMDWriter(BaseTestWriter):
    """Test Cases for the markdown writer plugin."""

    //@+others
    //@+node:felix.20260713221547.3: *3* TestMDWriter.test_markdown_sections
    def test_markdown_sections(self):
        c, root = self.c, self.c.p
        //@+<< define contents: test_markdown_sections >>
        //@+node:felix.20260713221547.4: *4* << define contents: test_markdown_sections >>
        contents = (
            """
            # 1st level title X

            some text in body X

            ## 2nd level title Z

            some text in body Z

            # 1st level title A

            ## 2nd level title B

            some body content of the 2nd node
        """.strip()
            + '\n'
        )  # End the last node with '\n'.
        //@-<< define contents: test_markdown_sections >>

        # Import contents into root's tree.
        importer = Markdown_Importer(c)
        importer.import_from_string(parent=root, s=contents)

        if 0:
            for z in root.self_and_subtree():
                g.printObj(g.splitLines(z.b), tag=z.h)
            print('\n=== End dump ===\n')

        # Write the tree.
        writer = MarkdownWriter(c)
        writer.write(root)
        results_list = c.atFileCommands.outputList
        results_s = ''.join(results_list)
        if contents != results_s:
            g.printObj(contents, tag='contents')
            g.printObj(results_s, tag='results_s')
        self.assertEqual(results_s, contents)

    //@+node:felix.20260713221547.5: *3* TestMDWriter.test_markdown_image
    def test_markdown_image(self):
        c, root = self.c, self.c.p
        //@+<< define contents: test_markdown_image >>
        //@+node:felix.20260713221547.6: *4* << define contents: test_markdown_image >>
        contents = (
            """
            declaration text

            # ![label](https://raw.githubusercontent.com/boltext/leojs/master/resources/leoapp.png)

            Body text
        """.strip()
            + '\n'
        )  # End the last node with '\n'.
        //@-<< define contents: test_markdown_image >>

        # Import contents into root's tree.
        importer = Markdown_Importer(c)
        importer.import_from_string(parent=root, s=contents)

        if 0:
            for z in root.self_and_subtree():
                g.printObj(g.splitLines(z.b), tag=z.h)
            print('\n=== End dump ===\n')

        # Write the tree.
        writer = MarkdownWriter(c)
        writer.write(root)
        results_list = c.atFileCommands.outputList
        results_s = ''.join(results_list)
        if contents != results_s:
            g.printObj(contents, tag='contents')
            g.printObj(results_s, tag='results_s')
        self.assertEqual(results_s, contents)

    //@+node:felix.20260713221547.7: *3* TestMDWriter.test_markdown_noheader_leaf
    def test_markdown_noheader_leaf(self):
        root = self.c.p
        hidden = root.insertAsLastChild()
        hidden.h = 'Hidden leaf'
        hidden.b = '@noheader\nLeaf body\n'
        visible = root.insertAsLastChild()
        visible.h = 'Visible sibling'
        visible.b = 'Visible body\n'

        results_s = self.render_markdown(root)
        self.assertEqual(
            results_s,
            '<!-- leo-noheader level=1 headline=Hidden%20leaf -->\n'
            'Leaf body\n'
            '# Visible sibling\n'
            'Visible body\n',
        )
        self.assertNotIn('@noheader', results_s)

    //@+node:felix.20260713221547.8: *3* TestMDWriter.test_markdown_noheader_intermediate
    def test_markdown_noheader_intermediate(self):
        root = self.c.p
        hidden = root.insertAsLastChild()
        hidden.h = 'Hidden parent'
        hidden.b = '@noheader\nParent body\n'
        child = hidden.insertAsLastChild()
        child.h = 'Visible child'
        child.b = 'Child body\n'
        sibling = root.insertAsLastChild()
        sibling.h = 'Visible sibling'
        sibling.b = 'Sibling body\n'

        results_s = self.render_markdown(root)
        self.assertEqual(
            results_s,
            '<!-- leo-noheader level=1 headline=Hidden%20parent -->\n'
            'Parent body\n'
            '## Visible child\n'
            'Child body\n'
            '# Visible sibling\n'
            'Sibling body\n',
        )
        self.assertNotIn('# Hidden parent\n', results_s)
        self.assertNotIn('@noheader', results_s)

    //@+node:felix.20260713221547.9: *3* TestMDWriter.test_placeholders
    def test_markdown_placeholders(self):
        c, root = self.c, self.c.p
        //@+<< define contents: test_markdown_placeholders >>
        //@+node:felix.20260713221547.10: *4* << define contents: test_markdown_placeholders >>
        # There must be two newlines after each node.
        contents = (
            """
            # Level 1

            Level 1 text.

            ### Level 3

            Level 3 text.
        """.strip()
            + '\n'
        )  # End the last node with '\n'.
        //@-<< define contents: test_markdown_placeholders >>

        # Import contents into root's tree.
        importer = Markdown_Importer(c)
        importer.import_from_string(parent=root, s=contents)

        if 0:
            for z in root.self_and_subtree():
                g.printObj(g.splitLines(z.b), tag=z.h)
            print('\n=== End dump ===\n')

        # Write the tree.
        writer = MarkdownWriter(c)
        writer.write(root)
        results_list = c.atFileCommands.outputList
        results_s = ''.join(results_list)
        if contents != results_s:
            g.printObj(contents, tag='contents')
            g.printObj(results_s, tag='results_s')
        self.assertEqual(results_s, contents)

    //@-others


*/

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
