//@+leo-ver=5-thin
//@+node:felix.20220512205042.1: * @file src/core/leoFrame.ts
/**
 * Frame for typescript client support
 */
//@+<< imports >>
//@+node:felix.20220512211158.1: ** << imports >>
import * as g from './leoGlobals';
import { LeoGui } from './leoGui';
import { Commands } from "./leoCommands";
import { Position, VNode } from './leoNodes';
import { Chapter } from './leoChapters';
import { StringFindTabManager } from './findTabManager';

//@-<< imports >>
//@+others
//@+node:felix.20220512211744.1: ** class LeoFrame
export class LeoFrame {

    public c: Commands;
    public title: string;
    public gui: LeoGui;
    public openDirectory: string;
    public iconBar: any;
    public initComplete = false;
    public isNullFrame = false;

    public ftm!: StringFindTabManager; // added in finishCreate

    public saved: boolean;
    public startupWindow: boolean;
    public log: any; // ! UNUSED !
    public tree: NullTree;
    public body: NullBody;
    public tab_width: number = 0;

    //@+others
    //@+node:felix.20220512211350.1: *3* frame.ctor
    constructor(c: Commands, title: string, gui: LeoGui) {
        this.c = c;
        this.title = title;
        this.gui = gui;
        this.saved = false;
        this.startupWindow = false;
        this.openDirectory = '';
        this.iconBar = {};
        this.initComplete = true;
        this.isNullFrame = true;

        this.tree = new NullTree(this);
        this.body = new NullBody(this);
    }
    //@+node:felix.20221109233352.1: *3* createFirstTreeNode
    public createFirstTreeNode(): void {
        const c = this.c;
        c.hiddenRootNode.children = [];

        // #1817: Clear the gnxDict.
        c.fileCommands.gnxDict = {};
        // 
        //  Create the first node.
        let v = new VNode(c);
        let p = new Position(v);
        v.initHeadString('NewHeadline');
        // 
        //  New in Leo 4.5: p.moveToRoot would be wrong:
        //                  the node hasn't been linked yet.
        p._linkAsRoot();
    }

    //@+node:felix.20220512220820.1: *3* destroySelf
    public destroySelf(): void {
        console.log('TODO: DestroySelf');
    }
    //@+node:felix.20220512222542.1: *3* finishCreate
    public finishCreate() {

        const c = this.c;
        if (!this.gui.isNullGui) {
            g.app.windowList.push(this);
        } else {
            // console.log("Finished Creating Null Gui's frame");
        }
        const ftm = new StringFindTabManager(c);
        c.findCommands.ftm = ftm;
        this.ftm = ftm;
        // this.createFindTab(); // unused in leojs
        this.createFirstTreeNode();

    }
    //@+node:felix.20221105172641.1: *3* LeoFrame.getTitle & setTitle
    public getTitle(): string {
        return this.title;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    //@+node:felix.20221105172647.1: *3* LeoFrame.setTabWidth
    /**
     * Set the tab width in effect for this frame.
     */
    public setTabWidth(w: number): void {

        // Subclasses may override this to affect drawing.
        this.tab_width = w;

    }
    //@+node:felix.20220516001519.1: *3* LeoFrame.promptForSave
    /**
     * Prompt the user to save changes.
     * Return True if the user vetos the quit or save operation.
     */
    public async promptForSave(): Promise<boolean> {

        const c = this.c;
        const theType = g.app.quitting ? "quitting?" : "closing?";
        // See if we are in quick edit/save mode.
        let root = c.rootPosition()!;
        const quick_save = !c.mFileName && !root.next().__bool__() && root.isAtEditNode();

        let name: string;
        if (quick_save) {
            name = g.shortFileName(root.atEditNodeName());
        } else {
            name = c.mFileName ? c.mFileName : this.title;
        }
        const answer = await g.app.gui.runAskYesNoCancelDialog(
            c,
            'Confirm',
            `Save changes to ${g.splitLongFileName(name)} before ${theType}`
        );

        if (answer === "cancel") {
            return true;  // Veto.
        }
        if (answer === "no") {
            return false;  // Don't save and don't veto.
        }
        if (!c.mFileName) {
            const root = c.rootPosition()!;
            if (!root.next().__bool__() && root.isAtEditNode()) {
                // There is only a single @edit node in the outline.
                // A hack to allow "quick edit" of non-Leo files.
                // See https://bugs.launchpad.net/leo-editor/+bug/381527
                // Write the @edit node if needed.
                if (root.isDirty()) {
                    c.atFileCommands.writeOneAtEditNode(root);
                }
                return false;  // Don't save and don't veto.
            }
            c.mFileName = await g.app.gui.runSaveFileDialog(
                c,
                "Save",
                [["Leo files", "*.leo"]],
                ".leo"
            );

            c.bringToFront();
        }
        if (c.mFileName) {
            const ok = await c.fileCommands.save(c.mFileName);
            return !ok;  // Veto if the save did not succeed.
        }
        return true;  // Veto.

    }
    //@+node:felix.20221105165429.1: *3* LeoFrame.frame.scanForTabWidth
    /**
     * Return the tab width in effect at p.
     */
    public scanForTabWidth(p: Position): void {

        const c = this.c;
        const tab_width = c.getTabWidth(p);
        c.frame.setTabWidth(tab_width || 0);

    }
    //@+node:felix.20221027154024.1: *3* putStatusLine
    public putStatusLine(s: string, bg?: string, fg?: string): void {
        // TODO !
        // console.log('TODO ? putStatusLine', s);
    }
    //@-others

}
//@+node:felix.20221102232737.1: ** class NullBody (LeoBody)
/**
 * A do-nothing body class.
 */
export class NullBody {

