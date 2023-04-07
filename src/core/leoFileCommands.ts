//@+leo-ver=5-thin
//@+node:felix.20210220181245.1: * @file src/core/leoFileCommands.ts
//@+<< imports >>
//@+node:felix.20210220195150.1: ** << imports >>
import * as vscode from "vscode";
import { Utils as uriUtils } from "vscode-uri";
import * as g from './leoGlobals';
import { VNode, Position, StatusFlags } from './leoNodes';
import { Commands } from './leoCommands';
import { new_cmd_decorator } from './decorators';
import "date-format-lite";
import * as et from 'elementtree';
import * as md5 from 'md5';
var binascii = require('binascii');
var pickle = require('./jpicklejs');
var difflib = require('difflib');
// example :
// const matcher = new difflib.SequenceMatcher(null, sttWordsStripped, transcriptWordsStripped);
// const opCodes = matcher.getOpcodes();

//@-<< imports >>
//@+<< interfaces >>
//@+node:felix.20211222215152.1: ** << interfaces >>
interface DbRow {
    gnx: string;
    h: string;
    b: string;
    children: string[];
    parents: string[];
    iconVal: number;
    statusBits: number;
    u: any;
}

type sqlDbRow = [
    string,
    string,
    string,
    string,
    string,
    number,
    number,
    string
];

interface VNodeJSON {
    gnx: string;
    vh: string;
    status: number;
    children: VNodeJSON[];
}
//@-<< interfaces >>
//@+<< constants >>
//@+node:felix.20211222215249.1: ** << constants >>
const PRIVAREA: string = '---begin-private-area---';
//@-<< constants >>

//@+others
//@+node:felix.20211212220328.1: ** u.cmd (decorator)
/**
 * Command decorator for the FileCommands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'fileCommands']);
}
//@+node:felix.20211213223326.1: ** class BadLeoFile
class BadLeoFile extends Error {

    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BadLeoFile.prototype);
    }

    // = () : trick for toString as per https://stackoverflow.com/a/35361695/920301
    public toString = (): string => {
        return "Bad Leo File:" + this.message;
    };
}
//@+node:felix.20211213223342.1: ** class FastRead
export class FastRead {

    public c: Commands;
    public gnx2vnode: { [key: string]: VNode; };

    public nativeVnodeAttributes: string[] = [
        'a',
        'descendentTnodeUnknownAttributes',
        'descendentVnodeUnknownAttributes',
        'expanded', 'marks', 't'
    ];

    constructor(c: Commands, gnx2vnode: { [key: string]: VNode; }) {
        this.c = c;
        this.gnx2vnode = gnx2vnode;
    }

    //@+others
    //@+node:felix.20211213223342.2: *3* fast.readFile
    /**
     * Read the file, change splitter ratios, and return its hidden vnode.
     */
    public async readFile(path: string): Promise<VNode | undefined> {

        // const w_uri = vscode.Uri.file(path);
        const w_uri = g.makeVscodeUri(path);
        const readData = await vscode.workspace.fs.readFile(w_uri);
        const s = Buffer.from(readData).toString('utf8');

        //const s: string = fs.readFileSync(theFile).toString();

        let v: VNode | undefined;
        let g_element: et.Element | undefined;
        [v, g_element] = this.readWithElementTree(path, s);

        if (!v) {  // #1510.
            return undefined;
        }
        this.scanGlobals(g_element!);
        // #1047: only this method changes splitter sizes.

        // #1111: ensure that all outlines have at least one node.
        if (!v.children || !v.children.length) {
            const new_vnode: VNode = new VNode(this.c);
            new_vnode.h = 'newHeadline';
            v.children = [new_vnode];
        }
        return v;
    }
    //@+node:felix.20230401175456.1: *3* fast.readJsonFile
    /**
     * Read the leojs JSON file, change splitter ratios, and return its hidden vnode.
     */
    public async readJsonFile(path: string): Promise<VNode | undefined> {

        // const w_uri = vscode.Uri.file(path);
        const w_uri = g.makeVscodeUri(path);
        const readData = await vscode.workspace.fs.readFile(w_uri);
        const s = Buffer.from(readData).toString('utf8');

        let v, g_dict;
        [v, g_dict] = this.readWithJsonTree(path, s);
        if (!v) { // #1510.
            return undefined;
        }
        // #1047: only this method changes splitter sizes.
        this.scanJsonGlobals(g_dict);
        //
        // #1111: ensure that all outlines have at least one node.
        if (!v.children || !v.children.length) {
            const new_vnode = new VNode(this.c);
            new_vnode.h = 'newHeadline';
            v.children = [new_vnode];
        }
        return v;
    }
    //@+node:felix.20211213223342.3: *3* fast.readFileFromClipboard
    /**
     * Recreate a file from a string s, and return its hidden vnode.
     *
     * Unlike readFile above, this does not affect splitter sizes.
     */
    public readFileFromClipboard(s: string): VNode | undefined {

        let v: VNode | undefined;
        let g_element: et.Element | undefined;
        [v, g_element] = this.readWithElementTree(undefined, s);

        if (!v) {  // #1510.
            return undefined;
        }

        // #1111: ensure that all outlines have at least one node.
        if (!v.children.length) {
            const new_vnode: VNode = new VNode(this.c);
            new_vnode.h = 'newHeadline';
            v.children = [new_vnode];
        }
        return v;
    }
    //@+node:felix.20211213223342.4: *3* fast.readWithElementTree & helpers
    // #1510: https://en.wikipedia.org/wiki/Valid_characters_in_XML.

    // TODO : NEEDED ?
    // translate_table = {z: None for z in range(20) if chr(z) not in '\t\r\n'}

    public readWithElementTree(path: string | undefined, s: string): [VNode, et.Element] | [undefined, undefined] {

        let contents: string = s;
        contents = g.toUnicode(s);

        // TODO : NEEDED ?
        // contents = contents.translate(this.translate_table); // #1036 and #1046.

        let xroot: et.ElementTree;

        try {
            xroot = et.parse(contents);
        } catch (e) {
            let message: string;
            // #970: Report failure here.
            if (path && path.length) {
                message = `bad .leo file: ${g.shortFileName(path)}`;
            } else {
                message = 'The clipboard is not a valid .leo file';
            }
            // g.es_print('\n' + message, 'red');
            g.es_print('\n' + message);
            g.es_print(g.toUnicode(e));
            // console.log('');
            return [undefined, undefined]; // #1510: Return a tuple.
        }

        let g_element: et.Element = xroot.find('globals')!;
        let v_elements: et.Element[] = xroot.find('vnodes')!.getchildren();
        let t_elements: et.Element[] = xroot.find('tnodes')!.getchildren();
        let gnx2body: { [key: string]: string; };
        let gnx2ua: { [key: string]: any; };
        [gnx2body, gnx2ua] = this.scanTnodes(t_elements);
        let hidden_v: VNode = this.scanVnodes(gnx2body, this.gnx2vnode, gnx2ua, v_elements);
        this.handleBits();
        return [hidden_v, g_element];
    }
    //@+node:felix.20211213223342.5: *4* fast.handleBits (reads c.db)
    /**
     * Restore the expanded and marked bits from c.db.
     */
    public handleBits(): void {
        const c: Commands = this.c;
        const fc = this.c.fileCommands;

        const w_expanded: string = c.db['expanded'];
        const w_marked: string = c.db['marked'];

        const a_expanded: string[] = (w_expanded && w_expanded.length) ? w_expanded.split(',') : [];

        const a_marked: string[] = (w_marked && w_marked.length) ? w_marked.split(',') : [];

        fc.descendentExpandedList = a_expanded;
        fc.descendentMarksList = a_marked;
    }
    //@+node:felix.20211213223342.6: *4* fast.resolveUa
    /**
     * Parse an unknown attribute in a <v> or <t> element.
     */
    public resolveUa(attr: string, val: any, kind?: string): string { // Kind is for unit testing.
        try {
            val = g.toEncodedString(val);
        }
        catch (e) {
            g.es_print('unexpected exception converting hexlified string to string');
            g.es_exception(e);
            return '';
        }
        // Leave string attributes starting with 'str_' alone.
        if (attr.startsWith('str_')) {
            if (typeof val === 'string' || Buffer.isBuffer(val)) {
                return g.toUnicode(val);
            }
        }
        // Support JSON encoded attributes
        if (attr.startsWith('json_')) {
            if (typeof val === 'string' || Buffer.isBuffer(val)) {
                try {
                    return JSON.parse(g.toUnicode(val));
                } catch (jsonJSONDecodeError) {
                    // fall back to standard handling
                    g.trace(`attribute not JSON encoded ${attr}=${g.toUnicode(val)}`);
                }
            }
        }
        let binString = "";
        try {
            binString = binascii.unhexlify(val);
            // Throws a TypeError if val is not a hex string.
        }
        catch (e) {
            // Assume that Leo 4.1 or above wrote the attribute.
            if (g.unitTesting) {
                console.log(kind === 'raw', `unit test failed: kind=${kind}`);
            } else {
                g.trace(`can not unhexlify ${attr}=${val}`);
            }
            return '';
        }
        try {
            // No change needed to support protocols.
            return pickle.loads(binString);
        }
        catch (err) {
            try {
                // TODO: cannot use second string 'bytes' parameter
                const val2 = pickle.loads(binString);
                return g.toUnicode(val2);
            }
            catch (e) {
                g.trace(`can not unpickle ${attr}=${val}`, e);
                return '';
            }
        }
    }
    //@+node:felix.20211213223342.8: *4* fast.scanGlobals & helper
    /**
     * Get global data from the cache, with reasonable defaults.
     */
    public scanGlobals(g_element: any): void {

        // TODO
        /*
        const c: Commands = this.c;
        let d = this.getGlobalData();
        windowSize = g.app.loadManager.options.get('windowSize')
        windowSpot = g.app.loadManager.options.get('windowSpot')
        if windowSize is not undefined
            h, w = windowSize  // checked in LM.scanOption.
        else
            w, h = d.get('width'), d.get('height')

        if windowSpot is undefined
            x, y = d.get('left'), d.get('top')
        else
            y, x = windowSpot  // #1263: (top, left)

        if 'size' in g.app.debug
            g.trace(w, h, x, y, c.shortFileName())

        // c.frame may be a NullFrame.
        c.frame.setTopGeometry(w, h, x, y)
        r1, r2 = d.get('r1'), d.get('r2')
        c.frame.resizePanesToRatio(r1, r2)
        frameFactory = getattr(g.app.gui, 'frameFactory', undefined)

        if not frameFactory
            return;

        assert frameFactory is not undefined
        mf = frameFactory.masterFrame;

        if g.app.start_minimized
            mf.showMinimized();
        else if g.app.start_maximized
            // #1189: fast.scanGlobals calls showMaximized later.
            mf.showMaximized();
        else if g.app.start_fullscreen
            mf.showFullScreen();
        else
            mf.show();
        */

    }
    //@+node:felix.20211213223342.9: *5* fast.getGlobalData
    /**
     * Return a dict containing all global data.
     */
    public getGlobalData(): {
        top: number; left: number;
        height: number; width: number;
        r1: number; r2: number;
    } {

        const c: Commands = this.c;

        // TODO
        /*
        try
            window_pos = c.db.get('window_position')
            r1 = float(c.db.get('body_outline_ratio', '0.5'))
            r2 = float(c.db.get('body_secondary_ratio', '0.5'))
            top, left, height, width = window_pos
            return {
                'top': int(top),
                'left': int(left),
                'height': int(height),
                'width': int(width),
                'r1': r1,
                'r2': r2,
            };
        except Exception:
            pass
        */

        // Use reasonable defaults.
        return {
            'top': 50, 'left': 50,
            'height': 500, 'width': 800,
            'r1': 0.5, 'r2': 0.5,
        };
    }
    //@+node:felix.20211213223342.10: *4* fast.scanTnodes
    public scanTnodes(t_elements: et.Element[]): [{ [key: string]: string }, { [key: string]: any }] {

        const gnx2body: { [key: string]: string } = {};
        const gnx2ua: { [key: string]: any } = {};

        for (let e of t_elements) {
            // First, find the gnx.
            let gnx = e.attrib['tx']!;
            gnx2body[gnx] = (e.text?.toString()) || '';
            // Next, scan for uA's for this gnx.
            //for key, val in e.attrib.items():
            for (let [key, val] of Object.entries(e.attrib)) {
                if (key !== 'tx') {
                    const s: string | undefined = this.resolveUa(key, val);
                    if (s) {
                        if (!gnx2ua[gnx]) {
                            gnx2ua[gnx] = {};
                        }
                        gnx2ua[gnx][key] = s;
                    }
                }
            }
        }
        return [gnx2body, gnx2ua];

    }
    //@+node:felix.20211213223342.11: *4* fast.scanVnodes & helper
    public scanVnodes(
        gnx2body: { [key: string]: string; },
        gnx2vnode: { [key: string]: VNode; },
        gnx2ua: { [key: string]: any; },
        v_elements: et.Element[]): VNode {

        const c: Commands = this.c;
        const fc = this.c.fileCommands;

        //@+<< define v_element_visitor >>
        //@+node:felix.20211213223342.12: *5* << define v_element_visitor >>
        /**
         * Visit the given element, creating or updating the parent vnode.
         */
        const v_element_visitor = (parent_e: et.Element[], parent_v: VNode): void => {
            for (let e of parent_e) {
                console.assert(['v', 'vh'].includes(e.tag.toString()), e.tag.toString());
                if (e.tag === 'vh') {
                    parent_v._headString = g.toUnicode(e.text || '');
                    continue;
                }
                // #1581: Attempt to handle old Leo outlines.
                let gnx: string | undefined;
                let v: VNode | undefined;
                try {
                    gnx = e.attrib['t']!;
                    v = gnx2vnode[gnx!];
                } catch (keyError) {
                    // g.trace('no "t" attrib');
                    gnx = undefined;
                    v = undefined;
                }
                if (v) {
                    // A clone
                    parent_v.children.push(v);
                    v.parents.push(parent_v);
                    // The body overrides any previous body text.
                    const body: string = g.toUnicode(gnx2body[gnx!] || '');
                    // assert isinstance(body, str), body.__class__.__name__;
                    console.assert((typeof body) === 'string', (typeof body));
                    v._bodyString = body;
                } else {
                    //@+<< Make a new vnode, linked to the parent >>
                    //@+node:felix.20211213223342.13: *6* << Make a new vnode, linked to the parent >>
                    v = new VNode(c, gnx);
                    gnx2vnode[gnx!] = v;
                    parent_v.children.push(v);
                    v.parents.push(parent_v);
                    const body = g.toUnicode(gnx2body[gnx!] || '');
                    // assert isinstance(body, str), body.__class__.__name__
                    console.assert((typeof body) === 'string', (typeof body));
                    v._bodyString = body;
                    v._headString = 'PLACE HOLDER';
                    //@-<< Make a new vnode, linked to the parent >>
                    //@+<< handle all other v attributes >>
                    //@+node:felix.20211213223342.14: *6* << handle all other v attributes >>
                    // FastRead.nativeVnodeAttributes defines the native attributes of <v> elements.
                    const d: { [key: string]: any } = e.attrib;
                    let s: string = d['descendentTnodeUnknownAttributes'];
                    let aDict: any;
                    if (s) {
                        aDict = fc.getDescendentUnknownAttributes(s, v);
                        if (aDict) {
                            fc.descendentTnodeUaDictList.push(aDict);
                        }
                    }
                    s = d['descendentVnodeUnknownAttributes'];
                    if (s) {
                        aDict = fc.getDescendentUnknownAttributes(s, v);
                        if (aDict) {
                            // TODO : VERIFY / COMPARE / ASK EDWARD !!
                            fc.descendentVnodeUaDictList.push([v, aDict]);
                        }
                    }
                    //
                    // Handle vnode uA's
                    const uaDict: any = gnx2ua[gnx!]; // A defaultdict(dict)

                    //for key, val in d.items():
                    for (let [key, val] of Object.entries(d)) {

                        if (!this.nativeVnodeAttributes.includes(key)) {
                            uaDict[key] = this.resolveUa(key, val);
                        }
                    }
                    if (uaDict) {
                        v.unknownAttributes = uaDict;
                    }
                    //@-<< handle all other v attributes >>
                    // Handle all inner elements.
                    v_element_visitor(e.getchildren(), v);
                }
            }
        };
        //@-<< define v_element_visitor >>

        //
        // Create the hidden root vnode.

        const gnx: string = 'hidden-root-vnode-gnx';
        const hidden_v: VNode = new VNode(c, gnx);
        hidden_v._headString = '<hidden root vnode>';
        gnx2vnode[gnx] = hidden_v;
        //
        // Traverse the tree of v elements.
        v_element_visitor(v_elements, hidden_v);
        return hidden_v;
    }
    //@+node:felix.20230322233904.1: *3* fast.readFileFromJsonClipboard
    /**
     * Recreate a file from a JSON string s, and return its hidden vnode.
     */
    public readFileFromJsonClipboard(s: string): VNode | undefined {
        let v, unused;
        [v, unused] = this.readWithJsonTree(undefined, s);
        if (!v) {  // #1510.
            return undefined;
        }
        //
        // #1111: ensure that all outlines have at least one node.
        if (!v.children || !v.children.length) {
            const new_vnode = new VNode(this.c);
            new_vnode.h = 'newHeadline';
            v.children = [new_vnode];
        }
        return v;
    }
    //@+node:felix.20230322233910.1: *3* fast.readWithJsonTree & helpers
    public readWithJsonTree(path: string | undefined, s: string): [VNode | undefined, any] {
        let d: any;
        try {
            d = JSON.parse(s);
        } catch (exception) {
            g.trace(`Error converting JSON from .leojs file: ${path}`);
            g.es_exception();
            return [undefined, undefined];
        }
        let g_element: { [key: string]: any };
        let hidden_v: VNode | undefined;
        try {
            g_element = d['globals'] || {};  // globals is optional
            const v_elements = d['vnodes'];
            const t_elements = d['tnodes'];
            const gnx2ua: { [key: string]: any } = {};
            Object.assign(gnx2ua, d['uas'] || {}); // User attributes in their own dict for leojs files

            const gnx2body = this.scanJsonTnodes(t_elements);
            hidden_v = this.scanJsonVnodes(gnx2body, this.gnx2vnode, gnx2ua, v_elements);
            this.handleBits();
        }
        catch (exception) {
            g.trace(`Error .leojs JSON is not valid: ${path}`);
            g.es_exception(exception);
            return [undefined, undefined];
        }
        return [hidden_v, g_element];

    }
    //@+node:felix.20230322233910.2: *4* fast.scanJsonGlobals
    /**
     * Set the geometries from the globals dict.
     */
    public scanJsonGlobals(json_d: { [key: string]: any }): void {
        const c: Commands = this.c;
        const toInt = (x: number, d_val: number): number => {
            try {
                return Math.floor(x);
            } catch (exception) {
                return d_val
            }
        };
        // Priority 1: command-line args
        const windowSize = g.app.loadManager?.options['windowSize'];
        const windowSpot = g.app.loadManager?.options['windowSpot'];
        //
        // Priority 2: The cache.
        let db_top, db_left, db_height, db_width;
        [db_top, db_left, db_height, db_width] = c.db['window_position'] || [undefined, undefined, undefined, undefined];
        //
        // Priority 3: The globals dict in the .leojs file.
        //             Leo doesn't write the globals element, but leoInteg might.

        // height & width
        let height, width;
        [height, width] = windowSize || [undefined, undefined];
        if (height === undefined) {
            [height, width] = [json_d['height'], json_d['width']];
        }
        if (height === undefined) {
            [height, width] = [db_height, db_width];
        }
        [height, width] = [toInt(height, 500), toInt(width, 800)];
        //
        // top, left.
        let top, left;
        [top, left] = windowSpot || [undefined, undefined];
        if (top === undefined) {
            [top, left] = [json_d.get('top'), json_d.get('left')];
        }
        if (top === undefined) {
            [top, left] = [db_top, db_left];
        }
        [top, left] = [toInt(top, 50), toInt(left, 50)];
        //
        // r1, r2.
        const r1 = Number(c.db['body_outline_ratio'] || '0.5');
        const r2 = Number(c.db['body_secondary_ratio'] || '0.5');
        if (g.app.debug.includes('size')) {
            g.trace(width, height, left, top, c.shortFileName());
        }
        // c.frame may be a NullFrame.
        // ? NOT NEEDED ?
        // c.frame.setTopGeometry(width, height, left, top);
        // ? NOT NEEDED ?
        // c.frame.resizePanesToRatio(r1, r2);
        const frameFactory: any = undefined; // getattr(g.app.gui, 'frameFactory', undefined);
        if (!frameFactory) {
            return;
        }
        // ? NOT NEEDED ?
        // console.assert(frameFactory !== undefined);
        // const mf = frameFactory.masterFrame;
        // if (g.app.start_minimized){
        //     mf.showMinimized();
        // }else if (g.app.start_maximized){
        //     // #1189: fast.scanGlobals calls showMaximized later.
        //     mf.showMaximized();
        // }else if (g.app.start_fullscreen){
        //     mf.showFullScreen();
        // }else{
        //     mf.show();
        // }
    }
    //@+node:felix.20230322233910.3: *4* fast.scanJsonTnodes
    public scanJsonTnodes(t_elements: any): { [key: string]: string } {

        const gnx2body: { [key: string]: string } = {};

        for (const [gnx, body] of Object.entries(t_elements)) {
            gnx2body[gnx] = body as string || '';
        }
        return gnx2body;

    }
    //@+node:felix.20230322233910.4: *4* scanJsonVnodes & helper
    public scanJsonVnodes(
        gnx2body: { [key: string]: string },
        gnx2vnode: { [key: string]: VNode },
        gnx2ua: { [key: string]: any },
        v_elements: any[],
    ): VNode | undefined {

        const c = this.c;
        const fc = this.c.fileCommands;

        /**
         * Visit the given element, creating or updating the parent vnode.
         */
        const v_element_visitor = (parent_e: any[], parent_v: VNode): void => {

            for (const [i, v_dict] of parent_e.entries()) {
                // Get the gnx.
                let gnx: string | undefined = v_dict['gnx'];
                if (!gnx) {
                    g.trace("Bad .leojs file: no gnx in v_dict");
                    g.printObj(v_dict);
                    return;
                }
                //
                // Create the vnode.
                console.assert(parent_v.children.length === i);

                let v: VNode | undefined;
                try {
                    v = gnx2vnode[gnx];
                } catch (keyError) {
                    // g.trace('no "t" attrib')
                    gnx = undefined;
                    v = undefined;
                }
                if (v) {
                    // A clone
                    parent_v.children.push(v);
                    v.parents.push(parent_v);
                    // The body overrides any previous body text.
                    const body = g.toUnicode(gnx2body[gnx!] || '');
                    console.assert(typeof body === 'string' || body as any instanceof String, typeof body);
                    v._bodyString = body;
                } else {
                    v = new VNode(c, gnx);
                    gnx2vnode[gnx!] = v;
                    parent_v.children.push(v);
                    v.parents.push(parent_v);

                    v._headString = v_dict['vh'] || '';
                    v._bodyString = gnx2body[gnx!] || '';
                    v.statusBits = v_dict['status'] || 0;  // Needed ?
                    if (v.isExpanded()) {
                        fc.descendentExpandedList.push(gnx!);
                    }
                    if (v.isMarked()) {
                        fc.descendentMarksList.push(gnx!);
                    }
                    //

                    // Handle vnode uA's
                    const uaDict = gnx2ua[gnx!];  // A defaultdict(dict)

                    if (uaDict && Object.keys(uaDict).length) {
                        v.unknownAttributes = uaDict;
                    }
                    // Recursively create the children.
                    v_element_visitor(v_dict['children'] || [], v);
                }
            }
        };
        const gnx = 'hidden-root-vnode-gnx';
        const hidden_v = new VNode(c, gnx);
        hidden_v._headString = '<hidden root vnode>';
        gnx2vnode[gnx] = hidden_v;
        //
        // Traverse the tree of v elements.
        v_element_visitor(v_elements, hidden_v);

        // add all possible UAs for external files loading process to add UA's.
        fc.descendentTnodeUaDictList.push(gnx2ua);
        return hidden_v;

    }
    //@-others

}
//@+node:felix.20210220190156.1: ** class FileCommands
export class FileCommands {

