// Transcrypt'ed from Python, 2020-12-25 05:32:37
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as g from './leo.core.leoGlobals.js';
var __name__ = 'leo.core.leoMenu';
export var LeoMenu =  __class__ ('LeoMenu', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame) {
		self.c = frame.c;
		self.enable_dict = dict ({});
		self.frame = frame;
		self.isNull = false;
		self.menus = dict ({});
		self.menuShortcuts = dict ({});
	});},
	get finishCreate () {return __get__ (this, function (self) {
		self.define_enable_dict ();
	});},
	get define_enable_dict () {return __get__ (this, function (self) {
		var c = self.c;
		if (!(c.commandsDict)) {
			return ;
		}
		var __left0__ = dict ({'undo': c.undoer.canUndo, 'redo': c.undoer.canRedo, 'extract-names': c.canExtractSectionNames, 'extract': c.canExtract, 'match-brackets': c.canFindMatchingBracket, 'cut-node': c.canCutOutline, 'delete-node': c.canDeleteHeadline, 'paste-node': c.canPasteOutline, 'paste-retaining-clones': c.canPasteOutline, 'clone-node': c.canClone, 'sort-siblings': c.canSortSiblings, 'hoist': c.canHoist, 'de-hoist': c.canDehoist, 'contract-parent': c.canContractParent, 'contract-node': (function __lambda__ () {
			return c.p.hasChildren () && c.p.isExpanded ();
		}), 'contract-or-go-left': (function __lambda__ () {
			return c.p.hasChildren () && c.p.isExpanded () || c.p.hasParent ();
		}), 'expand-node': (function __lambda__ () {
			return c.p.hasChildren () && !(c.p.isExpanded ());
		}), 'expand-prev-level': (function __lambda__ () {
			return c.p.hasChildren () && c.p.isExpanded ();
		}), 'expand-next-level': (function __lambda__ () {
			return c.p.hasChildren ();
		}), 'expand-to-level-1': (function __lambda__ () {
			return c.p.hasChildren () && c.p.isExpanded ();
		}), 'expand-or-go-right': (function __lambda__ () {
			return c.p.hasChildren ();
		}), 'move-outline-down': (function __lambda__ () {
			return c.canMoveOutlineDown ();
		}), 'move-outline-left': (function __lambda__ () {
			return c.canMoveOutlineLeft ();
		}), 'move-outline-right': (function __lambda__ () {
			return c.canMoveOutlineRight ();
		}), 'move-outline-up': (function __lambda__ () {
			return c.canMoveOutlineUp ();
		}), 'promote': (function __lambda__ () {
			return c.canPromote ();
		}), 'demote': (function __lambda__ () {
			return c.canDemote ();
		}), 'goto-prev-history-node': (function __lambda__ () {
			return c.nodeHistory.canGoToPrevVisited ();
		}), 'goto-next-history-node': (function __lambda__ () {
			return c.nodeHistory.canGoToNextVisited ();
		}), 'goto-prev-visible': (function __lambda__ () {
			return c.canSelectVisBack ();
		}), 'goto-next-visible': (function __lambda__ () {
			return c.canSelectVisNext ();
		}), 'goto-next-clone': (function __lambda__ () {
			return c.p.isCloned ();
		}), 'goto-prev-node': (function __lambda__ () {
			return c.canSelectThreadBack ();
		}), 'goto-next-node': (function __lambda__ () {
			return c.canSelectThreadNext ();
		}), 'goto-parent': (function __lambda__ () {
			return c.p.hasParent ();
		}), 'goto-prev-sibling': (function __lambda__ () {
			return c.p.hasBack ();
		}), 'goto-next-sibling': (function __lambda__ () {
			return c.p.hasNext ();
		}), 'mark-subheads': (function __lambda__ () {
			return c.p.hasChildren ();
		})});
		self.enable_dict = __left0__;
		var d = __left0__;
		for (var i = 1; i < 9; i++) {
			d ['expand-to-level-{}'.format (i)] = (function __lambda__ () {
				return c.p.hasChildren ();
			});
		}
		if (0) {
			var commandKeys = list (c.commandsDict.py_keys ());
			for (var key of sorted (d.py_keys ())) {
				if (!__in__ (key, commandKeys)) {
					g.trace ('*** bad entry for {}'.format (key));
				}
			}
		}
	});},
	get oops () {return __get__ (this, function (self) {
		g.pr ('LeoMenu oops:', g.callers (4), 'should be overridden in subclass');
	});},
	get error () {return __get__ (this, function (self, s) {
		g.error ('', s);
	});},
	get capitalizeMinibufferMenuName () {return __get__ (this, function (self, s, removeHyphens) {
		var result = [];
		for (var [i, ch] of enumerate (s)) {
			var prev = (i > 0 ? s [i - 1] : '');
			var prevprev = (i > 1 ? s [i - 2] : '');
			if (i == 0 || i == 1 && prev == '&' || prev == '-' || prev == '&' && prevprev == '-') {
				result.append (ch.capitalize ());
			}
			else if (removeHyphens && ch == '-') {
				result.append (' ');
			}
			else {
				result.append (ch);
			}
		}
		return ''.join (result);
	});},
	get createMenusFromTables () {return __get__ (this, function (self) {
		var c = self.c;
		var aList = c.config.getMenusList ();
		if (aList) {
			self.createMenusFromConfigList (aList);
		}
		else {
			g.es_print ('No @menu setting found');
		}
	});},
	get createMenusFromConfigList () {return __get__ (this, function (self, aList) {
		var c = self.c;
		for (var z of aList) {
			var __left0__ = z;
			var kind = __left0__ [0];
			var val = __left0__ [1];
			var val2 = __left0__ [2];
			if (kind.startswith ('@menu')) {
				var py_name = kind.__getslice__ (len ('@menu'), null, 1).strip ();
				if (!(self.handleSpecialMenus (py_name, __kwargtrans__ ({parentName: null})))) {
					var menu = self.createNewMenu (py_name);
					if (menu) {
						self.createMenuFromConfigList (py_name, val, __kwargtrans__ ({level: 0}));
					}
					else {
						g.trace ('no menu', py_name);
					}
				}
			}
			else {
				self.error ('{} {} not valid outside @menu tree'.format (kind, val));
			}
		}
		var aList = c.config.getOpenWith ();
		if (aList) {
			self.createOpenWithMenuFromTable (aList);
		}
	});},
	get createMenuFromConfigList () {return __get__ (this, function (self, parentName, aList, level) {
		if (typeof level == 'undefined' || (level != null && level.hasOwnProperty ("__kwargtrans__"))) {;
			var level = 0;
		};
		var parentMenu = self.getMenu (parentName);
		if (!(parentMenu)) {
			g.trace ('NO PARENT', parentName, g.callers ());
		}
		var table = [];
		for (var z of aList) {
			var __left0__ = z;
			var kind = __left0__ [0];
			var val = __left0__ [1];
			var val2 = __left0__ [2];
			if (kind.startswith ('@menu')) {
				var py_name = kind.__getslice__ (5, null, 1).strip ();
				if (table) {
					self.createMenuEntries (parentMenu, table);
				}
				if (!(self.handleSpecialMenus (py_name, parentName, __kwargtrans__ ({alt_name: val2, table: table})))) {
					var menu = self.createNewMenu (py_name, parentName);
					if (menu) {
						self.createMenuFromConfigList (py_name, val, level + 1);
					}
				}
				var table = [];
			}
			else if (kind == '@item') {
				var py_name = str (val);
				if (val2) {
					table.append (tuple ([val2, py_name]));
				}
				else {
					table.append (py_name);
				}
			}
			else {
				g.trace ('can not happen: bad kind:', kind);
			}
		}
		if (table) {
			self.createMenuEntries (parentMenu, table);
		}
	});},
	get handleSpecialMenus () {return __get__ (this, function (self, py_name, parentName, alt_name, table) {
		if (typeof alt_name == 'undefined' || (alt_name != null && alt_name.hasOwnProperty ("__kwargtrans__"))) {;
			var alt_name = null;
		};
		if (typeof table == 'undefined' || (table != null && table.hasOwnProperty ("__kwargtrans__"))) {;
			var table = null;
		};
		var c = self.c;
		if (table === null) {
			var table = [];
		}
		var name2 = py_name.py_replace ('&', '').py_replace (' ', '').lower ();
		if (name2 == 'plugins') {
			g.doHook ('create-optional-menus', __kwargtrans__ ({c: c, menu_name: py_name}));
			return true;
		}
		if (name2.startswith ('recentfiles')) {
			g.app.recentFilesManager.recentFilesMenuName = alt_name || py_name;
			self.createNewMenu (alt_name || py_name, parentName);
			return true;
		}
		if (name2 == 'help' && g.isMac) {
			var helpMenu = self.getMacHelpMenu (table);
			return helpMenu !== null;
		}
		return false;
	});},
	get hasSelection () {return __get__ (this, function (self) {
		var c = self.c;
		var w = c.frame.body.wrapper;
		if (c.frame.body) {
			var __left0__ = w.getSelectionRange ();
			var first = __left0__ [0];
			var last = __left0__ [1];
			return first != last;
		}
		return false;
	});},
	get canonicalizeMenuName () {return __get__ (this, function (self, py_name) {
		if (g.isascii (py_name)) {
			return ''.join ((function () {
				var __accu0__ = [];
				for (var ch of py_name.lower ()) {
					if (ch.isalnum ()) {
						__accu0__.append (ch);
					}
				}
				return __accu0__;
			}) ());
		}
		return py_name;
	});},
	get canonicalizeTranslatedMenuName () {return __get__ (this, function (self, py_name) {
		if (g.isascii (py_name)) {
			return ''.join ((function () {
				var __accu0__ = [];
				for (var ch of py_name.lower ()) {
					if (!__in__ (ch, '& \t\n\r')) {
						__accu0__.append (ch);
					}
				}
				return __accu0__;
			}) ());
		}
		return ''.join ((function () {
			var __accu0__ = [];
			for (var ch of py_name) {
				if (!__in__ (ch, '& \t\n\r')) {
					__accu0__.append (ch);
				}
			}
			return __accu0__;
		}) ());
	});},
	get createMenuEntries () {return __get__ (this, function (self, menu, table) {
		var c = self.c;
		if (g.app.unitTesting) {
			return ;
		}
		if (!(menu)) {
			return ;
		}
		self.traceMenuTable (table);
		for (var data of table) {
			var __left0__ = self.getMenuEntryInfo (data, menu);
			var label = __left0__ [0];
			var command = __left0__ [1];
			var done = __left0__ [2];
			if (done) {
				continue;
			}
			var commandName = self.getMenuEntryBindings (command, label);
			if (!(commandName)) {
				continue;
			}
			var masterMenuCallback = self.createMasterMenuCallback (command, commandName);
			var realLabel = self.getRealMenuName (label);
			var amp_index = realLabel.find ('&');
			var realLabel = realLabel.py_replace ('&', '');
			c.add_command (menu, __kwargtrans__ ({label: realLabel, accelerator: '', command: masterMenuCallback, commandName: commandName, underline: amp_index}));
		}
	});},
	get createMasterMenuCallback () {return __get__ (this, function (self, command, commandName) {
		var c = self.c;
		var getWidget = function () {
			var w = c.frame.getFocus ();
			if (w && g.isMac) {
				var wname = c.widget_name (w);
				if (wname.startswith ('head')) {
					var w = c.frame.tree.edit_widget (c.p);
				}
			}
			if (!(g.isTextWrapper (w))) {
				var w = getattr (w, 'wrapper', w);
			}
			return w;
		};
		if (isinstance (command, str)) {
			var static_menu_callback = function () {
				var event = g.app.gui.create_key_event (c, __kwargtrans__ ({w: getWidget ()}));
				c.doCommandByName (commandName, event);
			};
			return static_menu_callback;
		}
		if (!(callable (command))) {
			var dummy_menu_callback = function (event) {
				if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
					var event = null;
				};
				// pass;
			};
			g.trace ('bad command: {}'.format (command), __kwargtrans__ ({color: 'red'}));
			return dummy_menu_callback;
		}
		var dynamic_menu_callback = function () {
			var event = g.app.gui.create_key_event (c, __kwargtrans__ ({w: getWidget ()}));
			return c.doCommand (command, commandName, event);
		};
		return dynamic_menu_callback;
	});},
	get getMenuEntryBindings () {return __get__ (this, function (self, command, label) {
		var c = self.c;
		if (isinstance (command, str)) {
			var commandName = command;
		}
		else {
			var commandName = label.strip ();
		}
		var command = c.commandsDict.py_get (commandName);
		return commandName;
	});},
	get getMenuEntryInfo () {return __get__ (this, function (self, data, menu) {
		var done = false;
		if (isinstance (data, str)) {
			var s = data;
			var removeHyphens = s && s [0] == '*';
			if (removeHyphens) {
				var s = s.__getslice__ (1, null, 1);
			}
			var label = self.capitalizeMinibufferMenuName (s, removeHyphens);
			var command = s.py_replace ('&', '').lower ();
			if (label == '-') {
				self.add_separator (menu);
				var done = true;
			}
		}
		else {
			var ok = isinstance (data, tuple ([list, tuple])) && __in__ (len (data), tuple ([2, 3]));
			if (ok) {
				if (len (data) == 2) {
					var __left0__ = data;
					var label = __left0__ [0];
					var command = __left0__ [1];
				}
				else {
					var __left0__ = data;
					var label = __left0__ [0];
					var junk = __left0__ [1];
					var command = __left0__ [2];
				}
				if (__in__ (label, tuple ([null, '-']))) {
					self.add_separator (menu);
					var done = true;
				}
			}
			else {
				g.trace ('bad data in menu table: {}'.format (repr (data)));
				var done = true;
			}
		}
		return tuple ([label, command, done]);
	});},
	get traceMenuTable () {return __get__ (this, function (self, table) {
		var trace = false && !(g.unitTesting);
		if (!(trace)) {
			return ;
		}
		var format = '%40s %s';
		g.trace ('*' * 40);
		for (var data of table) {
			if (isinstance (data, tuple ([list, tuple]))) {
				var n = len (data);
				if (n == 2) {
					print (__mod__ (format, tuple ([data [0], data [1]])));
				}
				else if (n == 3) {
					var __left0__ = data;
					var py_name = __left0__ [0];
					var junk = __left0__ [1];
					var func = __left0__ [2];
					print (__mod__ (format, tuple ([py_name, func && func.__name__ || '<NO FUNC>'])));
				}
			}
			else {
				print (__mod__ (format, tuple ([data, ''])));
			}
		}
	});},
	get createMenuItemsFromTable () {return __get__ (this, function (self, menuName, table) {
		if (g.app.gui.isNullGui) {
			return ;
		}
		try {
			var menu = self.getMenu (menuName);
			if (menu === null) {
				return ;
			}
			self.createMenuEntries (menu, table);
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es_print ('exception creating items for', menuName, 'menu');
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
		g.app.menuWarningsGiven = true;
	});},
	get createNewMenu () {return __get__ (this, function (self, menuName, parentName, before) {
		if (typeof parentName == 'undefined' || (parentName != null && parentName.hasOwnProperty ("__kwargtrans__"))) {;
			var parentName = 'top';
		};
		if (typeof before == 'undefined' || (before != null && before.hasOwnProperty ("__kwargtrans__"))) {;
			var before = null;
		};
		try {
			var parent = self.getMenu (parentName);
			var menu = self.getMenu (menuName);
			if (menu) {
				return null;
			}
			var menu = self.new_menu (parent, __kwargtrans__ ({tearoff: 0, label: menuName}));
			self.setMenu (menuName, menu);
			var label = self.getRealMenuName (menuName);
			var amp_index = label.find ('&');
			var label = label.py_replace ('&', '');
			if (before) {
				var index_label = self.getRealMenuName (before);
				var amp_index = index_label.find ('&');
				var index_label = index_label.py_replace ('&', '');
				var index = parent.index (index_label);
				self.insert_cascade (parent, __kwargtrans__ ({index: index, label: label, menu: menu, underline: amp_index}));
			}
			else {
				self.add_cascade (parent, __kwargtrans__ ({label: label, menu: menu, underline: amp_index}));
			}
			return menu;
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es ('exception creating', menuName, 'menu');
				g.es_exception ();
				return null;
			}
			else {
				throw __except0__;
			}
		}
	});},
	get createOpenWithMenuFromTable () {return __get__ (this, function (self, table) {
		var k = self.c.k;
		if (!(table)) {
			return ;
		}
		g.app.openWithTable = table;
		var parent = self.getMenu ('File');
		if (!(parent)) {
			if (!(g.app.batchMode)) {
				g.error ('', 'createOpenWithMenuFromTable:', 'no File menu');
			}
			return ;
		}
		var label = self.getRealMenuName ('Open &With...');
		var amp_index = label.find ('&');
		var label = label.py_replace ('&', '');
		try {
			var index = parent.index (label);
			parent.delete (index);
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				try {
					var index = parent.index ('Open With...');
					parent.delete (index);
				}
				catch (__except1__) {
					if (isinstance (__except1__, Exception)) {
						g.trace ('unexpected exception');
						g.es_exception ();
						return ;
					}
					else {
						throw __except1__;
					}
				}
			}
			else {
				throw __except0__;
			}
		}
		var openWithMenu = self.createOpenWithMenu (parent, label, index, amp_index);
		if (!(openWithMenu)) {
			g.trace ('openWithMenu returns None');
			return ;
		}
		self.setMenu ('Open With...', openWithMenu);
		self.createOpenWithMenuItemsFromTable (openWithMenu, table);
		for (var d of table) {
			k.bindOpenWith (d);
		}
	});},
	get createOpenWithMenuItemsFromTable () {return __get__ (this, function (self, menu, table) {
		var c = self.c;
		if (g.app.unitTesting) {
			return ;
		}
		for (var d of table) {
			var label = d.py_get ('name');
			var args = d.py_get ('args', []);
			var accel = d.py_get ('shortcut') || '';
			if (label && args) {
				var realLabel = self.getRealMenuName (label);
				var underline = realLabel.find ('&');
				var realLabel = realLabel.py_replace ('&', '');
				var callback = self.defineOpenWithMenuCallback (d);
				c.add_command (menu, __kwargtrans__ ({label: realLabel, accelerator: accel, command: callback, underline: underline}));
			}
		}
	});},
	get defineOpenWithMenuCallback () {return __get__ (this, function (self, d) {
		var openWithMenuCallback = function (event, self, d) {
			if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
				var event = null;
			};
			if (typeof self == 'undefined' || (self != null && self.hasOwnProperty ("__kwargtrans__"))) {;
				var self = self;
			};
			if (typeof d == 'undefined' || (d != null && d.hasOwnProperty ("__kwargtrans__"))) {;
				var d = d;
			};
			return self.c.openWith (__kwargtrans__ ({d: d}));
		};
		return openWithMenuCallback;
	});},
	get deleteRecentFilesMenuItems () {return __get__ (this, function (self, menu) {
		var rf = g.app.recentFilesManager;
		var recentFiles = rf.getRecentFiles ();
		var toDrop = len (recentFiles) + len (rf.getRecentFilesTable ());
		self.delete_range (menu, 0, toDrop);
		for (var i of rf.groupedMenus) {
			var menu = self.getMenu (i);
			if (menu) {
				self.destroy (menu);
				self.destroyMenu (i);
			}
		}
	});},
	get deleteMenu () {return __get__ (this, function (self, menuName) {
		try {
			var menu = self.getMenu (menuName);
			if (menu) {
				self.destroy (menu);
				self.destroyMenu (menuName);
			}
			else {
				g.es ("can't delete menu:", menuName);
			}
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es ('exception deleting', menuName, 'menu');
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
	});},
	get deleteMenuItem () {return __get__ (this, function (self, itemName, menuName) {
		if (typeof menuName == 'undefined' || (menuName != null && menuName.hasOwnProperty ("__kwargtrans__"))) {;
			var menuName = 'top';
		};
		try {
			var menu = self.getMenu (menuName);
			if (menu) {
				var realItemName = self.getRealMenuName (itemName);
				self.delete (menu, realItemName);
			}
			else {
				g.es ('menu not found:', menuName);
			}
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es ('exception deleting', itemName, 'from', menuName, 'menu');
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
	});},
	get getRealMenuName () {return __get__ (this, function (self, menuName) {
		var cmn = self.canonicalizeTranslatedMenuName (menuName);
		return g.app.realMenuNameDict.py_get (cmn, menuName);
	});},
	get setRealMenuName () {return __get__ (this, function (self, untrans, trans) {
		var cmn = self.canonicalizeTranslatedMenuName (untrans);
		g.app.realMenuNameDict [cmn] = trans;
	});},
	get setRealMenuNamesFromTable () {return __get__ (this, function (self, table) {
		try {
			for (var [untrans, trans] of table) {
				self.setRealMenuName (untrans, trans);
			}
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.es ('exception in', 'setRealMenuNamesFromTable');
				g.es_exception ();
			}
			else {
				throw __except0__;
			}
		}
	});},
	get getMenu () {return __get__ (this, function (self, menuName) {
		var cmn = self.canonicalizeMenuName (menuName);
		return self.menus.py_get (cmn);
	});},
	get setMenu () {return __get__ (this, function (self, menuName, menu) {
		var cmn = self.canonicalizeMenuName (menuName);
		self.menus [cmn] = menu;
	});},
	get destroyMenu () {return __get__ (this, function (self, menuName) {
		var cmn = self.canonicalizeMenuName (menuName);
		delete self.menus [cmn];
	});},
	get add_cascade () {return __get__ (this, function (self, parent, label, menu, underline) {
		self.oops ();
	});},
	get add_command () {return __get__ (this, function (self, menu) {
		self.oops ();
	});},
	get add_separator () {return __get__ (this, function (self, menu) {
		self.oops ();
	});},
	get delete () {return __get__ (this, function (self, menu, realItemName) {
		self.oops ();
	});},
	get delete_range () {return __get__ (this, function (self, menu, n1, n2) {
		self.oops ();
	});},
	get destroy () {return __get__ (this, function (self, menu) {
		self.oops ();
	});},
	get insert () {return __get__ (this, function (self, menuName, position, label, command, underline) {
		if (typeof underline == 'undefined' || (underline != null && underline.hasOwnProperty ("__kwargtrans__"))) {;
			var underline = null;
		};
		self.oops ();
	});},
	get insert_cascade () {return __get__ (this, function (self, parent, index, label, menu, underline) {
		self.oops ();
	});},
	get new_menu () {return __get__ (this, function (self, parent, tearoff, label) {
		if (typeof tearoff == 'undefined' || (tearoff != null && tearoff.hasOwnProperty ("__kwargtrans__"))) {;
			var tearoff = 0;
		};
		if (typeof label == 'undefined' || (label != null && label.hasOwnProperty ("__kwargtrans__"))) {;
			var label = '';
		};
		self.oops ();
	});},
	get activateMenu () {return __get__ (this, function (self, menuName) {
		self.oops ();
	});},
	get clearAccel () {return __get__ (this, function (self, menu, py_name) {
		self.oops ();
	});},
	get createMenuBar () {return __get__ (this, function (self, frame) {
		self.oops ();
	});},
	get createOpenWithMenu () {return __get__ (this, function (self, parent, label, index, amp_index) {
		self.oops ();
	});},
	get disableMenu () {return __get__ (this, function (self, menu, py_name) {
		self.oops ();
	});},
	get enableMenu () {return __get__ (this, function (self, menu, py_name, val) {
		self.oops ();
	});},
	get getMacHelpMenu () {return __get__ (this, function (self, table) {
		return null;
	});},
	get getMenuLabel () {return __get__ (this, function (self, menu, py_name) {
		self.oops ();
	});},
	get setMenuLabel () {return __get__ (this, function (self, menu, py_name, label, underline) {
		if (typeof underline == 'undefined' || (underline != null && underline.hasOwnProperty ("__kwargtrans__"))) {;
			var underline = -(1);
		};
		self.oops ();
	});}
});
export var NullMenu =  __class__ ('NullMenu', [LeoMenu], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame) {
		__super__ (NullMenu, '__init__') (self, frame);
		self.isNull = true;
	});},
	get oops () {return __get__ (this, function (self) {
		// pass;
	});}
});

//# sourceMappingURL=leo.core.leoMenu.map