    public c: Commands;
    public frame: LeoFrame;
    public insertPoint = 0;
    public selection = [0, 0];
    public s = "";  // The body text
    // public widget: Widget = None
    public wrapper: StringTextWrapper;
    public use_chapters: boolean;
    public editorWrappers: { [key: string]: any } = {};
    // this.colorizer: Any = NullColorizer(this.c)  // A Union.

    //@+others
    //@+node:felix.20221102232737.2: *3*  NullBody.__init__
    constructor(frame: LeoFrame) {
        this.c = frame.c;
        frame.body = this;
        this.frame = frame;
        this.use_chapters = false;
        // this.widget: Widget = None
        this.wrapper = new StringTextWrapper(this.c, 'body');
        this.editorWrappers['1'] = this.wrapper;
        // this.colorizer: Any = NullColorizer(this.c)  # A Union.
    }

    //@+node:felix.20221102232737.3: *3* NullBody: LeoBody interface
    // # Birth, death...

    // def createControl(self, parentFrame: Widget, p: Position) -> Wrapper:
    //     pass
    // # Editors...

    // def addEditor(self, event: Event=None) -> None:
    //     pass

    // def assignPositionToEditor(self, p: Position) -> None:
    //     pass

    // def createEditorFrame(self, w: Widget) -> Widget:
    //     return None

    // def cycleEditorFocus(self, event: Event=None) -> None:
    //     pass

    // def deleteEditor(self, event: Event=None) -> None:
    //     pass

    // def selectEditor(self, w: Widget) -> None:
    //     pass

    // def selectLabel(self, w: Widget) -> None:
    //     pass

    // def setEditorColors(self, bg: str, fg: str) -> None:
    //     pass

    // def unselectLabel(self, w: Widget) -> None:
    //     pass

    // def updateEditors() -> None:
    //     pass
    // # Events...

    // def forceFullRecolor() -> None:
    //     pass

    // def scheduleIdleTimeRoutine(self, function: str, *args: str, **keys: str) -> None:
    //     pass
    // # Low-level gui...

