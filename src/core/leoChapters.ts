//@+leo-ver=5-thin
//@+node:felix.20220429005433.1: * @file src/core/leoChapters.ts
/**
 * Classes that manage chapters in Leo's core.
 */
//@+<< leoChapters imports >>
//@+node:felix.20221110000315.1: ** << leoChapters imports >>
import * as g from './leoGlobals';
import { new_cmd_decorator } from '../core/decorators';
import { Position, VNode } from './leoNodes';
import { Commands } from './leoCommands';
//@-<< leoChapters imports >>
//@+others
//@+node:felix.20220429005433.2: ** cc.cmd (decorator)
/**
 * Command decorator for the ChapterController class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'chapterController']);
}
//@+node:felix.20220429005433.3: ** class ChapterController
/**
 * A per-commander controller that manages chapters and related nodes.
 */
export class ChapterController {
    public c: Commands;
    // Note: chapter names never change, even if their @chapter node changes.
    public chaptersDict: { [key: string]: Chapter }; // Keys are chapter names, values are chapters.
    public initing: boolean; // #31: True: suppress undo when creating chapters.
    public re_chapter: RegExp | undefined; // Set where used.
    public selectedChapter: Chapter | undefined;
    public selectChapterLockout: boolean; // True: cc.selectChapterForPosition does nothing.
    public tt: any; // May be set in finishCreate.
    public use_tabs: boolean | undefined;

    //@+others
    //@+node:felix.20220429005433.4: *3* Birth
    //@+node:felix.20220429005433.5: *4*  cc.ctor
    /**
     * Ctor for ChapterController class.
     */
    constructor(c: Commands) {
        this.c = c;
        // Note: chapter names never change, even if their @chapter node changes.
        this.chaptersDict = {}; // Keys are chapter names, values are chapters.
        this.initing = true; // #31: True: suppress undo when creating chapters.
        this.re_chapter = undefined; // Set where used.
        this.selectedChapter = undefined;
        this.selectChapterLockout = false; // True: cc.selectChapterForPosition does nothing.
        this.tt = undefined; // May be set in finishCreate.
        this.use_tabs = undefined;
        this.reloadSettings();
    }

    public reloadSettings(): void {
        const c = this.c;
        this.use_tabs = c.config.getBool('use-chapter-tabs');
    }
    //@+node:felix.20220429005433.6: *4* cc.createIcon
    /**
     * Create chapter-selection Qt ListBox in the icon area.
     */
    public createIcon(): void {
        const cc = this;
        const c: Commands = cc.c;
        if (cc.use_tabs) {
            if (
                c.frame &&
                c.frame.iconBar
            ) {
                if (!cc.tt) {
                    console.log(
                        'TODO : cc.tt = c.frame.iconBar.createChaptersIcon()'
                    );

                    // cc.tt = c.frame.iconBar.createChaptersIcon();
                }
            }
        }
    }
    //@+node:felix.20220429005433.7: *4* cc.finishCreate
    // This must be called late in the init process, after the first redraw.

    /**
     * Create the box in the icon area.
     */
    public finishCreate(): void {
        const cc = this;
        const c: Commands = cc.c;

        cc.createIcon();
        cc.setAllChapterNames();
        // Create all chapters.
        // #31.
        cc.initing = false;
        // Always select the main chapter.
        // It can be alarming to open a small chapter in a large .leo file.
        cc.selectChapterByName('main');
        c.redraw();
    }
    //@+node:felix.20220429005433.8: *4* cc.makeCommand
    /**
     * Make chapter-select-<chapterName> command.
     */
    public makeCommand(chapterName: string, binding?: string): void {
        const cc = this;
        const c: Commands = cc.c;

        const commandName = `chapter-select-${chapterName}`;
        //
        // For tracing:
        // inverseBindingsDict = c.k.computeInverseBindingDict()
        if (commandName in c.commandsDict) {
            return;
        }

        /**
         * Select specific chapter.
         */
        const select_chapter_callback = function (
            p_cc = cc,
            name = chapterName
        ) {
            const chapter = p_cc.chaptersDict[name];
            if (chapter) {
                try {
                    p_cc.selectChapterLockout = true;
                    p_cc.selectChapterByNameHelper(chapter, true);
                    c.redraw(chapter.p); // 2016/04/20.
                } catch (err) {
                    //
                } finally {
                    p_cc.selectChapterLockout = false;
                }
            } else if (!g.unitTesting) {
                // Possible, but not likely.
                p_cc.note(`no such chapter: ${name}`);
            }
        };
        // Always bind the command without a shortcut.
        // This will create the command bound to any existing settings.

        const bindings: any[] = binding
            ? [undefined, binding]
            : [undefined, undefined];

        // Replace the docstring for proper details label in minibuffer, etc.
        if (chapterName === 'main') {
            select_chapter_callback.__doc__ = 'Select the main chapter';
        } else {
            select_chapter_callback.__doc__ =
                'Select chapter "' + chapterName + '".';
        }

        for (let shortcut of bindings) {
            c.registerCommand(
                commandName,
                select_chapter_callback,
                undefined,
                undefined,
                shortcut
            );
        }
    }
    //@+node:felix.20220429005433.9: *3* cc.selectChapter
    @cmd(
        'chapter-select',
        'Prompt for a chapter name and select the given chapter.'
    )
    public selectChapter(): Thenable<void> {
        const cc = this;
        const names = cc.setAllChapterNames();
        const options = { placeHolder: "Select chapter" };
        return g.app.gui.get1Arg(options, undefined, names).then(
            (arg) => {
                if (arg) {
                    cc.selectChapterByName(arg);
                }
            }
        );
    }

