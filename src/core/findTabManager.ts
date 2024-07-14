//@+leo-ver=5-thin
//@+node:felix.20221109235435.1: * @file src/core/findTabManager.ts
//@+<< imports >>
//@+node:felix.20221109235755.1: ** << imports >>
import * as g from './leoGlobals';
import { Commands } from './leoCommands';
import { ISettings, LeoFind } from './leoFind';

//@-<< imports >>
//@+<< types >>
//@+node:felix.20221110225731.1: ** << types >>
export interface LeoFindTabMAnagerSettings {
    // Find/change strings...
    find_text: string;
    change_text: string;
    // Find options...
    file_only: boolean;
    ignore_case: boolean;
    mark_changes: boolean;
    mark_finds: boolean;
    node_only: boolean;
    pattern_match: boolean;
    search_body: boolean;
    search_headline: boolean;
    suboutline_only: boolean;
    whole_word: boolean;
}
//@-<< types >>
//@+others
//@+node:felix.20221110215906.1: ** class StringCheckBox (leoGui.py)
/**
 * Simulate a QCheckBox.
 */
export class StringCheckBox {
    private label: string;
    private name: string;
    private value: boolean;

    constructor(name: string, label = '') {
        this.label = label;
        this.name = name;
        this.value = true;
    }

    public checkState(): boolean {
        return this.value;
    }
    public isChecked(): boolean {
        return this.checkState();
    }

    public objectName(): string {
        return this.name;
    }
    public setCheckState(value: boolean): void {
        this.value = value;
    }
    public toggle(): void {
        this.value = !this.value;
    }
}

//@+node:felix.20221110215921.1: ** class StringRadioButton (leoGui.py)
/**
 * Simulate a QRadioButton.
 */
export class StringRadioButton {
    private label: string;
    private name: string;
    private value: boolean;

    constructor(name: string, label = '') {
        this.label = label;
        this.name = name;
        this.value = true;
    }

    public isChecked(): boolean {
        return this.value;
    }
    public objectName(): string {
        return this.name;
    }
    public toggle(): void {
        this.value = !this.value;
    }
}
//@+node:felix.20221110215948.1: ** class StringLineEdit (leoGui)
/**
 * Simulate a QLineEdit.
 */
export class StringLineEdit {
    private disabled: boolean;
    private name: string;
    private pos: number;
    private s: string;

    constructor(name: string, disabled = false) {
        this.disabled = disabled;
        this.name = name;
        this.pos = 0;
        this.s = '';
    }

    public clear(): void {
        this.pos = 0;
        this.s = '';
    }
    public insert(s: string): void {
        if (s) {
            const i = this.pos;
            this.s = this.s.substring(0, i) + s + this.s.substring(i);
            this.pos += s.length;
        }
    }
    public objectName(): string {
        return this.name;
    }
    public text(): string {
        return this.s;
    }
}

//@+node:felix.20221109235451.1: ** class StringFindTabManager
/**
 * A string-based FindTabManager class.
 */
export class StringFindTabManager {
    public c: Commands;
    public entry_focus: any;
    // Find/change text boxes...
    public find_findbox: StringLineEdit;
    public find_replacebox: StringLineEdit;
    // Check boxes...
    public check_box_ignore_case: StringCheckBox;
    public check_box_mark_changes: StringCheckBox;
    public check_box_mark_finds: StringCheckBox;
    public check_box_regexp: StringCheckBox;
    public check_box_search_body: StringCheckBox;
    public check_box_search_headline: StringCheckBox;
    public check_box_whole_word: StringCheckBox;
    // Radio buttons...
    public radio_button_entire_outline: StringRadioButton;
    public radio_button_file_only: StringRadioButton;
    public radio_button_node_only: StringRadioButton;
    public radio_button_suboutline_only: StringRadioButton;

    //@+others
    //@+node:felix.20221109235451.2: *3*  sftm.ctor
    /**
     * Ctor for the FindTabManager class.
     */
    constructor(c: Commands) {
        this.c = c;
        this.entry_focus = undefined; // Accessed directly from code(!)
        // Find/change text boxes...
        this.find_findbox = new StringLineEdit('find_text');
        this.find_replacebox = new StringLineEdit('change_text');
        // Check boxes...
        this.check_box_ignore_case = new StringCheckBox('ignore_case');
        this.check_box_mark_changes = new StringCheckBox('mark_changes');
        this.check_box_mark_finds = new StringCheckBox('mark_finds');
        this.check_box_regexp = new StringCheckBox('pattern_match');
        this.check_box_search_body = new StringCheckBox('search_body');
        this.check_box_search_headline = new StringCheckBox('search_headline');
        this.check_box_whole_word = new StringCheckBox('whole_word');
        // Radio buttons...
        this.radio_button_entire_outline = new StringRadioButton(
            'entire_outline'
        );
        this.radio_button_file_only = new StringRadioButton('file_only');
        this.radio_button_node_only = new StringRadioButton('node_only');
        this.radio_button_suboutline_only = new StringRadioButton(
            'suboutline_only'
        );
        // Init the default values.
        this.init_widgets();
    }

