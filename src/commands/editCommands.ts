//@+leo-ver=5-thin
//@+node:felix.20220503003653.1: * @file src/commands/editCommands.ts
import * as g from '../core/leoGlobals';
import { new_cmd_decorator, command } from '../core/decorators';
import { Position, VNode } from '../core/leoNodes';
import { Commands } from '../core/leoCommands';
import { Bead } from '../core/leoUndo';
import { StringTextWrapper } from '../core/leoFrame';
import { BaseEditCommandsClass } from './baseCommands';

//@+others
//@+node:felix.20220503223721.1: ** editCommands.cmd (decorator)
/**
 * Command decorator for the editCommandsClass class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'editCommands']);
}
//@+node:felix.20220504203112.1: ** class TopLevelEditCommands
export class TopLevelEditCommands {
    //@+others
    //@+node:felix.20220504203200.2: *3* @g.command('mark-node-and-parents')
    @command('mark-node-and-parents', 'Mark the node and all its parents.')
    public mark_node_and_parents(this: Commands): Position[] {
        const c: Commands = this;
        const changed: Position[] = [];
        const tag = 'mark-node-and-parents';
        if (!c) {
            return changed;
        }
        const u = c.undoer;
        for (let parent of c.p.self_and_parents()) {
            if (!parent.isMarked()) {
                if (!changed.length) {
                    u.beforeChangeGroup(c.p, tag);
                }
                const bunch = u.beforeMark(parent, 'mark');
                parent.setMarked();
                parent.setDirty();
                u.afterMark(parent, 'mark', bunch);
                changed.push(parent.copy());
            }
        }
        if (changed.length) {
            u.afterChangeGroup(c.p, tag);
            c.setChanged();
            c.redraw();
        }
        return changed;
    }
    //@+node:felix.20230902164359.1: *3* @g.command('promote-section-definition')
    @command(
        'promote-section-definition',
        'c.p must be a section definition node and an ancestor must contain a reference. ' +
        'Replace a section reference in an ancestor by c.p.b and delete c.p.'
    )
    public promote_section_definition(this: Commands): void {

        const c: Commands = this;
        const tag = 'promote-section-definition';
        if (!c) {
            return;
        }

        c.endEditing();
        const u = c.undoer;
        const h = c.p.h.trim();
        const ref_s = h;
        if (!(h.endsWith('>>') && h.startsWith('<<'))) {
            g.es_print('Not a section definition:', c.p.h);
            return;
        }
        let found = false;
        let w_parent: Position;
        for (const i_parent of c.p.parents()) {
            if (i_parent.b.includes(ref_s)) {
                w_parent = i_parent;
                found = true;
                break;
            }
        }
        if (!found) {
            g.es_print('Reference not found:', ref_s);
            return;
        }

        // Start the undo group.
        const ref_p: Position = w_parent!;
        u.beforeChangeGroup(c.p, tag);

        // Change ref_p.b.
        const bunch1 = u.beforeChangeBody(ref_p);
        const new_ref_lines = [];
        for (const line of g.splitLines(ref_p.b)) {
            if (line.trim() === ref_s) {
                new_ref_lines.push(...g.splitLines(c.p.b));
            } else {
                new_ref_lines.push(line);
            }
        }
        ref_p.b = new_ref_lines.join('');
        u.afterChangeBody(ref_p, 'change-body', bunch1);

        // Delete and select ref_p.
        const bunch2 = u.beforeDeleteNode(c.p);
        c.p.doDelete(ref_p);
        u.afterDeleteNode(ref_p, 'delete-node', bunch2);
        c.selectPosition(ref_p);

        // Finish the group.
        u.afterChangeGroup(c.p, tag);
        c.setChanged();
        c.redraw(ref_p);

    }
    //@+node:felix.20230708211842.1: *3* @g.command('merge-node-with-next-node')
    @command(
        'merge-node-with-next-node',
        'Merge p.b into p.next().b and delete p, *provided* that p has no children. ' +
        "Undo works, but redo doesn't: probably a bug in the u.before/AfterChangeGroup."
    )
    public merge_node_with_next_node(this: Commands): void {
        const c: Commands = this;
        if (!c) {
            return;
        }
        const [command, p, u, w] = [
            'merge-node-with-next-node',
            c.p,
            c.undoer,
            c.frame.body.wrapper,
        ];
        if (!p || !p.__bool__() || !p.b.trim() || p.hasChildren()) {
            return;
        }
        const next = p.next();
        if (!next || !next.__bool__()) {
            return;
        }
        // Outer undo.
        u.beforeChangeGroup(p, command);
        // Inner undo 1: change next.b.
        const bunch1 = u.beforeChangeBody(next);
        next.b = p.b.trimEnd() + '\n\n' + next.b;
        w.setAllText(next.b);
        u.afterChangeBody(next, command, bunch1);
        // Inner undo 2: delete p.
        const bunch2 = u.beforeDeleteNode(p);
        p.doDelete(next); // This adjusts next._childIndex.
        c.selectPosition(next);
        u.afterDeleteNode(next, command, bunch2);
        // End outer undo:
        u.afterChangeGroup(next, command);
        c.redraw(next);
    }
    //@+node:felix.20230708211849.1: *3* @g.command('merge-node-with-prev-node')
    @command(
        'merge-node-with-prev-node',
        'Merge p.b into p.back().b and delete p, *provided* that p has no children. ' +
        "Undo works, but redo doesn't: probably a bug in the u.before/AfterChangeGroup."
    )
    public merge_node_with_prev_node(this: Commands): void {
        const c: Commands = this;
        if (!c) {
            return;
        }
        const [command, p, u, w] = [
            'merge-node-with-prev-node',
            c.p,
            c.undoer,
            c.frame.body.wrapper,
        ];
        if (!p || !p.__bool__() || !p.b.trim() || p.hasChildren()) {
            return;
        }
        const prev = p.back();
        if (!prev || !prev.__bool__()) {
            return;
        }
        // Outer undo.
        u.beforeChangeGroup(p, command);
        // Inner undo 1: change prev.b.
        const bunch1 = u.beforeChangeBody(prev);
        prev.b = prev.b.trimEnd() + '\n\n' + p.b;
        w.setAllText(prev.b);
        u.afterChangeBody(prev, command, bunch1);
        // Inner undo 2: delete p, select prev.
        const bunch2 = u.beforeDeleteNode(p);
        p.doDelete(); // No need to adjust prev._childIndex.
        c.selectPosition(prev);
        u.afterDeleteNode(prev, command, bunch2);
        // End outer undo.
        u.afterChangeGroup(prev, command);
        c.redraw(prev);
    }
    //@+node:felix.20220504203200.3: *3* @g.command('promote-bodies')
    @command(
        'promote-bodies',
        "Copy the body text of all descendants to the parent's body text."
    )
    public promoteBodies(this: Commands): void {
        const c: Commands = this;
        if (!c) {
            return;
        }
        const p: Position = c.p;
        const result: string[] = p.b.trim() ? [p.b.trimEnd() + '\n'] : [];

        const b: Bead = c.undoer.beforeChangeNodeContents(p);

        let s: string;

        for (let child of p.subtree()) {
            const h = child.h.trim();
            if (child.b) {
                // body = '\n'.join([f"  {z}" for z in g.splitLines(child.b)])
                const body = [...g.splitLines(child.b)]
                    .map((z) => `  ${z}`)
                    .join('\n');

                s = `- ${h}\n${body}`;
            } else {
                s = `- ${h}`;
            }
            if (s.trim()) {
                result.push(s.trim());
            }
        }
        if (result.length) {
            result.push('');
        }
        p.b = result.join('\n');

        c.undoer.afterChangeNodeContents(p, 'promote-bodies', b);
    }
    //@+node:felix.20220504203200.4: *3* @g.command('promote-headlines')
    @command(
        'promote-headlines',
        "Copy the headlines of all descendants to the parent's body text."
    )
    public promoteHeadlines(this: Commands): void {
        const c: Commands = this;
        if (!c) {
            return;
        }
        const p: Position = c.p;

        const b: Bead = c.undoer.beforeChangeNodeContents(p);

        const result: string = [...p.subtree()]
            .map((p_p) => p_p.h.trimEnd())
            .join('\n');
        // '\n'.join([p.h.trimEnd() for p in p.subtree()])

        if (result) {
            p.b = p.b.trimStart() + '\n' + result;
            c.undoer.afterChangeNodeContents(p, 'promote-headlines', b);
        }
    }

    //@+node:felix.20230708211954.1: *3* @g.command('show-clone-ancestors')
    @command(
        'show-clone-ancestors',
        'Display links to all ancestor nodes of the node c.p.'
    )
    public show_clone_ancestors(this: Commands): void {
        const c: Commands = this;
        if (!c) {
            return;
        }
        g.es(`Ancestors of ${c.p.h}...`);
        const seen: Set<string> = new Set();
        for (const p of c.vnode2allPositions(c.p.v)) {
            for (const ancestor of p.parents()) {
                let unl = ancestor.get_legacy_UNL();
                // Drop the file part.
                const i = unl.indexOf('#');
                let message = i >= 0 ? unl.substring(i + 1) : unl;
                // The following block is deactivated as it is too confusing.
                /*
                if (false) {
                    // Drop the target node from the message.
                    const parts = message.split('-->');
                    if (parts.length > 1) {
                        message = parts.slice(0, -1).join('-->');
                    }
                }
                */
                if (!seen.has(message)) {
                    seen.add(message);

                    // TODO : CHECK THIS !
                    g.es(`${message}\n${unl}::1\n`);

                    // c.frame.log.put(`${message}\n`, { nodeLink: `${unl}::1` });
                }
            }
        }
    }
    //@+node:felix.20230708211959.1: *3* @g.command('show-clone-parents')
    @command(
        'show-clone-parents',
        'Display links to all parent nodes of the node c.p.'
    )
    public show_clones(this: Commands): void {
        const c: Commands = this;
        if (!c) {
            return;
        }

        const seen: Set<string> = new Set();
        g.es(`Parents of ${c.p.h}...`);
        for (const clone of c.vnode2allPositions(c.p.v)) {
            const parent = clone.parent();
            if (parent) {
                let unl = parent.get_legacy_UNL();
                // Drop the file part.
                const i = unl.indexOf('#');
                let message = i >= 0 ? unl.substring(i + 1) : unl;
                if (!seen.has(message)) {
                    seen.add(message);

                    // TODO : CHECK THIS !
                    g.es(`${message}\n${unl}::1\n`);

                    // c.frame.log.put(`${message}\n`, { nodeLink: `${unl}::1` });
                }
            }
        }
    }
    //@+node:felix.20220504203200.5: *3* @g.command('unmark-node-and-parents')
    @command('unmark-node-and-parents', 'Unmark the node and all its parents.')
    public unmark_node_and_parents(this: Commands): Position[] {
        const c: Commands = this;
        const changed: Position[] = [];
        const tag = 'unmark-node-and-parents';
        if (!c) {
            return changed;
        }
        const u = c.undoer;
        for (let parent of c.p.self_and_parents()) {
            if (parent.isMarked()) {
                if (!changed.length) {
                    u.beforeChangeGroup(c.p, tag);
                }
                const bunch = u.beforeMark(parent, 'unmark');
                parent.clearMarked();
                parent.setDirty();
                u.afterMark(parent, 'unmark', bunch);
                changed.push(parent.copy());
            }
        }
        if (changed.length) {
            u.afterChangeGroup(c.p, tag);
            c.setChanged();
            c.redraw();
        }
        return changed;
    }
    //@-others
}
//@+node:felix.20220503222535.1: ** class EditCommandsClass
export class EditCommandsClass extends BaseEditCommandsClass {
    public ccolumn = 0;  // For comment column functions.
    public cursorStack: [Position, number, number, number][] = [];  // Values are tuples, (i, j, ins)
    public extendMode = false;  // True: all cursor move commands extend the selection.
    public fillPrefix = '';  // For fill prefix functions.
    // Set by the set-fill-column command.
    public fillColumn = 0;  // For line centering. If zero, use @pagewidth value.
    public moveSpotNode: VNode | undefined = undefined;  // A VNode.
    public moveSpot: number | undefined = undefined;  // For retaining preferred column when moving up or down.
    public moveCol: number | undefined = undefined;  // For retaining preferred column when moving up or down.

    // Settings...
    private autocompleteBrackets: boolean;
    private autojustify: number;
    private flashMatchingBrackets: boolean;
    private smartAutoIndent: boolean;
    private openBracketsList: string;
    private closeBracketsList: string;

    // Match exactly one trailing blank.
    private hn_pattern = new RegExp(/^[0-9]+(\.[0-9]+)* /);
    private trailing_colon_pat = /^.*:\s*?#.*$/;  // #2230

    //@+others
    //@+node:felix.20220504204405.1: *3* ec.constructor
    constructor(c: Commands) {
        super(c);
        // Settings...
        const cf = c.config;
        this.autocompleteBrackets = cf.getBool('autocomplete-brackets');
        if (cf.getBool('auto-justify-on-at-start')) {
            this.autojustify = Math.abs(cf.getInt('auto-justify') || 0);
        } else {
            this.autojustify = 0;
        }
        this.flashMatchingBrackets = cf.getBool('flash-matching-brackets');
        this.smartAutoIndent = cf.getBool('smart-auto-indent');
        this.openBracketsList = cf.getString('open-flash-brackets') || '([{';
        this.closeBracketsList = cf.getString('close-flash-brackets') || ')]}';
        this.initBracketMatcher(c);
    }
    //@+node:felix.20240611153049.1: *3* ec.cache
    @cmd('clear-all-caches', "Clear all of Leo's file caches.")
    @cmd('clear-cache', "Clear all of Leo's file caches.")
    public clearAllCaches(): void {
        g.app.global_cacher.clear();
    }

