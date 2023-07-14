//@+leo-ver=5-thin
//@+node:felix.20211212162627.1: * @file src/commands/editFileCommands.ts
/**
 * Leo's file-editing commands.
 */
//@+<< editFileCommands imports & annotations >>
//@+node:felix.20230709010558.1: ** << editFileCommands imports & annotations >>
import * as difflib from "difflib";
import * as g from '../core/leoGlobals';
import { new_cmd_decorator } from "../core/decorators";
import { BaseEditCommandsClass } from './baseCommands';
import { Commands } from "../core/leoCommands";
import { Position, VNode } from "../core/leoNodes";

//@-<< editFileCommands imports & annotations >>

//@+others
//@+node:felix.20230709204504.1: ** editFileCommands.cmd (decorator)
/**
 * Command decorator for the editCommandsClass class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c', 'editFileCommands']);
}
//@+node:felix.20230709010603.1: ** class ConvertAtRoot
/**
 * A class to convert @root directives to @clean nodes:
 *
 * - Change @root directive in body to @clean in the headline.
 * - Make clones of section references defined outside of @clean nodes,
 *   moving them so they are children of the nodes that reference them.
 */
export class ConvertAtRoot {
    
    public errors = 0;
    public root: Position | undefined;  // Root of @root tree.
    public root_pat = /^@root\s+(.+)$/gm;
    public section_pat = /\s*<\<(.*)>\>/;
    public units: Position[] = [];  // List of positions containing @unit.

    constructor(){}

    //@+others
    //@+node:felix.20230709010603.2: *3* atRoot.check_move
    /**
     * Return False if p or any of p's descendants is a clone of parent
     * or any of parents ancestors.
     */
    public check_clone_move(p_p: Position, parent: Position): boolean {
      
        // Like as checkMoveWithParentWithWarning without warning.
        const clonedVnodes: {[key:string]: VNode} = {};
        for (const ancestor of parent.self_and_parents(false)){
            if (ancestor.isCloned()){
                const v = ancestor.v;
                clonedVnodes[v.gnx] = v;
            }
        }
        if(  Object.keys(clonedVnodes).length === 0){
            return true;
        }
        for( const p of p_p.self_and_subtree(false)){
            if( p.isCloned() && clonedVnodes[p.v.gnx]){
                return false;
            }
        }
        return true;
    }
    //@+node:felix.20230709010603.3: *3* atRoot.convert_file
    /**
     * Convert @root to @clean in the the .leo file at the given path.
     */
    public convert_file(c: Commands): void {
        this.find_all_units(c);
        for (const p of c.all_positions()){
            const m = this.root_pat.exec(p.b)
            const path = m && m.length && m[1];
            if (path){
                // Weird special case. Don't change section definition!
                if( this.section_pat.test(p.h) ){
                    console.log(`\nCan not create @clean node: ${p.h}\n`);
                    this.errors += 1;
                }else{
                    this.root = p.copy();
                    p.h = `@clean ${path}`;
                }
                this.do_root(p);
                this.root = undefined;
            }
        }
        //
        // Check the results.
        const link_errors = c.checkOutline(true);
        this.errors += link_errors;
        console.log(`${this.errors} error${g.plural(this.errors)} in ${c.shortFileName()}`);
        c.redraw();
        // if not this.errors: this.dump(c)
    }
    //@+node:felix.20230709010603.4: *3* atRoot.dump
    public dump(c: Commands): void {
        console.log(`Dump of ${c.shortFileName()}...`);
        for (const p of c.all_positions()){
            console.log(' '.repeat( 2 * p.level()), p.h);
        }
    }
    //@+node:felix.20230709010603.5: *3* atRoot.do_root
    /**
     * Make all necessary clones for section definitions.
     */
    public do_root(p: Position): void {
        for (const w_p of p.self_and_subtree()){
            this.make_clones(w_p);
        }
    }
    //@+node:felix.20230709010603.6: *3* atRoot.find_all_units
    /**
     * Scan for all @unit nodes.
     */
    public find_all_units(c: Commands): void {
        for (const p of c.all_positions()){
            if (p.b.includes('@unit')){
                this.units.push(p.copy());
            }
        }
    }
    //@+node:felix.20230709010603.7: *3* atRoot.find_section
    /**
     * Find the section definition node in root's subtree for the given section.
     */
    public find_section(root: Position, section_name: string): Position | undefined {
        
        const munge = (s: string) => {
            return s.trim().replace(/ /g, '').toLowerCase();
        };

        for( const p of root.subtree()){
            if( munge(p.h).startsWith(munge(section_name))){
                return p;
            }
        }

        return undefined;

    }
    //@+node:felix.20230709010603.8: *3* atRoot.make_clones
    /**
     * Make clones for all undefined sections in p.b.
     */
    public make_clones(p: Position): void {
        for (const s of g.splitLines(p.b)){
            const m = this.section_pat.exec(s);
            if (m && m.length){
                const section_name = g.angleBrackets(m[1].trim());
                const section_p = this.make_clone(p, section_name);
                if (!section_p || !section_p.__bool__()){
                    console.log(`MISSING: ${section_name} ${p.h}`);
                    this.errors += 1;
                }
            }
        }
    }
    //@+node:felix.20230709010603.9: *3* atRoot.make_clone
    /**
     * Make c clone for section, if necessary.
     */
    public make_clone(p: Position, section_name: string): Position | undefined {
        

        const clone_and_move = (parent: Position, section_p: Position) => {
            const clone = section_p.clone();
            if( this.check_clone_move(clone, parent)){
                console.log(`  CLONE: ${section_p.h} parent: ${parent.h}`);
                clone.moveToLastChildOf(parent);
            }else{
                console.log(`Can not clone: ${section_p.h} parent: ${parent.h}`);
                clone.doDelete();
                this.errors += 1;
            }
        }
        //
        // First, look in p's subtree.
        const section_p = this.find_section(p, section_name)
        if (section_p && section_p.__bool__()){
            // g.trace('FOUND', section_name)
            // Already defined in a good place.
            return section_p
        }
        //
        // Finally, look in the @unit tree.
        for (const unit_p of this.units){
            const section_p = this.find_section(unit_p, section_name);
            if (section_p  && section_p.__bool__()){
                clone_and_move(p, section_p);
                return section_p;
            }
        }
        return undefined;

    }
    //@-others

}
//@+node:felix.20230710235646.1: ** class CompareTreesController

class CompareTreesController {

        public c: Commands | undefined;