    //@+node:felix.20221109235451.3: *3* sftm.clear_focus & init_focus & set_entry_focus
    public clear_focus(): void {
        this.entry_focus = undefined;
        // this.find_findbox.clearFocus(); // UNUSED IN LEOJS
    }
    public init_focus(): void {
        this.set_entry_focus();
        // SEND LEO SEARCH CONFIG TO VSCODE AND FOCUS IN FIND PANEL !
        // TODO : TEST THIS !!
        g.app.gui.startSearch();
        //
        // const w = this.find_findbox;
        // w.setFocus()
        // s = w.text()
        // w.setSelection(0, len(s))
    }
    public set_entry_focus(): void {
        // Remember the widget that had focus, changing headline widgets
        // to the tree pane widget.  Headline widgets can disappear!
        const c = this.c;
        let w = g.app.gui.get_focus();
        if (w !== c.frame.body.wrapper.widget) {
            w = c.frame.tree.treeWidget;
        }
        this.entry_focus = w;
    }

    //@+node:felix.20221109235451.4: *3* sftm.get_settings
    /**
     * Return a g.bunch representing all widget values.
     *
     * Similar to LeoFind.default_settings, but only for find-tab values.
     */
    public get_settings(): ISettings {
        return {
            // Find/change strings...
            find_text: this.find_findbox.text(),
            change_text: this.find_replacebox.text(),
            // Find options...
            file_only: this.radio_button_file_only.isChecked(),
            ignore_case: this.check_box_ignore_case.isChecked(),
            mark_changes: this.check_box_mark_changes.isChecked(),
            mark_finds: this.check_box_mark_finds.isChecked(),
            node_only: this.radio_button_node_only.isChecked(),
            pattern_match: this.check_box_regexp.isChecked(),
            search_body: this.check_box_search_body.isChecked(),
            search_headline: this.check_box_search_headline.isChecked(),
            suboutline_only: this.radio_button_suboutline_only.isChecked(),
            whole_word: this.check_box_whole_word.isChecked(),
        };
    }
    //@+node:felix.20221109235451.5: *3* sftm.init_widgets
    /**
     * Init widgets and ivars from c.config settings.
     * Create callbacks that always keep the LeoFind ivars up to date.
     */
    public init_widgets(): void {
        const c = this.c;
        const find = this.c.findCommands;

        // Find/change text boxes.
        const table1 = [
            ['find_findbox', 'find_text', ''], // '<find pattern here>' in original Leo
            ['find_replacebox', 'change_text', ''],
        ];
        for (let [widget_ivar, setting_name, default_val] of table1) {
            const w = this[widget_ivar as keyof StringFindTabManager];
            const s = c.config.getString(setting_name) || default_val;
            w.insert(s);
        }

        // Check boxes.
        const table2 = [
            ['ignore_case', 'check_box_ignore_case'],
            ['mark_changes', 'check_box_mark_changes'],
            ['mark_finds', 'check_box_mark_finds'],
            ['pattern_match', 'check_box_regexp'],
            ['search_body', 'check_box_search_body'],
            ['search_headline', 'check_box_search_headline'],
            ['whole_word', 'check_box_whole_word'],
        ];

        for (let [setting_name, widget_ivar] of table2) {
            const w = this[widget_ivar as keyof StringFindTabManager];
            const val = c.config.getBool(setting_name, false);
            // setattr(find, setting_name, val)
            (find[setting_name as keyof LeoFind] as any) = val;
            if (val !== w.isChecked()) {
                // Support LeoJS. :)
                w.toggle();
            }
        }

        // Radio buttons
        const table3: [string, string | undefined, string][] = [
            ['file_only', 'file_only', 'radio_button_file_only'], // #2684.
            ['node_only', 'node_only', 'radio_button_node_only'],
            ['entire_outline', undefined, 'radio_button_entire_outline'],
            [
                'suboutline_only',
                'suboutline_only',
                'radio_button_suboutline_only',
            ],
        ];

        for (let [setting_name, ivar, widget_ivar] of table3) {
            const w = this[widget_ivar as keyof StringFindTabManager];
            const val = c.config.getBool(setting_name, false);
            if (ivar !== undefined) {
                // assert hasattr(find, setting_name), setting_name
                (find[setting_name as keyof LeoFind] as any) = val;
                if (val !== w.isChecked()) {
                    w.toggle();
                }
            }
        }

        // Ensure one radio button is set.
        const w = this.radio_button_entire_outline;
        if (!find.node_only && !find.suboutline_only && !find.file_only) {
            if (!w.isChecked()) {
                w.toggle();
            }
        } else {
            if (w.isChecked()) {
                w.toggle();
            }
        }
    }

