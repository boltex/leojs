import { Position } from "./leoNodes";
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';

/**
 * A per-outline class. Called 'class Commands' in Leo's python source
 * The "c" predefined object is an instance of this class.
 */
export class Commander {

    // Official ivars.
    private _currentPosition: Position | null = null;
    public hiddenRootNode = null;
    public mFileName: string;
    public mRelativeFileName = null;
    public gui:LeoUI;

    constructor(
        fileName: string,
        gui?:LeoUI,
        previousSettings?:any,
        relativeFileName?:any

    ) {
        this.mFileName = fileName;
        this.gui = gui || g.app.gui;
    }

    public recolor():void {
        console.log("recolor");
    }

    public redraw():void {
        console.log("redraw");
    }

    public redraw_after_icons_changed():void {
        console.log("redraw_after_icons_changed");
    }

    def all_nodes(self):
        """A generator returning all vnodes in the outline, in outline order."""
        c = self
        for p in c.all_positions():
            yield p.v

    def all_unique_nodes(self):
        """A generator returning each vnode of the outline."""
        c = self
        for p in c.all_unique_positions(copy=False):
            yield p.v
    def all_positions(self, copy=True):
        """A generator return all positions of the outline, in outline order."""
        c = self
        p = c.rootPosition()
        while p:
            yield p.copy() if copy else p
            p.moveToThreadNext()
    def all_positions_for_v(self, v, stack=None):
        """
        Generates all positions p in this outline where p.v is v.
        
        Should be called with stack=None.
        
        The generated positions are not necessarily in outline order.
        
        By Виталије Милошевић (Vitalije Milosevic).
        """
        c = self

        if stack is None:
            stack = []

        if not isinstance(v, leoNodes.VNode):
            g.es_print(f"not a VNode: {v!r}")
            return  # Stop the generator.

        def allinds(v, target_v):
            """Yield all indices i such that v.children[i] == target_v."""
            for i, x in enumerate(v.children):
                if x is target_v:
                    yield i

        def stack2pos(stack):
            """Convert the stack to a position."""
            v, i = stack[-1]
            return leoNodes.Position(v, i, stack[:-1])

        for v2 in set(v.parents):
            for i in allinds(v2, v):
                stack.insert(0, (v, i))
                if v2 is c.hiddenRootNode:
                    yield stack2pos(stack)
                else:
                    yield from c.all_positions_for_v(v2, stack)
                stack.pop(0)
    def all_roots(self, copy=True, predicate=None):
        """
        A generator yielding *all* the root positions in the outline that
        satisfy the given predicate. p.isAnyAtFileNode is the default
        predicate.

        The generator yields all **root** anywhere in the outline that satisfy
        the predicate. Once a root is found, the generator skips its subtree.
        """
        c = self
        if predicate is None:

            # pylint: disable=function-redefined

            def predicate(p):
                return p.isAnyAtFileNode()

        p = c.rootPosition()
        while p:
            if predicate(p):
                yield p.copy()  # 2017/02/19
                p.moveToNodeAfterTree()
            else:
                p.moveToThreadNext()
    def all_unique_positions(self, copy=True):
        """
        A generator return all positions of the outline, in outline order.
        Returns only the first position for each vnode.
        """
        c = self
        p = c.rootPosition()
        seen = set()
        while p:
            if p.v in seen:
                p.moveToNodeAfterTree()
            else:
                seen.add(p.v)
                yield p.copy() if copy else p
                p.moveToThreadNext()
    def all_unique_roots(self, copy=True, predicate=None):
        """
        A generator yielding all unique root positions in the outline that
        satisfy the given predicate. p.isAnyAtFileNode is the default
        predicate.

        The generator yields all **root** anywhere in the outline that satisfy
        the predicate. Once a root is found, the generator skips its subtree.
        """
        c = self
        if predicate is None:

            # pylint: disable=function-redefined

            def predicate(p):
                return p.isAnyAtFileNode()

