//@+leo-ver=5-thin
//@+node:felix.20211212000140.1: * @file src/core/leoFind.ts
/** 
 *  Leo's gui-independent find classes.
 */
//@+<< leoFind imports >>
//@+node:felix.20221012210017.1: ** << leoFind imports >>
import * as g from './leoGlobals';
import { new_cmd_decorator } from "../core/decorators";
import { Commands } from "./leoCommands";
import { Position, VNode } from './leoNodes';
import { LeoUI } from '../leoUI';
//@-<< leoFind imports >>
//@+<< Theory of operation of find/change >>
//@+node:felix.20221012210057.1: ** << Theory of operation of find/change >>
//@@language rest
//@@nosearch
//@+at
// LeoFind.py contains the gui-independent part of all of Leo's
// find/change code. Such code is tricky, which is why it should be
// gui-independent code! Here are the governing principles:
//
// 1. Find and Change commands initialize themselves using only the state
//    of the present Leo window. In particular, the Find class must not
//    save internal state information from one invocation to the next.
//    This means that when the user changes the nodes, or selects new
//    text in headline or body text, those changes will affect the next
//    invocation of any Find or Change command. Failure to follow this
//    principle caused all kinds of problems earlier versions.
//
//    This principle simplifies the code because most ivars do not
//    persist. However, each command must ensure that the Leo window is
//    left in a state suitable for restarting the incremental
//    (interactive) Find and Change commands. Details of initialization
//    are discussed below.
//
// 2. The Find and Change commands must not change the state of the
//    outline or body pane during execution. That would cause severe
//    flashing and slow down the commands a great deal. In particular,
//    c.selectPosition and c.editPosition must not be called while
//    looking for matches.
//
// 3. When incremental Find or Change commands succeed they must leave
//    the Leo window in the proper state to execute another incremental
//    command. We restore the Leo window as it was on entry whenever an
//    incremental search fails and after any Find All and Replace All
//    command. Initialization involves setting the self.c, self.v,
//    self.in_headline, self.wrapping and self.s_text ivars.
//
// Setting self.in_headline is tricky; we must be sure to retain the
// state of the outline pane until initialization is complete.
// Initializing the Find All and Replace All commands is much easier
// because such initialization does not depend on the state of the Leo
// window. Using the same kind of text widget for both headlines and body
// text results in a huge simplification of the code.
//
// The searching code does not know whether it is searching headline or
// body text. The search code knows only that self.s_text is a text
// widget that contains the text to be searched or changed and the insert
// and sel attributes of self.search_text indicate the range of text to
// be searched.
//
// Searching headline and body text simultaneously is complicated. The
// find_next_match() method and its helpers handle the many details
// involved by setting self.s_text and its insert and sel attributes.
//@-<< Theory of operation of find/change >>

/**
 * Command decorator for the findCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'findCommands']);
}

export interface ISettings {
    // State...
    in_headline: boolean;
    p?: Position,
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
    reverse: boolean;
    search_body: boolean;
    search_headline: boolean;
    suboutline_only: boolean;
    whole_word: boolean;
    wrapping: boolean;
}
type ISettingsKey = keyof ISettings;
type IFindUndoData = {
    end: number | undefined;
    in_headline: boolean;
    insert: number | undefined;
    p: Position;
    start: number | undefined;
};

//@+others
//@+node:felix.20221012210621.1: ** class LeoFind
/**
 * The base class for Leo's Find commands.
 */
export class LeoFind {

    public c: Commands;
    public expert_mode: boolean = false;  // Set in finishCreate.
    // Created by dw.createFindTab.
    public ftm: any; // FindTabManager; // TODO !
    // public k: KeyHandler = c.k // ? needed ?
    public re_obj!: RegExp;
    //
    // The work "widget".
    public work_s = '';  // p.b or p.c.
    public work_sel!: [number, number, number];  // pos, newpos, insert.
    //
    // Options ivars: set by FindTabManager.init.
    // These *must* be initially None, not False.
    public ignore_case!: boolean;
    public node_only!: boolean;
    public file_only!: boolean;
    public pattern_match!: boolean;
    public search_headline!: boolean;
    public search_body!: boolean;
    public suboutline_only!: boolean;
    public mark_changes!: boolean;
    public mark_finds!: boolean;
    public whole_word!: boolean;
    //
    // For isearch commands...
    public stack: [Position, number, number, boolean][] = [];
    // public inverseBindingDict: {[key: string]: [string, Stroke][]} = { };
    public isearch_ignore_case: boolean = false;
    public isearch_forward_flag: boolean = false;
    public isearch_regexp: boolean = false;
    // public iSearchStrokes: List[Stroke] = [];
    public findTextList: string[] = [];
    public changeTextList: string[] = [];
    //
    // For find/change...
    public find_text = "";
    public change_text = "";
    //
    // State machine...
    public escape_handler!: (preloaded?: boolean) => any;
    public handler!: (preloaded?: boolean) => any;
    // "Delayed" requests for do_find_next.
    public request_reverse: boolean = false;
    public request_pattern_match: boolean = false;
    public request_whole_word: boolean = false;
    // Internal state...
    public changeAllFlag: boolean = false;
    public findAllUniqueFlag: boolean = false;
    public find_def_data: any;
    public in_headline: boolean = false;
    public match_obj!: RegExpExecArray | undefined;
    public reverse: boolean = false;
    public root: Position | undefined;  // The start of the search, especially for suboutline-only.
    public unique_matches: string[] = [];
    //
    // User settings.
    public minibuffer_mode!: boolean;
    public reverse_find_defs!: boolean;

    //@+others
    //@+node:felix.20221012210736.1: *3* LeoFind.birth
    //@+node:felix.20221012210752.1: *4*  find.__init__
    constructor(c: Commands) {

        this.c = c;
        this.reload_settings();
    }
    //@+node:felix.20221012221041.1: *4* find.default_settings
    /** 
     * Return a dict representing all default settings.
     */
    public default_settings(): ISettings {

        const c = this.c;
        return {
            // State...
            in_headline: false,
            p: c.rootPosition()!,
            // Find/change strings...
            find_text: '',
            change_text: '',
            // Find options...
            file_only: false,
            ignore_case: false,
            mark_changes: false,
            mark_finds: false,
            node_only: false,
            pattern_match: false,
            reverse: false,
            search_body: true,
            search_headline: true,
            suboutline_only: false,
            whole_word: false,
            wrapping: false,
        };
    }
    //@+node:felix.20221012223520.1: *4* find.finishCreate
    public finishCreate(): void {
        // New in 4.11.1.
        // Must be called when config settings are valid.
        const c = this.c;
        this.reload_settings();
        // now that configuration settings are valid,
        // we can finish creating the Find pane.
        // ! not needed !
        // dw = c.frame.top
        // if dw:
        //     dw.finishCreateLogPane()
    }

    //@+node:felix.20221012225100.1: *4* find.init_ivars_from_settings
    /** 
     * Initialize all ivars from settings, including required defaults.
     * 
     * This should be called from the do_ methods as follows:
     * 
     * self.init_ivars_from_settings(settings)
     * if not self.check_args('find-next'):
     *     return <appropriate error indication>
     */
    public init_ivars_from_settings(settings: ISettings): void {

        //
        // Init required defaults.
        this.reverse = false;
        //
        // Init find/change strings.
        this.change_text = settings.change_text;
        this.find_text = settings.find_text;
        //
        // Init find options.
        this.file_only = settings.file_only;
        this.ignore_case = settings.ignore_case;
        this.mark_changes = settings.mark_changes;
        this.mark_finds = settings.mark_finds;
        this.node_only = settings.node_only;
        this.pattern_match = settings.pattern_match;
        this.search_body = settings.search_body;
        this.search_headline = settings.search_headline;
        this.suboutline_only = settings.suboutline_only;
        this.whole_word = settings.whole_word;
        // self.wrapping = settings.wrapping
    }

