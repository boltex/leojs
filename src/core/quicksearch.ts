//@+leo-ver=5-thin
//@+node:felix.20221105221426.1: * @file src/core/quicksearch.ts
// Original by Ville M. Vainio <vivainio@gmail.com>.
//@+<< quicksearch imports >>
//@+node:felix.20221106160744.1: ** << quicksearch imports >>
import * as g from './leoGlobals';
import { Position, VNode } from './leoNodes';
import { Commands } from './leoCommands';
import { LeoUI } from '../leoUI';
//@-<< quicksearch imports >>
//@+others
//@+node:felix.20221105222427.1: ** class QuickSearchController (leoserver.py)
export class QuickSearchController {

    public c: Commands;
    public lw: string[];

    // ! OLD ! Keys are id(w),values are either tuples in tuples (w (p,Position)) or tuples (w, f)
    // ! OLD ! public its: {[key:string]:any};

    // array of tuples (w (p,Position)) use index to refer.
    public its: [
        { type: string; label: string; },
        [
            Position,
            [number, number] | undefined
        ] | undefined
    ][];

    public fileDirectives: string[];
    public _search_patterns: string[];
    public navText: string;
    public showParents: boolean;
    public isTag: boolean; // added concept to combine tag pane functionality
    public searchOptions: number;
    public searchOptionsStrings: string[];

    //@+others
    //@+node:felix.20221105235156.1: *3* QuickSearchController.__init__
    constructor(c: Commands) {
        this.c = c;
        this.lw = [];  // empty list
        // Keys are id(w),values are either tuples in tuples (w (p,Position)) or tuples (w, f)
        this.its = [];
        this.fileDirectives = [
            "@asis", "@auto",
            "@auto-md", "@auto-org", "@auto-otl", "@auto-rst",
            "@clean", "@file", "@edit"
        ];
        this._search_patterns = [];
        this.navText = '';
        this.showParents = true;
        this.isTag = false;  // added concept to combine tag pane functionality
        this.searchOptions = 0;
        this.searchOptionsStrings = ["All", "Subtree", "File", "Chapter", "Node"];
    }
    //@+node:felix.20221106235819.1: *3* Original translate source
    /**
     * Translate a shell PATTERN to a regular expression.
     * There is no way to quote meta-characters.
     */
    //public translate(pat: string): string {


    // STAR = object()
    // res = []
    // add = res.append
    // i, n = 0, len(pat)
    // while i < n:
    //     c = pat[i]
    //     i = i+1
    //     if c == '*':
    //         # compress consecutive `*` into one
    //         if (not res) or res[-1] is not STAR:
    //             add(STAR)
    //     elif c == '?':
    //         add('.')
    //     elif c == '[':
    //         j = i
    //         if j < n and pat[j] == '!':
    //             j = j+1
    //         if j < n and pat[j] == ']':
    //             j = j+1
    //         while j < n and pat[j] != ']':
    //             j = j+1
    //         if j >= n:
    //             add('\\[')
    //         else:
    //             stuff = pat[i:j]
    //             if '--' not in stuff:
    //                 stuff = stuff.replace('\\', r'\\')
    //             else:
    //                 chunks = []
    //                 k = i+2 if pat[i] == '!' else i+1
    //                 while True:
    //                     k = pat.find('-', k, j)
    //                     if k < 0:
    //                         break
    //                     chunks.append(pat[i:k])
    //                     i = k+1
    //                     k = k+3
    //                 chunks.append(pat[i:j])
    //                 # Escape backslashes and hyphens for set difference (--).
    //                 # Hyphens that create ranges shouldn't be escaped.
    //                 stuff = '-'.join(s.replace('\\', r'\\').replace('-', r'\-')
    //                                  for s in chunks)
    //             # Escape set operations (&&, ~~ and ||).
    //             stuff = re.sub(r'([&~|])', r'\\\1', stuff)
    //             i = j+1
    //             if stuff[0] == '!':
    //                 stuff = '^' + stuff[1:]
    //             elif stuff[0] in ('^', '['):
    //                 stuff = '\\' + stuff
    //             add(f'[{stuff}]')
    //     else:
    //         add(re.escape(c))
    // assert i == n

