// Transcrypt'ed from Python, 2020-12-25 05:32:30
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as g from './leo.core.leoGlobals.js';
var __name__ = 'leo.core.leoUndo';
export var Undoer =  __class__ ('Undoer', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c) {
		self.c = c;
		self.granularity = null;
		self.max_undo_stack_size = c.config.getInt ('max-undo-stack-size') || 0;
		self.beads = [];
		self.bead = -(1);
		self.undoType = "Can't Undo";
		self.redoMenuLabel = "Can't Redo";
		self.undoMenuLabel = "Can't Undo";
		self.realRedoMenuLabel = "Can't Redo";
		self.realUndoMenuLabel = "Can't Undo";
		self.undoing = false;
		self.redoing = false;
		self.per_node_undo = false;
		self.optionalIvars = [];
		self.afterTree = null;
		self.beforeTree = null;
		self.children = null;
		self.deleteMarkedNodesData = null;
		self.followingSibs = null;
		self.inHead = null;
		self.kind = null;
		self.newBack = null;
		self.newBody = null;
		self.newChildren = null;
		self.newHead = null;
		self.newIns = null;
		self.newMarked = null;
		self.newN = null;
		self.newP = null;
		self.newParent = null;
		self.newParent_v = null;
		self.newRecentFiles = null;
		self.newSel = null;
		self.newTree = null;
		self.newYScroll = null;
		self.oldBack = null;
		self.oldBody = null;
		self.oldChildren = null;
		self.oldHead = null;
		self.oldIns = null;
		self.oldMarked = null;
		self.oldN = null;
		self.oldParent = null;
		self.oldParent_v = null;
		self.oldRecentFiles = null;
		self.oldSel = null;
		self.oldTree = null;
		self.oldYScroll = null;
		self.pasteAsClone = null;
		self.prevSel = null;
		self.sortChildren = null;
		self.verboseUndoGroup = null;
		self.reloadSettings ();
	});},
	get reloadSettings () {return __get__ (this, function (self) {
		var c = self.c;
		self.granularity = c.config.getString ('undo-granularity');
		if (self.granularity) {
			self.granularity = self.granularity.lower ();
		}
		if (!__in__ (self.granularity, tuple (['node', 'line', 'word', 'char']))) {
			self.granularity = 'line';
		}
	});},
	get cmd () {return __get__ (this, function (py_name) {
		return g.new_cmd_decorator (py_name, ['c', 'undoer']);
	});},
	get clearOptionalIvars () {return __get__ (this, function (self) {
		var u = self;
		u.p = null;
		for (var ivar of u.optionalIvars) {
			setattr (u, ivar, null);
		}
	});},
	get cutStack () {return __get__ (this, function (self) {
		var u = self;
		var n = u.max_undo_stack_size;
		if ((u.bead >= n && n > 0) && !(g.app.unitTesting)) {
			var i = len (u.beads) - 1;
			while (i >= 0) {
				var bunch = u.beads [i];
				if (hasattr (bunch, 'kind') && bunch.kind == 'beforeGroup') {
					return ;
				}
				i--;
			}
			u.beads = u.beads.__getslice__ (-(n), null, 1);
			u.bead = n - 1;
		}
		if (__in__ ('undo', g.app.debug) && __in__ ('verbose', g.app.debug)) {
			print ('u.cutStack: {}'.format (len (u.beads)));
		}
	});},
	get dumpBead () {return __get__ (this, function (self, n) {
		var u = self;
		if (n < 0 || n >= len (u.beads)) {
			return tuple (['no bead: n = ', n]);
		}
		var result = [];
		result.append ('-' * 10);
		result.append ('len(u.beads): {}, n: {}'.format (len (u.beads), n));
		for (var ivar of tuple (['kind', 'newP', 'newN', 'p', 'oldN', 'undoHelper'])) {
			result.append ('{} = {}'.format (ivar, getattr (self, ivar)));
		}
		return '\n'.join (result);
	});},
	get dumpTopBead () {return __get__ (this, function (self) {
		var u = self;
		var n = len (u.beads);
		if (n > 0) {
			return self.dumpBead (n - 1);
		}
		return '<no top bead>';
	});},
	get getBead () {return __get__ (this, function (self, n) {
		var u = self;
		if (n < 0 || n >= len (u.beads)) {
			return null;
		}
		var bunch = u.beads [n];
		self.setIvarsFromBunch (bunch);
		if (__in__ ('undo', g.app.debug)) {
			print (' u.getBead: {} of {}'.format (n, len (u.beads)));
		}
		return bunch;
	});},
	get peekBead () {return __get__ (this, function (self, n) {
		var u = self;
		if (n < 0 || n >= len (u.beads)) {
			return null;
		}
		return u.beads [n];
	});},
	get pushBead () {return __get__ (this, function (self, bunch) {
		var u = self;
		var bunch2 = u.bead >= 0 && u.bead < len (u.beads) && u.beads [u.bead];
		if (bunch2 && hasattr (bunch2, 'kind') && bunch2.kind == 'beforeGroup') {
			bunch2.py_items.append (bunch);
		}
		else {
			u.bead++;
			u.beads.__setslice__ (u.bead, null, null, [bunch]);
			u.setUndoTypes ();
		}
		if (__in__ ('undo', g.app.debug)) {
			print ('u.pushBead: {} {}'.format (len (u.beads), bunch.undoType));
		}
	});},
	get redoMenuName () {return __get__ (this, function (self, py_name) {
		if (py_name == "Can't Redo") {
			return py_name;
		}
		return 'Redo ' + py_name;
	});},
	get undoMenuName () {return __get__ (this, function (self, py_name) {
		if (py_name == "Can't Undo") {
			return py_name;
		}
		return 'Undo ' + py_name;
	});},
	get setIvarsFromBunch () {return __get__ (this, function (self, bunch) {
		var u = self;
		u.clearOptionalIvars ();
		if (0) {
			g.pr ('-' * 40);
			for (var key of list (bunch.py_keys ())) {
				g.trace ('{} {}'.format (key, bunch.py_get (key)));
			}
			g.pr ('-' * 20);
		}
		if (g.unitTesting) {
			var val = bunch.py_get ('oldMarked');
		}
		for (var key of list (bunch.py_keys ())) {
			var val = bunch.py_get (key);
			setattr (u, key, val);
			if (!__in__ (key, u.optionalIvars)) {
				u.optionalIvars.append (key);
			}
		}
	});},
	get setRedoType () {return __get__ (this, function (self, theType) {
		var u = self;
		var frame = u.c.frame;
		if (!(isinstance (theType, str))) {
			g.trace ('oops: expected string for command, got {}'.format (theType));
			g.trace (g.callers ());
			var theType = '<unknown>';
		}
		var menu = frame.menu.getMenu ('Edit');
		var py_name = u.redoMenuName (theType);
		if (py_name != u.redoMenuLabel) {
			var realLabel = frame.menu.getRealMenuName (py_name);
			if (realLabel == py_name) {
				var underline = (g.match (py_name, 0, "Can't") ? -(1) : 0);
			}
			else {
				var underline = realLabel.find ('&');
			}
			var realLabel = realLabel.py_replace ('&', '');
			frame.menu.setMenuLabel (menu, u.realRedoMenuLabel, realLabel, __kwargtrans__ ({underline: underline}));
			u.redoMenuLabel = py_name;
			u.realRedoMenuLabel = realLabel;
		}
	});},
	get setUndoType () {return __get__ (this, function (self, theType) {
		var u = self;
		var frame = u.c.frame;
		if (!(isinstance (theType, str))) {
			g.trace ('oops: expected string for command, got {}'.format (repr (theType)));
			g.trace (g.callers ());
			var theType = '<unknown>';
		}
		var menu = frame.menu.getMenu ('Edit');
		var py_name = u.undoMenuName (theType);
		if (py_name != u.undoMenuLabel) {
			var realLabel = frame.menu.getRealMenuName (py_name);
			if (realLabel == py_name) {
				var underline = (g.match (py_name, 0, "Can't") ? -(1) : 0);
			}
			else {
				var underline = realLabel.find ('&');
			}
			var realLabel = realLabel.py_replace ('&', '');
			frame.menu.setMenuLabel (menu, u.realUndoMenuLabel, realLabel, __kwargtrans__ ({underline: underline}));
			u.undoType = theType;
			u.undoMenuLabel = py_name;
			u.realUndoMenuLabel = realLabel;
		}
	});},
	get setUndoTypes () {return __get__ (this, function (self) {
		var u = self;
		var bunch = u.peekBead (u.bead);
		if (bunch) {
			u.setUndoType (bunch.undoType);
		}
		else {
			u.setUndoType ("Can't Undo");
		}
		var bunch = u.peekBead (u.bead + 1);
		if (bunch) {
			u.setRedoType (bunch.undoType);
		}
		else {
			u.setRedoType ("Can't Redo");
		}
		u.cutStack ();
	});},
	get restoreTree () {return __get__ (this, function (self, treeInfo) {
		var u = self;
		for (var [v, vInfo, tInfo] of treeInfo) {
			u.restoreVnodeUndoInfo (vInfo);
			u.restoreTnodeUndoInfo (tInfo);
		}
	});},
	get restoreVnodeUndoInfo () {return __get__ (this, function (self, bunch) {
		var v = bunch.v;
		v.statusBits = bunch.statusBits;
		v.children = bunch.children;
		v.parents = bunch.parents;
		var uA = bunch.py_get ('unknownAttributes');
		if (uA !== null) {
			v.unknownAttributes = uA;
			v._p_changed = 1;
		}
	});},
	get restoreTnodeUndoInfo () {return __get__ (this, function (self, bunch) {
		var v = bunch.v;
		v.h = bunch.headString;
		v.b = bunch.bodyString;
		v.statusBits = bunch.statusBits;
		var uA = bunch.py_get ('unknownAttributes');
		if (uA !== null) {
			v.unknownAttributes = uA;
			v._p_changed = 1;
		}
	});},
	get saveTree () {return __get__ (this, function (self, p, treeInfo) {
		if (typeof treeInfo == 'undefined' || (treeInfo != null && treeInfo.hasOwnProperty ("__kwargtrans__"))) {;
			var treeInfo = null;
		};
		var u = self;
		var topLevel = treeInfo === null;
		if (topLevel) {
			var treeInfo = [];
		}
		var data = tuple ([p.v, u.createVnodeUndoInfo (p.v), u.createTnodeUndoInfo (p.v)]);
		treeInfo.append (data);
		var child = p.firstChild ();
		while (child) {
			self.saveTree (child, treeInfo);
			var child = child.py_next ();
		}
		return treeInfo;
	});},
	get createVnodeUndoInfo () {return __get__ (this, function (self, v) {
		var bunch = g.Bunch (__kwargtrans__ ({v: v, statusBits: v.statusBits, parents: v.parents.__getslice__ (0, null, 1), children: v.children.__getslice__ (0, null, 1)}));
		if (hasattr (v, 'unknownAttributes')) {
			bunch.unknownAttributes = v.unknownAttributes;
		}
		return bunch;
	});},
	get createTnodeUndoInfo () {return __get__ (this, function (self, v) {
		var bunch = g.Bunch (__kwargtrans__ ({v: v, headString: v.h, bodyString: v.b, statusBits: v.statusBits}));
		if (hasattr (v, 'unknownAttributes')) {
			bunch.unknownAttributes = v.unknownAttributes;
		}
		return bunch;
	});},
	get trace () {return __get__ (this, function (self) {
		var ivars = tuple (['kind', 'undoType']);
		for (var ivar of ivars) {
			g.pr (ivar, getattr (self, ivar));
		}
	});},
	get updateMarks () {return __get__ (this, function (self, oldOrNew) {
		var u = self;
		var c = u.c;
		if (!__in__ (oldOrNew, tuple (['new', 'old']))) {
			g.trace ("can't happen");
			return ;
		}
		var isOld = oldOrNew == 'old';
		var marked = (isOld ? u.oldMarked : u.newMarked);
		if (marked) {
			c.setMarked (u.p);
		}
		else {
			c.clearMarked (u.p);
		}
		u.p.setDirty ();
		u.c.setChanged ();
	});},
	get afterChangeBody () {return __get__ (this, function (self, p, command, bunch) {
		var c = self.c;
		var __left0__ = tuple ([self, c.frame.body.wrapper]);
		var u = __left0__ [0];
		var w = __left0__ [1];
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'body';
		bunch.undoType = command;
		bunch.undoHelper = u.undoChangeBody;
		bunch.redoHelper = u.redoChangeBody;
		bunch.newBody = p.b;
		bunch.newHead = p.h;
		bunch.newIns = w.getInsertPoint ();
		bunch.newMarked = p.isMarked ();
		if (w) {
			bunch.newSel = w.getSelectionRange ();
		}
		else {
			bunch.newSel = tuple ([0, 0]);
		}
		bunch.newYScroll = (w ? w.getYScrollPosition () : 0);
		u.pushBead (bunch);
		if (g.unitTesting) {
		}
		else if (command.lower () == 'typing') {
			g.trace ('Error: undoType should not be "Typing"\nCall u.doTyping instead');
		}
		u.updateAfterTyping (p, w);
	});},
	get afterChangeGroup () {return __get__ (this, function (self, p, undoType, reportFlag) {
		if (typeof reportFlag == 'undefined' || (reportFlag != null && reportFlag.hasOwnProperty ("__kwargtrans__"))) {;
			var reportFlag = false;
		};
		var u = self;
		var c = self.c;
		var w = c.frame.body.wrapper;
		if (u.redoing || u.undoing) {
			return ;
		}
		var bunch = u.beads [u.bead];
		if (!(u.beads)) {
			g.trace ('oops: empty undo stack.');
			return ;
		}
		if (bunch.kind == 'beforeGroup') {
			bunch.kind = 'afterGroup';
		}
		else {
			g.trace ('oops: expecting beforeGroup, got {}'.format (bunch.kind));
		}
		bunch.kind = 'afterGroup';
		bunch.undoType = undoType;
		bunch.undoHelper = u.undoGroup;
		bunch.redoHelper = u.redoGroup;
		bunch.newP = p.copy ();
		bunch.newSel = w.getSelectionRange ();
		bunch.reportFlag = reportFlag;
		if (0) {
			u.bead++;
			u.beads.__setslice__ (u.bead, null, null, [bunch]);
		}
		u.setUndoTypes ();
	});},
	get afterChangeNodeContents () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		var c = self.c;
		var w = c.frame.body.wrapper;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'node';
		bunch.undoType = command;
		bunch.undoHelper = u.undoNodeContents;
		bunch.redoHelper = u.redoNodeContents;
		bunch.inHead = false;
		bunch.newBody = p.b;
		bunch.newHead = p.h;
		bunch.newMarked = p.isMarked ();
		if (w) {
			bunch.newSel = w.getSelectionRange ();
		}
		else {
			bunch.newSel = tuple ([0, 0]);
		}
		bunch.newYScroll = (w ? w.getYScrollPosition () : 0);
		u.pushBead (bunch);
	});},
	get afterChangeHeadline () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'headline';
		bunch.undoType = command;
		bunch.undoHelper = u.undoChangeHeadline;
		bunch.redoHelper = u.redoChangeHeadline;
		bunch.newHead = p.h;
		u.pushBead (bunch);
	});},
	afterChangeHead: afterChangeHeadline,
	get afterChangeTree () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		var c = self.c;
		var w = c.frame.body.wrapper;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'tree';
		bunch.undoType = command;
		bunch.undoHelper = u.undoTree;
		bunch.redoHelper = u.redoTree;
		bunch.newSel = w.getSelectionRange ();
		bunch.newText = w.getAllText ();
		bunch.newTree = u.saveTree (p);
		u.pushBead (bunch);
	});},
	get afterClearRecentFiles () {return __get__ (this, function (self, bunch) {
		var u = self;
		bunch.newRecentFiles = g.app.config.recentFiles.__getslice__ (0, null, 1);
		bunch.undoType = 'Clear Recent Files';
		bunch.undoHelper = u.undoClearRecentFiles;
		bunch.redoHelper = u.redoClearRecentFiles;
		u.pushBead (bunch);
		return bunch;
	});},
	get afterCloneMarkedNodes () {return __get__ (this, function (self, p) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'clone-marked-nodes';
		bunch.undoType = 'clone-marked-nodes';
		bunch.undoHelper = u.undoCloneMarkedNodes;
		bunch.redoHelper = u.redoCloneMarkedNodes;
		bunch.newP = p.py_next ();
		bunch.newMarked = p.isMarked ();
		u.pushBead (bunch);
	});},
	get afterCopyMarkedNodes () {return __get__ (this, function (self, p) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'copy-marked-nodes';
		bunch.undoType = 'copy-marked-nodes';
		bunch.undoHelper = u.undoCopyMarkedNodes;
		bunch.redoHelper = u.redoCopyMarkedNodes;
		bunch.newP = p.py_next ();
		bunch.newMarked = p.isMarked ();
		u.pushBead (bunch);
	});},
	get afterCloneNode () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'clone';
		bunch.undoType = command;
		bunch.undoHelper = u.undoCloneNode;
		bunch.redoHelper = u.redoCloneNode;
		bunch.newBack = p.back ();
		bunch.newParent = p.parent ();
		bunch.newP = p.copy ();
		bunch.newMarked = p.isMarked ();
		u.pushBead (bunch);
	});},
	get afterDehoist () {return __get__ (this, function (self, p, command) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'dehoist';
		bunch.undoType = command;
		bunch.undoHelper = u.undoDehoistNode;
		bunch.redoHelper = u.redoDehoistNode;
		u.pushBead (bunch);
	});},
	get afterDeleteNode () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'delete';
		bunch.undoType = command;
		bunch.undoHelper = u.undoDeleteNode;
		bunch.redoHelper = u.redoDeleteNode;
		bunch.newP = p.copy ();
		bunch.newMarked = p.isMarked ();
		u.pushBead (bunch);
	});},
	get afterDeleteMarkedNodes () {return __get__ (this, function (self, data, p) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'delete-marked-nodes';
		bunch.undoType = 'delete-marked-nodes';
		bunch.undoHelper = u.undoDeleteMarkedNodes;
		bunch.redoHelper = u.redoDeleteMarkedNodes;
		bunch.newP = p.copy ();
		bunch.deleteMarkedNodesData = data;
		bunch.newMarked = p.isMarked ();
		u.pushBead (bunch);
	});},
	get afterDemote () {return __get__ (this, function (self, p, followingSibs) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'demote';
		bunch.undoType = 'Demote';
		bunch.undoHelper = u.undoDemote;
		bunch.redoHelper = u.redoDemote;
		bunch.followingSibs = followingSibs;
		u.bead++;
		u.beads.__setslice__ (u.bead, null, null, [bunch]);
		u.setUndoTypes ();
	});},
	get afterHoist () {return __get__ (this, function (self, p, command) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'hoist';
		bunch.undoType = command;
		bunch.undoHelper = u.undoHoistNode;
		bunch.redoHelper = u.redoHoistNode;
		u.pushBead (bunch);
	});},
	get afterInsertNode () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'insert';
		bunch.undoType = command;
		bunch.undoHelper = u.undoInsertNode;
		bunch.redoHelper = u.redoInsertNode;
		bunch.newP = p.copy ();
		bunch.newBack = p.back ();
		bunch.newParent = p.parent ();
		bunch.newMarked = p.isMarked ();
		if (bunch.pasteAsClone) {
			var beforeTree = bunch.beforeTree;
			var afterTree = [];
			for (var bunch2 of beforeTree) {
				var v = bunch2.v;
				afterTree.append (g.Bunch (__kwargtrans__ ({v: v, head: v.h.__getslice__ (0, null, 1), body: v.b.__getslice__ (0, null, 1)})));
			}
			bunch.afterTree = afterTree;
		}
		u.pushBead (bunch);
	});},
	get afterMark () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.undoHelper = u.undoMark;
		bunch.redoHelper = u.redoMark;
		bunch.newMarked = p.isMarked ();
		u.pushBead (bunch);
	});},
	get afterMoveNode () {return __get__ (this, function (self, p, command, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		bunch.kind = 'move';
		bunch.undoType = command;
		bunch.undoHelper = u.undoMove;
		bunch.redoHelper = u.redoMove;
		bunch.newMarked = p.isMarked ();
		bunch.newN = p.childIndex ();
		bunch.newParent_v = p._parentVnode ();
		bunch.newP = p.copy ();
		u.pushBead (bunch);
	});},
	get afterPromote () {return __get__ (this, function (self, p, children) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'promote';
		bunch.undoType = 'Promote';
		bunch.undoHelper = u.undoPromote;
		bunch.redoHelper = u.redoPromote;
		bunch.children = children;
		u.bead++;
		u.beads.__setslice__ (u.bead, null, null, [bunch]);
		u.setUndoTypes ();
	});},
	get afterSort () {return __get__ (this, function (self, p, bunch) {
		var u = self;
		if (u.redoing || u.undoing) {
			return ;
		}
		u.setUndoTypes ();
	});},
	get beforeChangeBody () {return __get__ (this, function (self, p) {
		var w = self.c.frame.body.wrapper;
		var bunch = self.createCommonBunch (p);
		bunch.oldBody = p.b;
		bunch.oldHead = p.h;
		bunch.oldIns = w.getInsertPoint ();
		bunch.oldYScroll = w.getYScrollPosition ();
		return bunch;
	});},
	get beforeChangeGroup () {return __get__ (this, function (self, p, command, verboseUndoGroup) {
		if (typeof verboseUndoGroup == 'undefined' || (verboseUndoGroup != null && verboseUndoGroup.hasOwnProperty ("__kwargtrans__"))) {;
			var verboseUndoGroup = true;
		};
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'beforeGroup';
		bunch.undoType = command;
		bunch.verboseUndoGroup = verboseUndoGroup;
		bunch.undoHelper = u.undoGroup;
		bunch.redoHelper = u.redoGroup;
		bunch.py_items = [];
		u.bead++;
		u.beads.__setslice__ (u.bead, null, null, [bunch]);
	});},
	get beforeChangeHeadline () {return __get__ (this, function (self, p) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.oldHead = p.h;
		return bunch;
	});},
	beforeChangeHead: beforeChangeHeadline,
	get beforeChangeNodeContents () {return __get__ (this, function (self, p) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = c.frame.body.wrapper;
		var bunch = u.createCommonBunch (p);
		bunch.oldBody = p.b;
		bunch.oldHead = p.h;
		bunch.oldYScroll = (w ? w.getYScrollPosition () : 0);
		return bunch;
	});},
	get beforeChangeTree () {return __get__ (this, function (self, p) {
		var u = self;
		var c = u.c;
		var w = c.frame.body.wrapper;
		var bunch = u.createCommonBunch (p);
		bunch.oldSel = w.getSelectionRange ();
		bunch.oldText = w.getAllText ();
		bunch.oldTree = u.saveTree (p);
		return bunch;
	});},
	get beforeClearRecentFiles () {return __get__ (this, function (self) {
		var u = self;
		var p = u.c.p;
		var bunch = u.createCommonBunch (p);
		bunch.oldRecentFiles = g.app.config.recentFiles.__getslice__ (0, null, 1);
		return bunch;
	});},
	get beforeCloneNode () {return __get__ (this, function (self, p) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		return bunch;
	});},
	get beforeDeleteNode () {return __get__ (this, function (self, p) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.oldBack = p.back ();
		bunch.oldParent = p.parent ();
		return bunch;
	});},
	get beforeInsertNode () {return __get__ (this, function (self, p, pasteAsClone, copiedBunchList) {
		if (typeof pasteAsClone == 'undefined' || (pasteAsClone != null && pasteAsClone.hasOwnProperty ("__kwargtrans__"))) {;
			var pasteAsClone = false;
		};
		if (typeof copiedBunchList == 'undefined' || (copiedBunchList != null && copiedBunchList.hasOwnProperty ("__kwargtrans__"))) {;
			var copiedBunchList = null;
		};
		var u = self;
		if (copiedBunchList === null) {
			var copiedBunchList = [];
		}
		var bunch = u.createCommonBunch (p);
		bunch.pasteAsClone = pasteAsClone;
		if (pasteAsClone) {
			bunch.beforeTree = copiedBunchList;
		}
		return bunch;
	});},
	get beforeMark () {return __get__ (this, function (self, p, command) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'mark';
		bunch.undoType = command;
		return bunch;
	});},
	get beforeMoveNode () {return __get__ (this, function (self, p) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.oldN = p.childIndex ();
		bunch.oldParent_v = p._parentVnode ();
		return bunch;
	});},
	get beforeSort () {return __get__ (this, function (self, p, undoType, oldChildren, newChildren, sortChildren) {
		var u = self;
		var bunch = u.createCommonBunch (p);
		bunch.kind = 'sort';
		bunch.undoType = undoType;
		bunch.undoHelper = u.undoSort;
		bunch.redoHelper = u.redoSort;
		bunch.oldChildren = oldChildren;
		bunch.newChildren = newChildren;
		bunch.sortChildren = sortChildren;
		u.bead++;
		u.beads.__setslice__ (u.bead, null, null, [bunch]);
		return bunch;
	});},
	get createCommonBunch () {return __get__ (this, function (self, p) {
		var u = self;
		var c = u.c;
		var w = c.frame.body.wrapper;
		return g.Bunch (__kwargtrans__ ({oldMarked: p && p.isMarked (), oldSel: w && w.getSelectionRange () || null, p: p && p.copy ()}));
	});},
	get canRedo () {return __get__ (this, function (self) {
		var u = self;
		return u.redoMenuLabel != "Can't Redo";
	});},
	get canUndo () {return __get__ (this, function (self) {
		var u = self;
		return u.undoMenuLabel != "Can't Undo";
	});},
	get clearUndoState () {return __get__ (this, function (self) {
		var u = self;
		u.clearOptionalIvars ();
		u.setRedoType ("Can't Redo");
		u.setUndoType ("Can't Undo");
		u.beads = [];
		u.bead = -(1);
	});},
	get doTyping () {return __get__ (this, function (self, p, undo_type, oldText, newText, newInsert, oldSel, newSel, oldYview) {
		if (typeof newInsert == 'undefined' || (newInsert != null && newInsert.hasOwnProperty ("__kwargtrans__"))) {;
			var newInsert = null;
		};
		if (typeof oldSel == 'undefined' || (oldSel != null && oldSel.hasOwnProperty ("__kwargtrans__"))) {;
			var oldSel = null;
		};
		if (typeof newSel == 'undefined' || (newSel != null && newSel.hasOwnProperty ("__kwargtrans__"))) {;
			var newSel = null;
		};
		if (typeof oldYview == 'undefined' || (oldYview != null && oldYview.hasOwnProperty ("__kwargtrans__"))) {;
			var oldYview = null;
		};
		var __left0__ = tuple ([self.c, self, self.c.frame.body.wrapper]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = __left0__ [2];
		var undo_type = undo_type.capitalize ();
		if (u.redoing || u.undoing) {
			return null;
		}
		if (undo_type === null) {
			return null;
		}
		if (undo_type == "Can't Undo") {
			u.clearUndoState ();
			u.setUndoTypes ();
			return null;
		}
		if (oldText == newText) {
			u.setUndoTypes ();
			return null;
		}
		u.clearOptionalIvars ();
		u.undoType = undo_type;
		u.p = p.copy ();
		var old_lines = oldText.py_split ('\n');
		var new_lines = newText.py_split ('\n');
		var new_len = len (new_lines);
		var old_len = len (old_lines);
		var min_len = min (old_len, new_len);
		var i = 0;
		while (i < min_len) {
			if (old_lines [i] != new_lines [i]) {
				break;
			}
			i++;
		}
		var leading = i;
		if (leading == new_len) {
			var trailing = 0;
		}
		else {
			var i = 0;
			while (i < min_len - leading) {
				if (old_lines [(old_len - i) - 1] != new_lines [(new_len - i) - 1]) {
					break;
				}
				i++;
			}
			var trailing = i;
		}
		if (trailing == 0) {
			var old_middle_lines = old_lines.__getslice__ (leading, null, 1);
			var new_middle_lines = new_lines.__getslice__ (leading, null, 1);
		}
		else {
			var old_middle_lines = old_lines.__getslice__ (leading, -(trailing), 1);
			var new_middle_lines = new_lines.__getslice__ (leading, -(trailing), 1);
		}
		var i = len (oldText) - 1;
		var old_newlines = 0;
		while (i >= 0 && oldText [i] == '\n') {
			old_newlines++;
			i--;
		}
		var i = len (newText) - 1;
		var new_newlines = 0;
		while (i >= 0 && newText [i] == '\n') {
			new_newlines++;
			i--;
		}
		u.oldText = null;
		u.newText = null;
		u.leading = leading;
		u.trailing = trailing;
		u.oldMiddleLines = old_middle_lines;
		u.newMiddleLines = new_middle_lines;
		u.oldNewlines = old_newlines;
		u.newNewlines = new_newlines;
		u.oldSel = oldSel;
		u.newSel = newSel;
		if (oldYview) {
			u.yview = oldYview;
		}
		else {
			u.yview = c.frame.body.wrapper.getYScrollPosition ();
		}
		var granularity = u.granularity;
		var old_d = u.peekBead (u.bead);
		var old_p = old_d && old_d.py_get ('p');
		if (!(old_d) || !(old_p) || old_p.v != p.v || old_d.py_get ('kind') != 'typing' || old_d.py_get ('undoType') != 'Typing' || undo_type != 'Typing') {
			var newBead = true;
		}
		else if (granularity == 'char') {
			var newBead = true;
		}
		else if (granularity == 'node') {
			var newBead = false;
		}
		else {
			var newBead = old_d.py_get ('leading', 0) != u.leading || old_d.py_get ('trailing', 0) != u.trailing;
			if (granularity == 'word' && !(newBead)) {
				try {
					var __left0__ = 0;
					var old_start = __left0__;
					var old_end = __left0__;
					var new_start = __left0__;
					var new_end = __left0__;
					if (oldSel !== null) {
						var __left0__ = oldSel;
						var old_start = __left0__ [0];
						var old_end = __left0__ [1];
					}
					if (newSel !== null) {
						var __left0__ = newSel;
						var new_start = __left0__ [0];
						var new_end = __left0__ [1];
					}
					if (u.prevSel === null) {
						var __left0__ = tuple ([0, 0]);
						var prev_start = __left0__ [0];
						var prev_end = __left0__ [1];
					}
					else {
						var __left0__ = u.prevSel;
						var prev_start = __left0__ [0];
						var prev_end = __left0__ [1];
					}
					if (old_start != old_end || new_start != new_end) {
						var newBead = true;
					}
					else {
						var __left0__ = g.convertPythonIndexToRowCol (oldText, old_start);
						var old_row = __left0__ [0];
						var old_col = __left0__ [1];
						var __left0__ = g.convertPythonIndexToRowCol (newText, new_start);
						var new_row = __left0__ [0];
						var new_col = __left0__ [1];
						var __left0__ = g.convertPythonIndexToRowCol (oldText, prev_start);
						var prev_row = __left0__ [0];
						var prev_col = __left0__ [1];
						var old_lines = g.splitLines (oldText);
						var new_lines = g.splitLines (newText);
						if (old_row != new_row || abs (old_col - new_col) != 1) {
							var newBead = true;
						}
						else if (old_col == 0 || new_col == 0) {
							// pass;
						}
						else {
							var old_s = old_lines [old_row];
							var new_s = new_lines [new_row];
							if (old_col - 1 >= len (old_s) || new_col - 1 >= len (new_s)) {
								var newBead = true;
							}
							else {
								var old_ch = old_s [old_col - 1];
								var new_ch = new_s [new_col - 1];
								var newBead = self.recognizeStartOfTypingWord (old_lines, old_row, old_col, old_ch, new_lines, new_row, new_col, new_ch, prev_row, prev_col);
							}
						}
					}
				}
				catch (__except0__) {
					if (isinstance (__except0__, Exception)) {
						g.error ('Unexpected exception...');
						g.es_exception ();
						var newBead = true;
					}
					else {
						throw __except0__;
					}
				}
			}
		}
		u.prevSel = u.newSel;
		if (newBead) {
			var bunch = g.Bunch (__kwargtrans__ ({p: p.copy (), kind: 'typing', undoType: undo_type, undoHelper: u.undoTyping, redoHelper: u.redoTyping, oldMarked: (old_p ? old_p.isMarked () : p.isMarked ()), oldText: u.oldText, oldSel: u.oldSel, oldNewlines: u.oldNewlines, oldMiddleLines: u.oldMiddleLines}));
			u.pushBead (bunch);
		}
		else {
			var bunch = old_d;
		}
		bunch.leading = u.leading;
		bunch.trailing = u.trailing;
		bunch.newMarked = p.isMarked ();
		bunch.newNewlines = u.newNewlines;
		bunch.newMiddleLines = u.newMiddleLines;
		bunch.newSel = u.newSel;
		bunch.newText = u.newText;
		bunch.yview = u.yview;
		if (__in__ ('undo', g.app.debug) && __in__ ('verbose', g.app.debug)) {
			print ('u.doTyping: {} => {}'.format (len (oldText), len (newText)));
		}
		if (u.per_node_undo) {
			u.putIvarsToVnode (p);
		}
		p.v.setBodyString (newText);
		u.updateAfterTyping (p, w);
	});},
	setUndoTypingParams: doTyping,
	get recognizeStartOfTypingWord () {return __get__ (this, function (self, old_lines, old_row, old_col, old_ch, new_lines, new_row, new_col, new_ch, prev_row, prev_col) {
		var new_word_started = !(old_ch.isspace ()) && new_ch.isspace ();
		var moved_cursor = new_row != prev_row || new_col != prev_col + 1;
		return new_word_started || moved_cursor;
	});},
	get enableMenuItems () {return __get__ (this, function (self) {
		var u = self;
		var frame = u.c.frame;
		var menu = frame.menu.getMenu ('Edit');
		if (menu) {
			frame.menu.enableMenu (menu, u.redoMenuLabel, u.canRedo ());
			frame.menu.enableMenu (menu, u.undoMenuLabel, u.canUndo ());
		}
	});},
	get onSelect () {return __get__ (this, function (self, old_p, p) {
		var u = self;
		if (u.per_node_undo) {
			if (old_p && u.beads) {
				u.putIvarsToVnode (old_p);
			}
			u.setIvarsFromVnode (p);
			u.setUndoTypes ();
		}
	});},
	get putIvarsToVnode () {return __get__ (this, function (self, p) {
		var __left0__ = tuple ([self, p.v]);
		var u = __left0__ [0];
		var v = __left0__ [1];
		var bunch = g.bunch ();
		for (var key of self.optionalIvars) {
			bunch [key] = getattr (u, key);
		}
		for (var key of tuple (['bead', 'beads', 'undoType'])) {
			bunch [key] = getattr (u, key);
		}
		v.undo_info = bunch;
	});},
	get setIvarsFromVnode () {return __get__ (this, function (self, p) {
		var u = self;
		var v = p.v;
		u.clearUndoState ();
		if (hasattr (v, 'undo_info')) {
			u.setIvarsFromBunch (v.undo_info);
		}
	});},
	get updateAfterTyping () {return __get__ (this, function (self, p, w) {
		var c = self.c;
		if (g.isTextWrapper (w)) {
			var all = w.getAllText ();
			if (g.unitTesting) {
			}
			else if (p.b != all) {
				g.trace ('\nError:p.b != w.getAllText() p:{} {}\n'.format (p.h, g.callers ()));
			}
			var __left0__ = w.getInsertPoint ();
			p.v.insertSpot = __left0__;
			var ins = __left0__;
			var newSel = w.getSelectionRange ();
			if (newSel === null) {
				var __left0__ = tuple ([ins, 0]);
				p.v.selectionStart = __left0__ [0];
				p.v.selectionLength = __left0__ [1];
			}
			else {
				var __left0__ = newSel;
				var i = __left0__ [0];
				var j = __left0__ [1];
				var __left0__ = tuple ([i, j - i]);
				p.v.selectionStart = __left0__ [0];
				p.v.selectionLength = __left0__ [1];
			}
		}
		else {
			if (g.unitTesting) {
			}
			g.trace ('Not a text wrapper');
			p.v.insertSpot = 0;
			var __left0__ = tuple ([0, 0]);
			p.v.selectionStart = __left0__ [0];
			p.v.selectionLength = __left0__ [1];
		}
		if (p.isDirty ()) {
			var redraw_flag = false;
		}
		else {
			p.setDirty ();
			var redraw_flag = true;
		}
		if (!(c.isChanged ())) {
			c.setChanged ();
		}
		c.frame.body.updateEditors ();
		var val = p.computeIcon ();
		if (!(hasattr (p.v, 'iconVal')) || val != p.v.iconVal) {
			p.v.iconVal = val;
			var redraw_flag = true;
		}
		c.frame.scanForTabWidth (p);
		c.recolor ();
		if (g.app.unitTesting) {
			g.app.unitTestDict ['colorized'] = true;
		}
		if (redraw_flag) {
			c.redraw_after_icons_changed ();
		}
		w.setFocus ();
	});},
	get redo () {return __get__ (this, cmd ('redo') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		if (!(c.p)) {
			return ;
		}
		c.endEditing ();
		if (!(u.canRedo ())) {
			return ;
		}
		if (!(u.getBead (u.bead + 1))) {
			return ;
		}
		u.redoing = true;
		u.groupCount = 0;
		if (u.redoHelper) {
			u.redoHelper ();
		}
		else {
			g.trace ('no redo helper for {} {}'.format (u.kind, u.undoType));
		}
		c.checkOutline ();
		u.update_status ();
		u.redoing = false;
		u.bead++;
		u.setUndoTypes ();
	}));},
	get redoHelper () {return __get__ (this, function (self) {
		// pass;
	});},
	get redoChangeBody () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self, self.c.frame.body.wrapper]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = __left0__ [2];
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		u.p.b = u.newBody;
		u.p.h = u.newHead;
		c.frame.tree.setHeadline (u.p, u.newHead);
		if (u.newMarked) {
			u.p.setMarked ();
		}
		else {
			u.p.clearMarked ();
		}
		if (u.groupCount == 0) {
			w.setAllText (u.newBody);
			var __left0__ = u.newSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: u.newIns}));
			w.setYScrollPosition (u.newYScroll);
			c.frame.body.recolor (u.p);
		}
		u.updateMarks ('new');
		u.p.setDirty ();
	});},
	get redoChangeHeadline () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		c.frame.body.recolor (u.p);
		u.p.initHeadString (u.newHead);
		c.frame.tree.setHeadline (u.p, u.newHead);
	});},
	get redoClearRecentFiles () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var rf = g.app.recentFilesManager;
		rf.setRecentFiles (u.newRecentFiles.__getslice__ (0, null, 1));
		rf.createRecentFilesMenuItems (c);
	});},
	get redoCloneMarkedNodes () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		c.selectPosition (u.p);
		c.cloneMarked ();
		u.newP = c.p;
	});},
	get redoCopyMarkedNodes () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		c.selectPosition (u.p);
		c.copyMarked ();
		u.newP = c.p;
	});},
	get redoCloneNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var cc = c.chapterController;
		if (cc) {
			cc.selectChapterByName ('main');
		}
		if (u.newBack) {
			u.newP._linkAfter (u.newBack);
		}
		else if (u.newParent) {
			u.newP._linkAsNthChild (u.newParent, 0);
		}
		else {
			u.newP._linkAsRoot ();
		}
		c.selectPosition (u.newP);
		u.newP.setDirty ();
	});},
	get redoDeleteMarkedNodes () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		c.selectPosition (u.p);
		c.deleteMarked ();
		c.selectPosition (u.newP);
	});},
	get redoDeleteNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		c.selectPosition (u.p);
		c.deleteOutline ();
		c.selectPosition (u.newP);
	});},
	get redoDemote () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var parent_v = u.p._parentVnode ();
		var n = u.p.childIndex ();
		parent_v.children = parent_v.children.__getslice__ (0, n + 1, 1);
		u.p.v.children.extend (u.followingSibs);
		for (var v of u.followingSibs) {
			v.parents.remove (parent_v);
			v.parents.append (u.p.v);
		}
		u.p.setDirty ();
		c.setCurrentPosition (u.p);
	});},
	get redoGroup () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var newSel = u.newSel;
		var p = u.p.copy ();
		u.groupCount++;
		var bunch = u.beads [u.bead + 1];
		var count = 0;
		if (!(hasattr (bunch, 'items'))) {
			g.trace ('oops: expecting bunch.items. got bunch.kind = {}'.format (bunch.kind));
			g.trace (bunch);
		}
		else {
			for (var z of bunch.py_items) {
				self.setIvarsFromBunch (z);
				if (z.redoHelper) {
					z.redoHelper ();
					count++;
				}
				else {
					g.trace ('oops: no redo helper for {} {}'.format (u.undoType, p.h));
				}
			}
		}
		u.groupCount--;
		u.updateMarks ('new');
		if (!(g.unitTesting) && u.verboseUndoGroup) {
			g.es ('redo', count, 'instances');
		}
		p.setDirty ();
		c.selectPosition (p);
		if (newSel) {
			var __left0__ = newSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			c.frame.body.wrapper.setSelectionRange (i, j);
		}
	});},
	get redoHoistNode () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		u.p.setDirty ();
		c.selectPosition (u.p);
		c.hoist ();
	});},
	get redoDehoistNode () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		u.p.setDirty ();
		c.selectPosition (u.p);
		c.dehoist ();
	});},
	get redoInsertNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var cc = c.chapterController;
		if (cc) {
			cc.selectChapterByName ('main');
		}
		if (u.newBack) {
			u.newP._linkAfter (u.newBack);
		}
		else if (u.newParent) {
			u.newP._linkAsNthChild (u.newParent, 0);
		}
		else {
			u.newP._linkAsRoot ();
		}
		if (u.pasteAsClone) {
			for (var bunch of u.afterTree) {
				var v = bunch.v;
				if (u.newP.v == v) {
					u.newP.b = bunch.body;
					u.newP.h = bunch.head;
				}
				else {
					v.setBodyString (bunch.body);
					v.setHeadString (bunch.head);
				}
			}
		}
		u.newP.setDirty ();
		c.selectPosition (u.newP);
	});},
	get redoMark () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		u.updateMarks ('new');
		if (u.groupCount == 0) {
			u.p.setDirty ();
			c.selectPosition (u.p);
		}
	});},
	get redoMove () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var cc = c.chapterController;
		var v = u.p.v;
		if (cc) {
			cc.selectChapterByName ('main');
		}
		delete u.oldParent_v.children [u.oldN];
		u.oldParent_v.setDirty ();
		var parent_v = u.newParent_v;
		parent_v.children.insert (u.newN, v);
		v.parents.append (u.newParent_v);
		v.parents.remove (u.oldParent_v);
		u.newParent_v.setDirty ();
		u.updateMarks ('new');
		u.newP.setDirty ();
		c.selectPosition (u.newP);
	});},
	get redoNodeContents () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = c.frame.body.wrapper;
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		u.p.setBodyString (u.newBody);
		w.setAllText (u.newBody);
		c.frame.body.recolor (u.p);
		u.p.initHeadString (u.newHead);
		c.frame.tree.setHeadline (u.p, u.newHead);
		if (u.groupCount == 0 && u.newSel) {
			var __left0__ = u.newSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j);
		}
		if (u.groupCount == 0 && u.newYScroll !== null) {
			w.setYScrollPosition (u.newYScroll);
		}
		u.updateMarks ('new');
		u.p.setDirty ();
	});},
	get redoPromote () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var parent_v = u.p._parentVnode ();
		var n = u.p.childIndex () + 1;
		var old_children = parent_v.children.__getslice__ (0, null, 1);
		parent_v.children = old_children.__getslice__ (0, n, 1);
		parent_v.children.extend (u.children);
		parent_v.children.extend (old_children.__getslice__ (n, null, 1));
		u.p.v.children = [];
		for (var child of u.children) {
			child.parents.remove (u.p.v);
			child.parents.append (parent_v);
		}
		u.p.setDirty ();
		c.setCurrentPosition (u.p);
	});},
	get redoSort () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var parent_v = u.p._parentVnode ();
		parent_v.children = u.newChildren;
		var p = c.setPositionAfterSort (u.sortChildren);
		p.setAllAncestorAtFileNodesDirty ();
		c.setCurrentPosition (p);
	});},
	get redoTree () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		u.p = self.undoRedoTree (u.p, u.oldTree, u.newTree);
		u.p.setDirty ();
		c.selectPosition (u.p);
		if (u.newSel) {
			var __left0__ = u.newSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			c.frame.body.wrapper.setSelectionRange (i, j);
		}
	});},
	get redoTyping () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var current = c.p;
		var w = c.frame.body.wrapper;
		if (current != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		self.undoRedoText (u.p, u.leading, u.trailing, u.newMiddleLines, u.oldMiddleLines, u.newNewlines, u.oldNewlines, __kwargtrans__ ({tag: 'redo', undoType: u.undoType}));
		u.updateMarks ('new');
		if (u.newSel) {
			c.bodyWantsFocus ();
			var __left0__ = u.newSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
		}
		if (u.yview) {
			c.bodyWantsFocus ();
			w.setYScrollPosition (u.yview);
		}
	});},
	get undo () {return __get__ (this, cmd ('undo') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var u = self;
		var c = u.c;
		if (!(c.p)) {
			g.trace ('no current position');
			return ;
		}
		c.endEditing ();
		if (u.per_node_undo) {
			u.setIvarsFromVnode (c.p);
		}
		if (!(u.canUndo ())) {
			return ;
		}
		if (!(u.getBead (u.bead))) {
			return ;
		}
		u.undoing = true;
		u.groupCount = 0;
		if (u.undoHelper) {
			u.undoHelper ();
		}
		else {
			g.trace ('no undo helper for {} {}'.format (u.kind, u.undoType));
		}
		c.checkOutline ();
		u.update_status ();
		u.undoing = false;
		u.bead--;
		u.setUndoTypes ();
	}));},
	get undoHelper () {return __get__ (this, function (self) {
		// pass;
	});},
	get undoChangeBody () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self, self.c.frame.body.wrapper]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = __left0__ [2];
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		u.p.b = u.oldBody;
		u.p.h = u.oldHead;
		c.frame.tree.setHeadline (u.p, u.oldHead);
		if (u.oldMarked) {
			u.p.setMarked ();
		}
		else {
			u.p.clearMarked ();
		}
		if (u.groupCount == 0) {
			w.setAllText (u.oldBody);
			var __left0__ = u.oldSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: u.oldIns}));
			w.setYScrollPosition (u.oldYScroll);
			c.frame.body.recolor (u.p);
		}
		u.updateMarks ('old');
	});},
	get undoChangeHeadline () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		c.frame.body.recolor (u.p);
		u.p.initHeadString (u.oldHead);
		c.frame.tree.setHeadline (u.p, u.oldHead);
	});},
	get undoClearRecentFiles () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var rf = g.app.recentFilesManager;
		rf.setRecentFiles (u.oldRecentFiles.__getslice__ (0, null, 1));
		rf.createRecentFilesMenuItems (c);
	});},
	get undoCloneMarkedNodes () {return __get__ (this, function (self) {
		var u = self;
		var py_next = u.p.py_next ();
		py_next.doDelete ();
		u.p.setAllAncestorAtFileNodesDirty ();
		u.c.selectPosition (u.p);
	});},
	get undoCloneNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var cc = c.chapterController;
		if (cc) {
			cc.selectChapterByName ('main');
		}
		c.selectPosition (u.newP);
		c.deleteOutline ();
		u.p.setDirty ();
		c.selectPosition (u.p);
	});},
	get undoCopyMarkedNodes () {return __get__ (this, function (self) {
		var u = self;
		var py_next = u.p.py_next ();
		py_next.doDelete ();
		u.p.setAllAncestorAtFileNodesDirty ();
		u.c.selectPosition (u.p);
	});},
	get undoDeleteMarkedNodes () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var aList = u.deleteMarkedNodesData.__getslice__ (0, null, 1);
		aList.reverse ();
		for (var p of aList) {
			if (p.stack) {
				var __left0__ = p.stack [-(1)];
				var parent_v = __left0__ [0];
				var junk = __left0__ [1];
			}
			else {
				var parent_v = c.hiddenRootNode;
			}
			p.v._addLink (p._childIndex, parent_v);
			p.v.setDirty ();
		}
		u.p.setAllAncestorAtFileNodesDirty ();
		c.selectPosition (u.p);
	});},
	get undoDeleteNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		if (u.oldBack) {
			u.p._linkAfter (u.oldBack);
		}
		else if (u.oldParent) {
			u.p._linkAsNthChild (u.oldParent, 0);
		}
		else {
			u.p._linkAsRoot ();
		}
		u.p.setDirty ();
		c.selectPosition (u.p);
	});},
	get undoDemote () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var parent_v = u.p._parentVnode ();
		var n = len (u.followingSibs);
		u.p.v.children = u.p.v.children.__getslice__ (0, -(n), 1);
		parent_v.children.extend (u.followingSibs);
		parent_v.setDirty ();
		for (var sib of u.followingSibs) {
			sib.parents.remove (u.p.v);
			sib.parents.append (parent_v);
		}
		u.p.setAllAncestorAtFileNodesDirty ();
		c.setCurrentPosition (u.p);
	});},
	get undoGroup () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var oldSel = u.oldSel;
		var p = u.p.copy ();
		u.groupCount++;
		var bunch = u.beads [u.bead];
		var count = 0;
		if (!(hasattr (bunch, 'items'))) {
			g.trace ('oops: expecting bunch.items. got bunch.kind = {}'.format (bunch.kind));
			g.trace (bunch);
		}
		else {
			var reversedItems = bunch.py_items.__getslice__ (0, null, 1);
			reversedItems.reverse ();
			for (var z of reversedItems) {
				self.setIvarsFromBunch (z);
				if (z.undoHelper) {
					z.undoHelper ();
					count++;
				}
				else {
					g.trace ('oops: no undo helper for {} {}'.format (u.undoType, p.v));
				}
			}
		}
		u.groupCount--;
		u.updateMarks ('old');
		if (!(g.unitTesting) && u.verboseUndoGroup) {
			g.es ('undo', count, 'instances');
		}
		p.setDirty ();
		c.selectPosition (p);
		if (oldSel) {
			var __left0__ = oldSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			c.frame.body.wrapper.setSelectionRange (i, j);
		}
	});},
	get undoHoistNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		u.p.setDirty ();
		c.selectPosition (u.p);
		c.dehoist ();
	});},
	get undoDehoistNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		u.p.setDirty ();
		c.selectPosition (u.p);
		c.hoist ();
	});},
	get undoInsertNode () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var cc = c.chapterController;
		if (cc) {
			cc.selectChapterByName ('main');
		}
		u.newP.setAllAncestorAtFileNodesDirty ();
		c.selectPosition (u.newP);
		c.deleteOutline ();
		if (u.pasteAsClone) {
			for (var bunch of u.beforeTree) {
				var v = bunch.v;
				if (u.p.v == v) {
					u.p.b = bunch.body;
					u.p.h = bunch.head;
				}
				else {
					v.setBodyString (bunch.body);
					v.setHeadString (bunch.head);
				}
			}
		}
	});},
	get undoMark () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		u.updateMarks ('old');
		if (u.groupCount == 0) {
			u.p.setDirty ();
			c.selectPosition (u.p);
		}
	});},
	get undoMove () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var cc = c.chapterController;
		if (cc) {
			cc.selectChapterByName ('main');
		}
		var v = u.p.v;
		delete u.newParent_v.children [u.newN];
		u.oldParent_v.children.insert (u.oldN, v);
		v.parents.append (u.oldParent_v);
		v.parents.remove (u.newParent_v);
		u.updateMarks ('old');
		u.p.setDirty ();
		c.selectPosition (u.p);
	});},
	get undoNodeContents () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = c.frame.body.wrapper;
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		u.p.b = u.oldBody;
		w.setAllText (u.oldBody);
		c.frame.body.recolor (u.p);
		u.p.h = u.oldHead;
		c.frame.tree.setHeadline (u.p, u.oldHead);
		if (u.groupCount == 0 && u.oldSel) {
			var __left0__ = u.oldSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j);
		}
		if (u.groupCount == 0 && u.oldYScroll !== null) {
			w.setYScrollPosition (u.oldYScroll);
		}
		u.updateMarks ('old');
	});},
	get undoPromote () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var parent_v = u.p._parentVnode ();
		var n = u.p.childIndex () + 1;
		var old_children = parent_v.children;
		parent_v.children = old_children.__getslice__ (0, n, 1);
		parent_v.children.extend (old_children.__getslice__ (n + len (u.children), null, 1));
		u.p.v.children = u.children.__getslice__ (0, null, 1);
		parent_v.setDirty ();
		for (var child of u.children) {
			child.parents.remove (parent_v);
			child.parents.append (u.p.v);
		}
		u.p.setAllAncestorAtFileNodesDirty ();
		c.setCurrentPosition (u.p);
	});},
	get undoRedoText () {return __get__ (this, function (self, p, leading, trailing, oldMidLines, newMidLines, oldNewlines, newNewlines, tag, undoType) {
		if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
			var tag = 'undo';
		};
		if (typeof undoType == 'undefined' || (undoType != null && undoType.hasOwnProperty ("__kwargtrans__"))) {;
			var undoType = null;
		};
		var u = self;
		var c = u.c;
		var w = c.frame.body.wrapper;
		var body = p.b;
		var body = g.checkUnicode (body);
		var body_lines = body.py_split ('\n');
		var s = [];
		if (leading > 0) {
			s.extend (body_lines.__getslice__ (0, leading, 1));
		}
		if (oldMidLines) {
			s.extend (oldMidLines);
		}
		if (trailing > 0) {
			s.extend (body_lines.__getslice__ (-(trailing), null, 1));
		}
		var s = '\n'.join (s);
		while (s && s [-(1)] == '\n') {
			var s = s.__getslice__ (0, -(1), 1);
		}
		if (oldNewlines > 0) {
			var s = s + '\n' * oldNewlines;
		}
		var result = s;
		p.setBodyString (result);
		p.setDirty ();
		w.setAllText (result);
		var sel = (tag == 'undo' ? u.oldSel : u.newSel);
		if (sel) {
			var __left0__ = sel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
		}
		c.frame.body.recolor (p);
		w.seeInsertPoint ();
	});},
	get undoRedoTree () {return __get__ (this, function (self, p, new_data, old_data) {
		var u = self;
		var c = u.c;
		if (new_data === null) {
			var bunch = u.beads [u.bead];
			bunch.newTree = u.saveTree (p.copy ());
			u.beads [u.bead] = bunch;
		}
		u.restoreTree (old_data);
		c.setBodyString (p, p.b);
		return p;
	});},
	get undoSort () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		var parent_v = u.p._parentVnode ();
		parent_v.children = u.oldChildren;
		var p = c.setPositionAfterSort (u.sortChildren);
		p.setAllAncestorAtFileNodesDirty ();
		c.setCurrentPosition (p);
	});},
	get undoTree () {return __get__ (this, function (self) {
		var u = self;
		var c = u.c;
		u.p = self.undoRedoTree (u.p, u.newTree, u.oldTree);
		u.p.setAllAncestorAtFileNodesDirty ();
		c.selectPosition (u.p);
		if (u.oldSel) {
			var __left0__ = u.oldSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			c.frame.body.wrapper.setSelectionRange (i, j);
		}
	});},
	get undoTyping () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = c.frame.body.wrapper;
		if (c.p != u.p) {
			c.selectPosition (u.p);
		}
		u.p.setDirty ();
		self.undoRedoText (u.p, u.leading, u.trailing, u.oldMiddleLines, u.newMiddleLines, u.oldNewlines, u.newNewlines, __kwargtrans__ ({tag: 'undo', undoType: u.undoType}));
		u.updateMarks ('old');
		if (u.oldSel) {
			c.bodyWantsFocus ();
			var __left0__ = u.oldSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
		}
		if (u.yview) {
			c.bodyWantsFocus ();
			w.setYScrollPosition (u.yview);
		}
	});},
	get update_status () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = c.frame.body.wrapper;
		c.frame.body.updateEditors ();
		if (0) {
			c.selectPosition (c.p);
		}
		else {
			c.setCurrentPosition (c.p);
		}
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		var ins = w.getInsertPoint ();
		c.redraw ();
		c.recolor ();
		if (u.inHead) {
			c.editHeadline ();
			u.inHead = false;
		}
		else {
			c.bodyWantsFocus ();
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: ins}));
			w.seeInsertPoint ();
		}
	});}
});

//# sourceMappingURL=leo.core.leoUndo.map