//@+leo-ver=5-thin
//@+node:felix.20211026230613.1: * @file src/core/leoUndo.ts
/**
 * Leo's undo/redo manager.
 * For the Theory of Operation, see Leo's appendices:
 * https://leo-editor.github.io/leo-editor/appendices.html
 */

//@+<< imports >>
//@+node:felix.20220104010834.1: ** << imports >>
import * as g from './leoGlobals';
import { new_cmd_decorator } from './decorators';
import { Position, VNode } from './leoNodes';
import { Commands } from './leoCommands';
import { StringTextWrapper } from './leoFrame';
//@-<< imports >>

/**
 * Command decorator for the Undoer class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'undoer']);
}


//@+others
//@+node:felix.20261113231808.1: ** class UndoBead
export class UndoBead {

    public c: Commands;
    public command_name: string;
    public old_p: Position;
    public redo_finishers: Array<() => void>;
    public redo_functions: Array<() => void>;
    public redraw_finishers: [() => void, () => void] | null;
    public undoType: string;
    public undo_finishers: Array<() => void>;
    public undo_functions: Array<() => void>;
    public undoer: Undoer;
    public w: StringTextWrapper | null;

    //@+others
    //@+node:felix.20261113231808.3: *3* UndoBeadconstructor
    constructor(undoer: Undoer) {

        const c = undoer.c;
        this.c = c;
        this.command_name = '';
        this.old_p = c.p.copy();
        this.redo_finishers = [];
        this.redo_functions = [];
        this.redraw_finishers = null;;
        this.undoType = '';  // Required. Set by u.set_command_name
        this.undo_finishers = [];
        this.undo_functions = [];
        this.undoer = undoer;
        this.w = null;

    }

    //@+node:felix.20261113231808.4: *3* undoBead.add_redraw_finishers
    public add_redraw_finishers(
        redo_redraw_finisher: () => void,
        undo_redraw_finisher: () => void,
    ): void {

        if (this.redraw_finishers != null) {
            const message = `u.redraw_finishers already exist: g.callers()=${g.callers()}\n`;
            if (g.unitTesting) {
                g.assert(false, message);
            }
            g.trace();
        }
        this.redraw_finishers = [redo_redraw_finisher, undo_redraw_finisher];
    }

    //@+node:felix.20261113231808.5: *3* undoBead.add_recolor
    public add_recolor(new_p: Position, old_p: Position): void {

        const c = this.c;
        new_p = new_p.copy();
        old_p = old_p.copy();

        const recolor_redoer = () => {
            c.frame.scanForTabWidth(new_p);
            c.recolor(new_p);
        };

        const recolor_undoer = () => {
            c.frame.scanForTabWidth(old_p);
            c.recolor(old_p);
        };

        this.add_finishers(recolor_redoer, recolor_undoer);
    }
    //@+node:felix.20261113231808.6: *3* undoBead.add_redraw
    /**
     * Add finishers that will call c.redraw.
     * The caller chooses the final redraw for the entire command.
     */
    public add_redraw(new_p: Position, old_p: Position): void {

        const c = this.c;
        new_p = new_p.copy();
        old_p = old_p.copy();

        const redraw_redoer = () => {
            c.redraw(new_p);
        };

        const redraw_undoer = () => {
            c.redraw(old_p);
        };

        this.add_redraw_finishers(redraw_redoer, redraw_undoer);
    }

    //@+node:felix.20261113231808.7: *3* undoBead.add_redraw_and_edit
    public add_redraw_and_edit(new_p: Position, old_p: Position): void {

        const c = this.c;
        new_p = new_p.copy();
        old_p = old_p.copy();

        const redraw_and_edit_redoer_finisher = () => {
            c.redrawAndEdit(new_p, true);
        };

        const redraw_and_edit_undoer_finisher = () => {
            c.redrawAndEdit(old_p, true);
        };

        this.add_redraw_finishers(
            redraw_and_edit_redoer_finisher,
            redraw_and_edit_undoer_finisher,
        );
    }

    //@+node:felix.20261113231808.8: *3* undoBead.add_redraw_after_head_changed
    public add_redraw_after_head_changed(): void {

        const c = this.c;

        // A single finisher suffices.
        const redraw_after_head_changed_finisher = () => {
            c.redraw_after_head_changed();
        };

        this.add_redraw_finishers(
            redraw_after_head_changed_finisher,
            redraw_after_head_changed_finisher
        );
    }

    //@+node:felix.20261113231808.9: *3* UndoBead.redo
    public redo(): void {
        const c = this.c;
        for (const f of this.redo_functions) {
            f();
        }
        if (this.redraw_finishers && this.redraw_finishers.length) {
            this.redraw_finishers[0]();
        }
        for (const f of this.redo_finishers) {
            f();
        }

        c.setChanged();  // Elegant!
    }

    //@+node:felix.20261113231808.11: *3* UndoBead.undo
    public undo(): void {
        const c = this.c;
        for (const f of this.undo_functions) {
            f();
        }
        if (this.redraw_finishers && this.redraw_finishers.length) {
            this.redraw_finishers[0]();
        }
        for (const f of this.undo_finishers) {
            f();
        }

        // A save may have occurred since this bead was created.
        c.setChanged();
    }

    //@+node:felix.20261113231808.10: *3* UndoBead.add_helpers & add_finishers
    /**
     * Append the helpers (in correct order!) to the undo/redo lists.
     */
    public add_helpers(redo_function: () => void, undo_function: () => void): void {
        if (this.undoer.capture_level) {
            return;  // The enclosing snapshot records the complete operation.
        }
        this.redo_functions.push(redo_function);
        this.undo_functions.unshift(undo_function);  // Execute in reverse order.
    }

    /**
     * Append the finishers (in correct order!) to the undo/redo lists.
     */
    public add_finishers(redo_finisher: () => void, undo_finisher: () => void): void {
        if (this.undoer.capture_level) {
            return;
        }
        this.redo_finishers.push(redo_finisher);
        this.undo_finishers.push(undo_finisher);  // Execute in given order.
    }

    //@-others

    public toString(): string {
        return `UndoBead: ${this.command_name || '<no command_name>'}`;
    }

}

