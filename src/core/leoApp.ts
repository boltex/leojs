/*
    import leo.core.leoGlobals as g
    import leo.core.leoExternalFiles as leoExternalFiles
    import importlib
    import io
    StringIO = io.StringIO
    import os
    import optparse
    import subprocess
    import string
    import sys
    import time
    import traceback
    import zipfile
    import platform
    import sqlite3
*/

import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';
import { Commander } from './leoCommander';
/**
 *  A singleton class to manage idle-time handling. This class handles all
 *  details of running code at idle time, including running 'idle' hooks.
 *
 *  Any code can call g.app.idleTimeManager.add_callback(callback) to cause
 *  the callback to be called at idle time forever.
 */
export class IdleTimeManager {

    callback_list: ((...args: any[]) => any)[];
    timer: any;

    /**
     * Ctor for IdleTimeManager class.
    */
    constructor() {
        this.callback_list = [];
        this.timer = null;
    }

    /*
    def add_callback(self, callback):
        """Add a callback to be called at every idle time."""
        self.callback_list.append(callback)
    */

    /*
    on_idle_count = 0

    def on_idle(self, timer):
        """IdleTimeManager: Run all idle-time callbacks."""
        if not g.app: return
        if g.app.killed: return
        if not g.app.pluginsController:
            g.trace('No g.app.pluginsController', g.callers())
            timer.stop()
            return  # For debugger.
        self.on_idle_count += 1
        # Handle the registered callbacks.
        for callback in self.callback_list:
            try:
                callback()
            except Exception:
                g.es_exception()
                g.es_print(f"removing callback: {callback}")
                self.callback_list.remove(callback)
        # Handle idle-time hooks.
        g.app.pluginsController.on_idle()

    */

    /*
    def start(self):
        """Start the idle-time timer."""
        self.timer = g.IdleTime(
            self.on_idle,
            delay=500,
            tag='IdleTimeManager.on_idle')
        if self.timer:
            self.timer.start()
    */


}

/**
 * A class representing the Leo application itself.
 * instance variables of this class are Leo's global variables.
 */
export class LeoApp {

    public batchMode: boolean = false; // True: run in batch mode.
    public debug = []; // A list of switches to be enabled.
    public diff: boolean = false; // True: run Leo in diff mode.
    public enablePlugins: boolean = true; // True: run start1 hook to load plugins. --no-plugins
    public failFast: boolean = false; // True: Use the failfast option in unit tests.
    public gui:LeoUI; // The gui class.
    public guiArgName = null; // The gui name given in --gui option.
    public ipython_inited: boolean = false; // True if leoIpython.py imports succeeded.
    public isTheme: boolean = false; // True: load files as theme files (ignore myLeoSettings.leo).
    public listen_to_log_flag: boolean = false; // True: execute listen-to-log command.
    public qt_use_tabs: boolean = false; // True: using qt gui: allow tabbed main window.
    public loaded_session: boolean = false; // Set at startup if no files specified on command line.
    public silentMode: boolean = false; // True: no sign-on.
    public start_fullscreen: boolean = false; // For qt_frame plugin.
    public start_maximized: boolean = false; // For qt_frame plugin.
    public start_minimized: boolean = false; // For qt_frame plugin.
    public trace_binding = null; // The name of a binding to trace, or None.
    public trace_setting = null; // The name of a setting to trace, or None.
    public translateToUpperCase: boolean = false; // Never set to True.
    public useIpython: boolean = false; // True: add support for IPython.
    public use_psyco: boolean = false; // True: use psyco optimization.
    public use_splash_screen: boolean = true; // True: put up a splash screen.

    public count: number = 0; // General purpose debugging count.
    public debug_dict: any = {}; // For general use.
    public disable_redraw: boolean = false; // True: disable all redraws.
    public disableSave: boolean = false; // May be set by plugins.
    public idle_timers: any[] = []; // A list of IdleTime instances, so they persist.
    public log_listener: any = null; // The process created by the 'listen-for-log' command.
    public positions: number = 0; // The number of positions generated.
    public scanErrors: number = 0; // The number of errors seen by g.scanError.
    public structure_errors: number = 0; // Set by p.safeMoveToThreadNext.
    public statsDict: any = {}; // dict used by g.stat, g.clear_stats, g.print_stats.
    public statsLockout: boolean = false; // A lockout to prevent unbound recursion while gathering stats.
    public validate_outline: boolean = false; // True: enables c.validate_outline. (slow)

    public menuWarningsGiven: boolean = false; // True: suppress warnings in menu code.
    public unicodeErrorGiven: boolean = true; // True: suppress unicode trace-backs.

    public extensionsDir = null; // The leo / extensions directory
    public globalConfigDir = null; // leo / config directory
    public globalOpenDir = null; // The directory last used to open a file.
    public homeDir = null; // The user's home directory.
    public homeLeoDir = null; // The user's home/.leo directory.
    public loadDir = null; // The leo / core directory.
    public machineDir = null; // The machine - specific directory.

    public atAutoNames: string[] = []; // The set of all @auto spellings.
    public atFileNames: string[] = []; // The set of all built -in @<file>spellings.

    public globalKillBuffer: any[] = []; // The global kill buffer.
    public globalRegisters: any = {}; // The global register list.
    public leoID: string = ''; // The id part of gnx's, using empty for falsy.
    public loadedThemes: any[] = []; // List of loaded theme.leo files.
    public lossage: any[] = []; // List of last 100 keystrokes.
    public paste_c: any = null; // The commander that pasted the last outline.
    public spellDict: any = null; // The singleton PyEnchant spell dict.
    public numberOfUntitledWindows: number = 0; // Number of opened untitled windows.
    public windowList: any[] = []; // Global list of all frames.
    public realMenuNameDict = {}; // Translations of menu names.