        //@+others
        //@+node:felix.20230710235646.2: *3* ct.compare
        /**
         * Compare dicts d1 and d2.
         */
        public compare(
            d1: {[key:string]: Position},
            d2: {[key:string]: Position},
            root: Position,
        ): Position {
            
            let p: Position;
            let p1: Position;
            let p2: Position;

            for (const h of Object.keys(d1).sort()){
                [p1, p2] = [d1[h], d2[h]];
                if (d2[h]){
                    const [lines1, lines2] = [g.splitLines(p1.b), g.splitLines(p2.b)];
                    // const aList = list(difflib.unified_diff(lines1, lines2, 'vr1', 'vr2'))
                    const aList = difflib.unifiedDiff(lines1, lines2, {fromfile: 'vr1', tofile: 'vr2'});
                    if (aList && aList.length){
                        p = root.insertAsLastChild();
                        p.h = h;
                        p.b = aList.join('');
                        p1.clone().moveToLastChildOf(p);
                        p2.clone().moveToLastChildOf(p);
                    }
                } else if (p1.b.trim()){
                    // Only in p1 tree, and not an organizer node.
                    p = root.insertAsLastChild();
                    p.h = h + `(${p1.h} only)`;
                    p1.clone().moveToLastChildOf(p);
                }
            }
            for(const h of Object.keys(d2).sort()){
                p2 = d2[h];
                if (!d1[h] && p2.b.trim()){
                    // Only in p2 tree, and not an organizer node.
                    p = root.insertAsLastChild();
                    p.h = h + `(${p2.h} only)`;
                    p2.clone().moveToLastChildOf(p);
                }

            }
            return root;

        }
        //@+node:felix.20230710235646.3: *3* ct.run
        /**
         * Main line.
         */
        public run(c: Commands, p1: Position, p2: Position, tag: string): void {
            
            this.c = c;
            const root = c.p.insertAfter();
            root.h = tag;
            const d1 = this.scan(p1);
            const d2 = this.scan(p2);
            this.compare(d1, d2, root);
            c.p.contract();
            root.expand();
            c.selectPosition(root);
            c.redraw();

        }
        //@+node:felix.20230710235646.4: *3* ct.scan
        /** 
         * Create a dict of the methods in p1.
         * Keys are headlines, stripped of prefixes.
         * Values are copies of positions.
         */
        public scan(p1: Position): {[key:string]: Position} {
         
            const d: {[key:string]: Position} = {};
            for (const p of p1.self_and_subtree(false)){
                let h = p.h.trim();
                const i = h.indexOf('.');
                if (i > -1){
                    h = h.substring(i + 1).trim()
                }
                if( d[h]){
                    g.es_print('duplicate', p.h);
                }else{
                    d[h] = p.copy();
                }
            }
            return d;

        }
        //@-others
    
}
//@+node:felix.20230709010427.1: ** class EditFileCommandsClass
/**
 * A class to load files into buffers and save buffers to files.
 */
export class EditFileCommandsClass extends BaseEditCommandsClass {
    
