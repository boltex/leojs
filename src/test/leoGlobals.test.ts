//@+leo-ver=5-thin
//@+node:felix.20220129002458.1: * @file src/test/leoGlobals.test.ts
/**
 * Tests of leo.core.leoGlobals
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20220129223719.1: ** suite TestGlobals(LeoUnitTest)
suite('Tests for leo.core.leoGlobals', () => {
    let self: LeoUnitTest;

    before(async () => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(async () => {
        self.setUp();
    });

    afterEach(async () => {
        self.tearDown();
    });

    //@+others
    //@+node:felix.20220129223719.2: *3* TestGlobals.test_getLastTracebackFileAndLineNumber
    /* def test_getLastTracebackFileAndLineNumber(self):
        try:
            assert False
        except AssertionError:
            fn, n = g.getLastTracebackFileAndLineNumber()
        self.assertEqual(fn, __file__)

     */
    //@+node:felix.20220129223719.3: *3* TestGlobals.test_g_checkVersion
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
    //@+node:felix.20220129223719.4: *3* TestGlobals.test_g_CheckVersionToInt
    /* def test_g_CheckVersionToInt(self):
        self.assertEqual(g.CheckVersionToInt('12'), 12)
        self.assertEqual(g.CheckVersionToInt('2a5'), 2)
        self.assertEqual(g.CheckVersionToInt('b2'), 0)
     */
    //@+node:felix.20220129223719.5: *3* TestGlobals.test_g_comment_delims_from_extension

    test('test_g_comment_delims_from_extension', async () => {
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
    //@+node:felix.20220129223719.6: *3* TestGlobals.test_g_convertPythonIndexToRowCol
    test('test_g_convertPythonIndexToRowCol', async () => {
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

    //@+node:felix.20220129223719.7: *3* TestGlobals.test_g_convertRowColToPythonIndex
    test('test_g_convertRowColToPythonIndex', async () => {
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

    //@+node:felix.20220129223719.8: *3* TestGlobals.test_g_create_temp_file
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

    //@+node:felix.20220129223719.9: *3* TestGlobals.test_g_ensureLeadingNewlines
    test('test_g_ensureLeadingNewlines', async () => {
        const s = ' \n \n\t\naa bc';
        const s2 = 'aa bc';
        for (let i of [0, 1, 2, 3]) {
            const result = g.ensureLeadingNewlines(s, i);
            const val = '\n'.repeat(i) + s2;
            assert.strictEqual(result, val);
        }
    });
    //@+node:felix.20220129223719.10: *3* TestGlobals.test_g_ensureTrailingNewlines
    test('test_g_ensureTrailingNewlines', async () => {
        const s = 'aa bc \n \n\t\n';
        const s2 = 'aa bc';
        for (let i of [0, 1, 2, 3]) {
            const result = g.ensureTrailingNewlines(s, i);
            const val = s2 + '\n'.repeat(i);
            assert.strictEqual(result, val);
        }
    });
    //@+node:felix.20230423154801.1: *3* TestGlobals.test_g_finalize
    // def test_g_finalize(self):
        
    //     # This is also a strong test of g.finalize.
    //     import os
    //     c = self.c
    //     normslashes = g.os_path_normslashes

    //     # Setup environment.
    //     expected_leo_base = 'C:/leo_base' if g.isWindows else '/leo_base'
    //     c.mFileName = "/leo_base/test.leo"
        
    //     # Note: These directories do *not* have to exist.
    //     os.environ = {
    //         'HOME': '/home',  # Linux.
    //         'USERPROFILE': normslashes(r'c:/Whatever'),  # Windows.
    //         'LEO_BASE': expected_leo_base,
    //     }

    //     curdir = normslashes(os.getcwd())
    //     home = normslashes(os.path.expanduser('~'))
    //     assert home in (os.environ['HOME'], os.environ['USERPROFILE']), repr(home)

    //     seps = ('\\', '/') if g.isWindows else ('/',)
    //     for sep in seps:
    //         table = (
    //             # The most basic test. The *only* reasonable base is os.getcwd().
    //             ('basic.py',                    f"{curdir}/basic.py"),
    //             (f"~{sep}a.py",                 f"{home}/a.py"),
    //             (f"~{sep}x{sep}..{sep}b.py",    f"{home}/b.py"),
    //             (f"$LEO_BASE{sep}c.py",         f"{expected_leo_base}/c.py"),        
    //         )
    //         for arg, expected in table:
    //             got = g.finalize(arg)
    //             # Weird: the case is wrong whatever the case of expected_leo_base!
    //             if g.isWindows:
    //                 expected = expected.replace('C:', 'c:')
    //                 got = got.replace('C:', 'c:')
    //             self.assertEqual(expected, got)
    //@+node:felix.20230423154806.1: *3* TestGlobals.test_g_finalize_join
    // def test_g_finalize_join(self):
        
    //     # This is also a strong test of g.finalize.
    //     import os
    //     c = self.c
    //     normslashes = g.os_path_normslashes

    //     # Setup environment.
    //     expected_leo_base = 'C:/leo_base' if g.isWindows else '/leo_base'
    //     c.mFileName = "/leo_base/test.leo"
        
    //     # Note: These directories do *not* have to exist.
    //     os.environ = {
    //         'HOME': '/home',  # Linux.
    //         'USERPROFILE': normslashes(r'c:/Whatever'),  # Windows.
    //         'LEO_BASE': expected_leo_base,
    //     }

    //     curdir = normslashes(os.getcwd())
    //     home = normslashes(os.path.expanduser('~'))
    //     assert home in (os.environ['HOME'], os.environ['USERPROFILE']), repr(home)

    //     seps = ('\\', '/') if g.isWindows else ('/',)
    //     for sep in seps:
    //         table = (
    //             # The most basic test. The *only* reasonable base is os.getcwd().
    //             (('basic.py',),                     f"{curdir}/basic.py"),
    //             # One element in *args...
    //             ((f"~{sep}a.py",),                  f"{home}/a.py"),
    //             ((f"~{sep}x{sep}..{sep}b.py",),     f"{home}/b.py"),
    //             ((f"$LEO_BASE{sep}c.py",),          f"{expected_leo_base}/c.py"),
    //             # Two elements in *args...
    //             (('~', 'w.py'),                     f"{home}/w.py"),
    //             (('$LEO_BASE', 'x.py'),             f"{expected_leo_base}/x.py"),
    //             # Strange cases...
    //             (('~', '~', 's1.py'),               f"{home}/s1.py"),
    //             ((f"~{sep}b", '~', 's2.py'),        f"{home}/s2.py"),
    //             (('~', f"~{sep}b", 's3.py'),        f"{home}/b/s3.py"),
    //             (('$LEO_BASE', '~', 's4.py'),       f"{home}/s4.py"),
    //             (('~', '$LEO_BASE', 's5.py'),       f"{expected_leo_base}/s5.py"),
    //             # More strange cases.
    //             (('~', 'xxx.py', '~', 's6.py'),     f"{home}/s6.py"),
    //             (('yyy', '~'),                      f"{home}"),
    //             (('zzz', '$LEO_BASE',),             f"{expected_leo_base}"),
    //             (('${LEO_BASE}b',),                 f"{expected_leo_base}b"),
        
    //             # This goes beyond the limits of what Windows can do.
    //             # (('a${LEO_BASE}b',),                f"a{expected_leo_base}b"),            
    //         )
    //         for args, expected in table:
    //             got = g.finalize_join(*args)
    //             # Weird: the case is wrong whatever the case of expected_leo_base!
    //             if g.isWindows:
    //                 expected = expected.replace('C:', 'c:')
    //                 got = got.replace('C:', 'c:')
    //             self.assertEqual(expected, got)
    //@+node:felix.20220129223719.11: *3* TestGlobals.test_g_find_word
    test('test_g_find_word', async () => {
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
    //@+node:felix.20220129223719.12: *3* TestGlobals.test_g_fullPath
    test('test_g_fullPath', async () => {
        const c = self.c;

        const child = c.rootPosition()!.insertAfter();
        child.h = '@path abc';
        const grand = child.insertAsLastChild();
        grand.h = 'xyz';

        const w_path = g.fullPath(c, grand, true);
        const end = g.os_path_normpath('abc/xyz');

        assert.ok(w_path.endsWith(end), w_path.toString());
    });
    //@+node:felix.20220129223719.13: *3* TestGlobals.test_g_get_directives_dict
    test('test_g_get_directives_dict', async () => {
        const c = self.c;
        const p = c.p;

        p.b = g.dedent(
            `\
            @language python
            @comment a b c
                # @comment must follow @language.
            @tabwidth -8
            @pagewidth 72
            @encoding utf-8\n`
        );

        const d = g.get_directives_dict(p);
        assert.strictEqual(d['language'], 'python');
        assert.strictEqual(d['tabwidth'], '-8');
        assert.strictEqual(d['pagewidth'], '72');
        assert.strictEqual(d['encoding'], 'utf-8');
        assert.strictEqual(d['comment'], 'a b c');
        assert.ok(!d['path'], d['path']);
    });
    //@+node:felix.20220129223719.14: *3* TestGlobals.test_g_getDocString
    test('test_g_getDocString', async () => {
        let s1 = 'no docstring';
        let s2 = g.dedent(
            `\
            # comment
            """docstring2."""\n`
        );
        let s3 = g.dedent(
            `\
            """docstring3."""
            \'\'\'docstring2.\'\'\'\n`
        );
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
    //@+node:felix.20220129223719.15: *3* TestGlobals.test_g_getLine
    test('test_g_getLine', async () => {
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

    //@+node:felix.20220129223719.16: *3* TestGlobals.test_g_getWord
    test('test_g_getWord', async () => {
        const s = 'abc xy_z5 pdq';
        let i: number;
        let j: number;
        [i, j] = g.getWord(s, 5);
        assert.strictEqual(s.substring(i, j), 'xy_z5');
    });

    //@+node:felix.20220129223719.17: *3* TestGlobals.test_g_guessExternalEditor
    /* def test_g_guessExternalEditor(self):
        c = self.c
        val = g.guessExternalEditor(c)
        assert val, 'no val'  # This can be different on different platforms.
     */
    //@+node:felix.20220129223719.18: *3* TestGlobals.test_g_handleUrl
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
    //@+node:felix.20220129223719.19: *3* TestGlobals.test_g_import_module
    /* def test_g_import_module(self):
        assert g.import_module('leo.core.leoAst')
            # Top-level .py file.
     */
    //@+node:felix.20220129223719.20: *3* TestGlobals.test_g_isDirective
    test('test_g_isDirective', async () => {
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

    //@+node:felix.20220129223719.21: *3* TestGlobals.test_g_match_word
    test('test_g_match_word', async () => {
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

    //@+node:felix.20220129223719.22: *3* TestGlobals.test_g_os_path_finalize_join_with_thumb_drive
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
    //@+node:felix.20220129223719.23: *3* TestGlobals.test_g_removeBlankLines
    test('test_g_removeBlankLines', async () => {
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
    //@+node:felix.20220129223719.24: *3* TestGlobals.test_g_removeLeadingBlankLines
    test('test_g_removeLeadingBlankLines', async () => {
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
    //@+node:felix.20220129223719.25: *3* TestGlobals.test_g_removeTrailing
    test('test_g_removeTrailing', async () => {
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
    //@+node:felix.20220129223719.26: *3* TestGlobals.test_g_sanitize_filename
    test('test_g_sanitize_filename', async () => {
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
    //@+node:felix.20220129223719.27: *3* TestGlobals.test_g_scanAtHeaderDirectives_header
    test('test_g_scanAtHeaderDirectives_header', async () => {
        const c = self.c;
        const aList = g.get_directives_dict_list(c.p);
        g.scanAtHeaderDirectives(aList); // ? Same as no-neader ?
    });
    //@+node:felix.20220129223719.28: *3* TestGlobals.test_g_scanAtHeaderDirectives_noheader
    test('test_g_scanAtHeaderDirectives_noheader', async () => {
        const c = self.c;
        const aList = g.get_directives_dict_list(c.p);
        g.scanAtHeaderDirectives(aList); // ? Same as header ?
    });
    //@+node:felix.20220129223719.29: *3* TestGlobals.test_g_scanAtLineendingDirectives_cr
    test('test_g_scanAtLineendingDirectives_cr', async () => {
        const c = self.c;
        const p = c.p;
        p.b = '@lineending cr\n';
        const aList = g.get_directives_dict_list(p);
        const s = g.scanAtLineendingDirectives(aList);
        assert.strictEqual(s, '\r');
    });
    //@+node:felix.20220129223719.30: *3* TestGlobals.test_g_scanAtLineendingDirectives_crlf
    test('test_g_scanAtLineendingDirectives_crlf', async () => {
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
    //@+node:felix.20220129223719.31: *3* TestGlobals.test_g_scanAtLineendingDirectives_lf
    test('test_g_scanAtLineendingDirectives_lf', async () => {
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
    //@+node:felix.20220129223719.32: *3* TestGlobals.test_g_scanAtLineendingDirectives_nl
    test('test_g_scanAtLineendingDirectives_nl', async () => {
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
    //@+node:felix.20220129223719.33: *3* TestGlobals.test_g_scanAtLineendingDirectives_platform
    test('test_g_scanAtLineendingDirectives_platform', async () => {
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
    //@+node:felix.20220129223719.34: *3* TestGlobals.test_g_scanAtPagewidthDirectives_minus_40
    test('test_g_scanAtPagewidthDirectives_minus_40', async () => {
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
    //@+node:felix.20220129223719.35: *3* TestGlobals.test_g_scanAtPagewidthDirectives_40
    test('test_g_scanAtPagewidthDirectives_40', async () => {
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
    //@+node:felix.20220129223719.36: *3* TestGlobals.test_g_scanAtTabwidthDirectives_6
    test('test_g_scanAtTabwidthDirectives_6', async () => {
        const c = self.c;
        const p = c.p;
        p.b = '@tabwidth 6\n';
        const aList = g.get_directives_dict_list(p);
        const n = g.scanAtTabwidthDirectives(aList);
        assert.strictEqual(n, 6);
    });

    //@+node:felix.20220129223719.37: *3* TestGlobals.test_g_scanAtTabwidthDirectives_minus_6
    test('test_g_scanAtTabwidthDirectives_minus_6', async () => {
        const c = self.c;
        const p = c.p;
        p.b = '@tabwidth -6\n';
        const aList = g.get_directives_dict_list(p);
        const n = g.scanAtTabwidthDirectives(aList);
        assert.strictEqual(n, -6);
    });
    //@+node:felix.20220129223719.38: *3* TestGlobals.test_g_scanAtWrapDirectives_nowrap
    test('test_g_scanAtWrapDirectives_nowrap', async () => {
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
    //@+node:felix.20220129223719.39: *3* TestGlobals.test_g_scanAtWrapDirectives_wrap_with_wrap_
    test('test_g_scanAtWrapDirectives_wrap_with_wrap_', async () => {
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
    //@+node:felix.20220129223719.40: *3* TestGlobals.test_g_scanAtWrapDirectives_wrap_without_nowrap_
    test('test_g_scanAtWrapDirectives_wrap_without_nowrap_', async () => {
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
    //@+node:felix.20220129223719.41: *3* TestGlobals.test_g_set_delims_from_language
    test('test_g_set_delims_from_language', async () => {
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

    //@+node:felix.20220129223719.42: *3* TestGlobals.test_g_set_delims_from_string
    test('test_g_set_delims_from_string', async () => {
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

    //@+node:felix.20220129223719.43: *3* TestGlobals.test_g_skip_blank_lines
    test('test_g_skip_blank_lines', async () => {
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

    //@+node:felix.20220129223719.44: *3* TestGlobals.test_g_skip_line
    test('test_g_skip_line', async () => {
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

    //@+node:felix.20220129223719.45: *3* TestGlobals.test_g_skip_to_end_of_line
    test('test_g_skip_to_end_of_line', async () => {
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

    //@+node:felix.20220129223719.46: *3* TestGlobals.test_g_skip_to_start_of_line
    test('test_g_skip_to_start_of_line', async () => {
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

    //@+node:felix.20220129223719.47: *3* TestGlobals.test_g_splitLongFileName
    test('test_g_splitLongFileName', async () => {
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
    //@+node:felix.20220129223719.48: *3* TestGlobals.test_g_stripPathCruft
    test('test_g_stripPathCruft', async () => {
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

    //@+node:felix.20220129223719.49: *3* TestGlobals.test_g_warnOnReadOnlyFile
    /* def test_g_warnOnReadOnlyFile(self):
        c = self.c
        fc = c.fileCommands
        path = g.os_path_finalize_join(g.app.loadDir, '..', 'test', 'test-read-only.txt')
        if os.path.exists(path):
            os.chmod(path, stat.S_IREAD)
            fc.warnOnReadOnlyFiles(path)
            assert fc.read_only
        else:
            fc.warnOnReadOnlyFiles(path)
     */
    //@-others
});
//@-others
//@-leo
