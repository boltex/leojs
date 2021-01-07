# -*- coding: utf-8 -*-
#@+leo-ver=5-thin
#@+node:ekr.20201227040845.1: * @file src/ekr/coreGlobals.py
#@@first
"""Global classes and functions, for use by leoInteg."""
import operator  # For g.Bunch.
import os
import re
#@+<< define g.globalDirectiveList >>
#@+node:ekr.20210101093155.1: ** << define g.globalDirectiveList >>
# Visible externally so plugins may add to the list of directives.
globalDirectiveList = [
    # Order does not matter.
    'all',
    'beautify',
    'colorcache', 'code', 'color', 'comment', 'c',
    'delims', 'doc',
    'encoding', 'end_raw',
    'first', 'header', 'ignore',
    'killbeautify', 'killcolor',
    'language', 'last', 'lineending',
    'markup',
    'nobeautify',
    'nocolor-node', 'nocolor', 'noheader', 'nowrap',
    'nopyflakes',  # Leo 6.1.
    'nosearch',  # Leo 5.3.
    'others', 'pagewidth', 'path', 'quiet',
    'raw', 'root-code', 'root-doc', 'root', 'silent',
    'tabwidth', 'terse',
    'unit', 'verbose', 'wrap',
]

directives_pat = None  # Set below.
#@-<< define g.globalDirectiveList >>
#@+others
#@+node:ekr.20210107085120.1: ** class g.Bunch     (coreGlobals.py)
class Bunch:
    """
    From The Python Cookbook:

        Create a Bunch whenever you want to group a few variables:
        
            point = Bunch(datum=y, squared=y*y, coord=x)
        
        You can read/write the named attributes you just created, add others,
        del some of them, etc::
        
            if point.squared > threshold:
                point.isok = True
    """

    def __init__(self, **keywords):
        self.__dict__.update(keywords)

    def __repr__(self):
        return self.toString()

    def ivars(self):
        return sorted(self.__dict__)

    def keys(self):
        return sorted(self.__dict__)

    def toString(self):
        tag = self.__dict__.get('tag')
        entries = [
            f"{key}: {str(self.__dict__.get(key)) or repr(self.__dict__.get(key))}"
                for key in self.ivars() if key != 'tag'
        ]
        # Fail.
        result = [f'g.Bunch({tag or ""})']
        result.extend(entries)
        return '\n    '.join(result) + '\n'

    # Used by new undo code.

    def __setitem__(self, key, value):
        """Support aBunch[key] = val"""
        return operator.setitem(self.__dict__, key, value)

    def __getitem__(self, key):
        """Support aBunch[key]"""
        # g.pr('g.Bunch.__getitem__', key)
        return operator.getitem(self.__dict__, key)

    def get(self, key, theDefault=None):
        return self.__dict__.get(key, theDefault)

    def __contains__(self, key):  # New.
        # g.pr('g.Bunch.__contains__', key in self.__dict__, key)
        return key in self.__dict__

bunch = Bunch
#@+node:ekr.20201227040845.31: ** class g.FileLikeObject (coreGlobals.py)
# Note: we could use StringIo for this.

class FileLikeObject:
    """Define a file-like object for redirecting writes to a string.

    The caller is responsible for handling newlines correctly.
    """
    
    def __init__(self, encoding='utf-8', fromString=None):
        self.encoding = encoding or 'utf-8'
        self._list = splitLines(fromString)  # Must preserve newlines!
        self.ptr = 0

    #@+others
    #@+node:ekr.20201227040845.33: *3* FileLikeObject.clear (coreGlobals.py)
    def clear(self):
        self._list = []
    #@+node:ekr.20201227040845.34: *3* FileLikeObject.close (coreGlobals.py)
    def close(self):
        pass

    #@+node:ekr.20201227040845.35: *3* FileLikeObject.flush (coreGlobals.py)
    def flush(self):
        pass
    #@+node:ekr.20201227040845.36: *3* FileLikeObject.get & getvalue & read (coreGlobals.py)
    def get(self):
        return ''.join(self._list)

    getvalue = get  # for compatibility with StringIo
    read = get  # for use by sax.
    #@+node:ekr.20201227040845.37: *3* FileLikeObject.readline (coreGlobals.py)
    def readline(self):
        """Read the next line using at.list and at.ptr."""
        if self.ptr < len(self._list):
            line = self._list[self.ptr]
            self.ptr += 1
            return line
        return ''
    #@+node:ekr.20201227040845.38: *3* FileLikeObject.write  (coreGlobals.py)
    def write(self, s):
        if s:
            if isinstance(s, bytes):
                s = toUnicode(s, self.encoding)
            self._list.append(s)
    #@-others