    // Most of these are defined in initApp.
    public backgroundProcessManager: any = null; // The singleton BackgroundProcessManager instance.
    public commander_cacher: any = null; // The singleton leoCacher.CommanderCacher instance.
    public commander_db: any = null; // The singleton db, managed by g.app.commander_cacher.
    public config: any = null; // The singleton leoConfig instance.
    public db: any = null; // The singleton global db, managed by g.app.global_cacher.
    public externalFilesController: any = null; // The singleton ExternalFilesController instance.
    public global_cacher: any = null; // The singleton leoCacher.GlobalCacher instance.
    public idleTimeManager: any = null; // The singleton IdleTimeManager instance.
    public ipk: any = null; // python kernel instance
    public loadManager: any = null; // The singleton LoadManager instance.
    // public logManager: any = null;
    // The singleton LogManager instance.
    // public openWithManager: any = null;
    // The singleton OpenWithManager instance.
    public nodeIndices: NodeIndices; // The singleton nodeIndices instance.
    public pluginsController: any = null; // The singleton PluginsManager instance. public sessionManager: any = null; // The singleton SessionManager instance. // The Commands class...
    public commandName: any = null; // The name of the command being executed.
    public commandInterruptFlag: boolean = false; // True: command within a command.

    // From leoAtFile.py.
    public atAutoWritersDict: any = {};
    public writersDispatchDict: any = {};
    // From leoImport.py
    public atAutoDict: any = {};
    // Keys are @auto names, values are scanner classes.
    public classDispatchDict: any = {};

    public already_open_files: any[] = []; // A list of file names that * might * be open in another copy of Leo.
    public dragging: boolean = false; // True: dragging.
    public inBridge: boolean = false; // True: running from leoBridge module.
    public inScript: boolean = false; // True: executing a script.
    public initing: boolean = true; // True: we are initializing the app.
    public initComplete: boolean = false; // True: late bindings are not allowed.
    public killed: boolean = false; // True: we are about to destroy the root window.
    public openingSettingsFile: boolean = false; // True, opening a settings file.
    public preReadFlag: boolean = false; // True: we are pre - reading a settings file.
    public quitting: boolean = false; // True: quitting.Locks out some events.
    public restarting: boolean = false; // True: restarting all of Leo.#1240.
    public reverting: boolean = false; // True: executing the revert command.
    public syntax_error_files: any[] = [];

    // To be moved to the LogManager.
    public log = null; // The LeoFrame containing the present log.
    public logInited: boolean = false; // False: all log message go to logWaiting list.
    public logIsLocked: boolean = false; // True: no changes to log are allowed.
    public logWaiting: any[] = []; // List of tuples(s, color, newline) waiting to go to a log.
    public printWaiting: any[] = []; // Queue of messages to be sent to the printer.
    public signon: string = '';
    public signon1: string = '';
    public signon2: string = '';

    public theme_directory = null;
    // The directory from which the theme file was loaded, if any.
    // Set only by LM.readGlobalSettingsFiles.
    // Used by the StyleSheetManager class.

    /*
    from leo.core import leoFrame
    from leo.core import leoGui

    public nullGui = leoGui.NullGui()
    public nullLog = leoFrame.NullLog()
    */

    public hookError: boolean = false; // True: suppress further calls to hooks.
    // g.doHook sets g.app.hookError on all exceptions.
    // Scripts may reset g.app.hookError to try again.
    public hookFunction = null;
    // Application wide hook function.
    public idle_time_hooks_enabled: boolean = true;
    // True: idle - time hooks are enabled.

    public searchDict: any = {};
    // For communication between find / change scripts.
    public scriptDict: any = {};
    // For use by scripts.Cleared before running each script.
    public scriptResult = null;   // For use by leoPymacs.
    public permanentScriptDict = {};   // For use by scrips.Never cleared automatically.

    public isExternalUnitTest: boolean = false; // True: we are running a unit test externally.
    public runningAllUnitTests: boolean = false; // True: we are running all unit tests(Only for local tests).

    public suppressImportChecks: boolean = false;
    // Used only in basescanner.py ;
    // True: suppress importCommands.check
    public unitTestDict = {};   // For communication between unit tests and code.
    public unitTestGui = null;   // A way to override the gui in external unit tests.
    public unitTesting = false;   // True if unit testing.
    public unitTestMenusDict = {};   // Created in LeoMenu.createMenuEntries for a unit test. ;   // keys are command names.values are sets of strokes.


    public delegate_language_dict: { [key: string]: string } = {};
    public extension_dict: { [key: string]: string } = {};
    public extra_extension_dict: { [key: string]: string } = {};
    public prolog_prefix_string: string = "";
    public prolog_postfix_string: string = "";
    public prolog_namespace_string: string = "";
    public language_delims_dict: { [key: string]: string } = {};
    public language_extension_dict: { [key: string]: string } = {};

    constructor() {
        // Define all global data.
        this.define_delegate_language_dict();
        this.init_at_auto_names();
        this.init_at_file_names();
        this.define_global_constants();
        this.define_language_delims_dict();
        this.define_language_extension_dict();
        this.define_extension_dict();
    }

    public define_delegate_language_dict(): void {
        this.delegate_language_dict = {
            // Keys are new language names.
            // Values are existing languages in leo / modes.
            "less": "css",
            "hbs": "html",
            "handlebars": "html",
            //"rust": "c",
            // "vue": "c",
        };
    }

