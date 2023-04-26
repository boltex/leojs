//@+leo-ver=5-thin
//@+node:felix.20230420210348.1: * @file src/core/leoPersistence.ts
/**
 * Support for persistent clones, gnx's and uA's using @persistence trees.
 */
//@+<< leoPersistence imports & annotations >>
//@+node:felix.20230424003144.2: ** << leoPersistence imports & annotations >>
var binascii = require('binascii');
var pickle = require('./jpicklejs');
import * as g from './leoGlobals';
import { command } from "../core/decorators";
import { Commands } from './leoCommands';
import { Position } from './leoNodes';
//@-<< leoPersistence imports & annotations >>
//@+others
//@+node:felix.20230425220115.1: ** class TopLevelPersistanceCommands
export class TopLevelPersistanceCommands {

    //@+others
    //@+node:felix.20230425220115.2: *3*  Top-level commands
    //@+node:felix.20230424003144.3: *4* @g.command('clean-persistence')
    @command(
        'clean-persistence',
        'Remove all @data nodes that do not correspond to an existing foreign file.'
    )
    public view_pack_command(this: Commands): void {
        const c: Commands = this;

        if (c && c.persistenceController){
            c.persistenceController.clean();
        }
    }
    //@-others

}
//@+node:felix.20230424003144.4: ** class PersistenceDataController
export class PersistenceDataController {

    //@+<< docstring >>
    //@+node:felix.20230424003144.5: *3*  << docstring >> (class persistenceController)
    /**
     *  A class to handle persistence in **foreign files**, that is,
     *  files created by @auto, @org-mode or @vim-outline node.
     *
     *  All required data are held in nodes having the following structure::
     *
     *      - @persistence
     *        - @data <headline of foreign node>
     *          - @gnxs
     *            body text: pairs of lines: gnx:<gnx><newline>unl:<unl>
     *          - @uas
     *              @ua <gnx>
     *                  body text: the pickled uA
     */
    //@-<< docstring >>
    
    public c: Commands;
    public at_persistence: Position | undefined;