    // # Deal with STARs.
    // inp = res
    // res = []
    // add = res.append
    // i, n = 0, len(inp)
    // # Fixed pieces at the start?
    // while i < n and inp[i] is not STAR:
    //     add(inp[i])
    //     i += 1
    // # Now deal with STAR fixed STAR fixed ...
    // # For an interior `STAR fixed` pairing, we want to do a minimal
    // # .*? match followed by `fixed`, with no possibility of backtracking.
    // # We can't spell that directly, but can trick it into working by matching
    // #    .*?fixed
    // # in a lookahead assertion, save the matched part in a group, then
    // # consume that group via a backreference. If the overall match fails,
    // # the lookahead assertion won't try alternatives. So the translation is:
    // #     (?=(?P<name>.*?fixed))(?P=name)
    // # Group names are created as needed: g0, g1, g2, ...
    // # The numbers are obtained from _nextgroupnum() to ensure they're unique
    // # across calls and across threads. This is because people rely on the
    // # undocumented ability to join multiple translate() results together via
    // # "|" to build large regexps matching "one of many" shell patterns.
    // while i < n:
    //     assert inp[i] is STAR
    //     i += 1
    //     if i == n:
    //         add(".*")
    //         break
    //     assert inp[i] is not STAR
    //     fixed = []
    //     while i < n and inp[i] is not STAR:
    //         fixed.append(inp[i])
    //         i += 1
    //     fixed = "".join(fixed)
    //     if i == n:
    //         add(".*")
    //         add(fixed)
    //     else:
    //         groupnum = _nextgroupnum()
    //         add(f"(?=(?P<g{groupnum}>.*?{fixed}))(?P=g{groupnum})")
    // assert i == n
    // res = "".join(res)
    // return fr'(?s:{res})\Z'
    //}
    //@+node:felix.20221107011322.1: *3* translate & helper
    //based on fnmatch.py
    public escape(s: string): string {

        const escapable = /[.\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        const meta: { [key: string]: string } = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '\.': '\\.',
            '"': '\\"',
            '\\': '\\\\'
        };

        function escapechar(a: string) {
            let c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }
        return s.replace(escapable, escapechar);
    };

    public translate(pat: string): string {
        //Translate a shell PATTERN to a regular expression.
        //There is no way to quote meta-characters.

        let i = 0;
        let j = 0;
        let n = pat.length || 0;
        let res = '^';
        let c: string;
        let stuff: string;

        while (i < n) {
            c = pat[i];
            i = i + 1;
            if (c === '*') {
                res = res + '.*';
            } else if (c === '?') {
                res = res + '.';
            } else if (c === '[') {
                j = i;
                if (j < n && pat[j] === '!') {
                    j = j + 1;
                }
                if (j < n && pat[j] === ']') {
                    j = j + 1;
                }
                while (j < n && pat[j] !== ']') {
                    j = j + 1;
                }
                if (j >= n) {
                    res = res + '\\[';
                } else {
                    stuff = pat.slice(i, j).replace('\\', '\\\\');
                    i = j + 1;
                    if (stuff[0] === '!') {
                        stuff = '^' + stuff.slice(1);
                    } else if (stuff[0] === '^') {
                        stuff = '\\' + stuff;
                    }
                    res = res + '[' + stuff + ']';
                }
            } else {
                res = res + this.escape(c);
            }
        }
        return res + '$';

    }