//@+node:felix.20211026230613.4: ** class Undoer
/**
 * A class that implements unlimited undo and redo.
 */
export class Undoer {

    public c: Commands;
    public p: Position | undefined;

    public max_undo_stack_size: number;

    public bead: number; // Index of the present bead: -1:len(beads)
    public beads: UndoBead[]; // List of undo nodes.
    public capture_level: number;
    public undoType: string;
    public last_undoable_command_name = "";  // Name of last undoable command.

    public groupCount: number = 0;

    public redoMenuLabel: string = "Can't Redo";
    public undoMenuLabel: string = "Can't Undo";
    public realRedoMenuLabel: string = "Can't Redo";
    public realUndoMenuLabel: string = "Can't Undo";
    public undoing: boolean = false; // True if executing an Undo command.
    public redoing: boolean = false; // True if executing a Redo command.
    public inHead!: boolean;

    public node_captures: Set<VNode>;
    public undoBead: UndoBead | undefined;
    public undoBeadLevel: number;

    //@+others
    //@+node:felix.20261113233748.1: *3* u.constructor
    constructor(c: Commands) {
        this.c = c;
        // State.
        this.bead = -1;  // Index of the present bead.
        this.beads = [];  // List of undo nodes.
        this.capture_level = 0;
        this.groupCount = 0;
        this.inHead = false;
        this.max_undo_stack_size = c.config.getInt('max-undo-stack-size') || 0;
        this.node_captures = new Set<VNode>();
        // this.p = cast(Position, None)
        this.realRedoMenuLabel = "Can't Redo";
        this.realUndoMenuLabel = "Can't Undo";
        this.redoMenuLabel = "Can't Redo";
        this.redoing = false;
        this.undoBead = undefined;
        this.undoBeadLevel = 0;
        this.undoMenuLabel = "Can't Undo";
        this.undoType = "Can't Undo";
        this.undoing = false;
    }

    //@+node:felix.20261113233806.1: *3* u: Entries
    //@+node:felix.20261113233806.2: *4* u.canRedo & canUndo
    // Translation does not affect these routines.

    public canRedo(): boolean {
        const u = this;
        return u.redoMenuLabel !== "Can't Redo";
    }

    public canUndo(): boolean {
        const u = this;
        return u.undoMenuLabel !== "Can't Undo";
    }

    //@+node:felix.20261113233806.3: *4* u.clearAndWarn
    /**
     * Clear all undo state, but *only* if we aren't in an undo-related `with` block.
     */
    public clearAndWarn(command_name: string): void {

        const u = this;

        if (u.undoBeadLevel === 0) {  // PR #5025
            // We aren't in undo code.
            u.clearUndoState()
            // This message would be annoying.
            // g.es_print_unique_message(f"{command_name} is not undoable")
        }
    }

