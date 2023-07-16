// Mix of MIT licenced node-jpickle by Jeremy Lainé, and pickle-js by Frank Salim

const emulated: { [key: string]: (args: any) => any } = {
    'datetime.datetime': function (args: any) {
        // @ts-expect-error
        let tmp: Buffer = new Buffer.from(args[0], 'binary');
        let year = tmp.readUInt16BE(0);
        let month = tmp.readUInt8(2) - 1;
        let day = tmp.readUInt8(3);
        let hour = tmp.readUInt8(4);
        let minute = tmp.readUInt8(5);
        let second = tmp.readUInt8(6);
        let microsecond = tmp.readUInt32BE(6) & 0xffffff;
        if (args[1] === 'UTC') {
            return new Date(
                Date.UTC(
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    second,
                    microsecond / 1000
                )
            );
        } else {
            return new Date(
                year,
                month,
                day,
                hour,
                minute,
                second,
                microsecond / 1000
            );
        }
    },
    'django.utils.timezone.UTC': function (args: any) {
        return 'UTC';
    },
    '__builtin__.set': function (args: any[]) {
        return args[0];
    },
};

var Parser = function () {
    // @ts-expect-error
    this.mark = 'THIS-NEEDS-TO-BE-UNIQUE-TO-SERVE-AS-A-BOUNDARY';
    // @ts-expect-error
    this.memo = {};
    // @ts-expect-error
    this.stack = [];
};