    //@+node:felix.20220429005433.10: *3* cc.selectNext/Back
    @cmd('chapter-back', 'Select the previous chapter.')
    public backChapter(): void {
        const cc = this;

        const names: string[] = cc.setAllChapterNames();
        const sel_name = cc.selectedChapter ? cc.selectedChapter.name : 'main';
        let i = names.indexOf(sel_name);

        const new_name = names[i > 0 ? i - 1 : names.length - 1];

        cc.selectChapterByName(new_name);
    }

    @cmd('chapter-next', 'Select the next chapter.')
    public nextChapter(): void {
        const cc = this;

        const names: string[] = cc.setAllChapterNames();
        const sel_name = cc.selectedChapter ? cc.selectedChapter.name : 'main';
        let i = names.indexOf(sel_name);

        const new_name = names[i + 1 < names.length ? i + 1 : 0];

        cc.selectChapterByName(new_name);
    }
    //@+node:felix.20220429005433.11: *3* cc.selectChapterByName & helper
    /**
     * Select a chapter without redrawing.
     */
    public selectChapterByName(name: string): void {
        const cc = this;

        if (this.selectChapterLockout) {
            return;
        }
        if (typeof name === 'number') {
            cc.note('PyQt5 chapters not supported');
            return;
        }

        const chapter = cc.getChapter(name);
        if (!chapter) {
            if (!g.unitTesting) {
                g.es_print(`no such @chapter node: ${name}`);
            }
            return;
        }
        try {
            cc.selectChapterLockout = true;
            cc.selectChapterByNameHelper(chapter);
        } catch (err) {
            // pass
        } finally {
            cc.selectChapterLockout = false;
        }
    }
    //@+node:felix.20220429005433.12: *4* cc.selectChapterByNameHelper
    /**
     * Select the chapter.
     */
    public selectChapterByNameHelper(chapter: Chapter, collapse = true): void {
        const cc = this;
        const c: Commands = this.c;

        if (!cc.selectedChapter && chapter.name === 'main') {
            chapter.p = c.p;
            return;
        }
        if (chapter === cc.selectedChapter) {
            chapter.p = c.p;
            return;
        }
        if (cc.selectedChapter) {
            cc.selectedChapter.unselect();
        } else {
            const main_chapter = cc.getChapter('main');
            if (main_chapter) {
                main_chapter.unselect();
            }
        }

        if (chapter.p && c.positionExists(chapter.p)) {
            // pass
        } else if (chapter.name === 'main') {
            // pass  // Do not use c.p.
        } else {
            chapter.p = chapter.findRootNode()!;
        }
        // #2718: Leave the expansion state of all nodes strictly unchanged!
        //        - c.contractAllHeadlines can change c.p!
        //        - Expanding chapter.p would be confusing and annoying.
        chapter.select();
        c.selectPosition(chapter.p);
        c.redraw(); // #2718.
    }
    //@+node:felix.20220429005433.13: *3* cc.Utils
    //@+node:felix.20220429005433.14: *4* cc.error/note/warning
    public error(s: string): void {
        g.error(`Error: ${s}`);
    }

    public note(s: string, killUnitTest?: boolean): void {
        if (g.unitTesting) {
            if (0) {
                // To trace cause of failed unit test.
                g.trace('=====', s, g.callers());
            }
            if (killUnitTest) {
                g.assert(false, s); // noqa
            }
        } else {
            g.note(`Note: ${s}`);
        }
    }

