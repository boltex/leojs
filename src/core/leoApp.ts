//@+leo-ver=5-thin
//@+node:felix.20210102012334.1: * @file src/core/leoApp.ts
//@+<< imports >>
//@+node:felix.20210102211149.1: ** << imports >>
import * as vscode from 'vscode';
import * as Bowser from 'bowser';
import * as os from 'os';
import * as path from 'path';
import * as g from './leoGlobals';
import * as utils from '../utils';
import { LeoGui, NullGui } from './leoGui';
import { NodeIndices, VNode, Position } from './leoNodes';
import { command } from './decorators';
import { Commands } from './leoCommands';
import { FastRead } from './leoFileCommands';
import { GlobalConfigManager, SettingsTreeParser } from './leoConfig';
import { Constants } from '../constants';
import { ExternalFilesController } from './leoExternalFiles';
import { LeoFrame } from './leoFrame';
import { SettingsDict } from './leoGlobals';
import { LeoUI } from '../leoUI';
import { GlobalCacher, SqlitePickleShare } from './leoCache';
// importers
import * as importer_c from '../importers/c';
import * as importer_coffeescript from '../importers/coffeescript';
import * as importer_csharp from '../importers/csharp';
import * as importer_cython from '../importers/cython';
import * as importer_dart from '../importers/dart';
import * as importer_elisp from '../importers/elisp';
import * as importer_html from '../importers/html';
import * as importer_ini from '../importers/ini';
import * as importer_java from '../importers/java';
import * as importer_javascript from '../importers/javascript';
import * as importer_leo_rst from '../importers/leo_rst';
import * as importer_lua from '../importers/lua';
import * as importer_markdown from '../importers/markdown';
import * as importer_org from '../importers/org';
import * as importer_otl from '../importers/otl';
import * as importer_pascal from '../importers/pascal';
import * as importer_perl from '../importers/perl';
import * as importer_php from '../importers/php';
import * as importer_python from '../importers/python';
import * as importer_rust from '../importers/rust';
import * as importer_tcl from '../importers/tcl';
import * as importer_treepad from '../importers/treepad';
import * as importer_typescript from '../importers/typescript';
import * as importer_xml from '../importers/xml';
// writers
import * as writer_dart from '../writers/dart';
import * as writer_leo_rst from '../writers/leo_rst';
import * as writer_markdown from '../writers/markdown';
import * as writer_org from '../writers/org';
import * as writer_otl from '../writers/otl';
import * as writer_treepad from '../writers/treepad';
import { ScriptingController } from './mod_scripting';
import { SessionManager } from './leoSessions';
import { BaseWriter } from '../writers/basewriter';
import * as leoPlugins from './leoPlugins';

//@-<< imports >>
//@+others
//@+node:felix.20210102213337.1: ** class IdleTimeManager
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
    on_idle_count = 0;

    /**
     * Ctor for IdleTimeManager class.
     */
    constructor() {
        this.callback_list = [];
        this.timer = null;
    }

    //@+others
    //@+node:felix.20210102213337.2: *3* itm.add_callback
    /**
     * Add a callback to be called at every idle time.
     */
    public add_callback(callback: (...args: any[]) => any): void {
        this.callback_list.push(callback);
    }
    //@+node:felix.20210102213337.3: *3* itm.on_idle
    /**
     * IdleTimeManager: Run all idle-time callbacks.
     */
    public on_idle(timer: any): void {
        if (!g.app) {
            return;
        }
        if (g.app.killed) {
            return;
        }
        if (!g.app.pluginsController) {
            g.trace('No g.app.pluginsController', g.callers());
            timer.stop();
            return; // For debugger.
        }
        this.on_idle_count += 1;
        // Handle the registered callbacks.
        for (const callback of this.callback_list) {
            try {
                callback();
            } catch (exception) {
                g.es_exception(exception);
                g.es_print(`removing callback: ${callback.toString()}`);
                const index = this.callback_list.indexOf(callback);
                if (index > -1) {
                    // only splice array when item is found
                    this.callback_list.splice(index, 1); // 2nd parameter means remove one item only
                }
                // this.callback_list.remove(callback);
            }
        }
        // Handle idle-time hooks.
        g.app.pluginsController.on_idle();
    }
    //@+node:felix.20210102213337.4: *3* itm.start
    /**
     * Start the idle-time timer.
     */
    public start(): void {
        this.timer = g.IdleTime(
            this.on_idle.bind(this),
            1000, // 500, // ! ORIGINAL INTERVAL IS 500 !
            'IdleTimeManager.on_idle'
        );
        if (this.timer && this.timer.start) {
            this.timer.start(); // this.timer is a idleTimeClass, which can be a dummy object in unit-tests
        }
    }
    //@-others
}

//@+node:felix.20210102214000.1: ** class LeoApp
/**
 * A class representing the Leo application itself.
 * instance variables of this class are Leo's global variables.
 */
export class LeoApp {
    //@+others
    //@+node:felix.20220417164713.1: *3* app.Birth & startup
    //@+node:felix.20210102214029.1: *4* app.__init__ (helpers contain language dicts)
    //@+<< LeoApp: command-line arguments >>
    //@+node:felix.20210103024632.2: *5* << LeoApp: command-line arguments >>
    public commanderIdCounter = 0; // Used for generating commander ids. (Replaces python id) Increment before using, so first one is 1.
    // TODO : CHECK IF always_write_session_data IS NEEDED ! 
    public always_write_session_data: boolean = false;  // Default: write session data only if no files on command line.

    public batchMode: boolean = false; // True: run in batch mode.
    public debug: string[] = []; // A list of switches to be enabled.
    public diff: boolean = false; // True: run Leo in diff mode.
    public enablePlugins: boolean = true; // True: run start1 hook to load plugins. --no-plugins
    public failFast: boolean = false; // True: Use the failfast option in unit tests.
    public gui!: NullGui; // The gui class.
    public guiArgName: string | undefined; // The gui name given in --gui option.
    public listen_to_log_flag: boolean = false; // True: execute listen-to-log command.
    public loaded_session: boolean = false; // Set at startup if no files specified on command line.
    public silentMode: boolean = false; // True: no sign-on.
    public trace_binding: string | undefined; // The name of a binding to trace, or None.
    public trace_setting: string | undefined; // The name of a setting to trace, or None.
    public write_black_sentinels = false; // True: write a space befor '@' in sentinel lines.

    //@-<< LeoApp: command-line arguments >>
    //@+<< LeoApp: Debugging & statistics >>
    //@+node:felix.20210103024632.3: *5* << LeoApp: Debugging & statistics >>
    public debug_dict: any = {}; // For general use.
    public disable_redraw: boolean = false; // True: disable all redraws.
    public disableSave: boolean = false; // May be set by plugins.
    public idle_timers: any[] = []; // A list of IdleTime instances, so they persist.
    public log_listener: any = null; // The process created by the 'listen-for-log' command.
    public positions: number = 0; // The number of positions generated.
    public scanErrors: number = 0; // The number of errors seen by g.scanError.
    public statsDict: any = {}; // dict used by g.stat, g.clear_stats, g.print_stats.
    public statsLockout: boolean = false; // A lockout to prevent unbound recursion while gathering stats.
    public validate_outline: boolean = false; // True: enables c.validate_outline. (slow)
    public iconWidgetCount: number = 0;
    public iconImageRefs: any[] = [];

    //@-<< LeoApp: Debugging & statistics >>
    //@+<< LeoApp: error messages >>
    //@+node:felix.20210103024632.4: *5* << LeoApp: error messages >>
    public menuWarningsGiven: boolean = false; // True: suppress warnings in menu code.
    public unicodeErrorGiven: boolean = true; // True: suppress unicode trace-backs.

    //@-<< LeoApp: error messages >>
    //@+<< LeoApp: global directories >>
    //@+node:felix.20210103024632.5: *5* << LeoApp: global directories >>
    // public extensionsDir: string | undefined; // The leo / extensions directory // UNUSED in leojs
    public globalConfigDir: string | undefined; // leo / config directory
    public globalOpenDir: string | undefined; // The directory last used to open a file.
    public homeDir: string | undefined; // The user's home directory.
    public homeLeoDir: string | undefined; // The user's home/.leo directory.
    public leoEditorDir: string | undefined; // The leo-editor directory.
    public testDir: string | undefined; // Used in unit tests
    public loadDir: string | undefined; // The leo / core directory.
    public machineDir: string | undefined; // The machine - specific directory.

    //@-<< LeoApp: global directories >>
    //@+<< LeoApp: global data >>
    //@+node:felix.20210103024632.6: *5* << LeoApp: global data >>
    public atAutoNames: string[] = []; // The set of all @auto spellings.
    public atFileNames: string[] = []; // The set of all built -in @<file>spellings.

    public globalKillBuffer: string[] = []; // The global kill buffer.
    public globalRegisters: any = {}; // The global register list.
    public initial_cwd: string = process.cwd(); // For restart-leo.
    public leoID: string = ''; // The id part of gnx's, using empty for falsy.
    public LeoIDWarningShown = false; // LEOJS : to prevent second warning. (Original would have exited before)
    public loadedThemes: any[] = []; // List of loaded theme.leo files.
    public lossage: any[] = []; // List of last 100 keystrokes.
    public paste_c: any = null; // The commander that pasted the last outline.
    public spellDict: any = null; // The singleton PyEnchant spell dict.
    public numberOfUntitledWindows: number = 0; // Number of opened untitled windows.
    public windowList: LeoFrame[] = []; // * Global list of all frames.
    public realMenuNameDict = {}; // Translations of menu names.

    //@-<< LeoApp: global data >>
    //@+<< LeoApp: global controller/manager objects >>
    //@+node:felix.20210103024632.7: *5* << LeoApp: global controller/manager objects >>
    // Most of these are defined in initApp.
    public backgroundProcessManager: any = null; // The singleton BackgroundProcessManager instance.
    public config!: GlobalConfigManager; // The singleton leoConfig instance.
    public db!: SqlitePickleShare | Record<string, any>; // The singleton global db, managed by g.app.global_cacher.
    public externalFilesController: ExternalFilesController | undefined; // The singleton ExternalFilesController instance.
    public global_cacher!: GlobalCacher; // The singleton leoCacher.GlobalCacher instance.
    public idleTimeManager!: IdleTimeManager; // The singleton IdleTimeManager instance.
    public loadManager: LoadManager | undefined; // The singleton LoadManager instance.
    // public logManager: any = null;
    // The singleton LogManager instance.
    // public openWithManager: any = null;
    // The singleton OpenWithManager instance.
    public nodeIndices: NodeIndices | undefined; // The singleton nodeIndices instance.
    public pluginsController!: leoPlugins.LeoPluginsController; // The singleton PluginsManager instance. 
    public recentFilesManager!: RecentFilesManager;
    public sessionManager!: SessionManager; // The singleton SessionManager instance. 
    // The Commands class...
    public commandName: any = null; // The name of the command being executed.
    public commandInterruptFlag: boolean = false; // True: command within a command.

    //@-<< LeoApp: global controller/manager objects >>
    //@+<< LeoApp: global reader/writer data >>
    //@+node:felix.20210103024632.8: *5* << LeoApp: global reader/writer data >>
    // From leoAtFile.py.
    public atAutoWritersDict: Record<string, (...args: any[]) => any> = {};
    public writersDispatchDict: Record<string, typeof BaseWriter> = {};

    // From leoImport.py
    // Keys are @auto names, values are scanner functions..
    public atAutoDict: Record<string, (...args: any[]) => any> = {};
    public classDispatchDict: Record<string, (...args: any[]) => any> = {};

    // True if an @auto writer should write sentinels,
    // even if the external file doesn't actually contain sentinels.
    public force_at_auto_sentinels = false;

    // leo 5.6: allow undefined section references in all @auto files.
    // Leo 6.6.4: Make this a permanent g.app ivar.
    public allow_undefined_refs = false;
    //@-<< LeoApp: global reader/writer data >>
    //@+<< LeoApp: global status vars >>
    //@+node:felix.20210103024632.9: *5* << LeoApp: global status vars >>
    public already_open_files: string[] = []; // A list of file names that * might * be open in another copy of Leo.
    public inBridge: boolean = false; // True: running from leoBridge module.
    public inScript: boolean = false; // True: executing a script.
    public initing: boolean = true; // True: we are initializing the app.
    public initComplete: boolean = false; // True: late bindings are not allowed.
    public killed: boolean = false; // True: we are about to destroy the root window.

    public preReadFlag: boolean = false; // True: we are pre - reading a settings file.
    public quitting: boolean = false; // True: quitting.Locks out some events.
    public restarting: boolean = false; // True: restarting all of Leo.#1240.
    public reverting: boolean = false; // True: executing the revert command.
    public syntax_error_files: string[] = [];

    //@-<< LeoApp: global status vars >>
    //@+<< LeoApp: the global log >>
    //@+node:felix.20210103024632.10: *5* << LeoApp: the global log >>
    // To be moved to the LogManager.
    public log = null; // The LeoFrame containing the present log.
    public logInited: boolean = false; // False: all log message go to logWaiting list.
    public logIsLocked: boolean = false; // True: no changes to log are allowed.
    public logWaiting: any[] = []; // List of tuples(s, color, newline) waiting to go to a log.
    public printWaiting: any[] = []; // Queue of messages to be sent to the printer.
    public signon: string = '';
    public signon1: string = '';
    public signon2: string = '';

    //@-<< LeoApp: the global log >>
    //@+<< LeoApp: global theme data >>
    //@+node:felix.20210103024632.11: *5* << LeoApp: global theme data >>
    public theme_directory = null;
    // The directory from which the theme file was loaded, if any.
    // Set only by LM.readGlobalSettingsFiles.
    // Used by the StyleSheetManager class.

    //@-<< LeoApp: global theme data >>
    //@+<< LeoApp: global types >>
    //@+node:felix.20210103024632.12: *5* << LeoApp: global types >>
    /*
    from leo.core import leoFrame
    from leo.core import leoGui

    */
    public nullGui = new NullGui();
    // public nullLog = new NullLog();

    //@-<< LeoApp: global types >>
    //@+<< LeoApp: plugins and event handlers >>
    //@+node:felix.20210103024632.13: *5* << LeoApp: plugins and event handlers >>
    public hookError: boolean = false; // True: suppress further calls to hooks.
    // g.doHook sets g.app.hookError on all exceptions.
    // Scripts may reset g.app.hookError to try again.
    public hookFunction!: (tag: string, keys: Record<string, any>) => any;
    // Application wide hook function.
    public idle_time_hooks_enabled: boolean = true;
    // True: idle - time hooks are enabled.

    //@-<< LeoApp: plugins and event handlers >>
    //@+<< LeoApp: scripting ivars >>
    //@+node:felix.20210103024632.14: *5* << LeoApp: scripting ivars >>
    public searchDict: any = {};
    // For communication between find / change scripts.
    public scriptDict: any = {};
    // For use by scripts.Cleared before running each script.
    public scriptResult = null; // For use by leoPymacs.
    public permanentScriptDict = {}; // For use by scrips.Never cleared automatically.

    public isExternalUnitTest: boolean = false; // True: we are running a unit test externally.
    public runningAllUnitTests: boolean = false; // True: we are running all unit tests(Only for local tests).

    //@-<< LeoApp: scripting ivars >>
    //@+<< LeoApp: unit testing ivars >>
    //@+node:felix.20210103024632.15: *5* << LeoApp: unit testing ivars >>
    public suppressImportChecks: boolean = false;
    // Used only in basescanner.py ;
    // True: suppress importCommands.check
    public unitTestDict = {}; // For communication between unit tests and code.
    public unitTestGui = null; // A way to override the gui in external unit tests.
    public unitTesting = false; // True if unit testing.
    public unitTestMenusDict = {}; // Created in LeoMenu.createMenuEntries for a unit test. ;   // keys are command names.values are sets of strokes.

    //@-<< LeoApp: unit testing ivars >>

    public delegate_language_dict: { [key: string]: string } = {};
    public extension_dict: { [key: string]: string } = {};
    public extra_extension_dict: { [key: string]: string } = {};
    public prolog_prefix_string: string = '';
    public prolog_postfix_string: string = '';
    public prolog_namespace_string: string = '';
    public language_delims_dict: { [key: string]: string } = {};
    public language_extension_dict: { [key: string]: string } = {};

    //@+others
    //@+node:felix.20210102214102.1: *5* constructor
    constructor() {
        // Define all global data.
        this.init_at_auto_names();
        this.init_at_file_names();
        this.define_global_constants();
        this.define_language_delims_dict();
        this.define_language_extension_dict();
        this.define_extension_dict();
        this.define_delegate_language_dict();
        // this.gui = p_gui;
        // this.nodeIndices = new NodeIndices(g.app.leoID);
    }

    //@+node:felix.20210103024632.16: *5* app.define_delegate_language_dict
    public define_delegate_language_dict(): void {
        this.delegate_language_dict = {
            // Keys are new language names.
            codon: "python",
            elisp: "lisp",
            glsl: "c",
            handlebars: "html",
            hbs: "html",
            less: "css",
            katex: "html",  // Leo 6.8.4
            mathjax: "html",  // Leo 6.8.4
            toml: "ini",
            typst: "rest",  // Leo 6.8.4
            // Values are existing languages in leo / modes.
        };
    }

