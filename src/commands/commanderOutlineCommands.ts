//@+leo-ver=5-thin
//@+node:felix.20211002221425.1: * @file src/commands/commanderOutlineCommands.ts
/**
 * Outline commands that used to be defined in leoCommands.py
 */
import * as et from 'elementtree';
import * as g from '../core/leoGlobals';
import { commander_command } from '../core/decorators';
import { StackEntry, Position, VNode } from '../core/leoNodes';
import { FastRead } from '../core/leoFileCommands';
import { Commands, HoistStackEntry } from '../core/leoCommands';
import { Bead, Undoer } from '../core/leoUndo';

//@+others
//@+node:felix.20211101020339.1: ** function cantMoveMessage
function cantMoveMessage(c: Commands): void {
    const h: string = c.rootPosition()!.h;
    const kind: string = h.startsWith('@chapter') ? 'chapter' : 'hoist';
    g.warning("can't move node out of", kind);
}
//@+node:felix.20211101230134.1: ** function createMoveMarkedNode
function createMoveMarkedNode(c: Commands): Position {
    const oldRoot = c.rootPosition()!;
    const p = oldRoot.insertAfter();
    p.h = 'Moved marked nodes';
    p.moveToRoot();
    return p;
}
//@+node:felix.20211209005212.1: ** function computeVnodeInfoDict
/**
 * We don't know yet which nodes will be affected by the paste, so we remember
 * everything. This is expensive, but foolproof.
 *
 * The alternative is to try to remember the 'before' values of nodes in the
 * FileCommands read logic. Several experiments failed, and the code is very ugly.
 * In short, it seems wise to do things the foolproof way.
 */
function computeVnodeInfoDict(c: Commands): Record<string, Bead> {
    const d: Record<string, Bead> = {};
    for (let v of c.all_unique_nodes()) {
        if (!d[v.toString()]) {
            d[v.toString()] = { v: v, head: v.h, body: v.b };
        }
    }
    return d;
}
//@+node:felix.20211209005216.1: ** function computeCopiedBunchList
/**
 * * Create a dict containing only copied vnodes.
 */
function computeCopiedBunchList(
    c: Commands,
    pasted: Position,
    vnodeInfoDict: { [key: string]: Bead }
): Bead[] {
    const d: { [key: string]: VNode } = {};
    for (let p of pasted.self_and_subtree(false)) {
        d[p.v.toString()] = p.v;
    }
    const aList: Bead[] = [];
    // Use string keys instead of v keys like original Leo
    for (let v in vnodeInfoDict) {
        if (d[v]) {
            const bunch: Bead = vnodeInfoDict[v];
            aList.push(bunch);
        }
    }
    return aList;
}
//@+node:felix.20211101020440.1: ** Class CommanderOutlineCommands
export class CommanderOutlineCommands {
    //@+others
    //@+node:felix.20211208235043.1: *3* c_oc.Cut & Paste Outlines
    //@+node:felix.20211208235043.2: *4* c_oc.copyOutline
    @commander_command(
        'copy-node',
        'Copy the selected outline to the clipboard.'
    )
    public copyOutline(this: Commands): string {
        // Copying an outline has no undo consequences.
        const c: Commands = this;
        c.endEditing();
        const s: string = c.fileCommands.outline_to_clipboard_string()!;
        g.app.paste_c = c;
        if (g.app.inBridge) {
            return s;
        }
        void g.app.gui.replaceClipboardWith(s);
        return s;
    }
    //@+node:felix.20230322003228.1: *4* c_oc.copyOutlineAsJson
    @commander_command(
        'copy-node-as-json',
        'Copy the selected outline to the clipboard in json format.'
    )
    public copyOutlineAsJSON(this: Commands): string {
        // Copying an outline has no undo consequences.
        // //@+others  // Define helper functions
        // //@+node:felix.20230322003228.2: *5* function: json_globals
        // /**
        //  * Put json representation of Leo's cached globals.
        //  */
        // const json_globals = (c: Commands): { [key: string]: any } => {

        //     let width, height, left, top;
        //     [width, height, left, top] = [0, 0, 0, 0]; // c.frame.get_window_info();
        //     return {
        //         'body_outline_ratio': 0.5, // c.frame.ratio,
        //         'body_secondary_ratio': 0.5, // c.frame.secondary_ratio,
        //         'globalWindowPosition': {
        //             'height': height,
        //             'left': left,
        //             'top': top,
        //             'width': width,
        //         }
        //     };
        // }
        // //@+node:felix.20230322003228.3: *5* function: json_vnode
        // const json_vnode = (v: VNode): { [key: string]: any } => {
        //     const children: { [key: string]: any }[] = [];
        //     for (const child of v.children) {
        //         children.push(json_vnode(child));
        //     }
        //     return {
        //         'gnx': v.fileIndex,
        //         'vh': v._headString,
        //         'status': v.statusBits,
        //         'children': children
        //     };
        // }
        // //@+node:felix.20230322003228.4: *5* function: outline_to_json
        // /**
        //  * Return the JSON representation of c.
        //  */
        // const outline_to_json = (c: Commands): string => {
        //     const positions = [...c.p.self_and_subtree()];
        //     const uas_dict: { [key: string]: any } = {};
        //     for (const p of positions) {
        //         if (p.u) {
        //             try {
        //                 uas_dict[p.v.gnx] = JSON.stringify(p.u); // json.dumps(p.u, skipkeys=True)
        //             }
        //             catch (typeError) {
        //                 g.trace(`Can not serialize uA for ${p.h}`, g.callers(6))
        //                 // g.printObj(p.u)
        //             }
        //         }

        //     }
        //     const tnodes: { [key: string]: any } = {};
        //     for (const p of positions) {
        //         tnodes[p.v.gnx] = p.v._bodyString;
        //     }
        //     const d = {
        //         'leoHeader': { 'fileFormat': 2 },
        //         'globals': json_globals(c),
        //         'tnodes': tnodes,
        //         'uas': uas_dict,
        //         'vnodes': [
        //             json_vnode(c.p.v)
        //         ],
        //     }

        //     // return json.dumps(d, indent=2, sort_keys=False)
        //     return JSON.stringify(d, null, "  ");
        // }
        // //@-others
        const c: Commands = this;
        c.endEditing();
        const s = c.fileCommands.outline_to_clipboard_json_string();
        g.app.paste_c = c;
        if (g.app.inBridge) {
            return s;
        }
        void g.app.gui.replaceClipboardWith(s);
        return s;
    }
    //@+node:felix.20211208235043.3: *4* c_oc.cutOutline
    @commander_command(
        'cut-node',
        'Delete the selected outline and send it to the clipboard.'
    )
    public cutOutline(this: Commands): void {
        const c: Commands = this;
        if (c.canDeleteHeadline()) {
            c.copyOutline();
            c.deleteOutline('Cut Node');
            // c.recolor();
        }
    }
    //@+node:felix.20211208235043.4: *4* c_oc.pasteOutline
    // Only USER GUI interaction uses async clipboard methods. Scripts use normal methods.
    @commander_command(
        'paste-node',
        'Paste an outline into the present outline from the clipboard. ' +
        'Nodes do *not* retain their original identify.'
    )
    public pasteOutline(
        this: Commands,
        s: string | undefined = undefined,
        undoFlag: boolean = true
    ): Position | undefined {
        if (s === undefined) {
            s = g.app.gui.getTextFromClipboard();
        }
        const c: Commands = this;
        c.endEditing();
        if (!s || !c.canPasteOutline(s)) {
            return undefined; // This should never happen.
        }
        const isLeo =
            s.trimStart().startsWith('{') ||
            g.match(s, 0, g.app.prolog_prefix_string);
        if (!isLeo) {
            return undefined;
        }
        // Get *position* to be pasted.
        const pasted: Position = c.fileCommands.getLeoOutlineFromClipboard(s)!;
        if (!pasted) {
            // Leo no longer supports MORE outlines. Use import-MORE-files instead.
            return undefined;
        }
        // Validate.
        const errors = c.checkOutline();
        if (errors > 0) {
            return undefined;
        }
        // Handle the "before" data for undo.
        let undoData: Bead;
        if (undoFlag) {
            // undoData now exists for sure because of undoFlag
            undoData = c.undoer.beforeInsertNode(c.p, false, []);
        }
        // Paste the node into the outline.
        c.selectPosition(pasted);
        pasted.setDirty();
        c.setChanged();
        // Prevent flash when fixing #387.
        const back: Position = pasted.back();
        if (
            back &&
            back.__bool__() &&
            back.hasChildren() &&
            back.isExpanded()
        ) {
            pasted.moveToNthChildOf(back, 0);
        }
        // Finish the command.
        if (undoFlag) {
            // undoData does exists for sure because of undoFlag
            c.undoer.afterInsertNode(pasted, 'Paste Node', undoData!);
        }
        c.redraw(pasted);
        // c.recolor()
        return pasted;
    }
    //@+node:felix.20220103211308.1: *4* c_oc.asyncPasteOutline
    // Only USER GUI interaction uses async clipboard methods. Scripts use normal methods.
    @commander_command(
        'async-paste-node',
        'Paste an outline into the present outline from the clipboard. ' +
        'Nodes do *not* retain their original identify.'
    )
    public asyncPasteOutline(this: Commands): Thenable<unknown> {
        return g.app.gui.asyncGetTextFromClipboard().then((clipboard) => {
            this.pasteOutline(clipboard);
            return true;
        });
    }
    //@+node:felix.20211208235043.5: *4* c_oc.pasteOutlineRetainingClones
    // Only USER GUI interaction uses async clipboard methods. Scripts use normal methods.
    @commander_command(
        'paste-retaining-clones',
        'Paste an outline into the present outline from the clipboard. ' +
        'Nodes *retain* their original identify.'
    )
    public pasteOutlineRetainingClones(
        this: Commands,
        s: string | undefined = undefined,
    ): Position | undefined {
        if (s === undefined) {
            s = g.app.gui.getTextFromClipboard();
        }
        const c: Commands = this;
        c.endEditing();
        if (!s || !c.canPasteOutline(s)) {
            return undefined; // This should never happen.
        }
        // Get *position* to be pasted.
        const pasted: Position =
            c.fileCommands.getLeoOutlineFromClipboardRetainingClones(s)!;
        if (!pasted) {
            // Leo no longer supports MORE outlines. Use import-MORE-files instead.
            return undefined;
        }
        // Validate.
        const errors = c.checkOutline();
        if (errors > 0) {
            return undefined;
        }
        // Handle the "before" data for undo.
        let vnodeInfoDict: any;
        let undoData: Bead;
        if (true) { // undoFlag
            vnodeInfoDict = computeVnodeInfoDict(c);
            undoData = c.undoer.beforeInsertNode(
                c.p,
                true,
                computeCopiedBunchList(c, pasted, vnodeInfoDict)
            );
        }
        // Paste the node into the outline.
        c.selectPosition(pasted);
        pasted.setDirty();
        c.setChanged();
        // Prevent flash when fixing #387.
        const back: Position = pasted.back();
        if (
            back &&
            back.__bool__() &&
            back.hasChildren() &&
            back.isExpanded()
        ) {
            pasted.moveToNthChildOf(back, 0);
            pasted.setDirty();
        }
        // Set dirty bits for ancestors of *all* pasted nodes.
        for (let p of pasted.self_and_subtree()) {
            p.setAllAncestorAtFileNodesDirty();
        }
        // Finish the command.
        if (true) { // undoFlag
            c.undoer.afterInsertNode(pasted, 'Paste As Clone', undoData);
        }
        c.redraw(pasted);
        // c.recolor();
        return pasted;
    }
    //@+node:felix.20220103213833.1: *4* c_oc.asyncPasteOutlineRetainingClones
    // Only USER GUI interaction uses async clipboard methods. Scripts use normal methods.
    @commander_command(
        'async-paste-retaining-clones',
        'Paste an outline into the present outline from the clipboard. ' +
        'Nodes *retain* their original identify.'
    )
    public asyncPasteOutlineRetainingClones(this: Commands): Thenable<unknown> {
        return g.app.gui.asyncGetTextFromClipboard().then((clipboard) => {
            this.pasteOutlineRetainingClones(clipboard);
            return true;
        });
    }

