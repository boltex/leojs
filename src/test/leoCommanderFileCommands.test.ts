//@+leo-ver=5-thin
//@+node:felix.20230715191150.1: * @file src/test/leoCommanderFileCommands.test.ts
/**
 * Unit tests for Leo's commander file commands.
 */
import * as vscode from 'vscode';
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as os from 'os';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715214226.1: ** suite TestRefreshFromDisk
suite('Test cases for commanderFileCommands.ts', () => {

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
    //@+node:felix.20230715220159.1: *3* TestRefreshFromDisk.test_refresh_from_disk
    test('test_refresh_from_disk', async () => {

        console.log('TODO : test_refresh_from_disk');

        const c = self.c;
        const at = c.atFileCommands;
        const p = c.p;

        /**
         * A version of at.precheck that always returns True.
         */
        const dummy_precheck = (fileName: string, root: any): Promise<boolean> => {
            return Promise.resolve(true);
        };

        at.precheck = dummy_precheck;  // Force all writes.

        // Define data.
        const raw_contents = '"""Test File"""\n';
        const altered_raw_contents = '"""Test File (changed)"""\n';

        // Create a writable directory.
        const directory = os.tmpdir();

        const w_table: [number, string][] = [
            [0, raw_contents],
            [1, altered_raw_contents],
        ];
        // Run the tests.
        for (const kind of ['clean', 'file']) {
            const file_name = `${directory}${path.sep}test_at_${kind}.py`;
            p.h = `@${kind} ${file_name}`;

            let file_contents;

            for (const [pass_number, contents] of w_table) {
                p.b = contents;
                const msg = `${pass_number}, ${kind}`;
                // Create the file (with sentinels for @file).
                if (kind === 'file') {
                    await at.writeOneAtFileNode(p);
                    file_contents = at.outputList.join('');
                } else {
                    file_contents = contents;
                }

                // with open(file_name, 'w') as f:
                // f.write(file_contents)
                const w_writeUri = g.makeVscodeUri(file_name);
                const writeData = g.toEncodedString(file_contents);
                await vscode.workspace.fs.writeFile(w_writeUri, writeData);

                // with open(file_name, 'r') as f:
                // contents2 = f.read()
                const w_uri = g.makeVscodeUri(file_name);
                const s = await vscode.workspace.fs.readFile(w_uri);
                const contents2 = g.toUnicode(s);

                assert.strictEqual(contents2, file_contents, msg);
                await c.refreshFromDisk();
                assert.strictEqual(p.b, contents, msg);
            }

            // Remove the file.
            let w_exists = await g.os_path_exists(file_name);
            assert.ok(w_exists, file_name);
            await g.os_remove(file_name);
            w_exists = await g.os_path_exists(file_name);
            assert.ok(!w_exists, file_name);

        }
    });


    //@-others

});
//@-others
//@-leo
