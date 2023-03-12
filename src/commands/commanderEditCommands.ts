//@+leo-ver=5-thin
//@+node:felix.20220414231314.1: * @file src/commands/commanderEditCommands.ts
// * Outline commands that used to be defined in leoCommands.py
import { commander_command } from "../core/decorators";
import { Commands } from "../core/leoCommands";

//@+others
//@+node:felix.20220414231634.1: ** Class CommanderEditCommands
export class CommanderEditCommands {

    //@+others
    //@+node:felix.20220414235045.1: *3* c_ec.convertAllBlanks
    @commander_command(
        'convert-all-blanks',
        'Convert all blanks to tabs in the selected outline.'
    )
    public convertAllBlanks(this: Commands): void {
        const c: Commands = this;
        const u = this.undoer;

        console.log('TODO: finish undo unit tests & uncomment!');

        // TODO: finish undo unit tests & uncomment !
        /*
        const undoType = 'Convert All Blanks';
        const current = c.p;
        if (g.app.batchMode) {
            c.notValidInBatchMode(undoType);
            return;
        }
        const d = c.scanAllDirectives(c.p);
        const tabWidth = d.get("tabwidth");
        let count = 0;
        u.beforeChangeGroup(current, undoType);

        for (let p of current.self_and_subtree()) {
            let changed = false;
            const innerUndoData = u.beforeChangeNodeContents(p)
            if (p === current) {
                changed = c.convertBlanks();
                if (changed) {
                    count += 1;
                }
            } else {
                changed = false;
                const result: string[] = [];
                const text = p.v.b;
                const lines = text.split('\n');
                for (let line of lines) {
                    let i;
                    let w;
                    [i, w] = g.skip_leading_ws_with_indent(line, 0, tabWidth);
                    let s;

                    s = g.computeLeadingWhitespace(w, Math.abs(tabWidth)) + line.slice(i);  // use positive width.
                    if (s !== line) {
                        changed = true;
                    }
                    result.push(s);
                }
                if (changed) {
                    count += 1;
                    p.setDirty();
                    p.setBodyString(result.join('\n'));
                    u.afterChangeNodeContents(p, undoType, innerUndoData);
                }
            }
        }
        u.afterChangeGroup(current, undoType);
        if (!g.unitTesting) {
            g.es("blanks converted to tabs in", count, "nodes");
            // Must come before c.redraw().
        }
        if (count > 0) {
            c.redraw_after_icons_changed();
        }
        */

    }

    //@+node:felix.20230221160425.1: *3* c_ec.extract & helpers
    //@+<< docstring for extract command >>
    //@+node:felix.20230221160425.2: *4* << docstring for extract command >>
    // r"""
    // Create child node from the selected body text.

    // 1. If the selection starts with a section reference, the section
    //    name becomes the child's headline. All following lines become
    //    the child's body text. The section reference line remains in
    //    the original body text.

    // 2. If the selection looks like a definition line (for the Python,
    //    JavaScript, CoffeeScript or Clojure languages) the
    //    class/function/method name becomes the child's headline and all
    //    selected lines become the child's body text.

    //    You may add additional regex patterns for definition lines using
    //    @data extract-patterns nodes. Each line of the body text should a
    //    valid regex pattern. Lines starting with # are comment lines. Use \#
    //    for patterns starting with #.

    // 3. Otherwise, the first line becomes the child's headline, and all
    //    selected lines become the child's body text.
    // """
    //@-<< docstring for extract command >>
    //@+others
    //@+node:felix.20230221160425.3: *4* def createLastChildNode
    // def createLastChildNode(c: Cmdr, parent: Position, headline: str, body: str) -> Position:
    //     """A helper function for the three extract commands."""
    //     # #1955: don't strip trailing lines.
    //     if not body:
    //         body = ""
    //     p = parent.insertAsLastChild()
    //     p.initHeadString(headline)
    //     p.setBodyString(body)
    //     p.setDirty()
    //     c.validateOutline()
    //     return p
    //@+node:felix.20230221160425.4: *4* def extractDef
    // extractDef_patterns = (
    //     re.compile(
    //     r'\((?:def|defn|defui|deftype|defrecord|defonce)\s+(\S+)'),  # clojure definition
    //     re.compile(r'^\s*(?:def|class)\s+(\w+)'),  # python definitions
    //     re.compile(r'^\bvar\s+(\w+)\s*=\s*function\b'),  # js function
    //     re.compile(r'^(?:export\s)?\s*function\s+(\w+)\s*\('),  # js function
    //     re.compile(r'\b(\w+)\s*:\s*function\s'),  # js function
    //     re.compile(r'\.(\w+)\s*=\s*function\b'),  # js function
    //     re.compile(r'(?:export\s)?\b(\w+)\s*=\s(?:=>|->)'),  # coffeescript function
    //     re.compile(
    //     r'(?:export\s)?\b(\w+)\s*=\s(?:\([^)]*\))\s*(?:=>|->)'),  # coffeescript function
    //     re.compile(r'\b(\w+)\s*:\s(?:=>|->)'),  # coffeescript function
    //     re.compile(r'\b(\w+)\s*:\s(?:\([^)]*\))\s*(?:=>|->)'),  # coffeescript function
    // )

