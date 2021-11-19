
/**
 * Global constants, variables and utility functions used throughout Leo.
 * Important: This module imports no other Leo module.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LeoApp } from './leoApp';
import { Commands } from './leoCommands';
import { Position, VNode } from './leoNodes';

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
    'unit', 'verbose', 'wrap'
];

export let directives_pat: any = null;  // Set below.

/*
  The cmd_instance_dict supports per-class @cmd decorators. For example, the
  following appears in leo.commands.

      def cmd(name):
          """Command decorator for the abbrevCommands class."""
          return g.new_cmd_decorator(name, ['c', 'abbrevCommands',])

  For commands based on functions, use the @g.command decorator.
*/

export let global_commands_dict: {
    [key: string]: (...args: any[]) => any &
    { __doc__: string } &
    { __func_name__: string } &
    { __name__: string } &
    { __ivars__: string[] }
};

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
    'VimCommands': ['c', 'vimCommands']
};

// * Other Decorators used in leojs are in /src/core/decorators.ts

/**
 * Return the instance of c given by ivars.
 * ivars is a list of strings.
 * A special case: ivars may be 'g', indicating the leoGlobals module.
 */
export function ivars2instance(c: Commands, g: any, ivars: string[]): any {

    if (!ivars || !ivars.length) {
        g.trace('can not happen: no ivars');
        return undefined;
    }

    let ivar: string = ivars[0]; // first

    if (!['c', 'g'].includes(ivar)) {
        g.trace('can not happen: unknown base', ivar)
        return undefined;
    }

    let obj: any = ivar === 'c' ? c : g;

    // Dig in object 
    for (let ivar of ivars.slice(1)) {
        obj = obj[ivar];
        if (!obj) {
            g.trace('can not happen: unknown attribute', obj, ivar, ivars);
            break;
        }
    }
    return obj;
}
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

export let unicode_warnings: { [key: string]: any } = {};  // Keys are callers.

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
        let s: string = _callerName(i, verbose);
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
    // if (verbose) {
    // return ''; //''.join([f"\n  {z}" for z in result]);
    // }
    return result.join(',');
}

export function _callerName(n: number, verbose: boolean = false): string {
    // TODO : see Error().stack to access names from the call stack
    // return Error.stack.split()[n]; // or something close to that
    return "<_callerName>";
}

// Very useful for tracing.

export function get_line(s: string, i: number): string {
    let nl = "";
    if (is_nl(s, i)) {
        i = skip_nl(s, i);
        nl = "[nl]";
    }
    const j: number = find_line_start(s, i);
    const k: number = skip_to_end_of_line(s, i);
    return nl + s.substring(j, k)
}

// Important: getLine is a completely different function.
// getLine = get_line
export const getLine = get_line;

export function get_line_after(s: string, i: number): string {
    let nl = "";
    if (is_nl(s, i)) {
        i = skip_nl(s, i);
        nl = "[nl]";
    }
    const k: number = skip_to_end_of_line(s, i);
    return nl + s.substring(i, k);
}

// getLineAfter = get_line_after
export const getLineAfter = get_line_after;

/**
 * Pretty print any array / python list to string
 * TODO : Temporary json stringify
 */
export function listToString(obj: any): string {
    return JSON.stringify(obj, undefined, 4);
}

/**
 * Pretty print any Python object to a string.
 * TODO : Temporary json stringify
 */
export function objToString(obj: any, indent = '', printCaller = false, tag = null): string {
    return JSON.stringify(obj);

    // # pylint: disable=undefined-loop-variable
    //     # Looks like a a pylint bug.
    // #
    // # Compute s.
    // if isinstance(obj, dict):
    //     s = dictToString(obj, indent=indent)
    // elif isinstance(obj, list):
    //     s = listToString(obj, indent=indent)
    // elif isinstance(obj, tuple):
    //     s = tupleToString(obj, indent=indent)
    // elif isinstance(obj, str):
    //     # Print multi-line strings as lists.
    //     s = obj
    //     lines = splitLines(s)
    //     if len(lines) > 1:
    //         s = listToString(lines, indent=indent)
    //     else:
    //         s = repr(s)
    // else:
    //     s = repr(obj)
    // #
    // # Compute the return value.
    // if printCaller and tag:
    //     prefix = f"{caller()}: {tag}"
    // elif printCaller or tag:
    //     prefix = caller() if printCaller else tag
    // else:
    //     prefix = None
    // if prefix:
    //     sep = '\n' if '\n' in s else ' '
    //     return f"{prefix}:{sep}{s}"
    // return s

}