    @cmd('dump-caches', "Dump, all of Leo's file caches.")
    public dumpCaches(): void {
        if (g.app.global_cacher.dump) {
            g.app.global_cacher.dump();
        } else {
            g.printObj(g.app.global_cacher);
        }
    }
    //@+node:felix.20220503223023.1: *3* ec.doNothing
    @cmd('do-nothing', 'A placeholder command, useful for testing bindings.')
    public doNothing(): void {
        // pass
    }
    //@+node:felix.20240611154135.1: *3* ec.insertFileName
    @cmd('insert-file-name', 'Prompt for a file name, then insert it at the cursor position.')
    public async insertFileName(): Promise<void> {

        const c = this.c;
        const u = this.c.undoer;
        const w = this.editWidget();

        const filetypes: [string, string][] = [
            ['All files', '*']
        ];
        const fileName = (await g.app.gui.runOpenFileDialog(
            c,
            'Insert File Name',
            filetypes,
            ''
        )) as string;

        const i = w.getSelectionRange()[0];
        const p = c.p;
        w.deleteTextSelection();
        w.insert(i, fileName);
        const newText = w.getAllText();
        if (p.b !== newText) {
            const bunch = u.beforeChangeBody(p);
            p.v.b = newText; // p.b would cause a redraw.
            u.afterChangeBody(p, 'insert-file-name', bunch);
        }

        /* 
         ORIGINAL BEHAVIOR 
         =================

         Prompt for a file name, then insert it at the cursor position.
         This operation is undoable if done in the body pane.

         The initial path is made by concatenating path_for_p() and the selected
         text, if there is any, or any path like text immediately preceding the cursor.
        */



        // c, u, w = self.c, self.c.undoer, self.editWidget(event)
        // if not w:
        //     return

        // def callback(arg: str, w: Wrapper = w) -> None:
        //     i = w.getSelectionRange()[0]
        //     p = c.p
        //     w.deleteTextSelection()
        //     w.insert(i, arg)
        //     newText = w.getAllText()
        //     if g.app.gui.widget_name(w) == 'body' and p.b != newText:
        //         bunch = u.beforeChangeBody(p)
        //         p.v.b = newText  # p.b would cause a redraw.
        //         u.afterChangeBody(p, 'insert-file-name', bunch)

        // # see if the widget already contains the start of a path

        // start_text = w.getSelectedText()
        // if not start_text:  # look at text preceding insert point
        //     start_text = w.getAllText()[: w.getInsertPoint()]
        //     if start_text:
        //         # make non-path characters whitespace
        //         start_text = ''.join(i if i not in '\'"`()[]{}<>!|*,@#$&' else ' '
        //                              for i in start_text)
        //         if start_text[-1].isspace():  # use node path if nothing typed
        //             start_text = ''
        //         else:
        //             start_text = start_text.rsplit(None, 1)[-1]
        //             # set selection range so w.deleteTextSelection() works in the callback
        //             w.setSelectionRange(
        //                 w.getInsertPoint() - len(start_text), w.getInsertPoint())

        // c.k.functionTail = g.finalize_join(self.path_for_p(c, c.p), start_text or '')
        // c.k.getFileName(event, callback=callback)
    }
    //@+node:felix.20220503225225.1: *3* ec.insertHeadlineTime
    @cmd(
        'insert-headline-time',
        'Insert a date/time stamp in the headline of the selected node.'
    )
    public insertHeadlineTime(): Thenable<Position> {
        const c = this.c;
        const p = c.p;
        const u = this.c.undoer;

        if (g.app.batchMode) {
            c.notValidInBatchMode('Insert Headline Time');
            return Promise.resolve(p);
        }

        c.endEditing();
        const time = c.getTime(false);
        const s = p.h.trimEnd();

        const h = p.h;
        const undoType = 'insert-headline-time';
        const undoData = u.beforeChangeNodeContents(p);
        if (s) {
            p.h = [s, time].join(' ');
        } else {
            p.h = time;
        }
        const changed = p.h !== h;
        if (changed) {
            c.setChanged();
            p.setDirty();
            u.afterChangeNodeContents(p, undoType, undoData);
        }

        // return c.redrawAndEdit(p, true);
        c.redraw(p);
        return Promise.resolve(p);

    }
    //@+node:felix.20220503225231.1: *3* ec.capitalizeHeadline
    @cmd(
        'capitalize-headline',
        'Capitalize all words in the headline of the selected node.'
    )
    public capitalizeHeadline(): void {
        const c = this.c;
        const p = this.c.p;
        const u = this.c.undoer;

        if (g.app.batchMode) {
            c.notValidInBatchMode('Capitalize Headline');
            return;
        }
        const h = p.h;
        const undoType = 'capitalize-headline';
        const undoData = u.beforeChangeNodeContents(p);

        // const words = [w.capitalize() for w in h.split(" ")];
        const words = h
            .split(' ')
            .map(w => g.capitalize(w));

        const capitalized = words.join(' ');
        const changed = capitalized !== h;
        if (changed) {
            p.h = capitalized;
            c.setChanged();
            p.setDirty();
            u.afterChangeNodeContents(p, undoType, undoData);
            c.redraw();
        }
    }
    //@+node:felix.20240611161043.1: *3* ec.tabify & untabify
    @cmd('tabify', 'Convert 4 spaces to tabs in the selected text.')
    public tabify(): void {
        this.tabifyHelper('tabify');
    }

    @cmd('untabify', 'Convert tabs to 4 spaces in the selected text.')
    public untabify(): void {
        this.tabifyHelper('untabify');
    }

