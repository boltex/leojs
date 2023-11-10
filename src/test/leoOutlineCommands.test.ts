//@+leo-ver=5-thin
//@+node:felix.20230531185455.1: * @file src/test/leoOutlineCommands.test.ts
/**
 * Unit tests for Leo's outline commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230531185518.1: ** suite TestOutlineCommands
suite('TestOutlineCommands', () => {

    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        const c = self.c;
        const p = self.c.p;

        // ! TEST IF valueOf OVERRIDE IS USED INSTEAD !
        assert.ok(p.__eq__(self.root_p));
        assert.ok(p.h === 'root');
        const table = [
            'child a',
            'child z',
            'child b',
            'child w',
        ];
        for (const h of table) {
            const child = p.insertAsLastChild();
            child.h = h;
        };
        c.selectPosition(c.rootPosition()!);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230531185518.2: *3* TestOutlineCommands.create_test_sort_outline
    /**
     * Create a test outline suitable for sort commands.
     */
    test('create_test_sort_outline', () => {

        const p = self.c.p;

        assert.ok(p.__eq__(self.root_p));
        assert.ok(p.h === 'root');
        const table = [
            'child a',
            'child z',
            'child b',
            'child w',
        ];
        for (const h of table) {
            const child = p.insertAsLastChild();
            child.h = h;
        }
    });
    //@+node:felix.20230531185518.3: *3* TestOutlineCommands.test_sort_children
    test('test_sort_children', () => {

        const c = self.c;
        const u = self.c.undoer;
        assert.ok(self.root_p.h === 'root');

        const original_children: string[] = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        const sorted_children: string[] = original_children.sort();

        c.sortChildren();

        let result_children: string[] = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, sorted_children));
        u.undo();
        result_children = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, original_children));
        u.redo();
        result_children = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, sorted_children));
        u.undo();
        result_children = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, original_children));

    });
    //@+node:felix.20230531185518.4: *3* TestOutlineCommands.test_sort_siblings
    test('test_sort_siblings', () => {

        const c = self.c;
        const u = self.c.undoer;
        assert.ok(self.root_p.h === 'root');

        const original_children: string[] = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        const sorted_children: string[] = original_children.sort();

        c.selectPosition(self.root_p.firstChild());
        c.sortSiblings();

        let result_children: string[] = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, sorted_children));
        u.undo();
        result_children = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, original_children));
        u.redo();
        result_children = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, sorted_children));
        u.undo();
        result_children = self.root_p.v.children.map(z => z.h); // [z.h for z in self.root_p.v.children];
        assert.ok(g.compareArrays(result_children, original_children));

    });
    //@+node:felix.20230902145755.1: *3* TestOutlineCommands.test_move_outline_to_first_child
    test('test_move_outline_to_first_child', () => {
        // Setup.
        const c = self.c;
        const u = self.c.undoer;
        const root = self.root_p;
        assert.strictEqual(root.h, 'root');
        self.create_test_outline();
        const original_children = [...root.v.children];
        const last_child = root.lastChild();
        assert.ok(last_child && last_child.__bool__());
        const last_gnx = last_child.gnx;
        // Move.
        c.selectPosition(last_child);
        c.moveOutlineToFirstChild();
        // Tests.
        assert.strictEqual(c.checkOutline(), 0);
        const first_child = root.firstChild();
        assert.ok(first_child && first_child.__bool__());
        const first_gnx = first_child.gnx;
        assert.strictEqual(first_gnx, last_gnx, first_gnx + ", " + last_gnx);
        u.undo();
        assert.strictEqual(c.checkOutline(), 0);
        assert.ok(g.compareArrays(root.v.children, original_children));
        u.redo();
        assert.strictEqual(c.checkOutline(), 0);
        u.undo();
        assert.strictEqual(c.checkOutline(), 0);
        assert.ok(g.compareArrays(root.v.children, original_children));
    });

    //@+node:felix.20230902145759.1: *3* TestOutlineCommands.test_move_outline_to_last_child
    test('test_move_outline_to_last_child', () => {
        // Setup.
        const c = self.c;
        const u = self.c.undoer;
        const root = self.root_p;
        assert.strictEqual(root.h, 'root');
        self.create_test_outline();
        const original_children = [...root.v.children];
        const first_child = root.firstChild();
        assert.ok(first_child && first_child.__bool__());
        const first_gnx = first_child.gnx;
        // Move.
        // c.selectPosition(first_child)
        c.selectPosition(first_child);
        c.moveOutlineToLastChild();
        // Tests.
        assert.strictEqual(c.checkOutline(), 0);
        const last_child = root.lastChild();
        assert.ok(last_child && last_child.__bool__());
        const last_gnx = last_child.gnx;
        assert.strictEqual(first_gnx, last_gnx, first_gnx + ", " + last_gnx);
        u.undo();
        assert.strictEqual(c.checkOutline(), 0);
        assert.ok(g.compareArrays(root.v.children, original_children));
        u.redo();
        assert.strictEqual(c.checkOutline(), 0);
        u.undo();
        assert.strictEqual(c.checkOutline(), 0);
        assert.ok(g.compareArrays(root.v.children, original_children));
    });

    //@-others

});

//@-others
//@-leo