    //@+node:felix.20261113233806.4: *4* u.clearUndoState
    /**
     * Clears the entire Undo state.
     */
    public clearUndoState(): void {
        const u = this;
        u.setRedoType("Can't Redo");
        u.setUndoType("Can't Undo");
        u.beads = [];
        u.bead = -1;
    }

    //@+node:felix.20261113233806.5: *4* u.redo

    @cmd('redo', 'Redo the operation undone by the last undo.')
    public redo(): void {

        const u = this;
        const c = u.c;
        if (!c.p || !c.p.v) {
            return;
        }
        // End editing *before* getting state.
        c.endEditing();
        if (!u.canRedo()) {
            return;
        }
        const obj = u.getBead(u.bead + 1);
        if (!obj) {
            return;
        }

        // Init status.
        u.redoing = true;
        u.groupCount = 0;

        // Dispatch.
        try {
            if (obj instanceof UndoBead) {
                obj.redo();
            } else {
                g.es_print_unique_message(`no redo helper for ${u.undoType}`);
            }
            c.checkOutline();
        } finally {
            u.redoing = false;
        }
        u.bead += 1;
        u.setUndoTypes();
    }

    //@+node:felix.20261113233806.6: *4* u.undo

    @cmd('undo', 'Undo the operation described by the undo parameters.')
    public undo(): void {

        const u = this;
        const c = u.c;
        if (!c.p || !c.p.v) {
            g.trace('no current position');
            return;
        }

        // End editing *before* getting state.
        c.endEditing();
        if (!u.canUndo()) {
            return;
        }
        const obj = u.getBead(u.bead + 1);
        if (!obj) {
            return;
        }

        // Init status.
        u.undoing = true;
        u.groupCount = 0;

        // Dispatch.
        try {
            if (obj instanceof UndoBead) {
                obj.undo();
            } else {
                g.es_print_unique_message(`no undo helper for ${u.undoType}`);
            }
            c.checkOutline();
        } finally {
            u.undoing = false;
        }
        u.bead -= 1;
        u.setUndoTypes();


    }
    //@+node:felix.20261113233806.7: *4* u: actions
    //@+node:felix.20261113233806.8: *5* u.change_headline
    /**
     * Change a headline and preserve directives, dirty bits and editor state.
     *
     * Called *only* from LeoTree.onHeadChanged
     *
     * This method should *not* have an @contextmanager decorator:
     * it is never called from within other @contextmanager methods.
     */
    public change_headline(p: Position, new_h: string, ch = ''): void {

        const u = this;
        const b = u._require_bead();
        const c = u.c;
        const old_h = p.h;
        if (old_h == new_h) {
            return;
        }
        p = p.copy();

        const update = (head: string) => {
            c.p = p;
            p.initHeadString(head);
            p.setDirty();  // Call p.v.setAllAncestorAtFileNodesDirty()
            c.frame.tree.setHeadline(p, head);
        };

        // Do the action.
        // Leave the live editor alone: it may contain multiline abbreviation text.
        p.initHeadString(new_h);
        p.setDirty();  // Call p.v.setAllAncestorAtFileNodesDirty()
        c.frame.scanForTabWidth(p);
        c.recolor(p);
        g.doHook('headkey2', { c: c, p: p, ch: ch, changed: true });

        // Add helpers

        const change_headline_redoer = () => {
            update(new_h);
        }

        const change_headline_undoer = () => {
            update(old_h);
        }

        b.add_helpers(change_headline_redoer, change_headline_undoer);
        b.add_recolor(p, p);

    }

    //@+node:felix.20261113233806.9: *5* u.clone_node
    /**
     * Clone p, returning and selecting the new occurrence.
     */
    public clone_node(p: Position): Position {

        const u = this;
        const b = u._require_bead();
        const c = u.c;
        const old_p = p.copy();
        const clone = p.clone();

        // Do the action.
        clone.setDirty();
        c.p = clone;
        const clone_p = clone.copy();
        clone_p.setAllAncestorAtFileNodesDirty();

        const clone_redoer = () => {
            clone_p._linkAfter(old_p);
            clone_p.setDirty();
            c.p = clone_p;
        };

        const clone_undoer = () => {
            clone_p.doDelete(old_p);
            c.p = old_p;
        };

        b.add_helpers(clone_redoer, clone_undoer);
        return clone;
    }