    //@+others
    //@+node:felix.20230709010427.2: *3* efc.convert-at-root
    @cmd('convert-at-root', 'The convert-at-root command converts @root to @clean throughout the outline.')
    public convert_at_root(): void {
        //@+<< convert-at-root docstring >>
        //@+node:felix.20230709010427.3: *4* << convert-at-root docstring >>
        //@@wrap
        /*
        The convert-at-root command converts @root to @clean throughout the outline.

        This command is not perfect. You will need to adjust the outline by hand if
        the command reports errors. I recommend using git diff to ensure that the
        resulting external files are roughly equivalent after running this command.

        This command attempts to do the following:

        - For each node with an @root <path> directive in the body, change the head to
          @clean <path>. The command does *not* change the headline if the node is
          a section definition node. In that case, the command reports an error.

        - Clones and moves nodes as needed so that section definition nodes appear
          as descendants of nodes containing section references. To find section
          definition nodes, the command looks in all @unit trees. After finding the
          required definition node, the command makes a clone of the node and moves
          the clone so it is the last child of the node containing the section
          references. This move may fail. If so, the command reports an error.
        */
        //@-<< convert-at-root docstring >>
        const c = this.c;
        if (!c){
            return;
        }
        new ConvertAtRoot().convert_file(c);
    }
    //@+node:felix.20230709010427.4: *3* efc.clean-at-clean commands
    //@+node:felix.20230709010427.5: *4* efc.cleanAtCleanFiles
    @cmd(
        'clean-at-clean-files',
        'Adjust whitespace in all @clean files.'
        )
    public cleanAtCleanFiles(): void {
        
        const c = this.c;
        const undoType = 'clean-@clean-files'
        c.undoer.beforeChangeGroup(c.p, undoType, true);
        let total = 0;
        for (const p of c.all_unique_positions()){
            if (
                g.match_word(p.h, 0, '@clean') &&
                (p.h.trimEnd().endsWith('py') || p.h.trimEnd().endsWith( 'pyw'))
            ){
                let n = 0;
                for (const p2 of p.subtree()){
                    const bunch2 = c.undoer.beforeChangeNodeContents(p2);;
                    if (this.cleanAtCleanNode(p2, undoType)){
                        n += 1;
                        total += 1;
                        c.undoer.afterChangeNodeContents(p2, undoType, bunch2);
                    }
                }
                g.es_print(`${n} node${g.plural(n)} ${p.h}`);
            }
        }

        // Call this only once, at end.
        c.undoer.afterChangeGroup(c.p, undoType);
        if (total === 0){
            g.es("Command did not find any whitespace to adjust");
        }
        g.es_print(`${total} total node${g.plural(total)}`);

    }
    //@+node:felix.20230709010427.6: *4* efc.cleanAtCleanNode
    /**
     * Adjust whitespace in p, part of an @clean tree.
     */
    public cleanAtCleanNode(p: Position, undoType: string): boolean {
        
        const s = p.b.trim();
        if (!s || p.h.trim().startsWith('<<')){
            return false;
        }
        const ws = g.match_word(s, 0, 'class') ? '\n\n' : '\n';
        const s2 = ws + s + ws;
        const changed = s2 !== p.b;
        if (changed){
            p.b = s2;
            p.setDirty();
        }
        return changed;

    }
    //@+node:felix.20230709010427.7: *4* efc.cleanAtCleanTree
    @cmd(
        'clean-at-clean-tree',
        'Adjust whitespace in the nearest @clean tree,' +
        'searching c.p and its ancestors.'
        )
    public cleanAtCleanTree(): void {

        const c = this.c;
        let w_p: Position|undefined;
        // Look for an @clean node.
        let found = false;
        for (const p of c.p.self_and_parents(false)){
            w_p = p;
            if (g.match_word(p.h, 0, '@clean') && (p.h.trimEnd().endsWith('py') || p.h.trimEnd().endsWith('pyw'))){
                found = true;
                break;
            }
        }
        if(!found){
            g.es_print('no an @clean node found', w_p?.h);
            return;
        }
        // pylint: disable=undefined-loop-variable
        // w_p is certainly defined here.
        const bunch = c.undoer.beforeChangeTree(w_p!);
        let n = 0;
        const undoType = 'clean-@clean-tree';
        for(const p2 of w_p!.subtree()){
            if (this.cleanAtCleanNode(p2, undoType)){
                n += 1;
            }
        }
        if( n > 0){
            c.setChanged();
            c.undoer.afterChangeTree(w_p!, undoType, bunch);
        }
        g.es_print(`${n} node${g.plural(n)} cleaned`);

    }
    //@+node:felix.20230709010427.8: *3* efc.compareAnyTwoFiles & helpers
    @cmd(
        'file-compare-two-leo-files',
        'Compare two files.'
        )
    @cmd(
        'compare-two-leo-files',
        'Compare two files.'
        )
    public async compareAnyTwoFiles(): Promise<unknown> {
        const c = this.c;
        let c1 = this.c;
        let c2: Commands | undefined = this.c;
        const w = c.frame.body.wrapper;
        const commanders = g.app.commanders();
        if (g.app.diff){
            if (commanders.length === 2){
                [c1, c2] = commanders;
                const fn1 = g.shortFileName(c1.wrappedFileName) || c1.shortFileName();
                const fn2 = g.shortFileName(c2.wrappedFileName) || c2.shortFileName();
                g.es('--diff auto compare');
                g.es(fn1);
                g.es(fn2);
            }else{
                g.es('expecting two .leo files')
                return;
            }
        }else{
            // Prompt for the file to be compared with the present outline.
            const filetypes:[string, string][] = [["Leo files", "*.leo *.leojs *.db"], ["All files", "*"]];
            const fileName = await g.app.gui.runOpenFileDialog(
                c,
                "Compare Leo Files",
                filetypes,
                '.leo'
            ) as string;
            if (!fileName){
                return;
            }
            // Read the file into the hidden commander.
            c2 = await g.createHiddenCommander(fileName);
            if (!c2){
                return;
            }
        }
        // Compute the inserted, deleted and changed dicts.
        const d1 = this.createFileDict(c1);
        const d2 = this.createFileDict(c2);
        const [inserted, deleted, changed] = this.computeChangeDicts(d1, d2);
        // Create clones of all inserted, deleted and changed dicts.
        this.createAllCompareClones(c1, c2, inserted, deleted, changed);
        // Fix bug 1231656: File-Compare-Leo-Files leaves other file open-count incremented.
        if (!g.app.diff){
            g.app.forgetOpenFile(c2.fileName());
            c2.frame.destroySelf();
            g.app.gui.set_focus(c, w);
        }

    }
    //@+node:felix.20230709010427.9: *4* efc.computeChangeDicts
    /**
     * Compute inserted, deleted, changed dictionaries.
     *
     * New in Leo 4.11: show the nodes in the *invisible* file, d2, if possible.
     */
    public computeChangeDicts(
            d1: {[key:string]: Position},
            d2: {[key:string]: Position}
        ): [
            {[key:string]: Position},
            {[key:string]: Position},
            {[key:string]: Position}
        ]{
        
        const inserted: {[key:string]: Position} = {};
        for (const key in d2){ // using 'in' for keys !
            
            if (!d1.hasOwnProperty(key)){
                inserted[key] = d2[key];
            }
        }

        const deleted : {[key:string]: Position} = {};
        for (const key in d1){
            if (!d2.hasOwnProperty(key)){
                deleted[key] = d1[key];
            }
        }

        const changed : {[key:string]: Position} = {};
        for (const key in d1){
            if (d2.hasOwnProperty(key)){
                const p1 = d1[key];
                const p2 = d2[key];
                if (p1.h !== p2.h || p1.b !== p2.b){
                    changed[key] = p2;  // Show the node in the *other* file.
                }
            }
        }
        return [inserted, deleted, changed];

    }
    //@+node:felix.20230709010427.10: *4* efc.createAllCompareClones & helper
    /**
     * Create the comparison trees.
     */
    public createAllCompareClones(
        c1: Commands,
        c2: Commands,
        inserted: {[key:string]: Position},
        deleted: {[key:string]: Position},
        changed: {[key:string]: Position},
    ): void {
        
        const c = this.c;  // Always use the visible commander
        console.assert( c === c1);
        // Create parent node at the start of the outline.
        const [u, undoType] = [c.undoer, 'Compare Two Files'];
        u.beforeChangeGroup(c.p, undoType);
        const undoData = u.beforeInsertNode(c.p);
        const parent = c.p.insertAfter();
        parent.setHeadString(undoType);
        u.afterInsertNode(parent, undoType, undoData);
        // Use the wrapped file name if possible.
        const fn1 = g.shortFileName(c1.wrappedFileName) || c1.shortFileName();
        const fn2 = g.shortFileName(c2.wrappedFileName) || c2.shortFileName();
        const table: [{[key:string]: Position}, string][] = [
            [deleted, `not in ${fn2}`],
            [inserted, `not in ${fn1}`],
            [changed, `changed: as in ${fn2}`],
        ];
        for (const [d, kind] of table){
            this.createCompareClones(d, kind, parent);
        }
        c.selectPosition(parent);
        u.afterChangeGroup(parent, undoType);
        c.redraw();

    }
    //@+node:felix.20230709010427.11: *5* efc.createCompareClones
    public createCompareClones(
            d: {[key: string]: Position},
            kind: string,
            parent: Position
        ): void {

        if (d && Object.keys(d).length){
            const c = this.c;  // Use the visible commander.
            parent = parent.insertAsLastChild();
            parent.setHeadString(kind);
            for (const key in d){ 
                const p = d[key];
                if (!kind.endsWith('.leo') && p.isAnyAtFileNode()){
                    // Don't make clones of @<file> nodes for wrapped files.
                    // pass
                }else if (p.v.context === c){
                    const clone = p.clone();
                    clone.moveToLastChildOf(parent);
                }else{
                    // Fix bug 1160660: File-Compare-Leo-Files creates "other file" clones.
                    const copy = p.copyTreeAfter();
                    copy.moveToLastChildOf(parent);
                    for (const p2 of copy.self_and_subtree(false)){
                        p2.v.context = c;
                    }
                }
            }
        }

    }
    //@+node:felix.20230709010427.12: *4* efc.createFileDict
    /**
     * Create a dictionary of all relevant positions in commander c.
     */
    public createFileDict(c: Commands): {[key:string]: Position} {
        const d: {[key:string]: Position} = {};
        for (const p of c.all_positions()){
            d[p.v.fileIndex] = p.copy();
        }
        return d;
    }
    //@+node:felix.20230709010427.13: *4* efc.dumpCompareNodes
    public dumpCompareNodes(
        fileName1: string,
        fileName2: string,
        inserted: {[key:string]: Position},
        deleted: {[key:string]: Position},
        changed: {[key:string]: Position},
    ): void {
        const table: [ {[key:string]: Position}, string][] =  [
            [inserted, `inserted (only in ${fileName1})`],
            [deleted, `deleted  (only in ${fileName2})`],
            [changed, 'changed'],
        ];
        for (const [d, kind] of table){
            g.pr('\n', kind);
            for (const key in d){
                const p = d[key];
                g.pr(`${key} ${p.h}`);
            }
        }

    }
    //@+node:felix.20230709010427.14: *3* efc.compareTrees
    public compareTrees(p1: Position, p2: Position, tag: string): void {

        new CompareTreesController().run(this.c, p1, p2, tag);

    }
    //@+node:felix.20230709010427.18: *3* efc.deleteFile
    @cmd(
        'file-delete',
        'Prompt for the name of a file and delete it.'
    )
    public async deleteFile(): Promise<void> {

        // TODO : redo with text input!

        const fileName = await g.app.gui.runOpenFileDialog(
            this.c,
            'Delete File: ',
            [["All files", "*"]],
            ""
        ) as string;

        try{
            await g.os_remove(fileName);
            await g.setStatusLabel(`Deleted: ${fileName}`)
        }
        catch (e){
            await  g.setStatusLabel(`Not Deleted: ${fileName}`)
        }

        /*
            k = this.c.k
            k.setLabelBlue('Delete File: ')
            k.extendLabel(os.getcwd() + os.sep)
            k.get1Arg(event, handler=this.deleteFile1)

        def deleteFile1(self, event: Event) -> None:
            k = this.c.k
            k.keyboardQuit()
            k.clearState()
            try:
                os.remove(k.arg)
                k.setStatusLabel(f"Deleted: {k.arg}")
            except Exception:
                k.setStatusLabel(f"Not Deleted: {k.arg}")
        */


    }
    //@+node:felix.20230709010427.19: *3* efc.diff (file-diff-files)
    @cmd(
        'file-diff-files',
        'Creates a node and puts the diff between 2 files into it.'
    )
    public async diff(): Promise<void> {
        const c = this.c;
        const fn = await this.getReadableTextFile();
        if (!fn){
            return;
        }
        const fn2 =  await this.getReadableTextFile();
        if (!fn2){
            return;
        }
        const [s1, e1] = await g.readFileIntoString(fn);
        if (s1 == null){
            return;
        }
        const [s2, e2] = await g.readFileIntoString(fn2);
        if (s2 == null){
            return;
        }
        const [lines1, lines2] = [g.splitLines(s1), g.splitLines(s2)];
        const aList = difflib.ndiff(lines1, lines2);
        const p = c.p.insertAfter();
        p.h = 'diff';
        p.b = aList.join('');
        c.redraw();
    }
    //@+node:felix.20230709010427.20: *3* efc.getReadableTextFile
    /**
     * Prompt for a text file.
     */
    public async getReadableTextFile(): Promise<string> {
        
        const c = this.c;
        const fn = await g.app.gui.runOpenFileDialog(
            c,
            'Open Text File',
            [["Text", "*.txt"], ["All files", "*"]],
            ".txt"
        ) as string;

        return fn;

    }
    //@+node:felix.20230709010427.21: *3* efc.gitDiff (gd & git-diff)
    @cmd('git-diff', 'Produce a Leonine git diff.')
    @cmd('gd', 'Produce a Leonine git diff.')
    public gitDiff() : void {// 2020/07/18, for leoInteg.
        
        new GitDiffController(this.c).git_diff('HEAD');

    }
    //@+node:felix.20230709010427.22: *3* efc.gitDiffPR (git-diff-pr & git-diff-pull-request)
    @cmd('git-diff-pull-request', 'Produce a Leonine diff of pull request in the current branch.')
    @cmd('git-diff-pr', 'Produce a Leonine diff of pull request in the current branch.')
    public gitDiffPullRequest(): void {
        
        new GitDiffController(this.c).diff_pull_request();

    }
    //@+node:felix.20230709010427.23: *3* efc.insertFile
    @cmd('file-insert', 'Prompt for the name of a file and put the selected text into it.')
    public async insertFile(): Promise<void> {
        
        const w = this.editWidget();
        if (!w){
            return;
        }
        const fn = await this.getReadableTextFile();
        if (!fn){
            return;
        }
        const [s, e] = await g.readFileIntoString(fn);
        if (s){
            this.beginCommand(w, 'insert-file');
            const i = w.getInsertPoint();
            w.insert(i, s);
            w.seeInsertPoint();
            this.endCommand(undefined, true, true);
        }
    }
    //@+node:felix.20230709010427.24: *3* efc.makeDirectory
    @cmd('directory-make', 'Prompt for the name of a directory and create it.')
    public async makeDirectory(): Promise<void> {


        // TODO : REDO WITH TEXT INPUT !

         const folderName = await g.app.gui.runSaveFileDialog(
                this.c,
                'Make Directory: ',
                [["All files", "*"]],
                ""
            ) as string;

            try{
                await g.mkdir(folderName);
                await g.setStatusLabel(`Created: ${folderName}`);
            }
            catch (e){
                await g.setStatusLabel(`Not Created: ${folderName}`);
            }

        /*
            k = this.c.k
            k.setLabelBlue('Make Directory: ')
            k.extendLabel(os.getcwd() + os.sep)
            k.get1Arg(event, handler=this.makeDirectory1)

        def makeDirectory1(self, event: Event) -> None:
            k = this.c.k
            k.keyboardQuit()
            k.clearState()
            try:
                os.mkdir(k.arg)
                k.setStatusLabel(f"Created: {k.arg}")
            except Exception:
                k.setStatusLabel(f"Not Created: {k.arg}")
        */


    }
    //@+node:felix.20230709010427.25: *3* efc.openOutlineByName
    @cmd('file-open-by-name', 'file-open-by-name: Prompt for the name of a Leo outline and open it.')
    public async openOutlineByName(): Promise<void> {
        
        // TODO WITH TEXT INPUT !!
        //
        return Promise.resolve();

        /*
            c, k = this.c, this.c.k
            fileName = ''.join(k.givenArgs)
            // Bug fix: 2012/04/09: only call g.openWithFileName if the file exists.
            if fileName and g.os_path_exists(fileName):
                g.openWithFileName(fileName, old_c=c)
            else:
                k.setLabelBlue('Open Leo Outline: ')
                k.getFileName(event, callback=this.openOutlineByNameFinisher)

        public openOutlineByNameFinisher(self, fn: str): void
            const c = this.c;
            if fn and g.os_path_exists(fn) and not g.os_path_isdir(fn):
                c2 = g.openWithFileName(fn, old_c=c)
                try:
                    g.app.gui.runAtIdle(c2.treeWantsFocusNow)
                except Exception:
                    pass
            else:
                g.es(f"ignoring: {fn}")
        */


    }
    //@+node:felix.20230709010427.26: *3* efc.removeDirectory
    @cmd('directory-remove', 'Prompt for the name of a directory and delete it.')
    public async removeDirectory(): Promise<void> {
        
        // TODO WITH TEXT INPUT !!

        /*    
            k = this.c.k
            k.setLabelBlue('Remove Directory: ')
            k.extendLabel(os.getcwd() + os.sep)
            k.get1Arg(event, handler=this.removeDirectory1)

        public removeDirectory1(): void
            k = this.c.k
            k.keyboardQuit()
            k.clearState()
            try:
                os.rmdir(k.arg)
                k.setStatusLabel(f"Removed: {k.arg}")
            except Exception:
                k.setStatusLabel(f"Not Removed: {k.arg}")
        */

    }
    //@+node:felix.20230709010427.27: *3* efc.saveFile (save-file-by-name)
    @cmd('file-save-by-name', 'Prompt for the name of a file and put the body text of the selected node into it..')
    @cmd('save-file-by-name', 'Prompt for the name of a file and put the body text of the selected node into it..')
    public async saveFile(): Promise<void> {

        const c = this.c;
        const w = this.editWidget();
        if (!w){
            return;
        }
        const fileName =  await g.app.gui.runSaveFileDialog(c,
            'save-file',
            [["Text", "*.txt"], ["All files", "*"]],
            ".txt") as string;
        if (fileName){
            try{
                const s = w.getAllText();
                await g.writeFile(s, 'utf-8', fileName);
                // with open(fileName, 'w') as f:
                //     f.write(s)
            }catch (IOError){
                g.es('can not create', fileName);
            }
        }
    }
    //@+node:felix.20230709010427.28: *3* efc.toggleAtAutoAtEdit & helpers
    @cmd('toggle-at-auto-at-edit', 'Toggle between @auto and @edit, preserving insert point, etc.')
    public async toggleAtAutoAtEdit(): Promise< void> {
        
        const p = this.c.p;
        if (p.isAtEditNode()){
            await this.toAtAuto(p);
            return;
        }
        for (const w_p of p.self_and_parents()){
            if (w_p.isAtAutoNode()){
                await this.toAtEdit(w_p);
                return;
            }
        }
        g.es_print('Not in an @auto or @edit tree.');

    }
    //@+node:felix.20230709010427.29: *4* efc.toAtAuto
    /**
     * Convert p from @edit to @auto.
     */
    public async toAtAuto(p: Position): Promise<void> {
        const c = this.c;
        // Change the headline.
        p.h = '@auto' + p.h.substring(5);
        // Compute the position of the present line within the file.
        const w = c.frame.body.wrapper;
        const ins = w.getInsertPoint();
        let [row, col] = g.convertPythonIndexToRowCol(p.b, ins);
        // Ignore *preceding* directive lines.
        const directives = g.splitLines(c.p.b).slice(0, row).filter(z => g.isDirective(z));
        row -= directives.length;
        row = Math.max(0, row);
        // Reload the file, creating new nodes.
        c.selectPosition(p);
        await c.refreshFromDisk();
        // Restore the line in the proper node.
        await c.gotoCommands.find_file_line(row + 1);
        p.setDirty();
        c.setChanged();
        c.redraw();
        c.bodyWantsFocus();
    }
    //@+node:felix.20230709010427.30: *4* efc.toAtEdit
    /**
     * Convert p from @auto to @edit.
     */
    public async toAtEdit(p: Position): Promise<void> {
        
        const c = this.c;
        const w = c.frame.body.wrapper;
        p.h = '@edit' + p.h.substring(5);
        // Compute the position of the present line within the *selected* node c.p
        let ins = w.getInsertPoint();
        let [row, col] = g.convertPythonIndexToRowCol(c.p.b, ins);
        // Ignore directive lines.
        const directives = g.splitLines(c.p.b).slice(0, row).filter(z => g.isDirective(z));
        row -= directives.length;
        row = Math.max(0, row);
        // Count preceding lines from p to c.p, again ignoring directives.
        for( const p2 of p.self_and_subtree(false)){
            if (p2.__eq__(c.p)){
                break;
            }
            const lines = g.splitLines(p2.b).filter(z => !g.isDirective(z));
            row += lines.length;
        }
        // Reload the file into a single node.
        c.selectPosition(p);
        await c.refreshFromDisk();
        // Restore the line in the proper node.
        ins = g.convertRowColToPythonIndex(p.b, row + 1, 0);
        w.setInsertPoint(ins);
        p.setDirty();
        c.setChanged();
        c.redraw();
        c.bodyWantsFocus();

    }
    //@-others

}
//@+node:felix.20230709010434.1: ** class GitDiffController
/**
 * A class to do git diffs.
 */
