//@+leo-ver=5-thin
//@+node:felix.20230528205401.1: * @file src/test/leoPersistence.test.ts
/**
 * Tests of leoPersistence.ts
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230530003947.1: ** suite TestPersistence
suite('Unit tests for leo/core/leoPersistence.ts.', () => {
    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        const c = self.c;

        // self.create_test_outline()

        // Add an @settings, @persistence and @gnx nodes.
        const settings_p = c.lastTopLevel();
        settings_p.b = '@settings';
        const persistence_p = settings_p.insertAfter();
        persistence_p.h = '@persistence';
        const gnx_p = persistence_p.insertAsLastChild();
        gnx_p.h = '@gnxs';
        gnx_p.b = 'gnx: ekr.20140923080452\n' + 'unl: node1\n';

        c.selectPosition(c.rootPosition()!);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230530003947.4: *3* TestPersistence.test_delete_all_children_of_persistence_node
    test('test_delete_all_children_of_persistence_node', () => {
        const c = self.c;
        const pd = self.c.persistenceController;
        const persistence = g.findNodeAnywhere(c, '@persistence');
        assert.ok(persistence && persistence.__bool__());
        assert(pd.has_at_persistence_node());
        persistence.deleteAllChildren();
        assert(persistence && persistence.__bool__());

    });
    //@+node:felix.20230530003947.5: *3* TestPersistence.test_p_sort_key
    test('test_p_sort_key', () => {
        const c = self.c;
        const p = self.c.p;
        const aList = [];
        for (const z of c.all_positions()) {
            aList.push(z.copy());
        }
        // const aList2 = sorted(aList, p.sort_key);
        const aList2 = aList.sort((a: Position, b: Position) => {
            // Compare using a.sort_key and b.p.sort_key
            const w_a = a.sort_key(a);
            const w_b = b.sort_key(b);
            if (w_a.length === w_b.length) {
                for (const [i, val] of w_a.entries()) {
                    if (w_a[i] !== w_b[i]) {
                        return w_a[i] - w_b[i];
                    }
                }
                return 0; // loop finished still no difference
            } else {
                return w_a.length - w_b.length;
            }
        });

        for (let [i, p_p] of aList2.entries()) {
            const p2 = aList[i];
            assert.ok(p_p.__eq__(p2), `i: ${i}, p_p.h: ${p_p.h}. p2: ${p2.h}`);
        }
    });
    //@+node:felix.20230530003947.6: *3* TestPersistence.test_pd_find_at_data_and gnxs_nodes
    test('test_pd_find_at__', () => {
        const pd = self.c.persistenceController;
        // Also a test of find_at_views_node, find_at_organizers_node and find_at_clones_node.
        const persistence = pd.find_at_persistence_node();
        assert.ok(persistence && persistence.__bool__());
        persistence.deleteAllChildren();
        const root = self.root_p;
        root.h = '@auto root';  // Make root look like an @auto node.
        assert.ok(pd.find_at_data_node(root));
        assert.ok(pd.find_at_gnxs_node(root));
    });
    //@+node:felix.20230530003947.7: *3* TestPersistence.test_pd_find_position_for_relative_unl
    test('test_pd_find_position_for_relative_unl', () => {
        const p = self.c.p;
        const pd = self.c.persistenceController;
        const parent = p.copy();
        // node1
        const node1 = parent.insertAsLastChild();
        node1.h = 'node1';
        const child11 = node1.insertAsLastChild();
        child11.h = 'child11';
        const child12 = node1.insertAsLastChild();
        child12.h = 'child12';
        // node2
        const node2 = parent.insertAsLastChild();
        node2.h = 'node2';
        const child21 = node2.insertAsLastChild();
        child21.h = 'child21';
        const child22 = node2.insertAsLastChild();
        child22.h = 'child22';
        // node3
        const node3 = parent.insertAsLastChild();
        node3.h = 'node3';
        const table: [string, Position | undefined][] = [
            ['', parent],  // Important special case.
            ['node1-->child11', child11],
            ['node1-->child12', child12],
            ['node2', node2],
            ['node2-->child21', child21],
            ['node2-->child22', child22],
            // Partial matches.
            // ('node3-->child1-->child21',node3_child1_child21),
            // ('child1-->child21',node3_child1_child21),
            // ('xxx-->child21',node3_child1_child21),
            // This is ambiguous.
            // No matches.
            ['nodex', undefined],
            ['node1-->childx', undefined],
            ['node3-->childx', undefined],
        ];
        for (const [unl, expected] of table) {
            const result = pd.find_position_for_relative_unl(parent, unl);
            assert.ok((result && expected && result.__eq__(expected)) || (!result && !expected), unl);
        }
    });
    //@+node:felix.20230530003947.8: *3* TestPersistence.test_pd_find_representative_node
    test('test_pd_find_representative_node', () => {
        const pd = self.c.persistenceController;
        const root = self.root_p;
        root.h = '@auto root';
        const inner_clone = root.insertAsLastChild();
        inner_clone.h = 'clone';
        const outer_clone = inner_clone.clone();
        outer_clone.moveAfter(root);
        const rep = pd.find_representative_node(root, inner_clone);
        assert.ok(rep);
        assert.ok(rep.__eq__(outer_clone));
    });
    //@+node:felix.20230530003947.9: *3* TestPersistence.test_pd_has_at_gnxs_node
    test('test_pd_has_at_gnxs_node', () => {

        const c = self.c;
        const pd = self.c.persistenceController;

        // Set up the tree.
        const root = self.root_p;
        root.h = '@auto root';  // Make root look like an @auto node.
        const inner_clone = root.insertAsLastChild();
        inner_clone.h = 'clone';
        const outer_clone = inner_clone.clone();
        outer_clone.moveAfter(root);
        // Test the tree.
        const persistence = g.findNodeAnywhere(c, '@persistence');
        assert.ok(persistence && persistence.__bool__());
        assert.ok(pd.has_at_persistence_node());
        // Update the tree.
        persistence.deleteAllChildren();  // Required
        assert.ok(persistence && persistence.__bool__());
        pd.update_before_write_foreign_file(root);
        const data = g.findNodeInTree(c, persistence, '@data:@auto root');
        assert.ok(data && data.__bool__());
        const data2 = pd.has_at_data_node(root);
        assert.ok(data2 && data2.__bool__());
        assert.ok(data.__eq__(data2), data.__repr__() + data2.__repr__());
        const gnxs = g.findNodeInTree(c, persistence, '@gnxs');
        assert.ok(gnxs && gnxs.__bool__());
        const gnxs2 = pd.has_at_gnxs_node(root);
        assert.ok(gnxs2 && gnxs2.__bool__());
        assert.ok(gnxs.__eq__(gnxs2), gnxs.__repr__() + gnxs2.__repr__());
    });
    //@+node:felix.20230530003947.10: *3* TestPersistence.test_pd_restore_gnxs
    test('test_pd_restore_gnxs', () => {
        const c = self.c;
        const pd = self.c.persistenceController;
        const root = self.root_p;
        // Set up the tree.
        const persistence = g.findNodeAnywhere(c, '@persistence');
        assert.ok(persistence && persistence.__bool__());
        const gnxs = g.findNodeAnywhere(c, '@gnxs');
        assert.ok(gnxs && gnxs.__bool__());
        const inner_clone = root.insertAsLastChild();
        inner_clone.h = 'clone';
        const outer_clone = inner_clone.clone();
        outer_clone.moveAfter(root);
        const node1 = root.insertAsLastChild();
        node1.h = 'node1';
        // Test.
        root.deleteAllChildren();
        pd.restore_gnxs(gnxs, root);
    });
    //@+node:felix.20230530003947.11: *3* TestPersistence.test_pd_unl
    test('test_pd_unl', () => {
        const c = self.c;
        const pd = self.c.persistenceController;
        const root = self.root_p;
        const node1 = root.insertAsLastChild();
        node1.h = 'node1';
        c.selectPosition(node1);
        const unl = pd.unl(c.p);
        const expected = `-->${c.p.h}`;
        assert.ok(unl.endsWith(expected), unl.toString());
    });
    //@+node:felix.20230530003947.12: *3* TestPersistence.test_pd_update_before_write_foreign_file
    test('test_pd_update_before_write_foreign_file', () => {
        const c = self.c;
        const pd = self.c.persistenceController;
        const root = self.root_p;
        assert.ok(root && root.__bool__());
        const persistence = pd.find_at_persistence_node();
        assert.ok(persistence && persistence.__bool__());
        persistence.deleteAllChildren();
        root.h = '@auto root';  // Make root look like an @auto node.
        pd.update_before_write_foreign_file(root);
        const data = g.findNodeAnywhere(c, '@data:@auto root');
        assert.ok(data && data.__bool__());
        const gnxs = g.findNodeInTree(c, data, '@gnxs');
        assert.ok(gnxs && gnxs.__bool__());
    });
    //@-others
});
//@-others
//@-leo