    //@+node:felix.20221012225603.1: *4* find.reload_settings
    /**
     * LeoFind.reload_settings.
     */
    public reload_settings(): void {
        const c = this.c;
        this.minibuffer_mode = c.config.getBool('minibuffer-find-mode', false);
        this.reverse_find_defs = c.config.getBool('reverse-find-defs', false);
    }
    //@+node:felix.20221012233803.1: *3* find.batch_change (script helper) & helpers
    /*
     *  Support batch change scripts.
     * 
     * replacement: a list of tuples (find_string, change_string).
     * settings: a dict or g.Bunch containing find/change settings.
     *           See find._init_from_dict for a list of valid settings.
     * 
     * Example:
     * 
     *     h = '@file src/ekr/coreFind.py'
     *     root = g.findNodeAnywhere(c, h)
     *     assert root
     *     replacements = (
     *         ('clone_find_all', 'do_clone_find_all'),
     *         ('clone_find_all_flattened', 'do_clone_find_all_flattened'),
     *     )
     *     settings = dict(suboutline_only=True)
     *     count = c.findCommands.batch_change(root, replacements, settings)
     *     if count:
     *         c.save()
    */
    public batch_change(
        root: Position,
        replacements: [string, string][],
        settings?: ISettings,
    ): number {
        try {
            // self._init_from_dict(settings or {})
            this._init_from_dict(settings || {});
            let count = 0;
            let find;
            let change;
            for ([find, change] of replacements) {
                count += this._batch_change_helper(root, find, change);
            }
            return count;
        }
        catch (e) {
            g.es_exception();
            return 0;
        }
    }
    //@+node:felix.20221012233803.3: *4* find._batch_change_helper
    private _batch_change_helper(p: Position, find_text: string, change_text: string): number {

        const c = this.c;
        const p1 = p.copy();
        const u = this.c.undoer;
        const undoType = 'Batch Change All';
        // Check...
        if (!find_text) {
            return 0;
        }
        if (!this.search_headline && !this.search_body) {
            return 0;
        }
        if (this.pattern_match) {
            const ok = this.compile_pattern();
            if (!ok) {
                return 0;
            }
        }
        // Init...
        this.find_text = find_text;
        this.change_text = this.replace_back_slashes(change_text);
        let positions: Generator<Position, any, unknown> | Position[];
        if (this.node_only) {
            positions = [p1];
        } else if (this.suboutline_only) {
            positions = p1.self_and_subtree();
        } else {
            positions = c.all_unique_positions();
        }
        // Init the work widget.
        const s: string = this.in_headline ? p.h : p.b;
        this.work_s = s;
        this.work_sel = [0, 0, 0];
        // The main loop.
        u.beforeChangeGroup(p1, undoType);
        let count: number = 0;
        for (const p of positions) {
            let count_h: number | false = 0;
            let count_b: number | false = 0;
            let new_h: string | undefined;
            let new_b: string | undefined;

            const undoData = u.beforeChangeNodeContents(p);
            if (this.search_headline) {
                [count_h, new_h] = this._change_all_search_and_replace(p.h);

                if (count_h) {
                    count += count_h;
                    p.h = new_h!;
                }
            }
            if (this.search_body) {
                [count_b, new_b] = this._change_all_search_and_replace(p.b);

                if (count_b) {
                    count += count_b;
                    p.b = new_b!;
                }
            }
            if (count_h || count_b) {
                u.afterChangeNodeContents(p1, 'Replace All', undoData);
            }

        }
        u.afterChangeGroup(p1, undoType, true);

        if (!g.unitTesting) {
            g.es(`${count}: ${find_text} => ${change_text}`);
        }
        return count;
    }
    //@+node:felix.20221012233803.4: *4* find._init_from_dict
    /**
     * Initialize ivars from settings (a dict or g.Bunch).
     */
    private _init_from_dict(settings: { [key: string]: any }): void {

        // The valid ivars and reasonable defaults.
        const valid = {
            ignore_case: false,
            node_only: false,
            pattern_match: false,
            search_body: true,
            search_headline: true,
            suboutline_only: false,  // Seems safest.  // Was true !!!
            whole_word: true
        };
        // Set ivars to reasonable defaults.
        for (const ivar in valid) { // * USING 'in' TO GET KEYS
            // setattr(self, ivar, valid.get(ivar));
            (this as any)[ivar] = (valid as any)[ivar];
        }
        // Override ivars from settings.
        let errors = 0;
        for (const ivar in settings) { // * USING 'in' TO GET KEYS
            if (ivar in valid) {
                const val = settings[ivar];
                if ([true, false].includes(val)) {
                    // setattr(self, ivar, val);
                    (this as any)[ivar] = val;
                } else {
                    g.trace(`bad value: ${ivar} = ${val}`);
                    errors += 1;
                }
            } else {
                g.trace(`ignoring ${ivar} setting`);
                errors += 1;
            }
        }
        if (errors) {
            g.printObj(Object.keys(valid).sort(), 'valid keys');
        }

    }
    //@+node:felix.20221013225533.1: *3* find.interactive_search_helper
    /**
     *
     * * Support interactive find.
     * 
     * c.findCommands.interactive_search_helper starts an interactive search with
     * the given settings. The settings argument may be either a g.Bunch or a
     * dict.
     * 
     * Example 1, settings is a g.Bunch:
     * 
     *     c.findCommands.interactive_search_helper(
     *         root = c.p,
     *         settings = g.Bunch(
     *             find_text = '^(def )',
     *             change_text = '\1',
     *             pattern_match=True,
     *             search_headline=False,
     *             whole_word=False,
     *         )
     *     )
     * 
     * Example 2, settings is a python dict:
     * 
     *     c.findCommands.interactive_search_helper(
     *         root = c.p,
     *         settings = {
     *             'find_text': '^(def )',
     *             'change_text': '\1',
     *             'pattern_match': True,
     *             'search_headline': False,
     *             'whole_word': False,
     *         }
     *     )
     */
    public interactive_search_helper(
        root?: Position,
        settings?: ISettings
    ): void {
        // Merge settings into default settings.
        const c = this.c;
        const d = this.default_settings();  // A g.bunch
        if (settings) {
            // Settings can be a dict or a g.Bunch.
            // g.Bunch has no update method.
            for (const key in settings) { // Using 'in' for keys
                (d as any)[key] = settings[(key as ISettingsKey)];
            }
        }
        this.ftm.set_widgets_from_dict(d); // So the *next* find-next will work.
        this.show_find_options_in_status_area();
        if (!this.check_args('find-next')) {
            return;
        }
        if (root && root.__bool__()) {
            c.selectPosition(root);
        }
        this.do_find_next(d);

    }
    //@+node:felix.20221013234514.1: *3* LeoFind.Commands (immediate execution)
    //@+node:felix.20221020002743.1: *4* show-all-tags
    @cmd('show-all-tags', 'Show all tags, organized by node.')
    public show_all_tags(): void {
        const c = this.c;
        if (!c) {
            return;
        }
        const tc = c.theTagController;
        if (tc) {
            tc.show_all_tags();
        } else {
            g.es('nodetags plugin not enabled');
        }
    }
    //@+node:felix.20221013234514.2: *4* find.change-then-find & helper
    @cmd('replace-then-find', 'Handle the replace-then-find command.')
    @cmd('change-then-find', 'Handle the replace-then-find command.')
    public change_then_find(): void {

        // Settings...
        this.init_in_headline();
        const settings = this.ftm.get_settings();
        this.do_change_then_find(settings);
    }
    //@+node:felix.20221013234514.3: *5* find.do_change_then_find
    /**
     * Do the change-then-find command from settings.
     *
     *  This is a stand-alone method for unit testing.
     */
    public do_change_then_find(settings: ISettings): boolean {

        const p = this.c.p;
        this.init_ivars_from_settings(settings);
        if (!this.check_args('change-then-find')) {
            return false;
        }
        if (this.change_selection(p)) {
            this.do_find_next(settings);
        }
        return true;

    }
    //@+node:felix.20221013234514.4: *4* find.clone-find_marked & helper
    @cmd(
        'clone-find-all-marked',
        'clone-find-all-marked, aka cfam.\n\n' +
        'Create an organizer node whose descendants contain clones of all marked\n' +
        'nodes. The list is *not* flattened: clones appear only once in the\n' +
        'descendants of the organizer node.'
    )
    @cmd(
        'cfam',
        'clone-find-all-marked, aka cfam.\n\n' +
        'Create an organizer node whose descendants contain clones of all marked\n' +
        'nodes. The list is *not* flattened: clones appear only once in the\n' +
        'descendants of the organizer node.')
    public cloneFindAllMarked(): void {
        this.do_find_marked(false);
    }
    @cmd(
        'clone-find-all-flattened-marked',
        'clone-find-all-flattened-marked, aka cffm.\n\n' +
        'Create an organizer node whose direct children are clones of all marked\n' +
        'nodes. The list is flattened: every cloned node appears as a direct\n' +
        'child of the organizer node, even if the clone also is a descendant of\n' +
        'another cloned node.'
    )
    @cmd(
        'cffm',
        'clone-find-all-flattened-marked, aka cffm.\n\n' +
        'Create an organizer node whose direct children are clones of all marked\n' +
        'nodes. The list is flattened: every cloned node appears as a direct\n' +
        'child of the organizer node, even if the clone also is a descendant of\n' +
        'another cloned node.'
    )
    public cloneFindAllFlattenedMarked(): void {
        this.do_find_marked(true);
    }
    //@+node:felix.20221013234514.5: *5* find.do_find_marked
    /**
     * Helper for clone-find-marked commands.
     *
     * This is a stand-alone method for unit testing.
     */
    public do_find_marked(flatten: boolean): boolean {

        const c = this.c;

        function isMarked(p: Position): boolean {
            return p.isMarked();
        }

        const root: Position | undefined = c.cloneFindByPredicate(
            c.all_unique_positions,
            isMarked,
            'No marked nodes',
            flatten,
            undefined,
            'clone-find-marked',
        );

        if (root) {
            // Unmarking all nodes is convenient.
            for (let v of c.all_unique_nodes()) {
                if (v.isMarked()) {
                    v.clearMarked();
                }
            }
            const n = root.numberOfChildren();
            root.b = `# Found ${n} marked node${g.plural(n)}`;
            c.selectPosition(root);
            c.redraw(root);

        }
        return !!root && root.__bool__();

    }
    //@+node:felix.20221013234514.6: *4* find.clone-find-parents
    @cmd(
        'clone-find-parents',
        'Create an organizer node whose direct children are clones of all\n' +
        'parents of the selected node, which must be a clone.'
    )
    public cloneFindParents(): boolean {

        const c = this.c;
        const u = this.c.undoer;
        const p = c.p;

        if (!p || !p.__bool__()) {
            return false;
        }
        if (!p.isCloned()) {
            g.es(`not a clone: ${p.h}`);
            return false;
        }
        const p0 = p.copy();
        const undoType = 'Find Clone Parents';
        const aList = c.vnode2allPositions(p.v);
        if (!aList.length) {
            g.trace('can not happen: no parents');
            return false;
        }
        // Create the node as the last top-level node.
        // All existing positions remain valid.
        u.beforeChangeGroup(p, undoType);
        let b = u.beforeInsertNode(p);
        const found = c.lastTopLevel().insertAfter();
        found.h = `Found: parents of ${p.h}`;
        u.afterInsertNode(found, 'insert', b);
        const seen: VNode[] = [];
        for (let p2 of aList) {
            const parent = p2.parent();
            if (parent && parent.__bool__() && !seen.includes(parent.v)) {
                seen.push(parent.v);
                b = u.beforeCloneNode(parent);
                // Bug fix 2021/06/15: Create the clone directly as a child of found.
                const clone = parent.copy();
                const n = found.numberOfChildren();
                clone._linkCopiedAsNthChild(found, n);
                u.afterCloneNode(clone, 'clone', b);
            }
        }

        u.afterChangeGroup(p0, undoType);
        c.setChanged();
        c.redraw(found);

        return true;

    }
    //@+node:felix.20221013234514.7: *4* find.find-def, do_find_def & helpers
    @cmd('find-def', 'Find the def or class under the cursor.')
    public find_def(strict: boolean = false): [Position | undefined, number | undefined, number | undefined] {

        const ftm = this.ftm;
        const p = this.c.p;
        // Check.
        const word = this._compute_find_def_word();
        if (!word) {
            return [undefined, undefined, undefined];
        }
        // Settings...
        const str = word[0];
        const prefix = g.isUpper(str) ? 'class' : 'def';
        const find_pattern = prefix + ' ' + word;
        ftm.set_find_text(find_pattern);
        this._save_before_find_def(p);  // Save previous settings.
        this.init_vim_search(find_pattern);
        this.update_change_list(this.change_text);  // Optional. An edge case.
        // Do the command!
        const settings = this._compute_find_def_settings(find_pattern);

        return this.do_find_def(settings, word, strict);
    }

    /**
     * Same as find_def, but don't call _switch_style.
     */
    public find_def_strict(): [Position | undefined, number | undefined, number | undefined] {
        return this.find_def(true);
    }
    /**
     * A standalone helper for unit tests.
     */
    public do_find_def(settings: ISettings, word: string, strict: boolean): [Position | undefined, number | undefined, number | undefined] {
        return this._fd_helper(settings, word, true, strict);
    }
    //@+node:felix.20221013234514.8: *5* find._compute_find_def_settings
    private _compute_find_def_settings(find_pattern: string): ISettings {

        const settings = this.default_settings();
        const table: [ISettingsKey, boolean | string][] = [
            ['change_text', ''],
            ['find_text', find_pattern],
            ['ignore_case', false],
            ['pattern_match', false],
            ['reverse', false],
            ['search_body', true],
            ['search_headline', false],
            ['whole_word', true],
        ];
        let attr: ISettingsKey;
        let val: boolean | string;
        for (let [attr, val] of table) {
            // Guard against renamings & misspellings.
            // ? needed ?
            // assert hasattr(this, attr), attr;
            //assert attr in settings.__dict__, attr;

            // Set the values.
            // setattr(this, attr, val);
            (settings as any)[attr] = val;

        }
        return settings;

    }
    //@+node:felix.20221013234514.9: *5* find._compute_find_def_word
    /**
     * Init the find-def command. Return the word to find or None.
     */
    public _compute_find_def_word(): string | undefined {  // pragma: no cover (cmd)

        const c = this.c;

        const w = c.frame.body.wrapper; // TODO : has to be pre-set by GUI ! 
        // First get the word.
        c.bodyWantsFocusNow(); // TODO: sets GUI finalFocus position for next refresh

        if (!w.hasSelection()) {
            c.editCommands.extendToWord(true); // TODO or REPLACE with something else
        }

        const word: string = w.getSelectedText().strip();
        if (!word) {
            return undefined;
        }

        const keywords = [
            "False", "await", "else", "import", "pass",
            "None", "break", "except", "in", "raise",
            "True", "class", "finally", "is", "return",
            "and", "continue", "for", "lambda", "try",
            "as", "def", "from", "nonlocal", "while",
            "assert", "del", "global", "not", "with",
            "async", "elif", "if", "or", "yield"
        ];
        if (keywords.includes(word)) {
            return undefined;
        }

        // Return word, stripped of preceding class or def.
        for (let tag of ['class ', 'def ']) {
            const found = word.startsWith(tag) && word.length > tag.length;
            if (found) {
                return word.substring(tag.length).trim();
            }
        }
        return word;
    }
    //@+node:felix.20221013234514.10: *5* find._fd_helper
    /** 
     * Find the definition of the class, def or var under the cursor.
     *
     * return p, pos, newpos for unit tests.
     */
    private _fd_helper(
        settings: ISettings,
        word: string,
        def_flag: boolean,
        strict: boolean,
    ): [Position | undefined, number | undefined, number | undefined] {

        const c = this.c;
        const find = this;
        const ftm = this.ftm;
        let prefix: string = "";
        //
        // Recompute find_text for unit tests.
        if (def_flag) {
            prefix = g.isUpper(word[0]) ? 'class' : 'def';
            this.find_text = prefix + ' ' + word;
            settings.find_text = this.find_text;
        } else {
            this.find_text = word + ' =';
            settings.find_text = this.find_text;
        }
        //
        // Just search body text.
        this.search_headline = false;
        this.search_body = true;
        const w = c.frame.body.wrapper;
        // Check.
        if (!w) {
            return [undefined, undefined, undefined];
        }
        const save_sel = w.getSelectionRange();
        const ins = w.getInsertPoint();
        const old_p = c.p;
        let p: Position | undefined;

        if (this.reverse_find_defs) {
            // #2161: start at the last position.
            p = c.lastPosition();
        } else {
            // Start in the root position.
            p = c.rootPosition()!;
        }
        // Required.
        c.selectPosition(p);
        c.redraw();
        c.bodyWantsFocusNow(); // TODO : either set finalFocus or some flag in gui implementation

        // #1592.  Ignore hits under control of @nosearch
        const old_reverse = this.reverse;

        let pos;
        let newpos;
        let found = false;

        try {
            // #2161:
            this.reverse = this.reverse_find_defs;
            // # 2288:
            this.work_s = p.b;
            if (this.reverse_find_defs) {
                this.work_sel = [p.b.length, p.b.length, p.b.length];
            } else {
                this.work_sel = [0, 0, 0];
            }
            while (true) {
                [p, pos, newpos] = this.find_next_match(p);
                found = pos !== undefined;
                if (found || !g.inAtNosearch(p)) {// do *not* use c.p.
                    break;
                }
            }
            if (!found && def_flag && !strict) {
                // Leo 5.7.3: Look for an alternative definition of function/methods.
                const word2 = this._switch_style(word);
                if (this.reverse_find_defs) {
                    // #2161: start at the last position.
                    p = c.lastPosition();
                } else {
                    p = c.rootPosition()!;
                }
                if (word2) {
                    const find_pattern = prefix + ' ' + word2;
                    find.find_text = find_pattern;
                    ftm.set_find_text(find_pattern);
                    // #1592.  Ignore hits under control of @nosearch
                    while (true) {
                        [p, pos, newpos] = this.find_next_match(p);
                        found = pos !== undefined;
                        if (!found || !g.inAtNosearch(p)) {
                            break;
                        }

                    }
                }
            }
        }
        catch (e) {
            //
        }
        finally {
            this.reverse = old_reverse;
        }
        if (found) {
            c.redraw(p);
            w.setSelectionRange(pos, newpos, newpos);
            c.bodyWantsFocusNow();
            return [p, pos, newpos];
        }

        this._restore_after_find_def();  // Avoid massive confusion!
        let i;
        let j;
        [i, j] = save_sel;
        c.redraw(old_p);
        w.setSelectionRange(i, j, ins);
        c.bodyWantsFocusNow();
        return [undefined, undefined, undefined];

    }