    // def setFocus() -> None:
    //     pass
    //@+node:felix.20221105150955.1: *3* LeoBody.utils
    //@+node:felix.20221105150955.2: *4* LeoBody.computeLabel
    public computeLabel(w: StringTextWrapper): string {
        let s = w.leo_label_s;
        if (w.leo_chapter !== undefined) {
            s = `${w.leo_chapter.name}: ${s}`;
        }
        return s || "";
    }
    //@+node:felix.20221105150955.3: *4* LeoBody.createChapterIvar
    public createChapterIvar(w: StringTextWrapper): void {
        const c = this.c;
        const cc = c.chapterController;
        if (!w.leo_chapter) {
            if (cc && this.use_chapters) {
                w.leo_chapter = cc.getSelectedChapter();
            } else {
                w.leo_chapter = undefined;
            }
        }
    }
    //@+node:felix.20221105150955.4: *4* LeoBody.ensurePositionExists
    /**
     * Return True if w.leo_p exists or can be reconstituted.
     */
    public ensurePositionExists(w: StringTextWrapper): boolean {

        const c = this.c;
        if (w.leo_p && c.positionExists(w.leo_p)) {
            return true;
        }
        g.trace('***** does not exist', w.leo_name);
        for (let p2 of c.all_unique_positions()) {
            if (p2.v && p2.v === w.leo_v) {
                w.leo_p = p2.copy();
                return true;
            }
        }
        // This *can* happen when selecting a deleted node.
        w.leo_p = c.p;
        return false;

    }
    //@+node:felix.20221105150955.7: *4* LeoBody.switchToChapter
    /**
     * select w.leo_chapter.
     */
    public switchToChapter(w: StringTextWrapper): void {

        const c = this.c;
        const cc = c.chapterController;
        if (w.leo_chapter !== undefined) {
            const chapter = w.leo_chapter;
            const name = chapter && chapter.name;
            const oldChapter = cc.getSelectedChapter();
            if (chapter !== oldChapter) {
                cc.selectChapterByName(name);
                c.bodyWantsFocus();
            }
        }

    }
    //@+node:felix.20221105150955.8: *4* LeoBody.updateInjectedIvars
    // Called from addEditor and assignPositionToEditor.

    /**
     * Inject updated ivars in w, a gui widget.
     */
    public updateInjectedIvars(w: StringTextWrapper, p: Position): void {

        if (!w) {
            return;
        }
        const c = this.c;
        const cc = c.chapterController;
        // Was in ctor.
        const use_chapters = c.config.getBool('use-chapters');
        if (cc && use_chapters) {
            w.leo_chapter = cc.getSelectedChapter();
        } else {
            w.leo_chapter = undefined;
        }
        w.leo_p = p.copy();
        w.leo_v = w.leo_p.v;
        w.leo_label_s = p.h;

    }
    //@-others

}

//@+node:felix.20221102232749.1: ** class NullTree (LeoTree)
/**
 * A do-almost-nothing tree class.
 */
export class NullTree {
    public frame: LeoFrame;
    public canvas = {};
    // New in 3.12: keys vnodes, values are edit_widgets.
    // New in 4.2: keys are vnodes, values are pairs (p,edit widgets).
    public edit_text_dict: { [key: string]: [Position, any] };
    // "public" ivars: correspond to setters & getters.
    public drag_p: Position | undefined;
    public generation: number;  // low-level vnode methods increment public count.
    public redrawCount: number;  // For traces
    public updateCount: number;
    public use_chapters: boolean;  // May be overridden in subclasses.


    public c: Commands;
    public editWidgetsDict: { [key: string]: StringTextWrapper }; // Keys are vnodes, values are StringTextWidgets.
    // public font = undefined;
    // public fontName = undefined;
    // public canvas = undefined;
    public treeWidget: g.NullObject | any;

    //@+others
    //@+node:felix.20221102232749.2: *3*  NullTree.__init__
    constructor(frame: LeoFrame) {

        this.frame = frame;

        // New in 3.12: keys vnodes, values are edit_widgets.
        // New in 4.2: keys are vnodes, values are pairs (p,edit widgets).
        this.edit_text_dict = {};
        // "public" ivars: correspond to setters & getters.
        this.drag_p = undefined;
        this.generation = 0;  // low-level vnode methods increment this count.
        this.redrawCount = 0;  // For traces
        this.use_chapters = false;  // May be overridden in subclasses.


        this.c = frame.c;
        this.editWidgetsDict = {}; // Keys are vnodes, values are StringTextWidgets.
        // this.font = undefined;
        // this.fontName = undefined;
        // this.canvas = undefined;
        this.treeWidget = { _name: 'tree' }; // new g.NullObject();
        this.redrawCount = 0;
        this.updateCount = 0;

    }
    //@+node:felix.20221105000046.1: *3* LeoTree.endEditLabel
    /**
     * End editing of a headline and update p.h.
     */
    public endEditLabel(): void {

        // Important: this will redraw if necessary.
        this.onHeadChanged(this.c.p);
        // ! LEOJS: Mimic qt_tree 
        const d = this.editWidgetsDict;
        if (d[this.c.p.v.gnx]) {
            delete d[this.c.p.v.gnx];
        }

    }
    //@+node:felix.20221105000303.1: *3* LeoTree.onHeadChanged

