/* 000001 */ // Transcrypt'ed from Python, 2020-12-17 08:42:32
/* 000036 */ import {} from './org.transcrypt.__runtime__.js';
/* 000001 */ var __name__ = 'time';
/* 000023 */ try {
/* 000024 */ 	var __language = window.navigator.language;
/* 000024 */ }
/* 000024 */ catch (__except0__) {
/* 000026 */ 	var __language = 'en-US';
/* 000026 */ }
/* 000028 */ export var __debugGetLanguage = function () {
/* 000029 */ 	return __language;
/* 000029 */ };
/* 000031 */ export var __adapt__ = function (request) {
/* 000033 */ 	__language = request.headers ['accept-language'].py_split (',') [0];
/* 000033 */ };
/* 000039 */ export var __date = new Date (0);
/* 000040 */ export var __now = new Date ();
/* 000044 */ export var __weekdays = [];
/* 000045 */ export var __weekdays_long = [];
/* 000046 */ export var __d = new Date (1467662339080);
/* 000047 */ for (var i = 0; i < 7; i++) {
/* 000048 */ 	for (var [l, s] of tuple ([tuple ([__weekdays, 'short']), tuple ([__weekdays_long, 'long'])])) {
/* 000049 */ 		l.append (__d.toLocaleString (__language, dict ({'weekday': s})).lower ());
/* 000049 */ 	}
/* 000051 */ 	__d.setDate (__d.getDate () + 1);
/* 000051 */ }
/* 000055 */ export var __months = [];
/* 000056 */ export var __months_long = [];
/* 000057 */ var __d = new Date (946681200000.0);
/* 000058 */ for (var i = 0; i < 12; i++) {
/* 000059 */ 	for (var [l, s] of tuple ([tuple ([__months, 'short']), tuple ([__months_long, 'long'])])) {
/* 000060 */ 		l.append (__d.toLocaleString (__language, dict ({'month': s})).lower ());
/* 000060 */ 	}
/* 000062 */ 	__d.setMonth (__d.getMonth () + 1);
/* 000062 */ }
/* 000071 */ export var __lu = dict ({'Y': 0, 'm': 1, 'd': 2, 'H': 3, 'M': 4, 'S': 5});
/* 000073 */ export var _lsplit = function (s, sep, maxsplit) {
/* 000075 */ 	if (maxsplit == 0) {
/* 000076 */ 		return [s];
/* 000076 */ 	}
/* 000077 */ 	var py_split = s.py_split (sep);
/* 000078 */ 	if (!(maxsplit)) {
/* 000079 */ 		return py_split;
/* 000079 */ 	}
/* 000080 */ 	var ret = py_split.slice (0, maxsplit, 1);
/* 000081 */ 	if (len (ret) == len (py_split)) {
/* 000082 */ 		return ret;
/* 000082 */ 	}
/* 000083 */ 	ret.append (sep.join (py_split.__getslice__ (maxsplit, null, 1)));
/* 000084 */ 	return ret;
/* 000084 */ };
/* 000087 */ export var _local_time_tuple = function (jd) {
/* 000098 */ 	var res = tuple ([jd.getFullYear (), jd.getMonth () + 1, jd.getDate (), jd.getHours (), jd.getMinutes (), jd.getSeconds (), (jd.getDay () > 0 ? jd.getDay () - 1 : 6), _day_of_year (jd, true), _daylight_in_effect (jd), jd.getMilliseconds ()]);
/* 000100 */ 	return res;
/* 000100 */ };
/* 000102 */ export var _utc_time_tuple = function (jd) {
/* 000113 */ 	var res = tuple ([jd.getUTCFullYear (), jd.getUTCMonth () + 1, jd.getUTCDate (), jd.getUTCHours (), jd.getUTCMinutes (), jd.getUTCSeconds (), jd.getUTCDay () - 1, _day_of_year (jd, false), 0, jd.getUTCMilliseconds ()]);
/* 000115 */ 	return res;
/* 000115 */ };
/* 000117 */ export var _day_of_year = function (jd, local) {
/* 000119 */ 	var day_offs = 0;
/* 000120 */ 	if (jd.getHours () + (jd.getTimezoneOffset () * 60) / 3600 < 0) {
/* 000121 */ 		var day_offs = -(1);
/* 000121 */ 	}
/* 000122 */ 	var was = jd.getTime ();
/* 000123 */ 	var cur = jd.setHours (23);
/* 000124 */ 	jd.setUTCDate (1);
/* 000125 */ 	jd.setUTCMonth (0);
/* 000126 */ 	jd.setUTCHours (0);
/* 000127 */ 	jd.setUTCMinutes (0);
/* 000128 */ 	jd.setUTCSeconds (0);
/* 000129 */ 	var res = round ((cur - jd) / 86400000);
/* 000132 */ 	if (!(local)) {
/* 000132 */ 		res += day_offs;
/* 000132 */ 	}
/* 000135 */ 	if (res == 0) {
/* 000136 */ 		var res = 365;
/* 000137 */ 		jd.setTime (jd.getTime () - 86400);
/* 000138 */ 		var last_year = jd.getUTCFullYear ();
/* 000139 */ 		if (_is_leap (last_year)) {
/* 000140 */ 			var res = 366;
/* 000140 */ 		}
/* 000140 */ 	}
/* 000141 */ 	jd.setTime (was);
/* 000142 */ 	return res;
/* 000142 */ };
/* 000144 */ export var _is_leap = function (year) {
/* 000145 */ 	return __mod__ (year, 4) == 0 && (__mod__ (year, 100) != 0 || __mod__ (year, 400) == 0);
/* 000145 */ };
/* 000147 */ export var __jan_jun_tz = function (t, func) {
/* 000153 */ 	var was = t.getTime ();
/* 000154 */ 	t.setDate (1);
/* 000155 */ 	var res = [];
/* 000156 */ 	for (var m of tuple ([0, 6])) {
/* 000157 */ 		t.setMonth (m);
/* 000158 */ 		if (!(func)) {
/* 000159 */ 			res.append (t.getTimezoneOffset ());
/* 000159 */ 		}
/* 000160 */ 		else {
/* 000161 */ 			res.append (func (t));
/* 000161 */ 		}
/* 000161 */ 	}
/* 000162 */ 	t.setTime (was);
/* 000163 */ 	return res;
/* 000163 */ };
/* 000165 */ export var _daylight = function (t) {
/* 000176 */ 	var jj = __jan_jun_tz (t);
/* 000177 */ 	if (jj [0] != jj [1]) {
/* 000180 */ 		return 1;
/* 000180 */ 	}
/* 000181 */ 	return 0;
/* 000181 */ };
/* 000183 */ export var _daylight_in_effect = function (t) {
/* 000184 */ 	var jj = __jan_jun_tz (t);
/* 000185 */ 	if (min (jj [0], jj [1]) == t.getTimezoneOffset ()) {
/* 000186 */ 		return 1;
/* 000186 */ 	}
/* 000187 */ 	return 0;
/* 000187 */ };
/* 000189 */ export var _timezone = function (t) {
/* 000190 */ 	var jj = __jan_jun_tz (t);
/* 000192 */ 	return max (jj [0], jj [1]);
/* 000192 */ };
/* 000195 */ export var __tzn = function (t) {
/* 000197 */ 	try {
/* 000198 */ 		return str (t).py_split ('(') [1].py_split (')') [0];
/* 000198 */ 	}
/* 000198 */ 	catch (__except0__) {
/* 000201 */ 		return 'n.a.';
/* 000201 */ 	}
/* 000201 */ };
/* 000203 */ export var _tzname = function (t) {
/* 000206 */ 	var cn = __tzn (t);
/* 000207 */ 	var ret = [cn, cn];
/* 000208 */ 	var jj = __jan_jun_tz (t, __tzn);
/* 000209 */ 	var ind = 0;
/* 000210 */ 	if (!(_daylight_in_effect (t))) {
/* 000211 */ 		var ind = 1;
/* 000211 */ 	}
/* 000212 */ 	for (var i of jj) {
/* 000213 */ 		if (i != cn) {
/* 000214 */ 			ret [ind] = i;
/* 000214 */ 		}
/* 000214 */ 	}
/* 000215 */ 	return tuple (ret);
/* 000215 */ };
/* 000224 */ export var altzone = __now.getTimezoneOffset ();
/* 000225 */ if (!(_daylight_in_effect (__now))) {
/* 000227 */ 	var _jj = __jan_jun_tz (__now);
/* 000228 */ 	var altzone = (altzone == _jj [1] ? _jj [0] : _jj [1]);
/* 000228 */ }
/* 000229 */ var altzone = altzone * 60;
/* 000231 */ export var timezone = _timezone (__now) * 60;
/* 000233 */ export var daylight = _daylight (__now);
/* 000235 */ export var tzname = _tzname (__now);
/* 000238 */ export var time = function () {
/* 000244 */ 	return Date.now () / 1000;
/* 000244 */ };
/* 000247 */ export var asctime = function (t) {
/* 000248 */ 	return strftime ('%a %b %d %H:%M:%S %Y', t);
/* 000248 */ };
/* 000251 */ export var mktime = function (t) {
/* 000253 */ 	var d = new Date (t [0], t [1] - 1, t [2], t [3], t [4], t [5], 0);
/* 000254 */ 	return (d - 0) / 1000;
/* 000254 */ };
/* 000257 */ export var ctime = function (seconds) {
/* 000265 */ 	if (!(seconds)) {
/* 000266 */ 		var seconds = time ();
/* 000266 */ 	}
/* 000267 */ 	return asctime (localtime (seconds));
/* 000267 */ };
/* 000270 */ export var localtime = function (seconds) {
/* 000278 */ 	if (!(seconds)) {
/* 000279 */ 		var seconds = time ();
/* 000279 */ 	}
/* 000280 */ 	return gmtime (seconds, true);
/* 000280 */ };
/* 000283 */ export var gmtime = function (seconds, localtime) {
/* 000291 */ 	if (!(seconds)) {
/* 000292 */ 		var seconds = time ();
/* 000292 */ 	}
/* 000293 */ 	var millis = seconds * 1000;
/* 000294 */ 	__date.setTime (millis);
/* 000295 */ 	if (localtime) {
/* 000296 */ 		var t = _local_time_tuple (__date);
/* 000296 */ 	}
/* 000297 */ 	else {
/* 000298 */ 		var t = _utc_time_tuple (__date);
/* 000298 */ 	}
/* 000299 */ 	return t.__getslice__ (0, 9, 1);
/* 000299 */ };
/* 000303 */ export var strptime = function (string, format) {
/* 000334 */ 	if (!(format)) {
/* 000335 */ 		var format = '%a %b %d %H:%M:%S %Y';
/* 000335 */ 	}
/* 000336 */ 	var __left0__ = tuple ([string, format]);
/* 000336 */ 	var ts = __left0__ [0];
/* 000336 */ 	var fmt = __left0__ [1];
/* 000337 */ 	var get_next = function (fmt) {
/* 000339 */ 		var get_sep = function (fmt) {
/* 000340 */ 			var res = [];
/* 000341 */ 			if (!(fmt)) {
/* 000342 */ 				return tuple (['', '']);
/* 000342 */ 			}
/* 000343 */ 			for (var i = 0; i < len (fmt) - 1; i++) {
/* 000344 */ 				var c = fmt [i];
/* 000345 */ 				if (c == '%') {
/* 000345 */ 					break;
/* 000345 */ 				}
/* 000347 */ 				res.append (c);
/* 000347 */ 			}
/* 000348 */ 			return tuple ([''.join (res), fmt.__getslice__ (i, null, 1)]);
/* 000348 */ 		};
/* 000351 */ 		var __left0__ = tuple ([null, null, null]);
/* 000351 */ 		var d = __left0__ [0];
/* 000351 */ 		var sep = __left0__ [1];
/* 000351 */ 		var f = __left0__ [2];
/* 000352 */ 		if (fmt) {
/* 000353 */ 			if (fmt [0] == '%') {
/* 000354 */ 				var d = fmt [1];
/* 000355 */ 				var __left0__ = get_sep (fmt.__getslice__ (2, null, 1));
/* 000355 */ 				var sep = __left0__ [0];
/* 000355 */ 				var f = __left0__ [1];
/* 000355 */ 			}
/* 000356 */ 			else {
/* 000357 */ 				var __left0__ = get_sep (fmt);
/* 000357 */ 				var sep = __left0__ [0];
/* 000357 */ 				var f = __left0__ [1];
/* 000357 */ 			}
/* 000357 */ 		}
/* 000358 */ 		return tuple ([d, sep, f]);
/* 000358 */ 	};
/* 000361 */ 	var dir_val = dict ({});
/* 000362 */ 	while (ts) {
/* 000363 */ 		var __left0__ = get_next (fmt);
/* 000363 */ 		var d = __left0__ [0];
/* 000363 */ 		var sep = __left0__ [1];
/* 000363 */ 		var fmt = __left0__ [2];
/* 000364 */ 		if (sep == '') {
/* 000365 */ 			var lv = null;
/* 000366 */ 			if (d) {
/* 000370 */ 				var l = -(1);
/* 000371 */ 				if (d == 'Y') {
/* 000371 */ 					var l = 4;
/* 000371 */ 				}
/* 000372 */ 				else if (d == 'a') {
/* 000372 */ 					var l = len (__weekdays [0]);
/* 000372 */ 				}
/* 000373 */ 				else if (d == 'A') {
/* 000373 */ 					var l = len (__weekdays_long [0]);
/* 000373 */ 				}
/* 000374 */ 				else if (d == 'b') {
/* 000374 */ 					var l = len (__months [0]);
/* 000374 */ 				}
/* 000375 */ 				else if (__in__ (d, tuple (['d', 'm', 'H', 'M', 'S']))) {
/* 000376 */ 					var l = 2;
/* 000376 */ 				}
/* 000377 */ 				if (l > -(1)) {
/* 000378 */ 					var lv = [ts.__getslice__ (0, l, 1), ts.__getslice__ (l, null, 1)];
/* 000378 */ 				}
/* 000378 */ 			}
/* 000379 */ 			if (!(lv)) {
/* 000380 */ 				var lv = [ts, ''];
/* 000380 */ 			}
/* 000380 */ 		}
/* 000381 */ 		else {
/* 000382 */ 			var lv = _lsplit (ts, sep, 1);
/* 000382 */ 		}
/* 000383 */ 		if (d == null) {
/* 000384 */ 			var ts = lv [1];
/* 000384 */ 			continue;
/* 000384 */ 		}
/* 000386 */ 		var __left0__ = tuple ([lv [1], lv [0]]);
/* 000386 */ 		var ts = __left0__ [0];
/* 000386 */ 		dir_val [d] = __left0__ [1];
/* 000387 */ 		if (fmt == '') {
/* 000387 */ 			break;
/* 000387 */ 		}
/* 000387 */ 	}
/* 000390 */ 	var t = [1900, 1, 1, 0, 0, 0, 0, 1, -(1)];
/* 000391 */ 	var ignore_keys = [];
/* 000392 */ 	var have_weekday = false;
/* 000393 */ 	for (var [d, v] of dir_val.py_items ()) {
/* 000394 */ 		if (__in__ (d, ignore_keys)) {
/* 000394 */ 			continue;
/* 000394 */ 		}
/* 000397 */ 		if (d == 'p') {
/* 000397 */ 			continue;
/* 000397 */ 		}
/* 000400 */ 		if (__in__ (d, __lu.py_keys ())) {
/* 000401 */ 			t [__lu [d]] = int (v);
/* 000401 */ 			continue;
/* 000401 */ 		}
/* 000404 */ 		if (__in__ (d, tuple (['a', 'A', 'b', 'B']))) {
/* 000405 */ 			var v = v.lower ();
/* 000405 */ 		}
/* 000407 */ 		if (d == 'm') {
/* 000410 */ 			ignore_keys.append ('b');
/* 000411 */ 			ignore_keys.append ('B');
/* 000411 */ 		}
/* 000414 */ 		if (d == 'a') {
/* 000417 */ 			if (!(__in__ (v, __weekdays))) {
/* 000418 */ 				var __except0__ = ValueError ('Weekday unknown in your locale');
/* 000418 */ 				__except0__.__cause__ = null;
/* 000418 */ 				throw __except0__;
/* 000418 */ 			}
/* 000419 */ 			var have_weekday = true;
/* 000420 */ 			t [6] = __weekdays.index (v);
/* 000420 */ 		}
/* 000422 */ 		else if (d == 'A') {
/* 000423 */ 			if (!(__in__ (v, __weekdays_long))) {
/* 000424 */ 				var __except0__ = ValueError ('Weekday unknown in your locale');
/* 000424 */ 				__except0__.__cause__ = null;
/* 000424 */ 				throw __except0__;
/* 000424 */ 			}
/* 000425 */ 			var have_weekday = true;
/* 000426 */ 			t [6] = __weekdays_long.index (v);
/* 000426 */ 		}
/* 000428 */ 		else if (d == 'b') {
/* 000430 */ 			if (!(__in__ (v, __months))) {
/* 000431 */ 				var __except0__ = ValueError ('Month unknown in your locale');
/* 000431 */ 				__except0__.__cause__ = null;
/* 000431 */ 				throw __except0__;
/* 000431 */ 			}
/* 000432 */ 			t [1] = __months.index (v) + 1;
/* 000432 */ 		}
/* 000434 */ 		else if (d == 'B') {
/* 000436 */ 			if (!(__in__ (v, __months_long))) {
/* 000437 */ 				var __except0__ = ValueError ('Month unknown in your locale');
/* 000437 */ 				__except0__.__cause__ = null;
/* 000437 */ 				throw __except0__;
/* 000437 */ 			}
/* 000438 */ 			t [1] = __months_long.index (v) + 1;
/* 000438 */ 		}
/* 000441 */ 		else if (d == 'I') {
/* 000443 */ 			var ampm = dir_val ['p'] || 'am';
/* 000444 */ 			var ampm = ampm.lower ();
/* 000445 */ 			var v = int (v);
/* 000447 */ 			if (v == 12) {
/* 000448 */ 				var v = 0;
/* 000448 */ 			}
/* 000449 */ 			else if (v > 12) {
/* 000450 */ 				var __except0__ = ValueError (((("time data '" + string) + "' does not match format '") + format) + "'");
/* 000450 */ 				__except0__.__cause__ = null;
/* 000450 */ 				throw __except0__;
/* 000450 */ 			}
/* 000452 */ 			if (ampm == 'pm') {
/* 000452 */ 				v += 12;
/* 000452 */ 			}
/* 000454 */ 			t [__lu ['H']] = v;
/* 000454 */ 		}
/* 000456 */ 		else if (d == 'y') {
/* 000457 */ 			t [0] = 2000 + int (v);
/* 000457 */ 		}
/* 000459 */ 		else if (d == 'Z') {
/* 000460 */ 			if (__in__ (v.lower (), ['gmt', 'utc'])) {
/* 000461 */ 				t [-(1)] = 0;
/* 000461 */ 			}
/* 000461 */ 		}
/* 000461 */ 	}
/* 000464 */ 	var __date = new Date (0);
/* 000465 */ 	__date.setUTCFullYear (t [0]);
/* 000466 */ 	__date.setUTCMonth (t [1] - 1);
/* 000467 */ 	__date.setUTCDate (t [2]);
/* 000468 */ 	__date.setUTCHours (t [3]);
/* 000469 */ 	t [7] = _day_of_year (__date, true);
/* 000470 */ 	if (!(have_weekday)) {
/* 000471 */ 		t [6] = __date.getUTCDay () - 1;
/* 000471 */ 	}
/* 000473 */ 	return t;
/* 000473 */ };
/* 000476 */ export var strftime = function (format, t) {
/* 000477 */ 	var zf2 = function (v) {
/* 000479 */ 		if (v < 10) {
/* 000480 */ 			return '0' + str (v);
/* 000480 */ 		}
/* 000481 */ 		return v;
/* 000481 */ 	};
/* 000483 */ 	if (!(t)) {
/* 000484 */ 		var t = localtime ();
/* 000484 */ 	}
/* 000486 */ 	var f = format;
/* 000487 */ 	for (var d of __lu.py_keys ()) {
/* 000488 */ 		var k = '%' + d;
/* 000489 */ 		if (!(__in__ (k, f))) {
/* 000489 */ 			continue;
/* 000489 */ 		}
/* 000491 */ 		var v = zf2 (t [__lu [d]]);
/* 000492 */ 		var f = f.py_replace (k, v);
/* 000492 */ 	}
/* 000493 */ 	for (var [d, l, pos] of tuple ([tuple (['b', __months, 1]), tuple (['B', __months_long, 1]), tuple (['a', __weekdays, 6]), tuple (['A', __weekdays_long, 6])])) {
/* 000495 */ 		var p = t [pos];
/* 000496 */ 		if (pos == 1) {
/* 000497 */ 			var p = p - 1;
/* 000497 */ 		}
/* 000498 */ 		var v = l [p].capitalize ();
/* 000499 */ 		var f = f.py_replace ('%' + d, v);
/* 000499 */ 	}
/* 000501 */ 	if (__in__ ('%p', f)) {
/* 000502 */ 		if (t [3] > 11) {
/* 000503 */ 			var ap = 'PM';
/* 000503 */ 		}
/* 000504 */ 		else {
/* 000505 */ 			var ap = 'AM';
/* 000505 */ 		}
/* 000506 */ 		var f = f.py_replace ('%p', ap);
/* 000506 */ 	}
/* 000508 */ 	if (__in__ ('%y', f)) {
/* 000509 */ 		var f = f.py_replace ('%y', str (t [0]).__getslice__ (-(2), null, 1));
/* 000509 */ 	}
/* 000511 */ 	if (__in__ ('%I', f)) {
/* 000512 */ 		var v = t [3];
/* 000513 */ 		if (v == 0) {
/* 000514 */ 			var v = 12;
/* 000514 */ 		}
/* 000515 */ 		else if (v > 12) {
/* 000516 */ 			var v = v - 12;
/* 000516 */ 		}
/* 000517 */ 		var f = f.py_replace ('%I', zf2 (v));
/* 000517 */ 	}
/* 000519 */ 	return f;
/* 000519 */ };
/* 000036 */ 
//# sourceMappingURL=time.map