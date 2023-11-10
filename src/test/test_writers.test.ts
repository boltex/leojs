//@+leo-ver=5-thin
//@+node:felix.20230923150253.1: * @file src/test/test_writers.test.ts

import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';
import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';
import { BaseWriter } from '../writers/basewriter';
import { DartWriter } from '../writers/dart';
import { RstWriter } from '../writers/leo_rst';
import { TreePad_Writer } from '../writers/treepad';

//@+others
//@+node:felix.20230923152630.1: ** base class
/**
 * The base class for all tests of Leo's writer plugins.
 */
export class BaseTestWriter extends LeoUnitTest {

    // 

}
//@+node:felix.20230923153010.1: ** suite TestBaseWriter
/**
 * Test cases for the BaseWriter class.
 */
suite('TestBaseWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923153010.2: *3* TestBaseWriter.test_put_node_sentinel
    test('test_put_node_sentinel', () => {

        const c = self.c;
        const root = self.c.p;
        const at = c.atFileCommands;
        const x = new BaseWriter(c);
        const table: [string, string | undefined][] = [
            ['#', undefined],
            ['<--', '-->'],
        ];
        const child = root.insertAsLastChild();
        child.h = 'child';
        const grandchild = child.insertAsLastChild();
        grandchild.h = 'grandchild';
        const greatgrandchild = grandchild.insertAsLastChild();
        greatgrandchild.h = 'greatgrandchild';
        for (const p of [root, child, grandchild, greatgrandchild]) {
            for (let [delim1, delim2] of table) {
                at.outputList = [];
                x.put_node_sentinel(p, delim1, delim2);
            }
        }
    });
    //@-others

});
//@+node:felix.20230923154042.1: ** suite TestDartWriter
/**
 * Test Cases for the dart writer plugin.
 */
suite('TestDartWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923154042.2: *3* TestDartWriter.test_dart_writer
    test('test_dart_writer', () => {
        const c = self.c;
        const root = self.c.p;
        const child = root.insertAsLastChild();
        child.h = 'h';
        child.b = 'dart line 1\ndart_line2\n';
        const x = new DartWriter(c);
        x.write(root);
    });
    //@-others

});
//@+node:felix.20230923154219.1: ** suite TestRstWriter
/**
 * Test Cases for the leo_rst writer plugin.
 */
suite('TestRstWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923154219.2: *3* TestRstWriter.test_rst_writer
    test('test_rst_writer', () => {
        const c = self.c;
        const root = self.c.p;
        const child = root.insertAsLastChild();
        child.h = 'h';
        // For full coverage, we don't want a leading newline.
        child.b = g.dedent(`\
            .. toc

            ====
            top
            ====

            The top section

            section 1
            ---------

            section 1, line 1
            --
            section 1, line 2

            section 2
            ---------

            section 2, line 1

            section 2.1
            ~~~~~~~~~~~

            section 2.1, line 1

            section 2.1.1
            .............

            section 2.2.1 line 1

            section 3
            ---------

            section 3, line 1

            section 3.1.1
            .............

            section 3.1.1, line 1
        `);  // No newline, on purpose.
        const x = new RstWriter(c);
        x.write(root);

    });
    //@-others

});
//@+node:felix.20230923154224.1: ** suite TestTreepadWriter
/**
 * Test Cases for the treepad writer plugin.
 */
suite('TestTreepadWriter', () => {

    let self: BaseTestWriter;

    before(() => {
        self = new BaseTestWriter();
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
    //@+node:felix.20230923154224.2: *3* TestTreepadWriter.test_treepad_writer
    test('test_treepad_writer', () => {
        const c = self.c;
        const root = self.c.p;
        const child = root.insertAsLastChild();
        child.h = 'h';
        child.b = 'line 1\nline2\n';
        const x = new TreePad_Writer(c);
        x.write(root);
    });
    //@-others

});
//@-others
//@-leo