    //@+node:felix.20221105222427.6: *3* addBodyMatches
    public addBodyMatches(positions: [Position, RegExp][]): number {
        let lineMatchHits = 0;

        for (let p of positions) {
            const it = { "type": "headline", "label": p[0].h };
            if (this.addItem(it, (p[0], undefined))) {
                return lineMatchHits; // Hit 999 limit 
            }
            const ms = this.matchlines(p[0].b, p[1]);

            for (let p_item of ms) {
                let ml;
                let pos;
                [ml, pos] = p_item;
                lineMatchHits += 1;
                const it2 = { "type": "body", "label": ml };
                if (this.addItem(it2, [p[0], pos])) {
                    return lineMatchHits; // Hit 999 limit 
                }
            }
        }

        return lineMatchHits; // Normal return < 999 hits

    }
    //@+node:felix.20221105222427.18: *3* addHeadlineMatches
    public addHeadlineMatches(position_list: [Position, RegExp | undefined][]): void {
        for (let p of position_list) {
            const it = { "type": "headline", "label": p[0].h };
            if (this.addItem(it, (p[0], undefined))) {
                return; // 999 limit hit
            }
        }
    }
    //@+node:felix.20221105222427.19: *3* addItem
    public addItem(it: { type: string; label: string; }, val: [Position, [number, number] | undefined] | undefined): boolean {
        this.its.push([it, val]);
        // changed to 999 from 3000 to replace old threadutil behavior
        return this.its.length > 999;  // Limit to 999 for now

    }
    //@+node:felix.20221105222427.20: *3* addParentMatches
    public addParentMatches(parent_list: { [key: string]: [Position, RegExp | undefined][] }): number {
        let lineMatchHits = 0;
        for (let parent_key in parent_list) { // Get key with 'for in'
            const parent_value = parent_list[parent_key];

            const v = this.c.fileCommands.gnxDict[parent_key];
            const h = v ? v.h : parent_key;
            const it = { "type": "parent", "label": h };

            // ! unused !
            // else:
            //     it = {"type": "parent", "label": parent_key[0].h}

            if (this.addItem(it, [parent_value[0][0], undefined])) { // TODO : TEST THIS!
                return lineMatchHits;
            }

            for (let p_item of parent_value) {
                let p;
                let m;
                [p, m] = p_item;
                const it = { "type": "headline", "label": p.h };
                if (this.addItem(it, [p, undefined])) {
                    return lineMatchHits;
                }
                if (m !== undefined) { // p might not have body matches
                    const ms = this.matchlines(p.b, m);
                    for (let p_ms of ms) {
                        let match_list;
                        let pos;
                        [match_list, pos] = p_ms;
                        lineMatchHits += 1;
                        const it = { "type": "body", "label": match_list };
                        if (this.addItem(it, [p, pos])) {
                            return lineMatchHits;
                        }
                    }
                }
            }

        }
        return lineMatchHits;

    }
    //@+node:felix.20221105222427.13: *3* addTag
    /**
     * add Tag label
     */
    public addTag(text: string): { type: string, label: string } {
        const it = { "type": "tag", "label": text };
        this.its.push([it, undefined]);
        return it;
    }
    //@+node:felix.20221105222427.21: *3* clear
    public clear(): void {
        this.its = [];
        this.lw = [];
    }
    //@+node:felix.20221105222427.22: *3* find_b
    /**
     * Return list of all tuple (Position, matchiter/None) whose body matches regex one or more times.
     */
    public find_b(regex: string, positions: Position[], flags = "rm"): [Position, RegExp][] {

        let pat;

        try {
            pat = new RegExp(regex, flags);
        }
        catch (e) {
            return [];
        }
        const aList: [Position, RegExp][] = [];
        for (let p of positions) {

            pat.lastIndex = 0;

            if (pat.exec(p.b)) {
                // at least one
                const pc = p.copy();
                aList.push([pc, new RegExp(regex, flags)]);
            }

        }
        return aList;

    }
    //@+node:felix.20221105222427.23: *3* find_h
    /**
     * Return the list of all tuple (Position, matchiter/None) whose headline matches the given pattern.
     */
    public find_h(regex: string, positions: Position[], flags = "i"): [Position, undefined][] {

        let pat;

        try {
            pat = new RegExp(regex, flags);
        }
        catch (e) {
            return [];
        }
        const aList: [Position, undefined][] = [];
        for (let p of positions) {

            pat.lastIndex = 0;

            if (pat.exec(p.h)) {
                // at least one
                const pc = p.copy();
                aList.push([pc, undefined]);
            }
        }
        return aList;
    }