    //@+node:felix.20261113233806.10: *5* u.delete_node
    /**
     * Delete p without scheduling a redraw; retain its original links.
     */
    public delete_node(p: Position): void {

        const u = this;
        const b = u._require_bead();
        const c = u.c;
        const old_p = p.copy();
        const [old_back, old_parent] = [p.back(), p.parent()];
        const new_p = p.hasVisBack(c) ? p.visBack(c) : p.next();
        if (!new_p || !new_p.v) {
            g.trace("Can not delete the outline's only node");
            return;
        }
        // Do the action.
        old_p.doDelete(new_p);
        c.p = new_p;
        new_p.setDirty();
        c.p.setAllAncestorAtFileNodesDirty();
        c.checkOutline();

        const delete_node_redoer = () => {
            old_p.doDelete();
            c.p = new_p;
        };
        const delete_node_undoer = () => {
            if (old_back) {
                old_p._linkAfter(old_back);
            } else if (old_parent) {
                old_p._linkAsNthChild(old_parent, 0);
            } else {
                old_p._linkAsRoot();
            }
            old_p.setDirty();
            c.p = old_p;
        };

        if (!u.node_captures.has(old_p.v)) {
            b.add_helpers(delete_node_redoer, delete_node_undoer);
        }
    }

    //@+node:felix.20261113233806.11: *5* u.insert_node
    /**
     * Insert a node once; redo relinks that same vnode, including its subtree.
     */
    public insert_node(
        p: Position,
        as_child = false,
        index: number | undefined = undefined,
        before = false,
    ): Position {

        const u = this;
        const b = u._require_bead();
        const c = u.c;
        const old_p = p.copy();
        let new_p: Position;

        if (before) {
            new_p = p.insertBefore()
            // Inserting before p changes p's original index.
        } else if (
            as_child || p.hasChildren() && p.isExpanded() || c.hoistStack && p.__eq__(c.hoistStack[-1].p)
        ) {
            if (index == null) {
                const insert_at_end = c.config.getBool('insert-new-nodes-at-end');
                index = insert_at_end ? p.numberOfChildren() : 0;
            }
            new_p = p.insertAsNthChild(index);
        } else {
            new_p = p.insertAfter();
        }

        // Do the action.
        new_p.setDirty();
        c.p = new_p;
        const parent = new_p.parent();
        const back = new_p.back();
        const saved = new_p.copy();
        new_p.setAllAncestorAtFileNodesDirty();

        const insert_node_redoer = () => {
            if (back && back.v) {
                saved._linkAfter(back);
            } else if (parent && parent.v) {
                saved._linkAsNthChild(parent, 0);
            } else {
                saved._linkAsRoot();
            }
            saved.setDirty();
            c.p = saved;
        };
        const insert_node_undoer = () => {
            saved.doDelete();
            old_p.setAllAncestorAtFileNodesDirty();
            c.p = old_p;
        };
        b.add_helpers(insert_node_redoer, insert_node_undoer);
        g.doHook('create-node', { c: c, p: new_p });
        return new_p;

    }

    //@+node:felix.20261113233806.12: *5* u.set_body
    /**
     * Change p.b
     */
    public set_body(
        new_p: Position,
        new_body: string,
        old_body: string | null = null,
    ): void {

        const u = this;
        const b = u._require_bead();
        const c = u.c;
        const w = c.frame.body.wrapper;

        if (!g.isTextWrapper(w)) {
            g.error(`Not a text wrapper: ${g.callers()}`);
            return;
        }

        new_p = new_p.copy();
        if (old_body == null) {
            old_body = new_p.b;
        }
        if (old_body == new_body) {
            return;
        }

        /**
         * Update p's data.
         */
        const set_body_update = (p: Position, body: string) => {
            // Set p.v.b, not p.b! The p.b setter clears the selection!
            p.v.b = body;
            p.setDirty();
            const val = p.computeIcon();
            if (!("iconVal" in p.v) || val != p.v.iconVal) {
                p.v.iconVal = val;
            }
            c.recolor(p);  // Only for QScintilla.
            p.setAllAncestorAtFileNodesDirty();
        };

        // Do the action!
        set_body_update(new_p, new_body);

        if (c.p.__eq__(new_p) && w.getAllText() != new_body) {
            const [sel, ins] = [w.getSelectionRange(), w.getInsertPoint()];
            w.setAllText(new_body);
            w.setSelectionRange(...sel, ins);
        }
        // Add helpers. Use distinct names for debugging.

        const set_body_redoer = () => {
            set_body_update(new_p, new_body);
        };
        const set_body_undoer = () => {
            set_body_update(new_p, old_body);
        };
        if (!u.node_captures.has(new_p.v)) {
            b.add_helpers(set_body_redoer, set_body_undoer);
        }
    }

