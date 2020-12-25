// Transcrypt'ed from Python, 2020-12-25 05:32:35
var time = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as leoNodes from './leo.core.leoNodes.js';
import * as leoMenu from './leo.core.leoMenu.js';
import {leoColorizer} from './leo.core.js';
import * as g from './leo.core.leoGlobals.js';
import * as __module_time__ from './time.js';
__nest__ (time, '', __module_time__);
var __name__ = 'leo.core.leoFrame';
export var StatusLineAPI =  __class__ ('StatusLineAPI', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, parentFrame) {
		// pass;
	});},
	get py_clear () {return __get__ (this, function (self) {
		// pass;
	});},
	get disable () {return __get__ (this, function (self, background) {
		if (typeof background == 'undefined' || (background != null && background.hasOwnProperty ("__kwargtrans__"))) {;
			var background = null;
		};
		// pass;
	});},
	get enable () {return __get__ (this, function (self, background) {
		if (typeof background == 'undefined' || (background != null && background.hasOwnProperty ("__kwargtrans__"))) {;
			var background = 'white';
		};
		// pass;
	});},
	get py_get () {return __get__ (this, function (self) {
		return '';
	});},
	get isEnabled () {return __get__ (this, function (self) {
		return false;
	});},
	get put () {return __get__ (this, function (self, s, bg, fg) {
		if (typeof bg == 'undefined' || (bg != null && bg.hasOwnProperty ("__kwargtrans__"))) {;
			var bg = null;
		};
		if (typeof fg == 'undefined' || (fg != null && fg.hasOwnProperty ("__kwargtrans__"))) {;
			var fg = null;
		};
		// pass;
	});},
	get setFocus () {return __get__ (this, function (self) {
		// pass;
	});},
	get py_update () {return __get__ (this, function (self) {
		// pass;
	});}
});
export var TreeAPI =  __class__ ('TreeAPI', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame) {
		// pass;
	});},
	get drawIcon () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get editLabel () {return __get__ (this, function (self, v, selectAll, selection) {
		if (typeof selectAll == 'undefined' || (selectAll != null && selectAll.hasOwnProperty ("__kwargtrans__"))) {;
			var selectAll = false;
		};
		if (typeof selection == 'undefined' || (selection != null && selection.hasOwnProperty ("__kwargtrans__"))) {;
			var selection = null;
		};
		// pass;
	});},
	get edit_widget () {return __get__ (this, function (self, p) {
		return null;
	});},
	get redraw () {return __get__ (this, function (self, p) {
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		// pass;
	});},
	redraw_now: redraw,
	get scrollTo () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get initAfterLoad () {return __get__ (this, function (self) {
		// pass;
	});},
	get onHeadChanged () {return __get__ (this, function (self, p, undoType, s, e) {
		if (typeof undoType == 'undefined' || (undoType != null && undoType.hasOwnProperty ("__kwargtrans__"))) {;
			var undoType = 'Typing';
		};
		if (typeof s == 'undefined' || (s != null && s.hasOwnProperty ("__kwargtrans__"))) {;
			var s = null;
		};
		if (typeof e == 'undefined' || (e != null && e.hasOwnProperty ("__kwargtrans__"))) {;
			var e = null;
		};
		// pass;
	});},
	get redraw_after_contract () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get redraw_after_expand () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get redraw_after_head_changed () {return __get__ (this, function (self) {
		// pass;
	});},
	get redraw_after_icons_changed () {return __get__ (this, function (self) {
		// pass;
	});},
	get redraw_after_select () {return __get__ (this, function (self, p) {
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		// pass;
	});},
	get OnIconCtrlClick () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get endEditLabel () {return __get__ (this, function (self) {
		// pass;
	});},
	get getEditTextDict () {return __get__ (this, function (self, v) {
		return null;
	});},
	get injectCallbacks () {return __get__ (this, function (self) {
		// pass;
	});},
	get onHeadlineKey () {return __get__ (this, function (self, event) {
		// pass;
	});},
	get select () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get updateHead () {return __get__ (this, function (self, event, w) {
		// pass;
	});}
});
export var WrapperAPI =  __class__ ('WrapperAPI', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c) {
		// pass;
	});},
	get appendText () {return __get__ (this, function (self, s) {
		// pass;
	});},
	get clipboard_append () {return __get__ (this, function (self, s) {
		// pass;
	});},
	get clipboard_clear () {return __get__ (this, function (self) {
		// pass;
	});},
	get delete () {return __get__ (this, function (self, i, j) {
		if (typeof j == 'undefined' || (j != null && j.hasOwnProperty ("__kwargtrans__"))) {;
			var j = null;
		};
		// pass;
	});},
	get deleteTextSelection () {return __get__ (this, function (self) {
		// pass;
	});},
	get disable () {return __get__ (this, function (self) {
		// pass;
	});},
	get enable () {return __get__ (this, function (self, enabled) {
		if (typeof enabled == 'undefined' || (enabled != null && enabled.hasOwnProperty ("__kwargtrans__"))) {;
			var enabled = true;
		};
		// pass;
	});},
	get flashCharacter () {return __get__ (this, function (self, i, bg, fg, flashes, delay) {
		if (typeof bg == 'undefined' || (bg != null && bg.hasOwnProperty ("__kwargtrans__"))) {;
			var bg = 'white';
		};
		if (typeof fg == 'undefined' || (fg != null && fg.hasOwnProperty ("__kwargtrans__"))) {;
			var fg = 'red';
		};
		if (typeof flashes == 'undefined' || (flashes != null && flashes.hasOwnProperty ("__kwargtrans__"))) {;
			var flashes = 3;
		};
		if (typeof delay == 'undefined' || (delay != null && delay.hasOwnProperty ("__kwargtrans__"))) {;
			var delay = 75;
		};
		// pass;
	});},
	get py_get () {return __get__ (this, function (self, i, j) {
		return '';
	});},
	get getAllText () {return __get__ (this, function (self) {
		return '';
	});},
	get getInsertPoint () {return __get__ (this, function (self) {
		return 0;
	});},
	get getSelectedText () {return __get__ (this, function (self) {
		return '';
	});},
	get getSelectionRange () {return __get__ (this, function (self) {
		return tuple ([0, 0]);
	});},
	get getXScrollPosition () {return __get__ (this, function (self) {
		return 0;
	});},
	get getYScrollPosition () {return __get__ (this, function (self) {
		return 0;
	});},
	get hasSelection () {return __get__ (this, function (self) {
		return false;
	});},
	get insert () {return __get__ (this, function (self, i, s) {
		// pass;
	});},
	get see () {return __get__ (this, function (self, i) {
		// pass;
	});},
	get seeInsertPoint () {return __get__ (this, function (self) {
		// pass;
	});},
	get selectAllText () {return __get__ (this, function (self, insert) {
		if (typeof insert == 'undefined' || (insert != null && insert.hasOwnProperty ("__kwargtrans__"))) {;
			var insert = null;
		};
		// pass;
	});},
	get setAllText () {return __get__ (this, function (self, s) {
		// pass;
	});},
	get setFocus () {return __get__ (this, function (self) {
		// pass;
	});},
	get setInsertPoint () {return __get__ (this, function (self, pos, s) {
		if (typeof s == 'undefined' || (s != null && s.hasOwnProperty ("__kwargtrans__"))) {;
			var s = null;
		};
		// pass;
	});},
	get setSelectionRange () {return __get__ (this, function (self, i, j, insert) {
		if (typeof insert == 'undefined' || (insert != null && insert.hasOwnProperty ("__kwargtrans__"))) {;
			var insert = null;
		};
		// pass;
	});},
	get setXScrollPosition () {return __get__ (this, function (self, i) {
		// pass;
	});},
	get setYScrollPosition () {return __get__ (this, function (self, i) {
		// pass;
	});},
	get tag_configure () {return __get__ (this, function (self, colorName) {
		// pass;
	});},
	get toPythonIndex () {return __get__ (this, function (self, index) {
		return 0;
	});},
	get toPythonIndexRowCol () {return __get__ (this, function (self, index) {
		return tuple ([0, 0, 0]);
	});}
});
export var IconBarAPI =  __class__ ('IconBarAPI', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, parentFrame) {
		// pass;
	});},
	get add () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		// pass;
	});},
	get addRow () {return __get__ (this, function (self, height) {
		if (typeof height == 'undefined' || (height != null && height.hasOwnProperty ("__kwargtrans__"))) {;
			var height = null;
		};
		// pass;
	});},
	get addRowIfNeeded () {return __get__ (this, function (self) {
		// pass;
	});},
	get addWidget () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get py_clear () {return __get__ (this, function (self) {
		// pass;
	});},
	get createChaptersIcon () {return __get__ (this, function (self) {
		// pass;
	});},
	get deleteButton () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get getNewFrame () {return __get__ (this, function (self) {
		// pass;
	});},
	get setCommandForButton () {return __get__ (this, function (self, button, command, command_p, controller, gnx, script) {
		// pass;
	});}
});
export var LeoBody =  __class__ ('LeoBody', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame, parentFrame) {
		var c = frame.c;
		frame.body = self;
		self.c = c;
		self.editorWrappers = dict ({});
		self.frame = frame;
		self.parentFrame = parentFrame;
		self.totalNumberOfEditors = 0;
		self.widget = null;
		self.wrapper = null;
		self.numberOfEditors = 1;
		self.pb = null;
		self.colorizer = null;
		self.use_chapters = false;
	});},
	get cmd () {return __get__ (this, function (py_name) {
		return g.new_cmd_decorator (py_name, ['c', 'frame', 'body']);
	});},
	get forceFullRecolor () {return __get__ (this, function (self) {
		// pass;
	});},
	get getColorizer () {return __get__ (this, function (self) {
		return self.colorizer;
	});},
	get updateSyntaxColorer () {return __get__ (this, function (self, p) {
		return self.colorizer.updateSyntaxColorer (p.copy ());
	});},
	get recolor () {return __get__ (this, function (self, p) {
		if (__in__ ('incremental', kwargs)) {
			print ('c.recolor: incremental keyword is deprecated', g.callers (1));
		}
		self.c.recolor ();
	});},
	recolor_now: recolor,
	get oops () {return __get__ (this, function (self) {
		g.trace ('(LeoBody) %s should be overridden in a subclass', g.callers ());
	});},
	get createEditorFrame () {return __get__ (this, function (self, w) {
		self.oops ();
	});},
	get createTextWidget () {return __get__ (this, function (self, parentFrame, p, py_name) {
		self.oops ();
	});},
	get packEditorLabelWidget () {return __get__ (this, function (self, w) {
		self.oops ();
	});},
	get onFocusOut () {return __get__ (this, function (self, obj) {
		// pass;
	});},
	get addEditor () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var __left0__ = tuple ([self.c, self.c.p]);
		var c = __left0__ [0];
		var p = __left0__ [1];
		self.totalNumberOfEditors++;
		self.numberOfEditors++;
		if (self.numberOfEditors == 2) {
			var d = self.editorWrappers;
			var py_keys = list (d.py_keys ());
			if (len (py_keys) == 1) {
				var w_old = d.py_get (py_keys [0]);
				self.updateInjectedIvars (w_old, p);
				self.selectLabel (w_old);
			}
			else {
				g.trace ('can not happen: unexpected editorWrappers', d);
			}
		}
		var py_name = '{}'.format (self.totalNumberOfEditors);
		var pane = self.pb.add (py_name);
		var panes = self.pb.panes ();
		var minSize = float (1.0 / float (len (panes)));
		var f = self.createEditorFrame (pane);
		var wrapper = self.createTextWidget (f, __kwargtrans__ ({py_name: py_name, p: p}));
		wrapper.delete (0, 'end');
		wrapper.insert ('end', p.b);
		wrapper.see (0);
		c.k.completeAllBindingsForWidget (wrapper);
		self.recolorWidget (p, wrapper);
		self.editorWrappers [py_name] = wrapper;
		for (var pane of panes) {
			self.pb.configurepane (pane, __kwargtrans__ ({size: minSize}));
		}
		self.pb.updatelayout ();
		c.frame.body.wrapper = wrapper;
		self.updateInjectedIvars (wrapper, p);
		self.selectLabel (wrapper);
		self.selectEditor (wrapper);
		self.updateEditors ();
		c.bodyWantsFocus ();
	});},
	get assignPositionToEditor () {return __get__ (this, function (self, p) {
		var c = self.c;
		var w = c.frame.body.widget;
		self.updateInjectedIvars (w, p);
		self.selectLabel (w);
	});},
	get cycleEditorFocus () {return __get__ (this, cmd ('editor-cycle-focus') (cmd ('cycle-editor-focus') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var c = self.c;
		var d = self.editorWrappers;
		var w = c.frame.body.wrapper;
		var py_values = list (d.py_values ());
		if (len (py_values) > 1) {
			var i = py_values.index (w) + 1;
			if (i == len (py_values)) {
				var i = 0;
			}
			var w2 = py_values [i];
			self.selectEditor (w2);
			c.frame.body.wrapper = w2;
		}
	})));},
	get deleteEditor () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var c = self.c;
		var w = c.frame.body.wapper;
		var d = self.editorWrappers;
		if (len (list (d.py_keys ())) == 1) {
			return ;
		}
		var py_name = w.leo_name;
		delete d [py_name];
		self.pb.delete (py_name);
		var panes = self.pb.panes ();
		var minSize = float (1.0 / float (len (panes)));
		for (var pane of panes) {
			self.pb.configurepane (pane, __kwargtrans__ ({size: minSize}));
		}
		var w = list (d.py_values ()) [0];
		self.numberOfEditors--;
		self.selectEditor (w);
	});},
	get findEditorForChapter () {return __get__ (this, function (self, chapter, p) {
		var c = self.c;
		var d = self.editorWrappers;
		var py_values = list (d.py_values ());
		if (p) {
			for (var w of py_values) {
				if (hasattr (w, 'leo_chapter') && w.leo_chapter == chapter && hasattr (w, 'leo_p') && w.leo_p && w.leo_p == p) {
					return w;
				}
			}
		}
		for (var w of py_values) {
			if (hasattr (w, 'leo_chapter') && w.leo_chapter == chapter) {
				return w;
			}
		}
		return c.frame.body.wrapper;
	});},
	get unselectLabel () {return __get__ (this, function (self, w) {
		self.createChapterIvar (w);
		self.packEditorLabelWidget (w);
		var s = self.computeLabel (w);
		if (hasattr (w, 'leo_label') && w.leo_label) {
			w.leo_label.configure (__kwargtrans__ ({text: s, bg: 'LightSteelBlue1'}));
		}
	});},
	get selectLabel () {return __get__ (this, function (self, w) {
		if (self.numberOfEditors > 1) {
			self.createChapterIvar (w);
			self.packEditorLabelWidget (w);
			var s = self.computeLabel (w);
			if (hasattr (w, 'leo_label') && w.leo_label) {
				w.leo_label.configure (__kwargtrans__ ({text: s, bg: 'white'}));
			}
		}
		else if (hasattr (w, 'leo_label') && w.leo_label) {
			w.leo_label.pack_forget ();
			w.leo_label = null;
		}
	});},
	selectEditorLockout: false,
	get selectEditor () {return __get__ (this, function (self, w) {
		var c = self.c;
		if (self.selectEditorLockout) {
			return null;
		}
		if (w && w == self.c.frame.body.widget) {
			if (w.leo_p && w.leo_p != c.p) {
				c.selectPosition (w.leo_p);
				c.bodyWantsFocus ();
			}
			return null;
		}
		try {
			var val = null;
			self.selectEditorLockout = true;
			var val = self.selectEditorHelper (w);
		}
		finally {
			self.selectEditorLockout = false;
		}
		return val;
	});},
	get selectEditorHelper () {return __get__ (this, function (self, wrapper) {
		var c = self.c;
		if (!(hasattr (wrapper, 'leo_p') && wrapper.leo_p)) {
			g.trace ('no wrapper.leo_p');
			return ;
		}
		self.deactivateActiveEditor (wrapper);
		c.frame.body.wrapper = wrapper;
		wrapper.leo_active = true;
		self.switchToChapter (wrapper);
		self.selectLabel (wrapper);
		if (!(self.ensurePositionExists (wrapper))) {
			g.trace ('***** no position editor!');
			return ;
		}
		var p = wrapper.leo_p;
		c.redraw (p);
		c.recolor ();
		c.bodyWantsFocus ();
	});},
	get updateEditors () {return __get__ (this, function (self) {
		var c = self.c;
		var p = c.p;
		var d = self.editorWrappers;
		if (len (list (d.py_keys ())) < 2) {
			return ;
		}
		for (var key of d) {
			var wrapper = d.py_get (key);
			var v = wrapper.leo_v;
			if (v && v == p.v && wrapper != c.frame.body.wrapper) {
				wrapper.delete (0, 'end');
				wrapper.insert ('end', p.b);
				self.recolorWidget (p, wrapper);
			}
		}
		c.bodyWantsFocus ();
	});},
	get computeLabel () {return __get__ (this, function (self, w) {
		var s = w.leo_label_s;
		if (hasattr (w, 'leo_chapter') && w.leo_chapter) {
			var s = '{}: {}'.format (w.leo_chapter.py_name, s);
		}
		return s;
	});},
	get createChapterIvar () {return __get__ (this, function (self, w) {
		var c = self.c;
		var cc = c.chapterController;
		if (!(hasattr (w, 'leo_chapter')) || !(w.leo_chapter)) {
			if (cc && self.use_chapters) {
				w.leo_chapter = cc.getSelectedChapter ();
			}
			else {
				w.leo_chapter = null;
			}
		}
	});},
	get ensurePositionExists () {return __get__ (this, function (self, w) {
		var c = self.c;
		if (c.positionExists (w.leo_p)) {
			return true;
		}
		g.trace ('***** does not exist', w.leo_name);
		for (var p2 of c.all_unique_positions ()) {
			if (p2.v && p2.v == w.leo_v) {
				w.leo_p = p2.copy ();
				return true;
			}
		}
		w.leo_p = c.p;
		return false;
	});},
	get deactivateActiveEditor () {return __get__ (this, function (self, w) {
		var d = self.editorWrappers;
		for (var key of d) {
			var w2 = d.py_get (key);
			if (w2 != w && w2.leo_active) {
				w2.leo_active = false;
				self.unselectLabel (w2);
				return ;
			}
		}
	});},
	get recolorWidget () {return __get__ (this, function (self, p, w) {
		var c = self.c;
		var colorizer = c.frame.body.colorizer;
		if (p && colorizer && hasattr (colorizer, 'colorize')) {
			var old_wrapper = c.frame.body.wrapper;
			c.frame.body.wrapper = w;
			try {
				c.frame.body.colorizer.colorize (p);
			}
			finally {
				c.frame.body.wrapper = old_wrapper;
			}
		}
	});},
	get switchToChapter () {return __get__ (this, function (self, w) {
		var c = self.c;
		var cc = c.chapterController;
		if (hasattr (w, 'leo_chapter') && w.leo_chapter) {
			var chapter = w.leo_chapter;
			var py_name = chapter && chapter.py_name;
			var oldChapter = cc.getSelectedChapter ();
			if (chapter != oldChapter) {
				cc.selectChapterByName (py_name);
				c.bodyWantsFocus ();
			}
		}
	});},
	get updateInjectedIvars () {return __get__ (this, function (self, w, p) {
		if (!(w)) {
			return ;
		}
		var c = self.c;
		var cc = c.chapterController;
		var use_chapters = c.config.getBool ('use-chapters');
		if (cc && use_chapters) {
			w.leo_chapter = cc.getSelectedChapter ();
		}
		else {
			w.leo_chapter = null;
		}
		w.leo_p = p.copy ();
		w.leo_v = w.leo_p.v;
		w.leo_label_s = p.h;
	});},
	get getInsertLines () {return __get__ (this, function (self) {
		var body = self;
		var w = body.wrapper;
		var s = w.getAllText ();
		var insert = w.getInsertPoint ();
		var __left0__ = g.getLine (s, insert);
		var i = __left0__ [0];
		var j = __left0__ [1];
		var before = s.__getslice__ (0, i, 1);
		var ins = s.__getslice__ (i, j, 1);
		var after = s.__getslice__ (j, null, 1);
		var before = g.checkUnicode (before);
		var ins = g.checkUnicode (ins);
		var after = g.checkUnicode (after);
		return tuple ([before, ins, after]);
	});},
	get getSelectionAreas () {return __get__ (this, function (self) {
		var body = self;
		var w = body.wrapper;
		var s = w.getAllText ();
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		if (i == j) {
			var j = i + 1;
		}
		var before = s.__getslice__ (0, i, 1);
		var sel = s.__getslice__ (i, j, 1);
		var after = s.__getslice__ (j, null, 1);
		var before = g.checkUnicode (before);
		var sel = g.checkUnicode (sel);
		var after = g.checkUnicode (after);
		return tuple ([before, sel, after]);
	});},
	get getSelectionLines () {return __get__ (this, function (self) {
		if (g.app.batchMode) {
			return tuple (['', '', '']);
		}
		var body = self;
		var w = body.wrapper;
		var s = w.getAllText ();
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		if (i == j) {
			var __left0__ = g.getLine (s, i);
			var i = __left0__ [0];
			var j = __left0__ [1];
		}
		else {
			if (j > i && j > 0 && s [j - 1] == '\n') {
				j--;
			}
			var __left0__ = g.getLine (s, i);
			var i = __left0__ [0];
			var junk = __left0__ [1];
			var __left0__ = g.getLine (s, j);
			var junk = __left0__ [0];
			var j = __left0__ [1];
		}
		var before = g.checkUnicode (s.__getslice__ (0, i, 1));
		var sel = g.checkUnicode (s.__getslice__ (i, j, 1));
		var after = g.checkUnicode (s.__getslice__ (j, len (s), 1));
		return tuple ([before, sel, after]);
	});},
	get onBodyChanged () {return __get__ (this, function (self, undoType, oldSel) {
		if (typeof oldSel == 'undefined' || (oldSel != null && oldSel.hasOwnProperty ("__kwargtrans__"))) {;
			var oldSel = null;
		};
		var __left0__ = tuple ([self.c.p, self.c.undoer, self.wrapper]);
		var p = __left0__ [0];
		var u = __left0__ [1];
		var w = __left0__ [2];
		var newText = w.getAllText ();
		if (p.b == newText) {
			return ;
		}
		var newSel = w.getSelectionRange ();
		var newInsert = w.getInsertPoint ();
		if (oldSel && newSel && oldSel != newSel) {
			var __left0__ = oldSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: j}));
		}
		var bunch = u.beforeChangeBody (p);
		if (oldSel && newSel && oldSel != newSel) {
			var __left0__ = newSel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: newInsert}));
		}
		p.v.b = newText;
		u.afterChangeBody (p, undoType, bunch);
	});}
});
export var LeoFrame =  __class__ ('LeoFrame', [object], {
	__module__: __name__,
	instances: 0,
	get __init__ () {return __get__ (this, function (self, c, gui) {
		self.c = c;
		self.gui = gui;
		self.iconBarClass = NullIconBarClass;
		self.statusLineClass = NullStatusLineClass;
		self.title = null;
		self.body = null;
		self.colorPanel = null;
		self.comparePanel = null;
		self.findPanel = null;
		self.fontPanel = null;
		self.iconBar = null;
		self.isNullFrame = false;
		self.py_keys = null;
		self.log = null;
		self.menu = null;
		self.miniBufferWidget = null;
		self.outerFrame = null;
		self.prefsPanel = null;
		self.statusLine = g.NullObject ();
		self.tree = null;
		self.useMiniBufferWidget = false;
		self.cursorStay = true;
		self.componentsDict = dict ({});
		self.es_newlines = 0;
		self.openDirectory = '';
		self.saved = false;
		self.splitVerticalFlag = true;
		self.startupWindow = false;
		self.stylesheet = null;
		self.tab_width = 0;
	});},
	get createFirstTreeNode () {return __get__ (this, function (self) {
		var c = self.c;
		var v = leoNodes.VNode (__kwargtrans__ ({context: c}));
		var p = leoNodes.Position (v);
		v.initHeadString ('NewHeadline');
		c.hiddenRootNode.children = [];
		p._linkAsRoot ();
	});},
	get cmd () {return __get__ (this, function (py_name) {
		return g.new_cmd_decorator (py_name, ['c', 'frame']);
	});},
	get OnBodyClick () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get OnBodyRClick () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get getTitle () {return __get__ (this, function (self) {
		return self.title;
	});},
	get setTitle () {return __get__ (this, function (self, title) {
		self.title = title;
	});},
	get initAfterLoad () {return __get__ (this, function (self) {
		var frame = self;
		frame.body.initAfterLoad ();
		frame.log.initAfterLoad ();
		frame.menu.initAfterLoad ();
		frame.tree.initAfterLoad ();
	});},
	get initCompleteHint () {return __get__ (this, function (self) {
		// pass;
	});},
	get setTabWidth () {return __get__ (this, function (self, w) {
		self.tab_width = w;
	});},
	get initialRatios () {return __get__ (this, function (self) {
		var c = self.c;
		var s = c.config.py_get ('initial_split_orientation', 'string');
		var verticalFlag = s === null || s != 'h' && s != 'horizontal';
		if (verticalFlag) {
			var r = c.config.getRatio ('initial-vertical-ratio');
			if (r === null || r < 0.0 || r > 1.0) {
				var r = 0.5;
			}
			var r2 = c.config.getRatio ('initial-vertical-secondary-ratio');
			if (r2 === null || r2 < 0.0 || r2 > 1.0) {
				var r2 = 0.8;
			}
		}
		else {
			var r = c.config.getRatio ('initial-horizontal-ratio');
			if (r === null || r < 0.0 || r > 1.0) {
				var r = 0.3;
			}
			var r2 = c.config.getRatio ('initial-horizontal-secondary-ratio');
			if (r2 === null || r2 < 0.0 || r2 > 1.0) {
				var r2 = 0.8;
			}
		}
		return tuple ([verticalFlag, r, r2]);
	});},
	get longFileName () {return __get__ (this, function (self) {
		return self.c.mFileName;
	});},
	get shortFileName () {return __get__ (this, function (self) {
		return g.shortFileName (self.c.mFileName);
	});},
	get oops () {return __get__ (this, function (self) {
		g.pr ('LeoFrame oops:', g.callers (4), 'should be overridden in subclass');
	});},
	get promptForSave () {return __get__ (this, function (self) {
		var c = self.c;
		var theType = (g.app.quitting ? 'quitting?' : 'closing?');
		var root = c.rootPosition ();
		var quick_save = !(c.mFileName) && !(root.py_next ()) && root.isAtEditNode ();
		if (quick_save) {
			var py_name = g.shortFileName (root.atEditNodeName ());
		}
		else {
			var py_name = (c.mFileName ? c.mFileName : self.title);
		}
		var answer = g.app.gui.runAskYesNoCancelDialog (c, __kwargtrans__ ({title: 'Confirm', message: 'Save changes to {} before {}'.format (g.splitLongFileName (py_name), theType)}));
		if (answer == 'cancel') {
			return true;
		}
		if (answer == 'no') {
			return false;
		}
		if (!(c.mFileName)) {
			var root = c.rootPosition ();
			if (!(root.py_next ()) && root.isAtEditNode ()) {
				if (root.isDirty ()) {
					c.atFileCommands.writeOneAtEditNode (root);
				}
				return false;
			}
			c.mFileName = g.app.gui.runSaveFileDialog (c, __kwargtrans__ ({initialfile: '', title: 'Save', filetypes: [tuple (['Leo files', '*.leo'])], defaultextension: '.leo'}));
			c.bringToFront ();
		}
		if (c.mFileName) {
			if (g.app.gui.guiName () == 'curses') {
				g.pr ('Saving: {}'.format (c.mFileName));
			}
			var ok = c.fileCommands.save (c.mFileName);
			return !(ok);
		}
		return true;
	});},
	get scanForTabWidth () {return __get__ (this, function (self, p) {
		var c = self.c;
		var tab_width = c.getTabWidth (p);
		c.frame.setTabWidth (tab_width);
	});},
	get addIconButton () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		if (self.iconBar) {
			return self.iconBar.add (...args, __kwargtrans__ (py_keys));
		}
		return null;
	});},
	get addIconRow () {return __get__ (this, function (self) {
		if (self.iconBar) {
			return self.iconBar.addRow ();
		}
		return null;
	});},
	get addIconWidget () {return __get__ (this, function (self, w) {
		if (self.iconBar) {
			return self.iconBar.addWidget (w);
		}
		return null;
	});},
	get clearIconBar () {return __get__ (this, function (self) {
		if (self.iconBar) {
			return self.iconBar.py_clear ();
		}
		return null;
	});},
	get createIconBar () {return __get__ (this, function (self) {
		var c = self.c;
		if (!(self.iconBar)) {
			self.iconBar = self.iconBarClass (c, self.outerFrame);
		}
		return self.iconBar;
	});},
	get getIconBar () {return __get__ (this, function (self) {
		if (!(self.iconBar)) {
			self.iconBar = self.iconBarClass (self.c, self.outerFrame);
		}
		return self.iconBar;
	});},
	getIconBarObject: getIconBar,
	get getNewIconFrame () {return __get__ (this, function (self) {
		if (!(self.iconBar)) {
			self.iconBar = self.iconBarClass (self.c, self.outerFrame);
		}
		return self.iconBar.getNewFrame ();
	});},
	get hideIconBar () {return __get__ (this, function (self) {
		if (self.iconBar) {
			self.iconBar.hide ();
		}
	});},
	get showIconBar () {return __get__ (this, function (self) {
		if (self.iconBar) {
			self.iconBar.show ();
		}
	});},
	get createStatusLine () {return __get__ (this, function (self) {
		if (!(self.statusLine)) {
			self.statusLine = self.statusLineClass (self.c, self.outerFrame);
		}
		return self.statusLine;
	});},
	get clearStatusLine () {return __get__ (this, function (self) {
		if (self.statusLine) {
			self.statusLine.py_clear ();
		}
	});},
	get disableStatusLine () {return __get__ (this, function (self, background) {
		if (typeof background == 'undefined' || (background != null && background.hasOwnProperty ("__kwargtrans__"))) {;
			var background = null;
		};
		if (self.statusLine) {
			self.statusLine.disable (background);
		}
	});},
	get enableStatusLine () {return __get__ (this, function (self, background) {
		if (typeof background == 'undefined' || (background != null && background.hasOwnProperty ("__kwargtrans__"))) {;
			var background = 'white';
		};
		if (self.statusLine) {
			self.statusLine.enable (background);
		}
	});},
	get getStatusLine () {return __get__ (this, function (self) {
		return self.statusLine;
	});},
	getStatusObject: getStatusLine,
	get putStatusLine () {return __get__ (this, function (self, s, bg, fg) {
		if (typeof bg == 'undefined' || (bg != null && bg.hasOwnProperty ("__kwargtrans__"))) {;
			var bg = null;
		};
		if (typeof fg == 'undefined' || (fg != null && fg.hasOwnProperty ("__kwargtrans__"))) {;
			var fg = null;
		};
		if (self.statusLine) {
			self.statusLine.put (s, bg, fg);
		}
	});},
	get setFocusStatusLine () {return __get__ (this, function (self) {
		if (self.statusLine) {
			self.statusLine.setFocus ();
		}
	});},
	get statusLineIsEnabled () {return __get__ (this, function (self) {
		if (self.statusLine) {
			return self.statusLine.isEnabled ();
		}
		return false;
	});},
	get updateStatusLine () {return __get__ (this, function (self) {
		if (self.statusLine) {
			self.statusLine.py_update ();
		}
	});},
	get copyText () {return __get__ (this, cmd ('copy-text') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var w = event && event.widget;
		if (!(w) || !(g.isTextWrapper (w))) {
			return ;
		}
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		if (i == j) {
			var ins = w.getInsertPoint ();
			var __left0__ = g.getLine (w.getAllText (), ins);
			var i = __left0__ [0];
			var j = __left0__ [1];
		}
		var s = w.py_get (i, j);
		if (s) {
			g.app.gui.replaceClipboardWith (s);
		}
	}));},
	OnCopyFromMenu: copyText,
	get cutText () {return __get__ (this, cmd ('cut-text') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var f = self;
		var c = f.c;
		var w = event && event.widget;
		if (!(w) || !(g.isTextWrapper (w))) {
			return ;
		}
		var py_name = c.widget_name (w);
		var oldSel = w.getSelectionRange ();
		var oldText = w.getAllText ();
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		var s = w.py_get (i, j);
		if (i != j) {
			w.delete (i, j);
			w.see (i);
			g.app.gui.replaceClipboardWith (s);
		}
		else {
			var ins = w.getInsertPoint ();
			var __left0__ = g.getLine (oldText, ins);
			var i = __left0__ [0];
			var j = __left0__ [1];
			var s = w.py_get (i, j);
			w.delete (i, j);
			w.see (i);
			g.app.gui.replaceClipboardWith (s);
		}
		if (py_name.startswith ('body')) {
			c.frame.body.onBodyChanged ('Cut', __kwargtrans__ ({oldSel: oldSel}));
		}
		else if (py_name.startswith ('head')) {
			var s = w.getAllText ();
		}
		else {
			// pass;
		}
	}));},
	OnCutFromMenu: cutText,
	get pasteText () {return __get__ (this, cmd ('paste-text') (function (self, event, middleButton) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof middleButton == 'undefined' || (middleButton != null && middleButton.hasOwnProperty ("__kwargtrans__"))) {;
			var middleButton = false;
		};
		var c = self.c;
		var w = event && event.widget;
		var wname = c.widget_name (w);
		if (!(w) || !(g.isTextWrapper (w))) {
			return ;
		}
		if (self.cursorStay && wname.startswith ('body')) {
			var tCurPosition = w.getInsertPoint ();
		}
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		var oldSel = __left0__;
		if (middleButton && c.k.previousSelection !== null) {
			var __left0__ = c.k.previousSelection;
			var start = __left0__ [0];
			var end = __left0__ [1];
			var s = w.getAllText ();
			var s = s.__getslice__ (start, end, 1);
			c.k.previousSelection = null;
		}
		else {
			var s = g.app.gui.getTextFromClipboard ();
		}
		var s = g.checkUnicode (s);
		var singleLine = wname.startswith ('head') || wname.startswith ('minibuffer');
		if (singleLine) {
			while (s && __in__ (s [-(1)], tuple (['\n', '\r']))) {
				var s = s.__getslice__ (0, -(1), 1);
			}
		}
		if (hasattr (w, 'getXScrollPosition')) {
			var x_pos = w.getXScrollPosition ();
		}
		if (i != j) {
			w.delete (i, j);
		}
		w.insert (i, s);
		w.see ((i + len (s)) + 2);
		if (wname.startswith ('body')) {
			if (self.cursorStay) {
				if (tCurPosition == j) {
					var offset = len (s) - (j - i);
				}
				else {
					var offset = 0;
				}
				var newCurPosition = tCurPosition + offset;
				w.setSelectionRange (__kwargtrans__ ({i: newCurPosition, j: newCurPosition}));
			}
			c.frame.body.onBodyChanged ('Paste', __kwargtrans__ ({oldSel: oldSel}));
		}
		else if (singleLine) {
			var s = w.getAllText ();
			while (s && __in__ (s [-(1)], tuple (['\n', '\r']))) {
				var s = s.__getslice__ (0, -(1), 1);
			}
		}
		else {
			// pass;
		}
		if (hasattr (w, 'getXScrollPosition')) {
			w.setXScrollPosition (x_pos);
		}
	}));},
	OnPasteFromMenu: pasteText,
	get OnPaste () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		return self.pasteText (__kwargtrans__ ({event: event, middleButton: true}));
	});},
	get endEditLabelCommand () {return __get__ (this, cmd ('end-edit-headline') (function (self, event, p) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		var frame = self;
		var c = frame.c;
		var k = c.k;
		if (g.app.batchMode) {
			c.notValidInBatchMode ('End Edit Headline');
			return ;
		}
		var w = event && event.w || c.get_focus ();
		var w_name = g.app.gui.widget_name (w);
		if (w_name.startswith ('head')) {
			c.endEditing ();
			c.treeWantsFocus ();
		}
		else {
			c.bodyWantsFocus ();
			k.setDefaultInputState ();
			k.showStateAndMode (__kwargtrans__ ({w: c.frame.body.wrapper}));
		}
	}));},
	get bringToFront () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get cascade () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get contractBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get contractLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get contractOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get contractPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get deiconify () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get equalSizedPanes () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get expandBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get expandLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get expandOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get expandPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get fullyExpandBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get fullyExpandLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get fullyExpandOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get fullyExpandPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get get_window_info () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get hideBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get hideLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get hideLogWindow () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get hideOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get hidePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get leoHelp () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get lift () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get minimizeAll () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get resizePanesToRatio () {return __get__ (this, function (self, ratio, secondary_ratio) {
		self.oops ();
	});},
	get resizeToScreen () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get setInitialWindowGeometry () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get setTopGeometry () {return __get__ (this, function (self, w, h, x, y) {
		self.oops ();
	});},
	get toggleActivePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});},
	get toggleSplitDirection () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.oops ();
	});}
});
export var LeoLog =  __class__ ('LeoLog', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame, parentFrame) {
		self.frame = frame;
		self.c = (frame ? frame.c : null);
		self.enabled = true;
		self.newlines = 0;
		self.isNull = false;
		self.canvasCtrl = null;
		self.logCtrl = null;
		self.tabName = null;
		self.tabFrame = null;
		self.canvasDict = dict ({});
		self.frameDict = dict ({});
		self.logNumber = 0;
		self.newTabCount = 0;
		self.textDict = dict ({});
	});},
	get cmd () {return __get__ (this, function (py_name) {
		return g.new_cmd_decorator (py_name, ['c', 'frame', 'log']);
	});},
	get clearTab () {return __get__ (this, function (self, tabName, wrap) {
		if (typeof wrap == 'undefined' || (wrap != null && wrap.hasOwnProperty ("__kwargtrans__"))) {;
			var wrap = 'none';
		};
		self.selectTab (tabName, __kwargtrans__ ({wrap: wrap}));
		var w = self.logCtrl;
		if (w) {
			w.delete (0, 'end');
		}
	});},
	get createTab () {return __get__ (this, function (self, tabName, createText, widget, wrap) {
		if (typeof createText == 'undefined' || (createText != null && createText.hasOwnProperty ("__kwargtrans__"))) {;
			var createText = true;
		};
		if (typeof widget == 'undefined' || (widget != null && widget.hasOwnProperty ("__kwargtrans__"))) {;
			var widget = null;
		};
		if (typeof wrap == 'undefined' || (wrap != null && wrap.hasOwnProperty ("__kwargtrans__"))) {;
			var wrap = 'none';
		};
		if (createText) {
			var w = self.createTextWidget (self.tabFrame);
			self.canvasDict [tabName] = null;
			self.textDict [tabName] = w;
		}
		else {
			self.canvasDict [tabName] = null;
			self.textDict [tabName] = null;
			self.frameDict [tabName] = tabName;
		}
	});},
	get createTextWidget () {return __get__ (this, function (self, parentFrame) {
		return null;
	});},
	get deleteTab () {return __get__ (this, function (self, tabName, force) {
		if (typeof force == 'undefined' || (force != null && force.hasOwnProperty ("__kwargtrans__"))) {;
			var force = false;
		};
		var c = self.c;
		if (tabName == 'Log') {
			// pass;
		}
		else if (__in__ (tabName, tuple (['Find', 'Spell'])) && !(force)) {
			self.selectTab ('Log');
		}
		else {
			for (var d of tuple ([self.canvasDict, self.textDict, self.frameDict])) {
				if (__in__ (tabName, d)) {
					delete d [tabName];
				}
			}
			self.tabName = null;
			self.selectTab ('Log');
		}
		c.invalidateFocus ();
		c.bodyWantsFocus ();
	});},
	get disable () {return __get__ (this, function (self) {
		self.enabled = false;
	});},
	get enable () {return __get__ (this, function (self, enabled) {
		if (typeof enabled == 'undefined' || (enabled != null && enabled.hasOwnProperty ("__kwargtrans__"))) {;
			var enabled = true;
		};
		self.enabled = enabled;
	});},
	get getSelectedTab () {return __get__ (this, function (self) {
		return self.tabName;
	});},
	get hideTab () {return __get__ (this, function (self, tabName) {
		self.selectTab ('Log');
	});},
	get lowerTab () {return __get__ (this, function (self, tabName) {
		self.c.invalidateFocus ();
		self.c.bodyWantsFocus ();
	});},
	get raiseTab () {return __get__ (this, function (self, tabName) {
		self.c.invalidateFocus ();
		self.c.bodyWantsFocus ();
	});},
	get orderedTabNames () {return __get__ (this, function (self, LeoLog) {
		if (typeof LeoLog == 'undefined' || (LeoLog != null && LeoLog.hasOwnProperty ("__kwargtrans__"))) {;
			var LeoLog = null;
		};
		return list (self.frameDict.py_values ());
	});},
	get numberOfVisibleTabs () {return __get__ (this, function (self) {
		return len ((function () {
			var __accu0__ = [];
			for (var val of list (self.frameDict.py_values ())) {
				if (val !== null) {
					__accu0__.append (val);
				}
			}
			return __accu0__;
		}) ());
	});},
	get put () {return __get__ (this, function (self, s, color, tabName, from_redirect, nodeLink) {
		if (typeof color == 'undefined' || (color != null && color.hasOwnProperty ("__kwargtrans__"))) {;
			var color = null;
		};
		if (typeof tabName == 'undefined' || (tabName != null && tabName.hasOwnProperty ("__kwargtrans__"))) {;
			var tabName = 'Log';
		};
		if (typeof from_redirect == 'undefined' || (from_redirect != null && from_redirect.hasOwnProperty ("__kwargtrans__"))) {;
			var from_redirect = false;
		};
		if (typeof nodeLink == 'undefined' || (nodeLink != null && nodeLink.hasOwnProperty ("__kwargtrans__"))) {;
			var nodeLink = null;
		};
		print (s);
	});},
	get putnl () {return __get__ (this, function (self, tabName) {
		if (typeof tabName == 'undefined' || (tabName != null && tabName.hasOwnProperty ("__kwargtrans__"))) {;
			var tabName = 'Log';
		};
		// pass;
	});},
	get renameTab () {return __get__ (this, function (self, oldName, newName) {
		// pass;
	});},
	get selectTab () {return __get__ (this, function (self, tabName, createText, widget, wrap) {
		if (typeof createText == 'undefined' || (createText != null && createText.hasOwnProperty ("__kwargtrans__"))) {;
			var createText = true;
		};
		if (typeof widget == 'undefined' || (widget != null && widget.hasOwnProperty ("__kwargtrans__"))) {;
			var widget = null;
		};
		if (typeof wrap == 'undefined' || (wrap != null && wrap.hasOwnProperty ("__kwargtrans__"))) {;
			var wrap = 'none';
		};
		var c = self.c;
		var tabFrame = self.frameDict.py_get (tabName);
		if (!(tabFrame)) {
			self.createTab (tabName, __kwargtrans__ ({createText: createText}));
		}
		self.tabName = tabName;
		self.canvasCtrl = self.canvasDict.py_get (tabName);
		self.logCtrl = self.textDict.py_get (tabName);
		self.tabFrame = self.frameDict.py_get (tabName);
		if (0) {
			c.widgetWantsFocusNow (self.logCtrl);
		}
		return tabFrame;
	});}
});
export var LeoTree =  __class__ ('LeoTree', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame) {
		self.frame = frame;
		self.c = frame.c;
		self.edit_text_dict = dict ({});
		self.drag_p = null;
		self.generation = 0;
		self.redrawCount = 0;
		self.use_chapters = false;
		self.canvas = null;
	});},
	get initAfterLoad () {return __get__ (this, function (self) {
	});},
	get redraw_after_contract () {return __get__ (this, function (self, p) {
		self.c.redraw ();
	});},
	get redraw_after_expand () {return __get__ (this, function (self, p) {
		self.c.redraw ();
	});},
	get redraw_after_head_changed () {return __get__ (this, function (self) {
		self.c.redraw ();
	});},
	get redraw_after_icons_changed () {return __get__ (this, function (self) {
		self.c.redraw ();
	});},
	get redraw_after_select () {return __get__ (this, function (self, p) {
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		self.c.redraw ();
	});},
	get onHeadChanged () {return __get__ (this, function (self, p, undoType) {
		if (typeof undoType == 'undefined' || (undoType != null && undoType.hasOwnProperty ("__kwargtrans__"))) {;
			var undoType = 'Typing';
		};
		var __left0__ = tuple ([self.c, self.c.undoer, self.edit_widget (p)]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = __left0__ [2];
		if (c.suppressHeadChanged) {
			g.trace ('suppressHeadChanged');
			return ;
		}
		if (!(w)) {
			g.trace ('no w');
			return ;
		}
		var ch = '\n';
		var s = w.getAllText ();
		while (s && s [-(1)] == '\n') {
			var s = s.__getslice__ (0, -(1), 1);
		}
		var i = s.find ('\n');
		if (i > -(1)) {
			g.warning ('truncating headline to one line');
			var s = s.__getslice__ (0, i, 1);
		}
		var limit = 1000;
		if (len (s) > limit) {
			g.warning ('truncating headline to', limit, 'characters');
			var s = s.__getslice__ (0, limit, 1);
		}
		var s = g.checkUnicode (s || '');
		var changed = s != p.h;
		if (!(changed)) {
			return ;
		}
		if (g.doHook ('headkey1', __kwargtrans__ ({c: c, p: p, ch: ch, changed: changed}))) {
			return ;
		}
		var undoData = u.beforeChangeHeadline (p);
		p.initHeadString (s);
		if (!(c.changed)) {
			c.setChanged ();
		}
		c.frame.scanForTabWidth (p);
		c.frame.body.recolor (p);
		p.setDirty ();
		u.afterChangeHeadline (p, undoType, undoData);
		c.redraw_after_head_changed ();
		g.doHook ('headkey2', __kwargtrans__ ({c: c, p: p, ch: ch, changed: changed}));
	});},
	get endEditLabel () {return __get__ (this, function (self) {
		self.onHeadChanged (self.c.p);
	});},
	get getEditTextDict () {return __get__ (this, function (self, v) {
		return self.edit_text_dict.py_get (v, []);
	});},
	get onHeadlineKey () {return __get__ (this, function (self, event) {
		var w = (event ? event.widget : null);
		var ch = (event ? event.char : '');
		if (ch) {
			self.updateHead (event, w);
		}
	});},
	get OnIconCtrlClick () {return __get__ (this, function (self, p) {
		g.openUrl (p);
	});},
	get OnIconDoubleClick () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get updateHead () {return __get__ (this, function (self, event, w) {
		var k = self.c.k;
		var ch = (event ? event.char : '');
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		var ins = w.getInsertPoint ();
		if (i != j) {
			var ins = i;
		}
		if (__in__ (ch, tuple (['\x08', 'BackSpace']))) {
			if (i != j) {
				w.delete (i, j);
				w.setSelectionRange (i, i, __kwargtrans__ ({insert: i}));
			}
			else if (i > 0) {
				i--;
				w.delete (i);
				w.setSelectionRange (i, i, __kwargtrans__ ({insert: i}));
			}
			else {
				w.setSelectionRange (0, 0, __kwargtrans__ ({insert: 0}));
			}
		}
		else if (ch && !__in__ (ch, tuple (['\n', '\r']))) {
			if (i != j) {
				w.delete (i, j);
			}
			else if (k.unboundKeyAction == 'overwrite') {
				w.delete (i, i + 1);
			}
			w.insert (ins, ch);
			w.setSelectionRange (ins + 1, ins + 1, __kwargtrans__ ({insert: ins + 1}));
		}
		var s = w.getAllText ();
		if (s.endswith ('\n')) {
			var s = s.__getslice__ (0, -(1), 1);
		}
		if (__in__ (ch, tuple (['\n', '\r']))) {
			self.endEditLabel ();
		}
	});},
	get drawIcon () {return __get__ (this, function (self, p) {
		self.oops ();
	});},
	get redraw () {return __get__ (this, function (self, p) {
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		self.oops ();
	});},
	redraw_now: redraw,
	get scrollTo () {return __get__ (this, function (self, p) {
		self.oops ();
	});},
	get editLabel () {return __get__ (this, function (self, p, selectAll, selection) {
		if (typeof selectAll == 'undefined' || (selectAll != null && selectAll.hasOwnProperty ("__kwargtrans__"))) {;
			var selectAll = false;
		};
		if (typeof selection == 'undefined' || (selection != null && selection.hasOwnProperty ("__kwargtrans__"))) {;
			var selection = null;
		};
		self.oops ();
	});},
	get edit_widget () {return __get__ (this, function (self, p) {
		self.oops ();
	});},
	tree_select_lockout: false,
	get select () {return __get__ (this, function (self, p) {
		var trace = __in__ ('select', g.app.debug) && !(g.unitTesting);
		var tag = 'LeoTree.select';
		var c = self.c;
		if (g.app.killed || self.tree_select_lockout) {
			return ;
		}
		if (trace) {
			print ('----- {}: {}'.format (tag, p.h));
		}
		try {
			self.tree_select_lockout = true;
			self.prev_v = c.p.v;
			self.selectHelper (p);
		}
		finally {
			self.tree_select_lockout = false;
			if (c.enableRedrawFlag) {
				var p = c.p;
				if (c.expandAllAncestors (p) && !(g.unitTesting)) {
					c.redraw_later ();
				}
				else {
					c.outerUpdate ();
					if (hasattr (self, 'setItemForCurrentPosition')) {
						self.setItemForCurrentPosition ();
					}
				}
			}
			else {
				c.requestLaterRedraw = true;
			}
		}
	});},
	get selectHelper () {return __get__ (this, function (self, p) {
		if (!(p)) {
			return ;
		}
		var c = self.c;
		if (!(c.frame.body.wrapper)) {
			return ;
		}
		if (p.v.context != c) {
			g.trace ('Wrong context: {} != {}'.format (p.v.context, c));
			return ;
		}
		var old_p = c.p;
		var call_event_handlers = p != old_p;
		self.unselect_helper (old_p, p);
		self.select_new_node (old_p, p);
		self.change_current_position (old_p, p);
		self.scroll_cursor (p);
		self.set_status_line (p);
		if (call_event_handlers) {
			g.doHook ('select2', __kwargtrans__ ({c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p}));
			g.doHook ('select3', __kwargtrans__ ({c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p}));
		}
	});},
	get unselect_helper () {return __get__ (this, function (self, old_p, p) {
		var c = self.c;
		var call_event_handlers = p != old_p;
		if (call_event_handlers) {
			var unselect = !(g.doHook ('unselect1', __kwargtrans__ ({c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p})));
		}
		else {
			var unselect = true;
		}
		if (unselect && old_p && old_p != p) {
			self.endEditLabel ();
			if (hasattr (self, 'unselectItem')) {
				self.unselectItem (old_p);
			}
		}
		if (call_event_handlers) {
			g.doHook ('unselect2', __kwargtrans__ ({c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p}));
		}
	});},
	get select_new_node () {return __get__ (this, function (self, old_p, p) {
		var c = self.c;
		var call_event_handlers = p != old_p;
		if (call_event_handlers && g.doHook ('select1', __kwargtrans__ ({c: c, new_p: p, old_p: old_p, new_v: p, old_v: old_p}))) {
			if (__in__ ('select', g.app.debug)) {
				g.trace ('select1 override');
			}
			return ;
		}
		c.frame.setWrap (p);
		self.set_body_text_after_select (p, old_p);
		c.nodeHistory.py_update (p);
	});},
	get set_body_text_after_select () {return __get__ (this, function (self, p, old_p, force) {
		if (typeof force == 'undefined' || (force != null && force.hasOwnProperty ("__kwargtrans__"))) {;
			var force = false;
		};
		var c = self.c;
		var w = c.frame.body.wrapper;
		var s = p.v.b;
		var old_s = w.getAllText ();
		if (!(force) && p && p == old_p && s == old_s) {
			return ;
		}
		c.setCurrentPosition (p);
		w.setAllText (s);
	});},
	get change_current_position () {return __get__ (this, function (self, old_p, p) {
		var c = self.c;
		c.frame.scanForTabWidth (p);
		var use_chapters = c.config.getBool ('use-chapters');
		if (use_chapters) {
			var cc = c.chapterController;
			var theChapter = cc && cc.getSelectedChapter ();
			if (theChapter) {
				theChapter.p = p.copy ();
			}
		}
		c.undoer.onSelect (old_p, p);
	});},
	get scroll_cursor () {return __get__ (this, function (self, p) {
		p.restoreCursorAndScroll ();
	});},
	get set_status_line () {return __get__ (this, function (self, p) {
		var c = self.c;
		c.frame.body.assignPositionToEditor (p);
		c.frame.updateStatusLine ();
		c.frame.clearStatusLine ();
		var verbose = getattr (c, 'status_line_unl_mode', '') == 'canonical';
		if (p && p.v) {
			c.frame.putStatusLine (p.get_UNL (__kwargtrans__ ({with_proto: verbose, with_index: verbose})));
		}
	});},
	get oops () {return __get__ (this, function (self) {
		g.pr ('LeoTree oops:', g.callers (4), 'should be overridden in subclass');
	});}
});
export var LeoTreeTab =  __class__ ('LeoTreeTab', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, chapterController, parentFrame) {
		self.c = c;
		self.cc = chapterController;
		self.nb = null;
		self.parentFrame = parentFrame;
	});},
	get createControl () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get createTab () {return __get__ (this, function (self, tabName, select) {
		if (typeof select == 'undefined' || (select != null && select.hasOwnProperty ("__kwargtrans__"))) {;
			var select = true;
		};
		self.oops ();
	});},
	get destroyTab () {return __get__ (this, function (self, tabName) {
		self.oops ();
	});},
	get selectTab () {return __get__ (this, function (self, tabName) {
		self.oops ();
	});},
	get setTabLabel () {return __get__ (this, function (self, tabName) {
		self.oops ();
	});},
	get oops () {return __get__ (this, function (self) {
		g.pr ('LeoTreeTree oops:', g.callers (4), 'should be overridden in subclass');
	});}
});
export var NullBody =  __class__ ('NullBody', [LeoBody], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame, parentFrame) {
		if (typeof frame == 'undefined' || (frame != null && frame.hasOwnProperty ("__kwargtrans__"))) {;
			var frame = null;
		};
		if (typeof parentFrame == 'undefined' || (parentFrame != null && parentFrame.hasOwnProperty ("__kwargtrans__"))) {;
			var parentFrame = null;
		};
		__super__ (NullBody, '__init__') (self, frame, parentFrame);
		self.insertPoint = 0;
		self.selection = tuple ([0, 0]);
		self.s = '';
		self.widget = null;
		var __left0__ = StringTextWrapper (__kwargtrans__ ({c: self.c, py_name: 'body'}));
		self.wrapper = __left0__;
		var wrapper = __left0__;
		self.editorWrappers ['1'] = wrapper;
		self.colorizer = NullColorizer (self.c);
	});},
	get createControl () {return __get__ (this, function (self, parentFrame, p) {
		// pass;
	});},
	get addEditor () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get assignPositionToEditor () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get createEditorFrame () {return __get__ (this, function (self, w) {
		return null;
	});},
	get cycleEditorFocus () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get deleteEditor () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get selectEditor () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get selectLabel () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get setEditorColors () {return __get__ (this, function (self, bg, fg) {
		// pass;
	});},
	get unselectLabel () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get updateEditors () {return __get__ (this, function (self) {
		// pass;
	});},
	get forceFullRecolor () {return __get__ (this, function (self) {
		// pass;
	});},
	get scheduleIdleTimeRoutine () {return __get__ (this, function (self, function) {
		var args = tuple ([].slice.apply (arguments).slice (2));
		// pass;
	});},
	get setFocus () {return __get__ (this, function (self) {
		// pass;
	});}
});
export var NullColorizer =  __class__ ('NullColorizer', [leoColorizer.BaseColorizer], {
	__module__: __name__,
	recolorCount: 0,
	get colorize () {return __get__ (this, function (self, p) {
		self.recolorCount++;
	});}
});
export var NullFrame =  __class__ ('NullFrame', [LeoFrame], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, title, gui) {
		__super__ (NullFrame, '__init__') (self, c, gui);
		self.wrapper = null;
		self.iconBar = NullIconBarClass (self.c, self);
		self.initComplete = true;
		self.isNullFrame = true;
		self.outerFrame = null;
		var __left0__ = 0.5;
		self.ratio = __left0__;
		self.secondary_ratio = __left0__;
		self.statusLineClass = NullStatusLineClass;
		self.title = title;
		self.top = null;
		self.body = NullBody (__kwargtrans__ ({frame: self, parentFrame: null}));
		self.log = NullLog (__kwargtrans__ ({frame: self, parentFrame: null}));
		self.menu = leoMenu.NullMenu (__kwargtrans__ ({frame: self}));
		self.tree = NullTree (__kwargtrans__ ({frame: self}));
		self.w = 600;
		self.h = 500;
		self.x = 40;
		self.y = 40;
	});},
	get bringToFront () {return __get__ (this, function (self) {
		// pass;
	});},
	get cascade () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get contractBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get contractLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get contractOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get contractPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get deiconify () {return __get__ (this, function (self) {
		// pass;
	});},
	get destroySelf () {return __get__ (this, function (self) {
		// pass;
	});},
	get equalSizedPanes () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get expandBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get expandLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get expandOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get expandPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get fullyExpandBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get fullyExpandLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get fullyExpandOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get fullyExpandPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get get_window_info () {return __get__ (this, function (self) {
		return tuple ([600, 500, 20, 20]);
	});},
	get hideBodyPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get hideLogPane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get hideLogWindow () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get hideOutlinePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get hidePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get leoHelp () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get lift () {return __get__ (this, function (self) {
		// pass;
	});},
	get minimizeAll () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get oops () {return __get__ (this, function (self) {
		g.trace ('NullFrame', g.callers (4));
	});},
	get resizePanesToRatio () {return __get__ (this, function (self, ratio, secondary_ratio) {
		// pass;
	});},
	get resizeToScreen () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get setInitialWindowGeometry () {return __get__ (this, function (self) {
		// pass;
	});},
	get setTopGeometry () {return __get__ (this, function (self, w, h, x, y) {
		return tuple ([0, 0, 0, 0]);
	});},
	get setWrap () {return __get__ (this, function (self, flag, force) {
		if (typeof force == 'undefined' || (force != null && force.hasOwnProperty ("__kwargtrans__"))) {;
			var force = false;
		};
		// pass;
	});},
	get toggleActivePane () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get toggleSplitDirection () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		// pass;
	});},
	get py_update () {return __get__ (this, function (self) {
		// pass;
	});},
	get finishCreate () {return __get__ (this, function (self) {
		self.createFirstTreeNode ();
	});}
});
export var NullIconBarClass =  __class__ ('NullIconBarClass', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, parentFrame) {
		self.c = c;
		self.iconFrame = null;
		self.parentFrame = parentFrame;
		self.w = g.NullObject ();
	});},
	get addRow () {return __get__ (this, function (self, height) {
		if (typeof height == 'undefined' || (height != null && height.hasOwnProperty ("__kwargtrans__"))) {;
			var height = null;
		};
		// pass;
	});},
	get addRowIfNeeded () {return __get__ (this, function (self) {
		// pass;
	});},
	get addWidget () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get createChaptersIcon () {return __get__ (this, function (self) {
		// pass;
	});},
	get deleteButton () {return __get__ (this, function (self, w) {
		// pass;
	});},
	get getNewFrame () {return __get__ (this, function (self) {
		return null;
	});},
	get hide () {return __get__ (this, function (self) {
		// pass;
	});},
	get show () {return __get__ (this, function (self) {
		// pass;
	});},
	get add () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		var command = py_keys.py_get ('command');
		var text = py_keys.py_get ('text');
		try {
			g.app.iconWidgetCount++;
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.app.iconWidgetCount = 1;
			}
			else {
				throw __except0__;
			}
		}
		var n = g.app.iconWidgetCount;
		var py_name = 'nullButtonWidget {}'.format (n);
		if (!(command)) {
			var commandCallback = function (py_name) {
				if (typeof py_name == 'undefined' || (py_name != null && py_name.hasOwnProperty ("__kwargtrans__"))) {;
					var py_name = py_name;
				};
				g.pr ('command for {}'.format (py_name));
			};
			var command = commandCallback;
		}
		var nullButtonWidget = __class__ ('nullButtonWidget', [object], {
			__module__: __name__,
			get __init__ () {return __get__ (this, function (self, c, command, py_name, text) {
				self.c = c;
				self.command = command;
				self.py_name = py_name;
				self.text = text;
			});},
			get __repr__ () {return __get__ (this, function (self) {
				return self.py_name;
			});}
		});
		var b = nullButtonWidget (self.c, command, py_name, text);
		return b;
	});},
	get py_clear () {return __get__ (this, function (self) {
		g.app.iconWidgetCount = 0;
		g.app.iconImageRefs = [];
	});},
	get setCommandForButton () {return __get__ (this, function (self, button, command, command_p, controller, gnx, script) {
		button.command = command;
	});}
});
export var NullLog =  __class__ ('NullLog', [LeoLog], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame, parentFrame) {
		if (typeof frame == 'undefined' || (frame != null && frame.hasOwnProperty ("__kwargtrans__"))) {;
			var frame = null;
		};
		if (typeof parentFrame == 'undefined' || (parentFrame != null && parentFrame.hasOwnProperty ("__kwargtrans__"))) {;
			var parentFrame = null;
		};
		__super__ (NullLog, '__init__') (self, frame, parentFrame);
		self.isNull = true;
		self.logNumber = 0;
		self.widget = self.createControl (parentFrame);
	});},
	get finishCreate () {return __get__ (this, function (self) {
		// pass;
	});},
	get createControl () {return __get__ (this, function (self, parentFrame) {
		return self.createTextWidget (parentFrame);
	});},
	get createTextWidget () {return __get__ (this, function (self, parentFrame) {
		self.logNumber++;
		var c = self.c;
		var log = StringTextWrapper (__kwargtrans__ ({c: c, py_name: 'log-{}'.format (self.logNumber)}));
		return log;
	});},
	get hasSelection () {return __get__ (this, function (self) {
		return self.widget.hasSelection ();
	});},
	get isLogWidget () {return __get__ (this, function (self, w) {
		return false;
	});},
	get oops () {return __get__ (this, function (self) {
		g.trace ('NullLog:', g.callers (4));
	});},
	get put () {return __get__ (this, function (self, s, color, tabName, from_redirect, nodeLink) {
		if (typeof color == 'undefined' || (color != null && color.hasOwnProperty ("__kwargtrans__"))) {;
			var color = null;
		};
		if (typeof tabName == 'undefined' || (tabName != null && tabName.hasOwnProperty ("__kwargtrans__"))) {;
			var tabName = 'Log';
		};
		if (typeof from_redirect == 'undefined' || (from_redirect != null && from_redirect.hasOwnProperty ("__kwargtrans__"))) {;
			var from_redirect = false;
		};
		if (typeof nodeLink == 'undefined' || (nodeLink != null && nodeLink.hasOwnProperty ("__kwargtrans__"))) {;
			var nodeLink = null;
		};
		if (self.enabled) {
			try {
				g.pr (s, __kwargtrans__ ({newline: false}));
			}
			catch (__except0__) {
				if (isinstance (__except0__, UnicodeError)) {
					var s = s.encode ('ascii', 'replace');
					g.pr (s, __kwargtrans__ ({newline: false}));
				}
				else {
					throw __except0__;
				}
			}
		}
	});},
	get putnl () {return __get__ (this, function (self, tabName) {
		if (typeof tabName == 'undefined' || (tabName != null && tabName.hasOwnProperty ("__kwargtrans__"))) {;
			var tabName = 'Log';
		};
		if (self.enabled) {
			g.pr ('');
		}
	});},
	get clearTab () {return __get__ (this, function (self, tabName, wrap) {
		if (typeof wrap == 'undefined' || (wrap != null && wrap.hasOwnProperty ("__kwargtrans__"))) {;
			var wrap = 'none';
		};
		// pass;
	});},
	get createCanvas () {return __get__ (this, function (self, tabName) {
		// pass;
	});},
	get createTab () {return __get__ (this, function (self, tabName, createText, widget, wrap) {
		if (typeof createText == 'undefined' || (createText != null && createText.hasOwnProperty ("__kwargtrans__"))) {;
			var createText = true;
		};
		if (typeof widget == 'undefined' || (widget != null && widget.hasOwnProperty ("__kwargtrans__"))) {;
			var widget = null;
		};
		if (typeof wrap == 'undefined' || (wrap != null && wrap.hasOwnProperty ("__kwargtrans__"))) {;
			var wrap = 'none';
		};
		// pass;
	});},
	get deleteTab () {return __get__ (this, function (self, tabName, force) {
		if (typeof force == 'undefined' || (force != null && force.hasOwnProperty ("__kwargtrans__"))) {;
			var force = false;
		};
		// pass;
	});},
	get getSelectedTab () {return __get__ (this, function (self) {
		return null;
	});},
	get lowerTab () {return __get__ (this, function (self, tabName) {
		// pass;
	});},
	get raiseTab () {return __get__ (this, function (self, tabName) {
		// pass;
	});},
	get renameTab () {return __get__ (this, function (self, oldName, newName) {
		// pass;
	});},
	get selectTab () {return __get__ (this, function (self, tabName, createText, widget, wrap) {
		if (typeof createText == 'undefined' || (createText != null && createText.hasOwnProperty ("__kwargtrans__"))) {;
			var createText = true;
		};
		if (typeof widget == 'undefined' || (widget != null && widget.hasOwnProperty ("__kwargtrans__"))) {;
			var widget = null;
		};
		if (typeof wrap == 'undefined' || (wrap != null && wrap.hasOwnProperty ("__kwargtrans__"))) {;
			var wrap = 'none';
		};
		// pass;
	});}
});
export var NullStatusLineClass =  __class__ ('NullStatusLineClass', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, parentFrame) {
		self.c = c;
		self.enabled = false;
		self.parentFrame = parentFrame;
		self.textWidget = StringTextWrapper (c, __kwargtrans__ ({py_name: 'status-line'}));
		c.frame.statusFrame = null;
		c.frame.statusLabel = null;
		c.frame.statusText = self.textWidget;
	});},
	get disable () {return __get__ (this, function (self, background) {
		if (typeof background == 'undefined' || (background != null && background.hasOwnProperty ("__kwargtrans__"))) {;
			var background = null;
		};
		self.enabled = false;
	});},
	get enable () {return __get__ (this, function (self, background) {
		if (typeof background == 'undefined' || (background != null && background.hasOwnProperty ("__kwargtrans__"))) {;
			var background = 'white';
		};
		self.c.widgetWantsFocus (self.textWidget);
		self.enabled = true;
	});},
	get py_clear () {return __get__ (this, function (self) {
		self.textWidget.delete (0, 'end');
	});},
	get py_get () {return __get__ (this, function (self) {
		return self.textWidget.getAllText ();
	});},
	get isEnabled () {return __get__ (this, function (self) {
		return self.enabled;
	});},
	get put () {return __get__ (this, function (self, s, bg, fg) {
		if (typeof bg == 'undefined' || (bg != null && bg.hasOwnProperty ("__kwargtrans__"))) {;
			var bg = null;
		};
		if (typeof fg == 'undefined' || (fg != null && fg.hasOwnProperty ("__kwargtrans__"))) {;
			var fg = null;
		};
		self.textWidget.insert ('end', s);
	});},
	get setFocus () {return __get__ (this, function (self) {
		// pass;
	});},
	get py_update () {return __get__ (this, function (self) {
		// pass;
	});}
});
export var NullTree =  __class__ ('NullTree', [LeoTree], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, frame) {
		__super__ (NullTree, '__init__') (self, frame);
		self.c = frame.c;
		self.editWidgetsDict = dict ({});
		self.font = null;
		self.fontName = null;
		self.canvas = null;
		self.redrawCount = 0;
		self.updateCount = 0;
	});},
	get edit_widget () {return __get__ (this, function (self, p) {
		var d = self.editWidgetsDict;
		if (!(p) || !(p.v)) {
			return null;
		}
		var w = d.py_get (p.v);
		if (!(w)) {
			var __left0__ = StringTextWrapper (__kwargtrans__ ({c: self.c, py_name: 'head-{}'.format (1 + len (list (d.py_keys ())))}));
			d [p.v] = __left0__;
			var w = __left0__;
			w.setAllText (p.h);
		}
		return w;
	});},
	get editLabel () {return __get__ (this, function (self, p, selectAll, selection) {
		if (typeof selectAll == 'undefined' || (selectAll != null && selectAll.hasOwnProperty ("__kwargtrans__"))) {;
			var selectAll = false;
		};
		if (typeof selection == 'undefined' || (selection != null && selection.hasOwnProperty ("__kwargtrans__"))) {;
			var selection = null;
		};
		self.endEditLabel ();
		if (p) {
			var wrapper = StringTextWrapper (__kwargtrans__ ({c: self.c, py_name: 'head-wrapper'}));
			var e = null;
			return tuple ([e, wrapper]);
		}
		return tuple ([null, null]);
	});},
	get printWidgets () {return __get__ (this, function (self) {
		var d = self.editWidgetsDict;
		for (var key of d) {
			var w = d.py_get (key);
			g.pr ('w', w, 'v.h:', key.headString, 's:', repr (w.s));
		}
	});},
	get drawIcon () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get redraw () {return __get__ (this, function (self, p) {
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		self.redrawCount++;
		return p;
	});},
	redraw_now: redraw,
	get redraw_after_contract () {return __get__ (this, function (self, p) {
		self.redraw ();
	});},
	get redraw_after_expand () {return __get__ (this, function (self, p) {
		self.redraw ();
	});},
	get redraw_after_head_changed () {return __get__ (this, function (self) {
		self.redraw ();
	});},
	get redraw_after_icons_changed () {return __get__ (this, function (self) {
		self.redraw ();
	});},
	get redraw_after_select () {return __get__ (this, function (self, p) {
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		self.redraw ();
	});},
	get scrollTo () {return __get__ (this, function (self, p) {
		// pass;
	});},
	get updateIcon () {return __get__ (this, function (self, p, force) {
		if (typeof force == 'undefined' || (force != null && force.hasOwnProperty ("__kwargtrans__"))) {;
			var force = false;
		};
		// pass;
	});},
	get setHeadline () {return __get__ (this, function (self, p, s) {
		var w = self.edit_widget (p);
		if (w) {
			w.delete (0, 'end');
			if (s.endswith ('\n') || s.endswith ('\r')) {
				var s = s.__getslice__ (0, -(1), 1);
			}
			w.insert (0, s);
		}
		else {
			g.trace ('-' * 20, 'oops');
		}
	});}
});
export var StringTextWrapper =  __class__ ('StringTextWrapper', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, py_name) {
		self.c = c;
		self.py_name = py_name;
		self.ins = 0;
		self.sel = tuple ([0, 0]);
		self.s = '';
		self.supportsHighLevelInterface = true;
		self.widget = null;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return '<StringTextWrapper: {} {}>'.format (id (self), self.py_name);
	});},
	get getName () {return __get__ (this, function (self) {
		return self.py_name;
	});},
	get clipboard_clear () {return __get__ (this, function (self) {
		g.app.gui.replaceClipboardWith ('');
	});},
	get clipboard_append () {return __get__ (this, function (self, s) {
		var s1 = g.app.gui.getTextFromClipboard ();
		g.app.gui.replaceClipboardWith (s1 + s);
	});},
	get flashCharacter () {return __get__ (this, function (self, i, bg, fg, flashes, delay) {
		if (typeof bg == 'undefined' || (bg != null && bg.hasOwnProperty ("__kwargtrans__"))) {;
			var bg = 'white';
		};
		if (typeof fg == 'undefined' || (fg != null && fg.hasOwnProperty ("__kwargtrans__"))) {;
			var fg = 'red';
		};
		if (typeof flashes == 'undefined' || (flashes != null && flashes.hasOwnProperty ("__kwargtrans__"))) {;
			var flashes = 3;
		};
		if (typeof delay == 'undefined' || (delay != null && delay.hasOwnProperty ("__kwargtrans__"))) {;
			var delay = 75;
		};
		// pass;
	});},
	get getXScrollPosition () {return __get__ (this, function (self) {
		return 0;
	});},
	get getYScrollPosition () {return __get__ (this, function (self) {
		return 0;
	});},
	get see () {return __get__ (this, function (self, i) {
		// pass;
	});},
	get seeInsertPoint () {return __get__ (this, function (self) {
		// pass;
	});},
	get setFocus () {return __get__ (this, function (self) {
		// pass;
	});},
	get setStyleClass () {return __get__ (this, function (self, py_name) {
		// pass;
	});},
	get setXScrollPosition () {return __get__ (this, function (self, i) {
		// pass;
	});},
	get setYScrollPosition () {return __get__ (this, function (self, i) {
		// pass;
	});},
	get tag_configure () {return __get__ (this, function (self, colorName) {
		// pass;
	});},
	get appendText () {return __get__ (this, function (self, s) {
		self.s = self.s + g.toUnicode (s);
		self.ins = len (self.s);
		self.sel = tuple ([self.ins, self.ins]);
	});},
	get delete () {return __get__ (this, function (self, i, j) {
		if (typeof j == 'undefined' || (j != null && j.hasOwnProperty ("__kwargtrans__"))) {;
			var j = null;
		};
		var i = self.toPythonIndex (i);
		if (j === null) {
			var j = i + 1;
		}
		var j = self.toPythonIndex (j);
		if (i > j) {
			var __left0__ = tuple ([j, i]);
			var i = __left0__ [0];
			var j = __left0__ [1];
		}
		var s = self.getAllText ();
		self.setAllText (s.__getslice__ (0, i, 1) + s.__getslice__ (j, null, 1));
		self.setSelectionRange (i, i, __kwargtrans__ ({insert: i}));
	});},
	get deleteTextSelection () {return __get__ (this, function (self) {
		var __left0__ = self.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		self.delete (i, j);
	});},
	get py_get () {return __get__ (this, function (self, i, j) {
		if (typeof j == 'undefined' || (j != null && j.hasOwnProperty ("__kwargtrans__"))) {;
			var j = null;
		};
		var i = self.toPythonIndex (i);
		if (j === null) {
			var j = i + 1;
		}
		var j = self.toPythonIndex (j);
		var s = self.s.__getslice__ (i, j, 1);
		return g.toUnicode (s);
	});},
	get getAllText () {return __get__ (this, function (self) {
		var s = self.s;
		return g.checkUnicode (s);
	});},
	get getInsertPoint () {return __get__ (this, function (self) {
		var i = self.ins;
		if (i === null) {
			if (self.virtualInsertPoint === null) {
				var i = 0;
			}
			else {
				var i = self.virtualInsertPoint;
			}
		}
		self.virtualInsertPoint = i;
		return i;
	});},
	get getSelectedText () {return __get__ (this, function (self) {
		var __left0__ = self.sel;
		var i = __left0__ [0];
		var j = __left0__ [1];
		var s = self.s.__getslice__ (i, j, 1);
		return g.checkUnicode (s);
	});},
	get getSelectionRange () {return __get__ (this, function (self, py_sort) {
		if (typeof py_sort == 'undefined' || (py_sort != null && py_sort.hasOwnProperty ("__kwargtrans__"))) {;
			var py_sort = true;
		};
		var sel = self.sel;
		if (len (sel) == 2 && sel [0] >= 0 && sel [1] >= 0) {
			var __left0__ = sel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			if (py_sort && i > j) {
				var sel = tuple ([j, i]);
			}
			return sel;
		}
		var i = self.ins;
		return tuple ([i, i]);
	});},
	get hasSelection () {return __get__ (this, function (self) {
		var __left0__ = self.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		return i != j;
	});},
	get insert () {return __get__ (this, function (self, i, s) {
		var i = self.toPythonIndex (i);
		var s1 = s;
		self.s = (self.s.__getslice__ (0, i, 1) + s1) + self.s.__getslice__ (i, null, 1);
		i += len (s1);
		self.ins = i;
		self.sel = tuple ([i, i]);
	});},
	get selectAllText () {return __get__ (this, function (self, insert) {
		if (typeof insert == 'undefined' || (insert != null && insert.hasOwnProperty ("__kwargtrans__"))) {;
			var insert = null;
		};
		self.setSelectionRange (0, 'end', __kwargtrans__ ({insert: insert}));
	});},
	get setAllText () {return __get__ (this, function (self, s) {
		self.s = s;
		var i = len (self.s);
		self.ins = i;
		self.sel = tuple ([i, i]);
	});},
	get setInsertPoint () {return __get__ (this, function (self, pos, s) {
		if (typeof s == 'undefined' || (s != null && s.hasOwnProperty ("__kwargtrans__"))) {;
			var s = null;
		};
		var __left0__ = self.toPythonIndex (pos);
		self.virtualInsertPoint = __left0__;
		var i = __left0__;
		self.ins = i;
		self.sel = tuple ([i, i]);
	});},
	get setSelectionRange () {return __get__ (this, function (self, i, j, insert) {
		if (typeof insert == 'undefined' || (insert != null && insert.hasOwnProperty ("__kwargtrans__"))) {;
			var insert = null;
		};
		var __left0__ = tuple ([self.toPythonIndex (i), self.toPythonIndex (j)]);
		var i = __left0__ [0];
		var j = __left0__ [1];
		self.sel = tuple ([i, j]);
		self.ins = (insert === null ? j : self.toPythonIndex (insert));
	});},
	get toPythonIndex () {return __get__ (this, function (self, index) {
		return g.toPythonIndex (self.s, index);
	});},
	get toPythonIndexRowCol () {return __get__ (this, function (self, index) {
		var s = self.getAllText ();
		var i = self.toPythonIndex (index);
		var __left0__ = g.convertPythonIndexToRowCol (s, i);
		var row = __left0__ [0];
		var col = __left0__ [1];
		return tuple ([i, row, col]);
	});}
});

//# sourceMappingURL=leo.core.leoFrame.map