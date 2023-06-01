//@+leo-ver=5-thin
//@+node:felix.20220129003458.1: * @file src/test/leoFind.test.ts
/**
 * Tests of leoFind.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import { StringFindTabManager } from '../core/findTabManager';
import { LeoFind } from '../core/leoFind';

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Commands } from '../core/leoCommands';
import { TagController } from '../core/nodeTags';
import { LeoUnitTest } from './leoTest2';
import { StringTextWrapper } from '../core/leoFrame';

//@+others
//@+node:felix.20230222223919.1: ** DummyTagController
class DummyTagController extends TagController {
    public clones;

    constructor(clones: Position[], c: Commands) {
        super(c);
        this.clones = clones;
    }

    public add_tag(p: Position, tag: string) {
        return this.clones;
    }

    public get_tagged_nodes(tag: string) {
        return this.clones;
    }

    public show_all_tags(): void {
        // pass
    }
}

//@+node:felix.20221226222117.1: ** suite TestFind
suite('Test cases for leoFind.ts', () => {
    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        setUp();
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20221226222117.2: *3* TestFind.setUp
    /**
     * setUp for TestFind class
     */
    function setUp() {

        // super().setUp() // Done in suite init
        const c = self.c;
        const x = new LeoFind(c);
        self.x = x;
        c.findCommands = self.x;
        x.ftm = new StringFindTabManager(c);
        self.settings = x.default_settings();
        make_test_tree();
    }
    //@+node:felix.20221226222117.3: *3* TestFind.make_test_tree
    /**
     * Make a test tree for other tests
     */
    function make_test_tree() {

        const c = self.c;

        // 2023/01/24: Remove any previous tree.
        let root = c.rootPosition()!;
        while (root.hasChildren()) {
            root.firstChild().doDelete();
        }
        root = c.rootPosition()!;
        while (root.hasNext()) {
            root.next().doDelete();
        }
        root = c.rootPosition()!;
        root.h = '@file test.py';
        root.b = "def root():\n    pass\n";
        let last = root;

        function make_child(n: number, p: Position) {
            const p2 = p.insertAsLastChild();
            p2.h = `child ${n}`;
            p2.b = `def child${n}():\n` +
                `    v${n} = 2\n` +
                `    # node ${n} line 1: blabla second blabla bla second ble blu\n` +
                `    # node ${n} line 2: blabla second blabla bla second ble blu`;
            return p2;
        }

        function make_top(n: number, sib: Position) {
            const p = sib.insertAfter();
            p.h = `Node ${n}`;
            p.b = `def top${n}():\n` +
                `    v${n} = 3\n`;
            return p;
        }

        for (let n of [0, 3]) {
            last = make_top(n + 1, last);
            const child = make_child(n + 2, last);
            make_child(n + 3, child);
        }
        for (let p of c.all_positions()) {
            p.v.clearDirty();
            p.v.clearVisited();
        }
        // Always start with the root selected.
        c.selectPosition(c.rootPosition()!);

    }
    //@+node:felix.20221226222117.4: *3* Tests of Commands...
    //@+node:felix.20221226222117.5: *4* TestFind.change-all
    // def test_change_all(self):

    test('test_change_all', () => {
        const c = self.c;
        const settings = self.settings;
        const x = self.x;
        const root = c.rootPosition()!;

        const init = () => {
            make_test_tree();  // Reinit the whole tree.
            settings.change_text = '_DEF_';
            settings.find_text = 'def';
            settings.ignore_case = false;
            settings.node_only = false;
            settings.pattern_match = false;
            settings.suboutline_only = false;
            settings.whole_word = true;
        };

        // Default settings.
        init();
        x.do_change_all(settings);
        // Plain search, ignore case.
        init();
        settings.whole_word = false;
        settings.ignore_case = true;
        x.do_change_all(settings);
        // Node only.
        init();
        settings.node_only = true;
        x.do_change_all(settings);
        // Suboutline only.
        init();
        settings.suboutline_only = true;
        x.do_change_all(settings);
        // Pattern match.
        init();
        settings.pattern_match = true;
        x.do_change_all(settings);
        // Pattern match, ignore case.
        init();
        settings.pattern_match = true;
        settings.ignore_case = true;
        x.do_change_all(settings);
        // Pattern match, with groups.
        init();
        settings.pattern_match = true;
        settings.find_text = '^(def)';
        settings.change_text = '*\\1*';
        x.do_change_all(settings);
        // Ignore case
        init();
        settings.ignore_case = true;
        x.do_change_all(settings);
        // Word, ignore case.
        init();
        settings.ignore_case = true;
        settings.whole_word = true;
        x.do_change_all(settings);
        // Multiple matches
        init();
        root.h = 'abc';
        root.b = 'abc\nxyz abc\n';
        settings.find_text = settings.change_text = 'abc';
        x.do_change_all(settings);
        // Set ancestor @file node dirty.
        root.h = '@file xyzzy';
        settings.find_text = settings.change_text = 'child1';
        x.do_change_all(settings);
    });
    //@+node:felix.20221226222117.6: *4* TestFind.change-all (@file node)
    test('test_change_all_with_at_file_node', () => {
        const c = self.c;
        const settings = self.settings;
        const x = self.x;

        const root = c.rootPosition()!.next();  // Must have children.
        settings.find_text = 'def';
        settings.change_text = '_DEF_';
        settings.ignore_case = false;
        settings.whole_word = true;
        settings.pattern_match = false;
        settings.suboutline_only = false;
        // Ensure that the @file node is marked dirty.
        root.h = '@file xyzzy.py';
        root.b = '';
        root.v.clearDirty();
        assert.ok(root.anyAtFileNodeName());
        x.do_change_all(settings);
        assert.ok(root.v.isDirty(), root.h);
    });
    //@+node:felix.20221226222117.7: *4* TestFind.change-all (headline)
    test('test_change_all_headline', () => {
        const settings = self.settings;
        const x = self.x;
        settings.find_text = 'child';
        settings.change_text = '_CHILD_';
        settings.ignore_case = false;
        settings.in_headline = true;
        settings.whole_word = true;
        settings.pattern_match = false;
        settings.suboutline_only = false;
        x.do_change_all(settings);
    });
    //@+node:felix.20221226222117.8: *4* TestFind.clone-find-all
    test('test_clone_find_all', () => {
        const settings = self.settings;
        const x = self.x;
        // Regex find.
        settings.find_text = '^def\\b';
        settings.change_text = 'def';  // Don't actually change anything!
        settings.pattern_match = true;
        x.do_clone_find_all(settings);
        // Word find.
        settings.find_text = 'def';
        settings.whole_word = true;
        settings.pattern_match = false;
        x.do_clone_find_all(settings);
        // Suboutline only.
        settings.suboutline_only = true;
        x.do_clone_find_all(settings);
    });
    //@+node:felix.20221226222117.9: *4* TestFind.clone-find-all-flattened
    test('test_clone_find_all_flattened', () => {
        const settings = self.settings;
        const x = self.x;
        // regex find.
        settings.find_text = '^def\\b';
        settings.pattern_match = true;
        x.do_clone_find_all_flattened(settings);
        // word find.
        settings.find_text = 'def';
        settings.whole_word = true;
        settings.pattern_match = false;
        x.do_clone_find_all_flattened(settings);
        // Suboutline only.
        settings.suboutline_only = true;
        x.do_clone_find_all_flattened(settings);
    });
    //@+node:felix.20221226222117.10: *4* TestFind.clone-find-marked
    test('test_clone_find_marked', () => {
        const c = self.c;
        const x = self.x;
        const root = c.rootPosition()!;
        root.setMarked();
        x.cloneFindAllMarked();
        x.cloneFindAllFlattenedMarked();
        root.setMarked();
    });
    //@+node:felix.20221226222117.11: *4* TestFind.clone-find-parents
    test('test_clone_find_parents', () => {
        const c = self.c;
        const x = self.x;
        const root = c.rootPosition()!;
        const p = root.next().firstChild();
        p.clone();  // c.p must be a clone.
        c.selectPosition(p);
        x.cloneFindParents();
    });
    //@+node:felix.20221226222117.12: *4* TestFind.clone-find-tag
    test('test_clone-find-tag', () => {
        const c = self.c;
        const x = self.x;
        c.theTagController = new DummyTagController([c.rootPosition()!], c);
        x.do_clone_find_tag('test');
        c.theTagController = new DummyTagController([], c);
        x.do_clone_find_tag('test');
        //@verbatim
        //@ts-expect-error
        c.theTagController = undefined;
        x.do_clone_find_tag('test');
    });
    //@+node:felix.20221226222117.13: *4* TestFind.find-all
    test('test_find_all', () => {
        const settings = self.settings;
        const x = self.x;

        const init = () => {
            // x.findAllUniqueFlag = false; // unused 
            make_test_tree();  // Reinit the whole tree.
            x.unique_matches = [];
            settings.change_text = '_DEF_';
            settings.find_text = 'def';
            settings.ignore_case = false;
            settings.node_only = false;
            settings.pattern_match = false;
            settings.suboutline_only = false;
            settings.whole_word = true;
        };

        // Test 1.
        let find_text, expected_count;
        let w_case, regex, word;
        for (const aTuple of [
            ['settings', [true, false, false]],
            ['def', 7],
            ['bla', 40],
        ]) {
            if (aTuple[0] === 'settings') {
                [w_case, regex, word] = aTuple[1] as [boolean, boolean, boolean];
            } else {
                [find_text, expected_count] = aTuple;
                init();
                settings.find_text = find_text as string;
                settings.ignore_case = w_case as boolean;
                settings.pattern_match = regex as boolean;
                settings.whole_word = word as boolean;
                assert.ok(self.c, self.c.rootPosition()!.gnx);
                const result_dict = x.do_find_all(settings);
                const count = result_dict['total_matches'];
                assert.strictEqual(count, expected_count, find_text as string);
            }
        }
        // Test 2.
        init();
        settings.suboutline_only = true;
        x.do_find_all(settings);
        // Test 3.
        init();
        settings.search_headline = false;
        settings.p!.setVisited();
        x.do_find_all(settings);
        // Test 4.
        /*
        init()
        // x.findAllUniqueFlag = true
        settings.pattern_match = true;
        settings.find_text = '^(def)';
        settings.change_text = '*\1*';
        x.do_find_all(settings);
        */
        // Test 5: no match.
        init();
        settings.find_text = 'not-found-xyzzy';
        x.do_find_all(settings);
    });
    //@+node:felix.20221226222117.14: *4* TestFind.find-def
    test('test_find_def', () => {

        const x = self.x;
        // Test 1: Test methods called by x.find_def.
        x._save_before_find_def(x.c.rootPosition());  // Also tests _restore_after_find_def.

        // Test 2:
        for (const reverse of [true, false]) {
            // Successful search.
            x.reverse_find_defs = reverse;
            let settings = x._compute_find_def_settings('def child5');
            let p, pos, newpos;
            [p, pos, newpos] = x.do_find_def(settings);
            assert.ok(p && p.__bool__());
            assert.strictEqual(p.h, 'child 5');
            const s = p.b.substring(pos, newpos);
            assert.strictEqual(s, 'def child5');
            // Unsuccessful search.
            settings = x._compute_find_def_settings('def xyzzy');
            [p, pos, newpos] = x.do_find_def(settings);
            assert.strictEqual(p, undefined, p ? p.gnx : 'undefined');
        }

    });
    //@+node:felix.20221226222117.15: *4* TestFind.find-next
    test('test_find_next', () => {
        const settings = self.settings;
        const x = self.x;
        let p, pos, newpos;
        settings.find_text = 'def top1';
        [p, pos, newpos] = x.do_find_next(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, 'Node 1');
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, settings.find_text);
    });
    //@+node:felix.20221226222117.16: *4* TestFind.find-next (file-only)
    test('test_find_next_file_only', () => {
        const settings = self.settings;
        const x = self.x;
        let p, pos, newpos;
        settings.file_only = true; // init_ivars_from_settings will set the ivar.
        settings.find_text = 'def root()';
        [p, pos, newpos] = x.do_find_next(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, '@file test.py');
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, settings.find_text);
    });
    //@+node:felix.20221226222117.17: *4* TestFind.find-next (suboutline-only)
    test('test_find_next_suboutline_only', () => {
        const settings = self.settings;
        const x = self.x;
        let p, pos, newpos;
        settings.find_text = 'def root()';
        settings.suboutline_only = true;  // init_ivars_from_settings will set the ivar.
        [p, pos, newpos] = x.do_find_next(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, '@file test.py');
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, settings.find_text);
    });
    //@+node:felix.20221226222117.18: *4* TestFind.change-then-find (headline)
    test('test_change_then_find_in_headline', () => {
        //     # Test #2220:
        //     # https://github.com/leo-editor/leo-editor/issues/2220
        // Let block.
        const c = self.c;
        const settings = self.settings;
        const x = self.x;
        // Set up the search.
        settings.find_text = 'Test';
        settings.change_text = 'XX';
        // Create the tree.
        const test_p = self.c.rootPosition()!.insertAfter();
        test_p.h = 'Test1 Test2 Test3';
        const after_p = test_p.insertAfter();
        after_p.h = 'After';
        // Find test_p.
        let p, pos, newpos;

        [p, pos, newpos] = x.do_find_next(settings);
        assert.ok(p.__eq__(test_p));
        const w = c.edit_widget(p) as StringTextWrapper;
        assert.strictEqual(test_p.h, w.getAllText());
        assert.strictEqual(w.getSelectionRange()[0], pos);
        assert.strictEqual(w.getSelectionRange()[1], newpos);
        // Do change-then-find.
        const ok = x.do_change_then_find(settings);
        assert.ok(ok);
        p = c.p;
        assert.ok(p.__eq__(test_p));
        assert.strictEqual(p.h, 'XX1 Test2 Test3');
    });
    //@+node:felix.20221226222117.19: *4* TestFind.find-prev
    test('test_find_prev', () => {
        const c = self.c;
        const settings = self.settings;
        const x = self.x;
        settings.find_text = 'def top1';
        // Start at end, so we stay in the node.
        const grand_child = g.findNodeAnywhere(c, 'child 6');
        settings.p = grand_child;
        assert.ok(settings.p?.__bool__());
        settings.find_text = 'def child2';
        // Set c.p in the command.
        x.c.selectPosition(grand_child);
        let p, pos, newpos;
        [p, pos, newpos] = x.do_find_prev(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, 'child 2');
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, settings.find_text);
    });
    //@+node:felix.20221226222117.20: *4* TestFind.find-var
    test('test_find_var', () => {
        const x = self.x;
        const settings = x._compute_find_def_settings('v5 =');
        let p, pos, newpos;
        [p, pos, newpos] = x.do_find_var(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, 'child 5');
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, 'v5 =');
    });
    //@+node:felix.20221226222117.21: *4* TestFind.replace-then-find
    test('test_replace_then_find', () => {
        const settings = self.settings;
        const w = self.c.frame.body.wrapper;
        const x = self.x;
        settings.find_text = 'def top1';
        settings.change_text = 'def top';
        // find-next
        let p, pos, newpos;
        [p, pos, newpos] = x.do_find_next(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, 'Node 1');
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, settings.find_text);
        // replace-then-find
        w.setSelectionRange(pos, newpos, pos);
        x.do_change_then_find(settings);
        // Failure exit.
        w.setSelectionRange(0, 0);
        x.do_change_then_find(settings);
    });
    test('test_replace_then_find_regex', () => {
        const settings = self.settings;
        const w = self.c.frame.body.wrapper;
        const x = self.x;
        settings.find_text = '(def) top1';
        settings.change_text = '\\1\\1';
        settings.pattern_match = true;
        // find-next
        let p, pos, newpos;
        [p, pos, newpos] = x.do_find_next(settings);
        const s = p.b.substring(pos, newpos);
        assert.strictEqual(s, 'def top1');
        // replace-then-find
        w.setSelectionRange(pos, newpos, pos);
        x.do_change_then_find(settings);
    });
    test('test_replace_then_find_in_headline', () => {
        const settings = self.settings;
        const x = self.x;
        // const p = settings.p!; // ! TODO : CHECK IF ERROR !
        settings.find_text = 'Node 1';
        settings.change_text = 'Node 1a';
        settings.in_headline = true;
        // find-next
        let p, pos, newpos;
        [p, pos, newpos] = x.do_find_next(settings);
        assert.ok(p && p.__bool__());
        assert.strictEqual(p.h, settings.find_text);
        const w = self.c.edit_widget(p);
        assert.ok(w);
        const s = p.h.substring(pos, newpos);
        assert.strictEqual(s, settings.find_text);
    });
    //@+node:felix.20221226222117.22: *4* TestFind.tag-children
    test('test_tag_children', () => {
        const c = self.c;
        const x = self.x;
        const p = c.rootPosition()!.next();
        //@verbatim
        //@ts-expect-error
        c.theTagController = undefined;
        x.do_tag_children(p, 'test');
        c.theTagController = new DummyTagController([], c);
        x.do_tag_children(p, 'test');
    });
    //@+node:felix.20221226222117.23: *4* testFind.test_batch_change_regex
    test('test_batch_change_regex', () => {
        const c = self.c;
        const x = self.x;
        // self.dump_tree();
        // Test 1: Match in body.
        const settings = {
            ignore_case: false,
            node_only: false,
            pattern_match: true,
            search_body: true,
            search_headline: true,
            suboutline_only: false,
            whole_word: false
        };

        // Test 1: Match in body.
        let n = x.batch_change(
            c.rootPosition(),
            [['^def\\b', 'DEF'],],
            settings);
        assert.ok(n > 3, n);  // Test 1.
        // Test 2: Match in headline.
        n = x.batch_change(
            c.rootPosition(),
            [['^Node\\b', 'DEF'],],
            settings);
        assert.strictEqual(n, 2);
        // Test 3: node-only.
        settings['node_only'] = true;
        n = x.batch_change(
            c.rootPosition(),
            [['^DEF\\b', 'def'],],
            settings);
        assert.strictEqual(n, 1);
        // Test 4: suboutline-only.
        settings['node_only'] = false;
        settings['suboutline_only'] = true;
        n = x.batch_change(
            c.rootPosition(),
            [['^def\\b', 'DEF'],],
            settings);
        assert.strictEqual(n, 1);
    });
    //@+node:felix.20221226222117.24: *4* testFind.test_batch_change_word
    test('test_batch_change_word', () => {
        //     // settings, x = self.settings, self.x
        const c = self.c;
        const x = self.x;
        const settings = {
            ignore_case: false,
            node_only: false,
            pattern_match: false,
            search_body: true,
            search_headline: true,
            suboutline_only: false,
            whole_word: true,
        };
        const n = x.batch_change(
            c.rootPosition(),
            [['def', 'DEF'],],
            settings);
        assert.ok(n > 0);
    });
    //@+node:felix.20221226222117.25: *4* TestFind.test_tree
    test('test_tree', () => {
        const c = self.c;

        const table = [
            [0, '@file test.py'],
            [0, '@file test.py'],
            [0, 'Node 1'],
            [1, 'child 2'],
            [2, 'child 3'],
            [0, 'Node 4'],
            [1, 'child 5'],
            [2, 'child 6'],
        ];
        for (const [level, h] of table) {
            const p = g.findNodeAnywhere(c, h as string);
            assert.strictEqual(p?.h, h);
            assert.strictEqual(p?.level(), level);
        }
    });
    //@+node:felix.20221226222117.26: *3* Tests of Helpers...
    //@+node:felix.20221226222117.27: *4* TestFind.test_argument_errors
    test('test_argument_errors', () => {
        const settings = self.settings;
        const x = self.x;
        // Bad search pattern.
        settings.find_text = '^def\\b((';
        settings.pattern_match = true;
        x.do_clone_find_all(settings);
        x.find_next_match(undefined);
        x.do_change_all(settings);
    });
    //@+node:felix.20221226222117.28: *4* TestFind.test_cfa_backwards_search
    test('test_cfa_backwards_search', () => {
        const settings = self.settings;
        const x = self.x;
        const pattern = 'def';
        for (const nocase of [true, false]) {
            settings.ignore_case = nocase;
            for (const word of [true, false]) {
                for (const s of ['def spam():\n', 'define spam']) {
                    settings.whole_word = word;
                    x.init_ivars_from_settings(settings);
                    x._inner_search_backward(s, 0, s.length, pattern, nocase, word);
                    x._inner_search_backward(s, 0, 0, pattern, nocase, word);
                }
            }
        }
    });
    //@+node:felix.20221226222117.29: *4* TestFind.test_cfa_find_next_match
    test('test_cfa_find_next_match', () => {
        const c = self.c;
        const settings = self.settings;
        const x = self.x;
        const p = c.rootPosition()!;
        for (const find of ['xxx', 'def']) {
            settings.find_text = find;
            x._cfa_find_next_match(p);
        }
    });
    //@+node:felix.20221226222117.30: *4* TestFind.test_cfa_match_word
    test('test_cfa_match_word', () => {
        const x = self.x;
        x._inner_search_match_word("def spam():", 0, "spam");
        x._inner_search_match_word("def spam():", 0, "xxx");
    });
    //@+node:felix.20221226222117.31: *4* TestFind.test_cfa_plain_search
    test('test_cfa_plain_search', () => {
        const settings = self.settings;
        const x = self.x;
        const pattern = 'def';
        for (const nocase of [true, false]) {
            settings.ignore_case = nocase;
            for (const word of [true, false]) {
                for (const s of ['def spam():\n', 'define']) {
                    settings.whole_word = word;
                    x.init_ivars_from_settings(settings);
                    x._inner_search_plain(s, 0, s.length, pattern, nocase, word);
                    x._inner_search_plain(s, 0, 0, pattern, nocase, word);
                }
            }
        }
    });
    //@+node:felix.20221226222117.32: *4* TestFind.test_cfa_regex_search
    test('test_cfa_regex_search', () => {
        const x = self.x;
        let pattern;
        pattern = '(.*)pattern';
        x.re_obj = new RegExp(pattern, 'mg');
        const table = [
            'test pattern',  // Match.
            'xxx',  // No match.
        ];
        for (const backwards of [true, false]) {
            for (const nocase of [true, false]) {
                for (const s of table) {
                    let i, j;
                    if (backwards) {
                        i = s.length;
                        j = s.length;
                    } else {
                        i = 0;
                        j = 0;
                    }
                    x._inner_search_regex(s, i, j, pattern, backwards, nocase);
                }
            }
        }
        // Error test.
        x.re_obj = undefined;
        const backwards = undefined;
        pattern = undefined;
        const nocase = undefined;
        x._inner_search_regex("", 0, 0, pattern, backwards, nocase);
    });
    //@+node:felix.20221226222117.33: *4* TestFind.test_check_args
    test('test_check_args', () => {
        // Bad search patterns..
        const x = self.x;
        const settings = self.settings;
        // Not searching headline or body.
        settings.search_body = false;
        settings.search_headline = false;
        x.do_clone_find_all(settings);
        // Empty find pattern.
        settings.search_body = true;
        settings.find_text = '';
        x.do_clone_find_all(settings);
        x.do_clone_find_all_flattened(settings);
        x.do_find_all(settings);
        x.do_find_next(settings);
        x.do_find_next(settings);
        x.do_find_prev(settings);
        x.do_change_all(settings);
        x.do_change_then_find(settings);
    });
    //@+node:felix.20221226222117.34: *4* TestFind.test_clean_init
    test('test_clean_init', () => {
        const c = self.c;
        const x = new LeoFind(c);
        const table = [
            'ignore_case', 'node_only', 'pattern_match',
            'search_headline', 'search_body', 'suboutline_only',
            'mark_changes', 'mark_finds', 'whole_word',
        ];
        for (const ivar of table) {
            assert.strictEqual(x[ivar as keyof LeoFind], undefined, ivar);
        }
        assert.strictEqual(x.reverse, false);
    });
    //@+node:felix.20221226222117.35: *4* TestFind.test_compute_result_status
    test('test_compute_result_status', () => {
        const x = self.x;
        // find_all_flag is true
        const all_settings = x.default_settings();
        all_settings.ignore_case = true;
        all_settings.pattern_match = true;
        all_settings.whole_word = true;
        all_settings.wrapping = true;
        x.init_ivars_from_settings(all_settings);
        x.compute_result_status(true);
        // find_all_flag is false
        const partial_settings = x.default_settings();
        partial_settings.search_body = true;
        partial_settings.search_headline = true;
        partial_settings.node_only = true;
        partial_settings.suboutline_only = true;
        partial_settings.wrapping = true;
        x.init_ivars_from_settings(partial_settings);
        x.compute_result_status(false);
    });
    //@+node:felix.20230224225251.1: *4* TestFind.test_find_all_plain
    test('test_find_all_plain', () => {
        const c = self.c;
        const fc = c.findCommands;
        const table = [
            [false, false],
            // s         find    expected
            ['aA', 'a', [0]],
            ['aAa', 'A', [1]],
            ['AAbabc', 'b', [2, 4]],

            [true, false],
            ['axA', 'a', [0, 2]],
            ['aAa', 'A', [0, 1, 2]],
            ['ABbabc', 'b', [1, 2, 4]],

            [true, true],
            ['ax aba ab abc', 'ab', [7]],
            ['ax aba\nab abc', 'ab', [7]],
            ['ax aba ab\babc', 'ab', [7]],
        ];
        let s, find, expected;
        for (const aTuple of table) {
            if (aTuple.length === 2) {
                [fc.ignore_case, fc.whole_word] = aTuple as [boolean, boolean];
            } else {
                [s, find, expected] = aTuple;
                const aList = fc.find_all_plain(find as string, s as string);
                assert.deepStrictEqual(aList, expected, s as string);
            }
        }
    });
    //@+node:felix.20230224225257.1: *4* TestFind.test_find_all_regex
    test('test_find_all_regex', () => {
        const c = self.c;
        const fc = c.findCommands;
        const regex_table = [
            // s                  find        expected
            ['a ba aa a ab a', '\\b\\w+\\b', [0, 2, 5, 8, 10, 13]],
            ['a AA aa aab ab a', '\\baa\\b', [5]],
            // Multi-line
            ['aaa AA\naa aab', '\\baa\\b', [7]],
        ];
        for (const [s, find, expected] of regex_table) {
            fc.ignore_case = false;
            const aList = fc.find_all_regex(find as string, s as string);
            assert.deepStrictEqual(aList, expected, s as string);
        }
    });
    //@+node:felix.20221226222117.36: *4* TestFind.test_inner_search_backward
    test('test_inner_search_backward', () => {
        const c = self.c;
        const x = new LeoFind(c);

        const test = (table: any, table_name: string, nocase: boolean, word: boolean) => {
            let test_n = 0;
            for (let [pattern, s, i, j, expected, expected_i, expected_j] of table) {
                test_n += 1;
                if (j === -1) {
                    j = s.length;
                }
                let got_i, got_j;
                [got_i, got_j] = x._inner_search_backward(s, i, j, pattern, nocase, word);
                const got = s.substring(got_i, got_j);
                assert.ok(expected === got && got_i === expected_i && got_j === expected_j,
                    `\n     table: ${table_name}` +
                    `\n    i test: ${test_n}` +
                    `\n   pattern: ${pattern}` +
                    `\n         s: ${s}` +
                    `\n  expected: ${expected}` +
                    `\n       got: ${got}` +
                    `\nexpected i: ${expected_i}` +
                    `\n     got i: ${got_i}` +
                    `\nexpected j: ${expected_j}` +
                    `\n     got j: ${got_j}`
                );
            }
        };

        const plain_table = [
            // pattern   s           i,  j   expected, expected_i, expected_j
            ['a', 'abaca', 0, -1, 'a', 4, 5],
            ['A', 'Abcde', 0, -1, 'A', 0, 1],
        ];
        const nocase_table = [
            // pattern   s           i,  j   expected, expected_i, expected_j
            ['a', 'abaAca', 0, -1, 'a', 5, 6],
            ['A', 'Abcdca', 0, -1, 'a', 5, 6],
        ];
        const word_table = [
            // pattern   s           i,  j   expected, expected_i, expected_j
            ['a', 'abaAca', 0, -1, '', -1, -1],
            ['A', 'AA A AB', 0, -1, 'A', 3, 4],
        ];
        test(plain_table, 'plain_table', false, false);
        test(nocase_table, 'nocase_table', true, false);
        test(word_table, 'word_table', false, true);
    });
    //@+node:felix.20221226222117.37: *4* TestFind.test_inner_search_plain
    test('test_inner_search_plain', () => {
        const c = self.c;
        const x = new LeoFind(c);
        const test = (table: any, table_name: string, nocase: boolean, word: boolean) => {
            let test_n = 0;
            for (let [pattern, s, i, j, expected, expected_i, expected_j] of table) {
                test_n += 1;
                if (j === -1) {
                    j = s.length;
                }
                let got_i, got_j;
                [got_i, got_j] = x._inner_search_plain(s, i, j, pattern, nocase, word);
                const got = s.substring(got_i, got_j);
                assert.ok(expected === got && got_i === expected_i && got_j === expected_j,
                    `\n     table: ${table_name}` +
                    `\n    i test: ${test_n}` +
                    `\n   pattern: ${pattern}` +
                    `\n         s: ${s}` +
                    `\n  expected: ${expected}` +
                    `\n       got: ${got}` +
                    `\nexpected i: ${expected_i}` +
                    `\n     got i: ${got_i}` +
                    `\nexpected j: ${expected_j}` +
                    `\n     got j: ${got_j}`
                );
            }
        };

        const plain_table = [
            // pattern   s           i,  j   expected, expected_i, expected_j
            ['a', 'baca', 0, -1, 'a', 1, 2],
            ['A', 'bAcde', 0, -1, 'A', 1, 2],
        ];
        const nocase_table = [
            // pattern   s           i,  j   expected, expected_i, expected_j
            ['a', 'abaAca', 0, -1, 'a', 0, 1],
            ['A', 'abcdca', 0, -1, 'a', 0, 1],
        ];
        const word_table = [
            // pattern   s           i,  j   expected, expected_i, expected_j
            ['a', 'abaAca', 0, -1, '', -1, -1],
            ['A', 'AA A AAB', 0, -1, 'A', 3, 4],
        ];
        test(plain_table, 'plain_table', false, false);
        test(nocase_table, 'nocase_table', true, false);
        test(word_table, 'word_table', false, true);
    });
    //@+node:felix.20221226222117.38: *4* TestFind.test_inner_search_regex
    test('test_inner_search_regex', () => {
        const c = self.c;
        const x = new LeoFind(c);

        const test = (table: any, table_name: string, back: boolean, nocase: boolean) => {
            let test_n = 0;
            for (let [pattern, s, expected] of table) {
                let flags = "mg";
                if (nocase) {
                    flags += "i";
                }
                x.re_obj = new RegExp(pattern, flags);
                let pos, new_pos;
                [pos, new_pos] = x._inner_search_regex(s, 0, s.length, pattern, back, nocase);
                const got = s.substring(pos, new_pos);
                assert.ok(expected === got,
                    `\n     table: ${table_name}` +
                    `\n   pattern: ${pattern}` +
                    `\n         s: ${s}` +
                    `\n  expected: ${expected}` +
                    `\n       got: ${got}`
                );
            }
        };

        const plain_table = [
            // pattern   s       expected
            ['.', 'A', 'A'],
            ['A', 'xAy', 'A'],
        ];
        const nocase_table = [
            // pattern   s       expected
            ['.', 'A', 'A'],
            ['.', 'a', 'a'],
            ['A', 'xay', 'a'],
            ['a', 'xAy', 'A'],
        ];
        const back_table = [
            // pattern   s           expected
            ['a.b', 'a1b a2b', 'a2b'],
        ];
        test(plain_table, 'plain_table', false, false);
        test(nocase_table, 'nocase_table', false, true);
        test(back_table, 'back_table', true, false);
    });
    //@+node:felix.20221226222117.39: *4* TestFind.test_make_regex_subs
    test('test_make_regex_subs', () => {
        const x = self.x;
        x.re_obj = new RegExp('(.*)pattern', "mgd"); // re.compile('(.*)pattern')  // The search pattern.
        const m = x.re_obj.exec('test pattern');  // The find pattern.
        const change_text = '\\1Pattern\\2';  // \2 is non-matching group.
        x.make_regex_subs(change_text, m);
    });
    //@+node:felix.20221226222117.40: *4* TestFind.test_next_node_after_fail
    test('test_fnm_next_after_fail', () => {
        const settings = self.settings;
        const x = self.x;
        for (const reverse of [true, false]) {
            settings.reverse = reverse;
            for (const wrapping of [true, false]) {
                settings.wrapping = wrapping;
                x.init_ivars_from_settings(settings);
                x._fnm_next_after_fail(settings.p);
            }
        }
    });
    //@+node:felix.20221226222117.41: *4* TestFind.test_replace_all_plain_search
    test('test_replace_all_plain_search', () => {
        const c = self.c;
        const fc = c.findCommands;
        const plain_table: [string, string, string, number, string][] = [
            // s         find    change  count   result
            ['aA', 'a', 'C', 1, 'CA'],
            ['Aa', 'A', 'C', 1, 'Ca'],
            ['Aba', 'b', 'C', 1, 'ACa'],
        ];
        for (const [s, find, change, count, result] of plain_table) {
            fc.ignore_case = false;
            fc.find_text = find;
            fc.change_text = change;
            let count2, result2;
            [count2, result2] = fc._change_all_plain(s);
            assert.strictEqual(result, result2);
            assert.strictEqual(count, count2);
        }
    });
    //@+node:felix.20221226222117.42: *4* TestFind.test_replace_all_plain_search_ignore_case
    test('test_replace_all_plain_search_ignore_case', () => {
        const c = self.c;
        const fc = c.findCommands;
        const plain_table: [string, string, string, number, string][] = [
            // s         find    change  count   result
            ['aA', 'a', 'C', 2, 'CC'],
            ['AbBa', 'b', 'C', 2, 'ACCa'],
        ];
        for (const [s, find, change, count, result] of plain_table) {
            fc.ignore_case = true;
            fc.find_text = find;
            fc.change_text = change;
            let count2, result2;
            [count2, result2] = fc._change_all_plain(s);
            assert.strictEqual(result, result2);
            assert.strictEqual(count, count2);
        };
    });
    //@+node:felix.20221226222117.43: *4* TestFind.test_replace_all_regex_search
    test('test_replace_all_regex_search', () => {
        const c = self.c;
        const fc = c.findCommands;
        const regex_table: [string, string, string, number, string][] = [
            // s                 find        change  count   result
            ['a ba aa a ab a', '\\b\\w+\\b', 'C', 6, 'C C C C C C'],
            ['a AA aa aab ab a', '\\baa\\b', 'C', 1, 'a AA C aab ab a'],
            // Multi-line
            ['aaa AA\naa aab', '\\baa\\b', 'C', 1, 'aaa AA\nC aab'],
        ];
        for (const [s, find, change, count, result] of regex_table) {
            fc.ignore_case = false;
            fc.find_text = find;
            fc.change_text = change;
            let count2, result2;
            [count2, result2] = fc._change_all_regex(s);
            assert.strictEqual(result, result2);
            assert.strictEqual(count, count2);
        }
    });
    //@+node:felix.20221226222117.44: *4* TestFind.test_replace_all_word_search
    test('test_replace_all_word_search', () => {
        const c = self.c;
        const fc = c.findCommands;
        const word_table: [string, string, string, number, string][] = [
            // s                 find    change  count   result
            ['a ba aa a ab a', 'a', 'C', 3, 'C ba aa C ab C'],
            ['a ba aa a ab a', 'aa', 'C', 1, 'a ba C a ab a'],
        ];
        for (const [s, find, change, count, result] of word_table) {
            fc.ignore_case = false;
            fc.find_text = find;
            fc.change_text = change;
            let count2, result2;
            [count2, result2] = fc._change_all_word(s);
            assert.strictEqual(result, result2);
            assert.strictEqual(count, count2);
        }
    });
    //@+node:felix.20221226222117.45: *4* TestFind.test_replace_all_word_search_ignore_case
    test('test_replace_all_word_search_ignore_case', () => {
        const c = self.c;
        const fc = c.findCommands;
        const word_table: [string, string, string, number, string][] = [
            // s                 find    change  count   result
            ['a ba aa A ab a', 'a', 'C', 3, 'C ba aa C ab C'],
            ['a ba aa AA ab a', 'aa', 'C', 2, 'a ba C C ab a'],
        ];
        for (const [s, find, change, count, result] of word_table) {
            fc.ignore_case = true;
            fc.find_text = find;
            fc.change_text = change;
            let count2, result2;
            [count2, result2] = fc._change_all_word(s);
            assert.strictEqual(result, result2);
            assert.strictEqual(count, count2);
        }
    });
    //@+node:felix.20221226222117.46: *4* TestFind.test_replace_back_slashes
    test('test_replace_back_slashes', () => {
        const c = self.c;
        const x = new LeoFind(c);
        const table = [
            ['\\\\', '\\'],
            ['\\n', '\n'],
            ['\\t', '\t'],
            ['a\\bc', 'a\\bc'],
            ['a\\\\bc', 'a\\bc'],
            ['a\\tc', 'a\tc'],  // Replace \t by a tab.
            ['a\\nc', 'a\nc'],  // Replace \n by a newline.
        ];
        for (const [s, expected] of table) {
            const got = x.replace_back_slashes(s);
            assert.strictEqual(expected, got, s);
        }
    });
    //@+node:felix.20221226222117.47: *4* TestFind.test_switch_style
    test('test_switch_style', () => {
        const x = self.x;
        const table = [
            ['', undefined],
            ['TestClass', undefined],
            ['camelCase', 'camel_case'],
            ['under_score', 'underScore'],
        ];
        for (const [s, expected] of table) {
            const result = x._switch_style(s);
            assert.strictEqual(result, expected, s ? s.toString() : 'undefined');
        }
    });

    //@-others
});
//@-others
//@-leo