/**
 * Pretty print any Python object using pr.
 */
export function printObj(obj: any, indent = '', printCaller = false, tag = null): void {
    // TODO : Replace with output to proper pr function
    //     pr(objToString(obj, indent=indent, printCaller=printCaller, tag=tag))
    pr(obj);
}

// The caller passes [root_node] or None as the second arg.
// This allows us to distinguish between None and [None].

/**
 *  Scan p for Leo directives found in globalDirectiveList.
 *
 * Returns a dict containing the stripped remainder of the line
 * following the first occurrence of each recognized directive
 */
export function get_directives_dict(p: Position, root?: Position[]): any {

    let d: any = {};
    // #1688:    legacy: Always compute the pattern.
    //           g.directives_pat is updated whenever loading a plugin.
    //
    // The headline has higher precedence because it is more visible.
    let m: any;
    for (let s of [p.h, p.b]) {

        while ((m = directives_pat.exec(s)) !== null) {
            const word: string = m[1].trim();

            const i: number = m.indices[1][0];
            if (d[word]) {
                continue;
            }
            const j: number = i + word.length;
            if (j < s.length && !(' \t\n'.includes(s.charAt(j)))) {
                continue;
            }

            // Not a valid directive: just ignore it.
            // A unit test tests that @path:any is invalid.
            const k: number = skip_line(s, j);
            const val: string = s.slice(j, k).trim();
            d[word] = val;
        }
    }

    if (root && root.length) {
        const root_node: Position = root[0];
        //anIter = g_noweb_root.exec(p.b);
        // for (let m of anIter) {
        while ((m = g_noweb_root.exec(p.b)) !== null) {
            if (root_node && root_node.__bool__()) {
                d["root"] = 0;  // value not important
            } else {
                es(`${angleBrackets("*")} may only occur in a topmost node (i.e., without a parent)`);
            }
            break;
        }
    }

    return d;
}
/**
 * Scans p and all its ancestors for directives.
 *
 * Returns a list of dicts containing pointers to
 * the start of each directive
 */
export function get_directives_dict_list(p: Position): any[] {
    const result: any = [];
    const p1: Position = p.copy();
    for (let p of p1.self_and_parents(false)) {
        const root: Position[] | undefined = p.hasParent() ? undefined : [p];
        // No copy necessary: g.get_directives_dict does not change p.
        result.push(get_directives_dict(p, root));
    }
    return result;
}
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
 * Scan aList for '@tabwidth' directives.
 */
export function scanAtTabwidthDirectives(aList: any[], issue_error_flag = false): number | undefined {

    for (let d of aList) {
        const s: string = d['tabwidth'];
        if (s || s === "") {
            const w_skip_long = skip_long(s, 0);
            const val: number | undefined = w_skip_long[1];

            if (val) {
                return val;
            }
            if (issue_error_flag && !unitTesting) {
                error("ignoring @tabwidth", s);
            }
        }
    }
    return undefined;
}

/**
 * Scan p and all ancestors looking for '@tabwidth' directives.
 */
export function scanAllAtTabWidthDirectives(c: Commands, p: Position): number | undefined {
    let ret: number | undefined;
    if (c && p && p.__bool__()) {
        const aList: any[] = get_directives_dict_list(p);
        let val: number | undefined = scanAtTabwidthDirectives(aList);
        ret = val === undefined ? c.tab_width : val;
    } else {
        ret = undefined;
    }
    return ret;
}
/**
 * Init/update g.directives_pat
 */
export function update_directives_pat(): void {

    // global globalDirectiveList, directives_pat
    // Use a pattern that guarantees word matches.

    const aList: string[] = [];

    // aList = [
    //     fr"\b{z}\b" for z in globalDirectiveList if z != 'others'
    // ]


    // The metacharacter \b is an anchor like the caret and the dollar sign.
    // It matches at “word boundary” positions. This match is zero-length.
    for (let z of globalDirectiveList) {
        if (z !== 'others') {
            aList.push("\\b" + z + "\\b");
        }
    }

    // pat = "^@(%s)" % "|".join(aList)
    const pat: string = "^@(" + aList.join("|") + ")";

    // directives_pat = re.compile(pat, re.MULTILINE)
    directives_pat = new RegExp(pat, 'mdg');
}
// #1688: Initialize g.directives_pat
update_directives_pat();
/**
 * Return the base name of a path.
 */