    //@+others
    //@+node:felix.20230424003144.6: *3* pd.ctor
    /**
     * Ctor for persistenceController class.
     */
    constructor(c: Commands){
        this.c = c;
        this.at_persistence = undefined;  // The position of the @position node.
    }
    //@+node:felix.20230424003144.7: *3* pd.Entry points
    //@+node:felix.20230424003144.8: *4* pd.clean
    /**
     * Remove all @data nodes that do not correspond to an existing foreign file.
     */
    public clean(): void {
        
        const c = this.c;
        const at_persistence = this.has_at_persistence_node();
        if( !at_persistence || !at_persistence.__bool__()){
            return;
        }

        const foreign_list = [];
        for( const p of c.all_unique_positions()){
            if (this.is_foreign_file(p)){
                foreign_list.push(p.h.trim());
            }
        }

        const delete_list = [];
        const tag = '@data:';
        for (const child of at_persistence.children()){
            if (child.h.startsWith(tag)){
                const name = child.h.substring(tag.length).trim();
                if (!foreign_list.includes(name)){
                    delete_list.push(child.copy());
                }
            }
        }

        if (delete_list && delete_list.length){
            at_persistence.setDirty();
            c.setChanged();
            for (const p of delete_list){
                g.es_print('deleting:', p.h);
            }
            c.deletePositionsInList(delete_list);
            c.redraw();
        }

    }
    //@+node:felix.20230424003144.9: *4* pd.update_before_write_foreign_file & helpers
    /**
     * Update the @data node for root, a foreign node.
     * Create @gnxs nodes and @uas trees as needed.
     */
    public update_before_write_foreign_file(root: Position): Position | undefined {
        
        // Delete all children of the @data node.
        this.at_persistence = this.find_at_persistence_node();
        if (!this.at_persistence){
            return undefined;
        }

        // was return at_data # for at-file-to-at-auto command.
        const at_data = this.find_at_data_node(root);
        this.delete_at_data_children(at_data, root);
        // Create the data for the @gnxs and @uas trees.
        const aList = [];
        const seen = [];
        for (const p of root.subtree()){
            const gnx = p.v.gnx;
            console.assert(gnx);
            if (!seen.includes(gnx)){
                seen.push(gnx);
                aList.push(p.copy());
            }
        }
        // Create the @gnxs node
        const at_gnxs = this.find_at_gnxs_node(root);
        at_gnxs.b = aList.map(p=>`gnx: ${p.v.gnx}\nunl: ${this.relative_unl(p, root)}\n`).join('');    

        // Create the @uas tree.
        const uas = aList.filter(p=>p.v.u && Object.keys(p.v.u).length);
        if (uas && uas.length){
            const at_uas = this.find_at_uas_node(root);
            if (at_uas.hasChildren()){
                at_uas.v._deleteAllChildren();
            }
            for (const p of uas){
                const p2 = at_uas.insertAsLastChild();
                p2.h = '@ua:' + p.v.gnx;
                p2.b = `unl:${this.relative_unl(p, root)}\nua:${this.pickle(p)}`;
            }
        }

        // This is no longer necessary because of at.saveOutlineIfPossible.
            // Explain why the .leo file has become dirty.
            // g.es_print(f"updated: @data:{root.h} ")
        return at_data;  // For at-file-to-at-auto command.

    }
    //@+node:felix.20230424003144.10: *5* pd.delete_at_data_children
    /** 
     * Delete all children of the @data node
     */
    public delete_at_data_children(at_data: Position, root: Position): void {
        if (at_data.hasChildren()){
            at_data.v._deleteAllChildren();
        }
    }
    //@+node:felix.20230424003144.11: *4* pd.update_after_read_foreign_file & helpers
    /**
     * Restore gnx's, uAs and clone links using @gnxs nodes and @uas trees.
     */
    public update_after_read_foreign_file(root: Position): void {
        
        this.at_persistence = this.find_at_persistence_node();
        if (!this.at_persistence){
            return;
        }
        if (!root || !root.__bool__()){
            return;
        }
        if (!this.is_foreign_file(root)){
            return;
        }
        // Create clone links from @gnxs node
        const at_gnxs = this.has_at_gnxs_node(root);
        if (at_gnxs){
            this.restore_gnxs(at_gnxs, root);
        }
        // Create uas from @uas tree.
        const at_uas = this.has_at_uas_node(root);
        if (at_uas){
            this.create_uas(at_uas, root);
        }
    }
    //@+node:felix.20230424003144.12: *5* pd.restore_gnxs & helpers
    /**
     * Recreate gnx's and clone links from an @gnxs node.
     *  @gnxs nodes contain pairs of lines:
     *      gnx:<gnx>
     *      unl:<unl>
     */
    public restore_gnxs(at_gnxs: Position, root: Position): void {
        const lines = g.splitLines(at_gnxs.b);

        const gnxs = lines.filter(s=>s.startsWith('gnx:')).map(s=>s.substring(4).trim());
        const unls = lines.filter(s=>s.startsWith('unl:')).map(s=>s.substring(4).trim());

        if (gnxs.length === unls.length){
            d = this.create_outer_gnx_dict(root);
            for( let [gnx, unl] of zip(gnxs, unls)){
                this.restore_gnx(d, gnx, root, unl);
            }
        }else{
            g.trace('bad @gnxs contents', gnxs, unls);
        }

    }
    //@+node:felix.20230424003144.13: *6* pd.create_outer_gnx_dict
    /**
     * Return a dict whose keys are gnx's and whose values are positions
     * **outside** of root's tree.
     */
    public create_outer_gnx_dict(root: Position): {[key: string]: Position} {
        
        const c = this.c;
        const d: {[key: string]: Position} = {};
        const p = c.rootPosition();
        while (p && p.__bool__()){
            if (p.v === root.v){
                p.moveToNodeAfterTree();
            }else{
                const gnx = p.v.fileIndex;
                d[gnx] = p.copy();
                p.moveToThreadNext();
            }
        }
        return d;

    }
    //@+node:felix.20230424003144.14: *6* pd.restore_gnx
    /**
     * d is an *outer* gnx dict, associating nodes *outside* the tree with positions.
     * Let p1 be the position of the node *within* root's tree corresponding to unl.
     * Let p2 be the position of any node *outside* root's tree with the given gnx.
     * - Set p1.v.fileIndex = gnx.
     * - If p2 exists, relink p1 so it is a clone of p2.
     */
    public restore_gnx(d: {[key: string]: Position}, gnx: string, root: Position, unl: string): void {
        
        const p1 = this.find_position_for_relative_unl(root, unl);
        if (!p1 || !p1.__bool__()){
            return;
        }

        const p2 = d[gnx];
        if (p2 && p2.__bool__()){
            if (p1.h === p2.h && p1.b === p2.b){
                p1._relinkAsCloneOf(p2);
                // Warning: p1 *no longer exists* here.
                // _relinkAsClone does *not* set p1.v = p2.v.
            }else{
                g.es_print('mismatch in cloned node', p1.h);
            }
        }else{
            // Fix #526: A major bug: this was not set!
            p1.v.fileIndex = gnx;
        }

        g.app.nodeIndices.updateLastIndex(g.toUnicode(gnx));

    }
    //@+node:felix.20230424003144.15: *5* pd.create_uas
    /**
     * Recreate uA's from the @ua nodes in the @uas tree.
     */
    public create_uas(at_uas: Position, root: Position): void {
        // Create an *inner* gnx dict.
        // Keys are gnx's, values are positions *within* root's tree.
        const d: {[key: string]: Position} = {};
        for( const p of root.self_and_subtree(false)){
            d[p.v.gnx] = p.copy();
        }

        // Recreate the uA's for the gnx's given by each @ua node.
        for (const at_ua of at_uas.children()){
            const h = at_ua.h;
            const b =  at_ua.b;
            const gnx = h.substring(4).trim();
            if (b && gnx && g.match_word(h, 0, '@ua')){
                p = d[gnx];
                if (p && p.__bool__()){
                    // Handle all recent variants of the node.
                    let unl, ua;
                    const lines = g.splitLines(b);
                    if( b.startswith('unl:') && lines.length === 2){
                        // pylint: disable=unbalanced-tuple-unpacking
                       [unl, ua] = lines;
                    }else{
                       [unl, ua] = undefined, b;
                    }
                    if (ua.startswith('ua:')){
                        ua = ua.substring(3);
                    }
                    if (ua){
                        ua = this.unpickle(ua);
                        p.v.u = ua;
                    }else{
                        g.trace('Can not unpickle uA in', p.h);
                    }
                }
            }
        }
    }
    //@+node:felix.20230424003144.16: *3* pd.Helpers
    //@+node:felix.20230424003144.17: *4* pd.at_data_body
    // Note: the unl of p relative to p is simply p.h,
    // so it is pointless to add that to @data nodes.