export class GitDiffController {
    
    public c: Commands;
    public file_node: Position | undefined;
    public root: Position | undefined;

    constructor(c: Commands){
        this.c = c;
        this.file_node = undefined;
        this.root = undefined;
    }

    //@+others
    //@+node:felix.20230709010434.2: *3* gdc.Entries...
    //@+node:felix.20230709010434.3: *4* gdc.diff_file
    /**
     * Create an outline describing the git diffs for fn.
     */
    public async diff_file(fn: string, rev1 = 'HEAD', rev2 = ''): void {
        // Common code.
        const c = this.c;
        // #1781, #2143
        const directory = this.get_directory();
        if (!directory){
            return;
        }
        const s1 = await this.get_file_from_rev(rev1, fn);
        const s2 = await this.get_file_from_rev(rev2, fn);
        const lines1 = g.splitLines(s1);
        const lines2 = g.splitLines(s2);
        const diff_list = difflib.unifiedDiff(
            lines1,
            lines2,
            {fromfile:rev1 || 'uncommitted', tofile: rev2 || 'uncommitted'}
        );
        diff_list.unshift('@ignore\n@nosearch\n@language patch\n');
        this.file_node = this.create_file_node(diff_list, fn);
        // #1777: The file node will contain the entire added/deleted file.
        if (!s1){
            this.file_node.h = `Added: ${this.file_node.h}`;
            return;
        }
        if( !s2){
            this.file_node.h = `Deleted: ${this.file_node.h}`;
            return;
        }
        // Finish.
        const w_path = g.finalize_join(directory, fn);  // #1781: bug fix.
        let c1: Commands | undefined;
        let c2: Commands | undefined;
        if (fn.endsWith('.leo')){
            c1 = await this.make_leo_outline(fn, w_path, s1, rev1);
            c2 = await this.make_leo_outline(fn, w_path, s2, rev2);
        }else{
            const root = this.find_file(fn);
            if (await c.looksLikeDerivedFile(w_path)){
                c1 = this.make_at_file_outline(fn, s1, rev1);
                c2 = this.make_at_file_outline(fn, s2, rev2);
            }else if (root){
                c1 = await this.make_at_clean_outline(fn, root, s1, rev1);
                c2 = await this.make_at_clean_outline(fn, root, s2, rev2);
            }
        }
        if (c1 && c2){
            this.make_diff_outlines(c1, c2, fn, rev1, rev2);
            this.file_node.b = 
                `${this.file_node.b.trimEnd()}\n` +
                `@language ${c2.target_language}\n`;
        }
    }
    //@+node:felix.20230709010434.4: *4* gdc.diff_pull_request
    /**
     * Create a Leonine version of the diffs that would be
     * produced by a pull request between two branches.
     */
    public diff_pull_request(): void {
        const directory = this.get_directory();
        if (!directory){
            return;
        }
        const aList = g.execGitCommand("git rev-parse devel", directory);
        if( aList && aList.length){
            let devel_rev = aList[0];
            devel_rev = devel_rev.slice(0, 8);
            g.trace('devel_rev', devel_rev);
            this.diff_two_revs(
                devel_rev,  // Before: Latest devel commit.
                'HEAD',  // After: Latest branch commit
            );
        }else{
            g.es_print('FAIL: git rev-parse devel');
        }
    }
    //@+node:felix.20230709010434.5: *4* gdc.diff_two_branches
    /**
     * Create an outline describing the git diffs for fn.
     */
    public async diff_two_branches(branch1: string, branch2: string, fn: string): Promise<void> {
        
        const c = this.c;
        if (!this.get_directory()){
            return;
        }
        const p = c.lastTopLevel().insertAfter();
        this.root = p;
        p.h = `git-diff-branches ${branch1} ${branch2}`;
        const s1 = this.get_file_from_branch(branch1, fn);
        const s2 = this.get_file_from_branch(branch2, fn);
        const lines1 = g.splitLines(s1);
        const lines2 = g.splitLines(s2);
        const diff_list = difflib.unifiedDiff(lines1, lines2, {fromfile:branch1, tofile: branch2});
        diff_list.unshift('@ignore\n@nosearch\n@language patch\n');

        this.file_node = this.create_file_node(diff_list, fn);
        let c1,         c2;
        if (await c.looksLikeDerivedFile(fn)){
            c1 = this.make_at_file_outline(fn, s1, branch1);
            c2 = this.make_at_file_outline(fn, s2, branch2);
        }else{
            const root = this.find_file(fn);
            if( root){
                c1 = this.make_at_clean_outline(fn, root, s1, branch1);
                c2 = this.make_at_clean_outline(fn, root, s2, branch2);
            }else{
                c1 =  undefined;
                c2 = undefined;
            }
        }
        if( c1 && c2){
            this.make_diff_outlines(c1, c2, fn);
            this.file_node.b = `${this.file_node.b.rstrip()}\n@language ${c2.target_language}\n`;
        }
        this.finish();

    }
    //@+node:felix.20230709010434.6: *4* gdc.diff_two_revs
    /**
     * Create an outline describing the git diffs for all files changed
     * between rev1 and rev2.
     */
    public diff_two_revs(rev1 = 'HEAD', rev2 = ''): void{
       
        const [c, u] = [this.c, this.c.undoer];

        if (!this.get_directory()){
            return;
        }
        // Get list of changed files.
        const files = this.get_files(rev1, rev2);
        const n =files.length;
        let  message = `diffing ${n} file${g.plural(n)}`;
        if( n > 5){
            message += ". This may take awhile...";
        }
        g.es_print(message);

        const  undoType = 'Git Diff';
        c.selectPosition(c.lastTopLevel());  // pre-select to help undo-insert
        u.beforeChangeGroup(c.p, undoType);
        // Create the root node.
        let undoData = u.beforeInsertNode(c.p);  // c.p is subject of 'insertAfter'
        this.root = c.lastTopLevel().insertAfter();
        this.root.h = "git diff revs: {rev1} {rev2}";
        this.root.b = '@ignore\n@nosearch\n';
        u.afterInsertNode(this.root, 'Create diff root node', undoData);

        // Create diffs of all files.
        for (const fn of files){
            undoData = u.beforeChangeTree(this.root);
            this.diff_file(fn, rev1, rev2);
            u.afterChangeTree(this.root, undoType, undoData);
        }
        u.afterChangeGroup(c.p, undoType);
        
        this.finish();

    }
    //@+node:felix.20230709010434.7: *4* gdc.git_diff & helper
    /**
     * The main line of the git diff command.
     */
    public git_diff(rev1= 'HEAD', rev2 = ''): void {
        
        if (!this.get_directory()){
            return;
        }
        // Diff the given revs.
        let ok = this.diff_revs(rev1, rev2);
        if( ok){
            return;
        }
        // Go back at most 5 revs...
        let [n1, n2] = [1, 0];
        while (n1 <= 5){
            ok = this.diff_revs(
                `HEAD@{${n1}}`,
                `HEAD@{${n2}}`);

            if (ok){
                return;
            }
            [n1, n2] =[ n1 + 1, n2 + 1];
        }
        if (!ok){
            g.es_print('no changed readable files from HEAD@{1}..HEAD@{5}');
        }

    }
    //@+node:felix.20230709010434.8: *5* gdc.diff_revs
    /**
     * Diff all files given by rev1 and rev2.
     */
    public diff_revs(rev1: string, rev2: string): boolean {
        
        const files = this.get_files(rev1, rev2);
        if (files && files.length){
            const [c, u] = [this.c, this.c.undoer];
            const undoType = 'Git Diff';
            c.selectPosition(c.lastTopLevel())  // pre-select to help undo-insert
            u.beforeChangeGroup(c.p, undoType);

            this.root = this.create_root(rev1, rev2);  // creates it's own undo bead

            for (const fn of files){
                const undoData = u.beforeChangeTree(this.root);
                this.diff_file(fn,rev1,rev2);
                u.afterChangeTree(this.root, undoType, undoData);
            }
            u.afterChangeGroup(c.p, undoType);
            this.finish();
        }
        return !!files.length;

    }
    //@+node:felix.20230709010434.9: *3* gdc.Utils
    //@+node:felix.20230709010434.10: *4* gdc.create_compare_node
    /**
     * Create nodes describing the changes.
     */    
    public create_compare_node(
        c1: Commands,
        c2: Commands,
        d: {[key: string]: [VNode, VNode]| VNode},
        kind: string,
        rev1: string,
        rev2: string,
    ): void{
        if (!d || Object.keys(d).length === 0){
            return;
        }
        const parent = this.file_node!.insertAsLastChild();
        parent.setHeadString(`diff: ${kind}`);
        for (const key in d){
            if (kind.toLowerCase() === 'changed'){
                let [v1, v2 ]= d[key] as [VNode, VNode];
                // Organizer node: contains diff
                const organizer = parent.insertAsLastChild();
                organizer.h = `diff: ${v2.h}`;
                let body = difflib.unifiedDiff(
                    g.splitLines(v1.b),
                    g.splitLines(v2.b),
                    {fromfile: rev1 || 'uncommitted', tofile:   rev2 || 'uncommitted'}
                );
                if (body.join('').trim()){
                    body.unshift('@ignore\n@nosearch\n@language patch\n');
                    body.push(`@language ${c2.target_language}\n`);
                }else{
                    body = ['Only headline has changed'];
                }

                organizer.b = body.join('');
                // Node 2: Old node
                const p2 = organizer.insertAsLastChild();
                p2.h = 'Old:' + v1.h;
                p2.b = v1.b;
                // Node 3: New node
                console.assert( v1.fileIndex === v2.fileIndex);
                const p_in_c = this.find_gnx(this.c, v1.fileIndex);
                let p3;
                if (p_in_c){  // Make a clone, if possible.
                    p3 = p_in_c.clone();
                    p3.moveToLastChildOf(organizer);
                }else{
                    p3 = organizer.insertAsLastChild();
                    p3.h = 'New:' + v2.h;
                    p3.b = v2.b;
                }
            }else if (kind.toLowerCase() === 'added'){
                const v = d[key] as VNode;
                const new_p = this.find_gnx(this.c, v.fileIndex);
                let p: Position;
                if (new_p ){ // Make a clone, if possible.
                    p = new_p.clone();
                    p.moveToLastChildOf(parent);
                    // #2950: do not change p.b.
                }else{
                    p = parent.insertAsLastChild();
                    p.h = v.h;
                    p.b = v.b;
                }
            }else{
                const v = d[key] as VNode;
                const p = parent.insertAsLastChild();
                p.h = v.h;
                p.b = v.b;
            }
        }
    }

