# -*- coding: utf-8 -*-
#@+leo-ver=5-thin
#@+node:ekr.20210102120444.2: * @file src/ekr/coreCommands.py
#@@first
"""Leo's user commands, from various files."""

import os
import re
import sys
import time

# For testing, use the *real* leoGlobals.
from leo.core import leoGlobals as g
# from src.ekr import coreGlobals as g

# Félix: Feel free to ignore.
def cmd(name):
    """Command decorator for the Commands class."""
    # return g.new_cmd_decorator(name, ['c',])

#@+others
#@+node:ekr.20210102121211.1: ** from commanderFindCommands.py
#@+node:ekr.20210102121211.2: *3* c.cffm & c.cfam
@g.commander_command('clone-find-all-marked')
@g.commander_command('cfam')
def cloneFindAllMarked(self, event=None):
    """
    clone-find-all-marked, aka cfam.

    Create an organizer node whose descendants contain clones of all marked
    nodes. The list is *not* flattened: clones appear only once in the
    descendants of the organizer node.
    """
    c = self
    cloneFindMarkedHelper(c, flatten=False)

@g.commander_command('clone-find-all-flattened-marked')
@g.commander_command('cffm')
def cloneFindAllFlattenedMarked(self, event=None):
    """
    clone-find-all-flattened-marked, aka cffm.

    Create an organizer node whose direct children are clones of all marked
    nodes. The list is flattened: every cloned node appears as a direct
    child of the organizer node, even if the clone also is a descendant of
    another cloned node.
    """
    c = self
    cloneFindMarkedHelper(c, flatten=True)
#@+node:ekr.20210102121211.3: *3* c.cloneFindParents
@g.commander_command('clone-find-parents')
def cloneFindParents(self, event=None):
    """
    Create an organizer node whose direct children are clones of all
    parents of the selected node, which must be a clone.
    """
    c, u = self, self.undoer
    p = c.p
    if not p: return
    if not p.isCloned():
        g.es(f"not a clone: {p.h}")
        return
    p0 = p.copy()
    undoType = 'Find Clone Parents'
    aList = c.vnode2allPositions(p.v)
    if not aList:
        g.trace('can not happen: no parents')
        return
    # Create the node as the last top-level node.
    # All existing positions remain valid.
    u.beforeChangeGroup(p0, undoType)
    top = c.rootPosition()
    while top.hasNext():
        top.moveToNext()
    b = u.beforeInsertNode(p0)
    found = top.insertAfter()
    found.h = f"Found: parents of {p.h}"
    u.afterInsertNode(found, 'insert', b)
    seen = []
    for p2 in aList:
        parent = p2.parent()
        if parent and parent.v not in seen:
            seen.append(parent.v)
            b = u.beforeCloneNode(parent)
            clone = parent.clone()
            clone.moveToLastChildOf(found)
            u.afterCloneNode(clone, 'clone', b)
    u.afterChangeGroup(p0, undoType)
    c.selectPosition(found)
    c.setChanged(True)
    c.redraw()
#@+node:ekr.20210102121211.4: *3* def cloneFindMarkedHelper
def cloneFindMarkedHelper(c, flatten):
    """Helper for clone-find-marked commands."""

    def isMarked(p):
        return p.isMarked()

    c.cloneFindByPredicate(
        generator=c.all_unique_positions,
        predicate=isMarked,
        failMsg='No marked nodes',
        flatten=flatten,
        redraw=True,
        undoType='clone-find-marked',
    )
    # Unmarking all nodes is convenient.
    for v in c.all_unique_nodes():
        if v.isMarked():
            v.clearMarked()
    found = c.lastTopLevel()
    c.selectPosition(found)
    found.b = f"# Found {found.numberOfChildren()} marked nodes"