    //@+node:felix.20261113233806.13: *5* u.set_command_name
    public set_command_name(command_name: string): void {
        const u = this;
        const b = u._require_bead();
        g.assert(b instanceof UndoBead, b.toString());
        if (u.undoBeadLevel === 1) {
            b.command_name = command_name;
            b.undoType = command_name;
        }
        // Menu labels are updated when the completed bead is pushed.
    }

    //@+node:felix.20261113233806.14: *4* u: contexts
    //@+node:felix.20261113233806.15: *5* u.change_node
    /* 
    @contextmanager
    def change_node(self, p: Position, command_name: str) -> Generator[Undoer]:
        """
        Handle doing, undoing, and redoing changes to one node.

        u.restore_node does the heavy lifting.
        """
        u = self
        c = u.c
        if u.undoing or u.redoing:
            yield u
            return
        if not c.changed:
            c.setChanged()
        with u:
            u.set_command_name(command_name)
            if u.capture_level > 0 or p.v in u.node_captures:
                yield u
                return
            old_p = c.p
            old_state = u.capture_node(p.v)
            old_ui = u.capture_ui()
            u.node_captures.add(p.v)
            if old_p.v != c.p.v:
                message = f"u.change_node changed p.v: {p.v.h=} {g.callers()=}"
                g.es_print_unique_message(message)
            try:
                yield u
            finally:
                u.node_captures.remove(p.v)
                new_p = c.p
                new_state = u.capture_node(p.v)
                if old_state != new_state:
                    u._redraw(new_p)  # PR #5027 Redraw only if node has changed.
                    new_ui = u.capture_ui()

                    def change_node_redoer() -> None:
                        u.restore_node(p.v, new_state)

                    def change_node_undoer() -> None:
                        u.restore_node(p.v, old_state)

                    u.undoBead.add_helpers(change_node_redoer, change_node_undoer)

                    def change_node_ui_redoer() -> None:
                        u._redraw(new_p)
                        u.restore_ui(new_ui)

                    def change_node_ui_undoer() -> None:
                        u._redraw(old_p)
                        u.restore_ui(old_ui)

                    u.undoBead.add_finishers(change_node_ui_redoer, change_node_ui_undoer)

     */
    //@+node:felix.20261113233806.16: *5* u.change_outline & helpers
    /* 
    @contextmanager
    def change_outline(self, command_name: str) -> Generator[Undoer]:
        """
        Handle doing, undoing, and redoing changes throughout an outline.

        Prefer u.change_node for actions affecting only a single node.

        This method scans the entire outline, but creates minimal undo/redo data.
        Despite the scan, this method is fast, taking about 0.04 sec. to scan LeoPyRef.leo.

        u.restore_node does the heavy lifting of restoring all data.
        """
        u = self
        c = u.c
        if u.undoing or u.redoing:
            yield u
            return
        if not c.changed:
            c.setChanged()
        with u:
            u.set_command_name(command_name)
            if u.capture_level > 0:
                yield u
                return
            assert not u.node_captures, "Use change_outline outside change_node for bulk edits"
            old_p = c.p
            old_state = u.capture_outline()
            old_ui = u.capture_ui()
            u.capture_level += 1
            try:
                yield u
            finally:
                u.capture_level -= 1
                new_p = c.p  # PR #5005
                u._redraw(new_p)  # PR #5005: calls new_p.setDirty()
                new_state = u.capture_outline()
                old_delta, new_delta = {}, {}
                for v in old_state.keys() | new_state.keys():
                    old = old_state.get(v)
                    new = new_state.get(v)
                    if old is None:
                        # Preserve the detached subtree's internal links on undo.
                        old = (*new[:2], tuple(p for p in new[2] if p not in old_state))  # type:ignore
                    if new is None:
                        new = (*old[:2], tuple(p for p in old[2] if p not in new_state))
                    if old != new:
                        old_delta[v], new_delta[v] = old, new
                if old_delta:
                    new_ui = u.capture_ui()

                    def change_outline_redoer() -> None:
                        u.restore_outline(new_delta)

                    def change_outline_undoer() -> None:
                        u.restore_outline(old_delta)

                    u.undoBead.add_helpers(change_outline_redoer, change_outline_undoer)

                    def change_outline_ui_redoer() -> None:
                        u.restore_ui(new_ui)
                        u._redraw(new_p)  # Calls new_p.setDirty()

                    def change_outline_ui_undoer() -> None:
                        u.restore_ui(old_ui)
                        u._redraw(old_p)  # Calls old_p.setDirty()

                    u.undoBead.add_finishers(change_outline_ui_redoer, change_outline_ui_undoer)

     */
    //@+node:felix.20261113233806.17: *6* u.capture_outline
    public capture_outline(): Map<VNode, [any, VNode[], VNode[]]> {
        const u = this;
        const c = u.c;
        const result = new Map<VNode, [any, VNode[], VNode[]]>();
        const pending = [c.hiddenRootNode];
        while (pending.length > 0) {
            const v = pending.pop()!;
            if (result.has(v)) {
                continue;
            }
            result.set(v, [u.capture_node(v), Array.from(v.children), Array.from(v.parents)]);
            pending.push(...v.children);
        }
        return result;
    }