    //@+node:felix.20211208235043.8: *4* c_oc.pasteAsTemplate
    // Only USER GUI interaction uses async clipboard methods. Scripts use normal methods.
    @commander_command(
        'paste-as-template',
        'Paste as template clones only nodes that were already clones'
    )
    public pasteAsTemplate(this: Commands, s?: string): void {
        if (s === undefined) {
            s = g.app.gui.getTextFromClipboard();
        }
        const c: Commands = this;
        const p: Position = c.p;
        if (!s || !c.canPasteOutline(s)) {
            return; // This should never happen.
        }
        const isJson = s.trimStart().startsWith('{');

        // * Variables local to pasteAsTemplate
        let root_gnx: string;
        let outside: string[] = [];
        let heads: { [key: string]: string } = {};
        let bodies: { [key: string]: string } = {};
        let uas: { [key: string]: any } = {};
        let translation: { [key: string]: string } = {};
        let seen: string[] = [];
        let bunch: Bead;

        let vpar: VNode;
        let pasted: VNode;
        let index: number;
        let parStack: StackEntry[];
        let xroot: et.ElementTree | any; // ElementTree from leo, any from JSON
        let xvelements: et.Element[] | any; // Element from leo, any from JSON
        let xtelements: et.Element[] | any; // Element from leo, any from JSON
        const gnx2v = c.fileCommands.gnxDict;

        //@+others
        //@+node:felix.20211208235043.9: *5* skip_root
        function* skip_root(v: VNode): Generator<VNode> {
            // generates v nodes in the outline order
            // but skips a subtree of the node with root_gnx
            if (v.gnx !== root_gnx) {
                yield v;
                for (let ch of v.children) {
                    yield* skip_root(ch);
                }
            }
        }
        //@+node:felix.20211208235043.10: *5* translate_gnx
        /**
         * allocates a new gnx for all nodes that
         * are not found outside copied tree
         */
        function translate_gnx(gnx: string): string {
            if (outside.includes(gnx)) {
                return gnx;
            }
            return g.app.nodeIndices!.computeNewIndex();
        }
        //@+node:felix.20211208235043.11: *5* viter
        /**
         * iterates <v> nodes generating array:
         *
         *  [parent_gnx, child_gnx, headline, body]
         *
         * skipping the descendants of already seen nodes.
         */
        function* viter(
            parent_gnx: string,
            xv: et.Element | any
        ): Generator<[string, string, string, string]> {
            let chgnx: string;
            if (!isJson) {
                chgnx = xv.attrib['t']!;
            } else {
                chgnx = xv['gnx'];
            }
            const b: string = bodies[chgnx]!;

            const gnx: string = translation[chgnx];

            if (seen.includes(gnx)) {
                yield [parent_gnx, gnx, heads[gnx], b];
            } else {
                seen.push(gnx);
                let h: string; //  = xv.getchildren()[0].text!.toString();
                if (!isJson) {
                    h = xv.getchildren()[0].text!.toString();
                } else {
                    h = xv['vh'] || '';
                }
                heads[gnx] = h;

                yield [parent_gnx, gnx, h, b];

                if (!isJson) {
                    for (let xch of xv.getchildren().slice(1)) {
                        yield* viter(gnx, xch);
                    }
                } else {
                    if (xv['children'] && xv['children'].length) {
                        for (let xch of xv['children']) {
                            yield* viter(gnx, xch);
                        }
                    }
                }
            }
        }
        //@+node:felix.20211208235043.12: *5* getv
        /**
         * returns a pair (vnode, is_new) for the given gnx.
         * if node doesn't exist, creates a new one.
         */
        function getv(gnx: string): [VNode, boolean] {
            const v: VNode | undefined = gnx2v[gnx];
            if (!v) {
                return [new VNode(c, gnx), true];
            }
            return [v, false];
        }
        //@+node:felix.20211208235043.13: *5* do_paste
        /**
         * pastes a new node as a child of vpar at given index
         */
        function do_paste(vpar: VNode, index: number): VNode {
            const vpargnx: string = vpar.gnx;

            // the first node is inserted at the given index
            // and the rest are just appended at parents children
            // to achieve this we first create a generator object

            const rows: Generator<[string, string, string, string]> = viter(
                vpargnx,
                xvelements[0]
            );

            // then we just take first tuple
            let pgnx: string;
            let gnx: string;
            let h: string;
            let b: string;
            [pgnx, gnx, h, b] = rows.next().value;

            // create vnode
            let v: VNode;
            let isNew: boolean; // Reuses v and isNew (as '_' in original Leo)
            [v, isNew] = getv(gnx);
            v.h = h;
            v.b = b;

            // and finally insert it at the given index
            vpar.children.splice(index, 0, v);
            v.parents.push(vpar);

            // this 'pasted' variable is local to do_paste
            const pasted: VNode = v; // remember the first node as a return value

            // now we iterate the rest of tuples
            for (let row of rows) {
                [pgnx, gnx, h, b] = row;
                // get or create a child `v`
                [v, isNew] = getv(gnx);

                if (isNew) {
                    v.h = h;
                    v.b = b;
                    let ua: any = uas[gnx];
                    if (ua) {
                        v.unknownAttributes = ua;
                    }
                }
                // get parent node `vpar`
                const vpar: VNode = getv(pgnx)[0];

                // and link them
                vpar.children.push(v);
                v.parents.push(vpar);
            }

            return pasted;
        }
        //@+node:felix.20211208235043.14: *5* undoHelper
        function undoHelper(): void {
            const v: VNode = vpar.children.splice(index, 1)[0];

            const i_vpar = v.parents.indexOf(vpar);
            if (i_vpar > -1) {
                v.parents.splice(i_vpar, 1);
            }
            c.redraw(bunch.p);
        }
        //@+node:felix.20211208235043.15: *5* redoHelper
        function redoHelper(): void {
            vpar.children.splice(index, 0, pasted);
            pasted.parents.push(vpar);
            c.redraw(newp);
        }
        //@-others

        const x = new FastRead(c, {});
        if (!isJson) {
            // To match python's implementation of XML : /r/n replaced by /n
            xroot = et.parse(s.replace(/\r\n/g, '\n'));
            xvelements = xroot.find('vnodes')!.getchildren();
            xtelements = xroot.find('tnodes')!.getchildren();
            [bodies, uas] = x.scanTnodes(xtelements);
            x.updateBodies(bodies, x.gnx2vnode);
            root_gnx = xvelements[0].attrib['t']!; // the gnx of copied node
        } else {
            xroot = JSON.parse(s);
            xvelements = xroot['vnodes']; // <v> elements.
            xtelements = xroot['tnodes']; // <t> elements.
            bodies = x.scanJsonTnodes(xtelements);

            const addBody = (node: any): void => {
                if (!bodies[node['gnx']]) {
                    bodies[node['gnx']] = '';
                }
                if (node['children'] && node['children'].length) {
                    for (const child of node['children']) {
                        addBody(child);
                    }
                }
            };
            // generate bodies for all possible nodes, not just non-empty bodies.
            addBody(xvelements[0]);
            uas = {};
            Object.assign(uas, xroot['uas'] || {});
            root_gnx = xvelements[0]['gnx']; // the gnx of copied node
        }

        // outside will contain gnxes of nodes that are outside the copied tree
        for (let x of skip_root(c.hiddenRootNode)) {
            outside.push(x.gnx);
        }

        for (let x in bodies) {
            // Voluntary use of 'in' for keys
            translation[x] = translate_gnx(x);
        }
        // we generate new gnx for each node in the copied tree

        seen = [...outside]; // required for the treatment of local clones inside the copied tree

        heads = {};

        bunch = c.undoer.createCommonBunch(p);

        //@+<< prepare destination data >>
        //@+node:felix.20211208235043.16: *5* << prepare destination data >>
        // destination data consists of
        //    1. vpar --- parent v node that should receive pasted child
        //    2. index --- at which pasted child will be
        //    3. parStack --- a stack for creating new position of the pasted node
        //
        // the new position will be:  Position(vpar.children[index], index, parStack)
        // but it can't be calculated yet, before actual paste is done

        if (p.isExpanded()) {
            // paste as a first child of current position
            vpar = p.v;
            index = 0;
            parStack = [...p.stack];
            parStack.push([p.v, p._childIndex]);
        } else {
            // paste after the current position
            parStack = p.stack;
            if (p.stack && p.stack.length) {
                vpar = p.stack[p.stack.length - 1][0];
            } else {
                vpar = c.hiddenRootNode;
            }
            index = p._childIndex + 1;
        }
        //@-<< prepare destination data >>

        pasted = do_paste(vpar, index); // Local 'pasted' variable

        const newp = new Position(pasted, index, parStack);

        bunch.undoHelper = undoHelper;
        bunch.redoHelper = redoHelper;
        bunch.undoType = 'paste-retaining-outside-clones';

        newp.setDirty();
        c.undoer.pushBead(bunch);
        c.redraw(newp);
    }
    //@+node:felix.20220103214054.1: *4* c_oc.asyncPasteAsTemplate
    // Only USER GUI interaction uses async clipboard methods. Scripts use normal methods.
    @commander_command(
        'async-paste-as-template',
        'Paste as template clones only nodes that were already clones'
    )
    public asyncPasteAsTemplate(this: Commands): Thenable<unknown> {
        return g.app.gui.asyncGetTextFromClipboard().then((clipboard) => {
            this.pasteAsTemplate(clipboard);
            return true;
        });
    }