    public define_extension_dict(): void {

        // Keys are extensions, values are languages
        this.extension_dict = {
            // "ada": "ada",
            "ada": "ada95", // modes / ada95.py exists.
            "ahk": "autohotkey",
            "aj": "aspect_j",
            "apdl": "apdl",
            "as": "actionscript", // jason 2003-07 - 03
            "asp": "asp",
            "awk": "awk",
            "b": "b",
            "bas": "rapidq", // fil 2004-march - 11
            "bash": "shellscript",
            "bat": "batch",
            "bbj": "bbj",
            "bcel": "bcel",
            "bib": "bibtex",
            "c": "c",
            "c++": "cplusplus",
            "cbl": "cobol", // Only one extension is valid: .cob
            "cfg": "config",
            "cfm": "coldfusion",
            "clj": "clojure", // 2013 / 09 / 25: Fix bug 879338.
            "cljs": "clojure",
            "cljc": "clojure",
            "ch": "chill", // Other extensions, .c186,.c286
            "coffee": "coffeescript",
            "conf": "apacheconf",
            "cpp": "cplusplus", // 2020 / 08 / 12: was cpp.
            "css": "css",
            "d": "d",
            "dart": "dart",
            "e": "eiffel",
            "el": "elisp",
            "eml": "mail",
            "erl": "erlang",
            "ex": "elixir",
            "f": "fortran",
            "f90": "fortran90",
            "factor": "factor",
            "forth": "forth",
            "g": "antlr",
            "groovy": "groovy",
            "h": "c", // 2012 / 05 / 23.
            "handlebars": "html", // McNab.
            "hbs": "html", // McNab.
            "hs": "haskell",
            "html": "html",
            "hx": "haxe",
            "i": "swig",
            "i4gl": "i4gl",
            "icn": "icon",
            "idl": "idl",
            "inf": "inform",
            "info": "texinfo",
            "ini": "ini",
            "io": "io",
            "ipynb": "jupyter",
            "iss": "inno_setup",
            "java": "java",
            "jhtml": "jhtml",
            "jmk": "jmk",
            "js": "javascript", // For javascript import test.
            "jsp": "javaserverpage",
            "json": "json",
            // "jsp": "jsp",
            "ksh": "kshell",
            "kv": "kivy", // PeckJ 2014/05/05
            "latex": "latex",
            "less": "css", // McNab
            "lua": "lua", // ddm 13/02/06
            "ly": "lilypond",
            "m": "matlab",
            "mak": "makefile",
            "md": "md", // PeckJ 2013/02/07
            "ml": "ml",
            "mm": "objective_c", // Only one extension is valid: .m
            "mod": "modula3",
            "mpl": "maple",
            "mqsc": "mqsc",
            "nqc": "nqc",
            "nsi": "nsi", // EKR: 2010/10/27
            // "nsi": "nsis2",
            "nw": "noweb",
            "occ": "occam",
            "otl": "vimoutline", // TL 8/25/08 Vim's outline plugin
            "p": "pascal",
            // "p": "pop11", // Conflicts with pascal.
            "php": "php",
            "pike": "pike",
            "pl": "perl",
            "pl1": "pl1",
            "po": "gettext",
            "pod": "perlpod",
            "pov": "povray",
            "prg": "foxpro",
            "pro": "prolog",
            "ps": "postscript",
            "psp": "psp",
            "ptl": "ptl",
            "py": "python",
            "pyx": "cython", // Other extensions, .pyd,.pyi
            // "pyx": "pyrex",
            // "r": "r", # modes / r.py does not exist.
            "r": "rebol", // jason 2003-07 - 03
            "rb": "ruby", // thyrsus 2008-11 - 05
            "rest": "rst",
            "rex": "objectrexx",
            "rhtml": "rhtml",
            "rib": "rib",
            "rs": "rust", // EKR: 2019/08/11
            "sas": "sas",
            "scala": "scala",
            "scm": "scheme",
            "scpt": "applescript",
            "sgml": "sgml",
            "sh": "shell", // DS 4/1/04.modes / shell.py exists.
            "shtml": "shtml",
            "sm": "smalltalk",
            "splus": "splus",
            "sql": "plsql", // qt02537 2005-05 - 27
            "sqr": "sqr",
            "ss": "ssharp",
            "ssi": "shtml",
            "sty": "latex",
            "tcl": "tcl", // modes / tcl.py exists.
            // "tcl": "tcltk",
            "tex": "latex",
            // "tex": "tex",
            "tpl": "tpl",
            "ts": "typescript",
            "txt": "plain",
            // "txt": "text",
            // "txt": "unknown", # Set when @comment is seen.
            "uc": "uscript",
            "v": "verilog",
            "vbs": "vbscript",
            "vhd": "vhdl",
            "vhdl": "vhdl",
            "vim": "vim",
            "vtl": "velocity",
            "w": "cweb",
            "wiki": "moin",
            "xml": "xml",
            "xom": "omnimark",
            "xsl": "xsl",
            "yaml": "yaml",
            "vue": "javascript",
            "zpt": "zpt"
        };

        /*
            # These aren't real languages, or have no delims...
                # cvs_commit, dsssl, embperl, freemarker, hex, jcl,
                # patch, phpsection, progress, props, pseudoplain,
                # relax_ng_compact, rtf, svn_commit.

            # These have extensions which conflict with other languages.
                # assembly_macro32: .asm or.a
                # assembly_mcs51:   .asm or.a
                # assembly_parrot:  .asm or.a
                # assembly_r2000:   .asm or.a
                # assembly_x86:     .asm or.a
                # squidconf:        .conf
                # rpmspec:          .rpm

            # Extra language extensions, used to associate extensions with mode files.
            # Used by importCommands.languageForExtension.
            # Keys are extensions, values are corresponding mode file(without.py)
            # A value of 'none' is a signal to unit tests that no extension file exists.

        */

        this.extra_extension_dict = {
            'pod': 'perl',
            'unknown_language': 'none',
            'w': 'none' // cweb
        };
    }