    //@+node:felix.20261113233806.18: *6* u.restore_outline
    /**
     * Restore every link before touching content or propagating dirty bits.
     */
    public restore_outline(delta: Map<VNode, [any, VNode[], VNode[]]>): void {
        const u = this;
        for (const v of delta.keys()) {
            v.setAllAncestorAtFileNodesDirty();
        }
        for (const [v, [, children, parents]] of delta.entries()) {
            v.children = Array.from(children);
            v.parents = Array.from(parents);
        }
        for (const [v, [state]] of delta.entries()) {
            u.restore_node(v, state);
        }
    }

    //@+node:felix.20261113233806.19: *5* u.move_node
    /* 
    @contextmanager
    def move_node(self, p: Position, command_name: str) -> Generator[Undoer]:
        """
        Handle doing, undoing, and redoing moving a node.

        The internal move function does the heavy lifting.
        """
        u = self
        c = u.c
        if u.undoing or u.redoing:
            yield u
            return
        if not c.changed:
            c.setChanged()
        with u:
            u.set_command_name(command_name)
            if u.capture_level > 0:
                yield u
                return
            old_p, old_ui = p.copy(), u.capture_ui()
            try:
                yield u
            finally:
                new_p = p.copy()
                if old_p.v != c.p.v:
                    message = f"u.move_node changed p.v: {p.v.h=} {g.callers()=}"
                    g.es_print_unique_message(message)
                if old_p != new_p:
                    new_ui = u.capture_ui()
                    u._redraw(new_p)  # PR #5005: calls new_p.setDirty()

                    def move(source: Position, target: Position) -> None:
                        source.v._cutLink(source.childIndex(), source._parentVnode())
                        target.v._addLink(target.childIndex(), target._parentVnode())
                        # These call p.v.setAllAncestorAtFileNodesDirty()
                        source.setDirty()
                        target.setDirty()

                    def move_position_redoer() -> None:
                        move(old_p, new_p)

                    def move_position_undoer() -> None:
                        move(new_p, old_p)

                    u.undoBead.add_helpers(move_position_redoer, move_position_undoer)

                    def restore_ui_redoer() -> None:
                        u.restore_ui(new_ui)
                        u._redraw(new_p)

                    def restore_ui_undoer() -> None:
                        u.restore_ui(old_ui)
                        u._redraw(old_p)

                    u.undoBead.add_finishers(restore_ui_redoer, restore_ui_undoer)

     */
    //@+node:felix.20261113233806.20: *5* u:common context helpers
    //@+node:felix.20261113233806.21: *6* u.capture_node
    /**
     * Record everything needed by u.restore_node.
     */
    public capture_node(v: VNode): [string, string, boolean, any] {
        return [v.h, v.b, v.isMarked(), JSON.parse(JSON.stringify((v.u)))];
    }

    //@+node:felix.20261113233806.22: *6* u.capture_ui
    public capture_ui(): [Position, [number, number], number, number] {
        const c = this.c;
        const w = c.frame.body.wrapper;
        return [c.p.copy(), w.getSelectionRange(), w.getInsertPoint(), w.getYScrollPosition()];
    }