    /**
     * Officially change a headline.
     * Set the old undo text to the previous revert point.
     */
    public onHeadChanged(p: Position, undoType = 'Typing'): void {

        const c = this.c;
        const u = this.c.undoer;
        const w = this.edit_widget(p);
        if (!w) {
            // g.trace('no w');
            return;
        }
        const ch = '\n';  // We only report the final keystroke.
        let s = w.getAllText();
        //@+<< truncate s if it has multiple lines >>
        //@+node:felix.20221105000303.2: *4* << truncate s if it has multiple lines >>
        // Remove trailing newlines before warning of truncation.
        while (s && s[s.length - 1] === '\n') {
            s = s.substring(0, s.length - 1);
        }
        // Warn if there are multiple lines.
        const i = s.indexOf('\n');
        if (i > -1) {
            g.warning("truncating headline to one line");
            s = s.substring(0, i);
        }
        const limit = 1000;
        if (s.length > limit) {
            g.warning("truncating headline to " + limit + " characters");
            s = s.substring(0, limit);
        }
        s = g.checkUnicode(s || '');

        //@-<< truncate s if it has multiple lines >>

        // Make the change official, but undo to the *old* revert point.
        const changed = s !== p.h;
        if (!changed) {
            return;  // Leo 6.4: only call the hooks if the headline has actually changed.
        }
        // if( g.doHook("headkey1", c, p, ch, changed)){
        //     return;  // The hook claims to have handled the event.
        // }
        // Handle undo.
        const undoData = u.beforeChangeHeadline(p);
        p.initHeadString(s);  // change p.h *after* calling undoer's before method.
        if (!c.changed) {
            c.setChanged();
        }
        // New in Leo 4.4.5: we must recolor the body because
        // the headline may contain directives.
        c.frame.scanForTabWidth(p);
        // c.frame.body.recolor(p); // ? Not Needed with leojs/vscode ?
        p.setDirty();
        u.afterChangeHeadline(p, undoType, undoData);
        // Fix bug 1280689: don't call the non-existent c.treeEditFocusHelper
        c.redraw_after_head_changed();
        // g.doHook("headkey2", c, p, ch, changed);

    }
    //@+node:felix.20221210191616.1: *3* LeoTree.select & helpers
    /**
     * Select a node.
     * Never redraws outline, but may change coloring of individual headlines.
     * The scroll argument is used by the gui to suppress scrolling while dragging.
     */
    public select(p: Position): void {
        //
        // c.nodeHistory.update(p); // ! FROM select_new_node of tree wrapper 'select'

        const trace = g.app.debug.includes('select') && !g.unitTesting;
        const tag = 'LeoTree.select';
        const c = this.c;
        if (g.app.killed) {
            return;
        }
        if (trace) {
            console.log(`----- ${tag}: ${p.h}`);
            // print(f"{tag:>30}: {c.frame.body.wrapper} {p.h}")
            // Format matches traces in leoflexx.py
            // print(f"{tag:30}: {len(p.b):4} {p.gnx} {p.h}")
        }


        try {
            // this.tree_select_lockout = true;
            // this.prev_v = c.p.v
            this.selectHelper(p);
        }

        finally {
            // this.tree_select_lockout = False
            if (c.enableRedrawFlag) {
                p = c.p;
                // Don't redraw during unit testing: an important speedup.
                if (c.expandAllAncestors(p) && !g.unitTesting) {
                    // This can happen when doing goto-next-clone.
                    c.redraw_later();  // This *does* happen sometimes.
                } else {
                    c.outerUpdate();  // Bring the tree up to date.
                    // ! NOT USED IN LEOJS
                    // if (this.setItemForCurrentPosition){
                    //     // pylint: disable=no-member
                    //     this.setItemForCurrentPosition();
                    // }
                }
            } else {
                c.requestLaterRedraw = true;
            }
        }
    }