        seen = set()
        p = c.rootPosition()
        while p:
            if p.v not in seen and predicate(p):
                seen.add(p.v)
                yield p.copy() if copy else p
                p.moveToNodeAfterTree()
            else:
                p.moveToThreadNext()
    def safe_all_positions(self, copy=True):
        """
        A generator returning all positions of the outline. This generator does
        *not* assume that vnodes are never their own ancestors.
        """
        c = self
        p = c.rootPosition()  # Make one copy.
        while p:
            yield p.copy() if copy else p
            p.safeMoveToThreadNext()
    def currentPosition(self):
        """
        Return a copy of the presently selected position or a new null
        position. So c.p.copy() is never necessary.
        """
        c = self
        if hasattr(c, '_currentPosition') and getattr(c, '_currentPosition'):
            # *Always* return a copy.
            return c._currentPosition.copy()
        return c.rootPosition()

    # For compatibiility with old scripts...

    currentVnode = currentPosition
    # Compatibility with scripts

    def fileName(self):
        s = self.mFileName or ""
        if g.isWindows:
            s = s.replace('\\', '/')
        return s

    def relativeFileName(self):
        return self.mRelativeFileName or self.mFileName

    def shortFileName(self):
        return g.shortFileName(self.mFileName)

    shortFilename = shortFileName
    def firstVisible(self):
        """Move to the first visible node of the present chapter or hoist."""
        c = self; p = c.p
        while 1:
            back = p.visBack(c)
            if back and back.isVisible(c):
                p = back
            else: break
        return p
    def getTabWidth(self, p):
        """Return the tab width in effect at p."""
        c = self
        val = g.scanAllAtTabWidthDirectives(c, p)
        return val
    def currentPositionIsRootPosition(self):
        """Return True if the current position is the root position.

        This method is called during idle time, so not generating positions
        here fixes a major leak.
        """
        c = self
        root = c.rootPosition()
        return c._currentPosition and root and c._currentPosition == root
        # return (
            # c._currentPosition and c._rootPosition and
            # c._currentPosition == c._rootPosition)
    def currentPositionHasNext(self):
        """Return True if the current position is the root position.

        This method is called during idle time, so not generating positions
        here fixes a major leak.
        """
        c = self; current = c._currentPosition
        return current and current.hasNext()
    def isCurrentPosition(self, p):
        c = self
        if p is None or c._currentPosition is None:
            return False
        return p == c._currentPosition
    def isRootPosition(self, p):
        c = self
        root = c.rootPosition()
        return p and root and p == root  # 2011/03/03
    def isChanged(self):
        return self.changed
    def lastTopLevel(self):
        """Return the last top-level position in the outline."""
        c = self
        p = c.rootPosition()
        while p.hasNext():
            p.moveToNext()
        return p
    def nullPosition(self):
        """
        New in Leo 5.5: Return None.
        Using empty positions masks problems in program logic.

        In fact, there are no longer any calls to this method in Leo's core.
        """
        g.trace('This method is deprecated. Instead, just use None.')
        # pylint complains if we return None.
    def positionExists(self, p, root=None, trace=False):
        """Return True if a position exists in c's tree"""
        if not p or not p.v: return False

        rstack = root.stack + [(root.v, root._childIndex)] if root else []
        pstack = p.stack + [(p.v, p._childIndex)]

        if len(rstack) > len(pstack): return False

        par = self.hiddenRootNode
        for j, x in enumerate(pstack):
            if j < len(rstack) and x != rstack[j]: return False
            v, i = x
            if i >= len(par.children) or v is not par.children[i]:
                return False
            par = v
        return True
    def dumpPosition(self, p):
        """Dump position p and it's ancestors."""
        g.trace('=====', p.h, p._childIndex)
        for i, data in enumerate(p.stack):
            v, childIndex = data
            print(f"{i} {childIndex} {v._headString}")
    _rootCount = 0

    def rootPosition(self):
        """Return the root position.

        Root position is the first position in the document. Other
        top level positions are siblings of this node.
        """
        c = self
        # 2011/02/25: Compute the position directly.
        if c.hiddenRootNode.children:
            v = c.hiddenRootNode.children[0]
            return leoNodes.Position(v, childIndex=0, stack=None)
        return None

    # For compatibiility with old scripts...