#@+node:ekr.20201227042136.1: ** g.angleBrackets   (coreGlobals.py)
def angleBrackets(s):
    """Return < < s > >"""
    lt = "<<"
    rt = ">>"
    return lt + s + rt
#@+node:ekr.20201227044712.3: ** g.caller          (coreGlobals.py)
def caller(i=1):
    """Return the caller name i levels up the stack."""
    return callers(i + 1).split(',')[0]
#@+node:ekr.20201227044712.1: ** g.callers         (coreGlobals.py)
def callers(n=4, count=0, excludeCaller=True, verbose=False):
    """
    Return a string containing a comma-separated list of the callers
    of the function that called callerList.

    excludeCaller: True (the default), callers itself is not on the list.
    
    If the `verbose` keyword is True, return a list separated by newlines.
    """
    # Be careful to call _callerName with smaller values of i first:
    # sys._getframe throws ValueError if there are less than i entries.
    result = []
    i = 3 if excludeCaller else 2
    while 1:
        s = _callerName(n=i, verbose=verbose)
        if s:
            result.append(s)
        if not s or len(result) >= n:
            break
        i += 1
    result.reverse()
    if count > 0:
        result = result[:count]
    if verbose:
        return ''.join([f"\n  {z}" for z in result])
    return ','.join(result)
#@+node:ekr.20201227044712.2: ** g._callerName     (coreGlobals.py)
def _callerName(n, verbose=False):
    
    return "<_callerName>"

    ### This won't work in JavaScript.
        # try:
            # # get the function name from the call stack.
            # f1 = sys._getframe(n)  # The stack frame, n levels up.
            # code1 = f1.f_code  # The code object
            # sfn = shortFilename(code1.co_filename)  # The file name.
            # locals_ = f1.f_locals  # The local namespace.
            # name = code1.co_name
            # line = code1.co_firstlineno
            # if verbose:
                # obj = locals_.get('self')
                # full_name = f"{obj.__class__.__name__}.{name}" if obj else name
                # return f"line {line:4} {sfn:>30} {full_name}"
            # return name
        # except ValueError:
            # return ''
                # # The stack is not deep enough OR
                # # sys._getframe does not exist on this platform.
        # except Exception:
            # es_exception()
            # return ''  # "<no caller name>"
#@+node:ekr.20201227042826.1: ** g.doKeywordArgs   (coreGlobals.py)
def doKeywordArgs(keys, d=None):
    """
    Return a result dict that is a copy of the keys dict
    with missing items replaced by defaults in d dict.
    """
    if d is None: d = {}
    result = {}
    for key, default_val in d.items():
        isBool = default_val in (True, False)
        val = keys.get(key)
        if isBool and val in (True, 'True', 'true'):
            result[key] = True
        elif isBool and val in (False, 'False', 'false'):
            result[key] = False
        elif val is None:
            result[key] = default_val
        else:
            result[key] = val
    return result
#@+node:ekr.20201227044135.1: ** g.error           (coreGlobals.py)
def error(*args, **keys):

    es_print(color='error', *args, **keys)
#@+node:ekr.20201227042250.1: ** g.es              (coreGlobals.py)
def es(*args, **keys):
    """Put all non-keyword args to the log pane."""
    result = []
    for arg in args:
        result.append(arg if isinstance(arg, str) else repr(arg))
    print(','.join(result))

#@+node:ekr.20201227045227.1: ** g.es_exception    (coreGlobals.py)
def es_exception():
    
    return '<no file>', 0  # To do
    
    ### Old code
        # typ, val, tb = sys.exc_info()
        # # val is the second argument to the raise statement.
        # if full:
            # lines = traceback.format_exception(typ, val, tb)
        # else:
            # lines = traceback.format_exception_only(typ, val)
        # for line in lines:
            # g.es_print_error(line, color=color)
        # fileName, n = g.getLastTracebackFileAndLineNumber()
        # return fileName, n
#@+node:ekr.20201227042258.1: ** g.es_print        (coreGlobals.py)
# see: http://www.diveintopython.org/xml_processing/unicode.html

def es_print(*args, **keys):
    """Print all non-keyword args, and put them to the log pane."""
    pr(*args, **keys)
    es(*args, **keys)
#@+node:ekr.20210101092909.1: ** g.isDirective     (coreGlobals.py)
# Patterns used only in this module...
g_is_directive_pattern = re.compile(r'^\s*@([\w-]+)\s*')
    # This pattern excludes @encoding.whatever and @encoding(whatever)
    # It must allow @language python, @nocolor-node, etc.

