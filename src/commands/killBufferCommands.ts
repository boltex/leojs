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
import { BaseEditCommandsClass } from './baseCommands';
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
export class KillBufferCommandsClass extends BaseEditCommandsClass {

    public kbiterator: KillBufferIterClass; // Instance of KillBufferIterClass
    public last_clipboard: string | null;
    public lastYankP: Position | undefined; // Assuming 'Position' type as 'any'
    public reset: number | null;
    public addWsToKillRing: boolean | undefined;

    //@+others
    //@+node:felix.20240612230730.4: *3* kill.ctor & reloadSettings
    constructor(c: any) {
        super(c); // Call the parent class constructor
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
        const w = this.editWidget();
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
        i += ins;  // Add the offset back.
        const undoType = 'backward-kill-sentence';
        this.beginCommand(w, undoType);
        const i2 = s.lastIndexOf('.', i - 1) + 1;
        this.killHelper(i2, i + 1, w, undoType);
        w.setInsertPoint(i2);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240612230730.7: *3* backwardKillWord & killWord
    @cmd('backward-kill-word', 'Kill the previous word.')
    public backwardKillWord(): void {
        const c = this.c;
        const w = this.editWidget();
        if (w) {
            this.beginCommand(w, 'backward-kill-word');
            c.editCommands.backwardWord();
            this.killWordHelper();
        }
    }
    @cmd('kill-word', 'Kill the word containing the cursor.')
    public killWord(): void {
        const w = this.editWidget();
        if (w) {
            this.beginCommand(w, 'kill-word');
            this.killWordHelper();
        }
    }

    private killWordHelper(): void {
        const c = this.c;
        const e = c.editCommands;
        const w = e.editWidget();
        if (w) {
            // this.killWs();
            e.extendToWord();
            const [i, j] = w.getSelectionRange();
            this.killHelper(i, j, w);
            this.endCommand(undefined, true, true);
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
        w: any,
        undoType?: string,
    ): void {

        const c = this.c;
        w = this.editWidget();
        if (!w) {
            return;
        }
        // Extend (frm, to) if it spans a line.
        const [i, j] = w.getSelectionRange();
        let s = w.get(i, j);
        if (s.indexOf('\n') > -1) {
            frm = i;
            to = j;
        }
        s = w.get(frm, to);
        if (undoType) {
            this.beginCommand(w, undoType);
        }
        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
        w.delete(frm, to);
        w.setInsertPoint(frm);
        if (undoType) {
            this.endCommand(undefined, true, true);
        }
        g.app.gui.set_focus(c, w);  // 2607
    }
    //@+node:felix.20240612230730.14: *3* ec.killParagraphHelper
    /**
     * A helper method for kill-paragraph commands. 
     */
    public killParagraphHelper(
        frm: number,
        to: number,
        undoType?: string,
    ): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.get(frm, to);
        if (undoType) {
            this.beginCommand(w, undoType);
        }
        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
        w.delete(frm, to);
        w.setInsertPoint(frm);
        if (undoType) {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240612230730.15: *3* ec.killToEndOfLine
    @cmd('kill-to-end-of-line', 'Kill from the cursor to end of the line. ')
    public killToEndOfLine(): void {
        const w = this.editWidget();
        if (!w) {
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
            this.killHelper(i, j, w, 'kill-to-end-of-line');
        }
    }
    //@+node:felix.20240612230730.16: *3* ec.killLine
    @cmd('kill-line', 'Kill the line containing the cursor.')
    public killLine(): void {
        /** Kill the line containing the cursor. */
        const w = this.editWidget();
        if (!w) {
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
        this.killHelper(i, j, w, 'kill-line');
    }
    //@+node:felix.20240612230730.17: *3* killRegion & killRegionSave
    @cmd('kill-region', 'Kill the text selection.')
    public killRegion(): void {
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const [i, j] = w.getSelectionRange();
        if (i === j) {
            return;
        }
        const s = w.getSelectedText();
        this.beginCommand(w, 'kill-region');
        w.delete(i, j);
        this.endCommand(undefined, true, true);
        this.addToKillBuffer(s);
        void g.app.gui.replaceClipboardWith(s);
    }

    @cmd(
        'kill-region-save',
        'Add the selected text to the kill ring, but do not delete it.'
    )
    public killRegionSave(): void {
        const w = this.editWidget();
        if (!w) {
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
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const s = w.getAllText();
        const ins = w.getInsertPoint();
        const i = s.indexOf('.', ins);
        if (i === -1) {
            return;
        }
        const undoType = 'kill-sentence';
        this.beginCommand(w, undoType);
        const i2 = s.lastIndexOf('.', ins) + 1;
        this.killHelper(i2, i + 1, w, undoType);
        w.setInsertPoint(i2);
        this.endCommand(undefined, true, true);
    }
    //@+node:felix.20240612230730.19: *3* killWs
    @cmd('kill-ws', 'Kill whitespace.')
    public killWs(undoType: string = 'kill-ws'): void {
        let ws = '';
        const w = this.editWidget();
        if (!w) {
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
            ws = s.substring(i, j);
            w.delete(i, j);
            if (undoType) {
                this.beginCommand(w, undoType);
            }
            if (this.addWsToKillRing) {
                this.addToKillBuffer(ws);
            }
            if (undoType) {
                this.endCommand(undefined, true, true);
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
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const current: Position = c.p;
        if (!current) {
            return;
        }
        const text = w.getAllText();
        let [i, j] = w.getSelectionRange();
        const clip_text = await this.getClipboard();
        if (!g.app.globalKillBuffer && !clip_text) {
            return;
        }
        const undoType = pop ? 'yank-pop' : 'yank';
        this.beginCommand(w, undoType);
        try {
            if (!pop || this.lastYankP && this.lastYankP !== current) {
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
            // Fix bug 1099035: Leo yank and kill behavior not quite the same as emacs.
            // w.setSelectionRange(i,i+len(s),insert=i+len(s))
            w.setInsertPoint(i + s.length);
            this.lastYankP = current.copy();
        } finally {
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20240612230730.21: *3* zapToCharacter
    @cmd('zap-to-character', 'Kill characters from the insertion point to a given character.')
    zapToCharacter(): void {
        const k = this.c.k;
        const w = this.editWidget();
        if (!w) {
            return;
        }
        const state = k.getState('zap-to-char');
        if (state === 0) {
            k.setLabelBlue('Zap To Character: ');
            k.setState('zap-to-char', 1, this.zapToCharacter.bind(this));
        } else {
            const ch = ' ';
            k.resetLabel();
            k.clearState();
            const s = w.getAllText();
            const ins = w.getInsertPoint();
            const i = s.indexOf(ch, ins);
            if (i === -1) {
                return;
            }
            this.beginCommand(w, 'zap-to-char');
            this.addToKillBuffer(s.substring(ins, i));
            void g.app.gui.replaceClipboardWith(s.substring(ins, i));  // Support for proper yank.
            w.setAllText(s.substring(0, ins) + s.substring(i));
            w.setInsertPoint(ins);
            this.endCommand(undefined, true, true);
        }
    }
    //@-others

}
//@-others
//@-leo