    //@+node:felix.20221210193746.1: *4* LeoTree.selectHelper & helpers
    /**
     *  A helper function for leoTree.select.
     * Do **not** "optimize" this by returning if p==c.p!
     */
    public selectHelper(p: Position): void {

        if (!p || !p.__bool__()) {
            // This is not an error! We may be changing roots.
            // Do *not* test c.positionExists(p) here!
            return;
        }
        const c = this.c;
        if (!c.frame.body.wrapper) {
            return;  // Defensive.
        }
        if (p.v.context !== c) {
            // Selecting a foreign position will not be pretty.
            g.trace(`Wrong context: ${p.v.context} != ${c}`);
            return;
        }
        const old_p = c.p;
        const call_event_handlers = !p.__eq__(old_p);
        // Order is important...
        // 1. Call c.endEditLabel.
        this.unselect_helper(old_p, p);

        // 2. Call set_body_text_after_select.
        this.select_new_node(old_p, p);

        // 3. Call c.undoer.onSelect.
        this.change_current_position(old_p, p);

        // 4. Set cursor in body.
        this.scroll_cursor(p);

        // 5. Last tweaks.
        this.set_status_line(p);
        if (call_event_handlers) {
            //  g.doHook("select2", c=c, new_p=p, old_p=old_p, new_v=p, old_v=old_p)
            g.doHook("select2", { c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p });
            g.doHook("select3", { c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p });
        }
    }
    //@+node:felix.20221210193746.2: *5* 1. LeoTree.unselect_helper
    /**
     * Unselect the old node, calling the unselect hooks.
     */
    public unselect_helper(old_p: Position, p: Position): void {

        const c = this.c;
        const call_event_handlers = !p.__eq__(old_p);
        let unselect: boolean;
        if (call_event_handlers) {
            unselect = !g.doHook("unselect1", { c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p });
        } else {
            unselect = true;
        }

        // Actually unselect the old node. 
        if (unselect && old_p && old_p.__bool__() && !old_p.__eq__(p)) {
            this.endEditLabel();
            // #1168: Ctrl-minus selects multiple nodes.
            // UNUSED IN LEOJS
            // if hasattr(this, 'unselectItem')
            //     // pylint: disable=no-member
            //     this.unselectItem(old_p)
        }
        if (call_event_handlers) {
            g.doHook("unselect2", { c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p });
        }
    }

    //@+node:felix.20221210193746.3: *5* 2. LeoTree.select_new_node & helper
    /**
     * Select the new node, part 1.
     */
    public select_new_node(old_p: Position, p: Position): void {

        const c = this.c;
        const call_event_handlers = !p.__eq__(old_p);

        if (call_event_handlers && g.doHook("select1",
            { c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p })
        ) {
            if (g.app.debug.includes('select')) {
                g.trace('select1 override');
            }
            return;
        }

        // c.frame.setWrap(p);  // Not that expensive  // NOT USED IN LEOJS
        this.set_body_text_after_select(p, old_p);
        c.nodeHistory.update(p);

    }

    //@+node:felix.20221210193746.4: *6* LeoTree.set_body_text_after_select
    /**
     * Set the text after selecting a node.
     */
    public set_body_text_after_select(p: Position, old_p: Position): void {

        const c = this.c;
        const w = c.frame.body.wrapper;
        const s = p.v.b;  // Guaranteed to be unicode.
        // Part 1: get the old text.
        const old_s = w.getAllText();
        if (p && p.__bool__() && p.__eq__(old_p) && s === old_s) {
            return;
        }
        // Part 2: set the new text. This forces a recolor.
        // Important: do this *before* setting text,
        // so that the colorizer will have the proper c.p.
        c.setCurrentPosition(p);
        w.setAllText(s);
        // This is now done after c.p has been changed.
        // p.restoreCursorAndScroll()

    }