    public define_global_constants(): void {
        // this.prolog_string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        this.prolog_prefix_string = "<?xml version=\"1.0\" encoding=";
        this.prolog_postfix_string = "?>";
        this.prolog_namespace_string = 'xmlns:leo="http://edreamleo.org/namespaces/leo-python-editor/1.1"';
    }

    public define_language_delims_dict(): void {

        this.language_delims_dict = {
            // Internally, lower case is used for all language names.
            // Keys are languages, values are 1, 2 or 3-tuples of delims.
            "actionscript": "// /* */", // jason 2003-07 - 03
            "ada": "--",
            "ada95": "--",
            "ahk": ";",
            "antlr": "// /* */",
            "apacheconf": "#",
            "apdl": "!",
            "applescript": "-- (* *)",
            "asp": "<!-- -->",
            "aspect_j": "// /* */",
            "assembly_macro32": ";",
            "assembly_mcs51": ";",
            "assembly_parrot": "#",
            "assembly_r2000": "#",
            "assembly_x86": ";",
            "autohotkey": "; /* */", // TL - AutoHotkey language
            "awk": "#",
            "b": "// /* */",
            "batch": "REM_", // Use the REM hack.
            "bbj": "/* */",
            "bcel": "// /* */",
            "bibtex": "%",
            "c": "// /* */", // C, C++ or objective C.
            "chill": "/* */",
            "clojure": ";", // 2013 / 09 / 25: Fix bug 879338.
            "cobol": "*",
            "coldfusion": "<!-- -->",
            "coffeescript": "#", // 2016 / 02 / 26.
            "config": "#", // Leo 4.5.1
            "cplusplus": "// /* */",
            "cpp": "// /* */",// C++.
            "csharp": "// /* */", // C#
            "css": "/* */", // 4 / 1 / 04
            "cweb": "@q@ @>", // Use the "cweb hack"
            "cython": "#",
            "d": "// /* */",
            "dart": "// /* */", // Leo 5.0.
            "doxygen": "#",
            "eiffel": "--",
            "elisp": ";",
            "erlang": "%",
            "elixir": "#",
            "factor": "!_ ( )", // Use the rem hack.
            "forth": "\\_ _(_ _)", // Use the "REM hack"
            "fortran": "C",
            "fortran90": "!",
            "foxpro": "&&",
            "gettext": "# ",
            "groovy": "// /* */",
            "handlebars": "<!-- -->", // McNab: delegate to html.
            "haskell": "--_ {-_ _-}",
            "haxe": "// /* */",
            "hbs": "<!-- -->", // McNab: delegate to html.
            "html": "<!-- -->",
            "i4gl": "-- { }",
            "icon": "#",
            "idl": "// /* */",
            "inform": "!",
            "ini": ";",
            "inno_setup": ";",
            "interlis": "/* */",
            "io": "// */",
            "java": "// /* */",
            "javascript": "// /* */", // EKR: 2011 / 11 / 12: For javascript import test.
            "javaserverpage": "<%-- --%>", // EKR: 2011 / 11 / 25(See also, jsp)
            "jhtml": "<!-- -->",
            "jmk": "#",
            "json": "#", // EKR: 2020 / 07 / 27: Json has no delims.This is a dummy entry.
            "jsp": "<%-- --%>",
            "jupyter": "<%-- --%>", // Default to markdown ?
            "kivy": "#", // PeckJ 2014 / 05 / 05
            "kshell": "#", // Leo 4.5.1.
            "latex": "%",
            "less": "/* */", // NcNab: delegate to css.
            "lilypond": "% %{ %}",
            "lisp": ";", // EKR: 2010 / 09 / 29
            "lotos": "(* *)",
            "lua": "--", // ddm 13 / 02 / 06
            "mail": ">",
            "makefile": "#",
            "maple": "//",
            "markdown": "<!-- -->", // EKR, 2018 / 03 / 03: html comments.
            "matlab": "%", // EKR: 2011 / 10 / 21
            "md": "<!-- -->", // PeckJ: 2013 / 02 / 08
            "ml": "(* *)",
            "modula3": "(* *)",
            "moin": "##",
            "mqsc": "*",
            "netrexx": "-- /* */",
            "noweb": "%", // EKR: 2009 - 01 - 30. Use Latex for doc chunks.
            "nqc": "// /* */",
            "nsi": ";", // EKR: 2010 / 10 / 27
            "nsis2": ";",
            "objective_c": "// /* */",
            "objectrexx": "-- /* */",
            "occam": "--",
            "omnimark": ";",
            "pandoc": "<!-- -->",
            "pascal": "// { }",
            "perl": "#",
            "perlpod": "# __=pod__ __=cut__", // 9 / 25 / 02: The perlpod hack.
            "php": "// /* */", // 6 / 23 / 07: was "//",
            "pike": "// /* */",
            "pl1": "/* */",
            "plain": "#", // We must pick something.
            "plsql": "-- /* */", // SQL scripts qt02537 2005 - 05 - 27
            "pop11": ";;; /* */",
            "postscript": "%",
            "povray": "// /* */",
            "powerdynamo": "// <!-- -->",
            "prolog": "% /* */",
            "psp": "<!-- -->",
            "ptl": "#",
            "pvwave": ";",
            "pyrex": "#",
            "python": "#",
            "r": "#",
            "rapidq": "'", // fil 2004 - march - 11
            "rebol": ";", // jason 2003 - 07 - 03
            "redcode": ";",
            "rest": ".._",
            "rhtml": "<%# %>",
            "rib": "#",
            "rpmspec": "#",
            "rst": ".._",
            "rust": "// /* */",
            "ruby": "#", // thyrsus 2008 - 11 - 05
            "rview": "// /* */",
            "sas": "* /* */",
            "scala": "// /* */",
            "scheme": "; #| |#",
            "sdl_pr": "/* */",
            "sgml": "<!-- -->",
            "shell": "#",     // shell scripts
            "shellscript": "#",
            "shtml": "<!-- -->",
            "smalltalk": '" "', // Comments are enclosed in double quotes(!!)
            "smi_mib": "--",
            "splus": "#",
            "sqr": "!",
            "squidconf": "#",
            "ssharp": "#",
            "swig": "// /* */",
            "tcl": "#",
            "tcltk": "#",
            "tex": "%", // Bug fix: 2008 - 1 - 30: Fixed Mark Edginton's bug.
            "text": "#", // We must pick something.
            "texinfo": "@c",
            "tpl": "<!-- -->",
            "tsql": "-- /* */",
            "typescript": "// /* */", // For typescript import test.
            "unknown": "#", // Set when @comment is seen.
            "unknown_language": '#--unknown-language--', // For unknown extensions in @shadow files.
            "uscript": "// /* */",
            "vbscript": "'",
            "velocity": "## #* *#",
            "verilog": "// /* */",
            "vhdl": "--",
            "vim": "\"",
            "vimoutline": "#", // TL 8 / 25 / 08 Vim's outline plugin
            "xml": "<!-- -->",
            "xsl": "<!-- -->",
            "xslt": "<!-- -->",
            "yaml": "#",
            "zpt": "<!-- -->"

            // These aren't real languages, or have no delims...
            // "cvs_commit"         : "",
            // "dsssl"              : "; <!-- -->",
            // "embperl"            : "<!-- -->",  // Internal colorizing state.
            // "freemarker"         : "",
            // "hex"                : "",
            // "jcl"                : "",
            // "patch"              : "",
            // "phpsection"         : "<!-- -->",  // Internal colorizing state.
            // "props"              : "#",         // Unknown language.
            // "pseudoplain"        : "",
            // "relax_ng_compact"   : "#",         // An xml schema.
            // "rtf"                : "",
            // "svn_commit"         : "",
        };

    }

