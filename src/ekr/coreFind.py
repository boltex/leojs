#@+leo-ver=5-thin
#@+node:ekr.20210102145531.1: * @file src/ekr/coreFind.py
"""Leo's gui-independent find classes."""
import re
import sys
import time
import unittest
# pylint: disable=import-self
# from src.ekr import coreFind as g
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
        # Init find options.
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
        # Init user options
        self.use_cff = False  # For find-def
        #
        # Init state.
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
        """Return a dict representing all default settings."""
        c = self.c
        return g.Bunch(
            # State...
            in_headline = False,
            p = c.rootPosition(),
            # Find/change strings...
            find_text = '',
            change_text = '',
            # Find options...
            ignore_case = False,
            node_only = False,
            pattern_match = False,
            reverse = False,
            search_body = True,
            search_headline = True,
            suboutline_only = False,
            whole_word = False,
            wrapping = False,
            # User options.
            use_cff = False,  # For find-def.
        )
    #@+node:ekr.20210103193237.1: *3* LeoFind: Commands
    # All these commands are non-interactive.

    # To do: remove all gui-related code.
    #@+node:ekr.20210102145531.62: *4* clone-find-all/flattened
    @cmd('clone-find-all')
    @cmd('cfa')
    def clone_find_all_cmd(self, settings):
        """
        clone-find-all (aka cfa).

        Create an organizer node whose descendants contain clones of all nodes
        matching the search string, except @nosearch trees.

        The list is *not* flattened: clones appear only once in the
        descendants of the organizer node.
        
        Return the number of found nodes.
        """
        self.init(settings)
        if not self.check_args('clone-find-all'):
            return 0
        return self.clone_find_all_helper(False, settings)

    @cmd('clone-find-all-flattened')
    @cmd('cff')
    def clone_find_all_flattened_cmd(self, settings):
        """
        clone-find-all-flattened (aka cff).

        Create an organizer node whose descendants contain clones of all nodes
        matching the search string, except @nosearch trees.
        """
        self.init(settings)
        if not self.check_args('clone-find-all-flattened'):
            return 0
        return self.clone_find_all_helper(True, settings)
    #@+node:ekr.20210105173904.1: *5* find.clone_find_all_helper & helper
    def clone_find_all_helper(self, flatten, settings):
        """
        The common part of the clone-find commands.
        
        Return the number of found nodes.
        """
        c, u = self.c, self.c.undoer
        if self.pattern_match:
            ok = self.compile_pattern()
            if not ok: return 0
        if self.suboutline_only:
            p = settings.p.copy()
            after = p.nodeAfterTree()
        else:
            p = c.rootPosition()
            after = None
        count, found = 0, None
        clones, skip = [], set()
        while p and p != after:
            progress = p.copy()
            if p.v in skip:  # pragma: no cover (minor)
                p.moveToThreadNext()
            elif g.inAtNosearch(p):
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
            if pos != -1:
                return True
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
        c, p, u, w = self.c, self.p, self.c.undoer, self.s_ctrl
        if settings:
            self.init(settings)
        if not self.check_args('find-all'):
            return 0
        if self.pattern_match:
            ok = self.compile_pattern()
            if not ok: return 0
        if self.suboutline_only:
            # Start with p.
            after = p.nodeAfterTree()
        else:
            # Always search the entire outline.
            p = c.rootPosition()
            after = None
        count, found, result = 0, None, []
        while p != after:
            # We can't assert progress on p, because
            # there can be multiple matches in one p.
            p, pos, newpos = self.find_next_match(p)
            if p is None or pos is None:
                 break
            count += 1
            s = w.getAllText()
            i, j = g.getLine(s, pos)
            line = s[i:j]
            if self.search_body and self.search_headline:
                kind = "head" if self.in_headline else "body"
                result.append(
                    f"{'-' * 20} {p.h}\n"
                    f"{kind}: {line.rstrip()}\n\n")
            elif p.isVisited():
                result.append(line.rstrip() + '\n')
            else:
                result.append(
                    f"{'-' * 20} {p.h}\n"
                    f"{line.rstrip()}\n\n")
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
        c = self.c
        tag = 'find-def' if defFlag else 'find-var'
        if settings:
            self.init(settings)
        if not self.check_args(tag):
            return None, None, None
        # Always start in the root position.
        root = c.rootPosition()
        c.redraw(root)  # Required.
        c.bodyWantsFocusNow()
        # Set up the search.
        if defFlag:
            prefix = 'class' if self.find_text[0].isupper() else 'def'
            self.find_text = prefix + ' ' + self.find_text
        else:
            self.find_text = self.find_text + ' ='
        # Save previous settings.
        self.saveBeforeFindDef(root)
        self.setFindDefOptions(root)
        count, found = 0, False
        self.find_seen = set()
        if settings.use_cff:
            count = self.clone_find_all_flattened_cmd(settings)
            found = count > 0
        else:
            # #1592.  Ignore hits under control of @nosearch
            p = root
            while p:
                progress = p.v
                p, pos, newpos = self.find_next_match(p)
                found = pos is not None
                if found and not g.inAtNosearch(p):
                    break
                assert not p or p.v != progress, p.h  
        if not found and defFlag and not self.find_text.startswith('class'):
            # Leo 5.7.3: Look for an alternative defintion of function/methods.
            word2 = self.switchStyle(self.find_text)
            if word2:
                self.find_text = prefix + ' ' + word2
                if settings.use_cff:
                    count = self.clone_find_all_cmd(settings)
                    found = count > 0
                else:
                    # #1592.  Ignore hits under control of @nosearch
                    p = root  # bug fix!
                    while p:
                        progress = p.v
                        p, pos, newpos = self.find_next_match(p)
                        found = pos is not None
                        if found and not g.inAtNosearch(p):
                            break  # pragma: no cover (minor)
                        assert not p or p.v != progress, p.h
        if not found:
            return None, None, None
        if settings.use_cff:
            last = c.lastTopLevel()
            if count == 1:
                # It's annoying to create a clone in this case.
                # Undo the clone find and just select the proper node.
                last.doDelete()
                self.find_next_match(root)
            else:  # pragma: no cover (to do)
                c.selectPosition(last)
            return None, None, last
        self.restoreAfterFindDef()
            # Failing to do this causes massive confusion!
        return p, pos, newpos
        
    #@+node:ekr.20210102145531.33: *6* find.restoreAfterFindDef
    def restoreAfterFindDef(self):
        """Restore find settings in effect before a find-def command."""
        # pylint: disable=no-member
            # Bunch has these members
        b = self.find_def_data  # A g.Bunch
        if b:
            self.ignore_case = b.ignore_case
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
                return None  # pragma: no cover (to do)
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
        # pragma: no cover (to do)
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
    def find_next(self, settings):
        """The find-next command."""
        assert settings
        self.init(settings)
        if not self.check_args('find-next'):
            return None, None, None
        p = self.p
        p, pos, newpos = self.find_next_match(p)
        return p, pos, newpos # For tests.
    #@+node:ekr.20210102145531.35: *4* find-prev
    @cmd('find-prev')
    def find_prev(self, settings):
        """The find-prev command."""
        assert settings
        self.init(settings)
        if not self.check_args('find-prev'):
            return None, None, None
        p = self.p
        self.reverse = True
        try:
            p, pos, newpos = self.find_next_match(p)
        finally:
            self.reverse = False
        return p, pos, newpos
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
                if count_h and p.h != new_h:
                    count += count_h
                    p.v.h = new_h
                    p.v.setDirty()
            if self.search_body:
                count_b, new_b = self.replace_all_helper(p.b)
                if count_b and p.b != new_b:
                    p.v.b = new_b
                    p.v.setDirty()
            if count_h or count_b:
                u.afterChangeNodeContents(p, undoType, undoData)
        p = c.p
        u.afterChangeGroup(p, undoType, reportFlag=True)
        t2 = time.process_time()
        g.es_print(f"changed {count} instance{g.plural(count)} in {t2 - t1:4.2f} sec.")
        #
        # Bugs #947, #880 and #722:
        # Set ancestor @<file> nodes by brute force.
        for p in c.all_positions():
            if (
                p.anyAtFileNodeName()
                and not p.v.isDirty()
                and any([p2.v.isDirty() for p2 in p.subtree()])
            ):
                p.v.setDirty()
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
            return False, None   # pragma: no cover (minor)
        #
        # Order matters: regex matches ignore whole-word.
        if self.pattern_match:
            return self.batch_regex_replace(s)
        if self.whole_word:
            return self.batch_word_replace(s)
        return self.batch_plain_replace(s)
    #@+node:ekr.20210106081141.3: *6* find.batch_plain_replace
    def batch_plain_replace(self, s):
        """
        Perform all plain find/replace on s.
        return (count, new_s)
        """
        find, change = self.find_text, self.change_text
        # #1166: s0 and find0 aren't affected by ignore-case.
        s0 = s
        find0 = self.replace_back_slashes(find)
        if self.ignore_case:  # pragma: no cover (to do)
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
    #@+node:ekr.20210106081141.4: *6* find.batch_regex_replace
    def batch_regex_replace(self, s):
        """
        Perform all regex find/replace on s.
        return (count, new_s)
        """
        count, prev_i, result = 0, 0, []

        flags = re.MULTILINE
        if self.ignore_case:  # pragma: no cover (to do)
            flags |= re.IGNORECASE
        for m in re.finditer(self.find_text, s, flags):
            count += 1
            i = m.start()
            result.append(s[prev_i:i])
            # #1748.
            groups = m.groups()
            if groups:  # pragma: no cover (to do)
                change_text = self.make_regex_subs(self.change_text, groups)
            else:
                change_text = self.change_text
            result.append(change_text)
            prev_i = m.end()
        # Compute the result.
        result.append(s[prev_i:])
        s = ''.join(result)
        return count, s
    #@+node:ekr.20210106081141.5: *6* find.batch_word_replace
    def batch_word_replace(self, s):
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
            progress = prev_i
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
            prev_i = max(prev_i + 1, i + len(find))  # 2021/01/08 (!)
            assert prev_i > progress, prev_i
        # #1166: Complete the result using s0.
        result.append(s0[prev_i:])
        return count, ''.join(result)
    #@+node:ekr.20210102145531.23: *4* replace-then-find
    @cmd('replace-then-find')
    def replace_then_find(self, settings):
        """Handle the replace-then-find command."""
        p = self.p
        if settings:
            self.init(settings)
        if not self.check_args('replace-then-find'):
            return None, None, None
        if self.change_selection():
            p, pos, newpos = self.find_next_match(p)
            return p, pos, newpos
        return None, None, None

    #@+node:ekr.20210102145531.100: *5* find.change_selection (gui code)
    def change_selection(self):
        """
        Replace selection with self.change_text.
        If no selection, insert self.change_text at the cursor.
        """
        c, p = self.c, self.p
        wrapper = c.frame.body.wrapper
        w = c.edit_widget(p) if self.in_headline else wrapper
        ### For vs-code?
            # if not w:
                # self.in_headline = False
                # w = wrapper
        oldSel = sel = w.getSelectionRange()
        start, end = sel
        if start > end:  # pragma: no cover (may depend on the widget)
            start, end = end, start
        if start == end:
            g.es("no text selected")
            return False
        # Replace the selection in _both_ controls.
        start, end = oldSel
        change_text = self.change_text
        # Perform regex substitutions of \1, \2, ...\9 in the change text.
        if self.pattern_match and self.match_obj:
            groups = self.match_obj.groups()
            if groups:
                change_text = self.make_regex_subs(change_text, groups)
        # change_text = change_text.replace('\\n','\n').replace('\\t','\t')
        change_text = self.replace_back_slashes(change_text)
        for w2 in (w, self.s_ctrl):
            if start != end:
                w2.delete(start, end)
            w2.insert(start, change_text)
            w2.setInsertPoint(start if self.reverse else start + len(change_text))
        # Update the selection for the next match.
        w.setSelectionRange(start, start + len(change_text))
        ### For vs-code?
            # c.widgetWantsFocus(w)
            # # No redraws here: they would destroy the headline selection.
            # if self.in_headline:
                # pass
            # else:
                # c.frame.body.onBodyChanged('Change', oldSel=oldSel)
            # c.frame.tree.updateIcon(p)  # redraw only the icon.
        return True
    #@+node:ekr.20210102145531.68: *4* tag-children
    @cmd('tag-children') 
    def tag_children(self, p, tag):
        """tag-children: Add the given tag to all children of c.p."""
        c = self.c
        tc = c.theTagController
        if not tc:
            g.es_print('nodetags not active')
            return
        for p in p.children():
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
    def find_next_match(self, p):
        """
        Resume the search where it left off.
        
        Return (p, pos, newpos) or (None, None, None)
        """
        attempts = 0
        if self.pattern_match:
            ok = self.compile_pattern()
            if not ok: return None, None, None
        while p:
            pos, newpos = self.search_helper()
            if pos is not None:
                # Success.
                return p, pos, newpos
            # Searching the pane failed: switch to another pane or node.
            if self.shouldStayInNode(p):
                # Switching panes is possible.  Do so.
                self.in_headline = not self.in_headline
                self.initNextText(p)
            else:
                # Switch to the next/prev node, if possible.
                attempts += 1
                p = self.nextNodeAfterFail(p)
                if p:  # Found another node: select the proper pane.
                    # g.trace('Try', p.h)
                    self.in_headline = self.first_search_pane()
                    self.initNextText(p)
        return None, None, None
    #@+node:ekr.20210102145531.117: *5* find.first_search_pane
    def first_search_pane(self):
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
        
        g.trace('can not happen: no search enabled')  # pragma: no cover (defensive)
        return False                                  # pragma: no cover (defensive, search body)
    #@+node:ekr.20210102145531.118: *5* find.initNextText (gui code)
    def initNextText(self, p):
        """
        Init s_ctrl when a search fails. On entry:
        - self.in_headline indicates what text to use.
        - self.reverse indicates how to set the insertion point.
        """
        w = self.s_ctrl
        s = p.h if self.in_headline else p.b
        if self.reverse:
            i, j = w.sel
            if i is not None and j is not None and i != j:
                ins = min(i, j)  # pragma: no cover (minor)
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
        if not p and wrap:  # pragma: no cover (to do)
            # Stateless wrap: Just set wrapPos and p.
            self.wrapPos = 0 if self.reverse else len(p.b)
            p = self.do_wrap()
        if not p:
            return None
        return p
    #@+node:ekr.20210102145531.116: *6* find.do_wrap
    def do_wrap(self):
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
            return True  # pragma: no cover (to do)
        if self.node_only:
            return True  # pragma: no cover (to do)
        if self.suboutline_only:
            if self.onlyPosition:
                if p != self.onlyPosition and not self.onlyPosition.isAncestorOf(p):
                    return True
            else:  # pragma: no cover (defensive)
                g.trace('Can not happen: onlyPosition!', p.h)
                return True
        if c.hoistStack:  # pragma: no cover (to do)
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
    #@+node:ekr.20210102145531.101: *4* find.make_regex_subs
    def make_regex_subs(self, change_text, groups):  # pragma: no cover (to do)
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
            # f"make_regex_subs:\n"
            # f"change_text: {change_text!s}\n"
            # f"     groups: {groups!s}\n"
            # f"     result: {result!s}")
        return result
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
    #@+node:ekr.20210102145531.124: *4* find.search_helper & helpers
    def search_helper(self):
        """
        Search s_ctrl for self.find_text with present options.
        Returns (pos, newpos) or (None,None).
        """
        p, w = self.p, self.s_ctrl
        if self.find_def_data and p.v in self.find_seen:
            # Don't find defs/vars multiple times.
            return None, None  # pragma: no cover (minor)
        index = w.getInsertPoint()
        s = w.getAllText()
        if not s:  # pragma: no cover (minor)
            return None, None
        stopindex = 0 if self.reverse else len(s)
        pos, newpos = self.searchHelper(s, index, stopindex, self.find_text)
        if self.in_headline and not self.search_headline:
            return None, None  # pragma: no cover (minor)
        if not self.in_headline and not self.search_body:
            return None, None  # pragma: no cover (minor)
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
            pos, newpos = self.regex_helper(s, i, j, pattern, backwards, nocase)
        elif backwards:
            pos, newpos = self.backwards_helper(s, i, j, pattern, nocase, word)
        else:
            pos, newpos = self.plain_helper(s, i, j, pattern, nocase, word)
        return pos, newpos
    #@+node:ekr.20210102145531.128: *6* find.backwards_helper
    debugIndices = []

    def backwards_helper(self, s, i, j, pattern, nocase, word):
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
                if k == -1:
                    break
                if self.match_word(s, k, pattern):
                    return k, k + n
                j = max(0, k - 1)
            return -1, -1
        k = s.rfind(pattern, i, j)
        if k == -1:
            return -1, -1
        return k, k + n
    #@+node:ekr.20210102145531.130: *6* find.match_word
    def match_word(self, s, i, pattern):
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
    #@+node:ekr.20210102145531.129: *6* find.plain_helper
    def plain_helper(self, s, i, j, pattern, nocase, word):
        """Do a plain search."""
        if nocase:
            s = s.lower()
            pattern = pattern.lower()
        pattern = self.replace_back_slashes(pattern)
        n = len(pattern)
        if word:
            while 1:
                k = s.find(pattern, i, j)
                if k == -1:
                    break
                if self.match_word(s, k, pattern):
                    return k, k + n
                i = k + n
            return -1, -1
        k = s.find(pattern, i, j)
        if k == -1:
            return -1, -1
        return k, k + n
    #@+node:ekr.20210102145531.127: *6* find.regex_helper
    def regex_helper(self, s, i, j, pattern, backwards, nocase):

        re_obj = self.re_obj  # Use the pre-compiled object
        if not re_obj:  # pragma: no cover (defensive)
            g.trace('can not happen: no re_obj')
            return -1, -1
        if backwards:  # pragma: no cover (to do)
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
            if mo.start() == mo.end():  # pragma: no cover (to do)
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
        self.s = ''      # The widget text
        self.i = 0       # The insert point
        self.sel = 0, 0  # The selection range

    def __repr__(self):  # pragma: no cover (debugging only)
        return f"SearchWidget id: {id(self)}"

    #@+others
    #@+node:ekr.20210103132816.2: *3* SearchWidget.getters
    def getAllText(self):
        return self.s

    def getInsertPoint(self):
        return self.i

    def getSelectionRange(self):  # pragma: no cover (minor)
        return self.sel
    #@+node:ekr.20210103132816.3: *3* SearchWidget.setters
    def delete(self, i, j=None):
        if j is None:  # pragma: no cover (defensive)
            j = i + 1
        self.s = self.s[:i] + self.s[j:]
        self.i = i
        self.sel = i, i

    def insert(self, i, s):
        if not s:  # pragma: no cover (defensive)
            return
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
        self.sel = i, j
        if insert is not None:
            self.i = insert
    #@-others
