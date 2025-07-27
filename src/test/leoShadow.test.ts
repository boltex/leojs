//@+leo-ver=5-thin
//@+node:felix.20220129003553.1: * @file src/test/leoShadow.test.ts
/**
 * Tests of leoShadow.ts
 */
import * as vscode from "vscode";
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';
import { Marker, ShadowController } from '../core/leoShadow';

//@+others
//@+node:felix.20230530004010.1: ** class TestAtShadow(LeoUnitTest)
export class TestAtShadow extends LeoUnitTest {

    public shadow_controller!: ShadowController;
    public marker!: Marker;

    //@+others
    //@+node:felix.20230530004010.2: *3*  TestShadow.setUp & helpers
    /**
     * AtShadowTestCase.setup.
     */
    public setUp(): void {

        super.setUp();
        const delims: [string, string, string] = ['#', '', ''];
        const c = this.c;

        const base_dir = g.os_path_dirname(__dirname);
        c.mFileName = g.finalize_join(base_dir, '..', '..', 'test666.leo');

        this.shadow_controller = new ShadowController(c);
        this.marker = new Marker(delims);

    }
    //@+node:felix.20230530004010.3: *4* TestShadow.deleteShadowDir (was a function)
    public async deleteShadowDir(shadow_dir: string): Promise<void> {
        let w_exists = await g.os_path_exists(shadow_dir);
        if (!w_exists) {
            return;
        }

        // files = g.os_path_abspath(g.os_path_join(shadow_dir, "*.*"));
        // files = glob.glob(files);
        // for( const z of files){
        //     if (z != shadow_dir){
        //         os.unlink(z);
        //     }
        // }
        // os.rmdir(shadow_dir);

        const folderUri = g.makeVscodeUri(shadow_dir);
        await vscode.workspace.fs.delete(folderUri, { recursive: true });

        w_exists = await g.os_path_exists(shadow_dir);
        assert.ok(!w_exists, shadow_dir);
    }
    //@+node:felix.20230530004010.4: *4* TestShadow.make_lines
    /**
     * Make all lines and return the result of propagating changed lines.
     */
    public async make_lines(old: Position, p_new: Position): Promise<[string[], string[]]> {

        const c = this.c;
        // Calculate all required lines.
        const old_private_lines: string[] = await this.makePrivateLines(old);
        const new_private_lines: string[] = await this.makePrivateLines(p_new);
        const old_public_lines: string[] = this.makePublicLines(old_private_lines);
        const new_public_lines: string[] = this.makePublicLines(new_private_lines);
        const expected_private_lines: string[] = this.mungePrivateLines(
            new_private_lines, 'node:new', 'node:old'
        );
        // Return the propagated results.
        const results: string[] = this.shadow_controller.propagate_changed_lines(
            new_public_lines,
            old_private_lines,
            this.marker,
            c.p
        );
        if (0) {  // To verify that sentinels are as expected.
            console.log('');
            console.log(g.callers(1));
            g.printObj(old_private_lines, 'old_private_lines');
            g.printObj(new_private_lines, 'new_private_lines');
            g.printObj(old_public_lines, 'old_public_lines');
            g.printObj(new_public_lines, 'new_public_lines');
        }
        return [results, expected_private_lines];
    }
    //@+node:felix.20230530004010.5: *4* TestShadow.makePrivateLines
    /**
     * Return a list of the lines of p containing sentinels.
     */
    public async makePrivateLines(p: Position): Promise<string[]> {

        const at = this.c.atFileCommands;
        // A hack: we want to suppress gnx's *only* in @+node sentinels,
        // but we *do* want sentinels elsewhere.
        at.at_shadow_test_hack = true;
        let s;
        try {
            s = await at.atFileToString(p, true);
        } catch (e) {
            // pass
        } finally {
            at.at_shadow_test_hack = false;
        }
        return g.splitLines(s);

    }
    //@+node:felix.20230530004010.6: *4* TestShadow.makePublicLines
    /**
     * Return the public lines in lines.
     */
    public makePublicLines(lines: string[]): string[] {
        let junk;
        [lines, junk] = this.shadow_controller.separate_sentinels(lines, this.marker);
        return lines;
    }
    //@+node:felix.20230530004010.7: *4* TestShadow.mungePrivateLines
    /**
     * Change the 'find' the 'replace' pattern in sentinel lines.
     */
    public mungePrivateLines(lines: string[], find: string, replace: string): string[] {

        const marker = this.marker;
        let i = 0;
        const results: string[] = [];
        while (i < lines.length) {
            const line = lines[i];
            if (marker.isSentinel(line)) {
                const new_line = line.split(find).join(replace);
                results.push(new_line);
                if (marker.isVerbatimSentinel(line)) {
                    i += 1;
                    if (i < lines.length) {
                        const line = lines[i];
                        results.push(line);
                    } else {
                        this.shadow_controller.verbatim_error();
                    }
                }
            } else {
                results.push(line);
            }
            i += 1;

        }
        return results;
    }
    //@-others

}
//@+node:felix.20230531205916.1: ** suite TestAtShadow
suite('TestAtShadow', () => {

    let self: TestAtShadow;

    before(() => {
        self = new TestAtShadow();
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
    //@+node:felix.20230531205916.8: *3* test update algorithm...
    //@+node:felix.20230531205916.9: *4* TestShadow.test_change_end_of_prev_node
    test('test_change_end_of_prev_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            ATothers
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/AT/g, '@');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            ATothers
            node 1 line 1
            node 1 line 1 changed
            node 2 line 1
            node 2 line 2
        `).replace(/AT/g, '@');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.10: *4* TestShadow.test_change_first_line
    test('test_change_first_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1 changed
            line 2
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.11: *4* TestShadow.test_change_last_line
    test('test_change_last_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            line 2
            line 3 changed
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.12: *4* TestShadow.test_change_middle_line
    test('test_change_middle_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            line 2 changed
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.13: *4* TestShadow.test_change_start_of_next_node
    test('test_change_start_of_next_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1 changed
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.14: *4* TestShadow.test_delete_between_nodes_at_end_of_prev_node
    test('test_delete_between_nodes_at_end_of_prev_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.15: *4* TestShadow.test_delete_between_nodes_at_start_of_next_node
    test('test_delete_between_nodes_at_start_of_next_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.16: *4* TestShadow.test_delete_first_line
    test('test_delete_first_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 2
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.17: *4* TestShadow.test_delete_last_line
    test('test_delete_last_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            line 2
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.18: *4* TestShadow.test_delete_middle_line
    test('test_delete_middle_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.19: *4* TestShadow.test_insert_after_last_line
    test('test_insert_after_last_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            line 2
            line 3
            inserted line
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.20: *4* TestShadow.test_insert_before_first_line
    test('test_insert_before_first_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            inserted line
            line 1
            line 2
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.21: *4* TestShadow.test_insert_middle_line_after_first_line_
    test('test_insert_middle_line_after_first_line_', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            inserted line
            line 2
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.22: *4* TestShadow.test_insert_middle_line_before_last_line_
    test('test_insert_middle_line_before_last_line_', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line 1
            line 2
            line 3
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line 1
            line 2
            inserted line
            line 3
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.23: *4* TestShadow.test_lax_insert_between_nodes_at_end_of_prev_node
    test('test_lax_insert_between_nodes_at_end_of_prev_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            inserted node at end of node 1
            node 2 line 1
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.24: *4* TestShadow.test_lax_multiple_line_insert_between_nodes_at_end_of_prev_node
    test('test_lax_multiple_line_insert_between_nodes_at_end_of_prev_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            inserted node 1 at end of node 1
            inserted node 2 at end of node 1
            node 2 line 1
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.25: *4* TestShadow.test_multiple_line_change_end_of_prev_node
    test('test_multiple_line_change_end_of_prev_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 1 line 3
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2 changed
            node 1 line 3 changed
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.26: *4* TestShadow.test_multiple_line_change_start_of_next_node
    test('test_multiple_line_change_start_of_next_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1 changed
            node 2 line 2 changed
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.27: *4* TestShadow.test_multiple_line_delete_between_nodes_at_end_of_prev_node
    test('test_multiple_line_delete_between_nodes_at_end_of_prev_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 1 line 3
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.28: *4* TestShadow.test_multiple_line_delete_between_nodes_at_start_of_next_node
    test('test_multiple_line_delete_between_nodes_at_start_of_next_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
            node 2 line 3
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 3
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.29: *4* TestShadow.test_multiple_node_changes
    test('test_multiple_node_changes', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/at\-others/g, '@others');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2 changed
            node 2 line 1 changed
            node 2 line 2 changed
        `).replace(/at\-others/g, '@others');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.30: *4* TestShadow.test_no_change_no_ending_newline
    test('test_no_change_no_ending_newline', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            line
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            line
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.31: *4* TestShadow.test_replace_in_node_new_gt_new_old
    test('test_replace_in_node_new_gt_new_old', async () => {
        const p = self.c.p;
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = '@others\n';
        const old_node1 = old.insertAsLastChild();
        old_node1.h = 'node1';
        old_node1.b = g.dedent(`\
            node 1 line 1
            node 1 old line 1
            node 1 old line 2
            node 1 line 2
    `);
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = '@others\n';
        const new_node1 = w_new.insertAsLastChild();
        new_node1.h = 'node1';
        new_node1.b = g.dedent(`\
            node 1 line 1
            node 1 new line 1
            node 1 new line 2
            node 1 new line 3
            node 1 line 2
    `);
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.32: *4* TestShadow.test_replace_in_node_new_lt_old
    test('test_replace_in_node_new_lt_old', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = '@others\n';
        const old_node1 = old.insertAsLastChild();
        old_node1.h = 'node1';
        old_node1.b = g.dedent(`\
            node 1 line 1
            node 1 old line 1
            node 1 old line 2
            node 1 old line 3
            node 1 old line 4
            node 1 line 2
        `);
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = '@others\n';
        const new_node1 = w_new.insertAsLastChild();
        new_node1.h = 'node1';
        new_node1.b = g.dedent(`\
            node 1 line 1
            node 1 new line 1
            node 1 new line 2
            node 1 line 2
        `);
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.33: *4* TestShadow.test_verbatim_sentinels_add_verbatim_line
    test('test_verbatim_sentinels_add_verbatim_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/at\-/, '@');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            node 1 line 2
            node 2 line 1
            node 2 line 2
        `).replace(/at\-/g, '@');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.34: *4* TestShadow.test_verbatim_sentinels_delete_verbatim_line
    test('test_verbatim_sentinels_delete_verbatim_line', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        `).replace(/at\-/, '@');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        `).replace(/at\-/, '@');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.35: *4* TestShadow.test_verbatim_sentinels_delete_verbatim_line_at_end_of_node
    test('test_verbatim_sentinels_delete_verbatim_line_at_end_of_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            node 2 line 1
            node 2 line 2
        `).replace(/at\-/, '@');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 1
            node 2 line 2
        `).replace(/at\-/, '@');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.36: *4* TestShadow.test_verbatim_sentinels_delete_verbatim_line_at_start_of_node
    test('test_verbatim_sentinels_delete_verbatim_line_at_start_of_node', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            at-verbatim
            #  at- should be handled by verbatim
            node 2 line 2
        `).replace(/at\-/, '@');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            node 2 line 2
        `).replace(/at\-/, '@');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.37: *4* TestShadow.test_verbatim_sentinels_no_change
    test('test_verbatim_sentinels_no_change', async () => {
        const p = self.c.p;
        // Create the 'old' node.
        const old = p.insertAsLastChild();
        old.h = 'old';
        old.b = g.dedent(`\
            at-others
            node 1 line 1
            at-verbatim
            #at- should be handled by verbatim
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        `).replace(/at\-/, '@');
        // Create the 'new' node.
        const w_new = p.insertAsLastChild();
        w_new.h = 'new';
        w_new.b = g.dedent(`\
            at-others
            node 1 line 1
            at-verbatim
            #at- should be handled by verbatim
            line 1 line 3
            node 2 line 1
            node 2 line 2
            node 2 line 3
        `).replace(/at\-/, '@');
        // Run the test.
        let [results, expected] = await self.make_lines(old, w_new);
        assert.ok(g.compareArrays(results, expected));
    });
    //@+node:felix.20230531205916.38: *3* test utils...
    //@+node:felix.20230531205916.39: *4* TestShadow.test_marker_getDelims
    test('test_marker_getDelims', () => {
        const c = self.c;
        const x = c.shadowController;
        const table: [string, string, string][] = [
            ['python', '#', ''],
            ['c', '//', ''],
            ['html', '<!--', '-->'],
            ['xxxx', '#--unknown-language--', ''],
        ];
        for (let [language, delim1, delim2] of table) {
            const delims = g.set_delims_from_language(language);
            const marker = new Marker(delims);
            const result = marker.getDelims();
            const expected = [delim1, delim2];
            assert.ok(g.compareArrays(result, expected), language);
        }
    });
    //@+node:felix.20230531205916.40: *4* TestShadow.test_marker_isSentinel
    test('test_marker_isSentinel', () => {
        const c = self.c;
        const x = c.shadowController;
        const table: [string, string, boolean][] = [
            ['python', 'abc', false],
            ['python', '#abc', false],
            ['python', '#@abc', true],
            ['python', '@abc#', false],
            ['c', 'abc', false],
            ['c', '//@', true],
            ['c', '// @abc', false],
            ['c', '/*@ abc */', true],
            ['c', '/*@ abc', false],
            ['html', '#@abc', false],
            ['html', '<!--abc-->', false],
            ['html', '<!--@ abc -->', true],
            ['html', '<!--@ abc ->', false],
            ['xxxx', '#--unknown-language--@', true]
        ];
        for (let [language, s, expected] of table) {
            const delims = g.set_delims_from_language(language);
            const marker = new Marker(delims);
            const result = marker.isSentinel(s);
            assert.strictEqual(result, expected);
        }
    });
    //@+node:felix.20230531205916.41: *4* TestShadow.test_marker_isVerbatimSentinel
    test('test_marker_isVerbatimSentinel', () => {
        const c = self.c;
        const x = c.shadowController;
        const table: [string, string, boolean][] = [
            ['python', 'abc', false],
            ['python', '#abc', false],
            ['python', '#verbatim', false],
            ['python', '#@verbatim', true],
            ['c', 'abc', false],
            ['c', '//@', false],
            ['c', '//@verbatim', true],
            ['html', '#@abc', false],
            ['html', '<!--abc-->', false],
            ['html', '<!--@verbatim -->', true],
            ['xxxx', '#--unknown-language--@verbatim', true]
        ];
        for (let [language, s, expected] of table) {
            const delims = g.set_delims_from_language(language);
            const marker = new Marker(delims);
            const result = marker.isVerbatimSentinel(s);
            assert.strictEqual(result, expected);
        }
    });
    //@+node:felix.20230531205916.42: *4* TestShadow.test_x_baseDirName
    test('test_x_baseDirName', () => {
        const c = self.c;
        const x = c.shadowController;
        const path = x.baseDirName();
        const expected = g.os_path_dirname(g.os_path_abspath(g.os_path_join(c.fileName())));
        assert.strictEqual(path, expected);
    });
    //@+node:felix.20230531205916.43: *4* TestShadow.test_x_dirName
    test('test_x_dirName', () => {
        const c = self.c;
        const x = c.shadowController;
        const filename = 'xyzzy';
        const path = x.dirName(filename);
        const expected = g.os_path_dirname(g.os_path_abspath(
            g.os_path_join(g.os_path_dirname(c.fileName()), filename))
        );
        assert.strictEqual(path, expected);
    });
    //@+node:felix.20230531205916.44: *4* TestShadow.test_x_findAtLeoLine
    test('test_x_findAtLeoLine', () => {
        const c = self.c;
        const x = c.shadowController;
        const table: [string, string[], string][] = [
            ['c', ['//@+leo', 'a'], '//@+leo'],
            ['c', ['//@first', '//@+leo', 'b'], '//@+leo'],
            ['c', ['/*@+leo*/', 'a'], '/*@+leo*/'],
            ['c', ['/*@first*/', '/*@+leo*/', 'b'], '/*@+leo*/'],
            ['python', ['#@+leo', 'a'], '#@+leo'],
            ['python', ['#@first', '#@+leo', 'b'], '#@+leo'],
            ['error', ['',], ''],
            ['html', ['<!--@+leo-->', 'a'], '<!--@+leo-->'],
            ['html', ['<!--@first-->', '<!--@+leo-->', 'b'], '<!--@+leo-->'],
        ];
        for (let [language, lines, expected] of table) {
            const result = x.findLeoLine(lines);
            assert.strictEqual(expected, result, language);
        }
    });
    //@+node:felix.20230531205916.45: *4* TestShadow.test_x_makeShadowDirectory
    test('test_x_makeShadowDirectory', async () => {
        const c = self.c;
        const x = c.shadowController;
        const shadow_fn = x.shadowPathName('unittests/xyzzy/test.py');
        const shadow_dir = x.shadowDirName('unittests/xyzzy/test.py');
        let w_exists = await g.os_path_exists(shadow_fn);
        assert.ok(!w_exists, shadow_fn);
        await self.deleteShadowDir(shadow_dir);
        await x.makeShadowDirectory(shadow_dir);
        w_exists = await g.os_path_exists(shadow_dir);
        assert.ok(w_exists);
        await self.deleteShadowDir(shadow_dir);
    });
    //@+node:felix.20230531205916.46: *4* TestShadow.test_x_markerFromFileLines
    test('test_x_markerFromFileLines', () => {
        const c = self.c;
        const x = c.shadowController;
        // Add -ver=4 so at.parseLeoSentinel does not complain.
        const table: [string, string[], string, string][] = [
            ['c', ['//@+leo-ver=4', 'a'], '//', ''],
            ['c', ['//@first', '//@+leo-ver=4', 'b'], '//', ''],
            ['c', ['/*@+leo-ver=4*/', 'a'], '/*', '*/'],
            ['c', ['/*@first*/', '/*@+leo-ver=4*/', 'b'], '/*', '*/'],
            ['python', ['#@+leo-ver=4', 'a'], '#', ''],
            ['python', ['#@first', '#@+leo-ver=4', 'b'], '#', ''],
            ['error', ['',], '#--unknown-language--', ''],
            ['html', ['<!--@+leo-ver=4-->', 'a'], '<!--', '-->'],
            ['html', ['<!--@first-->', '<!--@+leo-ver=4-->', 'b'], '<!--', '-->'],
        ];

        for (let [language, lines, delim1, delim2] of table) {
            const lines_s = lines.join('\n');
            const marker = x.markerFromFileLines(lines, 'test-file-name');
            let [result1, result2] = marker.getDelims();
            assert.strictEqual(delim1, result1, `language: ${language} ${lines_s}`);
            assert.strictEqual(delim2, result2, `language: ${language} ${lines_s}`);
        }
    });
    //@+node:felix.20230531205916.47: *4* TestShadow.test_x_markerFromFileName
    test('test_x_markerFromFileName', () => {
        const c = self.c;
        const x = c.shadowController;
        const table: [string, string, string][] = [
            ['ini', ';', '',],
            ['c', '//', ''],
            ['h', '//', ''],
            ['py', '#', ''],
            ['xyzzy', '#--unknown-language--', ''],
        ];
        for (let [ext, delim1, delim2] of table) {
            const filename = `x.${ext}`;
            const marker = x.markerFromFileName(filename)!;
            const [result1, result2] = marker.getDelims();
            assert.strictEqual(delim1, result1);
            assert.strictEqual(delim2, result2);
        }
    });
    //@+node:felix.20230531205916.48: *4* TestShadow.test_x_pathName
    test('test_x_pathName', () => {
        const c = self.c;
        const x = c.shadowController;
        const filename = 'xyzzy';
        const path = x.pathName(filename);
        const expected = g.os_path_abspath(g.os_path_join(x.baseDirName(), filename));
        assert.strictEqual(path, expected);
    });
    //@+node:felix.20230531205916.49: *4* TestShadow.test_x_replaceFileWithString_2
    test('test_x_replaceFileWithString_2', async () => {
        const c = self.c;
        const x = c.shadowController;
        const encoding = 'utf-8';
        const fn = 'does/not/exist';
        const w_exists = await g.os_path_exists(fn);
        assert.ok(!w_exists);
        const w_replace = await x.replaceFileWithString(encoding, fn, 'abc');
        assert.ok(!w_replace);
    });
    //@+node:felix.20230531205916.50: *4* TestShadow.test_x_shadowDirName
    test('test_x_shadowDirName', () => {
        const c = self.c;
        const x = c.shadowController;
        const subdir = c.config.getString('shadow_subdir') || '.leo_shadow';
        const filename = 'xyzzy';
        const path = x.shadowDirName(filename);
        const expected = g.os_path_abspath(g.os_path_join(
            g.os_path_dirname(c.fileName()), subdir)
        );
        assert.strictEqual(path, expected);
    });
    //@+node:felix.20230531205916.51: *4* TestShadow.test_x_shadowPathName
    test('test_x_shadowPathName', () => {
        const c = self.c;
        const x = c.shadowController;
        const subdir = c.config.getString('shadow_subdir') || '.leo_shadow';
        const prefix = c.config.getString('shadow_prefix') || '';
        const filename = 'xyzzy';
        const path = x.shadowPathName(filename);
        const expected = g.os_path_abspath(g.os_path_join(
            g.os_path_dirname(c.fileName()), subdir, prefix + filename)
        );
        assert.strictEqual(path, expected);

    });
    //@+node:felix.20250716010653.1: *4* TestShadow.test_changed_vnodes
    test('test_changed_vnodes', async () => {
        const c = self.c;
        const p = c.p;

        // Create the test node.
        const test_p = p.insertAsLastChild();
        test_p.h = 'test.py';
        test_p.b = g.dedent(`
            def spam():
                pass

            def eggs():
                pass
        `);

        // Define the new contents.
        const new_contents = g.dedent(`
            def spam():
                pass

            def eggs():
                pass  // Changed.
        `);

        // assert.strictEqual(path, expected);

        // Run the test.
        const at = c.atFileCommands;
        await at.readOneAtCleanNode(test_p, new_contents);
        assert.ok(test_p.b === new_contents);
        assert.ok(p.v.isDirty(), p.toString());
        assert.ok(test_p.isDirty(), test_p.toString());

    });
    //@-others

});
//@-others
//@-leo