    public define_language_extension_dict(): void {

        // Used only by g.app.externalFilesController.get_ext.

        // Keys are languages, values are extensions.
        this.language_extension_dict = {
            "actionscript": "as", // jason 2003-07 - 03
            "ada": "ada",
            "ada95": "ada",
            "ahk": "ahk",
            "antlr": "g",
            "apacheconf": "conf",
            "apdl": "apdl",
            "applescript": "scpt",
            "asp": "asp",
            "aspect_j": "aj",
            "autohotkey": "ahk", // TL - AutoHotkey language
            "awk": "awk",
            "b": "b",
            "batch": "bat", // Leo 4.5.1.
            "bbj": "bbj",
            "bcel": "bcel",
            "bibtex": "bib",
            "c": "c",
            "chill": "ch", // Only one extension is valid: .c186, .c286
            "clojure": "clj", // 2013 / 09 / 25: Fix bug 879338.
            "cobol": "cbl", // Only one extension is valid: .cob
            "coldfusion": "cfm",
            "coffeescript": "coffee",
            "config": "cfg",
            "cplusplus": "c++",
            "cpp": "cpp",
            "css": "css", // 4 / 1 / 04
            "cweb": "w",
            "cython": "pyx", // Only one extension is valid at present: .pyi, .pyd.
            "d": "d",
            "dart": "dart",
            "eiffel": "e",
            "elisp": "el",
            "erlang": "erl",
            "elixir": "ex",
            "factor": "factor",
            "forth": "forth",
            "fortran": "f",
            "fortran90": "f90",
            "foxpro": "prg",
            "gettext": "po",
            "groovy": "groovy",
            "haskell": "hs",
            "haxe": "hx",
            "html": "html",
            "i4gl": "i4gl",
            "icon": "icn",
            "idl": "idl",
            "inform": "inf",
            "ini": "ini",
            "inno_setup": "iss",
            "io": "io",
            "java": "java",
            "javascript": "js", // EKR: 2011/11/12: For javascript import test.
            "javaserverpage": "jsp", // EKR: 2011/11/25
            "jhtml": "jhtml",
            "jmk": "jmk",
            "json": "json",
            "jsp": "jsp",
            "jupyter": "ipynb",
            "kivy": "kv", // PeckJ 2014/05/05
            "kshell": "ksh", // Leo 4.5.1.
            "latex": "tex", // 1 / 8 / 04
            "lilypond": "ly",
            "lua": "lua", // ddm 13/02/06
            "mail": "eml",
            "makefile": "mak",
            "maple": "mpl",
            "matlab": "m",
            "md": "md", // PeckJ: 2013/02/07
            "ml": "ml",
            "modula3": "mod",
            "moin": "wiki",
            "mqsc": "mqsc",
            "noweb": "nw",
            "nqc": "nqc",
            "nsi": "nsi", // EKR: 2010/10/27
            "nsis2": "nsi",
            "objective_c": "mm", // Only one extension is valid: .m
            "objectrexx": "rex",
            "occam": "occ",
            "omnimark": "xom",
            "pascal": "p",
            "perl": "pl",
            "perlpod": "pod",
            "php": "php",
            "pike": "pike",
            "pl1": "pl1",
            "plain": "txt",
            "plsql": "sql", // qt02537 2005-05 - 27
            // "pop11"       : "p", // Conflicts with pascal.
            "postscript": "ps",
            "povray": "pov",
            "prolog": "pro",
            "psp": "psp",
            "ptl": "ptl",
            "pyrex": "pyx",
            "python": "py",
            "r": "r",
            "rapidq": "bas", // fil 2004-march - 11
            "rebol": "r", // jason 2003-07 - 03
            "rhtml": "rhtml",
            "rib": "rib",
            "rst": "rest",
            "ruby": "rb", // thyrsus 2008-11 - 05
            "rust": "rs", // EKR: 2019/08/11
            "sas": "sas",
            "scala": "scala",
            "scheme": "scm",
            "sgml": "sgml",
            "shell": "sh", // DS 4/1/04
            "shellscript": "bash",
            "shtml": "ssi", // Only one extension is valid: .shtml
            "smalltalk": "sm",
            "splus": "splus",
            "sqr": "sqr",
            "ssharp": "ss",
            "swig": "i",
            "tcl": "tcl",
            "tcltk": "tcl",
            "tex": "tex",
            "texinfo": "info",
            "text": "txt",
            "tpl": "tpl",
            "tsql": "sql", // A guess.
            "typescript": "ts",
            "unknown": "txt", // Set when @comment is seen.
            "uscript": "uc",
            "vbscript": "vbs",
            "velocity": "vtl",
            "verilog": "v",
            "vhdl": "vhd", // Only one extension is valid: .vhdl
            "vim": "vim",
            "vimoutline": "otl", // TL 8 / 25 / 08 Vim's outline plugin
            "xml": "xml",
            "xsl": "xsl",
            "xslt": "xsl",
            "yaml": "yaml",
            "zpt": "zpt"
        };

        /*
            # These aren't real languages, or have no delims...
                # cvs_commit, dsssl, embperl, freemarker, hex, jcl,
                # patch, phpsection, progress, props, pseudoplain,
                # relax_ng_compact, rtf, svn_commit.

            # These have extensions which conflict with other languages.
                # assembly_macro32: .asm or.a
                # assembly_mcs51:   .asm or.a
                # assembly_parrot:  .asm or.a
                # assembly_r2000:   .asm or.a
                # assembly_x86:     .asm or.a
                # squidconf:        .conf
                # rpmspec:          .rpm
        */

    }

