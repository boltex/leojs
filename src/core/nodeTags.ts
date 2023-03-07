//@+leo-ver=5-thin
//@+node:felix.20221019001448.1: * @file src/core/nodeTags.ts
//@+<< nodetags docstring >>
//@+node:felix.20221019001558.1: ** << nodetags docstring >>
/*
    Provides node tagging capabilities to Leo

    By Jacob M. Peck

    API
    ===

    This plugin registers a controller object to c.theTagController, which provides
    the following API::

        tc = c.theTagController
        tc.get_all_tags()
            return a list of all tags used in the current outline,
            automatically updated to be consistent
        tc.get_tagged_nodes('foo')
            return a list of positions tagged 'foo'
        tc.get_tags(p)
            return a list of tags applied to the node at position p.
            returns [] if node has no tags
        tc.add_tag(p, 'bar')
            add the tag 'bar' to the node at position p
        tc.remove_tag(p, 'baz')
            remove the tag 'baz' from p if it is in the tag list

    Internally, tags are stored in `p.v.unknownAttributes['__node_tags']` as a set.

    UI
    ==

    The "Tags" tab in the Log pane is the UI for this plugin. The bar at the top is
    a search bar, editable to allow complex search queries. It is pre-populated with
    all existing tags in the outline, and remembers your custom searches within the
    given session. It also acts double duty as an input box for the add (+) button,
    which adds the contents of the search bar as a tag to the currently selected
    node.

    To add a new tag, type its name in the search bar, then click the "+" button.

    The list box in the middle is a list of headlines of nodes which contain the
    tag(s) defined by the current search string. These are clickable, and doing so
    will center the focus in the outline pane on the selected node.

    Below the list box is a dynamic display of tags on the currently selected node.
    Left-clicking on any of these will populate the search bar with that tag,
    allowing you to explore similarly tagged nodes. Right-clicking on a tag will
    remove it from the currently selected node.

    The status line at the bottom is purely informational.

    The tag browser has set-algebra querying possible. Users may search for strings
    like 'foo&bar', to get nodes with both tags foo and bar, or 'foo|bar' to get
    nodes with either or both. Set difference (-) and symmetric set difference (^)
    are supported as well. These queries are left-associative, meaning they are read
    from left to right, with no other precedence. Parentheses are not supported.
    Additionally, regular expression support is included, and tag hierarchies can be
    implemented with wildcards. See below for more details.

    Searching
    ---------

    Searching on tags in the UI is based on set algebra. The following syntax is
    used::

        <tag>&<tag> - return nodes tagged with both the given tags
        <tag>|<tag> - return nodes tagged with either of the given tags (or both)
        <tag>-<tag> - return nodes tagged with the first tag, but not the second tag
        <tag>^<tag> - return nodes tagged with either of the given tags (but *not* both)

    These may be combined, and are applied left-associatively, building the set from
    the left, such that the query `foo&bar^baz` will return only nodes tagged both
    'foo' and 'bar', or nodes tagged with 'baz', but *not* tagged with all three.

    Additionally, the search string may be any valid regular expression, meaning you
    can search using wildcards (*), and using this, you can create tag hierarchies,
    for example 'work/priority' and 'work/long-term'. Searching for `work/*` would
    return all nodes tagged with either 'work/priority' or 'work/long-term'.

    Please note that this plugin automatically replaces '*' with '.*' in your search
    string to produce python-friendly regular expressions. This means nothing to the
    end-user, except that '*' can be used as a wildcard freely, as one expects.

    Tag Limitations
    ---------------

    The API is unlimited in tagging abilities. If you do not wish to use the UI,
    then the API may be used to tag nodes with any arbitrary strings. The UI,
    however, due to searching capabilities, may *not* be used to tag (or search for)
    nodes with tags containing the special search characters, `&|-^`. The UI also
    cannot search for tags of zero-length, and it automatically removes surrounding
    whitespace (calling .strip()).
*/

//@-<< nodetags docstring >>
//@+<< nodetags imports >>
//@+node:felix.20221019001703.1: ** << nodetags imports >>
import * as g from './leoGlobals';
import { Position, VNode } from './leoNodes';
import { Commands } from './leoCommands';
//@-<< nodetags imports >>
//@+others
//@+node:felix.20221019002843.1: ** class TagController
export class TagController {

    public readonly TAG_LIST_KEY = '__node_tags';
    public c: Commands;
    public taglist: string[];