    //@+node:felix.20221013234514.11: *5* find._restore_after_find_def
    /**
     * Restore find settings in effect before a find-def command.
     */
    private _restore_after_find_def(): void {

        const b = this.find_def_data;  // A g.Bunch
        if (b) {
            this.ignore_case = b.ignore_case;
            this.pattern_match = b.pattern_match;
            this.search_body = b.search_body;
            this.search_headline = b.search_headline;
            this.whole_word = b.whole_word;
            this.find_def_data = undefined;
        }
    }
    //@+node:felix.20221013234514.12: *5* find._save_before_find_def
    /** 
     * Save the find settings in effect before a find-def command.
     */
    private _save_before_find_def(p: Position): void {

        if (!this.find_def_data) {
            this.find_def_data = {
                ignore_case: this.ignore_case,
                p: p.copy(),
                pattern_match: this.pattern_match,
                search_body: this.search_body,
                search_headline: this.search_headline,
                whole_word: this.whole_word
            };
        }
    }
    //@+node:felix.20221013234514.13: *5* find._switch_style
    /**
     * Switch between camelCase and underscore_style function definitions.
     * Return undefined if there would be no change.
     */
    private _switch_style(word: string): string | undefined {

        let s = word;
        if (!s) {
            return undefined;
        }

        if (g.isUpper(s[0])) {
            return undefined;  // Don't convert class names.
        }
        if (s.indexOf('_') > -1) {
            // Convert to CamelCase
            s = s.toLowerCase();
            while (s) {
                const i = s.indexOf('_');
                if (i === -1) {
                    break;
                }
                s = s.substring(0, i) + g.capitalize(s.substring(i + 1));
            }
            return s;
        }

        // Convert to underscore_style.
        const result = [];
        let i;
        let ch;
        for (const [i, ch] of g.enumerate(s)) {

            if (i > 0 && g.isUpper(ch)) {
                result.push('_');
            }
            result.push(ch.toLowerCase());

        }
        s = result.join("");
        return s === word ? undefined : s;

    }
    //@+node:felix.20221013234514.14: *4* find.find-next, find-prev & do_find_*
    @cmd('find-next', 'The find-next command.')
    public find_next(): void {

        // Settings...
        this.reverse = false;
        this.init_in_headline();  // Do this *before* creating the settings.
        const settings = this.ftm.get_settings();
        // Do the command!
        this.do_find_next(settings);
    }
    @cmd('find-prev', 'Handle F2 (find-previous)')
    public find_prev(): void {

        // Settings...
        this.init_in_headline();  // Do this *before* creating the settings.
        const settings = this.ftm.get_settings();
        // Do the command!
        this.do_find_prev(settings);
    }
    //@+node:felix.20221013234514.15: *5* find.do_find_next & do_find_prev
    /**
     * Find the previous instance of this.find_text.
     */
    public do_find_prev(settings: ISettings): [Position | undefined, number | undefined, number | undefined] {

        this.request_reverse = true;
        return this.do_find_next(settings);
    }
    /** 
     * Find the next instance of this.find_text.
     *
     * Return True (for vim-mode) if a match was found.
     */
    public do_find_next(settings: ISettings): [Position | undefined, number | undefined, number | undefined] {

        const c = this.c;
        let p: Position | undefined = this.c.p;
        //
        // The gui widget may not exist for headlines.
        const gui_w = this.in_headline ? c.edit_widget(p) : c.frame.body.wrapper; // TODO : edit widget!
        //
        // Init the work widget, so we don't get stuck.
        const s = this.in_headline ? p.h : p.b;
        const ins = gui_w ? gui_w.getInsertPoint() : 0;
        this.work_s = s;
        this.work_sel = [ins, ins, ins];
        //
        // Set the settings *after* initing the search.
        this.init_ivars_from_settings(settings);
        //
        // Honor delayed requests.
        for (const ivar of ['reverse', 'pattern_match', 'whole_word']) {
            const request = 'request_' + ivar;
            const val = (this as any)[request]; // getattr(this, request)
            if (val) {  // Only *set* the ivar!
                // setattr(this, ivar, val)  // Set the ivar.
                (this as any)[ivar] = val;
                //setattr(this, request, false)  // Clear the request!
                (this as any)[request] = false;
            }
        }
        //
        // Leo 6.4: set/clear this.root
        if (this.root && this.root.__bool__()) { // pragma: no cover
            if (!p.__eq__(this.root) && !this.root.isAncestorOf(p)) {
                // p is outside of this.root's tree.
                // Clear suboutline-only.
                this.root = undefined;
                this.suboutline_only = false;
                this.set_find_scope_every_where();  // Update find-tab & status area.
            }
        } else if (this.suboutline_only) {
            // Start the range and set suboutline-only.
            this.root = c.p;
            this.set_find_scope_suboutline_only();  // Update find-tab & status area.

        } else if (this.file_only) {
            // Start the range and set file-only.
            this.root = c.p;
            p = c.p;
            let node: Position = this.c.p;
            let found = false;
            let hitBase = false;
            while (!found && !hitBase) {
                let h = node.h;
                if (h) {
                    h = h.split(" ")[0];
                }

                if (["@clean", "@file", "@asis", "@thin", "@edit",
                    "@auto", "@auto-md", "@auto-org",
                    "@auto-otl", "@auto-rst"].includes(h)) {
                    found = true;
                } else {
                    if (node.level() === 0) {
                        hitBase = true;
                    } else {
                        node = node.parent();
                    }
                }
            }
            this.root = node;
            this.set_find_scope_file_only(); // Update find-tab & status area.
            p = node;


        }
        //
        // Now check the args.
        const tag = this.reverse ? 'find-prev' : 'find-next';
        if (!this.check_args(tag)) { // Issues error message.
            return [undefined, undefined, undefined];
        }
        const data = this.save();
        let pos;
        let newpos;
        [p, pos, newpos] = this.find_next_match(p);
        const found = pos !== undefined;
        if (found) {
            this.show_success(p!, pos!, newpos!);
        } else {
            // Restore previous position.
            this.restore(data);
        }
        this.show_status(found);
        return [p, pos, newpos];
    }
    //@+node:felix.20221013234514.18: *4* find.find-var & do_find_var
    @cmd('find-var', 'Find the var under the cursor.')
    public find_var(): void {

        const ftm = this.ftm;
        const p = this.c.p;
        // Check...
        const word = this._compute_find_def_word();
        if (!word) {
            return;
        }
        // Settings...
        const find_pattern = word + ' =';
        // this.find_pattern = find_pattern; // ? NEEDED ?
        ftm.set_find_text(find_pattern);
        this._save_before_find_def(p);  // Save previous settings.
        this.init_vim_search(find_pattern);
        this.update_change_list(this.change_text);  // Optional. An edge case.
        const settings = this._compute_find_def_settings(find_pattern);
        // Do the command!
        this.do_find_var(settings, word);
    }

    /**
     * A standalone helper for unit tests.
     */
    public do_find_var(settings: ISettings, word: string): [Position | undefined, number | undefined, number | undefined] {

        return this._fd_helper(settings, word, false, false);
    }
    //@+node:felix.20221013234514.20: *4* find.replace
    @cmd('replace', 'Replace the selected text with the replacement text.')
    @cmd('change', 'Replace the selected text with the replacement text.')
    public change(): void {

        const p = this.c.p;
        if (this.check_args('replace')) {
            this.init_in_headline();
            this.change_selection(p);
        }
    }


    //@+node:felix.20221013234514.21: *4* find.set-find-*
    @cmd('set-find-everywhere', 'Set the \'Entire Outline\' radio button in the Find tab.')
    public set_find_scope_every_where(): void {

        this.set_find_scope('entire-outline');
    }
    @cmd('set-find-node-only', 'Set the \'Node Only\' radio button in the Find tab.')
    public set_find_scope_node_only(): void {

        this.set_find_scope('node-only');
    }
    @cmd('set-find-file-only', 'Set the \'File Only\' radio button in the Find tab.')
    public set_find_scope_file_only(): void {

        this.set_find_scope('file-only');
    }
    @cmd('set-find-suboutline-only', 'Set the \'Suboutline Only\' radio button in the Find tab.')
    public set_find_scope_suboutline_only(): void {

        this.set_find_scope('suboutline-only');
    }

    /**
     * Set the radio buttons to the given scope
     */
    public set_find_scope(where: string): void {

        const c = this.c;
        const fc = this.c.findCommands;
        this.ftm.set_radio_button(where);

        // const options = fc.compute_find_options_in_status_area(); // ? NEEDED ?
        // c.frame.statusLine.put(options); // ? NEEDED ?
    }
    //@+node:felix.20221013234514.22: *4* find.show-find-options
    @cmd('show-find-options', 'Show the present find options')
    public show_find_options(): void {

        // frame = self.c.frame // ? NEEDED ?
        // frame.clearStatusLine() // ? NEEDED ?
        let part1;
        let part2;
        [part1, part2] = this.compute_find_options();
        // frame.putStatusLine(part1, 'blue');  // ? NEEDED ?
        // frame.putStatusLine(part2);  // ? NEEDED ?
        console.log(part1);
        console.log(part2);

    }
    //@+node:felix.20221013234514.23: *5* LeoFind.compute_find_options
    /**
     * Return the status line as two strings.
     */
    public compute_find_options(): [string, string] {

        const z: string[] = [];
        let scope: string;
        // Set the scope field.
        if (this.suboutline_only) {
            scope = 'tree';
        } else if (this.node_only) {
            scope = 'node';
        } else {
            scope = 'all';
        }
        // scope = this.getOption('radio-search-scope')
        // d = {'entire-outline':'all','suboutline-only':'tree','node-only':'node'}
        // scope = d.get(scope) or ''

        const head = this.search_headline ? 'head' : '';
        const body = this.search_body ? 'body' : '';
        const sep = head && body ? '+' : '';
        const part1 = `${head}${sep}${body} ${scope}  `;
        // Set the type field.
        const regex = this.pattern_match;
        if (regex) {
            z.push('regex');
        }
        const table = [
            ['reverse', 'reverse'],
            ['ignore_case', 'noCase'],
            ['whole_word', 'word'],
            // ['wrap', 'wrap'],
            ['mark_changes', 'markChg'],
            ['mark_finds', 'markFnd']
        ];
        let ivar;
        let s;
        for (const [ivar, s] of table) {
            const val = (this as any)['ivar'];
            if (val) {
                z.push(s);
            }
        }
        const part2 = z.join(' ');

        return [part1, part2];

    }
    //@+node:felix.20221013234514.24: *4* find.toggle-find-*
    @cmd('toggle-find-collapses-nodes', 'Toggle the \'Collapse Nodes\' checkbox in the find tab.')
    public toggle_find_collapses_nodes(): void {
        const c = this.c;
        c.sparse_find = !c.sparse_find;
        if (!g.unitTesting) {
            g.es('sparse_find', c.sparse_find);
        }
    }
    @cmd('toggle-find-ignore-case-option', 'Toggle the \'Ignore Case\' checkbox in the Find tab.')
    public toggle_ignore_case_option(): void {
        this.toggle_option('ignore_case');
    }
    @cmd('toggle-find-mark-changes-option', 'Toggle the \'Mark Changes\' checkbox in the Find tab.')
    public toggle_mark_changes_option(): void {
        this.toggle_option('mark_changes');
    }
    @cmd('toggle-find-mark-finds-option', 'Toggle the \'Mark Finds\' checkbox in the Find tab.')
    public toggle_mark_finds_option(): void {
        return this.toggle_option('mark_finds');
    }
    @cmd('toggle-find-regex-option', 'Toggle the \'Regexp\' checkbox in the Find tab.')
    public toggle_regex_option(): void {
        this.toggle_option('pattern_match');
    }
    @cmd('toggle-find-in-body-option', 'Set the \'Search Body\' checkbox in the Find tab.')
    public toggle_search_body_option(): void {
        return this.toggle_option('search_body');
    }
    @cmd('toggle-find-in-headline-option', 'Toggle the \'Search Headline\' checkbox in the Find tab.')
    public toggle_search_headline_option(): void {
        this.toggle_option('search_headline');
    }
    @cmd('toggle-find-word-option', 'Toggle the \'Whole Word\' checkbox in the Find tab.')
    public toggle_whole_word_option(): void {
        this.toggle_option('whole_word');
    }
    // # @cmd('toggle-find-wrap-around-option')
    // # public toggleWrapSearchOption(this, event):
    // # """Toggle the 'Wrap Around' checkbox in the Find tab."""
    // # return this.toggle_option('wrap')

    public toggle_option(checkbox_name: string): void {
        const c = this.c;
        const fc = this.c.findCommands;
        this.ftm.toggle_checkbox(checkbox_name);
        // const options = fc.compute_find_options_in_status_area(); // ? NEEDED ?
        // c.frame.statusLine.put(options); // ? NEEDED ?
    }
    //@+node:felix.20221016013001.1: *3* LeoFind.Commands (interactive)
    //@+node:felix.20221018001528.1: *4* find.change-all & helper
    // * The interactive_change_all methods are not implemented
    // * '@cmd' commands @cmd('change-all'), etc,  are overriden in the UI client.
    // * do_change_all is intended to be called directly from the UI client instead.

    // @cmd('change-all')
    // @cmd('replace-all')
    // def interactive_change_all(self, event: Event=None) -> None:  # pragma: no cover (interactive)
    //     """Replace all instances of the search string with the replacement string."""
    //     self.ftm.clear_focus()
    //     self.ftm.set_entry_focus()
    //     prompt = 'Replace Regex: ' if self.pattern_match else 'Replace: '
    //     self.start_state_machine(event, prompt,
    //         handler=self.interactive_replace_all1,
    //         # Allow either '\t' or '\n' to switch to the change text.
    //         escape_handler=self.interactive_replace_all1,
    //     )

    // def interactive_replace_all1(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     k = self.k
    //     find_pattern = k.arg
    //     self._sString = k.arg
    //     self.update_find_list(k.arg)
    //     regex = ' Regex' if self.pattern_match else ''
    //     prompt = f"Replace{regex}: {find_pattern} With: "
    //     k.setLabelBlue(prompt)
    //     self.add_change_string_to_label()
    //     k.getNextArg(self.interactive_replace_all2)

    // def interactive_replace_all2(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper

