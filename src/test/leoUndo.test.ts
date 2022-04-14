//@+leo-ver=5-thin
//@+node:felix.20220129003013.1: * @file src/test/leoUndo.test.ts
/**
 * Tests of leoUndo.ts
 */

import * as assert from 'assert';
import { afterEach, after, before, beforeEach } from 'mocha';
import * as g from '../core/leoGlobals';
import * as vscode from 'vscode';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20220129225102.1: ** suite TestUndo (LeoUnitTest)
suite('Test Undo', () => {

    let self: LeoUnitTest;

    before(async () => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(async () => {
        self.setUp();
    });

    afterEach(async () => {
        self.tearDown();
    });

    //@+others
    //@+node:felix.20220129225102.2: *3* TestUndo.runTest (Test)
    const runTest = (self: LeoUnitTest, before: string, after: string, i: number, j: number, func: () => any) => {
        const c = self.c;
        const p = self.c.p;
        const w = self.c.frame.body.wrapper;
        // Restore section references.
        before = before.split('> >').join('>>');
        before = before.split('< <').join('<<');

        after = after.split('> >').join('>>');
        after = after.split('< <').join('<<');

        // Check indices.
        assert.ok(0 <= i && i <= before.length, `i: ${i} before.length: ${before.length}`);
        assert.ok(0 <= j && i <= before.length, `j: ${j} before.length: ${before.length}`);
        // Set the text and selection range.
        p.b = before;
        assert.strictEqual(p.b, w.getAllText());
        w.setSelectionRange(i, j, i);
        // Test.
        assert.notStrictEqual(before, after);
        func();
        let result = p.b;
        assert.strictEqual(result, after, 'before undo1');
        c.undoer.undo();
        result = w.getAllText();
        assert.strictEqual(result, before, 'after undo1');
        c.undoer.redo();
        result = w.getAllText();
        assert.strictEqual(result, after, 'after redo1');
        c.undoer.undo();
        result = w.getAllText();
        assert.strictEqual(result, before, 'after undo2');
    };
    //@+node:felix.20220129225102.3: *3* TestUndo.test_addComments
    test('test_addComments', async () => {
        const c = self.c;

    });
    /* def test_addComments(self):
        c = self.c
        before = textwrap.dedent("""\
            @language python

            def addCommentTest():

                if 1:
                    a = 2
                    b = 3

                pass
    """)
        after = textwrap.dedent("""\
            @language python

            def addCommentTest():

                # if 1:
                    # a = 2
                    # b = 3

                pass
    """)
        i = before.find('if 1')
        j = before.find('b = 3')
        func = c.addComments
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.4: *3* TestUndo.test_convertAllBlanks
    test('test_convertAllBlanks', async () => {
        const c = self.c;

    });
    /* def test_convertAllBlanks(self):
        c = self.c
        before = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        after = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        i, j = 13, len(before)
        func = c.convertAllBlanks
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.5: *3* TestUndo.test_convertAllTabs
    test('test_convertAllTabs', async () => {
        const c = self.c;

    });
    /* def test_convertAllTabs(self):
        c = self.c
        before = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        after = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        i, j = 13, 45
        func = c.convertAllTabs
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.6: *3* TestUndo.test_convertBlanks
    test('test_convertBlanks', async () => {
        const c = self.c;

    });
    /* def test_convertBlanks(self):
        c = self.c
        before = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        after = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        i, j = 13, 51
        func = c.convertBlanks
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.7: *3* TestUndo.test_convertTabs
    test('test_convertTabs', async () => {
        const c = self.c;

    });
    /* def test_convertTabs(self):
        c = self.c
        before = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        after = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        i, j = 13, 45
        func = c.convertTabs
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.8: *3* TestUndo.test_dedentBody
    test('test_dedentBody', async () => {
        const c = self.c;

    });
    /* def test_dedentBody(self):
        c = self.c
        before = textwrap.dedent("""\
            line 1
                line 2
                line 3
            line 4
    """)
        after = textwrap.dedent("""\
            line 1
            line 2
            line 3
            line 4
    """)
        i = before.find('line 2')
        j = before.find('3')
        func = c.dedentBody
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.9: *3* TestUndo.test_deleteComments
    test('test_deleteComments', async () => {
        const c = self.c;

    });
    /* def test_deleteComments(self):
        c = self.c
        before = textwrap.dedent("""\
            @language python

            def deleteCommentTest():

            #     if 1:
            #         a = 2
            #         b = 3

                pass
    """)
        after = textwrap.dedent("""\
            @language python

            def deleteCommentTest():

                if 1:
                    a = 2
                    b = 3

                pass
    """)
        i = before.find('if 1')
        j = before.find('b = 3')
        func = c.deleteComments
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.10: *3* TestUndo.test_deleteComments 2
    test('2', async () => {
        const c = self.c;

    });
    /* def test_deleteComments_2(self):
        c = self.c
        before = textwrap.dedent("""\
            @language python

            def deleteCommentTest():

            #     if 1:
            #         a = 2
            #         b = 3

                # if 1:
                    # a = 2
                    # b = 3

                pass
    """)
        after = textwrap.dedent("""\
            @language python

            def deleteCommentTest():

                if 1:
                    a = 2
                    b = 3

                if 1:
                    a = 2
                    b = 3

                pass
    """)
        i = before.find('if 1')
        j = before.find('# b = 3')
        func = c.deleteComments
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.11: *3* TestUndo.test_edit_headline
    test('test_edit_headline', async () => {
        const c = self.c;
        const p = self.c.p;
        let node1 = p.insertAsLastChild();
        const node2 = node1.insertAfter();
        const node3 = node2.insertAfter();
        node1.h = 'node 1';
        node2.h = 'node 2';
        node3.h = 'node 3';
        const w_result = [...p.subtree()].map(p => p.h); // p.h for p in 
        assert.strictEqual(JSON.stringify([...p.subtree()].map(p => p.h)), JSON.stringify(['node 1', 'node 2', 'node 3']));
        // Select 'node 1' and modify the headline as if a user did it
        c.undoer.clearUndoState();
        node1 = p.copy().moveToFirstChild();
        c.selectPosition(node1);

        // c.editHeadline();
        // w = c.frame.tree.edit_widget(node1);
        // w.insert('1.0', 'changed - ');
        // c.endEditing();
        const undoData = c.undoer.beforeChangeHeadline(node1);
        c.setHeadString(node1, 'changed - ' + node1.h);  // Set v.h *after* calling the undoer's before method.
        if (!c.changed) {
            c.setChanged();
        }
        c.undoer.afterChangeHeadline(node1, 'Edit Headline', undoData);

        assert.strictEqual(JSON.stringify([...p.subtree()].map(p => p.h)), JSON.stringify(['changed - node 1', 'node 2', 'node 3']));
        // Move the selection and undo the headline change
        c.selectPosition(node1.copy().moveToNext());
        c.undoer.undo();
        // The undo should restore the 'node 1' headline string
        assert.strictEqual(JSON.stringify([...p.subtree()].map(p => p.h)), JSON.stringify(['node 1', 'node 2', 'node 3']));
        // The undo should select the edited headline.
        assert.ok(c.p.__eq__(node1));
    });
    /* def test_edit_headline(self):
        # Brian Theado.
        c, p = self.c, self.c.p
        node1 = p.insertAsLastChild()
        node2 = node1.insertAfter()
        node3 = node2.insertAfter()
        node1.h = 'node 1'
        node2.h = 'node 2'
        node3.h = 'node 3'
        self.assertEqual([p.h for p in p.subtree()], ['node 1', 'node 2', 'node 3'])
        # Select 'node 1' and modify the headline as if a user did it
        c.undoer.clearUndoState()
        node1 = p.copy().moveToFirstChild()
        c.selectPosition(node1)
        c.editHeadline()
        w = c.frame.tree.edit_widget(node1)
        w.insert('1.0', 'changed - ')
        c.endEditing()
        self.assertEqual([p.h for p in p.subtree()], ['changed - node 1', 'node 2', 'node 3'])
        # Move the selection and undo the headline change
        c.selectPosition(node1.copy().moveToNext())
        c.undoer.undo()
        # The undo should restore the 'node 1' headline string
        self.assertEqual([p.h for p in p.subtree()], ['node 1', 'node 2', 'node 3'])
        # The undo should select the edited headline.
        self.assertEqual(c.p, node1)
     */
    //@+node:felix.20220129225102.12: *3* TestUndo.test_extract_test
    test('test_extract_test', async () => {
        const c = self.c;

    });
    /* def test_extract_test(self):
        c = self.c
        before = textwrap.dedent("""\
            before
                < < section > >
                sec line 1
                    sec line 2 indented
            sec line 3
            after
    """)
        after = textwrap.dedent("""\
            before
                < < section > >
            after
    """)
        i = before.find('< <')
        j = before.find('line 3')
        func = c.extract
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.13: *3* TestUndo.test_line_to_headline
    test('test_line_to_headline', async () => {
        const c = self.c;

    });
    /* def test_line_to_headline(self):
        c = self.c
        before = textwrap.dedent("""\
            before
            headline
            after
    """)
        after = textwrap.dedent("""\
            before
            after
    """)
        i, j = 10, 10
        func = c.line_to_headline
        self.runTest(before, after, i, j, func)
     */
    //@+node:felix.20220129225102.14: *3* TestUndo.test_restore_marked_bits
    test('test_restore_marked_bits', async () => {
        const c = self.c;

    });
    /* def test_restore_marked_bits(self):
        c, p = self.c, self.c.p
        # Test of #1694.
        u, w = c.undoer, c.frame.body.wrapper
        oldText = p.b
        newText = p.b + '\n#changed'
        for marked in (True, False):
            c.undoer.clearUndoState()  # Required.
            if marked:
                p.setMarked()
            else:
                p.clearMarked()
            oldMarked = p.isMarked()
            w.setAllText(newText)  # For the new assert in w.updateAfterTyping.
            u.setUndoTypingParams(p,
                undo_type='typing',
                oldText=oldText,
                newText=newText,
            )
            u.undo()
            self.assertEqual(p.b, oldText)
            self.assertEqual(p.isMarked(), oldMarked)
            u.redo()
            self.assertEqual(p.b, newText)
            self.assertEqual(p.isMarked(), oldMarked)
     */
    //@+node:felix.20220129225102.15: *3* TestUndo.test_undo_group
    test('test_undo_group', async () => {
        const c = self.c;

    });
    /* def test_undo_group(self):
        # Test an off-by-one error in c.undoer.bead.
        # The buggy redoGroup code worked if the undo group was the first item on the undo stack.
        c, p = self.c, self.c.p
        original = p.insertAfter()
        original_s = original.b = textwrap.dedent("""\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    """)
        c.undoer.clearUndoState()
        c.selectPosition(original)
        c.copyOutline()  # Add state to the undo stack!
        c.pasteOutline()
        c.convertAllBlanks()  # Uses undoGroup.
        c.undoer.undo()
        self.assertEqual(original.b, original_s)
        c.pasteOutline()
        c.convertAllBlanks()
        c.pasteOutline()
        c.convertAllBlanks()
        c.undoer.undo()
        c.undoer.redo()
        self.assertEqual(original.b, original_s)
     */
    //@-others

});
//@-others
//@-leo