    //@+node:felix.20211020000219.1: *3* c_oc.dumpOutline
    @commander_command('dump-outline', 'Dump all nodes in the outline.')
    public dumpOutline(this: Commands): void {
        const c: Commands = this;
        const seen: { [key: string]: boolean } = {};
        g.es_print('');
        g.es_print('='.repeat(40));
        const v = c.hiddenRootNode;
        v.dump();
        seen[v.gnx] = true;
        for (let p of c.all_positions()) {
            if (!seen[p.v.gnx]) {
                seen[p.v.gnx] = true;
                p.v.dump();
            }
        }
    }
    //@+node:felix.20211020002058.1: *3* c_oc.Expand & contract commands
    //@+node:felix.20211020002058.2: *4* c_oc.contract-all
    @commander_command('contract-all', 'Contract all nodes in the outline.')
    public contractAllHeadlinesCommand(this: Commands): void {
        // The helper does all the work.
        const c: Commands = this;
        c.contractAllHeadlines();
        c.redraw();
    }
    //@+node:felix.20211020002058.3: *4* c_oc.contractAllOtherNodes & helper
    @commander_command(
        'contract-all-other-nodes',
        'Contract all nodes except those needed to make the ' +
        'presently selected node visible.'
    )
    public contractAllOtherNodes(this: Commands): void {
        const c: Commands = this;
        const leaveOpen: Position = c.p;
        for (let p of c.rootPosition()!.self_and_siblings()) {
            this.contractIfNotCurrent(p, leaveOpen);
        }
        c.redraw();
    }

    private contractIfNotCurrent(
        this: Commands,
        p: Position,
        leaveOpen: Position
    ): void {
        if (p.__eq__(leaveOpen) || !p.isAncestorOf(leaveOpen)) {
            p.contract();
        }
        for (let child of p.children()) {
            if (!child.__eq__(leaveOpen) && child.isAncestorOf(leaveOpen)) {
                this.contractIfNotCurrent(child, leaveOpen);
            } else {
                for (let p2 of child.self_and_subtree()) {
                    p2.contract();
                }
            }
        }
    }

    //@+node:felix.20211020002058.5: *4* c_oc.contractAllSubheads (new)
    @commander_command(
        'contract-all-subheads',
        'Contract all children of the presently selected node.'
    )
    public contractAllSubheads(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        let child = p.firstChild();
        c.contractSubtree(p);
        while (child && child.__bool__()) {
            c.contractSubtree(child);
            child = child.next();
        }
        c.redraw(p);
    }
    //@+node:felix.20211020002058.6: *4* c_oc.contractNode
    @commander_command('contract-node', 'Contract the presently selected node.')
    public contractNode(this: Commands): void {
        const c: Commands = this;
        let p = c.p;
        c.endEditing();
        p.contract();
        c.redraw_after_contract(p); // not in leojs
        c.selectPosition(p);
    }
    //@+node:felix.20211020002058.7: *4* c_oc.contractNodeOrGoToParent
    @commander_command(
        'contract-or-go-left',
        'Simulate the left Arrow Key in folder of Windows Explorer.'
    )
    public contractNodeOrGoToParent(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const cc = this.chapterController;

        const parent: Position = p.parent();
        let redraw: boolean = false;
        // Bug fix: 2016/04/19: test p.v.isExpanded().
        if (p.hasChildren() && (p.v.isExpanded() || p.isExpanded())) {
            c.contractNode();
        } else if (parent && parent.__bool__() && parent.isVisible(c)) {
            // Contract all children first.
            if (c.collapse_on_lt_arrow) {
                for (let child of parent.children()) {
                    if (child.isExpanded()) {
                        child.contract();
                        if (child.hasChildren()) {
                            redraw = true;
                        }
                    }
                }
            }
            if (cc && cc.inChapter() && parent.h.startsWith('@chapter ')) {
                // pass
            } else {
                c.goToParent();
            }
        }
        if (redraw) {
            c.redraw();
        }
    }
    //@+node:felix.20211020002058.8: *4* c_oc.contractParent
    @commander_command(
        'contract-parent',
        'Contract the parent of the presently selected node.'
    )
    public contractParent(this: Commands): void {
        const c: Commands = this;
        c.endEditing();
        const p: Position = c.p;
        const parent = p.parent();
        if (!parent || !parent.__bool__()) {
            return;
        }
        parent.contract();
        c.redraw_after_contract(parent);
    }

    //@+node:felix.20211020002058.9: *4* c_oc.expandAllHeadlines
    @commander_command(
        'expand-all',
        'Expand all headlines. ' +
        'Warning: this can take a long time for large outlines.'
    )
    public expandAllHeadlines(this: Commands): void {
        const c: Commands = this;
        c.endEditing();
        const p0: Position = c.p;
        const p: Position = c.rootPosition()!;
        while (p && p.__bool__()) {
            c.expandSubtree(p);
            p.moveToNext();
        }
        c.redraw_after_expand(p0); // Keep focus on original position
        c.expansionLevel = 0; // Reset expansion level.
    }
    //@+node:felix.20211020002058.10: *4* c_oc.expandAllSubheads
    @commander_command(
        'expand-all-subheads',
        'Expand all children of the presently selected node.'
    )
    public expandAllSubheads(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        let child = p.firstChild();
        c.expandSubtree(p);
        while (child && child.__bool__()) {
            c.expandSubtree(child);
            child = child.next();
        }
        c.redraw(p);
    }
    //@+node:felix.20211020002058.11: *4* c_oc.expandLevel1..9
    @commander_command('expand-to-level-1', 'Expand the outline to level 1')
    public expandLevel1(this: Commands): void {
        this.expandToLevel(1);
    }

    @commander_command('expand-to-level-2', 'Expand the outline to level 2')
    public expandLevel2(this: Commands): void {
        this.expandToLevel(2);
    }

    @commander_command('expand-to-level-3', 'Expand the outline to level 3')
    public expandLevel3(this: Commands): void {
        this.expandToLevel(3);
    }

    @commander_command('expand-to-level-4', 'Expand the outline to level 4')
    public expandLevel4(this: Commands): void {
        this.expandToLevel(4);
    }

    @commander_command('expand-to-level-5', 'Expand the outline to level 5')
    public expandLevel5(this: Commands): void {
        this.expandToLevel(5);
    }

    @commander_command('expand-to-level-6', 'Expand the outline to level 6')
    public expandLevel6(this: Commands): void {
        this.expandToLevel(6);
    }

    @commander_command('expand-to-level-7', 'Expand the outline to level 7')
    public expandLevel7(this: Commands): void {
        this.expandToLevel(7);
    }

    @commander_command('expand-to-level-8', 'Expand the outline to level 8')
    public expandLevel8(this: Commands): void {
        this.expandToLevel(8);
    }

