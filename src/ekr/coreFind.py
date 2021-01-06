#@+leo-ver=5-thin
#@+node:ekr.20210102145531.1: * @file src/ekr/coreFind.py
"""Leo's gui-independent find classes."""
import re
### from src.ekr import coreFind as g
from leo.core import leoGlobals as g

def cmd(name):
    """Command decorator for the findCommands class."""
    # pylint: disable=no-self-argument
    return g.new_cmd_decorator(name, ['c', 'findCommands',])

#@+others
#@+node:ekr.20210102145531.7: ** class LeoFind (coreFind.py)
class LeoFind:
    """The base class for Leo's Find commands."""
    #@+others
    #@+node:ekr.20210102145531.9: *3* find.__init__ (changed)
    #@@nobeautify

    def __init__(self, c):
        """Ctor for LeoFind class."""
        self.c = c
        self.errors = 0
        self.re_obj = None
        # Set in init_settings...
        self.find_text = ""
        self.change_text = ""
        self.ignore_case = None
        self.node_only = None
        self.pattern_match = None
        self.search_headline = None
        self.search_body = None
        self.suboutline_only = None
        self.reverse = None
        self.whole_word = None
        # Widget ivars...
        self.s_ctrl = SearchWidget()
        #
        # Communication between find-def and startSearch
        self.find_def_data = None
            # Saved regular find settings.
        self.find_seen = set()
            # Set of vnodes.
        #
        # Ivars containing internal state...
        self.changeAllFlag = False
        # self.findAllFlag = False
        # self.findAllUniqueFlag = False
        self.in_headline = False
            # True: searching headline text.
        self.match_obj = None
            # The match object returned for regex or find-all-unique-regex searches.
        self.p = None
            # The position being searched.
            # Never saved between searches!
        self.unique_matches = set()
        self.was_in_headline = None
            # Fix bug: https://groups.google.com/d/msg/leo-editor/RAzVPihqmkI/-tgTQw0-LtwJ
        self.onlyPosition = None
            # The starting node for suboutline-only searches.
    #@+node:ekr.20210105122004.1: *3* find.init
    def init(self, settings):
        """Initial all ivars from settings."""
        w = self.s_ctrl
        #
        # Init find/change strings.
        self.change_text = settings.change_text
        self.find_text = settings.find_text
        #
        # Init option ivars.
        self.ignore_case = settings.ignore_case
        self.node_only = settings.node_only
        self.pattern_match = settings.pattern_match
        self.reverse = settings.reverse
        self.search_body = settings.search_body
        self.search_headline = settings.search_headline
        self.suboutline_only = settings.suboutline_only
        self.whole_word = settings.whole_word
        #
        # Init state.
        self.errors = 0
        self.in_headline = self.was_in_headline = settings.in_headline
        self.p = p = settings.p.copy()
        self.onlyPosition = self.p if self.suboutline_only else None
        #
        # Init the search widget.
        s = p.h if self.in_headline else p.b
        w.setAllText(s)
        w.setInsertPoint(len(s) if self.reverse else 0)
    #@+node:ekr.20210105123301.1: *4* find.init_settings (new)
    def init_settings(self, settings):
        """Initialize all user settings."""
        
    #@+node:ekr.20210105154602.1: *3* find.default_settings
    def default_settings(self):
        """Return a g.Bunch representing all default settings."""
        c = self.c
        return g.Bunch(
            # State...
            in_headline = False,
            p = c.rootPosition(),
            # Find/change strings...
            find_text = '',
            change_text = '',
            # Options...
            ignore_case = False,
            node_only = False,
            pattern_match = False,
            reverse = False,
            search_body = True,
            search_headline = True,
            suboutline_only = False,
            whole_word = False,
        )
    #@+node:ekr.20210103193237.1: *3* LeoFind: Commands
    # All these commands are non-interactive.

    # To do: remove all gui-related code.
    #@+node:ekr.20210102145531.62: *4* clone-find-all/flattened
    @cmd('clone-find-all')
    @cmd('cfa')
    def clone_find_all(self, settings=None):
        """
        clone-find-all (aka cfa).

        Create an organizer node whose descendants contain clones of all nodes
        matching the search string, except @nosearch trees.

        The list is *not* flattened: clones appear only once in the
        descendants of the organizer node.
        """
        return self.clone_find_all_helper(flatten=False, settings=settings)
        
    @cmd('clone-find-all-flattened')
    @cmd('cff')
    def clone_find_all_flattened(self, settings=None):
        """
        clone-find-all-flattened (aka cff).

        Create an organizer node whose descendants contain clones of all nodes
        matching the search string, except @nosearch trees.
        """
        return self.clone_find_all_helper(flatten=True, settings=settings)
    #@+node:ekr.20210105173904.1: *5* find.clone_find_all_helper
    def clone_find_all_helper(self, flatten, settings):
        c, u = self.c, self.c.undoer
        if settings:
            self.init(settings)
        if not self.check_args():
            return 0
        if self.pattern_match:
            ok = self.precompilePattern()
            if not ok: return 0
        if self.suboutline_only:
            p = settings.p.copy()
            after = p.nodeAfterTree()
        else:
            p = c.rootPosition()
            after = None
        # g.trace('-----', flatten, p.h)
        count, found = 0, None
        clones, skip = [], set()
        while p and p != after:
            # g.trace(p.h)
            progress = p.copy()
            if p.v in skip:
                # g.trace('skip', p.h)
                p.moveToThreadNext()
            elif g.inAtNosearch(p):
                # g.trace('nosearch', p.h)
                p.moveToNodeAfterTree()
            elif self.findNextBatchMatch(p):
                count += 1
                if p not in clones:
                    clones.append(p.copy())
                if flatten:
                    p.moveToThreadNext()
                else:
                    # Don't look at the node or it's descendants.
                    for p2 in p.self_and_subtree(copy=False):
                        skip.add(p2.v)
                    p.moveToNodeAfterTree()
            else:
                p.moveToThreadNext()
            assert p != progress
        if clones:
            undoData = u.beforeInsertNode(c.p)
            found = self.create_clone_find_all_nodes(clones, flattened=False)
            u.afterInsertNode(found, 'Clone Find All', undoData)
            assert c.positionExists(found, trace=True), found
            c.setChanged()
            c.selectPosition(found)
        g.es("found", count, "matches for", self.find_text)
        return count  # Might be useful for the gui update.
    #@+node:ekr.20210102145531.64: *4* clone-find-tag (rewrite)
    @cmd('clone-find-tag')
    @cmd('cft')
    def minibufferCloneFindTag(self, event=None):
        """
        clone-find-tag (aka find-clone-tag and cft).

        Create an organizer node whose descendants contain clones of all
        nodes matching the given tag, except @nosearch trees.

        The list is *always* flattened: every cloned node appears as a
        direct child of the organizer node, even if the clone also is a
        descendant of another cloned node.
        """
        ### To do
        # if self.editWidget(event):  # sets self.w
            # self.stateZeroHelper(event,
                # prefix='Clone Find Tag: ',
                # handler=self.minibufferCloneFindTag1)

    # def minibufferCloneFindTag1(self, event):
        # c, k = self.c, self.k
        # k.clearState()
        # k.resetLabel()
        # k.showStateAndMode()
        # self.find_text = k.arg
        # self.cloneFindTag(k.arg)
        # c.treeWantsFocus()
    #@+node:ekr.20210102145531.103: *5* find.cloneFindTag
    def cloneFindTag(self, tag):
        """Handle the clone-find-tag command."""
        c, u = self.c, self.c.undoer
        tc = c.theTagController
        if not tc:
            g.es_print('nodetags not active')
            return 0
        clones = tc.get_tagged_nodes(tag)
        if clones:
            undoType = 'Clone Find Tag'
            undoData = u.beforeInsertNode(c.p)
            found = self.createCloneTagNodes(clones)
            u.afterInsertNode(found, undoType, undoData)
            assert c.positionExists(found, trace=True), found
            c.setChanged()
            c.selectPosition(found)
            c.redraw()
        else:
            g.es_print(f"tag not found: {self.find_text}")
        return len(clones)
    #@+node:ekr.20210102145531.104: *5* find.createCloneTagNodes
    def createCloneTagNodes(self, clones):
        """
        Create a "Found Tag" node as the last node of the outline.
        Clone all positions in the clones set as children of found.
        """
        c, p = self.c, self.c.p
        # Create the found node.
        assert c.positionExists(c.lastTopLevel()), c.lastTopLevel()
        found = c.lastTopLevel().insertAfter()
        assert found
        assert c.positionExists(found), found
        found.h = f"Found Tag: {self.find_text}"
        # Clone nodes as children of the found node.
        for p in clones:
            # Create the clone directly as a child of found.
            p2 = p.copy()
            n = found.numberOfChildren()
            p2._linkCopiedAsNthChild(found, n)
        return found
    #@+node:ekr.20210102145531.105: *4* find-all
    @cmd('find-all')
    def find_all(self, settings):
        """find-all"""
        c, u, w = self.c, self.c.undoer, self.s_ctrl
        if settings:
            self.init(settings)
        if not self.check_args():
            return 0
        if self.pattern_match:
            ok = self.precompilePattern()
            if not ok: return 0
        if self.suboutline_only:
            # Start with self.p.
            after = self.p.nodeAfterTree()
        else:
            # Always search the entire outline.
            self.p = c.rootPosition()
            after = None
        count, found, result = 0, None, []
        while self.p != after:  ### New
            pos, newpos = self.findNextMatch()  # sets self.p
            p = self.p
            if pos is None:
                 break
            count += 1
            s = w.getAllText()
            i, j = g.getLine(s, pos)
            line = s[i:j]
            if self.search_body and self.search_headline:
                result.append('%s%s\n%s%s\n' % (
                    '-' * 20, p.h,
                    "head: " if self.in_headline else "body: ",
                    line.rstrip() + '\n'))
            elif p.isVisited():
                result.append(line.rstrip() + '\n')
            else:
                result.append('%s%s\n%s' % ('-' * 20, p.h, line.rstrip() + '\n'))
                p.setVisited()
        if result:
            undoData = u.beforeInsertNode(c.p)
            found = self.createFindAllNode(result)
            u.afterInsertNode(found, 'Find All', undoData)
            c.selectPosition(found)
            c.setChanged()
        g.es("found", count, "matches for", self.find_text)
        return count
    #@+node:ekr.20210102145531.27: *4* find-def, find-var (test)
    @cmd('find-def')
    def findDef(self, event=None):
        """Find the def or class under the cursor."""
        self.findDefHelper(event, defFlag=True)

    @cmd('find-var')
    def findVar(self, event=None):
        """Find the var under the cursor."""
        self.findDefHelper(event, defFlag=False)
    #@+node:ekr.20210102145531.28: *5* find.findDefHelper & helpers (changed)
    def findDefHelper(self, event, defFlag):
        """Find the definition of the class, def or var under the cursor."""
        find = self
        c, w = self.c, self.c.frame.body.wrapper
        if not w:
            return
        word = self.initFindDef(event)
        if not word:
            return
        save_sel = w.getSelectionRange()
        ins = w.getInsertPoint()
        # For the command, always start in the root position.
        old_p = c.p
        p = c.rootPosition()
        # Required.
        c.selectPosition(p)
        c.redraw()
        c.bodyWantsFocusNow()
        # Set up the search.
        if defFlag:
            prefix = 'class' if word[0].isupper() else 'def'
            find_pattern = prefix + ' ' + word
        else:
            find_pattern = word + ' ='
        find.find_text = find_pattern
        # Save previous settings.
        find.saveBeforeFindDef(p)
        find.setFindDefOptions(p)
        self.find_seen = set()
        use_cff = c.config.getBool('find-def-creates-clones', default=False)
        count = 0
        if use_cff:
            count = find.clone_find_all_flattened()
            found = count > 0
        else:
            # #1592.  Ignore hits under control of @nosearch
            while True:
                ### found = find.findNext()
                pos, newpos = self.findNextMatch()
                ### if not found or not g.inAtNosearch(c.p):
                if pos is None or not g.inAtNosearch(c.p):
                    break
        if not found and defFlag:
            # Leo 5.7.3: Look for an alternative defintion of function/methods.
            word2 = self.switchStyle(word)
            if word2:
                find_pattern = prefix + ' ' + word2
                find.find_text = find_pattern
                if use_cff:
                    count = find.clone_find_all()
                    found = count > 0
                else:
                    # #1592.  Ignore hits under control of @nosearch
                    while True:
                        found = find.findNext()
                        if not found or not g.inAtNosearch(c.p):
                            break
        if found and use_cff:
            last = c.lastTopLevel()
            if count == 1:
                # It's annoying to create a clone in this case.
                # Undo the clone find and just select the proper node.
                last.doDelete()
                find.findNext()
            else:
                c.selectPosition(last)
        if found:
            self.find_seen.add(c.p.v)
            self.restoreAfterFindDef()
                # Failing to do this causes massive confusion!
        else:
            c.selectPosition(old_p)
            self.restoreAfterFindDef()  # 2016/03/24
            i, j = save_sel
            c.redraw()
            w.setSelectionRange(i, j, insert=ins)
            c.bodyWantsFocusNow()
    #@+node:ekr.20210102145531.29: *6* find.switchStyle
    def switchStyle(self, word):
        """
        Switch between camelCase and underscore_style function defintiions.
        Return None if there would be no change.
        """
        s = word
        if s.find('_') > -1:
            if s.startswith('_'):
                # Don't return something that looks like a class.
                return None
            #
            # Convert to CamelCase
            s = s.lower()
            while s:
                i = s.find('_')
                if i == -1:
                    break
                s = s[:i] + s[i + 1 :].capitalize()
            return s
        #
        # Convert to underscore_style.
        result = []
        for i, ch in enumerate(s):
            if i > 0 and ch.isupper():
                result.append('_')
            result.append(ch.lower())
        s = ''.join(result)
        return None if s == word else s
    #@+node:ekr.20210102145531.30: *6* find.initFindDef
    def initFindDef(self, event):
        """Init the find-def command. Return the word to find or None."""
        c = self.c
        w = c.frame.body.wrapper
        # First get the word.
        c.bodyWantsFocusNow()
        w = c.frame.body.wrapper
        if not w.hasSelection():
            c.editCommands.extendToWord(event, select=True)
        word = w.getSelectedText().strip()
        if not word:
            return None
            #
        # Transcrypt does not support Python's keyword module.
            # if keyword.iskeyword(word):
            #     return None
        #
        # Return word, stripped of preceding class or def.
        for tag in ('class ', 'def '):
            found = word.startswith(tag) and len(word) > len(tag)
            if found:
                return word[len(tag) :].strip()
        return word
    #@+node:ekr.20210102145531.32: *6* find.setFindDefOptions
    def setFindDefOptions(self, p):
        """Set the find options needed for the find-def command."""
        self.ignore_case = False
        self.p = p.copy()
        self.pattern_match = False
        self.reverse = False
        self.search_body = True
        self.search_headline = False
        self.whole_word = True
    #@+node:ekr.20210102145531.33: *6* find.restoreAfterFindDef
    def restoreAfterFindDef(self):
        """Restore find settings in effect before a find-def command."""
        # pylint: disable=no-member
            # Bunch has these members
        b = self.find_def_data  # A g.Bunch
        if b:
            self.ignore_case = b.ignore_case
            self.p = b.p
            self.pattern_match = b.pattern_match
            self.reverse = False
            self.search_body = b.search_body
            self.search_headline = b.search_headline
            self.whole_word = b.whole_word
            self.find_def_data = None
    #@+node:ekr.20210102145531.31: *5* find.saveBeforeFindDef
    def saveBeforeFindDef(self, p):
        """Save the find settings in effect before a find-def command."""
        if not self.find_def_data:
            self.find_def_data = g.Bunch(
                ignore_case=self.ignore_case,
                p=p.copy(),
                pattern_match=self.pattern_match,
                search_body=self.search_body,
                search_headline=self.search_headline,
                whole_word=self.whole_word,
            )
    #@+node:ekr.20210102145531.34: *4* find-next
    @cmd('find-next')
    def find_next(self, settings=None):
        """The find-next command."""
        pos, newpos = self.findNextMatch(settings)
        return pos, newpos, self.p  # For tests.
    #@+node:ekr.20210102145531.35: *4* find-prev
    @cmd('find-prev')
    def find_prev(self, settings=None):
        """Handle F2 (find-previous)"""
        if settings:
            self.init(settings)
        self.reverse = True
        try:
            pos, newpos = self.findNextMatch(settings)
        finally:
            self.reverse = False
        return pos, newpos, self.p  # For tests.
    #@+node:ekr.20210102145531.23: *4* replace-then-find (test)
    @cmd('replace-then-find')
    def change_then_find(self, event=None):
        """Handle the replace-then-find command."""
        if self.changeSelection():
            self.findNext()

    #@+node:ekr.20210102145531.100: *5* find.changeSelection (gui code)
    # Replace selection with self.change_text.
    # If no selection, insert self.change_text at the cursor.

    def changeSelection(self):
        c, p = self.c, self.p
        wrapper = c.frame.body and c.frame.body.wrapper
        w = c.edit_widget(p) if self.in_headline else wrapper
        if not w:
            self.in_headline = False
            w = wrapper
        if not w: return False
        oldSel = sel = w.getSelectionRange()
        start, end = sel
        if start > end: start, end = end, start
        if start == end:
            g.es("no text selected"); return False
        # Replace the selection in _both_ controls.
        start, end = oldSel
        change_text = self.change_text
        # Perform regex substitutions of \1, \2, ...\9 in the change text.
        if self.pattern_match and self.match_obj:
            groups = self.match_obj.groups()
            if groups:
                change_text = self.makeRegexSubs(change_text, groups)
        # change_text = change_text.replace('\\n','\n').replace('\\t','\t')
        change_text = self.replaceBackSlashes(change_text)
        for w2 in (w, self.s_ctrl):
            if start != end: w2.delete(start, end)
            w2.insert(start, change_text)
            w2.setInsertPoint(start if self.reverse else start + len(change_text))
        # Update the selection for the next match.
        w.setSelectionRange(start, start + len(change_text))
        c.widgetWantsFocus(w)
        # No redraws here: they would destroy the headline selection.
        if self.in_headline:
            pass
        else:
            c.frame.body.onBodyChanged('Change', oldSel=oldSel)
        c.frame.tree.updateIcon(p)  # redraw only the icon.
        return True
    #@+node:ekr.20210102145531.101: *5* find.makeRegexSubs
    def makeRegexSubs(self, change_text, groups):
        """
        Substitute group[i-1] for \\i strings in change_text.
        """

        def repl(match_object):
            # # 1494...
            n = int(match_object.group(1)) - 1
            if 0 <= n < len(groups):
                return (
                    groups[n].
                        replace(r'\b', r'\\b').
                        replace(r'\f', r'\\f').
                        replace(r'\n', r'\\n').
                        replace(r'\r', r'\\r').
                        replace(r'\t', r'\\t').
                        replace(r'\v', r'\\v'))
            # No replacement.
            return match_object.group(0)

        result = re.sub(r'\\([0-9])', repl, change_text)
        # print(
            # f"makeRegexSubs:\n"
            # f"change_text: {change_text!s}\n"
            # f"     groups: {groups!s}\n"
            # f"     result: {result!s}")
        return result
    #@+node:ekr.20210102145531.67: *4* replace-all (rewrite)
    @cmd('replace-all')
    def minibufferReplaceAll(self, event=None):
        """Replace all instances of the search string with the replacement string."""
        ### self.searchWithPresentOptions(event, changeAllFlag=True)
    #@+node:ekr.20210102145531.68: *4* tag-children (rewrite)
    @cmd('tag-children')
    def minibufferTagChildren(self, event=None):
        """tag-children: prompt for a tag and add it to all children of c.p."""
        ### To do
        # if self.editWidget(event):  # sets self.w
            # self.stateZeroHelper(event,
                # prefix='Tag Children: ',
                # handler=self.minibufferTagChildren1)
    # def minibufferTagChildren1(self, event):
        # c, k = self.c, self.k
        # k.clearState()
        # k.resetLabel()
        # k.showStateAndMode()
        # self.tagChildren(k.arg)
        # c.treeWantsFocus()
    #@+node:ekr.20210102145531.69: *5* find.tagChildren
    def tagChildren(self, tag):
        """Handle the clone-find-tag command."""
        c = self.c
        tc = c.theTagController
        if tc:
            for p in c.p.children():
                tc.add_tag(p, tag)
            g.es_print(f"Added {tag} tag to {len(list(c.p.children()))} nodes")
        else:
            g.es_print('nodetags not active')
    #@+node:ekr.20210103213410.1: *3* LeoFind: Helpers
    #@+node:ekr.20210102145531.137: *4* find.check_args (changed)
    def check_args(self):
        if not self.search_headline and not self.search_body:
            g.es_print("not searching headline or body")
            return False
        if not self.find_text:
            g.es_print("empty find patttern")
            return False
        return True
    #@+node:ekr.20210102145531.107: *4* find.create_clone_find_all_nodes
    def create_clone_find_all_nodes(self, clones, flattened):
        """
        Create a "Found" node as the last node of the outline.
        Clone all positions in the clones set a children of found.
        """
        c = self.c
        # Create the found node.
        assert c.positionExists(c.lastTopLevel()), c.lastTopLevel()
        found = c.lastTopLevel().insertAfter()
        assert found
        assert c.positionExists(found), found
        found.h = f"Found:{self.find_text}"
        status = self.getFindResultStatus(find_all_flag=True)
        status = status.strip().lstrip('(').rstrip(')').strip()
        flat = 'flattened, ' if flattened else ''
        found.b = f"@nosearch\n\n# {flat}{status}\n\n# found {len(clones)} nodes"
        # Clone nodes as children of the found node.
        for p in clones:
            # Create the clone directly as a child of found.
            p2 = p.copy()
            n = found.numberOfChildren()
            p2._linkCopiedAsNthChild(found, n)
        # Sort the clones in place, without undo.
        found.v.children.sort(key=lambda v: v.h.lower())
        return found
    #@+node:ekr.20210102145531.110: *4* find.createFindAllNode
    def createFindAllNode(self, result):
        """Create a "Found All" node as the last node of the outline."""
        c = self.c
        found = c.lastTopLevel().insertAfter()
        assert found
        found.h = f"Found All:{self.find_text}"
        status = self.getFindResultStatus(find_all_flag=True)
        status = status.strip().lstrip('(').rstrip(')').strip()
        found.b = f"# {status}\n{''.join(result)}"
        return found
    #@+node:ekr.20210102145531.111: *4* find.createFindUniqueNode
    def createFindUniqueNode(self):
        """Create a "Found Unique" node as the last node of the outline."""
        c = self.c
        found = c.lastTopLevel().insertAfter()
        assert found
        found.h = f"Found Unique Regex:{self.find_text}"
        # status = self.getFindResultStatus(find_all_flag=True)
        # status = status.strip().lstrip('(').rstrip(')').strip()
        # found.b = '# %s\n%s' % (status, ''.join(result))
        result = sorted(self.unique_matches)
        found.b = '\n'.join(result)
        return found
    #@+node:ekr.20210102145531.113: *4* find.findNext
    def findNext(self):
        """Find the next instance of the pattern."""
        if not self.check_args():
            return False  # for vim-mode find commands.
        pos, newpos = self.findNextMatch()
        return pos is not None
    #@+node:ekr.20210102145531.112: *4* find.findNextBatchMatch
    def findNextBatchMatch(self, p):
        """Find the next batch match at p."""
        table = []
        if self.search_headline:
            table.append(p.h)
        if self.search_body:
            table.append(p.b)
        for s in table:
            self.reverse = False
            pos, newpos = self.searchHelper(s, 0, len(s), self.find_text)
            if pos != -1: return True
        return False
    #@+node:ekr.20210102145531.115: *4* find.findNextMatch & helpers
    def findNextMatch(self, settings=None):
        """
        Resume the search where it left off.
        
        Update self.p on exit.
        """
        if settings:
            self.init(settings)
        if not self.check_args():
            return None, None
        self.errors = 0
        attempts = 0
        if self.pattern_match:
            ok = self.precompilePattern()
            if not ok: return None, None
        p = self.p
        while p:
            pos, newpos = self.search()
            if self.errors:
                g.trace('find errors')
                break  # Abort the search.
            if pos is not None:
                # Success.
                return pos, newpos
            # Searching the pane failed: switch to another pane or node.
            if self.shouldStayInNode(p):
                # Switching panes is possible.  Do so.
                self.in_headline = not self.in_headline
                self.initNextText()
            else:
                # Switch to the next/prev node, if possible.
                attempts += 1
                p = self.p = self.nextNodeAfterFail(p)
                if p:  # Found another node: select the proper pane.
                    self.in_headline = self.firstSearchPane()
                    self.initNextText()
        return None, None
    #@+node:ekr.20210102145531.117: *5* find.firstSearchPane
    def firstSearchPane(self):
        """
        Set return the value of self.in_headline
        indicating which pane to search first.
        """
        if self.search_headline and self.search_body:
            # Fix bug 1228458: Inconsistency between Find-forward and Find-backward.
            if self.reverse:
                return False  # Search the body pane first.
            return True  # Search the headline pane first.
        if self.search_headline or self.search_body:
            # Search the only enabled pane.
            return self.search_headline
        g.trace('can not happen: no search enabled')
        return False  # search the body.
    #@+node:ekr.20210102145531.118: *5* find.initNextText (gui code)
    def initNextText(self):
        """
        Init s_ctrl when a search fails. On entry:
        - self.in_headline indicates what text to use.
        - self.reverse indicates how to set the insertion point.
        """
        p, w = self.p, self.s_ctrl
        assert p
        s = p.h if self.in_headline else p.b
        if self.reverse:
            i, j = w.sel
            if i is not None and j is not None and i != j:
                ins = min(i, j)
            else:
                ins = len(s)
        else:
            ins = 0
        w.setAllText(s)
        w.setInsertPoint(ins)
    #@+node:ekr.20210102145531.119: *5* find.nextNodeAfterFail & helper
    def nextNodeAfterFail(self, p):
        """
        Return the next node after a failed search or None.
        """
        p = p.threadBack() if self.reverse else p.threadNext()
        if not p:
            return None
        if self.outsideSearchRange(p):
            return None
        return p
    #@+node:ekr.20210102145531.120: *6* find.outsideSearchRange
    def outsideSearchRange(self, p):
        """
        Return True if the search is about to go outside its range, assuming
        both the headline and body text of the present node have been searched.
        """
        c = self.c
        if not p:
            return True
        if self.node_only:
            return True
        if self.suboutline_only:
            if self.onlyPosition:
                if p != self.onlyPosition and not self.onlyPosition.isAncestorOf(p):
                    return True
            else:
                g.trace('Can not happen: onlyPosition!', p.h)
                return True
        if c.hoistStack:
            bunch = c.hoistStack[-1]
            if not bunch.p.isAncestorOf(p):
                g.trace('outside hoist', p.h)
                g.warning('found match outside of hoisted outline')
                return True
        return False  # Within range.
    #@+node:ekr.20210102145531.122: *5* find.shouldStayInNode
    def shouldStayInNode(self, p):
        """Return True if the find should simply switch panes."""
        # Errors here cause the find command to fail badly.
        # Switch only if:
        #   a) searching both panes and,
        #   b) this is the first pane of the pair.
        # There is *no way* this can ever change.
        # So simple in retrospect, so difficult to see.
        return (
            self.search_headline and self.search_body and (
            (self.reverse and not self.in_headline) or
            (not self.reverse and self.in_headline)))
    #@+node:ekr.20210102145531.114: *4* find.getFindResultStatus
    def getFindResultStatus(self, find_all_flag=False):
        """Return the status to be shown in the status line after a find command completes."""
        status = []
        if self.whole_word:
            status.append('word' if find_all_flag else 'word-only')
        if self.ignore_case:
            status.append('ignore-case')
        if self.pattern_match:
            status.append('regex')
        if find_all_flag:
            if self.search_headline:
                status.append('head')
            if self.search_body:
                status.append('body')
        else:
            if not self.search_headline:
                status.append('body-only')
            elif not self.search_body:
                status.append('headline-only')
        if not find_all_flag:
            ###
                # if self.wrapping:
                #     status.append('wrapping')
            if self.suboutline_only:
                status.append('[outline-only]')
            elif self.node_only:
                status.append('[node-only]')
        return f" ({', '.join(status)})" if status else ''
    #@+node:ekr.20210102145531.121: *4* find.precompilePattern
    def precompilePattern(self):
        """Precompile the regexp pattern if necessary."""
        try:  # Precompile the regexp.
            # pylint: disable=no-member
            flags = re.MULTILINE
            if self.ignore_case: flags |= re.IGNORECASE
            # Escape the search text.
            # Ignore the whole_word option.
            s = self.find_text
            # A bad idea: insert \b automatically.
                # b, s = '\\b', self.find_text
                # if self.whole_word:
                    # if not s.startswith(b): s = b + s
                    # if not s.endswith(b): s = s + b
            self.re_obj = re.compile(s, flags)
            return True
        except Exception:
            g.warning('invalid regular expression:', self.find_text)
            self.errors += 1  # Abort the search.
            return False
    #@+node:ekr.20210102145531.124: *4* find.search & helpers
    def search(self):
        """
        Search s_ctrl for self.find_text with present options.
        Returns (pos, newpos) or (None,None).
        """
        p, w = self.p, self.s_ctrl
        if self.find_def_data and p.v in self.find_seen:
            # Don't find defs/vars multiple times.
            return None, None
        index = w.getInsertPoint()
        s = w.getAllText()
        if not s:
            return None, None
        stopindex = 0 if self.reverse else len(s)
        pos, newpos = self.searchHelper(s, index, stopindex, self.find_text)
        if self.in_headline and not self.search_headline:
            return None, None
        if not self.in_headline and not self.search_body:
            return None, None
        if pos == -1:
            return None, None
        ins = min(pos, newpos) if self.reverse else max(pos, newpos)
        w.setSelectionRange(pos, newpos, insert=ins)
        if self.find_def_data:
            self.find_seen.add(p.v)
        return pos, newpos
    #@+node:ekr.20210102145531.126: *5* find.searchHelper & helpers
    def searchHelper(self, s, i, j, pattern):
        """Dispatch the proper search method based on settings."""
        backwards = self.reverse
        nocase = self.ignore_case
        regexp = self.pattern_match
        word = self.whole_word
        if backwards: i, j = j, i
        if not s[i:j] or not pattern:
            return -1, -1
        if regexp:
            pos, newpos = self.regexHelper(s, i, j, pattern, backwards, nocase)
        elif backwards:
            pos, newpos = self.backwardsHelper(s, i, j, pattern, nocase, word)
        else:
            pos, newpos = self.plainHelper(s, i, j, pattern, nocase, word)
        return pos, newpos
    #@+node:ekr.20210102145531.128: *6* find.backwardsHelper
    debugIndices = []

    def backwardsHelper(self, s, i, j, pattern, nocase, word):
        """
        rfind(sub [,start [,end]])

        Return the highest index in the string where substring sub is found,
        such that sub is contained within s[start,end].
        
        Optional arguments start and end are interpreted as in slice notation.

        Return (-1, -1) on failure.
        """
        if nocase:
            s = s.lower()
            pattern = pattern.lower()
        pattern = self.replaceBackSlashes(pattern)
        n = len(pattern)
        # Put the indices in range.  Indices can get out of range
        # because the search code strips '\r' characters when searching @edit nodes.
        i = max(0, i)
        j = min(len(s), j)
        # short circuit the search: helps debugging.
        if s.find(pattern) == -1:
            return -1, -1
        if word:
            while 1:
                k = s.rfind(pattern, i, j)
                if k == -1: return -1, -1
                if self.matchWord(s, k, pattern):
                    return k, k + n
                j = max(0, k - 1)
        else:
            k = s.rfind(pattern, i, j)
            if k == -1:
                return -1, -1
            return k, k + n
        # For pylint:
        return -1, -1
    #@+node:ekr.20210102145531.130: *6* find.matchWord
    def matchWord(self, s, i, pattern):
        """Do a whole-word search."""
        pattern = self.replaceBackSlashes(pattern)
        if not s or not pattern or not g.match(s, i, pattern):
            return False
        pat1, pat2 = pattern[0], pattern[-1]
        n = len(pattern)
        ch1 = s[i - 1] if 0 <= i - 1 < len(s) else '.'
        ch2 = s[i + n] if 0 <= i + n < len(s) else '.'
        isWordPat1 = g.isWordChar(pat1)
        isWordPat2 = g.isWordChar(pat2)
        isWordCh1 = g.isWordChar(ch1)
        isWordCh2 = g.isWordChar(ch2)
        inWord = isWordPat1 and isWordCh1 or isWordPat2 and isWordCh2
        return not inWord
    #@+node:ekr.20210102145531.129: *6* find.plainHelper
    def plainHelper(self, s, i, j, pattern, nocase, word):
        """Do a plain search."""
        if nocase:
            s = s.lower(); pattern = pattern.lower()
        pattern = self.replaceBackSlashes(pattern)
        n = len(pattern)
        if word:
            while 1:
                k = s.find(pattern, i, j)
                if k == -1:
                    return -1, -1
                if self.matchWord(s, k, pattern):
                    return k, k + n
                i = k + n
        else:
            k = s.find(pattern, i, j)
            if k == -1:
                return -1, -1
            return k, k + n
        # For pylint
        return -1, -1
    #@+node:ekr.20210102145531.127: *6* find.regexHelper
    def regexHelper(self, s, i, j, pattern, backwards, nocase):

        re_obj = self.re_obj  # Use the pre-compiled object
        if not re_obj:
            g.trace('can not happen: no re_obj')
            return -1, -1
        if backwards:
            # Scan to the last match using search here.
            last_mo = None; i = 0
            while i < len(s):
                mo = re_obj.search(s, i, j)
                if not mo: break
                i += 1
                last_mo = mo
            mo = last_mo
        else:
            mo = re_obj.search(s, i, j)
        while mo and 0 <= i <= len(s):
            # Bug fix: 2013/12/27: must be 0 <= i <= len(s)
            if mo.start() == mo.end():
                if backwards:
                    # Search backward using match instead of search.
                    i -= 1
                    while 0 <= i < len(s):
                        mo = re_obj.match(s, i, j)
                        if mo: break
                        i -= 1
                else:
                    i += 1; mo = re_obj.search(s, i, j)
            else:
                self.match_obj = mo
                return mo.start(), mo.end()
        self.match_obj = None
        return -1, -1
    #@+node:ekr.20210102145531.131: *6* find.replaceBackSlashes
    def replaceBackSlashes(self, s):
        """Carefully replace backslashes in a search pattern."""
        # This is NOT the same as:
        # s.replace('\\n','\n').replace('\\t','\t').replace('\\\\','\\')
        # because there is no rescanning.
        i = 0
        while i + 1 < len(s):
            if s[i] == '\\':
                ch = s[i + 1]
                if ch == '\\':
                    s = s[:i] + s[i + 1 :]  # replace \\ by \
                elif ch == 'n':
                    s = s[:i] + '\n' + s[i + 2 :]  # replace the \n by a newline
                elif ch == 't':
                    s = s[:i] + '\t' + s[i + 2 :]  # replace \t by a tab
                else:
                    i += 1  # Skip the escaped character.
            i += 1
        return s
    #@-others