    //@+node:felix.20221105222427.14: *3* find_tag
    /**
     * Return list of all positions that have matching tags
     */
    public find_tag(pat: string): [Position, undefined][] {

        // USE update_list(self) from @file ../plugins/nodetags.py
        const c = this.c;

        const tc = c.theTagController;

        const gnxDict = c.fileCommands.gnxDict;
        const key = pat.trim();

        const query = key.split(/(&|\||-|\^)/);

        const tags: string[] = [];
        const operations: string[] = [];

        let i = 0;
        for (let s of query) {
            if (i % 2 === 0) {
                tags.push(s.trim());
            } else {
                operations.push(s.trim());
            }
            i++;
        }
        tags.reverse();
        operations.reverse();

        let resultset: string[] = [...tc.get_tagged_gnxes(tags.pop()!)].filter((v, i, a) => a.indexOf(v) === i);

        while (operations.length && tags.length) {
            const op = operations.pop()!;
            const nodes: string[] = [...tc.get_tagged_gnxes(tags.pop()!)].filter((v, i, a) => a.indexOf(v) === i);

            if (op === '&') {
                // intersection
                // resultset &= nodes;
                resultset = resultset.filter(x => nodes.includes(x));
            } else if (op === '|') {
                // Update the set, adding elements from all others
                // resultset |= nodes;
                resultset = resultset.concat(nodes).filter((v, i, a) => a.indexOf(v) === i);

            } else if (op === '-') {
                // difference
                // resultset -= nodes;
                resultset = resultset.filter(x => !nodes.includes(x));

            } else if (op === '^') {
                // symetric difference keeping only elements found in either set, but not in both
                // resultset ^= nodes;
                const temp_result = resultset.filter(x => !nodes.includes(x)); //  resultset, but removed those in nodes.
                const temp_Nodes = nodes.filter(x => !resultset.includes(x)); // opposite: nodes without resultset.
                resultset = temp_result.concat(temp_Nodes); // both results concatenated
            }
        }

        const aList: [Position, undefined][] = [];

        for (let gnx of resultset) {
            const n = gnxDict[gnx];
            if (n !== undefined) {
                const p = c.vnode2position(n);
                if (p) {
                    aList.push([p.copy(), undefined]);
                }
            }
        }
        return aList;

    }

    //@+node:felix.20221105222427.24: *3* matchlines
    public matchlines(b: string, miter: RegExp): [string, [number, number]][] {
        const aList: [string, [number, number]][] = [];
        let m;
        while ((m = miter.exec(b)) !== null) {
            let st;
            let en;

            const m_start = miter.lastIndex - m[0].length;
            const m_end = miter.lastIndex - 1;

            [st, en] = g.getLine(b, m_start);

            const li = b.substring(st, en).trim();

            aList.push([li, [m_start, m_end]]);
        }

        return aList;
    }

    //@+node:felix.20221105222427.25: *3* onSelectItem Event Handler
    public onSelectItem(index: number): void {
        const c = this.c;
        const tgt = this.its[index];
        if (!tgt) {
            if (!g.unitTesting) {
                g.es("onSelectItem: no target found for 'it' as index:" + it);
            }
            return;
        }

        try {
            if (tgt[1] && tgt[1].length === 2) {
                let p;
                let pos;
                [p, pos] = tgt[1];
                if (p.v) {// p might be "Root"
                    if (!c.positionExists(p)) {
                        g.es("Node moved or deleted.\nMaybe re-do search.", 'red');
                        return;
                    }
                    c.selectPosition(p);
                    if (pos !== undefined) {
                        if ((g.app.gui as LeoUI).show_find_success) {
                            (g.app.gui as LeoUI).show_find_success(c, false, 0, p);
                        }
                        let st;
                        let en;
                        [st, en] = pos;
                        const w = c.frame.body.wrapper;
                        w.setSelectionRange(st, en);
                        w.seeInsertPoint();
                        c.bodyWantsFocus();
                        c.bodyWantsFocusNow();
                    } else {
                        if ((g.app.gui as LeoUI).show_find_success) {
                            (g.app.gui as LeoUI).show_find_success(c, true, 0, p);
                        }
                    }
                }
            }
        }
        catch (e) {
            throw (new Error("QuickSearchController onSelectItem error" + e));
        }
    }

