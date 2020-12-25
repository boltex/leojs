// Transcrypt'ed from Python, 2020-12-25 05:32:39
var re = {};
var sys = {};
var time = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as g from './leo.core.leoGlobals.js';
import * as __module_time__ from './time.js';
__nest__ (time, '', __module_time__);
import * as __module_sys__ from './sys.js';
__nest__ (sys, '', __module_sys__);
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
var __name__ = 'leo.core.leoFind';
export var SearchWidget =  __class__ ('SearchWidget', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		self.s = '';
		self.i = 0;
		self.sel = tuple ([0, 0]);
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return 'SearchWidget id: {}'.format (id (self));
	});},
	get getAllText () {return __get__ (this, function (self) {
		return self.s;
	});},
	get getInsertPoint () {return __get__ (this, function (self) {
		return self.i;
	});},
	get getSelectionRange () {return __get__ (this, function (self) {
		return self.sel;
	});},
	get delete () {return __get__ (this, function (self, i, j) {
		if (typeof j == 'undefined' || (j != null && j.hasOwnProperty ("__kwargtrans__"))) {;
			var j = null;
		};
		var i = self.toPythonIndex (i);
		if (j === null) {
			var j = i + 1;
		}
		else {
			var j = self.toPythonIndex (j);
		}
		self.s = self.s.__getslice__ (0, i, 1) + self.s.__getslice__ (j, null, 1);
		self.i = i;
		self.sel = tuple ([i, i]);
	});},
	get insert () {return __get__ (this, function (self, i, s) {
		if (!(s)) {
			return ;
		}
		var i = self.toPythonIndex (i);
		self.s = (self.s.__getslice__ (0, i, 1) + s) + self.s.__getslice__ (i, null, 1);
		self.i = i;
		self.sel = tuple ([i, i]);
	});},
	get setAllText () {return __get__ (this, function (self, s) {
		self.s = s;
		self.i = 0;
		self.sel = tuple ([0, 0]);
	});},
	get setInsertPoint () {return __get__ (this, function (self, i, s) {
		if (typeof s == 'undefined' || (s != null && s.hasOwnProperty ("__kwargtrans__"))) {;
			var s = null;
		};
		self.i = i;
	});},
	get setSelectionRange () {return __get__ (this, function (self, i, j, insert) {
		if (typeof insert == 'undefined' || (insert != null && insert.hasOwnProperty ("__kwargtrans__"))) {;
			var insert = null;
		};
		self.sel = tuple ([self.toPythonIndex (i), self.toPythonIndex (j)]);
		if (insert !== null) {
			self.i = self.toPythonIndex (insert);
		}
	});},
	get toPythonIndex () {return __get__ (this, function (self, i) {
		return g.toPythonIndex (self.s, i);
	});}
});
export var LeoFind =  __class__ ('LeoFind', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c) {
		self.c = c;
		self.errors = 0;
		self.expert_mode = false;
		self.ftm = null;
		self.frame = null;
		self.k = c.k;
		self.re_obj = null;
		self.batch = null;
		self.ignore_case = null;
		self.node_only = null;
		self.pattern_match = null;
		self.search_headline = null;
		self.search_body = null;
		self.suboutline_only = null;
		self.mark_changes = null;
		self.mark_finds = null;
		self.reverse = null;
		self.wrap = null;
		self.whole_word = null;
		self.stack = [];
		self.isearch_ignore_case = null;
		self.isearch_forward = null;
		self.isearch_regexp = null;
		self.findTextList = [];
		self.changeTextList = [];
		self.change_ctrl = null;
		self.s_ctrl = SearchWidget ();
		self.find_text = '';
		self.change_text = '';
		self.radioButtonsChanged = false;
		self.find_def_data = null;
		self.find_seen = set ();
		self.buttonFlag = false;
		self.changeAllFlag = false;
		self.findAllFlag = false;
		self.findAllUniqueFlag = false;
		self.in_headline = false;
		self.match_obj = null;
		self.p = null;
		self.unique_matches = set ();
		self.was_in_headline = null;
		self.onlyPosition = null;
		self.wrapping = false;
		self.wrapPosition = null;
		self.wrapPos = null;
		self.state_on_start_of_search = null;
	});},
	get cmd () {return __get__ (this, function (py_name) {
		return g.new_cmd_decorator (py_name, ['c', 'findCommands']);
	});},
	get finishCreate () {return __get__ (this, function (self) {
		var c = self.c;
		self.reloadSettings ();
		var dw = c.frame.top;
		if (dw) {
			dw.finishCreateLogPane ();
		}
	});},
	get reloadSettings () {return __get__ (this, function (self) {
		var c = self.c;
		self.ignore_dups = c.config.getBool ('find-ignore-duplicates', __kwargtrans__ ({py_default: false}));
		self.minibuffer_mode = c.config.getBool ('minibuffer-find-mode', __kwargtrans__ ({py_default: false}));
	});},
	get changeAllButton () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var c = self.c;
		self.setup_button ();
		c.clearAllVisited ();
		self.changeAll ();
	});},
	get changeButton () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_button ();
		self.change ();
	});},
	get changeThenFindButton () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_button ();
		self.changeThenFind ();
	});},
	get findAllButton () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_button ();
		self.findAll ();
	});},
	get findButton () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var __left0__ = tuple ([self.c, self.c.p]);
		var c = __left0__ [0];
		var p = __left0__ [1];
		var p0 = p.copy ();
		self.setup_button ();
		if (self.was_in_headline) {
			self.was_in_headline = false;
			if (p.hasThreadNext ()) {
				p.moveToThreadNext ();
				c.selectPosition (p);
			}
			self.p = p.copy ();
		}
		if (!(self.findNext ()) && p0 != c.p) {
			p0.contract ();
			c.selectPosition (p0);
			c.redraw ();
		}
	});},
	get findPreviousButton () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var __left0__ = tuple ([self.c, self.c.p]);
		var c = __left0__ [0];
		var p = __left0__ [1];
		var p0 = p.copy ();
		self.setup_button ();
		if (self.was_in_headline) {
			self.was_in_headline = false;
			if (p.hasThreadBack ()) {
				p.moveToThreadBack ();
				c.selectPosition (p);
			}
			self.p = p.copy ();
		}
		self.reverse = true;
		try {
			if (!(self.findNext ()) && p0 != c.p) {
				p0.contract ();
				c.selectPosition (p0);
				c.redraw ();
			}
		}
		finally {
			self.reverse = false;
		}
	});},
	get setup_button () {return __get__ (this, function (self) {
		var c = self.c;
		self.buttonFlag = true;
		self.p = c.p;
		c.bringToFront ();
		if (0) {
			c.endEditing ();
		}
		self.update_ivars ();
	});},
	get changeCommand () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.change ();
	});},
	get changeThenFindCommand () {return __get__ (this, cmd ('replace-then-find') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.changeThenFind ();
	}));},
	get cloneFindAllCommand () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.findAll (__kwargtrans__ ({clone_find_all: true}));
	});},
	get cloneFindAllFlattenedCommand () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.findAll (__kwargtrans__ ({clone_find_all: true, clone_find_all_flattened: true}));
	});},
	get findAllCommand () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.findAll ();
	});},
	get findDef () {return __get__ (this, cmd ('find-def') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.findDefHelper (event, __kwargtrans__ ({defFlag: true}));
	}));},
	get findVar () {return __get__ (this, cmd ('find-var') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.findDefHelper (event, __kwargtrans__ ({defFlag: false}));
	}));},
	get findDefHelper () {return __get__ (this, function (self, event, defFlag) {
		var __left0__ = tuple ([self.c, self, self.ftm]);
		var c = __left0__ [0];
		var find = __left0__ [1];
		var ftm = __left0__ [2];
		var w = c.frame.body.wrapper;
		if (!(w)) {
			return ;
		}
		var word = self.initFindDef (event);
		if (!(word)) {
			return ;
		}
		var save_sel = w.getSelectionRange ();
		var ins = w.getInsertPoint ();
		var old_p = c.p;
		var p = c.rootPosition ();
		c.selectPosition (p);
		c.redraw ();
		c.bodyWantsFocusNow ();
		if (defFlag) {
			var prefix = (word [0].isupper () ? 'class' : 'def');
			var find_pattern = (prefix + ' ') + word;
		}
		else {
			var find_pattern = word + ' =';
		}
		find.find_text = find_pattern;
		ftm.setFindText (find_pattern);
		find.saveBeforeFindDef (p);
		find.setFindDefOptions (p);
		self.find_seen = set ();
		var use_cff = c.config.getBool ('find-def-creates-clones', __kwargtrans__ ({py_default: false}));
		var count = 0;
		if (use_cff) {
			var count = find.findAll (__kwargtrans__ ({clone_find_all: true, clone_find_all_flattened: true}));
			var found = count > 0;
		}
		else {
			while (true) {
				var found = find.findNext (__kwargtrans__ ({initFlag: false}));
				if (!(found) || !(g.inAtNosearch (c.p))) {
					break;
				}
			}
		}
		if (!(found) && defFlag) {
			var word2 = self.switchStyle (word);
			if (word2) {
				var find_pattern = (prefix + ' ') + word2;
				find.find_text = find_pattern;
				ftm.setFindText (find_pattern);
				if (use_cff) {
					var count = find.findAll (__kwargtrans__ ({clone_find_all: true, clone_find_all_flattened: true}));
					var found = count > 0;
				}
				else {
					while (true) {
						var found = find.findNext (__kwargtrans__ ({initFlag: false}));
						if (!(found) || !(g.inAtNosearch (c.p))) {
							break;
						}
					}
				}
			}
		}
		if (found && use_cff) {
			var last = c.lastTopLevel ();
			if (count == 1) {
				last.doDelete ();
				find.findNext (__kwargtrans__ ({initFlag: false}));
			}
			else {
				c.selectPosition (last);
			}
		}
		if (found) {
			self.find_seen.add (c.p.v);
			self.restoreAfterFindDef ();
		}
		else {
			c.selectPosition (old_p);
			self.restoreAfterFindDef ();
			var __left0__ = save_sel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			c.redraw ();
			w.setSelectionRange (i, j, __kwargtrans__ ({insert: ins}));
			c.bodyWantsFocusNow ();
		}
	});},
	get switchStyle () {return __get__ (this, function (self, word) {
		var s = word;
		if (s.find ('_') > -(1)) {
			if (s.startswith ('_')) {
				return null;
			}
			var s = s.lower ();
			while (s) {
				var i = s.find ('_');
				if (i == -(1)) {
					break;
				}
				var s = s.__getslice__ (0, i, 1) + s.__getslice__ (i + 1, null, 1).capitalize ();
			}
			return s;
		}
		var result = [];
		for (var [i, ch] of enumerate (s)) {
			if (i > 0 && ch.isupper ()) {
				result.append ('_');
			}
			result.append (ch.lower ());
		}
		var s = ''.join (result);
		return (s == word ? null : s);
	});},
	get initFindDef () {return __get__ (this, function (self, event) {
		var c = self.c;
		var w = c.frame.body.wrapper;
		c.bodyWantsFocusNow ();
		var w = c.frame.body.wrapper;
		if (!(w.hasSelection ())) {
			c.editCommands.extendToWord (event, __kwargtrans__ ({select: true}));
		}
		var word = w.getSelectedText ().strip ();
		if (!(word)) {
			return null;
		}
		for (var tag of tuple (['class ', 'def '])) {
			var found = word.startswith (tag) && len (word) > len (tag);
			if (found) {
				return word.__getslice__ (len (tag), null, 1).strip ();
			}
		}
		return word;
	});},
	get saveBeforeFindDef () {return __get__ (this, function (self, p) {
		if (!(self.find_def_data)) {
			self.find_def_data = g.Bunch (__kwargtrans__ ({ignore_case: self.ignore_case, p: p.copy (), pattern_match: self.pattern_match, search_body: self.search_body, search_headline: self.search_headline, whole_word: self.whole_word}));
		}
	});},
	get setFindDefOptions () {return __get__ (this, function (self, p) {
		self.ignore_case = false;
		self.p = p.copy ();
		self.pattern_match = false;
		self.reverse = false;
		self.search_body = true;
		self.search_headline = false;
		self.whole_word = true;
	});},
	get restoreAfterFindDef () {return __get__ (this, function (self) {
		var b = self.find_def_data;
		if (b) {
			self.ignore_case = b.ignore_case;
			self.p = b.p;
			self.pattern_match = b.pattern_match;
			self.reverse = false;
			self.search_body = b.search_body;
			self.search_headline = b.search_headline;
			self.whole_word = b.whole_word;
			self.find_def_data = null;
		}
	});},
	get findNextCommand () {return __get__ (this, cmd ('find-next') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.findNext ();
	}));},
	get findPrevCommand () {return __get__ (this, cmd ('find-prev') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.setup_command ();
		self.reverse = true;
		try {
			self.findNext ();
		}
		finally {
			self.reverse = false;
		}
	}));},
	get focusToFind () {return __get__ (this, cmd ('focus-to-find') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var c = self.c;
		if (c.config.getBool ('use-find-dialog', __kwargtrans__ ({py_default: true}))) {
			g.app.gui.openFindDialog (c);
		}
		else {
			c.frame.log.selectTab ('Find');
		}
	}));},
	get helpForFindCommands () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.c.helpCommands.helpForFindCommands (event);
	});},
	get hideFindTab () {return __get__ (this, cmd ('find-tab-hide') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var c = self.c;
		if (self.minibuffer_mode) {
			c.k.keyboardQuit ();
		}
		else {
			self.c.frame.log.selectTab ('Log');
		}
	}));},
	get openFindTab () {return __get__ (this, cmd ('find-tab-open') (function (self, event, show) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof show == 'undefined' || (show != null && show.hasOwnProperty ("__kwargtrans__"))) {;
			var show = true;
		};
		var c = self.c;
		if (c.config.getBool ('use-find-dialog', __kwargtrans__ ({py_default: true}))) {
			g.app.gui.openFindDialog (c);
		}
		else {
			c.frame.log.selectTab ('Find');
		}
	}));},
	get changeAllCommand () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var c = self.c;
		self.setup_command ();
		self.changeAll ();
		for (var p of c.all_positions ()) {
			if (p.anyAtFileNodeName () && !(p.v.isDirty ()) && any ((function () {
				var __accu0__ = [];
				for (var p2 of p.subtree ()) {
					__accu0__.append (p2.v.isDirty ());
				}
				return __accu0__;
			}) ())) {
				p.setDirty ();
			}
		}
		c.redraw ();
	});},
	get preloadFindPattern () {return __get__ (this, function (self, w) {
		var __left0__ = tuple ([self.c, self.ftm]);
		var c = __left0__ [0];
		var ftm = __left0__ [1];
		if (!(c.config.getBool ('preload-find-pattern', __kwargtrans__ ({py_default: false})))) {
			return ;
		}
		if (!(w)) {
			return ;
		}
		var s = w.getSelectedText ();
		if (s.strip ()) {
			ftm.setFindText (s);
			ftm.init_focus ();
		}
	});},
	get setup_command () {return __get__ (this, function (self) {
		if (0) {
			self.c.endEditing ();
		}
		self.buttonFlag = false;
		self.update_ivars ();
	});},
	get startSearch () {return __get__ (this, cmd ('start-search') (function (self, event) {
		var w = self.editWidget (event);
		if (w) {
			self.preloadFindPattern (w);
		}
		self.find_seen = set ();
		if (self.minibuffer_mode) {
			self.ftm.clear_focus ();
			self.searchWithPresentOptions (event);
		}
		else {
			self.openFindTab (event);
			self.ftm.init_focus ();
		}
	}));},
	get returnToOrigin () {return __get__ (this, cmd ('search-return-to-origin') (function (self, event) {
		var data = self.state_on_start_of_search;
		if (!(data)) {
			return ;
		}
		self.restore (data);
		self.restoreAllExpansionStates (data [-(1)], __kwargtrans__ ({redraw: true}));
	}));},
	get isearchForward () {return __get__ (this, cmd ('isearch-forward') (function (self, event) {
		self.startIncremental (event, 'isearch-forward', __kwargtrans__ ({forward: true, ignoreCase: false, regexp: false}));
	}));},
	get isearchBackward () {return __get__ (this, cmd ('isearch-backward') (function (self, event) {
		self.startIncremental (event, 'isearch-backward', __kwargtrans__ ({forward: false, ignoreCase: false, regexp: false}));
	}));},
	get isearchForwardRegexp () {return __get__ (this, cmd ('isearch-forward-regexp') (function (self, event) {
		self.startIncremental (event, 'isearch-forward-regexp', __kwargtrans__ ({forward: true, ignoreCase: false, regexp: true}));
	}));},
	get isearchBackwardRegexp () {return __get__ (this, cmd ('isearch-backward-regexp') (function (self, event) {
		self.startIncremental (event, 'isearch-backward-regexp', __kwargtrans__ ({forward: false, ignoreCase: false, regexp: true}));
	}));},
	get isearchWithPresentOptions () {return __get__ (this, cmd ('isearch-with-present-options') (function (self, event) {
		self.startIncremental (event, 'isearch-with-present-options', __kwargtrans__ ({forward: null, ignoreCase: null, regexp: null}));
	}));},
	get abortSearch () {return __get__ (this, function (self) {
		var c = self.c;
		var k = self.k;
		var w = c.frame.body.wrapper;
		k.clearState ();
		k.resetLabel ();
		var __left0__ = self.stack [0];
		var p = __left0__ [0];
		var i = __left0__ [1];
		var j = __left0__ [2];
		var in_headline = __left0__ [3];
		self.in_headline = in_headline;
		c.selectPosition (p);
		c.redraw_after_select (p);
		c.bodyWantsFocus ();
		w.setSelectionRange (i, j);
	});},
	get endSearch () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		k.clearState ();
		k.resetLabel ();
		c.bodyWantsFocus ();
	});},
	get iSearch () {return __get__ (this, function (self, again) {
		if (typeof again == 'undefined' || (again != null && again.hasOwnProperty ("__kwargtrans__"))) {;
			var again = false;
		};
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		self.p = c.p;
		var reverse = !(self.isearch_forward);
		var pattern = k.getLabel (__kwargtrans__ ({ignorePrompt: true}));
		if (!(pattern)) {
			self.abortSearch ();
			return ;
		}
		self.update_ivars ();
		var oldPattern = self.find_text;
		var oldRegexp = self.pattern_match;
		var oldWord = self.whole_word;
		self.pattern_match = self.isearch_regexp;
		self.reverse = reverse;
		self.find_text = pattern;
		self.whole_word = false;
		if (len (self.stack) <= 1) {
			self.in_headline = false;
		}
		var w = self.setWidget ();
		var s = w.getAllText ();
		var __left0__ = w.getSelectionRange ();
		var i = __left0__ [0];
		var j = __left0__ [1];
		if (again) {
			var ins = (reverse ? i : j + len (pattern));
		}
		else {
			var ins = (reverse ? j + len (pattern) : i);
		}
		self.init_s_ctrl (s, ins);
		var __left0__ = self.findNextMatch ();
		var pos = __left0__ [0];
		var newpos = __left0__ [1];
		self.find_text = oldPattern;
		self.pattern_match = oldRegexp;
		self.reverse = false;
		self.whole_word = oldWord;
		if (pos !== null) {
			var w = self.showSuccess (pos, newpos, __kwargtrans__ ({showState: false}));
			if (w) {
				var __left0__ = w.getSelectionRange (__kwargtrans__ ({py_sort: false}));
				var i = __left0__ [0];
				var j = __left0__ [1];
			}
			if (!(again)) {
				self.push (c.p, i, j, self.in_headline);
			}
		}
		else if (self.wrapping) {
			k.setLabelRed ('end of wrapped search');
		}
		else {
			g.es ('not found: {}'.format (pattern));
			if (!(again)) {
				var event = g.app.gui.create_key_event (c, __kwargtrans__ ({binding: 'BackSpace', char: '\x08', w: w}));
				k.updateLabel (event);
			}
		}
	});},
	get iSearchStateHandler () {return __get__ (this, function (self, event) {
		var k = self.k;
		var stroke = (event ? event.stroke : null);
		var s = (stroke ? stroke.s : '');
		if (__in__ (s, tuple (['Escape', '\n', 'Return']))) {
			self.endSearch ();
		}
		else if (__in__ (stroke, self.iSearchStrokes)) {
			self.iSearch (__kwargtrans__ ({again: true}));
		}
		else if (__in__ (s, tuple (['\x08', 'BackSpace']))) {
			k.updateLabel (event);
			self.iSearchBackspace ();
		}
		else if (s.startswith ('Ctrl+') || s.startswith ('Alt+') || k.isFKey (s)) {
			self.endSearch ();
			k.masterKeyHandler (event);
		}
		else if (k.isPlainKey (stroke)) {
			k.updateLabel (event);
			self.iSearch ();
		}
	});},
	get iSearchBackspace () {return __get__ (this, function (self) {
		var c = self.c;
		if (len (self.stack) <= 1) {
			self.abortSearch ();
			return ;
		}
		self.py_pop ();
		var __left0__ = self.py_pop ();
		var p = __left0__ [0];
		var i = __left0__ [1];
		var j = __left0__ [2];
		var in_headline = __left0__ [3];
		self.push (p, i, j, in_headline);
		if (in_headline) {
			var selection = tuple ([i, j, i]);
			c.redrawAndEdit (p, __kwargtrans__ ({selectAll: false, selection: selection, keepMinibuffer: true}));
		}
		else {
			c.selectPosition (p);
			var w = c.frame.body.wrapper;
			c.bodyWantsFocus ();
			if (i > j) {
				var __left0__ = tuple ([j, i]);
				var i = __left0__ [0];
				var j = __left0__ [1];
			}
			w.setSelectionRange (i, j);
		}
		if (len (self.stack) <= 1) {
			self.abortSearch ();
		}
	});},
	get getStrokes () {return __get__ (this, function (self, commandName) {
		var aList = self.inverseBindingDict.py_get (commandName, []);
		return (function () {
			var __accu0__ = [];
			for (var [pane, key] of aList) {
				__accu0__.append (key);
			}
			return __accu0__;
		}) ();
	});},
	get push () {return __get__ (this, function (self, p, i, j, in_headline) {
		var data = tuple ([p.copy (), i, j, in_headline]);
		self.stack.append (data);
	});},
	get py_pop () {return __get__ (this, function (self) {
		var data = self.stack.py_pop ();
		var __left0__ = data;
		var p = __left0__ [0];
		var i = __left0__ [1];
		var j = __left0__ [2];
		var in_headline = __left0__ [3];
		return tuple ([p, i, j, in_headline]);
	});},
	get setWidget () {return __get__ (this, function (self) {
		var c = self.c;
		var p = c.currentPosition ();
		var wrapper = c.frame.body.wrapper;
		if (self.in_headline) {
			var w = c.edit_widget (p);
			if (!(w)) {
				var selection = tuple ([0, 0, 0]);
				c.redrawAndEdit (p, __kwargtrans__ ({selectAll: false, selection: selection, keepMinibuffer: true}));
				var w = c.edit_widget (p);
			}
			if (!(w)) {
				g.trace ('**** no edit widget!');
				self.in_headline = false;
				var w = wrapper;
			}
		}
		else {
			var w = wrapper;
		}
		if (w == wrapper) {
			c.bodyWantsFocus ();
		}
		return w;
	});},
	get startIncremental () {return __get__ (this, function (self, event, commandName, forward, ignoreCase, regexp) {
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		self.event = event;
		self.isearch_forward = (forward === null ? !(self.reverse) : forward);
		self.isearch_ignore_case = (ignoreCase === null ? self.ignore_case : ignoreCase);
		self.isearch_regexp = (regexp === null ? self.pattern_match : regexp);
		var __left0__ = c.frame.body.wrapper;
		self.w = __left0__;
		var w = __left0__;
		self.p1 = c.p;
		self.sel1 = w.getSelectionRange (__kwargtrans__ ({py_sort: false}));
		var __left0__ = self.sel1;
		var i = __left0__ [0];
		var j = __left0__ [1];
		self.push (c.p, i, j, self.in_headline);
		self.inverseBindingDict = k.computeInverseBindingDict ();
		self.iSearchStrokes = self.getStrokes (commandName);
		k.setLabelBlue ('Isearch{}{}{}: '.format ((!(self.isearch_forward) ? ' Backward' : ''), (self.isearch_regexp ? ' Regexp' : ''), (self.isearch_ignore_case ? ' NoCase' : '')));
		k.setState ('isearch', 1, __kwargtrans__ ({handler: self.iSearchStateHandler}));
		c.minibufferWantsFocus ();
	});},
	get minibufferCloneFindAll () {return __get__ (this, cmd ('clone-find-all') (cmd ('find-clone-all') (cmd ('cfa') (function (self, event, preloaded) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof preloaded == 'undefined' || (preloaded != null && preloaded.hasOwnProperty ("__kwargtrans__"))) {;
			var preloaded = null;
		};
		var w = self.editWidget (event);
		if (w) {
			if (!(preloaded)) {
				self.preloadFindPattern (w);
			}
			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Clone Find All: ', handler: self.minibufferCloneFindAll1}));
		}
	}))));},
	get minibufferCloneFindAll1 () {return __get__ (this, function (self, event) {
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		k.clearState ();
		k.resetLabel ();
		k.showStateAndMode ();
		self.generalSearchHelper (k.arg, __kwargtrans__ ({cloneFindAll: true}));
		c.treeWantsFocus ();
	});},
	get minibufferCloneFindAllFlattened () {return __get__ (this, cmd ('clone-find-all-flattened') (cmd ('find-clone-all-flattened') (cmd ('cff') (function (self, event, preloaded) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof preloaded == 'undefined' || (preloaded != null && preloaded.hasOwnProperty ("__kwargtrans__"))) {;
			var preloaded = null;
		};
		var w = self.editWidget (event);
		if (w) {
			if (!(preloaded)) {
				self.preloadFindPattern (w);
			}
			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Clone Find All Flattened: ', handler: self.minibufferCloneFindAllFlattened1}));
		}
	}))));},
	get minibufferCloneFindAllFlattened1 () {return __get__ (this, function (self, event) {
		var c = self.c;
		var k = self.k;
		k.clearState ();
		k.resetLabel ();
		k.showStateAndMode ();
		self.generalSearchHelper (k.arg, __kwargtrans__ ({cloneFindAllFlattened: true}));
		c.treeWantsFocus ();
	});},
	get minibufferCloneFindTag () {return __get__ (this, cmd ('clone-find-tag') (cmd ('find-clone-tag') (cmd ('cft') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (self.editWidget (event)) {
			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Clone Find Tag: ', handler: self.minibufferCloneFindTag1}));
		}
	}))));},
	get minibufferCloneFindTag1 () {return __get__ (this, function (self, event) {
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		k.clearState ();
		k.resetLabel ();
		k.showStateAndMode ();
		self.find_text = k.arg;
		self.cloneFindTag (k.arg);
		c.treeWantsFocus ();
	});},
	get minibufferFindAll () {return __get__ (this, cmd ('find-all') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.ftm.clear_focus ();
		self.searchWithPresentOptions (event, __kwargtrans__ ({findAllFlag: true}));
	}));},
	get minibufferFindAllUniqueRegex () {return __get__ (this, cmd ('find-all-unique-regex') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.ftm.clear_focus ();
		self.match_obj = null;
		self.unique_matches = set ();
		self.searchWithPresentOptions (event, __kwargtrans__ ({findAllFlag: true, findAllUniqueFlag: true}));
	}));},
	get minibufferReplaceAll () {return __get__ (this, cmd ('replace-all') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.ftm.clear_focus ();
		self.searchWithPresentOptions (event, __kwargtrans__ ({changeAllFlag: true}));
	}));},
	get minibufferTagChildren () {return __get__ (this, cmd ('tag-children') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (self.editWidget (event)) {
			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Tag Children: ', handler: self.minibufferTagChildren1}));
		}
	}));},
	get minibufferTagChildren1 () {return __get__ (this, function (self, event) {
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		k.clearState ();
		k.resetLabel ();
		k.showStateAndMode ();
		self.tagChildren (k.arg);
		c.treeWantsFocus ();
	});},
	get tagChildren () {return __get__ (this, function (self, tag) {
		var c = self.c;
		var tc = c.theTagController;
		if (tc) {
			for (var p of c.p.children ()) {
				tc.add_tag (p, tag);
			}
			g.es_print ('Added {} tag to {} nodes'.format (tag, len (list (c.p.children ()))));
		}
		else {
			g.es_print ('nodetags not active');
		}
	});},
	get addChangeStringToLabel () {return __get__ (this, function (self) {
		var c = self.c;
		var ftm = c.findCommands.ftm;
		var s = ftm.getChangeText ();
		c.minibufferWantsFocus ();
		while (s.endswith ('\n') || s.endswith ('\r')) {
			var s = s.__getslice__ (0, -(1), 1);
		}
		c.k.extendLabel (s, __kwargtrans__ ({select: true, protect: false}));
	});},
	get addFindStringToLabel () {return __get__ (this, function (self, protect) {
		if (typeof protect == 'undefined' || (protect != null && protect.hasOwnProperty ("__kwargtrans__"))) {;
			var protect = true;
		};
		var c = self.c;
		var k = c.k;
		var ftm = c.findCommands.ftm;
		var s = ftm.getFindText ();
		c.minibufferWantsFocus ();
		while (s.endswith ('\n') || s.endswith ('\r')) {
			var s = s.__getslice__ (0, -(1), 1);
		}
		k.extendLabel (s, __kwargtrans__ ({select: true, protect: protect}));
	});},
	get editWidget () {return __get__ (this, function (self, event, forceFocus) {
		if (typeof forceFocus == 'undefined' || (forceFocus != null && forceFocus.hasOwnProperty ("__kwargtrans__"))) {;
			var forceFocus = true;
		};
		var c = self.c;
		self.w = c.frame.body.wrapper;
		return self.w;
	});},
	get generalChangeHelper () {return __get__ (this, function (self, find_pattern, change_pattern, changeAll) {
		if (typeof changeAll == 'undefined' || (changeAll != null && changeAll.hasOwnProperty ("__kwargtrans__"))) {;
			var changeAll = false;
		};
		var c = self.c;
		self.setupSearchPattern (find_pattern);
		self.setupChangePattern (change_pattern);
		if (c.vim_mode && c.vimCommands) {
			c.vimCommands.update_dot_before_search (__kwargtrans__ ({find_pattern: find_pattern, change_pattern: change_pattern}));
		}
		c.widgetWantsFocusNow (self.w);
		self.p = c.p;
		if (changeAll) {
			self.changeAllCommand ();
		}
		else {
			self.findNextCommand ();
		}
	});},
	get generalSearchHelper () {return __get__ (this, function (self, pattern, cloneFindAll, cloneFindAllFlattened, findAll) {
		if (typeof cloneFindAll == 'undefined' || (cloneFindAll != null && cloneFindAll.hasOwnProperty ("__kwargtrans__"))) {;
			var cloneFindAll = false;
		};
		if (typeof cloneFindAllFlattened == 'undefined' || (cloneFindAllFlattened != null && cloneFindAllFlattened.hasOwnProperty ("__kwargtrans__"))) {;
			var cloneFindAllFlattened = false;
		};
		if (typeof findAll == 'undefined' || (findAll != null && findAll.hasOwnProperty ("__kwargtrans__"))) {;
			var findAll = false;
		};
		var c = self.c;
		self.setupSearchPattern (pattern);
		if (c.vim_mode && c.vimCommands) {
			c.vimCommands.update_dot_before_search (__kwargtrans__ ({find_pattern: pattern, change_pattern: null}));
		}
		c.widgetWantsFocusNow (self.w);
		self.p = c.p;
		if (findAll) {
			self.findAllCommand ();
		}
		else if (cloneFindAll) {
			self.cloneFindAllCommand ();
		}
		else if (cloneFindAllFlattened) {
			self.cloneFindAllFlattenedCommand ();
		}
		else {
			self.findNextCommand ();
		}
	});},
	get lastStateHelper () {return __get__ (this, function (self) {
		var k = self.k;
		k.clearState ();
		k.resetLabel ();
		k.showStateAndMode ();
	});},
	get reSearchBackward () {return __get__ (this, cmd ('re-search-backward') (function (self, event) {
		self.setupArgs (__kwargtrans__ ({forward: false, regexp: true, word: null}));
		self.stateZeroHelper (event, 'Regexp Search Backward:', self.reSearch1, __kwargtrans__ ({escapes: ['\t']}));
	}));},
	get reSearchForward () {return __get__ (this, cmd ('re-search-forward') (function (self, event) {
		self.setupArgs (__kwargtrans__ ({forward: true, regexp: true, word: null}));
		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Regexp Search:', handler: self.reSearch1, escapes: ['\t']}));
	}));},
	get reSearch1 () {return __get__ (this, function (self, event) {
		var k = self.k;
		if (k.getArgEscapeFlag) {
			self.setReplaceString1 (__kwargtrans__ ({event: null}));
		}
		else {
			self.updateFindList (k.arg);
			self.lastStateHelper ();
			self.generalSearchHelper (k.arg);
		}
	});},
	get searchBackward () {return __get__ (this, cmd ('search-backward') (function (self, event) {
		self.setupArgs (__kwargtrans__ ({forward: false, regexp: false, word: false}));
		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Search Backward: ', handler: self.search1, escapes: ['\t']}));
	}));},
	get searchForward () {return __get__ (this, cmd ('search-forward') (function (self, event) {
		self.setupArgs (__kwargtrans__ ({forward: true, regexp: false, word: false}));
		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Search: ', handler: self.search1, escapes: ['\t']}));
	}));},
	get search1 () {return __get__ (this, function (self, event) {
		var k = self.k;
		if (k.getArgEscapeFlag) {
			self.setReplaceString1 (__kwargtrans__ ({event: null}));
		}
		else {
			self.updateFindList (k.arg);
			self.lastStateHelper ();
			self.generalSearchHelper (k.arg);
		}
	});},
	get setReplaceString () {return __get__ (this, cmd ('set-replace-string') (function (self, event) {
		var prompt = 'Replace ' + (self.pattern_match ? 'Regex' : 'String');
		var prefix = '{}: '.format (prompt);
		self.stateZeroHelper (event, __kwargtrans__ ({prefix: prefix, handler: self.setReplaceString1}));
	}));},
	get setReplaceString1 () {return __get__ (this, function (self, event) {
		var k = self.k;
		var prompt = 'Replace ' + (self.pattern_match ? 'Regex' : 'String');
		self._sString = k.arg;
		self.updateFindList (k.arg);
		var s = '{}: {} With: '.format (prompt, self._sString);
		k.setLabelBlue (s);
		self.addChangeStringToLabel ();
		k.getNextArg (self.setReplaceString2);
	});},
	get setReplaceString2 () {return __get__ (this, function (self, event) {
		var k = self.k;
		self.updateChangeList (k.arg);
		self.lastStateHelper ();
		self.generalChangeHelper (self._sString, k.arg, __kwargtrans__ ({changeAll: self.changeAllFlag}));
	});},
	get searchWithPresentOptions () {return __get__ (this, cmd ('set-search-string') (function (self, event, findAllFlag, findAllUniqueFlag, changeAllFlag) {
		if (typeof findAllFlag == 'undefined' || (findAllFlag != null && findAllFlag.hasOwnProperty ("__kwargtrans__"))) {;
			var findAllFlag = false;
		};
		if (typeof findAllUniqueFlag == 'undefined' || (findAllUniqueFlag != null && findAllUniqueFlag.hasOwnProperty ("__kwargtrans__"))) {;
			var findAllUniqueFlag = false;
		};
		if (typeof changeAllFlag == 'undefined' || (changeAllFlag != null && changeAllFlag.hasOwnProperty ("__kwargtrans__"))) {;
			var changeAllFlag = false;
		};
		self.changeAllFlag = changeAllFlag;
		self.findAllFlag = findAllFlag;
		self.findAllUniqueFlag = findAllUniqueFlag;
		self.ftm.set_entry_focus ();
		var escapes = ['\t'];
		escapes.extend (self.findEscapes ());
		self.stateZeroHelper (event, 'Search: ', self.searchWithPresentOptions1, __kwargtrans__ ({escapes: escapes}));
	}));},
	get searchWithPresentOptions1 () {return __get__ (this, function (self, event) {
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		if (k.getArgEscapeFlag) {
			if (__in__ (event.stroke, self.findEscapes ())) {
				var command = self.escapeCommand (event);
				var func = c.commandsDict.py_get (command);
				k.clearState ();
				k.resetLabel ();
				k.showStateAndMode ();
				if (func) {
					func (event);
				}
				else {
					g.trace ('unknown command', command);
					return ;
				}
			}
			else {
				if (self.findAllFlag) {
					self.changeAllFlag = true;
				}
				k.getArgEscapeFlag = false;
				self.setupSearchPattern (k.arg);
				self.setReplaceString1 (__kwargtrans__ ({event: null}));
			}
		}
		else {
			self.updateFindList (k.arg);
			k.clearState ();
			k.resetLabel ();
			k.showStateAndMode ();
			if (self.findAllFlag) {
				self.setupSearchPattern (k.arg);
				self.findAllCommand ();
			}
			else {
				self.generalSearchHelper (k.arg);
			}
		}
	});},
	get findEscapes () {return __get__ (this, function (self) {
		var d = self.c.k.computeInverseBindingDict ();
		var results = [];
		for (var command of tuple (['find-def', 'find-next', 'find-prev', 'find-var'])) {
			var aList = d.py_get (command, []);
			for (var data of aList) {
				var __left0__ = data;
				var pane = __left0__ [0];
				var stroke = __left0__ [1];
				if (pane.startswith ('all')) {
					results.append (stroke);
				}
			}
		}
		return results;
	});},
	get escapeCommand () {return __get__ (this, function (self, event) {
		var d = self.c.k.bindingsDict;
		var aList = d.py_get (event.stroke);
		for (var bi of aList) {
			if (bi.stroke == event.stroke) {
				return bi.commandName;
			}
		}
		return null;
	});},
	get stateZeroHelper () {return __get__ (this, function (self, event, prefix, handler, escapes) {
		if (typeof escapes == 'undefined' || (escapes != null && escapes.hasOwnProperty ("__kwargtrans__"))) {;
			var escapes = null;
		};
		var __left0__ = tuple ([self.c, self.k]);
		var c = __left0__ [0];
		var k = __left0__ [1];
		self.w = self.editWidget (event);
		if (!(self.w)) {
			g.trace ('no self.w');
			return ;
		}
		k.setLabelBlue (prefix);
		if (self.minibuffer_mode) {
			self.showFindOptionsInStatusArea ();
		}
		else if (c.config.getBool ('use-find-dialog', __kwargtrans__ ({py_default: true}))) {
			g.app.gui.openFindDialog (c);
		}
		else {
			c.frame.log.selectTab ('Find');
		}
		self.addFindStringToLabel (__kwargtrans__ ({protect: false}));
		if (escapes === null) {
			var escapes = [];
		}
		k.getArgEscapes = escapes;
		k.getArgEscapeFlag = false;
		k.get1Arg (event, __kwargtrans__ ({handler: handler, tabList: self.findTextList, completion: true}));
	});},
	get updateChangeList () {return __get__ (this, function (self, s) {
		if (!__in__ (s, self.changeTextList)) {
			self.changeTextList.append (s);
		}
	});},
	get updateFindList () {return __get__ (this, function (self, s) {
		if (!__in__ (s, self.findTextList)) {
			self.findTextList.append (s);
		}
	});},
	get wordSearchBackward () {return __get__ (this, cmd ('word-search-backward') (function (self, event) {
		self.setupArgs (__kwargtrans__ ({forward: false, regexp: false, word: true}));
		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Word Search Backward: ', handler: self.wordSearch1}));
	}));},
	get wordSearchForward () {return __get__ (this, cmd ('word-search-forward') (function (self, event) {
		self.setupArgs (__kwargtrans__ ({forward: true, regexp: false, word: true}));
		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Word Search: ', handler: self.wordSearch1}));
	}));},
	get wordSearch1 () {return __get__ (this, function (self, event) {
		var k = self.k;
		self.lastStateHelper ();
		self.generalSearchHelper (k.arg);
	});},
	get toggleFindCollapesNodes () {return __get__ (this, cmd ('toggle-find-collapses-nodes') (function (self, event) {
		var c = self.c;
		c.sparse_find = !(c.sparse_find);
		if (!(g.unitTesting)) {
			g.es ('sparse_find', c.sparse_find);
		}
	}));},
	get toggleIgnoreCaseOption () {return __get__ (this, cmd ('toggle-find-ignore-case-option') (function (self, event) {
		return self.toggleOption ('ignore_case');
	}));},
	get toggleMarkChangesOption () {return __get__ (this, cmd ('toggle-find-mark-changes-option') (function (self, event) {
		return self.toggleOption ('mark_changes');
	}));},
	get toggleMarkFindsOption () {return __get__ (this, cmd ('toggle-find-mark-finds-option') (function (self, event) {
		return self.toggleOption ('mark_finds');
	}));},
	get toggleRegexOption () {return __get__ (this, cmd ('toggle-find-regex-option') (function (self, event) {
		return self.toggleOption ('pattern_match');
	}));},
	get toggleSearchBodyOption () {return __get__ (this, cmd ('toggle-find-in-body-option') (function (self, event) {
		return self.toggleOption ('search_body');
	}));},
	get toggleSearchHeadlineOption () {return __get__ (this, cmd ('toggle-find-in-headline-option') (function (self, event) {
		return self.toggleOption ('search_headline');
	}));},
	get toggleWholeWordOption () {return __get__ (this, cmd ('toggle-find-word-option') (function (self, event) {
		return self.toggleOption ('whole_word');
	}));},
	get toggleWrapSearchOption () {return __get__ (this, cmd ('toggle-find-wrap-around-option') (function (self, event) {
		return self.toggleOption ('wrap');
	}));},
	get toggleOption () {return __get__ (this, function (self, checkbox_name) {
		var __left0__ = tuple ([self.c, self.c.findCommands]);
		var c = __left0__ [0];
		var fc = __left0__ [1];
		self.ftm.toggle_checkbox (checkbox_name);
		var options = fc.computeFindOptionsInStatusArea ();
		c.frame.statusLine.put (options);
	});},
	get setFindScopeEveryWhere () {return __get__ (this, cmd ('set-find-everywhere') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		return self.setFindScope ('entire-outline');
	}));},
	get setFindScopeNodeOnly () {return __get__ (this, cmd ('set-find-node-only') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		return self.setFindScope ('node-only');
	}));},
	get setFindScopeSuboutlineOnly () {return __get__ (this, cmd ('set-find-suboutline-only') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		return self.setFindScope ('suboutline-only');
	}));},
	get setFindScope () {return __get__ (this, function (self, where) {
		var __left0__ = tuple ([self.c, self.c.findCommands]);
		var c = __left0__ [0];
		var fc = __left0__ [1];
		self.ftm.set_radio_button (where);
		var options = fc.computeFindOptionsInStatusArea ();
		c.frame.statusLine.put (options);
	});},
	get showFindOptions () {return __get__ (this, cmd ('show-find-options') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		var frame = self.c.frame;
		frame.clearStatusLine ();
		var __left0__ = self.computeFindOptions ();
		var part1 = __left0__ [0];
		var part2 = __left0__ [1];
		frame.putStatusLine (part1, __kwargtrans__ ({bg: 'blue'}));
		frame.putStatusLine (part2);
	}));},
	get computeFindOptions () {return __get__ (this, function (self) {
		var z = [];
		var head = self.search_headline;
		var body = self.search_body;
		if (self.suboutline_only) {
			var scope = 'tree';
		}
		else if (self.node_only) {
			var scope = 'node';
		}
		else {
			var scope = 'all';
		}
		var head = (head ? 'head' : '');
		var body = (body ? 'body' : '');
		var sep = (head && body ? '+' : '');
		var part1 = '{}{}{} {}  '.format (head, sep, body, scope);
		var regex = self.pattern_match;
		if (regex) {
			z.append ('regex');
		}
		var table = tuple ([tuple (['reverse', 'reverse']), tuple (['ignore_case', 'noCase']), tuple (['whole_word', 'word']), tuple (['wrap', 'wrap']), tuple (['mark_changes', 'markChg']), tuple (['mark_finds', 'markFnd'])]);
		for (var [ivar, s] of table) {
			var val = getattr (self, ivar);
			if (val) {
				z.append (s);
			}
		}
		var part2 = ' '.join (z);
		return tuple ([part1, part2]);
	});},
	get setupChangePattern () {return __get__ (this, function (self, pattern) {
		self.ftm.setChangeText (pattern);
	});},
	get setupSearchPattern () {return __get__ (this, function (self, pattern) {
		self.ftm.setFindText (pattern);
	});},
	get change () {return __get__ (this, cmd ('replace') (function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (self.checkArgs ()) {
			self.initInHeadline ();
			self.changeSelection ();
		}
	}));},
	py_replace: change,
	get changeAll () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self.c.p, self.c.undoer]);
		var c = __left0__ [0];
		var current = __left0__ [1];
		var u = __left0__ [2];
		var undoType = 'Replace All';
		var t1 = time.process_time ();
		if (!(self.checkArgs ())) {
			return ;
		}
		self.initInHeadline ();
		var saveData = self.save ();
		self.initBatchCommands ();
		var count = 0;
		u.beforeChangeGroup (current, undoType);
		if (!(self.find_text)) {
			return ;
		}
		if (!(self.search_headline) && !(self.search_body)) {
			return ;
		}
		self.change_text = self.replaceBackSlashes (self.change_text);
		if (self.pattern_match) {
			var ok = self.precompilePattern ();
			if (!(ok)) {
				return ;
			}
		}
		if (self.node_only) {
			var positions = [c.p];
		}
		else if (self.suboutline_only) {
			var positions = c.p.self_and_subtree ();
		}
		else {
			var positions = c.all_unique_positions ();
		}
		var count = 0;
		for (var p of positions) {
			var __left0__ = tuple ([0, 0]);
			var count_h = __left0__ [0];
			var count_b = __left0__ [1];
			var undoData = u.beforeChangeNodeContents (p);
			if (self.search_headline) {
				var __left0__ = self.batchSearchAndReplace (p.h);
				var count_h = __left0__ [0];
				var new_h = __left0__ [1];
				if (count_h) {
					count += count_h;
					p.h = new_h;
				}
			}
			if (self.search_body) {
				var __left0__ = self.batchSearchAndReplace (p.b);
				var count_b = __left0__ [0];
				var new_b = __left0__ [1];
				if (count_b) {
					count += count_b;
					p.b = new_b;
				}
			}
			if (count_h || count_b) {
				u.afterChangeNodeContents (p, 'Replace All', undoData);
			}
		}
		var p = c.p;
		u.afterChangeGroup (p, undoType, __kwargtrans__ ({reportFlag: true}));
		var t2 = time.process_time ();
		g.es_print ('changed {} instances{} in {} sec.'.format (count, g.plural (count), t2 - t1));
		c.recolor ();
		c.redraw (p);
		self.restore (saveData);
	});},
	get batchSearchAndReplace () {return __get__ (this, function (self, s) {
		if (sys.platform.lower ().startswith ('win')) {
			var s = s.py_replace ('\r', '');
		}
		if (!(s)) {
			return tuple ([false, null]);
		}
		if (self.pattern_match) {
			return self.batchRegexReplace (s);
		}
		if (self.whole_word) {
			return self.batchWordReplace (s);
		}
		return self.batchPlainReplace (s);
	});},
	get batchPlainReplace () {return __get__ (this, function (self, s) {
		var __left0__ = tuple ([self.find_text, self.change_text]);
		var find = __left0__ [0];
		var change = __left0__ [1];
		var s0 = s;
		var find0 = self.replaceBackSlashes (find);
		if (self.ignore_case) {
			var s = s0.lower ();
			var find = find0.lower ();
		}
		var __left0__ = tuple ([0, 0, []]);
		var count = __left0__ [0];
		var prev_i = __left0__ [1];
		var result = __left0__ [2];
		while (true) {
			var i = s.find (find, prev_i);
			if (i == -(1)) {
				break;
			}
			count++;
			result.append (s0.__getslice__ (prev_i, i, 1));
			result.append (change);
			var prev_i = i + len (find);
		}
		result.append (s0.__getslice__ (prev_i, null, 1));
		return tuple ([count, ''.join (result)]);
	});},
	get batchRegexReplace () {return __get__ (this, function (self, s) {
		var __left0__ = tuple ([0, 0, []]);
		var count = __left0__ [0];
		var prev_i = __left0__ [1];
		var result = __left0__ [2];
		var flags = re.MULTILINE;
		if (self.ignore_case) {
			flags |= re.IGNORECASE;
		}
		for (var m of re.finditer (self.find_text, s, flags)) {
			count++;
			var i = m.start ();
			result.append (s.__getslice__ (prev_i, i, 1));
			var groups = m.groups ();
			if (groups) {
				var change_text = self.makeRegexSubs (self.change_text, groups);
			}
			else {
				var change_text = self.change_text;
			}
			result.append (change_text);
			var prev_i = m.end ();
		}
		result.append (s.__getslice__ (prev_i, null, 1));
		var s = ''.join (result);
		return tuple ([count, s]);
	});},
	get batchWordReplace () {return __get__ (this, function (self, s) {
		var __left0__ = tuple ([self.find_text, self.change_text]);
		var find = __left0__ [0];
		var change = __left0__ [1];
		var s0 = s;
		var find0 = self.replaceBackSlashes (find);
		if (self.ignore_case) {
			var s = s0.lower ();
			var find = find0.lower ();
		}
		var __left0__ = tuple ([0, 0, []]);
		var count = __left0__ [0];
		var prev_i = __left0__ [1];
		var result = __left0__ [2];
		while (true) {
			var i = s.find (find, prev_i);
			if (i == -(1)) {
				break;
			}
			result.append (s0.__getslice__ (prev_i, i, 1));
			if (g.match_word (s, i, find)) {
				count++;
				result.append (change);
			}
			else {
				result.append (find0);
			}
			var prev_i = i + len (find);
		}
		result.append (s0.__getslice__ (prev_i, null, 1));
		return tuple ([count, ''.join (result)]);
	});},
	get changeSelection () {return __get__ (this, function (self) {
		var c = self.c;
		var p = self.p || c.p;
		var wrapper = c.frame.body && c.frame.body.wrapper;
		var w = (self.in_headline ? c.edit_widget (p) : wrapper);
		if (!(w)) {
			self.in_headline = false;
			var w = wrapper;
		}
		if (!(w)) {
			return false;
		}
		var __left0__ = w.getSelectionRange ();
		var oldSel = __left0__;
		var sel = __left0__;
		var __left0__ = sel;
		var start = __left0__ [0];
		var end = __left0__ [1];
		if (start > end) {
			var __left0__ = tuple ([end, start]);
			var start = __left0__ [0];
			var end = __left0__ [1];
		}
		if (start == end) {
			g.es ('no text selected');
			return false;
		}
		var __left0__ = oldSel;
		var start = __left0__ [0];
		var end = __left0__ [1];
		var change_text = self.change_text;
		if (self.pattern_match && self.match_obj) {
			var groups = self.match_obj.groups ();
			if (groups) {
				var change_text = self.makeRegexSubs (change_text, groups);
			}
		}
		var change_text = self.replaceBackSlashes (change_text);
		for (var w2 of tuple ([w, self.s_ctrl])) {
			if (start != end) {
				w2.delete (start, end);
			}
			w2.insert (start, change_text);
			w2.setInsertPoint ((self.reverse ? start : start + len (change_text)));
		}
		w.setSelectionRange (start, start + len (change_text));
		c.widgetWantsFocus (w);
		if (self.mark_changes) {
			p.setMarked ();
			p.setDirty ();
		}
		if (self.in_headline) {
			// pass;
		}
		else {
			c.frame.body.onBodyChanged ('Change', __kwargtrans__ ({oldSel: oldSel}));
		}
		c.frame.tree.updateIcon (p);
		return true;
	});},
	get makeRegexSubs () {return __get__ (this, function (self, change_text, groups) {
		var repl = function (match_object) {
			var n = int (match_object.group (1)) - 1;
			if ((0 <= n && n < len (groups))) {
				return groups [n].py_replace ('\\b', '\\\\b').py_replace ('\\f', '\\\\f').py_replace ('\\n', '\\\\n').py_replace ('\\r', '\\\\r').py_replace ('\\t', '\\\\t').py_replace ('\\v', '\\\\v');
			}
			return match_object.group (0);
		};
		var result = re.sub ('\\\\([0-9])', repl, change_text);
		return result;
	});},
	get changeThenFind () {return __get__ (this, function (self) {
		if (!(self.checkArgs ())) {
			return ;
		}
		self.initInHeadline ();
		if (self.changeSelection ()) {
			self.findNext (false);
		}
	});},
	get cloneFindTag () {return __get__ (this, function (self, tag) {
		var __left0__ = tuple ([self.c, self.c.undoer]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var tc = c.theTagController;
		if (!(tc)) {
			g.es_print ('nodetags not active');
			return 0;
		}
		var clones = tc.get_tagged_nodes (tag);
		if (clones) {
			var undoType = 'Clone Find Tag';
			var undoData = u.beforeInsertNode (c.p);
			var found = self.createCloneTagNodes (clones);
			u.afterInsertNode (found, undoType, undoData);
			c.setChanged ();
			c.selectPosition (found);
			c.redraw ();
		}
		else {
			g.es_print ('tag not found: {}'.format (self.find_text));
		}
		return len (clones);
	});},
	get createCloneTagNodes () {return __get__ (this, function (self, clones) {
		var __left0__ = tuple ([self.c, self.c.p]);
		var c = __left0__ [0];
		var p = __left0__ [1];
		var found = c.lastTopLevel ().insertAfter ();
		found.h = 'Found Tag: {}'.format (self.find_text);
		for (var p of clones) {
			var p2 = p.copy ();
			var n = found.numberOfChildren ();
			p2._linkCopiedAsNthChild (found, n);
		}
		return found;
	});},
	get findAll () {return __get__ (this, function (self, clone_find_all, clone_find_all_flattened) {
		if (typeof clone_find_all == 'undefined' || (clone_find_all != null && clone_find_all.hasOwnProperty ("__kwargtrans__"))) {;
			var clone_find_all = false;
		};
		if (typeof clone_find_all_flattened == 'undefined' || (clone_find_all_flattened != null && clone_find_all_flattened.hasOwnProperty ("__kwargtrans__"))) {;
			var clone_find_all_flattened = false;
		};
		var __left0__ = tuple ([self.c, clone_find_all_flattened]);
		var c = __left0__ [0];
		var flatten = __left0__ [1];
		var clone_find = clone_find_all || flatten;
		if (flatten) {
			var undoType = 'Clone Find All Flattened';
		}
		else if (clone_find_all) {
			var undoType = 'Clone Find All';
		}
		else {
			var undoType = 'Find All';
		}
		if (!(self.checkArgs ())) {
			return 0;
		}
		self.initInHeadline ();
		var data = self.save ();
		self.initBatchCommands ();
		if (self.pattern_match || self.findAllUniqueFlag) {
			var ok = self.precompilePattern ();
			if (!(ok)) {
				return 0;
			}
		}
		if (self.suboutline_only) {
			var p = c.p;
			var after = p.nodeAfterTree ();
		}
		else {
			var p = c.rootPosition ();
			var after = null;
		}
		var old_sparse_find = c.sparse_find;
		try {
			c.sparse_find = false;
			if (clone_find) {
				var count = self.doCloneFindAll (after, data, flatten, p, undoType);
			}
			else {
				self.p = p;
				var count = self.doFindAll (after, data, p, undoType);
			}
		}
		finally {
			c.sparse_find = old_sparse_find;
		}
		if (count) {
			c.redraw ();
		}
		g.es ('found', count, 'matches for', self.find_text);
		return count;
	});},
	get doCloneFindAll () {return __get__ (this, function (self, after, data, flatten, p, undoType) {
		var __left0__ = tuple ([self.c, self.c.undoer]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var __left0__ = tuple ([0, null]);
		var count = __left0__ [0];
		var found = __left0__ [1];
		var __left0__ = tuple ([[], set ()]);
		var clones = __left0__ [0];
		var skip = __left0__ [1];
		while (p && p != after) {
			var progress = p.copy ();
			if (__in__ (p.v, skip)) {
				p.moveToThreadNext ();
			}
			else {
				var count = self.doCloneFindAllHelper (clones, count, flatten, p, skip);
			}
		}
		if (clones) {
			var undoData = u.beforeInsertNode (c.p);
			var found = self.createCloneFindAllNodes (clones, flatten);
			u.afterInsertNode (found, undoType, undoData);
			c.setChanged ();
			c.selectPosition (found);
		}
		else {
			self.restore (data);
		}
		return count;
	});},
	get createCloneFindAllNodes () {return __get__ (this, function (self, clones, flattened) {
		var c = self.c;
		var found = c.lastTopLevel ().insertAfter ();
		found.h = 'Found:{}'.format (self.find_text);
		var status = self.getFindResultStatus (__kwargtrans__ ({find_all: true}));
		var status = status.strip ().lstrip ('(').rstrip (')').strip ();
		var flat = (flattened ? 'flattened, ' : '');
		found.b = '@nosearch\n\n# {}{}\n\n# found {} nodes'.format (flat, status, len (clones));
		for (var p of clones) {
			var p2 = p.copy ();
			var n = found.numberOfChildren ();
			p2._linkCopiedAsNthChild (found, n);
		}
		found.v.children.py_sort (__kwargtrans__ ({key: (function __lambda__ (v) {
			return v.h.lower ();
		})}));
		return found;
	});},
	get doCloneFindAllHelper () {return __get__ (this, function (self, clones, count, flatten, p, skip) {
		if (g.inAtNosearch (p)) {
			p.moveToNodeAfterTree ();
			return count;
		}
		var found = self.findNextBatchMatch (p);
		if (found) {
			if (!(__in__ (p, clones))) {
				clones.append (p.copy ());
			}
			count++;
		}
		if (flatten) {
			skip.add (p.v);
			p.moveToThreadNext ();
		}
		else if (found) {
			for (var p2 of p.self_and_subtree (__kwargtrans__ ({copy: false}))) {
				skip.add (p2.v);
			}
			p.moveToNodeAfterTree ();
		}
		else {
			p.moveToThreadNext ();
		}
		return count;
	});},
	get doFindAll () {return __get__ (this, function (self, after, data, p, undoType) {
		var __left0__ = tuple ([self.c, self.c.undoer, self.s_ctrl]);
		var c = __left0__ [0];
		var u = __left0__ [1];
		var w = __left0__ [2];
		var both = self.search_body && self.search_headline;
		var __left0__ = tuple ([0, null, []]);
		var count = __left0__ [0];
		var found = __left0__ [1];
		var result = __left0__ [2];
		while (1) {
			var __left0__ = self.findNextMatch ();
			var pos = __left0__ [0];
			var newpos = __left0__ [1];
			if (!(self.p)) {
				self.p = c.p;
			}
			if (pos === null) {
				break;
			}
			count++;
			var s = w.getAllText ();
			var __left0__ = g.getLine (s, pos);
			var i = __left0__ [0];
			var j = __left0__ [1];
			var line = s.__getslice__ (i, j, 1);
			if (self.findAllUniqueFlag) {
				var m = self.match_obj;
				if (m) {
					self.unique_matches.add (m.group (0).strip ());
				}
			}
			else if (both) {
				result.append (__mod__ ('%s%s\n%s%s\n', tuple (['-' * 20, self.p.h, (self.in_headline ? 'head: ' : 'body: '), line.rstrip () + '\n'])));
			}
			else if (self.p.isVisited ()) {
				result.append (line.rstrip () + '\n');
			}
			else {
				result.append (__mod__ ('%s%s\n%s', tuple (['-' * 20, self.p.h, line.rstrip () + '\n'])));
				self.p.setVisited ();
			}
		}
		if (result || self.unique_matches) {
			var undoData = u.beforeInsertNode (c.p);
			if (self.findAllUniqueFlag) {
				var found = self.createFindUniqueNode ();
				var count = len (list (self.unique_matches));
			}
			else {
				var found = self.createFindAllNode (result);
			}
			u.afterInsertNode (found, undoType, undoData);
			c.selectPosition (found);
			c.setChanged ();
		}
		else {
			self.restore (data);
		}
		return count;
	});},
	get createFindAllNode () {return __get__ (this, function (self, result) {
		var c = self.c;
		var found = c.lastTopLevel ().insertAfter ();
		found.h = 'Found All:{}'.format (self.find_text);
		var status = self.getFindResultStatus (__kwargtrans__ ({find_all: true}));
		var status = status.strip ().lstrip ('(').rstrip (')').strip ();
		found.b = '# {}\n{}'.format (status, ''.join (result));
		return found;
	});},
	get createFindUniqueNode () {return __get__ (this, function (self) {
		var c = self.c;
		var found = c.lastTopLevel ().insertAfter ();
		found.h = 'Found Unique Regex:{}'.format (self.find_text);
		var result = sorted (self.unique_matches);
		found.b = '\n'.join (result);
		return found;
	});},
	get findNextBatchMatch () {return __get__ (this, function (self, p) {
		var table = [];
		if (self.search_headline) {
			table.append (p.h);
		}
		if (self.search_body) {
			table.append (p.b);
		}
		for (var s of table) {
			self.reverse = false;
			var __left0__ = self.searchHelper (s, 0, len (s), self.find_text);
			var pos = __left0__ [0];
			var newpos = __left0__ [1];
			if (pos != -(1)) {
				return true;
			}
		}
		return false;
	});},
	get findNext () {return __get__ (this, function (self, initFlag) {
		if (typeof initFlag == 'undefined' || (initFlag != null && initFlag.hasOwnProperty ("__kwargtrans__"))) {;
			var initFlag = true;
		};
		if (!(self.checkArgs ())) {
			return false;
		}
		if (initFlag) {
			self.initInHeadline ();
			var data = self.save ();
			self.initInteractiveCommands ();
		}
		else {
			var data = self.save ();
		}
		var __left0__ = self.findNextMatch ();
		var pos = __left0__ [0];
		var newpos = __left0__ [1];
		if (pos === null) {
			self.restore (data);
			self.showStatus (false);
			return false;
		}
		self.showSuccess (pos, newpos);
		self.showStatus (true);
		return true;
	});},
	get getFindResultStatus () {return __get__ (this, function (self, find_all) {
		if (typeof find_all == 'undefined' || (find_all != null && find_all.hasOwnProperty ("__kwargtrans__"))) {;
			var find_all = false;
		};
		var status = [];
		if (self.whole_word) {
			status.append ((find_all ? 'word' : 'word-only'));
		}
		if (self.ignore_case) {
			status.append ('ignore-case');
		}
		if (self.pattern_match) {
			status.append ('regex');
		}
		if (find_all) {
			if (self.search_headline) {
				status.append ('head');
			}
			if (self.search_body) {
				status.append ('body');
			}
		}
		else if (!(self.search_headline)) {
			status.append ('body-only');
		}
		else if (!(self.search_body)) {
			status.append ('headline-only');
		}
		if (!(find_all)) {
			if (self.wrapping) {
				status.append ('wrapping');
			}
			if (self.suboutline_only) {
				status.append ('[outline-only]');
			}
			else if (self.node_only) {
				status.append ('[node-only]');
			}
		}
		return (status ? ' ({})'.format (', '.join (status)) : '');
	});},
	get findNextMatch () {return __get__ (this, function (self) {
		var __left0__ = tuple ([self.c, self.p]);
		var c = __left0__ [0];
		var p = __left0__ [1];
		if (!(self.search_headline) && !(self.search_body)) {
			return tuple ([null, null]);
		}
		if (!(self.find_text)) {
			return tuple ([null, null]);
		}
		self.errors = 0;
		var attempts = 0;
		if (self.pattern_match || self.findAllUniqueFlag) {
			var ok = self.precompilePattern ();
			if (!(ok)) {
				return tuple ([null, null]);
			}
		}
		while (p) {
			var __left0__ = self.search ();
			var pos = __left0__ [0];
			var newpos = __left0__ [1];
			if (self.errors) {
				g.trace ('find errors');
				break;
			}
			if (pos !== null) {
				if (self.mark_finds) {
					p.setMarked ();
					p.setDirty ();
					if (!(self.changeAllFlag)) {
						c.frame.tree.updateIcon (p);
					}
				}
				return tuple ([pos, newpos]);
			}
			if (self.shouldStayInNode (p)) {
				self.in_headline = !(self.in_headline);
				self.initNextText ();
			}
			else {
				attempts++;
				var __left0__ = self.nextNodeAfterFail (p);
				var p = __left0__;
				self.p = __left0__;
				if (p) {
					self.in_headline = self.firstSearchPane ();
					self.initNextText ();
				}
			}
		}
		return tuple ([null, null]);
	});},
	get doWrap () {return __get__ (this, function (self) {
		var c = self.c;
		if (self.reverse) {
			var p = c.rootPosition ();
			while (p && p.hasNext ()) {
				var p = p.py_next ();
			}
			var p = p.lastNode ();
			return p;
		}
		return c.rootPosition ();
	});},
	get firstSearchPane () {return __get__ (this, function (self) {
		if (self.search_headline && self.search_body) {
			if (self.reverse) {
				return false;
			}
			return true;
		}
		if (self.search_headline || self.search_body) {
			return self.search_headline;
		}
		g.trace ('can not happen: no search enabled');
		return false;
	});},
	get initNextText () {return __get__ (this, function (self, ins) {
		if (typeof ins == 'undefined' || (ins != null && ins.hasOwnProperty ("__kwargtrans__"))) {;
			var ins = null;
		};
		var c = self.c;
		var p = self.p || c.p;
		var s = (self.in_headline ? p.h : p.b);
		var w = self.s_ctrl;
		var tree = c.frame && c.frame.tree;
		if (tree && hasattr (tree, 'killEditing')) {
			tree.killEditing ();
		}
		if (self.reverse) {
			var __left0__ = w.sel;
			var i = __left0__ [0];
			var j = __left0__ [1];
			if (ins === null) {
				if (i !== null && j !== null && i != j) {
					var ins = min (i, j);
				}
			}
		}
		else if (ins === null) {
			var ins = 0;
		}
		self.init_s_ctrl (s, ins);
	});},
	get nextNodeAfterFail () {return __get__ (this, function (self, p) {
		var c = self.c;
		var wrap = self.wrapping && !(self.node_only) && !(self.suboutline_only) && !(c.hoistStack);
		if (wrap && !(self.wrapPosition)) {
			self.wrapPosition = p.copy ();
			self.wrapPos = (self.reverse ? 0 : len (p.b));
		}
		var p = (self.reverse ? p.threadBack () : p.threadNext ());
		if (p && self.outsideSearchRange (p)) {
			return null;
		}
		if (!(p) && wrap) {
			var p = self.doWrap ();
		}
		if (!(p)) {
			return null;
		}
		if (wrap && p == self.wrapPosition) {
			return null;
		}
		return p;
	});},
	get outsideSearchRange () {return __get__ (this, function (self, p) {
		var c = self.c;
		if (!(p)) {
			return true;
		}
		if (self.node_only) {
			return true;
		}
		if (self.suboutline_only) {
			if (self.onlyPosition) {
				if (p != self.onlyPosition && !(self.onlyPosition.isAncestorOf (p))) {
					return true;
				}
			}
			else {
				g.trace ('Can not happen: onlyPosition!', p.h);
				return true;
			}
		}
		if (c.hoistStack) {
			var bunch = c.hoistStack [-(1)];
			if (!(bunch.p.isAncestorOf (p))) {
				g.trace ('outside hoist', p.h);
				g.warning ('found match outside of hoisted outline');
				return true;
			}
		}
		return false;
	});},
	get precompilePattern () {return __get__ (this, function (self) {
		try {
			var flags = re.MULTILINE;
			if (self.ignore_case) {
				flags |= re.IGNORECASE;
			}
			var s = self.find_text;
			self.re_obj = re.compile (s, flags);
			return true;
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				g.warning ('invalid regular expression:', self.find_text);
				self.errors++;
				return false;
			}
			else {
				throw __except0__;
			}
		}
	});},
	get shouldStayInNode () {return __get__ (this, function (self, p) {
		return self.search_headline && self.search_body && (self.reverse && !(self.in_headline) || !(self.reverse) && self.in_headline);
	});},
	get resetWrap () {return __get__ (this, function (self, event) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		self.wrapPosition = null;
		self.onlyPosition = null;
	});},
	get search () {return __get__ (this, function (self) {
		var c = self.c;
		var p = self.p || c.p;
		if ((self.ignore_dups || self.find_def_data) && __in__ (p.v, self.find_seen)) {
			return tuple ([null, null]);
		}
		var w = self.s_ctrl;
		var index = w.getInsertPoint ();
		var s = w.getAllText ();
		if (sys.platform.lower ().startswith ('win')) {
			var s = s.py_replace ('\r', '');
		}
		if (!(s)) {
			return tuple ([null, null]);
		}
		var stopindex = (self.reverse ? 0 : len (s));
		var __left0__ = self.searchHelper (s, index, stopindex, self.find_text);
		var pos = __left0__ [0];
		var newpos = __left0__ [1];
		if (self.in_headline && !(self.search_headline)) {
			return tuple ([null, null]);
		}
		if (!(self.in_headline) && !(self.search_body)) {
			return tuple ([null, null]);
		}
		if (pos == -(1)) {
			return tuple ([null, null]);
		}
		if (self.passedWrapPoint (p, pos, newpos)) {
			self.wrapPosition = null;
			return tuple ([null, null]);
		}
		if (0) {
			g.trace ('CHECK: index: {} in_head: {} search_head: {}'.format (index, self.in_headline, self.search_headline));
			if (self.in_headline && self.search_headline && index !== null && __in__ (index, tuple ([pos, newpos]))) {
				return tuple ([null, null]);
			}
		}
		var ins = (self.reverse ? min (pos, newpos) : max (pos, newpos));
		w.setSelectionRange (pos, newpos, __kwargtrans__ ({insert: ins}));
		if (self.ignore_dups || self.find_def_data) {
			self.find_seen.add (p.v);
		}
		return tuple ([pos, newpos]);
	});},
	get passedWrapPoint () {return __get__ (this, function (self, p, pos, newpos) {
		return self.wrapping && self.wrapPosition !== null && p == self.wrapPosition && (self.reverse && pos < self.wrapPos || !(self.reverse) && newpos > self.wrapPos);
	});},
	get searchHelper () {return __get__ (this, function (self, s, i, j, pattern) {
		var backwards = self.reverse;
		var nocase = self.ignore_case;
		var regexp = self.pattern_match || self.findAllUniqueFlag;
		var word = self.whole_word;
		if (backwards) {
			var __left0__ = tuple ([j, i]);
			var i = __left0__ [0];
			var j = __left0__ [1];
		}
		if (!(s.__getslice__ (i, j, 1)) || !(pattern)) {
			return tuple ([-(1), -(1)]);
		}
		if (regexp) {
			var __left0__ = self.regexHelper (s, i, j, pattern, backwards, nocase);
			var pos = __left0__ [0];
			var newpos = __left0__ [1];
		}
		else if (backwards) {
			var __left0__ = self.backwardsHelper (s, i, j, pattern, nocase, word);
			var pos = __left0__ [0];
			var newpos = __left0__ [1];
		}
		else {
			var __left0__ = self.plainHelper (s, i, j, pattern, nocase, word);
			var pos = __left0__ [0];
			var newpos = __left0__ [1];
		}
		return tuple ([pos, newpos]);
	});},
	get regexHelper () {return __get__ (this, function (self, s, i, j, pattern, backwards, nocase) {
		var re_obj = self.re_obj;
		if (!(re_obj)) {
			g.trace ('can not happen: no re_obj');
			return tuple ([-(1), -(1)]);
		}
		if (backwards) {
			var last_mo = null;
			var i = 0;
			while (i < len (s)) {
				var mo = re_obj.search (s, i, j);
				if (!(mo)) {
					break;
				}
				i++;
				var last_mo = mo;
			}
			var mo = last_mo;
		}
		else {
			var mo = re_obj.search (s, i, j);
		}
		while (mo && (0 <= i && i <= len (s))) {
			if (mo.start () == mo.end ()) {
				if (backwards) {
					i--;
					while ((0 <= i && i < len (s))) {
						var mo = re_obj.match (s, i, j);
						if (mo) {
							break;
						}
						i--;
					}
				}
				else {
					i++;
					var mo = re_obj.search (s, i, j);
				}
			}
			else {
				self.match_obj = mo;
				return tuple ([mo.start (), mo.end ()]);
			}
		}
		self.match_obj = null;
		return tuple ([-(1), -(1)]);
	});},
	debugIndices: [],
	get backwardsHelper () {return __get__ (this, function (self, s, i, j, pattern, nocase, word) {
		if (nocase) {
			var s = s.lower ();
			var pattern = pattern.lower ();
		}
		var pattern = self.replaceBackSlashes (pattern);
		var n = len (pattern);
		var i = max (0, i);
		var j = min (len (s), j);
		if (s.find (pattern) == -(1)) {
			return tuple ([-(1), -(1)]);
		}
		if (word) {
			while (1) {
				var k = s.rfind (pattern, i, j);
				if (k == -(1)) {
					return tuple ([-(1), -(1)]);
				}
				if (self.matchWord (s, k, pattern)) {
					return tuple ([k, k + n]);
				}
				var j = max (0, k - 1);
			}
		}
		else {
			var k = s.rfind (pattern, i, j);
			if (k == -(1)) {
				return tuple ([-(1), -(1)]);
			}
			return tuple ([k, k + n]);
		}
		return tuple ([-(1), -(1)]);
	});},
	get plainHelper () {return __get__ (this, function (self, s, i, j, pattern, nocase, word) {
		if (nocase) {
			var s = s.lower ();
			var pattern = pattern.lower ();
		}
		var pattern = self.replaceBackSlashes (pattern);
		var n = len (pattern);
		if (word) {
			while (1) {
				var k = s.find (pattern, i, j);
				if (k == -(1)) {
					return tuple ([-(1), -(1)]);
				}
				if (self.matchWord (s, k, pattern)) {
					return tuple ([k, k + n]);
				}
				var i = k + n;
			}
		}
		else {
			var k = s.find (pattern, i, j);
			if (k == -(1)) {
				return tuple ([-(1), -(1)]);
			}
			return tuple ([k, k + n]);
		}
		return tuple ([-(1), -(1)]);
	});},
	get matchWord () {return __get__ (this, function (self, s, i, pattern) {
		var pattern = self.replaceBackSlashes (pattern);
		if (!(s) || !(pattern) || !(g.match (s, i, pattern))) {
			return false;
		}
		var __left0__ = tuple ([pattern [0], pattern [-(1)]]);
		var pat1 = __left0__ [0];
		var pat2 = __left0__ [1];
		var n = len (pattern);
		var ch1 = ((0 <= i - 1 && i - 1 < len (s)) ? s [i - 1] : '.');
		var ch2 = ((0 <= i + n && i + n < len (s)) ? s [i + n] : '.');
		var isWordPat1 = g.isWordChar (pat1);
		var isWordPat2 = g.isWordChar (pat2);
		var isWordCh1 = g.isWordChar (ch1);
		var isWordCh2 = g.isWordChar (ch2);
		var inWord = isWordPat1 && isWordCh1 || isWordPat2 && isWordCh2;
		return !(inWord);
	});},
	get replaceBackSlashes () {return __get__ (this, function (self, s) {
		var i = 0;
		while (i + 1 < len (s)) {
			if (s [i] == '\\') {
				var ch = s [i + 1];
				if (ch == '\\') {
					var s = s.__getslice__ (0, i, 1) + s.__getslice__ (i + 1, null, 1);
				}
				else if (ch == 'n') {
					var s = (s.__getslice__ (0, i, 1) + '\n') + s.__getslice__ (i + 2, null, 1);
				}
				else if (ch == 't') {
					var s = (s.__getslice__ (0, i, 1) + '\t') + s.__getslice__ (i + 2, null, 1);
				}
				else {
					i++;
				}
			}
			i++;
		}
		return s;
	});},
	get setupArgs () {return __get__ (this, function (self, forward, regexp, word) {
		if (typeof forward == 'undefined' || (forward != null && forward.hasOwnProperty ("__kwargtrans__"))) {;
			var forward = false;
		};
		if (typeof regexp == 'undefined' || (regexp != null && regexp.hasOwnProperty ("__kwargtrans__"))) {;
			var regexp = false;
		};
		if (typeof word == 'undefined' || (word != null && word.hasOwnProperty ("__kwargtrans__"))) {;
			var word = false;
		};
		if (__in__ (forward, tuple ([true, false]))) {
			self.reverse = !(forward);
		}
		if (__in__ (regexp, tuple ([true, false]))) {
			self.pattern_match = regexp;
		}
		if (__in__ (word, tuple ([true, false]))) {
			self.whole_word = word;
		}
		self.showFindOptions ();
	});},
	get showFindOptionsInStatusArea () {return __get__ (this, function (self) {
		var c = self.c;
		var s = self.computeFindOptionsInStatusArea ();
		c.frame.putStatusLine (s);
	});},
	get computeFindOptionsInStatusArea () {return __get__ (this, function (self) {
		var c = self.c;
		var ftm = c.findCommands.ftm;
		var table = tuple ([tuple (['Word', ftm.check_box_whole_word]), tuple (['Ig-case', ftm.check_box_ignore_case]), tuple (['regeXp', ftm.check_box_regexp]), tuple (['Body', ftm.check_box_search_body]), tuple (['Head', ftm.check_box_search_headline]), tuple (['wrap-Around', ftm.check_box_wrap_around]), tuple (['mark-Changes', ftm.check_box_mark_changes]), tuple (['mark-Finds', ftm.check_box_mark_finds])]);
		var result = (function () {
			var __accu0__ = [];
			for (var [option, ivar] of table) {
				if (ivar.checkState ()) {
					__accu0__.append (option);
				}
			}
			return __accu0__;
		}) ();
		var table2 = tuple ([tuple (['Suboutline', ftm.radio_button_suboutline_only]), tuple (['Node', ftm.radio_button_node_only])]);
		for (var [option, ivar] of table2) {
			if (ivar.isChecked ()) {
				result.append ('[{}]'.format (option));
				break;
			}
		}
		return 'Find: {}'.format (' '.join (result));
	});},
	get showStatus () {return __get__ (this, function (self, found) {
		var c = self.c;
		var status = (found ? 'found' : 'not found');
		var options = self.getFindResultStatus ();
		var s = '{}:{} {}'.format (status, options, self.find_text);
		var found_bg = c.config.getColor ('find-found-bg') || 'blue';
		var not_found_bg = c.config.getColor ('find-not-found-bg') || 'red';
		var found_fg = c.config.getColor ('find-found-fg') || 'white';
		var not_found_fg = c.config.getColor ('find-not-found-fg') || 'white';
		var bg = (found ? found_bg : not_found_bg);
		var fg = (found ? found_fg : not_found_fg);
		if (c.config.getBool ('show-find-result-in-status') !== false) {
			c.frame.putStatusLine (s, __kwargtrans__ ({bg: bg, fg: fg}));
		}
		if (!(found)) {
			self.radioButtonsChanged = true;
			self.reset_state_ivars ();
		}
	});},
	get checkArgs () {return __get__ (this, function (self) {
		var val = true;
		if (!(self.search_headline) && !(self.search_body)) {
			g.es ('not searching headline or body');
			var val = false;
		}
		var s = self.ftm.getFindText ();
		if (!(s)) {
			g.es ('empty find patttern');
			var val = false;
		}
		return val;
	});},
	get init_s_ctrl () {return __get__ (this, function (self, s, ins) {
		var w = self.s_ctrl;
		w.setAllText (s);
		if (ins === null) {
			var ins = (self.reverse ? len (s) : 0);
		}
		w.setInsertPoint (ins);
	});},
	get initBatchCommands () {return __get__ (this, function (self) {
		var c = self.c;
		self.errors = 0;
		self.in_headline = self.search_headline;
		if (self.suboutline_only || self.node_only) {
			self.p = c.p;
			self.onlyPosition = self.p.copy ();
		}
		else {
			var p = c.rootPosition ();
			if (self.reverse) {
				while (p && p.py_next ()) {
					var p = p.py_next ();
				}
				var p = p.lastNode ();
			}
			self.p = p;
		}
		self.initBatchText ();
	});},
	get initBatchText () {return __get__ (this, function (self, ins) {
		if (typeof ins == 'undefined' || (ins != null && ins.hasOwnProperty ("__kwargtrans__"))) {;
			var ins = null;
		};
		var c = self.c;
		self.wrapping = false;
		var p = self.p || c.p;
		var s = (self.in_headline ? p.h : p.b);
		self.init_s_ctrl (s, ins);
	});},
	get initInHeadline () {return __get__ (this, function (self) {
		if (self.search_headline && self.search_body) {
			self.in_headline = self.focusInTree ();
		}
		else {
			self.in_headline = self.search_headline;
		}
	});},
	get focusInTree () {return __get__ (this, function (self) {
		var c = self.c;
		var ftm = self.ftm;
		var w = ftm.entry_focus || g.app.gui.get_focus (__kwargtrans__ ({raw: true}));
		ftm.entry_focus = null;
		var w_name = c.widget_name (w);
		if (self.buttonFlag && __in__ (self.was_in_headline, tuple ([true, false]))) {
			self.in_headline = self.was_in_headline;
			var val = self.was_in_headline;
		}
		else if (w == c.frame.body.wrapper) {
			var val = false;
		}
		else if (w == c.frame.tree.treeWidget) {
			var val = true;
		}
		else {
			var val = w_name.startswith ('head');
		}
		return val;
	});},
	get initInteractiveCommands () {return __get__ (this, function (self) {
		var c = self.c;
		var __left0__ = c.p;
		var p = __left0__;
		self.p = __left0__;
		var wrapper = c.frame.body && c.frame.body.wrapper;
		var headCtrl = c.edit_widget (p);
		var w = (self.in_headline ? headCtrl : wrapper);
		var ins = (w ? w.getInsertPoint () : null);
		self.errors = 0;
		self.initNextText (__kwargtrans__ ({ins: ins}));
		if (w) {
			c.widgetWantsFocus (w);
		}
		if (self.suboutline_only && !(self.onlyPosition)) {
			self.onlyPosition = p.copy ();
		}
		if (self.wrap && !(self.node_only) && !(self.suboutline_only) && self.wrapPosition === null) {
			self.wrapping = true;
			self.wrapPos = ins;
		}
	});},
	get printLine () {return __get__ (this, function (self, line, allFlag) {
		if (typeof allFlag == 'undefined' || (allFlag != null && allFlag.hasOwnProperty ("__kwargtrans__"))) {;
			var allFlag = false;
		};
		var both = self.search_body && self.search_headline;
		var context = self.batch;
		if (allFlag && both && context) {
			g.es ('', '-' * 20, '', self.p.h);
			var theType = (self.in_headline ? 'head: ' : 'body: ');
			g.es ('', theType + line);
		}
		else if (allFlag && context && !(self.p.isVisited ())) {
			g.es ('', '-' * 20, '', self.p.h);
			g.es ('', line);
			self.p.setVisited ();
		}
		else {
			g.es ('', line);
		}
	});},
	get reset_state_ivars () {return __get__ (this, function (self) {
		self.onlyPosition = null;
		self.wrapping = false;
		self.wrapPosition = null;
		self.wrapPos = null;
	});},
	get restore () {return __get__ (this, function (self, data) {
		var c = self.c;
		var __left0__ = data;
		var in_headline = __left0__ [0];
		var editing = __left0__ [1];
		var p = __left0__ [2];
		var w = __left0__ [3];
		var insert = __left0__ [4];
		var start = __left0__ [5];
		var end = __left0__ [6];
		var junk = __left0__ [7];
		self.was_in_headline = false;
		if (0) {
			self.reset_state_ivars ();
		}
		c.frame.bringToFront ();
		if (p && c.positionExists (p)) {
			c.selectPosition (p);
		}
		else {
			c.selectPosition (c.rootPosition ());
		}
		self.restoreAfterFindDef ();
		if (in_headline) {
			c.selectPosition (p);
			if (false && editing) {
				c.editHeadline ();
			}
			else {
				c.treeWantsFocus ();
			}
		}
		else {
			w.setSelectionRange (start, end, __kwargtrans__ ({insert: insert}));
			w.seeInsertPoint ();
			c.widgetWantsFocus (w);
		}
	});},
	get restoreAllExpansionStates () {return __get__ (this, function (self, expanded, redraw) {
		if (typeof redraw == 'undefined' || (redraw != null && redraw.hasOwnProperty ("__kwargtrans__"))) {;
			var redraw = false;
		};
		var c = self.c;
		var gnxDict = c.fileCommands.gnxDict;
		for (var [gnx, v] of gnxDict.py_items ()) {
			if (__in__ (gnx, expanded)) {
				v.expand ();
			}
			else {
				v.contract ();
			}
		}
		if (redraw) {
			c.redraw ();
		}
	});},
	get save () {return __get__ (this, function (self) {
		var c = self.c;
		var p = self.p || c.p;
		if (self.in_headline) {
			var e = c.edit_widget (p);
			var w = e || c.frame.tree.canvas;
			var __left0__ = tuple ([null, null, null]);
			var insert = __left0__ [0];
			var start = __left0__ [1];
			var end = __left0__ [2];
		}
		else {
			var w = c.frame.body.wrapper;
			var e = null;
			var insert = w.getInsertPoint ();
			var sel = w.getSelectionRange ();
			if (len (sel) == 2) {
				var __left0__ = sel;
				var start = __left0__ [0];
				var end = __left0__ [1];
			}
			else {
				var __left0__ = tuple ([null, null]);
				var start = __left0__ [0];
				var end = __left0__ [1];
			}
		}
		var editing = e !== null;
		var expanded = set ((function () {
			var __accu0__ = [];
			for (var [gnx, v] of c.fileCommands.gnxDict.py_items ()) {
				if (v.isExpanded ()) {
					__accu0__.append (gnx);
				}
			}
			return py_iter (__accu0__);
		}) ());
		return tuple ([self.in_headline, editing, p.copy (), w, insert, start, end, expanded]);
	});},
	get showSuccess () {return __get__ (this, function (self, pos, newpos, showState) {
		if (typeof showState == 'undefined' || (showState != null && showState.hasOwnProperty ("__kwargtrans__"))) {;
			var showState = true;
		};
		var c = self.c;
		var __left0__ = self.p || c.p;
		self.p = __left0__;
		var p = __left0__;
		var insert = (self.reverse ? min (pos, newpos) : max (pos, newpos));
		if (self.wrap && !(self.wrapPosition)) {
			self.wrapPosition = self.p;
		}
		if (c.sparse_find) {
			c.expandOnlyAncestorsOfNode (__kwargtrans__ ({p: p}));
		}
		if (self.in_headline) {
			c.endEditing ();
			var selection = tuple ([pos, newpos, insert]);
			c.redrawAndEdit (p, __kwargtrans__ ({selection: selection, keepMinibuffer: true}));
			var w = c.edit_widget (p);
			self.was_in_headline = true;
		}
		else {
			var w = c.frame.body.wrapper;
			c.selectPosition (p);
			c.bodyWantsFocus ();
			if (showState) {
				c.k.showStateAndMode (w);
			}
			c.bodyWantsFocusNow ();
			w.setSelectionRange (pos, newpos, __kwargtrans__ ({insert: insert}));
			var k = g.see_more_lines (w.getAllText (), insert, 4);
			w.see (k);
			c.outerUpdate ();
			if (c.vim_mode && c.vimCommands) {
				c.vimCommands.update_selection_after_search ();
			}
		}
		if (hasattr (g.app.gui, 'show_find_success')) {
			g.app.gui.show_find_success (c, self.in_headline, insert, p);
		}
		c.frame.bringToFront ();
		return w;
	});},
	get update_ivars () {return __get__ (this, function (self) {
		var c = self.c;
		self.p = c.p;
		var ftm = self.ftm;
		var s = ftm.getFindText ();
		var s = g.checkUnicode (s);
		if (s && __in__ (s [-(1)], tuple (['\r', '\n']))) {
			var s = s.__getslice__ (0, -(1), 1);
		}
		if (self.radioButtonsChanged || s != self.find_text) {
			self.radioButtonsChanged = false;
			self.state_on_start_of_search = self.save ();
			self.reset_state_ivars ();
		}
		self.find_text = s;
		var s = ftm.getReplaceText ();
		var s = g.checkUnicode (s);
		if (s && __in__ (s [-(1)], tuple (['\r', '\n']))) {
			var s = s.__getslice__ (0, -(1), 1);
		}
		self.change_text = s;
	});}
});

//# sourceMappingURL=leo.core.leoFind.map