    //@+others
    //@+node:felix.20221019002843.2: *3* tag_c.__init__
    constructor(c: Commands) {

        this.c = c;
        this.taglist = [];
        this.initialize_taglist();
        // ! c.theTagController = this; // ! SET IN c BY ITSELF !

        // #2031: Init the widgets only if we are using Qt.
        // if g.app.gui.guiName().startswith('qt'):
        //     this.ui = LeoTagWidget(c)
        //     c.frame.log.createTab('Tags', widget=this.ui)
        //     this.ui.update_all()

    }
    //@+node:felix.20221019002843.3: *3* tag_c.initialize_taglist
    public initialize_taglist(): void {
        const taglist: string[] = [];
        for (let p of this.c.all_unique_positions()) {
            for (let tag of this.get_tags(p)) {
                if (!taglist.includes(tag)) {
                    taglist.push(tag);
                }
            }
        }
        this.taglist = taglist;
    }
    //@+node:felix.20221019002843.4: *3* tag_c.outline-level
    //@+node:felix.20221019002843.5: *4* tag_c.get_all_tags
    /**
     * return a list of all tags in the outline
     */
    public get_all_tags(): string[] {

        return this.taglist;

    }
    //@+node:felix.20221019002843.6: *4* tag_c.show_all_tags
    /**
     * Show all tags, organized by node.
     */
    public show_all_tags(): void {
        const c = this.c;
        const tc = this;
        let aList: string[];

        const d: { [key: string]: string[] } = {};
        let tags: string[];
        for (let p of c.all_unique_positions()) {
            const u = p.v.u;
            tags = u[this.TAG_LIST_KEY] || [];
            for (let tag of tags) {
                aList = d[tag] || [];
                aList.push(p.h);
                d[tag] = aList;
            }
        }
        // Print all tags.
        if (Object.keys(d).length) {
            for (let key of Object.keys(d).sort()) {
                aList = d[key];
                for (let h of Object.keys(aList).sort()) {
                    g.es(`${key} ${h}`);
                }
            }
        } else {
            if (!g.unitTesting) {
                g.es(`no tags in ${c.shortFileName()}`);
            }
        }

    }
    //@+node:felix.20221019002843.7: *4* tag_c.update_taglist
    /**
     * ensures the outline's taglist is consistent with the state of the nodes in the outline
     */
    public update_taglist(tag: string): void {

        if (!this.taglist.includes(tag)) {
            this.taglist.push(tag);
        }
        const nodelist = this.get_tagged_nodes(tag);
        if (!nodelist || !nodelist.length) {
            this.taglist = this.taglist.filter(e => e !== tag);
        }
        // ? NEEDED ?
        // if hasattr(this, 'ui'):
        //     this.ui.update_all()

    }
    //@+node:felix.20221019002843.8: *4* tag_c.get_tagged_nodes
    /**
     * return a list of *positions* of nodes containing the tag, with * as a wildcard
     */
    public get_tagged_nodes(tag: string): Position[] {

        const nodelist: Position[] = [];
        // replace * with .* for regex compatibility
        tag = tag.split('*').join('.*');
        let regex;
        try {
            regex = new RegExp(tag);
        }
        catch (e) {
            if (!g.unitTesting) {
                g.warning('invalid regular expression:', tag);
            }
            return nodelist;
        }
        for (let p of this.c.all_unique_positions()) {
            for (let tag of this.get_tags(p)) {
                if (tag.match(regex)) {
                    nodelist.push(p.copy());
                    break;
                }
            }
        }
        return nodelist;

    }
    //@+node:felix.20221019002843.9: *4* tag_c.get_tagged_gnxes
    public *get_tagged_gnxes(tag: string): Generator<string> {
        const c = this.c;
        tag = tag.split('*').join('.*');
        let regex;
        try {
            regex = new RegExp(tag);
        }
        catch (e) {
            if (!g.unitTesting) {
                g.warning('invalid regular expression:', tag);
            }
            return;
        }
        for (let p of c.all_unique_positions()) {
            for (let t of this.get_tags(p)) {
                if (t.match(regex)) {
                    yield p.v.gnx;
                }
            }
        }
    }
    //@+node:felix.20221019002843.10: *3* tag_c.individual nodes
    //@+node:felix.20221019002843.11: *4* tag_c.get_tags
    /**
     * returns a list of tags applied to position p.
     */
    public get_tags(p: Position): string[] {

        if (p && p.__bool__()) {
            const tags = p.v.u[this.TAG_LIST_KEY] || [];
            return tags;
        }

        return [];

    }
    //@+node:felix.20221019002843.12: *4* tag_c.add_tag
    /**
     *  adds 'tag' to the taglist of v
     */
    public add_tag(p: Position, tag: string): void {

        // cast to set() incase JSON storage (leo_cloud plugin) converted to list

        const tags = p.v.u[this.TAG_LIST_KEY] as string[] || [];
        if (!tags.includes(tag)) {
            tags.push(tag);
            p.v.u[this.TAG_LIST_KEY] = tags;
            this.c.setChanged();
            this.update_taglist(tag);
        }
    }
    //@+node:felix.20221019002843.13: *4* tag_c.remove_tag
    /**
     * removes 'tag' from the taglist of position p. 
     */
    public remove_tag(p: Position, tag: string): void {
        const v = p.v;
        //  In case JSON storage (leo_cloud plugin) converted to list.
        let tags = v.u[this.TAG_LIST_KEY] as string[] || [];
        if (tags.includes(tag)) {
            tags = tags.filter(e => e !== tag);
            this.c.setChanged();
        }
        if (tags.length) {
            v.u[this.TAG_LIST_KEY] = tags;
        } else {
            //  prevent a few corner cases, and conserve disk space
            if (v.u.hasOwnProperty(this.TAG_LIST_KEY)) {
                delete v.u[this.TAG_LIST_KEY];
                this.c.setChanged();
            }

        }
        this.update_taglist(tag);
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
