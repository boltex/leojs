/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 08:42:32
/* 000014 */ import {} from './org.transcrypt.__runtime__.js';
/* 000015 */ import {translate} from './re.translate.js';
/* 000014 */ export {translate};
/* 000001 */ var __name__ = 're';
/* 000019 */ export var T = 1 << 0;
/* 000020 */ export var TEMPLATE = T;
/* 000022 */ export var I = 1 << 1;
/* 000023 */ export var IGNORECASE = I;
/* 000026 */ export var L = 1 << 2;
/* 000027 */ export var LOCALE = L;
/* 000029 */ export var M = 1 << 3;
/* 000030 */ export var MULTILINE = M;
/* 000032 */ export var S = 1 << 4;
/* 000033 */ export var DOTALL = S;
/* 000035 */ export var U = 1 << 5;
/* 000036 */ export var UNICODE = U;
/* 000037 */ export var X = 1 << 6;
/* 000038 */ export var VERBOSE = X;
/* 000039 */ export var DEBUG = 1 << 7;
/* 000041 */ export var A = 1 << 8;
/* 000042 */ export var ASCII = A;
/* 000045 */ export var Y = 1 << 16;
/* 000046 */ export var STICKY = Y;
/* 000047 */ export var G = 1 << 17;
/* 000048 */ export var GLOBAL = G;
/* 000052 */ export var J = 1 << 19;
/* 000053 */ export var JSSTRICT = J;
/* 000057 */ export var error =  __class__ ('error', [Exception], {
/* 000057 */ 	__module__: __name__,
/* 000060 */ 	get __init__ () {return __get__ (this, function (self, msg, error, pattern, flags, pos) {
/* 000060 */ 		if (typeof pattern == 'undefined' || (pattern != null && pattern.hasOwnProperty ("__kwargtrans__"))) {;
/* 000060 */ 			var pattern = null;
/* 000060 */ 		};
/* 000060 */ 		if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000060 */ 			var flags = 0;
/* 000060 */ 		};
/* 000060 */ 		if (typeof pos == 'undefined' || (pos != null && pos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000060 */ 			var pos = null;
/* 000060 */ 		};
/* 000063 */ 		Exception.__init__ (self, msg, __kwargtrans__ ({error: error}));
/* 000064 */ 		self.pattern = pattern;
/* 000065 */ 		self.flags = flags;
/* 000066 */ 		self.pos = pos;
/* 000066 */ 	});}
/* 000066 */ });
/* 000069 */ export var ReIndexError =  __class__ ('ReIndexError', [IndexError], {
/* 000069 */ 	__module__: __name__,
/* 000073 */ 	get __init__ () {return __get__ (this, function (self) {
/* 000074 */ 		IndexError.__init__ (self, 'no such group');
/* 000074 */ 	});}
/* 000074 */ });
/* 000076 */ export var Match =  __class__ ('Match', [object], {
/* 000076 */ 	__module__: __name__,
/* 000079 */ 	get __init__ () {return __get__ (this, function (self, mObj, string, pos, endpos, rObj, namedGroups) {
/* 000079 */ 		if (typeof namedGroups == 'undefined' || (namedGroups != null && namedGroups.hasOwnProperty ("__kwargtrans__"))) {;
/* 000079 */ 			var namedGroups = null;
/* 000079 */ 		};
/* 000087 */ 		for (var [index, match] of enumerate (mObj)) {
/* 000088 */ 			mObj [index] = (mObj [index] == undefined ? null : mObj [index]);
/* 000088 */ 		}
/* 000089 */ 		self._obj = mObj;
/* 000091 */ 		self._pos = pos;
/* 000092 */ 		self._endpos = endpos;
/* 000093 */ 		self._re = rObj;
/* 000094 */ 		self._string = string;
/* 000096 */ 		self._namedGroups = namedGroups;
/* 000098 */ 		self._lastindex = self._lastMatchGroup ();
/* 000099 */ 		if (self._namedGroups !== null) {
/* 000100 */ 			self._lastgroup = self._namedGroups [self._lastindex];
/* 000100 */ 		}
/* 000101 */ 		else {
/* 000105 */ 			self._lastgroup = null;
/* 000105 */ 		}
/* 000105 */ 	});},
/* 000108 */ 	get _getPos () {return __get__ (this, function (self) {
/* 000109 */ 		return self._pos;
/* 000109 */ 	});},
/* 000110 */ 	get _setPos () {return __get__ (this, function (self, val) {
/* 000111 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000111 */ 		__except0__.__cause__ = null;
/* 000111 */ 		throw __except0__;
/* 000111 */ 	});},
/* 000114 */ 	get _getEndPos () {return __get__ (this, function (self) {
/* 000115 */ 		return self._endpos;
/* 000115 */ 	});},
/* 000116 */ 	get _setEndPos () {return __get__ (this, function (self, val) {
/* 000117 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000117 */ 		__except0__.__cause__ = null;
/* 000117 */ 		throw __except0__;
/* 000117 */ 	});},
/* 000120 */ 	get _getRe () {return __get__ (this, function (self) {
/* 000121 */ 		return self._re;
/* 000121 */ 	});},
/* 000122 */ 	get _setRe () {return __get__ (this, function (self, val) {
/* 000123 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000123 */ 		__except0__.__cause__ = null;
/* 000123 */ 		throw __except0__;
/* 000123 */ 	});},
/* 000126 */ 	get _getString () {return __get__ (this, function (self) {
/* 000127 */ 		return self._string;
/* 000127 */ 	});},
/* 000128 */ 	get _setString () {return __get__ (this, function (self, val) {
/* 000129 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000129 */ 		__except0__.__cause__ = null;
/* 000129 */ 		throw __except0__;
/* 000129 */ 	});},
/* 000132 */ 	get _getLastGroup () {return __get__ (this, function (self) {
/* 000133 */ 		return self._lastgroup;
/* 000133 */ 	});},
/* 000134 */ 	get _setLastGroup () {return __get__ (this, function (self, val) {
/* 000135 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000135 */ 		__except0__.__cause__ = null;
/* 000135 */ 		throw __except0__;
/* 000135 */ 	});},
/* 000138 */ 	get _getLastIndex () {return __get__ (this, function (self) {
/* 000139 */ 		return self._lastindex;
/* 000139 */ 	});},
/* 000140 */ 	get _setLastIndex () {return __get__ (this, function (self, val) {
/* 000141 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000141 */ 		__except0__.__cause__ = null;
/* 000141 */ 		throw __except0__;
/* 000141 */ 	});},
/* 000144 */ 	get _lastMatchGroup () {return __get__ (this, function (self) {
/* 000147 */ 		if (len (self._obj) > 1) {
/* 000148 */ 			for (var i = len (self._obj) - 1; i > 0; i--) {
/* 000149 */ 				if (self._obj [i] !== null) {
/* 000150 */ 					return i;
/* 000150 */ 				}
/* 000150 */ 			}
/* 000153 */ 			return null;
/* 000153 */ 		}
/* 000154 */ 		else {
/* 000156 */ 			return null;
/* 000156 */ 		}
/* 000156 */ 	});},
/* 000158 */ 	get expand () {return __get__ (this, function (self, template) {
/* 000161 */ 		var __except0__ = NotImplementedError ();
/* 000161 */ 		__except0__.__cause__ = null;
/* 000161 */ 		throw __except0__;
/* 000161 */ 	});},
/* 000163 */ 	get group () {return __get__ (this, function (self) {
/* 000163 */ 		var args = tuple ([].slice.apply (arguments).slice (1));
/* 000168 */ 		var ret = [];
/* 000169 */ 		if (len (args) > 0) {
/* 000170 */ 			for (var index of args) {
/* 000171 */ 				if (py_typeof (index) === str) {
/* 000172 */ 					if (self._namedGroups !== null) {
/* 000173 */ 						if (!__in__ (index, self._namedGroups.py_keys ())) {
/* 000174 */ 							var __except0__ = ReIndexError ();
/* 000174 */ 							__except0__.__cause__ = null;
/* 000174 */ 							throw __except0__;
/* 000174 */ 						}
/* 000175 */ 						ret.append (self._obj [self._namedGroups [index]]);
/* 000175 */ 					}
/* 000176 */ 					else {
/* 000177 */ 						var __except0__ = NotImplementedError ('No NamedGroups Available');
/* 000177 */ 						__except0__.__cause__ = null;
/* 000177 */ 						throw __except0__;
/* 000177 */ 					}
/* 000177 */ 				}
/* 000178 */ 				else {
/* 000179 */ 					if (index >= len (self._obj)) {
/* 000183 */ 						var __except0__ = ReIndexError ();
/* 000183 */ 						__except0__.__cause__ = null;
/* 000183 */ 						throw __except0__;
/* 000183 */ 					}
/* 000184 */ 					ret.append (self._obj [index]);
/* 000184 */ 				}
/* 000184 */ 			}
/* 000184 */ 		}
/* 000185 */ 		else {
/* 000186 */ 			ret.append (self._obj [0]);
/* 000186 */ 		}
/* 000188 */ 		if (len (ret) == 1) {
/* 000189 */ 			return ret [0];
/* 000189 */ 		}
/* 000190 */ 		else {
/* 000191 */ 			return tuple (ret);
/* 000191 */ 		}
/* 000191 */ 	});},
/* 000193 */ 	get groups () {return __get__ (this, function (self, py_default) {
/* 000193 */ 		if (typeof py_default == 'undefined' || (py_default != null && py_default.hasOwnProperty ("__kwargtrans__"))) {;
/* 000193 */ 			var py_default = null;
/* 000193 */ 		};
/* 000198 */ 		if (len (self._obj) > 1) {
/* 000199 */ 			var ret = self._obj.__getslice__ (1, null, 1);
/* 000200 */ 			return tuple ((function () {
/* 000200 */ 				var __accu0__ = [];
/* 000200 */ 				for (var x of ret) {
/* 000200 */ 					__accu0__.append ((x !== null ? x : py_default));
/* 000200 */ 				}
/* 000200 */ 				return __accu0__;
/* 000200 */ 			}) ());
/* 000200 */ 		}
/* 000201 */ 		else {
/* 000202 */ 			return tuple ();
/* 000202 */ 		}
/* 000202 */ 	});},
/* 000204 */ 	get groupdict () {return __get__ (this, function (self, py_default) {
/* 000204 */ 		if (typeof py_default == 'undefined' || (py_default != null && py_default.hasOwnProperty ("__kwargtrans__"))) {;
/* 000204 */ 			var py_default = null;
/* 000204 */ 		};
/* 000210 */ 		if (self._namedGroups !== null) {
/* 000211 */ 			var ret = dict ({});
/* 000212 */ 			for (var [gName, gId] of self._namedGroups.py_items ()) {
/* 000213 */ 				var value = self._obj [gId];
/* 000214 */ 				ret [gName] = (value !== null ? value : py_default);
/* 000214 */ 			}
/* 000215 */ 			return ret;
/* 000215 */ 		}
/* 000216 */ 		else {
/* 000218 */ 			var __except0__ = NotImplementedError ('No NamedGroups Available');
/* 000218 */ 			__except0__.__cause__ = null;
/* 000218 */ 			throw __except0__;
/* 000218 */ 		}
/* 000218 */ 	});},
/* 000220 */ 	get start () {return __get__ (this, function (self, group) {
/* 000220 */ 		if (typeof group == 'undefined' || (group != null && group.hasOwnProperty ("__kwargtrans__"))) {;
/* 000220 */ 			var group = 0;
/* 000220 */ 		};
/* 000230 */ 		var gId = 0;
/* 000231 */ 		if (py_typeof (group) === str) {
/* 000232 */ 			if (self._namedGroups !== null) {
/* 000233 */ 				if (!__in__ (group, self._namedGroups.py_keys ())) {
/* 000234 */ 					var __except0__ = ReIndexError ();
/* 000234 */ 					__except0__.__cause__ = null;
/* 000234 */ 					throw __except0__;
/* 000234 */ 				}
/* 000235 */ 				var gId = self._namedGroups [group];
/* 000235 */ 			}
/* 000236 */ 			else {
/* 000237 */ 				var __except0__ = NotImplementedError ('No NamedGroups Available');
/* 000237 */ 				__except0__.__cause__ = null;
/* 000237 */ 				throw __except0__;
/* 000237 */ 			}
/* 000237 */ 		}
/* 000238 */ 		else {
/* 000239 */ 			var gId = group;
/* 000239 */ 		}
/* 000241 */ 		if (gId >= len (self._obj)) {
/* 000242 */ 			var __except0__ = ReIndexError ();
/* 000242 */ 			__except0__.__cause__ = null;
/* 000242 */ 			throw __except0__;
/* 000242 */ 		}
/* 000244 */ 		if (gId == 0) {
/* 000245 */ 			return self._obj.index;
/* 000245 */ 		}
/* 000256 */ 		else if (self._obj [gId] !== null) {
/* 000257 */ 			var r = compile (escape (self._obj [gId]), self._re.flags);
/* 000258 */ 			var m = r.search (self._obj [0]);
/* 000259 */ 			if (m) {
/* 000260 */ 				return self._obj.index + m.start ();
/* 000260 */ 			}
/* 000261 */ 			else {
/* 000262 */ 				var __except0__ = Exception ('Failed to find capture group');
/* 000262 */ 				__except0__.__cause__ = null;
/* 000262 */ 				throw __except0__;
/* 000262 */ 			}
/* 000262 */ 		}
/* 000263 */ 		else {
/* 000265 */ 			return -(1);
/* 000265 */ 		}
/* 000265 */ 	});},
/* 000267 */ 	get end () {return __get__ (this, function (self, group) {
/* 000267 */ 		if (typeof group == 'undefined' || (group != null && group.hasOwnProperty ("__kwargtrans__"))) {;
/* 000267 */ 			var group = 0;
/* 000267 */ 		};
/* 000277 */ 		var gId = 0;
/* 000278 */ 		if (py_typeof (group) === str) {
/* 000279 */ 			if (self._namedGroups !== null) {
/* 000280 */ 				if (!__in__ (group, self._namedGroups.py_keys ())) {
/* 000281 */ 					var __except0__ = ReIndexError ();
/* 000281 */ 					__except0__.__cause__ = null;
/* 000281 */ 					throw __except0__;
/* 000281 */ 				}
/* 000282 */ 				var gId = self._namedGroups [group];
/* 000282 */ 			}
/* 000283 */ 			else {
/* 000284 */ 				var __except0__ = NotImplementedError ('No NamedGroups Available');
/* 000284 */ 				__except0__.__cause__ = null;
/* 000284 */ 				throw __except0__;
/* 000284 */ 			}
/* 000284 */ 		}
/* 000285 */ 		else {
/* 000286 */ 			var gId = group;
/* 000286 */ 		}
/* 000288 */ 		if (gId >= len (self._obj)) {
/* 000289 */ 			var __except0__ = ReIndexError ();
/* 000289 */ 			__except0__.__cause__ = null;
/* 000289 */ 			throw __except0__;
/* 000289 */ 		}
/* 000291 */ 		if (gId == 0) {
/* 000292 */ 			return self._obj.index + len (self._obj [0]);
/* 000292 */ 		}
/* 000303 */ 		else if (self._obj [gId] !== null) {
/* 000304 */ 			var r = compile (escape (self._obj [gId]), self._re.flags);
/* 000305 */ 			var m = r.search (self._obj [0]);
/* 000306 */ 			if (m) {
/* 000307 */ 				return self._obj.index + m.end ();
/* 000307 */ 			}
/* 000308 */ 			else {
/* 000309 */ 				var __except0__ = Exception ('Failed to find capture group');
/* 000309 */ 				__except0__.__cause__ = null;
/* 000309 */ 				throw __except0__;
/* 000309 */ 			}
/* 000309 */ 		}
/* 000310 */ 		else {
/* 000312 */ 			return -(1);
/* 000312 */ 		}
/* 000312 */ 	});},
/* 000314 */ 	get span () {return __get__ (this, function (self, group) {
/* 000314 */ 		if (typeof group == 'undefined' || (group != null && group.hasOwnProperty ("__kwargtrans__"))) {;
/* 000314 */ 			var group = 0;
/* 000314 */ 		};
/* 000325 */ 		return tuple ([self.start (group), self.end (group)]);
/* 000325 */ 	});}
/* 000325 */ });
/* 000112 */ Object.defineProperty (Match, 'pos', property.call (Match, Match._getPos, Match._setPos));
/* 000118 */ Object.defineProperty (Match, 'endpos', property.call (Match, Match._getEndPos, Match._setEndPos));
/* 000124 */ Object.defineProperty (Match, 're', property.call (Match, Match._getRe, Match._setRe));
/* 000130 */ Object.defineProperty (Match, 'string', property.call (Match, Match._getString, Match._setString));
/* 000136 */ Object.defineProperty (Match, 'lastgroup', property.call (Match, Match._getLastGroup, Match._setLastGroup));
/* 000142 */ Object.defineProperty (Match, 'lastindex', property.call (Match, Match._getLastIndex, Match._setLastIndex));
/* 000327 */ export var Regex =  __class__ ('Regex', [object], {
/* 000327 */ 	__module__: __name__,
/* 000330 */ 	get __init__ () {return __get__ (this, function (self, pattern, flags) {
/* 000336 */ 		if (!((flags & ASCII) > 0)) {
/* 000336 */ 			flags |= UNICODE;
/* 000336 */ 		}
/* 000339 */ 		self._flags = flags;
/* 000340 */ 		var __left0__ = self._compileWrapper (pattern, flags);
/* 000340 */ 		self._jsFlags = __left0__ [0];
/* 000340 */ 		self._obj = __left0__ [1];
/* 000341 */ 		self._jspattern = pattern;
/* 000344 */ 		self._pypattern = pattern;
/* 000348 */ 		var __left0__ = self._compileWrapper (pattern + '|', flags);
/* 000348 */ 		var _ = __left0__ [0];
/* 000348 */ 		var groupCounterRegex = __left0__ [1];
/* 000349 */ 		self._groups = groupCounterRegex.exec ('').length - 1;
/* 000352 */ 		self._groupindex = null;
/* 000352 */ 	});},
/* 000355 */ 	get _getPattern () {return __get__ (this, function (self) {
/* 000356 */ 		var ret = self._pypattern.py_replace ('\\', '\\\\');
/* 000357 */ 		return ret;
/* 000357 */ 	});},
/* 000358 */ 	get _setPattern () {return __get__ (this, function (self, val) {
/* 000359 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000359 */ 		__except0__.__cause__ = null;
/* 000359 */ 		throw __except0__;
/* 000359 */ 	});},
/* 000362 */ 	get _getFlags () {return __get__ (this, function (self) {
/* 000363 */ 		return self._flags;
/* 000363 */ 	});},
/* 000364 */ 	get _setFlags () {return __get__ (this, function (self, val) {
/* 000365 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000365 */ 		__except0__.__cause__ = null;
/* 000365 */ 		throw __except0__;
/* 000365 */ 	});},
/* 000368 */ 	get _getGroups () {return __get__ (this, function (self) {
/* 000369 */ 		return self._groups;
/* 000369 */ 	});},
/* 000370 */ 	get _setGroups () {return __get__ (this, function (self, val) {
/* 000371 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000371 */ 		__except0__.__cause__ = null;
/* 000371 */ 		throw __except0__;
/* 000371 */ 	});},
/* 000374 */ 	get _getGroupIndex () {return __get__ (this, function (self) {
/* 000375 */ 		if (self._groupindex === null) {
/* 000376 */ 			return dict ({});
/* 000376 */ 		}
/* 000377 */ 		else {
/* 000378 */ 			return self._groupindex;
/* 000378 */ 		}
/* 000378 */ 	});},
/* 000379 */ 	get _setGroupIndex () {return __get__ (this, function (self, val) {
/* 000380 */ 		var __except0__ = AttributeError ('readonly attribute');
/* 000380 */ 		__except0__.__cause__ = null;
/* 000380 */ 		throw __except0__;
/* 000380 */ 	});},
/* 000383 */ 	get _compileWrapper () {return __get__ (this, function (self, pattern, flags) {
/* 000383 */ 		if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000383 */ 			var flags = 0;
/* 000383 */ 		};
/* 000389 */ 		var jsFlags = self._convertFlags (flags);
/* 000391 */ 		var rObj = null;
/* 000392 */ 		var errObj = null;
/* 000395 */ 		
/* 000395 */ 		                   try {
/* 000395 */ 		                     rObj = new RegExp(pattern, jsFlags)
/* 000395 */ 		                   } catch( err ) {
/* 000395 */ 		                     errObj = err
/* 000395 */ 		                   }
/* 000395 */ 		                   
/* 000404 */ 		if (errObj !== null) {
/* 000405 */ 			var __except0__ = error (errObj.message, errObj, pattern, flags);
/* 000405 */ 			__except0__.__cause__ = null;
/* 000405 */ 			throw __except0__;
/* 000405 */ 		}
/* 000407 */ 		return tuple ([jsFlags, rObj]);
/* 000407 */ 	});},
/* 000409 */ 	get _convertFlags () {return __get__ (this, function (self, flags) {
/* 000413 */ 		var bitmaps = [tuple ([DEBUG, '']), tuple ([IGNORECASE, 'i']), tuple ([MULTILINE, 'm']), tuple ([STICKY, 'y']), tuple ([GLOBAL, 'g']), tuple ([UNICODE, 'u'])];
/* 000421 */ 		var ret = ''.join ((function () {
/* 000421 */ 			var __accu0__ = [];
/* 000421 */ 			for (var x of bitmaps) {
/* 000421 */ 				if ((x [0] & flags) > 0) {
/* 000421 */ 					__accu0__.append (x [1]);
/* 000421 */ 				}
/* 000421 */ 			}
/* 000421 */ 			return __accu0__;
/* 000421 */ 		}) ());
/* 000422 */ 		return ret;
/* 000422 */ 	});},
/* 000424 */ 	get _getTargetStr () {return __get__ (this, function (self, string, pos, endpos) {
/* 000427 */ 		var endPtr = len (string);
/* 000428 */ 		if (endpos !== null) {
/* 000429 */ 			if (endpos < endPtr) {
/* 000430 */ 				var endPtr = endpos;
/* 000430 */ 			}
/* 000430 */ 		}
/* 000431 */ 		if (endPtr < 0) {
/* 000432 */ 			var endPtr = 0;
/* 000432 */ 		}
/* 000433 */ 		var ret = string.__getslice__ (pos, endPtr, 1);
/* 000434 */ 		return ret;
/* 000434 */ 	});},
/* 000436 */ 	get _patternHasCaptures () {return __get__ (this, function (self) {
/* 000440 */ 		return self._groups > 0;
/* 000440 */ 	});},
/* 000442 */ 	get search () {return __get__ (this, function (self, string, pos, endpos) {
/* 000442 */ 		if (typeof pos == 'undefined' || (pos != null && pos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000442 */ 			var pos = 0;
/* 000442 */ 		};
/* 000442 */ 		if (typeof endpos == 'undefined' || (endpos != null && endpos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000442 */ 			var endpos = null;
/* 000442 */ 		};
/* 000446 */ 		if (endpos === null) {
/* 000447 */ 			var endpos = len (string);
/* 000447 */ 		}
/* 000451 */ 		var rObj = self._obj;
/* 000452 */ 		var m = rObj.exec (string);
/* 000453 */ 		if (m) {
/* 000454 */ 			if (m.index < pos || m.index > endpos) {
/* 000455 */ 				return null;
/* 000455 */ 			}
/* 000456 */ 			else {
/* 000458 */ 				return Match (m, string, pos, endpos, self, self._groupindex);
/* 000458 */ 			}
/* 000458 */ 		}
/* 000459 */ 		else {
/* 000460 */ 			return null;
/* 000460 */ 		}
/* 000460 */ 	});},
/* 000462 */ 	get match () {return __get__ (this, function (self, string, pos, endpos) {
/* 000462 */ 		if (typeof pos == 'undefined' || (pos != null && pos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000462 */ 			var pos = 0;
/* 000462 */ 		};
/* 000462 */ 		if (typeof endpos == 'undefined' || (endpos != null && endpos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000462 */ 			var endpos = null;
/* 000462 */ 		};
/* 000466 */ 		var target = string;
/* 000467 */ 		if (endpos !== null) {
/* 000468 */ 			var target = target.__getslice__ (0, endpos, 1);
/* 000468 */ 		}
/* 000469 */ 		else {
/* 000470 */ 			var endpos = len (string);
/* 000470 */ 		}
/* 000472 */ 		var rObj = self._obj;
/* 000473 */ 		var m = rObj.exec (target);
/* 000474 */ 		if (m) {
/* 000476 */ 			if (m.index == pos) {
/* 000477 */ 				return Match (m, string, pos, endpos, self, self._groupindex);
/* 000477 */ 			}
/* 000478 */ 			else {
/* 000479 */ 				return null;
/* 000479 */ 			}
/* 000479 */ 		}
/* 000480 */ 		else {
/* 000481 */ 			return null;
/* 000481 */ 		}
/* 000481 */ 	});},
/* 000483 */ 	get fullmatch () {return __get__ (this, function (self, string, pos, endpos) {
/* 000483 */ 		if (typeof pos == 'undefined' || (pos != null && pos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000483 */ 			var pos = 0;
/* 000483 */ 		};
/* 000483 */ 		if (typeof endpos == 'undefined' || (endpos != null && endpos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000483 */ 			var endpos = null;
/* 000483 */ 		};
/* 000487 */ 		var target = string;
/* 000488 */ 		var strEndPos = len (string);
/* 000489 */ 		if (endpos !== null) {
/* 000490 */ 			var target = target.__getslice__ (0, endpos, 1);
/* 000491 */ 			var strEndPos = endpos;
/* 000491 */ 		}
/* 000493 */ 		var rObj = self._obj;
/* 000494 */ 		var m = rObj.exec (target);
/* 000495 */ 		if (m) {
/* 000496 */ 			var obsEndPos = m.index + len (m [0]);
/* 000497 */ 			if (m.index == pos && obsEndPos == strEndPos) {
/* 000498 */ 				return Match (m, string, pos, strEndPos, self, self._groupindex);
/* 000498 */ 			}
/* 000499 */ 			else {
/* 000500 */ 				return null;
/* 000500 */ 			}
/* 000500 */ 		}
/* 000501 */ 		else {
/* 000502 */ 			return null;
/* 000502 */ 		}
/* 000502 */ 	});},
/* 000504 */ 	get py_split () {return __get__ (this, function (self, string, maxsplit) {
/* 000504 */ 		if (typeof maxsplit == 'undefined' || (maxsplit != null && maxsplit.hasOwnProperty ("__kwargtrans__"))) {;
/* 000504 */ 			var maxsplit = 0;
/* 000504 */ 		};
/* 000519 */ 		if (maxsplit < 0) {
/* 000520 */ 			return [string];
/* 000520 */ 		}
/* 000522 */ 		var mObj = null;
/* 000523 */ 		var rObj = self._obj;
/* 000524 */ 		if (maxsplit == 0) {
/* 000525 */ 			var mObj = string.py_split (rObj);
/* 000526 */ 			return mObj;
/* 000526 */ 		}
/* 000527 */ 		else {
/* 000532 */ 			var flags = self._flags;
/* 000532 */ 			flags |= GLOBAL;
/* 000535 */ 			var __left0__ = self._compileWrapper (self._jspattern, flags);
/* 000535 */ 			var _ = __left0__ [0];
/* 000535 */ 			var rObj = __left0__ [1];
/* 000536 */ 			var ret = [];
/* 000537 */ 			var lastM = null;
/* 000538 */ 			var cnt = 0;
/* 000539 */ 			for (var i = 0; i < maxsplit; i++) {
/* 000540 */ 				var m = rObj.exec (string);
/* 000541 */ 				if (m) {
/* 000541 */ 					cnt++;
/* 000543 */ 					if (lastM !== null) {
/* 000545 */ 						var start = lastM.index + len (lastM [0]);
/* 000546 */ 						var head = string.__getslice__ (start, m.index, 1);
/* 000547 */ 						ret.append (head);
/* 000548 */ 						if (len (m) > 1) {
/* 000549 */ 							ret.extend (m.__getslice__ (1, null, 1));
/* 000549 */ 						}
/* 000549 */ 					}
/* 000550 */ 					else {
/* 000552 */ 						var head = string.__getslice__ (0, m.index, 1);
/* 000553 */ 						ret.append (head);
/* 000554 */ 						if (len (m) > 1) {
/* 000555 */ 							ret.extend (m.__getslice__ (1, null, 1));
/* 000555 */ 						}
/* 000555 */ 					}
/* 000556 */ 					var lastM = m;
/* 000556 */ 				}
/* 000557 */ 				else {
/* 000557 */ 					break;
/* 000557 */ 				}
/* 000557 */ 			}
/* 000560 */ 			if (lastM !== null) {
/* 000561 */ 				var endPos = lastM.index + len (lastM [0]);
/* 000562 */ 				var end = string.__getslice__ (endPos, null, 1);
/* 000563 */ 				ret.append (end);
/* 000563 */ 			}
/* 000565 */ 			return ret;
/* 000565 */ 		}
/* 000565 */ 	});},
/* 000567 */ 	get _findAllMatches () {return __get__ (this, function (self, string, pos, endpos) {
/* 000567 */ 		if (typeof pos == 'undefined' || (pos != null && pos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000567 */ 			var pos = 0;
/* 000567 */ 		};
/* 000567 */ 		if (typeof endpos == 'undefined' || (endpos != null && endpos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000567 */ 			var endpos = null;
/* 000567 */ 		};
/* 000568 */ 		var target = self._getTargetStr (string, pos, endpos);
/* 000574 */ 		var flags = self._flags;
/* 000574 */ 		flags |= GLOBAL;
/* 000577 */ 		var __left0__ = self._compileWrapper (self._jspattern, flags);
/* 000577 */ 		var _ = __left0__ [0];
/* 000577 */ 		var rObj = __left0__ [1];
/* 000578 */ 		var ret = [];
/* 000579 */ 		while (true) {
/* 000580 */ 			var m = rObj.exec (target);
/* 000581 */ 			if (m) {
/* 000582 */ 				ret.append (m);
/* 000582 */ 			}
/* 000583 */ 			else {
/* 000583 */ 				break;
/* 000583 */ 			}
/* 000583 */ 		}
/* 000585 */ 		return ret;
/* 000585 */ 	});},
/* 000587 */ 	get findall () {return __get__ (this, function (self, string, pos, endpos) {
/* 000587 */ 		if (typeof pos == 'undefined' || (pos != null && pos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000587 */ 			var pos = 0;
/* 000587 */ 		};
/* 000587 */ 		if (typeof endpos == 'undefined' || (endpos != null && endpos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000587 */ 			var endpos = null;
/* 000587 */ 		};
/* 000596 */ 		var mlist = self._findAllMatches (string, pos, endpos);
/* 000598 */ 		var mSelect = function (m) {
/* 000599 */ 			if (len (m) > 2) {
/* 000602 */ 				return tuple (m.__getslice__ (1, null, 1));
/* 000602 */ 			}
/* 000603 */ 			else if (len (m) == 2) {
/* 000605 */ 				return m [1];
/* 000605 */ 			}
/* 000606 */ 			else {
/* 000608 */ 				return m [0];
/* 000608 */ 			}
/* 000608 */ 		};
/* 000610 */ 		var ret = map (mSelect, mlist);
/* 000612 */ 		return ret;
/* 000612 */ 	});},
/* 000614 */ 	get finditer () {return __get__ (this, function (self, string, pos, endpos) {
/* 000614 */ 		if (typeof endpos == 'undefined' || (endpos != null && endpos.hasOwnProperty ("__kwargtrans__"))) {;
/* 000614 */ 			var endpos = null;
/* 000614 */ 		};
/* 000619 */ 		var mlist = self._findAllMatches (string, pos, endpos);
/* 000620 */ 		var ret = map ((function __lambda__ (m) {
/* 000620 */ 			return Match (m, string, 0, len (string), self, self._groupindex);
/* 000620 */ 		}), mlist);
/* 000621 */ 		return py_iter (ret);
/* 000621 */ 	});},
/* 000623 */ 	get sub () {return __get__ (this, function (self, repl, string, count) {
/* 000623 */ 		if (typeof count == 'undefined' || (count != null && count.hasOwnProperty ("__kwargtrans__"))) {;
/* 000623 */ 			var count = 0;
/* 000623 */ 		};
/* 000634 */ 		var __left0__ = self.subn (repl, string, count);
/* 000634 */ 		var ret = __left0__ [0];
/* 000634 */ 		var _ = __left0__ [1];
/* 000635 */ 		return ret;
/* 000635 */ 	});},
/* 000637 */ 	get subn () {return __get__ (this, function (self, repl, string, count) {
/* 000637 */ 		if (typeof count == 'undefined' || (count != null && count.hasOwnProperty ("__kwargtrans__"))) {;
/* 000637 */ 			var count = 0;
/* 000637 */ 		};
/* 000648 */ 		var flags = self._flags;
/* 000648 */ 		flags |= GLOBAL;
/* 000651 */ 		var __left0__ = self._compileWrapper (self._jspattern, flags);
/* 000651 */ 		var _ = __left0__ [0];
/* 000651 */ 		var rObj = __left0__ [1];
/* 000652 */ 		var ret = '';
/* 000653 */ 		var totalMatch = 0;
/* 000654 */ 		var lastEnd = -(1);
/* 000655 */ 		while (true) {
/* 000656 */ 			if (count > 0) {
/* 000657 */ 				if (totalMatch >= count) {
/* 000658 */ 					if (lastEnd < 0) {
/* 000661 */ 						return tuple ([ret, totalMatch]);
/* 000661 */ 					}
/* 000662 */ 					else {
/* 000662 */ 						ret += string.__getslice__ (lastEnd, m.index, 1);
/* 000664 */ 						return tuple ([ret, totalMatch]);
/* 000664 */ 					}
/* 000664 */ 				}
/* 000664 */ 			}
/* 000666 */ 			var m = rObj.exec (string);
/* 000667 */ 			if (m) {
/* 000668 */ 				if (lastEnd < 0) {
/* 000668 */ 					ret += string.__getslice__ (0, m.index, 1);
/* 000668 */ 				}
/* 000671 */ 				else {
/* 000671 */ 					ret += string.__getslice__ (lastEnd, m.index, 1);
/* 000671 */ 				}
/* 000675 */ 				if (callable (repl)) {
/* 000676 */ 					var content = repl (Match (m, string, 0, len (string), self, self._groupindex));
/* 000676 */ 					ret += content;
/* 000676 */ 				}
/* 000678 */ 				else {
/* 000678 */ 					ret += repl;
/* 000678 */ 				}
/* 000678 */ 				totalMatch++;
/* 000684 */ 				var lastEnd = m.index + len (m [0]);
/* 000684 */ 			}
/* 000688 */ 			else if (lastEnd < 0) {
/* 000691 */ 				return tuple ([string, 0]);
/* 000691 */ 			}
/* 000692 */ 			else {
/* 000692 */ 				ret += string.__getslice__ (lastEnd, null, 1);
/* 000694 */ 				return tuple ([ret, totalMatch]);
/* 000694 */ 			}
/* 000694 */ 		}
/* 000694 */ 	});}
/* 000694 */ });
/* 000360 */ Object.defineProperty (Regex, 'pattern', property.call (Regex, Regex._getPattern, Regex._setPattern));
/* 000366 */ Object.defineProperty (Regex, 'flags', property.call (Regex, Regex._getFlags, Regex._setFlags));
/* 000372 */ Object.defineProperty (Regex, 'groups', property.call (Regex, Regex._getGroups, Regex._setGroups));
/* 000381 */ Object.defineProperty (Regex, 'groupindex', property.call (Regex, Regex._getGroupIndex, Regex._setGroupIndex));
/* 000697 */ export var PyRegExp =  __class__ ('PyRegExp', [Regex], {
/* 000697 */ 	__module__: __name__,
/* 000702 */ 	get __init__ () {return __get__ (this, function (self, pyPattern, flags) {
/* 000707 */ 		var __left0__ = translate (pyPattern);
/* 000707 */ 		var jsTokens = __left0__ [0];
/* 000707 */ 		var inlineFlags = __left0__ [1];
/* 000707 */ 		var namedGroups = __left0__ [2];
/* 000707 */ 		var nCapGroups = __left0__ [3];
/* 000707 */ 		var n_splits = __left0__ [4];
/* 000707 */ 		flags |= inlineFlags;
/* 000710 */ 		var jsPattern = ''.join (jsTokens);
/* 000711 */ 		Regex.__init__ (self, jsPattern, flags);
/* 000712 */ 		self._pypattern = pyPattern;
/* 000714 */ 		self._nsplits = n_splits;
/* 000715 */ 		self._jsTokens = jsTokens;
/* 000718 */ 		self._capgroups = nCapGroups;
/* 000719 */ 		self._groupindex = namedGroups;
/* 000719 */ 	});}
/* 000719 */ });
/* 000721 */ export var compile = function (pattern, flags) {
/* 000721 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000721 */ 		var flags = 0;
/* 000721 */ 	};
/* 000725 */ 	if (flags & JSSTRICT) {
/* 000726 */ 		var p = Regex (pattern, flags);
/* 000726 */ 	}
/* 000727 */ 	else {
/* 000728 */ 		var p = PyRegExp (pattern, flags);
/* 000728 */ 	}
/* 000729 */ 	return p;
/* 000729 */ };
/* 000731 */ export var search = function (pattern, string, flags) {
/* 000731 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000731 */ 		var flags = 0;
/* 000731 */ 	};
/* 000734 */ 	var p = compile (pattern, flags);
/* 000735 */ 	return p.search (string);
/* 000735 */ };
/* 000737 */ export var match = function (pattern, string, flags) {
/* 000737 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000737 */ 		var flags = 0;
/* 000737 */ 	};
/* 000740 */ 	var p = compile (pattern, flags);
/* 000741 */ 	return p.match (string);
/* 000741 */ };
/* 000743 */ export var fullmatch = function (pattern, string, flags) {
/* 000743 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000743 */ 		var flags = 0;
/* 000743 */ 	};
/* 000746 */ 	var p = compile (pattern, flags);
/* 000747 */ 	return p.fullmatch (string);
/* 000747 */ };
/* 000749 */ export var py_split = function (pattern, string, maxsplit, flags) {
/* 000749 */ 	if (typeof maxsplit == 'undefined' || (maxsplit != null && maxsplit.hasOwnProperty ("__kwargtrans__"))) {;
/* 000749 */ 		var maxsplit = 0;
/* 000749 */ 	};
/* 000749 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000749 */ 		var flags = 0;
/* 000749 */ 	};
/* 000752 */ 	var p = compile (pattern, flags);
/* 000753 */ 	return p.py_split (string, maxsplit);
/* 000753 */ };
/* 000755 */ export var findall = function (pattern, string, flags) {
/* 000755 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000755 */ 		var flags = 0;
/* 000755 */ 	};
/* 000758 */ 	var p = compile (pattern, flags);
/* 000759 */ 	return p.findall (string);
/* 000759 */ };
/* 000761 */ export var finditer = function (pattern, string, flags) {
/* 000761 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000761 */ 		var flags = 0;
/* 000761 */ 	};
/* 000764 */ 	var p = compile (pattern, flags);
/* 000765 */ 	return p.finditer (string);
/* 000765 */ };
/* 000767 */ export var sub = function (pattern, repl, string, count, flags) {
/* 000767 */ 	if (typeof count == 'undefined' || (count != null && count.hasOwnProperty ("__kwargtrans__"))) {;
/* 000767 */ 		var count = 0;
/* 000767 */ 	};
/* 000767 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000767 */ 		var flags = 0;
/* 000767 */ 	};
/* 000770 */ 	var p = compile (pattern, flags);
/* 000771 */ 	return p.sub (repl, string, count);
/* 000771 */ };
/* 000773 */ export var subn = function (pattern, repl, string, count, flags) {
/* 000773 */ 	if (typeof count == 'undefined' || (count != null && count.hasOwnProperty ("__kwargtrans__"))) {;
/* 000773 */ 		var count = 0;
/* 000773 */ 	};
/* 000773 */ 	if (typeof flags == 'undefined' || (flags != null && flags.hasOwnProperty ("__kwargtrans__"))) {;
/* 000773 */ 		var flags = 0;
/* 000773 */ 	};
/* 000776 */ 	var p = compile (pattern, flags);
/* 000777 */ 	return p.subn (repl, string, count);
/* 000777 */ };
/* 000779 */ export var escape = function (string) {
/* 000783 */ 	var ret = null;
/* 000784 */ 	var replfunc = function (m) {
/* 000785 */ 		if (m [0] == '\\') {
/* 000786 */ 			return '\\\\\\\\';
/* 000786 */ 		}
/* 000787 */ 		else {
/* 000788 */ 			return '\\\\' + m [0];
/* 000788 */ 		}
/* 000788 */ 	};
/* 000793 */ 	
/* 000793 */ 	        var r = /[^A-Za-z:;\d]/g;
/* 000793 */ 	        ret = string.replace(r, replfunc);
/* 000793 */ 	        
/* 000799 */ 	if (ret !== null) {
/* 000800 */ 		return ret;
/* 000800 */ 	}
/* 000801 */ 	else {
/* 000802 */ 		var __except0__ = Exception ('Failed to escape the passed string');
/* 000802 */ 		__except0__.__cause__ = null;
/* 000802 */ 		throw __except0__;
/* 000802 */ 	}
/* 000802 */ };
/* 000804 */ export var purge = function () {
/* 000808 */ 	// pass;
/* 000808 */ };
/* 000014 */ 
//# sourceMappingURL=re.map