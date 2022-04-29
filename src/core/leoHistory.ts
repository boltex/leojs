//@+leo-ver=5-thin
//@+node:felix.20211021231651.1: * @file src/core/leoHistory.ts
import { Commands } from './leoCommands';
import { Position } from './leoNodes';
//@+others
//@+node:felix.20211021231651.2: ** class NodeHistory
/**
 * * A class encapsulating knowledge of visited nodes.
 */
export class NodeHistory {

    public c: Commands;
    public beadList: [Position, any][]; // a list of (position,chapter) tuples.
    public beadPointer: number;
    public skipBeadUpdate: boolean;

    //@+others
    //@+node:felix.20211021231651.3: *3* NodeHistory.ctor
    constructor(c: Commands) {
        this.c = c;
        this.beadList = []; // a list of (position,chapter) tuples.
        this.beadPointer = -1;
        this.skipBeadUpdate = false;
    }

    //@+node:felix.20211021231651.4: *3* NodeHistory.dump
    /**
     * * Dump the beadList
     */
    public dump(): void {
        this.beadList.forEach((data, i) => {
            let p: Position | string = data[0];
            let chapter: any | string = data[1];
            if (p && p.__bool__()) {
                p = p.h;
            } else {
                p = 'no p';
            }
            if (chapter) {
                chapter = chapter.name;
            } else {
                chapter = 'main';
            }
            const mark: string = i === this.beadPointer ? '**' : '  '; // used in string
            console.log(`${mark} ${i} ${chapter} ${p}`);
        });
    }

    //@+node:felix.20211021231651.5: *3* NodeHistory.goNext
    /**
     * * Select the next node, if possible.
     */
    public goNext(): void {
        if (this.beadPointer + 1 < this.beadList.length) {
            this.beadPointer += 1;
            const p = this.beadList[this.beadPointer][0];
            const chapter = this.beadList[this.beadPointer][1];
            this.select(p, chapter);
        }
    }

    //@+node:felix.20211021231651.6: *3* NodeHistory.goPrev
    /**
     * * Select the previously visited node, if possible.
     */
    public goPrev(): void {
        if (this.beadPointer > 0) {
            this.beadPointer -= 1;
            const p = this.beadList[this.beadPointer][0];
            const chapter = this.beadList[this.beadPointer][1];
            this.select(p, chapter);
        }
    }

    //@+node:felix.20211021231651.7: *3* NodeHistory.select
    /**
     * Update the history list when selecting p.
     * Called only from self.goToNext/PrevHistory
     */
    public select(p: Position, chapter: any): void {
        const c: Commands = this.c;
        const cc = this.c.chapterController;
        if (cc && c.positionExists(p)) {
            this.skipBeadUpdate = true;
            try {
                const oldChapter = cc.getSelectedChapter();
                if (oldChapter !== chapter) {
                    cc.selectChapterForPosition(p, chapter);
                }
                c.selectPosition(p);  // Calls cc.selectChapterForPosition
            }
            finally {
                this.skipBeadUpdate = false;
            }
        }
        // Fix bug #180: Always call this.update here.
        this.update(p, false);
    }

    //@+node:felix.20211021231651.8: *3* NodeHistory.update
    /**
     * Update the beadList while p is being selected.
     * Called *only* from c.frame.tree.selectHelper.
     */
    public update(p: Position, change: boolean = true): void {
        const c: Commands = this.c;
        const cc = this.c.chapterController;
        if (!p.__bool__() || !c.positionExists(p) || this.skipBeadUpdate) {
            return;
        }
        // A hack: don't add @chapter nodes.
        // These are selected during the transitions to a new chapter.
        if (p.h.startsWith('@chapter ')) {
            return;
        }
        // Fix bug #180: handle the change flag.
        const aList: [Position, any][] = [];
        let found: number = -1;

        this.beadList.forEach((data, i) => {
            const p2: Position | string = data[0];
            const junk_chapter: any | string = data[1];

            if (c.positionExists(p2)) {
                if (p.__eq__(p2)) {
                    if (change) {
                        //pass  // We'll append later.
                    } else if (found === -1) {
                        found = i;
                        aList.push(data);
                    } else {
                        // pass  // Remove any duplicate.
                    }
                } else {
                    aList.push(data);
                }
            }
        });

        if (change || found === -1) {
            const data: [Position, any] = [p.copy(), cc.getSelectedChapter()];
            aList.push(data);
            this.beadPointer = aList.length - 1;
        } else {
            this.beadPointer = found;
        }
        this.beadList = aList;
    }

    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
