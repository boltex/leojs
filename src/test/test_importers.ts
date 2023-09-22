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
import { Coffeescript_Importer } from '../importers/coffeescript';

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
        const s_lines = g.splitLines(s).map(z => z.trimStart()).filter(z => z.trim() !== '');
        const result_lines = g.splitLines(result_s).map(z => z.trimStart()).filter(z => z.trim() !== '');

        if (s_lines.join('\n') !== result_lines.join('\n')) {
            g.trace('FAIL', g.caller(2));
            g.printObj(s_lines.map((z, i) => `${i.toString().padStart(4, ' ')} ${z}`), `expected: ${p.h}`);
            g.printObj(result_lines.map((z, i) => `${i.toString().padStart(4, ' ')} ${z}`), `results: ${p.h}`);
        }

        assert.ok(g.compareArrays(s_lines, result_lines, true));
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
        assert.ok(g.compareArrays(result, expected_lines, true));

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

        assert.ok(g.compareArrays(lines, result_lines, true));

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

            assert.ok(g.compareArrays(lines, result_lines, true));

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
//@+node:felix.20230919214345.1: ** suite TestCoffeescript
suite('TestCoffeescript', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.coffee';
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
    //@+node:felix.20230919214345.2: *3* TestCoffeescript.test_1
    //@@tabwidth -2 // Required
    test('test_1', async () => {

        // ! NOTE: RAW STRING do not exist in javascript, except when declaring regex with slashes.
        const s = `
        # Js2coffee relies on Narcissus's parser.

        {parser} = @Narcissus or require('./narcissus_packed')

        # Main entry point

        buildCoffee = (str) ->
          str  = str.replace /\\r/g, ''
          str += "\\n"

          builder    = new Builder
          scriptNode = parser.parse str
        `;

        const expected_results: [number, string, string][] = [

            [0, '',  // Ignore the first headline.
                '<< TestCoffeescript.test_1: preamble >>\n' +
                '@others\n' +
                '@language coffeescript\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< TestCoffeescript.test_1: preamble >>',
                "# Js2coffee relies on Narcissus's parser.\n" +
                '\n' +
                "{parser} = @Narcissus or require('./narcissus_packed')\n" +
                '\n' +
                '# Main entry point\n' +
                '\n'
            ],
            [1, 'def buildCoffee',
                'buildCoffee = (str) ->\n' +
                "  str  = str.replace /\\r/g, ''\n" +
                '  str += "\\n"\n' +
                '\n' +
                '  builder    = new Builder\n' +
                '  scriptNode = parser.parse str\n'
            ],
        ];

        await self.new_run_test(s, expected_results, 'TestCoffeescript.test_1');

    });
    //@+node:felix.20230919214345.3: *3* TestCoffeescript.test_2
    //@@tabwidth -2 // Required
    test('test_2', async () => {

        const s = `
          class Builder
            constructor: ->
              @transformer = new Transformer
            # ` + "`build()`" + `

            build: (args...) ->
              node = args[0]
              @transform node

              name = 'other'
              name = node.typeName()  if node != undefined and node.typeName

              fn  = (@[name] or @other)
              out = fn.apply(this, args)

              if node.parenthesized then paren(out) else out
            # `+ "`transform()`" + `

            transform: (args...) ->
              @transformer.transform.apply(@transformer, args)

            # `+ "`body()`" + `

            body: (node, opts={}) ->
              str = @build(node, opts)
              str = blockTrim(str)
              str = unshift(str)
              if str.length > 0 then str else ""

          `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language coffeescript\n' +
                '@tabwidth -4\n'
            ],
            [1, 'class Builder',
                'class Builder\n' +
                '  @others\n'
            ],
            [2, 'Builder.constructor',
                'constructor: ->\n' +
                '  @transformer = new Transformer\n'
            ],
            [2, 'Builder.build',
                '# `build()`\n' +
                '\n' +
                'build: (args...) ->\n' +
                '  node = args[0]\n' +
                '  @transform node\n' +
                '\n' +
                "  name = 'other'\n" +
                '  name = node.typeName()  if node != undefined and node.typeName\n' +
                '\n' +
                '  fn  = (@[name] or @other)\n' +
                '  out = fn.apply(this, args)\n' +
                '\n' +
                '  if node.parenthesized then paren(out) else out\n'
            ],
            [2, 'Builder.transform',
                '# `transform()`\n' +
                '\n' +
                'transform: (args...) ->\n' +
                '  @transformer.transform.apply(@transformer, args)\n'
            ],
            [2, 'Builder.body',
                '# `body()`\n' +
                '\n' +
                'body: (node, opts={}) ->\n' +
                '  str = @build(node, opts)\n' +
                '  str = blockTrim(str)\n' +
                '  str = unshift(str)\n' +
                '  if str.length > 0 then str else ""\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230919214345.4: *3* TestCoffeescript.test_get_leading_indent
    test('test_get_leading_indent', () => {
        const c = self.c;
        const importer = new Coffeescript_Importer(c);
        assert.strictEqual(importer.single_comment, '#');
    });
    //@+node:felix.20230919214345.5: *3* TestCoffeescript.test_scan_line
    test('test_scan_line', () => {
        const c = self.c;
        const x = new Coffeescript_Importer(c);
        assert.strictEqual(x.single_comment, '#');
    });
    //@-others

});
//@+node:felix.20230919214349.1: ** suite TestCSharp
suite('TestCSharp', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.c#';
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
    //@+node:felix.20230919214349.2: *3* TestCSharp.test_namespace_indent
    test('test_namespace_indent', async () => {
        const s = `
            namespace {
                class cTestClass1 {
                    ;
                }
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language csharp\n' +
                '@tabwidth -4\n'
            ],
            [1, 'unnamed namespace',
                'namespace {\n' +
                '    @others\n' +
                '}\n'
            ],
            [2, 'class cTestClass1',
                'class cTestClass1 {\n' +
                '    ;\n' +
                '}\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230919214349.3: *3* TestCSharp.test_namespace_no_indent
    test('test_namespace_no_indent', async () => {
        const s = `
            namespace {
            class cTestClass1 {
                ;
            }
            }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language csharp\n' +
                '@tabwidth -4\n'
            ],
            [1, 'unnamed namespace',
                'namespace {\n' +
                '@others\n' +
                '}\n'
            ],
            [2, 'class cTestClass1',
                'class cTestClass1 {\n' +
                '    ;\n' +
                '}\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@-others

});
//@+node:felix.20230919214352.1: ** suite TestCython
suite('TestCython', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.pyx';
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
    //@+node:felix.20230919214352.2: *3* TestCython.test_importer
    test('test_importer', async () => {
        const s = `
            from libc.math cimport pow

            cdef double square_and_add (double x):
                """Compute x^2 + x as double.

                This is a cdef function that can be called from within
                a Cython program, but not from Python.
                """
                return pow(x, 2.0) + x

            cpdef print_result (double x):
                """This is a cpdef function that can be called from Python."""
                print("({} ^ 2) + {} = {}".format(x, x, square_and_add(x)))
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // check_outlines ignores the first headline.
                '<< TestCython.test_importer: preamble >>\n' +
                '@others\n' +
                '@language cython\n' +
                '@tabwidth -4\n'
            ],
            [1, '<< TestCython.test_importer: preamble >>',
                'from libc.math cimport pow\n' +
                '\n'
            ],
            [1, 'cdef double square_and_add',
                'cdef double square_and_add (double x):\n' +
                '    """Compute x^2 + x as double.\n' +
                '\n' +
                '    This is a cdef function that can be called from within\n' +
                '    a Cython program, but not from Python.\n' +
                '    """\n' +
                '    return pow(x, 2.0) + x\n'
            ],
            [1, 'cpdef print_result',
                'cpdef print_result (double x):\n' +
                '    """This is a cpdef function that can be called from Python."""\n' +
                '    print("({} ^ 2) + {} = {}".format(x, x, square_and_add(x)))\n'
            ],
        ];
        await self.new_run_test(s, expected_results, 'TestCython.test_importer');
    });
    //@-others

});
//@+node:felix.20230920230715.1: ** suite TestDart
suite('TestDart', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.dart';
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
    //@+node:felix.20230920230715.2: *3* TestDart.test_hello_world
    test('test_hello_world', async () => {
        const s = `
        var name = 'Bob';

        hello() {
          print('Hello, World!');
        }

        // Define a function.
        printNumber(num aNumber) {
          print('The number is $aNumber.'); // Print to console.
        }

        // This is where the app starts executing.
        void main() {
          var number = 42; // Declare and initialize a variable.
          printNumber(number); // Call a function.
        }
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language dart\n' +
                '@tabwidth -4\n'
            ],
            [1, 'function hello',
                "var name = 'Bob';\n" +
                '\n' +
                'hello() {\n' +
                "  print('Hello, World!');\n" +
                '}\n'
            ],
            [1, 'function printNumber',
                '// Define a function.\n' +
                'printNumber(num aNumber) {\n' +
                "  print('The number is $aNumber.'); // Print to console.\n" +
                '}\n'
            ],
            [1, 'function void main',
                '// This is where the app starts executing.\n' +
                'void main() {\n' +
                '  var number = 42; // Declare and initialize a variable.\n' +
                '  printNumber(number); // Call a function.\n' +
                '}\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@-others

});
//@+node:felix.20230920230719.1: ** suite TestElisp
suite('TestElisp', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.el';
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
    //@+node:felix.20230920230719.2: *3* TestElisp.test_1
    test('test_1', async () => {
        // Add weird assignments for coverage.
        const s = `
            ;;; comment
            ;;; continue
            ;;;

            (defun abc (a b)
               (assn a "abc")
               (assn b \\x)
               (+ 1 2 3))

            ; comment re cde
            (defun cde (a b)
               (+ 1 2 3))
        `;
        const expected_results: [number, string, string][] = [
            [0, '', // Ignore the first headline.
                '@others\n' +
                '@language lisp\n' +
                '@tabwidth -4\n'
            ],
            [1, 'defun abc',
                ';;; comment\n' +
                ';;; continue\n' +
                ';;;\n' +
                '\n' +
                '(defun abc (a b)\n' +
                '   (assn a "abc")\n' +
                '   (assn b \\x)\n' +
                '   (+ 1 2 3))\n'
            ],
            [1, 'defun cde',
                '; comment re cde\n' +
                '(defun cde (a b)\n' +
                '   (+ 1 2 3))\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@-others

});
//@+node:felix.20230921214523.1: ** suite TestHtml
suite('TestHtml', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.htm';
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        const c = self.c;
        // Simulate @data import-html-tags, with *only* standard tags.
        const tags_list = ['html', 'body', 'head', 'div', 'script', 'table'];
        let [settingsDict, junk] = g.app.loadManager!.createDefaultSettingsDicts();
        c.config.settingsDict = settingsDict;
        c.config.set(c.p, 'data', 'import-html-tags', tags_list, true);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230921214523.2: *3* TestHtml.test_brython
    test('test_brython', async () => {
        // https://github.com/leo-editor/leo-editor/issues/479
        const s = `
            <!DOCTYPE html>
            <html>
            <head>
            <script type="text/python3">
            """Code for the header menu"""
            from browser import document as doc
            from browser import html
            import header
            </script>
            <title>Brython</title>
            <link rel="stylesheet" href="Brython_files/doc_brython.css">
            </head>
            <body onload="brython({debug:1, cache:'none'})">
            <!-- comment -->
            </body>
            </html>
        `;

        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<!DOCTYPE html>\n' +
                '<html>\n' +
                '@others\n' +
                '</html>\n'
            ],
            [2, '<head>',
                '<head>\n' +
                '@others\n' +
                '<title>Brython</title>\n' +
                '<link rel="stylesheet" href="Brython_files/doc_brython.css">\n' +
                '</head>\n'
            ],
            [3, '<script type="text/python3">',
                '<script type="text/python3">\n' +
                '"""Code for the header menu"""\n' +
                'from browser import document as doc\n' +
                'from browser import html\n' +
                'import header\n' +
                '</script>\n'
            ],
            [2, `<body onload="brython({debug:1, cache:'none'})">`,
                '<body onload="brython({debug:1, cache:\'none\'})">\n' +
                '<!-- comment -->\n' +
                '</body>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.3: *3* TestHtml.test_improperly_nested_tags
    test('test_improperly_nested_tags', async () => {
        const s = `
            <body>

            <!-- OOPS: the div and p elements not properly nested.-->
            <!-- OOPS: this table got generated twice. -->

            <p id="P1">
            <div id="D666">Paragraph</p> <!-- P1 -->
            <p id="P2">

            <TABLE id="T666"></TABLE></p> <!-- P2 -->
            </div>
            </p> <!-- orphan -->

            </body>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<body>',
                '<body>\n' +
                '@others\n' +
                '</p> <!-- orphan -->\n' +
                '\n' +
                '</body>\n'
            ],
            [2, '<div id="D666">Paragraph</p> <!-- P1 -->',
                '<!-- OOPS: the div and p elements not properly nested.-->\n' +
                '<!-- OOPS: this table got generated twice. -->\n' +
                '\n' +
                '<p id="P1">\n' +
                '<div id="D666">Paragraph</p> <!-- P1 -->\n' +
                '@others\n' +
                '</div>\n'
            ],
            [3, '<TABLE id="T666"></TABLE></p> <!-- P2 -->',
                '<p id="P2">\n' +
                '\n' +
                '<TABLE id="T666"></TABLE></p> <!-- P2 -->\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.4: *3* TestHtml.test_improperly_terminated_tags
    test('test_improperly_terminated_tags', async () => {
        const s = `
            <html>

            <head>
                <!-- oops: link elements terminated two different ways -->
                <link id="L1">
                <link id="L2">
                <link id="L3" />
                <link id='L4' />

                <title>TITLE</title>

            <!-- oops: missing tags. -->
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '    <!-- oops: link elements terminated two different ways -->\n' +
                '    <link id="L1">\n' +
                '    <link id="L2">\n' +
                '    <link id="L3" />\n' +
                "    <link id='L4' />\n" +
                '\n' +
                '    <title>TITLE</title>\n' +
                '\n' +
                '<!-- oops: missing tags. -->\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<head>',
                '<html>\n' +
                '\n' +
                '<head>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.5: *3* TestHtml.test_mixed_case_tags
    test('test_mixed_case_tags', async () => {
        const s = `
            <html>
            <HEAD>
                <title>Bodystring</title>
            </head>
            <body class="bodystring">
            <div id='bodydisplay'></div>
            </body>
            </HTML>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<html>\n' +
                '@others\n' +
                '</HTML>\n'
            ],
            [2, '<HEAD>',  // We don't want to lowercase *all* headlines.
                '<HEAD>\n' +
                '    <title>Bodystring</title>\n' +
                '</head>\n'
            ],
            [2, '<body class="bodystring">',
                '<body class="bodystring">\n' +
                "<div id='bodydisplay'></div>\n" +
                '</body>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.6: *3* TestHtml.test_multiple_tags_on_a_line
    test('test_multiple_tags_on_a_line', async () => {

        //@+<< define s >>
        //@+node:felix.20230921214523.7: *4* << define s >>
        // tags that cause nodes: html, head, body, div, table, nodeA, nodeB
        // NOT: tr, td, tbody, etc.
        const s = `
            <html>
            <body>
                <table id="0">
                    <tr valign="top">
                    <td width="619">


                        <table id="3">
                        <tr>
                        <td width="368">
                        <table id="4">
                            <tbody id="5">
                            <tr valign="top">
                            <td width="550">
                            <table id="6">
                                <tbody id="6">
                                <tr>
                                <td class="blutopgrabot"><a href="href1">Listing Standards</a> |
                                    <a href="href2">Fees</a> |
                                    <strong>Non-compliant Issuers</strong> |
                                    <a href="href3">Form 25 Filings</a></td>
                                </tr>
                                </tbody>
                            </table>
                            </td>
                            </tr><tr>
                            <td width="100%" colspan="2">
                            <br />
                            </td>
                            </tr>
                            </tbody>
                        </table>
                        </td>
                        </tr>
                    </table>
                    <!-- View First part -->
                    </td>
                    <td width="242">
                    <!-- View Second part -->
                    </td>
                    </tr></table>
                <DIV class="webonly">
                    <script src="/scripts/footer.js"></script>
                </DIV>
                </td>
                </tr>
                <script language="JavaScript1.1">var SA_ID="nyse;nyse";</script>
                <script language="JavaScript1.1" src="/scripts/stats/track.js"></script>
                <noscript><img src="/scripts/stats/track.js" height="1" width="1" alt="" border="0"></noscript>
            </body>
            </html>
        `;
        //@-<< define s >>

        // xml.preprocess_lines inserts several newlines.
        // Modify the expected result accordingly.

        const expected_s: string = s.replace(/Form 25 Filings<\/a><\/td>\n/g, 'Form 25 Filings</a>\n</td>\n')
            .replace(/<\/tr><tr>\n/g, '</tr>\n<tr>\n')
            .replace(/<\/tr><\/table>\n/g, '</tr>\n</table>\n')
            .replace(/<td class="blutopgrabot"><a/g, '<td class="blutopgrabot">\n<a')
            .replace(/<noscript><img/g, '<noscript>\n<img');


        await self.new_round_trip_test(s, expected_s);
    });
    //@+node:felix.20230921214523.8: *3* TestHtml.test_multple_node_completed_on_a_line
    test('test_multple_node_completed_on_a_line', async () => {
        const s = `
            <!-- tags that start nodes: html,body,head,div,table,nodeA,nodeB -->
            <html><head>headline</head><body>body</body></html>
        `;

        // xml.preprocess_lines inserts a newline between </head> and <body>.


        const expected_results: [number, string, string][] = [
            [0, '',
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<!-- tags that start nodes: html,body,head,div,table,nodeA,nodeB -->\n' +
                '<html>\n' +
                '<head>headline</head>\n' +
                '<body>body</body>\n' +
                '</html>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.9: *3* TestHtml.test_multple_node_starts_on_a_line
    test('test_multple_node_starts_on_a_line', async () => {
        const s = `
            <html>
            <head>headline</head>
            <body>body</body>
            </html>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<html>\n' +
                '<head>headline</head>\n' +
                '<body>body</body>\n' +
                '</html>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.10: *3* TestHtml.test_slideshow_slide
    test('test_slideshow_slide', async () => {
        // s is the contents of slides/basics/slide-002.html
        //@+<< define s >>
        //@+node:felix.20230921214523.11: *4* << define s >>
        const s = `\
        <!DOCTYPE html>

        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="generator" content="Docutils 0.19: https://docutils.sourceforge.io/" />

            <title>The workbook file &#8212; Leo 6.7.2 documentation</title>
            <link rel="stylesheet" type="text/css" href="../../_static/pygments.css" />
            <link rel="stylesheet" type="text/css" href="../../_static/classic.css" />
            <link rel="stylesheet" type="text/css" href="../../_static/custom.css" />

            <script data-url_root="../../" id="documentation_options" src="../../_static/documentation_options.js"></script>
            <script src="../../_static/doctools.js"></script>
            <script src="../../_static/sphinx_highlight.js"></script>

            <script src="../../_static/sidebar.js"></script>

            <link rel="index" title="Index" href="../../genindex.html" />
            <link rel="search" title="Search" href="../../search.html" />
            <link rel="next" title="Editing headlines" href="slide-003.html" />
            <link rel="prev" title="Leoâ€™s Basics" href="basics.html" />
          <!--
            EKR: Xml_Importer.preprocess_lines should insert put </head> and <body> on separate lines.
            As with this comment, there is a risk that preprocessing might affect comments...
          -->
          </head><body>
            <div class="related" role="navigation" aria-label="related navigation">
              <h3>Navigation</h3>
              <ul>
                <li class="right" style="margin-right: 10px">
                  <a href="../../genindex.html" title="General Index"
                     accesskey="I">index</a></li>
                <li class="right" >
                  <a href="slide-003.html" title="Editing headlines"
                     accesskey="N">next</a> |</li>
                <li class="right" >
                  <a href="basics.html" title="Leoâ€™s Basics"
                     accesskey="P">previous</a> |</li>
                <li class="nav-item nav-item-0"><a href="../../leo_toc.html">Leo 6.7.2 documentation</a> &#187;</li>
                  <li class="nav-item nav-item-1"><a href="../../toc-more-links.html" >More Leo Links</a> &#187;</li>
                  <li class="nav-item nav-item-2"><a href="../../slides.html" >Slides</a> &#187;</li>
                  <li class="nav-item nav-item-3"><a href="basics.html" accesskey="U">Leoâ€™s Basics</a> &#187;</li>
                <li class="nav-item nav-item-this"><a href="">The workbook file</a></li>
              </ul>
            </div>

            <div class="document">
              <div class="documentwrapper">
                <div class="bodywrapper">
                  <div class="body" role="main">

          <section id="the-workbook-file">
        <h1>The workbook file<a class="headerlink" href="#the-workbook-file" title="Permalink to this heading">Â¶</a></h1>
        <p>Leo opens the <strong>workbook file</strong> when you start
        Leo without a filename.</p>
        <p>The body has focusâ€“it is colored a pale pink, and
        contains a blinking cursor.</p>
        <p><strong>Note</strong>: on some monitors the colors will be almost
        invisible.  You can choose such colors to suit your
        taste.</p>
        <img alt="../../_images/slide-002.png" src="../../_images/slide-002.png" />
        </section>


                    <div class="clearer"></div>
                  </div>
                </div>
              </div>
              <div class="sphinxsidebar" role="navigation" aria-label="main navigation">
                <div class="sphinxsidebarwrapper">
                    <p class="logo"><a href="../../leo_toc.html">
                      <img class="logo" src="../../_static/LeoLogo.svg" alt="Logo"/>
                    </a></p>
          <div>
            <h4>Previous topic</h4>
            <p class="topless"><a href="basics.html"
                                  title="previous chapter">Leoâ€™s Basics</a></p>
          </div>
          <div>
            <h4>Next topic</h4>
            <p class="topless"><a href="slide-003.html"
                                  title="next chapter">Editing headlines</a></p>
          </div>
        <div id="searchbox" style="display: none" role="search">
          <h3 id="searchlabel">Quick search</h3>
            <div class="searchformwrapper">
            <form class="search" action="../../search.html" method="get">
              <input type="text" name="q" aria-labelledby="searchlabel" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
              <input type="submit" value="Go" />
            </form>
            </div>
        </div>
        <script>document.getElementById('searchbox').style.display = "block"</script>
                </div>
        <div id="sidebarbutton" title="Collapse sidebar">
        <span>Â«</span>
        </div>

              </div>
              <div class="clearer"></div>
            </div>
            <div class="related" role="navigation" aria-label="related navigation">
              <h3>Navigation</h3>
              <ul>
                <li class="right" style="margin-right: 10px">
                  <a href="../../genindex.html" title="General Index"
                     >index</a></li>
                <li class="right" >
                  <a href="slide-003.html" title="Editing headlines"
                     >next</a> |</li>
                <li class="right" >
                  <a href="basics.html" title="Leoâ€™s Basics">previous</a> |</li>
                <li class="nav-item nav-item-0"><a href="../../leo_toc.html">Leo 6.7.2 documentation</a> &#187;</li>
                  <li class="nav-item nav-item-1"><a href="../../toc-more-links.html" >More Leo Links</a> &#187;</li>
                  <li class="nav-item nav-item-2"><a href="../../slides.html" >Slides</a> &#187;</li>
                  <li class="nav-item nav-item-3"><a href="basics.html" >Leoâ€™s Basics</a> &#187;</li>
                <li class="nav-item nav-item-this"><a href="">The workbook file</a></li>
              </ul>
            </div>
            <div class="footer" role="contentinfo">
                &#169; Copyright 1997-2023, Edward K. Ream.
              Last updated on January 24, 2023.
              Created using <a href="https://www.sphinx-doc.org/">Sphinx</a> 6.1.2.
            </div>
          </body>
        </html>
        const `;
        //@-<< define s >>

        // xml.preprocess_lines inserts several newlines.
        // Modify the expected result accordingly.
        const expected_s: string = s
            .replace(/<\/head><body>/g, '</head>\n<body>')
            .replace(/><meta/g, '>\n<meta')
            .replace(/index<\/a><\/li>/g, 'index</a>\n</li>')
            // .replace(/\"><a/g, '">\n<a')  # This replacement would affect too many lines.
            .replace(/m-0\"><a/g, 'm-0">\n<a')
            .replace(/m-1\"><a/g, 'm-1">\n<a')
            .replace(/item-2\"><a/g, 'item-2">\n<a')
            .replace(/m-3\"><a/g, 'm-3">\n<a')
            .replace(/nav-item-this\"><a/g, 'nav-item-this">\n<a')
            .replace(/<p class=\"logo\"><a/g, '<p class="logo">\n<a')
            .replace(/<\/a><\/li>/g, '</a>\n</li>')
            .replace(/<p><strong>/g, '<p>\n<strong>')
            .replace(/<\/a><\/p>/g, '</a>\n</p>');
        // .replace(/<\/head><body>/g, '</head>\n<body>')
        // .replace(/><meta/g, '>\n<meta')
        // .replace(/index<\/a><\/li>/g, 'index</a>\n</li>')
        // .replace(/m-0\"><a/g, 'm-0\">\n<a')
        // .replace(/m-1\"><a/g, 'm-1\">\n<a')
        // .replace(/item-2\"><a/g, 'item-2\">\n<a')
        // .replace(/m-3\"><a/g, 'm-3\">\n<a')
        // .replace(/nav-item-this\"><a/g, 'nav-item-this\">\n<a')
        // .replace(/<p class=\"logo\"><a/g, '<p class="logo">\n<a')
        // .replace(/<\/a><\/p>/g, '</a>\n</p>');

        await self.new_round_trip_test(s, expected_s);
    });
    //@+node:felix.20230921214523.12: *3* TestHtml.test_structure
    test('test_structure', async () => {
        const s = `
            <html>
            <head>
                <meta charset="utf-8" />
            </head>
            <body>
                <div class="a">
                    <div class="a-1">
                        some text
                    </div>
                </div>
            </body>
            </html>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<html>\n' +
                '@others\n' +
                '</html>\n'
            ],
            [2, '<head>',
                '<head>\n' +
                '    <meta charset="utf-8" />\n' +
                '</head>\n'
            ],
            [2, '<body>',
                '<body>\n' +
                '    @others\n' +
                '</body>\n'
            ],
            [3, '<div class="a">',
                '<div class="a">\n' +
                '    @others\n' +
                '</div>\n'
            ],
            [4, '<div class="a-1">',
                '<div class="a-1">\n' +
                '    some text\n' +
                '</div>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.13: *3* TestHtml.test_underindented_comment
    test('test_underindented_comment', async () => {
        const s = `
            <table cellspacing="0" cellpadding="0" width="600" border="0">
                <!-- The indentation of this element causes the problem. -->
                <table>
            <div align="center">
            <iframe src="http://www.amex.com/index.jsp"</iframe>
            </div>
            </table>
            </table>
            <p>Paragraph</p>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '<p>Paragraph</p>\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<table cellspacing="0" cellpadding="0" width="600" border="0">',
                '<table cellspacing="0" cellpadding="0" width="600" border="0">\n' +
                '@others\n' +
                '</table>\n'
            ],
            [2, '<table>',
                '    <!-- The indentation of this element causes the problem. -->\n' +
                '    <table>\n' +
                '@others\n' +
                '</table>\n'
            ],
            [3, '<div align="center">',
                '<div align="center">\n' +
                '<iframe src="http://www.amex.com/index.jsp"</iframe>\n' +
                '</div>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921214523.14: *3* TestHtml.test_uppercase_tags
    test('test_uppercase_tags', async () => {
        const s = `
            <HTML>
            <HEAD>
                <title>Bodystring</title>
            </HEAD>
            <BODY class='bodystring'>
            <DIV id='bodydisplay'></DIV>
            </BODY>
            </HTML>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language html\n' +
                '@tabwidth -4\n'
            ],
            [1, '<HTML>',
                '<HTML>\n' +
                '@others\n' +
                '</HTML>\n'
            ],
            [2, '<HEAD>',
                '<HEAD>\n' +
                '    <title>Bodystring</title>\n' +
                '</HEAD>\n'
            ],
            [2, "<BODY class='bodystring'>",
                "<BODY class='bodystring'>\n" +
                "<DIV id='bodydisplay'></DIV>\n" +
                '</BODY>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@-others

});
//@+node:felix.20230919195555.1: ** suite TestJavascript
suite('TestJavascript', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.js';
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
    //@+node:felix.20230919195555.2: *3* TestJavascript.test_plain_function
    test('test_plain_function', async () => {
        const s = `
            // Restarting
            function restart() {
                invokeParamifier(params,"onstart");
                if(story.isEmpty()) {
                    var tiddlers = store.filterTiddlers(store.getTiddlerText("DefaultTiddlers"));
                    for(var t=0; t<tiddlers.length; t++) {
                        story.displayTiddler("bottom",tiddlers[t].title);
                    }
                }
                window.scrollTo(0,0);
            }
        `;

        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language javascript\n' +
                '@tabwidth -4\n'
            ],
            [1, 'function restart',
                '// Restarting\n' +
                'function restart() {\n' +
                '    invokeParamifier(params,"onstart");\n' +
                '    if(story.isEmpty()) {\n' +
                '        var tiddlers = store.filterTiddlers(store.getTiddlerText("DefaultTiddlers"));\n' +
                '        for(var t=0; t<tiddlers.length; t++) {\n' +
                '            story.displayTiddler("bottom",tiddlers[t].title);\n' +
                '        }\n' +
                '    }\n' +
                '    window.scrollTo(0,0);\n' +
                '}\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230919195555.3: *3* TestJavascript.test var_equal_function

    test('var_equal_function', () => {

        return; // NOT USED IN LEO (does not start with 'test')
        /*
        const s = `
            var c3 = (function () {
                "use strict";

                // Globals
                var c3 = { version: "0.0.1"   };

                c3.someFunction = function () {
                    console.log("Just a demo...");
                };

                return c3;
            }());
        `;

        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore the first headline.
                '@others\n' +
                '@language javascript\n' +
                '@tabwidth -4\n'
            ],
            [1, 'function restart',
                s
            ],
        ];
        await self.new_run_test(s, expected_results);
        */
    });
    //@+node:felix.20230919195555.4: *3* TestJavascript.test_comments
    test('test_comments', async () => {
        const s = `
            /* Test of multi-line comments.
             * line 2.
             */
        `;
        await self.new_round_trip_test(s);
    });
    //@+node:felix.20230919195555.5: *3* TestJavascript.test_regex
    test('test_regex', async () => {
        const s = `
            String.prototype.toJSONString = function() {
                if(/["\\\\\\x00-\\x1f]/.test(this))
                    return '"' + this.replace(/([\\x00-\\x1f\\"])/g,replaceFn) + '"';

                return '"' + this + '"';
            };
            `;
        await self.new_round_trip_test(s);
    });
    //@-others

});



//@+node:felix.20230917230509.1: ** suite TestPython
suite('TestPython', () => {

    let self: BaseTestImporter;

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
        assert.ok(g.compareArrays(result, expected_lines, true));
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
//@+node:felix.20230919203905.1: ** suite TestTypescript
suite('TestTypescript', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.ts';
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
    //@+node:felix.20230919203905.2: *3* TestTypescript.test_class
    test('test_class', async () => {
        const s = `
            class Greeter {
                greeting: string;
                constructor (message: string) {
                    this.greeting = message;
                }
                greet() {
                    return "Hello, " + this.greeting;
                }
            }

            var greeter = new Greeter("world");

            var button = document.createElement('button')
            button.innerText = "Say Hello"
            button.onclick = function() {
                alert(greeter.greet())
            }

            document.body.appendChild(button)

        `;
        await self.new_round_trip_test(s);
    });
    //@+node:felix.20230919203905.3: *3* TestTypescript.test_module
    test('test_module', async () => {
        const s = `
            module Sayings {
                export class Greeter {
                    greeting: string;
                    constructor (message: string) {
                        this.greeting = message;
                    }
                    greet() {
                        return "Hello, " + this.greeting;
                    }
                }
            }
            var greeter = new Sayings.Greeter("world");

            var button = document.createElement('button')
            button.innerText = "Say Hello"
            button.onclick = function() {
                alert(greeter.greet())
            }

            document.body.appendChild(button)
        `;
        await self.new_round_trip_test(s);
    });
    //@-others

});
//@+node:felix.20230921010815.1: ** suite TestXML
suite('TestXML', () => {

    let self: BaseTestImporter;

    before(() => {
        self = new BaseTestImporter();
        self.ext = '.xml';
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        const c = self.c;
        // Simulate @data import-xml-tags, with *only* standard tags.
        const tags_list = ['html', 'body', 'head', 'div', 'script', 'table'];
        let [settingsDict, junk] = g.app.loadManager!.createDefaultSettingsDicts();
        c.config.settingsDict = settingsDict;
        c.config.set(c.p, 'data', 'import-xml-tags', tags_list, true);
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230921010815.2: *3* TestXml.test_standard_opening_elements
    test('test_standard_opening_elements', async () => {
        const s = `
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE note SYSTEM "Note.dtd">
        <html>
        <head>
            <title>Bodystring</title>
        </head>
        <body class='bodystring'>
        <div id='bodydisplay'></div>
        </body>
        </html>
        `;

        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore level 0 headlines.
                '@others\n' +
                '@language xml\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<!DOCTYPE note SYSTEM "Note.dtd">\n' +
                '<html>\n' +
                '@others\n' +
                '</html>\n'
            ],
            [2, '<head>',
                '<head>\n' +
                '    <title>Bodystring</title>\n' +
                '</head>\n'
            ],
            [2, "<body class='bodystring'>",

                "<body class='bodystring'>\n" +
                "<div id='bodydisplay'></div>\n" +
                '</body>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921010815.3: *3* TestXml.test_xml_1
    test('test_xml_1', async () => {
        const s = `
            <html>
            <head>
                <title>Bodystring</title>
            </head>
            <body class='bodystring'>
            <div id='bodydisplay'>
            contents!
            </div>
            </body>
            </html>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore level 0 headlines.
                '@others\n' +
                '@language xml\n' +
                '@tabwidth -4\n'
            ],
            [1, '<html>',
                '<html>\n' +
                '@others\n' +
                '</html>\n'
            ],
            [2, '<head>',
                '<head>\n' +
                '    <title>Bodystring</title>\n' +
                '</head>\n'
            ],
            [2, "<body class='bodystring'>",
                "<body class='bodystring'>\n" +
                '@others\n' +
                '</body>\n'
            ],
            [3, "<div id='bodydisplay'>",
                "<div id='bodydisplay'>\n" +
                'contents!\n' +
                '</div>\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@+node:felix.20230921010815.4: *3* TestXml.test_non_ascii_tags
    test('test_non_ascii_tags', async () => {
        const s = `
            <:À.Ç>
            <Ì>
            <_.ÌÑ>
        `;
        const expected_results: [number, string, string][] = [
            [0, '',  // Ignore level 0 headlines.
                '<:À.Ç>\n' +
                '<Ì>\n' +
                '<_.ÌÑ>\n' +
                '@language xml\n' +
                '@tabwidth -4\n'
            ],
        ];
        await self.new_run_test(s, expected_results);
    });
    //@-others

});
//@-others
//@-leo