    //@+node:felix.20221105222427.5: *3* pushSearchHistory
    public pushSearchHistory(pat: string): void {
        if (this._search_patterns.includes(pat)) {
            return;
        }
        this._search_patterns = [pat, ...this._search_patterns].slice(0, 30);

    }

    //@+node:felix.20221105222427.10: *3* qsc_background_search
    public qsc_background_search(pat: string): [[Position, RegExp | undefined][], Position[]] {

        let flags: string;
        let hpat: string;
        if (!pat.startsWith('r:')) {
            // normal string so turn it into a valid regexp
            hpat = this.translate('*' + pat + '*').slice(0, -1); // remove last '$' part.
            flags = 'i';
        } else {
            // Flagged as aregexp with "r:"" so just remove it
            hpat = pat.substring(2);
            flags = "";
        }
        let combo = this.searchOptionsStrings[this.searchOptions];
        let hNodes: Position[] | Generator<Position>;
        if (combo === "All") {
            hNodes = this.c.all_positions();
        } else if (combo === "Subtree") {
            hNodes = this.c.p.self_and_subtree();
        } else {
            hNodes = [this.c.p];
        }
        const hm = this.find_h(hpat, [...hNodes], flags);
        // Update the real quicksearch controller.
        this.clear();
        this.addHeadlineMatches(hm);

        return [hm, []];

    }

    //@+node:felix.20221105222427.11: *3* qsc_find_changed
    public qsc_find_changed(): void {
        const c = this.c;
        const changed: [Position, undefined][] = [];

        for (let p of c.all_unique_positions()) {

            if (p.isDirty()) {
                changed.push([p.copy(), undefined]);
            }
        }

        this.clear();
        this.addHeadlineMatches(changed);

    }

    //@+node:felix.20221105222427.12: *3* qsc_find_tags & helpers
    /**
     * Search for tags: outputs position list
     * If empty pattern, list tags *strings* instead
     */
    public qsc_find_tags(pat: string): void {

        const c = this.c;

        if (!pat) {
            // No pattern! list all tags as string

            this.clear();
            const d: { [key: string]: any } = {};

            for (let p of c.all_unique_positions()) {
                const u = p.v.u;
                const tags: string[] = u['__node_tags'] || [];
                for (let tag of tags) {
                    const aList = d[tag] || [];
                    if (!aList.includes(p.h)) {
                        aList.push(p.h);
                        d[tag] = aList;
                    }
                }

            }
            if (Object.keys(d).length) {
                for (let key of Object.keys(d).sort()) {
                    // key is unique tag
                    this.addTag(key);
                }
            }
            return;

        }
        // else: non empty pattern, so find tag!
        const hm = this.find_tag(pat);
        this.clear(); // needed for external client ui replacement: fills this.its
        this.addHeadlineMatches(hm);  // added for external client ui replacement: fills this.its
    }

    //@+node:felix.20221105222427.15: *3* qsc_get_history
    public qsc_get_history(): void {

        const headlines: [Position, undefined][] = [];

        for (let po of this.c.nodeHistory.beadList) {
            headlines.push([po[0].copy(), undefined]);
        }

        headlines.reverse();
        this.clear();
        this.addHeadlineMatches(headlines);

    }