    //@+node:felix.20230709010434.11: *4* gdc.create_file_node
    /**
     * Create an organizer node for the file.
     */
    public create_file_node(diff_list: string[], fn: string) : Position{
        const p = this.root!.insertAsLastChild();
        p.h = 'diff: ' + fn.trim();
        p.b = diff_list.join('');
        return p;
    }
    //@+node:felix.20230709010434.12: *4* gdc.create_root
    /**
     * Create the top-level organizer node describing the git diff.
     */
    public create_root(rev1: string, rev2: string): Position{
        const [c, u] = [this.c, this.c.undoer];
        const undoType = 'Create diff root node';  // Same undoType is reused for all inner undos
        c.selectPosition(c.lastTopLevel());  // pre-select to help undo-insert
        const undoData = u.beforeInsertNode(c.p);  // c.p is subject of 'insertAfter'
        const [r1, r2] = [rev1 || '', rev2 || ''];
        const p = c.lastTopLevel().insertAfter();
        p.h = `git diff ${r1} ${r2}`;
        p.b = '@ignore\n@nosearch\n';
        if (r1 && r2){
            p.b += (
                `${r1}=${this.get_revno(r1)}\n` +
                `${r2}=${this.get_revno(r2)}`);
        }else{
            p.b += `${r1}=${this.get_revno(r1)}`;
        }
        u.afterInsertNode(p, undoType, undoData);
        return p;
    }
    //@+node:felix.20230709010434.13: *4* gdc.find_file
    /**
     * Return the @<file> node matching fn.
     */
    public find_file(fn: string): Position | undefined {
        const c = this.c;
        fn = g.os_path_basename(fn);
        for (const p of c.all_unique_positions()){
            if( p.isAnyAtFileNode()){
                const fn2 = p.anyAtFileNodeName();
                if (fn2.endsWith(fn)){
                    return p;
                }
            }
        }
        return undefined;
    }
    //@+node:felix.20230709010434.14: *4* gdc.find_git_working_directory
    /**
     * Return the git working directory, starting at directory.
     */
    public find_git_working_directory(directory: string): string | undefined {
        while (directory){
            if( g.os_path_exists(g.finalize_join(directory, '.git'))){
                return directory;
            }
            const path2 = g.finalize_join(directory, '..');
            if (path2 === directory){
                break;
            }
            directory = path2;
        }
        return undefined;
    }
    //@+node:felix.20230709010434.15: *4* gdc.find_gnx
    /**
     * Return a position in c having the given gnx.
     */
    public find_gnx(c: Commands, gnx: string): Position | undefined {
        for (const p of c.all_unique_positions()){
            if (p.v.fileIndex === gnx){
                return p;
            }
        }
        return undefined;
    }
    //@+node:felix.20230709010434.16: *4* gdc.finish
    /**
     * Finish execution of this command.
     */
    public finish(): void {
        const c = this.c;
        c.selectPosition(this.root!);
        this.root!.expand();
        c.redraw(this.root);
        c.treeWantsFocusNow();
    }
    //@+node:felix.20230709010434.17: *4* gdc.get_directory
    /**
     * #2143.
     * Resolve filename to the nearest directory containing a .git directory.
     */
    public get_directory(): string | undefined {
        
        const c = this.c;
        const filename = c.fileName();
        if (!filename){
            console.log('git-diff: outline has no name');
            return undefined;
        }
        let directory = os.path.dirname(filename);
        if( directory && !os.path.isdir(directory)){
            directory = os.path.dirname(directory);
        }
        if (!directory){
            console.log(`git-diff: outline has no directory. filename: ${filename}`);
            return undefined;
        }
        // Does path/../ref exist?
        const base_directory = g.gitHeadPath(directory);
        if (!base_directory){
            console.log(`git-diff: no .git directory: ${directory} filename: ${filename}`);
            return undefined;
        }
        // This should guarantee that the directory contains a .git directory.
        directory = g.finalize_join(base_directory, '..', '..');
        return directory;
    }
    //@+node:felix.20230709010434.18: *4* gdc.get_file_from_branch
    /**
     * Get the file from the head of the given branch.
     */
    public get_file_from_branch(branch: string, fn: string): string {
        // #2143
        const directory = this.get_directory();
        if (!directory){
            return '';
        }
        const command = `git show ${branch}:${fn}`;
        const lines = g.execGitCommand(command, directory);
        const s = lines.join('');
        return g.toUnicode(s).replace(/\r/g, '');
    }
    //@+node:felix.20230709010434.19: *4* gdc.get_file_from_rev
    /**
     * Get the file from the given rev, or the working directory if None.
     */
    public async get_file_from_rev(rev: string, fn: string): Promise<string> {
        // #2143
        const directory = this.get_directory();
        if (!directory){
            return '';
        }
        const w_path = g.finalize_join(directory, fn);
        if (rev){
            // Get the file using git.
            // Use the file name, not the path.
            const command = `git show ${rev}:${fn}`;
            const lines = await g.execGitCommand(command, directory);
            return g.toUnicode(lines.join('')).replace(/\r/g, '');
        }
        try{
            let b;
            // with open(w_path, 'rb') as f:
            //     b = f.read()

            // TODO LOAD FILE CONTENT !

            return g.toUnicode(b).replace(/\r/g, '');
        }catch (e){
            g.es_print('Can not read', w_path);
            g.es_exception(e);
            return '';
        }
    }
    //@+node:felix.20230709010434.20: *4* gdc.get_files
    /**
     * Return a list of changed files.
     */
    public get_files(rev1: string, rev2: string) : string[] {
        // #2143
        const directory = this.get_directory()
        if (!directory){
            return [];
        }
        const command = `git diff --name-only ${(rev1 || '')} ${(rev2 || '')}`;
        // #1781: Allow diffs of .leo files.
        return [
            // z.strip() for z in g.execGitCommand(command, directory)
            //     if not z.strip().endswith(('.db', '.zip'))
            ...g.execGitCommand(command, directory)
                .map((z: string) => z.trim())
                .filter((z: string) => !z.trim().endsWith('.db') && !z.trim().endsWith('.zip'))
        ];
    }
    //@+node:felix.20230709010434.21: *4* gdc.get_revno
    /**
     * Return the abbreviated hash for the given revision spec.
     */
    public get_revno(revspec: string, abbreviated= true): string {
        if (!revspec){
            return 'uncommitted';
        }
        // Return only the abbreviated hash for the revspec.
        const  format_s = abbreviated ? 'h' : 'H';
        const command = `git show --format=%${format_s} --no-patch ${revspec}`;
        const directory = this.get_directory();
        const lines = g.execGitCommand(command, directory);
        return lines.join('').trim();
    }
    //@+node:felix.20230709010434.22: *4* gdc.make_at_clean_outline
    /**
     * Create a hidden temp outline from lines without sentinels.
     * root is the @<file> node for fn.
     * s is the contents of the (public) file, without sentinels.
     */
    public async make_at_clean_outline(fn: string, root: Position, s: string, rev: string): Promise<Commands> {
        
        // A specialized version of at.readOneAtCleanNode.
        const hidden_c = new Commands(fn, g.app.nullGui);
        const at = hidden_c.atFileCommands;
        const x = hidden_c.shadowController;
        hidden_c.frame.createFirstTreeNode();
        const hidden_root = hidden_c.rootPosition()!;
        // copy root to hidden root, including gnxs.
        root.copyTreeFromSelfTo(hidden_root, true);
        hidden_root.h = fn + ':' + rev ? rev : fn;
        // Set at.encoding first.
        // Must be called before at.scanAllDirectives.
        at.initReadIvars(hidden_root, fn);
        // Sets at.startSentinelComment/endSentinelComment.
        at.scanAllDirectives(hidden_root);
        const new_public_lines = g.splitLines(s);
        const old_private_lines = await at.write_at_clean_sentinels(hidden_root);
        const marker = x.markerFromFileLines(old_private_lines, fn);
        const [old_public_lines, junk] = x.separate_sentinels(old_private_lines, marker);
        if (old_public_lines){
            // Fix #1136: The old lines might not exist.
            const new_private_lines = x.propagate_changed_lines(
                new_public_lines, old_private_lines, marker, hidden_root);
            at.fast_read_into_root(
                hidden_c,
                new_private_lines.join(''),
                {},
                fn,
                hidden_root,
            );
        }
        return hidden_c;

    }
    //@+node:felix.20230709010434.23: *4* gdc.make_at_file_outline
    /**
     * Create a hidden temp outline from lines.
     */
    public make_at_file_outline(fn: string, s: string, rev: string): Commands|undefined {
        // A specialized version of atFileCommands.read.
        const hidden_c = new Commands(fn, g.app.nullGui);
        const at = hidden_c.atFileCommands;
        hidden_c.frame.createFirstTreeNode();
        const root = hidden_c.rootPosition()!;
        root.h = fn + ':' + rev? rev: fn;
        at.initReadIvars(root, fn);
        if( at.errors > 0){
            g.trace('***** errors');
            return undefined;
        }
        at.fast_read_into_root(
            hidden_c,
            s,
            {},
            fn,
            root,
        );
        return hidden_c;
    }
    //@+node:felix.20230709010434.24: *4* gdc.make_diff_outlines & helper
    /**
     * Create an outline-oriented diff from the *hidden* outlines c1 and c2.
     */
    public make_diff_outlines(
        c1: Commands,
        c2: Commands,
        fn: string,
        rev1 = '',
        rev2 = '',
    ): void {
        
        const [added, deleted, changed] = this.compute_dicts(c1, c2);
        const table: [{[key: string]: [VNode, VNode]| VNode}, string][] = [
            [added, 'Added'],
            [deleted, 'Deleted'],
            [changed, 'Changed']];
        for (const [d, kind] of table){
            this.create_compare_node(c1, c2, d, kind, rev1, rev2);
        }
    }
    //@+node:felix.20230709010434.25: *5* gdc.compute_dicts
    /**
     * Compute inserted, deleted, changed dictionaries.
     */
    public compute_dicts(c1: Commands, c2: Commands): [
        {[key: string]:  VNode},
        {[key: string]:  VNode},
        {[key: string]: [VNode, VNode]}
    ] {
        
        // Special case the root: only compare the body text.
        const  [root1, root2] = [c1.rootPosition()!.v, c2.rootPosition()!.v];
        root1.h = root2.h;
        if (0){
            g.trace('c1...');
            for( const p of c1.all_positions()){
                console.log(`${p.b.length} ${p.h}`);
            }
            g.trace('c2...');
            for (const p of c2.all_positions()){
                console.log(`${p.b.length} ${p.h}`);
            }
        }
        // d1 = {v.fileIndex: v for v in c1.all_unique_nodes()};
        const d1 = [...c1.all_unique_nodes()]
            .map((v) => ({ [v.fileIndex]: v }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});

        // d2 = {v.fileIndex: v for v in c2.all_unique_nodes()};
        const d2 = [...c2.all_unique_nodes()]
            .map((v) => ({ [v.fileIndex]: v }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});

        // const added = {key: d2.get(key) for key in d2 if not d1.get(key)};
        const added:{[key: string]: VNode} = Object.keys(d2)
            .filter(key => !d1.hasOwnProperty(key))
            .reduce((acc, key) => ({ ...acc, [key]: d2[key] }), {});

        // const deleted = {key: d1.get(key) for key in d1 if not d2.get(key)}
        const deleted:{[key: string]: VNode} = Object.keys(d1)
            .filter(key => !d2.hasOwnProperty(key))
            .reduce((acc, key) => ({ ...acc, [key]: d1[key] }), {});


        // Remove the root from the added and deleted dicts.
        if(added[root2.fileIndex]){
            delete  added[root2.fileIndex];
        }
        if(deleted[root1.fileIndex]){
            delete  deleted[root1.fileIndex];
        }

        const changed: {[key: string]: [VNode, VNode]} = {};

        for (const key in d1){
            if( d2[key]){
                const v1 = d1[key];
                const v2 = d2[key];
                console.assert( v1 && v2);
                console.assert( v1.context !== v2.context);
                if (v1.h !== v2.h || v1.b !== v2.b){
                    changed[key] = [v1, v2];
                }
            }
        }
        return [added, deleted, changed];
    }
    //@+node:felix.20230709010434.26: *4* gdc.make_leo_outline
    /**
     * Create a hidden temp outline for the .leo file in s.
     */
    public async make_leo_outline(fn: string, path: string, s: string, rev: string): Promise<Commands> {
        const hidden_c = new Commands(fn, g.app.nullGui);
        hidden_c.frame.createFirstTreeNode();
        const root = hidden_c.rootPosition()!;
        root.h = fn + ':' + rev ? rev : fn;
        await hidden_c.fileCommands.getLeoFile(
            path,
            false,
            false,
            false,
        );
        return hidden_c;
    }

    //@-others

}
//@-others
//@@language typescript

// @cmd

//@-leo
