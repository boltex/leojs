//@+leo-ver=5-thin
//@+node:felix.20240615152154.1: * @file src/commands/bufferCommands.ts
/**
 * Leo's buffer commands.
 */
//@+<< bufferCommands imports & annotations >>
//@+node:felix.20240615152154.2: ** << bufferCommands imports & annotations >>
import * as g from '../core/leoGlobals';
import { new_cmd_decorator } from '../core/decorators';
import { Commands } from '../core/leoCommands';
import { Position, VNode } from '../core/leoNodes';
import { BaseEditCommandsClass } from './baseCommands';
//@-<< bufferCommands imports & annotations >>

/**
 * Command decorator for the BufferCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'bufferCommands']);
}

//@+others
//@+node:felix.20240615152154.3: ** class BufferCommandsClass
/**
 * An Emacs instance does not have knowledge of what is considered a buffer in the environment.
 */
export class BufferCommandsClass extends BaseEditCommandsClass {

    public fromName: string; // Saved name from getBufferName.
    public nameList: string[];  // [n: <headline>]
    public names: Record<string, string[]>;
    public vnodes: Record<string, VNode>;  // Keys are n: <headline>, values are vnodes.

    //@+others
    //@+node:felix.20240615152154.4: *3* buffer.ctor
    /**
     * Ctor for the BufferCommandsClass class.
     */
    constructor(c: Commands) {
        super(c); // Call the parent class constructor
        this.c = c;
        this.fromName = '';  // Saved name from getBufferName.
        this.nameList = [];  // [n: <headline>]
        this.names = {};
        this.vnodes = {};  // Keys are n: <headline>, values are vnodes.
    }
    //@+node:felix.20240615152154.5: *3* buffer.Entry points
    //@+node:felix.20240615152154.6: *4* appendToBuffer
    @cmd(
        'buffer-append-to',
        'Add the selected body text to the end of the body text of a named buffer (node).'
    )
    public async appendToBuffer(): Promise<void> {

        const w = this.editWidget();
        if (!w) {
            return;
        }

        const name = await this.getBufferName('Append to buffer: ');
        if (!name) {
            return;
        }
        const c = this.c;

        const s = w.getSelectedText();
        const p = this.findBuffer(name);

        if (s && p && p.__bool__()) {
            c.selectPosition(p);
            this.beginCommand(w, `append-to-buffer: ${p.h}`);
            const end = w.getLastIndex();
            w.insert(end, s);
            w.setInsertPoint(end + s.length);
            w.seeInsertPoint();
            this.endCommand();
            c.recolor();
        }
    }
    //@+node:felix.20240615152154.7: *4* copyToBuffer
    @cmd(
        'buffer-copy',
        'Add the selected body text to the end of the body text of a named buffer (node).'
    )
    public async copyToBuffer(): Promise<void> {

        const w = this.editWidget();
        if (!w) {
            return;
        }

        const name = await this.getBufferName('Copy to buffer: ');
        if (!name) {
            return;
        }
        const c = this.c;

        const s = w.getSelectedText();
        const p = this.findBuffer(name);

        if (s && p && p.__bool__()) {
            c.selectPosition(p);
            this.beginCommand(w, `copy-to-buffer: ${p.h}`);
            w.insert(w.getLastIndex(), s);
            w.setInsertPoint(w.getLastIndex());
            this.endCommand();
            c.recolor();
        }
    }
    //@+node:felix.20240615152154.8: *4* insertToBuffer
    @cmd(
        'buffer-insert',
        'Add the selected body text at the insert point of the body text of a named buffer (node).'
    )
    public async insertToBuffer(): Promise<void> {

        const w = this.editWidget();
        if (!w) {
            return;
        }

        const name = await this.getBufferName('Insert to buffer: ');
        if (!name) {
            return;
        }
        const c = this.c;

        const s = w.getSelectedText();
        const p = this.findBuffer(name);

        if (s && p && p.__bool__()) {
            c.selectPosition(p);
            this.beginCommand(w, `insert-to-buffer: ${p.h}`);
            const i = w.getInsertPoint();
            w.insert(i, s);
            w.seeInsertPoint();
            this.endCommand();
        }
    }
    //@+node:felix.20240615152154.9: *4* killBuffer
    @cmd(
        'buffer-kill',
        'Delete a buffer (node) and all its descendants.'
    )
    public async killBuffer(): Promise<void> {

        const w = this.editWidget();
        if (!w) {
            return;
        }

        const name = await this.getBufferName('Kill buffer: ');
        if (!name) {
            return;
        }
        const c = this.c;

        const p = this.findBuffer(name);

        if (p && p.__bool__()) {
            const h = p.h;
            const current = c.p;
            c.selectPosition(p);
            c.deleteOutline(`kill-buffer: ${h}`);
            c.selectPosition(current);
            g.es(`Killed buffer: ${h}`);
            c.redraw(current);
        }
    }
    //@+node:felix.20240615152154.10: *4* listBuffers & listBuffersAlphabetically
    @cmd(
        'buffers-list',
        'List all buffers (node headlines), in outline order.'
    )
    public listBuffers(): void {
        /**
         * List all buffers (node headlines), in outline order. Nodes with the
         * same headline are disambiguated by giving their parent or child index.
         */
        this.computeData();
        g.es('buffers...');
        for (const name of this.nameList) {
            g.es('', name);
        }
    }

