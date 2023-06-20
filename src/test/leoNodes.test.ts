//@+leo-ver=5-thin
//@+node:felix.20220129002948.1: * @file src/test/leoNodes.test.ts
/**
 * Tests for leo.core.leoNodes
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import { Chapter } from '../core/leoChapters';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20220129225027.1: ** suite TestNodes
suite('Unit tests for leo/core/leoNodes.ts.', () => {
    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        const c = self.c;
        self.create_test_outline();
        c.selectPosition(c.rootPosition()!);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230530211011.1: *3* TestNodes.tests...
    //@@language typescript
    //@+node:felix.20230530211011.2: *4* TestNodes:  Special methods
    //@+node:felix.20230530211011.3: *5* TestNodes.test_archivedPosition
    test('test_archivedPosition', () => {
        const c = self.c;
        const fc = self.c.fileCommands;
        const root_p = c.rootPosition()!;
        const root_v = c.rootPosition()!.v;
        g.trace(root_p._childIndex);
        for (const p of c.all_positions()) {
            // ap1 and ap2 are lists of ints.
            const ap1 = p.archivedPosition();
            const ap2 = p.archivedPosition(root_p);
            assert.ok(ap1 && ap1.length, p.h);
            assert.ok(ap2 && ap2.length, p.h);

            const ap1_s = ap1.map(z => z.toString()).join('.');
            const ap2_s = ap2.map(z => z.toString()).join('.');

            const p1 = fc.resolveArchivedPosition(ap1_s, root_v);
            assert.ok(p1, root_v.toString());
            const p2 = fc.resolveArchivedPosition(ap2_s, root_v);
            assert.ok(p2, root_v.toString());
            assert.ok(p1 === p2, p.h);

        };
    });
    //@+node:felix.20230530211011.4: *5* TestNodes.test_p__eq_
    test('test_p__eq_', () => {
        const c = self.c;
        const p = self.c.p;
        // These must not return NotImplemented!
        const root = c.rootPosition()!;
        assert.ok(!p.__eq__(undefined));
        assert.ok(p.__ne__(undefined));
        assert.ok(p.__eq__(root));
        assert.ok(!p.__ne__(root));
    });
    //@+node:felix.20230530211011.5: *5* TestNodes.test_p__gt__

    test('test_p__gt__', () => {
        // p.__gt__ is the foundation for >, <, >=, <=.

        // ! TEST IF valueOf OVERRIDE IS USED INSTEAD !

        const p = self.c.rootPosition()!;
        let n = 0;
        // Test all possible comparisons.
        while (p.__bool__()) {
            const prev = p.threadBack();  // Make a copy.
            const next = p.threadNext();  // Make a copy.
            while (prev.__bool__()) {
                n += 1;
                assert.ok(p !== prev);
                assert.ok(prev < p);
                assert.ok(p > prev);
                assert.ok(prev.__lt__(p));
                assert.ok(p.__gt__(prev));
                prev.moveToThreadBack();
            }
            while (next.__bool__()) {
                n += 1;
                assert.ok(p !== prev);
                assert.ok(next > p);
                assert.ok(p < next);
                assert.ok(next.__gt__(p));
                assert.ok(p.__lt__(next));
                next.moveToThreadNext();
            }
            p.moveToThreadNext();
            if (p && p.__bool__()) {
                console.log('p.h', p.h);
            }
        }
    });
    //@+node:felix.20230530211011.6: *5* TestNodes.test_p_key
    test('test_p__key__', () => {
        const c = self.c;
        const child = c.p.firstChild();
        child.key();
        child.sort_key(child);
    });
    //@+node:felix.20230530211011.7: *5* TestNodes.test_p_comparisons
    test('test_p_comparisons', () => {
        const c = self.c;
        const p = self.c.p;
        const root = c.rootPosition()!;
        assert.ok(root.__eq__(p));
        const child = p.firstChild();
        assert.ok(child);
        const grandChild = child.firstChild();
        assert.ok(grandChild);
        const copy = p.copy();
        assert.ok(p.__eq__(copy));
        assert.ok(!p.__eq__(p.threadNext()));
        assert.ok(p.__eq__(p));
        assert.ok(!p.__ne__(copy));
        assert.ok(p.__eq__(root));
        assert.ok(!p.__ne__(root));
        assert.ok(p.threadNext().__gt__(p));
        assert.ok(p.threadNext() > p);
        assert.ok(p.threadNext().__ge__(p));
        assert.ok(!p.threadNext().__lt__(p));
        assert.ok(!p.threadNext().__le__(p));
        assert.ok(child.__gt__(p));
        assert.ok(child > p);
        assert.ok(grandChild > child);
    });
    //@+node:felix.20230530211011.8: *4* TestNodes: Commander methods
    //@+node:felix.20230530211011.9: *5* TestNodes.test_c_positionExists
    test('test_c_positionExists', () => {
        const c = self.c;
        const p = self.c.p;
        let child = p.insertAsLastChild();
        assert.ok(c.positionExists(child));
        child.doDelete();
        assert.ok(!c.positionExists(child));
        // also check the same on root level
        child = c.rootPosition()!.insertAfter();
        assert.ok(c.positionExists(child));
        child.doDelete();
        assert.ok(!c.positionExists(child));
    });
    //@+node:felix.20230530211011.10: *5* TestNodes.test_c_positionExists_for_all_nodes
    test('test_c_positionExists_for_all_nodes', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            assert.ok(c.positionExists(p));
            // 2012/03/08: If a root is given, the search is confined to that root only.
        }
    });
    //@+node:felix.20230530211011.11: *5* TestNodes.test_c_safe_all_positions
    test('test_c_safe_all_positions', () => {
        const c = self.c;
        const aList1 = [...c.all_positions()];
        const aList2 = [...c.safe_all_positions()];
        assert.strictEqual(aList1.length, aList2.length);
    });
    //@+node:felix.20230530211011.12: *4* TestNodes: File operations
    //@+node:felix.20230530211011.13: *5* TestNodes.test_at_others_directive
    test('test_at_others_directive', () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        p1.setHeadString('@file zzz');
        const body = `     ${String.fromCharCode(64) + 'others'}
        `; // ugly hack
        p1.setBodyString(body);
        const p2 = p1.insertAsLastChild();
        assert.strictEqual(p1.textOffset(), 0);
        assert.strictEqual(p2.textOffset(), 5);
    });
    //@+node:felix.20230530211011.14: *5* TestNodes.test_insert_node_that_does_not_belong_to_a_derived_file
    test('test_insert_node_that_does_not_belong_to_a_derived_file', () => {
        // Change @file activeUnitTests.txt to @@file activeUnitTests.txt
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        assert.ok(!p1.textOffset());
    });
    //@+node:felix.20230530211011.15: *5* TestNodes.test_organizer_node
    test('test_organizer_node', () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        p1.setHeadString('@file zzz');
        const p2 = p1.insertAsLastChild();
        assert.strictEqual(p1.textOffset(), 0);
        assert.strictEqual(p2.textOffset(), 0);
    });
    //@+node:felix.20230530211011.16: *5* TestNodes.test_root_of_a_derived_file
    test('test_root_of_a_derived_file', () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        p1.setHeadString('@file zzz');
        assert.strictEqual(p1.textOffset(), 0);
    });
    //@+node:felix.20230530211011.17: *5* TestNodes.test_section_node
    test('test_section_node', () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        p1.setHeadString('@file zzz');
        const body = `   ${g.angleBrackets(' section ')}
        `;
        p1.setBodyString(body);
        const p2 = p1.insertAsLastChild();
        const head = g.angleBrackets(' section ');
        p2.setHeadString(head);
        assert.strictEqual(p1.textOffset(), 0);
        assert.strictEqual(p2.textOffset(), 3);
        // Section nodes can appear in with @others nodes,
        // so they don't get special treatment.
    });
    //@+node:felix.20230530211011.18: *4* TestNodes: Generators
    //@+node:felix.20230530211011.19: *5* TestNodes.test_all_generators_return_unique_positions
    test('test_all_generators_return_unique_positions', () => {
        const c = self.c;
        const p = self.c.p;
        const root = p.next();
        const table: [string, (copy?: boolean) => Generator<Position>][] = [
            ['all_positions', c.all_positions.bind(c)],
            ['all_unique_positions', c.all_unique_positions.bind(c)],
            ['children', root.children.bind(root)],
            ['self_and_siblings', root.self_and_siblings.bind(root)],
            ['self_and_parents', root.firstChild().self_and_parents.bind(root)],
            ['self_and_subtree', root.self_and_subtree.bind(root)],
            ['following_siblings', root.following_siblings.bind(root)],
            ['parents', root.firstChild().firstChild().parents.bind(root)],
            ['unique_subtree', root.unique_subtree.bind(root)],
        ];
        table.forEach((element) => {
            let kind: string;
            let generator: (copy?: boolean) => Generator<Position>;
            [kind, generator] = element;
            const aList: Position[] = [];

            for (let p of generator()) {
                let inList: boolean = false;

                aList.forEach((p_p) => {
                    if (p === p_p || p.__eq__(p_p)) {
                        inList = true;
                    }
                });
                assert.strictEqual(false, inList, `${kind} ${p.gnx} ${p.h}`);
                aList.push(p);
            }
        });
    });
    //@+node:felix.20230530211011.20: *5* TestNodes.test_all_nodes_coverage
    test('test_all_nodes_coverage', () => {
        // @test c iters: <coverage tests>
        const c = self.c;
        const v1: VNode[] = [...c.all_positions()].map((p) => p.v);
        const v2: VNode[] = [...c.all_nodes()];
        v2.forEach((v) => {
            assert.ok(v1.includes(v));
        });
        v1.forEach((v) => {
            assert.ok(v2.includes(v));
        });
    });
    //@+node:felix.20230530211011.21: *5* TestNodes.test_check_all_gnx_s_exist_and_are_unique
    test('test_check_all_gnx_s_exist_and_are_unique', () => {
        const c = self.c;
        const d: { [key: string]: VNode[] } = {}; // Keys are gnx's, values are lists of vnodes with that gnx.
        for (let p of c.all_positions()) {
            const gnx = p.v.fileIndex;
            assert.ok(gnx);
            const aSet: VNode[] = d[gnx] || [];
            if (!aSet.includes(p.v)) {
                aSet.push(p.v);
            }
            d[gnx] = aSet;
        }
        for (let gnx of Object.keys(d).sort()) {
            const aList = d[gnx]; // No need to sort this list for this test
            assert.ok(aList.length === 1);
        }
    });
    //@+node:felix.20230530211011.22: *5* TestNodes.test_consistency_between_parents_iter_and_v_parents
    test('test_consistency_between_parents_iter_and_v_parents', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const parents1 = p.v.parents;
            const parents2 = p.v.directParents();
            assert.strictEqual(parents1.length, parents2.length, p.h);
            for (let parent of parents1) {
                assert.ok(parents2.includes(parent));
            }
            for (let parent of parents2) {
                assert.ok(parents1.includes(parent));
            }
        }
    });
    //@+node:felix.20230530211011.23: *5* TestNodes.test_consistency_of_back_next_links
    test('test_consistency_of_back_next_links', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const back = p.back();
            const next = p.next();
            if (back && back.__bool__()) {
                assert.ok(back.getNext().__eq__(p));
            }
            if (next && next.__bool__()) {
                assert.ok(next.getBack().__eq__(p));
            }
        }
    });
    //@+node:felix.20230530211011.24: *5* TestNodes.test_consistency_of_c_all_positions__and_p_ThreadNext_
    test('test_consistency_of_c_all_positions__and_p_ThreadNext_', () => {
        const c = self.c;
        const p2 = c.rootPosition()!;
        for (let p of c.all_positions()) {
            assert.ok(p.__eq__(p2));
            p2.moveToThreadNext();
        }
        assert.ok(!p2 || !p2.__bool__());
    });
    //@+node:felix.20230530211011.25: *5* TestNodes.test_consistency_of_firstChild__children_iter_
    test('test_consistency_of_firstChild__children_iter_', () => {
        const c = self.c;
        let p2!: Position;
        for (let p of c.all_positions()) {
            p2 = p.firstChild();
            for (let p3 of p.children_iter()) {
                assert.ok(p3.__eq__(p2));
                p2.moveToNext();
            }
        }

        assert.ok(!p2 || !p2.__bool__());
    });
    //@+node:felix.20230530211011.26: *5* TestNodes.test_consistency_of_level
    test('test_consistency_of_level', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            if (p.hasParent()) {
                assert.strictEqual(p.parent().level(), p.level() - 1);
            }
            if (p.hasChildren()) {
                assert.strictEqual(p.firstChild().level(), p.level() + 1);
            }
            if (p.hasNext()) {
                assert.strictEqual(p.next().level(), p.level());
            }
            if (p.hasBack()) {
                assert.strictEqual(p.back().level(), p.level());
            }
        }
    });
    //@+node:felix.20230530211011.27: *5* TestNodes.test_consistency_of_parent__parents_iter_
    test('test_consistency_of_parent__parents_iter_', () => {
        const c = self.c;
        let p2!: Position;
        for (let p of c.all_positions()) {
            p2 = p.parent();
            for (let p3 of p.parents_iter()) {
                assert.ok(p3.__eq__(p2));
                p2.moveToParent();
            }
            assert.ok(!p2 || !p2.__bool__());
        }
    });
    //@+node:felix.20230530211011.28: *5* TestNodes.test_consistency_of_parent_child_links
    test('test_consistency_of_parent_child_links', () => {
        // Test consistency of p.parent, p.next, p.back and p.firstChild.
        const c = self.c;
        for (let p of c.all_positions()) {
            if (p.hasParent()) {
                const n = p.childIndex();
                assert.ok(p.__eq__(p.parent().moveToNthChild(n)));
            }
            for (let child of p.children_iter()) {
                assert.ok(p.__eq__(child.parent()));
            }
            if (p.hasNext()) {
                assert.ok(p.next().parent().__eq__(p.parent()));
            }
            if (p.hasBack()) {
                assert.ok(p.back().parent().__eq__(p.parent()));
            }
        }
    });
    //@+node:felix.20230530211011.29: *5* TestNodes.test_consistency_of_threadBack_Next_links
    test('test_consistency_of_threadBack_Next_links', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const threadBack = p.threadBack();
            const threadNext = p.threadNext();
            if (threadBack.__bool__()) {
                assert.ok(p.__eq__(threadBack.getThreadNext()));
            }
            if (threadNext.__bool__()) {
                assert.ok(p.__eq__(threadNext.getThreadBack()));
            }
        }
    });
    //@+node:felix.20230530211011.30: *5* TestNodes.test_p_following_siblings
    test('test_p_following_siblings', () => {
        const p = self.c.rootPosition()!;
        while (p && p.__bool__()) {
            for (const sib of p.following_siblings()) {

                // ! TEST IF valueOf OVERRIDE IS USED INSTEAD !

                assert.ok(p !== sib);
                assert.ok(p < sib);
            }
            p.moveToThreadNext();
        }
    });
    //@+node:felix.20230530211011.31: *5* TestNodes.test_p_nearest
    test('test_p_nearest', () => {
        const c = self.c;

        const p_true = (p: Position): boolean => {
            return true;
        };

        const p_false = (p: Position): boolean => {
            return false;
        };

        // Create top-level @file node..
        const root1 = c.rootPosition()!.insertAfter();
        root1.h = '@file root1.py';
        // Create a third-level @file node, *not* a child of the top-level node.
        const child = root1.next().insertAsLastChild();
        child.h = 'target child';
        const root2 = child.insertAsLastChild();
        root2.h = '@file root2.py';
        for (let pred of [p_true, p_false, undefined]) {
            for (let p of c.all_positions()) {
                for (let root of p.nearest_roots(undefined, pred)) {
                    // pass
                }
                for (let root of p.nearest_unique_roots(undefined, pred)) {
                    // pass
                }
            }
        }

    });
    //@+node:felix.20230530211011.32: *5* TestNodes.test_p_nodes
    test('test_p_nodes', () => {
        const c = self.c;
        for (const p of c.p.nodes()) {
            // pass
        }
    });
    //@+node:felix.20230530211011.33: *5* TestNodes.test_p_unique_nodes
    test('test_p_unique_nodes', () => {
        assert.strictEqual([...self.root_p.unique_nodes()].length, 5);
    });
    //@+node:felix.20230530211011.34: *5* TestNodes.test_p_unique_subtree
    test('test_p_unique_subtree', () => {
        const p = self.c.rootPosition()!;
        while (p && p.__bool__()) {
            for (const descendant of p.unique_subtree()) {

                // ! TEST IF valueOf OVERRIDE IS USED INSTEAD !

                assert.ok(p <= descendant);
            }
            p.moveToThreadNext();
        }
    });
    //@+node:felix.20230530211011.35: *4* TestNodes: Outline operations
    //@+node:felix.20230530211011.36: *5* TestNodes.test_clone_and_move_the_clone_to_the_root
    test('test_clone_and_move_the_clone_to_the_root', () => {
        const c = self.c;
        const p = self.c.p;
        const child = p.insertAsNthChild(0);
        c.setHeadString(child, 'child'); // Force the headline to update.
        assert.ok(child);
        c.selectPosition(child);
        const clone = c.clone()!;
        assert.ok(clone.__eq__(c.p));
        assert.strictEqual(clone.h, 'child');
        assert.ok(child.isCloned(), 'fail 1');
        assert.ok(clone.isCloned(), 'fail 2');
        assert.ok(child.isCloned(), 'fail 3');
        assert.ok(clone.isCloned(), 'fail 4');
        c.undoer.undo();
        assert.ok(!child.isCloned(), 'fail 1-a');
        c.undoer.redo();
        assert.ok(child.isCloned(), 'fail 1-b');
        c.undoer.undo();
        assert.ok(!child.isCloned(), 'fail 1-c');
        c.undoer.redo();
        assert.ok(child.isCloned(), 'fail 1-d');
        clone.moveToRoot(); // Does not change child position.
        assert.ok(child.isCloned(), 'fail 3-2');
        assert.ok(clone.isCloned(), 'fail 4-2');
        assert.ok(!clone.parent().__bool__(), 'fail 5');
        assert.ok(!clone.back().__bool__(), 'fail 6');
        clone.doDelete();
        assert.ok(!child.isCloned(), 'fail 7');
    });
    //@+node:felix.20230530211011.37: *5* TestNodes.test_delete_node
    test('test_delete_node', () => {
        const c = self.c;
        let p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        const p4 = p.insertAsNthChild(2);
        p4.setHeadString('C');
        p.expand();
        c.selectPosition(p3);
        c.deleteOutline();
        c.redraw_now();
        p = c.p;
        assert.strictEqual(p.h, 'A');
        assert.strictEqual(p.next().h, 'C');
        c.undoer.undo();
        c.outerUpdate();
        p = c.p;
        assert.ok(p.back().__eq__(p2));
        assert.ok(p.next().__eq__(p4));
        c.undoer.redo();
        c.outerUpdate();
        p = c.p;
        assert.strictEqual(p.h, 'A');
        assert.strictEqual(p.next().h, 'C');
        c.undoer.undo();
        c.outerUpdate();
        p = c.p;
        assert.ok(p.back().__eq__(p2));
        assert.ok(p.next().__eq__(p4));
        c.undoer.redo();
        c.outerUpdate();
        p = c.p;
        assert.strictEqual(p.h, 'A');
        assert.strictEqual(p.next().h, 'C');
    });
    //@+node:felix.20230530211011.38: *5* TestNodes.test_deleting_the_root_should_select_another_node
    test('test_deleting_the_root_should_select_another_node', () => {
        const c = self.c;
        const p = self.c.p;
        const root_h = p.h;
        const child = p.next();
        child.moveToRoot(); // Does not change child position.
        // * c.setRootPosition(child); // Do nothing
        assert.ok(c.positionExists(child));
        assert.strictEqual(c.rootPosition()!.h, child.h);
        const next = c.rootPosition()!.next();
        assert.strictEqual(next.h, root_h);
        c.rootPosition()!.doDelete(next);
        // * c.setRootPosition(next);  // Do nothing
    });
    //@+node:felix.20230530211011.39: *5* TestNodes.test_demote
    test('test_demote', () => {
        const c = self.c;
        let p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        const p4 = p.insertAsNthChild(2);
        p4.setHeadString('C');
        const p5 = p.insertAsNthChild(3);
        p5.setHeadString('D');
        p.expand();
        c.setCurrentPosition(p3);
        c.demote();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.strictEqual(p.h, 'B');
        assert.ok(!p.next().__bool__());
        assert.strictEqual(p.firstChild().h, 'C');
        assert.strictEqual(p.firstChild().next().h, 'D');
        c.undoer.undo();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.ok(p.back().__eq__(p2));
        assert.ok(p.next().__eq__(p4));
        c.undoer.redo();
        assert.ok(p.__eq__(p3));
        assert.strictEqual(p.h, 'B');
        assert.ok(!p.next().__bool__());
        assert.strictEqual(p.firstChild().h, 'C');
        assert.strictEqual(p.firstChild().next().h, 'D');
        c.undoer.undo();
        p = c.p;
        assert.ok(p.back().__eq__(p2));
        assert.ok(p.next().__eq__(p4));
        c.undoer.redo();
        assert.ok(p.__eq__(p3));
        assert.strictEqual(p.h, 'B');
        assert.ok(!p.next().__bool__());
        assert.strictEqual(p.firstChild().h, 'C');
        assert.strictEqual(p.firstChild().next().h, 'D');
    });
    //@+node:felix.20230530211011.40: *5* TestNodes.test_insert_node
    test('test_insert_node', () => {
        const c = self.c;
        let p = self.c.p;
        assert.strictEqual(p.h, 'root');
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        p.expand();
        c.setCurrentPosition(p2);
        const p4 = c.insertHeadline();
        assert.ok(p4?.__eq__(c.p));
        p = c.p;
        assert.ok(p.__bool__());
        p.setHeadString('inserted');
        assert.ok(p.back().__bool__());
        assert.strictEqual(p.back().h, 'A');
        assert.strictEqual(p.next().h, 'B');
        // With the new undo logic, it takes 2 undoes.
        // The first undo undoes the headline changes,
        // the second undo undoes the insert node.
        c.undoer.undo();
        c.undoer.undo();
        p = c.p;
        assert.ok(p.__eq__(p2));
        assert.ok(p.next().__eq__(p3));
        c.undoer.redo();
        p = c.p;
        assert.ok(p.back());
        assert.strictEqual(p.back().h, 'A');
        assert.strictEqual(p.next().h, 'B');
        c.undoer.undo();
        p = c.p;
        assert.ok(p.__eq__(p2));
        assert.ok(p.next().__eq__(p3));
        c.undoer.redo();
        p = c.p;
        assert.strictEqual(p.back().h, 'A');
        assert.strictEqual(p.next().h, 'B');
    });
    //@+node:felix.20230530211011.41: *5* TestNodes.test_move_outline_down__undo_redo
    test('test_move_outline_down__undo_redo', () => {
        const c = self.c;
        const p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        const p4 = p.insertAsNthChild(2);
        p4.setHeadString('C');
        const p5 = p.insertAsNthChild(3);
        p5.setHeadString('D');
        p.expand();
        c.setCurrentPosition(p3);
        c.moveOutlineDown();
        let moved = c.p;
        assert.strictEqual(moved.h, 'B');
        assert.strictEqual(moved.back().h, 'C');
        assert.strictEqual(moved.next().h, 'D');
        assert.ok(moved.next().__eq__(p5));
        c.undoer.undo();
        moved = c.p;
        assert.ok(moved.back().__eq__(p2));
        assert.ok(moved.next().__eq__(p4));
        c.undoer.redo();
        moved = c.p;
        assert.strictEqual(moved.h, 'B');
        assert.strictEqual(moved.back().h, 'C');
        assert.strictEqual(moved.next().h, 'D');
        c.undoer.undo();
        moved = c.p;
        assert.ok(moved.back().__eq__(p2));
        assert.ok(moved.next().__eq__(p4));
        c.undoer.redo();
        moved = c.p;
        assert.strictEqual(moved.h, 'B');
        assert.strictEqual(moved.back().h, 'C');
        assert.strictEqual(moved.next().h, 'D');
    });
    //@+node:felix.20230530211011.42: *5* TestNodes.test_move_outline_left
    test('test_move_outline_left', () => {
        const c = self.c;
        const p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        p.expand();
        c.setCurrentPosition(p2);
        c.moveOutlineLeft();
        const moved = c.p;
        assert.strictEqual(moved.h, 'A');
        assert.ok(moved.back().__eq__(p));
        c.undoer.undo();
        c.undoer.redo();
        c.undoer.undo();
        c.undoer.redo();
        moved.doDelete(p);
    });
    //@+node:felix.20230530211011.43: *5* TestNodes.test_move_outline_right
    test('test_move_outline_right', () => {
        const c = self.c;
        const p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        const p4 = p.insertAsNthChild(2);
        p4.setHeadString('C');
        p.expand();
        c.setCurrentPosition(p3);
        c.moveOutlineRight();
        const moved = c.p;
        assert.strictEqual(moved.h, 'B');
        assert.ok(moved.parent().__eq__(p2));
        c.undoer.undo();
        c.undoer.redo();
        c.undoer.undo();
        c.undoer.redo();
    });
    //@+node:felix.20230530211011.44: *5* TestNodes.test_move_outline_up
    test('test_move_outline_up', () => {
        const c = self.c;
        const p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        const p4 = p.insertAsNthChild(2);
        p4.setHeadString('C');
        const p5 = p.insertAsNthChild(3);
        p5.setHeadString('D');
        p.expand();
        c.setCurrentPosition(p4);
        c.moveOutlineUp();
        const moved = c.p;
        assert.strictEqual(moved.h, 'C');
        assert.strictEqual(moved.back().h, 'A');
        assert.strictEqual(moved.next().h, 'B');
        assert.ok(moved.back().__eq__(p2));
        c.undoer.undo();
        c.undoer.redo();
        c.undoer.undo();
        c.undoer.redo();
    });
    //@+node:felix.20230530211011.45: *5* TestNodes.test_paste_node
    test('test_paste_node', () => {
        const c = self.c;
        let p = self.c.p;
        const child = p.insertAsNthChild(0);
        child.setHeadString('child');
        const child2 = p.insertAsNthChild(1);
        child2.setHeadString('child2');
        const grandChild = child.insertAsNthChild(0);
        grandChild.setHeadString('grand child');
        c.selectPosition(grandChild);
        c.clone();
        c.selectPosition(child);
        p.expand();
        c.selectPosition(child);
        assert.strictEqual(c.p.h, 'child');
        c.copyOutline();
        const oldVnodes: VNode[] = [...child.self_and_subtree()].map(
            (p2) => p2.v
        );
        c.selectPosition(child);
        c.p.contract(); // Essential
        c.pasteOutline();
        assert.ok(c.p.__ne__(child));
        assert.strictEqual(c.p.h, 'child');
        const newVnodes: VNode[] = [...c.p.self_and_subtree()].map(
            (p2) => p2.v
        );
        for (let v of newVnodes) {
            assert.ok(!oldVnodes.includes(v));
        }
        c.undoer.undo();
        c.undoer.redo();
        c.undoer.undo();
        c.undoer.redo();
    });
    //@+node:felix.20230530211011.46: *5* TestNodes.test_paste_retaining_clones
    test('test_paste_retaining_clones', () => {
        const c = self.c;
        let p = self.c.p;
        const child = p.insertAsNthChild(0);
        child.setHeadString('child');
        assert.ok(child.__bool__());
        const grandChild = child.insertAsNthChild(0);
        grandChild.setHeadString('grand child');
        c.selectPosition(child);
        c.copyOutline();
        const oldVnodes: VNode[] = [...child.self_and_subtree()].map(
            (p2) => p2.v
        );
        c.p.contract(); // Essential
        c.pasteOutlineRetainingClones();
        assert.ok(c.p.__ne__(child));
        const newVnodes: VNode[] = [...c.p.self_and_subtree()].map(
            (p2) => p2.v
        );
        for (let v of newVnodes) {
            assert.ok(oldVnodes.includes(v));
        }
    });
    //@+node:felix.20230530211011.47: *5* TestNodes.test_promote
    test('test_promote', () => {
        const c = self.c;
        let p = self.c.p;
        const p2 = p.insertAsNthChild(0);
        p2.setHeadString('A');
        const p3 = p.insertAsNthChild(1);
        p3.setHeadString('B');
        const p4 = p3.insertAsNthChild(0);
        p4.setHeadString('child 1');
        const p5 = p3.insertAsNthChild(1);
        p5.setHeadString('child 2');
        p.expand();
        const p6 = p.insertAsNthChild(2);
        p6.setHeadString('C');
        c.setCurrentPosition(p3);
        c.promote();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.strictEqual(p.h, 'B');
        assert.strictEqual(p.next().h, 'child 1');
        assert.strictEqual(p.next().next().h, 'child 2');
        assert.strictEqual(p.next().next().next().h, 'C');
        c.undoer.undo();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.ok(p.back().__eq__(p2));
        assert.ok(p.next().__eq__(p6));
        assert.strictEqual(p.firstChild().h, 'child 1');
        assert.strictEqual(p.firstChild().next().h, 'child 2');
        c.undoer.redo();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.strictEqual(p.h, 'B');
        assert.strictEqual(p.next().h, 'child 1');
        assert.strictEqual(p.next().next().h, 'child 2');
        assert.strictEqual(p.next().next().next().h, 'C');
        c.undoer.undo();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.ok(p.back().__eq__(p2));
        assert.ok(p.next().__eq__(p6));
        assert.strictEqual(p.firstChild().h, 'child 1');
        assert.strictEqual(p.firstChild().next().h, 'child 2');
        c.undoer.redo();
        p = c.p;
        assert.ok(p.__eq__(p3));
        assert.strictEqual(p.h, 'B');
        assert.strictEqual(p.next().h, 'child 1');
        assert.strictEqual(p.next().next().h, 'child 2');
        assert.strictEqual(p.next().next().next().h, 'C');
    });
    //@+node:felix.20230530211011.48: *4* TestNodes: Getters
    //@+node:felix.20230530211011.49: *5* TestNodes.test_p_getters
    test('test_p_getters', () => {
        const c = self.c;
        const p = self.c.p;
        const table1 = [
            p.anyAtFileNodeName,
            p.atAutoNodeName,
            p.atCleanNodeName,
            p.atEditNodeName,
            p.atFileNodeName,
            p.atNoSentinelsFileNodeName,
            p.atShadowFileNodeName,
            p.atSilentFileNodeName,
            p.atThinFileNodeName,
            p.isAnyAtFileNode,
            p.isAtAllNode,
            p.isAtAutoNode,
            p.isAtAutoRstNode,
            p.isAtCleanNode,
            p.isAtEditNode,
            p.isAtFileNode,
            p.isAtIgnoreNode,
            p.isAtNoSentinelsFileNode,
            p.isAtOthersNode,
            p.isAtRstFileNode,
            p.isAtShadowFileNode,
            p.isAtSilentFileNode,
            p.isAtThinFileNode,
            p.isMarked,
            p.isOrphan,
            p.isVisited,
        ];
        for (const func of table1) {
            assert.ok(!func.bind(p)(), func.name);
        }
        const table2 = [  // Proxies for vnode methods: don't care about result.
            p.bodyString,
            p.directParents,
            p.findRootPosition,
            p.getLastChild,
            p.getLastNode,
            p.headString,
            p.isDirty,
            p.isSelected,
            p.status,
        ];

        for (const func of table2) {
            func.bind(p)();
        }
        // More proxies, with various arguments.
        p.getNthChild(0);
        p.matchHeadline('xyzz');
        assert.ok(c.p.isRoot());
    });
    //@+node:felix.20230530211011.50: *5* TestNodes.test_p_hasNextBack
    test('test_p_hasNextBack', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const back = p.back();
            const next = p.next();
            assert.ok(
                (back.__bool__() && p.hasBack()) ||
                (!back.__bool__() && !p.hasBack())
            );
            assert.ok(
                (next.__bool__() && p.hasNext()) ||
                (!next.__bool__() && !p.hasNext())
            );
        }
    });
    //@+node:felix.20230530211011.51: *5* TestNodes.test_p_hasParentChild
    test('test_p_hasParentChild', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const child = p.firstChild();
            const parent = p.parent();
            assert.ok(
                (child.__bool__() && p.hasFirstChild()) ||
                (!child.__bool__() && !p.hasFirstChild())
            );
            assert.ok(
                (parent.__bool__() && p.hasParent()) ||
                (!parent.__bool__() && !p.hasParent())
            );
        }
    });
    //@+node:felix.20230530211011.52: *5* TestNodes.test_p_hasThreadNextBack
    test('test_p_hasThreadNextBack', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const threadBack = p.getThreadBack();
            const threadNext = p.getThreadNext();

            assert.ok(
                (threadBack.__bool__() && p.hasThreadBack()) ||
                (!threadBack.__bool__() && !p.hasThreadBack())
            );
            assert.ok(
                (threadNext.__bool__() && p.hasThreadNext()) ||
                (!threadNext.__bool__() && !p.hasThreadNext())
            );
        }
    });
    //@+node:felix.20230530211011.53: *5* TestNodes.test_p_isAncestorOf
    test('test_p_isAncestorOf', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            const child = p.firstChild();
            while (child && child.__bool__()) {
                for (let parent of p.self_and_parents_iter()) {
                    assert.ok(parent.isAncestorOf(child));
                }
                child.moveToNext();
            }
            const next = p.next();
            assert.ok(!p.isAncestorOf(next));
        }
    });
    //@+node:felix.20230530211011.54: *5* TestNodes.test_p_isCurrentPosition
    test('test_p_isCurrentPosition', () => {
        const c = self.c;
        let p = self.c.p;
        assert.ok(!c.isCurrentPosition(undefined));
        assert.ok(c.isCurrentPosition(p));
    });
    //@+node:felix.20230530211011.55: *5* TestNodes.test_p_isVisible
    test('test_p_isVisible', () => {
        const c = self.c;
        for (const p of c.all_positions()) {
            p.expand();
        }
        for (const p of c.all_positions()) {
            assert.ok(p.isVisible(c), p.h);
        }
        for (const p of c.all_positions()) {
            p.contract();
            p.v.expandedPositions = [];
        }
        for (const p of c.all_positions()) {
            if (p.level() === 0) {
                assert.ok(p.isVisible(c), p.h);
            } else {
                assert.ok(!p.isVisible(c), p.h);
            }
        }
    });
    //@+node:felix.20230530211011.56: *4* TestNodes: Positions methods
    //@+node:felix.20230530211011.57: *5* TestNodes.test_p_convertTreeToString_and_allies
    test('test_convertTreeToString_and_allies', () => {
        const p = self.c.p;
        const sib = p.next();
        assert.ok(sib && sib.__bool__());
        const s = sib.convertTreeToString();
        for (let p2 of sib.self_and_subtree()) {
            assert.ok(s.includes(p2.h));
        }
    });
    //@+node:felix.20230530211011.58: *5* TestNodes.test_p_deletePositionsInList
    test('test_p_deletePositionsInList', () => {
        const c = self.c;
        let p = self.c.p;
        const root = p.insertAsLastChild();
        root.h = 'root';
        // Top level;
        const a1 = root.insertAsLastChild();
        a1.h = 'a';
        a1.clone();
        const d1 = a1.insertAfter();
        d1.h = 'd';
        const b1 = root.insertAsLastChild();
        b1.h = 'b';
        // Children of a.
        let b11 = b1.clone();
        b11.moveToLastChildOf(a1);
        b11.clone();
        const c2 = b11.insertAfter();
        c2.h = 'c';
        // Children of d
        b11 = b1.clone();
        b11.moveToLastChildOf(d1);
        // Count number of 'b' nodes.
        const aList: Position[] = [];
        let nodes = 0;
        for (let p of root.subtree()) {
            nodes += 1;
            if (p.h === 'b') {
                aList.push(p.copy());
            }
        }
        assert.strictEqual(aList.length, 6);
        c.deletePositionsInList(aList);
        c.redraw();
    });
    //@+node:felix.20230530211011.59: *5* TestNodes.test_p_isRootPosition
    test('test_p_isRootPosition', () => {
        const c = self.c;
        let p = self.c.p;
        assert.ok(!c.isRootPosition(undefined));
        assert.ok(c.isRootPosition(p));
    });
    //@+node:felix.20230530211011.60: *5* TestNodes.test_p_moveToFirst_LastChild
    test('test_p_moveToFirst_LastChild', () => {
        const c = self.c;
        let p = self.c.p;
        const root2 = p.next();
        assert.ok(root2 && root2.__bool__());
        const p2 = root2.insertAfter();
        p2.h = 'test';
        assert.ok(c.positionExists(p2));
        p2.moveToFirstChildOf(root2);
        assert.ok(c.positionExists(p2));
        p2.moveToLastChildOf(root2);
        assert.ok(c.positionExists(p2));
    });
    //@+node:felix.20230530211011.61: *5* TestNodes.test_p_moveToVisBack_in_a_chapter
    test('test_p_moveToVisBack_in_a_chapter', () => {
        const c = self.c;
        let p = self.c.p;

        // Verify a fix for bug https://bugs.launchpad.net/leo-editor/+bug/1264350
        const cc = c.chapterController;
        const settings_p = p.insertAsNthChild(0);
        settings_p.h = '@settings';
        const chapter_p = settings_p.insertAsLastChild();
        chapter_p.h = '@chapter aaa';
        const node_p = chapter_p.insertAsNthChild(0);
        node_p.h = 'aaa node 1';
        // Hack the chaptersDict.
        cc.chaptersDict['aaa'] = new Chapter(c, cc, 'aaa');
        // Select the chapter.
        cc.selectChapterByName('aaa');
        assert.strictEqual(c.p.h, 'aaa node 1');
        const p2 = c.p.moveToVisBack(c);
        assert.strictEqual(p2, undefined);
    });
    //@+node:felix.20230530211011.62: *5* TestNodes.test_p_nosentinels
    test('test_p_nosentinels', () => {
        let p = self.c.p;
        // TODO
        const s1 = g.splitLines(p.b.substring(2)).join(''); //  ''.join(g.splitLines(p.b)[2:]);
        const s2 = p.nosentinels;
        assert.strictEqual(s1, s2);
    });
    //@+node:felix.20230530211011.63: *5* TestNodes.test_p_relinkAsCloneOf
    test('test_p_relinkAsCloneOf', () => {
        const c = self.c;
        const u = self.c.undoer;
        let p = self.c.p.next();

        // test-outline: root
        //   child clone a
        //     node clone 1
        //   child b
        //     child clone a
        //       node clone 1
        //   child c
        //     node clone 1
        //   child clone a
        //     node clone 1
        //   child b
        //     child clone a
        //       node clone 1

        const child_b = g.findNodeAnywhere(c, 'child b');
        assert.ok(child_b && child_b.__bool__());
        assert.ok(child_b.isCloned());
        //
        // child_c must *not* be a clone at first.
        const child_c = g.findNodeAnywhere(c, 'child c');
        assert.ok(child_c && child_c.__bool__());
        assert.ok(!child_c.isCloned());
        //
        // Change the tree.
        const bunch = u.beforeChangeTree(p);
        child_c._relinkAsCloneOf(child_b);
        u.afterChangeTree(p, 'relink-clone', bunch);
        // self.dump_tree('Before...')
        u.undo();
        // self.dump_tree('After...')
        assert.ok(child_b.isCloned());
        assert.ok(!child_c.isCloned());
    });
    //@+node:felix.20230530211011.64: *5* TestNodes.test_p_setBodyString
    test('test_p_setBodyString', () => {
        // Test that c.setBodyString works immediately.
        const c = self.c;
        // w = self.c.frame.body.wrapper;

        const next = self.root_p.next();
        c.setBodyString(next, 'after');
        c.selectPosition(next);
        const s = next.b; // w.get("1.0", "end");
        assert.strictEqual(s.trimEnd(), 'after');
    });
    //@+node:felix.20230530211011.65: *5* TestNodes.test_position_not_hashable
    test('test_position_not_hashable', () => {
        let p = self.c.p;

        try {
            const a = JSON.stringify(p);
            // a = set()
            //  a.add(p)
            assert.ok(false, 'Adding position to set should throw exception');
        } catch (typeError) {
            // pass
        }
    });
    //@+node:felix.20230530211011.66: *5* TestNodes.test_validateOutlineWithParent
    test('test_validateOutlineWithParent', () => {
        const c = self.c;
        for (const p of c.all_positions()) {
            assert.ok(p.validateOutlineWithParent(p.parent()), p.h);
        }
    });
    //@+node:felix.20230530211011.67: *4* TestNodes: Position properties
    //@+node:felix.20230530211011.68: *5* TestNodes.test_p_h_with_newlines
    test('test_p_h_with_newlines', () => {
        // Bug https://bugs.launchpad.net/leo-editor/+bug/1245535
        const p = self.c.p;
        p.h = '\nab\nxy\n';
        assert.strictEqual(p.h, 'abxy');

    });
    //@+node:felix.20230530211011.69: *5* TestNodes.test_p_properties
    test('test_leoNodes_properties', () => {
        const c = self.c;
        let p = self.c.p;
        const v = p.v;
        const b = p.b;
        p.b = b;
        assert.strictEqual(p.b, b);
        v.b = b;
        assert.strictEqual(v.b, b);
        const h = p.h;
        p.h = h;
        assert.strictEqual(p.h, h);
        v.h = h;
        assert.strictEqual(v.h, h);
        for (let p of c.all_positions()) {
            assert.strictEqual(p.b, p.bodyString());
            assert.strictEqual(p.v.b, p.v.bodyString());
            assert.strictEqual(p.h, p.headString());
            assert.strictEqual(p.v.h, p.v.headString());
        }
    });
    //@+node:felix.20230530211011.70: *5* TestNodes.test_p_u
    test('test_p_u', () => {
        const p = self.c.p;
        assert.deepStrictEqual(p.u, p.v.u);
        p.v.u = {};
        assert.deepStrictEqual(p.u, {});
        assert.deepStrictEqual(p.v.u, {});
        const d = { my_plugin: 'val' };
        p.u = d;
        assert.deepStrictEqual(p.u, d);
        assert.deepStrictEqual(p.v.u, d);
    });
    //@+node:felix.20230530211011.71: *4* TestNodes: VNode methods
    //@+node:felix.20230530211011.72: *5* TestNodes.test_v_atAutoNodeName_and_v_atAutoRstNodeName
    test('test_v_atAutoNodeName_and_v_atAutoRstNodeName', () => {
        const p = self.c.p;

        const table: [string, string, string][] = [
            ['@auto-rst rst-file', 'rst-file', 'rst-file'],
            ['@auto x', 'x', ''],
            ['xyz', '', ''],
        ];

        table.forEach((element) => {
            let s;
            let expected1;
            let expected2;
            [s, expected1, expected2] = element;
            const result1 = p.v.atAutoNodeName(s);
            const result2 = p.v.atAutoRstNodeName(s);
            assert.strictEqual(result1, expected1, s);
            assert.strictEqual(result2, expected2, s);
        });
    });
    //@+node:felix.20230530211011.73: *5* TestNodes.test_new_vnodes_methods
    test('test_new_vnodes_methods', () => {
        const c = self.c;
        const p = self.c.p;

        const parent_v = p.parent().v || c.hiddenRootNode;
        p.v.cloneAsNthChild(parent_v, p.childIndex());
        let v2 = p.v.insertAsFirstChild();
        v2.h = 'insertAsFirstChild';
        v2 = p.v.insertAsLastChild();
        v2.h = 'insertAsLastChild';
        v2 = p.v.insertAsNthChild(1);
        v2.h = 'insertAsNthChild(1)';
    });
    //@+node:felix.20230530211011.74: *5* TestNodes.test_v_getters
    test('test_v_getters', () => {
        const v = self.c.p.v;
        const table1 = [
            v.anyAtFileNodeName,
            v.atAutoNodeName,
            v.atCleanNodeName,
            v.atEditNodeName,
            v.atFileNodeName,
            v.atNoSentinelsFileNodeName,
            v.atShadowFileNodeName,
            v.atSilentFileNodeName,
            v.atThinFileNodeName,
            v.isAnyAtFileNode,
            v.isAtAllNode,
            v.isAtAutoNode,
            v.isAtAutoRstNode,
            v.isAtCleanNode,
            v.isAtEditNode,
            v.isAtFileNode,
            v.isAtIgnoreNode,
            v.isAtNoSentinelsFileNode,
            v.isAtOthersNode,
            v.isAtRstFileNode,
            v.isAtShadowFileNode,
            v.isAtSilentFileNode,
            v.isAtThinFileNode,
            v.isMarked,
            v.isOrphan,
            v.isVisited,
        ];

        for (const func of table1) {
            assert.ok(!func.bind(v)(), func.name);
        }
        const table2 = [
            v.bodyString,
            v.headString,
            v.isDirty,
            v.isSelected,
            v.status,
        ];

        for (const func of table2) {
            func.bind(v)();  // Don't care about result.
        }
    });
    //@+node:felix.20220129225027.6: *3* TestNodes.test_at_most_one_VNode_has_str_leo_pos_attribute
    test('test_at_most_one_VNode_has_str_leo_pos_attribute', () => {
        const c = self.c;
        let n = 0;
        for (let v of c.all_unique_vnodes_iter()) {
            if (v['unknownAttributes']) {
                const d = v.unknownAttributes;
                if (d['str_leo_pos']) {
                    n += 1;
                }
            }
        }
        assert.ok(n === 0);
    });

    //@+node:felix.20220129225027.17: *3* TestNodes.test_consistency_of_level
    test('test_consistency_of_level', () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            if (p.hasParent()) {
                assert.strictEqual(p.parent().level(), p.level() - 1);
            }
            if (p.hasChildren()) {
                assert.strictEqual(p.firstChild().level(), p.level() + 1);
            }
            if (p.hasNext()) {
                assert.strictEqual(p.next().level(), p.level());
            }
            if (p.hasBack()) {
                assert.strictEqual(p.back().level(), p.level());
            }
        }
    });

    //@+node:felix.20220129225027.33: *3* TestNodes.test_node_that_does_not_belong_to_a_derived_file
    test('test_node_that_does_not_belong_to_a_derived_file', () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        assert.ok(!p1.textOffset());
    });

    //@-others
});
//@+node:felix.20230530210928.1: ** suite TestNodeIndices
suite('Unit tests for NodeIndices class in leo/core/leoNodes.ts.', () => {
    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        // Create the nodes in the commander.
        const c = self.c;
        self.create_test_outline();
        // Make sure all indices in the test outline have the proper id, set in create_app.
        for (const v of c.all_nodes()) {
            assert.ok(v.fileIndex.startsWith(g.app.leoID), v.fileIndex.toString());
        }
        c.selectPosition(c.rootPosition()!);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230530210928.3: *3* TestNodeIndices.test_compute_last_index
    test('test_compute_last_index', () => {
        const ni = g.app.nodeIndices!;
        ni.compute_last_index(self.c);
        assert.ok(typeof ni.lastIndex === 'number');
    });
    //@+node:felix.20230530210928.4: *3* TestNodeIndices.test_computeNewIndex
    test('test_computeNewIndex', () => {
        const ni = g.app.nodeIndices!;
        const gnx = ni.computeNewIndex();
        assert.ok(typeof gnx === 'string');
    });
    //@+node:felix.20230530210928.5: *3* TestNodeIndices.test_scanGnx
    test('test_scanGnx', () => {
        const ni = g.app.nodeIndices!;
        for (let [s, id1, t1, n1] of [
            ['ekr.123', 'ekr', '123', undefined],
            ['ekr.456.2', 'ekr', '456', '2'],
            ['', g.app.leoID, undefined, undefined],
        ]) {
            let [id2, t2, n2] = ni.scanGnx(s!);
            assert.strictEqual(id1, id2);
            assert.strictEqual(t1, t2);
            assert.strictEqual(n1, n2);
        }
    });
    //@+node:felix.20230530210928.6: *3* TestNodeIndices.test_tupleToString
    test('test_tupleToString', () => {
        const ni = g.app.nodeIndices!;
        for (let [s1, id1, t1, n1] of [
            ['ekr.123', 'ekr', '123', undefined],
            ['ekr.456.2', 'ekr', '456', '2'],
            [`${g.app.leoID}.1`, g.app.leoID, '1', undefined],
        ]) {
            const s = ni.tupleToString([id1, t1, n1]);
            assert.strictEqual(s, s1);
        }
    });
    //@+node:felix.20230530210928.7: *3* TestNodeIndices.test_updateLastIndex
    test('test_updateLastIndex', () => {
        const ni = g.app.nodeIndices!;
        const old_last = ni.lastIndex;
        const table: [string, number][] = [
            ['', old_last],  // For error logic: no change.
            [`${g.app.leoID}.${ni.timeString}.1000`, 1000],
        ];
        for (let [gnx, new_last] of table) {
            ni.lastIndex = old_last;
            ni.updateLastIndex(gnx);
            assert.strictEqual(ni.lastIndex, new_last);
        }
    });
    //@-others
});
//@-others
//@-leo