    private tabifyHelper(which: string): void {
        const w = this.editWidget();
        if (!w || !w.hasSelection()) {
            return;
        }
        this.beginCommand(w, which);
        const [i, end] = w.getSelectionRange();
        const txt = w.getSelectedText();
        let ntxt: string;
        if (which === 'tabify') {
            const pattern = new RegExp(' {4,4}', 'g');
            ntxt = txt.replace(pattern, '\t');
        } else {
            const pattern = new RegExp('\t', 'g');
            ntxt = txt.replace(pattern, '    ');
        }
        w.delete(i, end);
        w.insert(i, ntxt);
        const n = i + ntxt.length;
        w.setSelectionRange(n, n, n);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240611161637.1: *3* ec: capitalization & case
    //@+node:felix.20240611161637.2: *4* ec.capitalizeWord & up/downCaseWord
    @cmd('capitalize-word', 'Capitalize the word at the cursor.')
    public capitalizeWord(): void {
        this.capitalizeHelper('cap', 'capitalize-word');
    }

    @cmd('downcase-word', 'Convert all characters of the word at the cursor to lower case.')
    public downCaseWord(): void {
        this.capitalizeHelper('low', 'downcase-word');
    }

    @cmd('upcase-word', 'Convert all characters of the word at the cursor to UPPER CASE.')
    public upCaseWord(): void {
        this.capitalizeHelper('up', 'upcase-word');
    }
    //@+node:felix.20240611161637.3: *4* ec.capitalizeHelper
    private capitalizeHelper(which: string, undoType: string): void {
        const w = this.editWidget();
        if (!w) {
            return;  // defensive programming
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const [i, j] = g.getWord(s, ins);
        const word = s.substring(i, j);
        if (!word.trim()) {
            return;  // defensive programming
        }

        this.beginCommand(w, undoType);

        let word2: string;
        if (which === 'cap') {
            word2 = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else if (which === 'low') {
            word2 = word.toLowerCase();
        } else if (which === 'up') {
            word2 = word.toUpperCase();
        } else {
            g.trace(`can not happen: which = ${which}`);
            return;
        }

        const changed = word !== word2;
        if (changed) {
            w.delete(i, j);
            w.insert(i, word2);
            w.setSelectionRange(ins, ins, ins);
        }

        this.endCommand(undefined, changed, true);
    }
    //@+node:felix.20240611161637.4: *4* ec.capitalizeWords & selection
    @cmd(
        'capitalize-words-or-selection',
        'Capitalize Entire Body Or Selection.'
    )
    public capitalizeWords(): void {
        const frame = this;
        const c = frame.c;
        const p = c.p;
        const u = c.undoer;
        const w = frame.editWidget();
        const s = w.getAllText();
        if (!s) {
            return;
        }

        const undoType = 'capitalize-body-words';
        const undoData = u.beforeChangeNodeContents(p);

        const [i, j] = w.getSelectionRange();
        const sel = i === j ? '' : s.substring(i, j);
        const text = sel || s;
        const prefix = sel ? s.substring(0, i) : '';
        const suffix = sel ? s.substring(j) : '';

        function convert_to_uppercase(match: string, p1: string, p2: string): string {
            return p1 + p2.toUpperCase();
        }

        const capitalized = text.replace(/(^|\s)(\S)/g, convert_to_uppercase);

        if (capitalized !== text) {
            p.b = sel ? prefix + capitalized + suffix : capitalized;
            c.setChanged();
            p.setDirty();
            u.afterChangeNodeContents(p, undoType, undoData);
            c.redraw();
        }

    }

    //@+node:felix.20240611161619.1: *3* ec: clicks and focus
    //@+node:felix.20230902141521.1: *4* ec.focusTo...
    @cmd('focus-to-body', 'Put the keyboard focus in Leo\'s body pane.')
    public focusToBody(): void {
        this.c.bodyWantsFocus();
    }

    @cmd('focus-to-log', 'Put the keyboard focus in Leo\'s log pane.')
    public focusToLog(): void {
        this.c.logWantsFocus();
    }

    @cmd('focus-to-tree', 'Put the keyboard focus in Leo\'s outline pane.')
    public focusToTree(): void {
        this.c.treeWantsFocus();
    }
    //@+node:felix.20240611163934.1: *3* ec: comment column
    //@+node:felix.20240611163934.2: *4* ec.setCommentColumn
    @cmd('set-comment-column', 'Set the comment column for the indent-to-comment-column command.')
    public setCommentColumn(): void {
        const w = this.editWidget();
        if (!w) {
            return;  // defensive programming
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        let [row, col] = g.convertPythonIndexToRowCol(s, ins);
        this.ccolumn = col;
    }
    //@+node:felix.20240611163934.3: *4* ec.indentToCommentColumn
    @cmd(
        'indent-to-comment-column',
        'Insert whitespace to indent the line containing the insert point to the comment column.'
    )
    public indentToCommentColumn(): void {
        const w = this.editWidget();
        if (!w) {
            return;  // defensive programming
        }
        this.beginCommand(w, 'indent-to-comment-column');
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const [i, j] = g.getLine(s, ins);
        const line = s.substring(i, j);
        const c1 = this.ccolumn;  // already an int
        const line2 = ' '.repeat(c1) + line.trimStart();

        if (line2 !== line) {
            w.delete(i, j);
            w.insert(i, line2);
        }

        w.setInsertPoint(i + c1);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240611165606.1: *3* ec: fill column and centering
    //@+at
    // These methods are currently just used in tandem to center the line or region
    // within the fill column. for example, dependent upon the fill column, this text:
    //
    //     cats
    //     raaaaaaaaaaaats
    //     mats
    //     zaaaaaaaaap
    //
    // may look like:
    //
    //                                  cats
    //                            raaaaaaaaaaaats
    //                                  mats
    //                              zaaaaaaaaap
    //
    // after an center-region command via Alt-x.
    //@+node:felix.20240611165606.2: *4* ec.centerLine
    @cmd('center-line', 'Centers line within current fill column')
    public centerLine(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;  // defensive programming
        }

        let fillColumn: number;
        if (this.fillColumn > 0) {
            fillColumn = this.fillColumn;
        } else {
            const d = c.scanAllDirectives(c.p);
            fillColumn = d["pagewidth"];
        }

        const s = w.getAllText();
        const [i, j] = g.getLine(s, w.getInsertPoint());
        const line = s.substring(i, j).trim();
        if (!line || line.length >= fillColumn) {
            return;
        }

        this.beginCommand(w, 'center-line');
        const n = (fillColumn - line.length) / 2;
        const ws = ' '.repeat(Math.floor(n));
        const k = g.skip_ws(s, i);
        if (k > i) {
            w.delete(i, k - i);
        }
        w.insert(i, ws);
        this.endCommand(undefined, true, true);

    }
    //@+node:felix.20240611165606.3: *4* ec.setFillColumn
    @cmd('set-fill-column', 'Set the fill column used by the center-line and center-region commands.')
    public async setFillColumn(): Promise<void> {
        /** Set the fill column used by the center-line and center-region commands. */
        this.w = this.editWidget();
        if (!this.w) {
            return;  // defensive programming
        }

        let arg = await g.app.gui.get1Arg(
            {
                title: 'Set Fill Column',
                prompt: 'Set width to center line or region',
                placeHolder: 'Fill column width'
            }
        );
        if (!arg) {
            arg = "";
        }
        const c = this.c;
        const w = this.w;
        try {
            // Bug fix: 2011/05/23: set the fillColumn ivar!
            this.fillColumn = isNaN(parseInt(arg, 10)) ? 0 : parseInt(arg, 10);

            // k.setLabelGrey(`fill column is: ${this.fillColumn}`);
        } catch (e) {
            // k.resetLabel();  // defensive programming
        }
        c.widgetWantsFocus(w);
    }
    //@+node:felix.20240611165606.4: *4* ec.centerRegion
    @cmd('center-region', 'Centers the selected text within the fill column')
    public centerRegion(): void {

        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        let s = w.getAllText();
        const [sel_1, sel_2] = w.getSelectionRange();
        let [ind, junk] = g.getLine(s, sel_1);
        let end;
        [, end] = g.getLine(s, sel_2);

        let fillColumn: number;
        if (this.fillColumn > 0) {
            fillColumn = this.fillColumn;
        } else {
            const d = c.scanAllDirectives(c.p);
            fillColumn = d["pagewidth"];
        }

        this.beginCommand(w, 'center-region');
        let inserted = 0;

        while (ind < end) {
            s = w.getAllText();
            const [i, j] = g.getLine(s, ind);
            const line = s.substring(i, j).trim();
            if (line.length >= fillColumn) {
                ind = j;
            } else {
                const n = Math.floor((fillColumn - line.length) / 2);
                inserted += n;
                const k = g.skip_ws(s, i);
                if (k > i) {
                    w.delete(i, k - i);
                }
                w.insert(i, ' '.repeat(n));
                ind = j + n - (k - i);
            }
        }
        w.setSelectionRange(sel_1, sel_2 + inserted);
        this.endCommand(undefined, true, true);

    }
    //@+node:felix.20240611165606.5: *4* ec.setFillPrefix
    @cmd('set-fill-prefix', 'Make the selected text the fill prefix.')
    public setFillPrefix(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const [i, j] = w.getSelectionRange();
        this.fillPrefix = s.substring(i, j);
    }
    //@+node:felix.20240611165606.6: *4* ec._addPrefix
    private _addPrefix(ntxt: string): string {
        const ntxt1 = ntxt.split('.');
        const ntxt_list = ntxt1.map(a => this.fillPrefix + a);
        return ntxt_list.join('.');
    }
    //@+node:felix.20220503225323.1: *3* ec: goto node
    //@+node:felix.20220503225323.2: *4* goto-any-clone
    @cmd(
        'goto-any-clone',
        'Select then next cloned node, regardless of whether c.p is a clone.'
    )
    public gotoAnyClone(): void {
        const c: Commands = this.c;

        const p: Position = c.p.threadNext();
        while (p && p.__bool__()) {
            if (p.isCloned()) {
                c.selectPosition(p);
                return;
            }
            p.moveToThreadNext();
        }
        g.es('no clones found after', c.p.h);
    }
    //@+node:felix.20220503225323.3: *4* goto-char
    @cmd('goto-char', "Put the cursor at the n'th character of the buffer.")
    public async gotoCharacter(): Promise<unknown> {
        let w_n = await g.app.gui.get1Arg({
            title: "Goto n'th character",
            prompt: "Goto n'th character",
            placeHolder: 'Character Number',
        });

        let ok = false;
        this.w = this.editWidget();
        const w = this.w;

        if (w_n && /^\d+$/.test(w_n)) {
            const n: number = Number(w_n);
            if (n >= 0) {
                w.setInsertPoint(n);
                w.seeInsertPoint();
                ok = true;
            }
        }
        if (!ok) {
            g.warning('goto-char takes non-negative integer argument');
        }
        return undefined;
    }

    //@+node:felix.20220503225323.4: *4* goto-global-line
    @cmd(
        'goto-global-line',
        'Put the cursor at the line in the *outline* corresponding to the line ' +
        'with the given line number in the external file. ' +
        'For external files containing sentinels, there may be *several* lines ' +
        'in the file that correspond to the same line in the outline. ' +
        'An Easter Egg: <Alt-x>number invokes this code.'
    )
    public async gotoGlobalLine(p_lineNumber?: number): Promise<unknown> {
        // Bypass if called with number
        const c = this.c;
        if (p_lineNumber || p_lineNumber === 0) {
            return c.gotoCommands.find_file_line(p_lineNumber);
        }
        // Otherwise, ask user
        let w_n = await g.app.gui.get1Arg({
            title: 'Goto global line',
            prompt: 'Line Number',
            placeHolder: '#',
        });
        if (w_n && /^\d+$/.test(w_n)) {
            // Very important: n is one-based.
            return c.gotoCommands.find_file_line(Number(w_n));
        }
    }
    //@+node:felix.20220503225323.5: *4* goto-line
    @cmd('goto-line', "Put the cursor at the n'th line of the buffer.")
    public async gotoLine(): Promise<unknown> {
        let w_n = await g.app.gui.get1Arg({
            title: 'Goto line',
            prompt: 'Line number',
            placeHolder: '#',
        });

        this.w = this.editWidget();
        const w = this.w;

        if (w_n && /^\d+$/.test(w_n)) {
            const n: number = Number(w_n);
            const s = w.getAllText();
            const i = g.convertRowColToPythonIndex(s, n - 1, 0);
            w.setInsertPoint(i);
            w.seeInsertPoint();
        }
        return undefined;
    }

    //@+node:felix.20230402171528.1: *3* ec: headline numbers
    //@+node:felix.20230402171528.2: *4* hn-add-all & helper
    @cmd(
        'hn-add-all',
        'Add headline numbers to all nodes of the outline except' +
        ' @<file> nodes and their descendants ' +
        'and any node whose headline starts with "@". ' +
        "Use the *first* clone's position for all clones."
    )
    @cmd(
        'headline-number-add-all',
        'Add headline numbers to all nodes of the outline except' +
        ' @<file> nodes and their descendants ' +
        'and any node whose headline starts with "@". ' +
        "Use the *first* clone's position for all clones."
    )
    @cmd(
        'add-all-headline-numbers',
        'Add headline numbers to all nodes of the outline except' +
        ' @<file> nodes and their descendants ' +
        'and any node whose headline starts with "@". ' +
        "Use the *first* clone's position for all clones."
    )
    public hn_add_all(): void {
        const c: Commands = this.c;
        const command = 'add-all-headline-numbers';
        const u = c.undoer;

        const data = u.beforeChangeMultiHeadline(c.p);
        for (const p of c.all_unique_positions()) {
            this.hn_delete(p);
            this.hn_add(p);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        c.redraw();
    }
    //@+node:felix.20230402171528.3: *5* hn_add
    /**
     * Add a 1-based outline number to p.h.
     *
     * Do *not* add a headline number for:
     * -  @<file> nodes and their descendants.
     * - Any node whose headline starts with "@".
     */
    public hn_add(p: Position): void {
        const skip = (p: Position): boolean => {
            //True if we should skip p.
            for (const z of p.self_and_parents()) {
                if (z.isAnyAtFileNode()) {
                    return true; // In an @<file> tree.
                }
            }
            return p.h.trim().startsWith('@');
        };

        // Don't add numbers to special nodes.
        if (skip(p)) {
            return;
        }

        const a_s: string[] = [];
        for (const z of p.self_and_parents()) {
            a_s.push((1 + z.childIndex()).toString());
        }
        a_s.reverse();
        const s = a_s.join('.');
        // s = '.'.join(reversed(  list(str(1 + z.childIndex()) for z in p.self_and_parents())  ))

        // Do not strip the original headline!
        p.v.h = `${s} ${p.v.h}`;
        p.v.setDirty();
    }
    //@+node:felix.20230402171528.4: *4* hn-add-subtree & helper
    @cmd(
        'hn-add-subtree',
        'Add headline numbers to *all* children of c.p. ' +
        "Use the *last* clone's position for all clones."
    )
    @cmd(
        'headline-number-add-subtree',
        'Add headline numbers to *all* children of c.p. ' +
        "Use the *last* clone's position for all clones."
    )
    @cmd(
        'add-subtree-headline-numbers',
        'Add headline numbers to *all* children of c.p. ' +
        "Use the *last* clone's position for all clones."
    )
    public hn_add_children(): void {
        const c: Commands = this.c;
        const command = 'add-subtree-headline-numbers';
        const u = c.undoer;
        const root = c.p;
        const data = u.beforeChangeMultiHeadline(root);
        for (const p of c.p.subtree()) {
            this.hn_delete(p);
            this.hn_add_relative(p, root);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        root.expand();
        c.redraw();
    }
    //@+node:felix.20230402171528.5: *5* hn_add_relative
    /**
     * Add a 1-based outline number (relative to the root) to p.h.
     */
    public hn_add_relative(p: Position, root: Position): void {
        const c: Commands = this.c;
        const indices: number[] = [];
        for (const p2 of p.self_and_parents()) {
            if (p2.__eq__(root)) {
                break;
            }
            indices.unshift(p2.childIndex());
        }
        const s = [...indices.map((z) => (1 + z).toString())].join('.');
        // Do not strip the original headline!
        c.setHeadString(p, `${s} ${p.v.h}`);
        p.v.setDirty();
    }
    //@+node:felix.20230402171528.6: *4* hn-delete-all
    @cmd('hn-delete-all', 'Delete all headline numbers in the entire outline.')
    @cmd(
        'headline-number-delete-all',
        'Delete all headline numbers in the entire outline.'
    )
    @cmd(
        'delete-all-headline-numbers',
        'Delete all headline numbers in the entire outline.'
    )
    public hn_delete_all(): void {
        const c: Commands = this.c;
        const command = 'delete-all-headline-numbers';
        const u = c.undoer;

        const data = u.beforeChangeMultiHeadline(c.p);
        for (const p of c.all_unique_positions()) {
            this.hn_delete(p);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        c.redraw();
    }
    //@+node:felix.20230402171528.7: *4* hn-delete-subtree
    @cmd('hn-delete-subtree', "Delete all headline numbers in c.p's subtree.")
    @cmd(
        'headline-number-delete-subtree',
        "Delete all headline numbers in c.p's subtree."
    )
    @cmd(
        'delete-subtree-headline-numbers',
        "Delete all headline numbers in c.p's subtree."
    )
    public hn_delete_tree(): void {
        const c: Commands = this.c;
        const command = 'delete-subtree-headline-numbers';
        const u = c.undoer;

        const data = u.beforeChangeMultiHeadline(c.p);
        for (const p of c.p.subtree()) {
            this.hn_delete(p);
        }
        c.setChanged();
        u.afterChangeMultiHeadline(command, data);
        c.redraw();
    }
    //@+node:felix.20230402171528.8: *4* hn_delete

    /**
     * Helper: delete the headline number in p.h.
     */
    public hn_delete(p: Position): void {
        const c: Commands = this.c;
        // const m = re.match(this.hn_pattern, p.h);
        const m: RegExpExecArray | null = this.hn_pattern.exec(p.h);
        if (m) {
            // Do not strip the headline!
            const n = m[0].length;
            c.setHeadString(p, p.v.h.substring(n));
            p.v.setDirty();
        }
    }
    //@+node:felix.20240611172230.1: *3* ec: indent
    //@+node:felix.20240611172230.2: *4* ec.deleteIndentation
    @cmd('delete-indentation', 'Delete indentation in the presently line.')
    public deleteIndentation(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const [i, j] = g.getLine(s, ins);
        const line = s.substring(i, j);
        const line2 = line.trimStart();
        const delta = line.length - line2.length;
        if (delta) {
            this.beginCommand(w, 'delete-indentation');
            w.delete(i, j);
            w.insert(i, line2);
            const newIns = ins - delta;
            w.setSelectionRange(newIns, newIns, newIns);
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240611172230.3: *4* ec.indentRelative
    @cmd('indent-relative', 'Indents at the point based on the last non-empty line')
    public indentRelative(): void {
        /*
        The indent-relative command indents at the point based on the previous
        line (actually, the last non-empty line.) It inserts whitespace at the
        point, moving point, until it is underneath an indentation point in the
        previous line.

        An indentation point is the end of a sequence of whitespace or the end of
        the line. If the point is farther right than any indentation point in the
        previous line, the whitespace before point is deleted and the first
        indentation point then applicable is used. If no indentation point is
        applicable even then whitespace equivalent to a single tab is inserted.
        */

        const p = this.c.p;
        const u = this.c.undoer;
        const undoType = 'indent-relative';
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        // Find the previous non-blank line
        let [i, j] = g.getLine(s, ins);
        while (true) {
            if (i <= 0) {
                return;
            }
            [i, j] = g.getLine(s, i - 1);
            const line = s.substring(i, j);
            if (line.trim()) {
                break;
            }
        }
        this.beginCommand(w, undoType);
        try {
            const bunch = u.beforeChangeBody(p);
            const k = g.skip_ws(s, i);
            const ws = s.substring(i, k);
            const [i2, j2] = g.getLine(s, ins);
            const k2 = g.skip_ws(s, i2);
            const line = ws + s.substring(k2, j2);
            w.delete(i2, j2);
            w.insert(i2, line);
            w.setInsertPoint(i2 + ws.length);
            p.v.b = w.getAllText();
            u.afterChangeBody(p, undoType, bunch);
        } finally {
            this.endCommand(undefined, true, true);
        }

    }
    //@+node:felix.20230716160519.1: *3* ec: info
    //@+node:felix.20230716160519.2: *4* ec.copyGnx
    @cmd(
        'copy-gnx',
        'Copy c.p.gnx to the clipboard and display a gnx-oriented unl in the log pane.'
        // 'Copy c.p.gnx to the clipboard and display a gnx-oriented unl in the status area.'
    )
    @cmd(
        'gnx-show',
        'Copy c.p.gnx to the clipboard and display a gnx-oriented unl in the log pane.'
        // 'Copy c.p.gnx to the clipboard and display a gnx-oriented unl in the status area.'
    )
    @cmd(
        'show-gnx',
        'Copy c.p.gnx to the clipboard and display a gnx-oriented unl in the log pane.'
        // 'Copy c.p.gnx to the clipboard and display a gnx-oriented unl in the status area.'
    )
    public async copyGnx(): Promise<void> {

        const c = this.c;
        if (!c) {
            return;
        }
        const p = c.p;
        if (!p) {
            return;
        }
        const url = p.get_UNL();
        await g.app.gui.replaceClipboardWith(c.p.gnx);

        g.es_print('gnx: ' + url);

        // const status_line = getattr(c.frame, "statusLine", None)
        // if status_line
        //     status_line.put(url)

    }
    //@+node:felix.20230716160519.3: *4* ec.lineNumber
    @cmd(
        'line-number',
        'Print the line and column number and percentage of insert point.'
    )
    public lineNumber(): void {

        const k = this.c.k;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const i = w.getInsertPoint();
        let [row, col] = g.convertPythonIndexToRowCol(s, i);

        //percent = int((i * 100) / len(s))
        const percent: number = Math.floor((i * 100) / s.length);

        g.es_print(
            `char: ${s[i]} row: ${row} col: ${col} pos: ${i} (${percent}% of ${s.length})`
        );

    }
    //@+node:felix.20230716160519.5: *4* ec.viewRecentCommands
    @cmd(
        'view-recent-commands',
        'Print recently-executed commands.'
    )
    public viewRecentCommands(): void {

        const c = this.c;
        g.es_print('Recently-executed commands...');

        const recentCommandsList = c.recent_commands_list;
        for (let i = recentCommandsList.length - 1; i >= 0; i--) {
            const command = recentCommandsList[i];
            g.es_print(`${i.toString().padStart(2, ' ')} ${command}`);
        }

    }
    //@+node:felix.20230716160519.6: *4* ec.whatLine
    @cmd(
        'what-line',
        'Print the line number of the line containing the cursor.'
    )
    public whatLine(): void {
        const k = this.c.k;
        const w = this.editWidget();

        if (w) {
            const s = w.getAllText();
            const i = w.getInsertPoint();
            let [row, col] = g.convertPythonIndexToRowCol(s, i);

            // k.keyboardQuit()
            // k.setStatusLabel(f"Line {row}")
            g.es_print(`Line ${row + 1}`);
        }
    }
    //@+node:felix.20240611185548.1: *3* ec: insert & delete
    //@+node:felix.20240611185548.2: *4* ec.addSpace/TabToLines & removeSpace/TabFromLines & helper
    @cmd('add-space-to-lines', 'Add a space to start of all lines, or all selected lines.')
    public addSpaceToLines(): void {
        this.addRemoveHelper(' ', true, 'add-space-to-lines');
    }

    @cmd('add-tab-to-lines', 'Add a tab to start of all lines, or all selected lines.')
    public addTabToLines(): void {
        this.addRemoveHelper('\t', true, 'add-tab-to-lines');
    }

    @cmd('remove-space-from-lines', 'Remove a space from start of all lines, or all selected lines.')
    public removeSpaceFromLines(): void {
        this.addRemoveHelper(' ', false, 'remove-space-from-lines');
    }

    @cmd('remove-tab-from-lines', 'Remove a tab from start of all lines, or all selected lines.')
    public removeTabFromLines(): void {
        this.addRemoveHelper('\t', false, 'remove-tab-from-lines');
    }

    //@+node:felix.20240611185548.3: *5* ec.addRemoveHelper
    private addRemoveHelper(ch: string, add: boolean, undoType: string): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        let s: string;
        if (w.hasSelection()) {
            s = w.getSelectedText();
        } else {
            s = w.getAllText();
        }
        if (!s) {
            return;
        }
        // Insert or delete spaces instead of tabs when negative tab width is in effect.
        const d = c.scanAllDirectives(c.p);
        const width = d['tabwidth'];
        if (ch === '\t' && width < 0) {
            ch = ' '.repeat(Math.abs(width));
        }
        this.beginCommand(w, undoType);
        const lines = g.splitLines(s);
        let result_list: string[];
        if (add) {
            result_list = lines.map(line => ch + line);
        } else {
            result_list = lines.map(line => line.startsWith(ch) ? line.slice(ch.length) : line);
        }
        const result = result_list.join('');
        if (w.hasSelection()) {
            const [i, j] = w.getSelectionRange();
            w.delete(i, j);
            w.insert(i, result);
            w.setSelectionRange(i, i + result.length);
        } else {
            w.setAllText(result);
            w.setSelectionRange(0, s.length);
        }
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240611185548.4: *4* ec.backwardDeleteCharacter
    @cmd('backward-delete-char', 'Delete the character to the left of the cursor.')
    public backwardDeleteCharacter(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const wname = c.widget_name(w);
        let ins = w.getInsertPoint();
        let [i, j] = w.getSelectionRange();

        this.beginCommand(w, 'Typing');
        let changed = true;
        try {
            const tab_width = c.getTabWidth(c.p) || 0;
            if (i !== j) {
                w.delete(i, j);
                w.setSelectionRange(i, i, i);
            } else if (i === 0) {
                changed = false;
            } else if (tab_width > 0) {
                w.delete(ins - 1);
                w.setSelectionRange(ins - 1, ins - 1, ins - 1);
            } else {
                //@+<< backspace with negative tab_width >>
                //@+node:felix.20240611185548.5: *5* << backspace with negative tab_width >>
                let s = w.getAllText();
                ins = w.getInsertPoint();
                [i, j] = g.getLine(s, ins);
                s = s.slice(i, ins);
                const n = s.length;
                const abs_width = Math.abs(tab_width);
                // Delete up to this many spaces.
                let n2 = (n % abs_width) || abs_width;
                n2 = Math.min(n, n2);
                let count = 0;
                while (n2 > 0) {
                    n2 -= 1;
                    const ch = s[n - count - 1];
                    if (ch !== ' ') {
                        break;
                    } else {
                        count += 1;
                    }
                }
                // Make sure we actually delete something.
                i = ins - Math.max(1, count);
                w.delete(i, ins);
                w.setSelectionRange(i, i, i);
                //@-<< backspace with negative tab_width >>
            }
        } finally {
            // Necessary to make text changes stick.
            this.endCommand(undefined, changed, false);
        }

    }
    //@+node:felix.20240611185548.6: *4* ec.cleanAllLines
    @cmd('clean-all-lines', 'Clean all lines in the selected tree.')
    public cleanAllLines(): void {
        /** Clean all lines in the selected tree. */
        const c = this.c;
        const u = c.undoer;
        const tag = 'clean-all-lines';
        const roots = g.findRootsWithPredicate(c, c.p);
        u.beforeChangeGroup(c.p, tag);
        let n = 0;
        for (const root of roots) {
            for (const p of root.self_and_subtree()) {
                let lines: string[] = [];
                for (let line of g.splitLines(p.b)) {
                    if (line.trimEnd()) {
                        lines.push(line.trimEnd());
                    }
                    if (line.endsWith('\n')) {
                        lines.push('\n');
                    }
                }
                const s2 = lines.join('');
                if (s2 !== p.b) {
                    const bunch = u.beforeChangeNodeContents(p);
                    p.b = s2;
                    p.setDirty();
                    n += 1;
                    u.afterChangeNodeContents(p, tag, bunch);
                }
            }
        }
        u.afterChangeGroup(c.p, tag);
        g.es(`cleaned ${n} nodes`);
    }
    //@+node:felix.20240611185548.7: *4* ec.cleanLines
    @cmd('clean-lines', 'Removes trailing whitespace from all lines, preserving newlines. Not recommended: reindent is better.')
    public cleanLines(): void {
        /**
         * Removes trailing whitespace from all lines, preserving newlines.
         * Not recommended: reindent is better.
         */
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const lines: string[] = [];
        for (let line of g.splitlines(s)) {
            if (line.trimEnd()) {
                lines.push(line.trimEnd());
            }
            if (line.endsWith('\n')) {
                lines.push('\n');
            }
        }
        const result = lines.join('');
        if (s !== result) {
            this.beginCommand(w, 'clean-lines');
            w.delete(0, w.getLastIndex());
            w.insert(0, result);
            w.setInsertPoint(0);
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240611185548.8: *4* ec.clearSelectedText
    @cmd('clear-selected-text', 'Delete the selected text.')
    clearSelectedText(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const [i, j] = w.getSelectionRange();
        if (i === j) {
            return;
        }
        this.beginCommand(w, 'clear-selected-text');
        w.delete(i, j);
        w.setInsertPoint(i);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240611185548.9: *4* ec.delete-word & backward-delete-word
    @cmd(
        'delete-word',
        'Delete the word at the cursor.'
    )
    public deleteWord(): void {
        this.deleteWordHelper(true);
    }
    @cmd(
        'backward-delete-word',
        'Delete the word in front of the cursor.'
    )
    public backwardDeleteWord(): void {
        this.deleteWordHelper(false);
    }
    // Patch by NH2.
    @cmd(
        'delete-word-smart',
        'Delete the word at the cursor, treating whitespace and symbols smartly.'
    )
    public deleteWordSmart(): void {
        this.deleteWordHelper(true, true);
    }
    @cmd(
        'backward-delete-word-smart',
        'Delete the word in front of the cursor, treating whitespace and symbols smartly.'
    )
    public backwardDeleteWordSmart(): void {
        this.deleteWordHelper(false, true);
    }

    private deleteWordHelper(forward: boolean, smart: boolean = false): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        this.beginCommand(w, 'delete-word');
        let from_pos: number;
        let to_pos: number;
        if (w.hasSelection()) {
            [from_pos, to_pos] = w.getSelectionRange();
        } else {
            from_pos = w.getInsertPoint();
            this.moveWordHelper(false, forward, smart);
            to_pos = w.getInsertPoint();
        }
        // Ensure to_pos > from_pos for consistency
        if (from_pos > to_pos) {
            [from_pos, to_pos] = [to_pos, from_pos];
        }
        w.delete(from_pos, to_pos);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240611185548.10: *4* ec.deleteNextChar
    @cmd('delete-char', 'Delete the character to the right of the cursor.')
    public deleteNextChar(): void {
        /** Delete the character to the right of the cursor. */
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const [i, j] = w.getSelectionRange();
        this.beginCommand(w, 'delete-char');
        let changed = true;
        if (i !== j) {
            w.delete(i, j);
            w.setInsertPoint(i);
        } else if (j < s.length) {
            w.delete(i);
            w.setInsertPoint(i);
        } else {
            changed = false;
        }
        this.endCommand(undefined, changed, false);
    }
    //@+node:felix.20240611185548.11: *4* ec.deleteSpaces
    @cmd('delete-spaces', 'Delete all whitespace surrounding the cursor.')
    public deleteSpaces(insertspace: boolean = false): void {
        /** Delete all whitespace surrounding the cursor. */
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const undoType = insertspace ? 'insert-space' : 'delete-spaces';
        let s = w.getAllText();
        const ins = w.getInsertPoint();
        const [i, j] = g.getLine(s, ins);
        let w1 = ins - 1;
        while (w1 >= i && /\s/.test(s[w1])) {
            w1 -= 1;
        }
        w1 += 1;
        let w2 = ins;
        while (w2 <= j && /\s/.test(s[w2])) {
            w2 += 1;
        }
        const spaces = s.slice(w1, w2);
        if (spaces) {
            this.beginCommand(w, undoType);
            if (insertspace) {
                s = s.slice(0, w1) + ' ' + s.slice(w2);
            } else {
                s = s.slice(0, w1) + s.slice(w2);
            }
            w.setAllText(s);
            w.setInsertPoint(w1);
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240611185548.12: *4* ec.insertHardTab
    @cmd('insert-hard-tab', 'Insert one hard tab.')
    public insertHardTab(): void {
        /** Insert one hard tab. */
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        if (!g.isTextWrapper(w)) {
            return;
        }
        const name = c.widget_name(w);
        if (name.startsWith('head')) {
            return;
        }
        let ins = w.getInsertPoint();
        this.beginCommand(w, 'insert-hard-tab');
        w.insert(ins, '\t');
        ins += 1;
        w.setSelectionRange(ins, ins, ins);
        this.endCommand(undefined);
    }
    //@+node:felix.20240611185548.13: *4* ec.insertNewLine (insert-newline)
    @cmd('insert-newline', 'Insert a newline at the cursor.')
    public insertNewLine(): void {
        this.insertNewlineBase();
    }
    public insertNewline(): void {
        this.insertNewlineBase();
    }

    private insertNewlineBase(): void {
        /** A helper that can be monkey-patched by tables.py plugin. */
        // Note: insertNewlineHelper already exists.
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        if (!g.isTextWrapper(w)) {
            return;
        }
        const name = c.widget_name(w);
        if (name.startsWith('head')) {
            return;
        }
        const oldSel = w.getSelectionRange();
        this.beginCommand(w, 'newline');
        this.insertNewlineHelper(w, oldSel);
        // k.setInputState('insert');
        // k.showStateAndMode();
        this.endCommand(undefined);
    }
    //@+node:felix.20240611185548.14: *4* ec.insertNewLineAndTab (newline-and-indent)
    @cmd('newline-and-indent', 'Insert a newline and tab at the cursor.')
    public insertNewLineAndTab(): void {
        const trace = g.app.debug.includes('keys');
        const c = this.c;
        //const k = this.c.k;
        const p = c.p;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        if (!g.isTextWrapper(w)) {
            return;
        }
        const name = c.widget_name(w);
        if (name.startsWith('head')) {
            return;
        }
        if (trace) {
            g.trace('(newline-and-indent)');
        }
        this.beginCommand(w, 'insert-newline-and-indent');
        const oldSel = w.getSelectionRange();
        this.insertNewlineHelper(w, oldSel, undefined);
        this.updateTab(p, w, false);
        // k.setInputState('insert');
        // k.showStateAndMode();
        this.endCommand(undefined, true, false);
    }
    //@+node:felix.20240611185548.15: *4* ec.insertParentheses
    @cmd('insert-parentheses', 'Insert () at the cursor.')
    public insertParentheses(): void {
        const w = this.editWidget();
        if (w) {
            this.beginCommand(w, 'insert-parenthesis');
            const i = w.getInsertPoint();
            w.insert(i, '()');
            w.setInsertPoint(i + 1);
            this.endCommand(undefined, true, false);
        }
    }
    //@+node:felix.20240611185548.16: *4* ec.insertSoftTab
    @cmd('insert-soft-tab', 'Insert spaces equivalent to one tab.')
    public insertSoftTab(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        if (!g.isTextWrapper(w)) {
            return;
        }
        const name = c.widget_name(w);
        if (name.startsWith('head')) {
            return;
        }
        const tab_width = Math.abs(c.getTabWidth(c.p) || 0);
        let ins = w.getInsertPoint();
        this.beginCommand(w, 'insert-soft-tab');
        w.insert(ins, ' '.repeat(tab_width));
        ins += tab_width;
        w.setSelectionRange(ins, ins, ins);
        this.endCommand(undefined);
    }
    //@+node:felix.20240611185548.17: *4* ec.removeBlankLines (remove-blank-lines)
    @cmd(
        'remove-blank-lines',
        'Remove lines containing nothing but whitespace. Select all lines if there is no existing selection.'
    )
    public removeBlankLines(): void {

        const c = this.c;
        const p = this.c.p;
        const u = this.c.undoer;
        const w = this.editWidget();
        if (!w) {
            return;
        }

        // "Before" snapshot.
        const bunch = u.beforeChangeBody(p);

        // Initial data.
        const oldYview = w.getYScrollPosition();
        const lines = g.splitLines(w.getAllText());

        // Calculate the result.
        const result_list: string[] = [];
        let changed = false;
        for (const line of lines) {
            if (line.trim()) {
                result_list.push(line);
            } else {
                changed = true;
            }
        }
        if (!changed) {
            return;
        }

        // Set p.b and w's text first.
        const result = result_list.join('');
        p.b = result;
        w.setAllText(result);
        const i = 0, j = Math.max(0, result.length - 1);
        w.setSelectionRange(i, j, j);
        w.setYScrollPosition(oldYview);

        // "After" snapshot.
        c.undoer.afterChangeBody(p, 'remove-blank-lines', bunch);
    }
    //@+node:felix.20240611185548.18: *4* ec.replaceCurrentCharacter
    @cmd(
        'replace-current-character',
        'Replace the current character with the next character typed.'
    )
    public async replaceCurrentCharacter(): Promise<void> {
        /** Replace the current character with the next character typed. */

        this.w = this.editWidget();
        let ch;
        if (this.w) {
            // k.setLabelBlue('Replace Character: ');
            ch = await g.app.gui.get1Arg({
                title: 'Replace Character',
                prompt: 'Replace with',
                placeHolder: 'Character',
            });
        } else {
            return;
        }

        const c = this.c;
        const w = this.w;

        if (ch) {
            let [i, j] = w.getSelectionRange();
            if (i > j) {
                [i, j] = [j, i];
            }
            // Use raw insert/delete to retain the coloring.
            if (i === j) {
                i = Math.max(0, i - 1);
                w.delete(i);
            } else {
                w.delete(i, j);
            }
            w.insert(i, ch);
            w.setInsertPoint(i + 1);
        }
        // k.clearState();
        // k.resetLabel();
        // k.showStateAndMode();
        c.widgetWantsFocus(w);
    }
    //@+node:felix.20240611201520.1: *4* ec.selfInsertCommand helpers
    //@+node:felix.20240611205608.1: *5* ec.initBracketMatcher
    /**
     * Init the bracket matching code.
     */
    private initBracketMatcher(c: Commands): void {
        if (this.openBracketsList.length !== this.closeBracketsList.length) {
            g.es_print('bad open/close_flash_brackets setting: using defaults');
            this.openBracketsList = '([{';
            this.closeBracketsList = ')]}';
        }
    }
    //@+node:felix.20240611201520.2: *5* ec.insertNewlineHelper
    private insertNewlineHelper(w: StringTextWrapper, oldSel: [number, number], undoType?: string): void {
        const c = this.c, p = this.c.p;
        let [i, j] = oldSel;
        const ch = '\n';
        if (i !== j) {
            // No auto-indent if there is selected text.
            w.delete(i, j);
            w.insert(i, ch);
            w.setInsertPoint(i + 1);
        } else {
            w.insert(i, ch);
            w.setInsertPoint(i + 1);
            if (
                c.autoindent_in_nocolor ||
                (g.useSyntaxColoring(p) && undoType !== "Change")
            ) {
                // No auto-indent if in @nocolor mode or after a Change command.
                this.updateAutoIndent(p, w);
            }
        }
        w.seeInsertPoint();
    }
    //@+node:felix.20240611201520.3: *5* ec.updateAutoIndent
    private updateAutoIndent(p: Position, w: StringTextWrapper): void {
        /** Handle auto indentation. */
        const c = this.c;
        const tab_width = c.getTabWidth(p) || 0;
        // Get the previous line.
        let s = w.getAllText();
        const ins = w.getInsertPoint();
        let i = g.skip_to_start_of_line(s, ins);
        let j;
        [i, j] = g.getLine(s, i - 1);
        s = s.slice(i, j - 1);
        // Add the leading whitespace to the present line.
        const [junk, width] = g.skip_leading_ws_with_indent(s, 0, tab_width);
        let indentWidth = width;
        if (s.trimEnd() && (s.trimEnd().endsWith(':') || this.trailing_colon_pat.test(s))) {
            // For Python: increase auto-indent after colons.
            if (g.findLanguageDirectives(c, p) === 'python') {
                indentWidth += Math.abs(tab_width);
            }
        }
        if (this.smartAutoIndent) {
            // Determine if prev line has unclosed parens/brackets/braces
            const bracketWidths = [indentWidth];
            let tabex = 0;
            for (let i = 0; i < s.length; i++) {
                const ch = s[i];
                if (ch === '\t') {
                    tabex += tab_width - 1;
                }
                if ('([{'.includes(ch)) {
                    bracketWidths.push(i + tabex + 1);
                } else if ('}])'.includes(ch) && bracketWidths.length > 1) {
                    bracketWidths.pop();
                }
            }
            indentWidth = bracketWidths.pop()!;
        }
        const ws = g.computeLeadingWhitespace(indentWidth, tab_width);
        if (ws) {
            const i = w.getInsertPoint();
            w.insert(i, ws);
            w.setInsertPoint(i + ws.length);
            w.seeInsertPoint();  // 2011/10/02: Fix cursor-movement bug.
        }
    }
    //@+node:felix.20240611201520.4: *5* ec.updateAutomatchBracket

    private updateAutomatchBracket(p: Position, w: StringTextWrapper, ch: string, oldSel: [number, number]): void {
        const c = this.c;
        const d = c.scanAllDirectives(p);
        const [i, j] = oldSel;
        const language = d.get('language');
        const s = w.getAllText();

        if (ch === '(' || ch === '[' || ch === '{') {
            const automatch = language !== 'plain';
            if (automatch) {
                ch += { '(': ')', '[': ']', '{': '}' }[ch];
            }
            if (i !== j) {
                w.delete(i, j);
            }
            w.insert(i, ch);
            if (automatch) {
                const ins = w.getInsertPoint();
                w.setInsertPoint(ins - 1);
            }
        } else {
            let ins = w.getInsertPoint();
            const ch2 = ins < s.length ? s[ins] : '';
            if (ch2 === ')' || ch2 === ']' || ch2 === '}') {
                ins = w.getInsertPoint();
                w.setInsertPoint(ins + 1);
            } else {
                if (i !== j) {
                    w.delete(i, j);
                }
                w.insert(i, ch);
                w.setInsertPoint(i + 1);
            }
        }
    }
    //@+node:felix.20240611203155.1: *5* ec.updateTab & helper
    /**
     * A helper for selfInsertCommand.
     * Add spaces equivalent to a tab.
     */
    private updateTab(p: Position, w: StringTextWrapper, smartTab: boolean = true): void {
        const c = this.c;
        const [i, j] = w.getSelectionRange();  // Returns insert point if no selection, with i <= j.
        if (i !== j) {
            c.indentBody();
            return;
        }
        const tab_width = c.getTabWidth(p) || 0;
        // Get the preceding characters.
        const s = w.getAllText();
        const [start, end] = g.getLine(s, i);
        let after = s.slice(i, end);
        if (after.endsWith('\n')) {
            after = after.slice(0, -1);
        }
        // Only do smart tab at the start of a blank line.
        const doSmartTab = (smartTab && c.smart_tab && i === start);
        if (doSmartTab) {
            this.updateAutoIndent(p, w);
            // Add a tab if otherwise nothing would happen.
            if (s === w.getAllText()) {
                this.doPlainTab(s, i, tab_width, w);
            }
        } else {
            this.doPlainTab(s, i, tab_width, w);
        }
    }
    //@+node:felix.20240611203155.2: *6* ec.doPlainTab
    /**
     * A helper for selfInsertCommand, called from updateTab.
     * Insert spaces equivalent to one tab.
     */
    private doPlainTab(s: string, i: number, tab_width: number, w: StringTextWrapper): void {
        const trace = g.app.debug.includes('keys');
        const [start, end] = g.getLine(s, i);
        const s2 = s.slice(start, i);
        const width = g.computeWidth(s2, tab_width);
        if (trace) {
            g.trace('width', width);
        }
        let ins: number;
        if (tab_width > 0) {
            w.insert(i, '\t');
            ins = i + 1;
        } else {
            const n = Math.abs(tab_width) - (width % Math.abs(tab_width));
            w.insert(i, ' '.repeat(n));
            ins = i + n;
        }
        w.setSelectionRange(ins, ins, ins);
    }
    //@+node:felix.20240612224828.1: *3* ec: lines
    //@+node:felix.20240612224828.2: *4* ec.moveLinesToNextNode
    @cmd('move-lines-to-next-node', 'Move one or *trailing* lines to the start of the next node.')
    public moveLineToNextNode(): void {
        const c = this.c;
        if (!c.p.threadNext()) {
            return;
        }
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const [sel_1, sel_2] = w.getSelectionRange();
        const [i, _junk] = g.getLine(s, sel_1);
        const [i2, j] = g.getLine(s, sel_2);
        const lines = s.substring(i, j);
        if (!lines.trim()) {
            return;
        }
        this.beginCommand(w, 'move-lines-to-next-node');
        try {
            const [next_i, next_j] = g.getLine(s, j);
            w.delete(i, next_j);
            c.p.b = w.getAllText().trimEnd() + '\n';
            c.selectPosition(c.p.threadNext());
            c.p.b = lines + '\n' + c.p.b;
            c.recolor();
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240612224828.3: *4* ec.splitLine
    @cmd('split-line', 'Split a line at the cursor position.')
    public splitLine(): void {
        const w = this.editWidget();
        if (w) {
            this.beginCommand(w, 'split-line');
            const s = w.getAllText();
            const ins = w.getInsertPoint();
            w.setAllText(s.slice(0, ins) + '\n' + s.slice(ins));
            w.setInsertPoint(ins + 1);
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20221220002620.1: *3* ec: move cursor
    //@+node:felix.20240611210227.1: *4* ec. helpers
    //@+node:felix.20240611210227.2: *5* ec.extendHelper
    /**
     * Handle the details of extending the selection.
     * This method is called for all cursor moves.
     *
     * extend: Clear the selection unless this is True.
     * spot:   The *new* insert point.
     */
    private extendHelper(w: StringTextWrapper, extend: boolean, spot: number, upOrDown: boolean = false): void {
        const c = this.c;
        const p = this.c.p;
        extend = extend || this.extendMode;
        const ins = w.getInsertPoint();
        let [i, j] = w.getSelectionRange();

        // Reset the move spot if needed.
        if (this.moveSpot == null || p.v !== this.moveSpotNode) {
            this.setMoveCol(w, extend ? ins : spot);  // sets this.moveSpot.
        } else if (extend) {
            // 2011/05/20: Fix bug 622819
            // Ctrl-Shift movement is incorrect when there is an unexpected selection.
            if (i === j) {
                this.setMoveCol(w, ins);  // sets this.moveSpot.
            } else if (this.moveSpot === i || this.moveSpot === j) {
                // The bug fix, part 1.
                if (this.moveSpot !== ins) {
                    // pass
                }
            } else {
                // The bug fix, part 2.
                // Set the moveCol to the *not* insert point.
                let k;
                if (ins === i) {
                    k = j;
                } else if (ins === j) {
                    k = i;
                } else {
                    k = ins;
                }
                this.setMoveCol(w, k);  // sets this.moveSpot.
            }
        } else {
            if (upOrDown) {
                const s = w.getAllText();
                const [i2, j2] = g.getLine(s, spot);
                const line = s.slice(i2, j2);
                const [row, col] = g.convertPythonIndexToRowCol(s, spot);
                let n;
                if (true) {  // was j2 < len(s)-1:
                    n = Math.min(this.moveCol!, Math.max(0, line.length - 1));
                } else {
                    n = Math.min(this.moveCol!, Math.max(0, line.length));  // A tricky boundary.
                }
                spot = g.convertRowColToPythonIndex(s, row, n);
            } else {  // Plain move forward or back.
                this.setMoveCol(w, spot);  // sets this.moveSpot.
            }
        }

        if (extend) {
            if (spot < this.moveSpot!) {
                w.setSelectionRange(spot, this.moveSpot!, spot);
            } else {
                w.setSelectionRange(this.moveSpot!, spot, spot);
            }
        } else {
            w.setSelectionRange(spot, spot, spot);
        }

        w.seeInsertPoint();
        // c.frame.updateStatusLine();
    }
    //@+node:felix.20240611210227.3: *5* ec.moveToHelper
    /** 
     * Common helper method for commands that move the cursor
     * in a way that can be described by a Tk Text expression.
     */
    private moveToHelper(spot: number, extend: boolean): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        c.widgetWantsFocusNow(w);

        // Put the request in the proper range.
        // if (c.widget_name(w).startsWith('mini')) {
        //     const [i, j] = k.getEditableTextRange();
        //     if (spot < i) {
        //         spot = i;
        //     } else if (spot > j) {
        //         spot = j;
        //     }
        // }

        this.extendHelper(w, extend, spot, false);
    }
    //@+node:felix.20240611210227.4: *5* ec.moveWithinLineHelper
    private moveWithinLineHelper(spot: string, extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        // Bug fix: 2012/02/28: don't use the Qt end-line logic:
        // it apparently does not work for wrapped lines.

        const s = w.getAllText();
        const ins = w.getInsertPoint();
        let [i, j] = g.getLine(s, ins);
        const line = s.slice(i, j);
        if (spot === 'begin-line') {  // was 'start-line'
            this.moveToHelper(i, extend);
        } else if (spot === 'end-line') {
            // Bug fix: 2011/11/13: Significant in external tests.
            if (g.match(s, j - 1, '\n') && i !== j) {
                j -= 1;
            }
            this.moveToHelper(j, extend);
        } else if (spot === 'finish-line') {
            if (line.trim().length) {
                if (g.match(s, j - 1, '\n')) {
                    j -= 1;
                }
                while (j >= 0 && s[j].trim().length === 0) {
                    j -= 1;
                }
            }
            this.moveToHelper(j, extend);
        } else if (spot === 'start-line') {  // new
            if (line.trim().length) {
                while (i < j && s[i].trim().length === 0) {
                    i += 1;
                }
            }
            this.moveToHelper(i, extend);
        } else {
            g.trace(`can not happen: bad spot: ${spot}`);
        }

    }
    //@+node:felix.20240611210227.5: *5* ec.moveWordHelper
    private moveWordHelper(
        extend: boolean,
        forward: boolean,
        end: boolean = false,
        smart: boolean = false
    ): void {
        /*
        Move the cursor to the next/previous word.
        The cursor is placed at the start of the word unless end=True
        */
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        c.widgetWantsFocusNow(w);
        const s = w.getAllText();
        const n = s.length;
        let i = w.getInsertPoint();
        const alphanumeric_re = /\w/;
        const whitespace_re = /\s/;
        const simple_whitespace_re = /[ \t]/;
        //@+others
        //@+node:felix.20240611210227.6: *6* ec.moveWordHelper functions
        function is_alphanumeric(ch: string): boolean {
            return alphanumeric_re.test(ch);
        }

        function is_whitespace(ch: string): boolean {
            return whitespace_re.test(ch);
        }

        function is_simple_whitespace(ch: string): boolean {
            return simple_whitespace_re.test(ch);
        }

        function is_line_break(ch: string): boolean {
            return is_whitespace(ch) && !is_simple_whitespace(ch);
        }

        function is_special(ch: string): boolean {
            return !is_alphanumeric(ch) && !is_whitespace(ch);
        }

        function seek_until_changed(i: number, match_function: (ch: string) => boolean, step: number): number {
            while (0 <= i && i < n && match_function(s[i])) {
                i += step;
            }
            return i;
        }

        function seek_word_end(i: number): number {
            return seek_until_changed(i, is_alphanumeric, 1);
        }

        function seek_word_start(i: number): number {
            return seek_until_changed(i, is_alphanumeric, -1);
        }

        function seek_simple_whitespace_end(i: number): number {
            return seek_until_changed(i, is_simple_whitespace, 1);
        }

        function seek_simple_whitespace_start(i: number): number {
            return seek_until_changed(i, is_simple_whitespace, -1);
        }

        function seek_special_end(i: number): number {
            return seek_until_changed(i, is_special, 1);
        }

        function seek_special_start(i: number): number {
            return seek_until_changed(i, is_special, -1);
        }
        //@-others
        if (smart) {
            if (forward) {
                if (0 <= i && i < n) {
                    if (is_alphanumeric(s[i])) {
                        i = seek_word_end(i);
                        i = seek_simple_whitespace_end(i);
                    } else if (is_simple_whitespace(s[i])) {
                        i = seek_simple_whitespace_end(i);
                    } else if (is_special(s[i])) {
                        i = seek_special_end(i);
                        i = seek_simple_whitespace_end(i);
                    } else {
                        i += 1;  // e.g. for newlines
                    }
                }
            } else {
                i -= 1;  // Shift cursor temporarily by -1 to get easy read access to the prev. char
                if (0 <= i && i < n) {
                    if (is_alphanumeric(s[i])) {
                        i = seek_word_start(i);
                        // Do not seek further whitespace here
                    } else if (is_simple_whitespace(s[i])) {
                        i = seek_simple_whitespace_start(i);
                    } else if (is_special(s[i])) {
                        i = seek_special_start(i);
                        // Do not seek further whitespace here
                    } else {
                        i -= 1;  // e.g. for newlines
                    }
                }
                i += 1;
            }
        } else {
            if (forward) {
                // Unlike backward-word moves, there are two options...
                if (end) {
                    while (0 <= i && i < n && !g.isWordChar(s[i])) {
                        i += 1;
                    }
                    while (0 <= i && i < n && g.isWordChar(s[i])) {
                        i += 1;
                    }
                } else {
                    // #1653. Scan for non-words *first*.
                    while (0 <= i && i < n && !g.isWordChar(s[i])) {
                        i += 1;
                    }
                    while (0 <= i && i < n && g.isWordChar(s[i])) {
                        i += 1;
                    }
                }
            } else {
                i -= 1;
                while (0 <= i && i < n && !g.isWordChar(s[i])) {
                    i -= 1;
                }
                while (0 <= i && i < n && g.isWordChar(s[i])) {
                    i -= 1;
                }
                i += 1;  // 2015/04/30
            }
        }
        this.moveToHelper(i, extend);
    }
    //@+node:felix.20240611210227.7: *5* ec.setMoveCol
    public setMoveCol(w: StringTextWrapper, spot: number): void {
        /*
        Set the column to which an up or down arrow will attempt to move.
        */
        const p = this.c.p;
        const [row, col] = w.toPythonIndexRowCol(spot);
        this.moveSpot = spot;
        this.moveCol = col;
        this.moveSpotNode = p.v;
    }
    //@+node:felix.20240611223239.1: *4* ec.backToHome/ExtendSelection
    @cmd(
        'back-to-home',
        'Position the point at the first non-blank character on the line, or the start of the line.'
    )
    public backToHome(extend: boolean = false): void {
        // Smart home:
        // Position the point at the first non-blank character on the line,
        // or the start of the line if already there.
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        if (s) {
            let [i, j] = g.getLine(s, ins);
            const i1 = i;
            while (i < j && s[i] === ' ' || s[i] === '\t') {
                i++;
            }
            if (i === ins) {
                i = i1;
            }
            this.moveToHelper(i, extend);
        }
    }

    @cmd('back-to-home-extend-selection',
        'Position the point at the first non-blank character on the line, or the start of the line extending the selection.')
    backToHomeExtendSelection(): void {
        this.backToHome(true);
    }
    //@+node:felix.20240611223554.1: *4* ec.backToIndentation
    @cmd('back-to-indentation', 'Position the point at the first non-blank character on the line.')
    public backToIndentation(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        let [i, j] = g.getLine(s, ins);
        while (i < j && (s[i] === ' ' || s[i] === '\t')) {
            i++;
        }
        this.moveToHelper(i, false);
    }
    //@+node:felix.20240611225127.1: *4* ec.backward*/ExtendSelection
    @cmd('back-word', 'Move the cursor to the previous word.')
    public backwardWord(): void {
        this.moveWordHelper(false, false);
    }

    @cmd('back-word-extend-selection', 'Extend the selection by moving the cursor to the previous word.')
    public backwardWordExtendSelection(): void {
        this.moveWordHelper(true, false);
    }

    @cmd('back-word-smart', 'Move the cursor to the beginning of the current or the end of the previous word.')
    public backwardWordSmart(): void {
        this.moveWordHelper(false, false, undefined, true);
    }

    @cmd('back-word-smart-extend-selection', 'Extend the selection by moving the cursor to the beginning of the current or the end of the previous word.')
    public backwardWordSmartExtendSelection(): void {
        this.moveWordHelper(true, false, undefined, true);
    }
    //@+node:felix.20240611225342.1: *4* ec.beginningOfLine/ExtendSelection
    @cmd('beginning-of-line', 'Move the cursor to the first character of the line.')
    beginningOfLine(): void {
        this.moveWithinLineHelper('begin-line', false);
    }

    @cmd('beginning-of-line-extend-selection', 'Extend the selection by moving the cursor to the first character of the line.')
    beginningOfLineExtendSelection(): void {
        this.moveWithinLineHelper('begin-line', true);
    }
    //@+node:felix.20240611225948.1: *4* ec.between lines & helper
    @cmd('next-line', 'Move the cursor down, extending the selection if in extend mode.')
    public nextLine(): void {
        this.moveUpOrDownHelper('down', false);
    }
    @cmd('next-line-extend-selection', 'Extend the selection by moving the cursor down.')
    public nextLineExtendSelection(): void {
        this.moveUpOrDownHelper('down', true);
    }
    @cmd('previous-line', 'Move the cursor up, extending the selection if in extend mode.')
    public prevLine(): void {
        this.moveUpOrDownHelper('up', false);
    }
    @cmd('previous-line-extend-selection', 'Extend the selection by moving the cursor up.')
    public prevLineExtendSelection(): void {
        this.moveUpOrDownHelper('up', true);
    }
    //@+node:felix.20240611225948.2: *5* ec.moveUpOrDownHelper
    private moveUpOrDownHelper(direction: string, extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const ins = w.getInsertPoint();
        const s = w.getAllText();
        w.seeInsertPoint();

        // Find the start of the next/prev line.
        const [row, col] = g.convertPythonIndexToRowCol(s, ins);
        const [i, j] = g.getLine(s, ins);
        let i2, j2;
        if (direction === 'down') {
            [i2, j2] = g.getLine(s, j);
        } else {
            [i2, j2] = g.getLine(s, i - 1);
        }
        // The spot is the start of the line plus the column index.
        const n = Math.max(0, j2 - i2 - 1);  // The length of the new line.
        const col2 = Math.min(col, n);
        const spot = i2 + col2;
        this.extendHelper(w, extend, spot, true);

    }
    //@+node:felix.20240611231950.1: *4* ec.buffers & helper
    @cmd('beginning-of-buffer', 'Move the cursor to the start of the body text.')
    public beginningOfBuffer(): void {
        this.moveToBufferHelper('home', false);
    }
    @cmd('beginning-of-buffer-extend-selection', 'Extend the text selection by moving the cursor to the start of the body text.')
    public beginningOfBufferExtendSelection(): void {
        this.moveToBufferHelper('home', true);
    }
    @cmd('end-of-buffer', 'Move the cursor to the end of the body text.')
    public endOfBuffer(): void {
        this.moveToBufferHelper('end', false);
    }
    @cmd('end-of-buffer-extend-selection', 'Extend the text selection by moving the cursor to the end of the body text.')
    public endOfBufferExtendSelection(): void {
        this.moveToBufferHelper('end', true);
    }
    //@+node:felix.20240611231950.2: *5* ec.moveToBufferHelper
    private moveToBufferHelper(spot: string, extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        if (spot === 'home') {
            this.moveToHelper(0, extend);
        } else if (spot === 'end') {
            const s = w.getAllText();
            this.moveToHelper(s.length, extend);
        } else {
            g.trace('can not happen: bad spot', spot);
        }
    }
    //@+node:felix.20240611232508.1: *4* ec.characters & helper
    @cmd('back-char', 'Move the cursor back one character, extending the selection if in extend mode.')
    backCharacter(): void {
        this.moveToCharacterHelper('left', false);
    }
    @cmd('back-char-extend-selection', 'Extend the selection by moving the cursor back one character.')
    backCharacterExtendSelection(): void {
        this.moveToCharacterHelper('left', true);
    }
    @cmd('forward-char', 'Move the cursor forward one character, extending the selection if in extend mode.')
    forwardCharacter(): void {
        this.moveToCharacterHelper('right', false);
    }
    @cmd('forward-char-extend-selection', 'Extend the selection by moving the cursor forward one character.')
    forwardCharacterExtendSelection(): void {
        this.moveToCharacterHelper('right', true);
    }
    //@+node:felix.20240611232508.2: *5* ec.moveToCharacterHelper
    private moveToCharacterHelper(spot: string, extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }

        let i = w.getInsertPoint();
        if (spot === 'left') {
            i = Math.max(0, i - 1);
            this.moveToHelper(i, extend);
        } else if (spot === 'right') {
            i = Math.min(i + 1, w.getLastIndex());
            this.moveToHelper(i, extend);
        } else {
            g.trace(`can not happen: bad spot: ${spot}`);
        }

    }
    //@+node:felix.20240611234833.1: *4* ec.clear/set/ToggleExtendMode
    @cmd('clear-extend-mode', 'Turn off extend mode: cursor movement commands do not extend the selection.')
    public clearExtendMode(): void {
        this.extendModeHelper(false);
    }
    @cmd('set-extend-mode', 'Turn on extend mode: cursor movement commands do extend the selection.')
    public setExtendMode(): void {
        this.extendModeHelper(true);
    }
    @cmd('toggle-extend-mode', 'Toggle extend mode, i.e., toggle whether cursor movement commands extend the selections.')
    public toggleExtendMode(): void {
        this.extendModeHelper(!this.extendMode);
    }

    private extendModeHelper(val: boolean): void {
        const c = this.c;
        const w = this.editWidget();
        if (w) {
            this.extendMode = val;
            if (!g.unitTesting) {
                // g.red('extend mode','on' if val else 'off'))
                c.k.showStateAndMode();
            }
            c.widgetWantsFocusNow(w);
        }
    }
    //@+node:felix.20240611235026.1: *4* ec.endOfLine/ExtendSelection
    @cmd('end-of-line', 'Move the cursor to the last character of the line.')
    public endOfLine(): void {
        this.moveWithinLineHelper('end-line', false);
    }
    @cmd('end-of-line-extend-selection', 'Extend the selection by moving the cursor to the last character of the line.')
    public endOfLineExtendSelection(): void {
        this.moveWithinLineHelper('end-line', true);
    }
    //@+node:felix.20240611235040.1: *4* ec.exchangePointMark
    @cmd(
        'exchange-point-mark',
        'Exchange the point (insert point) with the mark (the other end of the selected text).'
    )
    public exchangePointMark(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        c.widgetWantsFocusNow(w);
        let [i, j] = w.getSelectionRange(false);
        if (i === j) {
            return;
        }
        let ins = w.getInsertPoint();
        ins = (ins === i) ? j : i;
        w.setInsertPoint(ins);
        w.setSelectionRange(i, j);
    }
    //@+node:felix.20240611235202.1: *4* ec.extend-to-line
    @cmd('extend-to-line', 'Select the line at the cursor.')
    public extendToLine(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const n = s.length;
        let i = w.getInsertPoint();
        while (0 <= i && i < n && s[i] !== '\n') {
            i--;
        }
        i++;
        const i1 = i;
        while (0 <= i && i < n && s[i] !== '\n') {
            i++;
        }
        w.setSelectionRange(i1, i);
    }
    //@+node:felix.20240611235414.1: *4* ec.extend-to-sentence
    @cmd('extend-to-sentence', 'Select the line at the cursor.')
    public extendToSentence(): void {
        const w = this.editWidget();
        if (!w) {
            return;  // pragma: no cover (defensive)
        }
        const s = w.getAllText();
        const n = s.length;
        const i = w.getInsertPoint();
        let i2 = 1 + s.indexOf('.', i);
        if (i2 === 0) {
            i2 = n;
        }
        const i1 = 1 + s.lastIndexOf('.', i2 - 1);
        w.setSelectionRange(i1, i2);
    }
    //@+node:felix.20221220002639.1: *4* ec.extend-to-word
    @cmd(
        'extend-to-word',
        'Compute the word at the cursor. Select it if select arg is True.'
    )
    public extendToWord(
        select = true,
        w?: StringTextWrapper
    ): [number, number] {
        if (!w) {
            w = this.editWidget();
        }
        if (!w) {
            return [0, 0];
        }
        const s = w.getAllText();
        const n = s.length;
        let i = w.getInsertPoint();
        let i1 = i;
        // Find a word char on the present line if one isn't at the cursor.
        if (!(0 <= i && i < n && g.isWordChar(s[i]))) {
            // First, look forward
            while (i < n && !g.isWordChar(s[i]) && s[i] !== '\n') {
                i += 1;
            }
            // Next, look backward.
            if (!(0 <= i && i < n && g.isWordChar(s[i]))) {
                if (i >= n || s[i] === '\n') {
                    i = i1 - 1;
                } else {
                    i = i1;
                }
                while (i >= 0 && !g.isWordChar(s[i]) && s[i] !== '\n') {
                    i -= 1;
                }
            }
        }
        // Make sure s[i] is a word char.
        if (0 <= i && i < n && g.isWordChar(s[i])) {
            // Find the start of the word.
            while (0 <= i && i < n && g.isWordChar(s[i])) {
                i -= 1;
            }
            i += 1;
            i1 = i;

            // Find the end of the word.
            while (0 <= i && i < n && g.isWordChar(s[i])) {
                i += 1;
            }
            if (select) {
                w.setSelectionRange(i1, i);
            }
            return [i1, i];
        }

        return [0, 0];
    }
    //@+node:felix.20240611235817.1: *4* ec.finishOfLine/ExtendSelection
    @cmd('finish-of-line', 'Move the cursor to the last character of the line.')
    finishOfLine(): void {
        this.moveWithinLineHelper('finish-line', false);
    }
    @cmd('finish-of-line-extend-selection', 'Extend the selection by moving the cursor to the last character of the line.')
    finishOfLineExtendSelection(): void {
        this.moveWithinLineHelper('finish-line', true);
    }
    //@+node:felix.20240611235844.1: *4* ec.forward*/ExtendSelection
    @cmd(
        'forward-end-word',
        'Move the cursor to the next word.'
    )
    public forwardEndWord(): void {
        this.moveWordHelper(false, true, true);
    }
    @cmd(
        'forward-end-word-extend-selection',
        'Extend the selection by moving the cursor to the next word.'
    )
    public forwardEndWordExtendSelection(): void {
        this.moveWordHelper(true, true, true);
    }
    @cmd(
        'forward-word',
        'Move the cursor to the next word.'
    )
    public forwardWord(): void {
        this.moveWordHelper(false, true);
    }
    @cmd(
        'forward-word-extend-selection',
        'Extend the selection by moving the cursor to the end of the next word.'
    )
    public forwardWordExtendSelection(): void {
        this.moveWordHelper(true, true);
    }
    @cmd(
        'forward-word-smart',
        'Move the cursor to the end of the current or the beginning of the next word.'
    )
    public forwardWordSmart(): void {
        this.moveWordHelper(false, true, undefined, true);
    }
    @cmd(
        'forward-word-smart-extend-selection',
        'Extend the selection by moving the cursor to the end of the current or the beginning of the next word.'
    )
    public forwardWordSmartExtendSelection(): void {
        this.moveWordHelper(true, true, undefined, true);
    }
    //@+node:felix.20240612000335.1: *4* ec.movePastClose & helper

    @cmd('move-past-close', 'Move the cursor past the closing parenthesis.')
    public movePastClose(): void {
        this.movePastCloseHelper(false);
    }
    @cmd('move-past-close-extend-selection', 'Extend the selection by moving the cursor past the closing parenthesis.')
    public movePastCloseExtendSelection(): void {
        this.movePastCloseHelper(true);
    }
    //@+node:felix.20240612000335.2: *5* ec.movePastCloseHelper
    private movePastCloseHelper(extend: boolean): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        c.widgetWantsFocusNow(w);
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        // Scan backwards for i,j.
        let i = ins;
        while (i >= 0 && s[i] !== '\n') {
            if (s[i] === '(') {
                break;
            }
            i--;
        }
        if (i < 0 || s[i] === '\n') {
            return;
        }
        let j = ins;
        while (j >= 0 && s[j] !== '\n') {
            if (s[j] === '(') {
                break;
            }
            j--;
        }
        if (i < j) {
            return;
        }
        // Scan forward for i2,j2.
        let i2 = ins;
        while (i2 < s.length && s[i2] !== '\n') {
            if (s[i2] === ')') {
                break;
            }
            i2++;
        }
        if (i2 >= s.length || s[i2] === '\n') {
            return;
        }
        let j2 = ins;
        while (j2 < s.length && s[j2] !== '\n') {
            if (s[j2] === ')') {
                break;
            }
            j2++;
        }
        if (i2 > j2) {
            return;
        }
        this.moveToHelper(i2 + 1, extend);
    }
    //@+node:felix.20240612222106.1: *4* ec.pages & helper
    @cmd('back-page', 'Move the cursor back one page, extending the selection if in extend mode.')
    backPage(): void {
        this.movePageHelper('back', false);
    }
    @cmd('back-page-extend-selection', 'Extend the selection by moving the cursor back one page.')
    backPageExtendSelection(): void {
        this.movePageHelper('back', true);
    }
    @cmd('forward-page', 'Move the cursor forward one page, extending the selection if in extend mode.')
    forwardPage(): void {
        this.movePageHelper('forward', false);
    }
    @cmd('forward-page-extend-selection', 'Extend the selection by moving the cursor forward one page.')
    forwardPageExtendSelection(): void {
        this.movePageHelper('forward', true);
    }
    //@+node:felix.20240612222106.2: *5* ec.movePageHelper
    /**
     * Move the cursor up/down one page, possibly extending the selection.
     */
    private movePageHelper(kind: string, extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const linesPerPage = 15;  // To do.
        const ins = w.getInsertPoint();
        const s = w.getAllText();
        const lines = g.splitLines(s);
        const [row, col] = g.convertPythonIndexToRowCol(s, ins);
        let row2;
        if (kind === 'back') {
            row2 = Math.max(0, row - linesPerPage);
        } else {
            row2 = Math.min(row + linesPerPage, lines.length - 1);
        }
        if (row === row2) {
            return;
        }
        const spot = g.convertRowColToPythonIndex(s, row2, col, lines);
        this.extendHelper(w, extend, spot, true);
    }
    //@+node:felix.20240612222722.1: *4* ec.paragraphs & helpers
    @cmd('back-paragraph', 'Move the cursor to the previous paragraph.')
    public backwardParagraph(): void {
        this.backwardParagraphHelper(false);
    }
    @cmd('back-paragraph-extend-selection', 'Extend the selection by moving the cursor to the previous public paragraph.')
    backwardParagraphExtendSelection(): void {
        this.backwardParagraphHelper(true);
    }
    @cmd('forward-paragraph', 'Move the cursor to the next paragraph.')
    public forwardParagraph(): void {
        this.forwardParagraphHelper(false);
    }
    @cmd('forward-paragraph-extend-selection', 'Extend the selection by moving the cursor to the next public paragraph.')
    forwardParagraphExtendSelection(): void {
        this.forwardParagraphHelper(true);
    }
    //@+node:felix.20240612222722.2: *5* ec.backwardParagraphHelper
    private backwardParagraphHelper(extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return; // Defensive check
        }
        const s = w.getAllText();
        let [i, j] = w.getSelectionRange();
        [i, j] = g.getLine(s, j);
        let line = s.slice(i, j);
        if (line.trim()) {
            // Find the start of the present paragraph.
            while (i > 0) {
                [i, j] = g.getLine(s, i - 1);
                line = s.slice(i, j);
                if (!line.trim()) {
                    break;
                }
            }
        }
        // Find the end of the previous paragraph.
        while (i > 0) {
            [i, j] = g.getLine(s, i - 1);
            line = s.slice(i, j);
            if (line.trim()) {
                i = j - 1;
                break;
            }
        }
        this.moveToHelper(i, extend);
    }
    //@+node:felix.20240612222722.3: *5* ec.forwardParagraphHelper
    forwardParagraphHelper(extend: boolean): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        let [i, j] = g.getLine(s, ins);
        let line = s.slice(i, j);
        if (line.trim()) {  // Skip past the present paragraph.
            this.selectParagraphHelper(w, i);
            [i, j] = w.getSelectionRange();
            j += 1;
        }
        // Skip to the next non-blank line.
        i = j;
        while (j < s.length) {
            [i, j] = g.getLine(s, j);
            line = s.slice(i, j);
            if (line.trim()) {
                break;
            }
        }
        w.setInsertPoint(ins);  // Restore the original insert point.
        this.moveToHelper(i, extend);
    }
    //@+node:felix.20240612223137.1: *4* ec.pushCursor and popCursor
    @cmd('pop-cursor', 'Restore the node, selection range and insert point from the stack.')
    public popCursor(): void {
        const c = this.c;
        const w = this.editWidget();
        if (w && this.cursorStack.length > 0) {
            const [p, i, j, ins] = this.cursorStack.pop()!;
            if (c.positionExists(p)) {
                c.selectPosition(p);
                c.redraw();
                w.setSelectionRange(i, j, ins);
                c.bodyWantsFocus();
            } else {
                g.es('invalid position', c.p.h);
            }
        } else if (!w) {
            g.es('no stacked cursor');
        }
    }
    @cmd('push-cursor', 'Push the selection range and insert point on the stack.')
    public pushCursor(): void {
        const c = this.c;
        const w = this.editWidget();
        if (w) {
            const p = c.p.copy();
            const [i, j] = w.getSelectionRange();
            const ins = w.getInsertPoint();
            this.cursorStack.push([p, i, j, ins]);
        } else {
            g.es('cursor not pushed');
        }
    }
    //@+node:felix.20240612223143.1: *4* ec.selectAllText
    @cmd('select-all', 'Select all text.')
    public selectAllText(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
    }
    //@+node:felix.20240612223716.1: *4* ec.sentences & helpers
    @cmd('back-sentence', 'Move the cursor to the previous sentence.')
    public backSentence(): void {
        this.backSentenceHelper(false);
    }
    @cmd('back-sentence-extend-selection', 'Extend the selection by moving the cursor to the previous sentence.')
    public backSentenceExtendSelection(): void {
        this.backSentenceHelper(true);
    }
    @cmd('forward-sentence', 'Move the cursor to the next sentence.')
    public forwardSentence(): void {
        this.forwardSentenceHelper(false);
    }
    @cmd('forward-sentence-extend-selection', 'Extend the selection by moving the cursor to the next sentence.')
    public forwardSentenceExtendSelection(): void {
        this.forwardSentenceHelper(true);
    }
    //@+node:felix.20240612223716.2: *5* ec.backSentenceHelper
    private backSentenceHelper(extend: boolean): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;  // pragma: no cover (defensive)
        }
        c.widgetWantsFocusNow(w);
        const s = w.getAllText();
        let ins = w.getInsertPoint();
        // Find the starting point of the scan.
        let i = ins;
        i -= 1;  // Ensure some progress.
        if (i < 0 || i >= s.length) {
            return;
        }
        // Tricky.
        if (s[i] === '.') {
            i -= 1;
        }
        while (i >= 0 && s[i] === ' ' || s[i] === '\n') {
            i -= 1;
        }
        if (i >= ins) {
            i -= 1;
        }
        if (i >= s.length) {
            i -= 1;
        }
        if (i <= 0) {
            return;
        }
        if (s[i] === '.') {
            i -= 1;
        }
        // Scan backwards to the end of the paragraph.
        // Stop at empty lines.
        // Skip periods within words.
        // Stop at sentences ending in non-periods.
        let end = false;
        while (!end && i >= 0) {
            const progress = i;
            if (s[i] === '.') {
                // Skip periods surrounded by letters/numbers
                if (i > 0 && s[i - 1].match(/[\w\d]/) && s[i + 1].match(/[\w\d]/)) {
                    i -= 1;
                } else {
                    i += 1;
                    while (i < s.length && (s[i] === ' ' || s[i] === '\n')) {
                        i += 1;
                    }
                    i -= 1;
                    break;
                }
            } else if (s[i] === '\n') {
                let j = i - 1;
                while (j >= 0) {
                    if (s[j] === '\n') {
                        // Don't include first newline.
                        end = true;
                        break;  // found blank line.
                    } else if (s[j] === ' ') {
                        j -= 1;
                    } else {
                        i -= 1;
                        break;  // no blank line found.
                    }
                }
                if (!end) {
                    i -= 1;
                }
            } else {
                i -= 1;
            }
            g.assert(end || progress > i);
        }
        i += 1;
        if (i < ins) {
            this.moveToHelper(i, extend);
        }
    }
    //@+node:felix.20240612223716.3: *5* ec.forwardSentenceHelper
    private forwardSentenceHelper(extend: boolean): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        c.widgetWantsFocusNow(w);
        const s = w.getAllText();
        let ins = w.getInsertPoint();
        if (ins >= s.length) {
            return;
        }
        // Find the starting point of the scan.
        let i = ins;
        if (i + 1 < s.length && s[i + 1] === '.') {
            i += 1;
        }
        if (s[i] === '.') {
            i += 1;
        } else {
            while (i < s.length && (s[i] === ' ' || s[i] === '\n')) {
                i += 1;
            }
            i -= 1;
        }
        if (i <= ins) {
            i += 1;
        }
        if (i >= s.length) {
            return;
        }
        // Scan forward to the end of the paragraph.
        // Stop at empty lines.
        // Skip periods within words.
        // Stop at sentences ending in non-periods.
        let end = false;
        while (!end && i < s.length) {
            const progress = i;
            if (s[i] === '.') {
                // Skip periods surrounded by letters/numbers
                if (i > 0 && s[i - 1].match(/[\w\d]/) && s[i + 1].match(/[\w\d]/)) {
                    i += 1;
                } else {
                    i += 1;
                    break;  // Include the paragraph.
                }
            } else if (s[i] === '\n') {
                let j = i + 1;
                while (j < s.length) {
                    if (s[j] === '\n') {
                        // Don't include first newline.
                        end = true;
                        break;  // found blank line.
                    } else if (s[j] === ' ') {
                        j += 1;
                    } else {
                        i += 1;
                        break;  // no blank line found.
                    }
                }
                if (!end) {
                    i += 1;
                }
            } else {
                i += 1;
            }
            g.assert(end || progress < i);
        }
        i = Math.min(i, s.length);
        if (i > ins) {
            this.moveToHelper(i, extend);
        }
    }
    //@+node:felix.20240612223723.1: *4* ec.startOfLine/ExtendSelection
    @cmd('start-of-line', 'Move the cursor to the first non-blank character of the line.')
    public startOfLine(): void {
        this.moveWithinLineHelper('start-line', false);
    }

    @cmd('start-of-line-extend-selection', 'Extend the selection by moving the cursor to the first non-blank character of the line.')
    public startOfLineExtendSelection(): void {
        this.moveWithinLineHelper('start-line', true);
    }
    //@+node:felix.20240612225351.1: *3* ec: paragraph
    //@+node:felix.20240612225351.2: *4* ec.backwardKillParagraph
    @cmd('backward-kill-paragraph', 'Kill the previous paragraph.')
    public backwardKillParagraph(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        this.beginCommand(w, 'backward-kill-paragraph');
        try {
            this.backwardParagraphHelper(true);
            let [i, j] = w.getSelectionRange();
            if (i > 0) {
                i = Math.min(i + 1, j);
            }
            c.killBufferCommands.killParagraphHelper(i, j);
            w.setSelectionRange(i, i, i);
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240612225351.3: *4* ec.fillRegion
    @cmd('fill-region', 'Fill all paragraphs in the selected text.')
    public fillRegion(): void {
        const c = this.c;
        const p = this.c.p;
        const undoType = 'fill-region';
        const w = this.editWidget();
        const [i, j] = w.getSelectionRange();
        c.undoer.beforeChangeGroup(p, undoType);

        while (true) {
            const progress = w.getInsertPoint();
            c.reformatParagraph('reformat-paragraph');
            const ins = w.getInsertPoint();
            const s = w.getAllText();
            w.setInsertPoint(ins);
            if (progress >= ins || ins >= j || ins >= s.length) {
                break;
            }
        }

        c.undoer.afterChangeGroup(p, undoType);
    }
    //@+node:felix.20240612225351.4: *4* ec.fillRegionAsParagraph
    @cmd('fill-region-as-paragraph', 'Fill the selected text.')
    public fillRegionAsParagraph(): void {
        const w = this.editWidget();
        if (!w || !this._chckSel()) {
            return;
        }
        this.beginCommand(w, 'fill-region-as-paragraph');
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240612225351.5: *4* ec.fillParagraph
    @cmd('fill-paragraph', 'Fill the selected paragraph')
    public fillParagraph(): void {
        const w = this.editWidget();
        if (!w) {
            return;  // Defensive check
        }
        // Clear the selection range.
        const [i, j] = w.getSelectionRange();
        w.setSelectionRange(i, i, i);
        this.c.reformatParagraph();
    }
    //@+node:felix.20240612225351.6: *4* ec.killParagraph
    @cmd('kill-paragraph', 'Kill the present paragraph.')
    public killParagraph(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        this.beginCommand(w, 'kill-paragraph');
        try {
            this.extendToParagraph();
            const [i, j] = w.getSelectionRange();
            c.killBufferCommands.killParagraphHelper(i, j);
            w.setSelectionRange(i, i, i);
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240612225351.7: *4* ec.extend-to-paragraph & helper
    @cmd('extend-to-paragraph', 'Select the paragraph surrounding the cursor.')
    public extendToParagraph(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        let ins = w.getInsertPoint();
        let [i, j] = g.getLine(s, ins);
        let line = s.slice(i, j);
        // Find the start of the paragraph.
        if (line.trim()) {  // Search backward.
            while (i > 0) {
                let [i2, j2] = g.getLine(s, i - 1);
                line = s.slice(i2, j2);
                if (line.trim()) {
                    i = i2;
                } else {
                    break;  // Use the previous line.
                }
            }
        } else {  // Search forward.
            while (j < s.length) {
                [i, j] = g.getLine(s, j);
                line = s.slice(i, j);
                if (line.trim()) {
                    break;
                }
            }
            if (!line.trim()) {
                return;
            }
        }
        // Select from i to the end of the paragraph.
        this.selectParagraphHelper(w, i);
    }
    //@+node:felix.20240612225351.8: *5* ec.selectParagraphHelper
    /**
     * Select from start to the end of the paragraph.
     */
    private selectParagraphHelper(w: StringTextWrapper, start: number): void {
        const s = w.getAllText();
        let [i1, j] = g.getLine(s, start);
        while (j < s.length) {
            let [i, j2] = g.getLine(s, j);
            const line = s.slice(i, j2);
            if (line.trim()) {
                j = j2;
            } else {
                break;
            }
        }
        j = Math.max(start, j - 1);
        w.setSelectionRange(i1, j, j);
    }
    //@+node:felix.20240613005114.1: *3* ec: region
    //@+node:felix.20240613005114.2: *4* ec.tabIndentRegion (indent-rigidly)
    @cmd('indent-rigidly', 'Insert a hard tab at the start of each line of the selected text.')
    public tabIndentRegion(): void {
        const w = this.editWidget();
        if (!w || !this._chckSel()) {
            return;
        }
        this.beginCommand(w, 'indent-rigidly');
        let s = w.getAllText();
        const [i1, j1] = w.getSelectionRange();
        const [i, junk1] = g.getLine(s, i1);
        const [junk2, j] = g.getLine(s, j1);
        const lines = g.splitlines(s.substring(i, j));
        const n = lines.length;
        const lines_s = lines.map(line => '\t' + line).join('');
        s = s.substring(0, i) + lines_s + s.substring(j);
        w.setAllText(s);
        // Retain original row/col selection.
        w.setSelectionRange(i1, j1 + n, j1 + n);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240613005114.3: *4* ec.countRegion
    @cmd('count-region', 'Print the number of lines and characters in the selected text.')
    public countRegion(): void {
        /**  */
        const w = this.editWidget();
        if (!w) {
            return;  // pragma: no cover (defensive)
        }
        const txt = w.getSelectedText();
        let lines = 1;
        let chars = 0;
        for (const z of txt) {
            if (z === '\n') {
                lines += 1;
            } else {
                chars += 1;
            }
        }
        g.es(
            `Region has ${lines} lines, ` +
            `${chars} character${g.plural(chars)}`
        );
    }
    //@+node:felix.20240613005114.4: *4* ec.moveLinesDown
    @cmd('move-lines-down', 'Move all lines containing any selected text down one line.')
    public moveLinesDown(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        let s = w.getAllText();
        const [sel_1, sel_2] = w.getSelectionRange();
        const insert_pt = w.getInsertPoint();
        const [i, junk1] = g.getLine(s, sel_1);
        const [i2, j] = g.getLine(s, sel_2);
        const lines = s.substring(i, j);
        // Select from start of the first line to the *start* of the last line.
        // This prevents selection creep.
        this.beginCommand(w, 'move-lines-down');
        try {
            const [next_i, next_j] = g.getLine(s, j);  // 2011/04/01: was j+1
            const next_line = s.substring(next_i, next_j);
            let n2 = next_j - next_i;
            if (j < s.length) {
                w.delete(i, next_j);
                let new_lines: string;
                if (next_line.endsWith('\n')) {
                    // Simply swap positions with next line
                    new_lines = next_line + lines;
                } else {
                    // Last line of the body to be moved up doesn't end in a newline
                    // while we have to remove the newline from the line above moving down.
                    new_lines = next_line + '\n' + lines.slice(0, -1);
                    n2 += 1;
                }
                w.insert(i, new_lines);
                w.setSelectionRange(sel_1 + n2, sel_2 + n2, insert_pt + n2);
            } else {
                // Leo 5.6: insert a blank line before the selected lines.
                w.insert(i, '\n');
                w.setSelectionRange(sel_1 + 1, sel_2 + 1, insert_pt + 1);
            }
            // Fix bug 799695: colorizer bug after move-lines-up into a docstring
            c.recolor();
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240613005114.5: *4* ec.moveLinesUp
    @cmd('move-lines-up', 'Move all lines containing any selected text up one line.')
    public moveLinesUp(): void {
        const c = this.c;
        const w = this.editWidget();
        if (!w) {
            return;  // pragma: no cover (defensive)
        }
        let s = w.getAllText();
        const [sel_1, sel_2] = w.getSelectionRange();
        const insert_pt = w.getInsertPoint();  // 2011/04/01
        const [i, junk1] = g.getLine(s, sel_1);
        const [i2, j] = g.getLine(s, sel_2);
        const lines = s.substring(i, j);
        this.beginCommand(w, 'move-lines-up');
        try {
            const [prev_i, prev_j] = g.getLine(s, i - 1);
            const prev_line = s.substring(prev_i, prev_j);
            const n2 = prev_j - prev_i;
            if (i > 0) {
                w.delete(prev_i, j);
                let new_lines: string;
                if (lines.endsWith('\n')) {
                    // Simply swap positions with next line
                    new_lines = lines + prev_line;
                } else {
                    // Lines to be moved up don't end in a newline while the
                    // previous line going down needs its newline taken off.
                    new_lines = lines + '\n' + prev_line.slice(0, -1);
                }
                w.insert(prev_i, new_lines);
                w.setSelectionRange(sel_1 - n2, sel_2 - n2, insert_pt - n2);
            } else {
                // Leo 5.6: Insert a blank line after the line.
                w.insert(j, '\n');
                w.setSelectionRange(sel_1, sel_2, sel_1);
            }
            // Fix bug 799695: colorizer bug after move-lines-up into a docstring
            c.recolor();
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240613005114.6: *4* ec.reverseRegion
    @cmd('reverse-region', 'Reverse the order of lines in the selected text.')
    public reverseRegion(): void {
        const w = this.editWidget();
        if (!w || !this._chckSel()) {
            return;
        }
        this.beginCommand(w, 'reverse-region');
        const s = w.getAllText();
        const [i1, j1] = w.getSelectionRange();
        const [i, junk1] = g.getLine(s, i1);
        const [junk2, j] = g.getLine(s, j1);
        const txt = s.substring(i, j);
        let aList = txt.split('\n');
        aList.reverse();
        const newText = aList.join('\n') + '\n';
        w.setAllText(s.substring(0, i1) + newText + s.substring(j1));
        const ins = i1 + newText.length - 1;
        w.setSelectionRange(ins, ins, ins);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240613005114.7: *4* ec.up/downCaseRegion & helper
    @cmd('downcase-region', 'Convert all characters in the selected text to lower case.')
    public downCaseRegion(): void {
        this.caseHelper('low', 'downcase-region');
    }

    @cmd('toggle-case-region', 'Toggle the case of all characters in the selected text.')
    public toggleCaseRegion(): void {
        this.caseHelper('toggle', 'toggle-case-region');
    }

    @cmd('upcase-region', 'Convert all characters in the selected text to UPPER CASE.')
    public upCaseRegion(): void {
        this.caseHelper('up', 'upcase-region');
    }

    private caseHelper(way: string, undoType: string): void {
        const w = this.editWidget();
        if (!w || !w.hasSelection()) {
            return;  // pragma: no cover (defensive)
        }
        this.beginCommand(w, undoType);
        const s = w.getAllText();
        const [i, j] = w.getSelectionRange();
        const ins = w.getInsertPoint();
        let s2 = s.substring(i, j);
        let sel: string;
        if (way === 'low') {
            sel = s2.toLowerCase();
        } else if (way === 'up') {
            sel = s2.toUpperCase();
        } else {
            console.assert(way === 'toggle');
            sel = s2.split('').map(c => c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()).join('');
        }
        const newText = s.substring(0, i) + sel + s.substring(j);
        const changed = newText !== s;
        if (changed) {
            w.setAllText(newText);
            w.setSelectionRange(i, j, ins);
        }
        this.endCommand(undefined, changed, true);
    }
    //@+node:felix.20240613205401.1: *3* ec: sort
    //@+at
    // XEmacs provides several commands for sorting text in a buffer.  All
    // operate on the contents of the region (the text between point and the
    // mark).  They divide the text of the region into many "sort records",
    // identify a "sort key" for each record, and then reorder the records
    // using the order determined by the sort keys.  The records are ordered so
    // that their keys are in alphabetical order, or, for numerical sorting, in
    // numerical order.  In alphabetical sorting, all upper-case letters `A'
    // through `Z' come before lower-case `a', in accordance with the ASCII
    // character sequence.
    //
    //    The sort commands differ in how they divide the text into sort
    // records and in which part of each record they use as the sort key.
    // Most of the commands make each line a separate sort record, but some
    // commands use paragraphs or pages as sort records.  Most of the sort
    // commands use each entire sort record as its own sort key, but some use
    // only a portion of the record as the sort key.
    //
    // `M-x sort-lines'
    //      Divide the region into lines and sort by comparing the entire text
    //      of a line.  A prefix argument means sort in descending order.
    //
    // `M-x sort-paragraphs'
    //      Divide the region into paragraphs and sort by comparing the entire
    //      text of a paragraph (except for leading blank lines).  A prefix
    //      argument means sort in descending order.
    //
    // `M-x sort-pages'
    //      Divide the region into pages and sort by comparing the entire text
    //      of a page (except for leading blank lines).  A prefix argument
    //      means sort in descending order.
    //
    // `M-x sort-fields'
    //      Divide the region into lines and sort by comparing the contents of
    //      one field in each line.  Fields are defined as separated by
    //      whitespace, so the first run of consecutive non-whitespace
    //      characters in a line constitutes field 1, the second such run
    //      constitutes field 2, etc.
    //
    //      You specify which field to sort by with a numeric argument: 1 to
    //      sort by field 1, etc.  A negative argument means sort in descending
    //      order.  Thus, minus 2 means sort by field 2 in reverse-alphabetical
    //      order.
    //
    // `M-x sort-numeric-fields'
    //      Like `M-x sort-fields', except the specified field is converted to
    //      a number for each line and the numbers are compared.  `10' comes
    //      before `2' when considered as text, but after it when considered
    //      as a number.
    //
    // `M-x sort-columns'
    //      Like `M-x sort-fields', except that the text within each line used
    //      for comparison comes from a fixed range of columns.  An explanation
    //      is given below.
    //
    //    For example, if the buffer contains:
    //
    //      On systems where clash detection (locking of files being edited) is
    //      implemented, XEmacs also checks the first time you modify a buffer
    //      whether the file has changed on disk since it was last visited or
    //      saved.  If it has, you are asked to confirm that you want to change
    //      the buffer.
    //
    // then if you apply `M-x sort-lines' to the entire buffer you get:
    //
    //      On systems where clash detection (locking of files being edited) is
    //      implemented, XEmacs also checks the first time you modify a buffer
    //      saved.  If it has, you are asked to confirm that you want to change
    //      the buffer.
    //      whether the file has changed on disk since it was last visited or
    //
    // where the upper case `O' comes before all lower case letters.  If you
    // apply instead `C-u 2 M-x sort-fields' you get:
    //
    //      saved.  If it has, you are asked to confirm that you want to change
    //      implemented, XEmacs also checks the first time you modify a buffer
    //      the buffer.
    //      On systems where clash detection (locking of files being edited) is
    //      whether the file has changed on disk since it was last visited or
    //
    // where the sort keys were `If', `XEmacs', `buffer', `systems', and `the'.
    //
    //    `M-x sort-columns' requires more explanation.  You specify the
    // columns by putting point at one of the columns and the mark at the other
    // column.  Because this means you cannot put point or the mark at the
    // beginning of the first line to sort, this command uses an unusual
    // definition of `region': all of the line point is in is considered part
    // of the region, and so is all of the line the mark is in.
    //
    //    For example, to sort a table by information found in columns 10 to
    // 15, you could put the mark on column 10 in the first line of the table,
    // and point on column 15 in the last line of the table, and then use this
    // command.  Or you could put the mark on column 15 in the first line and
    // point on column 10 in the last line.
    //
    //    This can be thought of as sorting the rectangle specified by point
    // and the mark, except that the text on each line to the left or right of
    // the rectangle moves along with the text inside the rectangle.  *Note
    // Rectangles::.
    //@+node:felix.20240613205401.2: *4* ec.sortLines commands
    @cmd('reverse-sort-lines-ignoring-case', 'Sort the selected lines in reverse order, ignoring case.')
    public reverseSortLinesIgnoringCase(): void {
        return this.sortLines(true, true);
    }
    @cmd('reverse-sort-lines', 'Sort the selected lines in reverse order.')
    public reverseSortLines(): void {
        return this.sortLines(false, true);
    }
    @cmd('sort-lines-ignoring-case', 'Sort the selected lines, ignoring case.')
    public sortLinesIgnoringCase(): void {
        return this.sortLines(true, false);
    }
    @cmd('sort-lines', 'Sort the selected lines.')
    public sortLines(ignoreCase: boolean = false, reverse: boolean = false): void {
        const w = this.editWidget();
        if (!this._chckSel()) {
            return;
        }
        const undoType = reverse ? 'reverse-sort-lines' : 'sort-lines';
        this.beginCommand(w, undoType);
        try {
            let s = w.getAllText();
            const [sel1, sel2] = w.getSelectionRange();
            const ins = w.getInsertPoint();
            const [i, _] = g.getLine(s, sel1);
            const [__, j] = g.getLine(s, sel2);
            let s2 = s.substring(i, j);
            if (!s2.endsWith('\n')) {
                s2 += '\n';
            }
            const aList = g.splitLines(s2);

            const lower = (str: string) => ignoreCase ? str.toLowerCase() : str;

            aList.sort((a, b) => lower(a).localeCompare(lower(b)));
            if (reverse) {
                aList.reverse();
            }
            s = aList.join('');
            w.delete(i, j);
            w.insert(i, s);
            w.setSelectionRange(sel1, sel2, ins);
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240613205401.3: *4* ec.sortColumns
    @cmd('sort-columns', 'Sort lines of selected text using only lines in the given columns to do the comparison.')
    sortColumns(): void {
        /**
         * Sort lines of selected text using only lines in the given columns to do
         * the comparison.
         */
        const w = this.editWidget();
        if (!this._chckSel()) {
            return; // pragma: no cover (defensive)
        }
        const s = w.getAllText();

        const toInt = (index: string): number => {
            return g.toPythonIndex(s, index);
        };

        this.beginCommand(w, 'sort-columns');
        try {
            const [sel_1, sel_2] = w.getSelectionRange();
            const [sint1, sint2] = g.convertPythonIndexToRowCol(s, sel_1);
            const [sint3, sint4] = g.convertPythonIndexToRowCol(s, sel_2);
            const startLine = sint1 + 1;
            const endLine = sint3 + 1;
            const [i, _] = g.getLine(s, sel_1);
            const [__, j] = g.getLine(s, sel_2);
            const txt = s.substring(i, j);
            const columns = Array.from({ length: endLine - startLine + 1 }, (_, z) =>
                w.get(toInt(`${startLine + z}.${sint2}`), toInt(`${startLine + z}.${sint4}`))
            );
            const aList = g.splitLines(txt);
            const zlist = columns.map((col, idx) => [col, aList[idx]] as [string, string]);
            zlist.sort((a, b) => a[0].localeCompare(b[0]));
            const sortedText = zlist.map(z => z[1]).join('');
            w.delete(i, j);
            w.insert(i, sortedText);
            w.setSelectionRange(sel_1, sel_1 + sortedText.length, sel_1 + sortedText.length);
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240613205401.4: *4* ec.sortFields
    @cmd('sort-fields', 'Divide the selected text into lines and sort by comparing the contents of one field in each line.')
    public sortFields(which: string | null = null): void {
        /**
         * Divide the selected text into lines and sort by comparing the contents
         * of one field in each line. Fields are defined as separated by
         * whitespace, so the first run of consecutive non-whitespace characters
         * in a line constitutes field 1, the second such run constitutes field 2,
         * etc.
         * 
         * You specify which field to sort by with a numeric argument: 1 to sort
         * by field 1, etc. A negative argument means sort in descending order.
         * Thus, minus 2 means sort by field 2 in reverse-alphabetical order.
         */
        const w = this.editWidget();
        if (!w || !this._chckSel()) {
            return;
        }
        this.beginCommand(w, 'sort-fields');
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const [r1, r2, r3, r4] = this.getRectanglePoints(w);
        const [i, _] = g.getLine(s, r1);
        const [__, j] = g.getLine(s, r4);
        let txt = s.substring(i, j);
        const txtLines = txt.split('\n');
        const fields: string[] = [];
        const fn = '\\w+';
        const frx = new RegExp(fn, 'g');
        for (const line of txtLines) {
            const f = line.match(frx);
            if (!f) continue;
            if (!which) {
                fields.push(f[0]);
            } else {
                let index = parseInt(which, 10);
                if (Math.abs(index) > f.length) {
                    return;
                }
                index = index > 0 ? index - 1 : f.length + index;
                fields.push(f[index]);
            }
        }
        const nz = fields.map((field, idx) => [field, txtLines[idx]] as [string, string]);
        nz.sort(([fieldA], [fieldB]) => which && which.startsWith('-') ? fieldB.localeCompare(fieldA) : fieldA.localeCompare(fieldB));
        w.delete(i, j);
        let int1 = i;
        for (const [, line] of nz) {
            // TODO : CHECK IF OK !
            // w.insert(`${int1}.0`, `${line}\n`);
            w.insert(int1, `${line}\n`);
            int1 += 1;
        }
        w.setInsertPoint(ins);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240613212929.1: *3* ec: swap/transpose
    //@+node:felix.20240613212929.2: *4* ec.transposeLines
    @cmd('transpose-lines', 'Transpose the line containing the cursor with the preceding line.')
    public transposeLines(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const ins = w.getInsertPoint();
        const s = w.getAllText();
        if (!s.trim()) {
            return;
        }
        const [i, j] = g.getLine(s, ins);
        const line1 = s.substring(i, j);
        this.beginCommand(w, 'transpose-lines');
        if (i === 0) { // Transpose the next line.
            const [i2, j2] = g.getLine(s, j + 1);
            const line2 = s.substring(i2, j2);
            w.delete(0, j2);
            w.insert(0, line2 + line1);
            w.setInsertPoint(j2 - 1);
        } else { // Transpose the previous line.
            const [i2, j2] = g.getLine(s, i - 1);
            const line2 = s.substring(i2, j2);
            w.delete(i2, j);
            w.insert(i2, line1 + line2);
            w.setInsertPoint(j - 1);
        }
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240613212929.3: *4* ec.transposeWords
    @cmd('transpose-words', 'Transpose the word before the cursor with the word after the cursor')
    public transposeWords(): void {
        /**
        * Transpose the word before the cursor with the word after the cursor
        * Punctuation between words does not move. For example, ‘FOO, BAR’
        * transposes into ‘BAR, FOO’.
        */
        const w = this.editWidget();
        if (!w) {
            return;
        }
        this.beginCommand(w, 'transpose-words');
        const s = w.getAllText();
        let [i1, j1] = this.extendToWord(false);
        const s1 = s.substring(i1, j1);
        if (i1 > j1) {
            [i1, j1] = [j1, i1];
        }
        // Search for the next word.
        let k = j1 + 1;
        while (k < s.length && s[k] !== '\n' && !g.isWordChar1(s[k])) {
            k += 1;
        }
        const changed = k < s.length;
        if (changed) {
            const ws = s.substring(j1, k);
            w.setInsertPoint(k + 1);
            const [i2, j2] = this.extendToWord(false);
            const s2 = s.substring(i2, j2);
            const s3 = s.substring(0, i1) + s2 + ws + s1 + s.substring(j2);
            w.setAllText(s3);
            w.setSelectionRange(j1, j1, j1);
        }
        this.endCommand(undefined, changed, true);
    }
    //@+node:felix.20240613212929.4: *4* ec.swapCharacters & transeposeCharacters
    @cmd('transpose-chars', 'Swap the characters at the cursor.')
    public transposeCharacters(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        this.beginCommand(w, 'swap-characters');
        const s = w.getAllText();
        const i = w.getInsertPoint();
        if (0 < i && i < s.length) {
            w.setAllText(s.substring(0, i - 1) + s[i] + s[i - 1] + s.substring(i + 1));
            w.setSelectionRange(i, i, i);
        }
        this.endCommand(undefined, true, true);
    }

    public swapCharacters(): void {
        this.transposeCharacters();
    }
    //@+node:felix.20220503225545.1: *3* ec: uA's
    //@+node:felix.20220503225545.2: *4* ec.clearNodeUas & clearAllUas
    @cmd('clear-node-uas', "Clear the uA's in the selected VNode.")
    public clearNodeUas(): void {
        const c = this.c;
        const p = c && c.p;
        if (p && p.__bool__() && p.v.u && Object.keys(p.v.u).length) {
            p.v.u = {};
            // #1276.
            p.setDirty();
            c.setChanged();
            c.redraw();
        }
    }

    @cmd('clear-all-uas', 'Clear all uAs in the entire outline.')
    public clearAllUas(): void {
        const c = this.c;
        const u = this.c.undoer;
        const undoType = 'clear-all-uas';
        // #1276.
        let changed = false;
        u.beforeChangeGroup(c.p, undoType);
        for (let p of c.all_unique_positions()) {
            if (p.v.u && Object.keys(p.v.u).length) {
                const bunch = u.beforeChangeUA(p);
                p.v.u = {};
                p.setDirty();
                u.afterChangeUA(p, undoType, bunch);
                changed = true;
            }
        }

        if (changed) {
            c.setChanged();
            u.afterChangeGroup(c.p, undoType);
            c.redraw();
        }
    }
    //@+node:felix.20220503225545.3: *4* ec.showUas & showAllUas
    @cmd('show-all-uas', "Print all uA's in the outline.")
    public showAllUas(): void {
        g.es_print('Dump of uAs...');
        for (let v of this.c.all_unique_nodes()) {
            if (v.u && Object.keys(v.u).length) {
                this.showNodeUas(v);
            }
        }
    }

    @cmd('show-node-uas', "Print the uA's in the selected node.")
    public showNodeUas(v?: VNode): void {
        const c = this.c;
        let d: { [key: string]: any };
        let h: string;

        if (v) {
            d = v.u;
            h = v.h;
        } else {
            d = c.p.v.u;
            h = c.p.h;
        }
        g.es_print(h);
        g.es_print(g.objToString(d));
    }
    //@+node:felix.20220503225545.4: *4* ec.setUa
    @cmd(
        'set-ua',
        'Prompt for the name and value of a uA, then set the uA in the present node.'
    )
    public async setUa(): Promise<boolean> {
        let w_name = '';

        let w_uaName = await g.app.gui.get1Arg({
            title: 'Set ua',
            prompt: 'Set unknown attribute name',
            placeHolder: 'Attribute Name',
        });
        // Trim string and re-check if valid string
        if (w_uaName && w_uaName.trim()) {
            w_uaName = w_uaName.trim();
            w_name = w_uaName;

            const w_uaVal = await g.app.gui.get1Arg({
                title: 'Set ua to',
                prompt: 'Set unknown attribute value',
                placeHolder: 'Attribute Value',
            });

            if (
                w_name &&
                !(typeof w_uaVal === 'undefined' || w_uaVal === null)
            ) {
                // ok got both name and val
                const c = this.c;
                const u = this.c.undoer;
                const p = c.p;

                if (!p.v.u) {
                    p.v.u = {}; // assert at least an empty dict if null or non existent
                }
                const bunch = u.beforeChangeUA(p);
                p.v.u[w_name] = w_uaVal;
                u.afterChangeUA(p, 'set-ua', bunch);
                this.showNodeUas();
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }

    //@-others
}
//@-others

// @cmd
// with top level being @g.command
//@-leo