#@+node:ekr.20210110061148.1: ** from importCommands.py
#@+node:ekr.20210110061158.1: *3* class RecursiveImportController
class RecursiveImportController:
    """Recursively import all python files in a directory and clean the result."""
    #@+others
    #@+node:ekr.20210110061158.2: *4* ric.ctor
    def __init__(self, c, kind,
        # force_at_others = False, #tag:no-longer-used
        add_context=None,  # Override setting only if True/False
        add_file_context=None,  # Override setting only if True/False
        add_path=True,
        recursive=True,
        safe_at_file=True,
        theTypes=None,
        ignore_pattern=None,
    ):
        """Ctor for RecursiveImportController class."""
        self.c = c
        self.add_path = add_path
        self.file_pattern = re.compile(r'^(([@])+(auto|clean|edit|file|nosent))')
        self.kind = kind
            # in ('@auto', '@clean', '@edit', '@file', '@nosent')
        # self.force_at_others = force_at_others #tag:no-longer-used
        self.recursive = recursive
        self.root = None
        self.safe_at_file = safe_at_file
        self.theTypes = theTypes
        self.ignore_pattern = ignore_pattern or re.compile(r'\.git|node_modules')
        # #1605:

        def set_bool(setting, val):
            if val not in (True, False):
                return
            c.config.set(None, 'bool', setting, val, warn=True)
            
        set_bool('add-context-to-headlines', add_context)
        set_bool('add-file-context-to-headlines', add_file_context)
    #@+node:ekr.20210110061158.3: *4* ric.run & helpers
    def run(self, dir_):
        """
        Import all files whose extension matches self.theTypes in dir_.
        In fact, dir_ can be a path to a single file.
        """
        if self.kind not in ('@auto', '@clean', '@edit', '@file', '@nosent'):
            g.es('bad kind param', self.kind, color='red')
        try:
            c = self.c
            p1 = self.root = c.p
            t1 = time.time()
            g.app.disable_redraw = True
            bunch = c.undoer.beforeChangeTree(p1)
            # Leo 5.6: Always create a new last top-level node.
            last = c.lastTopLevel()
            parent = last.insertAfter()
            parent.v.h = 'imported files'
            # Leo 5.6: Special case for a single file.
            self.n_files = 0
            if g.os_path_isfile(dir_):
                g.es_print('\nimporting file:', dir_)
                self.import_one_file(dir_, parent)
            else:
                self.import_dir(dir_, parent)
            self.post_process(parent, dir_)
                # Fix # 1033.
            c.undoer.afterChangeTree(p1, 'recursive-import', bunch)
        except Exception:
            g.es_print('Exception in recursive import')
            g.es_exception()
        finally:
            g.app.disable_redraw = False
            for p2 in parent.self_and_subtree(copy=False):
                p2.contract()
            c.redraw(parent)
        t2 = time.time()
        n = len(list(parent.self_and_subtree()))
        g.es_print(
            f"imported {n} node{g.plural(n)} "
            f"in {self.n_files} file{g.plural(self.n_files)} "
            f"in {t2 - t1:2.2f} seconds")
    #@+node:ekr.20210110061158.4: *5* ric.import_dir
    def import_dir(self, dir_, parent):
        """Import selected files from dir_, a directory."""
        if g.os_path_isfile(dir_):
            files = [dir_]
        else:
            g.es_print('importing directory:', dir_)
            files = os.listdir(dir_)
        dirs, files2 = [], []
        for path in files:
            try:
                # Fix #408. Catch path exceptions.
                # The idea here is to keep going on small errors.
                path = g.os_path_join(dir_, path)
                if g.os_path_isfile(path):
                    name, ext = g.os_path_splitext(path)
                    if ext in self.theTypes:
                        files2.append(path)
                elif self.recursive:
                    if not self.ignore_pattern.search(path):
                        dirs.append(path)
            except OSError:
                g.es_print('Exception computing', path)
                g.es_exception()
        if files or dirs:
            assert parent and parent.v != self.root.v, g.callers()
            parent = parent.insertAsLastChild()
            parent.v.h = dir_
            if files2:
                for f in files2:
                    if not self.ignore_pattern.search(f):
                        self.import_one_file(f, parent=parent)
            if dirs:
                assert self.recursive
                for dir_ in sorted(dirs):
                    self.import_dir(dir_, parent)
    #@+node:ekr.20210110061158.5: *5* ric.import_one_file
    def import_one_file(self, path, parent):
        """Import one file to the last top-level node."""
        c = self.c
        self.n_files += 1
        assert parent and parent.v != self.root.v, g.callers()
        if self.kind == '@edit':
            p = parent.insertAsLastChild()
            p.v.h = path.replace('\\', '/')
            s, e = g.readFileIntoString(path, kind=self.kind)
            p.v.b = s
            return
        # #1484: Use this for @auto as well.
        c.importCommands.importFilesCommand(
            files=[path],
            parent=parent,
            redrawFlag=False,
            shortFn=True,
            treeType='@file',  # '@auto','@clean','@nosent' cause problems.
        )
        p = parent.lastChild()
        p.h = self.kind + p.h[5:]
            # Bug fix 2017/10/27: honor the requested kind.
        if self.safe_at_file:
            p.v.h = '@' + p.v.h
    #@+node:ekr.20210110061158.6: *5* ric.post_process & helpers
    def post_process(self, p, prefix):
        """
        Traverse p's tree, replacing all nodes that start with prefix
        by the smallest equivalent @path or @file node.
        """
        self.fix_back_slashes(p)
        prefix = prefix.replace('\\', '/')
        if self.kind not in ('@auto', '@edit'):
            self.remove_empty_nodes(p)
        if p.firstChild():
            self.minimize_headlines(p.firstChild(), prefix)
        self.clear_dirty_bits(p)
        self.add_class_names(p)
    #@+node:ekr.20210110061158.7: *6* ric.add_class_names
    def add_class_names(self, p):
        """Add class names to headlines for all descendant nodes."""
        # pylint: disable=no-else-continue
        after, class_name = None, None
        class_paren_pattern = re.compile(r'(.*)\(.*\)\.(.*)')
        paren_pattern = re.compile(r'(.*)\(.*\.py\)')
        for p in p.self_and_subtree(copy=False):
            # Part 1: update the status.
            m = self.file_pattern.match(p.h)
            if m:
                # prefix = m.group(1)
                # fn = g.shortFileName(p.h[len(prefix):].strip())
                after, class_name = None, None
                continue
            elif p.h.startswith('@path '):
                after, class_name = None, None
            elif p.h.startswith('class '):
                class_name = p.h[5:].strip()
                if class_name:
                    after = p.nodeAfterTree()
                    continue
            elif p == after:
                after, class_name = None, None
            # Part 2: update the headline.
            if class_name:
                if p.h.startswith(class_name):
                    m = class_paren_pattern.match(p.h)
                    if m:
                        p.h = f"{m.group(1)}.{m.group(2)}".rstrip()
                else:
                    p.h = f"{class_name}.{p.h}"
            else:
                m = paren_pattern.match(p.h)
                if m:
                    p.h = m.group(1).rstrip()
            # elif fn:
                # tag = ' (%s)' % fn
                # if not p.h.endswith(tag):
                    # p.h += tag
    #@+node:ekr.20210110061158.8: *6* ric.clear_dirty_bits
    def clear_dirty_bits(self, p):
        c = self.c
        c.clearChanged()  # Clears *all* dirty bits.
        for p in p.self_and_subtree(copy=False):
            p.clearDirty()
    #@+node:ekr.20210110061158.9: *6* ric.dump_headlines
    def dump_headlines(self, p):
        # show all headlines.
        for p in p.self_and_subtree(copy=False):
            print(p.h)
    #@+node:ekr.20210110061158.10: *6* ric.fix_back_slashes
    def fix_back_slashes(self, p):
        """Convert backslash to slash in all headlines."""
        for p in p.self_and_subtree(copy=False):
            s = p.h.replace('\\', '/')
            if s != p.h:
                p.v.h = s
    #@+node:ekr.20210110061158.11: *6* ric.minimize_headlines & helper
    def minimize_headlines(self, p, prefix):
        """Create @path nodes to minimize the paths required in descendant nodes."""
        if prefix and not prefix.endswith('/'):
            prefix = prefix + '/'
        m = self.file_pattern.match(p.h)
        if m:
            # It's an @file node of some kind. Strip off the prefix.
            kind = m.group(0)
            path = p.h[len(kind) :].strip()
            stripped = self.strip_prefix(path, prefix)
            p.h = f"{kind} {stripped or path}"
            # Put the *full* @path directive in the body.
            if self.add_path and prefix:
                tail = g.os_path_dirname(stripped).rstrip('/')
                p.b = f"@path {prefix}{tail}\n{p.b}"
        else:
            # p.h is a path.
            path = p.h
            stripped = self.strip_prefix(path, prefix)
            p.h = f"@path {stripped or path}"
            for p in p.children():
                self.minimize_headlines(p, prefix + stripped)
    #@+node:ekr.20210110061158.12: *7* ric.strip_prefix
    def strip_prefix(self, path, prefix):
        """Strip the prefix from the path and return the result."""
        if path.startswith(prefix):
            return path[len(prefix) :]
        return ''  # A signal.
    #@+node:ekr.20210110061158.13: *6* ric.remove_empty_nodes
    def remove_empty_nodes(self, p):
        """Remove empty nodes. Not called for @auto or @edit trees."""
        c = self.c
        aList = [
            p2 for p2 in p.self_and_subtree()
                if not p2.b and not p2.hasChildren()]
        if aList:
            c.deletePositionsInList(aList, redraw=False)
    #@-others