    @cmd(
        'buffers-list-alphabetically',
        'List all buffers (node headlines), in alphabetical order.'
    )
    listBuffersAlphabetically(): void {
        /**
         * List all buffers (node headlines), in alphabetical order. Nodes with
         * the same headline are disambiguated by giving their parent or child
         * index.
         */
        this.computeData();
        const names = [...this.nameList].sort();
        g.es('buffers...');
        for (const name of names) {
            g.es('', name);
        }
    }
    //@+node:felix.20240615152154.11: *4* prependToBuffer
    @cmd(
        'buffer-prepend-to',
        'Add the selected body text to the start of the body text of a named buffer (node).'
    )
    public async prependToBuffer(): Promise<void> {

        const w = this.editWidget();
        if (!w) {
            return;
        }

        const name = await this.getBufferName('Prepend to buffer: ');
        if (!name) {
            return;
        }
        const c = this.c;

        const s = w.getSelectedText();
        const p = this.findBuffer(name);

        if (s && p && p.__bool__()) {
            c.selectPosition(p);
            this.beginCommand(w, `prepend-to-buffer: ${p.h}`);
            w.insert(0, s);
            w.setInsertPoint(0);
            w.seeInsertPoint();
            this.endCommand();
            c.recolor();
        }

    }
    //@+node:felix.20240615152154.13: *4* switchToBuffer
    @cmd(
        'buffer-switch-to',
        'Select a buffer (node) by its name (headline).'
    )
    public async switchToBuffer(): Promise<void> {

        const name = await this.getBufferName('Switch to buffer: ');
        if (!name) {
            return;
        }
        const c = this.c;
        const p = this.findBuffer(name);

        if (p && p.__bool__()) {
            c.selectPosition(p);
            c.redraw_after_select(p);
        }
    }
    //@+node:felix.20240615152154.14: *3* buffer.Utils
    //@+node:felix.20240615152154.15: *4* computeData
    public computeData(): void {
        this.nameList = [];
        this.names = {};
        this.vnodes = {};
        for (const p of this.c.all_unique_positions()) {
            const h = p.h.trim();
            const v = p.v;
            let nameList = this.names[h] || [];
            let key;
            if (nameList.length) {
                if (p.parent()) {
                    key = `${h}, parent: ${p.parent().h}`;
                } else {
                    key = `${h}, child index: ${p.childIndex()}`;
                }
            } else {
                key = h;
            }
            this.nameList.push(key);
            this.vnodes[key] = v;
            nameList.push(key);
            this.names[h] = nameList;
        }
    }
    //@+node:felix.20240615152154.16: *4* findBuffer
    public findBuffer(name: string): Position | undefined {
        const v = this.vnodes[name];
        for (const p of this.c.all_unique_positions()) {
            if (p.v === v) {
                return p;
            }
        }
        g.es_print("no node named " + name);
        return undefined;
    }
    //@+node:felix.20240615152154.17: *4* getBufferName
    /** 
     * Get a buffer name.
     */
    public getBufferName(label: string): Thenable<string | undefined> {

        this.computeData();

        // Quick pick that shows all of this.nameList 
        return g.app.gui.get1Arg(
            {
                title: label,
                placeHolder: 'buffer name',
            },
            undefined,
            this.nameList
        );

    }
    //@-others

}
//@-others
//@-leo
