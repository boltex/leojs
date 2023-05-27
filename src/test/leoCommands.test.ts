//@+leo-ver=5-thin
//@+node:felix.20220129002752.1: * @file src/test/leoCommands.test.ts
/**
 * Tests of leoCommands.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20220129224954.1: ** suite TestCommands(LeoUnitTest)
suite('Test cases for leoCommands.ts', () => {

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
    //@+node:felix.20220129224954.2: *3* TestCommands.test_add_comments_with_multiple_language_directives
    // ! NO addComments IN LEOJS
    // ! uncomment when addComments, setSelectionRange and body pane are implemented !
    /* def test_add_comments_with_multiple_language_directives(self):
        c, p, w = self.c, self.c.p, self.c.frame.body.wrapper
        p.b = textwrap.dedent("""\
            @language rest
            rest text.
            @language python
            def spam():
                pass
            # after
    """)
        expected = textwrap.dedent("""\
            @language rest
            rest text.
            @language python
            def spam():
                # pass
            # after
    """)
        i = p.b.find('pass')
        assert i > -1, 'fail1: %s' % (repr(p.b))
        w.setSelectionRange(i, i + 4)
        c.addComments()
        self.assertEqual(p.b, expected)
     */
    //@+node:felix.20220129224954.3: *3* TestCommands.test_add_html_comments
    // ! NO addComments IN LEOJS
    // ! uncomment when addComments, setSelectionRange and body pane are implemented !
    /* def test_add_html_comments(self):
        c, p, w = self.c, self.c.p, self.c.frame.body.wrapper
        p.b = textwrap.dedent("""\
            @language html
            <html>
                text
            </html>
    """)
        expected = textwrap.dedent("""\
            @language html
            <html>
                <!-- text -->
            </html>
    """)
        i = p.b.find('text')
        w.setSelectionRange(i, i + 4)
        c.addComments()
        self.assertEqual(p.b, expected)
     */
    //@+node:felix.20220129224954.4: *3* TestCommands.test_add_python_comments
    // ! NO addComments IN LEOJS
    // ! uncomment when addComments, setSelectionRange and body pane are implemented !
    /* def test_add_python_comments(self):
        c, p, w = self.c, self.c.p, self.c.frame.body.wrapper
        p.b = textwrap.dedent("""\
            @language python
            def spam():
                pass
            # after
    """)
        expected = textwrap.dedent("""\
            @language python
            def spam():
                # pass
            # after
    """)
        i = p.b.find('pass')
        w.setSelectionRange(i, i + 4)
        c.addComments()
        self.assertEqual(p.b, expected)
     */
    //@+node:felix.20220129224954.5: *3* TestCommands.test_all_commands_have_an_event_arg
    // ! NO 'event' ARGUMENT IN COMMANDS OF LEOJS (so far) !
    /* def test_all_commands_have_an_event_arg(self):
        c = self.c
        d = c.commandsDict
        keys = sorted(d.keys())
        table = ('bookmark', 'quickmove_', 'screen-capture', 'stickynote')
        for key in keys:
            continue_flag = False
            for prefix in table:
                if key.startswith(prefix):
                    continue_flag = True
                    break  # These plugins have their own signatures.
            if continue_flag:
                continue
            f = d.get(key)
            # print(key, f.__name__ if f else repr(f))
            # Test true __call__ methods if they exist.
            name = getattr(f, '__name__', None) or repr(f)
            if hasattr(f, '__call__') and inspect.ismethod(f.__call__):
                f = getattr(f, '__call__')
            t = inspect.getfullargspec(f)  # t is a named tuple.
            args = t.args
            arg0 = len(args) > 0 and args[0]
            arg1 = len(args) > 1 and args[1]
            expected = ('event',)
            message = f"no event arg for command {key}, func: {name}, args: {args}"
            assert arg0 in expected or arg1 in expected, message
     */
    //@+node:felix.20220129224954.6: *3* TestCommands.test_c_alert
    test('test_c_alert', () => {
        const c = self.c;
        c.alert('test of c.alert');
    });

    //@+node:felix.20220129224954.7: *3* TestCommands.test_c_checkOutline
    test('test_c_checkOutline', () => {
        const c = self.c;
        const errors = c.checkOutline();
        assert.strictEqual(errors, 0);
    });

    //@+node:felix.20220129224954.8: *3* TestCommands.test_c_checkPythonCode
    // ! uncomment when checkPythonCode is implemented !
    /* 
    test('test_c_checkPythonCode', () => {

     
        const c = self.c;

        c.checkPythonCode(event=None, ignoreAtIgnore=False, checkOnSave=False)
    });
    */
    //@+node:felix.20220129224954.9: *3* TestCommands.test_c_checkPythonNode
    // ! uncomment when checkPythonCode is implemented !
    /* 
    test('test_c_checkPythonNode', () => {
        const c = self.c;
        const p =  self.c.p;
        
        p.b = g.dedent(`\
            @language python

            def abc:  # missing parens.
                pass
        `
        )
        const result = c.checkPythonCode(event=None, checkOnSave=False, ignoreAtIgnore=True)
        self.assertEqual(result, 'error')
    });
    */
    //@+node:felix.20220129224954.11: *3* TestCommands.test_c_contractAllHeadlines
    test('test_c_contractAllHeadlines', () => {
        const c = self.c;
        c.contractAllHeadlines();
        const p: Position = c.rootPosition()!;
        while (p.hasNext()) {
            p.moveToNext();
        }
        c.selectPosition(p);
        c.redraw();
    });

    //@+node:felix.20220129224954.12: *3* TestCommands.test_c_demote_illegal_clone_demote
    test('test_c_demote_illegal_clone_demote', () => {
        const c = self.c;
        const p: Position = c.p;
        // Create two cloned children.
        c.selectPosition(p);
        c.insertHeadline();
        const p2 = c.p;
        p2.moveToFirstChildOf(p);
        p2.setHeadString('aClone');
        c.selectPosition(p2);
        c.clone();
        assert.strictEqual(2, p.numberOfChildren());
        // Select the first clone and demote (it should be illegal)
        c.selectPosition(p2);
        c.demote();  // This should do nothing.
        assert.strictEqual(0, c.checkOutline());
        assert.strictEqual(2, p.numberOfChildren());
    });
    //@+node:felix.20220129224954.13: *3* TestCommands.test_c_expand_path_expression
    test('test_c_expand_path_expression', () => {
        const c = self.c;

        const sep = path.sep;

        const table = [
            ['~{{sep}}tmp{{sep}}x.py', `~${sep}tmp${sep}x.py`]
        ];

        let s: string;
        let expected: string;
        for ([s, expected] of table) {
            if (g.isWindows) {
                expected = expected.split('\\').join('/');
            }
            const got = c.expand_path_expression(s);
            assert.strictEqual(got, expected, s);
        }
    });
    //@+node:felix.20230423155356.1: *3* TestCommands.test_find_b_h
    test('test_find_b_h', () => {
        const c = self.c;
        const p = self.c.p;

        // Create two children of c.p.
        const child1 = p.insertAsLastChild();
        child1.h = 'child1 headline';
        child1.b = 'child1 line1\nchild2 line2\n';
        const child2 = p.insertAsLastChild();
        child2.h = 'child2 headline';
        child2.b = 'child2 line1\nchild2 line2\n';

        function compareArrays(arr1: Position[], arr2: Position[]) {
            // Check if the arrays have the same length
            if (arr1.length !== arr2.length) {
                return false;
            }

            for (let [index, elem] of arr1.entries()) {
                if (!arr2[index].__eq__(elem)) {
                    return false;
                }
            }
            // all where equal positions
            return true;
        }

        // Tests.
        const list1 = c.find_h(/^child1/);
        assert.ok(compareArrays(list1, [child1]), list1?.toString() || '');
        const list2 = c.find_h(/^child1/, '', [child2]);
        assert.ok(!list2 || !list2.length, list2?.toString() || '');
        const list3 = c.find_b(/.*\bline2\n/);
        assert.ok(compareArrays(list3, [child1, child2]), list3?.toString() || '');
        const list4 = c.find_b(/.*\bline2\n/, '', [child1]);
        assert.ok(compareArrays(list4, [child1]), list3?.toString() || '');

    });

    //@+node:felix.20220129224954.14: *3* TestCommands.test_c_findMatchingBracket
    // ! uncomment if g.MatchBrackets is implemented !
    /* def test_c_findMatchingBracket(self):
        c, w = self.c, self.c.frame.body.wrapper
        s = '(abc)'
        c.p.b = s
        table = (
            (-1, -1),
            (len(s), len(s)),
            (0, 0),
            (1, 1),
        )
        for i, j in table:
            w.setSelectionRange(-1, len(s))
            c.findMatchingBracket(event=None)
            i2, j2 = w.getSelectionRange()
            self.assertTrue(i2 < j2, msg=f"i: {i}, j: {j}")

     */
    //@+node:felix.20220129224954.15: *3* TestCommands.test_c_hiddenRootNode_fileIndex
    test('test_c_hiddenRootNode_fileIndex', () => {
        const c = self.c;
        assert.ok(c.hiddenRootNode.fileIndex.startsWith('hidden-root-vnode-gnx'),
            c.hiddenRootNode.fileIndex);

    });
    //@+node:felix.20220129224954.16: *3* TestCommands.test_c_hoist_chapter_node
    test('test_c_hoist_chapter_node', () => {
        const c = self.c;
        // Create the @settings and @chapter nodes.
        const settings = c.rootPosition()!.insertAfter();
        settings.h = '@settings';
        const chapter = settings.insertAsLastChild();
        chapter.h = '@chapter aaa';
        const aaa = chapter.insertAsLastChild();
        aaa.h = 'aaa node 1';
        assert.ok(!c.hoistStack.length);
        c.selectPosition(aaa);
        // Test.
        c.hoist();  // New in Leo 5.3: should do nothing
        assert.strictEqual(c.p.gnx, aaa.gnx);
        assert.ok(c.p.__eq__(aaa));
        c.dehoist(); // New in Leo 5.3: should do nothing:
        assert.strictEqual(c.p.gnx, aaa.gnx);
        assert.ok(c.p.__eq__(aaa));
        assert.strictEqual(c.hoistStack.length, [].length);
    });
    //@+node:felix.20220129224954.17: *3* TestCommands.test_c_hoist_followed_by_goto_first_node
    test('test_c_hoist_followed_by_goto_first_node', () => {
        const c = self.c;
        // Create the @settings and @chapter nodes.
        const settings = c.rootPosition()!.insertAfter();
        settings.h = '@settings';
        const chapter = settings.insertAsLastChild();
        chapter.h = '@chapter aaa';
        const aaa = chapter.insertAsLastChild();
        aaa.h = 'aaa node 1';
        // Test.
        assert.ok(!c.hoistStack.length);
        c.selectPosition(aaa);
        assert.ok(!c.hoistStack.length);

        // The de-hoist happens in c.expandOnlyAncestorsOfNode, the call to c.selectPosition.
        if (1) {
            c.hoist();
            c.goToFirstVisibleNode();
            assert.ok(c.p.__eq__(aaa));
            assert.strictEqual(c.p.gnx, aaa.gnx);
        } else {
            c.hoist();
            c.goToFirstNode();
            assert.ok(!c.hoistStack.length);  // The hoist stack must be cleared to show the first node.
            assert.strictEqual(c.p.gnx, c.rootPosition()!.gnx);
            assert.ok(c.p.__eq__(aaa));

            assert.ok(c.p.isVisible(c));
        }
    });
    //@+node:felix.20220129224954.18: *3* TestCommands.test_c_hoist_with_no_children
    test('test_c_hoist_with_no_children', () => {
        const c = self.c;
        c.hoist();
        c.dehoist();
    });
    //@+node:felix.20220129224954.19: *3* TestCommands.test_c_insertBodyTime
    test('test_c_insertBodyTime', () => {
        const c = self.c;
        // p = c.p
        // w = c.frame.body.wrapper
        // s = w.getAllText()
        // w.setInsertPoint(len(s))
        c.insertBodyTime();
    });

    //@+node:felix.20220129224954.20: *3* TestCommands.test_c_markAllAtFileNodesDirty
    test('test_c_markAllAtFileNodesDirty', () => {
        const c = self.c;
        // const marks = [p.v for p in c.all_positions() if p.isMarked()]
        const marks = [...c.all_positions()].filter(p => p.isMarked()).map(p => p.v);
        let ok;
        try {
            ok = true;
            try {
                c.markAllAtFileNodesDirty();
            } catch (p_exception) {
                g.es_exception(p_exception);
                ok = false;
            }
        }
        catch (p_exception) {
            // 
        }
        finally {
            for (let p of c.all_positions()) {
                if (marks.includes(p.v)) {
                    if (!p.isMarked()) {
                        c.setMarked(p);
                    }
                }
                else {
                    if (p.isMarked()) {
                        c.clearMarked(p);
                    }
                }
            }
        }
        assert.ok(ok);
    });
    //@+node:felix.20220129224954.21: *3* TestCommands.test_c_markSubheads
    test('test_c_markSubheads', () => {
        const c = self.c;
        const child1 = c.rootPosition()!.insertAsLastChild();
        const child2 = c.rootPosition()!.insertAsLastChild();
        assert.ok(child1.__bool__() && child2.__bool__());
        c.markSubheads();
    });

    //@+node:felix.20220129224954.22: *3* TestCommands.test_c_pasteOutline_does_not_clone_top_node
    test('test_c_pasteOutline_does_not_clone_top_node', () => {
        const c = self.c;
        const p = c.p;
        p.b = '# text.';
        // child1 = c.rootPosition().insertAsLastChild()
        // c.selectPosition(child)
        c.copyOutline();
        const p2 = c.pasteOutline();
        assert.ok(p2 && p2.__bool__());
        assert.ok(!p2.isCloned());
    });
    //@+node:felix.20220129224954.23: *3* TestCommands.test_c_scanAllDirectives
    test('test_c_scanAllDirectives', () => {
        const c = self.c;
        const d = c.scanAllDirectives(c.p);
        // These are the commander defaults, without any settings.
        assert.strictEqual(d['language'], 'python');
        assert.strictEqual(d['tabwidth'], -4);
        assert.strictEqual(d['pagewidth'], 132);
    });
    //@+node:felix.20220129224954.24: *3* TestCommands.test_c_scanAtPathDirectives
    test('test_c_scanAtPathDirectives', () => {
        const c = self.c;
        const p = self.c.p;
        const child = p.insertAfter();
        child.h = '@path one';
        const grand = child.insertAsLastChild();
        grand.h = '@path two';
        const great = grand.insertAsLastChild();
        great.h = 'xyz';
        const aList = g.get_directives_dict_list(great);
        const w_path = c.scanAtPathDirectives(aList);
        const endpath = g.os_path_normpath('one/two');
        assert.ok(w_path.endsWith(endpath), `expected '${endpath}' got '${path}'`);
    });

    //@+node:felix.20220129224954.25: *3* TestCommands.test_c_scanAtPathDirectives_same_name_subdirs
    test('test_c_scanAtPathDirectives_same_name_subdirs', () => {
        const c = self.c;
        // p2 = p.firstChild().firstChild().firstChild()
        const p = c.p;
        const child = p.insertAfter();
        child.h = '@path again';
        const grand = child.insertAsLastChild();
        grand.h = '@path again';
        const great = grand.insertAsLastChild();
        great.h = 'xyz';
        const aList = g.get_directives_dict_list(great);
        const w_path = c.scanAtPathDirectives(aList);
        const endpath = g.os_path_normpath('again/again');
        assert.ok(w_path && w_path.endsWith(endpath));
    });

    //@+node:felix.20220129224954.26: *3* TestCommands.test_c_tabNannyNode
    // TODO: uncomment when 'tabNannyNode' is implemented
    /*
    test('test_c_tabNannyNode', () => {
        const c = self.c;
        const p = c.p;

        // Test 1.
        const s = textwrap.dedent(`\
            # no error
            def spam():
                pass
        `)
        c.tabNannyNode(p, headline=p.h, body=s)
        // Test 2.
        s2 = textwrap.dedent(`\
            # syntax error
            def spam:
                pass
              a = 2
        `)
        try:
            c.tabNannyNode(p, headline=p.h, body=s2)
        except IndentationError:
            pass
    });
    */
    /* def test_c_tabNannyNode(self):
        c, p = self.c, self.c.p
        # Test 1.
        s = textwrap.dedent("""\
            # no error
            def spam():
                pass
        """)
        c.tabNannyNode(p, headline=p.h, body=s)
        # Test 2.
        s2 = textwrap.dedent("""\
            # syntax error
            def spam:
                pass
              a = 2
        """)
        try:
            c.tabNannyNode(p, headline=p.h, body=s2)
        except IndentationError:
            pass
     */
    //@+node:felix.20220129224954.27: *3* TestCommands.test_c_unmarkAll
    test('test_c_unmarkAll', () => {
        const c = self.c;
        c.unmarkAll();
        for (let p of c.all_positions()) {
            assert.ok(!p.isMarked(), p.h);
        }
    });
    //@+node:felix.20220129224954.28: *3* TestCommands.test_class_StubConfig
    test('test_class_StubConfig', () => {
        const c = self.c;

        class StubConfig extends g.NullObject {
            // pass
        }
        const x = new StubConfig();

        // assert.ok( !x.getBool(c, 'mySetting'));
        //@ts-expect-error Check if it's undefined
        assert.ok(!x.getBool || !x.getBool(c, 'mySetting'));


        // assert.ok( !x.enabledPluginsFileName);
        //@ts-expect-error Check if it's undefined
        assert.ok(!x.enabledPluginsFileName);
    });

    //@+node:felix.20220129224954.29: *3* TestCommands.test_delete_comments_with_multiple_at_language_directives
    // ! uncomment when deleteComments, setSelectionRange and body pane are implemented !
    /* def test_delete_comments_with_multiple_at_language_directives(self):
        c, p, w = self.c, self.c.p, self.c.frame.body.wrapper
        p.b = textwrap.dedent("""\
            @language rest
            rest text.
            @language python
            def spam():
                pass
            # after
    """)
        expected = textwrap.dedent("""\
            @language rest
            rest text.
            @language python
            def spam():
                pass
            # after
    """)
        i = p.b.find('pass')
        w.setSelectionRange(i, i + 4)
        c.deleteComments()
        self.assertEqual(p.b, expected)

     */
    //@+node:felix.20220129224954.30: *3* TestCommands.test_delete_html_comments
    // ! uncomment when deleteComments, setSelectionRange and body pane are implemented !
    /* def test_delete_html_comments(self):
        c, p, w = self.c, self.c.p, self.c.frame.body.wrapper
        p.b = textwrap.dedent("""\
            @language html
            <html>
                <!-- text -->
            </html>
    """)
        expected = textwrap.dedent("""\
            @language html
            <html>
                text
            </html>
    """)
        i = p.b.find('text')
        w.setSelectionRange(i, i + 4)
        c.deleteComments()
        self.assertEqual(p.b, expected)
     */
    //@+node:felix.20220129224954.31: *3* TestCommands.test_delete_python_comments
    // ! uncomment when deleteComments, setSelectionRange and body pane are implemented !
    /* def test_delete_python_comments(self):
        c, p, w = self.c, self.c.p, self.c.frame.body.wrapper
        p.b = textwrap.dedent("""\
            @language python
            def spam():
                # pass
            # after
    """)
        expected = textwrap.dedent("""\
            @language python
            def spam():
                pass
            # after
    """)
        i = p.b.find('pass')
        w.setSelectionRange(i, i + 4)
        c.deleteComments()
        self.assertEqual(p.b, expected)
     */
    //@+node:felix.20220129224954.32: *3* TestCommands.test_efc_ask
    test('test_efc_ask', () => {
        const c = self.c;
        const p = c.p;
        // Not a perfect test, but stil significant.
        const efc = g.app.externalFilesController;
        if (!efc) {
            //  pass
            // self.skipTest('No externalFilesController')
            console.log('no externalFilesController in test_efc_ask');
            return;
        }
        const result = efc.ask(c, p.h);
        assert.ok([true, false].includes(result), result);
    });
    //@+node:felix.20220129224954.33: *3* TestCommands.test_efc_compute_ext
    test('test_efc_compute_ext', () => {
        const c = self.c;
        const p = c.p;
        // Not a perfect test, but stil significant.
        const efc = g.app.externalFilesController;
        if (!efc) {
            //  pass
            // self.skipTest('No externalFilesController')
            console.log('no externalFilesController in test_efc_compute_ext');
            return;
        }
        const table = [
            // (None,'.py'),
            // ('','.py'),
            ['txt', '.txt'],
            ['.txt', '.txt']
        ];
        let ext;
        let result;
        for ([ext, result] of table) {
            const result2 = efc.compute_ext(c, p, ext);
            assert.strictEqual(result, result2, ext);
        }
    });
    //@+node:felix.20220129224954.34: *3* TestCommands.test_efc_compute_temp_file_path
    test('test_efc_compute_temp_file_path', () => {
        const c = self.c;
        const p = c.p;
        // Not a perfect test, but stil significant.
        const efc = g.app.externalFilesController;
        if (!efc) {
            //  pass
            // self.skipTest('No externalFilesController')
            console.log('no externalFilesController in test_efc_compute_ext');
            return;
        }
        const s: string = efc.compute_temp_file_path(c, p, '.py');
        assert.ok(s.endsWith('.py'));
    });
    //@+node:felix.20220129224954.35: *3* TestCommands.test_koi8_r_encoding
    test('test_koi8_r_encoding', () => {
        const c = self.c;
        const p = c.p;
        const p1 = p.insertAsLastChild();
        const s = '\xd4\xc5\xd3\xd4';  // the word 'test' in Russian, koi8-r
        assert.ok((typeof s === 'string' || (s as any instanceof String)), s.toString());
        p1.setBodyString(s);
        c.selectPosition(p1);
        c.copyOutline();
        c.pasteOutline();
        const p2 = p1.next();
        assert.strictEqual(p1.b, p2.b);
    });
    //@+node:felix.20220129224954.36: *3* TestCommands.test_official_commander_ivars
    test('test_official_commander_ivars', () => {
        const c = self.c;
        const f = c.frame;
        assert.strictEqual(c, f.c);
        assert.strictEqual(f, c.frame);
        let ivars = [
            '_currentPosition',
            'hoistStack',
            'mFileName',
            // Subcommanders...
            'atFileCommands', 'fileCommands', 'importCommands', 'undoer',
            // Args...
            'page_width', 'tab_width', 'target_language',
        ];
        for (let ivar of ivars) {
            assert.ok(c.hasOwnProperty(ivar), ivar);
        }
    });

    //@-others

});
//@-others
//@-leo