#@+node:ekr.20210102120444.3: ** from leoCommands.py
#@+node:ekr.20210102120444.4: *3* c.cloneFindByPredicated
def cloneFindByPredicate(self,
    generator,  # The generator used to traverse the tree.
    predicate,  # A function of one argument p, returning True
                   # if p should be included in the results.
    failMsg=None,  # Failure message. Default is no message.
    flatten=False,  # True: Put all matches at the top level.
    iconPath=None,  # Full path to icon to attach to all matches.
    redraw=True,  # True: redraw the outline,
    undoType=None,  # The undo name, shown in the Edit:Undo menu.
                   # The default is 'clone-find-predicate'
):
    """
    Traverse the tree given using the generator, cloning all positions for
    which predicate(p) is True. Undoably move all clones to a new node, created
    as the last top-level node. Returns the newly-created node. Arguments:

    generator,      The generator used to traverse the tree.
    predicate,      A function of one argument p returning true if p should be included.
    failMsg=None,   Message given if nothing found. Default is no message.
    flatten=False,  True: Move all node to be parents of the root node.
    iconPath=None,  Full path to icon to attach to all matches.
    redraw=True,    True: redraw the screen.
    undo_type=None, The undo/redo name shown in the Edit:Undo menu.
                    The default is 'clone-find-predicate'
    """
    c = self
    u, undoType = c.undoer, undoType or 'clone-find-predicate'
    clones, root, seen = [], None, set()
    for p in generator():
        if predicate(p) and p.v not in seen:
            c.setCloneFindByPredicateIcon(iconPath, p)
            if flatten:
                seen.add(p.v)
            else:
                for p2 in p.self_and_subtree(copy=False):
                    seen.add(p2.v)
            clones.append(p.copy())
    if clones:
        undoData = u.beforeInsertNode(c.p)
        root = c.createCloneFindPredicateRoot(flatten, undoType)
        for p in clones:
            clone = p.clone()
            clone.moveToLastChildOf(root)
        u.afterInsertNode(root, undoType, undoData)
        if redraw:
            c.selectPosition(root)
            c.setChanged()
            c.contractAllHeadlines()
            root.expand()
            c.redraw()
            c.selectPosition(root)
    elif failMsg:
        g.es_print(failMsg, color='red')
    return root
#@+node:ekr.20210102120444.5: *4* c.setCloneFindByPredicateIcon
def setCloneFindByPredicateIcon(self, iconPath, p):
    """Attach an icon to p.v.u."""
    if iconPath and g.os_path_exists(iconPath) and not g.os_path_isdir(iconPath):
        aList = p.v.u.get('icons', [])
        for d in aList:
            if d.get('file') == iconPath:
                break
        else:
            aList.append({
                'type': 'file',
                'file': iconPath,
                'on': 'VNode',
                # 'relPath': iconPath,
                'where': 'beforeHeadline',
                'xoffset': 2, 'xpad': 1,
                'yoffset': 0,

            })
            p.v.u['icons'] = aList
    elif iconPath:
        g.trace('bad icon path', iconPath)
#@+node:ekr.20210102120444.6: *4* c.createCloneFindPredicateRoot
def createCloneFindPredicateRoot(self, flatten, undoType):
    """Create a root node for clone-find-predicate."""
    c = self
    root = c.lastTopLevel().insertAfter()
    root.h = undoType + (' (flattened)' if flatten else '')
    return root
#@+node:ekr.20210102120444.8: *3* c.deletePositionsInList
def deletePositionsInList(self, aList, redraw=True):
    """
    Delete all vnodes corresponding to the positions in aList.

    See "Theory of operation of c.deletePositionsInList" in LeoDocs.leo.
    """
    # New implementation by Vitalije 2020-03-17 17:29 
    c = self
    # Ensure all positions are valid.
    aList = [p for p in aList if c.positionExists(p)]
    if not aList:
        return []

    def p2link(p):
        parent_v = p.stack[-1][0] if p.stack else c.hiddenRootNode
        return p._childIndex, parent_v

    links_to_be_cut = sorted(set(map(p2link, aList)), key=lambda x:-x[0])
    undodata = []
    for i, v in links_to_be_cut:
        ch = v.children.pop(i)
        ch.parents.remove(v)
        undodata.append((v.gnx, i, ch.gnx))
    if redraw:
        if not c.positionExists(c.p):
            c.setCurrentPosition(c.rootPosition())
        c.redraw()
    return undodata

#@+node:ekr.20210102120444.9: *3* c.undoableDeletePositions
def undoableDeletePositions(self, aList):
    """
    Deletes all vnodes corresponding to the positions in aList,
    and make changes undoable.
    """
    c = self
    u = c.undoer
    data = c.deletePositionsInList(aList)
    gnx2v = c.fileCommands.gnxDict
    def undo():
        for pgnx, i, chgnx in reversed(u.getBead(u.bead).data):
            v = gnx2v[pgnx]
            ch = gnx2v[chgnx]
            v.children.insert(i, ch)
            ch.parents.append(v)
        if not c.positionExists(c.p):
            c.setCurrentPosition(c.rootPosition())
    def redo():
        for pgnx, i, chgnx in u.getBead(u.bead + 1).data:
            v = gnx2v[pgnx]
            ch = v.children.pop(i)
            ch.parents.remove(v)
        if not c.positionExists(c.p):
            c.setCurrentPosition(c.rootPosition())
    u.pushBead(g.Bunch(
        data=data,
        undoType='delete nodes',
        undoHelper=undo,
        redoHelper=redo,
    ))
