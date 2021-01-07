#@+leo-ver=5-thin
#@+node:ekr.20210102145531.1: * @file src/ekr/coreFind.py
"""Leo's gui-independent find classes."""
import re
import sys
import time
import unittest
# pylint: disable=import-self
### from src.ekr import coreFind as g
from leo.core import leoGlobals as g
from src.ekr import coreFind
from src.ekr import coreTest

def cmd(name):
    """Command decorator for the findCommands class."""
    # pylint: disable=no-self-argument
    return g.new_cmd_decorator(name, ['c', 'findCommands',])

#@+others
#@+node:ekr.20210102145531.7: ** class LeoFind (coreFind.py)
class LeoFind:
    """The base class for Leo's Find commands."""
    #@+others
    #@+node:ekr.20210102145531.9: *3* find.__init__
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
        self.wrapping = None
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
        self.wrapping = settings.wrapping
        #
        # Init state.
        self.errors = 0
        self.in_headline = self.was_in_headline = settings.in_headline
        self.p = p = settings.p.copy()
        self.onlyPosition = self.p if self.suboutline_only else None
        self.wrapPos = 0 if self.reverse else len(p.b)
        #
        # Init the search widget.
        s = p.h if self.in_headline else p.b
        w.setAllText(s)
        w.setInsertPoint(len(s) if self.reverse else 0)
    #@+node:ekr.20210105123301.1: *4* find.init_settings
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
            wrapping = False,
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
    #@+node:ekr.20210105173904.1: *5* find.clone_find_all_helper & helper
    def clone_find_all_helper(self, flatten, settings):
        c, u = self.c, self.c.undoer
        tag = 'clone-find-all-flattened' if flatten else 'clone-find-all'
        if settings:
            self.init(settings)
        if not self.check_args(tag):
            return 0
        if self.pattern_match:
            ok = self.compile_pattern()
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
            elif self.find_next_batch_match(p):
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
    #@+node:ekr.20210102145531.112: *6* find.find_next_batch_match
    def find_next_batch_match(self, p):
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
    #@+node:ekr.20210102145531.64: *4* clone-find-tag
    @cmd('clone-find-tag')
    @cmd('cft')
    def clone_find_tag(self, tag):
        """
        clone-find-tag (aka find-clone-tag and cft).

        Create an organizer node whose descendants contain clones of all
        nodes matching the given tag, except @nosearch trees.

        The list is *always* flattened: every cloned node appears as a
        direct child of the organizer node, even if the clone also is a
        descendant of another cloned node.
        """
        c, u = self.c, self.c.undoer
        tc = c.theTagController
        if not tc:
            g.es_print('nodetags not active')
            return 0, c.p
        clones = tc.get_tagged_nodes(tag)
        if not clones:
            g.es_print(f"tag not found: {tag}")
            tc.show_all_tags()
            return 0, c.p
        undoData = u.beforeInsertNode(c.p)
        found = self.create_clone_tag_nodes(clones)
        u.afterInsertNode(found, 'Clone Find Tag', undoData)
        assert c.positionExists(found, trace=True), found
        c.setChanged()
        return len(clones), found
    #@+node:ekr.20210102145531.104: *5* find.create_clone_tag_nodes
    def create_clone_tag_nodes(self, clones):
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
        if not self.check_args('find-all'):
            return 0
        if self.pattern_match:
            ok = self.compile_pattern()
            if not ok: return 0
        if self.suboutline_only:
            # Start with self.p.
            after = self.p.nodeAfterTree()
        else:
            # Always search the entire outline.
            self.p = c.rootPosition()
            after = None
        count, found, result = 0, None, []
        while self.p != after:
            pos, newpos = self.find_next_match()  # sets self.p
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
            found = self.create_find_all_node(result)
            u.afterInsertNode(found, 'Find All', undoData)
            c.selectPosition(found)
            c.setChanged()
        g.es("found", count, "matches for", self.find_text)
        return count
    #@+node:ekr.20210102145531.27: *4* find-def, find-var
    @cmd('find-def')
    def find_def(self, settings=None):
        """Find the def or class under the cursor."""
        return self.find_def_helper(defFlag=True, settings=settings)

    @cmd('find-var')
    def find_var(self, settings=None):
        """Find the var under the cursor."""
        return self.find_def_helper(defFlag=False, settings=settings)
    #@+node:ekr.20210102145531.28: *5* find.find_def_helper & helpers
    def find_def_helper(self, defFlag, settings):
        """Find the definition of the class, def or var under the cursor."""
        c, w = self.c, self.c.frame.body.wrapper
        tag = 'find-def' if defFlag else 'find-var'
        if not w:
            return None, None, None
        if settings:
            self.init(settings)
        if not self.check_args(tag):
            return None, None, None
        if not self.find_text:
            g.trace('no find text')
            return None, None, None
        # Always start in the root position.
        p = self.p = c.rootPosition()
        c.redraw(p)  # Required.
        c.bodyWantsFocusNow()
        # Set up the search.
        if defFlag:
            prefix = 'class' if self.find_text[0].isupper() else 'def'
            self.find_text = prefix + ' ' + self.find_text
        else:
            self.find_text = self.find_text + ' ='
        # Save previous settings.
        self.saveBeforeFindDef(p)
        self.setFindDefOptions(p)
        ### Make this a setting.
        use_cff = c.config.getBool('find-def-creates-clones', default=False)
        count, found = 0, False
        self.find_seen = set()
        if use_cff:
            count = self.clone_find_all_flattened()
            found = count > 0
        else:
            # #1592.  Ignore hits under control of @nosearch
            while True:
                pos, newpos = self.find_next_match()
                found = pos is not None
                if found or not g.inAtNosearch(c.p):
                    break
        if not found and defFlag and not self.find_text.startswith('class'):
            # Leo 5.7.3: Look for an alternative defintion of function/methods.
            word2 = self.switchStyle(self.find_text)
            if word2:
                self.find_text = prefix + ' ' + word2
                if use_cff:
                    count = self.clone_find_all()
                    found = count > 0
                else:
                    # #1592.  Ignore hits under control of @nosearch
                    while True:
                        pos, newpos = self.find_next_match()
                        found = pos is not None
                        if found or not g.inAtNosearch(c.p):
                            break
        if found and use_cff:
            last = c.lastTopLevel()
            if count == 1:
                # It's annoying to create a clone in this case.
                # Undo the clone find and just select the proper node.
                last.doDelete()
                ### self.findNext()
                self.find_next_match()
            else:
                c.selectPosition(last)
            return None, None, last
        if found:
            self.restoreAfterFindDef()
                # Failing to do this causes massive confusion!
            return pos, newpos, self.p
        return None, None, None
    #@+node:ekr.20210102145531.33: *6* find.restoreAfterFindDef
    def restoreAfterFindDef(self):
        """Restore find settings in effect before a find-def command."""
        # pylint: disable=no-member
            # Bunch has these members
        b = self.find_def_data  # A g.Bunch
        if b:
            self.ignore_case = b.ignore_case
            ### self.p = b.p
            self.pattern_match = b.pattern_match
            self.reverse = False
            self.search_body = b.search_body
            self.search_headline = b.search_headline
            self.whole_word = b.whole_word
            self.find_def_data = None
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
        pos, newpos = self.find_next_match(settings)
        return pos, newpos, self.p  # For tests.
    #@+node:ekr.20210102145531.35: *4* find-prev
    @cmd('find-prev')
    def find_prev(self, settings=None):
        """Handle F2 (find-previous)"""
        if settings:
            self.init(settings)
        self.reverse = True
        try:
            pos, newpos = self.find_next_match(settings)
        finally:
            self.reverse = False
        return pos, newpos, self.p  # For tests.
    #@+node:ekr.20210102145531.67: *4* replace-all & helpers
    @cmd('replace-all')
    def replace_all(self, settings):
        """Replace all instances of the search string with the replacement string."""
        c, current, u = self.c, self.c.p, self.c.undoer
        undoType = 'Replace All'
        if settings:
            self.init(settings)
        if not self.check_args('replace-all'):
            return
        t1 = time.process_time()
        count = 0
        u.beforeChangeGroup(current, undoType)
        # Fix bug 338172: ReplaceAll will not replace newlines
        # indicated as \n in target string.
        self.change_text = self.replace_back_slashes(self.change_text)
        if self.pattern_match:
            ok = self.compile_pattern()
            if not ok:
                return
        # #1428: Honor limiters in replace-all.
        if self.node_only:
            positions = [c.p]
        elif self.suboutline_only:
            positions = c.p.self_and_subtree()
        else:
            positions = c.all_unique_positions()
        count = 0
        for p in positions:
            count_h, count_b = 0, 0
            undoData = u.beforeChangeNodeContents(p)
            if self.search_headline:
                count_h, new_h = self.replace_all_helper(p.h)
                if count_h:
                    count += count_h
                    p.h = new_h
            if self.search_body:
                count_b, new_b = self.replace_all_helper(p.b)
                if count_b:
                    count += count_b
                    p.b = new_b
            if count_h or count_b:
                u.afterChangeNodeContents(p, undoType, undoData)
        p = c.p
        u.afterChangeGroup(p, undoType, reportFlag=True)
        t2 = time.process_time()
        g.es_print(f"changed {count} instances{g.plural(count)} in {t2 - t1:4.2f} sec.")
        #
        # Bugs #947, #880 and #722:
        # Set ancestor @<file> nodes by brute force.
        for p in c.all_positions():
            if (
                p.anyAtFileNodeName()
                and not p.v.isDirty()
                and any([p2.v.isDirty() for p2 in p.subtree()])
            ):
                p.setDirty()
    #@+node:ekr.20210106081141.2: *5* find.replace_all_helper & helpers
    def replace_all_helper(self, s):
        """
        Search s for self.find_text and replace with self.change_text.
        
        Return (found, new text)
        """
        if sys.platform.lower().startswith('win'):
            s = s.replace('\r', '')
                # Ignore '\r' characters, which may appear in @edit nodes.
                # Fixes this bug: https://groups.google.com/forum/#!topic/leo-editor/yR8eL5cZpi4
                # This hack would be dangerous on MacOs: it uses '\r' instead of '\n' (!)
        if not s:
            return False, None
        #
        # Order matters: regex matches ignore whole-word.
        if self.pattern_match:
            return self.batchRegexReplace(s)
        if self.whole_word:
            return self.batchWordReplace(s)
        return self.batchPlainReplace(s)
    #@+node:ekr.20210106081141.3: *6* find.batchPlainReplace
    def batchPlainReplace(self, s):
        """
        Perform all plain find/replace on s.\
        return (count, new_s)
        """
        find, change = self.find_text, self.change_text
        # #1166: s0 and find0 aren't affected by ignore-case.
        s0 = s
        find0 = self.replace_back_slashes(find)
        if self.ignore_case:
            s = s0.lower()
            find = find0.lower()
        count, prev_i, result = 0, 0, []
        while True:
            # #1166: Scan using s and find.
            i = s.find(find, prev_i)
            if i == -1:
                break
            # #1166: Replace using s0 & change.
            count += 1
            result.append(s0[prev_i:i])
            result.append(change)
            prev_i = i + len(find)
        # #1166: Complete the result using s0.
        result.append(s0[prev_i:])
        return count, ''.join(result)
    #@+node:ekr.20210106081141.4: *6* find.batchRegexReplace
    def batchRegexReplace(self, s):
        """
        Perform all regex find/replace on s.
        return (count, new_s)
        """
        count, prev_i, result = 0, 0, []

        flags = re.MULTILINE
        if self.ignore_case:
            flags |= re.IGNORECASE
        for m in re.finditer(self.find_text, s, flags):
            count += 1
            i = m.start()
            result.append(s[prev_i:i])
            # #1748.
            groups = m.groups()
            if groups:
                change_text = self.makeRegexSubs(self.change_text, groups)
            else:
                change_text = self.change_text
            result.append(change_text)
            prev_i = m.end()
        # Compute the result.
        result.append(s[prev_i:])
        s = ''.join(result)
        return count, s
    #@+node:ekr.20210106081141.5: *6* find.batchWordReplace
    def batchWordReplace(self, s):
        """
        Perform all whole word find/replace on s.
        return (count, new_s)
        """
        find, change = self.find_text, self.change_text
        # #1166: s0 and find0 aren't affected by ignore-case.
        s0 = s
        find0 = self.replace_back_slashes(find)
        if self.ignore_case:
            s = s0.lower()
            find = find0.lower()
        count, prev_i, result = 0, 0, []
        while True:
            # #1166: Scan using s and find.
            i = s.find(find, prev_i)
            if i == -1:
                break
            # #1166: Replace using s0, change & find0.
            result.append(s0[prev_i:i])
            if g.match_word(s, i, find):
                count += 1
                result.append(change)
            else:
                result.append(find0)
            prev_i = i + len(find)
        # #1166: Complete the result using s0.
        result.append(s0[prev_i:])
        return count, ''.join(result)
    #@+node:ekr.20210102145531.23: *4* replace-then-find
    @cmd('replace-then-find')
    def replace_then_find(self, settings):
        """Handle the replace-then-find command."""
        if settings:
            self.init(settings)
        if not self.check_args('replace-then-find'):
            return None, None, None
        if self.changeSelection():
            pos, newpos = self.find_next_match()
            return pos, newpos, self.p
        return None, None, None

    #@+node:ekr.20210102145531.100: *5* find.changeSelection (gui code)
    # Replace selection with self.change_text.
    # If no selection, insert self.change_text at the cursor.

    def changeSelection(self):
        # g.pdb()
        c, p = self.c, self.p
        wrapper = c.frame.body and c.frame.body.wrapper
        w = c.edit_widget(p) if self.in_headline else wrapper
        if not w:
            self.in_headline = False
            w = wrapper
        if not w:
            return False
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
        change_text = self.replace_back_slashes(change_text)
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
    #@+node:ekr.20210102145531.68: *4* tag-children
    @cmd('tag-children')
    def tag_children(self, tag):
        """tag-children: Add the given tag to all children of c.p."""
        c = self.c
        tc = c.theTagController
        if not tc:
            g.es_print('nodetags not active')
            return
        for p in c.p.children():
            tc.add_tag(p, tag)
        g.es_print(f"Added {tag} tag to {len(list(c.p.children()))} nodes")
    #@+node:ekr.20210103213410.1: *3* LeoFind: Helpers
    #@+node:ekr.20210102145531.137: *4* find.check_args
    def check_args(self, tag):
        if not self.search_headline and not self.search_body:
            g.es_print("not searching headline or body")
            return False
        if not self.find_text:
            g.es_print(f"\n{tag}: empty find patttern")
            return False
        return True
    #@+node:ekr.20210102145531.121: *4* find.compile_pattern
    def compile_pattern(self):
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
    #@+node:ekr.20210102145531.114: *4* find.compute_result_status
    def compute_result_status(self, find_all_flag=False):
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
            if self.wrapping:
                status.append('wrapping')
        else:
            if self.search_headline:
                status.append('headline-only')
            if self.search_body:
                status.append('body-only')
            if self.suboutline_only:
                status.append('[outline-only]')
            if self.node_only:
                status.append('[node-only]')
        return f" ({', '.join(status)})" if status else ''
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
        status = self.compute_result_status(find_all_flag=True)
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
    #@+node:ekr.20210102145531.110: *4* find.create_find_all_node
    def create_find_all_node(self, result):
        """Create a "Found All" node as the last node of the outline."""
        c = self.c
        found = c.lastTopLevel().insertAfter()
        assert found
        found.h = f"Found All:{self.find_text}"
        status = self.compute_result_status(find_all_flag=True)
        status = status.strip().lstrip('(').rstrip(')').strip()
        found.b = f"# {status}\n{''.join(result)}"
        return found
    #@+node:ekr.20210102145531.115: *4* find.find_next_match & helpers
    def find_next_match(self, settings=None):
        """
        Resume the search where it left off.
        
        Update self.p on exit.
        """
        if settings:
            self.init(settings)
        if not self.check_args('find_next_match'):
            return None, None
        self.errors = 0
        attempts = 0
        if self.pattern_match:
            ok = self.compile_pattern()
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
                    # g.trace('Try', p.h)
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
    #@+node:ekr.20210102145531.119: *5* find.nextNodeAfterFail & helpers
    def nextNodeAfterFail(self, p):
        """Return the next node after a failed search or None."""
        c = self.c
        # Wrapping is disabled by any limitation of search.
        wrap = (
            self.wrapping
            and not self.node_only
            and not self.suboutline_only
            and not c.hoistStack)
        # Move to the next position.
        p = p.threadBack() if self.reverse else p.threadNext()
        # g.trace(p and p.h or 'None')
        # Check it.
        if p and self.outsideSearchRange(p):
            return None
        if not p and wrap:
            # Stateless wrap: Just set wrapPos and p.
            self.wrapPos = 0 if self.reverse else len(p.b)
            p = self.doWrap()
        if not p:
            return None
        return p
    #@+node:ekr.20210102145531.116: *6* find.doWrap
    def doWrap(self):
        """Return the position resulting from a wrap."""
        c = self.c
        if self.reverse:
            p = c.rootPosition()
            while p and p.hasNext():
                p = p.next()
            p = p.lastNode()
            return p
        return c.rootPosition()
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
    #@+node:ekr.20210102145531.131: *4* find.replace_back_slashes
    def replace_back_slashes(self, s):
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
        pattern = self.replace_back_slashes(pattern)
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
        pattern = self.replace_back_slashes(pattern)
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
        pattern = self.replace_back_slashes(pattern)
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
#@+node:ekr.20210106123815.1: ** class TestFind (unittest.TestCase)
class TestFind (unittest.TestCase):
    """Test cases for coreFind.py"""
    
    def setUp(self):
        self.c = coreTest.create_app()
        self.x = coreFind.LeoFind(self.c)
        self.settings = self.x.default_settings()
        self.make_test_tree()
        
    #@+others
    #@+node:ekr.20210106170813.1: *3* TestFind: setup
    #@+node:ekr.20210106170840.1: *4* TestFind.make_test_tree
    def make_test_tree(self):
        """Make a test tree for other tests"""
        c = self.c
        root = c.rootPosition()
        root.h = 'Root'
        root.b = f"def root():\n    pass\n"

        def make_child(n, p):
            p2 = p.insertAsLastChild()
            p2.h = f"child {n}"
            p2.b = f"def child{n}():\n    pass\n"
            return p2

        def make_top(n):
            p = root.insertAsLastChild()
            p.h = f"Node {n}"
            p.b = f"def top{n}():\n    pass\n"
            return p
            
        for n in range(0, 4, 3):
            p = make_top(n+1)
            p2 = make_child(n+2, p)
            make_child(n+3, p2)
    #@+node:ekr.20210106170636.1: *4* TestFind.test_tree
    def test_tree(self):
        
        g.trace('=====')
        table = (
            (0, 'Root'),
            (1, 'Node 1'),
            (2, 'child 2'),
            (3, 'child 3'),
            (1, 'Node 4'),
            (2, 'child 5'),
            (3, 'child 6'),
        )
        i = 0
        for p in self.c.all_positions():
            level, h = table[i]
            i += 1
            assert p.h == h, (p.h, h)
            assert p.level() == level, (p.level(), level, p.h)
            # print(' '*p.level(), p.h)
            # g.printObj(g.splitLines(p.b), tag=p.h)
    #@+node:ekr.20210106141701.1: *3* Tests of Commands...
    #@+node:ekr.20210106124121.1: *4* TestFind.clone-find-all
    def test_clone_find_all(self):
        x = self.x
        settings = self.settings
        # Regex find.
        settings.find_text = r'^def\b'
        settings.change_text = 'def'  # Don't actually change anything!
        settings.pattern_match = True
        x.clone_find_all(settings)
        # Word find.
        settings.find_text = 'def'
        settings.match_word = True
        settings.pattern_match = False
        x.clone_find_all(settings)
        # Suboutline only.
        settings.suboutline_only = True
        x.clone_find_all(settings)
        # print(self.c.lastTopLevel().h)

    def test_clone_find_all_errors(self):
        # No find pattern.
        self.x.clone_find_all(self.settings)
        
    #@+node:ekr.20210106133012.1: *4* TestFind.clone-find-all-flattened
    def test_clone_find_all_flattened(self):
        x = self.x
        settings = self.settings
        # regex find.
        settings.find_text = r'^def\b'
        settings.pattern_match = True
        x.clone_find_all_flattened(settings)
        # word find.
        settings.find_text = 'def'
        settings.match_word = True
        settings.pattern_match = False
        x.clone_find_all_flattened(settings)
        # Suboutline only.
        settings.suboutline_only = True
        x.clone_find_all_flattened(settings)
        # print(self.c.lastTopLevel().h)

    def test_clone_find_all_flattened_errors(self):
        # No find pattern.
        self.x.clone_find_all_flattened(self.settings)
        
    #@+node:ekr.20210106141951.1: *4* TestFind.find-all
    def test_find_all(self):
        x = self.x
        # Test 1.
        settings = self.settings
        settings.find_text = r'^def\b'
        settings.pattern_match = True
        x.find_all(settings)
        # Test 2.
        settings.suboutline_only = True
        x.find_all(settings)
        
    def test_find_all_errors(self):
        # No find pattern.
        self.x.find_all(self.settings)
        
    #@+node:ekr.20210106173343.1: *4* TestFind.find-next & find-prev
    def test_find_next(self):

        c, x = self.c, self.x
        settings = self.settings
        settings.find_text = 'def top1'
        # find-next
        pos, newpos, p = x.find_next(settings)
        assert p.h == 'Node 1', p.h
        s = p.b[pos:newpos]
        assert s == settings.find_text, repr(s)
        # find-prev: starts at end, so we stay in the node.
        last = c.lastTopLevel()
        child = last.firstChild()
        grand_child = child.firstChild()
        settings.p = grand_child
        settings.find_text = 'def child2'
        pos, newpos, p = x.find_prev(settings)
        print(pos, newpos, p.h)
        assert p.h == 'child 2', p.h
        s = p.b[pos:newpos]
        assert s == settings.find_text, repr(s)
    #@+node:ekr.20210106141654.1: *3* Tests of Helpers...
    #@+node:ekr.20210106133506.1: *4* TestFind.test_bad compile_pattern
    def test_bad_compile_pattern(self):
        
        # Bad search pattern.
        settings = self.settings
        settings.find_text = r'^def\b(('
        settings.pattern_match = True
        self.x.clone_find_all(settings)
    #@+node:ekr.20210106133737.1: *4* TestFind.test_check_args
    def test_check_args(self):
        
        # Bad search patterns..
        x = self.x
        settings = self.settings
        # Not searching headline or body.
        settings.search_body = False
        settings.search_headline = False
        x.clone_find_all(settings)
        # Empty find pattern.
        settings.search_body = True
        x.clone_find_all(settings)
        
    #@+node:ekr.20210106134128.1: *4* TestFind.compute_result_status
    def test_compute_result_status(self):
        
        x = self.x
        # find_all_flag is True
        all_settings = x.default_settings()
        all_settings.ignore_case = True
        all_settings.pattern_match = True
        all_settings.whole_word = True
        all_settings.wrapping = True
        x.init(all_settings)
        x.compute_result_status(find_all_flag=True)
        # find_all_flag is False
        partial_settings = x.default_settings()
        partial_settings.search_body = True
        partial_settings.search_headline = True
        partial_settings.node_only = True
        partial_settings.suboutline_only = True
        partial_settings.wrapping = True
        x.init(partial_settings)
        x.compute_result_status(find_all_flag=False)
        
    #@+node:ekr.20210106140751.1: *4* TestFind.replace_back_slashes
    def test_replace_back_slashes(self):
        
        x = self.x
        table = (
            (r'a\bc', r'a\bc'),
            (r'a\\bc', r'a\bc'),
            (r'a\tc', 'a\tc'), # Replace \t by a tab.
            (r'a\nc', 'a\nc'), # Replace \n by a newline.
        )
        for s, expected in table:
            result = x.replace_back_slashes(s)
            assert result == expected, (s, result, expected)
    #@-others
#@-others

if __name__ == '__main__':  # pragma: no cover (not covered by py-cov)
    unittest.main()

#@@language python
#@@tabwidth -4
#@@pagewidth 70
#@-leo
