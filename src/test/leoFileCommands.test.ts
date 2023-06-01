//@+leo-ver=5-thin
//@+node:felix.20220129003044.1: * @file src/test/leoFileCommands.test.ts
/**
 * Tests of leoFileCommands.ts
 *
 * test-file-commands runs these tests.
 *
 * from leo.core.leoTest2 import LeoUnitTest
 *
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';
import { FastRead } from '../core/leoFileCommands';

//@+others
//@+node:felix.20230528193614.1: ** suite TestFileCommands
suite('TestFileCommands', () => {

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
    //@+node:felix.20230528193614.2: *3* TestFileCommands.test_fc_resolveArchivedPosition
    test('test_fc_resolveArchivedPosition', () => {
        const c = self.c;
        const root = self.root_p;
        const root_v = root.v;
        // Create the test tree. Headlines don't matter.
        const child1 = root.insertAsLastChild();
        const child2 = root.insertAsLastChild();
        const grandChild1 = child2.insertAsLastChild();
        const grandChild2 = child2.insertAsLastChild();
        const greatGrandChild11 = grandChild1.insertAsLastChild();
        const greatGrandChild12 = grandChild1.insertAsLastChild();
        const greatGrandChild21 = grandChild2.insertAsLastChild();
        const greatGrandChild22 = grandChild2.insertAsLastChild();
        const table: [VNode | undefined, string][] = [
            // Errors.
            [undefined, '-1'],
            // [undefined, '1'],
            [undefined, '0.2'],
            [undefined, '0.0.0'],
            [undefined, '0.1.2'],
            // Valid.
            [root_v, '0'],
            [child1.v, '0.0'],
            [child2.v, '0.1'],
            [grandChild1.v, '0.1.0'],
            [greatGrandChild11.v, '0.1.0.0'],
            [greatGrandChild12.v, '0.1.0.1'],
            [grandChild2.v, '0.1.1'],
            [greatGrandChild21.v, '0.1.1.0'],
            [greatGrandChild22.v, '0.1.1.1'],
        ];
        for (let [v, archivedPosition] of table) {

            if (v == null) {
                assert.throws(
                    () => {
                        c.fileCommands.resolveArchivedPosition(archivedPosition, root_v);
                    }
                );
            } else {
                const v2 = c.fileCommands.resolveArchivedPosition(archivedPosition, root_v);
                assert.strictEqual(v, v2);
            }
        }
    });
    //@+node:felix.20230528193614.3: *3* TestFileCommands.test_p_archivedPosition
    test('test_p_archivedPosition', () => {
        const p = self.c.p;
        const root = self.root_p;
        // Create the test tree. Headlines don't matter.
        const child1 = root.insertAsLastChild();
        const child2 = root.insertAsLastChild();
        const grandChild1 = child2.insertAsLastChild();
        const grandChild2 = child2.insertAsLastChild();
        assert.ok(
            child1 && grandChild1 && grandChild2 &&
            child1.__bool__() &&
            grandChild1.__bool__() &&
            grandChild2.__bool__()
        );
        // Tests...
        let val = p.archivedPosition(p);
        assert.strictEqual(val, [0]);

        const arraysHaveSameElements = (arr1: any[], arr2: any[]): boolean => {
            if (arr1.length !== arr2.length) {
                return false; // Different lengths, arrays cannot be the same
            }

            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false; // Found a difference in elements
                }
            }

            return true; // All elements match in the same order
        };

        for (const [i, z] of [...p.children_iter()].entries()) {
            val = z.archivedPosition(p);
            assert.ok(arraysHaveSameElements(val, [0, i]));
        }

        for (const [i, z] of [...p.firstChild().next().children_iter()].entries()) {
            val = z.archivedPosition(p);
            assert.ok(arraysHaveSameElements(val, [0, 1, i]));
        }

    });
    //@+node:felix.20230528193614.4: *3* TestFileCommands.test_putDescendentVnodeUas
    test('test_putDescendentVnodeUas', () => {
        const c = self.c;
        const root = self.root_p;
        const fc = c.fileCommands;
        // Create the test tree. Headlines don't matter.
        const child1 = root.insertAsLastChild();
        const child2 = root.insertAsLastChild();
        const grandchild2 = child2.insertAsLastChild();
        // Set the uA's.
        child1.v.unknownAttributes = { 'unit_test_child': 'abcd' };
        grandchild2.v.unknownAttributes = { 'unit_test_grandchild': 'wxyz' };
        // Test.
        const s = fc.putDescendentVnodeUas(root);
        assert.ok(s.startsWith(' descendentVnodeUnknownAttributes='), s);
    });
    //@+node:felix.20230528193614.7: *3* TestFileCommands.test_putUa
    test('test_putUa', () => {
        const c = self.c;
        const p = self.c.p;

        const fc = c.fileCommands;
        p.v.unknownAttributes = { 'unit_test': 'abcd' };
        const s = fc.putUnknownAttributes(p.v);
        const expected = ' unit_test="58040000006162636471002e"';
        assert.strictEqual(s, expected);
    });
    //@+node:felix.20230528193614.8: *3* TestFileCommands.test_fast_readWithElementTree
    test('test_fast_readWithElementTree', () => {
        // Test that readWithElementTree strips all control characters except '\t\r\n'.
        const c = self.c;
        // const s = chr(0) + 'a' + chr(12) + 'b' + '\t\r\n' + 'c'
        const s = String.fromCharCode(0) + 'a' + String.fromCharCode(12) + 'b' + '\t\r\n' + 'c';

        assert.strictEqual(s.length, 8);
        const d = new FastRead(c, {}).translate_dict;
        const s2 = g.translate(s, d);
        assert.strictEqual(s2, 'ab\t\r\nc');

    });
    //@-others

});

//@-others
//@-leo
