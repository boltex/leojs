// Transcrypt'ed from Python, 2020-12-25 05:32:35
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as leoFrame from './leo.core.leoFrame.js';
import * as g from './leo.core.leoGlobals.js';
var __name__ = 'leo.core.leoGui';
export var LeoGui =  __class__ ('LeoGui', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, guiName) {
		self.active = null;
		self.consoleOnly = true;
		self.globalFindTabManager = null;
		self.globalFindTab = null;
		self.idleTimeClass = null;
		self.isNullGui = false;
		self.lastFrame = null;
		self.leoIcon = null;
		self.mGuiName = guiName;
		self.mainLoop = null;
		self.plainTextWidget = null;
		self.root = null;
		self.script = null;
		self.splashScreen = null;
		self.utils = null;
		self.ScriptingControllerClass = NullScriptingControllerClass;
		self.ignoreChars = [];
		self.FKeys = [];
		self.specialChars = [];
	});},
	get create_key_event () {return __get__ (this, function (self, c, binding, char, event, w, x, x_root, y, y_root) {
		if (typeof binding == 'undefined' || (binding != null && binding.hasOwnProperty ("__kwargtrans__"))) {;
			var binding = null;
		};
		if (typeof char == 'undefined' || (char != null && char.hasOwnProperty ("__kwargtrans__"))) {;
			var char = null;
		};
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof w == 'undefined' || (w != null && w.hasOwnProperty ("__kwargtrans__"))) {;
			var w = null;
		};
		if (typeof x == 'undefined' || (x != null && x.hasOwnProperty ("__kwargtrans__"))) {;
			var x = null;
		};
		if (typeof x_root == 'undefined' || (x_root != null && x_root.hasOwnProperty ("__kwargtrans__"))) {;
			var x_root = null;
		};
		if (typeof y == 'undefined' || (y != null && y.hasOwnProperty ("__kwargtrans__"))) {;
			var y = null;
		};
		if (typeof y_root == 'undefined' || (y_root != null && y_root.hasOwnProperty ("__kwargtrans__"))) {;
			var y_root = null;
		};
		return LeoKeyEvent (c, char, event, binding, w, x, y, x_root, y_root);
	});},
	get guiName () {return __get__ (this, function (self) {
		try {
			return self.mGuiName;
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				return 'invalid gui name';
			}
			else {
				throw __except0__;
			}
		}
	});},
	get setScript () {return __get__ (this, function (self, script, scriptFileName) {
		if (typeof script == 'undefined' || (script != null && script.hasOwnProperty ("__kwargtrans__"))) {;
			var script = null;
		};
		if (typeof scriptFileName == 'undefined' || (scriptFileName != null && scriptFileName.hasOwnProperty ("__kwargtrans__"))) {;
			var scriptFileName = null;
		};
		self.script = script;
		self.scriptFileName = scriptFileName;
	});},
	get event_generate () {return __get__ (this, function (self, c, char, shortcut, w) {
		var event = self.create_key_event (c, __kwargtrans__ ({binding: shortcut, char: char, w: w}));
		c.k.masterKeyHandler (event);
		c.outerUpdate ();
	});},
	get destroySelf () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get runAboutLeoDialog () {return __get__ (this, function (self, c, version, theCopyright, url, email) {
		self.oops ();
	});},
	get runAskLeoIDDialog () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get runAskOkDialog () {return __get__ (this, function (self, c, title, message, text) {
		if (typeof message == 'undefined' || (message != null && message.hasOwnProperty ("__kwargtrans__"))) {;
			var message = null;
		};
		if (typeof text == 'undefined' || (text != null && text.hasOwnProperty ("__kwargtrans__"))) {;
			var text = 'Ok';
		};
		self.oops ();
	});},
	get runAskOkCancelNumberDialog () {return __get__ (this, function (self, c, title, message, cancelButtonText, okButtonText) {
		if (typeof cancelButtonText == 'undefined' || (cancelButtonText != null && cancelButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var cancelButtonText = null;
		};
		if (typeof okButtonText == 'undefined' || (okButtonText != null && okButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var okButtonText = null;
		};
		self.oops ();
	});},
	get runAskOkCancelStringDialog () {return __get__ (this, function (self, c, title, message, cancelButtonText, okButtonText, py_default, wide) {
		if (typeof cancelButtonText == 'undefined' || (cancelButtonText != null && cancelButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var cancelButtonText = null;
		};
		if (typeof okButtonText == 'undefined' || (okButtonText != null && okButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var okButtonText = null;
		};
		if (typeof py_default == 'undefined' || (py_default != null && py_default.hasOwnProperty ("__kwargtrans__"))) {;
			var py_default = '';
		};
		if (typeof wide == 'undefined' || (wide != null && wide.hasOwnProperty ("__kwargtrans__"))) {;
			var wide = false;
		};
		self.oops ();
	});},
	get runAskYesNoDialog () {return __get__ (this, function (self, c, title, message, yes_all, no_all) {
		if (typeof message == 'undefined' || (message != null && message.hasOwnProperty ("__kwargtrans__"))) {;
			var message = null;
		};
		if (typeof yes_all == 'undefined' || (yes_all != null && yes_all.hasOwnProperty ("__kwargtrans__"))) {;
			var yes_all = false;
		};
		if (typeof no_all == 'undefined' || (no_all != null && no_all.hasOwnProperty ("__kwargtrans__"))) {;
			var no_all = false;
		};
		self.oops ();
	});},
	get runAskYesNoCancelDialog () {return __get__ (this, function (self, c, title, message, yesMessage, noMessage, yesToAllMessage, defaultButton, cancelMessage) {
		if (typeof message == 'undefined' || (message != null && message.hasOwnProperty ("__kwargtrans__"))) {;
			var message = null;
		};
		if (typeof yesMessage == 'undefined' || (yesMessage != null && yesMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var yesMessage = 'Yes';
		};
		if (typeof noMessage == 'undefined' || (noMessage != null && noMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var noMessage = 'No';
		};
		if (typeof yesToAllMessage == 'undefined' || (yesToAllMessage != null && yesToAllMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var yesToAllMessage = null;
		};
		if (typeof defaultButton == 'undefined' || (defaultButton != null && defaultButton.hasOwnProperty ("__kwargtrans__"))) {;
			var defaultButton = 'Yes';
		};
		if (typeof cancelMessage == 'undefined' || (cancelMessage != null && cancelMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var cancelMessage = null;
		};
		self.oops ();
	});},
	get runPropertiesDialog () {return __get__ (this, function (self, title, data, callback, buttons) {
		if (typeof title == 'undefined' || (title != null && title.hasOwnProperty ("__kwargtrans__"))) {;
			var title = 'Properties';
		};
		if (typeof data == 'undefined' || (data != null && data.hasOwnProperty ("__kwargtrans__"))) {;
			var data = null;
		};
		if (typeof callback == 'undefined' || (callback != null && callback.hasOwnProperty ("__kwargtrans__"))) {;
			var callback = null;
		};
		if (typeof buttons == 'undefined' || (buttons != null && buttons.hasOwnProperty ("__kwargtrans__"))) {;
			var buttons = null;
		};
		self.oops ();
	});},
	get runOpenFileDialog () {return __get__ (this, function (self, c, title, filetypes, defaultextension, multiple, startpath) {
		if (typeof multiple == 'undefined' || (multiple != null && multiple.hasOwnProperty ("__kwargtrans__"))) {;
			var multiple = false;
		};
		if (typeof startpath == 'undefined' || (startpath != null && startpath.hasOwnProperty ("__kwargtrans__"))) {;
			var startpath = null;
		};
		self.oops ();
	});},
	get runSaveFileDialog () {return __get__ (this, function (self, c, initialfile, title, filetypes, defaultextension) {
		self.oops ();
	});},
	get createColorPanel () {return __get__ (this, function (self, c) {
		self.oops ();
	});},
	get createComparePanel () {return __get__ (this, function (self, c) {
		self.oops ();
	});},
	get createFindTab () {return __get__ (this, function (self, c, parentFrame) {
		self.oops ();
	});},
	get createFontPanel () {return __get__ (this, function (self, c) {
		self.oops ();
	});},
	get createLeoFrame () {return __get__ (this, function (self, c, title) {
		self.oops ();
	});},
	get runMainLoop () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get replaceClipboardWith () {return __get__ (this, function (self, s) {
		self.oops ();
	});},
	get getTextFromClipboard () {return __get__ (this, function (self) {
		self.oops ();
	});},
	get attachLeoIcon () {return __get__ (this, function (self, window) {
		self.oops ();
	});},
	get center_dialog () {return __get__ (this, function (self, dialog) {
		self.oops ();
	});},
	get create_labeled_frame () {return __get__ (this, function (self, parent, caption, relief, bd, padx, pady) {
		if (typeof caption == 'undefined' || (caption != null && caption.hasOwnProperty ("__kwargtrans__"))) {;
			var caption = null;
		};
		if (typeof relief == 'undefined' || (relief != null && relief.hasOwnProperty ("__kwargtrans__"))) {;
			var relief = 'groove';
		};
		if (typeof bd == 'undefined' || (bd != null && bd.hasOwnProperty ("__kwargtrans__"))) {;
			var bd = 2;
		};
		if (typeof padx == 'undefined' || (padx != null && padx.hasOwnProperty ("__kwargtrans__"))) {;
			var padx = 0;
		};
		if (typeof pady == 'undefined' || (pady != null && pady.hasOwnProperty ("__kwargtrans__"))) {;
			var pady = 0;
		};
		self.oops ();
	});},
	get get_window_info () {return __get__ (this, function (self, window) {
		self.oops ();
	});},
	get get_focus () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		self.oops ();
	});},
	get set_focus () {return __get__ (this, function (self, commander, widget) {
		self.oops ();
	});},
	get getFontFromParams () {return __get__ (this, function (self, family, size, slant, weight, defaultSize) {
		if (typeof defaultSize == 'undefined' || (defaultSize != null && defaultSize.hasOwnProperty ("__kwargtrans__"))) {;
			var defaultSize = 12;
		};
		self.oops ();
	});},
	get getFullVersion () {return __get__ (this, function (self, c) {
		if (typeof c == 'undefined' || (c != null && c.hasOwnProperty ("__kwargtrans__"))) {;
			var c = null;
		};
		return 'LeoGui: dummy version';
	});},
	get makeScriptButton () {return __get__ (this, function (self, c, args, p, script, buttonText, balloonText, shortcut, bg, define_g, define_name, silent) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = null;
		};
		if (typeof p == 'undefined' || (p != null && p.hasOwnProperty ("__kwargtrans__"))) {;
			var p = null;
		};
		if (typeof script == 'undefined' || (script != null && script.hasOwnProperty ("__kwargtrans__"))) {;
			var script = null;
		};
		if (typeof buttonText == 'undefined' || (buttonText != null && buttonText.hasOwnProperty ("__kwargtrans__"))) {;
			var buttonText = null;
		};
		if (typeof balloonText == 'undefined' || (balloonText != null && balloonText.hasOwnProperty ("__kwargtrans__"))) {;
			var balloonText = 'Script Button';
		};
		if (typeof shortcut == 'undefined' || (shortcut != null && shortcut.hasOwnProperty ("__kwargtrans__"))) {;
			var shortcut = null;
		};
		if (typeof bg == 'undefined' || (bg != null && bg.hasOwnProperty ("__kwargtrans__"))) {;
			var bg = 'LightSteelBlue1';
		};
		if (typeof define_g == 'undefined' || (define_g != null && define_g.hasOwnProperty ("__kwargtrans__"))) {;
			var define_g = true;
		};
		if (typeof define_name == 'undefined' || (define_name != null && define_name.hasOwnProperty ("__kwargtrans__"))) {;
			var define_name = '__main__';
		};
		if (typeof silent == 'undefined' || (silent != null && silent.hasOwnProperty ("__kwargtrans__"))) {;
			var silent = false;
		};
		self.oops ();
	});},
	get dismiss_splash_screen () {return __get__ (this, function (self) {
		// pass;
	});},
	get ensure_commander_visible () {return __get__ (this, function (self, c) {
		// pass;
	});},
	get finishCreate () {return __get__ (this, function (self) {
		// pass;
	});},
	get postPopupMenu () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		// pass;
	});},
	get oops () {return __get__ (this, function (self) {
		if (1) {
			g.pr ('LeoGui oops', g.callers (4), 'should be overridden in subclass');
		}
	});},
	get put_help () {return __get__ (this, function (self, c, s, short_title) {
		// pass;
	});},
	get widget_name () {return __get__ (this, function (self, w) {
		if (!('w')) {
			return '<no widget>';
		}
		if (hasattr (w, 'getName')) {
			return w.getName ();
		}
		if (hasattr (w, '_name')) {
			return w._name;
		}
		return repr (w);
	});}
});
export var LeoKeyEvent =  __class__ ('LeoKeyEvent', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, char, event, binding, w, x, y, x_root, y_root) {
		if (typeof x == 'undefined' || (x != null && x.hasOwnProperty ("__kwargtrans__"))) {;
			var x = null;
		};
		if (typeof y == 'undefined' || (y != null && y.hasOwnProperty ("__kwargtrans__"))) {;
			var y = null;
		};
		if (typeof x_root == 'undefined' || (x_root != null && x_root.hasOwnProperty ("__kwargtrans__"))) {;
			var x_root = null;
		};
		if (typeof y_root == 'undefined' || (y_root != null && y_root.hasOwnProperty ("__kwargtrans__"))) {;
			var y_root = null;
		};
		if (g.isStroke (binding)) {
			g.trace ('***** (LeoKeyEvent) oops: already a stroke', binding, g.callers ());
			var stroke = binding;
		}
		else {
			var stroke = (binding ? g.KeyStroke (binding) : null);
		}
		if (0) {
			if (__in__ ('keys', g.app.debug)) {
				print ('LeoKeyEvent: binding: {}, stroke: {}, char: {}'.format (binding, stroke, char));
			}
		}
		self.c = c;
		self.char = char || '';
		self.event = event;
		self.stroke = stroke;
		var __left0__ = w;
		self.w = __left0__;
		self.widget = __left0__;
		self.x = x;
		self.y = y;
		self.x_root = x_root;
		self.y_root = y_root;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		var d = dict ({'c': self.c.shortFileName ()});
		for (var ivar of tuple (['char', 'event', 'stroke', 'w'])) {
			d [ivar] = getattr (self, ivar);
		}
		return 'LeoKeyEvent:\n{}'.format (g.objToString (d));
	});},
	get py_get () {return __get__ (this, function (self, attr) {
		return getattr (self, attr, null);
	});},
	get __getitem__ () {return __get__ (this, function (self, attr) {
		return getattr (self, attr, null);
	});},
	get py_metatype () {return __get__ (this, function (self) {
		return 'LeoKeyEvent';
	});}
});
export var NullGui =  __class__ ('NullGui', [LeoGui], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, guiName) {
		if (typeof guiName == 'undefined' || (guiName != null && guiName.hasOwnProperty ("__kwargtrans__"))) {;
			var guiName = 'nullGui';
		};
		__super__ (NullGui, '__init__') (self, guiName);
		self.clipboardContents = '';
		self.focusWidget = null;
		self.script = null;
		self.lastFrame = null;
		self.isNullGui = true;
		self.idleTimeClass = g.NullObject;
	});},
	get runAboutLeoDialog () {return __get__ (this, function (self, c, version, theCopyright, url, email) {
		return self.simulateDialog ('aboutLeoDialog', null);
	});},
	get runAskLeoIDDialog () {return __get__ (this, function (self) {
		return self.simulateDialog ('leoIDDialog', null);
	});},
	get runAskOkDialog () {return __get__ (this, function (self, c, title, message, text) {
		if (typeof message == 'undefined' || (message != null && message.hasOwnProperty ("__kwargtrans__"))) {;
			var message = null;
		};
		if (typeof text == 'undefined' || (text != null && text.hasOwnProperty ("__kwargtrans__"))) {;
			var text = 'Ok';
		};
		return self.simulateDialog ('okDialog', 'Ok');
	});},
	get runAskOkCancelNumberDialog () {return __get__ (this, function (self, c, title, message, cancelButtonText, okButtonText) {
		if (typeof cancelButtonText == 'undefined' || (cancelButtonText != null && cancelButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var cancelButtonText = null;
		};
		if (typeof okButtonText == 'undefined' || (okButtonText != null && okButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var okButtonText = null;
		};
		return self.simulateDialog ('numberDialog', -(1));
	});},
	get runAskOkCancelStringDialog () {return __get__ (this, function (self, c, title, message, cancelButtonText, okButtonText, py_default, wide) {
		if (typeof cancelButtonText == 'undefined' || (cancelButtonText != null && cancelButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var cancelButtonText = null;
		};
		if (typeof okButtonText == 'undefined' || (okButtonText != null && okButtonText.hasOwnProperty ("__kwargtrans__"))) {;
			var okButtonText = null;
		};
		if (typeof py_default == 'undefined' || (py_default != null && py_default.hasOwnProperty ("__kwargtrans__"))) {;
			var py_default = '';
		};
		if (typeof wide == 'undefined' || (wide != null && wide.hasOwnProperty ("__kwargtrans__"))) {;
			var wide = false;
		};
		return self.simulateDialog ('stringDialog', '');
	});},
	get runCompareDialog () {return __get__ (this, function (self, c) {
		return self.simulateDialog ('compareDialog', '');
	});},
	get runOpenFileDialog () {return __get__ (this, function (self, c, title, filetypes, defaultextension, multiple, startpath) {
		if (typeof multiple == 'undefined' || (multiple != null && multiple.hasOwnProperty ("__kwargtrans__"))) {;
			var multiple = false;
		};
		if (typeof startpath == 'undefined' || (startpath != null && startpath.hasOwnProperty ("__kwargtrans__"))) {;
			var startpath = null;
		};
		return self.simulateDialog ('openFileDialog', null);
	});},
	get runSaveFileDialog () {return __get__ (this, function (self, c, initialfile, title, filetypes, defaultextension) {
		return self.simulateDialog ('saveFileDialog', null);
	});},
	get runAskYesNoDialog () {return __get__ (this, function (self, c, title, message, yes_all, no_all) {
		if (typeof message == 'undefined' || (message != null && message.hasOwnProperty ("__kwargtrans__"))) {;
			var message = null;
		};
		if (typeof yes_all == 'undefined' || (yes_all != null && yes_all.hasOwnProperty ("__kwargtrans__"))) {;
			var yes_all = false;
		};
		if (typeof no_all == 'undefined' || (no_all != null && no_all.hasOwnProperty ("__kwargtrans__"))) {;
			var no_all = false;
		};
		return self.simulateDialog ('yesNoDialog', 'no');
	});},
	get runAskYesNoCancelDialog () {return __get__ (this, function (self, c, title, message, yesMessage, noMessage, yesToAllMessage, defaultButton, cancelMessage) {
		if (typeof message == 'undefined' || (message != null && message.hasOwnProperty ("__kwargtrans__"))) {;
			var message = null;
		};
		if (typeof yesMessage == 'undefined' || (yesMessage != null && yesMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var yesMessage = 'Yes';
		};
		if (typeof noMessage == 'undefined' || (noMessage != null && noMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var noMessage = 'No';
		};
		if (typeof yesToAllMessage == 'undefined' || (yesToAllMessage != null && yesToAllMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var yesToAllMessage = null;
		};
		if (typeof defaultButton == 'undefined' || (defaultButton != null && defaultButton.hasOwnProperty ("__kwargtrans__"))) {;
			var defaultButton = 'Yes';
		};
		if (typeof cancelMessage == 'undefined' || (cancelMessage != null && cancelMessage.hasOwnProperty ("__kwargtrans__"))) {;
			var cancelMessage = null;
		};
		return self.simulateDialog ('yesNoCancelDialog', 'cancel');
	});},
	get simulateDialog () {return __get__ (this, function (self, key, defaultVal) {
		return defaultVal;
	});},
	get get_focus () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		return self.focusWidget;
	});},
	get getTextFromClipboard () {return __get__ (this, function (self) {
		return self.clipboardContents;
	});},
	get replaceClipboardWith () {return __get__ (this, function (self, s) {
		self.clipboardContents = s;
	});},
	get set_focus () {return __get__ (this, function (self, commander, widget) {
		self.focusWidget = widget;
	});},
	get alert () {return __get__ (this, function (self, c, message) {
		// pass;
	});},
	get attachLeoIcon () {return __get__ (this, function (self, window) {
		// pass;
	});},
	get destroySelf () {return __get__ (this, function (self) {
		// pass;
	});},
	get finishCreate () {return __get__ (this, function (self) {
		// pass;
	});},
	get getFontFromParams () {return __get__ (this, function (self, family, size, slant, weight, defaultSize) {
		if (typeof defaultSize == 'undefined' || (defaultSize != null && defaultSize.hasOwnProperty ("__kwargtrans__"))) {;
			var defaultSize = 12;
		};
		return g.app.config.defaultFont;
	});},
	get getIconImage () {return __get__ (this, function (self, py_name) {
		return null;
	});},
	get getImageImage () {return __get__ (this, function (self, py_name) {
		return null;
	});},
	get getTreeImage () {return __get__ (this, function (self, c, path) {
		return null;
	});},
	get get_window_info () {return __get__ (this, function (self, window) {
		return tuple ([600, 500, 20, 20]);
	});},
	get onActivateEvent () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		// pass;
	});},
	get onDeactivateEvent () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		// pass;
	});},
	get set_top_geometry () {return __get__ (this, function (self, w, h, x, y) {
		// pass;
	});},
	get isTextWidget () {return __get__ (this, function (self, w) {
		return true;
	});},
	get isTextWrapper () {return __get__ (this, function (self, w) {
		return w && getattr (w, 'supportsHighLevelInterface', null);
	});},
	get oops () {return __get__ (this, function (self) {
		g.trace ('NullGui', g.callers (4));
	});},
	get createComparePanel () {return __get__ (this, function (self, c) {
		self.oops ();
	});},
	get createFindTab () {return __get__ (this, function (self, c, parentFrame) {
		// pass;
	});},
	get createLeoFrame () {return __get__ (this, function (self, c, title) {
		var gui = self;
		self.lastFrame = leoFrame.NullFrame (c, title, gui);
		return self.lastFrame;
	});},
	get runMainLoop () {return __get__ (this, function (self) {
		if (self.script) {
			var frame = self.lastFrame;
			g.app.log = frame.log;
			self.lastFrame.c.executeScript (__kwargtrans__ ({script: self.script}));
		}
		else {
			print ('**** NullGui.runMainLoop: terminating Leo.');
		}
	});}
});
export var NullScriptingControllerClass =  __class__ ('NullScriptingControllerClass', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, c, iconBar) {
		if (typeof iconBar == 'undefined' || (iconBar != null && iconBar.hasOwnProperty ("__kwargtrans__"))) {;
			var iconBar = null;
		};
		self.c = c;
		self.iconBar = iconBar;
	});},
	get createAllButtons () {return __get__ (this, function (self) {
		// pass;
	});}
});
export var StringCheckBox =  __class__ ('StringCheckBox', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, py_name, label) {
		self.label = label;
		self.py_name = py_name;
		self.value = true;
	});},
	get checkState () {return __get__ (this, function (self) {
		return self.value;
	});},
	get objectName () {return __get__ (this, function (self) {
		return self.py_name;
	});},
	get setCheckState () {return __get__ (this, function (self, value) {
		self.value = value;
	});},
	get toggle () {return __get__ (this, function (self) {
		self.value = !(self.value);
	});}
});
export var StringGui =  __class__ ('StringGui', [LeoGui], {
	__module__: __name__,
	get oops () {return __get__ (this, function (self) {
		g.trace ('StringGui', g.callers (4));
	});},
	get runMainLoop () {return __get__ (this, function (self) {
		self.oops ();
	});}
});
export var StringLineEdit =  __class__ ('StringLineEdit', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, py_name, disabled) {
		self.disabled = disabled;
		self.py_name = py_name;
		self.pos = 0;
		self.s = '';
	});},
	get py_clear () {return __get__ (this, function (self) {
		self.pos = 0;
		self.s = '';
	});},
	get insert () {return __get__ (this, function (self, s) {
		if (s) {
			var i = self.pos;
			self.s = (self.s.__getslice__ (0, i, 1) + s) + self.s.__getslice__ (i, null, 1);
			self.pos += len (s);
		}
	});},
	get objectName () {return __get__ (this, function (self) {
		return self.py_name;
	});},
	get text () {return __get__ (this, function (self) {
		return self.s;
	});}
});
export var StringRadioButton =  __class__ ('StringRadioButton', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, py_name, label) {
		self.label = label;
		self.py_name = py_name;
		self.value = true;
	});},
	get isChecked () {return __get__ (this, function (self) {
		return self.value;
	});},
	get objectName () {return __get__ (this, function (self) {
		return self.py_name;
	});},
	get toggle () {return __get__ (this, function (self) {
		self.value = !(self.value);
	});}
});
export var UnitTestGui =  __class__ ('UnitTestGui', [NullGui], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, theDict) {
		if (typeof theDict == 'undefined' || (theDict != null && theDict.hasOwnProperty ("__kwargtrans__"))) {;
			var theDict = null;
		};
		self.oldGui = g.app.gui;
		__super__ (UnitTestGui, '__init__') (self, 'UnitTestGui');
		self.theDict = (theDict === null ? dict ({}) : theDict);
		g.app.gui = self;
	});},
	get destroySelf () {return __get__ (this, function (self) {
		g.app.gui = self.oldGui;
	});},
	get createSpellTab () {return __get__ (this, function (self, c, spellHandler, tabName) {
		// pass;
	});}
});

//# sourceMappingURL=leo.core.leoGui.map