
/*
 * Global constants, variables and utility functions used throughout Leo.
 * Important: This module imports no other Leo module.
 */
import { assert } from 'console';
import * as fs from 'fs';
import { LeoApp } from './leoApp';

export const isMac: boolean = process.platform.startsWith('darwin');
export const isWindows: boolean = process.platform.startsWith('win');

export const in_bridge: boolean = false; // May be unused as a vscode extension.
// Set to True in leoBridge.py just before importing leo.core.leoApp.
// This tells leoApp to load a null Gui.

/*
    import binascii
    import codecs
    from functools import reduce
    try:
        import gc
    except ImportError:
        gc = None
    try:
        import gettext
    except ImportError:  # does not exist in jython.
        gettext = None
    import glob
    import io
    StringIO = io.StringIO
    import importlib
    import inspect
    import operator
    import os
    #
    # Do NOT import pdb here!  We shall define pdb as a _function_ below.
    # import pdb
    import re
    import shlex
    import shutil
    import string
    import subprocess
    import tempfile
    import time
    import traceback
    import types
    import unittest
    import urllib
    import urllib.parse as urlparse
*/

// Visible externally so plugins may add to the list of directives.
export const globalDirectiveList: string[] = [
    // Order does not matter.
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
    'nopyflakes',  // Leo 6.1.
    'nosearch',  // Leo 5.3.
    'others', 'pagewidth', 'path', 'quiet',
    'raw', 'root-code', 'root-doc', 'root', 'silent',
    'tabwidth', 'terse',
    'unit', 'verbose', 'wrap',
];

export const directives_pat: any = null;  // Set below.

/*
  The cmd_instance_dict supports per-class @cmd decorators. For example, the
  following appears in leo.commands.

      def cmd(name):
          """Command decorator for the abbrevCommands class."""
          return g.new_cmd_decorator(name, ['c', 'abbrevCommands',])

  For commands based on functions, use the @g.command decorator.
*/

export const global_commands_dict: { [key: string]: (...args: any[]) => any } = {};

export const cmd_instance_dict: { [key: string]: string[] } = {
    // Keys are class names, values are attribute chains.
    'AbbrevCommandsClass': ['c', 'abbrevCommands'],
    'AtFile': ['c', 'atFileCommands'],
    'AutoCompleterClass': ['c', 'k', 'autoCompleter'],
    'ChapterController': ['c', 'chapterController'],
    'Commands': ['c'],
    'ControlCommandsClass': ['c', 'controlCommands'],
    'DebugCommandsClass': ['c', 'debugCommands'],
    'EditCommandsClass': ['c', 'editCommands'],
    'EditFileCommandsClass': ['c', 'editFileCommands'],
    'FileCommands': ['c', 'fileCommands'],
    'HelpCommandsClass': ['c', 'helpCommands'],
    'KeyHandlerClass': ['c', 'k'],
    'KeyHandlerCommandsClass': ['c', 'keyHandlerCommands'],
    'KillBufferCommandsClass': ['c', 'killBufferCommands'],
    'LeoApp': ['g', 'app'],
    'LeoFind': ['c', 'findCommands'],
    'LeoImportCommands': ['c', 'importCommands'],
    // 'MacroCommandsClass': ['c', 'macroCommands'],
    'PrintingController': ['c', 'printingController'],
    'RectangleCommandsClass': ['c', 'rectangleCommands'],
    'RstCommands': ['c', 'rstCommands'],
    'SpellCommandsClass': ['c', 'spellCommands'],
    'Undoer': ['c', 'undoer'],
    'VimCommands': ['c', 'vimCommands'],
};

export const g_language_pat = new RegExp(/^@language\s+(\w+)+/, 'm');
// Regex used by this module, and in leoColorizer.py.

// Patterns used only in this module...
export const g_is_directive_pattern = new RegExp(/^\s*@([\w-]+)\s*/);
// This pattern excludes @encoding.whatever and @encoding(whatever)
// It must allow @language python, @nocolor-node, etc.

export const g_noweb_root = new RegExp('<' + '<' + '*' + '>' + '>' + '=', 'm');
export const g_pos_pattern = new RegExp(/:(\d+),?(\d+)?,?([-\d]+)?,?(\d+)?$/);
export const g_tabwidth_pat = new RegExp(/(^@tabwidth)/, 'm');


export const tree_popup_handlers: ((...args: any[]) => any)[] = [];  // Set later.
export const user_dict: { [key: string]: any } = {}; // Non-persistent dictionary for free use

// Was set when creating leoGlobals instance in leoRun.py and in leoBridge.py
export const app: LeoApp = new LeoApp();

// Global status vars.
export let inScript: boolean = false; // A synonym for app.inScript
export let unitTesting: boolean = false; // A synonym for app.unitTesting.

/**
 * Define a file-like object for redirecting writes to a string.
 * The caller is responsible for handling newlines correctly.
 */
export class FileLikeObject {

    public encoding: string;
    public ptr: number;
    private _list: string[];

    constructor(encoding: string = 'utf-8', fromString?: string) {
        this.encoding = encoding || 'utf-8';
        this._list = splitLines(fromString);  // Must preserve newlines!
        this.ptr = 0;
    }

    public clear(): void {
        this._list = [];
    }