export function shortFileName(fileName: string): string {
    //  return os.path.basename(fileName) if fileName else ''
    return fileName ? path.basename(fileName) : '';

}

export const shortFilename = shortFileName;

/**
  * Return the index in s of the start of the line containing s[i].
 */
export function find_line_start(s: string, p_i: number): number {
    if (p_i < 0) {
        return 0;  // New in Leo 4.4.5: add this defensive code.
    }
    // bug fix: 11/2/02: change i to i+1 in rfind
    const i: number = s.lastIndexOf('\n', p_i + 1);  // Finds the highest index in the range.
    if (i === -1) {
        return 0;
    } else {
        return i + 1;
    }
    //# if i == -1: return 0
    //# else: return i + 1
}
export function is_nl(s: string, i: number): boolean {
    return (i < s.length) && (s.charAt(i) === '\n' || s.charAt(i) === '\r');
}

export function isDigit(s: string): boolean {
    return (s >= '0' && s <= '9');
};
/**
 * Return non-negative number if the body text contains the @ directive.
 */
export function is_special(s: string, directive: string): number {
    console.assert(directive && directive.substring(0, 1) === '@');
    // Most directives must start the line.
    const lws: boolean = ["@others", "@all"].includes(directive);
    const pattern = lws ? new RegExp("^\\s*(" + directive + "\\b)", 'm') : new RegExp("^(" + directive + "\\b)", 'm');

    const m = pattern.exec(s);

    if (m) {
        // javascript returns index including spaces before the match after newline
        return m.index + m[0].length - m[1].length;
    }
    return -1;
}

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
    // TODO : This is weak lacks performance. Solidify this method!
    const pat = new RegExp(pattern + "\\b");
    return s.substring(i).search(pat) === 0;
}

/**
 * We need this function because different systems have different end-of-line conventions.
 * Skips a single "logical" end-of-line character.
 */
export function skip_nl(s: string, i: number): number {
    if (match(s, i, "\r\n")) {
        return i + 2;
    }
    if (match(s, i, '\n') || match(s, i, '\r')) {
        return i + 1;
    }
    return i;
}

/* These methods skip to the next newline, regardless of whether the
newline may be preceeded by a backslash. Consequently, they should be
used only when we know that we are not in a preprocessor directive or
string.
*/

export function skip_line(s: string, i: number): number {
    if (i >= s.length) {
        return s.length;
    }
    if (i < 0) {
        i = 0;
    }
    i = s.indexOf('\n', i)
    if (i === -1) {
        return s.length;
    }
    return i + 1;
}

export function skip_to_end_of_line(s: string, i: number): number {
    if (i >= s.length) {
        return s.length;
    }
    if (i < 0) {
        i = 0;
    }
    i = s.indexOf('\n', i)
    if (i === -1) {
        return s.length;
    }
    return i;
}

export function skip_to_start_of_line(s: string, i: number): number {
    if (i >= s.length) {
        return s.length;
    }
    if (i <= 0) {
        return 0;
    }
    // Don't find s[i], so it doesn't matter if s[i] is a newline.
    i = s.lastIndexOf('\n', i)
    if (i === -1) {
        return 0;
    }
    return i + 1;
}

/**
 * Returns object instead of original python tuple
 */
export function skip_to_char(s: string, i: number, ch: string): { position: number; result: string; } {
    const j: number = s.indexOf(ch, i);
    if (j === -1) {
        return {
            position: s.length,
            result: s.substring(i)
        };
    }
    return {
        position: j,
        result: s.substring(i, j)
    };
}

export function skip_id(s: string, i: number, chars: string | null = null): number {
    chars = chars ? chars.toString() : '';
    const n = s.length;
    while (i < n && (isWordChar(s.charAt(i)) || chars.indexOf(s.charAt(i)) >= 0)) {
        i += 1;
    }
    return i;
}

/**
 * Scan s[i:] for a valid int.
 * Return (i, val) or (i, None) if s[i] does not point at a number.
 */