    /**
     * Init the app.atAutoNames set.
     */
    public init_at_auto_names(): void {
        this.atAutoNames = ["@auto-rst", "@auto"];
    }

    /**
     * Init the app.atFileNames set.
     */
    public init_at_file_names(): void {
        this.atFileNames = [
            "@asis",
            "@edit",
            "@file-asis", "@file-thin", "@file-nosent", "@file",
            "@clean", "@nosent",
            "@shadow",
            "@thin",
        ];
    }


    /**
     * Create a commander and its view frame for the Leo main window.
     */
    public newCommander(
        fileName:string,
        gui:LeoUI,
        previousSettings?:any,
        relativeFileName?:any,
    ): Commander{
        // Create the commander and its subcommanders.
        // This takes about 3/4 sec when called by the leoBridge module.
        // Timeit reports 0.0175 sec when using a nullGui.
        const c = new Commander(
            fileName,
            gui,
            previousSettings,
            relativeFileName
        );
        return c;
    }

}

/**
 * A class to manage loading .leo files, including configuration files.
 */
export class LoadManager {

    // Global settings & shortcuts dicts...
    // The are the defaults for computing settings and shortcuts for all loaded files.
    
    // A g.TypedDict: the join of settings in leoSettings.leo & myLeoSettings.leo.
    public globalSettingsDict: {[key:string]:any}|undefined; 
    // A g.TypedDict: the join of shortcuts in leoSettings.leo & myLeoSettings.leo
    public globalBindingsDict: {[key:string]:any}|undefined; 
    
    public files: string []; // List of files to be loaded.
    public options: {[key:string]:any}; // Dictionary of user options. Keys are option names.
    public old_argv: string []; // A copy of sys.argv for debugging.
    public more_cmdline_files: boolean; // True when more files remain on the command line to be loaded.
    
    constructor() {
        this.globalSettingsDict = undefined;
        this.globalBindingsDict = undefined;
        this.files = [];
        this.options = {};
        this.old_argv = [];
        this.more_cmdline_files = false;
    }

    /**
     * This is Leo's main startup method.
     */
    public load(fileName?:string): void {
        // SIMPLIFIED JS VERSION 
        const lm:LoadManager = this;

        const t1 = process.hrtime();
        
        lm.doPrePluginsInit(fileName); // sets lm.options and lm.files
        const t2 = process.hrtime();    
        
        lm.doPostPluginsInit();
        const t3 = process.hrtime();

        // console.log('Startup PrePluginsInit' );
        // console.log('Startup PostPluginsInit' );

    }