    // def extractDef(c: Cmdr, s: str) -> str:
    //     """
    //     Return the defined function/method/class name if s
    //     looks like definition. Tries several different languages.
    //     """
    //     for pat in c.config.getData('extract-patterns') or []:
    //         try:
    //             pat = re.compile(pat)
    //             m = pat.search(s)
    //             if m:
    //                 return m.group(1)
    //         except Exception:
    //             g.es_print('bad regex in @data extract-patterns', color='blue')
    //             g.es_print(pat)
    //     for pat in extractDef_patterns:
    //         m = pat.search(s)
    //         if m:
    //             return m.group(1)
    //     return ''
    //@+node:felix.20230221160425.5: *4* def extractDef_find
    // def extractDef_find(c: Cmdr, lines: List[str]) -> Optional[str]:
    //     for line in lines:
    //         def_h = extractDef(c, line.strip())
    //         if def_h:
    //             return def_h
    //     return None
    //@+node:felix.20230221160425.6: *4* def extractRef
    // def extractRef(c: Cmdr, s: str) -> str:
    //     """Return s if it starts with a section name."""
    //     i = s.find('<<')
    //     j = s.find('>>')
    //     if -1 < i < j:
    //         return s
    //     i = s.find('@<')
    //     j = s.find('@>')
    //     if -1 < i < j:
    //         return s
    //     return ''
    //@-others
    // @g.commander_command('extract')
    // def extract(self: Self, event: Event = None) -> None:
    //     << docstring for extract command >>
    //     c, u, w = self, self.undoer, self.frame.body.wrapper
    //     undoType = 'Extract'
    //     # Set data.
    //     head, lines, tail, oldSel, oldYview = c.getBodyLines()
    //     if not lines:
    //         return  # Nothing selected.
    //     #
    //     # Remove leading whitespace.
    //     junk, ws = g.skip_leading_ws_with_indent(lines[0], 0, c.tab_width)
    //     lines = [g.removeLeadingWhitespace(s, ws, c.tab_width) for s in lines]
    //     h = lines[0].strip()
    //     ref_h = extractRef(c, h).strip()
    //     def_h = extractDef_find(c, lines)
    //     if ref_h:
    //         h, b, middle = ref_h, lines[1:], ' ' * ws + lines[0]  # By vitalije.
    //     elif def_h:
    //         h, b, middle = def_h, lines, ''
    //     else:
    //         h, b, middle = lines[0].strip(), lines[1:], ''
    //     #
    //     # Start the outer undo group.
    //     u.beforeChangeGroup(c.p, undoType)
    //     undoData = u.beforeInsertNode(c.p)
    //     p = createLastChildNode(c, c.p, h, ''.join(b))
    //     u.afterInsertNode(p, undoType, undoData)
    //     #
    //     # Start inner undo.
    //     if oldSel:
    //         i, j = oldSel
    //         w.setSelectionRange(i, j, insert=j)
    //     bunch = u.beforeChangeBody(c.p)  # Not p.
    //     #
    //     # Update the text and selection
    //     c.p.v.b = head + middle + tail  # Don't redraw.
    //     w.setAllText(head + middle + tail)
    //     i = len(head)
    //     j = max(i, len(head) + len(middle) - 1)
    //     w.setSelectionRange(i, j, insert=j)
    //     #
    //     # End the inner undo.
    //     u.afterChangeBody(c.p, undoType, bunch)
    //     #
    //     # Scroll as necessary.
    //     if oldYview:
    //         w.setYScrollPosition(oldYview)
    //     else:
    //         w.seeInsertPoint()
    //     #
    //     # Add the changes to the outer undo group.
    //     u.afterChangeGroup(c.p, undoType=undoType)
    //     p.parent().expand()
    //     c.redraw(p.parent())  # A bit more convenient than p.
    //     c.bodyWantsFocus()

    // # Compatibility

