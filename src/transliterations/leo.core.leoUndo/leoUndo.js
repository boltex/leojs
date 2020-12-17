/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 08:56:40
/* 000043 */ import {} from './org.transcrypt.__runtime__.js';
/* 000043 */ import {leoGlobals as g} from './leo.core.js';
/* 000001 */ var __name__ = '__main__';
/* 000047 */ export var Undoer =  __class__ ('Undoer', [object], {
/* 000047 */ 	__module__: __name__,
/* 000055 */ 	get __init__ () {return __get__ (this, function (self, c) {
/* 000056 */ 		self.c = c;
/* 000057 */ 		self.granularity = null;
/* 000058 */ 		self.max_undo_stack_size = c.config.getInt ('max-undo-stack-size') || 0;
/* 000060 */ 		self.beads = [];
/* 000061 */ 		self.bead = -(1);
/* 000062 */ 		self.undoType = "Can't Undo";
/* 000064 */ 		self.redoMenuLabel = "Can't Redo";
/* 000065 */ 		self.undoMenuLabel = "Can't Undo";
/* 000066 */ 		self.realRedoMenuLabel = "Can't Redo";
/* 000067 */ 		self.realUndoMenuLabel = "Can't Undo";
/* 000068 */ 		self.undoing = false;
/* 000069 */ 		self.redoing = false;
/* 000070 */ 		self.per_node_undo = false;
/* 000072 */ 		self.optionalIvars = [];
/* 000074 */ 		self.afterTree = null;
/* 000075 */ 		self.beforeTree = null;
/* 000076 */ 		self.children = null;
/* 000077 */ 		self.deleteMarkedNodesData = null;
/* 000078 */ 		self.followingSibs = null;
/* 000079 */ 		self.inHead = null;
/* 000080 */ 		self.kind = null;
/* 000081 */ 		self.newBack = null;
/* 000082 */ 		self.newBody = null;
/* 000083 */ 		self.newChildren = null;
/* 000084 */ 		self.newHead = null;
/* 000085 */ 		self.newIns = null;
/* 000086 */ 		self.newMarked = null;
/* 000087 */ 		self.newN = null;
/* 000088 */ 		self.newP = null;
/* 000089 */ 		self.newParent = null;
/* 000090 */ 		self.newParent_v = null;
/* 000091 */ 		self.newRecentFiles = null;
/* 000092 */ 		self.newSel = null;
/* 000093 */ 		self.newTree = null;
/* 000094 */ 		self.newYScroll = null;
/* 000095 */ 		self.oldBack = null;
/* 000096 */ 		self.oldBody = null;
/* 000097 */ 		self.oldChildren = null;
/* 000098 */ 		self.oldHead = null;
/* 000099 */ 		self.oldIns = null;
/* 000100 */ 		self.oldMarked = null;
/* 000101 */ 		self.oldN = null;
/* 000102 */ 		self.oldParent = null;
/* 000103 */ 		self.oldParent_v = null;
/* 000104 */ 		self.oldRecentFiles = null;
/* 000105 */ 		self.oldSel = null;
/* 000106 */ 		self.oldTree = null;
/* 000107 */ 		self.oldYScroll = null;
/* 000108 */ 		self.pasteAsClone = null;
/* 000109 */ 		self.prevSel = null;
/* 000110 */ 		self.sortChildren = null;
/* 000111 */ 		self.verboseUndoGroup = null;
/* 000112 */ 		self.reloadSettings ();
/* 000112 */ 	});},
/* 000114 */ 	get reloadSettings () {return __get__ (this, function (self) {
/* 000116 */ 		var c = self.c;
/* 000117 */ 		self.granularity = c.config.getString ('undo-granularity');
/* 000118 */ 		if (self.granularity) {
/* 000119 */ 			self.granularity = self.granularity.lower ();
/* 000119 */ 		}
/* 000120 */ 		if (!__in__ (self.granularity, tuple (['node', 'line', 'word', 'char']))) {
/* 000121 */ 			self.granularity = 'line';
/* 000121 */ 		}
/* 000121 */ 	});},
/* 000123 */ 	get cmd () {return __get__ (this, function (py_name) {
/* 000126 */ 		return g.new_cmd_decorator (py_name, ['c', 'undoer']);
/* 000126 */ 	});},
/* 000129 */ 	get clearOptionalIvars () {return __get__ (this, function (self) {
/* 000130 */ 		var u = self;
/* 000131 */ 		u.p = null;
/* 000132 */ 		for (var ivar of u.optionalIvars) {
/* 000133 */ 			setattr (u, ivar, null);
/* 000133 */ 		}
/* 000133 */ 	});},
/* 000135 */ 	get cutStack () {return __get__ (this, function (self) {
/* 000136 */ 		var u = self;
/* 000136 */ 		var n = u.max_undo_stack_size;
/* 000137 */ 		if ((u.bead >= n && n > 0) && !(g.app.unitTesting)) {
/* 000139 */ 			var i = len (u.beads) - 1;
/* 000140 */ 			while (i >= 0) {
/* 000141 */ 				var bunch = u.beads [i];
/* 000142 */ 				if (hasattr (bunch, 'kind') && bunch.kind == 'beforeGroup') {
/* 000143 */ 					return ;
/* 000143 */ 				}
/* 000143 */ 				i--;
/* 000143 */ 			}
/* 000147 */ 			u.beads = u.beads.__getslice__ (-(n), null, 1);
/* 000148 */ 			u.bead = n - 1;
/* 000148 */ 		}
/* 000149 */ 		if (__in__ ('undo', g.app.debug) && __in__ ('verbose', g.app.debug)) {
/* 000150 */ 			print ('u.cutStack: {}'.format (len (u.beads)));
/* 000150 */ 		}
/* 000150 */ 	});},
/* 000152 */ 	get dumpBead () {return __get__ (this, function (self, n) {
/* 000153 */ 		var u = self;
/* 000154 */ 		if (n < 0 || n >= len (u.beads)) {
/* 000155 */ 			return tuple (['no bead: n = ', n]);
/* 000155 */ 		}
/* 000157 */ 		var result = [];
/* 000158 */ 		result.append ('-' * 10);
/* 000159 */ 		result.append ('len(u.beads): {}, n: {}'.format (len (u.beads), n));
/* 000160 */ 		for (var ivar of tuple (['kind', 'newP', 'newN', 'p', 'oldN', 'undoHelper'])) {
/* 000161 */ 			result.append ('{} = {}'.format (ivar, getattr (self, ivar)));
/* 000161 */ 		}
/* 000162 */ 		return '\n'.join (result);
/* 000162 */ 	});},
/* 000164 */ 	get dumpTopBead () {return __get__ (this, function (self) {
/* 000165 */ 		var u = self;
/* 000166 */ 		var n = len (u.beads);
/* 000167 */ 		if (n > 0) {
/* 000168 */ 			return self.dumpBead (n - 1);
/* 000168 */ 		}
/* 000169 */ 		return '<no top bead>';
/* 000169 */ 	});},
/* 000171 */ 	get getBead () {return __get__ (this, function (self, n) {
/* 000173 */ 		var u = self;
/* 000174 */ 		if (n < 0 || n >= len (u.beads)) {
/* 000175 */ 			return null;
/* 000175 */ 		}
/* 000176 */ 		var bunch = u.beads [n];
/* 000177 */ 		self.setIvarsFromBunch (bunch);
/* 000178 */ 		if (__in__ ('undo', g.app.debug)) {
/* 000179 */ 			print (' u.getBead: {} of {}'.format (n, len (u.beads)));
/* 000179 */ 		}
/* 000180 */ 		return bunch;
/* 000180 */ 	});},
/* 000182 */ 	get peekBead () {return __get__ (this, function (self, n) {
/* 000184 */ 		var u = self;
/* 000185 */ 		if (n < 0 || n >= len (u.beads)) {
/* 000186 */ 			return null;
/* 000186 */ 		}
/* 000187 */ 		return u.beads [n];
/* 000187 */ 	});},
/* 000189 */ 	get pushBead () {return __get__ (this, function (self, bunch) {
/* 000190 */ 		var u = self;
/* 000192 */ 		var bunch2 = u.bead >= 0 && u.bead < len (u.beads) && u.beads [u.bead];
/* 000193 */ 		if (bunch2 && hasattr (bunch2, 'kind') && bunch2.kind == 'beforeGroup') {
/* 000195 */ 			bunch2.py_items.append (bunch);
/* 000195 */ 		}
/* 000196 */ 		else {
/* 000196 */ 			u.bead++;
/* 000199 */ 			u.beads.__setslice__ (u.bead, null, null, [bunch]);
/* 000201 */ 			u.setUndoTypes ();
/* 000201 */ 		}
/* 000202 */ 		if (__in__ ('undo', g.app.debug)) {
/* 000203 */ 			print ('u.pushBead: {} {}'.format (len (u.beads), bunch.undoType));
/* 000203 */ 		}
/* 000203 */ 	});},
/* 000205 */ 	get redoMenuName () {return __get__ (this, function (self, py_name) {
/* 000206 */ 		if (py_name == "Can't Redo") {
/* 000207 */ 			return py_name;
/* 000207 */ 		}
/* 000208 */ 		return 'Redo ' + py_name;
/* 000208 */ 	});},
/* 000210 */ 	get undoMenuName () {return __get__ (this, function (self, py_name) {
/* 000211 */ 		if (py_name == "Can't Undo") {
/* 000212 */ 			return py_name;
/* 000212 */ 		}
/* 000213 */ 		return 'Undo ' + py_name;
/* 000213 */ 	});},
/* 000215 */ 	get setIvarsFromBunch () {return __get__ (this, function (self, bunch) {
/* 000216 */ 		var u = self;
/* 000217 */ 		u.clearOptionalIvars ();
/* 000218 */ 		if (0) {
/* 000219 */ 			g.pr ('-' * 40);
/* 000220 */ 			for (var key of list (bunch.py_keys ())) {
/* 000221 */ 				g.trace ('{} {}'.format (key, bunch.py_get (key)));
/* 000221 */ 			}
/* 000222 */ 			g.pr ('-' * 20);
/* 000222 */ 		}
/* 000223 */ 		if (g.unitTesting) {
/* 000224 */ 			var val = bunch.py_get ('oldMarked');
/* 000224 */ 		}
/* 000227 */ 		for (var key of list (bunch.py_keys ())) {
/* 000228 */ 			var val = bunch.py_get (key);
/* 000229 */ 			setattr (u, key, val);
/* 000230 */ 			if (!__in__ (key, u.optionalIvars)) {
/* 000231 */ 				u.optionalIvars.append (key);
/* 000231 */ 			}
/* 000231 */ 		}
/* 000231 */ 	});},
/* 000235 */ 	get setRedoType () {return __get__ (this, function (self, theType) {
/* 000237 */ 		var u = self;
/* 000237 */ 		var frame = u.c.frame;
/* 000238 */ 		if (!(isinstance (theType, str))) {
/* 000239 */ 			g.trace ('oops: expected string for command, got {}'.format (theType));
/* 000240 */ 			g.trace (g.callers ());
/* 000241 */ 			var theType = '<unknown>';
/* 000241 */ 		}
/* 000242 */ 		var menu = frame.menu.getMenu ('Edit');
/* 000243 */ 		var py_name = u.redoMenuName (theType);
/* 000244 */ 		if (py_name != u.redoMenuLabel) {
/* 000246 */ 			var realLabel = frame.menu.getRealMenuName (py_name);
/* 000247 */ 			if (realLabel == py_name) {
/* 000248 */ 				var underline = (g.match (py_name, 0, "Can't") ? -(1) : 0);
/* 000248 */ 			}
/* 000249 */ 			else {
/* 000250 */ 				var underline = realLabel.find ('&');
/* 000250 */ 			}
/* 000251 */ 			var realLabel = realLabel.py_replace ('&', '');
/* 000252 */ 			frame.menu.setMenuLabel (menu, u.realRedoMenuLabel, realLabel, __kwargtrans__ ({underline: underline}));
/* 000254 */ 			u.redoMenuLabel = py_name;
/* 000255 */ 			u.realRedoMenuLabel = realLabel;
/* 000255 */ 		}
/* 000255 */ 	});},
/* 000257 */ 	get setUndoType () {return __get__ (this, function (self, theType) {
/* 000259 */ 		var u = self;
/* 000259 */ 		var frame = u.c.frame;
/* 000260 */ 		if (!(isinstance (theType, str))) {
/* 000261 */ 			g.trace ('oops: expected string for command, got {}'.format (repr (theType)));
/* 000262 */ 			g.trace (g.callers ());
/* 000263 */ 			var theType = '<unknown>';
/* 000263 */ 		}
/* 000264 */ 		var menu = frame.menu.getMenu ('Edit');
/* 000265 */ 		var py_name = u.undoMenuName (theType);
/* 000266 */ 		if (py_name != u.undoMenuLabel) {
/* 000268 */ 			var realLabel = frame.menu.getRealMenuName (py_name);
/* 000269 */ 			if (realLabel == py_name) {
/* 000270 */ 				var underline = (g.match (py_name, 0, "Can't") ? -(1) : 0);
/* 000270 */ 			}
/* 000271 */ 			else {
/* 000272 */ 				var underline = realLabel.find ('&');
/* 000272 */ 			}
/* 000273 */ 			var realLabel = realLabel.py_replace ('&', '');
/* 000274 */ 			frame.menu.setMenuLabel (menu, u.realUndoMenuLabel, realLabel, __kwargtrans__ ({underline: underline}));
/* 000276 */ 			u.undoType = theType;
/* 000277 */ 			u.undoMenuLabel = py_name;
/* 000278 */ 			u.realUndoMenuLabel = realLabel;
/* 000278 */ 		}
/* 000278 */ 	});},
/* 000280 */ 	get setUndoTypes () {return __get__ (this, function (self) {
/* 000282 */ 		var u = self;
/* 000284 */ 		var bunch = u.peekBead (u.bead);
/* 000285 */ 		if (bunch) {
/* 000286 */ 			u.setUndoType (bunch.undoType);
/* 000286 */ 		}
/* 000287 */ 		else {
/* 000288 */ 			u.setUndoType ("Can't Undo");
/* 000288 */ 		}
/* 000290 */ 		var bunch = u.peekBead (u.bead + 1);
/* 000291 */ 		if (bunch) {
/* 000292 */ 			u.setRedoType (bunch.undoType);
/* 000292 */ 		}
/* 000293 */ 		else {
/* 000294 */ 			u.setRedoType ("Can't Redo");
/* 000294 */ 		}
/* 000295 */ 		u.cutStack ();
/* 000295 */ 	});},
/* 000297 */ 	get restoreTree () {return __get__ (this, function (self, treeInfo) {
/* 000300 */ 		var u = self;
/* 000302 */ 		for (var [v, vInfo, tInfo] of treeInfo) {
/* 000303 */ 			u.restoreVnodeUndoInfo (vInfo);
/* 000304 */ 			u.restoreTnodeUndoInfo (tInfo);
/* 000304 */ 		}
/* 000304 */ 	});},
/* 000306 */ 	get restoreVnodeUndoInfo () {return __get__ (this, function (self, bunch) {
/* 000308 */ 		var v = bunch.v;
/* 000309 */ 		v.statusBits = bunch.statusBits;
/* 000310 */ 		v.children = bunch.children;
/* 000311 */ 		v.parents = bunch.parents;
/* 000312 */ 		var uA = bunch.py_get ('unknownAttributes');
/* 000313 */ 		if (uA !== null) {
/* 000314 */ 			v.unknownAttributes = uA;
/* 000315 */ 			v._p_changed = 1;
/* 000315 */ 		}
/* 000315 */ 	});},
/* 000317 */ 	get restoreTnodeUndoInfo () {return __get__ (this, function (self, bunch) {
/* 000318 */ 		var v = bunch.v;
/* 000319 */ 		v.h = bunch.headString;
/* 000320 */ 		v.b = bunch.bodyString;
/* 000321 */ 		v.statusBits = bunch.statusBits;
/* 000322 */ 		var uA = bunch.py_get ('unknownAttributes');
/* 000323 */ 		if (uA !== null) {
/* 000324 */ 			v.unknownAttributes = uA;
/* 000325 */ 			v._p_changed = 1;
/* 000325 */ 		}
/* 000325 */ 	});},
/* 000327 */ 	get saveTree () {return __get__ (this, function (self, p, treeInfo) {
/* 000327 */ 		if (typeof treeInfo == 'undefined' || (treeInfo != null && treeInfo.hasOwnProperty ("__kwargtrans__"))) {;
/* 000327 */ 			var treeInfo = null;
/* 000327 */ 		};
/* 000353 */ 		var u = self;
/* 000353 */ 		var topLevel = treeInfo === null;
/* 000354 */ 		if (topLevel) {
/* 000354 */ 			var treeInfo = [];
/* 000354 */ 		}
/* 000356 */ 		var data = tuple ([p.v, u.createVnodeUndoInfo (p.v), u.createTnodeUndoInfo (p.v)]);
/* 000357 */ 		treeInfo.append (data);
/* 000359 */ 		var child = p.firstChild ();
/* 000360 */ 		while (child) {
/* 000361 */ 			self.saveTree (child, treeInfo);
/* 000362 */ 			var child = child.py_next ();
/* 000362 */ 		}
/* 000363 */ 		return treeInfo;
/* 000363 */ 	});},
/* 000365 */ 	get createVnodeUndoInfo () {return __get__ (this, function (self, v) {
/* 000367 */ 		var bunch = g.Bunch (__kwargtrans__ ({v: v, statusBits: v.statusBits, parents: v.parents.__getslice__ (0, null, 1), children: v.children.__getslice__ (0, null, 1)}));
/* 000373 */ 		if (hasattr (v, 'unknownAttributes')) {
/* 000374 */ 			bunch.unknownAttributes = v.unknownAttributes;
/* 000374 */ 		}
/* 000375 */ 		return bunch;
/* 000375 */ 	});},
/* 000377 */ 	get createTnodeUndoInfo () {return __get__ (this, function (self, v) {
/* 000379 */ 		var bunch = g.Bunch (__kwargtrans__ ({v: v, headString: v.h, bodyString: v.b, statusBits: v.statusBits}));
/* 000380 */ 		if (hasattr (v, 'unknownAttributes')) {
/* 000381 */ 			bunch.unknownAttributes = v.unknownAttributes;
/* 000381 */ 		}
/* 000382 */ 		return bunch;
/* 000382 */ 	});},
/* 000384 */ 	get trace () {return __get__ (this, function (self) {
/* 000385 */ 		var ivars = tuple (['kind', 'undoType']);
/* 000386 */ 		for (var ivar of ivars) {
/* 000387 */ 			g.pr (ivar, getattr (self, ivar));
/* 000387 */ 		}
/* 000387 */ 	});},
/* 000389 */ 	get updateMarks () {return __get__ (this, function (self, oldOrNew) {
/* 000391 */ 		var u = self;
/* 000391 */ 		var c = u.c;
/* 000392 */ 		if (!__in__ (oldOrNew, tuple (['new', 'old']))) {
/* 000393 */ 			g.trace ("can't happen");
/* 000394 */ 			return ;
/* 000394 */ 		}
/* 000395 */ 		var isOld = oldOrNew == 'old';
/* 000396 */ 		var marked = (isOld ? u.oldMarked : u.newMarked);
/* 000398 */ 		if (marked) {
/* 000399 */ 			c.setMarked (u.p);
/* 000399 */ 		}
/* 000400 */ 		else {
/* 000401 */ 			c.clearMarked (u.p);
/* 000401 */ 		}
/* 000403 */ 		u.p.setDirty ();
/* 000404 */ 		u.c.setChanged ();
/* 000404 */ 	});},
/* 000408 */ 	get afterChangeBody () {return __get__ (this, function (self, p, command, bunch) {
/* 000417 */ 		var c = self.c;
/* 000418 */ 		var __left0__ = tuple ([self, c.frame.body.wrapper]);
/* 000418 */ 		var u = __left0__ [0];
/* 000418 */ 		var w = __left0__ [1];
/* 000419 */ 		if (u.redoing || u.undoing) {
/* 000420 */ 			return ;
/* 000420 */ 		}
/* 000422 */ 		bunch.kind = 'body';
/* 000423 */ 		bunch.undoType = command;
/* 000424 */ 		bunch.undoHelper = u.undoChangeBody;
/* 000425 */ 		bunch.redoHelper = u.redoChangeBody;
/* 000426 */ 		bunch.newBody = p.b;
/* 000427 */ 		bunch.newHead = p.h;
/* 000428 */ 		bunch.newIns = w.getInsertPoint ();
/* 000429 */ 		bunch.newMarked = p.isMarked ();
/* 000431 */ 		if (w) {
/* 000432 */ 			bunch.newSel = w.getSelectionRange ();
/* 000432 */ 		}
/* 000433 */ 		else {
/* 000434 */ 			bunch.newSel = tuple ([0, 0]);
/* 000434 */ 		}
/* 000435 */ 		bunch.newYScroll = (w ? w.getYScrollPosition () : 0);
/* 000436 */ 		u.pushBead (bunch);
/* 000438 */ 		if (g.unitTesting) {
/* 000438 */ 		}
/* 000440 */ 		else if (command.lower () == 'typing') {
/* 000441 */ 			g.trace ('Error: undoType should not be "Typing"\nCall u.doTyping instead');
/* 000441 */ 		}
/* 000444 */ 		u.updateAfterTyping (p, w);
/* 000444 */ 	});},
/* 000446 */ 	get afterChangeGroup () {return __get__ (this, function (self, p, undoType, reportFlag) {
/* 000446 */ 		if (typeof reportFlag == 'undefined' || (reportFlag != null && reportFlag.hasOwnProperty ("__kwargtrans__"))) {;
/* 000446 */ 			var reportFlag = false;
/* 000446 */ 		};
/* 000451 */ 		var u = self;
/* 000451 */ 		var c = self.c;
/* 000452 */ 		var w = c.frame.body.wrapper;
/* 000453 */ 		if (u.redoing || u.undoing) {
/* 000454 */ 			return ;
/* 000454 */ 		}
/* 000455 */ 		var bunch = u.beads [u.bead];
/* 000456 */ 		if (!(u.beads)) {
/* 000457 */ 			g.trace ('oops: empty undo stack.');
/* 000458 */ 			return ;
/* 000458 */ 		}
/* 000459 */ 		if (bunch.kind == 'beforeGroup') {
/* 000460 */ 			bunch.kind = 'afterGroup';
/* 000460 */ 		}
/* 000461 */ 		else {
/* 000462 */ 			g.trace ('oops: expecting beforeGroup, got {}'.format (bunch.kind));
/* 000462 */ 		}
/* 000464 */ 		bunch.kind = 'afterGroup';
/* 000465 */ 		bunch.undoType = undoType;
/* 000468 */ 		bunch.undoHelper = u.undoGroup;
/* 000469 */ 		bunch.redoHelper = u.redoGroup;
/* 000470 */ 		bunch.newP = p.copy ();
/* 000471 */ 		bunch.newSel = w.getSelectionRange ();
/* 000473 */ 		bunch.reportFlag = reportFlag;
/* 000474 */ 		if (0) {
/* 000474 */ 			u.bead++;
/* 000477 */ 			u.beads.__setslice__ (u.bead, null, null, [bunch]);
/* 000477 */ 		}
/* 000479 */ 		u.setUndoTypes ();
/* 000479 */ 	});},
/* 000481 */ 	get afterChangeNodeContents () {return __get__ (this, function (self, p, command, bunch) {
/* 000483 */ 		var u = self;
/* 000484 */ 		var c = self.c;
/* 000485 */ 		var w = c.frame.body.wrapper;
/* 000486 */ 		if (u.redoing || u.undoing) {
/* 000487 */ 			return ;
/* 000487 */ 		}
/* 000489 */ 		bunch.kind = 'node';
/* 000490 */ 		bunch.undoType = command;
/* 000491 */ 		bunch.undoHelper = u.undoNodeContents;
/* 000492 */ 		bunch.redoHelper = u.redoNodeContents;
/* 000493 */ 		bunch.inHead = false;
/* 000494 */ 		bunch.newBody = p.b;
/* 000495 */ 		bunch.newHead = p.h;
/* 000496 */ 		bunch.newMarked = p.isMarked ();
/* 000498 */ 		if (w) {
/* 000499 */ 			bunch.newSel = w.getSelectionRange ();
/* 000499 */ 		}
/* 000500 */ 		else {
/* 000501 */ 			bunch.newSel = tuple ([0, 0]);
/* 000501 */ 		}
/* 000502 */ 		bunch.newYScroll = (w ? w.getYScrollPosition () : 0);
/* 000503 */ 		u.pushBead (bunch);
/* 000503 */ 	});},
/* 000505 */ 	get afterChangeHeadline () {return __get__ (this, function (self, p, command, bunch) {
/* 000507 */ 		var u = self;
/* 000508 */ 		if (u.redoing || u.undoing) {
/* 000509 */ 			return ;
/* 000509 */ 		}
/* 000511 */ 		bunch.kind = 'headline';
/* 000512 */ 		bunch.undoType = command;
/* 000513 */ 		bunch.undoHelper = u.undoChangeHeadline;
/* 000514 */ 		bunch.redoHelper = u.redoChangeHeadline;
/* 000515 */ 		bunch.newHead = p.h;
/* 000516 */ 		u.pushBead (bunch);
/* 000516 */ 	});},
/* 000518 */ 	afterChangeHead: afterChangeHeadline,
/* 000520 */ 	get afterChangeTree () {return __get__ (this, function (self, p, command, bunch) {
/* 000522 */ 		var u = self;
/* 000522 */ 		var c = self.c;
/* 000522 */ 		var w = c.frame.body.wrapper;
/* 000523 */ 		if (u.redoing || u.undoing) {
/* 000523 */ 			return ;
/* 000523 */ 		}
/* 000525 */ 		bunch.kind = 'tree';
/* 000526 */ 		bunch.undoType = command;
/* 000527 */ 		bunch.undoHelper = u.undoTree;
/* 000528 */ 		bunch.redoHelper = u.redoTree;
/* 000530 */ 		bunch.newSel = w.getSelectionRange ();
/* 000531 */ 		bunch.newText = w.getAllText ();
/* 000532 */ 		bunch.newTree = u.saveTree (p);
/* 000533 */ 		u.pushBead (bunch);
/* 000533 */ 	});},
/* 000535 */ 	get afterClearRecentFiles () {return __get__ (this, function (self, bunch) {
/* 000536 */ 		var u = self;
/* 000537 */ 		bunch.newRecentFiles = g.app.config.recentFiles.__getslice__ (0, null, 1);
/* 000538 */ 		bunch.undoType = 'Clear Recent Files';
/* 000539 */ 		bunch.undoHelper = u.undoClearRecentFiles;
/* 000540 */ 		bunch.redoHelper = u.redoClearRecentFiles;
/* 000541 */ 		u.pushBead (bunch);
/* 000542 */ 		return bunch;
/* 000542 */ 	});},
/* 000544 */ 	get afterCloneMarkedNodes () {return __get__ (this, function (self, p) {
/* 000545 */ 		var u = self;
/* 000546 */ 		if (u.redoing || u.undoing) {
/* 000547 */ 			return ;
/* 000547 */ 		}
/* 000548 */ 		var bunch = u.createCommonBunch (p);
/* 000555 */ 		bunch.kind = 'clone-marked-nodes';
/* 000556 */ 		bunch.undoType = 'clone-marked-nodes';
/* 000558 */ 		bunch.undoHelper = u.undoCloneMarkedNodes;
/* 000559 */ 		bunch.redoHelper = u.redoCloneMarkedNodes;
/* 000560 */ 		bunch.newP = p.py_next ();
/* 000561 */ 		bunch.newMarked = p.isMarked ();
/* 000562 */ 		u.pushBead (bunch);
/* 000562 */ 	});},
/* 000564 */ 	get afterCopyMarkedNodes () {return __get__ (this, function (self, p) {
/* 000565 */ 		var u = self;
/* 000566 */ 		if (u.redoing || u.undoing) {
/* 000567 */ 			return ;
/* 000567 */ 		}
/* 000568 */ 		var bunch = u.createCommonBunch (p);
/* 000575 */ 		bunch.kind = 'copy-marked-nodes';
/* 000576 */ 		bunch.undoType = 'copy-marked-nodes';
/* 000578 */ 		bunch.undoHelper = u.undoCopyMarkedNodes;
/* 000579 */ 		bunch.redoHelper = u.redoCopyMarkedNodes;
/* 000580 */ 		bunch.newP = p.py_next ();
/* 000581 */ 		bunch.newMarked = p.isMarked ();
/* 000582 */ 		u.pushBead (bunch);
/* 000582 */ 	});},
/* 000584 */ 	get afterCloneNode () {return __get__ (this, function (self, p, command, bunch) {
/* 000585 */ 		var u = self;
/* 000586 */ 		if (u.redoing || u.undoing) {
/* 000586 */ 			return ;
/* 000586 */ 		}
/* 000588 */ 		bunch.kind = 'clone';
/* 000589 */ 		bunch.undoType = command;
/* 000591 */ 		bunch.undoHelper = u.undoCloneNode;
/* 000592 */ 		bunch.redoHelper = u.redoCloneNode;
/* 000593 */ 		bunch.newBack = p.back ();
/* 000594 */ 		bunch.newParent = p.parent ();
/* 000595 */ 		bunch.newP = p.copy ();
/* 000596 */ 		bunch.newMarked = p.isMarked ();
/* 000597 */ 		u.pushBead (bunch);
/* 000597 */ 	});},
/* 000599 */ 	get afterDehoist () {return __get__ (this, function (self, p, command) {
/* 000600 */ 		var u = self;
/* 000601 */ 		if (u.redoing || u.undoing) {
/* 000601 */ 			return ;
/* 000601 */ 		}
/* 000602 */ 		var bunch = u.createCommonBunch (p);
/* 000604 */ 		bunch.kind = 'dehoist';
/* 000605 */ 		bunch.undoType = command;
/* 000607 */ 		bunch.undoHelper = u.undoDehoistNode;
/* 000608 */ 		bunch.redoHelper = u.redoDehoistNode;
/* 000609 */ 		u.pushBead (bunch);
/* 000609 */ 	});},
/* 000611 */ 	get afterDeleteNode () {return __get__ (this, function (self, p, command, bunch) {
/* 000612 */ 		var u = self;
/* 000613 */ 		if (u.redoing || u.undoing) {
/* 000614 */ 			return ;
/* 000614 */ 		}
/* 000616 */ 		bunch.kind = 'delete';
/* 000617 */ 		bunch.undoType = command;
/* 000619 */ 		bunch.undoHelper = u.undoDeleteNode;
/* 000620 */ 		bunch.redoHelper = u.redoDeleteNode;
/* 000621 */ 		bunch.newP = p.copy ();
/* 000622 */ 		bunch.newMarked = p.isMarked ();
/* 000623 */ 		u.pushBead (bunch);
/* 000623 */ 	});},
/* 000625 */ 	get afterDeleteMarkedNodes () {return __get__ (this, function (self, data, p) {
/* 000626 */ 		var u = self;
/* 000627 */ 		if (u.redoing || u.undoing) {
/* 000627 */ 			return ;
/* 000627 */ 		}
/* 000628 */ 		var bunch = u.createCommonBunch (p);
/* 000630 */ 		bunch.kind = 'delete-marked-nodes';
/* 000631 */ 		bunch.undoType = 'delete-marked-nodes';
/* 000633 */ 		bunch.undoHelper = u.undoDeleteMarkedNodes;
/* 000634 */ 		bunch.redoHelper = u.redoDeleteMarkedNodes;
/* 000635 */ 		bunch.newP = p.copy ();
/* 000636 */ 		bunch.deleteMarkedNodesData = data;
/* 000637 */ 		bunch.newMarked = p.isMarked ();
/* 000638 */ 		u.pushBead (bunch);
/* 000638 */ 	});},
/* 000640 */ 	get afterDemote () {return __get__ (this, function (self, p, followingSibs) {
/* 000642 */ 		var u = self;
/* 000643 */ 		var bunch = u.createCommonBunch (p);
/* 000645 */ 		bunch.kind = 'demote';
/* 000646 */ 		bunch.undoType = 'Demote';
/* 000647 */ 		bunch.undoHelper = u.undoDemote;
/* 000648 */ 		bunch.redoHelper = u.redoDemote;
/* 000649 */ 		bunch.followingSibs = followingSibs;
/* 000649 */ 		u.bead++;
/* 000652 */ 		u.beads.__setslice__ (u.bead, null, null, [bunch]);
/* 000654 */ 		u.setUndoTypes ();
/* 000654 */ 	});},
/* 000656 */ 	get afterHoist () {return __get__ (this, function (self, p, command) {
/* 000657 */ 		var u = self;
/* 000658 */ 		if (u.redoing || u.undoing) {
/* 000659 */ 			return ;
/* 000659 */ 		}
/* 000660 */ 		var bunch = u.createCommonBunch (p);
/* 000662 */ 		bunch.kind = 'hoist';
/* 000663 */ 		bunch.undoType = command;
/* 000665 */ 		bunch.undoHelper = u.undoHoistNode;
/* 000666 */ 		bunch.redoHelper = u.redoHoistNode;
/* 000667 */ 		u.pushBead (bunch);
/* 000667 */ 	});},
/* 000669 */ 	get afterInsertNode () {return __get__ (this, function (self, p, command, bunch) {
/* 000670 */ 		var u = self;
/* 000671 */ 		if (u.redoing || u.undoing) {
/* 000672 */ 			return ;
/* 000672 */ 		}
/* 000674 */ 		bunch.kind = 'insert';
/* 000675 */ 		bunch.undoType = command;
/* 000677 */ 		bunch.undoHelper = u.undoInsertNode;
/* 000678 */ 		bunch.redoHelper = u.redoInsertNode;
/* 000679 */ 		bunch.newP = p.copy ();
/* 000680 */ 		bunch.newBack = p.back ();
/* 000681 */ 		bunch.newParent = p.parent ();
/* 000682 */ 		bunch.newMarked = p.isMarked ();
/* 000683 */ 		if (bunch.pasteAsClone) {
/* 000684 */ 			var beforeTree = bunch.beforeTree;
/* 000685 */ 			var afterTree = [];
/* 000686 */ 			for (var bunch2 of beforeTree) {
/* 000687 */ 				var v = bunch2.v;
/* 000688 */ 				afterTree.append (g.Bunch (__kwargtrans__ ({v: v, head: v.h.__getslice__ (0, null, 1), body: v.b.__getslice__ (0, null, 1)})));
/* 000688 */ 			}
/* 000689 */ 			bunch.afterTree = afterTree;
/* 000689 */ 		}
/* 000690 */ 		u.pushBead (bunch);
/* 000690 */ 	});},
/* 000692 */ 	get afterMark () {return __get__ (this, function (self, p, command, bunch) {
/* 000695 */ 		var u = self;
/* 000696 */ 		if (u.redoing || u.undoing) {
/* 000696 */ 			return ;
/* 000696 */ 		}
/* 000698 */ 		bunch.undoHelper = u.undoMark;
/* 000699 */ 		bunch.redoHelper = u.redoMark;
/* 000700 */ 		bunch.newMarked = p.isMarked ();
/* 000701 */ 		u.pushBead (bunch);
/* 000701 */ 	});},
/* 000703 */ 	get afterMoveNode () {return __get__ (this, function (self, p, command, bunch) {
/* 000704 */ 		var u = self;
/* 000705 */ 		if (u.redoing || u.undoing) {
/* 000705 */ 			return ;
/* 000705 */ 		}
/* 000707 */ 		bunch.kind = 'move';
/* 000708 */ 		bunch.undoType = command;
/* 000711 */ 		bunch.undoHelper = u.undoMove;
/* 000712 */ 		bunch.redoHelper = u.redoMove;
/* 000713 */ 		bunch.newMarked = p.isMarked ();
/* 000714 */ 		bunch.newN = p.childIndex ();
/* 000715 */ 		bunch.newParent_v = p._parentVnode ();
/* 000716 */ 		bunch.newP = p.copy ();
/* 000717 */ 		u.pushBead (bunch);
/* 000717 */ 	});},
/* 000719 */ 	get afterPromote () {return __get__ (this, function (self, p, children) {
/* 000721 */ 		var u = self;
/* 000722 */ 		var bunch = u.createCommonBunch (p);
/* 000724 */ 		bunch.kind = 'promote';
/* 000725 */ 		bunch.undoType = 'Promote';
/* 000726 */ 		bunch.undoHelper = u.undoPromote;
/* 000727 */ 		bunch.redoHelper = u.redoPromote;
/* 000728 */ 		bunch.children = children;
/* 000728 */ 		u.bead++;
/* 000731 */ 		u.beads.__setslice__ (u.bead, null, null, [bunch]);
/* 000733 */ 		u.setUndoTypes ();
/* 000733 */ 	});},
/* 000735 */ 	get afterSort () {return __get__ (this, function (self, p, bunch) {
/* 000737 */ 		var u = self;
/* 000739 */ 		if (u.redoing || u.undoing) {
/* 000740 */ 			return ;
/* 000740 */ 		}
/* 000742 */ 		u.setUndoTypes ();
/* 000742 */ 	});},
/* 000745 */ 	get beforeChangeBody () {return __get__ (this, function (self, p) {
/* 000747 */ 		var w = self.c.frame.body.wrapper;
/* 000748 */ 		var bunch = self.createCommonBunch (p);
/* 000750 */ 		bunch.oldBody = p.b;
/* 000751 */ 		bunch.oldHead = p.h;
/* 000752 */ 		bunch.oldIns = w.getInsertPoint ();
/* 000753 */ 		bunch.oldYScroll = w.getYScrollPosition ();
/* 000754 */ 		return bunch;
/* 000754 */ 	});},
/* 000756 */ 	get beforeChangeGroup () {return __get__ (this, function (self, p, command, verboseUndoGroup) {
/* 000756 */ 		if (typeof verboseUndoGroup == 'undefined' || (verboseUndoGroup != null && verboseUndoGroup.hasOwnProperty ("__kwargtrans__"))) {;
/* 000756 */ 			var verboseUndoGroup = true;
/* 000756 */ 		};
/* 000758 */ 		var u = self;
/* 000759 */ 		var bunch = u.createCommonBunch (p);
/* 000761 */ 		bunch.kind = 'beforeGroup';
/* 000762 */ 		bunch.undoType = command;
/* 000763 */ 		bunch.verboseUndoGroup = verboseUndoGroup;
/* 000766 */ 		bunch.undoHelper = u.undoGroup;
/* 000767 */ 		bunch.redoHelper = u.redoGroup;
/* 000768 */ 		bunch.py_items = [];
/* 000768 */ 		u.bead++;
/* 000771 */ 		u.beads.__setslice__ (u.bead, null, null, [bunch]);
/* 000771 */ 	});},
/* 000773 */ 	get beforeChangeHeadline () {return __get__ (this, function (self, p) {
/* 000779 */ 		var u = self;
/* 000780 */ 		var bunch = u.createCommonBunch (p);
/* 000781 */ 		bunch.oldHead = p.h;
/* 000782 */ 		return bunch;
/* 000782 */ 	});},
/* 000784 */ 	beforeChangeHead: beforeChangeHeadline,
/* 000786 */ 	get beforeChangeNodeContents () {return __get__ (this, function (self, p) {
/* 000788 */ 		var __left0__ = tuple ([self.c, self]);
/* 000788 */ 		var c = __left0__ [0];
/* 000788 */ 		var u = __left0__ [1];
/* 000789 */ 		var w = c.frame.body.wrapper;
/* 000790 */ 		var bunch = u.createCommonBunch (p);
/* 000791 */ 		bunch.oldBody = p.b;
/* 000792 */ 		bunch.oldHead = p.h;
/* 000794 */ 		bunch.oldYScroll = (w ? w.getYScrollPosition () : 0);
/* 000795 */ 		return bunch;
/* 000795 */ 	});},
/* 000797 */ 	get beforeChangeTree () {return __get__ (this, function (self, p) {
/* 000798 */ 		var u = self;
/* 000798 */ 		var c = u.c;
/* 000799 */ 		var w = c.frame.body.wrapper;
/* 000800 */ 		var bunch = u.createCommonBunch (p);
/* 000801 */ 		bunch.oldSel = w.getSelectionRange ();
/* 000802 */ 		bunch.oldText = w.getAllText ();
/* 000803 */ 		bunch.oldTree = u.saveTree (p);
/* 000804 */ 		return bunch;
/* 000804 */ 	});},
/* 000806 */ 	get beforeClearRecentFiles () {return __get__ (this, function (self) {
/* 000807 */ 		var u = self;
/* 000807 */ 		var p = u.c.p;
/* 000808 */ 		var bunch = u.createCommonBunch (p);
/* 000809 */ 		bunch.oldRecentFiles = g.app.config.recentFiles.__getslice__ (0, null, 1);
/* 000810 */ 		return bunch;
/* 000810 */ 	});},
/* 000812 */ 	get beforeCloneNode () {return __get__ (this, function (self, p) {
/* 000813 */ 		var u = self;
/* 000814 */ 		var bunch = u.createCommonBunch (p);
/* 000815 */ 		return bunch;
/* 000815 */ 	});},
/* 000817 */ 	get beforeDeleteNode () {return __get__ (this, function (self, p) {
/* 000818 */ 		var u = self;
/* 000819 */ 		var bunch = u.createCommonBunch (p);
/* 000820 */ 		bunch.oldBack = p.back ();
/* 000821 */ 		bunch.oldParent = p.parent ();
/* 000822 */ 		return bunch;
/* 000822 */ 	});},
/* 000824 */ 	get beforeInsertNode () {return __get__ (this, function (self, p, pasteAsClone, copiedBunchList) {
/* 000824 */ 		if (typeof pasteAsClone == 'undefined' || (pasteAsClone != null && pasteAsClone.hasOwnProperty ("__kwargtrans__"))) {;
/* 000824 */ 			var pasteAsClone = false;
/* 000824 */ 		};
/* 000824 */ 		if (typeof copiedBunchList == 'undefined' || (copiedBunchList != null && copiedBunchList.hasOwnProperty ("__kwargtrans__"))) {;
/* 000824 */ 			var copiedBunchList = null;
/* 000824 */ 		};
/* 000825 */ 		var u = self;
/* 000826 */ 		if (copiedBunchList === null) {
/* 000826 */ 			var copiedBunchList = [];
/* 000826 */ 		}
/* 000827 */ 		var bunch = u.createCommonBunch (p);
/* 000828 */ 		bunch.pasteAsClone = pasteAsClone;
/* 000829 */ 		if (pasteAsClone) {
/* 000831 */ 			bunch.beforeTree = copiedBunchList;
/* 000831 */ 		}
/* 000832 */ 		return bunch;
/* 000832 */ 	});},
/* 000834 */ 	get beforeMark () {return __get__ (this, function (self, p, command) {
/* 000835 */ 		var u = self;
/* 000836 */ 		var bunch = u.createCommonBunch (p);
/* 000837 */ 		bunch.kind = 'mark';
/* 000838 */ 		bunch.undoType = command;
/* 000839 */ 		return bunch;
/* 000839 */ 	});},
/* 000841 */ 	get beforeMoveNode () {return __get__ (this, function (self, p) {
/* 000842 */ 		var u = self;
/* 000843 */ 		var bunch = u.createCommonBunch (p);
/* 000844 */ 		bunch.oldN = p.childIndex ();
/* 000845 */ 		bunch.oldParent_v = p._parentVnode ();
/* 000846 */ 		return bunch;
/* 000846 */ 	});},
/* 000848 */ 	get beforeSort () {return __get__ (this, function (self, p, undoType, oldChildren, newChildren, sortChildren) {
/* 000850 */ 		var u = self;
/* 000851 */ 		var bunch = u.createCommonBunch (p);
/* 000853 */ 		bunch.kind = 'sort';
/* 000854 */ 		bunch.undoType = undoType;
/* 000855 */ 		bunch.undoHelper = u.undoSort;
/* 000856 */ 		bunch.redoHelper = u.redoSort;
/* 000857 */ 		bunch.oldChildren = oldChildren;
/* 000858 */ 		bunch.newChildren = newChildren;
/* 000859 */ 		bunch.sortChildren = sortChildren;
/* 000859 */ 		u.bead++;
/* 000862 */ 		u.beads.__setslice__ (u.bead, null, null, [bunch]);
/* 000863 */ 		return bunch;
/* 000863 */ 	});},
/* 000865 */ 	get createCommonBunch () {return __get__ (this, function (self, p) {
/* 000868 */ 		var u = self;
/* 000869 */ 		var c = u.c;
/* 000870 */ 		var w = c.frame.body.wrapper;
/* 000874 */ 		return g.Bunch (__kwargtrans__ ({oldMarked: p && p.isMarked (), oldSel: w && w.getSelectionRange () || null, p: p && p.copy ()}));
/* 000874 */ 	});},
/* 000879 */ 	get canRedo () {return __get__ (this, function (self) {
/* 000880 */ 		var u = self;
/* 000881 */ 		return u.redoMenuLabel != "Can't Redo";
/* 000881 */ 	});},
/* 000883 */ 	get canUndo () {return __get__ (this, function (self) {
/* 000884 */ 		var u = self;
/* 000885 */ 		return u.undoMenuLabel != "Can't Undo";
/* 000885 */ 	});},
/* 000887 */ 	get clearUndoState () {return __get__ (this, function (self) {
/* 000891 */ 		var u = self;
/* 000892 */ 		u.clearOptionalIvars ();
/* 000893 */ 		u.setRedoType ("Can't Redo");
/* 000894 */ 		u.setUndoType ("Can't Undo");
/* 000895 */ 		u.beads = [];
/* 000896 */ 		u.bead = -(1);
/* 000896 */ 	});},
/* 000898 */ 	get doTyping () {return __get__ (this, function (self, p, undo_type, oldText, newText, newInsert, oldSel, newSel, oldYview) {
/* 000898 */ 		if (typeof newInsert == 'undefined' || (newInsert != null && newInsert.hasOwnProperty ("__kwargtrans__"))) {;
/* 000898 */ 			var newInsert = null;
/* 000898 */ 		};
/* 000898 */ 		if (typeof oldSel == 'undefined' || (oldSel != null && oldSel.hasOwnProperty ("__kwargtrans__"))) {;
/* 000898 */ 			var oldSel = null;
/* 000898 */ 		};
/* 000898 */ 		if (typeof newSel == 'undefined' || (newSel != null && newSel.hasOwnProperty ("__kwargtrans__"))) {;
/* 000898 */ 			var newSel = null;
/* 000898 */ 		};
/* 000898 */ 		if (typeof oldYview == 'undefined' || (oldYview != null && oldYview.hasOwnProperty ("__kwargtrans__"))) {;
/* 000898 */ 			var oldYview = null;
/* 000898 */ 		};
/* 000914 */ 		var __left0__ = tuple ([self.c, self, self.c.frame.body.wrapper]);
/* 000914 */ 		var c = __left0__ [0];
/* 000914 */ 		var u = __left0__ [1];
/* 000914 */ 		var w = __left0__ [2];
/* 000916 */ 		var undo_type = undo_type.capitalize ();
/* 000920 */ 		if (u.redoing || u.undoing) {
/* 000921 */ 			return null;
/* 000921 */ 		}
/* 000922 */ 		if (undo_type === null) {
/* 000923 */ 			return null;
/* 000923 */ 		}
/* 000924 */ 		if (undo_type == "Can't Undo") {
/* 000925 */ 			u.clearUndoState ();
/* 000926 */ 			u.setUndoTypes ();
/* 000927 */ 			return null;
/* 000927 */ 		}
/* 000928 */ 		if (oldText == newText) {
/* 000929 */ 			u.setUndoTypes ();
/* 000930 */ 			return null;
/* 000930 */ 		}
/* 000934 */ 		u.clearOptionalIvars ();
/* 000936 */ 		u.undoType = undo_type;
/* 000937 */ 		u.p = p.copy ();
/* 000945 */ 		var old_lines = oldText.py_split ('\n');
/* 000946 */ 		var new_lines = newText.py_split ('\n');
/* 000947 */ 		var new_len = len (new_lines);
/* 000948 */ 		var old_len = len (old_lines);
/* 000949 */ 		var min_len = min (old_len, new_len);
/* 000950 */ 		var i = 0;
/* 000951 */ 		while (i < min_len) {
/* 000952 */ 			if (old_lines [i] != new_lines [i]) {
/* 000952 */ 				break;
/* 000952 */ 			}
/* 000952 */ 			i++;
/* 000952 */ 		}
/* 000955 */ 		var leading = i;
/* 000956 */ 		if (leading == new_len) {
/* 000959 */ 			var trailing = 0;
/* 000959 */ 		}
/* 000960 */ 		else {
/* 000961 */ 			var i = 0;
/* 000962 */ 			while (i < min_len - leading) {
/* 000963 */ 				if (old_lines [(old_len - i) - 1] != new_lines [(new_len - i) - 1]) {
/* 000963 */ 					break;
/* 000963 */ 				}
/* 000963 */ 				i++;
/* 000963 */ 			}
/* 000966 */ 			var trailing = i;
/* 000966 */ 		}
/* 000968 */ 		if (trailing == 0) {
/* 000969 */ 			var old_middle_lines = old_lines.__getslice__ (leading, null, 1);
/* 000970 */ 			var new_middle_lines = new_lines.__getslice__ (leading, null, 1);
/* 000970 */ 		}
/* 000971 */ 		else {
/* 000972 */ 			var old_middle_lines = old_lines.__getslice__ (leading, -(trailing), 1);
/* 000973 */ 			var new_middle_lines = new_lines.__getslice__ (leading, -(trailing), 1);
/* 000973 */ 		}
/* 000975 */ 		var i = len (oldText) - 1;
/* 000975 */ 		var old_newlines = 0;
/* 000976 */ 		while (i >= 0 && oldText [i] == '\n') {
/* 000976 */ 			old_newlines++;
/* 000976 */ 			i--;
/* 000976 */ 		}
/* 000979 */ 		var i = len (newText) - 1;
/* 000979 */ 		var new_newlines = 0;
/* 000980 */ 		while (i >= 0 && newText [i] == '\n') {
/* 000980 */ 			new_newlines++;
/* 000980 */ 			i--;
/* 000980 */ 		}
/* 000986 */ 		u.oldText = null;
/* 000987 */ 		u.newText = null;
/* 000988 */ 		u.leading = leading;
/* 000989 */ 		u.trailing = trailing;
/* 000990 */ 		u.oldMiddleLines = old_middle_lines;
/* 000991 */ 		u.newMiddleLines = new_middle_lines;
/* 000992 */ 		u.oldNewlines = old_newlines;
/* 000993 */ 		u.newNewlines = new_newlines;
/* 000998 */ 		u.oldSel = oldSel;
/* 000999 */ 		u.newSel = newSel;
/* 001001 */ 		if (oldYview) {
/* 001002 */ 			u.yview = oldYview;
/* 001002 */ 		}
/* 001003 */ 		else {
/* 001004 */ 			u.yview = c.frame.body.wrapper.getYScrollPosition ();
/* 001004 */ 		}
/* 001015 */ 		var granularity = u.granularity;
/* 001016 */ 		var old_d = u.peekBead (u.bead);
/* 001017 */ 		var old_p = old_d && old_d.py_get ('p');
/* 001028 */ 		if (!(old_d) || !(old_p) || old_p.v != p.v || old_d.py_get ('kind') != 'typing' || old_d.py_get ('undoType') != 'Typing' || undo_type != 'Typing') {
/* 001031 */ 			var newBead = true;
/* 001031 */ 		}
/* 001032 */ 		else if (granularity == 'char') {
/* 001033 */ 			var newBead = true;
/* 001033 */ 		}
/* 001034 */ 		else if (granularity == 'node') {
/* 001035 */ 			var newBead = false;
/* 001035 */ 		}
/* 001036 */ 		else {
/* 001041 */ 			var newBead = old_d.py_get ('leading', 0) != u.leading || old_d.py_get ('trailing', 0) != u.trailing;
/* 001043 */ 			if (granularity == 'word' && !(newBead)) {
/* 001045 */ 				try {
/* 001049 */ 					var __left0__ = 0;
/* 001049 */ 					var old_start = __left0__;
/* 001049 */ 					var old_end = __left0__;
/* 001049 */ 					var new_start = __left0__;
/* 001049 */ 					var new_end = __left0__;
/* 001050 */ 					if (oldSel) {
/* 001051 */ 						var __left0__ = oldSel;
/* 001051 */ 						var old_start = __left0__ [0];
/* 001051 */ 						var old_end = __left0__ [1];
/* 001051 */ 					}
/* 001052 */ 					if (newSel) {
/* 001053 */ 						var __left0__ = newSel;
/* 001053 */ 						var new_start = __left0__ [0];
/* 001053 */ 						var new_end = __left0__ [1];
/* 001053 */ 					}
/* 001054 */ 					var __left0__ = u.prevSel;
/* 001054 */ 					var prev_start = __left0__ [0];
/* 001054 */ 					var prev_end = __left0__ [1];
/* 001055 */ 					if (old_start != old_end || new_start != new_end) {
/* 001057 */ 						var newBead = true;
/* 001057 */ 					}
/* 001058 */ 					else {
/* 001060 */ 						var __left0__ = g.convertPythonIndexToRowCol (oldText, old_start);
/* 001060 */ 						var old_row = __left0__ [0];
/* 001060 */ 						var old_col = __left0__ [1];
/* 001062 */ 						var __left0__ = g.convertPythonIndexToRowCol (newText, new_start);
/* 001062 */ 						var new_row = __left0__ [0];
/* 001062 */ 						var new_col = __left0__ [1];
/* 001064 */ 						var __left0__ = g.convertPythonIndexToRowCol (oldText, prev_start);
/* 001064 */ 						var prev_row = __left0__ [0];
/* 001064 */ 						var prev_col = __left0__ [1];
/* 001066 */ 						var old_lines = g.splitLines (oldText);
/* 001067 */ 						var new_lines = g.splitLines (newText);
/* 001069 */ 						if (old_row != new_row || abs (old_col - new_col) != 1) {
/* 001071 */ 							var newBead = true;
/* 001071 */ 						}
/* 001072 */ 						else if (old_col == 0 || new_col == 0) {
/* 001077 */ 							// pass;
/* 001077 */ 						}
/* 001078 */ 						else {
/* 001080 */ 							var old_s = old_lines [old_row];
/* 001081 */ 							var new_s = new_lines [new_row];
/* 001084 */ 							if (old_col - 1 >= len (old_s) || new_col - 1 >= len (new_s)) {
/* 001085 */ 								var newBead = true;
/* 001085 */ 							}
/* 001086 */ 							else {
/* 001087 */ 								var old_ch = old_s [old_col - 1];
/* 001088 */ 								var new_ch = new_s [new_col - 1];
/* 001089 */ 								var newBead = self.recognizeStartOfTypingWord (old_lines, old_row, old_col, old_ch, new_lines, new_row, new_col, new_ch, prev_row, prev_col);
/* 001089 */ 							}
/* 001089 */ 						}
/* 001089 */ 					}
/* 001089 */ 				}
/* 001089 */ 				catch (__except0__) {
/* 001089 */ 					if (isinstance (__except0__, Exception)) {
/* 001095 */ 						g.error ('Unexpected exception...');
/* 001096 */ 						g.es_exception ();
/* 001097 */ 						var newBead = true;
/* 001097 */ 					}
/* 001097 */ 					else {
/* 001097 */ 						throw __except0__;
/* 001097 */ 					}
/* 001097 */ 				}
/* 001097 */ 			}
/* 001097 */ 		}
/* 001100 */ 		u.prevSel = u.newSel;
/* 001101 */ 		if (newBead) {
/* 001109 */ 			var bunch = g.Bunch (__kwargtrans__ ({p: p.copy (), kind: 'typing', undoType: undo_type, undoHelper: u.undoTyping, redoHelper: u.redoTyping, oldMarked: (old_p ? old_p.isMarked () : p.isMarked ()), oldText: u.oldText, oldSel: u.oldSel, oldNewlines: u.oldNewlines, oldMiddleLines: u.oldMiddleLines}));
/* 001115 */ 			u.pushBead (bunch);
/* 001115 */ 		}
/* 001116 */ 		else {
/* 001117 */ 			var bunch = old_d;
/* 001117 */ 		}
/* 001118 */ 		bunch.leading = u.leading;
/* 001119 */ 		bunch.trailing = u.trailing;
/* 001120 */ 		bunch.newMarked = p.isMarked ();
/* 001121 */ 		bunch.newNewlines = u.newNewlines;
/* 001122 */ 		bunch.newMiddleLines = u.newMiddleLines;
/* 001123 */ 		bunch.newSel = u.newSel;
/* 001124 */ 		bunch.newText = u.newText;
/* 001125 */ 		bunch.yview = u.yview;
/* 001127 */ 		if (__in__ ('undo', g.app.debug) && __in__ ('verbose', g.app.debug)) {
/* 001128 */ 			print ('u.doTyping: {} => {}'.format (len (oldText), len (newText)));
/* 001128 */ 		}
/* 001129 */ 		if (u.per_node_undo) {
/* 001130 */ 			u.putIvarsToVnode (p);
/* 001130 */ 		}
/* 001133 */ 		p.v.setBodyString (newText);
/* 001134 */ 		u.updateAfterTyping (p, w);
/* 001134 */ 	});},
/* 001138 */ 	setUndoTypingParams: doTyping,
/* 001140 */ 	get recognizeStartOfTypingWord () {return __get__ (this, function (self, old_lines, old_row, old_col, old_ch, new_lines, new_row, new_col, new_ch, prev_row, prev_col) {
/* 001161 */ 		var new_word_started = !(old_ch.isspace ()) && new_ch.isspace ();
/* 001163 */ 		var moved_cursor = new_row != prev_row || new_col != prev_col + 1;
/* 001164 */ 		return new_word_started || moved_cursor;
/* 001164 */ 	});},
/* 001166 */ 	get enableMenuItems () {return __get__ (this, function (self) {
/* 001167 */ 		var u = self;
/* 001167 */ 		var frame = u.c.frame;
/* 001168 */ 		var menu = frame.menu.getMenu ('Edit');
/* 001169 */ 		if (menu) {
/* 001170 */ 			frame.menu.enableMenu (menu, u.redoMenuLabel, u.canRedo ());
/* 001171 */ 			frame.menu.enableMenu (menu, u.undoMenuLabel, u.canUndo ());
/* 001171 */ 		}
/* 001171 */ 	});},
/* 001173 */ 	get onSelect () {return __get__ (this, function (self, old_p, p) {
/* 001175 */ 		var u = self;
/* 001176 */ 		if (u.per_node_undo) {
/* 001177 */ 			if (old_p && u.beads) {
/* 001178 */ 				u.putIvarsToVnode (old_p);
/* 001178 */ 			}
/* 001179 */ 			u.setIvarsFromVnode (p);
/* 001180 */ 			u.setUndoTypes ();
/* 001180 */ 		}
/* 001180 */ 	});},
/* 001182 */ 	get putIvarsToVnode () {return __get__ (this, function (self, p) {
/* 001184 */ 		var __left0__ = tuple ([self, p.v]);
/* 001184 */ 		var u = __left0__ [0];
/* 001184 */ 		var v = __left0__ [1];
/* 001186 */ 		var bunch = g.bunch ();
/* 001187 */ 		for (var key of self.optionalIvars) {
/* 001188 */ 			bunch [key] = getattr (u, key);
/* 001188 */ 		}
/* 001190 */ 		for (var key of tuple (['bead', 'beads', 'undoType'])) {
/* 001191 */ 			bunch [key] = getattr (u, key);
/* 001191 */ 		}
/* 001192 */ 		v.undo_info = bunch;
/* 001192 */ 	});},
/* 001194 */ 	get setIvarsFromVnode () {return __get__ (this, function (self, p) {
/* 001195 */ 		var u = self;
/* 001195 */ 		var v = p.v;
/* 001197 */ 		u.clearUndoState ();
/* 001198 */ 		if (hasattr (v, 'undo_info')) {
/* 001199 */ 			u.setIvarsFromBunch (v.undo_info);
/* 001199 */ 		}
/* 001199 */ 	});},
/* 001201 */ 	get updateAfterTyping () {return __get__ (this, function (self, p, w) {
/* 001207 */ 		var c = self.c;
/* 001208 */ 		if (g.isTextWrapper (w)) {
/* 001210 */ 			var all = w.getAllText ();
/* 001211 */ 			if (g.unitTesting) {
/* 001211 */ 			}
/* 001213 */ 			else if (p.b != all) {
/* 001214 */ 				g.trace ('\nError:p.b != w.getAllText() p:{} {}\n'.format (p.h, g.callers ()));
/* 001214 */ 			}
/* 001217 */ 			var __left0__ = w.getInsertPoint ();
/* 001217 */ 			p.v.insertSpot = __left0__;
/* 001217 */ 			var ins = __left0__;
/* 001219 */ 			var newSel = w.getSelectionRange ();
/* 001220 */ 			if (newSel === null) {
/* 001221 */ 				var __left0__ = tuple ([ins, 0]);
/* 001221 */ 				p.v.selectionStart = __left0__ [0];
/* 001221 */ 				p.v.selectionLength = __left0__ [1];
/* 001221 */ 			}
/* 001222 */ 			else {
/* 001223 */ 				var __left0__ = newSel;
/* 001223 */ 				var i = __left0__ [0];
/* 001223 */ 				var j = __left0__ [1];
/* 001224 */ 				var __left0__ = tuple ([i, j - i]);
/* 001224 */ 				p.v.selectionStart = __left0__ [0];
/* 001224 */ 				p.v.selectionLength = __left0__ [1];
/* 001224 */ 			}
/* 001224 */ 		}
/* 001225 */ 		else {
/* 001226 */ 			if (g.unitTesting) {
/* 001226 */ 			}
/* 001228 */ 			g.trace ('Not a text wrapper');
/* 001229 */ 			p.v.insertSpot = 0;
/* 001230 */ 			var __left0__ = tuple ([0, 0]);
/* 001230 */ 			p.v.selectionStart = __left0__ [0];
/* 001230 */ 			p.v.selectionLength = __left0__ [1];
/* 001230 */ 		}
/* 001233 */ 		if (p.isDirty ()) {
/* 001234 */ 			var redraw_flag = false;
/* 001234 */ 		}
/* 001235 */ 		else {
/* 001236 */ 			p.setDirty ();
/* 001237 */ 			var redraw_flag = true;
/* 001237 */ 		}
/* 001238 */ 		if (!(c.isChanged ())) {
/* 001239 */ 			c.setChanged ();
/* 001239 */ 		}
/* 001241 */ 		c.frame.body.updateEditors ();
/* 001243 */ 		var val = p.computeIcon ();
/* 001244 */ 		if (!(hasattr (p.v, 'iconVal')) || val != p.v.iconVal) {
/* 001245 */ 			p.v.iconVal = val;
/* 001246 */ 			var redraw_flag = true;
/* 001246 */ 		}
/* 001249 */ 		c.frame.scanForTabWidth (p);
/* 001250 */ 		c.recolor ();
/* 001251 */ 		if (g.app.unitTesting) {
/* 001252 */ 			g.app.unitTestDict ['colorized'] = true;
/* 001252 */ 		}
/* 001253 */ 		if (redraw_flag) {
/* 001254 */ 			c.redraw_after_icons_changed ();
/* 001254 */ 		}
/* 001255 */ 		w.setFocus ();
/* 001255 */ 	});},
/* 001257 */ 	get redo () {return __get__ (this, cmd ('redo') (function (self, event) {
/* 001257 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001257 */ 			var event = null;
/* 001257 */ 		};
/* 001260 */ 		var __left0__ = tuple ([self.c, self]);
/* 001260 */ 		var c = __left0__ [0];
/* 001260 */ 		var u = __left0__ [1];
/* 001261 */ 		if (!(c.p)) {
/* 001262 */ 			return ;
/* 001262 */ 		}
/* 001264 */ 		c.endEditing ();
/* 001265 */ 		if (!(u.canRedo ())) {
/* 001266 */ 			return ;
/* 001266 */ 		}
/* 001267 */ 		if (!(u.getBead (u.bead + 1))) {
/* 001268 */ 			return ;
/* 001268 */ 		}
/* 001271 */ 		u.redoing = true;
/* 001272 */ 		u.groupCount = 0;
/* 001273 */ 		if (u.redoHelper) {
/* 001274 */ 			u.redoHelper ();
/* 001274 */ 		}
/* 001275 */ 		else {
/* 001276 */ 			g.trace ('no redo helper for {} {}'.format (u.kind, u.undoType));
/* 001276 */ 		}
/* 001279 */ 		c.checkOutline ();
/* 001280 */ 		u.update_status ();
/* 001281 */ 		u.redoing = false;
/* 001281 */ 		u.bead++;
/* 001283 */ 		u.setUndoTypes ();
/* 001283 */ 	}));},
/* 001286 */ 	get redoHelper () {return __get__ (this, function (self) {
/* 001288 */ 		// pass;
/* 001288 */ 	});},
/* 001290 */ 	get redoChangeBody () {return __get__ (this, function (self) {
/* 001291 */ 		var __left0__ = tuple ([self.c, self, self.c.frame.body.wrapper]);
/* 001291 */ 		var c = __left0__ [0];
/* 001291 */ 		var u = __left0__ [1];
/* 001291 */ 		var w = __left0__ [2];
/* 001293 */ 		if (c.p != u.p) {
/* 001294 */ 			c.selectPosition (u.p);
/* 001294 */ 		}
/* 001295 */ 		u.p.setDirty ();
/* 001296 */ 		u.p.b = u.newBody;
/* 001297 */ 		u.p.h = u.newHead;
/* 001299 */ 		c.frame.tree.setHeadline (u.p, u.newHead);
/* 001300 */ 		if (u.newMarked) {
/* 001301 */ 			u.p.setMarked ();
/* 001301 */ 		}
/* 001302 */ 		else {
/* 001303 */ 			u.p.clearMarked ();
/* 001303 */ 		}
/* 001304 */ 		if (u.groupCount == 0) {
/* 001305 */ 			w.setAllText (u.newBody);
/* 001306 */ 			var __left0__ = u.newSel;
/* 001306 */ 			var i = __left0__ [0];
/* 001306 */ 			var j = __left0__ [1];
/* 001307 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: u.newIns}));
/* 001308 */ 			w.setYScrollPosition (u.newYScroll);
/* 001309 */ 			c.frame.body.recolor (u.p);
/* 001309 */ 		}
/* 001310 */ 		u.updateMarks ('new');
/* 001311 */ 		u.p.setDirty ();
/* 001311 */ 	});},
/* 001313 */ 	get redoChangeHeadline () {return __get__ (this, function (self) {
/* 001314 */ 		var __left0__ = tuple ([self.c, self]);
/* 001314 */ 		var c = __left0__ [0];
/* 001314 */ 		var u = __left0__ [1];
/* 001316 */ 		if (c.p != u.p) {
/* 001317 */ 			c.selectPosition (u.p);
/* 001317 */ 		}
/* 001318 */ 		u.p.setDirty ();
/* 001319 */ 		c.frame.body.recolor (u.p);
/* 001321 */ 		u.p.initHeadString (u.newHead);
/* 001323 */ 		c.frame.tree.setHeadline (u.p, u.newHead);
/* 001323 */ 	});},
/* 001325 */ 	get redoClearRecentFiles () {return __get__ (this, function (self) {
/* 001326 */ 		var u = self;
/* 001326 */ 		var c = u.c;
/* 001327 */ 		var rf = g.app.recentFilesManager;
/* 001328 */ 		rf.setRecentFiles (u.newRecentFiles.__getslice__ (0, null, 1));
/* 001329 */ 		rf.createRecentFilesMenuItems (c);
/* 001329 */ 	});},
/* 001331 */ 	get redoCloneMarkedNodes () {return __get__ (this, function (self) {
/* 001332 */ 		var u = self;
/* 001332 */ 		var c = u.c;
/* 001333 */ 		c.selectPosition (u.p);
/* 001334 */ 		c.cloneMarked ();
/* 001335 */ 		u.newP = c.p;
/* 001335 */ 	});},
/* 001337 */ 	get redoCopyMarkedNodes () {return __get__ (this, function (self) {
/* 001338 */ 		var u = self;
/* 001338 */ 		var c = u.c;
/* 001339 */ 		c.selectPosition (u.p);
/* 001340 */ 		c.copyMarked ();
/* 001341 */ 		u.newP = c.p;
/* 001341 */ 	});},
/* 001343 */ 	get redoCloneNode () {return __get__ (this, function (self) {
/* 001344 */ 		var u = self;
/* 001344 */ 		var c = u.c;
/* 001344 */ 		var cc = c.chapterController;
/* 001345 */ 		if (cc) {
/* 001345 */ 			cc.selectChapterByName ('main');
/* 001345 */ 		}
/* 001346 */ 		if (u.newBack) {
/* 001347 */ 			u.newP._linkAfter (u.newBack);
/* 001347 */ 		}
/* 001348 */ 		else if (u.newParent) {
/* 001349 */ 			u.newP._linkAsNthChild (u.newParent, 0);
/* 001349 */ 		}
/* 001350 */ 		else {
/* 001351 */ 			u.newP._linkAsRoot ();
/* 001351 */ 		}
/* 001352 */ 		c.selectPosition (u.newP);
/* 001353 */ 		u.newP.setDirty ();
/* 001353 */ 	});},
/* 001355 */ 	get redoDeleteMarkedNodes () {return __get__ (this, function (self) {
/* 001356 */ 		var u = self;
/* 001356 */ 		var c = u.c;
/* 001357 */ 		c.selectPosition (u.p);
/* 001358 */ 		c.deleteMarked ();
/* 001359 */ 		c.selectPosition (u.newP);
/* 001359 */ 	});},
/* 001361 */ 	get redoDeleteNode () {return __get__ (this, function (self) {
/* 001362 */ 		var u = self;
/* 001362 */ 		var c = u.c;
/* 001363 */ 		c.selectPosition (u.p);
/* 001364 */ 		c.deleteOutline ();
/* 001365 */ 		c.selectPosition (u.newP);
/* 001365 */ 	});},
/* 001367 */ 	get redoDemote () {return __get__ (this, function (self) {
/* 001368 */ 		var u = self;
/* 001368 */ 		var c = u.c;
/* 001369 */ 		var parent_v = u.p._parentVnode ();
/* 001370 */ 		var n = u.p.childIndex ();
/* 001372 */ 		parent_v.children = parent_v.children.__getslice__ (0, n + 1, 1);
/* 001373 */ 		u.p.v.children.extend (u.followingSibs);
/* 001376 */ 		for (var v of u.followingSibs) {
/* 001377 */ 			v.parents.remove (parent_v);
/* 001378 */ 			v.parents.append (u.p.v);
/* 001378 */ 		}
/* 001379 */ 		u.p.setDirty ();
/* 001380 */ 		c.setCurrentPosition (u.p);
/* 001380 */ 	});},
/* 001382 */ 	get redoGroup () {return __get__ (this, function (self) {
/* 001384 */ 		var u = self;
/* 001386 */ 		var c = u.c;
/* 001387 */ 		var newSel = u.newSel;
/* 001388 */ 		var p = u.p.copy ();
/* 001388 */ 		u.groupCount++;
/* 001390 */ 		var bunch = u.beads [u.bead + 1];
/* 001390 */ 		var count = 0;
/* 001391 */ 		if (!(hasattr (bunch, 'items'))) {
/* 001392 */ 			g.trace ('oops: expecting bunch.items. got bunch.kind = {}'.format (bunch.kind));
/* 001393 */ 			g.trace (bunch);
/* 001393 */ 		}
/* 001394 */ 		else {
/* 001395 */ 			for (var z of bunch.py_items) {
/* 001396 */ 				self.setIvarsFromBunch (z);
/* 001397 */ 				if (z.redoHelper) {
/* 001398 */ 					z.redoHelper ();
/* 001398 */ 					count++;
/* 001398 */ 				}
/* 001399 */ 				else {
/* 001400 */ 					g.trace ('oops: no redo helper for {} {}'.format (u.undoType, p.h));
/* 001400 */ 				}
/* 001400 */ 			}
/* 001400 */ 		}
/* 001400 */ 		u.groupCount--;
/* 001402 */ 		u.updateMarks ('new');
/* 001403 */ 		if (!(g.unitTesting) && u.verboseUndoGroup) {
/* 001404 */ 			g.es ('redo', count, 'instances');
/* 001404 */ 		}
/* 001405 */ 		p.setDirty ();
/* 001406 */ 		c.selectPosition (p);
/* 001407 */ 		if (newSel) {
/* 001408 */ 			var __left0__ = newSel;
/* 001408 */ 			var i = __left0__ [0];
/* 001408 */ 			var j = __left0__ [1];
/* 001409 */ 			c.frame.body.wrapper.setSelectionRange (i, j);
/* 001409 */ 		}
/* 001409 */ 	});},
/* 001411 */ 	get redoHoistNode () {return __get__ (this, function (self) {
/* 001412 */ 		var __left0__ = tuple ([self.c, self]);
/* 001412 */ 		var c = __left0__ [0];
/* 001412 */ 		var u = __left0__ [1];
/* 001413 */ 		u.p.setDirty ();
/* 001414 */ 		c.selectPosition (u.p);
/* 001415 */ 		c.hoist ();
/* 001415 */ 	});},
/* 001417 */ 	get redoDehoistNode () {return __get__ (this, function (self) {
/* 001418 */ 		var __left0__ = tuple ([self.c, self]);
/* 001418 */ 		var c = __left0__ [0];
/* 001418 */ 		var u = __left0__ [1];
/* 001419 */ 		u.p.setDirty ();
/* 001420 */ 		c.selectPosition (u.p);
/* 001421 */ 		c.dehoist ();
/* 001421 */ 	});},
/* 001423 */ 	get redoInsertNode () {return __get__ (this, function (self) {
/* 001424 */ 		var u = self;
/* 001424 */ 		var c = u.c;
/* 001424 */ 		var cc = c.chapterController;
/* 001425 */ 		if (cc) {
/* 001426 */ 			cc.selectChapterByName ('main');
/* 001426 */ 		}
/* 001427 */ 		if (u.newBack) {
/* 001428 */ 			u.newP._linkAfter (u.newBack);
/* 001428 */ 		}
/* 001429 */ 		else if (u.newParent) {
/* 001430 */ 			u.newP._linkAsNthChild (u.newParent, 0);
/* 001430 */ 		}
/* 001431 */ 		else {
/* 001432 */ 			u.newP._linkAsRoot ();
/* 001432 */ 		}
/* 001433 */ 		if (u.pasteAsClone) {
/* 001434 */ 			for (var bunch of u.afterTree) {
/* 001435 */ 				var v = bunch.v;
/* 001436 */ 				if (u.newP.v == v) {
/* 001437 */ 					u.newP.b = bunch.body;
/* 001438 */ 					u.newP.h = bunch.head;
/* 001438 */ 				}
/* 001439 */ 				else {
/* 001440 */ 					v.setBodyString (bunch.body);
/* 001441 */ 					v.setHeadString (bunch.head);
/* 001441 */ 				}
/* 001441 */ 			}
/* 001441 */ 		}
/* 001442 */ 		u.newP.setDirty ();
/* 001443 */ 		c.selectPosition (u.newP);
/* 001443 */ 	});},
/* 001445 */ 	get redoMark () {return __get__ (this, function (self) {
/* 001446 */ 		var u = self;
/* 001446 */ 		var c = u.c;
/* 001447 */ 		u.updateMarks ('new');
/* 001448 */ 		if (u.groupCount == 0) {
/* 001449 */ 			u.p.setDirty ();
/* 001450 */ 			c.selectPosition (u.p);
/* 001450 */ 		}
/* 001450 */ 	});},
/* 001452 */ 	get redoMove () {return __get__ (this, function (self) {
/* 001453 */ 		var u = self;
/* 001453 */ 		var c = u.c;
/* 001453 */ 		var cc = c.chapterController;
/* 001454 */ 		var v = u.p.v;
/* 001458 */ 		if (cc) {
/* 001459 */ 			cc.selectChapterByName ('main');
/* 001459 */ 		}
/* 001459 */ 		delete u.oldParent_v.children [u.oldN];
/* 001463 */ 		u.oldParent_v.setDirty ();
/* 001465 */ 		var parent_v = u.newParent_v;
/* 001466 */ 		parent_v.children.insert (u.newN, v);
/* 001467 */ 		v.parents.append (u.newParent_v);
/* 001468 */ 		v.parents.remove (u.oldParent_v);
/* 001469 */ 		u.newParent_v.setDirty ();
/* 001471 */ 		u.updateMarks ('new');
/* 001472 */ 		u.newP.setDirty ();
/* 001473 */ 		c.selectPosition (u.newP);
/* 001473 */ 	});},
/* 001475 */ 	get redoNodeContents () {return __get__ (this, function (self) {
/* 001476 */ 		var __left0__ = tuple ([self.c, self]);
/* 001476 */ 		var c = __left0__ [0];
/* 001476 */ 		var u = __left0__ [1];
/* 001477 */ 		var w = c.frame.body.wrapper;
/* 001479 */ 		if (c.p != u.p) {
/* 001480 */ 			c.selectPosition (u.p);
/* 001480 */ 		}
/* 001481 */ 		u.p.setDirty ();
/* 001483 */ 		u.p.setBodyString (u.newBody);
/* 001484 */ 		w.setAllText (u.newBody);
/* 001485 */ 		c.frame.body.recolor (u.p);
/* 001487 */ 		u.p.initHeadString (u.newHead);
/* 001489 */ 		c.frame.tree.setHeadline (u.p, u.newHead);
/* 001490 */ 		if (u.groupCount == 0 && u.newSel) {
/* 001491 */ 			var __left0__ = u.newSel;
/* 001491 */ 			var i = __left0__ [0];
/* 001491 */ 			var j = __left0__ [1];
/* 001492 */ 			w.setSelectionRange (i, j);
/* 001492 */ 		}
/* 001493 */ 		if (u.groupCount == 0 && u.newYScroll !== null) {
/* 001494 */ 			w.setYScrollPosition (u.newYScroll);
/* 001494 */ 		}
/* 001495 */ 		u.updateMarks ('new');
/* 001496 */ 		u.p.setDirty ();
/* 001496 */ 	});},
/* 001498 */ 	get redoPromote () {return __get__ (this, function (self) {
/* 001499 */ 		var u = self;
/* 001499 */ 		var c = u.c;
/* 001500 */ 		var parent_v = u.p._parentVnode ();
/* 001502 */ 		var n = u.p.childIndex () + 1;
/* 001503 */ 		var old_children = parent_v.children.__getslice__ (0, null, 1);
/* 001504 */ 		parent_v.children = old_children.__getslice__ (0, n, 1);
/* 001506 */ 		parent_v.children.extend (u.children);
/* 001508 */ 		parent_v.children.extend (old_children.__getslice__ (n, null, 1));
/* 001511 */ 		u.p.v.children = [];
/* 001514 */ 		for (var child of u.children) {
/* 001515 */ 			child.parents.remove (u.p.v);
/* 001516 */ 			child.parents.append (parent_v);
/* 001516 */ 		}
/* 001517 */ 		u.p.setDirty ();
/* 001518 */ 		c.setCurrentPosition (u.p);
/* 001518 */ 	});},
/* 001520 */ 	get redoSort () {return __get__ (this, function (self) {
/* 001521 */ 		var u = self;
/* 001521 */ 		var c = u.c;
/* 001522 */ 		var parent_v = u.p._parentVnode ();
/* 001523 */ 		parent_v.children = u.newChildren;
/* 001524 */ 		var p = c.setPositionAfterSort (u.sortChildren);
/* 001525 */ 		p.setAllAncestorAtFileNodesDirty ();
/* 001526 */ 		c.setCurrentPosition (p);
/* 001526 */ 	});},
/* 001528 */ 	get redoTree () {return __get__ (this, function (self) {
/* 001530 */ 		var u = self;
/* 001530 */ 		var c = u.c;
/* 001531 */ 		u.p = self.undoRedoTree (u.p, u.oldTree, u.newTree);
/* 001532 */ 		u.p.setDirty ();
/* 001533 */ 		c.selectPosition (u.p);
/* 001534 */ 		if (u.newSel) {
/* 001535 */ 			var __left0__ = u.newSel;
/* 001535 */ 			var i = __left0__ [0];
/* 001535 */ 			var j = __left0__ [1];
/* 001536 */ 			c.frame.body.wrapper.setSelectionRange (i, j);
/* 001536 */ 		}
/* 001536 */ 	});},
/* 001538 */ 	get redoTyping () {return __get__ (this, function (self) {
/* 001539 */ 		var u = self;
/* 001539 */ 		var c = u.c;
/* 001539 */ 		var current = c.p;
/* 001540 */ 		var w = c.frame.body.wrapper;
/* 001542 */ 		if (current != u.p) {
/* 001543 */ 			c.selectPosition (u.p);
/* 001543 */ 		}
/* 001544 */ 		u.p.setDirty ();
/* 001545 */ 		self.undoRedoText (u.p, u.leading, u.trailing, u.newMiddleLines, u.oldMiddleLines, u.newNewlines, u.oldNewlines, __kwargtrans__ ({tag: 'redo', undoType: u.undoType}));
/* 001550 */ 		u.updateMarks ('new');
/* 001551 */ 		if (u.newSel) {
/* 001552 */ 			c.bodyWantsFocus ();
/* 001553 */ 			var __left0__ = u.newSel;
/* 001553 */ 			var i = __left0__ [0];
/* 001553 */ 			var j = __left0__ [1];
/* 001554 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
/* 001554 */ 		}
/* 001555 */ 		if (u.yview) {
/* 001556 */ 			c.bodyWantsFocus ();
/* 001557 */ 			w.setYScrollPosition (u.yview);
/* 001557 */ 		}
/* 001557 */ 	});},
/* 001559 */ 	get undo () {return __get__ (this, cmd ('undo') (function (self, event) {
/* 001559 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001559 */ 			var event = null;
/* 001559 */ 		};
/* 001562 */ 		var u = self;
/* 001562 */ 		var c = u.c;
/* 001563 */ 		if (!(c.p)) {
/* 001564 */ 			g.trace ('no current position');
/* 001565 */ 			return ;
/* 001565 */ 		}
/* 001567 */ 		c.endEditing ();
/* 001568 */ 		if (u.per_node_undo) {
/* 001569 */ 			u.setIvarsFromVnode (c.p);
/* 001569 */ 		}
/* 001570 */ 		if (!(u.canUndo ())) {
/* 001571 */ 			return ;
/* 001571 */ 		}
/* 001572 */ 		if (!(u.getBead (u.bead))) {
/* 001573 */ 			return ;
/* 001573 */ 		}
/* 001576 */ 		u.undoing = true;
/* 001577 */ 		u.groupCount = 0;
/* 001580 */ 		if (u.undoHelper) {
/* 001581 */ 			u.undoHelper ();
/* 001581 */ 		}
/* 001582 */ 		else {
/* 001583 */ 			g.trace ('no undo helper for {} {}'.format (u.kind, u.undoType));
/* 001583 */ 		}
/* 001586 */ 		c.checkOutline ();
/* 001587 */ 		u.update_status ();
/* 001588 */ 		u.undoing = false;
/* 001588 */ 		u.bead--;
/* 001590 */ 		u.setUndoTypes ();
/* 001590 */ 	}));},
/* 001593 */ 	get undoHelper () {return __get__ (this, function (self) {
/* 001595 */ 		// pass;
/* 001595 */ 	});},
/* 001597 */ 	get undoChangeBody () {return __get__ (this, function (self) {
/* 001602 */ 		var __left0__ = tuple ([self.c, self, self.c.frame.body.wrapper]);
/* 001602 */ 		var c = __left0__ [0];
/* 001602 */ 		var u = __left0__ [1];
/* 001602 */ 		var w = __left0__ [2];
/* 001604 */ 		if (c.p != u.p) {
/* 001605 */ 			c.selectPosition (u.p);
/* 001605 */ 		}
/* 001606 */ 		u.p.setDirty ();
/* 001607 */ 		u.p.b = u.oldBody;
/* 001608 */ 		u.p.h = u.oldHead;
/* 001610 */ 		c.frame.tree.setHeadline (u.p, u.oldHead);
/* 001611 */ 		if (u.oldMarked) {
/* 001612 */ 			u.p.setMarked ();
/* 001612 */ 		}
/* 001613 */ 		else {
/* 001614 */ 			u.p.clearMarked ();
/* 001614 */ 		}
/* 001615 */ 		if (u.groupCount == 0) {
/* 001616 */ 			w.setAllText (u.oldBody);
/* 001617 */ 			var __left0__ = u.oldSel;
/* 001617 */ 			var i = __left0__ [0];
/* 001617 */ 			var j = __left0__ [1];
/* 001618 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: u.oldIns}));
/* 001619 */ 			w.setYScrollPosition (u.oldYScroll);
/* 001620 */ 			c.frame.body.recolor (u.p);
/* 001620 */ 		}
/* 001621 */ 		u.updateMarks ('old');
/* 001621 */ 	});},
/* 001623 */ 	get undoChangeHeadline () {return __get__ (this, function (self) {
/* 001625 */ 		var __left0__ = tuple ([self.c, self]);
/* 001625 */ 		var c = __left0__ [0];
/* 001625 */ 		var u = __left0__ [1];
/* 001627 */ 		if (c.p != u.p) {
/* 001628 */ 			c.selectPosition (u.p);
/* 001628 */ 		}
/* 001629 */ 		u.p.setDirty ();
/* 001630 */ 		c.frame.body.recolor (u.p);
/* 001631 */ 		u.p.initHeadString (u.oldHead);
/* 001633 */ 		c.frame.tree.setHeadline (u.p, u.oldHead);
/* 001633 */ 	});},
/* 001635 */ 	get undoClearRecentFiles () {return __get__ (this, function (self) {
/* 001636 */ 		var u = self;
/* 001636 */ 		var c = u.c;
/* 001637 */ 		var rf = g.app.recentFilesManager;
/* 001638 */ 		rf.setRecentFiles (u.oldRecentFiles.__getslice__ (0, null, 1));
/* 001639 */ 		rf.createRecentFilesMenuItems (c);
/* 001639 */ 	});},
/* 001641 */ 	get undoCloneMarkedNodes () {return __get__ (this, function (self) {
/* 001642 */ 		var u = self;
/* 001643 */ 		var py_next = u.p.py_next ();
/* 001645 */ 		py_next.doDelete ();
/* 001646 */ 		u.p.setAllAncestorAtFileNodesDirty ();
/* 001647 */ 		u.c.selectPosition (u.p);
/* 001647 */ 	});},
/* 001649 */ 	get undoCloneNode () {return __get__ (this, function (self) {
/* 001650 */ 		var u = self;
/* 001650 */ 		var c = u.c;
/* 001650 */ 		var cc = c.chapterController;
/* 001651 */ 		if (cc) {
/* 001652 */ 			cc.selectChapterByName ('main');
/* 001652 */ 		}
/* 001653 */ 		c.selectPosition (u.newP);
/* 001654 */ 		c.deleteOutline ();
/* 001655 */ 		u.p.setDirty ();
/* 001656 */ 		c.selectPosition (u.p);
/* 001656 */ 	});},
/* 001658 */ 	get undoCopyMarkedNodes () {return __get__ (this, function (self) {
/* 001659 */ 		var u = self;
/* 001660 */ 		var py_next = u.p.py_next ();
/* 001662 */ 		py_next.doDelete ();
/* 001663 */ 		u.p.setAllAncestorAtFileNodesDirty ();
/* 001664 */ 		u.c.selectPosition (u.p);
/* 001664 */ 	});},
/* 001666 */ 	get undoDeleteMarkedNodes () {return __get__ (this, function (self) {
/* 001667 */ 		var u = self;
/* 001667 */ 		var c = u.c;
/* 001669 */ 		var aList = u.deleteMarkedNodesData.__getslice__ (0, null, 1);
/* 001670 */ 		aList.reverse ();
/* 001671 */ 		for (var p of aList) {
/* 001672 */ 			if (p.stack) {
/* 001673 */ 				var __left0__ = p.stack [-(1)];
/* 001673 */ 				var parent_v = __left0__ [0];
/* 001673 */ 				var junk = __left0__ [1];
/* 001673 */ 			}
/* 001674 */ 			else {
/* 001675 */ 				var parent_v = c.hiddenRootNode;
/* 001675 */ 			}
/* 001676 */ 			p.v._addLink (p._childIndex, parent_v);
/* 001677 */ 			p.v.setDirty ();
/* 001677 */ 		}
/* 001678 */ 		u.p.setAllAncestorAtFileNodesDirty ();
/* 001679 */ 		c.selectPosition (u.p);
/* 001679 */ 	});},
/* 001681 */ 	get undoDeleteNode () {return __get__ (this, function (self) {
/* 001682 */ 		var u = self;
/* 001682 */ 		var c = u.c;
/* 001683 */ 		if (u.oldBack) {
/* 001684 */ 			u.p._linkAfter (u.oldBack);
/* 001684 */ 		}
/* 001685 */ 		else if (u.oldParent) {
/* 001686 */ 			u.p._linkAsNthChild (u.oldParent, 0);
/* 001686 */ 		}
/* 001687 */ 		else {
/* 001688 */ 			u.p._linkAsRoot ();
/* 001688 */ 		}
/* 001689 */ 		u.p.setDirty ();
/* 001690 */ 		c.selectPosition (u.p);
/* 001690 */ 	});},
/* 001692 */ 	get undoDemote () {return __get__ (this, function (self) {
/* 001693 */ 		var u = self;
/* 001693 */ 		var c = u.c;
/* 001694 */ 		var parent_v = u.p._parentVnode ();
/* 001695 */ 		var n = len (u.followingSibs);
/* 001697 */ 		u.p.v.children = u.p.v.children.__getslice__ (0, -(n), 1);
/* 001699 */ 		parent_v.children.extend (u.followingSibs);
/* 001702 */ 		parent_v.setDirty ();
/* 001703 */ 		for (var sib of u.followingSibs) {
/* 001704 */ 			sib.parents.remove (u.p.v);
/* 001705 */ 			sib.parents.append (parent_v);
/* 001705 */ 		}
/* 001706 */ 		u.p.setAllAncestorAtFileNodesDirty ();
/* 001707 */ 		c.setCurrentPosition (u.p);
/* 001707 */ 	});},
/* 001709 */ 	get undoGroup () {return __get__ (this, function (self) {
/* 001711 */ 		var u = self;
/* 001713 */ 		var c = u.c;
/* 001714 */ 		var oldSel = u.oldSel;
/* 001715 */ 		var p = u.p.copy ();
/* 001715 */ 		u.groupCount++;
/* 001717 */ 		var bunch = u.beads [u.bead];
/* 001717 */ 		var count = 0;
/* 001718 */ 		if (!(hasattr (bunch, 'items'))) {
/* 001719 */ 			g.trace ('oops: expecting bunch.items. got bunch.kind = {}'.format (bunch.kind));
/* 001720 */ 			g.trace (bunch);
/* 001720 */ 		}
/* 001721 */ 		else {
/* 001723 */ 			var reversedItems = bunch.py_items.__getslice__ (0, null, 1);
/* 001724 */ 			reversedItems.reverse ();
/* 001725 */ 			for (var z of reversedItems) {
/* 001726 */ 				self.setIvarsFromBunch (z);
/* 001727 */ 				if (z.undoHelper) {
/* 001728 */ 					z.undoHelper ();
/* 001728 */ 					count++;
/* 001728 */ 				}
/* 001729 */ 				else {
/* 001730 */ 					g.trace ('oops: no undo helper for {} {}'.format (u.undoType, p.v));
/* 001730 */ 				}
/* 001730 */ 			}
/* 001730 */ 		}
/* 001730 */ 		u.groupCount--;
/* 001732 */ 		u.updateMarks ('old');
/* 001733 */ 		if (!(g.unitTesting) && u.verboseUndoGroup) {
/* 001734 */ 			g.es ('undo', count, 'instances');
/* 001734 */ 		}
/* 001735 */ 		p.setDirty ();
/* 001736 */ 		c.selectPosition (p);
/* 001737 */ 		if (oldSel) {
/* 001738 */ 			var __left0__ = oldSel;
/* 001738 */ 			var i = __left0__ [0];
/* 001738 */ 			var j = __left0__ [1];
/* 001739 */ 			c.frame.body.wrapper.setSelectionRange (i, j);
/* 001739 */ 		}
/* 001739 */ 	});},
/* 001741 */ 	get undoHoistNode () {return __get__ (this, function (self) {
/* 001742 */ 		var u = self;
/* 001742 */ 		var c = u.c;
/* 001743 */ 		u.p.setDirty ();
/* 001744 */ 		c.selectPosition (u.p);
/* 001745 */ 		c.dehoist ();
/* 001745 */ 	});},
/* 001747 */ 	get undoDehoistNode () {return __get__ (this, function (self) {
/* 001748 */ 		var u = self;
/* 001748 */ 		var c = u.c;
/* 001749 */ 		u.p.setDirty ();
/* 001750 */ 		c.selectPosition (u.p);
/* 001751 */ 		c.hoist ();
/* 001751 */ 	});},
/* 001753 */ 	get undoInsertNode () {return __get__ (this, function (self) {
/* 001754 */ 		var u = self;
/* 001754 */ 		var c = u.c;
/* 001754 */ 		var cc = c.chapterController;
/* 001755 */ 		if (cc) {
/* 001755 */ 			cc.selectChapterByName ('main');
/* 001755 */ 		}
/* 001756 */ 		u.newP.setAllAncestorAtFileNodesDirty ();
/* 001757 */ 		c.selectPosition (u.newP);
/* 001758 */ 		c.deleteOutline ();
/* 001762 */ 		if (u.pasteAsClone) {
/* 001763 */ 			for (var bunch of u.beforeTree) {
/* 001764 */ 				var v = bunch.v;
/* 001765 */ 				if (u.p.v == v) {
/* 001766 */ 					u.p.b = bunch.body;
/* 001767 */ 					u.p.h = bunch.head;
/* 001767 */ 				}
/* 001768 */ 				else {
/* 001769 */ 					v.setBodyString (bunch.body);
/* 001770 */ 					v.setHeadString (bunch.head);
/* 001770 */ 				}
/* 001770 */ 			}
/* 001770 */ 		}
/* 001770 */ 	});},
/* 001772 */ 	get undoMark () {return __get__ (this, function (self) {
/* 001773 */ 		var u = self;
/* 001773 */ 		var c = u.c;
/* 001774 */ 		u.updateMarks ('old');
/* 001775 */ 		if (u.groupCount == 0) {
/* 001776 */ 			u.p.setDirty ();
/* 001777 */ 			c.selectPosition (u.p);
/* 001777 */ 		}
/* 001777 */ 	});},
/* 001779 */ 	get undoMove () {return __get__ (this, function (self) {
/* 001781 */ 		var u = self;
/* 001781 */ 		var c = u.c;
/* 001781 */ 		var cc = c.chapterController;
/* 001782 */ 		if (cc) {
/* 001782 */ 			cc.selectChapterByName ('main');
/* 001782 */ 		}
/* 001783 */ 		var v = u.p.v;
/* 001783 */ 		delete u.newParent_v.children [u.newN];
/* 001790 */ 		u.oldParent_v.children.insert (u.oldN, v);
/* 001792 */ 		v.parents.append (u.oldParent_v);
/* 001793 */ 		v.parents.remove (u.newParent_v);
/* 001794 */ 		u.updateMarks ('old');
/* 001795 */ 		u.p.setDirty ();
/* 001796 */ 		c.selectPosition (u.p);
/* 001796 */ 	});},
/* 001798 */ 	get undoNodeContents () {return __get__ (this, function (self) {
/* 001803 */ 		var __left0__ = tuple ([self.c, self]);
/* 001803 */ 		var c = __left0__ [0];
/* 001803 */ 		var u = __left0__ [1];
/* 001804 */ 		var w = c.frame.body.wrapper;
/* 001806 */ 		if (c.p != u.p) {
/* 001807 */ 			c.selectPosition (u.p);
/* 001807 */ 		}
/* 001808 */ 		u.p.setDirty ();
/* 001809 */ 		u.p.b = u.oldBody;
/* 001810 */ 		w.setAllText (u.oldBody);
/* 001811 */ 		c.frame.body.recolor (u.p);
/* 001812 */ 		u.p.h = u.oldHead;
/* 001814 */ 		c.frame.tree.setHeadline (u.p, u.oldHead);
/* 001815 */ 		if (u.groupCount == 0 && u.oldSel) {
/* 001816 */ 			var __left0__ = u.oldSel;
/* 001816 */ 			var i = __left0__ [0];
/* 001816 */ 			var j = __left0__ [1];
/* 001817 */ 			w.setSelectionRange (i, j);
/* 001817 */ 		}
/* 001818 */ 		if (u.groupCount == 0 && u.oldYScroll !== null) {
/* 001819 */ 			w.setYScrollPosition (u.oldYScroll);
/* 001819 */ 		}
/* 001820 */ 		u.updateMarks ('old');
/* 001820 */ 	});},
/* 001822 */ 	get undoPromote () {return __get__ (this, function (self) {
/* 001823 */ 		var u = self;
/* 001823 */ 		var c = u.c;
/* 001824 */ 		var parent_v = u.p._parentVnode ();
/* 001826 */ 		var n = u.p.childIndex () + 1;
/* 001828 */ 		var old_children = parent_v.children;
/* 001829 */ 		parent_v.children = old_children.__getslice__ (0, n, 1);
/* 001831 */ 		parent_v.children.extend (old_children.__getslice__ (n + len (u.children), null, 1));
/* 001834 */ 		u.p.v.children = u.children.__getslice__ (0, null, 1);
/* 001837 */ 		parent_v.setDirty ();
/* 001838 */ 		for (var child of u.children) {
/* 001839 */ 			child.parents.remove (parent_v);
/* 001840 */ 			child.parents.append (u.p.v);
/* 001840 */ 		}
/* 001841 */ 		u.p.setAllAncestorAtFileNodesDirty ();
/* 001842 */ 		c.setCurrentPosition (u.p);
/* 001842 */ 	});},
/* 001844 */ 	get undoRedoText () {return __get__ (this, function (self, p, leading, trailing, oldMidLines, newMidLines, oldNewlines, newNewlines, tag, undoType) {
/* 001844 */ 		if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
/* 001844 */ 			var tag = 'undo';
/* 001844 */ 		};
/* 001844 */ 		if (typeof undoType == 'undefined' || (undoType != null && undoType.hasOwnProperty ("__kwargtrans__"))) {;
/* 001844 */ 			var undoType = null;
/* 001844 */ 		};
/* 001853 */ 		var u = self;
/* 001853 */ 		var c = u.c;
/* 001854 */ 		var w = c.frame.body.wrapper;
/* 001858 */ 		var body = p.b;
/* 001859 */ 		var body = g.checkUnicode (body);
/* 001860 */ 		var body_lines = body.py_split ('\n');
/* 001861 */ 		var s = [];
/* 001862 */ 		if (leading > 0) {
/* 001863 */ 			s.extend (body_lines.__getslice__ (0, leading, 1));
/* 001863 */ 		}
/* 001864 */ 		if (oldMidLines) {
/* 001865 */ 			s.extend (oldMidLines);
/* 001865 */ 		}
/* 001866 */ 		if (trailing > 0) {
/* 001867 */ 			s.extend (body_lines.__getslice__ (-(trailing), null, 1));
/* 001867 */ 		}
/* 001868 */ 		var s = '\n'.join (s);
/* 001870 */ 		while (s && s [-(1)] == '\n') {
/* 001871 */ 			var s = s.__getslice__ (0, -(1), 1);
/* 001871 */ 		}
/* 001873 */ 		if (oldNewlines > 0) {
/* 001874 */ 			var s = s + '\n' * oldNewlines;
/* 001874 */ 		}
/* 001875 */ 		var result = s;
/* 001877 */ 		p.setBodyString (result);
/* 001878 */ 		p.setDirty ();
/* 001879 */ 		w.setAllText (result);
/* 001880 */ 		var sel = (tag == 'undo' ? u.oldSel : u.newSel);
/* 001881 */ 		if (sel) {
/* 001882 */ 			var __left0__ = sel;
/* 001882 */ 			var i = __left0__ [0];
/* 001882 */ 			var j = __left0__ [1];
/* 001883 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
/* 001883 */ 		}
/* 001884 */ 		c.frame.body.recolor (p);
/* 001885 */ 		w.seeInsertPoint ();
/* 001885 */ 	});},
/* 001887 */ 	get undoRedoTree () {return __get__ (this, function (self, p, new_data, old_data) {
/* 001890 */ 		var u = self;
/* 001890 */ 		var c = u.c;
/* 001891 */ 		if (new_data === null) {
/* 001894 */ 			var bunch = u.beads [u.bead];
/* 001895 */ 			bunch.newTree = u.saveTree (p.copy ());
/* 001896 */ 			u.beads [u.bead] = bunch;
/* 001896 */ 		}
/* 001898 */ 		u.restoreTree (old_data);
/* 001899 */ 		c.setBodyString (p, p.b);
/* 001900 */ 		return p;
/* 001900 */ 	});},
/* 001902 */ 	get undoSort () {return __get__ (this, function (self) {
/* 001903 */ 		var u = self;
/* 001903 */ 		var c = u.c;
/* 001904 */ 		var parent_v = u.p._parentVnode ();
/* 001905 */ 		parent_v.children = u.oldChildren;
/* 001906 */ 		var p = c.setPositionAfterSort (u.sortChildren);
/* 001907 */ 		p.setAllAncestorAtFileNodesDirty ();
/* 001908 */ 		c.setCurrentPosition (p);
/* 001908 */ 	});},
/* 001910 */ 	get undoTree () {return __get__ (this, function (self) {
/* 001912 */ 		var u = self;
/* 001912 */ 		var c = u.c;
/* 001913 */ 		u.p = self.undoRedoTree (u.p, u.newTree, u.oldTree);
/* 001914 */ 		u.p.setAllAncestorAtFileNodesDirty ();
/* 001915 */ 		c.selectPosition (u.p);
/* 001916 */ 		if (u.oldSel) {
/* 001917 */ 			var __left0__ = u.oldSel;
/* 001917 */ 			var i = __left0__ [0];
/* 001917 */ 			var j = __left0__ [1];
/* 001918 */ 			c.frame.body.wrapper.setSelectionRange (i, j);
/* 001918 */ 		}
/* 001918 */ 	});},
/* 001920 */ 	get undoTyping () {return __get__ (this, function (self) {
/* 001921 */ 		var __left0__ = tuple ([self.c, self]);
/* 001921 */ 		var c = __left0__ [0];
/* 001921 */ 		var u = __left0__ [1];
/* 001922 */ 		var w = c.frame.body.wrapper;
/* 001924 */ 		if (c.p != u.p) {
/* 001925 */ 			c.selectPosition (u.p);
/* 001925 */ 		}
/* 001926 */ 		u.p.setDirty ();
/* 001927 */ 		self.undoRedoText (u.p, u.leading, u.trailing, u.oldMiddleLines, u.newMiddleLines, u.oldNewlines, u.newNewlines, __kwargtrans__ ({tag: 'undo', undoType: u.undoType}));
/* 001932 */ 		u.updateMarks ('old');
/* 001933 */ 		if (u.oldSel) {
/* 001934 */ 			c.bodyWantsFocus ();
/* 001935 */ 			var __left0__ = u.oldSel;
/* 001935 */ 			var i = __left0__ [0];
/* 001935 */ 			var j = __left0__ [1];
/* 001936 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
/* 001936 */ 		}
/* 001937 */ 		if (u.yview) {
/* 001938 */ 			c.bodyWantsFocus ();
/* 001939 */ 			w.setYScrollPosition (u.yview);
/* 001939 */ 		}
/* 001939 */ 	});},
/* 001941 */ 	get update_status () {return __get__ (this, function (self) {
/* 001945 */ 		var __left0__ = tuple ([self.c, self]);
/* 001945 */ 		var c = __left0__ [0];
/* 001945 */ 		var u = __left0__ [1];
/* 001946 */ 		var w = c.frame.body.wrapper;
/* 001948 */ 		c.frame.body.updateEditors ();
/* 001951 */ 		if (0) {
/* 001953 */ 			c.selectPosition (c.p);
/* 001953 */ 		}
/* 001954 */ 		else {
/* 001955 */ 			c.setCurrentPosition (c.p);
/* 001955 */ 		}
/* 001959 */ 		var __left0__ = w.getSelectionRange ();
/* 001959 */ 		var i = __left0__ [0];
/* 001959 */ 		var j = __left0__ [1];
/* 001960 */ 		var ins = w.getInsertPoint ();
/* 001961 */ 		c.redraw ();
/* 001962 */ 		c.recolor ();
/* 001963 */ 		if (u.inHead) {
/* 001964 */ 			c.editHeadline ();
/* 001965 */ 			u.inHead = false;
/* 001965 */ 		}
/* 001966 */ 		else {
/* 001967 */ 			c.bodyWantsFocus ();
/* 001968 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: ins}));
/* 001969 */ 			w.seeInsertPoint ();
/* 001969 */ 		}
/* 001969 */ 	});}
/* 001969 */ });
/* 000043 */ 
//# sourceMappingURL=leoUndo.map