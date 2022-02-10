//@+leo-ver=5-thin
//@+node:felix.20220129002948.1: * @file src/test/leoNodes.test.ts
/**
 * Tests for leo.core.leoNodes
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20220129225027.1: ** suite TestNodes(LeoUnitTest)
suite('Unit tests for leo/core/leoNodes.ts.', () => {

    let test_outline = undefined; // Set by create_test_outline.
    let self: LeoUnitTest;

    before(async () => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(async () => {
        self.setUp();
        const c = self.c;
        self.create_test_outline();
        c.selectPosition(c.rootPosition()!);
    });

    afterEach(async () => {
        self.tearDown();
    });

    //@+others
    //@+node:felix.20220129225027.4: *3* TestNodes.test_all_generators_return_unique_positions
    test('test_all_generators_return_unique_positions', async () => {
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
        table.forEach(element => {
            let kind: string;
            let generator: (copy?: boolean) => Generator<Position>;
            [kind, generator] = element;
            const aList: Position[] = [];

            for (let p of generator()) {
                let inList: boolean = false;

                aList.forEach(p_p => {
                    if (p === p_p || p.__eq__(p_p)) {
                        inList = true;
                    }
                });
                assert.strictEqual(false, inList, `${kind} ${p.gnx} ${p.h}`);
                aList.push(p);
            }
        });
    });

    //@+node:felix.20220129225027.5: *3* TestNodes.test_all_nodes_coverage
    test('test_all_nodes_coverage', async () => {
        // @test c iters: <coverage tests>
        const c = self.c;
        const v1: VNode[] = [...c.all_positions()].map(p => p.v);
        const v2: VNode[] = [...c.all_nodes()];
        v2.forEach(v => {
            assert.ok(v1.includes(v));
        });
        v1.forEach(v => {
            assert.ok(v2.includes(v));
        });
    });

    //@+node:felix.20220129225027.6: *3* TestNodes.test_at_most_one_VNode_has_str_leo_pos_attribute
    test('test_at_most_one_VNode_has_str_leo_pos_attribute', async () => {
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

    //@+node:felix.20220129225027.7: *3* TestNodes.test_at_others_directive
    test('test_at_others_directive', async () => {
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

    //@+node:felix.20220129225027.8: *3* TestNodes.test_c_positionExists
    test('test_c_positionExists', async () => {
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

    //@+node:felix.20220129225027.9: *3* TestNodes.test_c_positionExists_for_all_nodes
    test('test_c_positionExists_for_all_nodes', async () => {
        const c = self.c;
        for (let p of c.all_positions()) {
            assert.ok(c.positionExists(p));
            // 2012/03/08: If a root is given, the search is confined to that root only.
        }
    });

    //@+node:felix.20220129225027.10: *3* TestNodes.test_c_safe_all_positions
    test('test_c_safe_all_positions', async () => {
        const c = self.c;
        const aList1 = [...c.all_positions()];
        const aList2 = [...c.safe_all_positions()];
        assert.strictEqual(aList1.length, aList2.length);
    });

    //@+node:felix.20220129225027.11: *3* TestNodes.test_check_all_gnx_s_exist_and_are_unique
    test('test_check_all_gnx_s_exist_and_are_unique', async () => {
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

    //@+node:felix.20220129225027.12: *3* TestNodes.test_clone_and_move_the_clone_to_the_root
    test('test_clone_and_move_the_clone_to_the_root', async () => {
        const c = self.c;
        const p = self.c.p;
        const child = p.insertAsNthChild(0);
        c.setHeadString(child, 'child');  // Force the headline to update.
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
        clone.moveToRoot();  // Does not change child position.
        assert.ok(child.isCloned(), 'fail 3-2');
        assert.ok(clone.isCloned(), 'fail 4-2');
        assert.ok(!clone.parent().__bool__(), 'fail 5');
        assert.ok(!clone.back().__bool__(), 'fail 6');
        clone.doDelete();
        assert.ok(!child.isCloned(), 'fail 7');
    });

    //@+node:felix.20220129225027.13: *3* TestNodes.test_consistency_between_parents_iter_and_v_parents
    test('test_consistency_between_parents_iter_and_v_parents', async () => {
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

    //@+node:felix.20220129225027.14: *3* TestNodes.test_consistency_of_back_next_links
    test('test_consistency_of_back_next_links', async () => {
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

    //@+node:felix.20220129225027.15: *3* TestNodes.test_consistency_of_c_all_positions__and_p_ThreadNext_
    test('test_consistency_of_c_all_positions__and_p_ThreadNext_', async () => {
        const c = self.c;
        const p2 = c.rootPosition()!;
        for (let p of c.all_positions()) {
            assert.ok(p.__eq__(p2));
            p2.moveToThreadNext();
        }
        assert.ok(!p2 || !p2.__bool__());
    });

    //@+node:felix.20220129225027.16: *3* TestNodes.test_consistency_of_firstChild__children_iter_
    test('test_consistency_of_firstChild__children_iter_', async () => {
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

    //@+node:felix.20220129225027.17: *3* TestNodes.test_consistency_of_level
    test('test_consistency_of_level', async () => {
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

    //@+node:felix.20220129225027.18: *3* TestNodes.test_consistency_of_parent__parents_iter_
    test('test_consistency_of_parent__parents_iter_', async () => {
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

    //@+node:felix.20220129225027.19: *3* TestNodes.test_consistency_of_parent_child_links
    test('test_consistency_of_parent_child_links', async () => {
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

    //@+node:felix.20220129225027.20: *3* TestNodes.test_consistency_of_threadBack_Next_links
    test('test_consistency_of_threadBack_Next_links', async () => {
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

    //@+node:felix.20220129225027.21: *3* TestNodes.test_convertTreeToString_and_allies
    test('test_convertTreeToString_and_allies', async () => {
        const p = self.c.p;
        const sib = p.next();
        assert.ok(sib.__bool__());
        const s = sib.convertTreeToString();
        for (let p2 of sib.self_and_subtree()) {
            assert.ok(s.includes(p2.h));
        }
    });

    //@+node:felix.20220129225027.22: *3* TestNodes.test_delete_node
    test('test_delete_node', async () => {
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

    //@+node:felix.20220129225027.23: *3* TestNodes.test_deleting_the_root_should_select_another_node
    test('test_deleting_the_root_should_select_another_node', async () => {
        const c = self.c;
        const p = self.c.p;
        const root_h = p.h;
        const child = p.next();
        child.moveToRoot();  // Does not change child position.
        // * c.setRootPosition(child); // Do nothing
        assert.ok(c.positionExists(child));
        assert.strictEqual(c.rootPosition()!.h, child.h);
        const next = c.rootPosition()!.next();
        assert.strictEqual(next.h, root_h);
        c.rootPosition()!.doDelete(next);
        // * c.setRootPosition(next);  // Do nothing
    });

    //@+node:felix.20220129225027.24: *3* TestNodes.test_demote
    test('test_demote', async () => {
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

    //@+node:felix.20220129225027.25: *3* TestNodes.test_insert_node
    test('test_insert_node', async () => {
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

    //@+node:felix.20220129225027.26: *3* TestNodes.test_leoNodes_properties
    test('test_leoNodes_properties', async () => {
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

    //@+node:felix.20220129225027.27: *3* TestNodes.test_move_outline_down__undo_redo
    test('test_move_outline_down__undo_redo', async () => {
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

    //@+node:felix.20220129225027.28: *3* TestNodes.test_move_outline_left
    test('test_move_outline_left', async () => {
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

    //@+node:felix.20220129225027.29: *3* TestNodes.test_move_outline_right
    test('test_move_outline_right', async () => {
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

    //@+node:felix.20220129225027.30: *3* TestNodes.test_move_outline_up
    test('test_move_outline_up', async () => {
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

    //@+node:felix.20220129225027.31: *3* TestNodes.test_new_vnodes_methods
    test('test_new_vnodes_methods', async () => {
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

    //@+node:felix.20220129225027.32: *3* TestNodes.test_newlines_in_headlines
    test('test_newlines_in_headlines', async () => {
        const p = self.c.p;
        p.h = '\nab\nxy\n';
        assert.strictEqual(p.h, 'abxy');
    });

    //@+node:felix.20220129225027.33: *3* TestNodes.test_node_that_does_nott_belong_to_a_derived_file
    test('test_node_that_does_not_belong_to_a_derived_file', async () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        assert.ok(!p1.textOffset());
    });

    //@+node:felix.20220129225027.34: *3* TestNodes.test_organizer_node
    test('test_organizer_node', async () => {
        const p = self.c.p;
        const p1 = p.insertAsLastChild();
        p1.setHeadString('@file zzz');
        const p2 = p1.insertAsLastChild();
        assert.strictEqual(p1.textOffset(), 0);
        assert.strictEqual(p2.textOffset(), 0);
    });

    //@+node:felix.20220129225027.35: *3* TestNodes.test_p__eq_
    test('test_p__eq_', async () => {
        const c = self.c;
        const p = self.c.p;
        // These must not return NotImplemented!
        const root = c.rootPosition()!;
        assert.ok(!p.__eq__(undefined));
        assert.ok(p.__ne__(undefined));
        assert.ok(p.__eq__(root));
        assert.ok(!p.__ne__(root));

    });

    //@+node:felix.20220129225027.36: *3* TestNodes.test_p_comparisons
    test('test_p_comparisons', async () => {
        const c = self.c;
        const p = self.c.p;
        const copy = p.copy();
        assert.ok(p.__eq__(copy));
        assert.ok(!p.__eq__(p.threadNext()));
        const root = c.rootPosition();
        assert.ok(p.__eq__(copy));
        assert.ok(!p.__ne__(copy));
        assert.ok(p.__eq__(root));
        assert.ok(!p.__ne__(root));
    });

    //@+node:felix.20220129225027.37: *3* TestNodes.test_p_deletePositionsInList
    test('test_p_deletePositionsInList', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_deletePositionsInList(self):
        c, p = self.c, self.c.p
        root = p.insertAsLastChild()
        root.h = 'root'
        // Top level
        a1 = root.insertAsLastChild()
        a1.h = 'a'
        a1.clone()
        d1 = a1.insertAfter()
        d1.h = 'd'
        b1 = root.insertAsLastChild()
        b1.h = 'b'
        // Children of a.
        b11 = b1.clone()
        b11.moveToLastChildOf(a1)
        b11.clone()
        c2 = b11.insertAfter()
        c2.h = 'c'
        // Children of d
        b11 = b1.clone()
        b11.moveToLastChildOf(d1)
        // Count number of 'b' nodes.
        aList = []
        nodes = 0
        for p in root.subtree():
            nodes += 1
            if p.h == 'b':
                aList.append(p.copy())
        self.assertEqual(len(aList), 6)
        c.deletePositionsInList(aList)
        c.redraw()

     */
    //@+node:felix.20220129225027.38: *3* TestNodes.test_p_hasNextBack
    test('test_p_hasNextBack', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_hasNextBack(self):
        c, p = self.c, self.c.p
        for p in c.all_positions():
            back = p.back()
            next = p.next()
            assert(
                (back and p.hasBack()) or
                (not back and not p.hasBack()))
            assert(
                (next and p.hasNext()) or
                (not next and not p.hasNext()))
     */
    //@+node:felix.20220129225027.39: *3* TestNodes.test_p_hasParentChild
    test('test_p_hasParentChild', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_hasParentChild(self):
        c, p = self.c, self.c.p
        for p in c.all_positions():
            child = p.firstChild()
            parent = p.parent()
            assert(
                (child and p.hasFirstChild()) or
                (not child and not p.hasFirstChild()))
            assert(
                (parent and p.hasParent()) or
                (not parent and not p.hasParent()))
     */
    //@+node:felix.20220129225027.40: *3* TestNodes.test_p_hasThreadNextBack
    test('test_p_hasThreadNextBack', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_hasThreadNextBack(self):
        c, p = self.c, self.c.p
        for p in c.all_positions():
            threadBack = p.getThreadBack()
            threadNext = p.getThreadNext()
            assert(
                (threadBack and p.hasThreadBack()) or
                (not threadBack and not p.hasThreadBack()))
            assert(
                (threadNext and p.hasThreadNext()) or
                (not threadNext and not p.hasThreadNext()))
     */
    //@+node:felix.20220129225027.41: *3* TestNodes.test_p_isAncestorOf
    test('test_p_isAncestorOf', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_isAncestorOf(self):
        c, p = self.c, self.c.p
        for p in c.all_positions():
            child = p.firstChild()
            while child:
                for parent in p.self_and_parents_iter():
                    assert parent.isAncestorOf(child)
                child.moveToNext()
            next = p.next()
            self.assertFalse(p.isAncestorOf(next))
     */
    //@+node:felix.20220129225027.42: *3* TestNodes.test_p_isCurrentPosition
    test('test_p_isCurrentPosition', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_isCurrentPosition(self):
        c, p = self.c, self.c.p
        self.assertFalse(c.isCurrentPosition(None))
        self.assertTrue(c.isCurrentPosition(p))
     */
    //@+node:felix.20220129225027.43: *3* TestNodes.test_p_isRootPosition
    test('test_p_isRootPosition', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_isRootPosition(self):
        c, p = self.c, self.c.p
        self.assertFalse(c.isRootPosition(None))
        self.assertTrue(c.isRootPosition(p))
     */
    //@+node:felix.20220129225027.44: *3* TestNodes.test_p_moveToFirst_LastChild
    test('test_p_moveToFirst_LastChild', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_moveToFirst_LastChild(self):
        c, p = self.c, self.c.p
        root2 = p.next()
        self.assertTrue(root2)
        p2 = root2.insertAfter()
        p2.h = "test"
        self.assertTrue(c.positionExists(p2))
        p2.moveToFirstChildOf(root2)
        self.assertTrue(c.positionExists(p2))
        p2.moveToLastChildOf(root2)
        self.assertTrue(c.positionExists(p2))
     */
    //@+node:felix.20220129225027.45: *3* TestNodes.test_p_moveToVisBack_in_a_chapter
    test('test_p_moveToVisBack_in_a_chapter', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_moveToVisBack_in_a_chapter(self):
        // Verify a fix for bug https://bugs.launchpad.net/leo-editor/+bug/1264350
        import leo.core.leoChapters as leoChapters
        c, p = self.c, self.c.p
        cc = c.chapterController
        settings_p = p.insertAsNthChild(0)
        settings_p.h = '@settings'
        chapter_p = settings_p.insertAsLastChild()
        chapter_p.h = '@chapter aaa'
        node_p = chapter_p.insertAsNthChild(0)
        node_p.h = 'aaa node 1'
        // Hack the chaptersDict.
        cc.chaptersDict['aaa'] = leoChapters.Chapter(c, cc, 'aaa')
        // Select the chapter.
        cc.selectChapterByName('aaa')
        self.assertEqual(c.p.h, 'aaa node 1')
        p2 = c.p.moveToVisBack(c)
        self.assertEqual(p2, None)
     */
    //@+node:felix.20220129225027.46: *3* TestNodes.test_p_nosentinels
    test('test_p_nosentinels', async () => {
        const c = self.c;
        let p = self.c.p;


    });
    /* def test_p_nosentinels(self):

        p = self.c.p

        def not_a_sentinel(x):
            pass

        @not_a_sentinel
        def spam():
            pass

        s1 = ''.join(g.splitLines(p.b)[2:])
        s2 = p.nosentinels
        self.assertEqual(s1, s2)
     */
    //@+node:felix.20220129225027.47: *3* TestNodes.test_p_relinkAsCloneOf
    test('test_p_relinkAsCloneOf', async () => {
        const c = self.c;
        const u = self.c.undoer;
        let p = self.c.p.next();


    });
    /* def test_p_relinkAsCloneOf(self):

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
        c, u = self.c, self.c.undoer
        p = c.p.next()
        child_b = g.findNodeAnywhere(c, 'child b')
        self.assertTrue(child_b)
        self.assertTrue(child_b.isCloned())
        #
        // child_c must *not* be a clone at first.
        child_c = g.findNodeAnywhere(c, 'child c')
        self.assertTrue(child_c)
        self.assertFalse(child_c.isCloned())
        #
        // Change the tree.
        bunch = u.beforeChangeTree(p)
        child_c._relinkAsCloneOf(child_b)
        u.afterChangeTree(p, 'relink-clone', bunch)
        // self.dump_tree('Before...')
        u.undo()
        // self.dump_tree('After...')
        self.assertTrue(child_b.isCloned())
        self.assertFalse(child_c.isCloned())

     */
    //@+node:felix.20220129225027.48: *3* TestNodes.test_p_setBodyString
    /* def test_p_setBodyString(self):
        // Test that c.setBodyString works immediately.
        c, w = self.c, self.c.frame.body.wrapper
        next = self.root_p.next()
        c.setBodyString(next, "after")
        c.selectPosition(next)
        s = w.get("1.0", "end")
        self.assertEqual(s.rstrip(), "after")
     */
    //@+node:felix.20220129225027.49: *3* TestNodes.test_p_u
    /* def test_p_u(self):
        p = self.c.p
        self.assertEqual(p.u, p.v.u)
        p.v.u = None
        self.assertEqual(p.u, {})
        self.assertEqual(p.v.u, {})
        d = {'my_plugin': 'val'}
        p.u = d
        self.assertEqual(p.u, d)
        self.assertEqual(p.v.u, d)
     */
    //@+node:felix.20220129225027.50: *3* TestNodes.test_p_unique_nodes
    /* def test_p_unique_nodes(self):

        self.assertEqual(len(list(self.root_p.unique_nodes())), 5)
     */
    //@+node:felix.20220129225027.51: *3* TestNodes.test_paste_node
    /* def test_paste_node(self):
        c, p = self.c, self.c.p
        child = p.insertAsNthChild(0)
        child.setHeadString('child')
        child2 = p.insertAsNthChild(1)
        child2.setHeadString('child2')
        grandChild = child.insertAsNthChild(0)
        grandChild.setHeadString('grand child')
        c.selectPosition(grandChild)
        c.clone()
        c.selectPosition(child)
        p.expand()
        c.selectPosition(child)
        self.assertEqual(c.p.h, 'child')
        c.copyOutline()
        oldVnodes = [p2.v for p2 in child.self_and_subtree()]
        c.selectPosition(child)
        c.p.contract()  # Essential
        c.pasteOutline()
        assert c.p != child
        self.assertEqual(c.p.h, 'child')
        newVnodes = [p2.v for p2 in c.p.self_and_subtree()]
        for v in newVnodes:
            assert v not in oldVnodes
        c.undoer.undo()
        c.undoer.redo()
        c.undoer.undo()
        c.undoer.redo()
     */
    //@+node:felix.20220129225027.52: *3* TestNodes.test_paste_retaining_clones
    /* def test_paste_retaining_clones(self):
        c, p = self.c, self.c.p
        child = p.insertAsNthChild(0)
        child.setHeadString('child')
        self.assertTrue(child)
        grandChild = child.insertAsNthChild(0)
        grandChild.setHeadString('grand child')
        c.selectPosition(child)
        c.copyOutline()
        oldVnodes = [p2.v for p2 in child.self_and_subtree()]
        c.p.contract()  # Essential
        c.pasteOutlineRetainingClones()
        self.assertNotEqual(c.p, child)
        newVnodes = [p2.v for p2 in c.p.self_and_subtree()]
        for v in newVnodes:
            self.assertTrue(v in oldVnodes)
     */
    //@+node:felix.20220129225027.53: *3* TestNodes.test_position_not_hashable
    /* def test_position_not_hashable(self):
        p = self.c.p
        try:
            a = set()
            a.add(p)
            assert False, 'Adding position to set should throw exception'
        except TypeError:
            pass
     */
    //@+node:felix.20220129225027.54: *3* TestNodes.test_promote
    /* def test_promote(self):
        c, p = self.c, self.c.p
        p2 = p.insertAsNthChild(0)
        p2.setHeadString('A')
        p3 = p.insertAsNthChild(1)
        p3.setHeadString('B')
        p4 = p3.insertAsNthChild(0)
        p4.setHeadString('child 1')
        p5 = p3.insertAsNthChild(1)
        p5.setHeadString('child 2')
        p.expand()
        p6 = p.insertAsNthChild(2)
        p6.setHeadString('C')
        c.setCurrentPosition(p3)
        c.promote()
        p = c.p
        self.assertEqual(p, p3)
        self.assertEqual(p.h, 'B')
        self.assertEqual(p.next().h, 'child 1')
        self.assertEqual(p.next().next().h, 'child 2')
        self.assertEqual(p.next().next().next().h, 'C')
        c.undoer.undo()
        p = c.p
        self.assertEqual(p, p3)
        self.assertEqual(p.back(), p2)
        self.assertEqual(p.next(), p6)
        self.assertEqual(p.firstChild().h, 'child 1')
        self.assertEqual(p.firstChild().next().h, 'child 2')
        c.undoer.redo()
        p = c.p
        self.assertEqual(p, p3)
        self.assertEqual(p.h, 'B')
        self.assertEqual(p.next().h, 'child 1')
        self.assertEqual(p.next().next().h, 'child 2')
        self.assertEqual(p.next().next().next().h, 'C')
        c.undoer.undo()
        p = c.p
        self.assertEqual(p, p3)
        self.assertEqual(p.back(), p2)
        self.assertEqual(p.next(), p6)
        self.assertEqual(p.firstChild().h, 'child 1')
        self.assertEqual(p.firstChild().next().h, 'child 2')
        c.undoer.redo()
        p = c.p
        self.assertEqual(p, p3)
        self.assertEqual(p.h, 'B')
        self.assertEqual(p.next().h, 'child 1')
        self.assertEqual(p.next().next().h, 'child 2')
        self.assertEqual(p.next().next().next().h, 'C')
     */
    //@+node:felix.20220129225027.55: *3* TestNodes.test_root_of_a_derived_file
    /* def test_root_of_a_derived_file(self):
        p = self.c.p
        p1 = p.insertAsLastChild()
        p1.setHeadString('@file zzz')
        self.assertEqual(p1.textOffset(), 0)
     */
    //@+node:felix.20220129225027.56: *3* TestNodes.test_section_node
    /* def test_section_node(self):
        p = self.c.p
        p1 = p.insertAsLastChild()
        p1.setHeadString('@file zzz')
        body = '''   %s
        ''' % (g.angleBrackets(' section '))
        p1.setBodyString(body)
        p2 = p1.insertAsLastChild()
        head = g.angleBrackets(' section ')
        p2.setHeadString(head)
        self.assertEqual(p1.textOffset(), 0)
        self.assertEqual(p2.textOffset(), 3)
            // Section nodes can appear in with @others nodes,
            // so they don't get special treatment.
     */
    //@+node:felix.20220129225027.57: *3* TestNodes.test_v_atAutoNodeName_and_v_atAutoRstNodeName
    /* def test_v_atAutoNodeName_and_v_atAutoRstNodeName(self):
        p = self.c.p
        table = (
            ('@auto-rst rst-file', 'rst-file', 'rst-file'),
            ('@auto x', 'x', ''),
            ('xyz', '', ''),
        )
        for s, expected1, expected2 in table:
            result1 = p.v.atAutoNodeName(h=s)
            result2 = p.v.atAutoRstNodeName(h=s)
            self.assertEqual(result1, expected1, msg=s)
            self.assertEqual(result2, expected2, msg=s)
     */
    //@-others

});
//@-others
//@-leo
