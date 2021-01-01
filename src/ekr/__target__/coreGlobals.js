// Transcrypt'ed from Python, 2021-01-01 09:36:10
var re = {};
var sys = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_sys__ from './sys.js';
__nest__ (sys, '', __module_sys__);
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
var __name__ = 'coreGlobals';
export var globalDirectiveList = ['all', 'beautify', 'colorcache', 'code', 'color', 'comment', 'c', 'delims', 'doc', 'encoding', 'end_raw', 'first', 'header', 'ignore', 'killbeautify', 'killcolor', 'language', 'last', 'lineending', 'markup', 'nobeautify', 'nocolor-node', 'nocolor', 'noheader', 'nowrap', 'nopyflakes', 'nosearch', 'others', 'pagewidth', 'path', 'quiet', 'raw', 'root-code', 'root-doc', 'root', 'silent', 'tabwidth', 'terse', 'unit', 'verbose', 'wrap'];
export var directives_pat = null;
export var FileLikeObject =  __class__ ('FileLikeObject', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, encoding, fromString) {
		if (typeof encoding == 'undefined' || (encoding != null && encoding.hasOwnProperty ("__kwargtrans__"))) {;
			var encoding = 'utf-8';
		};
		if (typeof fromString == 'undefined' || (fromString != null && fromString.hasOwnProperty ("__kwargtrans__"))) {;
			var fromString = null;
		};
		self.encoding = encoding || 'utf-8';
		self._list = splitLines (fromString);
		self.ptr = 0;
	});},
	get py_clear () {return __get__ (this, function (self) {
		self._list = [];
	});},
	get close () {return __get__ (this, function (self) {
		// pass;
	});},
	get flush () {return __get__ (this, function (self) {
		// pass;
	});},
	get py_get () {return __get__ (this, function (self) {
		return ''.join (self._list);
	});},
	getvalue: py_get,
	read: py_get,
	get readline () {return __get__ (this, function (self) {
		if (self.ptr < len (self._list)) {
			var line = self._list [self.ptr];
			self.ptr++;
			return line;
		}
		return '';
	});},
	get write () {return __get__ (this, function (self, s) {
		if (s) {
			if (isinstance (s, bytes)) {
				var s = toUnicode (s, self.encoding);
			}
			self._list.append (s);
		}
	});}
});
export var angleBrackets = function (s) {
	var lt = '<<';
	var rt = '>>';
	return (lt + s) + rt;
};
export var caller = function (i) {
	if (typeof i == 'undefined' || (i != null && i.hasOwnProperty ("__kwargtrans__"))) {;
		var i = 1;
	};
	return callers (i + 1).py_split (',') [0];
};
export var callers = function (n, count, excludeCaller, verbose) {
	if (typeof n == 'undefined' || (n != null && n.hasOwnProperty ("__kwargtrans__"))) {;
		var n = 4;
	};
	if (typeof count == 'undefined' || (count != null && count.hasOwnProperty ("__kwargtrans__"))) {;
		var count = 0;
	};
	if (typeof excludeCaller == 'undefined' || (excludeCaller != null && excludeCaller.hasOwnProperty ("__kwargtrans__"))) {;
		var excludeCaller = true;
	};
	if (typeof verbose == 'undefined' || (verbose != null && verbose.hasOwnProperty ("__kwargtrans__"))) {;
		var verbose = false;
	};
	var result = [];
	var i = (excludeCaller ? 3 : 2);
	while (1) {
		var s = _callerName (__kwargtrans__ ({n: i, verbose: verbose}));
		if (s) {
			result.append (s);
		}
		if (!(s) || len (result) >= n) {
			break;
		}
		i++;
	}
	result.reverse ();
	if (count > 0) {
		var result = result.__getslice__ (0, count, 1);
	}
	if (verbose) {
		return ''.join ((function () {
			var __accu0__ = [];
			for (var z of result) {
				__accu0__.append ('\n  {}'.format (z));
			}
			return __accu0__;
		}) ());
	}
	return ','.join (result);
};
export var _callerName = function (n, verbose) {
	if (typeof verbose == 'undefined' || (verbose != null && verbose.hasOwnProperty ("__kwargtrans__"))) {;
		var verbose = false;
	};
	try {
		var f1 = sys._getframe (n);
		var code1 = f1.f_code;
		var sfn = shortFilename (code1.co_filename);
		var locals_ = f1.f_locals;
		var py_name = code1.co_name;
		var line = code1.co_firstlineno;
		if (verbose) {
			var obj = locals_.py_get ('self');
			var full_name = (obj ? '{}.{}'.format (obj.__class__.__name__, py_name) : py_name);
			return 'line {} {} {}'.format (line, sfn, full_name);
		}
		return py_name;
	}
	catch (__except0__) {
		if (isinstance (__except0__, ValueError)) {
			return '';
		}
		else if (isinstance (__except0__, Exception)) {
			es_exception ();
			return '';
		}
		else {
			throw __except0__;
		}
	}
};
export var doKeywordArgs = function (py_keys, d) {
	if (typeof d == 'undefined' || (d != null && d.hasOwnProperty ("__kwargtrans__"))) {;
		var d = null;
	};
	if (d === null) {
		var d = dict ({});
	}
	var result = dict ({});
	for (var [key, default_val] of d.py_items ()) {
		var isBool = __in__ (default_val, tuple ([true, false]));
		var val = py_keys.py_get (key);
		if (isBool && __in__ (val, tuple ([true, 'True', 'true']))) {
			result [key] = true;
		}
		else if (isBool && __in__ (val, tuple ([false, 'False', 'false']))) {
			result [key] = false;
		}
		else if (val === null) {
			result [key] = default_val;
		}
		else {
			result [key] = val;
		}
	}
	return result;
};
export var error = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	es_print (...args, __kwargtrans__ (__mergekwargtrans__ ({color: 'error'}, py_keys)));
};
export var es = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	var result = [];
	for (var arg of args) {
		result.append ((isinstance (arg, str) ? arg : repr (arg)));
	}
	print (','.join (result));
};
export var es_exception = function () {
	return tuple (['<no file>', 0]);
};
export var es_print = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	pr (...args, __kwargtrans__ (py_keys));
	es (...args, __kwargtrans__ (py_keys));
};
export var g_is_directive_pattern = re.compile ('^\\s*@([\\w-]+)\\s*');
export var isDirective = function (s) {
	var m = g_is_directive_pattern.match (s);
	if (m) {
		var s2 = s.__getslice__ (m.end (1), null, 1);
		if (s2 && __in__ (s2 [0], '.(')) {
			return false;
		}
		return bool (__in__ (m.group (1), globalDirectiveList));
	}
	return false;
};
export var is_special = function (s, directive) {
	var lws = __in__ (directive, tuple (['@others', '@all']));
	var pattern = (lws ? '^\\s*(%s\\b)' : '^(%s\\b)');
	var pattern = re.compile (__mod__ (pattern, directive), re.MULTILINE);
	var m = re.search (pattern, s);
	if (m) {
		return tuple ([true, m.start (1)]);
	}
	return tuple ([false, -(1)]);
};
export var isWordChar = function (ch) {
	return ch && (ch.isalnum () || ch == '_');
};
export var isWordChar1 = function (ch) {
	return ch && (ch.isalpha () || ch == '_');
};
export var match = function (s, i, pattern) {
	return s && pattern && s.find (pattern, i, i + len (pattern)) == i;
};
export var match_word = function (s, i, pattern) {
	var pat = '\\b{}\\b'.format (pattern);
	return bool (re.search (pat, s.__getslice__ (i, null, 1)));
};
export var objToString = function (obj, indent, printCaller, tag) {
	if (typeof indent == 'undefined' || (indent != null && indent.hasOwnProperty ("__kwargtrans__"))) {;
		var indent = '';
	};
	if (typeof printCaller == 'undefined' || (printCaller != null && printCaller.hasOwnProperty ("__kwargtrans__"))) {;
		var printCaller = false;
	};
	if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
		var tag = null;
	};
	if (isinstance (obj, dict)) {
		var s = dictToString (obj, __kwargtrans__ ({indent: indent}));
	}
	else if (isinstance (obj, list)) {
		var s = listToString (obj, __kwargtrans__ ({indent: indent}));
	}
	else if (isinstance (obj, tuple)) {
		var s = tupleToString (obj, __kwargtrans__ ({indent: indent}));
	}
	else if (isinstance (obj, str)) {
		var s = obj;
		var lines = splitLines (s);
		if (len (lines) > 1) {
			var s = listToString (lines, __kwargtrans__ ({indent: indent}));
		}
		else {
			var s = repr (s);
		}
	}
	else {
		var s = repr (obj);
	}
	if (printCaller && tag) {
		var prefix = '{}: {}'.format (caller (), tag);
	}
	else if (printCaller || tag) {
		var prefix = (printCaller ? caller () : tag);
	}
	else {
		var prefix = null;
	}
	if (prefix) {
		var sep = (__in__ ('\n', s) ? '\n' : ' ');
		return '{}:{}{}'.format (prefix, sep, s);
	}
	return s;
};
export var dictToString = function (d, indent, tag) {
	if (typeof indent == 'undefined' || (indent != null && indent.hasOwnProperty ("__kwargtrans__"))) {;
		var indent = '';
	};
	if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
		var tag = null;
	};
	if (!(d)) {
		return '{}';
	}
	var result = ['{\n'];
	var indent2 = indent + ' ' * 4;
	var n = (2 + len (indent)) + max ((function () {
		var __accu0__ = [];
		for (var z of d.py_keys ()) {
			__accu0__.append (len (repr (z)));
		}
		return __accu0__;
	}) ());
	for (var [i, key] of enumerate (sorted (d, __kwargtrans__ ({key: (function __lambda__ (z) {
		return repr (z);
	})})))) {
		var pad = ' ' * max (0, n - len (repr (key)));
		result.append ('{}{}:'.format (pad, key));
		result.append (objToString (d.py_get (key), __kwargtrans__ ({indent: indent2})));
		if (i + 1 < len (d.py_keys ())) {
			result.append (',');
		}
		result.append ('\n');
	}
	result.append (indent + '}');
	var s = ''.join (result);
	return (tag ? '{}...\n{}\n'.format (tag, s) : s);
};
export var listToString = function (obj, indent, tag) {
	if (typeof indent == 'undefined' || (indent != null && indent.hasOwnProperty ("__kwargtrans__"))) {;
		var indent = '';
	};
	if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
		var tag = null;
	};
	if (!(obj)) {
		return '[]';
	}
	var result = ['['];
	var indent2 = indent + ' ' * 4;
	for (var [i, obj2] of enumerate (obj)) {
		result.append ('\n' + indent2);
		result.append (objToString (obj2, __kwargtrans__ ({indent: indent2})));
		if ((i + 1 < len (obj) && len (obj) > 1)) {
			result.append (',');
		}
		else {
			result.append ('\n' + indent);
		}
	}
	result.append (']');
	var s = ''.join (result);
	return (tag ? '{}...\n{}\n'.format (tag, s) : s);
};
export var tupleToString = function (obj, indent, tag) {
	if (typeof indent == 'undefined' || (indent != null && indent.hasOwnProperty ("__kwargtrans__"))) {;
		var indent = '';
	};
	if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
		var tag = null;
	};
	if (!(obj)) {
		return '(),';
	}
	var result = ['('];
	var indent2 = indent + ' ' * 4;
	for (var [i, obj2] of enumerate (obj)) {
		if (len (obj) > 1) {
			result.append ('\n' + indent2);
		}
		result.append (objToString (obj2, __kwargtrans__ ({indent: indent2})));
		if (len (obj) == 1 || i + 1 < len (obj)) {
			result.append (',');
		}
		else if (len (obj) > 1) {
			result.append ('\n' + indent);
		}
	}
	result.append (')');
	var s = ''.join (result);
	return (tag ? '{}...\n{}\n'.format (tag, s) : s);
};
export var plural = function (obj) {
	if (isinstance (obj, tuple ([list, tuple, str]))) {
		var n = len (obj);
	}
	else {
		var n = obj;
	}
	return (n == 1 ? '' : 's');
};
export var pr = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	var result = [];
	for (var arg of args) {
		if (isinstance (arg, str)) {
			result.append (arg);
		}
		else {
			result.append (repr (arg));
		}
	}
	print (','.join (result));
};
export var printObj = function (obj, indent, printCaller, tag) {
	if (typeof indent == 'undefined' || (indent != null && indent.hasOwnProperty ("__kwargtrans__"))) {;
		var indent = '';
	};
	if (typeof printCaller == 'undefined' || (printCaller != null && printCaller.hasOwnProperty ("__kwargtrans__"))) {;
		var printCaller = false;
	};
	if (typeof tag == 'undefined' || (tag != null && tag.hasOwnProperty ("__kwargtrans__"))) {;
		var tag = null;
	};
	pr (objToString (obj, __kwargtrans__ ({indent: indent, printCaller: printCaller, tag: tag})));
};
export var shortFileName = function (fileName) {
	return fileName;
};
export var shortFilename = shortFileName;
export var skip_to_char = function (s, i, ch) {
	var j = s.find (ch, i);
	if (j == -(1)) {
		return tuple ([len (s), s.__getslice__ (i, null, 1)]);
	}
	return tuple ([j, s.__getslice__ (i, j, 1)]);
};
export var skip_id = function (s, i, chars) {
	if (typeof chars == 'undefined' || (chars != null && chars.hasOwnProperty ("__kwargtrans__"))) {;
		var chars = null;
	};
	var chars = (chars ? toUnicode (chars) : '');
	var n = len (s);
	while (i < n && (isWordChar (s [i]) || __in__ (s [i], chars))) {
		i++;
	}
	return i;
};
export var skip_ws = function (s, i) {
	var n = len (s);
	while (i < n && __in__ (s [i], '\t ')) {
		i++;
	}
	return i;
};
export var skip_ws_and_nl = function (s, i) {
	var n = len (s);
	while (i < n && __in__ (s [i], ' \t\n\r')) {
		i++;
	}
	return i;
};
export var splitLines = function (s) {
	return (s ? s.splitlines (true) : []);
};
export var toEncodedString = function (s, encoding, reportErrors) {
	if (typeof encoding == 'undefined' || (encoding != null && encoding.hasOwnProperty ("__kwargtrans__"))) {;
		var encoding = 'utf-8';
	};
	if (typeof reportErrors == 'undefined' || (reportErrors != null && reportErrors.hasOwnProperty ("__kwargtrans__"))) {;
		var reportErrors = false;
	};
	if (!(isinstance (s, str))) {
		return s;
	}
	if (!(encoding)) {
		var encoding = 'utf-8';
	}
	try {
		var s = s.encode (encoding, 'strict');
	}
	catch (__except0__) {
		if (isinstance (__except0__, UnicodeError)) {
			var s = s.encode (encoding, 'replace');
			if (reportErrors) {
				error ('Error converting {} from unicode to {} encoding'.format (s, encoding));
			}
		}
		else {
			throw __except0__;
		}
	}
	return s;
};
export var unicode_warnings = dict ({});
export var toUnicode = function (s, encoding, reportErrors) {
	if (typeof encoding == 'undefined' || (encoding != null && encoding.hasOwnProperty ("__kwargtrans__"))) {;
		var encoding = null;
	};
	if (typeof reportErrors == 'undefined' || (reportErrors != null && reportErrors.hasOwnProperty ("__kwargtrans__"))) {;
		var reportErrors = false;
	};
	if (isinstance (s, str)) {
		return s;
	}
	var tag = 'g.toUnicode';
	if (!(isinstance (s, bytes))) {
		if (!__in__ (callers (), unicode_warnings)) {
			unicode_warnings [callers] = true;
			error ('{}: unexpected argument of type {}'.format (tag, s.__class__.__name__));
			trace (callers ());
		}
		return '';
	}
	if (!(encoding)) {
		var encoding = 'utf-8';
	}
	try {
		var s = s.decode (encoding, 'strict');
	}
	catch (__except0__) {
		if (isinstance (__except0__, tuple ([UnicodeDecodeError, UnicodeError]))) {
			var s = s.decode (encoding, 'replace');
			if (reportErrors) {
				error ('{}: unicode error. encoding: {}, s:\n{}'.format (tag, encoding, s));
				trace (callers ());
			}
		}
		else if (isinstance (__except0__, Exception)) {
			es_exception ();
			error ('{}: unexpected error! encoding: {}, s:\n{}'.format (tag, encoding, s));
			trace (callers ());
		}
		else {
			throw __except0__;
		}
	}
	return s;
};
export var trace = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	print (args);
};

//# sourceMappingURL=coreGlobals.map