// @ts-expect-error
Parser.prototype.load = function (pickle) {
    var MARK = '(', // push special markobject on stack
        STOP = '.', // every pickle ends with STOP
        POP = '0', // discard topmost stack item
        POP_MARK = '1', // discard stack top through topmost markobject
        DUP = '2', // duplicate top stack item
        FLOAT = 'F', // push float object; decimal string argument
        INT = 'I', // push integer or bool; decimal string argument
        BININT = 'J', // push 4-byte signed int
        BININT1 = 'K', // push 1-byte unsigned int
        LONG = 'L', // push long; decimal string argument
        BININT2 = 'M', // push 2-byte unsigned int
        NONE = 'N', // push None
        // missing PERSID
        // missing BINPERSID
        REDUCE = 'R', // apply callable to argtuple, both on stack
        STRING = 'S', // push string; NL-terminated string argument
        BINSTRING = 'T', // push string; counted binary string argument
        SHORT_BINSTRING = 'U', //  "     "   ;    "      "       "      " < 256 bytes
        UNICODE = 'V', // push Unicode string; raw-unicode-escaped'd argument
        BINUNICODE = 'X', //   "     "       "  ; counted UTF-8 string argument
        APPEND = 'a', // append stack top to list below it
        BUILD = 'b', // build the entire value
        GLOBAL = 'c', // push self.find_class(modname, name); 2 string args
        DICT = 'd', // build a dict from stack items
        EMPTY_DICT = '}', // push empty dict
        APPENDS = 'e', // extend list on stack by topmost stack slice
        GET = 'g', // push item from memo on stack; index is string arg
        BINGET = 'h', //   "    "    "    "   "   "  ;   "    " 1-byte arg
        // missing INST
        LONG_BINGET = 'j', // push item from memo on stack; index is 4-byte arg
        LIST = 'l', // build list from topmost stack items
        EMPTY_LIST = ']', // push empty list
        OBJ = 'o', // build a class instance using the objects between here and the mark
        PUT = 'p', // store stack top in memo; index is string arg
        BINPUT = 'q', //   "     "    "   "   " ;   "    " 1-byte arg
        LONG_BINPUT = 'r', //   "     "    "   "   " ;   "    " 4-byte arg
        SETITEM = 's', // add key+value pair to dict
        TUPLE = 't', // build tuple from topmost stack items
        EMPTY_TUPLE = ')', // push empty tuple
        SETITEMS = 'u', // modify dict by adding topmost key+value pairs
        BINFLOAT = 'G', // push float; arg is 8-byte float encoding
        // protocol 2
        PROTO = '\x80', // identify pickle protocol
        NEWOBJ = '\x81', // build object by applying cls.__new__ to argtuple
        TUPLE1 = '\x85', // build 1-tuple from stack top
        TUPLE2 = '\x86', // build 2-tuple from two topmost stack items
        TUPLE3 = '\x87', // build 3-tuple from three topmost stack items
        NEWTRUE = '\x88', // push True
        NEWFALSE = '\x89', // push False
        LONG1 = '\x8a', // push long from < 256 bytes
        LONG4 = '\x8b', // push really big long
        // protocol 3
        BINBYTES = 'B', // push bytes; counted binary string argument
        SHORT_BINBYTES = 'C'; //  "     "   ;    "      "       "      " < 256 bytes
    // @ts-expect-error
    var buffer = new Buffer.from(pickle, 'binary');
    buffer.readLine = function (i: any) {
        var index = pickle.indexOf('\n', i);
        if (index === -1) {
            throw new Error('Could not find end of line');
        }
        return pickle.substr(i, index - i);
    };

    for (var i = 0; i < pickle.length;) {
        var opindex = i,
            opcode = pickle[i++];
        //console.log('opcode ' + opindex + ' ' + opcode);
        switch (opcode) {
            // protocol 2
            case PROTO:
                var proto = buffer.readUInt8(i++);
                if (proto !== 2 && proto !== 3) {
                    throw new Error(
                        'Unhandled pickle protocol version: ' + proto
                    );
                }
                break;
            case TUPLE1:
                var a = this.stack.pop();
                this.stack.push([a]);
                break;
            case TUPLE2:
                var b = this.stack.pop(),
                    a = this.stack.pop();
                this.stack.push([a, b]);
                break;
            case TUPLE3:
                var c = this.stack.pop(),
                    b = this.stack.pop(),
                    a = this.stack.pop();
                this.stack.push([a, b, c]);
                break;
            case NEWTRUE:
                this.stack.push(true);
                break;
            case NEWFALSE:
                this.stack.push(false);
                break;
            case LONG1:
                var length = buffer.readUInt8(i++);
                // FIXME: actually decode LONG1
                i += length;
                this.stack.push(0);
                break;
            case LONG4:
                var length = buffer.readUInt32LE(i);
                i += 4;
                // FIXME: actually decode LONG4
                i += length;
                this.stack.push(0);
                break;
            // protocol 0 and protocol 1
            case POP:
                this.stack.pop();
                break;
            case POP_MARK:
                var mark = this.marker();
                this.stack = this.stack.slice(0, mark);
                break;
            case DUP:
                var value = this.stack[this.stack.length - 1];
                this.stack.push(value);
                break;
            case EMPTY_DICT:
                this.stack.push({});
                break;
            case EMPTY_LIST:
            case EMPTY_TUPLE:
                this.stack.push([]);
                break;
            case GET:
                var index = buffer.readLine(i);
                i += index.length + 1;
                this.stack.push(this.memo[index]);
                break;
            case BINGET:
                var index = buffer.readUInt8(i++);
                this.stack.push(this.memo['' + index]);
                break;
            case LONG_BINGET:
                var index = buffer.readUInt32LE(i);
                i += 4;
                this.stack.push(this.memo['' + index]);
                break;
            case PUT:
                var index = buffer.readLine(i);
                i += index.length + 1;
                this.memo[index] = this.stack[this.stack.length - 1];
                break;
            case BINPUT:
                var index = buffer.readUInt8(i++);
                this.memo['' + index] = this.stack[this.stack.length - 1];
                break;
            case LONG_BINPUT:
                var index = buffer.readUInt32LE(i);
                i += 4;
                this.memo['' + index] = this.stack[this.stack.length - 1];
                break;
            case GLOBAL:
                var module = buffer.readLine(i);
                i += module.length + 1;
                var name = buffer.readLine(i);
                i += name.length + 1;
                var func: any = emulated[module + '.' + name];
                if (func === undefined) {
                    throw new Error(
                        'Cannot emulate global: ' + module + ' ' + name
                    );
                }
                this.stack.push(func);
                break;
            case OBJ:
                var obj = new (this.stack.pop())();
                var mark = this.marker();
                for (var pos = mark + 1; pos < this.stack.length; pos += 2) {
                    obj[this.stack[pos]] = this.stack[pos + 1];
                }
                this.stack = this.stack.slice(0, mark);
                this.stack.push(obj);
                break;
            case BUILD:
                var dict = this.stack.pop();
                var obj = this.stack.pop();
                for (var p in dict) {
                    obj[p] = dict[p];
                }
                this.stack.push(obj);
                break;
            case REDUCE:
                var args = this.stack.pop();
                var func = this.stack[this.stack.length - 1];
                this.stack[this.stack.length - 1] = func(args);
                break;
            case INT:
                var value = buffer.readLine(i);
                i += value.length + 1;
                if (value === '01') {
                    this.stack.push(true);
                } else if (value === '00') {
                    this.stack.push(false);
                } else {
                    this.stack.push(parseInt(value));
                }
                break;
            case BININT:
                this.stack.push(buffer.readInt32LE(i));
                i += 4;
                break;
            case BININT1:
                this.stack.push(buffer.readUInt8(i));
                i += 1;
                break;
            case BININT2:
                this.stack.push(buffer.readUInt16LE(i));
                i += 2;
                break;
            case MARK:
                this.stack.push(this.mark);
                break;
            case FLOAT:
                var value = buffer.readLine(i);
                i += value.length + 1;
                this.stack.push(parseFloat(value));
                break;
            case LONG:
                var value = buffer.readLine(i);
                i += value.length + 1;
                this.stack.push(parseInt(value));
                break;
            case BINFLOAT:
                this.stack.push(buffer.readDoubleBE(i));
                i += 8;
                break;
            case STRING:
                var value = buffer.readLine(i);
                i += value.length + 1;
                if (value[0] === "'") {
                    if (value[value.length - 1] !== "'") {
                        throw new Error('insecure string pickle');
                    }
                } else if ((value[0] = '"')) {
                    if (value[value.length - 1] !== '"') {
                        throw new Error('insecure string pickle');
                    }
                } else {
                    throw new Error('insecure string pickle');
                }
                this.stack.push(value.substr(1, value.length - 2));
                break;
            case UNICODE:
                var value = buffer.readLine(i);
                i += value.length + 1;
                this.stack.push(value);
                break;
            case BINSTRING:
            case BINBYTES:
                var length = buffer.readUInt32LE(i);
                i += 4;
                this.stack.push(buffer.toString('binary', i, i + length));
                i += length;
                break;
            case SHORT_BINSTRING:
            case SHORT_BINBYTES:
                var length = buffer.readUInt8(i++);
                this.stack.push(buffer.toString('binary', i, i + length));
                i += length;
                break;
            case BINUNICODE:
                var length = buffer.readUInt32LE(i);
                i += 4;
                this.stack.push(buffer.toString('utf8', i, i + length));
                i += length;
                break;
            case APPEND:
                var value = this.stack.pop();
                this.stack[this.stack.length - 1].push(value);
                break;
            case APPENDS:
                var mark = this.marker(),
                    list = this.stack[mark - 1];
                list.push.apply(list, this.stack.slice(mark + 1));
                this.stack = this.stack.slice(0, mark);
                break;
            case SETITEM:
                var value = this.stack.pop(),
                    key = this.stack.pop();
                this.stack[this.stack.length - 1][key] = value;
                break;
            case SETITEMS:
                var mark = this.marker(),
                    obj = this.stack[mark - 1];
                for (var pos = mark + 1; pos < this.stack.length; pos += 2) {
                    obj[this.stack[pos]] = this.stack[pos + 1];
                }
                this.stack = this.stack.slice(0, mark);
                break;
            case LIST:
            case TUPLE:
                var mark = this.marker(),
                    list = this.stack.slice(mark + 1);
                this.stack = this.stack.slice(0, mark);
                this.stack.push(list);
                break;
            case DICT:
                var mark = this.marker();
                obj = {};
                for (var pos = mark + 1; pos < this.stack.length; pos += 2) {
                    obj[this.stack[pos]] = this.stack[pos + 1];
                }
                this.stack = this.stack.slice(0, mark);
                this.stack.push(obj);
                break;
            case STOP:
                return this.stack.pop();
            case NONE:
                this.stack.push(null);
                break;
            default:
                throw new Error("Unhandled opcode '" + opcode + "'");
        }
    }
};