    //@+node:felix.20210103024632.17: *5* app.define_extension_dict
    public define_extension_dict(): void {
        // Keys are extensions, values are languages
        this.extension_dict = {

            // "ada":    "ada",
            "ada": "ada95", // modes/ada95.py exists.
            "ahk": "autohotkey",
            "aj": "aspect_j",
            "apdl": "apdl",
            "as": "actionscript", // jason 2003-07-03
            "asp": "asp",
            "awk": "awk",
            "b": "b",
            "bas": "rapidq", // fil 2004-march-11
            "bash": "shellscript",
            "bat": "batch",
            "bbj": "bbj",
            "bcel": "bcel",
            "bib": "bibtex",
            "c": "c",
            "c++": "cplusplus",
            "cbl": "cobol", // Only one extension is valid: .cob
            "cc": "cplusplus",
            "cfg": "config",
            "cfm": "coldfusion",
            "ch": "chill", // Other extensions, .c186,.c286
            "clj": "clojure", // 2013/09/25: Fix bug 879338.
            "cljc": "clojure",
            "cljs": "clojure",
            "cmd": "batch",
            "codon": "codon",
            "coffee": "coffeescript",
            "comp": "glsl",
            "conf": "apacheconf",
            "cpp": "cplusplus", // 2020/08/12: was cpp.
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
            "frag": "glsl",
            "g": "antlr",
            "geom": "glsl",
            "glsl": "glsl",
            "go": "go",
            "groovy": "groovy",
            "h": "c", // 2012/05/23.
            "hh": "cplusplus",
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
            "ipynb": "jupytext",
            "iss": "inno_setup",
            "java": "java",
            "jhtml": "jhtml",
            "jl": "julia",
            "jmk": "jmk",
            "js": "javascript", // For javascript import test.
            "jsp": "javaserverpage",
            "json": "json",
            // "jsp":      "jsp",
            "ksh": "kshell",
            "kv": "kivy", // PeckJ 2014/05/05
            "latex": "latex",
            "less": "css", // McNab
            "lua": "lua", // ddm 13/02/06
            "ly": "lilypond",
            "m": "matlab",
            "mak": "makefile",
            "md": "md",  // PeckJ 2013/02/07
            "ml": "ml",  // Also ocaml.
            "mm": "objective_c", // Only one extension is valid: .m
            "mod": "modula3",
            "mpl": "maple",
            "mqsc": "mqsc",
            "nqc": "nqc",
            "nim": "nim",
            "nsi": "nsi", // EKR: 2010/10/27
            // "nsi":      "nsis2",
            "nw": "noweb",
            "occ": "occam",
            "otl": "vimoutline", // TL 8/25/08 Vim's outline plugin
            "p": "pascal",
            // "p":      "pop11", // Conflicts with pascal.
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
            // "pyx":    "pyrex",
            // "r":      "r", // modes/r.py does not exist.
            "r": "rebol", // jason 2003-07-03
            "rb": "ruby", // thyrsus 2008-11-05
            "rest": "rst",
            "rex": "objectrexx",
            "rhtml": "rhtml",
            "rib": "rib",
            "rs": "rust", // EKR: 2019/08/11
            "sas": "sas",
            "scad": "openscad", // PeckJ 2024/11/13
            "scala": "scala",
            "scm": "scheme",
            "scpt": "applescript",
            "sgml": "sgml",
            "sh": "shell", // DS 4/1/04. modes/shell.py exists.
            "shtml": "shtml",
            "sm": "smalltalk",
            "splus": "splus",
            "sql": "plsql", // qt02537 2005-05-27
            "sqr": "sqr",
            "ss": "ssharp",
            "ssi": "shtml",
            "sty": "latex",
            "tcl": "tcl", // modes/tcl.py exists.
            // "tcl":    "tcltk",
            "tesc": "glsl",
            "tese": "glsl",
            "tex": "latex",
            // "tex":      "tex",
            "toml": "toml",
            "tpl": "tpl",
            "ts": "typescript",
            "txt": "plain",
            // "txt":      "text",
            // "txt":      "unknown", // Set when @comment is seen.
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
            "vert": "glsl",
            "vue": "javascript",
            "zpt": "zpt",
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
            pod: 'perl',
            unknown_language: 'none',
            w: 'none', // cweb
        };
    }

    //@+node:felix.20210103024632.18: *5* app.define_global_constants
    public define_global_constants(): void {
        // this.prolog_string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        this.prolog_prefix_string = '<?xml version="1.0" encoding=';
        this.prolog_postfix_string = '?>';
        // this.prolog_namespace_string = 'xmlns:leo="http://edreamleo.org/namespaces/leo-python-editor/1.1"';
        this.prolog_namespace_string =
            'xmlns:leo="https://leo-editor.github.io/leo-editor/namespaces/leo-python-editor/1.1"';
    }

