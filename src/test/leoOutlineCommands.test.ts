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
        assert.ok(p == self.root_p);
        assert.ok(p.h == 'root');
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
        assert.ok(p == self.root_p);
        assert.ok(p.h == 'root');
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
    //@-others

});

//@-others
//@-leo