    //@+node:felix.20261113233806.23: *6* u.restore_node
    /**
     * 
     * Restore everything related to the given VNode:
     * - dirty bits, including calling setAllAncestorAtFileNodesDirty.
     * - marked bits.
     * - uAs.
     * - v.b
     * - v.h
     */
    public restore_node(v: VNode, state: [string, string, boolean, any]): void {
        const [head, body, marked, ua] = state;
        const head_changed = v.h !== head;
        v.initHeadString(head);
        v.setBodyString(body);
        v.u = JSON.parse(JSON.stringify(ua));
        if (marked) {
            v.setMarked();
        } else {
            v.clearMarked();
        }
        const val = v.computeIcon();
        if (!("iconVal" in v) || val !== v.iconVal) {
            v.iconVal = val;
        }
        v.setAllAncestorAtFileNodesDirty();
        v.setDirty();

        // Keep the headline editor from restoring stale text at the next redraw.
        if (head_changed) {
            const c = this.c;
            for (const p of c.vnode2allPositions(v)) {
                c.frame.tree.setHeadline(p, head);
            }
        }
    }

    //@+node:felix.20261113233806.24: *6* u.restore_ui
    public restore_ui(state: [Position, [number, number], number, number]): void {
        const c = this.c;
        const [p, sel, ins, scroll] = state;
        c.p = p;
        c.frame.scanForTabWidth(c.p);
        c.recolor(c.p);
        const w = c.frame.body.wrapper;
        w.setSelectionRange(...sel, ins);
        w.setYScrollPosition(scroll);
    }

    //@+node:felix.20261113233806.25: *4* u: redrawers & finishers
    //@+node:felix.20261113233806.26: *5* u._redraw
    /**
     * Redraw now and choose the command's single undo/redo redraw.
     */
    private _redraw(p: Position): void {
        const u = this;
        const c = u.c;
        const w = c.frame.body.wrapper;
        // Ignore redrawers in inner levels.
        if (u.undoBeadLevel > 1) {
            return;
        }
        p.setDirty();  // Call p.v.setAllAncestorAtFileNodesDirty()
        const preserve_body = p.__eq__(c.p) && p.b === w.getAllText();
        let sel: [number, number], ins: number, scroll: number;
        if (preserve_body) {
            [sel, ins, scroll] = [w.getSelectionRange(), w.getInsertPoint(), w.getYScrollPosition()];
        }
        // c.updateSyntaxColorer(p); // Not used in LeoJS
        c.recolor();
        c.redraw(p);
        if (preserve_body) {
            w.setSelectionRange(...sel!, ins!);
            w.setYScrollPosition(scroll!);
        }
    }

    //@+node:felix.20261113233806.27: *5* u.redraw_after_head_changed
    /**
     * Refresh headlines now and after undo/redo.
     */
    public redraw_after_head_changed(): void {
        const u = this;
        const c = u.c;
        if (u.undoBeadLevel > 1) {
            return;
        }
        if (!c.changed) {
            c.setChanged();
        }
        c.p.setDirty();
        c.redraw_after_head_changed();
        u.undoBead!.add_redraw_after_head_changed();
    }

    //@+node:felix.20261113233806.28: *5* u.redraw_and_edit
    /**
     * Redraw and edit now and after undo/redo.
     */
    public redraw_and_edit(new_p: Position): void {
        const u = this;
        const c = u.c;
        u._require_bead();
        if (u.undoBeadLevel > 1) {
            return;
        }
        if (!c.changed) {
            c.setChanged();
        }
        c.p.setDirty();
        c.redrawAndEdit(new_p, true);
        u.undoBead!.add_redraw_and_edit(new_p, u.undoBead!.old_p);
    }

    //@+node:felix.20261113233810.1: *3* u: Helpers
    //@+node:felix.20261113233810.2: *4* u.__enter__ and __exit__
    /* 
    def __enter__(self) -> Self:
        """Compose nested operations into one bead, published on outermost exit."""
        u = self
        if u.undoBeadLevel == 0:
            u.undoBead = UndoBead(u)
        u.undoBeadLevel += 1
        assert u.undoBead
        return u

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: object,
        traceback: TracebackType | None,
    ) -> None:
        u = self
        b = u.undoBead
        assert b
        u.undoBeadLevel -= 1
        if u.undoBeadLevel:
            return
        u.undoBead = None
        if b.undo_functions and not (u.undoing or u.redoing):
            if not b.command_name:
                raise AssertionError("Missing call to u.set_command_name")
            # Record partial mutations even if the command raised an exception.
            u.pushBead(b)

     */
    //@+node:felix.20261113233810.3: *4* u._require_bead
    /**
     * Reject helper calls outside a context before any mutation occurs.
     */
    private _require_bead(): UndoBead {
        const u = this;
        if (!(u.undoBead instanceof UndoBead)) {
            throw new Error("Undo helper requires 'with c.undoer'");
        }
        return u.undoBead;
    }