    //@+node:felix.20230213001211.1: *3* ftm.set_widgets_from_dict
    /**
     * Set all settings from d.
     */
    public set_widgets_from_dict(d: { [key: string]: any }): void {
        // Similar to ftm.init_widgets, which has already been called.
        const c = this.c;
        const find = c.findCommands;
        // Set find text.
        const find_text = d['find_text'];
        this.set_find_text(find_text);
        find.find_text = find_text;
        // Set change text.
        const change_text = d['change_text'];
        this.set_change_text(change_text);
        find.change_text = change_text;
        // Check boxes...
        const table1 = [
            ['ignore_case', 'check_box_ignore_case'],
            ['mark_changes', 'check_box_mark_changes'],
            ['mark_finds', 'check_box_mark_finds'],
            ['pattern_match', 'check_box_regexp'],
            ['search_body', 'check_box_search_body'],
            ['search_headline', 'check_box_search_headline'],
            ['whole_word', 'check_box_whole_word'],
        ];
        for (let [setting_name, widget_ivar] of table1) {
            const w = this[widget_ivar as keyof StringFindTabManager];
            const val = d[setting_name] || false;
            // setattr(find, setting_name, val)
            (find[setting_name as keyof LeoFind] as any) = val;
            if (val !== w.isChecked()) {
                // Support LeoJS. :)
                w.toggle();
            }
        }
        // Radio buttons...
        const table2: [string, string | undefined, string][] = [
            ['node_only', 'node_only', 'radio_button_node_only'],
            ['entire_outline', undefined, 'radio_button_entire_outline'],
            [
                'suboutline_only',
                'suboutline_only',
                'radio_button_suboutline_only',
            ],
            ['file_only', 'file_only', 'radio_button_file_only'], // #2684.
        ];
        for (let [setting_name, ivar, widget_ivar] of table2) {
            const w = this[widget_ivar as keyof StringFindTabManager];
            const val = d[setting_name] || false;
            if (ivar !== undefined) {
                // assert hasattr(find, setting_name), setting_name
                (find[setting_name as keyof LeoFind] as any) = val;
                if (val !== w.isChecked()) {
                    w.toggle();
                }
            }
        }
        // Ensure one radio button is set.
        const w = this.radio_button_entire_outline;
        if (!find.node_only && !find.suboutline_only && !find.file_only) {
            if (!w.isChecked()) {
                w.toggle();
            }
        } else {
            if (w.isChecked()) {
                w.toggle();
            }
        }
    }
    //@+node:felix.20221109235451.6: *3* sftm.set_body_and_headline_checkbox
    /**
     * Return the search-body and search-headline checkboxes to their defaults.
     */
    public set_body_and_headline_checkbox(): void {
        // #1840: headline-only one-shot
        const c = this.c;
        const find = c.findCommands;

        if (!find) {
            return;
        }
        const table: [string, StringCheckBox][] = [
            ['search_body', this.check_box_search_body],
            ['search_headline', this.check_box_search_headline],
        ];

        for (let [setting_name, w] of table) {
            const val = c.config.getBool(setting_name, false);
            if (val !== w.isChecked()) {
                w.toggle();
            }
        }
    }

    //@+node:felix.20221109235451.7: *3* sftm.set_radio_button
    /**
     * Set the value of the radio buttons
     */
    public set_radio_button(name: string): void {
        const d: { [key: string]: StringRadioButton } = {
            'file-only': this.radio_button_file_only,
            'node-only': this.radio_button_node_only,
            'entire-outline': this.radio_button_entire_outline,
            'suboutline-only': this.radio_button_suboutline_only,
        };
        // loop the keys instead of targeting d[name] directly
        for (let key in d) {
            let w = d[key];
            if (key === name) {
                if (w && !w.isChecked()) {
                    w.toggle();
                }
            } else {
                if (w && w.isChecked()) {
                    w.toggle(); // turn off other radios
                }
            }
        }
    }
    //@+node:felix.20221109235451.8: *3* sftm.text getters/setters
    public get_find_text(): string {
        let s = this.find_findbox.text();
        if (s && ['\r', '\n'].includes(s.substring(s.length - 1))) {
            s = s.slice(0, -1);
        }
        return s;
    }

    public get_change_text(): string {
        let s = this.find_replacebox.text();
        if (s && ['\r', '\n'].includes(s.substring(s.length - 1))) {
            s = s.slice(0, -1);
        }
        return s;
    }

    public set_find_text(s: string): void {
        const w = this.find_findbox;
        w.clear();
        w.insert(s);
    }

    public set_change_text(s: string): void {
        const w = this.find_replacebox;
        w.clear();
        w.insert(s);
    }
    //@+node:felix.20221109235451.9: *3* sftm.toggle_checkbox
    /**
     * Toggle the value of the checkbox whose name is given.
     */
    public toggle_checkbox(checkbox_name: string): void {
        const d: { [key: string]: StringCheckBox } = {
            ignore_case: this.check_box_ignore_case,
            mark_changes: this.check_box_mark_changes,
            mark_finds: this.check_box_mark_finds,
            pattern_match: this.check_box_regexp,
            search_body: this.check_box_search_body,
            search_headline: this.check_box_search_headline,
            whole_word: this.check_box_whole_word,
        };
        const w = d[checkbox_name];
        w.toggle();
    }
    //@-others
}

//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