#@+node:ekr.20210103132816.1: ** class SearchWidget (coreFind.py)
class SearchWidget:
    """A class to simulating high-level interface widget."""
    # This could be a StringTextWrapper, but this code is simple and good.

    def __init__(self, *args, **keys):
        self.s = ''  # The widget text
        self.i = 0  # The insert point
        self.sel = 0, 0  # The selection range

    def __repr__(self):
        return f"SearchWidget id: {id(self)}"
    #@+others
    #@+node:ekr.20210103132816.2: *3* SearchWidget.getters
    def getAllText(self):
        return self.s

    def getInsertPoint(self):
        return self.i  # Returns Python index.

    def getSelectionRange(self):
        return self.sel  # Returns Python indices.

    def toPythonIndex(self, i):
        return g.toPythonIndex(self.s, i)
    #@+node:ekr.20210103132816.3: *3* SearchWidget.setters
    def delete(self, i, j=None):
        i = self.toPythonIndex(i)
        if j is None: j = i + 1
        else: j = self.toPythonIndex(j)
        self.s = self.s[:i] + self.s[j:]
        # Bug fix: 2011/11/13: Significant in external tests.
        self.i = i
        self.sel = i, i

    def insert(self, i, s):
        if not s: return
        i = self.toPythonIndex(i)
        self.s = self.s[:i] + s + self.s[i:]
        self.i = i
        self.sel = i, i

    def setAllText(self, s):
        self.s = s
        self.i = 0
        self.sel = 0, 0

    def setInsertPoint(self, i, s=None):
        self.i = i

    def setSelectionRange(self, i, j, insert=None):
        self.sel = self.toPythonIndex(i), self.toPythonIndex(j)
        if insert is not None:
            self.i = self.toPythonIndex(insert)
    #@-others
#@-others
#@@language python
#@@tabwidth -4
#@@pagewidth 70
#@-leo