#@+node:ekr.20210102120444.10: *3* c.recursiveImport
def recursiveImport(self, dir_, kind,
    add_context=None,  # Override setting only if True/False
    add_file_context=None,  # Override setting only if True/False
    add_path=True,
    recursive=True,
    safe_at_file=True,
    theTypes=None,
    # force_at_others=False, # tag:no-longer-used
    ignore_pattern=None
):
    #@+<< docstring >>
    #@+node:ekr.20210102120444.11: *4* << docstring >>
    """
    Recursively import all python files in a directory and clean the results.

    Parameters::
        dir_              The root directory or file to import.
        kind              One of ('@clean','@edit','@file','@nosent').
        add_path=True     True: add a full @path directive to @<file> nodes.
        recursive=True    True: recurse into subdirectories.
        safe_at_file=True True: produce @@file nodes instead of @file nodes.
        theTypes=None     A list of file extensions to import.
                          None is equivalent to ['.py']

    This method cleans imported files as follows:

    - Replace backslashes with forward slashes in headlines.
    - Remove empty nodes.
    - Add @path directives that reduce the needed path specifiers in descendant nodes.
    - Add @file to nodes or replace @file with @@file.
    """
    #@-<< docstring >>
    c = self
    if g.os_path_exists(dir_):
        # Import all files in dir_ after c.p.
        try:
            from leo.core import leoImport
            cc = leoImport.RecursiveImportController(c, kind,
                add_context=add_context,
                add_file_context=add_file_context,
                add_path=add_path,
                recursive=recursive,
                safe_at_file=safe_at_file,
                theTypes=['.py'] if not theTypes else theTypes,
                # force_at_others = force_at_others,  # tag:no-longer-used
                ignore_pattern=ignore_pattern
            )
            cc.run(dir_)
        finally:
            c.redraw()
    else:
        g.es_print(f"Does not exist: {dir_}")
#@+node:ekr.20210102120444.12: *3* @cmd c.executeScript & public helpers
@cmd('execute-script')
def executeScript(self, event=None,
    args=None, p=None, script=None, useSelectedText=True,
    define_g=True, define_name='__main__',
    silent=False, namespace=None, raiseFlag=False,
    runPyflakes=True,
):
    """
    Execute a *Leo* script.
    Keyword args:
    args=None               Not None: set script_args in the execution environment.
    p=None                  Get the script from p.b, unless script is given.
    script=None             None: use script in p.b or c.p.b
    useSelectedText=True    False: use all the text in p.b or c.p.b.
    define_g=True           True: define g for the script.
    define_name='__main__'  Not None: define the name symbol.
    silent=False            No longer used.
    namespace=None          Not None: execute the script in this namespace.
    raiseFlag=False         True: reraise any exceptions.
    runPyflakes=True        True: run pyflakes if allowed by setting.
    """
    c, script1 = self, script
    if runPyflakes:
        run_pyflakes = c.config.getBool('run-pyflakes-on-write', default=False)
    else:
        run_pyflakes = False
    if not script:
        if c.forceExecuteEntireBody:
            useSelectedText = False
        script = g.getScript(c, p or c.p, useSelectedText=useSelectedText)
    script_p = p or c.p
        # Only for error reporting below.
    # #532: check all scripts with pyflakes.
    if run_pyflakes and not g.unitTesting:
        from leo.commands import checkerCommands as cc
        # at = c.atFileCommands
        prefix = ('c,g,p,script_gnx=None,None,None,None;'
                  'assert c and g and p and script_gnx;\n')
        cc.PyflakesCommand(c).check_script(script_p, prefix + script)
    self.redirectScriptOutput()
    try:
        oldLog = g.app.log
        log = c.frame.log
        g.app.log = log
        if script.strip():
            sys.path.insert(0, '.')  # New in Leo 5.0
            sys.path.insert(0, c.frame.openDirectory)  # per SegundoBob
            script += '\n'  # Make sure we end the script properly.
            try:
                if not namespace or namespace.get('script_gnx') is None:
                    namespace = namespace or {}
                    namespace.update(script_gnx=script_p.gnx)
                # We *always* execute the script with p = c.p.
                c.executeScriptHelper(args, define_g, define_name, namespace, script)
            except KeyboardInterrupt:
                g.es('interrupted')
            except Exception:
                if raiseFlag:
                    raise
                g.handleScriptException(c, script_p, script, script1)
            finally:
                del sys.path[0]
                del sys.path[0]
        else:
            tabName = log and hasattr(log, 'tabName') and log.tabName or 'Log'
            g.warning("no script selected", tabName=tabName)
    finally:
        g.app.log = oldLog
        self.unredirectScriptOutput()
#@+node:ekr.20210102120444.13: *4* c.executeScriptHelper
def executeScriptHelper(self, args, define_g, define_name, namespace, script):
    c = self
    if c.p:
        p = c.p.copy()  # *Always* use c.p and pass c.p to script.
        c.setCurrentDirectoryFromContext(p)
    else:
        p = None
    d = {'c': c, 'g': g, 'input': g.input_, 'p': p} if define_g else {}
    if define_name: d['__name__'] = define_name
    d['script_args'] = args or []
    d['script_gnx'] = g.app.scriptDict.get('script_gnx')
    if namespace: d.update(namespace)
    #
    # A kludge: reset c.inCommand here to handle the case where we *never* return.
    # (This can happen when there are multiple event loops.)
    # This does not prevent zombie windows if the script puts up a dialog...
    try:
        c.inCommand = False
        g.inScript = g.app.inScript = True
            # g.inScript is a synonym for g.app.inScript.
        if c.write_script_file:
            scriptFile = self.writeScriptFile(script)
            exec(compile(script, scriptFile, 'exec'), d)
        else:
            exec(script, d)
    finally:
        g.inScript = g.app.inScript = False
#@+node:ekr.20210102120444.14: *4* c.redirectScriptOutput
def redirectScriptOutput(self):
    c = self
    if c.config.redirect_execute_script_output_to_log_pane:
        g.redirectStdout()  # Redirect stdout
        g.redirectStderr()  # Redirect stderr
#@+node:ekr.20210102120444.15: *4* c.setCurrentDirectoryFromContext
def setCurrentDirectoryFromContext(self, p):
    c = self
    aList = g.get_directives_dict_list(p)
    path = c.scanAtPathDirectives(aList)
    curDir = g.os_path_abspath(os.getcwd())
    if path and path != curDir:
        try:
            os.chdir(path)
        except Exception:
            pass