    //@+node:felix.20261113233810.4: *4* u.cutStack
    public cutStack(): void {
        const u = this;
        const n = u.max_undo_stack_size;
        if (u.bead >= n && n > 0) {
            // This works regardless of how many items appear after bead n.
            u.beads = u.beads.slice(-n);
            u.bead = n - 1;
        }
    }

    //@+node:felix.20261113233810.5: *4* u.getBead
    /**
     * Set Undoer ivars from the bead at the top of the undo stack.
     */
    public getBead(n: number): UndoBead | null {
        const u = this;
        if (n < 0 || n >= u.beads.length) {
            return null;
        }
        return u.beads[n];
    }

    //@+node:felix.20261113233810.6: *4* u.peekBead
    public peekBead(n: number): UndoBead | null {
        const u = this;
        if (n < 0 || n >= u.beads.length) {
            return null;
        }
        return u.beads[n];
    }

    //@+node:felix.20261113233810.7: *4* u.pushBead
    public pushBead(bead: UndoBead): void {
        const u = this;
        u.bead += 1;
        u.beads.splice(u.bead, u.beads.length - u.bead, bead);
        u.setUndoTypes();
    }

    //@+node:felix.20261113233810.8: *4* u.redoMenuName, undoMenuName
    public redoMenuName(name: string): string {
        if (name.startsWith("Can't Redo")) {
            return name;
        }
        return "Redo " + name;
    }

    public undoMenuName(name: string): string {
        if (name.startsWith("Can't Undo")) {
            return name;
        }
        return "Undo " + name;
    }

    //@+node:felix.20261113233810.9: *4* u.setRedoType
    // These routines update both the ivar and the menu label.

    // typescript implementation
    public setRedoType(theType: string): void {
        const u = this;
        const frame = u.c.frame;
        if (typeof theType !== "string") {
            g.trace(`oops: expected string for command, got ${theType}`);
            g.trace(g.callers());
            theType = "<unknown>";
        }
        const name = u.redoMenuName(theType);

        // * Python code to adapt later *
        // const menu = frame.menu.getMenu("Edit");
        // if (name !== u.redoMenuLabel) {
        //     const realLabel = frame.menu.getRealMenuName(name);
        //     let underline;
        //     if (realLabel === name) {
        //         underline = name.startsWith("Can't") ? -1 : 0;
        //     } else {
        //         underline = realLabel.indexOf("&");
        //     }
        //     const finalLabel = realLabel.replace("&", "");
        //     frame.menu.setMenuLabel(menu, u.realRedoMenuLabel, finalLabel, underline);
        //     u.redoMenuLabel = name;
        //     u.realRedoMenuLabel = finalLabel;
        // }
        u.redoMenuLabel = name;
        u.realRedoMenuLabel = name; // finalLabel;
    }

    //@+node:felix.20261113233810.10: *4* u.setUndoType
    public setUndoType(theType: string): void {
        const u = this;
        const frame = u.c.frame;
        if (typeof theType !== "string") {
            g.trace(`oops: expected string for command, got ${theType}`);
            g.trace(g.callers());
            theType = "<unknown>";
        }
        const name = u.undoMenuName(theType);

        // * Python code to adapt later *
        // const menu = frame.menu.getMenu("Edit");
        // if name != u.undoMenuLabel:
        //     # Update menu using old name.
        //     realLabel = frame.menu.getRealMenuName(name)
        //     if realLabel == name:
        //         underline = -1 if g.match(name, 0, "Can't") else 0
        //     else:
        //         underline = realLabel.find("&")
        //     realLabel = realLabel.replace("&", "")
        //     frame.menu.setMenuLabel(menu, u.realUndoMenuLabel, realLabel, underline=underline)
        //     u.undoType = theType
        //     u.undoMenuLabel = name
        //     u.realUndoMenuLabel = realLabel
        u.undoMenuLabel = name;
        u.realUndoMenuLabel = name; // finalLabel;
    }

    //@+node:felix.20261113233810.11: *4* u.setUndoTypes
    public setUndoTypes(): void {
        const u = this;
        if (u.peekBead(u.bead)) {
            u.setUndoType(u.peekBead(u.bead)!.undoType);
        } else {
            u.setUndoType("Can't Undo");
        }
        if (u.peekBead(u.bead + 1)) {
            u.setRedoType(u.peekBead(u.bead + 1)!.undoType);
        } else {
            u.setRedoType("Can't Redo");
        }
        u.cutStack();
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
