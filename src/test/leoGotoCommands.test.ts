//@+leo-ver=5-thin
//@+node:felix.20230805122326.1: * @file src/test/leoGotoCommands.test.ts
/**
 * Unit tests for leo/commands/gotoCommands.ts.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { GoToCommands } from '../commands/gotoCommands';

//@+others
//@+node:felix.20230805123156.1: ** suite
suite('Test cases for gotoCommands.ts', () => {

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
    //@+node:felix.20230805123518.1: *3* TestGotoCommands.test_show_file_line
    test('test_show_file_line', async () => {

        const c = self.c;
        const x = new GoToCommands(c);

        // All body lines are unique, which simplifies the tests below.
        //@+<< create test tree >>
        //@+node:felix.20230805123518.2: *4* << create test tree >>
        self.clean_tree();
        self.create_test_paste_outline();

        // Demote all of the root's headlines!
        c.demote();

        // Add body text to each node.
        const root = c.rootPosition()!;
        assert.ok(root.h === 'root');
        root.h = '@clean test.py';  // Make the root an @clean node.
        for (const v of c.all_unique_nodes()) {
            for (let i = 0; i < 2; i++) {
                v.b += `${v.h} line ${i}\n`;
            }

        }
        root.b = '@language python\n' +
            'before\n' +
            '@others\n' +
            'after\n';

        //@-<< create test tree >>

        // self.dump_headlines(c)
        // self.dump_clone_info(c)

        //@+<< init unchanging data >>
        //@+node:felix.20230805123518.3: *4* << init unchanging data >>
        // Init the comment delims.
        let [delim1, delim2] = x.get_delims(root);

        assert.ok(delim1 === '#');
        assert.ok(delim2 == null);

        const delims = x.get_3_delims(root);

        // Create contents, the file *with* sentinels.
        const contents_s = await x.get_external_file_with_sentinels(root);
        const contents = g.splitLines(contents_s);

        // Create real_clean_contents, the contents produced by atCleanToString.
        const real_clean_s = await c.atFileCommands.atCleanToString(root);
        const real_clean_contents = g.splitLines(real_clean_s);

        // Create clean_contents, contents without invisible sentinels
        // converting visible sentinels to their corresponding line in the outline.
        // clean_contents = [
        //     z.replace('#@', '').replace('+others', '@others')
        //     for i, z in enumerate(contents)
        //     if not g.is_invisible_sentinel(delims, contents, i)
        // ]
        const clean_contents: string[] = contents
            .map((z) => z.replace(/#@/g, '').replace(/\+others/g, '@others'))
            .filter((z, i) => !g.is_invisible_sentinel(delims, contents, i));
        //@-<< init unchanging data >>

        // g.printObj(real_clean_contents, tag='atCleanToString')
        // g.printObj(contents, tag='With sentinels')
        // g.printObj(clean_contents, tag='No sentinels')

        // Test 1: A strong test of g.is_invisible_sentinel.
        assert.ok(g.compareArrays(real_clean_contents, clean_contents));


        //@+<< Test 2: test the helper for show-file-line >>
        //@+node:felix.20230805123518.4: *4* << Test 2: test the helper for show-file-line >>
        let node_i = 0;
        for (const p of c.all_positions()) {

            let offset = await x.find_node_start(p);


            assert.ok(!(offset == null), p.h);

            offset = offset - 1;
            const line = clean_contents[offset];
            if (p.h.startsWith('@clean')) {
                if (offset === 0) {

                    assert.ok(line === 'before\n', `offset ${offset.toString()} p.h ${p.h.toString()} line ${line.toString()}`);


                    assert.ok(g.splitLines(p.b)[0] === '@language python\n', p.b[0].toString());
                }
            } else {
                // print(f"{p.h:10} {offset:3} {line}")

                assert.ok(line.includes(p.h), `offset ${offset.toString()} p.h ${p.h.toString()} line ${line.toString()}`);
            }
            node_i++;
        }
        //@-<< Test 2: test the helper for show-file-line >>
        //@+<< Test 3: test the helper for goto-global-line >>
        //@+node:felix.20230805123518.5: *4* << Test 3: test the helper for goto-global-line >>
        for (const [i, clean_line] of clean_contents.entries()) {
            const [p, offset] = await x.find_file_line(i);

            assert.ok(p, "find_file_line not found! i: " + i);
            assert.ok(!(offset == null), p ? p.toString() : "find_file_line" + i);
            assert.ok(offset > 0, offset.toString() + " " + p.toString);
            const line = g.splitLines(p.b)[offset - 1];
            // g.trace(f"{i:>2} {offset} {p.h:20} {line!r}")
            if (p.h.startsWith('@clean')) {
                if (offset === 1) {
                    // We are testing p.b, not clean_line.
                    assert.ok(
                        line === '@language python\n',
                        `offset ${offset.toString()} p.h ${p.h.toString()} line ${line.toString()}`
                    );
                }
            } else {
                assert.ok(
                    line.includes(p.h),
                    `offset ${offset.toString()} p.h ${p.h.toString()} line ${line.toString()}`
                );

            }
        }
        //@-<< Test 3: test the helper for goto-global-line >>
        //@+<< Test 4: test show-file-line & goto-global-line directly >>
        //@+node:felix.20230805123518.6: *4* << Test 4: test show-file-line & goto-global-line directly >>
        let global_i = 0;  // Global line index.
        for (const p of c.all_positions()) {

            // Init and test lines.
            const lines = g.splitLines(p.b);
            if (!p.__eq__(root)) {
                for (const [i, line] of lines.entries()) {
                    // print(f"{global_i:2} {i} {p.h:30} {line!r}")
                    assert.ok(line.includes(p.h), `p.h ${p.h.toString()} line ${line.toString()}`);
                }
            }
            // Test show-file-line.
            const show_offset = await x.find_node_start(p);

            // assert.ok( show_offset not in (None, -1), (show_offset, p.h));
            assert.ok((!(show_offset == null)) && (show_offset !== -1), " show_offset is wrong for p.h: " + p.h);

            // Test goto-global-line.
            const [goto_p, goto_offset] = await x.find_file_line(global_i);
            assert.ok(goto_p, "no find_file_line! global_i: " + global_i);
            assert.ok(p.h === goto_p.h, p.toString() + " " + goto_p.toString());
            assert.ok(goto_offset === 1, p.toString());

            // Update global_i.
            if (p.__eq__(root)) {
                // Count `before`, `@others`, but *not* `@language python`.
                global_i += 2;
            } else {
                global_i += lines.length;
            }

        }
        //@-<< Test 4: test show-file-line & goto-global-line directly >>

    });

    //@-others

});
//@-others
//@-leo
