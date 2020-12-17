/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 09:36:41
/* 000010 */ var inspect = {};
/* 000010 */ var re = {};
/* 000010 */ var sys = {};
/* 000010 */ var time = {};
/* 000010 */ import {} from './org.transcrypt.__runtime__.js';
/* 000255 */ import {leoCommands} from './leo.core.js';
/* 000216 */ import * as leoCommands from './leo.core.leoCommands.js';
/* 000034 */ import * as __module_time__ from './time.js';
/* 000034 */ __nest__ (time, '', __module_time__);
/* 000033 */ import * as __module_re__ from './re.js';
/* 000033 */ __nest__ (re, '', __module_re__);
/* 000029 */ import * as __module_inspect__ from './inspect.js';
/* 000029 */ __nest__ (inspect, '', __module_inspect__);
/* 000010 */ import * as __module_sys__ from './sys.js';
/* 000010 */ __nest__ (sys, '', __module_sys__);
/* 000001 */ var __name__ = '__main__';
/* 000011 */ export var isPython3 = sys.version_info >= tuple ([3, 0, 0]);
/* 000012 */ export var minimum_python_version = '3.6';
/* 000014 */ export var isMac = sys.platform.startswith ('darwin');
/* 000015 */ export var isWindows = sys.platform.startswith ('win');
/* 000018 */ export var in_bridge = false;
/* 000072 */ export var globalDirectiveList = ['all', 'beautify', 'colorcache', 'code', 'color', 'comment', 'c', 'delims', 'doc', 'encoding', 'end_raw', 'first', 'header', 'ignore', 'killbeautify', 'killcolor', 'language', 'last', 'lineending', 'markup', 'nobeautify', 'nocolor-node', 'nocolor', 'noheader', 'nowrap', 'nopyflakes', 'nosearch', 'others', 'pagewidth', 'path', 'quiet', 'raw', 'root-code', 'root-doc', 'root', 'silent', 'tabwidth', 'terse', 'unit', 'verbose', 'wrap'];
/* 000093 */ export var directives_pat = null;
/* 000111 */ export var global_commands_dict = dict ({});
/* 000113 */ export var cmd_instance_dict = dict ({'AbbrevCommandsClass': ['c', 'abbrevCommands'], 'AtFile': ['c', 'atFileCommands'], 'AutoCompleterClass': ['c', 'k', 'autoCompleter'], 'ChapterController': ['c', 'chapterController'], 'Commands': ['c'], 'ControlCommandsClass': ['c', 'controlCommands'], 'DebugCommandsClass': ['c', 'debugCommands'], 'EditCommandsClass': ['c', 'editCommands'], 'EditFileCommandsClass': ['c', 'editFileCommands'], 'FileCommands': ['c', 'fileCommands'], 'HelpCommandsClass': ['c', 'helpCommands'], 'KeyHandlerClass': ['c', 'k'], 'KeyHandlerCommandsClass': ['c', 'keyHandlerCommands'], 'KillBufferCommandsClass': ['c', 'killBufferCommands'], 'LeoApp': ['g', 'app'], 'LeoFind': ['c', 'findCommands'], 'LeoImportCommands': ['c', 'importCommands'], 'PrintingController': ['c', 'printingController'], 'RectangleCommandsClass': ['c', 'rectangleCommands'], 'RstCommands': ['c', 'rstCommands'], 'SpellCommandsClass': ['c', 'spellCommands'], 'Undoer': ['c', 'undoer'], 'VimCommands': ['c', 'vimCommands']});
/* 000145 */ export var callback = function (func) {
/* 000157 */ 	var callback_wrapper = function () {
/* 000157 */ 		var args = tuple ([].slice.apply (arguments).slice (0));
/* 000159 */ 		try {
/* 000160 */ 			return func (...args, __kwargtrans__ (py_keys));
/* 000160 */ 		}
/* 000160 */ 		catch (__except0__) {
/* 000160 */ 			if (isinstance (__except0__, Exception)) {
/* 000162 */ 				g.es_exception ();
/* 000162 */ 			}
/* 000162 */ 			else {
/* 000162 */ 				throw __except0__;
/* 000162 */ 			}
/* 000162 */ 		}
/* 000162 */ 	};
/* 000164 */ 	return callback_wrapper;
/* 000164 */ };
/* 000166 */ export var check_cmd_instance_dict = function (c, g) {
/* 000171 */ 	var d = cmd_instance_dict;
/* 000172 */ 	for (var key of d) {
/* 000173 */ 		var ivars = d.py_get (key);
/* 000174 */ 		var obj = ivars2instance (c, g, ivars);
/* 000176 */ 		if (obj) {
/* 000177 */ 			var py_name = obj.__class__.__name__;
/* 000178 */ 			if (py_name != key) {
/* 000179 */ 				g.trace ('class mismatch', key, py_name);
/* 000179 */ 			}
/* 000179 */ 		}
/* 000179 */ 	}
/* 000179 */ };
/* 000181 */ export var Command =  __class__ ('Command', [object], {
/* 000181 */ 	__module__: __name__,
/* 000196 */ 	get __init__ () {return __get__ (this, function (self, py_name) {
/* 000198 */ 		self.py_name = py_name;
/* 000198 */ 	});},
/* 000200 */ 	get __call__ () {return __get__ (this, function (self, func) {
/* 000202 */ 		global_commands_dict [self.py_name] = func;
/* 000203 */ 		if (app) {
/* 000204 */ 			for (var c of app.commanders ()) {
/* 000205 */ 				c.k.registerCommand (self.py_name, func);
/* 000205 */ 			}
/* 000205 */ 		}
/* 000207 */ 		func.__func_name__ = func.__name__;
/* 000208 */ 		func.is_command = true;
/* 000209 */ 		func.command_name = self.py_name;
/* 000210 */ 		return func;
/* 000210 */ 	});}
/* 000210 */ });
/* 000212 */ export var command = Command;
/* 000214 */ export var command_alias = function (alias, func) {
/* 000218 */ 	funcToMethod (func, leoCommands.Commands, alias);
/* 000218 */ };
/* 000220 */ export var CommanderCommand =  __class__ ('CommanderCommand', [object], {
/* 000220 */ 	__module__: __name__,
/* 000237 */ 	get __init__ () {return __get__ (this, function (self, py_name) {
/* 000239 */ 		self.py_name = py_name;
/* 000239 */ 	});},
/* 000241 */ 	get __call__ () {return __get__ (this, function (self, func) {
/* 000244 */ 		var commander_command_wrapper = function (event) {
/* 000245 */ 			var c = event.py_get ('c');
/* 000246 */ 			var method = getattr (c, func.__name__, null);
/* 000247 */ 			method (__kwargtrans__ ({event: event}));
/* 000247 */ 		};
/* 000250 */ 		commander_command_wrapper.__func_name__ = func.__name__;
/* 000251 */ 		commander_command_wrapper.__name__ = self.py_name;
/* 000252 */ 		commander_command_wrapper.__doc__ = func.__doc__;
/* 000253 */ 		global_commands_dict [self.py_name] = commander_command_wrapper;
/* 000254 */ 		if (app) {
/* 000256 */ 			funcToMethod (func, leoCommands.Commands);
/* 000257 */ 			for (var c of app.commanders ()) {
/* 000258 */ 				c.k.registerCommand (self.py_name, func);
/* 000258 */ 			}
/* 000258 */ 		}
/* 000260 */ 		func.is_command = true;
/* 000261 */ 		func.command_name = self.py_name;
/* 000262 */ 		return func;
/* 000262 */ 	});}
/* 000262 */ });
/* 000264 */ export var commander_command = CommanderCommand;
/* 000266 */ export var ivars2instance = function (c, g, ivars) {
/* 000272 */ 	if (!(ivars)) {
/* 000273 */ 		g.trace ('can not happen: no ivars');
/* 000274 */ 		return null;
/* 000274 */ 	}
/* 000275 */ 	var ivar = ivars [0];
/* 000276 */ 	if (!__in__ (ivar, tuple (['c', 'g']))) {
/* 000277 */ 		g.trace ('can not happen: unknown base', ivar);
/* 000278 */ 		return null;
/* 000278 */ 	}
/* 000279 */ 	var obj = (ivar == 'c' ? c : g);
/* 000280 */ 	for (var ivar of ivars.__getslice__ (1, null, 1)) {
/* 000281 */ 		var obj = getattr (obj, ivar, null);
/* 000282 */ 		if (!(obj)) {
/* 000283 */ 			g.trace ('can not happen: unknown attribute', obj, ivar, ivars);
/* 000283 */ 			break;
/* 000283 */ 		}
/* 000283 */ 	}
/* 000285 */ 	return obj;
/* 000285 */ };
/* 000287 */ export var new_cmd_decorator = function (py_name, ivars) {
/* 000296 */ 	var _decorator = function (func) {
/* 000298 */ 		var new_cmd_wrapper = function (event) {
/* 000299 */ 			var c = event.c;
/* 000300 */ 			var self = g.ivars2instance (c, g, ivars);
/* 000301 */ 			try {
/* 000302 */ 				func (self, __kwargtrans__ ({event: event}));
/* 000302 */ 			}
/* 000302 */ 			catch (__except0__) {
/* 000302 */ 				if (isinstance (__except0__, Exception)) {
/* 000306 */ 					g.es_exception ();
/* 000306 */ 				}
/* 000306 */ 				else {
/* 000306 */ 					throw __except0__;
/* 000306 */ 				}
/* 000306 */ 			}
/* 000306 */ 		};
/* 000308 */ 		new_cmd_wrapper.__func_name__ = func.__name__;
/* 000309 */ 		new_cmd_wrapper.__name__ = py_name;
/* 000310 */ 		new_cmd_wrapper.__doc__ = func.__doc__;
/* 000311 */ 		global_commands_dict [py_name] = new_cmd_wrapper;
/* 000313 */ 		return func;
/* 000313 */ 	};
/* 000316 */ 	return _decorator;
/* 000316 */ };
/* 000321 */ export var g_language_pat = re.compile ('^@language\\s+(\\w+)+', re.MULTILINE);
/* 000325 */ export var g_is_directive_pattern = re.compile ('^\\s*@([\\w-]+)\\s*');
/* 000328 */ export var g_noweb_root = re.compile ((((('<' + '<') + '*') + '>') + '>') + '=', re.MULTILINE);
/* 000329 */ export var g_pos_pattern = re.compile (':(\\d+),?(\\d+)?,?([-\\d]+)?,?(\\d+)?$');
/* 000330 */ export var g_tabwidth_pat = re.compile ('(^@tabwidth)', re.MULTILINE);
/* 000332 */ export var tree_popup_handlers = [];
/* 000333 */ export var user_dict = dict ({});
/* 000336 */ export var app = null;
/* 000338 */ export var inScript = false;
/* 000339 */ export var unitTesting = false;
/* 000343 */ export var standard_timestamp = function () {
/* 000345 */ 	return time.strftime ('%Y%m%d-%H%M%S');
/* 000345 */ };
/* 000347 */ export var get_backup_path = function (sub_directory) {
/* 000347 */ };
/* 006998 */ export var createScratchCommander = function (fileName) {
/* 006998 */ 	if (typeof fileName == 'undefined' || (fileName != null && fileName.hasOwnProperty ("__kwargtrans__"))) {;
/* 006998 */ 		var fileName = null;
/* 006998 */ 	};
/* 006999 */ 	var c = g.app.newCommander (fileName);
/* 007000 */ 	var frame = c.frame;
/* 007001 */ 	frame.createFirstTreeNode ();
/* 007003 */ 	frame.setInitialWindowGeometry ();
/* 007004 */ 	frame.resizePanesToRatio (frame.ratio, frame.secondary_ratio);
/* 007004 */ };
/* 007006 */ export var funcToMethod = function (f, theClass, py_name) {
/* 007006 */ 	if (typeof py_name == 'undefined' || (py_name != null && py_name.hasOwnProperty ("__kwargtrans__"))) {;
/* 007006 */ 		var py_name = null;
/* 007006 */ 	};
/* 007022 */ 	setattr (theClass, py_name || f.__name__, f);
/* 007022 */ };
/* 007024 */ export var init_zodb_import_failed = false;
/* 007025 */ export var init_zodb_failed = dict ({});
/* 007026 */ export var init_zodb_db = dict ({});
/* 007028 */ export var init_zodb = function (pathToZodbStorage, verbose) {
/* 007028 */ 	if (typeof verbose == 'undefined' || (verbose != null && verbose.hasOwnProperty ("__kwargtrans__"))) {;
/* 007028 */ 		var verbose = true;
/* 007028 */ 	};
/* 007034 */ 	var db = init_zodb_db.py_get (pathToZodbStorage);
/* 007035 */ 	if (db) {
/* 007035 */ 		return db;
/* 007035 */ 	}
/* 007036 */ 	if (init_zodb_import_failed) {
/* 007036 */ 		return null;
/* 007036 */ 	}
/* 007037 */ 	var failed = init_zodb_failed.py_get (pathToZodbStorage);
/* 007038 */ 	if (failed) {
/* 007038 */ 		return null;
/* 007038 */ 	}
/* 007052 */ 	try {
/* 007053 */ 		var storage = ZODB.FileStorage.FileStorage (pathToZodbStorage);
/* 007054 */ 		var __left0__ = ZODB.DB (storage);
/* 007054 */ 		init_zodb_db [pathToZodbStorage] = __left0__;
/* 007054 */ 		var db = __left0__;
/* 007055 */ 		return db;
/* 007055 */ 	}
/* 007055 */ 	catch (__except0__) {
/* 007055 */ 		if (isinstance (__except0__, Exception)) {
/* 007057 */ 			if (verbose) {
/* 007058 */ 				g.es ('g.init_zodb: exception creating ZODB.DB instance');
/* 007059 */ 				g.es_exception ();
/* 007059 */ 			}
/* 007060 */ 			init_zodb_failed [pathToZodbStorage] = true;
/* 007061 */ 			return null;
/* 007061 */ 		}
/* 007061 */ 		else {
/* 007061 */ 			throw __except0__;
/* 007061 */ 		}
/* 007061 */ 	}
/* 007061 */ };
/* 007083 */ export var isMacOS = function () {
/* 007084 */ 	return sys.platform == 'darwin';
/* 007084 */ };
/* 007086 */ export var issueSecurityWarning = function (setting) {
/* 007087 */ 	g.es ('Security warning! Ignoring...', __kwargtrans__ ({color: 'red'}));
/* 007088 */ 	g.es (setting, __kwargtrans__ ({color: 'red'}));
/* 007089 */ 	g.es ('This setting can be set only in');
/* 007090 */ 	g.es ('leoSettings.leo or myLeoSettings.leo');
/* 007090 */ };
/* 007094 */ export var makeDict = function () {
/* 007096 */ 	return py_keys;
/* 007096 */ };
/* 007098 */ export var pep8_class_name = function (s) {
/* 007102 */ 	return ''.join ((function () {
/* 007102 */ 		var __accu0__ = [];
/* 007102 */ 		for (var z of s.py_split ('_')) {
/* 007102 */ 			if (z) {
/* 007102 */ 				__accu0__.append (z [0].upper () + z.__getslice__ (1, null, 1));
/* 007102 */ 			}
/* 007102 */ 		}
/* 007102 */ 		return __accu0__;
/* 007102 */ 	}) ());
/* 007102 */ };
/* 007104 */ if (0) {
/* 007105 */ 	cls ();
/* 007106 */ 	var aList = tuple (['_', '__', '_abc', 'abc_', 'abc', 'abc_xyz', 'AbcPdQ']);
/* 007115 */ 	for (var s of aList) {
/* 007116 */ 		print (pep8_class_name (s));
/* 007116 */ 	}
/* 007116 */ }
/* 007118 */ export var placate_pyflakes = function () {
/* 007118 */ 	var args = tuple ([].slice.apply (arguments).slice (0));
/* 007118 */ };
/* 007121 */ export var plural = function (obj) {
/* 007123 */ 	if (isinstance (obj, tuple ([list, tuple, str]))) {
/* 007124 */ 		var n = len (obj);
/* 007124 */ 	}
/* 007125 */ 	else {
/* 007126 */ 		var n = obj;
/* 007126 */ 	}
/* 007127 */ 	return (n == 1 ? '' : 's');
/* 007127 */ };
/* 007129 */ export var truncate = function (s, n) {
/* 007131 */ 	if (len (s) <= n) {
/* 007132 */ 		return s;
/* 007132 */ 	}
/* 007134 */ 	var s2 = s.__getslice__ (0, n - 3, 1) + '...({})'.format (len (s));
/* 007135 */ 	if (s.endswith ('\n')) {
/* 007136 */ 		return s2 + '\n';
/* 007136 */ 	}
/* 007137 */ 	return s2;
/* 007137 */ };
/* 007139 */ export var windows = function () {
/* 007140 */ 	return app && app.windowList;
/* 007140 */ };
/* 007145 */ export var glob_glob = function (pattern) {
/* 007147 */ 	var aList = glob.glob (pattern);
/* 007148 */ 	if (g.isWindows) {
/* 007149 */ 		var aList = (function () {
/* 007149 */ 			var __accu0__ = [];
/* 007149 */ 			for (var z of aList) {
/* 007149 */ 				__accu0__.append (z.py_replace ('\\', '/'));
/* 007149 */ 			}
/* 007149 */ 			return __accu0__;
/* 007149 */ 		}) ();
/* 007149 */ 	}
/* 007150 */ 	return aList;
/* 007150 */ };
/* 007152 */ export var os_path_abspath = function (path) {
/* 007154 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007155 */ 	var path = path.py_replace ('\x00', '');
/* 007156 */ 	var path = os.path.abspath (path);
/* 007157 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007158 */ 	if (g.isWindows) {
/* 007159 */ 		var path = path.py_replace ('\\', '/');
/* 007159 */ 	}
/* 007160 */ 	return path;
/* 007160 */ };
/* 007162 */ export var os_path_basename = function (path) {
/* 007164 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007165 */ 	var path = os.path.basename (path);
/* 007166 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007167 */ 	if (g.isWindows) {
/* 007168 */ 		var path = path.py_replace ('\\', '/');
/* 007168 */ 	}
/* 007169 */ 	return path;
/* 007169 */ };
/* 007171 */ export var os_path_dirname = function (path) {
/* 007173 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007174 */ 	var path = os.path.dirname (path);
/* 007175 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007176 */ 	if (g.isWindows) {
/* 007177 */ 		var path = path.py_replace ('\\', '/');
/* 007177 */ 	}
/* 007178 */ 	return path;
/* 007178 */ };
/* 007180 */ export var os_path_exists = function (path) {
/* 007182 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007183 */ 	var path = path.py_replace ('\x00', '');
/* 007184 */ 	return os.path.exists (path);
/* 007184 */ };
/* 007186 */ export var deprecated_messages = [];
/* 007188 */ export var os_path_expandExpression = function (s) {
/* 007195 */ 	var c = py_keys.py_get ('c');
/* 007196 */ 	if (!(c)) {
/* 007197 */ 		g.trace ('can not happen: no c', g.callers ());
/* 007198 */ 		return s;
/* 007198 */ 	}
/* 007199 */ 	var callers = g.callers (2);
/* 007200 */ 	if (!__in__ (callers, deprecated_messages)) {
/* 007201 */ 		deprecated_messages.append (callers);
/* 007202 */ 		g.es_print ('\nos_path_expandExpression is deprecated. called from: {}'.format (callers));
/* 007202 */ 	}
/* 007203 */ 	return c.expand_path_expression (s);
/* 007203 */ };
/* 007205 */ export var os_path_expanduser = function (path) {
/* 007207 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007208 */ 	var result = os.path.normpath (os.path.expanduser (path));
/* 007209 */ 	if (g.isWindows) {
/* 007210 */ 		var path = path.py_replace ('\\', '/');
/* 007210 */ 	}
/* 007211 */ 	return result;
/* 007211 */ };
/* 007213 */ export var os_path_finalize = function (path) {
/* 007218 */ 	var path = path.py_replace ('\x00', '');
/* 007219 */ 	var path = os.path.expanduser (path);
/* 007220 */ 	var path = os.path.abspath (path);
/* 007221 */ 	var path = os.path.normpath (path);
/* 007222 */ 	if (g.isWindows) {
/* 007223 */ 		var path = path.py_replace ('\\', '/');
/* 007223 */ 	}
/* 007225 */ 	return path;
/* 007225 */ };
/* 007227 */ export var os_path_finalize_join = function () {
/* 007227 */ 	var args = tuple ([].slice.apply (arguments).slice (0));
/* 007241 */ 	var path = g.os_path_join (...args, __kwargtrans__ (py_keys));
/* 007242 */ 	var path = g.os_path_finalize (path);
/* 007243 */ 	return path;
/* 007243 */ };
/* 007245 */ export var os_path_getmtime = function (path) {
/* 007247 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007248 */ 	try {
/* 007249 */ 		return os.path.getmtime (path);
/* 007249 */ 	}
/* 007249 */ 	catch (__except0__) {
/* 007249 */ 		if (isinstance (__except0__, Exception)) {
/* 007251 */ 			return 0;
/* 007251 */ 		}
/* 007251 */ 		else {
/* 007251 */ 			throw __except0__;
/* 007251 */ 		}
/* 007251 */ 	}
/* 007251 */ };
/* 007253 */ export var os_path_getsize = function (path) {
/* 007255 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007256 */ 	return os.path.getsize (path);
/* 007256 */ };
/* 007258 */ export var os_path_isabs = function (path) {
/* 007260 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007261 */ 	return os.path.isabs (path);
/* 007261 */ };
/* 007263 */ export var os_path_isdir = function (path) {
/* 007265 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007266 */ 	return os.path.isdir (path);
/* 007266 */ };
/* 007268 */ export var os_path_isfile = function (path) {
/* 007270 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007271 */ 	return os.path.isfile (path);
/* 007271 */ };
/* 007273 */ export var os_path_join = function () {
/* 007273 */ 	var args = tuple ([].slice.apply (arguments).slice (0));
/* 007281 */ 	var c = py_keys.py_get ('c');
/* 007282 */ 	var uargs = (function () {
/* 007282 */ 		var __accu0__ = [];
/* 007282 */ 		for (var arg of args) {
/* 007282 */ 			__accu0__.append (g.toUnicodeFileEncoding (arg));
/* 007282 */ 		}
/* 007282 */ 		return __accu0__;
/* 007282 */ 	}) ();
/* 007284 */ 	if (uargs && uargs [0] == '!!') {
/* 007285 */ 		uargs [0] = g.app.loadDir;
/* 007285 */ 	}
/* 007286 */ 	else if (uargs && uargs [0] == '.') {
/* 007287 */ 		var c = py_keys.py_get ('c');
/* 007288 */ 		if (c && c.openDirectory) {
/* 007289 */ 			uargs [0] = c.openDirectory;
/* 007289 */ 		}
/* 007289 */ 	}
/* 007290 */ 	if (uargs) {
/* 007291 */ 		try {
/* 007292 */ 			var path = os.path.join (...uargs);
/* 007292 */ 		}
/* 007292 */ 		catch (__except0__) {
/* 007292 */ 			if (isinstance (__except0__, py_TypeError)) {
/* 007294 */ 				g.trace (uargs, args, py_keys, g.callers ());
/* 007295 */ 				__except0__.__cause__ = null;
/* 007295 */ 				throw __except0__;
/* 007295 */ 			}
/* 007295 */ 			else {
/* 007295 */ 				throw __except0__;
/* 007295 */ 			}
/* 007295 */ 		}
/* 007295 */ 	}
/* 007296 */ 	else {
/* 007297 */ 		var path = '';
/* 007297 */ 	}
/* 007299 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007300 */ 	var path = path.py_replace ('\x00', '');
/* 007301 */ 	if (g.isWindows) {
/* 007302 */ 		var path = path.py_replace ('\\', '/');
/* 007302 */ 	}
/* 007303 */ 	return path;
/* 007303 */ };
/* 007305 */ export var os_path_normcase = function (path) {
/* 007307 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007308 */ 	var path = os.path.normcase (path);
/* 007309 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007310 */ 	if (g.isWindows) {
/* 007311 */ 		var path = path.py_replace ('\\', '/');
/* 007311 */ 	}
/* 007312 */ 	return path;
/* 007312 */ };
/* 007314 */ export var os_path_normpath = function (path) {
/* 007316 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007317 */ 	var path = os.path.normpath (path);
/* 007318 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007319 */ 	if (g.isWindows) {
/* 007320 */ 		var path = path.py_replace ('\\', '/');
/* 007320 */ 	}
/* 007321 */ 	return path;
/* 007321 */ };
/* 007323 */ export var os_path_normslashes = function (path) {
/* 007324 */ 	if (g.isWindows && path) {
/* 007325 */ 		var path = path.py_replace ('\\', '/');
/* 007325 */ 	}
/* 007326 */ 	return path;
/* 007326 */ };
/* 007328 */ export var os_path_realpath = function (path) {
/* 007333 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007334 */ 	var path = os.path.realpath (path);
/* 007335 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007336 */ 	if (g.isWindows) {
/* 007337 */ 		var path = path.py_replace ('\\', '/');
/* 007337 */ 	}
/* 007338 */ 	return path;
/* 007338 */ };
/* 007340 */ export var os_path_split = function (path) {
/* 007341 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007342 */ 	var __left0__ = os.path.py_split (path);
/* 007342 */ 	var head = __left0__ [0];
/* 007342 */ 	var tail = __left0__ [1];
/* 007343 */ 	var head = g.toUnicodeFileEncoding (head);
/* 007344 */ 	var tail = g.toUnicodeFileEncoding (tail);
/* 007345 */ 	return tuple ([head, tail]);
/* 007345 */ };
/* 007347 */ export var os_path_splitext = function (path) {
/* 007348 */ 	var path = g.toUnicodeFileEncoding (path);
/* 007349 */ 	var __left0__ = os.path.splitext (path);
/* 007349 */ 	var head = __left0__ [0];
/* 007349 */ 	var tail = __left0__ [1];
/* 007350 */ 	var head = g.toUnicodeFileEncoding (head);
/* 007351 */ 	var tail = g.toUnicodeFileEncoding (tail);
/* 007352 */ 	return tuple ([head, tail]);
/* 007352 */ };
/* 007354 */ export var os_startfile = function (fname) {
/* 007357 */ 	var stderr2log = function (g, ree, fname) {
/* 007369 */ 		while (true) {
/* 007370 */ 			var emsg = ree.read ().decode ('utf-8');
/* 007371 */ 			if (emsg) {
/* 007372 */ 				g.es_print_error ('xdg-open {} caused output to stderr:\n{}'.format (fname, emsg));
/* 007372 */ 			}
/* 007373 */ 			else {
/* 007373 */ 				break;
/* 007373 */ 			}
/* 007373 */ 		}
/* 007373 */ 	};
/* 007376 */ 	var itPoll = function (fname, ree, subPopen, g, ito) {
/* 007390 */ 		stderr2log (g, ree, fname);
/* 007391 */ 		var rc = subPopen.poll ();
/* 007392 */ 		if (!(rc === null)) {
/* 007393 */ 			ito.stop ();
/* 007394 */ 			ito.destroy_self ();
/* 007395 */ 			if (rc != 0) {
/* 007396 */ 				g.es_print ('xdg-open {} failed with exit code {}'.format (fname, rc));
/* 007396 */ 			}
/* 007397 */ 			stderr2log (g, ree, fname);
/* 007398 */ 			ree.close ();
/* 007398 */ 		}
/* 007398 */ 	};
/* 007400 */ 	if (fname.find ('"') > -(1)) {
/* 007401 */ 		var quoted_fname = "'{}'".format (fname);
/* 007401 */ 	}
/* 007402 */ 	else {
/* 007403 */ 		var quoted_fname = '"{}"'.format (fname);
/* 007403 */ 	}
/* 007404 */ 	if (sys.platform.startswith ('win')) {
/* 007406 */ 		os.startfile (quoted_fname);
/* 007406 */ 	}
/* 007408 */ 	else if (sys.platform == 'darwin') {
/* 007410 */ 		try {
/* 007413 */ 			subprocess.call (['open', fname]);
/* 007413 */ 		}
/* 007413 */ 		catch (__except0__) {
/* 007413 */ 			if (isinstance (__except0__, OSError)) {
/* 007415 */ 				// pass;
/* 007415 */ 			}
/* 007415 */ 			else if (isinstance (__except0__, ImportError)) {
/* 007417 */ 				os.system ('open {}'.format (quoted_fname));
/* 007417 */ 			}
/* 007417 */ 			else {
/* 007417 */ 				throw __except0__;
/* 007417 */ 			}
/* 007417 */ 		}
/* 007417 */ 	}
/* 007418 */ 	else {
/* 007419 */ 		try {
/* 007420 */ 			var ree = null;
/* 007421 */ 			var wre = tempfile.NamedTemporaryFile ();
/* 007422 */ 			var ree = io.open (wre.py_name, 'rb', __kwargtrans__ ({buffering: 0}));
/* 007422 */ 		}
/* 007422 */ 		catch (__except0__) {
/* 007422 */ 			if (isinstance (__except0__, IOError)) {
/* 007424 */ 				g.trace ('error opening temp file for {}'.format (fname));
/* 007425 */ 				if (ree) {
/* 007425 */ 					ree.close ();
/* 007425 */ 				}
/* 007426 */ 				return ;
/* 007426 */ 			}
/* 007426 */ 			else {
/* 007426 */ 				throw __except0__;
/* 007426 */ 			}
/* 007426 */ 		}
/* 007427 */ 		try {
/* 007428 */ 			var subPopen = subprocess.Popen (['xdg-open', fname], __kwargtrans__ ({stderr: wre, shell: false}));
/* 007428 */ 		}
/* 007428 */ 		catch (__except0__) {
/* 007428 */ 			if (isinstance (__except0__, Exception)) {
/* 007430 */ 				g.es_print ('error opening {}'.format (fname));
/* 007431 */ 				g.es_exception ();
/* 007431 */ 			}
/* 007431 */ 			else {
/* 007431 */ 				throw __except0__;
/* 007431 */ 			}
/* 007431 */ 		}
/* 007432 */ 		try {
/* 007433 */ 			var itoPoll = g.IdleTime ((function __lambda__ (ito) {
/* 007434 */ 				return itPoll (fname, ree, subPopen, g, ito);
/* 007434 */ 			}), __kwargtrans__ ({delay: 1000}));
/* 007437 */ 			itoPoll.start ();
/* 007437 */ 		}
/* 007437 */ 		catch (__except0__) {
/* 007437 */ 			if (isinstance (__except0__, Exception)) {
/* 007441 */ 				g.es_exception ('exception executing g.startfile for {}'.format (fname));
/* 007441 */ 			}
/* 007441 */ 			else {
/* 007441 */ 				throw __except0__;
/* 007441 */ 			}
/* 007441 */ 		}
/* 007441 */ 	}
/* 007441 */ };
/* 007443 */ export var toUnicodeFileEncoding = function (path) {
/* 007445 */ 	if (path && isinstance (path, str)) {
/* 007446 */ 		var path = path.py_replace ('\\', os.sep);
/* 007448 */ 		return g.toUnicode (path);
/* 007448 */ 	}
/* 007449 */ 	return '';
/* 007449 */ };
/* 007452 */ export var createTopologyList = function (c, root, useHeadlines) {
/* 007452 */ 	if (typeof root == 'undefined' || (root != null && root.hasOwnProperty ("__kwargtrans__"))) {;
/* 007452 */ 		var root = null;
/* 007452 */ 	};
/* 007452 */ 	if (typeof useHeadlines == 'undefined' || (useHeadlines != null && useHeadlines.hasOwnProperty ("__kwargtrans__"))) {;
/* 007452 */ 		var useHeadlines = false;
/* 007452 */ 	};
/* 007454 */ 	if (!(root)) {
/* 007454 */ 		var root = c.rootPosition ();
/* 007454 */ 	}
/* 007455 */ 	var v = root;
/* 007456 */ 	if (useHeadlines) {
/* 007457 */ 		var aList = [tuple ([v.numberOfChildren (), v.headString ()])];
/* 007457 */ 	}
/* 007458 */ 	else {
/* 007459 */ 		var aList = [v.numberOfChildren ()];
/* 007459 */ 	}
/* 007460 */ 	var child = v.firstChild ();
/* 007461 */ 	while (child) {
/* 007462 */ 		aList.append (g.createTopologyList (c, child, useHeadlines));
/* 007463 */ 		var child = child.py_next ();
/* 007463 */ 	}
/* 007464 */ 	return aList;
/* 007464 */ };
/* 007466 */ export var getDocString = function (s) {
/* 007468 */ 	var tags = tuple (['"""', "'''"]);
/* 007469 */ 	var __left0__ = tags;
/* 007469 */ 	var tag1 = __left0__ [0];
/* 007469 */ 	var tag2 = __left0__ [1];
/* 007470 */ 	var __left0__ = tuple ([s.find (tag1), s.find (tag2)]);
/* 007470 */ 	var i1 = __left0__ [0];
/* 007470 */ 	var i2 = __left0__ [1];
/* 007471 */ 	if (i1 == -(1) && i2 == -(1)) {
/* 007472 */ 		return '';
/* 007472 */ 	}
/* 007473 */ 	if (i1 > -(1) && i2 > -(1)) {
/* 007474 */ 		var i = min (i1, i2);
/* 007474 */ 	}
/* 007475 */ 	else {
/* 007476 */ 		var i = max (i1, i2);
/* 007476 */ 	}
/* 007477 */ 	var tag = s.__getslice__ (i, i + 3, 1);
/* 007479 */ 	var j = s.find (tag, i + 3);
/* 007480 */ 	if (j > -(1)) {
/* 007481 */ 		return s.__getslice__ (i + 3, j, 1);
/* 007481 */ 	}
/* 007482 */ 	return '';
/* 007482 */ };
/* 007484 */ export var getDocStringForFunction = function (func) {
/* 007487 */ 	var py_name = function (func) {
/* 007488 */ 		return (hasattr (func, '__name__') ? func.__name__ : '<no __name__>');
/* 007488 */ 	};
/* 007490 */ 	var get_defaults = function (func, i) {
/* 007491 */ 		var defaults = inspect.getfullargspec (func) [3];
/* 007492 */ 		return defaults [i];
/* 007492 */ 	};
/* 007498 */ 	var s = '';
/* 007499 */ 	if (py_name (func) == 'minibufferCallback') {
/* 007500 */ 		var func = get_defaults (func, 0);
/* 007501 */ 		if (hasattr (func, 'func.__doc__') && func.__doc__.strip ()) {
/* 007502 */ 			var s = func.__doc__;
/* 007502 */ 		}
/* 007502 */ 	}
/* 007503 */ 	if (!(s) && py_name (func) == 'commonCommandCallback') {
/* 007504 */ 		var script = get_defaults (func, 1);
/* 007505 */ 		var s = g.getDocString (script);
/* 007505 */ 	}
/* 007508 */ 	if (!(s) && hasattr (func, '__doc__')) {
/* 007509 */ 		var s = func.__doc__;
/* 007509 */ 	}
/* 007510 */ 	if (!(s) && hasattr (func, 'docstring')) {
/* 007511 */ 		var s = func.docstring;
/* 007511 */ 	}
/* 007512 */ 	return s;
/* 007512 */ };
/* 007514 */ export var python_tokenize = function (s, line_numbers) {
/* 007514 */ 	if (typeof line_numbers == 'undefined' || (line_numbers != null && line_numbers.hasOwnProperty ("__kwargtrans__"))) {;
/* 007514 */ 		var line_numbers = true;
/* 007514 */ 	};
/* 007520 */ 	var __left0__ = tuple ([[], 0, 0]);
/* 007520 */ 	var result = __left0__ [0];
/* 007520 */ 	var i = __left0__ [1];
/* 007520 */ 	var line_number = __left0__ [2];
/* 007521 */ 	while (i < len (s)) {
/* 007522 */ 		var __left0__ = i;
/* 007522 */ 		var progress = __left0__;
/* 007522 */ 		var j = __left0__;
/* 007523 */ 		var ch = s [i];
/* 007524 */ 		if (ch == '\n') {
/* 007525 */ 			var __left0__ = tuple (['nl', i + 1]);
/* 007525 */ 			var kind = __left0__ [0];
/* 007525 */ 			var i = __left0__ [1];
/* 007525 */ 		}
/* 007526 */ 		else if (__in__ (ch, ' \t')) {
/* 007527 */ 			var kind = 'ws';
/* 007528 */ 			while (i < len (s) && __in__ (s [i], ' \t')) {
/* 007528 */ 				i++;
/* 007528 */ 			}
/* 007528 */ 		}
/* 007530 */ 		else if (ch == '#') {
/* 007531 */ 			var __left0__ = tuple (['comment', g.skip_to_end_of_line (s, i)]);
/* 007531 */ 			var kind = __left0__ [0];
/* 007531 */ 			var i = __left0__ [1];
/* 007531 */ 		}
/* 007532 */ 		else if (__in__ (ch, '"\'')) {
/* 007533 */ 			var __left0__ = tuple (['string', g.skip_python_string (s, i, __kwargtrans__ ({verbose: false}))]);
/* 007533 */ 			var kind = __left0__ [0];
/* 007533 */ 			var i = __left0__ [1];
/* 007533 */ 		}
/* 007534 */ 		else if (ch == '_' || ch.isalpha ()) {
/* 007535 */ 			var __left0__ = tuple (['id', g.skip_id (s, i)]);
/* 007535 */ 			var kind = __left0__ [0];
/* 007535 */ 			var i = __left0__ [1];
/* 007535 */ 		}
/* 007536 */ 		else {
/* 007537 */ 			var __left0__ = tuple (['other', i + 1]);
/* 007537 */ 			var kind = __left0__ [0];
/* 007537 */ 			var i = __left0__ [1];
/* 007537 */ 		}
/* 007539 */ 		var val = s.__getslice__ (j, i, 1);
/* 007541 */ 		if (line_numbers) {
/* 007542 */ 			line_number += val.count ('\n');
/* 007543 */ 			result.append (tuple ([kind, val, line_number]));
/* 007543 */ 		}
/* 007544 */ 		else {
/* 007545 */ 			result.append (tuple ([kind, val]));
/* 007545 */ 		}
/* 007545 */ 	}
/* 007546 */ 	return result;
/* 007546 */ };
/* 007549 */ export var exec_file = function (path, d, script) {
/* 007549 */ 	if (typeof script == 'undefined' || (script != null && script.hasOwnProperty ("__kwargtrans__"))) {;
/* 007549 */ 		var script = null;
/* 007549 */ 	};
/* 007551 */ 	if (script === null) {
/* 007552 */ 		var f = open (path);
/* 007552 */ 		try {
/* 007552 */ 			f.__enter__ ();
/* 007553 */ 			var script = f.read ();
/* 007553 */ 			f.__exit__ ();
/* 007553 */ 		}
/* 007553 */ 		catch (__except0__) {
/* 007553 */ 			if (! (f.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
/* 007553 */ 				throw __except0__;
/* 007553 */ 			}
/* 007553 */ 		}
/* 007553 */ 	}
/* 007554 */ 	exec (compile (script, path, 'exec'), d);
/* 007554 */ };
/* 007556 */ export var execute_shell_commands = function (commands, trace) {
/* 007556 */ 	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
/* 007556 */ 		var trace = false;
/* 007556 */ 	};
/* 007561 */ 	if (isinstance (commands, str)) {
/* 007562 */ 		var commands = [commands];
/* 007562 */ 	}
/* 007563 */ 	for (var command of commands) {
/* 007564 */ 		var wait = !(command.startswith ('&'));
/* 007565 */ 		if (trace) {
/* 007565 */ 			g.trace (command);
/* 007565 */ 		}
/* 007566 */ 		if (command.startswith ('&')) {
/* 007567 */ 			var command = command.__getslice__ (1, null, 1).strip ();
/* 007567 */ 		}
/* 007568 */ 		var proc = subprocess.Popen (command, __kwargtrans__ ({shell: true}));
/* 007569 */ 		if (wait) {
/* 007570 */ 			proc.communicate ();
/* 007570 */ 		}
/* 007571 */ 		else {
/* 007572 */ 			if (trace) {
/* 007572 */ 				print ('Start:', proc);
/* 007572 */ 			}
/* 007575 */ 			var proc_poller = function (timer, proc) {
/* 007575 */ 				if (typeof proc == 'undefined' || (proc != null && proc.hasOwnProperty ("__kwargtrans__"))) {;
/* 007575 */ 					var proc = proc;
/* 007575 */ 				};
/* 007576 */ 				var val = proc.poll ();
/* 007577 */ 				if (val !== null) {
/* 007579 */ 					if (trace) {
/* 007579 */ 						print ('  End:', proc, val);
/* 007579 */ 					}
/* 007580 */ 					timer.stop ();
/* 007580 */ 				}
/* 007580 */ 			};
/* 007582 */ 			g.IdleTime (proc_poller, __kwargtrans__ ({delay: 0})).start ();
/* 007582 */ 		}
/* 007582 */ 	}
/* 007582 */ };
/* 007584 */ export var execute_shell_commands_with_options = function (base_dir, c, command_setting, commands, path_setting, trace, warning) {
/* 007584 */ 	if (typeof base_dir == 'undefined' || (base_dir != null && base_dir.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var base_dir = null;
/* 007584 */ 	};
/* 007584 */ 	if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var c = null;
/* 007584 */ 	};
/* 007584 */ 	if (typeof command_setting == 'undefined' || (command_setting != null && command_setting.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var command_setting = null;
/* 007584 */ 	};
/* 007584 */ 	if (typeof commands == 'undefined' || (commands != null && commands.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var commands = null;
/* 007584 */ 	};
/* 007584 */ 	if (typeof path_setting == 'undefined' || (path_setting != null && path_setting.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var path_setting = null;
/* 007584 */ 	};
/* 007584 */ 	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var trace = false;
/* 007584 */ 	};
/* 007584 */ 	if (typeof warning == 'undefined' || (warning != null && warning.hasOwnProperty ("__kwargtrans__"))) {;
/* 007584 */ 		var warning = null;
/* 007584 */ 	};
/* 007603 */ 	var base_dir = g.computeBaseDir (c, base_dir, path_setting, trace);
/* 007604 */ 	if (!(base_dir)) {
/* 007605 */ 		return ;
/* 007605 */ 	}
/* 007606 */ 	var commands = g.computeCommands (c, commands, command_setting, trace);
/* 007607 */ 	if (!(commands)) {
/* 007608 */ 		return ;
/* 007608 */ 	}
/* 007609 */ 	if (warning) {
/* 007610 */ 		g.es_print (warning);
/* 007610 */ 	}
/* 007611 */ 	os.chdir (base_dir);
/* 007612 */ 	g.execute_shell_commands (commands);
/* 007612 */ };
/* 007614 */ export var computeBaseDir = function (c, base_dir, path_setting, trace) {
/* 007614 */ 	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
/* 007614 */ 		var trace = false;
/* 007614 */ 	};
/* 007620 */ 	if (path_setting) {
/* 007621 */ 		if (!(c)) {
/* 007622 */ 			return g.es_print ('@string path_setting requires valid c arg');
/* 007622 */ 		}
/* 007624 */ 		var base_dir2 = c.config.getString (path_setting);
/* 007625 */ 		if (base_dir2) {
/* 007626 */ 			var base_dir2 = base_dir2.py_replace ('\\', '/');
/* 007627 */ 			if (g.os_path_exists (base_dir2)) {
/* 007628 */ 				return base_dir2;
/* 007628 */ 			}
/* 007629 */ 			return g.es_print ('@string {} not found: {}'.format (path_setting, base_dir2));
/* 007629 */ 		}
/* 007629 */ 	}
/* 007631 */ 	if (base_dir) {
/* 007632 */ 		var base_dir = base_dir.py_replace ('\\', '/');
/* 007633 */ 		if (g.os_path_exists (base_dir)) {
/* 007634 */ 			return base_dir;
/* 007634 */ 		}
/* 007635 */ 		return g.es_print ('base_dir not found: {}'.format (base_dir));
/* 007635 */ 	}
/* 007636 */ 	return g.es_print ('Please use @string {}'.format (path_setting));
/* 007636 */ };
/* 007638 */ export var computeCommands = function (c, commands, command_setting, trace) {
/* 007638 */ 	if (typeof trace == 'undefined' || (trace != null && trace.hasOwnProperty ("__kwargtrans__"))) {;
/* 007638 */ 		var trace = false;
/* 007638 */ 	};
/* 007643 */ 	if (!(commands) && !(command_setting)) {
/* 007644 */ 		g.es_print ('Please use commands, command_setting or both');
/* 007645 */ 		return [];
/* 007645 */ 	}
/* 007647 */ 	if (command_setting) {
/* 007648 */ 		if (c) {
/* 007649 */ 			var aList = c.config.getData (command_setting);
/* 007652 */ 			return aList || commands;
/* 007652 */ 		}
/* 007653 */ 		g.es_print ('@data command_setting requires valid c arg');
/* 007654 */ 		return [];
/* 007654 */ 	}
/* 007655 */ 	return commands;
/* 007655 */ };
/* 007657 */ export var executeFile = function (filename, options) {
/* 007657 */ 	if (typeof options == 'undefined' || (options != null && options.hasOwnProperty ("__kwargtrans__"))) {;
/* 007657 */ 		var options = '';
/* 007657 */ 	};
/* 007658 */ 	if (!(os.access (filename, os.R_OK))) {
/* 007658 */ 		return ;
/* 007658 */ 	}
/* 007659 */ 	var __left0__ = g.os_path_split (filename);
/* 007659 */ 	var fdir = __left0__ [0];
/* 007659 */ 	var fname = __left0__ [1];
/* 007662 */ 	var subprocess_wrapper = function (cmdlst) {
/* 007664 */ 		var p = subprocess.Popen (cmdlst, __kwargtrans__ ({cwd: fdir, universal_newlines: true, stdout: subprocess.PIPE, stderr: subprocess.PIPE}));
/* 007667 */ 		var __left0__ = p.communicate ();
/* 007667 */ 		var stdo = __left0__ [0];
/* 007667 */ 		var stde = __left0__ [1];
/* 007668 */ 		return tuple ([p.wait (), stdo, stde]);
/* 007668 */ 	};
/* 007670 */ 	var __left0__ = subprocess_wrapper ('{} {} {}'.format (sys.executable, fname, options));
/* 007670 */ 	var rc = __left0__ [0];
/* 007670 */ 	var so = __left0__ [1];
/* 007670 */ 	var se = __left0__ [2];
/* 007671 */ 	if (rc) {
/* 007671 */ 		g.pr ('return code', rc);
/* 007671 */ 	}
/* 007672 */ 	g.pr (so, se);
/* 007672 */ };
/* 007674 */ export var findNodeInChildren = function (c, p, headline, exact) {
/* 007674 */ 	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
/* 007674 */ 		var exact = true;
/* 007674 */ 	};
/* 007676 */ 	var p1 = p.copy ();
/* 007677 */ 	var h = headline.strip ();
/* 007678 */ 	for (var p of p1.children ()) {
/* 007679 */ 		if (p.h.strip () == h) {
/* 007680 */ 			return p.copy ();
/* 007680 */ 		}
/* 007680 */ 	}
/* 007681 */ 	if (!(exact)) {
/* 007682 */ 		for (var p of p1.children ()) {
/* 007683 */ 			if (p.h.strip ().startswith (h)) {
/* 007684 */ 				return p.copy ();
/* 007684 */ 			}
/* 007684 */ 		}
/* 007684 */ 	}
/* 007685 */ 	return null;
/* 007685 */ };
/* 007687 */ export var findNodeInTree = function (c, p, headline, exact) {
/* 007687 */ 	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
/* 007687 */ 		var exact = true;
/* 007687 */ 	};
/* 007689 */ 	var h = headline.strip ();
/* 007690 */ 	var p1 = p.copy ();
/* 007691 */ 	for (var p of p1.subtree ()) {
/* 007692 */ 		if (p.h.strip () == h) {
/* 007693 */ 			return p.copy ();
/* 007693 */ 		}
/* 007693 */ 	}
/* 007694 */ 	if (!(exact)) {
/* 007695 */ 		for (var p of p1.subtree ()) {
/* 007696 */ 			if (p.h.strip ().startswith (h)) {
/* 007697 */ 				return p.copy ();
/* 007697 */ 			}
/* 007697 */ 		}
/* 007697 */ 	}
/* 007698 */ 	return null;
/* 007698 */ };
/* 007700 */ export var findNodeAnywhere = function (c, headline, exact) {
/* 007700 */ 	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
/* 007700 */ 		var exact = true;
/* 007700 */ 	};
/* 007701 */ 	var h = headline.strip ();
/* 007702 */ 	for (var p of c.all_unique_positions (__kwargtrans__ ({copy: false}))) {
/* 007703 */ 		if (p.h.strip () == h) {
/* 007704 */ 			return p.copy ();
/* 007704 */ 		}
/* 007704 */ 	}
/* 007705 */ 	if (!(exact)) {
/* 007706 */ 		for (var p of c.all_unique_positions (__kwargtrans__ ({copy: false}))) {
/* 007707 */ 			if (p.h.strip ().startswith (h)) {
/* 007708 */ 				return p.copy ();
/* 007708 */ 			}
/* 007708 */ 		}
/* 007708 */ 	}
/* 007709 */ 	return null;
/* 007709 */ };
/* 007711 */ export var findTopLevelNode = function (c, headline, exact) {
/* 007711 */ 	if (typeof exact == 'undefined' || (exact != null && exact.hasOwnProperty ("__kwargtrans__"))) {;
/* 007711 */ 		var exact = true;
/* 007711 */ 	};
/* 007712 */ 	var h = headline.strip ();
/* 007713 */ 	for (var p of c.rootPosition ().self_and_siblings (__kwargtrans__ ({copy: false}))) {
/* 007714 */ 		if (p.h.strip () == h) {
/* 007715 */ 			return p.copy ();
/* 007715 */ 		}
/* 007715 */ 	}
/* 007716 */ 	if (!(exact)) {
/* 007717 */ 		for (var p of c.rootPosition ().self_and_siblings (__kwargtrans__ ({copy: false}))) {
/* 007718 */ 			if (p.h.strip ().startswith (h)) {
/* 007719 */ 				return p.copy ();
/* 007719 */ 			}
/* 007719 */ 		}
/* 007719 */ 	}
/* 007720 */ 	return null;
/* 007720 */ };
/* 007722 */ export var getScript = function (c, p, useSelectedText, forcePythonSentinels, useSentinels) {
/* 007722 */ 	if (typeof useSelectedText == 'undefined' || (useSelectedText != null && useSelectedText.hasOwnProperty ("__kwargtrans__"))) {;
/* 007722 */ 		var useSelectedText = true;
/* 007722 */ 	};
/* 007722 */ 	if (typeof forcePythonSentinels == 'undefined' || (forcePythonSentinels != null && forcePythonSentinels.hasOwnProperty ("__kwargtrans__"))) {;
/* 007722 */ 		var forcePythonSentinels = true;
/* 007722 */ 	};
/* 007722 */ 	if (typeof useSentinels == 'undefined' || (useSentinels != null && useSentinels.hasOwnProperty ("__kwargtrans__"))) {;
/* 007722 */ 		var useSentinels = true;
/* 007722 */ 	};
/* 007732 */ 	var w = c.frame.body.wrapper;
/* 007733 */ 	if (!(p)) {
/* 007733 */ 		var p = c.p;
/* 007733 */ 	}
/* 007734 */ 	try {
/* 007735 */ 		if (g.app.inBridge) {
/* 007736 */ 			var s = p.b;
/* 007736 */ 		}
/* 007737 */ 		else if (w && p == c.p && useSelectedText && w.hasSelection ()) {
/* 007738 */ 			var s = w.getSelectedText ();
/* 007738 */ 		}
/* 007739 */ 		else {
/* 007740 */ 			var s = p.b;
/* 007740 */ 		}
/* 007742 */ 		var s = g.removeExtraLws (s, c.tab_width);
/* 007743 */ 		var s = g.extractExecutableString (c, p, s);
/* 007744 */ 		var script = g.composeScript (c, p, s, __kwargtrans__ ({forcePythonSentinels: forcePythonSentinels, useSentinels: useSentinels}));
/* 007744 */ 	}
/* 007744 */ 	catch (__except0__) {
/* 007744 */ 		if (isinstance (__except0__, Exception)) {
/* 007748 */ 			g.es_print ('unexpected exception in g.getScript');
/* 007749 */ 			g.es_exception ();
/* 007750 */ 			var script = '';
/* 007750 */ 		}
/* 007750 */ 		else {
/* 007750 */ 			throw __except0__;
/* 007750 */ 		}
/* 007750 */ 	}
/* 007751 */ 	return script;
/* 007751 */ };
/* 007753 */ export var composeScript = function (c, p, s, forcePythonSentinels, useSentinels) {
/* 007753 */ 	if (typeof forcePythonSentinels == 'undefined' || (forcePythonSentinels != null && forcePythonSentinels.hasOwnProperty ("__kwargtrans__"))) {;
/* 007753 */ 		var forcePythonSentinels = true;
/* 007753 */ 	};
/* 007753 */ 	if (typeof useSentinels == 'undefined' || (useSentinels != null && useSentinels.hasOwnProperty ("__kwargtrans__"))) {;
/* 007753 */ 		var useSentinels = true;
/* 007753 */ 	};
/* 007760 */ 	if (!(s.strip ())) {
/* 007761 */ 		return '';
/* 007761 */ 	}
/* 007762 */ 	var at = c.atFileCommands;
/* 007763 */ 	var old_in_script = g.app.inScript;
/* 007764 */ 	try {
/* 007766 */ 		var __left0__ = true;
/* 007766 */ 		g.app.inScript = __left0__;
/* 007766 */ 		g.inScript = __left0__;
/* 007767 */ 		g.app.scriptDict ['script1'] = s;
/* 007769 */ 		var script = at.stringToString (p.copy (), s, __kwargtrans__ ({forcePythonSentinels: forcePythonSentinels, sentinels: useSentinels}));
/* 007772 */ 		var script = script.py_replace ('\r\n', '\n');
/* 007774 */ 		g.app.scriptDict ['script2'] = script;
/* 007774 */ 	}
/* 007774 */ 	finally {
/* 007776 */ 		var __left0__ = old_in_script;
/* 007776 */ 		g.app.inScript = __left0__;
/* 007776 */ 		g.inScript = __left0__;
/* 007776 */ 	}
/* 007777 */ 	return script;
/* 007777 */ };
/* 007779 */ export var extractExecutableString = function (c, p, s) {
/* 007787 */ 	if (g.unitTesting) {
/* 007788 */ 		return s;
/* 007788 */ 	}
/* 007791 */ 	var language = g.scanForAtLanguage (c, p);
/* 007792 */ 	if (!(language)) {
/* 007793 */ 		return s;
/* 007793 */ 	}
/* 007796 */ 	var pattern = '^@language\\s+(\\w+)';
/* 007797 */ 	var matches = list (re.finditer (pattern, s, re.MULTILINE));
/* 007798 */ 	if (len (matches) < 2) {
/* 007799 */ 		return s;
/* 007799 */ 	}
/* 007802 */ 	var __left0__ = tuple ([false, []]);
/* 007802 */ 	var extracting = __left0__ [0];
/* 007802 */ 	var result = __left0__ [1];
/* 007803 */ 	for (var [i, line] of enumerate (g.splitLines (s))) {
/* 007804 */ 		var m = re.match (pattern, line);
/* 007805 */ 		if (m) {
/* 007807 */ 			var extracting = m.group (1) == language;
/* 007807 */ 		}
/* 007808 */ 		else if (extracting) {
/* 007809 */ 			result.append (line);
/* 007809 */ 		}
/* 007809 */ 	}
/* 007810 */ 	return ''.join (result);
/* 007810 */ };
/* 007812 */ export var handleScriptException = function (c, p, script, script1) {
/* 007813 */ 	g.warning ('exception executing script');
/* 007814 */ 	var full = c.config.getBool ('show-full-tracebacks-in-scripts');
/* 007815 */ 	var __left0__ = g.es_exception (__kwargtrans__ ({full: full}));
/* 007815 */ 	var fileName = __left0__ [0];
/* 007815 */ 	var n = __left0__ [1];
/* 007817 */ 	if (p.v.context == c) {
/* 007818 */ 		try {
/* 007819 */ 			c.goToScriptLineNumber (n, p);
/* 007822 */ 			if (g.os_path_exists (fileName)) {
/* 007823 */ 				var f = open (fileName);
/* 007823 */ 				try {
/* 007823 */ 					f.__enter__ ();
/* 007824 */ 					var lines = f.readlines ();
/* 007824 */ 					f.__exit__ ();
/* 007824 */ 				}
/* 007824 */ 				catch (__except0__) {
/* 007824 */ 					if (! (f.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
/* 007824 */ 						throw __except0__;
/* 007824 */ 					}
/* 007824 */ 				}
/* 007824 */ 			}
/* 007825 */ 			else {
/* 007826 */ 				var lines = g.splitLines (script);
/* 007826 */ 			}
/* 007827 */ 			var s = '-' * 20;
/* 007828 */ 			g.es_print ('', s);
/* 007830 */ 			var i = max (0, n - 2);
/* 007831 */ 			var j = min (n + 2, len (lines));
/* 007832 */ 			while (i < j) {
/* 007833 */ 				var ch = (i == n - 1 ? '*' : ' ');
/* 007834 */ 				var s = '{} line {}: {}'.format (ch, i + 1, lines [i]);
/* 007835 */ 				g.es ('', s, __kwargtrans__ ({newline: false}));
/* 007835 */ 				i++;
/* 007835 */ 			}
/* 007835 */ 		}
/* 007835 */ 		catch (__except0__) {
/* 007835 */ 			if (isinstance (__except0__, Exception)) {
/* 007839 */ 				g.es_print ('Unexpected exception in g.handleScriptException');
/* 007840 */ 				g.es_exception ();
/* 007840 */ 			}
/* 007840 */ 			else {
/* 007840 */ 				throw __except0__;
/* 007840 */ 			}
/* 007840 */ 		}
/* 007840 */ 	}
/* 007840 */ };
/* 007842 */ export var insertCodingLine = function (encoding, script) {
/* 007848 */ 	if (script) {
/* 007849 */ 		var tag = '@first # -*- coding:';
/* 007850 */ 		var lines = g.splitLines (script);
/* 007851 */ 		var __break0__ = false;
/* 007851 */ 		for (var s of lines) {
/* 007852 */ 			if (s.startswith (tag)) {
/* 007852 */ 				__break0__ = true;
/* 007852 */ 				break;
/* 007852 */ 			}
/* 007852 */ 		}
/* 007854 */ 		if (!__break0__) {
/* 007855 */ 			lines.insert (0, '{} {} -*-\n'.format (tag, encoding));
/* 007856 */ 			var script = ''.join (lines);
/* 007856 */ 		}
/* 007856 */ 	}
/* 007857 */ 	return script;
/* 007857 */ };
/* 007860 */ export var findTestScript = function (c, h, where, warn) {
/* 007860 */ 	if (typeof where == 'undefined' || (where != null && where.hasOwnProperty ("__kwargtrans__"))) {;
/* 007860 */ 		var where = null;
/* 007860 */ 	};
/* 007860 */ 	if (typeof warn == 'undefined' || (warn != null && warn.hasOwnProperty ("__kwargtrans__"))) {;
/* 007860 */ 		var warn = true;
/* 007860 */ 	};
/* 007861 */ 	if (where) {
/* 007862 */ 		var p = g.findNodeAnywhere (c, where);
/* 007863 */ 		if (p) {
/* 007864 */ 			var p = g.findNodeInTree (c, p, h);
/* 007864 */ 		}
/* 007864 */ 	}
/* 007865 */ 	else {
/* 007866 */ 		var p = g.findNodeAnywhere (c, h);
/* 007866 */ 	}
/* 007867 */ 	if (p) {
/* 007868 */ 		return g.getScript (c, p);
/* 007868 */ 	}
/* 007869 */ 	if (warn) {
/* 007869 */ 		g.trace ('Not found', h);
/* 007869 */ 	}
/* 007870 */ 	return null;
/* 007870 */ };
/* 007872 */ export var getTestVars = function () {
/* 007873 */ 	var d = g.app.unitTestDict;
/* 007874 */ 	var c = d.py_get ('c');
/* 007875 */ 	var p = d.py_get ('p');
/* 007878 */ 	d ['getTestVars'] = true;
/* 007879 */ 	return tuple ([c, p && p.copy ()]);
/* 007879 */ };
/* 007881 */ export var run_unit_test_in_separate_process = function (command) {
/* 007889 */ 	var leo_editor_dir = os.path.join (g.app.loadDir, '..', '..');
/* 007890 */ 	os.chdir (leo_editor_dir);
/* 007895 */ 	var p = subprocess.Popen (shlex.py_split (command), __kwargtrans__ ({stdout: subprocess.PIPE, stderr: subprocess.PIPE, shell: sys.platform.startswith ('win')}));
/* 007897 */ 	var __left0__ = p.communicate ();
/* 007897 */ 	var out = __left0__ [0];
/* 007897 */ 	var err = __left0__ [1];
/* 007898 */ 	var err = g.toUnicode (err);
/* 007899 */ 	var out = g.toUnicode (out);
/* 007900 */ 	print ('');
/* 007901 */ 	print (command);
/* 007902 */ 	if (out.strip ()) {
/* 007904 */ 		print (out.rstrip ());
/* 007904 */ 	}
/* 007905 */ 	print (err.rstrip ());
/* 007907 */ 	var err_lines = g.splitLines (err.rstrip ());
/* 007907 */ };
/* 007910 */ export var toEncodedStringWithErrorCode = function (s, encoding, reportErrors) {
/* 007910 */ 	if (typeof reportErrors == 'undefined' || (reportErrors != null && reportErrors.hasOwnProperty ("__kwargtrans__"))) {;
/* 007910 */ 		var reportErrors = false;
/* 007910 */ 	};
/* 007912 */ 	var ok = true;
/* 007913 */ 	if (g.isUnicode (s)) {
/* 007914 */ 		try {
/* 007915 */ 			var s = s.encode (encoding, 'strict');
/* 007915 */ 		}
/* 007915 */ 		catch (__except0__) {
/* 007915 */ 			if (isinstance (__except0__, UnicodeError)) {
/* 007917 */ 				var s = s.encode (encoding, 'replace');
/* 007918 */ 				if (reportErrors) {
/* 007919 */ 					g.error ('Error converting {} from unicode to {} encoding'.format (s, encoding));
/* 007919 */ 				}
/* 007920 */ 				var ok = false;
/* 007920 */ 			}
/* 007920 */ 			else {
/* 007920 */ 				throw __except0__;
/* 007920 */ 			}
/* 007920 */ 		}
/* 007920 */ 	}
/* 007921 */ 	return tuple ([s, ok]);
/* 007921 */ };
/* 007923 */ export var toUnicodeWithErrorCode = function (s, encoding, reportErrors) {
/* 007923 */ 	if (typeof reportErrors == 'undefined' || (reportErrors != null && reportErrors.hasOwnProperty ("__kwargtrans__"))) {;
/* 007923 */ 		var reportErrors = false;
/* 007923 */ 	};
/* 007925 */ 	if (s === null) {
/* 007926 */ 		return tuple (['', true]);
/* 007926 */ 	}
/* 007927 */ 	if (isinstance (s, str)) {
/* 007928 */ 		return tuple ([s, true]);
/* 007928 */ 	}
/* 007929 */ 	try {
/* 007930 */ 		var s = str (s, encoding, 'strict');
/* 007931 */ 		return tuple ([s, true]);
/* 007931 */ 	}
/* 007931 */ 	catch (__except0__) {
/* 007931 */ 		if (isinstance (__except0__, UnicodeError)) {
/* 007933 */ 			var s = str (s, encoding, 'replace');
/* 007934 */ 			if (reportErrors) {
/* 007935 */ 				g.error ('Error converting {} from {} encoding to unicode'.format (s, encoding));
/* 007935 */ 			}
/* 007936 */ 			return tuple ([s, false]);
/* 007936 */ 		}
/* 007936 */ 		else {
/* 007936 */ 			throw __except0__;
/* 007936 */ 		}
/* 007936 */ 	}
/* 007936 */ };
/* 007938 */ export var unl_regex = re.compile ('\\bunl:.*$');
/* 007940 */ export var kinds = '(file|ftp|gopher|http|https|mailto|news|nntp|prospero|telnet|wais)';
/* 007941 */ export var url_regex = re.compile ('{}://[^\\s\'"]+[\\w=/]'.format (kinds));
/* 007943 */ export var unquoteUrl = function (url) {
/* 007945 */ 	return urllib.parse.unquote (url);
/* 007945 */ };
/* 007947 */ export var computeFileUrl = function (fn, c, p) {
/* 007947 */ 	if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
/* 007947 */ 		var c = null;
/* 007947 */ 	};
/* 007947 */ 	if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
/* 007947 */ 		var p = null;
/* 007947 */ 	};
/* 007952 */ 	var url = urllib.parse.unquote (fn);
/* 007954 */ 	var i = url.find ('~');
/* 007955 */ 	if (i > -(1)) {
/* 007957 */ 		var path = url.__getslice__ (i, null, 1);
/* 007958 */ 		var path = g.os_path_expanduser (path);
/* 007961 */ 		var path = g.os_path_finalize (path);
/* 007962 */ 		var url = url.__getslice__ (0, i, 1) + path;
/* 007962 */ 	}
/* 007963 */ 	else {
/* 007964 */ 		var tag = 'file://';
/* 007965 */ 		var tag2 = 'file:///';
/* 007966 */ 		if (sys.platform.startswith ('win') && url.startswith (tag2)) {
/* 007967 */ 			var path = url.__getslice__ (len (tag2), null, 1).lstrip ();
/* 007967 */ 		}
/* 007968 */ 		else if (url.startswith (tag)) {
/* 007969 */ 			var path = url.__getslice__ (len (tag), null, 1).lstrip ();
/* 007969 */ 		}
/* 007970 */ 		else {
/* 007971 */ 			var path = url;
/* 007971 */ 		}
/* 007975 */ 		if (c && c.openDirectory) {
/* 007976 */ 			var base = c.getNodePath (p);
/* 007977 */ 			var path = g.os_path_finalize_join (c.openDirectory, base, path);
/* 007977 */ 		}
/* 007978 */ 		else {
/* 007979 */ 			var path = g.os_path_finalize (path);
/* 007979 */ 		}
/* 007980 */ 		var url = '{}{}'.format (tag, path);
/* 007980 */ 	}
/* 007981 */ 	return url;
/* 007981 */ };
/* 007983 */ export var getUrlFromNode = function (p) {
/* 007989 */ 	if (!(p)) {
/* 007989 */ 		return null;
/* 007989 */ 	}
/* 007990 */ 	var c = p.v.context;
/* 007992 */ 	var table = [p.h, (p.b ? g.splitLines (p.b) [0] : '')];
/* 007993 */ 	var table = (function () {
/* 007993 */ 		var __accu0__ = [];
/* 007993 */ 		for (var s of table) {
/* 007993 */ 			__accu0__.append ((g.match_word (s, 0, '@url') ? s.__getslice__ (4, null, 1) : s));
/* 007993 */ 		}
/* 007993 */ 		return __accu0__;
/* 007993 */ 	}) ();
/* 007994 */ 	var table = (function () {
/* 007994 */ 		var __accu0__ = [];
/* 007994 */ 		for (var s of table) {
/* 007994 */ 			if (s.strip ()) {
/* 007994 */ 				__accu0__.append (s.strip ());
/* 007994 */ 			}
/* 007994 */ 		}
/* 007994 */ 		return __accu0__;
/* 007994 */ 	}) ();
/* 007996 */ 	for (var s of table) {
/* 007997 */ 		if (g.isValidUrl (s)) {
/* 007998 */ 			return s;
/* 007998 */ 		}
/* 007998 */ 	}
/* 008000 */ 	for (var s of table) {
/* 008001 */ 		var tag = 'file://';
/* 008002 */ 		var url = computeFileUrl (s, __kwargtrans__ ({c: c, p: p}));
/* 008003 */ 		if (url.startswith (tag)) {
/* 008004 */ 			var fn = url.__getslice__ (len (tag), null, 1).lstrip ();
/* 008005 */ 			var fn = fn.py_split ('#', 1) [0];
/* 008006 */ 			if (g.os_path_isfile (fn)) {
/* 008009 */ 				return 'file://' + s;
/* 008009 */ 			}
/* 008009 */ 		}
/* 008009 */ 	}
/* 008011 */ 	for (var s of table) {
/* 008012 */ 		if (s.startswith ('#')) {
/* 008013 */ 			return s;
/* 008013 */ 		}
/* 008013 */ 	}
/* 008014 */ 	return null;
/* 008014 */ };
/* 008016 */ export var handleUrl = function (url, c, p) {
/* 008016 */ 	if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
/* 008016 */ 		var c = null;
/* 008016 */ 	};
/* 008016 */ 	if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
/* 008016 */ 		var p = null;
/* 008016 */ 	};
/* 008018 */ 	if (c && !(p)) {
/* 008019 */ 		var p = c.p;
/* 008019 */ 	}
/* 008020 */ 	var urll = url.lower ();
/* 008021 */ 	if (urll.startswith ('@url')) {
/* 008022 */ 		var url = url.__getslice__ (4, null, 1).lstrip ();
/* 008022 */ 	}
/* 008026 */ 	if (urll.startswith ('unl:' + '//') || urll.startswith ('file://') && url.find ('-->') > -(1) || urll.startswith ('#')) {
/* 008028 */ 		return g.handleUnl (url, c);
/* 008028 */ 	}
/* 008029 */ 	try {
/* 008030 */ 		return g.handleUrlHelper (url, c, p);
/* 008030 */ 	}
/* 008030 */ 	catch (__except0__) {
/* 008030 */ 		if (isinstance (__except0__, Exception)) {
/* 008032 */ 			g.es_print ('exception opening', repr (url));
/* 008033 */ 			g.es_exception ();
/* 008034 */ 			return null;
/* 008034 */ 		}
/* 008034 */ 		else {
/* 008034 */ 			throw __except0__;
/* 008034 */ 		}
/* 008034 */ 	}
/* 008034 */ };
/* 008036 */ export var handleUrlHelper = function (url, c, p) {
/* 008042 */ 	var tag = 'file://';
/* 008043 */ 	var original_url = url;
/* 008044 */ 	if (url.startswith (tag) && !(url.startswith (tag + '#'))) {
/* 008046 */ 		var url = g.computeFileUrl (url, __kwargtrans__ ({c: c, p: p}));
/* 008046 */ 	}
/* 008047 */ 	var parsed = urlparse.urlparse (url);
/* 008048 */ 	if (parsed.netloc) {
/* 008049 */ 		var leo_path = os.path.join (parsed.netloc, parsed.path);
/* 008049 */ 	}
/* 008050 */ 	else {
/* 008052 */ 		var leo_path = parsed.path;
/* 008052 */ 	}
/* 008053 */ 	if (leo_path.endswith ('\\')) {
/* 008053 */ 		var leo_path = leo_path.__getslice__ (0, -(1), 1);
/* 008053 */ 	}
/* 008054 */ 	if (leo_path.endswith ('/')) {
/* 008054 */ 		var leo_path = leo_path.__getslice__ (0, -(1), 1);
/* 008054 */ 	}
/* 008055 */ 	if (parsed.scheme == 'file' && leo_path.endswith ('.leo')) {
/* 008056 */ 		g.handleUnl (original_url, c);
/* 008056 */ 	}
/* 008057 */ 	else if (__in__ (parsed.scheme, tuple (['', 'file']))) {
/* 008058 */ 		var unquote_path = g.unquoteUrl (leo_path);
/* 008059 */ 		if (g.unitTesting) {
/* 008060 */ 			g.app.unitTestDict ['os_startfile'] = unquote_path;
/* 008060 */ 		}
/* 008061 */ 		else if (g.os_path_exists (leo_path)) {
/* 008062 */ 			g.os_startfile (unquote_path);
/* 008062 */ 		}
/* 008063 */ 		else {
/* 008064 */ 			g.es ("File '{}' does not exist".format (leo_path));
/* 008064 */ 		}
/* 008064 */ 	}
/* 008065 */ 	else {
/* 008079 */ 	}
/* 008079 */ };
/* 008081 */ export var traceUrl = function (c, path, parsed, url) {
/* 008083 */ 	print ();
/* 008084 */ 	g.trace ('url          ', url);
/* 008085 */ 	g.trace ('c.frame.title', c.frame.title);
/* 008086 */ 	g.trace ('path         ', path);
/* 008087 */ 	g.trace ('parsed.fragment', parsed.fragment);
/* 008088 */ 	g.trace ('parsed.netloc', parsed.netloc);
/* 008089 */ 	g.trace ('parsed.path  ', parsed.path);
/* 008090 */ 	g.trace ('parsed.scheme', repr (parsed.scheme));
/* 008090 */ };
/* 008092 */ export var handleUnl = function (unl, c) {
/* 008094 */ 	if (!(unl)) {
/* 008095 */ 		return null;
/* 008095 */ 	}
/* 008096 */ 	var unll = unl.lower ();
/* 008097 */ 	if (unll.startswith ('unl:' + '//')) {
/* 008098 */ 		var unl = unl.__getslice__ (6, null, 1);
/* 008098 */ 	}
/* 008099 */ 	else if (unll.startswith ('file://')) {
/* 008100 */ 		var unl = unl.__getslice__ (7, null, 1);
/* 008100 */ 	}
/* 008101 */ 	var unl = unl.strip ();
/* 008102 */ 	if (!(unl)) {
/* 008103 */ 		return null;
/* 008103 */ 	}
/* 008104 */ 	var unl = g.unquoteUrl (unl);
/* 008106 */ 	if (unl.find ('#') == -(1) && unl.find ('-->') == -(1)) {
/* 008108 */ 		var __left0__ = tuple ([unl, null]);
/* 008108 */ 		var path = __left0__ [0];
/* 008108 */ 		var unl = __left0__ [1];
/* 008108 */ 	}
/* 008109 */ 	else if (unl.find ('#') == -(1)) {
/* 008112 */ 		g.recursiveUNLSearch (unl.py_split ('-->'), c, __kwargtrans__ ({soft_idx: true}));
/* 008113 */ 		return c;
/* 008113 */ 	}
/* 008114 */ 	else {
/* 008115 */ 		var __left0__ = unl.py_split ('#', 1);
/* 008115 */ 		var path = __left0__ [0];
/* 008115 */ 		var unl = __left0__ [1];
/* 008115 */ 	}
/* 008116 */ 	if (!(path)) {
/* 008118 */ 		g.recursiveUNLSearch (unl.py_split ('-->'), c, __kwargtrans__ ({soft_idx: true}));
/* 008119 */ 		return c;
/* 008119 */ 	}
/* 008120 */ 	if (c) {
/* 008121 */ 		var base = g.os_path_dirname (c.fileName ());
/* 008122 */ 		var c_path = g.os_path_finalize_join (base, path);
/* 008122 */ 	}
/* 008123 */ 	else {
/* 008124 */ 		var c_path = null;
/* 008124 */ 	}
/* 008134 */ 	var table = tuple ([c_path, g.os_path_finalize_join (g.app.loadDir, '..', path), g.os_path_finalize_join (g.app.loadDir, '..', '..', path), g.os_path_finalize_join (g.app.loadDir, '..', 'core', path), g.os_path_finalize_join (g.app.loadDir, '..', 'config', path), g.os_path_finalize_join (g.app.loadDir, '..', 'dist', path), g.os_path_finalize_join (g.app.loadDir, '..', 'doc', path), g.os_path_finalize_join (g.app.loadDir, '..', 'test', path), g.app.loadDir, g.app.homeDir]);
/* 008138 */ 	var __break0__ = false;
/* 008138 */ 	for (var path2 of table) {
/* 008139 */ 		if (path2 && path2.lower ().endswith ('.leo') && os.path.exists (path2)) {
/* 008140 */ 			var path = path2;
/* 008140 */ 			__break0__ = true;
/* 008140 */ 			break;
/* 008140 */ 		}
/* 008140 */ 	}
/* 008142 */ 	if (!__break0__) {
/* 008143 */ 		g.es_print ('path not found', repr (path));
/* 008144 */ 		return null;
/* 008144 */ 	}
/* 008146 */ 	c.endEditing ();
/* 008147 */ 	c.redraw ();
/* 008148 */ 	if (g.unitTesting) {
/* 008149 */ 		g.app.unitTestDict ['g.recursiveUNLSearch'] = path;
/* 008149 */ 	}
/* 008150 */ 	else {
/* 008151 */ 		var c2 = g.openWithFileName (path, __kwargtrans__ ({old_c: c}));
/* 008152 */ 		if (unl) {
/* 008153 */ 			g.recursiveUNLSearch (unl.py_split ('-->'), c2 || c, __kwargtrans__ ({soft_idx: true}));
/* 008153 */ 		}
/* 008154 */ 		if (c2) {
/* 008155 */ 			c2.bringToFront ();
/* 008156 */ 			return c2;
/* 008156 */ 		}
/* 008156 */ 	}
/* 008157 */ 	return null;
/* 008157 */ };
/* 008159 */ export var isValidUrl = function (url) {
/* 008161 */ 	var table = tuple (['file', 'ftp', 'gopher', 'hdl', 'http', 'https', 'imap', 'mailto', 'mms', 'news', 'nntp', 'prospero', 'rsync', 'rtsp', 'rtspu', 'sftp', 'shttp', 'sip', 'sips', 'snews', 'svn', 'svn+ssh', 'telnet', 'wais']);
/* 008166 */ 	if (url.lower ().startswith ('unl:' + '//') || url.startswith ('#')) {
/* 008168 */ 		return true;
/* 008168 */ 	}
/* 008169 */ 	if (url.startswith ('@')) {
/* 008170 */ 		return false;
/* 008170 */ 	}
/* 008171 */ 	var parsed = urlparse.urlparse (url);
/* 008172 */ 	var scheme = parsed.scheme;
/* 008173 */ 	for (var s of table) {
/* 008174 */ 		if (scheme.startswith (s)) {
/* 008175 */ 			return true;
/* 008175 */ 		}
/* 008175 */ 	}
/* 008176 */ 	return false;
/* 008176 */ };
/* 008178 */ export var openUrl = function (p) {
/* 008184 */ 	if (p) {
/* 008185 */ 		var url = g.getUrlFromNode (p);
/* 008186 */ 		if (url) {
/* 008187 */ 			var c = p.v.context;
/* 008188 */ 			if (!(g.doHook ('@url1', __kwargtrans__ ({c: c, p: p, url: url})))) {
/* 008189 */ 				g.handleUrl (url, __kwargtrans__ ({c: c, p: p}));
/* 008189 */ 			}
/* 008190 */ 			g.doHook ('@url2', __kwargtrans__ ({c: c, p: p, url: url}));
/* 008190 */ 		}
/* 008190 */ 	}
/* 008190 */ };
/* 008192 */ export var openUrlOnClick = function (event, url) {
/* 008192 */ 	if (typeof url == 'undefined' || (url != null && url.hasOwnProperty ("__kwargtrans__"))) {;
/* 008192 */ 		var url = null;
/* 008192 */ 	};
/* 008195 */ 	try {
/* 008196 */ 		return openUrlHelper (event, url);
/* 008196 */ 	}
/* 008196 */ 	catch (__except0__) {
/* 008196 */ 		if (isinstance (__except0__, Exception)) {
/* 008198 */ 			g.es_exception ();
/* 008199 */ 			return null;
/* 008199 */ 		}
/* 008199 */ 		else {
/* 008199 */ 			throw __except0__;
/* 008199 */ 		}
/* 008199 */ 	}
/* 008199 */ };
/* 008201 */ export var openUrlHelper = function (event, url) {
/* 008201 */ 	if (typeof url == 'undefined' || (url != null && url.hasOwnProperty ("__kwargtrans__"))) {;
/* 008201 */ 		var url = null;
/* 008201 */ 	};
/* 008203 */ 	var c = getattr (event, 'c', null);
/* 008204 */ 	if (!(c)) {
/* 008205 */ 		return null;
/* 008205 */ 	}
/* 008206 */ 	var w = getattr (event, 'w', c.frame.body.wrapper);
/* 008207 */ 	if (!(g.app.gui.isTextWrapper (w))) {
/* 008208 */ 		g.internalError ('must be a text wrapper', w);
/* 008209 */ 		return null;
/* 008209 */ 	}
/* 008210 */ 	setattr (event, 'widget', w);
/* 008212 */ 	if (url === null) {
/* 008213 */ 		var s = w.getAllText ();
/* 008214 */ 		var ins = w.getInsertPoint ();
/* 008215 */ 		var __left0__ = w.getSelectionRange ();
/* 008215 */ 		var i = __left0__ [0];
/* 008215 */ 		var j = __left0__ [1];
/* 008216 */ 		if (i != j) {
/* 008217 */ 			return null;
/* 008217 */ 		}
/* 008218 */ 		var __left0__ = g.convertPythonIndexToRowCol (s, ins);
/* 008218 */ 		var row = __left0__ [0];
/* 008218 */ 		var col = __left0__ [1];
/* 008219 */ 		var __left0__ = g.getLine (s, ins);
/* 008219 */ 		var i = __left0__ [0];
/* 008219 */ 		var j = __left0__ [1];
/* 008220 */ 		var line = s.__getslice__ (i, j, 1);
/* 008222 */ 		var __break0__ = false;
/* 008222 */ 		for (var match of g.url_regex.finditer (line)) {
/* 008224 */ 			if ((match.start () <= col && col < match.end ())) {
/* 008225 */ 				var url = match.group ();
/* 008226 */ 				if (g.isValidUrl (url)) {
/* 008226 */ 					__break0__ = true;
/* 008226 */ 					break;
/* 008226 */ 				}
/* 008226 */ 			}
/* 008226 */ 		}
/* 008228 */ 		if (!__break0__) {
/* 008230 */ 			for (var match of g.unl_regex.finditer (line)) {
/* 008232 */ 				if ((match.start () <= col && col < match.end ())) {
/* 008233 */ 					var unl = match.group ();
/* 008234 */ 					g.handleUnl (unl, c);
/* 008235 */ 					return null;
/* 008235 */ 				}
/* 008235 */ 			}
/* 008235 */ 		}
/* 008235 */ 	}
/* 008236 */ 	else if (!(isinstance (url, str))) {
/* 008237 */ 		var url = url.toString ();
/* 008238 */ 		var url = g.toUnicode (url);
/* 008238 */ 	}
/* 008240 */ 	if (url && g.isValidUrl (url)) {
/* 008242 */ 		var p = c.p;
/* 008243 */ 		if (!(g.doHook ('@url1', __kwargtrans__ ({c: c, p: p, url: url})))) {
/* 008244 */ 			g.handleUrl (url, __kwargtrans__ ({c: c, p: p}));
/* 008244 */ 		}
/* 008245 */ 		g.doHook ('@url2', __kwargtrans__ ({c: c, p: p}));
/* 008246 */ 		return url;
/* 008246 */ 	}
/* 008248 */ 	if (!(w.hasSelection ())) {
/* 008249 */ 		c.editCommands.extendToWord (event, __kwargtrans__ ({select: true}));
/* 008249 */ 	}
/* 008250 */ 	var word = w.getSelectedText ().strip ();
/* 008251 */ 	if (word) {
/* 008252 */ 		c.findCommands.findDef (event);
/* 008252 */ 	}
/* 008253 */ 	return null;
/* 008253 */ };
/* 008256 */ export var g = sys.modules.py_get ('leo.core.leoGlobals');
/* 008259 */ if (__name__ == '__main__') {
/* 008260 */ 	unittest.main ();
/* 008260 */ }
/* 000010 */ 
//# sourceMappingURL=leoGlobals.map