def isDirective(s):
    """Return True if s starts with a directive."""
    m = g_is_directive_pattern.match(s)
    if m:
        s2 = s[m.end(1) :]
        if s2 and s2[0] in ".(":
            return False
        return bool(m.group(1) in globalDirectiveList)
    return False
#@+node:ekr.20201227072502.1: ** g.is_special      (coreGlobals.py)
def is_special(s, directive):
    """Return True if the body text contains the @ directive."""
    assert(directive and directive[0] == '@')
    lws = directive in ("@others", "@all")
        # Most directives must start the line.
    pattern = r'^\s*(%s\b)' if lws else r'^(%s\b)'
    pattern = re.compile(pattern % directive, re.MULTILINE)
    m = re.search(pattern, s)
    if m:
        return True, m.start(1)
    return False, -1
#@+node:ekr.20210101093047.1: ** g.isWordChar*     (coreGlobals.py)
def isWordChar(ch):
    """Return True if ch should be considered a letter."""
    return ch and (ch.isalnum() or ch == '_')

def isWordChar1(ch):
    return ch and (ch.isalpha() or ch == '_')
#@+node:ekr.20201227070747.1: ** g.match           (coreGlobals.py)
# Warning: this code makes no assumptions about what follows pattern.

def match(s, i, pattern):
    return s and pattern and s.find(pattern, i, i + len(pattern)) == i
#@+node:ekr.20201227070823.1: ** g.match_word      (coreGlobals.py)
def match_word(s, i, pattern):

    pat = fr"\b{pattern}\b"
    return bool(re.search(pat, s[i:]))
#@+node:ekr.20201227040845.163: ** g.objToSTring     (coreGlobals.py)
def objToString(obj, indent='', printCaller=False, tag=None):
    """Pretty print any Python object to a string."""
    # pylint: disable=undefined-loop-variable
        # Looks like a a pylint bug.
    #
    # Compute s.
    if isinstance(obj, dict):
        s = dictToString(obj, indent=indent)
    elif isinstance(obj, list):
        s = listToString(obj, indent=indent)
    elif isinstance(obj, tuple):
        s = tupleToString(obj, indent=indent)
    elif isinstance(obj, str):
        # Print multi-line strings as lists.
        s = obj
        lines = splitLines(s)
        if len(lines) > 1:
            s = listToString(lines, indent=indent)
        else:
            s = repr(s)
    else:
        s = repr(obj)
    #
    # Compute the return value.
    if printCaller and tag:
        prefix = f"{caller()}: {tag}"
    elif printCaller or tag:
        prefix = caller() if printCaller else tag
    else:
        prefix = None
    if prefix:
        sep = '\n' if '\n' in s else ' '
        return f"{prefix}:{sep}{s}"
    return s
#@+node:ekr.20201227040845.161: *3* g.dictToString  (coreGlobals.py)
def dictToString(d, indent='', tag=None):
    """Pretty print a Python dict to a string."""
    # pylint: disable=unnecessary-lambda
    if not d:
        return '{}'
    result = ['{\n']
    indent2 = indent + ' ' * 4
    n = 2 + len(indent) + max([len(repr(z)) for z in d.keys()])
    for i, key in enumerate(sorted(d, key=lambda z: repr(z))):
        pad = ' ' * max(0, (n - len(repr(key))))
        result.append(f"{pad}{key}:")
        result.append(objToString(d.get(key), indent=indent2))
        if i + 1 < len(d.keys()):
            result.append(',')
        result.append('\n')
    result.append(indent + '}')
    s = ''.join(result)
    return f"{tag}...\n{s}\n" if tag else s
#@+node:ekr.20201227040845.162: *3* g.listToString  (coreGlobals.py)
def listToString(obj, indent='', tag=None):
    """Pretty print a Python list to a string."""
    if not obj:
        return '[]'
    result = ['[']
    indent2 = indent + ' ' * 4
    # I prefer not to compress lists.
    for i, obj2 in enumerate(obj):
        result.append('\n' + indent2)
        result.append(objToString(obj2, indent=indent2))
        if i + 1 < len(obj) > 1:
            result.append(',')
        else:
            result.append('\n' + indent)
    result.append(']')
    s = ''.join(result)
    return f"{tag}...\n{s}\n" if tag else s
