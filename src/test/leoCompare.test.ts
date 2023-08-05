//@+leo-ver=5-thin
//@+node:felix.20230723005339.1: * @file src/test/leoCompare.test.ts
/**
 * Tests of leoCompare.ts
 */
import * as vscode from "vscode";
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { Position } from '../core/leoNodes';
import { CompareLeoOutlines } from '../core/leoCompare';
import * as path from 'path';
import * as os from 'os';

//@+others
//@+node:felix.20230723005339.2: ** suite TestCompare
suite('Test cases for leoCompare.ts', () => {

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
    //@+node:felix.20230723005339.3: *3* TestCompare.test_diff_marked_nodes
    test('test_diff_marked_nodes', () => {

        // from leo.core.leoCompare import diffMarkedNodes

        // Setup.
        const c = self.c;
        const u = c.undoer;
        const root = c.rootPosition()!;
        root.deleteAllChildren();
        while (root.hasNext()) {
            root.next().doDelete();
        }
        c.selectPosition(root);

        // Create two sets of nodes.
        const node1 = root.insertAsLastChild();
        const node2 = root.insertAsLastChild();
        const child1 = node1.insertAsLastChild();
        const child2 = node2.insertAsLastChild();

        // Mark the nodes.
        node1.setMarked();
        node2.setMarked();

        // Populate the nodes.
        const table: [Position, string, string][] = [
            [node1, 'node 1', '# Node 1.\n'],
            [node2, 'node 1a', '# Node 1.\n'],  // Headlines differ.
            [child1, 'child 1', '# Child 1.\n'],
            [child2, 'child 1', '# Child 1a.\n'],  // Bodies differ.
        ];
        for (const [p, h, b] of table) {
            p.h = h;
            p.b = b;
        }

        assert.strictEqual(0, u.beads.length);  // #3476.
        assert.ok(c.lastTopLevel().__eq__(root));
        assert.strictEqual(0, c.checkOutline());
        // Run the command.
        c.diffMarkedNodes();
        for (let i = 0; i < 3; i++) {
            // #3476.
            assert.strictEqual(1, u.beads.length);
            assert.strictEqual(0, c.checkOutline());
            assert.strictEqual(c.lastTopLevel().h, 'diff marked nodes');
            u.undo();
            assert.strictEqual(0, c.checkOutline());
            assert.ok(c.lastTopLevel().__eq__(root));
            u.redo();
            assert.strictEqual(0, c.checkOutline());
            assert.strictEqual(c.lastTopLevel().h, 'diff marked nodes');
        }

    });
    //@+node:felix.20230723005339.4: *3* TestCompare.test_diff_list_of_files
    test('test_diff_list_of_files', async () => {

        // from leo.core.leoCompare import CompareLeoOutlines

        // Setup.
        const c = self.c;
        const u = c.undoer;
        const x = new CompareLeoOutlines(c);
        const root = c.rootPosition()!;
        root.deleteAllChildren();
        while (root.hasNext()) {
            root.next().doDelete();
        }

        c.selectPosition(root);
        assert.ok(c.lastTopLevel().__eq__(root));

        // The contents of a small .leo file.
        const contents1 = g.dedent(
            `\
            <?xml version="1.0" encoding="utf-8"?>
            <!-- Created by Leo: https://leo-editor.github.io/leo-editor/leo_toc.html -->
            <leo_file xmlns:leo="http://leo-editor.github.io/leo-editor/namespaces/leo-python-editor/1.1" >
            <leo_header file_format="2"/>
            <globals/>
            <preferences/>
            <find_panel_settings/>
            <vnodes>
            <v t="ekr.20230714162224.2"><vh>test_file1.leo</vh></v>
            </vnodes>
            <tnodes>
            <t tx="ekr.20230714162224.2"></t>
            </tnodes>
            </leo_file>
            `
        ).trimStart();  // Leo doesn't tolerate a leading blank line!
        const contents2 = contents1.replace('test_file1.leo', 'test_file2.leo');

        // Create the absolute paths.
        const directory = os.tmpdir(); //tempfile.gettempdir();
        const path1 = g.os_path_normpath(path.join(directory, 'test_file1.leo'));
        const path2 = g.os_path_normpath(path.join(directory, 'test_file2.leo'));
        const paths = [path1, path2];

        // Create two temp .leo files.
        for (const [w_path, contents] of [[path1, contents1], [path2, contents2]]) {


            const w_writeUri = g.makeVscodeUri(w_path);
            const writeData = g.toEncodedString(contents);

            await vscode.workspace.fs.writeFile(w_writeUri, writeData);

            // with open(w_path, 'wb') as f
            //     f.write(g.toEncodedString(contents));

        }
        // Run the command.
        const expected_last_headline = 'diff-leo-files';
        await x.diff_list_of_files(paths);
        assert.strictEqual(c.lastTopLevel().h, expected_last_headline);

        // Test undo and redo.
        u.undo();
        assert.ok(c.lastTopLevel().__eq__(root));
        u.redo();
        assert.strictEqual(c.lastTopLevel().h, expected_last_headline);

        // Remove temporary files.
        for (const w_path of paths) {
            let w_exists = await g.os_path_exists(w_path);
            assert.ok(w_exists, w_path);

            const w_uri = g.makeVscodeUri(w_path);

            await vscode.workspace.fs.delete(w_uri, { recursive: true });
            // os.remove(w_path);

            w_exists = await g.os_path_exists(w_path);
            assert.ok(!w_exists, w_path);
        }
    });
    //@-others

});
//@-others
//@-leo