#@+node:ekr.20210102120444.16: *4* c.unredirectScriptOutput
def unredirectScriptOutput(self):
    c = self
    if c.exists and c.config.redirect_execute_script_output_to_log_pane:
        g.restoreStderr()
        g.restoreStdout()
#@+node:ekr.20210102120444.17: *3* c.Git (low priority)
#@+node:ekr.20210102120444.18: *4* c.diff_file
def diff_file(self, fn, rev1='HEAD', rev2='', directory=None):
    """
    Create an outline describing the git diffs for all files changed
    between rev1 and rev2.
    """
    from leo.commands import editFileCommands as efc
    x = efc.GitDiffController(c=self)
    x.diff_file(directory=directory, fn=fn, rev1=rev1, rev2=rev2)
#@+node:ekr.20210102120444.19: *4* c.diff_two_revs
def diff_two_revs(self, directory=None, rev1='', rev2=''):
    """
    Create an outline describing the git diffs for all files changed
    between rev1 and rev2.
    """
    from leo.commands import editFileCommands as efc
    efc.GitDiffController(c=self).diff_two_revs(
        directory=directory,
        rev1=rev1,
        rev2=rev2,
    )
#@+node:ekr.20210102120444.20: *4* c.diff_two_branches
def diff_two_branches(self, branch1, branch2, fn, directory=None):
    """
    Create an outline describing the git diffs for all files changed
    between rev1 and rev2.
    """
    from leo.commands import editFileCommands as efc
    efc.GitDiffController(c=self).diff_two_branches(
        branch1=branch1,
        branch2=branch2,
        directory=directory,
        fn=fn,
    )
#@+node:ekr.20210102120444.21: *4* c.git_diff
def git_diff(self, rev1='HEAD', rev2='', directory=None):

    from leo.commands import editFileCommands as efc
    efc.GitDiffController(c=self).git_diff(
        directory=directory,
        rev1=rev1,
        rev2=rev2,
    )
#@+node:ekr.20210102120444.22: *3* c.File (necessary??)
#@+node:ekr.20210102120444.23: *4* c.archivedPositionToPosition (new)
def archivedPositionToPosition(self, s):
    """Convert an archived position (a string) to a position."""
    c = self
    s = g.toUnicode(s)
    aList = s.split(',')
    try:
        aList = [int(z) for z in aList]
    except Exception:
        aList = None
    if not aList:
        return None
    p = c.rootPosition()
    level = 0
    while level < len(aList):
        i = aList[level]
        while i > 0:
            if p.hasNext():
                p.moveToNext()
                i -= 1
            else:
                return None
        level += 1
        if level < len(aList):
            p.moveToFirstChild()
    return p
#@+node:ekr.20210102120444.24: *4* c.backup
def backup(self, fileName=None, prefix=None, silent=False, useTimeStamp=True):
    """
    Back up given fileName or c.fileName().
    If useTimeStamp is True, append a timestamp to the filename.
    """
    c = self
    fn = fileName or c.fileName()
    if not fn:
        return None
    theDir, base = g.os_path_split(fn)
    if useTimeStamp:
        if base.endswith('.leo'):
            base = base[:-4]
        stamp = time.strftime("%Y%m%d-%H%M%S")
        branch = prefix + '-' if prefix else ''
        fn = f"{branch}{base}-{stamp}.leo"
        path = g.os_path_finalize_join(theDir, fn)
    else:
        path = fn
    if path:
        # pylint: disable=no-member
            # Defined in commanderFileCommands.py.
        c.saveTo(fileName=path, silent=silent)
            # Issues saved message.
        # g.es('in', theDir)
    return path
#@+node:ekr.20210102120444.25: *4* c.backup_helper
def backup_helper(self,
    base_dir=None,
    env_key='LEO_BACKUP',
    sub_dir=None,
    use_git_prefix=True,
):
    """
    A helper for scripts that back up a .leo file.
    Use os.environ[env_key] as the base_dir only if base_dir is not given.
    Backup to base_dir or join(base_dir, sub_dir).
    """
    c = self
    old_cwd = os.getcwd()
    join = g.os_path_finalize_join
    if not base_dir:
        if env_key:
            try:
                base_dir = os.environ[env_key]
            except KeyError:
                print(f"No environment var: {env_key}")
                base_dir = None
    if base_dir and g.os_path_exists(base_dir):
        if use_git_prefix:
            git_branch, junk = g.gitInfo()
        else:
            git_branch = None
        theDir, fn = g.os_path_split(c.fileName())
        backup_dir = join(base_dir, sub_dir) if sub_dir else base_dir
        path = join(backup_dir, fn)
        if g.os_path_exists(backup_dir):
            written_fn = c.backup(
                path,
                prefix=git_branch,
                silent=True,
                useTimeStamp=True,
            )
            g.es_print(f"wrote: {written_fn}")
        else:
            g.es_print(f"backup_dir not found: {backup_dir!r}")
    else:
        g.es_print(f"base_dir not found: {base_dir!r}")
    os.chdir(old_cwd)
#@+node:ekr.20210102120444.26: *4* c.checkFileTimeStamp
def checkFileTimeStamp(self, fn):
    """
    Return True if the file given by fn has not been changed
    since Leo read it or if the user agrees to overwrite it.
    """
    c = self
    if g.app.externalFilesController:
        return g.app.externalFilesController.check_overwrite(c, fn)
    return True
#@+node:ekr.20210102120444.27: *4* c.createNodeFromExternalFile
def createNodeFromExternalFile(self, fn):
    """
    Read the file into a node.
    Return None, indicating that c.open should set focus.
    """
    c = self
    s, e = g.readFileIntoString(fn)
    if s is None: return
    head, ext = g.os_path_splitext(fn)
    if ext.startswith('.'): ext = ext[1:]
    language = g.app.extension_dict.get(ext)
    if language:
        prefix = f"@color\n@language {language}\n\n"
    else:
        prefix = '@killcolor\n\n'
    # pylint: disable=no-member
    # Defined in commanderOutlineCommands.py
    p2 = c.insertHeadline(op_name='Open File', as_child=False)
    p2.h = f"@edit {fn}"
    p2.b = prefix + s
    w = c.frame.body.wrapper
    if w: w.setInsertPoint(0)
    c.redraw()
    c.recolor()
