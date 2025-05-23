//@+leo-ver=5-thin
//@+node:felix.20220129003013.1: * @file src/test/leoUndo.test.ts
/**
 * Tests of leoUndo.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20220129225102.1: ** suite TestUndo (LeoUnitTest)
suite('Test Undo', () => {

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
        func.bind(self.c)();
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
    test('test_addComments', () => {
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
    test('test_convertAllBlanks', () => {
        const c = self.c;

        const before = g.dedent(
            `\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4`
        );
        const after = g.dedent(
            `\
            @tabwidth -4

            line 1
            TABline 2
            TAB  line 3
            line4`
        ).replace(/TAB/g, '\t');
        const [i, j] = [13, before.length];
        const func = c.convertAllBlanks;
        runTest(self, before, after, i, j, func);
    });

    //@+node:felix.20220129225102.5: *3* TestUndo.test_convertAllTabs
    test('test_convertAllTabs', () => {
        const c = self.c;
        const before = g.dedent(
            `\
            @tabwidth -4

            line 1
            TABline 2
            TAB  line 3
            line4`
        ).replace(/TAB/g, '\t');
        const after = g.dedent(
            `\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4`
        );
        const [i, j] = [13, 45];
        const func = c.convertAllTabs;
        runTest(self, before, after, i, j, func);
    });

    //@+node:felix.20220129225102.6: *3* TestUndo.test_convertBlanks
    test('test_convertBlanks', () => {
        const c = self.c;
        const before = g.dedent(
            `\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4`
        );
        const after = g.dedent(
            `\
            @tabwidth -4

            line 1
            TABline 2
            TAB  line 3
            line4`
        ).replace(/TAB/g, '\t');
        const [i, j] = [13, 51];
        const func = c.convertBlanks;
        runTest(self, before, after, i, j, func);
    });

    //@+node:felix.20220129225102.7: *3* TestUndo.test_convertTabs
    test('test_convertTabs', () => {
        const c = self.c;

        const before = g.dedent(
            `\
            @tabwidth -4

            line 1
            TABline 2
            TAB  line 3
            line4`
        ).replace(/TAB/g, '\t');
        const after = g.dedent(
            `\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4`
        );
        const [i, j] = [13, 45];
        const func = c.convertTabs;
        runTest(self, before, after, i, j, func);
    });
    //@+node:felix.20220129225102.8: *3* TestUndo.test_dedentBody
    test('test_dedentBody', () => {
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
    test('test_deleteComments', () => {
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
    test('test_deleteComments_2', () => {
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
    test('test_edit_headline', () => {
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

        // c.editHeadline(); // TODO : UNCOMMENT THIS WITH THE NEW WRAPPER CODE !
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
    //@+node:felix.20220129225102.12: *3* TestUndo.test_extract_test
    test('test_extract_test', () => {
        const c = self.c;
        const before = g.dedent(
            `\
            before
                < < section > >
                sec line 1
                    sec line 2 indented
            sec line 3
            after\n`
        );
        const after = g.dedent(
            `\
            before
                < < section > >
            after\n`
        );
        const i = before.indexOf('< <');
        const j = before.indexOf('line 3');
        const func = c.extract;
        runTest(self, before, after, i, j, func);
    });
    //@+node:felix.20220129225102.13: *3* TestUndo.test_line_to_headline
    test('test_line_to_headline', () => {
        const c = self.c;
        const before = g.dedent(`\
            before
            headline
            after\n`
        );

        const after = g.dedent(`\
            before
            after\n`
        );

        let i = 10;
        let j = 10;
        const func = c.line_to_headline;
        runTest(self, before, after, i, j, func);
    });
    //@+node:felix.20220129225102.14: *3* TestUndo.test_restore_marked_bits
    test('test_restore_marked_bits', () => {
        const c = self.c;
        const p = self.c.p;

        // Test of #1694.
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        const oldText = p.b.toString();
        const newText = p.b + '\n#changed';

        for (let marked of [true, false]) {
            c.undoer.clearUndoState();  // Required.
            // RESET
            p.v.setBodyString(oldText);

            if (marked) {
                p.setMarked();
            } else {
                p.clearMarked();
            }
            const oldMarked = p.isMarked();

            // w.setAllText(newText);  // For the new assert in w.updateAfterTyping.
            // u.setUndoTypingParams(p,
            //     undo_type='typing',
            //     oldText=oldText,
            //     newText=newText,
            // );

            const bunch = u.beforeChangeNodeContents(p);
            p.v.setBodyString(newText);
            u.afterChangeNodeContents(p, "Body Text", bunch);
            c.setChanged();
            p.setDirty();
            u.undo();
            assert.strictEqual(p.b, oldText);
            assert.strictEqual(p.isMarked(), oldMarked);
            u.redo();
            assert.strictEqual(p.b, newText);
            assert.strictEqual(p.isMarked(), oldMarked);
        }
    });
    //@+node:felix.20220129225102.15: *3* TestUndo.test_undo_group
    /**
     * Test an off-by-one error in c.undoer.bead.
     * The buggy redoGroup code worked if the undo group was the first item on the undo stack.
     */
    test('test_undo_group', () => {
        const c = self.c;

        const p = self.c.p;
        let original = p.insertAfter();
        const original_s = original.b = g.dedent(`\
            @tabwidth -4

            line 1
                line 2
                  line 3
            line4
    `); // Only four spaces before that close tick.
        c.undoer.clearUndoState();
        c.selectPosition(original);
        c.copyOutline();  // Add state to the undo stack!
        c.pasteOutline();
        c.convertAllBlanks();  // Uses undoGroup.
        c.undoer.undo();
        assert.strictEqual(original.b, original_s);
        c.pasteOutline();
        c.convertAllBlanks();
        c.pasteOutline();
        c.convertAllBlanks();
        c.undoer.undo();
        c.undoer.redo();
        assert.strictEqual(original.b, original_s);

    });
    //@-others

});
//@-others
//@-leo