    /**
     * Return the body text for p's @data node.
     */
    public at_data_body(p: Position): string {
        
        return `gnx: ${p.v.gnx}\n`;

    }
    //@+node:felix.20230424003144.18: *4* pd.expected_headline
    /**
     * Return the expected imported headline for p.
     */
    public expected_headline(p: Position): string {
        
        return (p.v as any)['_imported_headline'] || p.h;

    }
    //@+node:felix.20230424003144.19: *4* pd.find...
    // The find commands create the node if not found.
    //@+node:felix.20230424003144.20: *5* pd.find_at_data_node & helper
    /**  
     * Return the @data node for root, a foreign node.
     * Create the node if it does not exist.
     */
    public find_at_data_node(root: Position): Position|undefined {
       
        this.at_persistence = this.find_at_persistence_node();
        if (!this.at_persistence){
            return undefined;
        }
        let p;
        p = this.has_at_data_node(root);
        if (p && p.__bool__()){
            return p;
        }
        p = this.at_persistence.insertAsLastChild();
        if (!p || !p.__bool__()){  // #2103
            return undefined;
        }
        p.h = '@data:' + root.h;
        p.b = this.at_data_body(root);
        return p;

    }
    //@+node:felix.20230424003144.21: *5* pd.find_at_gnxs_node
    /**
     * Find the @gnxs node for root, a foreign node.
     * Create the @gnxs node if it does not exist.
     */
    public find_at_gnxs_node(root: Position): Position | undefined {
          const h = '@gnxs';
        if (!this.at_persistence){
            return undefined;
        }
        const data = this.find_at_data_node(root)!;
        let p = g.findNodeInTree(this.c, data, h);
        if (p && p.__bool__()){
            return p
        }
        p = data.insertAsLastChild();
        if (p && p.__bool__()){ // #2103
            p.h = h
        }
        return p;
    }
    //@+node:felix.20230424003144.22: *5* pd.find_at_persistence_node
    /** 
     * Find the first @persistence node in the outline.
     * If it does not exist, create it as the *last* top-level node,
     * so that no existing positions become invalid.
     */
    public find_at_persistence_node(): Position | undefined {
        const c = this.c;
        const h = '@persistence';
        let p = g.findNodeAnywhere(c, h);
        if (p && p.__bool__()){
            return p;
        }
        if (c.config.getBool('create-at-persistence-nodes-automatically')){
            const last = c.rootPosition()!;
            while(last.hasNext()){
                last.moveToNext();
            }

            p = last.insertAfter();
            if (p && p.__bool__()){ // #2103
                p.h = h;
                g.es_print(`created ${h} node`);
            }
        }
        return p;

    }
    //@+node:felix.20230424003144.23: *5* pd.find_at_uas_node
    /**
     * Find the @uas node for root, a foreign node.
     * Create the @uas node if it does not exist.
     */
    public find_at_uas_node(root: Position): Position | undefined{
      
        const h = '@uas';
        if (!this.at_persistence){
            return undefined;
        }
        const auto_view = this.find_at_data_node(root)!;
        let p = g.findNodeInTree(this.c, auto_view, h);
        if (p && p.__bool__()){
            return p;
        }
        p = auto_view.insertAsLastChild();
        if (p && p.__bool__()){ // #2103
            p.h = h;
        }
        return p

    }
    //@+node:felix.20230424003144.24: *5* pd.find_position_for_relative_unl & helpers
    /**
     * Given a unl relative to root, return the node whose
     * unl matches the longest suffix of the given unl.
     */
    public find_position_for_relative_unl(root: Position, unl: string): Position {
      
        const unl_list = unl.split('-->');

        if (!unl_list.length || unl_list.length === 1 && !unl_list[0]){
            return root;
        }
        // return self.find_best_match(root, unl_list)
        return this.find_exact_match(root, unl_list);

    }
    //@+node:felix.20230424003144.25: *6* pd.find_best_match
    public find_best_match(root: Position, unl_list: List[str]): position | undefined
        """Find the best partial matches of the tail in root's tree."""
        tail = unl_list[-1]
        matches = []
        for p in root.self_and_subtree(copy=False):
            if p.h == tail  // A match
                // Compute the partial unl.
                parents = 0
                for parent2 in p.parents()
                    if parent2 == root
                        break
                    elif parents + 2 > len(unl_list)
                        break
                    elif parent2.h != unl_list[-2 - parents]
                        break
                    else
                        parents += 1
                matches.append((parents, p.copy()),)
        if matches
            // Take the match with the greatest number of parents.