    //@+node:felix.20210103024632.19: *5* app.define_language_delims_dict
    public define_language_delims_dict(): void {
        this.language_delims_dict = {
            // Internally, lower case is used for all language names.
            // Keys are languages, values are strings that contain 1, 2 or 3 delims separated by spaces.
            "actionscript": "// /* */", // jason 2003-07-03
            "ada": "--",
            "ada95": "--",
            "ahk": ";",
            "antlr": "// /* */",
            "apacheconf": "#",
            "apdl": "!",
            "applescript": "-- (* *)",
            "asp": "<!-- -->",
            "aspect_j": "// /* */",
            "assembly_6502": ";",
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
            "clojure": ";", // 2013/09/25: Fix bug 879338.
            "cobol": "*",
            "codon": "#",
            "coldfusion": "<!-- -->",
            "coffeescript": "#", // 2016/02/26.
            "config": "#", // Leo 4.5.1
            "cplusplus": "// /* */",
            "cpp": "// /* */", // C++.
            "csharp": "// /* */", // C#
            "css": "/* */", // 4/1/04
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
            "glsl": "// /* */",  // Same as C.
            "go": "//",
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
            "javascript": "// /* */", // EKR: 2011/11/12: For javascript import test.
            "javaserverpage": "<%-- --%>", // EKR: 2011/11/25 (See also, jsp)
            "jhtml": "<!-- -->",
            "jmk": "#",
            "json": "#", // EKR: 2020/07/27: Json has no delims. This is a dummy entry.
            "jsp": "<%-- --%>",
            "julia": "#",
            "jupyter": "<%-- --%>", // Default to markdown?
            "jupytext": "#",
            "katex": "%", // Leo 6.8.7. 
            "kivy": "#", // PeckJ 2014/05/05
            "kshell": "#", // Leo 4.5.1.
            "latex": "%",
            "less": "/* */", // NcNab: delegate to css.
            "lilypond": "% %{ %}",
            "lisp": ";", // EKR: 2010/09/29
            "lotos": "(* *)",
            "lua": "--", // ddm 13/02/06
            "mail": ">",
            "makefile": "#",
            "maple": "//",
            "markdown": "<!-- -->", // EKR, 2018/03/03: html comments.
            "matlab": "%", // EKR: 2011/10/21
            "mathjax": "% <!-- -->", // EKR: 2024/12/27: latex & html comments.

            "md": "<!-- -->", // PeckJ: 2013/02/08
            "ml": "(* *)",
            "modula3": "(* *)",
            "moin": "##",
            "mqsc": "*",
            "netrexx": "-- /* */",
            "nim": "#",
            "noweb": "%", // EKR: 2009-01-30. Use Latex for doc chunks.
            "nqc": "// /* */",
            "nsi": ";", // EKR: 2010/10/27
            "nsis2": ";",

            "objective_c": "// /* */",
            "objectrexx": "-- /* */",
            "occam": "--",
            "ocaml": "(* *)",
            "omnimark": ";",
            "pandoc": "<!-- -->",
            "openscad": "// /* */", // EKR: 2024/11/13: same as "C".
            "pascal": "// { }",
            "perl": "#",
            "perlpod": "# __=pod__ __=cut__", // 9/25/02: The perlpod hack.
            "php": "// /* */", // 6/23/07: was "//",
            "pike": "// /* */",
            "pl1": "/* */",
            "plain": "#", // We must pick something.
            "plsql": "-- /* */", // SQL scripts qt02537 2005-05-27
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
            "rapidq": "'", // fil 2004-march-11
            "rebol": ";", // jason 2003-07-03
            "redcode": ";",
            "rest": ".._",
            "rhtml": "<%# %>",
            "rib": "#",
            "rpmspec": "#",
            "rst": ".._",
            "rust": "// /* */",
            "ruby": "#", // thyrsus 2008-11-05
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
            "tex": "%", // Bug fix: 2008-1-30: Fixed Mark Edginton's bug.
            "text": "#", // We must pick something.
            "texinfo": "@c",
            "toml": "#",
            "tpl": "<!-- -->",
            "tsql": "-- /* */",
            "typst": "//",
            "typescript": "// /* */", // For typescript import test.
            "unknown": "#", // Set when @comment is seen.
            "unknown_language": '#--unknown-language--', // For unknown extensions in @shadow files.
            "uscript": "// /* */",
            "vbscript": "'",
            "velocity": "## #* *#",
            "verilog": "// /* */",
            "vhdl": "--",
            "vim": "\"",
            "vimoutline": "#", // TL 8/25/08 Vim's outline plugin
            "xml": "<!-- -->",
            "xsl": "<!-- -->",
            "xslt": "<!-- -->",
            "yaml": "#",
            "zpt": "<!-- -->",

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

    //@+node:felix.20210103024632.20: *5* app.define_language_extension_dict
    public define_language_extension_dict(): void {
        // Used only by g.app.externalFilesController.get_ext.

        // Keys are languages, values are extensions.
        this.language_extension_dict = {
            "actionscript": "as", // jason 2003-07-03
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
            "chill": "ch",  // Only one extension is valid: .c186, .c286
            "clojure": "clj", // 2013/09/25: Fix bug 879338.
            "cobol": "cbl", // Only one extension is valid: .cob
            "codon": "codon",
            "coldfusion": "cfm",
            "coffeescript": "coffee",
            "config": "cfg",
            "cplusplus": "c++",
            "cpp": "cpp",
            "css": "css", // 4/1/04
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
            "glsl": "glsl",  // .comp, .frag, .geom, .tesc, .tese, .vert.
            "go": "go",
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
            "julia": "jl",
            "jupytext": "ipynb",
            "kivy": "kv", // PeckJ 2014/05/05
            "kshell": "ksh", // Leo 4.5.1.
            "latex": "tex", // 1/8/04
            "lilypond": "ly",
            "lua": "lua", // ddm 13/02/06
            "mail": "eml",
            "makefile": "mak",
            "maple": "mpl",
            "matlab": "m",
            "md": "md", // PeckJ: 2013/02/07
            "ml": "ml",  // Also ocaml.
            "modula3": "mod",
            "moin": "wiki",
            "mqsc": "mqsc",
            "nim": "nim",
            "noweb": "nw",
            "nqc": "nqc",
            "nsi": "nsi", // EKR: 2010/10/27
            "nsis2": "nsi",
            "objective_c": "mm", // Only one extension is valid: .m
            "objectrexx": "rex",
            "occam": "occ",
            "ocaml": "ml",
            "omnimark": "xom",
            "openscad": "scad", // EKR, per PeckJ 2024/11/13
            "pascal": "p",
            "perl": "pl",
            "perlpod": "pod",
            "php": "php",
            "pike": "pike",
            "pl1": "pl1",
            "plain": "txt",
            "plsql": "sql", // qt02537 2005-05-27
            // "pop11"       : "p", // Conflicts with pascal.
            "postscript": "ps",
            "povray": "pov",
            "prolog": "pro",
            "psp": "psp",
            "ptl": "ptl",
            "pyrex": "pyx",
            "python": "py",
            "r": "r",
            "rapidq": "bas", // fil 2004-march-11
            "rebol": "r", // jason 2003-07-03
            "rhtml": "rhtml",
            "rib": "rib",
            "rst": "rest",
            "ruby": "rb", // thyrsus 2008-11-05
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
            "toml": "toml",
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
            "vimoutline": "otl", // TL 8/25/08 Vim's outline plugin
            "xml": "xml",
            "xsl": "xsl",
            "xslt": "xsl",
            "yaml": "yaml",
            "zpt": "zpt",
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

    //@+node:felix.20210103024632.21: *5* app.init_at_auto_names
    /**
     * Init the app.atAutoNames set.
     */
    public init_at_auto_names(): void {
        this.atAutoNames = ['@auto-rst', '@auto'];
    }

    //@+node:felix.20210103024632.22: *5* app.init_at_file_names
    /**
     * Init the app.atFileNames set.
     */
    public init_at_file_names(): void {
        this.atFileNames = [
            '@asis',
            '@clean',
            '@edit',
            '@file-asis',
            '@file-thin',
            '@file-nosent',
            '@file',
            '@nosent',
            '@shadow',
            '@thin',
        ];
    }

    //@-others

    //@+node:felix.20220417165216.1: *4* app.computeSignon & printSignon
    public computeSignon(): void {
        const app = this;
        if (app.signon && app.signon1) {
            return;
        }

        let guiVersion = 'VSCode version ' + vscode.version;

        const w_LeoJSExtension = vscode.extensions.getExtension(
            Constants.PUBLISHER + '.' + Constants.NAME
        )!;
        const w_leojsPackageJson = w_LeoJSExtension.packageJSON;

        const leoVer: string = w_leojsPackageJson.version;

        // n1, n2, n3, junk1, junk2 = sys.version_info
        let n1: string = '';
        if (process.version) {
            n1 = 'Node.js ' + process.version;
            // // @ts-expect-error
        } else if (location.hostname) {
            // // @ts-expect-error
            n1 = location.hostname;
            // if dots take 2 last parts
            if (n1.includes('.')) {
                let n1_split = n1.split('.');
                if (n1_split.length > 2) {
                    n1_split = n1_split.slice(-2);
                }
                n1 = n1_split.join('.');
            }
        }
        if (n1) {
            n1 += ', ';
        }

        let sysVersion: string = 'Browser';
        let arch = "";
        let version = "";
        let release = "";
        if (process.platform) {
            sysVersion = process.platform;
            if (sysVersion.toLowerCase().startsWith("win") && os.version) {
                version = os.version();
            } else {
                version = sysVersion;
            }
            if (os.arch) {
                arch = os.arch();
            }
            if (os.release) {
                release = os.release();
            }
            if (arch && version) {
                sysVersion = version + " " + arch + (release ? ` (build ${release})` : "");
            }

        } else {
            let browserResult: any;
            if (navigator.userAgent) {
                browserResult = Bowser.parse(navigator.userAgent);
                sysVersion = browserResult.browser.name;
                if (browserResult.browser.version) {
                    sysVersion += ' ' + browserResult.browser.version;
                }

                if (browserResult.os) {
                    if (browserResult.os.name) {
                        sysVersion += ' on ' + browserResult.os.name;
                    }
                    if (browserResult.os.version) {
                        sysVersion += ' ' + browserResult.os.version;
                    }
                }
            }
        }

        // branch, junk_commit = g.gitInfo()
        const branch = w_leojsPackageJson.gitBranch;

        // author, commit, date = g.getGitVersion()
        const commit = w_leojsPackageJson.gitCommit;
        const date = w_leojsPackageJson.gitDate;

        // Compute g.app.signon.
        const signon: string[] = [`LeoJS ${leoVer}`];
        if (branch) {
            signon.push(`, ${branch} branch`);
        }
        if (commit) {
            signon.push(', build ' + commit);
        }
        if (date) {
            signon.push('\n' + date);
        }
        app.signon = signon.join('');
        // Compute g.app.signon1.
        app.signon1 = `${n1}${guiVersion}\n${sysVersion}`;
    }

    /**
     * Print the signon to the log.
     */
    public printSignon(): void {
        const app = this;

        if (app.silentMode) {
            return;
        }
        /*         
        if (sys.stdout.encoding && sys.stdout.encoding.lower() !== 'utf-8'){
            console.log('Note: sys.stdout.encoding is not UTF-8');
            console.log(`Encoding is: ${sys.stdout.encoding}`);
            console.log('See: https://stackoverflow.com/questions/14109024');
            console.log('');
        }
        */
        // * Modified for leojs SINGLE log pane
        // g.es_print(app.signon);
        // g.es_print(app.signon1);

        // Is this the first possible valid output to log pane?
        // If so empty the log Buffer first.
        const buffer = g.logBuffer;
        buffer.unshift(app.signon1);
        buffer.unshift(app.signon);

        if (buffer.length) {
            let len = buffer.length; // Only do loop once if logPano not visible
            while (len > 0) {
                // Pop the bottom one and append it
                g.es_print(buffer.shift()!);
                len = len - 1;
            }
        }
    }
    //@+node:felix.20230805210538.1: *4* app.setGlobalDb
    /**
     * Create global pickleshare db
     *
     * Usable by:
     *
     *    g.app.db['hello'] = [1,2,5]
     */
    public async setGlobalDb(): Promise<void> {

        // Fixes bug 670108.

        g.app.global_cacher = new GlobalCacher();
        await g.app.global_cacher.init();
        g.app.db = g.app.global_cacher.db;

    }
    //@+node:felix.20220417215228.1: *4* app.setLeoID & helpers
    /**
     * Get g.app.leoID from various sources.
     */
    public async setLeoID(
        useDialog: boolean = true,
        verbose: boolean = true
    ): Promise<string> {
        this.leoID = '';
        g.assert(this === g.app);
        verbose = verbose && !g.unitTesting && !this.silentMode;

        const table = [this.setIDFromConfigSetting, this.setIDFromFile, this.setIDFromEnv];

        for (const func of table) {
            await func.bind(this)(verbose);
            if (this.leoID) {
                return this.leoID;
            }
        }
        if (useDialog) {
            await this.setIdFromDialog();
            if (this.leoID) {
                await this.setIDFile();
            }
        }
        if (!this.leoID) {
            // LeoJS UI will block all commands at startup if LeoID is None/Falsy.
            this.leoID = 'None';
        }

        return this.leoID;
    }

    //@+node:felix.20220417215228.2: *5* app.cleanLeoID
    /**
     * #1404: Make sure that the given Leo ID will not corrupt a .leo file.
     */
    public cleanLeoID(id_: string, tag: string): string {
        const old_id: string = id_.toString();
        try {
            id_ = id_
                .replace(/\./g, '')
                .replace(/\,/g, '')
                .replace(/\"/g, '')
                .replace(/\'/g, '');
            //  Remove *all* whitespace: https://stackoverflow.com/questions/3739909
            id_ = id_.split(' ').join('');
        } catch (exception) {
            g.es_exception(exception);
            id_ = '';
        }
        if (id_.length < 3) {
            id_ = '';
            if (!this.LeoIDWarningShown) {
                this.LeoIDWarningShown = true;
                void vscode.window.showInformationMessage(
                    `Invalid Leo ID: ${tag}`,
                    {
                        detail:
                            `Invalid Leo ID: ${old_id}\n\n` +
                            'Your id should contain only letters and numbers\n' +
                            'and must be at least 3 characters in length.',
                        modal: true,
                    }
                );
            }
        }
        return id_;
    }

    //@+node:felix.20240303184439.1: *5* app.setIDFromConfigSetting
    public setIDFromConfigSetting(verbose: boolean): Promise<void> {
        let w_userName = '';
        // 1 - set leoID from configuration settings
        if (!this.leoID && vscode && vscode.workspace) {
            w_userName = vscode.workspace
                .getConfiguration(Constants.CONFIG_NAME)
                .get(
                    Constants.CONFIG_NAMES.LEO_ID,
                    Constants.CONFIG_DEFAULTS.LEO_ID
                );
            if (w_userName) {
                this.leoID = this.cleanLeoID(w_userName, 'config.leoID');
            }
        }
        return Promise.resolve();
    }
    //@+node:felix.20240303184448.1: *5* app.setIDFromFile
    /** 
     * Attempt to set g.app.leoID from leoID.txt.
     */
    public async setIDFromFile(verbose: boolean): Promise<void> {
        if (g.isBrowser) {
            return;
        }
        const tag = ".leoID.txt";
        for (const theDir of [this.homeLeoDir, this.globalConfigDir, this.loadDir]) {
            if (!theDir) {
                continue;  // Do not use the current directory!
            }
            const fn = g.os_path_join(theDir, tag);
            try {
                const exists = await g.os_path_exists(fn);
                if (!exists) {
                    continue;
                }
                // * Desktop
                let s = await g.readFileIntoUnicodeString(fn);
                if (!s) {
                    continue;
                }
                // #1404: Ensure valid ID.
                // cleanLeoID raises a warning dialog.
                const id_ = this.cleanLeoID(s, tag).split('\n')[0].trim(); // get first line
                if (id_.length > 2) {
                    this.leoID = id_;
                    return;
                }

            } catch (exception) {
                g.error('unexpected exception in app.setLeoID');
                g.es_exception(exception);
            }
        }
    }
    //@+node:felix.20240303184457.1: *5* app.setIDFromEnv
    public setIDFromEnv(verbose: boolean): Promise<void> {
        if (os && os.userInfo) {
            const userName = os.userInfo().username;
            if (userName) {
                this.leoID = this.cleanLeoID(
                    userName,
                    'os.userInfo().username'
                );
            }
        }
        return Promise.resolve();
    }
    //@+node:felix.20240303184507.1: *5* app.setIdFromDialog
    /**
     * Get leoID from a VSCode dialog.
     */
    public async setIdFromDialog(): Promise<void> {

        // Get the id, making sure it is at least three characters long.
        let attempt = 0;
        let id_ = "";
        while (attempt < 2) {
            attempt += 1;
            const dialogVal = await g.IDDialog();
            // #1404: Make sure the id will not corrupt the .leo file.
            //        cleanLeoID raises a warning dialog.
            id_ = this.cleanLeoID(dialogVal, "");
            if (id_ && id_.length > 2) {
                break;
            }
        }

        // Put result in g.app.leoID.
        // Note: For unit tests, leoTest2.py: create_app sets g.app.leoID.
        if (!id_) {
            // g.es_print('Leo can not start without an id.');
            // * LeoJS will block all commands instead until re-set by user.
            // print('Leo will now exit');
            // sys.exit(1) 
        } else {
            this.leoID = id_;
            if (this.leoID) {
                g.blue('leoID=' + this.leoID);
            }
        }

    }
    //@+node:felix.20240303184516.1: *5* app.setIDFile
    /** 
     * Create leoID.txt. Also set LeoJS own leoID config setting.
     */
    public async setIDFile(): Promise<boolean> {

        if (g.isBrowser) {
            // Set LeoJS vscode config ONLY IF ".leoID.txt" NOT WRITTEN
            // TODO : SEPARATE VSCODE AND LEO !
            if (this.leoID && vscode && vscode.workspace) {
                const w_vscodeConfig = vscode.workspace.getConfiguration(
                    Constants.CONFIG_NAME
                );

                if (
                    w_vscodeConfig.inspect(Constants.CONFIG_NAMES.LEO_ID)!
                        .defaultValue === this.leoID
                ) {
                    // Set as undefined - same as default
                    await w_vscodeConfig.update(
                        Constants.CONFIG_NAMES.LEO_ID,
                        undefined,
                        true
                    );
                } else {
                    // Set as value which is not default
                    await w_vscodeConfig.update(
                        Constants.CONFIG_NAMES.LEO_ID,
                        this.leoID,
                        true
                    );
                }
            }
            return false;
        }
        // If desktop (not browser) write to .leoID.txt file
        const tag = ".leoID.txt";
        for (const theDir of [this.homeLeoDir, this.globalConfigDir, this.loadDir]) {
            if (theDir) {
                try {
                    const fn = g.os_path_join(theDir, tag);

                    // with open(fn, 'w') as f
                    //     f.write(self.leoID)
                    await g.writeFile(this.leoID, 'utf8', fn);

                    const w_exists = await g.os_path_exists(fn);
                    if (w_exists) {
                        g.error('', tag, 'created in', theDir);
                    }

                    return !!w_exists;

                }
                catch (IOError) {
                    //pass
                }
                g.error('can not create', tag, 'in', theDir);
            }
        }

        return false;
    }
    //@+node:testttt.20240305234320.1: *4* app.setLog, lockLog, unlocklog
    // def setLog(self, log: Any) -> None:
    //     """set the frame to which log messages will go"""
    //     if not self.logIsLocked:
    //         self.log = log

    /**
     * Disable changes to the log
     */
    public lockLog(): void {
        // print("app.lockLog:")
        this.logIsLocked = true;
    }

    /**
     * Enable changes to the log
     */
    public unlockLog(): void {
        // print("app.unlockLog:")
        this.logIsLocked = false;
    }
    //@+node:felix.20220511231737.1: *3* app.Closing
    //@+node:felix.20220511231737.2: *4* app.closeLeoWindow
    /**
     * Attempt to close a Leo window.
     *
     * Return False if the user veto's the close.
     *
     * finish_quit - usually True, * FALSE IN LEOJS. USED TO FORCE QUIT ! * 
     *               close Leo when last file closes, but
     *               False when closing an already-open-elsewhere file
     *               during initial load, so UI remains for files
     *               further along the command line.
     */
    public async closeLeoWindow(
        frame: LeoFrame,
        new_c?: Commands,
        finish_quit = false
    ): Promise<boolean> {
        const c = frame.c;
        if (g.app.debug.includes('shutdown')) {
            g.trace(`changed: ${c.changed} ${c.shortFileName()}`);
        }
        c.endEditing(); // Commit any open edits.
        if (c.promptingForClose) {
            // There is already a dialog open asking what to do.
            return false;
        }

        // Make sure .leoRecentFiles.txt is written.
        // ! IN LEOJS : make sure .leoRecentFiles.txt is written on open and save file instead.
        // await g.app.recentFilesManager.writeRecentFilesFile(c);

        if (c.changed && !finish_quit) {
            c.promptingForClose = true;
            const veto = await frame.promptForSave();
            c.promptingForClose = false;
            if (veto) {
                return false;
            }
        }
        // g.app.setLog(None)  // no log until we reactive a window.

        g.doHook('close-frame', { c: c });

        // This may remove frame from the window list.
        if (g.app.windowList.includes(frame)) {

            // ! UNCOMMENT TO KEEP LAST CLOSED ONE IN SESSION !
            // if (!finish_quit && g.app.windowList.length === 1) {
            //     // This was the last one. Closed one by one
            //     // so save as last session for next open.
            //     await g.app.saveSession();
            // }

            await g.app.destroyWindow(frame);

            // Remove frame
            let index = g.app.windowList.indexOf(frame, 0);
            if (index > -1) {
                g.app.windowList.splice(index, 1);
            }
        } else {
            // #69.
            g.app.forgetOpenFile(c.fileName());
        }

        // ! UNCOMMENT TO KEEP LAST CLOSED ONE IN SESSION !
        // if (!finish_quit && g.app.windowList.length) {
        //     // NOT FINISH_QUIT SO SAVE NEW SESSION WITH THIS FILE REMOVED FROM SESSION LIST!
        //     await g.app.saveSession();
        // }

        if (!finish_quit) {
            // NOT FINISH_QUIT SO SAVE NEW SESSION WITH THIS FILE REMOVED FROM SESSION LIST!
            await g.app.saveSession();
        }

        if (g.app.windowList.length) {
            const c2 = new_c || g.app.windowList[0].c;
            g.app.selectLeoWindow(c2);
        } else if (finish_quit && !g.unitTesting) {
            // * Does not terminate when last is closed: Present 'new' and 'open' buttons instead!
            await g.app.finishQuit();
        }
        return true; // The window has been closed.
    }
    //@+node:felix.20231120013945.1: *4* app.destroyAllOpenWithFiles
    /**
     * Remove temp files created with the Open With command.
     */
    public async destroyAllOpenWithFiles(): Promise<void> {

        if (g.app.debug.includes('shutdown')) {
            g.pr('destroyAllOpenWithFiles');
        }

        if (g.app.externalFilesController) {
            await g.app.externalFilesController.shut_down();
            g.app.externalFilesController = undefined;
        }

    }
    //@+node:felix.20220511231737.4: *4* app.destroyWindow
    /**
     * Destroy all ivars in a Leo frame.
     */
    public async destroyWindow(frame: LeoFrame): Promise<void> {
        if (g.app.debug.includes('shutdown')) {
            g.pr(`destroyWindow:  ${frame.c.shortFileName()}`);
        }
        if (
            g.app.externalFilesController &&
            g.app.externalFilesController.destroy_frame
        ) {
            await g.app.externalFilesController.destroy_frame(frame);
        }
        if (g.app.windowList.includes(frame)) {
            g.app.forgetOpenFile(frame.c.fileName());
        }
        // force the window to go away now.
        // Important: this also destroys all the objects of the commander.
        frame.destroySelf();
    }
    //@+node:felix.20231120013952.1: *4* app.finishQuit
    public async finishQuit(): Promise<void> {
        // forceShutdown may already have fired the "end1" hook.
        g.assert(this === g.app, g.app.toString());
        const trace = g.app.debug.includes('shutdown');
        if (trace) {
            g.pr('finishQuit: killed:', g.app.killed);
        }
        if (!g.app.killed) {
            g.doHook("end1");
            if (g.app.global_cacher) {  // #1766.
                await g.app.global_cacher.commit_and_close();
            }
        }
        await g.app.destroyAllOpenWithFiles();

        // Disable all further hooks and events.
        // Alas, "idle" events can still be called
        // even after the following code.
        g.app.killed = true;
        if (g.app.gui) {
            g.app.gui.destroySelf();  // Calls qtApp.quit()
        }
    }

    //@+node:felix.20231120013956.1: *4* app.forceShutdown
    // public async forceShutdown(self) -> None:
    //     """
    //     Forces an immediate shutdown of Leo at any time.

    //     In particular, may be called from plugins during startup.
    //     """
    //     trace = 'shutdown' in g.app.debug
    //     app = self
    //     if trace:
    //         g.pr('forceShutdown')
    //     for c in app.commanders():
    //         app.forgetOpenFile(c.fileName())
    //     # Wait until everything is quiet before really quitting.
    //     if trace:
    //         g.pr('forceShutdown: before end1')
    //     g.doHook("end1")
    //     if trace:
    //         g.pr('forceShutdown: after end1')
    //     self.log = None  # Disable writeWaitingLog
    //     self.killed = True  # Disable all further hooks.
    //     for w in self.windowList[:]:
    //         if trace:
    //             g.pr(f"forceShutdown: {w}")
    //         self.destroyWindow(w)
    //     if trace:
    //         g.pr('before finishQuit')
    //     self.finishQuit()
    //@+node:felix.20231120014001.1: *4* app.onQuit
    // @cmd('exit-leo')
    // @cmd('quit-leo')
    // def onQuit(self, event: Event = None) -> None:
    //     """Exit Leo, prompting to save unsaved outlines first."""
    //     if 'shutdown' in g.app.debug:
    //         g.trace()
    //     # #2433 - use the same method as clicking on the close box.
    //     g.app.gui.close_event(QCloseEvent())  # type:ignore
    //@+node:felix.20231120014009.1: *4* app.saveSession
    /**
     * Save session data depending on command-line arguments.
     */
    public async saveSession(): Promise<void> {

        if (this.sessionManager && (
            this.loaded_session || this.always_write_session_data
        )) {
            await this.sessionManager.save_snapshot();
        }

    }
    //@+node:felix.20220106225805.1: *3* app.commanders
    /**
     * Return list of currently active controllers
     */
    public commanders(): Commands[] {
        return g.app.windowList.map((f) => f.c);
    }
    //@+node:felix.20211226221235.1: *3* app.Detecting already-open files
    //@+node:felix.20211226221235.2: *4* app.checkForOpenFile
    /**
     * Warn if fn is already open and add fn to already_open_files list.
     */
    public async checkForOpenFile(c: Commands, fn: string): Promise<void> {

        if (g.isBrowserRepo()) {
            // web
            return;
        }

        const d = g.app.db;
        const tag: string = 'open-leo-files';
        if (g.app.reverting) {
            // #302: revert to saved doesn't reset external file change monitoring
            g.app.already_open_files = [];
        }
        if (
            d === undefined ||
            g.unitTesting ||
            g.app.batchMode ||
            g.app.reverting ||
            g.app.inBridge
        ) {
            return;
        }

        // #1519: check os.path.exists.
        let aList: string[] = g.app.db[tag] || [];  // A list of normalized file names.
        aList = aList.map((p_fn: string) => { return p_fn.replace(/\\\\/g, '\\'); });

        // ALSO FIX Filename parameter from vscode's dialog !
        fn = g.os_path_fix_drive(path.normalize(fn)); // path.normalize adds BACKSLASHES ON WINDOWS! 
        let w_any: boolean = false;
        for (let z of aList) {
            const w_exists = await g.os_path_exists(z);
            if (w_exists && z.toString().trim() === fn.toString().trim()) {
                w_any = true;
            }
        }
        // any(os.path.exists(z) and os.path.samefile(z, fn) for z in aList)
        if (w_any) {
            // The file may be open in another copy of Leo, or not:
            // another Leo may have been killed prematurely.
            // Put the file on the global list.
            // A dialog will warn the user such files later.

            if (!g.app.already_open_files.includes(fn)) {
                g.es('may be open in another Leo:');
                g.es(fn);
                console.log(`May be open in another Leo: ${fn}`);
                g.app.already_open_files.push(fn);
            }

        } else {
            g.app.rememberOpenFile(fn);
        }

    }
    //@+node:felix.20211226221235.3: *4* app.forgetOpenFile
    /**
     * Forget the open file, so that is no longer considered open.
     */
    public forgetOpenFile(fn: string): void {

        if (g.isBrowserRepo()) {
            // web
            return;
        }

        const trace: boolean = g.app.debug.includes('shutdown');
        const d: any = g.app.db;
        const tag: string = 'open-leo-files';

        if (!d || !fn) {
            return; // #69.
        }

        let aList: string[] = d[tag] || [];
        aList = aList.map((p_fn: string) => { return p_fn.replace(/\\\\/g, '\\'); });

        // path.normalize is like os.path.normpath in python to add backslashes on Windows.
        fn = g.os_path_fix_drive(path.normalize(fn));  // path.normalize adds BACKSLASHES ON WINDOWS! 

        if (aList.includes(fn)) {
            // aList.remove(fn)
            const index = aList.indexOf(fn);
            if (index > -1) {
                aList.splice(index, 1);
            }
            if (trace) {
                g.pr(`forgetOpenFile: ${g.shortFileName(fn)}`);
            }
            d[tag] = aList;
        }
    }
    //@+node:felix.20211226221235.4: *4* app.rememberOpenFile
    public rememberOpenFile(fn: string): void {
        if (g.isBrowserRepo()) {
            // web
            return;
        }

        // Do not call g.trace, etc. here.
        const d = g.app.db;
        const tag = 'open-leo-files';

        if (
            d === undefined ||
            g.unitTesting ||
            g.app.batchMode ||
            g.app.reverting
        ) {
            // pass
        } else if (g.app.preReadFlag) {
            // pass
        } else {
            let aList: string[] = d[tag] || [];
            aList = aList.map((p_fn: string) => { return p_fn.replace(/\\\\/g, '\\'); });
            // It's proper to add duplicates to this list.
            fn = g.os_path_fix_drive(path.normalize(fn));  // path.normalize adds BACKSLASHES ON WINDOWS! 
            aList.push(fn);
            d[tag] = aList;
        }
    }
    //@+node:felix.20211226221235.5: *4* app.runAlreadyOpenDialog
    /**
     *  Warn about possibly already-open files.
     */
    public async runAlreadyOpenDialog(c: Commands): Promise<void> {
        if (g.app.already_open_files && g.app.already_open_files.length) {
            const aList: string[] = Array.from(new Set(g.app.already_open_files)).sort();
            g.app.already_open_files = [];
            g.app.gui.dismiss_splash_screen();
            const message: string = (
                'The following files may already be open\n' +
                'in another copy of Leo:\n\n' +
                aList.join('\n'));
            await g.app.gui.runAskOkDialog(c,
                'Already Open Files',
                message,
                "Ok"
            );
        }
    }
    /**
     * A factory returning a scanner function for p, an @auto node.
     */
    public scanner_for_at_auto(
        c: Commands,
        p: Position
    ): ((...args: any[]) => any) | undefined {
        const d = g.app.atAutoDict;
        for (const key in d) {
            // USING 'in' for KEYS

            const func = d[key];
            if (func && g.match_word(p.h, 0, key)) {
                return func;
            }
        }
        return undefined;
    }
    //@+node:felix.20230518231054.3: *4* app.scanner_for_ext
    /**
     * A factory returning a scanner function for the given file extension.
     */
    public scanner_for_ext(
        c: Commands,
        ext: string
    ): ((...args: any[]) => any) | undefined {
        return g.app.classDispatchDict[ext];
    }
    //@+node:felix.20220417215246.1: *3* app.makeAllBindings
    /**
     * LeoApp.makeAllBindings:
     *
     * Modified version for leojs: call leoUI.makeAllBindings
     */
    public makeAllBindings(): void {
        this.gui.makeAllBindings();
        /* 
        app = self
        for c in app.commanders():
            c.k.makeAllBindings()
        */
    }

    //@+node:felix.20210123212411.1: *3* app.newCommander
    /**
     * Create a commander and its view frame for the Leo main window.
     */
    public newCommander(
        fileName: string,
        gui?: LeoGui,
        previousSettings?: PreviousSettings,
        relativeFileName?: string
    ): Commands {
        // Create the commander and its subcommanders.
        // This takes about 3/4 sec when called by the leoBridge module.
        // Timeit reports 0.0175 sec when using a nullGui.
        if (!gui) {
            gui = g.app.gui;
        }
        const c = new Commands(
            fileName,
            gui,
            previousSettings,
            relativeFileName
        );
        return c;
    }
    //@+node:felix.20220517215520.1: *3* app.selectLeoWindow
    public selectLeoWindow(c: Commands): void {
        // * Rewritten for leojs

        const frame = c.frame;

        const index = g.app.windowList.indexOf(frame, 0);

        g.app.gui.frameIndex = index;

        /* 
        frame.deiconify()
        frame.lift()
        c.setLog()
        master = getattr(frame.top, 'leo_master', None)
        if master:
            // master is a TabbedTopLevel.
            // Selecting the new tab ensures focus is set.
            master.select(c)
        */

        if (1) {
            c.initialFocusHelper();
        } else {
            c.bodyWantsFocus();
        }
        c.outerUpdate();
    }
    //@-others
}

//@+node:felix.20210118015431.1: ** class LoadManager
/**
 * A class to manage loading .leo files, including configuration files.
 */
export class LoadManager {
    // Global settings & shortcuts dicts...
    // The are the defaults for computing settings and shortcuts for all loaded files.

    // A g.SettingsDict: the join of settings in leoSettings.leo & myLeoSettings.leo.
    public globalSettingsDict!: g.SettingsDict;
    // A g.SettingsDict: the join of shortcuts in leoSettings.leo & myLeoSettings.leo
    public globalBindingsDict!: g.SettingsDict;

    public files: string[]; // List of files to be loaded.
    public options: { [key: string]: any }; // Dictionary of user options. Keys are option names.
    public old_argv: string[]; // A copy of sys.argv for debugging.
    public more_cmdline_files: boolean; // True when more files remain on the command line to be loaded.

    // Themes.
    public leo_settings_c: Commands | undefined;
    public leo_settings_path: string | undefined;
    public my_settings_c: Commands | undefined;
    public my_settings_path: string | undefined;
    public theme_c: Commands | undefined;
    // #1374.
    public theme_path: string | undefined;

    private _context: vscode.ExtensionContext | undefined;

    //@+others
    //@+node:felix.20210119234943.1: *3*  LM.ctor
    constructor(p_context?: vscode.ExtensionContext) {
        if (p_context) {
            this._context = p_context;
        }
        // this.globalSettingsDict = undefined;
        // this.globalBindingsDict = undefined;
        this.files = [];
        this.options = {};
        this.old_argv = [];
        this.more_cmdline_files = false;
    }

    //@+node:felix.20220610002953.1: *3* LM.Directory & file utils
    //@+node:felix.20220610002953.2: *4* LM.completeFileName

    public completeFileName(fileName: string): string {
        fileName = g.toUnicode(fileName);
        fileName = g.finalize(fileName);
        // 2011/10/12: don't add .leo to *any* file.
        return fileName;
    }
    //@+node:felix.20220610002953.3: *4* LM.computeLeoSettingsUri
    /* 
    def computeLeoSettingsPath(self):
        """Return the full path to leoSettings.leo."""
        # lm = self
        join = g.finalize_join
        settings_fn = 'leoSettings.leo'
        table = (
            # First, leoSettings.leo in the home directories.
            join(g.app.homeDir, settings_fn),
            join(g.app.homeLeoDir, settings_fn),
            # Last, leoSettings.leo in leo/config directory.
            join(g.app.globalConfigDir, settings_fn)
        )
        for path in table:
            if g.os_path_exists(path):
                break
        else:
            path = None
        return path
     */

    /**
     * Return the Uri of this extension's leojsSettings.leojs,
     * the LeoJs equivalent of leoSettings.leo.
     */
    public computeLeoSettingsUri(): vscode.Uri {
        return vscode.Uri.joinPath(g.extensionUri, 'leojsSettings.leojs');
    }

    //@+node:felix.20220610002953.4: *4* LM.computeMyLeoSettingsPath

    /**
     * Return the full path to myLeoSettings.leo.
     *
     * The "footnote": Get the local directory from lm.files[0]
     */
    public async computeMyLeoSettingsPath(): Promise<string | undefined> {
        const lm = this;
        const join = g.finalize_join;
        const settings_fn = 'myLeoSettings.leo';
        // This seems pointless: we need a machine *directory*.

        // TODO ?
        /*
        // For now, however, we'll keep the existing code as is.
        machine_fn = lm.computeMachineName() + settings_fn
        */

        // First, compute the directory of the first loaded file.
        // All entries in lm.files are full, absolute paths.
        let localDir = g.os_path_dirname(lm.files.length ? lm.files[0] : '');
        // IF NO FILES IN lm.files THEN USE WORKSPACE ROOT !
        if (!localDir) {
            localDir = vscode.workspace.workspaceFolders
                ? vscode.workspace.workspaceFolders[0].uri.path
                : '';
        }

        const table = [
            // First, myLeoSettings.leo in the local directory
            join(localDir, settings_fn),
        ];
        // Next, myLeoSettings.leo in the home directories.
        if (g.app.homeDir) {
            table.push(join(g.app.homeDir, settings_fn));
        }
        if (g.app.homeLeoDir) {
            table.push(join(g.app.homeLeoDir, settings_fn));
        }

        // TODO ?
        /*
        // Next, <machine-name>myLeoSettings.leo in the home directories.
        join(g.app.homeDir, machine_fn),
        join(g.app.homeLeoDir, machine_fn),
        // Last, leoSettings.leo in leo/config directory.
        join(g.app.globalConfigDir, settings_fn),
        */

        let hasBreak = false;
        let path: string | undefined;
        for (let p_path of table) {
            const exists = await g.os_path_exists(p_path);
            if (exists) {
                path = p_path;
                hasBreak = true;
                break;
            }
        }
        if (!hasBreak) {
            path = undefined;
        }

        return path;
    }

    //@+node:felix.20220610002953.5: *4* LM.computeStandardDirectories & helpers
    /**
     * Compute the locations of standard directories and
     * set the corresponding ivars.
     */
    public async computeStandardDirectories(): Promise<unknown> {
        const lm = this;
        const join = g.PYTHON_os_path_join;
        g.app.loadDir = lm.computeLoadDir(); // UNUSED The leo / core directory.
        g.app.globalConfigDir = lm.computeGlobalConfigDir(); // UNUSED leo / config directory
        g.app.homeDir = await lm.computeHomeDir(); // * The user's home directory.
        g.app.homeLeoDir = await lm.computeHomeLeoDir(); // * The user's home/.leo directory.
        // g.app.leoDir = lm.computeLeoDir(); // * not used in leojs
        // These use g.app.loadDir...
        // g.app.extensionsDir = ''; // join(g.app.loadDir, '..', 'extensions'); // UNSUSED The leo / extensions directory
        g.app.leoEditorDir = g.extensionUri ? g.os_path_normslashes(g.os_path_fix_drive(g.extensionUri.fsPath)) : ''; // join(g.app.loadDir, '..', '..');
        g.app.testDir = join(g.app.loadDir, '..', 'test');

        return;
    }

    //@+node:felix.20220610002953.6: *5* LM.computeGlobalConfigDir

    public computeGlobalConfigDir(): string {
        let theDir: string = ''; // ! unused : RETURN EMPTY / FALSY FOR NOW

        /* 
        const leo_config_dir = getattr(sys, 'leo_config_directory', None)
        if leo_config_dir
            theDir = leo_config_dir
        else
            theDir = os.path.join(g.app.loadDir, "..", "config")

        if theDir
            theDir = os.path.abspath(theDir)

        if not theDir or not g.os_path_exists(theDir) or not g.os_path_isdir(theDir)
            theDir = None
        */
        return theDir;
    }
    //@+node:felix.20220610002953.7: *5* LM.computeHomeDir
    /**
     * Returns the user's home directory.
     */
    public async computeHomeDir(): Promise<string> {
        let home: string = '';

        // Windows searches the HOME, HOMEPATH and HOMEDRIVE
        // environment vars, then gives up.
        // home = path.expanduser("~")

        // if home and len(home) > 1 and home[0] == '%' and home[-1] == '%':
        //     // Get the indirect reference to the true home.
        //     home = os.getenv(home[1:-1], default=None)

        if (os) {
            home = os.homedir();
        }
        if (g.isBrowser) {
            // BROWSER: Root of repo
            home = g.workspaceUri!.fsPath;
        }

        if (home) {
            // Important: This returns the _working_ directory if home is None!
            // This was the source of the 4.3 .leoID.txt problems.
            home = g.finalize(home);
            const exists = await g.os_path_exists(home);
            const isDir = await g.os_path_isdir(home);
            if (!exists || !isDir) {
                home = '';
            }
        }

        return home;
    }
    //@+node:felix.20220610002953.8: *5* LM.computeHomeLeoDir

    public async computeHomeLeoDir(): Promise<string> {
        let homeLeoDir: string = '';

        // * RETURN FALSY STRING IF NO HOME DIR (possibly in browser)
        if (!g.app.homeDir) {
            return '';
        }

        homeLeoDir = g.finalize_join(g.app.homeDir, '.leo');
        const exists = await g.os_path_exists(homeLeoDir);

        if (exists) {
            return homeLeoDir;
        }

        // const ok = g.makeAllNonExistentDirectories(homeLeoDir);
        const w_uri = g.makeVscodeUri(homeLeoDir);
        if (g.isBrowser) {
            return homeLeoDir;
        }

        try {
            await vscode.workspace.fs.createDirectory(w_uri);
            return homeLeoDir;
        } catch (exception) {
            return '';
        }
    }
    //@+node:felix.20220610002953.9: *5* LM.computeLeoDir
    /* 
    def computeLeoDir(self):
        # lm = self
        loadDir = g.app.loadDir
        # We don't want the result in sys.path
        return g.os_path_dirname(loadDir)
     */
    //@+node:felix.20220610002953.10: *5* LM.computeLoadDir
    /**
     * Returns the directory containing leo.py.
     */
    public computeLoadDir(): string {
        let loadDir: string = __dirname || './';
        let w_uri;
        if (vscode.workspace.workspaceFolders) {
            w_uri = vscode.workspace.workspaceFolders[0].uri;
        }

        // ! TRY TO GET EXTENSION FOLDER WITHOUT REQUIRING CONTEXT ! 
        const extension = vscode.extensions.getExtension(Constants.PUBLISHER + '.' + Constants.NAME)!;
        if (extension) {
            loadDir = extension.extensionUri.fsPath; // ! OVERRIDE WITH REAL EXTENSION PATH !
        } else {
            console.log(' -------------- leojs EXTENSION FOLDER NOT FOUND --------------');
        }

        // const loadDir2 = w_uri?.fsPath;
        loadDir = g.finalize(loadDir);

        /* 
        try:
            # Fix a hangnail: on Windows the drive letter returned by
            # __file__ is randomly upper or lower case!
            # The made for an ugly recent files list.
            path = g.__file__  # was leo.__file__
            if path:
                # Possible fix for bug 735938:
                # Do the following only if path exists.
                //@+<< resolve symlinks >>
                //@+node:felix.20220610002953.11: *6* << resolve symlinks >>
                 
                if path.endswith('pyc'):
                    srcfile = path[:-1]
                    if os.path.islink(srcfile):
                        path = os.path.realpath(srcfile)
                //@-<< resolve symlinks >>
                if sys.platform == 'win32':
                    if len(path) > 2 and path[1] == ':':
                        # Convert the drive name to upper case.
                        path = path[0].upper() + path[1:]
                path = g.finalize(path)
                loadDir = g.os_path_dirname(path)
            else: loadDir = None
            if (
                not loadDir or
                not g.os_path_exists(loadDir) or
                not g.os_path_isdir(loadDir)
            ):
                loadDir = os.getcwd()
                # From Marc-Antoine Parent.
                if loadDir.endswith("Contents/Resources"):
                    loadDir += "/leo/plugins"
                else:
                    g.pr("Exception getting load directory")
            loadDir = g.finalize(loadDir)
            return loadDir
        except Exception:
            print("Exception getting load directory")
            raise
        */
        return loadDir;
    }
    //@+node:felix.20220610002953.12: *5* LM.computeMachineName
    /* 
    def computeMachineName(self):
        """Return the name of the current machine, i.e, HOSTNAME."""
        # This is prepended to leoSettings.leo or myLeoSettings.leo
        # to give the machine-specific setting name.
        # How can this be worth doing??
        try:
            name = os.getenv('HOSTNAME')
            if not name:
                name = os.getenv('COMPUTERNAME')
            if not name:
                import socket
                name = socket.gethostname()
        except Exception:
            name = ''
        return name
     */


    /**
     * Return the name of the current machine, i.e, HOSTNAME.
     * This is prepended to leoSettings.leo or myLeoSettings.leo
     * to give the machine-specific setting name.
     * How can this be worth doing??
     */
    public computeMachineName(): string {
        let name: string = '';
        try {
            name = process.env['HOSTNAME'] || '';
            if (!name) {
                name = process.env['COMPUTERNAME'] || '';
            }
            if (!name) {
                // No equivalent of socket.gethostname() in Node.js.
                // Using os module to get hostname.
                name = os.hostname();
            }
        } catch (error) {
            name = '';
        }
        return name;
    }
    //@+node:felix.20220610002953.13: *4* LM.computeThemeDirectories
    /* 
    def computeThemeDirectories(self):
        """
        Return a list of *existing* directories that might contain theme .leo files.
        """
        join = g.finalize_join
        home = g.app.homeDir
        leo = join(g.app.loadDir, '..')
        table = [
            home,
            join(home, 'themes'),
            join(home, '.leo'),
            join(home, '.leo', 'themes'),
            join(leo, 'themes'),
        ]
        # Make sure home has normalized slashes.
        return [g.os_path_normslashes(z) for z in table if g.os_path_exists(z)]
     */
    //@+node:felix.20220610002953.14: *4* LM.computeThemeFilePath & helper
    /* 
    def computeThemeFilePath(self):
        """
        Return the absolute path to the theme .leo file, resolved using the search order for themes.

        1. Use the --theme command-line option if it exists.

        2. Otherwise, preload the first .leo file.
           Load the file given by @string theme-name setting.

        3. Finally, look up the @string theme-name in the already-loaded, myLeoSettings.leo.
           Load the file if setting exists.  Otherwise return None.
        """
        trace = 'themes' in g.app.db
        lm = self
        resolve = self.resolve_theme_path
        #
        # Step 1: Use the --theme command-line options if it exists
        path = resolve(lm.options.get('theme_path'), tag='--theme')
        if path:
            # Caller (LM.readGlobalSettingsFiles) sets lm.theme_path
            if trace:
                g.trace('--theme:', path)
            return path
        #
        # Step 2: look for the @string theme-name setting in the first loaded file.
        path = lm.files and lm.files[0]
        if path and g.os_path_exists(path):
            # Tricky: we must call lm.computeLocalSettings *here*.
            theme_c = lm.openSettingsFile(path)
            if theme_c:
                settings_d, junk_shortcuts_d = lm.computeLocalSettings(
                    c=theme_c,
                    settings_d=lm.globalSettingsDict,
                    bindings_d=lm.globalBindingsDict,
                    localFlag=False,
                )
                setting = settings_d.get_string_setting('theme-name')
                if setting:
                    tag = theme_c.shortFileName()
                    path = resolve(setting, tag=tag)
                    if path:
                        # Caller (LM.readGlobalSettingsFiles) sets lm.theme_path
                        if trace:
                            g.trace("First loaded file", theme_c.shortFileName(), path)
                        return path
        #
        # Step 3: use the @string theme-name setting in myLeoSettings.leo.
        # Note: the setting should *never* appear in leoSettings.leo!
        setting = lm.globalSettingsDict.get_string_setting('theme-name')
        tag = 'myLeoSettings.leo'
        path = resolve(setting, tag=tag)
        if trace:
            g.trace("myLeoSettings.leo", path)
        return path
     */
    //@+node:felix.20220610002953.15: *5* LM.resolve_theme_path
    /* 
    def resolve_theme_path(self, fn, tag):
        """Search theme directories for the given .leo file."""
        if not fn or fn.lower().strip() == 'none':
            return None
        if not fn.endswith('.leo'):
            fn += '.leo'
        for directory in self.computeThemeDirectories():
            path = g.os_path_join(directory, fn)  # Normalizes slashes, etc.
            if g.os_path_exists(path):
                return path
        print(f"theme .leo file not found: {fn}")
        return None
     */
    //@+node:felix.20220610002953.16: *4* LM.computeWorkbookFileName
    /* 
    def computeWorkbookFileName(self):
        """
        Return full path to the workbook.

        Return None if testing, or in batch mode, or if the containing
        directory does not exist.
        """
        # lm = self
        # Never create a workbook during unit tests or in batch mode.
        if g.unitTesting or g.app.batchMode:
            return None
        fn = g.app.config.getString(setting='default_leo_file') or '~/.leo/workbook.leo'
        fn = g.finalize(fn)
        directory = g.finalize(os.path.dirname(fn))
        
        return fn if os.path.exists(directory) else None
     */
    //@+node:felix.20220610002953.17: *4* LM.reportDirectories
    /**
     * Report directories.
     */
    public reportDirectories(): void {
        let directories: {
            kind: string;
            theDir: string | undefined;
        }[];

        // The cwd changes later, so it would be misleading to report it here.
        // ! SKIP FOR BROWSER: NO 'HOME' & NO 'LEO-EDITOR' FOLDERS !
        if (g.isBrowser) {
            directories = [
                { kind: 'repository', theDir: g.app.homeDir },
            ];
        } else {
            // ! LOAD AND CONFIG HAVE NO USE IN LEOJS !
            directories = [
                { kind: 'home', theDir: g.app.homeDir },
                { kind: 'leo-editor', theDir: g.app.leoEditorDir },
                // { kind: 'load', theDir: g.app.loadDir },
                // { kind: 'config', theDir: g.app.globalConfigDir },
            ];
        }

        for (const { kind, theDir } of directories) {
            // g.blue calls g.es_print, and that's annoying.
            g.es(`${kind.padStart(10, ' ')}:`, path.normalize(theDir!));  // path.normalize adds BACKSLASHES ON WINDOWS! 
        }
    }
    //@+node:felix.20220406235904.1: *3* LM.Settings
    //@+node:felix.20220406235925.1: *4* LM.computeBindingLetter
    public computeBindingLetter(c: Commands, p_path?: string): string {
        const lm = this;
        if (!p_path) {
            return 'D';
        }
        p_path = p_path.toLowerCase();
        const table = [
            ['M', 'myLeoSettings.leo'],
            [' ', 'leoSettings.leo'],
            ['F', c.shortFileName()],
        ];
        for (let p_entry of table) {
            let letter;
            let path2;
            [letter, path2] = p_entry;
            if (path2 && p_path.endsWith(path2.toLowerCase())) {
                return letter;
            }
        }
        if (lm.theme_path && p_path.endsWith(lm.theme_path.toLowerCase())) {
            return 'T';
        }
        if (p_path === 'register-command' || p_path.indexOf('mode') > -1) {
            return '@';
        }
        return 'D';
    }
    //@+node:felix.20220601235600.1: *4* LM.computeLocalSettings
    /**
     * Merge the settings dicts from c's outline into *new copies of*
     * settings_d and bindings_d.
     */
    public async computeLocalSettings(
        c: Commands,
        settings_d: g.SettingsDict,
        bindings_d: g.SettingsDict,
        localFlag: boolean
    ): Promise<[g.SettingsDict, g.SettingsDict]> {
        const lm = this;
        let shortcuts_d2;
        let settings_d2;

        [shortcuts_d2, settings_d2] = await lm.createSettingsDicts(c, localFlag);

        if (!bindings_d) {
            // #1766: unit tests.
            [settings_d, bindings_d] = lm.createDefaultSettingsDicts();
        }
        if (settings_d2) {
            if (g.app.trace_setting) {
                const key = g.app.config.munge(g.app.trace_setting);
                const val = key ? settings_d2.get(key) : undefined;
                if (val) {
                    const fn = g.shortFileName(val.path);
                    g.es_print(
                        `--trace-setting: in ${fn}: ` +
                        `@${val.kind} ${g.app.trace_setting}=${val.val}`
                    );
                }
            }
            settings_d = settings_d.copy();
            settings_d.update(settings_d2);
        }
        if (shortcuts_d2) {
            // TODO support shortcuts needed?
            // bindings_d = lm.mergeShortcutsDicts(c, bindings_d, shortcuts_d2, localFlag);
        }

        return [settings_d, bindings_d];
    }

    //@+node:felix.20220417222540.1: *4* LM.createDefaultSettingsDicts
    /**
     * Create lm.globalSettingsDict & lm.globalBindingsDict.
     */
    public createDefaultSettingsDicts(): [g.SettingsDict, g.SettingsDict] {
        const settings_d = new g.SettingsDict('lm.globalSettingsDict');

        settings_d.setName('lm.globalSettingsDict');

        const bindings_d = new g.SettingsDict('lm.globalBindingsDict');

        return [settings_d, bindings_d];
    }

    //@+node:felix.20220602202929.1: *4* LM.createSettingsDicts
    public async createSettingsDicts(
        c: Commands,
        localFlag: boolean
    ): Promise<[g.SettingsDict | undefined, g.SettingsDict | undefined]> {
        if (c) {
            // returns the *raw* shortcutsDict, not a *merged* shortcuts dict.
            const parser = new SettingsTreeParser(c, localFlag);
            let shortcutsDict;
            let settingsDict;
            [shortcutsDict, settingsDict] = await parser.traverse();
            return [shortcutsDict, settingsDict];
        }
        return [undefined, undefined];
    }

    //@+node:felix.20220418170221.1: *4* LM.getPreviousSettings
    /**
     * Return the settings in effect for fn. Typically, this involves pre-reading fn.
     */
    public async getPreviousSettings(fn?: string): Promise<PreviousSettings> {
        const lm = this;
        const settingsName = `settings dict for ${g.shortFileName(fn)}`;
        const shortcutsName = `shortcuts dict for ${g.shortFileName(fn)}`;
        // A special case: settings in leoSettings.leo do *not* override
        // the global settings, that is, settings in myLeoSettings.leo.
        const isLeoSettings =
            fn && g.shortFileName(fn).toLowerCase() === 'leosettings.leo';
        const exists = await g.os_path_exists(fn);

        let c: Commands | undefined;
        let d1;
        let d2;

        if (fn && exists && lm.isLeoFile(fn) && !isLeoSettings) {
            // Open the file using a null gui.
            try {
                g.app.preReadFlag = true;
                c = await lm.openSettingsFile(fn);
            } catch (e) {
                console.log('ERROR in getPreviousSettings', e);
            } finally {
                g.app.preReadFlag = false;
            }
            // Merge the settings from c into *copies* of the global dicts.

            [d1, d2] = await lm.computeLocalSettings(
                c!,
                lm.globalSettingsDict,
                lm.globalBindingsDict,
                true
            );

            // d1 and d2 are copies.
            d1.setName(settingsName);
            d2.setName(shortcutsName);
            return new PreviousSettings(d1, d2);
        }

        //
        // The file does not exist, or is not valid.
        // Get the settings from the globals settings dicts.
        if (lm.globalSettingsDict && lm.globalBindingsDict) {
            // #1766.
            d1 = lm.globalSettingsDict.copy(settingsName);
            d2 = lm.globalBindingsDict.copy(shortcutsName);
        } else {
            d1 = undefined;
            d2 = undefined;
        }
        return new PreviousSettings(d1, d2);
    }

    //@+node:felix.20220602203148.1: *4* LM.mergeShortcutsDicts & helpers
    /**
     * Create a new dict by overriding all shortcuts in old_d by shortcuts in new_d.
     *
     * Both old_d and new_d remain unchanged.
     */
    public mergeShortcutsDicts(
        c: Commands,
        old_d: any,
        new_d: any,
        localFlag: boolean
    ): any {
        // ! NO NEED FOR SHORTCUTS : SO THIS IS UNUSED !
        /* 
        const lm = this;
        if (!old_d){
            return new_d;
            }
        if (!new_d){
            return old_d;
        }
        let pane;
        let bi_list = new_d.get(g.app.trace_setting);
        let fn;
        let stroke;
        if (bi_list && bi_list.length){
            // This code executed only if g.app.trace_setting exists.
            for( let bi of bi_list){
                fn = bi.kind.split(' ').at(-1);
                stroke = c.k.prettyPrintKey(bi.stroke);
                if (bi.pane && bi.pane !== 'all'){
                    pane = ` in ${bi.pane} panes`;
                }else{
                    pane = '';
                }
            }
        }
        const inverted_old_d = lm.invert(old_d);
        const inverted_new_d = lm.invert(new_d);
        // #510 & #327: always honor --trace-binding here.
        if (g.app.trace_binding)
            let binding = g.app.trace_binding;
            // First, see if the binding is for a command. (Doesn't work for plugin commands).
            if (localFlag && c.k.killedBindings.includes(binding)){
                g.es_print(
                    `--trace-binding: ${c.shortFileName()} ` +
                    `sets ${binding} to None`
                );
            }else if (localFlag && c.commandsDict.includes(binding)){
                const d = c.k.computeInverseBindingDict();
                g.trace(
                    `--trace-binding: ${c.shortFileName()} ` +
                    `binds ${binding} to ${d.get(binding) || []}`
                );
            }else{
                binding = g.app.trace_binding;
                const stroke = new KeyStroke(binding);
                bi_list = inverted_new_d.get(stroke);
                if (bi_list){
                    for (let bi of bi_list){
                        const fn = bi.kind.split(' ').at(-1);  // bi.kind #
                        const stroke2 = c.k.prettyPrintKey(stroke);
                        if( bi.pane && bi.pane !== 'all'){
                            pane = ` in ${bi.pane} panes`;
                        }else{
                            pane = '';
                        }
                        g.es_print(
                            `--trace-binding: ${fn} binds ${stroke2} ` +
                            `to ${bi.commandName}${pane}`
                        );
                    }
                }
            }

        // Fix bug 951921: check for duplicate shortcuts only in the new file.
        lm.checkForDuplicateShortcuts(c, inverted_new_d);
        inverted_old_d.update(inverted_new_d);  // Updates inverted_old_d in place.

        const result = lm.uninvert(inverted_old_d);

        return result;
        */
    }

    //@+node:felix.20220602203148.2: *5* LM.checkForDuplicateShortcuts
    /**
     * Check for duplicates in an "inverted" dictionary d
     * whose keys are strokes and whose values are lists of BindingInfo nodes.
     *
     * Duplicates happen only if panes conflict.
     */
    public checkForDuplicateShortcuts(c: Commands, d: any): void {
        // Fix bug 951921: check for duplicate shortcuts only in the new file.
        //for (let ks of sorted(list(d.keys())))
        for (let ks of Object.keys(d).sort()) {
            const duplicates = [];
            const panes = ['all'];
            const aList = d.get(ks); // A list of bi objects.

            // aList2 = [z for z in aList if not z.pane.startsWith('mode')];
            const aList2 = aList.filter(
                (z: { pane: string }) => !z.pane.startsWith('mode')
            );

            if (aList.length > 1) {
                for (let bi of aList2) {
                    if (panes.includes(bi.pane)) {
                        duplicates.push(bi);
                    } else {
                        panes.push(bi.pane);
                    }
                }
            }

            if (duplicates.length) {
                // bindings = list(set([z.stroke.s for z in duplicates]));
                const bindings: string[] = [];
                for (let z of duplicates) {
                    if (!bindings.includes(z.stroke.s)) {
                        bindings.push(z.stroke.s);
                    }
                }
                let kind;
                if (bindings.length === 1) {
                    kind = 'duplicate, (not conflicting)';
                } else {
                    kind = 'conflicting';
                }
                g.es_print(`${kind} key bindings in ${c.shortFileName()}`);
                for (let bi of aList2) {
                    g.es_print(`${bi.pane} ${bi.stroke.s} ${bi.commandName}`);
                }
            }
        }
    }

    //@+node:felix.20220602203148.3: *5* LM.invert
    /**
     * Invert a shortcut dict whose keys are command names,
     * returning a dict whose keys are strokes.
     */
    public invert(d: any): g.SettingsDict {
        const result = new SettingsDict(`inverted ${d.name()}`);

        for (let commandName of Object.keys(d)) {
            for (let bi of d.get(commandName, [])) {
                const stroke = bi.stroke; // This is canonicalized.
                bi.commandName = commandName; // Add info.
                g.assert(stroke);
                result.add_to_list(stroke, bi);
            }
        }

        return result;
    }

    //@+node:felix.20220602203148.4: *5* LM.uninvert
    /**
     * Uninvert an inverted shortcut dict whose keys are strokes,
     * returning a dict whose keys are command names.
     */
    public uninvert(d: g.SettingsDict): SettingsDict {
        // ! LEOJS : NO KEYSTROKES HANDLING
        // g.assert(d.keyType === g.KeyStroke, d.keyType);
        const result = new SettingsDict(`uninverted ${d.name()}`);

        for (let stroke of Object.keys(d)) {
            for (let bi of d.get(stroke, [])) {
                const commandName = bi.commandName;
                g.assert(commandName);
                result.add_to_list(commandName, bi);
            }
        }
        return result;
    }

    //@+node:felix.20220418185142.1: *4* LM.openSettingsFile
    /**
     * Open a settings file with a null gui.  Return the commander.
     *
     * The caller must init the c.config object.
     */
    public async openSettingsFile(fn?: string): Promise<Commands | undefined> {
        const lm = this;

        if (!fn) {
            return undefined;
        }
        if (fn !== 'leoSettings.leo') { // ! HACK FOR LEOJS special case for internal leoSettings.leo
            const w_exists = await g.os_path_exists(fn);
            if (!w_exists || !lm.isLeoFile(fn)) {
                g.es_print("ERROR: open settings file cannot open :", fn);
                return undefined;
            }
        }
        /* 
        const theFile = lm.openAnyLeoFile(fn);

        if (!theFile) {
            return undefined;  // Fix #843.
        }
         */
        if (!(g.unitTesting || g.app.silentMode || g.app.batchMode)) {
            // This occurs early in startup, so use the following.
            let s;
            if (fn === 'leoSettings.leo') {
                s = `reading settings in leojsSettings.leojs`;
            } else {
                s = `reading settings in ${path.normalize(fn)}`;
            }
            if (g.app.debug.includes('startup')) {
                console.log(s);
            }
            g.es(s);
        }
        // A useful trace.
        // g.trace('%20s' % g.shortFileName(fn), g.callers(3))

        // Changing g.app.gui here is a major hack.  It is necessary.
        const oldGui = g.app.gui;
        g.app.gui = g.app.nullGui;
        const c = g.app.newCommander(fn);
        const fc = c.fileCommands;

        // const frame = c.frame;
        // frame.log.enable(false);
        g.app.lockLog();

        let ok: VNode | undefined;
        let g_element;
        try {
            // ! HACK FOR LEOJS: MAKE COMMANDER FROM FAKE leoSettings.leo STRING !
            const w_fastRead: FastRead = new FastRead(
                c,
                c.fileCommands.gnxDict
            );

            if (fn === 'leoSettings.leo') {
                const w_leoSettingsUri = lm.computeLeoSettingsUri();
                let readData = await vscode.workspace.fs.readFile(w_leoSettingsUri);
                [ok, g_element] = w_fastRead.readWithJsonTree(
                    fn,
                    g.toUnicode(readData)
                );
                if (ok) {
                    c.hiddenRootNode = ok;
                }
            } else {
                ok = await fc.getAnyLeoFileByName(fn, false, false);
            }

        } catch (p_err) {
            ok = undefined;
        }
        g.app.unlockLog();
        g.app.gui = oldGui;

        return ok ? c : undefined;
    }

    //@+node:felix.20220417222319.1: *4* LM.readGlobalSettingsFiles
    /**
     * Read leoSettings.leo and myLeoSettings.leo using a null gui.
     *
     * New in Leo 6.1: this sets ivars for the ActiveSettingsOutline class.
     */
    public async readGlobalSettingsFiles(): Promise<unknown> {
        const trace = g.app.debug.includes('themes');
        const lm = this;
        // Open the standard settings files with a nullGui.
        // Important: their commanders do not exist outside this method!
        const old_commanders = g.app.commanders();

        lm.leo_settings_path = 'leoSettings.leo'; // lm.computeLeoSettingsPath();
        lm.my_settings_path = await lm.computeMyLeoSettingsPath();

        lm.leo_settings_c = await lm.openSettingsFile(lm.leo_settings_path);
        lm.my_settings_c = await lm.openSettingsFile(lm.my_settings_path);

        let commanders = [lm.leo_settings_c, lm.my_settings_c];
        commanders = commanders.filter((c) => !!c);

        let settings_d: g.SettingsDict;
        let bindings_d: g.SettingsDict;

        [settings_d, bindings_d] = lm.createDefaultSettingsDicts();

        for (let c of commanders) {
            // Merge the settings dicts from c's outline into
            // *new copies of* settings_d and bindings_d.
            [settings_d, bindings_d] = await lm.computeLocalSettings(
                c!, // Commands for sure because of filter(c => !!c)
                settings_d,
                bindings_d,
                false
            );
        }
        // Adjust the name.
        bindings_d.setName('lm.globalBindingsDict');

        lm.globalSettingsDict = settings_d;
        lm.globalBindingsDict = bindings_d;

        // ! LEOJS : THEMES NOT NEEDED !
        /* 
        // Add settings from --theme or @string theme-name files.
        // This must be done *after* reading myLeoSettings.leo.
        lm.theme_path = lm.computeThemeFilePath()

        if lm.theme_path
            lm.theme_c = lm.openSettingsFile(lm.theme_path)
            if lm.theme_c
                // Merge theme_c's settings into globalSettingsDict.
                settings_d, junk_shortcuts_d = lm.computeLocalSettings(
                    lm.theme_c, settings_d, bindings_d, localFlag=False)
                lm.globalSettingsDict = settings_d
                // Set global var used by the StyleSheetManager.
                g.app.theme_directory = g.os_path_dirname(lm.theme_path)

                if trace
                    g.trace('g.app.theme_directory', g.app.theme_directory)
        */

        // Clear the cache entries for the commanders.
        // This allows this method to be called outside the startup logic.
        for (let c of commanders) {
            if (c && !old_commanders.includes(c)) {
                g.app.forgetOpenFile(c.fileName());
            }
        }

        return;
    }

    //@+node:felix.20210120004121.1: *3* LM.load & helpers
    /**
     * This is Leo's main startup method.
     */
    public async load(): Promise<unknown> {
        const lm: LoadManager = this;

        const t1 = process.hrtime();

        // sets lm.options and lm.files
        await lm.doPrePluginsInit();
        g.app.printSignon();
        if (lm.options['version']) {
            return;
        }
        if (!g.app.gui) {
            return;
        }
        // Disable redraw until all files are loaded.
        g.app.disable_redraw = true;
        const t2 = process.hrtime();
        g.doHook('start1');
        const t3 = process.hrtime();

        if (g.app.killed) {
            return;
        }

        // ! ----------------------- MAYBE REPLACE WITH VSCODE FILE-CHANGE DETECTION ----------------
        g.app.idleTimeManager.start();
        // ! ----------------------------------------------------------------------------------------

        const t4 = process.hrtime();
        const ok = await lm.doPostPluginsInit(); // loads recent, or, new untitled.
        g.app.makeAllBindings();

        g.app.gui.finishStartup();

        g.es(''); // Clears horizontal scrolling in the log pane.

        if (!ok) {
            // --screen-shot causes an immediate exit.
            if (g.app.debug.includes('shutdown') || g.app.debug.includes('startup')) {
                g.es_print('Can not create a commander');
                // g.app.forceShutdown() // ! LEOJS NEEDED ? ?
            }
            return;
        }
        if (g.app.listen_to_log_flag) {
            // TODO: ?
            // g.app.listenToLog();
        }
        if (g.app.debug.includes('startup')) {
            const t5 = process.hrtime();
            console.log('');
            g.es_print(`settings:${utils.getDurationMs(t1, t2)} ms`);
            g.es_print(` plugins:${utils.getDurationMs(t2, t3)} ms`);
            g.es_print(`   files:${utils.getDurationMs(t3, t4)} ms`);
            g.es_print(`  frames:${utils.getDurationMs(t4, t5)} ms`);
            g.es_print(`   total:${utils.getDurationMs(t1, t5)} ms`);
            console.log('');
        }
        g.app.gui.fullRefresh();
        return ok;
    }

    //@+node:felix.20210120004121.3: *4* LM.doPostPluginsInit & helpers
    /**
     * Create a Leo window for each file in the lm.files list.
     */
    public async doPostPluginsInit(): Promise<boolean> {
        // Clear g.app.initing _before_ creating commanders.
        const lm: LoadManager = this;
        g.app.initing = false; // "idle" hooks may now call g.app.forceShutdown.
        // Create the main frame.Show it and all queued messages.
        let c: Commands | undefined;
        let c1: Commands | undefined;
        g.app.loaded_session = !lm.files.length;
        let fn: string = '';
        if (lm.files.length) {
            try {
                for (let n = 0; n < lm.files.length; n++) {
                    const fn = lm.files[n];
                    lm.more_cmdline_files = n < lm.files.length - 1;
                    c = await lm.loadLocalFile(fn, g.app.gui);
                    // Returns None if the file is open in another instance of Leo.
                    if (c && !c1) {
                        c1 = c;
                    }
                }
            } catch (exception) {
                g.es_print(`Unexpected exception reading ${fn}`);
                g.es_exception(exception);
                c = undefined;
            }
        }

        // Load a session if the command line contains no files.
        if (g.app.sessionManager && !lm.files.length) {
            try {
                const aList = g.app.sessionManager.load_snapshot();
                if (aList && aList.length) {
                    await g.app.sessionManager.load_session(c1, aList);
                    if (g.app.windowList.length) {
                        c = c1 = g.app.windowList[0].c;
                    } else {
                        c = c1 = undefined;
                    }
                }
            } catch (e) {
                g.es_print('Can not load session');
                g.es_exception(e);
            }
        }

        // Enable redraws.
        g.app.disable_redraw = false;

        const allowNoDocumentStart = true; // ! TODO: FIX THIS EXPERIMENTAL FLAG !

        if (!c1 && !allowNoDocumentStart) {
            // Open or create a workbook.
            try {
                c1 = await lm.openWorkBook();
                // Calls LM.loadLocalFile.
            } catch (exception) {
                g.es_print('Can not create workbook');
                g.es_exception(exception);
            }
        }
        c = c1;
        if (!c && !allowNoDocumentStart) {
            // Leo is out of options: Force an immediate exit.
            return false;
        }
        // #199.
        await g.app.runAlreadyOpenDialog(c1!);

        // Final inits...
        g.app.logInited = true;
        g.app.initComplete = true;

        // c.setLog();
        if (c) {
            c.redraw();
            g.doHook("start2", { c: c, p: c.p, fileName: c.fileName() });
            c.initialFocusHelper();
        }
        return true;
    }

    //@+node:felix.20210120004121.5: *5* LM.openEmptyWorkBook
    /**
     * Open or create a new workbook.
     * 
     * @string default-leo-file gives the path, defaulting to ~/.leo/workbook.leo.
     *
     * Return the new commander.
     */
    public async openWorkBook(): Promise<Commands | undefined> {

        // TODO !
        // void vscode.window.showInformationMessage('TODO : openWorkBook');
        console.log(' TODO openWorkBook ( new outline instead! ) ');
        // ! NEEDED ? --> USE A NEW EMPTY FILE INSTEAD ??

        const lm: LoadManager = this;

        /*
        # Never create a workbook during unit tests or in batch mode.
        if g.unitTesting or g.app.batchMode:
            return None
        fn = self.computeWorkbookFileName()
        exists = fn and os.path.exists(fn)
        if not fn:
            # The usual directory does not exist. Create an empty file.
            c = self.openEmptyLeoFile(gui=g.app.gui, old_c=None)
            c.rootPosition().h = 'Workbook'
        else:
            # Open the workboook or create an empty file.
            c = self.loadLocalFile(fn, gui=g.app.gui, old_c=None)
            if not exists:
                c.rootPosition().h = 'Workbook'
        # Create the outline with workbook's name.
        c.frame.title = title = c.computeWindowTitle()
        c.frame.setTitle(title)
        c.openDirectory = c.frame.openDirectory = g.os_path_dirname(fn)
        if hasattr(c.frame, 'top'):
            c.frame.top.leo_master.setTabName(c, fn)
        # Finish: Do *not* save the file!
        g.chdir(fn)
        g.app.already_open_files = []
        c.clearChanged()
        # Do not redraw. Do not set c.p.
        return c
        */
        const fn: string = '';
        const c = await lm.loadLocalFile(fn, g.app.gui);
        if (!c) {
            return undefined;
        }
        return c;
    }

    //@+node:felix.20210120004121.6: *4* LM.doPrePluginsInit & helpers
    /**
     * Scan options, set directories and read settings.
     */
    public async doPrePluginsInit(): Promise<void> {
        const lm: LoadManager = this;
        await lm.computeStandardDirectories();

        // Scan the command line options as early as possible.
        const options: Record<string, any> = {}; // lm.scanOptions(fileName);
        lm.options = options; // ! no command line options !

        const script: string = options['script'];
        const verbose: boolean = !script;

        // Init the app.
        await lm.initApp();

        await g.app.setGlobalDb();

        if (verbose) {
            lm.reportDirectories();
        }

        // Read settings *after* setting g.app.config and *before* opening plugins.
        // This means if-gui has effect only in per-file settings.
        await lm.readGlobalSettingsFiles();

        // reads only standard settings files, using a null gui.
        // uses lm.files[0] to compute the local directory
        // that might contain myLeoSettings.leo.
        // Read the recent files file.
        const localConfigFile =
            lm.files && lm.files.length ? lm.files[0] : undefined;

        await g.app.recentFilesManager.readRecentFiles(localConfigFile);

        // Create the gui after reading options and settings.
        lm.createGui();
        // We can't print the signon until we know the gui.
        return g.app.computeSignon(); // Set app.signon/signon1 for commanders.
    }

    //@+node:felix.20230529220941.1: *5* LM.createAllImporterData & helpers
    /**
     * New in Leo 5.5:
     *
     * Create global data structures describing importers and writers.
     */
    public createAllImporterData(): void {
        g.assert(g.app.loadDir); // This is the only data required.
        this.createWritersData(); // Was an AtFile method.
        this.createImporterData(); // Was a LeoImportCommands method.
    }
    //@+node:felix.20230529220941.2: *6* LM.createImporterData & helper
    /**
     * Create the data structures describing importer plugins.
     */
    public createImporterData(): void {

        const table: [string, any][] = [
            ["c", importer_c],
            ["coffeescript", importer_coffeescript],
            ["csharp", importer_csharp],
            ["cython", importer_cython],
            ["dart", importer_dart],
            ["elisp", importer_elisp],
            ["html", importer_html],
            ["ini", importer_ini],
            ["java", importer_java],
            ["javascript", importer_javascript],
            ["leo_rst", importer_leo_rst],
            ["lua", importer_lua],
            ["markdown", importer_markdown],
            ["org", importer_org],
            ["otl", importer_otl],
            ["pascal", importer_pascal],
            ["perl", importer_perl],
            ["php", importer_php],
            ["python", importer_python],
            ["rust", importer_rust],
            ["tcl", importer_tcl],
            ["treepad", importer_treepad],
            ["typescript", importer_typescript],
            ["xml", importer_xml],
        ];

        for (const language of table) {
            this.parse_importer_dict(language[0], language[1]);
        }

        // // Allow plugins to be defined in ~/.leo/plugins.
        // for (const pattern of [
        //     // ~/.leo/plugins.
        //     g.finalize_join(g.app.homeDir, '.leo', 'plugins'),
        //     // leo/plugins/importers.
        //     g.finalize_join(g.app.loadDir, '..', 'plugins', 'importers', '*.py'),
        // ]){
        //     filenames = g.glob_glob(pattern)
        //     for filename in filenames:
        //         sfn = g.shortFileName(filename)
        //         if sfn != '__init__.py':
        //             try:
        //                 module_name = sfn[:-3]
        //                 // Important: use importlib to give imported modules their fully qualified names.
        //                 m = importlib.import_module(f"leo.plugins.importers.{module_name}")
        //                 self.parse_importer_dict(sfn, m)
        //                 // print('createImporterData', m.__name__)
        //             except Exception:
        //                 g.warning(f"can not import leo.plugins.importers.{module_name}")
        //                 g.printObj(filenames)

        // }

    }
    //@+node:felix.20230529220941.3: *7* LM.parse_importer_dict
    /**
     *  Set entries in g.app.classDispatchDict, g.app.atAutoDict and
     * g.app.atAutoNames using entries in m.importer_dict.
     */
    public parse_importer_dict(sfn: string, m: any): void {

        const importer_d = m['importer_dict'];

        if (importer_d) {
            const at_auto = importer_d['@auto'] || [];
            const scanner_func = importer_d['func'];
            // scanner_name = scanner_class.__name__
            const extensions = importer_d['extensions'] || [];
            if (at_auto) {
                // Make entries for each @auto type.
                const d = g.app.atAutoDict;
                for (const s of at_auto) {
                    d[s] = scanner_func;
                    g.app.atAutoDict[s] = scanner_func;
                    if (!g.app.atAutoNames.includes(s)) {
                        g.app.atAutoNames.push(s);
                    }
                }
            }

            if (extensions && extensions.length) {
                // Make entries for each extension.
                const d = g.app.classDispatchDict;
                for (const ext of extensions) {
                    d[ext] = scanner_func;  // importer_d.get('func')#scanner_class
                }
            }

        }

        // elif sfn not in (
        //     // These are base classes, not real plugins.
        //     'basescanner.py',
        //     'linescanner.py',
        // ):
        //     g.warning(f"leo/plugins/importers/{sfn} has no importer_dict")

    }
    //@+node:felix.20230529220941.4: *6* LM.createWritersData & helper
    /**
     * Create the data structures describing writer plugins.
     */
    public createWritersData(): void {

        const table: [string, any][] = [
            ['dart', writer_dart],
            ['leo_rst', writer_leo_rst],
            ['markdown', writer_markdown],
            ['org', writer_org],
            ['otl', writer_otl],
            ['treepad', writer_treepad],
        ];

        for (const language of table) {
            this.parse_writer_dict(language[0], language[1]);
        }

        // // Do *not* remove this trace.
        // const trace = false && 'createWritersData' not in g.app.debug_dict
        // if trace
        //     // Suppress multiple traces.
        //     g.app.debug_dict['createWritersData'] = True
        // g.app.writersDispatchDict = {}
        // g.app.atAutoWritersDict = {}

        // // Allow plugins to be defined in ~/.leo/plugins.
        // for pattern in (
        //     g.finalize_join(g.app.homeDir, '.leo', 'plugins'),  // ~/.leo/plugins.
        //     g.finalize_join(g.app.loadDir, '..', 'plugins', 'writers', '*.py'),  // leo/plugins/writers
        // ):
        //     for filename in g.glob_glob(pattern):
        //         sfn = g.shortFileName(filename)
        //         if sfn.endswith('.py') && sfn !== '__init__.py':
        //             try:
        //                 // Important: use importlib to give imported modules their fully qualified names.
        //                 m = importlib.import_module(f"leo.plugins.writers.{sfn[:-3]}")
        //                 self.parse_writer_dict(sfn, m)
        //             except e:
        //                 g.es_exception(e)
        //                 g.warning(f"can not import leo.plugins.writers.{sfn}")
        // if trace:
        //     g.trace('LM.writersDispatchDict')
        //     g.printDict(g.app.writersDispatchDict)
        //     g.trace('LM.atAutoWritersDict')
        //     g.printDict(g.app.atAutoWritersDict)

    }
    //@+node:felix.20230529220941.5: *7* LM.parse_writer_dict
    /**
     * Set entries in g.app.writersDispatchDict and g.app.atAutoWritersDict
     * using entries in m.writers_dict.
     */
    public parse_writer_dict(sfn: string, m: any): void {

        const writer_d = m['writer_dict']; // getattr(m, 'writer_dict', None)

        if (writer_d) {
            const at_auto = writer_d['@auto'] || [];
            const scanner_class = writer_d['class'];
            const extensions: string[] = writer_d['extensions'] || [];

            if (at_auto) {
                // Make entries for each @auto type.
                const d = g.app.atAutoWritersDict;
                for (const s of at_auto) {
                    const aClass = d[s];
                    if (aClass && aClass !== scanner_class) {
                        g.trace(`${sfn}: duplicate ${s} class`);
                    } else {
                        d[s] = scanner_class;
                        if (!g.app.atAutoNames.includes(s)) {

                            g.app.atAutoNames.push(s);
                        }
                    }
                }
            }

            if (extensions && extensions.length) {
                // Make entries for each extension.
                const d = g.app.writersDispatchDict;
                for (const ext of extensions) {
                    const aClass = d[ext];
                    if (aClass && aClass !== scanner_class) {
                        g.trace(`${sfn}: duplicate ${ext} class`);
                    } else {
                        d[ext] = scanner_class;
                    }
                }
            }

        }

        // elif sfn not in ('basewriter.py',):
        //     g.warning(f"leo/plugins/writers/{sfn} has no writer_dict")

    }

    //@+node:felix.20220417225955.1: *5* LM.createGui
    public createGui(): void {

        const lm: LoadManager = this;

        g.app.gui = new LeoUI(undefined, this._context!); // replaces createDefaultGui

        /* 
        gui_option = lm.options.get('gui')
        windowFlag = lm.options.get('windowFlag')
        script = lm.options.get('script')
        if g.app.gui:
            if g.app.gui == g.app.nullGui:
                g.app.gui = None  # Enable g.app.createDefaultGui
                g.app.createDefaultGui(__file__)
            else:
                pass
                # This can also happen when leoID does not exist.
        elif gui_option is None:
            if script and not windowFlag:
                # Always use null gui for scripts.
                g.app.createNullGuiWithScript(script)
            else:
                g.app.createDefaultGui(__file__)
        else:
            lm.createSpecialGui(gui_option, pymacs, script, windowFlag)

        */

    }

    //@+node:felix.20210120004121.16: *5* LM.initApp
    public async initApp(verbose?: boolean): Promise<unknown> {
        // Can be done early. Uses only g.app.loadDir & g.app.homeDir.
        this.createAllImporterData();
        g.assert(g.app.loadManager);
        // Make sure we call the new leoPlugins.init top-level function.
        leoPlugins.init();
        // Force the user to set g.app.leoID.
        await g.app.setLeoID(true, verbose);
        // w_leoID will at least be 'None'.
        g.app.idleTimeManager = new IdleTimeManager();
        // g.app.backgroundProcessManager = new leoBackground.BackgroundProcessManager();
        g.app.externalFilesController = new ExternalFilesController();

        g.app.recentFilesManager = new RecentFilesManager(); // ! HANDLED with vscode workspace recent files

        g.app.config = new GlobalConfigManager();
        g.app.nodeIndices = new NodeIndices(g.app.leoID);

        g.app.sessionManager = new SessionManager(); // ! HANDLED with vscode workspace recent files

        // TODO: plugins system ?
        // Complete the plugins class last.
        // g.app.pluginsController.finishCreate();

        return;
    }

    //@+node:felix.20210120004121.31: *4* LM.loadLocalFile & helpers
    public async loadLocalFile(
        fn: string,
        gui?: LeoGui,
        old_c?: Commands,
        skipSaveSession?: boolean
    ): Promise<Commands | undefined> {
        /*
            Completely read a file, creating the corresponding outline.

            1. If fn is an existing .leo file (possibly zipped), read it twice:
            the first time with a NullGui to discover settings,
            the second time with the requested gui to create the outline.

            2. If fn is an external file:
            get settings from the leoSettings.leo and myLeoSetting.leo, then
            create a "wrapper" outline containing an @file node for the external file.

            3. If fn is empty:
            get settings from the leoSettings.leo and myLeoSetting.leo or default settings,
            or open an empty outline.
        */

        fn = g.os_path_fix_drive(fn); // EMULATE PYTHON WITH CAPITAL DRIVE LETTERS
        fn = g.os_path_normslashes(fn);

        const lm: LoadManager = this;
        let c: Commands | undefined;

        // #2489: If fn is empty, open an empty, untitled .leo file.
        if (!fn) {
            c = await lm.openEmptyLeoFile(gui, old_c);
            return c;
        }

        // Step 0: Return if the file is already open.
        // fn = g.finalize(fn);

        if (fn) {
            c = lm.findOpenFile(fn);
            if (c) {
                return c; // Found it aready opened !
            }
        }
        // Step 1: get the previous settings.
        // For .leo files (and zipped .leo files) this pre-reads the file in a null gui.
        // Otherwise, get settings from leoSettings.leo, myLeoSettings.leo, or default settings.
        const previousSettings: PreviousSettings = await lm.getPreviousSettings(
            fn
        );

        // Step 2: open the outline in the requested gui.
        // For .leo files (and zipped .leo file) this opens the file a second time.
        c = await lm.openFileByName(fn, gui, old_c, previousSettings);

        if (!skipSaveSession) {
            await g.app.saveSession(); // IN LEOJS: Save sessions here to skip saving session on program exit.
        }

        return c;
    }
    //@+node:felix.20220418012120.1: *5* LM.openEmptyLeoFile
    /**
     * Open an empty, untitled, new Leo file.
     */
    public async openEmptyLeoFile(
        gui?: LeoGui,
        old_c?: Commands
    ): Promise<Commands> {
        const lm = this;
        const w_previousSettings = await lm.getPreviousSettings(undefined);
        // Create the commander for the .leo  file.
        const c: Commands = g.app.newCommander('', gui, w_previousSettings);

        // ! LEOJS : SET c.openDirectory to the g.vscodeWorkspaceUri !
        // c.openDirectory = g.vscodeWorkspaceUri?.fsPath;
        // if (c.openDirectory) {
        //     c.frame.openDirectory = c.openDirectory;
        // }

        g.doHook('open0');

        g.doHook('open1', {
            old_c: old_c,
            c: c,
            new_c: c,
            fileName: undefined,
        });

        c.mFileName = '';
        c.wrappedFileName = undefined;

        // Late inits. Order matters.
        if (c.config.getBool('use-chapters') && c.chapterController) {
            c.chapterController.finishCreate();
        }
        c.clearChanged();
        g.doHook('open2', {
            old_c: old_c,
            c: c,
            new_c: c,
            fileName: undefined,
        });

        // TODO USE ORIGINAL MECHANICS!
        // ! mod_scripting ORIGINALLY INIT ON open2 or new HOOK IN LEO !
        c.theScriptingController = new ScriptingController(c);
        await c.theScriptingController.createAllButtons();

        g.doHook('new', { old_c: old_c, c: c, new_c: c });

        lm.finishOpen(c);

        return c;
    }

    //@+node:felix.20210120004121.32: *5* LM.openFileByName & helpers
    /**
     *  Create an outline (Commander) for either:
     *  - a Leo file (including .leo or zipped file),
     *  - an external file.
     *
     *  Note: The settings don't matter for pre-reads!
     *  For second read, the settings for the file are *exactly* previousSettings.
     */
    public async openFileByName(
        fn: string,
        gui?: LeoGui,
        old_c?: Commands,
        previousSettings?: PreviousSettings
    ): Promise<Commands | undefined> {
        const lm: LoadManager = this;
        if (!fn) {
            return undefined;  // Should not happen.
        }
        // Disable the log.
        // g.app.setLog(None)
        // g.app.lockLog()

        // Create the a commander for the .leo file.
        let c = g.app.newCommander(fn, gui, previousSettings);

        g.doHook('open0');

        // Do common completion tasks.
        const complete_inits = (c: Commands) => {
            // g.app.unlockLog()
            // c.frame.log.enable(True)
            // g.app.writeWaitingLog(c);
            // c.setLog()
            lm.createMenu(c, fn);
            lm.finishOpen(c);
        };

        if (!lm.isLeoFile(fn)) {
            // Handle a wrapper file.
            c = await lm.initWrapperLeoFile(c, fn); // #2489
            // Finish.
            g.doHook("new", { old_c: old_c, c: c, new_c: c });  // #2489.
            g.doHook("open2", { old_c: old_c, c: c, new_c: c, fileName: fn });
            // ! mod_scripting ORIGINALLY INIT ON open2 or new HOOK IN LEO !
            c.theScriptingController = new ScriptingController(c);
            await c.theScriptingController.createAllButtons();

            complete_inits(c);
            return c;
        }
        // Read the outline, but only if it exists.
        if (await g.os_path_exists(fn)) {
            const v = await c.fileCommands.getAnyLeoFileByName(fn, !!previousSettings);
            if (!v) {
                return undefined;
            }
        }
        // Finish.
        g.doHook("open1", { old_c: undefined, c: c, new_c: c, fileName: fn });
        g.doHook("open2", { old_c: old_c, c: c, new_c: c, fileName: fn });
        // ! mod_scripting ORIGINALLY INIT ON open2 or new HOOK IN LEO !
        c.theScriptingController = new ScriptingController(c);
        await c.theScriptingController.createAllButtons();

        complete_inits(c);
        // ! IN LEOJS : make sure .leoRecentFiles.txt is written on open and save file instead.
        if (g.app.recentFilesManager) {
            const oldFiles = JSON.stringify(g.app.recentFilesManager.recentFiles);
            g.app.recentFilesManager.updateRecentFiles(fn);
            const newFiles = JSON.stringify(g.app.recentFilesManager.recentFiles);
            if (newFiles !== oldFiles) {
                await g.app.recentFilesManager.writeRecentFilesFile(c);
            }
        }
        return c;

    }

    //@+node:felix.20240105002740.1: *6* LM.createMenu
    public createMenu(c: Commands, fn?: string): void {
        // lm = self
        // Create the menu as late as possible so it can use user commands.
        if (!g.doHook("menu1", { c: c, p: c.p, v: c.p })) {
            // c.frame.menu.createMenuBar(c.frame); // LEOJS : NOT USED
            // g.app.recentFilesManager.updateRecentFiles(fn);
            g.doHook("menu2", { c: c, p: c.p, v: c.p });
            g.doHook("after-create-leo-frame", { c: c });
            g.doHook("after-create-leo-frame2", { c: c });
            // Fix bug 844953: tell Unity which menu to use.
            // c.enableMenuBar()
        }
    }
    //@+node:felix.20210124192005.1: *6* LM.findOpenFile
    /**
     * Returns the commander of already opened Leo file
     * returns undefined otherwise
     */
    public findOpenFile(fn: string): Commands | undefined {
        function munge(name: string): string {
            return g.os_path_normpath(name || '').toLowerCase();
        }

        let index = 0;
        for (let frame of g.app.windowList) {
            const c = frame.c;
            if (
                g.os_path_realpath(munge(fn)) ===
                g.os_path_realpath(munge(c.mFileName))
            ) {
                g.app.gui.frameIndex = index;

                c.outerUpdate();
                return c;
            }

            index++;
        }
        return undefined;
    }

    //@+node:felix.20220418013716.1: *6* LM.finishOpen
    public finishOpen(c: Commands): void {
        // lm = self
        // const k = c.k;
        // g.assert(k);

        // New in Leo 4.6: provide an official way for very late initialization.
        // c.frame.tree.initAfterLoad();
        // c.initAfterLoad();

        // chapterController.finishCreate must be called after the first real redraw
        // because it requires a valid value for c.rootPosition().
        if (c.chapterController) {
            c.chapterController.finishCreate();
        }
        // if (k && k.setDefaultInputState) {
        //     k.setDefaultInputState();
        // }

        // if (k) {
        //     k.showStateAndMode();
        // }

        // c.frame.initCompleteHint();
        const index = g.app.windowList.indexOf(c.frame);
        if (index >= 0) {
            g.app.gui.frameIndex = index;
        }

        c.outerUpdate(); // #181: Honor focus requests.
        c.initialFocusHelper();
    }
    //@+node:felix.20210222013344.1: *6* LM.initWrapperLeoFile
    /**
     * Create an empty file if the external fn is empty.
     *
     * Otherwise, create an @edit or @file node for the external file.
     */
    public async initWrapperLeoFile(
        c: Commands,
        fn: string
    ): Promise<Commands> {
        let p: Position | undefined;

        const exists = await g.os_path_exists(fn);

        if (!exists) {
            p = c.rootPosition()!;
            // Create an empty @edit node unless fn is an .leo file.
            // Fix #1070: Use "newHeadline", not fn.
            p.h = fn.endsWith('.leo') ? 'newHeadline' : `@edit ${fn}`;
            c.selectPosition(p);

            // TODO: importCommands and importDerivedFiles method !

            /* 

            }else if( c.looksLikeDerivedFile(fn)){
                // 2011/10/10: Create an @file node.
                p = await c.importCommands.importDerivedFiles(parent=c.rootPosition(),
                    paths=[fn], command=undefined);  // Not undoable.
                if p && p.hasBack()
                    p.back().doDelete();
                    p = c.rootPosition();
                if !p
                    return undefined;

            */
        } else {
            // Create an @<file> node.
            p = c.rootPosition();
            if (p && p.__bool__()) {
                const load_type = this.options['load_type'];
                p.setHeadString(`${load_type} ${fn}`);
                await c.refreshFromDisk();
                c.selectPosition(p);
            }
        }
        // Fix critical bug 1184855: data loss with command line 'leo somefile.ext'
        // Fix smallish bug 1226816 Command line "leo xxx.leo" creates file xxx.leo.leo.
        c.mFileName = fn.endsWith('.leo') ? fn : `${fn}.leo`;
        c.wrappedFileName = fn;
        c.frame.title = c.computeWindowTitle();

        // chapterController.finishCreate must be called after the first real redraw
        // because it requires a valid value for c.rootPosition().

        if (c.config.getBool('use-chapters') && c.chapterController) {
            c.chapterController.finishCreate();
        }

        return c;
    }

    //@+node:felix.20220109233448.1: *6* LM.isLeoFile & LM.isZippedFile
    public isLeoFile(fn: string): boolean {
        if (!fn) {
            return false;
        }
        // console.log('TODO: isZippedFile');
        // return zipfile.is_zipfile(fn) or fn.endswith(('.leo', 'db', '.leojs'))
        return (
            fn.endsWith('.leo') || fn.endsWith('db') || fn.endsWith('.leojs')
        );
    }
    public isZippedFile(fn: string): boolean {

        // TODO : zip support ?

        console.log('TODO: isZippedFile');

        return false;
        /*
        try {
            const buffer = Buffer.alloc(4);
            const fd = fs.openSync(filePath, 'r');
            
            // Read the first 4 bytes of the file
            fs.readSync(fd, buffer, 0, 4, 0);
            fs.closeSync(fd);

            // Check if the first 4 bytes match the ZIP file signature
            const zipSignature = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
            for (let i = 0; i < 4; i++) {
                if (buffer[i] !== zipSignature[i]) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            return false;
        }
        */
        // return fn && zipfile.is_zipfile(fn);
    }
    //@+node:felix.20220109232545.1: *3* LM.revertCommander
    /**
     * Revert c to the previously saved contents.
     */
    public async revertCommander(c: Commands): Promise<void> {
        const lm: LoadManager = this;
        const fc = c.fileCommands;
        const fn: string = c.mFileName;
        if (!fn) {
            return;
        }
        const exists = await g.os_path_exists(fn);
        if (!exists) {
            return;
        }
        if (!lm.isLeoFile(fn)) {
            return;
        }
        // Re-read the file.
        c.fileCommands.initIvars();
        try {
            g.app.reverting = true;
            // await c.fileCommands.getLeoFile(undefined, fn, undefined, undefined, false);
            const v = await fc.getAnyLeoFileByName(fn, true);
            // Report failure.
            if (!v) {
                g.error(`Revert failed: ${fn}`);
            }
            // #3596: Redo all buttons.
            const sc = c.theScriptingController;
            if (sc) {
                await sc.createAllButtons();
            }
            if (!g.unitTesting) {
                g.es_print(`Reverted ${c.fileName()}`);
            }
        } catch {
            // Does not exist !
        } finally {
            g.app.reverting = false;
        }
    }
    //@-others
}
//@+node:felix.20220418172358.1: ** class PreviousSettings
/**
 * A class holding the settings and shortcuts dictionaries
 * that are computed in the first pass when loading local
 * files and passed to the second pass.
 */
export class PreviousSettings {
    public settingsDict: g.SettingsDict | undefined;
    public shortcutsDict: g.SettingsDict | undefined;

    constructor(
        settingsDict: g.SettingsDict | undefined,
        shortcutsDict: g.SettingsDict | undefined
    ) {
        if (!shortcutsDict || !settingsDict) {
            // #1766: unit tests.
            const lm = g.app.loadManager!;
            [settingsDict, shortcutsDict] = lm.createDefaultSettingsDicts();
        }
        this.settingsDict = settingsDict;
        this.shortcutsDict = shortcutsDict;
    }

    // = () : trick for toString as per https://stackoverflow.com/a/35361695/920301
    public toString = (): string => {
        return (
            `<PreviousSettings\n` +
            `${this.settingsDict}\n` +
            `${this.shortcutsDict}\n>`
        );
    };
}
//@+node:felix.20230923185723.1: ** class RecentFilesManager
/** 
 * A class to manipulate leoRecentFiles.txt.
 */
export class RecentFilesManager {

    public edit_headline = 'Recent files. Do not change this headline!';
    public groupedMenus: any[] = [];  // Set in rf.createRecentFilesMenuItems.
    public recentFiles: string[] = []; // List of g.Bunches describing .leoRecentFiles.txt files.
    public recentFilesMenuName = 'Recent Files';  // May be changed later.
    public recentFileMessageWritten = false;  // To suppress all but the first message.
    public write_recent_files_as_needed = false;  // Will be set later.

    //@+others
    //@+node:felix.20230923185723.2: *3* rf.appendToRecentFiles
    public appendToRecentFiles(files: string[]): void {
        const rf = this;
        files = files.map((theFile: string) => theFile.trim());

        function munge(name: string): string {
            return g.os_path_normpath(name || '').toLowerCase();
        }

        for (const name of files) {
            // Remove all variants of name.
            for (const name2 of [...rf.recentFiles]) {
                if (munge(name) === munge(name2)) {
                    rf.recentFiles.splice(rf.recentFiles.indexOf(name2), 1);
                }
            }
            rf.recentFiles.push(name);
        }

    }
    //@+node:felix.20230923185723.3: *3* rf.cleanRecentFiles
    /**
     * Remove items from the recent files list that no longer exist.
     *
     * This almost never does anything because Leo's startup logic removes
     * nonexistent files from the recent files list.
     */
    public async cleanRecentFiles(c: Commands): Promise<void> {

        // Filtering recent files to remove nonexistent ones...w
        const result = await Promise.all(
            this.recentFiles.map(async (z: string) => {
                if (await g.os_path_exists(z)) {
                    return z;
                }
                return null;
            })
        );

        // Checking if the result differs from the original recent files...
        if (result.some((path) => path == null)) {
            for (const w_path of result) {
                if (w_path !== null) {
                    this.updateRecentFiles(w_path);
                }
            }
            await this.writeRecentFilesFile(c);
        }

    }
    //@+node:felix.20230923185723.4: *3* rf.demangleRecentFiles
    /**
     * Rewrite recent files based on c.config.getData('path-demangle')
     */
    public async demangleRecentFiles(c: Commands, data: string[]): Promise<void> {

        const changes: [string, string][] = [];
        let replace: string | null = null;

        for (const line of data) {
            const text: string = line.trim();

            if (text.startsWith('REPLACE: ')) {
                const firstSpaceIndex = text.indexOf(' ');
                const secondPart = firstSpaceIndex !== -1 ? text.slice(firstSpaceIndex + 1) : '';
                replace = secondPart.trim();
            }

            if (text.startsWith('WITH:') && replace !== null) {
                const with_ = text.substr(5).trim();
                changes.push([replace, with_]);
                g.es(`${replace} -> ${with_}`);
            }
        }

        const orig: string[] = this.recentFiles.filter((z: string) => z.startsWith('/'));
        this.recentFiles = [];

        for (const i of orig) {
            let t: string = i;

            for (const change of changes) {
                t = t.split(change[0]).join(change[1]);
            }

            this.updateRecentFiles(t);
        }

        await this.writeRecentFilesFile(c);
    }
    //@+node:felix.20230923185723.5: *3* rf.clearRecentFiles
    /**
     * Clear the recent files list, then add the present file.
     */
    public async clearRecentFiles(c: Commands): Promise<void> {

        let rf: this = this;
        // let menu: Menu = c.frame.menu;
        // let u: Undoer = c.undoer;
        // let bunch: any = u.beforeClearRecentFiles();
        // let recentFilesMenu: Menu = menu.getMenu(this.recentFilesMenuName);

        /* Clear the recent files menu items... */
        // menu.deleteRecentFilesMenuItems(recentFilesMenu);

        /* Add the present file to recent files... */
        rf.recentFiles = [];
        const filename = c.fileName();
        if (filename) {
            rf.recentFiles.push(filename);
        }

        /* Create recent files menu items for all open windows... */
        // for (const frame of g.app.windowList) {
        //     rf.createRecentFilesMenuItems(frame.c);
        // }

        /* Finalize clearing recent files... */
        // u.afterClearRecentFiles(bunch);

        /* Write the file immediately... */
        await rf.writeRecentFilesFile(c);

        /* Clearing recent files completed. Terminating protocol... */
        /* Recent files purged. Commencing data write... */
    }
    //@+node:felix.20230923185723.6: *3* rf.createRecentFilesMenuItems
    public createRecentFilesMenuItems(c: Commands): void {
        // rf = self
        // menu = c.frame.menu
        // recentFilesMenu = menu.getMenu(self.recentFilesMenuName)
        // if not recentFilesMenu:
        //     return
        // # Delete all previous entries.
        // menu.deleteRecentFilesMenuItems(recentFilesMenu)
        // # Create the permanent (static) menu entries.
        // table = rf.getRecentFilesTable()
        // menu.createMenuEntries(recentFilesMenu, table)
        // # Create all the other entries (a maximum of 36).
        // accel_ch = string.digits + string.ascii_uppercase  # Not a unicode problem.
        // i = 0
        // n = len(accel_ch)
        // # see if we're grouping when files occur in more than one place
        // rf_group = c.config.getBool("recent-files-group")
        // rf_always = c.config.getBool("recent-files-group-always")
        // groupedEntries = rf_group or rf_always
        // if groupedEntries:  # if so, make dict of groups
        //     dirCount: dict[str, Any] = {}
        //     for fileName in rf.getRecentFiles()[:n]:
        //         dirName, baseName = g.os_path_split(fileName)
        //         if baseName not in dirCount:
        //             dirCount[baseName] = {'dirs': [], 'entry': None}
        //         dirCount[baseName]['dirs'].append(dirName)
        // for name in rf.getRecentFiles()[:n]:
        //     # pylint: disable=cell-var-from-loop
        //     if name.strip() == "":
        //         continue  # happens with empty list/new file

        //     def recentFilesCallback(event: Event = None, c: Cmdr = c, name: str = name) -> None:
        //         c.openRecentFile(fn=name)

        //     if groupedEntries:
        //         dirName, baseName = g.os_path_split(name)
        //         entry = dirCount[baseName]
        //         if len(entry['dirs']) > 1 or rf_always:  # sub menus
        //             if entry['entry'] is None:
        //                 entry['entry'] = menu.createNewMenu(baseName, "Recent Files...")
        //                 # acts as a flag for the need to create the menu
        //             c.add_command(menu.getMenu(baseName), label=dirName,
        //                 command=recentFilesCallback, underline=0)
        //         else:  # single occurrence, no submenu
        //             c.add_command(recentFilesMenu, label=baseName,
        //                 command=recentFilesCallback, underline=0)
        //     else:  # original behavior
        //         label = f"{accel_ch[i]} {c.computeWindowTitle()}"
        //         c.add_command(recentFilesMenu, label=label,
        //             command=recentFilesCallback, underline=0)
        //     i += 1
        // if groupedEntries:  # store so we can delete them later
        //     rf.groupedMenus = [z for z in dirCount
        //         if dirCount[z]['entry'] is not None]
    }
    //@+node:felix.20230923185723.7: *3* rf.editRecentFiles
    public editRecentFiles(c: Commands): void {
        let rf: this = this;
        let p1: any = c.lastTopLevel().insertAfter();
        p1.h = this.edit_headline;
        p1.b = rf.recentFiles.join('\n');

        c.redraw();

        c.selectPosition(p1);

        c.redraw();

        c.bodyWantsFocusNow();

        g.es('edit list and run write-edited-recent-files to save recentFiles');
    }
    //@+node:felix.20230923185723.8: *3* rf.getRecentFiles
    async getRecentFiles(): Promise<string[]> {
        /* Initializing protocol for retrieving recent files... */
        const validFiles: string[] = [];

        for (const z of this.recentFiles) {
            if (await g.os_path_exists(z)) {
                validFiles.push(z);
            }
        }

        this.recentFiles = validFiles;
        return this.recentFiles;

    }
    //@+node:felix.20230923185723.9: *3* rf.getRecentFilesTable
    public getRecentFilesTable(): any {
        return [
            "*clear-recent-files",
            "*clean-recent-files",
            "*demangle-recent-files",
            "*sort-recent-files",
            ["-", undefined, undefined],
        ];
    }
    //@+node:felix.20230923185723.10: *3* rf.readRecentFiles & helpers
    /**
     * Read all .leoRecentFiles.txt files.
     */
    public async readRecentFiles(localConfigFile?: string): Promise<void> {
        // The order of files in this list affects the order of the recent files list.
        const rf = this;
        const seen: string[] = [];
        const localConfigPath: string = g.os_path_dirname(localConfigFile);
        for (const w_path of [g.app.homeLeoDir, g.app.globalConfigDir, localConfigPath]) {
            let realPath = w_path;
            if (w_path) {
                realPath = g.os_path_realpath(g.finalize(w_path));
            }
            if (realPath && !seen.includes(realPath)) {
                const ok = await rf.readRecentFilesFile(realPath);
                if (ok) {
                    seen.push(realPath);
                }
            }
        }
        if (seen.length === 0 && rf.write_recent_files_as_needed) {
            await rf.createRecentFiles();
        }
    }
    //@+node:felix.20230923185723.11: *4* rf.createRecentFiles
    /**
     * Try to create .leoRecentFiles.txt, in the users home directory,
     * or in Leo's config directory if that fails.
     */
    public async createRecentFiles(): Promise<void> {

        for (const theDir of [g.app.homeLeoDir, g.app.globalConfigDir]) {
            if (theDir) {
                const fn = g.os_path_join(theDir, '.leoRecentFiles.txt');
                try {
                    const w_uri = g.makeVscodeUri(fn);
                    const writeData = Buffer.from('', 'utf8');
                    await vscode.workspace.fs.writeFile(w_uri, writeData);
                    g.es('created', fn);
                    return;
                } catch (err) {
                    g.error('can not create', fn);
                    g.es_exception(err);
                }
            }
        }
    }
    //@+node:felix.20230923185723.12: *4* rf.readRecentFilesFile
    public async readRecentFilesFile(path: string): Promise<boolean> {
        const fileName = g.os_path_join(path, '.leoRecentFiles.txt');
        let lines: string[] | undefined;

        try {
            let fileContents;

            if (g.isBrowserRepo()) {
                // * Web
                fileContents = await g.extensionContext.workspaceState.get(fileName);
            } else {
                const exists = await g.os_path_exists(fileName);
                if (!exists) {
                    return false;
                }
                // * Desktop
                fileContents = await g.readFileIntoUnicodeString(fileName);
                if (!fileContents) {
                    fileContents = "";
                }
            }

            try {
                lines = fileContents?.split('\n');
            } catch (err) {
                lines = undefined;
            }
        } catch (err) {
            g.trace('can not open', fileName);
            return false;
        }
        if (lines && lines.length && this.sanitize(lines[0]) === 'readonly') {
            lines = lines.slice(1);
        }
        if (lines && lines.length) {
            lines = lines.map(line => g.toUnicode(g.os_path_normpath(line)));
            this.appendToRecentFiles(lines);
        }

        return true;
    }
    //@+node:felix.20230923185723.13: *3* rf.sanitize
    /**
     * Return a sanitized file name.
     */
    public sanitize(p_name?: string): string | undefined {
        if (p_name == null) {
            return undefined;
        }
        p_name = p_name.toLowerCase();
        for (const ch of ['-', '_', ' ', '\n']) {
            const regex = new RegExp(ch, 'g');
            p_name = p_name.replace(regex, '');
        }
        return p_name || undefined;
    }
    //@+node:felix.20230923185723.14: *3* rf.setRecentFiles
    /**
     * Update the recent files list.
     */
    public setRecentFiles(files: string[]): void {
        const rf = this;
        rf.appendToRecentFiles(files);
    }
    //@+node:felix.20230923185723.15: *3* rf.sortRecentFiles
    /**
     * Sort the recent files list.
     */
    public async sortRecentFiles(c: Commands): Promise<void> {

        const rf = this;

        const key = (path: string): string => {
            // Sort only the base name. That's what will appear in the menu.
            const s = g.os_path_basename(path);
            return g.isWindows ? s.toLowerCase() : s;
        };

        const aList = rf.recentFiles.sort((a, b) => key(a).localeCompare(key(b)));
        rf.recentFiles = [];
        for (const z of aList.reverse()) {
            rf.updateRecentFiles(z);
        }
        await rf.writeRecentFilesFile(c);
    }
    //@+node:felix.20230923185723.16: *3* rf.updateRecentFiles
    /**
     * Create the RecentFiles menu. May be called with Null fileName.
     */
    public updateRecentFiles(fileName?: string): void {

        const rf = this;
        if (g.unitTesting) {
            return;
        }

        const munge = (name: string | null): string => {
            return g.finalize(name || '').toLowerCase();
        };

        const munge2 = (name: string | null): string => {
            return g.finalize_join(g.app.loadDir!, name || '');
        };

        // Update the recent files list in all windows.
        if (fileName) {
            for (const frame of g.app.windowList) {
                // Remove all versions of the file name.
                for (const name of rf.recentFiles) {
                    if (
                        munge(fileName) === munge(name) ||
                        munge2(fileName) === munge2(name)
                    ) {
                        const index = rf.recentFiles.indexOf(name);
                        if (index > -1) {
                            rf.recentFiles.splice(index, 1);
                        }
                    }
                }
                rf.recentFiles.unshift(fileName);
                // Recreate the Recent Files menu.
                rf.createRecentFilesMenuItems(frame.c);
            }
        } else {
            for (const frame of g.app.windowList) {
                rf.createRecentFilesMenuItems(frame.c);
            }
        }

    }
    //@+node:felix.20230923185723.17: *3* rf.writeEditedRecentFiles
    /**
     * Write content of "edit_headline" node as recentFiles and recreates menus.
     */
    async writeEditedRecentFiles(c: Commands): Promise<void> {
        const rf = this;
        let p = g.findNodeAnywhere(c, rf.edit_headline);

        if (p && p.__bool__()) {
            const files: string[] = [];
            for (const z of p.b.split(/\r?\n/)) {
                if (z && await g.os_path_exists(z)) {
                    files.push(z);
                }
            }
            rf.recentFiles = files;
            await rf.writeRecentFilesFile(c);
            rf.updateRecentFiles();
            c.selectPosition(p);
            c.deleteOutline();
        } else {
            g.red('not found:', rf.edit_headline);
        }
    }
    //@+node:felix.20230923185723.18: *3* rf.writeRecentFilesFile & helper
    /**
     * Write the appropriate .leoRecentFiles.txt file.
     */
    public async writeRecentFilesFile(c: Commands): Promise<void> {

        // LeoJS tries to save the recent files list on open, so skip if starting up.
        if (!g.app.initComplete) {
            return;
        }

        const tag = '.leoRecentFiles.txt';
        const rf = this;
        if (g.unitTesting || g.app.inBridge) {
            return;
        }

        const localFileName = c.fileName();
        let localPath: string | null = null;
        if (localFileName) {
            localPath = g.os_path_split(localFileName)[0];
        }

        let written = false;
        const seen: string[] = [];

        for (const w_path of [localPath, g.app.globalConfigDir, g.app.homeLeoDir]) {
            if (w_path) {
                const fileName = g.os_path_join(w_path, tag);
                const w_exists = await g.os_path_exists(fileName);
                if (w_exists && !seen.includes(fileName.toLowerCase())) {
                    seen.push(fileName.toLowerCase());
                    // Only write if different
                    let fileContents;

                    if (g.isBrowserRepo()) {
                        // * Web
                        fileContents = await g.extensionContext.workspaceState.get(fileName);
                    } else {
                        // * Desktop
                        fileContents = await g.readFileIntoUnicodeString(fileName);
                        if (!fileContents) {
                            fileContents = "";
                        }
                    }
                    const s = this.recentFiles.length ? this.recentFiles.join('\n') : '\n';
                    if (s === fileContents) {
                        return; // Exactly the same.
                    }
                    const ok = await rf.writeRecentFilesFileHelper(fileName);
                    if (ok) {
                        written = true;
                    }
                    if (!rf.recentFileMessageWritten && !g.unitTesting && !g.app.silentMode) {
                        if (ok) {
                            g.es_print(`wrote recent file: ${fileName}`);
                        } else {
                            g.error(`failed to write recent file: ${fileName}`);
                        }
                    }
                }
            }
        }

        if (written) {
            rf.recentFileMessageWritten = true;
        } else {
            if (g.isBrowserRepo()) {
                // * Web
                await this.writeRecentFilesFileHelper(tag);
            } else {
                // * Desktop
                // Attempt to create .leoRecentFiles.txt in the user's home directory.
                if (g.app.homeLeoDir) {
                    const fileName = g.finalize_join(g.app.homeLeoDir, tag);
                    if (!(await g.os_path_exists(fileName))) {
                        g.red(`creating: ${fileName}`);
                    }
                    await rf.writeRecentFilesFileHelper(fileName);
                }
            }
        }
    }
    //@+node:felix.20230923185723.19: *4* rf.writeRecentFilesFileHelper
    /**
     * Don't update the file if it begins with read-only.
     */
    public async writeRecentFilesFileHelper(fileName: string): Promise<boolean> {

        const s = this.recentFiles.length ? this.recentFiles.join('\n') : '\n';

        if (g.isBrowserRepo()) {
            await g.extensionContext.workspaceState.update(fileName, s);
            return true;
        }

        let lines: string[] | undefined = undefined;

        // Part 1: Return False if the first line is "readonly".
        if (await g.os_path_exists(fileName)) {
            try {
                const data = await g.readFileIntoUnicodeString(fileName);
                lines = data?.split('\n');
            } catch (error) {
                lines = undefined;
            }

            if (lines && lines.length && this.sanitize(lines[0]) === 'readonly') {
                return false;
            }
        }

        // Part 2: write the files.
        try {
            await g.writeFile(g.toUnicode(s), 'utf-8', fileName);
            return true;
        } catch (error) {
            if (error) {
                g.error('error writing', fileName);
                g.es_exception(error);
                if (g.unitTesting) {
                    throw error;
                }
            }
            return false;
        }
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
