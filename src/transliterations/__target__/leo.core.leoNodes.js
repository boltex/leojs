// Transcrypt'ed from Python, 2020-12-25 05:32:36
var itertools = {};
var re = {};
var time = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {signal_manager} from './leo.core.js';
import * as g from './leo.core.leoGlobals.js';
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
import * as __module_time__ from './time.js';
__nest__ (time, '', __module_time__);
import * as __module_itertools__ from './itertools.js';
__nest__ (itertools, '', __module_itertools__);
var __name__ = 'leo.core.leoNodes';
export var NodeIndices =  __class__ ('NodeIndices', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, id_) {
		self.defaultId = id_;
		self.lastIndex = 0;
		self.stack = [];
		self.timeString = '';
		self.userId = id_;
		self.setTimeStamp ();
	});},
	get check_gnx () {return __get__ (this, function (self, c, gnx, v) {
		var fc = c.fileCommands;
		if (gnx == 'hidden-root-vnode-gnx') {
			return ;
		}
		var v2 = fc.gnxDict.py_get (gnx);
		if (v2 && v2 != v) {
			g.internalError ('getNewIndex: gnx clash {}\n          v: {}\n         v2: {}'.format (gnx, v, v2));
		}
	});},
	get compute_last_index () {return __get__ (this, function (self, c) {
		var ni = self;
		for (var v of c.all_unique_nodes ()) {
			var gnx = v.fileIndex;
			if (gnx) {
				var __left0__ = self.scanGnx (gnx);
				var id_ = __left0__ [0];
				var t = __left0__ [1];
				var n = __left0__ [2];
				if (t == ni.timeString && n !== null) {
					try {
						var n = int (n);
						self.lastIndex = max (self.lastIndex, n);
					}
					catch (__except0__) {
						if (isinstance (__except0__, Exception)) {
							g.es_exception ();
							self.lastIndex++;
						}
						else {
							throw __except0__;
						}
					}
				}
			}
		}
	});},
	get computeNewIndex () {return __get__ (this, function (self) {
		var t_s = self.py_update ();
		var gnx = g.toUnicode ('{}.{}.{}'.format (self.userId, t_s, self.lastIndex));
		return gnx;
	});},
	get getDefaultId () {return __get__ (this, function (self) {
		return self.defaultId;
	});},
	get setDefaultId () {return __get__ (this, function (self, theId) {
		self.defaultId = theId;
	});},
	get getNewIndex () {return __get__ (this, function (self, v, cached) {
		if (typeof cached == 'undefined' || (cached != null && cached.hasOwnProperty ("__kwargtrans__"))) {;
			var cached = false;
		};
		if (v === null) {
			g.internalError ('getNewIndex: v is None');
			return '';
		}
		var c = v.context;
		var fc = c.fileCommands;
		var t_s = self.py_update ();
		var gnx = g.toUnicode ('{}.{}.{}'.format (self.userId, t_s, self.lastIndex));
		v.fileIndex = gnx;
		self.check_gnx (c, gnx, v);
		fc.gnxDict [gnx] = v;
		return gnx;
	});},
	get new_vnode_helper () {return __get__ (this, function (self, c, gnx, v) {
		var ni = self;
		if (gnx) {
			v.fileIndex = gnx;
			ni.check_gnx (c, gnx, v);
			c.fileCommands.gnxDict [gnx] = v;
		}
		else {
			v.fileIndex = ni.getNewIndex (v);
		}
	});},
	get scanGnx () {return __get__ (this, function (self, s, i) {
		if (typeof i == 'undefined' || (i != null && i.hasOwnProperty ("__kwargtrans__"))) {;
			var i = 0;
		};
		if (!(isinstance (s, str))) {
			g.error ('scanGnx: unexpected index type:', py_typeof (s), '', s);
			return tuple ([null, null, null]);
		}
		var s = s.strip ();
		var __left0__ = tuple ([null, null, null]);
		var theId = __left0__ [0];
		var t = __left0__ [1];
		var n = __left0__ [2];
		var __left0__ = g.skip_to_char (s, i, '.');
		var i = __left0__ [0];
		var theId = __left0__ [1];
		if (g.match (s, i, '.')) {
			var __left0__ = g.skip_to_char (s, i + 1, '.');
			var i = __left0__ [0];
			var t = __left0__ [1];
			if (g.match (s, i, '.')) {
				var __left0__ = g.skip_to_char (s, i + 1, '.');
				var i = __left0__ [0];
				var n = __left0__ [1];
			}
		}
		if (!(theId)) {
			var theId = self.defaultId;
		}
		return tuple ([theId, t, n]);
	});},
	get setTimestamp () {return __get__ (this, function (self) {
		self.timeString = time.strftime ('%Y%m%d%H%M%S', time.localtime ());
	});},
	setTimeStamp: setTimestamp,
	get tupleToString () {return __get__ (this, function (self, aTuple) {
		var __left0__ = aTuple;
		var theId = __left0__ [0];
		var t = __left0__ [1];
		var n = __left0__ [2];
		if (__in__ (n, tuple ([null, 0, '']))) {
			var s = '{}.{}'.format (theId, t);
		}
		else {
			var s = '{}.{}.{}'.format (theId, t, n);
		}
		return g.toUnicode (s);
	});},
	get py_update () {return __get__ (this, function (self) {
		var t_s = time.strftime ('%Y%m%d%H%M%S', time.localtime ());
		if (self.timeString == t_s) {
			self.lastIndex++;
		}
		else {
			self.lastIndex = 1;
			self.timeString = t_s;
		}
		return t_s;
	});},
	get updateLastIndex () {return __get__ (this, function (self, gnx) {
		var __left0__ = self.scanGnx (gnx);
		var id_ = __left0__ [0];
		var t = __left0__ [1];
		var n = __left0__ [2];
		if (!(id_) || n != 0 && !(n)) {
			return ;
		}
		if (id_ == self.userId && t == self.timeString) {
			try {
				var n = int (n);
				if (n > self.lastIndex) {
					self.lastIndex = n;
					g.trace (gnx, '-->', n);
				}
			}
			catch (__except0__) {
				if (isinstance (__except0__, Exception)) {
					g.trace ('can not happen', repr (n));
				}
				else {
					throw __except0__;
				}
			}
		}
	});}
});
export var Position =  __class__ ('Position', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, v, childIndex, stack) {
		if (typeof childIndex == 'undefined' || (childIndex != null && childIndex.hasOwnProperty ("__kwargtrans__"))) {;
			var childIndex = 0;
		};
		if (typeof stack == 'undefined' || (stack != null && stack.hasOwnProperty ("__kwargtrans__"))) {;
			var stack = null;
		};
		self._childIndex = childIndex;
		self.v = v;
		if (stack) {
			self.stack = stack.__getslice__ (0, null, 1);
		}
		else {
			self.stack = [];
		}
		g.app.positions++;
	});},
	get __eq__ () {return __get__ (this, function (self, p2) {
		var p1 = self;
		if (!(isinstance (p2, Position))) {
			return false;
		}
		if (p2 === null || p2.v === null) {
			return p1.v === null;
		}
		return p1.v == p2.v && p1._childIndex == p2._childIndex && p1.stack == p2.stack;
	});},
	get __ne__ () {return __get__ (this, function (self, p2) {
		return !(self.__eq__ (p2));
	});},
	get __ge__ () {return __get__ (this, function (self, other) {
		return self.__eq__ (other) || self.__gt__ (other);
	});},
	get __le__ () {return __get__ (this, function (self, other) {
		return self.__eq__ (other) || self.__lt__ (other);
	});},
	get __lt__ () {return __get__ (this, function (self, other) {
		return !(self.__eq__ (other)) && !(self.__gt__ (other));
	});},
	get __gt__ () {return __get__ (this, function (self, other) {
		var __left0__ = tuple ([self.stack, other.stack]);
		var stack1 = __left0__ [0];
		var stack2 = __left0__ [1];
		var __left0__ = tuple ([len (stack1), len (stack2)]);
		var n1 = __left0__ [0];
		var n2 = __left0__ [1];
		var n = min (n1, n2);
		for (var [item1, item2] of zip (stack1, stack2)) {
			var __left0__ = item1;
			var v1 = __left0__ [0];
			var x1 = __left0__ [1];
			var __left0__ = item2;
			var v2 = __left0__ [0];
			var x2 = __left0__ [1];
			if (x1 > x2) {
				return true;
			}
			if (x1 < x2) {
				return false;
			}
		}
		if (n1 == n2) {
			var __left0__ = tuple ([self._childIndex, other._childIndex]);
			var x1 = __left0__ [0];
			var x2 = __left0__ [1];
			return x1 > x2;
		}
		if (n1 < n2) {
			var x1 = self._childIndex;
			var __left0__ = other.stack [n];
			var v2 = __left0__ [0];
			var x2 = __left0__ [1];
			return x1 > x2;
		}
		var x1 = other._childIndex;
		var __left0__ = self.stack [n];
		var v2 = __left0__ [0];
		var x2 = __left0__ [1];
		return x2 >= x1;
	});},
	get __bool__ () {return __get__ (this, function (self) {
		return self.v !== null;
	});},
	get __str__ () {return __get__ (this, function (self) {
		var p = self;
		if (p.v) {
			return '<pos {} childIndex: {} lvl: {} key: {} {}>'.format (id (p), p._childIndex, p.level (), p.key (), p.h);
		}
		return '<pos {} [{}] None>'.format (id (p), len (p.stack));
	});},
	__repr__: __str__,
	get archivedPosition () {return __get__ (this, function (self, root_p) {
		if (typeof root_p == 'undefined' || (root_p != null && root_p.hasOwnProperty ("__kwargtrans__"))) {;
			var root_p = null;
		};
		var p = self;
		if (root_p === null) {
			var aList = (function () {
				var __accu0__ = [];
				for (var z of p.self_and_parents ()) {
					__accu0__.append (z._childIndex);
				}
				return __accu0__;
			}) ();
		}
		else {
			var aList = [];
			for (var z of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
				if (z == root_p) {
					aList.append (0);
					break;
				}
				else {
					aList.append (z._childIndex);
				}
			}
		}
		aList.reverse ();
		return aList;
	});},
	get dumpLink () {return __get__ (this, function (self, link) {
		return (link ? link : '<none>');
	});},
	get dump () {return __get__ (this, function (self, label) {
		if (typeof label == 'undefined' || (label != null && label.hasOwnProperty ("__kwargtrans__"))) {;
			var label = '';
		};
		var p = self;
		if (p.v) {
			p.v.dump ();
		}
	});},
	get key () {return __get__ (this, function (self) {
		var p = self;
		var result = [];
		for (var z of p.stack) {
			var __left0__ = z;
			var v = __left0__ [0];
			var childIndex = __left0__ [1];
			result.append ('{}:{}'.format (id (v), childIndex));
		}
		result.append ('{}:{}'.format (id (p.v), p._childIndex));
		return '.'.join (result);
	});},
	get sort_key () {return __get__ (this, function (self, p) {
		return (function () {
			var __accu0__ = [];
			for (var s of p.key ().py_split ('.')) {
				__accu0__.append (int (s.py_split (':') [1]));
			}
			return __accu0__;
		}) ();
	});},
	__hash__: null,
	get convertTreeToString () {return __get__ (this, function (self) {
		var p = self;
		var level1 = p.level ();
		var array = [];
		for (var p of p.self_and_subtree (__kwargtrans__ ({copy: false}))) {
			array.append (p.moreHead (level1) + '\n');
			var body = p.moreBody ();
			if (body) {
				array.append (body + '\n');
			}
		}
		return ''.join (array);
	});},
	get moreHead () {return __get__ (this, function (self, firstLevel, useVerticalBar) {
		if (typeof useVerticalBar == 'undefined' || (useVerticalBar != null && useVerticalBar.hasOwnProperty ("__kwargtrans__"))) {;
			var useVerticalBar = false;
		};
		var p = self;
		var level = self.level () - firstLevel;
		var plusMinus = (p.hasChildren () ? '+' : '-');
		var pad = '\t' * level;
		return '{}{} {}'.format (pad, plusMinus, p.h);
	});},
	get moreBody () {return __get__ (this, function (self) {
		var p = self;
		var array = [];
		var lines = p.b.py_split ('\n');
		for (var s of lines) {
			var i = g.skip_ws (s, 0);
			if (i < len (s) && __in__ (s [i], tuple (['+', '-', '\\']))) {
				var s = (s.__getslice__ (0, i, 1) + '\\') + s.__getslice__ (i, null, 1);
			}
			array.append (s);
		}
		return '\n'.join (array);
	});},
	get children () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.firstChild ();
		while (p) {
			yield (copy ? p.copy () : p);
			p.moveToNext ();
		}
		});},
	children_iter: children,
	get following_siblings () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.py_next ();
		while (p) {
			yield (copy ? p.copy () : p);
			p.moveToNext ();
		}
		});},
	following_siblings_iter: following_siblings,
	get nearest_roots () {return __get__ (this, function* (self, copy, predicate) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		if (typeof predicate == 'undefined' || (predicate != null && predicate.hasOwnProperty ("__kwargtrans__"))) {;
			var predicate = null;
		};
		if (predicate === null) {
			var predicate = function (p) {
				return p.isAnyAtFileNode ();
			};
		}
		var p1 = self;
		for (var p of p1.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (predicate (p)) {
				yield (copy ? p.copy () : p);
				return ;
			}
		}
		var after = p1.nodeAfterTree ();
		var p = p1;
		while (p && p != after) {
			if (predicate (p)) {
				yield (copy ? p.copy () : p);
				p.moveToNodeAfterTree ();
			}
			else {
				p.moveToThreadNext ();
			}
		}
		});},
	get nearest_unique_roots () {return __get__ (this, function* (self, copy, predicate) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		if (typeof predicate == 'undefined' || (predicate != null && predicate.hasOwnProperty ("__kwargtrans__"))) {;
			var predicate = null;
		};
		if (predicate === null) {
			var predicate = function (p) {
				return p.isAnyAtFileNode ();
			};
		}
		var p1 = self;
		for (var p of p1.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (predicate (p)) {
				yield (copy ? p.copy () : p);
				return ;
			}
		}
		var seen = set ();
		var after = p1.nodeAfterTree ();
		var p = p1;
		while (p && p != after) {
			if (predicate (p)) {
				if (!__in__ (p.v, seen)) {
					seen.add (p.v);
					yield (copy ? p.copy () : p);
				}
				p.moveToNodeAfterTree ();
			}
			else {
				p.moveToThreadNext ();
			}
		}
		});},
	nearest: nearest_unique_roots,
	get nodes () {return __get__ (this, function* (self) {
		var p = self;
		var p = p.copy ();
		var after = p.nodeAfterTree ();
		while (p && p != after) {
			yield p.v;
			p.moveToThreadNext ();
		}
		});},
	tnodes_iter: nodes,
	vnodes_iter: nodes,
	get parents () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.parent ();
		while (p) {
			yield (copy ? p.copy () : p);
			p.moveToParent ();
		}
		});},
	parents_iter: parents,
	get self_and_parents () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.copy ();
		while (p) {
			yield (copy ? p.copy () : p);
			p.moveToParent ();
		}
		});},
	self_and_parents_iter: self_and_parents,
	get self_and_siblings () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.copy ();
		while (p.hasBack ()) {
			p.moveToBack ();
		}
		while (p) {
			yield (copy ? p.copy () : p);
			p.moveToNext ();
		}
		});},
	self_and_siblings_iter: self_and_siblings,
	get self_and_subtree () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.copy ();
		var after = p.nodeAfterTree ();
		while (p && p != after) {
			yield (copy ? p.copy () : p);
			p.moveToThreadNext ();
		}
		});},
	self_and_subtree_iter: self_and_subtree,
	get subtree () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var p = p.copy ();
		var after = p.nodeAfterTree ();
		p.moveToThreadNext ();
		while (p && p != after) {
			yield (copy ? p.copy () : p);
			p.moveToThreadNext ();
		}
		});},
	subtree_iter: subtree,
	get unique_nodes () {return __get__ (this, function* (self) {
		var p = self;
		var seen = set ();
		for (var p of p.self_and_subtree (__kwargtrans__ ({copy: false}))) {
			if (!__in__ (p.v, seen)) {
				seen.add (p.v);
				yield p.v;
			}
		}
		});},
	unique_tnodes_iter: unique_nodes,
	unique_vnodes_iter: unique_nodes,
	get unique_subtree () {return __get__ (this, function* (self, copy) {
		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
			var copy = true;
		};
		var p = self;
		var seen = set ();
		for (var p of p.subtree ()) {
			if (!__in__ (p.v, seen)) {
				seen.add (p.v);
				yield (copy ? p.copy () : p);
			}
		}
		});},
	subtree_with_unique_tnodes_iter: unique_subtree,
	subtree_with_unique_vnodes_iter: unique_subtree,
	get anyAtFileNodeName () {return __get__ (this, function (self) {
		return self.v.anyAtFileNodeName ();
	});},
	get atAutoNodeName () {return __get__ (this, function (self) {
		return self.v.atAutoNodeName ();
	});},
	get atCleanNodeName () {return __get__ (this, function (self) {
		return self.v.atCleanNodeName ();
	});},
	get atEditNodeName () {return __get__ (this, function (self) {
		return self.v.atEditNodeName ();
	});},
	get atFileNodeName () {return __get__ (this, function (self) {
		return self.v.atFileNodeName ();
	});},
	get atNoSentinelsFileNodeName () {return __get__ (this, function (self) {
		return self.v.atNoSentinelsFileNodeName ();
	});},
	get atShadowFileNodeName () {return __get__ (this, function (self) {
		return self.v.atShadowFileNodeName ();
	});},
	get atSilentFileNodeName () {return __get__ (this, function (self) {
		return self.v.atSilentFileNodeName ();
	});},
	get atThinFileNodeName () {return __get__ (this, function (self) {
		return self.v.atThinFileNodeName ();
	});},
	atNoSentFileNodeName: atNoSentinelsFileNodeName,
	atAsisFileNodeName: atSilentFileNodeName,
	get isAnyAtFileNode () {return __get__ (this, function (self) {
		return self.v.isAnyAtFileNode ();
	});},
	get isAtAllNode () {return __get__ (this, function (self) {
		return self.v.isAtAllNode ();
	});},
	get isAtAutoNode () {return __get__ (this, function (self) {
		return self.v.isAtAutoNode ();
	});},
	get isAtAutoRstNode () {return __get__ (this, function (self) {
		return self.v.isAtAutoRstNode ();
	});},
	get isAtCleanNode () {return __get__ (this, function (self) {
		return self.v.isAtCleanNode ();
	});},
	get isAtEditNode () {return __get__ (this, function (self) {
		return self.v.isAtEditNode ();
	});},
	get isAtFileNode () {return __get__ (this, function (self) {
		return self.v.isAtFileNode ();
	});},
	get isAtIgnoreNode () {return __get__ (this, function (self) {
		return self.v.isAtIgnoreNode ();
	});},
	get isAtNoSentinelsFileNode () {return __get__ (this, function (self) {
		return self.v.isAtNoSentinelsFileNode ();
	});},
	get isAtOthersNode () {return __get__ (this, function (self) {
		return self.v.isAtOthersNode ();
	});},
	get isAtRstFileNode () {return __get__ (this, function (self) {
		return self.v.isAtRstFileNode ();
	});},
	get isAtSilentFileNode () {return __get__ (this, function (self) {
		return self.v.isAtSilentFileNode ();
	});},
	get isAtShadowFileNode () {return __get__ (this, function (self) {
		return self.v.isAtShadowFileNode ();
	});},
	get isAtThinFileNode () {return __get__ (this, function (self) {
		return self.v.isAtThinFileNode ();
	});},
	isAtNoSentFileNode: isAtNoSentinelsFileNode,
	isAtAsisFileNode: isAtSilentFileNode,
	get matchHeadline () {return __get__ (this, function (self, pattern) {
		return self.v.matchHeadline (pattern);
	});},
	get bodyString () {return __get__ (this, function (self) {
		return self.v.bodyString ();
	});},
	get headString () {return __get__ (this, function (self) {
		return self.v.headString ();
	});},
	get cleanHeadString () {return __get__ (this, function (self) {
		return self.v.cleanHeadString ();
	});},
	get isDirty () {return __get__ (this, function (self) {
		return self.v.isDirty ();
	});},
	get isMarked () {return __get__ (this, function (self) {
		return self.v.isMarked ();
	});},
	get isOrphan () {return __get__ (this, function (self) {
		return self.v.isOrphan ();
	});},
	get isSelected () {return __get__ (this, function (self) {
		return self.v.isSelected ();
	});},
	get isTopBitSet () {return __get__ (this, function (self) {
		return self.v.isTopBitSet ();
	});},
	get isVisited () {return __get__ (this, function (self) {
		return self.v.isVisited ();
	});},
	get status () {return __get__ (this, function (self) {
		return self.v.status ();
	});},
	get childIndex () {return __get__ (this, function (self) {
		var p = self;
		return p._childIndex;
	});},
	get directParents () {return __get__ (this, function (self) {
		return self.v.directParents ();
	});},
	get hasChildren () {return __get__ (this, function (self) {
		var p = self;
		return len (p.v.children) > 0;
	});},
	hasFirstChild: hasChildren,
	get numberOfChildren () {return __get__ (this, function (self) {
		var p = self;
		return len (p.v.children);
	});},
	get getBack () {return __get__ (this, function (self) {
		return self.copy ().moveToBack ();
	});},
	get getFirstChild () {return __get__ (this, function (self) {
		return self.copy ().moveToFirstChild ();
	});},
	get getLastChild () {return __get__ (this, function (self) {
		return self.copy ().moveToLastChild ();
	});},
	get getLastNode () {return __get__ (this, function (self) {
		return self.copy ().moveToLastNode ();
	});},
	get getNext () {return __get__ (this, function (self) {
		return self.copy ().moveToNext ();
	});},
	get getNodeAfterTree () {return __get__ (this, function (self) {
		return self.copy ().moveToNodeAfterTree ();
	});},
	get getNthChild () {return __get__ (this, function (self, n) {
		return self.copy ().moveToNthChild (n);
	});},
	get getParent () {return __get__ (this, function (self) {
		return self.copy ().moveToParent ();
	});},
	get getThreadBack () {return __get__ (this, function (self) {
		return self.copy ().moveToThreadBack ();
	});},
	get getThreadNext () {return __get__ (this, function (self) {
		return self.copy ().moveToThreadNext ();
	});},
	get getVisBack () {return __get__ (this, function (self, c) {
		return self.copy ().moveToVisBack (c);
	});},
	get getVisNext () {return __get__ (this, function (self, c) {
		return self.copy ().moveToVisNext (c);
	});},
	back: getBack,
	firstChild: getFirstChild,
	lastChild: getLastChild,
	lastNode: getLastNode,
	py_next: getNext,
	nodeAfterTree: getNodeAfterTree,
	nthChild: getNthChild,
	parent: getParent,
	threadBack: getThreadBack,
	threadNext: getThreadNext,
	visBack: getVisBack,
	visNext: getVisNext,
	hasVisBack: visBack,
	hasVisNext: visNext,
	get get_UNL () {return __get__ (this, function (self, with_file, with_proto, with_index, with_count) {
		if (typeof with_file == 'undefined' || (with_file != null && with_file.hasOwnProperty ("__kwargtrans__"))) {;
			var with_file = true;
		};
		if (typeof with_proto == 'undefined' || (with_proto != null && with_proto.hasOwnProperty ("__kwargtrans__"))) {;
			var with_proto = false;
		};
		if (typeof with_index == 'undefined' || (with_index != null && with_index.hasOwnProperty ("__kwargtrans__"))) {;
			var with_index = true;
		};
		if (typeof with_count == 'undefined' || (with_count != null && with_count.hasOwnProperty ("__kwargtrans__"))) {;
			var with_count = false;
		};
		var aList = [];
		for (var i of self.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (with_index || with_count) {
				var count = 0;
				var ind = 0;
				var p = i.copy ();
				while (p.hasBack ()) {
					var ind = ind + 1;
					p.moveToBack ();
					if (i.h == p.h) {
						var count = count + 1;
					}
				}
				aList.append ((i.h.py_replace ('-->', '--%3E') + ':') + str (ind));
				if (count || with_count) {
					aList [-(1)] = (aList [-(1)] + ',') + str (count);
				}
			}
			else {
				aList.append (i.h.py_replace ('-->', '--%3E'));
			}
		}
		var UNL = '-->'.join (py_reversed (aList));
		if (with_proto) {
			var s = 'unl:' + '//{}#{}'.format (self.v.context.fileName (), UNL);
			return s.py_replace (' ', '%20');
		}
		if (with_file) {
			return '{}#{}'.format (self.v.context.fileName (), UNL);
		}
		return UNL;
	});},
	get hasBack () {return __get__ (this, function (self) {
		var p = self;
		return p.v && p._childIndex > 0;
	});},
	get hasNext () {return __get__ (this, function (self) {
		var p = self;
		try {
			var parent_v = p._parentVnode ();
			return p.v && parent_v && p._childIndex + 1 < len (parent_v.children);
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.trace ('*** Unexpected exception');
				g.es_exception ();
				return null;
			}
			else {
				throw __except0__;
			}
		}
	});},
	get hasParent () {return __get__ (this, function (self) {
		var p = self;
		return p.v && p.stack;
	});},
	get hasThreadBack () {return __get__ (this, function (self) {
		var p = self;
		return p.hasParent () || p.hasBack ();
	});},
	get hasThreadNext () {return __get__ (this, function (self) {
		var p = self;
		if (!(p.v)) {
			return false;
		}
		if (p.hasChildren () || p.hasNext ()) {
			return true;
		}
		var n = len (p.stack) - 1;
		while (n >= 0) {
			var __left0__ = p.stack [n];
			var v = __left0__ [0];
			var childIndex = __left0__ [1];
			if (n == 0) {
				var parent_v = v.context.hiddenRootNode;
			}
			else {
				var __left0__ = p.stack [n - 1];
				var parent_v = __left0__ [0];
				var junk = __left0__ [1];
			}
			if (len (parent_v.children) > childIndex + 1) {
				return true;
			}
			n--;
		}
		return false;
	});},
	get findRootPosition () {return __get__ (this, function (self) {
		var p = self;
		var c = p.v.context;
		return c.rootPosition ();
	});},
	get isAncestorOf () {return __get__ (this, function (self, p2) {
		var p = self;
		var c = p.v.context;
		if (!(c.positionExists (p2))) {
			return false;
		}
		for (var z of p2.stack) {
			var __left0__ = z;
			var parent_v = __left0__ [0];
			var parent_childIndex = __left0__ [1];
			if (parent_v == p.v && parent_childIndex == p._childIndex) {
				return true;
			}
		}
		return false;
	});},
	get isCloned () {return __get__ (this, function (self) {
		var p = self;
		return p.v.isCloned ();
	});},
	get isRoot () {return __get__ (this, function (self) {
		var p = self;
		return !(p.hasParent ()) && !(p.hasBack ());
	});},
	get isVisible () {return __get__ (this, function (self, c) {
		var p = self;
		var visible = function (p, root) {
			if (typeof root == 'undefined' || (root != null && root.hasOwnProperty ("__kwargtrans__"))) {;
				var root = null;
			};
			for (var parent of p.parents (__kwargtrans__ ({copy: false}))) {
				if (parent && parent == root) {
					return true;
				}
				if (!(c.shouldBeExpanded (parent))) {
					return false;
				}
			}
			return true;
		};
		if (c.hoistStack) {
			var root = c.hoistStack [-(1)].p;
			if (p == root) {
				return true;
			}
			return root.isAncestorOf (p) && visible (p, __kwargtrans__ ({root: root}));
		}
		for (var root of c.rootPosition ().self_and_siblings (__kwargtrans__ ({copy: false}))) {
			if (root == p || root.isAncestorOf (p)) {
				return visible (p);
			}
		}
		return false;
	});},
	get level () {return __get__ (this, function (self) {
		var p = self;
		return (p.v ? len (p.stack) : 0);
	});},
	simpleLevel: level,
	get positionAfterDeletedTree () {return __get__ (this, function (self) {
		var p = self;
		var py_next = p.py_next ();
		if (py_next) {
			var p = p.copy ();
			p.v = py_next.v;
			return p;
		}
		return p.nodeAfterTree ();
	});},
	get textOffset () {return __get__ (this, function (self) {
		var p = self;
		var __left0__ = tuple ([false, 0]);
		var found = __left0__ [0];
		var offset = __left0__ [1];
		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (p.isAnyAtFileNode ()) {
				var found = true;
				break;
			}
			var parent = p.parent ();
			if (!(parent)) {
				break;
			}
			var h = p.h.strip ();
			var i = h.find ('<<');
			var j = h.find ('>>');
			var target = ((-(1) < i && i < j) ? h.__getslice__ (i, j + 2, 1) : '@others');
			for (var s of parent.b.py_split ('\n')) {
				if (s.find (target) > -(1)) {
					offset += g.skip_ws (s, 0);
					break;
				}
			}
		}
		return (found ? offset : null);
	});},
	get isOutsideAnyAtFileTree () {return __get__ (this, function (self) {
		var p = self;
		for (var parent of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (parent.isAnyAtFileNode ()) {
				return false;
			}
		}
		return true;
	});},
	get _adjustPositionBeforeUnlink () {return __get__ (this, function (self, p2) {
		var p = self;
		var sib = p.copy ();
		while (sib.hasBack ()) {
			sib.moveToBack ();
			if (sib == p2) {
				p._childIndex--;
				return ;
			}
		}
		var stack = [];
		var changed = false;
		var i = 0;
		while (i < len (p.stack)) {
			var __left0__ = p.stack [i];
			var v = __left0__ [0];
			var childIndex = __left0__ [1];
			var p3 = Position (__kwargtrans__ ({v: v, childIndex: childIndex, stack: stack.__getslice__ (0, i, 1)}));
			var __break1__ = false;
			while (p3) {
				if (p2 == p3) {
					stack.append (tuple ([v, childIndex - 1]));
					var changed = true;
					__break1__ = true;
					break;
				}
				p3.moveToBack ();
			}
			if (!__break1__) {
				stack.append (tuple ([v, childIndex]));
			}
			i++;
		}
		if (changed) {
			p.stack = stack;
		}
	});},
	get _linkAfter () {return __get__ (this, function (self, p_after) {
		var p = self;
		var parent_v = p_after._parentVnode ();
		p.stack = p_after.stack.__getslice__ (0, null, 1);
		p._childIndex = p_after._childIndex + 1;
		var child = p.v;
		var n = p_after._childIndex + 1;
		child._addLink (n, parent_v);
	});},
	get _linkCopiedAfter () {return __get__ (this, function (self, p_after) {
		var p = self;
		var parent_v = p_after._parentVnode ();
		p.stack = p_after.stack.__getslice__ (0, null, 1);
		p._childIndex = p_after._childIndex + 1;
		var child = p.v;
		var n = p_after._childIndex + 1;
		child._addCopiedLink (n, parent_v);
	});},
	get _linkAsNthChild () {return __get__ (this, function (self, parent, n) {
		var p = self;
		var parent_v = parent.v;
		p.stack = parent.stack.__getslice__ (0, null, 1);
		p.stack.append (tuple ([parent_v, parent._childIndex]));
		p._childIndex = n;
		var child = p.v;
		child._addLink (n, parent_v);
	});},
	get _linkCopiedAsNthChild () {return __get__ (this, function (self, parent, n) {
		var p = self;
		var parent_v = parent.v;
		p.stack = parent.stack.__getslice__ (0, null, 1);
		p.stack.append (tuple ([parent_v, parent._childIndex]));
		p._childIndex = n;
		var child = p.v;
		child._addCopiedLink (n, parent_v);
	});},
	get _linkAsRoot () {return __get__ (this, function (self) {
		var p = self;
		var parent_v = p.v.context.hiddenRootNode;
		p.stack = [];
		p._childIndex = 0;
		p.v._addLink (0, parent_v);
		return p;
	});},
	get _parentVnode () {return __get__ (this, function (self) {
		var p = self;
		if (p.v) {
			var data = p.stack && p.stack [-(1)];
			if (data) {
				var __left0__ = data;
				var v = __left0__ [0];
				var junk = __left0__ [1];
				return v;
			}
			return p.v.context.hiddenRootNode;
		}
		return null;
	});},
	get _relinkAsCloneOf () {return __get__ (this, function (self, p2) {
		var p = self;
		var __left0__ = tuple ([p.v, p2.v]);
		var v = __left0__ [0];
		var v2 = __left0__ [1];
		var parent_v = p._parentVnode ();
		if (!(parent_v)) {
			g.internalError ('no parent_v', p);
			return ;
		}
		if (parent_v.children [p._childIndex] == v) {
			parent_v.children [p._childIndex] = v2;
			v2.parents.append (parent_v);
		}
		else {
			g.internalError ('parent_v.children[childIndex] != v', p, parent_v.children, p._childIndex, v);
		}
	});},
	get _unlink () {return __get__ (this, function (self) {
		var p = self;
		var n = p._childIndex;
		var parent_v = p._parentVnode ();
		var child = p.v;
		if ((0 <= n && n < len (parent_v.children)) && parent_v.children [n] == child) {
			child._cutLink (n, parent_v);
		}
		else {
			self.badUnlink (parent_v, n, child);
		}
	});},
	get badUnlink () {return __get__ (this, function (self, parent_v, n, child) {
		if ((0 <= n && n < len (parent_v.children))) {
			g.trace ('**can not happen: children[{}] != p.v'.format (n));
			g.trace ('parent_v.children...\n', g.listToString (parent_v.children));
			g.trace ('parent_v', parent_v);
			g.trace ('parent_v.children[n]', parent_v.children [n]);
			g.trace ('child', child);
			g.trace ('** callers:', g.callers ());
			if (g.app.unitTesting) {
			}
		}
		else {
			g.trace ('**can not happen: bad child index: {}, len(children): {}'.format (n, len (parent_v.children)));
			g.trace ('parent_v.children...\n', g.listToString (parent_v.children));
			g.trace ('parent_v', parent_v, 'child', child);
			g.trace ('** callers:', g.callers ());
			if (g.app.unitTesting) {
			}
		}
	});},
	get moveToBack () {return __get__ (this, function (self) {
		var p = self;
		var n = p._childIndex;
		var parent_v = p._parentVnode ();
		if (parent_v && p.v && (0 < n && n <= len (parent_v.children))) {
			p._childIndex--;
			p.v = parent_v.children [n - 1];
		}
		else {
			p.v = null;
		}
		return p;
	});},
	get moveToFirstChild () {return __get__ (this, function (self) {
		var p = self;
		if (p.v && p.v.children) {
			p.stack.append (tuple ([p.v, p._childIndex]));
			p.v = p.v.children [0];
			p._childIndex = 0;
		}
		else {
			p.v = null;
		}
		return p;
	});},
	get moveToLastChild () {return __get__ (this, function (self) {
		var p = self;
		if (p.v && p.v.children) {
			p.stack.append (tuple ([p.v, p._childIndex]));
			var n = len (p.v.children);
			p.v = p.v.children [n - 1];
			p._childIndex = n - 1;
		}
		else {
			p.v = null;
		}
		return p;
	});},
	get moveToLastNode () {return __get__ (this, function (self) {
		var p = self;
		while (p.hasChildren ()) {
			p.moveToLastChild ();
		}
		return p;
	});},
	get moveToNext () {return __get__ (this, function (self) {
		var p = self;
		var n = p._childIndex;
		var parent_v = p._parentVnode ();
		if (!(p.v)) {
			g.trace ('no p.v:', p, g.callers ());
		}
		if (p.v && parent_v && len (parent_v.children) > n + 1) {
			p._childIndex = n + 1;
			p.v = parent_v.children [n + 1];
		}
		else {
			p.v = null;
		}
		return p;
	});},
	get moveToNodeAfterTree () {return __get__ (this, function (self) {
		var p = self;
		while (p) {
			if (p.hasNext ()) {
				p.moveToNext ();
				break;
			}
			p.moveToParent ();
		}
		return p;
	});},
	get moveToNthChild () {return __get__ (this, function (self, n) {
		var p = self;
		if (p.v && len (p.v.children) > n) {
			p.stack.append (tuple ([p.v, p._childIndex]));
			p.v = p.v.children [n];
			p._childIndex = n;
		}
		else {
			p.v = null;
		}
		return p;
	});},
	get moveToParent () {return __get__ (this, function (self) {
		var p = self;
		if (p.v && p.stack) {
			var __left0__ = p.stack.py_pop ();
			p.v = __left0__ [0];
			p._childIndex = __left0__ [1];
		}
		else {
			p.v = null;
		}
		return p;
	});},
	get moveToThreadBack () {return __get__ (this, function (self) {
		var p = self;
		if (p.hasBack ()) {
			p.moveToBack ();
			p.moveToLastNode ();
		}
		else {
			p.moveToParent ();
		}
		return p;
	});},
	get moveToThreadNext () {return __get__ (this, function (self) {
		var p = self;
		if (p.v) {
			if (p.v.children) {
				p.moveToFirstChild ();
			}
			else if (p.hasNext ()) {
				p.moveToNext ();
			}
			else {
				p.moveToParent ();
				while (p) {
					if (p.hasNext ()) {
						p.moveToNext ();
						break;
					}
					p.moveToParent ();
				}
			}
		}
		return p;
	});},
	get moveToVisBack () {return __get__ (this, function (self, c) {
		var p = self;
		var __left0__ = c.visLimit ();
		var limit = __left0__ [0];
		var limitIsVisible = __left0__ [1];
		while (p) {
			var back = p.back ();
			if (back && back.hasChildren () && back.isExpanded ()) {
				p.moveToThreadBack ();
			}
			else if (back) {
				p.moveToBack ();
			}
			else {
				p.moveToParent ();
			}
			if (p) {
				if (limit) {
					var __left0__ = self.checkVisBackLimit (limit, limitIsVisible, p);
					var done = __left0__ [0];
					var val = __left0__ [1];
					if (done) {
						return val;
					}
				}
				if (p.isVisible (c)) {
					return p;
				}
			}
		}
		return p;
	});},
	get checkVisBackLimit () {return __get__ (this, function (self, limit, limitIsVisible, p) {
		var c = p.v.context;
		if (limit == p) {
			if (limitIsVisible && p.isVisible (c)) {
				return tuple ([true, p]);
			}
			return tuple ([true, null]);
		}
		if (limit.isAncestorOf (p)) {
			return tuple ([false, null]);
		}
		return tuple ([true, null]);
	});},
	get moveToVisNext () {return __get__ (this, function (self, c) {
		var p = self;
		var __left0__ = c.visLimit ();
		var limit = __left0__ [0];
		var limitIsVisible = __left0__ [1];
		while (p) {
			if (p.hasChildren ()) {
				if (p.isExpanded ()) {
					p.moveToFirstChild ();
				}
				else {
					p.moveToNodeAfterTree ();
				}
			}
			else if (p.hasNext ()) {
				p.moveToNext ();
			}
			else {
				p.moveToThreadNext ();
			}
			if (p) {
				if (limit && self.checkVisNextLimit (limit, p)) {
					return null;
				}
				if (p.isVisible (c)) {
					return p;
				}
			}
		}
		return p;
	});},
	get checkVisNextLimit () {return __get__ (this, function (self, limit, p) {
		return limit != p && !(limit.isAncestorOf (p));
	});},
	get safeMoveToThreadNext () {return __get__ (this, function (self) {
		var p = self;
		if (p.v) {
			var child_v = p.v.children && p.v.children [0];
			if (child_v) {
				var __break0__ = false;
				for (var parent of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
					if (child_v == parent.v) {
						g.app.structure_errors++;
						g.error ('vnode: {} is its own parent'.format (child_v));
						parent.v.children = (function () {
							var __accu0__ = [];
							for (var v2 of parent.v.children) {
								if (!(v2 == child_v)) {
									__accu0__.append (v2);
								}
							}
							return __accu0__;
						}) ();
						if (__in__ (parent.v, child_v.parents)) {
							child_v.parents.remove (parent.v);
						}
						p.moveToParent ();
						__break0__ = true;
						break;
					}
					else if (child_v.fileIndex == parent.v.fileIndex) {
						g.app.structure_errors++;
						g.error ('duplicate gnx: {} v: {} parent: {}'.format (child_v.fileIndex, child_v, parent.v));
						child_v.fileIndex = g.app.nodeIndices.getNewIndex (__kwargtrans__ ({v: child_v}));
						p.moveToFirstChild ();
						__break0__ = true;
						break;
					}
				}
				if (!__break0__) {
					p.moveToFirstChild ();
				}
			}
			else if (p.hasNext ()) {
				p.moveToNext ();
			}
			else {
				p.moveToParent ();
				while (p) {
					if (p.hasNext ()) {
						p.moveToNext ();
						break;
					}
					p.moveToParent ();
				}
			}
		}
		return p;
	});},
	get clone () {return __get__ (this, function (self) {
		var p = self;
		var p2 = p.copy ();
		p2._linkAfter (p);
		return p2;
	});},
	get copy () {return __get__ (this, function (self) {
		return Position (self.v, self._childIndex, self.stack);
	});},
	get copyTreeAfter () {return __get__ (this, function (self, copyGnxs) {
		if (typeof copyGnxs == 'undefined' || (copyGnxs != null && copyGnxs.hasOwnProperty ("__kwargtrans__"))) {;
			var copyGnxs = false;
		};
		var p = self;
		var p2 = p.insertAfter ();
		p.copyTreeFromSelfTo (p2, __kwargtrans__ ({copyGnxs: copyGnxs}));
		return p2;
	});},
	get copyTreeFromSelfTo () {return __get__ (this, function (self, p2, copyGnxs) {
		if (typeof copyGnxs == 'undefined' || (copyGnxs != null && copyGnxs.hasOwnProperty ("__kwargtrans__"))) {;
			var copyGnxs = false;
		};
		var p = self;
		p2.v._headString = g.toUnicode (p.h, __kwargtrans__ ({reportErrors: true}));
		p2.v._bodyString = g.toUnicode (p.b, __kwargtrans__ ({reportErrors: true}));
		if (copyGnxs) {
			p2.v.fileIndex = p.v.fileIndex;
		}
		for (var child of p.children ()) {
			var child2 = p2.insertAsLastChild ();
			child.copyTreeFromSelfTo (child2, __kwargtrans__ ({copyGnxs: copyGnxs}));
		}
	});},
	get copyWithNewVnodes () {return __get__ (this, function (self, copyMarked) {
		if (typeof copyMarked == 'undefined' || (copyMarked != null && copyMarked.hasOwnProperty ("__kwargtrans__"))) {;
			var copyMarked = false;
		};
		var p = self;
		return Position (__kwargtrans__ ({v: p.v.copyTree (copyMarked)}));
	});},
	get createNodeHierarchy () {return __get__ (this, function (self, heads, forcecreate) {
		if (typeof forcecreate == 'undefined' || (forcecreate != null && forcecreate.hasOwnProperty ("__kwargtrans__"))) {;
			var forcecreate = false;
		};
		var c = self.v.context;
		return c.createNodeHierarchy (heads, __kwargtrans__ ({parent: self, forcecreate: forcecreate}));
	});},
	get deleteAllChildren () {return __get__ (this, function (self) {
		var p = self;
		p.setDirty ();
		while (p.hasChildren ()) {
			p.firstChild ().doDelete ();
		}
	});},
	get doDelete () {return __get__ (this, function (self, newNode) {
		if (typeof newNode == 'undefined' || (newNode != null && newNode.hasOwnProperty ("__kwargtrans__"))) {;
			var newNode = null;
		};
		var p = self;
		p.setDirty ();
		var sib = p.copy ();
		while (sib.hasNext ()) {
			sib.moveToNext ();
			if (sib == newNode) {
				newNode._childIndex--;
				break;
			}
		}
		p._unlink ();
	});},
	get insertAfter () {return __get__ (this, function (self) {
		var p = self;
		var context = p.v.context;
		var p2 = self.copy ();
		p2.v = VNode (__kwargtrans__ ({context: context}));
		p2.v.iconVal = 0;
		p2._linkAfter (p);
		return p2;
	});},
	get insertAsLastChild () {return __get__ (this, function (self) {
		var p = self;
		var n = p.numberOfChildren ();
		return p.insertAsNthChild (n);
	});},
	get insertAsNthChild () {return __get__ (this, function (self, n) {
		var p = self;
		var context = p.v.context;
		var p2 = self.copy ();
		p2.v = VNode (__kwargtrans__ ({context: context}));
		p2.v.iconVal = 0;
		p2._linkAsNthChild (p, n);
		return p2;
	});},
	get insertBefore () {return __get__ (this, function (self) {
		var p = self;
		var parent = p.parent ();
		if (p.hasBack ()) {
			var back = p.getBack ();
			var p = back.insertAfter ();
		}
		else if (parent) {
			var p = parent.insertAsNthChild (0);
		}
		else {
			var p = p.insertAfter ();
			p.moveToRoot ();
		}
		return p;
	});},
	get invalidOutline () {return __get__ (this, function (self, message) {
		var p = self;
		if (p.hasParent ()) {
			var node = p.parent ();
		}
		else {
			var node = p;
		}
		p.v.context.alert ('invalid outline: {}\n{}'.format (message, node));
	});},
	get moveAfter () {return __get__ (this, function (self, a) {
		var p = self;
		a._adjustPositionBeforeUnlink (p);
		p._unlink ();
		p._linkAfter (a);
		return p;
	});},
	get moveToFirstChildOf () {return __get__ (this, function (self, parent) {
		var p = self;
		return p.moveToNthChildOf (parent, 0);
	});},
	get moveToLastChildOf () {return __get__ (this, function (self, parent) {
		var p = self;
		var n = parent.numberOfChildren ();
		if (p.parent () == parent) {
			n--;
		}
		return p.moveToNthChildOf (parent, n);
	});},
	get moveToNthChildOf () {return __get__ (this, function (self, parent, n) {
		var p = self;
		parent._adjustPositionBeforeUnlink (p);
		p._unlink ();
		p._linkAsNthChild (parent, n);
		return p;
	});},
	get moveToRoot () {return __get__ (this, function (self) {
		var p = self;
		p._unlink ();
		p._linkAsRoot ();
		return p;
	});},
	get promote () {return __get__ (this, function (self) {
		var p = self;
		var parent_v = p._parentVnode ();
		var children = p.v.children;
		var n = p.childIndex () + 1;
		var z = parent_v.children.__getslice__ (0, null, 1);
		parent_v.children = z.__getslice__ (0, n, 1);
		parent_v.children.extend (children);
		parent_v.children.extend (z.__getslice__ (n, null, 1));
		p.v.children = [];
		for (var child of children) {
			child.parents.remove (p.v);
			child.parents.append (parent_v);
		}
	});},
	get validateOutlineWithParent () {return __get__ (this, function (self, pv) {
		var p = self;
		var result = true;
		var parent = p.getParent ();
		var childIndex = p._childIndex;
		if (parent != pv) {
			p.invalidOutline ('Invalid parent link: ' + repr (parent));
		}
		if (pv) {
			if (childIndex < 0) {
				p.invalidOutline ('missing childIndex' + childIndex);
			}
			else if (childIndex >= pv.numberOfChildren ()) {
				p.invalidOutline ('missing children entry for index: ' + childIndex);
			}
		}
		else if (childIndex < 0) {
			p.invalidOutline ('negative childIndex' + childIndex);
		}
		if (!(p.v) && pv) {
			self.invalidOutline ('Empty t');
		}
		for (var child of p.children ()) {
			var r = child.validateOutlineWithParent (p);
			if (!(r)) {
				var result = false;
			}
		}
		return result;
	});},
	get __get_b () {return __get__ (this, function (self) {
		var p = self;
		return p.bodyString ();
	});},
	get __set_b () {return __get__ (this, function (self, val) {
		var p = self;
		var c = p.v && p.v.context;
		if (c) {
			c.setBodyString (p, val);
		}
	});},
	get __get_h () {return __get__ (this, function (self) {
		var p = self;
		return p.headString ();
	});},
	get __set_h () {return __get__ (this, function (self, val) {
		var p = self;
		var c = p.v && p.v.context;
		if (c) {
			c.setHeadString (p, val);
		}
	});},
	get __get_gnx () {return __get__ (this, function (self) {
		var p = self;
		return p.v.fileIndex;
	});},
	get __get_script () {return __get__ (this, function (self) {
		var p = self;
		return g.getScript (p.v.context, p, __kwargtrans__ ({useSelectedText: false, forcePythonSentinels: true, useSentinels: false}));
	});},
	get __get_nosentinels () {return __get__ (this, function (self) {
		var p = self;
		return ''.join ((function () {
			var __accu0__ = [];
			for (var z of g.splitLines (p.b)) {
				if (!(g.isDirective (z))) {
					__accu0__.append (z);
				}
			}
			return __accu0__;
		}) ());
	});},
	get __get_u () {return __get__ (this, function (self) {
		var p = self;
		return p.v.u;
	});},
	get __set_u () {return __get__ (this, function (self, val) {
		var p = self;
		p.v.u = val;
	});},
	get contract () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self, self.v]);
		var p = __left0__ [0];
		var v = __left0__ [1];
		v.expandedPositions = (function () {
			var __accu0__ = [];
			for (var z of v.expandedPositions) {
				if (z != p) {
					__accu0__.append (z);
				}
			}
			return __accu0__;
		}) ();
		v.contract ();
	});},
	get expand () {return __get__ (this, function (self) {
		var p = self;
		var v = self.v;
		v.expandedPositions = (function () {
			var __accu0__ = [];
			for (var z of v.expandedPositions) {
				if (z != p) {
					__accu0__.append (z);
				}
			}
			return __accu0__;
		}) ();
		var __break0__ = false;
		for (var p2 of v.expandedPositions) {
			if (p == p2) {
				__break0__ = true;
				break;
			}
		}
		if (!__break0__) {
			v.expandedPositions.append (p.copy ());
		}
		v.expand ();
	});},
	get isExpanded () {return __get__ (this, function (self) {
		var p = self;
		if (p.isCloned ()) {
			var c = p.v.context;
			return c.shouldBeExpanded (p);
		}
		return p.v.isExpanded ();
	});},
	get clearMarked () {return __get__ (this, function (self) {
		return self.v.clearMarked ();
	});},
	get clearOrphan () {return __get__ (this, function (self) {
		return self.v.clearOrphan ();
	});},
	get clearVisited () {return __get__ (this, function (self) {
		return self.v.clearVisited ();
	});},
	get initExpandedBit () {return __get__ (this, function (self) {
		return self.v.initExpandedBit ();
	});},
	get initMarkedBit () {return __get__ (this, function (self) {
		return self.v.initMarkedBit ();
	});},
	get initStatus () {return __get__ (this, function (self, status) {
		return self.v.initStatus (status);
	});},
	get setMarked () {return __get__ (this, function (self) {
		return self.v.setMarked ();
	});},
	get setOrphan () {return __get__ (this, function (self) {
		return self.v.setOrphan ();
	});},
	get setSelected () {return __get__ (this, function (self) {
		return self.v.setSelected ();
	});},
	get setVisited () {return __get__ (this, function (self) {
		return self.v.setVisited ();
	});},
	get computeIcon () {return __get__ (this, function (self) {
		return self.v.computeIcon ();
	});},
	get setIcon () {return __get__ (this, function (self) {
		// pass;
	});},
	get setSelection () {return __get__ (this, function (self, start, length) {
		return self.v.setSelection (start, length);
	});},
	get restoreCursorAndScroll () {return __get__ (this, function (self) {
		self.v.restoreCursorAndScroll ();
	});},
	get saveCursorAndScroll () {return __get__ (this, function (self) {
		self.v.saveCursorAndScroll ();
	});},
	get setBodyString () {return __get__ (this, function (self, s) {
		var p = self;
		return p.v.setBodyString (s);
	});},
	initBodyString: setBodyString,
	setTnodeText: setBodyString,
	scriptSetBodyString: setBodyString,
	get initHeadString () {return __get__ (this, function (self, s) {
		var p = self;
		p.v.initHeadString (s);
	});},
	get setHeadString () {return __get__ (this, function (self, s) {
		var p = self;
		p.v.initHeadString (s);
		p.setDirty ();
	});},
	get clearVisitedInTree () {return __get__ (this, function (self) {
		for (var p of self.self_and_subtree (__kwargtrans__ ({copy: false}))) {
			p.clearVisited ();
		}
	});},
	get clearAllVisitedInTree () {return __get__ (this, function (self) {
		for (var p of self.self_and_subtree (__kwargtrans__ ({copy: false}))) {
			p.v.clearVisited ();
			p.v.clearWriteBit ();
		}
	});},
	get clearDirty () {return __get__ (this, function (self) {
		var p = self;
		p.v.clearDirty ();
	});},
	get inAtIgnoreRange () {return __get__ (this, function (self) {
		var p = self;
		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (p.isAtIgnoreNode ()) {
				return true;
			}
		}
		return false;
	});},
	get setAllAncestorAtFileNodesDirty () {return __get__ (this, function (self) {
		var p = self;
		p.v.setAllAncestorAtFileNodesDirty ();
	});},
	get setDirty () {return __get__ (this, function (self) {
		var p = self;
		p.v.setAllAncestorAtFileNodesDirty ();
		p.v.setDirty ();
	});},
	get is_at_all () {return __get__ (this, function (self) {
		var p = self;
		return p.isAnyAtFileNode () && any ((function () {
			var __accu0__ = [];
			for (var s of g.splitLines (p.b)) {
				__accu0__.append (g.match_word (s, 0, '@all'));
			}
			return __accu0__;
		}) ());
	});},
	get in_at_all_tree () {return __get__ (this, function (self) {
		var p = self;
		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (p.is_at_all ()) {
				return true;
			}
		}
		return false;
	});},
	get is_at_ignore () {return __get__ (this, function (self) {
		var p = self;
		return g.match_word (p.h, 0, '@ignore');
	});},
	get in_at_ignore_tree () {return __get__ (this, function (self) {
		var p = self;
		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
			if (g.match_word (p.h, 0, '@ignore')) {
				return true;
			}
		}
		return false;
	});}
});
Object.defineProperty (Position, 'b', property.call (Position, Position.__get_b, Position.__set_b));
Object.defineProperty (Position, 'h', property.call (Position, Position.__get_h, Position.__set_h));
Object.defineProperty (Position, 'gnx', property.call (Position, Position.__get_gnx));
Object.defineProperty (Position, 'script', property.call (Position, Position.__get_script));
Object.defineProperty (Position, 'nosentinels', property.call (Position, Position.__get_nosentinels));
Object.defineProperty (Position, 'u', property.call (Position, Position.__get_u, Position.__set_u));
export var position = Position;
export var PosList =  __class__ ('PosList', [list], {
	__module__: __name__,
	get children () {return __get__ (this, function (self) {
		var res = PosList ();
		for (var p of self) {
			for (var child_p of p.children ()) {
				res.append (child_p.copy ());
			}
		}
		return res;
	});},
	get filter_h () {return __get__ (this, function (self, regex, flags) {
		if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
			var flags = re.IGNORECASE;
		};
		var pat = re.compile (regex, flags);
		var res = PosList ();
		for (var p of self) {
			var mo = re.match (pat, p.h);
			if (mo) {
				var pc = p.copy ();
				pc.mo = mo;
				res.append (pc);
			}
		}
		return res;
	});},
	get filter_b () {return __get__ (this, function (self, regex, flags) {
		if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
			var flags = re.IGNORECASE;
		};
		var pat = re.compile (regex, flags);
		var res = PosList ();
		for (var p of self) {
			var m = re.finditer (pat, p.b);
			var __left0__ = itertools.tee (m, 2);
			var t1 = __left0__ [0];
			var t2 = __left0__ [1];
			try {
				t1.__next__ ();
				var pc = p.copy ();
				pc.matchiter = t2;
				res.append (pc);
			}
			catch (__except0__) {
				if (isinstance (__except0__, StopIteration)) {
					// pass;
				}
				else {
					throw __except0__;
				}
			}
		}
		return res;
	});}
});
export var Poslist = PosList;
export var VNode =  __class__ ('VNode', [object], {
	__module__: __name__,
	clonedBit: 1,
	expandedBit: 4,
	markedBit: 8,
	selectedBit: 32,
	topBit: 64,
	richTextBit: 128,
	visitedBit: 256,
	dirtyBit: 512,
	writeBit: 1024,
	orphanBit: 2048,
	get __init__ () {return __get__ (this, function (self, context, gnx) {
		if (typeof gnx == 'undefined' || (gnx != null && gnx.hasOwnProperty ("__kwargtrans__"))) {;
			var gnx = null;
		};
		self._headString = 'newHeadline';
		self._bodyString = '';
		self.children = [];
		self.parents = [];
		self.fileIndex = null;
		self.iconVal = 0;
		self.statusBits = 0;
		self.context = context;
		self.expandedPositions = [];
		self.insertSpot = null;
		self.scrollBarSpot = null;
		self.selectionLength = 0;
		self.selectionStart = 0;
		g.app.nodeIndices.new_vnode_helper (context, gnx, self);
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return '<VNode {} {}>'.format (self.gnx, self.headString ());
	});},
	__str__: __repr__,
	get dumpLink () {return __get__ (this, function (self, link) {
		return (link ? link : '<none>');
	});},
	get dump () {return __get__ (this, function (self, label) {
		if (typeof label == 'undefined' || (label != null && label.hasOwnProperty ("__kwargtrans__"))) {;
			var label = '';
		};
		var v = self;
		var s = '-' * 10;
		print ('{} {} {}'.format (s, label, v));
		print ('len(parents): {}'.format (len (v.parents)));
		print ('len(children): {}'.format (len (v.children)));
		print ('parents: {}'.format (g.listToString (v.parents)));
		print ('children: {}'.format (g.listToString (v.children)));
	});},
	get findAtFileName () {return __get__ (this, function (self, names, h) {
		if (typeof h == 'undefined' || (h != null && h.hasOwnProperty ("__kwargtrans__"))) {;
			var h = '';
		};
		if (!(h)) {
			var h = self.headString ();
		}
		if (!(g.match (h, 0, '@'))) {
			return '';
		}
		var i = g.skip_id (h, 1, '-');
		var word = h.__getslice__ (0, i, 1);
		if (__in__ (word, names) && g.match_word (h, 0, word)) {
			var py_name = h.__getslice__ (i, null, 1).strip ();
			return py_name;
		}
		return '';
	});},
	get anyAtFileNodeName () {return __get__ (this, function (self) {
		return self.findAtFileName (g.app.atAutoNames) || self.findAtFileName (g.app.atFileNames);
	});},
	get atAutoNodeName () {return __get__ (this, function (self, h) {
		if (typeof h == 'undefined' || (h != null && h.hasOwnProperty ("__kwargtrans__"))) {;
			var h = null;
		};
		return self.findAtFileName (g.app.atAutoNames, __kwargtrans__ ({h: h}));
	});},
	get atAutoRstNodeName () {return __get__ (this, function (self, h) {
		if (typeof h == 'undefined' || (h != null && h.hasOwnProperty ("__kwargtrans__"))) {;
			var h = null;
		};
		var names = tuple (['@auto-rst']);
		return self.findAtFileName (names, __kwargtrans__ ({h: h}));
	});},
	get atCleanNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@clean']);
		return self.findAtFileName (names);
	});},
	get atEditNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@edit']);
		return self.findAtFileName (names);
	});},
	get atFileNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@file', '@thin']);
		return self.findAtFileName (names);
	});},
	get atNoSentinelsFileNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@nosent', '@file-nosent']);
		return self.findAtFileName (names);
	});},
	get atRstFileNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@rst']);
		return self.findAtFileName (names);
	});},
	get atShadowFileNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@shadow']);
		return self.findAtFileName (names);
	});},
	get atSilentFileNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@asis', '@file-asis']);
		return self.findAtFileName (names);
	});},
	get atThinFileNodeName () {return __get__ (this, function (self) {
		var names = tuple (['@thin', '@file-thin']);
		return self.findAtFileName (names);
	});},
	atNoSentFileNodeName: atNoSentinelsFileNodeName,
	atAsisFileNodeName: atSilentFileNodeName,
	get isAtAllNode () {return __get__ (this, function (self) {
		var __left0__ = g.is_special (self._bodyString, '@all');
		var flag = __left0__ [0];
		var i = __left0__ [1];
		return flag;
	});},
	get isAnyAtFileNode () {return __get__ (this, function (self) {
		var h = self.headString ();
		return h && h [0] == '@' && self.anyAtFileNodeName ();
	});},
	get isAtAutoNode () {return __get__ (this, function (self) {
		return bool (self.atAutoNodeName ());
	});},
	get isAtAutoRstNode () {return __get__ (this, function (self) {
		return bool (self.atAutoRstNodeName ());
	});},
	get isAtCleanNode () {return __get__ (this, function (self) {
		return bool (self.atCleanNodeName ());
	});},
	get isAtEditNode () {return __get__ (this, function (self) {
		return bool (self.atEditNodeName ());
	});},
	get isAtFileNode () {return __get__ (this, function (self) {
		return bool (self.atFileNodeName ());
	});},
	get isAtRstFileNode () {return __get__ (this, function (self) {
		return bool (self.atRstFileNodeName ());
	});},
	get isAtNoSentinelsFileNode () {return __get__ (this, function (self) {
		return bool (self.atNoSentinelsFileNodeName ());
	});},
	get isAtSilentFileNode () {return __get__ (this, function (self) {
		return bool (self.atSilentFileNodeName ());
	});},
	get isAtShadowFileNode () {return __get__ (this, function (self) {
		return bool (self.atShadowFileNodeName ());
	});},
	get isAtThinFileNode () {return __get__ (this, function (self) {
		return bool (self.atThinFileNodeName ());
	});},
	isAtNoSentFileNode: isAtNoSentinelsFileNode,
	isAtAsisFileNode: isAtSilentFileNode,
	get isAtIgnoreNode () {return __get__ (this, function (self) {
		if (g.match_word (self._headString, 0, '@ignore')) {
			return true;
		}
		var __left0__ = g.is_special (self._bodyString, '@ignore');
		var flag = __left0__ [0];
		var i = __left0__ [1];
		return flag;
	});},
	get isAtOthersNode () {return __get__ (this, function (self) {
		var __left0__ = g.is_special (self._bodyString, '@others');
		var flag = __left0__ [0];
		var i = __left0__ [1];
		return flag;
	});},
	get matchHeadline () {return __get__ (this, function (self, pattern) {
		var v = self;
		var h = g.toUnicode (v.headString ());
		var h = h.lower ().py_replace (' ', '').py_replace ('\t', '');
		var h = h.lstrip ('.');
		var pattern = g.toUnicode (pattern);
		var pattern = pattern.lower ().py_replace (' ', '').py_replace ('\t', '');
		return h.startswith (pattern);
	});},
	get copyTree () {return __get__ (this, function (self, copyMarked) {
		if (typeof copyMarked == 'undefined' || (copyMarked != null && copyMarked.hasOwnProperty ("__kwargtrans__"))) {;
			var copyMarked = false;
		};
		var v = self;
		var v2 = VNode (__kwargtrans__ ({context: v.context, gnx: null}));
		v2._headString = g.toUnicode (v._headString, __kwargtrans__ ({reportErrors: true}));
		v2._bodyString = g.toUnicode (v._bodyString, __kwargtrans__ ({reportErrors: true}));
		if (copyMarked && v.isMarked ()) {
			v2.setMarked ();
		}
		for (var child of v.children) {
			v2.children.append (child.copyTree (copyMarked));
		}
		return v2;
	});},
	body_unicode_warning: false,
	get bodyString () {return __get__ (this, function (self) {
		if (isinstance (self._bodyString, str)) {
			return self._bodyString;
		}
		if (!(self.body_unicode_warning)) {
			self.body_unicode_warning = true;
			g.internalError ('not unicode:', repr (self._bodyString), self._headString);
		}
		return g.toUnicode (self._bodyString);
	});},
	getBody: bodyString,
	get firstChild () {return __get__ (this, function (self) {
		var v = self;
		return v.children && v.children [0];
	});},
	get hasChildren () {return __get__ (this, function (self) {
		var v = self;
		return len (v.children) > 0;
	});},
	hasFirstChild: hasChildren,
	get lastChild () {return __get__ (this, function (self) {
		var v = self;
		return (v.children ? v.children [-(1)] : null);
	});},
	get nthChild () {return __get__ (this, function (self, n) {
		var v = self;
		if ((0 <= n && n < len (v.children))) {
			return v.children [n];
		}
		return null;
	});},
	get numberOfChildren () {return __get__ (this, function (self) {
		var v = self;
		return len (v.children);
	});},
	get directParents () {return __get__ (this, function (self) {
		var v = self;
		return v.parents;
	});},
	get hasBody () {return __get__ (this, function (self) {
		var s = self._bodyString;
		return s && len (s) > 0;
	});},
	head_unicode_warning: false,
	get headString () {return __get__ (this, function (self) {
		if (isinstance (self._headString, str)) {
			return self._headString;
		}
		if (!(self.head_unicode_warning)) {
			self.head_unicode_warning = true;
			g.internalError ('not a string', repr (self._headString));
		}
		return g.toUnicode (self._headString);
	});},
	get isNthChildOf () {return __get__ (this, function (self, n, parent_v) {
		var v = self;
		var children = parent_v && parent_v.children;
		return children && (0 <= n && n < len (children)) && children [n] == v;
	});},
	get isCloned () {return __get__ (this, function (self) {
		return len (self.parents) > 1;
	});},
	get isDirty () {return __get__ (this, function (self) {
		return (self.statusBits & self.dirtyBit) != 0;
	});},
	get isMarked () {return __get__ (this, function (self) {
		return (self.statusBits & VNode.markedBit) != 0;
	});},
	get isOrphan () {return __get__ (this, function (self) {
		return (self.statusBits & VNode.orphanBit) != 0;
	});},
	get isSelected () {return __get__ (this, function (self) {
		return (self.statusBits & VNode.selectedBit) != 0;
	});},
	get isTopBitSet () {return __get__ (this, function (self) {
		return (self.statusBits & self.topBit) != 0;
	});},
	get isVisited () {return __get__ (this, function (self) {
		return (self.statusBits & VNode.visitedBit) != 0;
	});},
	get isWriteBit () {return __get__ (this, function (self) {
		var v = self;
		return (v.statusBits & v.writeBit) != 0;
	});},
	get status () {return __get__ (this, function (self) {
		return self.statusBits;
	});},
	get clearDirty () {return __get__ (this, function (self) {
		var v = self;
		v.statusBits &= ~(v.dirtyBit);
	});},
	get setDirty () {return __get__ (this, function (self) {
		self.statusBits |= self.dirtyBit;
	});},
	get clearClonedBit () {return __get__ (this, function (self) {
		self.statusBits &= ~(self.clonedBit);
	});},
	get clearMarked () {return __get__ (this, function (self) {
		self.statusBits &= ~(self.markedBit);
	});},
	get clearWriteBit () {return __get__ (this, function (self) {
		self.statusBits &= ~(self.writeBit);
	});},
	get clearOrphan () {return __get__ (this, function (self) {
		self.statusBits &= ~(self.orphanBit);
	});},
	get clearVisited () {return __get__ (this, function (self) {
		self.statusBits &= ~(self.visitedBit);
	});},
	get contract () {return __get__ (this, function (self) {
		self.statusBits &= ~(self.expandedBit);
	});},
	get expand () {return __get__ (this, function (self) {
		self.statusBits |= self.expandedBit;
	});},
	get initExpandedBit () {return __get__ (this, function (self) {
		self.statusBits |= self.expandedBit;
	});},
	get isExpanded () {return __get__ (this, function (self) {
		return (self.statusBits & self.expandedBit) != 0;
	});},
	get initStatus () {return __get__ (this, function (self, status) {
		self.statusBits = status;
	});},
	get setClonedBit () {return __get__ (this, function (self) {
		self.statusBits |= self.clonedBit;
	});},
	get initClonedBit () {return __get__ (this, function (self, val) {
		if (val) {
			self.statusBits |= self.clonedBit;
		}
		else {
			self.statusBits &= ~(self.clonedBit);
		}
	});},
	get setMarked () {return __get__ (this, function (self) {
		self.statusBits |= self.markedBit;
	});},
	get initMarkedBit () {return __get__ (this, function (self) {
		self.statusBits |= self.markedBit;
	});},
	get setOrphan () {return __get__ (this, function (self) {
		self.statusBits |= self.orphanBit;
	});},
	get setSelected () {return __get__ (this, function (self) {
		self.statusBits |= self.selectedBit;
	});},
	get setVisited () {return __get__ (this, function (self) {
		self.statusBits |= self.visitedBit;
	});},
	get setWriteBit () {return __get__ (this, function (self) {
		self.statusBits |= self.writeBit;
	});},
	get childrenModified () {return __get__ (this, function (self) {
		g.childrenModifiedSet.add (self);
	});},
	get computeIcon () {return __get__ (this, function (self) {
		var val = 0;
		var v = self;
		if (v.hasBody ()) {
			val++;
		}
		if (v.isMarked ()) {
			val += 2;
		}
		if (v.isCloned ()) {
			val += 4;
		}
		if (v.isDirty ()) {
			val += 8;
		}
		return val;
	});},
	get setIcon () {return __get__ (this, function (self) {
		// pass;
	});},
	get contentModified () {return __get__ (this, function (self) {
		g.contentModifiedSet.add (self);
	});},
	get restoreCursorAndScroll () {return __get__ (this, function (self) {
		var traceTime = false && !(g.unitTesting);
		var v = self;
		var ins = v.insertSpot;
		var spot = v.scrollBarSpot;
		var body = self.context.frame.body;
		var w = body.wrapper;
		if (ins === null) {
			var ins = 0;
		}
		if (traceTime) {
			var t1 = time.time ();
		}
		if (hasattr (body.wrapper, 'setInsertPoint')) {
			w.setInsertPoint (ins);
		}
		if (traceTime) {
			var delta_t = time.time () - t1;
			if (delta_t > 0.1) {
				g.trace ('{} sec'.format (delta_t));
			}
		}
		if (spot !== null) {
			w.setYScrollPosition (spot);
			v.scrollBarSpot = spot;
		}
	});},
	get saveCursorAndScroll () {return __get__ (this, function (self) {
		var v = self;
		var c = v.context;
		var w = c.frame.body;
		if (!(w)) {
			return ;
		}
		try {
			v.scrollBarSpot = w.getYScrollPosition ();
			v.insertSpot = w.getInsertPoint ();
		}
		catch (__except0__) {
			if (isinstance (__except0__, AttributeError)) {
				// pass;
			}
			else {
				throw __except0__;
			}
		}
	});},
	unicode_warning_given: false,
	get setBodyString () {return __get__ (this, function (self, s) {
		var v = self;
		if (isinstance (s, str)) {
			v._bodyString = s;
			return ;
		}
		try {
			v._bodyString = g.toUnicode (s, __kwargtrans__ ({reportErrors: true}));
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				if (!(self.unicode_warning_given)) {
					self.unicode_warning_given = true;
					g.internalError (s);
					g.es_exception ();
				}
			}
			else {
				throw __except0__;
			}
		}
		self.contentModified ();
		signal_manager.emit (self.context, 'body_changed', self);
	});},
	get setHeadString () {return __get__ (this, function (self, s) {
		var v = self;
		if (g.isUnicode (s)) {
			v._headString = s.py_replace ('\n', '');
			return ;
		}
		var s = g.toUnicode (s, __kwargtrans__ ({reportErrors: true}));
		v._headString = s.py_replace ('\n', '');
		self.contentModified ();
	});},
	initBodyString: setBodyString,
	initHeadString: setHeadString,
	setHeadText: setHeadString,
	setTnodeText: setBodyString,
	get setSelection () {return __get__ (this, function (self, start, length) {
		var v = self;
		v.selectionStart = start;
		v.selectionLength = length;
	});},
	get setAllAncestorAtFileNodesDirty () {return __get__ (this, function (self) {
		var v = self;
		var hiddenRootVnode = v.context.hiddenRootNode;
		var v_and_parents = function* (v) {
			if (v != hiddenRootVnode) {
				yield v;
				for (var parent_v of v.parents) {
					yield* v_and_parents (parent_v);
				}
			}
			};
		for (var v2 of v_and_parents (v)) {
			if (v2.isAnyAtFileNode ()) {
				v2.setDirty ();
			}
		}
	});},
	get cloneAsNthChild () {return __get__ (this, function (self, parent_v, n) {
		var v = self;
		v._linkAsNthChild (parent_v, n);
		return v;
	});},
	get insertAsFirstChild () {return __get__ (this, function (self) {
		var v = self;
		return v.insertAsNthChild (0);
	});},
	get insertAsLastChild () {return __get__ (this, function (self) {
		var v = self;
		return v.insertAsNthChild (len (v.children));
	});},
	get insertAsNthChild () {return __get__ (this, function (self, n) {
		var v = self;
		var v2 = VNode (v.context);
		v2._linkAsNthChild (v, n);
		return v2;
	});},
	get _addCopiedLink () {return __get__ (this, function (self, childIndex, parent_v) {
		var v = self;
		v.context.frame.tree.generation++;
		parent_v.childrenModified ();
		parent_v.children.insert (childIndex, v);
		v.parents.append (parent_v);
		v._p_changed = 1;
		parent_v._p_changed = 1;
	});},
	get _addLink () {return __get__ (this, function (self, childIndex, parent_v) {
		var v = self;
		v.context.frame.tree.generation++;
		parent_v.childrenModified ();
		parent_v.children.insert (childIndex, v);
		v.parents.append (parent_v);
		v._p_changed = 1;
		parent_v._p_changed = 1;
		if (len (v.parents) == 1) {
			for (var child of v.children) {
				child._addParentLinks (__kwargtrans__ ({parent: v}));
			}
		}
	});},
	get _addParentLinks () {return __get__ (this, function (self, parent) {
		var v = self;
		v.parents.append (parent);
		if (len (v.parents) == 1) {
			for (var child of v.children) {
				child._addParentLinks (__kwargtrans__ ({parent: v}));
			}
		}
	});},
	get _cutLink () {return __get__ (this, function (self, childIndex, parent_v) {
		var v = self;
		v.context.frame.tree.generation++;
		parent_v.childrenModified ();
		delete parent_v.children [childIndex];
		if (__in__ (parent_v, v.parents)) {
			try {
				v.parents.remove (parent_v);
			}
			catch (__except0__) {
				if (isinstance (__except0__, ValueError)) {
					g.internalError ('{} not in parents of {}'.format (parent_v, v));
					g.trace ('v.parents:');
					g.printObj (v.parents);
				}
				else {
					throw __except0__;
				}
			}
		}
		v._p_changed = 1;
		parent_v._p_changed = 1;
		if (!(v.parents)) {
			for (var child of v.children) {
				child._cutParentLinks (__kwargtrans__ ({parent: v}));
			}
		}
	});},
	get _cutParentLinks () {return __get__ (this, function (self, parent) {
		var v = self;
		v.parents.remove (parent);
		if (!(v.parents)) {
			for (var child of v.children) {
				child._cutParentLinks (__kwargtrans__ ({parent: v}));
			}
		}
	});},
	get _deleteAllChildren () {return __get__ (this, function (self) {
		var v = self;
		for (var v2 of v.children) {
			try {
				v2.parents.remove (v);
			}
			catch (__except0__) {
				if (isinstance (__except0__, ValueError)) {
					g.internalError ('{} not in parents of {}'.format (v, v2));
					g.trace ('v2.parents:');
					g.printObj (v2.parents);
				}
				else {
					throw __except0__;
				}
			}
		}
		v.children = [];
	});},
	get _linkAsNthChild () {return __get__ (this, function (self, parent_v, n) {
		var v = self;
		v._addLink (n, parent_v);
	});},
	get __get_b () {return __get__ (this, function (self) {
		var v = self;
		return v.bodyString ();
	});},
	get __set_b () {return __get__ (this, function (self, val) {
		var v = self;
		v.setBodyString (val);
	});},
	get __get_h () {return __get__ (this, function (self) {
		var v = self;
		return v.headString ();
	});},
	get __set_h () {return __get__ (this, function (self, val) {
		var v = self;
		v.setHeadString (val);
	});},
	get __get_u () {return __get__ (this, function (self) {
		var v = self;
		if (!(hasattr (v, 'unknownAttributes'))) {
			v.unknownAttributes = dict ({});
		}
		return v.unknownAttributes;
	});},
	get __set_u () {return __get__ (this, function (self, val) {
		var v = self;
		if (val === null) {
			if (hasattr (v, 'unknownAttributes')) {
				delattr (v, 'unknownAttributes');
			}
		}
		else if (isinstance (val, dict)) {
			v.unknownAttributes = val;
		}
		else {
			var __except0__ = ValueError;
			__except0__.__cause__ = null;
			throw __except0__;
		}
	});},
	get __get_gnx () {return __get__ (this, function (self) {
		var v = self;
		return v.fileIndex;
	});}
});
Object.defineProperty (VNode, 'b', property.call (VNode, VNode.__get_b, VNode.__set_b));
Object.defineProperty (VNode, 'h', property.call (VNode, VNode.__get_h, VNode.__set_h));
Object.defineProperty (VNode, 'u', property.call (VNode, VNode.__get_u, VNode.__set_u));
Object.defineProperty (VNode, 'gnx', property.call (VNode, VNode.__get_gnx));
export var vnode = VNode;

//# sourceMappingURL=leo.core.leoNodes.map