    public c: Commands;
    public frame: any;
    public nativeTnodeAttributes: string[];
    public nativeVnodeAttributes: string[];

    // Init ivars of the FileCommands class.
    // General...
    public mFileName: string = "";
    public fileDate: number = -1;
    public leo_file_encoding!: BufferEncoding;
    public tempfileNameCounter: number = 0;
    // For reading...
    public checking: boolean = false;  // True: checking only: do *not* alter the outline.
    public descendentExpandedList: string[] = [];  // List of gnx's.
    public descendentMarksList: string[] = [];  // List of gnx's.
    public descendentTnodeUaDictList: any[] = [];
    public descendentVnodeUaDictList: any[] = [];
    public ratio: number = 0.5;
    public currentVnode: VNode | undefined;
    // For writing...
    public read_only: boolean = false;
    public rootPosition: Position | undefined;
    public outputFile: any;
    public openDirectory: string | undefined;
    public usingClipboard: boolean = false;
    public currentPosition: Position | undefined;
    // New in 3.12...
    public copiedTree: Position | undefined;
    public gnxDict: { [key: string]: VNode } = {};
    public vnodesDict!: { [key: string]: boolean };
    // keys are gnx strings; values are booleans (ignored)

    //@+others
    //@+node:felix.20210220200109.1: *3* constructor
    constructor(c: Commands) {
        this.c = c;
        this.frame = c.frame;
        this.nativeTnodeAttributes = ['tx'];
        this.nativeVnodeAttributes = [
            'a',
            'descendentTnodeUnknownAttributes',
            'descendentVnodeUnknownAttributes',  // New in Leo 4.5.
            'expanded', 'marks', 't'
            // 'tnodeList',  // Removed in Leo 4.7.
        ];
        this.initIvars();
    }
    //@+node:felix.20211222234753.1: *3* fc.initIvars
    /**
     * Init ivars of the FileCommands class.
     */
    public initIvars(): void {

        // General...
        const c: Commands = this.c;
        this.mFileName = "";
        this.fileDate = -1;
        this.leo_file_encoding = c.config.new_leo_file_encoding as BufferEncoding;
        // For reading...
        this.checking = false;  // True: checking only: do *not* alter the outline.
        this.descendentExpandedList = [];
        this.descendentMarksList = [];
        this.descendentTnodeUaDictList = [];
        this.descendentVnodeUaDictList = [];
        this.ratio = 0.5;
        this.currentVnode = undefined;
        // For writing...
        this.read_only = false;
        this.rootPosition = undefined;
        this.outputFile = undefined;
        this.openDirectory = undefined;
        this.usingClipboard = false;
        this.currentPosition = undefined;
        // New in 3.12...
        this.copiedTree = undefined;
        this.gnxDict = {};

        // keys are gnx strings as returned by canonicalTnodeIndex.
        // Values are vnodes.
        // 2011/12/10: This dict is never re-inited.
        this.vnodesDict = {};
        // keys are gnx strings; values are ignored
    }
    //@+node:felix.20221011210046.1: *3* fc.saxutils.Escape
    /**
     * Escape '&', '<', and '>' in a string of data.
     * https://docs.python.org/3/library/xml.sax.utils.html#xml.sax.saxutils.escape
     */
    public saxutilsEscape(s: string): string {
        return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    //@+node:felix.20221011210921.1: *3* fc.saxutils.quoteattr
    /**
     * The quoteattr() function for embeding text into HTML/XML
     * Similar to escape(), but also prepares data to be used as an attribute value.
     * Examples below:
     * https://docs.python.org/3/library/xml.sax.utils.html#xml.sax.saxutils.quoteattr
     * https://stackoverflow.com/questions/7753448/how-do-i-escape-quotes-in-html-attribute-values
     */
    public quoteattr(s: string, preserveCR?: boolean | string): string {
        preserveCR = preserveCR ? '&#13;' : '\n';
        return ('' + s) /* Forces the conversion to string. */
            .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
            .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            /*
            You may add other replacements here for HTML only 
            (but it's not necessary).
            Or for XML, only if the named entities are defined in its DTD.
            */
            .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
            .replace(/[\r\n]/g, preserveCR);
        ;
    }

    //@+node:felix.20211212222746.1: *3*  commands (leoFileCommands.py)
    //@+node:felix.20211212222746.2: *4* dump-clone-parents
    @cmd(
        'dump-clone-parents',
        'Print the parent vnodes of all cloned vnodes.'
    )
    public dump_clone_parents(this: Commands): void {
        // ! Not used outside of being a command

        // TODO TEST THIS
        // c = event.get('c')

        // const c: Commands = this.c;
        //
        // or
        const c: Commands = this;

        if (!c) {
            return;
        }

        console.log('dump-clone-parents...');

        const d = c.fileCommands.gnxDict;

        for (let gnx in d) {
            const v: VNode = d[gnx];
            if (v.parents.length > 1) {
                console.log(v.h);
                g.printObj(v.parents);
            }
        }
    }
    //@+node:felix.20211212222746.3: *4* dump-gnx-dict
    @cmd(
        'dump-gnx-dict',
        'Dump c.fileCommands.gnxDict.'
    )
    public dump_gnx_dict(this: Commands): void {
        // ! Not used outside of being a command

        // TODO TEST THIS
        // c = event.get('c')

        // const c: Commands = this.c;
        //
        // or
        const c: Commands = this;

        // TODO TEST THIS!
        if (!c) {
            return;
        }

        const d: any = c.fileCommands.gnxDict;

        g.printObj(d, 'gnxDict');
    }
    //@+node:felix.20211213224222.1: *3* fc: Commands
    //@+node:felix.20211213224222.2: *4* writeAtFileNodes
    @cmd(
        'write-at-file-nodes',
        'Write all @file nodes in the selected outline.'
    )
    public async writeAtFileNodes(): Promise<unknown> {
        const c: Commands = this.c;
        c.endEditing();
        c.init_error_dialogs();
        await c.atFileCommands.writeAll(true);
        return c.raise_error_dialogs('write');
    }
    //@+node:felix.20211213224222.4: *4* writeDirtyAtFileNodes
    @cmd(
        'write-dirty-at-file-nodes',
        'Write all changed @file Nodes.'
    )
    public async writeDirtyAtFileNodes(): Promise<unknown> {
        const c: Commands = this.c;
        c.endEditing();
        c.init_error_dialogs();
        await c.atFileCommands.writeAll(true);
        return c.raise_error_dialogs('write');
    }
    //@+node:felix.20211213224222.5: *4* writeMissingAtFileNodes
    @cmd(
        'write-missing-at-file-nodes',
        'Write all @file nodes for which the corresponding external file does not exist.'
    )
    public async writeMissingAtFileNodes(): Promise<unknown> {
        const c: Commands = this.c;
        c.endEditing();
        return c.atFileCommands.writeMissing(c.p);
    }
    //@+node:felix.20211213224222.3: *4* write-outline-only
    @cmd(
        'write-outline-only',
        'Write the entire outline without writing any derived files.')
    public async writeOutlineOnly(): Promise<unknown> {
        const c: Commands = this.c;
        c.endEditing();
        return this.writeOutline(this.mFileName);
    }
    //@+node:felix.20230406222218.1: *4* write-zip-archive
    /**
     * Write a .zip file containing this .leo file and all external files.
     *
     * Write to os.environ['LEO_ARCHIVE'] or the directory containing this .leo file.
     */
    @cmd(
        'write-zip-archive',
        ''
    )
    public async writeZipArchive(): Promise<unknown> {

        const c: Commands = this.c;
        const leo_file = c.fileName();
        if (!leo_file) {
            g.es('Please save this outline first');
            return;
        }
        // Compute the timestamp.

        // var date = new Date(unix_timestamp * 1000);
        // // Hours part from the timestamp
        // var hours = date.getHours();
        // // Minutes part from the timestamp
        // var minutes = "0" + date.getMinutes();
        // // Seconds part from the timestamp
        // var seconds = "0" + date.getSeconds();


        const timestamp = new Date().getTime(); // datetime.now().timestamp();
        const time = new Date(timestamp);
        const time_s = time.format('YYYY-MM-DD-hh-mm-ss');

        // Compute archive_name.
        let archive_name = '';
        // TODO
        // try{
        //     const directory = os.environ['LEO_ARCHIVE'];
        //     // todo this should be a uri 
        //     try {
        //         await vscode.workspace.fs.stat(directory);
        //         // OK exists

        //     } catch {
        //         // Does not exist !
        //         g.es_print(`Not found: ${directory}`);
        //         // TODO : TEST THIS WITH / WITHOUT ESCAPING SPECIAL CHARS
        //         archive_name = `${directory}${os.sep}${g.shortFileName(leo_file)}-${time_s}.zip`;
        //     }


        // }catch (keyError){
        //     // pass
        // }
        if (!archive_name) {
            archive_name = `${leo_file}-${time_s}.zip`;
        }
        // Write the archive.
        try {

            let n = 1;
            // TODO
            vscode.window.showInformationMessage("TODO : writeZipArchive for " + `${archive_name} containing ${n} file${g.plural(n)}`);

            // with (zipfile.ZipFile(archive_name, 'w') as f){
            //     f.write(leo_file);
            //     for (const p of c.all_unique_positions()){
            //         if (p.isAnyAtFileNode()){
            //             fn = c.fullPath(p);
            //             if (os.path.exists(fn)){
            //                 n += 1;
            //                 f.write(fn);
            //             }
            //         }
            //     }
            // }

            g.es(`Wrote ${archive_name} containing ${n} file${g.plural(n)}`);
        } catch (exception) {
            g.es_print(`Error writing ${archive_name}`);
            g.es_exception(exception);
        }
    }
    //@+node:felix.20211213224228.1: *3* fc: File Utils
    //@+node:felix.20211213224228.2: *4* fc.createBackupFile
    /**
     * Create a closed backup file and copy the file to it,
     * but only if the original file exists.
     */
    public async createBackupFile(fileName: string): Promise<[boolean, string | undefined]> {
        let ok: boolean = false;
        let backupName: string | undefined;

        const w_exists = await g.os_path_exists(fileName);

        if (w_exists) {
            const timestamp: number = new Date().getTime();
            backupName = fileName + "." + timestamp.toString(32) + (this.tempfileNameCounter++).toString(32) + ".tmp";

            let s: string;
            // const w_readUri = vscode.Uri.file(fileName);
            const w_readUri = g.makeVscodeUri(fileName);
            const readData = await vscode.workspace.fs.readFile(w_readUri);
            // s = Buffer.from(readData).toString('utf8'); // * No need to convert if already Uint8Array

            try {
                // const w_writeUri = vscode.Uri.file(backupName);
                const w_writeUri = g.makeVscodeUri(backupName);

                // const writeData = Buffer.from(s, 'utf8'); // * No need to convert if already Uint8Array
                await vscode.workspace.fs.writeFile(w_writeUri, readData);
                ok = true;
            }
            catch (exception) {
                g.error('exception creating backup file');
                g.es_exception(exception);
                ok = false;
                backupName = undefined;
            }
            if (!ok && this.read_only) {
                g.error("read only");
            }

        } else {
            ok = true;
            backupName = undefined;
        }
        return [ok, backupName];

    }
    //@+node:felix.20211213224228.3: *4* fc.deleteBackupFile
    public async deleteBackupFile(fileName: string): Promise<void> {
        // const w_uri = vscode.Uri.file(fileName);
        const w_uri = g.makeVscodeUri(fileName);
        try {
            await vscode.workspace.fs.delete(w_uri, { useTrash: false });

            console.log('Did Delete : ', fileName);
        }
        catch (exception) {
            if (this.read_only) {
                g.error("read only");
            }
            g.error("exception deleting backup file:", fileName);
            g.es_exception(exception);
        }
    }
    //@+node:felix.20211213224228.4: *4* fc.handleWriteLeoFileException
    /**
     * Report an exception. f is an open file, or None.
     */
    public async handleWriteLeoFileException(fileName: string, backupName: string): Promise<void> {
        g.es("exception writing:", fileName);
        g.es_exception();

        // Delete fileName.
        const w_fileExists = await g.os_path_exists(fileName);
        if (fileName && w_fileExists) {
            await this.deleteBackupFile(fileName);
        }
        // Rename backupName to fileName.
        const w_backupExists = await g.os_path_exists(backupName);
        if (backupName && w_backupExists) {
            g.es("restoring", fileName, "from", backupName);
            // No need to create directories when restoring.
            let src: string;
            let dst: string;
            [src, dst] = [backupName, fileName];
            try {
                // const w_srcUri = vscode.Uri.file(src);
                const w_srcUri = g.makeVscodeUri(src);
                // const w_dstUri = vscode.Uri.file(dst);
                const w_dstUri = g.makeVscodeUri(dst);
                await vscode.workspace.fs.rename(w_srcUri, w_dstUri, { overwrite: true });
            }
            catch (exception) {
                g.error('exception renaming', src, 'to', dst);
                g.es_exception(exception);
            }
        } else {
            g.error('backup file does not exist!', backupName);
        }
    }
    //@+node:felix.20211213224228.5: *4* fc.isReadOnly
    public async isReadOnly(fileName: string): Promise<boolean> {
        // self.read_only is not valid for Save As and Save To commands.
        const w_exists = await g.os_path_exists(fileName);
        if (w_exists) {
            // const w_uri = vscode.Uri.file(fileName);
            const w_uri = g.makeVscodeUri(fileName);

            const fileStat = await vscode.workspace.fs.stat(w_uri);

            if (fileStat.permissions && (fileStat.permissions & 1)) {
                g.error("can not write: read only:", fileName);
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211213224228.7: *4* fc.setDefaultDirectoryForNewFiles
    /**
     * Set c.openDirectory for new files for the benefit of leoAtFile.scanAllDirectives.
     */
    public async setDefaultDirectoryForNewFiles(fileName: string): Promise<void> {
        const c: Commands = this.c;
        if (!c.openDirectory) {
            let theDir: string;
            theDir = g.os_path_dirname(fileName);
            const w_dirExists = await g.os_path_exists(theDir);
            if (theDir && g.os_path_isabs(theDir) && w_dirExists) {
                c.openDirectory = theDir;
                c.frame.openDirectory = theDir;
            }
            return Promise.resolve();
        }
        return Promise.resolve();
    }
    //@+node:felix.20211213224228.8: *4* fc.warnOnReadOnlyFiles
    public async warnOnReadOnlyFiles(fileName: string): Promise<boolean> {

        try {

            // const w_uri = vscode.Uri.file(fileName);
            const w_uri = g.makeVscodeUri(fileName);

            const fileStat = await vscode.workspace.fs.stat(w_uri);

            if (fileStat.permissions && (fileStat.permissions & 1)) {
                g.error("can not write: read only:", fileName);
                this.read_only = true;
            } else {
                this.read_only = false;
            }

        }
        catch (exception) {
            // File does not exist
            this.read_only = false;
        }
        if (this.read_only && !g.unitTesting) {
            g.error("read only:", fileName);
        }
        return this.read_only;
    }
    //@+node:felix.20211213224232.1: *3* fc: Reading
    //@+node:felix.20211213224232.2: *4* fc: Paste
    //@+node:felix.20211213224232.3: *5* fc.checkPaste
    /**
     * Return True if p may be pasted as a child of parent.
     */
    public checkPaste(parent: Position, p: Position): boolean {
        if (!parent || !parent.__bool__()) {
            return true;
        }
        const parents: Position[] = [...parent.self_and_parents()];
        for (let p_p of p.self_and_subtree(false)) {
            for (let z of parents) {
                if (p_p.v === z.v) {
                    g.warning('Invalid paste: nodes may not descend from themselves');
                    return false;
                }
            }
        }
        return true;
    }
    //@+node:felix.20211213224232.4: *5* fc.getLeoOutlineFromClipBoard
    /**
     * Read a Leo outline from string s in clipboard format.
     */
    public getLeoOutlineFromClipboard(s: string): Position | undefined {

        const c: Commands = this.c;
        const current: Position = c.p;
        if (!current || !current.__bool__()) {
            g.trace('no c.p');
            return undefined;
        }

        this.initReadIvars();
        // Save the hidden root's children.
        const old_children = c.hiddenRootNode.children;
        // Save and clear gnxDict.
        const oldGnxDict = this.gnxDict;
        this.gnxDict = {};
        let hidden_v;
        if (s.trimStart().startsWith("{")) {
            // Maybe JSON
            hidden_v = new FastRead(c, this.gnxDict).readFileFromJsonClipboard(s);
        } else {
            // This encoding must match the encoding used in outline_to_clipboard_string.
            const s_bytes = g.toEncodedString(s, this.leo_file_encoding, true);
            hidden_v = new FastRead(c, this.gnxDict).readFileFromClipboard(s_bytes);
        }

        const v = hidden_v!.children[0];
        v.parents = [];
        // Restore the hidden root's children
        c.hiddenRootNode.children = old_children;
        if (!v) {
            g.es("the clipboard is not valid");
            return undefined;
        }
        // Create the position.
        const p: Position = new Position(v);
        // Do *not* adjust links when linking v.
        if (current.hasChildren() && current.isExpanded()) {
            p._linkCopiedAsNthChild(current, 0);
        } else {
            p._linkCopiedAfter(current);
        }

        // console.assert(!p.isCloned(), g.objToString(p.v.parents));
        // console.log('result: ', p.v.parents);
        console.assert(!p.isCloned(), "parents length " + p.v.parents.length);

        this.gnxDict = oldGnxDict;
        this.reassignAllIndices(p);
        c.selectPosition(p);
        this.initReadIvars();
        return p;
    }

    // TODO ?
    // getLeoOutline = getLeoOutlineFromClipboard  // for compatibility

    //@+node:felix.20211213224232.5: *5* fc.getLeoOutlineFromClipBoardRetainingClones
    /**
     * Read a Leo outline from string s in clipboard format.
     */
    public getLeoOutlineFromClipboardRetainingClones(s: string): Position | undefined {

        const c: Commands = this.c;
        const current: Position = c.p;
        if (!current || !current.__bool__()) {
            g.trace('no c.p');
            return undefined;
        }

        this.initReadIvars();
        // Save the hidden root's children.
        const old_children: VNode[] = c.hiddenRootNode.children;
        // All pasted nodes should already have unique gnx's.
        const ni = g.app.nodeIndices!;
        for (let v of c.all_unique_nodes()) {
            ni.check_gnx(c, v.fileIndex, v);
        }

        let hidden_v;
        let s_bytes;
        if (s.trimStart().startsWith("{")) {
            // Maybe JSON
            hidden_v = new FastRead(c, this.gnxDict).readFileFromJsonClipboard(s);
        } else {
            // This encoding must match the encoding used in outline_to_clipboard_string.
            s_bytes = g.toEncodedString(s, this.leo_file_encoding, true);
            hidden_v = new FastRead(c, this.gnxDict).readFileFromClipboard(s_bytes);
        }

        const v = hidden_v!.children[0];

        // v.parents.remove(hidden_v);
        if (hidden_v) {
            const i_hidden_v = v.parents.indexOf(hidden_v);
            if (i_hidden_v > -1) {
                v.parents.splice(i_hidden_v, 1);
            }
        }

        // Restore the hidden root's children
        c.hiddenRootNode.children = old_children;
        if (!v) {
            g.es("the clipboard is not valid ");
            return undefined;
        }

        // Create the position.
        const p: Position = new Position(v);
        // Do *not* adjust links when linking v.
        if (current.hasChildren() && current.isExpanded()) {
            if (!this.checkPaste(current, p)) {
                return undefined;
            }
            p._linkCopiedAsNthChild(current, 0);
        } else {
            if (!this.checkPaste(current.parent(), p)) {
                return undefined;
            }
            p._linkCopiedAfter(current);
        }

        // Fix #862: paste-retaining-clones can corrupt the outline.
        this.linkChildrenToParents(p);
        c.selectPosition(p);
        this.initReadIvars();
        return p;
    }
    //@+node:felix.20211213224232.6: *5* fc.linkChildrenToParents
    /**
     * Populate the parent links in all children of p.
     */
    public linkChildrenToParents(p: Position): void {
        for (let child of p.children()) {
            if (!child.v.parents.length) {
                child.v.parents.push(p.v);
            }
            this.linkChildrenToParents(child);
        }
    }
    //@+node:felix.20211213224232.7: *5* fc.reassignAllIndices
    /**
     * Reassign all indices in p's subtree.
     */
    public reassignAllIndices(p: Position): void {
        const ni = g.app.nodeIndices!;
        for (let p2 of p.self_and_subtree(false)) {
            const v: VNode = p2.v;
            const index: string = ni.getNewIndex(v);
            if (g.app.debug.includes('gnx')) {
                g.trace('**reassigning**', index, v);
            }
        }
    }
    //@+node:felix.20211213224232.8: *4* fc: Read Top-level
    //@+node:felix.20211213224232.9: *5* fc.getLeoFile (read switch)
    /**
     * Read a .leo file.
     * The caller should follow this with a call to c.redraw().
     */
    public async getLeoFile(
        fileName: string,
        readAtFileNodesFlag: boolean = true,
        silent: boolean = false,
        checkOpenFiles: boolean = true,
    ): Promise<[VNode, number]> {

        const fc: FileCommands = this;
        const c: Commands = this.c;

        const t1: [number, number] = process.hrtime();

        c.clearChanged(); // May be set when reading @file nodes.
        await fc.warnOnReadOnlyFiles(fileName);
        fc.checking = false;
        fc.mFileName = c.mFileName;
        fc.initReadIvars();
        let recoveryNode: Position | undefined = undefined;

        let v: VNode | undefined;

        try {
            c.loading = true;  // disable c.changed
            if (!silent && checkOpenFiles) {
                // Don't check for open file when reverting.
                g.app.checkForOpenFile(c, fileName);
            }

            // Read the .leo file and create the outline.
            if (fileName.endsWith('.db')) {
                v = await fc.retrieveVnodesFromDb(fileName);
                if (!v) {
                    v = await fc.initNewDb(fileName);
                }
            } else if (fileName.endsWith('.leojs')) {
                v = await new FastRead(c, this.gnxDict).readJsonFile(fileName);
                if (v) {
                    c.hiddenRootNode = v;
                }
            } else {
                const w_fastRead: FastRead = new FastRead(c, this.gnxDict);
                v = await w_fastRead.readFile(fileName);
                if (v) {
                    c.hiddenRootNode = v;
                }
            }
            if (v) {
                c.setFileTimeStamp(fileName);
                if (readAtFileNodesFlag) {
                    recoveryNode = await fc.readExternalFiles(fileName);
                }
            }
        }

        finally {
            // lastTopLevel is a better fallback, imo.
            const p = recoveryNode || c.p || c.lastTopLevel();
            c.selectPosition(p);
            // Delay the second redraw until idle time.
            // This causes a slight flash, but corrects a hangnail.
            c.redraw_later();
            c.checkOutline(); // Must be called *after* ni.end_holding.
            c.loading = false; // reenable c.changed
            // if (!isinstance(theFile, sqlite3.Connection)){
            // ! Not Needed with vscode.workspace.fs
            // if ((typeof theFile) === 'number') {
            //     fs.closeSync(theFile);

            //     // Fix bug https://bugs.launchpad.net/leo-editor/+bug/1208942
            //     // Leo holding directory/file handles after file close?
            // }
        }

        if (c.changed) {
            fc.propagateDirtyNodes();
        }

        fc.initReadIvars();
        const t2Hrtime: [number, number] = process.hrtime(t1); // difference from t1
        const t2 = (t2Hrtime[0] * 1000 + t2Hrtime[1] / 1000000); // in ms

        g.es(`read outline in ${(t2 / 1000).toFixed(2)} seconds`);

        // return [v, c.frame.ratio];
        // TODO : Eliminate frame and/or ratio
        return [v!, 0.5];
    }
    //@+node:felix.20211213224232.10: *5* fc.openLeoFile
    /**
     * Open a Leo file.
     *
     * readAtFileNodesFlag: False when reading settings files.
     * silent:              True when creating hidden commanders.
     */
    public async openLeoFile(
        fileName: string,
        readAtFileNodesFlag: boolean = true,
        silent: boolean = false
    ): Promise<VNode | undefined> {

        const c: Commands = this.c;
        const frame = this.c.frame;

        // Set c.openDirectory
        const theDir: string = g.os_path_dirname(fileName);

        if (theDir) {
            c.openDirectory = theDir;
            c.frame.openDirectory = theDir;
        }
        // Get the file.
        this.gnxDict = {};  // #1437

        // [VNode, number]
        let v: VNode;
        let ratio: number;
        [v, ratio] = await this.getLeoFile(
            fileName,
            readAtFileNodesFlag,
            silent
        );

        // TODO : Eliminate Ratio concepts for leojs
        // if (v) {
        //     frame.resizePanesToRatio(ratio, frame.secondary_ratio);
        // }

        return v;
    }
    //@+node:felix.20211213224232.12: *5* fc.readExternalFiles & helper
    /**
     * Read all external files.
     *
     * A helper for fc.getLeoFile.
     */
    public async readExternalFiles(fileName: string): Promise<Position | undefined> {
        const c: Commands = this.c;
        const fc: FileCommands = this;

        await c.atFileCommands.readAll(c.rootPosition()!);
        const recoveryNode: Position | undefined = fc.handleNodeConflicts();

        // Do this after reading external files.
        // The descendent nodes won't exist unless we have read;
        // the @thin nodes!
        fc.restoreDescendentAttributes();
        fc.setPositionsFromVnodes();
        return recoveryNode;
    }
    //@+node:felix.20211213224232.13: *6* fc.handleNodeConflicts
    /**
     * Create a 'Recovered Nodes' node for each entry in c.nodeConflictList.
     */
    public handleNodeConflicts(): Position | undefined {

        const c: Commands = this.c;

        if (!c.nodeConflictList.length) {
            return undefined;
        }

        if (!c.make_node_conflicts_node) {
            const s: string = `suppressed ${c.nodeConflictList.length} node conflicts`;
            // g.es(s, 'red');
            g.es(s);
            g.pr('\n' + s + '\n');
            return undefined;
        }

        // Create the 'Recovered Nodes' node.
        const last: Position = c.lastTopLevel();
        const root: Position = last.insertAfter();
        root.setHeadString('Recovered Nodes');
        root.expand();

        // For each conflict, create one child and two grandchildren.
        for (let bunch of c.nodeConflictList) {
            const tag: string = bunch['tag'] || '';
            const gnx: string = bunch['gnx'] || '';
            const fn: string = bunch['fileName'] || '';
            const b1: string = bunch['b_old'];
            const h1: string = bunch['h_old'];
            const b2: string = bunch['b_new'];
            const h2: string = bunch['h_new'];
            const root_v: string = bunch['root_v'] || '';
            const child: Position = root.insertAsLastChild();
            const h: string = `Recovered node "${h1}" from ${g.shortFileName(fn)}`;
            child.setHeadString(h);
            let lines: string[];
            if (b1 === b2) {
                lines = [
                    'Headline changed...',
                    `${tag} gnx: ${gnx} root: ${(root_v && root.v)}`,
                    `old headline: ${h1}`,
                    `new headline: ${h2}`,
                ];
                child.setBodyString(lines.join('\n'));
            } else {
                const line1: string = `${tag} gnx: ${gnx} root: ${root_v && root.v}\nDiff...\n`;
                const differ = new difflib.Differ();
                const d: string[] = differ.compare(g.splitLines(b1), g.splitLines(b2));
                // 2017/06/19: reverse comparison order.
                const diffLines: string[] = [...d];
                lines = [line1];
                lines.push(...diffLines);
                // There is less need to show trailing newlines because
                // we don't report changes involving only trailing newlines.
                child.setBodyString(lines.join(''));
                const n1: Position = child.insertAsNthChild(0);
                const n2: Position = child.insertAsNthChild(1);
                n1.setHeadString('old:' + h1);
                n1.setBodyString(b1);
                n2.setHeadString('new:' + h2);
                n2.setBodyString(b2);
            }
        }
        return root;
    }
    //@+node:felix.20211213224232.14: *5* fc.readOutlineOnly
    public async readOutlineOnly(fileName: string): Promise<VNode> {
        const c: Commands = this.c;
        // Set c.openDirectory
        const theDir: string = g.os_path_dirname(fileName);
        if (theDir) {
            c.openDirectory = theDir;
            // c.frame.openDirectory  =  theDir;
        }
        let v: VNode;
        let ratio: number;
        [v, ratio] = await this.getLeoFile(fileName, false);
        c.redraw();
        // c.frame.deiconify()
        // junk, junk, secondary_ratio = this.frame.initialRatios()
        // c.frame.resizePanesToRatio(ratio, secondary_ratio);
        return v;
    }
    //@+node:felix.20211213224232.15: *5* fc.retrieveVnodesFromDb & helpers
    /**
     * Recreates tree from the data contained in table vnodes.
     *
     * This method follows behavior of readSaxFile.
     */
    public async retrieveVnodesFromDb(conn: any): Promise<VNode | undefined> {

        const c: Commands = this.c;
        const fc: FileCommands = this;

        const sql: string = `select gnx, head,
             body,
             children,
             parents,
             iconVal,
             statusBits,
             ua from vnodes`;

        const vnodes: VNode[] = [];

        return undefined;
        // TODO
        /*
        try:
            for row in conn.execute(sql):
                (gnx, h, b, children, parents, iconVal, statusBits, ua) = row
                try:
                    ua = pickle.loads(g.toEncodedString(ua))
                except ValueError:
                    ua = None
                v = leoNodes.VNode(context=c, gnx=gnx)
                v._headString = h
                v._bodyString = b
                v.children = children.split()
                v.parents = parents.split()
                v.iconVal = iconVal
                v.statusBits = statusBits
                v.u = ua
                vnodes.append(v)
        except sqlite3.Error as er:
            if er.args[0].find('no such table') < 0:
                // there was an error raised but it is not the one we expect
                g.internalError(er)
            // there is no vnodes table
            return None

        rootChildren = [x for x in vnodes if 'hidden-root-vnode-gnx' in x.parents]
        if not rootChildren:
            g.trace('there should be at least one top level node!')
            return None

        def findNode(x: VNode) -> VNode:
            return fc.gnxDict.get(x, c.hiddenRootNode)  // type:ignore
        // let us replace every gnx with the corresponding vnode
        for v in vnodes:
            v.children = [findNode(x) for x in v.children]
            v.parents = [findNode(x) for x in v.parents]
        c.hiddenRootNode.children = rootChildren
        (w, h, x, y, r1, r2, encp) = fc.getWindowGeometryFromDb(conn)
        c.frame.setTopGeometry(w, h, x, y)
        c.frame.resizePanesToRatio(r1, r2)
        p = fc.decodePosition(encp)
        c.setCurrentPosition(p)
        return rootChildren[0]
        */
    }
    //@+node:felix.20211213224232.16: *6* fc.initNewDb
    /**
     * Initializes tables and returns None
     */
    public async initNewDb(conn: any): Promise<VNode> {
        const c: Commands = this.c;
        const fc: FileCommands = this;
        const v: VNode = new VNode(c);

        c.hiddenRootNode.children = [v];
        // (w, h, x, y, r1, r2, encp) = fc.getWindowGeometryFromDb(conn)
        //c.frame.setTopGeometry(w, h, x, y)
        //c.frame.resizePanesToRatio(r1, r2)
        c.sqlite_connection = conn;
        fc.exportToSqlite(c.mFileName);
        return v;
    }
    //@+node:felix.20211213224232.17: *6* fc.getWindowGeometryFromDb
    // ! unneeded
    // def getWindowGeometryFromDb(self, conn):
    //     geom = (600, 400, 50, 50, 0.5, 0.5, '')
    //     keys = ('width', 'height', 'left', 'top',
    //               'ratio', 'secondary_ratio',
    //               'current_position')
    //     try:
    //         d = dict(
    //             conn.execute(
    //                 '''select * from extra_infos
    //                 where name in (?, ?, ?, ?, ?, ?, ?)''',
    //                 keys,
    //             ).fetchall(),
    //         )
    //         // mypy complained that geom must be a tuple, not a generator.
    //         geom = tuple(d.get(*x) for x in zip(keys, geom))  // type:ignore
    //     except sqlite3.OperationalError:
    //         pass
    //     return geom
    //@+node:felix.20211213224232.18: *5* fc.setReferenceFile
    public setReferenceFile(fileName: string): void {
        const c: Commands = this.c;

        let found: boolean = false;
        for (let v of c.hiddenRootNode.children) {
            if (v.h === PRIVAREA) {
                v.b = fileName;
                found = true;
                break;
            }
        }
        if (!found) {
            const v: VNode = c.rootPosition()!.insertBefore().v;
            v.h = PRIVAREA;
            v.b = fileName;
            c.redraw();
        }

        g.es('set reference file:', g.shortFileName(fileName));
    }
    //@+node:felix.20211213224232.19: *5* fc.updateFromRefFile
    /**
     * Updates public part of outline from the specified file.
     */
    public async updateFromRefFile(): Promise<unknown> {
        const c: Commands = this.c;
        const fc: FileCommands = this;

        //@+others
        //@+node:felix.20211213224232.20: *6* function: get_ref_filename
        function get_ref_filename(): string | undefined {
            // ! This is what the code in original Leo's 'get_ref_filename' function does !
            for (let v of priv_vnodes()) {
                return g.splitLines(v.b)[0].trim();
            }
            // unused
            return undefined;
        }
        //@+node:felix.20211213224232.21: *6* function: pub_vnodes
        function* pub_vnodes(): Generator<VNode> {
            for (let v of c.hiddenRootNode.children) {
                if (v.h === PRIVAREA) {
                    break;
                }
                yield v;
            }
        }
        //@+node:felix.20211213224232.22: *6* function: priv_vnodes
        function* priv_vnodes(): Generator<VNode> {
            let pub: boolean = true;
            for (let v of c.hiddenRootNode.children) {
                if (v.h === PRIVAREA) {
                    pub = false;
                }
                if (pub) {
                    continue;
                }
                yield v;
            }
        }
        //@+node:felix.20211213224232.23: *6* function: pub_gnxes
        function* sub_gnxes(children: Iterable<VNode>): Generator<string> {
            for (let v of children) {
                yield v.gnx;
                for (let gnx of sub_gnxes(v.children)) {
                    yield gnx;
                }
            }
        }

        function pub_gnxes(): Iterable<string> {
            return sub_gnxes(pub_vnodes());
        }

        function priv_gnxes(): Iterable<string> {
            return sub_gnxes(priv_vnodes());
        }
        //@+node:felix.20211213224232.24: *6* function: restore_priv
        function restore_priv(prdata: DbRow[], topgnxes: string[]): void {
            const vnodes: VNode[] = [];
            for (let row of prdata) {
                const v: VNode = new VNode(c, row.gnx);
                v._headString = row.h;
                v._bodyString = row.b;
                v.children = row.children.map((gnx: string) => { return fc.gnxDict[gnx] || c.hiddenRootNode; });
                v.parents = row.parents.map((gnx: string) => { return fc.gnxDict[gnx] || c.hiddenRootNode; });
                v.iconVal = row.iconVal;
                v.statusBits = row.statusBits;
                v.u = row.u;
                vnodes.push(v);
            }

            // ! Note : This python code is already done in the loop above.
            // def pv(x: VNode) -> VNode:
            //     return fc.gnxDict.get(x, c.hiddenRootNode)  # type:ignore

            // for v in vnodes:
            //     v.children = [pv(x) for x in v.children]
            //     v.parents = [pv(x) for x in v.parents]

            for (let gnx of topgnxes) {
                const v: VNode = fc.gnxDict[gnx];
                c.hiddenRootNode.children.push(v);
                if (pubgnxes.includes(gnx)) {
                    v.parents.push(c.hiddenRootNode);
                }
            }

        }
        //@+node:felix.20211213224232.25: *6* function: priv_data
        function priv_data(gnxes: string[]): DbRow[] {

            const result: DbRow[] = [];
            for (let x of gnxes) {
                const v: VNode = fc.gnxDict[x];
                const dbrow: DbRow = {
                    gnx: v.gnx,
                    h: v.h,
                    b: v.b,
                    children: v.children.map(child => child.gnx),
                    parents: v.parents.map(child => child.gnx),
                    iconVal: v.iconVal,
                    statusBits: v.statusBits,
                    u: v.u
                };
                result.push(dbrow);
            }

            return result;
        }
        //@+node:felix.20211213224232.26: *6* function: nosqlite_commander
        const nosqlite_commander: any = {};

        // TODO
        // @contextmanager
        // def nosqlite_commander(fname):
        //     oldname = c.mFileName
        //     conn = getattr(c, 'sqlite_connection', None)
        //     c.sqlite_connection = None
        //     c.mFileName = fname
        //     yield c
        //     if c.sqlite_connection:
        //         c.sqlite_connection.close()
        //     c.mFileName = oldname
        //     c.sqlite_connection = conn
        //@-others

        const pubgnxes: string[] = [...pub_gnxes()];
        const privgnxes: string[] = [...priv_gnxes()];

        // diffnodes = privgnxes - pubgnxes
        const diffnodes: string[] = [];
        privgnxes.forEach(gnx => {
            if (!pubgnxes.includes(gnx)) {
                diffnodes.push(gnx);
            }
        });
        const privnodes = priv_data(diffnodes);
        const toppriv: string[] = [];
        for (let v of priv_vnodes()) {
            toppriv.push(v.gnx);
        }
        let fname = get_ref_filename();
        if (!fname) {
            return;
        }
        // with (nosqlite_commander(fname)){
        // ! Not Needed with vscode.workspace.fs
        // const theFile: number = fs.openSync(fname, 'rb');
        fc.initIvars();
        await fc.getLeoFile(fname, undefined, undefined, false);
        // }
        restore_priv(privnodes, toppriv);

        return c.redraw();
    }
    //@+node:felix.20211213224232.30: *4* fc: Read Utils
    // Methods common to both the sax and non-sax code.
    //@+node:felix.20211213224232.31: *5* fc.archivedPositionToPosition
    /**
     * Convert an archived position (a string) to a position.
     */
    public archivedPositionToPosition(s: string): Position | undefined {
        return this.c.archivedPositionToPosition(s);
    }
    //@+node:felix.20211213224232.33: *5* fc.getDescendentAttributes
    /**
     * s is a list of gnx's, separated by commas from a <v> or <t> element.
     * Parses s into a list.
     * This is used to record marked and expanded nodes.
     */
    public getDescendentAttributes(s: string): string[] {
        const gnxs: string[] = s.split(',');
        const result: string[] = [];
        for (let gnx of gnxs) {
            if (gnx.trim()) {
                result.push(gnx);
            }
        }
        return result;
    }
    //@+node:felix.20211213224232.34: *5* fc.getDescendentUnknownAttributes
    // Pre Leo 4.5 Only @thin vnodes had the descendentTnodeUnknownAttributes field.
    // New in Leo 4.5: @thin & @shadow vnodes have descendentVnodeUnknownAttributes field.

    /**
     * Unhexlify and unpickle t/v.descendentUnknownAttribute field.
     */
    public getDescendentUnknownAttributes(s: string, v?: VNode): any {
        let bin: string;
        let val: any;

        try {
            // Changed in version 3.2: Accept only bytestring or bytearray objects as input.
            const s_bytes = g.toEncodedString(s);  // 2011/02/22
            bin = binascii.unhexlify(s_bytes);
            // Throws a TypeError if val is not a hex string.
            val = pickle.loads(bin);
            return val;
        }
        catch (exception) {
            g.es_exception(exception);
            g.trace('Can not unpickle', (typeof s), v && v.h, exception);
            return undefined;
        }

    }
    //@+node:felix.20211213224232.35: *5* fc.getPos/VnodeFromClipboard
    /**
     * A utility called from init_tree_abbrev.
     */
    public getPosFromClipboard(s: string): Position {
        const v: VNode = this.getVnodeFromClipboard(s)!;
        return new Position(v);
    }

    /**
     * Called only from getPosFromClipboard.
     */
    public getVnodeFromClipboard(s: string): VNode | undefined {
        const c: Commands = this.c;
        this.initReadIvars();
        const oldGnxDict: { [key: string]: VNode } = this.gnxDict;
        this.gnxDict = {};  // Fix #943
        let v: VNode | undefined;
        try {
            // This encoding must match the encoding used in outline_to_clipboard_string.
            const s_bytes = g.toEncodedString(s, this.leo_file_encoding, true);
            v = new FastRead(c, {}).readFileFromClipboard(s_bytes);
            if (!v) {
                g.es("the clipboard is not valid");
                return undefined;
            }
        }
        finally {
            this.gnxDict = oldGnxDict;
        }
        return v;
    }
    //@+node:felix.20211213224232.36: *5* fc.initReadIvars
    public initReadIvars(): void {
        this.descendentTnodeUaDictList = [];
        this.descendentVnodeUaDictList = [];
        this.descendentExpandedList = [];
        this.descendentMarksList = [];
        // 2011/12/10: never re-init this dict.
        // self.gnxDict = {}
        this.c.nodeConflictList = [];  // 2010/01/05
        this.c.nodeConflictFileName = undefined;  // 2010/01/05
    }
    //@+node:felix.20211213224232.37: *5* fc.propagateDirtyNodes
    public propagateDirtyNodes(): void {
        const c: Commands = this.c;

        const aList: Position[] = [];
        //  [z for z in c.all_positions() if z.isDirty()];
        for (let z of c.all_positions()) {
            if (z.isDirty()) {
                aList.push(z);
            }
        }

        for (let p of aList) {
            p.setAllAncestorAtFileNodesDirty();
        }
    }
    //@+node:felix.20211213224232.38: *5* fc.resolveArchivedPosition
    /**
     * Return a VNode corresponding to the archived position relative to root node root_v.
     */
    public resolveArchivedPosition(archivedPosition: string, root_v: VNode): VNode | undefined {

        function oops(message: string): void {
            // Give an error only if no file errors have been seen.
            // g.trace(message);
        }

        let aList: number[];

        try {
            // aList = [int(z) for z in archivedPosition.split('.')]
            aList = archivedPosition.split('.').map((z) => {
                return parseInt(z);
            });
            aList.reverse();
        } catch (exception) {
            oops(`"${archivedPosition}"`);
            return undefined;
        }

        if (!aList || !aList.length) {
            oops('empty');
            return undefined;
        }

        let last_v: VNode = root_v;
        let n: number = aList.pop()!;
        if (n !== 0) {
            oops(`root index="${n}"`);
            return undefined;
        }

        let children: VNode[];
        while (aList.length) {
            n = aList.pop()!;
            children = last_v.children;
            if (n < children.length) {
                last_v = children[n];
            } else {
                oops(`bad index="${n}", children.length="${children.length}"`);
                return undefined;
            }
        }
        return last_v;
    }
    //@+node:felix.20211213224232.40: *5* fc.restoreDescendentAttributes
    /**
     * Called from fc.readExternalFiles.
     */
    public restoreDescendentAttributes(): void {

        const c: Commands = this.c;

        for (let resultDict of this.descendentTnodeUaDictList) {
            for (let gnx in resultDict) { // loop keys
                const v: VNode | undefined = this.gnxDict[gnx!];
                if (v) {
                    v.unknownAttributes = resultDict[gnx];
                    v._p_changed = true;
                }

            }
        }

        // New in Leo 4.5: keys are archivedPositions, values are attributes.
        for (let vnodeUaDict of this.descendentVnodeUaDictList) {
            let root_v: VNode;
            let resultDict;
            [root_v, resultDict] = vnodeUaDict;
            for (let key in resultDict) { // loop keys
                const v: VNode | undefined = this.resolveArchivedPosition(key, root_v);
                if (v) {
                    v.unknownAttributes = resultDict[key];
                    v._p_changed = true;
                }
            }
        }

        let expanded: { [key: string]: VNode } = {};
        let marks: { [key: string]: VNode } = {};

        for (let gnx of this.descendentExpandedList) {
            const v: VNode | undefined = this.gnxDict[gnx];
            if (v) {
                expanded[v.toString()] = v;
            }
        }

        for (let gnx of this.descendentMarksList) {
            const v: VNode | undefined = this.gnxDict[gnx];
            if (v) {
                marks[v.toString()] = v;
            }
        }

        if (marks.length || expanded.length) {
            for (let p of c.all_unique_positions()) {
                if (marks[p.v.toString()]) {
                    p.v.initMarkedBit();
                    // This was the problem: was p.setMark.
                    // There was a big performance bug in the mark hook in the Node Navigator plugin.
                }
                if (expanded[p.v.toString()]) {
                    p.expand();
                }
            }
        }
    }
    //@+node:felix.20211213224232.41: *5* fc.setPositionsFromVnodes
    public setPositionsFromVnodes(): void {

        const c: Commands = this.c;
        const root: Position = this.c.rootPosition()!;

        if (c.sqlite_connection) {
            // position is already selected
            return;
        }

        let current: Position | undefined;
        let str_pos: string | undefined;

        if (c.mFileName) {
            str_pos = c.db['current_position'];
        }

        if (str_pos === undefined) {
            const d: any = root.v.u;
            if (d) {
                str_pos = d['str_leo_pos'];
            }
        }

        if (str_pos !== undefined) {
            current = this.archivedPositionToPosition(str_pos);
        }

        c.setCurrentPosition(current || c.rootPosition()!);
    }
    //@+node:felix.20211213224237.1: *3* fc: Writing
    //@+node:felix.20211213224237.2: *4* fc: Writing save*
    //@+node:felix.20211213224237.3: *5* fc.save
    /**
     * fc.save: A helper for c.save.
     */
    public async save(fileName: string, silent?: boolean): Promise<boolean> {

        const c: Commands = this.c;
        const p: Position = c.p;

        // New in 4.2.  Return ok flag so shutdown logic knows if all went well.
        let ok: boolean | undefined = g.doHook("save1", { c: c, p: p, fileName: fileName });

        if (ok === undefined) {
            c.endEditing();  // Set the current headline text.
            await this.setDefaultDirectoryForNewFiles(fileName);


            if (g.app && g.app.commander_cacher && g.app.commander_cacher.save) {
                g.app.commander_cacher.save(c, fileName);
            }
            ok = c.checkFileTimeStamp(fileName);
            if (ok) {
                if (c.sqlite_connection) {
                    c.sqlite_connection.close();
                    c.sqlite_connection = undefined;
                }
                ok = await this.write_Leo_file(fileName);
            }
            if (ok) {
                if (!silent) {
                    this.putSavedMessage(fileName);
                }
                c.clearChanged();  // Clears all dirty bits.
                if (c.config.getBool('save-clears-undo-buffer')) {
                    g.es("clearing undo");
                    c.undoer.clearUndoState();
                }
            }
            c.redraw_after_icons_changed();
        }

        g.doHook("save2", { c: c, p: p, fileName: fileName });
        return !!ok;

    }
    //@+node:felix.20211213224237.4: *5* fc.save_ref & helpers
    /**
     * Saves reference outline file
     */
    public async save_ref(): Promise<boolean> {

        const c: Commands = this.c;
        const p: Position = c.p;
        const fc: FileCommands = this;

        let fileName: string;

        //@+others
        //@+node:felix.20211213224237.5: *6* function: put_v_elements
        /**
         * Puts all <v> elements in the order in which they appear in the outline.
         *
         * This is not the same as fc.put_v_elements!
         */
        function put_v_elements(): string | undefined {
            c.clearAllVisited();
            fc.put("<vnodes>\n");
            // Make only one copy for all calls.
            fc.currentPosition = c.p;
            fc.rootPosition = c.rootPosition();
            fc.vnodesDict = {};
            let ref_fname: string | undefined;
            for (let p of c.rootPosition()!.self_and_siblings(false)) {
                if (p.h === PRIVAREA) {
                    ref_fname = p.b.split('\n', 1)[0].trim();
                    break;
                }
                // An optimization: Write the next top-level node.
                fc.put_v_element(p, p.isAtIgnoreNode());
            }
            fc.put("</vnodes>\n");
            return ref_fname;
        }
        //@+node:felix.20211213224237.6: *6* function: getPublicLeoFile
        function getPublicLeoFile(): [string, string] {

            // TODO : outputFile : STRING or BUFFER or ???
            fc.outputFile = ""; // io.StringIO(); // TODO : new memory empty file.

            fc.putProlog();
            fc.putHeader();
            fc.putGlobals();
            fc.putPrefs();
            fc.putFindSettings();
            let fname: string = put_v_elements()!;

            // TODO: verify if needed
            put_t_elements();

            fc.putPostlog();
            //return [fname, fc.outputFile.getvalue()];
            return [fname, fc.outputFile]; // outputfile as string
        }
        //@+node:felix.20211228224127.1: *6* function: put_t_elements
        /**
         * Write all <t> elements except those for vnodes appearing in @file, @edit or @auto nodes.
         */
        function put_t_elements(): void {

            function should_suppress(p: Position): boolean {
                for (let z of p.self_and_parents()) {
                    if (z.isAtFileNode() || z.isAtEditNode() || z.isAtAutoNode()) {
                        return true;
                    }
                }
                return false;
            }

            fc.put("<tnodes>\n");

            const suppress: { [key: string]: boolean } = {}; // USE v.gnx instead of v as KEY
            for (let p of c.all_positions(false)) {
                if (should_suppress(p)) {
                    suppress[p.v.gnx] = true;
                }
            }

            const toBeWritten: { [key: string]: VNode } = {}; // USE v.gnx (fileIndex) as KEY
            for (let root of c.rootPosition()!.self_and_siblings()) {
                if (root.h === PRIVAREA) {
                    break;
                }
                for (let p of root.self_and_subtree()) {
                    //if p.v.gnx not in suppress and p.v not in toBeWritten:
                    if (!suppress[p.v.gnx] && !toBeWritten[p.v.gnx]) {
                        toBeWritten[p.v.fileIndex] = p.v;
                    }
                }
            }

            let gnxs: string[] = Object.keys(toBeWritten).sort();
            for (let gnx of gnxs) {
                const v: VNode = toBeWritten[gnx];
                fc.put_t_element(v);
            }

            fc.put("</tnodes>\n");

        }
        //@-others

        c.endEditing();

        let w_found = false;
        for (let v of c.hiddenRootNode.children) {
            if (v.h === PRIVAREA) {
                fileName = g.splitLines(v.b)[0].trim();
                w_found = true;
                break;
            }
        }
        if (!w_found) {
            fileName = c.mFileName;
        }


        // New in 4.2.  Return ok flag so shutdown logic knows if all went well.
        let ok = g.doHook("save1", { c: c, p: p, fileName: fileName! });

        let content: string;
        if (ok === undefined) {
            [fileName, content] = getPublicLeoFile();
            fileName = g.os_path_finalize_join(undefined, c.openDirectory, fileName);

            // const w_uri = vscode.Uri.file(fileName);
            const w_uri = g.makeVscodeUri(fileName);
            const writeData = Buffer.from(content, 'utf8');
            await vscode.workspace.fs.writeFile(w_uri, writeData);
            // fs.writeFileSync(fileName!, content);


            // * Equivalent to :
            //      with open(fileName, 'w', encoding="utf-8", newline='\n') as out:
            //          out.write(content)


            g.es('updated reference file:', g.shortFileName(fileName));

        }
        g.doHook("save2", { c: c, p: p, fileName: fileName! });

        return ok;
    }
    //@+node:felix.20211213224237.7: *5* fc.saveAs
    /**
     * fc.saveAs: A helper for c.saveAs.
     */
    public async saveAs(fileName: string): Promise<void> {

        const c: Commands = this.c;
        const p: Position = c.p;

        if (!g.doHook("save1", { c: c, p: p, fileName: fileName })) {
            c.endEditing();  // Set the current headline text.
            if (c.sqlite_connection) {
                c.sqlite_connection.close();
                c.sqlite_connection = undefined;
            }
            await this.setDefaultDirectoryForNewFiles(fileName);
            if (g.app && g.app.commander_cacher && g.app.commander_cacher.save) {
                g.app.commander_cacher.save(c, fileName);
            }
            // Disable path-changed messages in writeAllHelper.
            c.ignoreChangedPaths = true;
            try {
                const w_ok = await this.write_Leo_file(fileName);
                if (w_ok) {
                    c.clearChanged();  // Clears all dirty bits.
                    this.putSavedMessage(fileName);
                }
            }
            finally {
                c.ignoreChangedPaths = false;  // #1367.
            }
            c.redraw_after_icons_changed();
        }
        g.doHook("save2", { c: c, p: p, fileName: fileName });
    }
    //@+node:felix.20211213224237.8: *5* fc.saveTo
    /**
     * fc.saveTo: A helper for c.saveTo.
     */
    public async saveTo(fileName: string, silent: boolean = false): Promise<void> {

        const c: Commands = this.c;
        const p: Position = c.p;

        if (!g.doHook("save1", { c: c, p: p, fileName: fileName })) {
            c.endEditing();  // Set the current headline text.
            if (c.sqlite_connection && c.sqlite_connection.close) {
                c.sqlite_connection.close();
                c.sqlite_connection = undefined;
            }
            await this.setDefaultDirectoryForNewFiles(fileName);
            if (g.app && g.app.commander_cacher && g.app.commander_cacher.commit) {
                g.app.commander_cacher.commit();  // Commit, but don't save file name.
            }
            // Disable path-changed messages in writeAllHelper.
            c.ignoreChangedPaths = true;
            try {
                this.write_Leo_file(fileName);
            }
            finally {
                c.ignoreChangedPaths = false;
            }

            if (!silent) {
                this.putSavedMessage(fileName);
            }
            c.redraw_after_icons_changed();
        }
        g.doHook("save2", { c: c, p: p, fileName: fileName });
    }
    //@+node:felix.20211213224237.9: *4* fc: Writing top-level
    //@+node:felix.20211213224237.10: *5* fc.exportToSqlite & helpers
    /**
     * Dump all vnodes to sqlite database. Returns True on success.
     */
    public exportToSqlite(fileName: string): boolean {

        const c: Commands = this.c;
        const fc: FileCommands = this;

        if (c.sqlite_connection === undefined) {
            // ! TEMP
            // TODO ?
            // c.sqlite_connection = new sqlite3.Database(fileName);
        }
        const conn = c.sqlite_connection;

        // TODO : json stringify instead of pickle?
        // const dump_u(v) -> bytes:
        //     try:
        //         s = pickle.dumps(v.u, protocol=1)
        //     except pickle.PicklingError:
        //         s = b''  # 2021/06/25: fixed via mypy complaint.
        //         g.trace('unpickleable value', repr(v.u))
        //     return s

        // dbrow = lambda v: (
        //         v.gnx,
        //         v.h,
        //         v.b,
        //         ' '.join(x.gnx for x in v.children),
        //         ' '.join(x.gnx for x in v.parents),
        //         v.iconVal,
        //         v.statusBits,
        //         dump_u(v)
        //     )
        function dbrow(v: VNode): sqlDbRow {
            return [
                v.gnx,
                v.h,
                v.b,
                v.children.map(x => x.gnx).join(' '),
                v.parents.map(x => x.gnx).join(' '),
                v.iconVal,
                v.statusBits,
                v.u ? JSON.stringify(v.u) : ''
            ];
        }

        let ok: boolean = false;

        try {
            fc.prepareDbTables(conn);
            fc.exportDbVersion(conn);

            // fc.exportVnodesToSqlite(conn, (dbrow(v) for v in c.all_unique_nodes()))
            const w_dbRows: sqlDbRow[] = [];
            for (let v of c.all_unique_nodes()) {
                w_dbRows.push(dbrow(v));
            }
            fc.exportVnodesToSqlite(conn, w_dbRows);

            fc.exportGeomToSqlite(conn);
            fc.exportHashesToSqlite(conn);
            // conn.commit(); // TODO : uneeded?
            ok = true;
        }
        catch (e) {
            g.internalError(e);
        }
        return ok;

    }
    //@+node:felix.20211213224237.11: *6* fc.decodePosition
    /**
     * Creates position from its string representation encoded by fc.encodePosition.
     */
    public decodePosition(s: string): Position {

        const fc: FileCommands = this;

        if (!s) {
            return fc.c.rootPosition()!;
        }

        const sep: string = '<->';
        const comma: string = ',';

        // const w_stack1: [string, string][] = [x.split(comma) for x in s.split(sep)]
        const w_stack1: [string, string][] = s.split(sep).map(x => (x.split(comma) as [string, string]));

        // const stack: [VNode, number][] = [(fc.gnxDict[x], int(y)) for x, y in stack]
        const stack: [VNode, number][] = w_stack1.map(z => [fc.gnxDict[z[0]]!, parseInt(z[1])]);

        let v: VNode;
        let ci: any;

        [v, ci] = stack[stack.length - 1]; // last one

        const p: Position = new Position(v, ci, stack.slice(0, -1)); // all but last

        return p;
    }
    //@+node:felix.20211213224237.12: *6* fc.encodePosition
    /**
     * New schema for encoding current position hopefully simpler one.
     */
    public encodePosition(p: Position): string {

        const jn: string = '<->';
        const mk: string = '%s,%s';
        const res: string[] = [];

        // res =  [mk % (x.gnx, y) for x, y in p.stack]

        for (let x of p.stack) {
            res.push(x[0].gnx + "," + x[1].toString());
        }

        res.push(p.gnx + "," + p._childIndex.toString());

        return res.join(jn);
    }
    //@+node:felix.20211213224237.13: *6* fc.prepareDbTables
    public prepareDbTables(conn: any): void {
        conn.run('drop table if exists vnodes;');

        conn.run(
            `create table if not exists vnodes(
            gnx primary key,
            head,
            body,
            children,
            parents,
            iconVal,
            statusBits,
            ua); `
        );

        conn.run(
            `create table if not exists extra_infos(name primary key, value)`);

    }

    //@+node:felix.20211213224237.14: *6* fc.exportVnodesToSqlite
    public exportVnodesToSqlite(conn: any, rows: sqlDbRow[]): void {
        for (let row of rows) {
            conn.run(
                `insert into vnodes
                (gnx, head, body, children, parents,
                iconVal, statusBits, ua)
                values(?,?,?,?,?,?,?,?); `,
                row
            );
        }
    }
    //@+node:felix.20211213224237.15: *6* fc.exportGeomToSqlite
    public exportGeomToSqlite(conn: any): void {
        const c: Commands = this.c;

        // data = zip(
        //     (
        //         'width', 'height', 'left', 'top',
        //         'ratio', 'secondary_ratio',
        //         'current_position'
        //     ),

        //     c.frame.get_window_info() +
        //     (
        //         c.frame.ratio, c.frame.secondary_ratio,
        //         self.encodePosition(c.p)
        //     )

        // )

        const data = ['current_position', this.encodePosition(c.p)];

        conn.run('replace into extra_infos(name, value) values(?, ?)', data);
    }
    //@+node:felix.20211213224237.16: *6* fc.exportDbVersion
    public exportDbVersion(conn: any): void {
        conn.run(
            "replace into extra_infos(name, value) values('dbversion', ?)",
            ['1.0']
        );
    }
    //@+node:felix.20211213224237.17: *6* fc.exportHashesToSqlite
    public exportHashesToSqlite(conn: any): void {
        const c: Commands = this.c;


        // def md5(x):
        //     try:
        //         s = open(x, 'rb').read()
        //     except Exception:
        //         return ''
        //     s = s.replace(b'\r\n', b'\n')
        //     return hashlib.md5(s).hexdigest()

        const files: [string, string][] = [];

        const p: Position = c.rootPosition()!;

        while (p && p.__bool__()) {
            if (p.isAtIgnoreNode()) {
                p.moveToNodeAfterTree();
            } else if (p.isAtAutoNode() || p.isAtFileNode()) {
                const fn: string = c.getNodeFileName(p);
                files.push(['md5_' + p.gnx, md5(fn.split('\r\n').join('\n'))]);
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }


        for (let file of files) {
            conn.run(
                'replace into extra_infos(name, value) values(?,?)',
                file
            );
        }

        // conn.executemany(
        //     'replace into extra_infos(name, value) values(?,?)',
        //     map(lambda x: (x[1], md5(x[0])), files))

    }
    //@+node:felix.20211213224237.18: *5* fc.outline_to_clipboard_string
    public outline_to_clipboard_string(p?: Position): string | undefined {
        // Save
        const tua = this.descendentTnodeUaDictList;
        const vua = this.descendentVnodeUaDictList;
        const gnxDict = this.gnxDict;
        const vnodesDict = this.vnodesDict;
        let s: string;
        try {
            // TODO : USE BUFFER OR OTHER OBJECT ???
            this.usingClipboard = true;
            if (this.c.config.getBool('json-outline-clipboard', false)) {
                const d = this.leojs_outline_dict(p || this.c.p);
                s = JSON.stringify(d, null, 4);
            } else {
                this.outputFile = ""; // io.StringIO()
                this.putProlog();
                this.putHeader();
                this.put_v_elements(p || this.c.p);
                this.put_t_elements();
                this.putPostlog();
                // //s = this.outputFile.getvalue();
                s = this.outputFile as string; // Direct access as string
                this.outputFile = undefined;
            }
        } finally {
            // Restore
            this.descendentTnodeUaDictList = tua;
            this.descendentVnodeUaDictList = vua;
            this.gnxDict = gnxDict;
            this.vnodesDict = vnodesDict;
            this.usingClipboard = false;
        }
        return s;
    }
    //@+node:felix.20230402005913.1: *5* fc.outline_to_clipboard_json_string
    /**
     * Return a JSON string suitable for pasting to the clipboard.
     */
    public outline_to_clipboard_json_string(p?: Position): string {

        // Save
        const tua = this.descendentTnodeUaDictList;
        const vua = this.descendentVnodeUaDictList;
        const gnxDict = this.gnxDict;
        const vnodesDict = this.vnodesDict;
        let s: string;
        try {
            this.usingClipboard = true;
            const d = this.leojs_outline_dict(p || this.c.p);  // Checks for illegal ua's
            s = JSON.stringify(d, null, 4);
        } finally {  // Restore
            this.descendentTnodeUaDictList = tua;
            this.descendentVnodeUaDictList = vua;
            this.gnxDict = gnxDict;
            this.vnodesDict = vnodesDict;
            this.usingClipboard = false;
        }
        return s;

    }
    //@+node:felix.20211213224237.19: *5* fc.outline_to_xml_string
    /**
     * Write the outline in .leo (XML) format to a string.
     */
    public outline_to_xml_string(): string {

        // TODO : USE BUFFER OR OTHER OBJECT ???
        this.outputFile = ""; // io.StringIO()
        this.putProlog();
        this.putHeader();
        this.putGlobals();
        this.putPrefs();
        this.putFindSettings();
        this.put_v_elements();
        this.put_t_elements();
        this.putPostlog();
        const s: string = this.outputFile as string; // Direct access as string
        //const s: string = this.outputFile.getvalue();
        this.outputFile = undefined;
        return s;
    }
    //@+node:felix.20211213224237.20: *5* fc.write_Leo_file
    /**
     *  Write all external files and the.leo file itself.
     */
    public async write_Leo_file(fileName: string): Promise<boolean> {

        const c: Commands = this.c;
        const fc: FileCommands = this;

        if (c.checkOutline()) {
            g.error('Structural errors in outline! outline not written');
            return false;
        }

        // TODO : recentFilesManager !
        // g.app.recentFilesManager.writeRecentFilesFile(c);

        fc.writeAllAtFileNodes(); // Ignore any errors.
        return fc.writeOutline(fileName);

    }

    // TODO : Aliases
    // write_LEO_file = write_Leo_file  // For compatibility with old plugins.
    //@+node:felix.20211213224237.21: *5* fc.write_leojs & helpers
    /**
     * Write the outline in .leojs (JSON) format.
     */
    public async write_leojs(fileName: string): Promise<boolean> {

        const c: Commands = this.c;

        let ok: boolean;
        let backupName: string | undefined;
        [ok, backupName] = await this.createBackupFile(fileName);

        if (!ok) {
            return false;
        }

        /*
        try:
            f = open(fileName, 'wb')  # Must write bytes.
        except Exception:
            g.es(f"can not open {fileName}")
            g.es_exception()
            return False
        */

        try {
            // Create the dict corresponding to the JSON.
            const d = this.leojs_outline_dict();
            // Convert the dict to JSON.
            const json_s = JSON.stringify(d, null, 4); // json.dumps(d, indent = 2);

            const w_uri = g.makeVscodeUri(fileName);
            await vscode.workspace.fs.writeFile(w_uri, Buffer.from(json_s, this.leo_file_encoding));

            // f.close();
            // fs.closeSync(f);
            if (g.app && g.app.commander_cacher && g.app.commander_cacher.save) {
                g.app.commander_cacher.save(c, fileName);
            }

            c.setFileTimeStamp(fileName);
            // Delete backup file.
            const w_exists = await g.os_path_exists(backupName);
            if (backupName && w_exists) {
                await this.deleteBackupFile(backupName);
            }
            this.mFileName = fileName;
            return true;
        }
        catch (exception) {
            this.handleWriteLeoFileException(fileName, backupName!);
            return false;
        }
    }
    //@+node:felix.20211213224237.22: *6* fc.leojs_outline_dict
    /**
     * Return a dict representing the outline.
     */
    public leojs_outline_dict(p?: Position): { leoHeader: any, globals?: any, tnodes: any, vnodes: any[], uas?: any } {

        const c: Commands = this.c;

        const uas: { [key: string]: any } = {};
        // holds all gnx found so far, to exclude adding headlines of already defined gnx.
        const gnxSet: string[] = [];
        let result: { leoHeader: any, globals?: any, tnodes: any, vnodes: any[], uas?: any };
        if (this.usingClipboard) { // write the currently selected subtree ONLY.
            // Node to be root of tree to be put on clipboard
            const sp = p || c.p;  // Selected Position: sp
            // build uas dict
            for (const p of sp.self_and_subtree()) {
                // if (hasattr(p.v, 'unknownAttributes') && len(p.v.unknownAttributes.keys())) {
                if (p.v['unknownAttributes'] && Object.keys(p.v['unknownAttributes']).length) {
                    try {
                        JSON.stringify(p.v.unknownAttributes);  // If this test passes ok
                        uas[p.v.gnx] = p.v.unknownAttributes;  // Valid UA's as-is. UA's are NOT encoded.
                    } catch (typeError) {
                        g.trace(`Can not serialize uA for ${p.h}`, g.callers(6));
                        g.printObj(p.v.unknownAttributes);
                    }
                }
            }
            // result for specific starting p
            const w_tnodes: { [key: string]: string } = {};
            for (const p of sp.self_and_subtree()) {
                if (p.v._bodyString) {
                    w_tnodes[p.v.gnx] = p.v._bodyString;
                }
            }
            result = {
                'leoHeader': { 'fileFormat': 2 },
                'vnodes': [
                    this.leojs_vnode(sp, gnxSet)
                ],
                'tnodes': w_tnodes
            };

        } else {  // write everything from the top node 'c.rootPosition()'
            // build uas dict
            for (const v of c.all_unique_nodes()) {
                if (v['unknownAttributes'] && Object.keys(v['unknownAttributes']).length) {
                    try {
                        JSON.stringify(v.unknownAttributes);  // If this passes ok, ua's are valid json
                        uas[v.gnx] = v.unknownAttributes;  // Valid UA's as-is. UA's are NOT encoded.
                    } catch (typeError) {
                        g.trace(`Can not serialize uA for ${v.h}`, g.callers(6));
                        g.printObj(v.unknownAttributes);
                    }
                }
            }
            // result for whole outline
            const w_vnodes: VNodeJSON[] = [];
            for (const p of c.rootPosition()!.self_and_siblings()) {
                w_vnodes.push(this.leojs_vnode(p, gnxSet));
            }
            const w_tnodes: { [key: string]: string } = {};
            for (const v of c.all_unique_nodes()) {
                if (v._bodyString && v.isWriteBit()) {
                    w_tnodes[v.gnx] = v._bodyString;
                }
            }
            result = {
                'leoHeader': { 'fileFormat': 2 },
                'vnodes': w_vnodes,
                'tnodes': w_tnodes
            };

        }
        this.leojs_globals();  // Call only to set db like non-json save file.
        // uas could be empty. Only add it if needed
        if (uas && Object.keys(uas).length) {
            result["uas"] = uas;
        }
        if (!this.usingClipboard) {
            this.currentPosition = p || c.p;
            this.setCachedBits();
        }
        return result;

    }
    //@+node:felix.20211213224237.23: *6* fc.leojs_globals (sets window_position)
    /**
     * Put json representation of Leo's cached globals.
     */
    public leojs_globals(): any {

        const c: Commands = this.c;

        const d: any = {};
        //  [width, height, left, top] = c.frame.get_window_info()

        // TODO : No globals for now

        // if 1:  // Write to the cache, not the file.
        //     d: Dict[str, str] = {}
        //     c.db['body_outline_ratio'] = str(c.frame.ratio)
        //     c.db['body_secondary_ratio'] = str(c.frame.secondary_ratio)
        //     c.db['window_position'] = str(top), str(left), str(height), str(width)
        // if 'size' in g.app.debug:
        //     g.trace('set window_position:', c.db['window_position'], c.shortFileName())
        // else:
        //     d = {
        //         'body_outline_ratio': c.frame.ratio,
        //         'body_secondary_ratio': c.frame.secondary_ratio,
        //         'globalWindowPosition': {
        //             'top': top,
        //             'left': left,
        //             'width': width,
        //             'height': height,
        //         },
        //     }
        return d;
    }
    //@+node:felix.20211213224237.24: *6* fc.leojs_vnodes
    /**
     * Return a jsonized vnode.
     */
    public leojs_vnode(p: Position, gnxSet: string[], isIgnore = false): VNodeJSON {

        const c: Commands = this.c;
        const fc: FileCommands = this;

        const v = p.v;
        // Precompute constants.
        // Write the entire @edit tree if it has children.
        const isAuto = p.isAtAutoNode() && p.atAutoNodeName().trim();
        const isEdit = p.isAtEditNode() && p.atEditNodeName().trim() && !p.hasChildren();
        const isFile = p.isAtFileNode();
        const isShadow = p.isAtShadowFileNode();
        const isThin = p.isAtThinFileNode();
        let forceWrite: boolean;
        // Set forceWrite.
        if (isIgnore || p.isAtIgnoreNode()) {
            forceWrite = true;
        } else if (isAuto || isEdit || isFile || isShadow || isThin) {
            forceWrite = false;
        } else {
            forceWrite = true;
        }
        // Set the write bit if necessary.
        if (forceWrite || this.usingClipboard) {
            v.setWriteBit();  // 4.2: Indicate we wrote the body text.
        }
        let status = 0;
        if (v.isMarked()) {
            status |= StatusFlags.markedBit;
        }
        if (p.isExpanded()) {
            status |= StatusFlags.expandedBit;
        }
        if (p.__eq__(c.p)) {
            status |= StatusFlags.selectedBit;
        }

        const children: VNodeJSON[] = [];  // Start empty

        if (p.hasChildren() && (forceWrite || this.usingClipboard)) {
            // This optimization eliminates all "recursive" copies.
            p.moveToFirstChild();
            while (1) {
                children.push(fc.leojs_vnode(p, gnxSet, isIgnore));
                if (p.hasNext()) {
                    p.moveToNext();
                } else {
                    break;
                }
            }
            p.moveToParent()  // Restore p in the caller.
        }
        // At least will contain the gnx
        const result: VNodeJSON = {
            'gnx': v.fileIndex,
        } as VNodeJSON;

        if (!gnxSet.includes(v.fileIndex)) {
            result['vh'] = v._headString;  // Not a clone so far so add his headline text
            gnxSet.push(v.fileIndex);
            if (children && children.length) {
                result['children'] = children;
            }
        }

        // Else, just add status if needed
        if (status) {
            result['status'] = status;
        }
        return result;

    }
    //@+node:felix.20211213224237.25: *5* fc.write_xml_file
    /**
     * Write the outline in .leo (XML) format.
     */
    public async write_xml_file(fileName: string): Promise<boolean> {

        const c: Commands = this.c;

        let ok: boolean;
        let backupName: string | undefined;

        [ok, backupName] = await this.createBackupFile(fileName);

        if (!ok) {
            return false;
        }

        /*
        const f: number | undefined = this.openOutlineForWriting(fileName);
        if (!f) {
            return false;
        }
        */

        this.mFileName = fileName;

        try {
            const xml_s = this.outline_to_xml_string();

            //s = bytes(s, this.leo_file_encoding, 'replace');
            const s = Buffer.from(xml_s, this.leo_file_encoding as BufferEncoding);

            // f.write(s);
            //fs.writeFileSync(f, s);

            // const w_uri = vscode.Uri.file(fileName);
            const w_uri = g.makeVscodeUri(fileName);
            await vscode.workspace.fs.writeFile(w_uri, s);

            // f.close();
            // fs.closeSync(f);

            c.setFileTimeStamp(fileName);
            // Delete backup file.
            const w_exists = await g.os_path_exists(backupName);

            if (backupName && w_exists) {
                await this.deleteBackupFile(backupName);
            }
            return true;
        }
        catch (exception) {
            this.handleWriteLeoFileException(fileName, backupName!);
            return false;
        }
    }
    //@+node:felix.20211213224237.26: *5* fc.writeAllAtFileNodes
    /**
     * Write all @<file> nodes and set orphan bits.
     */
    public writeAllAtFileNodes(): boolean {

        const c: Commands = this.c;


        try {
            // To allow Leo to quit properly, do *not* signal failure here.
            c.atFileCommands.writeAll(false);
            return true;
        }
        catch (exception) {
            // #1260415: https://bugs.launchpad.net/leo-editor/+bug/1260415

            // TODO : Make es_error if really needed
            // g.es_error("exception writing external files");

            g.es_exception(exception);
            // g.es('Internal error writing one or more external files.', 'red');
            // g.es('Please report this error to:', 'blue');
            // g.es('https://groups.google.com/forum/#!forum/leo-editor', 'blue');
            // g.es('All changes will be lost unless you', 'red');
            // g.es('can save each changed file.', 'red');
            g.es('Internal error writing one or more external files.');
            g.es('Please report this error to:');
            g.es('https://groups.google.com/forum/#!forum/leo-editor');
            g.es('All changes will be lost unless you');
            g.es('can save each changed file.');
            return false;
        }
    }
    //@+node:felix.20211213224237.27: *5* fc.writeOutline (write switch)
    public async writeOutline(fileName: string): Promise<boolean> {

        const c: Commands = this.c;

        if (c.checkOutline()) {
            g.error('Structure errors in outline! outline not written');
            return false;
        }
        const w_readOnly = await this.isReadOnly(fileName);
        if (w_readOnly) {
            return false;
        }
        if (fileName.endsWith('.db')) {
            return this.exportToSqlite(fileName);
        }
        if (fileName.endsWith('.leojs')) {
            return this.write_leojs(fileName);
        }
        return this.write_xml_file(fileName);
    }
    //@+node:felix.20211213224237.28: *5* fc.writeZipFile
    /**
     * Write string s as a .zip file.
     */
    public writeZipFile(s: string): void {

        // TODO !
        /*
        // The name of the file in the archive.
        const contentsName: string = g.toEncodedString(
            g.shortFileName(this.mFileName),
            this.leo_file_encoding,
            true
        );
        // The name of the archive itthis.
        const fileName: string = g.toEncodedString(
            this.mFileName,
            this.leo_file_encoding,
            true
        );
        // Write the archive.
        // These mypy complaints look valid.
        const theFile: any = zipfile.ZipFile(fileName, 'w', zipfile.ZIP_DEFLATED);  // type:ignore
        theFile.writestr(contentsName, s);  // type:ignore
        theFile.close();
        */
    }
    //@+node:felix.20211213224237.29: *4* fc.Writing Utils
    //@+node:felix.20211213224237.30: *5* fc.pickle
    /**
     * Pickle val and return the hexlified result.
     */
    public pickle(torv: any, val: any, tag: string): string {

        try {
            const s = pickle.dumps(val, 1);
            const s2 = binascii.hexlify(s);
            const s3 = g.toUnicode(s2, 'utf-8');
            const field = ` ${tag}="${s3}"`;
            return field;
        }
        catch (exception) {
            if (tag) { // The caller will print the error if tag is None.
                g.warning("ignoring non-pickleable value", val, "in", torv);
                return '';
            }
            g.error("fc.pickle: unexpected exception in", torv);
            g.es_exception(exception);
        }

        return '';
    }
    //@+node:felix.20211213224237.31: *5* fc.put
    /**
     * Put string s to self.outputFile. All output eventually comes here.
     */
    public put(s: string): void {

        // Workaround for no io.stringIO
        // if this.outputFile is string: append to string
        // ! if this.outputFile is number it's a file handle SHOULD NOT HAPPEN

        if ((typeof this.outputFile) === 'string') {
            this.outputFile += s;
        } else if ((typeof this.outputFile) === 'number') {
            // fs.writeSync(this.outputFile, s);
            // ! SHOULD NOT HAPPEN : USING vscode.workspace.fs async methods
        } else {
            g.es_exception();
            // g.es('Internal error writing OUTPUT FILE IS UNDEFINED', 'red');
            g.es('Internal error writing OUTPUT FILE IS UNDEFINED');
        }
    }
    //@+node:felix.20211213224237.32: *5* fc.putDescendentVnodeUas & helper
    /**
     * Return the a uA field for descendent VNode attributes,
     * suitable for reconstituting uA's for anonymous vnodes.
     */
    public putDescendentVnodeUas(p: Position): string {

        // Create aList of tuples (p,v) having a valid unknownAttributes dict.
        // Create dictionary: keys are vnodes, values are corresponding archived positions.
        // const aList: [Position, VNode][] | [VNode, any][] = [];
        // TODO : FIX TYPING
        let aList: [any, any][] = [];

        const pDict: { [key: string]: number[] } = {};
        for (let p2 of p.self_and_subtree(false)) {
            if (p2.v['unknownAttributes']) {
                aList.push([p2.copy(), p2.v]);
                pDict[p2.v.gnx] = p2.archivedPosition(p);
            }
        }

        // Create aList of pairs (v,d) where d contains only pickleable entries.
        if (aList.length) {
            aList = this.createUaList(aList);
        } else {
            return '';
        }

        // Create d, an enclosing dict to hold all the inner dicts.
        const d: { [key: string]: any } = {};

        // aList is now type [VNode, any][]
        // for v, d2 in aList:
        for (let p_a of aList) {

            let v: VNode;
            let d2: any;
            [v, d2] = p_a;

            const aList2: string[] = [];
            for (let z of pDict[v.gnx]) {
                aList2.push(z.toString());
            }

            const key: string = aList2.join('.');
            d[key] = d2;
        }

        // Pickle and hexlify d
        if (!d || !Object.keys(d).length) {
            return '';
        }
        return this.pickle(p.v, d, 'descendentVnodeUnknownAttributes') || '';

    }
    //@+node:felix.20211213224237.33: *6* fc.createUaList
    /**
     * Given aList of pairs(p, torv), return a list of pairs(torv, d)
     * where d contains all picklable items of torv.unknownAttributes.
     */
    public createUaList(aList: [Position, VNode][]): [VNode, any][] {

        const result: [VNode, any][] = [];

        for (let p_a of aList) {
            let p: Position;
            let torv: VNode;
            [p, torv] = p_a;

            // if (isinstance(torv.unknownAttributes, dict)){
            if (
                typeof torv.unknownAttributes === 'object' &&
                !Array.isArray(torv.unknownAttributes) &&
                torv.unknownAttributes !== null
            ) {

                // Create a new dict containing only entries that can be pickled.
                const d = torv.unknownAttributes;  // Copy the dict.

                for (let key in d) {
                    // Just see if val can be pickled.  Suppress any error.
                    let ok;
                    try {
                        ok = this.pickle(torv, d[key], 'none');
                    }
                    catch (error) {
                        ok = false;
                    }

                    if (!ok) {
                        delete d[key];
                        g.warning("ignoring bad unknownAttributes key", key, "in", p.h);
                    }

                }
                if (d) {
                    result.push([torv, d]);
                }

            } else {
                g.warning("ignoring non-dictionary uA for", p);
            }

        }
        return result;

    }
    //@+node:felix.20211213224237.34: *5* fc.putFindSettings
    public putFindSettings(): void {
        // New in 4.3:  These settings never get written to the .leo file.
        this.put("<find_panel_settings/>\n");
    }
    //@+node:felix.20211213224237.35: *5* fc.putGlobals (sets window_position)
    /**
     * Put a vestigial <globals> element, and write global data to the cache.
     */
    public putGlobals(): void {

        const trace: boolean = g.app.debug.includes('cache');

        const c: Commands = this.c;

        this.put("<globals/>\n");
        if (!c.mFileName) {
            return;
        }

        // TODO : remove/replace unneeded window sizing settings

        // c.db['body_outline_ratio'] = str(c.frame.ratio);
        // c.db['body_secondary_ratio'] = str(c.frame.secondary_ratio);

        // [w, h, l, t] = c.frame.get_window_info();

        // c.db['window_position'] = [str(t), str(l), str(h), str(w)];

        if (trace) {
            g.trace(`\nset c.db for ${c.shortFileName()}`);
            // console.log('window_position:', c.db['window_position']);
        }

    }
    //@+node:felix.20211213224237.36: *5* fc.putHeader
    public putHeader(): void {
        this.put('<leo_header file_format="2"/>\n');
    }
    //@+node:felix.20211213224237.37: *5* fc.putPostlog
    public putPostlog(): void {
        this.put("</leo_file>\n");
    }
    //@+node:felix.20211213224237.38: *5* fc.putPrefs
    public putPrefs(): void {
        // New in 4.3:  These settings never get written to the .leo file.
        this.put("<preferences/>\n");
    }
    //@+node:felix.20211213224237.39: *5* fc.putProlog
    /**
     * Put the prolog of the xml file.
     */
    public putProlog(): void {
        const tag: string = 'https://leo-editor.github.io/leo-editor/namespaces/leo-python-editor/1.1';
        this.putXMLLine();
        // Put "created by Leo" line.
        this.put('<!-- Created by Leo: https://leo-editor.github.io/leo-editor/leo_toc.html -->\n');
        this.putStyleSheetLine();
        // Put the namespace
        this.put(`<leo_file xmlns:leo="${tag}" >\n`);
    }
    //@+node:felix.20211213224237.40: *5* fc.putSavedMessage
    public putSavedMessage(fileName: string): void {

        const c: Commands = this.c;

        let format: string;
        let timestamp: string;

        // #531: Optionally report timestamp...
        if (c.config.getBool('log-show-save-time')) {
            // format = c.config.getString('log-timestamp-format') || "%H:%M:%S";
            format = c.config.getString('log-timestamp-format') || "hh:mm:ss";

            // using https://www.npmjs.com/package/date-format-lite#syntax
            timestamp = new Date().format(format) + ' ';
        } else {
            timestamp = '';
        }
        g.es(`${timestamp}saved: ${g.shortFileName(fileName)}`);

    }
    //@+node:felix.20211213224237.41: *5* fc.putStyleSheetLine
    /**
     * Put the xml stylesheet line.
     *
     * Leo 5.3:
     *  - Use only the stylesheet setting, ignoring c.frame.stylesheet.
     *  - Write no stylesheet element if there is no setting.
     *
     * The old way made it almost impossible to delete stylesheet element.
     */
    public putStyleSheetLine(): void {

        const c: Commands = this.c;

        const sheet: string = (c.config.getString('stylesheet') || '').trim();
        // sheet2 = c.frame.stylesheet and c.frame.stylesheet.strip() or ''
        // sheet = sheet or sheet
        if (sheet) {
            this.put(`<?xml-stylesheet ${sheet} ?>\n`);
        }
    }
    //@+node:felix.20211213224237.42: *5* fc.put_t_element
    public put_t_element(v: VNode): void {
        const b: string = v.b;
        const gnx: string = v.fileIndex;
        const ua = this.putUnknownAttributes(v);
        const body: string = b.length ? this.saxutilsEscape(b) : '';
        this.put(`<t tx="${gnx}"${ua}>${body}</t>\n`);
    }
    //@+node:felix.20211213224237.43: *5* fc.put_t_elements
    /**
     * Put all <t> elements as required for copy or save commands
     */
    public put_t_elements(): void {
        this.put("<tnodes>\n");
        this.putReferencedTElements();
        this.put("</tnodes>\n");
    }
    //@+node:felix.20211213224237.44: *6* fc.putReferencedTElements
    /**
     * Put <t> elements for all referenced vnodes.
     */
    public putReferencedTElements(): void {
        const c: Commands = this.c;

        let theIter: Generator<Position, any, unknown>;

        if (this.usingClipboard) {// write the current tree.
            theIter = this.currentPosition!.self_and_subtree(false);
        } else { // write everything
            theIter = c.all_unique_positions(false);
        }

        // Populate the vnodes dict.
        const vnodes: { [key: string]: VNode } = {};

        for (let p of theIter) {
            // Make *sure* the file index has the proper form.
            // pylint: disable=unbalanced-tuple-unpacking
            const index: string = p.v.fileIndex;
            vnodes[index] = p.v;
        }

        // Put all vnodes in index order.
        // for index in sorted(vnodes)
        // Object.keys(object1)
        for (let index of Object.keys(vnodes).sort()) {
            const v: VNode = vnodes[index];
            if (v) {
                // Write only those vnodes whose vnodes were written.
                // **Note**: @<file> trees are not written unless they contain clones.
                if (v.isWriteBit()) {
                    this.put_t_element(v);
                }
            } else {
                g.trace('can not happen: no VNode for', index);
                // This prevents the file from being written.
                throw new BadLeoFile(`no VNode for ${index}`);
            }
        }

    }
    //@+node:felix.20211213224237.45: *5* fc.putUaHelper
    /**
     * Put attribute whose name is key and value is val to the output stream.
     */
    public putUaHelper(torv: VNode, key: string, val: string): string {

        let attr: string;

        // New in 4.3: leave string attributes starting with 'str_' alone.
        if (key.startsWith('str_')) {

            if (typeof val === 'string' || (val as any) instanceof String) {
                val = g.toUnicode(val);
                // attr = f' {key}={xml.sax.saxutils.quoteattr(val)}'
                attr = ` ${key}=${this.quoteattr(val)}`;
                return attr;
            }

            g.trace(typeof val, val);
            g.warning("ignoring non-string attribute", key, "in", torv);
            return '';

        }

        // Support JSON encoded attributes
        if (key.startsWith('json_')) {
            let w_error = false;
            try {
                val = JSON.stringify(val);
            }
            catch (e) {
                // fall back to pickle
                g.trace(typeof val, val);
                g.warning("pickling JSON incompatible attribute", key, "in", torv);
                w_error = true;

            }
            if (!w_error) {
                // attr = f' {key}={xml.sax.saxutils.quoteattr(val)}'
                attr = ` ${key}=${this.quoteattr(val)}`;
                return attr;
            }
        }
        return this.pickle(torv, val, key);

    }
    //@+node:felix.20211213224237.46: *5* fc.putUnknownAttributes
    /**
     * Put pickleable values for all keys in v.unknownAttributes dictionary.
     */
    public putUnknownAttributes(v: VNode): string {

        if (!v.unknownAttributes) {
            return '';
        }

        const attrDict = v.unknownAttributes;

        // if (isinstance(attrDict, dict)){
        if (
            typeof attrDict === 'object' &&
            !Array.isArray(attrDict) &&
            attrDict !== null
        ) {

            const valArray: string[] = [];
            const sorted_keys = Object.keys(attrDict).sort();

            for (const key of sorted_keys) {
                valArray.push(this.putUaHelper(v, key, attrDict[key]));
            }

            const val: string = valArray.join('');

            return val;
        }

        g.warning("ignoring non-dictionary unknownAttributes for", v);
        return '';
    }
    //@+node:felix.20211213224237.47: *5* fc.put_v_element & helper
    /**
     * Write a <v> element corresponding to a VNode.
     */
    public put_v_element(p: Position, isIgnore?: boolean): void {

        const fc: FileCommands = this;
        const v: VNode = p.v;
        //
        // Precompute constants.
        const isAuto: boolean = !!(p.isAtAutoNode() && p.atAutoNodeName().trim());
        const isEdit: boolean = !!(p.isAtEditNode() && p.atEditNodeName().trim() && !p.hasChildren());
        // Write the entire @edit tree if it has children.
        const isFile: boolean = p.isAtFileNode();
        const isShadow: boolean = p.isAtShadowFileNode();
        const isThin: boolean = p.isAtThinFileNode();
        //
        // Set forcewrite.
        let forceWrite: boolean;
        if (isIgnore || p.isAtIgnoreNode()) {
            forceWrite = true;
        } else if (isAuto || isEdit || isFile || isShadow || isThin) {
            forceWrite = false;
        } else {
            forceWrite = true;
        }
        //
        // Set the write bit if necessary.
        const gnx: string = v.fileIndex;
        if (forceWrite || this.usingClipboard) {
            v.setWriteBit();  // 4.2: Indicate we wrote the body text.
        }
        const attrs: string = fc.compute_attribute_bits(forceWrite, p);
        //
        // Write the node.
        let v_head: string = `<v t="${gnx}"${attrs}>`;
        if (fc.vnodesDict[gnx]) {
            fc.put(v_head + '</v>\n');
        } else {
            fc.vnodesDict[gnx] = true;
            v_head = v_head + `<vh>${this.saxutilsEscape(p.v.headString() || '')}</vh>`;

            // xml.sax.saxutils.escape(data, entities={})
            // Escape '&', '<', and '>' in a string of data.

            // New in 4.2: don't write child nodes of @file-thin trees
            // (except when writing to clipboard)
            if (p.hasChildren() && (forceWrite || this.usingClipboard)) {
                fc.put(`${v_head}\n`);
                // This optimization eliminates all "recursive" copies.
                p.moveToFirstChild();
                while (1) {
                    fc.put_v_element(p, isIgnore);
                    if (p.hasNext()) {
                        p.moveToNext();
                    } else {
                        break;
                    }
                }
                p.moveToParent(); // Restore p in the caller.
                fc.put('</v>\n');
            } else {
                fc.put(`${v_head}</v>\n`);  // Call put only once.
            }
        }
    }
    //@+node:felix.20211213224237.48: *6* fc.compute_attribute_bits
    /**
     * Return the initial values of v's attributes.
     */
    public compute_attribute_bits(forceWrite: boolean, p: Position): string {
        const attrs = [];
        if (p.hasChildren() && !forceWrite && !this.usingClipboard) {
            // Fix #526: do this for @auto nodes as well.
            attrs.push(this.putDescendentVnodeUas(p));
            // Fix #1023: never put marked/expanded bits.
            // attrs.append(self.putDescendentAttributes(p))
        }
        return attrs.join('');
    }
    //@+node:felix.20211213224237.49: *5* fc.put_v_elements & helper
    /**
     * Puts all <v> elements in the order in which they appear in the outline.
     */
    public put_v_elements(p?: Position): void {

        const c: Commands = this.c;

        c.clearAllVisited();
        this.put("<vnodes>\n");
        // Make only one copy for all calls.

        this.currentPosition = p || c.p;

        this.rootPosition = c.rootPosition();
        this.vnodesDict = {};
        if (this.usingClipboard) {
            // TODO : MAYBE UNNEEDED?
            // this.expanded_gnxs = [];
            // this.marked_gnxs = [];

            // These will be ignored.


            this.put_v_element(this.currentPosition);
            // Write only current tree.
        } else {
            for (let p of c.rootPosition()!.self_and_siblings()) {
                this.put_v_element(p, p.isAtIgnoreNode());
            }

            // Fix #1018: scan *all* nodes.
            this.setCachedBits();

        }
        this.put("</vnodes>\n");
    }
    //@+node:felix.20211213224237.50: *6* fc.setCachedBits
    /**
     * Set the cached expanded and marked bits for *all* nodes.
     * Also cache the current position.
     */
    public setCachedBits(): void {

        const trace: boolean = !!g.app.debug.includes('cache');

        const c: Commands = this.c;

        if (!c.mFileName) {
            return;  // New.
        }
        const current: string[] = [];
        for (let z of this.currentPosition!.archivedPosition()) {
            current.push(z.toString());
        }

        const expanded: string[] = [];
        for (let v of c.all_unique_nodes()) {
            if (v.isExpanded()) {
                expanded.push(v.gnx);
            }
        }
        const marked: string[] = [];
        for (let v of c.all_unique_nodes()) {
            if (v.isMarked()) {
                marked.push(v.gnx);
            }
        }

        c.db['expanded'] = expanded.join(", ");
        c.db['marked'] = marked.join(", ");
        c.db['current_position'] = current.join(", ");

        if (trace) {
            g.trace(`\nset c.db for ${c.shortFileName()}`);
            console.log('expanded:', expanded);
            console.log('marked:', marked);
            console.log('current_position:', current);
            console.log('');
        }
    }
    //@+node:felix.20211213224237.51: *5* fc.putXMLLine
    /**
     * Put the **properly encoded** <?xml> element.
     */
    public putXMLLine(): void {
        // Use self.leo_file_encoding encoding.
        this.put(
            `${g.app.prolog_prefix_string}` +
            `"${this.leo_file_encoding}"` +
            `${g.app.prolog_postfix_string}\n`);
    }
    //@-others

}

//@-others
//@@language typescript
//@@tabwidth -4

//@-leo
