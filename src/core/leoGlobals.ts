//@+leo-ver=5-thin
//@+node:felix.20210102012410.1: * @file src/core/leoGlobals.ts
/**
 * Global constants, variables and utility functions used throughout Leo.
 * Important: This module imports no other Leo module.
 */
//@+<< imports >>
//@+node:felix.20210102181122.1: ** << imports >> (leoGlobals)
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { LeoApp } from './leoApp';
import { Commands } from './leoCommands';
import { Position, VNode } from './leoNodes';

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

//@-<< imports >>

export const isMac: boolean = process.platform.startsWith('darwin');
export const isWindows: boolean = process.platform.startsWith('win');

//@+<< define g.globalDirectiveList >>
//@+node:felix.20210102180402.1: ** << define g.globalDirectiveList >>
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

//@-<< define g.globalDirectiveList >>
//@+<< define global decorator dicts >>
//@+node:felix.20210102180405.1: ** << define global decorator dicts >> (leoGlobals.py)
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

//@-<< define global decorator dicts >>
//@+<< define g.Decorators >>
//@+node:felix.20211102223300.1: ** << define g.Decorators >>
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
        g.trace('can not happen: unknown base', ivar);
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
//@-<< define g.Decorators >>
//@+<< define regex's >>
//@+node:felix.20210102180413.1: ** << define regex's >>
export const g_language_pat = new RegExp(/^@language\s+(\w+)+/, 'm');
// Regex used by this module, and in leoColorizer.py.

// Patterns used only in this module...
export const g_is_directive_pattern = new RegExp(/^\s*@([\w-]+)\s*/);
// This pattern excludes @encoding.whatever and @encoding(whatever)
// It must allow @language python, @nocolor-node, etc.

export const g_noweb_root = new RegExp('<' + '<' + '*' + '>' + '>' + '=', 'm');
export const g_pos_pattern = new RegExp(/:(\d+),?(\d+)?,?([-\d]+)?,?(\d+)?$/);
export const g_tabwidth_pat = new RegExp(/(^@tabwidth)/, 'm');

//@-<< define regex's >>

export const tree_popup_handlers: ((...args: any[]) => any)[] = [];  // Set later.
export const user_dict: { [key: string]: any } = {}; // Non-persistent dictionary for free use

// Was set when creating leoGlobals instance in leoRun.py and in leoBridge.py
export const app: LeoApp = new LeoApp();

// Global status vars.
export let inScript: boolean = false; // A synonym for app.inScript
export let unitTesting: boolean = false; // A synonym for app.unitTesting.

export let unicode_warnings: { [key: string]: any } = {};  // Keys are callers.

//@+others
//@+node:felix.20211104210703.1: ** g.Debugging, GC, Stats & Timing
//@+node:felix.20211205233429.1: *3* g._assert
/**
 * * A safer alternative to a bare assert.
 */
export function _assert(condition: any, show_callers: boolean = true): boolean {
    if (unitTesting) {
        console.assert(condition);
        return true;
    }
    const ok: boolean = Boolean(condition);
    if (ok) {
        return true;
    }
    es_print('\n===== g._assert failed =====\n');
    if (show_callers) {
        es_print(callers());
    }
    return false;
}
//@+node:felix.20211104212328.1: *3* g.caller
/**
 * Return the caller name i levels up the stack.
 */
export function caller(i: number = 1): string {
    return callers(i + 1).split(',')[0];
}

//@+node:felix.20211104212426.1: *3* g.callers
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

//@+node:felix.20211104212435.1: *3* g._callerName
export function _callerName(n: number, verbose: boolean = false): string {
    // TODO : see Error().stack to access names from the call stack
    // return Error.stack.split()[n]; // or something close to that
    return "<_callerName>";
}

//@+node:felix.20211104220458.1: *3* g.get_line & get_line__after
// Very useful for tracing.

