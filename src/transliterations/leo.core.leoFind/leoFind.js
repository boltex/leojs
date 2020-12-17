/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 08:42:31
/* 000004 */ var re = {};
/* 000004 */ var sys = {};
/* 000004 */ var time = {};
/* 000004 */ import {} from './org.transcrypt.__runtime__.js';
/* 000007 */ import * as __module_time__ from './time.js';
/* 000007 */ __nest__ (time, '', __module_time__);
/* 000006 */ import * as __module_sys__ from './sys.js';
/* 000006 */ __nest__ (sys, '', __module_sys__);
/* 000005 */ import * as __module_re__ from './re.js';
/* 000005 */ __nest__ (re, '', __module_re__);
/* 000004 */ import {leoGlobals as g} from './leo.core.js';
/* 000001 */ var __name__ = '__main__';
/* 000069 */ export var SearchWidget =  __class__ ('SearchWidget', [object], {
/* 000069 */ 	__module__: __name__,
/* 000073 */ 	get __init__ () {return __get__ (this, function (self) {
/* 000073 */ 		var args = tuple ([].slice.apply (arguments).slice (1));
/* 000074 */ 		self.s = '';
/* 000075 */ 		self.i = 0;
/* 000076 */ 		self.sel = tuple ([0, 0]);
/* 000076 */ 	});},
/* 000078 */ 	get __repr__ () {return __get__ (this, function (self) {
/* 000079 */ 		return 'SearchWidget id: {}'.format (id (self));
/* 000079 */ 	});},
/* 000082 */ 	get getAllText () {return __get__ (this, function (self) {
/* 000082 */ 		return self.s;
/* 000082 */ 	});},
/* 000084 */ 	get getInsertPoint () {return __get__ (this, function (self) {
/* 000084 */ 		return self.i;
/* 000084 */ 	});},
/* 000086 */ 	get getSelectionRange () {return __get__ (this, function (self) {
/* 000086 */ 		return self.sel;
/* 000086 */ 	});},
/* 000088 */ 	get delete () {return __get__ (this, function (self, i, j) {
/* 000088 */ 		if (typeof j == 'undefined' || (j != null && j.hasOwnProperty ("__kwargtrans__"))) {;
/* 000088 */ 			var j = null;
/* 000088 */ 		};
/* 000089 */ 		var i = self.toPythonIndex (i);
/* 000090 */ 		if (j === null) {
/* 000090 */ 			var j = i + 1;
/* 000090 */ 		}
/* 000091 */ 		else {
/* 000091 */ 			var j = self.toPythonIndex (j);
/* 000091 */ 		}
/* 000092 */ 		self.s = self.s.__getslice__ (0, i, 1) + self.s.__getslice__ (j, null, 1);
/* 000094 */ 		self.i = i;
/* 000095 */ 		self.sel = tuple ([i, i]);
/* 000095 */ 	});},
/* 000097 */ 	get insert () {return __get__ (this, function (self, i, s) {
/* 000098 */ 		if (!(s)) {
/* 000098 */ 			return ;
/* 000098 */ 		}
/* 000099 */ 		var i = self.toPythonIndex (i);
/* 000100 */ 		self.s = (self.s.__getslice__ (0, i, 1) + s) + self.s.__getslice__ (i, null, 1);
/* 000101 */ 		self.i = i;
/* 000102 */ 		self.sel = tuple ([i, i]);
/* 000102 */ 	});},
/* 000104 */ 	get setAllText () {return __get__ (this, function (self, s) {
/* 000105 */ 		self.s = s;
/* 000106 */ 		self.i = 0;
/* 000107 */ 		self.sel = tuple ([0, 0]);
/* 000107 */ 	});},
/* 000109 */ 	get setInsertPoint () {return __get__ (this, function (self, i, s) {
/* 000109 */ 		if (typeof s == 'undefined' || (s != null && s.hasOwnProperty ("__kwargtrans__"))) {;
/* 000109 */ 			var s = null;
/* 000109 */ 		};
/* 000110 */ 		self.i = i;
/* 000110 */ 	});},
/* 000112 */ 	get setSelectionRange () {return __get__ (this, function (self, i, j, insert) {
/* 000112 */ 		if (typeof insert == 'undefined' || (insert != null && insert.hasOwnProperty ("__kwargtrans__"))) {;
/* 000112 */ 			var insert = null;
/* 000112 */ 		};
/* 000113 */ 		self.sel = tuple ([self.toPythonIndex (i), self.toPythonIndex (j)]);
/* 000114 */ 		if (insert !== null) {
/* 000115 */ 			self.i = self.toPythonIndex (insert);
/* 000115 */ 		}
/* 000115 */ 	});},
/* 000117 */ 	get toPythonIndex () {return __get__ (this, function (self, i) {
/* 000118 */ 		return g.toPythonIndex (self.s, i);
/* 000118 */ 	});}
/* 000118 */ });
/* 000121 */ export var LeoFind =  __class__ ('LeoFind', [object], {
/* 000121 */ 	__module__: __name__,
/* 000128 */ 	get __init__ () {return __get__ (this, function (self, c) {
/* 000130 */ 		self.c = c;
/* 000131 */ 		self.errors = 0;
/* 000132 */ 		self.expert_mode = false;
/* 000134 */ 		self.ftm = null;
/* 000136 */ 		self.frame = null;
/* 000137 */ 		self.k = c.k;
/* 000138 */ 		self.re_obj = null;
/* 000140 */ 		self.batch = null;
/* 000141 */ 		self.ignore_case = null;
/* 000142 */ 		self.node_only = null;
/* 000143 */ 		self.pattern_match = null;
/* 000144 */ 		self.search_headline = null;
/* 000145 */ 		self.search_body = null;
/* 000146 */ 		self.suboutline_only = null;
/* 000147 */ 		self.mark_changes = null;
/* 000148 */ 		self.mark_finds = null;
/* 000149 */ 		self.reverse = null;
/* 000150 */ 		self.wrap = null;
/* 000151 */ 		self.whole_word = null;
/* 000153 */ 		self.stack = [];
/* 000154 */ 		self.isearch_ignore_case = null;
/* 000155 */ 		self.isearch_forward = null;
/* 000156 */ 		self.isearch_regexp = null;
/* 000157 */ 		self.findTextList = [];
/* 000158 */ 		self.changeTextList = [];
/* 000160 */ 		self.change_ctrl = null;
/* 000161 */ 		self.s_ctrl = SearchWidget ();
/* 000163 */ 		self.find_text = '';
/* 000164 */ 		self.change_text = '';
/* 000165 */ 		self.radioButtonsChanged = false;
/* 000169 */ 		self.find_def_data = null;
/* 000171 */ 		self.find_seen = set ();
/* 000175 */ 		self.buttonFlag = false;
/* 000176 */ 		self.changeAllFlag = false;
/* 000177 */ 		self.findAllFlag = false;
/* 000178 */ 		self.findAllUniqueFlag = false;
/* 000179 */ 		self.in_headline = false;
/* 000181 */ 		self.match_obj = null;
/* 000183 */ 		self.p = null;
/* 000186 */ 		self.unique_matches = set ();
/* 000187 */ 		self.was_in_headline = null;
/* 000189 */ 		self.onlyPosition = null;
/* 000191 */ 		self.wrapping = false;
/* 000194 */ 		self.wrapPosition = null;
/* 000197 */ 		self.wrapPos = null;
/* 000200 */ 		self.state_on_start_of_search = null;
/* 000200 */ 	});},
/* 000203 */ 	get cmd () {return __get__ (this, function (py_name) {
/* 000206 */ 		return g.new_cmd_decorator (py_name, ['c', 'findCommands']);
/* 000206 */ 	});},
/* 000208 */ 	get finishCreate () {return __get__ (this, function (self) {
/* 000211 */ 		var c = self.c;
/* 000212 */ 		self.reloadSettings ();
/* 000215 */ 		var dw = c.frame.top;
/* 000216 */ 		if (dw) {
/* 000216 */ 			dw.finishCreateLogPane ();
/* 000216 */ 		}
/* 000216 */ 	});},
/* 000218 */ 	get reloadSettings () {return __get__ (this, function (self) {
/* 000220 */ 		var c = self.c;
/* 000221 */ 		self.ignore_dups = c.config.getBool ('find-ignore-duplicates', __kwargtrans__ ({py_default: false}));
/* 000222 */ 		self.minibuffer_mode = c.config.getBool ('minibuffer-find-mode', __kwargtrans__ ({py_default: false}));
/* 000222 */ 	});},
/* 000225 */ 	get changeAllButton () {return __get__ (this, function (self, event) {
/* 000225 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000225 */ 			var event = null;
/* 000225 */ 		};
/* 000227 */ 		var c = self.c;
/* 000228 */ 		self.setup_button ();
/* 000229 */ 		c.clearAllVisited ();
/* 000230 */ 		self.changeAll ();
/* 000230 */ 	});},
/* 000232 */ 	get changeButton () {return __get__ (this, function (self, event) {
/* 000232 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000232 */ 			var event = null;
/* 000232 */ 		};
/* 000234 */ 		self.setup_button ();
/* 000235 */ 		self.change ();
/* 000235 */ 	});},
/* 000237 */ 	get changeThenFindButton () {return __get__ (this, function (self, event) {
/* 000237 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000237 */ 			var event = null;
/* 000237 */ 		};
/* 000239 */ 		self.setup_button ();
/* 000240 */ 		self.changeThenFind ();
/* 000240 */ 	});},
/* 000242 */ 	get findAllButton () {return __get__ (this, function (self, event) {
/* 000242 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000242 */ 			var event = null;
/* 000242 */ 		};
/* 000244 */ 		self.setup_button ();
/* 000245 */ 		self.findAll ();
/* 000245 */ 	});},
/* 000247 */ 	get findButton () {return __get__ (this, function (self, event) {
/* 000247 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000247 */ 			var event = null;
/* 000247 */ 		};
/* 000249 */ 		var __left0__ = tuple ([self.c, self.c.p]);
/* 000249 */ 		var c = __left0__ [0];
/* 000249 */ 		var p = __left0__ [1];
/* 000250 */ 		var p0 = p.copy ();
/* 000251 */ 		self.setup_button ();
/* 000255 */ 		if (self.was_in_headline) {
/* 000256 */ 			self.was_in_headline = false;
/* 000257 */ 			if (p.hasThreadNext ()) {
/* 000258 */ 				p.moveToThreadNext ();
/* 000259 */ 				c.selectPosition (p);
/* 000259 */ 			}
/* 000260 */ 			self.p = p.copy ();
/* 000260 */ 		}
/* 000261 */ 		if (!(self.findNext ()) && p0 != c.p) {
/* 000263 */ 			p0.contract ();
/* 000264 */ 			c.selectPosition (p0);
/* 000265 */ 			c.redraw ();
/* 000265 */ 		}
/* 000265 */ 	});},
/* 000267 */ 	get findPreviousButton () {return __get__ (this, function (self, event) {
/* 000267 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000267 */ 			var event = null;
/* 000267 */ 		};
/* 000269 */ 		var __left0__ = tuple ([self.c, self.c.p]);
/* 000269 */ 		var c = __left0__ [0];
/* 000269 */ 		var p = __left0__ [1];
/* 000270 */ 		var p0 = p.copy ();
/* 000271 */ 		self.setup_button ();
/* 000275 */ 		if (self.was_in_headline) {
/* 000276 */ 			self.was_in_headline = false;
/* 000277 */ 			if (p.hasThreadBack ()) {
/* 000278 */ 				p.moveToThreadBack ();
/* 000279 */ 				c.selectPosition (p);
/* 000279 */ 			}
/* 000280 */ 			self.p = p.copy ();
/* 000280 */ 		}
/* 000281 */ 		self.reverse = true;
/* 000282 */ 		try {
/* 000283 */ 			if (!(self.findNext ()) && p0 != c.p) {
/* 000285 */ 				p0.contract ();
/* 000286 */ 				c.selectPosition (p0);
/* 000287 */ 				c.redraw ();
/* 000287 */ 			}
/* 000287 */ 		}
/* 000287 */ 		finally {
/* 000289 */ 			self.reverse = false;
/* 000289 */ 		}
/* 000289 */ 	});},
/* 000291 */ 	get setup_button () {return __get__ (this, function (self) {
/* 000293 */ 		var c = self.c;
/* 000294 */ 		self.buttonFlag = true;
/* 000295 */ 		self.p = c.p;
/* 000296 */ 		c.bringToFront ();
/* 000297 */ 		if (0) {
/* 000298 */ 			c.endEditing ();
/* 000298 */ 		}
/* 000299 */ 		self.update_ivars ();
/* 000299 */ 	});},
/* 000302 */ 	get changeCommand () {return __get__ (this, function (self, event) {
/* 000302 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000302 */ 			var event = null;
/* 000302 */ 		};
/* 000304 */ 		self.setup_command ();
/* 000305 */ 		self.change ();
/* 000305 */ 	});},
/* 000307 */ 	get changeThenFindCommand () {return __get__ (this, cmd ('replace-then-find') (function (self, event) {
/* 000307 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000307 */ 			var event = null;
/* 000307 */ 		};
/* 000310 */ 		self.setup_command ();
/* 000311 */ 		self.changeThenFind ();
/* 000311 */ 	}));},
/* 000313 */ 	get cloneFindAllCommand () {return __get__ (this, function (self, event) {
/* 000313 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000313 */ 			var event = null;
/* 000313 */ 		};
/* 000314 */ 		self.setup_command ();
/* 000315 */ 		self.findAll (__kwargtrans__ ({clone_find_all: true}));
/* 000315 */ 	});},
/* 000317 */ 	get cloneFindAllFlattenedCommand () {return __get__ (this, function (self, event) {
/* 000317 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000317 */ 			var event = null;
/* 000317 */ 		};
/* 000318 */ 		self.setup_command ();
/* 000319 */ 		self.findAll (__kwargtrans__ ({clone_find_all: true, clone_find_all_flattened: true}));
/* 000319 */ 	});},
/* 000321 */ 	get findAllCommand () {return __get__ (this, function (self, event) {
/* 000321 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000321 */ 			var event = null;
/* 000321 */ 		};
/* 000322 */ 		self.setup_command ();
/* 000323 */ 		self.findAll ();
/* 000323 */ 	});},
/* 000325 */ 	get findDef () {return __get__ (this, cmd ('find-def') (function (self, event) {
/* 000325 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000325 */ 			var event = null;
/* 000325 */ 		};
/* 000328 */ 		self.findDefHelper (event, __kwargtrans__ ({defFlag: true}));
/* 000328 */ 	}));},
/* 000330 */ 	get findVar () {return __get__ (this, cmd ('find-var') (function (self, event) {
/* 000330 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000330 */ 			var event = null;
/* 000330 */ 		};
/* 000333 */ 		self.findDefHelper (event, __kwargtrans__ ({defFlag: false}));
/* 000333 */ 	}));},
/* 000335 */ 	get findDefHelper () {return __get__ (this, function (self, event, defFlag) {
/* 000337 */ 		var __left0__ = tuple ([self.c, self, self.ftm]);
/* 000337 */ 		var c = __left0__ [0];
/* 000337 */ 		var find = __left0__ [1];
/* 000337 */ 		var ftm = __left0__ [2];
/* 000338 */ 		var w = c.frame.body.wrapper;
/* 000339 */ 		if (!(w)) {
/* 000340 */ 			return ;
/* 000340 */ 		}
/* 000341 */ 		var word = self.initFindDef (event);
/* 000342 */ 		if (!(word)) {
/* 000343 */ 			return ;
/* 000343 */ 		}
/* 000344 */ 		var save_sel = w.getSelectionRange ();
/* 000345 */ 		var ins = w.getInsertPoint ();
/* 000347 */ 		var old_p = c.p;
/* 000348 */ 		var p = c.rootPosition ();
/* 000350 */ 		c.selectPosition (p);
/* 000351 */ 		c.redraw ();
/* 000352 */ 		c.bodyWantsFocusNow ();
/* 000354 */ 		if (defFlag) {
/* 000355 */ 			var prefix = (word [0].isupper () ? 'class' : 'def');
/* 000356 */ 			var find_pattern = (prefix + ' ') + word;
/* 000356 */ 		}
/* 000357 */ 		else {
/* 000358 */ 			var find_pattern = word + ' =';
/* 000358 */ 		}
/* 000359 */ 		find.find_text = find_pattern;
/* 000360 */ 		ftm.setFindText (find_pattern);
/* 000362 */ 		find.saveBeforeFindDef (p);
/* 000363 */ 		find.setFindDefOptions (p);
/* 000364 */ 		self.find_seen = set ();
/* 000365 */ 		var use_cff = c.config.getBool ('find-def-creates-clones', __kwargtrans__ ({py_default: false}));
/* 000366 */ 		var count = 0;
/* 000367 */ 		if (use_cff) {
/* 000368 */ 			var count = find.findAll (__kwargtrans__ ({clone_find_all: true, clone_find_all_flattened: true}));
/* 000369 */ 			var found = count > 0;
/* 000369 */ 		}
/* 000370 */ 		else {
/* 000372 */ 			while (true) {
/* 000373 */ 				var found = find.findNext (__kwargtrans__ ({initFlag: false}));
/* 000374 */ 				if (!(found) || !(g.inAtNosearch (c.p))) {
/* 000374 */ 					break;
/* 000374 */ 				}
/* 000374 */ 			}
/* 000374 */ 		}
/* 000376 */ 		if (!(found) && defFlag) {
/* 000378 */ 			var word2 = self.switchStyle (word);
/* 000379 */ 			if (word2) {
/* 000380 */ 				var find_pattern = (prefix + ' ') + word2;
/* 000381 */ 				find.find_text = find_pattern;
/* 000382 */ 				ftm.setFindText (find_pattern);
/* 000383 */ 				if (use_cff) {
/* 000384 */ 					var count = find.findAll (__kwargtrans__ ({clone_find_all: true, clone_find_all_flattened: true}));
/* 000386 */ 					var found = count > 0;
/* 000386 */ 				}
/* 000387 */ 				else {
/* 000389 */ 					while (true) {
/* 000390 */ 						var found = find.findNext (__kwargtrans__ ({initFlag: false}));
/* 000391 */ 						if (!(found) || !(g.inAtNosearch (c.p))) {
/* 000391 */ 							break;
/* 000391 */ 						}
/* 000391 */ 					}
/* 000391 */ 				}
/* 000391 */ 			}
/* 000391 */ 		}
/* 000393 */ 		if (found && use_cff) {
/* 000394 */ 			var last = c.lastTopLevel ();
/* 000395 */ 			if (count == 1) {
/* 000398 */ 				last.doDelete ();
/* 000399 */ 				find.findNext (__kwargtrans__ ({initFlag: false}));
/* 000399 */ 			}
/* 000400 */ 			else {
/* 000401 */ 				c.selectPosition (last);
/* 000401 */ 			}
/* 000401 */ 		}
/* 000402 */ 		if (found) {
/* 000403 */ 			self.find_seen.add (c.p.v);
/* 000404 */ 			self.restoreAfterFindDef ();
/* 000404 */ 		}
/* 000405 */ 		else {
/* 000407 */ 			c.selectPosition (old_p);
/* 000408 */ 			self.restoreAfterFindDef ();
/* 000409 */ 			var __left0__ = save_sel;
/* 000409 */ 			var i = __left0__ [0];
/* 000409 */ 			var j = __left0__ [1];
/* 000410 */ 			c.redraw ();
/* 000411 */ 			w.setSelectionRange (i, j, __kwargtrans__ ({insert: ins}));
/* 000412 */ 			c.bodyWantsFocusNow ();
/* 000412 */ 		}
/* 000412 */ 	});},
/* 000414 */ 	get switchStyle () {return __get__ (this, function (self, word) {
/* 000419 */ 		var s = word;
/* 000420 */ 		if (s.find ('_') > -(1)) {
/* 000421 */ 			if (s.startswith ('_')) {
/* 000423 */ 				return null;
/* 000423 */ 			}
/* 000426 */ 			var s = s.lower ();
/* 000427 */ 			while (s) {
/* 000428 */ 				var i = s.find ('_');
/* 000429 */ 				if (i == -(1)) {
/* 000429 */ 					break;
/* 000429 */ 				}
/* 000431 */ 				var s = s.__getslice__ (0, i, 1) + s.__getslice__ (i + 1, null, 1).capitalize ();
/* 000431 */ 			}
/* 000432 */ 			return s;
/* 000432 */ 		}
/* 000435 */ 		var result = [];
/* 000436 */ 		for (var [i, ch] of enumerate (s)) {
/* 000437 */ 			if (i > 0 && ch.isupper ()) {
/* 000438 */ 				result.append ('_');
/* 000438 */ 			}
/* 000439 */ 			result.append (ch.lower ());
/* 000439 */ 		}
/* 000440 */ 		var s = ''.join (result);
/* 000441 */ 		return (s == word ? null : s);
/* 000441 */ 	});},
/* 000443 */ 	get initFindDef () {return __get__ (this, function (self, event) {
/* 000445 */ 		var c = self.c;
/* 000446 */ 		var w = c.frame.body.wrapper;
/* 000448 */ 		c.bodyWantsFocusNow ();
/* 000449 */ 		var w = c.frame.body.wrapper;
/* 000450 */ 		if (!(w.hasSelection ())) {
/* 000451 */ 			c.editCommands.extendToWord (event, __kwargtrans__ ({select: true}));
/* 000451 */ 		}
/* 000452 */ 		var word = w.getSelectedText ().strip ();
/* 000453 */ 		if (!(word)) {
/* 000454 */ 			return null;
/* 000454 */ 		}
/* 000462 */ 		for (var tag of tuple (['class ', 'def '])) {
/* 000463 */ 			var found = word.startswith (tag) && len (word) > len (tag);
/* 000464 */ 			if (found) {
/* 000465 */ 				return word.__getslice__ (len (tag), null, 1).strip ();
/* 000465 */ 			}
/* 000465 */ 		}
/* 000466 */ 		return word;
/* 000466 */ 	});},
/* 000468 */ 	get saveBeforeFindDef () {return __get__ (this, function (self, p) {
/* 000470 */ 		if (!(self.find_def_data)) {
/* 000473 */ 			self.find_def_data = g.Bunch (__kwargtrans__ ({ignore_case: self.ignore_case, p: p.copy (), pattern_match: self.pattern_match, search_body: self.search_body, search_headline: self.search_headline, whole_word: self.whole_word}));
/* 000473 */ 		}
/* 000473 */ 	});},
/* 000480 */ 	get setFindDefOptions () {return __get__ (this, function (self, p) {
/* 000482 */ 		self.ignore_case = false;
/* 000483 */ 		self.p = p.copy ();
/* 000484 */ 		self.pattern_match = false;
/* 000485 */ 		self.reverse = false;
/* 000486 */ 		self.search_body = true;
/* 000487 */ 		self.search_headline = false;
/* 000488 */ 		self.whole_word = true;
/* 000488 */ 	});},
/* 000490 */ 	get restoreAfterFindDef () {return __get__ (this, function (self) {
/* 000494 */ 		var b = self.find_def_data;
/* 000495 */ 		if (b) {
/* 000496 */ 			self.ignore_case = b.ignore_case;
/* 000497 */ 			self.p = b.p;
/* 000498 */ 			self.pattern_match = b.pattern_match;
/* 000499 */ 			self.reverse = false;
/* 000500 */ 			self.search_body = b.search_body;
/* 000501 */ 			self.search_headline = b.search_headline;
/* 000502 */ 			self.whole_word = b.whole_word;
/* 000503 */ 			self.find_def_data = null;
/* 000503 */ 		}
/* 000503 */ 	});},
/* 000505 */ 	get findNextCommand () {return __get__ (this, cmd ('find-next') (function (self, event) {
/* 000505 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000505 */ 			var event = null;
/* 000505 */ 		};
/* 000508 */ 		self.setup_command ();
/* 000509 */ 		self.findNext ();
/* 000509 */ 	}));},
/* 000511 */ 	get findPrevCommand () {return __get__ (this, cmd ('find-prev') (function (self, event) {
/* 000511 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000511 */ 			var event = null;
/* 000511 */ 		};
/* 000514 */ 		self.setup_command ();
/* 000515 */ 		self.reverse = true;
/* 000516 */ 		try {
/* 000517 */ 			self.findNext ();
/* 000517 */ 		}
/* 000517 */ 		finally {
/* 000519 */ 			self.reverse = false;
/* 000519 */ 		}
/* 000519 */ 	}));},
/* 000521 */ 	get focusToFind () {return __get__ (this, cmd ('focus-to-find') (function (self, event) {
/* 000521 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000521 */ 			var event = null;
/* 000521 */ 		};
/* 000523 */ 		var c = self.c;
/* 000524 */ 		if (c.config.getBool ('use-find-dialog', __kwargtrans__ ({py_default: true}))) {
/* 000525 */ 			g.app.gui.openFindDialog (c);
/* 000525 */ 		}
/* 000526 */ 		else {
/* 000527 */ 			c.frame.log.selectTab ('Find');
/* 000527 */ 		}
/* 000527 */ 	}));},
/* 000529 */ 	get helpForFindCommands () {return __get__ (this, function (self, event) {
/* 000529 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000529 */ 			var event = null;
/* 000529 */ 		};
/* 000531 */ 		self.c.helpCommands.helpForFindCommands (event);
/* 000531 */ 	});},
/* 000533 */ 	get hideFindTab () {return __get__ (this, cmd ('find-tab-hide') (function (self, event) {
/* 000533 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000533 */ 			var event = null;
/* 000533 */ 		};
/* 000536 */ 		var c = self.c;
/* 000537 */ 		if (self.minibuffer_mode) {
/* 000538 */ 			c.k.keyboardQuit ();
/* 000538 */ 		}
/* 000539 */ 		else {
/* 000540 */ 			self.c.frame.log.selectTab ('Log');
/* 000540 */ 		}
/* 000540 */ 	}));},
/* 000542 */ 	get openFindTab () {return __get__ (this, cmd ('find-tab-open') (function (self, event, show) {
/* 000542 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000542 */ 			var event = null;
/* 000542 */ 		};
/* 000542 */ 		if (typeof show == 'undefined' || (show != null && show.hasOwnProperty ("__kwargtrans__"))) {;
/* 000542 */ 			var show = true;
/* 000542 */ 		};
/* 000545 */ 		var c = self.c;
/* 000546 */ 		if (c.config.getBool ('use-find-dialog', __kwargtrans__ ({py_default: true}))) {
/* 000547 */ 			g.app.gui.openFindDialog (c);
/* 000547 */ 		}
/* 000548 */ 		else {
/* 000549 */ 			c.frame.log.selectTab ('Find');
/* 000549 */ 		}
/* 000549 */ 	}));},
/* 000551 */ 	get changeAllCommand () {return __get__ (this, function (self, event) {
/* 000551 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000551 */ 			var event = null;
/* 000551 */ 		};
/* 000552 */ 		var c = self.c;
/* 000553 */ 		self.setup_command ();
/* 000554 */ 		self.changeAll ();
/* 000557 */ 		for (var p of c.all_positions ()) {
/* 000561 */ 			if (p.anyAtFileNodeName () && !(p.v.isDirty ()) && any ((function () {
/* 000561 */ 				var __accu0__ = [];
/* 000561 */ 				for (var p2 of p.subtree ()) {
/* 000561 */ 					__accu0__.append (p2.v.isDirty ());
/* 000561 */ 				}
/* 000561 */ 				return __accu0__;
/* 000561 */ 			}) ())) {
/* 000563 */ 				p.setDirty ();
/* 000563 */ 			}
/* 000563 */ 		}
/* 000564 */ 		c.redraw ();
/* 000564 */ 	});},
/* 000566 */ 	get preloadFindPattern () {return __get__ (this, function (self, w) {
/* 000568 */ 		var __left0__ = tuple ([self.c, self.ftm]);
/* 000568 */ 		var c = __left0__ [0];
/* 000568 */ 		var ftm = __left0__ [1];
/* 000569 */ 		if (!(c.config.getBool ('preload-find-pattern', __kwargtrans__ ({py_default: false})))) {
/* 000571 */ 			return ;
/* 000571 */ 		}
/* 000572 */ 		if (!(w)) {
/* 000573 */ 			return ;
/* 000573 */ 		}
/* 000583 */ 		var s = w.getSelectedText ();
/* 000584 */ 		if (s.strip ()) {
/* 000585 */ 			ftm.setFindText (s);
/* 000586 */ 			ftm.init_focus ();
/* 000586 */ 		}
/* 000586 */ 	});},
/* 000590 */ 	get setup_command () {return __get__ (this, function (self) {
/* 000591 */ 		if (0) {
/* 000592 */ 			self.c.endEditing ();
/* 000592 */ 		}
/* 000594 */ 		self.buttonFlag = false;
/* 000595 */ 		self.update_ivars ();
/* 000595 */ 	});},
/* 000597 */ 	get startSearch () {return __get__ (this, cmd ('start-search') (function (self, event) {
/* 000599 */ 		var w = self.editWidget (event);
/* 000603 */ 		if (w) {
/* 000604 */ 			self.preloadFindPattern (w);
/* 000604 */ 		}
/* 000605 */ 		self.find_seen = set ();
/* 000606 */ 		if (self.minibuffer_mode) {
/* 000607 */ 			self.ftm.clear_focus ();
/* 000608 */ 			self.searchWithPresentOptions (event);
/* 000608 */ 		}
/* 000609 */ 		else {
/* 000610 */ 			self.openFindTab (event);
/* 000611 */ 			self.ftm.init_focus ();
/* 000611 */ 		}
/* 000611 */ 	}));},
/* 000613 */ 	get returnToOrigin () {return __get__ (this, cmd ('search-return-to-origin') (function (self, event) {
/* 000615 */ 		var data = self.state_on_start_of_search;
/* 000616 */ 		if (!(data)) {
/* 000616 */ 			return ;
/* 000616 */ 		}
/* 000617 */ 		self.restore (data);
/* 000618 */ 		self.restoreAllExpansionStates (data [-(1)], __kwargtrans__ ({redraw: true}));
/* 000618 */ 	}));},
/* 000621 */ 	get isearchForward () {return __get__ (this, cmd ('isearch-forward') (function (self, event) {
/* 000633 */ 		self.startIncremental (event, 'isearch-forward', __kwargtrans__ ({forward: true, ignoreCase: false, regexp: false}));
/* 000633 */ 	}));},
/* 000636 */ 	get isearchBackward () {return __get__ (this, cmd ('isearch-backward') (function (self, event) {
/* 000648 */ 		self.startIncremental (event, 'isearch-backward', __kwargtrans__ ({forward: false, ignoreCase: false, regexp: false}));
/* 000648 */ 	}));},
/* 000651 */ 	get isearchForwardRegexp () {return __get__ (this, cmd ('isearch-forward-regexp') (function (self, event) {
/* 000663 */ 		self.startIncremental (event, 'isearch-forward-regexp', __kwargtrans__ ({forward: true, ignoreCase: false, regexp: true}));
/* 000663 */ 	}));},
/* 000666 */ 	get isearchBackwardRegexp () {return __get__ (this, cmd ('isearch-backward-regexp') (function (self, event) {
/* 000678 */ 		self.startIncremental (event, 'isearch-backward-regexp', __kwargtrans__ ({forward: false, ignoreCase: false, regexp: true}));
/* 000678 */ 	}));},
/* 000681 */ 	get isearchWithPresentOptions () {return __get__ (this, cmd ('isearch-with-present-options') (function (self, event) {
/* 000693 */ 		self.startIncremental (event, 'isearch-with-present-options', __kwargtrans__ ({forward: null, ignoreCase: null, regexp: null}));
/* 000693 */ 	}));},
/* 000697 */ 	get abortSearch () {return __get__ (this, function (self) {
/* 000699 */ 		var c = self.c;
/* 000699 */ 		var k = self.k;
/* 000700 */ 		var w = c.frame.body.wrapper;
/* 000701 */ 		k.clearState ();
/* 000702 */ 		k.resetLabel ();
/* 000703 */ 		var __left0__ = self.stack [0];
/* 000703 */ 		var p = __left0__ [0];
/* 000703 */ 		var i = __left0__ [1];
/* 000703 */ 		var j = __left0__ [2];
/* 000703 */ 		var in_headline = __left0__ [3];
/* 000704 */ 		self.in_headline = in_headline;
/* 000705 */ 		c.selectPosition (p);
/* 000706 */ 		c.redraw_after_select (p);
/* 000707 */ 		c.bodyWantsFocus ();
/* 000708 */ 		w.setSelectionRange (i, j);
/* 000708 */ 	});},
/* 000710 */ 	get endSearch () {return __get__ (this, function (self) {
/* 000711 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 000711 */ 		var c = __left0__ [0];
/* 000711 */ 		var k = __left0__ [1];
/* 000712 */ 		k.clearState ();
/* 000713 */ 		k.resetLabel ();
/* 000714 */ 		c.bodyWantsFocus ();
/* 000714 */ 	});},
/* 000716 */ 	get iSearch () {return __get__ (this, function (self, again) {
/* 000716 */ 		if (typeof again == 'undefined' || (again != null && again.hasOwnProperty ("__kwargtrans__"))) {;
/* 000716 */ 			var again = false;
/* 000716 */ 		};
/* 000718 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 000718 */ 		var c = __left0__ [0];
/* 000718 */ 		var k = __left0__ [1];
/* 000719 */ 		self.p = c.p;
/* 000720 */ 		var reverse = !(self.isearch_forward);
/* 000721 */ 		var pattern = k.getLabel (__kwargtrans__ ({ignorePrompt: true}));
/* 000722 */ 		if (!(pattern)) {
/* 000723 */ 			self.abortSearch ();
/* 000724 */ 			return ;
/* 000724 */ 		}
/* 000726 */ 		self.update_ivars ();
/* 000728 */ 		var oldPattern = self.find_text;
/* 000729 */ 		var oldRegexp = self.pattern_match;
/* 000730 */ 		var oldWord = self.whole_word;
/* 000732 */ 		self.pattern_match = self.isearch_regexp;
/* 000733 */ 		self.reverse = reverse;
/* 000734 */ 		self.find_text = pattern;
/* 000735 */ 		self.whole_word = false;
/* 000737 */ 		if (len (self.stack) <= 1) {
/* 000737 */ 			self.in_headline = false;
/* 000737 */ 		}
/* 000738 */ 		var w = self.setWidget ();
/* 000739 */ 		var s = w.getAllText ();
/* 000740 */ 		var __left0__ = w.getSelectionRange ();
/* 000740 */ 		var i = __left0__ [0];
/* 000740 */ 		var j = __left0__ [1];
/* 000741 */ 		if (again) {
/* 000741 */ 			var ins = (reverse ? i : j + len (pattern));
/* 000741 */ 		}
/* 000742 */ 		else {
/* 000742 */ 			var ins = (reverse ? j + len (pattern) : i);
/* 000742 */ 		}
/* 000743 */ 		self.init_s_ctrl (s, ins);
/* 000745 */ 		var __left0__ = self.findNextMatch ();
/* 000745 */ 		var pos = __left0__ [0];
/* 000745 */ 		var newpos = __left0__ [1];
/* 000747 */ 		self.find_text = oldPattern;
/* 000748 */ 		self.pattern_match = oldRegexp;
/* 000749 */ 		self.reverse = false;
/* 000750 */ 		self.whole_word = oldWord;
/* 000752 */ 		if (pos !== null) {
/* 000753 */ 			var w = self.showSuccess (pos, newpos, __kwargtrans__ ({showState: false}));
/* 000754 */ 			if (w) {
/* 000754 */ 				var __left0__ = w.getSelectionRange (__kwargtrans__ ({py_sort: false}));
/* 000754 */ 				var i = __left0__ [0];
/* 000754 */ 				var j = __left0__ [1];
/* 000754 */ 			}
/* 000755 */ 			if (!(again)) {
/* 000756 */ 				self.push (c.p, i, j, self.in_headline);
/* 000756 */ 			}
/* 000756 */ 		}
/* 000757 */ 		else if (self.wrapping) {
/* 000759 */ 			k.setLabelRed ('end of wrapped search');
/* 000759 */ 		}
/* 000760 */ 		else {
/* 000761 */ 			g.es ('not found: {}'.format (pattern));
/* 000762 */ 			if (!(again)) {
/* 000763 */ 				var event = g.app.gui.create_key_event (c, __kwargtrans__ ({binding: 'BackSpace', char: '\x08', w: w}));
/* 000765 */ 				k.updateLabel (event);
/* 000765 */ 			}
/* 000765 */ 		}
/* 000765 */ 	});},
/* 000767 */ 	get iSearchStateHandler () {return __get__ (this, function (self, event) {
/* 000770 */ 		var k = self.k;
/* 000771 */ 		var stroke = (event ? event.stroke : null);
/* 000772 */ 		var s = (stroke ? stroke.s : '');
/* 000774 */ 		if (__in__ (s, tuple (['Escape', '\n', 'Return']))) {
/* 000775 */ 			self.endSearch ();
/* 000775 */ 		}
/* 000776 */ 		else if (__in__ (stroke, self.iSearchStrokes)) {
/* 000777 */ 			self.iSearch (__kwargtrans__ ({again: true}));
/* 000777 */ 		}
/* 000778 */ 		else if (__in__ (s, tuple (['\x08', 'BackSpace']))) {
/* 000779 */ 			k.updateLabel (event);
/* 000780 */ 			self.iSearchBackspace ();
/* 000780 */ 		}
/* 000784 */ 		else if (s.startswith ('Ctrl+') || s.startswith ('Alt+') || k.isFKey (s)) {
/* 000787 */ 			self.endSearch ();
/* 000788 */ 			k.masterKeyHandler (event);
/* 000788 */ 		}
/* 000790 */ 		else if (k.isPlainKey (stroke)) {
/* 000791 */ 			k.updateLabel (event);
/* 000792 */ 			self.iSearch ();
/* 000792 */ 		}
/* 000792 */ 	});},
/* 000794 */ 	get iSearchBackspace () {return __get__ (this, function (self) {
/* 000796 */ 		var c = self.c;
/* 000797 */ 		if (len (self.stack) <= 1) {
/* 000798 */ 			self.abortSearch ();
/* 000799 */ 			return ;
/* 000799 */ 		}
/* 000801 */ 		self.py_pop ();
/* 000802 */ 		var __left0__ = self.py_pop ();
/* 000802 */ 		var p = __left0__ [0];
/* 000802 */ 		var i = __left0__ [1];
/* 000802 */ 		var j = __left0__ [2];
/* 000802 */ 		var in_headline = __left0__ [3];
/* 000803 */ 		self.push (p, i, j, in_headline);
/* 000804 */ 		if (in_headline) {
/* 000806 */ 			var selection = tuple ([i, j, i]);
/* 000807 */ 			c.redrawAndEdit (p, __kwargtrans__ ({selectAll: false, selection: selection, keepMinibuffer: true}));
/* 000807 */ 		}
/* 000810 */ 		else {
/* 000811 */ 			c.selectPosition (p);
/* 000812 */ 			var w = c.frame.body.wrapper;
/* 000813 */ 			c.bodyWantsFocus ();
/* 000814 */ 			if (i > j) {
/* 000814 */ 				var __left0__ = tuple ([j, i]);
/* 000814 */ 				var i = __left0__ [0];
/* 000814 */ 				var j = __left0__ [1];
/* 000814 */ 			}
/* 000815 */ 			w.setSelectionRange (i, j);
/* 000815 */ 		}
/* 000816 */ 		if (len (self.stack) <= 1) {
/* 000817 */ 			self.abortSearch ();
/* 000817 */ 		}
/* 000817 */ 	});},
/* 000819 */ 	get getStrokes () {return __get__ (this, function (self, commandName) {
/* 000820 */ 		var aList = self.inverseBindingDict.py_get (commandName, []);
/* 000821 */ 		return (function () {
/* 000821 */ 			var __accu0__ = [];
/* 000821 */ 			for (var [pane, key] of aList) {
/* 000821 */ 				__accu0__.append (key);
/* 000821 */ 			}
/* 000821 */ 			return __accu0__;
/* 000821 */ 		}) ();
/* 000821 */ 	});},
/* 000823 */ 	get push () {return __get__ (this, function (self, p, i, j, in_headline) {
/* 000824 */ 		var data = tuple ([p.copy (), i, j, in_headline]);
/* 000825 */ 		self.stack.append (data);
/* 000825 */ 	});},
/* 000827 */ 	get py_pop () {return __get__ (this, function (self) {
/* 000828 */ 		var data = self.stack.py_pop ();
/* 000829 */ 		var __left0__ = data;
/* 000829 */ 		var p = __left0__ [0];
/* 000829 */ 		var i = __left0__ [1];
/* 000829 */ 		var j = __left0__ [2];
/* 000829 */ 		var in_headline = __left0__ [3];
/* 000830 */ 		return tuple ([p, i, j, in_headline]);
/* 000830 */ 	});},
/* 000832 */ 	get setWidget () {return __get__ (this, function (self) {
/* 000833 */ 		var c = self.c;
/* 000833 */ 		var p = c.currentPosition ();
/* 000834 */ 		var wrapper = c.frame.body.wrapper;
/* 000835 */ 		if (self.in_headline) {
/* 000836 */ 			var w = c.edit_widget (p);
/* 000837 */ 			if (!(w)) {
/* 000839 */ 				var selection = tuple ([0, 0, 0]);
/* 000840 */ 				c.redrawAndEdit (p, __kwargtrans__ ({selectAll: false, selection: selection, keepMinibuffer: true}));
/* 000842 */ 				var w = c.edit_widget (p);
/* 000842 */ 			}
/* 000843 */ 			if (!(w)) {
/* 000844 */ 				g.trace ('**** no edit widget!');
/* 000845 */ 				self.in_headline = false;
/* 000845 */ 				var w = wrapper;
/* 000845 */ 			}
/* 000845 */ 		}
/* 000846 */ 		else {
/* 000847 */ 			var w = wrapper;
/* 000847 */ 		}
/* 000848 */ 		if (w == wrapper) {
/* 000849 */ 			c.bodyWantsFocus ();
/* 000849 */ 		}
/* 000850 */ 		return w;
/* 000850 */ 	});},
/* 000852 */ 	get startIncremental () {return __get__ (this, function (self, event, commandName, forward, ignoreCase, regexp) {
/* 000853 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 000853 */ 		var c = __left0__ [0];
/* 000853 */ 		var k = __left0__ [1];
/* 000855 */ 		self.event = event;
/* 000856 */ 		self.isearch_forward = (forward === null ? !(self.reverse) : forward);
/* 000857 */ 		self.isearch_ignore_case = (ignoreCase === null ? self.ignore_case : ignoreCase);
/* 000858 */ 		self.isearch_regexp = (regexp === null ? self.pattern_match : regexp);
/* 000860 */ 		var __left0__ = c.frame.body.wrapper;
/* 000860 */ 		self.w = __left0__;
/* 000860 */ 		var w = __left0__;
/* 000861 */ 		self.p1 = c.p;
/* 000862 */ 		self.sel1 = w.getSelectionRange (__kwargtrans__ ({py_sort: false}));
/* 000863 */ 		var __left0__ = self.sel1;
/* 000863 */ 		var i = __left0__ [0];
/* 000863 */ 		var j = __left0__ [1];
/* 000864 */ 		self.push (c.p, i, j, self.in_headline);
/* 000865 */ 		self.inverseBindingDict = k.computeInverseBindingDict ();
/* 000866 */ 		self.iSearchStrokes = self.getStrokes (commandName);
/* 000867 */ 		k.setLabelBlue ('Isearch{}{}{}: '.format ((!(self.isearch_forward) ? ' Backward' : ''), (self.isearch_regexp ? ' Regexp' : ''), (self.isearch_ignore_case ? ' NoCase' : '')));
/* 000874 */ 		k.setState ('isearch', 1, __kwargtrans__ ({handler: self.iSearchStateHandler}));
/* 000875 */ 		c.minibufferWantsFocus ();
/* 000875 */ 	});},
/* 000880 */ 	get minibufferCloneFindAll () {return __get__ (this, cmd ('clone-find-all') (cmd ('find-clone-all') (cmd ('cfa') (function (self, event, preloaded) {
/* 000880 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000880 */ 			var event = null;
/* 000880 */ 		};
/* 000880 */ 		if (typeof preloaded == 'undefined' || (preloaded != null && preloaded.hasOwnProperty ("__kwargtrans__"))) {;
/* 000880 */ 			var preloaded = null;
/* 000880 */ 		};
/* 000891 */ 		var w = self.editWidget (event);
/* 000892 */ 		if (w) {
/* 000893 */ 			if (!(preloaded)) {
/* 000894 */ 				self.preloadFindPattern (w);
/* 000894 */ 			}
/* 000895 */ 			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Clone Find All: ', handler: self.minibufferCloneFindAll1}));
/* 000895 */ 		}
/* 000895 */ 	}))));},
/* 000899 */ 	get minibufferCloneFindAll1 () {return __get__ (this, function (self, event) {
/* 000900 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 000900 */ 		var c = __left0__ [0];
/* 000900 */ 		var k = __left0__ [1];
/* 000901 */ 		k.clearState ();
/* 000902 */ 		k.resetLabel ();
/* 000903 */ 		k.showStateAndMode ();
/* 000904 */ 		self.generalSearchHelper (k.arg, __kwargtrans__ ({cloneFindAll: true}));
/* 000905 */ 		c.treeWantsFocus ();
/* 000905 */ 	});},
/* 000909 */ 	get minibufferCloneFindAllFlattened () {return __get__ (this, cmd ('clone-find-all-flattened') (cmd ('find-clone-all-flattened') (cmd ('cff') (function (self, event, preloaded) {
/* 000909 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000909 */ 			var event = null;
/* 000909 */ 		};
/* 000909 */ 		if (typeof preloaded == 'undefined' || (preloaded != null && preloaded.hasOwnProperty ("__kwargtrans__"))) {;
/* 000909 */ 			var preloaded = null;
/* 000909 */ 		};
/* 000921 */ 		var w = self.editWidget (event);
/* 000922 */ 		if (w) {
/* 000923 */ 			if (!(preloaded)) {
/* 000924 */ 				self.preloadFindPattern (w);
/* 000924 */ 			}
/* 000925 */ 			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Clone Find All Flattened: ', handler: self.minibufferCloneFindAllFlattened1}));
/* 000925 */ 		}
/* 000925 */ 	}))));},
/* 000929 */ 	get minibufferCloneFindAllFlattened1 () {return __get__ (this, function (self, event) {
/* 000930 */ 		var c = self.c;
/* 000930 */ 		var k = self.k;
/* 000931 */ 		k.clearState ();
/* 000932 */ 		k.resetLabel ();
/* 000933 */ 		k.showStateAndMode ();
/* 000934 */ 		self.generalSearchHelper (k.arg, __kwargtrans__ ({cloneFindAllFlattened: true}));
/* 000935 */ 		c.treeWantsFocus ();
/* 000935 */ 	});},
/* 000939 */ 	get minibufferCloneFindTag () {return __get__ (this, cmd ('clone-find-tag') (cmd ('find-clone-tag') (cmd ('cft') (function (self, event) {
/* 000939 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000939 */ 			var event = null;
/* 000939 */ 		};
/* 000951 */ 		if (self.editWidget (event)) {
/* 000952 */ 			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Clone Find Tag: ', handler: self.minibufferCloneFindTag1}));
/* 000952 */ 		}
/* 000952 */ 	}))));},
/* 000956 */ 	get minibufferCloneFindTag1 () {return __get__ (this, function (self, event) {
/* 000957 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 000957 */ 		var c = __left0__ [0];
/* 000957 */ 		var k = __left0__ [1];
/* 000958 */ 		k.clearState ();
/* 000959 */ 		k.resetLabel ();
/* 000960 */ 		k.showStateAndMode ();
/* 000961 */ 		self.find_text = k.arg;
/* 000962 */ 		self.cloneFindTag (k.arg);
/* 000963 */ 		c.treeWantsFocus ();
/* 000963 */ 	});},
/* 000965 */ 	get minibufferFindAll () {return __get__ (this, cmd ('find-all') (function (self, event) {
/* 000965 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000965 */ 			var event = null;
/* 000965 */ 		};
/* 000971 */ 		self.ftm.clear_focus ();
/* 000972 */ 		self.searchWithPresentOptions (event, __kwargtrans__ ({findAllFlag: true}));
/* 000972 */ 	}));},
/* 000974 */ 	get minibufferFindAllUniqueRegex () {return __get__ (this, cmd ('find-all-unique-regex') (function (self, event) {
/* 000974 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000974 */ 			var event = null;
/* 000974 */ 		};
/* 000980 */ 		self.ftm.clear_focus ();
/* 000981 */ 		self.match_obj = null;
/* 000982 */ 		self.unique_matches = set ();
/* 000983 */ 		self.searchWithPresentOptions (event, __kwargtrans__ ({findAllFlag: true, findAllUniqueFlag: true}));
/* 000983 */ 	}));},
/* 000985 */ 	get minibufferReplaceAll () {return __get__ (this, cmd ('replace-all') (function (self, event) {
/* 000985 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000985 */ 			var event = null;
/* 000985 */ 		};
/* 000988 */ 		self.ftm.clear_focus ();
/* 000989 */ 		self.searchWithPresentOptions (event, __kwargtrans__ ({changeAllFlag: true}));
/* 000989 */ 	}));},
/* 000991 */ 	get minibufferTagChildren () {return __get__ (this, cmd ('tag-children') (function (self, event) {
/* 000991 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 000991 */ 			var event = null;
/* 000991 */ 		};
/* 000994 */ 		if (self.editWidget (event)) {
/* 000995 */ 			self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Tag Children: ', handler: self.minibufferTagChildren1}));
/* 000995 */ 		}
/* 000995 */ 	}));},
/* 000998 */ 	get minibufferTagChildren1 () {return __get__ (this, function (self, event) {
/* 000999 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 000999 */ 		var c = __left0__ [0];
/* 000999 */ 		var k = __left0__ [1];
/* 001000 */ 		k.clearState ();
/* 001001 */ 		k.resetLabel ();
/* 001002 */ 		k.showStateAndMode ();
/* 001003 */ 		self.tagChildren (k.arg);
/* 001004 */ 		c.treeWantsFocus ();
/* 001004 */ 	});},
/* 001006 */ 	get tagChildren () {return __get__ (this, function (self, tag) {
/* 001008 */ 		var c = self.c;
/* 001009 */ 		var tc = c.theTagController;
/* 001010 */ 		if (tc) {
/* 001011 */ 			for (var p of c.p.children ()) {
/* 001012 */ 				tc.add_tag (p, tag);
/* 001012 */ 			}
/* 001013 */ 			g.es_print ('Added {} tag to {} nodes'.format (tag, len (list (c.p.children ()))));
/* 001013 */ 		}
/* 001014 */ 		else {
/* 001015 */ 			g.es_print ('nodetags not active');
/* 001015 */ 		}
/* 001015 */ 	});},
/* 001018 */ 	get addChangeStringToLabel () {return __get__ (this, function (self) {
/* 001020 */ 		var c = self.c;
/* 001021 */ 		var ftm = c.findCommands.ftm;
/* 001022 */ 		var s = ftm.getChangeText ();
/* 001023 */ 		c.minibufferWantsFocus ();
/* 001024 */ 		while (s.endswith ('\n') || s.endswith ('\r')) {
/* 001025 */ 			var s = s.__getslice__ (0, -(1), 1);
/* 001025 */ 		}
/* 001026 */ 		c.k.extendLabel (s, __kwargtrans__ ({select: true, protect: false}));
/* 001026 */ 	});},
/* 001028 */ 	get addFindStringToLabel () {return __get__ (this, function (self, protect) {
/* 001028 */ 		if (typeof protect == 'undefined' || (protect != null && protect.hasOwnProperty ("__kwargtrans__"))) {;
/* 001028 */ 			var protect = true;
/* 001028 */ 		};
/* 001029 */ 		var c = self.c;
/* 001029 */ 		var k = c.k;
/* 001030 */ 		var ftm = c.findCommands.ftm;
/* 001031 */ 		var s = ftm.getFindText ();
/* 001032 */ 		c.minibufferWantsFocus ();
/* 001033 */ 		while (s.endswith ('\n') || s.endswith ('\r')) {
/* 001034 */ 			var s = s.__getslice__ (0, -(1), 1);
/* 001034 */ 		}
/* 001035 */ 		k.extendLabel (s, __kwargtrans__ ({select: true, protect: protect}));
/* 001035 */ 	});},
/* 001037 */ 	get editWidget () {return __get__ (this, function (self, event, forceFocus) {
/* 001037 */ 		if (typeof forceFocus == 'undefined' || (forceFocus != null && forceFocus.hasOwnProperty ("__kwargtrans__"))) {;
/* 001037 */ 			var forceFocus = true;
/* 001037 */ 		};
/* 001045 */ 		var c = self.c;
/* 001048 */ 		self.w = c.frame.body.wrapper;
/* 001049 */ 		return self.w;
/* 001049 */ 	});},
/* 001051 */ 	get generalChangeHelper () {return __get__ (this, function (self, find_pattern, change_pattern, changeAll) {
/* 001051 */ 		if (typeof changeAll == 'undefined' || (changeAll != null && changeAll.hasOwnProperty ("__kwargtrans__"))) {;
/* 001051 */ 			var changeAll = false;
/* 001051 */ 		};
/* 001052 */ 		var c = self.c;
/* 001053 */ 		self.setupSearchPattern (find_pattern);
/* 001054 */ 		self.setupChangePattern (change_pattern);
/* 001055 */ 		if (c.vim_mode && c.vimCommands) {
/* 001056 */ 			c.vimCommands.update_dot_before_search (__kwargtrans__ ({find_pattern: find_pattern, change_pattern: change_pattern}));
/* 001056 */ 		}
/* 001058 */ 		c.widgetWantsFocusNow (self.w);
/* 001059 */ 		self.p = c.p;
/* 001060 */ 		if (changeAll) {
/* 001061 */ 			self.changeAllCommand ();
/* 001061 */ 		}
/* 001062 */ 		else {
/* 001064 */ 			self.findNextCommand ();
/* 001064 */ 		}
/* 001064 */ 	});},
/* 001066 */ 	get generalSearchHelper () {return __get__ (this, function (self, pattern, cloneFindAll, cloneFindAllFlattened, findAll) {
/* 001066 */ 		if (typeof cloneFindAll == 'undefined' || (cloneFindAll != null && cloneFindAll.hasOwnProperty ("__kwargtrans__"))) {;
/* 001066 */ 			var cloneFindAll = false;
/* 001066 */ 		};
/* 001066 */ 		if (typeof cloneFindAllFlattened == 'undefined' || (cloneFindAllFlattened != null && cloneFindAllFlattened.hasOwnProperty ("__kwargtrans__"))) {;
/* 001066 */ 			var cloneFindAllFlattened = false;
/* 001066 */ 		};
/* 001066 */ 		if (typeof findAll == 'undefined' || (findAll != null && findAll.hasOwnProperty ("__kwargtrans__"))) {;
/* 001066 */ 			var findAll = false;
/* 001066 */ 		};
/* 001071 */ 		var c = self.c;
/* 001072 */ 		self.setupSearchPattern (pattern);
/* 001073 */ 		if (c.vim_mode && c.vimCommands) {
/* 001074 */ 			c.vimCommands.update_dot_before_search (__kwargtrans__ ({find_pattern: pattern, change_pattern: null}));
/* 001074 */ 		}
/* 001077 */ 		c.widgetWantsFocusNow (self.w);
/* 001078 */ 		self.p = c.p;
/* 001079 */ 		if (findAll) {
/* 001080 */ 			self.findAllCommand ();
/* 001080 */ 		}
/* 001081 */ 		else if (cloneFindAll) {
/* 001082 */ 			self.cloneFindAllCommand ();
/* 001082 */ 		}
/* 001083 */ 		else if (cloneFindAllFlattened) {
/* 001084 */ 			self.cloneFindAllFlattenedCommand ();
/* 001084 */ 		}
/* 001085 */ 		else {
/* 001087 */ 			self.findNextCommand ();
/* 001087 */ 		}
/* 001087 */ 	});},
/* 001089 */ 	get lastStateHelper () {return __get__ (this, function (self) {
/* 001090 */ 		var k = self.k;
/* 001091 */ 		k.clearState ();
/* 001092 */ 		k.resetLabel ();
/* 001093 */ 		k.showStateAndMode ();
/* 001093 */ 	});},
/* 001095 */ 	get reSearchBackward () {return __get__ (this, cmd ('re-search-backward') (function (self, event) {
/* 001097 */ 		self.setupArgs (__kwargtrans__ ({forward: false, regexp: true, word: null}));
/* 001098 */ 		self.stateZeroHelper (event, 'Regexp Search Backward:', self.reSearch1, __kwargtrans__ ({escapes: ['\t']}));
/* 001098 */ 	}));},
/* 001102 */ 	get reSearchForward () {return __get__ (this, cmd ('re-search-forward') (function (self, event) {
/* 001104 */ 		self.setupArgs (__kwargtrans__ ({forward: true, regexp: true, word: null}));
/* 001105 */ 		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Regexp Search:', handler: self.reSearch1, escapes: ['\t']}));
/* 001105 */ 	}));},
/* 001110 */ 	get reSearch1 () {return __get__ (this, function (self, event) {
/* 001111 */ 		var k = self.k;
/* 001112 */ 		if (k.getArgEscapeFlag) {
/* 001113 */ 			self.setReplaceString1 (__kwargtrans__ ({event: null}));
/* 001113 */ 		}
/* 001114 */ 		else {
/* 001115 */ 			self.updateFindList (k.arg);
/* 001116 */ 			self.lastStateHelper ();
/* 001117 */ 			self.generalSearchHelper (k.arg);
/* 001117 */ 		}
/* 001117 */ 	});},
/* 001119 */ 	get searchBackward () {return __get__ (this, cmd ('search-backward') (function (self, event) {
/* 001121 */ 		self.setupArgs (__kwargtrans__ ({forward: false, regexp: false, word: false}));
/* 001122 */ 		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Search Backward: ', handler: self.search1, escapes: ['\t']}));
/* 001122 */ 	}));},
/* 001127 */ 	get searchForward () {return __get__ (this, cmd ('search-forward') (function (self, event) {
/* 001129 */ 		self.setupArgs (__kwargtrans__ ({forward: true, regexp: false, word: false}));
/* 001130 */ 		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Search: ', handler: self.search1, escapes: ['\t']}));
/* 001130 */ 	}));},
/* 001135 */ 	get search1 () {return __get__ (this, function (self, event) {
/* 001136 */ 		var k = self.k;
/* 001137 */ 		if (k.getArgEscapeFlag) {
/* 001139 */ 			self.setReplaceString1 (__kwargtrans__ ({event: null}));
/* 001139 */ 		}
/* 001140 */ 		else {
/* 001141 */ 			self.updateFindList (k.arg);
/* 001142 */ 			self.lastStateHelper ();
/* 001143 */ 			self.generalSearchHelper (k.arg);
/* 001143 */ 		}
/* 001143 */ 	});},
/* 001145 */ 	get setReplaceString () {return __get__ (this, cmd ('set-replace-string') (function (self, event) {
/* 001148 */ 		var prompt = 'Replace ' + (self.pattern_match ? 'Regex' : 'String');
/* 001149 */ 		var prefix = '{}: '.format (prompt);
/* 001150 */ 		self.stateZeroHelper (event, __kwargtrans__ ({prefix: prefix, handler: self.setReplaceString1}));
/* 001150 */ 	}));},
/* 001154 */ 	get setReplaceString1 () {return __get__ (this, function (self, event) {
/* 001155 */ 		var k = self.k;
/* 001156 */ 		var prompt = 'Replace ' + (self.pattern_match ? 'Regex' : 'String');
/* 001157 */ 		self._sString = k.arg;
/* 001158 */ 		self.updateFindList (k.arg);
/* 001159 */ 		var s = '{}: {} With: '.format (prompt, self._sString);
/* 001160 */ 		k.setLabelBlue (s);
/* 001161 */ 		self.addChangeStringToLabel ();
/* 001162 */ 		k.getNextArg (self.setReplaceString2);
/* 001162 */ 	});},
/* 001164 */ 	get setReplaceString2 () {return __get__ (this, function (self, event) {
/* 001165 */ 		var k = self.k;
/* 001166 */ 		self.updateChangeList (k.arg);
/* 001167 */ 		self.lastStateHelper ();
/* 001168 */ 		self.generalChangeHelper (self._sString, k.arg, __kwargtrans__ ({changeAll: self.changeAllFlag}));
/* 001168 */ 	});},
/* 001170 */ 	get searchWithPresentOptions () {return __get__ (this, cmd ('set-search-string') (function (self, event, findAllFlag, findAllUniqueFlag, changeAllFlag) {
/* 001170 */ 		if (typeof findAllFlag == 'undefined' || (findAllFlag != null && findAllFlag.hasOwnProperty ("__kwargtrans__"))) {;
/* 001170 */ 			var findAllFlag = false;
/* 001170 */ 		};
/* 001170 */ 		if (typeof findAllUniqueFlag == 'undefined' || (findAllUniqueFlag != null && findAllUniqueFlag.hasOwnProperty ("__kwargtrans__"))) {;
/* 001170 */ 			var findAllUniqueFlag = false;
/* 001170 */ 		};
/* 001170 */ 		if (typeof changeAllFlag == 'undefined' || (changeAllFlag != null && changeAllFlag.hasOwnProperty ("__kwargtrans__"))) {;
/* 001170 */ 			var changeAllFlag = false;
/* 001170 */ 		};
/* 001178 */ 		self.changeAllFlag = changeAllFlag;
/* 001179 */ 		self.findAllFlag = findAllFlag;
/* 001180 */ 		self.findAllUniqueFlag = findAllUniqueFlag;
/* 001181 */ 		self.ftm.set_entry_focus ();
/* 001182 */ 		var escapes = ['\t'];
/* 001183 */ 		escapes.extend (self.findEscapes ());
/* 001184 */ 		self.stateZeroHelper (event, 'Search: ', self.searchWithPresentOptions1, __kwargtrans__ ({escapes: escapes}));
/* 001184 */ 	}));},
/* 001188 */ 	get searchWithPresentOptions1 () {return __get__ (this, function (self, event) {
/* 001190 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 001190 */ 		var c = __left0__ [0];
/* 001190 */ 		var k = __left0__ [1];
/* 001191 */ 		if (k.getArgEscapeFlag) {
/* 001193 */ 			if (__in__ (event.stroke, self.findEscapes ())) {
/* 001194 */ 				var command = self.escapeCommand (event);
/* 001195 */ 				var func = c.commandsDict.py_get (command);
/* 001196 */ 				k.clearState ();
/* 001197 */ 				k.resetLabel ();
/* 001198 */ 				k.showStateAndMode ();
/* 001199 */ 				if (func) {
/* 001200 */ 					func (event);
/* 001200 */ 				}
/* 001201 */ 				else {
/* 001202 */ 					g.trace ('unknown command', command);
/* 001203 */ 					return ;
/* 001203 */ 				}
/* 001203 */ 			}
/* 001204 */ 			else {
/* 001206 */ 				if (self.findAllFlag) {
/* 001207 */ 					self.changeAllFlag = true;
/* 001207 */ 				}
/* 001208 */ 				k.getArgEscapeFlag = false;
/* 001209 */ 				self.setupSearchPattern (k.arg);
/* 001210 */ 				self.setReplaceString1 (__kwargtrans__ ({event: null}));
/* 001210 */ 			}
/* 001210 */ 		}
/* 001211 */ 		else {
/* 001212 */ 			self.updateFindList (k.arg);
/* 001213 */ 			k.clearState ();
/* 001214 */ 			k.resetLabel ();
/* 001215 */ 			k.showStateAndMode ();
/* 001216 */ 			if (self.findAllFlag) {
/* 001217 */ 				self.setupSearchPattern (k.arg);
/* 001218 */ 				self.findAllCommand ();
/* 001218 */ 			}
/* 001219 */ 			else {
/* 001220 */ 				self.generalSearchHelper (k.arg);
/* 001220 */ 			}
/* 001220 */ 		}
/* 001220 */ 	});},
/* 001222 */ 	get findEscapes () {return __get__ (this, function (self) {
/* 001224 */ 		var d = self.c.k.computeInverseBindingDict ();
/* 001225 */ 		var results = [];
/* 001226 */ 		for (var command of tuple (['find-def', 'find-next', 'find-prev', 'find-var'])) {
/* 001227 */ 			var aList = d.py_get (command, []);
/* 001228 */ 			for (var data of aList) {
/* 001229 */ 				var __left0__ = data;
/* 001229 */ 				var pane = __left0__ [0];
/* 001229 */ 				var stroke = __left0__ [1];
/* 001230 */ 				if (pane.startswith ('all')) {
/* 001231 */ 					results.append (stroke);
/* 001231 */ 				}
/* 001231 */ 			}
/* 001231 */ 		}
/* 001232 */ 		return results;
/* 001232 */ 	});},
/* 001234 */ 	get escapeCommand () {return __get__ (this, function (self, event) {
/* 001236 */ 		var d = self.c.k.bindingsDict;
/* 001237 */ 		var aList = d.py_get (event.stroke);
/* 001238 */ 		for (var bi of aList) {
/* 001239 */ 			if (bi.stroke == event.stroke) {
/* 001240 */ 				return bi.commandName;
/* 001240 */ 			}
/* 001240 */ 		}
/* 001241 */ 		return null;
/* 001241 */ 	});},
/* 001243 */ 	get stateZeroHelper () {return __get__ (this, function (self, event, prefix, handler, escapes) {
/* 001243 */ 		if (typeof escapes == 'undefined' || (escapes != null && escapes.hasOwnProperty ("__kwargtrans__"))) {;
/* 001243 */ 			var escapes = null;
/* 001243 */ 		};
/* 001245 */ 		var __left0__ = tuple ([self.c, self.k]);
/* 001245 */ 		var c = __left0__ [0];
/* 001245 */ 		var k = __left0__ [1];
/* 001246 */ 		self.w = self.editWidget (event);
/* 001247 */ 		if (!(self.w)) {
/* 001248 */ 			g.trace ('no self.w');
/* 001249 */ 			return ;
/* 001249 */ 		}
/* 001250 */ 		k.setLabelBlue (prefix);
/* 001252 */ 		if (self.minibuffer_mode) {
/* 001253 */ 			self.showFindOptionsInStatusArea ();
/* 001253 */ 		}
/* 001254 */ 		else if (c.config.getBool ('use-find-dialog', __kwargtrans__ ({py_default: true}))) {
/* 001255 */ 			g.app.gui.openFindDialog (c);
/* 001255 */ 		}
/* 001256 */ 		else {
/* 001257 */ 			c.frame.log.selectTab ('Find');
/* 001257 */ 		}
/* 001258 */ 		self.addFindStringToLabel (__kwargtrans__ ({protect: false}));
/* 001259 */ 		if (escapes === null) {
/* 001259 */ 			var escapes = [];
/* 001259 */ 		}
/* 001260 */ 		k.getArgEscapes = escapes;
/* 001261 */ 		k.getArgEscapeFlag = false;
/* 001262 */ 		k.get1Arg (event, __kwargtrans__ ({handler: handler, tabList: self.findTextList, completion: true}));
/* 001262 */ 	});},
/* 001264 */ 	get updateChangeList () {return __get__ (this, function (self, s) {
/* 001265 */ 		if (!__in__ (s, self.changeTextList)) {
/* 001266 */ 			self.changeTextList.append (s);
/* 001266 */ 		}
/* 001266 */ 	});},
/* 001268 */ 	get updateFindList () {return __get__ (this, function (self, s) {
/* 001269 */ 		if (!__in__ (s, self.findTextList)) {
/* 001270 */ 			self.findTextList.append (s);
/* 001270 */ 		}
/* 001270 */ 	});},
/* 001272 */ 	get wordSearchBackward () {return __get__ (this, cmd ('word-search-backward') (function (self, event) {
/* 001274 */ 		self.setupArgs (__kwargtrans__ ({forward: false, regexp: false, word: true}));
/* 001275 */ 		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Word Search Backward: ', handler: self.wordSearch1}));
/* 001275 */ 	}));},
/* 001279 */ 	get wordSearchForward () {return __get__ (this, cmd ('word-search-forward') (function (self, event) {
/* 001281 */ 		self.setupArgs (__kwargtrans__ ({forward: true, regexp: false, word: true}));
/* 001282 */ 		self.stateZeroHelper (event, __kwargtrans__ ({prefix: 'Word Search: ', handler: self.wordSearch1}));
/* 001282 */ 	}));},
/* 001286 */ 	get wordSearch1 () {return __get__ (this, function (self, event) {
/* 001287 */ 		var k = self.k;
/* 001288 */ 		self.lastStateHelper ();
/* 001289 */ 		self.generalSearchHelper (k.arg);
/* 001289 */ 	});},
/* 001292 */ 	get toggleFindCollapesNodes () {return __get__ (this, cmd ('toggle-find-collapses-nodes') (function (self, event) {
/* 001295 */ 		var c = self.c;
/* 001296 */ 		c.sparse_find = !(c.sparse_find);
/* 001297 */ 		if (!(g.unitTesting)) {
/* 001298 */ 			g.es ('sparse_find', c.sparse_find);
/* 001298 */ 		}
/* 001298 */ 	}));},
/* 001300 */ 	get toggleIgnoreCaseOption () {return __get__ (this, cmd ('toggle-find-ignore-case-option') (function (self, event) {
/* 001303 */ 		return self.toggleOption ('ignore_case');
/* 001303 */ 	}));},
/* 001305 */ 	get toggleMarkChangesOption () {return __get__ (this, cmd ('toggle-find-mark-changes-option') (function (self, event) {
/* 001308 */ 		return self.toggleOption ('mark_changes');
/* 001308 */ 	}));},
/* 001310 */ 	get toggleMarkFindsOption () {return __get__ (this, cmd ('toggle-find-mark-finds-option') (function (self, event) {
/* 001313 */ 		return self.toggleOption ('mark_finds');
/* 001313 */ 	}));},
/* 001315 */ 	get toggleRegexOption () {return __get__ (this, cmd ('toggle-find-regex-option') (function (self, event) {
/* 001318 */ 		return self.toggleOption ('pattern_match');
/* 001318 */ 	}));},
/* 001320 */ 	get toggleSearchBodyOption () {return __get__ (this, cmd ('toggle-find-in-body-option') (function (self, event) {
/* 001323 */ 		return self.toggleOption ('search_body');
/* 001323 */ 	}));},
/* 001325 */ 	get toggleSearchHeadlineOption () {return __get__ (this, cmd ('toggle-find-in-headline-option') (function (self, event) {
/* 001328 */ 		return self.toggleOption ('search_headline');
/* 001328 */ 	}));},
/* 001330 */ 	get toggleWholeWordOption () {return __get__ (this, cmd ('toggle-find-word-option') (function (self, event) {
/* 001333 */ 		return self.toggleOption ('whole_word');
/* 001333 */ 	}));},
/* 001335 */ 	get toggleWrapSearchOption () {return __get__ (this, cmd ('toggle-find-wrap-around-option') (function (self, event) {
/* 001338 */ 		return self.toggleOption ('wrap');
/* 001338 */ 	}));},
/* 001340 */ 	get toggleOption () {return __get__ (this, function (self, checkbox_name) {
/* 001341 */ 		var __left0__ = tuple ([self.c, self.c.findCommands]);
/* 001341 */ 		var c = __left0__ [0];
/* 001341 */ 		var fc = __left0__ [1];
/* 001342 */ 		self.ftm.toggle_checkbox (checkbox_name);
/* 001343 */ 		var options = fc.computeFindOptionsInStatusArea ();
/* 001344 */ 		c.frame.statusLine.put (options);
/* 001344 */ 	});},
/* 001346 */ 	get setFindScopeEveryWhere () {return __get__ (this, cmd ('set-find-everywhere') (function (self, event) {
/* 001346 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001346 */ 			var event = null;
/* 001346 */ 		};
/* 001349 */ 		return self.setFindScope ('entire-outline');
/* 001349 */ 	}));},
/* 001351 */ 	get setFindScopeNodeOnly () {return __get__ (this, cmd ('set-find-node-only') (function (self, event) {
/* 001351 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001351 */ 			var event = null;
/* 001351 */ 		};
/* 001354 */ 		return self.setFindScope ('node-only');
/* 001354 */ 	}));},
/* 001356 */ 	get setFindScopeSuboutlineOnly () {return __get__ (this, cmd ('set-find-suboutline-only') (function (self, event) {
/* 001356 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001356 */ 			var event = null;
/* 001356 */ 		};
/* 001359 */ 		return self.setFindScope ('suboutline-only');
/* 001359 */ 	}));},
/* 001361 */ 	get setFindScope () {return __get__ (this, function (self, where) {
/* 001363 */ 		var __left0__ = tuple ([self.c, self.c.findCommands]);
/* 001363 */ 		var c = __left0__ [0];
/* 001363 */ 		var fc = __left0__ [1];
/* 001364 */ 		self.ftm.set_radio_button (where);
/* 001365 */ 		var options = fc.computeFindOptionsInStatusArea ();
/* 001366 */ 		c.frame.statusLine.put (options);
/* 001366 */ 	});},
/* 001368 */ 	get showFindOptions () {return __get__ (this, cmd ('show-find-options') (function (self, event) {
/* 001368 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001368 */ 			var event = null;
/* 001368 */ 		};
/* 001374 */ 		var frame = self.c.frame;
/* 001375 */ 		frame.clearStatusLine ();
/* 001376 */ 		var __left0__ = self.computeFindOptions ();
/* 001376 */ 		var part1 = __left0__ [0];
/* 001376 */ 		var part2 = __left0__ [1];
/* 001377 */ 		frame.putStatusLine (part1, __kwargtrans__ ({bg: 'blue'}));
/* 001378 */ 		frame.putStatusLine (part2);
/* 001378 */ 	}));},
/* 001380 */ 	get computeFindOptions () {return __get__ (this, function (self) {
/* 001382 */ 		var z = [];
/* 001384 */ 		var head = self.search_headline;
/* 001385 */ 		var body = self.search_body;
/* 001386 */ 		if (self.suboutline_only) {
/* 001387 */ 			var scope = 'tree';
/* 001387 */ 		}
/* 001388 */ 		else if (self.node_only) {
/* 001389 */ 			var scope = 'node';
/* 001389 */ 		}
/* 001390 */ 		else {
/* 001391 */ 			var scope = 'all';
/* 001391 */ 		}
/* 001395 */ 		var head = (head ? 'head' : '');
/* 001396 */ 		var body = (body ? 'body' : '');
/* 001397 */ 		var sep = (head && body ? '+' : '');
/* 001398 */ 		var part1 = '{}{}{} {}  '.format (head, sep, body, scope);
/* 001400 */ 		var regex = self.pattern_match;
/* 001401 */ 		if (regex) {
/* 001401 */ 			z.append ('regex');
/* 001401 */ 		}
/* 001402 */ 		var table = tuple ([tuple (['reverse', 'reverse']), tuple (['ignore_case', 'noCase']), tuple (['whole_word', 'word']), tuple (['wrap', 'wrap']), tuple (['mark_changes', 'markChg']), tuple (['mark_finds', 'markFnd'])]);
/* 001410 */ 		for (var [ivar, s] of table) {
/* 001411 */ 			var val = getattr (self, ivar);
/* 001412 */ 			if (val) {
/* 001412 */ 				z.append (s);
/* 001412 */ 			}
/* 001412 */ 		}
/* 001413 */ 		var part2 = ' '.join (z);
/* 001414 */ 		return tuple ([part1, part2]);
/* 001414 */ 	});},
/* 001416 */ 	get setupChangePattern () {return __get__ (this, function (self, pattern) {
/* 001417 */ 		self.ftm.setChangeText (pattern);
/* 001417 */ 	});},
/* 001419 */ 	get setupSearchPattern () {return __get__ (this, function (self, pattern) {
/* 001420 */ 		self.ftm.setFindText (pattern);
/* 001420 */ 	});},
/* 001423 */ 	get change () {return __get__ (this, cmd ('replace') (function (self, event) {
/* 001423 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 001423 */ 			var event = null;
/* 001423 */ 		};
/* 001425 */ 		if (self.checkArgs ()) {
/* 001426 */ 			self.initInHeadline ();
/* 001427 */ 			self.changeSelection ();
/* 001427 */ 		}
/* 001427 */ 	}));},
/* 001429 */ 	py_replace: change,
/* 001431 */ 	get changeAll () {return __get__ (this, function (self) {
/* 001433 */ 		var __left0__ = tuple ([self.c, self.c.p, self.c.undoer]);
/* 001433 */ 		var c = __left0__ [0];
/* 001433 */ 		var current = __left0__ [1];
/* 001433 */ 		var u = __left0__ [2];
/* 001434 */ 		var undoType = 'Replace All';
/* 001435 */ 		var t1 = time.process_time ();
/* 001436 */ 		if (!(self.checkArgs ())) {
/* 001437 */ 			return ;
/* 001437 */ 		}
/* 001438 */ 		self.initInHeadline ();
/* 001439 */ 		var saveData = self.save ();
/* 001440 */ 		self.initBatchCommands ();
/* 001441 */ 		var count = 0;
/* 001442 */ 		u.beforeChangeGroup (current, undoType);
/* 001445 */ 		if (!(self.find_text)) {
/* 001446 */ 			return ;
/* 001446 */ 		}
/* 001447 */ 		if (!(self.search_headline) && !(self.search_body)) {
/* 001448 */ 			return ;
/* 001448 */ 		}
/* 001449 */ 		self.change_text = self.replaceBackSlashes (self.change_text);
/* 001450 */ 		if (self.pattern_match) {
/* 001451 */ 			var ok = self.precompilePattern ();
/* 001452 */ 			if (!(ok)) {
/* 001453 */ 				return ;
/* 001453 */ 			}
/* 001453 */ 		}
/* 001455 */ 		if (self.node_only) {
/* 001456 */ 			var positions = [c.p];
/* 001456 */ 		}
/* 001457 */ 		else if (self.suboutline_only) {
/* 001458 */ 			var positions = c.p.self_and_subtree ();
/* 001458 */ 		}
/* 001459 */ 		else {
/* 001460 */ 			var positions = c.all_unique_positions ();
/* 001460 */ 		}
/* 001461 */ 		var count = 0;
/* 001462 */ 		for (var p of positions) {
/* 001463 */ 			var __left0__ = tuple ([0, 0]);
/* 001463 */ 			var count_h = __left0__ [0];
/* 001463 */ 			var count_b = __left0__ [1];
/* 001464 */ 			var undoData = u.beforeChangeNodeContents (p);
/* 001465 */ 			if (self.search_headline) {
/* 001466 */ 				var __left0__ = self.batchSearchAndReplace (p.h);
/* 001466 */ 				var count_h = __left0__ [0];
/* 001466 */ 				var new_h = __left0__ [1];
/* 001467 */ 				if (count_h) {
/* 001467 */ 					count += count_h;
/* 001469 */ 					p.h = new_h;
/* 001469 */ 				}
/* 001469 */ 			}
/* 001470 */ 			if (self.search_body) {
/* 001471 */ 				var __left0__ = self.batchSearchAndReplace (p.b);
/* 001471 */ 				var count_b = __left0__ [0];
/* 001471 */ 				var new_b = __left0__ [1];
/* 001472 */ 				if (count_b) {
/* 001472 */ 					count += count_b;
/* 001474 */ 					p.b = new_b;
/* 001474 */ 				}
/* 001474 */ 			}
/* 001475 */ 			if (count_h || count_b) {
/* 001476 */ 				u.afterChangeNodeContents (p, 'Replace All', undoData);
/* 001476 */ 			}
/* 001476 */ 		}
/* 001477 */ 		var p = c.p;
/* 001478 */ 		u.afterChangeGroup (p, undoType, __kwargtrans__ ({reportFlag: true}));
/* 001479 */ 		var t2 = time.process_time ();
/* 001480 */ 		g.es_print ('changed {} instances{} in {} sec.'.format (count, g.plural (count), t2 - t1));
/* 001481 */ 		c.recolor ();
/* 001482 */ 		c.redraw (p);
/* 001483 */ 		self.restore (saveData);
/* 001483 */ 	});},
/* 001485 */ 	get batchSearchAndReplace () {return __get__ (this, function (self, s) {
/* 001491 */ 		if (sys.platform.lower ().startswith ('win')) {
/* 001492 */ 			var s = s.py_replace ('\r', '');
/* 001492 */ 		}
/* 001496 */ 		if (!(s)) {
/* 001497 */ 			return tuple ([false, null]);
/* 001497 */ 		}
/* 001500 */ 		if (self.pattern_match) {
/* 001501 */ 			return self.batchRegexReplace (s);
/* 001501 */ 		}
/* 001502 */ 		if (self.whole_word) {
/* 001503 */ 			return self.batchWordReplace (s);
/* 001503 */ 		}
/* 001504 */ 		return self.batchPlainReplace (s);
/* 001504 */ 	});},
/* 001506 */ 	get batchPlainReplace () {return __get__ (this, function (self, s) {
/* 001511 */ 		var __left0__ = tuple ([self.find_text, self.change_text]);
/* 001511 */ 		var find = __left0__ [0];
/* 001511 */ 		var change = __left0__ [1];
/* 001513 */ 		var s0 = s;
/* 001514 */ 		var find0 = self.replaceBackSlashes (find);
/* 001515 */ 		if (self.ignore_case) {
/* 001516 */ 			var s = s0.lower ();
/* 001517 */ 			var find = find0.lower ();
/* 001517 */ 		}
/* 001518 */ 		var __left0__ = tuple ([0, 0, []]);
/* 001518 */ 		var count = __left0__ [0];
/* 001518 */ 		var prev_i = __left0__ [1];
/* 001518 */ 		var result = __left0__ [2];
/* 001519 */ 		while (true) {
/* 001521 */ 			var i = s.find (find, prev_i);
/* 001522 */ 			if (i == -(1)) {
/* 001522 */ 				break;
/* 001522 */ 			}
/* 001522 */ 			count++;
/* 001526 */ 			result.append (s0.__getslice__ (prev_i, i, 1));
/* 001527 */ 			result.append (change);
/* 001528 */ 			var prev_i = i + len (find);
/* 001528 */ 		}
/* 001530 */ 		result.append (s0.__getslice__ (prev_i, null, 1));
/* 001531 */ 		return tuple ([count, ''.join (result)]);
/* 001531 */ 	});},
/* 001533 */ 	get batchRegexReplace () {return __get__ (this, function (self, s) {
/* 001538 */ 		var __left0__ = tuple ([0, 0, []]);
/* 001538 */ 		var count = __left0__ [0];
/* 001538 */ 		var prev_i = __left0__ [1];
/* 001538 */ 		var result = __left0__ [2];
/* 001540 */ 		var flags = re.MULTILINE;
/* 001541 */ 		if (self.ignore_case) {
/* 001541 */ 			flags |= re.IGNORECASE;
/* 001541 */ 		}
/* 001543 */ 		for (var m of re.finditer (self.find_text, s, flags)) {
/* 001543 */ 			count++;
/* 001545 */ 			var i = m.start ();
/* 001546 */ 			result.append (s.__getslice__ (prev_i, i, 1));
/* 001548 */ 			var groups = m.groups ();
/* 001549 */ 			if (groups) {
/* 001550 */ 				var change_text = self.makeRegexSubs (self.change_text, groups);
/* 001550 */ 			}
/* 001551 */ 			else {
/* 001552 */ 				var change_text = self.change_text;
/* 001552 */ 			}
/* 001553 */ 			result.append (change_text);
/* 001554 */ 			var prev_i = m.end ();
/* 001554 */ 		}
/* 001556 */ 		result.append (s.__getslice__ (prev_i, null, 1));
/* 001557 */ 		var s = ''.join (result);
/* 001558 */ 		return tuple ([count, s]);
/* 001558 */ 	});},
/* 001560 */ 	get batchWordReplace () {return __get__ (this, function (self, s) {
/* 001565 */ 		var __left0__ = tuple ([self.find_text, self.change_text]);
/* 001565 */ 		var find = __left0__ [0];
/* 001565 */ 		var change = __left0__ [1];
/* 001567 */ 		var s0 = s;
/* 001568 */ 		var find0 = self.replaceBackSlashes (find);
/* 001569 */ 		if (self.ignore_case) {
/* 001570 */ 			var s = s0.lower ();
/* 001571 */ 			var find = find0.lower ();
/* 001571 */ 		}
/* 001572 */ 		var __left0__ = tuple ([0, 0, []]);
/* 001572 */ 		var count = __left0__ [0];
/* 001572 */ 		var prev_i = __left0__ [1];
/* 001572 */ 		var result = __left0__ [2];
/* 001573 */ 		while (true) {
/* 001575 */ 			var i = s.find (find, prev_i);
/* 001576 */ 			if (i == -(1)) {
/* 001576 */ 				break;
/* 001576 */ 			}
/* 001579 */ 			result.append (s0.__getslice__ (prev_i, i, 1));
/* 001580 */ 			if (g.match_word (s, i, find)) {
/* 001580 */ 				count++;
/* 001582 */ 				result.append (change);
/* 001582 */ 			}
/* 001583 */ 			else {
/* 001584 */ 				result.append (find0);
/* 001584 */ 			}
/* 001585 */ 			var prev_i = i + len (find);
/* 001585 */ 		}
/* 001587 */ 		result.append (s0.__getslice__ (prev_i, null, 1));
/* 001588 */ 		return tuple ([count, ''.join (result)]);
/* 001588 */ 	});},
/* 001593 */ 	get changeSelection () {return __get__ (this, function (self) {
/* 001594 */ 		var c = self.c;
/* 001595 */ 		var p = self.p || c.p;
/* 001596 */ 		var wrapper = c.frame.body && c.frame.body.wrapper;
/* 001597 */ 		var w = (self.in_headline ? c.edit_widget (p) : wrapper);
/* 001598 */ 		if (!(w)) {
/* 001599 */ 			self.in_headline = false;
/* 001600 */ 			var w = wrapper;
/* 001600 */ 		}
/* 001601 */ 		if (!(w)) {
/* 001601 */ 			return false;
/* 001601 */ 		}
/* 001602 */ 		var __left0__ = w.getSelectionRange ();
/* 001602 */ 		var oldSel = __left0__;
/* 001602 */ 		var sel = __left0__;
/* 001603 */ 		var __left0__ = sel;
/* 001603 */ 		var start = __left0__ [0];
/* 001603 */ 		var end = __left0__ [1];
/* 001604 */ 		if (start > end) {
/* 001604 */ 			var __left0__ = tuple ([end, start]);
/* 001604 */ 			var start = __left0__ [0];
/* 001604 */ 			var end = __left0__ [1];
/* 001604 */ 		}
/* 001605 */ 		if (start == end) {
/* 001606 */ 			g.es ('no text selected');
/* 001606 */ 			return false;
/* 001606 */ 		}
/* 001608 */ 		var __left0__ = oldSel;
/* 001608 */ 		var start = __left0__ [0];
/* 001608 */ 		var end = __left0__ [1];
/* 001609 */ 		var change_text = self.change_text;
/* 001611 */ 		if (self.pattern_match && self.match_obj) {
/* 001612 */ 			var groups = self.match_obj.groups ();
/* 001613 */ 			if (groups) {
/* 001614 */ 				var change_text = self.makeRegexSubs (change_text, groups);
/* 001614 */ 			}
/* 001614 */ 		}
/* 001616 */ 		var change_text = self.replaceBackSlashes (change_text);
/* 001617 */ 		for (var w2 of tuple ([w, self.s_ctrl])) {
/* 001618 */ 			if (start != end) {
/* 001618 */ 				w2.delete (start, end);
/* 001618 */ 			}
/* 001619 */ 			w2.insert (start, change_text);
/* 001620 */ 			w2.setInsertPoint ((self.reverse ? start : start + len (change_text)));
/* 001620 */ 		}
/* 001622 */ 		w.setSelectionRange (start, start + len (change_text));
/* 001623 */ 		c.widgetWantsFocus (w);
/* 001625 */ 		if (self.mark_changes) {
/* 001626 */ 			p.setMarked ();
/* 001627 */ 			p.setDirty ();
/* 001627 */ 		}
/* 001628 */ 		if (self.in_headline) {
/* 001629 */ 			// pass;
/* 001629 */ 		}
/* 001630 */ 		else {
/* 001631 */ 			c.frame.body.onBodyChanged ('Change', __kwargtrans__ ({oldSel: oldSel}));
/* 001631 */ 		}
/* 001632 */ 		c.frame.tree.updateIcon (p);
/* 001633 */ 		return true;
/* 001633 */ 	});},
/* 001635 */ 	get makeRegexSubs () {return __get__ (this, function (self, change_text, groups) {
/* 001640 */ 		var repl = function (match_object) {
/* 001642 */ 			var n = int (match_object.group (1)) - 1;
/* 001643 */ 			if ((0 <= n && n < len (groups))) {
/* 001645 */ 				return groups [n].py_replace ('\\b', '\\\\b').py_replace ('\\f', '\\\\f').py_replace ('\\n', '\\\\n').py_replace ('\\r', '\\\\r').py_replace ('\\t', '\\\\t').py_replace ('\\v', '\\\\v');
/* 001645 */ 			}
/* 001653 */ 			return match_object.group (0);
/* 001653 */ 		};
/* 001655 */ 		var result = re.sub ('\\\\([0-9])', repl, change_text);
/* 001661 */ 		return result;
/* 001661 */ 	});},
/* 001663 */ 	get changeThenFind () {return __get__ (this, function (self) {
/* 001664 */ 		if (!(self.checkArgs ())) {
/* 001665 */ 			return ;
/* 001665 */ 		}
/* 001666 */ 		self.initInHeadline ();
/* 001667 */ 		if (self.changeSelection ()) {
/* 001668 */ 			self.findNext (false);
/* 001668 */ 		}
/* 001668 */ 	});},
/* 001670 */ 	get cloneFindTag () {return __get__ (this, function (self, tag) {
/* 001672 */ 		var __left0__ = tuple ([self.c, self.c.undoer]);
/* 001672 */ 		var c = __left0__ [0];
/* 001672 */ 		var u = __left0__ [1];
/* 001673 */ 		var tc = c.theTagController;
/* 001674 */ 		if (!(tc)) {
/* 001675 */ 			g.es_print ('nodetags not active');
/* 001676 */ 			return 0;
/* 001676 */ 		}
/* 001677 */ 		var clones = tc.get_tagged_nodes (tag);
/* 001678 */ 		if (clones) {
/* 001679 */ 			var undoType = 'Clone Find Tag';
/* 001680 */ 			var undoData = u.beforeInsertNode (c.p);
/* 001681 */ 			var found = self.createCloneTagNodes (clones);
/* 001682 */ 			u.afterInsertNode (found, undoType, undoData);
/* 001684 */ 			c.setChanged ();
/* 001685 */ 			c.selectPosition (found);
/* 001686 */ 			c.redraw ();
/* 001686 */ 		}
/* 001687 */ 		else {
/* 001688 */ 			g.es_print ('tag not found: {}'.format (self.find_text));
/* 001688 */ 		}
/* 001689 */ 		return len (clones);
/* 001689 */ 	});},
/* 001691 */ 	get createCloneTagNodes () {return __get__ (this, function (self, clones) {
/* 001696 */ 		var __left0__ = tuple ([self.c, self.c.p]);
/* 001696 */ 		var c = __left0__ [0];
/* 001696 */ 		var p = __left0__ [1];
/* 001699 */ 		var found = c.lastTopLevel ().insertAfter ();
/* 001702 */ 		found.h = 'Found Tag: {}'.format (self.find_text);
/* 001704 */ 		for (var p of clones) {
/* 001706 */ 			var p2 = p.copy ();
/* 001707 */ 			var n = found.numberOfChildren ();
/* 001708 */ 			p2._linkCopiedAsNthChild (found, n);
/* 001708 */ 		}
/* 001709 */ 		return found;
/* 001709 */ 	});},
/* 001711 */ 	get findAll () {return __get__ (this, function (self, clone_find_all, clone_find_all_flattened) {
/* 001711 */ 		if (typeof clone_find_all == 'undefined' || (clone_find_all != null && clone_find_all.hasOwnProperty ("__kwargtrans__"))) {;
/* 001711 */ 			var clone_find_all = false;
/* 001711 */ 		};
/* 001711 */ 		if (typeof clone_find_all_flattened == 'undefined' || (clone_find_all_flattened != null && clone_find_all_flattened.hasOwnProperty ("__kwargtrans__"))) {;
/* 001711 */ 			var clone_find_all_flattened = false;
/* 001711 */ 		};
/* 001713 */ 		var __left0__ = tuple ([self.c, clone_find_all_flattened]);
/* 001713 */ 		var c = __left0__ [0];
/* 001713 */ 		var flatten = __left0__ [1];
/* 001714 */ 		var clone_find = clone_find_all || flatten;
/* 001715 */ 		if (flatten) {
/* 001716 */ 			var undoType = 'Clone Find All Flattened';
/* 001716 */ 		}
/* 001717 */ 		else if (clone_find_all) {
/* 001718 */ 			var undoType = 'Clone Find All';
/* 001718 */ 		}
/* 001719 */ 		else {
/* 001720 */ 			var undoType = 'Find All';
/* 001720 */ 		}
/* 001721 */ 		if (!(self.checkArgs ())) {
/* 001722 */ 			return 0;
/* 001722 */ 		}
/* 001723 */ 		self.initInHeadline ();
/* 001724 */ 		var data = self.save ();
/* 001725 */ 		self.initBatchCommands ();
/* 001729 */ 		if (self.pattern_match || self.findAllUniqueFlag) {
/* 001730 */ 			var ok = self.precompilePattern ();
/* 001731 */ 			if (!(ok)) {
/* 001731 */ 				return 0;
/* 001731 */ 			}
/* 001731 */ 		}
/* 001732 */ 		if (self.suboutline_only) {
/* 001733 */ 			var p = c.p;
/* 001734 */ 			var after = p.nodeAfterTree ();
/* 001734 */ 		}
/* 001735 */ 		else {
/* 001737 */ 			var p = c.rootPosition ();
/* 001738 */ 			var after = null;
/* 001738 */ 		}
/* 001740 */ 		var old_sparse_find = c.sparse_find;
/* 001741 */ 		try {
/* 001742 */ 			c.sparse_find = false;
/* 001743 */ 			if (clone_find) {
/* 001744 */ 				var count = self.doCloneFindAll (after, data, flatten, p, undoType);
/* 001744 */ 			}
/* 001745 */ 			else {
/* 001746 */ 				self.p = p;
/* 001747 */ 				var count = self.doFindAll (after, data, p, undoType);
/* 001747 */ 			}
/* 001747 */ 		}
/* 001747 */ 		finally {
/* 001750 */ 			c.sparse_find = old_sparse_find;
/* 001750 */ 		}
/* 001751 */ 		if (count) {
/* 001752 */ 			c.redraw ();
/* 001752 */ 		}
/* 001753 */ 		g.es ('found', count, 'matches for', self.find_text);
/* 001754 */ 		return count;
/* 001754 */ 	});},
/* 001756 */ 	get doCloneFindAll () {return __get__ (this, function (self, after, data, flatten, p, undoType) {
/* 001758 */ 		var __left0__ = tuple ([self.c, self.c.undoer]);
/* 001758 */ 		var c = __left0__ [0];
/* 001758 */ 		var u = __left0__ [1];
/* 001759 */ 		var __left0__ = tuple ([0, null]);
/* 001759 */ 		var count = __left0__ [0];
/* 001759 */ 		var found = __left0__ [1];
/* 001761 */ 		var __left0__ = tuple ([[], set ()]);
/* 001761 */ 		var clones = __left0__ [0];
/* 001761 */ 		var skip = __left0__ [1];
/* 001762 */ 		while (p && p != after) {
/* 001763 */ 			var progress = p.copy ();
/* 001764 */ 			if (__in__ (p.v, skip)) {
/* 001765 */ 				p.moveToThreadNext ();
/* 001765 */ 			}
/* 001766 */ 			else {
/* 001767 */ 				var count = self.doCloneFindAllHelper (clones, count, flatten, p, skip);
/* 001767 */ 			}
/* 001767 */ 		}
/* 001769 */ 		if (clones) {
/* 001770 */ 			var undoData = u.beforeInsertNode (c.p);
/* 001771 */ 			var found = self.createCloneFindAllNodes (clones, flatten);
/* 001772 */ 			u.afterInsertNode (found, undoType, undoData);
/* 001774 */ 			c.setChanged ();
/* 001775 */ 			c.selectPosition (found);
/* 001775 */ 		}
/* 001776 */ 		else {
/* 001777 */ 			self.restore (data);
/* 001777 */ 		}
/* 001778 */ 		return count;
/* 001778 */ 	});},
/* 001780 */ 	get createCloneFindAllNodes () {return __get__ (this, function (self, clones, flattened) {
/* 001785 */ 		var c = self.c;
/* 001788 */ 		var found = c.lastTopLevel ().insertAfter ();
/* 001791 */ 		found.h = 'Found:{}'.format (self.find_text);
/* 001792 */ 		var status = self.getFindResultStatus (__kwargtrans__ ({find_all: true}));
/* 001793 */ 		var status = status.strip ().lstrip ('(').rstrip (')').strip ();
/* 001794 */ 		var flat = (flattened ? 'flattened, ' : '');
/* 001795 */ 		found.b = '@nosearch\n\n# {}{}\n\n# found {} nodes'.format (flat, status, len (clones));
/* 001797 */ 		for (var p of clones) {
/* 001799 */ 			var p2 = p.copy ();
/* 001800 */ 			var n = found.numberOfChildren ();
/* 001801 */ 			p2._linkCopiedAsNthChild (found, n);
/* 001801 */ 		}
/* 001803 */ 		found.v.children.py_sort (__kwargtrans__ ({key: (function __lambda__ (v) {
/* 001803 */ 			return v.h.lower ();
/* 001803 */ 		})}));
/* 001804 */ 		return found;
/* 001804 */ 	});},
/* 001806 */ 	get doCloneFindAllHelper () {return __get__ (this, function (self, clones, count, flatten, p, skip) {
/* 001808 */ 		if (g.inAtNosearch (p)) {
/* 001809 */ 			p.moveToNodeAfterTree ();
/* 001810 */ 			return count;
/* 001810 */ 		}
/* 001811 */ 		var found = self.findNextBatchMatch (p);
/* 001812 */ 		if (found) {
/* 001813 */ 			if (!(__in__ (p, clones))) {
/* 001814 */ 				clones.append (p.copy ());
/* 001814 */ 			}
/* 001814 */ 			count++;
/* 001814 */ 		}
/* 001816 */ 		if (flatten) {
/* 001817 */ 			skip.add (p.v);
/* 001818 */ 			p.moveToThreadNext ();
/* 001818 */ 		}
/* 001819 */ 		else if (found) {
/* 001821 */ 			for (var p2 of p.self_and_subtree (__kwargtrans__ ({copy: false}))) {
/* 001822 */ 				skip.add (p2.v);
/* 001822 */ 			}
/* 001823 */ 			p.moveToNodeAfterTree ();
/* 001823 */ 		}
/* 001824 */ 		else {
/* 001825 */ 			p.moveToThreadNext ();
/* 001825 */ 		}
/* 001826 */ 		return count;
/* 001826 */ 	});},
/* 001828 */ 	get doFindAll () {return __get__ (this, function (self, after, data, p, undoType) {
/* 001830 */ 		var __left0__ = tuple ([self.c, self.c.undoer, self.s_ctrl]);
/* 001830 */ 		var c = __left0__ [0];
/* 001830 */ 		var u = __left0__ [1];
/* 001830 */ 		var w = __left0__ [2];
/* 001831 */ 		var both = self.search_body && self.search_headline;
/* 001832 */ 		var __left0__ = tuple ([0, null, []]);
/* 001832 */ 		var count = __left0__ [0];
/* 001832 */ 		var found = __left0__ [1];
/* 001832 */ 		var result = __left0__ [2];
/* 001833 */ 		while (1) {
/* 001834 */ 			var __left0__ = self.findNextMatch ();
/* 001834 */ 			var pos = __left0__ [0];
/* 001834 */ 			var newpos = __left0__ [1];
/* 001835 */ 			if (!(self.p)) {
/* 001835 */ 				self.p = c.p;
/* 001835 */ 			}
/* 001836 */ 			if (pos === null) {
/* 001836 */ 				break;
/* 001836 */ 			}
/* 001836 */ 			count++;
/* 001838 */ 			var s = w.getAllText ();
/* 001839 */ 			var __left0__ = g.getLine (s, pos);
/* 001839 */ 			var i = __left0__ [0];
/* 001839 */ 			var j = __left0__ [1];
/* 001840 */ 			var line = s.__getslice__ (i, j, 1);
/* 001841 */ 			if (self.findAllUniqueFlag) {
/* 001842 */ 				var m = self.match_obj;
/* 001843 */ 				if (m) {
/* 001844 */ 					self.unique_matches.add (m.group (0).strip ());
/* 001844 */ 				}
/* 001844 */ 			}
/* 001845 */ 			else if (both) {
/* 001849 */ 				result.append (__mod__ ('%s%s\n%s%s\n', tuple (['-' * 20, self.p.h, (self.in_headline ? 'head: ' : 'body: '), line.rstrip () + '\n'])));
/* 001849 */ 			}
/* 001850 */ 			else if (self.p.isVisited ()) {
/* 001851 */ 				result.append (line.rstrip () + '\n');
/* 001851 */ 			}
/* 001852 */ 			else {
/* 001853 */ 				result.append (__mod__ ('%s%s\n%s', tuple (['-' * 20, self.p.h, line.rstrip () + '\n'])));
/* 001854 */ 				self.p.setVisited ();
/* 001854 */ 			}
/* 001854 */ 		}
/* 001855 */ 		if (result || self.unique_matches) {
/* 001856 */ 			var undoData = u.beforeInsertNode (c.p);
/* 001857 */ 			if (self.findAllUniqueFlag) {
/* 001858 */ 				var found = self.createFindUniqueNode ();
/* 001859 */ 				var count = len (list (self.unique_matches));
/* 001859 */ 			}
/* 001860 */ 			else {
/* 001861 */ 				var found = self.createFindAllNode (result);
/* 001861 */ 			}
/* 001862 */ 			u.afterInsertNode (found, undoType, undoData);
/* 001863 */ 			c.selectPosition (found);
/* 001864 */ 			c.setChanged ();
/* 001864 */ 		}
/* 001865 */ 		else {
/* 001866 */ 			self.restore (data);
/* 001866 */ 		}
/* 001867 */ 		return count;
/* 001867 */ 	});},
/* 001869 */ 	get createFindAllNode () {return __get__ (this, function (self, result) {
/* 001871 */ 		var c = self.c;
/* 001872 */ 		var found = c.lastTopLevel ().insertAfter ();
/* 001874 */ 		found.h = 'Found All:{}'.format (self.find_text);
/* 001875 */ 		var status = self.getFindResultStatus (__kwargtrans__ ({find_all: true}));
/* 001876 */ 		var status = status.strip ().lstrip ('(').rstrip (')').strip ();
/* 001877 */ 		found.b = '# {}\n{}'.format (status, ''.join (result));
/* 001878 */ 		return found;
/* 001878 */ 	});},
/* 001880 */ 	get createFindUniqueNode () {return __get__ (this, function (self) {
/* 001882 */ 		var c = self.c;
/* 001883 */ 		var found = c.lastTopLevel ().insertAfter ();
/* 001885 */ 		found.h = 'Found Unique Regex:{}'.format (self.find_text);
/* 001889 */ 		var result = sorted (self.unique_matches);
/* 001890 */ 		found.b = '\n'.join (result);
/* 001891 */ 		return found;
/* 001891 */ 	});},
/* 001893 */ 	get findNextBatchMatch () {return __get__ (this, function (self, p) {
/* 001895 */ 		var table = [];
/* 001896 */ 		if (self.search_headline) {
/* 001897 */ 			table.append (p.h);
/* 001897 */ 		}
/* 001898 */ 		if (self.search_body) {
/* 001899 */ 			table.append (p.b);
/* 001899 */ 		}
/* 001900 */ 		for (var s of table) {
/* 001901 */ 			self.reverse = false;
/* 001902 */ 			var __left0__ = self.searchHelper (s, 0, len (s), self.find_text);
/* 001902 */ 			var pos = __left0__ [0];
/* 001902 */ 			var newpos = __left0__ [1];
/* 001903 */ 			if (pos != -(1)) {
/* 001903 */ 				return true;
/* 001903 */ 			}
/* 001903 */ 		}
/* 001904 */ 		return false;
/* 001904 */ 	});},
/* 001906 */ 	get findNext () {return __get__ (this, function (self, initFlag) {
/* 001906 */ 		if (typeof initFlag == 'undefined' || (initFlag != null && initFlag.hasOwnProperty ("__kwargtrans__"))) {;
/* 001906 */ 			var initFlag = true;
/* 001906 */ 		};
/* 001908 */ 		if (!(self.checkArgs ())) {
/* 001909 */ 			return false;
/* 001909 */ 		}
/* 001911 */ 		if (initFlag) {
/* 001912 */ 			self.initInHeadline ();
/* 001913 */ 			var data = self.save ();
/* 001914 */ 			self.initInteractiveCommands ();
/* 001914 */ 		}
/* 001915 */ 		else {
/* 001916 */ 			var data = self.save ();
/* 001916 */ 		}
/* 001917 */ 		var __left0__ = self.findNextMatch ();
/* 001917 */ 		var pos = __left0__ [0];
/* 001917 */ 		var newpos = __left0__ [1];
/* 001918 */ 		if (pos === null) {
/* 001919 */ 			self.restore (data);
/* 001920 */ 			self.showStatus (false);
/* 001921 */ 			return false;
/* 001921 */ 		}
/* 001922 */ 		self.showSuccess (pos, newpos);
/* 001923 */ 		self.showStatus (true);
/* 001924 */ 		return true;
/* 001924 */ 	});},
/* 001926 */ 	get getFindResultStatus () {return __get__ (this, function (self, find_all) {
/* 001926 */ 		if (typeof find_all == 'undefined' || (find_all != null && find_all.hasOwnProperty ("__kwargtrans__"))) {;
/* 001926 */ 			var find_all = false;
/* 001926 */ 		};
/* 001928 */ 		var status = [];
/* 001929 */ 		if (self.whole_word) {
/* 001930 */ 			status.append ((find_all ? 'word' : 'word-only'));
/* 001930 */ 		}
/* 001931 */ 		if (self.ignore_case) {
/* 001932 */ 			status.append ('ignore-case');
/* 001932 */ 		}
/* 001933 */ 		if (self.pattern_match) {
/* 001934 */ 			status.append ('regex');
/* 001934 */ 		}
/* 001935 */ 		if (find_all) {
/* 001936 */ 			if (self.search_headline) {
/* 001937 */ 				status.append ('head');
/* 001937 */ 			}
/* 001938 */ 			if (self.search_body) {
/* 001939 */ 				status.append ('body');
/* 001939 */ 			}
/* 001939 */ 		}
/* 001941 */ 		else if (!(self.search_headline)) {
/* 001942 */ 			status.append ('body-only');
/* 001942 */ 		}
/* 001943 */ 		else if (!(self.search_body)) {
/* 001944 */ 			status.append ('headline-only');
/* 001944 */ 		}
/* 001945 */ 		if (!(find_all)) {
/* 001946 */ 			if (self.wrapping) {
/* 001947 */ 				status.append ('wrapping');
/* 001947 */ 			}
/* 001948 */ 			if (self.suboutline_only) {
/* 001949 */ 				status.append ('[outline-only]');
/* 001949 */ 			}
/* 001950 */ 			else if (self.node_only) {
/* 001951 */ 				status.append ('[node-only]');
/* 001951 */ 			}
/* 001951 */ 		}
/* 001952 */ 		return (status ? ' ({})'.format (', '.join (status)) : '');
/* 001952 */ 	});},
/* 001954 */ 	get findNextMatch () {return __get__ (this, function (self) {
/* 001956 */ 		var __left0__ = tuple ([self.c, self.p]);
/* 001956 */ 		var c = __left0__ [0];
/* 001956 */ 		var p = __left0__ [1];
/* 001957 */ 		if (!(self.search_headline) && !(self.search_body)) {
/* 001958 */ 			return tuple ([null, null]);
/* 001958 */ 		}
/* 001959 */ 		if (!(self.find_text)) {
/* 001960 */ 			return tuple ([null, null]);
/* 001960 */ 		}
/* 001961 */ 		self.errors = 0;
/* 001962 */ 		var attempts = 0;
/* 001963 */ 		if (self.pattern_match || self.findAllUniqueFlag) {
/* 001964 */ 			var ok = self.precompilePattern ();
/* 001965 */ 			if (!(ok)) {
/* 001965 */ 				return tuple ([null, null]);
/* 001965 */ 			}
/* 001965 */ 		}
/* 001966 */ 		while (p) {
/* 001967 */ 			var __left0__ = self.search ();
/* 001967 */ 			var pos = __left0__ [0];
/* 001967 */ 			var newpos = __left0__ [1];
/* 001968 */ 			if (self.errors) {
/* 001969 */ 				g.trace ('find errors');
/* 001969 */ 				break;
/* 001969 */ 			}
/* 001971 */ 			if (pos !== null) {
/* 001973 */ 				if (self.mark_finds) {
/* 001974 */ 					p.setMarked ();
/* 001975 */ 					p.setDirty ();
/* 001976 */ 					if (!(self.changeAllFlag)) {
/* 001977 */ 						c.frame.tree.updateIcon (p);
/* 001977 */ 					}
/* 001977 */ 				}
/* 001978 */ 				return tuple ([pos, newpos]);
/* 001978 */ 			}
/* 001980 */ 			if (self.shouldStayInNode (p)) {
/* 001982 */ 				self.in_headline = !(self.in_headline);
/* 001983 */ 				self.initNextText ();
/* 001983 */ 			}
/* 001984 */ 			else {
/* 001984 */ 				attempts++;
/* 001987 */ 				var __left0__ = self.nextNodeAfterFail (p);
/* 001987 */ 				var p = __left0__;
/* 001987 */ 				self.p = __left0__;
/* 001988 */ 				if (p) {
/* 001989 */ 					self.in_headline = self.firstSearchPane ();
/* 001990 */ 					self.initNextText ();
/* 001990 */ 				}
/* 001990 */ 			}
/* 001990 */ 		}
/* 001991 */ 		return tuple ([null, null]);
/* 001991 */ 	});},
/* 001993 */ 	get doWrap () {return __get__ (this, function (self) {
/* 001995 */ 		var c = self.c;
/* 001996 */ 		if (self.reverse) {
/* 001997 */ 			var p = c.rootPosition ();
/* 001998 */ 			while (p && p.hasNext ()) {
/* 001999 */ 				var p = p.py_next ();
/* 001999 */ 			}
/* 002000 */ 			var p = p.lastNode ();
/* 002001 */ 			return p;
/* 002001 */ 		}
/* 002002 */ 		return c.rootPosition ();
/* 002002 */ 	});},
/* 002004 */ 	get firstSearchPane () {return __get__ (this, function (self) {
/* 002009 */ 		if (self.search_headline && self.search_body) {
/* 002011 */ 			if (self.reverse) {
/* 002012 */ 				return false;
/* 002012 */ 			}
/* 002013 */ 			return true;
/* 002013 */ 		}
/* 002014 */ 		if (self.search_headline || self.search_body) {
/* 002016 */ 			return self.search_headline;
/* 002016 */ 		}
/* 002017 */ 		g.trace ('can not happen: no search enabled');
/* 002018 */ 		return false;
/* 002018 */ 	});},
/* 002020 */ 	get initNextText () {return __get__ (this, function (self, ins) {
/* 002020 */ 		if (typeof ins == 'undefined' || (ins != null && ins.hasOwnProperty ("__kwargtrans__"))) {;
/* 002020 */ 			var ins = null;
/* 002020 */ 		};
/* 002026 */ 		var c = self.c;
/* 002027 */ 		var p = self.p || c.p;
/* 002028 */ 		var s = (self.in_headline ? p.h : p.b);
/* 002029 */ 		var w = self.s_ctrl;
/* 002030 */ 		var tree = c.frame && c.frame.tree;
/* 002031 */ 		if (tree && hasattr (tree, 'killEditing')) {
/* 002032 */ 			tree.killEditing ();
/* 002032 */ 		}
/* 002033 */ 		if (self.reverse) {
/* 002034 */ 			var __left0__ = w.sel;
/* 002034 */ 			var i = __left0__ [0];
/* 002034 */ 			var j = __left0__ [1];
/* 002035 */ 			if (ins === null) {
/* 002036 */ 				if (i !== null && j !== null && i != j) {
/* 002037 */ 					var ins = min (i, j);
/* 002037 */ 				}
/* 002037 */ 			}
/* 002037 */ 		}
/* 002038 */ 		else if (ins === null) {
/* 002039 */ 			var ins = 0;
/* 002039 */ 		}
/* 002040 */ 		self.init_s_ctrl (s, ins);
/* 002040 */ 	});},
/* 002042 */ 	get nextNodeAfterFail () {return __get__ (this, function (self, p) {
/* 002044 */ 		var c = self.c;
/* 002046 */ 		var wrap = self.wrapping && !(self.node_only) && !(self.suboutline_only) && !(c.hoistStack);
/* 002048 */ 		if (wrap && !(self.wrapPosition)) {
/* 002049 */ 			self.wrapPosition = p.copy ();
/* 002050 */ 			self.wrapPos = (self.reverse ? 0 : len (p.b));
/* 002050 */ 		}
/* 002052 */ 		var p = (self.reverse ? p.threadBack () : p.threadNext ());
/* 002054 */ 		if (p && self.outsideSearchRange (p)) {
/* 002055 */ 			return null;
/* 002055 */ 		}
/* 002056 */ 		if (!(p) && wrap) {
/* 002057 */ 			var p = self.doWrap ();
/* 002057 */ 		}
/* 002058 */ 		if (!(p)) {
/* 002059 */ 			return null;
/* 002059 */ 		}
/* 002060 */ 		if (wrap && p == self.wrapPosition) {
/* 002061 */ 			return null;
/* 002061 */ 		}
/* 002062 */ 		return p;
/* 002062 */ 	});},
/* 002064 */ 	get outsideSearchRange () {return __get__ (this, function (self, p) {
/* 002069 */ 		var c = self.c;
/* 002070 */ 		if (!(p)) {
/* 002071 */ 			return true;
/* 002071 */ 		}
/* 002072 */ 		if (self.node_only) {
/* 002073 */ 			return true;
/* 002073 */ 		}
/* 002074 */ 		if (self.suboutline_only) {
/* 002075 */ 			if (self.onlyPosition) {
/* 002076 */ 				if (p != self.onlyPosition && !(self.onlyPosition.isAncestorOf (p))) {
/* 002077 */ 					return true;
/* 002077 */ 				}
/* 002077 */ 			}
/* 002078 */ 			else {
/* 002079 */ 				g.trace ('Can not happen: onlyPosition!', p.h);
/* 002080 */ 				return true;
/* 002080 */ 			}
/* 002080 */ 		}
/* 002081 */ 		if (c.hoistStack) {
/* 002082 */ 			var bunch = c.hoistStack [-(1)];
/* 002083 */ 			if (!(bunch.p.isAncestorOf (p))) {
/* 002084 */ 				g.trace ('outside hoist', p.h);
/* 002085 */ 				g.warning ('found match outside of hoisted outline');
/* 002086 */ 				return true;
/* 002086 */ 			}
/* 002086 */ 		}
/* 002087 */ 		return false;
/* 002087 */ 	});},
/* 002089 */ 	get precompilePattern () {return __get__ (this, function (self) {
/* 002091 */ 		try {
/* 002093 */ 			var flags = re.MULTILINE;
/* 002094 */ 			if (self.ignore_case) {
/* 002094 */ 				flags |= re.IGNORECASE;
/* 002094 */ 			}
/* 002097 */ 			var s = self.find_text;
/* 002103 */ 			self.re_obj = re.compile (s, flags);
/* 002104 */ 			return true;
/* 002104 */ 		}
/* 002104 */ 		catch (__except0__) {
/* 002104 */ 			if (isinstance (__except0__, Exception)) {
/* 002106 */ 				g.warning ('invalid regular expression:', self.find_text);
/* 002106 */ 				self.errors++;
/* 002108 */ 				return false;
/* 002108 */ 			}
/* 002108 */ 			else {
/* 002108 */ 				throw __except0__;
/* 002108 */ 			}
/* 002108 */ 		}
/* 002108 */ 	});},
/* 002110 */ 	get shouldStayInNode () {return __get__ (this, function (self, p) {
/* 002118 */ 		return self.search_headline && self.search_body && (self.reverse && !(self.in_headline) || !(self.reverse) && self.in_headline);
/* 002118 */ 	});},
/* 002123 */ 	get resetWrap () {return __get__ (this, function (self, event) {
/* 002123 */ 		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
/* 002123 */ 			var event = null;
/* 002123 */ 		};
/* 002124 */ 		self.wrapPosition = null;
/* 002125 */ 		self.onlyPosition = null;
/* 002125 */ 	});},
/* 002127 */ 	get search () {return __get__ (this, function (self) {
/* 002132 */ 		var c = self.c;
/* 002133 */ 		var p = self.p || c.p;
/* 002134 */ 		if ((self.ignore_dups || self.find_def_data) && __in__ (p.v, self.find_seen)) {
/* 002136 */ 			return tuple ([null, null]);
/* 002136 */ 		}
/* 002137 */ 		var w = self.s_ctrl;
/* 002138 */ 		var index = w.getInsertPoint ();
/* 002139 */ 		var s = w.getAllText ();
/* 002140 */ 		if (sys.platform.lower ().startswith ('win')) {
/* 002141 */ 			var s = s.py_replace ('\r', '');
/* 002141 */ 		}
/* 002145 */ 		if (!(s)) {
/* 002146 */ 			return tuple ([null, null]);
/* 002146 */ 		}
/* 002147 */ 		var stopindex = (self.reverse ? 0 : len (s));
/* 002148 */ 		var __left0__ = self.searchHelper (s, index, stopindex, self.find_text);
/* 002148 */ 		var pos = __left0__ [0];
/* 002148 */ 		var newpos = __left0__ [1];
/* 002149 */ 		if (self.in_headline && !(self.search_headline)) {
/* 002150 */ 			return tuple ([null, null]);
/* 002150 */ 		}
/* 002151 */ 		if (!(self.in_headline) && !(self.search_body)) {
/* 002152 */ 			return tuple ([null, null]);
/* 002152 */ 		}
/* 002153 */ 		if (pos == -(1)) {
/* 002154 */ 			return tuple ([null, null]);
/* 002154 */ 		}
/* 002155 */ 		if (self.passedWrapPoint (p, pos, newpos)) {
/* 002156 */ 			self.wrapPosition = null;
/* 002157 */ 			return tuple ([null, null]);
/* 002157 */ 		}
/* 002158 */ 		if (0) {
/* 002161 */ 			g.trace ('CHECK: index: {} in_head: {} search_head: {}'.format (index, self.in_headline, self.search_headline));
/* 002164 */ 			if (self.in_headline && self.search_headline && index !== null && __in__ (index, tuple ([pos, newpos]))) {
/* 002168 */ 				return tuple ([null, null]);
/* 002168 */ 			}
/* 002168 */ 		}
/* 002169 */ 		var ins = (self.reverse ? min (pos, newpos) : max (pos, newpos));
/* 002170 */ 		w.setSelectionRange (pos, newpos, __kwargtrans__ ({insert: ins}));
/* 002171 */ 		if (self.ignore_dups || self.find_def_data) {
/* 002172 */ 			self.find_seen.add (p.v);
/* 002172 */ 		}
/* 002173 */ 		return tuple ([pos, newpos]);
/* 002173 */ 	});},
/* 002175 */ 	get passedWrapPoint () {return __get__ (this, function (self, p, pos, newpos) {
/* 002177 */ 		return self.wrapping && self.wrapPosition !== null && p == self.wrapPosition && (self.reverse && pos < self.wrapPos || !(self.reverse) && newpos > self.wrapPos);
/* 002177 */ 	});},
/* 002185 */ 	get searchHelper () {return __get__ (this, function (self, s, i, j, pattern) {
/* 002187 */ 		var backwards = self.reverse;
/* 002188 */ 		var nocase = self.ignore_case;
/* 002189 */ 		var regexp = self.pattern_match || self.findAllUniqueFlag;
/* 002190 */ 		var word = self.whole_word;
/* 002191 */ 		if (backwards) {
/* 002191 */ 			var __left0__ = tuple ([j, i]);
/* 002191 */ 			var i = __left0__ [0];
/* 002191 */ 			var j = __left0__ [1];
/* 002191 */ 		}
/* 002192 */ 		if (!(s.__getslice__ (i, j, 1)) || !(pattern)) {
/* 002193 */ 			return tuple ([-(1), -(1)]);
/* 002193 */ 		}
/* 002194 */ 		if (regexp) {
/* 002195 */ 			var __left0__ = self.regexHelper (s, i, j, pattern, backwards, nocase);
/* 002195 */ 			var pos = __left0__ [0];
/* 002195 */ 			var newpos = __left0__ [1];
/* 002195 */ 		}
/* 002196 */ 		else if (backwards) {
/* 002197 */ 			var __left0__ = self.backwardsHelper (s, i, j, pattern, nocase, word);
/* 002197 */ 			var pos = __left0__ [0];
/* 002197 */ 			var newpos = __left0__ [1];
/* 002197 */ 		}
/* 002198 */ 		else {
/* 002199 */ 			var __left0__ = self.plainHelper (s, i, j, pattern, nocase, word);
/* 002199 */ 			var pos = __left0__ [0];
/* 002199 */ 			var newpos = __left0__ [1];
/* 002199 */ 		}
/* 002200 */ 		return tuple ([pos, newpos]);
/* 002200 */ 	});},
/* 002202 */ 	get regexHelper () {return __get__ (this, function (self, s, i, j, pattern, backwards, nocase) {
/* 002204 */ 		var re_obj = self.re_obj;
/* 002205 */ 		if (!(re_obj)) {
/* 002206 */ 			g.trace ('can not happen: no re_obj');
/* 002207 */ 			return tuple ([-(1), -(1)]);
/* 002207 */ 		}
/* 002208 */ 		if (backwards) {
/* 002210 */ 			var last_mo = null;
/* 002210 */ 			var i = 0;
/* 002211 */ 			while (i < len (s)) {
/* 002212 */ 				var mo = re_obj.search (s, i, j);
/* 002213 */ 				if (!(mo)) {
/* 002213 */ 					break;
/* 002213 */ 				}
/* 002213 */ 				i++;
/* 002215 */ 				var last_mo = mo;
/* 002215 */ 			}
/* 002216 */ 			var mo = last_mo;
/* 002216 */ 		}
/* 002217 */ 		else {
/* 002218 */ 			var mo = re_obj.search (s, i, j);
/* 002218 */ 		}
/* 002219 */ 		while (mo && (0 <= i && i <= len (s))) {
/* 002221 */ 			if (mo.start () == mo.end ()) {
/* 002222 */ 				if (backwards) {
/* 002222 */ 					i--;
/* 002225 */ 					while ((0 <= i && i < len (s))) {
/* 002226 */ 						var mo = re_obj.match (s, i, j);
/* 002227 */ 						if (mo) {
/* 002227 */ 							break;
/* 002227 */ 						}
/* 002227 */ 						i--;
/* 002227 */ 					}
/* 002227 */ 				}
/* 002229 */ 				else {
/* 002229 */ 					i++;
/* 002230 */ 					var mo = re_obj.search (s, i, j);
/* 002230 */ 				}
/* 002230 */ 			}
/* 002231 */ 			else {
/* 002232 */ 				self.match_obj = mo;
/* 002233 */ 				return tuple ([mo.start (), mo.end ()]);
/* 002233 */ 			}
/* 002233 */ 		}
/* 002234 */ 		self.match_obj = null;
/* 002235 */ 		return tuple ([-(1), -(1)]);
/* 002235 */ 	});},
/* 002237 */ 	debugIndices: [],
/* 002239 */ 	get backwardsHelper () {return __get__ (this, function (self, s, i, j, pattern, nocase, word) {
/* 002250 */ 		if (nocase) {
/* 002251 */ 			var s = s.lower ();
/* 002252 */ 			var pattern = pattern.lower ();
/* 002252 */ 		}
/* 002253 */ 		var pattern = self.replaceBackSlashes (pattern);
/* 002254 */ 		var n = len (pattern);
/* 002257 */ 		var i = max (0, i);
/* 002258 */ 		var j = min (len (s), j);
/* 002260 */ 		if (s.find (pattern) == -(1)) {
/* 002261 */ 			return tuple ([-(1), -(1)]);
/* 002261 */ 		}
/* 002262 */ 		if (word) {
/* 002263 */ 			while (1) {
/* 002264 */ 				var k = s.rfind (pattern, i, j);
/* 002265 */ 				if (k == -(1)) {
/* 002265 */ 					return tuple ([-(1), -(1)]);
/* 002265 */ 				}
/* 002266 */ 				if (self.matchWord (s, k, pattern)) {
/* 002267 */ 					return tuple ([k, k + n]);
/* 002267 */ 				}
/* 002268 */ 				var j = max (0, k - 1);
/* 002268 */ 			}
/* 002268 */ 		}
/* 002269 */ 		else {
/* 002270 */ 			var k = s.rfind (pattern, i, j);
/* 002271 */ 			if (k == -(1)) {
/* 002272 */ 				return tuple ([-(1), -(1)]);
/* 002272 */ 			}
/* 002273 */ 			return tuple ([k, k + n]);
/* 002273 */ 		}
/* 002275 */ 		return tuple ([-(1), -(1)]);
/* 002275 */ 	});},
/* 002277 */ 	get plainHelper () {return __get__ (this, function (self, s, i, j, pattern, nocase, word) {
/* 002279 */ 		if (nocase) {
/* 002280 */ 			var s = s.lower ();
/* 002280 */ 			var pattern = pattern.lower ();
/* 002280 */ 		}
/* 002281 */ 		var pattern = self.replaceBackSlashes (pattern);
/* 002282 */ 		var n = len (pattern);
/* 002283 */ 		if (word) {
/* 002284 */ 			while (1) {
/* 002285 */ 				var k = s.find (pattern, i, j);
/* 002286 */ 				if (k == -(1)) {
/* 002287 */ 					return tuple ([-(1), -(1)]);
/* 002287 */ 				}
/* 002288 */ 				if (self.matchWord (s, k, pattern)) {
/* 002289 */ 					return tuple ([k, k + n]);
/* 002289 */ 				}
/* 002290 */ 				var i = k + n;
/* 002290 */ 			}
/* 002290 */ 		}
/* 002291 */ 		else {
/* 002292 */ 			var k = s.find (pattern, i, j);
/* 002293 */ 			if (k == -(1)) {
/* 002294 */ 				return tuple ([-(1), -(1)]);
/* 002294 */ 			}
/* 002295 */ 			return tuple ([k, k + n]);
/* 002295 */ 		}
/* 002297 */ 		return tuple ([-(1), -(1)]);
/* 002297 */ 	});},
/* 002299 */ 	get matchWord () {return __get__ (this, function (self, s, i, pattern) {
/* 002301 */ 		var pattern = self.replaceBackSlashes (pattern);
/* 002302 */ 		if (!(s) || !(pattern) || !(g.match (s, i, pattern))) {
/* 002303 */ 			return false;
/* 002303 */ 		}
/* 002304 */ 		var __left0__ = tuple ([pattern [0], pattern [-(1)]]);
/* 002304 */ 		var pat1 = __left0__ [0];
/* 002304 */ 		var pat2 = __left0__ [1];
/* 002305 */ 		var n = len (pattern);
/* 002306 */ 		var ch1 = ((0 <= i - 1 && i - 1 < len (s)) ? s [i - 1] : '.');
/* 002307 */ 		var ch2 = ((0 <= i + n && i + n < len (s)) ? s [i + n] : '.');
/* 002308 */ 		var isWordPat1 = g.isWordChar (pat1);
/* 002309 */ 		var isWordPat2 = g.isWordChar (pat2);
/* 002310 */ 		var isWordCh1 = g.isWordChar (ch1);
/* 002311 */ 		var isWordCh2 = g.isWordChar (ch2);
/* 002312 */ 		var inWord = isWordPat1 && isWordCh1 || isWordPat2 && isWordCh2;
/* 002313 */ 		return !(inWord);
/* 002313 */ 	});},
/* 002315 */ 	get replaceBackSlashes () {return __get__ (this, function (self, s) {
/* 002320 */ 		var i = 0;
/* 002321 */ 		while (i + 1 < len (s)) {
/* 002322 */ 			if (s [i] == '\\') {
/* 002323 */ 				var ch = s [i + 1];
/* 002324 */ 				if (ch == '\\') {
/* 002325 */ 					var s = s.__getslice__ (0, i, 1) + s.__getslice__ (i + 1, null, 1);
/* 002325 */ 				}
/* 002326 */ 				else if (ch == 'n') {
/* 002327 */ 					var s = (s.__getslice__ (0, i, 1) + '\n') + s.__getslice__ (i + 2, null, 1);
/* 002327 */ 				}
/* 002328 */ 				else if (ch == 't') {
/* 002329 */ 					var s = (s.__getslice__ (0, i, 1) + '\t') + s.__getslice__ (i + 2, null, 1);
/* 002329 */ 				}
/* 002330 */ 				else {
/* 002330 */ 					i++;
/* 002330 */ 				}
/* 002330 */ 			}
/* 002330 */ 			i++;
/* 002330 */ 		}
/* 002333 */ 		return s;
/* 002333 */ 	});},
/* 002335 */ 	get setupArgs () {return __get__ (this, function (self, forward, regexp, word) {
/* 002335 */ 		if (typeof forward == 'undefined' || (forward != null && forward.hasOwnProperty ("__kwargtrans__"))) {;
/* 002335 */ 			var forward = false;
/* 002335 */ 		};
/* 002335 */ 		if (typeof regexp == 'undefined' || (regexp != null && regexp.hasOwnProperty ("__kwargtrans__"))) {;
/* 002335 */ 			var regexp = false;
/* 002335 */ 		};
/* 002335 */ 		if (typeof word == 'undefined' || (word != null && word.hasOwnProperty ("__kwargtrans__"))) {;
/* 002335 */ 			var word = false;
/* 002335 */ 		};
/* 002341 */ 		if (__in__ (forward, tuple ([true, false]))) {
/* 002341 */ 			self.reverse = !(forward);
/* 002341 */ 		}
/* 002342 */ 		if (__in__ (regexp, tuple ([true, false]))) {
/* 002342 */ 			self.pattern_match = regexp;
/* 002342 */ 		}
/* 002343 */ 		if (__in__ (word, tuple ([true, false]))) {
/* 002343 */ 			self.whole_word = word;
/* 002343 */ 		}
/* 002344 */ 		self.showFindOptions ();
/* 002344 */ 	});},
/* 002346 */ 	get showFindOptionsInStatusArea () {return __get__ (this, function (self) {
/* 002348 */ 		var c = self.c;
/* 002349 */ 		var s = self.computeFindOptionsInStatusArea ();
/* 002350 */ 		c.frame.putStatusLine (s);
/* 002350 */ 	});},
/* 002352 */ 	get computeFindOptionsInStatusArea () {return __get__ (this, function (self) {
/* 002353 */ 		var c = self.c;
/* 002354 */ 		var ftm = c.findCommands.ftm;
/* 002355 */ 		var table = tuple ([tuple (['Word', ftm.check_box_whole_word]), tuple (['Ig-case', ftm.check_box_ignore_case]), tuple (['regeXp', ftm.check_box_regexp]), tuple (['Body', ftm.check_box_search_body]), tuple (['Head', ftm.check_box_search_headline]), tuple (['wrap-Around', ftm.check_box_wrap_around]), tuple (['mark-Changes', ftm.check_box_mark_changes]), tuple (['mark-Finds', ftm.check_box_mark_finds])]);
/* 002365 */ 		var result = (function () {
/* 002365 */ 			var __accu0__ = [];
/* 002365 */ 			for (var [option, ivar] of table) {
/* 002365 */ 				if (ivar.checkState ()) {
/* 002365 */ 					__accu0__.append (option);
/* 002365 */ 				}
/* 002365 */ 			}
/* 002365 */ 			return __accu0__;
/* 002365 */ 		}) ();
/* 002366 */ 		var table2 = tuple ([tuple (['Suboutline', ftm.radio_button_suboutline_only]), tuple (['Node', ftm.radio_button_node_only])]);
/* 002370 */ 		for (var [option, ivar] of table2) {
/* 002371 */ 			if (ivar.isChecked ()) {
/* 002372 */ 				result.append ('[{}]'.format (option));
/* 002372 */ 				break;
/* 002372 */ 			}
/* 002372 */ 		}
/* 002374 */ 		return 'Find: {}'.format (' '.join (result));
/* 002374 */ 	});},
/* 002376 */ 	get showStatus () {return __get__ (this, function (self, found) {
/* 002378 */ 		var c = self.c;
/* 002379 */ 		var status = (found ? 'found' : 'not found');
/* 002380 */ 		var options = self.getFindResultStatus ();
/* 002381 */ 		var s = '{}:{} {}'.format (status, options, self.find_text);
/* 002383 */ 		var found_bg = c.config.getColor ('find-found-bg') || 'blue';
/* 002384 */ 		var not_found_bg = c.config.getColor ('find-not-found-bg') || 'red';
/* 002385 */ 		var found_fg = c.config.getColor ('find-found-fg') || 'white';
/* 002386 */ 		var not_found_fg = c.config.getColor ('find-not-found-fg') || 'white';
/* 002387 */ 		var bg = (found ? found_bg : not_found_bg);
/* 002388 */ 		var fg = (found ? found_fg : not_found_fg);
/* 002389 */ 		if (c.config.getBool ('show-find-result-in-status') !== false) {
/* 002390 */ 			c.frame.putStatusLine (s, __kwargtrans__ ({bg: bg, fg: fg}));
/* 002390 */ 		}
/* 002391 */ 		if (!(found)) {
/* 002392 */ 			self.radioButtonsChanged = true;
/* 002393 */ 			self.reset_state_ivars ();
/* 002393 */ 		}
/* 002393 */ 	});},
/* 002396 */ 	get checkArgs () {return __get__ (this, function (self) {
/* 002397 */ 		var val = true;
/* 002398 */ 		if (!(self.search_headline) && !(self.search_body)) {
/* 002399 */ 			g.es ('not searching headline or body');
/* 002400 */ 			var val = false;
/* 002400 */ 		}
/* 002401 */ 		var s = self.ftm.getFindText ();
/* 002402 */ 		if (!(s)) {
/* 002403 */ 			g.es ('empty find patttern');
/* 002404 */ 			var val = false;
/* 002404 */ 		}
/* 002405 */ 		return val;
/* 002405 */ 	});},
/* 002407 */ 	get init_s_ctrl () {return __get__ (this, function (self, s, ins) {
/* 002409 */ 		var w = self.s_ctrl;
/* 002410 */ 		w.setAllText (s);
/* 002411 */ 		if (ins === null) {
/* 002412 */ 			var ins = (self.reverse ? len (s) : 0);
/* 002412 */ 		}
/* 002413 */ 		w.setInsertPoint (ins);
/* 002413 */ 	});},
/* 002415 */ 	get initBatchCommands () {return __get__ (this, function (self) {
/* 002417 */ 		var c = self.c;
/* 002418 */ 		self.errors = 0;
/* 002419 */ 		self.in_headline = self.search_headline;
/* 002421 */ 		if (self.suboutline_only || self.node_only) {
/* 002422 */ 			self.p = c.p;
/* 002424 */ 			self.onlyPosition = self.p.copy ();
/* 002424 */ 		}
/* 002425 */ 		else {
/* 002426 */ 			var p = c.rootPosition ();
/* 002427 */ 			if (self.reverse) {
/* 002428 */ 				while (p && p.py_next ()) {
/* 002429 */ 					var p = p.py_next ();
/* 002429 */ 				}
/* 002430 */ 				var p = p.lastNode ();
/* 002430 */ 			}
/* 002431 */ 			self.p = p;
/* 002431 */ 		}
/* 002433 */ 		self.initBatchText ();
/* 002433 */ 	});},
/* 002435 */ 	get initBatchText () {return __get__ (this, function (self, ins) {
/* 002435 */ 		if (typeof ins == 'undefined' || (ins != null && ins.hasOwnProperty ("__kwargtrans__"))) {;
/* 002435 */ 			var ins = null;
/* 002435 */ 		};
/* 002437 */ 		var c = self.c;
/* 002438 */ 		self.wrapping = false;
/* 002440 */ 		var p = self.p || c.p;
/* 002441 */ 		var s = (self.in_headline ? p.h : p.b);
/* 002442 */ 		self.init_s_ctrl (s, ins);
/* 002442 */ 	});},
/* 002444 */ 	get initInHeadline () {return __get__ (this, function (self) {
/* 002452 */ 		if (self.search_headline && self.search_body) {
/* 002454 */ 			self.in_headline = self.focusInTree ();
/* 002454 */ 		}
/* 002455 */ 		else {
/* 002456 */ 			self.in_headline = self.search_headline;
/* 002456 */ 		}
/* 002456 */ 	});},
/* 002458 */ 	get focusInTree () {return __get__ (this, function (self) {
/* 002464 */ 		var c = self.c;
/* 002465 */ 		var ftm = self.ftm;
/* 002466 */ 		var w = ftm.entry_focus || g.app.gui.get_focus (__kwargtrans__ ({raw: true}));
/* 002467 */ 		ftm.entry_focus = null;
/* 002468 */ 		var w_name = c.widget_name (w);
/* 002469 */ 		if (self.buttonFlag && __in__ (self.was_in_headline, tuple ([true, false]))) {
/* 002471 */ 			self.in_headline = self.was_in_headline;
/* 002472 */ 			var val = self.was_in_headline;
/* 002472 */ 		}
/* 002474 */ 		else if (w == c.frame.body.wrapper) {
/* 002475 */ 			var val = false;
/* 002475 */ 		}
/* 002476 */ 		else if (w == c.frame.tree.treeWidget) {
/* 002477 */ 			var val = true;
/* 002477 */ 		}
/* 002478 */ 		else {
/* 002479 */ 			var val = w_name.startswith ('head');
/* 002479 */ 		}
/* 002480 */ 		return val;
/* 002480 */ 	});},
/* 002482 */ 	get initInteractiveCommands () {return __get__ (this, function (self) {
/* 002491 */ 		var c = self.c;
/* 002492 */ 		var __left0__ = c.p;
/* 002492 */ 		var p = __left0__;
/* 002492 */ 		self.p = __left0__;
/* 002493 */ 		var wrapper = c.frame.body && c.frame.body.wrapper;
/* 002494 */ 		var headCtrl = c.edit_widget (p);
/* 002496 */ 		var w = (self.in_headline ? headCtrl : wrapper);
/* 002499 */ 		var ins = (w ? w.getInsertPoint () : null);
/* 002500 */ 		self.errors = 0;
/* 002501 */ 		self.initNextText (__kwargtrans__ ({ins: ins}));
/* 002502 */ 		if (w) {
/* 002502 */ 			c.widgetWantsFocus (w);
/* 002502 */ 		}
/* 002504 */ 		if (self.suboutline_only && !(self.onlyPosition)) {
/* 002505 */ 			self.onlyPosition = p.copy ();
/* 002505 */ 		}
/* 002507 */ 		if (self.wrap && !(self.node_only) && !(self.suboutline_only) && self.wrapPosition === null) {
/* 002512 */ 			self.wrapping = true;
/* 002513 */ 			self.wrapPos = ins;
/* 002513 */ 		}
/* 002513 */ 	});},
/* 002516 */ 	get printLine () {return __get__ (this, function (self, line, allFlag) {
/* 002516 */ 		if (typeof allFlag == 'undefined' || (allFlag != null && allFlag.hasOwnProperty ("__kwargtrans__"))) {;
/* 002516 */ 			var allFlag = false;
/* 002516 */ 		};
/* 002517 */ 		var both = self.search_body && self.search_headline;
/* 002518 */ 		var context = self.batch;
/* 002519 */ 		if (allFlag && both && context) {
/* 002520 */ 			g.es ('', '-' * 20, '', self.p.h);
/* 002521 */ 			var theType = (self.in_headline ? 'head: ' : 'body: ');
/* 002522 */ 			g.es ('', theType + line);
/* 002522 */ 		}
/* 002523 */ 		else if (allFlag && context && !(self.p.isVisited ())) {
/* 002525 */ 			g.es ('', '-' * 20, '', self.p.h);
/* 002526 */ 			g.es ('', line);
/* 002527 */ 			self.p.setVisited ();
/* 002527 */ 		}
/* 002528 */ 		else {
/* 002529 */ 			g.es ('', line);
/* 002529 */ 		}
/* 002529 */ 	});},
/* 002531 */ 	get reset_state_ivars () {return __get__ (this, function (self) {
/* 002533 */ 		self.onlyPosition = null;
/* 002534 */ 		self.wrapping = false;
/* 002535 */ 		self.wrapPosition = null;
/* 002536 */ 		self.wrapPos = null;
/* 002536 */ 	});},
/* 002538 */ 	get restore () {return __get__ (this, function (self, data) {
/* 002540 */ 		var c = self.c;
/* 002541 */ 		var __left0__ = data;
/* 002541 */ 		var in_headline = __left0__ [0];
/* 002541 */ 		var editing = __left0__ [1];
/* 002541 */ 		var p = __left0__ [2];
/* 002541 */ 		var w = __left0__ [3];
/* 002541 */ 		var insert = __left0__ [4];
/* 002541 */ 		var start = __left0__ [5];
/* 002541 */ 		var end = __left0__ [6];
/* 002541 */ 		var junk = __left0__ [7];
/* 002542 */ 		self.was_in_headline = false;
/* 002543 */ 		if (0) {
/* 002545 */ 			self.reset_state_ivars ();
/* 002545 */ 		}
/* 002546 */ 		c.frame.bringToFront ();
/* 002548 */ 		if (p && c.positionExists (p)) {
/* 002549 */ 			c.selectPosition (p);
/* 002549 */ 		}
/* 002550 */ 		else {
/* 002551 */ 			c.selectPosition (c.rootPosition ());
/* 002551 */ 		}
/* 002552 */ 		self.restoreAfterFindDef ();
/* 002554 */ 		if (in_headline) {
/* 002555 */ 			c.selectPosition (p);
/* 002556 */ 			if (false && editing) {
/* 002557 */ 				c.editHeadline ();
/* 002557 */ 			}
/* 002558 */ 			else {
/* 002559 */ 				c.treeWantsFocus ();
/* 002559 */ 			}
/* 002559 */ 		}
/* 002560 */ 		else {
/* 002562 */ 			w.setSelectionRange (start, end, __kwargtrans__ ({insert: insert}));
/* 002563 */ 			w.seeInsertPoint ();
/* 002564 */ 			c.widgetWantsFocus (w);
/* 002564 */ 		}
/* 002564 */ 	});},
/* 002566 */ 	get restoreAllExpansionStates () {return __get__ (this, function (self, expanded, redraw) {
/* 002566 */ 		if (typeof redraw == 'undefined' || (redraw != null && redraw.hasOwnProperty ("__kwargtrans__"))) {;
/* 002566 */ 			var redraw = false;
/* 002566 */ 		};
/* 002569 */ 		var c = self.c;
/* 002569 */ 		var gnxDict = c.fileCommands.gnxDict;
/* 002570 */ 		for (var [gnx, v] of gnxDict.py_items ()) {
/* 002571 */ 			if (__in__ (gnx, expanded)) {
/* 002572 */ 				v.expand ();
/* 002572 */ 			}
/* 002573 */ 			else {
/* 002574 */ 				v.contract ();
/* 002574 */ 			}
/* 002574 */ 		}
/* 002575 */ 		if (redraw) {
/* 002576 */ 			c.redraw ();
/* 002576 */ 		}
/* 002576 */ 	});},
/* 002578 */ 	get save () {return __get__ (this, function (self) {
/* 002580 */ 		var c = self.c;
/* 002581 */ 		var p = self.p || c.p;
/* 002583 */ 		if (self.in_headline) {
/* 002584 */ 			var e = c.edit_widget (p);
/* 002585 */ 			var w = e || c.frame.tree.canvas;
/* 002586 */ 			var __left0__ = tuple ([null, null, null]);
/* 002586 */ 			var insert = __left0__ [0];
/* 002586 */ 			var start = __left0__ [1];
/* 002586 */ 			var end = __left0__ [2];
/* 002586 */ 		}
/* 002587 */ 		else {
/* 002588 */ 			var w = c.frame.body.wrapper;
/* 002589 */ 			var e = null;
/* 002590 */ 			var insert = w.getInsertPoint ();
/* 002591 */ 			var sel = w.getSelectionRange ();
/* 002592 */ 			if (len (sel) == 2) {
/* 002593 */ 				var __left0__ = sel;
/* 002593 */ 				var start = __left0__ [0];
/* 002593 */ 				var end = __left0__ [1];
/* 002593 */ 			}
/* 002594 */ 			else {
/* 002595 */ 				var __left0__ = tuple ([null, null]);
/* 002595 */ 				var start = __left0__ [0];
/* 002595 */ 				var end = __left0__ [1];
/* 002595 */ 			}
/* 002595 */ 		}
/* 002596 */ 		var editing = e !== null;
/* 002597 */ 		var expanded = set ((function () {
/* 002597 */ 			var __accu0__ = [];
/* 002598 */ 			for (var [gnx, v] of c.fileCommands.gnxDict.py_items ()) {
/* 002598 */ 				if (v.isExpanded ()) {
/* 002598 */ 					__accu0__.append (gnx);
/* 002598 */ 				}
/* 002598 */ 			}
/* 002598 */ 			return py_iter (__accu0__);
/* 002598 */ 		}) ());
/* 002602 */ 		return tuple ([self.in_headline, editing, p.copy (), w, insert, start, end, expanded]);
/* 002602 */ 	});},
/* 002604 */ 	get showSuccess () {return __get__ (this, function (self, pos, newpos, showState) {
/* 002604 */ 		if (typeof showState == 'undefined' || (showState != null && showState.hasOwnProperty ("__kwargtrans__"))) {;
/* 002604 */ 			var showState = true;
/* 002604 */ 		};
/* 002606 */ 		var c = self.c;
/* 002607 */ 		var __left0__ = self.p || c.p;
/* 002607 */ 		self.p = __left0__;
/* 002607 */ 		var p = __left0__;
/* 002610 */ 		var insert = (self.reverse ? min (pos, newpos) : max (pos, newpos));
/* 002611 */ 		if (self.wrap && !(self.wrapPosition)) {
/* 002612 */ 			self.wrapPosition = self.p;
/* 002612 */ 		}
/* 002613 */ 		if (c.sparse_find) {
/* 002614 */ 			c.expandOnlyAncestorsOfNode (__kwargtrans__ ({p: p}));
/* 002614 */ 		}
/* 002615 */ 		if (self.in_headline) {
/* 002616 */ 			c.endEditing ();
/* 002617 */ 			var selection = tuple ([pos, newpos, insert]);
/* 002618 */ 			c.redrawAndEdit (p, __kwargtrans__ ({selection: selection, keepMinibuffer: true}));
/* 002621 */ 			var w = c.edit_widget (p);
/* 002622 */ 			self.was_in_headline = true;
/* 002622 */ 		}
/* 002623 */ 		else {
/* 002625 */ 			var w = c.frame.body.wrapper;
/* 002628 */ 			c.selectPosition (p);
/* 002629 */ 			c.bodyWantsFocus ();
/* 002630 */ 			if (showState) {
/* 002631 */ 				c.k.showStateAndMode (w);
/* 002631 */ 			}
/* 002632 */ 			c.bodyWantsFocusNow ();
/* 002633 */ 			w.setSelectionRange (pos, newpos, __kwargtrans__ ({insert: insert}));
/* 002634 */ 			var k = g.see_more_lines (w.getAllText (), insert, 4);
/* 002635 */ 			w.see (k);
/* 002637 */ 			c.outerUpdate ();
/* 002639 */ 			if (c.vim_mode && c.vimCommands) {
/* 002640 */ 				c.vimCommands.update_selection_after_search ();
/* 002640 */ 			}
/* 002640 */ 		}
/* 002642 */ 		if (hasattr (g.app.gui, 'show_find_success')) {
/* 002643 */ 			g.app.gui.show_find_success (c, self.in_headline, insert, p);
/* 002643 */ 		}
/* 002644 */ 		c.frame.bringToFront ();
/* 002645 */ 		return w;
/* 002645 */ 	});},
/* 002647 */ 	get update_ivars () {return __get__ (this, function (self) {
/* 002649 */ 		var c = self.c;
/* 002650 */ 		self.p = c.p;
/* 002651 */ 		var ftm = self.ftm;
/* 002654 */ 		var s = ftm.getFindText ();
/* 002655 */ 		var s = g.checkUnicode (s);
/* 002656 */ 		if (s && __in__ (s [-(1)], tuple (['\r', '\n']))) {
/* 002657 */ 			var s = s.__getslice__ (0, -(1), 1);
/* 002657 */ 		}
/* 002658 */ 		if (self.radioButtonsChanged || s != self.find_text) {
/* 002659 */ 			self.radioButtonsChanged = false;
/* 002660 */ 			self.state_on_start_of_search = self.save ();
/* 002662 */ 			self.reset_state_ivars ();
/* 002662 */ 		}
/* 002663 */ 		self.find_text = s;
/* 002665 */ 		var s = ftm.getReplaceText ();
/* 002666 */ 		var s = g.checkUnicode (s);
/* 002667 */ 		if (s && __in__ (s [-(1)], tuple (['\r', '\n']))) {
/* 002668 */ 			var s = s.__getslice__ (0, -(1), 1);
/* 002668 */ 		}
/* 002669 */ 		self.change_text = s;
/* 002669 */ 	});}
/* 002669 */ });
/* 000004 */ 
//# sourceMappingURL=leoFind.map