    /**
     * Create a Leo window for each file in the lm.files list.
     */ 
    public doPostPluginsInit():boolean {
        // Clear g.app.initing _before_ creating commanders.
        const lm:LoadManager = this;
        g.app.initing = false;  // "idle" hooks may now call g.app.forceShutdown.
        // Create the main frame.Show it and all queued messages.
        let c:Commander|undefined;
        let c1:Commander|undefined;
        let fn:string = "";
        if (lm.files.length){
            try{  // #1403.
                for (let n = 0; n < lm.files.length; n++) {
                    const fn = lm.files[n];
                    lm.more_cmdline_files = n < (lm.files.length - 1);
                    c = lm.loadLocalFile(fn, g.app.gui);
                        // Returns None if the file is open in another instance of Leo.
                    if (c && !c1){  // #1416:
                        c1 = c;
                    }
                }
            }
            catch(exception){
                g.es_print(`Unexpected exception reading ${fn}`);
                g.es_exception();
                c = undefined;
            }
        }
        
        // Load (and save later) a session *only* if the command line contains no files.
        /*
        g.app.loaded_session = !lm.files.length;
        if (g.app.sessionManager && g.app.loaded_session){
            try{  // #1403.
                aList = g.app.sessionManager.load_snapshot();
                if aList:
                    g.app.sessionManager.load_session(c1, aList);
                    // #659.
                    if g.app.windowList:
                        c = c1 = g.app.windowList[0].c;
                    else:
                        c = c1 = None;
            }
            
            catch( Exception){
                g.es_print('Can not load session');
                g.es_exception();
            }
        }
        */
        // Enable redraws.
        g.app.disable_redraw = false;
        
        if (!c1){
            try{ // #1403.
                c1 = lm.openEmptyWorkBook();
                    // Calls LM.loadLocalFile.
            }
            catch( Exception){
                g.es_print('Can not create empty workbook');
                g.es_exception();
            }
        }
        c = c1;
        if (!c){
            // Leo is out of options: Force an immediate exit.
            return false;
        }
        // #199.
        // TODO
        // g.app.runAlreadyOpenDialog(c1);

        // Final inits...
        g.app.logInited = true;
        g.app.initComplete = true;
        // c.setLog();
        // c.redraw();
        // g.doHook("start2", c=c, p=c.p, fileName=c.fileName());
        // c.initialFocusHelper();
        const screenshot_fn:string = lm.options['screenshot_fn'];
        if (screenshot_fn){
            lm.make_screen_shot(screenshot_fn);
            return false;  // Force an immediate exit.
        }
        return true;
    }

    public make_screen_shot(fn:string): void {
        // TODO
        console.log('TODO: make_screen_shot');
        /*
        """Create a screenshot of the present Leo outline and save it to path."""
        if g.app.gui.guiName() == 'qt':
            m = g.loadOnePlugin('screenshots')
            m.make_screen_shot(fn)
        */
    }

    /**
     * Open an empty frame and paste the contents of CheatSheet.leo into it.
     */
    public openEmptyWorkBook(): Commander| undefined {
        // TODO
        const lm:LoadManager = this;
        
        /*
        // Create an empty frame.
        const fn:string = lm.computeWorkbookFileName();
        if not fn:
            return None  # #1415
        c = lm.loadLocalFile(fn, gui=g.app.gui, old_c=None)
        if not c:
            return None  # #1201: AttributeError below.
        # Open the cheatsheet, but not in batch mode.
        if not g.app.batchMode and not g.os_path_exists(fn):
            # #933: Save clipboard.
            old_clipboard = g.app.gui.getTextFromClipboard()
            # Paste the contents of CheetSheet.leo into c.
            c2 = c.openCheatSheet(redraw=False)
            if c2:
                for p2 in c2.rootPosition().self_and_siblings():
                    c2.setCurrentPosition(p2)  # 1380
                    c2.copyOutline()
                    p = c.pasteOutline()
                    # #1380 & #1381: Add guard & use vnode methods to prevent redraw.
                    if p:
                        c.setCurrentPosition(p)  # 1380
                        p.v.contract()
                        p.v.clearDirty()
                c2.close(new_c=c)
                # Delete the dummy first node.
                root = c.rootPosition()
                root.doDelete(newNode=root.next())
                c.target_language = 'rest'
                    # Settings not parsed the first time.
                c.clearChanged()
                c.redraw(c.rootPosition())  # # 1380: Select the root.
            # #933: Restore clipboard
            g.app.gui.replaceClipboardWith(old_clipboard)
        return c
        */
        const fn:string = "";
        const c = lm.loadLocalFile(fn,g.app.gui);
        if (!c){
            return undefined;
        }
        return c;
    }

    /**
     * Scan options, set directories and read settings.
     */
    public doPrePluginsInit(fileName?:string):void {
        const lm:LoadManager = this;
        // lm.computeStandardDirectories();
        // lm.adjustSysPath();
            // A do-nothing.
        // Scan the options as early as possible.
        const options = {}; // lm.scanOptions(fileName);
        lm.options = options;

        // const script:string = options['script'];
        // const verbose:boolean = !script;
        // Init the app.
        lm.initApp(); // lm.initApp(verbose);
        // g.app.setGlobalDb()
        // lm.reportDirectories(verbose)
        // Read settings *after* setting g.app.config and *before* opening plugins.
        // This means if-gui has effect only in per-file settings.
        // lm.readGlobalSettingsFiles()
            // reads only standard settings files, using a null gui.
            // uses lm.files[0] to compute the local directory
            // that might contain myLeoSettings.leo.
        // Read the recent files file.
        // localConfigFile = lm.files[0] if lm.files else None
        // g.app.recentFilesManager.readRecentFiles(localConfigFile)
        // Create the gui after reading options and settings.
        // lm.createGui(pymacs)
        // We can't print the signon until we know the gui.
        // g.app.computeSignon()  // Set app.signon/signon1 for commanders.
    }

