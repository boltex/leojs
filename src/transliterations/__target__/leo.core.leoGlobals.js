// Transcrypt'ed from Python, 2020-12-25 05:32:31
var inspect = {};
var re = {};
var sys = {};
var time = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {leoCommands} from './leo.core.js';
import * as leoCommands from './leo.core.leoCommands.js';
import * as __module_time__ from './time.js';
__nest__ (time, '', __module_time__);
import * as __module_sys__ from './sys.js';
__nest__ (sys, '', __module_sys__);
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
import * as __module_inspect__ from './inspect.js';
__nest__ (inspect, '', __module_inspect__);
var __name__ = 'leo.core.leoGlobals';
export var in_bridge = false;
export var minimum_python_version = '3.6';
export var isPython3 = sys.version_info >= tuple ([3, 0, 0]);
export var isMac = sys.platform.startswith ('darwin');
export var isWindows = sys.platform.startswith ('win');
export var globalDirectiveList = ['all', 'beautify', 'colorcache', 'code', 'color', 'comment', 'c', 'delims', 'doc', 'encoding', 'end_raw', 'first', 'header', 'ignore', 'killbeautify', 'killcolor', 'language', 'last', 'lineending', 'markup', 'nobeautify', 'nocolor-node', 'nocolor', 'noheader', 'nowrap', 'nopyflakes', 'nosearch', 'others', 'pagewidth', 'path', 'quiet', 'raw', 'root-code', 'root-doc', 'root', 'silent', 'tabwidth', 'terse', 'unit', 'verbose', 'wrap'];
export var directives_pat = null;
export var global_commands_dict = dict ({});
export var cmd_instance_dict = dict ({'AbbrevCommandsClass': ['c', 'abbrevCommands'], 'AtFile': ['c', 'atFileCommands'], 'AutoCompleterClass': ['c', 'k', 'autoCompleter'], 'ChapterController': ['c', 'chapterController'], 'Commands': ['c'], 'ControlCommandsClass': ['c', 'controlCommands'], 'DebugCommandsClass': ['c', 'debugCommands'], 'EditCommandsClass': ['c', 'editCommands'], 'EditFileCommandsClass': ['c', 'editFileCommands'], 'FileCommands': ['c', 'fileCommands'], 'HelpCommandsClass': ['c', 'helpCommands'], 'KeyHandlerClass': ['c', 'k'], 'KeyHandlerCommandsClass': ['c', 'keyHandlerCommands'], 'KillBufferCommandsClass': ['c', 'killBufferCommands'], 'LeoApp': ['g', 'app'], 'LeoFind': ['c', 'findCommands'], 'LeoImportCommands': ['c', 'importCommands'], 'PrintingController': ['c', 'printingController'], 'RectangleCommandsClass': ['c', 'rectangleCommands'], 'RstCommands': ['c', 'rstCommands'], 'SpellCommandsClass': ['c', 'spellCommands'], 'Undoer': ['c', 'undoer'], 'VimCommands': ['c', 'vimCommands']});
export var callback = function (func) {
	var callback_wrapper = function () {
		var args = tuple ([].slice.apply (arguments).slice (0));
		try {
			return func (...args, __kwargtrans__ (py_keys));
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
	};
	return callback_wrapper;
};
export var check_cmd_instance_dict = function (c, g) {
	var d = cmd_instance_dict;
	for (var key of d) {
		var ivars = d.py_get (key);
		var obj = ivars2instance (c, g, ivars);
		if (obj) {
			var py_name = obj.__class__.__name__;
			if (py_name != key) {
				g.trace ('class mismatch', key, py_name);
			}
		}
	}
};
export var Command =  __class__ ('Command', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, py_name) {
		self.py_name = py_name;
	});},
	get __call__ () {return __get__ (this, function (self, func) {
		global_commands_dict [self.py_name] = func;
		if (app) {
			for (var c of app.commanders ()) {
				c.k.registerCommand (self.py_name, func);
			}
		}
		func.__func_name__ = func.__name__;
		func.is_command = true;
		func.command_name = self.py_name;
		return func;
	});}
});
export var command = Command;
export var command_alias = function (alias, func) {
	funcToMethod (func, leoCommands.Commands, alias);
};
export var CommanderCommand =  __class__ ('CommanderCommand', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, py_name) {
		self.py_name = py_name;
	});},
	get __call__ () {return __get__ (this, function (self, func) {
		var commander_command_wrapper = function (event) {
			var c = event.py_get ('c');
			var method = getattr (c, func.__name__, null);
			method (__kwargtrans__ ({event: event}));
		};
		commander_command_wrapper.__func_name__ = func.__name__;
		commander_command_wrapper.__name__ = self.py_name;
		commander_command_wrapper.__doc__ = func.__doc__;
		global_commands_dict [self.py_name] = commander_command_wrapper;
		if (app) {
			funcToMethod (func, leoCommands.Commands);
			for (var c of app.commanders ()) {
				c.k.registerCommand (self.py_name, func);
			}
		}
		func.is_command = true;
		func.command_name = self.py_name;
		return func;
	});}
});
export var commander_command = CommanderCommand;
export var ivars2instance = function (c, g, ivars) {
	if (!(ivars)) {
		g.trace ('can not happen: no ivars');
		return null;
	}
	var ivar = ivars [0];
	if (!__in__ (ivar, tuple (['c', 'g']))) {
		g.trace ('can not happen: unknown base', ivar);
		return null;
	}
	var obj = (ivar == 'c' ? c : g);
	for (var ivar of ivars.__getslice__ (1, null, 1)) {
		var obj = getattr (obj, ivar, null);
		if (!(obj)) {
			g.trace ('can not happen: unknown attribute', obj, ivar, ivars);
			break;
		}
	}
	return obj;
};
export var new_cmd_decorator = function (py_name, ivars) {
	var _decorator = function (func) {
		var new_cmd_wrapper = function (event) {
			var c = event.c;
			var self = g.ivars2instance (c, g, ivars);
			try {
				func (self, __kwargtrans__ ({event: event}));
			}
			catch (__except0__) {
				if (isinstance (__except0__, Exception)) {
					g.es_exception ();
				}
				else {
					throw __except0__;
				}
			}
		};
		new_cmd_wrapper.__func_name__ = func.__name__;
		new_cmd_wrapper.__name__ = py_name;
		new_cmd_wrapper.__doc__ = func.__doc__;
		global_commands_dict [py_name] = new_cmd_wrapper;
		return func;
	};
	return _decorator;
};
export var g_language_pat = re.compile ('^@language\\s+(\\w+)+', re.MULTILINE);
export var g_is_directive_pattern = re.compile ('^\\s*@([\\w-]+)\\s*');
export var g_noweb_root = re.compile ((((('<' + '<') + '*') + '>') + '>') + '=', re.MULTILINE);
export var g_pos_pattern = re.compile (':(\\d+),?(\\d+)?,?([-\\d]+)?,?(\\d+)?$');
export var g_tabwidth_pat = re.compile ('(^@tabwidth)', re.MULTILINE);
export var tree_popup_handlers = [];
export var user_dict = dict ({});
export var app = null;
export var inScript = false;
export var unitTesting = false;
export var standard_timestamp = function () {
	return time.strftime ('%Y%m%d-%H%M%S');
};
export var get_backup_path = function (sub_directory) {
};
export var isMacOS = function () {
	return sys.platform == 'darwin';
};
export var issueSecurityWarning = function (setting) {
	g.es ('Security warning! Ignoring...', __kwargtrans__ ({color: 'red'}));
	g.es (setting, __kwargtrans__ ({color: 'red'}));
	g.es ('This setting can be set only in');
	g.es ('leoSettings.leo or myLeoSettings.leo');
};
export var makeDict = function () {
	return py_keys;
};
export var pep8_class_name = function (s) {
	return ''.join ((function () {
		var __accu0__ = [];
		for (var z of s.py_split ('_')) {
			if (z) {
				__accu0__.append (z [0].upper () + z.__getslice__ (1, null, 1));
			}
		}
		return __accu0__;
	}) ());
};
if (0) {
	cls ();
	var aList = tuple (['_', '__', '_abc', 'abc_', 'abc', 'abc_xyz', 'AbcPdQ']);
	for (var s of aList) {
		print (pep8_class_name (s));
	}
}
export var plural = function (obj) {
	if (isinstance (obj, tuple ([list, tuple, str]))) {
		var n = len (obj);
	}
	else {
		var n = obj;
	}
	return (n == 1 ? '' : 's');
};
export var truncate = function (s, n) {
	if (len (s) <= n) {
		return s;
	}
	var s2 = s.__getslice__ (0, n - 3, 1) + '...({})'.format (len (s));
	if (s.endswith ('\n')) {
		return s2 + '\n';
	}
	return s2;
};
export var windows = function () {
	return app && app.windowList;
};
export var glob_glob = function (pattern) {
	var aList = glob.glob (pattern);
	if (g.isWindows) {
		var aList = (function () {
			var __accu0__ = [];
			for (var z of aList) {
				__accu0__.append (z.py_replace ('\\', '/'));
			}
			return __accu0__;
		}) ();
	}
	return aList;
};
export var os_path_abspath = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = path.py_replace ('\x00', '');
	var path = os.path.abspath (path);
	var path = g.toUnicodeFileEncoding (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_basename = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = os.path.basename (path);
	var path = g.toUnicodeFileEncoding (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_dirname = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = os.path.dirname (path);
	var path = g.toUnicodeFileEncoding (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_exists = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = path.py_replace ('\x00', '');
	return os.path.exists (path);
};
export var deprecated_messages = [];
export var os_path_expandExpression = function (s) {
	var c = py_keys.py_get ('c');
	if (!(c)) {
		g.trace ('can not happen: no c', g.callers ());
		return s;
	}
	var callers = g.callers (2);
	if (!__in__ (callers, deprecated_messages)) {
		deprecated_messages.append (callers);
		g.es_print ('\nos_path_expandExpression is deprecated. called from: {}'.format (callers));
	}
	return c.expand_path_expression (s);
};
export var os_path_expanduser = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var result = os.path.normpath (os.path.expanduser (path));
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return result;
};
export var os_path_finalize = function (path) {
	var path = path.py_replace ('\x00', '');
	var path = os.path.expanduser (path);
	var path = os.path.abspath (path);
	var path = os.path.normpath (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_finalize_join = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	var path = g.os_path_join (...args, __kwargtrans__ (py_keys));
	var path = g.os_path_finalize (path);
	return path;
};
export var os_path_getmtime = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	try {
		return os.path.getmtime (path);
	}
	catch (__except0__) {
		if (isinstance (__except0__, Exception)) {
			return 0;
		}
		else {
			throw __except0__;
		}
	}
};
export var os_path_getsize = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	return os.path.getsize (path);
};
export var os_path_isabs = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	return os.path.isabs (path);
};
export var os_path_isdir = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	return os.path.isdir (path);
};
export var os_path_isfile = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	return os.path.isfile (path);
};
export var os_path_join = function () {
	var args = tuple ([].slice.apply (arguments).slice (0));
	var c = py_keys.py_get ('c');
	var uargs = (function () {
		var __accu0__ = [];
		for (var arg of args) {
			__accu0__.append (g.toUnicodeFileEncoding (arg));
		}
		return __accu0__;
	}) ();
	if (uargs && uargs [0] == '!!') {
		uargs [0] = g.app.loadDir;
	}
	else if (uargs && uargs [0] == '.') {
		var c = py_keys.py_get ('c');
		if (c && c.openDirectory) {
			uargs [0] = c.openDirectory;
		}
	}
	if (uargs) {
		try {
			var path = os.path.join (...uargs);
		}
		catch (__except0__) {
			if (isinstance (__except0__, py_TypeError)) {
				g.trace (uargs, args, py_keys, g.callers ());
				__except0__.__cause__ = null;
				throw __except0__;
			}
			else {
				throw __except0__;
			}
		}
	}
	else {
		var path = '';
	}
	var path = g.toUnicodeFileEncoding (path);
	var path = path.py_replace ('\x00', '');
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_normcase = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = os.path.normcase (path);
	var path = g.toUnicodeFileEncoding (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_normpath = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = os.path.normpath (path);
	var path = g.toUnicodeFileEncoding (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_normslashes = function (path) {
	if (g.isWindows && path) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_realpath = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var path = os.path.realpath (path);
	var path = g.toUnicodeFileEncoding (path);
	if (g.isWindows) {
		var path = path.py_replace ('\\', '/');
	}
	return path;
};
export var os_path_split = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var __left0__ = os.path.py_split (path);
	var head = __left0__ [0];
	var tail = __left0__ [1];
	var head = g.toUnicodeFileEncoding (head);
	var tail = g.toUnicodeFileEncoding (tail);
	return tuple ([head, tail]);
};
export var os_path_splitext = function (path) {
	var path = g.toUnicodeFileEncoding (path);
	var __left0__ = os.path.splitext (path);
	var head = __left0__ [0];
	var tail = __left0__ [1];
	var head = g.toUnicodeFileEncoding (head);
	var tail = g.toUnicodeFileEncoding (tail);
	return tuple ([head, tail]);
};
export var os_startfile = function (fname) {
	var stderr2log = function (g, ree, fname) {
		while (true) {
			var emsg = ree.read ().decode ('utf-8');
			if (emsg) {
				g.es_print_error ('xdg-open {} caused output to stderr:\n{}'.format (fname, emsg));
			}
			else {
				break;
			}
		}
	};
	var itPoll = function (fname, ree, subPopen, g, ito) {
		stderr2log (g, ree, fname);
		var rc = subPopen.poll ();
		if (!(rc === null)) {
			ito.stop ();
			ito.destroy_self ();
			if (rc != 0) {
				g.es_print ('xdg-open {} failed with exit code {}'.format (fname, rc));
			}
			stderr2log (g, ree, fname);
			ree.close ();
		}
	};
	if (fname.find ('"') > -(1)) {
		var quoted_fname = "'{}'".format (fname);
	}
	else {
		var quoted_fname = '"{}"'.format (fname);
	}
	if (sys.platform.startswith ('win')) {
		os.startfile (quoted_fname);
	}
	else if (sys.platform == 'darwin') {
		try {
			subprocess.call (['open', fname]);
		}
		catch (__except0__) {
			if (isinstance (__except0__, OSError)) {
				// pass;
			}
			else if (isinstance (__except0__, ImportError)) {
				os.system ('open {}'.format (quoted_fname));
			}
			else {
				throw __except0__;
			}
		}
	}
	else {
		try {
			var ree = null;
			var wre = tempfile.NamedTemporaryFile ();
			var ree = io.open (wre.py_name, 'rb', __kwargtrans__ ({buffering: 0}));
		}
		catch (__except0__) {
			if (isinstance (__except0__, IOError)) {
				g.trace ('error opening temp file for {}'.format (fname));
				if (ree) {
					ree.close ();
				}
				return ;
			}
			else {
				throw __except0__;
			}
		}
		try {
			var subPopen = subprocess.Popen (['xdg-open', fname], __kwargtrans__ ({stderr: wre, shell: false}));
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es_print ('error opening {}'.format (fname));
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
		try {
			var itoPoll = g.IdleTime ((function __lambda__ (ito) {
				return itPoll (fname, ree, subPopen, g, ito);
			}), __kwargtrans__ ({delay: 1000}));
			itoPoll.start ();
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es_exception ('exception executing g.startfile for {}'.format (fname));
			}
			else {
				throw __except0__;
			}
		}
	}
};
export var toUnicodeFileEncoding = function (path) {
	if (path && isinstance (path, str)) {
		var path = path.py_replace ('\\', os.sep);
		return g.toUnicode (path);
	}
	return '';
};
export var createTopologyList = function (c, root, useHeadlines) {
	if (typeof root == 'undefined' || (root != null && root.hasOwnProperty ("__kwargtrans__"))) {;
		var root = null;
	};
	if (typeof useHeadlines == 'undefined' || (useHeadlines != null && useHeadlines.hasOwnProperty ("__kwargtrans__"))) {;
		var useHeadlines = false;
	};
	if (!(root)) {
		var root = c.rootPosition ();
	}
	var v = root;
	if (useHeadlines) {
		var aList = [tuple ([v.numberOfChildren (), v.headString ()])];
	}
	else {
		var aList = [v.numberOfChildren ()];
	}
	var child = v.firstChild ();
	while (child) {
		aList.append (g.createTopologyList (c, child, useHeadlines));
		var child = child.py_next ();
	}
	return aList;
};
export var getDocString = function (s) {
	var tags = tuple (['"""', "'''"]);
	var __left0__ = tags;
	var tag1 = __left0__ [0];
	var tag2 = __left0__ [1];
	var __left0__ = tuple ([s.find (tag1), s.find (tag2)]);
	var i1 = __left0__ [0];
	var i2 = __left0__ [1];
	if (i1 == -(1) && i2 == -(1)) {
		return '';
	}
	if (i1 > -(1) && i2 > -(1)) {
		var i = min (i1, i2);
	}
	else {
		var i = max (i1, i2);
	}
	var tag = s.__getslice__ (i, i + 3, 1);
	var j = s.find (tag, i + 3);
	if (j > -(1)) {
		return s.__getslice__ (i + 3, j, 1);
	}
	return '';
};
export var getDocStringForFunction = function (func) {
	var py_name = function (func) {
		return (hasattr (func, '__name__') ? func.__name__ : '<no __name__>');
	};
	var get_defaults = function (func, i) {
		var defaults = inspect.getfullargspec (func) [3];
		return defaults [i];
	};
	var s = '';
	if (py_name (func) == 'minibufferCallback') {
		var func = get_defaults (func, 0);
		if (hasattr (func, 'func.__doc__') && func.__doc__.strip ()) {
			var s = func.__doc__;
		}
	}
	if (!(s) && py_name (func) == 'commonCommandCallback') {
		var script = get_defaults (func, 1);
		var s = g.getDocString (script);
	}
	if (!(s) && hasattr (func, '__doc__')) {
		var s = func.__doc__;
	}
	if (!(s) && hasattr (func, 'docstring')) {
		var s = func.docstring;
	}
	return s;
};
export var python_tokenize = function (s, line_numbers) {
	if (typeof line_numbers == 'undefined' || (line_numbers != null && line_numbers.hasOwnProperty ("__kwargtrans__"))) {;
		var line_numbers = true;
	};
	var __left0__ = tuple ([[], 0, 0]);
	var result = __left0__ [0];
	var i = __left0__ [1];
	var line_number = __left0__ [2];
	while (i < len (s)) {
		var __left0__ = i;
		var progress = __left0__;
		var j = __left0__;
		var ch = s [i];
		if (ch == '\n') {
			var __left0__ = tuple (['nl', i + 1]);
			var kind = __left0__ [0];
			var i = __left0__ [1];
		}
		else if (__in__ (ch, ' \t')) {
			var kind = 'ws';
			while (i < len (s) && __in__ (s [i], ' \t')) {
				i++;
			}
		}
		else if (ch == '#') {
			var __left0__ = tuple (['comment', g.skip_to_end_of_line (s, i)]);
			var kind = __left0__ [0];
			var i = __left0__ [1];
		}
		else if (__in__ (ch, '"\'')) {
			var __left0__ = tuple (['string', g.skip_python_string (s, i, __kwargtrans__ ({verbose: false}))]);
			var kind = __left0__ [0];
			var i = __left0__ [1];
		}
		else if (ch == '_' || ch.isalpha ()) {
			var __left0__ = tuple (['id', g.skip_id (s, i)]);
			var kind = __left0__ [0];
			var i = __left0__ [1];
		}
		else {
			var __left0__ = tuple (['other', i + 1]);
			var kind = __left0__ [0];
			var i = __left0__ [1];
		}
		var val = s.__getslice__ (j, i, 1);
		if (line_numbers) {
			line_number += val.count ('\n');
			result.append (tuple ([kind, val, line_number]));
		}
		else {
			result.append (tuple ([kind, val]));
		}
	}
	return result;
};
export var exec_file = function (path, d, script) {
	if (typeof script == 'undefined' || (script != null && script.hasOwnProperty ("__kwargtrans__"))) {;
		var script = null;
	};
	if (script === null) {
		var f = open (path);
		try {
			f.__enter__ ();
			var script = f.read ();
			f.__exit__ ();
		}
		catch (__except0__) {
			if (! (f.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
				throw __except0__;
			}
		}
	}
	exec (compile (script, path, 'exec'), d);
};
export var execute_shell_commands = function (commands, trace) {
	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
		var trace = false;
	};
	if (isinstance (commands, str)) {
		var commands = [commands];
	}
	for (var command of commands) {
		var wait = !(command.startswith ('&'));
		if (trace) {
			g.trace (command);
		}
		if (command.startswith ('&')) {
			var command = command.__getslice__ (1, null, 1).strip ();
		}
		var proc = subprocess.Popen (command, __kwargtrans__ ({shell: true}));
		if (wait) {
			proc.communicate ();
		}
		else {
			if (trace) {
				print ('Start:', proc);
			}
			var proc_poller = function (timer, proc) {
				if (typeof proc == 'undefined' || (proc != null && proc.hasOwnProperty ("__kwargtrans__"))) {;
					var proc = proc;
				};
				var val = proc.poll ();
				if (val !== null) {
					if (trace) {
						print ('  End:', proc, val);
					}
					timer.stop ();
				}
			};
			g.IdleTime (proc_poller, __kwargtrans__ ({delay: 0})).start ();
		}
	}
};
export var execute_shell_commands_with_options = function (base_dir, c, command_setting, commands, path_setting, trace, warning) {
	if (typeof base_dir == 'undefined' || (base_dir != null && base_dir.hasOwnProperty ("__kwargtrans__"))) {;
		var base_dir = null;
	};
	if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
		var c = null;
	};
	if (typeof command_setting == 'undefined' || (command_setting != null && command_setting.hasOwnProperty ("__kwargtrans__"))) {;
		var command_setting = null;
	};
	if (typeof commands == 'undefined' || (commands != null && commands.hasOwnProperty ("__kwargtrans__"))) {;
		var commands = null;
	};
	if (typeof path_setting == 'undefined' || (path_setting != null && path_setting.hasOwnProperty ("__kwargtrans__"))) {;
		var path_setting = null;
	};
	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
		var trace = false;
	};
	if (typeof warning == 'undefined' || (warning != null && warning.hasOwnProperty ("__kwargtrans__"))) {;
		var warning = null;
	};
	var base_dir = g.computeBaseDir (c, base_dir, path_setting, trace);
	if (!(base_dir)) {
		return ;
	}
	var commands = g.computeCommands (c, commands, command_setting, trace);
	if (!(commands)) {
		return ;
	}
	if (warning) {
		g.es_print (warning);
	}
	os.chdir (base_dir);
	g.execute_shell_commands (commands);
};
export var computeBaseDir = function (c, base_dir, path_setting, trace) {
	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
		var trace = false;
	};
	if (path_setting) {
		if (!(c)) {
			return g.es_print ('@string path_setting requires valid c arg');
		}
		var base_dir2 = c.config.getString (path_setting);
		if (base_dir2) {
			var base_dir2 = base_dir2.py_replace ('\\', '/');
			if (g.os_path_exists (base_dir2)) {
				return base_dir2;
			}
			return g.es_print ('@string {} not found: {}'.format (path_setting, base_dir2));
		}
	}
	if (base_dir) {
		var base_dir = base_dir.py_replace ('\\', '/');
		if (g.os_path_exists (base_dir)) {
			return base_dir;
		}
		return g.es_print ('base_dir not found: {}'.format (base_dir));
	}
	return g.es_print ('Please use @string {}'.format (path_setting));
};
export var computeCommands = function (c, commands, command_setting, trace) {
	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
		var trace = false;
	};
	if (!(commands) && !(command_setting)) {
		g.es_print ('Please use commands, command_setting or both');
		return [];
	}
	if (command_setting) {
		if (c) {
			var aList = c.config.getData (command_setting);
			return aList || commands;
		}
		g.es_print ('@data command_setting requires valid c arg');
		return [];
	}
	return commands;
};
export var executeFile = function (filename, options) {
	if (typeof options == 'undefined' || (options != null && options.hasOwnProperty ("__kwargtrans__"))) {;
		var options = '';
	};
	if (!(os.access (filename, os.R_OK))) {
		return ;
	}
	var __left0__ = g.os_path_split (filename);
	var fdir = __left0__ [0];
	var fname = __left0__ [1];
	var subprocess_wrapper = function (cmdlst) {
		var p = subprocess.Popen (cmdlst, __kwargtrans__ ({cwd: fdir, universal_newlines: true, stdout: subprocess.PIPE, stderr: subprocess.PIPE}));
		var __left0__ = p.communicate ();
		var stdo = __left0__ [0];
		var stde = __left0__ [1];
		return tuple ([p.wait (), stdo, stde]);
	};
	var __left0__ = subprocess_wrapper ('{} {} {}'.format (sys.executable, fname, options));
	var rc = __left0__ [0];
	var so = __left0__ [1];
	var se = __left0__ [2];
	if (rc) {
		g.pr ('return code', rc);
	}
	g.pr (so, se);
};
export var findNodeInChildren = function (c, p, headline, exact) {
	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
		var exact = true;
	};
	var p1 = p.copy ();
	var h = headline.strip ();
	for (var p of p1.children ()) {
		if (p.h.strip () == h) {
			return p.copy ();
		}
	}
	if (!(exact)) {
		for (var p of p1.children ()) {
			if (p.h.strip ().startswith (h)) {
				return p.copy ();
			}
		}
	}
	return null;
};
export var findNodeInTree = function (c, p, headline, exact) {
	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
		var exact = true;
	};
	var h = headline.strip ();
	var p1 = p.copy ();
	for (var p of p1.subtree ()) {
		if (p.h.strip () == h) {
			return p.copy ();
		}
	}
	if (!(exact)) {
		for (var p of p1.subtree ()) {
			if (p.h.strip ().startswith (h)) {
				return p.copy ();
			}
		}
	}
	return null;
};
export var findNodeAnywhere = function (c, headline, exact) {
	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
		var exact = true;
	};
	var h = headline.strip ();
	for (var p of c.all_unique_positions (__kwargtrans__ ({copy: false}))) {
		if (p.h.strip () == h) {
			return p.copy ();
		}
	}
	if (!(exact)) {
		for (var p of c.all_unique_positions (__kwargtrans__ ({copy: false}))) {
			if (p.h.strip ().startswith (h)) {
				return p.copy ();
			}
		}
	}
	return null;
};
export var findTopLevelNode = function (c, headline, exact) {
	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
		var exact = true;
	};
	var h = headline.strip ();
	for (var p of c.rootPosition ().self_and_siblings (__kwargtrans__ ({copy: false}))) {
		if (p.h.strip () == h) {
			return p.copy ();
		}
	}
	if (!(exact)) {
		for (var p of c.rootPosition ().self_and_siblings (__kwargtrans__ ({copy: false}))) {
			if (p.h.strip ().startswith (h)) {
				return p.copy ();
			}
		}
	}
	return null;
};
export var getScript = function (c, p, useSelectedText, forcePythonSentinels, useSentinels) {
	if (typeof useSelectedText == 'undefined' || (useSelectedText != null && useSelectedText.hasOwnProperty ("__kwargtrans__"))) {;
		var useSelectedText = true;
	};
	if (typeof forcePythonSentinels == 'undefined' || (forcePythonSentinels != null && forcePythonSentinels.hasOwnProperty ("__kwargtrans__"))) {;
		var forcePythonSentinels = true;
	};
	if (typeof useSentinels == 'undefined' || (useSentinels != null && useSentinels.hasOwnProperty ("__kwargtrans__"))) {;
		var useSentinels = true;
	};
	var w = c.frame.body.wrapper;
	if (!(p)) {
		var p = c.p;
	}
	try {
		if (g.app.inBridge) {
			var s = p.b;
		}
		else if (w && p == c.p && useSelectedText && w.hasSelection ()) {
			var s = w.getSelectedText ();
		}
		else {
			var s = p.b;
		}
		var s = g.removeExtraLws (s, c.tab_width);
		var s = g.extractExecutableString (c, p, s);
		var script = g.composeScript (c, p, s, __kwargtrans__ ({forcePythonSentinels: forcePythonSentinels, useSentinels: useSentinels}));
	}
	catch (__except0__) {
		if (isinstance (__except0__, Exception)) {
			g.es_print ('unexpected exception in g.getScript');
			g.es_exception ();
			var script = '';
		}
		else {
			throw __except0__;
		}
	}
	return script;
};
export var composeScript = function (c, p, s, forcePythonSentinels, useSentinels) {
	if (typeof forcePythonSentinels == 'undefined' || (forcePythonSentinels != null && forcePythonSentinels.hasOwnProperty ("__kwargtrans__"))) {;
		var forcePythonSentinels = true;
	};
	if (typeof useSentinels == 'undefined' || (useSentinels != null && useSentinels.hasOwnProperty ("__kwargtrans__"))) {;
		var useSentinels = true;
	};
	if (!(s.strip ())) {
		return '';
	}
	var at = c.atFileCommands;
	var old_in_script = g.app.inScript;
	try {
		var __left0__ = true;
		g.app.inScript = __left0__;
		g.inScript = __left0__;
		g.app.scriptDict ['script1'] = s;
		var script = at.stringToString (p.copy (), s, __kwargtrans__ ({forcePythonSentinels: forcePythonSentinels, sentinels: useSentinels}));
		var script = script.py_replace ('\r\n', '\n');
		g.app.scriptDict ['script2'] = script;
	}
	finally {
		var __left0__ = old_in_script;
		g.app.inScript = __left0__;
		g.inScript = __left0__;
	}
	return script;
};
export var extractExecutableString = function (c, p, s) {
	if (g.unitTesting) {
		return s;
	}
	var language = g.scanForAtLanguage (c, p);
	if (!(language)) {
		return s;
	}
	var pattern = '^@language\\s+(\\w+)';
	var matches = list (re.finditer (pattern, s, re.MULTILINE));
	if (len (matches) < 2) {
		return s;
	}
	var __left0__ = tuple ([false, []]);
	var extracting = __left0__ [0];
	var result = __left0__ [1];
	for (var [i, line] of enumerate (g.splitLines (s))) {
		var m = re.match (pattern, line);
		if (m) {
			var extracting = m.group (1) == language;
		}
		else if (extracting) {
			result.append (line);
		}
	}
	return ''.join (result);
};
export var handleScriptException = function (c, p, script, script1) {
	g.warning ('exception executing script');
	var full = c.config.getBool ('show-full-tracebacks-in-scripts');
	var __left0__ = g.es_exception (__kwargtrans__ ({full: full}));
	var fileName = __left0__ [0];
	var n = __left0__ [1];
	if (p.v.context == c) {
		try {
			c.goToScriptLineNumber (n, p);
			if (g.os_path_exists (fileName)) {
				var f = open (fileName);
				try {
					f.__enter__ ();
					var lines = f.readlines ();
					f.__exit__ ();
				}
				catch (__except0__) {
					if (! (f.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
						throw __except0__;
					}
				}
			}
			else {
				var lines = g.splitLines (script);
			}
			var s = '-' * 20;
			g.es_print ('', s);
			var i = max (0, n - 2);
			var j = min (n + 2, len (lines));
			while (i < j) {
				var ch = (i == n - 1 ? '*' : ' ');
				var s = '{} line {}: {}'.format (ch, i + 1, lines [i]);
				g.es ('', s, __kwargtrans__ ({newline: false}));
				i++;
			}
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es_print ('Unexpected exception in g.handleScriptException');
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
	}
};
export var insertCodingLine = function (encoding, script) {
	if (script) {
		var tag = '@first # -*- coding:';
		var lines = g.splitLines (script);
		var __break0__ = false;
		for (var s of lines) {
			if (s.startswith (tag)) {
				__break0__ = true;
				break;
			}
		}
		if (!__break0__) {
			lines.insert (0, '{} {} -*-\n'.format (tag, encoding));
			var script = ''.join (lines);
		}
	}
	return script;
};
export var findTestScript = function (c, h, where, warn) {
	if (typeof where == 'undefined' || (where != null && where.hasOwnProperty ("__kwargtrans__"))) {;
		var where = null;
	};
	if (typeof warn == 'undefined' || (warn != null && warn.hasOwnProperty ("__kwargtrans__"))) {;
		var warn = true;
	};
	if (where) {
		var p = g.findNodeAnywhere (c, where);
		if (p) {
			var p = g.findNodeInTree (c, p, h);
		}
	}
	else {
		var p = g.findNodeAnywhere (c, h);
	}
	if (p) {
		return g.getScript (c, p);
	}
	if (warn) {
		g.trace ('Not found', h);
	}
	return null;
};
export var getTestVars = function () {
	var d = g.app.unitTestDict;
	var c = d.py_get ('c');
	var p = d.py_get ('p');
	d ['getTestVars'] = true;
	return tuple ([c, p && p.copy ()]);
};
export var run_unit_test_in_separate_process = function (command) {
	var leo_editor_dir = os.path.join (g.app.loadDir, '..', '..');
	os.chdir (leo_editor_dir);
	var p = subprocess.Popen (shlex.py_split (command), __kwargtrans__ ({stdout: subprocess.PIPE, stderr: subprocess.PIPE, shell: sys.platform.startswith ('win')}));
	var __left0__ = p.communicate ();
	var out = __left0__ [0];
	var err = __left0__ [1];
	var err = g.toUnicode (err);
	var out = g.toUnicode (out);
	print ('');
	print (command);
	if (out.strip ()) {
		print (out.rstrip ());
	}
	print (err.rstrip ());
	var err_lines = g.splitLines (err.rstrip ());
};
export var toEncodedStringWithErrorCode = function (s, encoding, reportErrors) {
	if (typeof reportErrors == 'undefined' || (reportErrors != null && reportErrors.hasOwnProperty ("__kwargtrans__"))) {;
		var reportErrors = false;
	};
	var ok = true;
	if (g.isUnicode (s)) {
		try {
			var s = s.encode (encoding, 'strict');
		}
		catch (__except0__) {
			if (isinstance (__except0__, UnicodeError)) {
				var s = s.encode (encoding, 'replace');
				if (reportErrors) {
					g.error ('Error converting {} from unicode to {} encoding'.format (s, encoding));
				}
				var ok = false;
			}
			else {
				throw __except0__;
			}
		}
	}
	return tuple ([s, ok]);
};
export var toUnicodeWithErrorCode = function (s, encoding, reportErrors) {
	if (typeof reportErrors == 'undefined' || (reportErrors != null && reportErrors.hasOwnProperty ("__kwargtrans__"))) {;
		var reportErrors = false;
	};
	if (s === null) {
		return tuple (['', true]);
	}
	if (isinstance (s, str)) {
		return tuple ([s, true]);
	}
	try {
		var s = str (s, encoding, 'strict');
		return tuple ([s, true]);
	}
	catch (__except0__) {
		if (isinstance (__except0__, UnicodeError)) {
			var s = str (s, encoding, 'replace');
			if (reportErrors) {
				g.error ('Error converting {} from {} encoding to unicode'.format (s, encoding));
			}
			return tuple ([s, false]);
		}
		else {
			throw __except0__;
		}
	}
};
export var unl_regex = re.compile ('\\bunl:.*$');
export var kinds = '(file|ftp|gopher|http|https|mailto|news|nntp|prospero|telnet|wais)';
export var url_regex = re.compile ('{}://[^\\s\'"]+[\\w=/]'.format (kinds));
export var unquoteUrl = function (url) {
	return urllib.parse.unquote (url);
};
export var computeFileUrl = function (fn, c, p) {
	if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
		var c = null;
	};
	if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
		var p = null;
	};
	var url = urllib.parse.unquote (fn);
	var i = url.find ('~');
	if (i > -(1)) {
		var path = url.__getslice__ (i, null, 1);
		var path = g.os_path_expanduser (path);
		var path = g.os_path_finalize (path);
		var url = url.__getslice__ (0, i, 1) + path;
	}
	else {
		var tag = 'file://';
		var tag2 = 'file:///';
		if (sys.platform.startswith ('win') && url.startswith (tag2)) {
			var path = url.__getslice__ (len (tag2), null, 1).lstrip ();
		}
		else if (url.startswith (tag)) {
			var path = url.__getslice__ (len (tag), null, 1).lstrip ();
		}
		else {
			var path = url;
		}
		if (c && c.openDirectory) {
			var base = c.getNodePath (p);
			var path = g.os_path_finalize_join (c.openDirectory, base, path);
		}
		else {
			var path = g.os_path_finalize (path);
		}
		var url = '{}{}'.format (tag, path);
	}
	return url;
};
export var getUrlFromNode = function (p) {
	if (!(p)) {
		return null;
	}
	var c = p.v.context;
	var table = [p.h, (p.b ? g.splitLines (p.b) [0] : '')];
	var table = (function () {
		var __accu0__ = [];
		for (var s of table) {
			__accu0__.append ((g.match_word (s, 0, '@url') ? s.__getslice__ (4, null, 1) : s));
		}
		return __accu0__;
	}) ();
	var table = (function () {
		var __accu0__ = [];
		for (var s of table) {
			if (s.strip ()) {
				__accu0__.append (s.strip ());
			}
		}
		return __accu0__;
	}) ();
	for (var s of table) {
		if (g.isValidUrl (s)) {
			return s;
		}
	}
	for (var s of table) {
		var tag = 'file://';
		var url = computeFileUrl (s, __kwargtrans__ ({c: c, p: p}));
		if (url.startswith (tag)) {
			var fn = url.__getslice__ (len (tag), null, 1).lstrip ();
			var fn = fn.py_split ('#', 1) [0];
			if (g.os_path_isfile (fn)) {
				return 'file://' + s;
			}
		}
	}
	for (var s of table) {
		if (s.startswith ('#')) {
			return s;
		}
	}
	return null;
};
export var handleUrl = function (url, c, p) {
	if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
		var c = null;
	};
	if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
		var p = null;
	};
	if (c && !(p)) {
		var p = c.p;
	}
	var urll = url.lower ();
	if (urll.startswith ('@url')) {
		var url = url.__getslice__ (4, null, 1).lstrip ();
	}
	if (urll.startswith ('unl:' + '//') || urll.startswith ('file://') && url.find ('-->') > -(1) || urll.startswith ('#')) {
		return g.handleUnl (url, c);
	}
	try {
		return g.handleUrlHelper (url, c, p);
	}
	catch (__except0__) {
		if (isinstance (__except0__, Exception)) {
			g.es_print ('exception opening', repr (url));
			g.es_exception ();
			return null;
		}
		else {
			throw __except0__;
		}
	}
};
export var handleUrlHelper = function (url, c, p) {
	var tag = 'file://';
	var original_url = url;
	if (url.startswith (tag) && !(url.startswith (tag + '#'))) {
		var url = g.computeFileUrl (url, __kwargtrans__ ({c: c, p: p}));
	}
	var parsed = urlparse.urlparse (url);
	if (parsed.netloc) {
		var leo_path = os.path.join (parsed.netloc, parsed.path);
	}
	else {
		var leo_path = parsed.path;
	}
	if (leo_path.endswith ('\\')) {
		var leo_path = leo_path.__getslice__ (0, -(1), 1);
	}
	if (leo_path.endswith ('/')) {
		var leo_path = leo_path.__getslice__ (0, -(1), 1);
	}
	if (parsed.scheme == 'file' && leo_path.endswith ('.leo')) {
		g.handleUnl (original_url, c);
	}
	else if (__in__ (parsed.scheme, tuple (['', 'file']))) {
		var unquote_path = g.unquoteUrl (leo_path);
		if (g.unitTesting) {
			g.app.unitTestDict ['os_startfile'] = unquote_path;
		}
		else if (g.os_path_exists (leo_path)) {
			g.os_startfile (unquote_path);
		}
		else {
			g.es ("File '{}' does not exist".format (leo_path));
		}
	}
	else {
	}
};
export var traceUrl = function (c, path, parsed, url) {
	print ();
	g.trace ('url          ', url);
	g.trace ('c.frame.title', c.frame.title);
	g.trace ('path         ', path);
	g.trace ('parsed.fragment', parsed.fragment);
	g.trace ('parsed.netloc', parsed.netloc);
	g.trace ('parsed.path  ', parsed.path);
	g.trace ('parsed.scheme', repr (parsed.scheme));
};
export var handleUnl = function (unl, c) {
	if (!(unl)) {
		return null;
	}
	var unll = unl.lower ();
	if (unll.startswith ('unl:' + '//')) {
		var unl = unl.__getslice__ (6, null, 1);
	}
	else if (unll.startswith ('file://')) {
		var unl = unl.__getslice__ (7, null, 1);
	}
	var unl = unl.strip ();
	if (!(unl)) {
		return null;
	}
	var unl = g.unquoteUrl (unl);
	if (unl.find ('#') == -(1) && unl.find ('-->') == -(1)) {
		var __left0__ = tuple ([unl, null]);
		var path = __left0__ [0];
		var unl = __left0__ [1];
	}
	else if (unl.find ('#') == -(1)) {
		g.recursiveUNLSearch (unl.py_split ('-->'), c, __kwargtrans__ ({soft_idx: true}));
		return c;
	}
	else {
		var __left0__ = unl.py_split ('#', 1);
		var path = __left0__ [0];
		var unl = __left0__ [1];
	}
	if (!(path)) {
		g.recursiveUNLSearch (unl.py_split ('-->'), c, __kwargtrans__ ({soft_idx: true}));
		return c;
	}
	if (c) {
		var base = g.os_path_dirname (c.fileName ());
		var c_path = g.os_path_finalize_join (base, path);
	}
	else {
		var c_path = null;
	}
	var table = tuple ([c_path, g.os_path_finalize_join (g.app.loadDir, '..', path), g.os_path_finalize_join (g.app.loadDir, '..', '..', path), g.os_path_finalize_join (g.app.loadDir, '..', 'core', path), g.os_path_finalize_join (g.app.loadDir, '..', 'config', path), g.os_path_finalize_join (g.app.loadDir, '..', 'dist', path), g.os_path_finalize_join (g.app.loadDir, '..', 'doc', path), g.os_path_finalize_join (g.app.loadDir, '..', 'test', path), g.app.loadDir, g.app.homeDir]);
	var __break0__ = false;
	for (var path2 of table) {
		if (path2 && path2.lower ().endswith ('.leo') && os.path.exists (path2)) {
			var path = path2;
			__break0__ = true;
			break;
		}
	}
	if (!__break0__) {
		g.es_print ('path not found', repr (path));
		return null;
	}
	c.endEditing ();
	c.redraw ();
	if (g.unitTesting) {
		g.app.unitTestDict ['g.recursiveUNLSearch'] = path;
	}
	else {
		var c2 = g.openWithFileName (path, __kwargtrans__ ({old_c: c}));
		if (unl) {
			g.recursiveUNLSearch (unl.py_split ('-->'), c2 || c, __kwargtrans__ ({soft_idx: true}));
		}
		if (c2) {
			c2.bringToFront ();
			return c2;
		}
	}
	return null;
};
export var isValidUrl = function (url) {
	var table = tuple (['file', 'ftp', 'gopher', 'hdl', 'http', 'https', 'imap', 'mailto', 'mms', 'news', 'nntp', 'prospero', 'rsync', 'rtsp', 'rtspu', 'sftp', 'shttp', 'sip', 'sips', 'snews', 'svn', 'svn+ssh', 'telnet', 'wais']);
	if (url.lower ().startswith ('unl:' + '//') || url.startswith ('#')) {
		return true;
	}
	if (url.startswith ('@')) {
		return false;
	}
	var parsed = urlparse.urlparse (url);
	var scheme = parsed.scheme;
	for (var s of table) {
		if (scheme.startswith (s)) {
			return true;
		}
	}
	return false;
};
export var openUrl = function (p) {
	if (p) {
		var url = g.getUrlFromNode (p);
		if (url) {
			var c = p.v.context;
			if (!(g.doHook ('@url1', __kwargtrans__ ({c: c, p: p, url: url})))) {
				g.handleUrl (url, __kwargtrans__ ({c: c, p: p}));
			}
			g.doHook ('@url2', __kwargtrans__ ({c: c, p: p, url: url}));
		}
	}
};
export var openUrlOnClick = function (event, url) {
	if (typeof url == 'undefined' || (url != null && url.hasOwnProperty ("__kwargtrans__"))) {;
		var url = null;
	};
	try {
		return openUrlHelper (event, url);
	}
	catch (__except0__) {
		if (isinstance (__except0__, Exception)) {
			g.es_exception ();
			return null;
		}
		else {
			throw __except0__;
		}
	}
};
export var openUrlHelper = function (event, url) {
	if (typeof url == 'undefined' || (url != null && url.hasOwnProperty ("__kwargtrans__"))) {;
		var url = null;
	};
	var c = getattr (event, 'c', null);
	if (!(c)) {
		return null;
	}
	var w = getattr (event, 'w', c.frame.body.wrapper);
	if (!(g.app.gui.isTextWrapper (w))) {
		g.internalError ('must be a text wrapper', w);
		return null;
	}
	setattr (event, 'widget', w);
	if (url === null) {
		var s = w.getAllText ();
		var ins = w.getInsertPoint ();
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		if (i != j) {
			return null;
		}
		var __left0__ = g.convertPythonIndexToRowCol (s, ins);
		var row = __left0__ [0];
		var col = __left0__ [1];
		var __left0__ = g.getLine (s, ins);
		var i = __left0__ [0];
		var j = __left0__ [1];
		var line = s.__getslice__ (i, j, 1);
		var __break0__ = false;
		for (var match of g.url_regex.finditer (line)) {
			if ((match.start () <= col && col < match.end ())) {
				var url = match.group ();
				if (g.isValidUrl (url)) {
					__break0__ = true;
					break;
				}
			}
		}
		if (!__break0__) {
			for (var match of g.unl_regex.finditer (line)) {
				if ((match.start () <= col && col < match.end ())) {
					var unl = match.group ();
					g.handleUnl (unl, c);
					return null;
				}
			}
		}
	}
	else if (!(isinstance (url, str))) {
		var url = url.toString ();
		var url = g.toUnicode (url);
	}
	if (url && g.isValidUrl (url)) {
		var p = c.p;
		if (!(g.doHook ('@url1', __kwargtrans__ ({c: c, p: p, url: url})))) {
			g.handleUrl (url, __kwargtrans__ ({c: c, p: p}));
		}
		g.doHook ('@url2', __kwargtrans__ ({c: c, p: p}));
		return url;
	}
	if (!(w.hasSelection ())) {
		c.editCommands.extendToWord (event, __kwargtrans__ ({select: true}));
	}
	var word = w.getSelectedText ().strip ();
	if (word) {
		c.findCommands.findDef (event);
	}
	return null;
};
export var g = sys.modules.py_get ('leo.core.leoGlobals');
if (__name__ == '__main__') {
	unittest.main ();
}

//# sourceMappingURL=leo.core.leoGlobals.map