#@+node:ekr.20210102120444.28: *4* c.looksLikeDerivedFile
def looksLikeDerivedFile(self, fn):
    """
    Return True if fn names a file that looks like an
    external file written by Leo.
    """
    # c = self
    try:
        with open(fn, 'rb') as f:  # 2020/11/14: Allow unicode characters!
            s = f.read()
            s = g.toUnicode(s)
        return s.find('@+leo-ver=') > -1
    except Exception:
        g.es_exception()
        return False
#@+node:ekr.20210102120444.29: *4* c.markAllAtFileNodesDirty
def markAllAtFileNodesDirty(self, event=None):
    """Mark all @file nodes as changed."""
    c = self
    c.endEditing()
    p = c.rootPosition()
    while p:
        if p.isAtFileNode():
            p.setDirty()
            c.setChanged()
            p.moveToNodeAfterTree()
        else:
            p.moveToThreadNext()
    c.redraw_after_icons_changed()
#@+node:ekr.20210102120444.30: *4* c.markAtFileNodesDirty
def markAtFileNodesDirty(self, event=None):
    """Mark all @file nodes in the selected tree as changed."""
    c = self
    p = c.p
    if not p:
        return
    c.endEditing()
    after = p.nodeAfterTree()
    while p and p != after:
        if p.isAtFileNode():
            p.setDirty()
            c.setChanged()
            p.moveToNodeAfterTree()
        else:
            p.moveToThreadNext()
    c.redraw_after_icons_changed()
#@+node:ekr.20210102120444.31: *4* c.recreateGnxDict
def recreateGnxDict(self):
    """Recreate the gnx dict prior to refreshing nodes from disk."""
    c, d = self, {}
    for v in c.all_unique_nodes():
        gnxString = v.fileIndex
        if isinstance(gnxString, str):
            d[gnxString] = v
            if 'gnx' in g.app.debug:
                g.trace(c.shortFileName(), gnxString, v)
        else:
            g.internalError(f"no gnx for vnode: {v}")
    c.fileCommands.gnxDict = d
#@+node:ekr.20210102120444.32: *3* c.expand_path_expression
def expand_path_expression(self, s):
    """Expand all {{anExpression}} in c's context."""
    c = self
    if not s:
        return ''
    s = g.toUnicode(s)
    # find and replace repeated path expressions
    previ, aList = 0, []
    while previ < len(s):
        i = s.find('{{', previ)
        j = s.find('}}', previ)
        if -1 < i < j:
            # Add anything from previous index up to '{{'
            if previ < i:
                aList.append(s[previ:i])
            # Get expression and find substitute
            exp = s[i + 2 : j].strip()
            if exp:
                try:
                    s2 = c.replace_path_expression(exp)
                    aList.append(s2)
                except Exception:
                    g.es(f"Exception evaluating {{{{{exp}}}}} in {s.strip()}")
                    g.es_exception(full=True, c=c)
            # Prepare to search again after the last '}}'
            previ = j + 2
        else:
            # Add trailing fragment (fragile in case of mismatched '{{'/'}}')
            aList.append(s[previ:])
            break
    val = ''.join(aList)
    if g.isWindows:
        val = val.replace('\\', '/')
    return val
#@+node:ekr.20210102120444.33: *4* c.replace_path_expression
replace_errors = []

def replace_path_expression(self, expr):
    """ local function to replace a single path expression."""
    c = self
    d = {
        'c': c,
        'g': g,
        # 'getString': c.config.getString,
        'p': c.p,
        'os': os,
        'sep': os.sep,
        'sys': sys,
    }
    # #1338: Don't report errors when called by g.getUrlFromNode.
    try:
        # pylint: disable=eval-used
        path = eval(expr, d)
        return g.toUnicode(path, encoding='utf-8')
    except Exception as e:
        message = (
            f"{c.shortFileName()}: {c.p.h}\n"
            f"expression: {expr!s}\n"
            f"     error: {e!s}")
        if message not in self.replace_errors:
            self.replace_errors.append(message)
            g.trace(message)
        return expr
#@+node:ekr.20210102120444.34: *3* c.Check Outline...
#@+node:ekr.20210102120444.35: *4* c.checkGnxs
def checkGnxs(self):
    """
    Check the consistency of all gnx's and remove any tnodeLists.
    Reallocate gnx's for duplicates or empty gnx's.
    Return the number of structure_errors found.
    """
    c = self
    d = {}  # Keys are gnx's; values are lists of vnodes with that gnx.
    ni = g.app.nodeIndices
    t1 = time.time()

    def new_gnx(v):
        """Set v.fileIndex."""
        v.fileIndex = ni.getNewIndex(v)

    count, gnx_errors = 0, 0
    for p in c.safe_all_positions(copy=False):
        count += 1
        v = p.v
        if hasattr(v, "tnodeList"):
            delattr(v, "tnodeList")
            v._p_changed = True
        gnx = v.fileIndex
        if gnx:
            aSet = d.get(gnx, set())
            aSet.add(v)
            d[gnx] = aSet
        else:
            gnx_errors += 1
            new_gnx(v)
            g.es_print(f"empty v.fileIndex: {v} new: {p.v.gnx!r}", color='red')
    for gnx in sorted(d.keys()):
        aList = list(d.get(gnx))
        if len(aList) != 1:
            print('\nc.checkGnxs...')
            g.es_print(f"multiple vnodes with gnx: {gnx!r}", color='red')
            for v in aList:
                gnx_errors += 1
                g.es_print(f"id(v): {id(v)} gnx: {v.fileIndex} {v.h}", color='red')
                new_gnx(v)
    ok = not gnx_errors and not g.app.structure_errors
    t2 = time.time()
    if not ok:
        g.es_print(
            f"check-outline ERROR! {c.shortFileName()} "
            f"{count} nodes, "
            f"{gnx_errors} gnx errors, "
            f"{g.app.structure_errors} "
            f"structure errors",
            color='red'
        )
    elif c.verbose_check_outline and not g.unitTesting:
        print(
            f"check-outline OK: {t2 - t1:4.2f} sec. "
            f"{c.shortFileName()} {count} nodes")
    return g.app.structure_errors