#@+node:ekr.20210106123815.1: ** class TestFind (unittest.TestCase)
class TestFind (unittest.TestCase):
    """Test cases for coreFind.py"""
    #@+others
    #@+node:ekr.20210106170813.1: *3* TestFind: Birth
    #@+node:ekr.20210107151326.1: *4* TestFind.ctor
    def setUp(self):
        self.c = coreTest.create_app()
        self.x = coreFind.LeoFind(self.c)
        self.settings = self.x.default_settings()
        self.make_test_tree()
    #@+node:ekr.20210106170840.1: *4* TestFind.make_test_tree
    def make_test_tree(self):
        """Make a test tree for other tests"""
        c = self.c
        root = c.rootPosition()
        root.h = 'Root'
        root.b = f"def root():\n    pass\n"
        last = root

        def make_child(n, p):
            p2 = p.insertAsLastChild()
            p2.h = f"child {n}"
            p2.b = f"def child{n}():\n    v{n} = 2\n"
            return p2

        def make_top(n, sib):
            p = sib.insertAfter()
            p.h = f"Node {n}"
            p.b = f"def top{n}():\n    v{n} = 3\n"
            return p
            
        for n in range(0, 4, 3):
            last = make_top(n+1, last)
            child = make_child(n+2, last)
            make_child(n+3, child)
            
        for p in c.all_positions():
            p.v.clearDirty()
            p.v.clearVisited()

    #@+node:ekr.20210106170636.1: *4* TestFind.test_tree
    def test_tree(self):
        table = (
            (0, 'Root'),
            (0, 'Node 1'),
            (1, 'child 2'),
            (2, 'child 3'),
            (0, 'Node 4'),
            (1, 'child 5'),
            (2, 'child 6'),
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
        settings, x = self.settings, self.x
        # Regex find.
        settings.find_text = r'^def\b'
        settings.change_text = 'def'  # Don't actually change anything!
        settings.pattern_match = True
        x.clone_find_all_cmd(settings)
        # Word find.
        settings.find_text = 'def'
        settings.match_word = True
        settings.pattern_match = False
        x.clone_find_all_cmd(settings)
        # Suboutline only.
        settings.suboutline_only = True
        x.clone_find_all_cmd(settings)
    #@+node:ekr.20210106133012.1: *4* TestFind.clone-find-all-flattened
    def test_clone_find_all_flattened(self):
        settings, x = self.settings, self.x
        # regex find.
        settings.find_text = r'^def\b'
        settings.pattern_match = True
        x.clone_find_all_flattened_cmd(settings)
        # word find.
        settings.find_text = 'def'
        settings.match_word = True
        settings.pattern_match = False
        x.clone_find_all_flattened_cmd(settings)
        # Suboutline only.
        settings.suboutline_only = True
        x.clone_find_all_flattened_cmd(settings)
    #@+node:ekr.20210106215700.1: *4* TestFind.clone-find-tag
    def test_clone_find_tag(self):
        c, x = self.c, self.x
        
        class DummyTagController:
            
            def __init__(self, clones):
                self.clones = clones
                
            def get_tagged_nodes(self, tag):
                return self.clones
                
            def show_all_tags(self):
                pass

        c.theTagController = DummyTagController([c.rootPosition()])
        x.clone_find_tag('test')
        c.theTagController = DummyTagController([])
        x.clone_find_tag('test')
        c.theTagController = None
        x.clone_find_tag('test')
    #@+node:ekr.20210106141951.1: *4* TestFind.find-all
    def test_find_all(self):
        settings, x = self.settings, self.x
        # Test 1.
        settings.find_text = r'^def\b'
        settings.pattern_match = True
        x.find_all(settings)
        # Test 2.
        settings.suboutline_only = True
        x.find_all(settings)
        # Test 3.
        settings.suboutline_only = False
        settings.search_headline = False
        settings.p.setVisited()
        x.find_all(settings)
    #@+node:ekr.20210106173343.1: *4* TestFind.find-next & find-prev
    def test_find_next(self):
        c, settings, x = self.c, self.settings, self.x
        settings.find_text = 'def top1'
        # find-next
        p, pos, newpos = x.find_next(settings)
        assert p and p.h == 'Node 1', p.h
        s = p.b[pos:newpos]
        assert s == settings.find_text, repr(s)
        # find-prev: starts at end, so we stay in the node.
        last = c.lastTopLevel()
        print('last', last.h)
        child = last.firstChild()
        grand_child = child.firstChild()
        assert grand_child.h == 'child 6', grand_child.h
        settings.p = grand_child.copy()
        settings.find_text = 'def child2'
        p, pos, newpos = x.find_prev(settings)
        assert p.h == 'child 2', p.h
        s = p.b[pos:newpos]
        assert s == settings.find_text, repr(s)
    #@+node:ekr.20210106180832.1: *4* TestFind.find-def
    def test_find_def(self):
        c, settings, x = self.c, self.settings, self.x
        root = c.rootPosition()
        settings.find_text = 'child5'
        # Test 1.
        p, pos, newpos = x.find_def(settings)
        assert p and p.h == 'child 5'
        s = p.b[pos:newpos]
        assert s == 'def child5', repr(s)
        # Test 2: switch style.
        settings.find_text = 'child_5'
        x.find_def(settings)
        # Test3: not found after switching style.
        settings.p = root.next()
        settings.find_text = 'def notFound'
        x.find_def(settings)
        
    def test_find_def_use_cff(self):
        settings, x = self.settings, self.x
        settings.find_text = 'child5'
        # Test 1: Set p *without* use_cff.
        p, pos, newpos = x.find_def(settings)
        assert p and p.h == 'child 5'
        s = p.b[pos:newpos]
        assert s == 'def child5', repr(s)
        # Test 2.
        settings.use_cff = True
        x.find_def(settings)
        # Test 3: switch style.
        settings.find_text = 'child_5'
        x.find_def(settings)
    #@+node:ekr.20210106181550.1: *4* TestFind.find-var
    def test_find_var(self):
        settings, x = self.settings, self.x
        settings.find_text = r'v5'
        p, pos, newpos = x.find_var(settings)
        assert p and p.h == 'child 5', repr(p)
        s = p.b[pos:newpos]
        assert s == 'v5 =', repr(s)
    #@+node:ekr.20210106215321.1: *4* TestFind.replace-all
    def test_replace_all(self):
        c, settings, x = self.c, self.settings, self.x
        root = c.rootPosition()
        settings.find_text = 'def'
        settings.change_text = '_DEF_'
        settings.ignore_case = False
        settings.match_word = True
        settings.pattern_match = False
        settings.suboutline_only = False
        x.replace_all(settings)
        # Node only.
        settings.node_only = True
        x.replace_all(settings)
        settings.node_only = False
        # Suboutline only.
        settings.suboutline_only = True
        x.replace_all(settings)
        settings.suboutline_only = False
        # Pattern match.
        settings.pattern_match = True
        x.replace_all(settings)
        # Multiple matches
        root.h = 'abc'
        root.b = 'abc\nxyz abc\n'
        settings.find_text = settings.change_text = 'abc'
        x.replace_all(settings)
        # Set ancestor @file node dirty.
        root.h = '@file xyzzy'
        settings.find_text = settings.change_text = 'child1'
        
    def test_replace_all_with_at_file_node(self):
        c, settings, x = self.c, self.settings, self.x
        root = c.rootPosition().next()  # Must have children.
        settings.find_text = 'def'
        settings.change_text = '_DEF_'
        settings.ignore_case = False
        settings.match_word = True
        settings.pattern_match = False
        settings.suboutline_only = False
        # Ensure that the @file node is marked dirty.
        root.h = '@file xyzzy.py'
        root.b = ''
        root.v.clearDirty()
        assert root.anyAtFileNodeName()
        x.replace_all(settings)
        assert root.v.isDirty(), root.h
        
    def test_replace_all_headline(self):
        settings, x = self.settings, self.x
        settings.find_text = 'child'
        settings.change_text = '_CHILD_'
        settings.ignore_case = False
        settings.in_headline = True
        settings.match_word = True
        settings.pattern_match = False
        settings.suboutline_only = False
        x.replace_all(settings)
    #@+node:ekr.20210107153149.1: *4* TestFind.replace-then-find
    def test_replace_then_find(self):
        settings, w, x = self.settings, self.c.frame.body.wrapper, self.x
        settings.find_text = 'def top1'
        settings.change_text = 'def top'
        # find-next
        p, pos, newpos = x.find_next(settings)
        assert p and p.h == 'Node 1', p.h
        s = p.b[pos:newpos]
        assert s == settings.find_text, repr(s)
        # replace-then-find
        w.setSelectionRange(pos, newpos, insert=pos)
        x.replace_then_find(settings)
        # Failure exit.
        w.setSelectionRange(0, 0)
        x.replace_then_find(settings)
        
    def test_replace_then_find_regex(self):
        settings, w, x = self.settings, self.c.frame.body.wrapper, self.x
        settings.find_text = r'(def) top1'
        settings.change_text = r'\1\1'
        settings.pattern_match = True
        # find-next
        p, pos, newpos = x.find_next(settings)
        s = p.b[pos:newpos]
        assert s == 'def top1', repr(s)
        # replace-then-find
        w.setSelectionRange(pos, newpos, insert=pos)
        x.replace_then_find(settings)
        
    def test_replace_then_find_in_headline(self):
        settings, x = self.settings, self.x
        p = settings.p
        settings.find_text = 'Node 1'
        settings.change_text = 'Node 1a'
        settings.in_headline = True
        # find-next
        p, pos, newpos = x.find_next(settings)
        assert p and p.h == settings.find_text, p.h
        w = self.c.edit_widget(p)
        assert w
        s = p.h[pos:newpos]
        assert s == settings.find_text, repr(s)
    #@+node:ekr.20210107155337.1: *4* TestFind.tag-children
    def test_tag_children(self):
        
        c, x = self.c, self.x
        
        class DummyTagController:
            def add_tag(self, p, tag):
                pass

        p = c.rootPosition().next()
        c.theTagController = None
        x.tag_children(p, 'test')
        c.theTagController = DummyTagController()
        x.tag_children(p, 'test')
    #@+node:ekr.20210106141654.1: *3* Tests of Helpers...
    #@+node:ekr.20210108135526.1: *4* TestFind.backwards_helper
    def test_backwards_helper(self):
        settings, x = self.settings, self.x
        pattern = 'def'
        for nocase in (True, False):
            settings.ignore_case = nocase
            for word in (True, False):
                for s in ('def spam():\n', 'define spam'):
                    settings.whole_word = word
                    x.init(settings)
                    x.backwards_helper(s, 0, len(s), pattern, nocase, word)
                    x.backwards_helper(s, 0, 0, pattern, nocase, word)
    #@+node:ekr.20210106133506.1: *4* TestFind.bad compile_pattern
    def test_argument_errors(self):

        settings, x = self.settings, self.x
        # Bad search pattern.
        settings.find_text = r'^def\b(('
        settings.pattern_match = True
        x.clone_find_all_cmd(settings)
        x.find_next_match(p=None)
        x.replace_all(settings)
    #@+node:ekr.20210108190436.1: *4* TestFind.batch_word_replace
    def test_batch_word_replace(self):
        settings, x = self.settings, self.x
        settings.find_text = 'b'
        settings.change_text = 'B'
        for ignore in (True, False):
            settings.ignore_case = ignore
            x.init(settings)
            s = 'abc b z'
            count, s2 = x.batch_word_replace(s)
            assert count == 1 and s2 == 'abc B z', (ignore, count, repr(s2))
    #@+node:ekr.20210106133737.1: *4* TestFind.check_args
    def test_check_args(self):
        # Bad search patterns..
        x = self.x
        settings = self.settings
        # Not searching headline or body.
        settings.search_body = False
        settings.search_headline = False
        x.clone_find_all_cmd(settings)
        # Empty find pattern.
        settings.search_body = True
        settings.find_text = ''
        x.clone_find_all_cmd(settings)
        x.clone_find_all_flattened_cmd(settings)
        x.find_all(settings)
        x.find_def(settings)
        x.find_var(settings)
        x.find_next(settings)
        x.find_next_match(None)
        x.find_prev(settings)
        x.replace_all(settings)
        x.replace_then_find(settings)
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
    #@+node:ekr.20210108134225.1: *4* TestFind.do_wrap
    def test_do_wrap(self):
        settings, x = self.settings, self.x
        for reverse in (True, False):
            settings.reverse = reverse
            x.init(settings)
            x.do_wrap()

    #@+node:ekr.20210107151414.1: *4* TestFind.dump_tree
    def dump_tree(self, tag=''):  # pragma: no cover (debugging)
        """Dump the test tree created by make_test_tree."""
        c = self.c
        print('dump_tree', tag)
        for p in c.all_positions():
            print(' '*p.level(),  p.h, 'dirty', p.v.isDirty())
            # g.printObj(g.splitLines(p.b), tag=p.h)
    #@+node:ekr.20210108142845.1: *4* TestFind.find_next_batch_match
    def test_find_next_batch_match(self):
        c, settings, x = self.c, self.settings, self.x
        p = c.rootPosition()
        for find in ('xxx', 'def'):
            settings.find_text = find
            x.find_next_batch_match(p)
    #@+node:ekr.20210108141032.1: *4* TestFind.match_word
    def test_match_word(self):
        x = self.x
        x.match_word("def spam():", 0, "spam")
        x.match_word("def spam():", 0, "xxx")
        
    #@+node:ekr.20210108141944.1: *4* TestFind.plain_helper
    def test_plain_helper(self):
        settings, x = self.settings, self.x
        pattern = 'def'
        for nocase in (True, False):
            settings.ignore_case = nocase
            for word in (True, False):
                for s in ('def spam():\n', 'define'):
                    settings.whole_word = word
                    x.init(settings)
                    x.plain_helper(s, 0, len(s), pattern, nocase, word)
                    x.plain_helper(s, 0, 0, pattern, nocase, word)
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
if __name__ == '__main__':  # pragma: no cover (not for py-cov)
    unittest.main()

#@@language python
#@@tabwidth -4
#@@pagewidth 70
#@-leo
