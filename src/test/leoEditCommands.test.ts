//@+leo-ver=5-thin
//@+node:felix.20230715191134.1: * @file src/test/leoEditCommands.test.ts
/**
 * Unit tests for Leo's edit commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715214158.1: ** suite
suite('Test cases for editCommands.ts', () => {

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
    //@+node:felix.20230715235308.1: *3* extend-to-word
    test('test_extend_to_word', () => {
        console.log('TODO : test_extend_to_word');
        
    });

    // def test_extend_to_word(self):
    //     """Test case for extend-to-word"""
    //     before_b = """\
    // first line
    // line 1
    //     line_24a a
    //         line b
    // line c
    // last line
    // """
    //     after_b = """\
    // first line
    // line 1
    //     line_24a a
    //         line b
    // line c
    // last line
    // """
    //     self.run_test(
    //         before_b=before_b,
    //         after_b=after_b,
    //         before_sel=("3.10", "3.10"),
    //         after_sel=("3.4", "3.12"),
    //         command_name="extend-to-word",
    //     )
    //@+node:felix.20230715234952.1: *3* merge-node-with-next-node
    test('test_merge_node_with_next_node', () => {
        console.log('TODO : test_merge_node_with_next_node');
        
    });

    // def test_merge_node_with_next_node(self):
    //     c, u = self.c, self.c.undoer
    //     prev_b = textwrap.dedent("""\
    // def spam():
    //     pass
    // """)
    //     next_b = textwrap.dedent("""\
    // spam2 = spam
    // """)
    //     result_b = textwrap.dedent("""\
    // def spam():
    //     pass

    // spam2 = spam
    // """)
    //     self.before_p.b = prev_b
    //     self.after_p.b = next_b
    //     c.selectPosition(self.before_p)
    //     # Delete 'before', select 'after'
    //     c.k.simulateCommand('merge-node-with-next-node')
    //     self.assertEqual(c.p.h, 'after')
    //     self.assertEqual(c.p.b, result_b)
    //     self.assertFalse(c.p.next())
    //     # Restore 'before', select, 'before'.
    //     u.undo()
    //     self.assertEqual(c.p.h, 'before')
    //     self.assertEqual(c.p.b, prev_b)
    //     self.assertEqual(c.p.next().h, 'after')
    //     self.assertEqual(c.p.next().b, next_b)
    //     u.redo()
    //     self.assertEqual(c.p.h, 'after')
    //     self.assertEqual(c.p.b, result_b)
    //     self.assertFalse(c.p.next())
    //@+node:felix.20230715235006.1: *3* merge-node-with-prev-node
    test('test_merge_node_with_prev_node', () => {
        console.log('TODO : test_merge_node_with_prev_node');
        
    });

    def test_merge_node_with_prev_node(self):
        c, u = self.c, self.c.undoer
        prev_b = textwrap.dedent("""\
    def spam():
        pass
    """)
        next_b = textwrap.dedent("""\
    spam2 = spam
    """)
        result_b = textwrap.dedent("""\
    def spam():
        pass

    spam2 = spam
    """)
        self.before_p.b = prev_b
        self.after_p.b = next_b
        c.selectPosition(self.after_p)
        # Delete 'after', select 'before'
        c.k.simulateCommand('merge-node-with-prev-node')
        self.assertEqual(c.p.h, 'before')
        self.assertEqual(c.p.b, result_b)
        self.assertFalse(c.p.next())
        # Restore 'after', select, 'after'.
        u.undo()
        self.assertEqual(c.p.h, 'after')
        self.assertEqual(c.p.b, next_b)
        self.assertEqual(c.p.back().h, 'before')
        self.assertEqual(c.p.back().b, prev_b)
        u.redo()
        self.assertEqual(c.p.h, 'before')
        self.assertEqual(c.p.b, result_b)
        self.assertFalse(c.p.next())
    //@-others

});
//@-others
//@-leo