    public warning(s: string): void {
        g.es_print(`Warning: ${s}`);
    }
    //@+node:felix.20220429005433.15: *4* cc.findAnyChapterNode
    /**
     * Return True if the outline contains any @chapter node.
     */
    public findAnyChapterNode(): boolean {
        const cc = this;

        for (let p of cc.c.all_unique_positions()) {
            if (p.h.startsWith('@chapter ')) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20220429005433.16: *4* cc.findChapterNameForPosition
    /**
     * Return the name of a chapter containing p or None if p does not exist.
     */
    public findChapterNameForPosition(p: Position): string | undefined {
        const cc = this;
        const c = this.c;

        if (!p || !p.__bool__() || !c.positionExists(p)) {
            return undefined;
        }
        for (let name in cc.chaptersDict) {
            if (name !== 'main') {
                const theChapter = cc.chaptersDict[name];
                if (theChapter.positionIsInChapter(p)) {
                    return name;
                }
            }
        }
        return 'main';
    }
    //@+node:felix.20220429005433.17: *4* cc.findChapterNode
    /**
     * Return the position of the first @chapter node with the given name
     * anywhere in the entire outline.
     *
     * All @chapter nodes are created as children of the @chapters node,
     * but users may move them anywhere.
     */
    public findChapterNode(name: string): Position | undefined {
        const cc = this;

        name = g.checkUnicode(name);

        for (let p of cc.c.all_positions()) {
            let chapterName: string | undefined;
            let binding: string | undefined;
            [chapterName, binding] = this.parseHeadline(p);
            if (chapterName === name) {
                return p;
            }
        }
        return undefined; // Not an error.
    }
    //@+node:felix.20220429005433.18: *4* cc.getChapter
    public getChapter(name: string): Chapter {
        const cc = this;
        return cc.chaptersDict[name];
    }
    //@+node:felix.20220429005433.19: *4* cc.getSelectedChapter
    public getSelectedChapter(): Chapter | undefined {
        const cc = this;
        return cc.selectedChapter;
    }
    //@+node:felix.20220429005433.20: *4* cc.inChapter
    public inChapter(): boolean {
        const cc = this;

        const theChapter = cc.getSelectedChapter();

        return !!(theChapter && theChapter.name !== 'main');
    }
    //@+node:felix.20220429005433.21: *4* cc.parseHeadline
    /**
     * Return the chapter name and key binding for p.h.
     */
    public parseHeadline(
        p: Position
    ): [string | undefined, string | undefined] {
        if (!this.re_chapter) {
            this.re_chapter = new RegExp(
                /^@chapter\s+([^@]+)\s*(@key\s*=\s*(.+)\s*)?/
            );

            // @chapter (all up to @) (@key=(binding))?
            // name=group(1), binding=group(3)
        }

        const m: RegExpMatchArray | null = p.h.match(this.re_chapter);
        let chapterName: string | undefined;
        let binding: string | undefined;

        if (m) {
            chapterName = m[1]; // re operation
            binding = m[3]; // re operation
            if (chapterName) {
                chapterName = this.sanitize(chapterName);
            }
            if (binding) {
                binding = binding.trim();
            }
        } else {
            chapterName = undefined;
            binding = undefined;
        }

        return [chapterName, binding];
    }
    //@+node:felix.20220429005433.22: *4* cc.sanitize
    /**
     * Convert s to a safe chapter name.
     */
    public sanitize(s: string): string {
        // Similar to g.sanitize_filename, but simpler.
        const result: string[] = [];
        for (let ch of s.trim()) {
            if (
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.includes(
                    ch
                )
            ) {
                result.push(ch);
            } else if (' \t'.includes(ch)) {
                result.push('-');
            }
        }
        s = result.join('');
        s = s.split('--').join('-');

        return s.slice(0, 128);
    }
    //@+node:felix.20220429005433.23: *4* cc.selectChapterForPosition
    /**
     * Select a chapter containing position p.
     * New in Leo 4.11: prefer the given chapter if possible.
     * Do nothing if p if p does not exist or is in the presently selected chapter.
     *
     * Note: this code calls c.redraw() if the chapter changes.
     */
    public selectChapterForPosition(p: Position, chapter?: Chapter): void {
        const cc = this;
        const c = this.c;

        // New in Leo 4.11
        if (cc.selectChapterLockout) {
            return;
        }
        const selChapter = cc.getSelectedChapter();
        if (!chapter && !selChapter) {
            return;
        }
        if (!p) {
            return;
        }
        if (!c.positionExists(p)) {
            return;
        }
        // New in Leo 4.11: prefer the given chapter if possible.
        const theChapter = chapter || selChapter;
        if (!theChapter) {
            return;
        }
        // First, try the presently selected chapter.
        const firstName = theChapter.name;
        if (firstName === 'main') {
            return;
        }
        if (theChapter.positionIsInChapter(p)) {
            cc.selectChapterByName(theChapter.name);
            return;
        }
        let noBreak = true;
        for (let name in cc.chaptersDict) {
            if (![firstName, 'main'].includes(name)) {
                const theChapter = cc.chaptersDict[name];
                if (theChapter.positionIsInChapter(p)) {
                    cc.selectChapterByName(name);
                    noBreak = false;
                    break;
                }
            }
        }
        if (noBreak) {
            cc.selectChapterByName('main');
        }

        // Fix bug 869385: Chapters make the nav_qt.py plugin useless
        g.assert(!this.selectChapterLockout);
        // New in Leo 5.6: don't call c.redraw immediately.
        c.redraw_later();
    }
    //@+node:felix.20220429005433.24: *4* cc.setAllChapterNames
    /**
     * Called early and often to discover all chapter names.
     */
    public setAllChapterNames(): string[] {
        const cc = this;
        const c = this.c;

        // sel_name = cc.selectedChapter and cc.selectedChapter.name or 'main'
        if (!('main' in cc.chaptersDict)) {
            cc.chaptersDict['main'] = new Chapter(c, cc, 'main');
            cc.makeCommand('main');
            // This binds any existing bindings to chapter-select-main.
        }

        const result: string[] = ['main'];
        const seen: VNode[] = [];
        for (let p of c.all_unique_positions()) {
            let chapterName: string | undefined;
            let binding: string | undefined;
            [chapterName, binding] = this.parseHeadline(p);
            if (chapterName && !seen.includes(p.v)) {
                seen.push(p.v);
                result.push(chapterName);
                if (!(chapterName in cc.chaptersDict)) {
                    cc.chaptersDict[chapterName] = new Chapter(
                        c,
                        cc,
                        chapterName
                    );
                    cc.makeCommand(chapterName, binding);
                }
            }
        }
        return result;
    }
    //@-others
}
//@+node:felix.20220429005433.25: ** class Chapter
/**
 * A class representing the non-gui data of a single chapter.
 */
export class Chapter {
    public c: Commands;
    public cc: ChapterController;
    public name: string;
    public selectLockout: boolean;
    // State variables: saved/restored when the chapter is unselected/selected.
    public p: Position;
    public root: Position | undefined;

    //@+others
    //@+node:felix.20220429005433.26: *3* chapter.__init__
    constructor(
        c: Commands,
        chapterController: ChapterController,
        name: string
    ) {
        this.c = c;
        this.cc = chapterController;
        const cc = chapterController;
        this.name = g.checkUnicode(name);
        this.selectLockout = false; // True: in chapter.select logic.
        // State variables: saved/restored when the chapter is unselected/selected.
        this.p = c.p;
        this.root = this.findRootNode();
        if (cc.tt) {
            cc.tt.createTab(name);
        }
    }
    //@+node:felix.20220429005433.27: *3* chapter.__str__ and __repr__
    /**
     * Chapter.__str__
     */
    public toString(): string {
        return `<chapter: ${this.name}, p: ${this.p.h}> `;
    }
    public inspect(): string {
        return this.toString();
    }
    //@+node:felix.20220429005433.28: *3* chapter.findRootNode
    /**
     * Return the @chapter node for this chapter.
     */
    public findRootNode(): Position | undefined {
        if (this.name === 'main') {
            return undefined;
        }
        return this.cc.findChapterNode(this.name);
    }
    //@+node:felix.20220429005433.29: *3* chapter.select & helpers
    /**
     * Restore chapter information and redraw the tree when a chapter is selected.
     */
    public select(w?: any): void {
        if (this.selectLockout) {
            return;
        }
        try {
            const tt = this.cc.tt;
            this.selectLockout = true;
            this.chapterSelectHelper(w);
            if (tt) {
                // A bad kludge: update all the chapter names *after* the selection.
                tt.setTabLabel(this.name);
            }
        } catch (p_err) {
            // pass
        } finally {
            this.selectLockout = false;
        }
    }
    //@+node:felix.20220429005433.30: *4* chapter.chapterSelectHelper
    public chapterSelectHelper(w?: any): void {
        const cc = this.cc;
        const c = this.c;
        const u = this.c.undoer;

        cc.selectedChapter = this;
        let p: Position;

        if (this.name === 'main') {
            return; // 2016/04/20
        }
        // Remember the root (it may have changed) for dehoist.
        this.root = this.findRootNode();
        const root = this.root;
        if (!root || !root.__bool__()) {
            // Might happen during unit testing or startup.
            return;
        }
        if (this.p.__bool__() && !c.positionExists(this.p)) {
            this.p = root.copy();
            p = this.p;
        }

        // Next, recompute p and possibly select a new editor.
        if (w) {
            g.assert(w === c.frame.body.wrapper);
            g.assert(w.leo_p);
            this.p = this.findPositionInChapter(w.leo_p) || root.copy();
            p = this.p;
        } else {
            // This must be done *after* switching roots.
            this.p = this.findPositionInChapter(this.p) || root.copy();
            p = this.p;
            // Careful: c.selectPosition would pop the hoist stack.

            // TODO : Needed ?
            // w = this.findEditorInChapter(p);
            // c.frame.body.selectEditor(w);  // Switches text.

            this.p = p; // 2016/04/20: Apparently essential.
        }

        if (g.match_word(p.h, 0, '@chapter')) {
            if (p.hasChildren()) {
                this.p = p.firstChild();
                p = this.p;
            } else {
                const bunch = u.beforeInsertNode(p);
                // Create a dummy first child.
                this.p = p.insertAsLastChild();
                p = this.p;
                p.h = 'New Headline';
                u.afterInsertNode(this.p, 'Insert Node', bunch);
            }
        }
        c.hoistStack.push({ p: root.copy(), expanded: true });
        // Careful: c.selectPosition would pop the hoist stack.
        c.setCurrentPosition(p);
        g.doHook('hoist-changed', { c: c });
    }
    //@+node:felix.20220429005433.31: *4* chapter.findPositionInChapter
    /**
     * Return a valid position p such that p.v == v.
     */
    public findPositionInChapter(
        p1: Position,
        strict?: boolean
    ): Position | undefined {
        const c = this.c;
        const name = this.name;

        // Bug fix: 2012/05/24: Search without root arg in the main chapter.
        if (name === 'main' && c.positionExists(p1)) {
            return p1;
        }
        if (!p1 || !p1.__bool__()) {
            return undefined;
        }
        const root = this.findRootNode();
        if (!root || !root.__bool__()) {
            return undefined;
        }
        if (c.positionExists(p1, root.copy())) {
            return p1;
        }
        if (strict) {
            return undefined;
        }
        let theIter: Generator<Position, any, unknown>;
        if (name === 'main') {
            theIter = c.all_unique_positions(false);
            // for (let p of c.all_unique_positions(false)) {
            //     if (p.v === p1.v) {
            //         return p.copy();
            //     }
            // }
        } else {
            theIter = root.self_and_subtree(false);
            // for (let p of root.self_and_subtree(false)) {
            //     if (p.v === p1.v) {
            //         return p.copy();
            //     }
            // }
        }
        for (let p of theIter) {
            if (p.v === p1.v) {
                return p.copy();
            }
        }
        return undefined;
    }
    //@+node:felix.20220429005433.32: *4* chapter.findEditorInChapter
    /**
     * return w, an editor displaying position p.
     */
    public findEditorInChapter(p: Position): any {
        const chapter = this;
        const c = this.c;
        // TODO : Needed ?
        const w: any = undefined; // c.frame.body.findEditorForChapter(chapter, p);
        if (w) {
            w.leo_chapter = chapter;
            w.leo_p = p && p.__bool__() && p.copy();
        }
        return w;
    }
    //@+node:felix.20220429005433.33: *4* chapter.positionIsInChapter
    public positionIsInChapter(p: Position): boolean {
        const p2 = this.findPositionInChapter(p, true);
        return !!(p2 && p2.__bool__());
    }
    //@+node:felix.20220429005433.34: *3* chapter.unselect
    /**
     * Remember chapter info when a chapter is about to be unselected.
     */
    public unselect(): void {
        const c = this.c;

        // Always try to return to the same position.
        this.p = c.p;

        if (this.name === 'main') {
            return;
        }
        let root: Position | undefined;
        let bunch;
        while (c.hoistStack.length) {
            bunch = c.hoistStack.pop();
            root = bunch!.p;
            if (root === this.root) {
                break;
            }
        }

        // Re-institute the previous hoist.
        if (c.hoistStack.length) {
            const p = c.hoistStack[c.hoistStack.length - 1].p;
            // Careful: c.selectPosition would pop the hoist stack.
            c.setCurrentPosition(p);
        } else {
            const p = root || c.p;
            c.setCurrentPosition(p);
        }
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
