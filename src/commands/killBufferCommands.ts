//@+leo-ver=5-thin
//@+node:felix.20240612230730.1: * @file src/commands/killBufferCommands.ts
/**
 * Leo's kill-buffer commands.
 */
//@+<< killBufferCommands imports & annotations >>
//@+node:felix.20240612230730.2: ** << killBufferCommands imports & annotations >>
import * as g from '../core/leoGlobals';
import { new_cmd_decorator } from '../core/decorators';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
//@-<< killBufferCommands imports & annotations >>

/**
 * Command decorator for the KillBufferCommandsClass class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'killBufferCommands']);
}

//@+others
//@+node:felix.20240613222219.1: ** class KillBufferIterClass
/**
 * Returns a list of positions in a subtree, possibly including the root of the subtree.
 */
class KillBufferIterClass {

    public c: Commands;
    public index: number;

    //@+others
    //@+node:felix.20240613222219.2: *3* __init__ & __iter__ (iterateKillBuffer)
    /**
     * Ctor for KillBufferIterClass class. 
     */
    constructor(c: Commands) {
        this.c = c;
        this.index = 0; // The index of the next item to be returned.
    }

    [Symbol.iterator]() {
        return this;
    }
    //@+node:felix.20240613222219.3: *3* __next__
    next(): { value: string | null, done: boolean } {
        const commands = this.c.killBufferCommands;
        const aList = g.app.globalKillBuffer;

        if (!aList) {
            this.index = 0;
            return { value: null, done: true };
        }

        let i: number;
        if (commands.reset == null) {
            i = this.index;
        } else {
            i = commands.reset;
            commands.reset = null;
        }

        if (i < 0 || i >= aList.length) {
            i = 0;
        }

        const val = aList[i];
        this.index = i + 1;

        return { value: val, done: false };
    }
    //@-others

}
//@+node:felix.20240612230730.3: ** class KillBufferCommandsClass
/**
 * A class to manage the kill buffer.
 */
export class KillBufferCommandsClass {



    public kbiterator: KillBufferIterClass; // Instance of KillBufferIterClass
    public last_clipboard: string | null;
    public lastYankP: Position | undefined; // Assuming 'Position' type as 'any'
    public reset: number | null;
    public addWsToKillRing: boolean | undefined;
    public c: Commands;

    //@+others
    //@+node:felix.20240612230730.4: *3* kill.ctor & reloadSettings
    constructor(c: any) {

        this.c = c;
        this.kbiterator = this.iterateKillBuffer(); // An instance of KillBufferIterClass.
        // For interacting with system clipboard.
        this.last_clipboard = null;
        // Position of the last item returned by iterateKillBuffer.
        this.lastYankP = undefined;
        // The index of the next item to be returned in
        // g.app.globalKillBuffer by iterateKillBuffer.
        this.reset = null;
        this.reloadSettings();
    }

    reloadSettings(): void {
        /** KillBufferCommandsClass.reloadSettings. */
        const c = this.c;
        this.addWsToKillRing = c.config.getBool('add-ws-to-kill-ring');
    }
    //@+node:felix.20240612230730.5: *3* addToKillBuffer
    /**
     * Insert the text into the kill buffer if force is True or
     * the text contains something other than whitespace.
     */
    addToKillBuffer(text: string): void {
        if (this.addWsToKillRing || text.trim()) {
            g.app.globalKillBuffer = g.app.globalKillBuffer.filter((z: string) => z !== text);
            g.app.globalKillBuffer.unshift(text);
        }
    }
    //@+node:felix.20240612230730.6: *3* backwardKillSentence
    @cmd('backward-kill-sentence', 'Kill the previous sentence.')
    public backwardKillSentence(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;

        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        // Adjust the string to mimic Python's rfind with the 'start' parameter by slicing the string.
        let i = s.slice(ins).lastIndexOf('.');
        if (i === -1) {
            return;
        }
        {
            using changes = u.change_node(p, 'backward-kill-sentence');

            i += ins;  // Add the offset back.
            const i2 = s.lastIndexOf('.', i - 1) + 1;
            this.killHelper(i2, i + 1, w);
            w.setInsertPoint(i2);
            // c.k.resetLabel();
            p.v.b = w.getAllText();
        }
    }
    //@+node:felix.20240612230730.7: *3* backwardKillWord & killWord
    @cmd('backward-kill-word', 'Kill the previous word.')
    public backwardKillWord(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }

