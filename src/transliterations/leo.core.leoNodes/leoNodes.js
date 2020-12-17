/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 06:09:25
/* 000013 */ var itertools = {};
/* 000013 */ var re = {};
/* 000013 */ var time = {};
/* 000013 */ import {} from './org.transcrypt.__runtime__.js';
/* 000017 */ import {signal_manager as sig} from './leo.core.js';
/* 000016 */ import {leoGlobals as g} from './leo.core.js';
/* 000015 */ import * as __module_re__ from './re.js';
/* 000015 */ __nest__ (re, '', __module_re__);
/* 000014 */ import * as __module_time__ from './time.js';
/* 000014 */ __nest__ (time, '', __module_time__);
/* 000013 */ import * as __module_itertools__ from './itertools.js';
/* 000013 */ __nest__ (itertools, '', __module_itertools__);
/* 000001 */ var __name__ = '__main__';
/* 000021 */ export var NodeIndices =  __class__ ('NodeIndices', [object], {
/* 000021 */ 	__module__: __name__,
/* 000025 */ 	get __init__ () {return __get__ (this, function (self, id_) {
/* 000027 */ 		self.defaultId = id_;
/* 000028 */ 		self.lastIndex = 0;
/* 000029 */ 		self.stack = [];
/* 000031 */ 		self.timeString = '';
/* 000033 */ 		self.userId = id_;
/* 000035 */ 		self.setTimeStamp ();
/* 000035 */ 	});},
/* 000037 */ 	get check_gnx () {return __get__ (this, function (self, c, gnx, v) {
/* 000039 */ 		var fc = c.fileCommands;
/* 000040 */ 		if (gnx == 'hidden-root-vnode-gnx') {
/* 000043 */ 			return ;
/* 000043 */ 		}
/* 000044 */ 		var v2 = fc.gnxDict.py_get (gnx);
/* 000045 */ 		if (v2 && v2 != v) {
/* 000046 */ 			g.internalError ('getNewIndex: gnx clash {}\n          v: {}\n         v2: {}'.format (gnx, v, v2));
/* 000046 */ 		}
/* 000046 */ 	});},
/* 000051 */ 	get compute_last_index () {return __get__ (this, function (self, c) {
/* 000053 */ 		var ni = self;
/* 000057 */ 		for (var v of c.all_unique_nodes ()) {
/* 000058 */ 			var gnx = v.fileIndex;
/* 000059 */ 			if (gnx) {
/* 000060 */ 				var __left0__ = self.scanGnx (gnx);
/* 000060 */ 				var id_ = __left0__ [0];
/* 000060 */ 				var t = __left0__ [1];
/* 000060 */ 				var n = __left0__ [2];
/* 000061 */ 				if (t == ni.timeString && n !== null) {
/* 000062 */ 					try {
/* 000063 */ 						var n = int (n);
/* 000064 */ 						self.lastIndex = max (self.lastIndex, n);
/* 000064 */ 					}
/* 000064 */ 					catch (__except0__) {
/* 000064 */ 						if (isinstance (__except0__, Exception)) {
/* 000066 */ 							g.es_exception ();
/* 000066 */ 							self.lastIndex++;
/* 000066 */ 						}
/* 000066 */ 						else {
/* 000066 */ 							throw __except0__;
/* 000066 */ 						}
/* 000066 */ 					}
/* 000066 */ 				}
/* 000066 */ 			}
/* 000066 */ 		}
/* 000066 */ 	});},
/* 000069 */ 	get computeNewIndex () {return __get__ (this, function (self) {
/* 000071 */ 		var t_s = self.py_update ();
/* 000073 */ 		var gnx = g.toUnicode ('{}.{}.{}'.format (self.userId, t_s, self.lastIndex));
/* 000074 */ 		return gnx;
/* 000074 */ 	});},
/* 000078 */ 	get getDefaultId () {return __get__ (this, function (self) {
/* 000080 */ 		return self.defaultId;
/* 000080 */ 	});},
/* 000082 */ 	get setDefaultId () {return __get__ (this, function (self, theId) {
/* 000084 */ 		self.defaultId = theId;
/* 000084 */ 	});},
/* 000086 */ 	get getNewIndex () {return __get__ (this, function (self, v, cached) {
/* 000086 */ 		if (typeof cached == 'undefined' || (cached != null && cached.hasOwnProperty ("__kwargtrans__"))) {;
/* 000086 */ 			var cached = false;
/* 000086 */ 		};
/* 000091 */ 		if (v === null) {
/* 000092 */ 			g.internalError ('getNewIndex: v is None');
/* 000093 */ 			return '';
/* 000093 */ 		}
/* 000094 */ 		var c = v.context;
/* 000095 */ 		var fc = c.fileCommands;
/* 000096 */ 		var t_s = self.py_update ();
/* 000098 */ 		var gnx = g.toUnicode ('{}.{}.{}'.format (self.userId, t_s, self.lastIndex));
/* 000099 */ 		v.fileIndex = gnx;
/* 000100 */ 		self.check_gnx (c, gnx, v);
/* 000101 */ 		fc.gnxDict [gnx] = v;
/* 000102 */ 		return gnx;
/* 000102 */ 	});},
/* 000104 */ 	get new_vnode_helper () {return __get__ (this, function (self, c, gnx, v) {
/* 000106 */ 		var ni = self;
/* 000107 */ 		if (gnx) {
/* 000108 */ 			v.fileIndex = gnx;
/* 000109 */ 			ni.check_gnx (c, gnx, v);
/* 000110 */ 			c.fileCommands.gnxDict [gnx] = v;
/* 000110 */ 		}
/* 000111 */ 		else {
/* 000112 */ 			v.fileIndex = ni.getNewIndex (v);
/* 000112 */ 		}
/* 000112 */ 	});},
/* 000114 */ 	get scanGnx () {return __get__ (this, function (self, s, i) {
/* 000114 */ 		if (typeof i == 'undefined' || (i != null && i.hasOwnProperty ("__kwargtrans__"))) {;
/* 000114 */ 			var i = 0;
/* 000114 */ 		};
/* 000116 */ 		if (!(isinstance (s, str))) {
/* 000117 */ 			g.error ('scanGnx: unexpected index type:', py_typeof (s), '', s);
/* 000118 */ 			return tuple ([null, null, null]);
/* 000118 */ 		}
/* 000119 */ 		var s = s.strip ();
/* 000120 */ 		var __left0__ = tuple ([null, null, null]);
/* 000120 */ 		var theId = __left0__ [0];
/* 000120 */ 		var t = __left0__ [1];
/* 000120 */ 		var n = __left0__ [2];
/* 000121 */ 		var __left0__ = g.skip_to_char (s, i, '.');
/* 000121 */ 		var i = __left0__ [0];
/* 000121 */ 		var theId = __left0__ [1];
/* 000122 */ 		if (g.match (s, i, '.')) {
/* 000123 */ 			var __left0__ = g.skip_to_char (s, i + 1, '.');
/* 000123 */ 			var i = __left0__ [0];
/* 000123 */ 			var t = __left0__ [1];
/* 000124 */ 			if (g.match (s, i, '.')) {
/* 000125 */ 				var __left0__ = g.skip_to_char (s, i + 1, '.');
/* 000125 */ 				var i = __left0__ [0];
/* 000125 */ 				var n = __left0__ [1];
/* 000125 */ 			}
/* 000125 */ 		}
/* 000127 */ 		if (!(theId)) {
/* 000128 */ 			var theId = self.defaultId;
/* 000128 */ 		}
/* 000129 */ 		return tuple ([theId, t, n]);
/* 000129 */ 	});},
/* 000131 */ 	get setTimestamp () {return __get__ (this, function (self) {
/* 000135 */ 		self.timeString = time.strftime ('%Y%m%d%H%M%S', time.localtime ());
/* 000135 */ 	});},
/* 000137 */ 	setTimeStamp: setTimestamp,
/* 000139 */ 	get tupleToString () {return __get__ (this, function (self, aTuple) {
/* 000144 */ 		var __left0__ = aTuple;
/* 000144 */ 		var theId = __left0__ [0];
/* 000144 */ 		var t = __left0__ [1];
/* 000144 */ 		var n = __left0__ [2];
/* 000147 */ 		if (__in__ (n, tuple ([null, 0, '']))) {
/* 000148 */ 			var s = '{}.{}'.format (theId, t);
/* 000148 */ 		}
/* 000149 */ 		else {
/* 000150 */ 			var s = '{}.{}.{}'.format (theId, t, n);
/* 000150 */ 		}
/* 000151 */ 		return g.toUnicode (s);
/* 000151 */ 	});},
/* 000153 */ 	get py_update () {return __get__ (this, function (self) {
/* 000155 */ 		var t_s = time.strftime ('%Y%m%d%H%M%S', time.localtime ());
/* 000156 */ 		if (self.timeString == t_s) {
/* 000156 */ 			self.lastIndex++;
/* 000156 */ 		}
/* 000158 */ 		else {
/* 000159 */ 			self.lastIndex = 1;
/* 000160 */ 			self.timeString = t_s;
/* 000160 */ 		}
/* 000161 */ 		return t_s;
/* 000161 */ 	});},
/* 000163 */ 	get updateLastIndex () {return __get__ (this, function (self, gnx) {
/* 000165 */ 		var __left0__ = self.scanGnx (gnx);
/* 000165 */ 		var id_ = __left0__ [0];
/* 000165 */ 		var t = __left0__ [1];
/* 000165 */ 		var n = __left0__ [2];
/* 000168 */ 		if (!(id_) || n != 0 && !(n)) {
/* 000169 */ 			return ;
/* 000169 */ 		}
/* 000170 */ 		if (id_ == self.userId && t == self.timeString) {
/* 000171 */ 			try {
/* 000172 */ 				var n = int (n);
/* 000173 */ 				if (n > self.lastIndex) {
/* 000174 */ 					self.lastIndex = n;
/* 000175 */ 					g.trace (gnx, '-->', n);
/* 000175 */ 				}
/* 000175 */ 			}
/* 000175 */ 			catch (__except0__) {
/* 000175 */ 				if (isinstance (__except0__, Exception)) {
/* 000177 */ 					g.trace ('can not happen', repr (n));
/* 000177 */ 				}
/* 000177 */ 				else {
/* 000177 */ 					throw __except0__;
/* 000177 */ 				}
/* 000177 */ 			}
/* 000177 */ 		}
/* 000177 */ 	});}
/* 000177 */ });
/* 000198 */ export var Position =  __class__ ('Position', [object], {
/* 000198 */ 	__module__: __name__,
/* 000202 */ 	get __init__ () {return __get__ (this, function (self, v, childIndex, stack) {
/* 000202 */ 		if (typeof childIndex == 'undefined' || (childIndex != null && childIndex.hasOwnProperty ("__kwargtrans__"))) {;
/* 000202 */ 			var childIndex = 0;
/* 000202 */ 		};
/* 000202 */ 		if (typeof stack == 'undefined' || (stack != null && stack.hasOwnProperty ("__kwargtrans__"))) {;
/* 000202 */ 			var stack = null;
/* 000202 */ 		};
/* 000206 */ 		self._childIndex = childIndex;
/* 000207 */ 		self.v = v;
/* 000209 */ 		if (stack) {
/* 000210 */ 			self.stack = stack.__getslice__ (0, null, 1);
/* 000210 */ 		}
/* 000211 */ 		else {
/* 000212 */ 			self.stack = [];
/* 000212 */ 		}
/* 000212 */ 		g.app.positions++;
/* 000212 */ 	});},
/* 000215 */ 	get __eq__ () {return __get__ (this, function (self, p2) {
/* 000217 */ 		var p1 = self;
/* 000219 */ 		if (!(isinstance (p2, Position))) {
/* 000220 */ 			return false;
/* 000220 */ 		}
/* 000221 */ 		if (p2 === null || p2.v === null) {
/* 000222 */ 			return p1.v === null;
/* 000222 */ 		}
/* 000223 */ 		return p1.v == p2.v && p1._childIndex == p2._childIndex && p1.stack == p2.stack;
/* 000223 */ 	});},
/* 000227 */ 	get __ne__ () {return __get__ (this, function (self, p2) {
/* 000229 */ 		return !(self.__eq__ (p2));
/* 000229 */ 	});},
/* 000231 */ 	get __ge__ () {return __get__ (this, function (self, other) {
/* 000232 */ 		return self.__eq__ (other) || self.__gt__ (other);
/* 000232 */ 	});},
/* 000234 */ 	get __le__ () {return __get__ (this, function (self, other) {
/* 000235 */ 		return self.__eq__ (other) || self.__lt__ (other);
/* 000235 */ 	});},
/* 000237 */ 	get __lt__ () {return __get__ (this, function (self, other) {
/* 000238 */ 		return !(self.__eq__ (other)) && !(self.__gt__ (other));
/* 000238 */ 	});},
/* 000240 */ 	get __gt__ () {return __get__ (this, function (self, other) {
/* 000242 */ 		var __left0__ = tuple ([self.stack, other.stack]);
/* 000242 */ 		var stack1 = __left0__ [0];
/* 000242 */ 		var stack2 = __left0__ [1];
/* 000243 */ 		var __left0__ = tuple ([len (stack1), len (stack2)]);
/* 000243 */ 		var n1 = __left0__ [0];
/* 000243 */ 		var n2 = __left0__ [1];
/* 000243 */ 		var n = min (n1, n2);
/* 000245 */ 		for (var [item1, item2] of zip (stack1, stack2)) {
/* 000246 */ 			var __left0__ = item1;
/* 000246 */ 			var v1 = __left0__ [0];
/* 000246 */ 			var x1 = __left0__ [1];
/* 000246 */ 			var __left0__ = item2;
/* 000246 */ 			var v2 = __left0__ [0];
/* 000246 */ 			var x2 = __left0__ [1];
/* 000247 */ 			if (x1 > x2) {
/* 000248 */ 				return true;
/* 000248 */ 			}
/* 000249 */ 			if (x1 < x2) {
/* 000250 */ 				return false;
/* 000250 */ 			}
/* 000250 */ 		}
/* 000252 */ 		if (n1 == n2) {
/* 000253 */ 			var __left0__ = tuple ([self._childIndex, other._childIndex]);
/* 000253 */ 			var x1 = __left0__ [0];
/* 000253 */ 			var x2 = __left0__ [1];
/* 000254 */ 			return x1 > x2;
/* 000254 */ 		}
/* 000255 */ 		if (n1 < n2) {
/* 000256 */ 			var x1 = self._childIndex;
/* 000256 */ 			var __left0__ = other.stack [n];
/* 000256 */ 			var v2 = __left0__ [0];
/* 000256 */ 			var x2 = __left0__ [1];
/* 000257 */ 			return x1 > x2;
/* 000257 */ 		}
/* 000260 */ 		var x1 = other._childIndex;
/* 000260 */ 		var __left0__ = self.stack [n];
/* 000260 */ 		var v2 = __left0__ [0];
/* 000260 */ 		var x2 = __left0__ [1];
/* 000261 */ 		return x2 >= x1;
/* 000261 */ 	});},
/* 000263 */ 	get __bool__ () {return __get__ (this, function (self) {
/* 000272 */ 		return self.v !== null;
/* 000272 */ 	});},
/* 000274 */ 	get __str__ () {return __get__ (this, function (self) {
/* 000275 */ 		var p = self;
/* 000276 */ 		if (p.v) {
/* 000278 */ 			return '<pos {} childIndex: {} lvl: {} key: {} {}>'.format (id (p), p._childIndex, p.level (), p.key (), p.h);
/* 000278 */ 		}
/* 000286 */ 		return '<pos {} [{}] None>'.format (id (p), len (p.stack));
/* 000286 */ 	});},
/* 000288 */ 	__repr__: __str__,
/* 000290 */ 	get archivedPosition () {return __get__ (this, function (self, root_p) {
/* 000290 */ 		if (typeof root_p == 'undefined' || (root_p != null && root_p.hasOwnProperty ("__kwargtrans__"))) {;
/* 000290 */ 			var root_p = null;
/* 000290 */ 		};
/* 000292 */ 		var p = self;
/* 000293 */ 		if (root_p === null) {
/* 000294 */ 			var aList = (function () {
/* 000294 */ 				var __accu0__ = [];
/* 000294 */ 				for (var z of p.self_and_parents ()) {
/* 000294 */ 					__accu0__.append (z._childIndex);
/* 000294 */ 				}
/* 000294 */ 				return __accu0__;
/* 000294 */ 			}) ();
/* 000294 */ 		}
/* 000295 */ 		else {
/* 000296 */ 			var aList = [];
/* 000297 */ 			for (var z of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 000298 */ 				if (z == root_p) {
/* 000299 */ 					aList.append (0);
/* 000299 */ 					break;
/* 000299 */ 				}
/* 000301 */ 				else {
/* 000302 */ 					aList.append (z._childIndex);
/* 000302 */ 				}
/* 000302 */ 			}
/* 000302 */ 		}
/* 000303 */ 		aList.reverse ();
/* 000304 */ 		return aList;
/* 000304 */ 	});},
/* 000306 */ 	get dumpLink () {return __get__ (this, function (self, link) {
/* 000307 */ 		return (link ? link : '<none>');
/* 000307 */ 	});},
/* 000309 */ 	get dump () {return __get__ (this, function (self, label) {
/* 000309 */ 		if (typeof label == 'undefined' || (label != null && label.hasOwnProperty ("__kwargtrans__"))) {;
/* 000309 */ 			var label = '';
/* 000309 */ 		};
/* 000310 */ 		var p = self;
/* 000311 */ 		if (p.v) {
/* 000312 */ 			p.v.dump ();
/* 000312 */ 		}
/* 000312 */ 	});},
/* 000314 */ 	get key () {return __get__ (this, function (self) {
/* 000315 */ 		var p = self;
/* 000318 */ 		var result = [];
/* 000319 */ 		for (var z of p.stack) {
/* 000320 */ 			var __left0__ = z;
/* 000320 */ 			var v = __left0__ [0];
/* 000320 */ 			var childIndex = __left0__ [1];
/* 000321 */ 			result.append ('{}:{}'.format (id (v), childIndex));
/* 000321 */ 		}
/* 000322 */ 		result.append ('{}:{}'.format (id (p.v), p._childIndex));
/* 000323 */ 		return '.'.join (result);
/* 000323 */ 	});},
/* 000325 */ 	get sort_key () {return __get__ (this, function (self, p) {
/* 000326 */ 		return (function () {
/* 000326 */ 			var __accu0__ = [];
/* 000326 */ 			for (var s of p.key ().py_split ('.')) {
/* 000326 */ 				__accu0__.append (int (s.py_split (':') [1]));
/* 000326 */ 			}
/* 000326 */ 			return __accu0__;
/* 000326 */ 		}) ();
/* 000326 */ 	});},
/* 000337 */ 	__hash__: null,
/* 000343 */ 	get convertTreeToString () {return __get__ (this, function (self) {
/* 000345 */ 		var p = self;
/* 000345 */ 		var level1 = p.level ();
/* 000346 */ 		var array = [];
/* 000347 */ 		for (var p of p.self_and_subtree (__kwargtrans__ ({copy: false}))) {
/* 000348 */ 			array.append (p.moreHead (level1) + '\n');
/* 000349 */ 			var body = p.moreBody ();
/* 000350 */ 			if (body) {
/* 000351 */ 				array.append (body + '\n');
/* 000351 */ 			}
/* 000351 */ 		}
/* 000352 */ 		return ''.join (array);
/* 000352 */ 	});},
/* 000354 */ 	get moreHead () {return __get__ (this, function (self, firstLevel, useVerticalBar) {
/* 000354 */ 		if (typeof useVerticalBar == 'undefined' || (useVerticalBar != null && useVerticalBar.hasOwnProperty ("__kwargtrans__"))) {;
/* 000354 */ 			var useVerticalBar = false;
/* 000354 */ 		};
/* 000357 */ 		var p = self;
/* 000358 */ 		var level = self.level () - firstLevel;
/* 000359 */ 		var plusMinus = (p.hasChildren () ? '+' : '-');
/* 000360 */ 		var pad = '\t' * level;
/* 000361 */ 		return '{}{} {}'.format (pad, plusMinus, p.h);
/* 000361 */ 	});},
/* 000375 */ 	get moreBody () {return __get__ (this, function (self) {
/* 000379 */ 		var p = self;
/* 000379 */ 		var array = [];
/* 000380 */ 		var lines = p.b.py_split ('\n');
/* 000381 */ 		for (var s of lines) {
/* 000382 */ 			var i = g.skip_ws (s, 0);
/* 000383 */ 			if (i < len (s) && __in__ (s [i], tuple (['+', '-', '\\']))) {
/* 000384 */ 				var s = (s.__getslice__ (0, i, 1) + '\\') + s.__getslice__ (i, null, 1);
/* 000384 */ 			}
/* 000385 */ 			array.append (s);
/* 000385 */ 		}
/* 000386 */ 		return '\n'.join (array);
/* 000386 */ 	});},
/* 000389 */ 	get children () {return __get__ (this, function* (self, copy) {
/* 000389 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000389 */ 			var copy = true;
/* 000389 */ 		};
/* 000391 */ 		var p = self;
/* 000392 */ 		var p = p.firstChild ();
/* 000393 */ 		while (p) {
/* 000394 */ 			yield (copy ? p.copy () : p);
/* 000395 */ 			p.moveToNext ();
/* 000395 */ 		}
/* 000395 */ 		});},
/* 000399 */ 	children_iter: children,
/* 000401 */ 	get following_siblings () {return __get__ (this, function* (self, copy) {
/* 000401 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000401 */ 			var copy = true;
/* 000401 */ 		};
/* 000403 */ 		var p = self;
/* 000404 */ 		var p = p.py_next ();
/* 000405 */ 		while (p) {
/* 000406 */ 			yield (copy ? p.copy () : p);
/* 000407 */ 			p.moveToNext ();
/* 000407 */ 		}
/* 000407 */ 		});},
/* 000411 */ 	following_siblings_iter: following_siblings,
/* 000413 */ 	get nearest_roots () {return __get__ (this, function* (self, copy, predicate) {
/* 000413 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000413 */ 			var copy = true;
/* 000413 */ 		};
/* 000413 */ 		if (typeof predicate == 'undefined' || (predicate != null && predicate.hasOwnProperty ("__kwargtrans__"))) {;
/* 000413 */ 			var predicate = null;
/* 000413 */ 		};
/* 000425 */ 		if (predicate === null) {
/* 000429 */ 			var predicate = function (p) {
/* 000430 */ 				return p.isAnyAtFileNode ();
/* 000430 */ 			};
/* 000430 */ 		}
/* 000434 */ 		var p1 = self;
/* 000435 */ 		for (var p of p1.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 000436 */ 			if (predicate (p)) {
/* 000437 */ 				yield (copy ? p.copy () : p);
/* 000438 */ 				return ;
/* 000438 */ 			}
/* 000438 */ 		}
/* 000440 */ 		var after = p1.nodeAfterTree ();
/* 000441 */ 		var p = p1;
/* 000442 */ 		while (p && p != after) {
/* 000443 */ 			if (predicate (p)) {
/* 000444 */ 				yield (copy ? p.copy () : p);
/* 000445 */ 				p.moveToNodeAfterTree ();
/* 000445 */ 			}
/* 000446 */ 			else {
/* 000447 */ 				p.moveToThreadNext ();
/* 000447 */ 			}
/* 000447 */ 		}
/* 000447 */ 		});},
/* 000449 */ 	get nearest_unique_roots () {return __get__ (this, function* (self, copy, predicate) {
/* 000449 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000449 */ 			var copy = true;
/* 000449 */ 		};
/* 000449 */ 		if (typeof predicate == 'undefined' || (predicate != null && predicate.hasOwnProperty ("__kwargtrans__"))) {;
/* 000449 */ 			var predicate = null;
/* 000449 */ 		};
/* 000462 */ 		if (predicate === null) {
/* 000466 */ 			var predicate = function (p) {
/* 000467 */ 				return p.isAnyAtFileNode ();
/* 000467 */ 			};
/* 000467 */ 		}
/* 000471 */ 		var p1 = self;
/* 000472 */ 		for (var p of p1.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 000473 */ 			if (predicate (p)) {
/* 000474 */ 				yield (copy ? p.copy () : p);
/* 000475 */ 				return ;
/* 000475 */ 			}
/* 000475 */ 		}
/* 000477 */ 		var seen = set ();
/* 000478 */ 		var after = p1.nodeAfterTree ();
/* 000479 */ 		var p = p1;
/* 000480 */ 		while (p && p != after) {
/* 000481 */ 			if (predicate (p)) {
/* 000482 */ 				if (!__in__ (p.v, seen)) {
/* 000483 */ 					seen.add (p.v);
/* 000484 */ 					yield (copy ? p.copy () : p);
/* 000484 */ 				}
/* 000485 */ 				p.moveToNodeAfterTree ();
/* 000485 */ 			}
/* 000486 */ 			else {
/* 000487 */ 				p.moveToThreadNext ();
/* 000487 */ 			}
/* 000487 */ 		}
/* 000487 */ 		});},
/* 000489 */ 	nearest: nearest_unique_roots,
/* 000491 */ 	get nodes () {return __get__ (this, function* (self) {
/* 000493 */ 		var p = self;
/* 000494 */ 		var p = p.copy ();
/* 000495 */ 		var after = p.nodeAfterTree ();
/* 000496 */ 		while (p && p != after) {
/* 000496 */ 			yield p.v;
/* 000498 */ 			p.moveToThreadNext ();
/* 000498 */ 		}
/* 000498 */ 		});},
/* 000502 */ 	tnodes_iter: nodes,
/* 000503 */ 	vnodes_iter: nodes,
/* 000505 */ 	get parents () {return __get__ (this, function* (self, copy) {
/* 000505 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000505 */ 			var copy = true;
/* 000505 */ 		};
/* 000507 */ 		var p = self;
/* 000508 */ 		var p = p.parent ();
/* 000509 */ 		while (p) {
/* 000510 */ 			yield (copy ? p.copy () : p);
/* 000511 */ 			p.moveToParent ();
/* 000511 */ 		}
/* 000511 */ 		});},
/* 000515 */ 	parents_iter: parents,
/* 000517 */ 	get self_and_parents () {return __get__ (this, function* (self, copy) {
/* 000517 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000517 */ 			var copy = true;
/* 000517 */ 		};
/* 000519 */ 		var p = self;
/* 000520 */ 		var p = p.copy ();
/* 000521 */ 		while (p) {
/* 000522 */ 			yield (copy ? p.copy () : p);
/* 000523 */ 			p.moveToParent ();
/* 000523 */ 		}
/* 000523 */ 		});},
/* 000527 */ 	self_and_parents_iter: self_and_parents,
/* 000529 */ 	get self_and_siblings () {return __get__ (this, function* (self, copy) {
/* 000529 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000529 */ 			var copy = true;
/* 000529 */ 		};
/* 000531 */ 		var p = self;
/* 000532 */ 		var p = p.copy ();
/* 000533 */ 		while (p.hasBack ()) {
/* 000534 */ 			p.moveToBack ();
/* 000534 */ 		}
/* 000535 */ 		while (p) {
/* 000536 */ 			yield (copy ? p.copy () : p);
/* 000537 */ 			p.moveToNext ();
/* 000537 */ 		}
/* 000537 */ 		});},
/* 000541 */ 	self_and_siblings_iter: self_and_siblings,
/* 000543 */ 	get self_and_subtree () {return __get__ (this, function* (self, copy) {
/* 000543 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000543 */ 			var copy = true;
/* 000543 */ 		};
/* 000545 */ 		var p = self;
/* 000546 */ 		var p = p.copy ();
/* 000547 */ 		var after = p.nodeAfterTree ();
/* 000548 */ 		while (p && p != after) {
/* 000549 */ 			yield (copy ? p.copy () : p);
/* 000550 */ 			p.moveToThreadNext ();
/* 000550 */ 		}
/* 000550 */ 		});},
/* 000554 */ 	self_and_subtree_iter: self_and_subtree,
/* 000556 */ 	get subtree () {return __get__ (this, function* (self, copy) {
/* 000556 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000556 */ 			var copy = true;
/* 000556 */ 		};
/* 000558 */ 		var p = self;
/* 000559 */ 		var p = p.copy ();
/* 000560 */ 		var after = p.nodeAfterTree ();
/* 000561 */ 		p.moveToThreadNext ();
/* 000562 */ 		while (p && p != after) {
/* 000563 */ 			yield (copy ? p.copy () : p);
/* 000564 */ 			p.moveToThreadNext ();
/* 000564 */ 		}
/* 000564 */ 		});},
/* 000568 */ 	subtree_iter: subtree,
/* 000570 */ 	get unique_nodes () {return __get__ (this, function* (self) {
/* 000572 */ 		var p = self;
/* 000573 */ 		var seen = set ();
/* 000574 */ 		for (var p of p.self_and_subtree (__kwargtrans__ ({copy: false}))) {
/* 000575 */ 			if (!__in__ (p.v, seen)) {
/* 000576 */ 				seen.add (p.v);
/* 000576 */ 				yield p.v;
/* 000576 */ 			}
/* 000576 */ 		}
/* 000576 */ 		});},
/* 000581 */ 	unique_tnodes_iter: unique_nodes,
/* 000582 */ 	unique_vnodes_iter: unique_nodes,
/* 000584 */ 	get unique_subtree () {return __get__ (this, function* (self, copy) {
/* 000584 */ 		if (typeof copy == 'undefined' || (copy != null && copy.hasOwnProperty ("__kwargtrans__"))) {;
/* 000584 */ 			var copy = true;
/* 000584 */ 		};
/* 000586 */ 		var p = self;
/* 000587 */ 		var seen = set ();
/* 000588 */ 		for (var p of p.subtree ()) {
/* 000589 */ 			if (!__in__ (p.v, seen)) {
/* 000590 */ 				seen.add (p.v);
/* 000592 */ 				yield (copy ? p.copy () : p);
/* 000592 */ 			}
/* 000592 */ 		}
/* 000592 */ 		});},
/* 000596 */ 	subtree_with_unique_tnodes_iter: unique_subtree,
/* 000597 */ 	subtree_with_unique_vnodes_iter: unique_subtree,
/* 000601 */ 	get anyAtFileNodeName () {return __get__ (this, function (self) {
/* 000601 */ 		return self.v.anyAtFileNodeName ();
/* 000601 */ 	});},
/* 000603 */ 	get atAutoNodeName () {return __get__ (this, function (self) {
/* 000603 */ 		return self.v.atAutoNodeName ();
/* 000603 */ 	});},
/* 000605 */ 	get atCleanNodeName () {return __get__ (this, function (self) {
/* 000605 */ 		return self.v.atCleanNodeName ();
/* 000605 */ 	});},
/* 000607 */ 	get atEditNodeName () {return __get__ (this, function (self) {
/* 000607 */ 		return self.v.atEditNodeName ();
/* 000607 */ 	});},
/* 000609 */ 	get atFileNodeName () {return __get__ (this, function (self) {
/* 000609 */ 		return self.v.atFileNodeName ();
/* 000609 */ 	});},
/* 000611 */ 	get atNoSentinelsFileNodeName () {return __get__ (this, function (self) {
/* 000611 */ 		return self.v.atNoSentinelsFileNodeName ();
/* 000611 */ 	});},
/* 000614 */ 	get atShadowFileNodeName () {return __get__ (this, function (self) {
/* 000614 */ 		return self.v.atShadowFileNodeName ();
/* 000614 */ 	});},
/* 000616 */ 	get atSilentFileNodeName () {return __get__ (this, function (self) {
/* 000616 */ 		return self.v.atSilentFileNodeName ();
/* 000616 */ 	});},
/* 000618 */ 	get atThinFileNodeName () {return __get__ (this, function (self) {
/* 000618 */ 		return self.v.atThinFileNodeName ();
/* 000618 */ 	});},
/* 000620 */ 	atNoSentFileNodeName: atNoSentinelsFileNodeName,
/* 000621 */ 	atAsisFileNodeName: atSilentFileNodeName,
/* 000623 */ 	get isAnyAtFileNode () {return __get__ (this, function (self) {
/* 000623 */ 		return self.v.isAnyAtFileNode ();
/* 000623 */ 	});},
/* 000625 */ 	get isAtAllNode () {return __get__ (this, function (self) {
/* 000625 */ 		return self.v.isAtAllNode ();
/* 000625 */ 	});},
/* 000627 */ 	get isAtAutoNode () {return __get__ (this, function (self) {
/* 000627 */ 		return self.v.isAtAutoNode ();
/* 000627 */ 	});},
/* 000629 */ 	get isAtAutoRstNode () {return __get__ (this, function (self) {
/* 000629 */ 		return self.v.isAtAutoRstNode ();
/* 000629 */ 	});},
/* 000631 */ 	get isAtCleanNode () {return __get__ (this, function (self) {
/* 000631 */ 		return self.v.isAtCleanNode ();
/* 000631 */ 	});},
/* 000633 */ 	get isAtEditNode () {return __get__ (this, function (self) {
/* 000633 */ 		return self.v.isAtEditNode ();
/* 000633 */ 	});},
/* 000635 */ 	get isAtFileNode () {return __get__ (this, function (self) {
/* 000635 */ 		return self.v.isAtFileNode ();
/* 000635 */ 	});},
/* 000637 */ 	get isAtIgnoreNode () {return __get__ (this, function (self) {
/* 000637 */ 		return self.v.isAtIgnoreNode ();
/* 000637 */ 	});},
/* 000639 */ 	get isAtNoSentinelsFileNode () {return __get__ (this, function (self) {
/* 000639 */ 		return self.v.isAtNoSentinelsFileNode ();
/* 000639 */ 	});},
/* 000641 */ 	get isAtOthersNode () {return __get__ (this, function (self) {
/* 000641 */ 		return self.v.isAtOthersNode ();
/* 000641 */ 	});},
/* 000643 */ 	get isAtRstFileNode () {return __get__ (this, function (self) {
/* 000643 */ 		return self.v.isAtRstFileNode ();
/* 000643 */ 	});},
/* 000645 */ 	get isAtSilentFileNode () {return __get__ (this, function (self) {
/* 000645 */ 		return self.v.isAtSilentFileNode ();
/* 000645 */ 	});},
/* 000647 */ 	get isAtShadowFileNode () {return __get__ (this, function (self) {
/* 000647 */ 		return self.v.isAtShadowFileNode ();
/* 000647 */ 	});},
/* 000649 */ 	get isAtThinFileNode () {return __get__ (this, function (self) {
/* 000649 */ 		return self.v.isAtThinFileNode ();
/* 000649 */ 	});},
/* 000651 */ 	isAtNoSentFileNode: isAtNoSentinelsFileNode,
/* 000652 */ 	isAtAsisFileNode: isAtSilentFileNode,
/* 000655 */ 	get matchHeadline () {return __get__ (this, function (self, pattern) {
/* 000655 */ 		return self.v.matchHeadline (pattern);
/* 000655 */ 	});},
/* 000657 */ 	get bodyString () {return __get__ (this, function (self) {
/* 000658 */ 		return self.v.bodyString ();
/* 000658 */ 	});},
/* 000660 */ 	get headString () {return __get__ (this, function (self) {
/* 000661 */ 		return self.v.headString ();
/* 000661 */ 	});},
/* 000663 */ 	get cleanHeadString () {return __get__ (this, function (self) {
/* 000664 */ 		return self.v.cleanHeadString ();
/* 000664 */ 	});},
/* 000666 */ 	get isDirty () {return __get__ (this, function (self) {
/* 000666 */ 		return self.v.isDirty ();
/* 000666 */ 	});},
/* 000668 */ 	get isMarked () {return __get__ (this, function (self) {
/* 000668 */ 		return self.v.isMarked ();
/* 000668 */ 	});},
/* 000670 */ 	get isOrphan () {return __get__ (this, function (self) {
/* 000670 */ 		return self.v.isOrphan ();
/* 000670 */ 	});},
/* 000672 */ 	get isSelected () {return __get__ (this, function (self) {
/* 000672 */ 		return self.v.isSelected ();
/* 000672 */ 	});},
/* 000674 */ 	get isTopBitSet () {return __get__ (this, function (self) {
/* 000674 */ 		return self.v.isTopBitSet ();
/* 000674 */ 	});},
/* 000676 */ 	get isVisited () {return __get__ (this, function (self) {
/* 000676 */ 		return self.v.isVisited ();
/* 000676 */ 	});},
/* 000678 */ 	get status () {return __get__ (this, function (self) {
/* 000678 */ 		return self.v.status ();
/* 000678 */ 	});},
/* 000683 */ 	get childIndex () {return __get__ (this, function (self) {
/* 000684 */ 		var p = self;
/* 000685 */ 		return p._childIndex;
/* 000685 */ 	});},
/* 000687 */ 	get directParents () {return __get__ (this, function (self) {
/* 000688 */ 		return self.v.directParents ();
/* 000688 */ 	});},
/* 000690 */ 	get hasChildren () {return __get__ (this, function (self) {
/* 000691 */ 		var p = self;
/* 000692 */ 		return len (p.v.children) > 0;
/* 000692 */ 	});},
/* 000694 */ 	hasFirstChild: hasChildren,
/* 000696 */ 	get numberOfChildren () {return __get__ (this, function (self) {
/* 000697 */ 		var p = self;
/* 000698 */ 		return len (p.v.children);
/* 000698 */ 	});},
/* 000703 */ 	get getBack () {return __get__ (this, function (self) {
/* 000703 */ 		return self.copy ().moveToBack ();
/* 000703 */ 	});},
/* 000705 */ 	get getFirstChild () {return __get__ (this, function (self) {
/* 000705 */ 		return self.copy ().moveToFirstChild ();
/* 000705 */ 	});},
/* 000707 */ 	get getLastChild () {return __get__ (this, function (self) {
/* 000707 */ 		return self.copy ().moveToLastChild ();
/* 000707 */ 	});},
/* 000709 */ 	get getLastNode () {return __get__ (this, function (self) {
/* 000709 */ 		return self.copy ().moveToLastNode ();
/* 000709 */ 	});},
/* 000712 */ 	get getNext () {return __get__ (this, function (self) {
/* 000712 */ 		return self.copy ().moveToNext ();
/* 000712 */ 	});},
/* 000714 */ 	get getNodeAfterTree () {return __get__ (this, function (self) {
/* 000714 */ 		return self.copy ().moveToNodeAfterTree ();
/* 000714 */ 	});},
/* 000716 */ 	get getNthChild () {return __get__ (this, function (self, n) {
/* 000716 */ 		return self.copy ().moveToNthChild (n);
/* 000716 */ 	});},
/* 000718 */ 	get getParent () {return __get__ (this, function (self) {
/* 000718 */ 		return self.copy ().moveToParent ();
/* 000718 */ 	});},
/* 000720 */ 	get getThreadBack () {return __get__ (this, function (self) {
/* 000720 */ 		return self.copy ().moveToThreadBack ();
/* 000720 */ 	});},
/* 000722 */ 	get getThreadNext () {return __get__ (this, function (self) {
/* 000722 */ 		return self.copy ().moveToThreadNext ();
/* 000722 */ 	});},
/* 000725 */ 	get getVisBack () {return __get__ (this, function (self, c) {
/* 000725 */ 		return self.copy ().moveToVisBack (c);
/* 000725 */ 	});},
/* 000727 */ 	get getVisNext () {return __get__ (this, function (self, c) {
/* 000727 */ 		return self.copy ().moveToVisNext (c);
/* 000727 */ 	});},
/* 000729 */ 	back: getBack,
/* 000730 */ 	firstChild: getFirstChild,
/* 000731 */ 	lastChild: getLastChild,
/* 000732 */ 	lastNode: getLastNode,
/* 000734 */ 	py_next: getNext,
/* 000735 */ 	nodeAfterTree: getNodeAfterTree,
/* 000736 */ 	nthChild: getNthChild,
/* 000737 */ 	parent: getParent,
/* 000738 */ 	threadBack: getThreadBack,
/* 000739 */ 	threadNext: getThreadNext,
/* 000740 */ 	visBack: getVisBack,
/* 000741 */ 	visNext: getVisNext,
/* 000743 */ 	hasVisBack: visBack,
/* 000744 */ 	hasVisNext: visNext,
/* 000746 */ 	get get_UNL () {return __get__ (this, function (self, with_file, with_proto, with_index, with_count) {
/* 000746 */ 		if (typeof with_file == 'undefined' || (with_file != null && with_file.hasOwnProperty ("__kwargtrans__"))) {;
/* 000746 */ 			var with_file = true;
/* 000746 */ 		};
/* 000746 */ 		if (typeof with_proto == 'undefined' || (with_proto != null && with_proto.hasOwnProperty ("__kwargtrans__"))) {;
/* 000746 */ 			var with_proto = false;
/* 000746 */ 		};
/* 000746 */ 		if (typeof with_index == 'undefined' || (with_index != null && with_index.hasOwnProperty ("__kwargtrans__"))) {;
/* 000746 */ 			var with_index = true;
/* 000746 */ 		};
/* 000746 */ 		if (typeof with_count == 'undefined' || (with_count != null && with_count.hasOwnProperty ("__kwargtrans__"))) {;
/* 000746 */ 			var with_count = false;
/* 000746 */ 		};
/* 000759 */ 		var aList = [];
/* 000760 */ 		for (var i of self.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 000761 */ 			if (with_index || with_count) {
/* 000762 */ 				var count = 0;
/* 000763 */ 				var ind = 0;
/* 000764 */ 				var p = i.copy ();
/* 000765 */ 				while (p.hasBack ()) {
/* 000766 */ 					var ind = ind + 1;
/* 000767 */ 					p.moveToBack ();
/* 000768 */ 					if (i.h == p.h) {
/* 000769 */ 						var count = count + 1;
/* 000769 */ 					}
/* 000769 */ 				}
/* 000770 */ 				aList.append ((i.h.py_replace ('-->', '--%3E') + ':') + str (ind));
/* 000772 */ 				if (count || with_count) {
/* 000773 */ 					aList [-(1)] = (aList [-(1)] + ',') + str (count);
/* 000773 */ 				}
/* 000773 */ 			}
/* 000774 */ 			else {
/* 000775 */ 				aList.append (i.h.py_replace ('-->', '--%3E'));
/* 000775 */ 			}
/* 000775 */ 		}
/* 000777 */ 		var UNL = '-->'.join (py_reversed (aList));
/* 000778 */ 		if (with_proto) {
/* 000780 */ 			var s = 'unl:' + '//{}#{}'.format (self.v.context.fileName (), UNL);
/* 000781 */ 			return s.py_replace (' ', '%20');
/* 000781 */ 		}
/* 000782 */ 		if (with_file) {
/* 000783 */ 			return '{}#{}'.format (self.v.context.fileName (), UNL);
/* 000783 */ 		}
/* 000784 */ 		return UNL;
/* 000784 */ 	});},
/* 000786 */ 	get hasBack () {return __get__ (this, function (self) {
/* 000787 */ 		var p = self;
/* 000788 */ 		return p.v && p._childIndex > 0;
/* 000788 */ 	});},
/* 000790 */ 	get hasNext () {return __get__ (this, function (self) {
/* 000791 */ 		var p = self;
/* 000792 */ 		try {
/* 000793 */ 			var parent_v = p._parentVnode ();
/* 000795 */ 			return p.v && parent_v && p._childIndex + 1 < len (parent_v.children);
/* 000795 */ 		}
/* 000795 */ 		catch (__except0__) {
/* 000795 */ 			if (isinstance (__except0__, Exception)) {
/* 000797 */ 				g.trace ('*** Unexpected exception');
/* 000798 */ 				g.es_exception ();
/* 000799 */ 				return null;
/* 000799 */ 			}
/* 000799 */ 			else {
/* 000799 */ 				throw __except0__;
/* 000799 */ 			}
/* 000799 */ 		}
/* 000799 */ 	});},
/* 000801 */ 	get hasParent () {return __get__ (this, function (self) {
/* 000802 */ 		var p = self;
/* 000803 */ 		return p.v && p.stack;
/* 000803 */ 	});},
/* 000805 */ 	get hasThreadBack () {return __get__ (this, function (self) {
/* 000806 */ 		var p = self;
/* 000807 */ 		return p.hasParent () || p.hasBack ();
/* 000807 */ 	});},
/* 000810 */ 	get hasThreadNext () {return __get__ (this, function (self) {
/* 000811 */ 		var p = self;
/* 000812 */ 		if (!(p.v)) {
/* 000812 */ 			return false;
/* 000812 */ 		}
/* 000813 */ 		if (p.hasChildren () || p.hasNext ()) {
/* 000813 */ 			return true;
/* 000813 */ 		}
/* 000814 */ 		var n = len (p.stack) - 1;
/* 000815 */ 		while (n >= 0) {
/* 000816 */ 			var __left0__ = p.stack [n];
/* 000816 */ 			var v = __left0__ [0];
/* 000816 */ 			var childIndex = __left0__ [1];
/* 000818 */ 			if (n == 0) {
/* 000819 */ 				var parent_v = v.context.hiddenRootNode;
/* 000819 */ 			}
/* 000820 */ 			else {
/* 000821 */ 				var __left0__ = p.stack [n - 1];
/* 000821 */ 				var parent_v = __left0__ [0];
/* 000821 */ 				var junk = __left0__ [1];
/* 000821 */ 			}
/* 000822 */ 			if (len (parent_v.children) > childIndex + 1) {
/* 000824 */ 				return true;
/* 000824 */ 			}
/* 000824 */ 			n--;
/* 000824 */ 		}
/* 000826 */ 		return false;
/* 000826 */ 	});},
/* 000828 */ 	get findRootPosition () {return __get__ (this, function (self) {
/* 000830 */ 		var p = self;
/* 000831 */ 		var c = p.v.context;
/* 000832 */ 		return c.rootPosition ();
/* 000832 */ 	});},
/* 000834 */ 	get isAncestorOf () {return __get__ (this, function (self, p2) {
/* 000836 */ 		var p = self;
/* 000837 */ 		var c = p.v.context;
/* 000838 */ 		if (!(c.positionExists (p2))) {
/* 000839 */ 			return false;
/* 000839 */ 		}
/* 000840 */ 		for (var z of p2.stack) {
/* 000843 */ 			var __left0__ = z;
/* 000843 */ 			var parent_v = __left0__ [0];
/* 000843 */ 			var parent_childIndex = __left0__ [1];
/* 000844 */ 			if (parent_v == p.v && parent_childIndex == p._childIndex) {
/* 000845 */ 				return true;
/* 000845 */ 			}
/* 000845 */ 		}
/* 000846 */ 		return false;
/* 000846 */ 	});},
/* 000848 */ 	get isCloned () {return __get__ (this, function (self) {
/* 000849 */ 		var p = self;
/* 000850 */ 		return p.v.isCloned ();
/* 000850 */ 	});},
/* 000852 */ 	get isRoot () {return __get__ (this, function (self) {
/* 000853 */ 		var p = self;
/* 000854 */ 		return !(p.hasParent ()) && !(p.hasBack ());
/* 000854 */ 	});},
/* 000856 */ 	get isVisible () {return __get__ (this, function (self, c) {
/* 000858 */ 		var p = self;
/* 000860 */ 		var visible = function (p, root) {
/* 000860 */ 			if (typeof root == 'undefined' || (root != null && root.hasOwnProperty ("__kwargtrans__"))) {;
/* 000860 */ 				var root = null;
/* 000860 */ 			};
/* 000861 */ 			for (var parent of p.parents (__kwargtrans__ ({copy: false}))) {
/* 000862 */ 				if (parent && parent == root) {
/* 000864 */ 					return true;
/* 000864 */ 				}
/* 000865 */ 				if (!(c.shouldBeExpanded (parent))) {
/* 000866 */ 					return false;
/* 000866 */ 				}
/* 000866 */ 			}
/* 000867 */ 			return true;
/* 000867 */ 		};
/* 000869 */ 		if (c.hoistStack) {
/* 000870 */ 			var root = c.hoistStack [-(1)].p;
/* 000871 */ 			if (p == root) {
/* 000873 */ 				return true;
/* 000873 */ 			}
/* 000874 */ 			return root.isAncestorOf (p) && visible (p, __kwargtrans__ ({root: root}));
/* 000874 */ 		}
/* 000875 */ 		for (var root of c.rootPosition ().self_and_siblings (__kwargtrans__ ({copy: false}))) {
/* 000876 */ 			if (root == p || root.isAncestorOf (p)) {
/* 000877 */ 				return visible (p);
/* 000877 */ 			}
/* 000877 */ 		}
/* 000878 */ 		return false;
/* 000878 */ 	});},
/* 000880 */ 	get level () {return __get__ (this, function (self) {
/* 000882 */ 		var p = self;
/* 000883 */ 		return (p.v ? len (p.stack) : 0);
/* 000883 */ 	});},
/* 000885 */ 	simpleLevel: level,
/* 000887 */ 	get positionAfterDeletedTree () {return __get__ (this, function (self) {
/* 000913 */ 		var p = self;
/* 000914 */ 		var py_next = p.py_next ();
/* 000915 */ 		if (py_next) {
/* 000917 */ 			var p = p.copy ();
/* 000918 */ 			p.v = py_next.v;
/* 000919 */ 			return p;
/* 000919 */ 		}
/* 000920 */ 		return p.nodeAfterTree ();
/* 000920 */ 	});},
/* 000922 */ 	get textOffset () {return __get__ (this, function (self) {
/* 000928 */ 		var p = self;
/* 000929 */ 		var __left0__ = tuple ([false, 0]);
/* 000929 */ 		var found = __left0__ [0];
/* 000929 */ 		var offset = __left0__ [1];
/* 000930 */ 		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 000931 */ 			if (p.isAnyAtFileNode ()) {
/* 000933 */ 				var found = true;
/* 000933 */ 				break;
/* 000933 */ 			}
/* 000935 */ 			var parent = p.parent ();
/* 000936 */ 			if (!(parent)) {
/* 000936 */ 				break;
/* 000936 */ 			}
/* 000940 */ 			var h = p.h.strip ();
/* 000941 */ 			var i = h.find ('<<');
/* 000942 */ 			var j = h.find ('>>');
/* 000943 */ 			var target = ((-(1) < i && i < j) ? h.__getslice__ (i, j + 2, 1) : '@others');
/* 000944 */ 			for (var s of parent.b.py_split ('\n')) {
/* 000945 */ 				if (s.find (target) > -(1)) {
/* 000946 */ 					offset += g.skip_ws (s, 0);
/* 000946 */ 					break;
/* 000946 */ 				}
/* 000946 */ 			}
/* 000946 */ 		}
/* 000948 */ 		return (found ? offset : null);
/* 000948 */ 	});},
/* 000950 */ 	get isOutsideAnyAtFileTree () {return __get__ (this, function (self) {
/* 000952 */ 		var p = self;
/* 000953 */ 		for (var parent of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 000954 */ 			if (parent.isAnyAtFileNode ()) {
/* 000955 */ 				return false;
/* 000955 */ 			}
/* 000955 */ 		}
/* 000956 */ 		return true;
/* 000956 */ 	});},
/* 000961 */ 	get _adjustPositionBeforeUnlink () {return __get__ (this, function (self, p2) {
/* 000965 */ 		var p = self;
/* 000965 */ 		var sib = p.copy ();
/* 000968 */ 		while (sib.hasBack ()) {
/* 000969 */ 			sib.moveToBack ();
/* 000970 */ 			if (sib == p2) {
/* 000970 */ 				p._childIndex--;
/* 000972 */ 				return ;
/* 000972 */ 			}
/* 000972 */ 		}
/* 000974 */ 		var stack = [];
/* 000974 */ 		var changed = false;
/* 000974 */ 		var i = 0;
/* 000975 */ 		while (i < len (p.stack)) {
/* 000976 */ 			var __left0__ = p.stack [i];
/* 000976 */ 			var v = __left0__ [0];
/* 000976 */ 			var childIndex = __left0__ [1];
/* 000977 */ 			var p3 = Position (__kwargtrans__ ({v: v, childIndex: childIndex, stack: stack.__getslice__ (0, i, 1)}));
/* 000978 */ 			var __break1__ = false;
/* 000978 */ 			while (p3) {
/* 000979 */ 				if (p2 == p3) {
/* 000982 */ 					stack.append (tuple ([v, childIndex - 1]));
/* 000983 */ 					var changed = true;
/* 000983 */ 					__break1__ = true;
/* 000983 */ 					break;
/* 000983 */ 				}
/* 000985 */ 				p3.moveToBack ();
/* 000985 */ 			}
/* 000986 */ 			if (!__break1__) {
/* 000987 */ 				stack.append (tuple ([v, childIndex]));
/* 000987 */ 			}
/* 000987 */ 			i++;
/* 000987 */ 		}
/* 000989 */ 		if (changed) {
/* 000990 */ 			p.stack = stack;
/* 000990 */ 		}
/* 000990 */ 	});},
/* 000992 */ 	get _linkAfter () {return __get__ (this, function (self, p_after) {
/* 000994 */ 		var p = self;
/* 000995 */ 		var parent_v = p_after._parentVnode ();
/* 000996 */ 		p.stack = p_after.stack.__getslice__ (0, null, 1);
/* 000997 */ 		p._childIndex = p_after._childIndex + 1;
/* 000998 */ 		var child = p.v;
/* 000999 */ 		var n = p_after._childIndex + 1;
/* 001000 */ 		child._addLink (n, parent_v);
/* 001000 */ 	});},
/* 001002 */ 	get _linkCopiedAfter () {return __get__ (this, function (self, p_after) {
/* 001004 */ 		var p = self;
/* 001005 */ 		var parent_v = p_after._parentVnode ();
/* 001006 */ 		p.stack = p_after.stack.__getslice__ (0, null, 1);
/* 001007 */ 		p._childIndex = p_after._childIndex + 1;
/* 001008 */ 		var child = p.v;
/* 001009 */ 		var n = p_after._childIndex + 1;
/* 001010 */ 		child._addCopiedLink (n, parent_v);
/* 001010 */ 	});},
/* 001012 */ 	get _linkAsNthChild () {return __get__ (this, function (self, parent, n) {
/* 001014 */ 		var p = self;
/* 001015 */ 		var parent_v = parent.v;
/* 001016 */ 		p.stack = parent.stack.__getslice__ (0, null, 1);
/* 001017 */ 		p.stack.append (tuple ([parent_v, parent._childIndex]));
/* 001018 */ 		p._childIndex = n;
/* 001019 */ 		var child = p.v;
/* 001020 */ 		child._addLink (n, parent_v);
/* 001020 */ 	});},
/* 001022 */ 	get _linkCopiedAsNthChild () {return __get__ (this, function (self, parent, n) {
/* 001024 */ 		var p = self;
/* 001025 */ 		var parent_v = parent.v;
/* 001026 */ 		p.stack = parent.stack.__getslice__ (0, null, 1);
/* 001027 */ 		p.stack.append (tuple ([parent_v, parent._childIndex]));
/* 001028 */ 		p._childIndex = n;
/* 001029 */ 		var child = p.v;
/* 001030 */ 		child._addCopiedLink (n, parent_v);
/* 001030 */ 	});},
/* 001032 */ 	get _linkAsRoot () {return __get__ (this, function (self) {
/* 001034 */ 		var p = self;
/* 001036 */ 		var parent_v = p.v.context.hiddenRootNode;
/* 001040 */ 		p.stack = [];
/* 001041 */ 		p._childIndex = 0;
/* 001044 */ 		p.v._addLink (0, parent_v);
/* 001045 */ 		return p;
/* 001045 */ 	});},
/* 001047 */ 	get _parentVnode () {return __get__ (this, function (self) {
/* 001052 */ 		var p = self;
/* 001053 */ 		if (p.v) {
/* 001054 */ 			var data = p.stack && p.stack [-(1)];
/* 001055 */ 			if (data) {
/* 001056 */ 				var __left0__ = data;
/* 001056 */ 				var v = __left0__ [0];
/* 001056 */ 				var junk = __left0__ [1];
/* 001057 */ 				return v;
/* 001057 */ 			}
/* 001058 */ 			return p.v.context.hiddenRootNode;
/* 001058 */ 		}
/* 001059 */ 		return null;
/* 001059 */ 	});},
/* 001061 */ 	get _relinkAsCloneOf () {return __get__ (this, function (self, p2) {
/* 001063 */ 		var p = self;
/* 001064 */ 		var __left0__ = tuple ([p.v, p2.v]);
/* 001064 */ 		var v = __left0__ [0];
/* 001064 */ 		var v2 = __left0__ [1];
/* 001065 */ 		var parent_v = p._parentVnode ();
/* 001066 */ 		if (!(parent_v)) {
/* 001067 */ 			g.internalError ('no parent_v', p);
/* 001068 */ 			return ;
/* 001068 */ 		}
/* 001069 */ 		if (parent_v.children [p._childIndex] == v) {
/* 001070 */ 			parent_v.children [p._childIndex] = v2;
/* 001071 */ 			v2.parents.append (parent_v);
/* 001071 */ 		}
/* 001072 */ 		else {
/* 001075 */ 			g.internalError ('parent_v.children[childIndex] != v', p, parent_v.children, p._childIndex, v);
/* 001075 */ 		}
/* 001075 */ 	});},
/* 001079 */ 	get _unlink () {return __get__ (this, function (self) {
/* 001081 */ 		var p = self;
/* 001081 */ 		var n = p._childIndex;
/* 001082 */ 		var parent_v = p._parentVnode ();
/* 001084 */ 		var child = p.v;
/* 001088 */ 		if ((0 <= n && n < len (parent_v.children)) && parent_v.children [n] == child) {
/* 001092 */ 			child._cutLink (n, parent_v);
/* 001092 */ 		}
/* 001093 */ 		else {
/* 001094 */ 			self.badUnlink (parent_v, n, child);
/* 001094 */ 		}
/* 001094 */ 	});},
/* 001096 */ 	get badUnlink () {return __get__ (this, function (self, parent_v, n, child) {
/* 001098 */ 		if ((0 <= n && n < len (parent_v.children))) {
/* 001099 */ 			g.trace ('**can not happen: children[{}] != p.v'.format (n));
/* 001101 */ 			g.trace ('parent_v.children...\n', g.listToString (parent_v.children));
/* 001102 */ 			g.trace ('parent_v', parent_v);
/* 001103 */ 			g.trace ('parent_v.children[n]', parent_v.children [n]);
/* 001104 */ 			g.trace ('child', child);
/* 001105 */ 			g.trace ('** callers:', g.callers ());
/* 001106 */ 			if (g.app.unitTesting) {
/* 001106 */ 			}
/* 001106 */ 		}
/* 001107 */ 		else {
/* 001109 */ 			g.trace ('**can not happen: bad child index: {}, len(children): {}'.format (n, len (parent_v.children)));
/* 001112 */ 			g.trace ('parent_v.children...\n', g.listToString (parent_v.children));
/* 001113 */ 			g.trace ('parent_v', parent_v, 'child', child);
/* 001114 */ 			g.trace ('** callers:', g.callers ());
/* 001115 */ 			if (g.app.unitTesting) {
/* 001115 */ 			}
/* 001115 */ 		}
/* 001115 */ 	});},
/* 001128 */ 	get moveToBack () {return __get__ (this, function (self) {
/* 001130 */ 		var p = self;
/* 001130 */ 		var n = p._childIndex;
/* 001131 */ 		var parent_v = p._parentVnode ();
/* 001134 */ 		if (parent_v && p.v && (0 < n && n <= len (parent_v.children))) {
/* 001134 */ 			p._childIndex--;
/* 001136 */ 			p.v = parent_v.children [n - 1];
/* 001136 */ 		}
/* 001137 */ 		else {
/* 001138 */ 			p.v = null;
/* 001138 */ 		}
/* 001139 */ 		return p;
/* 001139 */ 	});},
/* 001141 */ 	get moveToFirstChild () {return __get__ (this, function (self) {
/* 001143 */ 		var p = self;
/* 001144 */ 		if (p.v && p.v.children) {
/* 001145 */ 			p.stack.append (tuple ([p.v, p._childIndex]));
/* 001146 */ 			p.v = p.v.children [0];
/* 001147 */ 			p._childIndex = 0;
/* 001147 */ 		}
/* 001148 */ 		else {
/* 001149 */ 			p.v = null;
/* 001149 */ 		}
/* 001150 */ 		return p;
/* 001150 */ 	});},
/* 001152 */ 	get moveToLastChild () {return __get__ (this, function (self) {
/* 001154 */ 		var p = self;
/* 001155 */ 		if (p.v && p.v.children) {
/* 001156 */ 			p.stack.append (tuple ([p.v, p._childIndex]));
/* 001157 */ 			var n = len (p.v.children);
/* 001158 */ 			p.v = p.v.children [n - 1];
/* 001159 */ 			p._childIndex = n - 1;
/* 001159 */ 		}
/* 001160 */ 		else {
/* 001161 */ 			p.v = null;
/* 001161 */ 		}
/* 001162 */ 		return p;
/* 001162 */ 	});},
/* 001164 */ 	get moveToLastNode () {return __get__ (this, function (self) {
/* 001168 */ 		var p = self;
/* 001170 */ 		while (p.hasChildren ()) {
/* 001171 */ 			p.moveToLastChild ();
/* 001171 */ 		}
/* 001172 */ 		return p;
/* 001172 */ 	});},
/* 001174 */ 	get moveToNext () {return __get__ (this, function (self) {
/* 001176 */ 		var p = self;
/* 001176 */ 		var n = p._childIndex;
/* 001177 */ 		var parent_v = p._parentVnode ();
/* 001179 */ 		if (!(p.v)) {
/* 001180 */ 			g.trace ('no p.v:', p, g.callers ());
/* 001180 */ 		}
/* 001181 */ 		if (p.v && parent_v && len (parent_v.children) > n + 1) {
/* 001182 */ 			p._childIndex = n + 1;
/* 001183 */ 			p.v = parent_v.children [n + 1];
/* 001183 */ 		}
/* 001184 */ 		else {
/* 001185 */ 			p.v = null;
/* 001185 */ 		}
/* 001186 */ 		return p;
/* 001186 */ 	});},
/* 001188 */ 	get moveToNodeAfterTree () {return __get__ (this, function (self) {
/* 001190 */ 		var p = self;
/* 001191 */ 		while (p) {
/* 001192 */ 			if (p.hasNext ()) {
/* 001193 */ 				p.moveToNext ();
/* 001193 */ 				break;
/* 001193 */ 			}
/* 001195 */ 			p.moveToParent ();
/* 001195 */ 		}
/* 001196 */ 		return p;
/* 001196 */ 	});},
/* 001198 */ 	get moveToNthChild () {return __get__ (this, function (self, n) {
/* 001199 */ 		var p = self;
/* 001200 */ 		if (p.v && len (p.v.children) > n) {
/* 001201 */ 			p.stack.append (tuple ([p.v, p._childIndex]));
/* 001202 */ 			p.v = p.v.children [n];
/* 001203 */ 			p._childIndex = n;
/* 001203 */ 		}
/* 001204 */ 		else {
/* 001205 */ 			p.v = null;
/* 001205 */ 		}
/* 001206 */ 		return p;
/* 001206 */ 	});},
/* 001208 */ 	get moveToParent () {return __get__ (this, function (self) {
/* 001210 */ 		var p = self;
/* 001211 */ 		if (p.v && p.stack) {
/* 001212 */ 			var __left0__ = p.stack.py_pop ();
/* 001212 */ 			p.v = __left0__ [0];
/* 001212 */ 			p._childIndex = __left0__ [1];
/* 001212 */ 		}
/* 001213 */ 		else {
/* 001214 */ 			p.v = null;
/* 001214 */ 		}
/* 001215 */ 		return p;
/* 001215 */ 	});},
/* 001217 */ 	get moveToThreadBack () {return __get__ (this, function (self) {
/* 001219 */ 		var p = self;
/* 001220 */ 		if (p.hasBack ()) {
/* 001221 */ 			p.moveToBack ();
/* 001222 */ 			p.moveToLastNode ();
/* 001222 */ 		}
/* 001223 */ 		else {
/* 001224 */ 			p.moveToParent ();
/* 001224 */ 		}
/* 001225 */ 		return p;
/* 001225 */ 	});},
/* 001227 */ 	get moveToThreadNext () {return __get__ (this, function (self) {
/* 001229 */ 		var p = self;
/* 001230 */ 		if (p.v) {
/* 001231 */ 			if (p.v.children) {
/* 001232 */ 				p.moveToFirstChild ();
/* 001232 */ 			}
/* 001233 */ 			else if (p.hasNext ()) {
/* 001234 */ 				p.moveToNext ();
/* 001234 */ 			}
/* 001235 */ 			else {
/* 001236 */ 				p.moveToParent ();
/* 001237 */ 				while (p) {
/* 001238 */ 					if (p.hasNext ()) {
/* 001239 */ 						p.moveToNext ();
/* 001239 */ 						break;
/* 001239 */ 					}
/* 001241 */ 					p.moveToParent ();
/* 001241 */ 				}
/* 001241 */ 			}
/* 001241 */ 		}
/* 001243 */ 		return p;
/* 001243 */ 	});},
/* 001245 */ 	get moveToVisBack () {return __get__ (this, function (self, c) {
/* 001247 */ 		var p = self;
/* 001248 */ 		var __left0__ = c.visLimit ();
/* 001248 */ 		var limit = __left0__ [0];
/* 001248 */ 		var limitIsVisible = __left0__ [1];
/* 001249 */ 		while (p) {
/* 001251 */ 			var back = p.back ();
/* 001252 */ 			if (back && back.hasChildren () && back.isExpanded ()) {
/* 001253 */ 				p.moveToThreadBack ();
/* 001253 */ 			}
/* 001254 */ 			else if (back) {
/* 001255 */ 				p.moveToBack ();
/* 001255 */ 			}
/* 001256 */ 			else {
/* 001257 */ 				p.moveToParent ();
/* 001257 */ 			}
/* 001258 */ 			if (p) {
/* 001259 */ 				if (limit) {
/* 001260 */ 					var __left0__ = self.checkVisBackLimit (limit, limitIsVisible, p);
/* 001260 */ 					var done = __left0__ [0];
/* 001260 */ 					var val = __left0__ [1];
/* 001261 */ 					if (done) {
/* 001262 */ 						return val;
/* 001262 */ 					}
/* 001262 */ 				}
/* 001263 */ 				if (p.isVisible (c)) {
/* 001264 */ 					return p;
/* 001264 */ 				}
/* 001264 */ 			}
/* 001264 */ 		}
/* 001265 */ 		return p;
/* 001265 */ 	});},
/* 001267 */ 	get checkVisBackLimit () {return __get__ (this, function (self, limit, limitIsVisible, p) {
/* 001269 */ 		var c = p.v.context;
/* 001270 */ 		if (limit == p) {
/* 001271 */ 			if (limitIsVisible && p.isVisible (c)) {
/* 001272 */ 				return tuple ([true, p]);
/* 001272 */ 			}
/* 001273 */ 			return tuple ([true, null]);
/* 001273 */ 		}
/* 001274 */ 		if (limit.isAncestorOf (p)) {
/* 001275 */ 			return tuple ([false, null]);
/* 001275 */ 		}
/* 001276 */ 		return tuple ([true, null]);
/* 001276 */ 	});},
/* 001278 */ 	get moveToVisNext () {return __get__ (this, function (self, c) {
/* 001280 */ 		var p = self;
/* 001281 */ 		var __left0__ = c.visLimit ();
/* 001281 */ 		var limit = __left0__ [0];
/* 001281 */ 		var limitIsVisible = __left0__ [1];
/* 001282 */ 		while (p) {
/* 001283 */ 			if (p.hasChildren ()) {
/* 001284 */ 				if (p.isExpanded ()) {
/* 001285 */ 					p.moveToFirstChild ();
/* 001285 */ 				}
/* 001286 */ 				else {
/* 001287 */ 					p.moveToNodeAfterTree ();
/* 001287 */ 				}
/* 001287 */ 			}
/* 001288 */ 			else if (p.hasNext ()) {
/* 001289 */ 				p.moveToNext ();
/* 001289 */ 			}
/* 001290 */ 			else {
/* 001291 */ 				p.moveToThreadNext ();
/* 001291 */ 			}
/* 001292 */ 			if (p) {
/* 001293 */ 				if (limit && self.checkVisNextLimit (limit, p)) {
/* 001294 */ 					return null;
/* 001294 */ 				}
/* 001295 */ 				if (p.isVisible (c)) {
/* 001296 */ 					return p;
/* 001296 */ 				}
/* 001296 */ 			}
/* 001296 */ 		}
/* 001297 */ 		return p;
/* 001297 */ 	});},
/* 001299 */ 	get checkVisNextLimit () {return __get__ (this, function (self, limit, p) {
/* 001301 */ 		return limit != p && !(limit.isAncestorOf (p));
/* 001301 */ 	});},
/* 001303 */ 	get safeMoveToThreadNext () {return __get__ (this, function (self) {
/* 001308 */ 		var p = self;
/* 001309 */ 		if (p.v) {
/* 001310 */ 			var child_v = p.v.children && p.v.children [0];
/* 001311 */ 			if (child_v) {
/* 001312 */ 				var __break0__ = false;
/* 001312 */ 				for (var parent of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 001313 */ 					if (child_v == parent.v) {
/* 001313 */ 						g.app.structure_errors++;
/* 001315 */ 						g.error ('vnode: {} is its own parent'.format (child_v));
/* 001318 */ 						parent.v.children = (function () {
/* 001318 */ 							var __accu0__ = [];
/* 001319 */ 							for (var v2 of parent.v.children) {
/* 001319 */ 								if (!(v2 == child_v)) {
/* 001319 */ 									__accu0__.append (v2);
/* 001319 */ 								}
/* 001319 */ 							}
/* 001319 */ 							return __accu0__;
/* 001319 */ 						}) ();
/* 001320 */ 						if (__in__ (parent.v, child_v.parents)) {
/* 001321 */ 							child_v.parents.remove (parent.v);
/* 001321 */ 						}
/* 001323 */ 						p.moveToParent ();
/* 001323 */ 						__break0__ = true;
/* 001323 */ 						break;
/* 001323 */ 					}
/* 001325 */ 					else if (child_v.fileIndex == parent.v.fileIndex) {
/* 001325 */ 						g.app.structure_errors++;
/* 001327 */ 						g.error ('duplicate gnx: {} v: {} parent: {}'.format (child_v.fileIndex, child_v, parent.v));
/* 001330 */ 						child_v.fileIndex = g.app.nodeIndices.getNewIndex (__kwargtrans__ ({v: child_v}));
/* 001333 */ 						p.moveToFirstChild ();
/* 001333 */ 						__break0__ = true;
/* 001333 */ 						break;
/* 001333 */ 					}
/* 001333 */ 				}
/* 001335 */ 				if (!__break0__) {
/* 001336 */ 					p.moveToFirstChild ();
/* 001336 */ 				}
/* 001336 */ 			}
/* 001337 */ 			else if (p.hasNext ()) {
/* 001338 */ 				p.moveToNext ();
/* 001338 */ 			}
/* 001339 */ 			else {
/* 001340 */ 				p.moveToParent ();
/* 001341 */ 				while (p) {
/* 001342 */ 					if (p.hasNext ()) {
/* 001343 */ 						p.moveToNext ();
/* 001343 */ 						break;
/* 001343 */ 					}
/* 001345 */ 					p.moveToParent ();
/* 001345 */ 				}
/* 001345 */ 			}
/* 001345 */ 		}
/* 001347 */ 		return p;
/* 001347 */ 	});},
/* 001351 */ 	get clone () {return __get__ (this, function (self) {
/* 001355 */ 		var p = self;
/* 001356 */ 		var p2 = p.copy ();
/* 001357 */ 		p2._linkAfter (p);
/* 001358 */ 		return p2;
/* 001358 */ 	});},
/* 001360 */ 	get copy () {return __get__ (this, function (self) {
/* 001362 */ 		return Position (self.v, self._childIndex, self.stack);
/* 001362 */ 	});},
/* 001369 */ 	get copyTreeAfter () {return __get__ (this, function (self, copyGnxs) {
/* 001369 */ 		if (typeof copyGnxs == 'undefined' || (copyGnxs != null && copyGnxs.hasOwnProperty ("__kwargtrans__"))) {;
/* 001369 */ 			var copyGnxs = false;
/* 001369 */ 		};
/* 001371 */ 		var p = self;
/* 001372 */ 		var p2 = p.insertAfter ();
/* 001373 */ 		p.copyTreeFromSelfTo (p2, __kwargtrans__ ({copyGnxs: copyGnxs}));
/* 001374 */ 		return p2;
/* 001374 */ 	});},
/* 001377 */ 	get copyTreeFromSelfTo () {return __get__ (this, function (self, p2, copyGnxs) {
/* 001377 */ 		if (typeof copyGnxs == 'undefined' || (copyGnxs != null && copyGnxs.hasOwnProperty ("__kwargtrans__"))) {;
/* 001377 */ 			var copyGnxs = false;
/* 001377 */ 		};
/* 001378 */ 		var p = self;
/* 001379 */ 		p2.v._headString = g.toUnicode (p.h, __kwargtrans__ ({reportErrors: true}));
/* 001380 */ 		p2.v._bodyString = g.toUnicode (p.b, __kwargtrans__ ({reportErrors: true}));
/* 001389 */ 		if (copyGnxs) {
/* 001390 */ 			p2.v.fileIndex = p.v.fileIndex;
/* 001390 */ 		}
/* 001392 */ 		for (var child of p.children ()) {
/* 001393 */ 			var child2 = p2.insertAsLastChild ();
/* 001394 */ 			child.copyTreeFromSelfTo (child2, __kwargtrans__ ({copyGnxs: copyGnxs}));
/* 001394 */ 		}
/* 001394 */ 	});},
/* 001396 */ 	get copyWithNewVnodes () {return __get__ (this, function (self, copyMarked) {
/* 001396 */ 		if (typeof copyMarked == 'undefined' || (copyMarked != null && copyMarked.hasOwnProperty ("__kwargtrans__"))) {;
/* 001396 */ 			var copyMarked = false;
/* 001396 */ 		};
/* 001401 */ 		var p = self;
/* 001402 */ 		return Position (__kwargtrans__ ({v: p.v.copyTree (copyMarked)}));
/* 001402 */ 	});},
/* 001404 */ 	get createNodeHierarchy () {return __get__ (this, function (self, heads, forcecreate) {
/* 001404 */ 		if (typeof forcecreate == 'undefined' || (forcecreate != null && forcecreate.hasOwnProperty ("__kwargtrans__"))) {;
/* 001404 */ 			var forcecreate = false;
/* 001404 */ 		};
/* 001419 */ 		var c = self.v.context;
/* 001420 */ 		return c.createNodeHierarchy (heads, __kwargtrans__ ({parent: self, forcecreate: forcecreate}));
/* 001420 */ 	});},
/* 001422 */ 	get deleteAllChildren () {return __get__ (this, function (self) {
/* 001426 */ 		var p = self;
/* 001427 */ 		p.setDirty ();
/* 001428 */ 		while (p.hasChildren ()) {
/* 001429 */ 			p.firstChild ().doDelete ();
/* 001429 */ 		}
/* 001429 */ 	});},
/* 001431 */ 	get doDelete () {return __get__ (this, function (self, newNode) {
/* 001431 */ 		if (typeof newNode == 'undefined' || (newNode != null && newNode.hasOwnProperty ("__kwargtrans__"))) {;
/* 001431 */ 			var newNode = null;
/* 001431 */ 		};
/* 001439 */ 		var p = self;
/* 001440 */ 		p.setDirty ();
/* 001441 */ 		var sib = p.copy ();
/* 001442 */ 		while (sib.hasNext ()) {
/* 001443 */ 			sib.moveToNext ();
/* 001444 */ 			if (sib == newNode) {
/* 001444 */ 				newNode._childIndex--;
/* 001444 */ 				break;
/* 001444 */ 			}
/* 001444 */ 		}
/* 001448 */ 		p._unlink ();
/* 001448 */ 	});},
/* 001450 */ 	get insertAfter () {return __get__ (this, function (self) {
/* 001456 */ 		var p = self;
/* 001456 */ 		var context = p.v.context;
/* 001457 */ 		var p2 = self.copy ();
/* 001458 */ 		p2.v = VNode (__kwargtrans__ ({context: context}));
/* 001459 */ 		p2.v.iconVal = 0;
/* 001460 */ 		p2._linkAfter (p);
/* 001461 */ 		return p2;
/* 001461 */ 	});},
/* 001463 */ 	get insertAsLastChild () {return __get__ (this, function (self) {
/* 001467 */ 		var p = self;
/* 001468 */ 		var n = p.numberOfChildren ();
/* 001469 */ 		return p.insertAsNthChild (n);
/* 001469 */ 	});},
/* 001471 */ 	get insertAsNthChild () {return __get__ (this, function (self, n) {
/* 001478 */ 		var p = self;
/* 001478 */ 		var context = p.v.context;
/* 001479 */ 		var p2 = self.copy ();
/* 001480 */ 		p2.v = VNode (__kwargtrans__ ({context: context}));
/* 001481 */ 		p2.v.iconVal = 0;
/* 001482 */ 		p2._linkAsNthChild (p, n);
/* 001483 */ 		return p2;
/* 001483 */ 	});},
/* 001485 */ 	get insertBefore () {return __get__ (this, function (self) {
/* 001491 */ 		var p = self;
/* 001492 */ 		var parent = p.parent ();
/* 001493 */ 		if (p.hasBack ()) {
/* 001494 */ 			var back = p.getBack ();
/* 001495 */ 			var p = back.insertAfter ();
/* 001495 */ 		}
/* 001496 */ 		else if (parent) {
/* 001497 */ 			var p = parent.insertAsNthChild (0);
/* 001497 */ 		}
/* 001498 */ 		else {
/* 001499 */ 			var p = p.insertAfter ();
/* 001500 */ 			p.moveToRoot ();
/* 001500 */ 		}
/* 001501 */ 		return p;
/* 001501 */ 	});},
/* 001503 */ 	get invalidOutline () {return __get__ (this, function (self, message) {
/* 001504 */ 		var p = self;
/* 001505 */ 		if (p.hasParent ()) {
/* 001506 */ 			var node = p.parent ();
/* 001506 */ 		}
/* 001507 */ 		else {
/* 001508 */ 			var node = p;
/* 001508 */ 		}
/* 001509 */ 		p.v.context.alert ('invalid outline: {}\n{}'.format (message, node));
/* 001509 */ 	});},
/* 001511 */ 	get moveAfter () {return __get__ (this, function (self, a) {
/* 001513 */ 		var p = self;
/* 001514 */ 		a._adjustPositionBeforeUnlink (p);
/* 001515 */ 		p._unlink ();
/* 001516 */ 		p._linkAfter (a);
/* 001517 */ 		return p;
/* 001517 */ 	});},
/* 001519 */ 	get moveToFirstChildOf () {return __get__ (this, function (self, parent) {
/* 001521 */ 		var p = self;
/* 001522 */ 		return p.moveToNthChildOf (parent, 0);
/* 001522 */ 	});},
/* 001524 */ 	get moveToLastChildOf () {return __get__ (this, function (self, parent) {
/* 001526 */ 		var p = self;
/* 001527 */ 		var n = parent.numberOfChildren ();
/* 001528 */ 		if (p.parent () == parent) {
/* 001528 */ 			n--;
/* 001528 */ 		}
/* 001530 */ 		return p.moveToNthChildOf (parent, n);
/* 001530 */ 	});},
/* 001532 */ 	get moveToNthChildOf () {return __get__ (this, function (self, parent, n) {
/* 001534 */ 		var p = self;
/* 001535 */ 		parent._adjustPositionBeforeUnlink (p);
/* 001536 */ 		p._unlink ();
/* 001537 */ 		p._linkAsNthChild (parent, n);
/* 001538 */ 		return p;
/* 001538 */ 	});},
/* 001540 */ 	get moveToRoot () {return __get__ (this, function (self) {
/* 001542 */ 		var p = self;
/* 001545 */ 		p._unlink ();
/* 001546 */ 		p._linkAsRoot ();
/* 001547 */ 		return p;
/* 001547 */ 	});},
/* 001549 */ 	get promote () {return __get__ (this, function (self) {
/* 001551 */ 		var p = self;
/* 001552 */ 		var parent_v = p._parentVnode ();
/* 001553 */ 		var children = p.v.children;
/* 001555 */ 		var n = p.childIndex () + 1;
/* 001556 */ 		var z = parent_v.children.__getslice__ (0, null, 1);
/* 001557 */ 		parent_v.children = z.__getslice__ (0, n, 1);
/* 001558 */ 		parent_v.children.extend (children);
/* 001559 */ 		parent_v.children.extend (z.__getslice__ (n, null, 1));
/* 001561 */ 		p.v.children = [];
/* 001564 */ 		for (var child of children) {
/* 001565 */ 			child.parents.remove (p.v);
/* 001566 */ 			child.parents.append (parent_v);
/* 001566 */ 		}
/* 001566 */ 	});},
/* 001570 */ 	get validateOutlineWithParent () {return __get__ (this, function (self, pv) {
/* 001571 */ 		var p = self;
/* 001572 */ 		var result = true;
/* 001573 */ 		var parent = p.getParent ();
/* 001574 */ 		var childIndex = p._childIndex;
/* 001577 */ 		if (parent != pv) {
/* 001578 */ 			p.invalidOutline ('Invalid parent link: ' + repr (parent));
/* 001578 */ 		}
/* 001582 */ 		if (pv) {
/* 001583 */ 			if (childIndex < 0) {
/* 001584 */ 				p.invalidOutline ('missing childIndex' + childIndex);
/* 001584 */ 			}
/* 001585 */ 			else if (childIndex >= pv.numberOfChildren ()) {
/* 001586 */ 				p.invalidOutline ('missing children entry for index: ' + childIndex);
/* 001586 */ 			}
/* 001586 */ 		}
/* 001587 */ 		else if (childIndex < 0) {
/* 001588 */ 			p.invalidOutline ('negative childIndex' + childIndex);
/* 001588 */ 		}
/* 001592 */ 		if (!(p.v) && pv) {
/* 001593 */ 			self.invalidOutline ('Empty t');
/* 001593 */ 		}
/* 001596 */ 		for (var child of p.children ()) {
/* 001597 */ 			var r = child.validateOutlineWithParent (p);
/* 001598 */ 			if (!(r)) {
/* 001598 */ 				var result = false;
/* 001598 */ 			}
/* 001598 */ 		}
/* 001599 */ 		return result;
/* 001599 */ 	});},
/* 001602 */ 	get __get_b () {return __get__ (this, function (self) {
/* 001604 */ 		var p = self;
/* 001605 */ 		return p.bodyString ();
/* 001605 */ 	});},
/* 001607 */ 	get __set_b () {return __get__ (this, function (self, val) {
/* 001622 */ 		var p = self;
/* 001623 */ 		var c = p.v && p.v.context;
/* 001624 */ 		if (c) {
/* 001625 */ 			c.setBodyString (p, val);
/* 001625 */ 		}
/* 001625 */ 	});},
/* 001632 */ 	get __get_h () {return __get__ (this, function (self) {
/* 001633 */ 		var p = self;
/* 001634 */ 		return p.headString ();
/* 001634 */ 	});},
/* 001636 */ 	get __set_h () {return __get__ (this, function (self, val) {
/* 001651 */ 		var p = self;
/* 001652 */ 		var c = p.v && p.v.context;
/* 001653 */ 		if (c) {
/* 001654 */ 			c.setHeadString (p, val);
/* 001654 */ 		}
/* 001654 */ 	});},
/* 001661 */ 	get __get_gnx () {return __get__ (this, function (self) {
/* 001662 */ 		var p = self;
/* 001663 */ 		return p.v.fileIndex;
/* 001663 */ 	});},
/* 001669 */ 	get __get_script () {return __get__ (this, function (self) {
/* 001670 */ 		var p = self;
/* 001671 */ 		return g.getScript (p.v.context, p, __kwargtrans__ ({useSelectedText: false, forcePythonSentinels: true, useSentinels: false}));
/* 001671 */ 	});},
/* 001680 */ 	get __get_nosentinels () {return __get__ (this, function (self) {
/* 001681 */ 		var p = self;
/* 001682 */ 		return ''.join ((function () {
/* 001682 */ 			var __accu0__ = [];
/* 001682 */ 			for (var z of g.splitLines (p.b)) {
/* 001682 */ 				if (!(g.isDirective (z))) {
/* 001682 */ 					__accu0__.append (z);
/* 001682 */ 				}
/* 001682 */ 			}
/* 001682 */ 			return __accu0__;
/* 001682 */ 		}) ());
/* 001682 */ 	});},
/* 001688 */ 	get __get_u () {return __get__ (this, function (self) {
/* 001689 */ 		var p = self;
/* 001690 */ 		return p.v.u;
/* 001690 */ 	});},
/* 001692 */ 	get __set_u () {return __get__ (this, function (self, val) {
/* 001693 */ 		var p = self;
/* 001694 */ 		p.v.u = val;
/* 001694 */ 	});},
/* 001702 */ 	get contract () {return __get__ (this, function (self) {
/* 001704 */ 		var __left0__ = tuple ([self, self.v]);
/* 001704 */ 		var p = __left0__ [0];
/* 001704 */ 		var v = __left0__ [1];
/* 001705 */ 		v.expandedPositions = (function () {
/* 001705 */ 			var __accu0__ = [];
/* 001705 */ 			for (var z of v.expandedPositions) {
/* 001705 */ 				if (z != p) {
/* 001705 */ 					__accu0__.append (z);
/* 001705 */ 				}
/* 001705 */ 			}
/* 001705 */ 			return __accu0__;
/* 001705 */ 		}) ();
/* 001706 */ 		v.contract ();
/* 001706 */ 	});},
/* 001708 */ 	get expand () {return __get__ (this, function (self) {
/* 001709 */ 		var p = self;
/* 001710 */ 		var v = self.v;
/* 001711 */ 		v.expandedPositions = (function () {
/* 001711 */ 			var __accu0__ = [];
/* 001711 */ 			for (var z of v.expandedPositions) {
/* 001711 */ 				if (z != p) {
/* 001711 */ 					__accu0__.append (z);
/* 001711 */ 				}
/* 001711 */ 			}
/* 001711 */ 			return __accu0__;
/* 001711 */ 		}) ();
/* 001712 */ 		var __break0__ = false;
/* 001712 */ 		for (var p2 of v.expandedPositions) {
/* 001713 */ 			if (p == p2) {
/* 001713 */ 				__break0__ = true;
/* 001713 */ 				break;
/* 001713 */ 			}
/* 001713 */ 		}
/* 001715 */ 		if (!__break0__) {
/* 001716 */ 			v.expandedPositions.append (p.copy ());
/* 001716 */ 		}
/* 001717 */ 		v.expand ();
/* 001717 */ 	});},
/* 001719 */ 	get isExpanded () {return __get__ (this, function (self) {
/* 001720 */ 		var p = self;
/* 001721 */ 		if (p.isCloned ()) {
/* 001722 */ 			var c = p.v.context;
/* 001723 */ 			return c.shouldBeExpanded (p);
/* 001723 */ 		}
/* 001724 */ 		return p.v.isExpanded ();
/* 001724 */ 	});},
/* 001729 */ 	get clearMarked () {return __get__ (this, function (self) {
/* 001729 */ 		return self.v.clearMarked ();
/* 001729 */ 	});},
/* 001731 */ 	get clearOrphan () {return __get__ (this, function (self) {
/* 001731 */ 		return self.v.clearOrphan ();
/* 001731 */ 	});},
/* 001733 */ 	get clearVisited () {return __get__ (this, function (self) {
/* 001733 */ 		return self.v.clearVisited ();
/* 001733 */ 	});},
/* 001735 */ 	get initExpandedBit () {return __get__ (this, function (self) {
/* 001735 */ 		return self.v.initExpandedBit ();
/* 001735 */ 	});},
/* 001737 */ 	get initMarkedBit () {return __get__ (this, function (self) {
/* 001737 */ 		return self.v.initMarkedBit ();
/* 001737 */ 	});},
/* 001739 */ 	get initStatus () {return __get__ (this, function (self, status) {
/* 001739 */ 		return self.v.initStatus (status);
/* 001739 */ 	});},
/* 001741 */ 	get setMarked () {return __get__ (this, function (self) {
/* 001741 */ 		return self.v.setMarked ();
/* 001741 */ 	});},
/* 001743 */ 	get setOrphan () {return __get__ (this, function (self) {
/* 001743 */ 		return self.v.setOrphan ();
/* 001743 */ 	});},
/* 001745 */ 	get setSelected () {return __get__ (this, function (self) {
/* 001745 */ 		return self.v.setSelected ();
/* 001745 */ 	});},
/* 001747 */ 	get setVisited () {return __get__ (this, function (self) {
/* 001747 */ 		return self.v.setVisited ();
/* 001747 */ 	});},
/* 001749 */ 	get computeIcon () {return __get__ (this, function (self) {
/* 001750 */ 		return self.v.computeIcon ();
/* 001750 */ 	});},
/* 001752 */ 	get setIcon () {return __get__ (this, function (self) {
/* 001753 */ 		// pass;
/* 001753 */ 	});},
/* 001755 */ 	get setSelection () {return __get__ (this, function (self, start, length) {
/* 001756 */ 		return self.v.setSelection (start, length);
/* 001756 */ 	});},
/* 001758 */ 	get restoreCursorAndScroll () {return __get__ (this, function (self) {
/* 001759 */ 		self.v.restoreCursorAndScroll ();
/* 001759 */ 	});},
/* 001761 */ 	get saveCursorAndScroll () {return __get__ (this, function (self) {
/* 001762 */ 		self.v.saveCursorAndScroll ();
/* 001762 */ 	});},
/* 001764 */ 	get setBodyString () {return __get__ (this, function (self, s) {
/* 001765 */ 		var p = self;
/* 001766 */ 		return p.v.setBodyString (s);
/* 001766 */ 	});},
/* 001768 */ 	initBodyString: setBodyString,
/* 001769 */ 	setTnodeText: setBodyString,
/* 001770 */ 	scriptSetBodyString: setBodyString,
/* 001772 */ 	get initHeadString () {return __get__ (this, function (self, s) {
/* 001773 */ 		var p = self;
/* 001774 */ 		p.v.initHeadString (s);
/* 001774 */ 	});},
/* 001776 */ 	get setHeadString () {return __get__ (this, function (self, s) {
/* 001777 */ 		var p = self;
/* 001778 */ 		p.v.initHeadString (s);
/* 001779 */ 		p.setDirty ();
/* 001779 */ 	});},
/* 001784 */ 	get clearVisitedInTree () {return __get__ (this, function (self) {
/* 001785 */ 		for (var p of self.self_and_subtree (__kwargtrans__ ({copy: false}))) {
/* 001786 */ 			p.clearVisited ();
/* 001786 */ 		}
/* 001786 */ 	});},
/* 001788 */ 	get clearAllVisitedInTree () {return __get__ (this, function (self) {
/* 001789 */ 		for (var p of self.self_and_subtree (__kwargtrans__ ({copy: false}))) {
/* 001790 */ 			p.v.clearVisited ();
/* 001791 */ 			p.v.clearWriteBit ();
/* 001791 */ 		}
/* 001791 */ 	});},
/* 001794 */ 	get clearDirty () {return __get__ (this, function (self) {
/* 001796 */ 		var p = self;
/* 001797 */ 		p.v.clearDirty ();
/* 001797 */ 	});},
/* 001799 */ 	get inAtIgnoreRange () {return __get__ (this, function (self) {
/* 001801 */ 		var p = self;
/* 001802 */ 		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 001803 */ 			if (p.isAtIgnoreNode ()) {
/* 001804 */ 				return true;
/* 001804 */ 			}
/* 001804 */ 		}
/* 001805 */ 		return false;
/* 001805 */ 	});},
/* 001807 */ 	get setAllAncestorAtFileNodesDirty () {return __get__ (this, function (self) {
/* 001811 */ 		var p = self;
/* 001812 */ 		p.v.setAllAncestorAtFileNodesDirty ();
/* 001812 */ 	});},
/* 001814 */ 	get setDirty () {return __get__ (this, function (self) {
/* 001820 */ 		var p = self;
/* 001821 */ 		p.v.setAllAncestorAtFileNodesDirty ();
/* 001822 */ 		p.v.setDirty ();
/* 001822 */ 	});},
/* 001825 */ 	get is_at_all () {return __get__ (this, function (self) {
/* 001827 */ 		var p = self;
/* 001830 */ 		return p.isAnyAtFileNode () && any ((function () {
/* 001830 */ 			var __accu0__ = [];
/* 001830 */ 			for (var s of g.splitLines (p.b)) {
/* 001830 */ 				__accu0__.append (g.match_word (s, 0, '@all'));
/* 001830 */ 			}
/* 001830 */ 			return __accu0__;
/* 001830 */ 		}) ());
/* 001830 */ 	});},
/* 001832 */ 	get in_at_all_tree () {return __get__ (this, function (self) {
/* 001834 */ 		var p = self;
/* 001835 */ 		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 001836 */ 			if (p.is_at_all ()) {
/* 001837 */ 				return true;
/* 001837 */ 			}
/* 001837 */ 		}
/* 001838 */ 		return false;
/* 001838 */ 	});},
/* 001840 */ 	get is_at_ignore () {return __get__ (this, function (self) {
/* 001842 */ 		var p = self;
/* 001843 */ 		return g.match_word (p.h, 0, '@ignore');
/* 001843 */ 	});},
/* 001845 */ 	get in_at_ignore_tree () {return __get__ (this, function (self) {
/* 001847 */ 		var p = self;
/* 001848 */ 		for (var p of p.self_and_parents (__kwargtrans__ ({copy: false}))) {
/* 001849 */ 			if (g.match_word (p.h, 0, '@ignore')) {
/* 001850 */ 				return true;
/* 001850 */ 			}
/* 001850 */ 		}
/* 001851 */ 		return false;
/* 001851 */ 	});}
/* 001851 */ });
/* 001628 */ Object.defineProperty (Position, 'b', property.call (Position, Position.__get_b, Position.__set_b));
/* 001657 */ Object.defineProperty (Position, 'h', property.call (Position, Position.__get_h, Position.__set_h));
/* 001665 */ Object.defineProperty (Position, 'gnx', property.call (Position, Position.__get_gnx));
/* 001676 */ Object.defineProperty (Position, 'script', property.call (Position, Position.__get_script));
/* 001684 */ Object.defineProperty (Position, 'nosentinels', property.call (Position, Position.__get_nosentinels));
/* 001696 */ Object.defineProperty (Position, 'u', property.call (Position, Position.__get_u, Position.__set_u));
/* 001853 */ export var position = Position;
/* 001855 */ export var PosList =  __class__ ('PosList', [list], {
/* 001855 */ 	__module__: __name__,
/* 001858 */ 	get children () {return __get__ (this, function (self) {
/* 001862 */ 		var res = PosList ();
/* 001863 */ 		for (var p of self) {
/* 001864 */ 			for (var child_p of p.children ()) {
/* 001865 */ 				res.append (child_p.copy ());
/* 001865 */ 			}
/* 001865 */ 		}
/* 001866 */ 		return res;
/* 001866 */ 	});},
/* 001868 */ 	get filter_h () {return __get__ (this, function (self, regex, flags) {
/* 001868 */ 		if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 001868 */ 			var flags = re.IGNORECASE;
/* 001868 */ 		};
/* 001873 */ 		var pat = re.compile (regex, flags);
/* 001874 */ 		var res = PosList ();
/* 001875 */ 		for (var p of self) {
/* 001876 */ 			var mo = re.match (pat, p.h);
/* 001877 */ 			if (mo) {
/* 001878 */ 				var pc = p.copy ();
/* 001879 */ 				pc.mo = mo;
/* 001880 */ 				res.append (pc);
/* 001880 */ 			}
/* 001880 */ 		}
/* 001881 */ 		return res;
/* 001881 */ 	});},
/* 001883 */ 	get filter_b () {return __get__ (this, function (self, regex, flags) {
/* 001883 */ 		if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 001883 */ 			var flags = re.IGNORECASE;
/* 001883 */ 		};
/* 001888 */ 		var pat = re.compile (regex, flags);
/* 001889 */ 		var res = PosList ();
/* 001890 */ 		for (var p of self) {
/* 001891 */ 			var m = re.finditer (pat, p.b);
/* 001892 */ 			var __left0__ = itertools.tee (m, 2);
/* 001892 */ 			var t1 = __left0__ [0];
/* 001892 */ 			var t2 = __left0__ [1];
/* 001893 */ 			try {
/* 001894 */ 				t1.__next__ ();
/* 001895 */ 				var pc = p.copy ();
/* 001896 */ 				pc.matchiter = t2;
/* 001897 */ 				res.append (pc);
/* 001897 */ 			}
/* 001897 */ 			catch (__except0__) {
/* 001897 */ 				if (isinstance (__except0__, StopIteration)) {
/* 001899 */ 					// pass;
/* 001899 */ 				}
/* 001899 */ 				else {
/* 001899 */ 					throw __except0__;
/* 001899 */ 				}
/* 001899 */ 			}
/* 001899 */ 		}
/* 001900 */ 		return res;
/* 001900 */ 	});}
/* 001900 */ });
/* 001902 */ export var Poslist = PosList;
/* 001906 */ export var VNode =  __class__ ('VNode', [object], {
/* 001906 */ 	__module__: __name__,
/* 001911 */ 	clonedBit: 1,
/* 001913 */ 	expandedBit: 4,
/* 001914 */ 	markedBit: 8,
/* 001916 */ 	selectedBit: 32,
/* 001917 */ 	topBit: 64,
/* 001919 */ 	richTextBit: 128,
/* 001920 */ 	visitedBit: 256,
/* 001921 */ 	dirtyBit: 512,
/* 001922 */ 	writeBit: 1024,
/* 001923 */ 	orphanBit: 2048,
/* 001928 */ 	get __init__ () {return __get__ (this, function (self, context, gnx) {
/* 001928 */ 		if (typeof gnx == 'undefined' || (gnx != null && gnx.hasOwnProperty ("__kwargtrans__"))) {;
/* 001928 */ 			var gnx = null;
/* 001928 */ 		};
/* 001935 */ 		self._headString = 'newHeadline';
/* 001936 */ 		self._bodyString = '';
/* 001938 */ 		self.children = [];
/* 001940 */ 		self.parents = [];
/* 001943 */ 		self.fileIndex = null;
/* 001945 */ 		self.iconVal = 0;
/* 001947 */ 		self.statusBits = 0;
/* 001950 */ 		self.context = context;
/* 001953 */ 		self.expandedPositions = [];
/* 001955 */ 		self.insertSpot = null;
/* 001957 */ 		self.scrollBarSpot = null;
/* 001959 */ 		self.selectionLength = 0;
/* 001961 */ 		self.selectionStart = 0;
/* 001969 */ 		g.app.nodeIndices.new_vnode_helper (context, gnx, self);
/* 001969 */ 	});},
/* 001972 */ 	get __repr__ () {return __get__ (this, function (self) {
/* 001973 */ 		return '<VNode {} {}>'.format (self.gnx, self.headString ());
/* 001973 */ 	});},
/* 001975 */ 	__str__: __repr__,
/* 001977 */ 	get dumpLink () {return __get__ (this, function (self, link) {
/* 001978 */ 		return (link ? link : '<none>');
/* 001978 */ 	});},
/* 001980 */ 	get dump () {return __get__ (this, function (self, label) {
/* 001980 */ 		if (typeof label == 'undefined' || (label != null && label.hasOwnProperty ("__kwargtrans__"))) {;
/* 001980 */ 			var label = '';
/* 001980 */ 		};
/* 001981 */ 		var v = self;
/* 001982 */ 		var s = '-' * 10;
/* 001983 */ 		print ('{} {} {}'.format (s, label, v));
/* 001985 */ 		print ('len(parents): {}'.format (len (v.parents)));
/* 001986 */ 		print ('len(children): {}'.format (len (v.children)));
/* 001987 */ 		print ('parents: {}'.format (g.listToString (v.parents)));
/* 001988 */ 		print ('children: {}'.format (g.listToString (v.children)));
/* 001988 */ 	});},
/* 001991 */ 	get findAtFileName () {return __get__ (this, function (self, names, h) {
/* 001991 */ 		if (typeof h == 'undefined' || (h != null && h.hasOwnProperty ("__kwargtrans__"))) {;
/* 001991 */ 			var h = '';
/* 001991 */ 		};
/* 001994 */ 		if (!(h)) {
/* 001995 */ 			var h = self.headString ();
/* 001995 */ 		}
/* 001996 */ 		if (!(g.match (h, 0, '@'))) {
/* 001997 */ 			return '';
/* 001997 */ 		}
/* 001998 */ 		var i = g.skip_id (h, 1, '-');
/* 001999 */ 		var word = h.__getslice__ (0, i, 1);
/* 002000 */ 		if (__in__ (word, names) && g.match_word (h, 0, word)) {
/* 002001 */ 			var py_name = h.__getslice__ (i, null, 1).strip ();
/* 002002 */ 			return py_name;
/* 002002 */ 		}
/* 002003 */ 		return '';
/* 002003 */ 	});},
/* 002005 */ 	get anyAtFileNodeName () {return __get__ (this, function (self) {
/* 002009 */ 		return self.findAtFileName (g.app.atAutoNames) || self.findAtFileName (g.app.atFileNames);
/* 002009 */ 	});},
/* 002014 */ 	get atAutoNodeName () {return __get__ (this, function (self, h) {
/* 002014 */ 		if (typeof h == 'undefined' || (h != null && h.hasOwnProperty ("__kwargtrans__"))) {;
/* 002014 */ 			var h = null;
/* 002014 */ 		};
/* 002015 */ 		return self.findAtFileName (g.app.atAutoNames, __kwargtrans__ ({h: h}));
/* 002015 */ 	});},
/* 002021 */ 	get atAutoRstNodeName () {return __get__ (this, function (self, h) {
/* 002021 */ 		if (typeof h == 'undefined' || (h != null && h.hasOwnProperty ("__kwargtrans__"))) {;
/* 002021 */ 			var h = null;
/* 002021 */ 		};
/* 002022 */ 		var names = tuple (['@auto-rst']);
/* 002023 */ 		return self.findAtFileName (names, __kwargtrans__ ({h: h}));
/* 002023 */ 	});},
/* 002025 */ 	get atCleanNodeName () {return __get__ (this, function (self) {
/* 002026 */ 		var names = tuple (['@clean']);
/* 002027 */ 		return self.findAtFileName (names);
/* 002027 */ 	});},
/* 002029 */ 	get atEditNodeName () {return __get__ (this, function (self) {
/* 002030 */ 		var names = tuple (['@edit']);
/* 002031 */ 		return self.findAtFileName (names);
/* 002031 */ 	});},
/* 002033 */ 	get atFileNodeName () {return __get__ (this, function (self) {
/* 002034 */ 		var names = tuple (['@file', '@thin']);
/* 002036 */ 		return self.findAtFileName (names);
/* 002036 */ 	});},
/* 002038 */ 	get atNoSentinelsFileNodeName () {return __get__ (this, function (self) {
/* 002039 */ 		var names = tuple (['@nosent', '@file-nosent']);
/* 002040 */ 		return self.findAtFileName (names);
/* 002040 */ 	});},
/* 002042 */ 	get atRstFileNodeName () {return __get__ (this, function (self) {
/* 002043 */ 		var names = tuple (['@rst']);
/* 002044 */ 		return self.findAtFileName (names);
/* 002044 */ 	});},
/* 002046 */ 	get atShadowFileNodeName () {return __get__ (this, function (self) {
/* 002047 */ 		var names = tuple (['@shadow']);
/* 002048 */ 		return self.findAtFileName (names);
/* 002048 */ 	});},
/* 002050 */ 	get atSilentFileNodeName () {return __get__ (this, function (self) {
/* 002051 */ 		var names = tuple (['@asis', '@file-asis']);
/* 002052 */ 		return self.findAtFileName (names);
/* 002052 */ 	});},
/* 002054 */ 	get atThinFileNodeName () {return __get__ (this, function (self) {
/* 002055 */ 		var names = tuple (['@thin', '@file-thin']);
/* 002056 */ 		return self.findAtFileName (names);
/* 002056 */ 	});},
/* 002060 */ 	atNoSentFileNodeName: atNoSentinelsFileNodeName,
/* 002061 */ 	atAsisFileNodeName: atSilentFileNodeName,
/* 002063 */ 	get isAtAllNode () {return __get__ (this, function (self) {
/* 002065 */ 		var __left0__ = g.is_special (self._bodyString, '@all');
/* 002065 */ 		var flag = __left0__ [0];
/* 002065 */ 		var i = __left0__ [1];
/* 002066 */ 		return flag;
/* 002066 */ 	});},
/* 002068 */ 	get isAnyAtFileNode () {return __get__ (this, function (self) {
/* 002072 */ 		var h = self.headString ();
/* 002073 */ 		return h && h [0] == '@' && self.anyAtFileNodeName ();
/* 002073 */ 	});},
/* 002075 */ 	get isAtAutoNode () {return __get__ (this, function (self) {
/* 002076 */ 		return bool (self.atAutoNodeName ());
/* 002076 */ 	});},
/* 002078 */ 	get isAtAutoRstNode () {return __get__ (this, function (self) {
/* 002079 */ 		return bool (self.atAutoRstNodeName ());
/* 002079 */ 	});},
/* 002081 */ 	get isAtCleanNode () {return __get__ (this, function (self) {
/* 002082 */ 		return bool (self.atCleanNodeName ());
/* 002082 */ 	});},
/* 002084 */ 	get isAtEditNode () {return __get__ (this, function (self) {
/* 002085 */ 		return bool (self.atEditNodeName ());
/* 002085 */ 	});},
/* 002087 */ 	get isAtFileNode () {return __get__ (this, function (self) {
/* 002088 */ 		return bool (self.atFileNodeName ());
/* 002088 */ 	});},
/* 002090 */ 	get isAtRstFileNode () {return __get__ (this, function (self) {
/* 002091 */ 		return bool (self.atRstFileNodeName ());
/* 002091 */ 	});},
/* 002093 */ 	get isAtNoSentinelsFileNode () {return __get__ (this, function (self) {
/* 002094 */ 		return bool (self.atNoSentinelsFileNodeName ());
/* 002094 */ 	});},
/* 002096 */ 	get isAtSilentFileNode () {return __get__ (this, function (self) {
/* 002097 */ 		return bool (self.atSilentFileNodeName ());
/* 002097 */ 	});},
/* 002099 */ 	get isAtShadowFileNode () {return __get__ (this, function (self) {
/* 002100 */ 		return bool (self.atShadowFileNodeName ());
/* 002100 */ 	});},
/* 002102 */ 	get isAtThinFileNode () {return __get__ (this, function (self) {
/* 002103 */ 		return bool (self.atThinFileNodeName ());
/* 002103 */ 	});},
/* 002107 */ 	isAtNoSentFileNode: isAtNoSentinelsFileNode,
/* 002108 */ 	isAtAsisFileNode: isAtSilentFileNode,
/* 002110 */ 	get isAtIgnoreNode () {return __get__ (this, function (self) {
/* 002119 */ 		if (g.match_word (self._headString, 0, '@ignore')) {
/* 002120 */ 			return true;
/* 002120 */ 		}
/* 002121 */ 		var __left0__ = g.is_special (self._bodyString, '@ignore');
/* 002121 */ 		var flag = __left0__ [0];
/* 002121 */ 		var i = __left0__ [1];
/* 002122 */ 		return flag;
/* 002122 */ 	});},
/* 002124 */ 	get isAtOthersNode () {return __get__ (this, function (self) {
/* 002126 */ 		var __left0__ = g.is_special (self._bodyString, '@others');
/* 002126 */ 		var flag = __left0__ [0];
/* 002126 */ 		var i = __left0__ [1];
/* 002127 */ 		return flag;
/* 002127 */ 	});},
/* 002129 */ 	get matchHeadline () {return __get__ (this, function (self, pattern) {
/* 002133 */ 		var v = self;
/* 002134 */ 		var h = g.toUnicode (v.headString ());
/* 002135 */ 		var h = h.lower ().py_replace (' ', '').py_replace ('\t', '');
/* 002136 */ 		var h = h.lstrip ('.');
/* 002137 */ 		var pattern = g.toUnicode (pattern);
/* 002138 */ 		var pattern = pattern.lower ().py_replace (' ', '').py_replace ('\t', '');
/* 002139 */ 		return h.startswith (pattern);
/* 002139 */ 	});},
/* 002142 */ 	get copyTree () {return __get__ (this, function (self, copyMarked) {
/* 002142 */ 		if (typeof copyMarked == 'undefined' || (copyMarked != null && copyMarked.hasOwnProperty ("__kwargtrans__"))) {;
/* 002142 */ 			var copyMarked = false;
/* 002142 */ 		};
/* 002150 */ 		var v = self;
/* 002152 */ 		var v2 = VNode (__kwargtrans__ ({context: v.context, gnx: null}));
/* 002157 */ 		v2._headString = g.toUnicode (v._headString, __kwargtrans__ ({reportErrors: true}));
/* 002158 */ 		v2._bodyString = g.toUnicode (v._bodyString, __kwargtrans__ ({reportErrors: true}));
/* 002165 */ 		if (copyMarked && v.isMarked ()) {
/* 002166 */ 			v2.setMarked ();
/* 002166 */ 		}
/* 002168 */ 		for (var child of v.children) {
/* 002169 */ 			v2.children.append (child.copyTree (copyMarked));
/* 002169 */ 		}
/* 002170 */ 		return v2;
/* 002170 */ 	});},
/* 002173 */ 	body_unicode_warning: false,
/* 002175 */ 	get bodyString () {return __get__ (this, function (self) {
/* 002177 */ 		if (isinstance (self._bodyString, str)) {
/* 002178 */ 			return self._bodyString;
/* 002178 */ 		}
/* 002179 */ 		if (!(self.body_unicode_warning)) {
/* 002180 */ 			self.body_unicode_warning = true;
/* 002181 */ 			g.internalError ('not unicode:', repr (self._bodyString), self._headString);
/* 002181 */ 		}
/* 002182 */ 		return g.toUnicode (self._bodyString);
/* 002182 */ 	});},
/* 002184 */ 	getBody: bodyString,
/* 002188 */ 	get firstChild () {return __get__ (this, function (self) {
/* 002189 */ 		var v = self;
/* 002190 */ 		return v.children && v.children [0];
/* 002190 */ 	});},
/* 002192 */ 	get hasChildren () {return __get__ (this, function (self) {
/* 002193 */ 		var v = self;
/* 002194 */ 		return len (v.children) > 0;
/* 002194 */ 	});},
/* 002196 */ 	hasFirstChild: hasChildren,
/* 002198 */ 	get lastChild () {return __get__ (this, function (self) {
/* 002199 */ 		var v = self;
/* 002200 */ 		return (v.children ? v.children [-(1)] : null);
/* 002200 */ 	});},
/* 002204 */ 	get nthChild () {return __get__ (this, function (self, n) {
/* 002205 */ 		var v = self;
/* 002206 */ 		if ((0 <= n && n < len (v.children))) {
/* 002207 */ 			return v.children [n];
/* 002207 */ 		}
/* 002208 */ 		return null;
/* 002208 */ 	});},
/* 002210 */ 	get numberOfChildren () {return __get__ (this, function (self) {
/* 002211 */ 		var v = self;
/* 002212 */ 		return len (v.children);
/* 002212 */ 	});},
/* 002214 */ 	get directParents () {return __get__ (this, function (self) {
/* 002218 */ 		var v = self;
/* 002219 */ 		return v.parents;
/* 002219 */ 	});},
/* 002221 */ 	get hasBody () {return __get__ (this, function (self) {
/* 002223 */ 		var s = self._bodyString;
/* 002224 */ 		return s && len (s) > 0;
/* 002224 */ 	});},
/* 002226 */ 	head_unicode_warning: false,
/* 002228 */ 	get headString () {return __get__ (this, function (self) {
/* 002231 */ 		if (isinstance (self._headString, str)) {
/* 002232 */ 			return self._headString;
/* 002232 */ 		}
/* 002233 */ 		if (!(self.head_unicode_warning)) {
/* 002234 */ 			self.head_unicode_warning = true;
/* 002235 */ 			g.internalError ('not a string', repr (self._headString));
/* 002235 */ 		}
/* 002236 */ 		return g.toUnicode (self._headString);
/* 002236 */ 	});},
/* 002238 */ 	get isNthChildOf () {return __get__ (this, function (self, n, parent_v) {
/* 002240 */ 		var v = self;
/* 002241 */ 		var children = parent_v && parent_v.children;
/* 002242 */ 		return children && (0 <= n && n < len (children)) && children [n] == v;
/* 002242 */ 	});},
/* 002245 */ 	get isCloned () {return __get__ (this, function (self) {
/* 002246 */ 		return len (self.parents) > 1;
/* 002246 */ 	});},
/* 002248 */ 	get isDirty () {return __get__ (this, function (self) {
/* 002249 */ 		return (self.statusBits & self.dirtyBit) != 0;
/* 002249 */ 	});},
/* 002251 */ 	get isMarked () {return __get__ (this, function (self) {
/* 002252 */ 		return (self.statusBits & VNode.markedBit) != 0;
/* 002252 */ 	});},
/* 002254 */ 	get isOrphan () {return __get__ (this, function (self) {
/* 002255 */ 		return (self.statusBits & VNode.orphanBit) != 0;
/* 002255 */ 	});},
/* 002257 */ 	get isSelected () {return __get__ (this, function (self) {
/* 002258 */ 		return (self.statusBits & VNode.selectedBit) != 0;
/* 002258 */ 	});},
/* 002260 */ 	get isTopBitSet () {return __get__ (this, function (self) {
/* 002261 */ 		return (self.statusBits & self.topBit) != 0;
/* 002261 */ 	});},
/* 002263 */ 	get isVisited () {return __get__ (this, function (self) {
/* 002264 */ 		return (self.statusBits & VNode.visitedBit) != 0;
/* 002264 */ 	});},
/* 002266 */ 	get isWriteBit () {return __get__ (this, function (self) {
/* 002267 */ 		var v = self;
/* 002268 */ 		return (v.statusBits & v.writeBit) != 0;
/* 002268 */ 	});},
/* 002270 */ 	get status () {return __get__ (this, function (self) {
/* 002271 */ 		return self.statusBits;
/* 002271 */ 	});},
/* 002275 */ 	get clearDirty () {return __get__ (this, function (self) {
/* 002277 */ 		var v = self;
/* 002277 */ 		v.statusBits &= ~(v.dirtyBit);
/* 002277 */ 	});},
/* 002280 */ 	get setDirty () {return __get__ (this, function (self) {
/* 002280 */ 		self.statusBits |= self.dirtyBit;
/* 002280 */ 	});},
/* 002290 */ 	get clearClonedBit () {return __get__ (this, function (self) {
/* 002290 */ 		self.statusBits &= ~(self.clonedBit);
/* 002290 */ 	});},
/* 002293 */ 	get clearMarked () {return __get__ (this, function (self) {
/* 002293 */ 		self.statusBits &= ~(self.markedBit);
/* 002293 */ 	});},
/* 002296 */ 	get clearWriteBit () {return __get__ (this, function (self) {
/* 002296 */ 		self.statusBits &= ~(self.writeBit);
/* 002296 */ 	});},
/* 002299 */ 	get clearOrphan () {return __get__ (this, function (self) {
/* 002299 */ 		self.statusBits &= ~(self.orphanBit);
/* 002299 */ 	});},
/* 002303 */ 	get clearVisited () {return __get__ (this, function (self) {
/* 002303 */ 		self.statusBits &= ~(self.visitedBit);
/* 002303 */ 	});},
/* 002306 */ 	get contract () {return __get__ (this, function (self) {
/* 002306 */ 		self.statusBits &= ~(self.expandedBit);
/* 002306 */ 	});},
/* 002310 */ 	get expand () {return __get__ (this, function (self) {
/* 002310 */ 		self.statusBits |= self.expandedBit;
/* 002310 */ 	});},
/* 002314 */ 	get initExpandedBit () {return __get__ (this, function (self) {
/* 002314 */ 		self.statusBits |= self.expandedBit;
/* 002314 */ 	});},
/* 002318 */ 	get isExpanded () {return __get__ (this, function (self) {
/* 002320 */ 		return (self.statusBits & self.expandedBit) != 0;
/* 002320 */ 	});},
/* 002322 */ 	get initStatus () {return __get__ (this, function (self, status) {
/* 002323 */ 		self.statusBits = status;
/* 002323 */ 	});},
/* 002325 */ 	get setClonedBit () {return __get__ (this, function (self) {
/* 002325 */ 		self.statusBits |= self.clonedBit;
/* 002325 */ 	});},
/* 002328 */ 	get initClonedBit () {return __get__ (this, function (self, val) {
/* 002329 */ 		if (val) {
/* 002329 */ 			self.statusBits |= self.clonedBit;
/* 002329 */ 		}
/* 002331 */ 		else {
/* 002331 */ 			self.statusBits &= ~(self.clonedBit);
/* 002331 */ 		}
/* 002331 */ 	});},
/* 002334 */ 	get setMarked () {return __get__ (this, function (self) {
/* 002334 */ 		self.statusBits |= self.markedBit;
/* 002334 */ 	});},
/* 002337 */ 	get initMarkedBit () {return __get__ (this, function (self) {
/* 002337 */ 		self.statusBits |= self.markedBit;
/* 002337 */ 	});},
/* 002340 */ 	get setOrphan () {return __get__ (this, function (self) {
/* 002340 */ 		self.statusBits |= self.orphanBit;
/* 002340 */ 	});},
/* 002346 */ 	get setSelected () {return __get__ (this, function (self) {
/* 002346 */ 		self.statusBits |= self.selectedBit;
/* 002346 */ 	});},
/* 002351 */ 	get setVisited () {return __get__ (this, function (self) {
/* 002351 */ 		self.statusBits |= self.visitedBit;
/* 002351 */ 	});},
/* 002354 */ 	get setWriteBit () {return __get__ (this, function (self) {
/* 002354 */ 		self.statusBits |= self.writeBit;
/* 002354 */ 	});},
/* 002357 */ 	get childrenModified () {return __get__ (this, function (self) {
/* 002358 */ 		g.childrenModifiedSet.add (self);
/* 002358 */ 	});},
/* 002360 */ 	get computeIcon () {return __get__ (this, function (self) {
/* 002361 */ 		var val = 0;
/* 002361 */ 		var v = self;
/* 002362 */ 		if (v.hasBody ()) {
/* 002362 */ 			val++;
/* 002362 */ 		}
/* 002363 */ 		if (v.isMarked ()) {
/* 002363 */ 			val += 2;
/* 002363 */ 		}
/* 002364 */ 		if (v.isCloned ()) {
/* 002364 */ 			val += 4;
/* 002364 */ 		}
/* 002365 */ 		if (v.isDirty ()) {
/* 002365 */ 			val += 8;
/* 002365 */ 		}
/* 002366 */ 		return val;
/* 002366 */ 	});},
/* 002368 */ 	get setIcon () {return __get__ (this, function (self) {
/* 002369 */ 		// pass;
/* 002369 */ 	});},
/* 002371 */ 	get contentModified () {return __get__ (this, function (self) {
/* 002372 */ 		g.contentModifiedSet.add (self);
/* 002372 */ 	});},
/* 002376 */ 	get restoreCursorAndScroll () {return __get__ (this, function (self) {
/* 002378 */ 		var traceTime = false && !(g.unitTesting);
/* 002379 */ 		var v = self;
/* 002380 */ 		var ins = v.insertSpot;
/* 002382 */ 		var spot = v.scrollBarSpot;
/* 002383 */ 		var body = self.context.frame.body;
/* 002384 */ 		var w = body.wrapper;
/* 002386 */ 		if (ins === null) {
/* 002386 */ 			var ins = 0;
/* 002386 */ 		}
/* 002388 */ 		if (traceTime) {
/* 002388 */ 			var t1 = time.time ();
/* 002388 */ 		}
/* 002389 */ 		if (hasattr (body.wrapper, 'setInsertPoint')) {
/* 002390 */ 			w.setInsertPoint (ins);
/* 002390 */ 		}
/* 002391 */ 		if (traceTime) {
/* 002392 */ 			var delta_t = time.time () - t1;
/* 002393 */ 			if (delta_t > 0.1) {
/* 002393 */ 				g.trace ('{} sec'.format (delta_t));
/* 002393 */ 			}
/* 002393 */ 		}
/* 002396 */ 		if (spot !== null) {
/* 002397 */ 			w.setYScrollPosition (spot);
/* 002398 */ 			v.scrollBarSpot = spot;
/* 002398 */ 		}
/* 002398 */ 	});},
/* 002401 */ 	get saveCursorAndScroll () {return __get__ (this, function (self) {
/* 002403 */ 		var v = self;
/* 002403 */ 		var c = v.context;
/* 002404 */ 		var w = c.frame.body;
/* 002405 */ 		if (!(w)) {
/* 002406 */ 			return ;
/* 002406 */ 		}
/* 002407 */ 		try {
/* 002408 */ 			v.scrollBarSpot = w.getYScrollPosition ();
/* 002409 */ 			v.insertSpot = w.getInsertPoint ();
/* 002409 */ 		}
/* 002409 */ 		catch (__except0__) {
/* 002409 */ 			if (isinstance (__except0__, AttributeError)) {
/* 002412 */ 				// pass;
/* 002412 */ 			}
/* 002412 */ 			else {
/* 002412 */ 				throw __except0__;
/* 002412 */ 			}
/* 002412 */ 		}
/* 002412 */ 	});},
/* 002414 */ 	unicode_warning_given: false,
/* 002416 */ 	get setBodyString () {return __get__ (this, function (self, s) {
/* 002417 */ 		var v = self;
/* 002418 */ 		if (isinstance (s, str)) {
/* 002419 */ 			v._bodyString = s;
/* 002420 */ 			return ;
/* 002420 */ 		}
/* 002421 */ 		try {
/* 002422 */ 			v._bodyString = g.toUnicode (s, __kwargtrans__ ({reportErrors: true}));
/* 002422 */ 		}
/* 002422 */ 		catch (__except0__) {
/* 002422 */ 			if (isinstance (__except0__, Exception)) {
/* 002424 */ 				if (!(self.unicode_warning_given)) {
/* 002425 */ 					self.unicode_warning_given = true;
/* 002426 */ 					g.internalError (s);
/* 002427 */ 					g.es_exception ();
/* 002427 */ 				}
/* 002427 */ 			}
/* 002427 */ 			else {
/* 002427 */ 				throw __except0__;
/* 002427 */ 			}
/* 002427 */ 		}
/* 002428 */ 		self.contentModified ();
/* 002429 */ 		sig.emit (self.context, 'body_changed', self);
/* 002429 */ 	});},
/* 002431 */ 	get setHeadString () {return __get__ (this, function (self, s) {
/* 002434 */ 		var v = self;
/* 002435 */ 		if (g.isUnicode (s)) {
/* 002436 */ 			v._headString = s.py_replace ('\n', '');
/* 002437 */ 			return ;
/* 002437 */ 		}
/* 002438 */ 		var s = g.toUnicode (s, __kwargtrans__ ({reportErrors: true}));
/* 002439 */ 		v._headString = s.py_replace ('\n', '');
/* 002440 */ 		self.contentModified ();
/* 002440 */ 	});},
/* 002442 */ 	initBodyString: setBodyString,
/* 002443 */ 	initHeadString: setHeadString,
/* 002444 */ 	setHeadText: setHeadString,
/* 002445 */ 	setTnodeText: setBodyString,
/* 002447 */ 	get setSelection () {return __get__ (this, function (self, start, length) {
/* 002448 */ 		var v = self;
/* 002449 */ 		v.selectionStart = start;
/* 002450 */ 		v.selectionLength = length;
/* 002450 */ 	});},
/* 002452 */ 	get setAllAncestorAtFileNodesDirty () {return __get__ (this, function (self) {
/* 002458 */ 		var v = self;
/* 002459 */ 		var hiddenRootVnode = v.context.hiddenRootNode;
/* 002461 */ 		var v_and_parents = function* (v) {
/* 002462 */ 			if (v != hiddenRootVnode) {
/* 002462 */ 				yield v;
/* 002464 */ 				for (var parent_v of v.parents) {
/* 002465 */ 					yield* v_and_parents (parent_v);
/* 002465 */ 				}
/* 002465 */ 			}
/* 002465 */ 			};
/* 002469 */ 		for (var v2 of v_and_parents (v)) {
/* 002470 */ 			if (v2.isAnyAtFileNode ()) {
/* 002471 */ 				v2.setDirty ();
/* 002471 */ 			}
/* 002471 */ 		}
/* 002471 */ 	});},
/* 002473 */ 	get cloneAsNthChild () {return __get__ (this, function (self, parent_v, n) {
/* 002475 */ 		var v = self;
/* 002476 */ 		v._linkAsNthChild (parent_v, n);
/* 002477 */ 		return v;
/* 002477 */ 	});},
/* 002479 */ 	get insertAsFirstChild () {return __get__ (this, function (self) {
/* 002480 */ 		var v = self;
/* 002481 */ 		return v.insertAsNthChild (0);
/* 002481 */ 	});},
/* 002483 */ 	get insertAsLastChild () {return __get__ (this, function (self) {
/* 002484 */ 		var v = self;
/* 002485 */ 		return v.insertAsNthChild (len (v.children));
/* 002485 */ 	});},
/* 002487 */ 	get insertAsNthChild () {return __get__ (this, function (self, n) {
/* 002488 */ 		var v = self;
/* 002490 */ 		var v2 = VNode (v.context);
/* 002491 */ 		v2._linkAsNthChild (v, n);
/* 002493 */ 		return v2;
/* 002493 */ 	});},
/* 002496 */ 	get _addCopiedLink () {return __get__ (this, function (self, childIndex, parent_v) {
/* 002498 */ 		var v = self;
/* 002498 */ 		v.context.frame.tree.generation++;
/* 002500 */ 		parent_v.childrenModified ();
/* 002503 */ 		parent_v.children.insert (childIndex, v);
/* 002504 */ 		v.parents.append (parent_v);
/* 002506 */ 		v._p_changed = 1;
/* 002507 */ 		parent_v._p_changed = 1;
/* 002507 */ 	});},
/* 002509 */ 	get _addLink () {return __get__ (this, function (self, childIndex, parent_v) {
/* 002511 */ 		var v = self;
/* 002511 */ 		v.context.frame.tree.generation++;
/* 002513 */ 		parent_v.childrenModified ();
/* 002516 */ 		parent_v.children.insert (childIndex, v);
/* 002517 */ 		v.parents.append (parent_v);
/* 002519 */ 		v._p_changed = 1;
/* 002520 */ 		parent_v._p_changed = 1;
/* 002524 */ 		if (len (v.parents) == 1) {
/* 002525 */ 			for (var child of v.children) {
/* 002526 */ 				child._addParentLinks (__kwargtrans__ ({parent: v}));
/* 002526 */ 			}
/* 002526 */ 		}
/* 002526 */ 	});},
/* 002528 */ 	get _addParentLinks () {return __get__ (this, function (self, parent) {
/* 002530 */ 		var v = self;
/* 002531 */ 		v.parents.append (parent);
/* 002532 */ 		if (len (v.parents) == 1) {
/* 002533 */ 			for (var child of v.children) {
/* 002534 */ 				child._addParentLinks (__kwargtrans__ ({parent: v}));
/* 002534 */ 			}
/* 002534 */ 		}
/* 002534 */ 	});},
/* 002536 */ 	get _cutLink () {return __get__ (this, function (self, childIndex, parent_v) {
/* 002538 */ 		var v = self;
/* 002538 */ 		v.context.frame.tree.generation++;
/* 002540 */ 		parent_v.childrenModified ();
/* 002540 */ 		delete parent_v.children [childIndex];
/* 002543 */ 		if (__in__ (parent_v, v.parents)) {
/* 002544 */ 			try {
/* 002545 */ 				v.parents.remove (parent_v);
/* 002545 */ 			}
/* 002545 */ 			catch (__except0__) {
/* 002545 */ 				if (isinstance (__except0__, ValueError)) {
/* 002547 */ 					g.internalError ('{} not in parents of {}'.format (parent_v, v));
/* 002548 */ 					g.trace ('v.parents:');
/* 002549 */ 					g.printObj (v.parents);
/* 002549 */ 				}
/* 002549 */ 				else {
/* 002549 */ 					throw __except0__;
/* 002549 */ 				}
/* 002549 */ 			}
/* 002549 */ 		}
/* 002550 */ 		v._p_changed = 1;
/* 002551 */ 		parent_v._p_changed = 1;
/* 002555 */ 		if (!(v.parents)) {
/* 002556 */ 			for (var child of v.children) {
/* 002557 */ 				child._cutParentLinks (__kwargtrans__ ({parent: v}));
/* 002557 */ 			}
/* 002557 */ 		}
/* 002557 */ 	});},
/* 002559 */ 	get _cutParentLinks () {return __get__ (this, function (self, parent) {
/* 002561 */ 		var v = self;
/* 002562 */ 		v.parents.remove (parent);
/* 002563 */ 		if (!(v.parents)) {
/* 002564 */ 			for (var child of v.children) {
/* 002565 */ 				child._cutParentLinks (__kwargtrans__ ({parent: v}));
/* 002565 */ 			}
/* 002565 */ 		}
/* 002565 */ 	});},
/* 002567 */ 	get _deleteAllChildren () {return __get__ (this, function (self) {
/* 002574 */ 		var v = self;
/* 002575 */ 		for (var v2 of v.children) {
/* 002576 */ 			try {
/* 002577 */ 				v2.parents.remove (v);
/* 002577 */ 			}
/* 002577 */ 			catch (__except0__) {
/* 002577 */ 				if (isinstance (__except0__, ValueError)) {
/* 002579 */ 					g.internalError ('{} not in parents of {}'.format (v, v2));
/* 002580 */ 					g.trace ('v2.parents:');
/* 002581 */ 					g.printObj (v2.parents);
/* 002581 */ 				}
/* 002581 */ 				else {
/* 002581 */ 					throw __except0__;
/* 002581 */ 				}
/* 002581 */ 			}
/* 002581 */ 		}
/* 002582 */ 		v.children = [];
/* 002582 */ 	});},
/* 002584 */ 	get _linkAsNthChild () {return __get__ (this, function (self, parent_v, n) {
/* 002586 */ 		var v = self;
/* 002587 */ 		v._addLink (n, parent_v);
/* 002587 */ 	});},
/* 002590 */ 	get __get_b () {return __get__ (this, function (self) {
/* 002591 */ 		var v = self;
/* 002592 */ 		return v.bodyString ();
/* 002592 */ 	});},
/* 002594 */ 	get __set_b () {return __get__ (this, function (self, val) {
/* 002595 */ 		var v = self;
/* 002596 */ 		v.setBodyString (val);
/* 002596 */ 	});},
/* 002602 */ 	get __get_h () {return __get__ (this, function (self) {
/* 002603 */ 		var v = self;
/* 002604 */ 		return v.headString ();
/* 002604 */ 	});},
/* 002606 */ 	get __set_h () {return __get__ (this, function (self, val) {
/* 002607 */ 		var v = self;
/* 002608 */ 		v.setHeadString (val);
/* 002608 */ 	});},
/* 002614 */ 	get __get_u () {return __get__ (this, function (self) {
/* 002615 */ 		var v = self;
/* 002618 */ 		if (!(hasattr (v, 'unknownAttributes'))) {
/* 002619 */ 			v.unknownAttributes = dict ({});
/* 002619 */ 		}
/* 002620 */ 		return v.unknownAttributes;
/* 002620 */ 	});},
/* 002622 */ 	get __set_u () {return __get__ (this, function (self, val) {
/* 002623 */ 		var v = self;
/* 002624 */ 		if (val === null) {
/* 002625 */ 			if (hasattr (v, 'unknownAttributes')) {
/* 002626 */ 				delattr (v, 'unknownAttributes');
/* 002626 */ 			}
/* 002626 */ 		}
/* 002627 */ 		else if (isinstance (val, dict)) {
/* 002628 */ 			v.unknownAttributes = val;
/* 002628 */ 		}
/* 002629 */ 		else {
/* 002630 */ 			var __except0__ = ValueError;
/* 002630 */ 			__except0__.__cause__ = null;
/* 002630 */ 			throw __except0__;
/* 002630 */ 		}
/* 002630 */ 	});},
/* 002636 */ 	get __get_gnx () {return __get__ (this, function (self) {
/* 002637 */ 		var v = self;
/* 002638 */ 		return v.fileIndex;
/* 002638 */ 	});}
/* 002638 */ });
/* 002598 */ Object.defineProperty (VNode, 'b', property.call (VNode, VNode.__get_b, VNode.__set_b));
/* 002610 */ Object.defineProperty (VNode, 'h', property.call (VNode, VNode.__get_h, VNode.__set_h));
/* 002632 */ Object.defineProperty (VNode, 'u', property.call (VNode, VNode.__get_u, VNode.__set_u));
/* 002640 */ Object.defineProperty (VNode, 'gnx', property.call (VNode, VNode.__get_gnx));
/* 002644 */ export var vnode = VNode;
/* 000013 */ 
//# sourceMappingURL=leoNodes.map