            const key= (aTuple: Tuple) -> Any:
                return aTuple[0]

            n, p = list(sorted(matches, key=key))[-1]
            return p
        return None
    //@+node:felix.20230424003144.26: *6* pd.find_exact_match
    public find_exact_match(root: Position, unl_list: List[str]): Position
        """
        Find an exact match of the unl_list in root's tree.
        The root does not appear in the unl_list.
        """
        // full_unl = '-->'.join(unl_list)
        parent = root
        for unl in unl_list:
            for child in parent.children()
                if child.h.strip() == unl.strip()
                    parent = child
                    break
            else
                return None
        return parent
    //@+node:felix.20230424003144.27: *5* pd.find_representative_node
    public find_representative_node(root: Position, target: Position): position | undefined
        """
        root is a foreign node. target is a gnxs node within root's tree.

        Return a node *outside* of root's tree that is cloned to target,
        preferring nodes outside any @<file> tree.
        Never return any node in any @persistence tree.
        """
        assert target
        assert root
        // Pass 1: accept only nodes outside any @file tree.
        p = self.c.rootPosition()
        while p
            if p.h.startswith('@persistence')
                p.moveToNodeAfterTree()
            elif p.isAnyAtFileNode()
                p.moveToNodeAfterTree()
            elif p.v == target.v
                return p
            else
                p.moveToThreadNext()
        // Pass 2: accept any node outside the root tree.
        p = self.c.rootPosition()
        while p
            if p.h.startswith('@persistence')
                p.moveToNodeAfterTree()
            elif p == root
                p.moveToNodeAfterTree()
            elif p.v == target.v
                return p
            else
                p.moveToThreadNext()
        g.trace('no representative node for:', target, 'parent:', target.parent())
        return None
    //@+node:felix.20230424003144.28: *4* pd.foreign_file_name
    public foreign_file_name(p: Position) -> Optional[str]:
        """Return the file name for p, a foreign file node."""
        for tag in ('@auto', '@org-mode', '@vim-outline'):
            if g.match_word(p.h, 0, tag):
                return p.h[len(tag) :].strip()
        return None
    //@+node:felix.20230424003144.29: *4* pd.has...
    // The has commands return None if the node does not exist.
    //@+node:felix.20230424003144.30: *5* pd.has_at_data_node
    public has_at_data_node(root: Position): position | undefined
        """
        Return the @data node corresponding to root, a foreign node.
        Return None if no such node exists.
        """
        // if g.unitTesting:
            // pass
        if not self.at_persistence
            return None
        if not self.is_at_auto_node(root)
            return None
        // Find a direct child of the @persistence nodes with matching headline and body.
        s = self.at_data_body(root)
        for p in self.at_persistence.children()
            if p.b == s
                return p
        return None
    //@+node:felix.20230424003144.31: *5* pd.has_at_gnxs_node
    public has_at_gnxs_node(root: Position): position | undefined
        """
        Find the @gnxs node for an @data node with the given unl.
        Return None if it does not exist.
        """
        if self.at_persistence
            p = self.has_at_data_node(root)
            return p and g.findNodeInTree(self.c, p, '@gnxs')
        return None
    //@+node:felix.20230424003144.32: *5* pd.has_at_uas_node
    public has_at_uas_node(root: Position): position | undefined
        """
        Find the @uas node for an @data node with the given unl.
        Return None if it does not exist.
        """
        if self.at_persistence
            p = self.has_at_data_node(root)
            return p and g.findNodeInTree(self.c, p, '@uas')
        return None
    //@+node:felix.20230424003144.33: *5* pd.has_at_persistence_node
    public has_at_persistence_node(self): position | undefined
        """Return the @persistence node or None if it does not exist."""
        return g.findNodeAnywhere(self.c, '@persistence')
    //@+node:felix.20230424003144.34: *4* pd.is...
    //@+node:felix.20230424003144.35: *5* pd.is_at_auto_node
    public is_at_auto_node(p: Position): boolean 
        """
        Return True if p is *any* kind of @auto node,
        including @auto-otl and @auto-rst.
        """
        // The safe way: it tracks changes to p.isAtAutoNode.
        return p.isAtAutoNode()
    //@+node:felix.20230424003144.36: *5* pd.is_at_file_node
    /**
     * Return True if p is an @file node.
     */
    public is_at_file_node(p: Position): boolean 
   
