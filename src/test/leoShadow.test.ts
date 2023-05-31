//@+leo-ver=5-thin
//@+node:felix.20220129003553.1: * @file src/test/leoShadow.test.ts
/**
 * Tests of leoShadow.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230530004010.1: ** class TestAtShadow (LeoUnitTest)
class TestAtShadow(LeoUnitTest):
    //@+others
    //@+node:felix.20230530004010.2: *3*  TestShadow.setUp & helpers
    def setUp(self):
        """AtShadowTestCase.setup."""
        super().setUp()
        delims = '#', '', ''
        c = self.c
        base_dir = os.path.dirname(__file__)
        c.mFileName = g.finalize_join(base_dir, '..', '..', 'test666.leo')
        self.shadow_controller = ShadowController(c)
        self.marker = self.shadow_controller.Marker(delims)

    //@+node:felix.20230530004010.3: *4* TestShadow.deleteShadowDir (was a function)
    def deleteShadowDir(self, shadow_dir):
        if not g.os_path_exists(shadow_dir):
            return
        files = g.os_path_abspath(g.os_path_join(shadow_dir, "*.*"))
        files = glob.glob(files)
        for z in files:  # pragma: no cover
            if z != shadow_dir:
                os.unlink(z)
        os.rmdir(shadow_dir)
        self.assertFalse(os.path.exists(shadow_dir), msg=shadow_dir)
    //@+node:felix.20230530004010.4: *4* TestShadow.make_lines
    def make_lines(self, old, new):
        """Make all lines and return the result of propagating changed lines."""
        c = self.c
        # Calculate all required lines.
        old_private_lines = self.makePrivateLines(old)
        new_private_lines = self.makePrivateLines(new)
        old_public_lines = self.makePublicLines(old_private_lines)
        new_public_lines = self.makePublicLines(new_private_lines)
        expected_private_lines = self.mungePrivateLines(
            new_private_lines, 'node:new', 'node:old')
        # Return the propagated results.
        results = self.shadow_controller.propagate_changed_lines(
            new_public_lines, old_private_lines, self.marker, p=c.p)
        if 0:  # To verify that sentinels are as expected.
            print('')
            print(g.callers(1))
            g.printObj(old_private_lines, tag='old_private_lines')
            g.printObj(new_private_lines, tag='new_private_lines')
            g.printObj(old_public_lines, tag='old_public_lines')
            g.printObj(new_public_lines, tag='new_public_lines')
        return results, expected_private_lines
    //@+node:felix.20230530004010.5: *4* TestShadow.makePrivateLines
    def makePrivateLines(self, p):
        """Return a list of the lines of p containing sentinels."""
        at = self.c.atFileCommands
        # A hack: we want to suppress gnx's *only* in @+node sentinels,
        # but we *do* want sentinels elsewhere.
        at.at_shadow_test_hack = True
        try:
            s = at.atFileToString(p, sentinels=True)
        finally:
            at.at_shadow_test_hack = False
        return g.splitLines(s)
    //@+node:felix.20230530004010.6: *4* TestShadow.makePublicLines
    def makePublicLines(self, lines):
        """Return the public lines in lines."""
        lines, junk = self.shadow_controller.separate_sentinels(lines, self.marker)
        return lines
    //@+node:felix.20230530004010.7: *4* TestShadow.mungePrivateLines
    def mungePrivateLines(self, lines, find, replace):
        """Change the 'find' the 'replace' pattern in sentinel lines."""
        marker = self.marker
        i, results = 0, []
        while i < len(lines):
            line = lines[i]
            if marker.isSentinel(line):
                new_line = line.replace(find, replace)
                results.append(new_line)
                if marker.isVerbatimSentinel(line):
                    i += 1
                    if i < len(lines):
                        line = lines[i]
                        results.append(line)
                    else:
                        self.shadow_controller.verbatim_error()  # pragma: no cover
            else:
                results.append(line)
            i += 1
        return results
    //@+node:felix.20230530004010.8: *3* test update algorithm...
    //@+node:felix.20230530004010.9: *4* TestShadow.test_change_end_of_prev_node
    def test_change_end_of_prev_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            ATothers
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('AT', '@')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            ATothers
            node 1 line 1
            node 1 line 1 changed
            node 2 line 1
            node 2 line 2
        """).replace('AT', '@')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.10: *4* TestShadow.test_change_first_line
    def test_change_first_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1 changed
            line 2
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.11: *4* TestShadow.test_change_last_line
    def test_change_last_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            line 2
            line 3 changed
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.12: *4* TestShadow.test_change_middle_line
    def test_change_middle_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            line 2 changed
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.13: *4* TestShadow.test_change_start_of_next_node
    def test_change_start_of_next_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1 changed
            node 2 line 2
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.14: *4* TestShadow.test_delete_between_nodes_at_end_of_prev_node
    def test_delete_between_nodes_at_end_of_prev_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.15: *4* TestShadow.test_delete_between_nodes_at_start_of_next_node
    def test_delete_between_nodes_at_start_of_next_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.16: *4* TestShadow.test_delete_first_line
    def test_delete_first_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 2
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.17: *4* TestShadow.test_delete_last_line
    def test_delete_last_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            line 2
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.18: *4* TestShadow.test_delete_middle_line
    def test_delete_middle_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.19: *4* TestShadow.test_insert_after_last_line
    def test_insert_after_last_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
            inserted line
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.20: *4* TestShadow.test_insert_before_first_line
    def test_insert_before_first_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            inserted line
            line 1
            line 2
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.21: *4* TestShadow.test_insert_middle_line_after_first_line_
    def test_insert_middle_line_after_first_line_(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            inserted line
            line 2
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.22: *4* TestShadow.test_insert_middle_line_before_last_line_
    def test_insert_middle_line_before_last_line_(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line 1
            line 2
            line 3
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line 1
            line 2
            inserted line
            line 3
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.23: *4* TestShadow.test_lax_insert_between_nodes_at_end_of_prev_node
    def test_lax_insert_between_nodes_at_end_of_prev_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            inserted node at end of node 1
            node 2 line 1
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.24: *4* TestShadow.test_lax_multiple_line_insert_between_nodes_at_end_of_prev_node
    def test_lax_multiple_line_insert_between_nodes_at_end_of_prev_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            inserted node 1 at end of node 1
            inserted node 2 at end of node 1
            node 2 line 1
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.25: *4* TestShadow.test_multiple_line_change_end_of_prev_node
    def test_multiple_line_change_end_of_prev_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 1 line 3
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2 changed
            node 1 line 3 changed
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.26: *4* TestShadow.test_multiple_line_change_start_of_next_node
    def test_multiple_line_change_start_of_next_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1 changed
            node 2 line 2 changed
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.27: *4* TestShadow.test_multiple_line_delete_between_nodes_at_end_of_prev_node
    def test_multiple_line_delete_between_nodes_at_end_of_prev_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 1 line 3
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.28: *4* TestShadow.test_multiple_line_delete_between_nodes_at_start_of_next_node
    def test_multiple_line_delete_between_nodes_at_start_of_next_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
            node 2 line 3
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 3
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.29: *4* TestShadow.test_multiple_node_changes
    def test_multiple_node_changes(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('at-others', '@others')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2 changed
            node 2 line 1 changed
            node 2 line 2 changed
        """).replace('at-others', '@others')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.30: *4* TestShadow.test_no_change_no_ending_newline
    def test_no_change_no_ending_newline(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            line
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            line
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.31: *4* TestShadow.test_replace_in_node_new_gt_new_old
    def test_replace_in_node_new_gt_new_old(self):
        p = self.c.p
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = '@others\n'
        old_node1 = old.insertAsLastChild()
        old_node1.h = 'node1'
        old_node1.b = textwrap.dedent("""\
            node 1 line 1
            node 1 old line 1
            node 1 old line 2
            node 1 line 2
    """)
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = '@others\n'
        new_node1 = new.insertAsLastChild()
        new_node1.h = 'node1'
        new_node1.b = textwrap.dedent("""\
            node 1 line 1
            node 1 new line 1
            node 1 new line 2
            node 1 new line 3
            node 1 line 2
    """)
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.32: *4* TestShadow.test_replace_in_node_new_lt_old
    def test_replace_in_node_new_lt_old(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = '@others\n'
        old_node1 = old.insertAsLastChild()
        old_node1.h = 'node1'
        old_node1.b = textwrap.dedent("""\
            node 1 line 1
            node 1 old line 1
            node 1 old line 2
            node 1 old line 3
            node 1 old line 4
            node 1 line 2
        """)
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = '@others\n'
        new_node1 = new.insertAsLastChild()
        new_node1.h = 'node1'
        new_node1.b = textwrap.dedent("""\
            node 1 line 1
            node 1 new line 1
            node 1 new line 2
            node 1 line 2
        """)
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.33: *4* TestShadow.test_verbatim_sentinels_add_verbatim_line
    def test_verbatim_sentinels_add_verbatim_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('at-', '@')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            node 1 line 2
            node 2 line 1
            node 2 line 2
        """).replace('at-', '@')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.34: *4* TestShadow.test_verbatim_sentinels_delete_verbatim_line
    def test_verbatim_sentinels_delete_verbatim_line(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        """).replace('at-', '@')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        """).replace('at-', '@')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.35: *4* TestShadow.test_verbatim_sentinels_delete_verbatim_line_at_end_of_node
    def test_verbatim_sentinels_delete_verbatim_line_at_end_of_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            node 2 line 1
            node 2 line 2
        """).replace('at-', '@')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        """).replace('at-', '@')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.36: *4* TestShadow.test_verbatim_sentinels_delete_verbatim_line_at_start_of_node
    def test_verbatim_sentinels_delete_verbatim_line_at_start_of_node(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            node 2 line 2
        """).replace('at-', '@')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            node 2 line 2
        """).replace('at-', '@')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.37: *4* TestShadow.test_verbatim_sentinels_no_change
    def test_verbatim_sentinels_no_change(self):
        p = self.c.p
        # Create the 'old' node.
        old = p.insertAsLastChild()
        old.h = 'old'
        old.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            at-verbatim
            #at- should be handled by verbatim
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        """).replace('at-', '@')
        # Create the 'new' node.
        new = p.insertAsLastChild()
        new.h = 'new'
        new.b = textwrap.dedent("""\
            at-others
            node 1 line 1
            at-verbatim
            #at- should be handled by verbatim
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        """).replace('at-', '@')
        # Run the test.
        results, expected = self.make_lines(old, new)
        self.assertEqual(results, expected)
    //@+node:felix.20230530004010.38: *3* test utils...
    //@+node:felix.20230530004010.39: *4* TestShadow.test_marker_getDelims
    def test_marker_getDelims(self):
        c = self.c
        x = c.shadowController
        table = (
            ('python', '#', ''),
            ('c', '//', ''),
            ('html', '<!--', '-->'),
            ('xxxx', '#--unknown-language--', ''),
        )
        for language, delim1, delim2 in table:
            delims = g.set_delims_from_language(language)
            marker = x.Marker(delims)
            result = marker.getDelims()
            expected = delim1, delim2
            self.assertEqual(result, expected, msg=language)
    //@+node:felix.20230530004010.40: *4* TestShadow.test_marker_isSentinel
    def test_marker_isSentinel(self):
        c = self.c
        x = c.shadowController
        table = (
            ('python', 'abc', False),
            ('python', '#abc', False),
            ('python', '#@abc', True),
            ('python', '@abc#', False),
            ('c', 'abc', False),
            ('c', '//@', True),
            ('c', '// @abc', False),
            ('c', '/*@ abc */', True),
            ('c', '/*@ abc', False),
            ('html', '#@abc', False),
            ('html', '<!--abc-->', False),
            ('html', '<!--@ abc -->', True),
            ('html', '<!--@ abc ->', False),
            ('xxxx', '#--unknown-language--@', True)
        )
        for language, s, expected in table:
            delims = g.set_delims_from_language(language)
            marker = x.Marker(delims)
            result = marker.isSentinel(s)
            self.assertEqual(result, expected)
    //@+node:felix.20230530004010.41: *4* TestShadow.test_marker_isVerbatimSentinel
    def test_marker_isVerbatimSentinel(self):
        c = self.c
        x = c.shadowController
        table = (
            ('python', 'abc', False),
            ('python', '#abc', False),
            ('python', '#verbatim', False),
            ('python', '#@verbatim', True),
            ('c', 'abc', False),
            ('c', '//@', False),
            ('c', '//@verbatim', True),
            ('html', '#@abc', False),
            ('html', '<!--abc-->', False),
            ('html', '<!--@verbatim -->', True),
            ('xxxx', '#--unknown-language--@verbatim', True)
        )
        for language, s, expected in table:
            delims = g.set_delims_from_language(language)
            marker = x.Marker(delims)
            result = marker.isVerbatimSentinel(s)
            self.assertEqual(result, expected)
    //@+node:felix.20230530004010.42: *4* TestShadow.test_x_baseDirName
    def test_x_baseDirName(self):
        c = self.c
        x = c.shadowController
        path = x.baseDirName()
        expected = g.os_path_dirname(g.os_path_abspath(g.os_path_join(c.fileName())))
        self.assertEqual(path, expected)
    //@+node:felix.20230530004010.43: *4* TestShadow.test_x_dirName
    def test_x_dirName(self):
        c = self.c
        x = c.shadowController
        filename = 'xyzzy'
        path = x.dirName(filename)
        expected = g.os_path_dirname(g.os_path_abspath(
            g.os_path_join(g.os_path_dirname(c.fileName()), filename)))
        self.assertEqual(path, expected)
    //@+node:felix.20230530004010.44: *4* TestShadow.test_x_findAtLeoLine
    def test_x_findAtLeoLine(self):
        c = self.c
        x = c.shadowController
        table = (
            ('c', ('//@+leo', 'a'), '//@+leo'),
            ('c', ('//@first', '//@+leo', 'b'), '//@+leo'),
            ('c', ('/*@+leo*/', 'a'), '/*@+leo*/'),
            ('c', ('/*@first*/', '/*@+leo*/', 'b'), '/*@+leo*/'),
            ('python', ('#@+leo', 'a'), '#@+leo'),
            ('python', ('#@first', '#@+leo', 'b'), '#@+leo'),
            ('error', ('',), ''),
            ('html', ('<!--@+leo-->', 'a'), '<!--@+leo-->'),
            ('html', ('<!--@first-->', '<!--@+leo-->', 'b'), '<!--@+leo-->'),
        )
        for language, lines, expected in table:
            result = x.findLeoLine(lines)
            self.assertEqual(expected, result)
    //@+node:felix.20230530004010.45: *4* TestShadow.test_x_makeShadowDirectory
    def test_x_makeShadowDirectory(self):
        c = self.c
        x = c.shadowController
        shadow_fn = x.shadowPathName('unittests/xyzzy/test.py')
        shadow_dir = x.shadowDirName('unittests/xyzzy/test.py')
        assert not os.path.exists(shadow_fn), shadow_fn
        self.deleteShadowDir(shadow_dir)
        x.makeShadowDirectory(shadow_dir)
        self.assertTrue(os.path.exists(shadow_dir))
        self.deleteShadowDir(shadow_dir)
    //@+node:felix.20230530004010.46: *4* TestShadow.test_x_markerFromFileLines
    def test_x_markerFromFileLines(self):
        c = self.c
        x = c.shadowController
        # Add -ver=4 so at.parseLeoSentinel does not complain.
        table = (
            ('c', ('//@+leo-ver=4', 'a'), '//', ''),
            ('c', ('//@first', '//@+leo-ver=4', 'b'), '//', ''),
            ('c', ('/*@+leo-ver=4*/', 'a'), '/*', '*/'),
            ('c', ('/*@first*/', '/*@+leo-ver=4*/', 'b'), '/*', '*/'),
            ('python', ('#@+leo-ver=4', 'a'), '#', ''),
            ('python', ('#@first', '#@+leo-ver=4', 'b'), '#', ''),
            ('error', ('',), '#--unknown-language--', ''),
            ('html', ('<!--@+leo-ver=4-->', 'a'), '<!--', '-->'),
            ('html', ('<!--@first-->', '<!--@+leo-ver=4-->', 'b'), '<!--', '-->'),
        )

        for language, lines, delim1, delim2 in table:
            lines_s = '\n'.join(lines)
            marker = x.markerFromFileLines(lines, 'test-file-name')
            result1, result2 = marker.getDelims()
            self.assertEqual(delim1, result1, msg=f"language: {language} {lines_s}")
            self.assertEqual(delim2, result2, msg=f"language: {language} {lines_s}")
    //@+node:felix.20230530004010.47: *4* TestShadow.test_x_markerFromFileName
    def test_x_markerFromFileName(self):
        c = self.c
        x = c.shadowController
        table = (
            ('ini', ';', '',),
            ('c', '//', ''),
            ('h', '//', ''),
            ('py', '#', ''),
            ('xyzzy', '#--unknown-language--', ''),
        )
        for ext, delim1, delim2 in table:
            filename = 'x.%s' % ext
            marker = x.markerFromFileName(filename)
            result1, result2 = marker.getDelims()
            self.assertEqual(delim1, result1)
            self.assertEqual(delim2, result2)
    //@+node:felix.20230530004010.48: *4* TestShadow.test_x_pathName
    def test_x_pathName(self):
        c = self.c
        x = c.shadowController
        filename = 'xyzzy'
        path = x.pathName(filename)
        expected = g.os_path_abspath(g.os_path_join(x.baseDirName(), filename))
        self.assertEqual(path, expected)
    //@+node:felix.20230530004010.49: *4* TestShadow.test_x_replaceFileWithString_2
    def test_x_replaceFileWithString_2(self):
        c = self.c
        x = c.shadowController
        encoding = 'utf-8'
        fn = 'does/not/exist'
        assert not g.os_path_exists(fn)
        assert not x.replaceFileWithString(encoding, fn, 'abc')
    //@+node:felix.20230530004010.50: *4* TestShadow.test_x_shadowDirName
    def test_x_shadowDirName(self):
        c = self.c
        x = c.shadowController
        subdir = c.config.getString('shadow_subdir') or '.leo_shadow'
        filename = 'xyzzy'
        path = x.shadowDirName(filename)
        expected = g.os_path_abspath(g.os_path_join(
            g.os_path_dirname(c.fileName()), subdir))
        self.assertEqual(path, expected)
    //@+node:felix.20230530004010.51: *4* TestShadow.test_x_shadowPathName
    def test_x_shadowPathName(self):
        c = self.c
        x = c.shadowController
        subdir = c.config.getString('shadow_subdir') or '.leo_shadow'
        prefix = c.config.getString('shadow_prefix') or ''
        filename = 'xyzzy'
        path = x.shadowPathName(filename)
        expected = g.os_path_abspath(g.os_path_join(
            g.os_path_dirname(c.fileName()), subdir, prefix + filename))
        self.assertEqual(path, expected)
    //@-others
//@-others
//@-leo
