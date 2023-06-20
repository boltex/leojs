//@+leo-ver=5-thin
//@+node:felix.20230529171913.1: * @file src/test/test_importers.ts

import * as vscode from 'vscode';
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { Position } from '../core/leoNodes';

//@+others
//@+node:felix.20230529172038.1: ** class BaseTestImporter(LeoUnitTest)
/**
 * The base class for tests of leoImport.py 
 */
export class BaseTestImporter extends LeoUnitTest {


    public ext: string | undefined = undefined;  // Subclasses must set this to the language's extension.
    public treeType = '@file';  // Fix #352.

    public setUp(): void {
        super.setUp();
        g.app.loadManager!.createAllImporterData();
        g.app.write_black_sentinels = false;
    }

    //@+others
    //@+node:felix.20230529172038.2: *3* BaseTestImporter.check_outline (best trace)
    /**
     * BaseTestImporter.check_outline.
     */
    public check_outline(p: Position, expected: [number, string, string][], trace_results = false): [boolean, string] {

        if (trace_results) { // Dump expected results.
            console.log('');
            g.trace('Expected results...');
            for (let [level, h, s] of expected) {
                g.printObj(g.splitLines(s), `level: ${level} ${h}`);
            }
        }
        if (trace_results) { // Dump headlines of actual results.
            this.dump_headlines(p, 'Actual headlines...');
        }
        if (trace_results) { // Dump actual results, including bodies.
            this.dump_tree(p, 'Actual results...');
        }
        // Do the actual tests.
        const p0_level = p.level();
        const actual: [number, string, string][] = [];
        for (let z of p.self_and_subtree()) {
            actual.push([z.level(), z.h, z.b]);
        }
        // actual = [(z.level(), z.h, z.b) for z in p.self_and_subtree()];

        // g.printObj(expected, tag='expected')
        // g.printObj(actual, tag='actual')
        assert.strictEqual(expected.length, actual.length);

        for (const [i, w_actual] of actual.entries()) {
            let a_level = 0;
            let a_h, a_str;
            let e_level = 0;
            let e_h, e_str;
            let msg = "";
            try {
                [a_level, a_h, a_str] = w_actual;
                [e_level, e_h, e_str] = expected[i];
                msg = `FAIL in node ${i} ${e_h}`;
            } catch (valueError) {
                g.printObj(w_actual, `w_actual[${i}]`);
                g.printObj(expected[i], `expected[${i}]`);
                assert.ok(false, `Error unpacking tuple ${i}`);
            }

            assert.strictEqual(a_level - p0_level, e_level, msg);
            if (i > 0) {  // Don't test top-level headline.
                assert.strictEqual(e_h, a_h, msg);
            }

            assert.ok(g.compareArrays(g.splitLines(e_str), g.splitLines(a_str)), msg);

        }

        return [true, 'ok'];

    }
    //@+node:felix.20230529172038.3: *3* BaseTestImporter.check_round_trip
    /**
     * Assert that p's outline is equivalent to s.
     */
    public async check_round_trip(p: Position, s: string, strict_flag = false): Promise<void> {

        const c = this.c;
        s = s.trimEnd();  // Ignore trailing whitespace.
        let result_s = await c.atFileCommands.atAutoToString(p);
        result_s = result_s.trimEnd();  // Ignore trailing whitespace.

        let s_lines: string[];
        let result_lines: string[];

        if (strict_flag) {
            s_lines = g.splitLines(s);
            result_lines = g.splitLines(result_s);
        } else {
            // Ignore leading whitespace and all blank lines.
            s_lines = g.splitLines(s)
                .filter((z: string) => z.trim())
                .map((z: string) => z.trimStart());
            result_lines = g.splitLines(result_s)
                .filter((z: string) => z.trim())
                .map((z: string) => z.trimStart());
        }

        if (!(s_lines.length === result_lines.length && s_lines.every((value, index) => value === result_lines[index]))) {
            g.trace('FAIL', g.caller(2));
            g.printObj(s_lines.map((z, i) => `${i.toString().padEnd(4)} ${z}`), undefined, undefined, `results: ${p.h}`);
            g.printObj(result_lines.map((z, i) => `${i.toString().padEnd(4)} ${z}`), undefined, undefined, `results: ${p.h}`);
        }
        assert.ok(s_lines.length === result_lines.length && s_lines.every((value, index) => value === result_lines[index]));

    }
    //@+node:felix.20230529172038.4: *3* BaseTestImporter.compute_unit_test_kind
    /**
     * Return kind from the given extention.
     */
    public compute_unit_test_kind(ext: string): string {

        const aClass = g.app.classDispatchDict[ext];
        const d: { [key: string]: string } = {
            '.json': '@auto-json',
            '.md': '@auto-md',
            '.org': '@auto-org',
            '.otl': '@auto-otl',
            '.rst': '@auto-rst'
        };
        const kind = d[ext];

        if (kind) {
            return kind;
        }
        if (aClass) {
            const d2 = g.app.atAutoDict;
            for (const z in d2) { // USE 'in' FOR KEY
                if (d2[z] === aClass) {
                    return z;
                }
            }
        }
        return '@file';

    }
    //@+node:felix.20230529172038.5: *3* BaseTestImporter.dedent
    /**
     * Remove common leading whitespace from all lines of s.
     */
    public dedent(s: string): string {
        return g.dedent(s);
    }
    //@+node:felix.20230529172038.6: *3* BaseTestImporter.run_test
    /**
     * Run a unit test of an import scanner,
     * i.e., create a tree from string s at location p.
     */
    public async run_test(s: string, check_flag = true, strict_flag = false): Promise<Position> {

        const c = this.c;
        const ext = this.ext;
        const p = this.c.p;

        assert.ok(ext);

        // Run the test.
        const parent = p.insertAsLastChild();
        const kind = this.compute_unit_test_kind(ext);

        // TODO : CREATE A BETTER parent.h !
        // TestCase.id() has the form leo.unittests.core.file.class.test_name
        // const id_parts = this.id().split('.');
        // this.short_id = `${id_parts[id_parts.length - 2]}.${id_parts[id_parts.length - 1]}`;
        // parent.h = `${kind} ${this.short_id}`;

        parent.h = `${kind} TODO : CREATE A BETTER parent.h`;

        // createOutline calls Importer.gen_lines and Importer.check.
        const test_s = g.dedent(s).trim() + '\n\n';
        await c.importCommands.createOutline(parent.copy(), ext, test_s);

        // Some tests will never pass round-trip tests.
        if (check_flag) {
            await this.check_round_trip(parent, test_s, strict_flag);
        }
        return parent;
    }
    //@-others

}
//@+node:felix.20230529172103.1: ** TODO : All Language-importers!
//@-others
//@-leo