    public initApp(verbose?:boolean): void {


    /*
        self.createAllImporterData()
            # Can be done early. Uses only g.app.loadDir
        assert g.app.loadManager
        from leo.core import leoBackground
        from leo.core import leoConfig
        from leo.core import leoNodes
        from leo.core import leoPlugins
        from leo.core import leoSessions
        # Import leoIPython only if requested.  The import is quite slow.
        self.setStdStreams()
        if g.app.useIpython:
            from leo.core import leoIPython
                # This launches the IPython Qt Console.  It *is* required.
            assert leoIPython  # suppress pyflakes/flake8 warning.
        # Make sure we call the new leoPlugins.init top-level function.
        leoPlugins.init()
        # Force the user to set g.app.leoID.
        g.app.setLeoID(verbose=verbose)
        # Create early classes *after* doing plugins.init()
        g.app.idleTimeManager = IdleTimeManager()
        g.app.backgroundProcessManager = leoBackground.BackgroundProcessManager()
        g.app.externalFilesController = leoExternalFiles.ExternalFilesController()
        g.app.recentFilesManager = RecentFilesManager()
        g.app.config = leoConfig.GlobalConfigManager()
        g.app.nodeIndices = leoNodes.NodeIndices(g.app.leoID)
        g.app.sessionManager = leoSessions.SessionManager()
        # Complete the plugins class last.
        g.app.pluginsController.finishCreate()
    */

    }

    public loadLocalFile(fn:string, gui:LeoUI, old_c?:Commander):Commander{
        /*Completely read a file, creating the corresonding outline.

        1. If fn is an existing .leo file (possibly zipped), read it twice:
        the first time with a NullGui to discover settings,
        the second time with the requested gui to create the outline.

        2. If fn is an external file:
        get settings from the leoSettings.leo and myLeoSetting.leo, then
        create a "wrapper" outline continain an @file node for the external file.

        3. If fn is empty:
        get settings from the leoSettings.leo and myLeoSetting.leo or default settings,
        or open an empty outline.
        */
        const lm:LoadManager = this;
        let c:Commander| undefined;
        
        // Step 0: Return if the file is already open.
        // fn = g.os_path_finalize(fn);
        
        if (fn){
            c = lm.findOpenFile(fn);
            if (c){
                return c;
            }
        }
        // Step 1: get the previous settings.
        // For .leo files (and zipped .leo files) this pre-reads the file in a null gui.
        // Otherwise, get settings from leoSettings.leo, myLeoSettings.leo, or default settings.
        const previousSettings:any = undefined; // lm.getPreviousSettings(fn);
        
        // Step 2: open the outline in the requested gui.
        // For .leo files (and zipped .leo file) this opens the file a second time.
        c = lm.openFileByName(fn, gui, old_c, previousSettings);
        return c;
    }
    /**
     * Read the local file whose full path is fn using the given gui.
     * fn may be a Leo file (including .leo or zipped file) or an external file.
     *
     * This is not a pre-read: the previousSettings always exist and
     * the commander created here persists until the user closes the outline. 
     *
     * Reads the entire outline if fn exists and is a .leo file or zipped file.
     * Creates an empty outline if fn is a non-existent Leo file.
     * Creates an wrapper outline if fn is an external file, existing or not.
     */
    public openFileByName(fn:string, gui:LeoUI, old_c?:Commander, previousSettings?:any): Commander| undefined{
        const lm:LoadManager = this;
        // Disable the log.
        // g.app.setLog(None);
        // g.app.lockLog();
        
        // Create the a commander for the .leo file.
        // Important.  The settings don't matter for pre-reads!
        // For second read, the settings for the file are *exactly* previousSettings.
        const c:Commander = g.app.newCommander(fn, gui, previousSettings);
        // Open the file, if possible.
        // g.doHook('open0');
        
        /*
        theFile = lm.openLeoOrZipFile(fn);
        if isinstance(theFile, sqlite3.Connection):
            // this commander is associated with sqlite db
            c.sqlite_connection = theFile
        */    
            
        // Enable the log.
        // g.app.unlockLog();
        // c.frame.log.enable(true);
        
        // Phase 2: Create the outline.
        // g.doHook("open1", old_c=None, c=c, new_c=c, fileName=fn)
        /*
        if theFile:
            readAtFileNodesFlag = bool(previousSettings)
            // The log is not set properly here.
            ok = lm.readOpenedLeoFile(c, fn, readAtFileNodesFlag, theFile) // c.fileCommands.openLeoFile(theFile)
                // Call c.fileCommands.openLeoFile to read the .leo file.
            if not ok: return None
        else:
            // Create a wrapper .leo file if:
            // a) fn is a .leo file that does not exist or
            // b) fn is an external file, existing or not.
            lm.initWrapperLeoFile(c, fn)
          
        */  
        // g.doHook("open2", old_c=None, c=c, new_c=c, fileName=fn)
        
        // Phase 3: Complete the initialization.
        // g.app.writeWaitingLog(c)
        // c.setLog()
        // lm.createMenu(c, fn)
        // lm.finishOpen(c); // c.initAfterLoad()
        const ok:boolean = c.fileCommands.openLeoFile(fn);
        return c;
    }

    /**
     * Returns the commander of already opened Leo file
     * returns undefined otherwise
     */
    public findOpenFile(fn:string):Commander | undefined{
        // TODO: check in opened commanders array (g.app.windowList or other as needed)
        /*
        def munge(name):
            return g.os_path_normpath(name or '').lower()

        for frame in g.app.windowList:
            c = frame.c
            if g.os_path_realpath(munge(fn)) == g.os_path_realpath(munge(c.mFileName)):
                # Don't call frame.bringToFront(), it breaks --minimize
                c.setLog()
                # Selecting the new tab ensures focus is set.
                master = getattr(frame.top, 'leo_master', None)
                if master:  # master is a TabbedTopLevel.
                    master.select(frame.c)
                c.outerUpdate()
                return c
        return None
        */
        return undefined;
    }

}