        {
            using changes = u.change_node(p, 'backward-kill-word');
            c.editCommands.backwardWord();
            c.editCommands.extendToWord();
            let [i, j] = w.getSelectionRange();
            this.killHelper(i, j, w);
            if (g.app.is_body_wrapper(w)) {
                p.v.b = w.getAllText();
            }
            // c.k.resetLabel();
        }

    }
    @cmd('kill-word', 'Kill the word containing the cursor.')
    public killWord(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        {
            using changes = u.change_node(p, 'kill-word');

            c.editCommands.extendToWord();
            let [i, j] = w.getSelectionRange();
            this.killHelper(i, j, w);
            if (g.app.is_body_wrapper(w)) {
                p.v.b = w.getAllText();
            }
            // c.k.resetLabel();
        }

    }

    //@+node:felix.20240612230730.8: *3* clearKillRing
    @cmd('clear-kill-ring', 'Clear the kill ring.')
    public clearKillRing(): void {
        g.app.globalKillBuffer = [];
    }
    //@+node:felix.20240612230730.9: *3* getClipboard
    /**
     * Return the contents of the clipboard. 
     */
    public async getClipboard(): Promise<string | null> {
        try {
            const ctxt = await g.app.gui.asyncGetTextFromClipboard();
            if (!g.app.globalKillBuffer || ctxt !== this.last_clipboard) {
                this.last_clipboard = ctxt;
                if (!g.app.globalKillBuffer || g.app.globalKillBuffer[0] !== ctxt) {
                    return ctxt;
                }
            }
        } catch (e) {
            g.es_exception();
        }
        return null;
    }
    //@+node:felix.20240613225718.1: *3* iterateKillBuffer
    public iterateKillBuffer(): KillBufferIterClass {
        return new KillBufferIterClass(this.c);
    }
    //@+node:felix.20240612230730.13: *3* ec.killHelper
    /**
     * A helper method for all kill commands except kill-paragraph commands.
     */
    public killHelper(
        frm: number,
        to: number,
        w: any
    ): void {

        const c = this.c;
        w = c.frame.body.wrapper;
        if (!w) {
            return;
        }
        // Extend (frm, to) if it spans a line.
        const old_y_scroll = w.getYScrollPosition();
        const [i, j] = w.getSelectionRange();
        let s = w.get(i, j);
        if (s.indexOf('\n') > -1) {
            frm = i;
            to = j;
        }
        s = w.get(frm, to);

        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
        w.delete(frm, to);
        w.setInsertPoint(frm);
        w.setYScrollPosition(old_y_scroll);
        g.app.gui.set_focus(c, w);  // 2607
    }
    //@+node:felix.20240612230730.14: *3* ec.killParagraphHelper
    /**
     * A helper method for kill-paragraph commands. 
     */
    public killParagraphHelper(
        frm: number,
        to: number,
    ): void {
        const c = this.c;
        const p = c.p;

        const w = c.frame.body.wrapper;
        if (!w) {
            return;
        }
        const s = w.get(frm, to);

        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
        w.delete(frm, to);
        p.v.b = w.getAllText();
        w.setInsertPoint(frm);
    }
    //@+node:felix.20240612230730.15: *3* ec.killToEndOfLine
    @cmd('kill-to-end-of-line', 'Kill from the cursor to end of the line. ')
    public killToEndOfLine(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        let [i, j] = g.getLine(s, ins);
        if (ins >= s.length && g.match(s, j - 1, '\n')) {
            // Kill the trailing newline of the body text.
            i = Math.max(0, s.length - 1);
            j = s.length;
        } else if (ins + 1 < j && s.substring(ins, j - 1).trim() && g.match(s, j - 1, '\n')) {
            // Kill the line, but not the newline.
            [i, j] = [ins, j - 1];
        } else if (g.match(s, j - 1, '\n')) {
            i = ins;  // Kill the newline in the present line.
        } else {
            i = j;
        }
        if (i < j) {
            {
                using changes = u.change_node(p, 'kill-to-end-of-line');

                this.killHelper(i, j, w);
                if (g.app.is_body_wrapper(w)) {
                    p.v.b = w.getAllText();
                }
                // c.k.resetLabel()
            }
        }
    }
    //@+node:felix.20240612230730.16: *3* ec.killLine
    @cmd('kill-line', 'Kill the line containing the cursor.')
    public killLine(): void {
        /** Kill the line containing the cursor. */
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        let [i, j] = g.getLine(s, ins);
        if (ins >= s.length && g.match(s, j - 1, '\n')) {
            // Kill the trailing newline of the body text.
            i = Math.max(0, s.length - 1);
            j = s.length;
        } else if (j > i + 1 && g.match(s, j - 1, '\n')) {
            // Kill the line, but not the newline.
            j -= 1;
        } else {
            // Kill the newline in the present line.
        }
        {
            using changes = u.change_node(p, 'kill-line');
            this.killHelper(i, j, w);
            p.v.b = w.getAllText();
            //v c.k.resetLabel();
        }
    }
    //@+node:felix.20240612230730.17: *3* killRegion & killRegionSave
    @cmd('kill-region', 'Kill the text selection.')
    public killRegion(): void {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        const [i, j] = w.getSelectionRange();
        if (i === j) {
            return;
        }
        const s = w.getSelectedText();
        {
            using changes = u.change_node(p, 'kill-region');
            w.delete(i, j);
            p.v.b = w.getAllText();
            w.setInsertPoint(i);
        }

        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
    }

    @cmd(
        'kill-region-save',
        'Add the selected text to the kill ring, but do not delete it.'
    )
    public killRegionSave(): void {
        const c = this.c;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        const [i, j] = w.getSelectionRange();
        if (i === j) {
            return;
        }
        const s = w.getSelectedText();
        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
    }
    //@+node:felix.20240612230730.18: *3* ec.killSentence
    @cmd('kill-sentence', 'Kill the sentence containing the cursor.')
    public killSentence(): void {
        /** Kill the sentence containing the cursor. */
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const i = s.indexOf('.', ins);
        if (i === -1) {
            return;
        }
        {
            using changes = u.change_node(p, 'kill-sentence');
            const i2 = s.lastIndexOf('.', ins) + 1;
            this.killHelper(i2, i + 1, w);
            p.v.b = w.getAllText();
            // c.k.resetLabel();
        }

    }
    //@+node:felix.20240612230730.19: *3* killWs
    @cmd('kill-ws', 'Kill whitespace.')
    public killWs(undoType: string = 'kill-ws'): void {
        let ws = '';
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }
        const s = w.getAllText();
        let i = w.getInsertPoint();
        let j = i;
        const ins = i;

        while (i >= 0 && (s[i] === ' ' || s[i] === '\t')) {
            i -= 1;
        }
        if (i < ins) {
            i += 1;
        }
        while (j < s.length && (s[j] === ' ' || s[j] === '\t')) {
            j += 1;
        }
        if (j > i) {
            {
                using changes = u.change_node(p, 'kill-ws');

                ws = s.substring(i, j);
                w.delete(i, j);

                if (this.addWsToKillRing) {
                    this.addToKillBuffer(ws);
                }
                if (g.app.is_body_wrapper(w)) {
                    p.v.b = w.getAllText();
                }
                w.setInsertPoint(i);
            }

        }
    }
    //@+node:felix.20240612230730.20: *3* yank & yankPop
    @cmd('yank', 'Insert the next entry of the kill ring.')
    public async yank(): Promise<void> {
        /** Insert the next entry of the kill ring. */
        await this.yankHelper(false);
    }

    @cmd('yank-pop', 'Insert the first entry of the kill ring.')
    public async yankPop(): Promise<void> {
        /** Insert the first entry of the kill ring. */
        await this.yankHelper(true);
    }

    private async yankHelper(pop: boolean): Promise<void> {
        /**
         * Helper for yank and yank-pop:
         * pop = False: insert the first entry of the kill ring.
         * pop = True:  insert the next entry of the kill ring.
         */
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }

        if (!p || !p.v) {
            return;
        }
        const text = w.getAllText();
        let [i, j] = w.getSelectionRange();
        const clip_text = await this.getClipboard();
        if (!g.app.globalKillBuffer && !clip_text) {
            return;
        }
        const undoType = pop ? 'yank-pop' : 'yank';

        {
            using changes = u.change_node(p, undoType);

            if (!pop || this.lastYankP && !this.lastYankP.__eq__(p)) {
                this.reset = 0;
            }
            let s = this.kbiterator.next().value;
            if (s == null) {
                s = clip_text || '';
            }
            if (i !== j) {
                w.deleteTextSelection();
            }
            if (s !== s.trimStart()) {  // s contains leading whitespace.
                const [i2, j2] = g.getLine(text, i);
                const k = g.skip_ws(text, i2);
                if (i2 < i && i <= k) {
                    // Replace the line's leading whitespace by s's leading whitespace.
                    w.delete(i2, k);
                    i = i2;
                }
            }
            w.insert(i, s);
            w.setInsertPoint(i + s.length);
            this.lastYankP = p.copy();
            if (g.app.is_body_wrapper(w)) {
                p.v.b = w.getAllText();
            }
            // c.k.resetLabel();
        }
    }
    //@+node:felix.20240612230730.21: *3* zapToCharacter
    @cmd('zap-to-character', 'Kill characters from the insertion point to a given character.')
    public async zapToCharacter(): Promise<void> {
        const c = this.c;
        const p = c.p;
        const u = c.undoer;
        const w = c.frame.body.wrapper;
        if (!g.isTextWrapper(w)) {
            return;
        }

        let ch = await g.app.gui.get1Char({
            title: 'Zap To Character',
            prompt: 'Type a character to zap to:',
            placeHolder: 'Character to zap to',
        });
        if (!ch) {
            ch = ' ';
        }

        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const i = s.indexOf(ch, ins);
        if (i === -1) {
            return;
        }
        {
            using changes = u.change_node(p, 'zap-to-char');

            this.addToKillBuffer(s.substring(ins, i));
            void g.app.gui.replaceClipboardWith(s.substring(ins, i));  // Support for proper yank.
            w.setAllText(s.substring(0, ins) + s.substring(i));
            w.setInsertPoint(ins);
            p.v.b = w.getAllText();
            // c.k.resetLabel();
        }

    }
    //@-others

}
//@-others
//@-leo