#@+node:ekr.20201227040845.167: *3* g.tupleToString (coreGlobals.py)
def tupleToString(obj, indent='', tag=None):
    """Pretty print a Python tuple to a string."""
    if not obj:
        return '(),'
    result = ['(']
    indent2 = indent + ' ' * 4
    for i, obj2 in enumerate(obj):
        if len(obj) > 1:
            result.append('\n' + indent2)
        result.append(objToString(obj2, indent=indent2))
        if len(obj) == 1 or i + 1 < len(obj):
            result.append(',')
        elif len(obj) > 1:
            result.append('\n' + indent)
    result.append(')')
    s = ''.join(result)
    return f"{tag}...\n{s}\n" if tag else s
#@+node:ekr.20201227042343.1: ** g.plural          (coreGlobals.py)
def plural(obj):
    """Return "s" or "" depending on n."""
    if isinstance(obj, (list, tuple, str)):
        n = len(obj)
    else:
        n = obj
    return '' if n == 1 else 's'
#@+node:ekr.20201227042305.1: ** g.pr              (coreGlobals.py)
def pr(*args, **keys):
    """ Print all non-keyword args."""
    result = []
    for arg in args:
        if isinstance(arg, str):
            result.append(arg)
        else:
            result.append(repr(arg))
    print(','.join(result))
#@+node:ekr.20201227040845.166: ** g.printObj        (coreGlobals.py)
def printObj(obj, indent='', printCaller=False, tag=None):
    """Pretty print any Python object using pr."""
    pr(objToString(obj, indent=indent, printCaller=printCaller, tag=tag))

#@+node:ekr.20201227044510.1: ** g.shortFileName   (coreGlobals.py)
def shortFileName(fileName):
    """Return the base name of a path."""
    return os.path.basename(fileName) if fileName else ''

shortFilename = shortFileName
#@+node:ekr.20201227070623.1: ** g.skip_to_char    (coreGlobals.py)
def skip_to_char(s, i, ch):
    j = s.find(ch, i)
    if j == -1:
        return len(s), s[i:]
    return j, s[i:j]
#@+node:ekr.20210101092818.1: ** g.skip_id         (coreGlobals.py)
def skip_id(s, i, chars=None):
    chars = toUnicode(chars) if chars else ''
    n = len(s)
    while i < n and (isWordChar(s[i]) or s[i] in chars):
        i += 1
    return i
#@+node:ekr.20201227072555.1: ** g.skip_ws*        (coreGlobals.py)
def skip_ws(s, i):
    n = len(s)
    while i < n and s[i] in '\t ':
        i += 1
    return i

def skip_ws_and_nl(s, i):
    n = len(s)
    while i < n and s[i] in ' \t\n\r':
        i += 1
    return i
#@+node:ekr.20201227043815.1: ** g.splitLines      (coreGlobals.py)
def splitLines(s):
    """
    Split s into lines, preserving the number of lines and the endings
    of all lines, including the last line.
    """
    return s.splitlines(True) if s else []
#@+node:ekr.20201227043526.1: ** g.toEncodedString (coreGlobals.py)
def toEncodedString(s, encoding='utf-8', reportErrors=False):
    """Convert unicode string to an encoded string."""
    if not isinstance(s, str):
        return s
    if not encoding:
        encoding = 'utf-8'
    # These are the only significant calls to s.encode in Leo.
    try:
        s = s.encode(encoding, "strict")
    except UnicodeError:
        s = s.encode(encoding, "replace")
        if reportErrors:
            error(f"Error converting {s} from unicode to {encoding} encoding")
    return s
#@+node:ekr.20201227043450.1: ** g.toUnicode       (coreGlobals.py)
unicode_warnings = {}  # Keys are callers.

def toUnicode(s, encoding=None, reportErrors=False):
    """Convert bytes to unicode if necessary."""
    if isinstance(s, str):
        return s
    tag = 'g.toUnicode'
    if not isinstance(s, bytes):
        if callers() not in unicode_warnings:
            unicode_warnings[callers] = True
            error(f"{tag}: unexpected argument of type {s.__class__.__name__}")
            trace(callers())
        return ''
    if not encoding:
        encoding = 'utf-8'
    try:
        s = s.decode(encoding, 'strict')
    except(UnicodeDecodeError, UnicodeError):
        # https://wiki.python.org/moin/UnicodeDecodeError
        s = s.decode(encoding, 'replace')
        if reportErrors:
            error(f"{tag}: unicode error. encoding: {encoding!r}, s:\n{s!r}")
            trace(callers())
    except Exception:
        es_exception()
        error(f"{tag}: unexpected error! encoding: {encoding!r}, s:\n{s!r}")
        trace(callers())
    return s
#@+node:ekr.20201227042310.1: ** g.trace           (coreGlobals.py)
def trace(*args, **keys):
    """Print a tracing message."""
    print(args)
#@-others
#@@language python
#@@tabwidth -4
#@@pagewidth 70
#@-leo