    //     # Update settings data.
    //     find_pattern = self._sString
    //     change_pattern = k.arg
    //     self.init_vim_search(find_pattern)
    //     self.update_change_list(change_pattern)
    //     # Compute settings...
    //     self.ftm.set_find_text(find_pattern)
    //     self.ftm.set_change_text(change_pattern)
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     # Do the command!
    //     self.do_change_all(settings)
    //@+node:felix.20221016013001.3: *5* find.do_change_all & helpers
    public do_change_all(settings: ISettings): number {
        const c = this.c;
        // Settings...
        this.init_ivars_from_settings(settings);
        if (!this.check_args('change-all')) {
            return 0;
        }
        const n = this._change_all_helper(settings);
        // 
        // Bugs #947, #880 and #722:
        // Set ancestor @<file> nodes by brute force.
        for (let p of c.all_positions()) {
            if (
                p.anyAtFileNodeName() &&
                !p.v.isDirty() &&
                [...p.subtree()].some((element) => element.v.isDirty())
                // any(p2.v.isDirty() for p2 in p.subtree());
            ) {
                p.setDirty();
            }
        }
        // c.redraw(); // ? NEEDED ?
        return n;
    }
    //@+node:felix.20221016013001.4: *6* find._change_all_helper
    /**
     * Do the change-all command. Return the number of changes, or 0 for error.
     */
    private _change_all_helper(settings: ISettings): number {

        // Caller has checked settings.

        const c = this.c;
        const current = this.c.p;
        const u = this.c.undoer;
        const undoType = 'Replace All';
        const t1 = g.process_time();
        if (!this.check_args('change-all')) {
            return 0;
        }
        this.init_in_headline();
        const saveData = this.save();

        this.in_headline = this.search_headline;  // Search headlines first.
        // Remember the start of the search.
        let p = c.p.copy();
        this.root = p;
        // Set the work widget.
        const s = this.in_headline ? p.h : p.b;
        const ins = this.reverse ? s.length : 0;
        this.work_s = s;
        this.work_sel = [ins, ins, ins];
        let count = 0;
        u.beforeChangeGroup(current, undoType);

        // Fix bug 338172: ReplaceAll will not replace newlines
        // indicated as \n in target string.
        if (!this.find_text) {
            return 0;
        }
        if (!this.search_headline && !this.search_body) {
            return 0;
        }
        this.change_text = this.replace_back_slashes(this.change_text);
        if (this.pattern_match) {
            const ok = this.compile_pattern();
            if (!ok) {
                return 0;
            }
        }

        let positions: Position[];
        // #1428: Honor limiters in replace-all.
        if (this.node_only) {
            positions = [c.p];
        } else if (this.suboutline_only) {
            positions = [...c.p.self_and_subtree()];
        } else {
            positions = [...c.all_unique_positions()];
        }

        for (let p of positions) {
            let count_h: number | false = 0;
            let count_b: number | false = 0;
            let new_h: string | undefined;
            let new_b: string | undefined;
            const undoData = u.beforeChangeNodeContents(p);
            if (this.search_headline) {
                [count_h, new_h] = this._change_all_search_and_replace(p.h);
                if (count_h) {
                    count += count_h;
                    p.h = new_h!;
                }
            }
            if (this.search_body) {
                [count_b, new_b] = this._change_all_search_and_replace(p.b);
                if (count_b) {
                    count += count_b;
                    p.b = new_b!;
                }
            }
            if (count_h || count_b) {
                u.afterChangeNodeContents(p, 'Replace All', undoData);
            }
        }
        this.ftm.set_radio_button('entire-outline');
        // suboutline-only is a one-shot for batch commands.
        this.root = undefined;
        this.node_only = false;
        this.suboutline_only = false;
        p = c.p;
        u.afterChangeGroup(p, undoType, true);
        const t2 = g.process_time();
        if (!g.unitTesting) {
            g.es_print(
                `changed ${count} instances${count} ` +
                `in ${t2 - t1} sec.`);
        }
        // c.recolor(); // ? NEEDED ?
        // c.redraw(p); // ? NEEDED ?
        this.restore(saveData);

        return count;

    }
    //@+node:felix.20221016013001.5: *6* find._change_all_search_and_replace & helpers
    /** 
     * Search s for this.find_text and replace with this.change_text.
     *
     * Return (found, new text)
     */
    private _change_all_search_and_replace(s: string): [number | false, string | undefined] {

        // This hack would be dangerous on MacOs: it uses '\r' instead of '\n' (!)
        if (g.isWindows) {
            // Ignore '\r' characters, which may appear in @edit nodes.
            // Fixes this bug: https://groups.google.com/forum/#!topic/leo-editor/yR8eL5cZpi4
            //s = s.replace('\r', '')
            s = s.replace(/\r/g, '');
        }
        if (!s) {
            return [false, undefined];
        }

        // Order matters: regex matches ignore whole-word.
        if (this.pattern_match) {
            return this._change_all_regex(s);
        }

        if (this.whole_word) {
            return this._change_all_word(s);
        }

        return this._change_all_plain(s);
    }
    //@+node:felix.20221016013001.6: *7* find._change_all_plain
    /**
     * Perform all plain find/replace on s.
     * return (count, new_s)
     */
    private _change_all_plain(s: string): [number, string] {
        let find = this.find_text;
        const change = this.change_text;
        // #1166: s0 and find0 aren't affected by ignore-case.
        const s0 = s;
        const find0 = this.replace_back_slashes(find);
        if (this.ignore_case) {
            s = s0.toLowerCase();
            find = find0.toLowerCase();
        }
        let count = 0;
        let prev_i = 0;
        let progress: number;
        let result = [];
        let i;
        while (true) {
            progress = prev_i;
            // #1166: Scan using s and find.
            i = s.indexOf(find, prev_i);
            if (i === -1) {
                break;
            }
            // #1166: Replace using s0 & change.
            count += 1;
            result.push(s0.substring(prev_i, i));
            result.push(change);
            prev_i = Math.max(prev_i + 1, i + find.length);  // 2021/01/08 (!)
            console.assert(prev_i > progress, prev_i.toString());
        }

        // #1166: Complete the result using s0.
        result.push(s0.substring(prev_i));
        return [count, result.join('')];
    }
    //@+node:felix.20221016013001.7: *7* find._change_all_regex
    /**
     * Perform all regex find/replace on s.
     * return (count, new_s)
     */
    private _change_all_regex(s: string): [number, string] {

        let count = 0;
        let prev_i = 0;
        let result = [];

        let flags = "mgd";
        if (this.ignore_case) {
            flags += "i";
        }
        const re = RegExp(this.find_text, flags);
        // let m of re.finditer(this.find_text, s, flags)
        for (let m; m = re.exec(s); null) {

            count += 1;
            const i = re.lastIndex - m[0].length; // m.start();
            result.push(s.substring(prev_i, i));
            // #1748.
            // groups = m.groups(); // check if array more than one item instead
            // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
            let change_text: string;
            const groups = m.length > 1; // ! FLAG INSTEAD ! send m array result instead of groups !
            if (groups) {
                change_text = this.make_regex_subs(this.change_text, m); // ! send m array result instead of groups !
            } else {
                change_text = this.change_text;
            }
            result.push(change_text);
            prev_i = re.lastIndex; // m.end();  // ? equivalent to lastIndex ?

        }
        // Compute the result.
        result.push(s.substring(prev_i));
        s = result.join('');
        return [count, s];
    }
    //@+node:felix.20221016013001.8: *7* find._change_all_word
    /**
     * Perform all whole word find/replace on s.
     * return (count, new_s)
     */
    private _change_all_word(s: string): [number, string] {

        let find = this.find_text;
        const change = this.change_text;
        // #1166: s0 and find0 aren't affected by ignore-case.
        const s0 = s;
        const find0 = this.replace_back_slashes(find);
        if (this.ignore_case) {
            s = s0.toLowerCase();
            find = find0.toLowerCase();
        }
        let count = 0;
        let prev_i = 0;
        const result = [];
        while (true) {
            // #1166: Scan using s and find.
            const i = s.indexOf(find, prev_i);
            if (i === -1) {
                break;
            }
            // #1166: Replace using s0, change & find0.
            result.push(s0.substring(prev_i, i));
            if (g.match_word(s, i, find)) {
                count += 1;
                result.push(change);
            } else {
                result.push(find0);
            }
            prev_i = i + find.length;

        }
        // #1166: Complete the result using s0.
        result.push(s0.substring(prev_i));
        return [count, result.join('')];
    }
    //@+node:felix.20221016013001.13: *4* find.clone-find-all & helper
    // * The interactive_clone_find_all methods are not implemented
    // * '@cmd' commands @cmd('clone-find-all'), etc,  are overriden in the UI client.
    // * do_clone_find_all is intended to be called directly from the UI client instead.

    // @cmd('clone-find-all')
    // @cmd('find-clone-all')
    // @cmd('cfa')
    // def interactive_clone_find_all(self,
    //     event: Event=None,
    //     preloaded: bool=False,
    // ) -> None:  # pragma: no cover (interactive)
    //     """
    //     clone-find-all ( aka find-clone-all and cfa).

    //     Create an organizer node whose descendants contain clones of all nodes
    //     matching the search string, except @nosearch trees.

    //     The list is *not* flattened: clones appear only once in the
    //     descendants of the organizer node.
    //     """
    //     w = self.c.frame.body.wrapper
    //     if not w:
    //         return
    //     if not preloaded:
    //         self.preload_find_pattern(w)
    //     self.start_state_machine(event,
    //         prefix='Clone Find All: ',
    //         handler=self.interactive_clone_find_all1)

    // def interactive_clone_find_all1(self, event: Event) -> int:  # pragma: no cover (interactive)
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper
    //     # Settings...
    //     pattern = k.arg
    //     self.ftm.set_find_text(pattern)
    //     self.init_vim_search(pattern)
    //     self.init_in_headline()
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     count = self.do_clone_find_all(settings)
    //     if count:
    //         c.redraw()
    //         c.treeWantsFocus()
    //     return count
    //@+node:felix.20221016013001.14: *5* find.do_clone_find_all
    /** 
     * Do the clone-all-find commands from settings.
     *
     * Return the count of found nodes.
     *
     * This is a stand-alone method for unit testing.
     */
    public do_clone_find_all(settings: ISettings): number {

        this.init_ivars_from_settings(settings);
        if (!this.check_args('clone-find-all')) {
            return 0;
        }
        return this._cf_helper(settings, false);
    }
    //@+node:felix.20221016013001.15: *4* find.clone-find-all-flattened & helper
    // * The interactive_cff methods are not implemented
    // * '@cmd' commands @cmd('clone-find-all-flattened'), etc,  are overriden in the UI client.
    // * do_clone_find_all_flattened is intended to be called directly from the UI client instead.

    // @cmd('clone-find-all-flattened')
    // # @cmd('find-clone-all-flattened')
    // @cmd('cff')
    // def interactive_cff(self, event: Event=None, preloaded: bool=False) -> None:  # pragma: no cover (interactive)
    //     """
    //     clone-find-all-flattened (aka find-clone-all-flattened and cff).

    //     Create an organizer node whose direct children are clones of all nodes
    //     matching the search string, except @nosearch trees.

    //     The list is flattened: every cloned node appears as a direct child
    //     of the organizer node, even if the clone also is a descendant of
    //     another cloned node.
    //     """
    //     w = self.c.frame.body.wrapper
    //     if not w:
    //         return
    //     if not preloaded:
    //         self.preload_find_pattern(w)
    //     self.start_state_machine(event,
    //         prefix='Clone Find All Flattened: ',
    //         handler=self.interactive_cff1)

    // def interactive_cff1(self, event: Event) -> int:  # pragma: no cover (interactive)
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper
    //     # Settings...
    //     pattern = k.arg
    //     self.ftm.set_find_text(pattern)
    //     self.init_vim_search(pattern)
    //     self.init_in_headline()
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     count = self.do_clone_find_all_flattened(settings)
    //     if count:
    //         c.redraw()
    //         c.treeWantsFocus()
    //     return count
    //@+node:felix.20221016013001.16: *5* find.do_clone_find_all_flattened
    /**
     * Do the clone-find-all-flattened command from the settings.
     *
     * Return the count of found nodes.
     *
     * This is a stand-alone method for unit testing.
     */
    public do_clone_find_all_flattened(settings: ISettings): number {

        this.init_ivars_from_settings(settings);
        if (this.check_args('clone-find-all-flattened')) {
            return this._cf_helper(settings, true);
        }
        return 0;

    }
    //@+node:felix.20221016013001.17: *4* find.clone-find-tag & helper
    // * The interactive_clone_find_tag methods are not implemented
    // * '@cmd' commands @cmd('clone-find-tag'), etc,  are overriden in the UI client.
    // * do_clone_find_tag is intended to be called directly from the UI client instead.

    // @cmd('clone-find-tag')
    // @cmd('find-clone-tag')
    // @cmd('cft')
    // def interactive_clone_find_tag(self, event: Event=None) -> None:  # pragma: no cover (interactive)
    //     """
    //     clone-find-tag (aka find-clone-tag and cft).

    //     Create an organizer node whose descendants contain clones of all
    //     nodes matching the given tag, except @nosearch trees.

    //     The list is *always* flattened: every cloned node appears as a
    //     direct child of the organizer node, even if the clone also is a
    //     descendant of another cloned node.
    //     """
    //     w = self.c.frame.body.wrapper
    //     if w:
    //         self.start_state_machine(event,
    //             prefix='Clone Find Tag: ',
    //             handler=self.interactive_clone_find_tag1)

