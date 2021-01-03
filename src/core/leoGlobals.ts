
/*
 * Global constants, variables and utility functions used throughout Leo.
 * Important: This module imports no other Leo module.
 */
import * as fs from 'fs';

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

/*
def callback(func):
    """
    A global decorator that protects Leo against crashes in callbacks.

    This is the recommended way of defining all callback.

        @g.callback
        def a_callback(...):
            c = event.get('c')
            ...
    """

    def callback_wrapper(*args, **keys):
        """Callback for the @g.callback decorator."""
        try:
            return func(*args, **keys)
        except Exception:
            g.es_exception()

    return callback_wrapper
*/

/*
def check_cmd_instance_dict(c, g):
    """
    Check g.check_cmd_instance_dict.
    This is a permanent unit test, called from c.finishCreate.
    """
    d = cmd_instance_dict
    for key in d:
        ivars = d.get(key)
        obj = ivars2instance(c, g, ivars)
            # Produces warnings.
        if obj:
            name = obj.__class__.__name__
            if name != key:
                g.trace('class mismatch', key, name)
*/

/*
class Command:
    """
    A global decorator for creating commands.

    This is the recommended way of defining all new commands, including
    commands that could befined inside a class. The typical usage is:

        @g.command('command-name')
        def A_Command(event):
            c = event.get('c')
            ...

    g can *not* be used anywhere in this class!
    """

    def __init__(self, name, **kwargs):
        """Ctor for command decorator class."""
        self.name = name

    def __call__(self, func):
        """Register command for all future commanders."""
        global_commands_dict[self.name] = func
        if app:
            for c in app.commanders():
                c.k.registerCommand(self.name, func)
        # Inject ivars for plugins_menu.py.
        func.__func_name__ = func.__name__ # For leoInteg.
        func.is_command = True
        func.command_name = self.name
        return func

command = Command
*/

/*
def command_alias(alias, func):
    """Create an alias for the *already defined* method in the Commands class."""
    import leo.core.leoCommands as leoCommands
    assert hasattr(leoCommands.Commands, func.__name__)
    funcToMethod(func, leoCommands.Commands, alias)
*/

/*
class CommanderCommand:
    """
    A global decorator for creating commander commands, that is, commands
    that were formerly methods of the Commands class in leoCommands.py.

    Usage:

        @g.command('command-name')
        def command_name(self, *args, **kwargs):
            ...

    The decorator injects command_name into the Commander class and calls
    funcToMethod so the ivar will be injected in all future commanders.

    g can *not* be used anywhere in this class!
    """

    def __init__(self, name, **kwargs):
        """Ctor for command decorator class."""
        self.name = name

    def __call__(self, func):
        """Register command for all future commanders."""

        def commander_command_wrapper(event):
            c = event.get('c')
            method = getattr(c, func.__name__, None)
            method(event=event)

        # Inject ivars for plugins_menu.py.
        commander_command_wrapper.__func_name__ = func.__name__ # For leoInteg.
        commander_command_wrapper.__name__ = self.name
        commander_command_wrapper.__doc__ = func.__doc__
        global_commands_dict[self.name] = commander_command_wrapper
        if app:
            import leo.core.leoCommands as leoCommands
            funcToMethod(func, leoCommands.Commands)
            for c in app.commanders():
                c.k.registerCommand(self.name, func)
        # Inject ivars for plugins_menu.py.
        func.is_command = True
        func.command_name = self.name
        return func

commander_command = CommanderCommand
*/

/*
def ivars2instance(c, g, ivars):
    """
    Return the instance of c given by ivars.
    ivars is a list of strings.
    A special case: ivars may be 'g', indicating the leoGlobals module.
    """
    if not ivars:
        g.trace('can not happen: no ivars')
        return None
    ivar = ivars[0]
    if ivar not in ('c', 'g'):
        g.trace('can not happen: unknown base', ivar)
        return None
    obj = c if ivar == 'c' else g
    for ivar in ivars[1:]:
        obj = getattr(obj, ivar, None)
        if not obj:
            g.trace('can not happen: unknown attribute', obj, ivar, ivars)
            break
    return obj
*/

/*
def new_cmd_decorator(name, ivars):
    """
    Return a new decorator for a command with the given name.
    Compute the class *instance* using the ivar string or list.

    Don't even think about removing the @cmd decorators!
    See https://github.com/leo-editor/leo-editor/issues/325
    """

    def _decorator(func):

        def new_cmd_wrapper(event):
            c = event.c
            self = g.ivars2instance(c, g, ivars)
            try:
                func(self, event=event)
                    # Don't use a keyword for self.
                    # This allows the VimCommands class to use vc instead.
            except Exception:
                g.es_exception()

        new_cmd_wrapper.__func_name__ = func.__name__ # For leoInteg.
        new_cmd_wrapper.__name__ = name
        new_cmd_wrapper.__doc__ = func.__doc__
        global_commands_dict[name] = new_cmd_wrapper
            # Put the *wrapper* into the global dict.
        return func
            # The decorator must return the func itself.

    return _decorator
*/

export const g_language_pat = new RegExp(String.raw`^@language\s+(\w+)+`, 'm');
// Regex used by this module, and in leoColorizer.py.

// Patterns used only in this module...
export const g_is_directive_pattern = new RegExp(String.raw`^\s*@([\w-]+)\s*`);
// This pattern excludes @encoding.whatever and @encoding(whatever)
// It must allow @language python, @nocolor-node, etc.
export const g_noweb_root = new RegExp('<' + '<' + '*' + '>' + '>' + '=', 'm');
export const g_pos_pattern = new RegExp(String.raw`:(\d+),?(\d+)?,?([-\d]+)?,?(\d+)?$`);
export const g_tabwidth_pat = new RegExp(String.raw`(^@tabwidth)`, 'm');


export const tree_popup_handlers: ((...args: any[]) => any)[] = [];  // Set later.
export const user_dict: { [key: string]: any } = {};