    public close(): void {
        // pass
    }

    public flush(): void {
        // pass
    }

    public get(): string {
        return this._list.join();
    }

    // Todo : maybe add names to prototype instead
    public getvalue(): string {
        return this.get();
    }

    public read(): string {
        return this.get();
    }

    /**
     * Read the next line using at.list and at.ptr.
     */
    public readline(): string {
        if (this.ptr < this._list.length) {
            const line: string = this._list[this.ptr];
            this.ptr++;
            return line;
        }
        return '';
    }

    public write(s: string): void {
        if (s) {
            this._list.push(s);
        }
    }


}

/**
 * Return < < s > >
 */
export function angleBrackets(s: string): string {
    const lt = "<<";
    const rt = ">>";
    return lt + s + rt;
}

/**
 * Return the caller name i levels up the stack.
 */
export function caller(i: number = 1): string {
    return callers(i + 1).split(',')[0];
}

/**
 * Return a string containing a comma-separated list of the callers
 * of the function that called callerList.
 *
 * excludeCaller: True (the default), callers itself is not on the list.
 *
 * If the `verbose` keyword is True, return a list separated by newlines.
 */
export function callers(n: number = 4, count: number = 0, excludeCaller: boolean = true, verbose: boolean = false): string {
    // Be careful to call _callerName with smaller values of i first:
    // sys._getframe throws ValueError if there are less than i entries.
    let result: string[] = [];
    let i: number = excludeCaller ? 3 : 2;
    while (1) {
        let s: string = _callerName(n = i, verbose = verbose);
        if (s) {
            result.push(s);
        }
        if (!s || result.length >= n) {
            break;
        }
        i += 1;
    }

    result.reverse();
    if (count > 0) {
        result = result.slice(0, count);
    }
    if (verbose) {
        return ''; //''.join([f"\n  {z}" for z in result]);
    }
    return result.join(',');
}

// TODO : see Error().stack to access names from the call stack
export function _callerName(n: number, verbose: boolean = false): string {
    return "<_callerName>";
}

/*
    About _callerName: see https://nodejs.org/api/errors.html#errors_error_stack

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
*/

/**
 * Return a result dict that is a copy of the keys dict
 * with missing items replaced by defaults in d dict.
 */
export function doKeywordArgs(keys: { [key: string]: any }, d: { [key: string]: any } = {}): { [key: string]: any } {
    if (d === null) {
        d = {}; // May be unnecessary
    }
    const result: { [key: string]: any } = {};

    for (var key in d) {
        if (d.hasOwnProperty(key)) {
            const default_val = d[key];

            const isBool: boolean = [true, false].includes(default_val);
            const val: any = keys.hasOwnProperty(key) ? keys[key] : null;

            if (isBool && [true, 'True', 'true'].includes(val)) {
                result[key] = true;
            } else if (isBool && [false, 'False', 'false'].includes(val)) {
                result[key] = false;
            } else if (val === null) {
                result[key] = default_val;
            } else {
                result[key] = val;
            }
        }
    }

    return result;
}

export const error = console.error;

export const es = console.log;

export function es_exception(): string {
    return '<no file>';
}

/*
    ### es_exception Old code
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
*/

/**
 * Print all non-keyword args, and put them to the log pane.
 * Python code was:
 *     pr(*args, **keys)
 *     es(*args, **keys)
 */
export const es_print = console.log;

/**
 * Return True if s starts with a directive.
 */
export function isDirective(s: string): boolean {

    const m: RegExpExecArray | null = g_is_directive_pattern.exec(s);
    if (m) {
        // This pattern excludes @encoding.whatever and @encoding(whatever)
        // It must allow @language python, @nocolor-node, etc.
        const s2: string = s.substring(m.index + m[0].length); // text from end of match #1 (the word after @)
        if (s2 && ".(".includes(s2.charAt(0))) {
            return false;
        }
        return globalDirectiveList.includes(m[1]);
    }
    return false;
}

/**
 * Return True if the body text contains the @ directive.
 */
export function is_special(s: string, directive: string): boolean {
    console.assert(s);

    return false;

}

/*
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
*/

/**
 * Return True if ch should be considered a letter.
 */
export function isWordChar(ch: string): boolean {
    return !!ch && (/^[0-9a-zA-Z]$/.test(ch) || ch === '_');
}

export function isWordChar1(ch: string): boolean {
    return !!ch && (/^[a-zA-Z]$/.test(ch) || ch === '_');
}

export function match(s: string, i: number, pattern: string): boolean {
    // Warning: this code makes no assumptions about what follows pattern.
    // Equivalent to original in python (only looks in specific substring)
    // return s and pattern and s.find(pattern, i, i + len(pattern)) == i
    return !!s && !!pattern && s.substring(i, i + pattern.length + 1).search(pattern) === 0;
}

export function match_word(s: string, i: number, pattern: string): boolean {
    const pat = new RegExp("\\b" + pattern + "\\b");
    return s.substring(i).search(pat) >= 0;
}

/**
 * Split s into lines, preserving the number of lines and the endings
 * of all lines, including the last line.
 */
export function splitLines(s?: string): string[] {
    if (s) {
        return s.split(/\r?\n/);
    } else {
        return [];
    }
}


