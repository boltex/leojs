//@+leo-ver=5-thin
//@+node:felix.20230529171913.1: * @file src/test/test_importers.ts

import * as vscode from 'vscode';
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { Position } from '../core/leoNodes';
import { C_Importer } from '../importers/c';
import { Python_Importer } from '../importers/python';

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
    //@+node:felix.20230916151453.1: *3* BaseTestImporter.check_outline
    /**
     * BaseTestImporter.check_outline.
     *
     * Check that p's outline matches the expected results.
     *
     * Dump the actual outline if there is a mismatch.
     *
     */
    public check_outline(p: Position, expected: [number, string, string][]): void {
        try {
            const p0_level = p.level();
            const actual: [number, string, string][] = [...p.self_and_subtree()].map((z) => <[number, string, string]>[z.level(), z.h, z.b]);
            let a_level = 0;
            let a_h, a_str, e_level, e_h, e_str;
            for (let i = 0; i < actual.length; i++) {
                try {
                    [a_level, a_h, a_str] = actual[i];
                    [e_level, e_h, e_str] = expected[i];
                } catch (error) {
                    assert.strictEqual(false, true); // So we print the actual results.
                }
                const msg: string = `FAIL in node ${i} ${e_h}`;
                assert.strictEqual(a_level - p0_level, e_level, msg);
                if (i > 0) { //  Don't test top-level headline.
                    assert.strictEqual(e_h, a_h, msg);
                }
                assert.ok(g.compareArrays(g.splitLines(e_str), g.splitLines(a_str), true), msg);
            }
        } catch (error) {
            // Dump actual results, including bodies.
            this.dump_tree(p, 'Actual results...');
            throw error;
        }
    }
    //@+node:felix.20230529172038.3: *3* BaseTestImporter.check_round_trip


    /**
     * Assert that p's outline is equivalent to s.
     */
    public async check_round_trip(p: Position, s: string): Promise<void> {
        const c = this.c;
        s = s.trimEnd();  // Ignore trailing whitespace.
        let result_s = await c.atFileCommands.atAutoToString(p);
        result_s = result_s.trimEnd();  // Ignore trailing whitespace.

        // Ignore leading whitespace and all blank lines.
        const s_lines = g.splitLines(s).map(z => z.trimLeft()).filter(z => z.trim() !== '');
        const result_lines = result_s.split('\n').map(z => z.trimLeft()).filter(z => z.trim() !== '');

        if (s_lines.join('\n') !== result_lines.join('\n')) {
            g.trace('FAIL', g.caller(2));
            g.printObj(s_lines.map((z, i) => `${i.toString().padStart(4, ' ')} ${z}`), `expected: ${p.h}`);
            g.printObj(result_lines.map((z, i) => `${i.toString().padStart(4, ' ')} ${z}`), `results: ${p.h}`);
        }

        assert.ok(g.compareArrays(s_lines, result_lines));
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
    //@+node:felix.20230916201206.1: *3* BaseTestImporter.new_round_trip_test
    public async new_round_trip_test(s: string, expected_s?: string): Promise<void> {
        const p = await this.run_test(s);
        await this.check_round_trip(p, expected_s || s);
    }
    //@+node:felix.20230916201215.1: *3* BaseTestImporter.new_run_test
    /**
     * Run a unit test of an import scanner,
     * i.e., create a tree from string s at location p.
     */
    public async new_run_test(s: string, expected_results: [number, string, string][], short_id = "defaultShortId"): Promise<void> {
        const c = this.c;
        const ext = this.ext;
        const p = this.c.p;
        assert.ok(ext);

        // Run the test.
        const parent = p.insertAsLastChild();
        const kind = this.compute_unit_test_kind(ext);

        // TestCase.id() has the form leo.unittests.core.file.class.test_name
        // const id_parts = this.id().split('.');
        // this.short_id = `${id_parts[id_parts.length - 2]}.${id_parts[id_parts.length - 1]}`;
        // parent.h = `${kind} ${this.short_id}`;

        parent.h = `${kind} ${short_id}`;

        // createOutline calls Importer.gen_lines and Importer.check.
        const test_s = g.dedent(s).trim() + '\n';
        await c.importCommands.createOutline(parent.copy(), ext, test_s);

        // Dump the actual results on failure and raise AssertionError.
        this.check_outline(parent, expected_results);
    }
    //@+node:felix.20230529172038.6: *3* BaseTestImporter.run_test
    /**
     * Run a unit test of an import scanner,
     * i.e., create a tree from string s at location c.p.
     * Return the created tree.
     */
    public async run_test(s: string, short_id = "defaultShortId"): Promise<Position> {
        const c = this.c;
        const ext = this.ext;
        const p = this.c.p;

        assert.ok(ext);

        // Run the test.
        const parent = p.insertAsLastChild();
        const kind = this.compute_unit_test_kind(ext);

        // TestCase.id() has the form leo.unittests.core.file.class.test_name
        // const id_parts = this.id().split('.');
        // this.short_id = `${id_parts[id_parts.length - 2]}.${id_parts[id_parts.length - 1]}`;
        // parent.h = `${kind} ${this.short_id}`;

        parent.h = `${kind} ${short_id}`;

        // createOutline calls Importer.gen_lines and Importer.check.
        const test_s = g.dedent(s).trim() + '\n';
        await c.importCommands.createOutline(parent.copy(), ext, test_s);

        return parent;
    }
    //@-others

}
//@+node:felix.20230916220459.1: ** suite TestC
suite('TestC', () => {

    let self: BaseTestImporter;
    // ext = '.c'

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.c';
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
    //@+node:felix.20230916220459.2: *3* TestC.test_c_class_1
    test('test_c_class_1', async () => {

        const s = `
            class cTestClass1 {

                int foo (int a) {
                    a = 2 ;
                }

                char bar (float c) {
                    ;
                }
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
            [1, 'class cTestClass1',
                'class cTestClass1 {\n' +
                '    @others\n' +
                '}\n'
            ],
            [2, 'func foo',
                'int foo (int a) {\n' +
                '    a = 2 ;\n' +
                '}\n'
            ],
            [2, 'func bar',
                'char bar (float c) {\n' +
                '    ;\n' +
                '}\n'
            ],
        ];

        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.3: *3* TestC.test_class_underindented_line
    test('test_class_underindented_line', async () => {
        const s = `
            class cTestClass1 {

                int foo (int a) {
            // an underindented line.
                    a = 2 ;
                }

                // This should go with the next function.

                char bar (float c) {
                    ;
                }
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
            [1, 'class cTestClass1',
                'class cTestClass1 {\n' +
                '@others\n' +
                '}\n'
            ],
            [2, 'func foo',
                '    int foo (int a) {\n' +
                '// an underindented line.\n' +
                '        a = 2 ;\n' +
                '    }\n'
            ],
            [2, 'func bar',
                '    // This should go with the next function.\n' +
                '\n' +
                '    char bar (float c) {\n' +
                '        ;\n' +
                '    }\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.4: *3* TestC.test_open_curly_bracket_on_next_line
    test('test_open_curly_bracket_on_next_line', async () => {
        const s = `
            void
            aaa::bbb::doit(awk* b)
            {
                assert(false);
            }

            bool
            aaa::bbb::dothat(xyz *b) // trailing comment.
            {
                return true;
            } // comment
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
            [1, 'func doit',
                'void\n' +
                'aaa::bbb::doit(awk* b)\n' +
                '{\n' +
                '    assert(false);\n' +
                '}\n'
            ],
            [1, 'func dothat',
                'bool\n' +
                'aaa::bbb::dothat(xyz *b) // trailing comment.\n' +
                '{\n' +
                '    return true;\n' +
                '} // comment\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.5: *3* TestC.test_extern
    test('test_extern', async () => {
        const s = `
            extern "C"
            {
            #include "stuff.h"
            void    init(void);
            #include "that.h"
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                'extern "C"\n' +
                '{\n' +
                '#include "stuff.h"\n' +
                'void    init(void);\n' +
                '#include "that.h"\n' +
                '}\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.6: *3* TestC.test_old_style_decl_1
    test('test_old_style_decl_1', async () => {
        const s = `
            static void
            ReleaseCharSet(cset)
                CharSet *cset;
            {
                ckfree((char *)cset->chars);
                if (cset->ranges) {
                ckfree((char *)cset->ranges);
                }
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                'static void\n' +
                'ReleaseCharSet(cset)\n' +
                '    CharSet *cset;\n' +
                '{\n' +
                '    ckfree((char *)cset->chars);\n' +
                '    if (cset->ranges) {\n' +
                '    ckfree((char *)cset->ranges);\n' +
                '    }\n' +
                '}\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.7: *3* TestC.test_old_style_decl_2
    test('test_old_style_decl_2', async () => {
        const s = `
            Tcl_Obj *
            Tcl_NewLongObj(longValue)
                register long longValue; /* Long integer used to initialize the
                     * new object. */
            {
                return Tcl_DbNewLongObj(longValue, "unknown", 0);
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                'Tcl_Obj *\n' +
                'Tcl_NewLongObj(longValue)\n' +
                '    register long longValue; /* Long integer used to initialize the\n' +
                '         * new object. */\n' +
                '{\n' +
                '    return Tcl_DbNewLongObj(longValue, "unknown", 0);\n' +
                '}\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.8: *3* TestC.test_template
    test('test_template', async () => {
        const s = `
            template <class T>
            T GetMax (T a, T b) {
              T result;
              result = (a>b)? a : b;
              return (result);
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
            [1, 'func GetMax',
                'template <class T>\n' +
                'T GetMax (T a, T b) {\n' +
                '  T result;\n' +
                '  result = (a>b)? a : b;\n' +
                '  return (result);\n' +
                '}\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@+node:felix.20230916220459.9: *3* TestC.test_delete_comments_and_strings
    test('test_delete_comments_and_strings', () => {

        const importer = new C_Importer(self.c);

        const lines = [
            'i = 1 // comment.\n',
            's = "string"\n',
            'if (/* a */1)\n',
            '    ;\n',
            '/*\n',
            '    if (1): a = 2\n',
            '*/\n',
            'i = 2\n'
        ];
        const expected_lines = [
            'i = 1 \n',
            's = \n',
            'if (1)\n',
            '    ;\n',
            '\n',
            '\n',
            '\n',
            'i = 2\n'
        ];
        const result = importer.delete_comments_and_strings(lines);
        assert.strictEqual(result.length, expected_lines.length);
        assert.ok(g.compareArrays(result, expected_lines));

    });
    //@+node:felix.20230916220459.10: *3* TestC.test_find_blocks
    test('test_find_blocks', () => {

        let trace = false;
        const importer = new C_Importer(self.c);
        const lines = g.splitLines(g.dedent(`\

        # enable-trace

        namespace {
            n1;
        }

        namespace outer {
            n2;
        }

        int foo () {
            foo1;
            foo2;
        }

        class class1 {
            class1;
        }

        class class2 {
            x = 2;
            int bar (a, b) {
                if (0) {
                    a = 1;
                }
            }
        }
        `));

        importer.lines = lines;
        importer.guide_lines = importer.make_guide_lines(lines);
        const blocks = importer.find_blocks(0, lines.length);
        if (trace) {
            console.log('');
            g.trace('Blocks...');
            for (const z of blocks) {
                let [kind, name, start, start_body, end] = z;
                // TypeScript equivalent
                console.log(`${kind.padStart(10)} ${name.padEnd(20)} ${start.toString().padStart(4)} ${start_body.toString().padStart(4)} ${end.toString().padStart(4)}`);
            }

        }
        // The result lines must tile (cover) the original lines.
        const result_lines = [];
        for (const z of blocks) {
            let [kind, name, start, start_body, end] = z;
            result_lines.push(...lines.slice(start, end));
        }

        assert.ok(g.compareArrays(lines, result_lines));

    });
    //@+node:felix.20230916220459.11: *3* TestC.test_codon_file
    test('test_codon_file', async () => {
        // Test codon/codon/app/main.cpp.

        let trace = false;
        const c = self.c;
        const importer = new C_Importer(c);

        const w_path = 'C:/Repos/codon/codon/app/main.cpp';
        const w_exists = await g.os_path_exists(w_path);
        if (!w_exists) {
            return;
            // self.skipTest(`Not found: ${w_path}`);
        }

        // with open(path, 'r') as f
        //     source = f.read();
        let [source, e] = await g.readFileIntoString(w_path);


        const lines = g.splitLines(source);
        if (1) {  // Test gen_lines.
            importer.root = c.p;
            importer.gen_lines(lines, c.p);
            if (trace) {
                for (const p of c.p.self_and_subtree()) {
                    g.printObj(p.b, p.h);
                }
            }
        } else { // Test find_blocks.
            importer.guide_lines = importer.make_guide_lines(lines);
            const result = importer.find_blocks(0, importer.guide_lines.length);
            if (trace) {
                console.log('');
                g.trace();
                for (const z of result) {
                    let [kind, name, start, start_body, end] = z;
                    console.log(`${kind.toString().padStart(10)} ${name.toString().padEnd(20)} ${start.toString().padStart(4)} ${start_body.toString().padStart(4)} ${end.toString().padStart(4)}`);
                }

            }
            // The result lines must tile (cover) the original lines.
            const result_lines = [];
            for (const z of result) {
                let [kind, name, start, start_body, end] = z;
                result_lines.push(...lines.slice(start, end));
            }

            assert.ok(g.compareArrays(lines, result_lines));

        }
    });
    //@+node:felix.20230916220459.12: *3* TestC.test_struct
    test('test_struct', async () => {
        //  From codon soources.
        const s = `
        struct SrcInfoAttribute : public Attribute {
          static const std::string AttributeName;

          std::unique_ptr<Attribute> clone(util::CloneVisitor &cv) const override {
            return std::make_unique<SrcInfoAttribute>(*this);
          }

        private:
          std::ostream &doFormat(std::ostream &os) const override { return os << info; }
        };
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language c\n' +
                '@tabwidth -4\n'
            ],
            [1, 'struct SrcInfoAttribute',
                'struct SrcInfoAttribute : public Attribute {\n' +
                '  static const std::string AttributeName;\n' +
                '\n' +
                '  std::unique_ptr<Attribute> clone(util::CloneVisitor &cv) const override {\n' +
                '    return std::make_unique<SrcInfoAttribute>(*this);\n' +
                '  }\n' +
                '\n' +
                'private:\n' +
                '  std::ostream &doFormat(std::ostream &os) const override { return os << info; }\n' +
                '};\n'
            ],
        ];
        await self.new_run_test(s, expected_results);

    });
    //@-others

});



//@+node:felix.20230917230509.1: ** suite TestPython
suite('TestPython', () => {

    let self: BaseTestImporter;
    // ext = '.py'

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.py';
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
    //@+node:felix.20230917230509.2: *3* TestPython.test_delete_comments_and_strings

    test('test_delete_comments_and_strings', () => {

        const importer = new Python_Importer(self.c);

        const lines = [
            'i = 1 # comment.\n',
            's = "string"\n',
            "s2 = 'string'\n",
            'if 1:\n',
            '    pass \n',
            '"""\n',
            '    if 1: a = 2\n',
            '"""\n',
            "'''\n",
            '    if 2: a = 2\n',
            "'''\n",
            'i = 2\n',
            // #3517: f-strings.
            // mypy/build.py line 430.
            `plugin_error(f'Can\\'t find plugin "{plugin_path}"')` + '\n',
        ];
        const expected_lines = [
            'i = 1 \n',
            's = \n',
            's2 = \n',
            'if 1:\n',
            '    pass \n',
            '\n',
            '\n',
            '\n',
            '\n',
            '\n',
            '\n',
            'i = 2\n',
            'plugin_error()\n',
        ];
        const result = importer.delete_comments_and_strings(lines);
        assert.strictEqual(result.length, expected_lines.length);
        assert.ok(g.compareArrays(result, expected_lines));
    });
    //@+node:felix.20230917230509.3: *3* TestPython.test_general_test_1
    test('test_general_test_1', async () => {
        let s =
            `
            import sys
            def f1():
                pass

            class Class1:
                def method11():
                    pass
                def method12():
                    pass

            #
            # Define a = 2
            a = 2

            def f2():
                pass

            # An outer comment
            ATmyClassDecorator
            class Class2:
                def method21():
                    print(1)
                    print(2)
                    print(3)
                ATmyDecorator
                def method22():
                    pass
                def method23():
                    pass

            class UnderindentedComment:
            # Outer underindented comment
                def u1():
                # Underindented comment in u1.
                    pass

            # About main.

            def main():
                pass

            if __name__ == '__main__':
                main()
        `;
        s = s.replace(/AT/g, '@');

        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '<< TestPython.test_general_test_1: preamble >>\n' +
                '@others\n' +
                '\n' +
                "if __name__ == '__main__':\n" +
                '    main()\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< TestPython.test_general_test_1: preamble >>',
                'import sys\n'
            ],
            [1, 'function: f1',
                'def f1():\n' +
                '    pass\n'
            ],
            [1, 'class Class1',
                'class Class1:\n' +
                '    @others\n'
            ],
            [2, 'Class1.method11',
                'def method11():\n' +
                '    pass\n'
            ],
            [2, 'Class1.method12',
                'def method12():\n' +
                '    pass\n'
            ],
            [1, 'function: f2',
                '#\n' +
                '# Define a = 2\n' +
                'a = 2\n' +
                '\n' +
                'def f2():\n' +
                '    pass\n'
            ],
            [1, 'class Class2',
                '# An outer comment\n' +
                '@myClassDecorator\n' +
                'class Class2:\n' +
                '    @others\n'
            ],
            [2, 'Class2.method21',
                'def method21():\n' +
                '    print(1)\n' +
                '    print(2)\n' +
                '    print(3)\n'
            ],
            [2, 'Class2.method22',
                '@myDecorator\n' +
                'def method22():\n' +
                '    pass\n'
            ],
            [2, 'Class2.method23',
                'def method23():\n' +
                '    pass\n'
            ],
            [1, 'class UnderindentedComment',
                'class UnderindentedComment:\n' +
                '@others\n'  // The underindented comments prevents indentaion
            ],
            [2, 'UnderindentedComment.u1',
                '# Outer underindented comment\n' +
                '    def u1():\n' +
                '    # Underindented comment in u1.\n' +
                '        pass\n'
            ],
            [1, 'function: main',
                '# About main.\n' +
                '\n' +
                'def main():\n' +
                '    pass\n'
            ],
        ];
        await self.new_run_test(s, expected_results, 'TestPython.test_general_test_1');
    });
    //@+node:felix.20230917230509.4: *3* TestPython.test_long_declaration
    test('test_long_declaration', async () => {
        // ekr-mypy2/mypy/applytype.py

        // Note: the return type uses the python 3.11 syntax for Union.

        const s = `
        def get_target_type(
            tvar: TypeVarLikeType,
            type: Type,
            callable: CallableType,
        ) -> Type | None:
            if isinstance(tvar, ParamSpecType):
                return type
            if isinstance(tvar, TypeVarTupleType):
                return type
            return type
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, 'function: get_target_type',
                'def get_target_type(\n' +
                '    tvar: TypeVarLikeType,\n' +
                '    type: Type,\n' +
                '    callable: CallableType,\n' +
                ') -> Type | None:\n' +
                '    if isinstance(tvar, ParamSpecType):\n' +
                '        return type\n' +
                '    if isinstance(tvar, TypeVarTupleType):\n' +
                '        return type\n' +
                '    return type\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230917230509.5: *3* TestPython.test_nested_classes
    test('test_nested_classes', async () => {
        const s = `
            class TestCopyFile(unittest.TestCase):
                _delete = False
                a00 = 1
                class Faux(object):
                    _entered = False
                    _exited_with = None # type: tuple
                    _raised = False
            `;
        // mypy/test-data/stdlib-samples/3.2/test/shutil.py
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, 'class TestCopyFile',
                'class TestCopyFile(unittest.TestCase):\n' +
                '    ATothers\n'.replace('AT', '@')
            ],
            [2, 'class Faux',
                '_delete = False\n' +
                'a00 = 1\n' +
                'class Faux(object):\n' +
                '    _entered = False\n' +
                '    _exited_with = None # type: tuple\n' +
                '    _raised = False\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230917230509.6: *3* TestPython.test_no_methods
    test('test_no_methods', async () => {
        const s = `
            class A:
                a=1
                b=2
                c=3
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, 'class A',
                'class A:\n' +
                '    a=1\n' +
                '    b=2\n' +
                '    c=3\n'
            ]
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230917230509.7: *3* TestPython.test_oneliners
    test('test_oneliners', async () => {
        const s = `
            import sys
            def f1():
                pass

            class Class1:pass
            a = 2
            @dec_for_f2
            def f2(): pass


            class A: pass
            # About main.
            def main():
                pass

            if __name__ == '__main__':
                main()
        `;

        // Note: new_gen_block deletes leading and trailing whitespace from all blocks.
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '<< TestPython.test_oneliners: preamble >>\n' +
                '@others\n' +
                '\n' +
                "if __name__ == '__main__':\n" +
                '    main()\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< TestPython.test_oneliners: preamble >>',
                'import sys\n'
            ],
            [1, 'function: f1',
                'def f1():\n' +
                '    pass\n'
            ],
            [1, 'class Class1',
                'class Class1:pass\n'
            ],
            [1, 'function: f2',
                'a = 2\n' +
                '@dec_for_f2\n' +
                'def f2(): pass\n'
            ],
            [1, 'class A',
                'class A: pass\n'
            ],
            [1, 'function: main',
                '# About main.\n' +
                'def main():\n' +
                '    pass\n'
            ],
        ];
        await self.new_run_test(s, expected_results, ' TestPython.test_oneliners');
    });
    //@+node:felix.20230917230509.8: *3* TestPython.test_post_process
    test('test_post_process', async () => {
        const s = `
            """Module-level docstring"""

            from __future__ import annotations

            class C1:
                """Class docstring"""

                def __init__(self):
                    pass

            def f1():
                pass

            `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '"""Module-level docstring"""\n' +
                '<< TestPython.test_post_process: preamble >>\n' +
                '@others\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< TestPython.test_post_process: preamble >>',
                '\n' +
                'from __future__ import annotations\n' +
                '\n'
            ],
            [1, 'class C1',
                'class C1:\n' +
                '    """Class docstring"""\n' +
                '\n' +
                '    @others\n'
            ],
            [2, 'C1.__init__',
                'def __init__(self):\n' +
                '    pass\n'
            ],
            [1, 'function: f1',
                'def f1():\n' +
                '    pass\n'
            ],
        ];
        await self.new_run_test(s, expected_results, 'TestPython.test_post_process');
    });
    //@+node:felix.20230917230509.9: *3* TestPython.test_preamble
    test('test_preamble', async () => {
        const s = `
            # This file is part of Leo: https://leo-editor.github.io/leo-editor
            """
            This is a docstring.
            """
            import sys
            from leo.core import leoGlobals as g

            def f():
                g.trace()
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '<< TestPython.test_preamble: docstring >>\n' +
                '<< TestPython.test_preamble: declarations >>\n' +
                '@others\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< TestPython.test_preamble: docstring >>',
                '# This file is part of Leo: https://leo-editor.github.io/leo-editor\n' +
                '"""\n' +
                'This is a docstring.\n' +
                '"""\n'
            ],
            [1, '<< TestPython.test_preamble: declarations >>',
                'import sys\n' +
                'from leo.core import leoGlobals as g\n' +
                '\n'
            ],
            [1, 'function: f',
                'def f():\n' +
                '    g.trace()\n'
            ],
        ];
        await self.new_run_test(s, expected_results, 'TestPython.test_preamble');
    });
    //@+node:felix.20230917230509.10: *3* TestPython.test_strange_indentation
    test('test_strange_indentation', async () => {
        const s = `
            a = 1
            if 1:
             print('1')
            if 2:
              print('2')
            if 3:
               print('3')
            if 4:
                print('4')
            if 5:
                print('5')
            if 6:
                print('6')
            if 7:
                print('7')
            if 8:
                print('8')
            if 9:
                print('9')
            if 10:
                print('10')
            if 11:
                print('11')
            if 12:
                print('12')
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                'a = 1\n' +
                'if 1:\n' +
                " print('1')\n" +
                'if 2:\n' +
                "  print('2')\n" +
                'if 3:\n' +
                "   print('3')\n" +
                'if 4:\n' +
                "    print('4')\n" +
                'if 5:\n' +
                "    print('5')\n" +
                'if 6:\n' +
                "    print('6')\n" +
                'if 7:\n' +
                "    print('7')\n" +
                'if 8:\n' +
                "    print('8')\n" +
                'if 9:\n' +
                "    print('9')\n" +
                'if 10:\n' +
                "    print('10')\n" +
                'if 11:\n' +
                "    print('11')\n" +
                'if 12:\n' +
                "    print('12')\n" +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230917230509.11: *3* TestPython.test_nested_defs
    test('test_nested_defs', async () => {
        // See #3517

        // A simplified version of code in mypy/build.py.
        const s = `
                def load_plugins_from_config(
                    options: Options, errors: Errors, stdout: TextIO
                ) -> tuple[list[Plugin], dict[str, str]]:
                    """Load all configured plugins."""
    
                    snapshot: dict[str, str] = {}
    
                    def plugin_error(message: str) -> NoReturn:
                        errors.report(line, 0, message)
                        errors.raise_error(use_stdout=False)
    
                    custom_plugins: list[Plugin] = []
            `;


        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language python\n' +
                '@tabwidth -4\n'
            ],
            [1, 'function: load_plugins_from_config',
                'def load_plugins_from_config(\n' +
                '    options: Options, errors: Errors, stdout: TextIO\n' +
                ') -> tuple[list[Plugin], dict[str, str]]:\n' +
                '    """Load all configured plugins."""\n' +
                '\n' +
                '    snapshot: dict[str, str] = {}\n' +
                '\n' +
                '    def plugin_error(message: str) -> NoReturn:\n' +
                '        errors.report(line, 0, message)\n' +
                '        errors.raise_error(use_stdout=False)\n' +
                '\n' +
                '    custom_plugins: list[Plugin] = []\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@-others

});



//@-others
//@-leo