    // g.command_alias('extractSection', extract)
    // g.command_alias('extractPythonMethod', extract)
    //@+node:felix.20230221160431.1: *3* c_ec.extractSectionNames & helper
    //@+others
    //@+node:felix.20230221160431.2: *4* def findSectionName
    // def findSectionName(self: Self, s: str) -> Optional[str]:
    //     head1 = s.find("<<")
    //     if head1 > -1:
    //         head2 = s.find(">>", head1)
    //     else:
    //         head1 = s.find("@<")
    //         if head1 > -1:
    //             head2 = s.find("@>", head1)
    //     if head1 == -1 or head2 == -1 or head1 > head2:
    //         name = None
    //     else:
    //         name = s[head1 : head2 + 2]
    //     return name
    //@-others
    // @g.commander_command('extract-names')
    // def extractSectionNames(self: Self, event: Event = None) -> None:
    //     """
    //     Create child nodes for every section reference in the selected text.
    //     - The headline of each new child node is the section reference.
    //     - The body of each child node is empty.
    //     """
    //     c = self
    //     current = c.p
    //     u = c.undoer
    //     undoType = 'Extract Section Names'
    //     body = c.frame.body
    //     head, lines, tail, oldSel, oldYview = c.getBodyLines()
    //     if not lines:
    //         g.warning('No lines selected')
    //         return
    //     found = False
    //     for s in lines:
    //         name = findSectionName(c, s)
    //         if name:
    //             if not found:
    //                 u.beforeChangeGroup(current, undoType)  # first one!
    //             undoData = u.beforeInsertNode(current)
    //             p = createLastChildNode(c, current, name, None)
    //             u.afterInsertNode(p, undoType, undoData)
    //             found = True
    //     c.validateOutline()
    //     if found:
    //         u.afterChangeGroup(current, undoType)
    //         c.redraw(p)
    //     else:
    //         g.warning("selected text should contain section names")
    //     # Restore the selection.
    //     i, j = oldSel
    //     w = body.wrapper
    //     if w:
    //         w.setSelectionRange(i, j)
    //         w.setFocus()
    //@+node:felix.20220503232001.1: *3* c_ec.goToNext/PrevHistory
    @commander_command(
        'goto-next-history-node',
        'Go to the next node in the history list.'
    )
    public goToNextHistory(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goNext();
    }

    @commander_command(
        'goto-prev-history-node',
        'Go to the previous node in the history list.'
    )
    public goToPrevHistory(this: Commands): void {
        const c: Commands = this;
        c.nodeHistory.goPrev();
    }
    //@+node:felix.20230221160446.1: *3* c_ec.insertBodyTime
    // @g.commander_command('insert-body-time')
    // def insertBodyTime(self: Self, event: Event = None) -> None:
    //     """Insert a time/date stamp at the cursor."""
    //     c, p, u = self, self.p, self.undoer
    //     w = c.frame.body.wrapper
    //     undoType = 'Insert Body Time'
    //     if g.app.batchMode:
    //         c.notValidInBatchMode(undoType)
    //         return
    //     bunch = u.beforeChangeBody(p)
    //     w.deleteTextSelection()
    //     s = self.getTime(body=True)
    //     i = w.getInsertPoint()
    //     w.insert(i, s)
    //     p.v.b = w.getAllText()
    //     u.afterChangeBody(p, undoType, bunch)
    //@+node:felix.20230221160455.1: *3* c_ec.line_to_headline
    // @g.commander_command('line-to-headline')
    // def line_to_headline(self: Self, event: Event = None) -> None:
    //     """
    //     Create child node from the selected line.

    //     Cut the selected line and make it the new node's headline
    //     """
    //     c, p, u, w = self, self.p, self.undoer, self.frame.body.wrapper
    //     undoType = 'line-to-headline'
    //     ins, s = w.getInsertPoint(), p.b
    //     i = g.find_line_start(s, ins)
    //     j = g.skip_line(s, i)
    //     line = s[i:j].strip()
    //     if not line:
    //         return
    //     u.beforeChangeGroup(p, undoType)
    //     #
    //     # Start outer undo.
    //     undoData = u.beforeInsertNode(p)
    //     p2 = p.insertAsLastChild()
    //     p2.h = line
    //     u.afterInsertNode(p2, undoType, undoData)
    //     #
    //     # "before" snapshot.
    //     bunch = u.beforeChangeBody(p)
    //     p.b = s[:i] + s[j:]
    //     w.setInsertPoint(i)
    //     p2.setDirty()
    //     c.setChanged()
    //     #
    //     # "after" snapshot.
    //     u.afterChangeBody(p, undoType, bunch)
    //     #
    //     # Finish outer undo.
    //     u.afterChangeGroup(p, undoType=undoType)
    //     p.expand()
    //     c.redraw(p)
    //     c.bodyWantsFocus()
    //@-others

}
//@-others
//@-leo