    @commander_command('expand-to-level-9', 'Expand the outline to level 9')
    public expandLevel9(this: Commands): void {
        this.expandToLevel(9);
    }
    //@+node:felix.20211020002058.12: *4* c_oc.expandNextLevel
    @commander_command(
        'expand-next-level',
        'Increase the expansion level of the outline and ' +
        'Expand all nodes at that level or lower.'
    )
    public expandNextLevel(this: Commands): void {
        const c: Commands = this;
        // Expansion levels are now local to a particular tree.
        if (!c.expansionNode || !c.expansionNode.__eq__(c.p)) {
            c.expansionLevel = 1;
            c.expansionNode = c.p.copy();
        }
        this.expandToLevel(c.expansionLevel + 1);
    }
    //@+node:felix.20211020002058.13: *4* c_oc.expandNode
    @commander_command('expand-node', 'Expand the presently selected node.')
    public expandNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        c.endEditing();
        p.expand();
        c.redraw_after_expand(p);
        c.selectPosition(p);
    }
    //@+node:felix.20211020002058.14: *4* c_oc.expandNodeAndGoToFirstChild
    @commander_command(
        'expand-and-go-right',
        'If a node has children, expand it if needed and go to the first child.'
    )
    public expandNodeAndGoToFirstChild(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.endEditing();
        if (p.hasChildren()) {
            if (!p.isExpanded()) {
                c.expandNode();
            }
            c.selectPosition(p.firstChild());
        }
        c.treeFocusHelper();
    }
    //@+node:felix.20211020002058.15: *4* c_oc.expandNodeOrGoToFirstChild
    @commander_command(
        'expand-or-go-right',
        'Simulate the Right Arrow Key in folder of Windows Explorer. ' +
        'if c.p has no children, do nothing. ' +
        'Otherwise, if c.p is expanded, select the first child. ' +
        'Otherwise, expand c.p.'
    )
    public expandNodeOrGoToFirstChild(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.endEditing();
        if (p.hasChildren()) {
            if (p.isExpanded()) {
                c.redraw_after_expand(p.firstChild());
            } else {
                c.expandNode();
            }
        }
    }
    //@+node:felix.20211020002058.16: *4* c_oc.expandOnlyAncestorsOfNode
    @commander_command(
        'expand-ancestors-only',
        'Contract all nodes except ancestors of the selected node.'
    )
    public expandOnlyAncestorsOfNode(this: Commands, p?: Position): void {
        const c: Commands = this;
        let level: number = 1;
        if (p && p.__bool__()) {
            c.selectPosition(p); // 2013/12/25
        }
        const root = c.p;
        for (let p of c.all_unique_positions()) {
            p.v.expandedPositions = [];
            p.v.contract();
        }
        for (let p of root.parents()) {
            p.expand();
            level += 1;
        }
        c.expansionLevel = level; // Reset expansion level.
    }
    //@+node:felix.20211020002058.17: *4* c_oc.expandPrevLevel
    @commander_command(
        'expand-prev-level',
        'Decrease the expansion level of the outline and ' +
        'Expand all nodes at that level or lower.'
    )
    public expandPrevLevel(this: Commands): void {
        const c: Commands = this;
        // # Expansion levels are now local to a particular tree.
        if (!c.expansionNode || !c.expansionNode.__eq__(c.p)) {
            c.expansionLevel = 1;
            c.expansionNode = c.p.copy();
        }
        this.expandToLevel(Math.max(1, c.expansionLevel - 1));
    }

    //@+node:felix.20211207224420.1: *3* c_oc.fullCheckOutline
    @commander_command(
        'check-outline',
        'Do a full check of the consistency of a .leo file.'
    )
    public fullCheckOutline(this: Commands): void {
        const c: Commands = this;

        const t1 = g.process_time();

        const errors = c.checkOutline();

        const t2 = g.process_time();

        g.es_print(`check-outline: ${errors} error${g.plural(errors)} in ${t2 - t1} sec.`);

    }
    //@+node:felix.20211021013709.1: *3* c_oc.Goto commands
    //@+node:felix.20211021013709.2: *4* c_oc.findNextClone
    @commander_command('find-next-clone', 'Select the next cloned node.')
    public findNextClone(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const cc = c.chapterController;
        if (!p || !p.__bool__()) {
            return;
        }
        if (p.isCloned()) {
            p.moveToThreadNext();
        }
        let flag = false;
        while (p && p.__bool__()) {
            if (p.isCloned()) {
                flag = true;
                break;
            } else {
                p.moveToThreadNext();
            }
        }
        if (flag) {
            if (cc) {
                cc.selectChapterByName('main');
            }
            c.selectPosition(p);
            c.redraw_after_select(p);
        } else {
            g.blue('no more clones');
        }
    }
    //@+node:felix.20211021013709.3: *4* c_oc.goNextVisitedNode
    @commander_command('go-forward', 'Select the next visited node.')
    public goNextVisitedNode(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goNext();
    }
    //@+node:felix.20211021013709.4: *4* c_oc.goPrevVisitedNode
    @commander_command('go-back', 'Select the previously visited node.')
    public goPrevVisitedNode(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goPrev();
    }
    //@+node:felix.20211021013709.5: *4* c_oc.goToFirstNode
    @commander_command(
        'goto-first-node',
        'Select the first node of the entire outline, ' +
        'Or the first visible node if Leo is hoisted or within a chapter.'
    )
    public goToFirstNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        c.expandOnlyAncestorsOfNode(p);
        c.redraw();
    }
    //@+node:felix.20211021013709.6: *4* c_oc.goToFirstSibling
    @commander_command(
        'goto-first-sibling',
        'Select the first sibling of the selected node.'
    )
    public goToFirstSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (p.hasBack()) {
            while (p.hasBack()) {
                p.moveToBack();
            }
        }
        c.treeSelectHelper(p);
    }
    //@+node:felix.20211021013709.7: *4* c_oc.goToFirstVisibleNode
    @commander_command(
        'goto-first-visible-node',
        'Select the first visible node of the selected chapter or hoist.'
    )
    public goToFirstVisibleNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.firstVisible();
        if (p && p.__bool__()) {
            if (c.sparse_goto_visible) {
                c.expandOnlyAncestorsOfNode(p);
            } else {
                c.treeSelectHelper(p);
            }
            c.redraw();
        }
    }
    //@+node:felix.20211021013709.8: *4* c_oc.goToLastNode
    @commander_command(
        'goto-last-node',
        'Select the last node in the entire tree.'
    )
    public goToLastNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        while (p && p.__bool__() && p.hasThreadNext()) {
            p.moveToThreadNext();
        }
        c.expandOnlyAncestorsOfNode(p);
        c.redraw();
    }
    //@+node:felix.20211021013709.9: *4* c_oc.goToLastSibling
    @commander_command(
        'goto-last-sibling',
        'Select the last sibling of the selected node.'
    )
    public goToLastSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (p.hasNext()) {
            while (p.hasNext()) {
                p.moveToNext();
            }
        }
        c.treeSelectHelper(p);
    }
    //@+node:felix.20211021013709.10: *4* c_oc.goToLastVisibleNode
    @commander_command(
        'goto-last-visible-node',
        'Select the last visible node of selected chapter or hoist.'
    )
    public goToLastVisibleNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.lastVisible();
        if (p && p.__bool__()) {
            if (c.sparse_goto_visible) {
                c.expandOnlyAncestorsOfNode(p);
            } else {
                c.treeSelectHelper(p);
            }
            c.redraw();
        }
    }
    //@+node:felix.20211021013709.11: *4* c_oc.goToNextClone
    @commander_command(
        'goto-next-clone',
        'Select the next node that is a clone of the selected node. ' +
        'If the selected node is not a clone, do find-next-clone.'
    )
    public goToNextClone(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        const cc = c.chapterController;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!p.isCloned()) {
            c.findNextClone();
            return;
        }
        const v: VNode = p.v;
        p.moveToThreadNext();
        let wrapped: boolean = false;
        while (1) {
            if (p && p.__bool__() && p.v.gnx === v.gnx) {
                break;
            } else if (p && p.__bool__()) {
                p.moveToThreadNext();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (p && p.__bool__()) {
            c.expandAllAncestors(p);
            if (cc) {
                // #252: goto-next clone activate chapter.
                const chapter = cc.getSelectedChapter();
                const old_name: string | boolean = !!chapter && chapter.name;
                const new_name: string = cc.findChapterNameForPosition(p)!;
                if (new_name !== old_name) {
                    cc.selectChapterByName(new_name);
                }
            }
            // Always do a full redraw.
            c.redraw(p);
        } else {
            g.blue('done');
        }
    }
    //@+node:felix.20211021013709.12: *4* c_oc.goToNextDirtyHeadline
    @commander_command(
        'goto-next-changed',
        'Select the node that is marked as changed.'
    )
    public goToNextDirtyHeadline(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadNext();
        let wrapped = false;
        while (1) {
            if (p && p.__bool__() && p.isDirty()) {
                break;
            } else if (p && p.__bool__()) {
                p.moveToThreadNext();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (!p || !p.__bool__()) {
            g.blue('done');
        }
        c.treeSelectHelper(p); // Sets focus.
    }
    //@+node:felix.20211021013709.13: *4* c_oc.goToNextMarkedHeadline
    @commander_command('goto-next-marked', 'Select the next marked node.')
    public goToNextMarkedHeadline(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadNext();
        let wrapped = false;
        while (1) {
            if (p && p.__bool__() && p.isMarked()) {
                break;
            } else if (p && p.__bool__()) {
                p.moveToThreadNext();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (!p || !p.__bool__()) {
            g.blue('done');
        }
        c.treeSelectHelper(p); // Sets focus.
    }
    //@+node:felix.20211021013709.14: *4* c_oc.goToNextSibling
    @commander_command(
        'goto-next-sibling',
        'Select the next sibling of the selected node.'
    )
    public goToNextSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.next()); // Non boolean result intended
    }
    //@+node:felix.20211021013709.15: *4* c_oc.goToParent
    @commander_command('goto-parent', 'Select the parent of the selected node.')
    public goToParent(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.parent()); // Non boolean result intended
    }
    //@+node:felix.20211021013709.16: *4* c_oc.goToPrevMarkedHeadline
    @commander_command('goto-prev-marked', 'Select the previous marked node.')
    public goToPrevMarkedHeadline(this: Commands): void {
        const c: Commands = this;
        let p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadBack();
        let wrapped = false;
        while (1) {
            if (p && p.__bool__() && p.isMarked()) {
                break;
            } else if (p && p.__bool__()) {
                p.moveToThreadBack();
            } else if (wrapped) {
                break;
            } else {
                wrapped = true;
                p = c.rootPosition()!;
            }
        }
        if (!p || !p.__bool__()) {
            g.blue('done');
        }
        c.treeSelectHelper(p); // Sets focus.
    }
    //@+node:felix.20211021013709.17: *4* c_oc.goToPrevSibling
    @commander_command(
        'goto-prev-sibling',
        'Select the previous sibling of the selected node.'
    )
    public goToPrevSibling(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        c.treeSelectHelper(p && p.__bool__() && p.back());
    }
    //@+node:felix.20211021013709.18: *4* c_oc.selectThreadBack
    @commander_command(
        'goto-prev-node',
        'Select the node preceding the selected node in outline order.'
    )
    public selectThreadBack(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadBack();
        c.treeSelectHelper(p);
    }
    //@+node:felix.20211021013709.19: *4* c_oc.selectThreadNext
    @commander_command(
        'goto-next-node',
        'Select the node following the selected node in outline order.'
    )
    public selectThreadNext(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        p.moveToThreadNext();
        c.treeSelectHelper(p);
    }
    //@+node:felix.20211021013709.20: *4* c_oc.selectVisBack
    @commander_command(
        'goto-prev-visible',
        'Select the visible node preceding the presently selected node.'
    )
    public selectVisBack(this: Commands): void {
        // This has an up arrow for a control key.
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        if (c.canSelectVisBack()) {
            p.moveToVisBack(c);
            c.treeSelectHelper(p);
        } else {
            c.endEditing(); // 2011/05/28: A special case.
        }
    }
    //@+node:felix.20211021013709.21: *4* c_oc.selectVisNext
    @commander_command(
        'goto-next-visible',
        'Select the visible node following the presently selected node.'
    )
    public selectVisNext(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        if (!p || !p.__bool__()) {
            return;
        }
        if (c.canSelectVisNext()) {
            p.moveToVisNext(c);
            c.treeSelectHelper(p);
        } else {
            c.endEditing(); // 2011/05/28: A special case.
        }
    }
    //@+node:felix.20211025221132.1: *4* c_oc.treePageUp
    @commander_command('tree-page-up', 'Outline Page Up.')
    public treePageUp(this: Commands): void {
        const c: Commands = this;
        const parent: Position = c.p.parent();
        if (!parent.__bool__()) {
            c.goToFirstSibling();
            return;
        }
        const siblings: Position[] = [...parent.children()];
        const firstSibling = siblings[0];
        if (firstSibling.__eq__(c.p)) {
            c.selectVisBack(); // already first sibling
        } else {
            c.goToFirstSibling();
        }
    }
    //@+node:felix.20211025221156.1: *4* c_oc.treePageDown
    @commander_command('tree-page-down', 'Outline Page Down.')
    public treePageDown(this: Commands): void {
        const c: Commands = this;
        const parent: Position = c.p.parent();
        if (!parent.__bool__()) {
            c.goToLastSibling();
            return;
        }
        const siblings: Position[] = [...parent.children()];
        const lastSibling = siblings[siblings.length - 1];
        if (lastSibling.__eq__(c.p)) {
            c.selectVisNext(); // already last sibling
        } else {
            c.goToLastSibling();
        }
    }
    //@+node:felix.20211031143537.1: *3* c_oc.hoist/dehoist/clearAllHoists
    //@+node:felix.20211031143537.2: *4* c_oc.deHoist
    @commander_command('de-hoist', 'Undo a previous hoist of an outline.')
    @commander_command('dehoist', 'Undo a previous hoist of an outline.')
    public dehoist(this: Commands): void {
        const c: Commands = this;
        const cc = this.chapterController;
        const tag = '@chapter ';
        if (!c.p || !c.p.__bool__() || !c.hoistStack.length) {
            return;
        }
        // #2718: de-hoisting an @chapter node is equivalent to selecting the main chapter.
        if (
            c.p.h.startsWith(tag) ||
            c.hoistStack[c.hoistStack.length - 1].p.h.startsWith(tag)
        ) {
            c.hoistStack = [];
            cc.selectChapterByName('main');
            return;
        }
        const bunch: HoistStackEntry = c.hoistStack.pop()!;
        const p: Position = bunch.p;
        // #2643 Uses the expanded state preserved by 'hoist' method
        if (bunch.expanded) {
            p.expand();
        } else {
            p.contract();
        }
        c.setCurrentPosition(p);
        c.redraw(); // redraw selects p
        // c.frame.clearStatusLine()
        // c.frame.putStatusLine("De-Hoist: " + p.h)

        g.doHook('hoist-changed', { c: c });
    }
    //@+node:felix.20211031143537.3: *4* c_oc.clearAllHoists
    @commander_command(
        'clear-all-hoists',
        'Undo a previous hoist of an outline.'
    )
    public clearAllHoists(this: Commands): void {
        const c: Commands = this;
        c.hoistStack = [];

        // c.frame.putStatusLine("Hoists cleared")
        g.doHook('hoist-changed', { c: c });
    }
    //@+node:felix.20211031143537.4: *4* c_oc.hoist
    @commander_command('hoist', 'Make only the selected outline visible.')
    public hoist(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        if (!p || !p.__bool__()) {
            return;
        }
        // Don't hoist an @chapter node.
        if (c.chapterController && p.h.startsWith('@chapter ')) {
            if (!g.unitTesting) {
                g.es('can not hoist an @chapter node.');
            }
            return;
        }
        // Remember the expansion state.
        const bunch: HoistStackEntry = {
            p: p.copy(),
            expanded: p.isExpanded(),
        };
        c.hoistStack.push(bunch);
        p.expand();
        c.redraw(p); // redraw selects p
        // c.frame.clearStatusLine();
        // c.frame.putStatusLine("Hoist: " + p.h);

        g.doHook('hoist-changed', { c: c });
    }
    //@+node:felix.20211031143555.1: *3* c_oc.Insert, Delete & Clone commands
    //@+node:felix.20211031143555.2: *4* c_oc.clone
    @commander_command('clone-node', 'Create a clone of the selected outline.')
    public clone(this: Commands): Position | undefined {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return undefined;
        }

        const undoData: Bead = c.undoer.beforeCloneNode(p);

        c.endEditing(); // Capture any changes to the headline.
        const clone: Position = p.clone();
        clone.setDirty();
        c.setChanged();
        if (c.checkOutline() === 0) {
            u.afterCloneNode(clone, 'Clone Node', undoData);
            c.redraw(clone); // redraw selects p
            c.treeWantsFocus();
            return clone; // For mod_labels and chapters plugins.
        }
        clone.doDelete();
        c.setCurrentPosition(p);
        return undefined;
    }
    //@+node:felix.20211031143555.3: *4* c_oc.cloneToAtSpot
    @commander_command(
        'clone-to-at-spot',
        'Create a clone of the selected node and move it to the last @spot node ' +
        'of the outline. Create the @spot node if necessary.'
    )
    public cloneToAtSpot(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return undefined;
        }

        // 2015/12/27: fix bug 220: do not allow clone-to-at-spot on @spot node.
        if (p.h.startsWith('@spot')) {
            g.es('can not clone @spot node');
            return;
        }
        let last_spot: Position | undefined;

        for (let p2 of c.all_positions()) {
            if (g.match_word(p2.h, 0, '@spot')) {
                last_spot = p2.copy();
            }
        }
        if (!last_spot || !last_spot.__bool__()) {
            const last: Position = c.lastTopLevel();
            last_spot = last.insertAfter();
            last_spot.h = '@spot';
        }

        const undoData = c.undoer.beforeCloneNode(p);

        c.endEditing(); // Capture any changes to the headline.

        const clone: Position = p.copy();
        clone._linkAsNthChild(last_spot, last_spot.numberOfChildren());
        clone.setDirty();
        c.setChanged();

        if (c.checkOutline() === 0) {
            u.afterCloneNode(clone, 'Clone Node', undoData);
            c.contractAllHeadlines();
            c.redraw(clone);
        } else {
            clone.doDelete();
            c.setCurrentPosition(p);
        }
    }
    //@+node:felix.20211031143555.4: *4* c_oc.cloneToLastNode
    @commander_command(
        'clone-node-to-last-node',
        'Clone the selected node and move it to the last node. ' +
        'Do *not* change the selected node.'
    )
    public cloneToLastNode(this: Commands): void {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;

        if (!p || !p.__bool__()) {
            return;
        }
        const prev: Position = p.copy();
        const undoData: Bead = c.undoer.beforeCloneNode(p);
        c.endEditing(); // Capture any changes to the headline.
        const clone: Position = p.clone();
        const last: Position = c.rootPosition()!;
        while (last && last.__bool__() && last.hasNext()) {
            last.moveToNext();
        }
        clone.moveAfter(last);
        clone.setDirty();
        c.setChanged();
        u.afterCloneNode(clone, 'Clone Node To Last', undoData);
        c.redraw(prev); // redraw selects p
        // return clone // For mod_labels and chapters plugins.
    }
    //@+node:felix.20211031143555.5: *4* c_oc.deleteOutline
    @commander_command('delete-node', 'Deletes the selected outline.')
    public deleteOutline(
        this: Commands,
        op_name: string = 'Delete Node'
    ): void {
        const c: Commands = this;
        const p: Position = c.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        let newNode: Position | undefined;
        c.endEditing(); // Make sure we capture the headline for Undo.
        if (false) {
            // c.config.getBool('select-next-after-delete'):
            // #721: Optionally select next node after delete.
            if (p.hasVisNext(c)) {
                newNode = p.visNext(c);
            } else if (p.hasParent()) {
                newNode = p.parent();
            } else {
                newNode = p.back(); // _not_ p.visBack(): we are at the top level.
            }
        } else {
            // Legacy: select previous node if possible.
            const back = p.hasVisBack(c);
            if (back && back.__bool__()) {
                newNode = p.visBack(c);
            } else {
                newNode = p.next(); // _not_ p.visNext(): we are at the top level.
            }
        }

        if (!newNode || !newNode.__bool__()) {
            return;
        }
        const undoData: Bead = u.beforeDeleteNode(p);
        p.setDirty();
        p.doDelete(newNode);
        c.setChanged();
        u.afterDeleteNode(newNode, op_name, undoData);
        c.redraw(newNode); // redraw selects p
        c.validateOutline();
    }
    //@+node:felix.20211031143555.6: *4* c_oc.insertChild
    @commander_command(
        'insert-child',
        'Insert a node after the presently selected node.'
    )
    public insertChild(this: Commands): Position | undefined {
        const c: Commands = this;
        return c.insertHeadline('Insert Child', true);
    }
    //@+node:felix.20230702235720.1: *4* c_oc.asyncInsertChild
    @commander_command(
        'async-insert-child',
        'Insert a node after the presently selected node.'
    )
    public asyncInsertChild(this: Commands): Thenable<Position> {
        const c: Commands = this;
        const p = c.insertHeadline('Insert Child', true);
        return g.app.gui.editHeadline(p, true, 'Insert Child');
    }
    //@+node:felix.20211031143555.7: *4* c_oc.insertHeadline (insert-*)
    @commander_command(
        'insert-node',
        'If c.p is expanded, insert a new node as the first or last child of c.p,' +
        'depending on @bool insert-new-nodes-at-end.' +
        'If c.p is not expanded, insert a new node after c.p.'
    )
    public insertHeadline(
        this: Commands,
        op_name: string = 'Insert Node',
        as_child: boolean = false
    ): Position | undefined {
        const c: Commands = this;
        // Fix #600.
        return this.insertHeadlineHelper(c, op_name, as_child, false, false);
    }
    @commander_command(
        'insert-as-first-child',
        'Insert a node as the first child of the previous node.'
    )
    public insertNodeAsFirstChild(this: Commands): Position | undefined {
        const c: Commands = this;
        return this.insertHeadlineHelper(c, undefined, false, true, false);
    }
    @commander_command(
        'insert-as-last-child',
        'Insert a node as the last child of the previous node.'
    )
    public insertNodeAsLastChild(this: Commands): Position | undefined {
        const c: Commands = this;
        return this.insertHeadlineHelper(c, undefined, false, false, true);
    }
    //@+node:felix.20211031143555.8: *4* private insertHeadlineHelper
    /**
     * Insert a node after the presently selected node.
     */
    private insertHeadlineHelper(
        c: Commands,
        op_name = 'Insert Node',
        as_child: boolean = false,
        as_first_child: boolean = false,
        as_last_child: boolean = false
    ): Position | undefined {
        const u: Undoer = c.undoer;
        const current: Position = c.p;
        if (!current || !current.__bool__()) {
            return;
        }
        c.endEditing();
        const undoData: Bead = c.undoer.beforeInsertNode(current);
        let p: Position;
        if (as_first_child) {
            p = current.insertAsNthChild(0);
        } else if (as_last_child) {
            p = current.insertAsLastChild();
        } else if (
            as_child ||
            (current.hasChildren() && current.isExpanded()) ||
            (c.hoistStack.length &&
                current.__eq__(c.hoistStack[c.hoistStack.length - 1].p))
        ) {
            // Make sure the new node is visible when hoisting.
            if (c.config.getBool('insert-new-nodes-at-end')) {
                p = current.insertAsLastChild();
            } else {
                p = current.insertAsNthChild(0);
            }
        } else {
            p = current.insertAfter();
        }
        g.doHook('create-node', { c: c, p: p });
        p.setDirty();
        c.setChanged();
        u.afterInsertNode(p, op_name, undoData);
        // c.redrawAndEdit(p, true);
        c.redraw(p);
        return p;
    }
    //@+node:felix.20230702232913.1: *4* c_oc.asyncInsertHeadline (insert-*)
    //
    //
    //
    @commander_command(
        'async-insert-node',
        'If c.p is expanded, insert a new node as the first or last child of c.p,' +
        'depending on @bool insert-new-nodes-at-end.' +
        'If c.p is not expanded, insert a new node after c.p.'
    )
    public asyncInsertHeadline(
        this: Commands,
        op_name: string = 'Insert Node',
        as_child: boolean = false
    ): Thenable<Position> {
        const c: Commands = this;
        // Fix #600.
        const p = this.insertHeadlineHelper(c, op_name, as_child, false, false);
        return g.app.gui.editHeadline(p, true, op_name);
    }
    @commander_command(
        'async-insert-as-first-child',
        'Insert a node as the first child of the previous node.'
    )
    public asyncInsertNodeAsFirstChild(this: Commands): Thenable<Position> {
        const c: Commands = this;
        const p = this.insertHeadlineHelper(c, undefined, false, true, false);
        return g.app.gui.editHeadline(p, true, 'Insert As First Child');
    }
    @commander_command(
        'async-insert-as-last-child',
        'Insert a node as the last child of the previous node.'
    )
    public asyncInsertNodeAsLastChild(this: Commands): Thenable<Position> {
        const c: Commands = this;
        const p = this.insertHeadlineHelper(c, undefined, false, false, true);
        return g.app.gui.editHeadline(p, true, 'Insert As Last Child');
    }
    //@+node:felix.20211031143555.9: *4* c_oc.insertHeadlineBefore
    @commander_command(
        'insert-node-before',
        'Insert a node before the presently selected node.'
    )
    public insertHeadlineBefore(this: Commands): Position | undefined {
        const c: Commands = this;
        const current: Position = c.p;
        const u: Undoer = c.undoer;
        const op_name: string = 'Insert Node Before';
        if (!current || !current.__bool__()) {
            return;
        }
        // Can not insert before the base of a hoist.
        if (
            c.hoistStack.length &&
            current.__eq__(c.hoistStack[c.hoistStack.length - 1].p)
        ) {
            g.warning('can not insert a node before the base of a hoist');
            return;
        }
        c.endEditing();
        const undoData: Bead = u.beforeInsertNode(current);
        const p: Position = current.insertBefore();
        g.doHook('create-node', { c: c, p: p });
        p.setDirty();
        c.setChanged();
        u.afterInsertNode(p, op_name, undoData);
        // c.redrawAndEdit(p, true);
        c.redraw(p);
        return p;
    }
    //@+node:felix.20230702232930.1: *4* c_oc.asyncInsertHeadlineBefore
    @commander_command(
        'async-insert-node-before',
        'Insert a node before the presently selected node.'
    )
    public asyncInsertHeadlineBefore(
        this: Commands
    ): Thenable<Position | undefined> {
        const c: Commands = this;
        const current: Position = c.p;
        const u: Undoer = c.undoer;
        const op_name: string = 'Insert Node Before';
        if (!current || !current.__bool__()) {
            return Promise.resolve(undefined);
        }
        // Can not insert before the base of a hoist.
        if (
            c.hoistStack.length &&
            current.__eq__(c.hoistStack[c.hoistStack.length - 1].p)
        ) {
            g.warning('can not insert a node before the base of a hoist');
            return Promise.resolve(undefined);
        }
        c.endEditing();
        const undoData: Bead = u.beforeInsertNode(current);
        const p: Position = current.insertBefore();
        g.doHook('create-node', { c: c, p: p });
        p.setDirty();
        c.setChanged();
        u.afterInsertNode(p, op_name, undoData);

        // return c.redrawAndEdit(p, true);
        c.redraw(p);
        return g.app.gui.editHeadline(p, true, op_name);
    }
    //@+node:felix.20211025223803.1: *3* c_oc.Mark commands
    //@+node:felix.20211025223803.2: *4* c_oc.cloneMarked
    @commander_command(
        'clone-marked-nodes',
        'Clone all marked nodes as children of a new node.'
    )
    public cloneMarked(this: Commands): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        const p1: Position = c.p.copy();
        // Create a new node to hold clones.
        const parent: Position = p1.insertAfter();
        parent.h = 'Clones of marked nodes';

        const cloned: string[] = []; // GNX instead of direct 'v' to ease comparison
        let n: number = 0;
        let p: Position = c.rootPosition()!;

        while (p && p.__bool__()) {
            // Careful: don't clone already-cloned nodes.
            if (p.__eq__(parent)) {
                p.moveToNodeAfterTree();
                // }else if(p.isMarked() && (p.v.gnx not in cloned) ){
            } else if (p.isMarked() && !cloned.includes(p.v.gnx)) {
                cloned.push(p.v.gnx);
                // Create the clone directly as a child of parent.
                const p2 = p.copy();
                n = parent.numberOfChildren();
                p2._linkAsNthChild(parent, n);
                p.moveToNodeAfterTree();
                n += 1;
            } else {
                p.moveToThreadNext();
            }
        }
        if (n) {
            c.setChanged();
            parent.expand();
            c.selectPosition(parent);
            u.afterCloneMarkedNodes(p1);
        } else {
            parent.doDelete();
            c.selectPosition(p1);
        }
        if (!g.unitTesting) {
            g.blue(`cloned ${n} nodes`);
        }
        c.redraw();
    }

    //@+node:felix.20211025223803.3: *4* c_oc.copyMarked
    @commander_command(
        'copy-marked-nodes',
        'Copy all marked nodes as children of a new node.'
    )
    public copyMarked(this: Commands): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        const p1: Position = c.p.copy();
        // Create a new node to hold clones.
        const parent: Position = p1.insertAfter();
        parent.h = 'Copies of marked nodes';
        const copied: string[] = []; // GNX instead of direct 'v' to ease comparison
        let n: number = 0;
        let p: Position = c.rootPosition()!;
        while (p && p.__bool__()) {
            // Careful: don't clone already-cloned nodes.
            if (p.__eq__(parent)) {
                p.moveToNodeAfterTree();
            } else if (p.isMarked() && !copied.includes(p.v.gnx)) {
                copied.push(p.v.gnx);
                const p2 = p.copyWithNewVnodes(true);
                p2._linkAsNthChild(parent, n);
                p.moveToNodeAfterTree();
                n += 1;
            } else {
                p.moveToThreadNext();
            }
        }
        if (n) {
            c.setChanged();
            parent.expand();
            c.selectPosition(parent);
            u.afterCopyMarkedNodes(p1);
        } else {
            parent.doDelete();
            c.selectPosition(p1);
        }
        if (!g.unitTesting) {
            g.blue(`copied ${n} nodes`);
        }
        c.redraw();
    }

    //@+node:felix.20211025223803.4: *4* c_oc.deleteMarked
    @commander_command('delete-marked-nodes', 'Delete all marked nodes.')
    public deleteMarked(this: Commands): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        const p1: Position = c.p.copy();
        const undo_data: Position[] = [];
        let p: Position = c.rootPosition()!;
        while (p && p.__bool__()) {
            if (p.isMarked()) {
                undo_data.push(p.copy());
                const next = p.positionAfterDeletedTree();
                p.doDelete();
                p = next;
            } else {
                p.moveToThreadNext();
            }
        }
        if (undo_data.length) {
            u.afterDeleteMarkedNodes(undo_data, p1);
            if (!g.unitTesting) {
                g.blue(`deleted ${undo_data.length} nodes`);
            }
            c.setChanged();
        }
        // Don't even *think* about restoring the old position.
        c.contractAllHeadlines();
        c.redraw(c.rootPosition());
    }

    //@+node:felix.20211025223803.5: *4* c_oc.moveMarked
    @commander_command(
        'move-marked-nodes',
        'Move all marked nodes as children of a new node. ' +
        'This command is not undoable. ' +
        'Consider using clone-marked-nodes, followed by copy/paste instead.'
    )
    public async moveMarked(this: Commands): Promise<unknown> {
        const c: Commands = this;
        const p1 = c.p.copy();
        // Check for marks.
        let someMarked: boolean = false;
        for (let v of c.all_unique_nodes()) {
            if (v.isMarked()) {
                someMarked = true;
                break;
            }
        }
        if (!someMarked) {
            g.warning('no marked nodes');
            return;
        }

        const result = await g.app.gui.runAskYesNoDialog(
            c,
            'Move Marked Nodes?',
            'move-marked-nodes is not undoable. Proceed?'
        );
        if (result === 'no') {
            return;
        }

        // Create a new *root* node to hold the moved nodes.
        // This node's position remains stable while other nodes move.
        const parent = createMoveMarkedNode(c);
        g.assert(!parent.isMarked());
        const moved: Position[] = [];
        let p = c.rootPosition()!;
        while (p && p.__bool__()) {
            g.assert(parent.__eq__(c.rootPosition()!));
            // Careful: don't move already-moved nodes.
            if (p.isMarked() && !parent.isAncestorOf(p)) {
                moved.push(p.copy());
                const next = p.positionAfterDeletedTree();
                p.moveToLastChildOf(parent);
                // This does not change parent's position.
                p = next;
            } else {
                p.moveToThreadNext();
            }
        }
        if (moved.length) {
            // Find a position p2 outside of parent's tree with p2.v == p1.v.
            // Such a position may not exist.
            let p2: Position = c.rootPosition()!;
            let found: boolean = false;
            while (p2 && p2.__bool__()) {
                if (p2.__eq__(parent)) {
                    p2.moveToNodeAfterTree();
                } else if (p2.v.gnx === p1.v.gnx) {
                    found = true;
                    break;
                } else {
                    p2.moveToThreadNext();
                }
            }
            if (!found) {
                // Not found.  Move to last top-level.
                p2 = c.lastTopLevel();
            }
            parent.moveAfter(p2);
            // u.afterMoveMarkedNodes(moved, p1)
            if (!g.unitTesting) {
                g.blue(`moved ${moved.length} nodes`);
            }
            c.setChanged();
        }
        // Calling c.contractAllHeadlines() causes problems when in a chapter.
        c.redraw(parent);
    }

    //@+node:felix.20211025223803.7: *4* c_oc.markChangedHeadlines
    @commander_command(
        'mark-changed-items',
        'Mark all nodes that have been changed.'
    )
    @commander_command(
        'mark-changed-nodes',
        'Mark all nodes that have been changed.'
    )
    public markChangedHeadlines(this: Commands): void {
        const c: Commands = this;
        const current: Position = this.p;
        const u: Undoer = c.undoer;
        const undoType: string = 'Mark Changed';
        c.endEditing();
        let changed = false;
        for (let p of c.all_unique_positions()) {
            if (p.isDirty() && !p.isMarked()) {
                if (!changed) {
                    u.beforeChangeGroup(current, undoType);
                }
                changed = true;
                const bunch = u.beforeMark(p, undoType);
                // c.setMarked calls a hook.
                c.setMarked(p);
                p.setDirty();
                c.setChanged();
                u.afterMark(p, undoType, bunch);
            }
        }
        if (changed) {
            u.afterChangeGroup(current, undoType);
        }
        if (!g.unitTesting) {
            g.blue('done');
        }
    }

    //@+node:felix.20211025223803.9: *4* c_oc.markHeadline
    @commander_command('mark', 'Toggle the mark of the selected node.') //  Compatibility
    @commander_command('toggle-mark', 'Toggle the mark of the selected node.')
    public markHeadline(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        c.endEditing();
        const undoType: string = p.isMarked() ? 'Unmark' : 'Mark';
        const bunch = u.beforeMark(p, undoType);
        // c.set/clearMarked call a hook.
        if (p.isMarked()) {
            c.clearMarked(p);
        } else {
            c.setMarked(p);
        }
        p.setDirty();
        c.setChanged();
        u.afterMark(p, undoType, bunch);
    }
    //@+node:felix.20211025223803.10: *4* c_oc.markSubheads
    @commander_command(
        'mark-subheads',
        'Mark all children of the selected node as changed.'
    )
    public markSubheads(this: Commands): void {
        const c: Commands = this;
        const current: Position = this.p;
        const u: Undoer = c.undoer;
        const undoType: string = 'Mark Subheads';
        if (!current || !current.__bool__()) {
            return;
        }
        c.endEditing();
        let changed = false;
        for (let p of current.children()) {
            if (!p.isMarked()) {
                if (!changed) {
                    u.beforeChangeGroup(current, undoType);
                }
                changed = true;
                const bunch = u.beforeMark(p, undoType);
                c.setMarked(p); // Calls a hook.
                p.setDirty();
                c.setChanged();
                u.afterMark(p, undoType, bunch);
            }
        }
        if (changed) {
            u.afterChangeGroup(current, undoType);
        }
    }
    //@+node:felix.20211025223803.11: *4* c_oc.unmarkAll
    @commander_command('unmark-all', 'Unmark all nodes in the entire outline.')
    public unmarkAll(this: Commands): void {
        const c: Commands = this;
        const current: Position = this.p;
        const u: Undoer = c.undoer;
        const undoType: string = 'Unmark All';
        if (!current || !current.__bool__()) {
            return;
        }
        c.endEditing();
        let changed = false;
        let w_p: Position | undefined; //  To keep pylint happy.
        for (let p of c.all_unique_positions()) {
            if (p.isMarked()) {
                if (!changed) {
                    u.beforeChangeGroup(current, undoType);
                }
                const bunch = u.beforeMark(p, undoType);
                // c.clearMarked(p) // Very slow: calls a hook.
                p.v.clearMarked();
                p.setDirty();
                u.afterMark(p, undoType, bunch);
                changed = true;
            }
            w_p = p;
        }
        if (changed) {
            g.doHook("clear-all-marks", { c: c, p: w_p });
            c.setChanged();
            u.afterChangeGroup(current, undoType);
        }
    }
    //@+node:felix.20211031235049.1: *3* c_oc.Move commands
    //@+node:felix.20211031235049.2: *4* c_oc.demote
    @commander_command(
        'demote',
        'Make all following siblings children of the selected node.'
    )
    public demote(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__() || !p.hasNext()) {
            c.treeFocusHelper();
            return;
        }
        // Make sure all the moves will be valid.
        const next: Position = p.next();

        while (next && next.__bool__()) {
            if (!c.checkMoveWithParentWithWarning(next, p, true)) {
                c.treeFocusHelper();
                return;
            }
            next.moveToNext();
        }
        c.endEditing();
        const parent_v: VNode = p._parentVnode()!;
        const n: number = p.childIndex();
        const followingSibs: VNode[] = parent_v.children.slice(n + 1);
        // Remove the moved nodes from the parent's children.
        parent_v.children = parent_v.children.slice(0, n + 1);
        // Add the moved nodes to p's children
        p.v.children.push(...followingSibs);
        // Adjust the parent links in the moved nodes.
        // There is no need to adjust descendant links.
        for (let child of followingSibs) {
            // child.parents.remove(parent_v);
            const index = child.parents.indexOf(parent_v);
            if (index >= 0) {
                child.parents.splice(index, 1);
            }
            child.parents.push(p.v);
        }
        p.expand();
        p.setDirty();
        c.setChanged();
        u.afterDemote(p, followingSibs);
        c.redraw(p); // redraw selects p
        // c.updateSyntaxColorer(p); // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.3: *4* c_oc.moveOutlineDown
    @commander_command('move-outline-down', 'Move the selected node down.')
    public moveOutlineDown(this: Commands): void {
        // Moving down is more tricky than moving up because we can't
        // move p to be a child of itself.
        //
        // An important optimization:
        // we don't have to call checkMoveWithParentWithWarning() if the parent of
        // the moved node remains the same.
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!c.canMoveOutlineDown()) {
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            c.treeFocusHelper();
            return;
        }
        const parent: Position = p.parent();
        let next: Position | undefined = p.visNext(c);
        while (next && next.__bool__() && p.isAncestorOf(next)) {
            next = next.visNext(c);
        }
        if (!next || !next.__bool__()) {
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            c.treeFocusHelper();
            return;
        }
        c.endEditing();
        const undoData: Bead = u.beforeMoveNode(p);

        let moved: boolean;

        //@+<< Move p down & set moved if successful >>
        //@+node:felix.20211031235049.4: *5* << Move p down & set moved if successful >>
        if (next.hasChildren() && next.isExpanded()) {
            // Attempt to move p to the first child of next.
            moved = c.checkMoveWithParentWithWarning(p, next, true);
            if (moved) {
                p.setDirty();
                p.moveToNthChildOf(next, 0);
            }
        } else {
            // Attempt to move p after next.
            moved = c.checkMoveWithParentWithWarning(p, next.parent(), true);
            if (moved) {
                p.setDirty();
                p.moveAfter(next);
            }
        }
        // Patch by nh2: 0004-Add-bool-collapse_nodes_after_move-option.patch
        if (
            c.collapse_nodes_after_move &&
            moved &&
            c.sparse_move &&
            parent.__bool__() &&
            !parent.isAncestorOf(p)
        ) {
            // New in Leo 4.4.2: contract the old parent if it is no longer the parent of p.
            parent.contract();
        }
        //@-<< Move p down & set moved if successful >>

        if (moved) {
            p.setDirty();
            c.setChanged();
            u.afterMoveNode(p, 'Move Down', undoData);
        }
        c.redraw(p); // redraw selects p
        // c.updateSyntaxColorer(p) // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.5: *4* c_oc.moveOutlineLeft
    @commander_command(
        'move-outline-left',
        'Move the selected node left if possible.'
    )
    public moveOutlineLeft(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!c.canMoveOutlineLeft()) {
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            c.treeFocusHelper();
            return;
        }
        if (!p.hasParent()) {
            c.treeFocusHelper();
            return;
        }
        const parent: Position = p.parent();
        c.endEditing();
        const undoData: Bead = u.beforeMoveNode(p);
        p.setDirty();
        p.moveAfter(parent);
        p.setDirty();
        c.setChanged();
        u.afterMoveNode(p, 'Move Left', undoData);
        // Patch by nh2: 0004-Add-bool-collapse_nodes_after_move-option.patch
        if (c.collapse_nodes_after_move && c.sparse_move) {
            // New in Leo 4.4.2
            parent.contract();
        }
        c.redraw(p); // redraw selects p
        // c.recolor()  // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.6: *4* c_oc.moveOutlineRight
    @commander_command(
        'move-outline-right',
        'Move the selected node right if possible.'
    )
    public moveOutlineRight(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!c.canMoveOutlineRight()) {
            // 11/4/03: Support for hoist.
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            c.treeFocusHelper();
            return;
        }
        const back: Position = p.back();
        if (!back || !back.__bool__()) {
            c.treeFocusHelper();
            return;
        }
        if (!c.checkMoveWithParentWithWarning(p, back, true)) {
            c.treeFocusHelper();
            return;
        }
        c.endEditing();
        const undoData: Bead = u.beforeMoveNode(p);
        p.setDirty();
        const n: number = back.numberOfChildren();
        p.moveToNthChildOf(back, n);
        p.setDirty();
        c.setChanged(); // #2036.
        u.afterMoveNode(p, 'Move Right', undoData);
        c.redraw(p); // redraw selects p
        // c.recolor()
    }
    //@+node:felix.20211031235049.7: *4* c_oc.moveOutlineUp
    @commander_command(
        'move-outline-up',
        'Move the selected node up if possible.'
    )
    public moveOutlineUp(this: Commands): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            return;
        }
        if (!c.canMoveOutlineUp()) {
            // Support for hoist.
            if (c.hoistStack.length) {
                cantMoveMessage(c);
            }
            c.treeFocusHelper();
            return;
        }
        const back = p.visBack(c);
        if (!back || !back.__bool__()) {
            return;
        }
        const back2 = back.visBack(c);
        c.endEditing();
        const undoData: Bead = u.beforeMoveNode(p);
        let moved: boolean = false;

        //@+<< Move p up >>
        //@+node:felix.20211031235049.8: *5* << Move p up >>
        const parent: Position = p.parent();
        if (!back2 || !back2.__bool__()) {
            if (c.hoistStack.length) {
                // hoist or chapter.
                const w_visLimit: [Position | undefined, boolean | undefined] =
                    c.visLimit();
                const limit: Position | undefined = w_visLimit[0];
                const limitIsVisible: boolean | undefined = w_visLimit[1];
                // assert limit
                if (limitIsVisible) {
                    // canMoveOutlineUp should have caught this.
                    g.trace('can not happen. In hoist');
                } else {
                    moved = true;
                    p.setDirty();
                    p.moveToFirstChildOf(limit!);
                }
            } else {
                // p will be the new root node;
                p.setDirty();
                p.moveToRoot();
                moved = true;
            }
        } else if (back2.hasChildren() && back2.isExpanded()) {
            if (c.checkMoveWithParentWithWarning(p, back2, true)) {
                moved = true;
                p.setDirty();
                p.moveToNthChildOf(back2, 0);
            }
        } else {
            if (c.checkMoveWithParentWithWarning(p, back2.parent(), true)) {
                moved = true;
                p.setDirty();
                p.moveAfter(back2);
            }
        }
        // Patch by nh2: 0004-Add-bool-collapse_nodes_after_move-option.patch
        if (
            c.collapse_nodes_after_move &&
            moved &&
            c.sparse_move &&
            parent.__bool__() &&
            !parent.isAncestorOf(p)
        ) {
            // New in Leo 4.4.2: contract the old parent if it is no longer the parent of p.
            parent.contract();
        }
        //@-<< Move p up >>

        if (moved) {
            p.setDirty();
            c.setChanged();
            u.afterMoveNode(p, 'Move Up', undoData);
        }
        c.redraw(p); // redraw selects p
        // c.updateSyntaxColorer(p);  // Moving can change syntax coloring.
    }
    //@+node:felix.20230902141341.1: *4* c_oc.moveOutlineToFirstChild
    @commander_command('move-outline-to-first-child',
        'Move the selected node so that it is the first child of its parent. ' +
        'Do nothing if a hoist is in effect.'
    )
    public moveOutlineToFirstChild(this: Commands): void {

        const c = this;
        const p = this.p;
        const u = this.undoer;

        if (!p || !p.__bool__()) {
            return;
        }
        if (c.hoistStack && c.hoistStack.length) {
            return;
        }
        if (!p.hasBack()) {
            return;
        }
        const parent = p.parent();
        if (!parent || !parent.__bool__()) {
            return;
        }
        c.endEditing();
        const undoData = u.beforeMoveNode(p);
        p.moveToNthChildOf(p.parent(), 0);
        p.setDirty();
        c.setChanged();
        u.afterMoveNode(p, 'Move To First Child', undoData);
        c.redraw(p);

    }
    //@+node:felix.20230902141347.1: *4* c_oc.moveOutlineToLastChild
    @commander_command('move-outline-to-last-child',
        'Move the selected node so that it is the last child of its parent. ' +
        'Do nothing if a hoist is in effect.'
    )
    public moveOutlineToLastChild(this: Commands): void {

        const c = this;
        const p = this.p;
        const u = this.undoer;

        if (!p || !p.__bool__()) {
            return;
        }
        if (c.hoistStack && c.hoistStack.length) {
            return;
        }
        if (!p.hasNext()) {
            return;
        }
        const parent = p.parent();
        if (!parent || !parent.__bool__()) {
            return;
        }
        c.endEditing();
        const undoData = u.beforeMoveNode(p);
        p.moveToNthChildOf(parent, parent.v.children.length - 1);
        p.setDirty();
        c.setChanged();
        u.afterMoveNode(p, 'Move To Last Child', undoData);
        c.redraw(p);

    }
    //@+node:felix.20211031235049.9: *4* c_oc.promote
    @commander_command(
        'promote',
        'Make all children of the selected nodes siblings of the selected node.'
    )
    public promote(this: Commands, undoFlag = true): void {
        const c: Commands = this;
        const p: Position = this.p;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__() || !p.hasChildren()) {
            c.treeFocusHelper();
            return;
        }
        c.endEditing();
        const children: VNode[] = p.v.children; // First, for undo.
        p.promote();
        c.setChanged();
        if (undoFlag) {
            p.setDirty();
            u.afterPromote(p, children);
        }
        c.redraw(p); // redraw selects p
        // c.updateSyntaxColorer(p); // Moving can change syntax coloring.
    }
    //@+node:felix.20211031235049.10: *4* c_oc.toggleSparseMove
    @commander_command(
        'toggle-sparse-move',
        'Toggle whether moves collapse the outline.'
    )
    public toggleSparseMove(this: Commands): void {
        const c: Commands = this;
        c.sparse_move = !c.sparse_move;
        if (!g.unitTesting) {
            g.blue(`sparse-move: ${c.sparse_move}`);
        }
    }
    //@+node:felix.20211031235022.1: *3* c_oc.Sort commands
    //@+node:felix.20230321002512.1: *4* c_oc.reverseSortChildren
    @commander_command(
        'reverse-sort-children',
        'Sort the children of a node in reverse order.'
    )
    public reverseSortChildren(this: Commands, key = undefined): void {
        this.sortChildren(key, true); // as reverse, Fixes #3188
    }
    //@+node:felix.20230321002519.1: *4* c_oc.reverseSortSiblings
    @commander_command(
        'reverse-sort-siblings',
        'Sort the siblings of a node in reverse order.'
    )
    public reverseSortSiblings(this: Commands, key = undefined): void {
        this.sortSiblings(undefined, false, key, true); // as reverse, Fixes #3188
    }
    //@+node:felix.20211031235022.2: *4* c_oc.sortChildren
    @commander_command('sort-children', 'Sort the children of a node.')
    public sortChildren(
        this: Commands,
        key = undefined,
        reverse = false
    ): void {
        // This method no longer supports the 'cmp' keyword arg.
        const c: Commands = this;
        const p: Position = c.p;
        if (p && p.__bool__() && p.hasChildren()) {
            c.sortSiblings(p.firstChild(), true, key, reverse);
        }
    }
    //@+node:felix.20211031235022.3: *4* c_oc.sortSiblings
    @commander_command('sort-siblings', 'Sort the siblings of a node.')
    public sortSiblings(
        this: Commands,
        // cmp keyword is no longer supported.
        p: Position | undefined = undefined,
        sortChildren: boolean = false,
        key: undefined | ((a: VNode, b: VNode) => number) = undefined,
        reverse: boolean = false
    ): void {
        const c: Commands = this;
        const u: Undoer = c.undoer;
        if (!p || !p.__bool__()) {
            p = c.p; // in parameter is undefined
        }
        if (!p || !p.__bool__()) {
            return;
        }
        const oldP = p.copy();
        const newP = p.copy();
        c.endEditing();
        let undoType: string = sortChildren ? 'Sort Children' : 'Sort Siblings';
        if (reverse) {
            undoType = 'Reverse ' + undoType;
        }
        const parent_v: VNode = p._parentVnode()!;
        const oldChildren: VNode[] = [...parent_v.children];
        const newChildren: VNode[] = [...parent_v.children];
        if (key === undefined) {
            key = (a, b) => {
                if (a.h.toLowerCase() < b.h.toLowerCase()) {
                    return -1;
                }
                if (a.h.toLowerCase() > b.h.toLowerCase()) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            };
        }
        newChildren.sort(key);
        if (reverse) {
            newChildren.reverse();
        }
        // Compare those arrays to see if sort was needed
        let same: boolean = true;
        for (var _i = 0; _i < oldChildren.length; _i++) {
            if (oldChildren[_i].gnx !== newChildren[_i].gnx) {
                same = false;
                break;
            }
        }
        if (same) {
            return; // Not even needed!
        }
        // 2010/01/20. Fix bug 510148.
        c.setChanged();
        const bunch: Bead = u.beforeSort(
            p,
            undoType,
            oldChildren,
            newChildren,
            sortChildren
        );
        // A copy, so its not the undo bead's oldChildren. Fixes #3205
        parent_v.children = [...newChildren];
        // Sorting destroys position p, and possibly the root position.
        // Only the child index of new position changes!
        for (var _i = 0; _i < newChildren.length; _i++) {
            const v = newChildren[_i];
            if (v.gnx === oldP.v.gnx) {
                newP._childIndex = _i;
                break;
            }
        }
        if (newP.parent() && newP.parent().__bool__()) {
            newP.parent().setDirty();
        }
        if (sortChildren) {
            c.redraw(newP.parent());
        } else {
            c.redraw(newP);
        }
    }
    //@+node:felix.20230322231828.1: *3* count-children

    @commander_command(
        'count-children',
        'Print out the number of children for the currently selected node'
    )
    public count_children(this: Commands): number {
        const c: Commands = this;
        let childQty: number = 0;
        if (c) {
            childQty = c.p.numberOfChildren();
            g.es_print(`${childQty} children`);
        }
        return childQty;
    }
    //@-others
}
//@-others
//@-leo