    // def interactive_clone_find_tag1(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     c, k = self.c, self.k
    //     # Settings...
    //     self.find_text = tag = k.arg
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     self.do_clone_find_tag(tag)
    //     c.treeWantsFocus()
    //@+node:felix.20221016013001.18: *5* find.do_clone_find_tag & helper
    /**
     * Do the clone-all-find commands from settings.
     * Return (len(clones), found) for unit tests.
     */
    public do_clone_find_tag(tag: string): [number, Position] {

        const c = this.c;
        const u = this.c.undoer;
        const tc = c.theTagController;
        if (!tc) {
            if (!g.unitTesting) {
                g.es_print('nodetags not active');
            }
            return [0, c.p];
        }

        const clones = tc.get_tagged_nodes(tag);
        if (!clones || !clones.length) {
            if (!g.unitTesting) {
                g.es_print(`tag not found: ${tag}`);
            }
            tc.show_all_tags();
            return [0, c.p];
        }

        const undoData = u.beforeInsertNode(c.p);
        const found: Position = this._create_clone_tag_nodes(clones);
        u.afterInsertNode(found, 'Clone Find Tag', undoData);
        console.assert(c.positionExists(found, undefined, true), found.h);
        c.setChanged();
        c.selectPosition(found);
        // c.redraw()
        return [clones.length, found];
    }
    //@+node:felix.20221016013001.19: *6* find._create_clone_tag_nodes
    /**
     * Create a "Found Tag" node as the last node of the outline.
     * Clone all positions in the clones set as children of found.
     */
    private _create_clone_tag_nodes(clones: Position[]): Position {

        const c = this.c;
        const p = this.c;
        // Create the found node.;
        console.assert(c.positionExists(c.lastTopLevel()), c.lastTopLevel().toString());
        const found = c.lastTopLevel().insertAfter();
        console.assert(found && found.__bool__());
        console.assert(c.positionExists(found), found.toString());
        found.h = `Found Tag: ${this.find_text}`;
        // Clone nodes as children of the found node.
        for (let p of clones) {
            // Create the clone directly as a child of found.
            const p2 = p.copy();
            const n = found.numberOfChildren();
            p2._linkCopiedAsNthChild(found, n);
        }
        return found;
    }
    //@+node:felix.20221016013001.20: *4* find.find-all & helper
    // * The interactive_find_all methods are not implemented
    // * '@cmd' commands @cmd('find-all'), etc,  are overriden in the UI client.
    // * do_find_all is intended to be called directly from the UI client instead.

    // @cmd('find-all')
    // def interactive_find_all(self, event: Event=None) -> None:  # pragma: no cover (interactive)
    //     """
    //     Create a summary node containing descriptions of all matches of the
    //     search string.

    //     Typing tab converts this to the change-all command.
    //     """
    //     self.ftm.clear_focus()
    //     self.ftm.set_entry_focus()
    //     self.start_state_machine(event, 'Search: ',
    //         handler=self.interactive_find_all1,
    //         escape_handler=self.find_all_escape_handler,
    //     )

    // def interactive_find_all1(self, event: Event=None) -> None:  # pragma: no cover (interactive)
    //     k = self.k
    //     # Settings.
    //     find_pattern = k.arg
    //     self.ftm.set_find_text(find_pattern)
    //     settings = self.ftm.get_settings()
    //     self.find_text = find_pattern
    //     self.change_text = self.ftm.get_change_text()
    //     self.update_find_list(find_pattern)
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     self.do_find_all(settings)

    // def find_all_escape_handler(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     k = self.k
    //     prompt = 'Replace ' + ('Regex' if self.pattern_match else 'String')
    //     find_pattern = k.arg
    //     self._sString = k.arg
    //     self.update_find_list(k.arg)
    //     s = f"{prompt}: {find_pattern} With: "
    //     k.setLabelBlue(s)
    //     self.add_change_string_to_label()
    //     k.getNextArg(self.find_all_escape_handler2)