    rootVnode = rootPosition
    findRootPosition = rootPosition
    def shouldBeExpanded(self, p):
        """Return True if the node at position p should be expanded."""
        c, v = self, p.v
        if not p.hasChildren():
            return False
        # Always clear non-existent positions.
        v.expandedPositions = [z for z in v.expandedPositions if c.positionExists(z)]
        if not p.isCloned():
            # Do not call p.isExpanded here! It calls this method.
            return p.v.isExpanded()
        if p.isAncestorOf(c.p):
            return True
        for p2 in v.expandedPositions:
            if p == p2:
                return True
        return False
    def visLimit(self):
        """
        Return the topmost visible node.
        This is affected by chapters and hoists.
        """
        c = self; cc = c.chapterController
        if c.hoistStack:
            bunch = c.hoistStack[-1]
            p = bunch.p
            limitIsVisible = not cc or not p.h.startswith('@chapter')
            return p, limitIsVisible
        return None, None
    def __get_p(self):
        c = self
        return c.currentPosition()

    p = property(
        __get_p,  # No setter.
        doc="commander current position property")
    def appendStringToBody(self, p, s):

        if s:
            p.b = p.b + g.toUnicode(s)
    def clearAllMarked(self):
        c = self
        for p in c.all_unique_positions(copy=False):
            p.v.clearMarked()
    def clearAllVisited(self):
        c = self
        for p in c.all_unique_positions(copy=False):
            p.v.clearVisited()
            p.v.clearWriteBit()
    def clearChanged(self):
        """clear the marker that indicates that the .leo file has been changed."""
        c = self
        c.changed = False
        # Clear all dirty bits _before_ setting the caption.
        for v in c.all_unique_nodes():
            v.clearDirty()
        c.changed = False
        ### Old code.
            # master = getattr(c.frame.top, 'leo_master', None)
            # if master:
                # master.setChanged(c, False)
                    # # LeoTabbedTopLevel.setChanged.
            # s = c.frame.getTitle()
            # if len(s) > 2 and s[0:2] == "* ":
                # c.frame.setTitle(s[2:])
    def clearMarked(self, p):
        c = self
        p.v.clearMarked()
        g.doHook("clear-mark", c=c, p=p)
    def setBodyString(self, p, s):
        """
        This is equivalent to p.b = s.
        
        Warning: This method may call c.recolor() or c.redraw().
        """
        c, v = self, p.v
        if not c or not v:
            return
        ### Old code
            # s = g.toUnicode(s)
            # current = c.p
            # if current and p.v == current.v:
                # w = c.frame.body.wrapper
                # w.setAllText(s)
                # v.setSelection(0,0)
                # c.recolor()
            # # Keep the body text in the VNode up-to-date.
            # if v.b != s:
                # v.setBodyString(s)
                # v.setSelection(0, 0)
                # p.setDirty()
                # if not c.isChanged():
                    # c.setChanged()
                # c.redraw_after_icons_changed()
    def setChanged(self, redrawFlag=True):
        """Set the marker that indicates that the .leo file has been changed."""
        c = self
        c.changed = True
        # Do nothing for null frames.
        if not redrawFlag:  # Prevent flash when fixing #387.
            return
        ### Old code.
            # master = getattr(c.frame.top, 'leo_master', None)
            # if master:
                # master.setChanged(c, True)
                    # # LeoTabbedTopLevel.setChanged.
            # s = c.frame.getTitle()
            # if len(s) > 2 and s[0] != '*':
                # c.frame.setTitle("* " + s)
    _currentCount = 0

    def setCurrentPosition(self, p):
        """
        Set the presently selected position. For internal use only.
        Client code should use c.selectPosition instead.
        """
        c = self
        if not p:
            g.trace('===== no p', g.callers())
            return
        if c.positionExists(p):
            if c._currentPosition and p == c._currentPosition:
                pass  # We have already made a copy.
            else:  # Make a copy _now_
                c._currentPosition = p.copy()
        else:  # 2011/02/25:
            c._currentPosition = c.rootPosition()
            g.trace(f"Invalid position: {repr(p and p.h)}")
            g.trace(g.callers())
            # Don't kill unit tests for this kind of problem.

    # For compatibiility with old scripts.

    setCurrentVnode = setCurrentPosition

}