export function get_line(s: string, i: number): string {
    let nl = "";
    if (is_nl(s, i)) {
        i = skip_nl(s, i);
        nl = "[nl]";
    }
    const j: number = find_line_start(s, i);
    const k: number = skip_to_end_of_line(s, i);
    return nl + s.substring(j, k);
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

//@+node:felix.20211104221354.1: *3* g.listToString     (coreGlobals.py)
/**
 * Pretty print any array / python list to string
 * TODO : Temporary json stringify
 */
export function listToString(obj: any): string {
    return JSON.stringify(obj, undefined, 4);
}

//@+node:felix.20211104221420.1: *3* g.objToSTring     (coreGlobals.py)
/**
 * Pretty print any Python object to a string.
 * TODO : Temporary json stringify
 */
export function objToString(obj: any, indent = '', printCaller = false, tag = null): string {

    let result: string = "";
    result = obj.toString();
    // let cache: any[] = [];
    // result = JSON.stringify(obj, function (key, value) {
    //     if (typeof value === 'object' && value !== null) {
    //         if (cache!.indexOf(value) !== -1) {
    //             // Circular reference found, discard key
    //             return;
    //         }
    //         // Store value in our collection
    //         cache!.push(value);
    //     }
    //     return value;
    // });
    // cache = null; // Enable garbage collection
    return result;
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

//@+node:felix.20211104221444.1: *3* g.printObj        (coreGlobals.py)
/**
 * Pretty print any Python object using pr.
 */
export function printObj(obj: any, indent = '', printCaller = false, tag = null): void {
    // TODO : Replace with output to proper pr function
    //     pr(objToString(obj, indent=indent, printCaller=printCaller, tag=tag))
    pr(obj);
}

//@+node:felix.20211104210724.1: ** g.Directives
//@+node:felix.20220111004937.1: *3* g.findAllValidLanguageDirectives
/**
 * Return list of all valid @language directives in p.b
 */
export function findAllValidLanguageDirectives(s: string): string[] {

    if (!s.trim()){
        return [];
    }
    const languages: string[] = [];
    let m: any;
    while (m = g_language_pat.exec(s)) {
            const language: string = m[1];
        if (isValidLanguage(language)){
            languages.push(language);
        }
    }
    return languages.sort();
}
//@+node:felix.20211104213229.1: *3* g.get_directives_dict (must be fast)
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
//@+node:felix.20211104213315.1: *3* g.get_directives_dict_list (must be fast)
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
//@+node:felix.20220110224107.1: *3* g.getLanguageFromAncestorAtFileNode
/**
 * Return the language in effect at node p.
 *
 * 1. Use an unambiguous @language directive in p itself.
 * 2. Search p's "extended parents" for an @<file> node.
 * 3. Search p's "extended parents" for an unambiguous @language directive.
 */
export function getLanguageFromAncestorAtFileNode(p: Position): string| undefined {

    const v0: VNode = p.v;

    // The same generator as in v.setAllAncestorAtFileNodesDirty.
    // Original idea by Виталије Милошевић (Vitalije Milosevic).
    // Modified by EKR.
    let seen: VNode[] = [];

    function* v_and_parents(v: VNode): Generator<VNode> {
        if(seen.indexOf(v) < 0){
            seen.push(v); // not found, add it
        }else {
            return;
        }
        yield v;
        for (let parent_v of v.parents){
            if (seen.indexOf(parent_v) < 0){
                yield* v_and_parents(parent_v); // was  not found
            }
        }
    }
    /**
     * A helper for all searches.
     * Phase one searches only @<file> nodes.
     */
    function find_language(v: VNode, phase: number): string|undefined {

        if (phase === 1 && !v.isAnyAtFileNode()){
            return undefined;
        }
        let w_language: string;
        // #1693: Scan v.b for an *unambiguous* @language directive.
        const languages: string[] = findAllValidLanguageDirectives(v.b);
        if (languages.length === 1){ // An unambiguous language
            return languages[0];
        }
        let name: string;
        let junk: string;
        let ext: string;
        if(v.isAnyAtFileNode()){
            // Use the file's extension.
            name = v.anyAtFileNodeName();
            [junk, ext] = os_path_splitext(name);
            ext = ext.slice(1);  // strip the leading period.
            w_language = app.extension_dict[ext];

            if (isValidLanguage(w_language)){
                return w_language;
            }
        }
        return undefined;
    }

    // First, see if p contains any @language directive.
    let language = findFirstValidAtLanguageDirective(p.b);
    if (language){
        return language;
    }
    // Phase 1: search only @<file> nodes: #2308.
    // Phase 2: search all nodes.
    for (let phase of [1, 2]){
        // Search direct parents.
        for (let p2 of p.self_and_parents(false)){
            language = find_language(p2.v, phase);
            if (language){
                return language;
            }
        }
        // Search all extended parents.
        seen = [v0.context.hiddenRootNode];
        for (let v of v_and_parents(v0)){
            language = find_language(v, phase);
            if (language){
                return language;
            }
        }
    }
    return undefined;
}
//@+node:felix.20220110224044.1: *3* g.getLanguageFromPosition
/**
 * Return the language in effect at position p.
 * This is always a lowercase language name, never None.
 */
export function getLanguageAtPosition(c: Commands, p: Position): string {

    const aList: string[] = get_directives_dict_list(p);
    const d: {[key: string]: string} = scanAtCommentAndAtLanguageDirectives(aList);
    let language: string = d && d['language'] ||
        getLanguageFromAncestorAtFileNode(p) ||
        c.config.getString('target-language') ||
        'python';

    return language.toLowerCase();
}
//@+node:felix.20211104213330.1: *3* g.isDirective
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

//@+node:felix.20220110224137.1: *3* g.scanAtCommentAndLanguageDirectives
/**
 * Scan aList for @comment and @language directives.
 * @comment should follow @language if both appear in the same node.
 */
export function scanAtCommentAndAtLanguageDirectives(aList: any[]): any {

    let lang: any = undefined;
    for (let d of aList){
        const comment = d['comment'];
        const language = d['language'];
        // Important: assume @comment follows @language.
        let delim1: string|undefined;
        let delim2: string|undefined;
        let delim3: string|undefined;
        if (language){
            [lang, delim1, delim2, delim3] = set_language(language, 0);
        }
        if (comment){
            [delim1, delim2, delim3] = set_delims_from_string(comment);
        }
        if (comment || language){
            const delims: [string, string, string] = [delim1!, delim2!, delim3!];
            const w_d = {'language': lang, 'comment': comment, 'delims': delims};
            return w_d;
        }
    }
    return undefined;
}
//@+node:felix.20211104225158.1: *3* g.scanAtTabwidthDirectives & scanAllTabWidthDirectives
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
//@+node:felix.20220110202727.1: *3* g.set_delims_from_language
/**
 * Return a tuple (single,start,end) of comment delims.
 */
export function set_delims_from_language(language: string): [string, string, string]  {

    const val = app.language_delims_dict[language];
    let delim1: string|undefined;
    let delim2: string|undefined;
    let delim3: string|undefined;
    if (val){
        [delim1, delim2, delim3] = set_delims_from_string(val);
        if (delim2 && !delim3){
            return ['', delim1!, delim2];
        // 0,1 or 3 params.
        }
        return [delim1!, delim2!, delim3!];
    }
    return ['', '', ''];
        // Indicate that no change should be made
}
//@+node:felix.20220110202842.1: *3* g.set_delims_from_string
/**
 * Return (delim1, delim2, delim2), the delims following the @comment
 * directive.
 *
 * This code can be called from @language logic, in which case s can
 * point at @comment
 */
export function set_delims_from_string(s: string): [string, string, string]|[undefined, undefined, undefined] {

    // Skip an optional @comment
    const tag:string = "@comment";
    let i: number = 0;
    let j: number;

    if( match_word(s, i, tag)){
        i += tag.length;
    }

    let count: number = 0;
    const delims: [string, string, string] = ['', '', ''];

    while( count < 3 && i < s.length){
        i = skip_ws(s, i);
        j = i;
        while (i < s.length && !is_ws(s[i]) && !is_nl(s, i)){
            i += 1;
        }
        if (j === i){
            break;
        }
        delims[count] = s.slice(j,i) || '';
        count += 1;
    }

    // 'rr 09/25/02
    if (count === 2) { // delims[0] is always the single-line delim.
        delims[2] = delims[1];
        delims[1] = delims[0];
        delims[0] = '';
    }

    for (let i of [0, 1, 2]){
        if (delims[i]){
            if (delims[i].startsWith("@0x")){
                // Allow delimiter definition as @0x + hexadecimal encoded delimiter
                // to avoid problems with duplicate delimiters on the @comment line.
                // If used, whole delimiter must be encoded.
                if (delims[i].length === 3){
                    warning(`'${delims[i]}' delimiter is invalid`);
                    return [undefined, undefined, undefined];
                }
                try {
                    // ! TEST THIS !
                    // delims[i] = binascii.unhexlify(delims[i].splice(3)); // type:ignore
                    delims[i] = String.fromCharCode( parseInt(delims[i].slice(3), 16) );
                    delims[i] = toUnicode(delims[i]);
                }
                catch (e){
                    warning(`'${delims[i]}' delimiter is invalid: ${e}`);
                    return [undefined, undefined, undefined];
                }
            }else{
                // 7/8/02: The "REM hack": replace underscores by blanks.
                // 9/25/02: The "perlpod hack": replace double underscores by newlines.
                delims[i] = delims[i].split("__").join('\n');
                delims[i] = delims[i].split('_').join(' ');
            }
        }
    }

    return [delims[0], delims[1], delims[2]];
}
//@+node:felix.20220110231927.1: *3* g.set_language
/**
 * Scan the @language directive that appears at s[i:].
 *
 * The @language may have been stripped away.
 *
 * Returns (language, delim1, delim2, delim3)
 */
export function set_language(s: string, i: number, issue_errors_flag?:boolean):
    [string, string, string, string] | [undefined, undefined, undefined, undefined] {
    let j: number;
    const tag: string = "@language";
    console.assert( i !== undefined );

    if (match_word(s, i, tag)){
        i += tag.length;
    }
    // Get the argument.
    i = skip_ws(s, i);
    j = i;
    i = skip_c_id(s, i);
    // Allow tcl/tk.
    const arg:string = s.slice(j,i).toLowerCase();

    let delim1: string;
    let delim2: string;
    let delim3: string;
    if (app.language_delims_dict[arg]){
        let language = arg;
        [delim1, delim2, delim3] = set_delims_from_language(language);
        return [language, delim1, delim2, delim3];
    }
    if (issue_errors_flag){
        es("ignoring:", get_line(s, i));
    }
    return [undefined, undefined, undefined, undefined];
}
//@+node:felix.20220102155326.1: *3* g.stripPathCruft
/**
 * Strip cruft from a path name.
 */
export function stripPathCruft(p_path: string): string {

    if (!p_path) {
        return p_path;   // Retain empty paths for warnings.
    }
    if (p_path.length > 2 && (
        (p_path[0] === '<' && p_path[p_path.length - 1] === '>') ||
        (p_path[0] === '"' && p_path[p_path.length - 1] === '"') ||
        (p_path[0] === "'" && p_path[p_path.length - 1] === "'")
    )) {
        p_path = p_path.substring(1, p_path.length - 1).trim();
    }
    // We want a *relative* path, not an absolute path.
    return p_path;
}
//@+node:felix.20211104233842.1: *3* g.update_directives_pat (new)
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
//@+node:felix.20211104210746.1: ** g.Files & Directories
//@+node:felix.20220108221428.1: *3* g.chdir
export function chdir(p_path: string): void {
    if (!os_path_isdir(p_path)){
        p_path = os_path_dirname(p_path);
    }
    if( os_path_isdir(p_path) && os_path_exists(p_path)){
        process.chdir(p_path);
    }
}
//@+node:felix.20220108215158.1: *3* g.defaultLeoFileExtension
export function defaultLeoFileExtension(c?: Commands): string {
    const conf = c ? c.config : app.config;
    return conf.getString('default-leo-extension') || '.leo';
}
//@+node:felix.20220108220012.1: *3* g.ensure_extension
export function ensure_extension(name: string, ext: string): string {

    let theFile: string;
    let old_ext: string;

    [theFile, old_ext] = os_path_splitext(name);
    if (!name){
        return name; // don't add to an empty name.
    }
    if(  ['.db', '.leo'].includes(old_ext)){
        return name;
    }
    if (old_ext && old_ext === ext){
        return name;
    }

    return name + ext;
}
//@+node:felix.20211228213652.1: *3* g.fullPath
/**
 * Return the full path (including fileName) in effect at p. Neither the
 * path nor the fileName will be created if it does not exist.
 */
export function fullPath(c: Commands, p_p: Position, simulate: boolean = false): string {
    // Search p and p's parents.
    for (let p of p_p.self_and_parents(false)) {
        const aList: any[] = get_directives_dict_list(p);
        const w_path: string = c.scanAtPathDirectives(aList);
        let fn: string = simulate ? p.h : p.anyAtFileNodeName();
        //fn = p.h if simulate else p.anyAtFileNodeName()
        // Use p.h for unit tests.
        if (fn) {
            // Fix #102: expand path expressions.
            fn = c.expand_path_expression(fn);  // #1341.
            // fn = os.path.expanduser(fn);  // 1900.

            if (fn[0] === '~') {
                fn = path.join(os.homedir(), fn.slice(1));
            }

            return os_path_finalize_join(undefined, w_path, fn);  // #1341.
        }

    }
    return '';
}
//@+node:felix.20220102154348.1: *3* g.getBaseDirectory
/**
 * Handles the conventions applying to the "relative_path_base_directory" configuration option.
 *
 * Convert '!' or '.' to proper directory references.
 */
export function getBaseDirectory(c: Commands): string {

    let base: string = app.config.relative_path_base_directory;

    if (base && base === "!") {
        base = app.loadDir!;
    } else if (base && base === ".") {
        base = c.openDirectory!;
    }

    if (base && os_path_isabs(base)) {
        // Set c.chdir_to_relative_path as needed.
        if (!(c as any)['chdir_to_relative_path']) {
            (c as any)['chdir_to_relative_path'] = c.config.getBool('chdir-to-relative-path');
        }
        // Call os.chdir if requested.
        if ((c as any).chdir_to_relative_path) {
            // os.chdir(base);
            process.chdir(base);
        }
        return base;  // base need not exist yet.
    }

    return "";  // No relative base given.
}
//@+node:felix.20220106231022.1: *3* g.readFileIntoString
/**
 *  Return the contents of the file whose full path is fileName.

    Return (s,e)
    s is the string, converted to unicode, or None if there was an error.
    e is the encoding of s, computed in the following order:
    - The BOM encoding if the file starts with a BOM mark.
    - The encoding given in the // -*- coding: utf-8 -*- line for python files.
    - The encoding given by the 'encoding' keyword arg.
    - None, which typically means 'utf-8'.
 */
export function readFileIntoString(fileName: string,
    encoding: string = 'utf-8',  // BOM may override this.
    kind: string | undefined = undefined,  // @file, @edit, ...
    verbose: boolean = true,
): [string | undefined, string | undefined] {

    if (!fileName) {
        if (verbose) {
            trace('no fileName arg given');
        }
        return [undefined, undefined];
    }
    if (os_path_isdir(fileName)) {
        if (verbose) {
            trace('not a file:', fileName);
        }
        return [undefined, undefined];
    }

    if (!os_path_exists(fileName)) {
        if (verbose) {
            error('file not found:', fileName);
        }
        return [undefined, undefined];
    }

    let s: string | undefined;
    let e: string | undefined;
    let junk: string;

    try {
        e = undefined;
        let buffer: any;

        // ! SKIP FOR NOW
        // TODO
        /*
        const f: number = fs.openSync(fileName, 'rb')
        fs.readSync(f, buffer, );

        // Fix #391.
        if (!s){
            return ['', undefined];
        }
        // New in Leo 4.11: check for unicode BOM first.
        [e, s] = stripBOM(s)
        if (!e){
            // Python's encoding comments override everything else.
            [junk, ext] = os_path_splitext(fileName);
            if (ext === '.py'){
                e = getPythonEncodingFromString(s);
            }
        }
        s = toUnicode(s, e || encoding);
        */
        s = fs.readFileSync(fileName, { encoding: 'utf8' });

        return [s, e];
    }
    catch (iOError) {
        // Translate 'can not open' and kind, but not fileName.
        if (verbose) {
            error('can not open', '', (kind || ''), fileName);
        }
    }

    // ? needed ?
    // catch (exception){
    //     error(`readFileIntoString: unexpected exception reading ${fileName}`);
    //     es_exception();
    // }

    return [undefined, undefined];

}

//@+node:felix.20220106230957.1: *3* g.setGlobalOpenDir
export function setGlobalOpenDir(fileName: string): void {
    if (fileName) {
        app.globalOpenDir = os_path_dirname(fileName);
        // g.es('current directory:',g.app.globalOpenDir)
    }
}
//@+node:felix.20211104230025.1: *3* g.shortFileName   (coreGlobals.py)
/**
 * Return the base name of a path.
 */
export function shortFileName(fileName: string): string {
    //  return os.path.basename(fileName) if fileName else ''
    return fileName ? path.basename(fileName) : '';

}

export const shortFilename = shortFileName;

//@+node:felix.20211104210802.1: ** g.Finding & Scanning
//@+node:felix.20211104213154.1: *3* g.find_line_start
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
//@+node:felix.20211104220753.1: *3* g.is_nl
export function is_nl(s: string, i: number): boolean {
    return (i < s.length) && (s.charAt(i) === '\n' || s.charAt(i) === '\r');
}

//@+node:felix.20211104220826.1: *3* g.isDigit
export function isDigit(s: string): boolean {
    return (s >= '0' && s <= '9');
};
//@+node:felix.20211104221002.1: *3* g.is_special      (coreGlobals.py)
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

//@+node:felix.20211104221014.1: *3* g.isWordChar*     (coreGlobals.py)
/**
 * Return True if ch should be considered a letter.
 */
export function isWordChar(ch: string): boolean {
    return !!ch && (/^[0-9a-zA-Z]$/.test(ch) || ch === '_');
}

export function isWordChar1(ch: string): boolean {
    return !!ch && (/^[a-zA-Z]$/.test(ch) || ch === '_');
}

//@+node:felix.20211104221259.1: *3* g.match           (coreGlobals.py)
export function match(s: string, i: number, pattern: string): boolean {
    // Warning: this code makes no assumptions about what follows pattern.
    // Equivalent to original in python (only looks in specific substring)
    // return s and pattern and s.find(pattern, i, i + len(pattern)) == i
    // didnt work with xml expression
    // return !!s && !!pattern && s.substring(i, i + pattern.length + 1).search(pattern) === 0;
    return !!s && !!pattern && s.substring(i, i + pattern.length + 1).startsWith(pattern);
}

//@+node:felix.20211104221309.1: *3* g.match_word      (coreGlobals.py)
export function match_word(s: string, i: number, pattern: string): boolean {
    // TODO : This is weak lacks performance. Solidify this method!
    const pat = new RegExp(pattern + "\\b");
    return s.substring(i).search(pat) === 0;
}

//@+node:felix.20211104220814.1: *3* g.skip_nl
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

//@+node:felix.20220110223811.1: *3* g.is_ws & is_ws_or_nl
export function is_ws(ch: string): boolean {
    return ch === '\t' || ch === ' ';
}
export function is_ws_or_nl(s: string, i: number): boolean {
    return is_nl(s, i) || (i < s.length && is_ws(s[i]));
}
//@+node:felix.20211104220540.1: *3* g.skip_line, skip_to_start/end_of_line
/* These methods skip to the next newline, regardless of whether the
newline may be preceded by a backslash. Consequently, they should be
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
    i = s.indexOf('\n', i);
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
    i = s.indexOf('\n', i);
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
    i = s.lastIndexOf('\n', i);
    if (i === -1) {
        return 0;
    }
    return i + 1;
}

//@+node:felix.20211104220609.1: *3* g.skip_to_char    (coreGlobals.py)
/**
 * Returns object instead of original python tuple
 */
export function skip_to_char(s: string, i: number, ch: string): [number, string] {
    const j: number = s.indexOf(ch, i);
    if (j === -1) {
        // return {
        //     position: s.length,
        //     result: s.substring(i)
        // };
        return [s.length, s.substring(i)];
    }
    // return {
    //     position: j,
    //     result: s.substring(i, j)
    // };
    return [j, s.substring(i, j)];
}

//@+node:felix.20211104220621.1: *3* g.skip_id         (coreGlobals.py)
export function skip_id(s: string, i: number, chars: string | null = null): number {
    chars = chars ? chars.toString() : '';
    const n = s.length;
    while (i < n && (isWordChar(s.charAt(i)) || chars.indexOf(s.charAt(i)) >= 0)) {
        i += 1;
    }
    return i;
}

//@+node:felix.20211104220631.1: *3* g.skip_long
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
//@+node:felix.20211104220639.1: *3* g.skip_ws*        (coreGlobals.py)
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

//@+node:felix.20211104230121.1: *3* g.splitLines      (coreGlobals.py)
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

//@+node:felix.20211104230217.1: *3* g.toUnicode       (coreGlobals.py)
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

    return s.toString(); // Skip for now
}

//@+node:felix.20211106230549.1: ** g.Hooks & Plugins
//@+node:felix.20211106230549.2: *3* g.act_on_node
export function dummy_act_on_node(c: Commands, p: Position): any {
    // pass
}
// This dummy definition keeps pylint happy.
//# Plugins can change this.

export let act_on_node = dummy_act_on_node;

//@+node:felix.20211106230549.3: *3* g.childrenModifiedSet, g.contentModifiedSet
export const childrenModifiedSet: VNode[] = [];
export const contentModifiedSet: VNode[] = [];
//@+node:felix.20211106230549.4: *3* g.doHook
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
export function doHook(tag: string, ...args: any[]): any {
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
        g.app.hookError = True  # Suppress this function.
        g.app.idle_time_hooks_enabled = False
        return None
    */
    return undefined;
}
//@+node:felix.20211106230549.5: *3* g.Wrappers for g.app.pluginController methods
// Important: we can not define g.pc here!
//@+node:felix.20211106230549.6: *4* g.Loading & registration

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
//@+node:felix.20211106230549.7: *4* g.Information
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

//@+node:felix.20211104210935.1: ** g.Importing
//@+node:felix.20211104210938.1: ** g.Indices, Strings, Unicode & Whitespace
//@+node:felix.20211104212212.1: *3* g.angleBrackets
/**
 * Return < < s > >
 */
export function angleBrackets(s: string): string {
    const lt = "<<";
    const rt = ">>";
    return lt + s + rt;
}

//@+node:felix.20211104230158.1: *3* g.toEncodedString (coreGlobals.py)
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

//@+node:felix.20211104210858.1: ** g.Logging & Printing
//@+node:felix.20211104212644.1: *3* g.doKeywordArgs
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

//@+node:felix.20211104212741.1: *3* g.es
// TODO : Replace with output to proper 'Leo log pane'
export const es = console.log;

//@+node:felix.20211104212802.1: *3* g.es_exception
export function es_exception(p_error?: any, c?: Commands): string {
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

//@+node:felix.20211104212809.1: *3* g.es_print
/**
 * TODO : This is a temporary console output
 * Print all non-keyword args, and put them to the log pane.
 * Python code was:
 *     pr(*args, **keys)
 *     es(*args, **keys)
 */
export const es_print = console.log;

//@+node:felix.20211104212837.1: *3* g.error, g.note, g.warning, g.red, g.blue
// TODO : Replace with proper method
export const blue = console.log;
export const error = console.log;
export const note = console.log;
export const red = console.log;
export const warning = console.warn;

//@+node:felix.20211227232452.1: *3* g.internalError
/**
 * Report a serious internal error in Leo.
 */
export function internalError(...args: any[]): void {
    const w_callers: any = callers(20).split(',');
    const caller: string = w_callers[w_callers.length - 1];
    console.error('\nInternal Leo error in', caller);
    es_print(...args);
    // es_print('Called from', ', '.join(callers[:-1]))
    es_print('Please report this error to Leo\'s developers', 'red');
}
//@+node:felix.20211104222740.1: *3* g.pr              (coreGlobals.py)
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

//@+node:felix.20211104230337.1: *3* g.trace           (coreGlobals.py)
/**
 * Print a tracing message
 */
export const trace = console.log;
// TODO : Replace with output to proper 'Leo terminal output'

//@+node:felix.20211104211115.1: ** g.Miscellaneous
//@+node:felix.20211104222646.1: *3* g.plural          (coreGlobals.py)
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

//@+node:felix.20211227182611.1: ** g.os_path_ Wrappers
//@+at Note: all these methods return Unicode strings. It is up to the user to
// convert to an encoded string as needed, say when opening a file.
//@+node:felix.20211227182611.2: *3* g.glob_glob
// def glob_glob(pattern):
//     """Return the regularized glob.glob(pattern)"""
//     aList = glob.glob(pattern)
//     # os.path.normpath does the *reverse* of what we want.
//     if g.isWindows:
//         aList = [z.replace('\\', '/') for z in aList]
//     return aList
//@+node:felix.20211227182611.3: *3* g.os_path_abspath
// def os_path_abspath(path: str):
//     """Convert a path to an absolute path."""
//     if not path:
//         return ''
//     if '\x00' in path:
//         g.trace('NULL in', repr(path), g.callers())
//         path = path.replace('\x00', '')  # Fix Python 3 bug on Windows 10.
//     path = os.path.abspath(path)
//     # os.path.normpath does the *reverse* of what we want.
//     if g.isWindows:
//         path = path.replace('\\', '/')
//     return path
//@+node:felix.20211227182611.4: *3* g.os_path_basename
// def os_path_basename(path: str):
//     """Return the second half of the pair returned by split(path)."""
//     if not path:
//         return ''
//     path = os.path.basename(path)
//     # os.path.normpath does the *reverse* of what we want.
//     if g.isWindows:
//         path = path.replace('\\', '/')
//     return path
//@+node:felix.20211227205112.1: *3* g.os_path_dirname
/**
 * Return the first half of the pair returned by split(path).
 */
export function os_path_dirname(p_path: string): string {

    if (!p_path) {
        return '';
    }

    p_path = path.dirname(p_path);
    // os.path.normpath does the *reverse* of what we want.

    if (isWindows) {
        p_path = p_path.split('\\').join('/');
    }

    return p_path;
}
//@+node:felix.20211227205124.1: *3* g.os_path_exists
/**
 * Return True if path exists.
 */
export function os_path_exists(p_path: string): boolean {

    if (!p_path) {
        return false;
    }

    if (p_path.includes('\x00')) {
        trace('NULL in', p_path.toString(), callers());
        p_path = p_path.split('\x00').join(''); // Fix Python 3 bug on Windows 10.
    }
    return fs.existsSync(p_path);

}
//@+node:felix.20211227182611.7: *3* g.os_path_expanduser
/**
 * wrap os.path.expanduser
 */
export function os_path_expanduser(p_path: string): string {

    p_path = p_path.trim();
    if (!p_path) {
        return '';
    }

    // os.path.expanduser(p_path)
    if (p_path[0] === '~') {
        p_path = path.join(os.homedir(), p_path.slice(1));
    }
    let result: string = path.normalize(p_path);

    // os.path.normpath does the *reverse* of what we want.
    if (isWindows) {
        result = result.split('\\').join('/');
    }
    return result;
}
//@+node:felix.20211227182611.8: *3* g.os_path_finalize
/**
 * Expand '~', then return os.path.normpath, os.path.abspath of the path.
 * There is no corresponding os.path method
 */
export function os_path_finalize(p_path: string): string {

    if (p_path.includes('\x00')) {
        trace('NULL in', p_path.toString(), callers());
        p_path = p_path.split('\x00').join(''); // Fix Python 3 bug on Windows 10.
    }

    // p_path = path.expanduser(p_path);  // #1383.
    if (p_path[0] === '~') {
        p_path = path.join(os.homedir(), p_path.slice(1));
    }

    p_path = path.resolve(p_path);
    p_path = path.normalize(p_path);
    // path.normpath does the *reverse* of what we want.

    if (isWindows) {
        p_path = p_path.split('\\').join('/');
    }

    // calling os.path.realpath here would cause problems in some situations.
    return p_path;
}
//@+node:felix.20211227182611.9: *3* g.os_path_finalize_join
/**
 * Join and finalize.

 * *keys may contain a 'c' kwarg, used by g.os_path_join.
 */
export function os_path_finalize_join(c: Commands | undefined, ...args: any[]): string {

    let w_path: string = os_path_join(c, ...args);

    w_path = os_path_finalize(w_path);
    return w_path;
}
//@+node:felix.20211227182611.10: *3* g.os_path_getmtime
// def os_path_getmtime(path: str):
//     """Return the modification time of path."""
//     if not path:
//         return 0
//     try:
//         return os.path.getmtime(path)
//     except Exception:
//         return 0
//@+node:felix.20211227182611.11: *3* g.os_path_getsize
// def os_path_getsize(path: str):
//     """Return the size of path."""
//     return os.path.getsize(path) if path else 0
//@+node:felix.20211227205142.1: *3* g.os_path_isabs
/**
 * Return True if path is an absolute path.
 */
export function os_path_isabs(p_path: string): boolean {

    if (p_path) {
        return path.isAbsolute(p_path);
    } else {
        return false;
    }

}
//@+node:felix.20211227182611.13: *3* g.os_path_isdir
/**
 * Return True if the path is a directory.
 */
export function os_path_isdir(p_path: string): boolean {
    if (path) {
        return fs.existsSync(p_path) && fs.lstatSync(p_path).isDirectory();
    } else {
        return false;
    }
}

//@+node:felix.20211227182611.14: *3* g.os_path_isfile
// def os_path_isfile(path: str):
//     """Return True if path is a file."""
//     return os.path.isfile(path) if path else False
//@+node:felix.20211227182611.15: *3* g.os_path_join
/**
 * Join paths, like os.path.join, with enhancements:
 *
 * A '!!' arg prepends g.app.loadDir to the list of paths.
 * A '.'  arg prepends c.openDirectory to the list of paths,
 * provided there is a 'c' kwarg.
 */
export function os_path_join(c: Commands | undefined, ...args: any[]): string {

    // c = keys.get('c')

    const uargs: string[] = [];
    for (let z of args) {
        if (z) {
            uargs.push(z);
        }
    }
    // uargs = [z for z in args if z]

    if (!uargs.length) {
        return '';
    }
    // Note:  This is exactly the same convention as used by getBaseDirectory.
    if (uargs[0] === '!!') {
        uargs[0] = app.loadDir || '';
    } else if (uargs[0] === '.') {
        if (c && c.openDirectory) {
            uargs[0] = c.openDirectory;
        }
    }
    let w_path: string;

    try {
        w_path = path.join(...uargs);
    }
    catch (typeError) {
        trace(uargs, callers());
        throw (typeError);
    }
    // May not be needed on some Pythons.
    if (w_path.includes('\x00')) {
        trace('NULL in', w_path.toString(), callers());
        w_path = w_path.split('\x00').join(''); // Fix Python 3 bug on Windows 10.
    }


    // os.path.normpath does the *reverse* of what we want.
    if (isWindows) {
        w_path = w_path.split('\\').join('/');
    }



    return w_path;
}
//@+node:felix.20211227182611.16: *3* g.os_path_normcase
// def os_path_normcase(path: str):
//     """Normalize the path's case."""
//     if not path:
//         return ''
//     path = os.path.normcase(path)
//     if g.isWindows:
//         path = path.replace('\\', '/')
//     return path
//@+node:felix.20211227182611.17: *3* g.os_path_normpath
// def os_path_normpath(path: str):
//     """Normalize the path."""
//     if not path:
//         return ''
//     path = os.path.normpath(path)
//     # os.path.normpath does the *reverse* of what we want.
//     if g.isWindows:
//         path = path.replace('\\', '/').lower()  # #2049: ignore case!
//     return path
//@+node:felix.20211227182611.18: *3* g.os_path_normslashes
// def os_path_normslashes(path: str):

//     # os.path.normpath does the *reverse* of what we want.
//     if g.isWindows and path:
//         path = path.replace('\\', '/')
//     return path
//@+node:felix.20211227182611.19: *3* g.os_path_realpath
// def os_path_realpath(path: str):
//     """Return the canonical path of the specified filename, eliminating any
//     symbolic links encountered in the path (if they are supported by the
//     operating system).
//     """
//     if not path:
//         return ''
//     path = os.path.realpath(path)
//     # os.path.normpath does the *reverse* of what we want.
//     if g.isWindows:
//         path = path.replace('\\', '/')
//     return path
//@+node:felix.20211227182611.20: *3* g.os_path_split
export function os_path_split(p_path: string): [string, string] {

    /*
     Mimics this behavior from
     https://docs.python.org/3/library/os.path.html#os.path.split

     Split the pathname path into a pair, (head, tail)
     where tail is the last pathname component and head
     is everything leading up to that.

     The tail part will never contain a slash;
     if path ends in a slash, tail will be empty.
     If there is no slash in path, head will be empty.

     If path is empty, both head and tail are empty.

     Trailing slashes are stripped from head unless
     it is the root (one or more slashes only).

     In all cases, join(head, tail) returns a path to the
     same location as path (but the strings may differ).
    */

    if (!p_path || !p_path.trim()) {
        return ['', ''];
    }

    let testPath = p_path;
    if (isWindows) {
        testPath = testPath.split('\\').join('/');
    }

    if (testPath.includes('/')) {
        // at least a slash
        if (testPath.endsWith('/')) {
            // return with empty tail
            return [p_path, ''];
        }

        let w_parsed = path.parse(p_path);
        return [w_parsed.dir, w_parsed.base];

    } else {
        // no slashes
        return ['', p_path];
    }

}
//@+node:felix.20211227182611.21: *3* g.os_path_splitext

export function os_path_splitext(p_path: string): [string, string] {

    /*
        reproduces os.path.splitext from:
        https://docs.python.org/3/library/os.path.html#os.path.splitext


        Split the pathname path into a pair (root, ext)
        such that root + ext == path,
        and the extension, ext, is empty or begins with a period and
        contains at most one period.

        If the path contains no extension, ext will be '':

        If the path contains an extension, then ext will be set
        to this extension, including the leading period.
        Note that previous periods will be ignored

        Leading periods of the last component of the path
        are considered to be part of the root
    */

    if (!p_path || !p_path.trim()) {
        return ['', ''];
    }

    let head: string;
    let tail: string;

    if (p_path.includes('.')) {
        const parts = p_path.split('.');

        tail = parts.pop()!;

        head = parts.join('.');

        if (!head || head.endsWith('/') || head.endsWith('\\')) {
            // leading period
            return [p_path, ''];
        }

        // edge case
        if (head.endsWith('.')) {
            try {
                let w_parsed = path.parse(p_path);
                if (w_parsed.ext && !w_parsed.dir.endsWith('.')) {
                    return [
                        w_parsed.dir +
                        (isWindows && p_path.includes("\\") ? "\\" : "/") +
                        w_parsed.name,
                        w_parsed.ext
                    ];
                } else {
                    return [p_path, ''];
                }
            } catch (error) {
                trace('PATH SPLIT ERROR in g.os_path_splitext', callers());
                return [p_path, ''];
            }
        }

        return [head, '.' + tail];

    } else {
        // no extension
        return [p_path, ''];
    }




    //     if not path:
    //         return ''
    //     head, tail = os.path.splitext(path)
    //     return head, tail




}
//@+node:felix.20211227182611.22: *3* g.os_startfile
// def os_startfile(fname):
//     @others
//     if fname.find('"') > -1:
//         quoted_fname = f"'{fname}'"
//     else:
//         quoted_fname = f'"{fname}"'
//     if sys.platform.startswith('win'):
//         # pylint: disable=no-member
//         os.startfile(quoted_fname)
//             # Exists only on Windows.
//     elif sys.platform == 'darwin':
//         # From Marc-Antoine Parent.
//         try:
//             # Fix bug 1226358: File URL's are broken on MacOS:
//             # use fname, not quoted_fname, as the argument to subprocess.call.
//             subprocess.call(['open', fname])
//         except OSError:
//             pass  # There may be a spurious "Interrupted system call"
//         except ImportError:
//             os.system(f"open {quoted_fname}")
//     else:
//         try:
//             ree = None
//             wre = tempfile.NamedTemporaryFile()
//             ree = io.open(wre.name, 'rb', buffering=0)
//         except IOError:
//             g.trace(f"error opening temp file for {fname!r}")
//             if ree:
//                 ree.close()
//             return
//         try:
//             subPopen = subprocess.Popen(['xdg-open', fname], stderr=wre, shell=False)
//         except Exception:
//             g.es_print(f"error opening {fname!r}")
//             g.es_exception()
//         try:
//             itoPoll = g.IdleTime(
//                 (lambda ito: itPoll(fname, ree, subPopen, g, ito)),
//                 delay=1000,
//             )
//             itoPoll.start()
//             # Let the Leo-Editor process run
//             # so that Leo-Editor is usable while the file is open.
//         except Exception:
//             g.es_exception(f"exception executing g.startfile for {fname!r}")
//@+node:felix.20211227182611.23: *4* stderr2log()
// def stderr2log(g, ree, fname):
//     """ Display stderr output in the Leo-Editor log pane

//     Arguments:
//         g:  Leo-Editor globals
//         ree:  Read file descriptor for stderr
//         fname:  file pathname

//     Returns:
//         None
//     """

//     while True:
//         emsg = ree.read().decode('utf-8')
//         if emsg:
//             g.es_print_error(f"xdg-open {fname} caused output to stderr:\n{emsg}")
//         else:
//             break
//@+node:felix.20211227182611.24: *4* itPoll()
// def itPoll(fname, ree, subPopen, g, ito):
//     """ Poll for subprocess done

//     Arguments:
//         fname:  File name
//         ree:  stderr read file descriptor
//         subPopen:  URL open subprocess object
//         g: Leo-Editor globals
//         ito: Idle time object for itPoll()

//     Returns:
//         None
//     """

//     stderr2log(g, ree, fname)
//     rc = subPopen.poll()
//     if not rc is None:
//         ito.stop()
//         ito.destroy_self()
//         if rc != 0:
//             g.es_print(f"xdg-open {fname} failed with exit code {rc}")
//         stderr2log(g, ree, fname)
//         ree.close()
//@+node:felix.20211104211222.1: ** g.Parsing & Tokenizing
//@+node:felix.20211104211229.1: ** g.Scripting
//@+node:felix.20211104220723.1: *3* g.getScript
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

//@+node:felix.20211104211349.1: ** g.Unit Tests
//@+node:felix.20211104211355.1: ** g.Urls
//@+node:felix.20210103231554.1: ** class g.FileLikeObject (coreGlobals.py)
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

    //@+others
    //@+node:felix.20210103231554.2: *3* FileLikeObject.clear (coreGlobals.py)
    public clear(): void {
        this._list = [];
    }

    //@+node:felix.20210103231554.3: *3* FileLikeObject.close (coreGlobals.py)
    public close(): void {
        // pass
    }

    //@+node:felix.20210103231554.4: *3* FileLikeObject.flush (coreGlobals.py)
    public flush(): void {
        // pass
    }

    //@+node:felix.20210103231554.5: *3* FileLikeObject.get & getvalue & read (coreGlobals.py)
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

    //@+node:felix.20210103231554.6: *3* FileLikeObject.readline (coreGlobals.py)
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

    //@+node:felix.20210103231554.7: *3* FileLikeObject.write  (coreGlobals.py)
    public write(s: string): void {
        if (s) {
            this._list.push(s);
        }
    }

    //@-others

}

//@+node:felix.20211030164613.1: ** g.isTextWrapper & isTextWidget
export function isTextWidget(w: any): boolean {
    return !!app && !!app.gui && app.gui.isTextWidget && app.gui.isTextWidget(w);
}
export function isTextWrapper(w: any): boolean {
    return !!app && !!app.gui && app.gui.isTextWrapper && app.gui.isTextWrapper(w);
}
//@-others

//@@language typescript
//@@tabwidth -4
//@-leo
