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
suite('Test Globals', () => {

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

        console.log('test_g_comment_delims_from_extension skipped');
        // ! Uncomment if comment_delims_from_extension is ever needed in leojs !

        /*
        // New in Leo 4.6, set_delims_from_language returns '' instead of None.
        const table:[string, string[]][] = [
            ['.c', ['//', '/*', '*\/']], // escaped
            ['.html', ['', '<!--', '-->']],
            ['.py', ['#', '', '']],
            ['.Globals', ['', '', '']]
        ];

        table.forEach(element => {
            let ext: string;
            let expected: string[];

            [ext, expected ] = element;
            const result = g.comment_delims_from_extension(ext);
            assert.strictEqual(result, expected, ext.toString());
        });
        */

    });


    //@+node:felix.20220129223719.6: *3* TestGlobals.test_g_convertPythonIndexToRowCol
    /* def test_g_convertPythonIndexToRowCol(self):
        s1 = 'abc\n\np\nxy'
        table1 = (
            (-1, (0, 0)),  # One too small.
            (0, (0, 0)),
            (1, (0, 1)),
            (2, (0, 2)),
            (3, (0, 3)),  # The newline ends a row.
            (4, (1, 0)),
            (5, (2, 0)),
            (6, (2, 1)),
            (7, (3, 0)),
            (8, (3, 1)),
            (9, (3, 2)),  # One too many.
            (10, (3, 2)),  # Two too many.
        )
        s2 = 'abc\n\np\nxy\n'
        table2 = (
            (9, (3, 2)),
            (10, (4, 0)),  # One too many.
            (11, (4, 0)),  # Two too many.
        )
        s3 = 'ab'  # Test special case.  This was the cause of off-by-one problems.
        table3 = (
            (-1, (0, 0)),  # One too small.
            (0, (0, 0)),
            (1, (0, 1)),
            (2, (0, 2)),  # One too many.
            (3, (0, 2)),  # Two too many.
        )
        for n, s, table in ((1, s1, table1), (2, s2, table2), (3, s3, table3)):
            for i, result in table:
                row, col = g.convertPythonIndexToRowCol(s, i)
                self.assertEqual(row, result[0], msg=f"n: {n}, i: {i}")
                self.assertEqual(col, result[1], msg=f"n: {n}, i: {i}")
     */
    //@+node:felix.20220129223719.7: *3* TestGlobals.test_g_convertRowColToPythonIndex
    /* def test_g_convertRowColToPythonIndex(self):
        s1 = 'abc\n\np\nxy'
        s2 = 'abc\n\np\nxy\n'
        table1 = (
            (0, (-1, 0)),  # One too small.
            (0, (0, 0)),
            (1, (0, 1)),
            (2, (0, 2)),
            (3, (0, 3)),  # The newline ends a row.
            (4, (1, 0)),
            (5, (2, 0)),
            (6, (2, 1)),
            (7, (3, 0)),
            (8, (3, 1)),
            (9, (3, 2)),  # One too large.
        )
        table2 = (
            (9, (3, 2)),
            (10, (4, 0)),  # One two many.
        )
        for s, table in ((s1, table1), (s2, table2)):
            for i, data in table:
                row, col = data
                result = g.convertRowColToPythonIndex(s, row, col)
                self.assertEqual(i, result, msg=f"row: {row}, col: {col}, i: {i}")
     */
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
    /* def test_g_ensureLeadingNewlines(self):
        s = ' \n \n\t\naa bc'
        s2 = 'aa bc'
        for i in range(3):
            result = g.ensureLeadingNewlines(s, i)
            val = ('\n' * i) + s2
            self.assertEqual(result, val)
     */
    //@+node:felix.20220129223719.10: *3* TestGlobals.test_g_ensureTrailingNewlines
    /* def test_g_ensureTrailingNewlines(self):
        s = 'aa bc \n \n\t\n'
        s2 = 'aa bc'
        for i in range(3):
            result = g.ensureTrailingNewlines(s, i)
            val = s2 + ('\n' * i)
            self.assertEqual(result, val)
     */
    //@+node:felix.20220129223719.11: *3* TestGlobals.test_g_find_word
    /* def test_g_find_word(self):
        table = (
            ('abc a bc x', 'bc', 0, 6),
            ('abc a bc x', 'bc', 1, 6),
            ('abc a x', 'bc', 0, -1),
        )6
        for s, word, i, expected in table:
            actual = g.find_word(s, word, i)
            self.assertEqual(actual, expected)
     */
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

        p.b = g.dedent(`\
            @language python
            @comment a b c
                # @comment must follow @language.
            @tabwidth -8
            @pagewidth 72
            @encoding utf-8
        `);

        const d = g.get_directives_dict(p);
        assert.strictEqual(d['language'], 'python');
        assert.strictEqual(d['tabwidth'], '-8');
        assert.strictEqual(d['pagewidth'], '72');
        assert.strictEqual(d['encoding'], 'utf-8');
        assert.strictEqual(d['comment'], 'a b c');
        assert.ok(!(d['path']), d['path']);

    });

    /* def test_g_get_directives_dict(self):
        c = self.c
        p = c.p
        p.b = textwrap.dedent("""\
            @language python
            @comment a b c
                # @comment must follow @language.
            @tabwidth -8
            @pagewidth 72
            @encoding utf-8
    """)
        d = g.get_directives_dict(p)
        self.assertEqual(d.get('language'), 'python')
        self.assertEqual(d.get('tabwidth'), '-8')
        self.assertEqual(d.get('pagewidth'), '72')
        self.assertEqual(d.get('encoding'), 'utf-8')
        self.assertEqual(d.get('comment'), 'a b c')
        assert not d.get('path'), d.get('path')
     */



    //@+node:felix.20220129223719.14: *3* TestGlobals.test_g_getDocString
    /* def test_g_getDocString(self):
        s1 = 'no docstring'
        s2 = textwrap.dedent('''\
    # comment
    """docstring2."""
    ''')
        s3 = textwrap.dedent('''\
    """docstring3."""
    \'\'\'docstring2.\'\'\'
    ''')
        table = (
            (s1, ''),
            (s2, 'docstring2.'),
            (s3, 'docstring3.'),
        )
        for s, result in table:
            s2 = g.getDocString(s)
            self.assertEqual(s2, result)
     */
    //@+node:felix.20220129223719.15: *3* TestGlobals.test_g_getLine
    /* def test_g_getLine(self):
        s = 'a\ncd\n\ne'
        for i, result in (
            (-1, (0, 2)),  # One too few.
            (0, (0, 2)), (1, (0, 2)),
            (2, (2, 5)), (3, (2, 5)), (4, (2, 5)),
            (5, (5, 6)),
            (6, (6, 7)),
            (7, (6, 7)),  # One too many.
        ):
            j, k = g.getLine(s, i)
            self.assertEqual((j, k), result, msg=f"i: {i}, j: {j}, k: {k}")
     */
    //@+node:felix.20220129223719.16: *3* TestGlobals.test_g_getWord
    /* def test_g_getWord(self):
        s = 'abc xy_z5 pdq'
        i, j = g.getWord(s, 5)
        self.assertEqual(s[i:j], 'xy_z5')
     */
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

        table.forEach(element => {
            let expected: boolean;
            let s: string;
            [expected, s] = element;
            const result = g.isDirective(s);
            assert.strictEqual(expected, !!result, s);
        });

    });

    //@+node:felix.20220129223719.21: *3* TestGlobals.test_g_match_word
    /* def test_g_match_word(self):
        table = (
            (True, 0, 'a', 'a'),
            (False, 0, 'a', 'b'),
            (True, 0, 'a', 'a b'),
            (False, 1, 'a', 'aa b'),  # Tests bug fixed 2017/06/01.
            (False, 1, 'a', '_a b'),
            (False, 0, 'a', 'aw b'),
            (False, 0, 'a', 'a_'),
            (True, 2, 'a', 'b a c'),
            (False, 0, 'a', 'b a c'),
        )
        for data in table:
            expected, i, word, line = data
            got = g.match_word(line + '\n', i, word)
            self.assertEqual(expected, got)
     */
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
    /* def test_g_removeBlankLines(self):
        for s, expected in (
            ('a\nb', 'a\nb'),
            ('\n  \n\nb\n', 'b\n'),
            (' \t \n\n  \n c\n\t\n', ' c\n'),
        ):
            result = g.removeBlankLines(s)
            self.assertEqual(result, expected, msg=repr(s))
     */
    //@+node:felix.20220129223719.24: *3* TestGlobals.test_g_removeLeadingBlankLines
    /* def test_g_removeLeadingBlankLines(self):
        for s, expected in (
            ('a\nb', 'a\nb'),
            ('\n  \nb\n', 'b\n'),
            (' \t \n\n\n c', ' c'),
        ):
            result = g.removeLeadingBlankLines(s)
            self.assertEqual(result, expected, msg=repr(s))
     */
    //@+node:felix.20220129223719.25: *3* TestGlobals.test_g_removeTrailing
    /* def test_g_removeTrailing(self):
        s = 'aa bc \n \n\t\n'
        table = (
            ('\t\n ', 'aa bc'),
            ('abc\t\n ', ''),
            ('c\t\n ', 'aa b'),
        )
        for arg, val in table:
            result = g.removeTrailing(s, arg)
            self.assertEqual(result, val)
     */
    //@+node:felix.20220129223719.26: *3* TestGlobals.test_g_sanitize_filename
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
    /* def test_g_scanAtHeaderDirectives_header(self):
        c = self.c
        aList = g.get_directives_dict_list(c.p)
        g.scanAtHeaderDirectives(aList)
     */
    //@+node:felix.20220129223719.28: *3* TestGlobals.test_g_scanAtHeaderDirectives_noheader
    /* def test_g_scanAtHeaderDirectives_noheader(self):
        c = self.c
        aList = g.get_directives_dict_list(c.p)
        g.scanAtHeaderDirectives(aList)
     */
    //@+node:felix.20220129223719.29: *3* TestGlobals.test_g_scanAtLineendingDirectives_cr
    /* def test_g_scanAtLineendingDirectives_cr(self):
        c = self.c
        p = c.p
        p.b = '@lineending cr\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\r')
     */
    //@+node:felix.20220129223719.30: *3* TestGlobals.test_g_scanAtLineendingDirectives_crlf
    /* def test_g_scanAtLineendingDirectives_crlf(self):
        c = self.c
        p = c.p
        p.b = '@lineending crlf\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\r\n')
     */
    //@+node:felix.20220129223719.31: *3* TestGlobals.test_g_scanAtLineendingDirectives_lf
    /* def test_g_scanAtLineendingDirectives_lf(self):
        c = self.c
        p = c.p
        p.b = '@lineending lf\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\n')
     */
    //@+node:felix.20220129223719.32: *3* TestGlobals.test_g_scanAtLineendingDirectives_nl
    /* def test_g_scanAtLineendingDirectives_nl(self):
        c = self.c
        p = c.p
        p.b = '@lineending nl\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtLineendingDirectives(aList)
        self.assertEqual(s, '\n')
     */
    //@+node:felix.20220129223719.33: *3* TestGlobals.test_g_scanAtLineendingDirectives_platform
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
    /* def test_g_scanAtWrapDirectives_nowrap(self):
        c = self.c
        p = c.p
        p.b = '@nowrap\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtWrapDirectives(aList)
        assert s is False, repr(s)
     */
    //@+node:felix.20220129223719.39: *3* TestGlobals.test_g_scanAtWrapDirectives_wrap_with_wrap_
    /* def test_g_scanAtWrapDirectives_wrap_with_wrap_(self):
        c = self.c
        p = c.p
        p.b = '@wrap\n'
        aList = g.get_directives_dict_list(p)
        s = g.scanAtWrapDirectives(aList)
        assert s is True, repr(s)
     */
    //@+node:felix.20220129223719.40: *3* TestGlobals.test_g_scanAtWrapDirectives_wrap_without_nowrap_
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
            ['xxxyyy', ['', '', '']]
        ];

        table.forEach(element => {
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
            ['xxxyyy', 'a b c', ['a', 'b', 'c']]
        ];

        table.forEach(element => {
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
    /* def test_g_skip_blank_lines(self):
        end = g.skip_blank_lines("", 0)
        self.assertEqual(end, 0)
        end = g.skip_blank_lines(" ", 0)
        self.assertEqual(end, 0)
        end = g.skip_blank_lines("\n", 0)
        self.assertEqual(end, 1)
        end = g.skip_blank_lines(" \n", 0)
        self.assertEqual(end, 2)
        end = g.skip_blank_lines("\n\na\n", 0)
        self.assertEqual(end, 2)
        end = g.skip_blank_lines("\n\n a\n", 0)
        self.assertEqual(end, 2)
     */
    //@+node:felix.20220129223719.44: *3* TestGlobals.test_g_skip_line
    /* def test_g_skip_line(self):
        s = 'a\n\nc'
        for i, result in (
            (-1, 2),  # One too few.
            (0, 2), (1, 2),
            (2, 3),
            (3, 4),
            (4, 4),  # One too many.
        ):
            j = g.skip_line(s, i)
            self.assertEqual(j, result, msg=i)
     */
    //@+node:felix.20220129223719.45: *3* TestGlobals.test_g_skip_to_end_of_line
    /* def test_g_skip_to_end_of_line(self):
        s = 'a\n\nc'
        for i, result in (
            (-1, 1),  # One too few.
            (0, 1), (1, 1),
            (2, 2),
            (3, 4),
            (4, 4),  # One too many.
        ):
            j = g.skip_to_end_of_line(s, i)
            self.assertEqual(j, result, msg=i)
     */
    //@+node:felix.20220129223719.46: *3* TestGlobals.test_g_skip_to_start_of_line
    /* def test_g_skip_to_start_of_line(self):
        s1 = 'a\n\nc'
        table1 = (
            (-1, 0),  # One too few.
            (0, 0), (1, 0),
            (2, 2),
            (3, 3),
            (4, 4),  # One too many.
        )
        s2 = 'a\n'
        table2 = (
            (1, 0),
            (2, 2),
        )  # A special case at end.
        for s, table in ((s1, table1), (s2, table2)):
            for i, result in table:
                j = g.skip_to_start_of_line(s, i)
                self.assertEqual(j, result, msg=i)
     */
    //@+node:felix.20220129223719.47: *3* TestGlobals.test_g_splitLongFileName
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
            [undefined, undefined],  // Retain empty paths for warning.
            ['', ''],
            [g.app.loadDir, g.app.loadDir],
            ['<abc>', 'abc'],
            ['"abc"', 'abc'],
            ["'abc'", 'abc'],
        ];

        table.forEach(element => {
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
