/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 08:42:32
/* 000008 */ var re = {};
/* 000008 */ import {} from './org.transcrypt.__runtime__.js';
/* 000008 */ import * as __module_re__ from './re.js';
/* 000008 */ __nest__ (re, '', __module_re__);
/* 000001 */ var __name__ = 're.translate';
/* 000012 */ export var VERBOSE = false;
/* 000014 */ export var MAX_SHIFTREDUCE_LOOPS = 1000;
/* 000016 */ export var stringFlags = 'aiLmsux';
/* 000020 */ export var Group =  __class__ ('Group', [object], {
/* 000020 */ 	__module__: __name__,
/* 000021 */ 	get __init__ () {return __get__ (this, function (self, start, end, klass) {
/* 000022 */ 		self.start = start;
/* 000023 */ 		self.end = end;
/* 000024 */ 		self.klass = klass;
/* 000024 */ 	});},
/* 000026 */ 	get __repr__ () {return __get__ (this, function (self) {
/* 000027 */ 		return str (tuple ([self.start, self.end, self.klass]));
/* 000027 */ 	});}
/* 000027 */ });
/* 000031 */ export var generateGroupSpans = function (tokens) {
/* 000032 */ 	var groupInfo = [];
/* 000034 */ 	var idx = 0;
/* 000035 */ 	for (var token of tokens) {
/* 000036 */ 		if (__t__ (token.py_name.startswith ('('))) {
/* 000037 */ 			groupInfo.append (Group (idx, null, token.py_name));
/* 000037 */ 		}
/* 000038 */ 		else if (__t__ (token.py_name == ')')) {
/* 000039 */ 			for (var group of py_reversed (groupInfo)) {
/* 000040 */ 				if (__t__ (group.end === null)) {
/* 000041 */ 					group.end = idx;
/* 000041 */ 				}
/* 000041 */ 			}
/* 000041 */ 		}
/* 000041 */ 		idx++;
/* 000041 */ 	}
/* 000043 */ 	return groupInfo;
/* 000043 */ };
/* 000046 */ export var countCaptureGroups = function (tokens) {
/* 000047 */ 	var groupInfo = generateGroupSpans (tokens);
/* 000048 */ 	var count = 0;
/* 000050 */ 	for (var token of tokens) {
/* 000051 */ 		if (__t__ (token.py_name == '(')) {
/* 000051 */ 			count++;
/* 000051 */ 		}
/* 000051 */ 	}
/* 000054 */ 	return count;
/* 000054 */ };
/* 000058 */ export var getCaptureGroup = function (groupInfo, namedGroups, groupRef) {
/* 000059 */ 	try {
/* 000060 */ 		var id = int (groupRef);
/* 000060 */ 	}
/* 000060 */ 	catch (__except0__) {
/* 000062 */ 		var id = namedGroups [groupRef];
/* 000062 */ 	}
/* 000063 */ 	var search = 0;
/* 000064 */ 	for (var group of groupInfo) {
/* 000065 */ 		if (__t__ (group.klass == '(')) {
/* 000065 */ 			search++;
/* 000067 */ 			if (__t__ (search == id)) {
/* 000068 */ 				return group;
/* 000068 */ 			}
/* 000068 */ 		}
/* 000068 */ 	}
/* 000068 */ };
/* 000080 */ export var splitIfElse = function (tokens, namedGroups) {
/* 000081 */ 	var variants = [];
/* 000082 */ 	var groupInfo = generateGroupSpans (tokens);
/* 000084 */ 	for (var group of groupInfo) {
/* 000085 */ 		if (__t__ (group.klass == '(?<')) {
/* 000086 */ 			var iff = tokens.__getslice__ (0, null, 1);
/* 000087 */ 			var els = tokens.__getslice__ (0, null, 1);
/* 000088 */ 			var conStart = group.start;
/* 000089 */ 			var conEnd = group.end;
/* 000091 */ 			var ref = tokens [conStart + 1].py_name;
/* 000092 */ 			var captureGroup = getCaptureGroup (groupInfo, namedGroups, ref);
/* 000093 */ 			var captureGroupModifier = tokens [captureGroup.end + 1];
/* 000095 */ 			if (__t__ (__t__ (__in__ (captureGroupModifier.py_name, ['?', '*'])) || captureGroupModifier.py_name.startswith ('{0,'))) {
/* 000096 */ 				if (__t__ (captureGroupModifier.py_name == '?')) {
/* 000097 */ 					iff [captureGroup.end + 1] = null;
/* 000097 */ 				}
/* 000098 */ 				else if (__t__ (captureGroupModifier.py_name == '*')) {
/* 000099 */ 					iff [captureGroup.end + 1] = Token ('+');
/* 000099 */ 				}
/* 000100 */ 				else if (__t__ (captureGroupModifier.py_name.startswith ('{0,'))) {
/* 000101 */ 					iff [captureGroup.end + 1].py_name.__setslice__ (0, 3, null, '{1,');
/* 000101 */ 				}
/* 000102 */ 				els [captureGroup.end + 1] = null;
/* 000104 */ 				var hasElse = false;
/* 000105 */ 				for (var idx = conStart; idx < conEnd; idx++) {
/* 000106 */ 					if (__t__ (tokens [idx].py_name == '|')) {
/* 000107 */ 						var hasElse = true;
/* 000108 */ 						els.py_pop (conEnd);
/* 000109 */ 						iff.__setslice__ (idx, conEnd + 1, null, []);
/* 000110 */ 						els.__setslice__ (conStart, idx + 1, null, []);
/* 000110 */ 						break;
/* 000110 */ 					}
/* 000110 */ 				}
/* 000113 */ 				if (__t__ (!__t__ ((hasElse)))) {
/* 000114 */ 					els.__setslice__ (conStart, conEnd + 1, null, []);
/* 000115 */ 					iff.py_pop (conEnd);
/* 000115 */ 				}
/* 000117 */ 				iff.__setslice__ (conStart, conStart + 3, null, []);
/* 000118 */ 				els.__setslice__ (captureGroup.start, captureGroup.end + 1, null, [Token ('('), Token (')')]);
/* 000119 */ 				iff.remove (null);
/* 000120 */ 				els.remove (null);
/* 000121 */ 				variants.append (iff);
/* 000122 */ 				variants.append (els);
/* 000122 */ 			}
/* 000123 */ 			else {
/* 000125 */ 				var pastIff = false;
/* 000126 */ 				for (var idx = conStart; idx < conEnd; idx++) {
/* 000127 */ 					if (__t__ (iff [idx].py_name == '|')) {
/* 000128 */ 						var iff = tokens.__getslice__ (0, idx, 1);
/* 000129 */ 						iff.extend (tokens.__getslice__ (conEnd + 1, null, 1));
/* 000129 */ 						break;
/* 000129 */ 					}
/* 000129 */ 				}
/* 000131 */ 				iff.__setslice__ (conStart, conStart + 3, null, []);
/* 000132 */ 				variants.append (iff);
/* 000132 */ 			}
/* 000132 */ 			break;
/* 000132 */ 		}
/* 000132 */ 	}
/* 000135 */ 	if (__t__ (!__t__ ((variants)))) {
/* 000136 */ 		return [tokens];
/* 000136 */ 	}
/* 000138 */ 	var allVariants = [];
/* 000139 */ 	for (var variant of variants) {
/* 000140 */ 		allVariants.extend (splitIfElse (variant, namedGroups));
/* 000140 */ 	}
/* 000141 */ 	return allVariants;
/* 000141 */ };
/* 000144 */ export var Token =  __class__ ('Token', [object], {
/* 000144 */ 	__module__: __name__,
/* 000145 */ 	get __init__ () {return __get__ (this, function (self, py_name, paras, pure) {
/* 000145 */ 		if (typeof paras == 'undefined' || (paras != null && paras.hasOwnProperty ("__kwargtrans__"))) {;
/* 000145 */ 			var paras = null;
/* 000145 */ 		};
/* 000145 */ 		if (typeof pure == 'undefined' || (pure != null && pure.hasOwnProperty ("__kwargtrans__"))) {;
/* 000145 */ 			var pure = false;
/* 000145 */ 		};
/* 000146 */ 		if (__t__ (paras === null)) {
/* 000147 */ 			var paras = [];
/* 000147 */ 		}
/* 000148 */ 		self.py_name = py_name;
/* 000149 */ 		self.paras = paras;
/* 000150 */ 		self.pure = pure;
/* 000152 */ 		self.isModeGroup = false;
/* 000152 */ 	});},
/* 000154 */ 	get __repr__ () {return __get__ (this, function (self) {
/* 000155 */ 		return self.py_name;
/* 000155 */ 	});},
/* 000157 */ 	get resolve () {return __get__ (this, function (self) {
/* 000158 */ 		var paras = '';
/* 000159 */ 		for (var para of self.paras) {
/* 000160 */ 			paras += str (para);
/* 000160 */ 		}
/* 000162 */ 		return self.py_name + paras;
/* 000162 */ 	});}
/* 000162 */ });
/* 000165 */ export var shift = function (stack, queue) {
/* 000166 */ 	var done = !__t__ ((bool (queue)));
/* 000167 */ 	if (__t__ (!__t__ ((done)))) {
/* 000168 */ 		stack.append (Token (queue [0], [], true));
/* 000169 */ 		var queue = queue.__getslice__ (1, null, 1);
/* 000169 */ 	}
/* 000170 */ 	return tuple ([stack, queue, done]);
/* 000170 */ };
/* 000174 */ export var shiftReduce = function (stack, queue, namedGroups, flags) {
/* 000175 */ 	var done = false;
/* 000176 */ 	var high = len (stack) - 1;
/* 000178 */ 	if (__t__ (len (stack) < 2)) {
/* 000179 */ 		var __left0__ = shift (stack, queue);
/* 000179 */ 		var stack = __left0__ [0];
/* 000179 */ 		var queue = __left0__ [1];
/* 000179 */ 		var done = __left0__ [2];
/* 000180 */ 		return tuple ([stack, queue, flags, done]);
/* 000180 */ 	}
/* 000182 */ 	var s0 = (__t__ (len (stack) > 0) ? stack [high] : Token (''));
/* 000183 */ 	var s1 = (__t__ (len (stack) > 1) ? stack [high - 1] : Token (''));
/* 000185 */ 	if (__t__ (VERBOSE)) {
/* 000186 */ 		for (var token of stack) {
/* 000187 */ 			console.log (token.resolve (), '\t', __kwargtrans__ ({end: ''}));
/* 000187 */ 		}
/* 000188 */ 		console.log ('');
/* 000188 */ 	}
/* 000190 */ 	if (__t__ (s1.py_name == '\\')) {
/* 000191 */ 		if (__t__ (s0.py_name == 'A')) {
/* 000192 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [Token ('^')]);
/* 000192 */ 		}
/* 000194 */ 		else if (__t__ (s0.py_name == 'a')) {
/* 000195 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [Token ('\\07')]);
/* 000195 */ 		}
/* 000197 */ 		else if (__t__ (s0.py_name == 'Z')) {
/* 000198 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [Token ('$')]);
/* 000198 */ 		}
/* 000199 */ 		else {
/* 000201 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [Token ('\\' + s0.py_name)]);
/* 000201 */ 		}
/* 000201 */ 	}
/* 000203 */ 	else if (__t__ (__t__ (s0.py_name == '$') && s0.pure)) {
/* 000204 */ 		stack.py_pop ();
/* 000205 */ 		stack.extend ([Token ('(?='), Token ('\\n'), Token ('?'), Token ('$'), Token (')')]);
/* 000205 */ 	}
/* 000207 */ 	else if (__t__ (s1.py_name == '{')) {
/* 000208 */ 		if (__t__ (__t__ (s0.py_name == ',') && len (s1.paras) == 0)) {
/* 000209 */ 			s1.paras.append ('0');
/* 000210 */ 			s1.paras.append (',');
/* 000210 */ 		}
/* 000212 */ 		else if (__t__ (s0.py_name == '}')) {
/* 000213 */ 			s1.paras.append ('}');
/* 000214 */ 			s1.py_name = s1.resolve ();
/* 000215 */ 			s1.paras = [];
/* 000215 */ 		}
/* 000216 */ 		else {
/* 000217 */ 			s1.paras.append (s0.py_name);
/* 000217 */ 		}
/* 000219 */ 		var stack = stack.__getslice__ (0, -__t__ ((1)), 1);
/* 000219 */ 	}
/* 000221 */ 	else if (__t__ (__t__ (s1.py_name == '[') && s0.py_name == '^')) {
/* 000222 */ 		stack.__setslice__ (-__t__ ((2)), null, null, [Token ('[^')]);
/* 000222 */ 	}
/* 000224 */ 	else if (__t__ (__t__ (s1.py_name == '(') && s0.py_name == '?')) {
/* 000225 */ 		stack.__setslice__ (-__t__ ((2)), null, null, [Token ('(?')]);
/* 000225 */ 	}
/* 000227 */ 	else if (__t__ (__t__ (__in__ (s1.py_name, ['*', '+', '?'])) && s0.py_name == '?')) {
/* 000228 */ 		stack.__setslice__ (-__t__ ((2)), null, null, [Token (s1.py_name + '?')]);
/* 000228 */ 	}
/* 000230 */ 	else if (__t__ (__t__ (s1.isModeGroup) && s0.py_name == ')')) {
/* 000231 */ 		var stack = stack.__getslice__ (0, -__t__ ((2)), 1);
/* 000231 */ 	}
/* 000233 */ 	else if (__t__ (s1.py_name == '(?')) {
/* 000234 */ 		if (__t__ (__in__ (s0.py_name, stringFlags))) {
/* 000235 */ 			if (__t__ (s0.py_name == 'i')) {
/* 000235 */ 				flags |= re.IGNORECASE;
/* 000235 */ 			}
/* 000237 */ 			else if (__t__ (s0.py_name == 'L')) {
/* 000237 */ 				flags |= re.LOCALE;
/* 000237 */ 			}
/* 000239 */ 			else if (__t__ (s0.py_name == 'm')) {
/* 000239 */ 				flags |= re.MULTILINE;
/* 000239 */ 			}
/* 000241 */ 			else if (__t__ (s0.py_name == 's')) {
/* 000241 */ 				flags |= re.DOTALL;
/* 000241 */ 			}
/* 000243 */ 			else if (__t__ (s0.py_name == 'u')) {
/* 000243 */ 				flags |= re.UNICODE;
/* 000243 */ 			}
/* 000245 */ 			else if (__t__ (s0.py_name == 'x')) {
/* 000245 */ 				flags |= re.VERBOSE;
/* 000245 */ 			}
/* 000247 */ 			else if (__t__ (s0.py_name == 'a')) {
/* 000247 */ 				flags |= re.ASCII;
/* 000247 */ 			}
/* 000250 */ 			stack.py_pop ();
/* 000251 */ 			s1.isModeGroup = true;
/* 000251 */ 		}
/* 000252 */ 		else {
/* 000254 */ 			if (__t__ (s0.py_name == '(')) {
/* 000255 */ 				s0.py_name = '<';
/* 000255 */ 			}
/* 000257 */ 			var newToken = Token ('(?' + s0.py_name);
/* 000258 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [newToken]);
/* 000258 */ 		}
/* 000258 */ 	}
/* 000260 */ 	else if (__t__ (s1.py_name == '(?<')) {
/* 000261 */ 		if (__t__ (s0.py_name == ')')) {
/* 000262 */ 			stack.__setslice__ (-__t__ ((1)), null, null, [Token (''.join (s1.paras)), Token ('>')]);
/* 000263 */ 			s1.paras = [];
/* 000263 */ 		}
/* 000264 */ 		else {
/* 000265 */ 			s1.paras.append (s0.py_name);
/* 000266 */ 			stack.py_pop ();
/* 000266 */ 		}
/* 000266 */ 	}
/* 000268 */ 	else if (__t__ (s1.py_name == '(?P')) {
/* 000269 */ 		stack.__setslice__ (-__t__ ((2)), null, null, [Token ('(?P' + s0.py_name)]);
/* 000269 */ 	}
/* 000271 */ 	else if (__t__ (s1.py_name == '(?P<')) {
/* 000272 */ 		if (__t__ (s0.py_name == '>')) {
/* 000274 */ 			namedGroups [''.join (s1.paras)] = countCaptureGroups (stack) + 1;
/* 000275 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [Token ('(')]);
/* 000275 */ 		}
/* 000276 */ 		else {
/* 000277 */ 			s1.paras.append (s0.py_name);
/* 000278 */ 			stack.py_pop ();
/* 000278 */ 		}
/* 000278 */ 	}
/* 000280 */ 	else if (__t__ (s1.py_name == '(?P=')) {
/* 000281 */ 		if (__t__ (s0.py_name == ')')) {
/* 000282 */ 			stack.__setslice__ (-__t__ ((2)), null, null, [Token ('\\' + str (namedGroups [s1.paras [0]]))]);
/* 000282 */ 		}
/* 000283 */ 		else if (__t__ (!__t__ ((s1.paras)))) {
/* 000284 */ 			s1.paras.append (s0.py_name);
/* 000285 */ 			stack.py_pop ();
/* 000285 */ 		}
/* 000286 */ 		else {
/* 000286 */ 			s1.paras [0] += s0.py_name;
/* 000288 */ 			stack.py_pop ();
/* 000288 */ 		}
/* 000288 */ 	}
/* 000290 */ 	else if (__t__ (s1.py_name == '(?#')) {
/* 000291 */ 		if (__t__ (s0.py_name == ')')) {
/* 000292 */ 			var stack = stack.__getslice__ (0, -__t__ ((2)), 1);
/* 000292 */ 		}
/* 000293 */ 		else {
/* 000294 */ 			var stack = stack.__getslice__ (0, -__t__ ((1)), 1);
/* 000294 */ 		}
/* 000294 */ 	}
/* 000295 */ 	else {
/* 000297 */ 		var __left0__ = shift (stack, queue);
/* 000297 */ 		var stack = __left0__ [0];
/* 000297 */ 		var queue = __left0__ [1];
/* 000297 */ 		var done = __left0__ [2];
/* 000297 */ 	}
/* 000299 */ 	return tuple ([stack, queue, flags, done]);
/* 000299 */ };
/* 000304 */ export var translate = function (rgx) {
/* 000306 */ 	var stack = [];
/* 000307 */ 	var queue = list (rgx);
/* 000309 */ 	var flags = 0;
/* 000310 */ 	var namedGroups = dict ();
/* 000312 */ 	var nloop = 0;
/* 000314 */ 	while (__t__ (true)) {
/* 000314 */ 		nloop++;
/* 000316 */ 		if (__t__ (nloop > MAX_SHIFTREDUCE_LOOPS)) {
/* 000317 */ 			var __except0__ = Exception ();
/* 000317 */ 			__except0__.__cause__ = null;
/* 000317 */ 			throw __except0__;
/* 000317 */ 		}
/* 000319 */ 		var __left0__ = shiftReduce (stack, queue, namedGroups, flags);
/* 000319 */ 		var stack = __left0__ [0];
/* 000319 */ 		var queue = __left0__ [1];
/* 000319 */ 		var flags = __left0__ [2];
/* 000319 */ 		var done = __left0__ [3];
/* 000320 */ 		if (__t__ (done)) {
/* 000320 */ 			break;
/* 000320 */ 		}
/* 000320 */ 	}
/* 000323 */ 	var variants = splitIfElse (stack, namedGroups);
/* 000324 */ 	var n_splits = len (variants);
/* 000326 */ 	var final = [];
/* 000327 */ 	for (var i = 0; i < len (variants); i++) {
/* 000328 */ 		final.extend (variants [i]);
/* 000329 */ 		if (__t__ (i < len (variants) - 1)) {
/* 000330 */ 			final.append (Token ('|'));
/* 000330 */ 		}
/* 000330 */ 	}
/* 000331 */ 	var stack = final;
/* 000333 */ 	var groupInfo = generateGroupSpans (stack);
/* 000334 */ 	var resolvedTokens = [];
/* 000336 */ 	for (var token of stack) {
/* 000337 */ 		var stringed = token.resolve ();
/* 000338 */ 		if (__t__ (__t__ (flags & re.DOTALL) && stringed == '.')) {
/* 000339 */ 			var stringed = '[\\s\\S]';
/* 000339 */ 		}
/* 000340 */ 		resolvedTokens.append (stringed);
/* 000340 */ 	}
/* 000341 */ 	return tuple ([resolvedTokens, flags, namedGroups, countCaptureGroups (stack), n_splits]);
/* 000341 */ };
/* 000008 */ 
//# sourceMappingURL=re.translate.map