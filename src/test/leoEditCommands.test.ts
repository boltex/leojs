//@+leo-ver=5-thin
//@+node:felix.20230715191134.1: * @file src/test/leoEditCommands.test.ts
/**
 * Unit tests for Leo's edit commands.
 */
import * as assert from 'assert';
import { afterEach, before, beforeEach } from 'mocha';

import * as g from '../core/leoGlobals';
import { LeoUnitTest } from './leoTest2';

//@+others
//@+node:felix.20230715214158.1: ** suite
suite('Test cases for editCommands.ts', () => {

    let self: LeoUnitTest;

    before(() => {
        self = new LeoUnitTest();
        return self.setUpClass();
    });

    beforeEach(() => {
        self.setUp();
        setUp();
        return Promise.resolve();
    });

    afterEach(() => {
        self.tearDown();
        return Promise.resolve();
    });

    //@+others
    //@+node:felix.20230829231556.1: *3* run_test
    /**
     * A helper for many commands tests.
     */
    const run_test = (
        before_b: string,
        after_b: string,  // before/after body text.
        before_sel: [number | string, number | string],
        after_sel: [number | string, number | string], // before and after selection ranges.
        command_name: string,
        directives = '',
        dedent = true,
    ) => {

        const c = self.c;

        const toInt = (s: number | string) => {
            return g.toPythonIndex(before_b, s);
        };

        // For shortDescription().
        self.command_name = command_name;
        // Compute the result in tempNode.b
        const command = c.commandsDict[command_name];
        g.assert(command, `no command: ${command_name}`);
        // Set the text.
        let parent_b;
        if (dedent) {
            parent_b = g.dedent(directives);
            before_b = g.dedent(before_b);
            after_b = g.dedent(after_b);
        } else {
            // The unit test is responsible for all indentation.
            parent_b = directives;
        }
        self.parent_p.b = parent_b;
        self.tempNode.b = before_b;
        self.before_p.b = before_b;
        self.after_p.b = after_b;
        // Set the selection range and insert point.
        const w = c.frame.body.wrapper;
        let i, j;
        [i, j] = before_sel;
        [i, j] = [toInt(i), toInt(j)];
        w.setSelectionRange(i, j, j);
        // Run the command!
        // c.k.simulateCommand(command_name);
        c.doCommandByName(command_name);

        assert.strictEqual(self.tempNode.b, self.after_p.b, command_name);
    };
    //@+node:felix.20230829234252.1: *3* setUp
    /**
     * setUp for TestFind class
     */
    function setUp() {

        // super().setUp() // Done in suite init
        const c = self.c;

        // Create top-level parent node.
        self.parent_p = self.root_p.insertAsLastChild();
        // Create children of the parent node.
        self.tempNode = self.parent_p.insertAsLastChild();
        self.before_p = self.parent_p.insertAsLastChild();
        self.after_p = self.parent_p.insertAsLastChild();
        self.tempNode.h = 'tempNode';
        self.before_p.h = 'before';
        self.after_p.h = 'after';
        c.selectPosition(self.tempNode);
    }
    //@+node:felix.20240614005538.1: *3* TestEditCommands: Commands...
    //@+node:felix.20240614005538.2: *4* Commands A-B
    //@+node:felix.20240614005538.3: *5* add-space-to-lines
    test('test_add_space_to_lines', () => {
        const before_b = `\
    first line
    line 1
        line a
    line b
    last line
    `;
        const after_b = `\
    first line
     line 1
         line a
     line b
    last line
    `;
        console.log('IN UNIT TEST: ', g.unitTesting);
        run_test(
            before_b,
            after_b,
            ["2.0", "4.6"],
            ["2.0", "4.7"],
            "add-space-to-lines",
        );
    });
    //@+node:felix.20240614005538.4: *5* add-tab-to-lines
    test('test_add_tab_to_lines', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
        line 1
            line a
                line b
        line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.0", "5.6"],
            ["2.0", "5.10"],
            "add-tab-to-lines",
        );
    });
    //@+node:felix.20240614005538.5: *5* back-char
    test('test_back_char', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.8", "3.8"],
            ["3.7", "3.7"],
            "back-char",
        );
    });
    //@+node:felix.20240614005538.6: *5* back-char-extend-selection
    test('test_back_char_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["4.12", "4.12"],
            ["4.11", "4.12"],
            "back-char-extend-selection",
        );
    });
    //@+node:felix.20240614005538.7: *5* back-paragraph
    test('test_back_paragraph', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["9.0", "9.0"],
            ["6.7", "6.7"],
            "back-paragraph",
        );
    });
    //@+node:felix.20240614005538.8: *5* back-paragraph-extend-selection
    test('test_back_paragraph_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["9.0", "9.5"],
            ["6.7", "9.5"],
            "back-paragraph-extend-selection",
        );
    });
    //@+node:felix.20240614005538.9: *5* back-sentence
    test('test_back_sentence', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.169", "3.169"],
            ["3.143", "3.143"],
            "back-sentence",
        );
    });
    //@+node:felix.20240614005538.10: *5* back-sentence-extend-selection
    test('test_back_sentence_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.208", "3.208"],
            ["3.143", "3.208"],
            "back-sentence-extend-selection",
        );
    });
    //@+node:felix.20240614005538.11: *5* back-to-home (at end of line)
    test('test_back_to_home_at_end_of_line', () => {
        const before_b = `\
    if a:
        b = 'xyz'
    `;
        const after_b = `\
    if a:
        b = 'xyz'
    `;
        run_test(
            before_b,
            after_b,
            ["2.12", "2.12"],
            ["2.4", "2.4"],
            "back-to-home",
        );
    });
    //@+node:felix.20240614005538.12: *5* back-to-home (at indentation
    test('test_back_to_home_at_indentation', () => {
        const before_b = `\
    if a:
        b = 'xyz'
    `;
        const after_b = `\
    if a:
        b = 'xyz'
    `;
        run_test(
            before_b,
            after_b,
            ["2.4", "2.4"],
            ["2.0", "2.0"],
            "back-to-home",
        );
    });
    //@+node:felix.20240614005538.13: *5* back-to-home (at start of line)
    test('test_back_to_home_at_start_of_line', () => {
        const before_b = `\
    if a:
        b = 'xyz'
    `;
        const after_b = `\
    if a:
        b = 'xyz'
    `;
        run_test(
            before_b,
            after_b,
            ["2.0", "2.0"],
            ["2.4", "2.4"],
            "back-to-home",
        );
    });
    //@+node:felix.20240614005538.14: *5* back-to-indentation
    test('test_back_to_indentation', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["4.13", "4.13"],
            ["4.8", "4.8"],
            "back-to-indentation",
        );
    });
    //@+node:felix.20240614005538.15: *5* back-word
    test('test_back_word', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["1.183", "1.183"],
            ["1.178", "1.178"],
            "back-word",
        );
    });
    //@+node:felix.20240614005538.16: *5* back-word-extend-selection
    test('test_back_word_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.342", "3.342"],
            ["3.332", "3.342"],
            "back-word-extend-selection",
        );
    });
    //@+node:felix.20240614005538.17: *5* backward-delete-char
    test('test_backward_delete_char', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first lie
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.9", "1.9"],
            ["1.8", "1.8"],
            "backward-delete-char",
        );
    });
    //@+node:felix.20240614005538.18: *5* backward-delete-char  (middle of line)
    test('test_backward_delete_char__middle_of_line', () => {
        const before_b = `\
    first line
    last line
    `;
        const after_b = `\
    firstline
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.6", "1.6"],
            ["1.5", "1.5"],
            "backward-delete-char",
        );
    });
    //@+node:felix.20240614005538.19: *5* backward-delete-char (last char)
    test('test_backward_delete_char_last_char', () => {
        const before_b = `\
    first line
    last line
    `;
        const after_b = `\
    first line
    last lin
    `;
        run_test(
            before_b,
            after_b,
            ["2.9", "2.9"],
            ["2.8", "2.8"],
            "backward-delete-char",
        );
    });
    //@+node:felix.20240614005538.20: *5* backward-delete-word (no selection)
    test('test_backward_delete_word_no_selection', () => {
        const before_b = `\
    aaaa bbbb cccc dddd
    `;
        const after_b = `\
    aaaa cccc dddd
    `;
        run_test(
            before_b,
            after_b,
            ["1.10", "1.10"],
            ["1.5", "1.5"],
            "backward-delete-word",
        );
    });
    //@+node:felix.20240614005538.21: *5* backward-delete-word (selection)
    test('test_backward_delete_word_selection', () => {
        const before_b = `\
    aaaa bbbb cccc dddd
    `;
        const after_b = `\
    aaaa bbcc dddd
    `;
        run_test(
            before_b,
            after_b,
            ["1.7", "1.12"],
            ["1.7", "1.7"],
            "backward-delete-word",
        );
    });
    //@+node:felix.20240614005538.22: *5* backward-kill-paragraph
    test('test_backward_kill_paragraph', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["9.0", "9.0"],
            ["7.0", "7.0"],
            "backward-kill-paragraph",
        );
    });
    //@+node:felix.20240614005538.23: *5* backward-kill-sentence
    test('test_backward_kill_sentence', () => {
        const before_b = `\
    This is the first sentence.  This
    is the second sentence.  And
    this is the last sentence.
    `;
        const after_b = `\
    This is the first sentence.  This
    is the second sentence.
    `;
        run_test(
            before_b,
            after_b,
            ["3.2", "3.2"],
            ["2.23", "2.23"],
            "backward-kill-sentence",
        );
    });
    //@+node:felix.20240614005538.24: *5* backward-kill-word
    test('test_backward_kill_word', () => {
        const before_b = `\
    This is the first sentence.  This
    is the second sentence.  And
    this is the last sentence.
    `;
        const after_b = `\
    This is the first sentence.  This
    is the second sentence.  And
    this  the last sentence.
    `;
        run_test(
            before_b,
            after_b,
            ["3.7", "3.7"],
            ["3.5", "3.5"],
            "backward-kill-word",
        );
    });
    //@+node:felix.20240614005538.25: *5* beginning-of-buffer
    test('test_beginning_of_buffer', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["5.56", "5.56"],
            ["1.0", "1.0"],
            "beginning-of-buffer",
        );
    });
    //@+node:felix.20240614005538.26: *5* beginning-of-buffer-extend-selection
    test('test_beginning_of_buffer_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.423", "3.423"],
            ["1.0", "3.423"],
            "beginning-of-buffer-extend-selection",
        );
    });
    //@+node:felix.20240614005538.27: *5* beginning-of-line
    test('test_beginning_of_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.10", "3.10"],
            ["3.0", "3.0"],
            "beginning-of-line",
        );
    });
    //@+node:felix.20240614005538.28: *5* beginning-of-line-extend-selection
    test('test_beginning_of_line_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["4.10", "4.10"],
            ["4.0", "4.10"],
            "beginning-of-line-extend-selection",
        );
    });
    //@+node:felix.20240614005538.29: *4* Commands C-E
    //@+node:felix.20240614005538.30: *5* capitalize-word
    test('test_capitalize_word', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        Line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.6", "3.6"],
            ["3.6", "3.6"],
            "capitalize-word",
        );
    });
    //@+node:felix.20240614005538.31: *5* center-line
    test('test_center_line', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related,
    leading to around 500 deaths per year and nearly $14 billion in damage.
    StormReady, a program started in 1999 in Tulsa, OK,
    helps arm America's communities with the communication and safety
    skills needed to save lives and property– before and during the event.
    StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related,
    leading to around 500 deaths per year and nearly $14 billion in damage.
    StormReady, a program started in 1999 in Tulsa, OK,
    helps arm America's communities with the communication and safety
    skills needed to save lives and property– before and during the event.
    StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "9.0"],
            ["3.0", "9.0"],
            "center-line",
        );
    });
    //@+node:felix.20240614005538.32: *5* center-region
    test('test_center_region', () => {
        const before_b = `\
    Some 90% of all presidentially declared disasters are weather related,
    leading to around 500 deaths per year and nearly $14 billion in damage.
    StormReady, a program started in 1999 in Tulsa, OK,
    helps arm America's communities with the communication and safety
    skills needed to save lives and property– before and during the event.
    StormReady helps community leaders and emergency managers strengthen local safety programs.
    `;
        const after_b = `\
    Some 90% of all presidentially declared disasters are weather related,
    leading to around 500 deaths per year and nearly $14 billion in damage.
             StormReady, a program started in 1999 in Tulsa, OK,
      helps arm America's communities with the communication and safety
    skills needed to save lives and property– before and during the event.
    StormReady helps community leaders and emergency managers strengthen local safety programs.
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "7.0"],
            ["1.0", "7.0"],
            "center-region",
            "@pagewidth 70",
        );
    });
    //@+node:felix.20240614005538.33: *5* clean-lines
    test('test_clean_lines', () => {
        let before_b = g.dedent(
        `
            # Should remove all trailing whitespace.

            a = 2

                b = 3
                c  = 4
            d = 5
            e = 6
            x
        `).trim();
        const after_b = before_b;
        // Add some trailing ws to before_b
        const i = 1 + before_b.indexOf('3');
        before_b = before_b.slice(0, i) + '  ' + before_b.slice(i);
        assert.notEqual(before_b, after_b);
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["1.0", "1.0"],
            "clean-lines",
        );
    });
    //@+node:felix.20240614005538.34: *5* clear-selected-text
    test('test_clear_selected_text', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line    line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.4", "4.4"],
            ["2.4", "2.4"],
            "clear-selected-text",
        );
    });
    //@+node:felix.20240614005538.35: *5* count-region
    test('test_count_region', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.4", "4.8"],
            ["2.4", "4.8"],
            "count-region",
        );
    });
    //@+node:felix.20240614005538.36: *5* delete-char
    test('test_delete_char', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    firstline
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.5", "1.5"],
            ["1.5", "1.5"],
            "delete-char",
        );
    });
    //@+node:felix.20240614005538.37: *5* delete-indentation
    test('test_delete_indentation', () => {
        const before_b = `\
    first line
        line 1
    last line
    `;
        const after_b = `\
    first line
    line 1
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.8", "2.8"],
            ["2.4", "2.4"],
            "delete-indentation",
        );
    });
    //@+node:felix.20240614005538.38: *5* delete-spaces
    test('test_delete_spaces', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
    line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.2", "3.2"],
            ["3.0", "3.0"],
            "delete-spaces",
        );
    });
    //@+node:felix.20240614005538.39: *5* do-nothing
    test('test_do_nothing', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["1.0", "1.0"],
            "do-nothing",
        );
    });
    //@+node:felix.20240614005538.40: *5* downcase-region
    test('test_downcase_region', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. stormready, a program started in 1999 in tulsa, ok, helps arm america's communities with the communication and safety skills needed to save lives and property– before and during the event. stormready helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "4.0"],
            ["3.0", "4.0"],
            "downcase-region",
        );
    });
    //@+node:felix.20240614005538.41: *5* downcase-word
    test('test_downcase_word', () => {
        const before_b = `\
    XYZZY line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    xyzzy line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.4", "1.4"],
            ["1.4", "1.4"],
            "downcase-word",
        );
    });
    //@+node:felix.20240614005538.42: *5* end-of-buffer
    test('test_end_of_buffer', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.3", "1.3"],
            ["7.0", "7.0"],
            "end-of-buffer",
        );
    });
    //@+node:felix.20240614005538.43: *5* end-of-buffer-extend-selection
    test('test_end_of_buffer_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["1.0", "7.0"],
            "end-of-buffer-extend-selection",
        );
    });
    //@+node:felix.20240614005538.44: *5* end-of-line
    test('test_end_of_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["1.10", "1.10"],
            "end-of-line",
        );
    });
    //@+node:felix.20240614005538.45: *5* end-of-line (blank last line)
    test('test_end_of_line_blank_last_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last non-blank line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last non-blank line
    `;
        run_test(
            before_b,
            after_b,
            ["7.0", "7.0"],
            ["7.0", "7.0"],
            "end-of-line",
        );
    });
    //@+node:felix.20240614005538.46: *5* end-of-line (internal blank line)
    test('test_end_of_line_internal_blank_line', () => {
        const before_b = `\
    first line

    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line

    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.0", "2.0"],
            ["2.0", "2.0"],
            "end-of-line",
        );
    });
    //@+node:felix.20240614005538.47: *5* end-of-line (single char last line)
    test('test_end_of_line_single_char_last_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last non-blank line

    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last non-blank line

    `;
        run_test(
            before_b,
            after_b,
            ["7.0", "7.0"],
            ["7.1", "7.1"],
            "end-of-line",
        );
    });
    //@+node:felix.20240614005538.48: *5* end-of-line 2
    test('test_end_of_line_2', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["6.0", "6.0"],
            ["6.9", "6.9"],
            "end-of-line",
        );
    });
    //@+node:felix.20240614005538.49: *5* end-of-line-extend-selection
    test('test_end_of_line_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.0"],
            ["3.0", "3.10"],
            "end-of-line-extend-selection",
        );
    });
    //@+node:felix.20240614005538.50: *5* end-of-line-extend-selection (blank last line)
    test('test_end_of_line_extend_selection_blank_last_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last non-blank line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last non-blank line
    `;
        run_test(
            before_b,
            after_b,
            ["7.0", "7.0"],
            ["7.0", "7.0"],
            "end-of-line-extend-selection",
        );
    });
    //@+node:felix.20240614005538.51: *5* exchange-point-mark
    test('test_exchange_point_mark', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.10"],
            ["1.0", "1.10"],
            "exchange-point-mark",
        );
    });
    //@+node:felix.20240614005538.52: *5* extend-to-line
    test('test_extend_to_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.3", "3.3"],
            ["3.0", "3.10"],
            "extend-to-line",
        );
    });
    //@+node:felix.20240614005538.53: *5* extend-to-paragraph

    test('test_extend_to_paragraph', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["9.0", "9.0"],
            ["8.0", "13.33"],
            "extend-to-paragraph",
        );
    });
    //@+node:felix.20240614005538.54: *5* extend-to-sentence
    test('test_extend_to_sentence', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.5", "3.5"],
            ["1.395", "3.142"],
            "extend-to-sentence",
        );
    });
    //@+node:felix.20240614013118.1: *5* extend-to-word
    test('test_extend_to_word', () => {
        const before_b = `\
    first line
    line 1
        line_24a a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line_24a a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.10", "3.10"],
            ["3.4", "3.12"],
            "extend-to-word",
        );
    });

    //@+node:felix.20240614005538.56: *4* Commands F-L
    //@+node:felix.20240614005538.57: *5* fill-paragraph
    test('test_fill_paragraph', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Services StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially
    declared disasters are weather related,
    leading to around 500 deaths per year
    and nearly $14 billion in damage.
    StormReady, a program
    started in 1999 in Tulsa, OK,
    helps arm America's
    communities with the communication and
    safety skills needed to save lives and
    property--before and during the event.
    StormReady helps community leaders and
    emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Services StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property--before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.7"],
            ["10.0", " 10.0"],
            "fill-paragraph",
            "@pagewidth 80",
        );
    });
    //@+node:felix.20240614005538.58: *5* finish-of-line
    test('test_finish_of_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.12", "3.12"],
            ["3.9", "3.9"],
            "finish-of-line",
        );
    });
    //@+node:felix.20240614005538.59: *5* finish-of-line (2)
    test('test_finish_of_line_2', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.1", "3.1"],
            ["3.9", "3.9"],
            "finish-of-line",
        );
    });
    //@+node:felix.20240614005538.60: *5* finish-of-line-extend-selection
    test('test_finish_of_line_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.1", "3.1"],
            ["3.1", "3.9"],
            "finish-of-line-extend-selection",
        );
    });
    //@+node:felix.20240614005538.61: *5* forward-char
    test('test_forward_char', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.2", "1.2"],
            ["1.3", "1.3"],
            "forward-char",
        );
    });
    //@+node:felix.20240614005538.62: *5* forward-char-extend-selection
    test('test_forward_char_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.1", "1.1"],
            ["1.1", "1.2"],
            "forward-char-extend-selection",
        );
    });
    //@+node:felix.20240614005538.63: *5* forward-end-word (end of line)
    test('test_forward_end_word_end_of_line', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["1.395", "1.395"],
            ["3.4", "3.4"],
            "forward-end-word",
        );
    });
    //@+node:felix.20240614005538.64: *5* forward-end-word (start of word)
    test('test_forward_end_word_start_of_word', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["1.310", "1.310"],
            ["1.317", "1.317"],
            "forward-end-word",
        );
    });
    //@+node:felix.20240614005538.65: *5* forward-end-word-extend-selection
    test('test_forward_end_word_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.20", "3.20"],
            ["3.20", "3.30"],
            "forward-end-word-extend-selection",
        );
    });
    //@+node:felix.20240614005538.66: *5* forward-paragraph
    test('test_forward_paragraph', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["9.0", "9.0"],
            ["15.0", "15.0"],
            "forward-paragraph",
        );
    });
    //@+node:felix.20240614005538.67: *5* forward-paragraph-extend-selection
    test('test_forward_paragraph_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["10.0", "10.0"],
            ["10.0", "15.0"],
            "forward-paragraph-extend-selection",
        );
    });
    //@+node:felix.20240614005538.68: *5* forward-sentence
    test('test_forward_sentence', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.17", "3.17"],
            ["3.142", "3.142"],
            "forward-sentence",
        );
    });
    //@+node:felix.20240614005538.69: *5* forward-sentence-extend-selection
    test('test_forward_sentence_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["1.264", "1.264"],
            ["1.264", "1.395"],
            "forward-sentence-extend-selection",
        );
    });
    //@+node:felix.20240614005538.70: *5* forward-word
    test('test_forward_word', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["1.261", "1.261"],
            ["1.272", "1.272"],
            "forward-word",
        );
    });
    //@+node:felix.20240614005538.71: *5* forward-word-extend-selection
    test('test_forward_word_extend_selection', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["1.395", "1.395"],
            ["1.395", "3.4"],
            "forward-word-extend-selection",
        );
    });
    //@+node:felix.20240614005538.72: *5* indent-relative
    test('test_indent_relative', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
            line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["5.0", "5.0"],
            ["5.8", "5.8"],
            "indent-relative",
        );
    });
    //@+node:felix.20240614005538.73: *5* indent-rigidly
    test('test_indent_rigidly', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    TABline 1
    TAB    line a
    TAB        line b
    TABline c
    last line
    `.replace(/TAB/g, '\t');
        run_test(
            before_b,
            after_b,
            ["2.0", "5.0"],
            ["2.0", "5.1"],
            "indent-rigidly",
        );
    });
    //@+node:felix.20240614005538.74: *5* indent-to-comment-column
    test('test_indent_to_comment_column', () => {
        const before_b = `\
    first line
    line b
    last line
    `;
        const after_b = `\
    first line
        line b
    last line
    `;
        self.c.editCommands.ccolumn = 4;  // Set the comment column
        run_test(
            before_b,
            after_b,
            ["2.0", "2.0"],
            ["2.4", "2.4"],
            "indent-to-comment-column",
        );
    });
    //@+node:felix.20240614005538.75: *5* insert-newline
    test('test_insert_newline', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first li
    ne
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.8", "1.8"],
            ["2.0", "2.0"],
            "insert-newline",
        );
    });
    //@+node:felix.20240614005538.76: *5* insert-newline-bug-2230
    test('test_insert_newline_bug_2230', () => {
        const before_b = g.dedent(`
            @language python
            def spam():
                if 1:  # test
            # after line
        `).trim();

        // There are 8 spaces in the line after "if 1:..."
        const after_b = g.dedent(
        `
            @language python
            def spam():
                if 1:  # test

            # after line
        `).trim();
        run_test(
            before_b,
            after_b,
            ["3.18", "3.18"],
            ["4.8", "4.8"],
            "insert-newline",
        );
    });
    //@+node:felix.20240614005538.77: *5* insert-parentheses
    test('test_insert_parentheses', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first() line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.5", "1.5"],
            ["1.6", "1.6"],
            "insert-parentheses",
        );
    });
    //@+node:felix.20240614005538.78: *5* kill-line end-body-text
    test('test_kill_line_end_body_text', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    `;
        const after_b = `\
    line 1
    line 2
    line 3`;
        run_test(
            before_b,
            after_b,
            ["4.1", "4.1"],
            ["3.6", "3.6"],
            "kill-line",
        );
    });
    //@+node:felix.20240614005538.79: *5* kill-line end-line-text
    test('test_kill_line_end_line_text', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    `;
        const after_b = `\
    line 1
    line 2

    `;
        run_test(
            before_b,
            after_b,
            ["3.5", "3.5"],
            ["3.0", "3.0"],
            "kill-line",
        );
    });
    //@+node:felix.20240614005538.80: *5* kill-line start-blank-line
    test('test_kill_line_start_blank_line', () => {
        const before_b = `\
    line 1
    line 2

    line 4
    `;
        const after_b = `\
    line 1
    line 2
    line 4
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.0"],
            ["3.0", "3.0"],
            "kill-line",
        );
    });
    //@+node:felix.20240614005538.81: *5* kill-line start-line
    test('test_kill_line_start_line', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    line 4
    `;
        const after_b = `\
    line 1
    line 2

    line 4
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.0"],
            ["3.0", "3.0"],
            "kill-line",
        );
    });
    //@+node:felix.20240614005538.82: *5* kill-paragraph
    test('test_kill_paragraph', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.

    Some 90% of all presidentially declared disasters are weather related, leading
    to around 500 deaths per year and nearly $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK, helps arm America's communities with the
    communication and safety skills needed to save lives and property– before and
    during the event. StormReady helps community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year,
    Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000
    tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly
    weather impacts every American. Communities can now rely on the National Weather
    Service’s StormReady program to help them guard against the ravages of Mother
    Nature.



    StormReady communities are better prepared to save lives from the onslaught of
    severe weather through better planning, education, and awareness. No community
    is storm proof, but StormReady can help communities save lives. Does StormReady
    make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["9.0", "9.0"],
            ["8.0", "8.0"],
            "kill-paragraph",
        );
    });
    //@+node:felix.20240614005538.83: *5* kill-sentence
    test('test_kill_sentence', () => {
        const before_b = `\
    This is the first sentence.  This
    is the second sentence.  And
    this is the last sentence.
    `;
        const after_b = `\
    This is the first sentence.  And
    this is the last sentence.
    `;
        run_test(
            before_b,
            after_b,
            ["2.2", "2.2"],
            ["1.27", "1.27"],
            "kill-sentence",
        );
    });
    //@+node:felix.20240614005538.84: *5* kill-to-end-of-line after last visible char
    test('test_kill_to_end_of_line_after_last_visible_char', () => {
        const before_b = `\
    line 1
    # The next line contains two trailing blanks.
    line 3
    line 4
    `;
        const after_b = `\
    line 1
    # The next line contains two trailing blanks.
    line 3line 4
    `;
        run_test(
            before_b,
            after_b,
            ["3.6", "3.6"],
            ["3.6", "3.6"],
            "kill-to-end-of-line",
        );
    });
    //@+node:felix.20240614005538.85: *5* kill-to-end-of-line end-body-text
    test('test_kill_to_end_of_line_end_body_text', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    `;
        const after_b = `\
    line 1
    line 2
    line 3`;
        run_test(
            before_b,
            after_b,
            ["4.1", "4.1"],
            ["3.6", "3.6"],
            "kill-to-end-of-line",
        );
    });
    //@+node:felix.20240614005538.86: *5* kill-to-end-of-line end-line
    test('test_kill_to_end_of_line_end_line', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    `;
        const after_b = `\
    line 1
    line 2line 3
    `;
        run_test(
            before_b,
            after_b,
            ["2.6", "2.6"],
            ["2.6", "2.6"],
            "kill-to-end-of-line",
        );
    });
    //@+node:felix.20240614005538.87: *5* kill-to-end-of-line middle-line
    test('test_kill_to_end_of_line_middle_line', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    `;
        const after_b = `\
    line 1
    li
    line 3
    `;
        run_test(
            before_b,
            after_b,
            ["2.2", "2.2"],
            ["2.2", "2.2"],
            "kill-to-end-of-line",
        );
    });
    //@+node:felix.20240614005538.88: *5* kill-to-end-of-line start-blank-line
    test('test_kill_to_end_of_line_start_blank_line', () => {
        const before_b = `\
    line 1
    line 2

    line 4
    `;
        const after_b = `\
    line 1
    line 2
    line 4
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.0"],
            ["3.0", "3.0"],
            "kill-to-end-of-line",
        );
    });
    //@+node:felix.20240614005538.89: *5* kill-to-end-of-line start-line
    test('test_kill_to_end_of_line_start_line', () => {
        const before_b = `\
    line 1
    line 2
    line 3
    line 4
    `;
        const after_b = `\
    line 1
    line 2

    line 4
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.0"],
            ["3.0", "3.0"],
            "kill-to-end-of-line",
        );
    });
    //@+node:felix.20240614005538.90: *5* kill-word
    test('test_kill_word', () => {
        const before_b = `\
    This is the first sentence.  This
    is the second sentence.  And
    this is the last sentence.
    `;
        const after_b = `\
    This is the first sentence.  This
    is the  sentence.  And
    this is the last sentence.
    `;
        run_test(
            before_b,
            after_b,
            ["2.6", "2.6"],
            ["2.7", "2.7"],
            "kill-word",
        );
    });
    //@+node:felix.20240614005538.91: *4* Commands M-R
    //@+node:felix.20240614013053.1: *5* merge-node-with-next-node
    test('test_merge_node_with_next_node', () => {
        const c = self.c;
        const u = self.c.undoer;

        const prev_b = g.dedent(`\
    def spam():
        pass
    `);
        const next_b = g.dedent(`\
    spam2 = spam
    `);
        const result_b = g.dedent(`\
    def spam():
        pass

    spam2 = spam
    `);
        self.before_p.b = prev_b;
        self.after_p.b = next_b;
        c.selectPosition(self.before_p);
        // Delete 'before', select 'after'
        // c.k.simulateCommand('merge-node-with-next-node');
        c.doCommandByName('merge-node-with-next-node');

        assert.strictEqual(c.p.h, 'after');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
        // Restore 'before', select, 'before'.
        u.undo();
        assert.strictEqual(c.p.h, 'before');
        assert.strictEqual(c.p.b, prev_b);
        assert.strictEqual(c.p.next().h, 'after');
        assert.strictEqual(c.p.next().b, next_b);
        u.redo();
        assert.strictEqual(c.p.h, 'after');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
    });


    //@+node:felix.20240614013106.1: *5* merge-node-with-prev-node
    test('test_merge_node_with_prev_node', () => {
        const c = self.c;
        const u = self.c.undoer;

        const prev_b = g.dedent(`\
    def spam():
        pass
    `);
        const next_b = g.dedent(`\
    spam2 = spam
    `);
        const result_b = g.dedent(`\
    def spam():
        pass

    spam2 = spam
    `);
        self.before_p.b = prev_b;
        self.after_p.b = next_b;
        c.selectPosition(self.after_p);
        // Delete 'after', select 'before'
        // c.k.simulateCommand('merge-node-with-prev-node');
        c.doCommandByName('merge-node-with-prev-node');
        assert.strictEqual(c.p.h, 'before');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
        // Restore 'after', select, 'after'.
        u.undo();
        assert.strictEqual(c.p.h, 'after');
        assert.strictEqual(c.p.b, next_b);
        assert.strictEqual(c.p.back().h, 'before');
        assert.strictEqual(c.p.back().b, prev_b);
        u.redo();
        assert.strictEqual(c.p.h, 'before');
        assert.strictEqual(c.p.b, result_b);
        assert.ok(!c.p.next().__bool__());
    });

    //@+node:felix.20240614005538.94: *5* move-lines-down
    test('test_move_lines_down', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
    line c
        line a
            line b
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.3", "4.3"],
            ["4.3", "5.3"],
            "move-lines-down",
        );
    });
    //@+node:felix.20240614005538.95: *5* move-lines-up
    test('test_move_lines_up', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    line 1
    first line
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.2", "2.2"],
            ["1.2", "1.2"],
            "move-lines-up",
        );
    });
    //@+node:felix.20240614005538.96: *5* move-lines-up (into docstring)
    test('test_move_lines_up_into_docstring', () => {
        const before_b = `\
    //@@language python
    def test():
        """ a
        b
        c
        """
        print 1

        print 2
    `;
        const after_b = `\
    //@@language python
    def test():
        """ a
        b
        c
        print 1
        """

        print 2
    `;
        run_test(
            before_b,
            after_b,
            ["7.1", "7.1"],
            ["6.1", "6.1"],
            "move-lines-up",
        );

    });
    //@+node:felix.20240614005538.97: *5* move-past-close
    test('test_move_past_close', () => {
        const before_b = `\
    first (line)
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first (line)
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.10", "1.10"],
            ["1.12", "1.12"],
            "move-past-close",
        );
    });
    //@+node:felix.20240614005538.98: *5* move-past-close-extend-selection
    test('test_move_past_close_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        (line )a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        (line )a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.7", "3.7"],
            ["3.7", "3.11"],
            "move-past-close-extend-selection",
        );
    });
    //@+node:felix.20240614005538.99: *5* newline-and-indent
    test('test_newline_and_indent', () => {
        const before_b = g.dedent(
        `
            first line
            line 1
                line a
                    line b
            line c
            last line
        `).trim();

        // docstrings strip blank lines, so we can't use a docstring here!
        const after_b = [
            'first line\n',
            'line 1\n',
            '    \n',  // Would be stripped in a docstring!
            '    line a\n',
            '        line b\n',
            'line c\n',
            'last line' // NO NEWLINE BECAUSE OF FAKE 'prep' TRANSLATION
        ].join('');
        run_test(
            before_b,
            after_b,
            ["2.6", "2.6"],
            ["3.4", "3.4"],
            "newline-and-indent",
            undefined,
            false
        );
    });
    //@+node:felix.20240614005538.100: *5* next-line
    test('test_next_line', () => {
        const before_b = `\
    a

    b
    `;
        const after_b = `\
    a

    b
    `;
        run_test(
            before_b,
            after_b,
            ["1.1", "1.1"],
            ["2.0", "2.0"],
            "next-line",
        );
    });
    //@+node:felix.20240614005538.101: *5* previous-line
    test('test_previous_line', () => {
        const before_b = `\
    a

    b
    `;
        const after_b = `\
    a

    b
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "3.0"],
            ["2.0", "2.0"],
            "previous-line",
        );
    });
    //@+node:felix.20240614005538.102: *5* rectangle-clear
    test('test_rectangle_clear', () => {
        const before_b = `\
    before
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    after
    `;
        const after_b = `\
    before
    aaa   bbb
    aaa   bbb
    aaa   bbb
    aaa   bbb
    after
    `;
        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["2.3", "5.6"],
            "rectangle-clear",
        );
    });
    //@+node:felix.20240614005538.103: *5* rectangle-close
    test('test_rectangle_close', () => {
        const before_b = `\
    before
    aaa   bbb
    aaa   bbb
    aaa   bbb
    aaa   bbb
    after
    `;
        const after_b = `\
    before
    aaabbb
    aaabbb
    aaabbb
    aaabbb
    after
    `;
        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["2.3", "5.3"],
            "rectangle-close",
        );
    });
    //@+node:felix.20240614005538.104: *5* rectangle-delete
    test('test_rectangle_delete', () => {
        const before_b = `\
    before
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    after
    `;
        const after_b = `\
    before
    aaabbb
    aaabbb
    aaabbb
    aaabbb
    after
    `;
        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["2.3", "5.3"],
            "rectangle-delete",
        );
    });
    //@+node:felix.20240614005538.105: *5* rectangle-kill
    test('test_rectangle_kill', () => {
        const before_b = `\
    before
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    after
    `;
        const after_b = `\
    before
    aaabbb
    aaabbb
    aaabbb
    aaabbb
    after
    `;
        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["5.3", "5.3"],
            "rectangle-kill",
        );
    });
    //@+node:felix.20240614005538.106: *5* rectangle-open
    test('test_rectangle_open', () => {
        const before_b = `\
    before
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    aaaxxxbbb
    after
    `;
        const after_b = `\
    before
    aaa   xxxbbb
    aaa   xxxbbb
    aaa   xxxbbb
    aaa   xxxbbb
    after
    `;
        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["2.3", "5.6"],
            "rectangle-open",
        );
    });
    //@+node:felix.20240614005538.107: *5* test_rectangle-string
    test('test_rectangle_string', () => {
        const before_b = g.dedent(
        `
            before
            aaaxxxbbb
            aaaxxxbbb
            aaaxxxbbb
            aaaxxxbbb
            after
        `).trim();
        const after_b = g.dedent(
        `
            before
            aaas...sbbb
            aaas...sbbb
            aaas...sbbb
            aaas...sbbb
            after
        `).trim();

        // A hack. The command tests for g.unitTesting!
        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["2.3", "5.8"],
            "rectangle-string",
        );
    });
    //@+node:felix.20240614005538.108: *5* test_rectangle-yank
    test('test_rectangle_yank', () => {
        const before_b = g.dedent(
        `
            before
            aaaxxxbbb
            aaaxxxbbb
            aaaxxxbbb
            aaaxxxbbb
            after
        `).trim();

        const after_b = g.dedent(
        `
            before
            aaaY1Ybbb
            aaaY2Ybbb
            aaaY3Ybbb
            aaaY4Ybbb
            after
        `).trim();

        run_test(
            before_b,
            after_b,
            ["2.3", "5.6"],
            ["2.3", "5.6"],
            "rectangle-yank",
        );

    });
    //@+node:felix.20240614005538.109: *5* reformat-paragraph list 1 of 5
    test('test_reformat_paragraph_list_1_of_5', () => {
        const before_b = `\
    This paragraph leads of this test.  It is the "lead"
    paragraph.

      1. This is item
         number 1.  It is the first item in the list.

      2. This is item
         number 2.  It is the second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        const after_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item
         number 1.  It is the first item in the list.

      2. This is item
         number 2.  It is the second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["4.0", "4.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.110: *5* reformat-paragraph list 2 of 5
    test('test_reformat_paragraph_list_2_of_5', () => {
        const before_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item
         number 2.  It is the second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        const after_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item
         number 2.  It is the second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["4.0", "4.0"],
            ["7.0", "7.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.111: *5* reformat-paragraph list 3 of 5
    test('test_reformat_paragraph_list_3_of_5', () => {
        const before_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item
         number 2.  It is the second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        const after_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item number 2. It is the
         second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["7.0", "7.0"],
            ["10.0", "10.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.112: *5* reformat-paragraph list 4 of 5
    test('test_reformat_paragraph_list_4_of_5', () => {
        const before_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item number 2. It is the
         second item in the list.

      3. This is item
         number 3.  It is the third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        const after_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item number 2. It is the
         second item in the list.

      3. This is item number 3. It is the
         third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["10.0", "10.0"],
            ["13.0", "13.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.113: *5* reformat-paragraph list 5 of 5
    test('test_reformat_paragraph_list_5_of_5', () => {
        const before_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item number 2. It is the
         second item in the list.

      3. This is item number 3. It is the
         third item in the list.

    This paragraph ends the test.  It is the "final"
    paragraph.
    `;
        const after_b = `\
    This paragraph leads of this test. It is
    the "lead" paragraph.

      1. This is item number 1. It is the
         first item in the list.

      2. This is item number 2. It is the
         second item in the list.

      3. This is item number 3. It is the
         third item in the list.

    This paragraph ends the test. It is the
    "final" paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["13.0", "13.0"],
            ["15.1", "15.1"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.114: *5* reformat-paragraph new code 1 of 8
    test('test_reformat_paragraph_new_code_1_of_8', () => {
        const before_b = `\
    //@@pagewidth 40
    '''
    docstring.
    '''
    `;
        const after_b = `\
    //@@pagewidth 40
    '''
    docstring.
    '''
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["2.0", "2.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.115: *5* reformat-paragraph new code 2 of 8
    test('test_reformat_paragraph_new_code_2_of_8', () => {
        const before_b = `\
    //@@pagewidth 40
    '''
    docstring.
    '''
    `;
        const after_b = `\
    //@@pagewidth 40
    '''
    docstring.
    '''
    `;
        run_test(
            before_b,
            after_b,
            ["2.0", "2.0"],
            ["3.0", "3.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.116: *5* reformat-paragraph new code 3 of 8
    test('test_reformat_paragraph_new_code_3_of_8', () => {
        const before_b = `\
    //@@pagewidth 40
    '''
    docstring.
    more docstring.
    '''
    `;
        const after_b = `\
    //@@pagewidth 40
    '''
    docstring. more docstring.
    '''
    `;
        run_test(
            before_b,
            after_b,
            ["3.1", "4.1"],
            ["4.0", "4.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.117: *5* reformat-paragraph new code 4 of 8
    test('test_reformat_paragraph_new_code_4_of_8', () => {
        const before_b = `\
    - Point 1. xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    Line 11.
    A. Point 2. xxxxxxxxxxxxxxxxxxxxxxxxxxx
    `;
        const after_b = `\
    - Point 1. xxxxxxxxxxxxxxxxxxxxxxxxxxxx
      Line 11.
    A. Point 2. xxxxxxxxxxxxxxxxxxxxxxxxxxx
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["3.0", "3.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.118: *5* reformat-paragraph new code 5 of 8
    test('test_reformat_paragraph_new_code_5_of_8', () => {
        const before_b = `\
    A. Point 2. xxxxxxxxxxxxxxxxxxxxxxxxxxx
      Line 22.
    1. Point 3. xxxxxxxxxxxxxxxxxxxxxxxxxxx
    `;
        const after_b = `\
    A. Point 2. xxxxxxxxxxxxxxxxxxxxxxxxxxx
       Line 22.
    1. Point 3. xxxxxxxxxxxxxxxxxxxxxxxxxxx
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "2.0"],
            ["3.0", "3.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.119: *5* reformat-paragraph new code 6 of 8
    test('test_reformat_paragraph_new_code_6_of_8', () => {
        const before_b = `\
    1. Point 3. xxxxxxxxxxxxxxxxxxxxxxxxxxx
    Line 32.

    2. Point 4  xxxxxxxxxxxxxxxxxxxxxxxxxxx
    `;
        const after_b = `\
    1. Point 3. xxxxxxxxxxxxxxxxxxxxxxxxxxx
       Line 32.

    2. Point 4  xxxxxxxxxxxxxxxxxxxxxxxxxxx
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["4.0", "4.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.120: *5* reformat-paragraph new code 7 of 8
    test('test_reformat_paragraph_new_code_7_of_8', () => {
        const before_b = `\
    1. Point 3. xxxxxxxxxxxxxxxxxxxxxxxxxxx
       Line 32.

    2. Point 4 xxxxxxxxxxxxxxxxxxxxxxxxxxx
            Line 41.
    `;
        const after_b = `\
    1. Point 3. xxxxxxxxxxxxxxxxxxxxxxxxxxx
       Line 32.

    2. Point 4 xxxxxxxxxxxxxxxxxxxxxxxxxxx
            Line 41.
    `;
        run_test(
            before_b,
            after_b,
            ["2.11", "2.11"],
            ["3.1", "3.1"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.121: *5* reformat-paragraph new code 8 of 8
    test('test_reformat_paragraph_new_code_8_of_8', () => {
        const before_b = `\
    2. Point 4 xxxxxxxxxxxxxxxxxxxxxxxxxxx
            Line 41.
    `;
        const after_b = `\
    2. Point 4 xxxxxxxxxxxxxxxxxxxxxxxxxxx
            Line 41.
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["3.0", "3.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.122: *5* reformat-paragraph paragraph 1 of 3
    test('test_reformat_paragraph_paragraph_1_of_3', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?

    Last paragraph.
    `;
        const after_b = `\
    Americans live in the most severe
    weather-prone country on Earth. Each
    year, Americans cope with an average of
    10,000 thunderstorms, 2,500 floods,
    1,000 tornadoes, as well as an average
    of 6 deadly hurricanes. Potentially
    deadly weather impacts every American.
    Communities can now rely on the National
    Weather Service’s StormReady program to
    help them guard against the ravages of
    Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?

    Last paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["13.0", "13.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.123: *5* reformat-paragraph paragraph 2 of 3
    test('test_reformat_paragraph_paragraph_2_of_3', () => {
        const before_b = `\
    Americans live in the most severe
    weather-prone country on Earth. Each
    year, Americans cope with an average of
    10,000 thunderstorms, 2,500 floods,
    1,000 tornadoes, as well as an average
    of 6 deadly hurricanes. Potentially
    deadly weather impacts every American.
    Communities can now rely on the National
    Weather Service’s StormReady program to
    help them guard against the ravages of
    Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?

    Last paragraph.
    `;
        const after_b = `\
    Americans live in the most severe
    weather-prone country on Earth. Each
    year, Americans cope with an average of
    10,000 thunderstorms, 2,500 floods,
    1,000 tornadoes, as well as an average
    of 6 deadly hurricanes. Potentially
    deadly weather impacts every American.
    Communities can now rely on the National
    Weather Service’s StormReady program to
    help them guard against the ravages of
    Mother Nature.

    Some 90% of all presidentially declared
    disasters are weather related, leading
    to around 500 deaths per year and nearly
    $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK,
    helps arm America's communities with the
    communication and safety skills needed
    to save lives and property– before and
    during the event. StormReady helps
    community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?

    Last paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["13.0", "13.0"],
            ["25.0", "25.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.124: *5* reformat-paragraph paragraph 3 of 3
    test('test_reformat_paragraph_paragraph_3_of_3', () => {
        const before_b = `\
    Americans live in the most severe
    weather-prone country on Earth. Each
    year, Americans cope with an average of
    10,000 thunderstorms, 2,500 floods,
    1,000 tornadoes, as well as an average
    of 6 deadly hurricanes. Potentially
    deadly weather impacts every American.
    Communities can now rely on the National
    Weather Service’s StormReady program to
    help them guard against the ravages of
    Mother Nature.

    Some 90% of all presidentially declared
    disasters are weather related, leading
    to around 500 deaths per year and nearly
    $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK,
    helps arm America's communities with the
    communication and safety skills needed
    to save lives and property– before and
    during the event. StormReady helps
    community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?

    Last paragraph.
    `;
        const after_b = `\
    Americans live in the most severe
    weather-prone country on Earth. Each
    year, Americans cope with an average of
    10,000 thunderstorms, 2,500 floods,
    1,000 tornadoes, as well as an average
    of 6 deadly hurricanes. Potentially
    deadly weather impacts every American.
    Communities can now rely on the National
    Weather Service’s StormReady program to
    help them guard against the ravages of
    Mother Nature.

    Some 90% of all presidentially declared
    disasters are weather related, leading
    to around 500 deaths per year and nearly
    $14 billion in damage. StormReady, a
    program started in 1999 in Tulsa, OK,
    helps arm America's communities with the
    communication and safety skills needed
    to save lives and property– before and
    during the event. StormReady helps
    community leaders and emergency managers
    strengthen local safety programs.

    StormReady communities are better
    prepared to save lives from the
    onslaught of severe weather through
    better planning, education, and
    awareness. No community is storm proof,
    but StormReady can help communities save
    lives. Does StormReady make a
    difference?

    Last paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["25.10", "25.10"],
            ["34.0", "34.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.125: *5* reformat-paragraph simple hanging indent
    test('test_reformat_paragraph_simple_hanging_indent', () => {
        const before_b = `\
    Honor this line that has a hanging indentation, please.  Hanging
      indentation is valuable for lists of all kinds.  But it is tricky to get right.

    Next paragraph.
    `;
        const after_b = `\
    Honor this line that has a hanging
      indentation, please. Hanging
      indentation is valuable for lists of
      all kinds. But it is tricky to get
      right.

    Next paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["7.0", "7.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.126: *5* reformat-paragraph simple hanging indent 2
    test('test_reformat_paragraph_simple_hanging_indent_2', () => {
        const before_b = `\
    Honor this line that has
      a hanging indentation, please.  Hanging
        indentation is valuable for lists of all kinds.  But it is tricky to get right.

    Next paragraph.
    `;
        const after_b = `\
    Honor this line that has a hanging
      indentation, please. Hanging
      indentation is valuable for lists of
      all kinds. But it is tricky to get
      right.

    Next paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["2.0", "2.0"],
            ["7.0", "7.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.127: *5* reformat-paragraph simple hanging indent 3
    test('test_reformat_paragraph_simple_hanging_indent_3', () => {
        const before_b = `\
    Honor this line that
      has a hanging indentation,
      please.  Hanging
       indentation is valuable
        for lists of all kinds.  But
        it is tricky to get right.

    Next Paragraph.
    `;
        const after_b = `\
    Honor this line that has a hanging
      indentation, please. Hanging
      indentation is valuable for lists of
      all kinds. But it is tricky to get
      right.

    Next Paragraph.
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "1.0"],
            ["7.0", "7.0"],
            "reformat-paragraph",
            "@language plain\n@pagewidth 40\n@tabwidth 8",
        );
    });
    //@+node:felix.20240614005538.128: *5* remove-blank-lines
    test('test_remove_blank_lines', () => {
        const before_b = `\
    first line

    line 1
        line a
            line b

    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "9.0"],
            ["1.0", "6.9"],
            "remove-blank-lines",
        );
    });
    //@+node:felix.20240614005538.129: *5* remove-space-from-lines
    test('test_remove_space_from_lines', () => {
        const before_b = `\
    first line

    line 1
        line a
            line b

    line c
    last line
    `;
        const after_b = `\
    first line

    line 1
       line a
           line b

    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "9.0"],
            ["1.0", "9.0"],
            "remove-space-from-lines",
        );
    });
    //@+node:felix.20240614005538.130: *5* remove-tab-from-lines
    test('test_remove_tab_from_lines', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
    line a
        line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "7.0"],
            ["1.0", "7.0"],
            "remove-tab-from-lines",
        );
    });
    //@+node:felix.20240614005538.131: *5* reverse-region
    test('test_reverse_region', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\

    last line
    line c
            line b
        line a
    line 1
    first line
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "7.0"],
            ["7.10", "7.10"],
            "reverse-region",
        );
    });
    //@+node:felix.20240614005538.132: *5* reverse-sort-lines
    test('test_reverse_sort_lines', () => {
        const before_b = `\
    a
    d
    e
    z
    x
    `;
        const after_b = `\
    z
    x
    e
    d
    a
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "5.1"],
            ["1.0", "5.1"],
            "reverse-sort-lines",
        );
    });
    //@+node:felix.20240614005538.133: *5* reverse-sort-lines-ignoring-case
    test('test_reverse_sort_lines_ignoring_case', () => {
        const before_b = `\
    c
    A
    z
    X
    Y
    b
    `;
        const after_b = `\
    z
    Y
    X
    c
    b
    A
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "6.1"],
            ["1.0", "6.1"],
            "reverse-sort-lines-ignoring-case",
        );
    });
    //@+node:felix.20240614005538.134: *4* Commands S-Z
    //@+node:felix.20240614005538.135: *5* sort-columns
    test('test_sort_columns', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
            line b
        line a
    first line
    last line
    line 1
    line c
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "6.2"],
            ["1.0", "7.0"],
            "sort-columns",
        );
    });
    //@+node:felix.20240614005538.136: *5* sort-lines
    test('test_sort_lines', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
            line b
        line a
    line 1
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.0", "5.6"],
            ["2.0", "5.6"],
            "sort-lines",
        );
    });
    //@+node:felix.20240614005538.137: *5* sort-lines-ignoring-case
    test('test_sort_lines_ignoring_case', () => {
        const before_b = `\
    x
    z
    A
    c
    B
    `;
        const after_b = `\
    A
    B
    c
    x
    z
    `;
        run_test(
            before_b,
            after_b,
            ["1.0", "5.1"],
            ["1.0", "5.1"],
            "sort-lines-ignoring-case",
        );
    });
    //@+node:felix.20240614005538.138: *5* split-line
    test('test_split_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first
     line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.5", "1.5"],
            ["2.0", "2.0"],
            "split-line",
        );
    });
    //@+node:felix.20240614005538.139: *5* start-of-line
    test('test_start_of_line', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.10", "3.10"],
            ["3.4", "3.4"],
            "start-of-line",
        );
    });
    //@+node:felix.20240614005538.140: *5* start-of-line (2)
    test('test_start_of_line_2', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.1", "3.1"],
            ["3.4", "3.4"],
            "start-of-line",
        );
    });
    //@+node:felix.20240614005538.141: *5* start-of-line-extend-selection
    test('test_start_of_line_extend_selection', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.10", "3.10"],
            ["3.4", "3.10"],
            "start-of-line-extend-selection",
        );
    });
    //@+node:felix.20240614005538.142: *5* start-of-line-extend-selection (2)
    test('test_start_of_line_extend_selection_2', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.1", "3.1"],
            ["3.1", "3.4"],
            "start-of-line-extend-selection",
        );
    });
    //@+node:felix.20240614005538.143: *5* tabify
    test('test_tabify', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
    TABline a
    TABTABline b
    line c
    last line
    `.replace(/TAB/g, '\t');
        run_test(
            before_b,
            after_b,
            ["1.0", "7.0"],
            ["7.0", "7.0"],
            "tabify",
        );
    });
    //@+node:felix.20240614005538.144: *5* transpose-chars
    test('test_transpose_chars', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    frist line
    line 1
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["1.2", "1.2"],
            ["1.2", "1.2"],
            "transpose-chars",
        );
    });
    //@+node:felix.20240614005538.145: *5* transpose-lines
    test('test_transpose_lines', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    line 1
    first line
        line a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.2", "2.2"],
            ["2.10", "2.10"],
            "transpose-lines",
        );
    });
    //@+node:felix.20240614005538.146: *5* transpose-words
    test('test_transpose_words', () => {
        const before_b = `\
    first line
    before bar2 += foo after
    last line
    `;
        const after_b = `\
    first line
    before foo += bar2 after
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["2.9", "2.9"],
            ["2.11", "2.11"],
            "transpose-words",
        );
    });
    //@+node:felix.20240614005538.147: *5* untabify
    test('test_untabify', () => {
        const before_b = `\
    first line
    line 1
    TABline a
    TABTABline b
    line c
    last line
    `.replace(/TAB/g, '\t');
        const after_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `.replace(/TAB/g, '\t');
        run_test(
            before_b,
            after_b,
            ["1.0", "7.0"],
            ["7.0", "7.0"],
            "untabify",
        );
    });
    //@+node:felix.20240614005538.148: *5* upcase-region
    test('test_upcase_region', () => {
        const before_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    Some 90% of all presidentially declared disasters are weather related, leading to around 500 deaths per year and nearly $14 billion in damage. StormReady, a program started in 1999 in Tulsa, OK, helps arm America's communities with the communication and safety skills needed to save lives and property– before and during the event. StormReady helps community leaders and emergency managers strengthen local safety programs.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        const after_b = `\
    Americans live in the most severe weather-prone country on Earth. Each year, Americans cope with an average of 10,000 thunderstorms, 2,500 floods, 1,000 tornadoes, as well as an average of 6 deadly hurricanes. Potentially deadly weather impacts every American. Communities can now rely on the National Weather Service’s StormReady program to help them guard against the ravages of Mother Nature.

    SOME 90% OF ALL PRESIDENTIALLY DECLARED DISASTERS ARE WEATHER RELATED, LEADING TO AROUND 500 DEATHS PER YEAR AND NEARLY $14 BILLION IN DAMAGE. STORMREADY, A PROGRAM STARTED IN 1999 IN TULSA, OK, HELPS ARM AMERICA'S COMMUNITIES WITH THE COMMUNICATION AND SAFETY SKILLS NEEDED TO SAVE LIVES AND PROPERTY– BEFORE AND DURING THE EVENT. STORMREADY HELPS COMMUNITY LEADERS AND EMERGENCY MANAGERS STRENGTHEN LOCAL SAFETY PROGRAMS.

    StormReady communities are better prepared to save lives from the onslaught of severe weather through better planning, education, and awareness. No community is storm proof, but StormReady can help communities save lives. Does StormReady make a difference?
    `;
        run_test(
            before_b,
            after_b,
            ["3.0", "4.0"],
            ["3.0", "4.0"],
            "upcase-region",
        );
    });
    //@+node:felix.20240614005538.149: *5* upcase-word
    test('test_upcase_word', () => {
        const before_b = `\
    first line
    line 1
        line a
            line b
    line c
    last line
    `;
        const after_b = `\
    first line
    line 1
        LINE a
            line b
    line c
    last line
    `;
        run_test(
            before_b,
            after_b,
            ["3.7", "3.7"],
            ["3.7", "3.7"],
            "upcase-word",
        );
    });
    //@-others

});
//@-others
//@-leo
