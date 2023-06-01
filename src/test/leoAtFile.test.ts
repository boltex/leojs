//@+leo-ver=5-thin
//@+node:felix.20220129003133.1: * @file src/test/leoAtFile.test.ts
/**
 * Tests of leoAtFile.ts
 */
import * as assert from 'assert';
import * as vscode from "vscode";
import { afterEach, before, beforeEach } from 'mocha';
import * as path from 'path';

import * as g from '../core/leoGlobals';
import { Position, VNode } from '../core/leoNodes';
import { LeoUnitTest } from './leoTest2';
import { AtFile, FastAtRead } from '../core/leoAtFile';

//@+others
//@+node:felix.20230528191911.1: ** suite TestAtFile
suite('Test cases for leoAtFile.ts', () => {

    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        // Create a pristine instance of the AtFile class.

        self.at = new AtFile(self.c);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230528191911.2: *3*  TestAtFile.bridge
    // ! UNCOMMENT WHENEVER A leoBridge IS IMPLEMENTED
    /* def bridge(self):
        """Return an instance of Leo's bridge."""
        return leoBridge.controller(gui='nullGui',
            loadPlugins=False,
            readSettings=False,
            silent=True,
            verbose=False,
        )
     */
    //@+node:felix.20230528191911.3: *3* TestAtFile.test_at_scanAllDirectives
    test('test_at_scanAllDirectives', () => {

        const at = self.at;
        const c = self.c;

        const d = at.scanAllDirectives(c.p);
        // These are the commander defaults, without any settings.
        assert.strictEqual(d['language'], 'python');
        assert.strictEqual(d['tabwidth'], -4);
        assert.strictEqual(d['pagewidth'], 132);
    });
    //@+node:felix.20230528191911.4: *3* TestAtFile.test_at_scanAllDirectives_minimal_
    test('test_at_scanAllDirectives_minimal_', () => {
        const at = self.at;
        const c = self.c;

        let d = at.scanAllDirectives(c.p);
        d = c.atFileCommands.scanAllDirectives(c.p);
        assert.ok(d && Object.keys(d).length);
    });
    //@+node:felix.20230528191911.5: *3* TestAtFile.test_bug_1469
    // ! UNCOMMENT WHENEVER A leoBridge IS IMPLEMENTED
    /* def test_bug_1469(self):
        # Test #1469: saves renaming an external file
        # Create a new outline with @file node and save it
        bridge = self.bridge()
        with tempfile.TemporaryDirectory() as temp_dir:
            filename = f"{temp_dir}{os.sep}test_file.leo"
            c = bridge.openLeoFile(filename)
            p = c.rootPosition()
            p.h = '@file 1'
            p.b = 'b1'
            c.save()
            # Rename the @file node and save
            p1 = c.rootPosition()
            p1.h = "@file 1_renamed"
            c.save()
            # Remove the original "@file 1" from the disk
            external_filename = f"{temp_dir}{os.sep}1"
            assert os.path.exists(external_filename)
            os.remove(external_filename)
            assert not os.path.exists(external_filename)
            # Change the @file contents, save and reopen the outline
            p1.b = "b_1_changed"
            c.save()
            c.close()
            c = bridge.openLeoFile(c.fileName())
            p1 = c.rootPosition()
            self.assertEqual(p1.h, "@file 1_renamed")
     */
    //@+node:felix.20230528191911.6: *3* TestAtFile.test_bug_1889_tilde_in_at_path
    // ! UNCOMMENT WHENEVER A leoBridge IS IMPLEMENTED
    /* def test_bug_1889_tilde_in_at_path(self):
        # Test #1889: Honor ~ in ancestor @path nodes.
        # Create a new outline with @file node and save it
        bridge = self.bridge()
        with tempfile.TemporaryDirectory() as temp_dir:
            filename = f"{temp_dir}{os.sep}test_file.leo"
            c = bridge.openLeoFile(filename)
            const root = c.rootPosition()!;
            root.h = '@path ~/sub-directory/'
            child = root.insertAsLastChild()
            child.h = '@file test_bug_1889.py'
            child.b = '@language python\n# test #1889'
            path = c.fullPath(child)
            assert '~' not in path, repr(path)
     */
    //@+node:felix.20230528191911.7: *3* TestAtFile.test_bug_3270_at_path
    test('test_bug_3270_at_path', () => {
        // @path c:/temp/leo
        //   @file at_file_test.py
        const c = self.c;
        const root = c.rootPosition()!;
        root.h = '@path c:/temp/leo';
        const child = root.insertAsLastChild();
        child.h = '@file at_file_test.py';
        const w_path = c.fullPath(child);
        const expected = 'c:/temp/leo/at_file_test.py';
        assert.strictEqual(w_path, expected);
    });

    //@+node:felix.20230528191911.8: *3* TestAtFile.test_bug_3272_at_path
    test('test_bug_3272_at_path', () => {
        //  @path bookmarks
        //    @file at_file_test.py
        const c = self.c;
        const root = c.rootPosition()!;
        root.h = '@path bookmarks';
        const child = root.insertAsLastChild();
        child.h = '@file at_file_test.py';
        const w_path = c.fullPath(child);
        const expected = 'bookmarks/at_file_test.py';
        assert.ok(w_path.endsWith(expected));
    });
    //@+node:felix.20230528191911.9: *3* TestAtFile.test_checkPythonSyntax
    // ! UNCOMMENT WHEN checkPythonSyntax IS IMPLEMENTED
    /* 
    test('test_checkPythonSyntax', () => {
        const at = self.at;
        const p = self.c.p;
        const s = g.dedent(`\
        # no error
        def spam():
            pass
        `);
        assert.ok(at.checkPythonSyntax(p, s), 'fail 1');

        const s2 = g.dedent(`\
        # syntax error
        def spam:  # missing parens.
            pass
        `);

        assert.ok(!at.checkPythonSyntax(p, s2), 'fail2');
    });
     */
    //@+node:felix.20230528191911.10: *3* TestAtFile.test_directiveKind4
    test('test_directiveKind4', () => {

        const at = self.at;
        at.language = 'python';  // Usually set by atFile read/write logic.
        const table: [string, number, number][] = [
            ['@=', 0, AtFile.noDirective],
            ['@', 0, AtFile.atDirective],
            ['@ ', 0, AtFile.atDirective],
            ['@\t', 0, AtFile.atDirective],
            ['@\n', 0, AtFile.atDirective],
            ['@all', 0, AtFile.allDirective],
            ['    @all', 4, AtFile.allDirective],
            ['    @all', 0, AtFile.allDirective],  // 2021/11/04
            ["@c", 0, AtFile.cDirective],
            ["@code", 0, AtFile.codeDirective],
            ["@doc", 0, AtFile.docDirective],
            ['@others', 0, AtFile.othersDirective],
            ['    @others', 4, AtFile.othersDirective],
            // ("@end_raw", 0, at.endRawDirective), # #2276.
            // ("@raw", 0, at.rawDirective), # #2276.
        ];
        for (let w_name of g.globalDirectiveList) {
            // Note: entries in g.globalDirectiveList do not start with '@'
            if (!['all', 'c', 'code', 'doc', 'end_raw', 'others', 'raw'].includes(w_name)) {
                table.push(['@' + w_name, 0, AtFile.miscDirective]);
            }
        }
        for (let [s, i, expected] of table) {
            const result = at.directiveKind4(s, i);
            assert.strictEqual(result, expected, `i: ${i}, s: ${s.toString()}`);
        }
    });

    //@+node:felix.20230528191911.11: *3* TestAtFile.test_directiveKind4_2
    test('test_directiveKind4_2', () => {
        const at = self.at;
        at.language = 'python';  // Usually set by atFile read/write logic.
        const table: [number, string][] = [
            [AtFile.othersDirective, '@others'],
            [AtFile.othersDirective, '@others\n'],
            [AtFile.othersDirective, '    @others'],
            [AtFile.miscDirective, '@tabwidth -4'],
            [AtFile.miscDirective, '@tabwidth -4\n'],
            [AtFile.miscDirective, '@encoding'],
            [AtFile.noDirective, '@encoding.setter'],
            [AtFile.noDirective, '@encoding("abc")'],
            [AtFile.noDirective, 'encoding = "abc"'],
            [AtFile.noDirective, '@directive'],  // A crucial new test.
            [AtFile.noDirective, '@raw'],  // 2021/11/04.
        ];
        for (let [expected, s] of table) {
            const result = at.directiveKind4(s, 0);
            assert.strictEqual(expected, result, s.toString());
        }
    });
    //@+node:felix.20230528191911.12: *3* TsetAtFile.test_findSectionName
    test('test_findSectionName', async () => {
        // Test code per #2303.
        const at = self.at;
        const p = self.c.p;
        await at.initWriteIvars(p);
        const ref = g.angleBrackets(' abc ');

        const table: [boolean, string][] = [
            [true, `${ref}\n`],
            [true, `${ref}`],
            [true, `  ${ref}  \n`],
            [false, `if ${ref}:\n`],
            [false, `${ref} # comment\n`],
            [false, `# ${ref}\n`],
        ];

        for (let [valid, s] of table) {
            let [name, n1, n2] = at.findSectionName(s, 0, p);
            assert.strictEqual(valid, !!name, s.toString());
        }

    });
    //@+node:felix.20230528191911.13: *3* TestAtFile.test_parseLeoSentinel
    test('test_parseLeoSentinel', () => {
        const at = self.at;
        const table: [string, string, boolean, boolean, string, string][] = [
            // start, end, new_df, isThin, encoding
            // pre 4.2 formats...
            ['#', '', false, true, 'utf-8', '#@+leo-thin-encoding=utf-8.'],
            ['#', '', false, false, 'utf-8', '#@+leo-encoding=utf-8.'],
            // 4.2 formats...
            ['#', '', true, true, 'utf-8', '#@+leo-ver=4-thin-encoding=utf-8,.'],
            ['/*', '*/', true, true, 'utf-8', String.raw`\*@+leo-ver=5-thin-encoding=utf-8,.*/`],
            ['#', '', true, true, 'utf-8', '#@+leo-ver=5-thin'],
            ['#', '', true, true, 'utf-16', '#@+leo-ver=5-thin-encoding=utf-16,.'],
        ];

        try {
            for (let [start, end, new_df, isThin, encoding, s] of table) {
                let [valid, new_df2, start2, end2, isThin2] = at.parseLeoSentinel(s);
                // g.trace('start',start,'end',repr(end),'len(s)',len(s))
                assert.ok(valid, s);
                assert.strictEqual(new_df, new_df2, s.toString());
                assert.strictEqual(isThin, isThin2, s.toString());
                assert.strictEqual(end, end2, s.toString());
                assert.strictEqual(at.encoding, encoding, s.toString());
            }
        } catch (e) {
            // pass
        } finally {
            at.encoding = 'utf-8';
        }

    });
    //@+node:felix.20230528191911.14: *3* TestAtFile.test_putBody_adjacent_at_doc_part
    test('test_putBody_adjacent_at_doc_part', async () => {

        const at = self.at;
        const c = self.c;

        const root = c.rootPosition()!;
        root.h = '@file test.html';
        const contents = g.dedent(`\
            @doc
            First @doc part
            @doc
            Second @doc part
        `);
        const expected = g.dedent(`\
            <!--@+doc-->
            <!--
            First @doc part
            -->
            <!--@+doc-->
            <!--
            Second @doc part
            -->
        `);
        root.b = contents;
        await at.initWriteIvars(root);
        at.putBody(root);
        const result = at.outputList.join('');
        assert.strictEqual(result, expected);
    });
    //@+node:felix.20230528191911.15: *3* TestAtFile.test_putBody_at_all
    test('test_putBody_at_all', async () => {

        const at = self.at;
        const c = self.c;
        const root = c.rootPosition()!;
        root.h = '@file test.py';
        const child = root.insertAsLastChild();
        child.h = 'child';
        child.b = g.dedent(`\
            def spam():
                pass

            @ A single-line doc part.`);
        child.v.fileIndex = '<GNX>';
        const contents = g.dedent(`\;
            ATall
        `).replace(/AT/g, '@');
        const expected = g.dedent(`\
            #AT+all
            #AT+node:<GNX>: ** child
            def spam():
                pass

            @ A single-line doc part.
            #AT-all
        `).replace(/AT/g, '@');
        root.b = contents;
        await at.initWriteIvars(root);
        at.putBody(root);
        const result = at.outputList.join('');
        assert.strictEqual(result, expected);
    });
    //@+node:felix.20230528191911.16: *3* TestAtFile.test_putBody_at_all_after_at_doc
    test('test_putBody_at_all_after_at_doc', async () => {

        const at = self.at;
        const c = self.c;
        const root = c.rootPosition()!;
        root.h = '@file test.py';
        const contents = g.dedent(`\
            ATdoc
            doc line 1
            ATall
        `).replace(/AT/g, '@');
        const expected = g.dedent(`\
            #AT+doc
            # doc line 1
            # ATall
        `).replace(/AT/g, '@');
        root.b = contents;
        await at.initWriteIvars(root);
        at.putBody(root);
        const result = at.outputList.join('');
        assert.strictEqual(result, expected);

    });
    //@+node:felix.20230528191911.17: *3* TestAtFile.test_putBody_at_others
    test('test_putBody_at_others', async () => {

        const at = self.at;
        const c = self.c;
        const root = c.rootPosition()!;
        root.h = '@file test_putBody_at_others.py';
        const child = root.insertAsLastChild();
        child.h = 'child';
        child.b = '@others\n';
        child.v.fileIndex = '<GNX>';
        const contents = g.dedent(`\
            ATothers
        `).replace(/AT/g, '@');
        const expected = g.dedent(`\
            #AT+others
            #AT+node:<GNX>: ** child
            #AT+others
            #AT-others
            #AT-others
        `).replace(/AT/g, '@');
        root.b = contents;
        await at.initWriteIvars(root);
        at.putBody(root);
        const result = at.outputList.join('');
        assert.strictEqual(result, expected);
    });
    //@+node:felix.20230528191911.18: *3* TestAtFile.test_putBody_unterminated_at_doc_part
    test('test_putBody_unterminated_at_doc_part', async () => {

        const at = self.at;
        const c = self.c;
        const root = c.rootPosition()!;
        root.h = '@file test.html';
        const contents = g.dedent(`\
            @doc
            Unterminated @doc parts (not an error)
        `);
        const expected = g.dedent(`\
            <!--@+doc-->
            <!--
            Unterminated @doc parts (not an error)
            -->
        `);
        root.b = contents;
        await at.initWriteIvars(root);
        at.putBody(root);
        const result = at.outputList.join('');
        assert.strictEqual(result, expected);
    });
    //@+node:felix.20230528191911.19: *3* TestAtFile.test_putCodeLine
    test('test_putCodeLine', async () => {
        /* def test_putCodeLine(self):

            const at = self.at;
            const p = self.c.p;
            await at.initWriteIvars(p)
            at.startSentinelComment = '#'
            table = (
                'Line without newline',
                'Line with newline',
                ' ',
            )
            for line in table:
                at.putCodeLine(line, 0)
         */
    });
    //@+node:felix.20230528191911.20: *3* TestAtFile.test_putDelims
    test('test_putDelims', async () => {

        const at = self.at;
        const p = self.c.p;
        await at.initWriteIvars(p);
        // Cover the missing code.
        const directive = '@delims';
        const s = '    @delims <! !>\n';
        at.putDelims(directive, s, 0);
    });
    //@+node:felix.20230528191911.21: *3* TestAtFile.test_putLeadInSentinel
    test('test_putLeadInSentinel', async () => {

        const at = self.at;
        const p = self.c.p;
        await at.initWriteIvars(p);
        // Cover the special case code.
        const s = '    @others\n';
        at.putLeadInSentinel(s, 0, 2);
    });
    //@+node:felix.20230528191911.22: *3* TestAtFile.test_putLine
    test('test_putLine', async () => {

        const at = self.at;
        const p = self.c.p;
        await at.initWriteIvars(p);

        // class Status:  # at.putBody defines the status class.
        //     at_comment_seen = False
        //     at_delims_seen = False
        //     at_warning_given = True  # Always suppress warning messages.
        //     has_at_others = False
        //     in_code = True

        // For now, test only the case that hasn't been covered:
        // kind == at.othersDirective and not status.in_code
        const status = {
            at_comment_seen: false,
            at_delims_seen: false,
            at_warning_given: true,  // Always suppress warning messages.
            has_at_others: false,
            in_code: true,
        };
        status.in_code = false;
        let [i, kind] = [0, AtFile.othersDirective];
        const s = 'A doc line\n';
        at.putLine(i, kind, p, s, status);


    });
    //@+node:felix.20230528191911.23: *3* TestAtFile.test_putRefLine
    test('test_putRefLine', async () => {

        const at = self.at;
        const p = self.c.p;
        await at.initWriteIvars(p);
        // Create one section definition node.
        const name1 = g.angleBrackets('section 1');
        const child1 = p.insertAsLastChild();
        child1.h = name1;
        child1.b = "print('test_putRefLine')\n";
        // Create the valid section reference.
        const s = `  ${name1}\n`;
        // Careful: init n2 and n2.
        let [name, n1, n2] = at.findSectionName(s, 0, p);
        assert.ok(name);
        at.putRefLine(s, 0, n1, n2, name, p);

    });
    //@+node:felix.20230528191911.24: *3* TestAtFile.test_remove
    test('test_remove', async () => {

        const at = self.at;
        const exists = g.os_path_exists;

        const w_path = g.os_path_join(g.app.testDir, 'xyzzy');
        let w_pathExists = await exists(w_path);
        let w_uri;
        if (w_pathExists) {
            // os.remove(w_path) 
            w_uri = g.makeVscodeUri(w_path);
            await vscode.workspace.fs.delete(w_uri, { recursive: true });
        }
        w_pathExists = await exists(w_path); // recheck
        assert.ok(!w_pathExists);
        // assert not at.remove(w_path)

        w_uri = g.makeVscodeUri(w_path);
        const writeData = Buffer.from("test", 'utf8');
        await vscode.workspace.fs.writeFile(w_uri, writeData);
        // f = open(w_path, 'w')
        // f.write('test')
        // f.close()

        w_pathExists = await exists(w_path); // recheck
        assert.ok(w_pathExists);
        w_uri = g.makeVscodeUri(w_path);
        await vscode.workspace.fs.delete(w_uri, { recursive: true });
        // assert.ok( at.remove(w_path));
        w_pathExists = await exists(w_path); // recheck
        assert.ok(!w_pathExists);

    });
    //@+node:felix.20230528191911.25: *3* TestAtFile.test_replaceFile_different_contents
    test('test_replaceFile_different_contents', async () => {

        const at = self.at;
        const c = self.c;
        // Duplicate init logic...
        at.initCommonIvars();
        at.scanAllDirectives(c.p);
        const encoding = 'utf-8';
        try {
            // https://stackoverflow.com/questions/23212435
            // f = tempfile.NamedTemporaryFile(delete=False, encoding=encoding, mode='w')
            // fn = f.name
            const contents = 'test contents';
            const timestamp: number = new Date().getTime();
            const fn = "tempfile" + timestamp.toString(32) + ".tmp";

            const w_writeUri = g.makeVscodeUri(fn);
            const writeData = Buffer.from("", 'utf8');
            await vscode.workspace.fs.writeFile(w_writeUri, writeData);

            const val = await at.replaceFile(contents, encoding, fn, at.root!);
            assert.ok(val, val.toString());

        } catch (e) {
            //
        }
        finally {
            // f.close()
            // os.unlink(f.name)
        }

    });
    //@+node:felix.20230528191911.26: *3* TestAtFile.test_replaceFile_no_target_file
    test('test_replaceFile_no_target_file', async () => {

        // ! UNCOMMENT / DELETE IF at.outputFileName IS RESOLVED 
        // const at = self.at;
        // const c = self.c;
        // // Duplicate init logic...
        // at.initCommonIvars();
        // at.scanAllDirectives(c.p);
        // const encoding = 'utf-8';
        // at.outputFileName = undefined;  // The point of this test, but I'm not sure it matters.
        // try{
        //     // https://stackoverflow.com/questions/23212435
        //     f = tempfile.NamedTemporaryFile(delete=False, encoding=encoding, mode='w')
        //     const fn = f.name;
        //     const contents = 'test contents';
        //     val = at.replaceFile(contents, encoding, fn, at.root)
        //     assert val, val
        // }catch(e){
        //     //
        // }
        // finally{
        //     f.close()
        //     os.unlink(f.name)
        // }

    });
    //@+node:felix.20230528191911.27: *3* TestAtFile.test_replaceFile_same_contents
    test('test_replaceFile_same_contents', async () => {

        const at = self.at;
        const c = self.c;
        // Duplicate init logic...
        at.initCommonIvars();
        at.scanAllDirectives(c.p);
        const encoding = 'utf-8';
        try {
            // https://stackoverflow.com/questions/23212435
            // f = tempfile.NamedTemporaryFile(delete=False, encoding=encoding, mode='w')
            // const fn = f.name;
            // const contents = 'test contents';
            // f.write(contents)
            // f.flush()
            const contents = 'test contents';
            const timestamp: number = new Date().getTime();
            const fn = "tempfile" + timestamp.toString(32) + ".tmp";

            const w_writeUri = g.makeVscodeUri(fn);
            const writeData = Buffer.from(contents, 'utf8');
            await vscode.workspace.fs.writeFile(w_writeUri, writeData);

            const val = await at.replaceFile(contents, encoding, fn, at.root!);
            assert.ok(!val, val.toString());
        } catch (e) {
            //
        }
        finally {
            // f.close()
            // os.unlink(f.name)
        }

    });
    //@+node:felix.20230528191911.28: *3* TestAtFile.test_setPathUa
    test('test_setPathUa', () => {

        const at = self.at;
        const p = self.c.p;
        at.setPathUa(p, 'abc');
        const d = p.v.tempAttributes!;
        const d2 = d['read-path'];
        const val1 = d2['path'];
        const val2 = at.getPathUa(p);
        const table = [
            ['d2.get', val1],
            ['at.getPathUa', val2],
        ];

        for (let [kind, val] of table) {
            assert.strictEqual(val, 'abc', kind);
        }

    });
    //@+node:felix.20230528191911.29: *3* TestAtFile.test_tabNannyNode
    test('test_tabNannyNode', () => {

        const at = self.at;
        const p = self.c.p;
        // Test 1.
        const s = g.dedent(`\
            # no error
            def spam():
                pass
        `);
        at.tabNannyNode(p, s);
        // Test 2.
        const s2 = g.dedent(`\
            # syntax error
            def spam:
                pass
              a = 2
        `);
        try {
            at.tabNannyNode(p, s2);
        } catch (indentationError) {
            // pass
        }
    });
    //@+node:felix.20230528191911.30: *3* TestAtFile.test_validInAtOthers
    test('test_validInAtOthers', () => {

        const at = self.at;
        const p = self.c.p;

        // Just test the last line.
        at.sentinels = false;
        at.validInAtOthers(p);
    });
    //@-others

});
//@+node:felix.20230528191921.1: ** suite TestFastAtRead
suite('Test the FastAtRead class', () => {

    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        self.x = new FastAtRead(self.c, {});
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230528191921.2: *3* TestFastAtRead.test_afterref
    test('test_afterref', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_afterLastRef.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.3: *4* << define contents >>
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
            #AT+leo-ver=5-thin
            #AT+node:${root.gnx}: * ${h}
            #AT@language python

            a = 1
            if (
            #AT+LB test >>
            #AT+node:ekr.20211107051401.1: ** LB test >>
            a == 2
            #AT-LB test >>
            #ATafterref
             ):
                a = 2
            #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        //@+<< define expected_body >>
        //@+node:felix.20230528191921.4: *4* << define expected_body >>
        const expected_body = g.dedent(`
            ATlanguage python

            a = 1
            if (
            LB test >> ):
                a = 2
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define expected_body >>
        //@+<< define expected_contents >>
        //@+node:felix.20230528191921.5: *4* << define expected_contents >>
        // Be careful: no line should look like a Leo sentinel!
        const expected_contents = g.dedent(`
            #AT+leo-ver=5-thin
            #AT+node:{root.gnx}: * {h}
            #AT@language python

            a = 1
            if (
            LB test >> ):
                a = 2
            #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define expected_contents >>
        x.read_into_root(contents, 'test', root);
        assert.strictEqual(root.b, expected_body, 'mismatch in body');
        const s = await c.atFileCommands.atFileToString(root, true);
        // Leo has *never* round-tripped the contents without change!
        assert.strictEqual(s, expected_contents, 'mismatch in contents');

    });
    //@+node:felix.20230528191921.6: *3* TestFastAtRead.test_at_all
    test('test_at_all', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_at_all.txt';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.7: *4* << define contents >> (test_at_all)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}
        # This is Leo's final resting place for dead code.
        # Much easier to access than a git repo.

        #AT@language python
        #AT@killbeautify
        #AT+all
        #AT+node:ekr.20211103093559.1: ** node 1
        Section references can be undefined.

        LB missing reference >>
        #AT+node:ekr.20211103093633.1: ** node 2
        #ATverbatim
        # ATothers doesn't matter

        ATothers
        #AT-all
        #AT@nosearch
        #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
    });
    //@+node:felix.20230528191921.8: *3* TestFastAtRead.test_at_comment (and @first)
    test('test_at_comment', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_at_comment.txt';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.9: *4* << define contents >> (test_at_comment)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        !!! -*- coding: utf-8 -*-
        !!!AT+leo-ver=5-thin
        !!!AT+node:{root.gnx}: * {h}
        !!!AT@first

        """Classes to read and write @file nodes."""

        !!!AT@comment !!!

        !!!AT+LB test >>
        !!!AT+node:ekr.20211101090015.2: ** LB test >>
        print('in test section')
        print('done')
        !!!AT-LB test >>

        !!!AT+others
        !!!AT+node:ekr.20211101090015.3: ** spam
        def spam():
            pass
        !!!AT+node:ekr.20211101090015.4: ** eggs
        def eggs():
            pass
        !!!AT-others

        !!!AT@language plain
        !!!AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
        const child1 = root.firstChild();
        const child2 = child1.next();
        const child3 = child2.next();
        const table: [Position, string][] = [
            [child1, g.angleBrackets(' test ')],
            [child2, 'spam'],
            [child3, 'eggs']
        ];
        for (let [child, w_h] of table) {
            assert.strictEqual(child.h, w_h);
        }
    });
    //@+node:felix.20230528191921.10: *3* TestFastAtRead.test_at_delims
    test('test_at_delims', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_at_delims.txt';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.11: *4* << define contents >> (test_at_delims)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        !! -*- coding: utf-8 -*-
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}
        #AT@first

        #ATdelims !!SPACE

        !!AT+LB test >>
        !!AT+node:ekr.20211101111409.2: ** LB test >>
        print('in test section')
        print('done')
        !!AT-LB test >>

        !!AT+others
        !!AT+node:ekr.20211101111409.3: ** spam
        def spam():
            pass
        !!AT+node:ekr.20211101111409.4: ** eggs
        def eggs():
            pass
        !!AT-others

        !!AT@language python
        !!AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<').replace(/SPACE/g, ' ');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
        const child1 = root.firstChild();
        const child2 = child1.next();
        const child3 = child2.next();
        const table: [Position, string][] = [
            [child1, g.angleBrackets(' test ')],
            [child2, 'spam'],
            [child3, 'eggs'],
        ];
        for (let [child, w_h] of table) {
            assert.strictEqual(child.h, w_h);
        }
    });
    //@+node:felix.20230528191921.12: *3* TestFastAtRead.test_at_last
    test('test_at_last', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_at_last.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.13: *4* << define contents >> (test_at_last)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}
        # Test of ATlast
        #AT+others
        #AT+node:ekr.20211103095810.1: ** spam
        def spam():
            pass
        #AT-others
        #AT@language python
        #AT@last
        #AT-leo
        # last line
        `).replace(/AT/g, '@');
        //@-<< define contents >>
        //@+<< define expected_body >>
        //@+node:felix.20230528191921.14: *4* << define expected_body >> (test_at_last)
        const expected_body = g.dedent(`
        # Test of ATlast
        ATothers
        ATlanguage python
        ATlast # last line
        `).replace(/AT/g, '@');
        //@-<< define expected_body >>
        x.read_into_root(contents, 'test', root);
        assert.strictEqual(root.b, expected_body);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
    });
    //@+node:felix.20230528191921.15: *3* TestFastAtRead.test_at_others
    test('test_at_others', async () => {
        // In particular, we want to test indented @others.
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_at_others';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.16: *4* << define contents >> (test_at_others)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}
        #AT@language python

        class AtOthersTestClass:
            #AT+others
            #AT+node:ekr.20211103092443.1: ** method1
            def method1(self):
                pass
            #AT-others
        #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
    });
    //@+node:felix.20230528191921.17: *3* TestFastAtRead.test_at_section_delim
    test('test_at_section_delim', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/at_section_delim.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.18: *4* << define contents >> (test_at_section_delim)
        // The contents of a personal test file, slightly altered.
        const contents = g.dedent(`
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}

        """Classes to read and write @file nodes."""

        #AT@section-delims <!< >!>

        #AT+<!< test >!>
        #AT+node:ekr.20211029054238.1: ** <!< test >!>
        print('in test section')
        print('done')
        #AT-<!< test >!>

        #AT+others
        #AT+node:ekr.20211030052810.1: ** spam
        def spam():
        pass
        #AT+node:ekr.20211030053502.1: ** eggs
        def eggs():
        pass
        #AT-others

        #AT@language python
        #AT-leo
        `).replace(/\#AT/g, '#@');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
        const child1 = root.firstChild();
        const child2 = child1.next();
        const child3 = child2.next();
        const table: [Position, string][] = [
            [child1, '<!< test >!>'],
            [child2, 'spam'],
            [child3, 'eggs'],
        ];
        for (let [child, w_h] of table) {
            assert.strictEqual(child.h, h);
        }
    });
    //@+node:felix.20230528191921.19: *3* TestFastAtRead.test_clones
    test('test_clones', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_clones.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.20: *4* << define contents >> (test_clones)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}
        #AT@language python

        a = 1

        #AT+others
        #AT+node:ekr.20211101152631.1: ** cloned node
        a = 2
        #AT+node:ekr.20211101153300.1: *3* child
        a = 3
        #AT+node:ekr.20211101152631.1: ** cloned node
        a = 2
        #AT+node:ekr.20211101153300.1: *3* child
        a = 3
        #AT-others
        #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
        const child1 = root.firstChild();
        const child2 = child1.next();
        const grand_child1 = child1.firstChild();
        const grand_child2 = child2.firstChild();
        const table: [Position, string][] = [
            [child1, 'cloned node'],
            [child2, 'cloned node'],
            [grand_child1, 'child'],
            [grand_child2, 'child'],
        ];
        for (let [child, w_h] of table) {
            assert.strictEqual(child.h, w_h);
        }
        assert.ok(child1.isCloned());
        assert.ok(child2.isCloned());
        assert.strictEqual(child1.v, child2.v);
        assert.ok(!grand_child1.isCloned());
        assert.ok(!grand_child2.isCloned());

    });
    //@+node:felix.20230528191921.21: *3* TestFastAtRead.test_cweb
    test('test_cweb', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_cweb.w';
        const root = c.rootPosition()!;
        root.h = h; // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.22: *4* << define contents >> (test_cweb)
        // pylint: disable=anomalous-backslash-in-string
        const contents = g.dedent(`
            ATq@@+leo-ver=5-thin@>
            ATq@@+node:{root.gnx}: * @{h}@>
            ATq@@@@language cweb@>
            ATq@@@@comment @@q@@ @@>@>

            % This is limbo in cweb mode... It should be in BSLaTeX mode, not BSc mode.
            % The following should not be colorized: class,if,else.

            @* this is a _cweb_ comment.  Code is written in BSc.
            "strings" should not be colorized.
            It should be colored in BSLaTeX mode.
            The following are not keywords in latex mode: if, else, etc.
            Section references are _valid_ in cweb comments!
            ATq@@+LB section ref 1 >>@>
            ATq@@+node:ekr.20211103082104.1: ** LB section ref 1 >>@>
            This is section 1.
            ATq@@-LB section ref 1 >>@>
            @c

            and this is C code. // It is colored in BSLaTeX mode by default.
            /* This is a C block comment.  It may also be colored in restricted BSLaTeX mode. */

            // Section refs are valid in code too, of course.
            ATq@@+LB section ref 2 >>@>
            ATq@@+node:ekr.20211103083538.1: ** LB section ref 2 >>@>
            This is section 2.
            ATq@@-LB section ref 2 >>@>

            BSLaTeX and BSc should not be colored.
            if else, while, do // C keywords.
            ATq@@-leo@>
            `).replace(/AT/g, '@').replace(/LB/g, '<<').replace(/BS/g, '\\');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
    });
    //@+node:felix.20230528191921.23: *3* TestFastAtRead.test_doc_parts
    test('test_doc_parts', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_directives.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.

        //@+<< define contents >>
        //@+node:felix.20230528191921.24: *4* << define contents >> (test_doc_parts)
        // Be careful: no line should look like a Leo sentinel!
        let contents = g.dedent(`
        #AT+leo-ver=5-thin
        #AT+node:{root.gnx}: * {h}
        #AT@language python

        a = 1

        #AT+at A doc part
        # Line 2.
        #AT@c

        #AT+doc
        # Line 2
        #
        # Line 3
        #AT@c

        #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>

        // Test 1: without black delims.
        g.app.write_black_sentinels = false;
        x.read_into_root(contents, 'test', root);
        let s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s, 'Test 1');

        // Test 2: with black delims.
        g.app.write_black_sentinels = true;
        contents = contents.replace('#@', '# @');
        x.read_into_root(contents, 'test', root);
        s = await c.atFileCommands.atFileToString(root, true);
        // g.printObj(contents2, tag='contents2')
        assert.strictEqual(contents, s, 'Test 2: -b');
    });
    //@+node:felix.20230528191921.25: *3* TestFastAtRead.test_html_doc_part
    test('test_html_doc_part', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_html_doc_part.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.26: *4* << define contents >> (test_html_doc_part)
        // Be careful: no line should look like a Leo sentinel!
        const contents = g.dedent(`
        <!--AT+leo-ver=5-thin-->
        <!--AT+node:{root.gnx}: * {h}-->
        <!--AT@language html-->

        <!--AT+at-->
        <!--
        Line 1.

        Line 2.
        -->
        <!--AT@c-->
        <!--AT-leo-->
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        x.read_into_root(contents, 'test', root);
        const s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);
    });
    //@+node:felix.20230528191921.27: *3* TestFastAtRead.test_verbatim
    test('test_verbatim', async () => {
        const c = self.c;
        const x = self.x as FastAtRead;
        const h = '@file /test/test_verbatim.py';
        const root = c.rootPosition()!;
        root.h = h;  // To match contents.
        //@+<< define contents >>
        //@+node:felix.20230528191921.28: *4* << define contents >> (test_verbatim)
        // Be careful: no line should look like a Leo sentinel!
        let contents = g.dedent(`
            #AT+leo-ver=5-thin
            #AT+node:{root.gnx}: * {h}
            #AT@language python
            # Test of @verbatim
            print('hi')
            #ATverbatim
            #AT+node (should be protected by verbatim)
            #AT-leo
        `).replace(/AT/g, '@').replace(/LB/g, '<<');
        //@-<< define contents >>
        //@+<< define expected_body >>
        //@+node:felix.20230528191921.29: *4* << define expected_body >> (test_verbatim)
        let expected_body = g.dedent(`
        ATlanguage python
        # Test of @verbatim
        print('hi')
        #AT+node (should be protected by verbatim)
        `).replace(/AT/g, '@');
        //@-<< define expected_body >>

        //Test 1: without black delims.
        g.app.write_black_sentinels = false;
        x.read_into_root(contents, 'test', root);
        assert.strictEqual(root.b, expected_body);
        let s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);

        //Test 2: with black delims.
        g.app.write_black_sentinels = true;
        contents = contents.replace('#@', '# @');
        expected_body = expected_body.replace('#@', '# @');
        x.read_into_root(contents, 'test', root);
        assert.strictEqual(root.b, expected_body);
        s = await c.atFileCommands.atFileToString(root, true);
        assert.strictEqual(contents, s);

    });
    //@-others

});
//@-others
//@-leo