export function skip_long(s: string, i: number): [number, number | undefined] {
    let val: number = 0;
    i = skip_ws(s, i);
    let n: number = s.length;
    if (i >= n || (!isDigit(s.charAt(i)) && !'+-'.includes(s.charAt(i)))) {
        return [i, undefined];
    }
    let j: number = i;
    if ('+-'.includes(s.charAt(i))) {  // Allow sign before the first digit
        i += 1;
    }
    while (i < n && isDigit(s.charAt(i))) {
        i += 1;
    }
    try { // There may be no digits.
        val = Number(s.slice(j, i));
        return [i, val];
    }
    catch (err: any) {
        return [i, undefined];
    }
}
export function skip_ws(s: string, i: number): number {
    const n: number = s.length;
    while (i < n && ('\t '.indexOf(s.charAt(i)) >= 0)) {
        i += 1;
    }
    return i;
}

export function skip_ws_and_nl(s: string, i: number): number {
    const n: number = s.length;
    while (i < n && (' \t\n\r'.indexOf(s.charAt(i)))) {
        i += 1;
    }
    return i;
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

/**
 * Convert bytes to unicode if necessary.
 */
export function toUnicode(s: any, encoding: string | null = null, reportErrors = false): string {
    // TODO : SEE g.toEncodedString.

    // ORIGINAL
    // if isinstance(s, str):
    //     return s
    // tag = 'g.toUnicode'
    // if not isinstance(s, bytes):
    //     if callers() not in unicode_warnings:
    //         unicode_warnings[callers] = True
    //         error(f"{tag}: unexpected argument of type {s.__class__.__name__}")
    //         trace(callers())
    //     return ''
    // if not encoding:
    //     encoding = 'utf-8'
    // try:
    //     s = s.decode(encoding, 'strict')
    // except(UnicodeDecodeError, UnicodeError):
    //     # https://wiki.python.org/moin/UnicodeDecodeError
    //     s = s.decode(encoding, 'replace')
    //     if reportErrors:
    //         error(f"{tag}: unicode error. encoding: {encoding!r}, s:\n{s!r}")
    //         trace(callers())
    // except Exception:
    //     es_exception()
    //     error(f"{tag}: unexpected error! encoding: {encoding!r}, s:\n{s!r}")
    //     trace(callers())
    // return s

    return s; // Skip for now
}

export function dummy_act_on_node(c: Commands, p: Position): any {
    // pass
}
// This dummy definition keeps pylint happy.
//# Plugins can change this.

export let act_on_node = dummy_act_on_node;

export const childrenModifiedSet: VNode[] = [];
export const contentModifiedSet: VNode[] = [];
/**
 * This global function calls a hook routine. Hooks are identified by the
 * tag param.
 * 
 * Returns the value returned by the hook routine, or None if the there is
 * an exception.
 * 
 * We look for a hook routine in three places:
 * 1. c.hookFunction
 * 2. app.hookFunction
 * 3. leoPlugins.doPlugins()
 * 
 * Set app.hookError on all exceptions.
 * Scripts may reset app.hookError to try again.
 */
export function doHook(tag: string, paramDict?: any): any {
    // TODO !
    /*
    if g.app.killed or g.app.hookError:
        return None
    if args:
        # A minor error in Leo's core.
        g.pr(f"***ignoring args param.  tag = {tag}")
    if not g.app.config.use_plugins:
        if tag in ('open0', 'start1'):
            g.warning("Plugins disabled: use_plugins is 0 in a leoSettings.leo file.")
        return None
    # Get the hook handler function.  Usually this is doPlugins.
    c = keywords.get("c")
    # pylint: disable=consider-using-ternary
    f = (c and c.hookFunction) or g.app.hookFunction
    if not f:
        g.app.hookFunction = f = g.app.pluginsController.doPlugins
    try:
        # Pass the hook to the hook handler.
        # g.pr('doHook',f.__name__,keywords.get('c'))
        return f(tag, keywords)
    except Exception:
        g.es_exception()
        g.app.hookError = True  # Supress this function.
        g.app.idle_time_hooks_enabled = False
        return None
    */
    return undefined;
}
// Important: we can not define g.pc here!

/*
def loadOnePlugin(pluginName, verbose=False):
    pc = g.app.pluginsController
    return pc.loadOnePlugin(pluginName, verbose=verbose)

def registerExclusiveHandler(tags, fn):
    pc = g.app.pluginsController
    return pc.registerExclusiveHandler(tags, fn)

def registerHandler(tags, fn):
    pc = g.app.pluginsController
    return pc.registerHandler(tags, fn)

def plugin_signon(module_name, verbose=False):
    pc = g.app.pluginsController
    return pc.plugin_signon(module_name, verbose)

def unloadOnePlugin(moduleOrFileName, verbose=False):
    pc = g.app.pluginsController
    return pc.unloadOnePlugin(moduleOrFileName, verbose)

def unregisterHandler(tags, fn):
    pc = g.app.pluginsController
    return pc.unregisterHandler(tags, fn)

*/
/*
def getHandlersForTag(tags):
    pc = g.app.pluginsController
    return pc.getHandlersForTag(tags)

def getLoadedPlugins():
    pc = g.app.pluginsController
    return pc.getLoadedPlugins()

def getPluginModule(moduleName):
    pc = g.app.pluginsController
    return pc.getPluginModule(moduleName)

def pluginIsLoaded(fn):
    pc = g.app.pluginsController
    return pc.isLoaded(fn)
*/

/**
 * Return < < s > >
 */
export function angleBrackets(s: string): string {
    const lt = "<<";
    const rt = ">>";
    return lt + s + rt;
}

/**
 * Convert unicode string to an encoded string.
 */
export function toEncodedString(s: any, encoding = 'utf-8', reportErrors = false): string {
    if ((typeof s) !== "string") {
        return s;
    }
    // TODO : TEST AND CHECK IF MORE THAN utf-8 IS NEEDED
    // use atob() for ascii to base 64, or other functionality for more encodings
    // (other examples)
    //     btoa(unescape(encodeURIComponent(str))))
    //     decodeURIComponent(JSON.parse('"' + s.replace('"', '\\"') + '"'));
    // OTHER EXAMPLES
    // str.replace(/[^\0-~]/g, function(ch) {
    //     return "\\u" + ("000" + ch.charCodeAt().toString(16)).slice(-4);
    // });

    // ORIGINAL
    // * These are the only significant calls to s.encode in Leo.
    // try:
    //     s = s.encode(encoding, "strict")
    // except UnicodeError:
    //     s = s.encode(encoding, "replace")
    //     if reportErrors:
    //         error(f"Error converting {s} from unicode to {encoding} encoding")

    return s; // skip for now
}

// TODO : Replace with output to proper 'Leo log pane'
export const es = console.log;

export function es_exception(p_error: any, c?: Commands): string {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

    // p_error = JSON.stringify(p_error, getCircularReplacer());
    console.log('es_exception called with error: ', p_error);
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
 * TODO : This is a temporary console output
 * Print all non-keyword args, and put them to the log pane.
 * Python code was:
 *     pr(*args, **keys)
 *     es(*args, **keys)
 */
export const es_print = console.log;

// TODO : Replace with proper method
export const blue = console.log;
export const error = console.log;
export const note = console.log;
export const red = console.log;
export const warning = console.warn;

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

/**
 * Print all non-keyword args.
 */
export const pr = console.log;
// TODO : Replace with output to proper 'Leo terminal output'
// def pr(*args, **keys):
//     """ Print all non-keyword args."""
//     result = []
//     for arg in args:
//         if isinstance(arg, str):
//             result.append(arg)
//         else:
//             result.append(repr(arg))
//     print(','.join(result))

/**
 * Print a tracing message
 */
export const trace = console.log;
// TODO : Replace with output to proper 'Leo terminal output'

/**
 * Return "s" or "" depending on n.
 */
export function plural(obj: any): string {
    let n: number;
    if (Array.isArray(obj) || ((typeof obj) === "string")) {
        n = obj.length;
    } else if ((typeof obj) === "object") {
        n = Object.keys(obj).length;
    } else {
        n = obj;
    }
    return n === 1 ? '' : "s";
}

/**
 * Return the expansion of the selected text of node p.
 * Return the expansion of all of node p's body text if
 * p is not the current node or if there is no text selection.
 */
export function getScript(c: Commands, p: Position,
    useSelectedText: boolean = true,
    forcePythonSentinels: boolean = true,
    useSentinels: boolean = true
): string {
    console.log("get script called");
    return "";
}

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

export function isTextWidget(w: any): boolean {
    return !!app && !!app.gui && app.gui.isTextWidget && app.gui.isTextWidget(w);
}
export function isTextWrapper(w: any): boolean {
    return !!app && !!app.gui && app.gui.isTextWrapper && app.gui.isTextWrapper(w);
}