#@+node:ekr.20210102120444.36: *4* c.checkLinks & helpers
def checkLinks(self):
    """Check the consistency of all links in the outline."""
    c = self
    t1 = time.time()
    count, errors = 0, 0
    for p in c.safe_all_positions():
        count += 1
        # try:
        if not c.checkThreadLinks(p):
            errors += 1
            break
        if not c.checkSiblings(p):
            errors += 1
            break
        if not c.checkParentAndChildren(p):
            errors += 1
            break
        # except AssertionError:
            # errors += 1
            # junk, value, junk = sys.exc_info()
            # g.error("test failed at position %s\n%s" % (repr(p), value))
    t2 = time.time()
    g.es_print(
        f"check-links: {t2 - t1:4.2f} sec. "
        f"{c.shortFileName()} {count} nodes", color='blue')
    return errors
#@+node:ekr.20210102120444.37: *5* c.checkParentAndChildren
def checkParentAndChildren(self, p):
    """Check consistency of parent and child data structures."""
    c = self

    def _assert(condition):
        return g._assert(condition, show_callers=False)

    def dump(p):
        if p and p.v:
            p.v.dump()
        elif p:
            print('<no p.v>')
        else:
            print('<no p>')
        if g.unitTesting:
            assert False, g.callers()

    if p.hasParent():
        n = p.childIndex()
        if not _assert(p == p.parent().moveToNthChild(n)):
            g.trace(f"p != parent().moveToNthChild({n})")
            dump(p)
            dump(p.parent())
            return False
    if p.level() > 0 and not _assert(p.v.parents):
        g.trace("no parents")
        dump(p)
        return False
    for child in p.children():
        if not c.checkParentAndChildren(child):
            return False
        if not _assert(p == child.parent()):
            g.trace("p != child.parent()")
            dump(p)
            dump(child.parent())
            return False
    if p.hasNext():
        if not _assert(p.next().parent() == p.parent()):
            g.trace("p.next().parent() != p.parent()")
            dump(p.next().parent())
            dump(p.parent())
            return False
    if p.hasBack():
        if not _assert(p.back().parent() == p.parent()):
            g.trace("p.back().parent() != parent()")
            dump(p.back().parent())
            dump(p.parent())
            return False
    # Check consistency of parent and children arrays.
    # Every nodes gets visited, so a strong test need only check consistency
    # between p and its parent, not between p and its children.
    parent_v = p._parentVnode()
    n = p.childIndex()
    if not _assert(parent_v.children[n] == p.v):
        g.trace("parent_v.children[n] != p.v")
        parent_v.dump()
        p.v.dump()
        return False
    return True
#@+node:ekr.20210102120444.38: *5* c.checkSiblings
def checkSiblings(self, p):
    """Check the consistency of next and back links."""
    back = p.back()
    next = p.next()
    if back:
        if not g._assert(p == back.next()):
            g.trace(
                f"p!=p.back().next()\n"
                f"     back: {back}\n"
                f"back.next: {back.next()}")
            return False
    if next:
        if not g._assert(p == next.back()):
            g.trace(
                f"p!=p.next().back\n"
                f"     next: {next}\n"
                f"next.back: {next.back()}")
            return False
    return True
#@+node:ekr.20210102120444.39: *5* c.checkThreadLinks
def checkThreadLinks(self, p):
    """Check consistency of threadNext & threadBack links."""
    threadBack = p.threadBack()
    threadNext = p.threadNext()
    if threadBack:
        if not g._assert(p == threadBack.threadNext()):
            g.trace("p!=p.threadBack().threadNext()")
            return False
    if threadNext:
        if not g._assert(p == threadNext.threadBack()):
            g.trace("p!=p.threadNext().threadBack()")
            return False
    return True
#@+node:ekr.20210102120444.40: *4* c.checkMoveWithParentWithWarning & c.checkDrag
#@+node:ekr.20210102120444.41: *5* c.checkMoveWithParentWithWarning
def checkMoveWithParentWithWarning(self, root, parent, warningFlag):
    """Return False if root or any of root's descendents is a clone of
    parent or any of parents ancestors."""
    c = self
    message = "Illegal move or drag: no clone may contain a clone of itself"
    clonedVnodes = {}
    for ancestor in parent.self_and_parents(copy=False):
        if ancestor.isCloned():
            v = ancestor.v
            clonedVnodes[v] = v
    if not clonedVnodes:
        return True
    for p in root.self_and_subtree(copy=False):
        if p.isCloned() and clonedVnodes.get(p.v):
            if g.app.unitTesting:
                g.app.unitTestDict['checkMoveWithParentWithWarning'] = True
            elif warningFlag:
                c.alert(message)
            return False
    return True
#@+node:ekr.20210102120444.42: *5* c.checkDrag
def checkDrag(self, root, target):
    """Return False if target is any descendant of root."""
    c = self
    message = "Can not drag a node into its descendant tree."
    for z in root.subtree():
        if z == target:
            if g.app.unitTesting:
                g.app.unitTestDict['checkMoveWithParentWithWarning'] = True
            else:
                c.alert(message)
            return False
    return True
#@+node:ekr.20210102120444.43: *4* c.checkOutline
def checkOutline(self, event=None, check_links=False):
    """
    Check for errors in the outline.
    Return the count of serious structure errors.
    """
    # The check-outline command sets check_links = True.
    c = self
    g.app.structure_errors = 0
    structure_errors = c.checkGnxs()
    if check_links and not structure_errors:
        structure_errors += c.checkLinks()
    return structure_errors
#@+node:ekr.20210102120444.44: *4* c.validateOutline
# Makes sure all nodes are valid.

def validateOutline(self, event=None):
    c = self
    if not g.app.validate_outline:
        return True
    root = c.rootPosition()
    parent = None
    if root:
        return root.validateOutlineWithParent(parent)
    return True
#@+node:ekr.20210102120444.45: *3* c.Directive scanning
# These are all new in Leo 4.5.1.
#@+node:ekr.20210102120444.46: *4* c.getLanguageAtCursor
def getLanguageAtCursor(self, p, language):
    """
    Return the language in effect at the present insert point.
    Use the language argument as a default if no @language directive seen.
    """
    c = self
    tag = '@language'
    w = c.frame.body.wrapper
    ins = w.getInsertPoint()
    n = 0
    for s in g.splitLines(p.b):
        if g.match_word(s, 0, tag):
            i = g.skip_ws(s, len(tag))
            j = g.skip_id(s, i)
            language = s[i:j]
        if n <= ins < n + len(s):
            break
        else:
            n += len(s)
    return language
#@+node:ekr.20210102120444.47: *4* c.getNodePath & c.getNodeFileName
# Not used in Leo's core.
# Used by the UNl plugin.  Does not need to create a path.