Parser.prototype.marker = function (parser: any) {
    var k = this.stack.length - 1;
    while (k > 0 && this.stack[k] !== this.mark) {
        --k;
    }
    return k;
};

// @ts-expect-error
var pickle = new (function () {
    // @ts-expect-error
    var self = this;
    /* Opcodes
     * !.. not all opcodes are currently supported!
     * ... 1.0 should support all opcodes in pickle v0 (text)
     */
    var MARK = '(';
    var STOP = '.';

    var INT = 'I';
    var FLOAT = 'F';
    var NONE = 'N';
    var STRING = 'S';

    var APPEND = 'a';
    var DICT = 'd';
    var GET = 'g';
    var LIST = 'l';
    var PUT = 'p';
    var SETITEM = 's';
    var TUPLE = 't';

    var TRUE = 'I01\n';
    var FALSE = 'I00\n';

    /* Other magic constants that are not opcodes
     */
    const NEWLINE = '\n';
    const MARK_OBJECT = null;
    const SQUO = "'";

    /*
     * dumps(object) -> string
     * serializes a JavaScript object to a Python pickle
     */
    self.dumps = function (obj: any) {
        try {
            JSON.stringify(obj);
        } catch (error) {
            throw new Error('Circular Reference');
        }
        // pickles always end with a stop
        return _dumps(obj) + STOP;
    };

    var _check_memo = function (obj: any, memo: any[]) {
        for (var i = 0; i < memo.length; i++) {
            if (memo[i] === obj) {
                return i;
            }
        }
        return -1;
    };

    var _dumps = function (obj: any, memo?: any[]) {
        memo = memo || [];
        if (obj === null) {
            return NONE;
        }

        if (typeof obj === 'object') {
            var p = _check_memo(obj, memo);
            if (p !== -1) {
                return GET + p + NEWLINE;
            }

            var t = obj.constructor.name;
            switch (t) {
                case Array().constructor.name:
                    var s = MARK + LIST + PUT + memo.length + NEWLINE;
                    memo.push(obj);

                    for (var i = 0; i < obj.length; i++) {
                        s += _dumps(obj[i], memo) + APPEND;
                    }
                    return s;
                    break;
                case Object().constructor.name:
                    var s = MARK + DICT + PUT + memo.length + NEWLINE;
                    memo.push(obj);

                    for (var key in obj) {
                        //console.log(key)
                        //push the value, then the key, then 'set'
                        s += _dumps(obj[key], memo);
                        s += _dumps(key, memo);
                        s += SETITEM;
                    }
                    return s;
                    break;
                default:
                    throw new Error('Cannot pickle this object: ' + t);
            }
        } else if (typeof obj === 'string') {
            var p = _check_memo(obj, memo);
            if (p !== -1) {
                return GET + p + NEWLINE;
            }

            var escaped = obj
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/\n/g, '\\n');

            var s =
                STRING +
                SQUO +
                escaped +
                SQUO +
                NEWLINE +
                PUT +
                memo.length +
                NEWLINE;
            memo.push(obj);
            return s;
        } else if (typeof obj === 'number') {
            return FLOAT + obj + NEWLINE;
        } else if (typeof obj === 'boolean') {
            return obj ? TRUE : FALSE;
        } else {
            throw new Error('Cannot pickle this type: ' + typeof obj);
        }
    };
})();

module.exports.emulated = emulated;
// * Use loads from node-jpickle
module.exports.loads = function (data: any) {
    // @ts-expect-error
    var parser: any = new Parser() as any;
    return parser.load(data);
};
// * Use loads from picklejs
module.exports.dumps = function (data: any, protocol: number) {
    return pickle.dumps(data);
};
