//@+leo-ver=5-thin
//@+node:felix.20220129002458.1: * @file src/test/leoGlobals.test.ts
/**
 * Tests of leo.core.leoGlobals
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as os from 'os';
import * as fs from 'fs/promises';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';

//@+others
//@+node:felix.20220129223719.1: ** suite TestGlobals
suite('Tests for leo.core.leoGlobals', () => {
    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(async () => {
        await self.setUpClass();
        self.setUp();
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+<< TestGlobals: declare all data >>
    //@+node:felix.20230724012744.1: *3* << TestGlobals: declare all data >>
    let absolute_paths: string[];
    let error_lines: Record<string, number>;
    let error_messages: Record<string, string[]>;
    let error_patterns: Record<string, RegExp>;
    let error_templates: Record<string, string>;
    let files_data: [string, string][];
    let invalid_unls: string[];
    let tools = ['flake8', 'mypy', 'pyflakes', 'pylint', 'python'];
    let valid_unls: string[];
    let missing_unls: string[];
    //@-<< TestGlobals: declare all data >>
    //@+<< TestGlboals: define unchanging data >>
    //@+node:felix.20230724012750.1: *3* << TestGlboals: define unchanging data >>
    //@+<< define files data >>
    //@+node:felix.20230724012750.2: *4* << define files data >>
    // All these paths appear in @file or @clean nodes in LeoPyRef.leo.

    // kind: @clean, @edit, @file,
    // path: path to an existing file, relative to LeoPyRef.leo (in leo/core].
    files_data = [
        ['@file', 'src/core/decorators.ts'],
        ['@clean', 'src/config.ts'],

        /*
        // The hard case: __init__.py
        ['@file', '../plugins/importers/__init__.py'],
        ['@file', '../plugins/writers/__init__.py'],
        ['@clean', '../plugins/leo_babel/__init__.py'],
        ['@file', '../plugins/editpane/__init__.py'],
        // Other files.
        ['@file', 'leoApp.py'],
        ['@file', '../commands/abbrevCommands.py'],
        ['@edit', '../../launchLeo.py'],
        ['@file', '../external/log_listener.py'],
        ['@file', '../plugins/cursesGui2.py'],
        */
    ];
    //@-<< define files data >>
    //@+<< define error_patterns >>
    //@+node:felix.20230724012750.3: *4* << define error_patterns >>
    // m.group(1) is the filename and m.group(2) is the line number.
    error_patterns = {
        'flake8': g.flake8_pat,     // r'(.+?):([0-9]+):[0-9]+:.*$'
        'mypy': g.mypy_pat,        // r'^(.+?):([0-9]+):\s*(error|note)\s*(.*)\s*$'
        'pyflakes': g.pyflakes_pat, // r'^(.*):([0-9]+):[0-9]+ .*?$'
        'pylint': g.pylint_pat,     // r'^(.*):\s*([0-9]+)[,:]\s*[0-9]+:.*?\(.*\)\s*$'
        'python': g.python_pat,     // r'^\s*File\s+"(.*?)",\s*line\s*([0-9]+)\s*$'
    };
    //@-<< define error_patterns >>
    //@+<< define error_templates >>
    //@+node:felix.20230724012750.4: *4* << define error_templates >>
    // Error message templates.
    error_templates = {
        'flake8': 'FILE:LINE:COL:ERR',
        'mypy': 'FILE:LINE:error ERR',
        'pyflakes': 'FILE:LINE:COL ERR',
        'pylint': 'FILE:LINE:COL: (ERR)',
        'python': 'File "FILE", line LINE',
    };
    //@-<< define error_templates >>
    //@+<< define invalid_unls >>
    //@+node:felix.20230724012750.5: *4* << define invalid_unls >>
    // Syntactically invalid unls.
    invalid_unls = [
        'unl:gnx:xyzzy#.20230622112649.1',  // Missing '//'
        'unl:gnx://xyzzy.20230622112649.1', // Missing '#'
        'unl:gnx//xyzzy#.20230622112649.1', // Missing ':'
        'unl//xyzzy#.20230622112649.1', // Missing ':'
    ];

    //@-<< define invalid_unls >>
    //@+<< define missing_unls >>
    //@+node:felix.20230724012750.6: *4* << define missing_unls >>
    // Define unls with files parts that refer to non-existent files.
    // These should be syntactically valid.
    missing_unls = [
        'unl:gnx://xyzzy#.20230622112649.1',
        'unl://xyzzy#does-->not-->exist',
    ];
    //@-<< define missing_unls >>
    //@+<< define valid_unl_templates >>
    //@+node:felix.20230724012750.7: *4* << define valid_unl_templates >>
    // These links are functional only if on @data unl-path-prefixes contains the proper file part.
    valid_unls = [

        'unl:gnx://#ekr.20180311131424.1',

        // test.leo:Error mssages (copy to log)
        'unl:gnx://#ekr.20230622112649.1',

        // test.leo:Recent
        'unl:gnx://test.leo#ekr.20180311131424.1',
        'unl:gnx://#ekr.20180311131424.1',

        // test.leo: Error mssages (copy to log)
        'unl:gnx://test.leo#ekr.20230622112649.1',
        'unl:gnx://#ekr.20230622112649.1',

        // In LeoDocs.leo: Leo 6.7.3 release notes
        'unl:gnx://LeoDocs.leo#ekr.20230409052507.1',

        // In LeoDocs.leo: ** Read me first **
        'unl:gnx://LeoDocs.leo#ekr.20050831195449',

        // Legacy unls in test.leo.
        'unl://#Coloring tests-->Syntax coloring template',
        'unl://#@file ../plugins/importers/__init__.py',
        'unl://C:/Repos/leo-editor/leo/test/test.leo#@clean ../plugins/leo_babel/__init__.py',
        'unl://#@clean ../plugins/leo_babel/__init__.py',
        'unl://C:/Repos/leo-editor/leo/test/test.leo#Viewrendered examples',
        'unl://#Viewrendered examples',
        'unl://C:/Repos/leo-editor/leo/test/test.leo#Viewrendered examples-->Python code',
        'unl://#Viewrendered examples-->Python code',

        // Absolute file: valid, but can't be resolved in a unit test.
        'unl://C:/Repos/leo-editor/leo/test/test.leo#@file ../plugins/importers/__init__.py',

    ];
    //@-<< define valid_unl_templates >>
    //@-<< TestGlboals: define unchanging data >>

    //@+others
    //@+node:felix.20230724133645.1: *3*  TestGlobals: setup helpers and related tests
    //@+node:felix.20230724133645.2: *4* TestGlobals._define_per_commander_data
    /**
     * Define data that depends on c.
     */
    function _define_per_commander_data() {

        const c = self.c;

        // List of absolute paths in the test data.
        assert.ok(c.fileName);
        // absolute_paths = [
        //     g.os_path_finalize_join(os.path.dirname(c.fileName()), relative_path)
        //         for _, relative_path in self.files_data
        // ]
        absolute_paths = files_data.map(([, relative_path]) => {
            const dirname = g.os_path_dirname(c.fileName()); // Assuming c is the current file object
            const w_result = g.os_path_finalize_join(dirname, relative_path);
            return w_result;
        });

        // The error line for each absolute path. Default all lines to 0.
        error_lines = {};
        for (const z of absolute_paths) {
            error_lines[z] = 0;
        }
        // Error messages for every tool and every absolute path.
        error_messages = {};
        for (const tool of tools) {
            error_messages[tool] = [];
            for (const w_path of absolute_paths) {
                const template = error_templates[tool];
                error_messages[tool].push(
                    template.replace(/FILE/g, w_path)
                        .replace(/LINE/g, '1')
                        .replace(/COL/g, `${error_lines[w_path]}`)
                        .replace(/ERR/g, `${tool} error`)
                );
            }
        }
    }
    //@+node:felix.20230724133645.3: *4* TestGlobals._test_per_commander_data
    /**
     * Test the test data.
     */
    async function _test_per_commander_data(): Promise<void> {

        const c = self.c;
        // All dicts must have the same keys.
        for (const d of [error_messages, error_patterns, error_templates]) {
            assert.ok(g.compareArrays(tools, Object.keys(d).sort()));
        }
        // Pretest: all absolute paths must exist.
        for (const z of absolute_paths) {
            const w_exists = await g.os_path_exists(z);
            assert.ok(w_exists, z.toString());
        }
        // Pretest: all generated error messages must match the tool's pattern.
        for (const tool of tools) {
            const pattern = error_patterns[tool];
            const messages = error_messages[tool];
            for (const message of messages) {
                assert.ok(message.match(pattern),
                    'Error message does not match error pattern:\n' +
                    `    tool: ${tool}\n` +
                    ` message: ${message}\n` +
                    ` pattern: ${pattern}`
                );
            }
        }
        // More tests...
        for (const data of files_data) {// <@file> <filename>
            const [kind, relative_path] = data;
            const msg = `${kind} ${relative_path}`;
            const headline = msg;
            const absolute_path = g.os_path_finalize_join(g.app.loadDir!, relative_path);
            assert.ok(absolute_paths.includes(absolute_path), msg);
            const w_exists = await g.os_path_exists(absolute_path);
            assert.ok(w_exists, msg);
            _make_tree(c, headline);
            const test_p = g.findNodeAnywhere(c, headline);
            const full_path = c.fullPath(test_p!);
            assert.strictEqual(full_path, absolute_path, msg);
            assert.ok(test_p, msg);
        }

    }
    //@+node:felix.20230724133645.4: *4* TestGlobals._make_tree
    /**
     * Make a test tree for c.
     */
    function _make_tree(c: Commands, root_h?: string) {

        // c = self.c
        const root = c.rootPosition()!;
        root.h = root_h || 'Root';
        root.b = "def root():\n    pass\n";
        let last = root;

        function make_child(n: number, p: Position) {
            const p2 = p.insertAsLastChild();
            p2.h = `child ${n}`;
            p2.b = `def child${n}():\n` +
                `    v4{n} = 2\n` +
                `    # node ${n} line 1: blabla second blabla bla second ble blu\n` +
                `    # node ${n} line 2: blabla second blabla bla second ble blu`;
            return p2;
        }
        function make_top(n: number, sib: Position) {
            const p = sib.insertAfter();
            p.h = `Node ${n}`;
            p.b =
                `def top${n}():\n:` +
                `    v${n} = 3\n`;
            return p;
        }

        for (let n = 0; n < 4; n += 3) {
            last = make_top(n + 1, last);
            const child = make_child(n + 2, last);
            make_child(n + 3, child);
        }

        for (const p of c.all_positions()) {
            p.v.clearDirty();
            p.v.clearVisited();
        }

        // Always start with the root selected.
        c.selectPosition(c.rootPosition()!);

    }
    //@+node:felix.20230724133645.5: *4* TestGlobals._patch_at_data_unl_path_prefixes
    /**
     * Create a new outline, linked into g.app.windowList.
     *
     * Patch @data unl-path-prefixes so that g.findAnyUnl will find nodes in
     * the new commander.
     *
     * Return the commander for the new outline.
     */
    function _patch_at_data_unl_path_prefixes() {

        // from leo.core.leoCommands import Commands
        const c = self.c;
        const c1 = self.c;

        // Create the new commander, linked into g.app.windowList.
        const c2 = new Commands("", g.app.gui);
        assert.ok(c2.frame);
        g.app.windowList.push(c1.frame);
        g.app.windowList.push(c2.frame);

        // Give both commanders new (non-existent) names.
        const c1_name = 'test_outline1.leo';
        const c2_name = 'test_outline2.leo';
        const directory = g.os_path_dirname(c.fileName());
        c.mFileName = g.os_path_normpath(g.os_path_join(directory, c1_name));
        c2.mFileName = g.os_path_normpath(g.os_path_join(directory, c2_name));
        assert.ok(c1_name, g.os_path_basename(c.fileName()));
        assert.ok(c2_name, g.os_path_basename(c2.fileName()));

        function make_line(c: Commands) {
            const file_name = c.fileName();
            const key = g.os_path_basename(file_name);
            // Values must be directories.
            const value = g.os_path_normpath(g.os_path_dirname(file_name));
            // print(f"{key:17} {value}")
            return `${key}: ${value}`;
        }

        // Init the @data unl-path-prefixes.

        // lines = [make_line(z) for z in (c, c2)]
        const lines = [c, c2].map((z) => make_line(z));

        self._set_setting(c, 'data', 'unl-path-prefixes', lines);
        const lines2 = c.config.getData('unl-path-prefixes');
        assert.ok(g.compareArrays(lines.sort(), lines2.sort()));
        const d = g.parsePathData(c);
        if (0) {
            console.log('');
            g.printObj(d);
        }

        return c2;

    }
    //@+node:felix.20230724133645.6: *4* TestGlobals.test_per_commander_data
    test('test_per_commander_data', async () => {
        // Test the data only here.
        _define_per_commander_data();
        await _test_per_commander_data();
    });

    //@+node:felix.20230724133645.7: *4* TestGlobals.test_patch_at_data_unl_path_prefixes
    test('test_patch_at_data_unl_path_prefixes', () => {
        // Test the helper, _patch_at_data_unl_path_prefixes.
        const c1 = self.c;
        const c2 = _patch_at_data_unl_path_prefixes();
        assert.ok(c2);
        assert.ok(c1.fileName());
        assert.ok(c2.fileName());
        assert.ok(c1 !== c2);
        assert.ok(g.app.commanders().includes(c1));
        assert.ok(g.app.commanders().includes(c2));
        assert.ok(g.app.windowList.includes(c1.frame));
        assert.ok(g.app.windowList.includes(c2.frame));

    });
    //@+node:felix.20230724012019.1: *3* legacy tests
    //@+node:felix.20220129223719.2: *4* TestGlobals.test_getLastTracebackFileAndLineNumber
    /* def test_getLastTracebackFileAndLineNumber(self):
        try:
            assert False
        except AssertionError:
            fn, n = g.getLastTracebackFileAndLineNumber()
        self.assertEqual(fn, __file__)

     */
    //@+node:felix.20220129223719.3: *4* TestGlobals.test_g_checkVersion
    /* def test_g_checkVersion(self):
        # for condition in ('<','<=','>','>='):
        for v1, condition, v2 in (
            ('8.4.12', '>', '8.4.3'),
            ('1', '==', '1.0'),
            ('2', '>', '1'),
            ('1.2', '>', '1'),
            ('2', '>', '1.2.3'),
            ('1.2.3', '<', '2'),
            ('1', '<', '1.1'),
        ):
            assert g.CheckVersion(v1, v2, condition=condition, trace=False)
     */
    //@+node:felix.20220129223719.4: *4* TestGlobals.test_g_CheckVersionToInt
    /* def test_g_CheckVersionToInt(self):
        self.assertEqual(g.CheckVersionToInt('12'), 12)
        self.assertEqual(g.CheckVersionToInt('2a5'), 2)
        self.assertEqual(g.CheckVersionToInt('b2'), 0)
     */
    //@+node:felix.20220129223719.5: *4* TestGlobals.test_g_comment_delims_from_extension

    test('test_g_comment_delims_from_extension', () => {
        // New in Leo 4.6, set_delims_from_language returns '' instead of None.
        const table: [string, string[]][] = [
            ['.c', ['//', '/*', '*/']], // escaped
            ['.html', ['', '<!--', '-->']],
            ['.py', ['#', '', '']],
            ['.Globals', ['', '', '']],
        ];

        let ext: string;
        let expected: string[];

        for ([ext, expected] of table) {
            const result = g.comment_delims_from_extension(ext);
            assert.strictEqual(
                JSON.stringify(result),
                JSON.stringify(expected),
                ext.toString()
            );
        }
    });
    //@+node:felix.20220129223719.6: *4* TestGlobals.test_g_convertPythonIndexToRowCol
    test('test_g_convertPythonIndexToRowCol', () => {
        const s1 = 'abc\n\np\nxy';
        const table1: [number, [number, number]][] = [
            [-1, [0, 0]], // One too small.
            [0, [0, 0]],
            [1, [0, 1]],
            [2, [0, 2]],
            [3, [0, 3]], // The newline ends a row.
            [4, [1, 0]],
            [5, [2, 0]],
            [6, [2, 1]],
            [7, [3, 0]],
            [8, [3, 1]],
            [9, [3, 2]], // One too many.
            [10, [3, 2]], // Two too many.
        ];

        const s2 = 'abc\n\np\nxy\n';
        const table2: [number, [number, number]][] = [
            [9, [3, 2]],
            [10, [4, 0]], // One too many.
            [11, [4, 0]], // Two too many.
        ];

        const s3 = 'ab'; // Test special case.  This was the cause of off-by-one problems.
        const table3: [number, [number, number]][] = [
            [-1, [0, 0]], // One too small.
            [0, [0, 0]],
            [1, [0, 1]],
            [2, [0, 2]], // One too many.
            [3, [0, 2]], // Two too many.
        ];

        let n: number;
        let s: string;
        let table: [number, [number, number]][];
        let i: number;
        let result: [number, number];
        let row;
        let col;

        const outerTable: [number, string, [number, [number, number]][]][] = [
            [1, s1, table1],
            [2, s2, table2],
            [3, s3, table3],
        ];

        for ([n, s, table] of outerTable) {
            for ([i, result] of table) {
                [row, col] = g.convertPythonIndexToRowCol(s, i);
                assert.strictEqual(
                    row,
                    result[0],
                    `row: ${row} r0: ${result[0]} n: ${n}, i: ${i}`
                );
                assert.strictEqual(
                    col,
                    result[1],
                    `col: ${col} r1: ${result[1]} n: ${n}, i: ${i}`
                );
            }
        }
    });

    //@+node:felix.20220129223719.7: *4* TestGlobals.test_g_convertRowColToPythonIndex
    test('test_g_convertRowColToPythonIndex', () => {
        const s1: string = 'abc\n\np\nxy';
        const s2: string = 'abc\n\np\nxy\n';
        const table1: [number, [number, number]][] = [
            [0, [-1, 0]], // One too small.
            [0, [0, 0]],
            [1, [0, 1]],
            [2, [0, 2]],
            [3, [0, 3]], // The newline ends a row.
            [4, [1, 0]],
            [5, [2, 0]],
            [6, [2, 1]],
            [7, [3, 0]],
            [8, [3, 1]],
            [9, [3, 2]], // One too large.
        ];
        const table2: [number, [number, number]][] = [
            [9, [3, 2]],
            [10, [4, 0]], // One two many.
        ];

        let s: string;
        let table: [number, [number, number]][];
        let i: number;
        let result: number;
        let row;
        let col;
        let data: [number, number];

        let outerTable: [string, [number, [number, number]][]][] = [
            [s1, table1],
            [s2, table2],
        ];

        for ([s, table] of outerTable) {
            for ([i, data] of table) {
                [row, col] = data;
                result = g.convertRowColToPythonIndex(s, row, col);
                assert.strictEqual(
                    i,
                    result,
                    `row: ${row}, col: ${col}, i: ${i}`
                );
            }
        }
    });

    //@+node:felix.20220129223719.8: *4* TestGlobals.test_g_create_temp_file
    /* def test_g_create_temp_file(self):
        theFile = None
        try:
            theFile, fn = g.create_temp_file()
            assert theFile
            assert isinstance(fn, str)
        finally:
            if theFile:
                theFile.close()
     */

    //@+node:felix.20220129223719.9: *4* TestGlobals.test_g_ensureLeadingNewlines
    test('test_g_ensureLeadingNewlines', () => {
        const s = ' \n \n\t\naa bc';
        const s2 = 'aa bc';
        for (let i of [0, 1, 2, 3]) {
            const result = g.ensureLeadingNewlines(s, i);
            const val = '\n'.repeat(i) + s2;
            assert.strictEqual(result, val);
        }
    });
    //@+node:felix.20220129223719.10: *4* TestGlobals.test_g_ensureTrailingNewlines
    test('test_g_ensureTrailingNewlines', () => {
        const s = 'aa bc \n \n\t\n';
        const s2 = 'aa bc';
        for (let i of [0, 1, 2, 3]) {
            const result = g.ensureTrailingNewlines(s, i);
            const val = s2 + '\n'.repeat(i);
            assert.strictEqual(result, val);
        }
    });
    //@+node:felix.20230423154801.1: *4* TestGlobals.test_g_finalize
    test('test_g_finalize', () => {
        // This is also a strong test of g.finalize.

        // import os
        const c = self.c;

        const normslashes = g.os_path_normslashes;

        // Setup environment.
        const expected_leo_base = g.isWindows ? 'C:/leo_base' : '/leo_base';
        c.mFileName = '/leo_base/test.leo';

        // Note: These directories do *not* have to exist.
        // os.environ = {
        //     'HOME': '/home',  # Linux.
        //     'USERPROFILE': normslashes(r'c:/Whatever'),  # Windows.
        //     'LEO_BASE': expected_leo_base,
        // }
        // SETTING FAKE ENV VARS
        process.env.HOME = '/home'; // Linux
        process.env.USERPROFILE = normslashes('c:/Whatever'); // Windows
        process.env.LEO_BASE = expected_leo_base; // Set the value based on your requirement

        // curdir = normslashes(os.getcwd())
        const curdir = normslashes(process.cwd());

        // home = normslashes(os.path.expanduser('~'))
        const home = normslashes(os.homedir());

        // assert.ok([os_environ['HOME'], os_environ['USERPROFILE']].includes(home), home.toString());
        assert.ok(
            [process.env.HOME, process.env.USERPROFILE].includes(home),
            home.toString()
        );

        const seps = g.isWindows ? ['\\', '/'] : ['/'];
        for (const sep of seps) {
            const table = [
                // The most basic test. The *only* reasonable base is os.getcwd().
                ['basic.py', `${curdir}/basic.py`],
                [`~${sep}a.py`, `${home}/a.py`],
                [`~${sep}x${sep}..${sep}b.py`, `${home}/b.py`],
                [`$LEO_BASE${sep}c.py`, `${expected_leo_base}/c.py`],
            ];
            for (let [arg, expected] of table) {
                let got = g.finalize(arg);
                // Weird: the case is wrong whatever the case of expected_leo_base!
                if (g.isWindows) {
                    expected = expected.replace(/C:/g, 'c:');
                    got = got.replace(/C:/g, 'c:');
                }
                assert.strictEqual(expected, got);
            }
        }
    });

    //@+node:felix.20230423154806.1: *4* TestGlobals.test_g_finalize_join
    test('test_g_finalize_join', () => {
        // This is also a strong test of g.finalize.

        // import os
        const c = self.c;

        const normslashes = g.os_path_normslashes;

        // Setup environment.
        const expected_leo_base = g.isWindows ? 'C:/leo_base' : '/leo_base';
        c.mFileName = '/leo_base/test.leo';

        // Note: These directories do *not* have to exist.
        // os.environ = {
        //     'HOME': '/home',  // Linux.
        //     'USERPROFILE': normslashes(r'c:/Whatever'),  // Windows.
        //     'LEO_BASE': expected_leo_base,
        // }
        // SETTING FAKE ENV VARS
        process.env.HOME = '/home'; // Linux
        process.env.USERPROFILE = normslashes('c:/Whatever'); // Windows
        process.env.LEO_BASE = expected_leo_base; // Set the value based on your requirement

        // curdir = normslashes(os.getcwd())
        const curdir = normslashes(process.cwd());

        // home = normslashes(os.path.expanduser('~'))
        const home = normslashes(os.homedir());

        // assert.ok([os_environ['HOME'], os_environ['USERPROFILE']].includes(home), home.toString());
        assert.ok(
            [process.env.HOME, process.env.USERPROFILE].includes(home),
            home.toString()
        );

        const seps = g.isWindows ? ['\\', '/'] : ['/'];
        for (const sep of seps) {
            const table: [string[], string][] = [
                // The most basic test. The *only* reasonable base is os.getcwd().
                [['basic.py'], `${curdir}/basic.py`],
                // One element in *args...
                [[`~${sep}a.py`], `${home}/a.py`],
                [[`~${sep}x${sep}..${sep}b.py`], `${home}/b.py`],
                [[`$LEO_BASE${sep}c.py`], `${expected_leo_base}/c.py`],
                // Two elements in *args...
                [['~', 'w.py'], `${home}/w.py`],
                [['$LEO_BASE', 'x.py'], `${expected_leo_base}/x.py`],
                // Strange cases...
                [['~', '~', 's1.py'], `${home}/s1.py`],
                [[`~${sep}b`, '~', 's2.py'], `${home}/s2.py`],
                [['~', `~${sep}b`, 's3.py'], `${home}/b/s3.py`],
                [['$LEO_BASE', '~', 's4.py'], `${home}/s4.py`],
                [['~', '$LEO_BASE', 's5.py'], `${expected_leo_base}/s5.py`],
                // More strange cases.
                [['~', 'xxx.py', '~', 's6.py'], `${home}/s6.py`],
                [['yyy', '~'], `${home}`],
                [['zzz', '$LEO_BASE'], `${expected_leo_base}`],
                [['${LEO_BASE}b'], `${expected_leo_base}b`],

                // This goes beyond the limits of what Windows can do.
                // (('a${LEO_BASE}b',),                f"a{expected_leo_base}b"),
            ];

            for (let [args, expected] of table) {
                let got = g.finalize_join(...args);
                // Weird: the case is wrong whatever the case of expected_leo_base!
                if (g.isWindows) {
                    expected = expected.replace(/C:/g, 'c:');
                    got = got.replace(/C:/g, 'c:');
                }
                assert.strictEqual(expected, got);
            }
        }
    });
    //@+node:felix.20220129223719.11: *4* TestGlobals.test_g_find_word
    test('test_g_find_word', () => {
        const table: [string, string, number, number][] = [
            ['abc a bc x', 'bc', 0, 6],
            ['abc a bc x', 'bc', 1, 6],
            ['abc a bc xssdfskdjfhskjdfhskjdf', 'bc', 1, 6],
            ['abc a x', 'bc', 0, -1],
            [' bc', 'bc', 0, 1],
        ];
        let s: string;
        let word: string;
        let i: number;
        let expected: number;
        for ([s, word, i, expected] of table) {
            const actual = g.find_word(s, word, i);
            assert.strictEqual(actual, expected);
        }
    });
    //@+node:felix.20220129223719.12: *4* TestGlobals.test_g_fullPath
    test('test_g_fullPath', () => {
        const c = self.c;

        const child = c.rootPosition()!.insertAfter();
        child.h = '@path abc';
        const grand = child.insertAsLastChild();
        grand.h = 'xyz';

        const w_path = g.fullPath(c, grand, true);
        const end = g.os_path_normpath('abc/xyz');

        assert.ok(w_path.endsWith(end), w_path.toString());
    });
    //@+node:felix.20220129223719.13: *4* TestGlobals.test_g_get_directives_dict
    test('test_g_get_directives_dict', () => {
        const c = self.c;
        const p = c.p;

        p.b = g.dedent(`\
            ATlanguage python
            ATcomment a b c
            ATtabwidth -8
            ATpagewidth 72
            ATencoding utf-8
    `).replace(/AT/g, '@');

        const d = g.get_directives_dict(p);
        assert.strictEqual(d['language'], 'python');
        assert.strictEqual(d['tabwidth'], '-8');
        assert.strictEqual(d['pagewidth'], '72');
        assert.strictEqual(d['encoding'], 'utf-8');
        assert.strictEqual(d['comment'], 'a b c');
        assert.ok(!d['path'], d['path']);
    });
    //@+node:felix.20220129223719.14: *4* TestGlobals.test_g_getDocString
    test('test_g_getDocString', () => {

        // ! TODO : ADD MORE TESTS FOR JAVASCRIPT DOCSTRINGS: JSDOC STRINGS !!
        // ! TODO : CHECK IF LANGUAGE IS TYPESCRIPT AND GET FIRST JSDOC STRING
        // ! see https://jsdoc.app/about-getting-started.html 

        let s1 = 'no docstring';
        let s2 = g.dedent(`\
    # comment
    """docstring2."""
    `);
        let s3 = g.dedent(`\
    """docstring3."""
    \'\'\'docstring2.\'\'\'
    `);
        const table = [
            [s1, ''],
            [s2, 'docstring2.'],
            [s3, 'docstring3.'],
        ];
        let s;
        let result;
        for ([s, result] of table) {
            s2 = g.getDocString(s);
            assert.strictEqual(s2, result);
        }
    });
    //@+node:felix.20220129223719.15: *4* TestGlobals.test_g_getLine
    test('test_g_getLine', () => {
        const s: string = 'a\ncd\n\ne';
        const table: [number, [number, number]][] = [
            [-1, [0, 2]], // One too few.
            [0, [0, 2]],
            [1, [0, 2]],
            [2, [2, 5]],
            [3, [2, 5]],
            [4, [2, 5]],
            [5, [5, 6]],
            [6, [6, 7]],
            [7, [6, 7]], // One too many.
        ];

        table.forEach((element) => {
            let i: number;
            let result: [number, number];
            [i, result] = element;
            let j: number;
            let k: number;
            [j, k] = g.getLine(s, i);
            assert.deepStrictEqual([j, k], result, `i: ${i}, j: ${j}, k: ${k}`);
        });
    });

    //@+node:felix.20220129223719.16: *4* TestGlobals.test_g_getWord
    test('test_g_getWord', () => {
        const s = 'abc xy_z5 pdq';
        let i: number;
        let j: number;
        [i, j] = g.getWord(s, 5);
        assert.strictEqual(s.substring(i, j), 'xy_z5');
    });

    //@+node:felix.20220129223719.17: *4* TestGlobals.test_g_guessExternalEditor
    /* def test_g_guessExternalEditor(self):
        c = self.c
        val = g.guessExternalEditor(c)
        assert val, 'no val'  # This can be different on different platforms.
     */
    //@+node:felix.20220129223719.18: *4* TestGlobals.test_g_handleUrl
    /* def test_g_handleUrl(self):
        c = self.c
        if sys.platform.startswith('win'):
            file_, http, unl1 = 'file://', 'http://', 'unl:' + '//'
            fn1 = 'LeoDocs.leo#'
            fn2 = 'doc/LeoDocs.leo#'
            unl2 = '@settings-->Plugins-->wikiview plugin'
            unl3 = '@settings-->Plugins-->wikiview%20plugin'
            table = (
                (http + 'writemonkey.com/index.php', ['browser']),
                (file_ + 'x.py', ['os_startfile']),
                (file_ + fn1, ['g.recursiveUNLSearch']),
                (file_ + fn2, ['g.recursiveUNLSearch']),
                (unl1 + fn1 + unl2, ['g.recursiveUNLSearch']),
                (unl1 + fn1 + unl3, ['g.recursiveUNLSearch']),
                (unl1 + '#' + unl2, ['g.recursiveUNLSearch']),
                (unl1 + '#' + unl3, ['g.recursiveUNLSearch']),
                (unl1 + unl2, ['g.recursiveUNLSearch']),
                (unl1 + unl3, ['g.recursiveUNLSearch']),
            )
            for url, aList in table:
                g.handleUrl(c=c, p=c.p, url=url)
     */
    //@+node:felix.20220129223719.19: *4* TestGlobals.test_g_import_module
    /* def test_g_import_module(self):
        assert g.import_module('leo.core.leoAst')
            # Top-level .py file.
     */
    //@+node:felix.20220129223719.20: *4* TestGlobals.test_g_isDirective
    test('test_g_isDirective', () => {
        const table: [boolean, string][] = [
            [true, '@language python\n'],
            [true, '@tabwidth -4 #test\n'],
            [true, '@others\n'],
            [true, '    @others\n'],
            [true, '@encoding\n'],
            [false, '@encoding.setter\n'],
            [false, '@encoding("abc")\n'],
            [false, 'encoding = "abc"\n'],
        ];

        table.forEach((element) => {
            let expected: boolean;
            let s: string;
            [expected, s] = element;
            const result = g.isDirective(s);
            assert.strictEqual(expected, !!result, s);
        });
    });

    //@+node:felix.20220129223719.21: *4* TestGlobals.test_g_match_word
    test('test_g_match_word', () => {
        const table: [boolean, number, string, string][] = [
            [true, 0, 'a', 'a'],
            [false, 0, 'a', 'b'],
            [true, 0, 'a', 'a b'],
            [false, 1, 'a', 'aa b'], // Tests bug fixed 2017/06/01.
            [false, 1, 'a', '_a b'],
            [false, 0, 'a', 'aw b'],
            [false, 0, 'a', 'a_'],
            [true, 2, 'a', 'b a c'],
            [false, 0, 'a', 'b a c'],
        ];

        table.forEach((element) => {
            let expected: boolean;
            let i: number;
            let word: string;
            let line: string;
            [expected, i, word, line] = element;
            const got = g.match_word(line + '\n', i, word);
            assert.strictEqual(expected, got);
        });
    });

    //@+node:felix.20220129223719.22: *4* TestGlobals.test_g_os_path_finalize_join_with_thumb_drive
    /* def test_g_os_path_finalize_join_with_thumb_drive(self):
        path1 = r'C:\Python32\Lib\site-packages\leo-editor\leo\core'
        path2 = r'\N:Home\PTC_Creo\Creo.wmv'
        path3 = r'N:\Home\PTC_Creo\Creo.wmv'
        path12 = os.path.join(path1, path2)
        path13 = os.path.join(path1, path3)
        if 0:
            print(path12, g.os.path.abspath(path12))
            print(path13, g.os.path.abspath(path13))
     */
    //@+node:felix.20220129223719.23: *4* TestGlobals.test_g_removeBlankLines
    test('test_g_removeBlankLines', () => {
        let s: string;
        let expected: string;
        const table = [
            ['a\nb', 'a\nb'],
            ['\n  \n\nb\n', 'b\n'],
            [' \t \n\n  \n c\n\t\n', ' c\n'],
        ];
        for ([s, expected] of table) {
            const result = g.removeBlankLines(s);
            assert.strictEqual(result, expected, s.toString());
        }
    });
    //@+node:felix.20220129223719.24: *4* TestGlobals.test_g_removeLeadingBlankLines
    test('test_g_removeLeadingBlankLines', () => {
        let s: string;
        let expected: string;
        const table = [
            ['a\nb', 'a\nb'],
            ['\n  \nb\n', 'b\n'],
            [' \t \n\n\n c', ' c'],
        ];
        for ([s, expected] of table) {
            const result = g.removeLeadingBlankLines(s);
            assert.strictEqual(result, expected, s.toString());
        }
    });
    //@+node:felix.20220129223719.25: *4* TestGlobals.test_g_removeTrailing
    test('test_g_removeTrailing', () => {
        let s: string = 'aa bc \n \n\t\n';
        const table = [
            ['\t\n ', 'aa bc'],
            ['abc\t\n ', ''],
            ['c\t\n ', 'aa b'],
        ];
        let arg;
        let val;
        for ([arg, val] of table) {
            const result = g.removeTrailing(s, arg);
            assert.strictEqual(result, val);
        }
    });
    //@+node:felix.20220129223719.26: *4* TestGlobals.test_g_sanitize_filename
    test('test_g_sanitize_filename', () => {
        const table = [
            ['A25&()', 'A'], // Non-alpha characters.
            ['B\tc', 'B c'], // Tabs.
            ['"AB"', "'AB'"], // Double quotes.
            ['\\/:|<>*:.', '_'], // Special characters.
            ['_____________', '_'], // Combining underscores.
            ['A'.repeat(200), 'A'.repeat(128)], // Maximum length.
            ['abc.', 'abc_'], // Trailing dots.
        ];
        let s;
        let expected;
        let got;
        for ([s, expected] of table) {
            got = g.sanitize_filename(s);
            assert.strictEqual(got, expected, s.toString());
        }
    });
    /* def test_g_sanitize_filename(self):
        table = (
            ('A25&()', 'A'),  # Non-alpha characters.
            ('B\tc', 'B c'),  # Tabs.
            ('"AB"', "'AB'"),  # Double quotes.
            ('\\/:|<>*:.', '_'),  # Special characters.
            ('_____________', '_'),  # Combining underscores.
            ('A' * 200, 'A' * 128),  # Maximum length.
            ('abc.', 'abc_'),  # Trailing dots.
        )
        for s, expected in table:
            got = g.sanitize_filename(s)
            self.assertEqual(got, expected, msg=repr(s))
     */
    //@+node:felix.20220129223719.27: *4* TestGlobals.test_g_scanAtHeaderDirectives_header
    test('test_g_scanAtHeaderDirectives_header', () => {
        const c = self.c;
        const aList = g.get_directives_dict_list(c.p);
        g.scanAtHeaderDirectives(aList); // ? Same as no-neader ?
    });
    //@+node:felix.20220129223719.28: *4* TestGlobals.test_g_scanAtHeaderDirectives_noheader
    test('test_g_scanAtHeaderDirectives_noheader', () => {
        const c = self.c;
        const aList = g.get_directives_dict_list(c.p);
        g.scanAtHeaderDirectives(aList); // ? Same as header ?
    });
    //@+node:felix.20220129223719.29: *4* TestGlobals.test_g_scanAtLineendingDirectives_cr
    test('test_g_scanAtLineendingDirectives_cr', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@lineending cr\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtLineendingDirectives(aList);
        assert.strictEqual(s, '\r');
    });
    //@+node:felix.20220129223719.30: *4* TestGlobals.test_g_scanAtLineendingDirectives_crlf
    test('test_g_scanAtLineendingDirectives_crlf', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@lineending crlf\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtLineendingDirectives(aList);
        assert.strictEqual(s, '\r\n');
    });
    /* def test_g_scanAtLineendingDirectives_crlf(self):
        c = self.c
        p = c.p
        p.b = '@lineending crlf\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\r\n')
     */
    //@+node:felix.20220129223719.31: *4* TestGlobals.test_g_scanAtLineendingDirectives_lf
    test('test_g_scanAtLineendingDirectives_lf', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@lineending lf\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtLineendingDirectives(aList);
        assert.strictEqual(s, '\n');
    });
    /* def test_g_scanAtLineendingDirectives_lf(self):
        c = self.c
        p = c.p
        p.b = '@lineending lf\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\n')
     */
    //@+node:felix.20220129223719.32: *4* TestGlobals.test_g_scanAtLineendingDirectives_nl
    test('test_g_scanAtLineendingDirectives_nl', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@lineending nl\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtLineendingDirectives(aList);
        assert.strictEqual(s, '\n');
    });
    /* def test_g_scanAtLineendingDirectives_nl(self):
        c = self.c
        p = c.p
        p.b = '@lineending nl\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\n')
     */
    //@+node:felix.20220129223719.33: *4* TestGlobals.test_g_scanAtLineendingDirectives_platform
    test('test_g_scanAtLineendingDirectives_platform', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@lineending platform\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtLineendingDirectives(aList);
        if (g.isWindows) {
            assert.strictEqual(s, '\r\n');
        } else {
            assert.strictEqual(s, '\n');
        }
    });
    /* def test_g_scanAtLineendingDirectives_platform(self):
        c = self.c
        p = c.p
        p.b = '@lineending platform\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        if sys.platform.startswith('win'):
            self.assertEqual(s, '\r\n')
        else:
            self.assertEqual(s, '\n')
     */
    //@+node:felix.20220129223719.34: *4* TestGlobals.test_g_scanAtPagewidthDirectives_minus_40
    test('test_g_scanAtPagewidthDirectives_minus_40', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@pagewidth -40\n';
        const aList = g.get_directives_dict_list(p);
        const n = g.scanAtPagewidthDirectives(aList);
        // The @pagewidth directive in the parent should control.
        // Depending on how this test is run, the result could be 80 or None.
        assert.ok([undefined, 80].includes(n), n?.toString());
    });
    /* def test_g_scanAtPagewidthDirectives_minus_40(self):
        c = self.c
        p = c.p
        p.b = '@pagewidth -40\n'
        aList = g.get_directives_dict_list(p)
        n = g.scanAtPagewidthDirectives(aList)
        # The @pagewidth directive in the parent should control.
        # Depending on how this test is run, the result could be 80 or None.
        assert n in (None, 80), repr(n)
     */
    //@+node:felix.20220129223719.35: *4* TestGlobals.test_g_scanAtPagewidthDirectives_40
    test('test_g_scanAtPagewidthDirectives_40', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@pagewidth 40\n';
        const aList = g.get_directives_dict_list(p);
        const n = g.scanAtPagewidthDirectives(aList);
        assert.strictEqual(n, 40);
    });
    /* def test_g_scanAtPagewidthDirectives_40(self):
        c = self.c
        p = c.p
        p.b = '@pagewidth 40\n'
        aList = g.get_directives_dict_list(p)
        n = g.scanAtPagewidthDirectives(aList)
        self.assertEqual(n, 40)
     */
    //@+node:felix.20220129223719.36: *4* TestGlobals.test_g_scanAtTabwidthDirectives_6
    test('test_g_scanAtTabwidthDirectives_6', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@tabwidth 6\n';
        const aList = g.get_directives_dict_list(p);
        const n = g.scanAtTabwidthDirectives(aList);
        assert.strictEqual(n, 6);
    });

    //@+node:felix.20220129223719.37: *4* TestGlobals.test_g_scanAtTabwidthDirectives_minus_6
    test('test_g_scanAtTabwidthDirectives_minus_6', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@tabwidth -6\n';
        const aList = g.get_directives_dict_list(p);
        const n = g.scanAtTabwidthDirectives(aList);
        assert.strictEqual(n, -6);
    });
    //@+node:felix.20220129223719.38: *4* TestGlobals.test_g_scanAtWrapDirectives_nowrap
    test('test_g_scanAtWrapDirectives_nowrap', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@nowrap\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtWrapDirectives(aList);
        assert.ok(s === false, s?.toString());
    });
    /* def test_g_scanAtWrapDirectives_nowrap(self):
        c = self.c
        p = c.p
        p.b = '@nowrap\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtWrapDirectives(aList)
        assert s is False, repr(s)
     */
    //@+node:felix.20220129223719.39: *4* TestGlobals.test_g_scanAtWrapDirectives_wrap_with_wrap_
    test('test_g_scanAtWrapDirectives_wrap_with_wrap_', () => {
        const c = self.c;
        const p = c.p;
        p.b = '@wrap\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtWrapDirectives(aList);
        assert.ok(s === true, s?.toString());
    });
    /* def test_g_scanAtWrapDirectives_wrap_with_wrap_(self):
        c = self.c
        p = c.p
        p.b = '@wrap\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtWrapDirectives(aList)
        assert s is True, repr(s)
     */
    //@+node:felix.20220129223719.40: *4* TestGlobals.test_g_scanAtWrapDirectives_wrap_without_nowrap_
    test('test_g_scanAtWrapDirectives_wrap_without_nowrap_', () => {
        const c = self.c;
        const p = c.p;
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtWrapDirectives(aList);
        assert.ok(s === undefined, s?.toString());
    });
    /* def test_g_scanAtWrapDirectives_wrap_without_nowrap_(self):
        c = self.c
        aList = g.get_directives_dict_list(c.p)
        s = g.scanAtWrapDirectives(aList)
        assert s is None, repr(s)
     */
    //@+node:felix.20220129223719.41: *4* TestGlobals.test_g_set_delims_from_language
    test('test_g_set_delims_from_language', () => {
        const table: [string, string[]][] = [
            ['c', ['//', '/*', '*/']],
            ['python', ['#', '', '']],
            ['xxxyyy', ['', '', '']],
        ];

        table.forEach((element) => {
            let language: string;
            let expected: string[];
            [language, expected] = element;
            const result = g.set_delims_from_language(language);
            // * use deepStrictEqual for contents of array, (arrays are not same object)
            assert.deepStrictEqual(result, expected, language);
        });
    });

    //@+node:felix.20220129223719.42: *4* TestGlobals.test_g_set_delims_from_string
    test('test_g_set_delims_from_string', () => {
        const table: [string, string, string[]][] = [
            ['c', '@comment // /* */', ['//', '/*', '*/']],
            ['c', '// /* */', ['//', '/*', '*/']],
            ['python', '@comment #', ['#', '', '']],
            ['python', '#', ['#', '', '']],
            ['xxxyyy', '@comment a b c', ['a', 'b', 'c']],
            ['xxxyyy', 'a b c', ['a', 'b', 'c']],
        ];

        table.forEach((element) => {
            let language: string;
            let s: string;
            let expected: string[];
            [language, s, expected] = element;
            const result = g.set_delims_from_string(s);
            // * use deepStrictEqual for contents of array, (arrays are not same object)
            assert.deepStrictEqual(result, expected, language);
        });
    });

    //@+node:felix.20220129223719.43: *4* TestGlobals.test_g_skip_blank_lines
    test('test_g_skip_blank_lines', () => {
        let end = g.skip_blank_lines('', 0);
        assert.strictEqual(end, 0);
        end = g.skip_blank_lines(' ', 0);
        assert.strictEqual(end, 0);
        end = g.skip_blank_lines('\n', 0);
        assert.strictEqual(end, 1);
        end = g.skip_blank_lines(' \n', 0);
        assert.strictEqual(end, 2);
        end = g.skip_blank_lines('\n\na\n', 0);
        assert.strictEqual(end, 2);
        end = g.skip_blank_lines('\n\n a\n', 0);
        assert.strictEqual(end, 2);
    });

    //@+node:felix.20220129223719.44: *4* TestGlobals.test_g_skip_line
    test('test_g_skip_line', () => {
        const s: string = 'a\n\nc';

        const table: [number, number][] = [
            [-1, 2], // One too few.
            [0, 2],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 4], // One too many.
        ];

        table.forEach((element) => {
            let i: number;
            let result: number;
            [i, result] = element;
            const j = g.skip_line(s, i);

            assert.strictEqual(j, result, i.toString());
        });
    });

    //@+node:felix.20220129223719.45: *4* TestGlobals.test_g_skip_to_end_of_line
    test('test_g_skip_to_end_of_line', () => {
        const s: string = 'a\n\nc';

        const table: [number, number][] = [
            [-1, 1], // One too few.
            [0, 1],
            [1, 1],
            [2, 2],
            [3, 4],
            [4, 4], // One too many.
        ];

        table.forEach((element) => {
            let i: number;
            let result: number;
            [i, result] = element;
            const j = g.skip_to_end_of_line(s, i);

            assert.strictEqual(j, result, i.toString());
        });
    });

    //@+node:felix.20220129223719.46: *4* TestGlobals.test_g_skip_to_start_of_line
    test('test_g_skip_to_start_of_line', () => {
        const s1: string = 'a\n\nc';

        const table1: [number, number][] = [
            [-1, 0], // One too few.
            [0, 0],
            [1, 0],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 4], // One too many.
        ];

        const s2: string = 'a\n';

        const table2: [number, number][] = [
            [1, 0],
            [2, 2],
        ]; // A special case at end.

        const totalArrays: [string, [number, number][]][] = [
            [s1, table1],
            [s2, table2],
        ];

        totalArrays.forEach((p_tables) => {
            let s: string;
            let table: [number, number][];
            [s, table] = p_tables;

            table.forEach((element) => {
                let i: number;
                let result: number;
                [i, result] = element;
                const j = g.skip_to_start_of_line(s, i);
                assert.strictEqual(
                    j,
                    result,
                    'i ' +
                    i.toString() +
                    ' s ' +
                    s +
                    ' got ' +
                    j.toString() +
                    ' expected ' +
                    result.toString()
                );
            });
        });
    });

    //@+node:felix.20220129223719.47: *4* TestGlobals.test_g_splitLongFileName
    test('test_g_splitLongFileName', () => {
        const table = [String.raw`abcd/xy\pdqabc/aaa.py`];
        for (let s of table) {
            g.splitLongFileName(s, 3);
        }
    });
    /* def test_g_splitLongFileName(self):
        table = (
            r'abcd/xy\pdqabc/aaa.py',
        )
        for s in table:
            g.splitLongFileName(s, limit=3)
     */
    //@+node:felix.20220129223719.48: *4* TestGlobals.test_g_stripPathCruft
    test('test_g_stripPathCruft', () => {
        const table: [string | undefined, string | undefined][] = [
            [undefined, undefined], // Retain empty paths for warning.
            ['', ''],
            [g.app.loadDir, g.app.loadDir],
            ['<abc>', 'abc'],
            ['"abc"', 'abc'],
            ["'abc'", 'abc'],
        ];

        table.forEach((element) => {
            let p_path: string | undefined;
            let expected: string | undefined;
            [p_path, expected] = element;

            const result = g.stripPathCruft(p_path!);

            assert.strictEqual(expected, result);
        });
    });

    //@+node:felix.20220129223719.49: *4* TestGlobals.test_g_warnOnReadOnlyFile
    test('test_g_warnOnReadOnlyFile', async () => {
        const c = self.c;
        const fc = c.fileCommands;
        const w_path = g.os_path_finalize_join(g.app.loadDir || '', '..', 'test', 'test-read-only.txt');
        const w_exists = await g.os_path_exists(w_path);
        if (w_exists && fs.chmod) {
            // os.chmod(w_path, stat.S_IREAD);
            const w_uri = g.makeVscodeUri(w_path);
            // await vscode.workspace.fs.writeFile(w_uri, contents);
            await fs.chmod(w_path, fs.constants.S_IRUSR);
            await fc.warnOnReadOnlyFiles(w_path);
            assert.ok(fc.read_only);
        } else {
            await fc.warnOnReadOnlyFiles(w_path);
        }
    });
    //@+node:felix.20230724012811.1: *3* unl tests
    //@+node:felix.20230724012811.2: *4* TestGlobals.test_g_findGnx
    test('test_g_findGnx', async () => {
        const c = self.c;
        // Define per-commander data.
        _define_per_commander_data();
        // Test all error messages for all paths.
        for (const data of files_data) {  // <@file> <filename>
            const [kind, relative_path] = data;
            const headline = `${kind} ${relative_path}`;
            const msg = headline;
            _make_tree(c, headline);
            const test_p = g.findNodeAnywhere(c, headline);
            assert.ok(test_p && test_p.__bool__());
            const result2 = await g.findGnx(test_p.gnx, c);
            assert.ok(result2 && result2.__eq__(test_p), msg);
        }
        // Create the test tree.
        _make_tree(c, 'Root');
        // Test all positions.
        for (const p of c.all_positions()) {
            for (const gnx of [`${p.gnx}`, `${p.gnx}::0`]) {
                const w_found = await g.findGnx(gnx, c);
                assert.ok(w_found && p.__eq__(w_found), gnx);
            }
        }
    });
    //@+node:felix.20230724012811.3: *4* TestGlobals.test_g_findUnl (legacy)
    test('test_g_findUnl', async () => {

        const c = self.c;

        // Create the test tree.
        _make_tree(c, 'Root');
        // Test all positions.
        for (const p of c.all_positions()) {
            // Plain headlines.
            const headlines = [...p.self_and_parents()].map((z) => z.h).reverse();
            let w_foundUnl = await g.findUnl(headlines, c);
            assert.ok(p.__eq__(w_foundUnl), headlines.join(','));
            // Headlines with new-style line numbers:
            const aList1: string[] = headlines.map((z: string) => `${z}::0`);
            w_foundUnl = await g.findUnl(aList1, c);
            assert.ok(p.__eq__(w_foundUnl), aList1.join(','));
            // Headlines with old-style child offsets.
            if (0) {  // I don't understand the old-style format!
                const aList2: string[] = headlines.map((z: string) => `${z}:0`);
                w_foundUnl = await g.findUnl(aList2, c);
                assert.ok(p.__eq__(w_foundUnl), aList2.join(','));
            }
        }
    });
    //@+node:felix.20230724012811.4: *4* TestGlobals.test_g_isValidUnl
    test('test_g_isValidUnl', () => {

        for (const unl of [...valid_unls, ...missing_unls]) {
            assert.ok(g.isValidUnl(unl), unl);
        }
        for (const unl of invalid_unls) {
            assert.ok(!g.isValidUnl(unl), unl);
        }

    });
    //@+node:felix.20230724012811.5: *4* TestGlobals.test_g_getUNLFilePart
    test('test_g_getUNLFilePart', () => {

        const table = [
            ['unl:' + 'gnx://a.leo#whatever', 'a.leo'],
            ['unl:' + '//b.leo#whatever', 'b.leo'],
            ['file:' + '//c.leo#whatever', 'c.leo'],
            ['//d.leo#whatever', 'd.leo'],
        ];
        for (const [unl, expected] of table) {
            assert.strictEqual(expected, g.getUNLFilePart(unl), unl);
        }

    });
    //@+node:felix.20230724012811.6: *4* TestGlobals.test_g_isValidUrl
    test('test_g_isValidUrl', () => {
        const bad_table = ['@whatever'];
        const good_table = [
            'http://leo-editor.github.io/leo-editor/preface.html',
            'https://github.com/leo-editor/leo-editor/issues?q=is%3Aissue+milestone%3A6.6.3+',
        ];
        for (const unl of [...valid_unls, ...missing_unls, ...good_table]) {
            assert.ok(g.isValidUrl(unl), unl);
        }
        for (const unl of [...invalid_unls, ...bad_table]) {
            assert(!g.isValidUrl(unl), unl);
        }
    });
    //@+node:felix.20230724012811.7: *4* TestGlobals.test_g_findAnyUnl
    test('test_g_findAnyUnl', async () => {

        // g.findAnyUnl returns a Position or None.
        _patch_at_data_unl_path_prefixes();
        //  To do: resolve all valid unls to a real position.

        const c = self.c;
        _make_tree(c, 'root');

        if (0) {  // Not yet.
            for (const unl of [...valid_unls, ...missing_unls]) {
                const p = c.rootPosition()!;
                let w_foundUnl = await g.findAnyUnl(unl, c);
                assert.ok(p.__eq__(w_foundUnl), unl);
            }
        }
        for (const unl of invalid_unls) {
            let w_foundUnl = await g.findAnyUnl(unl, c);
            assert.strictEqual(undefined, w_foundUnl, unl);
        }
        // Suppress warnings.
        // old_stdout = sys.stdout
        // try:
        //     sys.stdout = open(os.devnull, 'w')
        //     for unl in self.invalid_unls:
        //         assert.strictEqual(None, g.findAnyUnl(unl, c), msg=unl)
        // finally:
        //     sys.stdout = old_stdout

    });
    //@+node:felix.20230724012811.8: *4* TestGlobals.test_p_get_star_UNL
    test('test_p_get_star_UNL', () => {

        // Test 11 p.get_*_UNL methods.
        const c = self.c;
        _make_tree(c);
        const root = c.rootPosition()!.next();
        const p = root.firstChild();

        // Calculate the various kinds of results.
        const gnx = p.gnx;
        const w_path = [root.h, p.h].join('-->');
        const long_fn = c.fileName();
        const short_fn = g.os_path_basename(c.fileName());

        const empty_gnx = 'unl:' + `gnx://#${gnx}`;
        const empty_path = 'unl:' + `gnx://#${w_path}`;
        const full_gnx = 'unl:' + `gnx://${long_fn}#${gnx}`;
        const full_legacy = 'unl:' + `//${long_fn}#${w_path}`;
        const short_gnx = 'unl:' + `gnx://${short_fn}#${gnx}`;
        const short_legacy = 'unl:' + `//${short_fn}#${w_path}`;
        const all_unls = [empty_gnx, empty_path, full_gnx, full_legacy, short_gnx, short_legacy];

        // Pre-test.
        for (const unl of all_unls) {
            assert.ok(g.isValidUnl(unl), unl);
        }

        /**
         * Set c.config settings from the args.
         */
        function set_config(kind: string, full: boolean) {
            const [getBool, getString] = [
                c.config.getBool.bind(c.config),
                c.config.getString.bind(c.config)
            ];
            c.config.set(undefined, 'string', 'unl-status-kind', kind);
            c.config.set(undefined, 'bool', 'full-unl-paths', full);
            assert.strictEqual(full, getBool('full-unl-paths'), full.toString());
            assert.strictEqual(kind, getString('unl-status-kind'), kind);
        }
        // Test g.get_UNL and g.get_legacy_UNL.
        const expected_get_UNL: Record<string, string> = {
            'legacy:0': short_gnx,
            'legacy:1': full_gnx,
            'gnx:0': short_gnx,
            'gnx:1': full_gnx,
        };
        const expected_get_legacy_UNL: Record<string, string> = {
            'legacy:0': short_legacy,
            'legacy:1': full_legacy,
            'gnx:0': short_legacy,
            'gnx:1': full_legacy,
        };
        const w_table: [Record<string, string>, () => string][] = [
            [expected_get_UNL, p.get_UNL.bind(p)],
            [expected_get_legacy_UNL, p.get_legacy_UNL.bind(p)],
        ];

        for (const kind of ['legacy', 'gnx']) {
            for (const full of [true, false]) {
                set_config(kind, full);
                for (const [d, f] of w_table) {
                    const expected = d[`${kind}:${(Number(full)).toString()}`];
                    assert.strictEqual(expected, f(), `${f.name}: kind: ${kind} full: ${full}`);
                }
            }
        }
        // Test all other p.get_*_UNL methods.
        // Their returned values should not depend on settings, but change the settings to make sure.
        const table2: [string, () => string][] = [
            // Test g.get_full/short_gnx_UNL.
            [full_gnx, p.get_full_gnx_UNL.bind(p)],
            [short_gnx, p.get_short_gnx_UNL.bind(p)],
            // Test g.get_full/short_legacy_UNL.
            [full_legacy, p.get_full_legacy_UNL.bind(p)],
            [short_legacy, p.get_short_legacy_UNL.bind(p)],
        ];
        for (const kind of ['legacy', 'gnx']) {
            for (const full of [true, false]) {
                set_config(kind, full);
                for (const [expected, f] of table2) {
                    const msg = `${f.name}: kind: ${kind} full: ${full}`;
                    assert.strictEqual(expected, f(), msg);
                }

            }
        }
    });
    //@+node:felix.20230724012811.9: *4* TestGlobals.test_g_parsePathData
    test('test_g_parsePathData', () => {

        const c = self.c;

        // Set @data unl-path-prefixes

        const s = g.dedent(`\
            # lines have the form:
            # x.leo: <absolute path to x.leo>

            test.leo:    c:/Repos/leo-editor/leo/test
            LeoDocs.leo: c:/Repos/leo-editor/leo/doc
        `);
        const lines = g.splitLines(s);
        self._set_setting(c, 'data', 'unl-path-prefixes', lines);
        const lines2 = c.config.getData('unl-path-prefixes');
        const expected_lines = [
            'test.leo:    c:/Repos/leo-editor/leo/test',
            'LeoDocs.leo: c:/Repos/leo-editor/leo/doc',
        ];
        assert.ok(g.compareArrays(lines2, expected_lines));
        const d = g.parsePathData(c);
        const w_paths = ['c:/Repos/leo-editor/leo/test', 'c:/Repos/leo-editor/leo/doc'];
        const expected_paths: string[] = w_paths.map((z: string) => g.os_path_normpath(z));
        assert.ok(g.compareArrays(Object.values(d).sort(), expected_paths.sort()));

    });
    //@+node:felix.20230724012811.10: *4* TestGlobals.test_g_openUNLFile
    test('test_g_openUNLFile', async () => {

        // Create a new commander
        const c1 = self.c;
        const c2 = _patch_at_data_unl_path_prefixes();
        // Change both filenames.
        const file_name1 = g.os_path_basename(c1.fileName());
        const file_name2 = g.os_path_basename(c2.fileName());
        // Cross-file tests.
        const c3 = await g.openUNLFile(c1, file_name2);
        assert.strictEqual(c3, c2);
        const c4 = await g.openUNLFile(c2, file_name1);
        assert.strictEqual(c4, c1);

    });
    //@-others

});
//@-others
//@-leo