def getNodePath(self, p):
    """Return the path in effect at node p."""
    c = self
    aList = g.get_directives_dict_list(p)
    path = c.scanAtPathDirectives(aList)
    return path

# Not used in Leo's core.

def getNodeFileName(self, p):
    """
    Return the full file name at node p,
    including effects of all @path directives.
    Return None if p is no kind of @file node.
    """
    c = self
    path = g.scanAllAtPathDirectives(c, p)
    name = ''
    for p in p.self_and_parents(copy=False):
        name = p.anyAtFileNodeName()
        if name: break
    if name:
        # The commander method supports {{expr}}; the global function does not.
        path = c.expand_path_expression(path)  # #1341.
        name = c.expand_path_expression(name)  # #1341.
        name = g.os_path_finalize_join(path, name)
    return name
#@+node:ekr.20210102120444.48: *4* c.hasAmbiguousLangauge
def hasAmbiguousLanguage(self, p):
    """Return True if p.b contains different @language directives."""
    # c = self
    languages, tag = set(), '@language'
    for s in g.splitLines(p.b):
        if g.match_word(s, 0, tag):
            i = g.skip_ws(s, len(tag))
            j = g.skip_id(s, i)
            word = s[i:j]
            languages.add(word)
    return len(list(languages)) > 1
#@+node:ekr.20210102120444.49: *4* c.os_path_finalize and c.os_path_finalize_join (deprecated)
deprecated_messages = []

def os_path_finalize(self, path, **keys):
    """
    c.os_path_finalize is deprecated.
    It no longer evaluates path expressions.
    """
    callers = g.callers(2)
    if callers not in self.deprecated_messages:
        self.deprecated_messages.append(callers)
        g.es_print(
            f"\nc.os_path_finalize{' '*5} is deprecated. called from: {callers}")
    return g.os_path_finalize(path, **keys)

def os_path_finalize_join(self, *args, **keys):
    """
    c.os_path_finalize_join is deprecated.
    It no longer evaluates path expressions.
    """
    callers = g.callers(2)
    if callers not in self.deprecated_messages:
        self.deprecated_messages.append(callers)
        g.es_print(
            f"\nc.os_path_finalize_join is deprecated. called from: {callers}")
    return g.os_path_finalize_join(*args, **keys)
#@+node:ekr.20210102120444.50: *4* c.scanAllDirectives
#@@nobeautify

def scanAllDirectives(self,p=None):
    """
    Scan p and ancestors for directives.

    Returns a dict containing the results, including defaults.
    """
    c = self
    p = p or c.p
    # Set defaults
    language = c.target_language and c.target_language.lower()
    lang_dict = {
        'language':language,
        'delims':g.set_delims_from_language(language),
    }
    wrap = c.config.getBool("body-pane-wraps")
    table = (
        ('encoding',    None,           g.scanAtEncodingDirectives),
        ('lang-dict',   lang_dict,      g.scanAtCommentAndAtLanguageDirectives),
        ('lineending',  None,           g.scanAtLineendingDirectives),
        ('pagewidth',   c.page_width,   g.scanAtPagewidthDirectives),
        ('path',        None,           c.scanAtPathDirectives),
        ('tabwidth',    c.tab_width,    g.scanAtTabwidthDirectives),
        ('wrap',        wrap,           g.scanAtWrapDirectives),
    )
    # Set d by scanning all directives.
    aList = g.get_directives_dict_list(p)
    d = {}
    for key,default,func in table:
        val = func(aList)
        d[key] = default if val is None else val
    # Post process: do *not* set commander ivars.
    lang_dict = d.get('lang-dict')
    d = {
        "delims":       lang_dict.get('delims'),
        "encoding":     d.get('encoding'),
        "language":     lang_dict.get('language'),
        "lineending":   d.get('lineending'),
        "pagewidth":    d.get('pagewidth'),
        "path":         d.get('path'), # Redundant: or g.getBaseDirectory(c),
        "tabwidth":     d.get('tabwidth'),
        "pluginsList":  [], # No longer used.
        "wrap":         d.get('wrap'),
    }
    return d
#@+node:ekr.20210102120444.51: *4* c.scanAtPathDirectives
def scanAtPathDirectives(self, aList):
    """
    Scan aList for @path directives.
    Return a reasonable default if no @path directive is found.
    """
    c = self
    c.scanAtPathDirectivesCount += 1  # An important statistic.
    # Step 1: Compute the starting path.
    # The correct fallback directory is the absolute path to the base.
    if c.openDirectory:  # Bug fix: 2008/9/18
        base = c.openDirectory
    else:
        base = g.app.config.relative_path_base_directory
        if base and base == "!":
            base = g.app.loadDir
        elif base and base == ".":
            base = c.openDirectory
    base = c.expand_path_expression(base)  # #1341:
    absbase = g.os_path_finalize_join(g.app.loadDir, base)  # #1341:
    # Step 2: look for @path directives.
    paths = []
    for d in aList:
        # Look for @path directives.
        path = d.get('path')
        warning = d.get('@path_in_body')
        if path is not None:  # retain empty paths for warnings.
            # Convert "path" or <path> to path.
            path = g.stripPathCruft(path)
            if path and not warning:
                path = c.expand_path_expression(path)  # #1341.
                paths.append(path)
            # We will silently ignore empty @path directives.
    # Add absbase and reverse the list.
    paths.append(absbase)
    paths.reverse()
    # Step 3: Compute the full, effective, absolute path.
    path = g.os_path_finalize_join(*paths)  # #1341.
    return path or g.getBaseDirectory(c)
        # 2010/10/22: A useful default.
#@+node:ekr.20210102120444.52: *4* c.scanAtRootDirectives (no longer used)
# No longer used. Was called only by scanLanguageDirectives.

def scanAtRootDirectives(self, aList):
    """Scan aList for @root-code and @root-doc directives."""
    c = self
    # To keep pylint happy.
    tag = 'at_root_bodies_start_in_doc_mode'
    start_in_doc = hasattr(c.config, tag) and getattr(c.config, tag)
    # New in Leo 4.6: dashes are valid in directive names.
    for d in aList:
        if 'root-code' in d:
            return 'code'
        if 'root-doc' in d:
            return 'doc'
        if 'root' in d:
            return 'doc' if start_in_doc else 'code'
    return None
#@-others

#@@language python
#@@tabwidth -4
#@@pagewidth 70
#@-leo