    //@+node:felix.20221210193746.5: *5* 3. LeoTree.change_current_position
    /**
     * Select the new node, part 2.
     */
    public change_current_position(old_p: Position, p: Position): void {

        const c = this.c;
        // c.setCurrentPosition(p)
        // This is now done in set_body_text_after_select.
        // GS I believe this should also get into the select1 hook
        c.frame.scanForTabWidth(p);
        const use_chapters = c.config.getBool('use-chapters');
        if (use_chapters) {
            const cc = c.chapterController;
            const theChapter = cc && cc.getSelectedChapter();
            if (theChapter) {
                theChapter.p = p.copy();
            }
        }
        // Do not call treeFocusHelper here!
        // c.treeFocusHelper()
        c.undoer.onSelect(old_p, p);

    }

    //@+node:felix.20221210193746.6: *5* 4. LeoTree.scroll_cursor
    /**
     * Scroll the cursor.
     */
    public scroll_cursor(p: Position): void {
        p.restoreCursorAndScroll();  // Was in setBodyTextAfterSelect
    }

    //@+node:felix.20221210193746.7: *5* 5. LeoTree.set_status_line
    /**
     * Update the status line.
     */
    public set_status_line(p: Position): void {
        const c = this.c;
        // c.frame.body.assignPositionToEditor(p);  // New in Leo 4.4.1. // NOT USED IN LEOJS
        // c.frame.updateStatusLine();  // New in Leo 4.4.1. // NOT USED IN LEOJS
        // c.frame.clearStatusLine(); // NOT USED IN LEOJS
        if (p && p.__bool__() && p.v) {
            c.frame.putStatusLine(p.get_UNL());
        }
    }

    //@+node:felix.20221102232749.3: *3* NullTree.edit_widget
    public edit_widget(p: Position): StringTextWrapper | undefined {
        const d = this.editWidgetsDict;
        if (!p || !p.v) {
            return undefined;
        }
        let w = d[p.v.gnx];
        // ! LEOJS : Mimic from qt_tree
        // ! Dont return if not already in dict as an active headline editor
        // if (!w) {
        //     w = new StringTextWrapper(
        //         this.c,
        //         `head-${1 + Object.keys(d).length}`
        //     );
        //     d[p.v.gnx] = w;
        //     w.setAllText(p.h);
        // }
        return w;

    }
    //@+node:felix.20221102232749.4: *3* NullTree.editLabel
    /**
     * Start editing p's headline.
     */
    public editLabel(p: Position, selectAll = false, selection?: any): [undefined, StringTextWrapper | undefined] {

        this.endEditLabel();
        if (p && p.__bool__()) {

            // ! LEOJS : Mimic from qt_tree

            const d = this.editWidgetsDict;

            let wrapper = d[p.v.gnx];

            if (!wrapper) {
                wrapper = new StringTextWrapper(
                    this.c,
                    'head-wrapper'
                );
                d[p.v.gnx] = wrapper;
                wrapper.setAllText(p.h);
            }

            // const wrapper = new StringTextWrapper(this.c, 'head-wrapper');
            const e = undefined;
            return [e, wrapper];
        }
        return [undefined, undefined];

    }
    //@+node:felix.20221102232749.5: *3* NullTree.printWidgets
    public printWidgets(): void {
        const d = this.editWidgetsDict;
        for (let key in d) {
            // keys are vnodes, values are StringTextWidgets.
            const w = d[key];
            g.pr('w', w, 'gnx', key);
        }
    }
    //@+node:felix.20221102232749.6: *3* NullTree.Drawing & scrolling
    public redraw(p?: Position): void {
        this.redrawCount += 1;
    }
    public redraw_now(p?: Position): void {
        this.redraw();
    }
    public redraw_after_contract(p: Position): void {
        this.redraw();
    }
    public redraw_after_expand(p: Position): void {
        this.redraw();
    }
    public redraw_after_head_changed(): void {
        this.redraw();
    }
    public redraw_after_select(p?: Position): void {
        this.redraw();
    }
    public scrollTo(p: Position): void {
        // pass
    }