    //@+node:felix.20221105222427.4: *3* qsc_search
    public qsc_search(pat: string): void {

        let hitBase = false;
        const c = this.c;
        let flags: string;
        this.clear();
        this.pushSearchHistory(pat);

        let hpat: string;
        let bpat: string;

        if (!pat.startsWith('r:')) {
            hpat = this.translate('*' + pat + '*').slice(0, -1); // remove last '$' part.
            bpat = this.translate(pat).slice(0, -1); // remove last '$' part.
            // in python 3.6 there is no (?ms) at the end
            // only \Z
            //bpat = bpat.replace(r'\Z', '')
            flags = "i";
        } else {
            hpat = pat.substring(2);
            bpat = pat.substring(2);
            flags = "";
        }

        const combo = this.searchOptionsStrings[this.searchOptions];
        let bNodes: Position[] | Generator<Position>;
        let hNodes: Position[] | Generator<Position>;
        let node: Position;
        let found: boolean;
        let h: string;
        if (combo === "All") {
            hNodes = c.all_positions();
            bNodes = c.all_positions();
        } else if (combo === "Subtree") {
            hNodes = c.p.self_and_subtree();
            bNodes = c.p.self_and_subtree();
        } else if (combo === "File") {
            found = false;
            node = c.p;
            while (!found && !hitBase) {
                h = node.h;
                if (h) {
                    h = h.split(/\s+/)[0];
                }
                if (h in this.fileDirectives) {
                    found = true;
                } else {
                    if (node.level() === 0) {
                        hitBase = true;
                    } else {
                        node = node.parent();
                    }
                }
            }
            hNodes = node.self_and_subtree();
            bNodes = node.self_and_subtree();
        } else if (combo === "Chapter") {
            found = false;
            node = c.p;
            while (!found && !hitBase) {
                h = node.h;
                if (h) {
                    h = h.split(/\s+/)[0];
                }
                if (h === "@chapter") {
                    found = true;
                } else {
                    if (node.level() === 0) {
                        hitBase = true;
                    } else {
                        node = node.parent();
                    }
                }
            }
            if (hitBase) {
                // If I hit the base then revert to all positions
                // this is basically the "main" chapter
                hitBase = false;  // reset
                hNodes = c.all_positions();
                bNodes = c.all_positions();
            } else {
                hNodes = node.self_and_subtree();
                bNodes = node.self_and_subtree();
            }

        } else {
            hNodes = [c.p];
            bNodes = [c.p];
        }

        if (!hitBase) {
            // hNodes = list(hNodes)
            // bNodes = list(bNodes)
            let hm = this.find_h(hpat, [...hNodes], flags);  // Returns a list of positions.
            let bm = this.find_b(bpat, [...bNodes], flags);  // Returns a list of positions.

            let bm_keys = bm.map(match => match[0].key()); // [match[0].key() for match in bm];

            let numOfHm = hm.length;  // do this before trim to get accurate count
            let lineMatchHits;
            hm = hm.filter(match => !bm_keys.includes(match[0].key()));  //  [match for match in hm if match[0].key() not in bm_keys];
            if (this.showParents) {
                // Was: parents = OrderedDefaultDict(list)
                let parents: { [key: string]: [Position, RegExp | undefined][] } = {};

                for (let nodeList of [hm, bm]) {
                    for (let node of nodeList) {
                        const key = node[0].level() === 0 ? 'Root' : node[0].parent().gnx;
                        const aList: [Position, RegExp | undefined][] = parents[key] || [];
                        aList.push(node);
                        parents[key] = aList;
                    }
                }
                lineMatchHits = this.addParentMatches(parents);
            } else {
                this.addHeadlineMatches(hm);
                lineMatchHits = this.addBodyMatches(bm);
            }

            const hits = numOfHm + lineMatchHits;
            this.lw.unshift(`${hits} hits`);

        } else {
            if (combo === "File") {
                this.lw.unshift('External file directive not found during search');
            }
        }

    }

    //@+node:felix.20221105222427.16: *3* qsc_show_marked
    public qsc_show_marked(): void {
        this.clear();
        const c = this.c;

        const marked: [Position, undefined][] = [];

        for (let z of c.all_positions()) {

            if (z.isMarked()) {
                marked.push([z.copy(), undefined]);
            }
        }

        this.addHeadlineMatches(marked);
    }

    //@+node:felix.20221105222427.9: *3* qsc_sort_by_gnx
    /**
     * Return positions by gnx.
     */
    public qsc_sort_by_gnx(): void {

        const c = this.c;

        const timeline: [Position, undefined][] = [];


        for (let p of c.all_unique_positions()) {
            timeline.push([p.copy(), undefined]);
        }

        timeline.sort((a, b) => {
            return b[0].gnx === a[0].gnx ? 0 : (b[0].gnx < a[0].gnx ? -1 : 1);
        });

        this.clear();
        this.addHeadlineMatches(timeline);

    }

    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