    // def find_all_escape_handler2(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper
    //     find_pattern = self._sString
    //     change_pattern = k.arg
    //     self.update_change_list(change_pattern)
    //     self.ftm.set_find_text(find_pattern)
    //     self.ftm.set_change_text(change_pattern)
    //     self.init_vim_search(find_pattern)
    //     self.init_in_headline()
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     self.do_change_all(settings)
    //@+node:felix.20221016013001.21: *5* find.do_find_all & helpers
    /**
     * Top-level helper for find-all command.
     */
    public do_find_all(settings: ISettings): number {

        const c = this.c;
        let count = 0;
        this.init_ivars_from_settings(settings);
        if (!this.check_args('find-all')) {
            return count;
        }
        // Init data.
        this.init_in_headline();
        const data = this.save();
        this.in_headline = this.search_headline;  // Search headlines first.
        this.unique_matches = []; // set()  // 2021/02/20.
        // Remember the start of the search.
        let p = c.p.copy();
        let after: Position | undefined;
        this.root = p;
        // Set the work widget.
        const s = this.in_headline ? p.h : p.b;
        const ins = this.reverse ? s.length : 0;

        this.work_s = s;
        this.work_sel = [ins, ins, ins];
        if (this.pattern_match) {
            const ok = this.compile_pattern();
            if (!ok) {
                return count;
            }
        }
        if (this.suboutline_only) {
            p = c.p;
            after = p.nodeAfterTree();
        } else {
            // Always search the entire outline.
            p = c.rootPosition()!;
            after = undefined;
        }

        // Fix #292: Never collapse nodes during find-all commands.
        const old_sparse_find = c.sparse_find;
        try {
            c.sparse_find = false;
            count = this._find_all_helper(after, data, p, 'Find All');
            c.contractAllHeadlines();
        }
        catch (e) { }
        finally {
            c.sparse_find = old_sparse_find;
            this.root = undefined;
        }
        if (count) {
            // c.redraw(); // ? NEEDED ?
        }
        g.es("found", count, "matches for", this.find_text);
        return count;

    }
    //@+node:felix.20221016013001.22: *6* find._find_all_helper
    /**
     * Handle the find-all command from p to after.
     */
    public _find_all_helper(
        after: Position | undefined,
        data: any, // TODO : FIX TYPING
        p: Position | undefined,
        undoType: string,
    ): number {

        const c = this.c;
        // log = this.c.frame.log; // ? NEEDED ?
        const u = this.c.undoer;

        /**
         * Put a link to the given line at the given line_number in p.h.
         */
        const put_link = (line: string, line_number: number, p: Position) => {  // #2023

            if (g.unitTesting) {
                return;
            }
            const unl = p.get_UNL();
            if (this.in_headline) {
                line_number = 1;
            }
            // log.put(line.strip() + '\n', nodeLink = `${unl}::${line_number}`);  // Local line.
            g.es(line.trim() + '\n' + `${unl}::${line_number}`);
        };

        const seen: [VNode, number][] = []; // List of (vnode, pos).
        const both = this.search_body && this.search_headline;
        let count = 0;
        let found: Position;
        const result: string[] = [];
        let pos: number | undefined;
        let newpos;
        while (1) {
            [p, pos, newpos] = this.find_next_match(p);
            if (pos === undefined) {
                break;
            }

            //  if ((p.v, pos) in seen){  // 2076
            if (
                seen.reduce((previous, current): boolean => {
                    if (p && current[0] === p.v && current[1] === pos) {
                        return true;
                    }
                    return previous;
                }, false)

            ) {
                continue;  // pragma: no cover
            }
            seen.push([p!.v, pos]);
            count += 1;

            const s: string = this.work_s;
            let i;
            let j;

            [i, j] = g.getLine(s, pos);
            const line = s.substring(i, j);
            let row;
            let col;
            [row, col] = g.convertPythonIndexToRowCol(s, i);
            const line_number = row + 1;
            if (this.findAllUniqueFlag) {
                const m = this.match_obj;
                if (m && m.length) {
                    this.unique_matches.push(m[0].trim());
                    put_link(line, line_number, p!);  // #2023
                }
            } else if (both) {
                result.push(
                    '-'.repeat(20) +
                    p!.h + "\n" +
                    (this.in_headline ? "head: " : "body: ") +
                    line.trimEnd() + '\n\n'
                );
                put_link(line, line_number, p!);  // #2023
            } else if (p!.isVisited()) {
                result.push(line.trimEnd() + '\n');
                put_link(line, line_number, p!);  // #2023
            } else {
                result.push(
                    '-'.repeat(20) +
                    p!.h + "\n" +
                    line.trimEnd() + '\n'
                );
                put_link(line, line_number, p!);  // #2023
                p!.setVisited();
            }
        }

        if (result || this.unique_matches) {
            const undoData = u.beforeInsertNode(c.p);
            if (this.findAllUniqueFlag) {
                found = this._create_find_unique_node();
                count = this.unique_matches.length;
            } else {
                found = this._create_find_all_node(result);
            }
            u.afterInsertNode(found, undoType, undoData);
            c.selectPosition(found);
            c.setChanged();
        } else {
            this.restore(data);
        }

        return count;

    }
    //@+node:felix.20221016013001.23: *6* find._create_find_all_node
    /**
     * Create a "Found All" node as the last node of the outline.
     */
    public _create_find_all_node(result: string[]): Position {

        const c = this.c;
        const found = c.lastTopLevel().insertAfter();
        console.assert(found && found.__bool__());
        found.h = `Found All:${this.find_text}`;
        let status: string = this.compute_result_status(true);
        status = status.trim();
        // .lstrip('(')
        // .rstrip(')')
        status = status.replace(/^\("+|\)+$/g, '');
        status = status.trim();

        found.b = `# ${status}\n${result.join('')}`;
        return found;

    }
    //@+node:felix.20221016013001.24: *6* find._create_find_unique_node
    /**
     * Create a "Found Unique" node as the last node of the outline.
     */
    public _create_find_unique_node(): Position {

        const c = this.c;
        const found = c.lastTopLevel().insertAfter();
        console.assert(found && found.__bool__());

        found.h = `Found Unique Regex:${this.find_text}`;
        const result = this.unique_matches.sort();
        found.b = result.join('\n');
        return found;
    }
    //@+node:felix.20221016013001.25: *4* find.find-all-unique-regex
    // * The interactive_find_all_unique_regex methods are not implemented
    // * '@cmd' commands @cmd('find-all-unique-regex'), etc,  are overriden in the UI client.
    // * do_find_all and do_change_all are intended to be called directly from the UI client instead.


    // @cmd('find-all-unique-regex')
    // def interactive_find_all_unique_regex(self, event: Event=None) -> None:  # pragma: no cover (interactive)
    //     """
    //     Create a summary node containing all unique matches of the regex search
    //     string. This command shows only the matched string itself.
    //     """
    //     self.ftm.clear_focus()
    //     self.match_obj = None
    //     self.changeAllFlag = False
    //     self.findAllUniqueFlag = True
    //     self.ftm.set_entry_focus()
    //     self.start_state_machine(event,
    //         prefix='Search Unique Regex: ',
    //         handler=self.interactive_find_all_unique_regex1,
    //         escape_handler=self.interactive_change_all_unique_regex1,
    //     )

    // def interactive_find_all_unique_regex1(self, event: Event=None) -> int:  # pragma: no cover (interactive)
    //     k = self.k
    //     # Settings...
    //     find_pattern = k.arg
    //     self.update_find_list(find_pattern)
    //     self.ftm.set_find_text(find_pattern)
    //     self.init_in_headline()
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     return self.do_find_all(settings)

    // def interactive_change_all_unique_regex1(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     k = self.k
    //     find_pattern = self._sString = k.arg
    //     self.update_find_list(k.arg)
    //     s = f"'Replace All Unique Regex': {find_pattern} With: "
    //     k.setLabelBlue(s)
    //     self.add_change_string_to_label()
    //     k.getNextArg(self.interactive_change_all_unique_regex2)

    // def interactive_change_all_unique_regex2(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper
    //     find_pattern = self._sString
    //     change_pattern = k.arg
    //     self.update_change_list(change_pattern)
    //     self.ftm.set_find_text(find_pattern)
    //     self.ftm.set_change_text(change_pattern)
    //     self.init_vim_search(find_pattern)
    //     self.init_in_headline()
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     self.do_change_all(settings)
    //@+node:felix.20221016013001.26: *4* find.re-search
    // @cmd('re-search')
    // @cmd('re-search-forward')
    // def interactive_re_search_forward(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     """Same as start-find, with regex."""
    //     # Set flag for show_find_options.
    //     self.pattern_match = True
    //     self.show_find_options()
    //     # Set flag for do_find_next().
    //     self.request_pattern_match = True
    //     # Go.
    //     self.start_state_machine(event,
    //         prefix='Regexp Search: ',
    //         handler=self.start_search1,  # See start-search
    //         escape_handler=self.start_search_escape1,  # See start-search
    //     )
    //@+node:felix.20221016013001.27: *4* find.re-search-backward
    // @cmd('re-search-backward')
    // def interactive_re_search_backward(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     """Same as start-find, but with regex and in reverse."""
    //     # Set flags for show_find_options.
    //     self.reverse = True
    //     self.pattern_match = True
    //     self.show_find_options()
    //     # Set flags for do_find_next().
    //     self.request_reverse = True
    //     self.request_pattern_match = True
    //     # Go.
    //     self.start_state_machine(event,
    //         prefix='Regexp Search Backward:',
    //         handler=self.start_search1,  # See start-search
    //         escape_handler=self.start_search_escape1,  # See start-search
    //     )

    //@+node:felix.20221016013001.28: *4* find.search_backward
    // @cmd('search-backward')
    // def interactive_search_backward(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     """Same as start-find, but in reverse."""
    //     # Set flag for show_find_options.
    //     self.reverse = True
    //     self.show_find_options()
    //     # Set flag for do_find_next().
    //     self.request_reverse = True
    //     # Go.
    //     self.start_state_machine(event,
    //         prefix='Search Backward: ',
    //         handler=self.start_search1,  # See start-search
    //         escape_handler=self.start_search_escape1,  # See start-search
    //     )
    //@+node:felix.20221016013001.29: *4* find.start-search (Ctrl-F) & common states
    // @cmd('start-search')
    // @cmd('search-forward')  # Compatibility.
    // def start_search(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     """
    //     The default binding of Ctrl-F.

    //     Also contains default state-machine entries for find/change commands.
    //     """
    //     w = self.c.frame.body.wrapper
    //     if not w:
    //         return
    //     self.preload_find_pattern(w)
    //     # #1840: headline-only one-shot
    //     #        Do this first, so the user can override.
    //     self.ftm.set_body_and_headline_checkbox()
    //     if self.minibuffer_mode:
    //         # Set up the state machine.
    //         self.ftm.clear_focus()
    //         self.changeAllFlag = False
    //         self.findAllUniqueFlag = False
    //         self.ftm.set_entry_focus()
    //         self.start_state_machine(event,
    //             prefix='Search: ',
    //             handler=self.start_search1,
    //             escape_handler=self.start_search_escape1,
    //         )
    //     else:
    //         self.open_find_tab(event)
    //         self.ftm.init_focus()
    //         return

    // startSearch = start_search  # Compatibility. Do not delete.
    //@+node:felix.20221016013001.30: *5* find.start_search1
    // def start_search1(self, event: Event=None) -> None:  # pragma: no cover
    //     """Common handler for use by vim commands and other find commands."""
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper
    //     # Settings...
    //     find_pattern = k.arg
    //     self.ftm.set_find_text(find_pattern)
    //     self.update_find_list(find_pattern)
    //     self.init_vim_search(find_pattern)
    //     self.init_in_headline()  # Required.
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     # Do the command!
    //     self.do_find_next(settings)  # Handles reverse.
    //@+node:felix.20221016013001.31: *5* find._start_search_escape1
    // def start_search_escape1(self, event: Event=None) -> None:  # pragma: no cover
    //     """
    //     Common escape handler for use by find commands.

    //     Prompt for a change pattern.
    //     """
    //     k = self.k
    //     self._sString = find_pattern = k.arg
    //     # Settings.
    //     k.getArgEscapeFlag = False
    //     self.ftm.set_find_text(find_pattern)
    //     self.update_find_list(find_pattern)
    //     self.find_text = find_pattern
    //     self.change_text = self.ftm.get_change_text()
    //     # Gui...
    //     regex = ' Regex' if self.pattern_match else ''
    //     backward = ' Backward' if self.reverse else ''
    //     prompt = f"Replace{regex}{backward}: {find_pattern} With: "
    //     k.setLabelBlue(prompt)
    //     self.add_change_string_to_label()
    //     k.getNextArg(self._start_search_escape2)

    //@+node:felix.20221016013001.32: *5* find._start_search_escape2
    // def _start_search_escape2(self, event: Event) -> None:  # pragma: no cover
    //     c, k, w = self.c, self.k, self.c.frame.body.wrapper
    //     # Compute settings...
    //     find_pattern = self._sString
    //     change_pattern = k.arg
    //     self.ftm.set_find_text(find_pattern)
    //     self.ftm.set_change_text(change_pattern)
    //     self.update_change_list(change_pattern)
    //     self.init_vim_search(find_pattern)
    //     self.init_in_headline()  # Required
    //     settings = self.ftm.get_settings()
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     c.widgetWantsFocusNow(w)
    //     self.do_find_next(settings)
    //@+node:felix.20221016013001.33: *4* find.tag-children & helper
    // * The interactive_tag_children methods are not implemented
    // * '@cmd' commands @cmd('tag-children'), etc,  are overriden in the UI client.
    // * do_tag_children is intended to be called directly from the UI client instead.

    // @cmd('tag-children')
    // def interactive_tag_children(self, event: Event=None) -> None:  # pragma: no cover (interactive)
    //     """tag-children: prompt for a tag and add it to all children of c.p."""
    //     w = self.c.frame.body.wrapper
    //     if not w:
    //         return
    //     self.start_state_machine(event,
    //         prefix='Tag Children: ',
    //         handler=self.interactive_tag_children1)

    // def interactive_tag_children1(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     c, k, p = self.c, self.k, self.c.p
    //     # Settings...
    //     tag = k.arg
    //     # Gui...
    //     k.clearState()
    //     k.resetLabel()
    //     k.showStateAndMode()
    //     self.do_tag_children(p, tag)
    //     c.treeWantsFocus()
    //@+node:felix.20221016013001.34: *5* find.do_tag_children
    /**
     * Handle the tag-children command.
     */
    public do_tag_children(p: Position, tag: string): void {

        const c = this.c;

        const tc = c.theTagController;
        if (!tc) {
            if (!g.unitTesting) {
                g.es_print('nodetags not active');
            }
            return;
        }

        let count = 0;
        for (let p_p of p.children()) {
            tc.add_tag(p_p, tag);
            count += 1;
        }
        if (count && !g.unitTesting) {
            g.es_print(`Added ${tag} tag to ${count} nodes`);
        }
    }
    //@+node:felix.20221020230510.1: *4* find.word-search
    // @cmd('word-search')
    // @cmd('word-search-forward')
    // def word_search_forward(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     """Same as start-search, with whole_word setting."""
    //     # Set flag for show_find_options.
    //     self.whole_word = True
    //     self.show_find_options()
    //     # Set flag for do_find_next().
    //     self.request_whole_world = True
    //     # Go.
    //     self.start_state_machine(event,
    //         prefix='Word Search: ',
    //         handler=self.start_search1,  # See start-search
    //         escape_handler=self.start_search_escape1,  # See start-search
    //     )
    //@+node:felix.20221016013001.36: *4* find.word-search-backward
    // @cmd('word-search-backward')
    // def word_search_backward(self, event: Event) -> None:  # pragma: no cover (interactive)
    //     # Set flags for show_find_options.
    //     self.reverse = True
    //     self.whole_world = True
    //     self.show_find_options()
    //     # Set flags for do_find_next().
    //     self.request_reverse = True
    //     self.request_whole_world = True
    //     # Go
    //     self.start_state_machine(event,
    //         prefix='Word Search Backward: ',
    //         handler=self.start_search1,  # See start-search
    //         escape_handler=self.start_search_escape1,  # See start-search
    //     )
    //@+node:felix.20221020232631.1: *3* LeoFind.Commands: helpers
    //@+node:felix.20221020232631.2: *4* find._cf_helper & helpers
    /**
     * The common part of the clone-find commands.
     *
     * Return the number of found nodes.
     */
    public _cf_helper(settings: ISettings, flatten: boolean): number {

        const c = this.c;
        const u = this.c.undoer;

        if (this.pattern_match) {
            const ok = this.compile_pattern();
            if (!ok) {
                return 0;
            }
        }
        let after: Position | undefined;
        let p: Position;
        if (this.suboutline_only) {
            p = c.p;
            after = p.nodeAfterTree();
        } else {
            p = c.rootPosition()!;
            after = undefined;
        }
        let count = 0;
        let found: Position | undefined;
        const clones: Position[] = [];
        const skip: VNode[] = [];

        while (p && !p.__eq__(after)) {
            const progress = p.copy();
            if (g.inAtNosearch(p)) {
                p.moveToNodeAfterTree();
            }
            else if (skip.includes(p.v)) {
                p.moveToThreadNext();
            } else if (this._cfa_find_next_match(p)) {
                count += 1;
                if (flatten) {
                    if (!skip.includes(p.v)) {
                        skip.push(p.v); // as a set
                    }
                    clones.push(p.copy());
                    p.moveToThreadNext();
                } else {
                    if (
                        // p not in clones
                        clones.reduce((previous, current): boolean => {
                            if (p.__eq__(current)) {
                                return false; //is in it! 
                            }
                            return previous;
                        }, true)
                    ) {
                        clones.push(p.copy()); // push if not already in.
                    }
                    // Don't look at the node or it's descendants.
                    for (let p2 of p.self_and_subtree(false)) {
                        if (!skip.includes(p2.v)) {
                            skip.push(p2.v); // as a set
                        }
                    }
                    p.moveToNodeAfterTree();

                }
            } else {
                p.moveToThreadNext();
            }

            console.assert(!p.__eq__(progress));
        }

        this.ftm.set_radio_button('entire-outline');
        // suboutline-only is a one-shot for batch commands.
        this.suboutline_only = false;
        this.node_only = false;
        this.root = undefined;

        if (clones.length) {
            const undoData = u.beforeInsertNode(c.p);
            found = this._cfa_create_nodes(clones, false);
            u.afterInsertNode(found, 'Clone Find All', undoData);
            console.assert(c.positionExists(found, undefined, true), found.toString());
            c.setChanged();
            c.selectPosition(found);
            // Put the count in found.h.
            found.h = found.h.replace('Found:', `Found ${count}:`);
        }
        g.es(`found ${count}, matches for ${this.find_text}`);
        return count;  // Might be useful for the gui update.

    }
    //@+node:felix.20221020232631.3: *5* find._cfa_create_nodes
    /**
     * Create a "Found" node as the last node of the outline.
     * Clone all positions in the clones set a children of found.
     */
    public _cfa_create_nodes(clones: Position[], flattened: boolean): Position {

        const c = this.c;
        // Create the found node.
        console.assert(c.positionExists(c.lastTopLevel()), c.lastTopLevel().toString());
        const found: Position = c.lastTopLevel().insertAfter();
        console.assert(found);
        console.assert(c.positionExists(found), found.toString());
        found.h = `Found:${this.find_text}`;
        let status = this.compute_result_status(true);

        status = status.trim();
        // .lstrip('(')
        // .rstrip(')')
        status = status.replace(/^\("+|\)+$/g, '');
        status = status.trim();

        const flat = flattened ? 'flattened, ' : '';
        found.b = `@nosearch\n\n# ${flat}${status}\n\n# found ${clones.length} nodes`;
        // Clone nodes as children of the found node.
        for (let p of clones) {
            // Create the clone directly as a child of found.
            const p2 = p.copy();
            const n = found.numberOfChildren();
            p2._linkCopiedAsNthChild(found, n);
        }

        // Sort the clones in place, without undo.
        found.v.children.sort((a, b) => {
            // v.h.lower()
            if (a.h.toLowerCase() < b.h.toLowerCase()) {
                return -1;
            }
            if (a.h.toLowerCase() > b.h.toLowerCase()) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        return found;
    }
    //@+node:felix.20221020232631.4: *5* find._cfa_find_next_match (for unit tests)
    /**
     * Find the next batch match at p.
     */
    public _cfa_find_next_match(p: Position): boolean {

        // Called only from unit tests.
        const table = [];
        if (this.search_headline) {
            table.push(p.h);
        }
        if (this.search_body) {
            table.push(p.b);
        }
        for (let s of table) {
            this.reverse = false;
            let pos: number;
            let newpos: number;
            [pos, newpos] = this.inner_search_helper(s, 0, s.length, this.find_text);
            if (pos !== -1) {
                return true;
            }
        }
        return false;

    }
    //@+node:felix.20221020232631.5: *4* find.change_selection
    /**
     * Replace selection with this.change_text.
     */
    public change_selection(p: Position): boolean {

        const c = this.c;
        const u = this.c.undoer;
        const wrapper = c.frame.body && c.frame.body.wrapper;
        let gui_w = this.in_headline ? c.edit_widget(p) : wrapper;
        if (!gui_w) {
            this.in_headline = false;
            gui_w = wrapper;
        }
        if (!gui_w) {
            return false;
        }
        const sel: [number, number] = gui_w.getSelectionRange();
        const oldSel: [number, number] = sel;
        let start;
        let end;
        [start, end] = sel;
        if (start > end) {
            [start, end] = [end, start];
        }
        if (start === end) {
            g.es("no text selected");
            return false;
        }
        const bunch = u.beforeChangeBody(p);
        [start, end] = oldSel;
        let change_text = this.change_text;
        // Perform regex substitutions of \1, \2, ...\9 in the change text.
        if (this.pattern_match && this.match_obj) {
            const groups = this.match_obj;
            if (groups && groups.length) {
                change_text = this.make_regex_subs(change_text, this.match_obj); // ! send m array result instead of groups !
            }
        }
        change_text = this.replace_back_slashes(change_text);
        // Update both the gui widget and the work "widget"
        const new_ins = this.reverse ? start : start + change_text.length;
        if (start !== end) {
            gui_w.delete(start, end);
        }
        gui_w.insert(start, change_text);
        gui_w.setInsertPoint(new_ins);
        this.work_s = gui_w.getAllText();  // #2220.
        this.work_sel = [new_ins, new_ins, new_ins];
        // Update the selection for the next match.
        gui_w.setSelectionRange(start, start + change_text.length);
        c.widgetWantsFocus(gui_w);
        // No redraws here: they would destroy the headline selection.
        if (this.mark_changes) {
            p.setMarked();
            p.setDirty();
        }
        if (this.in_headline) {
            // #2220: Let onHeadChanged handle undo, etc.
            c.frame.tree.onHeadChanged(p, 'Change Headline'); // TODO: Replace with normal undo
            // gui_w will change after a redraw.
            gui_w = c.edit_widget(p);
            if (gui_w) {
                // find-next and find-prev work regardless of insert point.
                gui_w.setSelectionRange(start, start + change_text.length);
            }
        } else {
            p.v.b = gui_w.getAllText();
            u.afterChangeBody(p, 'Change Body', bunch);
        }

        return true;

    }
    //@+node:felix.20221020232631.6: *4* find.check_args
    /**
     * Check the user arguments to a command.
     */
    public check_args(tag: string): boolean {

        if (!this.search_headline && !this.search_body) {
            if (!g.unitTesting) {
                g.es_print("not searching headline or body");
            }
            return false;
        }

        if (!this.find_text) {
            if (!g.unitTesting) {
                g.es_print(`${tag}: empty find pattern`);
            }
            return false;
        }
        return true;

    }
    //@+node:felix.20221023141615.1: *4* find.compile_pattern
    /**
     * Precompile the regexp pattern if necessary.
     */
    public compile_pattern(): boolean {
        let flags: string;
        try { // Precompile the regexp.

            flags = "m"; // re.MULTILINE
            if (this.ignore_case) {
                flags = flags + "i"; //|= re.IGNORECASE 
            } // pragma: no cover
            // Escape the search text.
            // Ignore the whole_word option.
            const s = this.find_text;
            // A bad idea: insert \b automatically.
            // b, s = '\\b', this.find_text
            // if this.whole_word:
            // if not s.startswith(b): s = b + s
            // if not s.endswith(b): s = s + b
            this.re_obj = new RegExp(s, flags); // re.compile(s, flags)
            return true;
        }
        catch (e) {
            if (!g.unitTesting) {
                g.warning('invalid regular expression:', this.find_text);
            }
            return false;
        }
    }

    //@+node:felix.20221020232631.8: *4* find.find_next_match & helpers
    /**
     * Resume the search where it left off.
     *
     * Return (p, pos, newpos).
     */
    public find_next_match(p: Position | undefined): [Position | undefined, number | undefined, number | undefined] {

        if (!this.search_headline && !this.search_body) {
            return [undefined, undefined, undefined];
        }
        if (!this.find_text) {
            return [undefined, undefined, undefined];
        }
        let attempts = 0;
        let ok;
        let pos;
        let newpos;
        if (this.pattern_match) {
            ok = this.compile_pattern();
            if (!ok) {
                return [undefined, undefined, undefined];
            }
        }
        while (p && p.__bool__()) {
            [pos, newpos] = this._fnm_search(p);
            if (pos !== undefined) {
                // Success.
                if (this.mark_finds) {
                    p.setMarked();
                    p.setDirty();
                }
                return [p, pos, newpos!];
            }
            let s: string;
            let ins: number;
            // Searching the pane failed: switch to another pane or node.
            if (this._fnm_should_stay_in_node(p)) {
                // Switching panes is possible.  Do so.
                this.in_headline = !this.in_headline;
                s = this.in_headline ? p.h : p.b;
                ins = this.reverse ? s.length : 0;
                this.work_s = s;
                this.work_sel = [ins, ins, ins];
            } else {
                // Switch to the next/prev node, if possible.
                attempts += 1;
                p = this._fnm_next_after_fail(p);
                if (p && p.__bool__()) { // Found another node: select the proper pane.
                    this.in_headline = this._fnm_first_search_pane();
                    s = this.in_headline ? p.h : p.b;
                    ins = this.reverse ? s.length : 0;
                    this.work_s = s;
                    this.work_sel = [ins, ins, ins];
                }
            }

        }
        return [undefined, undefined, undefined];

    }
    //@+node:felix.20221020232631.9: *5* find._fnm_next_after_fail & helper
    /**
     * Return the next node after a failed search or undefined.
     */
    public _fnm_next_after_fail(p: Position): Position | undefined {

        // Move to the next position.
        p = this.reverse ? p.threadBack() : p.threadNext();
        // Check it.
        if (p && p.__bool__() && this._fail_outside_range(p)) {
            return undefined;
        }
        if (!p || !p.__bool__()) {
            return undefined;
        }
        return p;

    }
    //@+node:felix.20221020232631.10: *6* find._fail_outside_range
    /**
     * Return true; if the search is about to go outside its range, assuming
     * both the headline and body text of the present node have been searched.
     */
    public _fail_outside_range(p: Position): boolean {

        const c = this.c;
        if (!p || p.__bool__()) {
            return true;
        }
        if (this.node_only) {
            return true;
        }
        if (this.suboutline_only || this.file_only) {
            if (this.root && !p.__eq__(this.root) && !this.root.isAncestorOf(p)) {
                return true;
            }
        }
        if (c.hoistStack && c.hoistStack.length) {
            const bunch = c.hoistStack[c.hoistStack.length - 1];
            if (!bunch.p.isAncestorOf(p)) {
                g.trace('outside hoist', p.h);
                g.warning('found match outside of hoisted outline');
                return true;
            }
        }
        return false;  // Within range.

    }
    //@+node:felix.20221020232631.11: *5* find._fnm_first_search_pane
    /**
     * Set return the value of this.in_headline
     * indicating which pane to search first.
     */
    public _fnm_first_search_pane(): boolean {

        if (this.search_headline && this.search_body) {
            // Fix bug 1228458: Inconsistency between Find-forward and Find-backward.
            if (this.reverse) {
                return false;  // Search the body pane first.
            }
            return true;  // Search the headline pane first.
        }

        if (this.search_headline || this.search_body) {
            // Search the only enabled pane.
            return this.search_headline;
        }

        g.trace('can not happen: no search enabled');
        return false;

    }
    //@+node:felix.20221020232631.12: *5* find._fnm_search
    /**
     * Search this.work_s for this.find_text with present options.
     * Returns (pos, newpos) or (undefined, dundefined).
     */
    public _fnm_search(p: Position): [number, number] | [undefined, undefined] {

        let index = this.work_sel[2];
        let s = this.work_s;

        // This hack would be dangerous on MacOs: it uses '\r' instead of '\n' (!)
        if (g.isWindows) {
            // Ignore '\r' characters, which may appear in @edit nodes.
            // Fixes this bug: https://groups.google.com/forum/#!topic/leo-editor/yR8eL5cZpi4
            s = s.replace(/\r/g, '');
        }
        if (!s) {
            return [undefined, undefined];
        }
        const stopindex = this.reverse ? 0 : s.length;

        let pos;
        let newpos;
        [pos, newpos] = this.inner_search_helper(s, index, stopindex, this.find_text);

        if (this.in_headline && !this.search_headline) {
            return [undefined, undefined];
        }
        if (!this.in_headline && !this.search_body) {
            return [undefined, undefined];
        }
        if (pos === -1) {
            return [undefined, undefined];
        }

        const ins = this.reverse ? Math.min(pos, newpos) : Math.max(pos, newpos);
        this.work_sel = [pos, newpos, ins];

        return [pos, newpos];

    }
    //@+node:felix.20221020232631.13: *5* find._fnm_should_stay_in_node
    /**
     * Return True if the find should simply switch panes.
     */
    public _fnm_should_stay_in_node(p: Position): boolean {

        // Errors here cause the find command to fail badly.
        // Switch only if:
        //   a) searching both panes and,
        //   b) this is the first pane of the pair.
        // There is * no way * this can ever change.
        // So simple in retrospect, so difficult to see.
        return (
            this.search_headline && this.search_body &&
            (
                (this.reverse && !this.in_headline) ||
                (!this.reverse && this.in_headline)
            )
        );

    }
    //@+node:felix.20221023141654.1: *4* find.inner_search_helper & helpers
    /**
     * Dispatch the proper search method based on settings.
     */
    public inner_search_helper(s: string, i: number, j: number, pattern: string): [number, number] {

        const backwards = this.reverse;
        const nocase = this.ignore_case;
        const regexp = this.pattern_match;
        const word = this.whole_word;

        if (backwards) {
            [i, j] = [j, i];
        }
        if (!s.substring(i, j) || !pattern) {
            return [-1, -1];
        }

        let pos;
        let newpos;

        if (regexp) {
            [pos, newpos] = this._inner_search_regex(s, i, j, pattern, backwards, nocase);
        } else if (backwards) {
            [pos, newpos] = this._inner_search_backward(s, i, j, pattern, nocase, word);
        } else {
            [pos, newpos] = this._inner_search_plain(s, i, j, pattern, nocase, word);
        }
        return [pos, newpos];

    }
    //@+node:felix.20221023184334.1: *5* find._rfind
    private _rfind(s: string, pattern: string, start: number, end: number): number {
        const w_s = s.substring(start); // will start just past i
        let result = w_s.lastIndexOf(pattern, end - start);
        if (result >= 0) {
            result = result + start;
        }
        return result;
    }

    // to test in interpreter
    // function _rfind(s, pattern, start, end) {
    //     var w_s = s.substring(start);
    //     var result = w_s.lastIndexOf(pattern, end-start);
    //     if(result>=0){
    //         result = result + start;
    //     }
    //     return result
    // }

    //@+node:felix.20221023141654.2: *5* find._inner_search_backward
    /**
     * rfind(sub [,start [,end]])
     *
     * Return the highest index in the string where substring sub is found,
     * such that sub is contained within s[start,end].
     *
     * Optional arguments start and end are interpreted as in slice notation.
     *
     * Return (-1, -1) on failure.
     */
    public _inner_search_backward(
        s: string,
        i: number,
        j: number,
        pattern: string,
        nocase: boolean,
        word: boolean
    ): [number, number] {

        if (nocase) {
            s = s.toLowerCase();
            pattern = pattern.toLowerCase();
        }
        pattern = this.replace_back_slashes(pattern);
        const n = pattern.length;
        // Put the indices in range.  Indices can get out of range
        // because the search code strips '\r' characters when searching @edit nodes.
        i = Math.max(0, i);
        j = Math.min(s.length, j);
        // short circuit the search: helps debugging.
        if (s.indexOf(pattern) === -1) {
            return [-1, -1];
        }
        let k: number;
        if (word) {
            while (1) {

                // k = s.rfind(pattern, i, j)
                k = this._rfind(s, pattern, i, j);

                if (k === -1) {
                    break;
                }
                if (this._inner_search_match_word(s, k, pattern)) {
                    return [k, k + n];
                }
                j = Math.max(0, k - 1);

            }
            return [-1, -1];

        }

        // k = s.rfind(pattern, i, j)
        k = this._rfind(s, pattern, i, j);

        if (k === -1) {
            return [-1, -1];
        }
        return [k, k + n];

    }
    //@+node:felix.20221023141654.3: *5* find._inner_search_match_word
    /**
     * Do a whole-word search.
     */
    private _inner_search_match_word(s: string, i: number, pattern: string): boolean {

        pattern = this.replace_back_slashes(pattern);
        if (!s || !pattern || !g.match(s, i, pattern)) {
            return false;
        }

        let pat1;
        let pat2;
        [pat1, pat2] = [pattern[0], pattern[pattern.length - 1]];
        const n = pattern.length;
        const ch1 = (0 <= (i - 1) && (i - 1) < s.length) ? s[i - 1] : '.';
        const ch2 = (0 <= (i + n) && (i + n) < s.length) ? s[i + n] : '.';
        const isWordPat1 = g.isWordChar(pat1);
        const isWordPat2 = g.isWordChar(pat2);
        const isWordCh1 = g.isWordChar(ch1);
        const isWordCh2 = g.isWordChar(ch2);
        const inWord = isWordPat1 && isWordCh1 || isWordPat2 && isWordCh2;

        return !inWord;

    }
    //@+node:felix.20221023141654.4: *5* find._inner_search_plain
    /**
     * Do a plain search.
     */
    public _inner_search_plain(
        s: string,
        i: number,
        j: number,
        pattern: string,
        nocase: boolean,
        word: boolean
    ): [number, number] {

        if (nocase) {
            s = s.toLowerCase();
            pattern = pattern.toLowerCase();
        }

        pattern = this.replace_back_slashes(pattern);
        const n = pattern.length;
        let k;

        if (word) {
            while (1) {
                k = s.indexOf(pattern, i);
                if (k === -1 || k + pattern.length > j) {
                    break;
                }
                if (this._inner_search_match_word(s, k, pattern)) {
                    return [k, k + n];
                }
                i = k + n;

            }
            return [-1, -1];

        }
        k = s.indexOf(pattern, i);

        if (k === -1 || k + pattern.length > j) {
            return [-1, -1];
        }
        return [k, k + n];

    }
    //@+node:felix.20221023141654.5: *5* find._inner_search_regex
    /**
     * Called from inner_search_helper
     */
    private _inner_search_regex(
        s: string,
        i: number,
        j: number,
        pattern: string,
        backwards: boolean,
        nocase: boolean,
    ): [number, number] {

        // ! TODO !
        // TODO : RE WRITE THIS FOR JAVASCRIPT REGEXP CAPABILITIES! (no start/end params for search!)
        // Modify to consider i and j. 
        // This set the match_obj with the exact match

        const re_obj = this.re_obj;  // Use the pre-compiled object
        if (!re_obj) {
            if (!g.unitTesting) {
                g.trace('can not happen: no re_obj');
            }
            return [-1, -1];
        }

        let last_mo = undefined;
        let mo: RegExpExecArray | null | undefined;

        if (backwards) {
            // Scan to the last match using search here.
            i = 0;
            while (i < s.length) {
                re_obj.lastIndex = i; // start up from i 'start'
                mo = re_obj.exec(s);

                if (!mo || re_obj.lastIndex > j) {
                    // no match or Busted past j 'end'
                    break;
                }
                i += 1;
                last_mo = mo;
            }
            mo = last_mo;
        } else {
            // normal forward search
            re_obj.lastIndex = i; // start up from i 'start'
            mo = re_obj.exec(s);
            if (re_obj.lastIndex > j) {
                // if busted past j 'end'
                mo = undefined;
            }

        }

        if (mo) {
            this.match_obj = mo;
            return [mo.index, mo.index + mo[0].length - 1];
        }

        this.match_obj = undefined;
        return [-1, -1];

    }
    //@+node:felix.20221023141705.1: *4* find.make_regex_subs
    /**
     * Substitute group[i-1] for \\i strings in change_text.
     *
     * Groups is a tuple of strings, one for every matched group.
     */
    public make_regex_subs(change_text: string, groups: RegExpExecArray): string {

        // ! TODO : TEST THIS METHOD !
        // ! see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement

        // ! for python: https://pynative.com/python-regex-capturing-groups/#:~:text=To%20capture%20all%20matches%20to%20a%20regex%20group%20we%20need,object%20and%20extract%20its%20value.

        // g.printObj(list(groups), tag=f"groups in {change_text!r}")

        /**
        * re.sub calls this function once per group.
        */
        const repl = (match: string, p1: string, offset: number): string => {
            // subgroup will be a number matched

            // # 1494...
            // group(0) is the whole match including all groups, group 1 is the first 
            const n = Number(p1) - 1;
            if (0 <= n && n < groups.length) {
                // Executed only if the change text contains groups that match.
                return (
                    groups[n].
                        replace(/\\b/g, '\\\\b').   // b
                        replace(/\\f/g, '\\\\f').   // f 
                        replace(/\\n/g, '\\\\n').   // n
                        replace(/\\r/g, '\\\\r').   // r
                        replace(/\\t/g, '\\\\t').   // t
                        replace(/\\w/g, '\\\\v')    // w
                );
            }
            // No replacement.
            return match; // in python group(0) is the whole match spanning all subgroups
        };

        const result = change_text.replace(/\\([0-9])/, repl);

        return result;

    }
    //@+node:felix.20221023141723.1: *4* find.replace_back_slashes
    /**
     * Carefully replace backslashes in a search pattern.
     */
    public replace_back_slashes(s: string): string {

        // This is NOT the same as:
        //
        //   s.replace('\\n','\n').replace('\\t','\t').replace('\\\\','\\')
        //
        // because there is no rescanning.

        let i = 0;
        while (i + 1 < s.length) {
            if (s[i] === '\\') {
                const ch = s[i + 1];
                if (ch === '\\') {
                    s = s.substring(0, i) + s.substring(i + 1); // replace \\ by \
                } else if (ch === 'n') {
                    s = s.substring(0, i) + '\n' + s.substring(i + 2); // replace the \n by a newline
                } else if (ch === 't') {
                    s = s.substring(0, i) + '\t' + s.substring(i + 2); // replace \t by a tab
                } else {
                    i += 1; // Skip the escaped character.
                }
            }
            i += 1;
        }
        return s;

    }
    //@+node:felix.20221022201759.1: *3* LeoFind.Initing & finalizing
    //@+node:felix.20221022201759.2: *4* find.init_in_headline & helper
    /**
     * Select the first pane to search for incremental searches and changes.
     * This is called only at the start of each search.
     * This must not alter the current insertion point or selection range.
     */
    public init_in_headline(): void {

        // #1228458: Inconsistency between Find-forward and Find-backward.
        if (this.search_headline && this.search_body) {
            // We have no choice: we *must* search the present widget!
            this.in_headline = this.focus_in_tree();
        } else {
            this.in_headline = this.search_headline;
        }
    }
    //@+node:felix.20221022201759.3: *5* find.focus_in_tree
    /**
     * Return True is the focus widget w is anywhere in the tree pane.
     *
     * Note: the focus may be in the find pane.
     */
    public focus_in_tree(): boolean {

        const c = this.c;
        const ftm = this.ftm;
        const w = ftm && ftm.entry_focus; // ! SET BY CLIENT WHEN CALLING FIND COMMANDS  || (g.app.gui as LeoUI).get_focus(true);
        if (ftm) {
            ftm.entry_focus = undefined;  // Only use this focus widget once!
        }
        const w_name = c.widget_name(w);
        let val;
        if (w === c.frame.body.wrapper) {
            val = false;
        } else if (w === c.frame.tree.treeWidget) {
            val = true;
        } else {
            val = w_name.startswith('head');
        }
        return val;

    }
    //@+node:felix.20221022201759.4: *4* find.restore
    /**
     * Restore Leo's gui and settings from data, a g.Bunch.
     */
    public restore(data: IFindUndoData): void {

        const c = this.c;
        const p = data.p;
        // c.frame.bringToFront();  // Needed on the Mac

        if (!p || !p.__bool__() || !c.positionExists(p)) {
            // Better than selecting the root!
            return;
        }
        c.selectPosition(p);
        // Fix bug 1258373: https://bugs.launchpad.net/leo-editor/+bug/1258373
        if (this.in_headline) {
            c.treeWantsFocus();
        } else {
            // Looks good and provides clear indication of failure or termination.
            const w = c.frame.body.wrapper;
            w.setSelectionRange(data.start, data.end, data.insert);
            w.seeInsertPoint();
            c.widgetWantsFocus(w);
        }
    }
    //@+node:felix.20221022201759.5: *4* find.save
    /**
     * Save everything needed to restore after a search fails.
     */
    public save(): IFindUndoData {

        const c = this.c;
        let insert: number | undefined;
        let start: number | undefined;
        let end: number | undefined;

        if (this.in_headline) {
            // Fix bug 1258373: https://bugs.launchpad.net/leo-editor/+bug/1258373
            // Don't try to re-edit the headline.
            [insert, start, end] = [undefined, undefined, undefined];
        } else {
            const w = c.frame.body.wrapper;
            insert = w.getInsertPoint();
            [start, end] = w.getSelectionRange();
        }
        const data: IFindUndoData = {
            end: end,
            in_headline: this.in_headline,
            insert: insert,
            p: c.p.copy(),
            start: start
        };

        return data;
    }
    //@+node:felix.20221022201759.6: *4* find.show_success
    /**
     * Display the result of a successful find operation.
     */
    public show_success(p: Position, pos: number, newpos: number, showState = true): any {

        const c = this.c;
        // Set state vars.
        // Ensure progress in backwards searches.
        const insert = this.reverse ? Math.min(pos, newpos) : Math.max(pos, newpos);
        if (c.sparse_find) {
            c.expandOnlyAncestorsOfNode(p);
        }
        let w;

        // ! NOT USED IN LEOJS !
        // if (this.in_headline) {
        //     c.endEditing();
        //     c.redraw(p);
        //     c.frame.tree.editLabel(p);
        //     w = c.edit_widget(p);  // #2220
        //     if (w) {
        //         w.setSelectionRange(pos, newpos, insert);  // #2220
        //     }
        // } else {
        //     // Tricky code.  Do not change without careful thought.
        //     w = c.frame.body.wrapper;
        //     // *Always* do the full selection logic.
        //     // This ensures that the body text is inited and recolored.
        //     c.selectPosition(p);
        //     c.bodyWantsFocus();
        //     if (showState) {
        //         c.k.showStateAndMode(w);
        //     }
        //     c.bodyWantsFocusNow();
        //     w.setSelectionRange(pos, newpos, insert);
        //     const k = g.see_more_lines(w.getAllText(), insert, 4);
        //     w.see(k);  // #78: find-next match not always scrolled into view.
        //     c.outerUpdate();  // Set the focus immediately.
        //     if (c.vim_mode && c.vimCommands) {
        //         c.vimCommands.update_selection_after_search();
        //     }
        // }
        // // Support for the console gui.
        // if ((g.app.gui as LeoUI).show_find_success) {
        //     (g.app.gui as LeoUI).show_find_success(c, this.in_headline, insert, p);
        // }
        // c.frame.bringToFront();
        return w;  // Support for isearch.
    }
    //@+node:felix.20221022201804.1: *3* LeoFind.Utils
    //@+node:felix.20221022201804.2: *4* find.add_change_string_to_label
    /**
     * Add an unprotected change string to the minibuffer label.
     */
    public add_change_string_to_label(): void {

        const c = this.c;
        let s: string = this.ftm.get_change_text();
        c.minibufferWantsFocus();
        while (s.endsWith('\n') || s.endsWith('\r')) {
            s = s.substring(0, s.length - 1);
        }
        c.k.extendLabel(s, true, false);
    }
    //@+node:felix.20221022201804.3: *4* find.add_find_string_to_label
    public add_find_string_to_label(protect = true): void {

        const c = this.c;
        const k = this.c.k;
        const ftm = c.findCommands.ftm;
        let s = ftm.get_find_text();
        c.minibufferWantsFocus();
        while (s.endsWith('\n') || s.endsWith('\r')) {
            s = s.substring(0, s.length - 1);
        }
        k.extendLabel(s, true, protect);

    }
    //@+node:felix.20221022201804.4: *4* find.compute_result_status
    /**
     * Return the status to be shown in the status line after a find command completes.
     */
    public compute_result_status(find_all_flag = false): string {

        // Too similar to another method...
        const status = [];
        const table: [keyof LeoFind, string][] = [
            ['whole_word', 'Word'],
            ['ignore_case', 'Ignore Case'],
            ['pattern_match', 'Regex'],
            ['suboutline_only', '[Outline Only]'],
            ['node_only', '[Node Only]'],
            ['search_headline', 'Head'],
            ['search_body', 'Body'],
        ];

        for (let [ivar, val] of table) {
            if (this[ivar]) {
                status.push(val);
            }
        }
        return status ? ` (${status.join(', ')})` : '';

    }
    //@+node:felix.20221022201804.5: *4* find.help_for_find_commands
    /**
     * Called from Find panel.  Redirect.
     */
    public help_for_find_commands(): void {
        console.log('TODO : help_for_find_commands');
        // this.c.helpCommands.help_for_find_commands();
    }
    //@+node:felix.20221022201804.6: *4* find.init_vim_search
    /**
     * Initialize searches in vim mode.
     */
    public init_vim_search(pattern: string): void {

        const c = this.c;
        if (c.vim_mode && c.vimCommands) {
            c.vimCommands.update_dot_before_search(
                pattern,
                undefined);  // A flag.
        }
    }
    //@+node:felix.20221022201804.7: *4* find.preload_find_pattern
    /**
     * Preload the find pattern from the selected text of widget w.
     */
    public preload_find_pattern(w: any): void {

        const c = this.c;
        const ftm = this.ftm;
        if (!c.config.getBool('preload-find-pattern', false)) {
            // Make *sure* we don't preload the find pattern if it is not wanted.
            return;
        }
        if (!w) {
            return;
        }
        //
        // #1436: Don't create a selection if there isn't one.
        //        Leave the search pattern alone!
        //
        // if not w.hasSelection():
        //     c.editCommands.extendToWord(event=None, select=True, w=w)
        //
        // #177:  Use selected text as the find string.
        // #1436: Make make sure there is a significant search pattern.
        const s = w.getSelectedText();
        if (s.trim()) {
            ftm.set_find_text(s);
            ftm.init_focus();
        }
    }
    //@+node:felix.20221022201804.8: *4* find.show_status
    /**
     * Show the find status the Find dialog, if present, and the status line.
     */
    public show_status(found: boolean): void {

        const c = this.c;
        const status = found ? 'found' : 'not found';
        const options = this.compute_result_status();
        const s = `${status}:${options} ${this.find_text}`;
        // Set colors.
        const found_bg = c.config.getColor('find-found-bg') || 'blue';
        const not_found_bg = c.config.getColor('find-not-found-bg') || 'red';
        const found_fg = c.config.getColor('find-found-fg') || 'white';
        const not_found_fg = c.config.getColor('find-not-found-fg') || 'white';
        const bg = found ? found_bg : not_found_bg;
        const fg = found ? found_fg : not_found_fg;
        if (c.config.getBool("show-find-result-in-status") !== false) {
            c.frame.putStatusLine(s, bg, fg);
        }
    }
    //@+node:felix.20221022201804.9: *4* find.show_find_options_in_status_area & helper
    /**
     * Show find options in the status area.
     */
    public show_find_options_in_status_area(): void {

        const c = this.c;
        const s = this.compute_find_options_in_status_area();
        c.frame.putStatusLine(s);

    }
    //@+node:felix.20221022201804.10: *5* find.compute_find_options_in_status_area
    public compute_find_options_in_status_area(): string {

        // TODO : REDO WITH APPROPRIATE GETTERS FROM VSCODE/LEOJS
        const c = this.c;
        const ftm = c.findCommands.ftm;
        const table = [
            ['Word', ftm.check_box_whole_word],
            ['Ig-case', ftm.check_box_ignore_case],
            ['regeXp', ftm.check_box_regexp],
            ['Body', ftm.check_box_search_body],
            ['Head', ftm.check_box_search_headline],
            // ['wrap-Around', ftm.check_box_wrap_around],
            ['mark-Changes', ftm.check_box_mark_changes],
            ['mark-Finds', ftm.check_box_mark_finds],
        ];

        // const result = [option for option, ivar in table if ivar.isChecked()]
        const result = table.filter((p_entry) => {
            return p_entry[1].isChecked();
        }).map((p_entry) => {
            return p_entry[0];
        });

        const table2 = [
            ['Suboutline', ftm.radio_button_suboutline_only],
            ['Node', ftm.radio_button_node_only],
            ['File', ftm.radio_button_file_only],
        ];
        for (let [option, ivar] of table2) {
            if (ivar.isChecked()) {
                result.push(`[${option}]`);
                break;
            }
        }
        return `Find: ${result.join(' ')}`;

    }
    //@+node:felix.20221022201804.11: *4* find.start_state_machine
    // ! USE CLIENT UI DIALOGS INSTEAD OF ORIGINAL LEO'S STATE_MACHINE

    // public start_state_machine(
    //     event: Event,
    //     prefix: str,
    //     handler: Callable,
    //     escape_handler: Callable = None,
    // ): void
    // """
    //     Initialize and start the state machine used to get user arguments.
    // """
    //     c, k = this.c, this.k
    // w = c.frame.body.wrapper
    // if not w:
    // return
    //     # Gui...
    // k.setLabelBlue(prefix)
    //     # New in Leo 5.2: minibuffer modes shows options in status area.
    // if this.minibuffer_mode:
    // this.show_find_options_in_status_area()
    //     elif c.config.getBool('use-find-dialog', default=True):
    // g.app.gui.openFindDialog(c)
    //     else:
    // c.frame.log.selectTab('Find')
    // this.add_find_string_to_label(protect = False)
    // k.getArgEscapes = ['\t'] if escape_handler else[]
    // this.handler = handler
    // this.escape_handler = escape_handler
    //     # Start the state matching!
    // k.get1Arg(event, handler = this.state0, tabList = this.findTextList, completion = True)

    // public state0(, event: Event): void
    // """Dispatch the next handler."""
    // k = this.k
    // if k.getArgEscapeFlag:
    // k.getArgEscapeFlag = False
    // this.escape_handler(event)
    //     else:
    // this.handler(event)
    //@+node:felix.20221022201804.12: *4* find.updateChange/FindList
    public update_change_list(s: string): void {
        if (!this.changeTextList.includes(s)) {
            this.changeTextList.push(s);
        }
    }

    public update_find_list(s: string): void {
        if (!this.findTextList.includes(s)) {
            this.findTextList.push(s);
        }
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