        return g.match_word(p.h, 0, '@file')
    //@+node:felix.20230424003144.37: *5* pd.is_cloned_outside_parent_tree
    /**
     * Return True if a clone of p exists outside the tree of p.parent().
     */
    public is_cloned_outside_parent_tree(p: Position): boolean 
   
        return len(list(set(p.v.parents))) > 1
    //@+node:felix.20230424003144.38: *5* pd.is_foreign_file
    public is_foreign_file(p: Position): boolean 
        return (
            self.is_at_auto_node(p) or
            g.match_word(p.h, 0, '@org-mode') or
            g.match_word(p.h, 0, '@vim-outline'))
    //@+node:felix.20230424003144.39: *4* pd.Pickling
    //@+node:felix.20230424003144.40: *5* pd.pickle
    /**
     * Pickle val and return the hexlified result.
     */
    public pickle(p: Position): string
   
        try
            ua = p.v.u
            s = pickle.dumps(ua, protocol=1)
            s2 = binascii.hexlify(s)
            s3 = g.toUnicode(s2, 'utf-8')
            return s3
        catch pickle.PicklingError
            g.warning("ignoring non-pickleable value", ua, "in", p.h)
            return ''
        catch Exception
            g.error("pd.pickle: unexpected exception in", p.h)
            g.es_exception()
            return ''
    //@+node:felix.20230424003144.41: *5* pd.unpickle
    /**
     * Unhexlify and unpickle string s into p.
     */
    public unpickle(s: string) -> Any:  // An actual uA.
   
        try
            // Throws TypeError if s is not a hex string.
            bin = binascii.unhexlify(g.toEncodedString(s))
            return pickle.loads(bin)
        catch Exception
            g.es_exception()
            return None
    //@+node:felix.20230424003144.42: *4* pd.unls...
    //@+node:felix.20230424003144.43: *5* pd.drop_unl_parent/tail
    /**
     * Drop the penultimate part of the unl.
     */
    public drop_unl_parent(unl: string): string
   
        aList = unl.split('-->')
        return '-->'.join(aList[:-2] + aList[-1:])

    /**
     * Drop the last part of the unl.
     */
        public drop_unl_tail(unl: string): string
   
        return '-->'.join(unl.split('-->')[:-1])
    //@+node:felix.20230424003144.44: *5* pd.relative_unl
    /**
     * Return the unl of p relative to the root position.
     */
    public relative_unl(p: Position, root: Position): string
   
        result = []
        for p in p.self_and_parents(copy=False)
            if p == root
                break
            else
                result.append(self.expected_headline(p))
        return '-->'.join(reversed(result))
    //@+node:felix.20230424003144.45: *5* pd.unl
    /**
     * Return the unl corresponding to the given position.
     */
    public unl(p: Position): string
   
        return '-->'.join(reversed(
            [self.expected_headline(p2) for p2 in p.self_and_parents(copy=False)]))
    //@+node:felix.20230424003144.46: *5* pd.unl_tail
    /**
     * Return the last part of a unl.
     */
    public unl_tail(unl: string): string
   
        return unl.split('-->').slice(0, -1)[0];
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
