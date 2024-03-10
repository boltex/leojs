//@+leo-ver=5-thin
//@+node:felix.20211021231651.1: * @file src/core/leoHistory.ts
import * as g from './leoGlobals';
import { Chapter } from './leoChapters';
import { Commands } from './leoCommands';
import { Position } from './leoNodes';

//@+others
//@+node:felix.20211021231651.2: ** class NodeHistory
/**
 * * A class encapsulating knowledge of visited nodes.
 */
export class NodeHistory {
    public c: Commands;
    public beadList: [Position, Chapter | undefined][]; // a list of (position,chapter) tuples.
    public beadPointer: number;
    public skipBeadUpdate: boolean;

    //@+others
    //@+node:felix.20211021231651.3: *3* NodeHistory.ctor
    constructor(c: Commands) {
        this.c = c;
        this.beadList = []; // a list of (position,chapter) tuples.
        this.beadPointer = -1;
        this.skipBeadUpdate = false;
        g.assert(g && Object.keys(g).length);
    }

    //@+node:felix.20211021231651.4: *3* NodeHistory.dump
    /**
     * * Dump the beadList
     */
    public dump(): void {
        if (g.unitTesting || !this.beadList.length) {
            return;
        }
        // g.es_print(`NodeHistory.beadList: ${c.shortFileName()}:`);
        this.beadList.forEach((data, i) => {
            let p: Position = data[0];
            let p_s: string;
            let chapter: Chapter | undefined = data[1];
            let chapter_s: string;
            if (p && p.__bool__()) {
                p_s = p.h;
            } else {
                p_s = 'no p';
            }
            if (chapter) {
                chapter_s = chapter.name;
            } else {
                chapter_s = 'main';
            }
            const mark: string = i === this.beadPointer ? '**' : '  '; // used in string
            g.es_print(`${mark} ${i} ${chapter_s} ${p_s}`);
        });
    }

    //@+node:felix.20211021231651.5: *3* NodeHistory.goNext
    /**
     * * Select the next node, if possible.
     */
    public goNext(): void {
        let c = this.c;
        if (this.beadPointer + 1 >= this.beadList.length) {
            return;
        }
        this.beadPointer += 1;
        let [p, chapter] = this.beadList[this.beadPointer];
        if (c.positionExists(p)) {
            [p, chapter] = this.beadList[this.beadPointer];
            this.update(p);
            this.select(p, chapter);
        } else {
            this.beadList.splice(this.beadPointer, 1);
            this.beadPointer -= 1;
        }
    }

    //@+node:felix.20211021231651.6: *3* NodeHistory.goPrev
    /**
     * * Select the previously visited node, if possible.
     */
    public goPrev(): void {
        const c = this.c;
        if (this.beadPointer <= 0) {
            return;
        }
        this.beadPointer -= 1;
        let [p, chapter] = this.beadList[this.beadPointer];
        if (c.positionExists(p)) {
            [p, chapter] = this.beadList[this.beadPointer];
            this.update(p);
            this.select(p, chapter);
        } else {
            delete this.beadList[this.beadPointer];
            this.beadPointer += 1;
        }
    }

    //@+node:felix.20211021231651.7: *3* NodeHistory.select
    /**
     * Select p in the given chapter.
     */
    public select(p: Position, chapter: Chapter | undefined): void {
        const c = this.c;
        const cc = this.c.chapterController;
        g.assert(c.positionExists(p), p.toString());
        const oldChapter = cc.getSelectedChapter();
        if (oldChapter !== chapter) {
            cc.selectChapterForPosition(p, chapter);
        }
        c.selectPosition(p); // Calls cc.selectChapterForPosition
    }

    //@+node:felix.20211021231651.8: *3* NodeHistory.update
    /**
     * Update the beadList while p is being selected.
     */
    public update(p: Position): void {
        const c = this.c;
        const cc = this.c.chapterController;
        if (!p || !c.positionExists(p)) {
            return;
        }

        // Don't add @chapter nodes.
        // These are selected during the transitions to a new chapter.
        if (p.h.startsWith('@chapter ')) {
            return;
        }

        // #3800: Do nothing if p is the top of the bead list.
        const last_p = this.beadList.length > 0 ? this.beadList[this.beadList.length - 1][0] : null;
        if (last_p === p) {
            return;
        }

        // #3800: Remove p from the bead list, adjusting the bead pointer.
        let n_deleted = 0;
        for (const z of this.beadList) {
            if (z[0].v === p.v) {
                n_deleted += 1;
            }
        }
        this.beadList = this.beadList.filter(z => z[0].v !== p.v);
        this.beadPointer -= n_deleted;

        // #3800: Insert an entry in the *middle* of the bead list, *not* at the end.
        const data: [Position, Chapter | undefined] = [p.copy(), cc.getSelectedChapter()];
        this.beadList.splice(this.beadPointer + 1, 0, data);
        this.beadPointer += 1;
    }

    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
