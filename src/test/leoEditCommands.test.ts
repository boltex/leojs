//@+leo-ver=5-thin
//@+node:felix.20230715191134.1: * @file src/test/leoEditCommands.test.ts
/**
 * Unit tests for Leo's edit commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715214158.1: ** suite
suite('Test cases for editCommands.ts', () => {

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
    //@+node:felix.20230829234252.1: *3* setUp
    /**
     * setUp for TestFind class
     */
    function setUp() {

        // super().setUp() // Done in suite init
        const c = self.c;

        // Create top-level parent node.
        self.parent_p = self.root_p.insertAsLastChild();
        // Create children of the parent node.
        self.tempNode = self.parent_p.insertAsLastChild();
        self.before_p = self.parent_p.insertAsLastChild();
        self.after_p = self.parent_p.insertAsLastChild();
        self.tempNode.h = 'tempNode';
        self.before_p.h = 'before';
        self.after_p.h = 'after';
        c.selectPosition(self.tempNode);
    }
    //@+node:felix.20230829231556.1: *3* run_test
    /**
     * A helper for many commands tests.
     */
    const run_test = (
        before_b: string,
        after_b: string,  // before/after body text.
        before_sel: [number | string, number | string],
        after_sel: [number | string, number | string], // before and after selection ranges.
        command_name: string,
        directives = '',
        dedent = true,
    ) => {

        const c = self.c;

        const toInt = (s: number | string) => {
            return g.toPythonIndex(before_b, s);
        };

        // For shortDescription().
        self.command_name = command_name;
        // Compute the result in tempNode.b
        const command = c.commandsDict[command_name];
        g.assert(command, `no command: ${command_name}`);
        // Set the text.
        let parent_b;
        if (dedent) {
            parent_b = g.dedent(directives);
            before_b = g.dedent(before_b);
            after_b = g.dedent(after_b);
        } else {
            // The unit test is responsible for all indentation.
            parent_b = directives;
        }
        self.parent_p.b = parent_b;
        self.tempNode.b = before_b;
        self.before_p.b = before_b;
        self.after_p.b = after_b;
        // Set the selection range and insert point.
        const w = c.frame.body.wrapper;
        let i, j;
        [i, j] = before_sel;
        [i, j] = [toInt(i), toInt(j)];
        w.setSelectionRange(i, j, j);
        // Run the command!
        // c.k.simulateCommand(command_name);
        c.doCommandByName(command_name);

        assert.strictEqual(self.tempNode.b, self.after_p.b, command_name);
    };
    //@+node:felix.20230715235308.1: *3* extend-to-word
    /**
     * Test case for extend-to-word
     */
    test('test_extend_to_word', () => {

        const before_b = `\
    first line
    line 1
        line_24a a
            line b
    line c
    last line
        `;
        const after_b = `\
    first line
    line 1
        line_24a a
            line b
    line c
    last line
        `;
        run_test(
            before_b,
            after_b,
            ["3.10", "3.10"],
            ["3.4", "3.12"],
            "extend-to-word",
        );

    });

    //@+node:felix.20230715234952.1: *3* merge-node-with-next-node
    test('test_merge_node_with_next_node', () => {
        const c = self.c;
        const u = self.c.undoer;

        const prev_b = g.dedent(`\
    def spam():
        pass
    `);
        const next_b = g.dedent(`\
    spam2 = spam
    `);
        const result_b = g.dedent(`\
    def spam():
        pass

    spam2 = spam
    `);
        self.before_p.b = prev_b;
        self.after_p.b = next_b;
        c.selectPosition(self.before_p);
        // Delete 'before', select 'after'
        // c.k.simulateCommand('merge-node-with-next-node');
        c.doCommandByName('merge-node-with-next-node');


        assert.strictEqual(c.p.h, 'after');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
        // Restore 'before', select, 'before'.
        u.undo();
        assert.strictEqual(c.p.h, 'before');
        assert.strictEqual(c.p.b, prev_b);
        assert.strictEqual(c.p.next().h, 'after');
        assert.strictEqual(c.p.next().b, next_b);
        u.redo();
        assert.strictEqual(c.p.h, 'after');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
    });


    //@+node:felix.20230715235006.1: *3* merge-node-with-prev-node
    test('test_merge_node_with_prev_node', () => {
        const c = self.c;
        const u = self.c.undoer;


        const prev_b = g.dedent(`\
    def spam():
        pass
    `);
        const next_b = g.dedent(`\
    spam2 = spam
    `);
        const result_b = g.dedent(`\
    def spam():
        pass

    spam2 = spam
    `);
        self.before_p.b = prev_b;
        self.after_p.b = next_b;
        c.selectPosition(self.after_p);
        // Delete 'after', select 'before'
        // c.k.simulateCommand('merge-node-with-prev-node');
        c.doCommandByName('merge-node-with-prev-node');
        assert.strictEqual(c.p.h, 'before');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
        // Restore 'after', select, 'after'.
        u.undo();
        assert.strictEqual(c.p.h, 'after');
        assert.strictEqual(c.p.b, next_b);
        assert.strictEqual(c.p.back().h, 'before');
        assert.strictEqual(c.p.back().b, prev_b);
        u.redo();
        assert.strictEqual(c.p.h, 'before');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
    });

    //@-others

});
//@-others
//@-leo