    //@+node:felix.20221102232749.7: *3* NullTree.setHeadline
    /**
     * Set the actual text of the headline widget.
     *
     * This is called from the undo/redo logic to change the text before redrawing.
     */
    public setHeadline(p: Position, s: string): void {

        const w = this.edit_widget(p);
        if (w) {
            w.delete(0, w.getLastIndex());
            if (s.endsWith('\n') || s.endsWith('\r')) {
                s = s.substring(0, s.length - 1);
            }
            w.insert(0, s);
        } else {
            // * LEOJS : Not currently editing the headline
            // g.trace('-------------------- oops');
        }
    }

    //@-others

}
//@+node:felix.20221102232754.1: ** class StringTextWrapper
/**
 * A class that represents text as a Python string.
 */
export class StringTextWrapper {

    public c: Commands;
    public name: string;
    public ins: number;
    public sel: [number, number];
    public s: string;
    public supportsHighLevelInterface: boolean;
    public virtualInsertPoint: number;
    public widget: undefined;
    public leo_chapter: Chapter | undefined;
    public leo_p: Position | undefined;
    public leo_v: VNode | undefined;
    public leo_label_s: string | undefined;
    public leo_name: string | undefined;
    public leo_label: string | undefined;

    //@+others
    //@+node:felix.20221102232754.2: *3* stw.ctor
    constructor(c: Commands, name: string) {
        this.c = c;
        this.name = name;
        this.ins = 0;
        this.sel = [0, 0];
        this.s = '';
        this.supportsHighLevelInterface = true;
        this.virtualInsertPoint = 0;
        this.widget = undefined;  // This ivar must exist, and be None.
    }

    public toString(): string {
        return `<StringTextWrapper: ${this.name}>`;
    }

    /**
     * StringTextWrapper
     */
    public getName(): string {
        return this.name;  // Essential.
    }

    //@+node:felix.20221102232754.3: *3* stw.Clipboard
    public clipboard_clear(): void {
        g.app.gui.replaceClipboardWith('');
    }
    public async clipboard_append(s: string): Promise<void> {
        const s1 = await g.app.gui.getTextFromClipboard();
        g.app.gui.replaceClipboardWith(s1 + s);
        return;
    }

    //@+node:felix.20221102232754.4: *3* stw.Do-nothings
    // For StringTextWrapper.

    public disable(): void {
        // pass
    }
    public enable(enabled = true): void {
        // pass
    }
    public flashCharacter(i: number, bg = 'white', fg = 'red', flashes = 3, delay = 75): void {
        // pass
    }
    public getXScrollPosition(): number {
        return 0;
    }
    public getYScrollPosition(): number {
        return 0;
    }
    public see(i: number): void {
        // pass
    }
    public seeInsertPoint(): void {
        // pass
    }
    public setFocus(): void {
        // pass
    }
    public setStyleClass(name: string): void {
        // pass
    }
    public setXScrollPosition(i: number): void {
        // pass
    }
    public setYScrollPosition(i: number): void {
        // pass
    }

    //@+node:felix.20221102232754.5: *3* stw.Text
    //@+node:felix.20221102232754.6: *4* stw.appendText
    /**
     * StringTextWrapper
     */
    public appendText(s: string): void {

        this.s = this.s + g.toUnicode(s);  // defensive
        this.ins = this.s.length;
        this.sel = [this.ins, this.ins];

    }
    //@+node:felix.20221102232754.7: *4* stw.delete
    /**
     * StringTextWrapper.
     */
    public delete(i: number, j?: number): void {

        if (j === undefined) {
            j = i + 1;
        }
        // This allows subclasses to use this base class method.
        if (i > j) {
            [i, j] = [j, i];
        }
        const s = this.getAllText();
        this.setAllText(s.substring(0, i) + s.substring(j));
        // Bug fix: 2011/11/13: Significant in external tests.
        this.setSelectionRange(i, i, i);

    }
    //@+node:felix.20221102232754.8: *4* stw.deleteTextSelection
    /**
     * StringTextWrapper.
     */
    public deleteTextSelection(): void {
        let i;
        let j;
        [i, j] = this.getSelectionRange();
        this.delete(i, j);
    }
    //@+node:felix.20221102232754.9: *4* stw.get
    /**
     * StringTextWrapper.
     */
    public get(i: number, j?: number): string {

        if (j === undefined) {
            j = i + 1;
        }
        const s = this.s.substring(i, j);
        return g.toUnicode(s);

    }
    //@+node:felix.20221102232754.10: *4* stw.getAllText
    /**
     * StringTextWrapper.
     */
    public getAllText(): string {
        const s = this.s;
        return g.checkUnicode(s);
    }
    //@+node:felix.20221102232754.11: *4* stw.getInsertPoint
    /**
     * StringTextWrapper.
     */
    public getInsertPoint(): number {
        let i = this.ins;
        if (i === undefined) {
            if (this.virtualInsertPoint === undefined) {
                i = 0;
            } else {
                i = this.virtualInsertPoint;
            }
        }
        this.virtualInsertPoint = i;
        return i;
    }
    //@+node:felix.20221102232754.12: *4* stw.getLastIndex
    /**
     * Return the length of the self.s
     */
    public getLastIndex(): number {
        return this.s.length;
    }
    //@+node:felix.20221102232754.13: *4* stw.getSelectedText
    /**
     * StringTextWrapper.
     */
    public getSelectedText(): string {
        let i;
        let j;
        [i, j] = this.sel;
        const s = this.s.substring(i, j);
        return g.checkUnicode(s);
    }
    //@+node:felix.20221102232754.14: *4* stw.getSelectionRange
    /**
     * Return the selected range of the widget.
     */
    public getSelectionRange(sort = true): [number, number] {

        let sel = this.sel;
        let i;
        let j;
        if (sel.length === 2 && sel[0] >= 0 && sel[1] >= 0) {
            [i, j] = sel;
            if (sort && i > j) {
                sel = [j, i];  // Bug fix: 10/5/07
            }
            return sel;
        }
        i = this.ins;
        return [i, i];

    }
    //@+node:felix.20221102232754.15: *4* stw.hasSelection
    /**
     * StringTextWrapper.
     */
    public hasSelection(): boolean {
        let i;
        let j;
        [i, j] = this.getSelectionRange();
        return i !== j;
    }
    //@+node:felix.20221102232754.16: *4* stw.insert
    /**
     * StringTextWrapper.
     */
    public insert(i: number, s: string): void {
        console.log('StringTextWrapper: before insert', this.s);

        this.s = this.s.substring(0, i) + s + this.s.substring(i);
        i += s.length;
        this.ins = i;
        this.sel = [i, i];
        console.log('StringTextWrapper: after insert', this.s);
    }
    //@+node:felix.20221102232754.17: *4* stw.selectAllText
    /**
     * StringTextWrapper.
     */
    public selectAllText(insert?: number): void {
        this.setSelectionRange(0, this.s.length, insert);
    }
    //@+node:felix.20221102232754.18: *4* stw.setAllText
    /**
     * StringTextWrapper.
     */
    public setAllText(s: string): void {
        this.s = s;
        const i = this.s.length;
        this.ins = i;
        this.sel = [i, i];
    }
    //@+node:felix.20221102232754.19: *4* stw.setInsertPoint
    /**
     * StringTextWrapper.
     */
    public setInsertPoint(i: number, s?: string): void {
        this.virtualInsertPoint = i;
        this.ins = i;
        this.sel = [i, i];
    }
    //@+node:felix.20221102232754.20: *4* stw.setSelectionRange
    /**
     * StringTextWrapper.
     */
    public setSelectionRange(i: number, j: number, insert?: number): void {
        this.sel = [i, j];
        this.ins = insert === undefined ? j : insert;
    }
    //@+node:felix.20221102232754.21: *4* stw.toPythonIndexRowCol
    /**
     * StringTextWrapper.
     */
    public toPythonIndexRowCol(index: number): [number, number] {
        const s = this.getAllText();
        let row;
        let col;
        [row, col] = g.convertPythonIndexToRowCol(s, index);
        return [row, col];
    }
    //@-others

}

//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
